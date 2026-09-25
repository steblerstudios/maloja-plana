import { describe, it, expect } from 'vitest';
import { bereichsKnopf, kontrast } from '../utils/lebensbereichFruechte.js';
import { LEBENSBEREICHE } from '../data/lebensbereiche.js';
import { LIGHT_PALETTE, DARK_PALETTE } from '../config/constants.js';

// «Jetzt ergänzen» trägt die Farbe des Bereichs (Entscheid 25.09.2026).
// Die Schrift auf dem Knopf muss WCAG-AA für kleine Schrift halten — in jedem Bereich, hell wie dunkel.
describe('Knopf in der Bereichsfarbe bleibt lesbar', () => {
  for (const [modus, palette, feld] of [['hell', LIGHT_PALETTE, 'light'], ['dunkel', DARK_PALETTE, 'dark']]) {
    for (const b of LEBENSBEREICHE) {
      it(`${b.key} · ${modus}`, () => {
        const k = bereichsKnopf(b[feld], palette);
        expect(kontrast(k.background, k.color)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it('Persönliche Basis (hell) bekommt wirklich die eigene Farbe, nicht Sand', () => {
    const basis = LEBENSBEREICHE.find((b) => b.chapterKey === 'basis');
    expect(bereichsKnopf(basis.light, LIGHT_PALETTE).background).toBe(basis.light);
  });

  it('ohne brauchbare Farbe fällt der Knopf auf Sand zurück', () => {
    expect(bereichsKnopf(undefined, LIGHT_PALETTE)).toEqual({ background: LIGHT_PALETTE.sand, color: LIGHT_PALETTE.onSand });
  });
});
