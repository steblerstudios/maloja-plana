import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { VorlaeufigContext } from '../hooks/vorlaeufigContext.js';
import {
  addTodo, loadTodos, aufgabeAnlegen, merkpunktSichern, merkpunktUmschalten, merkpunktTagSetzen, einJahrSpaeter,
} from '../utils/merkliste.js';
import { merkpunktBereich, kategorieBereich } from '../data/aufgabenBereiche.js';

// Fassung 5 (Sophie, 23.10.2026): Merkliste ist die To-do-Liste. Optionales Feld «tag»,
// erledigtAm beim Abhaken, Wiederholung «jaehrlich», neue Einträge oben.

let store;
beforeEach(() => {
  store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
});

describe('Merkpunkt-Modell', () => {
  it('alte Einträge ohne Tag bleiben gültig (keine Migration)', () => {
    store.or5_merkliste = JSON.stringify([{ id: 'm1', text: 'Alt', link: null, done: false }]);
    expect(loadTodos()).toEqual([{ id: 'm1', text: 'Alt', link: null, done: false }]);
  });
  it('neue Einträge stehen oben', () => {
    addTodo({ text: 'Erster' });
    addTodo({ text: 'Zweiter' });
    expect(loadTodos().map(i => i.text)).toEqual(['Zweiter', 'Erster']);
  });
  it('aufgabeAnlegen: mit Tag und jährlicher Wiederholung', () => {
    expect(aufgabeAnlegen({ text: 'Prämienverbilligung fürs nächste Jahr prüfen', link: 'premium', tag: '2027-01-15', wiederholung: 'jaehrlich' }, false)).toBe('gespeichert');
    expect(loadTodos()[0]).toMatchObject({ link: 'premium', tag: '2027-01-15', wiederholung: 'jaehrlich', done: false });
  });
  it('aufgabeAnlegen: vorläufig bleibt nichts', () => {
    expect(aufgabeAnlegen({ text: 'X', tag: '2027-01-15' }, true)).toBe('vorlaeufig');
    expect(store.or5_merkliste).toBeUndefined();
  });
  it('ungültiger Tag wird nicht gespeichert', () => {
    merkpunktSichern({ text: 'Y', tag: 'morgen' }, false);
    expect(loadTodos()[0].tag).toBeUndefined();
  });
});

describe('Abhaken und Tag', () => {
  const a = { id: 'a', text: 'A', link: null, done: false };
  it('Abhaken speichert erledigtAm, wieder öffnen nimmt es weg', () => {
    const zu = merkpunktUmschalten([a], 'a', '2026-10-23');
    expect(zu[0]).toMatchObject({ done: true, erledigtAm: '2026-10-23' });
    const auf = merkpunktUmschalten(zu, 'a', '2026-10-24');
    expect(auf[0].done).toBe(false);
    expect(auf[0].erledigtAm).toBeUndefined();
  });
  it('jährlich: Abhaken legt den nächsten Tag ein Jahr später an, Rückgängig nimmt ihn weg', () => {
    const j = { ...a, tag: '2026-11-01', wiederholung: 'jaehrlich' };
    const zu = merkpunktUmschalten([j], 'a', '2026-10-23');
    expect(zu).toHaveLength(2);
    expect(zu[0]).toMatchObject({ text: 'A', tag: '2027-11-01', wiederholung: 'jaehrlich', done: false });
    expect(zu[1].folgeId).toBe(zu[0].id);
    const auf = merkpunktUmschalten(zu, 'a');
    expect(auf).toHaveLength(1);
    expect(auf[0]).toMatchObject({ id: 'a', done: false });
    expect(auf[0].folgeId).toBeUndefined();
  });
  it('jährlich ohne Tag: ein Jahr ab heute; 29. Februar wird 28.', () => {
    const zu = merkpunktUmschalten([{ ...a, wiederholung: 'jaehrlich' }], 'a', '2028-02-29');
    expect(zu[0].tag).toBe('2029-02-28');
    expect(einJahrSpaeter('2026-03-31')).toBe('2027-03-31');
  });
  it('Tag setzen und «Ohne Tag»', () => {
    const mit = merkpunktTagSetzen([a], 'a', '2026-11-03');
    expect(mit[0].tag).toBe('2026-11-03');
    expect('tag' in merkpunktTagSetzen(mit, 'a', null)[0]).toBe(false);
  });
});

describe('Bereichs-Zuordnung (festgelegt 23.10.2026)', () => {
  it.each([
    ['premium', 'versicherungen'], ['praemien', 'versicherungen'], ['vorsorge', 'versicherungen'],
    ['tax', 'behoerden'], ['calendar', 'behoerden'], ['direktlinks', 'behoerden'],
    ['sozialhilfe', 'finanzen'], ['alv', 'ausbildung'], ['stipendien', 'ausbildung'],
    ['asyl', 'basis'], ['tresor', 'basis'], [null, 'basis'],
  ])('Merkpunkt %s → %s', (link, bereich) => expect(merkpunktBereich(link)).toBe(bereich));
  it.each([
    ['health', 'versicherungen'], ['insurance', 'versicherungen'], ['admin', 'behoerden'], ['legal', 'behoerden'],
    ['work', 'ausbildung'], ['education', 'ausbildung'], ['family', 'basis'], ['personal', 'basis'],
    ['finance', 'basis'], ['housing', 'basis'],
  ])('Kategorie %s → %s', (k, bereich) => expect(kategorieBereich(k)).toBe(bereich));
});

describe('Merkliste zeigt Tag, Wiederholung und erledigt am', () => {
  const t = createT({ de }, 'de', 'sie');
  const palette = new Proxy({}, { get: () => '#888888' });
  const render = async () => {
    const { MerklisteView } = await import('../MerklisteView.jsx');
    return renderToStaticMarkup(React.createElement(VorlaeufigContext.Provider, { value: false },
      React.createElement(MerklisteView, { palette, t, onNavigate: () => {} })));
  };
  it('ohne Tag: «Tag wählen»; mit Verknüpfung: Unterzeile mit ›', async () => {
    store.or5_merkliste = JSON.stringify([{ id: 'm1', text: 'Säule 3a eröffnen', link: 'vorsorge', done: false }]);
    const html = await render();
    expect(html).toContain('Tag wählen');
    expect(html).toContain(t('nav.vorsorge') + ' ›');
  });
  it('jährlich und erledigt am', async () => {
    store.or5_merkliste = JSON.stringify([
      { id: 'm1', text: 'IPV prüfen', link: 'premium', done: false, tag: '2027-01-15', wiederholung: 'jaehrlich' },
      { id: 'm2', text: 'Erledigt', link: null, done: true, erledigtAm: '2026-10-20' },
    ]);
    const html = await render();
    expect(html).toContain('Jährlich');
    expect(html).toContain('erledigt am');
  });
});
