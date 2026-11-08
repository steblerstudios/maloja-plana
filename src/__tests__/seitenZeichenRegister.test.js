import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Icons, muenzenBereit } from '../IconKern.jsx';
import '../IconSystem.jsx';
import { ABLAEUFE, SEARCH_VIEWS, ansichtIkon, seitenZeichenName, SEITEN_ZEICHEN_KAPITEL } from '../config/ansichtenRegister.js';
import { WERKZEUGE } from '../data/werkzeugRegister.js';
import { astKapitel, LEBENSBEREICHE } from '../data/lebensbereiche.js';
import { SEITEN_ZEICHEN } from '../config/seitenZeichen.js';

// Icon-Plan November 2026, Bauplan B4 (Entscheid Stebler Studios 08.11.2026, «Ja, B4 starten»):
// die Seiten tragen ihr Seiten-Zeichen (Leitform + Abzeichen), Kapitel für Kapitel.

beforeAll(() => muenzenBereit());
const SEITEN = new Map();
for (const e of [...ABLAEUFE, ...SEARCH_VIEWS, ...WERKZEUGE]) if (e.view && e.view !== 'chapter' && e.bereich) SEITEN.set(e.view, e.bereich);
const frei = [...SEITEN].filter(([, b]) => SEITEN_ZEICHEN_KAPITEL.has(astKapitel(b))).map(([v]) => v);

describe('B4 · Seiten-Zeichen im Register', () => {
  it('jede Seite eines freigeschalteten Kapitels zeigt ihr Seiten-Zeichen (Suche, Übersicht, Seitenkopf)', () => {
    expect(frei.length).toBeGreaterThan(0);
    expect(frei.filter((v) => ansichtIkon(v) !== seitenZeichenName(v))).toEqual([]);
  });
  it('die übrigen Kapitel bleiben, wie sie sind, bis sie an der Reihe sind', () => {
    const zu = [...SEITEN].filter(([, b]) => !SEITEN_ZEICHEN_KAPITEL.has(astKapitel(b))).map(([v]) => v);
    expect(zu.filter((v) => ansichtIkon(v) === seitenZeichenName(v))).toEqual([]);
  });
  it('jedes Seiten-Zeichen zeichnet Leitform + Abzeichen, Farben aus den Ast-Variablen', () => {
    const falsch = frei.filter((v) => {
      const svg = renderToStaticMarkup(React.createElement(Icons[seitenZeichenName(v)]));
      return !/var\(--mp-ast-/.test(svg) || (SEITEN_ZEICHEN[v].zeichen && !/<mask id="abz\d+f"/.test(svg));
    });
    expect(falsch).toEqual([]);
  });
  it('main.jsx setzt die Ast-Variablen aus lebensbereiche.js, für jeden Ast', () => {
    const main = readFileSync(resolve(__dirname, '../main.jsx'), 'utf8');
    expect(main).toMatch(/for \(const b of LEBENSBEREICHE\) document\.documentElement\.style\.setProperty\('--mp-ast-' \+ b\.key, isDarkMode \? b\.dark : b\.light\)/);
    expect(LEBENSBEREICHE.length).toBe(11);
  });
});
