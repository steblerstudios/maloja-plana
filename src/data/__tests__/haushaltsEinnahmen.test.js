// Einnahmen des Haushalts — EINE Summe für Budget-Seite und Finanzübersicht (28.09.2026).
// Vorher zählten beide nur den eigenen Lohn (+ Zulagen, Alimente), zogen aber Ausgaben des
// ganzen Haushalts ab: ein Paar erschien knapp oder im Minus, ein Nebenerwerb fehlte.
import { describe, it, expect } from 'vitest';
import { haushaltsEinnahmen } from '../haushaltsEinnahmen.js';
import { calculateMonthlyBudget } from '../../budgetSync.js';

const paar = (finanzen = {}) => ({
  basis: { maritalStatus: 'married', household: { adultsList: [{ name: 'P' }], partnerIncome: '3200' } },
  finanzen: { monthlyIncome: '6200', incomeType: 'netto', ...finanzen },
});

describe('haushaltsEinnahmen', () => {
  it('zählt Lohn, Nebenerwerb, Partner/in, Zulagen und Alimente', () => {
    const e = haushaltsEinnahmen(paar({ sideIncome: '800', sideIncomeType: 'netto', familienzulagen: '215', alimenteReceived: '400' }));
    expect(e).toMatchObject({ lohn: 6200, neben: 800, partner: 3200, familienzulagen: 215, alimente: 400 });
    expect(e.total).toBe(6200 + 800 + 3200 + 215 + 400);
    expect(e.bruttoDabei).toBe(false);
  });
  it('Partner-Einkommen zählt nur, wenn das Feld sichtbar wäre (allein, ledig → nicht)', () => {
    const e = haushaltsEinnahmen({ basis: { maritalStatus: 'single', household: { partnerIncome: '3200' } }, finanzen: { monthlyIncome: '5000', incomeType: 'netto' } });
    expect(e.partner).toBe(0);
    expect(e.total).toBe(5000);
  });
  it('Bruttolohn → bruttoDabei', () => {
    expect(haushaltsEinnahmen(paar({ incomeType: 'brutto' })).bruttoDabei).toBe(true);
  });
  it('Nebenerwerb brutto → bruttoDabei, auch bei Netto-Hauptlohn', () => {
    expect(haushaltsEinnahmen(paar({ sideIncome: '800', sideIncomeType: 'brutto' })).bruttoDabei).toBe(true);
  });
  it('Gegenprobe: Art «brutto» ohne Betrag zählt nicht als brutto', () => {
    expect(haushaltsEinnahmen(paar({ sideIncome: '', sideIncomeType: 'brutto' })).bruttoDabei).toBe(false);
  });
  it('ohne Art (nicht angegeben): gezählt, nicht als brutto — der Feld-Hinweis rät zu netto', () => {
    const e = haushaltsEinnahmen({ finanzen: { monthlyIncome: '5000' } });
    expect(e.total).toBe(5000);
    expect(e.bruttoDabei).toBe(false);
    expect(e.lohnArt).toBeNull();
  });
  it('leer: alles 0', () => {
    expect(haushaltsEinnahmen({}).total).toBe(0);
  });
});

describe('Budget-Rechnung nutzt die Haushaltssumme', () => {
  it('Einnahmen = haushaltsEinnahmen().total', () => {
    const d = paar({ sideIncome: '800', sideIncomeType: 'netto' });
    const b = calculateMonthlyBudget(d, (k) => k);
    expect(b.income).toBe(haushaltsEinnahmen(d).total);
    expect(b.incomeDetail.partner).toBe(3200);
    expect(b.incomeDetail.neben).toBe(800);
  });
  it('trägt bruttoDabei weiter', () => {
    expect(calculateMonthlyBudget(paar({ incomeType: 'brutto' }), (k) => k).bruttoDabei).toBe(true);
  });
});
