import React, { useState, useEffect } from 'react';
import { Schnellcheck } from './Schnellcheck.jsx';
import Lebenssituationen from './Lebenssituationen.jsx';
import { PrimaryButton } from './components/PrimaryButton.jsx';
import { text, weight, space, radius, duration, ease } from './config/tokens.js';

// Anspruch-Check, geführt (#4.4.2 „Brücke"): webt die zwei bestehenden Checks zu
// EINEM Fluss — Schritt 1 = Zahlen (Schnellcheck), Schritt 2 = Lebenslage
// (Lebenssituationen) — ohne Zurück-Navigieren. Beide Bausteine unverändert
// wiederverwendet; der Wrapper fügt nur einen ruhigen Schritt-Indikator und die
// Weiter/Zurück-Führung hinzu. Keim des späteren Wizards (#4.4.3).
export const AnspruchCheck = ({ palette, t, data, onNavigate }) => {
  const [step, setStep] = useState(1);

  // Bei Schrittwechsel sanft nach oben — der neue Schritt beginnt am Anfang.
  useEffect(() => {
    const m = document.querySelector('main');
    if (m && typeof m.scrollTo === 'function') m.scrollTo({ top: 0 });
  }, [step]);

  const steps = [
    { n: 1, label: t('anspruchCheck.stepIncome') },
    { n: 2, label: t('anspruchCheck.stepSituation') },
  ];

  const indicator = React.createElement('div', {
    style: { display: 'flex', gap: space.xs + 'px', marginBottom: space.lg + 'px', flexWrap: 'wrap' }
  },
    steps.map((s) => {
      const on = step === s.n;
      return React.createElement('button', {
        key: s.n,
        type: 'button',
        onClick: () => setStep(s.n),
        'aria-current': on ? 'step' : undefined,
        style: {
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px 12px', borderRadius: radius.pill || radius.md,
          border: '1px solid ' + (on ? palette.sage + '88' : palette.border + '66'),
          background: on ? palette.sage + '18' : 'transparent',
          color: on ? (palette.sageDeep || palette.text) : palette.mid,
          fontSize: text.xs, fontWeight: on ? weight.semi : weight.normal,
          fontFamily: 'inherit', cursor: 'pointer',
          transition: `background ${duration.normal}ms ${ease}, border-color ${duration.normal}ms ${ease}`,
        },
      },
        React.createElement('span', {
          'aria-hidden': 'true',
          style: {
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '18px', height: '18px', borderRadius: '50%',
            background: on ? palette.sage : palette.border + '55',
            color: on ? '#fff' : palette.mid, fontSize: '11px', fontWeight: weight.semi, flexShrink: 0,
          }
        }, String(s.n)),
        t('anspruchCheck.stepWord') + ' ' + s.n + ' · ' + s.label
      );
    })
  );

  // Sekundär-Aktion (Zurück): ruhiger Umriss-Button, kein Primär-Gewicht.
  const secondaryBtn = (label, onClick) => React.createElement('button', {
    type: 'button', onClick,
    style: {
      padding: '10px 16px', borderRadius: radius.sm + 'px', cursor: 'pointer', fontFamily: 'inherit',
      fontSize: text.sm, fontWeight: weight.medium,
      border: '1px solid ' + palette.border + '66', background: 'transparent', color: palette.mid,
      transition: `border-color ${duration.normal}ms ${ease}`,
    },
    onMouseEnter: (e) => { e.currentTarget.style.borderColor = palette.sage + '55'; },
    onMouseLeave: (e) => { e.currentTarget.style.borderColor = palette.border + '66'; },
  }, label);

  return React.createElement('div', { style: { maxWidth: '640px' } },
    indicator,

    step === 1
      ? React.createElement(Schnellcheck, { palette, t, data, onNavigate })
      : React.createElement(Lebenssituationen, { palette, t, data, onNavigate }),

    React.createElement('div', {
      style: {
        display: 'flex', gap: space.sm + 'px', flexWrap: 'wrap', alignItems: 'center',
        marginTop: space.xl + 'px', paddingTop: space.lg + 'px', borderTop: '1px solid ' + palette.border + '33',
      }
    },
      step === 1
        ? React.createElement(PrimaryButton, { palette, onClick: () => setStep(2) }, t('anspruchCheck.weiter') + ' →')
        : React.createElement(React.Fragment, null,
            secondaryBtn('← ' + t('anspruchCheck.zurueck'), () => setStep(1)),
            React.createElement(PrimaryButton, { palette, onClick: () => onNavigate('ansprueche') }, t('anspruchCheck.fertig') + ' →')
          )
    )
  );
};

export default AnspruchCheck;
