import React from 'react';
import { text, weight, space, radius, leading } from '../config/tokens.js';

// Ruhiger UVG-Hinweis: Angestellte sind über den Arbeitgeber unfallversichert
// (ab 8 Std./Woche auch Nichtberufsunfälle) und können die Unfalldeckung bei der
// Krankenkasse abwählen → tiefere Prämie. Würdevoll, kein Druck. Zeigt nichts,
// wenn die Person nicht angestellt ist (dann greift dieser Spar-Weg nicht).
export const UvgHinweis = ({ palette, t, data }) => {
  if (data?.finanzen?.employmentType !== 'employed') return null;

  return React.createElement('div', {
    style: {
      padding: space.md + 'px', background: palette.up, borderRadius: radius.sm,
      border: '1px solid ' + palette.border, marginBottom: '16px',
    },
  },
    React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.body, color: palette.text, marginBottom: space.xs + 'px' } },
      t('uvgHint.title')
    ),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } },
      t('uvgHint.body')
    ),
  );
};

export default UvgHinweis;
