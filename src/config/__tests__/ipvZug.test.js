import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_ZG, ipvZugRechnen, zgReduktionsfaktor } from '../ipvZug.js';
import { SAEULE_3A } from '../kantonsModell.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Zug 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt ZG:
//   [1] IPVG, BGS 842.6, in Kraft seit 01.01.2025 — §§ 4, 5, 6, 6ter, 7, 7bis, 10, 11, 18
//   [2] V IPVG, BGS 842.61, in Kraft seit 01.01.2021 — § 1
//   [3] Ausgleichskasse Zug, Broschüre «Prämienverbilligung 2026 im Kanton Zug» (12.12.2025)
// Ein amtliches Berechnungsbeispiel gibt es nicht (siehe Modulkopf) — Prüfstein sind die
// Wortlaute von [3] S. 5, als Handrechnung.

describe('K31 calculateIPV für ZG, bevor das ZG-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'ZG', dateOfBirth: '1980-05-01' }, finanzen: { monthlyIncome: 9000 }, versicherungen: { kkPremium: 400 } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 ZG: die Zahlen 2026, wörtlich aus den Quellen', () => {
  it('[3] S. 4: Richtprämien 4 984.80 / 3 472.80 / 1 224.00', () => {
    expect(IPV_ZG.richtpraemie).toEqual({ e: 4984.80, j: 3472.80, k: 1224.00 });
  });
  it('[3] S. 5: Selbstbehalt 8 %, Kürzung ab 70 000 um 0,5 % je 100, Obergrenze 89 900', () => {
    expect(IPV_ZG.selbstbehalt).toBe(0.08);
    expect(IPV_ZG.reduktion).toEqual({ ab: 70000, obergrenze: 89900, jeHundert: 0.005 });
  });
  it('§ 1 Abs. 1 [2]: 10 % des Reinvermögens, Kinderabzug 8 500 · [3] S. 6: unter 50 keine Auszahlung', () => {
    expect(IPV_ZG.vermoegenAnteil).toBe(0.10);
    expect(IPV_ZG.kinderabzug).toBe(8500);
    expect(IPV_ZG.mindestbetrag).toBe(50);
    expect(IPV_ZG.basisjahrAbstand).toBe(2);
    expect(IPV_ZG.jahr).toBe(2026);
  });
  it('§ 1 Abs. 1 lit. c [2]: die Säule 3a wird aufgerechnet — Regel `voll` nennt ZG', () => {
    expect(SAEULE_3A.voll.kantone).toMatch(/ZG/);
    expect(SAEULE_3A.voll.beleg).toMatch(/BGS 842\.61/);
  });
});

describe('K31 ZG: Rechnung nach den Haushalts-Grenzen [3]', () => {
  it('Einkommen 0: die volle Richtprämie', () => {
    expect(ipvZugRechnen({ personen: ['e'], me: 0 }).total).toBeCloseTo(4984.80, 9);
  });
  it('Nullpunkt 4 984.80 / 8 % = 62 310', () => {
    const r = ipvZugRechnen({ personen: ['e'], me: 62310 });
    expect(r.nullpunkt).toBeCloseTo(62310, 6);
    expect(r.differenz).toBe(0);
    expect(r.grund).toBe('ueberGrenze');
  });
  it('Handrechnung: 30 000 → 4 984.80 − 2 400 = 2 584.80', () => {
    expect(ipvZugRechnen({ personen: ['e'], me: 30000 }).total).toBeCloseTo(2584.80, 9);
  });
  it('Reduktionsfaktor: «je Fr. 100 … 0,5 %», auf die nächsten 100 aufgerundet, über 89 900 null', () => {
    expect(zgReduktionsfaktor(70000)).toBe(1);
    expect(zgReduktionsfaktor(70001)).toBeCloseTo(0.995, 12);
    expect(zgReduktionsfaktor(75050)).toBeCloseTo(1 - 0.005 * 51, 12);
    expect(zgReduktionsfaktor(89900)).toBeCloseTo(0.005, 12);
    expect(zgReduktionsfaktor(89901)).toBe(0);
  });
  it('Haushalt mit zwei Erwachsenen im Kürzungsband, und das Mindestbetrag-Band', () => {
    // 9 969.60 − 8 % × 89 000 = 2 849.60; × (1 − 0,005 × 190) = 142.48
    const r = ipvZugRechnen({ personen: ['e', 'e'], me: 89000 });
    expect(r.total).toBeCloseTo(142.48, 9);
    expect(r.grund).toBe(null);
    // 2 777.60 × 0,005 = 13.89 → unter 50
    const band = ipvZugRechnen({ personen: ['e', 'e'], me: 89900 });
    expect(band.total).toBeCloseTo(13.89, 9);
    expect(band.grund).toBe('mindestbetrag');
  });
});

describe('K31 calculateIPV für ZG (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvZug.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, children = [], dob = '1980-05-01', kkPremium = 400, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'ZG', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: {},
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('belegt, mit Quelle; keine Musterwerte, keine Grenze; Register ohne PLZ', () => {
    expect(CANTONAL_IPV.ZG.beleg.quelle).toMatch(/BGS 842\.6/);
    for (const k of ['maxIncome', 'subsidySingle', 'subsidyFamily', 'subsidyChild']) expect(CANTONAL_IPV.ZG[k]).toBe(null);
    expect(IPV_MODULE.ZG.brauchtPLZ).toBe(false);
  });

  it('🛑 Einzelperson unter dem Nullpunkt: KEINE Zahl — die Grenze für Einzelpersonen ist nicht beziffert', () => {
    for (const monthlyIncome of [0, 1000, 2500, 5000, 62300 / 12]) {
      expect(calculateIPV(person({ monthlyIncome }))).toMatchObject({ belegt: false, amount: null, offen: 'zgGrenzeEinzelperson' });
    }
  });

  it('Einzelperson ab dem Nullpunkt 62 310: sicher kein Anspruch', () => {
    const r = calculateIPV(person({ monthlyIncome: 62310 / 12 }));
    expect(r).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.zgKeinAnspruch', vorbehaltKey: 'ipv.vorbehaltZG', jahrKey: 'ipv.jahrEineRegion', basisjahr: 2024, jahr: 2026 });
    expect(r.cantonData.maxIncome).toBe(null);
    expect(calculateIPV(person({ monthlyIncome: 10000 }))).toMatchObject({ noteKey: 'ipv.zgKeinAnspruch' });
  });

  it('das Vermögen zählt mit 10 % (ohne Freibetrag); die 3a wird nicht abgezogen', () => {
    expect(calculateIPV(person({ monthlyIncome: 5000, finanzen: { savingsAccount: 23100 } }))).toMatchObject({ noteKey: 'ipv.zgKeinAnspruch' });
    expect(calculateIPV(person({ monthlyIncome: 5000, finanzen: { savingsAccount: 23000 } }))).toMatchObject({ offen: 'zgGrenzeEinzelperson' });
    expect(calculateIPV(person({ monthlyIncome: 62310 / 12, finanzen: { pension3a: 7000 } }))).toMatchObject({ noteKey: 'ipv.zgKeinAnspruch' });
  });

  it('mit Kind: erst über der Obergrenze 89 900 sicher kein Anspruch (nach Kinderabzug 8 500)', () => {
    expect(calculateIPV(person({ monthlyIncome: 98400 / 12, children: [{ age: 5 }] }))).toMatchObject({ offen: 'zgGrenzeEinzelperson' });
    expect(calculateIPV(person({ monthlyIncome: 98500 / 12, children: [{ age: 5 }] }))).toMatchObject({ belegt: true, eligible: false, noteKey: 'ipv.zgKeinAnspruch' });
  });

  it('keine Prämie nötig, um «kein Anspruch» zu sagen', () => {
    expect(calculateIPV(person({ monthlyIncome: 8000, kkPremium: null }))).toMatchObject({ belegt: true, eligible: false });
  });

  it('Alter nach Jahrgang [3]: 2000 ist erwachsen, 2001 nicht; Kinder 2008 und jünger', () => {
    expect(calculateIPV(person({ monthlyIncome: 8000, dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 8000, dob: '2001-01-01' }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ monthlyIncome: 9000, children: [{ birthDate: '2007-12-31' }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: 9000, children: [{ age: 18 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: 9000, children: [{ age: 17 }] })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 9000, children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
  });

  it('Paare, Konkubinat, negatives Einkommen: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ monthlyIncome: 9000, basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: 9000, basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: -100 }))).toMatchObject({ offen: 'einkommenNegativ' });
  });

  it('ab 2027 keine Zahl mehr, bis die Werte nachgeführt sind', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
    expect(calculateIPV(person({ monthlyIncome: 9000 }))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
  });
});
