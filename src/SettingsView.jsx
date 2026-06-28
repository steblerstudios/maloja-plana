import React from 'react';
import { text, weight, radius, space } from './config/tokens.js';
import { Icon } from './IconSystem.jsx';

// Zentraler Einstellungen-Bereich: bündelt die App-Bedienelemente mit
// beschrifteten Zeilen (zugänglicher als die reinen Icon-Knöpfe in der
// Kopfzeile) und führt zu „Daten bearbeiten / sichern". Die Bedienelemente
// werden als fertige React-Elemente (settingsControls) hereingereicht und
// hier nur beschriftet — eine einzige Quelle der Wahrheit.

const CONTROL_LABELS = {
  voice: 'vorlesen.toggle',
  readable: 'common.readable',
  anrede: 'common.settingsAnrede',
  lang: 'common.selectLanguage',
  theme: 'common.settingsTheme',
  simpleview: 'common.simpleView',
};

export const SettingsView = ({ palette, t, controls, onEditBasis, onExport }) => {
  const card = { background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.md, padding: space.lg + 'px' };
  const list = (controls || []).filter(Boolean);
  const actionBtn = {
    display: 'flex', alignItems: 'center', gap: space.sm + 'px', width: '100%',
    padding: space.sm + 'px ' + space.md + 'px', marginTop: space.sm + 'px',
    background: 'transparent', color: palette.text, textAlign: 'start',
    border: '1px solid ' + palette.border, borderRadius: radius.sm,
    cursor: 'pointer', fontSize: text.sm, fontFamily: 'inherit',
  };

  return React.createElement('div', { style: { maxWidth: '640px', margin: '0 auto' } },
    React.createElement('h2', { style: { fontSize: text.xl, fontWeight: weight.semi, margin: '0 0 6px 0', color: palette.text } }, t('common.settingsTitle')),
    React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.lg + 'px 0', lineHeight: 1.5 } }, t('common.settingsIntro')),

    // ── Anzeige & Sprache ──
    React.createElement('section', { style: { ...card, marginBottom: space.md + 'px' } },
      React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, margin: '0 0 ' + space.xs + 'px 0', color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px' } }, t('nav.settings')),
      ...list.map((ctrl, i) => {
        const labelKey = CONTROL_LABELS[ctrl.key];
        const label = labelKey ? t(labelKey) : ctrl.key;
        return React.createElement('div', {
          key: ctrl.key || i,
          style: {
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: space.md + 'px', padding: space.sm + 'px 0',
            borderBottom: i === list.length - 1 ? 'none' : '1px solid ' + palette.border + '55',
          }
        },
          React.createElement('span', { style: { fontSize: text.sm, color: palette.text } }, label),
          ctrl
        );
      })
    ),

    // ── Daten & Sicherung ──
    React.createElement('section', { style: card },
      React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, margin: '0 0 ' + space.xs + 'px 0', color: palette.mid, textTransform: 'uppercase', letterSpacing: '0.5px' } }, t('common.settingsData')),
      React.createElement('button', { onClick: onEditBasis, style: actionBtn },
        React.createElement(Icon, { name: 'edit', size: 16, color: palette.mid }),
        React.createElement('span', null, t('common.editPersonalData'))
      ),
      React.createElement('button', { onClick: onExport, style: actionBtn },
        React.createElement(Icon, { name: 'download', size: 16, color: palette.mid }),
        React.createElement('span', null, t('nav.export'))
      )
    )
  );
};

export default SettingsView;
