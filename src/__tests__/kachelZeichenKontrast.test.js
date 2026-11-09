import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DARK_PALETTE, LIGHT_PALETTE, CHAPTER_KEYS } from '../config/constants.js';
import { getBereichForChapter, LEBENSBEREICHE } from '../data/lebensbereiche.js';
import { kachelZeichenFarbe, kontrast, mischeHex, KACHEL_DECKKRAFT } from '../utils/lebensbereichFruechte.js';

// Entscheid Stebler Studios 09.11.2026, «B, tieferer Ton»: ein Zeichen auf getönter Kachel erreicht
// GEGEN DIE KACHEL 3:1 (WCAG 1.4.11). Die Kachel bleibt die Bereichsfarbe zu 18 % auf der Karte.
// Gemessen vorher im Menü (hell): Finanzen 1.9 · Wohnen 2.6 · Gesundheit 2.7 · Versicherungen 2.7.
const lies = (d) => readFileSync(resolve(__dirname, '..', d), 'utf8');
const kachel = (farbe, p) => mischeHex(p.surface, farbe, KACHEL_DECKKRAFT);

describe('Zeichen auf getönter Kachel · 3:1 gegen die Kachel', () => {
  for (const [name, p, isDark] of [['hell', LIGHT_PALETTE, false], ['dunkel', DARK_PALETTE, true]]) {
    it(`${name}: jedes Kapitel und jeder Ast`, () => {
      const zuSchwach = LEBENSBEREICHE.map((b) => {
        const farbe = isDark ? b.dark : b.light;
        const zeichen = kachelZeichenFarbe(farbe, p);
        return [b.key, +kontrast(zeichen, kachel(farbe, p)).toFixed(2)];
      }).filter(([, k]) => k < 3);
      expect(zuSchwach).toEqual([]);
    });
  }
  it('der Farbton bleibt: das Zeichen ist dieselbe Farbe, nur tiefer — und unverändert, wo es schon reicht', () => {
    const behoerden = getBereichForChapter('behoerden').light;
    expect(kachelZeichenFarbe(behoerden, LIGHT_PALETTE).toLowerCase()).toBe(behoerden.toLowerCase());
    const finanzen = getBereichForChapter('finanzen').light;
    const tief = kachelZeichenFarbe(finanzen, LIGHT_PALETTE);
    expect(tief.toLowerCase()).not.toBe(finanzen.toLowerCase());
    expect(kontrast(tief, '#000000')).toBeLessThan(kontrast(finanzen, '#000000'));
  });
  it('alle sieben Kapitel haben eine Bereichsfarbe (sonst prüft der Test oben ins Leere)', () => {
    expect(CHAPTER_KEYS.filter((k) => !getBereichForChapter(k))).toEqual([]);
  });
  it('die fünf Kachel-Stellen nehmen die Zeichenfarbe aus kachelZeichenFarbe', () => {
    expect(lies('MobileNav.jsx')).toMatch(/background: farbe \? farbe \+ '2E' : palette\.up, color: farbe \? kachelZeichenFarbe\(farbe, palette\)/);
    expect(lies('AblaufSchale.jsx')).toMatch(/\{ balken: farbe, zeichen: kachelZeichenFarbe\(farbe, palette\) \}/);
    expect(lies('components/RechnerForm.jsx')).toMatch(/\{ flaeche: farbe, zeichen: kachelZeichenFarbe\(farbe, palette\) \}/);
    const kal = lies('CalendarReminders.jsx');
    expect(kal).toMatch(/color: kachelZeichenFarbe\(farbe, palette\) \} \}/);
    expect(kal).toMatch(/color: kachelZeichenFarbe\(f, palette\) \} \}/);
  });
});
