import React from 'react';

// Mini-Kompass (Glyph ohne Text) — bis 25.09.2026 im InstrumentePanel. Seither Kopf
// der Leistungsliste auf dem Dashboard; eigenes kleines Modul, damit das Dashboard
// den ausgelagerten Instrumente-Chunk dafür nicht mitlädt.
export const miniCompass = (palette, bearing, state) => {
  const h = React.createElement;
  const cx = 22, cy = 22;
  const north = state === 'found' ? palette.sage : state === 'none' ? palette.sky : palette.mid;
  return h('svg', { viewBox: '0 0 44 44', width: 32, height: 32, 'aria-hidden': true },
    h('circle', { cx, cy, r: 18, fill: 'none', stroke: palette.border, strokeWidth: 2 }),
    h('g', { transform: 'rotate(' + bearing + ' ' + cx + ' ' + cy + ')' },
      h('polygon', { points: cx + ',7 ' + (cx + 4) + ',' + cy + ' ' + (cx - 4) + ',' + cy, fill: north, opacity: state === 'idle' ? 0.5 : 1 }),
      h('polygon', { points: cx + ',37 ' + (cx + 4) + ',' + cy + ' ' + (cx - 4) + ',' + cy, fill: palette.mid, opacity: 0.35 })
    ),
    h('circle', { cx, cy, r: 3, fill: palette.surface, stroke: palette.mid, strokeWidth: 1.5 })
  );
};
