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

    it('applies the 263-per-child reduction only together with the Abs. 2 tariff (verheiratet)', () => {
      const ohneKinder = berechneBundessteuer({ bruttoEinkommen: 80000, verheiratet: true });
      const mitKindern = berechneBundessteuer({ bruttoEinkommen: 80000, verheiratet: true, kinder: 2 });
      expect(mitKindern.kinderabzug).toBe(526);
      expect(mitKindern.steuer).toBe(
        Math.max(0, Math.round((ohneKinder.steuerVorAbzug - 526) * 100) / 100)
      );
    });

    it('does not produce negative tax', () => {
      const result = berechneBundessteuer({ bruttoEinkommen: 15000, kinder: 5, elterntarif: true });
      expect(result.steuer).toBe(0);
    });

    it('uses Verheiratetentarif when verheiratet=true', () => {
      const result = berechneBundessteuer({ bruttoEinkommen: 80000, verheiratet: true });
      expect(result.tarif).toBe('verheiratet');
      expect(result.steuer).toBe(
        Math.max(0, bundessteuerVerheiratet(80000))
      );
    });

    // Elterntarif, DBG Art. 36 Abs. 2bis (Fassung 1.1.2026). Sollwerte aus der amtlichen Tabelle
    // ESTV Form. 58c-2026, Spalte «Verheiratete und Einelternfamilien», Fussnote 3 (263 Fr. je Kind):
    // https://www.estv.admin.ch/dam/de/sd-web/gnde9CmEsalK/dbst-tairfe-58c-2026-dfi.pdf
    //   60 000 → 369.00 · 100 000 → 1 816.00 (Verheiratete/Einelternfamilien)
    //   60 000 → 671.40 (Alleinstehende)
    describe('Elterntarif (DBG Art. 36 Abs. 2bis)', () => {
      it('ESTV-Tabelle 2026: Verheiratete und Einelternfamilien, 60 000 und 100 000', () => {
        expect(bundessteuerVerheiratet(60000)).toBe(369.00);
        expect(bundessteuerVerheiratet(100000)).toBe(1816.00);
      });

      it('alleinerziehend, 1 Kind, bestätigt, 60 000: 369.00 − 263 = 106.00', () => {
        const r = berechneBundessteuer({ bruttoEinkommen: 60000, kinder: 1, elterntarif: true });
        expect(r.tarif).toBe('eltern');
        expect(r.steuerVorAbzug).toBe(369.00);
        expect(r.kinderabzug).toBe(263);
        expect(r.steuer).toBe(106.00);
      });

      it('alleinerziehend, 2 Kinder, bestätigt, 100 000: 1 816.00 − 526 = 1 290.00', () => {
        const r = berechneBundessteuer({ bruttoEinkommen: 100000, kinder: 2, elterntarif: true });
        expect(r.tarif).toBe('eltern');
        expect(r.steuer).toBe(1290.00);
      });

      it('gleicher Betrag wie Verheiratete mit 2 Kindern (Abs. 2 sinngemäss)', () => {
        const eltern = berechneBundessteuer({ bruttoEinkommen: 100000, kinder: 2, elterntarif: true });
        const ehe = berechneBundessteuer({ bruttoEinkommen: 100000, kinder: 2, verheiratet: true });
        expect(eltern.steuer).toBe(ehe.steuer);
        expect(ehe.tarif).toBe('verheiratet');
      });

      it('nicht bestätigt: vorsichtiger Grundtarif ohne Ermässigung (60 000 → 671.40)', () => {
        const r = berechneBundessteuer({ bruttoEinkommen: 60000, kinder: 1 });
        expect(r.tarif).toBe('alleinstehend');
        expect(r.kinderabzug).toBe(0);
        expect(r.steuer).toBe(671.40);
      });

      it('Bestätigung ohne Kinder ändert nichts (Grundtarif)', () => {
        const r = berechneBundessteuer({ bruttoEinkommen: 60000, kinder: 0, elterntarif: true });
        expect(r.tarif).toBe('alleinstehend');
        expect(r.steuer).toBe(671.40);
      });
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

    it('ledig mit Kindern ohne Bestätigung: Grundtarif ohne Ermässigung; verheiratet: mit', () => {
      const ohne = vergleicheTarife(100000, 0);
      const mit = vergleicheTarife(100000, 2);
      expect(mit.alleinstehend).toBe(ohne.alleinstehend);
      expect(mit.verheiratet).toBe(1290.00); // ESTV Form. 58c-2026: 1 816.00 − 2 × 263
    });

    it('ledig mit bestätigtem Elterntarif = verheiratet (ESTV Form. 58c-2026, 60 000, 1 Kind)', () => {
      const r = vergleicheTarife(60000, 1, true);
      expect(r.alleinstehend).toBe(106.00);
      expect(r.verheiratet).toBe(106.00);
      expect(r.differenz).toBe(0);
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
