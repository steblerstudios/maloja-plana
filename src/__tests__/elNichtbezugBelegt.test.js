import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import { Ergaenzungsleistungen } from '../Ergaenzungsleistungen.jsx';

// Wissensschicht EL-Nichtbezug (04.11.2026): Der Satz über das Verhalten von Berechtigten ist
// eine empirische Aussage. Ein Gesetzesartikel belegt sie nicht — sie hält nur, solange beide
// Studien in der Quellenzeile stehen und keine Quote auftaucht (die einzige belegte Zahl gilt
// nur für Basel-Stadt; sozio-pruefer, Frage 3).
const SPRACHEN = { de, fr, it: it_, en, rm };
const BSV = 'admin.ch/de/newnsb/NVMCO0Uym_s2toZHrVwo6';
const BFH = 'bs.ch/news/2021-studie-nichtbezug';

describe('EL-Nichtbezug ist belegt', () => {
  for (const [lang, d] of Object.entries(SPRACHEN)) {
    it(`${lang}: Hinweis vorhanden, beide Studien in der Quelle, keine Quote`, () => {
      const el = d.ergaenzungsleistungen;
      expect(typeof el.step1Nichtbezug).toBe('string');
      expect(el.step1Nichtbezug).not.toMatch(/\d+\s*(%|Prozent|pour cent|per cento|percent)/);
      expect(el.quelle).toContain(BSV);
      expect(el.quelle).toContain(BFH);
    });
  }

  it('der Hinweis steht im Ablauf', () => {
    const t = (k) => k.split('.').reduce((o, p) => (o && typeof o === 'object' ? o[p] : undefined), de)
      ?.sie ?? k.split('.').reduce((o, p) => (o && typeof o === 'object' ? o[p] : undefined), de) ?? k;
    const html = renderToStaticMarkup(React.createElement(Ergaenzungsleistungen, { palette: {}, t, onNavigate: () => {} }));
    expect(html).toContain('Nicht alle, denen EL zustehen');
  });
});
