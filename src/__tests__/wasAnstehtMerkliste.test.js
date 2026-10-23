import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { VorlaeufigContext } from '../hooks/vorlaeufigContext.js';
import { inDays } from '../utils/helpers.js';

// Fassung 5 (Stebler Studios, 23.10.2026): «Was ansteht» zeigt Merkpunkte mit Tag als Aufgabe,
// Merkpunkte ohne Tag im Fach «Noch ohne Tag», Tagesleiste + «Ganzer Monat», Export am Ende.

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
const render = async (vorlaeufig = false) => {
  const { CalendarReminders } = await import('../CalendarReminders.jsx');
  return renderToStaticMarkup(React.createElement(VorlaeufigContext.Provider, { value: vorlaeufig },
    React.createElement(CalendarReminders, { palette, t, data: {}, onNavigate: () => {}, isMobile: false })));
};
const SRC = path.join(__dirname, '..');

describe('Was ansteht', () => {
  it('Titel, Tagesleiste und «Ganzer Monat»', async () => {
    const html = await render();
    expect(html).toContain('Was ansteht');
    expect(html).toContain('Ganzer Monat');
    expect(html).toContain('<details');
  });

  it('Merkpunkt mit Tag erscheint als Aufgabe aus der Merkliste', async () => {
    store.or5_merkliste = JSON.stringify([{ id: 'm1', text: 'Säule 3a eröffnen', link: 'vorsorge', done: false, tag: inDays(5) }]);
    const html = await render();
    expect(html).toContain('Säule 3a eröffnen');
    expect(html).toContain('Aufgabe');
    expect(html).toContain('aus der Merkliste');
    expect(html).toContain('Fällig in 5 Tagen');
  });

  it('Merkpunkt ohne Tag wartet im Fach «Noch ohne Tag»', async () => {
    store.or5_merkliste = JSON.stringify([{ id: 'm1', text: 'Lohnausweis ablegen', link: 'tresor', done: false }]);
    const html = await render();
    expect(html).toContain('Noch ohne Tag');
    expect(html).toContain('Auf einen Tag legen');
  });

  it('ohne offene Merkpunkte kein Fach', async () => {
    store.or5_merkliste = JSON.stringify([{ id: 'm1', text: 'Fertig', link: null, done: true }]);
    expect(await render()).not.toContain('Noch ohne Tag');
  });

  it('Zahl bei «Bevorstehend» zählt Erinnerungen und Aufgaben', async () => {
    store.or5_reminders = JSON.stringify([{ id: '1', title: 'Zahnarzt', dueDate: inDays(3), category: 'health', recurrence: 'once', notes: '', done: false, completedDate: null }]);
    store.or5_merkliste = JSON.stringify([{ id: 'm1', text: 'IPV prüfen', link: 'premium', done: false, tag: inDays(9), wiederholung: 'jaehrlich' }]);
    const html = await render();
    expect(html).toContain('2 Bevorstehend');
    expect(html).toContain('Jährlich');
  });

  it('vorläufig: die echten Merkpunkte bleiben unsichtbar', async () => {
    store.or5_merkliste = JSON.stringify([{ id: 'm1', text: 'Echter Merkpunkt', link: null, done: false, tag: inDays(2) }]);
    expect(await render(true)).not.toContain('Echter Merkpunkt');
  });

  it('Export (.ics) steht am Ende, nach der Liste', async () => {
    store.or5_reminders = JSON.stringify([{ id: '1', title: 'Zahnarzt', dueDate: inDays(3), category: 'health', recurrence: 'once', notes: '', done: false, completedDate: null }]);
    const html = await render();
    expect(html.indexOf('Kalender exportieren')).toBeGreaterThan(html.indexOf('Zahnarzt</span>'));
  });

  it('Formular und Vorlagen tragen die Art «Termin»; Abhaken teilt die Merkliste-Umformung', () => {
    const s = fs.readFileSync(path.join(SRC, 'CalendarReminders.jsx'), 'utf8');
    expect(s.match(/^\s+art: 'termin',$/gm)).toHaveLength(2);
    expect(s).toMatch(/merkpunktUmschalten\(prev, id, today\)/);
    expect(s).toMatch(/merkpunktTagSetzen\(prev, verteilen, iso\)/);
  });
});
