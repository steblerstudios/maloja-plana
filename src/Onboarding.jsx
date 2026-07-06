import React, { useState } from 'react';
import { text, weight, radius , leading , space, fontFamily, ease, duration } from './config/tokens.js';
import { LEBENSZUSTAENDE } from './data/lebenszustaende.js';

// ─── Onboarding ────────────────────────────────────────────
// First-run experience for new users.
// Steps: 0) Language  1) Name + Canton  2) Needs (Lebenszustände)  3) Welcome
// Der Bedürfnis-Schritt legt die Situations-Chips vor (or5_lebenszustaende) —
// so beginnt die App direkt bei dem, was der Person zusteht, statt generisch.
// Stores or5_onboarding_done = true when complete.
// Zero backend, zero tracking, zero analytics.

const SITUATIONS_KEY = 'or5_lebenszustaende';

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
  // „Einfache Ansicht" gleich am Start anbieten (Icon-Modus + Vorlesen). Schreibt
  // nur localStorage; die App liest den Wert beim Mount.
  const [simpleView, setSimpleView] = useState(() => {
    try { return localStorage.getItem('or5_simpleView') === '1'; } catch { return false; }
  });
  const toggleSimpleView = () => setSimpleView(v => {
    const next = !v;
    try { localStorage.setItem('or5_simpleView', next ? '1' : '0'); if (next) localStorage.setItem('or5_vorlesen', '1'); } catch {}
    return next;
  });

  // Bedürfnis-Schritt: selbst gewählte Lebenszustände (kein Auto-Erkennen, keine
  // Etikettierung). Wird in denselben Speicher geschrieben, den die Lebenssituationen-
  // Subpage liest — die App startet damit direkt bei den relevanten Ansprüchen.
  const [situations, setSituations] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SITUATIONS_KEY) || '[]'); } catch { return []; }
  });
  const toggleSituation = (key) => setSituations(prev => {
    const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
    try { localStorage.setItem(SITUATIONS_KEY, JSON.stringify(next)); } catch {}
    return next;
  });

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
      React.createElement('div', { role: 'main', 'aria-label': 'Maloja Plana', style: cardStyle },
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
        ),
        // „Einfache Ansicht"-Umschalter (grosse Symbole + Vorlesen)
        React.createElement('button', {
          type: 'button',
          onClick: toggleSimpleView,
          'aria-pressed': simpleView,
          title: t('common.simpleView'),
          style: {
            marginTop: space.md, width: '100%', padding: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: simpleView ? palette.sand + '30' : 'transparent',
            color: simpleView ? palette.text : palette.mid,
            border: '1px solid ' + (simpleView ? palette.sand : palette.border),
            borderRadius: radius.md, cursor: 'pointer', fontFamily: fontFamily,
            fontSize: text.sm, fontWeight: weight.medium,
          }
        },
          React.createElement('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true' },
            React.createElement('rect', { x: '3', y: '3', width: '8', height: '8', rx: '2' }),
            React.createElement('rect', { x: '13', y: '3', width: '8', height: '8', rx: '2' }),
            React.createElement('rect', { x: '3', y: '13', width: '8', height: '8', rx: '2' }),
            React.createElement('rect', { x: '13', y: '13', width: '8', height: '8', rx: '2' })
          ),
          t('common.simpleView')
        )
      )
    );
  }

  // ─── Step 1: Name + Canton ───────────────────────────────
  if (step === 1) {
    return React.createElement('div', {
      style: { width: '100vw', height: '100vh', background: palette.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }
    },
      React.createElement('div', { role: 'main', 'aria-label': 'Maloja Plana', style: cardStyle },
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

  // ─── Step 2: Needs (Lebenszustände) ──────────────────────
  // „Was trifft gerade auf dich zu?" — ruhige, selbst wählbare Chips (kein Zwang,
  // keine Etikettierung). Die Auswahl belegt or5_lebenszustaende vor, damit die App
  // direkt bei den relevanten Ansprüchen der Person beginnt. Skip/„später" erlaubt.
  if (step === 2) {
    return React.createElement('div', {
      style: { width: '100vw', height: '100vh', background: palette.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }
    },
      React.createElement('div', { role: 'main', 'aria-label': 'Maloja Plana', style: { ...cardStyle, maxWidth: '520px' } },
        React.createElement('div', { style: { textAlign: 'center', marginBottom: space.lg } },
          React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.bold, color: palette.text, marginBottom: space.xs } }, t('onboarding.needsTitle')),
          React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed } }, t('onboarding.needsSubtitle'))
        ),

        React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.xs + 'px', justifyContent: 'center', marginBottom: space.md } },
          LEBENSZUSTAENDE.map((z) => {
            const on = situations.includes(z.key);
            return React.createElement('button', {
              key: z.key,
              type: 'button',
              onClick: () => toggleSituation(z.key),
              'aria-pressed': on,
              style: {
                padding: '8px 14px', borderRadius: radius.pill || radius.md,
                border: '1px solid ' + (on ? palette.sage + '88' : palette.border + '66'),
                background: on ? palette.sage + '18' : 'transparent',
                color: on ? (palette.sageDeep || palette.text) : palette.mid,
                fontSize: text.sm, fontWeight: on ? weight.medium : weight.normal,
                fontFamily: fontFamily, cursor: 'pointer',
                transition: `background ${duration.normal}ms ${ease}, border-color ${duration.normal}ms ${ease}`,
              },
            }, t('lebenszustaende.' + z.key + '.label'));
          })
        ),

        React.createElement('button', {
          onClick: () => setStep(3),
          style: btnPrimary,
        }, t('common.next') + ' →'),

        React.createElement('button', {
          onClick: () => setStep(3),
          style: { ...btnSecondary, marginTop: space.sm },
        }, t('onboarding.skipForNow'))
      )
    );
  }

  // ─── Step 3: Ready ───────────────────────────────────────
  return React.createElement('div', {
    style: { width: '100vw', height: '100vh', background: palette.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }
  },
    React.createElement('div', { role: 'main', 'aria-label': 'Maloja Plana', style: { ...cardStyle, textAlign: 'center' } },
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
