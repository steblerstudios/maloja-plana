import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js'; // nicht «it» — das überschriebe vitests it()
import rm from '../i18n/rm.js';
import { PraemienOrientierung } from '../PraemienOrientierung.jsx';

// Übergabe 26.10.2026, Punkt 5: Ab 2028 nimmt detailJahr() ohne neuen Import still die Prämien 2027. Die Seite sagt das
// offen. Gerendert mit den echten deutschen Texten (Muster aus hinweisImBild.test.js).
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (schluessel, p) => {
  const wert = String(schluessel).split('.').reduce((o, k) => (o == null ? undefined : o[k]), de);
  let text = wert;
  if (wert && typeof wert === 'object') text = wert.sie ?? Object.values(wert)[0];
  if (typeof text !== 'string') return schluessel;
  if (p && typeof p === 'object') for (const [k, v] of Object.entries(p)) text = text.split('{' + k + '}').join(String(v));
  return text;
};
const daten = {
  basis: { dateOfBirth: '1985-04-12' },
  wohnen: { postalCode: '8001' },
  versicherungen: { kkInsurer: 'CSS', franchise: '1500', kkPremium: 540 },
  finanzen: {},
};
const zeichne = () => renderToStaticMarkup(React.createElement(PraemienOrientierung, { palette, t, data: daten, onNavigate: () => {}, onUpdateData: () => {} }));

describe('Prämien veraltet', () => {
  it('2028 ohne Daten 2028: Hinweis mit beiden Jahren', () => {
    vi.setSystemTime(new Date(2028, 2, 1));
    const html = zeichne();
    expect(html).toContain('data-teil="vu-veraltet"');
    expect(html).toContain('Für 2028 sind hier noch keine Prämien hinterlegt. Die Werte unten sind die Prämien 2027');
  });

  it('2026 und in der Wechselzeit: kein Hinweis', () => {
    for (const tag of [new Date(2026, 9, 22), new Date(2026, 11, 20), new Date(2027, 5, 1)]) {
      vi.setSystemTime(tag);
      expect(zeichne()).not.toContain('vu-veraltet');
    }
  });

  it('Text in allen fünf Sprachen mit {jahr} und {aktuell}, ohne feste Jahreszahl', () => {
    for (const s of [de, en, fr, itSprache, rm]) {
      expect(s.po.veraltet).toContain('{jahr}');
      expect(s.po.veraltet).toContain('{aktuell}');
      expect(s.po.veraltet).not.toMatch(/20\d\d/);
    }
  });
});
