import { describe, it, expect } from 'vitest';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { sozialhilfePegelState } from '../data/pegel.js';

// AsylG Art. 82 Abs. 3, AIG Art. 86 Abs. 1 (Stebler Studios 01.11.2026: Zahl mit Hinweis).
describe('Sozialhilfe bei Ausweis F, N, S', () => {
  const profil = (workPermit) => ({
    basis: { canton: 'ZH' },
    wohnen: { rentAmount: '1200' },
    finanzen: { monthlyIncome: '1500', incomeType: 'netto' },
    ausbildung: { workPermit },
  });

  it.each(['f', 'n', 's'])('Ausweis %s: Die Zahl bleibt, das Merkmal ist gesetzt', (w) => {
    const sh = calculateSozialhilfe(profil(w));
    expect(sh.ansatzTiefer).toBe(true);
    expect(sh.totalBedarf).toBe(calculateSozialhilfe(profil('c')).totalBedarf);
    expect(sozialhilfePegelState(profil(w)).ansatzTiefer).toBe(true);
  });

  it.each(['swiss', 'b', 'c', 'l', 'g', ''])('Ausweis «%s»: kein Hinweis', (w) => {
    expect(calculateSozialhilfe(profil(w)).ansatzTiefer).toBe(false);
    expect(sozialhilfePegelState(profil(w)).ansatzTiefer).toBe(false);
  });
});
