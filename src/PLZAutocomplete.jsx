import React, { useState, useRef, useMemo, useEffect } from 'react';
import { text, space, radius, weight } from './config/tokens.js';

// Lokales, offline PLZ→Gemeinde-Autocomplete für das Wohnen-Postleitzahl-Feld.
// Tippt man PLZ-Ziffern, erscheinen passende „PLZ — Gemeinde (Kanton)"-Vorschläge
// aus der gebündelten Schweizer PLZ-Datenbank (kein externer Call). Auswahl füllt
// PLZ + Stadt; der Kanton wird vom bestehenden PLZ→Kanton-Sync in main.jsx gesetzt.
//
// Die ~165 kB PLZ-Daten werden bewusst NICHT statisch importiert (sonst landen sie
// im eager-Bundle und laden bei jedem Seitenaufruf). Stattdessen dynamisch beim
// Mounten der Komponente, also erst wenn das Wohnen-Kapitel geöffnet wird. main.jsx
// wärmt denselben Chunk via preloadPLZ() schon nach dem App-Mount vor.
//
// Barrierearm: ARIA-Combobox-Muster (role=combobox/listbox/option), Pfeiltasten,
// Enter zum Wählen, Escape zum Schliessen.
export const PLZAutocomplete = ({ value, onChange, onBlur, onPick, palette, inputStyle, fieldId, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchFn, setSearchFn] = useState(null);
  const blurTimer = useRef(null);

  // PLZ-Modul beim Mounten (Kapitel-Öffnen) laden, nicht im eager-Bundle.
  useEffect(() => {
    let alive = true;
    import('./data/plzGemeinde.js').then((m) => { if (alive) setSearchFn(() => m.searchPLZ); }).catch(() => {});
    return () => { alive = false; clearTimeout(blurTimer.current); };
  }, []);

  const suggestions = useMemo(() => {
    if (!searchFn) return [];
    const q = String(value || '').trim();
    if (q.length < 2) return [];
    const res = searchFn(q, 8);
    // Bei eindeutiger 4-stelliger PLZ (genau eine Gemeinde) keine Liste — wäre Lärm.
    if (q.length === 4 && res.length === 1) return [];
    return res;
  }, [value, searchFn]);

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
      'aria-controls': showList ? listId : undefined,
      'aria-autocomplete': 'list',
      'aria-activedescendant': activeIndex >= 0 ? listId + '-' + activeIndex : undefined,
      value: value,
      placeholder: placeholder || '',
      onChange: (e) => { onChange(e.target.value.replace(/\D/g, '').slice(0, 4)); setOpen(true); },
      onFocus: () => setOpen(true),
      onBlur: (e) => {
        if (onBlur) onBlur(e.target.value);
        blurTimer.current = setTimeout(() => setOpen(false), 150);
      },
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
