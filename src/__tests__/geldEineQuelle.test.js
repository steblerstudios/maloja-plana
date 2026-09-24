// Zahlen und Franken: eine Quelle (utils/geld.js), fest ’ statt Laufzeit-Locale.
//
// Bis 24.09.2026: rund zwanzig Stellen mit toLocaleString('de-CH') — Chromium liefert
// dort den geraden Apostroph ', chf() und drei Kopien den typografischen ’. Auf einer Seite
// standen zwei Trennzeichen. Und wo toFixed(2) stand (Schulden, Budget-Import, KVG),
// fehlte die Trennung ganz: «CHF 12345.00».
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { zahl, betrag } from '../utils/geld.js';

describe('zahl', () => {
  it('trennt mit ’ und rundet ohne Angabe auf ganze', () => {
    expect(zahl(0)).toBe('0');
    expect(zahl(999.4)).toBe('999');
    expect(zahl(1000)).toBe('1’000');
    expect(zahl(12345.6)).toBe('12’346');
    expect(zahl(1234567)).toBe('1’234’567');
  });
  it('feste und höchstens-Nachkommastellen', () => {
    expect(zahl(12345.5, { stellen: 2 })).toBe('12’345.50');
    expect(zahl(12345.5, { hoechstens: 2 })).toBe('12’345.5');
    expect(zahl(12345, { hoechstens: 2 })).toBe('12’345');
    expect(zahl(0.456, { hoechstens: 1 })).toBe('0.5');
  });
  it('negativ mit typografischem Minus, −0 ohne Vorzeichen', () => {
    expect(zahl(-4321)).toBe('−4’321');
    expect(zahl(-0.4)).toBe('0');
  });
  it('Ungültiges wird «–», nicht «NaN»', () => {
    for (const x of [null, undefined, NaN, Infinity, 'abc']) expect(zahl(x)).toBe('–');
  });
  it('hängt nicht von der Laufzeit-Locale ab', () => {
    expect(zahl(12345)).not.toContain("'");
    expect(zahl(12345)).toContain('’');
  });
});

describe('betrag', () => {
  it('Franken wie die bisherigen formatCHF-Kopien', () => {
    expect(betrag(0)).toBe('CHF 0');
    expect(betrag(12345.6)).toBe('CHF 12’346');
    expect(betrag(-1234)).toBe('− CHF 1’234');
    expect(betrag(12345, { stellen: 2 })).toBe('CHF 12’345.00');
    expect(betrag(-0.001, { stellen: 2 })).toBe('CHF 0.00');
  });
});

describe('eine Quelle', () => {
  const SRC = path.resolve(__dirname, '..');
  const dateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : dateien(p);
    return /\.(jsx?|ts)$/.test(e.name) ? [p] : [];
  });
  const zeilen = () => dateien(SRC).flatMap((p) => fs.readFileSync(p, 'utf8').split('\n')
    .map((z, i) => [path.relative(SRC, p) + ':' + (i + 1), z])
    .filter(([, z]) => !/^\s*\/\//.test(z)));

  it('keine Zahl wird mit toLocaleString formatiert (Datumsformate sind frei)', () => {
    const treffer = zeilen().filter(([, z]) => /\.toLocaleString\(/.test(z)).map(([o]) => o);
    expect(treffer).toEqual([]);
  });
  it('das Apostroph-Muster steht nur in utils/geld.js', () => {
    const treffer = zeilen().filter(([o, z]) => /\(\?=\(\\d\{3\}\)\+/.test(z) && !o.startsWith('utils/geld.js')).map(([o]) => o);
    expect(treffer).toEqual([]);
  });
  // Jeder Text, der auf «CHF » endet ('CHF ', '~ CHF ', ': CHF ', 'Max: CHF ' …) und mit einem
  // Ausdruck verbunden wird, der nicht durch einen Formatierer läuft. Erlaubnisliste:
  // der Text-Export (zipExport.js) schreibt Rohwerte wie eingegeben — eigene Frage, offen.
  it('kein «CHF » vor einer rohen Zahl', () => {
    const FORMATIERER = /^(betrag|chfBetrag|zahl|fmt|fmtCHF|formatCHF|fmtAmount|formatAmount|num|num1|chf|t)\(/;
    const treffer = zeilen().filter(([o, z]) => {
      if (o.startsWith('utils/geld.js') || o.startsWith('zipExport.js')) return false;
      return [...z.matchAll(/CHF ['"]\s*\+\s*([^,;)]+)/g)].some((m) => !FORMATIERER.test(m[1].trim()) && !/^franchiseValue\(/.test(m[1].trim()));
    }).map(([o]) => o);
    expect(treffer).toEqual([]);
  });
});
