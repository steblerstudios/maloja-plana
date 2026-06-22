// Kantonale Steuer-Orientierung
// Approximative Multiplikatoren: (Kantons- + Gemeindesteuer) / Bundessteuer
// Basis: ESTV Steuerbelastung 2024, Hauptort, alleinstehend, ~CHF 80'000
// Nur für Orientierung — keine verbindliche Berechnung.

const KANTONALE_DATEN = {
  AG: { name: 'Aargau',              hauptort: 'Aarau',         faktor: 3.3 },
  AI: { name: 'Appenzell I.Rh.',     hauptort: 'Appenzell',     faktor: 2.9 },
  AR: { name: 'Appenzell A.Rh.',     hauptort: 'Herisau',       faktor: 3.4 },
  BE: { name: 'Bern',                hauptort: 'Bern',          faktor: 4.1 },
  BL: { name: 'Basel-Landschaft',    hauptort: 'Liestal',       faktor: 3.5 },
  BS: { name: 'Basel-Stadt',         hauptort: 'Basel',         faktor: 4.4 },
  FR: { name: 'Freiburg',            hauptort: 'Freiburg',      faktor: 4.0 },
  GE: { name: 'Genf',                hauptort: 'Genf',          faktor: 4.7 },
  GL: { name: 'Glarus',              hauptort: 'Glarus',        faktor: 3.4 },
  GR: { name: 'Graubünden',          hauptort: 'Chur',          faktor: 3.3 },
  JU: { name: 'Jura',                hauptort: 'Delémont',      faktor: 4.5 },
  LU: { name: 'Luzern',              hauptort: 'Luzern',        faktor: 3.4 },
  NE: { name: 'Neuenburg',           hauptort: 'Neuenburg',     faktor: 4.6 },
  NW: { name: 'Nidwalden',           hauptort: 'Stans',         faktor: 2.4 },
  OW: { name: 'Obwalden',            hauptort: 'Sarnen',        faktor: 2.9 },
  SG: { name: 'St. Gallen',          hauptort: 'St. Gallen',    faktor: 3.5 },
  SH: { name: 'Schaffhausen',        hauptort: 'Schaffhausen',  faktor: 3.3 },
  SO: { name: 'Solothurn',           hauptort: 'Solothurn',     faktor: 3.9 },
  SZ: { name: 'Schwyz',              hauptort: 'Schwyz',        faktor: 2.0 },
  TG: { name: 'Thurgau',             hauptort: 'Frauenfeld',    faktor: 3.1 },
  TI: { name: 'Tessin',              hauptort: 'Bellinzona',    faktor: 3.9 },
  UR: { name: 'Uri',                 hauptort: 'Altdorf',       faktor: 3.0 },
  VD: { name: 'Waadt',               hauptort: 'Lausanne',      faktor: 4.5 },
  VS: { name: 'Wallis',              hauptort: 'Sion',          faktor: 3.6 },
  ZG: { name: 'Zug',                 hauptort: 'Zug',           faktor: 1.5 },
  ZH: { name: 'Zürich',              hauptort: 'Zürich',        faktor: 3.5 },
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
