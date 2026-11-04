/* Maloja Plana · bewegte Fassung einer Figur aus «Krankenkasse erklärt» (Stebler Studios).
 * Gebaut von scripts/build-seiten.mjs; die Zahlen setzt der Bau an der Marke DATEN aus src/data bzw.
 * scripts/seiten-figuren.mjs ein. Engine: fremd/hairline-kernel.js (MIT, public/licenses/hairline-LICENSE.txt). */
/**
 * Alter: a row of posts, one per five-year age group, as tall as what a person
 * of that age cost the insurance after their own share (BAG EFIND 2024, table
 * 2.2). The adult average is 4'863 francs; the first post over it holds the
 * bright mark.
 * The pointer picks an age; the slider stretches the heights.
 */
const { Cam, clamp, facing, fit, prism, proj, put, rings, solid, spring, stepS, disposer, mk, pointer, register } = HL;

const ALTER = {"alter":[["0–5",1622],["6–10",1126],["11–15",1445],["16–20",1715],["21–25",1703],["26–30",1903],["31–35",2252],["36–40",2252],["41–45",2349],["46–50",2779],["51–55",3454],["56–60",4203],["61–65",5233],["66–70",6690],["71–75",8488],["76–80",10582],["81–85",12738],["86–90",15710],["über 90",20389]],"schnitt":4863};
const AGES = ALTER.alter;
const N = AGES.length, W = 13, GAP = 2.4, D = 30, Z = 0.0078, FIRST = AGES.findIndex((a) => a[1] > ALTER.schnitt);
const Y = (i) => -i * (W + GAP);
const chf = (n) => String(n).replace(/\B(?=(\d{3})+$)/g, "'");

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stretch = value, act = -1;

  const C = Cam(45, 0.5, 1.04);
  fit(C, [[-7, W + 7, -6], [D + 7, W + 7, -6], [-7, Y(N - 1) - 7, 20389 * Z * 1.25], [D + 7, Y(N - 1) - 7, 0]], 200, 164);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [bed, bedIn] = rings(-7, Y(N - 1) - 7, D + 7, W + 7, 5, 1.6);
  put(solid(g), prism(P, front, bed, bedIn, -6, 0));

  const posts = [];
  for (let i = N - 1; i >= 0; i--) {
    const s = solid(g), [ring, inner] = rings(0, Y(i), D, Y(i) + W, 2.4, 1);
    posts[i] = { s, ring, inner, h: spring(Z * AGES[i][1] * stretch), drawn: -1 };
  }
  const mark = () => posts.forEach((q, i) => q.s.sil.classList.toggle("hi", i === (act < 0 ? FIRST : act)));
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
    let best = -1, far = 14;
    posts.forEach((_, i) => { const d = Math.abs(centre(i) - p[0]); if (d < far) { far = d; best = i; } });
    if (best === act) return;
    act = best;
    mark();
    say();
  }
  function say() { read.textContent = act < 0 ? "" : AGES[act][0] + " Jahre · " + chf(AGES[act][1]) + " Fr. im Jahr"; }
  bag.add(pointer(stage, { move: pick, leave: () => { act = -1; mark(); read.textContent = ""; } }));
  bag.add(() => svg.replaceChildren());
  mark();
  B.wake();

  return {
    set: (v) => { stretch = clamp(v, 0.6, 1.25); posts.forEach((q, i) => { q.h.t = Z * AGES[i][1] * stretch; }); B.wake(); },
    anzahl: N,
    waehle: (i) => { act = i; mark(); say(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "alter",
  means: "Je Pfosten fünf Altersjahre, die Höhe zeigt die Kosten 2024, und ab dem hellen Pfosten liegt man über dem Schnitt.",
  rules: [1, 4, 5, 10],
  range: [0.6, 1, 1.25],
  tour: [[110, 230], [230, 170], [320, 90], null],
  mount,
});
