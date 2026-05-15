import React, { useState, useEffect } from 'react';
import { getStorageStatus } from './utils/storageMonitor.js';

// ─── Storage Warning Banner ─────────────────────────────────
// Shows a calm, non-intrusive banner when localStorage usage
// approaches limits. Dismissible. Checks every 30 seconds.
// Only renders when level is 'warning' or 'critical'.

export const StorageWarning = ({ palette, t }) => {
  const [status, setStatus] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check immediately on mount
    setStatus(getStorageStatus());

    // Re-check every 30 seconds
    const interval = setInterval(() => {
      setStatus(getStorageStatus());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Don't render if no warning, dismissed, or still loading
  if (!status || status.level === 'ok' || dismissed) {
    return null;
  }

  const isCritical = status.level === 'critical';

  return React.createElement('div', {
    role: 'alert',
    style: {
      padding: '12px 16px',
      margin: '0 0 16px 0',
      borderRadius: '8px',
      background: isCritical
        ? palette.rose + '18'
        : palette.gold + '18',
      border: '1px solid ' + (isCritical ? palette.rose + '40' : palette.gold + '40'),
      display: 'flex',
      alignItems: 'start',
      gap: '10px',
      fontSize: '12px',
      lineHeight: 1.5,
    }
  },
    React.createElement('span', {
      style: { fontSize: '14px', flexShrink: 0, marginTop: '1px' }
    }, isCritical ? '◈' : '○'),

    React.createElement('div', { style: { flex: 1 } },
      React.createElement('div', {
        style: { fontWeight: '600', marginBottom: '2px' }
      }, t('storage.warningTitle')),
      React.createElement('div', {
        style: { color: palette.mid }
      }, t('storage.warningMessage', {
        percent: status.percent,
        usedKB: status.usedKB,
        limitKB: status.limitKB,
      })),
      status.largestKey && React.createElement('div', {
        style: { color: palette.mid, marginTop: '4px', fontSize: '11px' }
      }, t('storage.largestKey', {
        key: status.largestKey.replace('or5_', ''),
        size: status.largestKeyKB,
      }))
    ),

    React.createElement('button', {
      onClick: () => setDismissed(true),
      'aria-label': t('common.close'),
      style: {
        background: 'none',
        border: 'none',
        color: palette.mid,
        cursor: 'pointer',
        fontSize: '14px',
        padding: '0 4px',
        flexShrink: 0,
      }
    }, '✕')
  );
};

export default StorageWarning;
