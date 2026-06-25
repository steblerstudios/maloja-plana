import React, { useState } from 'react';
import { LIGHT_PALETTE } from './config/constants.js';
import { useT } from './i18n/index.js';
import { text, weight, radius , leading , space } from './config/tokens.js';

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
    role: 'main',
    'aria-label': 'Maloja Plana',
    style: {
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: palette.bg, fontFamily: 'inherit',
    }
  },
    React.createElement('form', {
      onSubmit: handleSubmit,
      style: {
        background: palette.surface, padding: '40px', borderRadius: radius.md,
        border: '1px solid ' + palette.border, maxWidth: '360px', width: '100%',
        textAlign: 'center',
      }
    },
      React.createElement('h1', {
        'aria-label': 'Maloja Plana',
        style: { fontSize: text.xl, fontWeight: weight.bold, margin: '0 0 ' + space.sm + 'px', color: palette.text, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }
      },
        React.createElement('svg', { width: '20', height: '23', viewBox: '0 0 20 22', fill: 'none', 'aria-hidden': 'true', style: { display: 'block', flexShrink: 0 } },
          React.createElement('polyline', { points: '2,19 6.5,4 10,11 13.5,2 18,19', fill: 'none', stroke: palette.text, strokeWidth: '2.8', strokeLinejoin: 'round', strokeLinecap: 'round' }),
          React.createElement('circle', { cx: '13.5', cy: '2.4', r: '1.9', fill: palette.gold })
        ),
        'aloja Plana'
      ),
      React.createElement('p', {
        style: { fontSize: text.sm, color: palette.mid, marginBottom: space.md, lineHeight: leading.normal }
      }, t('beta.intro')),
      React.createElement('p', {
        style: { fontSize: text.sm, color: palette.mid, marginBottom: space.md, lineHeight: leading.normal }
      }, t('beta.gateMessage')),
      React.createElement('div', {
        style: {
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          marginBottom: space.lg, padding: '8px 12px',
          background: palette.sage + '0A', borderRadius: radius.sm,
        }
      },
        React.createElement('svg', {
          width: '14', height: '14', viewBox: '0 0 16 16', fill: 'none',
          stroke: palette.sage, strokeWidth: '1.5', strokeLinecap: 'round',
          'aria-hidden': 'true',
        },
          React.createElement('rect', { x: '4', y: '7', width: '8', height: '7', rx: '1' }),
          React.createElement('path', { d: 'M 6 7 V 5 a 2 2 0 0 1 4 0 V 7' })
        ),
        React.createElement('span', {
          style: { fontSize: text.xs, color: palette.sage, lineHeight: leading.normal }
        }, t('trust.localBadge'))
      ),
      React.createElement('input', {
        type: 'text',
        value: input,
        onChange: (e) => { setInput(e.target.value); setError(false); },
        placeholder: t('beta.codePlaceholder'),
        autoFocus: true,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': error ? 'beta-error' : undefined,
        style: {
          width: '100%', padding: '10px 14px', fontSize: text.body,
          border: '1px solid ' + (error ? palette.rose : palette.border),
          borderRadius: radius.sm, background: palette.up, color: palette.text,
          outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
        }
      }),
      error && React.createElement('p', {
        id: 'beta-error',
        role: 'alert',
        style: { fontSize: text.sm, color: palette.rose, marginTop: space.sm }
      }, t('beta.codeWrong')),
      React.createElement('button', {
        type: 'submit',
        style: {
          marginTop: space.md, width: '100%', padding: '10px', fontSize: text.body,
          background: palette.sand, color: '#000', border: 'none',
          borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontFamily: 'inherit',
        }
      }, t('beta.enter')),
      React.createElement('p', {
        style: { fontSize: text.xs, color: palette.soft, marginTop: space.md }
      }, 'Stebler Studios · Basel')
    )
  );
};

export default BetaGate;
