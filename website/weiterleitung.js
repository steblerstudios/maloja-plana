// Weiterleitung von der Website in die App (Plan «App nach /app/», PR 3).
// Auf `/` steht die Vorstellungsseite. In die App unter /app/ geht es nur, wenn die Adresse
// zur App gehört — Zusätze und Anker gehen unverändert mit:
//   · ein App-Anker:      /#/tax            → /app/#/tax
//   · App-Zusätze:        /?lang=fr, /?beispiel
//   · die installierte App (Startbildschirm, Dock): sie startete bis zum Umzug auf `/`.
//     iPhone-Home-Bildschirm-Apps behalten ihre Startadresse für immer.
// Seiten-Anker wie /#holen bleiben auf der Website. Eigene Datei, weil die CSP nur
// script-src 'self' erlaubt. Läuft synchron im <head>, vor dem ersten Bild.
(function () {
  var suche = location.search || '';
  var anker = location.hash || '';
  var appAnker = anker.indexOf('#/') === 0;
  var appZusatz = /[?&](lang|beispiel)(=|&|$)/.test(suche);
  var installiert = false;
  try {
    installiert = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  } catch (e) { /* ohne matchMedia: nicht installiert */ }
  if (appAnker || appZusatz || installiert) location.replace('/app/' + suche + anker);
  // Wechselt nur der Anker (/ → /#/tax), lädt der Browser nicht neu — dann hier nachziehen.
  window.addEventListener('hashchange', function () {
    if ((location.hash || '').indexOf('#/') === 0) location.replace('/app/' + (location.search || '') + location.hash);
  });
})();
