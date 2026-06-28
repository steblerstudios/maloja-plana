import { describe, it, expect } from 'vitest';
import { SKOS_GRUNDBEDARF, getGrundbedarf, calculateSozialhilfe, calculateIPV, checkELEligibility, CANTONAL_IPV } from '../cantonalData.js';
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

  it('follows the tiered SKOS C.7 schedule (8000 couple, +2000 per minor child, max 10000)', () => {
    const couple = calc({ basis: { canton: 'ZH', household: { adults: 2, children: [] } } });
    expect(couple.vermoegensfreibetrag).toBe(8000); // Paar → 8000

    const coupleOneChild = calc({ basis: { canton: 'ZH', household: { adults: 2, children: [{ age: 4 }] } } });
    expect(coupleOneChild.vermoegensfreibetrag).toBe(10000); // 8000 + 1×2000

    const family = calc({ basis: { canton: 'ZH', household: { adults: 2, children: [{ age: 4 }, { age: 8 }] } } });
    expect(family.vermoegensfreibetrag).toBe(10000); // 8000 + 2×2000 → gedeckelt bei 10000
  });

  it('counts only minor children toward the SKOS C.7 allowance', () => {
    const adultChild = calc({ basis: { canton: 'ZH', household: { adults: 2, children: [{ age: 20 }] } } });
    expect(adultChild.vermoegensfreibetrag).toBe(8000); // volljähriges Kind zählt nicht
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

describe('calculateIPV — kantonale Prämienverbilligung', () => {
  // Tests reference the canonical CANTONAL_IPV table (no duplicated magic numbers),
  // so they verify the model — not a snapshot of yearly-updated figures.
  const zh = CANTONAL_IPV.ZH;
  const ipv = (overrides = {}) => calculateIPV({
    basis: { canton: 'ZH' },
    finanzen: {},
    ...overrides,
  });

  it('returns not eligible for an unknown canton', () => {
    const r = calculateIPV({ basis: { canton: 'XX' }, finanzen: {} });
    expect(r.eligible).toBe(false);
    expect(r.amount).toBe(0);
    expect(r.noteKey).toBe('ipv.cantonUnknown');
  });

  it('grants the full single subsidy at zero income', () => {
    const r = ipv({ finanzen: { monthlyIncome: 0 } });
    expect(r.eligible).toBe(true);
    expect(r.reductionPercent).toBe(100);
    expect(r.maxAnnual).toBe(zh.subsidySingle);
    expect(r.annual).toBe(zh.subsidySingle);
    expect(r.amount).toBe(Math.round(zh.subsidySingle / 12));
  });

  it('uses the family subsidy plus per-child amount when children are present', () => {
    const r = ipv({
      basis: { canton: 'ZH', household: { adults: 1, children: [{ age: 5 }, { age: 8 }] } },
      finanzen: { monthlyIncome: 0 },
    });
    expect(r.maxAnnual).toBe(zh.subsidyFamily + 2 * zh.subsidyChild);
  });

  it('is not eligible when annual income exceeds the cantonal limit', () => {
    const overLimit = Math.ceil(zh.maxIncome / 12) + 100; // monthly → annual clearly above maxIncome
    const r = ipv({ finanzen: { monthlyIncome: overLimit } });
    expect(r.eligible).toBe(false);
    expect(r.noteKey).toBe('ipv.incomeAboveLimit');
    expect(r.noteParams.value).toBe(zh.maxIncome);
  });

  it('decays monotonically: higher income → lower subsidy', () => {
    const low = ipv({ finanzen: { monthlyIncome: 1000 } });
    const high = ipv({ finanzen: { monthlyIncome: 3000 } });
    expect(low.eligible).toBe(true);
    expect(high.eligible).toBe(true);
    expect(low.amount).toBeGreaterThan(high.amount);
  });

  it('counts partner income towards the income limit', () => {
    // single monthly income alone is well within the limit, partner income pushes it over
    const r = ipv({ basis: { canton: 'ZH', household: { adults: 2, partnerIncome: 4000 } }, finanzen: { monthlyIncome: 1000 } });
    expect(r.eligible).toBe(false); // (1000 + 4000) × 12 = 60000 > 54900
  });
});

describe('checkELEligibility — Ergänzungsleistungen', () => {
  const el = (overrides = {}) => checkELEligibility({
    basis: {},
    finanzen: {},
    wohnen: {},
    versicherungen: {},
    ...overrides,
  });

  it('is never eligible without an AHV or IV pension', () => {
    const r = el({ finanzen: { monthlyIncome: 0 }, wohnen: { rentAmount: 2000 } });
    expect(r.isAHVIV).toBe(false);
    expect(r.eligible).toBe(false);
    expect(r.noteKey).toBe('elCalc.onlyAhvIv');
  });

  it('is possible with an AHV pension and a gap below the threshold', () => {
    const r = el({ finanzen: { ahvRente: 1500 }, wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 400 } });
    expect(r.isAHVIV).toBe(true);
    expect(r.totalIncome).toBe(1500);
    expect(r.totalExpenses).toBe(1600);
    expect(r.eligible).toBe(true); // 1500 < 1600 + 2000
    expect(r.noteKey).toBe('elCalc.possible');
  });

  it('also recognises an IV pension', () => {
    const r = el({ finanzen: { ivRente: 1400 }, wohnen: { rentAmount: 1000 }, versicherungen: { kkPremium: 350 } });
    expect(r.isAHVIV).toBe(true);
    expect(r.eligible).toBe(true);
  });

  it('is not eligible when income clears expenses plus the CHF 2000 buffer', () => {
    const r = el({ finanzen: { ahvRente: 6000 }, wohnen: { rentAmount: 1000 }, versicherungen: { kkPremium: 300 } });
    expect(r.isAHVIV).toBe(true);
    expect(r.eligible).toBe(false); // 6000 >= 1300 + 2000
  });

  it('counts partner income in totalIncome', () => {
    const r = el({ basis: { household: { adults: 2, partnerIncome: 1000 } }, finanzen: { ahvRente: 1000 } });
    expect(r.totalIncome).toBe(2000); // (0 + 1000 partner) + 1000 AHV
  });
});
