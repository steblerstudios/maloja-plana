import { describe, it, expect } from 'vitest';
import { getMietzinsbeitraege, mietzinsIncomeLimit, MIETZINS_OVERVIEW_URL } from '../mietzinsbeitraege.js';

describe('mietzinsbeitraege', () => {
  it('returns confirmed programs as "has" with a link', () => {
    for (const c of ['BS', 'BL', 'GE', 'ZG']) {
      const r = getMietzinsbeitraege(c);
      expect(r.state).toBe('has');
      expect(r.url).toMatch(/^https:\/\//);
      expect(r.canton).toBe(c);
    }
  });

  it('falls back to "check" (never a false "none") for unconfirmed cantons', () => {
    for (const c of ['ZH', 'BE', 'SO', 'AR', 'VS', 'JU']) {
      const r = getMietzinsbeitraege(c);
      expect(r.state).toBe('check');
      expect(r.url).toBe(MIETZINS_OVERVIEW_URL);
    }
  });

  it('handles unknown input as "check"', () => {
    expect(getMietzinsbeitraege('').state).toBe('check');
    expect(getMietzinsbeitraege(undefined).state).toBe('check');
  });

  it('carries researched program parameters (group + residency)', () => {
    expect(getMietzinsbeitraege('BL').group).toBe('families'); // BL: nur Haushalte mit Kind
    expect(getMietzinsbeitraege('BS').group).toBe('all');      // BS: seit 2025 auch ohne Kinder
    expect(getMietzinsbeitraege('ZG').residencyYears).toBe(3);
    expect(getMietzinsbeitraege('GE').incomeLimit).toBeNull(); // GE: mietabhängiges barème
  });

  it('applies household surcharges to the income limit (ZG)', () => {
    const zg = getMietzinsbeitraege('ZG');
    expect(mietzinsIncomeLimit(zg, 1, 0)).toBe(60000);                 // Basis
    expect(mietzinsIncomeLimit(zg, 3, 1)).toBe(60000 + 2500);          // +1 Kind
    expect(mietzinsIncomeLimit(zg, 3, 0)).toBe(60000 + 20000);         // 3. erwachsene Person
    expect(mietzinsIncomeLimit(getMietzinsbeitraege('GE'))).toBeNull(); // kein barème → null
  });
});
