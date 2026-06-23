// ─── Maloja Plana — Service Worker ───────────────────────
// Phase 1: Offline cache + push notification scaffold.
// No external services. Local-first. Privacy-first.
//
// Future phases:
// - Push notification handling (requires user opt-in)
// - Background sync for reminders
// - Offline document access

const CACHE_NAME = 'maloja-plana-v7';
const OFFLINE_URL = '/';

// ─── Install: cache the app shell ──────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/fonts/dm-sans-latin-400-normal.woff2',
        '/fonts/dm-sans-latin-600-normal.woff2',
      ]);
    })
  );
  self.skipWaiting();
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
  const isHashedAsset = url.pathname.startsWith('/assets/');

  if (isHashedAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
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
          return caches.match(event.request).then((cached) => {
            return cached || caches.match(OFFLINE_URL);
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
  const url = event.notification.data?.url || '/';

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
