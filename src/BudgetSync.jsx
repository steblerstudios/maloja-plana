import React, { useState, useEffect } from 'react';
import { syncBudgetFromChapters, calculateMonthlyBudget, getBudgetRecommendations, createBudgetReport } from './budgetSync.js';
import { Icon } from './IconSystem.jsx';

export const BudgetSync = ({ palette, t, data, onUpdate }) => {
  const [budget, setBudget] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const synced = calculateMonthlyBudget(data, t);
    setBudget(synced);
  }, [data]);

  if (!budget) return React.createElement('div', null, '○ ' + t('common.loading'));

  const handleExportReport = () => {
    const report = createBudgetReport(data, t);
    const text = JSON.stringify(report, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return React.createElement('div', { style: { background: palette.surface, padding: '20px', borderRadius: '8px', border: '1px solid ' + palette.border } },
    React.createElement('h2', { style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'budget', size: 20 }), t('budgetSync.title')),

    // Main overview
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' } },
      React.createElement('div', { style: { padding: '16px', background: palette.up, borderRadius: '6px', border: '2px solid ' + palette.sage } },
        React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginBottom: '4px' } }, '▸ ' + t('budgetSync.income')),
        React.createElement('div', { style: { fontSize: '20px', fontWeight: '600', color: palette.sage } }, 'CHF ' + budget.income.toFixed(0))
      ),
      React.createElement('div', { style: { padding: '16px', background: palette.up, borderRadius: '6px', border: '2px solid ' + palette.rose } },
        React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginBottom: '4px' } }, '◇ ' + t('budgetSync.expenses')),
        React.createElement('div', { style: { fontSize: '20px', fontWeight: '600', color: palette.rose } }, 'CHF ' + budget.totalExpenses.toFixed(0))
      ),
      React.createElement('div', { style: { padding: '16px', background: palette.up, borderRadius: '6px', border: '2px solid ' + (budget.remaining >= 0 ? palette.sage : palette.rose) } },
        React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginBottom: '4px' } }, '□ ' + t('budgetSync.remaining')),
        React.createElement('div', { style: { fontSize: '20px', fontWeight: '600', color: budget.remaining >= 0 ? palette.sage : palette.rose } }, 'CHF ' + budget.remaining.toFixed(0))
      ),
      React.createElement('div', { style: { padding: '16px', background: palette.up, borderRadius: '6px', border: '2px solid ' + palette.sky } },
        React.createElement('div', { style: { fontSize: '11px', color: palette.mid, marginBottom: '4px' } }, '◰ ' + t('budgetSync.savingsRate')),
        React.createElement('div', { style: { fontSize: '20px', fontWeight: '600', color: palette.sky } }, budget.savingsRate + '%')
      )
    ),

    // Expenses breakdown
    React.createElement('div', { style: { marginBottom: '16px', padding: '12px', background: palette.up, borderRadius: '6px' } },
      React.createElement('h3', { style: { fontSize: '13px', fontWeight: '600', marginBottom: '10px' } }, '□ ' + t('budgetSync.expensesOverview')),
      React.createElement('div', { style: { fontSize: '12px' } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid ' + palette.border } },
          React.createElement('span', null, '⌂ ' + t('budgetSync.housingCosts')),
          React.createElement('span', { style: { fontWeight: '600' } }, 'CHF ' + (budget.expenses.rent + budget.expenses.utilities).toFixed(0) + ' (' + budget.percentages.rent + '%)')
        ),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid ' + palette.border } },
          React.createElement('span', null, '◰ ' + t('budgetSync.healthInsurance')),
          React.createElement('span', { style: { fontWeight: '600' } }, 'CHF ' + budget.expenses.healthInsurance.toFixed(0) + ' (' + budget.percentages.health + '%)')
        ),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid ' + palette.border } },
          React.createElement('span', null, '◰ ' + t('budgetSync.insuranceBvg')),
          React.createElement('span', { style: { fontWeight: '600' } }, 'CHF ' + (budget.expenses.bvg + budget.expenses.ahv + (budget.expenses.uvg || 0)).toFixed(0) + ' (' + budget.percentages.insurance + '%)')
        ),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontWeight: '600', borderTop: '2px solid ' + palette.border, paddingTop: '8px' } },
          React.createElement('span', null, t('common.total')),
          React.createElement('span', null, 'CHF ' + budget.totalExpenses.toFixed(0))
        )
      )
    ),

    // Recommendations
    budget.recommendations && budget.recommendations.length > 0 && React.createElement('div', { style: { marginBottom: '16px' } },
      React.createElement('h3', { style: { fontSize: '13px', fontWeight: '600', marginBottom: '10px' } }, '○ ' + t('common.recommendations')),
      React.createElement('div', { style: { display: 'grid', gap: '8px' } },
        budget.recommendations.map((rec, idx) => React.createElement('div', { key: idx, style: { padding: '10px', background: rec.level === 'critical' ? palette.rose + '22' : rec.level === 'warning' ? palette.gold + '22' : palette.sage + '22', borderRadius: '6px', border: '1px solid ' + (rec.level === 'critical' ? palette.rose : rec.level === 'warning' ? palette.gold : palette.sage), fontSize: '12px' } },
          React.createElement('span', { style: { fontWeight: '600', marginRight: '6px' } }, rec.icon),
          rec.text
        ))
      )
    ),

    React.createElement('div', { style: { display: 'flex', gap: '8px' } },
      React.createElement('button', {
        onClick: () => setShowDetails(!showDetails),
        style: { flex: 1, padding: '10px', background: palette.sand, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }
      }, showDetails ? '▼ ' + t('common.details') : '▶ ' + t('common.details')),
      React.createElement('button', {
        onClick: handleExportReport,
        style: { flex: 1, padding: '10px', background: palette.sky, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }
      }, '◰ ' + t('nav.export'))
    ),

    showDetails && React.createElement('div', { style: { marginTop: '16px', padding: '12px', background: palette.up, borderRadius: '6px', fontSize: '11px' } },
      React.createElement('div', { style: { marginBottom: '8px' } },
        React.createElement('strong', null, t('budgetSync.annualForecast') + ':'),
        React.createElement('div', null, '◇ ' + t('budgetSync.annualIncome') + ': CHF ' + (budget.income * 12).toFixed(0)),
        React.createElement('div', null, '◇ ' + t('budgetSync.annualExpenses') + ': CHF ' + (budget.totalExpenses * 12).toFixed(0)),
        React.createElement('div', { style: { fontWeight: '600', marginTop: '6px', color: budget.remaining >= 0 ? palette.sage : palette.rose } }, '□ ' + t('budgetSync.annualSavings') + ': CHF ' + (budget.remaining * 12).toFixed(0))
      ),
      React.createElement('div', { style: { padding: '8px', background: palette.surface, borderRadius: '4px', fontSize: '10px', color: palette.mid } },
        '○ ' + t('budgetSync.autoUpdateTip')
      )
    )
  );
};

export default BudgetSync;
