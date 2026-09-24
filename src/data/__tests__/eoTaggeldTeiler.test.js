import { describe, it, expect } from 'vitest';
import { berechneMutterschaft } from '../eoRechner.js';

// EOV Art. 5 Abs. 2 Bst. b: Monatslohn ÷ 30 (Mutterschaft sinngemäss, Art. 31 Abs. 2).
// Für das Jahreseinkommen heisst das ÷ 360 — bis 24.09.2026 stand ÷ 365 (1,4 % zu tief).
describe('EO-Taggeld: Tageseinkommen = Monatslohn ÷ 30', () => {
  it('Monatslohn 6000 → 200/Tag → Taggeld 160', () => {
    expect(berechneMutterschaft({ jahreseinkommen: 6000 * 12 }).taggeld).toBe(160);
  });
  it('das Maximum von 220 ist genau bei 8250/Monat erreicht', () => {
    expect(berechneMutterschaft({ jahreseinkommen: 8250 * 12 }).taggeld).toBe(220);
    expect(berechneMutterschaft({ jahreseinkommen: 8200 * 12 }).taggeld).toBeLessThan(220);
  });
});
