import { describe, it, expect } from 'vitest';
import { buildSnippet } from '../Dashboard.jsx';

// Sammel-Fix 14.10.2026, Punkt 6: «frei/Mt.» zog Ausgaben vom Monatslohn ab, ohne zu fragen,
// ob der Lohn brutto oder netto ist. Ein Bruttolohn ist nicht das, was ankommt — die Zahl war
// zu hoch; ohne Art wäre sie geraten. Wie überall (lohnBasis): nur bei netto rechnen.
const t = (k) => ({ 'synthesis.expenses': 'Ausgaben', 'synthesis.freePerMonth': 'frei/Mt.' }[k] || k);
const alle = (finanzen) => ({
  finanzen,
  wohnen: { rentAmount: 1500 },
  versicherungen: { kkPremium: 400 },
});
const snippet = (finanzen) => buildSnippet('finanzen', alle(finanzen).finanzen, alle(finanzen), t);

describe('Dashboard-Kachel Finanzen: «frei/Mt.»', () => {
  it('netto: frei = Lohn minus Ausgaben', () => {
    expect(snippet({ monthlyIncome: 5000, incomeType: 'netto' })).toMatch(/3.?100.*frei\/Mt\./);
  });
  it('brutto: keine «frei»-Zahl', () => {
    const s = snippet({ monthlyIncome: 5000, incomeType: 'brutto' });
    expect(s).not.toMatch(/frei/);
    expect(s).toMatch(/5.?000/);
  });
  it('Art offen: keine «frei»-Zahl', () => {
    expect(snippet({ monthlyIncome: 5000 })).not.toMatch(/frei/);
  });
});
