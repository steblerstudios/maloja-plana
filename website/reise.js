// Die Reise auf der Vorstellungsseite (Abschnitt #weg, Entwurf 10.11.2026, Brand Book §7e).
// Beim Scrollen wechselt je Kehre das Bild (Bergell → Silsersee) und wandert leicht mit (--k), der Punkt auf der
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
  var bilder = [].slice.call(bruecke.querySelectorAll('.kehre-bild'));
  var ruhig = window.matchMedia('(prefers-reduced-motion: reduce)');
  function neu() {
    // Massgebend ist die Karte, nicht der Abschnitt: Bild und Nagel wechseln erst, wenn die Karte
    // der neuen Kehre ins Bild kommt (sonst stünde noch «Kehre 1» da, während schon Bild 2 zu sehen ist).
    var schwelle = window.innerHeight * 0.85, hier = -1, h = window.innerHeight;
    stationen.forEach(function (s, i) {
      var karte = s.querySelector('.reise-karte') || s;
      if (karte.getBoundingClientRect().top <= schwelle) hier = i;
    });
    // Fortschritt innerhalb der aktuellen Kehre: die Karte wandert von unten (0) nach oben (1).
    var k = 0, s = stationen[Math.max(0, hier)];
    if (s) { var r = (s.querySelector('.reise-karte') || s).getBoundingClientRect(); k = Math.min(1, Math.max(0, (schwelle - r.top) / h)); }
    if (!ruhig.matches) buehne.style.setProperty('--k', k.toFixed(3));
    bilder.forEach(function (b, i) { b.classList.toggle('an', i === Math.max(0, hier)); });
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
