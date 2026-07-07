import React, { useState, useEffect } from 'react';
import {
  getNotificationPermission,
  requestNotificationPermission,
  getNotificationPrefs,
  saveNotificationPrefs,
} from './utils/notifications.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, radius , space, fontFamily, ease, duration } from './config/tokens.js';
import { PrimaryButton } from './components/PrimaryButton.jsx';

// ─── Notification Settings ─────────────────────────────────
// Respectful, opt-in notification management.
// No tracking, no analytics, no external services.
// User controls everything.

export const NotificationSettings = ({ palette, t }) => {
  const [permission, setPermission] = useState(getNotificationPermission());
  const [prefs, setPrefs] = useState(getNotificationPrefs);
  const [saved, setSaved] = useState(false);

  const isSupported = permission !== 'unsupported';
  const isGranted = permission === 'granted';
  const isDenied = permission === 'denied';

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
  };

  const togglePref = (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    saveNotificationPrefs(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleStyle = (enabled) => ({
    width: '44px', height: '24px', borderRadius: radius.md,
    background: enabled ? palette.sage : palette.up,
    border: '1px solid ' + (enabled ? palette.sage : palette.border),
    cursor: 'pointer', position: 'relative',
    transition: `all ${duration.normal}ms ${ease}`, flexShrink: 0,
  });

  const toggleDot = (enabled) => ({
    width: '16px', height: '16px', borderRadius: '50%',
    background: enabled ? '#fff' : palette.mid,
    position: 'absolute', top: '2px',
    left: enabled ? '22px' : '2px',
    transition: `all ${duration.normal}ms ${ease}`,
  });

  const renderToggle = (key, label, description) => {
    const enabled = prefs[key] !== false; // default on
    return React.createElement('div', {
      key: key,
      style: {
        display: 'flex', alignItems: 'start', gap: '12px',
        padding: '14px 0', borderBottom: '1px solid ' + palette.border,
      }
    },
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '2px' } }, label),
        React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: 1.4 } }, description)
      ),
      React.createElement('button', {
        onClick: () => togglePref(key),
        disabled: !isGranted,
        'aria-label': label + (enabled ? ' on' : ' off'),
        style: {
          ...toggleStyle(enabled && isGranted),
          opacity: isGranted ? 1 : 0.4,
          cursor: isGranted ? 'pointer' : 'not-allowed',
          border: 'none',
        }
      },
        React.createElement('div', { style: toggleDot(enabled && isGranted) })
      )
    );
  };

  return React.createElement('div', {
    style: { background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border }
  },
    React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } },
      React.createElement(Icon, { name: 'cowbell', size: 20 }), t('notifications.title')
    ),

    // Permission status
    React.createElement('div', {
      style: {
        padding: space.md, borderRadius: radius.sm, marginBottom: space.md,
        background: isGranted ? palette.sage + '11' : palette.up,
        border: '1px solid ' + (isGranted ? palette.sage + '33' : palette.border),
      }
    },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: space.sm } },
        React.createElement('div', {
          style: {
            width: '10px', height: '10px', borderRadius: '50%',
            background: isGranted ? palette.sage : isDenied ? palette.rose : palette.gold,
          }
        }),
        React.createElement('span', { style: { fontSize: text.sm, fontWeight: weight.semi } },
          isGranted ? t('notifications.enabled') :
          isDenied ? t('notifications.blocked') :
          !isSupported ? t('notifications.notSupported') :
          t('notifications.notEnabled')
        )
      ),

      !isGranted && isSupported && !isDenied && React.createElement(PrimaryButton, {
        palette, onClick: handleRequestPermission,
      }, t('notifications.enable')),

      isDenied && React.createElement('p', {
        style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs }
      }, t('notifications.blockedHint'))
    ),

    // Notification types
    React.createElement('div', { style: { marginBottom: space.md } },
      React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.mid, marginBottom: space.xs, textTransform: 'uppercase' } },
        t('notifications.categories')
      ),

      renderToggle('overdueReminders',
        t('notifications.overdueReminders'),
        t('notifications.overdueRemindersDesc')
      ),
      renderToggle('documentExpiry',
        t('notifications.documentExpiry'),
        t('notifications.documentExpiryDesc')
      ),
      renderToggle('healthReminders',
        t('notifications.healthReminders'),
        t('notifications.healthRemindersDesc')
      ),
      renderToggle('adminDeadlines',
        t('notifications.adminDeadlines'),
        t('notifications.adminDeadlinesDesc')
      )
    ),

    // Privacy note
    React.createElement('div', {
      style: { padding: '12px', background: palette.up, borderRadius: radius.sm, fontSize: text.sm, color: palette.mid }
    },
      'ⓘ ' + t('notifications.privacyNote')
    ),

    saved && React.createElement('div', {
      style: { marginTop: '12px', padding: space.sm, background: palette.sage + '22', borderRadius: radius.sm, fontSize: text.sm, color: palette.sage, textAlign: 'center' }
    }, '✓ ' + t('common.saved'))
  );
};

export default NotificationSettings;
