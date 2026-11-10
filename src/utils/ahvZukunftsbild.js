// AHV im Zukunftsbild des Vorsorge-Rechners (Bugsuche 09.11.2026, B-18).
//
// Der Regler im Zukunftsbild setzt das RÜCKTRITTSalter (ab 58, wegen BVG/3a). Die AHV kommt
// aber frühestens mit dem Vorbezug (siehe fruehesterAhvBezugImBildMonate unten). Vorher rechnete das Bild die AHV ab dem
// Rücktritt: bei 58 rund 84 Monate Vorbezugsrente zu viel, und wer früher aufhörte, sah ein
// GRÖSSERES AHV-Fundament.
//
// Wer vor dem frühesten Bezug aufhört, bleibt bis zum Referenzalter beitragspflichtig
// (als Nichterwerbstätige, AHVG Art. 3) — die AHV rechnet deshalb wie bei Bezug am frühesten Tag.

import { VORBEZUG_MAX_MONATE } from '../data/lohnAbzuege.js';

// Frühester AHV-Bezug, den das Bild zeigt (Monate): so früh, wie berechneAltersrente rechnen kann
// (höchstens VORBEZUG_MAX_MONATE vor dem Referenzalter), und nie vor 63 — so nennen es auch die
// Texte (vr.zukunftSzenarioAhvFrueh/-Bridge). Frauen der Übergangsgeneration dürften ab 62
// beziehen (fruehesterVorbezugMonate, Art. 40c AHVG), ihre tieferen Kürzungssätze bildet der
// Rechner aber noch nicht ab (D10). Bis dahin zeigt das Bild für sie konservativ 63
// (Fachprüfung swiss-precision-pruefer, 09.11.2026).
export const fruehesterAhvBezugImBildMonate = (refAlterMonate) =>
  Math.max(refAlterMonate - VORBEZUG_MAX_MONATE, 63 * 12);

// AHV-Bezugsalter in Jahren zu einem Rücktrittsalter: nie vor dem frühesten Vorbezug.
export const ahvBezugAlterFuer = (ruecktrittJahre, fruehesterBezugMonate) =>
  Math.max(Number(ruecktrittJahre) || 0, fruehesterBezugMonate / 12);

// AHV als Fläche im Zukunftsbild: Monatsrente × Monate vom AHV-Bezug bis zur Lebenserwartung,
// bis zum Referenzalter die (gekürzte) Vorbezugsrente, danach die neu berechnete.
export const ahvKapitalImBild = ({ ruecktrittJahre, fruehesterBezugMonate, refAlterJahre, lebenserwartung, monatsrente, monatsrenteReferenzalter }) => {
  const bezug = ahvBezugAlterFuer(ruecktrittJahre, fruehesterBezugMonate);
  const horizonM = Math.max(12, Math.round((lebenserwartung - bezug) * 12));
  const vorbezugM = Math.min(horizonM, Math.max(0, Math.round((refAlterJahre - bezug) * 12)));
  return { bezug, horizonM, vorbezugM, kapital: monatsrente * vorbezugM + monatsrenteReferenzalter * (horizonM - vorbezugM) };
};
