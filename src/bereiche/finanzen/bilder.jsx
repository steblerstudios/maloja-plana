import React from 'react';
import { INSTRUMENT_GROESSE } from '../../config/tokens.js';
import { bereichFillColor } from '../../data/lebensbereiche.js';

// Lebensbereich Finanzen · die Bilder (Bauplan Lebensbereich, Entwurf Stebler Studios 20.11.2026: «Mischung aus S2 und S3»,
// Skizze _werkbank/entwuerfe/finanzen-mischung.html). Finanzen spricht in Fünflibern. Rein Bild: Zahlen und Sätze stehen
// daneben (aria-hidden). Je Bild ein Bauteil mit `groesse` (klein 64 · mittel 128 · gross 256, Brand Book §7b).
//   Fuenfliber     die Münze, aus der alles gebaut ist
//   MuenzLohn      Frage Lohn: dasselbe Barometer wie LohnEinordnung (vier gleich breite Zonen, Median dazwischen), aus Münzen
//   Steuerfranken  Frage Steuer: ein Fünfliber, das Stück des Bundes in der Behörden-Farbe («Behörden spielt mit», Icons 06.11.)
//   SteuerMuenzen  Frage Steuer als Münzstapel (eine Münze = 1 % vom Einkommen, Bund grau unten)
//   VermoegenStapel  Vermögen in derselben Münze, je zehn ein Stapel
//   Sparschwein    Frage Notgroschen: der Tank-Gedanke (Gefäss füllt sich, Marke «empfohlen», voll bei 6 Monaten), von vorne

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

// ── Münzstapel ────────────────────────────────────────────────────────────────────────────────────────────────────────
// Stebler Studios 20.11.2026 abends: «hochweg nicht horizontal bei den Steuern eher so wie ein Stack und dann quasi beim
// Vermögen mehrere Stacks» → Skizze `_werkbank/entwuerfe/finanzen-schwein-stapel.html`, gewählt S-a und V3.
// Eine Münze von der Seite: flacher Zylinder, oben die Ellipse. `art`: gold · grau (Bund, Behörden-Farbe) · leer.
const MUENZ_H = 6;
const muenzeSeitlich = (h, key, art, y, palette, g, behoerden) => {
  if (art === 'leer') return h('rect', { key, x: 1.5, y: y + 3, width: 37, height: 5.5, rx: 2.75, fill: 'none', stroke: palette.border, strokeWidth: 1.2 });
  const farbe = art === 'grau' ? behoerden : g;
  return h('g', { key },
    h('rect', { x: 1, y: y + 3, width: 38, height: 6, rx: 3, fill: farbe }),
    h('rect', { x: 1, y: y + 3, width: 38, height: 6, rx: 3, fill: palette.text, fillOpacity: 0.22 }),
    h('ellipse', { cx: 20, cy: y + 4, rx: 19, ry: 3.2, fill: farbe }));
};
// Ein Stapel, von unten nach oben. `px` = Breite in Pixeln.
const Stapel = ({ palette, isDarkMode, muenzen, px = 40, bild, extra = {}, fuellt = false }) => {
  const h = React.createElement;
  const g = gold(palette, isDarkMode);
  const behoerden = bereichFillColor('behoerden', isDarkMode) || palette.mid;
  const hoehe = muenzen.length * MUENZ_H + 8;
  // `fuellt` (Kachel der Kapitelzeile): die Glyphe füllt ihren Behälter, höchstens `px` breit, wie alle Mini-Instrumente.
  const masse = fuellt ? { width: '100%', style: { display: 'block', maxWidth: px + 'px', height: 'auto', margin: '0 auto' } }
    : { width: px, height: Math.round(hoehe * px / 40), style: { display: 'block', flexShrink: 0 } };
  return h('svg', { ...masse, viewBox: '0 0 40 ' + hoehe, 'aria-hidden': true, 'data-bild': bild, ...extra },
    ...muenzen.map((art, i) => muenzeSeitlich(h, i, art, hoehe - 10 - i * MUENZ_H, palette, g, behoerden)));
};
const reihe = (n, art) => Array.from({ length: Math.max(0, n) }, () => art);

// Steuer als Münzstapel (S-a). Eine Münze = 1 % des erfassten Einkommens im Jahr (dieselbe Regel wie die Skizze «zehn
// Fünfliber»). Unten der Bund (Behörden-Grau), darüber Kanton und Gemeinde (gold), darüber leere Münzen bis zur nächsten
// Zehnerstelle: so steht der Stapel in Relation zum Einkommen.
export const SteuerMuenzen = ({ palette, anteil = 0, bundAnteil = 0, isDarkMode, px = 34, fuellt = false }) => {
  const prozent = Math.max(0, anteil * 100);
  const voll = Math.round(prozent);
  const bund = voll > 0 ? Math.min(voll, Math.max(1, Math.round(bundAnteil * 100))) : 0;
  const anzahl = Math.max(10, Math.ceil((voll + 0.01) / 10) * 10);
  const muenzen = [...reihe(bund, 'grau'), ...reihe(voll - bund, 'gold'), ...reihe(anzahl - voll, 'leer')];
  return React.createElement(Stapel, { palette, isDarkMode, muenzen, px, fuellt, bild: 'steuer-muenzen', extra: { 'data-prozent': Math.round(prozent), 'data-stapel': 1 } });
};

// Vermögen als Stapel (V3): dieselbe Münze wie die Steuer — 1 % des erfassten Einkommens im Jahr —, je zehn Münzen ein
// Stapel. So stehen Steuer und Vermögen in derselben Einheit. Das Sparschwein sagt «wie viele Monate», die Stapel sagen
// «wie viel, gemessen am Jahreseinkommen»; ab einem ganzen Jahreseinkommen (zehn Stapel) bleibt es bei zehn.
export const VERMOEGEN_HOECHST = 10;
export const VermoegenStapel = ({ palette, muenzen = 0, isDarkMode }) => {
  const h = React.createElement;
  const n = Math.max(0, Math.round(muenzen));
  const stapel = Math.min(VERMOEGEN_HOECHST, Math.max(1, Math.ceil(n / 10)));
  const kinder = [];
  for (let s = 0; s < stapel; s++) {
    const hier = Math.max(0, Math.min(10, n - s * 10));
    kinder.push(h(Stapel, { key: s, palette, isDarkMode, muenzen: [...reihe(hier, 'gold'), ...reihe(10 - hier, 'leer')], px: 28 }));
  }
  return h('div', { 'aria-hidden': 'true', 'data-bild': 'vermoegen-stapel', 'data-muenzen': n, 'data-stapel': stapel, style: { display: 'flex', alignItems: 'flex-end', gap: '4px', flexWrap: 'wrap' } }, ...kinder);
};

// Notgroschen: das Sparschwein, von vorne (Stebler Studios 20.11.2026 abends, Skizze P2). Es füllt sich wie der Tank
// (voll = 6 Monate), gestrichelte Marke bei «empfohlen» (3 Monate). Runder Kopf-Bauch, zwei Ohren, zwei Füsse, Augen,
// der Rüssel in der Mitte, der Schlitz oben. Eine Farbe (Finanzen), flach, keine Schatten.
const KOERPER = { cx: 60, cy: 52, r: 34 };
export const Sparschwein = ({ palette, monate = 0, empfohlen = 3, voll = 6, isDarkMode, groesse = 'mittel', fuellt = false }) => {
  const h = React.createElement;
  const px = groesse === 'gross' ? 220 : groesse === 'klein' ? 64 : 150;
  const g = gold(palette, isDarkMode);
  const linie = palette.text;
  const anteil = Math.max(0, Math.min(1, monate / voll));
  const oben = KOERPER.cy - KOERPER.r, unten = KOERPER.cy + KOERPER.r;
  const fuellOben = unten - anteil * (unten - oben);
  const markeY = unten - (empfohlen / voll) * (unten - oben);
  const id = 'mp-schwein-' + groesse;
  const kontur = { stroke: linie, strokeOpacity: 0.6, strokeWidth: 2, strokeLinejoin: 'round' };
  const masse = fuellt ? { width: '100%', style: { display: 'block', maxWidth: px + 'px', height: 'auto' } } : { width: px, height: Math.round(px * 100 / 120) };
  return h('svg', { ...masse, viewBox: '0 0 120 100', 'aria-hidden': true, 'data-bild': 'sparschwein', 'data-anteil': Math.round(anteil * 100) },
    h('defs', null, h('clipPath', { id }, h('circle', KOERPER))),
    // Ohren und Füsse hinter dem Körper
    h('path', { d: 'M34 30 L30 8 L52 21 Z', fill: g, ...kontur }),
    h('path', { d: 'M86 30 L90 8 L68 21 Z', fill: g, ...kontur }),
    h('rect', { x: 38, y: 78, width: 14, height: 14, rx: 5, fill: g, ...kontur }),
    h('rect', { x: 68, y: 78, width: 14, height: 14, rx: 5, fill: g, ...kontur }),
    // Körper als Gefäss: leer = Fläche, gefüllt = Gold bis zur Höhe, Marke «empfohlen» gestrichelt
    h('circle', { ...KOERPER, fill: palette.surface || palette.bg }),
    h('g', { clipPath: 'url(#' + id + ')' },
      h('rect', { 'data-teil': 'sparschwein-fuellung', x: 0, y: fuellOben, width: 120, height: 100, fill: g }),
      h('line', { 'data-teil': 'sparschwein-marke', x1: 0, x2: 120, y1: markeY, y2: markeY, stroke: linie, strokeWidth: 1.5, strokeDasharray: '4 3', strokeOpacity: 0.8 })),
    h('circle', { ...KOERPER, fill: 'none', ...kontur }),
    // Schlitz, Augen, Rüssel mit Nasenlöchern
    h('rect', { x: 51, y: 15.5, width: 18, height: 4, rx: 2, fill: linie, opacity: 0.75 }),
    h('circle', { cx: 48, cy: 44, r: 2.4, fill: linie }),
    h('circle', { cx: 72, cy: 44, r: 2.4, fill: linie }),
    h('ellipse', { cx: 60, cy: 59, rx: 12, ry: 8.5, fill: palette.surface || palette.bg }),
    h('ellipse', { cx: 60, cy: 59, rx: 12, ry: 8.5, fill: g, fillOpacity: 0.55, ...kontur }),
    h('ellipse', { cx: 55.5, cy: 59, rx: 1.8, ry: 2.6, fill: linie, opacity: 0.7 }),
    h('ellipse', { cx: 64.5, cy: 59, rx: 1.8, ry: 2.6, fill: linie, opacity: 0.7 }));
};
