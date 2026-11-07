import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ErklaerseiteLink, ERKLAERSEITE, KANTONSKARTE, ZUM_VERSTEHEN, ZumVerstehen, MEHR_DAZU, MehrDazu } from '../components/ErklaerseiteLink.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import { LIGHT_PALETTE } from '../config/constants.js';

// Verbesserungen D1 (docs/entscheide/verbesserungen-2026-11.md, 06.11.2026): seit E1 führte die Erklärseite ins
// Werkzeug, aber kein Werkzeug zurück zur eigenen Erklärseite. Jetzt tragen die vier Werkzeuge mit einer
// Erklärseite einen ruhigen Link dorthin. Ziel ist die deutsche Fassung, wie im Beta-Tor: fr/it/en/rm sind
// noch nicht gegengelesen; der Linktext sagt das in den anderen Sprachen.
const quelle = (datei) => fs.readFileSync(path.resolve(__dirname, '..', datei), 'utf8');
const t = createT({ de }, 'de', 'sie');

describe('Werkzeuge verlinken ihre Erklärseite', () => {
  it('vier Werkzeuge, je eine Erklärseite, die es gibt', () => {
    expect(ERKLAERSEITE).toEqual({ sozialhilfe: '/sozialhilfe/', tax: '/steuern/', premium: '/praemienverbilligung/', praemien: '/krankenkasse/' });
    for (const pfad of Object.values(ERKLAERSEITE)) {
      expect(fs.existsSync(path.resolve(process.cwd(), 'public', pfad.slice(1), 'index.html')), pfad).toBe(true);
    }
  });

  it.each([['SozialhilfeView.jsx', 'sozialhilfe'], ['TaxCalculator.jsx', 'tax'], ['PremiumSubsidy.jsx', 'premium'], ['PraemienOrientierung.jsx', 'praemien']])(
    '%s zeigt den Link', (datei, view) => {
      expect(quelle(datei)).toContain(`ErklaerseiteLink, { palette, t, view: '${view}' }`);
    });

  it('öffnet in einem neuen Tab und kündigt das an, auf die deutsche Seite', () => {
    const html = renderToStaticMarkup(React.createElement(ErklaerseiteLink, { palette: LIGHT_PALETTE, t, view: 'tax' }));
    expect(html).toContain('href="/steuern/"');
    expect(html).toContain('hrefLang="de"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain(t('a11y.neuerTab'));
    expect(html).toContain(t('erklaerseite.link'));
  });

  it('ohne Erklärseite: nichts', () => {
    expect(renderToStaticMarkup(React.createElement(ErklaerseiteLink, { palette: LIGHT_PALETTE, t, view: 'kvg' }))).toBe('');
  });

  // Ergänzung A (Wege durch Maloja, 07.11.2026): aus sieben Werkzeugen zur passenden Karte im Kantonsatlas.
  describe('Werkzeuge verlinken ihre Karte im Kantonsatlas', () => {
    const atlas = fs.readFileSync(path.resolve(process.cwd(), 'public', 'kantonsatlas', 'index.html'), 'utf8');
    const WERKZEUGE = [['PraemienOrientierung.jsx', 'praemien'], ['PremiumSubsidy.jsx', 'premium'], ['TaxCalculator.jsx', 'tax'],
      ['MietzinsOrientierung.jsx', 'mietzins'], ['AlvRechner.jsx', 'alv'], ['SozialhilfeView.jsx', 'sozialhilfe'], ['Ergaenzungsleistungen.jsx', 'ergaenzungsleistungen']];

    it('sieben Werkzeuge, jedes Ziel ist eine Karte, die auf der Seite steht', () => {
      expect(Object.keys(KANTONSKARTE).sort()).toEqual(WERKZEUGE.map(([, v]) => v).sort());
      for (const ziel of Object.values(KANTONSKARTE)) {
        expect(ziel, ziel).toMatch(/^\/kantonsatlas\/#karte-[a-z]+$/);
        expect(atlas, ziel).toContain(`<figure class="abb atlas" id="${ziel.split('#')[1]}">`);
      }
    });

    it.each(WERKZEUGE)('%s zeigt den Link zur Karte', (datei, view) => {
      expect(quelle(datei)).toContain(`ErklaerseiteLink, { palette, t, view: '${view}' }`);
      const html = renderToStaticMarkup(React.createElement(ErklaerseiteLink, { palette: LIGHT_PALETTE, t, view }));
      expect(html).toContain(`href="${KANTONSKARTE[view]}"`);
      expect(html).toContain(t('erklaerseite.karte'));
    });

    it('der Kartentext steht in allen fünf Sprachen; ausser Deutsch sagt er, dass die Seite deutsch ist', () => {
      const texte = [de, fr, it_, en, rm].map((l) => l.erklaerseite.karte);
      expect(texte.every((x) => typeof x === 'string' && x.length > 5)).toBe(true);
      expect(texte[1]).toMatch(/allemand/);
      expect(texte[2]).toMatch(/tedesco/);
      expect(texte[3]).toMatch(/German/);
      expect(texte[4]).toMatch(/tudestg/);
    });
  });

  // Ergänzung B (07.11.2026): Sozialhilfe und Steuern führten als einzige Erklärseiten nicht zu den Kantonsseiten.
  it.each(['sozialhilfe', 'steuern', 'was-steht-mir-zu', 'praemienverbilligung'])('Erklärseite /%s/ führt zu beiden Kantonsseiten', (pfad) => {
    const html = fs.readFileSync(path.resolve(process.cwd(), 'public', pfad, 'index.html'), 'utf8');
    expect(html).toContain('href="/kantone-im-vergleich/"');
    expect(html).toContain('href="/kantonsatlas/"');
  });

  // C-A (07.11.2026): «Zum Verstehen» und «Auf der Karte» am Ende der Kapitelseiten, nach dem Organigramm.
  describe('Kapitelseiten: Zum Verstehen und Auf der Karte', () => {
    const atlas = fs.readFileSync(path.resolve(process.cwd(), 'public', 'kantonsatlas', 'index.html'), 'utf8');
    const kopf = (anker) => (atlas.match(new RegExp(`<figure class="abb atlas" id="${anker}">[\\s\\S]*?<p class="abb-kopf"[^>]*><span>[^<]*</span><span>([^<]*)</span>`)) || [])[1];

    it('fünf Kapitel, Behörden und Gesundheit ohne Zeile', () => {
      expect(Object.keys(ZUM_VERSTEHEN).sort()).toEqual(['ausbildung', 'basis', 'finanzen', 'versicherungen', 'wohnen']);
      for (const k of ['behoerden', 'notfall']) expect(renderToStaticMarkup(React.createElement(ZumVerstehen, { palette: LIGHT_PALETTE, t, kapitel: k }))).toBe('');
    });

    it('jede Erklärseite existiert, jede Karte steht auf der Seite und trägt dort denselben Namen', () => {
      const alle = Object.values(ZUM_VERSTEHEN);
      for (const [href] of alle.flatMap((z) => z.seiten)) expect(fs.existsSync(path.resolve(process.cwd(), 'public', href.slice(1), 'index.html')), href).toBe(true);
      const karten = alle.flatMap((z) => z.karten);
      expect(karten.length).toBe(10);
      for (const [href, name] of karten) expect(kopf(href.split('#')[1]), href).toBe(name);
    });

    it('die Kapitelseite zeigt den Baustein unter «Passend»', () => {
      const cv = quelle('ChapterView.jsx');
      expect(cv).toContain("React.createElement(ZumVerstehen, { palette, t: tr, kapitel: chapter.key })");
      expect(cv.indexOf('React.createElement(ZumVerstehen')).toBeGreaterThan(cv.indexOf('    renderPassend(),'));
    });

    it('Versicherungen: zwei Erklärseiten und drei Karten, mit Überschriften', () => {
      const html = renderToStaticMarkup(React.createElement(ZumVerstehen, { palette: LIGHT_PALETTE, t, kapitel: 'versicherungen' }));
      expect(html).toContain(t('erklaerseite.zumVerstehen'));
      expect(html).toContain(t('erklaerseite.aufDerKarte'));
      expect((html.match(/<a /g) || []).length).toBe(5);
      expect(html).toContain('href="/krankenkasse/"');
      expect(html).toContain('href="/kantonsatlas/#karte-el"');
    });

    it('Wohnen: nur Karten, keine leere Überschrift «Zum Verstehen»', () => {
      const html = renderToStaticMarkup(React.createElement(ZumVerstehen, { palette: LIGHT_PALETTE, t, kapitel: 'wohnen' }));
      expect(html).not.toContain(t('erklaerseite.zumVerstehen'));
      expect(html).toContain(t('erklaerseite.aufDerKarte'));
    });
  });

  // D-A (07.11.2026): «Mehr dazu: <Seite>» am passenden Schritt.
  describe('Abläufe: Mehr dazu', () => {
    it.each([['Einbuergerung.jsx', 'politsystem'], ['ZuzugAusland.jsx', 'politsystem'], ['UmzugAblauf.jsx', 'kantone']])('%s → %s', (datei, seite) => {
      expect(quelle(datei)).toContain(`MehrDazu, { `);
      expect(quelle(datei)).toContain(`seite: '${seite}'`);
      const html = renderToStaticMarkup(React.createElement(MehrDazu, { palette: LIGHT_PALETTE, t, seite }));
      expect(html).toContain(`href="${MEHR_DAZU[seite][0]}"`);
      expect(html).toContain(MEHR_DAZU[seite][1]);
      expect(html).toContain(t('erklaerseite.mehrDazu'));
      expect(fs.existsSync(path.resolve(process.cwd(), 'public', MEHR_DAZU[seite][0].slice(1), 'index.html'))).toBe(true);
    });

    it('Umzug: nur beim Wechsel in einen anderen Kanton', () => {
      expect(quelle('UmzugAblauf.jsx')).toContain("umzugType === 'extra' && React.createElement(MehrDazu");
    });

    it('die drei Überschriften stehen in allen fünf Sprachen', () => {
      for (const l of [de, fr, it_, en, rm]) for (const k of ['zumVerstehen', 'aufDerKarte', 'mehrDazu']) expect(typeof l.erklaerseite[k], k).toBe('string');
    });
  });

  it('der Linktext steht in allen fünf Sprachen; ausser Deutsch sagt er, dass die Seite deutsch ist', () => {
    const texte = [de, fr, it_, en, rm].map((l) => l.erklaerseite.link);
    expect(texte.every((x) => typeof x === 'string' && x.length > 5)).toBe(true);
    expect(texte[1]).toMatch(/allemand/);
    expect(texte[2]).toMatch(/tedesco/);
    expect(texte[3]).toMatch(/German/);
    expect(texte[4]).toMatch(/tudestg/);
  });
});
