import React from 'react';
import { Eyebrow, PageTitle } from './components/Heading.jsx';
import { text, radius, space } from './config/tokens.js';
import { Icon } from './IconSystem.jsx';
import { groupSettingsControls, alsSchalter, zeilenLabelKey } from './settingsGroups.js';
import { DatenLoeschen, letzteSicherungDatum } from './components/DatenLoeschen.jsx';
import { NotificationSettings } from './NotificationSettings.jsx';
import { Schalter } from './components/Schalter.jsx';

// Zentraler Einstellungen-Bereich: bündelt die App-Bedienelemente mit
// beschrifteten Zeilen (zugänglicher als die reinen Icon-Knöpfe in der
// Kopfzeile) und führt zu „Daten bearbeiten / sichern". Die Bedienelemente
// werden als fertige React-Elemente (settingsControls) hereingereicht und
// hier nur beschriftet — eine einzige Quelle der Wahrheit. Gruppierung
// (Anzeige & Sprache / Barrierefreiheit) via settingsGroups.js, geteilt mit
// der Einstellungs-Schublade.
//
// Gruppe C (11.11.2026): An/Aus-Elemente erscheinen hier als Schalter mit Zustandswort
// (Gestaltung A), jeder Kartentitel ist eine Überschrift (a11y C7), und die Sicherung nennt
// ihr letztes Datum (Gestaltung B).

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

  const groups = groupSettingsControls(list);

  // Eine beschriftete Zeile pro Bedienelement (barrierefreier als die reine Icon-Reihe).
  const renderRow = (ctrl, i, rows) => {
    const schalter = alsSchalter(ctrl);
    const labelKey = zeilenLabelKey(ctrl, !!schalter);
    const label = labelKey ? t(labelKey) : ctrl.key;
    return React.createElement('div', {
      key: ctrl.key || i,
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: space.md + 'px', padding: space.xs + 'px 0',
        borderBottom: i === rows.length - 1 ? 'none' : '1px solid ' + palette.border + '55',
      }
    },
      React.createElement('span', { style: { fontSize: text.sm, color: palette.text } }, label),
      schalter
        ? React.createElement(Schalter, { palette, t, an: schalter.an, onChange: schalter.umschalten, label })
        : ctrl
    );
  };

  const titel = (labelKey, id) => React.createElement(Eyebrow, { palette, as: 'h3', id, style: { margin: '0 0 ' + space.xs + 'px 0' } }, t(labelKey));

  const letzte = demoMode ? null : letzteSicherungDatum(t);

  return React.createElement('div', { style: { maxWidth: '640px', margin: '0 auto' } },
    React.createElement(PageTitle, { palette, style: { margin: '0 0 8px 0' } }, t('common.settingsTitle')),
    React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.lg + 'px 0', lineHeight: 1.5 } }, t('common.settingsIntro')),

    // ── Anzeige & Sprache / Barrierefreiheit (geteilte Gruppierung) ──
    ...groups.map(g => React.createElement('section', { key: g.key, 'aria-labelledby': 'einstellungen-' + g.key, style: { ...card, marginBottom: space.md + 'px' } },
      titel(g.labelKey, 'einstellungen-' + g.key),
      ...g.controls.map((ctrl, i) => renderRow(ctrl, i, g.controls))
    )),

    // ── Benachrichtigungen (seit 05.11.2026 hier statt eigener Seite, Seitenlandkarte Z2) ──
    React.createElement(NotificationSettings, { palette, t }),

    // ── Daten & Sicherung ──
    React.createElement('section', { 'aria-labelledby': 'einstellungen-daten', style: card },
      titel('common.settingsData', 'einstellungen-daten'),
      React.createElement('button', { onClick: onEditBasis, style: actionBtn },
        React.createElement(Icon, { name: 'edit', size: 16, color: palette.mid }),
        React.createElement('span', null, t('common.editPersonalData'))
      ),
      React.createElement('button', { onClick: onExport, style: actionBtn },
        React.createElement(Icon, { name: 'sicherung', size: 16, color: palette.mid }),
        React.createElement('span', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } },
          React.createElement('span', null, t('common.sicherungAnlegen')),
          React.createElement('span', { style: { fontSize: text.xs, color: palette.mid } },
            letzte ? t('datenLoeschen.letzteSicherung', { datum: letzte }) : t('datenLoeschen.keineSicherung'))
        )
      )
    ),

    // ── E18 · Alle Daten auf diesem Gerät löschen (eigene Karte, ruhig am Ende) ──
    React.createElement(DatenLoeschen, { palette, t, demoMode, onExport })
  );
};

export default SettingsView;
