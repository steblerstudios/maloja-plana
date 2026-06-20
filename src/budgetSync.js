// Budget-Sync: Links data between chapters
// When rent changes in "wohnen" → automatically reflected in budget, etc.
import { getFullName } from './config/constants.js';
import { calculateIPV } from './config/cantonalData.js';
import { grundbedarfFuerHaushalt } from './data/sozialhilfeRechner.js';

// Budget Light V1 — Grouped expense structure
// See docs/product/budget-light-v1.md for product definition
export const BUDGET_GROUPS = [
  { key: 'housing', fields: ['rent', 'utilities', 'mortgage', 'buildingsInsurance'] },
  { key: 'insuranceHealth', fields: ['healthInsurance', 'otherInsurance'] },
  { key: 'living', fields: ['groceries', 'communication', 'childcare'] },
  { key: 'mobility', fields: ['mobility'] },
  { key: 'taxProvision', fields: ['tax', 'pension3a'] },
  { key: 'obligations', fields: ['debtPayments', 'alimentePaid'] },
];

export const syncBudgetFromChapters = (data) => {
  const netIncome = Number(data.finanzen?.monthlyIncome || 0);
  const familienzulagen = Number(data.finanzen?.familienzulagen || 0);
  const alimenteReceived = Number(data.finanzen?.alimenteReceived || 0);
  const totalIncome = netIncome + familienzulagen + alimenteReceived;

  // IPV relief (reduces health insurance cost, not an income)
  const ipv = calculateIPV(data);
  const ipvRelief = ipv.eligible ? ipv.amount : 0;

  const budget = {
    income: totalIncome,
    incomeDetail: {
      net: netIncome,
      familienzulagen,
      alimenteReceived,
    },
    ipvRelief,
    expenses: {}
  };

  // From "wohnen" chapter
  budget.expenses.rent = Number(data.wohnen?.rentAmount || 0);
  budget.expenses.utilities = Number(data.wohnen?.utilities || 0);
  budget.expenses.mortgage = Number(data.wohnen?.mortgagePayment || 0);
  budget.expenses.buildingsInsurance = Number(data.wohnen?.buildingsInsurance || 0) / 12;

  // From "versicherungen" chapter
  budget.expenses.healthInsurance = Number(data.versicherungen?.kkPremium || 0);
  budget.expenses.bvg = Number(data.versicherungen?.bvgContribution || 0);
  budget.expenses.ahv = Number(data.versicherungen?.ahvContribution || 0) / 12;
  budget.expenses.uvg = Number(data.versicherungen?.uvgPremium || 0) || 0;

  // Budget Light V1 — new fields from "finanzen" chapter
  budget.expenses.otherInsurance = Number(data.finanzen?.otherInsurance || 0);
  budget.expenses.groceries = Number(data.finanzen?.groceries || 0);
  budget.expenses.communication = Number(data.finanzen?.communication || 0);
  budget.expenses.childcare = Number(data.finanzen?.childcare || 0);
  budget.expenses.mobility = Number(data.finanzen?.mobility || 0);
  budget.expenses.tax = Number(data.finanzen?.monthlyTax || 0);
  budget.expenses.pension3a = Number(data.finanzen?.pension3a || 0) / 12;
  budget.expenses.debtPayments = Number(data.finanzen?.debtPayments || 0);
  budget.expenses.alimentePaid = Number(data.finanzen?.alimentePaid || 0);

  // BVG and AHV are already deducted from net salary — keep for reference, exclude from totals
  const referenceOnly = { bvg: budget.expenses.bvg, ahv: budget.expenses.ahv };
  delete budget.expenses.bvg;
  delete budget.expenses.ahv;
  budget.reference = referenceOnly;

  // Calculate totals (without BVG/AHV)
  budget.totalExpenses = Object.values(budget.expenses).reduce((a, b) => a + Number(b || 0), 0);
  budget.remaining = budget.income - budget.totalExpenses;
  budget.savingsRate = budget.income > 0 ? ((budget.remaining / budget.income) * 100).toFixed(1) : 0;

  // Household context for SKOS orientation
  const household = data.basis?.household;
  const adults = household?.adults || 1;
  const children = Array.isArray(household?.children) ? household.children.length : 0;
  const householdSize = adults + children;
  budget.householdContext = {
    size: householdSize,
    adults,
    children,
    isRetired: !!household?.isRetired,
    skosGrundbedarf: grundbedarfFuerHaushalt(householdSize),
  };

  return budget;
};

export const calculateMonthlyBudget = (data, t) => {
  const budget = syncBudgetFromChapters(data);

  return {
    ...budget,
    percentages: {
      rent: budget.income > 0 ? ((budget.expenses.rent / budget.income) * 100).toFixed(1) : 0,
      utilities: budget.income > 0 ? ((budget.expenses.utilities / budget.income) * 100).toFixed(1) : 0,
      health: budget.income > 0 ? ((budget.expenses.healthInsurance / budget.income) * 100).toFixed(1) : 0,
      insurance: budget.income > 0 ? (((budget.reference.bvg + budget.reference.ahv + (budget.expenses.uvg || 0)) / budget.income) * 100).toFixed(1) : 0,
      savings: budget.income > 0 ? ((budget.remaining / budget.income) * 100).toFixed(1) : 0
    },
    recommendations: getBudgetRecommendations(budget, t)
  };
};

export const getBudgetRecommendations = (budget, t) => {
  const recommendations = [];

  const rentPercentage = budget.income > 0 ? (budget.expenses.rent / budget.income) * 100 : 0;
  if (rentPercentage > 40) {
    recommendations.push({
      level: 'info',
      icon: '○',
      text: t ? t('budget.rentInfo') : 'Your housing costs make up a large part of your budget. This is not uncommon in many Swiss cities.'
    });
  }

  const totalExpensesPercentage = budget.income > 0 ? (budget.totalExpenses / budget.income) * 100 : 0;
  if (totalExpensesPercentage > 90) {
    recommendations.push({
      level: 'info',
      icon: '○',
      text: t ? t('budget.budgetTight') : 'Your budget is tight. Free budget counselling is available — for example through Caritas or your local municipality.'
    });
  }

  if (budget.remaining < 0) {
    recommendations.push({
      level: 'info',
      icon: '○',
      text: t ? t('budget.deficitInfo') : 'Expenses currently exceed income. This can be temporary — your canton\'s debt counselling service can help.'
    });
  }

  if (budget.income > 0 && budget.remaining >= 0 && totalExpensesPercentage <= 90) {
    recommendations.push({
      level: 'calm',
      icon: '○',
      text: t ? t('budget.budgetCalm') : 'You have an overview of your finances. Every step counts.'
    });
  }

  // IPV hint — if eligible but not yet applied
  if (budget.ipvRelief > 0) {
    recommendations.push({
      level: 'info',
      icon: '○',
      text: t ? t('budget.ipvHint', { amount: budget.ipvRelief }) : 'You may be eligible for premium reduction (IPV).'
    });
  }

  // SKOS/Sozialhilfe hint — if income is below Grundbedarf
  const hc = budget.householdContext;
  if (hc && budget.income > 0 && budget.income < hc.skosGrundbedarf) {
    recommendations.push({
      level: 'info',
      icon: '○',
      text: t ? t('budget.sozialhilfeHint') : 'Your income is below the SKOS basic needs threshold. Social assistance may be an option.'
    });
  }

  // EL hint — for retired persons with modest income
  if (budget.income > 0 && budget.income < 3000 && hc && hc.size >= 1) {
    const isRetired = budget.householdContext.isRetired;
    if (isRetired) {
      recommendations.push({
        level: 'info',
        icon: '○',
        text: t ? t('budget.elHint') : 'With a modest income in retirement, supplementary benefits (EL) may be available.'
      });
    }
  }

  return recommendations;
};

export const createBudgetReport = (data, t) => {
  const budget = calculateMonthlyBudget(data, t);

  return {
    period: new Date().toLocaleDateString('de-CH'),
    person: getFullName(data.basis) || (t ? t('cv.name') : 'Name'),
    budget,
    details: {
      income: {
        monthly: budget.income,
        annual: budget.income * 12,
        detail: budget.incomeDetail,
        ipvRelief: budget.ipvRelief,
      },
      expenses: {
        housing: budget.expenses.rent + budget.expenses.utilities + (budget.expenses.mortgage || 0) + (budget.expenses.buildingsInsurance || 0),
        insuranceHealth: budget.expenses.healthInsurance + (budget.expenses.otherInsurance || 0),
        living: (budget.expenses.groceries || 0) + (budget.expenses.communication || 0) + (budget.expenses.childcare || 0),
        mobility: budget.expenses.mobility || 0,
        taxProvision: (budget.expenses.tax || 0) + (budget.expenses.pension3a || 0),
        reference: budget.reference.bvg + budget.reference.ahv + (budget.expenses.uvg || 0),
        total: budget.totalExpenses
      },
      savings: {
        monthly: budget.remaining,
        annual: budget.remaining * 12,
        rate: budget.savingsRate + '%'
      }
    }
  };
};
