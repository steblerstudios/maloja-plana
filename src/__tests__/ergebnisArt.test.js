import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ERGEBNIS_ART, ERGEBNIS_ARTEN, ergebnis, ergebnisSatz, fehlendeAngaben, istErgebnisArt } from '../data/ergebnisArt.js';
import { alvErgebnis } from '../data/alvRechner.js';
import { getMietzinsbeitraege, mietzinsEinschaetzung } from '../data/mietzinsbeitraege.js';
import { PFLEGE_ENTLOEHNUNG_ERGEBNIS, PflegeEntloehnung } from '../PflegeEntloehnung.jsx';
import { AlvRechner } from '../AlvRechner.jsx';
import { MietzinsOrientierung } from '../MietzinsOrientierung.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import itTexte from '../i18n/it.js'; // nicht `it` — kollidiert mit vitest it()
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// ─────────────────────────────────────────────────────────────
// O3 · Ergebnis-Art als festes Feld.
// Geprüft wird die ZUSAGE, nicht die Schreibweise:
//   1. Jeder umgestellte Rechner meldet eine der vier Arten — an der Aufrufstelle, im gerenderten
//      Markup, nicht nur in seiner reinen Funktion (ein Wächter nur an der Funktion hätte eine
//      Aufrufstelle, die das Feld wegwirft, nicht bemerkt).
//   2. Fehlen Angaben, steht ihre Zahl da — in jeder Sprache.
//   3. Kein umgestellter Rechner nennt sich «Berechnung» (Wahrheits-Disziplin, Stand 24.09.2026).
// ─────────────────────────────────────────────────────────────

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const tStub = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (C, props) => renderToStaticMarkup(React.createElement(C, { palette, t: tStub, onNavigate: () => {}, ...props }));

// Alle Ergebnis-Art-Zeilen im Markup: [{ art, fehlend }]
const artZeilen = (html) => [...html.matchAll(/data-ergebnis-art="([^"]*)" data-fehlend="(\d+)"/g)]
  .map((m) => ({ art: m[1], fehlend: Number(m[2]) }));

const leer = { basis: {}, finanzen: {}, wohnen: {}, versicherungen: {} };

describe('O3 · das Feld selbst', () => {
  it('kennt genau vier Arten, von genau bis vorsichtig', () => {
    expect(ERGEBNIS_ARTEN).toEqual(['berechnung', 'schaetzung', 'vorpruefung', 'orientierung']);
    for (const a of ERGEBNIS_ARTEN) expect(istErgebnisArt(a)).toBe(true);
  });

  it('eine unbekannte Art fällt laut aus, statt still auszuweichen', () => {
    expect(() => ergebnis('ungefaehr')).toThrow(TypeError);
    expect(() => ergebnis(undefined)).toThrow(TypeError);
  });

  it('zählt fehlende Angaben, jede nur einmal', () => {
    expect(ergebnis(ERGEBNIS_ART.SCHAETZUNG, { fehlend: ['a', 'b', 'a', null] }).fehlend).toEqual(['a', 'b']);
    expect(fehlendeAngaben({ a: true, b: false, c: 0, d: 'x' })).toEqual(['b', 'c']);
  });

  it('der Satz trägt die Zahl der fehlenden Angaben — in allen fünf Sprachen', () => {
    const sprachen = { de, fr, it: itTexte, en, rm };
    for (const [lang, texte] of Object.entries(sprachen)) {
      const t = createT({ [lang]: texte, de }, lang, 'sie');
      for (const art of ERGEBNIS_ARTEN) {
        const ohne = ergebnisSatz(ergebnis(art), t);
        const drei = ergebnisSatz(ergebnis(art, { fehlend: ['a', 'b', 'c'] }), t);
        const eine = ergebnisSatz(ergebnis(art, { fehlend: ['a'] }), t);
        // Kein roher Schlüssel, kein offener Platzhalter.
        for (const s of [ohne, eine, drei]) {
          expect(s, `${lang}/${art}`).not.toMatch(/ergebnisArt\.|\{/);
        }
        expect(drei, `${lang}/${art}: die Zahl 3 fehlt`).toMatch(/\b3\b/);
        expect(ohne, `${lang}/${art}: ohne Fehlende keine Zahl`).not.toMatch(/\d/);
        // Die fehlende Angabe verlängert den Satz — sie wird gesagt, nicht verschluckt.
        expect(eine.length, `${lang}/${art}`).toBeGreaterThan(ohne.length);
      }
    }
  });
});

describe('O3 · ALV-Rechner (Schätzung)', () => {
  it('reine Funktion: immer Schätzung, fehlend = was das Ergebnis verändert', () => {
    for (const bruttolohn of [0, 6000]) for (const beitragsmonate of [0, 14]) for (const alter of [null, 40]) {
      const e = alvErgebnis({ bruttolohn, beitragsmonate, alter });
      expect(e.art).toBe(ERGEBNIS_ART.SCHAETZUNG);
      const erwartet = (bruttolohn ? 0 : 1) + (beitragsmonate ? 0 : 1) + (alter == null ? 1 : 0);
      expect(e.fehlend.length).toBe(erwartet);
    }
  });

  it('Aufrufstelle: ohne Angaben meldet der Rechner seine Art und drei fehlende', () => {
    const zeilen = artZeilen(render(AlvRechner, { data: leer }));
    expect(zeilen).toHaveLength(1);
    expect(istErgebnisArt(zeilen[0].art)).toBe(true);
    expect(zeilen[0]).toEqual({ art: 'schaetzung', fehlend: 3 });
  });

  it('Aufrufstelle: mit Lohn und Geburtsdatum fehlen nur noch die Beitragsmonate', () => {
    const data = { ...leer, basis: { dateOfBirth: '1986-03-01' }, finanzen: { monthlyIncome: 6000, incomeType: 'brutto' } };
    expect(artZeilen(render(AlvRechner, { data }))).toEqual([{ art: 'schaetzung', fehlend: 1 }]);
  });
});

describe('O3 · Mietzinsbeiträge (Vorprüfung)', () => {
  const KANTONE = ['AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE', 'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH'];

  it('reine Funktion: wo geprüft wird, nie ein Betrag — also nie Berechnung oder Schätzung', () => {
    let geprueft = 0;
    for (const k of KANTONE) for (const annualIncome of [0, 30000, 200000]) for (const childrenCount of [0, 2]) {
      const info = getMietzinsbeitraege(k);
      const { ergebnis: e } = mietzinsEinschaetzung({ info, annualIncome, householdSize: 1 + childrenCount, childrenCount });
      if (info.state !== 'has') { expect(e, k).toBeNull(); continue; }
      geprueft++;
      expect([ERGEBNIS_ART.VORPRUEFUNG, ERGEBNIS_ART.ORIENTIERUNG], k).toContain(e.art);
    }
    expect(geprueft, 'Gegenprobe: mindestens ein Kanton wird wirklich geprüft').toBeGreaterThan(0);
  });

  it('Aufrufstelle: ohne Kanton und Einkommen wartet die Vorprüfung auf zwei Angaben', () => {
    expect(artZeilen(render(MietzinsOrientierung, { data: leer }))).toEqual([{ art: 'vorpruefung', fehlend: 2 }]);
  });

  it('Aufrufstelle: Basel-Stadt ohne Einkommen — noch eine Angabe; mit Einkommen — keine', () => {
    const bs = { ...leer, basis: { canton: 'BS' } };
    expect(artZeilen(render(MietzinsOrientierung, { data: bs }))).toEqual([{ art: 'vorpruefung', fehlend: 1 }]);
    const mit = { ...bs, finanzen: { monthlyIncome: 8000 } };
    expect(artZeilen(render(MietzinsOrientierung, { data: mit }))).toEqual([{ art: 'vorpruefung', fehlend: 0 }]);
  });

  it('über der Richtgrenze nennt der Satz das Einkommen, statt «{income}» stehen zu lassen', () => {
    const t = createT({ de }, 'de', 'sie');
    const html = renderToStaticMarkup(React.createElement(MietzinsOrientierung, {
      palette, t, onNavigate: () => {}, data: { ...leer, basis: { canton: 'BS' }, finanzen: { monthlyIncome: 8000 } },
    }));
    expect(html).not.toContain('{income}');
    expect(html).toContain('96');
  });
});

describe('O3 · Pflege-Entlöhnung (Orientierung)', () => {
  it('Anbieter-Richtwert mal Stunden ist Orientierung, ohne fehlende Angabe — auch an der Aufrufstelle', () => {
    expect(PFLEGE_ENTLOEHNUNG_ERGEBNIS.art).toBe(ERGEBNIS_ART.ORIENTIERUNG);
    expect(artZeilen(render(PflegeEntloehnung, {}))).toEqual([{ art: 'orientierung', fehlend: 0 }]);
  });
});

describe('O3 · Wahrheits-Disziplin', () => {
  it('kein umgestellter Rechner nennt sich «Berechnung»', () => {
    const faelle = [
      alvErgebnis({ bruttolohn: 6000, beitragsmonate: 20, alter: 40 }),
      PFLEGE_ENTLOEHNUNG_ERGEBNIS,
      mietzinsEinschaetzung({ info: getMietzinsbeitraege('BS'), annualIncome: 30000 }).ergebnis,
      mietzinsEinschaetzung({ info: getMietzinsbeitraege('GE'), annualIncome: 30000 }).ergebnis,
    ];
    for (const e of faelle) expect(e.art).not.toBe(ERGEBNIS_ART.BERECHNUNG);
  });
});
