// Weiterleitung von der Wurzel in die App (Plan «App nach /app/», PR 2).
// Alte Links und installierte Apps öffnen `/`, `/#/tax`, `/?lang=fr#/praemien` …
// Zusätze und Anker gehen unverändert mit nach /app/. Eigene Datei, weil die CSP
// nur script-src 'self' erlaubt. PR 3 (Vorstellungsseite) leitet nur noch weiter,
// wenn ein Anker oder Zusatz da ist; ohne beides bleibt man dann auf der Website.
(function () {
  var ziel = '/app/' + (location.search || '') + (location.hash || '');
  location.replace(ziel);
})();
