// Wohnen bekommt zwei Instrumente in der Kapitelzeile (Stebler Studios 10.11.2026, «zwei Instrumente je
// Lebensbereich», Start «Wohnen (C + D)»): Wohnkosten-Anteil und Miete im Vergleich. Gleiches System wie
// Tank und Schild: kleines Bild · grosse Zahl · Satz, dieselben Rechnungen wie im Kapitel.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DrittelHaus, Vergleichshaus, wohnkostenSatzKey, lageZurRegion, mietVorbehalte } from '../../bereiche/wohnen/wohnen.js';

const palette = { surface: '#fff', border: '#ccc', text: '#111', mid: '#444', soft: '#777', sand: '#c90', sage: '#6a6', gold: '#b80', goldDeep: '#850', sageDeep: '#363', sky: '#69c', skyDeep: '#357' };
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
  it('Barometer, Wohnen und Kachel nutzen dieselbe Funktion (seit 18.11.2026 in utils/lage.js)', () => {
    expect(quelle('../RegionalBarometer.jsx')).toMatch(/import \{ lageZurRegion \} from '\.\.\/utils\/lage\.js';/);
    expect(quelle('../RegionalBarometer.jsx')).toMatch(/const lage = hasUser \? lageZurRegion\(userValue, regional\) : null;/);
    expect(quelle('../../bereiche/wohnen/rechnung.js')).toMatch(/import \{ lageZurRegion, lageWert \} from '\.\.\/\.\.\/utils\/lage\.js';/);
    expect(quelle('../InstrumentePanel.jsx')).toMatch(/lageZurRegion/);
  });
});

describe('kleine Bilder: 64 px, keine Wörter, dasselbe Bild wie im Kapitel', () => {
  // Stebler Studios 11.11.2026 («Kacheln 64 Wohnen»): die Kachel zeigt das Drittel-Haus und (seit 18.11.2026) das Vergleichshaus
  // klein, nicht mehr Balken und Barometer — ein Bild, eine Bedeutung (Brand Book §7b).
  it('Drittel-Haus klein', () => {
    const html = renderToStaticMarkup(React.createElement(DrittelHaus, { palette, anteil: 30, ueberDrittel: false, fuell: '#9a6', groesse: 'klein' }));
    expect(html).toContain('data-teil="drittel-haus"');
    expect(html).toContain('max-width:64px');
    // Klein nur das «!» (A) — keine Wörter, kein Viertel (drittelHausAusbau.test.js).
    expect([...html.matchAll(/<text[^>]*>([^<]*)</g)].map((m) => m[1])).toEqual(['!']);
  });
  // Überholt 18.11.2026 (Bauplan Wohnen): statt der Häuserzeile klein das Vergleichshaus klein (dasselbe Bild wie im Kapitel).
  const klein = (p) => renderToStaticMarkup(React.createElement(Vergleichshaus, { palette, fuell: '#9a6', groesse: 'klein', ...p }));
  it('Vergleichshaus klein: Ihre Miete gefüllt, Kanton in der Lage-Farbe, Schweiz gestrichelt, keine Wörter', () => {
    const html = klein({ lage: { netto: 1900, vergleich: { regional: 1732, national: 1446 }, lage: lageZurRegion(1900, 1732) } });
    expect(html).toContain('data-teil="vergleichs-haus" data-groesse="klein"');
    expect(html).toContain('max-width:64px');
    expect(html).not.toMatch(/<text/);
    expect(html).toMatch(/data-teil="vergleich-fuellung"[^>]*fill="#9a6"/);
    expect(html).toMatch(/data-teil="stock-kanton"[^>]*stroke="#b80"/); // über dem Kanton: gold, wie der Punkt im Barometer
    expect(html).toMatch(/data-teil="stock-schweiz"[^>]*stroke-dasharray="4 3"/);
  });
  it('ohne Vergleich: kein Bild', () => {
    expect(klein({ lage: null })).toBe('');
    expect(klein({ lage: { netto: 1900, vergleich: null } })).toBe('');
  });
  it('die Kacheln nutzen genau diese Bilder', () => {
    const panel = quelle('../InstrumentePanel.jsx');
    expect(panel).toMatch(/h\(DrittelHaus, \{[^}]*groesse: 'klein'/);
    expect(panel).toMatch(/h\(Vergleichshaus, \{[^)]*groesse: 'klein' \}/);
    expect(panel).not.toMatch(/HaeuserzeileKlein/);
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
