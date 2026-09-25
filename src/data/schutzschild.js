import { BVG_PARAMS } from './ahvRechner.js';
import { dreizehnterStatus, hauptlohnMonate } from '../utils/dreizehnter.js';
import { lohnBasis } from '../utils/jahreslohnAusProfil.js';

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
//
// Das Jahreseinkommen für die BVG-Eintrittsschwelle — für beide Aufrufer (Kapitel Versicherungen,
// Instrumente-Panel) nur hier. Die Schwelle misst den AHV-Jahreslohn, der 13. Monatslohn gehört
// dazu (BVG Art. 7 Abs. 2 i. V. m. AHVG Art. 5 Abs. 2): dieselbe Regel wie Steuer und IPV
// (utils/dreizehnter.js). Vorher ×12 — mit 13. knapp unter der Schwelle fiel die BVG-Pflicht weg.
// Die Schwelle ist BRUTTO, `monthlyIncome` oft netto (incomeType, jahreslohnAusProfil.js/lohnBasis).
// Netto liegt tiefer: über der Schwelle ist die Pflicht damit belegt, darunter nicht ausgeschlossen
// — dann `bvgUnklar` (schildState), und der Schild sagt es, statt die Pensionskasse still wegzulassen.
export function jahreseinkommenFuerSchild(finanzen = {}) {
  return (Number(finanzen?.monthlyIncome) || 0) * hauptlohnMonate(finanzen?.dreizehnter);
}

// Die Optionen für schildState aus dem Profil — für beide Aufrufer gleich.
export function schildOptionen(data = {}) {
  return {
    employed: data?.finanzen?.employmentType === 'employed',
    annualIncome: jahreseinkommenFuerSchild(data?.finanzen),
    // 13. offen: ×12 gerechnet. Läge erst ×13 über der Schwelle, ist die Pflicht offen, nicht weg.
    annualIncomeMit13: dreizehnterStatus(data?.finanzen?.dreizehnter) === 'offen'
      ? (Number(data?.finanzen?.monthlyIncome) || 0) * 13 : null,
    lohnBasis: lohnBasis(data?.finanzen),
  };
}
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
  const einkommen = Number(opts.annualIncome) || 0;
  const bvgPflicht = employed && einkommen >= BVG_PARAMS.eintrittsschwelle;
  const bvgErfasst = has(v.bvgInsurer) || Number(v.bvgContribution) > 0 || Number(v.bvgBalance) > 0;
  // Unter der Schwelle, aber nicht als Brutto erfasst: ob die Pflicht besteht, ist offen (siehe oben).
  // Nicht als Lücke gezählt (keine falsche Lücke), aber benannt. Ist eine Kasse erfasst, erübrigt es sich.
  const bvgUnklarBasis = employed && !bvgPflicht && einkommen > 0 && opts.lohnBasis !== 'brutto' && !bvgErfasst;
  // Abschluss-Prüfung 25.09.2026: Brutto, 13. offen, ×12 knapp unter, ×13 über der Schwelle → offen.
  const bvgUnklar13 = employed && !bvgPflicht && !bvgErfasst && Number(opts.annualIncomeMit13) >= BVG_PARAMS.eintrittsschwelle;
  const bvgUnklar = bvgUnklarBasis || bvgUnklar13;
  const bvgUnklarGrund = bvgUnklar13 && !bvgUnklarBasis ? 'dreizehnter' : bvgUnklarBasis ? 'basis' : null;

  const pflicht = groupStat([
    { key: 'kk', covered: has(v.kkInsurer), applicable: true },
    { key: 'uvg', covered: ['yes', 'employer', 'private'].includes(v.uvg), applicable: employed },
    { key: 'bvg', covered: bvgErfasst, applicable: bvgPflicht },
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

  return { pflicht, empfohlen, overall, touched, bvgUnklar, bvgUnklarGrund, bvgSchwelle: BVG_PARAMS.eintrittsschwelle };
}
