import { describe, it, expect } from 'vitest';
import {
  bundKapitalsteuer,
  kantonKapitalsteuer,
  berechneKapitalbezug,
  kapitalsteuerBandbreite,
  vergleicheStaffelung,
  alleKapitalKantone,
  KAPITAL_DATA_VERSION,
} from '../kapitalbezugSteuer.js';
import { bundessteuerAlleinstehend, bundessteuerVerheiratet } from '../steuerRechner.js';

describe('kapitalbezugSteuer', () => {
  describe('bundKapitalsteuer (Art. 38 DBG, ÷5)', () => {
    it('returns 0 for non-positive amounts', () => {
      expect(bundKapitalsteuer(0)).toBe(0);
      expect(bundKapitalsteuer(-5000)).toBe(0);
    });

    it('is exactly one fifth of the ordinary single tariff', () => {
      // 500'000 → Grundtarif 52'503.35 / 5 = 10'500.67
      expect(bundKapitalsteuer(500000)).toBe(Math.round((bundessteuerAlleinstehend(500000) / 5) * 100) / 100);
      expect(bundKapitalsteuer(500000)).toBe(10500.67);
    });

    it('uses the married tariff when verheiratet=true', () => {
      expect(bundKapitalsteuer(500000, true)).toBe(Math.round((bundessteuerVerheiratet(500000) / 5) * 100) / 100);
      // Verheiratetentarif ist tiefer → tiefere Kapitalsteuer als ledig
      expect(bundKapitalsteuer(500000, true)).toBeLessThan(bundKapitalsteuer(500000, false));
    });

    it('applies the flat-rate ceiling (11.5% / 5 = 2.3%) for very large amounts', () => {
      // 1'000'000 → 115'000 / 5 = 23'000
      expect(bundKapitalsteuer(1000000)).toBe(23000);
    });

    it('is progressive: effective rate rises with amount', () => {
      const r100 = bundKapitalsteuer(100000) / 100000;
      const r500 = bundKapitalsteuer(500000) / 500000;
      expect(r500).toBeGreaterThan(r100);
    });
  });

  describe('kantonKapitalsteuer', () => {
    it('returns null for unknown canton or non-positive amount', () => {
      expect(kantonKapitalsteuer(500000, 'XX')).toBeNull();
      expect(kantonKapitalsteuer(0, 'ZH')).toBeNull();
    });

    it('matches the anchor effective rate at 500k (ZH 7.16%)', () => {
      const r = kantonKapitalsteuer(500000, 'ZH');
      expect(r.total).toBe(Math.round(500000 * 0.0716));
      expect(r.effektiverSatz).toBeCloseTo(7.16, 1);
      expect(r.hauptort).toBe('Zürich');
    });

    it('interpolates between anchors (250k lies between 100k and 500k rate)', () => {
      const r = kantonKapitalsteuer(250000, 'ZH');
      const eff = r.total / 250000;
      expect(eff).toBeGreaterThan(0.0488); // > 100k-Satz
      expect(eff).toBeLessThan(0.0716);    // < 500k-Satz
    });

    it('SZ is cheaper than ZH at 100k (2.15% vs 4.88%)', () => {
      expect(kantonKapitalsteuer(100000, 'SZ').total).toBeLessThan(kantonKapitalsteuer(100000, 'ZH').total);
    });
  });

  describe('berechneKapitalbezug', () => {
    it('returns null for no amount', () => {
      expect(berechneKapitalbezug({ betrag: 0 })).toBeNull();
    });

    it('without canton falls back to federal only (the lower bound)', () => {
      const r = berechneKapitalbezug({ betrag: 500000 });
      expect(r.hatKanton).toBe(false);
      expect(r.total).toBe(bundKapitalsteuer(500000));
      expect(r.kantonGemeinde).toBeNull();
      expect(r.netto).toBe(500000 - r.total);
    });

    it('with canton splits total into federal + cantonal/communal', () => {
      const r = berechneKapitalbezug({ betrag: 500000, kuerzel: 'ZH' });
      expect(r.hatKanton).toBe(true);
      expect(r.bund).toBe(bundKapitalsteuer(500000));
      expect(r.kantonGemeinde).toBeGreaterThan(0);
      expect(r.bund + r.kantonGemeinde).toBe(r.total);
      expect(r.netto).toBe(500000 - r.total);
    });

    it('cantonal total never falls below the exact federal amount', () => {
      // AI ist günstig, bleibt aber ≥ Bund
      const r = berechneKapitalbezug({ betrag: 100000, kuerzel: 'AI' });
      expect(r.total).toBeGreaterThanOrEqual(r.bund);
    });
  });

  describe('kapitalsteuerBandbreite', () => {
    it('spans a min and max canton with min ≤ max', () => {
      const b = kapitalsteuerBandbreite(500000);
      expect(b.minTotal).toBeLessThanOrEqual(b.maxTotal);
      expect(b.minKanton).toBeTruthy();
      expect(b.maxKanton).toBeTruthy();
    });

    it('returns null for non-positive amount', () => {
      expect(kapitalsteuerBandbreite(0)).toBeNull();
    });
  });

  describe('vergleicheStaffelung', () => {
    it('staggered withdrawal is never more expensive than a single one', () => {
      const v = vergleicheStaffelung({ betrag: 300000, tranchen: 3, kuerzel: 'ZH' });
      expect(v.gestaffeltTotal).toBeLessThanOrEqual(v.einmalTotal);
      expect(v.ersparnis).toBeGreaterThanOrEqual(0);
    });

    it('shows a real saving for a progressive federal-only case', () => {
      const v = vergleicheStaffelung({ betrag: 300000, tranchen: 3 });
      // 3× Steuer auf 100k < Steuer auf 300k (Progression)
      expect(v.ersparnis).toBeGreaterThan(0);
      expect(v.gestaffeltTotal).toBe(Math.round(bundKapitalsteuer(100000) * 3));
    });

    it('clamps tranchen to 1..5', () => {
      const v = vergleicheStaffelung({ betrag: 300000, tranchen: 99 });
      expect(v.tranchen).toBe(5);
    });

    it('a single tranche equals the one-off amount', () => {
      const v = vergleicheStaffelung({ betrag: 300000, tranchen: 1, kuerzel: 'BE' });
      expect(v.gestaffeltTotal).toBe(v.einmalTotal);
      expect(v.ersparnis).toBe(0);
    });
  });

  describe('metadata', () => {
    it('lists all 26 cantons sorted', () => {
      const list = alleKapitalKantone();
      expect(list).toHaveLength(26);
      expect(list[0].kuerzel).toBe('AG');
    });

    it('exports a data version', () => {
      expect(KAPITAL_DATA_VERSION).toContain('2026');
    });
  });
});
