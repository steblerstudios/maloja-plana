import { describe, it, expect } from 'vitest';
import { lookupPLZ, primaryGemeinde, cantonFromPLZPrecise, allPLZ, searchPLZ } from '../plzGemeinde.js';

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

  describe('searchPLZ', () => {
    it('matches by PLZ prefix and returns full entry', () => {
      const r = searchPLZ('8001', 5);
      expect(r.length).toBeGreaterThan(0);
      expect(r[0]).toMatchObject({ plz: '8001', gemeinde: 'Zürich', kanton: 'ZH' });
    });

    it('matches by Gemeinde name (case-insensitive)', () => {
      const r = searchPLZ('basel', 5);
      expect(r.length).toBeGreaterThan(0);
      expect(r.every(x => x.gemeinde.toLowerCase().includes('basel'))).toBe(true);
      expect(r[0].kanton).toBe('BS');
    });

    it('respects the limit', () => {
      expect(searchPLZ('80', 3).length).toBeLessThanOrEqual(3);
    });

    it('returns empty for too-short or empty/null/undefined query', () => {
      expect(searchPLZ('8')).toEqual([]);
      expect(searchPLZ('')).toEqual([]);
      expect(searchPLZ(null)).toEqual([]);
      expect(searchPLZ(undefined)).toEqual([]);
    });

    it('trims surrounding whitespace', () => {
      const r = searchPLZ('  8001  ', 5);
      expect(r.some((x) => x.plz === '8001')).toBe(true);
    });

    it('returns [] for numeric queries longer than a PLZ (no 5-digit PLZ)', () => {
      expect(searchPLZ('80011')).toEqual([]);
    });

    it('numeric prefix only matches PLZ starting with it', () => {
      const r = searchPLZ('80', 50);
      expect(r.length).toBeGreaterThan(0);
      expect(r.every((x) => x.plz.startsWith('80'))).toBe(true);
    });

    it('returns every Gemeinde for an ambiguous PLZ', () => {
      const names = searchPLZ('1008', 8).map((x) => x.gemeinde);
      expect(names).toContain('Prilly');
      expect(names).toContain('Jouxtens-Mézery');
    });

    it('returns [] when nothing matches', () => {
      expect(searchPLZ('Qwertzuiopxyz', 5)).toEqual([]);
    });

    it('every result carries plz, gemeinde, bfsNr, kanton', () => {
      const r = searchPLZ('300', 5);
      expect(r.length).toBeGreaterThan(0);
      for (const x of r) {
        expect(typeof x.plz).toBe('string');
        expect(typeof x.gemeinde).toBe('string');
        expect(typeof x.bfsNr).toBe('string');
        expect(typeof x.kanton).toBe('string');
      }
    });
  });
});
