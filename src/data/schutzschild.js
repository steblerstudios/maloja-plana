import { BVG_PARAMS } from './ahvRechner.js';

// Reine Logik für den Versicherungs-Schutzschild — kein React, damit testbar.
// ZWEI Schilde, weil das Gesetz zwei Dinge unterscheidet:
//   • Pflicht    — gesetzlich vorgeschrieben. Krankenversicherung für ALLE
//                  (KVG Art. 3); Unfall (UVG) + Pensionskasse (BVG) für
//                  Angestellte (BVG erst ab Eintrittsschwelle). Nur was
//                  wirklich gilt, wird gezeigt → keine falschen Lücken.
//   • Empfohlen  — sinnvoll für fast alle, aber freiwillig: Privathaftpflicht,
//                  Hausrat. (Vermieter verlangen sie oft, das Gesetz nicht.)
// Bewusst noch NICHT abgebildet: Auto-Haftpflicht (nur mit Fahrzeug), Gebäude
// (nur mit Eigentum) — mangels sicherem Signal, um falsche Lücken zu vermeiden.
// Eine offene Absicherung ist ein ruhiger Hinweis, kein Alarm.
//
// v = data.versicherungen; opts = { employed, annualIncome }
const has = (x) => x != null && String(x).trim() !== '';

function groupStat(list) {
  const items = list.filter(p => p.applicable !== false);
  const covered = items.filter(p => p.covered).length;
  const total = items.length;
  return {
    items, covered, total,
    fraction: total ? covered / total : 0,
    allCovered: total > 0 && covered === total,
    gaps: items.filter(p => !p.covered).map(p => p.key),
  };
}

export function schildState(v = {}, opts = {}) {
  const employed = opts.employed === true;
  const bvgPflicht = employed && (Number(opts.annualIncome) || 0) >= BVG_PARAMS.eintrittsschwelle;

  const pflicht = groupStat([
    { key: 'kk', covered: has(v.kkInsurer), applicable: true },
    { key: 'uvg', covered: ['yes', 'employer', 'private'].includes(v.uvg), applicable: employed },
    { key: 'bvg', covered: has(v.bvgInsurer) || Number(v.bvgContribution) > 0 || Number(v.bvgBalance) > 0, applicable: bvgPflicht },
  ]);
  const empfohlen = groupStat([
    { key: 'haftpflicht', covered: v.liabilityInsurance === 'yes' },
    { key: 'hausrat', covered: v.householdInsurance === 'yes' },
  ]);

  const touched = has(v.kkInsurer)
    || (v.liabilityInsurance != null && v.liabilityInsurance !== '')
    || (v.householdInsurance != null && v.householdInsurance !== '')
    || (v.uvg != null && v.uvg !== '')
    || has(v.bvgInsurer);

  const covered = pflicht.covered + empfohlen.covered;
  const total = pflicht.total + empfohlen.total;
  const overall = { covered, total, fraction: total ? covered / total : 0 };

  return { pflicht, empfohlen, overall, touched };
}
