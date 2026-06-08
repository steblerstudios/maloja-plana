import React, { useState, useEffect, useRef } from 'react';
import { text } from './config/tokens.js';

export const AutoSaveStatus = ({ palette, t, lastSave, isSaving }) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!lastSave && !isSaving) return;
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(timerRef.current);
  }, [lastSave, isSaving]);

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
      fontWeight: '500',
      color: palette.mid,
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      zIndex: 100,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.4s ease',
      pointerEvents: 'none',
    }
  },
    React.createElement('span', {
      style: { fontSize: text.sm, color: palette.sage }
    }, isSaving ? '...' : '✓'),
    React.createElement('span', null,
      isSaving ? t('common.saving') : t('common.saved')
    )
  );
};

export default AutoSaveStatus;
