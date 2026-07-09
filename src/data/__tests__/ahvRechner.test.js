import { describe, it, expect } from 'vitest';
import {
  berechneAltersrente, vergleicheVorbezugAufschub,
  bvgKoordinationsabzug, berechneBVGGuthaben, projiziereVorsorge,
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
      expect(r.jahresrente).toBe(32760); // 13 Auszahlungen ab 2026 (2520 × 13)
      expect(r.dreizehnteRente).toBe(2520);
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

    it('nutzt den PK-eigenen Umwandlungssatz, wenn plausibel angegeben', () => {
      const base = { alter: 40, jahresbruttolohn: 80000, aktuellesGuthaben: 200000 };
      const min = berechneBVGGuthaben(base);
      const eigen = berechneBVGGuthaben({ ...base, umwandlungssatz: 5.2 });
      expect(eigen.umwandlungssatz).toBe(5.2);
      expect(eigen.jahresrente).toBe(Math.round(eigen.guthaben * 5.2 / 100));
      // Tieferer Satz → tiefere Rente bei gleichem Guthaben.
      expect(eigen.monatsrente).toBeLessThan(min.monatsrente);
    });

    it('fällt bei unplausiblem Umwandlungssatz ruhig auf den Mindestsatz zurück', () => {
      const base = { alter: 40, jahresbruttolohn: 80000, aktuellesGuthaben: 200000 };
      expect(berechneBVGGuthaben({ ...base, umwandlungssatz: 0 }).umwandlungssatz).toBe(6.8);
      expect(berechneBVGGuthaben({ ...base, umwandlungssatz: 42 }).umwandlungssatz).toBe(6.8);
      expect(berechneBVGGuthaben({ ...base, umwandlungssatz: NaN }).umwandlungssatz).toBe(6.8);
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

  describe('projiziereVorsorge', () => {
    it('Zeitachse hat n+1 Punkte (heute + je ein Jahr bis Rücktritt)', () => {
      const r = projiziereVorsorge({ alter: 40, austrittsalter: 65 });
      expect(r.timeline.length).toBe(26);
      expect(r.timeline[0].alter).toBe(40);
      expect(r.timeline[25].alter).toBe(65);
    });

    it('Startpunkt (t=0) spiegelt die heutigen Guthaben', () => {
      const r = projiziereVorsorge({ alter: 50, austrittsalter: 65, bvgHeute: 50000, s3aBalance: 20000, s3bBalance: 5000 });
      expect(r.timeline[0]).toMatchObject({ bvg: 50000, s3a: 20000, s3b: 5000, total: 75000 });
      expect(r.startsumme.total).toBe(75000);
    });

    it('Rendite 0 % → linearer Aufbau (Bestand + n·Beitrag)', () => {
      const r = projiziereVorsorge({ alter: 60, austrittsalter: 65, s3aBalance: 20000, s3aAnnual: 1000, s3aRendite: 0 });
      // 5 Jahre × 1000 auf 20000
      expect(r.endsumme.s3a).toBe(25000);
    });

    it('Beitrag 0 → reiner Zinseszins', () => {
      const r = projiziereVorsorge({ alter: 62, austrittsalter: 65, s3aBalance: 10000, s3aAnnual: 0, s3aRendite: 2 });
      // 10000 · 1.02^3 = 10612.08 → jährlich gerundet 10612
      expect(r.endsumme.s3a).toBe(10612);
    });

    it('Zins auf Anfangsbestand, Beitrag danach (Konvention wie BVG)', () => {
      const r = projiziereVorsorge({ alter: 64, austrittsalter: 65, s3aBalance: 10000, s3aAnnual: 5000, s3aRendite: 1 });
      // Jahr 1: 10000 + 100 (Zins) + 5000 = 15100
      expect(r.timeline[1].s3a).toBe(15100);
    });

    it('BVG-Reihe wird jahresweise durchgereicht', () => {
      const r = projiziereVorsorge({ alter: 62, austrittsalter: 65, bvgHeute: 40000, bvgSerie: [50000, 60000, 70000] });
      expect(r.timeline[0].bvg).toBe(40000);
      expect(r.timeline[1].bvg).toBe(50000);
      expect(r.timeline[3].bvg).toBe(70000);
      expect(r.endsumme.bvg).toBe(70000);
    });

    it('startjahr steuert die Jahreszahlen', () => {
      const r = projiziereVorsorge({ alter: 40, austrittsalter: 42, startjahr: 2026 });
      expect(r.timeline[0].jahr).toBe(2026);
      expect(r.endsumme.jahr).toBe(2028);
    });

    it('total ist immer die Summe der drei Säulen', () => {
      const r = projiziereVorsorge({ alter: 45, austrittsalter: 65, bvgHeute: 30000, bvgSerie: [], s3aBalance: 10000, s3aAnnual: 3000, s3bBalance: 2000, s3bAnnual: 500 });
      for (const p of r.timeline) {
        expect(p.total).toBe(p.bvg + p.s3a + p.s3b);
      }
    });
  });
});
