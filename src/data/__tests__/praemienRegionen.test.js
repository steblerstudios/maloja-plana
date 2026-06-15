import { describe, it, expect } from 'vitest';
import { getRegion, getAveragePremium, getRegionInfo, PRAEMIEN_DATA_VERSION } from '../praemienRegionen.js';

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

  describe('metadata', () => {
    it('has correct data version', () => {
      expect(PRAEMIEN_DATA_VERSION).toBe('2026');
    });
  });
});
