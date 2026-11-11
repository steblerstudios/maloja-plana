import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { calculateMonthlyBudget } from '../budgetSync.js';
import { wohnkostenRechnung } from '../data/wohnkosten.js';

// Budget · Wohnen (Stebler Studios 11.11.2026, «Ja, Budget»): die Gruppe «Wohnen» und der Wohn-Hinweis
// folgen derselben Regel wie Kapitel Wohnen, Mietzins und Drittel-Haus (data/wohnkosten.js).
// Bis dahin: Hinweis ab 40 % nur der Miete am Haushaltseinkommen — eine vierte Regel.

const t = (k) => k;
const SRC = path.resolve(__dirname, '..');
const profil = (finanzen = {}, wohnen = {}, basis = {}) => ({
  basis: { canton: 'ZH', household: { adults: 1, children: [] }, ...basis },
  wohnen: { rentAmount: '1650', utilities: '180', ...wohnen },
  finanzen: { monthlyIncome: '6000', incomeType: 'netto', ...finanzen },
});
const hinweis = (b) => b.recommendations.some((r) => r.text === 'budget.rentInfo');

describe('Budget · Wohn-Hinweis nach der einen Regel', () => {
  it('ohne Angabe aus der Wohnkosten-Rechnung kein Hinweis, auch bei hoher Miete (keine eigene Schwelle)', () => {
    const p = profil({ monthlyIncome: '3000' }, { rentAmount: '1650' });
    expect(hinweis(calculateMonthlyBudget(p, t))).toBe(false);
  });

  it('der Hinweis kommt genau dann, wenn die Wohnkosten mehr als ein Drittel sind', () => {
    for (const lohn of ['4000', '5400', '5600', '9000']) {
      const p = profil({ monthlyIncome: lohn });
      const r = wohnkostenRechnung(p.wohnen, p);
      expect(hinweis(calculateMonthlyBudget(p, t, { ueberDrittel: r.ueberDrittel && !r.mitPartner }))).toBe(r.ueberDrittel);
    }
  });

  it('ohne Partner/in zeigt die Gruppe «Wohnen» dieselbe Prozentzahl wie das Drittel-Haus', () => {
    const p = profil({ monthlyIncome: '5200', sideIncome: '800', sideIncomeType: 'netto' }, { mortgagePayment: '0', buildingsInsurance: '600' });
    const b = calculateMonthlyBudget(p, t);
    const e = b.expenses;
    const wohnen = e.rent + e.utilities + (e.mortgage || 0) + (e.buildingsInsurance || 0);
    const r = wohnkostenRechnung(p.wohnen, p);
    expect(Math.round((wohnen / b.income) * 100)).toBe(Math.round(r.anteil));
  });
});

describe('Budget · Drittel-Haus in der Gruppe «Wohnen»', () => {
  const q = fs.readFileSync(path.join(SRC, 'BudgetSync.jsx'), 'utf8');
  it('aufgeklappt, mittel 128, nur ohne Partner/in (sonst zwei verschiedene Zahlen)', () => {
    expect(q).toMatch(/open && group\.key === 'housing' && wohn\.anteil != null && !wohn\.mitPartner/);
    expect(q).toMatch(/React\.createElement\(DrittelHaus, \{[^}]*groesse: 'mittel' \}/);
  });
  it('Hinweis und «!» aus derselben Rechnung', () => {
    expect(q).toMatch(/calculateMonthlyBudget\(data, t, \{ ueberDrittel: wohn\.ueberDrittel && !wohn\.mitPartner \}\)/);
    expect(q).toMatch(/thresholdValue: drittelGrenzeMiete\(wohn\)/);
    expect(fs.readFileSync(path.join(SRC, 'budgetSync.js'), 'utf8')).not.toMatch(/rentPercentage|> 40\b/);
  });
});
