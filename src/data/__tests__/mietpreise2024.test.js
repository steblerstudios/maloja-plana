import { describe, it, expect } from 'vitest';
import { RENT_NATIONAL, RENT_BY_CANTON, RENT_LOW_N, MIETPREIS_DATA_YEAR, getRentComparison } from '../mietpreise.js';

// Nachzug 25.10.2026: BFS, Mietpreis-Strukturerhebung, je-d-09.03.03.01 (asset 36398431), Blatt «2024».
// Stichproben direkt aus der Tabelle abgeschrieben — fällt eine davon, ist beim Übertragen etwas verrutscht.
describe('Mietpreise BFS 2024', () => {
  it('Stand 2024', () => {
    expect(MIETPREIS_DATA_YEAR).toBe(2024);
  });

  it('Schweiz: Total 1485, 3 Zimmer 1446, 6+ Zimmer 2578', () => {
    expect(RENT_NATIONAL.total).toBe(1485);
    expect(RENT_NATIONAL.r3).toBe(1446);
    expect(RENT_NATIONAL.r6).toBe(2578);
  });

  it('Stichproben je Kanton (erste, mittlere, letzte Zeile der Tabelle)', () => {
    expect(RENT_BY_CANTON.ZH).toEqual({ total: 1768, r1: 1108, r2: 1510, r3: 1732, r4: 2016, r5: 2446, r6: 3236 });
    expect(RENT_BY_CANTON.SG.r3).toBe(1312);
    expect(RENT_BY_CANTON.GE.r4).toBe(1744);
    expect(RENT_BY_CANTON.JU.total).toBe(999);
  });

  it('AI 1 Zimmer ist in der Tabelle «X» (nicht publiziert) → null, Vergleich fällt auf Total zurück', () => {
    expect(RENT_BY_CANTON.AI.r1).toBeNull();
    expect(getRentComparison('AI', { rooms: '1' }).roomKey).toBe('total');
  });

  it('alle 26 Kantone, jeder Wert eine ganze Zahl in plausibler Spanne', () => {
    expect(Object.keys(RENT_BY_CANTON)).toHaveLength(26);
    for (const c of Object.values(RENT_BY_CANTON)) {
      for (const v of Object.values(c)) {
        if (v === null) continue;
        expect(Number.isInteger(v)).toBe(true);
        expect(v).toBeGreaterThan(400);
        expect(v).toBeLessThan(4000);
      }
    }
  });
});

// Fachprüfung 25.10.2026: das BFS-Kennzeichen «( )» (weniger als 50 Beobachtungen) steht nur im
// Zahlenformat der Tabelle. 26 Zellen im Blatt «2024», von Prüfung und Übertrag unabhängig gleich gezählt.
describe('Mietpreise BFS 2024 · unsichere Werte und Vergleichsgrösse', () => {
  it('26 markierte Zellen, nur Kantone und Spalten, die es gibt', () => {
    const alle = Object.entries(RENT_LOW_N).flatMap(([k, spalten]) => spalten.map((s) => k + '.' + s));
    expect(alle).toHaveLength(26);
    for (const [k, spalten] of Object.entries(RENT_LOW_N)) {
      expect(RENT_BY_CANTON[k]).toBeDefined();
      for (const s of spalten) expect(RENT_BY_CANTON[k][s]).not.toBeNull();
    }
    expect(RENT_LOW_N.AI).toEqual(['r2', 'r3', 'r4', 'r5', 'r6']);
  });

  it('OW, 6+ Zimmer (5 Personen): unsicher und angenommen', () => {
    const c = getRentComparison('OW', { householdSize: 5 });
    expect(c.roomKey).toBe('r6');
    expect(c.wenigeAntworten).toBe(true);
    expect(c.zimmerAngenommen).toBe(true);
  });

  it('ZH, erfasste 3½ Zimmer: sicher und nicht angenommen', () => {
    const c = getRentComparison('ZH', { rooms: '3½', householdSize: 1 });
    expect(c.roomKey).toBe('r4');
    expect(c.wenigeAntworten).toBe(false);
    expect(c.zimmerAngenommen).toBe(false);
    expect(c.ohneWertFuerGroesse).toBe(false);
  });

  it('AI, 1 Zimmer: kein BFS-Wert → Vergleich mit allen Grössen, und das wird gesagt', () => {
    const c = getRentComparison('AI', { rooms: '1' });
    expect(c.roomKey).toBe('total');
    expect(c.ohneWertFuerGroesse).toBe(true);
    expect(c.zimmerAngenommen).toBe(false);
  });
});
