import React, { useState, useRef, useMemo, useEffect } from 'react';
import { searchPLZ } from './data/plzGemeinde.js';
import { text, space, radius, weight } from './config/tokens.js';

// Lokales, offline PLZ→Gemeinde-Autocomplete für das Wohnen-Postleitzahl-Feld.
// Tippt man PLZ-Ziffern, erscheinen passende „PLZ — Gemeinde (Kanton)"-Vorschläge
// aus der gebündelten Schweizer PLZ-Datenbank (kein externer Call). Auswahl füllt
// PLZ + Stadt; der Kanton wird vom bestehenden PLZ→Kanton-Sync in main.jsx gesetzt.
//
// Barrierearm: ARIA-Combobox-Muster (role=combobox/listbox/option), Pfeiltasten,
// Enter zum Wählen, Escape zum Schliessen.
export const PLZAutocomplete = ({ value, onChange, onPick, palette, inputStyle, fieldId, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const blurTimer = useRef(null);

  const suggestions = useMemo(() => {
    const q = String(value || '').trim();
    // Nur ab 2 Ziffern vorschlagen; nicht, wenn eine 4-stellige PLZ exakt eine
    // Gemeinde hat (dann ist die Sache klar, Liste wäre Lärm).
    if (q.length < 2) return [];
    const res = searchPLZ(q, 8);
    if (q.length === 4 && res.length === 1) return [];
    return res;
  }, [value]);

  useEffect(() => { setActiveIndex(-1); }, [value]);

  const showList = open && suggestions.length > 0;

  const pick = (s) => {
    onPick(s);
    setOpen(false);
    setActiveIndex(-1);
  };

  const onKeyDown = (e) => {
    if (!showList) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      pick(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  const listId = fieldId + '-plz-list';

  return React.createElement('div', { style: { position: 'relative' } },
    React.createElement('input', {
      id: fieldId,
      type: 'text',
      inputMode: 'numeric',
      autoComplete: 'off',
      // ARIA-Combobox
      role: 'combobox',
      'aria-expanded': showList,
      'aria-controls': listId,
      'aria-autocomplete': 'list',
      'aria-activedescendant': activeIndex >= 0 ? listId + '-' + activeIndex : undefined,
      value: value,
      placeholder: placeholder || '',
      onChange: (e) => { onChange(e.target.value.replace(/\D/g, '').slice(0, 4)); setOpen(true); },
      onFocus: () => setOpen(true),
      onBlur: () => { blurTimer.current = setTimeout(() => setOpen(false), 150); },
      onKeyDown,
      style: inputStyle
    }),
    showList && React.createElement('ul', {
      id: listId,
      role: 'listbox',
      style: {
        position: 'absolute', zIndex: 20, top: '100%', insetInlineStart: 0, insetInlineEnd: 0,
        margin: space.xs + 'px 0 0', padding: 0, listStyle: 'none',
        background: palette.surface, border: '1px solid ' + palette.border,
        borderRadius: radius.sm + 'px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        maxHeight: '240px', overflowY: 'auto'
      }
    },
      suggestions.map((s, i) =>
        React.createElement('li', {
          key: s.plz + '-' + s.bfsNr,
          id: listId + '-' + i,
          role: 'option',
          'aria-selected': i === activeIndex,
          // mousedown statt click: feuert vor dem input-blur, sonst schliesst die Liste zuerst
          onMouseDown: (e) => { e.preventDefault(); clearTimeout(blurTimer.current); pick(s); },
          onMouseEnter: () => setActiveIndex(i),
          style: {
            padding: space.sm + 'px ' + space.md + 'px',
            cursor: 'pointer', fontSize: text.sm,
            background: i === activeIndex ? palette.up : 'transparent',
            color: palette.text,
            display: 'flex', justifyContent: 'space-between', gap: space.sm + 'px'
          }
        },
          React.createElement('span', { style: { fontWeight: weight.semi } }, s.plz),
          React.createElement('span', { style: { color: palette.mid } }, s.gemeinde + ' (' + s.kanton + ')')
        )
      )
    )
  );
};
