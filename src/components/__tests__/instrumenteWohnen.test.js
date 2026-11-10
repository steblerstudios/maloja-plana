// Wohnen bekommt zwei Instrumente in der Kapitelzeile (Stebler Studios 10.11.2026, «zwei Instrumente je
// Lebensbereich», Start «Wohnen (C + D)»): Wohnkosten-Anteil und Miete im Vergleich. Gleiches System wie
// Tank und Schild: kleines Bild · grosse Zahl · Satz, dieselben Rechnungen wie im Kapitel.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { lageZurRegion, RegionalBarometerKlein, mietVorbehalte } from '../RegionalBarometer.jsx';
import { DrittelBalkenKlein, wohnkostenSatzKey } from '../WohnkostenInstrument.jsx';

const palette = { surface: '#fff', border: '#ccc', text: '#111', mid: '#444', soft: '#777', sand: '#c90', sage: '#6a6', gold: '#b80', sky: '#69c' };
const t = (k, p) => k + (p ? JSON.stringify(p) : '');
const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

describe('lageZurRegion: eine Rechnung für Barometer und Kachel', () => {
  it('±2 % gilt als «etwa gleich»', () => {
    expect(lageZurRegion(1650, 1732)).toEqual({ pct: -5, richtung: 'Below' });
    expect(lageZurRegion(1760, 1732)).toEqual({ pct: 2, richtung: 'Equal' });
    expect(lageZurRegion(1900, 1732)).toEqual({ pct: 10, richtung: 'Above' });
  });
  it('ohne Werte: nichts', () => {
    expect(lageZurRegion(0, 1732)).toBeNull();
    expect(lageZurRegion(1650, 0)).toBeNull();
  });
  it('das grosse Barometer nutzt dieselbe Funktion', () => {
    expect(quelle('../RegionalBarometer.jsx')).toMatch(/const lage = hasUser \? lageZurRegion\(userValue, regional\) : null;/);
  });
});

describe('kleine Bilder: 64 px, keine Wörter', () => {
  it('Drittel-Balken', () => {
    const html = renderToStaticMarkup(React.createElement(DrittelBalkenKlein, { palette, r: { anteil: 30, ueberDrittel: false } }));
    expect(html).toContain('data-drittel="klein"');
    expect(html).toContain('max-width:64px');
    expect(html).not.toMatch(/<text/);
  });
  it('Miet-Barometer', () => {
    const html = renderToStaticMarkup(React.createElement(RegionalBarometerKlein, { palette, comparison: { regional: 1732, national: 1446 }, userValue: 1650 }));
    expect(html).toContain('data-barometer="klein"');
    expect(html).toContain('max-width:64px');
    expect(html).not.toMatch(/<text/);
  });
});

describe('Kachel-Texte und Vorbehalte', () => {
  it('Satz nennt, wessen Einkommen gemeint ist (Partner/in, brutto)', () => {
    expect(wohnkostenSatzKey({})).toBe('instrumente.wohnkostenSatz');
    expect(wohnkostenSatzKey({ mitPartner: true })).toBe('instrumente.wohnkostenSatzEigen');
    expect(wohnkostenSatzKey({ brutto: true, ganzBrutto: true })).toBe('instrumente.wohnkostenSatzBrutto');
    expect(wohnkostenSatzKey({ brutto: true })).toBe('instrumente.wohnkostenSatzTeilsBrutto');
  });
  it('Mietvergleich nennt die Zimmerzahl und die Unsicherheiten wie im Kapitel', () => {
    const z = mietVorbehalte(t, { roomKey: 'r3', zimmerAngenommen: true, wenigeAntworten: true });
    expect(z[0]).toContain('vergleichZimmer');
    expect(z.join(' ')).toContain('zimmerAngenommen');
    expect(z.join(' ')).toContain('wenigeAntworten');
  });
  it('Wohnen steht in der Kapitelzeile, Drittel als Faustregel benannt', () => {
    expect(quelle('../../Dashboard.jsx')).toMatch(/wohnen: \['wohnkosten', 'miete'\]/);
    expect(quelle('../InstrumentePanel.jsx')).toMatch(/mehr: \[t\('instrumente\.wohnkostenDrittel'\)\]/);
  });
});
