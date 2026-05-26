// KVG §67 Premium subsidy Switzerland
// Calculates tax savings and subsidy eligibility
import { getFullName } from './config/constants.js';

export const KVG_BRACKETS_2024 = [
  { income: 27500, single: 3000, couple: 4500, child: 1500 },
  { income: 33500, single: 2500, couple: 4000, child: 1200 },
  { income: 40000, single: 2000, couple: 3500, child: 1000 },
  { income: 50000, single: 1500, couple: 3000, child: 750 },
  { income: 65000, single: 1000, couple: 2500, child: 500 },
  { income: 80000, single: 500, couple: 2000, child: 250 }
];

export const calculatePremiumSubsidy = (grossIncome, deductions, dependents = 0, t) => {
  const taxableIncome = Math.max(0, grossIncome - deductions);

  // Find matching bracket
  let bracket = KVG_BRACKETS_2024[KVG_BRACKETS_2024.length - 1];
  for (const b of KVG_BRACKETS_2024) {
    if (taxableIncome <= b.income) {
      bracket = b;
      break;
    }
  }

  let subsidy = bracket.single;

  // Married/Partnership
  if (dependents > 0) {
    subsidy = bracket.couple + (dependents * bracket.child);
  }

  return {
    taxableIncome,
    eligibleSubsidy: subsidy,
    subsidyType: dependents > 0
      ? (t ? t('premiumCalc.coupleChildren') : 'Couple + children')
      : (t ? t('premiumCalc.single') : 'Single'),
    estimatedSavings: subsidy * 12
  };
};

export const estimateTaxSavings = (subsidyAmount) => {
  // Average Swiss tax rate: approx. 12-25%
  // Conservative: 15%
  const taxRate = 0.15;
  return Math.round(subsidyAmount * taxRate * 12);
};

export const checkEligibility = (income, deductions, t) => {
  const taxableIncome = Math.max(0, income - deductions);
  const maxThreshold = 80000;

  return {
    eligible: taxableIncome <= maxThreshold,
    reason: taxableIncome > maxThreshold
      ? (t ? t('premiumCalc.incomeToHigh', { value: maxThreshold }) : 'Income too high (over CHF ' + maxThreshold + ')')
      : (t ? t('premiumCalc.eligible') : 'Eligible for premium subsidy'),
    requiredDocuments: t ? [
      t('premiumCalc.doc1'),
      t('premiumCalc.doc2'),
      t('premiumCalc.doc3'),
      t('premiumCalc.doc4'),
    ] : [
      'Tax return (last 2 years)',
      'Pay slips',
      'Family certificate',
      'Health insurance premium confirmation'
    ]
  };
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

export const generateKVGDocument = (data, subsidyData, t) => {
  return {
    title: t ? t('premiumCalc.docTitle') : 'KVG §67 Application data',
    date: new Date().toLocaleDateString('de-CH'),
    applicant: {
      name: getFullName(data.basis),
      ahv: data.basis?.ahv,
      address: data.wohnen?.address,
      canton: data.basis?.canton
    },
    income: {
      gross: data.finanzen?.monthlyIncome,
      deductions: data.taxData?.totalDeductions || 0,
      taxable: subsidyData.taxableIncome
    },
    subsidy: {
      monthlyEligible: subsidyData.eligibleSubsidy,
      annualEligible: subsidyData.eligibleSubsidy * 12,
      estimatedTaxSavings: estimateTaxSavings(subsidyData.eligibleSubsidy)
    },
    checklistItems: t ? [
      t('premiumCalc.check1'),
      t('premiumCalc.check2'),
      t('premiumCalc.check3'),
      t('premiumCalc.check4'),
      t('premiumCalc.check5'),
      t('premiumCalc.check6'),
    ] : [
      '☐ Attach previous year tax return',
      '☐ Current premium invoice from insurer',
      '☐ Pay slip / income confirmation',
      '☐ Rental contract (if applicable)',
      '☐ Family certificate (if applicable)',
      '☐ Maintenance payment confirmation (if applicable)'
    ]
  };
};
