// ORDNUNG & RUHE — Data structure with i18n support
// CHAPTERS is now a function that takes t() and returns translated chapters
// Field values stored in localStorage remain language-independent (using option keys)

export const DARK_PALETTE = {
  bg: '#0F0E0C', surface: '#161513', up: '#1E1C19', top: '#252320',
  border: '#2A2824', text: '#EDE8E0', mid: '#8A8478', soft: '#504C46',
  gold: '#C9A96E', sage: '#7B9E8C', rose: '#B87070', sky: '#6E90B0', sand: '#B8956A',
  sageMist: '#1A2420', sageDew: '#1F2E28', sageDeep: '#8FB5A0'
};

export const LIGHT_PALETTE = {
  bg: '#F5F2EE', surface: '#FFFFFF', up: '#F0EDE8', top: '#EAE5DD',
  border: '#DDD8D0', text: '#1C1A17', mid: '#6B6560', soft: '#A89F94',
  gold: '#C9A96E', sage: '#7B9E8C', rose: '#B87070', sky: '#6E90B0', sand: '#B8956A',
  sageMist: '#E8F0EC', sageDew: '#D4E5DB', sageDeep: '#5C7D6C'
};

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
        { k: 'firstName', label: fl(t, 'basis', 'firstName'), type: 'text', required: true, mvo: true, section: t('sections.basis.person'), sectionIntro: si(t, 'basis', 'person') },
        { k: 'middleName', label: fl(t, 'basis', 'middleName'), type: 'text' },
        { k: 'lastName', label: fl(t, 'basis', 'lastName'), type: 'text', required: true, mvo: true },
        { k: 'dateOfBirth', label: fl(t, 'basis', 'dateOfBirth'), type: 'date', required: true, mvo: true },
        { k: 'gender', label: fl(t, 'basis', 'gender'), type: 'select', options: opts(t, 'basis', 'gender') },
        { k: 'nationality', label: fl(t, 'basis', 'nationality'), type: 'select', options: opts(t, 'basis', 'nationality') },
        { k: 'canton', label: fl(t, 'basis', 'canton'), type: 'select', options: cantonOptions(t), mvo: true },
        { k: 'phone', label: fl(t, 'basis', 'phone'), type: 'tel', placeholder: ph(t, 'basis', 'phone'), mvo: true, section: t('sections.basis.contact'), sectionIntro: si(t, 'basis', 'contact') },
        { k: 'email', label: fl(t, 'basis', 'email'), type: 'email', mvo: true },
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
        { k: 'address', label: fl(t, 'wohnen', 'address'), type: 'text', mvo: true, section: t('sections.wohnen.address'), sectionIntro: si(t, 'wohnen', 'address') },
        { k: 'postalCode', label: fl(t, 'wohnen', 'postalCode'), type: 'text', mvo: true },
        { k: 'city', label: fl(t, 'wohnen', 'city'), type: 'text', mvo: true },
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
        { k: 'incomeType', label: fl(t, 'finanzen', 'incomeType'), type: 'select', options: opts(t, 'finanzen', 'incomeType') },
        { k: 'employer', label: fl(t, 'finanzen', 'employer'), type: 'text', mvo: true },
        { k: 'employmentType', label: fl(t, 'finanzen', 'employmentType'), type: 'select', options: opts(t, 'finanzen', 'employmentType') },
        { k: 'startDate', label: fl(t, 'finanzen', 'startDate'), type: 'date' },
        { k: 'familienzulagen', label: fl(t, 'finanzen', 'familienzulagen'), type: 'currency', hint: hn(t, 'finanzen', 'familienzulagen') },
        { k: 'alimenteReceived', label: fl(t, 'finanzen', 'alimenteReceived'), type: 'currency', hint: hn(t, 'finanzen', 'alimenteReceived') },
        { k: 'monthlyTax', label: fl(t, 'finanzen', 'monthlyTax'), type: 'currency', hint: hn(t, 'finanzen', 'monthlyTax'), section: t('sections.finanzen.budgetLight'), sectionIntro: si(t, 'finanzen', 'budgetLight'), orientation: or(t, 'steuern') },
        { k: 'groceries', label: fl(t, 'finanzen', 'groceries'), type: 'currency', hint: hn(t, 'finanzen', 'groceries') },
        { k: 'communication', label: fl(t, 'finanzen', 'communication'), type: 'currency', hint: hn(t, 'finanzen', 'communication') },
        { k: 'mobility', label: fl(t, 'finanzen', 'mobility'), type: 'currency', hint: hn(t, 'finanzen', 'mobility') },
        { k: 'childcare', label: fl(t, 'finanzen', 'childcare'), type: 'currency', hint: hn(t, 'finanzen', 'childcare') },
        { k: 'otherInsurance', label: fl(t, 'finanzen', 'otherInsurance'), type: 'currency', hint: hn(t, 'finanzen', 'otherInsurance') },
        { k: 'debtPayments', label: fl(t, 'finanzen', 'debtPayments'), type: 'currency', hint: hn(t, 'finanzen', 'debtPayments'), section: t('sections.finanzen.obligations'), sectionIntro: si(t, 'finanzen', 'obligations'), orientation: or(t, 'schuldenraten') },
        { k: 'alimentePaid', label: fl(t, 'finanzen', 'alimentePaid'), type: 'currency', hint: hn(t, 'finanzen', 'alimentePaid') },
        { k: 'savingsGoal', label: fl(t, 'finanzen', 'savingsGoal'), type: 'currency', section: t('sections.finanzen.savings'), sectionIntro: si(t, 'finanzen', 'savings') },
        { k: 'savingsAccount', label: fl(t, 'finanzen', 'savingsAccount'), type: 'currency' },
        { k: 'bankName', label: fl(t, 'finanzen', 'bankName'), type: 'text' },
        { k: 'creditCard', label: fl(t, 'finanzen', 'creditCard'), type: 'select', options: opts(t, 'finanzen', 'creditCard'), section: t('sections.finanzen.credit'), sectionIntro: si(t, 'finanzen', 'credit') },
        { k: 'loans', label: fl(t, 'finanzen', 'loans'), type: 'currency' },
        { k: 'pension3a', label: fl(t, 'finanzen', 'pension3a'), type: 'currency', section: t('sections.finanzen.provision'), sectionIntro: si(t, 'finanzen', 'provision'), secondary: true, orientation: or(t, 'saeule3a') },
        { k: 'pension3aBalance', label: fl(t, 'finanzen', 'pension3aBalance'), type: 'currency', secondary: true },
        { k: 'pension3b', label: fl(t, 'finanzen', 'pension3b'), type: 'select', options: opts(t, 'finanzen', 'pension3b'), secondary: true },
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
        { k: 'bvgInsurer', label: fl(t, 'versicherungen', 'bvgInsurer'), type: 'text', section: t('sections.versicherungen.occupational'), sectionIntro: si(t, 'versicherungen', 'occupational'), orientation: or(t, 'bvg') },
        { k: 'bvgContribution', label: fl(t, 'versicherungen', 'bvgContribution'), type: 'currency', hint: hn(t, 'versicherungen', 'bvgContribution') },
        { k: 'bvgBalance', label: fl(t, 'versicherungen', 'bvgBalance'), type: 'currency', hint: hn(t, 'versicherungen', 'bvgBalance') },
        { k: 'uvg', label: fl(t, 'versicherungen', 'uvg'), type: 'select', options: opts(t, 'versicherungen', 'uvg'), section: t('sections.versicherungen.additional'), sectionIntro: si(t, 'versicherungen', 'additional'), orientation: or(t, 'uvg') },
        { k: 'ktg', label: fl(t, 'versicherungen', 'ktg'), type: 'select', options: opts(t, 'versicherungen', 'ktg'), hint: hn(t, 'versicherungen', 'ktg') },
        { k: 'liabilityInsurance', label: fl(t, 'versicherungen', 'liabilityInsurance'), type: 'select', options: opts(t, 'versicherungen', 'liabilityInsurance') },
        { k: 'liabilityAmount', label: fl(t, 'versicherungen', 'liabilityAmount'), type: 'currency' },
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
  const first = (basisData.firstName || '').trim();
  const middle = (basisData.middleName || '').trim();
  const last = (basisData.lastName || '').trim();
  if (first || middle || last) return [first, middle, last].filter(Boolean).join(' ');
  return (basisData.fullName || '').trim();
}

// Keep CHAPTER_KEYS for data initialization (language-independent)
export const CHAPTER_KEYS = ['basis', 'wohnen', 'finanzen', 'versicherungen', 'ausbildung', 'behoerden', 'notfall'];

// Field keys per chapter (for data initialization — no translations needed)
const FIELD_KEYS = {
  basis: ['firstName', 'middleName', 'lastName', 'dateOfBirth', 'gender', 'nationality', 'canton', 'phone', 'email', 'ahv', 'maritalStatus'],
  wohnen: ['address', 'postalCode', 'city', 'moveInDate', 'rentAmount', 'utilities', 'landlord', 'landlordPhone', 'mortgageStatus', 'propertyValue', 'buildingsInsurance', 'residenceType'],
  finanzen: ['monthlyIncome', 'incomeType', 'employer', 'employmentType', 'startDate', 'familienzulagen', 'alimenteReceived', 'monthlyTax', 'groceries', 'communication', 'mobility', 'childcare', 'otherInsurance', 'debtPayments', 'alimentePaid', 'savingsGoal', 'savingsAccount', 'bankName', 'creditCard', 'loans', 'pension3a', 'pension3aBalance', 'pension3b', 'investmentFunds'],
  versicherungen: ['kkInsurer', 'kkModel', 'kkPremium', 'franchise', 'kkCardNumber', 'bvgInsurer', 'bvgContribution', 'bvgBalance', 'uvg', 'ktg', 'liabilityInsurance', 'liabilityAmount', 'householdInsurance', 'householdInsuranceAmount', 'travelInsurance', 'cyberInsurance', 'autoInsurance', 'autoInsuranceAmount', 'ahvContribution'],
  ausbildung: ['schoolName', 'educationLevel', 'efzNumber', 'certifications', 'employer', 'jobTitle', 'employmentStart', 'workPermit', 'workHoursPerWeek', 'languages'],
  behoerden: ['cantoneOfTaxation', 'taxId', 'taxFilingDeadline', 'pendingTaxReturns', 'registryOffice', 'betreibungsStatus', 'courtCases', 'legalRepresentative', 'representativePhone', 'willMade'],
  notfall: ['emergencyContact', 'emergencyPhone', 'bloodType', 'allergies', 'medications', 'chronicDiseases', 'doctor', 'doctorPhone', 'hospital', 'organDonor', 'patientenverfuegung', 'vorsorgeauftrag', 'bestattungswuensche'],
};

