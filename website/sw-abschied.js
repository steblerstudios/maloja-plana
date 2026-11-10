// ─── Maloja Plana — Abschieds-Service-Worker unter /sw.js ──────────────────
// Plan «App nach /app/», PR 2. Bis zum Umzug lief die App unter `/`, ihr Service Worker
// hatte den Scope `/` und bleibt bei allen Wiederkehrenden angemeldet. Er würde die
// Website auf `/` abfangen und offline die alte App-Hülle zeigen.
//
// Beim nächsten Besuch prüft der Browser /sw.js (die App meldete ihn mit
// updateViaCache: 'none' an) und findet diese Datei. Sie
//   1. räumt die Caches des alten Wurzel-SW («maloja-plana-<hash>»). Die Caches der App
//      unter /app/ («maloja-plana-app-…») bleiben stehen — der Cache-Speicher gehört der
//      ganzen Origin, nicht dem Ordner;
//   2. meldet sich selbst ab;
//   3. lädt offene Fenster einmal neu, damit sie ohne Service Worker vom Netz kommen.
// Angaben in localStorage und IndexedDB fasst sie nicht an.
//
// Kein fetch-Hörer: Anfragen gehen direkt ans Netz.
// Liegen lassen bis mindestens Juli 2027, damit jeder alte Besuch ihn abholt.

const ALTER_CACHE = /^maloja-plana-(?!app-)/;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const namen = await caches.keys();
    await Promise.all(namen.filter((n) => ALTER_CACHE.test(n)).map((n) => caches.delete(n)));
    await self.registration.unregister();
    const fenster = await self.clients.matchAll({ type: 'window' });
    // Einzeln abgesichert: steuert der SW ein Fenster nicht mehr, wirft navigate() — Caches und
    // Abmeldung sind dann schon erledigt (Sicherheits-Prüfung 10.11.2026).
    await Promise.all(fenster.map((f) => (typeof f.navigate === 'function' ? f.navigate(f.url).catch(() => {}) : null)));
  })());
});
