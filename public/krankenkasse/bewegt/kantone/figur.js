/* Maloja Plana · bewegte Fassung einer Figur aus «Krankenkasse erklärt» (Stebler Studios).
 * Gebaut von scripts/build-seiten.mjs; die Zahlen setzt der Bau an der Marke DATEN aus src/data bzw.
 * scripts/seiten-figuren.mjs ein. Engine: fremd/hairline-kernel.js (MIT, public/licenses/hairline-LICENSE.txt). */
/**
 * Kantone: 26 posts, sorted, each as tall as the mean adult premium of one
 * canton in 2027 (BAG table of 29.09.2026). The posts start from zero, so the
 * ratio between them is true. The pointer picks a canton; the slider stretches.
 */
const { Cam, clamp, facing, fit, prism, proj, put, rings, solid, spring, stepS, disposer, mk, pointer, register } = HL;

const CANTONS = [["Zug",324.9,0],["Appenzell Innerrhoden",340.5,1],["Uri",377.7,2],["Obwalden",386.7,3],["Nidwalden",397.2,4],["Schwyz",418.5,5],["Appenzell Ausserrhoden",422.3,6],["Glarus",426.5,7],["Thurgau",433.2,8],["Graubünden, Region 1",441.9,9],["Graubünden, Region 2",410.9,9],["Graubünden, Region 3",395.5,9],["Luzern, Region 1",446.1,10],["Luzern, Region 2",412.4,10],["Luzern, Region 3",399.9,10],["St. Gallen, Region 1",456.9,11],["St. Gallen, Region 2",423.7,11],["St. Gallen, Region 3",400.3,11],["Aargau",464.7,12],["Wallis, Region 1",477.3,13],["Wallis, Region 2",417.1,13],["Schaffhausen, Region 1",485,14],["Schaffhausen, Region 2",450.8,14],["Solothurn",493.5,15],["Freiburg, Region 1",494.3,16],["Freiburg, Region 2",451.7,16],["Zürich, Region 1",513,17],["Zürich, Region 2",476.8,17],["Zürich, Region 3",447.2,17],["Bern, Region 1",531.2,18],["Bern, Region 2",488.5,18],["Bern, Region 3",455.3,18],["Jura",551,19],["Waadt, Region 1",553.8,20],["Waadt, Region 2",522.3,20],["Basel-Landschaft, Region 1",556,21],["Basel-Landschaft, Region 2",515.6,21],["Neuenburg",558.8,22],["Basel-Stadt",570.6,23],["Tessin, Region 1",609.3,24],["Tessin, Region 2",565.3,24],["Genf",610.6,25]]; // [Beschriftung, Prämie Erwachsene, Kantonsnummer in der Reihe]
const N = CANTONS.length, W = 4.6, GAP = 1.1, GROUP = 2.6, D = 30, Z = 0.2;
const TOP = Math.max(...CANTONS.map((c) => c[1]));
const Y = (i) => -(i * (W + GAP) + CANTONS[i][2] * GROUP);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stretch = value, act = -1;

  const C = Cam(45, 0.5, 1.08);
  fit(C, [[-7, W + 7, -6], [D + 7, W + 7, -6], [-7, Y(N - 1) - 7, TOP * Z * 1.25], [D + 7, Y(N - 1) - 7, 0]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [bed, bedIn] = rings(-7, Y(N - 1) - 7, D + 7, W + 7, 5, 1.6);
  put(solid(g), prism(P, front, bed, bedIn, -6, 0));

  const posts = [];
  for (let i = N - 1; i >= 0; i--) {
    const s = solid(g), [ring, inner] = rings(0, Y(i), D, Y(i) + W, 2, 1);
    posts[i] = { s, ring, inner, h: spring(Z * CANTONS[i][1] * stretch), drawn: -1 };
  }
  const mark = () => posts.forEach((q, i) => q.s.sil.classList.toggle("hi", i === (act < 0 ? N - 1 : act)));
  const B = register(stage, (dt) => {
    let moving = false;
    posts.forEach((q) => {
      if (stepS(q.h, dt)) moving = true;
      if (Math.abs(q.h.x - q.drawn) > 0.01) { put(q.s, prism(P, front, q.ring, q.inner, 0, q.h.x)); q.drawn = q.h.x; }
    });
    return moving;
  });
  bag.add(B.unregister);

  const centre = (i) => P(D / 2, Y(i) + W / 2, 0)[0];
  function pick(p) {
    let best = -1, far = 10;
    posts.forEach((_, i) => { const d = Math.abs(centre(i) - p[0]); if (d < far) { far = d; best = i; } });
    if (best === act) return;
    act = best;
    mark();
    say();
  }
  function say() { read.textContent = act < 0 ? "" : CANTONS[act][0] + " · " + CANTONS[act][1].toFixed(2) + " Fr."; }
  bag.add(pointer(stage, { move: pick, leave: () => { act = -1; mark(); read.textContent = ""; } }));
  bag.add(() => svg.replaceChildren());
  mark();
  B.wake();

  return {
    set: (v) => { stretch = clamp(v, 0.7, 1.25); posts.forEach((q, i) => { q.h.t = Z * CANTONS[i][1] * stretch; }); B.wake(); },
    anzahl: N,
    waehle: (i) => { act = i; mark(); say(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "kantone",
  means: "Je Pfosten eine Prämienregion, nach Kanton gruppiert; die Höhe zeigt die mittlere Monatsprämie für Erwachsene 2027. Zeigen Sie auf einen Pfosten.",
  rules: [1, 4, 5, 10],
  range: [0.7, 1, 1.25],
  tour: [[110, 220], [220, 170], [320, 100], null],
  mount,
});
