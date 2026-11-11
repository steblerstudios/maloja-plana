import React, { useState, useRef, useEffect } from 'react';
import { Eyebrow } from './components/Heading.jsx';
import {
  getNotificationPermission,
  requestNotificationPermission,
  getNotificationPrefs,
  saveNotificationPrefs,
} from './utils/notifications.js';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, radius, space } from './config/tokens.js';
import { PrimaryButton } from './components/PrimaryButton.jsx';
import { Schalter } from './components/Schalter.jsx';

// ─── Notification Settings ─────────────────────────────────
// Respectful, opt-in notification management.
// No tracking, no analytics, no external services.
// User controls everything.
//
// Seit 05.11.2026 (Seitenlandkarte Z2) ein Abschnitt der Einstellungen (SettingsView.jsx), keine eigene
// Seite mehr. `#/notifications` → UMLEITUNGEN → Einstellungen, Sprungmarke BENACHRICHTIGUNGEN_ANKER.
//
// Gruppe C, L1 + Gestaltung B (11.11.2026): Hier standen vier Schalter (überfällige Erinnerungen,
// Dokumentenablauf 30 Tage vorher, Gesundheit, Fristen bei Ämtern). Gebaut ist nur die erste Art:
// `checkOverdueReminders` beim Öffnen der App. Die drei anderen versprachen Meldungen, die nie kamen
// (Fristen verpasst, wer sich darauf verlässt). Jetzt: ein Schalter, der wirkt, und ein Satz, was er
// tut und was nicht. Wächter: gruppeCVertrauen.test.js (jeder Schalter hier hat einen Leser).
export const BENACHRICHTIGUNGEN_ANKER = 'mp-benachrichtigungen';
// Die eine gebaute Art. Der Schlüssel bleibt, damit gespeicherte Einstellungen gelten.
export const BENACHRICHTIGUNG_ARTEN = ['overdueReminders'];

export const NotificationSettings = ({ palette, t }) => {
  const [permission, setPermission] = useState(getNotificationPermission());
  const [prefs, setPrefs] = useState(getNotificationPrefs);
  const statusRef = useRef(null);
  const nachErlaubnis = useRef(false);

  const isSupported = permission !== 'unsupported';
  const isGranted = permission === 'granted';
  const isDenied = permission === 'denied';

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    nachErlaubnis.current = true;
    setPermission(result);
  };

  // Nach der Antwort des Browsers verschwindet der Knopf: Fokus auf die Statuszeile, damit er nicht
  // auf den Seitenanfang fällt (a11y C5).
  useEffect(() => {
    if (nachErlaubnis.current && statusRef.current) { statusRef.current.focus(); nachErlaubnis.current = false; }
  }, [permission]);

  const ueberfaelligAn = prefs.overdueReminders !== false; // Voreinstellung an
  const setUeberfaellig = (an) => {
    const updated = { ...prefs, overdueReminders: an };
    setPrefs(updated);
    saveNotificationPrefs(updated);
  };

  const statusText = isGranted ? t('notifications.enabled')
    : isDenied ? t('notifications.blocked')
    : !isSupported ? t('notifications.notSupported')
    : t('notifications.notEnabled');

  // Gleiche Karte wie die übrigen Abschnitte der Einstellungen; Überschrift eine Stufe unter dem Seitentitel.
  return React.createElement('section', {
    id: BENACHRICHTIGUNGEN_ANKER,
    'aria-labelledby': BENACHRICHTIGUNGEN_ANKER + '-titel',
    style: { background: palette.surface, padding: space.lg + 'px', borderRadius: radius.lg, border: '1px solid ' + palette.border, marginBottom: space.md + 'px', color: palette.text, scrollMarginTop: '80px' }
  },
    React.createElement(Eyebrow, { palette, as: 'h3', id: BENACHRICHTIGUNGEN_ANKER + '-titel', style: { display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 ' + space.sm + 'px 0' } },
      React.createElement(Icon, { name: 'cowbell', size: 16, color: palette.mid }),
      t('notifications.title')),

    // Was gebaut ist — und was nicht (L1). Steht immer da, auch vor der Erlaubnis.
    React.createElement('p', { id: BENACHRICHTIGUNGEN_ANKER + '-was', style: { fontSize: text.sm, color: palette.text, lineHeight: 1.5, margin: '0 0 ' + space.md + 'px 0' } },
      t('notifications.nurBeimOeffnen')),

    isGranted
      // Erlaubt: nur noch der eine Schalter (B). Zustand als Wort, role="switch".
      ? React.createElement('div', {
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.md + 'px', padding: space.xs + 'px 0', borderTop: '1px solid ' + palette.border + '55', borderBottom: '1px solid ' + palette.border + '55' },
      },
        React.createElement('span', { style: { fontSize: text.sm, color: palette.text } }, t('notifications.overdueReminders')),
        React.createElement(Schalter, { palette, t, an: ueberfaelligAn, onChange: setUeberfaellig, label: t('notifications.overdueReminders'), beschreibungId: BENACHRICHTIGUNGEN_ANKER + '-was' })
      )
      // Noch nicht erlaubt, blockiert oder nicht möglich: eine ruhige Statuszeile mit Wort, kein leerer Schalter.
      : React.createElement('div', {
        style: { padding: space.md + 'px', borderRadius: radius.md, background: palette.up, border: '1px solid ' + palette.border },
      },
        React.createElement('div', {
          ref: statusRef, tabIndex: -1, role: 'status',
          style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text, outline: 'none' },
        },
          React.createElement('span', { 'aria-hidden': 'true', style: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0, background: isDenied ? palette.rose : palette.sky } }),
          statusText
        ),
        !isDenied && isSupported && React.createElement('div', { style: { marginTop: space.sm + 'px' } },
          React.createElement(PrimaryButton, { palette, onClick: handleRequestPermission }, t('notifications.enable'))),
        isDenied && React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: space.xs + 'px 0 0 0' } }, t('notifications.blockedHint'))
      ),

    // Datenschutz einmal, klein (B).
    React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: space.md + 'px 0 0 0', lineHeight: 1.5 } },
      hinweisZeichen(), ' ', t('notifications.privacyNote'))
  );
};

export default NotificationSettings;
