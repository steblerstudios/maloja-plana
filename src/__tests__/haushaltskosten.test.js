import { describe, it, expect } from 'vitest';
import { monthlyExpenses } from '../data/haushaltskosten.js';

describe('monthlyExpenses: geteilte Ausgaben-Summe (Finanzübersicht + Dashboard-Tank)', () => {
  it('summiert Wohnen + KK-Prämie + Finanzen-Posten', () => {
    const data = {
      wohnen: { rentAmount: '1500', utilities: '200' },
      versicherungen: { kkPremium: '350' },
      finanzen: { groceries: '600', communication: '80', mobility: '120', childcare: '0', otherInsurance: '50', monthlyTax: '300', debtPayments: '0', alimentePaid: '0' },
    };
    expect(monthlyExpenses(data)).toBe(1500 + 200 + 350 + 600 + 80 + 120 + 0 + 50 + 300 + 0 + 0);
  });

  it('leere/fehlende Daten → 0 (kein NaN)', () => {
    expect(monthlyExpenses({})).toBe(0);
    expect(monthlyExpenses()).toBe(0);
    expect(monthlyExpenses({ finanzen: { groceries: 'x' } })).toBe(0);
  });

  it('zählt nur die erfassten Posten', () => {
    expect(monthlyExpenses({ wohnen: { rentAmount: '1200' } })).toBe(1200);
  });
});
