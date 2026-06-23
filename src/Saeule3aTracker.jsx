import React from 'react';
import { text, weight, space, radius, fontFamily } from './config/tokens.js';

// 3a-Maximum 2026 mit Pensionskasse (BSV). Selbständige ohne PK: 20% des Einkommens, max. 36'288.
export const SAEULE3A_MAX_2026 = 7258;

const fmt = (v) => Math.round(v).toLocaleString('de-CH');

export const Saeule3aTracker = ({ palette, t, deposits, max, onChange }) => {
  const list = Array.isArray(deposits) ? deposits : [];
  const ceiling = max || SAEULE3A_MAX_2026;
  const total = list.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const pct = Math.min(100, Math.round((total / ceiling) * 100));
  const remaining = Math.max(0, ceiling - total);

  const addDeposit = () => onChange([...list, { date: '', amount: '' }]);
  const updateDeposit = (idx, patch) => onChange(list.map((d, i) => i === idx ? { ...d, ...patch } : d));
  const removeDeposit = (idx) => onChange(list.filter((_, i) => i !== idx));

  const inputStyle = {
    padding: (space.sm + 2) + 'px ' + space.sm + 'px',
    borderRadius: radius.sm, border: '1px solid ' + palette.border,
    background: palette.up, color: palette.text, boxSizing: 'border-box',
    fontSize: text.sm, fontFamily, cursor: 'text',
  };

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.sm } },

    // Progress summary
    React.createElement('div', {
      style: { padding: space.md + 'px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border }
    },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: space.sm } },
        React.createElement('span', { style: { fontSize: text.lg, fontWeight: weight.bold, color: palette.text } }, 'CHF ' + fmt(total)),
        React.createElement('span', { style: { fontSize: text.sm, color: palette.mid } }, t('saeule3a.ofMax', { max: 'CHF ' + fmt(ceiling) }))
      ),
      // calm progress bar
      React.createElement('div', { style: { height: '6px', background: palette.border, borderRadius: '3px', overflow: 'hidden' } },
        React.createElement('div', { style: { height: '100%', width: pct + '%', background: pct >= 100 ? palette.sage : palette.sky, transition: 'width 300ms ease' } })
      ),
      React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
        remaining > 0 ? t('saeule3a.remaining', { amount: 'CHF ' + fmt(remaining) }) : t('saeule3a.maxReached')
      )
    ),

    // Deposit rows
    list.length > 0 && React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.xs } },
      list.map((dep, idx) =>
        React.createElement('div', {
          key: idx,
          style: { display: 'grid', gridTemplateColumns: '1fr 120px auto', gap: space.xs, alignItems: 'center' }
        },
          React.createElement('input', {
            type: 'date', value: dep.date || '',
            onChange: (e) => updateDeposit(idx, { date: e.target.value }),
            'aria-label': t('saeule3a.date'),
            style: { ...inputStyle, cursor: 'pointer' },
          }),
          React.createElement('input', {
            type: 'number', inputMode: 'decimal', value: dep.amount || '',
            onChange: (e) => updateDeposit(idx, { amount: e.target.value }),
            placeholder: t('saeule3a.amount'),
            'aria-label': t('saeule3a.amount'),
            style: inputStyle,
          }),
          React.createElement('button', {
            onClick: () => removeDeposit(idx),
            'aria-label': t('common.delete') || 'Entfernen',
            style: { background: 'none', border: 'none', cursor: 'pointer', color: palette.mid, fontSize: text.sm, fontFamily, padding: '2px 6px' }
          }, '✕')
        )
      )
    ),

    React.createElement('button', {
      onClick: addDeposit,
      style: {
        padding: space.sm + 'px ' + space.md + 'px',
        background: 'transparent', color: palette.mid,
        border: '1px dashed ' + palette.border, borderRadius: radius.sm,
        cursor: 'pointer', fontSize: text.sm, fontFamily,
        fontWeight: weight.medium, alignSelf: 'flex-start',
      }
    }, '+ ' + t('saeule3a.add')),

    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.5 } },
      t('saeule3a.selfEmployedNote')
    )
  );
};

export default Saeule3aTracker;
