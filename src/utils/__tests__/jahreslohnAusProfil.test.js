import { describe, it, expect } from 'vitest';
import { jahreslohnAusProfil, lohnIstNetto } from '../jahreslohnAusProfil.js';

// EO, AHV und BVG rechnen mit dem Bruttojahreslohn inkl. 13. — ein Nettolohn ist die falsche Basis.
describe('jahreslohnAusProfil', () => {
  it.each([
    [{ monthlyIncome: 5000 }, '60000'],
    [{ monthlyIncome: '5000', incomeType: 'brutto' }, '60000'],
    [{ monthlyIncome: 5000, incomeType: 'brutto', dreizehnter: 'yes' }, '65000'],
    [{ monthlyIncome: 5000, dreizehnter: 'no' }, '60000'],
    [{ monthlyIncome: 5000, incomeType: 'netto' }, ''],
    [{ monthlyIncome: 5000, incomeType: 'netto', dreizehnter: 'yes' }, ''],
    [{ monthlyIncome: '' }, ''],
    [{ monthlyIncome: 'abc' }, ''],
    [{}, ''],
    [undefined, ''],
  ])('%j → %j', (f, erwartet) => {
    expect(jahreslohnAusProfil(f)).toBe(erwartet);
  });
  it('lohnIstNetto', () => {
    expect(lohnIstNetto({ incomeType: 'netto' })).toBe(true);
    expect(lohnIstNetto({ incomeType: 'brutto' })).toBe(false);
    expect(lohnIstNetto(undefined)).toBe(false);
  });
});
