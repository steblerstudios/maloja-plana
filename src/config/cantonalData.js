// PLZ-Bereiche → Kanton Zuordnung (vereinfacht, deckt Hauptbereiche ab)
const PLZ_RANGES = [
  { from: 1000, to: 1099, canton: 'VD' },
  { from: 1100, to: 1199, canton: 'VD' },
  { from: 1200, to: 1299, canton: 'GE' },
  { from: 1300, to: 1399, canton: 'VD' },
  { from: 1400, to: 1499, canton: 'VD' },
  { from: 1500, to: 1599, canton: 'VD' },
  { from: 1600, to: 1699, canton: 'FR' },
  { from: 1700, to: 1799, canton: 'FR' },
  { from: 1800, to: 1899, canton: 'VD' },
  { from: 1900, to: 1999, canton: 'VS' },
  { from: 2000, to: 2099, canton: 'NE' },
  { from: 2100, to: 2199, canton: 'NE' },
  { from: 2200, to: 2299, canton: 'NE' },
  { from: 2300, to: 2399, canton: 'NE' },
  { from: 2400, to: 2499, canton: 'NE' },
  { from: 2500, to: 2599, canton: 'BE' },
  { from: 2600, to: 2699, canton: 'BE' },
  { from: 2700, to: 2799, canton: 'JU' },
  { from: 2800, to: 2899, canton: 'JU' },
  { from: 2900, to: 2999, canton: 'JU' },
  { from: 3000, to: 3199, canton: 'BE' },
  { from: 3200, to: 3299, canton: 'BE' },
  { from: 3300, to: 3399, canton: 'BE' },
  { from: 3400, to: 3499, canton: 'BE' },
  { from: 3500, to: 3599, canton: 'BE' },
  { from: 3600, to: 3699, canton: 'BE' },
  { from: 3700, to: 3799, canton: 'BE' },
  { from: 3800, to: 3899, canton: 'BE' },
  { from: 3900, to: 3999, canton: 'VS' },
  { from: 4000, to: 4099, canton: 'BS' },
  { from: 4100, to: 4199, canton: 'BL' },
  { from: 4200, to: 4299, canton: 'BL' },
  { from: 4300, to: 4399, canton: 'SO' },
  { from: 4400, to: 4499, canton: 'SO' },
  { from: 4500, to: 4599, canton: 'SO' },
  { from: 4600, to: 4699, canton: 'SO' },
  { from: 4700, to: 4799, canton: 'SO' },
  { from: 4800, to: 4899, canton: 'AG' },
  { from: 4900, to: 4999, canton: 'SO' },
  { from: 5000, to: 5099, canton: 'AG' },
  { from: 5100, to: 5199, canton: 'AG' },
  { from: 5200, to: 5299, canton: 'AG' },
  { from: 5300, to: 5399, canton: 'AG' },
  { from: 5400, to: 5499, canton: 'AG' },
  { from: 5500, to: 5599, canton: 'AG' },
  { from: 5600, to: 5699, canton: 'AG' },
  { from: 5700, to: 5799, canton: 'AG' },
  { from: 5800, to: 5899, canton: 'AG' },
  { from: 5900, to: 5999, canton: 'AG' },
  { from: 6000, to: 6099, canton: 'LU' },
  { from: 6100, to: 6199, canton: 'LU' },
  { from: 6200, to: 6249, canton: 'LU' },
  { from: 6250, to: 6299, canton: 'LU' },
  { from: 6300, to: 6399, canton: 'ZG' },
  { from: 6400, to: 6449, canton: 'SZ' },
  { from: 6450, to: 6499, canton: 'UR' },
  { from: 6500, to: 6599, canton: 'TI' },
  { from: 6600, to: 6699, canton: 'TI' },
  { from: 6700, to: 6799, canton: 'TI' },
  { from: 6800, to: 6899, canton: 'TI' },
  { from: 6900, to: 6999, canton: 'TI' },
  { from: 7000, to: 7099, canton: 'GR' },
  { from: 7100, to: 7199, canton: 'GR' },
  { from: 7200, to: 7299, canton: 'GR' },
  { from: 7300, to: 7399, canton: 'GR' },
  { from: 7400, to: 7499, canton: 'GR' },
  { from: 7500, to: 7599, canton: 'GR' },
  { from: 7600, to: 7699, canton: 'GR' },
  { from: 7700, to: 7799, canton: 'GR' },
  { from: 8000, to: 8099, canton: 'ZH' },
  { from: 8100, to: 8199, canton: 'ZH' },
  { from: 8200, to: 8299, canton: 'SH' },
  { from: 8300, to: 8399, canton: 'ZH' },
  { from: 8400, to: 8499, canton: 'ZH' },
  { from: 8500, to: 8599, canton: 'TG' },
  { from: 8600, to: 8699, canton: 'ZH' },
  { from: 8700, to: 8799, canton: 'ZH' },
  { from: 8800, to: 8899, canton: 'SZ' },
  { from: 8900, to: 8999, canton: 'AG' },
  { from: 9000, to: 9099, canton: 'SG' },
  { from: 9100, to: 9199, canton: 'AI' },
  { from: 9200, to: 9299, canton: 'SG' },
  { from: 9300, to: 9399, canton: 'SG' },
  { from: 9400, to: 9499, canton: 'SG' },
  { from: 9500, to: 9599, canton: 'SG' },
  { from: 9600, to: 9699, canton: 'SG' },
  { from: 9700, to: 9799, canton: 'AR' },
  { from: 9800, to: 9899, canton: 'SG' },
  { from: 9900, to: 9999, canton: 'SG' },
];

export function cantonFromPLZ(plz) {
  const num = parseInt(plz, 10);
  if (isNaN(num) || num < 1000 || num > 9999) return null;
  const match = PLZ_RANGES.find(r => num >= r.from && num <= r.to);
  return match ? match.canton : null;
}

export const CANTON_NAMES = {
  AG: 'Aargau', AI: 'Appenzell Innerrhoden', AR: 'Appenzell Ausserrhoden',
  BE: 'Bern', BL: 'Basel-Landschaft', BS: 'Basel-Stadt',
  FR: 'Freiburg', GE: 'Genf', GL: 'Glarus', GR: 'Graubünden',
  JU: 'Jura', LU: 'Luzern', NE: 'Neuenburg', NW: 'Nidwalden',
  OW: 'Obwalden', SG: 'St. Gallen', SH: 'Schaffhausen', SO: 'Solothurn',
  SZ: 'Schwyz', TG: 'Thurgau', TI: 'Tessin', UR: 'Uri',
  VD: 'Waadt', VS: 'Wallis', ZG: 'Zug', ZH: 'Zürich'
};

// Aufenthaltstypen
export const RESIDENCE_TYPES = [
  { key: 'hauptwohnsitz', label: 'Hauptwohnsitz' },
  { key: 'wochenaufenthalt', label: 'Wochenaufenthalter/in' },
  { key: 'nebenwohnsitz', label: 'Nebenwohnsitz' },
];

// Kantonale Prämienverbilligung — Einkommensgrenzen und Beiträge pro Kanton
// Quelle: BAG, kantonale Gesundheitsdirektionen (vereinfacht, Stand 2024/2025)
export const CANTONAL_IPV = {
  ZH: { name: 'Zürich', maxIncome: 54900, subsidySingle: 3000, subsidyFamily: 6000, subsidyChild: 1500, model: 'einkommensabhängig', note: 'Antrag bei SVA Zürich' },
  BE: { name: 'Bern', maxIncome: 45000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, model: 'einkommensabhängig', note: 'Automatische Prüfung via Steuerdaten' },
  LU: { name: 'Luzern', maxIncome: 54000, subsidySingle: 2700, subsidyFamily: 5400, subsidyChild: 1350, model: 'einkommensabhängig', note: 'Antrag bei AHV-Zweigstelle Gemeinde' },
  UR: { name: 'Uri', maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, model: 'pauschal', note: 'Antrag beim Amt für Gesundheit' },
  SZ: { name: 'Schwyz', maxIncome: 48000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, model: 'einkommensabhängig', note: 'Antrag bei Ausgleichskasse' },
  OW: { name: 'Obwalden', maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, model: 'pauschal', note: 'Antrag bei Sozialamt' },
  NW: { name: 'Nidwalden', maxIncome: 45000, subsidySingle: 2250, subsidyFamily: 4500, subsidyChild: 1125, model: 'pauschal', note: 'Antrag bei Sozialamt' },
  GL: { name: 'Glarus', maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, model: 'pauschal', note: 'Automatisch via Steuerdaten' },
  ZG: { name: 'Zug', maxIncome: 60000, subsidySingle: 3600, subsidyFamily: 7200, subsidyChild: 1800, model: 'einkommensabhängig', note: 'Antrag bei Ausgleichskasse' },
  FR: { name: 'Freiburg', maxIncome: 48000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, model: 'einkommensabhängig', note: 'Antrag bei Caisse cantonale de compensation' },
  SO: { name: 'Solothurn', maxIncome: 48000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, model: 'einkommensabhängig', note: 'Antrag bei Ausgleichskasse' },
  BS: { name: 'Basel-Stadt', maxIncome: 54000, subsidySingle: 3000, subsidyFamily: 6000, subsidyChild: 1500, model: 'einkommensabhängig', note: 'Automatisch via Steuerdaten' },
  BL: { name: 'Basel-Landschaft', maxIncome: 51000, subsidySingle: 2700, subsidyFamily: 5400, subsidyChild: 1350, model: 'einkommensabhängig', note: 'Antrag bei SVA BL' },
  SH: { name: 'Schaffhausen', maxIncome: 45000, subsidySingle: 2250, subsidyFamily: 4500, subsidyChild: 1125, model: 'pauschal', note: 'Antrag bei AHV-Zweigstelle' },
  AR: { name: 'Appenzell Ausserrhoden', maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, model: 'pauschal', note: 'Antrag bei SVA' },
  AI: { name: 'Appenzell Innerrhoden', maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, model: 'pauschal', note: 'Antrag bei Sozialamt' },
  SG: { name: 'St. Gallen', maxIncome: 48000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, model: 'einkommensabhängig', note: 'Antrag bei SVA SG' },
  GR: { name: 'Graubünden', maxIncome: 45000, subsidySingle: 2250, subsidyFamily: 4500, subsidyChild: 1125, model: 'einkommensabhängig', note: 'Antrag bei SVA GR' },
  AG: { name: 'Aargau', maxIncome: 51000, subsidySingle: 2700, subsidyFamily: 5400, subsidyChild: 1350, model: 'einkommensabhängig', note: 'Antrag bei SVA AG' },
  TG: { name: 'Thurgau', maxIncome: 48000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, model: 'einkommensabhängig', note: 'Antrag bei SVA TG' },
  TI: { name: 'Tessin', maxIncome: 45000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, model: 'einkommensabhängig', note: 'Richiesta presso IAS' },
  VD: { name: 'Waadt', maxIncome: 54000, subsidySingle: 3000, subsidyFamily: 6000, subsidyChild: 1500, model: 'einkommensabhängig', note: 'Automatique via données fiscales' },
  VS: { name: 'Wallis', maxIncome: 45000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, model: 'einkommensabhängig', note: 'Antrag bei Dienststelle für Gesundheit' },
  NE: { name: 'Neuenburg', maxIncome: 48000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, model: 'einkommensabhängig', note: 'Automatique via données fiscales' },
  GE: { name: 'Genf', maxIncome: 60000, subsidySingle: 3600, subsidyFamily: 7200, subsidyChild: 1800, model: 'einkommensabhängig', note: 'Automatique via SAM' },
  JU: { name: 'Jura', maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, model: 'pauschal', note: 'Demande auprès du Service de l\'action sociale' },
};

// Kantonale Mietzinsbeiträge / Wohnkosten-Limits (SKOS-Richtlinien + kantonale Anpassungen)
export const CANTONAL_RENT_LIMITS = {
  ZH: { single: 1300, couple: 1550, family3: 1750, family4: 1900, note: 'Stadt Zürich höher' },
  BE: { single: 1100, couple: 1350, family3: 1500, family4: 1650, note: 'Unterschied Stadt/Land' },
  LU: { single: 1150, couple: 1350, family3: 1550, family4: 1700, note: '' },
  BS: { single: 1350, couple: 1600, family3: 1800, family4: 1950, note: 'Hohe Mieten' },
  GE: { single: 1500, couple: 1750, family3: 2000, family4: 2200, note: 'Teuerster Kanton' },
  VD: { single: 1300, couple: 1500, family3: 1700, family4: 1900, note: '' },
  AG: { single: 1100, couple: 1300, family3: 1500, family4: 1650, note: '' },
  SG: { single: 1050, couple: 1250, family3: 1400, family4: 1550, note: '' },
  TI: { single: 1050, couple: 1250, family3: 1400, family4: 1550, note: '' },
  SO: { single: 1050, couple: 1250, family3: 1400, family4: 1550, note: '' },
  TG: { single: 1000, couple: 1200, family3: 1350, family4: 1500, note: '' },
  // Fallback für nicht einzeln aufgeführte Kantone
  _default: { single: 1100, couple: 1300, family3: 1500, family4: 1650, note: '' },
};

export function getRentLimit(canton, householdSize) {
  const limits = CANTONAL_RENT_LIMITS[canton] || CANTONAL_RENT_LIMITS._default;
  if (householdSize <= 1) return limits.single;
  if (householdSize === 2) return limits.couple;
  if (householdSize === 3) return limits.family3;
  return limits.family4;
}

// SKOS-Grundbedarf (Sozialhilfe) 2024/2025
export const SKOS_GRUNDBEDARF = {
  1: 1031,
  2: 1577,
  3: 1918,
  4: 2201,
  5: 2446,
  6: 2691,
  7: 2891,
};

export function getGrundbedarf(householdSize) {
  return SKOS_GRUNDBEDARF[Math.min(householdSize, 7)] || SKOS_GRUNDBEDARF[1];
}

// Sozialhilfe-Berechnung (SKOS-basiert, kantonal angepasst)
export function calculateSozialhilfe(data) {
  const canton = data.basis?.canton || '';
  const householdSize = 1 + Number(data.basis?.dependents || 0);
  const income = Number(data.finanzen?.monthlyIncome || 0);
  const rent = Number(data.wohnen?.rentAmount || 0);
  const utilities = Number(data.wohnen?.utilities || 0);
  const kkPremium = Number(data.versicherungen?.kkPremium || 0);

  const grundbedarf = getGrundbedarf(householdSize);
  const rentLimit = getRentLimit(canton, householdSize);
  const effectiveRent = Math.min(rent + utilities, rentLimit);
  const effectiveKK = kkPremium;

  const totalBedarf = grundbedarf + effectiveRent + effectiveKK;
  const deficit = totalBedarf - income;

  return {
    grundbedarf,
    effectiveRent,
    rentLimit,
    effectiveKK,
    totalBedarf,
    income,
    deficit: Math.max(0, deficit),
    eligible: deficit > 0,
    householdSize,
    canton,
    note: deficit > 0
      ? 'Anspruch auf Sozialhilfe: CHF ' + Math.max(0, deficit).toFixed(0) + '/Monat'
      : 'Kein Anspruch — Einkommen deckt Bedarf'
  };
}

// Kantonale IPV-Berechnung (ersetzt die alte pauschale Logik)
export function calculateIPV(data) {
  const canton = data.basis?.canton || '';
  const ipvData = CANTONAL_IPV[canton];
  if (!ipvData) return { eligible: false, amount: 0, note: 'Kanton nicht erkannt' };

  const income = Number(data.finanzen?.monthlyIncome || 0) * 12;
  const dependents = Number(data.basis?.dependents || 0);

  if (income > ipvData.maxIncome) {
    return { eligible: false, amount: 0, note: 'Einkommen über Grenze (CHF ' + ipvData.maxIncome + ')', canton, cantonData: ipvData };
  }

  let monthlySubsidy;
  if (dependents > 0) {
    monthlySubsidy = Math.round((ipvData.subsidyFamily + dependents * ipvData.subsidyChild) / 12);
  } else {
    monthlySubsidy = Math.round(ipvData.subsidySingle / 12);
  }

  return {
    eligible: true,
    amount: monthlySubsidy,
    annual: monthlySubsidy * 12,
    note: ipvData.note,
    model: ipvData.model,
    canton,
    cantonData: ipvData
  };
}

// Wochenaufenthalt-Logik
export function getResidenceInfo(residenceType) {
  if (residenceType === 'wochenaufenthalt') {
    return {
      taxNote: 'Steuern am Hauptwohnsitz, nicht am Wochenaufenthaltsort',
      kkNote: 'KK-Prämie richtet sich nach dem Wohnkanton (Hauptwohnsitz)',
      ipvNote: 'IPV-Antrag im Wohnkanton, nicht am Arbeitsort',
      votingNote: 'Stimm- und Wahlrecht nur am Hauptwohnsitz'
    };
  }
  return {
    taxNote: 'Steuern am Wohnort',
    kkNote: 'KK-Prämie nach Wohnkanton',
    ipvNote: 'IPV-Antrag im Wohnkanton',
    votingNote: ''
  };
}

// EL (Ergänzungsleistungen) Berechtigungsprüfung
export function checkELEligibility(data) {
  const income = Number(data.finanzen?.monthlyIncome || 0);
  const rent = Number(data.wohnen?.rentAmount || 0);
  const kkPremium = Number(data.versicherungen?.kkPremium || 0);
  const ahvRente = Number(data.finanzen?.ahvRente || 0);
  const ivRente = Number(data.finanzen?.ivRente || 0);
  const bvgRente = Number(data.finanzen?.bvgRente || 0);

  const totalIncome = income + ahvRente + ivRente + bvgRente;
  const totalExpenses = rent + kkPremium;
  const isAHVIV = ahvRente > 0 || ivRente > 0;

  return {
    eligible: isAHVIV && totalIncome < totalExpenses + 2000,
    isAHVIV,
    totalIncome,
    totalExpenses,
    note: isAHVIV
      ? 'Möglicher Anspruch auf Ergänzungsleistungen — Antrag bei AHV-Zweigstelle prüfen'
      : 'EL nur für AHV/IV-Bezüger'
  };
}
