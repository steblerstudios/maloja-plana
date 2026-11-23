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
  it('im Code: kein « %» in Literalen und Template-Strings', () => {
    const funde = dateien()
      .filter((p) => !p.includes(join('src', 'i18n')))
      .flatMap((p) => readFileSync(p, 'utf8').split('\n')
        .map((z, i) => (/' %|\} %/.test(z) ? relative(SRC, p) + ':' + (i + 1) : null))
        .filter(Boolean));
    expect(funde).toEqual([]);
  });

  it.each(['de', 'fr', 'it', 'rm', 'en'])('Übersetzung %s: Zahl oder Platzhalter, dann U+202F', (lang) => {
    const s = readFileSync(join(SRC, 'i18n', lang + '.js'), 'utf8');
    const funde = s.split('\n').map((z, i) => (/[0-9}] %/.test(z) ? lang + '.js:' + (i + 1) : null)).filter(Boolean);
    expect(funde).toEqual([]);
  });
});

// CHF und Betrag (Sophie 23.11.2026, E5): geschütztes Leerzeichen U+00A0, nie Umbruch zwischen «CHF» und Zahl.
// Ausnahme: die Text-Sicherung (zipExport.js) setzt «CHF » selbst — eine Datei, in der man suchen können soll.
import { betrag, betragEcht, VERBORGEN } from '../utils/geld.js';
import { createT } from '../i18n/index.js';

describe('CHF mit geschütztem Leerzeichen', () => {
  it('betrag(), Minus und Sichtschutz', () => {
    expect(betragEcht(1234)).toBe('CHF 1’234');
    expect(betragEcht(-50)).toBe('− CHF 50');
    expect(betrag(7)).toBe('CHF 7');
    expect(VERBORGEN).toBe('CHF ···');
  });
  it('t() behält das geschützte Leerzeichen aus der Übersetzung und formatiert die Zahl', () => {
    const t = createT({ de: { a: 'ca. CHF\u00a0{x}/Jahr', b: 'CHF {x}' } }, 'de', 'sie');
    expect(t('a', { x: 2160 })).toBe('ca. CHF 2’160/Jahr');
    expect(t('b', { x: '1’500' })).toBe('CHF 1’500');
  });
  it.each(['de', 'fr', 'it', 'rm', 'en'])('Übersetzung %s: kein «CHF » vor Zahl oder Platzhalter', (lang) => {
    const s = readFileSync(join(SRC, 'i18n', lang + '.js'), 'utf8');
    const funde = s.split('\n').map((z, i) => (/CHF [0-9{]|\d CHF\b/.test(z) ? lang + '.js:' + (i + 1) : null)).filter(Boolean);
    expect(funde).toEqual([]);
  });
});
