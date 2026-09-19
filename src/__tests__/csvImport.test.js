import { describe, it, expect } from 'vitest';
import { processBudgetEntries } from '../csvImport.js';

// K106 — ein CSV-Import ohne Einkommenszeile darf ein bestehendes Einkommen
// nicht auf 0 überschreiben. Geschrieben wird nur, was die Datei enthält.

const bestand = { monthlyIncome: 5200, rentAmount: 1400, utilities: 180, healthPremium: 390 };

const zeile = (amount, category, type = 'expense') => ({ date: '01.09.2026', description: 'x', amount, category, type });

describe('processBudgetEntries (K106)', () => {
  it('Import ohne Einkommenszeile lässt ein bestehendes Einkommen stehen', () => {
    const out = processBudgetEntries([zeile(1500, 'Miete')], bestand);
    expect(out.monthlyIncome).toBe(5200);
    expect(out.rentAmount).toBe(1500);
  });

  it('leerer Import lässt alle Felder unangetastet', () => {
    expect(processBudgetEntries([], bestand)).toEqual(bestand);
  });

  it('Import mit Einkommenszeile 0 schreibt 0', () => {
    const out = processBudgetEntries([zeile(0, 'income', 'income')], bestand);
    expect(out.monthlyIncome).toBe(0);
  });

  it('Import mit Einkommenszeile schreibt den Betrag', () => {
    const out = processBudgetEntries([zeile(4000, 'income', 'income')], bestand);
    expect(out.monthlyIncome).toBe(4000);
  });

  it('mehrere Einkommenszeilen werden summiert', () => {
    const out = processBudgetEntries([zeile(4000, 'income', 'income'), zeile(600, 'income', 'income')], bestand);
    expect(out.monthlyIncome).toBe(4600);
  });

  it('ohne Ausgabenzeilen bleiben Miete, Nebenkosten und Krankenkasse stehen', () => {
    const out = processBudgetEntries([zeile(4000, 'income', 'income')], bestand);
    expect(out.rentAmount).toBe(1400);
    expect(out.utilities).toBe(180);
    expect(out.healthPremium).toBe(390);
  });

  it('verändert den Bestand nicht (neues Objekt)', () => {
    const kopie = { ...bestand };
    processBudgetEntries([zeile(4000, 'income', 'income')], bestand);
    expect(bestand).toEqual(kopie);
  });
});
