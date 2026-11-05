/* Maloja Plana · bewegte Fassung einer Figur aus «Krankenkasse erklärt» (Stebler Studios).
 * Gebaut von scripts/build-seiten.mjs; die Zahlen setzt der Bau an der Marke DATEN aus src/data bzw.
 * scripts/seiten-figuren.mjs ein. Engine: fremd/hairline-kernel.js (MIT, public/licenses/hairline-LICENSE.txt). */
/**
 * Dorf: a village of 100 people, one house each, as tall as what that person
 * cost the basic insurance in 2024. Sorted, so most of the plot is almost flat
 * and one tower stands at the far corner. Bands: BAG EFIND 2024, table 1.1.
 * The tower stands for "more than 50'000": it is drawn at that floor, no higher.
 * The pointer picks a band; the slider stretches the heights.
 */
const { Cam, clamp, facing, fit, prism, proj, put, rings, solid, spring, stepS, unproj, disposer, mk, pointer, register } = HL;

const BANDS = /*DATEN*/null;
const N = 10, W = 12, GAP = 3, Z = 0.0024;
const XY = (i) => (W + GAP) * i;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stretch = value, act = -1;

  const C = Cam(45, 0.5, 1.2);
  fit(C, [[-8, -8, 0], [XY(N) + 5, XY(N) + 5, -6], [XY(N) + 5, -8, 0], [-8, XY(N) + 5, 0], [0, 0, 50000 * Z * 1.4 + 2]], 200, 160);
  const P = proj(C), inv = (p) => unproj(C, p[0], p[1], 0), front = facing(C);

  const g = mk("g", {}, svg);
  const [bed, bedIn] = rings(-8, -8, XY(N) + 5, XY(N) + 5, 6, 1.8);
  put(solid(g), prism(P, front, bed, bedIn, -6, 0));

  // Houses in reading order from the far corner, so the tallest are painted first.
  const cells = [];
  for (let d = 0; d <= 2 * (N - 1); d++) for (let x = 0; x < N; x++) { const y = d - x; if (y >= 0 && y < N) cells.push([x, y]); }
  const seq = BANDS.flatMap(([n, cost], b) => Array.from({ length: n }, () => ({ cost, b })));
  const houses = cells.map(([x, y], i) => {
    const s = solid(g), [ring, inner] = rings(XY(x), XY(y), XY(x) + W, XY(y) + W, 2.2, 1);
    return { x, y, ring, inner, s, b: seq[i].b, cost: seq[i].cost, h: spring(Z * seq[i].cost * stretch), drawn: -1 };
  });

  const mark = () => houses.forEach((q) => q.s.sil.classList.toggle("hi", act < 0 ? q.b === 0 : q.b === act));
  const B = register(stage, (dt) => {
    let moving = false;
    houses.forEach((q) => {
      if (stepS(q.h, dt)) moving = true;
      const h = Math.max(q.h.x, 0.5);
      if (Math.abs(h - q.drawn) > 0.01) { put(q.s, prism(P, front, q.ring, q.inner, 0, h)); q.drawn = h; }
    });
    return moving;
  });
  bag.add(B.unregister);

  /** Picks on the ground under the rest pose, which never moves. */
  function pick(p) {
    const [wx, wy] = inv(p);
    const x = Math.floor(wx / (W + GAP)), y = Math.floor(wy / (W + GAP));
    const hit = x >= 0 && y >= 0 && x < N && y < N ? houses.find((q) => q.x === x && q.y === y) : null;
    const next = hit ? hit.b : -1;
    if (next === act) return;
    act = next;
    mark();
    say();
  }
  function say() {
    read.textContent = act < 0 ? "" : BANDS[act][0] + (BANDS[act][0] === 1 ? " Mensch · " : " Menschen · ") + BANDS[act][2];
  }
  bag.add(pointer(stage, { move: pick, leave: () => { act = -1; mark(); read.textContent = ""; } }));
  bag.add(() => svg.replaceChildren());
  mark();
  B.wake();

  return {
    set: (v) => { stretch = clamp(v, 0.6, 1.4); houses.forEach((q) => { q.h.t = Z * q.cost * stretch; }); B.wake(); },
    // Tastatur (Maloja-Bühne): Stufe i von der tiefsten zur höchsten.
    anzahl: BANDS.length,
    waehle: (i) => { act = i < 0 ? -1 : BANDS.length - 1 - i; mark(); say(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "dorf",
  means: "100 Menschen, ein Haus je Person, so hoch wie ihre Kosten 2024: viele fast nichts, wenige sehr viel. Zeigen Sie auf ein Haus, um seine Kostenstufe zu sehen.",
  rules: [1, 4, 5, 10],
  range: [0.6, 1, 1.4],
  tour: [[200, 90], [200, 180], [200, 250], null],
  mount,
});
