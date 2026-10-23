import { describe, it, expect, vi, afterEach } from 'vitest';

// Fachprüfung 21.10.2026 (Merkblatt 3.04 Ziff. 5): Bezug 63, Ø 80 000, leere Beitragsjahre.
// Bis 65 Teilrente 42/44 mit 13,6 % Kürzung = 1 962, ab 65 neu berechnet 2 379 − 309 = 2 070.
// Vorher stand im AHV-Block lebenslang 1 962. Geprüft am gezeichneten Rechner: Reiter, Bezugsalter
// und nichts sonst werden über den Startwert von useState gesetzt.
let reiter = 'ahv';
let bezugAlter = '63';
let beitragsjahre = '';   // Feld «Beitragsjahre» = erster useState('') im Rechner
let leerZaehler = 0;
vi.mock('react', async (original) => {
  const R = await original();
  const useState = (init) => {
    let start = init === 'ahv' ? reiter : init;
    if (init === '' && leerZaehler++ === 0) start = beitragsjahre;
    if (typeof start === 'function') {
      start = start();
      if (start === '65') start = bezugAlter; // Startwert des Bezugsalters = Referenzalter
    }
    return R.useState(start);
  };
  return { ...R, useState, default: { ...R.default, useState } };
});

const React = (await import('react')).default;
const { renderToStaticMarkup } = await import('react-dom/server');
const de = (await import('../i18n/de.js')).default;
const { VorsorgeRechner } = await import('../VorsorgeRechner.jsx');
const { zahl } = await import('../utils/geld.js');

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (schluessel, p) => {
  const wert = String(schluessel).split('.').reduce((o, k) => (o == null ? undefined : o[k]), de);
  let text = wert && typeof wert === 'object' ? (wert.sie ?? Object.values(wert)[0]) : wert;
  if (typeof text !== 'string') return schluessel;
  if (p) for (const [k, v] of Object.entries(p)) text = text.split('{' + k + '}').join(String(v));
  return text;
};
const zeichne = (data) => (leerZaehler = 0, renderToStaticMarkup(React.createElement(VorsorgeRechner, { palette, t, data, onNavigate: () => {}, onUpdateData: () => {} })));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/'/g, '&#x27;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const geburtsjahr = new Date().getFullYear() - 40;
const profil = {
  basis: { canton: 'BS', dateOfBirth: geburtsjahr + '-01-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 6153.85, incomeType: 'brutto', dreizehnter: 'yes' },
};
const chf = (v) => 'CHF ' + esc(zahl(v));
const ab65 = esc(t('vr.renteAbReferenzalter', { alter: '65 ' + t('vr.jahre'), betrag: zahl(2070) })) + ' / ' + t('vr.monat');

afterEach(() => { reiter = 'ahv'; bezugAlter = '63'; beitragsjahre = ''; });

describe('Vorsorge-Rechner: Vorbezug wird im Referenzalter neu berechnet (Merkblatt 3.04 Ziff. 5)', () => {
  it('Reiter AHV: 1 962 bis 65, darunter 2 070 ab 65, Kürzung in Franken, Annahme mit beiden Zählungen', () => {
    const html = zeichne(profil);
    expect(html).toContain(chf(1962) + ' / ' + t('vr.monat'));
    expect(html).toContain(ab65);
    expect(html).toContain(esc(t('vr.vorbezugNeuberechnung')));
    expect(html).toContain(t('vr.vorbezug') + ': 13.6% = ' + chf(309) + ' / ' + t('vr.monat'));
    expect(html).toContain(esc(t('vr.beitragsjahreAngenommenVorbezug', { referenzalter: '65 ' + t('vr.jahre'), alter: '63 ' + t('vr.jahre'), jahre: 42, jahreRef: 44 })));
    expect(html).not.toContain(t('vr.fehlendeBeitragsjahre'));
  });

  it('Reiter Vergleich: Zeile 63 zeigt dieselben 1 962 und darunter ab 65 die 2 070', () => {
    reiter = 'vergleich';
    const html = zeichne(profil);
    expect(html).toContain(chf(1962));
    expect(html).toContain(esc(t('vr.abAlterKurz', { alter: '65 ' + t('vr.jahre'), betrag: zahl(2070) })));
    expect(html).toContain(esc(t('vr.abAlterKurz', { alter: '65 ' + t('vr.jahre'), betrag: zahl(2070 * 13) })));
  });

  it('Bezug im Referenzalter: keine Zeile «ab Referenzalter», bisheriger Annahme-Text', () => {
    bezugAlter = '65';
    const html = zeichne(profil);
    expect(html).not.toContain(esc(t('vr.vorbezugNeuberechnung')));
    expect(html).toContain(esc(t('vr.beitragsjahreAngenommen', { alter: '65 ' + t('vr.jahre'), jahre: 44 })));
  });

  it('Reiter Zukunft: AHV-Fläche steigt von der heutigen Anwartschaft zum Rücktritt an', () => {
    reiter = 'zukunft';
    bezugAlter = '65';
    const html = zeichne(profil);
    // Erste Fläche im Bild = AHV-Fundament; Punkte je Alter ab heute (40) bis 100.
    const bild = html.slice(html.indexOf('viewBox="0 0 680 340"'));
    const d = bild.match(/<path d="(M [^"]+)"/)[1];
    const y = (i) => Number(d.replace(/^M /, '').split(' L ')[i].split(' ')[1]);
    expect(y(0)).toBeGreaterThan(y(25)); // SVG: kleiner = höher; heute 19/44, bei 65 44/44
  });

  it('Reiter Zukunft beim Vorbezug: Rente ab Referenzalter steht beim Monatsbalken', () => {
    reiter = 'zukunft';
    const html = zeichne(profil);
    expect(html).toContain('AHV ' + esc(t('vr.abAlterKurz', { alter: '65 ' + t('vr.jahre'), betrag: zahl(2070) })) + ' / ' + t('vr.monat'));
  });
});

describe('Eigene Beitragsjahre zählen bis zum Referenzalter (Sophie, 22.10.2026)', () => {
  // 40 eingetragen = 40 Jahre im Referenzalter. Bezug 63: bis 65 fehlen die zwei Vorbezugsjahre
  // (38/44 = 2 055, Kürzung 13,6 % = 279), ab 65 40/44 = 2 163 − 279 = 1 884. Merkblatt 3.04 Ziff. 5
  // («genau gleichgestellt»): Rente ab 65 + Kürzung = Rente bei Bezug mit 65.
  it('Reiter AHV, Bezug 63: 1 776 bis 65, 1 884 ab 65', () => {
    beitragsjahre = '40';
    const html = zeichne(profil);
    expect(html).toContain(chf(1776) + ' / ' + t('vr.monat'));
    expect(html).toContain(esc(t('vr.renteAbReferenzalter', { alter: '65 ' + t('vr.jahre'), betrag: zahl(1884) })));
    expect(html).toContain('(38/44 ' + t('vr.jahre') + ')');
  });
  it('Reiter AHV, Bezug 65: dieselben 40 Jahre, 2 163 — die Zahl hängt nicht am Regler', () => {
    beitragsjahre = '40';
    bezugAlter = '65';
    const html = zeichne(profil);
    expect(html).toContain(chf(2163) + ' / ' + t('vr.monat'));
    expect(html).toContain('(40/44 ' + t('vr.jahre') + ')');
  });
  it('Vergleich: Zeile 63 ab 65 + Kürzung = Zeile 65', () => {
    beitragsjahre = '40';
    reiter = 'vergleich';
    const html = zeichne(profil);
    expect(html).toContain(chf(1776));
    expect(html).toContain(esc(t('vr.abAlterKurz', { alter: '65 ' + t('vr.jahre'), betrag: zahl(1884) })));
    expect(html).toContain(chf(2163));
    expect(1884 + 279).toBe(2163);
  });
  it('Feld: Platzhalter 44 und Hinweis «bis zum Referenzalter», auch beim Vorbezug', () => {
    const html = zeichne(profil);
    const feld = html.match(new RegExp('<input[^>]*aria-label="' + t('vr.beitragsjahre') + '"[^>]*>'));
    expect(feld && feld[0]).toContain('placeholder="44"');
    expect(html).toContain(esc(t('vr.beitragsjahreHint', { referenzalter: '65 ' + t('vr.jahre') })));
  });
});

describe('Neue Texte in allen fünf Sprachen', () => {
  it('vorhanden, mit Platzhaltern, Sie/Du wo angeredet wird', async () => {
    for (const lang of ['de', 'fr', 'it', 'en', 'rm']) {
      const vr = (await import('../i18n/' + lang + '.js')).default.vr;
      for (const p of ['{referenzalter}', '{alter}', '{jahre}', '{jahreRef}']) expect(vr.beitragsjahreAngenommenVorbezug, lang).toContain(p);
      for (const p of ['{alter}', '{betrag}']) {
        expect(vr.renteAbReferenzalter, lang).toContain(p);
        expect(vr.abAlterKurz, lang).toContain(p);
      }
      expect(vr.beitragsjahreHint && (vr.beitragsjahreHint.sie || vr.beitragsjahreHint), lang).toContain('{referenzalter}');
      const n = vr.vorbezugNeuberechnung;
      if (lang === 'en') expect(typeof n).toBe('string');
      else {
        expect(typeof n.sie, lang).toBe('string');
        expect(typeof n.du, lang).toBe('string');
        expect(n.sie, lang).not.toBe(n.du);
      }
    }
  });
});
