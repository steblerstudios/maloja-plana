import React from 'react';
import { text, space, radius } from '../config/tokens.js';
import { knopfStil } from './PrimaryButton.jsx';

// Die Zeile «Entfernt · <Name>   [Rückgängig]» unter einer Liste. Gestaltung wie bisher in der
// Merkliste: ruhige Fläche, Nebenknopf, keine Farbe, die nach Fehler aussieht.
// Der Rahmen mit role=status steht immer da (auch leer), damit Vorleseprogramme die Meldung
// beim Erscheinen ansagen. `ansagen: false`, wo die Umgebung schon eine Live-Region ist.
export const RueckgaengigMeldung = ({ palette, t, entfernt, onRueckgaengig, ansagen = true }) => {
  const zeile = entfernt && React.createElement('div', {
    'data-rueckgaengig': 'true',
    style: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px',
      marginTop: space.md + 'px', padding: space.sm + 'px ' + space.md + 'px',
      background: palette.up, border: '1px solid ' + palette.border, borderRadius: radius.md + 'px',
      fontSize: text.sm, color: palette.text,
    },
  },
    React.createElement('span', { style: { minWidth: 0, color: palette.text, overflowWrap: 'anywhere' } },
      t('common.entfernt') + (entfernt.text ? ' · ' + entfernt.text : '')),
    React.createElement('button', { type: 'button', style: knopfStil(palette, 'neben'), onClick: onRueckgaengig }, t('common.rueckgaengig'))
  );
  return ansagen
    ? React.createElement('div', { role: 'status', 'aria-live': 'polite' }, zeile)
    : (zeile || null);
};

export default RueckgaengigMeldung;
