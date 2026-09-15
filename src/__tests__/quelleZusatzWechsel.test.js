import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT, I18nContext } from '../i18n/index.js';
import en from '../i18n/en.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js'; // nicht `it` — kollidiert mit vitest it()
import rm from '../i18n/rm.js';
import { renderSource } from '../utils/renderSource.js';
import { ZusatzWechsel } from '../ZusatzWechsel.jsx';

// K1 + K2 der Bau-Liste (30.09.2026):
// K1 — der Armutsgrenzen-Befund verlinkt die BFS-METHODIK (Erhebung Armutsstatistik), nicht
//      eine publizierte Zahl: der Betrag in der App ist haushaltsindividuell gerechnet.
// K2 — «Vor dem Wechsel prüfen» in der Zusatzversicherung, jede Aussage mit VVG-Artikel.
const all = { en, de, fr, it: itTranslations, rm };
const LANGS = ['de', 'fr', 'it', 'en', 'rm'];
const BFS_METHODIK = /\[\[[^\]|]+\|https:\/\/www\.bfs\.admin\.ch\/bfs\/(de|fr|it|en)\/home\/[^\]]*(armutsstatistik|statistique-pauvrete|statistica-poverta|poverty-statistics)\.html\]\]/;
const VVG = 'https://www.fedlex.admin.ch/eli/cc/24/719_735_717/';
const palette = { mid: '#555', soft: '#777', sageDeep: '#363', goldDeep: '#a60', sandDeep: '#850', sand: '#dc9', onSand: '#000', text: '#111', surface: '#fff', up: '#eee', border: '#ccc' };

describe('K1 · Armutsgrenzen-Befund verlinkt die BFS-Methodik', () => {
  it.each(LANGS)('%s: Sie- und Du-Fassung tragen den Methodik-Link', (lang) => {
    for (const anrede of ['sie', 'du']) {
      const txt = createT(all, lang, anrede)('finanzUebersicht.povertyLineNote', { amount: 'CHF 2’400' });
      expect(txt).toMatch(BFS_METHODIK);
      expect(txt).toContain('2024');
    }
  });

  it('rendert als externer Link mit rel="noopener noreferrer", Betrag bleibt Text', () => {
    const txt = createT(all, 'de', 'sie')('finanzUebersicht.povertyLineNote', { amount: 'CHF 2’400' });
    const html = renderToStaticMarkup(React.createElement('div', null, renderSource(txt)));
    expect(html).toContain('href="https://www.bfs.admin.ch/bfs/de/home/statistiken/wirtschaftliche-soziale-situation-bevoelkerung/erhebungen/armutsstatistik.html"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('>BFS-Methodik</a>');
    expect(html).toContain('CHF 2’400/Monat');
    expect(html).not.toContain('[[');
  });
});

describe('K2 · Zusatzversicherung: «Vor dem Wechsel prüfen» mit VVG-Belegen', () => {
  it.each(LANGS)('%s: drei Prüfpunkte mit Artikel, Quelle verlinkt Art. 4, 6, 35a', (lang) => {
    const t = createT(all, lang, 'du');
    expect(t('zusatzWechsel.checkPoint1')).toMatch(/Art\. 4\)|art\. 4\)/);
    expect(t('zusatzWechsel.checkPoint2')).toMatch(/Art\. 6\)|art\. 6\)/);
    expect(t('zusatzWechsel.checkPoint3')).toMatch(/35a/);
    const src = t('zusatzWechsel.checkSource');
    for (const anchor of ['#art_4]]', '#art_6]]', '#art_35_a]]']) expect(src).toContain(anchor);
    expect(src).toContain(VVG);
    expect(src).toContain('2024');
  });

  it('rendert die Liste und die Fedlex-Links sicher in Schritt 1', () => {
    const t = createT(all, 'de', 'du');
    // GlossarText im Intro liest t aus dem Kontext — hier derselbe Übersetzer.
    const html = renderToStaticMarkup(React.createElement(I18nContext.Provider, { value: { t, lang: 'de', anrede: 'du' } },
      React.createElement(ZusatzWechsel, { palette, t, data: {} })));
    expect((html.match(/<li /g) || []).length).toBe(3);
    expect((html.match(new RegExp('href="' + VVG.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + 'de#art_', 'g')) || []).length).toBe(3);
    expect((html.match(/rel="noopener noreferrer"/g) || []).length).toBe(3);
    expect(html).not.toContain('[[');
    // Die Prüfliste steht VOR Schritt 2 (Aufnahme) — innehalten, bevor gekündigt wird.
    expect(html.indexOf('Vor dem Wechsel prüfen')).toBeLessThan(html.indexOf(t('zusatzWechsel.step2Title')));
  });
});
