import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { ABLAEUFE, ansichtName } from '../config/ansichtenRegister.js';
import { VERWANDTE } from '../config/ablaufVerwandte.js';
import { Heirat } from '../Heirat.jsx';
import { Trennung } from '../Trennung.jsx';

// F7-A4 (Entscheid Stebler Studios 27.10.2026): in ALLEN Abläufen unten «Verwandte Ereignisse» und ein Link
// zum Kapitel, zu dem der Ablauf gehört. Vorher nur in fünf. Nur bestehende Abläufe als Ziele.

beforeEach(() => { globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }; });
const t = createT({ de }, 'de', 'sie');
const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');

describe('Verwandte je Ablauf', () => {
  it('jeder Ablauf im Register hat Verwandte', () => {
    for (const a of ABLAEUFE) expect(VERWANDTE[a.view]?.length, a.view).toBeGreaterThan(0);
  });
  it('jedes Ziel ist ein Ablauf im Register, keiner verweist auf sich selbst, keine Doppel', () => {
    const views = new Set(ABLAEUFE.map((a) => a.view));
    for (const [von, ziele] of Object.entries(VERWANDTE)) {
      expect(views.has(von), 'kein Ablauf: ' + von).toBe(true);
      expect(new Set(ziele).size).toBe(ziele.length);
      for (const z of ziele) {
        expect(views.has(z), von + ' → ' + z).toBe(true);
        expect(z).not.toBe(von);
        expect(typeof t(ansichtName(z))).toBe('string');
      }
    }
  });
  it('die fünf bisherigen Verwandten sind übernommen', () => {
    expect(VERWANDTE.heirat).toEqual(expect.arrayContaining(['kind', 'trennung']));
    expect(VERWANDTE.kind).toContain('heirat');
    expect(VERWANDTE.bewilligung).toEqual(expect.arrayContaining(['kkerst', 'neuerjob']));
    expect(VERWANDTE.fuehrerausweis).toEqual(expect.arrayContaining(['umzug', 'pensionierung']));
    expect(VERWANDTE.zuzug).toEqual(expect.arrayContaining(['umzug', 'einbuergerung']));
  });
  it('kein Ablauf baut seine Verwandten noch selbst (eine Quelle)', () => {
    const dir = resolve(__dirname, '..');
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.jsx'))) {
      expect(readFileSync(resolve(dir, f), 'utf8'), f).not.toMatch(/AblaufStep, \{ palette, title: t\('\w+\.relatedTitle'\)/);
    }
  });
});

describe('unten im Ablauf: Verwandte und der Weg ins Kapitel', () => {
  it('Heirat: Kind, Trennung, Zusammenziehen und «Zum Kapitel Persönliche Basis» nach den Schritten, vor dem Fuss', () => {
    const html = renderToStaticMarkup(React.createElement(Heirat, { palette: LIGHT_PALETTE, t, onNavigate: () => {} }));
    const v = html.indexOf('data-ablauf-verwandt');
    expect(v).toBeGreaterThan(html.lastIndexOf('data-ablauf-schritt='));
    expect(html).toContain('Verwandte Ereignisse');
    for (const z of VERWANDTE.heirat) expect(html.slice(v)).toContain(esc(t(ansichtName(z))));
    expect(html).toContain(esc('Zum Kapitel ' + t('chapters.basis.title')));
    expect(html.indexOf(esc(t('heirat.quelle').slice(0, 8)))).toBeGreaterThan(v);
  });
  it('auch ein Ablauf, der vorher keine hatte (Trennung)', () => {
    const html = renderToStaticMarkup(React.createElement(Trennung, { palette: LIGHT_PALETTE, t, onNavigate: () => {} }));
    expect(html).toContain('data-ablauf-verwandt');
    expect(html).toContain(esc(t('nav.heirat')));
  });
});

describe('Texte in fünf Sprachen', () => {
  for (const [lang, dict] of [['de', de], ['en', en], ['fr', fr], ['it', itSprache], ['rm', rm]]) {
    it(lang, () => {
      expect(typeof dict.ablauf.verwandtTitel).toBe('string');
      expect(dict.ablauf.kapitelLink).toContain('{name}');
    });
  }
});
