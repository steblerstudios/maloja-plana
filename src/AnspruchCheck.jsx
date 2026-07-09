import React, { useState, useEffect } from 'react';
import { Schnellcheck } from './Schnellcheck.jsx';
import Lebenssituationen from './Lebenssituationen.jsx';
import { PrimaryButton } from './components/PrimaryButton.jsx';
import { calculateIPV, calculateSozialhilfe, checkELEligibility } from './config/cantonalData.js';
import { LEBENSZUSTAENDE } from './data/lebenszustaende.js';
import { text, weight, leading, space, radius, duration, ease } from './config/tokens.js';

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
    { n: 3, label: t('anspruchCheck.stepOverview') },
  ];

  // Schritt 3 — vereintes Ergebnis: einkommensbasierte Leistungen (aus dem Profil,
  // dieselbe Engine wie der Schnellcheck, mit denselben Ehrlichkeits-Gates) +
  // die in Schritt 2 gewählten Lebenslagen. Nur POSITIV, jede Zeile verlinkt ins
  // bestehende Zuhause. Keine erfundenen Beträge, kein Verdikt.
  const renderResult = () => {
    const incomeBenefits = [];
    try {
      const canton = data?.basis?.canton || '';
      const income = Number(data?.finanzen?.monthlyIncome) || 0;
      const rent = Number(data?.wohnen?.rentAmount) || 0;
      if (income > 0 && canton && calculateIPV(data)?.eligible) {
        incomeBenefits.push({ key: 'ipv', label: t('anspruch.items.ipv.label'), view: 'premium' });
      }
      if (rent > 0) {
        const sh = calculateSozialhilfe(data);
        if (sh?.eligible && (sh?.vermoegenUeberFreibetrag || 0) === 0) {
          incomeBenefits.push({ key: 'soz', label: t('anspruch.items.sozialhilfe.label'), view: 'sozialhilfe' });
        }
      }
      if (checkELEligibility(data)?.eligible) {
        incomeBenefits.push({ key: 'el', label: t('anspruch.items.el.label'), view: 'finanzuebersicht' });
      }
    } catch { /* Orientierung, nie blockierend */ }

    let selected = [];
    try { selected = JSON.parse(localStorage.getItem('or5_lebenszustaende') || '[]'); } catch { selected = []; }
    const chosen = LEBENSZUSTAENDE.filter((z) => selected.includes(z.key));

    const row = (key, label, onClick) => React.createElement('button', {
      key, type: 'button', onClick,
      style: {
        display: 'block', width: '100%', textAlign: 'left', boxSizing: 'border-box',
        padding: '10px 12px', marginBottom: space.xs + 'px',
        background: palette.surface, color: palette.text,
        border: '1px solid ' + palette.border + '44', borderRadius: radius.sm,
        cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.medium,
        transition: `border-color ${duration.normal}ms ${ease}`,
      },
      onMouseEnter: (e) => { e.currentTarget.style.borderColor = palette.sage + '55'; },
      onMouseLeave: (e) => { e.currentTarget.style.borderColor = palette.border + '44'; },
    }, label + ' →');

    const emptyLine = (txt) => React.createElement('p', {
      style: { fontSize: text.xs, color: palette.soft, fontStyle: 'italic', lineHeight: leading.relaxed, margin: '0 0 ' + space.sm + 'px 0' }
    }, txt);

    const sectionHeader = (txt) => React.createElement('h3', {
      style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep || palette.text, letterSpacing: '0.3px', margin: space.md + 'px 0 ' + space.sm + 'px 0' }
    }, txt);

    return React.createElement('div', null,
      React.createElement('h2', {
        style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, margin: '0 0 ' + space.xs + 'px 0' }
      }, t('anspruchCheck.stepOverview')),
      React.createElement('p', {
        style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.sm + 'px 0', lineHeight: leading.relaxed }
      }, t('anspruchCheck.resultIntro')),

      sectionHeader(t('anspruchCheck.resultIncomeHeader')),
      incomeBenefits.length
        ? incomeBenefits.map((b) => row(b.key, b.label, () => onNavigate(b.view)))
        : emptyLine(t('anspruchCheck.resultEmptyIncome')),

      sectionHeader(t('anspruchCheck.resultSituationHeader')),
      chosen.length
        ? chosen.map((z) => row(z.key, t('lebenszustaende.' + z.key + '.label'), () => onNavigate('situationen')))
        : emptyLine(t('anspruchCheck.resultEmptySituation')),

      React.createElement('button', {
        type: 'button', onClick: () => onNavigate('ansprueche'),
        style: {
          display: 'block', marginTop: space.md + 'px', background: 'none', border: 'none', padding: 0,
          cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.medium,
          color: palette.sageDeep || palette.sage,
        }
      }, '→ ' + t('anspruchCheck.resultToLandkarte'))
    );
  };

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

    step === 1 && React.createElement(Schnellcheck, { palette, t, data, onNavigate }),
    step === 2 && React.createElement(Lebenssituationen, { palette, t, data, onNavigate }),
    step === 3 && renderResult(),

    React.createElement('div', {
      style: {
        display: 'flex', gap: space.sm + 'px', flexWrap: 'wrap', alignItems: 'center',
        marginTop: space.xl + 'px', paddingTop: space.lg + 'px', borderTop: '1px solid ' + palette.border + '33',
      }
    },
      step === 1 && React.createElement(PrimaryButton, { palette, onClick: () => setStep(2) }, t('anspruchCheck.weiter') + ' →'),
      step === 2 && React.createElement(React.Fragment, null,
        secondaryBtn('← ' + t('anspruchCheck.zurueck'), () => setStep(1)),
        React.createElement(PrimaryButton, { palette, onClick: () => setStep(3) }, t('anspruchCheck.weiterOverview') + ' →')
      ),
      step === 3 && React.createElement(React.Fragment, null,
        secondaryBtn('← ' + t('anspruchCheck.zurueck'), () => setStep(2)),
        React.createElement(PrimaryButton, { palette, onClick: () => onNavigate('ansprueche') }, t('anspruchCheck.fertig') + ' →')
      )
    )
  );
};

export default AnspruchCheck;
