import React from 'react';
import { INSTRUMENT_GROESSE } from '../config/tokens.js';

// Franchise-Stand als Fieberthermometer (Stebler Studios 11.11.2026). Koffer-Logik Gesundheit: ein Gegenstand aus dem
// Arztkoffer, weil «wie viel der Franchise ist erreicht?» eine gesundheitstypische Frage ist. Das Thermometer trägt nur
// diese Bedeutung; das geplante Fach für Fieber heisst darum später «Fiebertagebuch».
//
// stand = berechneFranchise(…) aus data/kvgLeistungen.js — keine eigene Rechnung hier.
// groesse (Brand Book §7b):
//   klein 64  — liegend, nur die Franchise, Strich am Ende. Kachel der Übersicht. Keine Wörter.
//   mittel 128 — liegend, hinter dem Strich der Selbstbehalt als zweite, gestrichelte Strecke. KVG-Reiter.
//   gross 256 — stehend, Kugel unten, mit Ablesewörtern (übersetzt, nie rohe Franken: Sichtschutz).
// Ruhig: eine Farbe (sky), keine Ampel, kein Rot auch über der Franchise. Die Zahl steht UNTER dem Bild
// (Regel «Zahl»), nicht im Bild.
const anteil = (wert, max) => (max > 0 ? Math.max(0, Math.min(1, wert / max)) : 0);
const r2 = (n) => Math.round(n * 1000) / 1000;

export const FranchiseThermometer = ({ palette, stand, groesse = 'klein', t }) => {
  const h = React.createElement;
  const a = anteil(stand.franchiseVerbraucht, stand.franchise);
  const sb = anteil(stand.selbstbehalt, stand.selbstbehaltMax);
  const fuellung = palette.sky;
  const bahn = palette.border;
  const strich = palette.text;
  const px = INSTRUMENT_GROESSE[groesse] || INSTRUMENT_GROESSE.klein;
  const daten = { 'aria-hidden': true, 'data-franchise': groesse, 'data-anteil': r2(a), 'data-selbstbehalt-anteil': r2(sb) };

  if (groesse === 'gross') {
    // Stehend: Kugel unten (cy 140), Röhre bis oben. Franchise unten zwei Drittel, Selbstbehalt darüber.
    const oben = 12, fStrich = 52, unten = 128, x = 26, w = 12;
    const fHoehe = unten - fStrich, sHoehe = fStrich - oben;
    // viewBox in echten Pixeln (160 × 256 = Höhe gross): die Zeichnung in Einheiten 100 × 160, mit 1.6 skaliert;
    // die Ablesewörter ausserhalb der Skalierung, 13 px (Regel H, Mindestschrift).
    const k = 1.6;
    return h('svg', { viewBox: '0 0 160 256', width: '100%', ...daten, 'data-lage': 'stehend', style: { maxWidth: '160px', height: 'auto', display: 'block', overflow: 'visible' } },
      h('g', { transform: 'scale(' + k + ')' },
        h('rect', { x, y: oben, width: w, height: unten - oben + 4, rx: w / 2, fill: 'none', stroke: bahn, strokeWidth: 1.5 }),
        h('circle', { cx: x + w / 2, cy: 140, r: 13, fill: a > 0 ? fuellung : 'none', stroke: a > 0 ? fuellung : bahn, strokeWidth: 1.5 }),
        a > 0 && h('rect', { 'data-teil': 'saeule', x: x + 3, y: unten - fHoehe * a, width: w - 6, height: fHoehe * a + 6, fill: fuellung }),
        sb > 0 && h('rect', { 'data-teil': 'selbstbehalt-saeule', x: x + 3, y: fStrich - sHoehe * sb, width: w - 6, height: sHoehe * sb, fill: fuellung, opacity: 0.6 }),
        h('rect', { 'data-teil': 'selbstbehalt', x: x + 3, y: oben + 2, width: w - 6, height: sHoehe - 2, fill: 'none', stroke: bahn, strokeDasharray: '3 2' }),
        h('line', { 'data-teil': 'franchise-strich', x1: x - 6, y1: fStrich, x2: x + w + 6, y2: fStrich, stroke: strich, strokeWidth: 2 })),
      t && h('text', { 'data-teil': 'ablese-franchise', x: (x + w + 12) * k, y: fStrich * k + 5, fontSize: 13, fill: strich }, t('thermometer.franchise')),
      t && h('text', { 'data-teil': 'ablese-selbstbehalt', x: (x + w + 12) * k, y: (oben + 10) * k, fontSize: 13, fill: palette.mid }, t('thermometer.selbstbehalt')));
  }

  // Liegend: Kugel links, Röhre nach rechts.
  const mitSb = groesse === 'mittel';
  const vb = mitSb ? { w: 120, h: 40 } : { w: 60, h: 40 };
  const kx = 10, ry = 13, rh = 14;
  const start = kx + 6, ende = vb.w - 4;
  const fEnde = mitSb ? start + (ende - start) * (2 / 3) : ende - 2;
  return h('svg', { viewBox: '0 0 ' + vb.w + ' ' + vb.h, width: '100%', ...daten, 'data-lage': 'liegend', style: { maxWidth: px + 'px', height: 'auto', display: 'block', overflow: 'visible' } },
    h('rect', { x: start - 2, y: ry, width: (mitSb ? ende : fEnde) - start + 4, height: rh, rx: rh / 2, fill: 'none', stroke: bahn, strokeWidth: 2 }),
    h('circle', { cx: kx, cy: ry + rh / 2, r: 9, fill: a > 0 ? fuellung : 'none', stroke: a > 0 ? fuellung : bahn, strokeWidth: 2 }),
    a > 0 && h('rect', { 'data-teil': 'saeule', x: start - 3, y: ry + 2.5, width: (fEnde - start) * a + 3, height: rh - 5, fill: fuellung }),
    mitSb && h('rect', { 'data-teil': 'selbstbehalt', x: fEnde + 2, y: ry + 2.5, width: ende - fEnde - 4, height: rh - 5, fill: 'none', stroke: bahn, strokeDasharray: '3 2' }),
    mitSb && sb > 0 && h('rect', { 'data-teil': 'selbstbehalt-saeule', x: fEnde + 2, y: ry + 2.5, width: (ende - fEnde - 4) * sb, height: rh - 5, fill: fuellung, opacity: 0.6 }),
    h('line', { 'data-teil': 'franchise-strich', x1: fEnde, y1: ry - 7, x2: fEnde, y2: ry + rh + 7, stroke: strich, strokeWidth: 2.5 }));
};

export default FranchiseThermometer;
