import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import { createT } from '../i18n/index.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { CANTONAL_LINKS, CANTONAL_LINKS_GEPRUEFT, kantonMehrsprachig } from '../data/direktLinks.js';
import { KantonMehrsprachig, NichtbezugHuerden } from '../components/Nichtbezug.jsx';

// Brücke 6 (19.11.2026): «Hallo»-Plattformen der Kantone, Erstinformation in vielen Sprachen.
// Belegt je mit curl 200, Titel «Hallo …», Teil /de/soziale-sicherheit, Impressum = Kanton.
const BELEGT = { BS: 'hallo-baselstadt.ch', AG: 'hallo-aargau.ch', BL: 'hallo-baselland.ch', BE: 'hallo-bern.ch', GL: 'hallo-glarus.ch' };

describe('Brücke 6: «Hallo»-Plattformen', () => {
  it('genau die belegten Kantone, je mit Prüfdatum', () => {
    const mit = Object.keys(CANTONAL_LINKS).filter((k) => CANTONAL_LINKS[k].mehrsprachig).sort();
    expect(mit).toEqual(Object.keys(BELEGT).sort());
    for (const [k, host] of Object.entries(BELEGT)) {
      expect(kantonMehrsprachig(k)).toBe(`https://www.${host}/`);
      expect(CANTONAL_LINKS_GEPRUEFT[k].mehrsprachig).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect(kantonMehrsprachig('ZH')).toBeNull();
    expect(kantonMehrsprachig('')).toBeNull();
  });

  it('Beschriftung in allen fünf Sprachen', () => {
    for (const d of [de, fr, it_, en, rm]) expect(d.dl.cantonal.mehrsprachig).toMatch(/Hallo/);
  });

  const t = createT({ de }, 'de', 'sie');
  it('Baustein: Link nur in den belegten Kantonen', () => {
    const bs = renderToStaticMarkup(React.createElement(KantonMehrsprachig, { palette: LIGHT_PALETTE, t, canton: 'BS' }));
    expect(bs).toContain('https://www.hallo-baselstadt.ch/');
    expect(renderToStaticMarkup(React.createElement(KantonMehrsprachig, { palette: LIGHT_PALETTE, t, canton: 'ZH' }))).toBe('');
  });

  it('Hürden-Block: bei «Zeit, Kraft und Sprache»', () => {
    const html = renderToStaticMarkup(React.createElement(NichtbezugHuerden, { palette: LIGHT_PALETTE, t, canton: 'BE' }));
    const aufwand = html.indexOf(de.nichtbezug.aufwandTitel);
    const link = html.indexOf('https://www.hallo-bern.ch/');
    const vertrauen = html.indexOf(de.nichtbezug.vertrauenTitel);
    expect(aufwand).toBeGreaterThan(-1);
    expect(link).toBeGreaterThan(aufwand);
    expect(link).toBeLessThan(vertrauen);
  });
});
