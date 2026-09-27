import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { kapitelBereichsfarbe, kontrast, lesbareFarbe } from '../utils/lebensbereichFruechte.js';
import { DARK_PALETTE, LIGHT_PALETTE, CHAPTER_KEYS } from '../config/constants.js';

// Entscheid 27.09.2026: Titel + Zeichen in der Bereichsfarbe, Seitenhintergrund leicht getönt.
describe('Kapitel in der Bereichsfarbe', () => {
  for (const [name, palette, dunkel] of [['hell', LIGHT_PALETTE, false], ['dunkel', DARK_PALETTE, true]]) {
    it(name + ': jeder Kapiteltitel erreicht WCAG-AA (4.5:1) auf der Karte', () => {
      for (const key of CHAPTER_KEYS) {
        const f = kapitelBereichsfarbe(key, palette, dunkel);
        expect(f, key).toBeTruthy();
        expect(kontrast(f.schrift, palette.surface), key).toBeGreaterThanOrEqual(4.5);
      }
    });
    it(name + ': die Seitentönung bleibt nah am Grund (ruhig, nicht laut)', () => {
      for (const key of CHAPTER_KEYS) {
        const { grund } = kapitelBereichsfarbe(key, palette, dunkel);
        expect(kontrast(grund, palette.bg), key).toBeLessThan(1.5);
        expect(grund.toLowerCase(), key).not.toBe(palette.bg.toLowerCase());
      }
    });
  }

  it('die sieben Kapitel tragen sieben verschiedene Titelfarben', () => {
    const farben = new Set(CHAPTER_KEYS.map((k) => kapitelBereichsfarbe(k, LIGHT_PALETTE, false).schrift));
    expect(farben.size).toBe(CHAPTER_KEYS.length);
  });

  it('lesbareFarbe lässt eine schon lesbare Farbe unverändert', () => {
    expect(lesbareFarbe('#000000', '#FFFFFF', false)).toBe('#000000');
  });

  it('main.jsx malt den Seitengrund aus der Bereichsfarbe, nicht fest palette.bg', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'main.jsx'), 'utf8');
    expect(src).toMatch(/minHeight: '100dvh', background: seitenGrund/);
  });
});
