import { describe, it, expect } from 'vitest';
import {
  praemienJahr, PRAEMIEN_JAHRE, getAveragePremium, getRegionInfo, getRegion, getRegionalComparison,
  nationalAvgPremium, NATIONAL_AVG_PREMIUM,
} from '../praemienRegionen.js';

// Prämien 2027 (BAG priminfo, praemienregionen-2027.xlsx, Stand 22.10.2026) neben 2026 — gerechnet wird mit
// dem Jahr des Stichtags. Werte unten aus der Datei abgelesen (Zürich Region 1, BFS 261).
const im2026 = new Date(2026, 9, 25);
const im2027 = new Date(2027, 0, 1);

describe('Prämienjahre', () => {
  it('2026 und 2027 vorhanden; Stichtag wählt das Jahr, ausserhalb das nächstliegende', () => {
    expect(PRAEMIEN_JAHRE).toEqual([2026, 2027]);
    expect(praemienJahr(im2026)).toBe(2026);
    expect(praemienJahr(new Date(2026, 11, 31, 23, 59))).toBe(2026);
    expect(praemienJahr(im2027)).toBe(2027);
    expect(praemienJahr(new Date(2025, 5, 1))).toBe(2026);
    expect(praemienJahr(new Date(2028, 5, 1))).toBe(2027);
  });

  it('heute (feste Test-Uhr 22.10.2026) rechnet mit 2026', () => {
    expect(getAveragePremium('261').jahr).toBe(2026);
    expect(NATIONAL_AVG_PREMIUM.year).toBe(2026);
  });

  it('ab 1.1.2027 höhere Prämien als 2026, gleiche Region', () => {
    const a = getAveragePremium('261', im2026), b = getAveragePremium('261', im2027);
    expect(b.jahr).toBe(2027);
    expect(b.region).toBe(a.region);
    expect(b.erwachsene).toBeGreaterThan(a.erwachsene);
    expect(b.kinder).toBeGreaterThan(a.kinder);
  });

  it('Zürich Region 3 (Aeugst am Albis, BFS 1): 2027 = 120.8 / 306.2 / 447.2 laut BAG-Datei', () => {
    expect(getAveragePremium('1', im2027)).toMatchObject({ kinder: 120.8, junge: 306.2, erwachsene: 447.2, region: 3, kanton: 'ZH' });
  });

  it('fusionierte Gemeinde (Fétigny FR, BFS 2016) bleibt 2027 auffindbar — Prämie der Kantonsregion', () => {
    const alt = getRegionInfo('2016', im2027), neu = getRegionInfo('2056', im2027); // Fétigny-Ménières
    expect(neu).not.toBeNull();
    expect(alt.region).toBe(neu.region);
    expect(alt.praemien).toEqual(neu.praemien);
    expect(getRegion('2016')).toBe(getRegion('2056'));
  });

  it('neue Gemeinde 2027 (La Vallée de Joux, BFS 5940) hat auch 2026 die Prämie ihrer Region', () => {
    expect(getAveragePremium('5940', im2026)?.jahr).toBe(2026);
  });

  it('Schweizer Schnitt je Jahr (BAG-Medienmitteilung 29.09.2026)', () => {
    expect(nationalAvgPremium(im2027)).toMatchObject({ erwachsene: 487.6, junge: 338.8, kinder: 128.1, gesamt: 412, year: 2027 });
    expect(nationalAvgPremium(im2026).erwachsene).toBe(465.3);
  });

  it('Vergleich nimmt Region und Schnitt aus demselben Jahr', () => {
    const c = getRegionalComparison('261', '1990-01-01', im2027);
    expect(c.year).toBe(2027);
    expect(c.national).toBe(487.6);
    expect(c.regional).toBe(getAveragePremium('261', im2027).erwachsene);
  });
});

// Das Etikett nennt das Jahr der angezeigten Werte, nicht fest «2026» (Fachprüfung 25.10.2026).
import de from '../../i18n/de.js';
import en from '../../i18n/en.js';
import fr from '../../i18n/fr.js';
import itSprache from '../../i18n/it.js';
import rm from '../../i18n/rm.js';
describe('po.avgPremium', () => {
  it('trägt {jahr} statt einer festen Jahreszahl, in allen fünf Sprachen', () => {
    for (const s of [de, en, fr, itSprache, rm]) {
      expect(s.po.avgPremium).toContain('{jahr}');
      expect(s.po.avgPremium).not.toMatch(/20\d\d/);
    }
  });
});
