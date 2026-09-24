// Kantonale Werte (SKOS-Grundbedarf, IPV, EL, Mietzinsmaxima) — ändern jährlich.
// Ein Datei-weiter Datenstand (CANTONAL_DATA_VERSION '2024/2025') wurde am 16.09.2026
// entfernt: nirgends angezeigt, und ein Stand für die ganze Datei datiert Werte mit
// unterschiedlichem Prüfstand falsch. Stände je Block, z. B. SKOS_DATA_VERSION in data/sozialhilfeRechner.js.
import { partnerEinkommenRoh } from '../utils/partnereinkommen.js';
import { vermoegensfreibetragKanton } from '../data/vermoegensfreibetragKanton.js';
import { vermoegensfreibetragUnbestaetigt } from '../data/vermoegensfreibetragUnbestaetigt.js';

// PLZ-Bereiche → Kanton Zuordnung (Fallback für PLZ ohne amtlichen Eintrag)
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

let _plzModule = null;
let _zhModule = null;
let _beModule = null;
let _agModule = null;
let _sgModule = null;
let _luModule = null;

export function cantonFromPLZ(plz) {
  const num = parseInt(plz, 10);
  if (isNaN(num) || num < 1000 || num > 9999) return null;

  if (_plzModule) {
    const precise = _plzModule.cantonFromPLZPrecise(plz);
    if (precise) return precise;
  } else {
    import('../data/plzGemeinde.js').then(m => { _plzModule = m; });
  }

  const match = PLZ_RANGES.find(r => num >= r.from && num <= r.to);
  return match ? match.canton : null;
}

// PLZ-Modul aktiv vorladen UND `_plzModule` setzen (anders als ein roher dynamic import,
// der nur den Cache wärmt). So greifen präzise Kanton- und Gemeinde-Lookups schon beim
// ersten PLZ-Eintrag.
export function preloadPLZ() {
  if (!_plzModule) import('../data/plzGemeinde.js').then(m => { _plzModule = m; }).catch(() => {});
  // K31: die Kantonsmodelle der Prämienverbilligung brauchen die Gemeinde und liegen darum im
  // selben Moment nach (je ein eigener Chunk, hält das Hauptbundle klein).
  if (!_zhModule) import('./ipvZuerich.js').then(m => { _zhModule = m; }).catch(() => {});
  if (!_beModule) import('./ipvBern.js').then(m => { _beModule = m; }).catch(() => {});
  // AG braucht die Gemeinde NICHT (kein Prämienregionen-Modell, V KVGG § 4 Abs. 1), lädt aber
  // im selben Moment mit — ein Chunk, damit das Hauptbundle klein bleibt.
  if (!_agModule) import('./ipvAargau.js').then(m => { _agModule = m; }).catch(() => {});
  if (!_sgModule) import('./ipvStGallen.js').then(m => { _sgModule = m; }).catch(() => {});
  if (!_luModule) import('./ipvLuzern.js').then(m => { _luModule = m; }).catch(() => {});
}

// Primäre Gemeinde aus PLZ (lokal). Braucht das geladene PLZ-Modul; vorher null
// (kein Range-Fallback für Namen). Stösst den Lazy-Load an wie cantonFromPLZ.
export function gemeindeFromPLZ(plz) {
  const num = parseInt(plz, 10);
  if (isNaN(num) || num < 1000 || num > 9999) return null;
  if (_plzModule) {
    const primary = _plzModule.primaryGemeinde(plz);
    return primary ? primary.gemeinde : null;
  }
  import('../data/plzGemeinde.js').then(m => { _plzModule = m; });
  return null;
}

export const CANTON_CODES = [
  'AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR',
  'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG',
  'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'
];

export function getCantonName(code, t) {
  if (!code) return '';
  if (t) return t('cantons.' + code) || code;
  return code;
}

// ─── Household helper ─────────────────────────────────────
// Single source of truth for household composition.
// Reads from household object if present, falls back to legacy dependents field.
export function getHouseholdInfo(data) {
  const basis = data?.basis || {};
  const household = basis.household;

  if (household && typeof household === 'object') {
    const adults = Math.max(1, Number(household.adults) || 1);
    const children = Array.isArray(household.children) ? household.children : [];
    return {
      adults,
      childrenCount: children.length,
      children,
      isRetired: Boolean(household.isRetired),
      householdSize: adults + children.length,
      // K62-Nachlauf A: nur, wenn das Feld «Nettolohn Partner/in» sichtbar wäre (utils/partnereinkommen.js).
      partnerIncome: Number(partnerEinkommenRoh(basis) || 0),
    };
  }

  // Fallback: derive from legacy dependents field
  const dependents = Number(basis.dependents || 0);
  return {
    adults: 1,
    childrenCount: dependents,
    children: Array.from({ length: dependents }, () => ({ age: 0 })),
    isRetired: data?.finanzen?.employmentType === 'retired',
    householdSize: 1 + dependents,
    partnerIncome: 0,
  };
}

// Kantonale Prämienverbilligung — Einkommensgrenzen und Beiträge pro Kanton
// Quelle: BAG, kantonale Gesundheitsdirektionen (vereinfacht, Stand 2024/2025)
//
// E9 (Entscheid 16.09.2026): Die Grenzen und Beträge unten sind nach einem Muster
// erzeugt (Familie = 2× Einzel, Kind = ½, Grenzen gerundet) und NICHT amtlich belegt.
// Solange ein Kanton `belegt: false` trägt, zeigt die App dort keinen Betrag, kein
// «Berechtigt» und keine Grenze, sondern nur eine Orientierung (calculateIPV unten).
// Das Feld `beleg` je Kanton ist Flag und Quellen-Feld zugleich:
//   beleg: null                                  → nicht amtlich belegt (heute 21 von 26; ZH, BE, AG, SG und LU belegt seit K31)
//   beleg: { quelle: 'Erlass-Kürzel + Amt; der Wortlaut steht im Quellenblatt
//                     docs/sources/ipv-kantone-2026.md (nicht hier doppelt: jedes Zeichen
//                     dieser Datei liegt im Hauptbundle, gelesen wird zur Laufzeit nur, OB es da ist)',
//            stand: 'Datum der Prüfung bzw. Gültigkeitsjahr, z. B. 2026' }
//                                                → belegt; zeigt wieder einen Betrag
// Beim Belegen maxIncome/subsidy* auf die amtlichen Werte setzen. Ein `beleg` ohne
// `quelle` gilt als unbelegt.
export const CANTONAL_IPV = {
  // ZH (K31): eigenes Modell in config/ipvZuerich.js; Grenze und Höchstbetrag hängen von
  // Prämienregion und Haushalt ab, darum hier keine Einzelwerte (die Musterwerte sind entfernt).
  ZH: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplySva', noteParams: { canton: 'ZH' },
    beleg: { quelle: 'EG KVG ZH (LS 832.01) · RRB 297/2025, 947/2025 · SVA Zürich — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-19' } },
  // BE (K31): eigenes Modell in config/ipvBern.js (Stufentabelle); Grenze und Höchstbetrag
  // hängen von Prämienregion und Haushalt ab, darum hier keine Einzelwerte.
  BE: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteAutoTaxData',
    beleg: { quelle: 'KKVV BE (BSG 842.111.1) · Amt für Sozialversicherungen BE — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-20' } },
  // LU (K31): eigenes Modell in config/ipvLuzern.js (Richtprämie minus Prozentsatz, der MIT dem
  // Einkommen steigt; Kinder 80 % fest bis zur Einkommensgrenze). Keine publizierte Grenze für
  // Erwachsene, darum maxIncome null wie in SG und AG.
  LU: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyCantonalCompensation',
    beleg: { quelle: 'SRL 866a · SRL 866 · WAS Ausgleichskasse Luzern — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-23' } },
  UR: { maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, modelKey: 'ipv.modelFlat', noteKey: 'ipv.noteApplyHealthOffice', beleg: null },
  SZ: { maxIncome: 48000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyCompensation', beleg: null },
  OW: { maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, modelKey: 'ipv.modelFlat', noteKey: 'ipv.noteApplySocialOffice', beleg: null },
  NW: { maxIncome: 45000, subsidySingle: 2250, subsidyFamily: 4500, subsidyChild: 1125, modelKey: 'ipv.modelFlat', noteKey: 'ipv.noteApplySocialOffice', beleg: null },
  GL: { maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, modelKey: 'ipv.modelFlat', noteKey: 'ipv.noteAutoTaxData', beleg: null },
  ZG: { maxIncome: 60000, subsidySingle: 3600, subsidyFamily: 7200, subsidyChild: 1800, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyCompensation', beleg: null },
  FR: { maxIncome: 48000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyCantonalCompensation', beleg: null },
  SO: { maxIncome: 48000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyCompensation', beleg: null },
  BS: { maxIncome: 54000, subsidySingle: 3000, subsidyFamily: 6000, subsidyChild: 1500, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteAutoTaxData', beleg: null },
  BL: { maxIncome: 51000, subsidySingle: 2700, subsidyFamily: 5400, subsidyChild: 1350, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplySva', noteParams: { canton: 'BL' }, beleg: null },
  SH: { maxIncome: 45000, subsidySingle: 2250, subsidyFamily: 4500, subsidyChild: 1125, modelKey: 'ipv.modelFlat', noteKey: 'ipv.noteApplyAhvBranchShort', beleg: null },
  AR: { maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, modelKey: 'ipv.modelFlat', noteKey: 'ipv.noteApplySva', noteParams: { canton: 'AR' }, beleg: null },
  AI: { maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, modelKey: 'ipv.modelFlat', noteKey: 'ipv.noteApplySocialOffice', beleg: null },
  // SG (K31): eigenes Modell in config/ipvStGallen.js (Referenzprämie minus Belastungsgrenze,
  // deren Satz MIT dem Einkommen steigt). Der Kanton publiziert keine Einkommensgrenze als
  // Zahl — sie ergäbe sich nur aus der Formel —, darum bleibt maxIncome null wie in AG.
  SG: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplySva', noteParams: { canton: 'SG' },
    beleg: { quelle: 'sGS 331.538 · sGS 331.111 · SVA St.Gallen — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-20' } },
  GR: { maxIncome: 45000, subsidySingle: 2250, subsidyFamily: 4500, subsidyChild: 1125, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplySva', noteParams: { canton: 'GR' }, beleg: null },
  // AG (K31): eigenes Modell in config/ipvAargau.js (Richtprämie minus 17,5 % des massgebenden
  // Einkommens). Keine Prämienregionen; die Einkommensgrenze nach § 5 Abs. 5 KVGG publiziert
  // der Kanton nicht als Zahl, darum bleibt maxIncome null und die Anzeige nennt keine Grenze.
  AG: { maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplySva', noteParams: { canton: 'AG' },
    beleg: { quelle: 'KVGG AG (SAR 837.200) · V KVGG (SAR 837.211) · SVA Aargau — Wortlaut: docs/sources/ipv-kantone-2026.md', stand: 'Jahr 2026, geprüft 2026-09-20' } },
  TG: { maxIncome: 48000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplySva', noteParams: { canton: 'TG' }, beleg: null },
  TI: { maxIncome: 45000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyIas', beleg: null },
  VD: { maxIncome: 54000, subsidySingle: 3000, subsidyFamily: 6000, subsidyChild: 1500, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteAutoTaxData', beleg: null },
  VS: { maxIncome: 45000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteApplyHealthService', beleg: null },
  NE: { maxIncome: 48000, subsidySingle: 2400, subsidyFamily: 4800, subsidyChild: 1200, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteAutoTaxData', beleg: null },
  GE: { maxIncome: 60000, subsidySingle: 3600, subsidyFamily: 7200, subsidyChild: 1800, modelKey: 'ipv.modelIncomeBased', noteKey: 'ipv.noteAutoSam', beleg: null },
  JU: { maxIncome: 42000, subsidySingle: 2100, subsidyFamily: 4200, subsidyChild: 1050, modelKey: 'ipv.modelFlat', noteKey: 'ipv.noteApplySocialAction', beleg: null },
};

// Kantonale Mietzinsbeiträge / Wohnkosten-Limits (SKOS-Richtlinien + kantonale Anpassungen)
export const CANTONAL_RENT_LIMITS = {
  ZH: { single: 1300, couple: 1550, family3: 1750, family4: 1900, note: 'Stadt Zürich höher' },
  BE: { single: 1100, couple: 1350, family3: 1500, family4: 1650, note: 'Unterschied Stadt/Land' },
  LU: { single: 1150, couple: 1350, family3: 1550, family4: 1700 },
  UR: { single: 1000, couple: 1200, family3: 1350, family4: 1500 },
  SZ: { single: 1200, couple: 1400, family3: 1600, family4: 1750 },
  OW: { single: 1050, couple: 1250, family3: 1400, family4: 1550 },
  NW: { single: 1100, couple: 1300, family3: 1450, family4: 1600 },
  GL: { single: 950, couple: 1150, family3: 1300, family4: 1450 },
  ZG: { single: 1400, couple: 1650, family3: 1850, family4: 2000 },
  FR: { single: 1050, couple: 1250, family3: 1400, family4: 1550 },
  SO: { single: 1050, couple: 1250, family3: 1400, family4: 1550 },
  BS: { single: 1350, couple: 1600, family3: 1800, family4: 1950 },
  BL: { single: 1150, couple: 1350, family3: 1550, family4: 1700 },
  SH: { single: 1050, couple: 1250, family3: 1400, family4: 1550 },
  AR: { single: 950, couple: 1150, family3: 1300, family4: 1450 },
  AI: { single: 950, couple: 1150, family3: 1300, family4: 1450 },
  SG: { single: 1050, couple: 1250, family3: 1400, family4: 1550 },
  GR: { single: 1050, couple: 1250, family3: 1400, family4: 1550 },
  AG: { single: 1100, couple: 1300, family3: 1500, family4: 1650 },
  TG: { single: 1000, couple: 1200, family3: 1350, family4: 1500 },
  TI: { single: 1050, couple: 1250, family3: 1400, family4: 1550 },
  VD: { single: 1300, couple: 1500, family3: 1700, family4: 1900 },
  VS: { single: 1000, couple: 1200, family3: 1350, family4: 1500 },
  NE: { single: 1050, couple: 1250, family3: 1400, family4: 1550 },
  GE: { single: 1500, couple: 1750, family3: 2000, family4: 2200 },
  JU: { single: 950, couple: 1150, family3: 1300, family4: 1450 },
  _default: { single: 1100, couple: 1300, family3: 1500, family4: 1650 },
};

export function getRentLimit(canton, householdSize) {
  const limits = CANTONAL_RENT_LIMITS[canton] || CANTONAL_RENT_LIMITS._default;
  if (householdSize <= 1) return limits.single;
  if (householdSize === 2) return limits.couple;
  if (householdSize === 3) return limits.family3;
  return limits.family4;
}

// SKOS-Grundbedarf für den Lebensunterhalt (GBL), Stand 2025/2026 (SKOS-RL C.3.1)
// Quelle: SKOS, bestätigt via Sozialhilfehandbuch Kanton ZH + AG. Ab 8 Personen + CHF 216/Person.
// Muss mit grundbedarfFuerHaushalt() in data/sozialhilfeRechner.js übereinstimmen (Guard-Test).
export const SKOS_GRUNDBEDARF = {
  1: 1061,
  2: 1624,
  3: 1974,
  4: 2271,
  5: 2568,
  6: 2784,
  7: 3000,
};
const SKOS_GBL_PRO_WEITERE = 216;

export function getGrundbedarf(householdSize) {
  if (householdSize < 1) return SKOS_GRUNDBEDARF[1];
  if (householdSize <= 7) return SKOS_GRUNDBEDARF[householdSize];
  return SKOS_GRUNDBEDARF[7] + (householdSize - 7) * SKOS_GBL_PRO_WEITERE;
}

// Sozialhilfe-Berechnung (SKOS-basiert, kantonal angepasst)
export function calculateSozialhilfe(data) {
  const canton = data.basis?.canton || '';
  const hh = getHouseholdInfo(data);
  const householdSize = hh.householdSize;
  const income = Number(data.finanzen?.monthlyIncome || 0) + Number(data.finanzen?.sideIncome || 0) + hh.partnerIncome;
  const rent = Number(data.wohnen?.rentAmount || 0);
  const utilities = Number(data.wohnen?.utilities || 0);
  const kkPremium = Number(data.versicherungen?.kkPremium || 0);

  const grundbedarf = getGrundbedarf(householdSize);
  const rentLimit = getRentLimit(canton, householdSize);
  const effectiveRent = Math.min(rent + utilities, rentLimit);
  const effectiveKK = kkPremium;

  const totalBedarf = grundbedarf + effectiveRent + effectiveKK;
  const deficit = totalBedarf - income;

  // Vermögensfreibetrag je Kanton (Tabelle + Quellen in data/sozialhilfeRechner.js;
  // ohne eigenen Eintrag: SKOS-RL D.3.1, ab 1.1.2026). Orientierung:
  // Vermögen über dem Freibetrag muss i.d.R. zuerst eingesetzt werden.
  const vermoegen = Number(data.finanzen?.securitiesValue || 0) + Number(data.finanzen?.otherAssets || 0) + Number(data.finanzen?.savingsAccount || 0);
  const minorChildren = hh.children.filter(c => (Number(c.age) || 0) < 18).length;
  const vermoegensfreibetrag = vermoegensfreibetragKanton(canton, hh.adults, minorChildren);
  const vermoegenUeberFreibetrag = Math.max(0, vermoegen - vermoegensfreibetrag);

  return {
    grundbedarf,
    effectiveRent,
    rentLimit,
    effectiveKK,
    totalBedarf,
    income,
    deficit: Math.max(0, deficit),
    eligible: deficit > 0,
    vermoegen,
    vermoegensfreibetrag,
    vermoegenUeberFreibetrag,
    // Vermögen erfasst UND Freibetrag kantonal nicht bestätigt (R4) — auch unter dem Freibetrag.
    vfbUnbestaetigt: vermoegen > 0 && vermoegensfreibetragUnbestaetigt(canton, minorChildren),
    householdSize,
    adults: hh.adults,
    childrenCount: hh.childrenCount,
    children: hh.children,
    isRetired: hh.isRetired,
    canton,
    noteKey: deficit > 0 ? 'sozialhilfeCalc.entitled' : 'sozialhilfeCalc.notEntitled',
    noteParams: deficit > 0 ? { value: Math.max(0, deficit).toFixed(0) } : {},
  };
}

// Kantonale IPV-Berechnung — einkommensabhängig
// Modell: linearer Abbau der Verbilligung zwischen 0 und maxIncome.
// Bei Einkommen = 0 → voller Betrag, bei maxIncome → 0.
//
// Ergebnis-Felder (E9):
//   belegt           true nur, wenn die Kantonszeile amtlich belegt ist (beleg.quelle)
//   eligible/amount  nur bei belegtem Kanton; sonst eligible false, amount null
//   anspruchMoeglich belegt: = eligible. Unbelegt: «prüfenswert», OHNE Vergleich mit der
//                    (unbelegten) Grenze — sobald eine KK-Prämie erfasst ist
// Unbelegt gibt es keine Einschätzung aus Grenze oder Einkommen (die Muster-Grenzen sind
// in vielen Kantonen nachweislich falsch, docs/sources/ipv-kantone-2026.md, PR #161):
// immer derselbe neutrale Hinweis, weder «wahrscheinlich» noch «nicht berechtigt», und
// ohne cantonData (auch der Verfahrens-Hinweis je Kanton ist unbelegt).
export function calculateIPV(data) {
  const canton = data.basis?.canton || '';
  const ipvData = CANTONAL_IPV[canton];
  if (!ipvData) return { eligible: false, amount: 0, noteKey: 'ipv.cantonUnknown', noteParams: {}, canton };

  const hh = getHouseholdInfo(data);
  const income = (Number(data.finanzen?.monthlyIncome || 0) + Number(data.finanzen?.sideIncome || 0) + hh.partnerIncome) * 12;
  const childrenCount = hh.childrenCount;
  // Junge Erwachsene 19–25 in Ausbildung haben in den meisten Kantonen eine
  // eigene (oft höhere) IPV-Kategorie. Die Kinderverbilligung hier gilt für
  // Kinder bis 18 — junge Erwachsene werden separat als Hinweis ausgewiesen.
  const youngAdultsCount = (hh.children || []).filter(c => {
    const age = Number(c.age);
    return age >= 19 && age <= 25;
  }).length;

  const orientierung = (offen) => ({
    eligible: false, belegt: false, amount: null, noteKey: 'ipv.orientierungOffen',
    anspruchMoeglich: Number(data.versicherungen?.kkPremium) > 0, youngAdultsCount, canton, ...(offen && { offen }),
  });
  if (!(ipvData.beleg && ipvData.beleg.quelle)) return orientierung();
  // K31: ZH, BE, AG, SG und LU rechnen nach ihrem eigenen amtlichen Modell (config/ipvZuerich.js,
  // config/ipvBern.js, config/ipvAargau.js, config/ipvStGallen.js bzw. config/ipvLuzern.js). Solange PLZ-Daten und
  // Kantonsmodul noch laden: Orientierung wie ohne Beleg, nie ein geratener Betrag.
  if (canton === 'ZH') {
    if (!_zhModule || !_plzModule) { preloadPLZ(); return orientierung('laden'); }
    return _zhModule.ipvZuerich(data, hh, ipvData, youngAdultsCount, orientierung, _plzModule.lookupPLZ);
  }
  if (canton === 'BE') {
    if (!_beModule || !_plzModule) { preloadPLZ(); return orientierung('laden'); }
    return _beModule.ipvBern(data, hh, ipvData, youngAdultsCount, orientierung, _plzModule.lookupPLZ);
  }
  // AG kennt keine Prämienregionen (V KVGG § 4 Abs. 1: kantonsweiter Durchschnitt), darum
  // wartet es auch nicht auf die PLZ-Daten — nur auf sein eigenes Modul.
  if (canton === 'AG') {
    if (!_agModule) { preloadPLZ(); return orientierung('laden'); }
    return _agModule.ipvAargau(data, hh, ipvData, youngAdultsCount, orientierung);
  }
  if (canton === 'SG') {
    if (!_sgModule || !_plzModule) { preloadPLZ(); return orientierung('laden'); }
    return _sgModule.ipvStGallen(data, hh, ipvData, youngAdultsCount, orientierung, _plzModule.lookupPLZ);
  }
  if (canton === 'LU') {
    if (!_luModule || !_plzModule) { preloadPLZ(); return orientierung('laden'); }
    return _luModule.ipvLuzern(data, hh, ipvData, youngAdultsCount, orientierung, _plzModule.lookupPLZ);
  }

  let maxAnnualSubsidy;
  if (childrenCount > 0) {
    maxAnnualSubsidy = ipvData.subsidyFamily + childrenCount * ipvData.subsidyChild;
  } else {
    maxAnnualSubsidy = ipvData.subsidySingle;
  }

  // Über der Grenze (income ≥ maxIncome) wird der Faktor 0 → annualSubsidy 0.
  const reductionFactor = income > 0 ? Math.max(0, 1 - (income / ipvData.maxIncome)) : 1;
  const annualSubsidy = Math.round(maxAnnualSubsidy * reductionFactor);
  const monthlySubsidy = Math.round(annualSubsidy / 12);

  if (annualSubsidy <= 0) {
    return { belegt: true, eligible: false, amount: 0, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: ipvData.maxIncome }, canton, cantonData: ipvData };
  }

  return {
    eligible: true,
    belegt: true,
    anspruchMoeglich: true,
    amount: monthlySubsidy,
    annual: annualSubsidy,
    maxAnnual: maxAnnualSubsidy,
    reductionPercent: Math.round(reductionFactor * 100),
    noteKey: ipvData.noteKey,
    noteParams: ipvData.noteParams || {},
    youngAdultsCount,
    canton,
    cantonData: ipvData
  };
}

// EL (Ergänzungsleistungen) Berechtigungsprüfung
export function checkELEligibility(data) {
  const hh = getHouseholdInfo(data);
  const income = Number(data.finanzen?.monthlyIncome || 0) + Number(data.finanzen?.sideIncome || 0) + hh.partnerIncome;
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
    noteKey: isAHVIV ? 'elCalc.possible' : 'elCalc.onlyAhvIv',
    noteParams: {},
  };
}
