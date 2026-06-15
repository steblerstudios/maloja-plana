import { describe, it, expect } from 'vitest';
import {
  berechneMutterschaft, berechneVaterschaft, berechneAdoption,
  berechneBetreuung, vergleicheEOLeistungen,
  EO_PARAMS, EO_DATA_VERSION,
} from '../eoRechner.js';

describe('eoRechner', () => {
  describe('EO_PARAMS', () => {
    it('has correct 2026 values', () => {
      expect(EO_PARAMS.maxTaggeld).toBe(220);
      expect(EO_PARAMS.entschaedigungssatz).toBe(80);
      expect(EO_PARAMS.mutterschaftTage).toBe(98);
      expect(EO_PARAMS.vaterschaftTage).toBe(14);
      expect(EO_PARAMS.adoptionTage).toBe(14);
      expect(EO_PARAMS.betreuungMaxTage).toBe(14);
    });

    it('has correct version', () => {
      expect(EO_DATA_VERSION).toBe('2026');
    });
  });

  describe('berechneMutterschaft', () => {
    it('calculates 80% of income for 98 days', () => {
      const r = berechneMutterschaft({ jahreseinkommen: 80000 });
      expect(r.anspruch).toBe(true);
      expect(r.tage).toBe(98);
      expect(r.wochen).toBe(14);
      expect(r.taggeld).toBeGreaterThan(0);
      expect(r.totalEntschaedigung).toBeCloseTo(r.taggeld * 98, 1);
    });

    it('caps at maximum daily rate', () => {
      const r = berechneMutterschaft({ jahreseinkommen: 200000 });
      expect(r.taggeld).toBe(220);
      expect(r.istPlafoniert).toBe(true);
      expect(r.totalEntschaedigung).toBe(220 * 98);
    });

    it('returns no entitlement when not employed', () => {
      const r = berechneMutterschaft({ jahreseinkommen: 80000, erwerbstaetig: false });
      expect(r.anspruch).toBe(false);
      expect(r.grund).toBe('nicht_erwerbstaetig');
    });

    it('returns no entitlement for zero income', () => {
      const r = berechneMutterschaft({ jahreseinkommen: 0 });
      expect(r.anspruch).toBe(false);
    });

    it('shows monthly equivalent', () => {
      const r = berechneMutterschaft({ jahreseinkommen: 80000 });
      expect(r.monatsaequivalent).toBeCloseTo(r.taggeld * 30, 1);
    });
  });

  describe('berechneVaterschaft', () => {
    it('calculates 80% for 14 days', () => {
      const r = berechneVaterschaft({ jahreseinkommen: 80000 });
      expect(r.anspruch).toBe(true);
      expect(r.tage).toBe(14);
      expect(r.wochen).toBe(2);
      expect(r.fristMonate).toBe(6);
      expect(r.totalEntschaedigung).toBeCloseTo(r.taggeld * 14, 1);
    });

    it('caps at maximum', () => {
      const r = berechneVaterschaft({ jahreseinkommen: 200000 });
      expect(r.taggeld).toBe(220);
      expect(r.totalEntschaedigung).toBe(220 * 14);
    });
  });

  describe('berechneAdoption', () => {
    it('calculates 80% for 14 days', () => {
      const r = berechneAdoption({ jahreseinkommen: 60000 });
      expect(r.anspruch).toBe(true);
      expect(r.tage).toBe(14);
      expect(r.maxAlterKind).toBe(4);
    });
  });

  describe('berechneBetreuung', () => {
    it('calculates for max 14 days', () => {
      const r = berechneBetreuung({ jahreseinkommen: 80000 });
      expect(r.anspruch).toBe(true);
      expect(r.tage).toBe(14);
    });

    it('caps at max days even if more requested', () => {
      const r = berechneBetreuung({ jahreseinkommen: 80000, tage: 30 });
      expect(r.tage).toBe(14);
    });
  });

  describe('vergleicheEOLeistungen', () => {
    it('returns all four types', () => {
      const v = vergleicheEOLeistungen(80000);
      expect(v.mutterschaft.anspruch).toBe(true);
      expect(v.vaterschaft.anspruch).toBe(true);
      expect(v.adoption.anspruch).toBe(true);
      expect(v.betreuung.anspruch).toBe(true);
    });

    it('mutterschaft has highest total', () => {
      const v = vergleicheEOLeistungen(80000);
      expect(v.mutterschaft.totalEntschaedigung).toBeGreaterThan(v.vaterschaft.totalEntschaedigung);
    });

    it('same daily rate for all types', () => {
      const v = vergleicheEOLeistungen(80000);
      expect(v.mutterschaft.taggeld).toBe(v.vaterschaft.taggeld);
      expect(v.vaterschaft.taggeld).toBe(v.adoption.taggeld);
    });
  });
});
