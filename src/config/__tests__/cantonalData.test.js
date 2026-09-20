import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SKOS_GRUNDBEDARF, getGrundbedarf, calculateSozialhilfe, calculateIPV, checkELEligibility, CANTONAL_IPV, CANTON_CODES } from '../cantonalData.js';
import { grundbedarfFuerHaushalt, berechneSozialhilfe } from '../../data/sozialhilfeRechner.js';
import { vermoegensfreibetragUnbestaetigt } from '../../data/vermoegensfreibetragUnbestaetigt.js';
import { kantoneBelegtSimulieren } from './ipvBelegtSimulieren.js';

describe('SKOS_GRUNDBEDARF (cantonalData)', () => {
  it('matches the official SKOS GBL 2025/2026 scale (SKOS-RL C.3.1)', () => {
    expect(SKOS_GRUNDBEDARF).toEqual({
      1: 1061,
      2: 1624,
      3: 1974,
      4: 2271,
      5: 2568,
      6: 2784,
      7: 3000,
    });
  });

  it('adds CHF 216 per person beyond 7', () => {
    expect(getGrundbedarf(8)).toBe(3216);
    expect(getGrundbedarf(10)).toBe(3648);
  });

  it('falls back to 1-person GBL for invalid sizes', () => {
    expect(getGrundbedarf(0)).toBe(1061);
    expect(getGrundbedarf(-1)).toBe(1061);
  });

  // Guard against the two SKOS sources drifting apart again:
  // getGrundbedarf (cantonalData) must agree with grundbedarfFuerHaushalt (sozialhilfeRechner)
  // for every realistic household size — both render in the same SozialhilfeView.
  it('stays consistent with sozialhilfeRechner.grundbedarfFuerHaushalt for 1–12 persons', () => {
    for (let n = 1; n <= 12; n++) {
      expect(getGrundbedarf(n)).toBe(grundbedarfFuerHaushalt(n));
    }
  });
});

// Entscheid 16.09.2026: Vermögensfreibetrag je Kanton. Beide Rechenwege (Sozialhilfe-
// Ansicht über cantonalData, Rechner über sozialhilfeRechner) müssen für jeden Kanton
// und jede Haushaltsform denselben Betrag liefern.
describe('calculateSozialhilfe — Vermögensfreibetrag je Kanton', () => {
  const haushalte = [[1, 0], [2, 0], [1, 2], [2, 1], [2, 5]];
  it('stimmt für alle 26 Kantone mit berechneSozialhilfe überein', () => {
    expect(CANTON_CODES).toHaveLength(26);
    for (const canton of CANTON_CODES) {
      for (const [adults, kids] of haushalte) {
        const a = calculateSozialhilfe({
          basis: { canton, household: { adults, children: Array.from({ length: kids }, () => ({ age: 5 })) } },
          finanzen: {}, wohnen: {}, versicherungen: {},
        });
        const b = berechneSozialhilfe({ adults, kinderImHaushalt: kids, kanton: canton });
        expect(a.vermoegensfreibetrag, `${canton} ${adults}/${kids}`).toBe(b.vermoegensfreibetrag);
      }
    }
  });

  it('BS (Unterstützungsrichtlinien WSU Ziff. 14): Paar mit Kind 20000, nicht gekennzeichnet', () => {
    const r = calculateSozialhilfe({
      basis: { canton: 'BS', household: { adults: 2, children: [{ age: 3 }] } },
      finanzen: { savingsAccount: 19000 }, wohnen: {}, versicherungen: {},
    });
    expect(r.vermoegensfreibetrag).toBe(20000);
    expect(r.vermoegenUeberFreibetrag).toBe(0);
    expect(vermoegensfreibetragUnbestaetigt(r.canton)).toBe(false);
  });

  it('SH mit Kind (Zuschlag nicht geregelt): 4000, gekennzeichnet nur mit Kindern', () => {
    const r = calculateSozialhilfe({
      basis: { canton: 'SH', household: { adults: 2, children: [{ age: 7 }, { age: 19 }] } },
      finanzen: {}, wohnen: {}, versicherungen: {},
    });
    expect(r.vermoegensfreibetrag).toBe(4000);
    const minor = r.children.filter(c => c.age < 18).length;
    expect(vermoegensfreibetragUnbestaetigt(r.canton, minor)).toBe(true);
    expect(vermoegensfreibetragUnbestaetigt(r.canton, 0)).toBe(false);
  });

  it('BL (nur SKOS-Karte, 2200): gekennzeichnet', () => {
    const r = calculateSozialhilfe({ basis: { canton: 'BL' }, finanzen: { savingsAccount: 3000 }, wohnen: {}, versicherungen: {} });
    expect(r.vermoegensfreibetrag).toBe(2200);
    expect(r.vermoegenUeberFreibetrag).toBe(800);
    expect(vermoegensfreibetragUnbestaetigt(r.canton)).toBe(true);
  });
});

describe('calculateSozialhilfe — Vermögensfreibetrag (SKOS-RL D.3.1, ab 1.1.2026)', () => {
  // Minimal valid data; only the fields the Vermögen logic reads matter here.
  const calc = (overrides = {}) => calculateSozialhilfe({
    basis: { canton: 'ZH' },
    finanzen: {},
    wohnen: {},
    versicherungen: {},
    ...overrides,
  });

  it('grants a CHF 6000 allowance for a single person', () => {
    expect(calc().vermoegensfreibetrag).toBe(6000);
  });

  it('follows the tiered SKOS D.3.1 schedule (12000 couple, +3000 per minor child, max 15000)', () => {
    const couple = calc({ basis: { canton: 'ZH', household: { adults: 2, children: [] } } });
    expect(couple.vermoegensfreibetrag).toBe(12000); // Paar → 12000

    const coupleOneChild = calc({ basis: { canton: 'ZH', household: { adults: 2, children: [{ age: 4 }] } } });
    expect(coupleOneChild.vermoegensfreibetrag).toBe(15000); // 12000 + 1×3000

    const family = calc({ basis: { canton: 'ZH', household: { adults: 2, children: [{ age: 4 }, { age: 8 }] } } });
    expect(family.vermoegensfreibetrag).toBe(15000); // 12000 + 2×3000 → gedeckelt bei 15000
  });

  it('counts only minor children toward the SKOS D.3.1 allowance', () => {
    const adultChild = calc({ basis: { canton: 'ZH', household: { adults: 2, children: [{ age: 20 }] } } });
    expect(adultChild.vermoegensfreibetrag).toBe(12000); // volljähriges Kind zählt nicht
  });

  it('sums securities + otherAssets + savingsAccount into Vermögen', () => {
    const r = calc({ finanzen: { securitiesValue: 10000, otherAssets: 5000, savingsAccount: 3000 } });
    expect(r.vermoegen).toBe(18000);
  });

  it('reports the excess above the allowance', () => {
    const r = calc({ finanzen: { securitiesValue: 20000 } }); // single → allowance 6000
    expect(r.vermoegenUeberFreibetrag).toBe(14000);
  });

  it('reports no excess when assets stay within the allowance', () => {
    expect(calc({ finanzen: { savingsAccount: 3000 } }).vermoegenUeberFreibetrag).toBe(0);
  });

  it('parses string asset values (as stored from form inputs)', () => {
    expect(calc({ finanzen: { securitiesValue: '20000' } }).vermoegen).toBe(20000);
  });

  it('treats missing or non-numeric asset fields as zero', () => {
    const r = calc({ finanzen: { securitiesValue: '', otherAssets: undefined } });
    expect(r.vermoegen).toBe(0);
    expect(r.vermoegenUeberFreibetrag).toBe(0);
  });
});

// K31: ZH ist seit 19.09.2026 belegt, BE und AG seit 20.09.2026 — alle drei mit eigenem
// Modell (Tests in ipvZuerich.test.js, ipvBern.test.js bzw. ipvAargau.test.js).
const EIGENES_MODELL = ['ZH', 'BE', 'AG'];
const UNBELEGT = Object.keys(CANTONAL_IPV).filter((k) => !EIGENES_MODELL.includes(k));

describe('calculateIPV — E9: ohne amtlichen Beleg kein Betrag', () => {
  it('alle 26 Kantone tragen das Feld beleg (Flag + Quelle/Stand): 23 null, ZH, BE und AG mit Quelle', () => {
    const zeilen = Object.entries(CANTONAL_IPV);
    expect(zeilen).toHaveLength(26);
    expect(UNBELEGT).toHaveLength(23);
    for (const k of UNBELEGT) expect(CANTONAL_IPV[k]).toHaveProperty('beleg', null);
    for (const k of EIGENES_MODELL) expect(CANTONAL_IPV[k].beleg.quelle).toBeTruthy();
  });

  it.each(UNBELEGT)('%s: kein Betrag, kein «berechtigt», keine Grenze — tief und hoch dieselbe Ausgabe', (canton) => {
    const ausgabe = (monthlyIncome, kkPremium) => calculateIPV({ basis: { canton }, finanzen: { monthlyIncome }, versicherungen: { kkPremium } });
    for (const kkPremium of [0, 400]) {
      const tief = ausgabe(500, kkPremium);
      for (const monthlyIncome of [0, 1500, 3000, 6000, 20000, 60000]) expect(ausgabe(monthlyIncome, kkPremium)).toEqual(tief);
      expect(tief.anspruchMoeglich).toBe(kkPremium > 0);
    }
    for (const monthlyIncome of [0, 1500, 3000, 6000, 20000]) {
      const r = calculateIPV({ basis: { canton }, finanzen: { monthlyIncome } });
      expect(r.belegt).toBe(false);
      expect(r.eligible).toBe(false);
      expect(r.amount).toBeNull();
      expect(r.annual).toBeUndefined();
      expect(r.maxAnnual).toBeUndefined();
      expect(r.cantonData).toBeUndefined();
      expect(r.noteKey).not.toBe('ipv.incomeAboveLimit');
      expect(r.noteKey).toBe('ipv.orientierungOffen');
    }
  });

  it('prüfenswert hängt nur an der erfassten Prämie, nie an der (unbelegten) Grenze', () => {
    const r = (monthlyIncome, kkPremium) => calculateIPV({ basis: { canton: 'LU' }, finanzen: { monthlyIncome }, versicherungen: { kkPremium } }).anspruchMoeglich;
    expect(r(1000, 300)).toBe(true);
    expect(r(50000, 300)).toBe(true);
    expect(r(1000, 0)).toBe(false);
  });

  it('ein beleg ohne quelle zählt nicht als belegt', () => {
    const vorher = CANTONAL_IPV.LU.beleg;
    CANTONAL_IPV.LU.beleg = { quelle: '', stand: '2026' };
    try {
      expect(calculateIPV({ basis: { canton: 'LU' }, finanzen: { monthlyIncome: 1000 } }).amount).toBeNull();
    } finally {
      CANTONAL_IPV.LU.beleg = vorher;
    }
  });
});

describe('calculateIPV — kantonale Prämienverbilligung (belegter Kanton, simuliert)', () => {
  // Tests reference the canonical CANTONAL_IPV table (no duplicated magic numbers),
  // so they verify the model — not a snapshot of yearly-updated figures.
  // E9: das Modell rechnet nur für amtlich belegte Kantone; hier simuliert.
  // K31: bis 19.09.2026 lief dieser Block mit ZH, danach mit BE; beide haben jetzt ein
  // eigenes Modell. Der lineare Abbau gilt weiter für die übrigen 24 Kantone — darum hier LU.
  let zuruecksetzen;
  beforeAll(() => { zuruecksetzen = kantoneBelegtSimulieren(['LU']); });
  afterAll(() => zuruecksetzen());
  const zh = CANTONAL_IPV.LU;
  const ipv = (overrides = {}) => calculateIPV({
    basis: { canton: 'LU' },
    finanzen: {},
    ...overrides,
  });

  it('returns not eligible for an unknown canton', () => {
    const r = calculateIPV({ basis: { canton: 'XX' }, finanzen: {} });
    expect(r.eligible).toBe(false);
    expect(r.amount).toBe(0);
    expect(r.noteKey).toBe('ipv.cantonUnknown');
  });

  it('grants the full single subsidy at zero income', () => {
    const r = ipv({ finanzen: { monthlyIncome: 0 } });
    expect(r.eligible).toBe(true);
    expect(r.belegt).toBe(true);
    expect(r.anspruchMoeglich).toBe(true);
    expect(r.reductionPercent).toBe(100);
    expect(r.maxAnnual).toBe(zh.subsidySingle);
    expect(r.annual).toBe(zh.subsidySingle);
    expect(r.amount).toBe(Math.round(zh.subsidySingle / 12));
  });

  it('uses the family subsidy plus per-child amount when children are present', () => {
    const r = ipv({
      basis: { canton: 'LU', household: { adults: 1, children: [{ age: 5 }, { age: 8 }] } },
      finanzen: { monthlyIncome: 0 },
    });
    expect(r.maxAnnual).toBe(zh.subsidyFamily + 2 * zh.subsidyChild);
  });

  it('is not eligible when annual income exceeds the cantonal limit', () => {
    const overLimit = Math.ceil(zh.maxIncome / 12) + 100; // monthly → annual clearly above maxIncome
    const r = ipv({ finanzen: { monthlyIncome: overLimit } });
    expect(r.eligible).toBe(false);
    expect(r.noteKey).toBe('ipv.incomeAboveLimit');
    expect(r.noteParams.value).toBe(zh.maxIncome);
  });

  it('decays monotonically: higher income → lower subsidy', () => {
    const low = ipv({ finanzen: { monthlyIncome: 1000 } });
    const high = ipv({ finanzen: { monthlyIncome: 3000 } });
    expect(low.eligible).toBe(true);
    expect(high.eligible).toBe(true);
    expect(low.amount).toBeGreaterThan(high.amount);
  });

  it('counts partner income towards the income limit', () => {
    // single monthly income alone is well within the limit, partner income pushes it over
    const r = ipv({ basis: { canton: 'LU', household: { adults: 2, partnerIncome: 4000 } }, finanzen: { monthlyIncome: 1000 } });
    expect(r.eligible).toBe(false); // (1000 + 4000) × 12 = 60000 > 54000 (LU-Musterwert)
  });
});

describe('checkELEligibility — Ergänzungsleistungen', () => {
  const el = (overrides = {}) => checkELEligibility({
    basis: {},
    finanzen: {},
    wohnen: {},
    versicherungen: {},
    ...overrides,
  });

  it('is never eligible without an AHV or IV pension', () => {
    const r = el({ finanzen: { monthlyIncome: 0 }, wohnen: { rentAmount: 2000 } });
    expect(r.isAHVIV).toBe(false);
    expect(r.eligible).toBe(false);
    expect(r.noteKey).toBe('elCalc.onlyAhvIv');
  });

  it('is possible with an AHV pension and a gap below the threshold', () => {
    const r = el({ finanzen: { ahvRente: 1500 }, wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 400 } });
    expect(r.isAHVIV).toBe(true);
    expect(r.totalIncome).toBe(1500);
    expect(r.totalExpenses).toBe(1600);
    expect(r.eligible).toBe(true); // 1500 < 1600 + 2000
    expect(r.noteKey).toBe('elCalc.possible');
  });

  it('also recognises an IV pension', () => {
    const r = el({ finanzen: { ivRente: 1400 }, wohnen: { rentAmount: 1000 }, versicherungen: { kkPremium: 350 } });
    expect(r.isAHVIV).toBe(true);
    expect(r.eligible).toBe(true);
  });

  it('is not eligible when income clears expenses plus the CHF 2000 buffer', () => {
    const r = el({ finanzen: { ahvRente: 6000 }, wohnen: { rentAmount: 1000 }, versicherungen: { kkPremium: 300 } });
    expect(r.isAHVIV).toBe(true);
    expect(r.eligible).toBe(false); // 6000 >= 1300 + 2000
  });

  it('counts partner income in totalIncome', () => {
    const r = el({ basis: { household: { adults: 2, partnerIncome: 1000 } }, finanzen: { ahvRente: 1000 } });
    expect(r.totalIncome).toBe(2000); // (0 + 1000 partner) + 1000 AHV
  });
});

// R4 (16.09.2026): der verwaiste Datei-Stand '2024/2025' ist weg (nirgends angezeigt).
describe('cantonalData: kein verwaister Datei-Stand', () => {
  it('exportiert CANTONAL_DATA_VERSION nicht mehr', async () => {
    const m = await import('../cantonalData.js');
    expect('CANTONAL_DATA_VERSION' in m).toBe(false);
  });
});
