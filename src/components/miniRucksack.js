import React from 'react';

// Mini-Rucksack (Glyph ohne Text) — Gegenstück zum Mini-Kompass: steht als Zugang
// zu «Mein Gepäck» im Block «Was steht mir zu?» (gewählt 27.09.2026). Dieselbe Zeichnung
// wie der Gepäck-Zugang weiter unten, auf die 32 px des Kompasses gebracht.
export const miniRucksack = (palette) => {
  const h = React.createElement;
  return h('svg', { viewBox: '0 0 24 24', width: 32, height: 32, 'aria-hidden': true, fill: 'none', stroke: palette.sandDeep || palette.mid, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('path', { d: 'M6 8a6 6 0 0 1 12 0v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z' }),
    h('path', { d: 'M9 8a3 3 0 0 1 6 0' }),
    h('path', { d: 'M9 14h6' }));
};
