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
// und die Anzeige darf daraus KEINE Aussage zur Lage ableiten
// (CHF 3000 bei 50% sind CHF 6000 hochgerechnet, nicht CHF 3000).
// Siehe denselben Grundsatz in `lohnCheck.pruefeStundenlohn`.
//
// ⚠️ DREI FUNDE AUS PREDEPLOY-RUNDE 8 sitzen in dieser Datei — Kurzfassung, damit der
// nächste Umbau sie nicht wieder einbaut:
//  1. Der Nenner war 42 (Mindestlohn-Welt) gegen einen 40-Std.-Median (BFS-Norm).
//     Jetzt `LSE_VOLLZEIT_STUNDEN_WOCHE` (40, amtlich belegt in `branchenLohn.js`).
//  2. Hochgerechnet wurde nur NACH UNTEN (`stunden < 42`): wer 45 Std. arbeitete, behielt
//     den Rohlohn — das Barometer sprach eine echte Mindestlohn-Unterschreitung frei,
//     während das Kapitel sie meldete. Jetzt wird bei bekannten Stunden IMMER normalisiert.
//  3. Der Mindestlohn-Befund wurde hier ein ZWEITES Mal gerechnet. Jetzt kommt er aus
//     `pruefeStundenlohn` — eine Wahrheit, kein zweiter Rechenweg.
// Der Kommentar hier behauptete ausserdem „CHF 3000 bei 50% sind CHF 6800" — es sind 6000.

import { LSE_VERTEILUNG, LSE_VOLLZEIT_STUNDEN_WOCHE } from './branchenLohn.js';
// ⚠️ Bewusst OHNE `STUNDEN_PRO_MONAT` (182 = 42-Std.-Mindestlohn-Welt): Dieses Modul rechnet
// durchgehend auf der LSE-Norm (40 Std.). Wer die 182 hier wieder importiert, holt die
// Zwei-Welten-Krankheit zurück — siehe `mindestlohnBoden`.
import { getMindestlohn, pruefeStundenlohn } from './lohnCheck.js';

export const LOHN_REFERENZ = {
  median: LSE_VERTEILUNG.median,
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

// Kantonaler Mindestlohn als Monatsbetrag — auf der LSE-NORM (40 Std./Woche), weil er als
// Marke auf DIESEM Balken sitzt und der Balken `incomeFTE` zeigt (ebenfalls auf 40 Std.).
//
// ⚠️ Predeploy-Runde 8, ZWEITE Batterie (Qualitäts-Prüfer, gegen den Fix selbst): Hier stand
// `STUNDEN_PRO_MONAT` (182 = 42-Std.-Welt) — also genau die Zwei-Welten-Krankheit, die
// dieselbe Runde in `pruefeStundenlohn` behoben und auf dem Barometer übersehen hat.
// Folge: GE, exakt am Boden bei 42 Std. (CHF 4'475) → Balken bei 4'262, „!"-Marke bei 4'475.
// Der Balken stand LINKS der Marke — sah unterschritten aus —, während `mlBreached` korrekt
// `false` war und der Text schwieg. Füllung und Marke widersprachen einander, systematisch
// um 5 %. Eine Skala, ein Nenner.
//
// Der RECHTLICHE Boden bleibt der Stundenlohn (kantonales Recht); die 182-Rechnung ist die
// Illustration „bei Vollzeit" und lebt weiter in `pruefeStundenlohn`/`mindestMonat`. Hier
// geht es nur um die Position auf einer 40-Std.-Skala.
export function mindestlohnBoden(canton) {
  const ml = getMindestlohn(canton);
  if (!ml) return null;
  return {
    chfStunde: ml.chfStunde,
    monat: Math.round(ml.chfStunde * (LSE_VOLLZEIT_STUNDEN_WOCHE * 52 / 12)),
    jahr: ml.jahr,
  };
}

// Lage des Lohns auf dem Barometer.
// { show, income, incomeFTE, partTime, overFullTime, hoursKnown, hoursPerWeek,
//   rel: 'near'|'above'|'below'|null, pct, delta, median,
//   mindestlohn, mlBreached, befundStatus, scaleMin, scaleMax }
export function lohnBandState({ income, canton, hoursPerWeek, incomeType } = {}) {
  const lohn = num(income);
  const stunden = num(hoursPerWeek);
  const median = LOHN_REFERENZ.median;

  if (lohn <= 0) return { show: false };

  const hoursKnown = stunden > 0;

  // JEDES Bezugsmass auf diesem Barometer ist BRUTTO: der BFS-Median ist ein
  // „Bruttomedianlohn", der kantonale Mindestlohn ein Brutto-Stundenlohn. Ein Netto-Lohn
  // ist mit keinem davon vergleichbar — und die App rät im Feld-Hinweis zu Netto.
  // Ohne ausdrückliches 'brutto' sagt dieses Instrument darum GAR NICHTS.
  // (Predeploy-Runde 8 fixte zuerst nur den Mindestlohn; die Median-Aussage lief weiter
  // und erklärte einen Netto-Lohn für „unter dem Schweizer Median". Halber Fix = Fehler.)
  const basisKnown = incomeType === 'brutto';

  // Mindestlohn-Befund NICHT selbst rechnen — `pruefeStundenlohn` ist die eine Wahrheit.
  // Sie kennt die Netto/Brutto-Regel ebenfalls; damit sagen Kapitel und Barometer per
  // Konstruktion dasselbe, nicht per Zufall.
  const befund = pruefeStundenlohn(lohn, stunden, canton, incomeType);
  const mlBreached = befund.status === 'unterMindestlohn';

  // Vergleichbar ist der Lohn nur mit BEIDEM: bekannter Basis und bekannten Stunden.
  const comparable = basisKnown && hoursKnown;

  // Hochrechnung auf die LSE-Norm (40 Std./Woche) — nur mit bekannten Stunden.
  // IMMER normalisieren, wenn die Stunden da sind: auch nach unten, wenn jemand mehr
  // als Vollzeit arbeitet. Sonst wird ein 45-Std.-Lohn mit einem 40-Std.-Median verglichen.
  const incomeFTE = hoursKnown
    ? Math.round(lohn / (stunden / LSE_VOLLZEIT_STUNDEN_WOCHE))
    : lohn;
  const partTime = hoursKnown && stunden < LSE_VOLLZEIT_STUNDEN_WOCHE;
  const overFullTime = hoursKnown && stunden > LSE_VOLLZEIT_STUNDEN_WOCHE;

  // Ohne bekannte Stunden ist die Lage gegenüber einem VOLLZEIT-Median nicht bestimmbar;
  // ohne bekannte Basis ist sie es gegenüber einem BRUTTO-Median ebenso wenig.
  // Vorher stand hier trotzdem ein `rel` — die Anzeige machte daraus „Ihr Lohn liegt unter
  // dem Schweizer Median", also genau die Vollzeit-Annahme, die `c56272f` abgeschafft hat.
  // Kein Ersatz-Urteil: `rel: null`, die Anzeige lädt zum Nachtragen ein.
  const delta = comparable ? incomeFTE - median : null;
  const rel = !comparable ? null
    : Math.abs(delta) / median <= NEAR_TOLERANZ ? 'near'
    : (delta > 0 ? 'above' : 'below');
  const pct = comparable ? Math.round(Math.abs(delta) / median * 100) : null;

  return {
    show: true,
    income: lohn,
    incomeFTE,
    partTime,
    overFullTime,
    hoursKnown,
    basisKnown,
    comparable,
    einkommensart: incomeType || null,
    hoursPerWeek: stunden,
    rel,
    pct,
    delta,
    median,
    mindestlohn: mindestlohnBoden(canton),
    mlBreached,
    befundStatus: befund.status,
    scaleMin: SCALE_MIN,
    scaleMax: SCALE_MAX,
  };
}
