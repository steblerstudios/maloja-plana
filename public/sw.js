// ─── Maloja Plana — Service Worker ───────────────────────
// Phase 1: Offline cache + push notification scaffold.
// No external services. Local-first. Privacy-first.
//
// Future phases:
// - Push notification handling (requires user opt-in)
// - Background sync for reminders
// - Offline document access

const CACHE_NAME = 'ordnung-ruhe-v2';
const OFFLINE_URL = '/';

// ─── Install: cache the app shell ──────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_URL]);
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

// ─── Fetch: network-first with offline fallback ────────────
self.addEventListener('fetch', (event) => {
  // Only cache GET requests for same-origin
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline fallback
        return caches.match(event.request).then((cached) => {
          return cached || caches.match(OFFLINE_URL);
        });
      })
  );
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
