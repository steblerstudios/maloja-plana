import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { RECHNER_KAPITEL } from '../config/brotkrumePfade.js';
import { CHAPTER_KEYS } from '../config/constants.js';
import { AlvRechner } from '../AlvRechner.jsx';
import { EOrechner } from '../EOrechner.jsx';

// Rechner-Form X (Entscheid Stebler Studios 24.10.2026, gebaut F7-A2 27.10.2026): in jedem umgestellten Rechner
// steht das Ergebnis ZUERST (role="status"), dann «Ihre Angaben», dann was zu tun ist, die offizielle Stelle und
// zuletzt die Quelle. Geprüft an den `data-teil`-Marken der Hülle components/RechnerForm.jsx, nicht an Texten.
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
const render = (C, data, extra = {}) => renderToStaticMarkup(React.createElement(C, { palette, t, data, onNavigate: () => {}, onUpdateData: () => {}, ...extra }));

const leer = { basis: {}, finanzen: {}, wohnen: {} };
const maria = { basis: { canton: 'ZH', dateOfBirth: '1992-03-14' }, finanzen: { monthlyIncome: 5200, incomeType: 'netto' }, wohnen: {} };

// [Ansicht, Komponente, Profil mit Ergebnis]
const RECHNER = [
  ['alv', AlvRechner, { ...maria, finanzen: { monthlyIncome: 6000, incomeType: 'brutto' } }],
  ['eo', EOrechner, { ...maria, finanzen: { monthlyIncome: 6000, incomeType: 'brutto' } }],
];

const TEILE = ['kopf', 'ergebnis', 'angaben', 'tun', 'stelle', 'quelle'];
const reihenfolge = (html) => TEILE.map((teil) => html.indexOf('data-teil="' + teil + '"')).filter((i) => i >= 0);

describe('Rechner-Form X: Ergebnis vor den Angaben, role=status', () => {
  for (const [view, C, mitErgebnis] of RECHNER) {
    for (const [fall, data] of [['ohne Angaben', leer], ['mit Ergebnis', mitErgebnis]]) {
      it(`${view} (${fall}): Teile in der Reihenfolge der Form`, () => {
        const html = render(C, data);
        expect(html).toContain('data-rechner-form="' + view + '"');
        const pos = reihenfolge(html);
        expect(pos.length).toBeGreaterThanOrEqual(4);
        expect([...pos].sort((a, b) => a - b)).toEqual(pos);
        expect(html.indexOf('data-teil="ergebnis"')).toBeLessThan(html.indexOf('data-teil="angaben"'));
      });
      it(`${view} (${fall}): Ergebnis ist eine Live-Region, Angaben aufgeklappt mit «x von n»`, () => {
        const html = render(C, data);
        expect(html).toMatch(/data-teil="ergebnis" role="status" aria-live="polite"/);
        expect(html).toMatch(/<details data-teil="angaben" open=""/);
        expect(html).toMatch(/\d+ von \d+/);
      });
      it(`${view} (${fall}): Quelle als feste letzte Zeile`, () => {
        const html = render(C, data);
        const q = html.indexOf('data-teil="quelle"');
        expect(q).toBeGreaterThan(html.indexOf('data-teil="ergebnis"'));
        expect(reihenfolge(html).at(-1)).toBe(q);
      });
    }
    it(`${view}: Brotkrume «Übersicht › Kapitel › Rechner» im Kopf`, () => {
      const html = render(C, leer);
      const kapitel = RECHNER_KAPITEL[view];
      expect(CHAPTER_KEYS).toContain(kapitel);
      expect(html).toContain('<nav aria-label="' + de.nav.pfad + '"');
      expect(html).toContain('>' + de.chapters[kapitel].title.replace(/&/g, '&amp;') + '</button>');
      expect(html).toMatch(/aria-current="page"/);
    });
  }
  it('jeder Eintrag in RECHNER_KAPITEL ist hier geprüft', () => {
    expect(Object.keys(RECHNER_KAPITEL).sort()).toEqual(RECHNER.map(([v]) => v).sort());
  });
});

describe('ALV in der Form X', () => {
  it('Einzelwahl als radiogroup mit role=radio und aria-checked', () => {
    const html = render(AlvRechner, leer);
    expect((html.match(/role="radiogroup"/g) || []).length).toBe(2);
    expect(html).toMatch(/role="radio" aria-checked="(true|false)"/);
  });
  it('ohne Lohn: an der Stelle des Ergebnisses der App-Satz', () => {
    const html = render(AlvRechner, leer);
    const ergebnis = html.slice(html.indexOf('data-teil="ergebnis"'), html.indexOf('data-teil="angaben"'));
    expect(ergebnis).toContain(de.alv.enterBrutto.sie);
    expect(ergebnis).toContain('data-ergebnis-art="schaetzung"');
  });
  it('F7-R4: Netto im Profil → Brutto geschätzt vorbelegt und sichtbar markiert', () => {
    const html = render(AlvRechner, maria);
    expect(html).toContain('data-geschaetzt=""');
    expect(html).toMatch(/id="alv-brutto"[^>]*value="\d{4,5}"/);
    expect(html).toContain('Geschätzt aus dem Nettolohn im Profil');
    // Das Ergebnis rechnet mit der Schätzung.
    expect(html).toContain('data-grosse-zahl');
  });
  it('F7-R4: Brutto im Profil → keine Marke, der hinterlegte Wert gilt', () => {
    const html = render(AlvRechner, { ...maria, finanzen: { monthlyIncome: 6100, incomeType: 'brutto' } });
    expect(html).not.toContain('data-geschaetzt');
    expect(html).toMatch(/id="alv-brutto"[^>]*value="6100"/);
  });
  it('Befund X: ein Kind über 25 (nur Geburtsdatum) belegt «Kinder: ja» nicht vor', () => {
    const kind = (k) => render(AlvRechner, { ...leer, basis: { household: { adults: 1, children: [k] } } });
    const kinderJa = (html) => /aria-labelledby="alv-kinder-label"[^>]*><button type="button" role="radio" aria-checked="true"/.test(html);
    expect(kinderJa(kind({ birthDate: '1990-01-01', age: '' }))).toBe(false);
    expect(kinderJa(kind({ birthDate: '2015-01-01', age: '' }))).toBe(true);
    expect(kinderJa(kind({ age: 30 }))).toBe(false);
    expect(kinderJa(kind({}))).toBe(true); // ohne Alter zählt das Kind (überschreibbar)
  });
  it('ein Name für Titel, Menü und Suche: «Arbeitslosenentschädigung», «ALV-Taggeld» bleibt Suchwort', async () => {
    for (const sprache of [de, en, fr, itTranslations, rm]) expect(sprache.nav.alv).toBe(sprache.alv.title);
    const { SEARCH_VIEWS } = await import('../config/ansichtenRegister.js');
    expect(SEARCH_VIEWS.find((v) => v.view === 'alv').aliases).toContain('alv-taggeld');
  });
});
