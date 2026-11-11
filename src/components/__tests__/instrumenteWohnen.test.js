// Wohnen bekommt zwei Instrumente in der Kapitelzeile (Stebler Studios 10.11.2026, «zwei Instrumente je
// Lebensbereich», Start «Wohnen (C + D)»): Wohnkosten-Anteil und Miete im Vergleich. Gleiches System wie
// Tank und Schild: kleines Bild · grosse Zahl · Satz, dieselben Rechnungen wie im Kapitel.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { lageZurRegion, HaeuserzeileKlein, mietVorbehalte } from '../RegionalBarometer.jsx';
import { DrittelHaus, wohnkostenSatzKey } from '../WohnkostenInstrument.jsx';

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

describe('kleine Bilder: 64 px, keine Wörter, dasselbe Bild wie im Kapitel', () => {
  // Stebler Studios 11.11.2026 («Kacheln 64 Wohnen»): die Kachel zeigt das Drittel-Haus und die Häuserzeile
  // klein, nicht mehr Balken und Barometer — ein Bild, eine Bedeutung (Brand Book §7b).
  it('Drittel-Haus klein', () => {
    const html = renderToStaticMarkup(React.createElement(DrittelHaus, { palette, anteil: 30, ueberDrittel: false, fuell: '#9a6', groesse: 'klein' }));
    expect(html).toContain('data-teil="drittel-haus"');
    expect(html).toContain('max-width:64px');
    // Klein nur das «!» (A) — keine Wörter, kein Viertel (drittelHausAusbau.test.js).
    expect([...html.matchAll(/<text[^>]*>([^<]*)</g)].map((m) => m[1])).toEqual(['!']);
  });
  it('Häuserzeile klein: Sie gefüllt, Region mit Dach in der Lage-Farbe, Schweiz gestrichelt', () => {
    const html = renderToStaticMarkup(React.createElement(HaeuserzeileKlein, { palette, comparison: { regional: 1732, national: 1446 }, userValue: 1900, fillColor: '#9a6' }));
    expect(html).toContain('data-form="haeuser-klein"');
    expect(html).toContain('max-width:64px');
    expect(html).not.toMatch(/<text/);
    expect(html).toContain('fill="#9a6"');
    expect(html).toContain('fill="#b80"'); // über der Region: Dach gold, wie der Punkt im Barometer
    expect(html).toContain('stroke-dasharray="3 2"');
  });
  it('ohne Vergleich: kein Bild', () => {
    expect(renderToStaticMarkup(React.createElement(HaeuserzeileKlein, { palette, comparison: null, userValue: 1900 }))).toBe('');
  });
  it('die Kacheln nutzen genau diese Bilder', () => {
    const panel = quelle('../InstrumentePanel.jsx');
    expect(panel).toMatch(/h\(DrittelHaus, \{[^}]*groesse: 'klein'/);
    expect(panel).toMatch(/h\(HaeuserzeileKlein, \{/);
    expect(panel).not.toMatch(/DrittelBalkenKlein|RegionalBarometerKlein/);
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
