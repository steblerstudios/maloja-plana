import React from 'react';
import { text, weight, space, radius, fontFamily } from './config/tokens.js';

const LEVELS = ['native', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1'];

export const LanguageManager = ({ palette, t, languages, onChange }) => {
  const list = Array.isArray(languages) ? languages : [];

  const addLang = () => onChange([...list, { name: '', level: 'B1' }]);
  const updateLang = (idx, patch) => onChange(list.map((d, i) => i === idx ? { ...d, ...patch } : d));
  const removeLang = (idx) => onChange(list.filter((_, i) => i !== idx));

  const inputStyle = {
    width: '100%', padding: (space.sm + 2) + 'px ' + space.sm + 'px',
    borderRadius: radius.sm, border: '1px solid ' + palette.border,
    background: palette.up, color: palette.text, boxSizing: 'border-box',
    fontSize: text.sm, fontFamily, cursor: 'text',
  };
  const labelStyle = {
    display: 'block', fontSize: text.xs, fontWeight: weight.medium,
    color: palette.mid, marginBottom: space.xs,
  };

  const levelLabel = (lv) => lv === 'native' ? t('langSkill.levels.native') : lv;

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: space.sm } },
    list.length > 0 && list.map((lang, idx) =>
      React.createElement('div', {
        key: idx,
        style: { display: 'grid', gridTemplateColumns: '1fr 140px auto', gap: space.sm, alignItems: 'end' }
      },
        React.createElement('div', null,
          idx === 0 && React.createElement('label', { style: labelStyle }, t('langSkill.name')),
          React.createElement('input', {
            type: 'text', value: lang.name || '',
            onChange: (e) => updateLang(idx, { name: e.target.value }),
            placeholder: t('langSkill.namePlaceholder'),
            'aria-label': t('langSkill.name'),
            style: inputStyle,
          })
        ),
        React.createElement('div', null,
          idx === 0 && React.createElement('label', { style: labelStyle }, t('langSkill.level')),
          React.createElement('select', {
            value: lang.level || 'B1',
            onChange: (e) => updateLang(idx, { level: e.target.value }),
            'aria-label': t('langSkill.level'),
            style: { ...inputStyle, cursor: 'pointer' },
          },
            LEVELS.map(lv => React.createElement('option', { key: lv, value: lv }, levelLabel(lv)))
          )
        ),
        React.createElement('button', {
          onClick: () => removeLang(idx),
          'aria-label': t('common.delete') || 'Entfernen',
          style: { background: 'none', border: 'none', cursor: 'pointer', color: palette.mid, fontSize: text.sm, fontFamily, padding: '8px 6px' }
        }, '✕')
      )
    ),
    React.createElement('button', {
      onClick: addLang,
      style: {
        padding: space.sm + 'px ' + space.md + 'px',
        background: 'transparent', color: palette.mid,
        border: '1px dashed ' + palette.border, borderRadius: radius.sm,
        cursor: 'pointer', fontSize: text.sm, fontFamily,
        fontWeight: weight.medium, alignSelf: 'flex-start',
      }
    }, '+ ' + t('langSkill.add'))
  );
};

export default LanguageManager;
