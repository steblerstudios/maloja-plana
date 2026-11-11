// Drittel-Haus ausgebaut (Stebler Studios 11.11.2026, Kombination A–E nach Grösse: «Ja, so bauen»).
//   A «!» an der Drittel-Linie — graphit, Rosé (roseDeep) erst darüber; Linie färbt mit. Ohne Urteil kein «!».
//   B Füllung steigt beim Erscheinen (duration.slow, abbremsend) und folgt dem Regler (transform, nicht Höhe);
//     «weniger Bewegung» stellt beides still (globaler Block in tokens.css, beide Schalter).
//   C Viertel-Strich (Budgetberatung Schweiz: «nicht mehr als ein Viertel der Nettoeinnahmen») — gross + mittel,
//     nur netto und mit Urteil.
//   D «alles andere» im oberen Teil — nur gross.
//   E Partner-Haus geteilt (Sie | Partner/in nach Netto-Einnahmen) — nur gross, nur im Haushalt-Fall.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DrittelHaus } from '../components/WohnkostenInstrument.jsx';
import { duration } from '../config/tokens.js';

const palette = { text: '#111', mid: '#555', sand: '#c90', roseDeep: '#a33' };
const t = (k) => ({ 'wohnenInstrument.hausRest': 'alles andere', 'wohnenInstrument.hausSie': 'Sie', 'wohnenInstrument.hausPartner': 'Partner/in' }[k] || k);
const haus = (p) => renderToStaticMarkup(React.createElement(DrittelHaus, { palette, t, fuell: '#7a5', anteil: 28, ueberDrittel: false, ...p }));
const teil = (html, name) => (html.match(new RegExp('<[^>]*data-teil="' + name + '"[^>]*>')) || [''])[0];

describe('A · «!» an der Drittel-Linie', () => {
  it('darunter: graphit, in allen Grössen', () => {
    for (const groesse of ['klein', 'mittel', 'gross']) {
      const h = haus({ groesse });
      expect(teil(h, 'drittel-ausrufe'), groesse).toContain('fill="#111"');
      expect(teil(h, 'drittel-haus-drittel'), groesse).toContain('stroke="#111"');
    }
  });
  it('darüber: Rosé, Linie und «!» zusammen', () => {
    const h = haus({ anteil: 41, ueberDrittel: true, groesse: 'gross' });
    expect(teil(h, 'drittel-ausrufe')).toContain('fill="#a33"');
    expect(teil(h, 'drittel-haus-drittel')).toContain('stroke="#a33"');
  });
  it('ohne Urteil (mitPartner) kein «!» und keine Rosé-Linie', () => {
    const h = haus({ anteil: 41, ueberDrittel: true, mitPartner: true, groesse: 'gross' });
    expect(teil(h, 'drittel-ausrufe')).toBe('');
    expect(h).not.toContain('#a33');
  });
});

describe('B · Füllung steigt', () => {
  it('Füllung als scaleY des ganzen Hauses, mit Übergang und Erscheinen aus Tokens', () => {
    const f = teil(haus({ groesse: 'gross' }), 'drittel-haus-fuellung');
    expect(f).toMatch(/transform:scaleY\(0\.28\)/);
    expect(f).toContain('transform-origin:bottom');
    expect(f).toContain('transition:transform ' + duration.slow + 'ms');
    expect(f).toContain('animation:mp-steigen ' + duration.slow + 'ms');
  });
  it('die Keyframes stehen in tokens.css, der globale Block «weniger Bewegung» deckt sie', () => {
    const css = readFileSync(fileURLToPath(new URL('../tokens.css', import.meta.url)), 'utf8');
    expect(css).toMatch(/@keyframes mp-steigen\s*\{\s*from\s*\{\s*transform:\s*scaleY\(0\)/);
    expect(css).toMatch(/:root\[data-reduce-motion="1"\] \*,/);
  });
});

describe('C · Viertel-Strich', () => {
  it('gross und mittel, nicht klein', () => {
    expect(teil(haus({ groesse: 'gross' }), 'drittel-haus-viertel')).not.toBe('');
    expect(teil(haus({ groesse: 'mittel' }), 'drittel-haus-viertel')).not.toBe('');
    expect(teil(haus({ groesse: 'klein' }), 'drittel-haus-viertel')).toBe('');
  });
  it('nur netto und mit Urteil (die Empfehlung gilt für Nettoeinnahmen)', () => {
    expect(teil(haus({ groesse: 'gross', brutto: true }), 'drittel-haus-viertel')).toBe('');
    expect(teil(haus({ groesse: 'gross', mitPartner: true }), 'drittel-haus-viertel')).toBe('');
  });
});

describe('C · Legende mit Quelle im Kapitel', () => {
  it('Viertel-Legende in allen fünf Sprachen nennt die Budgetberatung Schweiz', async () => {
    for (const lang of ['de', 'fr', 'it', 'en', 'rm']) {
      const s = (await import(`../i18n/${lang}.js`)).default;
      expect(s.wohnenInstrument.viertel, lang).toMatch(/Budgetberatung Schweiz/);
    }
    expect(readFileSync(fileURLToPath(new URL('../components/WohnkostenInstrument.jsx', import.meta.url)), 'utf8'))
      .toMatch(/!r\.mitPartner && !r\.brutto && React\.createElement\('span', \{ 'data-teil': 'viertel-legende' \}/);
  });
});

describe('D · «alles andere» und E · geteilt', () => {
  it('D nur gross', () => {
    expect(haus({ groesse: 'gross' })).toContain('alles andere');
    expect(haus({ groesse: 'mittel' })).not.toContain('alles andere');
    expect(haus({ groesse: 'klein' })).not.toContain('alles andere');
  });
  it('E nur gross und nur mit Haushalt-Teilen: Strich bei Sie ÷ (Sie + Partner/in)', () => {
    const h = haus({ groesse: 'gross', teile: { sie: 6000, partner: 4000 } });
    expect(teil(h, 'drittel-haus-teilung')).toMatch(/x1="69\.6"/); // 12 + 96 × 0.6
    expect(teil(h, 'drittel-haus-teilung')).toMatch(/y1="68"/); // unter dem obersten Stock: «alles andere» bleibt frei
    expect(h).toContain('>Sie<');
    expect(h).toContain('>Partner/in<');
    expect(teil(haus({ groesse: 'mittel', teile: { sie: 6000, partner: 4000 } }), 'drittel-haus-teilung')).toBe('');
    expect(teil(haus({ groesse: 'gross' }), 'drittel-haus-teilung')).toBe('');
  });
  it('Schrift im grossen Haus mindestens 13 px', () => {
    const h = haus({ groesse: 'gross', teile: { sie: 6000, partner: 4000 } });
    const breite = Number(h.match(/viewBox="0 0 (\d+)/)[1]);
    for (const m of h.matchAll(/<text[^>]*font-size="([\d.]+)"/g)) expect(Number(m[1]) * 256 / breite).toBeGreaterThanOrEqual(13);
  });
});
