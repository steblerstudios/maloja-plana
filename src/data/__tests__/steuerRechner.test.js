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

  // Rundung und Erhebungsgrenze (K23), abgerufen 15.09.2026. Sollwerte aus der amtlichen Tabelle
  // ESTV Form. 58c-2026 (ESTV / DVS 01.2026),
  // https://www.estv.admin.ch/dam/de/sd-web/gnde9CmEsalK/dbst-tairfe-58c-2026-dfi.pdf
  //   Fussnote 1: «Restbeträge von weniger als CHF 100 fallen ausser Betracht.»
  //   Fussnote 2: «Die Jahressteuer wird gegebenenfalls auf die nächsten 5 Rp. abgerundet.»
  //   Fussnote 3: 263 Franken je Kind (Spalte «Verheiratete und Einelternfamilien»)
  // DBG Art. 36 Abs. 3 (Fedlex, Stand 1.1.2026): «Steuerbeträge unter 25 Franken werden nicht erhoben.»
  // Die Tabelle weist die Jahressteuer ungerundet aus (z. B. 36.96); Fussnote 2 rundet sie.
  describe('Rundung und Erhebungsgrenze (DBG Art. 36 Abs. 3, Form. 58c-2026)', () => {
    const grund = (e) => berechneBundessteuer({ bruttoEinkommen: e });
    const verh = (e) => berechneBundessteuer({ bruttoEinkommen: e, verheiratet: true });
    const eltern = (e, k) => berechneBundessteuer({ bruttoEinkommen: e, kinder: k, elterntarif: true });

    it('Grundtarif: Tabellenwerte, die schon auf 5 Rp. stehen, bleiben (60 000 → 671.40, 100 000 → 2 684.35)', () => {
      expect(grund(60000).steuer).toBe(671.40);
      expect(grund(100000).steuer).toBe(2684.35);
    });

    it('Grundtarif: Fussnote 2, Tabelle 20 000 → 36.96, Jahressteuer 36.95; 76 100 → 1 149.57 → 1 149.55', () => {
      expect(grund(20000).steuerVorAbzug).toBe(36.96);
      expect(grund(20000).steuer).toBe(36.95);
      expect(grund(76100).steuer).toBe(1149.55);
    });

    it('Fussnote 1: Restbetrag unter 100 fällt weg (knapp über / unter einem Hunderter)', () => {
      // 60 050 und 60 099 → 60 000 → 671.40 (Tabelle)
      expect(grund(60050).massgebendesEinkommen).toBe(60000);
      expect(grund(60050).steuer).toBe(671.40);
      expect(grund(60099).steuer).toBe(671.40);
      // 60 100: Tabelle 60 000 (671.40) + 2.97 je 100 = 674.37 → 674.35
      expect(grund(60100).steuer).toBe(674.35);
      // 59 999 → 59 900: 671.40 − 2.97 = 668.43 → 668.40
      expect(grund(59999).steuer).toBe(668.40);
    });

    it('Widerspruch 76 200: Gesetz 1 152.55, Tabelle 1 152.50 — die App folgt der Tabelle', () => {
      // Art. 36 Abs. 1 DBG (Fedlex, FR/IT, AS 2025 579): 1 152.55. Form. 58c-2026: 1 152.50.
      // Beides ist 612.00 + 182 × 2.97 = 1 152.54, auf 5 Rp. gerundet: Gesetz zum nächsten
      // Wert, Tabelle nach unten (Fussnote 2). Nur die Tabellenkette trifft die nächste
      // Gesetzesstufe: 1 152.50 + 59 × 5.94 = 1 502.96 → 1 502.95 (82 100, Gesetz und Tabelle).
      expect(Math.round((612.00 + 182 * 2.97) * 100) / 100).toBe(1152.54);
      expect(grund(76200).steuer).toBe(1152.50);
      expect(grund(82000).steuerVorAbzug).toBe(1497.02); // Tabelle 82 000
      expect(grund(82000).steuer).toBe(1497.00);
      expect(grund(82100).steuer).toBe(1502.95);          // Gesetz und Tabelle
    });

    it('Grundtarif: unter 25 Franken wird nicht erhoben (Art. 36 Abs. 3)', () => {
      // Tabelle 18 500 → 25.41 → 25.40: erhoben. 18 400: 25.41 − 0.77 = 24.64 → 24.60: nicht erhoben.
      expect(grund(18500).steuer).toBe(25.40);
      expect(grund(18400).steuer).toBe(0);
    });

    it('Verheiratete: Tabellenwerte (60 000 → 369.00, 100 000 → 1 816.00, 33 000 → 33.00)', () => {
      expect(verh(60000).steuer).toBe(369.00);
      expect(verh(100000).steuer).toBe(1816.00);
      expect(verh(33000).steuer).toBe(33.00);
    });

    it('Verheiratete: Erhebungsgrenze ist kein Freibetrag (25.00 wird erhoben, 24.00 nicht)', () => {
      // Tabelle 33 000 → 33.00, je 100 Franken 1.00: 32 200 → 25.00, 32 100 → 24.00
      expect(verh(32200).steuer).toBe(25.00);
      expect(verh(32100).steuer).toBe(0);
    });

    it('Elterntarif: Rundung und Grenze nach der Ermässigung von 263 Franken', () => {
      // Tabelle Verheiratete/Einelternfamilien: 60 000 → 369.00, 55 000 → 269.00, 56 000 → 289.00
      expect(eltern(60050, 1).steuer).toBe(106.00);  // 60 000: 369.00 − 263
      expect(eltern(56000, 1).steuer).toBe(26.00);   // 289.00 − 263 = 26.00: erhoben
      expect(eltern(55000, 1).steuer).toBe(0);       // 269.00 − 263 = 6.00: unter 25, nicht erhoben
      expect(eltern(100000, 2).steuer).toBe(1290.00);
    });

    it('vergleicheTarife rechnet mit denselben Regeln', () => {
      const r = vergleicheTarife(55000, 1, true);
      expect(r.alleinstehend).toBe(0);
      expect(r.verheiratet).toBe(0);
      expect(vergleicheTarife(20000).alleinstehend).toBe(36.95);
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
