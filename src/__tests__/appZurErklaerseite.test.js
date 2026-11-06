import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ErklaerseiteLink, ERKLAERSEITE } from '../components/ErklaerseiteLink.jsx';
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

  it('der Linktext steht in allen fünf Sprachen; ausser Deutsch sagt er, dass die Seite deutsch ist', () => {
    const texte = [de, fr, it_, en, rm].map((l) => l.erklaerseite.link);
    expect(texte.every((x) => typeof x === 'string' && x.length > 5)).toBe(true);
    expect(texte[1]).toMatch(/allemand/);
    expect(texte[2]).toMatch(/tedesco/);
    expect(texte[3]).toMatch(/German/);
    expect(texte[4]).toMatch(/tudestg/);
  });
});
