// Die Reise auf der Vorstellungsseite (Abschnitt #weg, Entwurf 10.11.2026, Brand Book §7d).
// Beim Scrollen wandert das Passbild mit (--f von 0 = Tal bis 1 = Pass), der Punkt auf der
// Weglinie zeigt die aktuelle Kehre, und an den Wanderstock kommt je erreichter Kehre ein
// Stocknagel. Ohne dieses Skript ist alles da (alle Nägel am Stock, Bild ruhend).
// Eigene Datei, weil die CSP nur script-src 'self' erlaubt. Reines ES5, keine Abhängigkeiten.
(function () {
  var bruecke = document.querySelector('.reise-bruecke');
  if (!bruecke) return;
  document.documentElement.classList.add('js');
  var buehne = bruecke.querySelector('.reise-buehne');
  var stationen = [].slice.call(bruecke.querySelectorAll('.reise-station'));
  var naegel = [].slice.call(bruecke.querySelectorAll('.nagel'));
  var punkte = [].slice.call(bruecke.querySelectorAll('.reise-linie circle'));
  var ruhig = window.matchMedia('(prefers-reduced-motion: reduce)');
  function neu() {
    var mitte = window.innerHeight * 0.6, hier = -1;
    stationen.forEach(function (s, i) { if (s.getBoundingClientRect().top <= mitte) hier = i; });
    var r = bruecke.getBoundingClientRect();
    var weg = Math.max(1, r.height - window.innerHeight);
    var f = Math.min(1, Math.max(0, -r.top / weg));
    if (!ruhig.matches) buehne.style.setProperty('--f', f.toFixed(3));
    naegel.forEach(function (n, i) { n.classList.toggle('dran', i <= hier); });
    punkte.forEach(function (p, i) { p.classList.toggle('hier', i === hier); p.setAttribute('r', i === hier ? 6 : 4); });
  }
  var geplant = false;
  window.addEventListener('scroll', function () {
    if (!geplant) { geplant = true; window.requestAnimationFrame(function () { geplant = false; neu(); }); }
  }, { passive: true });
  window.addEventListener('resize', neu);
  neu();
})();
