import { describe, it, expect } from 'vitest';
import { getAllInsurers, searchInsurers, getInsurerInfo, INSURER_COUNT } from '../versichererListe.js';

describe('versichererListe', () => {
  describe('getAllInsurers', () => {
    it('returns all insurer names', () => {
      const insurers = getAllInsurers();
      expect(insurers.length).toBe(INSURER_COUNT);
      expect(insurers).toContain('CSS');
      expect(insurers).toContain('Helsana');
      expect(insurers).toContain('SWICA');
      expect(insurers).toContain('Sanitas');
    });

    it('returns strings', () => {
      const insurers = getAllInsurers();
      insurers.forEach(name => expect(name).toBeTypeOf('string'));
    });
  });

  describe('searchInsurers', () => {
    it('finds CSS', () => {
      const results = searchInsurers('CSS');
      expect(results).toContain('CSS');
    });

    it('finds case-insensitive', () => {
      const results = searchInsurers('css');
      expect(results).toContain('CSS');
    });

    it('finds partial match', () => {
      const results = searchInsurers('Helsa');
      expect(results).toContain('Helsana');
    });

    it('returns empty for short query', () => {
      expect(searchInsurers('C')).toEqual([]);
      expect(searchInsurers('')).toEqual([]);
    });

    it('returns empty for no match', () => {
      expect(searchInsurers('XXXXXX')).toEqual([]);
    });
  });

  describe('getInsurerInfo', () => {
    it('returns info for CSS', () => {
      const info = getInsurerInfo('CSS');
      expect(info).not.toBeNull();
      expect(info.nr).toBe(8);
      expect(info.name).toBe('CSS');
      expect(info.ort).toContain('Luzern');
    });

    it('returns null for unknown insurer', () => {
      expect(getInsurerInfo('Unknown Insurance Co')).toBeNull();
    });
  });

  describe('metadata', () => {
    it('has 34 insurers', () => {
      expect(INSURER_COUNT).toBe(34);
    });
  });
});
