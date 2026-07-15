// ORDNUNG & RUHE — Data structure with i18n support
// CHAPTERS is now a function that takes t() and returns translated chapters
// Field values stored in localStorage remain language-independent (using option keys)

export const DARK_PALETTE = {
  bg: '#22211F', surface: '#2B2A26', up: '#343330', top: '#3D3B35',
  border: '#423F39', text: '#E6E3DC', mid: '#9CA0A6', soft: '#989CA4',
  // soft (Feintext-Tier) angehoben #8E929A→#989CA4: alt trug auf der häufigen
  // up-Karte (#343330, 184× als bg) nur 4.20:1 → unter AA. Neu 4.76 (up) / 5.22
  // (surface), bleibt aber unter mid (#9CA0A6) → mid/soft-Hierarchie erhalten.
  // top (#3D3B35) wird nie als bg genutzt (0×), daher kein Kontrast-Ziel.
  gold: '#C4A870', sage: '#7E9F8C', rose: '#B87070', sky: '#6E90B0', sand: '#C4A06A',
  onSand: '#2A2620', // dunkler Granit-Text auf Sand-Buttons (WCAG-AA; Sand ist in hell+dunkel gleich)
  // Dunkle, modus-invariante Button-Flächen für weissen Text — sage/rose sind als
  // Fläche zu hell für weissen 15px-Text. Weiss auf sageBtn 8.17:1 / roseBtn 6.65:1 (AA).
  sageBtn: '#3E5449', roseBtn: '#8A4A4A',
  // Legible-Varianten von sand/sky für Vordergrund (Text + bedeutungstragende Graphik):
  // sand besteht im Dunkeln (5.87 auf surface). sky #6E90B0 lag nur bei 4.30 (surface)
  // und fiel auf getönten Flächen (sky+'18') unter AA (3.44–3.78) → #8CAAC6 hält ≥4.75.
  sandDeep: '#C4A06A', skyDeep: '#8CAAC6',
  // roseDeep: lesbare Warnfarbe für Fliesstext/Fehler — rose (#B87070) liegt im
  // Dunkeln nur bei 3.82:1 auf surface. #D98A8A hebt auf 5.44:1 (AA), rose bleibt
  // für Ränder/Flächen/Diagramm-Füllungen (≥3:1) erhalten.
  roseDeep: '#D98A8A',
  // goldDeep: lesbare Gold-Variante für Text — gold (#C4A870) trägt im Dunkeln
  // bereits 6.28:1 auf surface, daher unverändert. Nur der Hellmodus braucht Tiefe.
  goldDeep: '#C4A870',
  sageMist: '#222C27', sageDew: '#28332D', sageDeep: '#8FB0A0'
};

export const LIGHT_PALETTE = {
  bg: '#F2F2F0', surface: '#FAFAF8', up: '#ECECEA', top: '#E4E4E2',
  // mid/soft: Sekundär-/Feintext. Alt-mid (#6A6E74) fiel auf getönten Flächen unter
  // AA: up 4.33 / sageMist 4.49 / top 4.03. Neue Werte halten ≥4.5:1 auf ALLEN Flächen
  // (surface/bg/up/sageMist/top) — mid #5E6167 ≥4.88, soft #5A5D63 ≥5.19. Bleibt ruhig-grau.
  border: '#DCDAD6', text: '#24262A', mid: '#5E6167', soft: '#5A5D63',
  gold: '#C4A870', sage: '#5A7868', rose: '#B87070', sky: '#6E90B0', sand: '#C4A06A',
  onSand: '#2A2620', // dunkler Granit-Text auf Sand-Buttons (WCAG-AA; Sand ist in hell+dunkel gleich)
  // Dunkle, modus-invariante Button-Flächen für weissen Text — sage/rose sind als
  // Fläche zu hell für weissen 15px-Text. Weiss auf sageBtn 8.17:1 / roseBtn 6.65:1 (AA).
  sageBtn: '#3E5449', roseBtn: '#8A4A4A',
  // Legible-Varianten von sand/sky für Vordergrund im Hellmodus: sand (2.34:1) und
  // sky (3.20:1) sind auf surface zu hell für Text. sandDeep alt (#8A6D3B) fiel auf
  // getönten Flächen unter AA (up 4.10 / top 3.81) → #7A5F30 hält ≥4.70 überall.
  // skyDeep 5.42:1 auf surface (≥4.45 auf allen Flächen).
  sandDeep: '#7A5F30', skyDeep: '#4A6A88',
  // roseDeep: lesbare Warnfarbe für Fliesstext/Fehler — rose (#B87070) liegt hell
  // nur bei 3.59:1 auf surface. #9A4A4A hebt auf 5.82:1 (AA), rose bleibt für
  // Ränder/Flächen/Diagramm-Füllungen (≥3:1) erhalten.
  roseDeep: '#9A4A4A',
  // goldDeep: lesbare Gold-Variante für Text — gold (#C4A870) liegt hell nur bei
  // 2.19:1 auf surface. #7C6428 hebt auf 5.42:1 (AA); gold bleibt für Akzente/Ringe.
  goldDeep: '#7C6428',
  sageMist: '#ECF1EE', sageDew: '#DBE6E0', sageDeep: '#4A6657'
};

// ── Farbenblind-Modus (opt-in) ──────────────────────────────────────────
// Das Rot-Grün-Problempaar der App ist sage (grün, positiv) vs. rose (rot,
// Warnung) — für die häufigste Farbenblindheit (Deuteran/Protan) ununter-
// scheidbar. Ist der Modus aktiv, tauschen wir dieses Paar gegen die sichere
// Blau/Orange-Achse (nach Okabe-Ito) und alle sage-Tönungen mit. Die Marken-
// Palette bleibt sonst unberührt (nur wenn eingeschaltet). Das Flag palette.colorBlind
// erlaubt Komponenten, Form-/Symbol-Marker zu ergänzen — Farbe nie allein.
const CB_LIGHT = {
  sage: '#1565A3', rose: '#C25A16', roseDeep: '#A84A12', sageDeep: '#2D5C86',
  sageMist: '#E7EEF5', sageDew: '#D4E2F0',
  // Button-Flächen auf die Blau/Orange-Achse (weiss 7.62:1 / 5.75:1):
  sageBtn: '#14568F', roseBtn: '#A84A12',
};
const CB_DARK = {
  sage: '#6BA6DE', rose: '#E38B4E', roseDeep: '#E38B4E', sageDeep: '#7FA8D0',
  sageMist: '#1E2833', sageDew: '#223140',
  sageBtn: '#14568F', roseBtn: '#A84A12',
};
export function applyColorBlind(palette, active) {
  if (!active) return palette;
  const isDark = palette.bg === DARK_PALETTE.bg;
  return { ...palette, ...(isDark ? CB_DARK : CB_LIGHT), colorBlind: true };
}

import { getCantonName, CANTON_CODES } from './cantonalData.js';
const cantonOptions = (t) => CANTON_CODES.map(c => ({ value: c, label: getCantonName(c, t) }));

// Helper: create select options from translation keys
// Returns [{value: 'key', label: 'Translated label'}]
function opts(t, chapterKey, fieldKey) {
  const fieldDef = t('chapters.' + chapterKey + '.fields.' + fieldKey);
  if (fieldDef && typeof fieldDef === 'object' && fieldDef.options) {
    return Object.entries(fieldDef.options).map(([value, label]) => ({ value, label }));
  }
  return [];
}

// Get translated field label
function fl(t, chapterKey, fieldKey) {
  const fieldDef = t('chapters.' + chapterKey + '.fields.' + fieldKey);
  if (typeof fieldDef === 'object' && fieldDef.label) return fieldDef.label;
  return typeof fieldDef === 'string' ? fieldDef : fieldKey;
}

// Get translated placeholder
function ph(t, chapterKey, fieldKey) {
  return t('chapters.' + chapterKey + '.placeholders.' + fieldKey);
}

// Get translated hint
function hn(t, chapterKey, fieldKey) {
  return t('chapters.' + chapterKey + '.hints.' + fieldKey);
}

// Get orientation sentence for a field (Helvetia layer)
function or(t, orientationKey) {
  const val = t('orientation.' + orientationKey);
  // Only return if it resolved (not the raw key)
  return val && val !== 'orientation.' + orientationKey ? val : '';
}

// Get section intro sentence (Section Voice layer)
function si(t, chapterKey, sectionKey) {
  const val = t('sectionIntros.' + chapterKey + '.' + sectionKey);
  return val && val !== 'sectionIntros.' + chapterKey + '.' + sectionKey ? val : '';
}

// Get contextual official link for a field
function lk(t, linkKey) {
  const val = t('contextLinks.' + linkKey);
  return val && typeof val === 'object' && val.url ? val : null;
}

// Get translated doc label
function dl(t, chapterKey, docKey) {
  return t('chapters.' + chapterKey + '.docs.' + docKey);
}

export function getChapters(t) {
  return [
    {
      key: 'basis',
      title: t('chapters.basis.title'),
      description: t('chapters.basis.description'),
      icon: t('chapters.basis.icon'),
      fields: [
        { k: 'firstName', label: fl(t, 'basis', 'firstName'), type: 'text', required: true, mvo: true, autoComplete: 'given-name', section: t('sections.basis.person'), sectionIntro: si(t, 'basis', 'person') },
        { k: 'middleName', label: fl(t, 'basis', 'middleName'), type: 'text', autoComplete: 'additional-name' },
        { k: 'lastName', label: fl(t, 'basis', 'lastName'), type: 'text', required: true, mvo: true, autoComplete: 'family-name' },
        { k: 'academicTitle', label: fl(t, 'basis', 'academicTitle'), hint: hn(t, 'basis', 'academicTitle'), type: 'text', autoComplete: 'honorific-prefix' },
        { k: 'dateOfBirth', label: fl(t, 'basis', 'dateOfBirth'), type: 'date', required: true, mvo: true, autoComplete: 'bday' },
        { k: 'gender', label: fl(t, 'basis', 'gender'), type: 'select', options: opts(t, 'basis', 'gender') },
        { k: 'pronouns', label: fl(t, 'basis', 'pronouns'), type: 'select', options: opts(t, 'basis', 'pronouns') },
        { k: 'nationality', label: fl(t, 'basis', 'nationality'), type: 'select', options: opts(t, 'basis', 'nationality') },
        { k: 'canton', label: fl(t, 'basis', 'canton'), type: 'select', options: cantonOptions(t), mvo: true },
        { k: 'phone', label: fl(t, 'basis', 'phone'), type: 'tel', placeholder: ph(t, 'basis', 'phone'), mvo: true, autoComplete: 'tel', section: t('sections.basis.contact'), sectionIntro: si(t, 'basis', 'contact') },
        { k: 'email', label: fl(t, 'basis', 'email'), type: 'email', mvo: true, autoComplete: 'email' },
        { k: 'ahv', label: fl(t, 'basis', 'ahv'), type: 'text', placeholder: ph(t, 'basis', 'ahv'), hint: hn(t, 'basis', 'ahv'), orientation: or(t, 'ahv') },
        { k: 'maritalStatus', label: fl(t, 'basis', 'maritalStatus'), type: 'select', options: opts(t, 'basis', 'maritalStatus'), section: t('sections.basis.family'), sectionIntro: si(t, 'basis', 'family') },
        { k: 'household', type: 'household' },
      ],
      docs: [
        { k: 'id', label: dl(t, 'basis', 'id') },
        { k: 'ahv_card', label: dl(t, 'basis', 'ahv_card') },
      ]
    },
    {
      key: 'wohnen',
      title: t('chapters.wohnen.title'),
      description: t('chapters.wohnen.description'),
      icon: t('chapters.wohnen.icon'),
      fields: [
        { k: 'address', label: fl(t, 'wohnen', 'address'), type: 'text', mvo: true, autoComplete: 'street-address', section: t('sections.wohnen.address'), sectionIntro: si(t, 'wohnen', 'address') },
        { k: 'postalCode', label: fl(t, 'wohnen', 'postalCode'), type: 'text', mvo: true, autoComplete: 'postal-code' },
        { k: 'city', label: fl(t, 'wohnen', 'city'), type: 'text', mvo: true, autoComplete: 'address-level2' },
        { k: 'moveInDate', label: fl(t, 'wohnen', 'moveInDate'), type: 'date' },
        { k: 'rentAmount', label: fl(t, 'wohnen', 'rentAmount'), type: 'currency', section: t('sections.wohnen.costs'), sectionIntro: si(t, 'wohnen', 'costs'), orientation: or(t, 'miete') },
        { k: 'utilities', label: fl(t, 'wohnen', 'utilities'), type: 'currency' },
        { k: 'landlord', label: fl(t, 'wohnen', 'landlord'), type: 'text', section: t('sections.wohnen.landlord'), sectionIntro: si(t, 'wohnen', 'landlord') },
        { k: 'landlordPhone', label: fl(t, 'wohnen', 'landlordPhone'), type: 'tel' },
        { k: 'mortgageStatus', label: fl(t, 'wohnen', 'mortgageStatus'), type: 'select', options: opts(t, 'wohnen', 'mortgageStatus'), section: t('sections.wohnen.property'), sectionIntro: si(t, 'wohnen', 'property'), secondary: true },
        { k: 'propertyValue', label: fl(t, 'wohnen', 'propertyValue'), type: 'currency', secondary: true },
        { k: 'buildingsInsurance', label: fl(t, 'wohnen', 'buildingsInsurance'), type: 'currency', secondary: true },
        { k: 'residenceType', label: fl(t, 'wohnen', 'residenceType'), type: 'select', options: opts(t, 'wohnen', 'residenceType'), secondary: true, orientation: or(t, 'wohnform') },
      ],
      docs: [
        { k: 'lease', label: dl(t, 'wohnen', 'lease') },
        { k: 'insurance', label: dl(t, 'wohnen', 'insurance') },
        { k: 'deposit', label: dl(t, 'wohnen', 'deposit') },
      ]
    },
    {
      key: 'finanzen',
      title: t('chapters.finanzen.title'),
      description: t('chapters.finanzen.description'),
      icon: t('chapters.finanzen.icon'),
      fields: [
        { k: 'monthlyIncome', label: fl(t, 'finanzen', 'monthlyIncome'), type: 'currency', hint: hn(t, 'finanzen', 'monthlyIncome'), mvo: true, section: t('sections.finanzen.income'), sectionIntro: si(t, 'finanzen', 'income'), orientation: or(t, 'einkommen') },
        { k: 'sideIncome', label: fl(t, 'finanzen', 'sideIncome'), type: 'currency', hint: hn(t, 'finanzen', 'sideIncome') },
        // Nebenerwerb-Anstellung: nur nötig, wenn daraus ein Brief werden soll. Die Stunden
        // sind Pflicht für jeden Lohn-Befund — ohne sie wird nicht gerechnet (kein 182h-Raten).
        { k: 'sideEmployer', label: fl(t, 'finanzen', 'sideEmployer'), type: 'text', hint: hn(t, 'finanzen', 'sideEmployer') },
        { k: 'sideEmployerAddress', label: fl(t, 'finanzen', 'sideEmployerAddress'), type: 'textarea', hint: hn(t, 'finanzen', 'sideEmployerAddress') },
        { k: 'sideHoursPerWeek', label: fl(t, 'finanzen', 'sideHoursPerWeek'), type: 'text', hint: hn(t, 'finanzen', 'sideHoursPerWeek') },
        { k: 'taxableIncome', label: fl(t, 'finanzen', 'taxableIncome'), type: 'currency', hint: hn(t, 'finanzen', 'taxableIncome'), secondary: true },
        { k: 'incomeType', label: fl(t, 'finanzen', 'incomeType'), type: 'select', options: opts(t, 'finanzen', 'incomeType') },
        { k: 'employer', label: fl(t, 'finanzen', 'employer'), type: 'text', mvo: true },
        { k: 'employerAddress', label: fl(t, 'finanzen', 'employerAddress'), type: 'textarea', hint: hn(t, 'finanzen', 'employerAddress') },
        { k: 'employmentType', label: fl(t, 'finanzen', 'employmentType'), type: 'select', options: opts(t, 'finanzen', 'employmentType') },
        { k: 'startDate', label: fl(t, 'finanzen', 'startDate'), type: 'date' },
        { k: 'familienzulagen', label: fl(t, 'finanzen', 'familienzulagen'), type: 'currency', hint: hn(t, 'finanzen', 'familienzulagen') },
        { k: 'alimenteReceived', label: fl(t, 'finanzen', 'alimenteReceived'), type: 'currency', hint: hn(t, 'finanzen', 'alimenteReceived') },
        { k: 'monthlyTax', label: fl(t, 'finanzen', 'monthlyTax'), type: 'currency', hint: hn(t, 'finanzen', 'monthlyTax'), section: t('sections.finanzen.budgetLight'), sectionIntro: si(t, 'finanzen', 'budgetLight'), orientation: or(t, 'steuern') },
        { k: 'groceries', label: fl(t, 'finanzen', 'groceries'), type: 'currency', itemized: true, hint: hn(t, 'finanzen', 'groceries') },
        { k: 'communication', label: fl(t, 'finanzen', 'communication'), type: 'currency', itemized: true, hint: hn(t, 'finanzen', 'communication') },
        { k: 'mobility', label: fl(t, 'finanzen', 'mobility'), type: 'currency', hint: hn(t, 'finanzen', 'mobility') },
        { k: 'childcare', label: fl(t, 'finanzen', 'childcare'), type: 'currency', hint: hn(t, 'finanzen', 'childcare') },
        { k: 'otherInsurance', label: fl(t, 'finanzen', 'otherInsurance'), type: 'currency', hint: hn(t, 'finanzen', 'otherInsurance') },
        { k: 'debtPayments', label: fl(t, 'finanzen', 'debtPayments'), type: 'currency', hint: hn(t, 'finanzen', 'debtPayments'), section: t('sections.finanzen.obligations'), sectionIntro: si(t, 'finanzen', 'obligations'), orientation: or(t, 'schuldenraten') },
        { k: 'alimentePaid', label: fl(t, 'finanzen', 'alimentePaid'), type: 'currency', hint: hn(t, 'finanzen', 'alimentePaid') },
        { k: 'savingsGoal', label: fl(t, 'finanzen', 'savingsGoal'), type: 'currency', section: t('sections.finanzen.savings'), sectionIntro: si(t, 'finanzen', 'savings') },
        { k: 'savingsAccount', label: fl(t, 'finanzen', 'savingsAccount'), type: 'currency' },
        { k: 'bankName', label: fl(t, 'finanzen', 'bankName'), type: 'text' },
        { k: 'securitiesValue', label: fl(t, 'finanzen', 'securitiesValue'), type: 'currency', hint: hn(t, 'finanzen', 'securitiesValue'), section: t('sections.finanzen.assets'), sectionIntro: si(t, 'finanzen', 'assets') },
        { k: 'otherAssets', label: fl(t, 'finanzen', 'otherAssets'), type: 'currency', hint: hn(t, 'finanzen', 'otherAssets') },
        { k: 'creditCard', label: fl(t, 'finanzen', 'creditCard'), type: 'select', options: opts(t, 'finanzen', 'creditCard'), section: t('sections.finanzen.credit'), sectionIntro: si(t, 'finanzen', 'credit') },
        { k: 'creditCardLimit', label: fl(t, 'finanzen', 'creditCardLimit'), type: 'currency', hint: hn(t, 'finanzen', 'creditCardLimit') },
        { k: 'creditCardBalance', label: fl(t, 'finanzen', 'creditCardBalance'), type: 'currency', hint: hn(t, 'finanzen', 'creditCardBalance') },
        { k: 'loans', label: fl(t, 'finanzen', 'loans'), type: 'currency' },
        { k: 'pension3a', label: fl(t, 'finanzen', 'pension3a'), type: 'currency', section: t('sections.finanzen.provision'), sectionIntro: si(t, 'finanzen', 'provision'), secondary: true, orientation: or(t, 'saeule3a') },
        { k: 'pension3aBalance', label: fl(t, 'finanzen', 'pension3aBalance'), type: 'currency', hint: hn(t, 'finanzen', 'pension3aBalance'), secondary: true },
        { k: 'pension3b', label: fl(t, 'finanzen', 'pension3b'), type: 'select', options: opts(t, 'finanzen', 'pension3b'), secondary: true, orientation: or(t, 'saeule3b') },
        { k: 'pension3bBalance', label: fl(t, 'finanzen', 'pension3bBalance'), type: 'currency', hint: hn(t, 'finanzen', 'pension3bBalance'), secondary: true },
        { k: 'investmentFunds', label: fl(t, 'finanzen', 'investmentFunds'), type: 'select', options: opts(t, 'finanzen', 'investmentFunds'), secondary: true },
      ],
      docs: [
        { k: 'tax_return', label: dl(t, 'finanzen', 'tax_return') },
        { k: 'income_proof', label: dl(t, 'finanzen', 'income_proof') },
        { k: 'bank_statement', label: dl(t, 'finanzen', 'bank_statement') },
      ]
    },
    {
      key: 'versicherungen',
      title: t('chapters.versicherungen.title'),
      description: t('chapters.versicherungen.description'),
      icon: t('chapters.versicherungen.icon'),
      fields: [
        { k: 'kkInsurer', label: fl(t, 'versicherungen', 'kkInsurer'), type: 'text', placeholder: ph(t, 'versicherungen', 'kkInsurer'), mvo: true, section: t('sections.versicherungen.basic'), sectionIntro: si(t, 'versicherungen', 'basic'), orientation: or(t, 'kvg'), link: lk(t, 'kkWechsel') },
        { k: 'kkModel', label: fl(t, 'versicherungen', 'kkModel'), type: 'select', options: opts(t, 'versicherungen', 'kkModel') },
        { k: 'kkPremium', label: fl(t, 'versicherungen', 'kkPremium'), type: 'currency', mvo: true },
        { k: 'franchise', label: fl(t, 'versicherungen', 'franchise'), type: 'select', options: opts(t, 'versicherungen', 'franchise'), mvo: true, orientation: or(t, 'franchise') },
        { k: 'kkCardNumber', label: fl(t, 'versicherungen', 'kkCardNumber'), type: 'text' },
        { k: 'policyNumber', label: fl(t, 'versicherungen', 'policyNumber'), type: 'text', hint: hn(t, 'versicherungen', 'policyNumber') },
        { k: 'kkZusatz', label: fl(t, 'versicherungen', 'kkZusatz'), type: 'text', placeholder: ph(t, 'versicherungen', 'kkZusatz') },
        { k: 'bvgInsurer', label: fl(t, 'versicherungen', 'bvgInsurer'), type: 'text', section: t('sections.versicherungen.occupational'), sectionIntro: si(t, 'versicherungen', 'occupational'), orientation: or(t, 'bvg') },
        { k: 'bvgContribution', label: fl(t, 'versicherungen', 'bvgContribution'), type: 'currency', hint: hn(t, 'versicherungen', 'bvgContribution') },
        { k: 'bvgBalance', label: fl(t, 'versicherungen', 'bvgBalance'), type: 'currency', hint: hn(t, 'versicherungen', 'bvgBalance') },
        { k: 'lifeInsurance', label: fl(t, 'versicherungen', 'lifeInsurance'), type: 'select', options: opts(t, 'versicherungen', 'lifeInsurance') },
        { k: 'freizuegigkeit', label: fl(t, 'versicherungen', 'freizuegigkeit'), type: 'text', placeholder: ph(t, 'versicherungen', 'freizuegigkeit') },
        { k: 'uvg', label: fl(t, 'versicherungen', 'uvg'), type: 'select', options: opts(t, 'versicherungen', 'uvg'), section: t('sections.versicherungen.additional'), sectionIntro: si(t, 'versicherungen', 'additional'), orientation: or(t, 'uvg') },
        { k: 'ktg', label: fl(t, 'versicherungen', 'ktg'), type: 'select', options: opts(t, 'versicherungen', 'ktg'), hint: hn(t, 'versicherungen', 'ktg') },
        { k: 'liabilityInsurance', label: fl(t, 'versicherungen', 'liabilityInsurance'), type: 'select', options: opts(t, 'versicherungen', 'liabilityInsurance') },
        { k: 'liabilityAmount', label: fl(t, 'versicherungen', 'liabilityAmount'), type: 'currency' },
        { k: 'legalInsurance', label: fl(t, 'versicherungen', 'legalInsurance'), type: 'select', options: opts(t, 'versicherungen', 'legalInsurance') },
        { k: 'childInsurance', label: fl(t, 'versicherungen', 'childInsurance'), type: 'select', options: opts(t, 'versicherungen', 'childInsurance') },
        { k: 'householdInsurance', label: fl(t, 'versicherungen', 'householdInsurance'), type: 'select', options: opts(t, 'versicherungen', 'householdInsurance'), section: t('sections.versicherungen.property'), sectionIntro: si(t, 'versicherungen', 'property'), secondary: true },
        { k: 'householdInsuranceAmount', label: fl(t, 'versicherungen', 'householdInsuranceAmount'), type: 'currency', secondary: true },
        { k: 'travelInsurance', label: fl(t, 'versicherungen', 'travelInsurance'), type: 'select', options: opts(t, 'versicherungen', 'travelInsurance'), secondary: true },
        { k: 'cyberInsurance', label: fl(t, 'versicherungen', 'cyberInsurance'), type: 'select', options: opts(t, 'versicherungen', 'cyberInsurance'), secondary: true },
        { k: 'autoInsurance', label: fl(t, 'versicherungen', 'autoInsurance'), type: 'select', options: opts(t, 'versicherungen', 'autoInsurance'), section: t('sections.versicherungen.mobility'), sectionIntro: si(t, 'versicherungen', 'mobility'), secondary: true },
        { k: 'autoInsuranceAmount', label: fl(t, 'versicherungen', 'autoInsuranceAmount'), type: 'currency', secondary: true },
        { k: 'ahvContribution', label: fl(t, 'versicherungen', 'ahvContribution'), type: 'currency', section: t('sections.versicherungen.social'), sectionIntro: si(t, 'versicherungen', 'social'), orientation: or(t, 'ahvBeitrag'), link: lk(t, 'ahv') },
      ],
      docs: [
        { k: 'kkcard', label: dl(t, 'versicherungen', 'kkcard') },
        { k: 'bvg_cert', label: dl(t, 'versicherungen', 'bvg_cert') },
        { k: 'ahv_confirmation', label: dl(t, 'versicherungen', 'ahv_confirmation') },
        { k: 'household_policy', label: dl(t, 'versicherungen', 'household_policy') },
        { k: 'auto_policy', label: dl(t, 'versicherungen', 'auto_policy') },
      ]
    },
    {
      key: 'ausbildung',
      title: t('chapters.ausbildung.title'),
      description: t('chapters.ausbildung.description'),
      icon: t('chapters.ausbildung.icon'),
      fields: [
        { k: 'schoolName', label: fl(t, 'ausbildung', 'schoolName'), type: 'text', section: t('sections.ausbildung.education'), sectionIntro: si(t, 'ausbildung', 'education') },
        { k: 'educationLevel', label: fl(t, 'ausbildung', 'educationLevel'), type: 'select', options: opts(t, 'ausbildung', 'educationLevel') },
        { k: 'efzNumber', label: fl(t, 'ausbildung', 'efzNumber'), type: 'text' },
        { k: 'certifications', label: fl(t, 'ausbildung', 'certifications'), type: 'textarea' },
        { k: 'employer', label: fl(t, 'ausbildung', 'employer'), type: 'text', section: t('sections.ausbildung.work'), sectionIntro: si(t, 'ausbildung', 'work') },
        // Kein `hint`: das Kapitel „Ausbildung & Arbeit" führt bewusst keine Hinweise.
        // Die Erklärung steht am gekoppelten Feld in Finanzen (Quer-Befüllung, main.jsx).
        { k: 'employerAddress', label: fl(t, 'ausbildung', 'employerAddress'), type: 'textarea' },
        { k: 'jobTitle', label: fl(t, 'ausbildung', 'jobTitle'), type: 'text', mvo: true, orientation: or(t, 'beruf') },
        { k: 'employmentStart', label: fl(t, 'ausbildung', 'employmentStart'), type: 'date' },
        { k: 'workPermit', label: fl(t, 'ausbildung', 'workPermit'), type: 'select', options: opts(t, 'ausbildung', 'workPermit'), orientation: or(t, 'bewilligung_b') },
        { k: 'workHoursPerWeek', label: fl(t, 'ausbildung', 'workHoursPerWeek'), type: 'text' },
        { k: 'languages', label: fl(t, 'ausbildung', 'languages'), type: 'textarea', section: t('sections.ausbildung.languages'), sectionIntro: si(t, 'ausbildung', 'languages') },
      ],
      docs: [
        { k: 'diploma', label: dl(t, 'ausbildung', 'diploma') },
        { k: 'certificates', label: dl(t, 'ausbildung', 'certificates') },
        { k: 'cv_file', label: dl(t, 'ausbildung', 'cv_file') },
      ]
    },
    {
      key: 'behoerden',
      title: t('chapters.behoerden.title'),
      description: t('chapters.behoerden.description'),
      icon: t('chapters.behoerden.icon'),
      fields: [
        { k: 'cantoneOfTaxation', label: fl(t, 'behoerden', 'cantoneOfTaxation'), type: 'select', options: cantonOptions(t), mvo: true, section: t('sections.behoerden.taxes'), sectionIntro: si(t, 'behoerden', 'taxes'), orientation: or(t, 'steuerverwaltung') },
        { k: 'taxId', label: fl(t, 'behoerden', 'taxId'), type: 'text' },
        { k: 'taxFilingDeadline', label: fl(t, 'behoerden', 'taxFilingDeadline'), type: 'date' },
        { k: 'pendingTaxReturns', label: fl(t, 'behoerden', 'pendingTaxReturns'), type: 'text' },
        { k: 'registryOffice', label: fl(t, 'behoerden', 'registryOffice'), type: 'text', section: t('sections.behoerden.legal'), sectionIntro: si(t, 'behoerden', 'legal'), orientation: or(t, 'sozialdienst') },
        { k: 'betreibungsStatus', label: fl(t, 'behoerden', 'betreibungsStatus'), type: 'select', options: opts(t, 'behoerden', 'betreibungsStatus'), orientation: or(t, 'betreibung') },
        { k: 'courtCases', label: fl(t, 'behoerden', 'courtCases'), type: 'select', options: opts(t, 'behoerden', 'courtCases') },
        { k: 'legalRepresentative', label: fl(t, 'behoerden', 'legalRepresentative'), type: 'text', section: t('sections.behoerden.representation'), sectionIntro: si(t, 'behoerden', 'representation') },
        { k: 'representativePhone', label: fl(t, 'behoerden', 'representativePhone'), type: 'tel' },
        { k: 'willMade', label: fl(t, 'behoerden', 'willMade'), type: 'select', options: opts(t, 'behoerden', 'willMade'), orientation: or(t, 'testament'), link: lk(t, 'testament') },
      ],
      docs: [
        { k: 'betreibungsauszug', label: dl(t, 'behoerden', 'betreibungsauszug') },
        { k: 'will', label: dl(t, 'behoerden', 'will') },
        { k: 'power_of_attorney', label: dl(t, 'behoerden', 'power_of_attorney') },
        { k: 'patientenverfuegung', label: dl(t, 'behoerden', 'patientenverfuegung') },
      ]
    },
    {
      key: 'notfall',
      title: t('chapters.notfall.title'),
      description: t('chapters.notfall.description'),
      icon: t('chapters.notfall.icon'),
      fields: [
        { k: 'emergencyContact', label: fl(t, 'notfall', 'emergencyContact'), type: 'text', required: true, mvo: true, section: t('sections.notfall.contact'), sectionIntro: si(t, 'notfall', 'contact') },
        { k: 'emergencyPhone', label: fl(t, 'notfall', 'emergencyPhone'), type: 'tel', required: true, mvo: true },
        { k: 'bloodType', label: fl(t, 'notfall', 'bloodType'), type: 'select', options: opts(t, 'notfall', 'bloodType'), section: t('sections.notfall.medical'), sectionIntro: si(t, 'notfall', 'medical') },
        { k: 'allergies', label: fl(t, 'notfall', 'allergies'), type: 'textarea' },
        { k: 'medications', label: fl(t, 'notfall', 'medications'), type: 'textarea' },
        { k: 'chronicDiseases', label: fl(t, 'notfall', 'chronicDiseases'), type: 'textarea' },
        { k: 'doctor', label: fl(t, 'notfall', 'doctor'), type: 'text', section: t('sections.notfall.care'), sectionIntro: si(t, 'notfall', 'care') },
        { k: 'doctorPhone', label: fl(t, 'notfall', 'doctorPhone'), type: 'tel' },
        { k: 'hospital', label: fl(t, 'notfall', 'hospital'), type: 'text' },
        { k: 'organDonor', label: fl(t, 'notfall', 'organDonor'), type: 'select', options: opts(t, 'notfall', 'organDonor'), section: t('sections.notfall.provision'), sectionIntro: si(t, 'notfall', 'provision'), secondary: true },
        { k: 'patientenverfuegung', label: fl(t, 'notfall', 'patientenverfuegung'), type: 'select', options: opts(t, 'notfall', 'patientenverfuegung'), hint: hn(t, 'notfall', 'patientenverfuegung'), orientation: or(t, 'patientenverfuegung'), link: lk(t, 'patientenverfuegung'), secondary: true },
        { k: 'vorsorgeauftrag', label: fl(t, 'notfall', 'vorsorgeauftrag'), type: 'select', options: opts(t, 'notfall', 'vorsorgeauftrag'), hint: hn(t, 'notfall', 'vorsorgeauftrag'), orientation: or(t, 'vorsorgeauftrag'), secondary: true },
        { k: 'bestattungswuensche', label: fl(t, 'notfall', 'bestattungswuensche'), type: 'select', options: opts(t, 'notfall', 'bestattungswuensche'), hint: hn(t, 'notfall', 'bestattungswuensche'), secondary: true },
      ],
      docs: [
        { k: 'advance_directive', label: dl(t, 'notfall', 'advance_directive') },
        { k: 'organ_card', label: dl(t, 'notfall', 'organ_card') },
        { k: 'blood_card', label: dl(t, 'notfall', 'blood_card') },
      ]
    },
  ];
}

// Derive display name from firstName + lastName (backward-compat with legacy fullName)
export function getFullName(basisData) {
  if (!basisData) return '';
  // Akademischer/beruflicher Titel (Dr., MSc …) wird dem Namen vorangestellt,
  // sobald er erfasst ist — wirkt damit überall, wo der Name angezeigt wird.
  const title = (basisData.academicTitle || '').trim();
  const first = (basisData.firstName || '').trim();
  const middle = (basisData.middleName || '').trim();
  const last = (basisData.lastName || '').trim();
  if (first || middle || last) return [title, first, middle, last].filter(Boolean).join(' ');
  const fallback = (basisData.fullName || '').trim();
  return fallback ? [title, fallback].filter(Boolean).join(' ') : '';
}

// Keep CHAPTER_KEYS for data initialization (language-independent)
export const CHAPTER_KEYS = ['basis', 'wohnen', 'finanzen', 'versicherungen', 'ausbildung', 'behoerden', 'notfall'];

// Field keys per chapter (for data initialization — no translations needed).
// Wie das Geschwister CHAPTER_KEYS exportiert: sprachunabhängige Feldkarte, damit
// Daten-Init/-Validierung sie ohne getChapters(t) nutzen können.
export const FIELD_KEYS = {
  basis: ['firstName', 'middleName', 'lastName', 'academicTitle', 'dateOfBirth', 'gender', 'pronouns', 'nationality', 'canton', 'phone', 'email', 'ahv', 'maritalStatus'],
  wohnen: ['address', 'postalCode', 'city', 'moveInDate', 'rentAmount', 'utilities', 'landlord', 'landlordPhone', 'mortgageStatus', 'propertyValue', 'buildingsInsurance', 'residenceType'],
  finanzen: ['monthlyIncome', 'incomeType', 'employer', 'employmentType', 'startDate', 'familienzulagen', 'alimenteReceived', 'monthlyTax', 'groceries', 'communication', 'mobility', 'childcare', 'otherInsurance', 'debtPayments', 'alimentePaid', 'savingsGoal', 'savingsAccount', 'bankName', 'creditCard', 'creditCardLimit', 'creditCardBalance', 'loans', 'pension3a', 'pension3aBalance', 'pension3b', 'pension3bBalance', 'investmentFunds'],
  versicherungen: ['kkInsurer', 'kkModel', 'kkPremium', 'franchise', 'kkCardNumber', 'policyNumber', 'kkZusatz', 'bvgInsurer', 'bvgContribution', 'bvgBalance', 'lifeInsurance', 'freizuegigkeit', 'uvg', 'ktg', 'liabilityInsurance', 'liabilityAmount', 'legalInsurance', 'childInsurance', 'householdInsurance', 'householdInsuranceAmount', 'travelInsurance', 'cyberInsurance', 'autoInsurance', 'autoInsuranceAmount', 'ahvContribution'],
  ausbildung: ['schoolName', 'educationLevel', 'efzNumber', 'certifications', 'employer', 'jobTitle', 'employmentStart', 'workPermit', 'workHoursPerWeek', 'languages'],
  behoerden: ['cantoneOfTaxation', 'taxId', 'taxFilingDeadline', 'pendingTaxReturns', 'registryOffice', 'betreibungsStatus', 'courtCases', 'legalRepresentative', 'representativePhone', 'willMade'],
  notfall: ['emergencyContact', 'emergencyPhone', 'bloodType', 'allergies', 'medications', 'chronicDiseases', 'doctor', 'doctorPhone', 'hospital', 'organDonor', 'patientenverfuegung', 'vorsorgeauftrag', 'bestattungswuensche'],
};

