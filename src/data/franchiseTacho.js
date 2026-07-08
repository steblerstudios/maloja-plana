// Reine Logik für den Franchise-Tacho — kein React, damit testbar.
// Der Tacho ist ein Instrument ÜBER der bestehenden Franchise-Optimierer-Logik
// (franchiseOpt aus PraemienOrientierung): Zeiger = laufende Gesundheitskosten
// dieses Jahr, Skala mit Break-even-Marke. Ehrlich als „wo stehe ich dieses
// Jahr", nie als Verdikt — die tragbarkeitskritische Reserve-Prüfung bleibt
// daneben stehen.
//
// franchiseOpt: { lowFra, highFra, annualSaving, reserve, sbMax, breakEven }
//   (breakEven = Gesundheitskosten/Jahr, unter denen die hohe Franchise günstiger ist)
// costs: bisher erfasste, KVG-anrechenbare Gesundheitskosten des laufenden Jahres
export function tachoState(franchiseOpt, costs) {
  // Ohne belegten Break-even kein Tacho — dann fehlt die ehrliche Skala.
  if (!franchiseOpt || franchiseOpt.breakEven == null) return { show: false };
  const be = franchiseOpt.breakEven;
  const c = Math.max(0, Number(costs) || 0);
  const up500 = (n) => Math.ceil(n / 500) * 500;
  // Skala mit Luft: Break-even sitzt nicht am Rand, Reserve/eigene Kosten passen rein.
  const scaleMax = Math.max(
    up500(be * 1.6),
    up500((franchiseOpt.reserve || 0) * 1.1),
    up500(c * 1.15),
    2000,
  );
  const mode = c <= 0 ? 'orientation' : (c <= be ? 'below' : 'above');
  return {
    show: true,
    mode,
    breakEven: be,
    scaleMax,
    high: franchiseOpt.highFra,
    low: franchiseOpt.lowFra,
    costs: c,
    needle: c > 0 ? Math.min(c, scaleMax) : null,
  };
}
