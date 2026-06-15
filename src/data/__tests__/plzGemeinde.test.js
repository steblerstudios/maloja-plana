import { describe, it, expect } from 'vitest';
import { lookupPLZ, primaryGemeinde, cantonFromPLZPrecise, allPLZ } from '../plzGemeinde.js';

describe('plzGemeinde', () => {
  describe('lookupPLZ', () => {
    it('returns Gemeinden for valid PLZ', () => {
      const results = lookupPLZ('8001');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('gemeinde');
      expect(results[0]).toHaveProperty('bfsNr');
      expect(results[0]).toHaveProperty('kanton');
    });

    it('returns Zürich for PLZ 8001', () => {
      const results = lookupPLZ('8001');
      expect(results[0].gemeinde).toBe('Zürich');
      expect(results[0].kanton).toBe('ZH');
    });

    it('returns Lausanne for PLZ 1000', () => {
      const results = lookupPLZ('1000');
      expect(results[0].gemeinde).toBe('Lausanne');
      expect(results[0].kanton).toBe('VD');
    });

    it('returns multiple Gemeinden for PLZ 6340', () => {
      const results = lookupPLZ('6340');
      expect(results.length).toBeGreaterThan(1);
      const names = results.map(r => r.gemeinde);
      expect(names).toContain('Baar');
      const cantons = results.map(r => r.kanton);
      expect(cantons).toContain('ZG');
      expect(cantons).toContain('ZH');
    });

    it('returns empty array for invalid PLZ', () => {
      expect(lookupPLZ('0000')).toEqual([]);
      expect(lookupPLZ('9999')).toEqual([]);
      expect(lookupPLZ('')).toEqual([]);
    });

    it('handles string and number input', () => {
      const a = lookupPLZ('8001');
      const b = lookupPLZ(8001);
      expect(a).toEqual(b);
    });
  });

  describe('primaryGemeinde', () => {
    it('returns first Gemeinde for single-Gemeinde PLZ', () => {
      const result = primaryGemeinde('8001');
      expect(result).not.toBeNull();
      expect(result.gemeinde).toBe('Zürich');
    });

    it('returns highest-Adressenanteil Gemeinde for multi-Gemeinde PLZ', () => {
      const result = primaryGemeinde('6340');
      expect(result).not.toBeNull();
      expect(result.gemeinde).toBe('Baar');
    });

    it('returns null for invalid PLZ', () => {
      expect(primaryGemeinde('0000')).toBeNull();
    });
  });

  describe('cantonFromPLZPrecise', () => {
    it('returns correct canton', () => {
      expect(cantonFromPLZPrecise('8001')).toBe('ZH');
      expect(cantonFromPLZPrecise('1000')).toBe('VD');
      expect(cantonFromPLZPrecise('3004')).toBe('BE');
    });

    it('returns null for invalid PLZ', () => {
      expect(cantonFromPLZPrecise('0000')).toBeNull();
    });
  });

  describe('allPLZ', () => {
    it('returns array of PLZ strings', () => {
      const plzs = allPLZ();
      expect(plzs.length).toBeGreaterThan(3000);
      expect(plzs).toContain('8001');
      expect(plzs).toContain('1000');
    });
  });
});
