// Wohnen international: Schild rechts neben dem Vergleichshaus (Stebler Studios 11.11.2026). Quelle Eurostat
// prc_ppp_ind_1, A0104, 2025 — «Wohnen und Energie», kein reiner Mietvergleich.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { WOHNEN_INTERNATIONAL, schweizGegen, auslandStoecke } from '../data/wohnenInternational.js';

describe('Wohnen international: die eine Rechnung', () => {
  it('Werte wie an der Quelle (Eurostat, abgerufen 11.11.2026)', () => {
    expect(WOHNEN_INTERNATIONAL.index).toEqual({ CH: 213.1, EU: 100, DE: 113.9, FR: 120.7, IT: 91.4, AT: 113.4 });
    expect(WOHNEN_INTERNATIONAL.jahr).toBe(2025);
    expect(WOHNEN_INTERNATIONAL.quelle).toMatch(/prc_ppp_ind_1, A0104/);
  });
  it('Schweiz gegen EU und Nachbarn, ganze Prozent', () => {
    expect(schweizGegen()).toEqual([
      { code: 'EU', pct: 113 }, { code: 'DE', pct: 87 }, { code: 'AT', pct: 88 }, { code: 'FR', pct: 77 }, { code: 'IT', pct: 133 },
    ]);
  });
  it('die Texte sagen «Wohnen und Energie», nie «Miete», und nennen die Quelle — in allen fünf Sprachen', async () => {
    for (const lang of ['de', 'fr', 'it', 'en', 'rm']) {
      const s = (await import(`../i18n/${lang}.js`)).default.wohnenInternational;
      expect(s, lang).toBeTruthy();
      expect(JSON.stringify(s), lang).not.toMatch(/Miete|loyer|affitto|\brent\b|\bfitg\b/i);
      expect(JSON.stringify(s.quelle), lang).toMatch(/Eurostat/);
    }
  });
  it('EU als Stock: abgeleitet aus dem Schweizer Schnitt und dem Preisniveau, Prozent statt Franken', () => {
    const a = auslandStoecke(1446);
    expect(a.eu.hoehe).toBeCloseTo(1446 * 100 / 213.1, 6);
    expect(a.eu.pct).toBe(-53);
    expect(auslandStoecke(0)).toBeNull();
  });
  it('im Kapitel: EU-Stock im Vergleichshaus, Satz mit den Nachbarländern darunter', () => {
    const w = readFileSync(fileURLToPath(new URL('../components/WohnkostenInstrument.jsx', import.meta.url)), 'utf8');
    expect(w).toMatch(/ausland: auslandStoecke\(vergleich\.national\),/);
    expect(w).toMatch(/React\.createElement\(InternationalHinweis, \{ palette, t \}\)/);
  });
});
