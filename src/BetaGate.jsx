import React, { useState } from 'react';
import { LIGHT_PALETTE } from './config/constants.js';
import { useT } from './i18n/index.js';
import { text, weight } from './config/tokens.js';

const BETA_CODE = 'maloja2026';
const STORAGE_KEY = 'or5_beta_access';

export const BetaGate = ({ children }) => {
  const { t } = useT();
  const [granted, setGranted] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
  });
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  if (granted) return children;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === BETA_CODE) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setGranted(true);
    } else {
      setError(true);
      setInput('');
    }
  };

  const palette = LIGHT_PALETTE;

  return React.createElement('div', {
    style: {
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: palette.bg, fontFamily: 'inherit',
    }
  },
    React.createElement('form', {
      onSubmit: handleSubmit,
      style: {
        background: palette.surface, padding: '40px', borderRadius: '12px',
        border: '1px solid ' + palette.border, maxWidth: '360px', width: '100%',
        textAlign: 'center',
      }
    },
      React.createElement('h1', {
        style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: '8px', color: palette.text }
      }, 'Maloja Plana'),
      React.createElement('p', {
        style: { fontSize: text.sm, color: palette.mid, marginBottom: '24px', lineHeight: '1.5' }
      }, t('beta.gateMessage')),
      React.createElement('input', {
        type: 'text',
        value: input,
        onChange: (e) => { setInput(e.target.value); setError(false); },
        placeholder: t('beta.codePlaceholder'),
        autoFocus: true,
        style: {
          width: '100%', padding: '10px 14px', fontSize: text.body,
          border: '1px solid ' + (error ? palette.rose : palette.border),
          borderRadius: '6px', background: palette.up, color: palette.text,
          outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
        }
      }),
      error && React.createElement('p', {
        style: { fontSize: text.sm, color: palette.rose, marginTop: '8px' }
      }, t('beta.codeWrong')),
      React.createElement('button', {
        type: 'submit',
        style: {
          marginTop: '16px', width: '100%', padding: '10px', fontSize: text.body,
          background: palette.sand, color: '#fff', border: 'none',
          borderRadius: '6px', cursor: 'pointer', fontWeight: weight.semi, fontFamily: 'inherit',
        }
      }, t('beta.enter'))
    )
  );
};

export default BetaGate;
