import { describe, it, expect } from 'vitest';
import { getRegion, getAveragePremium, getRegionInfo, getRegionalComparison, NATIONAL_AVG_PREMIUM, PRAEMIEN_DATA_VERSION } from '../praemienRegionen.js';

describe('praemienRegionen', () => {
  describe('getRegion', () => {
    it('returns region number for valid BFS-Nr', () => {
      const region = getRegion('261'); // Zürich
      expect(region).toBeTypeOf('number');
      expect(region).toBeGreaterThanOrEqual(0);
      expect(region).toBeLessThanOrEqual(3);
    });

    it('returns null for invalid BFS-Nr', () => {
      expect(getRegion('999999')).toBeNull();
      expect(getRegion('')).toBeNull();
    });
  });

  describe('getAveragePremium', () => {
    it('returns premium data for Zürich (BFS 261)', () => {
      const premium = getAveragePremium('261');
      expect(premium).not.toBeNull();
      expect(premium).toHaveProperty('kinder');
      expect(premium).toHaveProperty('junge');
      expect(premium).toHaveProperty('erwachsene');
      expect(premium).toHaveProperty('region');
      expect(premium).toHaveProperty('kanton');
      expect(premium.kanton).toBe('ZH');
      expect(premium.erwachsene).toBeGreaterThan(0);
    });

    it('returns null for invalid BFS-Nr', () => {
      expect(getAveragePremium('999999')).toBeNull();
    });
  });

  describe('getRegionInfo', () => {
    it('returns full info for Baar (BFS 1701)', () => {
      const info = getRegionInfo('1701');
      expect(info).not.toBeNull();
      expect(info.kanton).toBe('ZG');
      expect(info.gemeinde).toBe('Baar');
      expect(info.praemien.erwachsene).toBeGreaterThan(0);
    });

    it('returns null for invalid BFS-Nr', () => {
      expect(getRegionInfo('999999')).toBeNull();
    });
  });

  describe('getRegionalComparison', () => {
    it('compares Basel (BFS 2701) adult premium to the national average', () => {
      const c = getRegionalComparison('2701', '1990-01-01'); // adult
      expect(c).not.toBeNull();
      expect(c.kanton).toBe('BS');
      expect(c.ageKey).toBe('erwachsene');
      expect(c.national).toBe(NATIONAL_AVG_PREMIUM.erwachsene);
      // Basel is a high-premium city → clearly above the Swiss average
      expect(c.regional).toBeGreaterThan(c.national);
      expect(c.diffPct).toBeGreaterThan(0);
      // diffPct is the exact relative difference
      expect(c.diffPct).toBeCloseTo(((c.regional - c.national) / c.national) * 100, 5);
    });

    it('picks the age class from the birth date', () => {
      expect(getRegionalComparison('2701', '2015-01-01').ageKey).toBe('kinder');
      expect(getRegionalComparison('2701', '2004-01-01').ageKey).toBe('junge');
      expect(getRegionalComparison('2701', undefined).ageKey).toBe('erwachsene');
    });

    it('a low-premium canton lands below the national average', () => {
      const c = getRegionalComparison('3101', '1990-01-01'); // Appenzell (AI)
      expect(c.kanton).toBe('AI');
      expect(c.diffPct).toBeLessThan(0);
    });

    it('returns null for an unknown municipality', () => {
      expect(getRegionalComparison('999999', '1990-01-01')).toBeNull();
    });

    it('national anchor matches BAG mittlere Prämie 2026', () => {
      expect(NATIONAL_AVG_PREMIUM.erwachsene).toBe(465.3);
      expect(NATIONAL_AVG_PREMIUM.year).toBe(2026);
    });
  });

  describe('metadata', () => {
    it('has correct data version', () => {
      expect(PRAEMIEN_DATA_VERSION).toBe('2026');
    });
  });
});
