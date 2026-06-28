import { describe, it, expect } from 'vitest';
import {
  berechneAltersrente, vergleicheVorbezugAufschub,
  bvgKoordinationsabzug, berechneBVGGuthaben,
  AHV_PARAMS, BVG_PARAMS, AHV_DATA_VERSION,
} from '../ahvRechner.js';

describe('ahvRechner', () => {
  describe('AHV_PARAMS', () => {
    it('has correct 2026 values', () => {
      expect(AHV_PARAMS.minRente).toBe(1260);
      expect(AHV_PARAMS.maxRente).toBe(2520);
      expect(AHV_PARAMS.maxEhepaar).toBe(3780);
      expect(AHV_PARAMS.referenzalter).toBe(65);
      expect(AHV_PARAMS.volleBeitragsjahre).toBe(44);
    });

    it('has correct version', () => {
      expect(AHV_DATA_VERSION).toBe('2026');
    });
  });

  describe('berechneAltersrente', () => {
    it('returns Maximalrente for high income and full contributions', () => {
      const r = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 90720,
        beitragsjahre: 44,
      });
      expect(r.monatsrente).toBe(2520);
      expect(r.jahresrente).toBe(30240);
      expect(r.skalenfaktor).toBe(1);
      expect(r.fehlendeBeitragsjahre).toBe(0);
    });

    it('returns Minimalrente for low income', () => {
      const r = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 15120,
        beitragsjahre: 44,
      });
      expect(r.monatsrente).toBe(1260);
    });

    it('scales down with fewer contribution years', () => {
      const full = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 60000,
        beitragsjahre: 44,
      });
      const partial = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 60000,
        beitragsjahre: 22,
      });
      expect(partial.monatsrente).toBeCloseTo(full.monatsrente * 0.5, 0);
      expect(partial.skalenfaktor).toBeCloseTo(0.5);
    });

    it('reduces pension for early withdrawal (Vorbezug)', () => {
      const normal = berechneAltersrente({
        geburtsjahr: 1963,
        durchschnittlichesJahreseinkommen: 80000,
        beitragsjahre: 44,
      });
      const early = berechneAltersrente({
        geburtsjahr: 1963,
        durchschnittlichesJahreseinkommen: 80000,
        beitragsjahre: 44,
        bezugAlter: 63,
      });
      expect(early.monatsrente).toBeLessThan(normal.monatsrente);
      expect(early.vorbezugAufschub).toBeLessThan(0);
    });

    it('increases pension for deferred withdrawal (Aufschub)', () => {
      const normal = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 80000,
        beitragsjahre: 44,
      });
      const deferred = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 80000,
        beitragsjahre: 44,
        bezugAlter: 68,
      });
      expect(deferred.monatsrente).toBeGreaterThan(normal.monatsrente);
      expect(deferred.vorbezugAufschub).toBeGreaterThan(0);
    });

    it('caps married couple pensions (Plafonierung)', () => {
      const r = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 90720,
        beitragsjahre: 44,
        verheiratet: true,
        einkommenPartner: 90720,
      });
      expect(r.plafoniert).toBe(true);
      expect(r.totalEhepaar).toBeLessThanOrEqual(3780);
    });

    it('adds Erziehungsgutschriften', () => {
      const ohne = berechneAltersrente({
        geburtsjahr: 1970,
        durchschnittlichesJahreseinkommen: 50000,
        beitragsjahre: 44,
      });
      const mit = berechneAltersrente({
        geburtsjahr: 1970,
        durchschnittlichesJahreseinkommen: 50000,
        beitragsjahre: 44,
        erziehungsjahre: 16,
      });
      expect(mit.monatsrente).toBeGreaterThan(ohne.monatsrente);
      expect(mit.erziehungsgutschrift).toBeGreaterThan(0);
    });

    it('returns zero for zero income', () => {
      const r = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 0,
        beitragsjahre: 44,
      });
      expect(r.monatsrente).toBe(0);
    });
  });

  describe('vergleicheVorbezugAufschub', () => {
    it('returns comparison for ages 63–70', () => {
      const vergleich = vergleicheVorbezugAufschub(80000, 44);
      expect(vergleich.length).toBe(8);
      expect(vergleich[0].bezugAlter).toBe(63);
      expect(vergleich[vergleich.length - 1].bezugAlter).toBe(70);

      // Each later age should have higher pension
      for (let i = 1; i < vergleich.length; i++) {
        expect(vergleich[i].monatsrente).toBeGreaterThan(vergleich[i - 1].monatsrente);
      }
    });
  });

  describe('bvgKoordinationsabzug', () => {
    it('returns not insured below threshold', () => {
      const r = bvgKoordinationsabzug(20000);
      expect(r.versichert).toBe(false);
    });

    it('calculates coordinated salary', () => {
      const r = bvgKoordinationsabzug(80000);
      expect(r.versichert).toBe(true);
      expect(r.koordinierterLohn).toBe(80000 - 26460);
      expect(r.koordinationsabzug).toBe(26460);
    });

    it('caps at maximum', () => {
      const r = bvgKoordinationsabzug(200000);
      expect(r.koordinierterLohn).toBe(64260);
    });
  });

  describe('berechneBVGGuthaben', () => {
    it('returns not insured below threshold', () => {
      const r = berechneBVGGuthaben({ alter: 25, jahresbruttolohn: 15000 });
      expect(r.versichert).toBe(false);
    });

    it('calculates pension accumulation', () => {
      const r = berechneBVGGuthaben({
        alter: 25,
        jahresbruttolohn: 80000,
        aktuellesGuthaben: 0,
        austrittsalter: 65,
      });
      expect(r.versichert).toBe(true);
      expect(r.guthaben).toBeGreaterThan(100000);
      expect(r.monatsrente).toBeGreaterThan(0);
      expect(r.umwandlungssatz).toBe(6.8);
      expect(r.jahresDetail.length).toBe(40);
    });

    it('uses correct contribution rates by age', () => {
      const r = berechneBVGGuthaben({
        alter: 25,
        jahresbruttolohn: 80000,
        austrittsalter: 65,
      });
      expect(r.jahresDetail[0].gutschriftSatz).toBe(7);  // age 25
      expect(r.jahresDetail[10].gutschriftSatz).toBe(10); // age 35
      expect(r.jahresDetail[20].gutschriftSatz).toBe(15); // age 45
      expect(r.jahresDetail[30].gutschriftSatz).toBe(18); // age 55
    });

    it('includes existing balance', () => {
      const ohne = berechneBVGGuthaben({ alter: 40, jahresbruttolohn: 80000 });
      const mit = berechneBVGGuthaben({ alter: 40, jahresbruttolohn: 80000, aktuellesGuthaben: 100000 });
      expect(mit.guthaben).toBeGreaterThan(ohne.guthaben + 100000); // wegen Zinseszins
    });
  });

  describe('BVG_PARAMS', () => {
    it('has correct 2026 values', () => {
      expect(BVG_PARAMS.mindestzins).toBe(1.25);
      expect(BVG_PARAMS.umwandlungssatz).toBe(6.8);
      expect(BVG_PARAMS.eintrittsschwelle).toBe(22680);
      expect(BVG_PARAMS.koordinationsabzug).toBe(26460);
      expect(BVG_PARAMS.gutschriften.length).toBe(4);
    });
  });
});
