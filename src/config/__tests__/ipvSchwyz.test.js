import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_SZ, ipvSchwyzRechnen } from '../ipvSchwyz.js';
import { SAEULE_3A } from '../kantonsModell.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Schwyz 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt SZ:
//   [1] EGzKVG, SRSZ 361.100, Stand 1.2.2026 — §§ 5, 6, 7, 9, 10, 17, 18
//   [2] KRBzEGzKVG, SRSZ 361.110, § 1 (Fassung 6.9.2017): Selbstbehalt 11 %
//   [3] VVzEGzKVG, SRSZ 361.111, Stand 1.2.2026 — §§ 7a, 9, 10
//   [4] SVA Schwyz, «Prämienverbilligung 2026 — … Kriterien Grenzwerte» (05.11.2025)
//   [5] SVA Schwyz, Merkblatt «Prämienverbilligung 2027» (23.03.2026) — drei Beispiele mit
//       den Richtprämien 2026

describe('K31 calculateIPV für SZ, bevor das SZ-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'SZ', dateOfBirth: '1980-05-01' }, finanzen: { monthlyIncome: 2000 }, versicherungen: { kkPremium: 400 } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 SZ: die Zahlen 2026, wörtlich aus den Quellen', () => {
  // Absichtlich nicht aus IPV_SZ abgeleitet, damit ein Zahlendreher im Datensatz auffällt.
  it('[4]/§ 9 [1]: Richtprämien = 90 % der Durchschnittsprämien 6 204 / 4 368 / 1 428', () => {
    expect(IPV_SZ.richtpraemie).toEqual({ e: 5583.60, j: 3931.20, k: 1285.20 });
    expect(0.9 * 6204).toBeCloseTo(IPV_SZ.richtpraemie.e, 9);
    expect(0.9 * 4368).toBeCloseTo(IPV_SZ.richtpraemie.j, 9);
    expect(0.9 * 1428).toBeCloseTo(IPV_SZ.richtpraemie.k, 9);
  });
  it('[2] § 1: Selbstbehalt 11 %', () => {
    expect(IPV_SZ.selbstbehalt).toBe(0.11);
  });
  it('§ 7 Abs. 2 lit. a [1]: 10 % des Reinvermögens nach 25 000 je erwachsene Person und 15 000 je Kind', () => {
    expect(IPV_SZ.vermoegenAnteil).toBe(0.10);
    expect(IPV_SZ.freibetrag).toEqual({ erwachsen: 25000, kind: 15000 });
  });
  it('§ 5 Abs. 1 lit. d [1]: Vermögensgrenze Alleinstehende 250 000 (nach Freibetrag)', () => {
    expect(IPV_SZ.vermoegensgrenze).toBe(250000);
  });
  it('[4]: minimale Höchsteinkommen Alleinstehende, 0–4 Kinder (Mietzinsregion 3, Kinder unter 11)', () => {
    expect(IPV_SZ.hoechsteinkommenMinimal).toEqual([43554, 56052, 65845, 74343, 80161]);
  });
  it('§ 7a Abs. 1 [3]: Kinder mind. 80 % · § 18 Abs. 2 [1]: unter 50 Franken keine Auszahlung', () => {
    expect(IPV_SZ.mindestanteilKind).toBe(0.8);
    expect(IPV_SZ.mindestbetrag).toBe(50);
    expect(IPV_SZ.jahr).toBe(2026);
  });
  it('Plausibilität [4]: 43 554 − 43 314 (Wert 2025) = 240 = 6 204 − 5 964 (Anstieg der Durchschnittsprämie)', () => {
    // Die Grenze folgt § 5 Abs. 1 lit. c [1]: nur die Durchschnittsprämie hat sich bewegt.
    expect(IPV_SZ.hoechsteinkommenMinimal[0] - 43314).toBe(6204 - 5964);
  });
});

describe('K31 SZ: die drei Beispiele des Merkblatts [5] — jede Zahl', () => {
  it('Beispiel 1: alleinstehend, 25 000 + 10 % von (35 000 − 25 000) = 26 000 → 2 860 → 2 723.60', () => {
    const r = ipvSchwyzRechnen({ personen: ['e'], me: 25000 + 0.1 * (35000 - 25000) });
    expect(r.selbstbehalt).toBeCloseTo(2860, 9);
    expect(r.summe).toBeCloseTo(5583.60, 9);
    expect(r.differenz).toBeCloseTo(2723.60, 9);
  });
  it('Beispiel 2: Ehepaar, Kind 10, junge erwachsene Person in Ausbildung — 62 000 → 6 820; 16 383.60 → 9 563.60', () => {
    const me = 60000 + 0.1 * (100000 - 80000);
    expect(me).toBe(62000);
    const r = ipvSchwyzRechnen({ personen: ['e', 'e', 'k', 'j'], me });
    expect(r.selbstbehalt).toBeCloseTo(6820, 9);
    expect(r.summe).toBeCloseTo(16383.60, 9);
    expect(r.differenz).toBeCloseTo(9563.60, 9);
  });
  it('Beispiel 3: alleinstehend, zwei Kinder, Liegenschaft — 39 250 → 4 317.50; 8 154 → 3 836.50', () => {
    // 25 000 + ao. Liegenschaftsunterhalt 8 500 + 10 % von (112 500 − 55 000)
    const me = 25000 + 8500 + 0.1 * (112500 - 55000);
    expect(me).toBe(39250);
    const r = ipvSchwyzRechnen({ personen: ['e', 'k', 'k'], me });
    expect(r.selbstbehalt).toBeCloseTo(4317.50, 9);
    expect(r.summe).toBeCloseTo(8154.00, 9);
    expect(r.differenz).toBeCloseTo(3836.50, 9);
  });
  it('🛑 Beispiel 3 ist beim Kinder-Mindestanspruch mehrdeutig — die Rechnung sagt «unklar»', () => {
    // Anteilig verteilt bekäme jedes Kind 3 836.50 × 1 285.20 / 8 154 = 604.71, also 47 %.
    // Ob die SVA auf 80 % erhöht (≈ +847) oder am Gesamtbetrag misst, zeigt [5] nicht.
    const r = ipvSchwyzRechnen({ personen: ['e', 'k', 'k'], me: 39250 });
    expect(r.anteil).toBeLessThan(0.8);
    expect(r.mindestUnklar).toBe(true);
  });
});

describe('K31 SZ: Rechnung — Nullpunkt, Mindestbetrag, Abbau', () => {
  it('Einkommen 0: die volle Richtprämie', () => {
    expect(ipvSchwyzRechnen({ personen: ['e'], me: 0 }).differenz).toBeCloseTo(5583.60, 9);
    expect(ipvSchwyzRechnen({ personen: ['e'], me: -5000 }).differenz).toBeCloseTo(5583.60, 9);
  });
  it('rechnerischer Nullpunkt 5 583.60 / 11 % = 50 760', () => {
    const r = ipvSchwyzRechnen({ personen: ['e'], me: 50760 });
    expect(r.nullpunkt).toBeCloseTo(50760, 6);
    expect(r.differenz).toBe(0);
    expect(r.grund).toBe('ueberGrenze');
  });
  it('zwei Gründe: knapp unter dem Nullpunkt «mindestbetrag», darüber «ueberGrenze»', () => {
    const band = ipvSchwyzRechnen({ personen: ['e'], me: 50400 });
    expect(band.differenz).toBeCloseTo(39.60, 9);
    expect(band.grund).toBe('mindestbetrag');
    expect(ipvSchwyzRechnen({ personen: ['e'], me: 51000 }).grund).toBe('ueberGrenze');
    expect(ipvSchwyzRechnen({ personen: ['e'], me: 50305 }).grund).toBe(null);
  });
  it('linear: 11 Rappen je Franken', () => {
    const bei = (me) => ipvSchwyzRechnen({ personen: ['e'], me }).differenz;
    expect(bei(10000) - bei(11000)).toBeCloseTo(110, 9);
    expect(bei(30000) - bei(31000)).toBeCloseTo(110, 9);
  });
  it('Kinder: unklar nur, wenn der anteilige Betrag eines Kindes unter 80 % fiele', () => {
    // 1 Kind: Summe 6 868.80, 80 % Anteil verlangt Selbstbehalt ≤ 1 373.76 → me ≤ 12 488.72
    expect(ipvSchwyzRechnen({ personen: ['e', 'k'], me: 12488 }).mindestUnklar).toBe(false);
    expect(ipvSchwyzRechnen({ personen: ['e', 'k'], me: 12490 }).mindestUnklar).toBe(true);
  });
});

describe('K31 SZ: Säule 3a — im Reineinkommen abgezogen, nicht aufgerechnet (§ 7 [1])', () => {
  const regel = SAEULE_3A.imReineinkommenAbgezogen;
  const jahre = { bemessungsjahre: [2023, 2024, 2025], anspruchsjahr: 2026 };
  it('sicher abziehbar ist das kleinere von 7 056 (Maximum 2023/2024) und 20 % des Erwerbseinkommens', () => {
    expect(regel.sicherAbziehbar({ monthlyIncome: 5000 }, jahre)).toBe(7056);
    expect(regel.sicherAbziehbar({ monthlyIncome: 2500 }, jahre)).toBe(6000);
    // ein nicht belegtes Bemessungsjahr: keine Schwelle
    expect(regel.sicherAbziehbar({ monthlyIncome: 5000 }, { bemessungsjahre: [2019] })).toBe(null);
  });
  it('widerlegt über der sicheren Schwelle, ohne Einzahlung nie', () => {
    expect(regel.widerlegt({ monthlyIncome: 2500, pension3a: 6000 }, jahre)).toBe(false);
    expect(regel.widerlegt({ monthlyIncome: 2500, pension3a: 6001 }, jahre)).toBe(true);
    expect(regel.widerlegt({ monthlyIncome: 9000, pension3a: 7057 }, jahre)).toBe(true);
    expect(regel.widerlegt({ monthlyIncome: 0 }, jahre)).toBe(false);
  });
  it('widerlegt, wenn der Wert über ein Jahr hinausreicht (Altdaten)', () => {
    const f = { monthlyIncome: 5000, pension3a: 6000, pension3aDeposits: [{ date: '2025-01-01', amount: 3000 }, { date: '2026-01-01', amount: 3000 }] };
    expect(regel.widerlegt(f, jahre)).toBe(true);
  });
  it('zieht die ganze Einzahlung ab', () => {
    expect(regel.nichtAufgerechnet({ pension3a: 3000 })).toBe(3000);
    expect(regel.nichtAufgerechnet({ pension3a: 'abc' })).toBe(0);
  });
});

describe('K31 calculateIPV für SZ (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvSchwyz.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, children = [], dob = '1980-05-01', kkPremium = 450, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'SZ', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: {},
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('belegt, mit Quelle; keine Musterwerte, keine Grenze; Register ohne PLZ', () => {
    expect(CANTONAL_IPV.SZ.beleg.quelle).toMatch(/SRSZ 361\.100/);
    expect(CANTONAL_IPV.SZ.beleg.quelle).toMatch(/SRSZ 361\.110/);
    for (const k of ['maxIncome', 'subsidySingle', 'subsidyFamily', 'subsidyChild']) expect(CANTONAL_IPV.SZ[k]).toBe(null);
    expect(CANTONAL_IPV.SZ.noteKey).toBe('ipv.noteApplySva');
    expect(IPV_MODULE.SZ.brauchtPLZ).toBe(false);
  });

  it('Beispiel 1 [5] durch die App: Reineinkommen 25 000, Vermögen 35 000 → 2 724 im Jahr', () => {
    const r = calculateIPV(person({ monthlyIncome: 25000 / 12, finanzen: { savingsAccount: 35000 } }));
    expect(r).toMatchObject({ belegt: true, eligible: true, annual: 2724, amount: 227, jahr: 2026, vorbehaltKey: 'ipv.vorbehaltSZ', jahrKey: 'ipv.jahrEineRegion', noteKey: 'ipv.szFristLaeuft' });
    expect(r.maxAnnual).toBe(5400); // die eigene Prämie 450 × 12 deckelt die Richtprämie 5 583.60
    expect(r.cantonData.maxIncome).toBe(null);
    expect(r.region).toBeUndefined();
  });

  it('keine PLZ nötig: ohne Wohnort derselbe Betrag', () => {
    expect(calculateIPV(person({ monthlyIncome: 2000 })).annual).toBe(Math.round(5583.6 - 0.11 * 24000));
  });

  it('§ 10 Abs. 1 [1]: höchstens die Prämie — ohne erfasste Prämie keine Zahl', () => {
    expect(calculateIPV(person({ kkPremium: 200 }))).toMatchObject({ annual: 2400, maxAnnual: 2400 });
    expect(calculateIPV(person({ kkPremium: null }))).toMatchObject({ belegt: false, amount: null, offen: 'praemie' });
  });

  it('🛑 Klippe § 5 Abs. 1 lit. c [1]: unter 43 554 ein Betrag, ab 43 554 keine Zahl, ab 50 760 kein Anspruch', () => {
    expect(calculateIPV(person({ monthlyIncome: 3629.4 }))).toMatchObject({ eligible: true, annual: Math.round(5583.6 - 0.11 * 43552.8) });
    expect(calculateIPV(person({ monthlyIncome: 3629.5 }))).toMatchObject({ belegt: false, amount: null, offen: 'szGrenzeMietzinsregion' });
    expect(calculateIPV(person({ monthlyIncome: 50000 / 12 }))).toMatchObject({ offen: 'szGrenzeMietzinsregion' });
    expect(calculateIPV(person({ monthlyIncome: 4230 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.szKeinAnspruch' });
    expect(calculateIPV(person({ monthlyIncome: 8000 }))).toMatchObject({ belegt: true, eligible: false, noteKey: 'ipv.szKeinAnspruch' });
  });

  it('das Vermögen zählt mit 10 % nach Freibetrag zum anrechenbaren Einkommen', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 2000 })).annual;
    const mit = calculateIPV(person({ monthlyIncome: 2000, finanzen: { savingsAccount: 45000 } })).annual;
    expect(ohne - mit).toBe(Math.round(0.11 * 0.1 * 20000));
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { savingsAccount: 25000 } })).annual).toBe(ohne);
  });

  it('§ 5 Abs. 1 lit. d [1]: über 250 000 nach Freibetrag keine Zahl; mit Kind 15 000 mehr Freibetrag', () => {
    expect(calculateIPV(person({ finanzen: { savingsAccount: 275000 } })).offen).not.toBe('vermoegen');
    expect(calculateIPV(person({ finanzen: { savingsAccount: 275001 } }))).toMatchObject({ offen: 'vermoegen' });
    expect(calculateIPV(person({ children: [{ age: 5 }], finanzen: { savingsAccount: 290000 } })).offen).not.toBe('vermoegen');
    expect(calculateIPV(person({ children: [{ age: 5 }], finanzen: { savingsAccount: 290001 } }))).toMatchObject({ offen: 'vermoegen' });
  });

  it('Säule 3a: wird vom Nettoeinkommen abgezogen, soweit sicher abziehbar — sonst keine Zahl', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 2500 })).annual;
    const mit = calculateIPV(person({ monthlyIncome: 2500, finanzen: { pension3a: 3000 } })).annual;
    expect(mit - ohne).toBe(Math.round(0.11 * 3000));
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { pension3a: 6001 } }))).toMatchObject({ belegt: false, offen: 'saeule3aAbzugUnklar' });
    expect(calculateIPV(person({ monthlyIncome: 3500, finanzen: { pension3a: 7258 } }))).toMatchObject({ offen: 'saeule3aAbzugUnklar' });
  });

  it('negatives Einkommen: keine Zahl statt des Höchstbetrags', () => {
    expect(calculateIPV(person({ monthlyIncome: -500 }))).toMatchObject({ belegt: false, offen: 'einkommenNegativ' });
  });

  it('mit einem Kind (5 Jahre), tiefes Einkommen: jeder Anteil über 80 % → Betrag, Kinderanteil ungedeckelt', () => {
    // me 10 000 → Selbstbehalt 1 100; Summe 6 868.80 → 5 768.80, Anteil 84 %.
    const anteil = 5768.8 / 6868.8;
    expect(calculateIPV(person({ monthlyIncome: 10000 / 12, children: [{ age: 5 }] }))).toMatchObject({ eligible: true, annual: 5769 });
    // Prämie 300/Monat: nur der Erwachsenenanteil (4 689.41) wird auf 3 600 gedeckelt.
    expect(calculateIPV(person({ monthlyIncome: 10000 / 12, children: [{ age: 5 }], kkPremium: 300 })).annual)
      .toBe(Math.round(3600 + anteil * 1285.2));
  });

  it('mit Kind im mittleren Bereich: Mindestanspruch mehrdeutig → keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, children: [{ age: 5 }] }))).toMatchObject({ belegt: false, offen: 'mindestanspruch' });
  });

  it('mit Kind über dem minimalen Höchsteinkommen (56 052) und ab 5 Kindern: keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 4671, children: [{ age: 5 }] }))).toMatchObject({ offen: 'szGrenzeMietzinsregion' });
    const fuenf = Array.from({ length: 5 }, () => ({ age: 5 }));
    expect(calculateIPV(person({ monthlyIncome: 500, children: fuenf }))).toMatchObject({ offen: 'szGrenzeMietzinsregion' });
  });

  it('Alter nach Jahrgang [4]: 2000 ist erwachsen, 2001 nicht', () => {
    expect(calculateIPV(person({ dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ dob: '2001-01-01' }))).toMatchObject({ belegt: false, offen: 'alter' });
    expect(calculateIPV(person({ dob: '' }))).toMatchObject({ offen: 'alter' });
  });

  it('Kinder nach Jahrgang [4] (2008 und jünger); das eingetippte Alter zählt eins mehr', () => {
    expect(calculateIPV(person({ children: [{ birthDate: '2008-12-31' }] })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ birthDate: '2007-12-31' }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 18 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 17 }] })).belegt).toBe(true);
  });

  it('Paare, Konkubinat, zwei Erwachsene, Kinder ohne Alter: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { household: { adults: 2, children: [] } } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
  });

  it('§ 18 Abs. 2 [1]: nach dem Deckel unter 50 Franken → nicht ausbezahlt, eigener Satz', () => {
    // Prämie 4/Monat = 48 im Jahr: der Anspruch wäre höher, ausbezahlt würde 48 → verfällt.
    expect(calculateIPV(person({ monthlyIncome: 2000, kkPremium: 4 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.szUnterMindestbetrag' });
    expect(calculateIPV(person({ monthlyIncome: 2000, kkPremium: 5 }))).toMatchObject({ eligible: true, annual: 60 });
  });

  describe('Frist § 17 [1] und Jahres-Riegel', () => {
    it('im Anspruchsjahr läuft die Frist bis 31.12. — nie «Frist vorbei»', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-12-31T20:00:00'));
      const r = calculateIPV(person({}));
      expect(r).toMatchObject({ noteKey: 'ipv.szFristLaeuft', noteParams: { jahr: 2026, vorjahr: 2025 } });
      expect(r.anmeldefristVorbei).toBeUndefined();
    });
    it('ab 2027 keine Zahl mehr, bis die Werte nachgeführt sind', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person({}))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });
});
