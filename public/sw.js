// ─── Maloja Plana — Service Worker ───────────────────────
// Phase 1: Offline cache + push notification scaffold.
// No external services. Local-first. Privacy-first.
//
// Future phases:
// - Push notification handling (requires user opt-in)
// - Background sync for reminders
// - Offline document access

// CACHE_NAME trägt den Bundle-Hash: beim Build ersetzt das Vite-Plugin
// (vite.config.js) '__BUILD_HASH__' durch den Hash des Entry-Bundles. Ändert sich
// der Entry-Bundle-Hash (der Normalfall, sobald sich der App-Code ändert), ändern
// sich auch die sw.js-Bytes → der Browser erkennt das SW-Update → activate räumt
// den alten Cache. ACHTUNG: Deploys, die NUR public/-Dateien oder einen einzelnen
// Lazy-Chunk anfassen, lassen den Entry-Hash u. U. unverändert → dann wird kein
// SW-Update erkannt. Online unkritisch, weil die App-Shell ('/') network-first
// geladen wird; relevant nur für Offline-Nutzung/Cache-Aufräumen. Im Dev-Modus
// bleibt der Platzhalter stehen (harmlos, wird nie deployt).
const CACHE_NAME = 'maloja-plana-__BUILD_HASH__';
const OFFLINE_URL = '/';
// K59: Module und Schriften fragt der Browser mit `Origin` an; ein Server mit
// `Vary: Origin` (z. B. vite preview) liesse den Cache sonst ins Leere greifen.
// Unbedenklich: die Dateien sind nach Inhalt benannt bzw. nur von hier.
const TREFFER = { ignoreVary: true };

// K59 (gemessen 17.09.2026): Beim ersten Besuch lädt der Browser Haupt-Skript,
// Stylesheet und Sprachdatei, BEVOR dieser Service Worker die Seite kontrolliert —
// sie landeten nie im Cache, und offline blieb die Seite leer. Darum:
// (1) beim Install die Dateien mitnehmen, die die Startseite selbst einbindet;
// (2) die Seite meldet nach der Anmeldung, was sie schon geladen hat (message).
// Nur eigene Dateien unter /assets/ — nie fremde Adressen.
const alsEigeneAssetAdresse = (adresse) => {
  try {
    const url = new URL(adresse, self.location.origin);
    if (url.origin !== self.location.origin || !url.pathname.startsWith('/assets/')) return null;
    return url.pathname;
  } catch (e) {
    return null;
  }
};

const assetsAusHtml = (html) => {
  const gefunden = new Set();
  for (const treffer of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const pfad = alsEigeneAssetAdresse(treffer[1]);
    if (pfad) gefunden.add(pfad);
  }
  return [...gefunden];
};

const einzelnAblegen = (cache, adressen) =>
  // Jede Datei einzeln (allSettled): eine fehlende oder umbenannte Datei darf den
  // Install nie abbrechen und damit den Offline-Cache verhindern.
  Promise.allSettled(adressen.map((url) => cache.add(url)));

// ─── Install: cache the app shell ──────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await einzelnAblegen(cache, [
        // Synchron im <head> geladen (K4): offline ohne Cache fiele der Abruf sonst auf
        // OFFLINE_URL zurück — HTML statt Skript.
        '/theme-init.js',
        '/fonts/lexend-latin-400-normal.woff2',
        '/fonts/lexend-latin-600-normal.woff2',
      ]);
      try {
        const antwort = await fetch(OFFLINE_URL, { cache: 'no-store' });
        if (!antwort.ok) return;
        const html = await antwort.clone().text();
        await cache.put(OFFLINE_URL, antwort);
        await einzelnAblegen(cache, assetsAusHtml(html));
      } catch (e) {
        /* ohne Netz beim Install: die Startseite kommt beim nächsten Online-Besuch */
      }
    })
  );
  self.skipWaiting();
});

// ─── Message: von der Seite schon geladene Dateien nachtragen (K59) ─
self.addEventListener('message', (event) => {
  const daten = event.data;
  if (!daten || daten.type !== 'assets-ablegen' || !Array.isArray(daten.adressen)) return;
  const pfade = [...new Set(daten.adressen.map(alsEigeneAssetAdresse).filter(Boolean))].slice(0, 300);
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const fehlend = [];
      for (const pfad of pfade) {
        if (!(await cache.match(pfad, TREFFER))) fehlend.push(pfad);
      }
      return einzelnAblegen(cache, fehlend);
    })
  );
});

// ─── Activate: clean old caches ────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// ─── Fetch strategy ────────────────────────────────────────
// Hashed assets (JS/CSS in /assets/): cache-first (immutable)
// Everything else: network-first with offline fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  // Nur Anfragen an den eigenen Server anfassen — Fremdes geht am Cache vorbei
  // direkt ans Netz (Sicherheitsprüfung 25.09.2026). Die CSP lässt heute ohnehin
  // nur 'self' zu; das hier hält auch, falls sie je gelockert wird.
  if (url.origin !== self.location.origin) return;
  const isHashedAsset = url.pathname.startsWith('/assets/');

  if (isHashedAsset) {
    event.respondWith(
      caches.match(event.request, TREFFER).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
  } else {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request, TREFFER).then((cached) => {
            if (cached) return cached;
            // Die Startseite nur als Ersatz für Seitenaufrufe — nie anstelle einer
            // Schrift oder eines Skripts (sonst: «Failed to decode downloaded font»).
            return event.request.mode === 'navigate' ? caches.match(OFFLINE_URL, TREFFER) : Response.error();
          });
        })
    );
  }
});

// ─── Push notification scaffold ────────────────────────────
// Ready for future local notification support.
// Will ONLY fire if user has explicitly opted in.
// No tracking, no analytics, no external notification services.

self.addEventListener('push', (event) => {
  // Future: parse push data and show notification
  // For now, this is a scaffold only.
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'ordnung-ruhe',
      data: { url: data.url || '/' },
      // Respectful: no vibration, no sound by default
      silent: true,
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Maloja Plana',
        options
      )
    );
  } catch (e) {
    console.error('[SW] Push parse error:', e);
  }
});

// ─── Notification click: open app ──────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Nur die eigene Origin öffnen: die Adresse stammt aus der Push-Payload (heute dormant,
  // kein subscribe). Fremde oder ungültige Ziele fallen auf die App-Startseite zurück.
  let url = '/';
  try {
    const target = new URL(event.notification.data?.url || '/', self.location.origin);
    if (target.origin === self.location.origin) url = target.href;
  } catch (e) { /* ungültige Adresse → Startseite */ }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Focus existing window if open
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      return self.clients.openWindow(url);
    })
  );
});
