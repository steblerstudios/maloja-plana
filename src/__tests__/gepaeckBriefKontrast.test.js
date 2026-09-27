import { describe, it, expect } from 'vitest';
import { BRIEF_DUNKEL } from '../data/gepaeck.js';
import { DARK_PALETTE } from '../config/constants.js';
import { kontrast } from '../utils/lebensbereichFruechte.js';

// «Versiegelter Brief» im Dunkelmodus: vorher Papier = Kartenfläche (1,0 : 1), Rand
// 1,13 : 1 — die Brief-Form war im Dunkeln nicht zu sehen. WCAG 1.4.11 verlangt
// ≥ 3 : 1 für bedeutungstragende Grafik. Die Karte ist palette.surface.
describe('Versiegelter Brief — Kontrast im Dunkelmodus', () => {
  const karte = DARK_PALETTE.surface;
  it('Brief-Form (Papier) hebt sich ≥ 3 : 1 von der Karte ab', () => {
    expect(kontrast(BRIEF_DUNKEL.papier, karte)).toBeGreaterThanOrEqual(3);
  });
  it('der Rand hebt sich ≥ 3 : 1 von der Karte ab', () => {
    expect(kontrast(BRIEF_DUNKEL.rand, karte)).toBeGreaterThanOrEqual(3);
  });
  it('das Siegel hebt sich ≥ 3 : 1 vom Papier ab, auf dem es sitzt', () => {
    expect(kontrast(BRIEF_DUNKEL.siegel, BRIEF_DUNKEL.papier)).toBeGreaterThanOrEqual(3);
  });
  it('vorher war es nicht so (Beleg, dass der Test misst): Papier = Karte → 1 : 1', () => {
    expect(kontrast(DARK_PALETTE.surface, karte)).toBeLessThan(1.01);
  });
});
