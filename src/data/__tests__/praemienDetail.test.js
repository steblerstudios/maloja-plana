import { describe, it, expect } from 'vitest';
import {
  getInsurerPremium, getInsurerAllFranchises, getInsurerCantons,
  insurerNameFromNr, insurerNrFromName, allInsurerNrs,
  ERW_FRA, KIN_FRA, DETAIL_DATA_VERSION
} from '../praemienDetail.js';

describe('praemienDetail', () => {
  describe('franchise constants', () => {
    it('has correct ERW franchises', () => {
      expect(ERW_FRA).toEqual([300, 500, 1000, 1500, 2000, 2500]);
    });

    it('has correct KIN franchises', () => {
      expect(KIN_FRA).toEqual([0, 100, 200, 300, 400, 500, 600]);
    });
  });

  describe('insurerNameFromNr / insurerNrFromName', () => {
    it('maps CSS correctly', () => {
      expect(insurerNameFromNr(8)).toBe('CSS');
      expect(insurerNrFromName('CSS')).toBe(8);
    });

    it('maps Helsana correctly', () => {
      expect(insurerNameFromNr(1562)).toBe('Helsana');
      expect(insurerNrFromName('Helsana')).toBe(1562);
    });

    it('finds by partial name match', () => {
      expect(insurerNrFromName('Swica')).toBe(1384);
    });

    it('returns null for unknown', () => {
      expect(insurerNameFromNr(99999)).toBeNull();
      expect(insurerNrFromName('Unknown')).toBeNull();
    });
  });

  describe('allInsurerNrs', () => {
    it('returns 34 insurer numbers', () => {
      const nrs = allInsurerNrs();
      expect(nrs.length).toBe(34);
      expect(nrs).toContain(8); // CSS
      expect(nrs).toContain(1562); // Helsana
    });
  });

  describe('getInsurerCantons', () => {
    it('returns cantons for CSS', () => {
      const cantons = getInsurerCantons(8);
      expect(cantons.length).toBe(26);
      expect(cantons).toContain('ZH');
      expect(cantons).toContain('BE');
    });

    it('returns empty for invalid insurer', () => {
      expect(getInsurerCantons(99999)).toEqual([]);
    });
  });

  describe('getInsurerPremium', () => {
    it('returns premium for CSS ZH region 1 adult franchise 300', () => {
      const premium = getInsurerPremium(8, 'ZH', 1, 'erwachsen', 300);
      expect(premium).toBeTypeOf('number');
      expect(premium).toBeGreaterThan(400);
      expect(premium).toBeLessThan(900);
    });

    it('returns premium for CSS ZH region 1 young franchise 2500', () => {
      const premium = getInsurerPremium(8, 'ZH', 1, 'jung', 2500);
      expect(premium).toBeTypeOf('number');
      expect(premium).toBeGreaterThan(100);
    });

    it('returns premium for CSS ZH region 1 child franchise 0', () => {
      const premium = getInsurerPremium(8, 'ZH', 1, 'kind', 0);
      expect(premium).toBeTypeOf('number');
      expect(premium).toBeGreaterThan(50);
    });

    it('higher franchise means lower premium', () => {
      const p300 = getInsurerPremium(8, 'ZH', 1, 'erwachsen', 300);
      const p2500 = getInsurerPremium(8, 'ZH', 1, 'erwachsen', 2500);
      expect(p300).toBeGreaterThan(p2500);
    });

    it('returns null for invalid insurer', () => {
      expect(getInsurerPremium(99999, 'ZH', 1, 'erwachsen', 300)).toBeNull();
    });

    it('returns null for invalid canton/region combo', () => {
      expect(getInsurerPremium(8, 'XX', 0, 'erwachsen', 300)).toBeNull();
    });

    it('returns null for invalid franchise', () => {
      expect(getInsurerPremium(8, 'ZH', 1, 'erwachsen', 999)).toBeNull();
    });
  });

  describe('getInsurerAllFranchises', () => {
    it('returns all franchise options for CSS ZH adult', () => {
      const franchises = getInsurerAllFranchises(8, 'ZH', 1, 'erwachsen');
      expect(franchises).not.toBeNull();
      expect(franchises.length).toBeGreaterThanOrEqual(5);
      franchises.forEach(f => {
        expect(f).toHaveProperty('franchise');
        expect(f).toHaveProperty('premium');
        expect(f.premium).toBeGreaterThan(0);
      });
    });

    it('returns sorted by franchise ascending', () => {
      const franchises = getInsurerAllFranchises(8, 'ZH', 1, 'erwachsen');
      for (let i = 1; i < franchises.length; i++) {
        expect(franchises[i].franchise).toBeGreaterThan(franchises[i - 1].franchise);
      }
    });

    it('returns null for invalid insurer', () => {
      expect(getInsurerAllFranchises(99999, 'ZH', 1, 'erwachsen')).toBeNull();
    });
  });

  describe('metadata', () => {
    it('has correct version', () => {
      expect(DETAIL_DATA_VERSION).toBe('2026');
    });
  });
});
