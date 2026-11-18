import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DrittelHaus } from '../bereiche/wohnen/wohnen.js';
import { RegionalBarometer } from '../components/RegionalBarometer.jsx';
import { Vergleichshaus, lageZurRegion } from '../bereiche/wohnen/wohnen.js';

// Wohnen: Drittel-Haus + Häuserzeile (Stebler Studios 11.11.2026, «ja a und b kombiniert»).
// A: das Haus ist das Einkommen, drei Stockwerke, Erdgeschoss = ein Drittel; die Wohnkosten füllen es.
// B: die Miete als Häuserzeile — Sie gefüllt, Region mit farbigem Dach, Schweiz gestrichelt, Drittel als Linie.
// Seit 18.11.2026 (Bauplan Wohnen): B ist das eine Vergleichshaus, das Drittel steht nur im Drittel-Haus.
// Gleich zu lesen wie das Barometer (Füllung · Punkt · Strich · «!»); Lohn und Prämie bleiben Balken.

const P = { text: '#111111', mid: '#666666', sand: '#C9A86A', surface: '#FFFFFF', roseDeep: '#AA3344', gold: '#B8955A', sage: '#5F7F68', goldDeep: '#8A6A35', sageDeep: '#466050', border: '#DDDDDD', skyDeep: '#335577', sky: '#5577AA' };
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const SRC = path.resolve(__dirname, '..');
const lies = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
// Seit 11.11.2026 (B · Füllung steigt) ist die Füllung das ganze Haus (72), gestaucht mit scaleY auf den Anteil.
const hoehe = (html) => {
  const f = html.match(/<[^>]*data-teil="drittel-haus-fuellung"[^>]*>/)?.[0] || '';
  return Number(f.match(/height="([\d.]+)"/)?.[1] || 0) * Number(f.match(/scaleY\(([\d.]+)\)/)?.[1] || 0);
};

describe('Drittel-Haus', () => {
  const haus = (props) => renderToStaticMarkup(React.createElement(DrittelHaus, { palette: P, fuell: '#6C8343', ...props }));

  it('die Füllung wächst mit dem Anteil; ein Drittel füllt genau das Erdgeschoss', () => {
    const drittel = hoehe(haus({ anteil: 100 / 3 }));
    expect(drittel).toBeCloseTo(24, 6); // ein Stockwerk
    expect(hoehe(haus({ anteil: 50 }))).toBeCloseTo(36, 6);
    expect(hoehe(haus({ anteil: 150 }))).toBeCloseTo(72, 6); // nie über das Dach
    expect(haus({ anteil: 0 })).not.toContain('drittel-haus-fuellung');
  });

  // Seit 11.11.2026 (Stebler Studios «darf grün gefüllt werden und nicht golden»): die Füllung bleibt Birne,
  // die Warnung tragen Linie und «!» (drittelHausAusbau.test.js).
  it('die Füllung ist immer Birne, auch über einem Drittel und mit Partner/in', () => {
    const fuellung = (p) => (haus(p).match(/<rect[^>]*data-teil="drittel-haus-fuellung"[^>]*>/) || [''])[0];
    expect(fuellung({ anteil: 40, ueberDrittel: true })).toContain('fill="#6C8343"');
    expect(fuellung({ anteil: 20, ueberDrittel: false })).toContain('fill="#6C8343"');
    expect(fuellung({ anteil: 40, ueberDrittel: true, mitPartner: true })).toContain('fill="#6C8343"');
    expect(haus({ anteil: 40, ueberDrittel: true })).not.toContain('#C9A86A');
  });

  it('Grösse aus der Instrument-Stufe, fürs Vorlesen stumm', () => {
    expect(haus({ anteil: 30 })).toContain('max-width:256px');
    expect(haus({ anteil: 30, groesse: 'klein' })).toContain('max-width:64px');
    expect(haus({ anteil: 30 })).toContain('aria-hidden="true"');
  });
});

// Überholt 18.11.2026 (Bauplan Wohnen): die Häuserzeile im RegionalBarometer (form 'haeuser', drei Häuser, Drittel-Linie
// quer über die Strasse) gibt es nicht mehr. Die Miete ist überall das eine Vergleichshaus (wohnenStrasse.test.js), das
// Barometer ist wieder nur der Balken (Prämie, Lohn).
describe('Vergleichshaus statt Häuserzeile', () => {
  const comparison = { regional: 1732, national: 1446, diffPct: 19.8, year: 2024, roomKey: 'r3' };
  it('ein Haus, rein Bild (aria-hidden): die Sätze stehen daneben', () => {
    const html = renderToStaticMarkup(React.createElement(Vergleichshaus, { palette: P, lage: { netto: 1650, vergleich: comparison, lage: lageZurRegion(1650, 1732) }, fuell: '#6C8343', groesse: 'mittel' }));
    expect((html.match(/data-teil="vergleichs-haus"/g) || []).length).toBe(1);
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('data-form="haeuser"');
  });
  it('Standard bleibt der Balken (Lohn, Prämie)', () => {
    const html = renderToStaticMarkup(React.createElement(RegionalBarometer, { palette: P, t, comparison, kind: 'premium', userValue: 400 }));
    expect(html).not.toContain('data-form="haeuser"');
    expect(html).not.toContain('vergleichs-haus');
  });
});

describe('Wohnen: wo welches Bild steht', () => {
  it('Kapitel gross, Werkzeug und Budget mittel, Kachel klein — überall Drittel-Haus und Vergleichshaus', () => {
    const z = lies('bereiche/wohnen/zuhause.jsx');
    expect(z).toMatch(/h\(DrittelHaus, \{/);
    expect(z).toMatch(/h\(Vergleichshaus, \{/);
    expect(z).toMatch(/h\(WohnenStrasse, \{ palette, t, r, ml, hilfe, groesse: 'gross'/);
    expect(z).toMatch(/h\(WohnenStrasse, \{ palette, t, r, ml, hilfe, groesse: 'mittel'/);
    expect(z).not.toContain("'drittel-balken'");
    const budget = lies('BudgetSync.jsx');
    expect(budget).toMatch(/React\.createElement\(Vergleichshaus, \{[^}]*groesse: 'mittel' \}\)/);
    expect(budget).toMatch(/React\.createElement\(DrittelHaus, \{[^}]*groesse: 'mittel' \}\)/);
    for (const f of ['bereiche/wohnen/zuhause.jsx', 'BudgetSync.jsx', 'components/InstrumentePanel.jsx', 'MietzinsOrientierung.jsx']) {
      expect(lies(f), f).not.toMatch(/form: 'haeuser'|HaeuserzeileKlein|HaeuserVergleich/);
    }
  });
});
