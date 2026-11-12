import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// ─────────────────────────────────────────────────────────────
// Gruppe E, Zweig 2 · Gestaltung des Rahmens A–D (Entscheid Stebler Studios 12.11.2026: «Jetzt bauen»;
// Befund docs/design/gruppe-e-website.html). Geprüft an der gebauten Ausgabe in public/.
// A 404 und Wartung aus dem Generator, mit Kopf, Marke, Dunkelmodus, Knopf im Gold.
// B eine Schriftordnung: Titel in Hanken Grotesk, Grössen nur von der Skala (Brand Book §7a).
// C ein Kopf (Bildmarke), ein Gold, ein Leise-Ton wie die Startseite.
// D Knopf 10 px, Karte 12 px, Abschnitt 48 px.
// ─────────────────────────────────────────────────────────────
const lies = (...p) => fs.readFileSync(path.resolve(process.cwd(), 'public', ...p), 'utf8');
const stilVon = (html) => (html.match(/<style>([\s\S]*?)<\/style>/) || ['', ''])[1].replace(/\/\*[\s\S]*?\*\//g, '');
const SKALA = new Set([13, 15, 16, 19, 23, 28, 36]);

describe('A · 404 und Wartung aus dem Rahmen', () => {
  for (const name of ['404.html', 'wartung.html']) {
    const html = lies(name);
    it(`${name}: erzeugt, mit Marke, Dunkelmodus und Knopf — keine Karte mehr`, () => {
      expect(html).toContain('ERZEUGT — nicht von Hand bearbeiten');
      expect(html).toMatch(/<a class="marke" href="\/"><svg viewBox="0 0 500 540"/);
      expect(stilVon(html)).toMatch(/prefers-color-scheme: dark/);
      expect(html).toMatch(/<a class="knopf" href="[^"]*">/);
      expect(html).not.toMatch(/class="card"|#F8F7F5/);
    });
  }
  it('Wartung lädt neu, 404 führt zur Startseite', () => {
    expect(lies('wartung.html')).toContain('<a class="knopf" href="">Seite neu laden</a>');
    expect(lies('404.html')).toContain('<a class="knopf" href="/">Zur Startseite</a>');
  });
});

describe('B · eine Schriftordnung', () => {
  for (const name of [['rechtliches', 'index.html'], ['404.html']]) {
    const stil = stilVon(lies(...name));
    it(`${name.join('/')}: Titel in Hanken Grotesk`, () => {
      expect(stil).toContain("url('/fonts/hanken-grotesk-latin-600-normal.woff2')");
      expect(stil).toMatch(/h1, h2, h3\{ font-family:'Hanken Grotesk'/);
    });
    it(`${name.join('/')}: jede Schriftgrösse liegt auf der Skala 13 · 15 · 16 · 19 · 23 · 28 · 36`, () => {
      const fremd = [...stil.matchAll(/font-size:\s*(\d+)px/g)].map((m) => Number(m[1])).filter((g) => !SKALA.has(g));
      expect(fremd).toEqual([]);
    });
  }
  it('h1 36 / am Handy 28, h2 23', () => {
    const stil = stilVon(lies('rechtliches', 'index.html'));
    expect(stil).toMatch(/h1\{ font-size:36px/);
    expect(stil).toMatch(/h2\{ font-size:23px/);
    expect(stil).toMatch(/@media \(max-width:600px\)\{ h1\{ font-size:28px \}/);
  });
});

describe('C · ein Kopf, ein Gold, ein Leise-Ton (wie website/index.html)', () => {
  const stil = stilVon(lies('rechtliches', 'index.html'));
  const start = fs.readFileSync(path.resolve(process.cwd(), 'website', 'index.html'), 'utf8');
  it('Leise-Ton und Gold sind dieselben Werte wie auf der Startseite', () => {
    for (const v of ['--leise:#575B61', '--sand:#C4A06A', '--sand-tief:#7A5F30']) {
      expect(stil, v).toContain(v);
      expect(start, v).toContain(v);
    }
    expect(stil).not.toMatch(/--gold|#C4A870|#6A6E74/);
  });
  it('Links im Text in --sand-tief', () => {
    expect(stil).toMatch(/(^|\s)a\{ color:var\(--sand-tief\)/);
  });
  it('die Bildmarke im Kopf ist dieselbe Zeichnung wie auf der Startseite', () => {
    const marke = (s) => s.match(/<a class="marke"[^>]*>(<svg[\s\S]*?<\/svg>)/)[1];
    expect(marke(lies('rechtliches', 'index.html'))).toBe(marke(start));
  });
});

describe('D · Ecken und Luft nach Brand Book §7a', () => {
  const stil = stilVon(lies('rechtliches', 'index.html'));
  it('Knopf 10 px und 44 px hoch, Karte 12 px, Abschnitt 48 px', () => {
    expect(stil).toMatch(/\.knopf\{[^}]*min-height:44px[^}]*border-radius:10px/);
    expect(stil).toMatch(/\.karte\{[^}]*border-radius:12px/);
    expect(stil).toMatch(/h2\{[^}]*margin:48px 0 12px/);
  });
});
