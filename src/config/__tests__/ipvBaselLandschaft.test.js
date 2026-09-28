import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import {
  IPV_BL, blObergrenze, blMassgebendesEinkommen, ipvBaselLandschaftRechnen,
} from '../ipvBaselLandschaft.js';
import { SAEULE_3A, ERWACHSEN } from '../kantonsModell.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Basel-Landschaft 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt BL:
//   [1] EG KVG (SGS 362), Version 4310 — §§ 8, 9, 9a, 9c
//   [2] Dekret SGS 362.1, Version 1922 — §§ 1, 2
//   [3] PVV (SGS 362.12), Version 4361, in Kraft seit 01.01.2026 — §§ 5, 6, 9, 10
//   [4] Steuerverwaltung BL, Wegleitung zur Steuererklärung 2024 — Ziffern 100, 399, 610, 750, 900/905
// 🛑 Ein amtliches Berechnungsbeispiel gibt es nicht (nur einen Online-Rechner für die Obergrenze).
// Die Handrechnungen unten folgen dem Wortlaut von [1] § 8 Abs. 2.

describe('K31 calculateIPV für BL, bevor das BL-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'BL', dateOfBirth: '1980-05-01' }, finanzen: { monthlyIncome: 2000 }, versicherungen: { kkPremium: 500 } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 BL: die Zahlen 2026, wörtlich', () => {
  it('[3] § 5 Abs. 1: Richtprämien 383 / 318 / 164 im Monat', () => {
    expect(IPV_BL.richtpraemieMonat).toEqual({ e: 383, j: 318, k: 164 });
    expect(IPV_BL.jahr).toBe(2026);
  });
  it('[2] § 2: 7,75 % · [2] § 1: Obergrenzen 31 000 / 52 000 / 68 000, je weiteres Kind 11 000', () => {
    expect(IPV_BL.prozentanteil).toBe(0.0775);
    expect(IPV_BL.obergrenzeAllein).toEqual([31000, 52000, 68000]);
    expect(IPV_BL.obergrenzeJeWeiteresKind).toBe(11000);
    expect([0, 1, 2, 3, 4].map(blObergrenze)).toEqual([31000, 52000, 68000, 79000, 90000]);
  });
  it('[1] § 8 Abs. 3 und § 9 Abs. 1/3 · [4] Ziffern 900/905', () => {
    expect(IPV_BL.mindestanteilKind).toBe(0.8);
    expect(IPV_BL.vermoegenAnteil).toBe(0.2);
    expect(IPV_BL.kinderabzug).toBe(5000);
    expect(IPV_BL.basisjahrAbstand).toBe(2);
    expect(IPV_BL.vermoegenFrei).toEqual({ allein: 90000, einelternfamilie: 180000 });
  });
  it('die benannten Regeln: 3a nicht abgezogen, Erwachsene ab dem Jahr, in dem sie 26 werden', () => {
    expect(SAEULE_3A.nichtAbgezogen).toMatchObject({ name: 'nichtAbgezogen', kantone: 'BL' });
    expect(SAEULE_3A.nichtAbgezogen.beleg).toMatch(/EG KVG BL § 9 Abs\. 1/);
    expect(SAEULE_3A.nichtAbgezogen.nichtAufgerechnet({ pension3a: 7258 })).toBe(0);
    expect(ERWACHSEN.imAnspruchsjahr(2026, 2000)).toBe(true);
    expect(ERWACHSEN.imAnspruchsjahr(2026, 2001)).toBe(false);
  });
});

describe('K31 BL: Rechnung [1] § 8 Abs. 2 — Richtprämie minus 7,75 %', () => {
  it('Einkommen 0: die volle Richtprämie 4 596', () => {
    expect(ipvBaselLandschaftRechnen({ me: 0 }).total).toBe(4596);
  });
  it('Handrechnung: 20 000 → 4 596 − 1 550 = 3 046', () => {
    expect(ipvBaselLandschaftRechnen({ me: 20000 }).total).toBeCloseTo(3046, 9);
  });
  it('🛑 die Obergrenze ist eine Klippe: 31 000 → 2 193.50, 31 001 → nichts', () => {
    expect(ipvBaselLandschaftRechnen({ me: 31000 }).total).toBeCloseTo(2193.5, 9);
    expect(ipvBaselLandschaftRechnen({ me: 31001 })).toMatchObject({ ueberGrenze: true, total: 0, grenze: 31000 });
  });
  it('mit Kind: beide Lesarten gleich, solange der Kinderanteil über 80 % liegt', () => {
    const r = ipvBaselLandschaftRechnen({ kinderZahl: 1, me: 10000 });
    // Σ = 4 596 + 1 968 = 6 564; 7,75 % × 10 000 = 775 → 5 789
    expect(r.differenz).toBeCloseTo(5789, 9);
    expect(r.varianten.a.total).toBeCloseTo(5789, 9);
    expect(r.varianten.b.total).toBeCloseTo(5789, 9);
  });
  it('🛑 mit Kind, Kinderanteil unter 80 %: die Lesarten gehen um 536 auseinander', () => {
    const r = ipvBaselLandschaftRechnen({ kinderZahl: 1, me: 40000 });
    // Differenz 6 564 − 3 100 = 3 464; (a) 3 464 · (b) 2 425.39 + 1 574.40 = 3 999.79
    expect(r.varianten.a.total).toBeCloseTo(3464, 6);
    expect(r.varianten.b.total).toBeCloseTo(3464 * 4596 / 6564 + 0.8 * 1968, 6);
    expect(Math.round(r.varianten.b.total - r.varianten.a.total)).toBe(536);
  });
});

describe('K31 BL: massgebendes Jahreseinkommen [1] § 9 Abs. 1', () => {
  it('20 % des steuerbaren Vermögens über 90 000 (allein) bzw. 180 000 (Einelternfamilie), − 5 000 je Kind', () => {
    expect(blMassgebendesEinkommen({ zwischentotal: 20000, vermoegen: 90000, kinderZahl: 0 })).toBe(20000);
    expect(blMassgebendesEinkommen({ zwischentotal: 20000, vermoegen: 100000, kinderZahl: 0 })).toBe(22000);
    expect(blMassgebendesEinkommen({ zwischentotal: 20000, vermoegen: 180000, kinderZahl: 1 })).toBe(15000);
    expect(blMassgebendesEinkommen({ zwischentotal: 3000, vermoegen: 0, kinderZahl: 1 })).toBe(0);
  });
});

describe('K31 calculateIPV für BL (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvBaselLandschaft.js');
    await new Promise((res) => setTimeout(res, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 2000, children = [], dob = '1980-05-01', kkPremium = 500, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'BL', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: '4410', city: 'Liestal' },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('im Register, ohne PLZ-Abhängigkeit; belegt, ohne Musterwerte', () => {
    expect(IPV_MODULE.BL).toMatchObject({ fn: 'ipvBaselLandschaft', brauchtPLZ: false });
    expect(CANTONAL_IPV.BL.beleg.quelle).toMatch(/EG KVG BL \(SGS 362\)/);
    expect(CANTONAL_IPV.BL).toMatchObject({ maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, noteKey: 'ipv.noteApplySva' });
  });

  it('allein, 2 000 im Monat = 24 000 → 4 596 − 1 860 = 2 736 im Jahr, 228 im Monat', () => {
    const r = calculateIPV(person());
    expect(r).toMatchObject({
      belegt: true, eligible: true, annual: 2736, amount: 228, jahr: 2026, basisjahr: 2024,
      vorbehaltKey: 'ipv.vorbehaltBL', jahrKey: 'ipv.jahrBL', noteKey: 'ipv.blAntrag', noteParams: { jahr: 2026, basisjahr: 2024 },
    });
    expect(r.cantonData.maxIncome).toBe(31000);
    expect(r.maxAnnual).toBe(4596);
  });

  it('Obergrenze: 30 996 rechnet (2 194), 31 008 nicht — «kein Anspruch» mit der amtlichen Grenze', () => {
    expect(calculateIPV(person({ monthlyIncome: 2583 }))).toMatchObject({ eligible: true, annual: 2194 });
    const r = calculateIPV(person({ monthlyIncome: 2584 }));
    expect(r).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.blKeinAnspruch' });
    expect(r.noteParams.grenze).toMatch(/^31.000$/);
  });

  it('Vermögen: 20 % über 90 000 zählen (100 000 → + 2 000 → 2 581); keine Vermögensgrenze', () => {
    expect(calculateIPV(person({ finanzen: { savingsAccount: 90000 } })).annual).toBe(2736);
    expect(calculateIPV(person({ finanzen: { savingsAccount: 100000 } })).annual).toBe(2581);
    expect(calculateIPV(person({ monthlyIncome: 0, finanzen: { savingsAccount: 1000000 } }))).toMatchObject({ belegt: true, noteKey: 'ipv.blKeinAnspruch' });
  });

  it('Säule 3a: im Zwischentotal nicht abgezogen — der Betrag ändert sich nicht', () => {
    expect(calculateIPV(person({ finanzen: { pension3a: 7258 } })).annual).toBe(2736);
  });

  it('13. Monatslohn: Hauptlohn × 13 (26 000 → 2 581)', () => {
    expect(calculateIPV(person({ finanzen: { dreizehnter: 'ja' } })).annual).toBe(2581);
  });

  it('[1] § 8 Abs. 2bis: höchstens die bezahlte Prämie — ohne erfasste Prämie keine Zahl', () => {
    expect(calculateIPV(person({ kkPremium: 200 }))).toMatchObject({ annual: 2400, maxAnnual: 2400 });
    expect(calculateIPV(person({ kkPremium: null }))).toMatchObject({ belegt: false, offen: 'praemie' });
  });

  it('mit Kind (geboren 2020), 15 000 − 5 000 = 10 000: beide Lesarten gleich → 5 789', () => {
    const r = calculateIPV(person({ monthlyIncome: 1250, children: [{ birthDate: '2020-03-01' }] }));
    expect(r).toMatchObject({ eligible: true, annual: 5789, amount: 482 });
    expect(r.cantonData.maxIncome).toBe(52000);
  });

  it('🛑 mit Kind, wo die Lesarten auseinandergehen: keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ birthDate: '2020-03-01' }] })))
      .toMatchObject({ belegt: false, amount: null, offen: 'mindestanspruch' });
  });

  it('🛑 Kind möglicherweise nach dem Bemessungsjahr 2024 geboren: keine Zahl', () => {
    expect(calculateIPV(person({ children: [{ birthDate: '2025-05-01' }] }))).toMatchObject({ offen: 'blKindNeu' });
    expect(calculateIPV(person({ children: [{ age: 1 }] }))).toMatchObject({ offen: 'blKindNeu' });
    expect(calculateIPV(person({ monthlyIncome: 1250, children: [{ birthDate: '2024-01-01' }] })).offen).not.toBe('blKindNeu');
    expect(calculateIPV(person({ monthlyIncome: 1250, children: [{ age: 2 }] })).offen).not.toBe('blKindNeu');
  });

  it('Alter [3] § 9: Jahrgang 2000 ist erwachsen, 2001 nicht', () => {
    expect(calculateIPV(person({ dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ dob: '2001-01-01' }))).toMatchObject({ offen: 'alter' });
  });

  it('Kinder bis 18 im Anspruchsjahr; darüber, ohne Alter, Paare, Konkubinat: Orientierung', () => {
    expect(calculateIPV(person({ monthlyIncome: 1250, children: [{ birthDate: '2008-12-31' }] })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ birthDate: '2007-12-31' }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 18 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
  });

  it('negatives Einkommen: keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: -2000 }))).toMatchObject({ offen: 'einkommenNegativ' });
  });

  describe('Jahres-Riegel', () => {
    it('ab 2027 keine Zahl mehr', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person())).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });
});
