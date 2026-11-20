import React from 'react';
import { INSTRUMENT_GROESSE } from '../../config/tokens.js';
import { bereichFillColor } from '../../data/lebensbereiche.js';

// Lebensbereich Finanzen · die Bilder (Bauplan Lebensbereich, Entwurf Stebler Studios 20.11.2026: «Mischung aus S2 und S3»,
// Skizze _werkbank/entwuerfe/finanzen-mischung.html). Finanzen spricht in Fünflibern. Rein Bild: Zahlen und Sätze stehen
// daneben (aria-hidden). Je Bild ein Bauteil mit `groesse` (klein 64 · mittel 128 · gross 256, Brand Book §7b).
//   Fuenfliber     die Münze, aus der alles gebaut ist
//   MuenzLohn      Frage Lohn: dasselbe Barometer wie LohnEinordnung (vier gleich breite Zonen, Median dazwischen), aus Münzen
//   Steuerfranken  Frage Steuer: ein Fünfliber, das Stück des Bundes in der Behörden-Farbe («Behörden spielt mit», Icons 06.11.)
//   Sparschwein    Frage Notgroschen: der Tank-Gedanke (Gefäss füllt sich, Marke «empfohlen», voll bei 6 Monaten), mit Münzen

const gold = (palette, isDarkMode) => bereichFillColor('finanzen', isDarkMode) || palette.gold;

export const Fuenfliber = ({ palette, cx, cy, r, isDarkMode, leer = false }) => {
  const h = React.createElement;
  if (leer) return h('circle', { cx, cy, r: r - 1, fill: 'none', stroke: palette.border, strokeWidth: 1.5 });
  return h('g', null,
    h('circle', { cx, cy, r, fill: gold(palette, isDarkMode) }),
    h('circle', { cx, cy, r: r * 0.78, fill: 'none', stroke: palette.bg, strokeOpacity: 0.35, strokeWidth: Math.max(1, r * 0.08) }),
    r >= 9 && h('text', { x: cx, y: cy + r * 0.32, textAnchor: 'middle', fontSize: r * 0.9, fontWeight: 700, fill: palette.bg, fillOpacity: 0.45 }, '5'));
};

// Lohn: vier Zonen à vier Münzen. Gefüllt bis zum Lohn, ein Strich beim Median (zwischen Zone 2 und 3).
export const MuenzLohn = ({ palette, fuell = [0, 0, 0, 0], isDarkMode, groesse = 'mittel' }) => {
  const h = React.createElement;
  const breite = groesse === 'gross' ? 320 : groesse === 'klein' ? 64 * 2 : 240;
  const d = 16, luecke = 2, zonenLuecke = 8;
  const zoneB = 4 * d + 3 * luecke;
  const voll = 4 * zoneB + 3 * zonenLuecke;
  const hoehe = 30;
  const muenzen = [];
  for (let z = 0; z < 4; z++) {
    for (let m = 0; m < 4; m++) {
      const x = z * (zoneB + zonenLuecke) + m * (d + luecke) + d / 2;
      muenzen.push(h(Fuenfliber, { key: z + '-' + m, palette, isDarkMode, cx: x, cy: hoehe / 2, r: d / 2, leer: (m + 0.5) / 4 > fuell[z] }));
    }
  }
  const medianX = 2 * zoneB + 1.5 * zonenLuecke;
  return h('svg', { width: breite, height: Math.round(breite * hoehe / voll), viewBox: '0 0 ' + voll + ' ' + hoehe, 'aria-hidden': true, 'data-bild': 'muenz-lohn', style: { display: 'block', maxWidth: '100%', height: 'auto' } },
    ...muenzen,
    h('line', { x1: medianX, x2: medianX, y1: 1, y2: hoehe - 1, stroke: palette.text, strokeWidth: 1.5 }));
};

// Steuer: ein Fünfliber; das Tortenstück des Bundes in der Behörden-Farbe, von oben im Uhrzeigersinn.
export const Steuerfranken = ({ palette, bundAnteil = 0, isDarkMode, groesse = 'klein' }) => {
  const h = React.createElement;
  const px = Math.round((INSTRUMENT_GROESSE[groesse] || 64) * 0.62);
  const r = 20, c = 22;
  const a = Math.max(0, Math.min(0.999, bundAnteil)) * 2 * Math.PI;
  const x = c + r * Math.sin(a), y = c - r * Math.cos(a);
  const behoerden = bereichFillColor('behoerden', isDarkMode) || palette.mid;
  return h('svg', { width: px, height: px, viewBox: '0 0 44 44', 'aria-hidden': true, 'data-bild': 'steuerfranken' },
    h(Fuenfliber, { palette, isDarkMode, cx: c, cy: c, r }),
    bundAnteil > 0 && h('path', { d: 'M' + c + ' ' + c + ' L' + c + ' ' + (c - r) + ' A' + r + ' ' + r + ' 0 ' + (a > Math.PI ? 1 : 0) + ' 1 ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' Z', fill: behoerden }));
};

// Notgroschen: das Sparschwein füllt sich wie der Tank (voll = 6 Monate), gestrichelte Marke bei «empfohlen» (3 Monate).
export const Sparschwein = ({ palette, monate = 0, empfohlen = 3, voll = 6, isDarkMode, groesse = 'mittel' }) => {
  const h = React.createElement;
  const px = groesse === 'gross' ? 220 : groesse === 'klein' ? 64 : 150;
  const g = gold(palette, isDarkMode);
  const anteil = Math.max(0, Math.min(1, monate / voll));
  const rx = 46, ry = 31, cx = 56, cy = 44;
  const fuellOben = cy + ry - anteil * 2 * ry;
  const markeY = cy + ry - (empfohlen / voll) * 2 * ry;
  const id = 'mp-schwein-' + groesse;
  return h('svg', { width: px, height: Math.round(px * 0.72), viewBox: '0 0 120 86', 'aria-hidden': true, 'data-bild': 'sparschwein', 'data-anteil': Math.round(anteil * 100) },
    h('defs', null, h('clipPath', { id }, h('ellipse', { cx, cy, rx, ry }))),
    // Beine, Ohr
    h('rect', { x: cx - 32, y: cy + ry - 8, width: 11, height: 18, rx: 4, fill: g, opacity: 0.75 }),
    h('rect', { x: cx + 20, y: cy + ry - 8, width: 11, height: 18, rx: 4, fill: g, opacity: 0.75 }),
    h('path', { d: 'M' + (cx + 22) + ' ' + (cy - ry + 4) + ' l9 -14 l5 16 z', fill: g, opacity: 0.75 }),
    // Bauch = Gefäss
    h('ellipse', { cx, cy, rx, ry, fill: palette.surface || palette.bg, stroke: g, strokeWidth: 2.5 }),
    h('g', { clipPath: 'url(#' + id + ')' },
      h('rect', { x: cx - rx, y: fuellOben, width: 2 * rx, height: 2 * ry, fill: g, opacity: 0.85 }),
      h('line', { x1: cx - rx, x2: cx + rx, y1: markeY, y2: markeY, stroke: palette.text, strokeWidth: 1.5, strokeDasharray: '5 4' })),
    h('ellipse', { cx, cy, rx, ry, fill: 'none', stroke: g, strokeWidth: 2.5 }),
    // Kopf, Rüssel, Auge, Schlitz, Schwänzchen
    h('ellipse', { cx: cx + rx + 6, cy: cy + 3, rx: 8, ry: 10, fill: g, opacity: 0.75 }),
    h('circle', { cx: cx + 28, cy: cy - 12, r: 2.2, fill: palette.text }),
    h('rect', { x: cx - 10, y: cy - ry - 4, width: 20, height: 4, rx: 2, fill: palette.text, opacity: 0.6 }),
    h('path', { d: 'M' + (cx - rx) + ' ' + (cy - 4) + ' q-9 -3 -6 -10 q3 -5 6 1', fill: 'none', stroke: g, strokeWidth: 2, strokeLinecap: 'round' }));
};
