import React from 'react';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, shadow, radius, space } from './config/tokens.js';
import { betrag } from './utils/geld.js';
import { sumAllExpenses, sumTotalIncome } from './utils/monatsrechnung.js';

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
        React.createElement('div', { style: { width: '10px', height: '10px', background: colors[idx], borderRadius: radius.hair, flexShrink: 0 } }),
        React.createElement('span', null, label + ' (' + Math.round((data[idx] / total) * 100) + '%)')
      ) : null)
    )
  );
};

const HorizontalBar = ({ label, value, maxValue, color, palette }) => {
  const pct = maxValue > 0 ? Math.min(100, (value / maxValue) * 100) : 0;
  return React.createElement('div', { style: { marginBottom: space.sm } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: text.xs, marginBottom: '3px' } },
      React.createElement('span', null, label),
      React.createElement('span', { style: { fontWeight: weight.semi, fontVariantNumeric: 'tabular-nums' } }, betrag(value, { hoechstens: 2 }))
    ),
    React.createElement('div', { style: { height: '8px', background: palette.border, borderRadius: radius.xs, overflow: 'hidden' } },
      React.createElement('div', { style: { height: '100%', width: pct + '%', background: color, borderRadius: radius.xs } })
    )
  );
};

export const ChartsAdvanced = ({ palette, t, data }) => {
  const rent = Number(data?.wohnen?.rentAmount || 0);
  const utilities = Number(data?.wohnen?.utilities || 0);
  const kkPremium = Number(data?.versicherungen?.kkPremium || 0);
  // BVG nur noch als Hinweis: er ist im Nettolohn schon abgezogen (Entscheid 21.10.2026,
  // Charts rechnet wie das Kapitel Finanzen — siehe utils/monatsrechnung.js).
  const bvg = Number(data?.versicherungen?.bvgContribution || 0);
  const tax = Number(data?.finanzen?.monthlyTax || 0);
  const groceries = Number(data?.finanzen?.groceries || 0);
  const communication = Number(data?.finanzen?.communication || 0);
  const mobility = Number(data?.finanzen?.mobility || 0);
  const debtPayments = Number(data?.finanzen?.debtPayments || 0);
  const alimentePaid = Number(data?.finanzen?.alimentePaid || 0);
  const otherInsurance = Number(data?.finanzen?.otherInsurance || 0);

  const income = sumTotalIncome(data?.finanzen);
  const totalExpenses = sumAllExpenses(data?.finanzen, data);
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
    // Beschriftungen aus budgetSync.field — die früheren Schlüssel budgetSync.taxes usw.
    // gab es nie; t() gab den Schlüssel zurück, und weil der nicht leer ist, griff auch
    // der Rückfall-Text nie (Legende zeigte «budgetSync.taxes», Massstab-Prüfung 21.10.2026).
    { label: t('budgetSync.field.utilities'), value: utilities, color: palette.gold },
    { label: t('budgetSync.field.healthInsurance'), value: kkPremium, color: palette.sky },
    { label: t('budgetSync.field.tax'), value: tax, color: '#8B7355' },
    { label: t('budgetSync.field.groceries'), value: groceries, color: '#7B9E8C' },
    { label: t('budgetSync.field.communication'), value: communication, color: '#6E90B0' },
    { label: t('budgetSync.field.mobility'), value: mobility, color: '#B08060' },
    { label: t('budgetSync.field.debtPayments'), value: debtPayments, color: palette.rose },
    { label: t('budgetSync.field.alimentePaid'), value: alimentePaid, color: palette.sage },
    { label: t('budgetSync.field.otherInsurance'), value: otherInsurance, color: '#A89F94' },
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
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi } }, betrag(income, { hoechstens: 2 }))
      ),
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('budgetSync.expenses') || 'Ausgaben'),
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.roseDeep } }, betrag(totalExpenses, { hoechstens: 2 }))
      ),
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('budgetSync.remaining') || 'Verfügbar'),
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: remaining > 0 ? (palette.sageDeep || palette.sage) : (palette.roseDeep || palette.rose) } }, betrag(remaining, { hoechstens: 2 }))
      )
    ),

    bvg > 0 && React.createElement('p', { style: { fontSize: text.xs, color: palette.mid, margin: '0 0 ' + space.md + 'px' } }, t('budgetSync.bvgReferenceNote')),

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

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, hinweisZeichen(), t('trust.localOnly'))
  );
};

export default ChartsAdvanced;
