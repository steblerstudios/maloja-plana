import React from 'react';

// Die Rucksack-Zeichnung in Kapitel-Zeichen-Art: füllt ihren Behälter, Farbe von aussen
// (currentColor) — für den Kreis auf der Tal-Strasse im Bergpanorama (27.09.2026).
export const rucksackZeichen = () => React.createElement('svg', {
  viewBox: '0 0 24 24', width: '100%', height: '100%', 'aria-hidden': true, fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round',
},
  React.createElement('path', { d: 'M6 8a6 6 0 0 1 12 0v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z' }),
  React.createElement('path', { d: 'M9 8a3 3 0 0 1 6 0' }),
  React.createElement('path', { d: 'M9 14h6' }));

// Mini-Rucksack (Glyph ohne Text) — Gegenstück zum Mini-Kompass: steht als Zugang zum
// Wanderrucksack (bis 27.09.2026 «Mein Gepäck») im Block «Was steht mir zu?». Dieselbe
// Zeichnung wie der Gepäck-Zugang weiter unten, auf die 32 px des Kompasses gebracht.
export const miniRucksack = (palette) => React.createElement('span', {
  'aria-hidden': true, style: { display: 'block', width: '32px', height: '32px', color: palette.sandDeep },
}, rucksackZeichen());
