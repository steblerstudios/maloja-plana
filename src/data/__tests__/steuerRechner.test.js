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

    it('returns 0 for income within first bracket (0-14500)', () => {
      expect(bundessteuerAlleinstehend(10000)).toBe(0);
      expect(bundessteuerAlleinstehend(14500)).toBe(0);
    });

    it('calculates tax for second bracket (14501-31600)', () => {
      const tax = bundessteuerAlleinstehend(20000);
      // (20000 - 14500) * 0.77% = 5500 * 0.0077 = 42.35
      expect(tax).toBe(42.35);
    });

    it('calculates tax for income at 50000', () => {
      const tax = bundessteuerAlleinstehend(50000);
      // 0-14500: 0
      // 14501-31600: 17100 * 0.0077 = 131.67
      // 31601-41400: 9800 * 0.0088 = 86.24
      // 41401-50000: 8600 * 0.0264 = 227.04
      // Total: 444.95
      expect(tax).toBe(444.95);
    });

    it('calculates tax for income at 100000', () => {
      const tax = bundessteuerAlleinstehend(100000);
      // Progressive sum through brackets up to 100000
      expect(tax).toBeGreaterThan(2000);
      expect(tax).toBeLessThan(5000);
    });

    it('applies flat rate above 755200', () => {
      const tax = bundessteuerAlleinstehend(800000);
      // 800000 * 11.5% = 92000
      expect(tax).toBe(92000);
    });

    it('applies flat rate at exactly 1000000', () => {
      expect(bundessteuerAlleinstehend(1000000)).toBe(115000);
    });
  });

  describe('bundessteuerVerheiratet (Verheiratetentarif)', () => {
    it('returns 0 for income <= 28300', () => {
      expect(bundessteuerVerheiratet(0)).toBe(0);
      expect(bundessteuerVerheiratet(28300)).toBe(0);
    });

    it('calculates tax for second bracket', () => {
      const tax = bundessteuerVerheiratet(40000);
      // (40000 - 28300) * 1% = 11700 * 0.01 = 117
      expect(tax).toBe(117);
    });

    it('applies flat rate above 895900', () => {
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
      // 41401-55200 bracket: 2.64%
      expect(grenzsteuersatz(50000)).toBe(2.64);
    });

    it('returns flat rate above threshold', () => {
      expect(grenzsteuersatz(800000, false)).toBe(11.5);
      expect(grenzsteuersatz(1000000, true)).toBe(11.5);
    });

    it('returns married marginal rates', () => {
      // 28301-50900 bracket: 1%
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
      expect(STEUER_DATA_VERSION).toBe('2024/2025');
    });
  });
});
