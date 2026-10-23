import { describe, it, expect, vi, afterEach } from 'vitest';

// Fachprüfung 22.10.2026 zu #529 (🔴): Frauen JG 1961–63, eigene Beitragsjahre bis zum Referenzalter.
// Die Jahre zwischen Bezug und Referenzalter zählen in Kalenderjahren (bis 31.12. vor Rentenbeginn,
// Merkblatt 3.01 Ziff. 12) und hängen am Geburtsmonat. Prüfsatz: eingetippte 44 (= Platzhalter, ohne
// Lücke) ergeben dasselbe wie das leere Feld (Annahme «ohne Lücke»). Vorher bei JG 1962 / September,
// Bezug 63: 2 088 statt 2 039, bei Bezug 64 eine Vollrente ohne Lücke.
let bezugAlter = '63';
let beitragsjahre = '';
let leerZaehler = 0;
vi.mock('react', async (original) => {
  const R = await original();
  const useState = (init) => {
    let start = init;
    if (init === '' && leerZaehler++ === 0) start = beitragsjahre;
    if (typeof start === 'function') {
      start = start();
      if (start === '64.5') start = bezugAlter; // Startwert des Bezugsalters = Referenzalter JG 1962
    }
    return R.useState(start);
  };
  return { ...R, useState, default: { ...R.default, useState } };
});

const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');
const de = (await import('../i18n/de.js')).default;
const { VorsorgeRechner } = await import('../VorsorgeRechner.jsx');

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (schluessel, p) => {
  const wert = String(schluessel).split('.').reduce((o, k) => (o == null ? undefined : o[k]), de);
  let text = wert && typeof wert === 'object' ? (wert.sie ?? Object.values(wert)[0]) : wert;
  if (typeof text !== 'string') return schluessel;
  if (p) for (const [k, v] of Object.entries(p)) text = text.split('{' + k + '}').join(String(v));
  return text;
};
const zeichne = (dateOfBirth) => {
  leerZaehler = 0;
  const data = {
    basis: { canton: 'BS', gender: 'female', dateOfBirth, maritalStatus: 'single', household: { adults: 1, children: [] } },
    finanzen: { monthlyIncome: 6153.85, incomeType: 'brutto', dreizehnter: 'yes' },
  };
  return renderToStaticMarkup(React.createElement(VorsorgeRechner, { palette, t, data, onNavigate: () => {}, onUpdateData: () => {} }));
};
// Monatsrente (grosse Zahl) und Rente ab Referenzalter aus dem AHV-Block
const { zahl } = await import('../utils/geld.js');
const esc = (x) => String(x).replace(/&/g, '&amp;').replace(/'/g, '&#x27;');
// Skala (x/y Jahre), Kürzung in CHF, Rente ab Referenzalter — eindeutige Stellen im AHV-Block
const werte = (html) => [
  (html.match(/\((\d+\/\d+) Jahre\)/) || [])[1],
  (html.match(/Kürzung \(Vorbezug\): [^<]*= CHF ([^ <]+) \//) || [])[1],
  (html.match(/Ab dem Referenzalter \([^)]*\): CHF ([^ <]+) \//) || [])[1],
];

afterEach(() => { bezugAlter = '63'; beitragsjahre = ''; });

describe('JG 1962: eingetippte 44 = leeres Feld, je Geburtsmonat und Bezugsalter', () => {
  for (const geburt of ['1962-09-15', '1962-02-15', '1962-12-01']) {
    for (const bezug of ['63', '64']) {
      it(`${geburt}, Bezug ${bezug}`, () => {
        bezugAlter = bezug;
        const leer = werte(zeichne(geburt));
        expect(leer[0]).toBeDefined();
        beitragsjahre = '44';
        expect(werte(zeichne(geburt))).toEqual(leer);
      });
    }
  }
  it('Beleg der Prüfung: September 1962, Bezug 63 → 2 039 bis Referenzalter, 2 147 danach', () => {
    beitragsjahre = '44';
    const html = zeichne('1962-09-15');
    expect(werte(html)).toEqual(['42/44', '232', esc(zahl(2147))]);
    expect(html).toContain('CHF ' + esc(zahl(2039)) + ' / ' + t('vr.monat'));
  });
});
