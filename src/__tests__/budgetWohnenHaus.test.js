import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { calculateMonthlyBudget } from '../budgetSync.js';
import { wohnkostenRechnung } from '../bereiche/wohnen/rechnung.js';

// Budget · Wohnen (Stebler Studios 11.11.2026, «Ja, Budget»): die Gruppe «Wohnen» und der Wohn-Hinweis
// folgen derselben Regel wie Kapitel Wohnen, Mietzins und Drittel-Haus (bereiche/wohnen/rechnung.js).
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

  it('Partner-Haus (11.11.2026): mit Partner/in, zwei Erwachsene, netto — dieselbe Prozentzahl wie das Haus', () => {
    const p = profil({ monthlyIncome: '5200' }, {}, { maritalStatus: 'married', household: { adults: 2, children: [], partnerIncome: '3800' } });
    const b = calculateMonthlyBudget(p, t);
    const e = b.expenses;
    const r = wohnkostenRechnung(p.wohnen, p);
    expect(r.haushalt).toBe(true);
    expect(r.einkommen).toBe(b.income);
    expect(Math.round(((e.rent + e.utilities) / b.income) * 100)).toBe(Math.round(r.anteil));
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
    // Überholt 18.11.2026 (Bauplan Wohnen): kein «!» mehr auf dem Miet-Bild (thresholdValue: drittelGrenzeMiete) — das
    // Drittel trägt nur das Drittel-Haus der Gruppe, und dort aus derselben Rechnung `wohn`.
    expect(q).toMatch(/React\.createElement\(DrittelHaus, \{ palette, anteil: wohn\.anteil, ueberDrittel: wohn\.ueberDrittel,/);
    expect(q).not.toMatch(/thresholdValue:/);
    expect(fs.readFileSync(path.join(SRC, 'budgetSync.js'), 'utf8')).not.toMatch(/rentPercentage|> 40\b/);
  });
});

// Überholt 18.11.2026 (Bauplan Wohnen, «jedes Bild einmal»): der BFS-Richtwert der Gruppe hat kein eigenes Bild mehr
// (bis dahin zwei Häuser, HaeuserVergleich). Die Lage der Miete zeigt im Budget das eine Vergleichshaus, mittel, mit
// der Budget-Miete; der Richtwert-Satz mit Quelle bleibt.
describe('Budget · Miete als Vergleichshaus, Richtwert als Satz', () => {
  it('Vergleichshaus in der Lage-Farbe: darüber gold, darunter salbei, ±2 % neutral', async () => {
    const React = (await import('react')).default;
    const { renderToStaticMarkup } = await import('react-dom/server');
    const { Vergleichshaus, lageFarben, lageZurRegion } = await import('../bereiche/wohnen/wohnen.js');
    const P = { text: '#111', mid: '#666', gold: '#B8955A', sage: '#5F7F68', goldDeep: '#850', sageDeep: '#363', skyDeep: '#357', surface: '#FFF' };
    const vergleich = { regional: 1277, national: 1446 };
    const bild = (sie) => renderToStaticMarkup(React.createElement(Vergleichshaus, { palette: P, lage: { netto: sie, vergleich, lage: lageZurRegion(sie, 1277) }, fuell: '#6C8343', groesse: 'mittel' }));
    const kanton = (h) => h.match(/<line data-teil="stock-kanton"[^>]*>/)[0];
    expect(kanton(bild(1800))).toContain('stroke="#B8955A"');
    expect(kanton(bild(1000))).toContain('stroke="#5F7F68"');
    expect(lageFarben(P, lageZurRegion(1280, 1277))[0]).toBe('#666');
    expect(bild(1800)).toContain('aria-hidden="true"');
    expect(bild(0)).not.toContain('vergleich-fuellung');
  });

  it('steht im Miet-Feld mit den Sätzen; der Richtwert-Satz mit Quelle bleibt in der Gruppe', () => {
    const q = fs.readFileSync(path.join(SRC, 'BudgetSync.jsx'), 'utf8');
    expect(q).toMatch(/'data-teil': 'budget-vergleichshaus'/);
    expect(q).toMatch(/React\.createElement\(Vergleichshaus, \{ palette, lage: ml, fuell: bereichFillColor\('wohnen', isDarkMode\), groesse: 'mittel' \}\)/);
    expect(q).toMatch(/React\.createElement\(MieteSaetze, \{ palette, t, ml \}\)/);
    expect(q).not.toMatch(/HaeuserVergleich|budget-richtwert-haeuser/);
    expect(q).toMatch(/open && groupBm && renderBenchmarkLine\(groupBm, group\.key, true\)/);
  });
});
