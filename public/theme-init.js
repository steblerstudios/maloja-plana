// Setzt data-theme, BEVOR React rendert — sonst blitzt die Seite im Dunkelmodus
// beim Laden kurz hell auf (Bau-Liste K4, Nit aus #96).
//
// Eigene Datei statt Inline-Script: die CSP in index.html erlaubt nur
// script-src 'self'. Synchron im <head> geladen, darum klein halten.
//
// Dieselbe Quelle und Logik wie src/main.jsx (useState für isDarkMode):
// Schlüssel 'or5_theme', JSON-Wert, ohne Eintrag dunkel. Die App liest
// prefers-color-scheme nicht, darum hier auch nicht. Im Privat-Modus oder bei
// gesperrtem Speicher wirft localStorage — dann gilt der Default.
(function () {
  var dark = true;
  try { dark = JSON.parse(localStorage.getItem('or5_theme') || 'true'); } catch (e) { dark = true; }
  try { document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); } catch (e) { /* ohne Markierung rendert die App wie bisher */ }
})();
