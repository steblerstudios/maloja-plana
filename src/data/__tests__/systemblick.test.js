import { describe, it, expect, beforeAll } from 'vitest';
import { CANTON_CODES } from '../../config/cantonalData.js';
import { lookupPLZ } from '../plzGemeinde.js';
import { HAUPTORTE, MUSTERHAUSHALTE, musterProfil, einordnen, kennzahlen, systemblickIPV } from '../systemblick.js';

// Systemblick (Prototyp): derselbe Musterhaushalt durch alle 26 belegten IPV-Kantonsmodelle.
// Geprüft wird, dass die Auswertung VOLLSTÄNDIG und EHRLICH ist — nicht, ob ein Kanton richtig
// rechnet (das prüfen die Kantonstests in config/__tests__/ipv*.test.js).

describe('Systemblick: Hauptorte', () => {
  it('jeder der 26 Kantone hat genau einen Hauptort', () => {
    expect(Object.keys(HAUPTORTE).sort()).toEqual([...CANTON_CODES].sort());
  });

  it('jede Hauptort-PLZ liegt laut PLZ-Daten im eigenen Kanton', () => {
    const falsch = Object.entries(HAUPTORTE)
      .filter(([kt, { plz }]) => !lookupPLZ(plz).some((g) => g.kanton === kt))
      .map(([kt, { plz }]) => `${kt} ${plz}`);
    expect(falsch).toEqual([]);
  });
});

describe('Systemblick: Musterprofil', () => {
  it('rechnet ohne offene 13.-Monatslohn-Frage und mit dem Hauptort als Wohnort', () => {
    const p = musterProfil('BS', 'einzel', 4000);
    expect(p.finanzen.dreizehnter).toBe('nein');
    expect(p.wohnen.postalCode).toBe('4051');
    expect(p.basis.canton).toBe('BS');
  });

  it('wirft bei unbekanntem Kanton oder Haushalt statt still zu rechnen', () => {
    expect(() => musterProfil('XX', 'einzel', 4000)).toThrow();
    expect(() => musterProfil('ZH', 'gibtsNicht', 4000)).toThrow();
  });
});

describe('Systemblick: Einordnen und Kennzahlen', () => {
  it('«keine Zahl» ist nie 0 und zählt nicht in Median, Minimum oder Maximum', () => {
    const z = [
      einordnen('A', { belegt: true, eligible: true, annual: 1200, amount: 100 }),
      einordnen('B', { belegt: true, eligible: false, amount: 0, noteKey: 'x' }),
      einordnen('C', { belegt: false, eligible: false, amount: null, noteKey: 'ipv.orientierungOffen' }),
      einordnen('D', { belegt: true, eligible: true, annual: 3600, amount: 300 }),
    ];
    expect(z.map((r) => r.art)).toEqual(['betrag', 'keinAnspruch', 'keineZahl', 'betrag']);
    expect(z[2].jahr).toBeNull();
    expect(kennzahlen(z)).toEqual({ mitBetrag: 2, keinAnspruch: 1, keineZahl: 1, min: 1200, max: 3600, median: 2400 });
  });

  it('ohne einen einzigen Betrag: Kennzahlen null statt 0', () => {
    expect(kennzahlen([])).toEqual({ mitBetrag: 0, keinAnspruch: 0, keineZahl: 0, min: null, max: null, median: null });
  });
});

describe('Systemblick: alle 26 Kantone, geladen', () => {
  const ergebnisse = {};
  beforeAll(async () => {
    for (const h of Object.keys(MUSTERHAUSHALTE)) {
      for (const lohn of [2500, 4000, 6000]) ergebnisse[`${h}/${lohn}`] = await systemblickIPV(h, lohn);
    }
  });

  it('jede Auswertung hat 26 Zeilen, keine steht auf «laden»', () => {
    for (const r of Object.values(ergebnisse)) {
      expect(r.zeilen).toHaveLength(26);
      expect(r.zeilen.filter((z) => z.grund === 'laden')).toEqual([]);
    }
  });

  it('jeder Betrag ist eine endliche, nicht negative ganze Zahl', () => {
    const schlecht = Object.entries(ergebnisse).flatMap(([id, r]) => r.zeilen
      .filter((z) => z.art === 'betrag' && !(Number.isInteger(z.jahr) && z.jahr > 0))
      .map((z) => `${id} ${z.kanton}: ${z.jahr}`));
    expect(schlecht).toEqual([]);
  });

  it('mehr Lohn gibt in keinem Kanton mehr Verbilligung (derselbe Haushalt)', () => {
    const schlecht = [];
    for (const h of Object.keys(MUSTERHAUSHALTE)) {
      for (const kt of CANTON_CODES) {
        const jahre = [2500, 4000, 6000].map((l) => ergebnisse[`${h}/${l}`].zeilen.find((z) => z.kanton === kt))
          .filter((z) => z.art !== 'keineZahl').map((z) => z.jahr);
        for (let i = 1; i < jahre.length; i++) if (jahre[i] > jahre[i - 1]) schlecht.push(`${h} ${kt}: ${jahre.join(' → ')}`);
      }
    }
    expect(schlecht).toEqual([]);
  });
});
