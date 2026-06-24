// Kantonale Steuer-Orientierung
// Approximative Multiplikatoren: (Kantons- + Gemeindesteuer) / Bundessteuer
// Basis: ESTV Steuerbelastung 2024, Hauptort, alleinstehend, ~CHF 80'000
// Nur für Orientierung — keine verbindliche Berechnung.

const KANTONALE_DATEN = {
  AG: { hauptort: 'Aarau',         faktor: 3.3 },
  AI: { hauptort: 'Appenzell',     faktor: 2.9 },
  AR: { hauptort: 'Herisau',       faktor: 3.4 },
  BE: { hauptort: 'Bern',          faktor: 4.1 },
  BL: { hauptort: 'Liestal',       faktor: 3.5 },
  BS: { hauptort: 'Basel',         faktor: 4.4 },
  FR: { hauptort: 'Freiburg',      faktor: 4.0 },
  GE: { hauptort: 'Genf',          faktor: 4.7 },
  GL: { hauptort: 'Glarus',        faktor: 3.4 },
  GR: { hauptort: 'Chur',          faktor: 3.3 },
  JU: { hauptort: 'Delémont',      faktor: 4.5 },
  LU: { hauptort: 'Luzern',        faktor: 3.4 },
  NE: { hauptort: 'Neuenburg',     faktor: 4.6 },
  NW: { hauptort: 'Stans',         faktor: 2.4 },
  OW: { hauptort: 'Sarnen',        faktor: 2.9 },
  SG: { hauptort: 'St. Gallen',    faktor: 3.5 },
  SH: { hauptort: 'Schaffhausen',  faktor: 3.3 },
  SO: { hauptort: 'Solothurn',     faktor: 3.9 },
  SZ: { hauptort: 'Schwyz',        faktor: 2.0 },
  TG: { hauptort: 'Frauenfeld',    faktor: 3.1 },
  TI: { hauptort: 'Bellinzona',    faktor: 3.9 },
  UR: { hauptort: 'Altdorf',       faktor: 3.0 },
  VD: { hauptort: 'Lausanne',      faktor: 4.5 },
  VS: { hauptort: 'Sion',          faktor: 3.6 },
  ZG: { hauptort: 'Zug',           faktor: 1.5 },
  ZH: { hauptort: 'Zürich',        faktor: 3.5 },
};

export function getKantonDaten(kuerzel) {
  return KANTONALE_DATEN[kuerzel] || null;
}

export function schaetzeKantonaleSteuer(bundessteuer, kuerzel) {
  const kanton = KANTONALE_DATEN[kuerzel];
  if (!kanton || bundessteuer <= 0) return null;

  const kantonalUndGemeinde = Math.round(bundessteuer * kanton.faktor);
  const total = Math.round(bundessteuer + kantonalUndGemeinde);

  return {
    kanton: kanton.name,
    hauptort: kanton.hauptort,
    faktor: kanton.faktor,
    bundessteuer: Math.round(bundessteuer),
    kantonalUndGemeinde,
    total,
    effektiverSatz: null,
  };
}

export function alleKantone() {
  return Object.entries(KANTONALE_DATEN)
    .map(([kuerzel, d]) => ({ kuerzel, ...d }))
    .sort((a, b) => a.kuerzel.localeCompare(b.kuerzel));
}

export const KANTONAL_DATA_VERSION = '2024 (Orientierung)';
export const KANTONAL_DATA_SOURCE = 'ESTV Steuerbelastung, Hauptort, approximativ';
