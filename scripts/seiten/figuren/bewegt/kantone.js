/* Maloja Plana · bewegte Fassung einer Figur aus «Krankenkasse erklärt» (Stebler Studios).
 * Gebaut von scripts/build-seiten.mjs; die Zahlen setzt der Bau an der Marke DATEN aus src/data bzw.
 * scripts/seiten-figuren.mjs ein. Engine: fremd/hairline-kernel.js (MIT, public/licenses/hairline-LICENSE.txt). */
/**
 * Kantone: 26 posts, sorted, each as tall as the mean adult premium of one
 * canton in 2027 (BAG table of 29.09.2026). The posts start from zero, so the
 * ratio between them is true. The pointer picks a canton; the slider stretches.
 */
const { Cam, clamp, facing, fit, prism, proj, put, rings, solid, spring, stepS, disposer, mk, pointer, register } = HL;

const CANTONS = /*DATEN*/null; // [Beschriftung, Prämie Erwachsene, Kantonsnummer in der Reihe]
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
    read.textContent = act < 0 ? "" : CANTONS[act][0] + " · " + CANTONS[act][1].toFixed(2) + " Fr.";
  }
  bag.add(pointer(stage, { move: pick, leave: () => { act = -1; mark(); read.textContent = ""; } }));
  bag.add(() => svg.replaceChildren());
  mark();
  B.wake();

  return {
    set: (v) => { stretch = clamp(v, 0.7, 1.25); posts.forEach((q, i) => { q.h.t = Z * CANTONS[i][1] * stretch; }); B.wake(); },
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
