// Selbständige zahlen AHV und Pensionskasse selbst: Die Beiträge gehören in die Ausgaben, sonst ist «Bleibt» zu hoch (Fachprüfung 01.11.2026).
import { describe, it, expect } from 'vitest';
import { monatsAusgaben, sumAllExpenses } from '../monatsrechnung.js';
import { calculateMonthlyBudget, BUDGET_GROUPS } from '../../budgetSync.js';

const versicherungen = { ahvContribution: '6000', bvgContribution: '300' };
const mit = (employmentType) => ({ finanzen: { employmentType, monthlyIncome: '6000', incomeType: 'netto' }, versicherungen });

describe('AHV und BVG bei Selbständigen', () => {
  it.each(['selfEmployed', 'freelance'])('%s: zählen in den Ausgaben, AHV ÷ 12', (art) => {
    const p = monatsAusgaben(mit(art));
    expect(p.ahvSelbst).toBe(500);
    expect(p.bvgSelbst).toBe(300);
    expect(sumAllExpenses(mit(art).finanzen, mit(art))).toBe(800);
  });
  it.each(['employed', 'retired', undefined])('%s: zählen nicht, die Referenz bleibt', (art) => {
    const d = mit(art);
    expect(sumAllExpenses(d.finanzen, d)).toBe(0);
    expect(calculateMonthlyBudget(d, (k) => k).reference).toEqual({ bvg: 300, ahv: 500 });
  });
  it('Budget: Gruppe trägt beide, keine doppelte Referenz, «Bleibt» sinkt', () => {
    const b = calculateMonthlyBudget(mit('selfEmployed'), (k) => k);
    expect(BUDGET_GROUPS.find((g) => g.key === 'taxProvision').fields).toEqual(expect.arrayContaining(['ahvSelbst', 'bvgSelbst']));
    expect(b.reference).toEqual({ bvg: 0, ahv: 0 });
    expect(b.totalExpenses).toBe(800);
    expect(b.remaining).toBe(b.income - 800);
  });
});
