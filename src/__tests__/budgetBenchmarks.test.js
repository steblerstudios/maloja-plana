import { describe, it, expect } from 'vitest';
import { BUDGET_BENCHMARKS, resolveHouseholdType, benchmarkFor } from '../budgetSync.js';

// ─────────────────────────────────────────────────────────────
// Faden 4 — belegbare Haushalts-Budget-Richtwerte (BFS HABE 2020/21),
// abgestuft nach Haushaltstyp (Inkrement 2). Sichert das Mapping von
// householdContext → BFS-Typ und den Fallback auf 'all'.
// ─────────────────────────────────────────────────────────────

describe('resolveHouseholdType: householdContext → BFS-Haushaltstyp', () => {
  it('Einzelperson unter Rentenalter → single_u65', () => {
    expect(resolveHouseholdType({ adults: 1, children: 0, isRetired: false })).toBe('single_u65');
  });
  it('Einzelperson im Rentenalter → single_o65', () => {
    expect(resolveHouseholdType({ adults: 1, children: 0, isRetired: true })).toBe('single_o65');
  });
  it('Paar ohne Kinder → couple_u65 / couple_o65 je nach Rente', () => {
    expect(resolveHouseholdType({ adults: 2, children: 0, isRetired: false })).toBe('couple_u65');
    expect(resolveHouseholdType({ adults: 2, children: 0, isRetired: true })).toBe('couple_o65');
  });
  it('mit Kindern → couple_kids (2 Erwachsene) bzw. singleparent (1)', () => {
    expect(resolveHouseholdType({ adults: 2, children: 2, isRetired: false })).toBe('couple_kids');
    expect(resolveHouseholdType({ adults: 1, children: 1, isRetired: false })).toBe('singleparent');
  });
  it('Kinder haben Vorrang vor dem Rentenstatus', () => {
    expect(resolveHouseholdType({ adults: 2, children: 1, isRetired: true })).toBe('couple_kids');
  });
  it('ohne Kontext oder ungewöhnlicher Haushalt → all', () => {
    expect(resolveHouseholdType(null)).toBe('all');
    expect(resolveHouseholdType({ adults: 3, children: 0, isRetired: false })).toBe('couple_u65');
  });
});

describe('benchmarkFor: Kategorie-Richtwert nach Typ, Fallback all', () => {
  it('liefert den typ-spezifischen Wert', () => {
    // Lebensmittel: Einzelperson << Familie (belegbar, BFS 2020/21)
    expect(benchmarkFor(BUDGET_BENCHMARKS.byField, 'groceries', 'single_u65')).toBe(387);
    expect(benchmarkFor(BUDGET_BENCHMARKS.byField, 'groceries', 'couple_kids')).toBe(968);
  });
  it('fällt auf all zurück, wenn der Typ fehlt', () => {
    expect(benchmarkFor(BUDGET_BENCHMARKS.byGroup, 'housing', 'unbekannt')).toBe(BUDGET_BENCHMARKS.byGroup.housing.all);
  });
  it('gibt null für unbekannte Kategorien', () => {
    expect(benchmarkFor(BUDGET_BENCHMARKS.byField, 'gibtsnicht', 'all')).toBeNull();
  });
  it('jeder Typ hat einen all-Wert in jeder hinterlegten Kategorie', () => {
    for (const map of [BUDGET_BENCHMARKS.byGroup, BUDGET_BENCHMARKS.byField]) {
      for (const key of Object.keys(map)) {
        expect(typeof map[key].all).toBe('number');
      }
    }
  });
});
