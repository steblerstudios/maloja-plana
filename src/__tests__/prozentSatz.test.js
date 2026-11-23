// Prozent-Satz (Sophie 23.11.2026, Rundgang Grössen/Weissraum, E5): zwischen Zahl und «%» steht das
// schmale, nicht umbrechende Leerzeichen U+202F — nie ein normales, sonst bleibt «12» am Zeilenende
// stehen und «%» rutscht in die nächste Zeile. Eine Quelle: PROZENT / prozent() in utils/geld.js.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prozent, PROZENT } from '../utils/geld.js';

const SRC = fileURLToPath(new URL('..', import.meta.url));
const dateien = (dir = SRC) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  if (statSync(p).isDirectory()) return n === '__tests__' || n === 'assets' ? [] : dateien(p);
  return /\.(jsx|js)$/.test(n) && !/\.test\./.test(n) ? [p] : [];
});

describe('prozent()', () => {
  it('hängt U+202F und % an, Zahl wie zahl()', () => {
    expect(PROZENT).toBe(' %');
    expect(prozent(12)).toBe('12 %');
    expect(prozent(12.34, { hoechstens: 1 })).toBe('12.3 %');
    expect(prozent(-5)).toBe('−5 %');
  });
  it('Ungültiges bleibt der Strich, ohne %', () => {
    expect(prozent(NaN)).toBe('–');
    expect(prozent(null)).toBe('–');
  });
});

describe('kein normales Leerzeichen vor %', () => {
  it('im Code: kein Literal \' %\'', () => {
    const funde = dateien()
      .filter((p) => !p.includes(join('src', 'i18n')))
      .flatMap((p) => readFileSync(p, 'utf8').split('\n')
        .map((z, i) => (/' %'/.test(z) ? relative(SRC, p) + ':' + (i + 1) : null))
        .filter(Boolean));
    expect(funde).toEqual([]);
  });

  it.each(['de', 'fr', 'it', 'rm', 'en'])('Übersetzung %s: Zahl oder Platzhalter, dann U+202F', (lang) => {
    const s = readFileSync(join(SRC, 'i18n', lang + '.js'), 'utf8');
    const funde = s.split('\n').map((z, i) => (/[0-9}] %/.test(z) ? lang + '.js:' + (i + 1) : null)).filter(Boolean);
    expect(funde).toEqual([]);
  });
});
