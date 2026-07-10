import React from 'react';
import { Icon } from './IconSystem.jsx';
import { text, weight, shadow, radius, space } from './config/tokens.js';

const PieChart = ({ data, labels, colors, title, palette }) => {
  const total = data.reduce((a, b) => a + b, 0);
  if (total === 0) return React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.md } },
    React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '12px' } }, title),
    React.createElement('div', { style: { textAlign: 'center', color: palette.mid, fontSize: text.sm, padding: '20px' } }, '—')
  );

  let currentAngle = 0;
  const segments = [];

  data.forEach((val, idx) => {
    if (val <= 0) return;
    const angle = (val / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const x1 = 100 + 80 * Math.cos(startRad);
    const y1 = 100 + 80 * Math.sin(startRad);
    const x2 = 100 + 80 * Math.cos(endRad);
    const y2 = 100 + 80 * Math.sin(endRad);
    const largeArc = angle > 180 ? 1 : 0;

    segments.push(
      React.createElement('path', {
        key: idx,
        d: `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`,
        fill: colors[idx],
        stroke: palette.surface,
        strokeWidth: '2'
      })
    );
  });

  return React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.md } },
    React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '12px' } }, title),
    React.createElement('svg', { width: '200', height: '200', viewBox: '0 0 200 200', 'aria-hidden': 'true', style: { margin: '0 auto', display: 'block' } }, segments),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: space.sm, marginTop: '12px', fontSize: text.xs } },
      labels.map((label, idx) => data[idx] > 0 ? React.createElement('div', { key: idx, style: { display: 'flex', gap: '6px', alignItems: 'center' } },
        React.createElement('div', { style: { width: '10px', height: '10px', background: colors[idx], borderRadius: '2px', flexShrink: 0 } }),
        React.createElement('span', null, label + ' (' + Math.round((data[idx] / total) * 100) + '%)')
      ) : null)
    )
  );
};

const HorizontalBar = ({ label, value, maxValue, color, palette, t }) => {
  const pct = maxValue > 0 ? Math.min(100, (value / maxValue) * 100) : 0;
  return React.createElement('div', { style: { marginBottom: space.sm } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: text.xs, marginBottom: '3px' } },
      React.createElement('span', null, label),
      React.createElement('span', { style: { fontWeight: weight.semi, fontVariantNumeric: 'tabular-nums' } }, 'CHF ' + value.toLocaleString('de-CH'))
    ),
    React.createElement('div', { style: { height: '8px', background: palette.border, borderRadius: '4px', overflow: 'hidden' } },
      React.createElement('div', { style: { height: '100%', width: pct + '%', background: color, borderRadius: '4px' } })
    )
  );
};

export const ChartsAdvanced = ({ palette, t, data }) => {
  const rent = Number(data?.wohnen?.rentAmount || 0);
  const utilities = Number(data?.wohnen?.utilities || 0);
  const kkPremium = Number(data?.versicherungen?.kkPremium || 0);
  const bvg = Number(data?.versicherungen?.bvgContribution || 0);
  const income = Number(data?.finanzen?.monthlyIncome || 0);
  const tax = Number(data?.finanzen?.monthlyTax || 0);
  const groceries = Number(data?.finanzen?.groceries || 0);
  const communication = Number(data?.finanzen?.communication || 0);
  const mobility = Number(data?.finanzen?.mobility || 0);
  const debtPayments = Number(data?.finanzen?.debtPayments || 0);
  const otherInsurance = Number(data?.finanzen?.otherInsurance || 0);
  const liability = Number(data?.versicherungen?.liabilityAmount || 0);
  const household = Number(data?.versicherungen?.householdInsuranceAmount || 0);
  const autoIns = Number(data?.versicherungen?.autoInsuranceAmount || 0);

  const totalExpenses = rent + utilities + kkPremium + bvg + tax + groceries + communication + mobility + debtPayments + otherInsurance + liability + household + autoIns;
  const remaining = Math.max(0, income - totalExpenses);

  const hasData = income > 0 || totalExpenses > 0;

  if (!hasData) {
    return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border, boxShadow: shadow.sm } },
      React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'chartsSchoko', size: 20 }), t('charts.title')),
      React.createElement('div', { style: { padding: '40px 20px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, textAlign: 'center' } },
        React.createElement('div', { style: { marginBottom: '12px' } }, React.createElement(Icon, { name: 'finanzen', size: 28 })),
        React.createElement('p', { style: { fontSize: text.body, color: palette.text, margin: '0 0 6px 0' } }, t('charts.noData')),
        React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: 0 } }, t('charts.noDataHint'))
      )
    );
  }

  const expenseItems = [
    { label: t('budgetSync.housingCosts'), value: rent, color: palette.rose },
    { label: 'NK', value: utilities, color: palette.gold },
    { label: 'KK', value: kkPremium, color: palette.sky },
    { label: 'BVG', value: bvg, color: palette.sage },
    { label: t('budgetSync.taxes') || 'Steuern', value: tax, color: '#8B7355' },
    { label: t('budgetSync.groceries') || 'Lebensmittel', value: groceries, color: '#7B9E8C' },
    { label: t('budgetSync.communication') || 'Kommunikation', value: communication, color: '#6E90B0' },
    { label: t('budgetSync.mobility') || 'Mobilität', value: mobility, color: '#B08060' },
    { label: t('budgetSync.debtPayments') || 'Schuldenraten', value: debtPayments, color: palette.rose },
    { label: t('budgetSync.otherInsurance') || 'Weitere Vers.', value: otherInsurance + liability + household + autoIns, color: '#A89F94' },
  ].filter(item => item.value > 0);

  const maxExpense = Math.max(...expenseItems.map(i => i.value));

  const pieData = expenseItems.map(i => i.value);
  pieData.push(remaining);
  const pieLabels = expenseItems.map(i => i.label);
  pieLabels.push(t('budgetSync.remaining') || 'Verfügbar');
  const pieColors = expenseItems.map(i => i.color);
  pieColors.push('#C9D4C5');

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border, boxShadow: shadow.sm } },
    React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'chartsSchoko', size: 20 }), t('charts.title')),

    income > 0 && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.md, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: space.sm } },
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('budgetSync.income') || 'Einkommen'),
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi } }, 'CHF ' + income.toLocaleString('de-CH'))
      ),
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('budgetSync.expenses') || 'Ausgaben'),
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.rose } }, 'CHF ' + totalExpenses.toLocaleString('de-CH'))
      ),
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('budgetSync.remaining') || 'Verfügbar'),
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: remaining > 0 ? palette.sage : palette.rose } }, 'CHF ' + remaining.toLocaleString('de-CH'))
      )
    ),

    React.createElement(PieChart, {
      palette,
      data: pieData,
      labels: pieLabels,
      colors: pieColors,
      title: t('budgetSync.expensesOverview')
    }),

    expenseItems.length > 0 && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.md } },
      React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: space.sm } }, t('budgetSync.expenses') || 'Ausgaben'),
      expenseItems.map((item, idx) => React.createElement(HorizontalBar, { key: idx, label: item.label, value: item.value, maxValue: maxExpense, color: item.color, palette, t }))
    ),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, 'ⓘ ' + t('trust.localOnly'))
  );
};

export default ChartsAdvanced;
