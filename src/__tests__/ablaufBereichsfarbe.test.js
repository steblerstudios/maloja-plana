import { describe, it, expect } from 'vitest';
import { ABLAEUFE, ablaufBereich } from '../config/ansichtenRegister.js';
import { getBereich, bereichColor } from '../data/lebensbereiche.js';
import { kontrast, lesbareFarbe } from '../utils/lebensbereichFruechte.js';
import { DARK_PALETTE, LIGHT_PALETTE } from '../config/constants.js';

// Entscheid Stebler Studios 27.09.2026: jeder Ablauf steht in der Farbe seines Lebensbereichs.
describe('Abläufe in der Bereichsfarbe', () => {
  it('jeder Ablauf hat einen Lebensbereich, den es gibt', () => {
    for (const a of ABLAEUFE) {
      expect(a.bereich, a.view).toBeTruthy();
      expect(getBereich(a.bereich), a.view + ' → ' + a.bereich).toBeTruthy();
      expect(ablaufBereich(a.view)).toBe(a.bereich);
    }
  });

  it('das Zeichen erreicht 3:1 (Grafik) in hell und dunkel', () => {
    for (const [palette, dunkel] of [[LIGHT_PALETTE, false], [DARK_PALETTE, true]]) {
      for (const a of ABLAEUFE) {
        const z = lesbareFarbe(bereichColor(a.bereich, dunkel), palette.surface, dunkel, 3);
        expect(kontrast(z, palette.surface), a.view).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('Stichproben der Zuordnung', () => {
    expect(ablaufBereich('heirat')).toBe('familie');
    expect(ablaufBereich('stelleverloren')).toBe('arbeit');
    expect(ablaufBereich('umzug')).toBe('wohnen');
    expect(ablaufBereich('tax')).toBeNull();
  });
});
