import React, { useState } from 'react';
import { text, weight, radius, leading, space } from './config/tokens.js';
import { TrustLockIcon } from './components/TrustLockIcon.jsx';
import { PrimaryButton } from './components/PrimaryButton.jsx';

// ─── Tresor-LockScreen (At-Rest-Entsperrwand) ───────────────────────────────
// Die ruhige „Schloss auf deinen Unterlagen"-Wand: erscheint beim App-Start, wenn
// der Tresor aktiv ist (secureStore.isTresorActive()). Spec: docs/design/tresor-lock.md.
//
// BEWUSST ENTKOPPELT: Diese Komponente kennt weder secureStore noch main.jsx-State.
// Sie bekommt `onUnlock(passphrase)` (async, wirft bei Fehler) und ruft es auf. Die
// echte Verdrahtung (unlockTresor → App-State) ist Phase 2b-UI — hier nur die Wand.
//
// Modelliert auf BetaGate.jsx (gleiche Karten-/a11y-Sprache): zentrierte Karte,
// Logo, ruhige Erklärung, Eingabe, Fehler als role=alert, „Einfache Ansicht" +
// Rechtliches ohne Passphrase erreichbar (Spec: Vertrauen/Transparenz vor der Hürde).
export const LockScreen = ({ palette, t, onUnlock, onLegal }) => {
  const [input, setInput] = useState('');
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'unlocking' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [simpleView, setSimpleView] = useState(() => {
    try { return localStorage.getItem('or5_simpleView') === '1'; } catch { return false; }
  });

  const toggleSimpleView = () => setSimpleView((v) => {
    const next = !v;
    try { localStorage.setItem('or5_simpleView', next ? '1' : '0'); if (next) localStorage.setItem('or5_vorlesen', '1'); } catch {}
    return next;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input || status === 'unlocking') return;
    setStatus('unlocking');
    setErrorMsg('');
    try {
      await onUnlock(input);
      // Erfolg: der Aufrufer wechselt den View — hier nichts weiter zu tun.
    } catch (err) {
      // Beschädigter Datensatz vs. falsche Passphrase freundlich unterscheiden.
      const corrupted = /beschädigt|ungültig|corrupt/i.test(err && err.message ? err.message : '');
      setErrorMsg(corrupted ? t('tresorLock.corrupted') : t('tresorLock.wrong'));
      setStatus('error');
      setInput('');
    }
  };

  const busy = status === 'unlocking';
  const isError = status === 'error';

  return React.createElement('div', {
    role: 'main', 'aria-label': 'Maloja Plana',
    style: {
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: palette.bg, fontFamily: 'inherit', padding: space.md + 'px',
    },
  },
    React.createElement('form', {
      onSubmit: handleSubmit,
      style: {
        background: palette.surface, padding: '40px', borderRadius: radius.md,
        border: '1px solid ' + palette.border, maxWidth: '360px', width: '100%', textAlign: 'center',
      },
    },
      // Logo (identisch zu BetaGate — vertraute Wand).
      React.createElement('h1', {
        'aria-label': 'Maloja Plana',
        style: { fontSize: text.xl, fontWeight: weight.bold, margin: '0 0 ' + space.sm + 'px', color: palette.text, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '2px' },
      },
        React.createElement('svg', { width: '20', height: '23', viewBox: '0 0 20 22', fill: 'none', 'aria-hidden': 'true', style: { display: 'block', flexShrink: 0 } },
          React.createElement('polyline', { points: '2,19 6.5,4 10,11 13.5,2 18,19', fill: 'none', stroke: palette.text, strokeWidth: '2.8', strokeLinejoin: 'round', strokeLinecap: 'round' }),
          React.createElement('circle', { cx: '13.5', cy: '2.4', r: '1.9', fill: palette.gold })
        ),
        'aloja Plana'
      ),

      // Schloss-Zeile + Titel
      React.createElement('div', {
        style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: space.sm + 'px 0 ' + space.xs + 'px' },
      },
        React.createElement(TrustLockIcon, { size: 18, color: palette.sageDeep }),
        React.createElement('h2', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, margin: 0 } }, t('tresorLock.title'))
      ),
      React.createElement('p', {
        style: { fontSize: text.sm, color: palette.mid, marginBottom: space.lg, lineHeight: leading.normal },
      }, t('tresorLock.intro')),

      // Passphrase-Eingabe (verdeckt, mit Anzeigen/Verbergen-Umschalter)
      React.createElement('label', {
        htmlFor: 'tresor-pass', style: { display: 'block', textAlign: 'left', fontSize: text.sm, color: palette.mid, marginBottom: '4px' },
      }, t('tresorLock.passphraseLabel')),
      React.createElement('div', { style: { position: 'relative' } },
        React.createElement('input', {
          id: 'tresor-pass', type: show ? 'text' : 'password', value: input,
          onChange: (e) => { setInput(e.target.value); if (isError) setStatus('idle'); },
          placeholder: t('tresorLock.passphrasePlaceholder'), 'aria-label': t('tresorLock.passphraseLabel'),
          autoFocus: true, autoComplete: 'off', disabled: busy,
          'aria-invalid': isError ? 'true' : undefined,
          'aria-describedby': isError ? 'tresor-error' : undefined,
          style: {
            width: '100%', padding: '10px 44px 10px 14px', fontSize: text.body,
            border: '1px solid ' + (isError ? palette.rose : palette.border),
            borderRadius: radius.sm, background: palette.up, color: palette.text,
            outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
          },
        }),
        React.createElement('button', {
          type: 'button', onClick: () => setShow((v) => !v),
          'aria-pressed': show, title: show ? t('tresorLock.hidePassphrase') : t('tresorLock.showPassphrase'),
          'aria-label': show ? t('tresorLock.hidePassphrase') : t('tresorLock.showPassphrase'),
          style: {
            position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', padding: '6px',
            color: palette.mid, fontFamily: 'inherit', fontSize: text.xs, lineHeight: 1,
          },
        }, show ? t('tresorLock.hidePassphrase') : t('tresorLock.showPassphrase'))
      ),

      isError && React.createElement('p', {
        id: 'tresor-error', role: 'alert',
        style: { fontSize: text.sm, color: palette.roseDeep, marginTop: space.sm, textAlign: 'left' },
      }, errorMsg),

      React.createElement(PrimaryButton, {
        palette, type: 'submit', disabled: busy || !input,
        style: { marginTop: space.md, width: '100%', padding: '10px', fontSize: text.body },
      }, busy ? t('tresorLock.unlocking') : t('tresorLock.unlock')),

      // Ehrlich & ruhig: keine Passwort-Zurücksetzung (Spec §3, kein Angst-UX).
      React.createElement('p', {
        style: { fontSize: text.xs, color: palette.soft, marginTop: space.md, lineHeight: leading.normal },
      }, t('tresorLock.noReset')),

      // „Einfache Ansicht" + Rechtliches ohne Passphrase erreichbar (Spec).
      React.createElement('button', {
        type: 'button', onClick: toggleSimpleView, 'aria-pressed': simpleView, title: t('common.simpleView'),
        style: {
          marginTop: space.md, width: '100%', padding: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: simpleView ? palette.sand + '30' : 'transparent',
          color: simpleView ? palette.text : palette.mid,
          border: '1px solid ' + (simpleView ? palette.sand : palette.border),
          borderRadius: radius.sm, cursor: 'pointer', fontFamily: 'inherit',
          fontSize: text.sm, fontWeight: weight.medium,
        },
      },
        React.createElement('svg', { width: '18', height: '18', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinejoin: 'round', 'aria-hidden': 'true' },
          React.createElement('rect', { x: '3', y: '3', width: '8', height: '8', rx: '2' }),
          React.createElement('rect', { x: '13', y: '3', width: '8', height: '8', rx: '2' }),
          React.createElement('rect', { x: '3', y: '13', width: '8', height: '8', rx: '2' }),
          React.createElement('rect', { x: '13', y: '13', width: '8', height: '8', rx: '2' })
        ),
        t('common.simpleView')
      ),
      onLegal && React.createElement('button', {
        type: 'button', onClick: onLegal,
        style: {
          marginTop: space.md, background: 'none', border: 'none', cursor: 'pointer',
          color: palette.mid, fontSize: text.xs, fontFamily: 'inherit', textDecoration: 'underline', padding: '4px',
        },
      }, t('beta.legalLink'))
    )
  );
};

export default LockScreen;
