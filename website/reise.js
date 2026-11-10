// Die Reise auf der Vorstellungsseite (Abschnitt #weg, Entwurf 10.11.2026, Brand Book §7e, Entscheid A–E).
// Beim Scrollen: vor Kehre 1 steht die Nacht über dem Pass (Eintritt); je Kehre breitet sich das neue Bild wie ein
// Pinselstrich quer über das alte, der Ort auf der Weglinie wandert mit, an den Wanderstock kommt je erreichter Kehre
// ein Stocknagel, und der Stock dreht sich um die eigene Achse, bis der neue Nagel vorn steht.
// Ohne dieses Skript ist alles da (alle Nägel am Stock, erstes Bild, Eintritt mit eigener dunkler Fläche).
// Bei «weniger Bewegung» wechseln Bild, Nägel und Ort genauso, nur ohne Bewegung (der Stock springt statt zu drehen).
// Eigene Datei, weil die CSP nur script-src 'self' erlaubt. Reines ES5, keine Abhängigkeiten.
(function () {
  var bruecke = document.querySelector('.reise-bruecke');
  if (!bruecke) return;
  document.documentElement.classList.add('js');
  var buehne = bruecke.querySelector('.reise-buehne');
  var stationen = [].slice.call(bruecke.querySelectorAll('.reise-station'));
  var naegel = [].slice.call(bruecke.querySelectorAll('.nagel'));
  var punkte = [].slice.call(bruecke.querySelectorAll('.reise-linie circle[data-kehre]'));
  var ort = bruecke.querySelector('.reise-linie .ort');
  var ortText = ort && ort.querySelector('text');
  var gegangen = bruecke.querySelector('.reise-linie .gegangen');
  var bilder = [].slice.call(bruecke.querySelectorAll('.kehre-bild')); // [Nacht, Kehre 1 … Kehre 7]
  var namen = stationen.map(function (s) { var n = s.querySelector('.name'); return n ? n.textContent.split('·').pop().trim() : ''; });
  var ruhig = window.matchMedia('(prefers-reduced-motion: reduce)');
  var bisher = null;

  function bildZeigen(nr) {
    if (nr === bisher) return;
    var alt = bisher;
    bilder.forEach(function (b) { b.classList.remove('an', 'vorher'); });
    if (alt !== null && bilder[alt]) bilder[alt].classList.add('vorher');
    void bilder[nr].offsetWidth; // neu messen, damit der Klecks jedes Mal von klein anfängt
    bilder[nr].classList.add('an');
    bisher = nr;
    // Das eigene und die zwei nächsten Bilder laden (Gewicht: nicht alle sieben auf einmal).
    for (var i = nr; i <= nr + 2 && i < bilder.length; i++) {
      var b = bilder[i], quelle = b.getAttribute('data-src');
      if (quelle) { b.setAttribute('src', quelle); b.removeAttribute('data-src'); }
    }
  }

  function neu() {
    // Massgebend ist der Text, nicht der Abschnitt: Bild und Nagel wechseln erst, wenn der Text der neuen Kehre
    // ins Bild kommt (sonst stünde noch «Kehre 1» da, während schon Bild 2 zu sehen ist).
    var h = window.innerHeight, schwelle = h * 0.8, hier = -1;
    stationen.forEach(function (s, i) {
      var t = s.querySelector('.reise-text') || s;
      if (t.getBoundingClientRect().top <= schwelle) hier = i;
    });
    // Fortschritt innerhalb der aktuellen Kehre: der Text wandert von unten (0) nach oben (1).
    var k = 0, s = stationen[Math.max(0, hier)];
    if (s) { var r = (s.querySelector('.reise-text') || s).getBoundingClientRect(); k = Math.min(1, Math.max(0, (schwelle - r.top) / h)); }
    buehne.setAttribute('data-hier', String(hier));
    bildZeigen(hier + 1);
    naegel.forEach(function (n, i) { n.classList.toggle('dran', i <= hier); });
    punkte.forEach(function (p, i) { p.setAttribute('r', i === hier ? 0 : 5); });
    if (gegangen) {
      var anteil = hier < 0 ? 0 : (hier + 0.5) / stationen.length;
      gegangen.style.strokeDashoffset = String(100 - anteil * 100);
    }
    if (ort && hier >= 0 && punkte[hier]) {
      ort.setAttribute('transform', 'translate(' + punkte[hier].getAttribute('cx') + ' ' + punkte[hier].getAttribute('cy') + ')');
      if (ortText) ortText.textContent = namen[hier];
    }
    if (!ruhig.matches) buehne.style.setProperty('--k', k.toFixed(3));
    // Drehen: zu Beginn einer Kehre steht noch der vorige Nagel vorn; während der Text hereinkommt, dreht sich
    // der Stock, bis der neue Nagel vorn steht («im Kreis angeschaut» wie bei Fuji, kein Zoom).
    ziel = hier < 0 ? -SCHRITT : SCHRITT * (hier - 1 + Math.min(1, k / 0.4));
    if (ruhig.matches) { winkel = hier < 0 ? 0 : SCHRITT * hier; drehen(); } else if (!laeuft) { laeuft = true; window.requestAnimationFrame(schritt); }
  }

  // Der Stock: Nägel rundum (je 1/7 Drehung), Maserung als feine Streifen. Vorne breit, seitlich schmal, hinten weg.
  var SCHRITT = 2 * Math.PI / naegel.length, MITTE = 60, RADIUS = 22;
  var dreher = [].slice.call(bruecke.querySelectorAll('.nagel-dreh'));
  var streifen = [].slice.call(bruecke.querySelectorAll('.reise-stock .maser rect'));
  var winkel = 0, ziel = 0, laeuft = false;
  function drehen() {
    dreher.forEach(function (g, i) {
      var a = i * SCHRITT - winkel, c = Math.cos(a), x = MITTE + Math.sin(a) * RADIUS;
      g.style.visibility = c > 0.02 ? '' : 'hidden';
      g.setAttribute('transform', 'translate(' + x.toFixed(2) + ' 0) scale(' + Math.max(c, 0.02).toFixed(3) + ' 1) translate(' + (-MITTE) + ' 0)');
    });
    streifen.forEach(function (r, j) {
      var a = j * Math.PI / 4 + 0.3 - winkel, c = Math.cos(a);
      r.style.visibility = c > 0 ? '' : 'hidden';
      r.setAttribute('x', (MITTE + Math.sin(a) * 20).toFixed(2));
      r.setAttribute('width', (1.4 * Math.max(c, 0.05)).toFixed(2));
    });
  }
  function schritt() {
    var d = ziel - winkel;
    winkel += Math.abs(d) < 0.002 ? d : d * 0.1;
    drehen();
    if (winkel !== ziel) window.requestAnimationFrame(schritt); else laeuft = false;
  }

  var geplant = false;
  window.addEventListener('scroll', function () {
    if (!geplant) { geplant = true; window.requestAnimationFrame(function () { geplant = false; neu(); }); }
  }, { passive: true });
  window.addEventListener('resize', neu);
  neu();
})();
