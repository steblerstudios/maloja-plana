import React, { useState } from 'react';
import { text, space, radius } from './config/tokens.js';
import { knopfStil } from './components/PrimaryButton.jsx';
import { anzeigeWert, hatWert } from './utils/vollstaendigkeit.js';
import { Icon } from './IconSystem.jsx';
import { betrag } from './utils/geld.js';
import { useRueckgaengig, wiederEinsetzen, nochEntfernt } from './hooks/useRueckgaengig.js';
import { RueckgaengigMeldung } from './components/RueckgaengigMeldung.jsx';

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
    onChange(next.filter(r => r.label || hatWert(r.amount)));
  };
  const update = (i, patch) => commit(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setRows([...rows, { label: '', amount: '' }]);
  // Sofort weg, «Entfernt · Rückgängig» legt den Posten zurück (10.11.2026); leere Zeilen ohne Meldung.
  const { entfernt, merke, rueckgaengig: zurueck } = useRueckgaengig();
  const remove = (i) => {
    const r = rows[i];
    if (r && (r.label || hatWert(r.amount))) {
      merke({ item: r, index: i, text: [r.label, hatWert(r.amount) ? betrag(Number(r.amount) || 0) : ''].filter(Boolean).join(', ') });
    }
    const next = rows.filter((_, idx) => idx !== i);
    commit(next.length ? next : [{ label: '', amount: '' }]);
  };
  // Die eine leere Eingabezeile, die nach dem letzten Posten steht, ersetzt der zurückgeholte.
  const postenZurueck = () => zurueck(({ item, index }) => {
    const basis = rows.length === 1 && !rows[0].label && !hatWert(rows[0].amount) ? [] : rows;
    commit(wiederEinsetzen(basis, item, index));
  });

  const sum = rows.reduce((a, r) => a + (Number(r.amount) || 0), 0);

  const inputBase = {
    padding: '8px 12px', borderRadius: radius.md, border: '1px solid ' + palette.feldrand,
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
        type: 'number', inputMode: 'decimal', min: 0, value: anzeigeWert(r.amount), // K82: 0 bleibt «0»
        placeholder: 'CHF', 'aria-label': t('itemized.amountLabel'),
        onChange: (e) => update(i, { amount: e.target.value }),
        style: { ...inputBase, width: '92px', flex: '0 0 auto' },
      }),
      React.createElement('button', {
        type: 'button', onClick: () => remove(i), 'aria-label': t('itemized.remove'),
        // 44 × 44 Tippfläche (M4) — vorher nur Polster um ein 12er-Kreuz.
        style: { background: 'none', border: 'none', cursor: 'pointer', color: palette.mid, fontSize: text.body, padding: '4px 8px', flex: '0 0 auto', minWidth: '44px', minHeight: '44px' },
      }, React.createElement(Icon, { name: 'kreuz', size: 12 }))
    )),
    React.createElement(RueckgaengigMeldung, { palette, t, entfernt: nochEntfernt(entfernt, rows), onRueckgaengig: postenZurueck }),
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: space.xs + 'px' },
    },
      React.createElement('button', {
        type: 'button', onClick: add,
        style: knopfStil(palette, 'neben'),
      }, '+ ' + t('itemized.add')),
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid },
      }, t('itemized.sum') + ': ' + betrag(sum))
    )
  );
};

export default ItemizedAmount;
