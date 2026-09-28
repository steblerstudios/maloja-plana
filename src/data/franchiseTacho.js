import { berechneFranchise, SELBSTBEHALT_MAX, SELBSTBEHALT_MAX_KINDER } from './kvgLeistungen.js';
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

// ─── Franchise-Kreuz (seit 25.09.2026, ersetzt den Tacho) ───────────────────
// Dieselbe Frage, ehrlich gezeichnet: zwei Linien = Gesamtkosten pro Jahr (Prämie ×12 +
// Eigenanteil) für die tiefe und die hohe Franchise, über den Gesundheitskosten. Wo sie sich
// kreuzen, liegt der Break-even — derselbe, den PraemienOrientierung schon sucht; das Kreuz
// zeichnet nur die Kurven, die dort ohnehin gerechnet werden (berechneFranchise).
//
// Der Tacho mischte zwei Zeiträume (Nadel = Kosten BISHER im Jahr, Skala = pro Jahr). Hier:
//   costs       = bisher erfasst (Strich, beschriftet «bisher»)
//   hochrechnung = bisher × Tage im Jahr / vergangene Tage — nur ab dem 60. Tag, sonst zu
//                  wackelig; gestrichelt und als Schätzung beschriftet.
// franchiseOpt braucht zusätzlich lowPremium/highPremium (Monatsprämien).

const tagImJahr = (d) => {
  // Lokales Datum, nicht UTC (Fehlerklasse UTC-Datum, 24.09.2026).
  const start = new Date(d.getFullYear(), 0, 1);
  // round, nicht floor: über die Sommerzeit fehlt der Differenz eine Stunde (sonst 1 Tag zu wenig).
  return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - start) / 86400000) + 1;
};

export function kreuzState(franchiseOpt, costs, heute = new Date()) {
  const st = tachoState(franchiseOpt, costs);
  if (!st.show || !(franchiseOpt.lowPremium > 0) || !(franchiseOpt.highPremium > 0)) return { show: false };
  const { lowFra, highFra, lowPremium, highPremium, sbMax } = franchiseOpt;
  const gesamt = (fra, praemie, c) => praemie * 12 + berechneFranchise(fra, c, sbMax).eigenanteil;

  const tag = tagImJahr(heute);
  const tageImJahr = tagImJahr(new Date(heute.getFullYear(), 11, 31));
  const hochrechnung = st.costs > 0 && tag >= 60 ? Math.round(st.costs * tageImJahr / tag) : null;

  const up500 = (n) => Math.ceil(n / 500) * 500;
  const scaleMax = Math.max(st.scaleMax, hochrechnung ? up500(hochrechnung * 1.1) : 0);
  const schritt = Math.max(50, Math.round(scaleMax / 120 / 50) * 50);
  const kurve = [];
  for (let c = 0; c <= scaleMax; c += schritt) {
    kurve.push({ c, tief: gesamt(lowFra, lowPremium, c), hoch: gesamt(highFra, highPremium, c) });
  }
  // Linien brauchen keine Null-Grundlinie (Säulen schon): die y-Achse läuft vom tiefsten
  // zum höchsten Gesamtwert, auf 500 gerundet — sonst kleben beide Linien oben und das Kreuz
  // verschwindet (Prämien ≈ 6–9 Tsd., Unterschied ≈ 1–2 Tsd.).
  const alle = kurve.flatMap((p) => [p.tief, p.hoch]);
  const yMin = Math.floor(Math.min(...alle) / 500) * 500;
  const yMax = Math.ceil(Math.max(...alle) / 500) * 500;
  return {
    ...st, scaleMax, kurve, yMin, yMax, hochrechnung,
    gesamtBei: (c) => ({ tief: gesamt(lowFra, lowPremium, c), hoch: gesamt(highFra, highPremium, c) }),
  };
}

// ─── Gemeinsame Franchise-Rechnung (seit 25.09.2026 hier, vorher in PraemienOrientierung) ───
// Eine Wahrheit für Prämien-Seite und Dashboard-Instrument: dieselbe Altersklasse, derselbe
// Optimierer, dieselben Gesundheitskosten des laufenden Jahres.
export function ageClassFromBirth(dateStr, heute = new Date()) {
  if (!dateStr) return 'erwachsen';
  const birth = new Date(dateStr);
  const age = heute.getFullYear() - birth.getFullYear() - (heute < new Date(heute.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
  if (age < 19) return 'kind';
  if (age < 26) return 'jung';
  return 'erwachsen';
}

export function parseFranchise(val) {
  if (!val) return null;
  const s = String(val).replace(/[^0-9]/g, '');
  return s ? Number(s) : null;
}

// Franchise-Optimierer: tiefste vs höchste verfügbare Franchise (Mit-Unfall) der eigenen Kasse —
// Prämien-Ersparnis/Jahr, max. Eigenanteil/Jahr (Reserve = Franchise + Selbstbehalt-Max) und
// Break-even (Gesundheitskosten/Jahr, unter denen die hohe Franchise günstiger ist).
export function franchiseOptimierer(allFranchises, ageClass) {
  const fras = allFranchises;
  if (!fras || fras.length < 2) return null;
  const low = fras[0], high = fras[fras.length - 1];
  if (!low.premium || !high.premium || high.franchise <= low.franchise) return null;
  const annualSaving = Math.round((low.premium - high.premium) * 12);
  if (annualSaving <= 0) return null;
  const sbMax = ageClass === 'kind' ? SELBSTBEHALT_MAX_KINDER : SELBSTBEHALT_MAX;
  const reserve = high.franchise + sbMax;
  let breakEven = null;
  for (let c = 0; c <= high.franchise + 8000; c += 50) {
    const totalLow = low.premium * 12 + berechneFranchise(low.franchise, c, sbMax).eigenanteil;
    const totalHigh = high.premium * 12 + berechneFranchise(high.franchise, c, sbMax).eigenanteil;
    if (totalHigh > totalLow) { breakEven = c; break; }
  }
  return { lowFra: low.franchise, highFra: high.franchise, lowPremium: low.premium, highPremium: high.premium, annualSaving, reserve, sbMax, breakEven };
}

// Laufende, KVG-anrechenbare Gesundheitskosten dieses Jahres (aus den KK-Belegen).
export function gesundheitskostenBisher(data, heute = new Date()) {
  const jahr = heute.getFullYear();
  const belege = Array.isArray(data?.versicherungen?.kkBelege) ? data.versicherungen.kkBelege : [];
  const belegJahr = (b) => (b.datum ? Number(String(b.datum).slice(0, 4)) : jahr);
  return belege.filter((b) => belegJahr(b) === jahr).reduce((s, b) => s + (Number(b.betrag) || 0), 0);
}

// Erster Vorschlag fürs Dashboard-Instrument (Wunsch 25.09.2026: statt «lohnt sich hoch oder
// tief?» schon eine Einschätzung). Nur aus dem, was das Kreuz zeigt — keine neue Regel:
//   basis   = Hochrechnung aufs Jahr; ohne Kosten oder vor Tag 60 → 'offen'
//   günstiger = hohe Franchise, solange basis ≤ Break-even, sonst die tiefe
//   'passt' wenn die eigene Franchise schon die günstigere ist, sonst 'wechsel'
//   polster: die hohe Franchise nur mit Polster ≥ Reserve (wie der Reserve-Check der Seite)
// Verglichen werden, wie im Optimierer, nur die beiden Enden (tiefste/höchste Franchise).
export function franchiseVorschlag(opt, { costs, eigeneFranchise, ersparnisse, heute = new Date() } = {}) {
  const st = kreuzState(opt, costs, heute);
  // Predeploy 25.09.2026 (Rechts-Prüfung): nur mit Hochrechnung (ab Tag 60) — vorher kippt der
  // Vorschlag fast immer zur hohen Franchise, weil erst wenig Kosten angefallen sind.
  if (!st.show || !(st.costs > 0) || st.hochrechnung == null) return { art: 'offen' };
  const guenstiger = st.hochrechnung <= st.breakEven ? opt.highFra : opt.lowFra;
  // Polster auch bei «passt»: wer die hohe Franchise schon hat, aber die Reserve nicht trägt.
  const polster = guenstiger === opt.highFra && (Number(ersparnisse) || 0) < opt.reserve;
  if (eigeneFranchise === guenstiger) return { art: 'passt', franchise: guenstiger, polster };
  return { art: 'wechsel', franchise: guenstiger, polster };
}
