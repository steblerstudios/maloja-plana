// Bugsuche 09.11.2026, Fund 2 · Merkliste und Kalender übernehmen Änderungen aus einem
// anderen Tab, statt sie mit der eigenen, beim Öffnen geladenen Liste zu überschreiben.
//
// Nachstellen (vor dem Fix): Tab A zeigt die Merkliste. Tab B legt über «merken» einen
// Punkt an. In Tab A wird ein Punkt abgehakt → saveTodos(eigene) schreibt die alte Liste,
// der Punkt aus Tab B ist weg. Beim Kalender gleich (or5_reminders).
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fremdeListeHandler } from '../hooks/useFremdeListe.js';

const lies = (f) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

describe('fremdeListeHandler', () => {
  it('lädt neu, wenn ein anderer Tab genau diese Liste ändert', () => {
    let stand = ['alt'];
    const h = fremdeListeHandler('or5_merkliste', () => ['alt', 'aus Tab B'], (v) => { stand = v; });
    h({ key: 'or5_merkliste' });
    expect(stand).toEqual(['alt', 'aus Tab B']);
  });

  it('lädt neu nach localStorage.clear() in einem anderen Tab (key null)', () => {
    let stand = ['alt'];
    fremdeListeHandler('or5_reminders', () => [], (v) => { stand = v; })({ key: null });
    expect(stand).toEqual([]);
  });

  it('übergeht Änderungen an anderen Schlüsseln', () => {
    let gesetzt = false;
    fremdeListeHandler('or5_merkliste', () => [], () => { gesetzt = true; })({ key: 'or5_theme' });
    expect(gesetzt).toBe(false);
  });
});

describe('die Listen hängen sich an', () => {
  it('MerklisteView übernimmt or5_merkliste aus anderen Tabs, nicht im Beispiel', () => {
    const src = lies('MerklisteView.jsx');
    expect(src).toMatch(/useFremdeListe\(\s*'or5_merkliste'\s*,\s*loadTodos\s*,\s*setEigene\s*,\s*!punkte && !vorlaeufig\s*\)/);
  });

  it('CalendarReminders übernimmt or5_reminders und or5_merkliste, nicht im Beispiel', () => {
    const src = lies('CalendarReminders.jsx');
    expect(src).toMatch(/useFremdeListe\(\s*'or5_reminders'\s*,\s*loadReminders\s*,\s*setReminders\s*,\s*!vorlaeufig\s*\)/);
    expect(src).toMatch(/useFremdeListe\(\s*'or5_merkliste'\s*,\s*loadTodos\s*,\s*setTodos\s*,\s*!vorlaeufig\s*\)/);
  });
});
