// Budget-Sync: Links data between chapters
// When rent changes in "wohnen" → automatically reflected in budget, etc.

export const syncBudgetFromChapters = (data) => {
  const budget = {
    income: Number(data.finanzen?.monthlyIncome || 0),
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

  // BVG and AHV are already deducted from net salary — keep for reference, exclude from totals
  const referenceOnly = { bvg: budget.expenses.bvg, ahv: budget.expenses.ahv };
  delete budget.expenses.bvg;
  delete budget.expenses.ahv;
  budget.reference = referenceOnly;

  // Calculate totals (without BVG/AHV)
  budget.totalExpenses = Object.values(budget.expenses).reduce((a, b) => a + Number(b || 0), 0);
  budget.remaining = budget.income - budget.totalExpenses;
  budget.savingsRate = budget.income > 0 ? ((budget.remaining / budget.income) * 100).toFixed(1) : 0;

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
      level: 'warning',
      icon: '⚠️',
      text: t ? t('budget.rentWarning') : 'Rent is over 40% of income. Consider a more affordable option.'
    });
  }

  const totalExpensesPercentage = budget.income > 0 ? (budget.totalExpenses / budget.income) * 100 : 0;
  if (totalExpensesPercentage > 90) {
    recommendations.push({
      level: 'critical',
      icon: '✦',
      text: t ? t('budget.expensesCritical') : 'Total expenses over 90%! Very little room.'
    });
  }

  if (budget.remaining < 0) {
    recommendations.push({
      level: 'critical',
      icon: '✦',
      text: t ? t('budget.deficitCritical') : 'Expenses exceed income! Please review your budget.'
    });
  }

  if (budget.remaining > budget.income * 0.2) {
    recommendations.push({
      level: 'good',
      icon: '✓',
      text: t ? t('budget.goodSituation') : 'Good financial situation. Consider saving the surplus.'
    });
  }

  return recommendations;
};

export const createBudgetReport = (data, t) => {
  const budget = calculateMonthlyBudget(data, t);

  return {
    period: new Date().toLocaleDateString('de-CH'),
    person: data.basis?.fullName || (t ? t('cv.name') : 'Name'),
    budget,
    details: {
      income: {
        monthly: budget.income,
        annual: budget.income * 12
      },
      expenses: {
        housing: budget.expenses.rent + budget.expenses.utilities + (budget.expenses.mortgage || 0),
        insurance: budget.expenses.healthInsurance + budget.reference.bvg + budget.reference.ahv + (budget.expenses.uvg || 0),
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
