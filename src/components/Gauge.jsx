import React from 'react';
import { weight } from '../config/tokens.js';

// Ruhiges Halbkreis-Instrument (Analog-Manometer). Geteiltes Primitiv für die
// „Instrumente"-Familie (Franchise-Tacho, später Reserve-Tankanzeige): eine Skala,
// optionale farbige Zonen, Marken und ein stiller Zeiger. Keine Animation —
// der Zeiger bewegt sich nur, wenn sich die Daten ändern.
//
// Props:
//   palette                — Theme
//   value                  — Zeigerwert (null → kein Zeiger, nur Skala)
//   min, max               — Skalen-Enden (Default 0..100)
//   zones: [{from,to,color,opacity?}]  — farbige Bögen (Wert-Einheiten)
//   markers: [{value,label?,color?}]   — Marken mit optionaler Beschriftung
//   endLabels: {left,right}            — kleine Beschriftung unter den Enden
//   needleColor            — Farbe des Zeigers (Default palette.text)
// Die Grafik selbst ist aria-hidden (dekorativ) — die Ablesung steht als
// sichtbarer Text direkt darunter beim Consumer und ist die a11y-Quelle
// (sonst läse der Screenreader dieselbe Aussage zweimal).
const CX = 110, CY = 106, R = 86, W = 220, H = 122;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function gaugeFrac(value, min, max) {
  if (max <= min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

function polar(frac, rr) {
  const a = Math.PI * (1 - clamp(frac, 0, 1)); // 180° (links) → 0° (rechts)
  return [CX + rr * Math.cos(a), CY - rr * Math.sin(a)];
}

function arcPath(f1, f2, rr) {
  const [x1, y1] = polar(f1, rr);
  const [x2, y2] = polar(f2, rr);
  return 'M ' + x1.toFixed(2) + ' ' + y1.toFixed(2) + ' A ' + rr + ' ' + rr + ' 0 0 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2);
}

export const Gauge = ({ palette, value, min = 0, max = 100, zones = [], markers = [], endLabels, needleColor }) => {
  const h = React.createElement;
  const frac = (v) => gaugeFrac(v, min, max);
  const nColor = needleColor || palette.text;
  const els = [];

  els.push(h('path', { key: 'track', d: arcPath(0, 1, R), fill: 'none', stroke: palette.border, strokeWidth: 12, strokeLinecap: 'round' }));

  zones.forEach((z, i) => els.push(h('path', {
    key: 'z' + i, d: arcPath(frac(z.from), frac(z.to), R), fill: 'none',
    stroke: z.color, strokeWidth: 12, strokeLinecap: 'butt', opacity: z.opacity == null ? 0.9 : z.opacity,
  })));

  markers.forEach((m, i) => {
    const f = frac(m.value);
    const [x1, y1] = polar(f, R - 10);
    const [x2, y2] = polar(f, R + 7);
    els.push(h('line', { key: 'mk' + i, x1, y1, x2, y2, stroke: m.color || palette.mid, strokeWidth: 2 }));
    if (m.label) {
      const [lx, ly] = polar(f, R + 19);
      els.push(h('text', { key: 'ml' + i, x: lx, y: ly, textAnchor: 'middle', style: { fontSize: '11px', fill: m.color || palette.mid, fontWeight: weight.medium } }, m.label));
    }
  });

  if (value != null) {
    const f = frac(value);
    const [nx, ny] = polar(f, R - 18);
    els.push(h('line', { key: 'needle', x1: CX, y1: CY, x2: nx, y2: ny, stroke: nColor, strokeWidth: 3, strokeLinecap: 'round' }));
  }
  els.push(h('circle', { key: 'hub', cx: CX, cy: CY, r: 5.5, fill: palette.surface, stroke: nColor, strokeWidth: 2.5 }));

  if (endLabels) {
    els.push(h('text', { key: 'el', x: CX - R, y: CY + 15, textAnchor: 'middle', style: { fontSize: '11px', fill: palette.mid } }, endLabels.left));
    els.push(h('text', { key: 'er', x: CX + R, y: CY + 15, textAnchor: 'middle', style: { fontSize: '11px', fill: palette.mid } }, endLabels.right));
  }

  return h('svg', {
    viewBox: '0 0 ' + W + ' ' + H, width: '100%',
    style: { maxWidth: '280px', height: 'auto', display: 'block', margin: '0 auto', overflow: 'visible' },
    'aria-hidden': true,
  }, els);
};

export default Gauge;
