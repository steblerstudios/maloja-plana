// ─── Lohn-Einordnung (Barometer) ──────────────────────────────────────────
// Rechnet die Lage des eigenen Lohns gegenüber Median, Durchschnitt und dem
// kantonalen Mindestlohn-Boden. Reine Logik, keine Darstellung.
//
// Spiegelgleich zur Miete gedacht: dort trägt `RegionalBarometer` die Skala,
// hier `components/LohnEinordnung.jsx`. Gleiche Grammatik, andere Domäne.
//
// WAHRHEITS-DISZIPLIN (Maloja = Rechts-/Finanzhilfe):
// Teilzeit wird auf 100% hochgerechnet, damit der Vergleich mit dem Median
// (der ein Vollzeit-Median ist) überhaupt zulässig ist. Sind die Wochenstunden
// NICHT erfasst, ist die Hochrechnung nicht möglich — dann gilt `hoursKnown:false`,
// und die Anzeige darf daraus KEINE Mindestlohn-Unterschreitung ableiten
// (CHF 3000 bei 50% sind CHF 6800 hochgerechnet, nicht CHF 3000).
// Siehe denselben Grundsatz in `lohnCheck.pruefeStundenlohn`.

import { LSE_VERTEILUNG } from './branchenLohn.js';
import { getMindestlohn, STUNDEN_PRO_MONAT, VOLLZEIT_STUNDEN_WOCHE } from './lohnCheck.js';

export const LOHN_REFERENZ = {
  median: LSE_VERTEILUNG.median,
  durchschnitt: LSE_VERTEILUNG.durchschnitt,
  p10: LSE_VERTEILUNG.p10,
  p90: LSE_VERTEILUNG.p90,
  jahr: LSE_VERTEILUNG.jahr,
};

// Feste Skala: unten unter dem tiefsten Mindestlohn-Boden, oben über dem P90.
// Bewusst nicht datenabhängig — der Balken soll zwischen zwei Sitzungen nicht springen.
export const SCALE_MIN = 3000;
export const SCALE_MAX = 13000;

// „Nahe am Median“ — innerhalb ±5%. Darunter/darüber wäre eine Scheingenauigkeit.
const NEAR_TOLERANZ = 0.05;

const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return isFinite(n) ? n : 0;
};

// Kantonaler Mindestlohn als Monatsbetrag (Vollzeit-Boden), oder null wo es keinen gibt.
export function mindestlohnBoden(canton) {
  const ml = getMindestlohn(canton);
  if (!ml) return null;
  return {
    chfStunde: ml.chfStunde,
    monat: Math.round(ml.chfStunde * STUNDEN_PRO_MONAT),
    jahr: ml.jahr,
  };
}

// Lage des Lohns auf dem Barometer.
// { show, income, incomeFTE, partTime, hoursKnown, hoursPerWeek,
//   rel: 'near'|'above'|'below', pct, delta, median, durchschnitt,
//   mindestlohn, scaleMin, scaleMax }
export function lohnBandState({ income, canton, hoursPerWeek } = {}) {
  const lohn = num(income);
  const stunden = num(hoursPerWeek);
  const median = LOHN_REFERENZ.median;

  if (lohn <= 0) return { show: false };

  const hoursKnown = stunden > 0;
  const partTime = hoursKnown && stunden < VOLLZEIT_STUNDEN_WOCHE;
  // Nur mit bekannten Stunden hochrechnen. Ohne sie bleibt der erfasste Lohn stehen —
  // die Anzeige muss dann selbst entscheiden, was sie NICHT behaupten darf.
  const incomeFTE = partTime ? Math.round(lohn / (stunden / VOLLZEIT_STUNDEN_WOCHE)) : lohn;

  const delta = incomeFTE - median;
  const rel = Math.abs(delta) / median <= NEAR_TOLERANZ ? 'near' : (delta > 0 ? 'above' : 'below');
  const pct = Math.round(Math.abs(delta) / median * 100);

  return {
    show: true,
    income: lohn,
    incomeFTE,
    partTime,
    hoursKnown,
    hoursPerWeek: stunden,
    rel,
    pct,
    delta,
    median,
    durchschnitt: LOHN_REFERENZ.durchschnitt,
    mindestlohn: mindestlohnBoden(canton),
    scaleMin: SCALE_MIN,
    scaleMax: SCALE_MAX,
  };
}
