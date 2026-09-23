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
  KANTONSSTEUER_ABGERUFEN_JE_KANTON,
  KANTONSSTEUER_MAX_KINDER,
} from './kantonssteuerTabelle.js';
import { bundessteuerAusSteuerbarem, vergleicheTarife } from './steuerRechner.js';
import { getHouseholdInfo } from '../config/cantonalData.js';
import { steuerkantonVorbelegung } from '../utils/steuerkanton.js';
import { giltAlsVerheiratet } from '../utils/zivilstand.js';

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
//      Quelle (gelesen 17.09.2026): Berufskostenverordnung des EFD, SR 642.118.1, Art. 7 Abs. 1
//      («Übrige Berufskosten») und Anhang Ziff. 1, Fassung in Kraft seit 1. Jan. 2026:
//      «Übrige Berufskosten (Art. 7 Abs. 1) 3 % des Nettolohns, mindestens im Jahr 2000.—
//      höchstens im Jahr 4000.—». Fedlex-Datei:
//      https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1993/1363_1363_1363/20260101/de/html/fedlex-data-admin-ch-eli-cc-1993-1363_1363_1363-20260101-de-html.html
//      Art. 7 Abs. 2 verlangt eine angemessene Kürzung bei Teilzeit oder Erwerb nur während eines
//      Teils des Jahres; diese Kürzung rechnet die Funktion unten nicht (K53, offen gemeldet).
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

// Der Höchstabzug der Säule 3a steht bewusst NICHT hier, sondern in `./saeule3a.js`:
// Saeule3aTracker.jsx wird lazy geladen, und ein Import aus dieser Datei zöge die
// Kantonstabelle (33 KB) und den Rechenkern (14 KB) in dessen Chunk.

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
  erwerbsart = null, partnerAngegeben = true, direktVerheiratet, direktKinder,
} = {}) {
  if (!kanton) return { lage: 'keinKanton', bereich: null, kantonal: null, steuerbar: null, grund: null };
  const direkt = Number(direktSteuerbar) > 0;
  let grund = null;
  // K62.4: ein eingetragener Wert gilt nur für den Zivilstand, zu dem er gehört (siehe unten).
  if (direkt && direktZivilstandAbweichend(verheiratet, direktVerheiratet)) grund = 'zivilstandDirekt';
  // K87: ebenso nur für die Kinderzahl, zu der er gehört.
  else if (direkt && direktKinderAbweichend(kinder, direktKinder)) grund = 'kinderDirekt';
  else if (Number(partnerEinkommen) > 0) grund = 'partner';
  else if (!direkt && einkommensart === 'brutto') grund = 'brutto';
  else if (!direkt && ERWERBSART_OHNE_SCHAETZUNG[erwerbsart]) grund = ERWERBSART_OHNE_SCHAETZUNG[erwerbsart];
  // R4: Die Reihe «verheiratet» ist als Alleinverdiener-Ehepaar gemessen. Ohne Angabe zum
  // Partnereinkommen ist offen, ob das zutrifft — auch bei direkt eingetragenem Wert.
  // K62.4: mit eingetragenem Wert gibt es aber eine Bundessteuer (der Wert aus der gemeinsamen
  // Veranlagung enthält beide Einkommen) — darum ein eigener Grund, dessen Text nur die
  // Kantonssteuer betrifft und nicht «keine Steuerschätzung» sagt.
  else if (verheiratet && !partnerAngegeben) grund = direkt ? 'partnerOffenDirekt' : 'partnerOffen';
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
 *   R4: employmentType Rentner/Selbständig → keine Zahl (grund 'rente'/'selbstaendig'): die Standard-
 *     abzüge oben sind für Unselbständige gemessen (Berufsauslagen nach DBG Art. 26 gibt es nur bei
 *     unselbständiger Erwerbstätigkeit; Selbständige versteuern das Einkommen nach Art. 18 mit den
 *     Abzügen nach Art. 27). Ein direkt eingetragener Wert rechnet weiter.
 *   R4: verheiratet und Partnereinkommen nie beantwortet → keine Zahl (grund 'partnerOffen');
 *     bewusst 0 → Alleinverdiener-Ehepaar, so wie gemessen.
 *   K62.4: direktSteuerbar gehört zum Zivilstand im Profil (direktVerheiratet). Rechnet der
 *     Steuerrechner probeweise mit dem anderen Zivilstand, gibt es mit diesem Wert keine Zahl
 *     (grund 'zivilstandDirekt'): ein Wert aus einer gemeinsamen Veranlagung mit dem Grundtarif
 *     gerechnet (oder umgekehrt) wäre falsch. Ohne direktVerheiratet (undefined) keine Prüfung.
 *   K87: dasselbe für die Kinderzahl (direktKinder = Kinderzahl im Profil). Das steuerbare Einkommen
 *     aus der Veranlagung ist nach den Abzügen für die Kinder, die dort zählten (DBG Art. 35 Abs. 1
 *     lit. a); mit einer anderen Kinderzahl gerechnet wäre es falsch (grund 'kinderDirekt').
 *     Weichen Zivilstand und Kinderzahl ab, gilt 'zivilstandDirekt'. Ohne direktKinder keine Prüfung.
 * @returns {{ steuerbar: number|null, quelle: 'direkt'|'estv'|null,
 *             grund: 'brutto'|'rente'|'selbstaendig'|'partner'|'partnerOffen'|'zivilstandDirekt'|'kinderDirekt'|'keinLohn'|null }}
 */
export function steuerbaresEinkommenFuerProfil({
  nettolohnJahr = 0, direktSteuerbar = 0, einkommensart = null, partnerEinkommen = 0,
  verheiratet = false, kinder = 0, berufsauslagen = 0, weitereAbzuege = 0,
  erwerbsart = null, partnerAngegeben = true, direktVerheiratet, direktKinder,
} = {}) {
  if (Number(direktSteuerbar) > 0) {
    if (direktZivilstandAbweichend(verheiratet, direktVerheiratet)) return { steuerbar: null, quelle: null, grund: 'zivilstandDirekt' };
    if (direktKinderAbweichend(kinder, direktKinder)) return { steuerbar: null, quelle: null, grund: 'kinderDirekt' };
    return { steuerbar: Number(direktSteuerbar), quelle: 'direkt', grund: null };
  }
  if (einkommensart === 'brutto') return { steuerbar: null, quelle: null, grund: 'brutto' };
  if (ERWERBSART_OHNE_SCHAETZUNG[erwerbsart]) return { steuerbar: null, quelle: null, grund: ERWERBSART_OHNE_SCHAETZUNG[erwerbsart] };
  if (Number(partnerEinkommen) > 0 && (verheiratet || kinder > 0)) return { steuerbar: null, quelle: null, grund: 'partner' };
  if (verheiratet && !partnerAngegeben) return { steuerbar: null, quelle: null, grund: 'partnerOffen' };
  if (!(Number(nettolohnJahr) > 0)) return { steuerbar: null, quelle: null, grund: 'keinLohn' };
  return { steuerbar: steuerbarNachEstv({ nettolohnJahr, verheiratet, kinder, berufsauslagen, weitereAbzuege }), quelle: 'estv', grund: null };
}

// K62.4: weicht der gerechnete Zivilstand von dem ab, zu dem der eingetragene Wert gehört?
function direktZivilstandAbweichend(verheiratet, direktVerheiratet) {
  return direktVerheiratet !== undefined && Boolean(direktVerheiratet) !== Boolean(verheiratet);
}

// K87: weicht die gerechnete Kinderzahl von der ab, zu der der eingetragene Wert gehört?
function direktKinderAbweichend(kinder, direktKinder) {
  return direktKinder !== undefined && (Number(kinder) || 0) !== (Number(direktKinder) || 0);
}

// R4: Anstellungstyp (Finanzen-Kapitel, Optionen employed/selfEmployed/freelance/retired), für den
// die Standardabzüge der ESTV nicht gemessen sind. «employed» und ohne Angabe: wie gemessen.
export const ERWERBSART_OHNE_SCHAETZUNG = Object.freeze({ retired: 'rente', selfEmployed: 'selbstaendig', freelance: 'selbstaendig' });

// R4: Frage «13. Monatslohn?» im Finanzen-Kapitel (Optionen yes/no). Dieselben Schreibweisen wie
// hatDreizehnten()/dreizehnterAngegeben() in src/data/lohnCheck.js. Leer ist nicht «nein».
export function dreizehnterStatus(v) {
  if (v === true || v === 'yes' || v === 'ja') return 'ja';
  if (v === false || v === 'no' || v === 'nein') return 'nein';
  return 'offen';
}

// R4: Wurde das Partnereinkommen beantwortet? ChapterView legt household.partnerIncome erst an,
// wenn etwas eingetippt wird (Wert als Text); ein geleertes Feld ist ''. «0» ist eine Antwort.
export function partnerEinkommenAngegeben(data = {}) {
  const v = data?.basis?.household?.partnerIncome;
  return v !== undefined && v !== null && String(v).trim() !== '';
}

/**
 * E39: Die Eingaben der Steuerschätzung aus dem Profil — gleich für alle drei Seiten.
 * Nettolohn = Hauptlohn × 12 (× 13 mit 13. Monatslohn) + Nebenerwerb × 12. Ist einer der beiden
 * als Bruttolohn erfasst, gilt die Einkommensart 'brutto'.
 * R4: Der 13. Monatslohn zählt nur beim Hauptlohn — die Frage im Finanzen-Kapitel steht beim
 * Hauptlohn und gilt nur ihm (auch briefGenerator.js gibt sie dem Nebenerwerb nicht mit).
 * R4: Direkt eingetragenes steuerbares Einkommen gilt, ausser das Häkchen im Steuerrechner ist
 * ausdrücklich entfernt (taxData.useEnteredTaxable === false). Fehlt der Wert (Profile vor R4,
 * Eingabe im Finanzen-Kapitel oder Steuer-Import): der eingetragene Wert gilt — so haben
 * Finanzübersicht und Dossier bisher immer gerechnet, und so öffnet der Steuerrechner das Häkchen.
 */
export function steuerEingabenAusDaten(data = {}) {
  const f = data?.finanzen || {};
  const hh = getHouseholdInfo(data);
  const neben = Number(f.sideIncome) || 0;
  const dreizehnter = dreizehnterStatus(f.dreizehnter);
  return {
    kanton: steuerkantonVorbelegung(data),
    nettolohnJahr: (Number(f.monthlyIncome) || 0) * (dreizehnter === 'ja' ? 13 : 12) + neben * 12,
    dreizehnter,
    direktSteuerbar: data?.taxData?.useEnteredTaxable === false ? 0 : (Number(f.taxableIncome) || 0),
    einkommensart: f.incomeType === 'brutto' || (neben > 0 && f.sideIncomeType === 'brutto') ? 'brutto' : (f.incomeType || null),
    erwerbsart: f.employmentType || null,
    partnerEinkommen: hh.partnerIncome,
    partnerAngegeben: partnerEinkommenAngegeben(data),
    // Eingetragene Partnerschaft = Ehe (DBG Art. 9 Abs. 1bis, StHG Art. 3 Abs. 4) — utils/zivilstand.js.
    verheiratet: giltAlsVerheiratet(data?.basis?.maritalStatus),
    // K62.4: der Zivilstand, zu dem ein eingetragenes steuerbares Einkommen gehört (= Profil).
    direktVerheiratet: giltAlsVerheiratet(data?.basis?.maritalStatus),
    kinder: hh.childrenCount,
    // K87: die Kinderzahl, zu der ein eingetragenes steuerbares Einkommen gehört (= Profil).
    direktKinder: hh.childrenCount,
    elterntarif: data?.taxData?.elterntarif === true,
    ...abzuegeAusTaxData(data?.taxData),
  };
}

/**
 * E39: Bundessteuer und Kantons-/Gemeindesteuer aus demselben steuerbaren Einkommen.
 * @returns {{ steuerbar, quelle, grund, bund: object|null, kanton: object, gemeinsamDirekt: boolean,
 *             annahmen: { ohneDreizehnten: boolean, alleinverdiener: boolean } }}
 *   bund = null, wenn es kein steuerbares Einkommen gibt (grund sagt warum).
 *   gemeinsamDirekt (K86) = verheiratet und direkt eingetragener Wert: Maloja nimmt an, dass es der
 *     gemeinsame Wert aus der Veranlagung ist. Der Nettolohn im Profil ist nur der eigene — darum
 *     kein effektiver Satz (bund.effektiverSatz = null) und kein «Nettoeinkommen» daraus.
 *   annahmen (R4) = was die Seiten zur Zahl dazuschreiben:
 *     ohneDreizehnten — aus dem Nettolohn geschätzt, Frage nach dem 13. Monatslohn offen
 *     alleinverdiener — verheiratet und gerechnet wie gemessen (Partnereinkommen 0)
 */
export function steuernFuerProfil(p = {}) {
  const basis = steuerbaresEinkommenFuerProfil(p);
  const gemeinsamDirekt = basis.quelle === 'direkt' && p.verheiratet === true;
  const bund = basis.steuerbar == null ? null : bundessteuerAusSteuerbarem({
    steuerbaresEinkommen: basis.steuerbar,
    verheiratet: p.verheiratet, kinder: p.kinder, elterntarif: p.elterntarif,
    einkommen: gemeinsamDirekt ? null : p.nettolohnJahr,
  });
  const kanton = kantonssteuerFuerProfil({ ...p, bundessteuer: bund ? bund.steuer : 0 });
  const annahmen = {
    ohneDreizehnten: basis.quelle === 'estv' && p.dreizehnter === 'offen',
    alleinverdiener: p.verheiratet === true && (basis.quelle === 'estv' || Boolean(kanton.kantonal)),
  };
  return { ...basis, bund, kanton, annahmen, gemeinsamDirekt };
}

/**
 * R4: Tarifvergleich ledig/verheiratet (SteuerSaeulen) — je mit dem steuerbaren Einkommen, das
 * zum Zivilstand gehört (Verheiratetenabzug, höherer Versicherungsabzug; verheiratet wie gemessen
 * als Alleinverdiener-Ehepaar). Nur auf dem Weg über den Nettolohn: ein direkt eingetragener Wert
 * stammt aus einer Veranlagung mit einem bestimmten Zivilstand, der andere ist nicht bekannt.
 * @returns {object|null} vergleicheTarife() oder null
 */
export function tarifvergleichFuerProfil(p = {}) {
  const basis = steuerbaresEinkommenFuerProfil(p);
  if (basis.quelle !== 'estv') return null;
  const abz = { nettolohnJahr: p.nettolohnJahr, kinder: p.kinder, berufsauslagen: p.berufsauslagen, weitereAbzuege: p.weitereAbzuege };
  return vergleicheTarife(
    steuerbarNachEstv({ ...abz, verheiratet: false }),
    p.kinder, p.elterntarif,
    steuerbarNachEstv({ ...abz, verheiratet: true }),
  );
}

export function getHauptort(kuerzel) {
  return HAUPTORTE[kuerzel] || null;
}

export const KANTONAL_DATA_VERSION = String(KANTONSSTEUER_STEUERJAHR);
export const KANTONAL_DATA_ABGERUFEN = KANTONSSTEUER_ABGERUFEN;
// Abrufdatum der Messpunkte eines Kantons: einzeln nachgemessene Kantone (z. B. TI am 23.09.2026)
// tragen ihr eigenes Datum, alle anderen das der Gesamtmessung.
export function kantonsdatenAbgerufen(kuerzel) {
  return KANTONSSTEUER_ABGERUFEN_JE_KANTON[kuerzel] || KANTONSSTEUER_ABGERUFEN;
}
export const KANTONAL_DATA_SOURCE = 'ESTV Steuerrechner, Steuerjahr ' + KANTONSSTEUER_STEUERJAHR + ', Kantonshauptort, ohne Kirchensteuer';
export const KANTONAL_MAX_KINDER = KANTONSSTEUER_MAX_KINDER;
