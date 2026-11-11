// Franchise-Stand als Fieberthermometer (Stebler Studios 11.11.2026: «Ja, Thermometer + Rechnung A», dann
// «A · Franchise»: das Thermometer trägt nur diese eine Bedeutung). Koffer-Logik Gesundheit: Gegenstand aus dem
// Arztkoffer, weil die Frage «wie viel der Franchise ist erreicht?» gesundheitstypisch ist.
// Drei Grössen aus EINEM Bauteil (Brand Book §7b): klein 64 liegend (Kachel), mittel 128 liegend mit Selbstbehalt
// (KVG-Reiter), gross 256 stehend (Zuhause — Ort noch offen, darum hier nur das Bauteil).
// Regel «Zahl» (§10, #861): Hauptzahl gross UNTER dem Bild, Franken über betrag().
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FranchiseThermometer } from '../components/FranchiseThermometer.jsx';
import { KVGLeistungen } from '../KVGLeistungen.jsx';
import { berechneFranchise } from '../data/kvgLeistungen.js';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const bild = (stand, groesse) => renderToStaticMarkup(React.createElement(FranchiseThermometer, { palette, stand, groesse }));
const zahl = (html, attr) => Number((html.match(new RegExp(attr + '="([0-9.]+)"')) || [])[1]);

describe('FranchiseThermometer · ein Bauteil, drei Grössen', () => {
  const stand = berechneFranchise(1500, 420);

  it('klein: liegend, Säule bis zum Anteil, Strich am Ende der Franchise', () => {
    const html = bild(stand, 'klein');
    expect(html).toContain('data-franchise="klein"');
    expect(html).toContain('data-lage="liegend"');
    expect(zahl(html, 'data-anteil')).toBeCloseTo(0.28, 2);
    expect(html).toContain('data-teil="franchise-strich"');
    expect(html).not.toContain('data-teil="selbstbehalt"');
  });

  it('mittel: dazu der Selbstbehalt als zweite Strecke hinter dem Strich', () => {
    const html = bild(berechneFranchise(300, 1300), 'mittel');
    expect(html).toContain('data-franchise="mittel"');
    expect(html).toContain('data-teil="selbstbehalt"');
    // 1300 − 300 = 1000 über der Franchise → 10 % = 100 von 700
    expect(zahl(html, 'data-selbstbehalt-anteil')).toBeCloseTo(100 / 700, 3);
  });

  it('gross: stehend, mit Ablesewörtern (übersetzt, keine rohen Franken)', () => {
    const html = renderToStaticMarkup(React.createElement(FranchiseThermometer, { palette, stand, groesse: 'gross', t }));
    expect(html).toContain('data-franchise="gross"');
    expect(html).toContain('data-lage="stehend"');
    expect(html).toMatch(/data-teil="ablese-franchise"[^>]*>thermometer\.franchise</);
    expect(html).toMatch(/data-teil="ablese-selbstbehalt"[^>]*>thermometer\.selbstbehalt</);
    expect(html).not.toMatch(/1.?500/);
  });

  it('ohne Kosten: keine Säule, kein erfundener Stand', () => {
    const html = bild(berechneFranchise(1500, 0), 'klein');
    expect(zahl(html, 'data-anteil')).toBe(0);
    expect(html).not.toContain('data-teil="saeule"');
  });

  it('Franchise erreicht: Säule voll bis zum Strich', () => {
    expect(zahl(bild(berechneFranchise(300, 900), 'klein'), 'data-anteil')).toBe(1);
  });

  it('ruhig: keine Ampel, Säule in einer Farbe', () => {
    const p = { sky: '#111111', border: '#222222', text: '#333333', mid: '#444444', rose: '#ff0000', roseDeep: '#ee0000' };
    const html = renderToStaticMarkup(React.createElement(FranchiseThermometer, { palette: p, stand: berechneFranchise(300, 5000), groesse: 'mittel' }));
    expect(html).not.toMatch(/#ff0000|#ee0000/);
  });
});

describe('Kachel Franchise-Stand nutzt das Thermometer', () => {
  it('keine eigene Kleinzeichnung mehr', () => {
    const q = fs.readFileSync(path.resolve(__dirname, '../components/InstrumentePanel.jsx'), 'utf8');
    expect(q).not.toMatch(/miniFranchise/);
    expect(q).toMatch(/FranchiseThermometer, \{[^}]*groesse: 'klein'/);
  });
});

describe('KVG-Reiter Franchise (mittel 128): Thermometer, darunter die Hauptzahl', () => {
  const daten = { versicherungen: { franchise: '1500', kkBelege: [{ id: 'a', datum: new Date().getFullYear() + '-03-01', betrag: 420, status: 'bezahlt' }] } };
  const html = renderToStaticMarkup(React.createElement(KVGLeistungen, { palette, t, data: daten, initialTab: 'franchise', onUpdateData: () => {}, onNavigate: () => {} }));

  it('Bild vor der Zahl, Zahl = verbrauchte Franchise über betrag()', () => {
    const b = html.indexOf('data-franchise="mittel"');
    const z = html.indexOf('data-instrument-zahl="franchise"');
    expect(b).toBeGreaterThan(-1);
    expect(z).toBeGreaterThan(b);
    expect(html).toMatch(/data-instrument-zahl="franchise"[^>]*>CHF 420</);
  });

  it('keine zwei Balken mehr', () => {
    const q = fs.readFileSync(path.resolve(__dirname, '../KVGLeistungen.jsx'), 'utf8');
    expect(q).not.toMatch(/barFill\(/);
  });
});
