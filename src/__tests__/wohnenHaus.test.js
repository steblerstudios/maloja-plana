import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DrittelHaus } from '../components/WohnkostenInstrument.jsx';
import { RegionalBarometer } from '../components/RegionalBarometer.jsx';

// Wohnen: Drittel-Haus + Häuserzeile (Stebler Studios 11.11.2026, «ja a und b kombiniert»).
// A: das Haus ist das Einkommen, drei Stockwerke, Erdgeschoss = ein Drittel; die Wohnkosten füllen es.
// B: die Miete als Häuserzeile — Sie gefüllt, Region mit farbigem Dach, Schweiz gestrichelt, Drittel als Linie.
// Gleich zu lesen wie das Barometer (Füllung · Punkt · Strich · «!»); Lohn und Prämie bleiben Balken.

const P = { text: '#111111', mid: '#666666', sand: '#C9A86A', surface: '#FFFFFF', roseDeep: '#AA3344', gold: '#B8955A', sage: '#5F7F68', goldDeep: '#8A6A35', sageDeep: '#466050', border: '#DDDDDD', skyDeep: '#335577', sky: '#5577AA' };
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const SRC = path.resolve(__dirname, '..');
const lies = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
const hoehe = (html) => Number(html.match(/data-teil="drittel-haus-fuellung"[^>]*height="([\d.]+)"/)?.[1] || 0);

describe('Drittel-Haus', () => {
  const haus = (props) => renderToStaticMarkup(React.createElement(DrittelHaus, { palette: P, fuell: '#6C8343', ...props }));

  it('die Füllung wächst mit dem Anteil; ein Drittel füllt genau das Erdgeschoss', () => {
    const drittel = hoehe(haus({ anteil: 100 / 3 }));
    expect(drittel).toBeCloseTo(24, 6); // ein Stockwerk
    expect(hoehe(haus({ anteil: 50 }))).toBeCloseTo(36, 6);
    expect(hoehe(haus({ anteil: 150 }))).toBeCloseTo(72, 6); // nie über das Dach
    expect(haus({ anteil: 0 })).not.toContain('drittel-haus-fuellung');
  });

  it('über einem Drittel Sand, sonst Birne; mit Partner/in immer Birne (kein Urteil)', () => {
    expect(haus({ anteil: 40, ueberDrittel: true })).toContain('fill="#C9A86A"');
    expect(haus({ anteil: 20, ueberDrittel: false })).toContain('fill="#6C8343"');
    expect(haus({ anteil: 40, ueberDrittel: true, mitPartner: true })).not.toContain('fill="#C9A86A"');
  });

  it('Grösse aus der Instrument-Stufe, fürs Vorlesen stumm', () => {
    expect(haus({ anteil: 30 })).toContain('max-width:256px');
    expect(haus({ anteil: 30, groesse: 'klein' })).toContain('max-width:64px');
    expect(haus({ anteil: 30 })).toContain('aria-hidden="true"');
  });
});

describe('Häuserzeile (RegionalBarometer form «haeuser»)', () => {
  const comparison = { regional: 1732, national: 1446, diffPct: 19.8, year: 2024, roomKey: '3' };
  const zeile = (props) => renderToStaticMarkup(React.createElement(RegionalBarometer, { palette: P, t, comparison, kind: 'rent', fillColor: '#6C8343', form: 'haeuser', ...props }));

  it('drei Häuser, dieselben Texte und dasselbe aria-Label wie der Balken', () => {
    const html = zeile({ userValue: 1650 });
    const balken = renderToStaticMarkup(React.createElement(RegionalBarometer, { palette: P, t, comparison, kind: 'rent', fillColor: '#6C8343', userValue: 1650 }));
    expect(html).toContain('data-form="haeuser"');
    expect((html.match(/<rect /g) || []).length).toBe(3);
    const aria = (h) => h.match(/role="img" aria-label="([^"]*)"/)[1];
    expect(aria(html)).toBe(aria(balken));
    expect(html).toContain('po.regionalCompare.rent.yourVal');
  });

  it('Drittel als Linie quer über die Strasse, rose nur wenn Ihr Haus darüber ragt', () => {
    const unter = zeile({ userValue: 1650, thresholdValue: 1800 });
    expect(unter).toContain('data-teil="drittel-linie"');
    expect(unter).not.toContain('#AA3344');
    const drueber = zeile({ userValue: 1650, thresholdValue: 1500, showThresholdText: true });
    expect(drueber).toContain('stroke="#AA3344"');
    expect(drueber).toContain('thresholdBreachedLine');
    expect(zeile({ userValue: 1650 })).not.toContain('drittel-linie');
  });

  it('Standard bleibt der Balken (Lohn, Prämie)', () => {
    const html = renderToStaticMarkup(React.createElement(RegionalBarometer, { palette: P, t, comparison, kind: 'premium', userValue: 400 }));
    expect(html).not.toContain('data-form="haeuser"');
  });
});

describe('Wohnen: wo welches Bild steht', () => {
  it('Kapitel: Drittel-Haus und Häuserzeile gross; Mietzins und Budget: Häuserzeile mittel', () => {
    const k = lies('components/WohnkostenInstrument.jsx');
    expect(k).toMatch(/React\.createElement\(DrittelHaus, \{/);
    expect(k).toMatch(/form: 'haeuser', maxBreite: INSTRUMENT_GROESSE\.gross/);
    expect(k).not.toContain("'drittel-balken'");
    for (const f of ['components/MietVergleich.jsx', 'BudgetSync.jsx']) {
      expect(lies(f)).toMatch(/kind: 'rent', form: 'haeuser',/);
    }
  });
});
