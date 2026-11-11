import React from 'react';
import { text, space, radius } from '../config/tokens.js';
import { knopfStil } from './PrimaryButton.jsx';

// Die Zeile «Entfernt · <Name>   [Rückgängig]» unter einer Liste. Gestaltung wie bisher in der
// Merkliste: ruhige Fläche, Nebenknopf, keine Farbe, die nach Fehler aussieht.
// Der Rahmen mit role=status steht immer da (auch leer), damit Vorleseprogramme die Meldung
// beim Erscheinen ansagen. `ansagen: false`, wo die Umgebung schon eine Live-Region ist.
//
// Fokus nach «Rückgängig» (WCAG 2.4.3, Entscheid Stebler Studios 11.11.2026): Der Knopf verschwindet mit der
// Meldung, der Fokus fiel damit ins Leere (an den Seitenanfang). Darum steht der Rahmen immer da, ist per
// Skript fokussierbar (tabIndex -1, nicht in der Tab-Reihenfolge) und nimmt den Fokus nach dem Tipp — er
// bleibt so an der Liste, zu der der Eintrag zurückkam.
export const RueckgaengigMeldung = ({ palette, t, entfernt, onRueckgaengig, ansagen = true }) => {
  const rahmen = React.useRef(null);
  const zurueck = () => {
    onRueckgaengig();
    if (rahmen.current && rahmen.current.focus) rahmen.current.focus();
  };
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
    React.createElement('button', { type: 'button', style: knopfStil(palette, 'neben'), onClick: zurueck }, t('common.rueckgaengig'))
  );
  return ansagen
    ? React.createElement('div', { ref: rahmen, tabIndex: -1, role: 'status', 'aria-live': 'polite' }, zeile)
    : React.createElement('div', { ref: rahmen, tabIndex: -1 }, zeile);
};

export default RueckgaengigMeldung;
