import { describe, it, expect } from 'vitest';
import { monthlyExpenses } from '../data/haushaltskosten.js';
import { calculateMonthlyBudget } from '../budgetSync.js';
import { DEMO_DATA } from '../config/demoData.js';

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

  // Wächter (28.09.2026): Hier stand «Gleiche Felder wie die Budget-Bilanz» — es fehlten Hypothek,
  // Gebäudeversicherung und 3a. Die Dashboard-Tankanzeige und die Finanzübersicht (die seither
  // calculateMonthlyBudget liest) liefen damit auseinander. Jetzt geprüft statt behauptet.
  it('dieselbe Summe wie die Budget-Rechnung (calculateMonthlyBudget)', () => {
    const profile = [
      DEMO_DATA,
      { wohnen: { mortgagePayment: '1500', buildingsInsurance: '600', utilities: '250' }, finanzen: { pension3a: '7056', groceries: '500' } },
      { wohnen: { rentAmount: '1800' }, versicherungen: { kkPremium: '400' }, finanzen: { debtPayments: '200', alimentePaid: '800', childcare: '300' } },
      {},
    ];
    for (const d of profile) expect(monthlyExpenses(d)).toBeCloseTo(calculateMonthlyBudget(d, (k) => k).totalExpenses, 6);
  });
});
