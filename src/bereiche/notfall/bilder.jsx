import React from 'react';
import { INSTRUMENT_GROESSE } from '../../config/tokens.js';
import { DARK_PALETTE } from '../../config/constants.js';
import { bereichFillColor } from '../../data/lebensbereiche.js';

// Franchise-Stand als Fieberthermometer (Stebler Studios 11.11.2026). Koffer-Logik Gesundheit: ein Gegenstand aus dem
// Arztkoffer. Das Thermometer trägt nur diese Bedeutung; das geplante Fach für Fieber heisst darum «Fiebertagebuch».
// Seit 18.11.2026 nach dem Wohnen-Konzept (Sophie: «warum ist der termometer nicht orange und hoch und nicht liegend»):
// EINE Gestalt in allen Grössen, immer stehend, in der Farbe des Lebensbereichs Gesundheit (Hagebutte) — wie das
// Drittel-Haus, das überall gleich dasteht. Nur die Grösse wechselt (Brand Book §7b):
//   klein 64   — Kachel. Nur die Franchise, Strich oben. Keine Wörter.
//   mittel 128 — KVG-Reiter. Über dem Strich der Selbstbehalt als zweite, gestrichelte Strecke.
//   gross 256  — Zuhause Arztkoffer. Dazu Ablesewörter (übersetzt, nie rohe Franken: Sichtschutz).
// stand = franchiseStand(…) / berechneFranchise(…) — keine eigene Rechnung hier. Ruhig: eine Farbe, keine Ampel.
// Die Zahl steht UNTER dem Bild (Regel «Zahl»), nicht im Bild.
const anteil = (wert, max) => (max > 0 ? Math.max(0, Math.min(1, wert / max)) : 0);
const r2 = (n) => Math.round(n * 1000) / 1000;
export const gesundheitFarbe = (palette) => bereichFillColor('gesundheit', palette.bg === DARK_PALETTE.bg) || palette.sky;

export const FranchiseThermometer = ({ palette, stand, groesse = 'klein', t, fuell }) => {
  const h = React.createElement;
  const a = anteil(stand.franchiseVerbraucht, stand.franchise);
  const sb = anteil(stand.selbstbehalt, stand.selbstbehaltMax);
  const fuellung = fuell || gesundheitFarbe(palette);
  const bahn = palette.border;
  const strich = palette.text;
  const px = INSTRUMENT_GROESSE[groesse] || INSTRUMENT_GROESSE.klein;
  const mitSb = groesse !== 'klein';
  const daten = { 'aria-hidden': true, 'data-franchise': groesse, 'data-lage': 'stehend', 'data-anteil': r2(a), 'data-selbstbehalt-anteil': r2(sb) };
  // Zeichnung in Einheiten 40 × 160: Röhre x 14–26, Kugel unten (cy 140). Mit Selbstbehalt: Franchise unten zwei
  // Drittel der Röhre, Selbstbehalt darüber; ohne (klein): die Franchise füllt die ganze Röhre, Strich oben.
  const oben = 12, unten = 128, x = 14, w = 12;
  const fStrich = mitSb ? 52 : oben + 4;
  const fHoehe = unten - fStrich, sHoehe = fStrich - oben;
  const zeichnung = [
    h('rect', { key: 'r', x, y: oben, width: w, height: unten - oben + 4, rx: w / 2, fill: 'none', stroke: bahn, strokeWidth: groesse === 'klein' ? 2.5 : 1.5 }),
    h('circle', { key: 'k', cx: x + w / 2, cy: 140, r: 13, fill: a > 0 ? fuellung : 'none', stroke: a > 0 ? fuellung : bahn, strokeWidth: groesse === 'klein' ? 2.5 : 1.5 }),
    a > 0 && h('rect', { key: 's', 'data-teil': 'saeule', x: x + 3, y: unten - fHoehe * a, width: w - 6, height: fHoehe * a + 6, fill: fuellung }),
    mitSb && sb > 0 && h('rect', { key: 'ss', 'data-teil': 'selbstbehalt-saeule', x: x + 3, y: fStrich - sHoehe * sb, width: w - 6, height: sHoehe * sb, fill: fuellung, opacity: 0.6 }),
    mitSb && h('rect', { key: 'sb', 'data-teil': 'selbstbehalt', x: x + 3, y: oben + 2, width: w - 6, height: sHoehe - 2, fill: 'none', stroke: bahn, strokeDasharray: '3 2' }),
    h('line', { key: 'l', 'data-teil': 'franchise-strich', x1: x - 6, y1: fStrich, x2: x + w + 6, y2: fStrich, stroke: strich, strokeWidth: groesse === 'klein' ? 3 : 2 }),
  ];
  if (groesse === 'gross') {
    // viewBox in echten Pixeln (160 × 256): die Zeichnung mit 1.6 skaliert, die Ablesewörter ausserhalb, 13 px (Regel H).
    const k = 1.6;
    return h('svg', { viewBox: '0 0 160 256', width: '100%', ...daten, style: { maxWidth: '160px', height: 'auto', display: 'block', overflow: 'visible' } },
      h('g', { transform: 'scale(' + k + ')' }, ...zeichnung),
      t && h('text', { 'data-teil': 'ablese-franchise', x: (x + w + 12) * k, y: fStrich * k + 5, fontSize: 13, fill: strich }, t('thermometer.franchise')),
      t && h('text', { 'data-teil': 'ablese-selbstbehalt', x: (x + w + 12) * k, y: (oben + 10) * k, fontSize: 13, fill: palette.mid }, t('thermometer.selbstbehalt')));
  }
  return h('svg', { viewBox: '0 0 40 160', height: px, ...daten, style: { height: px + 'px', width: 'auto', display: 'block', overflow: 'visible' } }, ...zeichnung);
};

// Bereit für den Ernstfall als Herz mit Puls (Stebler Studios 18.11.2026, Auswahl «B · Herz mit Puls»). Das Zeichen
// des Notfalls (Brand Book §5: Herz mit Puls, kein Kreuz). Ersetzt den Ring der Kachel und den Balken im Kapitel:
// ein Bild an beiden Orten.
// Drei Schläge = drei Lagen (Unfall, Spital, Behörde), in der Reihenfolge von SCENARIOS. Ein Schlag ist hoch, wenn
// alle Angaben seiner Lage bereit sind; sonst ein kleiner Ausschlag in der Rahmenfarbe. `lagen` = lagenStand(data).
// groesse: klein 64 (Kachel, keine Wörter) · gross 256 (Kapitel, Lagen-Namen unter den Schlägen).
// Ruhig: eine Farbe (Notfall-Rot), keine Ampel. Die Zahl steht UNTER dem Bild (Regel «Zahl»).
const SCHLAG_X = [20, 60, 100]; // auf den Dritteln, damit die Lagen-Namen darunter passen
const PULS_Y = 44;
const pulsPfad = (lagen) => {
  let d = 'M2 ' + PULS_Y;
  SCHLAG_X.forEach((x, i) => {
    const hoch = lagen[i] && lagen[i].voll ? 22 : 5;
    d += ' L' + (x - 6) + ' ' + PULS_Y + ' L' + (x - 2) + ' ' + (PULS_Y - hoch) + ' L' + (x + 2) + ' ' + (PULS_Y + Math.round(hoch * 0.6)) + ' L' + (x + 6) + ' ' + PULS_Y;
  });
  return d + ' L118 ' + PULS_Y;
};

export const HerzPuls = ({ palette, lagen = [], groesse = 'klein', t }) => {
  const h = React.createElement;
  const rot = palette.roseDeep || palette.rose;
  const px = INSTRUMENT_GROESSE[groesse] || INSTRUMENT_GROESSE.klein;
  const svg = h('svg', { viewBox: '0 0 120 80', width: '100%', 'aria-hidden': true, 'data-teil': 'herz-puls', 'data-groesse': groesse,
    style: { maxWidth: px + 'px', height: 'auto', display: 'block', overflow: 'visible' } },
    h('path', { 'data-teil': 'herz', d: 'M60 72 C20 48 14 22 34 14 C46 9 56 16 60 24 C64 16 74 9 86 14 C106 22 100 48 60 72 Z',
      fill: 'none', stroke: rot, strokeWidth: groesse === 'gross' ? 2 : 3, strokeLinejoin: 'round' }),
    h('path', { 'data-teil': 'puls', d: pulsPfad(lagen), fill: 'none', stroke: rot, strokeWidth: groesse === 'gross' ? 2 : 3, strokeLinejoin: 'round', strokeLinecap: 'round' }),
    lagen.map((l, i) => h('circle', { key: l.key, 'data-teil': 'schlag', 'data-lage': l.key, 'data-voll': l.voll ? 'ja' : 'nein',
      cx: SCHLAG_X[i], cy: PULS_Y, r: 0, fill: 'none' })));
  if (groesse !== 'gross' || !t) return svg;
  return h('div', { style: { maxWidth: px + 'px' } }, svg,
    h('div', { 'aria-hidden': true, style: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', fontSize: '13px', color: palette.mid, textAlign: 'center', marginTop: '2px', gap: '4px' } },
      lagen.map((l) => h('span', { key: l.key, 'data-teil': 'lage-name', style: { color: l.voll ? palette.text : palette.mid, overflowWrap: 'anywhere', hyphens: 'auto', WebkitHyphens: 'auto', lineHeight: 1.3 } }, t('notfallEinstieg.' + l.key + '.title')))));
};
