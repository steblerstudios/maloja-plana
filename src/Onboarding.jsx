import React, { useState } from 'react';
import { text, weight, radius , leading , space, fontFamily, ease, duration } from './config/tokens.js';

// ─── Onboarding ────────────────────────────────────────────
// First-run experience for new users.
// Steps: 1) Language  2) Name + Canton  3) Welcome
// Stores or5_onboarding_done = true when complete.
// Zero backend, zero tracking, zero analytics.

const STORAGE_KEY = 'or5_onboarding_done';

export const isOnboardingDone = () => {
  try { return localStorage.getItem(STORAGE_KEY) === 'true'; }
  catch { return false; }
};

import { CANTON_CODES, getCantonName } from './config/cantonalData.js';

export const Onboarding = ({ palette, t, setLanguage, supportedLanguages, onComplete, onUpdateData }) => {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [canton, setCanton] = useState('');

  const langLabels = { en: 'English', de: 'Deutsch', fr: 'Français', it: 'Italiano', rm: 'Rumantsch' };


  const finish = () => {
    if (firstName.trim()) onUpdateData('basis', 'firstName', firstName.trim());
    if (lastName.trim()) onUpdateData('basis', 'lastName', lastName.trim());
    if (canton) onUpdateData('basis', 'canton', canton);
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
    onComplete();
  };

  const cardStyle = {
    maxWidth: '440px', width: '100%', padding: space.xl,
    background: palette.surface, borderRadius: radius.lg,
    border: '1px solid ' + palette.border,
  };

  const btnPrimary = {
    width: '100%', padding: '14px', background: palette.sand,
    color: '#000', border: 'none', borderRadius: radius.sm,
    cursor: 'pointer', fontWeight: weight.semi, fontSize: text.body,
    fontFamily: fontFamily, marginTop: space.md,
  };

  const btnSecondary = {
    ...btnPrimary,
    background: 'transparent', color: palette.mid,
    border: '1px solid ' + palette.border,
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: radius.sm,
    border: '1px solid ' + palette.border, background: palette.up,
    color: palette.text, fontSize: text.body, boxSizing: 'border-box',
    fontFamily: fontFamily,
  };

  // ─── Step 0: Language ────────────────────────────────────
  if (step === 0) {
    return React.createElement('div', {
      style: { width: '100vw', height: '100vh', background: palette.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }
    },
      React.createElement('div', { style: cardStyle },
        React.createElement('div', { style: { textAlign: 'center', marginBottom: space.lg } },
          React.createElement('h1', {
            'aria-label': 'Maloja Plana',
            style: { fontSize: text.xl, fontWeight: weight.bold, color: palette.text, marginBottom: space.xs, letterSpacing: '0.5px', display: 'inline-flex', alignItems: 'center', gap: '2px' }
          },
            // Das «M» von Maloja ist der Gipfel (Maloja-Pass)
            React.createElement('svg', { width: '20', height: '23', viewBox: '0 0 20 22', fill: 'none', 'aria-hidden': 'true', style: { display: 'block', flexShrink: 0 } },
              React.createElement('polyline', { points: '2,19 6.5,4 10,11 13.5,2 18,19', fill: 'none', stroke: palette.text, strokeWidth: '2.8', strokeLinejoin: 'round', strokeLinecap: 'round' }),
              React.createElement('circle', { cx: '13.5', cy: '2.4', r: '1.9', fill: palette.gold })
            ),
            'aloja Plana'
          ),
          React.createElement('p', { style: { fontSize: text.sm, color: palette.mid } }, t('onboarding.chooseLanguage'))
        ),

        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.sm } },
          supportedLanguages.map(lang =>
            React.createElement('button', {
              key: lang,
              onClick: () => { setLanguage(lang); setStep(1); },
              style: {
                padding: '16px 12px', borderRadius: radius.md, cursor: 'pointer',
                border: '1px solid ' + palette.border, background: palette.up,
                color: palette.text, fontSize: text.sm, fontWeight: weight.semi,
                fontFamily: fontFamily,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: space.sm,
                transition: `all ${duration.normal}ms ${ease}`,
              },
              onMouseEnter: (e) => { e.currentTarget.style.borderColor = palette.sand; },
              onMouseLeave: (e) => { e.currentTarget.style.borderColor = palette.border; },
            },
              langLabels[lang] || lang.toUpperCase()
            )
          )
        )
      )
    );
  }

  // ─── Step 1: Name + Canton ───────────────────────────────
  if (step === 1) {
    return React.createElement('div', {
      style: { width: '100vw', height: '100vh', background: palette.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }
    },
      React.createElement('div', { style: cardStyle },
        React.createElement('div', { style: { textAlign: 'center', marginBottom: space.lg } },
          React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.bold, color: palette.text, marginBottom: space.xs } }, t('onboarding.welcomeTitle')),
          React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: 1.5 } }, t('onboarding.welcomeSubtitle'))
        ),

        React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: space.md, padding: '8px 12px', background: palette.sage + '0A', borderRadius: radius.sm, border: '1px solid ' + palette.sage + '18' } },
          React.createElement('svg', { width: '13', height: '13', viewBox: '0 0 16 16', fill: 'none', stroke: palette.sage, strokeWidth: '1.5', strokeLinecap: 'round', style: { flexShrink: 0 } },
            React.createElement('rect', { x: '4', y: '7', width: '8', height: '7', rx: '1' }),
            React.createElement('path', { d: 'M 6 7 V 5 a 2 2 0 0 1 4 0 V 7' })
          ),
          React.createElement('span', { style: { fontSize: text.sm, color: palette.sage, lineHeight: 1.4 } },
            t('onboarding.privacyNote')
          )
        ),

        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: space.md } },
          React.createElement('div', null,
            React.createElement('label', { style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: '6px' } }, t('onboarding.firstName')),
            React.createElement('input', {
              type: 'text', value: firstName,
              onChange: (e) => setFirstName(e.target.value),
              placeholder: t('onboarding.firstNamePlaceholder'),
              'aria-label': t('onboarding.firstName'),
              style: inputStyle,
              autoFocus: true,
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: '6px' } }, t('onboarding.lastName')),
            React.createElement('input', {
              type: 'text', value: lastName,
              onChange: (e) => setLastName(e.target.value),
              placeholder: t('onboarding.lastNamePlaceholder'),
              'aria-label': t('onboarding.lastName'),
              style: inputStyle,
            })
          )
        ),

        React.createElement('div', { style: { marginBottom: space.sm } },
          React.createElement('label', { style: { fontSize: text.sm, color: palette.mid, display: 'block', marginBottom: '6px' } }, t('onboarding.yourCanton')),
          React.createElement('select', {
            value: canton, onChange: (e) => setCanton(e.target.value),
            'aria-label': t('onboarding.yourCanton'),
            style: { ...inputStyle, appearance: 'auto' },
          },
            React.createElement('option', { value: '' }, t('common.select')),
            CANTON_CODES.map(c => React.createElement('option', { key: c, value: c }, getCantonName(c, t)))
          )
        ),

        React.createElement('button', {
          onClick: () => setStep(2),
          style: btnPrimary,
        }, t('common.next') + ' →'),

        React.createElement('button', {
          onClick: () => setStep(2),
          style: { ...btnSecondary, marginTop: space.sm },
        }, t('onboarding.skipForNow'))
      )
    );
  }

  // ─── Step 2: Ready ───────────────────────────────────────
  return React.createElement('div', {
    style: { width: '100vw', height: '100vh', background: palette.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }
  },
    React.createElement('div', { style: { ...cardStyle, textAlign: 'center' } },
      React.createElement('div', { style: {
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'linear-gradient(135deg, ' + palette.sand + ', ' + palette.sage + ')',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px auto', fontSize: '32px',
      } }, '✓'),

      React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.bold, color: palette.text, marginBottom: space.sm } },
        firstName.trim()
          ? t('onboarding.readyTitle', { name: firstName.trim() })
          : t('onboarding.readyTitleGeneric')
      ),

      React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: 1.5, marginBottom: space.sm } },
        t('onboarding.readyMessage')
      ),

      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.md } },
        [
          t('onboarding.tip1'),
          t('onboarding.tip2'),
          t('onboarding.tip3'),
        ].map((tip, i) => React.createElement('div', { key: i, style: { fontSize: text.sm, color: palette.mid, display: 'flex', gap: space.sm } },
          React.createElement('span', { style: { color: palette.sage } }, '✓'),
          tip
        ))
      ),

      React.createElement('button', { onClick: finish, style: btnPrimary },
        t('onboarding.getStarted')
      )
    )
  );
};

export default Onboarding;
