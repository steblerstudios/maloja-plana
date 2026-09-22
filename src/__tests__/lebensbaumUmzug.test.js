// Der Lebensbaum steht seit 21.09.2026 auf der Finanz-Übersicht, nicht mehr auf
// dem Dashboard (Entscheid Stebler Studios, 20.09.). Beide Seiten teilen sich die
// Ableitung von Kapitel-Zustand und Ast-Farbe — genau dort kann sie auseinander-
// laufen, wenn jemand die Logik an einem Ort „schnell anpasst".
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { kapitelStatus, astFarben, bereichsFruechte } from '../utils/lebensbereichFruechte.js';

const SRC = path.resolve(__dirname, '..');

// Ein Kapitel mit zwei Pflicht- und zwei Kann-Feldern.
const kapitel = (key) => ({
  key,
  title: key,
  fields: [
    { k: 'a', mvo: true }, { k: 'b', mvo: true },
    { k: 'c' }, { k: 'd' },
  ],
});

describe('kapitelStatus: vier Stufen, jede positiv lesbar', () => {
  const ch = kapitel('finanzen');

  it('ohne eine einzige Angabe: leer', () => {
    expect(kapitelStatus(ch, {})).toBe('leer');
    expect(kapitelStatus(ch, undefined)).toBe('leer');
  });

  it('angefangen, aber die Grundordnung steht noch nicht: begonnen', () => {
    expect(kapitelStatus(ch, { a: 'x' })).toBe('begonnen');
    expect(kapitelStatus(ch, { c: 'x', d: 'y' })).toBe('begonnen');
  });

  it('beide Pflichtfelder da, aber unter 75 Prozent: grundordnung', () => {
    expect(kapitelStatus(ch, { a: 'x', b: 'y' })).toBe('grundordnung');
  });

  it('Pflichtfelder da UND mindestens 75 Prozent: vertieft', () => {
    expect(kapitelStatus(ch, { a: 'x', b: 'y', c: 'z' })).toBe('vertieft');
  });

  it('«trifft nicht zu» zählt als erledigt (E17), nicht als Lücke', () => {
    // NA_FELD führt die als «trifft nicht zu» markierten Schlüssel.
    expect(kapitelStatus(ch, { a: 'x', _na: ['b'] })).toBe('grundordnung');
  });
});

describe('astFarben: jedes Kapitel bekommt eine Farbe', () => {
  const palette = { sage: '#1', gold: '#2', sky: '#3', sand: '#4', rose: '#5' };
  const chapters = ['basis', 'wohnen', 'finanzen', 'versicherungen', 'ausbildung', 'behoerden', 'notfall'].map(kapitel);

  it('liefert für jedes Kapitel einen Wert, hell wie dunkel', () => {
    for (const dunkel of [false, true]) {
      const f = astFarben(chapters, palette, dunkel);
      expect(Object.keys(f)).toHaveLength(chapters.length);
      for (const ch of chapters) expect(f[ch.key]).toBeTruthy();
    }
  });

  it('hell und dunkel sind nicht dieselbe Karte', () => {
    // Sonst wäre der Dunkelmodus nur zufällig lesbar.
    const hell = astFarben(chapters, palette, false);
    const dunkel = astFarben(chapters, palette, true);
    expect(JSON.stringify(hell)).not.toBe(JSON.stringify(dunkel));
  });

  it('ein unbekanntes Kapitel fällt auf eine Palette-Farbe zurück, nicht auf undefined', () => {
    const f = astFarben([kapitel('gibtsnicht')], palette, false);
    expect(f.gibtsnicht).toBe(palette.sage);
  });
});

describe('bereichsFruechte: eine Frucht je Kapitel mit Lebensbereich', () => {
  const palette = { sage: '#1', gold: '#2', sky: '#3', sand: '#4', rose: '#5' };
  const chapters = ['basis', 'finanzen', 'notfall'].map(kapitel);
  const farbe = astFarben(chapters, palette, false);

  it('leeres Profil: Früchte da, alle auf Stufe 1 — kein Defizit-Signal', () => {
    const f = bereichsFruechte(chapters, {}, farbe);
    expect(f.length).toBeGreaterThan(0);
    for (const x of f) expect(x.stage).toBe(1);
  });

  it('gefülltes Kapitel reift höher als ein leeres', () => {
    const data = { finanzen: { a: 'x', b: 'y', c: 'z' } };
    const f = bereichsFruechte(chapters, data, farbe);
    const fin = f.find((x) => x.key === 'finanzen');
    const basis = f.find((x) => x.key === 'basis');
    expect(fin.stage).toBeGreaterThan(basis.stage);
  });

  it('jede Frucht trägt Farbe, Index und Reifegrad', () => {
    const f = bereichsFruechte(chapters, {}, farbe);
    for (const x of f) {
      expect(x.color).toBeTruthy();
      expect(typeof x.idx).toBe('number');
      expect(x.stage).toBeGreaterThanOrEqual(1);
      expect(x.stage).toBeLessThanOrEqual(4);
    }
  });

  it('ohne Kapitel gibt es keine Früchte (und keinen Absturz)', () => {
    expect(bereichsFruechte([], {}, {})).toEqual([]);
  });
});

describe('der Umzug selbst', () => {
  it('Dashboard rendert den Baum nicht mehr', () => {
    const s = fs.readFileSync(path.join(SRC, 'Dashboard.jsx'), 'utf8');
    expect(s).not.toMatch(/createElement\(\s*DatenWirken/);
    expect(s).not.toMatch(/createElement\(\s*Lebensbaum/);
  });

  it('Dashboard schleppt die Baum-Abhängigkeiten nicht mehr mit', () => {
    // Das ist der Grund, warum der Umzug die Startdatei entlastet: Baum3D und
    // FruchtStufe hängen jetzt am nachgeladenen Chunk der Finanz-Übersicht.
    const s = fs.readFileSync(path.join(SRC, 'Dashboard.jsx'), 'utf8');
    for (const weg of ['Baum3D.jsx', 'FruchtStufe.jsx', 'baumAnsicht.js', 'anspruchSignale.js']) {
      expect(s, weg).not.toContain("from './" + weg.replace('.js', '') + "'");
      expect(s, weg).not.toContain(weg);
    }
  });

  it('die Finanz-Übersicht zeigt ihn, und zwar VOR den Zahlen', () => {
    const s = fs.readFileSync(path.join(SRC, 'FinanzUebersicht.jsx'), 'utf8');
    expect(s).toContain("import { Lebensbaum }");
    const baum = s.indexOf('createElement(Lebensbaum');
    const titel = s.indexOf('createElement(PageTitle');
    expect(baum).toBeGreaterThan(-1);
    expect(baum).toBeLessThan(titel);
  });

  it('die Finanz-Übersicht ruft KEIN useT — mehrere Tests rendern sie ohne Provider', () => {
    const s = fs.readFileSync(path.join(SRC, 'FinanzUebersicht.jsx'), 'utf8');
    // Kommentarzeilen raus — der Hinweis DARF useT() nennen, der Code nicht.
    const code = s.split('\n').filter((z) => !z.trim().startsWith('//')).join('\n');
    expect(code).not.toMatch(/\buseT\(\)/);
    expect(code).not.toMatch(/from '\.\/i18n\/index\.js'/);
    expect(code).toMatch(/lang = 'de'/);
  });
});
