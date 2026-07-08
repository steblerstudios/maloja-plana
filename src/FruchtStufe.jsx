import React from 'react';
import FruchtMitIcon from './FruchtMitIcon.jsx';

// ─── Vier Reife-Stufen — jeder Zustand positiv lesbar ────────────────────────
//
// Psychologie (maloja-administrative-psychology): der Baum darf nie messen oder
// beschämen. „Leer" ist kein Defizit, sondern ein Versprechen. Darum wächst jeder
// Bereich als Reife-Geschichte statt als ausgebleichte Frucht:
//   1 Knospe (leer) · 2 Blüte (begonnen) · 3 junge Frucht (Grundordnung) ·
//   4 reife Frucht (vertieft).
// Stufe 3+4 zeigen die echte Bereichs-Frucht mit Icon-Negativ (Reuse FruchtMitIcon);
// Stufe 1+2 sind ruhige Vorformen in der Ast-Farbe (Identität trägt das Label).

export default function FruchtStufe({ fruit, iconName, color, stage = 1, size = 48, title }) {
  // Reife Frucht (4) und junge Frucht (3): echte Frucht, unterschiedlich weit.
  if (stage >= 3) {
    const ripe = stage >= 4;
    return React.createElement(FruchtMitIcon, {
      fruit, iconName, color,
      size: ripe ? size : Math.round(size * 0.9),
      ripeness: ripe ? 1 : 0.72,
      title,
    });
  }

  const aria = {
    role: title ? 'img' : undefined,
    'aria-label': title || undefined,
    'aria-hidden': title ? undefined : 'true',
    focusable: 'false',
  };

  // Blüte (2) — fünf weiche Blütenblätter auf kurzem Stiel.
  if (stage === 2) {
    const px = Math.round(size * 0.78);
    return React.createElement('svg', {
      viewBox: '0 0 24 24', width: px, height: px, ...aria,
      style: { display: 'block', color, opacity: 0.9 },
    },
      React.createElement('line', { x1: 12, y1: 13, x2: 12, y2: 22, stroke: 'currentColor', strokeWidth: 1.4, opacity: 0.35, strokeLinecap: 'round' }),
      ...[0, 72, 144, 216, 288].map((deg, i) =>
        React.createElement('ellipse', { key: i, cx: 12, cy: 5.6, rx: 2.6, ry: 4.4, fill: 'currentColor', opacity: 0.5, transform: 'rotate(' + deg + ' 12 10)' })
      ),
      React.createElement('circle', { cx: 12, cy: 10, r: 2.3, fill: 'currentColor', opacity: 0.95 })
    );
  }

  // Knospe (1) — geschlossene Tropfenform mit Kelch auf kurzem Stiel.
  const px = Math.round(size * 0.56);
  return React.createElement('svg', {
    viewBox: '0 0 24 24', width: px, height: px, ...aria,
    style: { display: 'block', color, opacity: 0.75 },
  },
    React.createElement('line', { x1: 12, y1: 12, x2: 12, y2: 22, stroke: 'currentColor', strokeWidth: 1.4, opacity: 0.35, strokeLinecap: 'round' }),
    React.createElement('path', { d: 'M9 13 Q12 10 15 13', fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, opacity: 0.5, strokeLinecap: 'round' }),
    React.createElement('path', { d: 'M12 3 C 15.5 6.5 15 12 12 13 C 9 12 8.5 6.5 12 3 Z', fill: 'currentColor', opacity: 0.6 })
  );
}
