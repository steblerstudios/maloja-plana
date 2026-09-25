import React from 'react';
import { text, weight, space } from '../config/tokens.js';
import { stufen } from '../config/brotkrumePfade.js';

export { PFADE, ELTERN_TITEL, stufen } from '../config/brotkrumePfade.js';

// Brotkrume «Übersicht › Meine Unterlagen › Dossier» — entschieden 25.09.2026 (IDEEN.md §15).
//
// Vorher standen in diesen fünf Ansichten ZWEI Wege zurück mit verschiedenem Ziel: oben
// «Übersicht» (main.jsx, für die ganze App) und darunter ein eigener Knopf «Zurück zu Meine
// Unterlagen» bzw. «Zurück zum Notfall». Welcher wohin führt, musste man ausprobieren.
// Jetzt eine Zeile, die zeigt, wo man steht; jede Stufe davor ist anklickbar.
//
export const Brotkrume = ({ palette, t, view, onNavigate }) => {
  const liste = stufen(view);
  if (!liste) return null;
  const knopf = {
    background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
    fontSize: text.sm, color: palette.mid, padding: '6px 0', minHeight: '44px', // App-Massstab: 44, wo es geht (tippflaechenGate)
    textDecoration: 'underline', textUnderlineOffset: '3px', textDecorationColor: palette.border,
  };
  return React.createElement('nav', { 'aria-label': t('nav.pfad'), style: { margin: '0 0 ' + space.md + 'px' } },
    React.createElement('ol', {
      style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: '6px', rowGap: 0 },
    },
      liste.map((s, i) => React.createElement('li', { key: s.titel, style: { display: 'flex', alignItems: 'center', gap: '6px' } },
        i > 0 && React.createElement('span', { 'aria-hidden': 'true', style: { color: palette.mid, fontSize: text.sm } }, '›'),
        s.ziel
          ? React.createElement('button', { type: 'button', onClick: () => onNavigate(s.ziel), style: knopf }, t(s.titel))
          : React.createElement('span', { 'aria-current': 'page', style: { fontSize: text.sm, color: palette.text, fontWeight: weight.medium, padding: '6px 0' } }, t(s.titel))
      ))
    )
  );
};
