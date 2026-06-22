// KVG §67 Premium subsidy Switzerland
// Calculates tax savings and subsidy eligibility
import { getFullName } from './config/constants.js';
import { getHouseholdInfo } from './config/cantonalData.js';

export const KVG_BRACKETS_2024 = [
  { income: 27500, single: 3000, couple: 4500, child: 1500 },
  { income: 33500, single: 2500, couple: 4000, child: 1200 },
  { income: 40000, single: 2000, couple: 3500, child: 1000 },
  { income: 50000, single: 1500, couple: 3000, child: 750 },
  { income: 65000, single: 1000, couple: 2500, child: 500 },
  { income: 80000, single: 500, couple: 2000, child: 250 }
];

export const calculatePremiumSubsidy = (annualIncome, deductions, childrenCount = 0, t, adults = 1) => {
  const taxableIncome = Math.max(0, annualIncome - deductions);

  let bracket = KVG_BRACKETS_2024[KVG_BRACKETS_2024.length - 1];
  for (const b of KVG_BRACKETS_2024) {
    if (taxableIncome <= b.income) {
      bracket = b;
      break;
    }
  }

  const isCouple = adults >= 2;
  const baseSubsidy = isCouple ? bracket.couple : bracket.single;
  const subsidy = baseSubsidy + (childrenCount * bracket.child);

  const subsidyType = isCouple
    ? (t ? t('premiumCalc.coupleChildren') : 'Couple + children')
    : childrenCount > 0
      ? (t ? t('premiumCalc.singleChildren') : 'Single + children')
      : (t ? t('premiumCalc.single') : 'Single');

  return {
    taxableIncome,
    eligibleSubsidy: subsidy,
    subsidyType,
    estimatedSavings: subsidy * 12
  };
};

// Household-aware wrapper: extracts values from data object

export const estimateTaxSavings = (subsidyAmount) => {
  // Average Swiss tax rate: approx. 12-25%
  // Conservative: 15%
  const taxRate = 0.15;
  return Math.round(subsidyAmount * taxRate * 12);
};


export const getKVGApplicationLink = (canton) => {
  const links = {
    'ZH': 'https://www.zh.ch/de/soziales/versicherungen-und-beitraege/krankenversicherung/praemienverbilligung.html',
    'BE': 'https://www.be.ch/de/start/themen/gesundheit-und-krankenkasse/praemienverbilligung.html',
    'GE': 'https://www.ge.ch/dossier/sante-et-assurance-maladie',
    'VD': 'https://www.vd.ch/themes/sante/assurance-maladie/',
    'default': 'https://www.kvg.info'
  };

  return links[canton] || links.default;
};

