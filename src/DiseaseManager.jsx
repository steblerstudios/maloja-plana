import React, { useState, useRef, useEffect } from 'react';
import { text, weight, space, radius, fontFamily } from './config/tokens.js';

let _searchDiseases = null;
const getSearch = async () => {
  if (!_searchDiseases) {
    const mod = await import('./config/diseaseData.js');
    _searchDiseases = mod.searchDiseases;
  }
  return _searchDiseases;
};

export const DiseaseManager = ({ palette, t, diseases, onChange }) => {
  const items = Array.isArray(diseases) ? diseases : [];

  const addItem = () => {
    onChange([...items, { name: '', code: '', notes: '' }]);
  };

  const updateItem = (idx, patch) => {
    onChange(items.map((d, i) => i === idx ? { ...d, ...patch } : d));
  };

  const removeItem = (idx) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const inputStyle = {
    width: '100%', padding: (space.sm + 2) + 'px ' + space.sm + 'px',
    borderRadius: radius.sm, border: '1px solid ' + palette.border,
    background: palette.up, color: palette.text, boxSizing: 'border-box',
    fontSize: text.sm, fontFamily, cursor: 'text'
  };

  const labelStyle = {
    display: 'block', fontSize: text.xs, fontWeight: weight.medium,
    color: palette.mid, marginBottom: space.xs
  };

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.md } },
    items.length > 0 && items.map((item, idx) =>
      React.createElement(DiseaseCard, {
        key: idx, palette, t, item, idx, inputStyle, labelStyle,
        onUpdate: (patch) => updateItem(idx, patch),
        onRemove: () => removeItem(idx),
      })
    ),
    React.createElement('button', {
      onClick: addItem,
      style: {
        padding: space.sm + 'px ' + space.md + 'px',
        background: 'transparent', color: palette.mid,
        border: '1px dashed ' + palette.border, borderRadius: radius.sm,
        cursor: 'pointer', fontSize: text.sm, fontFamily,
        fontWeight: weight.medium, alignSelf: 'flex-start',
      }
    }, '+ ' + t('diseases.add'))
  );
};

const DiseaseCard = ({ palette, t, item, idx, inputStyle, labelStyle, onUpdate, onRemove }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const nameRef = useRef(null);
  const sugRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (sugRef.current && !sugRef.current.contains(e.target) && nameRef.current !== e.target) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNameChange = async (val) => {
    onUpdate({ name: val });
    if (val.length >= 2) {
      const search = await getSearch();
      const results = search(val);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (s) => {
    onUpdate({ name: s.name, code: s.code });
    setShowSuggestions(false);
  };

  return React.createElement('div', {
    style: {
      padding: space.md + 'px', background: palette.up,
      borderRadius: radius.sm, border: '1px solid ' + palette.border,
    }
  },
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm }
    },
      React.createElement('span', {
        style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text }
      }, item.name || t('diseases.label', { nr: idx + 1 })),
      React.createElement('button', {
        onClick: onRemove,
        'aria-label': t('common.delete') || 'Entfernen',
        style: { background: 'none', border: 'none', cursor: 'pointer', color: palette.mid, fontSize: text.sm, fontFamily, padding: '2px 6px' }
      }, '✕')
    ),

    // Name with autocomplete
    React.createElement('div', { style: { marginBottom: space.sm, position: 'relative' } },
      React.createElement('label', { style: labelStyle }, t('diseases.name')),
      React.createElement('input', {
        ref: nameRef, type: 'text', value: item.name || '',
        onChange: (e) => handleNameChange(e.target.value),
        onFocus: () => { if (suggestions.length > 0) setShowSuggestions(true); },
        placeholder: t('diseases.namePlaceholder'),
        style: inputStyle, autoComplete: 'off',
      }),
      showSuggestions && React.createElement('div', {
        ref: sugRef,
        style: {
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
          background: palette.surface, border: '1px solid ' + palette.border,
          borderRadius: radius.sm, maxHeight: '200px', overflowY: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }
      },
        suggestions.map((s, i) =>
          React.createElement('div', {
            key: i, onClick: () => selectSuggestion(s),
            style: {
              padding: space.sm + 'px ' + space.md + 'px', cursor: 'pointer',
              borderBottom: i < suggestions.length - 1 ? '1px solid ' + palette.border : 'none',
              fontSize: text.sm,
            },
            onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; },
            onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; },
          },
            React.createElement('div', { style: { fontWeight: weight.semi } }, s.name),
            React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, 'ICD-10: ' + s.code)
          )
        )
      )
    ),

    // ICD Code (auto-filled or manual)
    React.createElement('div', { style: { marginBottom: space.sm } },
      React.createElement('label', { style: labelStyle }, t('diseases.code')),
      React.createElement('input', {
        type: 'text', value: item.code || '',
        onChange: (e) => onUpdate({ code: e.target.value }),
        placeholder: 'z.B. E11',
        style: { ...inputStyle, maxWidth: '120px' },
      })
    ),

    // Notes
    React.createElement('div', null,
      React.createElement('label', { style: labelStyle }, t('diseases.notes')),
      React.createElement('input', {
        type: 'text', value: item.notes || '',
        onChange: (e) => onUpdate({ notes: e.target.value }),
        placeholder: t('diseases.notesPlaceholder'),
        style: inputStyle,
      })
    )
  );
};

export default DiseaseManager;
