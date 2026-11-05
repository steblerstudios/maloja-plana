/* Maloja Plana · bewegte Fassung einer Figur aus «Krankenkasse erklärt» (Stebler Studios).
 * Gebaut von scripts/build-seiten.mjs; die Zahlen setzt der Bau an der Marke DATEN aus src/data bzw.
 * scripts/seiten-figuren.mjs ein. Engine: fremd/hairline-kernel.js (MIT, public/licenses/hairline-LICENSE.txt). */
/**
 * Kostenteil: a stair of 25 posts, one per 500 francs of a year's health costs.
 * Each post is as tall as what the insured person pays at that cost: steep up
 * to the franchise, then 10 %, then flat once the 700 francs cap is reached.
 * The pointer picks a year; the slider is the franchise (300, 1000, 2500).
 */
const { Cam, clamp, facing, fit, prism, proj, put, rings, solid, spring, stepS, disposer, mk, pointer, reflect, register } = HL;

const REGEL = {"stufen":[300,500,1000,1500,2000,2500],"satz":0.1,"dach":700};
const N = 25, STEP = 500, W = 11, GAP = 1.6, D = 34, Z = 0.04, CAP = REGEL.dach;
/** Posts run towards the far corner, so the stair rises to the right on screen. */
const STEPS = REGEL.stufen;
const Y = (i) => -i * (W + GAP);
const own = (cost, f) => (cost <= f ? cost : f + Math.min((cost - f) * REGEL.satz, CAP));
const chf = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+$)/g, "'");

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let fr = value, act = -1;

  const C = Cam(45, 0.5, 1.1);
  fit(C, [[-7, W + 7, -6], [D + 7, W + 7, -6], [-7, Y(N - 1) - 7, 3200 * Z + 4], [D + 7, Y(N - 1) - 7, 0]], 200, 168);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [bed, bedIn] = rings(-7, Y(N - 1) - 7, D + 7, W + 7, 5, 1.6);
  reflect(svg, g, P, front, bed, -6, 14);
  put(solid(g), prism(P, front, bed, bedIn, -6, 0));

  const posts = [];
  for (let i = N - 1; i >= 0; i--) {
    const s = solid(g), [ring, inner] = rings(0, Y(i), D, Y(i) + W, 2.4, 1);
    posts[i] = { s, ring, inner, h: spring(Z * own((i + 1) * STEP, fr)), drawn: -1 };
  }

  /** The post where the cap is reached: the bright mark at rest. */
  const kink = () => clamp(Math.ceil((fr + CAP * 10) / STEP) - 1, 0, N - 1);
  function mark() {
    const m = act < 0 ? kink() : act;
    posts.forEach((q, i) => q.s.sil.classList.toggle("hi", i === m));
  }

  const B = register(stage, (dt) => {
    let moving = false;
    posts.forEach((q) => {
      if (stepS(q.h, dt)) moving = true;
      const h = Math.max(q.h.x, 0.6);
      if (Math.abs(h - q.drawn) > 0.01) { put(q.s, prism(P, front, q.ring, q.inner, 0, h)); q.drawn = h; }
    });
    return moving;
  });
  bag.add(B.unregister);

  const centre = (i) => P(D / 2, Y(i) + W / 2, 0)[0];
  function say() {
    read.textContent = act < 0 ? "Franchise " + chf(fr) + " Fr." : "Kosten " + chf((act + 1) * STEP) + " Fr. · selbst " + chf(own((act + 1) * STEP, fr)) + " Fr.";
  }
  function pick(p) {
    let best = -1, far = 12;
    posts.forEach((_, i) => { const d = Math.abs(centre(i) - p[0]); if (d < far) { far = d; best = i; } });
    if (best !== act) { act = best; mark(); say(); }
  }
  bag.add(pointer(stage, { move: pick, leave: () => { act = -1; mark(); say(); } }));
  bag.add(() => svg.replaceChildren());
  mark();
  say();
  B.wake();

  return {
    set: (v) => {
      fr = STEPS.reduce((best, f) => (Math.abs(f - v) < Math.abs(best - v) ? f : best));
      posts.forEach((q, i) => { q.h.t = Z * own((i + 1) * STEP, fr); });
      mark(); say(); B.wake();
    },
    anzahl: N,
    waehle: (i) => { act = i; mark(); say(); },
    wertText: (v) => "Franchise " + chf(STEPS.reduce((best, f) => (Math.abs(f - v) < Math.abs(best - v) ? f : best))) + " Franken",
    destroy: bag.dispose,
  };
}

hairline({
  name: "kostenteil",
  means: "Je Pfosten 500 Franken Jahreskosten, die Höhe ist der eigene Anteil: bis zur Franchise alles, dann 10 Prozent, ab 700 Franken Selbstbehalt nichts mehr. Der Regler stellt die Franchise ein.",
  rules: [1, 4, 5, 10],
  range: [300, 1000, 2500],
  tour: [[110, 220], [190, 170], [300, 120], null],
  mount,
});
