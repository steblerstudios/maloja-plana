import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createT, I18nContext } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { ABLAEUFE } from '../config/ansichtenRegister.js';
import { UMLEITUNGEN, VALID_VIEWS, parseHash } from '../utils/hashRouter.js';
import { KVGWechsel, ZusatzWechsel, ZUSATZ_ANKER } from '../KVGWechsel.jsx';
import { ohneNummer } from '../AblaufSchale.jsx';

// F7-A5 (Entscheid Stebler Studios 27.10.2026): «Krankenkasse wechseln» und «Zusatzversicherung wechseln» sind
// EIN Ablauf mit einer Weiche in Schritt 1. Inhalte und Quellen beider bleiben; `#/zusatzwechsel` bleibt als Adresse.

let store;
beforeEach(() => {
  store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
});
const t = createT({ de }, 'de', 'sie');
const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/"/g, '&quot;');
const zeichne = (Komp, props = {}) => renderToStaticMarkup(React.createElement(I18nContext.Provider, { value: { t, lang: 'de', anrede: 'sie' } },
  React.createElement(Komp, { palette: LIGHT_PALETTE, t, data: {}, onNavigate: () => {}, ...props })));

describe('ein Ablauf im Register, die alte Adresse bleibt', () => {
  it('nur noch «kvgwechsel» im Register, mit den Suchwörtern der Zusatzversicherung', () => {
    expect(ABLAEUFE.find((a) => a.view === 'zusatzwechsel')).toBeUndefined();
    const kvg = ABLAEUFE.find((a) => a.view === 'kvgwechsel');
    for (const w of ['zusatzversicherung', 'vvg', 'grundversicherung']) expect(kvg.aliases).toContain(w);
  });
  it('#/zusatzwechsel führt in den KVG-Wechsel, zur Weiche «Zusatz»', () => {
    expect(VALID_VIEWS.has('zusatzwechsel')).toBe(true);
    expect(UMLEITUNGEN.zusatzwechsel).toEqual({ view: 'kvgwechsel', chapterIndex: null, anker: ZUSATZ_ANKER });
    expect(parseHash('#/zusatzwechsel')).toMatchObject({ view: 'kvgwechsel', anker: ZUSATZ_ANKER });
  });
  it('die Sprungmarke wählt den Knopf (springeZuAnker klickt data-anker-wahl)', () => {
    const src = readFileSync(resolve(__dirname, '..', 'utils', 'hashRouter.js'), 'utf8');
    expect(src).toMatch(/'ankerWahl' in el\.dataset\) el\.click\(\)/);
    const html = zeichne(KVGWechsel);
    expect(html).toMatch(new RegExp('id="' + ZUSATZ_ANKER + '" data-anker-wahl=""'));
  });
});

describe('Weiche in Schritt 1', () => {
  it('ohne Wahl: die Frage, beide Knöpfe offen, Inhalt der Grundversicherung wie bisher', () => {
    const html = zeichne(KVGWechsel);
    expect(html).toContain(esc(t('kvgWechsel.weicheFrage')));
    expect(html).toContain('aria-pressed="false"');
    expect(html).not.toContain('aria-pressed="true"');
    for (const k of ['step1Title', 'step2Title', 'step3Title', 'step4Title']) expect(html).toContain(esc(ohneNummer(t('kvgWechsel.' + k))));
    expect(html).toContain('KVG Art. 7');
    expect(html).toContain('Schritt 1 von 4');
  });
  it('Weg «Zusatz»: die vier Schritte der Zusatzversicherung mit ihren VVG-Quellen und ihrem Fuss', () => {
    const html = zeichne(ZusatzWechsel);
    expect(html).toMatch(/aria-pressed="true"[^>]*id="mp-kvg-zusatz"/);
    for (const k of ['step1Title', 'step2Title', 'step3Title', 'step4Title']) expect(html).toContain(esc(ohneNummer(t('zusatzWechsel.' + k))));
    expect(html).toContain('#art_35_a');
    expect(html).toContain(esc(t('zusatzWechsel.footerFrist')));
    expect(html).toContain(esc(t('zusatzWechsel.intro')));
    expect(html).not.toContain(esc(ohneNummer(t('kvgWechsel.step2Title'))));
  });
  it('die Wahl bleibt gespeichert (im Beispiel nicht)', () => {
    store.or5_ablauf_kvgwechsel_weg = 'zusatz';
    expect(zeichne(KVGWechsel)).toContain(esc(ohneNummer(t('zusatzWechsel.step2Title'))));
  });
  it('die Verweise «Zusatzversicherung» im KVG-Weg stellen die Weiche, statt die Seite zu wechseln', () => {
    const src = readFileSync(resolve(__dirname, '..', 'KVGWechsel.jsx'), 'utf8');
    expect(src).not.toMatch(/onNavigate\('zusatzwechsel'\)/);
    expect((src.match(/onClick: \(\) => waehle\('zusatz'\)/g) || []).length).toBe(2);
  });
});

describe('neue Texte in fünf Sprachen', () => {
  for (const [lang, dict] of [['de', de], ['en', en], ['fr', fr], ['it', itSprache], ['rm', rm]]) {
    it(lang, () => {
      for (const k of ['weicheFrage', 'weicheGrund', 'weicheZusatz']) expect(dict.kvgWechsel[k], lang + ' ' + k).toBeTruthy();
    });
  }
});
