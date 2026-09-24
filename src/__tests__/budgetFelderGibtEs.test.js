import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createBudgetReport } from '../budgetSync.js';
import { getChapters } from '../config/constants.js';

const t = (k) => k;

// Ein Feld, das der Rechner liest, das Formular aber nicht anbietet, bleibt für immer leer —
// grün und wertlos. Bis 24.09.2026 lasen Budget und Mietvergleich drei solche Felder.
describe('Budget liest nur Felder, die man auch ausfüllen kann', () => {
  it('jedes data.<kapitel>.<feld> in budgetSync.js und BudgetSync.jsx ist ein Formularfeld', () => {
    const quelle = ['budgetSync.js', 'BudgetSync.jsx']
      .map(f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n');
    const gelesen = [...quelle.matchAll(/data\.(wohnen|versicherungen|finanzen|basis)\?\.(\w+)/g)].map(m => [m[1], m[2]]);
    expect(gelesen.length).toBeGreaterThan(10);
    // household ist ein Unterobjekt aus der Haushaltserfassung, kein Einzelfeld.
    const formular = Object.fromEntries(getChapters(t).map(c => [c.key, new Set(c.fields.map(f => f.k))]));
    const fehlend = gelesen.filter(([k, f]) => f !== 'household' && !formular[k].has(f));
    expect(fehlend).toEqual([]);
  });

  it('Hypothekarzins zählt zu den Wohnkosten', () => {
    const ohne = createBudgetReport({ wohnen: { utilities: 200 } }, t).details.expenses.housing;
    const mit = createBudgetReport({ wohnen: { utilities: 200, mortgagePayment: 1500 } }, t).details.expenses.housing;
    expect(mit - ohne).toBe(1500);
  });
});
