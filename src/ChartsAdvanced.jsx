import React from 'react';
import { Icon } from './IconSystem.jsx';
import { text, weight, shadow, radius } from './config/tokens.js';

const PieChart = ({ data, labels, colors, title, palette }) => {
  const total = data.reduce((a, b) => a + b, 0);
  if (total === 0) return React.createElement('div', { style: { padding: '16px', background: palette.up, borderRadius: radius.sm, marginBottom: '16px' } },
    React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '12px' } }, title),
    React.createElement('div', { style: { textAlign: 'center', color: palette.mid, fontSize: text.sm, padding: '20px' } }, '—')
  );

  let currentAngle = 0;
  const segments = [];

  data.forEach((val, idx) => {
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

  return React.createElement('div', { style: { padding: '16px', background: palette.up, borderRadius: radius.sm, marginBottom: '16px' } },
    React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '12px' } }, title),
    React.createElement('svg', { width: '200', height: '200', viewBox: '0 0 200 200', style: { margin: '0 auto', display: 'block' } }, segments),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px', marginTop: '12px', fontSize: text.xs } },
      labels.map((label, idx) => React.createElement('div', { key: idx, style: { display: 'flex', gap: '6px', alignItems: 'center' } },
        React.createElement('div', { style: { width: '10px', height: '10px', background: colors[idx], borderRadius: '2px', flexShrink: 0 } }),
        React.createElement('span', null, label + ' (' + Math.round((data[idx] / total) * 100) + '%)')
      ))
    )
  );
};

const BarChart = ({ data, labels, colors, title, palette }) => {
  const maxValue = Math.max(...data);
  if (maxValue === 0) return React.createElement('div', { style: { padding: '16px', background: palette.up, borderRadius: radius.sm, marginBottom: '16px' } },
    React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '12px' } }, title),
    React.createElement('div', { style: { textAlign: 'center', color: palette.mid, fontSize: text.sm, padding: '20px' } }, '—')
  );

  const barWidth = Math.min(50, 300 / data.length);

  return React.createElement('div', { style: { padding: '16px', background: palette.up, borderRadius: radius.sm, marginBottom: '16px' } },
    React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '12px' } }, title),
    React.createElement('svg', { width: '100%', height: '250', viewBox: '0 0 400 250', preserveAspectRatio: 'xMidYMid meet' },
      data.map((val, idx) => {
        const barHeight = (val / maxValue) * 180;
        const x = 30 + idx * (350 / data.length);
        const y = 190 - barHeight;

        return React.createElement('g', { key: idx },
          React.createElement('rect', { x: x, y: y, width: barWidth, height: barHeight, fill: colors[idx % colors.length] }),
          React.createElement('text', { x: x + barWidth / 2, y: 220, textAnchor: 'middle', fontSize: '12', fill: palette.text }, labels[idx]),
          React.createElement('text', { x: x + barWidth / 2, y: y - 5, textAnchor: 'middle', fontSize: '10', fill: palette.text }, val.toFixed(0))
        );
      })
    )
  );
};

export const ChartsAdvanced = ({ palette, t, data }) => {
  const rent = Number(data?.wohnen?.rentAmount || 0) + Number(data?.wohnen?.utilities || 0);
  const insurance = Number(data?.versicherungen?.kkPremium || 0) + Number(data?.versicherungen?.bvgContribution || 0);
  const income = Number(data?.finanzen?.monthlyIncome || 0);
  const remaining = Math.max(0, income - rent - insurance);

  const hasData = income > 0 || rent > 0 || insurance > 0;

  if (!hasData) {
    return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border, boxShadow: shadow.sm } },
      React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'dashboard', size: 20 }), t('charts.title')),
      React.createElement('div', { style: { padding: '40px 20px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, textAlign: 'center' } },
        React.createElement('div', { style: { marginBottom: '12px' } }, React.createElement(Icon, { name: 'finanzen', size: 28 })),
        React.createElement('p', { style: { fontSize: text.body, color: palette.text, margin: '0 0 6px 0' } }, t('charts.noData')),
        React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: 0 } }, t('charts.noDataHint'))
      )
    );
  }

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border, boxShadow: shadow.sm } },
    React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' } }, React.createElement(Icon, { name: 'dashboard', size: 20 }), t('charts.title')),

    React.createElement(PieChart, {
      palette,
      data: [rent, insurance, remaining],
      labels: [t('budgetSync.housingCosts'), t('budgetSync.healthInsurance'), t('budgetSync.remaining')],
      colors: [palette.rose, palette.gold, palette.sage],
      title: t('budgetSync.expensesOverview')
    }),

    React.createElement(BarChart, {
      palette,
      data: [
        Number(data?.wohnen?.rentAmount || 0),
        Number(data?.wohnen?.utilities || 0),
        Number(data?.versicherungen?.kkPremium || 0),
        Number(data?.versicherungen?.bvgContribution || 0)
      ],
      labels: [
        t('budgetSync.housingCosts').split(' ')[0],
        'NK',
        'KK',
        'BVG'
      ],
      colors: [palette.rose, palette.gold, palette.sky, palette.sage],
      title: t('budgetSync.expenses') + ' (CHF' + t('common.perMonth') + ')'
    }),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, '○ ' + t('trust.localOnly'))
  );
};

export default ChartsAdvanced;
