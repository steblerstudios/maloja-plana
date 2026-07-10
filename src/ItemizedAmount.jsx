import React, { useState } from 'react';
import { text, weight, space, radius } from './config/tokens.js';

// Wiederverwendbare Mehrfach-Betrags-Liste: mehrere benannte Posten {label, amount},
// die sich zu einer Summe addieren (z.B. Internet + Telefon + Streaming, oder
// Lebensmittel + Putzmittel). Speichert nichts selbst — meldet die Liste per onChange;
// die Summe fliesst beim Aufrufer ins bestehende Budget-Feld (nicht-brechend).
export const ItemizedAmount = ({ palette, t, items, onChange, placeholder }) => {
  const [rows, setRows] = useState(() =>
    (Array.isArray(items) && items.length ? items : [{ label: '', amount: '' }]));

  const commit = (next) => {
    setRows(next);
    // Nach aussen nur die ausgefüllten Posten (leere Zeilen sind nur Eingabehilfe).
    onChange(next.filter(r => r.label || r.amount));
  };
  const update = (i, patch) => commit(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setRows([...rows, { label: '', amount: '' }]);
  const remove = (i) => {
    const next = rows.filter((_, idx) => idx !== i);
    commit(next.length ? next : [{ label: '', amount: '' }]);
  };

  const sum = rows.reduce((a, r) => a + (Number(r.amount) || 0), 0);

  const inputBase = {
    padding: '8px 10px', borderRadius: radius.sm, border: '1px solid ' + palette.border,
    background: palette.up, color: palette.text, fontFamily: 'inherit', fontSize: text.body,
    boxSizing: 'border-box',
  };

  return React.createElement('div', null,
    rows.map((r, i) => React.createElement('div', {
      key: i,
      style: { display: 'flex', gap: space.sm + 'px', marginBottom: space.sm + 'px', alignItems: 'center' },
    },
      React.createElement('input', {
        type: 'text', value: r.label || '',
        placeholder: placeholder || t('itemized.namePlaceholder'),
        'aria-label': t('itemized.namePlaceholder'),
        onChange: (e) => update(i, { label: e.target.value }),
        style: { ...inputBase, flex: '1 1 auto', minWidth: '0' },
      }),
      React.createElement('input', {
        type: 'number', inputMode: 'decimal', min: 0, value: r.amount || '',
        placeholder: 'CHF', 'aria-label': t('itemized.amountLabel'),
        onChange: (e) => update(i, { amount: e.target.value }),
        style: { ...inputBase, width: '92px', flex: '0 0 auto' },
      }),
      React.createElement('button', {
        type: 'button', onClick: () => remove(i), 'aria-label': t('itemized.remove'),
        style: { background: 'none', border: 'none', cursor: 'pointer', color: palette.mid, fontSize: text.body, padding: '4px 8px', flex: '0 0 auto' },
      }, '✕')
    )),
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: space.xs + 'px' },
    },
      React.createElement('button', {
        type: 'button', onClick: add,
        style: { background: 'none', border: 'none', cursor: 'pointer', color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.semi, fontSize: text.sm, padding: '2px 0' },
      }, '+ ' + t('itemized.add')),
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid },
      }, t('itemized.sum') + ': CHF ' + sum.toFixed(0))
    )
  );
};

export default ItemizedAmount;
