import React, { useState } from 'react';
import { text, weight } from './config/tokens.js';

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

  const langLabels = { en: 'English', de: 'Deutsch', fr: 'Français', it: 'Italiano' };


  const finish = () => {
    if (firstName.trim()) onUpdateData('basis', 'firstName', firstName.trim());
    if (lastName.trim()) onUpdateData('basis', 'lastName', lastName.trim());
    if (canton) onUpdateData('basis', 'canton', canton);
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
    onComplete();
  };

  const cardStyle = {
    maxWidth: '440px', width: '100%', padding: '32px',
    background: palette.surface, borderRadius: '16px',
    border: '1px solid ' + palette.border,
  };

  const btnPrimary = {
    width: '100%', padding: '14px', background: palette.sand,
    color: '#000', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', fontSize: text.body,
    fontFamily: 'DM Sans, sans-serif', marginTop: '16px',
  };

  const btnSecondary = {
    ...btnPrimary,
    background: 'transparent', color: palette.mid,
    border: '1px solid ' + palette.border,
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '8px',
    border: '1px solid ' + palette.border, background: palette.up,
    color: palette.text, fontSize: text.body, boxSizing: 'border-box',
    fontFamily: 'DM Sans, sans-serif',
  };

  // ─── Step 0: Language ────────────────────────────────────
  if (step === 0) {
    return React.createElement('div', {
      style: { width: '100vw', height: '100vh', background: palette.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }
    },
      React.createElement('div', { style: cardStyle },
        React.createElement('div', { style: { textAlign: 'center', marginBottom: '24px' } },
          React.createElement('svg', { width: '36', height: '36', viewBox: '0 0 24 24', fill: 'none', stroke: palette.sand, strokeWidth: '1.8', strokeLinecap: 'round', style: { marginBottom: '12px' } },
            React.createElement('path', { d: 'M 3 17 Q 7 9 12 12 Q 17 15 21 7' }),
            React.createElement('path', { d: 'M 3 20 Q 8 14 12 16 Q 16 18 21 13', opacity: '0.4' })
          ),
          React.createElement('h1', { style: { fontSize: '22px', fontWeight: '700', color: palette.text, marginBottom: '4px', letterSpacing: '0.5px' } }, 'Maloja Plana'),
          React.createElement('p', { style: { fontSize: '13px', color: palette.mid } }, t('onboarding.chooseLanguage'))
        ),

        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } },
          supportedLanguages.map(lang =>
            React.createElement('button', {
              key: lang,
              onClick: () => { setLanguage(lang); setStep(1); },
              style: {
                padding: '16px 12px', borderRadius: '10px', cursor: 'pointer',
                border: '1px solid ' + palette.border, background: palette.up,
                color: palette.text, fontSize: '15px', fontWeight: '600',
                fontFamily: 'DM Sans, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s',
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
        React.createElement('div', { style: { textAlign: 'center', marginBottom: '24px' } },
          React.createElement('h2', { style: { fontSize: '20px', fontWeight: '700', color: palette.text, marginBottom: '4px' } }, t('onboarding.welcomeTitle')),
          React.createElement('p', { style: { fontSize: '13px', color: palette.mid, lineHeight: 1.5 } }, t('onboarding.welcomeSubtitle'))
        ),

        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' } },
          React.createElement('div', null,
            React.createElement('label', { style: { fontSize: '13px', color: palette.mid, display: 'block', marginBottom: '6px' } }, t('onboarding.firstName')),
            React.createElement('input', {
              type: 'text', value: firstName,
              onChange: (e) => setFirstName(e.target.value),
              placeholder: t('onboarding.firstNamePlaceholder'),
              style: inputStyle,
              autoFocus: true,
            })
          ),
          React.createElement('div', null,
            React.createElement('label', { style: { fontSize: '13px', color: palette.mid, display: 'block', marginBottom: '6px' } }, t('onboarding.lastName')),
            React.createElement('input', {
              type: 'text', value: lastName,
              onChange: (e) => setLastName(e.target.value),
              placeholder: t('onboarding.lastNamePlaceholder'),
              style: inputStyle,
            })
          )
        ),

        React.createElement('div', { style: { marginBottom: '8px' } },
          React.createElement('label', { style: { fontSize: '13px', color: palette.mid, display: 'block', marginBottom: '6px' } }, t('onboarding.yourCanton')),
          React.createElement('select', {
            value: canton, onChange: (e) => setCanton(e.target.value),
            style: { ...inputStyle, appearance: 'auto' },
          },
            React.createElement('option', { value: '' }, t('common.select')),
            CANTON_CODES.map(c => React.createElement('option', { key: c, value: c }, getCantonName(c, t)))
          )
        ),

        React.createElement('p', { style: { fontSize: text.xs, color: palette.mid, marginTop: '4px', marginBottom: '8px' } },
          t('onboarding.privacyNote')
        ),

        React.createElement('button', {
          onClick: () => setStep(2),
          style: btnPrimary,
        }, t('common.next') + ' →'),

        React.createElement('button', {
          onClick: () => setStep(2),
          style: { ...btnSecondary, marginTop: '8px' },
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

      React.createElement('h2', { style: { fontSize: '20px', fontWeight: '700', color: palette.text, marginBottom: '8px' } },
        firstName.trim()
          ? t('onboarding.readyTitle', { name: firstName.trim() })
          : t('onboarding.readyTitleGeneric')
      ),

      React.createElement('p', { style: { fontSize: '13px', color: palette.mid, lineHeight: 1.5, marginBottom: '8px' } },
        t('onboarding.readyMessage')
      ),

      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', padding: '16px', background: palette.up, borderRadius: '8px', marginBottom: '16px' } },
        [
          t('onboarding.tip1'),
          t('onboarding.tip2'),
          t('onboarding.tip3'),
        ].map((tip, i) => React.createElement('div', { key: i, style: { fontSize: '13px', color: palette.mid, display: 'flex', gap: '8px' } },
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
