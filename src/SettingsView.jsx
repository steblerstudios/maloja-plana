import React from 'react';
import { Eyebrow, PageTitle } from './components/Heading.jsx';
import { text, radius, space } from './config/tokens.js';
import { Icon } from './IconSystem.jsx';
import { CONTROL_LABELS, groupSettingsControls } from './settingsGroups.js';
import { DatenLoeschen } from './components/DatenLoeschen.jsx';
import { NotificationSettings } from './NotificationSettings.jsx';
import { KNOPF_RADIUS } from './components/PrimaryButton.jsx';

// Zentraler Einstellungen-Bereich: bündelt die App-Bedienelemente mit
// beschrifteten Zeilen (zugänglicher als die reinen Icon-Knöpfe in der
// Kopfzeile) und führt zu „Daten bearbeiten / sichern". Die Bedienelemente
// werden als fertige React-Elemente (settingsControls) hereingereicht und
// hier nur beschriftet — eine einzige Quelle der Wahrheit. Gruppierung
// (Anzeige & Sprache / Barrierefreiheit) via settingsGroups.js, geteilt mit
// der Einstellungs-Schublade.

export const SettingsView = ({ palette, t, controls, onEditBasis, onExport, demoMode }) => {
  const card = { background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.lg, padding: space.lg + 'px' };
  const list = (controls || []).filter(Boolean);
  const actionBtn = {
    display: 'flex', alignItems: 'center', gap: space.sm + 'px', width: '100%', minHeight: '44px',
    padding: space.sm + 'px ' + space.md + 'px', marginTop: space.sm + 'px',
    background: 'transparent', color: palette.text, textAlign: 'start',
    border: '1px solid ' + palette.border, borderRadius: radius.md,
    cursor: 'pointer', fontSize: text.sm, fontFamily: 'inherit',
  };

  // «/» öffnet die Suche — abschaltbar (WCAG 2.1.4, Entscheid Stebler Studios 11.11.2026). Steht nur hier und nicht
  // in der Schublade: deren Knöpfe kommen aus main.jsx, und das Startbündel hat keinen Platz mehr. Wer am Gerät
  // eine Tastatur hat, findet die Seite. Gleiches Aussehen wie die übrigen Schalter (main.jsx `ctrlBtn`).
  // Schlüssel und Regel wie `slashAn`/`slashSetzen` in utils/suchTaste.js (suchTaste.test.js hält beide gleich).
  // Bewusst nicht importiert: der Import setzte suchTaste.js auf die Vorlade-Liste im Startbündel.
  const [slash, setSlash] = React.useState(() => { try { return localStorage.getItem('or5_suchtaste') !== '0'; } catch { return true; } });
  const slashKnopf = React.createElement('button', {
    key: 'slashsearch', type: 'button',
    'aria-label': t('search.tasteSchalter'), 'aria-pressed': slash, title: t('search.tasteSchalter'),
    onClick: () => setSlash((an) => { try { localStorage.setItem('or5_suchtaste', an ? '0' : '1'); } catch { /* ohne Speicher */ } return !an; }),
    style: {
      padding: '8px 8px', minHeight: '44px', minWidth: '44px', lineHeight: 1,
      background: slash ? palette.sand + '30' : 'transparent',
      color: slash ? palette.text : palette.mid,
      border: '1px solid ' + (slash ? palette.sand : palette.border),
      borderRadius: KNOPF_RADIUS, cursor: 'pointer', fontSize: text.sm, fontFamily: 'inherit',
    },
  }, React.createElement('span', { 'aria-hidden': 'true' }, '/'));

  const groups = groupSettingsControls(list)
    .map((g) => (g.key === 'a11y' ? { ...g, controls: [...g.controls, slashKnopf] } : g));
  const EIGENE_LABELS = { slashsearch: 'search.tasteSchalter' };

  // Eine beschriftete Zeile pro Bedienelement (barrierefreier als die reine Icon-Reihe).
  const renderRow = (ctrl, i, rows) => {
    const labelKey = CONTROL_LABELS[ctrl.key] || EIGENE_LABELS[ctrl.key];
    const label = labelKey ? t(labelKey) : ctrl.key;
    return React.createElement('div', {
      key: ctrl.key || i,
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: space.md + 'px', padding: space.sm + 'px 0',
        borderBottom: i === rows.length - 1 ? 'none' : '1px solid ' + palette.border + '55',
      }
    },
      React.createElement('span', { style: { fontSize: text.sm, color: palette.text } }, label),
      ctrl
    );
  };

  const sectionHeading = (labelKey) => React.createElement(Eyebrow, { palette, style: { margin: '0 0 ' + space.xs + 'px 0' } }, t(labelKey));

  return React.createElement('div', { style: { maxWidth: '640px', margin: '0 auto' } },
    React.createElement(PageTitle, { palette, style: { margin: '0 0 8px 0' } }, t('common.settingsTitle')),
    React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.lg + 'px 0', lineHeight: 1.5 } }, t('common.settingsIntro')),

    // ── Anzeige & Sprache / Barrierefreiheit (geteilte Gruppierung) ──
    ...groups.map(g => React.createElement('section', { key: g.key, style: { ...card, marginBottom: space.md + 'px' } },
      sectionHeading(g.labelKey),
      ...g.controls.map((ctrl, i) => renderRow(ctrl, i, g.controls))
    )),

    // ── Benachrichtigungen (seit 05.11.2026 hier statt eigener Seite, Seitenlandkarte Z2) ──
    React.createElement(NotificationSettings, { palette, t }),

    // ── Daten & Sicherung ──
    React.createElement('section', { style: card },
      React.createElement(Eyebrow, { palette, style: { color: palette.mid, margin: '0 0 ' + space.xs + 'px 0' } }, t('common.settingsData')),
      React.createElement('button', { onClick: onEditBasis, style: actionBtn },
        React.createElement(Icon, { name: 'edit', size: 16, color: palette.mid }),
        React.createElement('span', null, t('common.editPersonalData'))
      ),
      React.createElement('button', { onClick: onExport, style: actionBtn },
        React.createElement(Icon, { name: 'sicherung', size: 16, color: palette.mid }),
        React.createElement('span', null, t('nav.export'))
      )
    ),

    // ── E18 · Alle Daten auf diesem Gerät löschen (eigene Karte, ruhig am Ende) ──
    React.createElement(DatenLoeschen, { palette, t, demoMode, onExport })
  );
};

export default SettingsView;
