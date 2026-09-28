// Finanzübersicht, Monatsbudget: dieselben Zahlen wie die Budget-Seite (28.09.2026, Variante A + a).
import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import FinanzUebersicht, { druckAbschnitte } from '../FinanzUebersicht.jsx';
import { calculateMonthlyBudget } from '../budgetSync.js';
import { DEMO_DATA } from '../config/demoData.js';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const seite = (d) => renderToStaticMarkup(React.createElement(FinanzUebersicht, { palette, t, data: d, onNavigate: () => {} }));
const chf = (html, n) => html.includes('CHF ' + n.toLocaleString('de-CH').replace(/[’']/g, '’')) || html.includes('CHF ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '’'));

const paar = (finanzen = {}) => ({
  basis: { canton: 'ZH', maritalStatus: 'married', household: { adultsList: [{ name: 'P' }], partnerIncome: '3200' } },
  finanzen: { monthlyIncome: '6200', incomeType: 'netto', groceries: '700', ...finanzen },
  wohnen: { rentAmount: '2400', mortgagePayment: '' },
  versicherungen: { kkPremium: '385' },
});

beforeAll(() => { preloadPLZ(); });

describe('Monatsbudget der Finanzübersicht', () => {
  it('Paar: Einnahmen des Haushalts, mit Aufschlüsselung', () => {
    const html = seite(paar());
    const b = calculateMonthlyBudget(paar(), t);
    expect(b.income).toBe(9400);
    expect(chf(html, 9400)).toBe(true);
    expect(html).toContain('budgetSync.incomePartner');
    expect(html).toContain('budgetSync.incomeNet');
    expect(chf(html, b.remaining)).toBe(true);
  });
  it('Ausgaben wie die Budget-Seite — auch Hypothek und 3a', () => {
    const d = { ...paar(), wohnen: { rentAmount: '', mortgagePayment: '1500' }, finanzen: { ...paar().finanzen, pension3a: '7056' } };
    const b = calculateMonthlyBudget(d, t);
    expect(b.totalExpenses).toBe(1500 + 385 + 700 + 588);
    expect(chf(seite(d), b.totalExpenses)).toBe(true);
  });
  it('Bruttolohn: kein «frei verfügbar»-Betrag, sondern die Frage nach dem Netto', () => {
    const d = paar({ incomeType: 'brutto' });
    const html = seite(d);
    const b = calculateMonthlyBudget(d, t);
    expect(html).toContain('budgetSync.availableNeedsNetto');
    expect(html).toContain('budgetSync.incomeGross');
    expect(chf(html, b.remaining)).toBe(false);
  });
  it('Druck: bei brutto die Frage statt des Betrags', () => {
    const w = { income: 6200, ipv: {}, sozialhilfe: {}, el: {}, hasExpenses: true, totalIncome: 9400, totalExpenses: 3485, freeAmount: 5915, bruttoDabei: true };
    const html = druckAbschnitte(t, w).flatMap(a => a.zeilen.map(z => z.html)).join('');
    expect(html).toContain('budgetSync.availableNeedsNetto');
    expect(html).not.toContain('5’915');
  });
  // Einnahmen unverändert; die Ausgaben zählen jetzt die 3a-Einzahlung mit (250/J. ≈ 21/Mt.), wie
  // die Budget-Seite schon immer — «frei» sinkt darum von 2’480 auf rund 2’459.
  it('Beispielperson (allein, netto): Einnahmen 6’200, frei ≈ 2’459 wie auf der Budget-Seite', () => {
    const b = calculateMonthlyBudget(DEMO_DATA, t);
    expect(b.income).toBe(6200);
    expect(Math.round(b.remaining)).toBe(2459);
    expect(b.bruttoDabei).toBe(false);
    const html = seite(DEMO_DATA);
    expect(html).not.toContain('budgetSync.availableNeedsNetto');
  });
});
