// Regel «Zahl» (Stebler Studios 11.11.2026, Matrix §10 «Zahlen und Positionierung»):
// Jedes Instrument hat EINE Hauptzahl, auf jeder Grösse dieselbe Art. Sie steht UNTER dem Bild, gross (2xl),
// wie auf der Kachel der Übersicht. Franken klein darunter. Fahnen im Bild tragen nur Vergleichswerte.
// Eigene Franken laufen über betrag(), damit der Sichtschutz greift.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { WohnkostenInstrument } from '../components/WohnkostenInstrument.jsx';
import { MietVergleich } from '../components/MietVergleich.jsx';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const profil = (finanzen = { monthlyIncome: '6000', incomeType: 'netto' }) => ({
  basis: { canton: 'ZH', household: { adults: 1, children: [] } },
  wohnen: { rentAmount: '1650', utilities: '180' },
  finanzen,
});
const kapitel = (d) => renderToStaticMarkup(React.createElement(WohnkostenInstrument, { palette, t, wohnen: d.wohnen, allData: d, isDarkMode: false }));

describe('Regel «Zahl» · Kapitel Wohnen (gross)', () => {
  it('Hauptzahl = Anteil in %, gross, unter dem Drittel-Haus', () => {
    const html = kapitel(profil());
    const haus = html.indexOf('<svg');
    const zahl = html.indexOf('data-instrument-zahl="wohnkosten"');
    expect(haus).toBeGreaterThan(-1);
    expect(zahl).toBeGreaterThan(haus);
    expect(html).toMatch(/data-instrument-zahl="wohnkosten"[^>]*>\d+ %</);
  });
  it('Franken klein darunter, über betrag()', () => {
    const html = kapitel(profil());
    const zahl = html.indexOf('data-instrument-zahl="wohnkosten"');
    const franken = html.indexOf('data-teil="wohnkosten-franken"');
    expect(franken).toBeGreaterThan(zahl);
    expect(html).toMatch(/data-teil="wohnkosten-franken"[^>]*>wohnenInstrument\.titel: CHF 1’830</);
  });
  it('ohne Einkommen kein Anteil: dann bleiben die Franken die Hauptzahl', () => {
    const html = kapitel(profil({}));
    expect(html).not.toContain('data-instrument-zahl="wohnkosten"');
    expect(html).toContain('CHF 1’830');
  });
});

describe('Regel «Zahl» · Werkzeug Mietzins (mittel)', () => {
  it('dieselbe Hauptzahl gross wie Kachel und Kapitel', () => {
    const d = { basis: { canton: 'ZH' }, finanzen: { monthlyIncome: '6200' }, wohnen: { rentAmount: '1650', utilities: '180' } };
    const html = renderToStaticMarkup(React.createElement(MietVergleich, { palette, t, data: d }));
    expect(html).toMatch(/data-instrument-zahl="wohnkosten"[^>]*>30 %</);
  });
  it('direkt unter den Häusern, vor Legenden und Sätzen', () => {
    const d = { basis: { canton: 'ZH' }, finanzen: { monthlyIncome: '6200' }, wohnen: { rentAmount: '1650', utilities: '180' } };
    const html = renderToStaticMarkup(React.createElement(MietVergleich, { palette, t, data: d }));
    const bild = html.indexOf('data-form="haeuser"');
    const zahl = html.indexOf('data-instrument-zahl="wohnkosten"');
    expect(bild).toBeGreaterThan(-1);
    expect(zahl).toBeGreaterThan(bild);
    expect(zahl).toBeLessThan(html.indexOf('po.regionalCompare.nationalVal'));
    expect(zahl).toBeLessThan(html.indexOf('po.regionalCompare.rent.source'));
  });
});

describe('Regel «Zahl» · Quelle', () => {
  const quelle = (f) => fs.readFileSync(path.resolve(__dirname, f), 'utf8');
  it('Versicherungen: erst der Balken (Bild), dann die Summe gross', () => {
    const q = quelle('../components/VersicherungenInstrument.jsx');
    const karte = q.slice(q.indexOf("'data-teil': 'versicherungen-karte'"));
    expect(karte.indexOf('hatGeld && stapel()')).toBeGreaterThan(-1);
    expect(karte.indexOf('hatGeld && stapel()')).toBeLessThan(karte.indexOf("'data-instrument-zahl': 'versicherungen'"));
  });
  it('Vergleichshaus: keine Fahne «Sie», eigene Miete über betrag()', () => {
    const q = quelle('../components/RegionalBarometer.jsx');
    expect(q).not.toContain('fahne-abstand');
    expect(q).toMatch(/t\('strasse\.eigen'\)\) \+ ': ' \+ betrag\(userValue\)/);
  });
});
