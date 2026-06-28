import { describe, it, expect } from 'vitest';
import {
  bundessteuerAlleinstehend,
  bundessteuerVerheiratet,
  berechneBundessteuer,
  grenzsteuersatz,
  vergleicheTarife,
  STEUER_PARAMS,
  STEUER_DATA_VERSION,
} from '../steuerRechner.js';

describe('steuerRechner', () => {
  describe('bundessteuerAlleinstehend (Grundtarif)', () => {
    it('returns 0 for income <= 0', () => {
      expect(bundessteuerAlleinstehend(0)).toBe(0);
      expect(bundessteuerAlleinstehend(-1000)).toBe(0);
    });

    it('returns 0 for income within first bracket (0-15200)', () => {
      expect(bundessteuerAlleinstehend(10000)).toBe(0);
      expect(bundessteuerAlleinstehend(15200)).toBe(0);
    });

    it('calculates tax for second bracket (15201-33200)', () => {
      const tax = bundessteuerAlleinstehend(20000);
      // (20000 - 15200) * 0.77% = 4800 * 0.0077 = 36.96 (amtlicher ESTV-Wert 2026)
      expect(tax).toBe(36.96);
    });

    it('matches the official ESTV Tarif 2026 anchor values exactly', () => {
      expect(bundessteuerAlleinstehend(60000)).toBe(671.40);   // ESTV-Beispiel im Rundschreiben
      expect(bundessteuerAlleinstehend(100000)).toBe(2684.35);
      expect(bundessteuerVerheiratet(53400)).toBe(237.00);
    });

    it('calculates tax for income at 50000', () => {
      const tax = bundessteuerAlleinstehend(50000);
      // Stufe ab 43'500 (amtl. Grundsteuer 229.20) + (50000-43500) * 2.64%
      // 229.20 + 6500 * 0.0264 = 229.20 + 171.60 = 400.80 (amtlich)
      expect(tax).toBe(400.80);
    });

    it('calculates tax for income at 100000', () => {
      const tax = bundessteuerAlleinstehend(100000);
      // Progressive sum through brackets up to 100000
      expect(tax).toBeGreaterThan(2000);
      expect(tax).toBeLessThan(5000);
    });

    it('applies flat rate above 793900', () => {
      const tax = bundessteuerAlleinstehend(800000);
      // 800000 * 11.5% = 92000
      expect(tax).toBe(92000);
    });

    it('applies flat rate at exactly 1000000', () => {
      expect(bundessteuerAlleinstehend(1000000)).toBe(115000);
    });
  });

  describe('bundessteuerVerheiratet (Verheiratetentarif)', () => {
    it('returns 0 for income <= 29700', () => {
      expect(bundessteuerVerheiratet(0)).toBe(0);
      expect(bundessteuerVerheiratet(29700)).toBe(0);
    });

    it('calculates tax for second bracket', () => {
      const tax = bundessteuerVerheiratet(40000);
      // (40000 - 29700) * 1% = 10300 * 0.01 = 103
      expect(tax).toBe(103);
    });

    it('applies flat rate above 941300', () => {
      const tax = bundessteuerVerheiratet(1000000);
      // 1000000 * 11.5% = 115000
      expect(tax).toBe(115000);
    });

    it('married tax is lower than single for medium incomes', () => {
      const single = bundessteuerAlleinstehend(80000);
      const married = bundessteuerVerheiratet(80000);
      expect(married).toBeLessThan(single);
    });
  });

  describe('berechneBundessteuer', () => {
    it('returns zero result for zero income', () => {
      const result = berechneBundessteuer({ bruttoEinkommen: 0 });
      expect(result.steuer).toBe(0);
      expect(result.steuerBaresEinkommen).toBe(0);
      expect(result.tarif).toBe('alleinstehend');
    });

    it('applies deductions correctly', () => {
      const ohneAbzug = berechneBundessteuer({ bruttoEinkommen: 80000 });
      const mitAbzug = berechneBundessteuer({ bruttoEinkommen: 80000, abzuege: 10000 });
      expect(mitAbzug.steuerBaresEinkommen).toBe(70000);
      expect(mitAbzug.steuer).toBeLessThan(ohneAbzug.steuer);
    });

    it('applies Kinderabzug from tax amount', () => {
      const ohneKinder = berechneBundessteuer({ bruttoEinkommen: 80000 });
      const mitKindern = berechneBundessteuer({ bruttoEinkommen: 80000, kinder: 2 });
      expect(mitKindern.kinderabzug).toBe(526);
      expect(mitKindern.steuer).toBe(
        Math.max(0, Math.round((ohneKinder.steuerVorAbzug - 526) * 100) / 100)
      );
    });

    it('does not produce negative tax', () => {
      const result = berechneBundessteuer({ bruttoEinkommen: 15000, kinder: 5 });
      expect(result.steuer).toBe(0);
    });

    it('uses Verheiratetentarif when verheiratet=true', () => {
      const result = berechneBundessteuer({ bruttoEinkommen: 80000, verheiratet: true });
      expect(result.tarif).toBe('verheiratet');
      expect(result.steuer).toBe(
        Math.max(0, bundessteuerVerheiratet(80000))
      );
    });

    it('calculates effective rate', () => {
      const result = berechneBundessteuer({ bruttoEinkommen: 100000 });
      expect(result.effektiverSatz).toBeGreaterThan(0);
      expect(result.effektiverSatz).toBeLessThan(15);
    });
  });

  describe('grenzsteuersatz', () => {
    it('returns 0 for zero income', () => {
      expect(grenzsteuersatz(0)).toBe(0);
    });

    it('returns 0 within tax-free bracket', () => {
      expect(grenzsteuersatz(10000)).toBe(0);
    });

    it('returns correct marginal rate for 50000', () => {
      // Stufe 43'500–58'000: 2.64%
      expect(grenzsteuersatz(50000)).toBe(2.64);
    });

    it('returns flat rate above threshold', () => {
      expect(grenzsteuersatz(800000, false)).toBe(11.5);
      expect(grenzsteuersatz(1000000, true)).toBe(11.5);
    });

    it('returns married marginal rates', () => {
      // Stufe 29'700–53'400: 1%
      expect(grenzsteuersatz(40000, true)).toBe(1);
    });
  });

  describe('vergleicheTarife', () => {
    it('compares both tariffs', () => {
      const result = vergleicheTarife(100000);
      expect(result.alleinstehend).toBeGreaterThan(0);
      expect(result.verheiratet).toBeGreaterThan(0);
      expect(result.differenz).toBeGreaterThan(0);
    });

    it('applies Kinderabzug to both', () => {
      const ohne = vergleicheTarife(100000, 0);
      const mit = vergleicheTarife(100000, 2);
      expect(mit.alleinstehend).toBeLessThan(ohne.alleinstehend);
      expect(mit.verheiratet).toBeLessThan(ohne.verheiratet);
    });
  });

  describe('constants', () => {
    it('exports STEUER_PARAMS', () => {
      expect(STEUER_PARAMS.kinderabzugProKind).toBe(263);
      expect(STEUER_PARAMS.grundtarifFlatSatz).toBe(11.5);
    });

    it('exports data version', () => {
      expect(STEUER_DATA_VERSION).toBe('2026');
    });
  });
});
