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

// Steuer als Münzbalken (Stebler Studios 20.11.2026: «ein Balken so wie er ist, aber aus Münzen, der Teil davon grau, und in
// Relation zu etwas»). Eine Münze = 1 % des Nettoeinkommens im Jahr (dieselbe Regel wie die Skizze «zehn Fünfliber»).
// Die ersten Münzen sind der Bund (Behörden-Grau), danach Kanton und Gemeinde (gold), danach leer bis zur nächsten Zehnerstelle.
export const SteuerMuenzen = ({ palette, anteil = 0, bundAnteil = 0, isDarkMode }) => {
  const h = React.createElement;
  const prozent = Math.max(0, anteil * 100);
  const bund = Math.min(prozent, Math.max(0, bundAnteil * 100));
  const anzahl = Math.max(10, Math.ceil((prozent + 0.01) / 10) * 10);
  const d = 14, luecke = 2, zehnerLuecke = 6;
  const breite = anzahl * d + (anzahl - 1) * luecke + (anzahl / 10 - 1) * (zehnerLuecke - luecke);
  const behoerden = bereichFillColor('behoerden', isDarkMode) || palette.mid;
  const muenzen = [];
  let x = d / 2;
  for (let i = 0; i < anzahl; i++) {
    const voll = Math.max(0, Math.min(1, prozent - i));
    const grau = i < Math.round(bund) || (i === 0 && bund > 0);
    if (voll <= 0.15) muenzen.push(h(Fuenfliber, { key: i, palette, isDarkMode, cx: x, cy: d / 2, r: d / 2, leer: true }));
    else if (grau) muenzen.push(h('circle', { key: i, cx: x, cy: d / 2, r: d / 2, fill: behoerden }));
    else muenzen.push(h(Fuenfliber, { key: i, palette, isDarkMode, cx: x, cy: d / 2, r: d / 2 }));
    x += d + ((i + 1) % 10 === 0 ? zehnerLuecke : luecke);
  }
  return h('svg', { width: Math.min(breite, 360), viewBox: '0 0 ' + breite + ' ' + d, 'aria-hidden': true, 'data-bild': 'steuer-muenzen', 'data-prozent': Math.round(prozent), style: { display: 'block', maxWidth: '100%', height: 'auto' } }, ...muenzen);
};

// Notgroschen: das Sparschwein (Stebler Studios 20.11.2026: Tank-Gedanke als Sparschwein, «bitte besser zeichnen»).
// Es füllt sich wie der Tank (voll = 6 Monate), gestrichelte Marke bei «empfohlen» (3 Monate). Ruhig und flach: ein Körper
// mit weicher Linie, Rüssel mit zwei Nasenlöchern, ein Ohr, zwei Beine, Ringelschwanz, der Schlitz oben. Eine Farbe (Finanzen).
const SCHWEIN = 'M24 52 C24 32 42 20 64 20 C80 20 92 26 98 36 C102 37 104 40 104 44 L104 58 C104 62 101 64 98 64 '
  + 'C94 72 84 80 64 80 C42 80 24 72 24 52 Z';
export const Sparschwein = ({ palette, monate = 0, empfohlen = 3, voll = 6, isDarkMode, groesse = 'mittel' }) => {
  const h = React.createElement;
  const px = groesse === 'gross' ? 220 : groesse === 'klein' ? 64 : 150;
  const g = gold(palette, isDarkMode);
  const linie = palette.text;
  const anteil = Math.max(0, Math.min(1, monate / voll));
  const oben = 20, unten = 80;
  const fuellOben = unten - anteil * (unten - oben);
  const markeY = unten - (empfohlen / voll) * (unten - oben);
  const id = 'mp-schwein-' + groesse;
  return h('svg', { width: px, height: Math.round(px * 0.8), viewBox: '0 0 120 96', 'aria-hidden': true, 'data-bild': 'sparschwein', 'data-anteil': Math.round(anteil * 100) },
    h('defs', null, h('clipPath', { id }, h('path', { d: SCHWEIN }))),
    // Beine hinter dem Körper
    h('rect', { x: 36, y: 70, width: 12, height: 18, rx: 5, fill: g, stroke: linie, strokeOpacity: 0.55, strokeWidth: 1.5 }),
    h('rect', { x: 78, y: 70, width: 12, height: 18, rx: 5, fill: g, stroke: linie, strokeOpacity: 0.55, strokeWidth: 1.5 }),
    // Körper als Gefäss: leer = Fläche, gefüllt = Gold bis zur Höhe
    h('path', { d: SCHWEIN, fill: palette.surface || palette.bg }),
    h('g', { clipPath: 'url(#' + id + ')' },
      h('rect', { x: 0, y: fuellOben, width: 120, height: 96, fill: g }),
      h('line', { x1: 0, x2: 120, y1: markeY, y2: markeY, stroke: linie, strokeWidth: 1.5, strokeDasharray: '4 3', strokeOpacity: 0.8 })),
    h('path', { d: SCHWEIN, fill: 'none', stroke: linie, strokeOpacity: 0.55, strokeWidth: 2, strokeLinejoin: 'round' }),
    // Ohr, Auge, Rüssel mit Nasenlöchern, Schlitz, Ringelschwanz
    h('path', { d: 'M76 24 C77 14 84 9 89 10 C90 17 87 24 82 27 Z', fill: g, stroke: linie, strokeOpacity: 0.55, strokeWidth: 1.5, strokeLinejoin: 'round' }),
    h('circle', { cx: 88, cy: 40, r: 2.4, fill: linie }),
    h('rect', { x: 102, y: 42, width: 10, height: 14, rx: 5, fill: g, stroke: linie, strokeOpacity: 0.55, strokeWidth: 1.5 }),
    h('circle', { cx: 107, cy: 46.5, r: 1.3, fill: linie, opacity: 0.7 }), h('circle', { cx: 107, cy: 51.5, r: 1.3, fill: linie, opacity: 0.7 }),
    h('rect', { x: 54, y: 17, width: 20, height: 5, rx: 2.5, fill: linie, opacity: 0.75 }),
    h('path', { d: 'M24 46 C16 46 13 40 17 37 C21 34 24 39 20 42', fill: 'none', stroke: linie, strokeOpacity: 0.55, strokeWidth: 2, strokeLinecap: 'round' }));
};
