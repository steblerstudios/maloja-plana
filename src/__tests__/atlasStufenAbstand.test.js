import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Kantonsatlas: vier Stufen einer Farbe. Volle 3:1 zwischen Nachbarstufen gehen mit vier Stufen nicht
// (3 × 3 × 3 = 27:1, mehr als Weiss zu Schwarz); die Werte stehen ohnehin in Titel, Tabelle und Legende.
// Was gilt: Kein Nachbarpaar fällt unter 1,6:1, und die Abstände sind ungefähr gleich gross.
// Befund 09.11.2026: hell lagen Stufe 1 und 2 bei 1,31:1 und waren kaum zu unterscheiden.
const quelle = fs.readFileSync(path.resolve(process.cwd(), 'scripts', 'seiten', 'kantonsatlas.mjs'), 'utf8');
const seite = fs.readFileSync(path.resolve(process.cwd(), 'public', 'kantonsatlas', 'index.html'), 'utf8');

const kanal = (v) => { const x = v / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
const leucht = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => kanal(parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const kontrast = (a, b) => { const [h, d] = [leucht(a), leucht(b)].sort((x, y) => y - x); return (h + 0.05) / (d + 0.05); };

const stufen = (text) => {
  const re = /--k1:(#[0-9A-F]{6}); --k2:(#[0-9A-F]{6}); --k3:(#[0-9A-F]{6}); --k4:(#[0-9A-F]{6})/g;
  return [...text.matchAll(re)].map((m) => m.slice(1, 5));
};

describe('Kantonsatlas: Stufen gleichmässig unterscheidbar', () => {
  for (const [name, text] of [['Quelle', quelle], ['gebaute Seite', seite]]) {
    it(`${name}: beide Modi, jedes Nachbarpaar mindestens 1,6:1, Abstände ausgeglichen`, () => {
      const modi = stufen(text);
      expect(modi.length).toBe(2); // hell und dunkel
      for (const s of modi) {
        const abst = [0, 1, 2].map((i) => kontrast(s[i], s[i + 1]));
        for (const a of abst) expect(a).toBeGreaterThanOrEqual(1.6);
        expect(Math.max(...abst) / Math.min(...abst)).toBeLessThan(1.25);
      }
    });
  }
});
