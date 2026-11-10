import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { KARTEN_FRUCHT, FRUCHT_STUFEN } from '../../scripts/seiten/kantonsatlas.mjs';

// Kantonsatlas: Jede Karte trägt die Frucht ihres Lebensbereichs (Brand Book, farb-und-daten-system.md
// Regel 3) in vier Stufen. Volle 3:1 zwischen Nachbarstufen gehen mit vier Stufen nicht
// (3 × 3 × 3 = 27:1, mehr als Weiss zu Schwarz); die Werte stehen ohnehin in Titel, Tabelle und Legende.
// Was gilt: Kein Nachbarpaar fällt unter 1,6:1, und die Abstände sind ungefähr gleich gross.
// Befund 09.11.2026: hell lagen Stufe 1 und 2 bei 1,31:1 und waren kaum zu unterscheiden.
const seite = fs.readFileSync(path.resolve(process.cwd(), 'public', 'kantonsatlas', 'index.html'), 'utf8');

const kanal = (v) => { const x = v / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
const leucht = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => kanal(parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const kontrast = (a, b) => { const [h, d] = [leucht(a), leucht(b)].sort((x, y) => y - x); return (h + 0.05) / (d + 0.05); };

const pruefeStufen = (s) => {
  const abst = [0, 1, 2].map((i) => kontrast(s[i], s[i + 1]));
  for (const a of abst) expect(a).toBeGreaterThanOrEqual(1.6);
  expect(Math.max(...abst) / Math.min(...abst)).toBeLessThan(1.25);
};

describe('Kantonsatlas: Stufen gleichmässig unterscheidbar', () => {
  for (const [frucht, { hell, dunkel }] of Object.entries(FRUCHT_STUFEN)) {
    it(`${frucht}: hell und dunkel, jedes Nachbarpaar mindestens 1,6:1, Abstände ausgeglichen`, () => {
      pruefeStufen(hell);
      pruefeStufen(dunkel);
      expect(leucht(hell[0])).toBeGreaterThan(leucht(hell[3]));     // hell: tief = hell
      expect(leucht(dunkel[0])).toBeLessThan(leucht(dunkel[3]));    // dunkel: tief = dunkel
    });
  }

  it('gebaute Seite: alle Stufen-Sätze im CSS halten dieselbe Regel', () => {
    const saetze = [...seite.matchAll(/--k1:(#[0-9A-F]{6}); --k2:(#[0-9A-F]{6}); --k3:(#[0-9A-F]{6}); --k4:(#[0-9A-F]{6})/g)].map((m) => m.slice(1, 5));
    expect(saetze.length).toBe(2 + 2 * Object.keys(FRUCHT_STUFEN).length); // :root + je Frucht, hell und dunkel
    for (const s of saetze) pruefeStufen(s);
  });
});

describe('Kantonsatlas: Farbe je Karte nach dem Brand Book', () => {
  it('jede Karte der Seite hat eine Frucht mit Stufen', () => {
    const karten = [...seite.matchAll(/<figure class="abb atlas" id="karte-[a-z]+"[^>]*>[\s\S]*?<div class="abb-karte f-([a-z]+)">/g)].map((m) => m[1]);
    expect(karten.length).toBe(Object.keys(KARTEN_FRUCHT).length);
    for (const f of karten) expect(FRUCHT_STUFEN[f]).toBeTruthy();
  });

  it('nie Aprikose (= Gold, «finanziell enger») oder Kirsche (= Rosé, harte Schwelle) als Kartenfarbe', () => {
    for (const f of [...Object.values(KARTEN_FRUCHT), ...Object.keys(FRUCHT_STUFEN)]) {
      expect(['aprikose', 'kirsche']).not.toContain(f);
    }
  });
});
