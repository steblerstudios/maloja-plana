import { describe, it, expect } from 'vitest';
import {
  kantonHatMindestlohn,
  getMindestlohn,
  pruefeLohn,
  pruefeStundenlohn,
  reduzierterBoden13,
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

  // Der 13. Monatslohn zählt an den Mindestlohn (Jahres-Boden) — amtlich belegt für alle
  // fünf Kantone. Referenz: reference_mindestlohn_13_monatslohn_kantone.
  describe('13. Monatslohn (reduzierter Boden ×12/13)', () => {
    it('reduzierterBoden13 deckt sich mit den publizierten GE/NE-Sätzen', () => {
      expect(reduzierterBoden13(24.59)).toBe(22.70); // GE 2026
      expect(reduzierterBoden13(21.35)).toBe(19.71); // NE 2026
    });

    it('GE, 13., brutto, Basislohn zwischen reduziertem und vollem Boden → konformMit13', () => {
      // 4000 / 173.3h ≈ 23.08/Std.: über 22.70 (reduziert), unter 24.59 (voll).
      const r = pruefeStundenlohn(4000, 40, 'GE', 'brutto', 'yes');
      expect(r.status).toBe('konformMit13');
      expect(r.reduzierterBoden).toBe(22.70);
      expect(r.mindestStunde).toBe(24.59);
    });

    it('ohne 13. ist derselbe Lohn eine Unterschreitung (Falsch-Alarm-Umkehr)', () => {
      const r = pruefeStundenlohn(4000, 40, 'GE', 'brutto');
      expect(r.status).toBe('unterMindestlohn');
    });

    it('konformMit13 gilt unabhängig von der Basis (netto ≥ reduziert ⇒ brutto erst recht)', () => {
      const r = pruefeStundenlohn(4000, 40, 'GE', 'netto', 'ja');
      expect(r.status).toBe('konformMit13');
    });

    it('mit 13., aber unter dem reduzierten Boden, brutto → weiterhin Unterschreitung', () => {
      // 3500 / 173.3h ≈ 20.20/Std. < 22.70 (reduziert).
      const r = pruefeStundenlohn(3500, 40, 'GE', 'brutto', 'yes');
      expect(r.status).toBe('unterMindestlohn');
      // Fehlbetrag gegen den reduzierten Boden gerechnet (der maßgebliche Basis-Boden mit 13.).
      expect(r.mindestMonat).toBe(Math.round(22.70 * r.stundenMonat));
      expect(r.differenzMonat).toBe(Math.round(22.70 * r.stundenMonat - 3500));
    });

    it('mit 13. unter reduziertem Boden, netto → basisUnklar (keine Falschanschuldigung)', () => {
      const r = pruefeStundenlohn(3500, 40, 'GE', 'netto', 'yes');
      expect(r.status).toBe('basisUnklar');
    });

    it('über dem vollen Boden ist der 13. irrelevant → ok', () => {
      expect(pruefeStundenlohn(4500, 40, 'GE', 'brutto', 'yes').status).toBe('ok');
      expect(pruefeStundenlohn(4500, 40, 'GE', 'brutto').status).toBe('ok');
    });
  });
});
