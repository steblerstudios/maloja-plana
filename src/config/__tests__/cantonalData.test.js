import { describe, it, expect } from 'vitest';
import { SKOS_GRUNDBEDARF, getGrundbedarf } from '../cantonalData.js';
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
