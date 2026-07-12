// Reine Logik für den IPV-Pegel — kein React, damit testbar.
// Der Pegel ist ein Anzeige-Instrument ÜBER der bestehenden IPV-Berechnung
// (calculateIPV): er misst NICHTS neu, er liest Grenze, Einkommen und Betrag.
// Bild: Wasser = Jahreseinkommen, Linie = kantonale Einkommensgrenze (maxIncome).
// Liegt das Wasser unter der Linie, besteht Anspruch — der Abstand ist die „Luft".
//
// Vier ehrliche Zustände (kein Alarm, „über der Grenze" ist keine Schuld):
//   empty → kein Kanton / kein Einkommen: leeres Gefäss, Einladung
//   clear → klar unter der Grenze (viel Luft)
//   edge  → knapp unter der Grenze (letzte ~15 %)
//   over  → über der Grenze / kein Anspruch: andere Wege
import { calculateIPV, calculateSozialhilfe, getHouseholdInfo } from '../config/cantonalData.js';

// Anzeige-Skala: das Gefäss reicht etwas über die Grenze hinaus, damit der
// „über der Grenze"-Zustand sichtbar wird (sonst wäre die Grenze der Rand).
export const PEGEL_SCALE = 1.25;

// Hinweis: Aktuell NICHT verdrahtet — das IPV-Instrument ist der Prämien-Beleg
// (Nachbarschafts-Unterscheidung zum Sozialhilfe-Pegel). pegelState(variant 'luft')
// bleibt bewusst erhalten für die Wiederverwendung in einem anderen Kontext.
export function pegelState(data) {
  const canton = data?.basis?.canton || '';
  const hh = getHouseholdInfo(data);
  const income = (Number(data?.finanzen?.monthlyIncome || 0)
    + Number(data?.finanzen?.sideIncome || 0)
    + (hh.partnerIncome || 0)) * 12;
  const ipv = calculateIPV(data);
  const maxIncome = Number(ipv?.cantonData?.maxIncome) || 0;

  // Ohne Kanton/Grenze oder ohne Einkommen: leeres, wartendes Gefäss.
  if (!canton || maxIncome <= 0 || income <= 0) {
    return { show: true, variant: 'luft', mode: 'empty', fraction: 0, income, maxIncome, gap: 0, amount: 0, eligible: false, canton };
  }

  const rawFraction = income / maxIncome;                 // > 1 = über der Grenze
  const eligible = !!ipv?.eligible;
  const gap = Math.max(0, maxIncome - income);            // „Luft" in CHF/Jahr
  let mode;
  if (!eligible || rawFraction >= 1) mode = 'over';
  else if (rawFraction >= 0.85) mode = 'edge';
  else mode = 'clear';

  // Anzeige: „over" zeigt das Wasser mindestens an der Linie; alles bei ~1.15
  // gedeckelt, damit die Optik im Gefäss bleibt.
  let fraction = rawFraction;
  if (mode === 'over') fraction = Math.max(fraction, 1);
  fraction = Math.max(0, Math.min(PEGEL_SCALE, fraction));

  return {
    show: true, variant: 'luft', mode, fraction,
    income, maxIncome, gap,
    amount: eligible ? (Number(ipv.amount) || 0) : 0,
    eligible, canton,
  };
}

// Sozialhilfe als Aufstockungs-Pegel: dieselbe Gefäss-Metapher, andere Lesart.
// Linie = Existenzminimum (totalBedarf), Wasser = Einkommen, die Lücke (deficit)
// wird als Aufstockung gefüllt. Reine Anzeige über calculateSozialhilfe.
export function sozialhilfePegelState(data) {
  const canton = data?.basis?.canton || '';
  const rent = Number(data?.wohnen?.rentAmount || 0);
  const sh = calculateSozialhilfe(data);
  const bedarf = Number(sh?.totalBedarf) || 0;
  const income = Number(sh?.income) || 0;
  const deficit = Number(sh?.deficit) || 0;

  // Ohne Kanton, Miet-Kontext oder Bedarf ist die Berechnung unvollständig.
  if (!canton || rent <= 0 || bedarf <= 0 || income <= 0) {
    return { show: true, variant: 'aufstockung', mode: 'empty', fraction: 0, income, bedarf, amount: 0, canton };
  }

  const rawFraction = income / bedarf;           // 1.0 = am Existenzminimum (Linie)
  const mode = deficit > 0 ? 'gap' : 'covered';
  const fraction = Math.max(0, Math.min(PEGEL_SCALE, rawFraction));
  return {
    show: true, variant: 'aufstockung', mode, fraction,
    income, bedarf, amount: deficit, canton,
  };
}
