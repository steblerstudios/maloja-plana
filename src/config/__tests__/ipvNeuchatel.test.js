import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_NE, ipvNeuchatelRechnen, neKlasse, neRevenuDeterminant } from '../ipvNeuchatel.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';
import { SAEULE_3A } from '../kantonsModell.js';

// K31 — Prämienverbilligung Kanton Neuenburg 2026, Klassen S1–S15.
// Quellen (an der Quelle gelesen 2026-09-28), Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt NE:
//  [1] Arrêté RSN 821.102 du 12.11.2025, État au 1er janvier 2026 — Art. 3, 5, 7, 11, 12, 16, Annexe
//  [2] Décret RSN 821.104 du 2.12.2025 (subsides extraordinaires 2026), État au 15 janvier 2026 — Art. 3, 4, 6
//  [3] OCAB, «Normes de classification valables en 2026», 11.12.2025 (Réf. OCAB25-006)
//  [4] LILAMal RSN 821.10 Art. 14 al. 4 — höchstens die Prämie
//  [7] ne.ch, «Classifications et montants» (geändert 08.09.2026)
//
// Ein amtliches Rechenbeispiel einer Einstufung gibt es nicht. Der Prüfstein ist darum die
// Übereinstimmung zweier amtlicher Wege: [1] + [2] muss Zeile für Zeile die Tabelle von [3]/[7]
// ergeben (dort «Arrêté du 12.11.2025 (CE) + Décret du 02.12.2025 (GC)»).

describe('K31 calculateIPV für NE, bevor das NE-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'NE', dateOfBirth: '1980-05-01' }, finanzen: { monthlyIncome: 2000 }, versicherungen: { kkPremium: 500, franchise: '300' } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 NE: Beträge [1] Art. 11 + [2] Art. 4 = Tabelle des OCAB [3] / der Kantonsseite [7]', () => {
  // [3] und [7], Spalte «Adultes (dès 26 ans)», S1 … S15 — beide dieselben Zahlen.
  const OCAB = [611, 579, 515, 453, 390, 328, 272, 216, 166, 110, 91, 78, 66, 53, 41];

  it('[1] Art. 11 al. 1, Erwachsene ab 26, wörtlich', () => {
    expect(IPV_NE.erwachsene).toEqual([611, 579, 514, 450, 386, 322, 264, 206, 154, 96, 77, 64, 51, 39, 26]);
  });
  it('[2] Art. 4 al. 1, Zuschlag Erwachsene ab 26, wörtlich (S1/S2 leer)', () => {
    expect(IPV_NE.erwachseneZuschlag).toEqual([0, 0, 1, 3, 4, 6, 8, 10, 12, 14, 14, 14, 15, 14, 15]);
  });
  it('🛑 die Summe ist genau die Tabelle des OCAB — der «Widerspruch» vom 16.09. war der Décret', () => {
    expect(IPV_NE.erwachsene.map((b, i) => b + IPV_NE.erwachseneZuschlag[i])).toEqual(OCAB);
  });
  it('jede Klasse, eine Person ohne Kind (S1–S10) und mit einem Kind (S1–S15), über die Rechnung', () => {
    const g0 = IPV_NE.grenzen[0];
    g0.forEach((bis, i) => expect(ipvNeuchatelRechnen({ kinderZahl: 0, rd: bis }).monat).toBe(OCAB[i]));
    const g1 = IPV_NE.grenzen[1];
    g1.forEach((bis, i) => expect(ipvNeuchatelRechnen({ kinderZahl: 1, rd: bis }).monat).toBe(OCAB[i] + 160));
  });
  it('Kinder: 160 in allen Klassen [1] Art. 11; der Décret hat keine Kinderspalte', () => {
    expect(IPV_NE.kind).toBe(160);
  });
});

describe('K31 NE: Grenzen der Annexe [1] (= [3])', () => {
  it('Person allein ohne Kind: S1 bis 22 800, Stufen von 1 140, S10 bis 50 600 — dann Schluss', () => {
    expect(IPV_NE.grenzen[0]).toEqual([22800, 23940, 25080, 26220, 27360, 28500, 29640, 30780, 31920, 50600]);
    for (let i = 1; i < 9; i++) expect(IPV_NE.grenzen[0][i] - IPV_NE.grenzen[0][i - 1]).toBe(1140);
  });
  it('mit 1, 2, 3 Kindern: 15 Klassen, oberste Grenze 65 089 / 72 824 / 80 560', () => {
    expect(IPV_NE.grenzen[1]).toEqual([33000, 34140, 35280, 36420, 37560, 38700, 39840, 40980, 42120, 44400, 45540, 56148, 57156, 58164, 65089]);
    expect(IPV_NE.grenzen[2].at(-1)).toBe(72824);
    expect(IPV_NE.grenzen[3].at(-1)).toBe(80560);
    expect(IPV_NE.grenzen[10].at(-1)).toBe(134706);
    expect(IPV_NE.grenzen).toHaveLength(11);
    for (let k = 1; k <= 10; k++) expect(IPV_NE.grenzen[k]).toHaveLength(15);
  });
  it('jede Tabelle steigt streng — sonst wäre eine Klasse leer', () => {
    for (const g of IPV_NE.grenzen) for (let i = 1; i < g.length; i++) expect(g[i]).toBeGreaterThan(g[i - 1]);
  });
  it('Grenzen einschliesslich ([1] Art. 3 «égal ou inférieur»): 22 800 ist S1, 22 801 S2', () => {
    expect(neKlasse(22800, 0)).toBe(1);
    expect(neKlasse(22801, 0)).toBe(2);
    expect(neKlasse(50600, 0)).toBe(10);
    expect(neKlasse(50601, 0)).toBeNull();
    expect(neKlasse(0, 0)).toBe(1);
    expect(neKlasse(65089, 1)).toBe(15);
    expect(neKlasse(65090, 1)).toBeNull();
    expect(neKlasse(20000, 11)).toBeNull();
  });
});

describe('K31 NE: revenu déterminant [1] Art. 12 al. 1', () => {
  it('30 % des Vermögens nach Abzug 4 000 (allein) + 2 000 je Kind, höchstens 10 000', () => {
    expect(neRevenuDeterminant({ revenuEffectif: 20000, vermoegen: 14000, kinderZahl: 0 })).toBeCloseTo(23000, 9);
    expect(neRevenuDeterminant({ revenuEffectif: 20000, vermoegen: 14000, kinderZahl: 1 })).toBeCloseTo(22400, 9);
    expect(neRevenuDeterminant({ revenuEffectif: 20000, vermoegen: 14000, kinderZahl: 3 })).toBeCloseTo(21200, 9);
    // vier Kinder: 4 000 + 8 000 = 12 000, gedeckelt auf 10 000
    expect(neRevenuDeterminant({ revenuEffectif: 20000, vermoegen: 14000, kinderZahl: 4 })).toBeCloseTo(21200, 9);
    expect(neRevenuDeterminant({ revenuEffectif: 20000, vermoegen: 3000, kinderZahl: 0 })).toBe(20000);
  });
  it('die Werte wörtlich', () => {
    expect(IPV_NE.vermoegen).toEqual({ anteil: 0.3, abzugAllein: 4000, abzugKind: 2000, abzugHoechstens: 10000 });
    expect(IPV_NE.revenuMinimum).toEqual({ allein: 15000, jeKind: 3000 });
    expect(IPV_NE.franchiseOrdentlich).toBe(300);
    expect(IPV_NE.basisjahr).toBe(2025);
    expect(IPV_NE.jahr).toBe(2026);
  });
});

describe('K31 calculateIPV für NE (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvNeuchatel.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 2000, children = [], dob = '1980-05-01', kkPremium = 700, franchise = '300', finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'NE', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: '2000', city: 'Neuchâtel' },
    versicherungen: { ...(kkPremium != null ? { kkPremium } : {}), ...(franchise != null ? { franchise } : {}) },
  });

  it('belegt, mit Quelle; Register ohne PLZ; keine Musterwerte', () => {
    expect(CANTONAL_IPV.NE.beleg.quelle).toMatch(/821\.102/);
    expect(CANTONAL_IPV.NE.beleg.quelle).toMatch(/821\.104/);
    expect(CANTONAL_IPV.NE.beleg.stand).toMatch(/2026/);
    expect(CANTONAL_IPV.NE.maxIncome).toBeNull();
    expect(CANTONAL_IPV.NE.subsidySingle).toBeNull();
    expect(CANTONAL_IPV.NE.noteKey).toBe('ipv.noteAutoOcab');
    expect(IPV_MODULE.NE).toMatchObject({ fn: 'ipvNeuchatel', brauchtPLZ: false });
    expect(SAEULE_3A.voll.kantone).toMatch(/NE/);
  });

  it('24 000 im Jahr → S3 → 514 + 1 = 515 im Monat, 6 180 im Jahr', () => {
    const r = calculateIPV(person());
    expect(r).toMatchObject({ belegt: true, eligible: true, amount: 515, annual: 6180, maxAnnual: 7332, klasse: 3, jahr: 2026, basisjahr: 2025, jahrKey: 'ipv.jahrNE', vorbehaltKey: 'ipv.vorbehaltNE' });
    expect(r.cantonData.maxIncome).toBe(50600);
    expect(r.region).toBeUndefined();
  });

  it('18 000 → S1 → 611 (kein Zuschlag in S1)', () => {
    expect(calculateIPV(person({ monthlyIncome: 1500 }))).toMatchObject({ amount: 611, annual: 7332, klasse: 1 });
  });

  it('40 000 → S10 (31 921–50 600) → 96 + 14 = 110', () => {
    expect(calculateIPV(person({ monthlyIncome: 40000 / 12 }))).toMatchObject({ amount: 110, klasse: 10 });
  });

  it('mit einem Kind: 36 000 → S4 → 450 + 3 + 160 = 613, Grenze 65 089', () => {
    const r = calculateIPV(person({ monthlyIncome: 3000, children: [{ birthDate: '2016-03-01' }] }));
    expect(r).toMatchObject({ amount: 613, annual: 7356, klasse: 4 });
    expect(r.cantonData.maxIncome).toBe(65089);
  });

  it('über der obersten Grenze: kein Anspruch, die Grenze der Annexe wird genannt', () => {
    const r = calculateIPV(person({ monthlyIncome: 5000 }));
    expect(r).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.neKeinAnspruch', noteParams: { value: 50600 } });
  });

  it('Vermögen: 30 % über 4 000 — 20 000 gespart hebt 18 000 genau auf die Grenze S1, 20 004 darüber', () => {
    expect(calculateIPV(person({ monthlyIncome: 1500, finanzen: { savingsAccount: 20000 } }))).toMatchObject({ klasse: 1, amount: 611 });
    expect(calculateIPV(person({ monthlyIncome: 1500, finanzen: { savingsAccount: 20004 } }))).toMatchObject({ klasse: 2, amount: 579 });
  });

  it('Säule 3a: wird in NE nie abgezogen und steckt im Nettoeinkommen — kein Unterschied', () => {
    const ohne = calculateIPV(person({ finanzen: { pension3a: 0 } }));
    const mit = calculateIPV(person({ finanzen: { pension3a: 7258 } }));
    expect(mit.annual).toBe(ohne.annual);
  });

  it('13. Monatslohn zählt beim Hauptlohn: 2 000 × 13 = 26 000 → S4 → 453', () => {
    expect(calculateIPV(person({ finanzen: { dreizehnter: 'ja' } }))).toMatchObject({ klasse: 4, amount: 453 });
  });

  it('[4] höchstens die Prämie — ohne Prämie keine Zahl; Kinderanteil ungedeckelt', () => {
    expect(calculateIPV(person({ monthlyIncome: 1500, kkPremium: 300 }))).toMatchObject({ annual: 3600, maxAnnual: 3600 });
    expect(calculateIPV(person({ kkPremium: null }))).toMatchObject({ belegt: false, amount: null, offen: 'praemie' });
    expect(calculateIPV(person({ monthlyIncome: 3000, kkPremium: 100, children: [{ birthDate: '2016-03-01' }] })).annual).toBe(100 * 12 + 160 * 12);
  });

  it('[1] Art. 11 al. 2: nur bei der ordentlichen Franchise 300 eine Zahl', () => {
    expect(calculateIPV(person({ franchise: 'f300' })).amount).toBe(515);
    expect(calculateIPV(person({ franchise: 300 })).amount).toBe(515);
    expect(calculateIPV(person({ franchise: '2500' }))).toMatchObject({ belegt: false, amount: null, offen: 'neFranchise' });
    expect(calculateIPV(person({ franchise: 'f500' }))).toMatchObject({ offen: 'neFranchise' });
    expect(calculateIPV(person({ franchise: null }))).toMatchObject({ offen: 'neFranchise' });
  });

  it('[1] Art. 16: revenu effectif unter 15 000 (+3 000 je Kind) — nur auf Gesuch, darum keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 14999 / 12 }))).toMatchObject({ belegt: false, amount: null, offen: 'neRevenuMinimum' });
    expect(calculateIPV(person({ monthlyIncome: 1250 })).amount).toBe(611);
    expect(calculateIPV(person({ monthlyIncome: 1400, children: [{ age: 5 }] }))).toMatchObject({ offen: 'neRevenuMinimum' });
    expect(calculateIPV(person({ monthlyIncome: 1500, children: [{ age: 5 }] })).belegt).toBe(true);
    // Vermögen zählt dabei NICHT mit (Art. 16 verweist auf Art. 12 al. 1 lit. a).
    expect(calculateIPV(person({ monthlyIncome: 1000, finanzen: { savingsAccount: 200000 } }))).toMatchObject({ offen: 'neRevenuMinimum' });
  });

  it('Alter nach Kalenderjahr ([1] Art. 6/7): Jahrgang 2000 ist 2026 erwachsen, 2001 nicht', () => {
    expect(calculateIPV(person({ dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ dob: '2001-01-01' }))).toMatchObject({ belegt: false, offen: 'alter' });
    expect(calculateIPV(person({ dob: '' }))).toMatchObject({ offen: 'alter' });
  });

  it('Kinder «0 à 18 ans (fin de l’année civile des 18 ans)» ([1] Art. 5): 2008 ja, 2007 nein', () => {
    expect(calculateIPV(person({ monthlyIncome: 3000, children: [{ birthDate: '2008-12-31' }] })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 3000, children: [{ birthDate: '2007-12-31' }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: 3000, children: [{ age: 18 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: 3000, children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
  });

  it('Paare, Konkubinat, mehr als zehn Kinder, negatives Einkommen: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { household: { adults: 2, children: [] } } }))).toMatchObject({ offen: 'haushalt' });
    const elf = Array.from({ length: 11 }, () => ({ age: 5 }));
    expect(calculateIPV(person({ monthlyIncome: 9000, children: elf }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: -1000 }))).toMatchObject({ offen: 'einkommenNegativ' });
  });

  it('der Betrag sinkt nie mit steigendem Einkommen', () => {
    for (const children of [[], [{ age: 5 }], [{ age: 5 }, { age: 8 }]]) {
      let vorher = Infinity;
      for (let m = 1300; m <= 8000; m += 25) {
        const r = calculateIPV(person({ monthlyIncome: m, children }));
        if (r.belegt === false) continue;
        expect(r.annual ?? 0).toBeLessThanOrEqual(vorher);
        vorher = r.annual ?? 0;
      }
    }
  });

  describe('Jahres-Riegel', () => {
    it('im Anspruchsjahr 2026 rechnet sie', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-12-31T12:00:00'));
      expect(calculateIPV(person()).annual).toBe(6180);
    });
    it('ab 2027 keine Zahl mehr (der Décret gilt nur für 2026)', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person())).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });
});
