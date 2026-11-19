import React from 'react';
import { INSTRUMENT_GROESSE } from '../../config/tokens.js';
import { DARK_PALETTE } from '../../config/constants.js';
import { bereichFillColor } from '../../data/lebensbereiche.js';
import { betrag, zahl } from '../../utils/geld.js';

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
  if (groesse === 'gross' && t) {
    // viewBox in echten Pixeln (160 × 256): die Zeichnung mit 1.6 skaliert, die Ablesewörter ausserhalb, 13 px (Regel H).
    const k = 1.6;
    return h('svg', { viewBox: '0 0 160 256', width: '100%', ...daten, style: { maxWidth: '160px', height: 'auto', display: 'block', overflow: 'visible' } },
      h('g', { transform: 'scale(' + k + ')' }, ...zeichnung),
      t && h('text', { 'data-teil': 'ablese-franchise', x: (x + w + 12) * k, y: fStrich * k + 5, fontSize: 13, fill: strich }, t('thermometer.franchise')),
      t && h('text', { 'data-teil': 'ablese-selbstbehalt', x: (x + w + 12) * k, y: (oben + 10) * k, fontSize: 13, fill: palette.mid }, t('thermometer.selbstbehalt')));
  }
  return h('svg', { viewBox: '0 0 40 160', height: px, ...daten, style: { height: px + 'px', width: 'auto', display: 'block', overflow: 'visible' } }, ...zeichnung);
};

// Ablesung am Thermometer (Sophie 18.11.2026, Auswahl «A · Skala am Thermometer»): die Werte stehen auf der Höhe, die
// sie im Thermometer meinen — Selbstbehalt oben, Franchise am Strich, darunter was noch offen ist, unten was erreicht
// ist. Ersetzt die Textzeile «Franchise verbraucht · Franchise offen … Selbstbehalt … Maximum» unter dem Bild.
// Nur mittel 128 (KVG-Reiter) und gross 256 (Arztkoffer); die Kachel bleibt ohne Wörter. Beträge über betrag(),
// HTML statt SVG-Text: so greift der Sichtschutz.
export const FranchiseAblesung = ({ palette, t, stand, groesse = 'mittel', fuell }) => {
  const h = React.createElement;
  const px = INSTRUMENT_GROESSE[groesse] || INSTRUMENT_GROESSE.mittel;
  const k = px / 160;
  const a = anteil(stand.franchiseVerbraucht, stand.franchise);
  const zeile = 17;
  const yStrich = Math.round(52 * k - zeile / 2);
  const yOffen = yStrich + zeile;
  const yFuell = Math.round((128 - 76 * a) * k - zeile / 2);
  const yErreicht = Math.min(Math.round(128 * k), Math.max(yOffen + zeile + 2, yFuell));
  const marke = (teil, top, inhalt, stark) => h('div', { key: teil, 'data-teil': teil, style: { position: 'absolute', left: 0, top: top + 'px', whiteSpace: 'nowrap', fontSize: '13px', lineHeight: zeile + 'px', color: stark ? palette.text : palette.mid, fontWeight: stark ? 600 : 400 } }, inhalt);
  const wert = (n) => h('span', { style: { color: palette.text, fontVariantNumeric: 'tabular-nums' } }, betrag(n, { hoechstens: 2 }));
  return h('div', { 'data-teil': 'franchise-ablesung', 'data-groesse': groesse, style: { display: 'flex', gap: '10px', alignItems: 'flex-start' } },
    h(FranchiseThermometer, { palette, stand, groesse, fuell }),
    h('div', { style: { position: 'relative', height: px + 'px', minWidth: '150px' } },
      marke('ablese-selbstbehalt', Math.max(0, Math.round(14 * k - zeile / 2)), [t('thermometer.selbstbehalt') + ' ', wert(stand.selbstbehalt), ' ' + t('instrumente.franchiseVon', { franchise: zahl(stand.selbstbehaltMax) })]),
      marke('ablese-franchise', yStrich, [t('thermometer.franchise') + ' ', wert(stand.franchise)], true),
      a < 1 && marke('ablese-offen', yOffen, [t('thermometer.offen') + ' ', wert(stand.franchiseOffen)]),
      a > 0 && a < 1 && marke('ablese-erreicht', yErreicht, [t('thermometer.erreicht') + ' ', wert(stand.franchiseVerbraucht)])));
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

// Wer behandelt mich? als Karteikasten (Sophie 19.11.2026, Auswahl «B · Karteikasten»). Ein Gegenstand aus dem
// Arztkoffer, in der Farbe Gesundheit. Je Fachrichtung ein Reiter (`reiter` aus karteikarten(data), höchstens fünf
// gezeichnet), dahinter die Karten als Kanten (höchstens zwölf). Ohne Karten: der leere Kasten. Keine Wörter im Bild:
// die Zahl und die Fachrichtungen stehen darunter (Regel «Zahl»). Ruhig: eine Farbe, die Hausärztin (erster Reiter,
// Notfall-Angabe) gefüllt, die anderen Reiter nur umrandet.
export const KARTEI_REITER_MAX = 5;
export const KARTEI_KANTEN_MAX = 12;
export const Karteikasten = ({ palette, reiter = [], anzahl = 0, groesse = 'mittel' }) => {
  const h = React.createElement;
  const farbe = gesundheitFarbe(palette);
  const px = INSTRUMENT_GROESSE[groesse] || INSTRUMENT_GROESSE.mittel;
  const gezeigt = reiter.slice(0, KARTEI_REITER_MAX);
  const kanten = Math.min(anzahl, KARTEI_KANTEN_MAX);
  // Zeichnung 160 × 110: Kasten x 10–150, Vorderwand y 56–104; Karten stehen von y 30 an, Reiter darüber.
  const breite = 24, abstand = (128 - breite) / Math.max(1, KARTEI_REITER_MAX - 1);
  return h('svg', { viewBox: '0 0 160 110', width: '100%', 'aria-hidden': true, 'data-teil': 'karteikasten', 'data-groesse': groesse,
    'data-reiter': gezeigt.length, 'data-karten': kanten, style: { maxWidth: px + 'px', height: 'auto', display: 'block', overflow: 'visible' } },
    // Karten als Kanten, von hinten nach vorne
    Array.from({ length: kanten }, (_, i) => h('line', { key: 'k' + i, 'data-teil': 'karte', x1: 18, x2: 142,
      y1: 34 + i * (20 / Math.max(1, KARTEI_KANTEN_MAX - 1)), y2: 34 + i * (20 / Math.max(1, KARTEI_KANTEN_MAX - 1)), stroke: palette.border, strokeWidth: 1.5 })),
    // Reiter
    gezeigt.map((fach, i) => h('path', { key: fach, 'data-teil': 'reiter', 'data-fach': fach,
      d: 'M' + (16 + i * abstand) + ' ' + (34 + i * 3) + ' v-12 q0 -4 4 -4 h' + (breite - 8) + ' q4 0 4 4 v12',
      fill: i === 0 && fach === 'hausarzt' ? farbe : palette.surface || 'none', stroke: farbe, strokeWidth: 2, strokeLinejoin: 'round' })),
    // Kasten: Rückwand angedeutet, Vorderwand voll
    h('path', { 'data-teil': 'kasten', d: 'M10 30 L10 100 Q10 104 14 104 L146 104 Q150 104 150 100 L150 30', fill: 'none', stroke: farbe, strokeWidth: 3, strokeLinejoin: 'round' }),
    h('rect', { 'data-teil': 'vorderwand', x: 10, y: 56, width: 140, height: 48, rx: 4, fill: palette.surface || 'none', stroke: farbe, strokeWidth: 3 }),
    h('rect', { 'data-teil': 'griff', x: 66, y: 72, width: 28, height: 8, rx: 4, fill: 'none', stroke: farbe, strokeWidth: 2 }));
};
