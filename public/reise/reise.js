// ERZEUGT — Quelle: scripts/seiten/reise.mjs
(function () {
  document.documentElement.classList.add('js');
  var punkte = [[200,660],[310,590],[90,500],[300,410],[120,320],[290,240],[150,190],[210,150]];
  var l = [0];
  for (var i = 1; i < punkte.length; i++) {
    var dx = punkte[i][0] - punkte[i - 1][0], dy = punkte[i][1] - punkte[i - 1][1];
    l.push(l[i - 1] + Math.sqrt(dx * dx + dy * dy));
  }
  var anteile = l.map(function (x) { return x / l[l.length - 1]; });
  var weg = document.getElementById('weg');
  var st = [].slice.call(document.querySelectorAll('.st'));
  var abschnitte = [].slice.call(document.querySelectorAll('.station'));
  var leiste = [].slice.call(document.querySelectorAll('.etappen a'));
  function neu() {
    var schmal = window.matchMedia('(max-width:767px)').matches;
    var mitte = window.innerHeight * (schmal ? 0.66 : 0.55), f = 0, hier = -1;
    abschnitte.forEach(function (a, k) {
      var r = a.getBoundingClientRect();
      var t = Math.min(1, Math.max(0, (mitte - r.top) / r.height));
      if (r.top <= mitte) {
        hier = k;
        f = k === abschnitte.length - 1 ? 1 : anteile[k + 1] + (anteile[Math.min(k + 2, anteile.length - 1)] - anteile[k + 1]) * t;
      }
      a.classList.toggle('erreicht', r.top <= mitte);
    });
    if (weg) weg.style.strokeDashoffset = String(1 - f);
    st.forEach(function (g, i) { g.classList.toggle('erreicht', f >= anteile[i + 1] - 0.001); });
    leiste.forEach(function (a, i) {
      a.classList.toggle('erreicht', i <= hier);
      if (i === hier) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
    });
  }
  var geplant = false;
  window.addEventListener('scroll', function () {
    if (!geplant) { geplant = true; window.requestAnimationFrame(function () { geplant = false; neu(); }); }
  }, { passive: true });
  window.addEventListener('resize', neu);
  neu();
})();
