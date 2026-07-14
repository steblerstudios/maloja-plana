import { describe, it, expect } from 'vitest';
import {
  kantonHatMindestlohn,
  getMindestlohn,
  pruefeLohn,
  alleMindestlohnKantone,
  LOHNCHECK_DATA_VERSION,
} from '../lohnCheck.js';

describe('lohnCheck', () => {
  describe('kantonHatMindestlohn', () => {
    it('returns true for GE, NE, JU, BS, TI', () => {
      expect(kantonHatMindestlohn('GE')).toBe(true);
      expect(kantonHatMindestlohn('NE')).toBe(true);
      expect(kantonHatMindestlohn('JU')).toBe(true);
      expect(kantonHatMindestlohn('BS')).toBe(true);
      expect(kantonHatMindestlohn('TI')).toBe(true);
    });

    it('returns false for cantons without minimum wage', () => {
      expect(kantonHatMindestlohn('ZH')).toBe(false);
      expect(kantonHatMindestlohn('BE')).toBe(false);
      expect(kantonHatMindestlohn('AG')).toBe(false);
    });
  });

  describe('getMindestlohn', () => {
    it('returns data for GE', () => {
      const ge = getMindestlohn('GE');
      expect(ge.chfStunde).toBe(24.59);
      expect(ge.indexiert).toBe(true);
    });

    it('returns data for NE (2026 indexed value)', () => {
      const ne = getMindestlohn('NE');
      expect(ne.chfStunde).toBe(21.35);
      expect(ne.indexiert).toBe(true);
      expect(ne.jahr).toBe(2026);
    });

    it('returns null for unknown canton', () => {
      expect(getMindestlohn('ZH')).toBeNull();
      expect(getMindestlohn('XX')).toBeNull();
    });
  });

  describe('pruefeLohn', () => {
    it('detects salary below minimum in GE', () => {
      const r = pruefeLohn(3500, 'GE');
      expect(r.status).toBe('unterMindestlohn');
      expect(r.mindestStunde).toBe(24.59);
      expect(r.differenzMonat).toBeGreaterThan(0);
      expect(r.jahr).toBe(2026);
    });

    it('returns ok for salary above minimum in GE', () => {
      const r = pruefeLohn(5000, 'GE');
      expect(r.status).toBe('ok');
    });

    it('returns keinGesetz for cantons without minimum wage', () => {
      const r = pruefeLohn(3000, 'ZH');
      expect(r.status).toBe('keinGesetz');
    });

    it('calculates hourly rate correctly', () => {
      const r = pruefeLohn(5460, 'GE');
      expect(r.lohnStunde).toBe(30);
    });

    it('handles edge case at exactly minimum wage', () => {
      const mindestMonat = 24.59 * 182;
      const r = pruefeLohn(mindestMonat, 'GE');
      expect(r.status).toBe('ok');
    });

    it('handles BS minimum wage', () => {
      const r = pruefeLohn(3000, 'BS');
      expect(r.status).toBe('unterMindestlohn');
      expect(r.mindestStunde).toBe(22.20);
    });

    it('handles TI minimum wage', () => {
      const r = pruefeLohn(4000, 'TI');
      expect(r.status).toBe('ok');
    });
  });

  describe('alleMindestlohnKantone', () => {
    it('returns 5 cantons', () => {
      const alle = alleMindestlohnKantone();
      expect(alle).toHaveLength(5);
    });

    it('includes monatBrutto for each', () => {
      const alle = alleMindestlohnKantone();
      alle.forEach(k => {
        expect(k.monatBrutto).toBeGreaterThan(0);
        expect(k.kanton).toBeTruthy();
      });
    });
  });

  it('has a data version', () => {
    expect(LOHNCHECK_DATA_VERSION).toBe('2026');
  });
});
