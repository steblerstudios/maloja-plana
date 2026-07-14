import React from 'react';
import { text, weight, space, radius, fontFamily } from './config/tokens.js';

const SPECIALTIES = [
  'hausarzt', 'zahnarzt', 'gynaekologe', 'kinderarzt', 'psychiater', 'other'
];

export const DoctorManager = ({ palette, t, doctors, onChange }) => {
  const docs = Array.isArray(doctors) ? doctors : [];

  const addDoc = () => {
    onChange([...docs, { name: '', specialty: 'hausarzt', phone: '' }]);
  };

  const updateDoc = (idx, patch) => {
    onChange(docs.map((d, i) => i === idx ? { ...d, ...patch } : d));
  };

  const removeDoc = (idx) => {
    onChange(docs.filter((_, i) => i !== idx));
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

    docs.length > 0 && docs.map((doc, idx) =>
      React.createElement(DocCard, {
        key: idx, palette, t, doc, idx,
        inputStyle, labelStyle,
        onUpdate: (patch) => updateDoc(idx, patch),
        onRemove: () => removeDoc(idx),
      })
    ),

    React.createElement('button', {
      onClick: addDoc,
      style: {
        padding: space.sm + 'px ' + space.md + 'px',
        background: 'transparent', color: palette.mid,
        border: '1px dashed ' + palette.border, borderRadius: radius.sm,
        cursor: 'pointer', fontSize: text.sm, fontFamily,
        fontWeight: weight.medium, alignSelf: 'flex-start',
      }
    }, '+ ' + t('doctors.add'))
  );
};

const DocCard = ({ palette, t, doc, idx, inputStyle, labelStyle, onUpdate, onRemove }) => {
  const specLabel = t('doctors.specialties.' + (doc.specialty || 'hausarzt'));

  return React.createElement('div', {
    style: {
      padding: space.md + 'px', background: palette.up,
      borderRadius: radius.sm, border: '1px solid ' + palette.border,
    }
  },
    // Header
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm }
    },
      React.createElement('span', {
        style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text }
      }, specLabel || t('doctors.label', { nr: idx + 1 })),
      React.createElement('button', {
        onClick: onRemove,
        'aria-label': t('common.delete') || 'Entfernen',
        style: {
          background: 'none', border: 'none', cursor: 'pointer',
          color: palette.mid, fontSize: text.sm, fontFamily, padding: '6px 8px', minHeight: '24px',
        }
      }, '✕')
    ),

    // Specialty
    React.createElement('div', { style: { marginBottom: space.sm } },
      React.createElement('label', { style: labelStyle }, t('doctors.specialty')),
      React.createElement('select', {
        value: doc.specialty || 'hausarzt',
        onChange: (e) => onUpdate({ specialty: e.target.value }),
        'aria-label': t('doctors.specialty'),
        style: { ...inputStyle, cursor: 'pointer' },
      },
        SPECIALTIES.map(s =>
          React.createElement('option', { key: s, value: s }, t('doctors.specialties.' + s))
        )
      )
    ),

    // Name
    React.createElement('div', { style: { marginBottom: space.sm } },
      React.createElement('label', { style: labelStyle }, t('doctors.name')),
      React.createElement('input', {
        type: 'text', value: doc.name || '',
        onChange: (e) => onUpdate({ name: e.target.value }),
        placeholder: t('doctors.namePlaceholder'),
        'aria-label': t('doctors.name'),
        style: inputStyle,
      })
    ),

    // Phone
    React.createElement('div', { style: { marginBottom: space.sm } },
      React.createElement('label', { style: labelStyle }, t('doctors.phone')),
      React.createElement('input', {
        type: 'tel', value: doc.phone || '',
        onChange: (e) => onUpdate({ phone: e.target.value }),
        placeholder: '+41 44 123 45 67',
        'aria-label': t('doctors.phone'),
        style: inputStyle,
      })
    ),

    // Notes (compact, single line)
    React.createElement('div', null,
      React.createElement('label', { style: labelStyle }, t('doctors.notes')),
      React.createElement('input', {
        type: 'text', value: doc.notes || '',
        onChange: (e) => onUpdate({ notes: e.target.value }),
        placeholder: t('doctors.notesPlaceholder'),
        'aria-label': t('doctors.notes'),
        style: inputStyle,
      })
    )
  );
};

export default DoctorManager;
