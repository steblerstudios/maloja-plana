import { describe, it, expect } from 'vitest';
import {
  grundbedarfFuerHaushalt,
  einkommensfreibetrag,
  berechneSozialhilfe,
  vergleicheHaushaltGroessen,
  berechneExistenzminimum,
  SKOS_PARAMS,
  SKOS_DATA_VERSION,
} from '../sozialhilfeRechner.js';

describe('SKOS_PARAMS', () => {
  it('exports version and key constants', () => {
    expect(SKOS_DATA_VERSION).toBe('2025-01');
    expect(SKOS_PARAMS.gblEinperson).toBe(1061);
    expect(SKOS_PARAMS.efbMax).toBe(700);
    expect(SKOS_PARAMS.izuStandard).toBe(200);
    expect(SKOS_PARAMS.franchiseStandard).toBe(300);
  });
});

describe('grundbedarfFuerHaushalt', () => {
  it('returns correct GBL for 1–7 persons', () => {
    expect(grundbedarfFuerHaushalt(1)).toBe(1061);
    expect(grundbedarfFuerHaushalt(2)).toBe(1624);
    expect(grundbedarfFuerHaushalt(3)).toBe(1974);
    expect(grundbedarfFuerHaushalt(4)).toBe(2271);
    expect(grundbedarfFuerHaushalt(5)).toBe(2568);
    expect(grundbedarfFuerHaushalt(6)).toBe(2784);
    expect(grundbedarfFuerHaushalt(7)).toBe(3000);
  });

  it('adds CHF 216 per person beyond 7', () => {
    expect(grundbedarfFuerHaushalt(8)).toBe(3216);
    expect(grundbedarfFuerHaushalt(10)).toBe(3648);
  });

  it('returns 0 for invalid input', () => {
    expect(grundbedarfFuerHaushalt(0)).toBe(0);
    expect(grundbedarfFuerHaushalt(-1)).toBe(0);
  });
});

describe('einkommensfreibetrag', () => {
  it('returns 0 for no income', () => {
    expect(einkommensfreibetrag(0)).toBe(0);
    expect(einkommensfreibetrag(-500)).toBe(0);
  });

  it('calculates EFB with 33% above CHF 400', () => {
    const efb = einkommensfreibetrag(1000);
    expect(efb).toBe(598); // 400 + (1000-400)*0.33 = 598
  });

  it('caps EFB at CHF 700', () => {
    expect(einkommensfreibetrag(5000)).toBe(700);
  });
});

describe('berechneSozialhilfe', () => {
  it('calculates basic case: single person, no income', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 1,
      miete: 1200,
      krankenkassePraemie: 380,
    });
    expect(r.gbl).toBe(1061);
    expect(r.wohnkosten).toBe(1200);
    expect(r.bedarf).toBe(1061 + 1200 + 380);
    expect(r.sozialhilfeAnspruch).toBe(r.bedarf);
    expect(r.hatAnspruch).toBe(true);
  });

  it('reduces support by earned income minus EFB', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 1,
      miete: 1200,
      krankenkassePraemie: 380,
      erwerbseinkommen: 2000,
      erwerbstaetig: true,
    });
    const efb = einkommensfreibetrag(2000);
    expect(r.efb).toBe(efb);
    expect(r.anrechenbaresEinkommen).toBe(2000 - efb);
    expect(r.sozialhilfeAnspruch).toBe(r.bedarf - r.anrechenbaresEinkommen);
  });

  it('adds IZU for integration measures (non-employed)', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 1,
      miete: 1200,
      krankenkassePraemie: 380,
      integrationsMassnahme: true,
      erwerbstaetig: false,
    });
    expect(r.izu).toBe(200);
    expect(r.totalUnterstuetzung).toBe(r.sozialhilfeAnspruch + 200);
  });

  it('no IZU when employed', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 1,
      miete: 1200,
      krankenkassePraemie: 380,
      integrationsMassnahme: true,
      erwerbstaetig: true,
      erwerbseinkommen: 1000,
    });
    expect(r.izu).toBe(0);
  });

  it('denies claim when assets exceed Vermögensfreibetrag', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 1,
      miete: 1200,
      krankenkassePraemie: 380,
      vermoegen: 10000,
    });
    expect(r.vermoegensfreibetrag).toBe(4000);
    expect(r.anrechenbaresVermoegen).toBe(6000);
    expect(r.hatAnspruch).toBe(false);
  });

  it('Vermögensfreibetrag scales with household size', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 4,
      miete: 1800,
      krankenkassePraemie: 500,
      vermoegen: 8000,
    });
    expect(r.vermoegensfreibetrag).toBe(10000); // 4000 + 3*2000
    expect(r.hatAnspruch).toBe(true);
  });

  it('no claim when income exceeds needs', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 1,
      miete: 1000,
      krankenkassePraemie: 300,
      erwerbseinkommen: 5000,
      erwerbstaetig: true,
    });
    expect(r.sozialhilfeAnspruch).toBe(0);
    expect(r.hatAnspruch).toBe(false);
  });

  it('handles family of 4', () => {
    const r = berechneSozialhilfe({
      haushaltGroesse: 4,
      miete: 1800,
      krankenkassePraemie: 800,
      erwerbseinkommen: 3000,
      erwerbstaetig: true,
      kinderImHaushalt: 2,
    });
    expect(r.gbl).toBe(2271);
    expect(r.bedarf).toBe(2271 + 1800 + 800);
    expect(r.kinderImHaushalt).toBe(2);
    expect(r.sozialhilfeAnspruch).toBeGreaterThan(0);
  });
});

describe('vergleicheHaushaltGroessen', () => {
  it('returns 7 entries with decreasing per-person GBL', () => {
    const vgl = vergleicheHaushaltGroessen(1200, 380);
    expect(vgl).toHaveLength(7);
    expect(vgl[0].personen).toBe(1);
    expect(vgl[0].gbl).toBe(1061);
    for (let i = 1; i < vgl.length; i++) {
      expect(vgl[i].gblProPerson).toBeLessThan(vgl[i - 1].gblProPerson);
    }
  });
});

describe('berechneExistenzminimum', () => {
  it('sums GBL + Miete + KVG', () => {
    const r = berechneExistenzminimum({
      haushaltGroesse: 2,
      miete: 1500,
      krankenkassePraemie: 600,
    });
    expect(r.gbl).toBe(1624);
    expect(r.existenzminimum).toBe(1624 + 1500 + 600);
    expect(r.existenzminimumJahr).toBe(r.existenzminimum * 12);
  });
});
