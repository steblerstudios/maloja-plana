import { describe, it, expect } from 'vitest';
import { SKOS_GRUNDBEDARF, getGrundbedarf, calculateSozialhilfe } from '../cantonalData.js';
import { grundbedarfFuerHaushalt } from '../../data/sozialhilfeRechner.js';

describe('SKOS_GRUNDBEDARF (cantonalData)', () => {
  it('matches the official SKOS GBL 2025/2026 scale (SKOS-RL C.3.1)', () => {
    expect(SKOS_GRUNDBEDARF).toEqual({
      1: 1061,
      2: 1624,
      3: 1974,
      4: 2271,
      5: 2568,
      6: 2784,
      7: 3000,
    });
  });

  it('adds CHF 216 per person beyond 7', () => {
    expect(getGrundbedarf(8)).toBe(3216);
    expect(getGrundbedarf(10)).toBe(3648);
  });

  it('falls back to 1-person GBL for invalid sizes', () => {
    expect(getGrundbedarf(0)).toBe(1061);
    expect(getGrundbedarf(-1)).toBe(1061);
  });

  // Guard against the two SKOS sources drifting apart again:
  // getGrundbedarf (cantonalData) must agree with grundbedarfFuerHaushalt (sozialhilfeRechner)
  // for every realistic household size — both render in the same SozialhilfeView.
  it('stays consistent with sozialhilfeRechner.grundbedarfFuerHaushalt for 1–12 persons', () => {
    for (let n = 1; n <= 12; n++) {
      expect(getGrundbedarf(n)).toBe(grundbedarfFuerHaushalt(n));
    }
  });
});

describe('calculateSozialhilfe — Vermögensfreibetrag (SKOS C.7)', () => {
  // Minimal valid data; only the fields the Vermögen logic reads matter here.
  const calc = (overrides = {}) => calculateSozialhilfe({
    basis: { canton: 'ZH' },
    finanzen: {},
    wohnen: {},
    versicherungen: {},
    ...overrides,
  });

  it('grants a CHF 4000 allowance for a single person', () => {
    expect(calc().vermoegensfreibetrag).toBe(4000);
  });

  it('adds CHF 2000 allowance per additional household member', () => {
    const couple = calc({ basis: { canton: 'ZH', household: { adults: 2, children: [] } } });
    expect(couple.vermoegensfreibetrag).toBe(6000); // 4000 + 1×2000

    const family = calc({ basis: { canton: 'ZH', household: { adults: 2, children: [{ age: 4 }, { age: 8 }] } } });
    expect(family.vermoegensfreibetrag).toBe(10000); // householdSize 4 → 4000 + 3×2000
  });

  it('sums securities + otherAssets + savingsAccount into Vermögen', () => {
    const r = calc({ finanzen: { securitiesValue: 10000, otherAssets: 5000, savingsAccount: 3000 } });
    expect(r.vermoegen).toBe(18000);
  });

  it('reports the excess above the allowance', () => {
    const r = calc({ finanzen: { securitiesValue: 20000 } }); // single → allowance 4000
    expect(r.vermoegenUeberFreibetrag).toBe(16000);
  });

  it('reports no excess when assets stay within the allowance', () => {
    expect(calc({ finanzen: { savingsAccount: 3000 } }).vermoegenUeberFreibetrag).toBe(0);
  });

  it('parses string asset values (as stored from form inputs)', () => {
    expect(calc({ finanzen: { securitiesValue: '20000' } }).vermoegen).toBe(20000);
  });

  it('treats missing or non-numeric asset fields as zero', () => {
    const r = calc({ finanzen: { securitiesValue: '', otherAssets: undefined } });
    expect(r.vermoegen).toBe(0);
    expect(r.vermoegenUeberFreibetrag).toBe(0);
  });
});
