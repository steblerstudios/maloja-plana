import { describe, it, expect } from 'vitest';
import { berechneTaggeld, bestimmeSatz, bestimmeWartetage, bestimmeAnspruchstage, ALV_PARAMS } from '../alvRechner.js';

describe('bestimmeSatz', () => {
  it('80 % bei Unterhaltspflicht', () => {
    expect(bestimmeSatz({ versicherterVerdienst: 8000, hatKinder: true, ivGrad40: false })).toBe(0.8);
  });
  it('80 % bei vers. Verdienst ≤ 3797', () => {
    expect(bestimmeSatz({ versicherterVerdienst: 3797, hatKinder: false, ivGrad40: false })).toBe(0.8);
    expect(bestimmeSatz({ versicherterVerdienst: 3500, hatKinder: false, ivGrad40: false })).toBe(0.8);
  });
  it('80 % bei IV-Grad ≥ 40 %', () => {
    expect(bestimmeSatz({ versicherterVerdienst: 9000, hatKinder: false, ivGrad40: true })).toBe(0.8);
  });
  it('70 % sonst', () => {
    expect(bestimmeSatz({ versicherterVerdienst: 6000, hatKinder: false, ivGrad40: false })).toBe(0.7);
  });
});

describe('bestimmeWartetage', () => {
  it('0 Tage bis CHF 3000', () => {
    expect(bestimmeWartetage({ versicherterVerdienst: 3000, hatKinder: false })).toBe(0);
  });
  it('mit Unterhaltspflicht: 3001–5000 → 0, ab 5001 → 5', () => {
    expect(bestimmeWartetage({ versicherterVerdienst: 4500, hatKinder: true })).toBe(0);
    expect(bestimmeWartetage({ versicherterVerdienst: 5001, hatKinder: true })).toBe(5);
    expect(bestimmeWartetage({ versicherterVerdienst: 12000, hatKinder: true })).toBe(5);
  });
  it('ohne Unterhaltspflicht: gestaffelt 5/10/15/20', () => {
    expect(bestimmeWartetage({ versicherterVerdienst: 4500, hatKinder: false })).toBe(5);
    expect(bestimmeWartetage({ versicherterVerdienst: 7000, hatKinder: false })).toBe(10);
    expect(bestimmeWartetage({ versicherterVerdienst: 9000, hatKinder: false })).toBe(15);
    expect(bestimmeWartetage({ versicherterVerdienst: 11000, hatKinder: false })).toBe(20);
  });
});

describe('bestimmeAnspruchstage', () => {
  it('null bei Beitragszeit < 12 Monate', () => {
    expect(bestimmeAnspruchstage({ beitragsmonate: 6, alter: 40 })).toBeNull();
  });
  it('260 bei 12–<18 Monaten', () => {
    expect(bestimmeAnspruchstage({ beitragsmonate: 14, alter: 40, hatKinder: false })).toBe(260);
  });
  it('400 bei ≥18 Monaten', () => {
    expect(bestimmeAnspruchstage({ beitragsmonate: 20, alter: 40, hatKinder: false })).toBe(400);
  });
  it('520 ab 55 mit ≥22 Monaten', () => {
    expect(bestimmeAnspruchstage({ beitragsmonate: 24, alter: 56, hatKinder: false })).toBe(520);
  });
  it('200 bei <25 ohne Unterhaltspflicht', () => {
    expect(bestimmeAnspruchstage({ beitragsmonate: 20, alter: 22, hatKinder: false })).toBe(200);
  });
});

describe('berechneTaggeld', () => {
  it('kein Anspruch unter CHF 500', () => {
    expect(berechneTaggeld({ versicherterVerdienst: 400 }).anspruch).toBe(false);
  });
  it('70 %: 6000 → Taggeld ≈ 193.55, monatlich 4200', () => {
    const r = berechneTaggeld({ versicherterVerdienst: 6000, hatKinder: false, ivGrad40: false, beitragsmonate: 14, alter: 40 });
    expect(r.satz).toBe(0.7);
    expect(r.monatlich).toBe(4200);
    expect(r.taggeld).toBeCloseTo(6000 * 0.7 / 21.7, 1);
    expect(r.wartetage).toBe(10);
    expect(r.anspruchstage).toBe(260);
    expect(r.gedeckelt).toBe(false);
  });
  it('deckelt versicherter Verdienst auf 12350', () => {
    const r = berechneTaggeld({ versicherterVerdienst: 15000, hatKinder: true, beitragsmonate: 24, alter: 40 });
    expect(r.versicherterVerdienst).toBe(ALV_PARAMS.versicherterVerdienstMax);
    expect(r.gedeckelt).toBe(true);
    expect(r.satz).toBe(0.8);
    expect(r.monatlich).toBe(Math.round(12350 * 0.8));
  });
});
