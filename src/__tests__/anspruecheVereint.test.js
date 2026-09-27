import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Schnellcheck } from '../Schnellcheck.jsx';
import { ANSPRUCH_GRUPPEN } from '../data/anspruchLandkarte.js';

// ─────────────────────────────────────────────────────────────
// Leistungs-Kompass + «Ansprüche im Überblick» = eine Seite (Entscheid 27.09.2026)
//
// Oben rechnet der Schnellcheck mit den eigenen Zahlen, darunter steht die ganze
// Anspruchs-Landkarte — ohne die Einträge, die oben schon gerechnet stehen.
// Beide alten Adressen (#/schnellcheck, #/ansprueche) zeigen dieselbe Seite.
// Schritt 1 des geführten Anspruch-Checks (ohne mitLandkarte) bleibt wie vorher.
// ─────────────────────────────────────────────────────────────

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k) => k;
const render = (props) => renderToStaticMarkup(React.createElement(Schnellcheck, { palette, t, onNavigate: () => {}, ...props }));

const alleSchluessel = ANSPRUCH_GRUPPEN.flatMap((g) => g.items.map((i) => i.key));
const zeigt = (html, key) => html.includes('anspruch.items.' + key + '.label');

describe('Ansprüche vereint · eine Seite', () => {
  it('ohne Einkommen: die ganze Landkarte steht unter dem Schnellcheck', () => {
    const html = render({ data: {}, mitLandkarte: true });
    for (const key of alleSchluessel) expect(zeigt(html, key), key).toBe(true);
    expect(html).toContain('anspruch.pageTitle');
    expect(html).toContain('anspruch.gefuehrtLink');
    // Die zwei alten Wegweiser-Listen sind ersetzt, nicht verdoppelt.
    expect(html).not.toContain('schnellcheck.lageTitle');
  });

  it('was oben gerechnet steht (IPV), steht unten nicht noch einmal', () => {
    // BS, 3000 netto: IPV greift im Schnellcheck — die Landkarte lässt sie weg.
    const data = {
      basis: { canton: 'BS', household: { adults: 1, children: [] } },
      finanzen: { monthlyIncome: 3000, incomeType: 'netto' },
      wohnen: { rentAmount: 1100 }, versicherungen: { kkPremium: 380 },
    };
    const html = render({ data, mitLandkarte: true });
    const oben = html.includes('schnellcheck.ipv');
    expect(oben).toBe(true);
    expect(zeigt(html, 'ipv')).toBe(false);
    // Nicht Gerechnetes bleibt stehen.
    expect(zeigt(html, 'stipendien')).toBe(true);
    expect(zeigt(html, 'alv')).toBe(true);
  });

  it('ohne mitLandkarte (Schritt 1 des geführten Checks) bleibt der Schnellcheck wie vorher', () => {
    const html = render({ data: {} });
    expect(html).toContain('schnellcheck.title');
    expect(html).toContain('schnellcheck.lageTitle');
    expect(zeigt(html, 'serafe')).toBe(false);
  });

  it('beide alten Adressen führen auf dieselbe Seite', () => {
    const main = fs.readFileSync(path.resolve(__dirname, '../main.jsx'), 'utf8');
    expect(main).toMatch(/\(view === 'schnellcheck' \|\| view === 'ansprueche'\) && React\.createElement\(Schnellcheck, \{[^}]*mitLandkarte: true/);
  });
});
