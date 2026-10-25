import { describe, it, expect } from 'vitest';
import {
  detailJahr, DETAIL_JAHRE, getInsurerPremium, getInsurerAllFranchises, allInsurerNrs, getInsurerCantons,
} from '../praemienDetail.js';
import de from '../../i18n/de.js';
import en from '../../i18n/en.js';
import fr from '../../i18n/fr.js';
import itSprache from '../../i18n/it.js'; // nicht «it» — das überschriebe vitests it()
import rm from '../../i18n/rm.js';

// Kassenprämien 2027 aus dem BAG-Gesamtbericht (gesamtbericht_ch-2027.pdf, release-2026-10-22) neben 2026.
// Die Werte unten sind in der PDF von Auge abgelesen (gerenderte Seiten 41, 93, 181, 194, 348, 580), unabhängig
// vom Parser — es sind die Stichproben des Imports.
const im2026 = new Date(2026, 9, 25);
const im2027 = new Date(2027, 0, 1);

describe('Kassenprämien je Jahr', () => {
  it('2026 und 2027 vorhanden; Stichtag wählt das Jahr', () => {
    expect(DETAIL_JAHRE).toEqual([2026, 2027]);
    expect(detailJahr(im2026)).toBe(2026);
    expect(detailJahr(im2027)).toBe(2027);
    expect(detailJahr(new Date(2028, 5, 1))).toBe(2027);
    expect(detailJahr()).toBe(2026); // feste Test-Uhr 22.10.2026
  });

  it('Helsana AI (S. 41): Erwachsene mit Unfall 444.0 … 315.7, ohne 413.0 … 293.7', () => {
    expect(getInsurerAllFranchises(1562, 'AI', 0, 'erwachsen', true, im2027).map(f => f.premium)).toEqual([444, 432.4, 403.2, 374, 344.9, 315.7]);
    expect(getInsurerAllFranchises(1562, 'AI', 0, 'erwachsen', false, im2027).map(f => f.premium)).toEqual([413, 402.2, 375, 347.9, 320.8, 293.7]);
  });

  it('KPT ZH Region 1, junge Erwachsene (S. 580): Franchise 2000 nicht angeboten', () => {
    expect(getInsurerPremium(376, 'ZH', 1, 'jung', 2000, true, im2027)).toBeNull();
    expect(getInsurerPremium(376, 'ZH', 1, 'jung', 2500, true, im2027)).toBe(402.8);
    expect(getInsurerPremium(376, 'ZH', 1, 'jung', 1500, false, im2027)).toBe(428.8);
  });

  it('Kinder BE Region 1 (S. 93): lückenhafte Zeilen in der richtigen Spalte', () => {
    expect(getInsurerAllFranchises(1562, 'BE', 1, 'kind', true, im2027)).toEqual([{ franchise: 0, premium: 152.7 }, { franchise: 500, premium: 123.6 }]);
    expect(getInsurerAllFranchises(1401, 'BE', 1, 'kind', true, im2027).map(f => f.franchise)).toEqual([0, 300, 600]);
    expect(getInsurerPremium(941, 'BE', 1, 'kind', 600, true, im2027)).toBe(135); // Sodalis: 500 und 600 gleich, so in der PDF
    expect(getInsurerPremium(1542, 'BE', 1, 'kind', 0, true, im2027)).toBe(175.6); // Assura «Ein Kind» = Grundtarif
  });

  it('Ausreisser zu 2026 sind echt: Agrisano GE, Vivao Sympany GL, SLKK SG 3 (S. 181/194/348)', () => {
    expect(getInsurerPremium(1560, 'GE', 0, 'erwachsen', 300, true, im2027)).toBe(849.8);
    expect(getInsurerPremium(509, 'GL', 0, 'erwachsen', 300, true, im2027)).toBe(636);
    expect(getInsurerPremium(923, 'SG', 3, 'erwachsen', 2500, false, im2027)).toBe(396.1);
  });

  it('2027 nicht mehr zugelassen (AMB 1507, Vallée d’Entremont 1113): 2026 noch da, 2027 nicht', () => {
    expect(allInsurerNrs(im2026)).toEqual(expect.arrayContaining([1507, 1113]));
    expect(allInsurerNrs(im2027)).not.toContain(1507);
    expect(allInsurerNrs(im2027)).not.toContain(1113);
    expect(allInsurerNrs(im2027)).toHaveLength(32);
    expect(getInsurerCantons(1507, im2027)).toEqual([]);
  });

  it('2026 unverändert erreichbar', () => {
    expect(getInsurerPremium(8, 'AG', 0, 'erwachsen', 300, true, im2026)).toBeGreaterThan(0);
    expect(getInsurerPremium(8, 'AG', 0, 'erwachsen', 300, true, im2027)).not.toBe(getInsurerPremium(8, 'AG', 0, 'erwachsen', 300, true, im2026));
  });
});

describe('po.source', () => {
  it('trägt {jahr} statt einer festen Jahreszahl, in allen fünf Sprachen', () => {
    for (const s of [de, en, fr, itSprache, rm]) {
      expect(s.po.source).toContain('{jahr}');
      expect(s.po.source).not.toMatch(/20\d\d/);
    }
  });
});
