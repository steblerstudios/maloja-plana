import React, { useState, useEffect, useRef } from 'react';
import { text, weight, ease, duration } from './config/tokens.js';
import { hinweisZeichen } from './IconKern.jsx';

export const AutoSaveStatus = ({ palette, t, lastSave, isSaving, saveError, fremdGeaendert }) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Speicherfehler bleibt sichtbar, bis er behoben ist — nie still verschwinden.
    // K116: ebenso «in einem anderen Fenster geändert» — bis neu geladen wird.
    if (saveError || fremdGeaendert) { setVisible(true); clearTimeout(timerRef.current); return; }
    if (!lastSave && !isSaving) return;
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(timerRef.current);
  }, [lastSave, isSaving, saveError, fremdGeaendert]);

  return React.createElement('div', {
    'aria-live': 'polite',
    'aria-atomic': 'true',
    style: {
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      padding: '6px 12px',
      borderRadius: '4px',
      fontSize: text.sm,
      fontWeight: weight.medium,
      color: saveError ? (palette.roseDeep || palette.rose) : palette.mid,
      background: saveError ? (palette.roseDeep || palette.rose) + '12' : (fremdGeaendert ? palette.surface : 'transparent'),
      maxWidth: '380px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      zIndex: 100,
      opacity: visible ? 1 : 0,
      transition: `opacity ${duration.slow}ms ${ease}`,
      pointerEvents: saveError || fremdGeaendert ? 'auto' : 'none',
    }
  },
    React.createElement('span', {
      style: { fontSize: text.sm, color: saveError ? (palette.roseDeep || palette.rose) : (palette.sageDeep || palette.sage) }
    }, saveError ? hinweisZeichen('warning', 12) : fremdGeaendert ? hinweisZeichen('info', 12) : (isSaving ? '...' : hinweisZeichen('check', 12))),
    fremdGeaendert ? React.createElement('span', null, t('common.fremdGeaendert'), ' ',
      // Ruhig, kein Rot: nichts ist kaputt, es fehlt nur der eine Handgriff.
      React.createElement('button', {
        type: 'button', onClick: () => location.reload(),
        style: { background: 'none', border: 0, padding: 0, font: 'inherit', color: palette.text, textDecoration: 'underline', cursor: 'pointer' },
      }, t('error.reload'))
    ) : React.createElement('span', null,
      saveError ? t('common.saveError') : (isSaving ? t('common.saving') : t('common.saved'))
    )
  );
};

export default AutoSaveStatus;
