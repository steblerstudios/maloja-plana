import React, { useState, useEffect, useRef } from 'react';
import { text, weight, ease, duration } from './config/tokens.js';

export const AutoSaveStatus = ({ palette, t, lastSave, isSaving, saveError }) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Speicherfehler bleibt sichtbar, bis er behoben ist — nie still verschwinden.
    if (saveError) { setVisible(true); clearTimeout(timerRef.current); return; }
    if (!lastSave && !isSaving) return;
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(timerRef.current);
  }, [lastSave, isSaving, saveError]);

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
      background: saveError ? (palette.roseDeep || palette.rose) + '12' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      zIndex: 100,
      opacity: visible ? 1 : 0,
      transition: `opacity ${duration.slow}ms ${ease}`,
      pointerEvents: saveError ? 'auto' : 'none',
    }
  },
    React.createElement('span', {
      style: { fontSize: text.sm, color: saveError ? (palette.roseDeep || palette.rose) : palette.sage }
    }, saveError ? '⚠' : (isSaving ? '...' : '✓')),
    React.createElement('span', null,
      saveError ? t('common.saveError') : (isSaving ? t('common.saving') : t('common.saved'))
    )
  );
};

export default AutoSaveStatus;
