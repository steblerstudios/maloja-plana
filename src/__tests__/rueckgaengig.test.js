// «Entfernt · Rückgängig» an allen Lösch-Listen (10.11.2026). Bis dahin hatte nur die Merkliste einen
// Weg zurück; Erinnerungen, KK-Belege, 3a-Einzahlungen, Stellen, Sprachen und Einzelbeträge waren
// nach einem Tipp aufs ✕ endgültig weg. Gefragt wird bewusst nie (keineBrowserDialoge.test.js).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Ohne DOM-Testumgebung: ein kleiner Ersatz für die drei Hooks, damit useRueckgaengig wie in einer
// Komponente läuft. Jeder `neu()`-Aufruf ist ein neues Einhängen; `render()` ist ein erneutes Zeichnen.
const zustand = { slots: [], i: 0, effekte: [] };
vi.mock('react', async (orig) => {
  const echt = await orig();
  const useState = (start) => {
    const k = zustand.i++;
    if (!(k in zustand.slots)) zustand.slots[k] = typeof start === 'function' ? start() : start;
    return [zustand.slots[k], (v) => { zustand.slots[k] = typeof v === 'function' ? v(zustand.slots[k]) : v; }];
  };
  const useRef = (start) => { const [r] = useState(() => ({ current: start })); return r; };
  const useEffect = (f) => { zustand.effekte.push(f); };
  return { ...echt, default: { ...echt.default, useState, useRef, useEffect }, useState, useRef, useEffect };
});

const { useRueckgaengig, wiederEinsetzen, RUECKGAENGIG_MS } = await import('../hooks/useRueckgaengig.js');
const { RueckgaengigMeldung } = await import('../components/RueckgaengigMeldung.jsx');

const neu = () => { zustand.slots = []; zustand.effekte = []; };
const render = () => { zustand.i = 0; return useRueckgaengig(); };

describe('wiederEinsetzen', () => {
  it('legt an dieselbe Stelle zurück', () => {
    expect(wiederEinsetzen(['a', 'c'], 'b', 1)).toEqual(['a', 'b', 'c']);
    expect(wiederEinsetzen(['b', 'c'], 'a', 0)).toEqual(['a', 'b', 'c']);
  });
  it('ist die Liste inzwischen kürzer, ans Ende statt in eine Lücke', () => {
    expect(wiederEinsetzen(['a'], 'z', 5)).toEqual(['a', 'z']);
  });
  it('leere oder fehlende Liste', () => {
    expect(wiederEinsetzen([], 'a', 3)).toEqual(['a']);
    expect(wiederEinsetzen(undefined, 'a', 0)).toEqual(['a']);
  });
  it('ändert die übergebene Liste nicht', () => {
    const l = ['a', 'c'];
    wiederEinsetzen(l, 'b', 1);
    expect(l).toEqual(['a', 'c']);
  });
});

describe('useRueckgaengig', () => {
  beforeEach(() => { vi.useFakeTimers(); neu(); });
  afterEach(() => vi.useRealTimers());

  it('merkt den Eintrag, Rückgängig gibt { item, index } zurück und leert die Meldung', () => {
    render().merke({ item: { id: 1 }, index: 2, text: 'Zahnarzt' });
    expect(render().entfernt).toMatchObject({ index: 2, text: 'Zahnarzt' });
    const zurueck = vi.fn();
    render().rueckgaengig(zurueck);
    expect(zurueck).toHaveBeenCalledWith({ item: { id: 1 }, index: 2, text: 'Zahnarzt' });
    expect(render().entfernt).toBe(null);
  });

  it('nach rund fünf Sekunden ist die Meldung weg — und Rückgängig tut nichts mehr', () => {
    render().merke({ item: 'x', index: 0, text: 'x' });
    vi.advanceTimersByTime(RUECKGAENGIG_MS - 1);
    expect(render().entfernt).not.toBe(null);
    vi.advanceTimersByTime(1);
    expect(render().entfernt).toBe(null);
    const zurueck = vi.fn();
    render().rueckgaengig(zurueck);
    expect(zurueck).not.toHaveBeenCalled();
  });

  it('ein zweites Löschen ersetzt das erste und startet die fünf Sekunden neu', () => {
    render().merke({ item: 'a', index: 0, text: 'a' });
    vi.advanceTimersByTime(4000);
    render().merke({ item: 'b', index: 1, text: 'b' });
    vi.advanceTimersByTime(4000);
    expect(render().entfernt).toMatchObject({ item: 'b' });
  });

  it('der Wecker eines zurückgeholten Eintrags löscht keine spätere Meldung', () => {
    render().merke({ item: 'a', index: 0, text: 'a' });
    render().rueckgaengig(() => {});
    vi.advanceTimersByTime(2000);
    render().merke({ item: 'b', index: 0, text: 'b' });
    vi.advanceTimersByTime(3500);
    expect(render().entfernt).toMatchObject({ item: 'b' });
  });

  it('beim Aushängen bleibt kein Wecker stehen', () => {
    render().merke({ item: 'a', index: 0, text: 'a' });
    zustand.effekte.forEach(f => { const weg = f(); if (typeof weg === 'function') weg(); });
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('RueckgaengigMeldung', () => {
  const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
  const t = (k) => k;
  const zeig = (p) => renderToStaticMarkup(React.createElement(RueckgaengigMeldung, { palette, t, onRueckgaengig: () => {}, ...p }));

  it('ohne Eintrag: nur die leere Live-Region (damit die Ansage beim Erscheinen klappt)', () => {
    expect(zeig({ entfernt: null })).toBe('<div role="status" aria-live="polite"></div>');
  });
  it('mit Eintrag: Name und Knopf, Knopf mit eigener Textfarbe (Dunkelmodus)', () => {
    const html = zeig({ entfernt: { item: {}, index: 0, text: 'Zahnarzt' } });
    expect(html).toContain('common.entfernt · Zahnarzt');
    expect(html).toMatch(/<button type="button" style="[^"]*color:[^"]*">common.rueckgaengig<\/button>/);
  });
  it('ansagen: false — keine zweite Live-Region in einer, die schon ansagt', () => {
    expect(zeig({ entfernt: null, ansagen: false })).toBe('');
    expect(zeig({ entfernt: { text: 'x' }, ansagen: false })).not.toContain('role="status"');
  });
});

// Wächter: jede Liste, die auf einen Tipp löscht, führt den Weg zurück. Eine Erlaubnisliste statt
// Suche nach Mustern — wer eine neue Lösch-Liste baut, trägt sie hier ein.
describe('alle Lösch-Listen haben Rückgängig', () => {
  const LISTEN = [
    'MerklisteView.jsx', 'CalendarReminders.jsx', 'KVGLeistungen.jsx', 'Saeule3aTracker.jsx',
    'JobManager.jsx', 'LanguageManager.jsx', 'ItemizedAmount.jsx',
  ];
  for (const datei of LISTEN) {
    it(datei, () => {
      const src = fs.readFileSync(path.join(__dirname, '..', datei), 'utf8');
      expect(src).toMatch(/useRueckgaengig\(\)/);
      expect(src).toMatch(/\bmerke\(/);
      expect(src).toMatch(/React\.createElement\(RueckgaengigMeldung,/);
    });
  }
});
