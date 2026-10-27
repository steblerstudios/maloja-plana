import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { VorlaeufigContext } from '../hooks/vorlaeufigContext.js';
import { parseHash, UMLEITUNGEN, VALID_VIEWS } from '../utils/hashRouter.js';
import { MENUE_WERKZEUGE, WERKZEUGE } from '../data/werkzeugRegister.js';
import { SEARCH_VIEWS } from '../config/ansichtenRegister.js';

// F7-L10 (Stebler Studios 27.10.2026, docs/entscheide/seiten-buendeln.md §2 H): die Merkliste ist keine
// eigene Seite mehr, sondern ein Reiter in «Was ansteht». #/merkliste bleibt und öffnet den Reiter;
// Menü, Rucksack, ＋-Fächer und Suche führen über dieselbe Umleitung dorthin.

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
const palette = new Proxy({}, { get: () => '#888888' });
const lies = (f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const render = async (props = {}, vorlaeufig = false) => {
  const { CalendarReminders } = await import('../CalendarReminders.jsx');
  return renderToStaticMarkup(React.createElement(VorlaeufigContext.Provider, { value: vorlaeufig },
    React.createElement(CalendarReminders, { palette, t, data: {}, onNavigate: () => {}, ...props })));
};
const tab = (html, k) => (html.match(new RegExp('<button[^>]*id="mp-reiter-' + k + '"[^>]*>')) || [''])[0];

describe('#/merkliste öffnet den Reiter in «Was ansteht»', () => {
  it('der Router löst den alten Link auf — mit Reiter, ohne Sprungmarke', () => {
    expect(parseHash('#/merkliste')).toEqual({ view: 'calendar', chapterIndex: null, anker: null, wahl: 'merkliste' });
    expect(VALID_VIEWS.has('merkliste')).toBe(true);
  });

  it('Menü, Rucksack und Suche behalten «Merkliste» — der Eintrag führt über die Umleitung', () => {
    expect(MENUE_WERKZEUGE.map((w) => w.view)).toContain('merkliste');
    expect(WERKZEUGE.find((w) => w.view === 'merkliste').nav).toBe('nav.merkliste');
    expect(SEARCH_VIEWS.some((w) => w.view === 'merkliste')).toBe(true);
    expect(UMLEITUNGEN.merkliste.view).toBe('calendar');
  });

  it('main.jsx: keine eigene Seite, der Reiter kommt aus `wahl`', () => {
    const main = lies('main.jsx');
    expect(main).not.toMatch(/view === 'merkliste' && React\.createElement/);
    expect(main).not.toMatch(/import\('\.\/MerklisteView\.jsx'\)/);
    expect(main).toMatch(/React\.createElement\(CalendarReminders, \{[^\n]*reiter: wahl, onReiter: setWahl/);
    expect(main).toContain('handleNavigate(umleitung.view, umleitung.chapterIndex, umleitung.wahl || extra)');
    expect(main).toContain('setWahl(parsed.wahl)');
    // Das ＋-Fächer ruft weiter 'merkliste' auf — über handleNavigate, also die Umleitung.
    expect(main).toMatch(/key: 'merkliste', label: t\('nav\.merkliste'\)/);
  });
});

describe('die Reiterleiste', () => {
  it('ohne Wahl: «Was ansteht» ist offen, die Seite wie bisher', async () => {
    const html = await render();
    expect(html).toContain('role="tablist"');
    expect(tab(html, 'ansicht')).toContain('aria-selected="true"');
    expect(tab(html, 'ansicht')).toContain('tabindex="0"');
    expect(tab(html, 'merkliste')).toContain('aria-selected="false"');
    expect(tab(html, 'merkliste')).toContain('tabindex="-1"');
    expect(html).toContain('id="mp-reiter-ansicht-teil"');
    expect(html).toContain('Ganzer Monat');
    expect(html).not.toContain(t('merkliste.placeholder'));
  });

  it('mit Wahl «merkliste»: der Reiter Merkliste ist offen, mit Eingabe und Liste', async () => {
    store.or5_merkliste = JSON.stringify([{ id: 'm1', text: 'Säule 3a eröffnen', link: 'vorsorge', done: false }]);
    const html = await render({ reiter: 'merkliste', onReiter: () => {} });
    expect(tab(html, 'merkliste')).toContain('aria-selected="true"');
    expect(tab(html, 'merkliste')).toContain('aria-controls="mp-reiter-merkliste-teil"');
    expect(html).toMatch(/role="tabpanel" id="mp-reiter-merkliste-teil" aria-labelledby="mp-reiter-merkliste"/);
    expect(html).toContain('placeholder="' + t('merkliste.placeholder') + '"');
    expect(html).toContain('Säule 3a eröffnen');
    // Der Seitenkopf bleibt: ein Titel «Was ansteht», die Merkliste trägt keinen eigenen.
    expect((html.match(/<h2/g) || []).length).toBe(1);
    expect(html).not.toContain('Ganzer Monat');
  });

  it('vorläufig: auch im Reiter keine echten Punkte', async () => {
    store.or5_merkliste = JSON.stringify([{ id: 'm1', text: 'Echter Merkpunkt', link: null, done: false }]);
    expect(await render({ reiter: 'merkliste', onReiter: () => {} }, true)).not.toContain('Echter Merkpunkt');
  });

  it('Pfeiltasten: links/rechts rundum, Pos1/Ende, andere Tasten nichts', async () => {
    const { reiterNachTaste } = await import('../CalendarReminders.jsx');
    expect(reiterNachTaste('ansicht', 'ArrowRight')).toBe('merkliste');
    expect(reiterNachTaste('merkliste', 'ArrowRight')).toBe('ansicht');
    expect(reiterNachTaste('ansicht', 'ArrowLeft')).toBe('merkliste');
    expect(reiterNachTaste('merkliste', 'Home')).toBe('ansicht');
    expect(reiterNachTaste('ansicht', 'End')).toBe('merkliste');
    expect(reiterNachTaste('ansicht', 'Enter')).toBe(null);
  });

  it('die Leiste hört auf die Tasten und setzt den Fokus mit', () => {
    const src = lies('CalendarReminders.jsx');
    expect(src).toMatch(/role: 'tablist', 'aria-label': t\('nav\.wasAnsteht'\), onKeyDown: reiterTaste/);
    expect(src).toMatch(/document\.getElementById\('mp-reiter-' \+ neu\)/);
  });

  it('eine Liste für beide Reiter: die Merkliste bekommt die Punkte des Kalenders', () => {
    expect(lies('CalendarReminders.jsx')).toContain('punkte: todos, aendere: aendereTodos');
  });
});
