import React from 'react';
import { text, weight, space, radius, leading } from '../config/tokens.js';
import { nichtberufsunfallStatus } from '../utils/anstellung.js';

// UVG-Hinweis: Angestellte mit mindestens 8 Std./Woche bei einer Arbeitgeberin sind auch in der Freizeit
// unfallversichert (UVV Art. 13) und können die Unfalldeckung bei der Krankenkasse ruhen lassen (KVG Art. 8).
// Kapitel 4, V1 (10.11.2026): Der Rat galt vorher für alle Angestellten — wer unter 8 Std. arbeitet, hätte
// nach dem Abwählen keinen Schutz in der Freizeit. Darum je nach Pensum: Rat mit Bedingung, Warnung oder
// Rat mit offener Frage. Zeigt nichts, wenn die Person nicht angestellt ist.
export const UvgHinweis = ({ palette, t, data }) => {
  const status = nichtberufsunfallStatus(data);
  if (!status) return null;

  return React.createElement('div', {
    style: {
      padding: space.md + 'px', background: palette.up, borderRadius: radius.lg,
      border: '1px solid ' + palette.border, marginBottom: '16px',
    },
  },
    React.createElement('div', { style: { fontWeight: weight.semi, fontSize: text.body, color: palette.text, marginBottom: space.xs + 'px' } },
      t(status === 'nein' ? 'uvgHint.titleUnter8' : 'uvgHint.title')
    ),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } },
      t(status === 'nein' ? 'uvgHint.bodyUnter8' : status === 'offen' ? 'uvgHint.bodyOffen' : 'uvgHint.body')
    ),
  );
};

export default UvgHinweis;
