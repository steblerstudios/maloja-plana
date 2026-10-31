// Netz-Schild (F7-K3-6, Stebler Studios 27.10.2026): ein Schild aus Teilen statt Spinnennetz und zwei Schilden.
// Umbau am selben Tag: Vorsorge mit drei Säulen, Unfall mit Zusatz (neues Feld), Haushalt mit Haftpflicht und
// Hausrat, Hausrat-Pflicht je Kanton mit Prüf-Vermerk, Leben oben in der Mitte.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { netzSchildTeile, teilWinkel, fuellung, SCHILD_KERN } from '../data/netzSchild.js';
import { hausratPflicht, HAUSRAT_PFLICHT } from '../data/hausratPflicht.js';
import { NetzSchild } from '../components/NetzSchild.jsx';
import { schildOptionen } from '../data/schutzschild.js';
import { getChapters, LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';
import { DEMO_DATA } from '../config/demoData.js';

const t = createT({ de }, 'de', 'sie');
const nurText = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const angestellt = { employed: true, annualIncome: 80000, lohnBasis: 'brutto', finanzen: { employmentType: 'employed' } };
const teil = (r, key) => r.teile.find((p) => p.key === key);

describe('Teile und Reihenfolge', () => {
  it('Leben oben in der Mitte; Haushalt, Vorsorge, Leben, Krankenkasse, Unfall im Uhrzeigersinn', () => {
    const r = netzSchildTeile({ kkInsurer: 'CSS' }, angestellt);
    expect(r.teile.map((p) => p.key)).toEqual(['haushalt', 'vorsorge', 'leben', 'kk', 'uvg']);
    expect(teilWinkel(2, 5, 2)).toBe(270);
  });
  it('ohne Anstellung kein Teil Unfall (die Krankenkasse deckt Unfälle) — Leben bleibt oben', () => {
    const r = netzSchildTeile({ kkInsurer: 'CSS' }, { employed: false });
    expect(r.teile.map((p) => p.key)).toEqual(['haushalt', 'vorsorge', 'leben', 'kk']);
    const i = r.teile.findIndex((p) => p.key === 'leben');
    expect(teilWinkel(i, r.teile.length, i)).toBe(270);
  });
  it('Füllung: kleiner Kern ohne Erfülltes, anteilig, ganz', () => {
    expect(fuellung({ erreicht: 0, n: 3 })).toBe(SCHILD_KERN);
    expect(fuellung({ erreicht: 3, n: 3 })).toBe(1);
    expect(fuellung({ erreicht: 1, n: 2 })).toBeCloseTo(0.67, 2);
  });
});

describe('Krankenkasse und Unfall mit Zusatz', () => {
  it('Krankenkasse: KVG, dann Zusatz', () => {
    expect(teil(netzSchildTeile({ kkInsurer: 'CSS' }, {}), 'kk').erreicht).toBe(1);
    expect(teil(netzSchildTeile({ kkInsurer: 'CSS', kkZusatz: 'Spital' }, {}), 'kk').erreicht).toBe(2);
  });
  it('Unfall: UVG Pflicht, Zusatz freiwillig aus dem neuen Feld uvgZusatz', () => {
    const u = teil(netzSchildTeile({ kkInsurer: 'CSS', uvg: 'employer', uvgZusatz: 'yes' }, angestellt), 'uvg');
    expect(u.versicherungen.map((x) => [x.key, x.art, x.ok])).toEqual([['uvg', 'pflicht', true], ['uvgZusatz', 'freiwillig', true]]);
    expect(u.erreicht).toBe(2);
  });
  it('das Feld «Unfall-Zusatzversicherung» steht im Kapitel, direkt nach UVG', () => {
    const felder = getChapters(t).find((c) => c.key === 'versicherungen').fields.map((f) => f.k);
    expect(felder.indexOf('uvgZusatz')).toBe(felder.indexOf('uvg') + 1);
  });
});

describe('Vorsorge in drei Säulen', () => {
  it('angestellt über der Schwelle: AHV, Pensionskasse, Säule 3a', () => {
    const r = netzSchildTeile({ kkInsurer: 'CSS', bvgInsurer: 'PK' }, { ...angestellt, finanzen: { employmentType: 'employed', pension3a: '7000' } });
    const vs = teil(r, 'vorsorge');
    expect(vs.versicherungen.map((x) => [x.key, x.art, x.ok])).toEqual([['ahv', 'pflicht', true], ['bvg', 'pflicht', true], ['saeule3a', 'freiwillig', true]]);
    expect(vs.erreicht).toBe(3);
  });
  it('ohne Erwerb: nur AHV (Pflicht auch ohne Erwerb, AHVG Art. 10) — ohne Beitrag noch nicht gedeckt', () => {
    const vs = teil(netzSchildTeile({ kkInsurer: 'CSS' }, { employed: false }), 'vorsorge');
    expect(vs.versicherungen.map((x) => x.key)).toEqual(['ahv']);
    expect(vs.erreicht).toBe(0);
    expect(teil(netzSchildTeile({ kkInsurer: 'CSS', ahvContribution: '530' }, {}), 'vorsorge').erreicht).toBe(1);
  });
  it('im Ruhestand ist die AHV keine Lücke', () => {
    expect(teil(netzSchildTeile({ kkInsurer: 'CSS' }, { finanzen: { employmentType: 'retired' } }), 'vorsorge').erreicht).toBe(1);
  });
});

describe('Haushalt und Hausrat-Pflicht je Kanton', () => {
  it('Haftpflicht und Hausrat in einem Teil', () => {
    const hh = teil(netzSchildTeile({ kkInsurer: 'CSS', liabilityInsurance: 'yes' }, { kanton: 'ZH' }), 'haushalt');
    expect(hh.versicherungen.map((x) => [x.key, x.art, x.ok])).toEqual([['haftpflicht', 'haftpflicht', true], ['hausrat', 'freiwillig', false]]);
    expect(hh.erreicht).toBe(1);
  });
  it('Hausrat Pflicht in NW, FR, JU, VD; ohne Kanton «je nach Kanton»', () => {
    expect(['NW', 'FR', 'JU', 'VD', 'vd'].map(hausratPflicht)).toEqual(['pflicht', 'pflicht', 'pflicht', 'pflicht', 'pflicht']);
    expect(hausratPflicht('ZH')).toBe('freiwillig');
    expect(hausratPflicht('')).toBe('unbekannt');
    expect(teil(netzSchildTeile({ kkInsurer: 'CSS' }, { kanton: 'VD' }), 'haushalt').versicherungen[1].art).toBe('kantonPflicht');
  });
  it('Prüf-Vermerk, solange die Erlasse nicht nachgelesen sind', () => {
    expect(HAUSRAT_PFLICHT.verify).toBe(true);
  });
});

describe('Bild und Text', () => {
  const html = (v, o = {}) => renderToStaticMarkup(React.createElement(NetzSchild, { palette: LIGHT_PALETTE, t, versicherungen: v, ...o }));
  it('nichts eingetragen: kein Schild', () => {
    expect(html({})).toBe('');
  });
  it('Satz und je Versicherung eine Zeile mit Wort, nicht nur Farbe', () => {
    const text = nurText(html({ kkInsurer: 'CSS', liabilityInsurance: 'yes' }, { kanton: 'VD' }));
    expect(text).toContain('Noch nicht gedeckt: Vorsorge, Leben.');
    expect(text).toContain('Teilweise: Haushalt, Krankenkasse.');
    expect(text).toContain('Hausrat · Pflicht in VD (Feuer und Elementar) noch nicht gedeckt');
    expect(text).toContain('Bitte bei der kantonalen Gebäudeversicherung bestätigen');
    expect(text).toContain('Privathaftpflicht · gesetzlich nicht vorgeschrieben gedeckt');
  });
  it('unter 8 Stunden pro Woche: Hinweis zur Freizeit (UVV Art. 13)', () => {
    const v = { kkInsurer: 'CSS', uvg: 'employer' };
    expect(html(v, { ...angestellt, stunden: '6' })).toContain('data-teil="unfall-8h"');
    expect(html(v, { ...angestellt, stunden: '42' })).not.toContain('data-teil="unfall-8h"');
  });
  it('das Bild nennt für Bildschirmleser je Teil «x von n»', () => {
    expect(html({ kkInsurer: 'CSS' }, { kanton: 'ZH' })).toContain('aria-label="Schild aus Versicherungsbereichen. Haushalt: 0 von 2; Vorsorge: 0 von 1; Leben: 0 von 1; Krankenkasse: 1 von 2."');
  });
  it('Beispiel Maria zeigt das Schild mit Vorsorge 3 von 3', () => {
    const o = { ...schildOptionen(DEMO_DATA), finanzen: DEMO_DATA.finanzen, kanton: DEMO_DATA.basis.canton, stunden: DEMO_DATA.ausbildung.workHoursPerWeek };
    const out = html(DEMO_DATA.versicherungen, o);
    expect(out).toContain('data-schild="netz"');
    expect(out).toContain('data-erreicht="3/3"');
  });
  it('alle Texte in fünf Sprachen', () => {
    const blatt = (o, p) => p.split('.').reduce((x, k) => (x == null ? x : x[k]), o);
    const keys = ['intro', 'aria', 'offen', 'gedeckt', 'vonN', 'nochOffen', 'teilweise', 'ganz', 'haftpflichtHinweis', 'hausratPruefen', 'unfall8h',
      ...['kk', 'uvg', 'vorsorge', 'haushalt', 'leben'].map((k) => 'kurz.' + k),
      ...['kvg', 'kkZusatz', 'uvg', 'uvgZusatz', 'ahv', 'bvg', 'saeule3a', 'haftpflicht', 'hausrat', 'leben'].map((k) => 'vers.' + k),
      ...['pflicht', 'freiwillig', 'haftpflicht', 'kantonPflicht', 'jeNachKanton'].map((k) => 'art.' + k)];
    for (const sprache of [de, en, fr, it_, rm]) {
      for (const k of keys) expect(blatt(sprache, 'netzSchild.' + k)).toBeTruthy();
      expect(blatt(sprache, 'chapters.versicherungen.fields.uvgZusatz.label')).toBeTruthy();
    }
  });
});

describe('Beträge je Versicherung (Sophie 27.10.2026)', () => {
  const o = { ...schildOptionen(DEMO_DATA), finanzen: DEMO_DATA.finanzen, kanton: DEMO_DATA.basis.canton };
  const html = renderToStaticMarkup(React.createElement(NetzSchild, { palette: LIGHT_PALETTE, t, versicherungen: DEMO_DATA.versicherungen, ...o }));
  const text = nurText(html);
  it('Maria: Kosten pro Monat und Jahr, Guthaben, Versicherungssumme — nur aus erfassten Feldern', () => {
    expect(text).toContain('CHF 540.30 / Mt. · CHF 6’483.60 / Jahr');
    expect(text).toContain('CHF 420 / Mt. · CHF 5’040 / Jahr · Guthaben CHF 45’000 · über den Lohn abgezogen');
    expect(text).toContain('CHF 10 / Mt. · CHF 120 / Jahr · Versicherungssumme CHF 5’000’000');
    expect(text).toContain('CHF 20 / Mt. · CHF 240 / Jahr');
    expect(html).toMatch(/data-betrag="uvg"[^>]*>läuft über den Arbeitgeber</);
  });
  it('ohne erfassten Betrag keine Zahl — nie geschätzt', () => {
    expect(html).not.toContain('data-betrag="leben"');
  });
  it('Texte in fünf Sprachen', () => {
    for (const sprache of [de, en, fr, it_, rm]) for (const k of ['kosten', 'guthaben', 'summe', 'lohn', 'arbeitgeber']) expect(sprache.netzSchild.betrag[k]).toBeTruthy();
  });
});
