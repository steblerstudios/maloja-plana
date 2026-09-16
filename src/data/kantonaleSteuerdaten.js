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

export function getHauptort(kuerzel) {
  return HAUPTORTE[kuerzel] || null;
}

export const KANTONAL_DATA_VERSION = String(KANTONSSTEUER_STEUERJAHR);
export const KANTONAL_DATA_ABGERUFEN = KANTONSSTEUER_ABGERUFEN;
export const KANTONAL_DATA_SOURCE = 'ESTV Steuerrechner, Steuerjahr ' + KANTONSSTEUER_STEUERJAHR + ', Kantonshauptort, ohne Kirchensteuer';
export const KANTONAL_MAX_KINDER = KANTONSSTEUER_MAX_KINDER;
