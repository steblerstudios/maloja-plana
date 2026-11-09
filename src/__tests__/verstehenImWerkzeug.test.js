import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { VerstehenImWerkzeug, VERSTEHEN, KANTONSKARTE } from '../components/ErklaerseiteLink.jsx';
import KantonsKarteKlein from '../components/KantonsKarteKlein.jsx';
import ErklaerFigurKlein from '../components/ErklaerFigurKlein.jsx';
import { KARTEN, KARTE_GEO } from '../data/kantonskarten.js';
import { ERKLAERFIGUREN } from '../data/erklaerfiguren.js';
import { erzeugeKarten, erzeugeFiguren } from '../../scripts/app-verstehen.mjs';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { LIGHT_PALETTE, DARK_PALETTE } from '../config/constants.js';

// C + D, Entscheid Stebler Studios 09.11.2026 («Ja, C + D bauen»): Karte mit dem eigenen Kanton und
// Erklärfigur direkt im Werkzeug, Pilot Kapitel Versicherungen. Die Daten erzeugt
// scripts/app-verstehen.mjs aus denselben Quellen wie /kantonsatlas/ und /krankenkasse/.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
const t = createT({ de }, 'de', 'sie');
const P = LIGHT_PALETTE;

describe('Erzeugte Daten sind frisch (eine Quelle mit den öffentlichen Seiten)', () => {
  it('src/data/kantonskarten.js = was scripts/app-verstehen.mjs jetzt erzeugt', () => {
    expect(quelle('data/kantonskarten.js')).toBe(erzeugeKarten());
  });
  it('src/data/erklaerfiguren.js = was scripts/app-verstehen.mjs jetzt erzeugt', () => {
    expect(quelle('data/erklaerfiguren.js')).toBe(erzeugeFiguren());
  });
});

describe('Die Karte (C)', () => {
  it('26 Kantone, jede Karte hat einen Wert und eine Stufe 1–4 je Kanton', () => {
    expect(Object.keys(KARTE_GEO.kantone)).toHaveLength(26);
    for (const K of Object.values(KARTEN)) {
      expect(Object.keys(K.werte)).toHaveLength(26);
      for (const w of Object.values(K.werte)) expect([1, 2, 3, 4]).toContain(w.s);
    }
  });

  it('der Anker jeder Karte ist dieselbe Karte, auf die der Textlink zeigt', () => {
    for (const [view, v] of Object.entries(VERSTEHEN)) {
      expect(KANTONSKARTE[view], view).toBe(`/kantonsatlas/#${KARTEN[v.karte].anker}`);
    }
  });

  it('mit Kanton: markiert, Wert und Schweiz daneben, kein Platz', () => {
    const html = renderToStaticMarkup(React.createElement(KantonsKarteKlein, { palette: P, t, karte: 'praemie', kanton: 'ZH' }));
    expect(html.match(/data-eigen="ja"/g)).toHaveLength(1);
    expect(html).toContain('data-kanton="ZH" data-eigen="ja"');
    expect(html).toContain(`${t('cantons.ZH')}: `);
    expect(html).toContain(KARTEN.praemie.werte.ZH.text);
    expect(html).toContain(KARTEN.praemie.ch);
    expect(html).toContain(t('erklaerseite.stufenHinweis'));
    expect(html).not.toMatch(/Platz|Rang\b|\d+\. von 26/);
  });

  it('ohne Kanton: keine Markierung, ein Hinweis statt Wert', () => {
    const html = renderToStaticMarkup(React.createElement(KantonsKarteKlein, { palette: P, t, karte: 'lastNachIpv', kanton: '' }));
    expect(html).not.toContain('data-eigen');
    expect(html).toContain(t('erklaerseite.ohneKanton'));
  });

  it('dunkler Modus nimmt die dunklen Stufen der Atlas-Seite', () => {
    const hell = renderToStaticMarkup(React.createElement(KantonsKarteKlein, { palette: P, t, karte: 'praemie', kanton: 'BE' }));
    const dunkel = renderToStaticMarkup(React.createElement(KantonsKarteKlein, { palette: DARK_PALETTE, t, karte: 'praemie', kanton: 'BE' }));
    expect(hell).toContain('#3D5A76');
    expect(dunkel).toContain('#C6D6E5');
    expect(dunkel).not.toContain('#3D5A76');
    expect(hell).toContain(t('erklaerseite.stufenHinweis'));
    expect(dunkel).toContain(t('erklaerseite.stufenHinweisDunkel'));
    expect(dunkel).not.toContain(t('erklaerseite.stufenHinweis'));
  });
});

describe('Die Erklärfigur (D)', () => {
  it('das SVG ist geprüft: kein Skript, kein Fremdverweis, mit Titel für Vorlese-Programme', () => {
    for (const F of Object.values(ERKLAERFIGUREN)) {
      expect(F.svg).not.toMatch(/<script|<foreignObject|<image|\bon[a-z]+\s*=|javascript:|https?:/i);
      expect(F.svg).toMatch(/^<svg [^>]*role="img"/);
      expect(F.svg).toContain('<title id=');
      expect(F.quellen.length).toBeGreaterThan(0);
      for (const q of F.quellen) expect(q.url).toMatch(/^https:\/\/[^/]+\/.+/);
    }
  });

  it('die bewegte Fassung ist ein Link auf eine Seite, die es gibt (kein Rahmen)', () => {
    const html = renderToStaticMarkup(React.createElement(ErklaerFigurKlein, { palette: P, t, figur: 'kostenteil' }));
    expect(html).not.toContain('<iframe');
    expect(html).toContain('href="/krankenkasse/bewegt/kostenteil/"');
    expect(html).toContain('target="_blank"');
    expect(fs.existsSync(path.resolve(process.cwd(), 'public', 'krankenkasse', 'bewegt', 'kostenteil', 'index.html'))).toBe(true);
  });
});

describe('Erst beim Aufklappen geladen', () => {
  it('zu: nur die Zeilen, weder Karte noch Figur im Markup', () => {
    const html = renderToStaticMarkup(React.createElement(VerstehenImWerkzeug, { palette: P, t, view: 'praemien', kanton: 'ZH' }));
    expect(html).toContain(t('erklaerseite.karteMitKanton'));
    expect(html).toContain(t('erklaerseite.imBild'));
    expect(html).not.toContain('<svg');
    expect(html).not.toContain('<path');
  });

  it('ohne Kanton heisst die Zeile anders', () => {
    const html = renderToStaticMarkup(React.createElement(VerstehenImWerkzeug, { palette: P, t, view: 'premium', kanton: '' }));
    expect(html).toContain(t('erklaerseite.karteOhneKanton'));
    expect(html).not.toContain(t('erklaerseite.imBild'));
  });

  it('die beiden Teile und ihre Daten werden nur dynamisch importiert', () => {
    const wrapper = quelle('components/ErklaerseiteLink.jsx');
    expect(wrapper).toContain("React.lazy(() => import('./KantonsKarteKlein.jsx'))");
    expect(wrapper).toContain("React.lazy(() => import('./ErklaerFigurKlein.jsx'))");
    const statisch = /^import .*(KantonsKarteKlein|ErklaerFigurKlein|kantonskarten|erklaerfiguren)/m;
    for (const datei of fs.readdirSync(path.resolve(__dirname, '..')).filter((f) => f.endsWith('.jsx'))) {
      expect(quelle(datei), datei).not.toMatch(statisch);
    }
    expect(wrapper).not.toMatch(statisch);
  });

  it.each([['PraemienOrientierung.jsx', 'praemien'], ['PremiumSubsidy.jsx', 'premium']])('%s zeigt den Block', (datei, view) => {
    expect(quelle(datei)).toMatch(new RegExp(`VerstehenImWerkzeug, \\{ palette, t, view: '${view}', kanton:`));
  });
});
