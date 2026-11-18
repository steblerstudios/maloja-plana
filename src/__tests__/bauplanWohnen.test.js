// Wächter · Bauplan Lebensbereich, am Beispiel Wohnen (Stebler Studios 18.11.2026: «wohnen sauber zusammen bringen
// … dann alle anderen kapitel gleich aufbauen», «Jedes Bild einmal», «Ordner je Bereich», Tür = Fass).
// Analyse: stebler-studios/analysen/2026-11-18-wohnen-logik-bauplan.md
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import { createT } from '../i18n/index.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { DEMO_DATA } from '../config/demoData.js';
import { WohnenZuhause, WohnenWerkzeug } from '../bereiche/wohnen/wohnen.js';

const t = createT({ de }, 'de', 'sie');
const SRC = path.resolve(__dirname, '..');
const lies = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');
const zaehle = (html, teil) => (html.match(new RegExp('data-teil="' + teil + '"', 'g')) || []).length;
const mit = (aend) => {
  const d = JSON.parse(JSON.stringify(DEMO_DATA));
  for (const [teil, werte] of Object.entries(aend)) d[teil] = { ...(d[teil] || {}), ...werte };
  return d;
};
const kapitel = (d) => renderToStaticMarkup(React.createElement(WohnenZuhause, { palette: LIGHT_PALETTE, t, wohnen: d.wohnen, allData: d, isDarkMode: false, onNavigate: () => {} }));
const werkzeug = (d) => renderToStaticMarkup(React.createElement(WohnenWerkzeug, { palette: LIGHT_PALETTE, t, data: d, isDarkMode: false }));
// Basel-Stadt: Programm mit Einkommensgrenze als Zahl. Tiefes Einkommen = unter der Grenze.
const BS_TIEF = mit({ basis: { canton: 'BS' }, wohnen: { postalCode: '4051', rentAmount: '1400', utilities: '150', rooms: '2' }, finanzen: { monthlyIncome: '3000' } });

describe('Bauplan Wohnen · jedes Bild einmal je Seite', () => {
  for (const [ort, zeichne] of [['Kapitel', kapitel], ['Werkzeug', werkzeug]]) {
    it(ort + ': ein Drittel-Haus, ein Vergleichshaus, je eine Hauptzahl', () => {
      for (const d of [DEMO_DATA, BS_TIEF]) {
        const html = zeichne(d);
        expect(zaehle(html, 'drittel-haus')).toBe(1);
        expect(zaehle(html, 'vergleichs-haus')).toBe(1);
        expect((html.match(/data-instrument-zahl="wohnkosten"/g) || []).length).toBe(1);
        expect((html.match(/data-instrument-zahl="miete"/g) || []).length).toBe(1);
      }
    });
  }
  it('die Hauptzahlen stehen unter ihrem Haus (Regel «Zahl»)', () => {
    const html = kapitel(DEMO_DATA);
    expect(html.indexOf('data-instrument-zahl="wohnkosten"')).toBeGreaterThan(html.indexOf('data-teil="drittel-haus"'));
    expect(html.indexOf('data-instrument-zahl="miete"')).toBeGreaterThan(html.indexOf('data-teil="vergleichs-haus"'));
  });
  it('Regler, Ausland und (mit Fass) die Kantonskarte stehen unter «Mehr dazu»', () => {
    const html = kapitel(BS_TIEF);
    const mehr = html.slice(html.indexOf('data-teil="wohnen-mehr"'));
    expect(mehr).toContain('id="wohnen-regler"');
    expect(mehr).toContain('data-teil="international-hinweis"');
    expect(mehr).toContain('data-teil="kachelkarte"');
  });
});

describe('Bauplan Wohnen · die Tür ist das Fass (Stebler Studios 11.11. und 18.11.2026)', () => {
  it('Programm mit Zahl, unter der Grenze: Fass in der Tür, Wegweiser in der Strasse', () => {
    for (const html of [kapitel(BS_TIEF), werkzeug(BS_TIEF)]) {
      expect(html).toMatch(/data-teil="tuer"[^>]*data-fass="ja"/);
      expect(html).toContain('data-teil="tuer-grenze"');
      expect(html).toMatch(/data-teil="wegweiser-in-strasse"[\s\S]*data-teil="mietzins-cta"/);
    }
  });
  it('ohne Programm (Zürich): schlichte Tür, kein Wegweiser, die Kantonskarte steht offen', () => {
    const html = kapitel(DEMO_DATA);
    expect(html).toMatch(/data-teil="tuer"[^>]*data-fass="nein"/);
    expect(html).not.toContain('data-teil="mietzins-cta"');
    expect(html.indexOf('data-teil="kachelkarte"')).toBeLessThan(html.indexOf('data-teil="wohnen-mehr"'));
  });
});

describe('Bauplan Wohnen · Ordnung im Code', () => {
  const appDateien = (dir) => fs.readdirSync(path.join(SRC, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' || rel === path.join('bereiche', 'wohnen') ? [] : appDateien(rel);
    return /\.(js|jsx)$/.test(e.name) ? [rel] : [];
  });
  it('rechnung.js rechnet nur: kein React, kein Bauteil', () => {
    const q = lies('bereiche/wohnen/rechnung.js');
    expect(q).not.toMatch(/from 'react'/);
    expect(q).not.toMatch(/from '[^']+\.jsx'/);
  });
  it('ausserhalb des Bereichs kommt Wohnen nur über bereiche/wohnen/wohnen.js', () => {
    const falsch = appDateien('.').filter((f) => /from '[^']*bereiche\/wohnen\/(?!wohnen\.js')[^']*'|import\('[^']*bereiche\/wohnen\/(?!wohnen\.js')/.test(lies(f)));
    expect(falsch).toEqual([]);
  });
  it('der Eingang heisst nicht index.js (sonst zählte size-limit den Baustein zur Startdatei)', () => {
    expect(fs.existsSync(path.join(SRC, 'bereiche/wohnen/index.js'))).toBe(false);
  });
  it('das Barometer kennt keine Häuser mehr', () => {
    const code = lies('components/RegionalBarometer.jsx').split('\n').filter((z) => !z.trim().startsWith('//')).join('\n');
    expect(code).not.toMatch(/haeuser|Vergleichshaus|drittel:/);
  });
});
