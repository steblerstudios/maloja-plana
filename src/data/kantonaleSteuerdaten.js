// Kantons- und Gemeindesteuer — grobe Schätzung für den Hauptort, ohne Kirchensteuer.
//
// E38 (16.09.2026): Die Zahl kommt aus einer Stütztabelle je Kanton, Zivilstand und Kinderzahl,
// gemessen am ESTV-Steuerrechner, Steuerjahr 2026 (src/data/kantonssteuerTabelle.js, generiert von
// scripts/steuerband-messen.mjs; Methode und Fehler: docs/sources/kantonssteuer-tabelle-2026.md).
// Zwischen zwei Messpunkten wird linear interpoliert, ausserhalb der Tabelle gibt es keine Zahl.
// Bis E37 stand hier ein Faktor × Bundessteuer; er lag bei mittleren Einkommen 44–70 % zu tief
// und ist entfernt.
//
// Diese Datei wird nur von lazy geladenen Seiten importiert (TaxCalculator, FinanzUebersicht,
// BehoerdenDossier) — die Tabelle landet damit nicht im Hauptbundle.

import {
  KANTONSSTEUER_TABELLE,
  KANTONSSTEUER_STEUERJAHR,
  KANTONSSTEUER_ABGERUFEN,
  KANTONSSTEUER_MAX_KINDER,
} from './kantonssteuerTabelle.js';
import { bundessteuerAusSteuerbarem } from './steuerRechner.js';
import { getHouseholdInfo } from '../config/cantonalData.js';
import { steuerkantonVorbelegung } from '../utils/steuerkanton.js';

const HAUPTORTE = {
  AG: 'Aarau',
  AI: 'Appenzell',
  AR: 'Herisau',
  BE: 'Bern',
  BL: 'Liestal',
  BS: 'Basel',
  FR: 'Freiburg',
  GE: 'Genf',
  GL: 'Glarus',
  GR: 'Chur',
  JU: 'Delémont',
  LU: 'Luzern',
  NE: 'Neuenburg',
  NW: 'Stans',
  OW: 'Sarnen',
  SG: 'St. Gallen',
  SH: 'Schaffhausen',
  SO: 'Solothurn',
  SZ: 'Schwyz',
  TG: 'Frauenfeld',
  TI: 'Bellinzona',
  UR: 'Altdorf',
  VD: 'Lausanne',
  VS: 'Sion',
  ZG: 'Zug',
  ZH: 'Zürich',
};

// Reihe [x0, y0, x1, y1, …] mit streng steigendem x. Ausserhalb → null (keine Extrapolation).
export function interpoliere(reihe, x) {
  if (!Array.isArray(reihe) || reihe.length < 4 || !Number.isFinite(x)) return null;
  if (x < reihe[0] || x > reihe[reihe.length - 2]) return null;
  for (let i = 2; i < reihe.length; i += 2) {
    if (x <= reihe[i]) {
      const x0 = reihe[i - 2];
      const y0 = reihe[i - 1];
      return y0 + ((x - x0) / (reihe[i] - x0)) * (reihe[i + 1] - y0);
    }
  }
  return null;
}

/**
 * Welche Tabellenreihe gilt? null = für diese Lage nicht gemessen.
 * Ledig mit Kindern ist in der Tabelle alleinerziehend (Kinder im gleichen Haushalt); das gilt
 * nur mit der Bestätigung aus dem Steuerrechner (taxData.elterntarif), sonst keine Reihe.
 */
export function kantonssteuerReihe(kuerzel, { verheiratet = false, kinder = 0, elterntarif = false } = {}) {
  const kanton = KANTONSSTEUER_TABELLE[kuerzel];
  if (!kanton) return null;
  if (!Number.isInteger(kinder) || kinder < 0 || kinder > KANTONSSTEUER_MAX_KINDER) return null;
  if (!verheiratet && kinder > 0 && elterntarif !== true) return null;
  return kanton[verheiratet ? 'verheiratet' : 'ledig'][kinder] || null;
}

/**
 * Die eine Regel für alle Aufrufer (TaxCalculator, FinanzUebersicht, BehoerdenDossier).
 *
 * @param {object} p
 * @param {string} p.kanton              Kantonskürzel (Steuerkanton)
 * @param {number} p.steuerbaresEinkommen steuerbares Einkommen, aus dem auch die Bundessteuer gerechnet ist
 * @param {number} p.bundessteuer         Bundessteuer (steuerRechner.js) — nur für die Summe
 * @param {boolean} [p.verheiratet]
 * @param {number}  [p.kinder]
 * @param {boolean} [p.elterntarif]       Bestätigung für Nicht-Verheiratete mit Kindern
 * @returns {{ lage: 'keinKanton'|'ungeprueft'|'ausserhalb'|'innerhalb',
 *             bereich: {min:number,max:number}|null, kantonal: object|null }}
 *   lage 'innerhalb'  → kantonal = { kanton, hauptort, kantonalUndGemeinde, bundessteuer, total }
 *   lage 'ausserhalb' → Tabelle vorhanden, Einkommen nicht darin → keine Zahl
 *   lage 'ungeprueft' → keine Tabelle für diese Lage → keine Zahl
 */
export function schaetzeKantonaleSteuer({ kanton, steuerbaresEinkommen, bundessteuer = 0, verheiratet = false, kinder = 0, elterntarif = false } = {}) {
  if (!kanton) return { lage: 'keinKanton', bereich: null, kantonal: null };
  const reihe = kantonssteuerReihe(kanton, { verheiratet, kinder, elterntarif });
  if (!reihe) return { lage: 'ungeprueft', bereich: null, kantonal: null };
  const bereich = { min: reihe[0], max: reihe[reihe.length - 2] };
  const wert = interpoliere(reihe, Number(steuerbaresEinkommen));
  if (wert === null) return { lage: 'ausserhalb', bereich, kantonal: null };
  const kantonalUndGemeinde = Math.round(wert);
  const bund = Math.round(Number(bundessteuer) || 0);
  return {
    lage: 'innerhalb',
    bereich,
    kantonal: {
      kanton,
      hauptort: HAUPTORTE[kanton],
      kantonalUndGemeinde,
      bundessteuer: bund,
      total: bund + kantonalUndGemeinde,
    },
  };
}

// ── Vom Nettolohn zur x-Achse der Tabelle ─────────────────────────────────────────────────
// Die Tabelle ist nach dem steuerbaren Einkommen Bund der ESTV geordnet, also NACH den
// Standardabzügen, die der ESTV-Rechner vom Nettolohn abzieht. Die App kennt nur den Nettolohn
// und die selbst erfassten Abzüge. Damit die Tabelle mit derselben Grösse gelesen wird, mit der
// sie gemessen wurde, zieht diese Funktion dieselben Posten ab. Beträge so, wie sie der
// ESTV-Steuerrechner 2026 ausweist (docs/sources/nettolohn-abzuege-2026.messpunkte.json; das
// Skript prüft die Formel an allen Messpunkten, docs/sources/kantonssteuer-tabelle-2026.md):
//   «Übrige Berufsauslagen»: 3 % des Nettolohns, mindestens 2 000, höchstens 4 000
//   «Abzug private Versicherungen / Sparzinsen»: 1 800 (verheiratet 3 700) + 700 je Kind;
//      ohne BVG-Beitrag der Grundbetrag × 1,5 (ESTV bei Bruttolohn 20 000 und 22 500)
//   «Abzug verheiratete Steuerpflichtige»: 2 800
//   «Kindersozialabzug»: 6 800 je Kind
// Rechtsgrundlagen (vgl.): DBG Art. 26, 33 Abs. 1 lit. g und Abs. 1bis, 35 Abs. 1 lit. a und c.
// Seit E39 rechnet auch die Bundessteuer mit diesem steuerbaren Einkommen (steuernFuerProfil).
export const ESTV_ABZUEGE_2026 = {
  berufsauslagen: { satz: 0.03, min: 2000, max: 4000 },
  versicherung: { ledig: 1800, verheiratet: 3700, proKind: 700, ohneBvgFaktor: 1.5 },
  // Kleinster gemessener Nettolohn MIT BVG-Beitrag (Brutto 25 000); darunter rechnet die ESTV ohne.
  bvgAbNettolohn: 23111,
  verheiratete: 2800,
  kind: 6800,
};

/**
 * Steuerbares Einkommen Bund so, wie es der ESTV-Rechner aus einem Nettolohn ableitet.
 * @param {object} p
 * @param {number} p.nettolohnJahr
 * @param {boolean} [p.verheiratet]
 * @param {number} [p.kinder]
 * @param {number} [p.berufsauslagen] selbst erfasste Berufsauslagen; > 0 ersetzt die Pauschale
 * @param {number} [p.weitereAbzuege] übrige selbst erfasste Abzüge (3a, Schuldzinsen, …)
 */
export function steuerbarNachEstv({ nettolohnJahr, verheiratet = false, kinder = 0, berufsauslagen = 0, weitereAbzuege = 0 }) {
  const a = ESTV_ABZUEGE_2026;
  const netto = Number(nettolohnJahr) || 0;
  if (netto <= 0) return 0;
  // E39: abgerundet. An allen 30 gemessenen Nettolöhnen mit einer Pauschale zwischen 2 000 und 4 000
  // weist die ESTV den abgerundeten Wert aus (z. B. 3 % von 114 329 = 3 429.87 → 3 429); kaufmännisch
  // gerundet traf nur jeder zweite. Beim Nettolohn 114 329 lag das steuerbare Einkommen damit CHF 1 zu
  // tief (109 099 statt 109 100), die Abrundung auf 100 Franken (Form. 58c) kippte, und die
  // Bundessteuer lag bis CHF 8.45 neben der ESTV.
  const pauschale = Math.floor(Math.min(a.berufsauslagen.max, Math.max(a.berufsauslagen.min, netto * a.berufsauslagen.satz)));
  const ba = Number(berufsauslagen) > 0 ? Number(berufsauslagen) : pauschale;
  const grund = verheiratet ? a.versicherung.verheiratet : a.versicherung.ledig;
  const vers = grund * (netto < a.bvgAbNettolohn ? a.versicherung.ohneBvgFaktor : 1) + a.versicherung.proKind * kinder;
  const x = netto - ba - vers - (verheiratet ? a.verheiratete : 0) - a.kind * kinder - (Number(weitereAbzuege) || 0);
  return Math.max(0, Math.round(x));
}

// Selbst erfasste Abzüge aus dem Steuerrechner (data.taxData): Berufsauslagen getrennt, weil sie
// die Pauschale ersetzen.
const WEITERE_ABZUEGE = ['pension3a', 'debtInterest', 'maintenance', 'education', 'other'];
export function abzuegeAusTaxData(taxData = {}) {
  return {
    berufsauslagen: Number(taxData?.workCosts) || 0,
    weitereAbzuege: WEITERE_ABZUEGE.reduce((s, k) => s + (Number(taxData?.[k]) || 0), 0),
  };
}

/**
 * Die Regel, die TaxCalculator, FinanzUebersicht und BehoerdenDossier gemeinsam nutzen.
 * Leitet aus den Angaben der App die x-Achse der Tabelle ab und schätzt dann.
 *   direktSteuerbar > 0      → dieser Wert (steuerbares Einkommen direkte Bundessteuer)
 *   sonst Nettolohn          → steuerbarNachEstv()
 * Keine Zahl ('ungeprueft'), wenn die Lage nicht gemessen ist:
 *   Partnereinkommen > 0 (Doppelverdiener oder Konkubinat), Lohn als Bruttolohn erfasst
 *   (die Abzüge vom Brutto kennt die App nicht), sowie die Fälle aus schaetzeKantonaleSteuer().
 * @returns {{ lage, bereich, kantonal, steuerbar: number|null, grund: string|null }}
 */
export function kantonssteuerFuerProfil({
  kanton, nettolohnJahr = 0, direktSteuerbar = 0, einkommensart = null, partnerEinkommen = 0,
  verheiratet = false, kinder = 0, elterntarif = false, berufsauslagen = 0, weitereAbzuege = 0, bundessteuer = 0,
} = {}) {
  if (!kanton) return { lage: 'keinKanton', bereich: null, kantonal: null, steuerbar: null, grund: null };
  const direkt = Number(direktSteuerbar) > 0;
  let grund = null;
  if (Number(partnerEinkommen) > 0) grund = 'partner';
  else if (!direkt && einkommensart === 'brutto') grund = 'brutto';
  if (grund) return { lage: 'ungeprueft', bereich: null, kantonal: null, steuerbar: null, grund };
  const steuerbar = steuerbaresEinkommenFuerProfil({ nettolohnJahr, direktSteuerbar, verheiratet, kinder, berufsauslagen, weitereAbzuege }).steuerbar ?? 0;
  return { ...schaetzeKantonaleSteuer({ kanton, steuerbaresEinkommen: steuerbar, bundessteuer, verheiratet, kinder, elterntarif }), steuerbar, grund: null };
}

/**
 * E39: EIN steuerbares Einkommen je Profil — für die Bundessteuer und für die Kantonstabelle.
 *   direktSteuerbar > 0 → dieser Wert (quelle 'direkt'; aus der Veranlagung, Bund)
 *   Lohn als Bruttolohn erfasst → keine Zahl (grund 'brutto'): die Abzüge vom Brutto kennt die App nicht
 *   Partnereinkommen > 0 und verheiratet → keine Zahl (grund 'partner'): Einkommen der Ehegatten
 *     werden zusammengerechnet (DBG Art. 9 Abs. 1), dazu der Zweiverdienerabzug (Art. 33 Abs. 2) —
 *     beides ist nicht gemessen
 *   Partnereinkommen > 0, nicht verheiratet, mit Kindern → keine Zahl (grund 'partner'): bei getrennt
 *     besteuerten Eltern wird der Kinderabzug unter Umständen hälftig aufgeteilt (Art. 35 Abs. 1 lit. a)
 *   sonst Nettolohn → steuerbarNachEstv() (quelle 'estv'). Konkubinat ohne Kinder: nur das eigene
 *     Einkommen zählt (keine Zusammenrechnung), die Abzüge sind die einer alleinstehenden Person.
 *   Mehr als 3 Kinder: die Abzüge je Kind gelten weiter (Bund rechnet, nur die Kantonstabelle nicht).
 * @returns {{ steuerbar: number|null, quelle: 'direkt'|'estv'|null, grund: 'brutto'|'partner'|'keinLohn'|null }}
 */
export function steuerbaresEinkommenFuerProfil({
  nettolohnJahr = 0, direktSteuerbar = 0, einkommensart = null, partnerEinkommen = 0,
  verheiratet = false, kinder = 0, berufsauslagen = 0, weitereAbzuege = 0,
} = {}) {
  if (Number(direktSteuerbar) > 0) return { steuerbar: Number(direktSteuerbar), quelle: 'direkt', grund: null };
  if (einkommensart === 'brutto') return { steuerbar: null, quelle: null, grund: 'brutto' };
  if (Number(partnerEinkommen) > 0 && (verheiratet || kinder > 0)) return { steuerbar: null, quelle: null, grund: 'partner' };
  if (!(Number(nettolohnJahr) > 0)) return { steuerbar: null, quelle: null, grund: 'keinLohn' };
  return { steuerbar: steuerbarNachEstv({ nettolohnJahr, verheiratet, kinder, berufsauslagen, weitereAbzuege }), quelle: 'estv', grund: null };
}

/**
 * E39: Die Eingaben der Steuerschätzung aus dem Profil — gleich für alle drei Seiten.
 * Nettolohn = Hauptlohn + Nebenerwerb (je × 12). Ist einer der beiden als Bruttolohn erfasst,
 * gilt die Einkommensart 'brutto'.
 */
export function steuerEingabenAusDaten(data = {}) {
  const f = data?.finanzen || {};
  const hh = getHouseholdInfo(data);
  const neben = Number(f.sideIncome) || 0;
  return {
    kanton: steuerkantonVorbelegung(data),
    nettolohnJahr: ((Number(f.monthlyIncome) || 0) + neben) * 12,
    direktSteuerbar: Number(f.taxableIncome) || 0,
    einkommensart: f.incomeType === 'brutto' || (neben > 0 && f.sideIncomeType === 'brutto') ? 'brutto' : (f.incomeType || null),
    partnerEinkommen: hh.partnerIncome,
    verheiratet: data?.basis?.maritalStatus === 'married',
    kinder: hh.childrenCount,
    elterntarif: data?.taxData?.elterntarif === true,
    ...abzuegeAusTaxData(data?.taxData),
  };
}

/**
 * E39: Bundessteuer und Kantons-/Gemeindesteuer aus demselben steuerbaren Einkommen.
 * @returns {{ steuerbar, quelle, grund, bund: object|null, kanton: object }}
 *   bund = null, wenn es kein steuerbares Einkommen gibt (grund sagt warum).
 */
export function steuernFuerProfil(p = {}) {
  const basis = steuerbaresEinkommenFuerProfil(p);
  const bund = basis.steuerbar == null ? null : bundessteuerAusSteuerbarem({
    steuerbaresEinkommen: basis.steuerbar,
    verheiratet: p.verheiratet, kinder: p.kinder, elterntarif: p.elterntarif,
    einkommen: p.nettolohnJahr,
  });
  const kanton = kantonssteuerFuerProfil({ ...p, bundessteuer: bund ? bund.steuer : 0 });
  return { ...basis, bund, kanton };
}

export function getHauptort(kuerzel) {
  return HAUPTORTE[kuerzel] || null;
}

export const KANTONAL_DATA_VERSION = String(KANTONSSTEUER_STEUERJAHR);
export const KANTONAL_DATA_ABGERUFEN = KANTONSSTEUER_ABGERUFEN;
export const KANTONAL_DATA_SOURCE = 'ESTV Steuerrechner, Steuerjahr ' + KANTONSSTEUER_STEUERJAHR + ', Kantonshauptort, ohne Kirchensteuer';
export const KANTONAL_MAX_KINDER = KANTONSSTEUER_MAX_KINDER;
