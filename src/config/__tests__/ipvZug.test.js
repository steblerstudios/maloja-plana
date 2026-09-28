import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { IPV_ZG, ipvZugRechnen, zgReduktionsfaktor, zgReinvermoegen } from '../ipvZug.js';
import { SAEULE_3A, KEIN_PRAEMIENDECKEL } from '../kantonsModell.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';
import { ipvAbzug } from '../../data/ipvAbzug.js';

// K31 — Prämienverbilligung Kanton Zug 2026. Neu gefasst nach der Fachprüfung #475 (28.09.2026):
// Zug RECHNET — eine Grenze für alle (RRB 2025 Ziff. 1.5), nicht unbezifferte Einzelpersonen-Grenzen.
// Quellen (gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt ZG:
//   [1] IPVG BGS 842.6 · [2] V IPVG BGS 842.61 · [3] Broschüre IPV 2026 (12.12.2025)
//   [4] RRB 26.11.2024 «Prämienverbilligung 2025» · [5] Broschüre IPV 2025 (07.01.2025), Beispiele S. 7/8
//   [6] StG Zug BGS 632.1 (Fassung 2024/2025) § 30 lit. g · [7] KVV Art. 106c Abs. 5bis

const RP_2025 = { e: 5634.40, j: 3917.20, k: 1314.00 }; // [4] Ziff. 1.1 / [5] S. 5

describe('K31 calculateIPV für ZG, bevor das ZG-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'ZG', dateOfBirth: '1980-05-01' }, finanzen: { monthlyIncome: 2500 }, versicherungen: { kkPremium: 400 } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 ZG: die Zahlen 2026, wörtlich aus den Quellen', () => {
  it('[3] S. 4: Richtprämien 4 984.80 / 3 472.80 / 1 224.00', () => {
    expect(IPV_ZG.richtpraemie).toEqual({ e: 4984.80, j: 3472.80, k: 1224.00 });
  });
  it('[3]/[4]: Selbstbehalt 8 %, Kürzung ab 70 000 um 0,5 % je 100, Obergrenze 89 900 — für alle', () => {
    expect(IPV_ZG.selbstbehalt).toBe(0.08);
    expect(IPV_ZG.reduktion).toEqual({ ab: 70000, obergrenze: 89900, jeHundert: 0.005 });
  });
  it('[4] Ziff. 1.6: Kinder mind. 80 % · [2] § 1: 10 % Reinvermögen, Kinderabzug 8 500 · [3]: unter 50 keine Auszahlung', () => {
    expect(IPV_ZG.mindestanteilKind).toBe(0.8);
    expect(IPV_ZG.vermoegenAnteil).toBe(0.10);
    expect(IPV_ZG.kinderabzug).toBe(8500);
    expect(IPV_ZG.mindestbetrag).toBe(50);
    expect(IPV_ZG.basisjahrAbstand).toBe(2);
    expect(IPV_ZG.jahr).toBe(2026);
  });
  it('[6] § 30 lit. g: Versicherungsabzug 3 000 + 1 000 je Kind · [1] § 11: 30. April / 30. September', () => {
    expect(IPV_ZG.versicherungsabzug).toEqual({ alleinstehend: 3000, jeKind: 1000 });
    expect(IPV_ZG.frist).toEqual({ monatTag: '04-30', verspaetetBis: '09-30' });
  });
  it('Säule 3a (V IPVG § 1 lit. c) → Regel `voll`; kein Deckel (KVV 106c Abs. 5bis) → KEIN_PRAEMIENDECKEL.ZG', () => {
    expect(SAEULE_3A.voll.kantone).toMatch(/ZG/);
    expect(KEIN_PRAEMIENDECKEL.ZG).toMatch(/106c/);
  });
});

describe('K31 ZG: die zwei amtlichen Beispiele [5] (Werte 2025) — jede Zahl', () => {
  it('Beispiel 1, alleinstehend: 25 000 + 500 + 1 000 + 2 000 = 28 500 → 2 280 → Anspruch 3 354.40', () => {
    const r = ipvZugRechnen({ personen: ['e'], me: 25000 + 500 + 1000 + 2000, richtpraemie: RP_2025 });
    expect(r.selbstbehalt).toBeCloseTo(2280, 9);
    expect(r.summe).toBeCloseTo(5634.40, 9);
    expect(r.total).toBeCloseTo(3354.40, 9);
  });
  it('Beispiel 2, Familie (2 Erw., 1 jung, 2 Kinder): 42 800 → 3 424; 17 814 → 14 390; Mindestgarantie 4 061 → höherer Betrag 14 390', () => {
    const me = 61000 + 1300 + 5000 + 1000 - 3 * 8500;
    expect(me).toBe(42800);
    const r = ipvZugRechnen({ personen: ['e', 'e', 'j', 'k', 'k'], me, richtpraemie: RP_2025 });
    expect(r.selbstbehalt).toBeCloseTo(3424, 9);
    expect(r.summe).toBeCloseTo(17814, 9);
    expect(r.ordentlich).toBeCloseTo(14390, 9);
    expect(r.mindestgarantie).toBeCloseTo(1958.60 + 2102.40, 9);
    expect(r.total).toBeCloseTo(14390, 9);
  });
});

describe('K31 ZG: Rechnung 2026', () => {
  it('Einkommen 0: volle Richtprämie; Nullpunkt Einzelperson 4 984.80 / 8 % = 62 310', () => {
    expect(ipvZugRechnen({ personen: ['e'], me: 0 }).total).toBeCloseTo(4984.80, 9);
    const r = ipvZugRechnen({ personen: ['e'], me: 62310 });
    expect(r.nullpunkt).toBeCloseTo(62310, 6);
    expect(r.total).toBe(0);
    expect(r.grund).toBe('ueberGrenze');
  });
  it('Handrechnung: 30 000 → 4 984.80 − 2 400 = 2 584.80', () => {
    expect(ipvZugRechnen({ personen: ['e'], me: 30000 }).total).toBeCloseTo(2584.80, 9);
  });
  it('Mindestbetrag-Band: 61 800 → 40.80 (unter 50)', () => {
    const r = ipvZugRechnen({ personen: ['e'], me: 61800 });
    expect(r.total).toBeCloseTo(40.80, 9);
    expect(r.grund).toBe('mindestbetrag');
  });
  it('Reduktionsfaktor [4] Ziff. 1.5: je angefangene 100, aufgerundet, über 89 900 null', () => {
    expect(zgReduktionsfaktor(70000)).toBe(1);
    expect(zgReduktionsfaktor(70001)).toBeCloseTo(0.995, 12);
    expect(zgReduktionsfaktor(75050)).toBeCloseTo(1 - 0.005 * 51, 12);
    expect(zgReduktionsfaktor(89900)).toBeCloseTo(0.005, 12);
    expect(zgReduktionsfaktor(89901)).toBe(0);
  });
  it('Mindestgarantie gewinnt: 1 Erw. + 2 Kinder, 70 000 → 1 832.80 ordentlich, 1 958.40 garantiert → 1 958.40', () => {
    const r = ipvZugRechnen({ personen: ['e', 'k', 'k'], me: 70000 });
    expect(r.ordentlich).toBeCloseTo(1832.80, 9);
    expect(r.mindestgarantie).toBeCloseTo(1958.40, 9);
    expect(r.total).toBeCloseTo(1958.40, 9);
  });
  it('gekürzter Anspruch: keine Mindestgarantie mehr (nur «nicht reduziert», Ziff. 1.6)', () => {
    const r = ipvZugRechnen({ personen: ['e', 'k', 'k'], me: 70001 });
    expect(r.faktor).toBeCloseTo(0.995, 12);
    expect(r.mindestgarantie).toBe(0);
    expect(r.total).toBeCloseTo(Math.round((7432.8 - 0.08 * 70001) * 100) / 100 * 0.995, 1);
  });
  it('Reinvermögen = erfasste Posten − Kreditkarte − Darlehen', () => {
    expect(zgReinvermoegen({ savingsAccount: 50000, loans: 20000, creditCardBalance: 1000 })).toBe(29000);
    expect(zgReinvermoegen({ savingsAccount: 1000, loans: 5000 })).toBe(0);
  });
});

describe('K31 calculateIPV für ZG (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvZug.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  beforeEach(() => { vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2026-09-28T12:00:00')); });
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

  it('🛑 B1: eine Einzelperson bekommt einen Betrag — 30 000 → 2 585 im Jahr', () => {
    const r = calculateIPV(person({ monthlyIncome: 2500 }));
    expect(r).toMatchObject({ belegt: true, eligible: true, annual: 2585, amount: 215, jahr: 2026, basisjahr: 2024, vorbehaltKey: 'ipv.vorbehaltZG', jahrKey: 'ipv.jahrEineRegion' });
    expect(r.maxAnnual).toBe(4985);
    expect(r.cantonData.maxIncome).toBe(null);
  });

  it('kein Deckel: bei tiefer eigener Prämie bleibt der Betrag (KEIN_PRAEMIENDECKEL.ZG)', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, kkPremium: 100 })).annual).toBe(2585);
    expect(calculateIPV(person({ monthlyIncome: 2500, kkPremium: null })).annual).toBe(2585);
  });

  it('🛑 B2: knapp über 62 310 (Nettolohn) kein «Nicht berechtigt» — das Reineinkommen ist tiefer', () => {
    // 5 200 × 12 = 62 400; nach dem Versicherungsabzug 3 000 bleiben 59 400 → 232.80 ≥ 50
    expect(calculateIPV(person({ monthlyIncome: 5200 }))).toMatchObject({ belegt: false, amount: null, offen: 'zgNaeherung' });
  });

  it('erst wenn auch die Untergrenze nicht reicht: «kein Anspruch»', () => {
    // 6 000 × 12 = 72 000; − 3 000 = 69 000 → 8 % = 5 520 > 4 984.80
    expect(calculateIPV(person({ monthlyIncome: 6000 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.zgKeinAnspruch' });
  });

  it('bezahlte Unterhaltsbeiträge (abziehbar, hier nicht abgezogen) → nie ein Verdikt', () => {
    expect(calculateIPV(person({ monthlyIncome: 6000, finanzen: { alimentePaid: 1000 } }))).toMatchObject({ offen: 'zgNaeherung' });
  });

  it('ohne erfasste Prämie kein Versicherungsabzug in der Untergrenze → Verdikt «unter dem Mindestbetrag» möglich', () => {
    // 61 800 → 40.80 < 50; ohne Prämie keine Untergrenze darunter
    expect(calculateIPV(person({ monthlyIncome: 61800 / 12, kkPremium: null }))).toMatchObject({ belegt: true, eligible: false, noteKey: 'ipv.zgUnterMindestbetrag' });
    expect(calculateIPV(person({ monthlyIncome: 61800 / 12 }))).toMatchObject({ offen: 'zgNaeherung' });
  });

  it('10 % des Reinvermögens: Darlehen mindern es', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 2500 })).annual;
    expect(ohne - calculateIPV(person({ monthlyIncome: 2500, finanzen: { savingsAccount: 20000 } })).annual).toBe(Math.round(0.08 * 2000));
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { savingsAccount: 20000, loans: 20000 } })).annual).toBe(ohne);
  });

  it('Säule 3a steckt im Nettoeinkommen (Regel voll): keine Wirkung', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { pension3a: 7000 } })).annual).toBe(calculateIPV(person({ monthlyIncome: 2500 })).annual);
  });

  it('mit einem Kind (5 Jahre): 48 000 − 8 500 = 39 500 → 6 208.80 − 3 160 = 3 048.80', () => {
    expect(calculateIPV(person({ monthlyIncome: 4000, children: [{ age: 5 }] }))).toMatchObject({ eligible: true, annual: 3049 });
  });

  it('K2: ein 2026 geborenes Kind zählt für 2026 nicht (Verhältnisse am 1. Januar)', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ birthDate: '2026-03-01' }] })).annual)
      .toBe(calculateIPV(person({ monthlyIncome: 2500 })).annual);
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ birthDate: '2025-12-31' }] })).annual)
      .not.toBe(calculateIPV(person({ monthlyIncome: 2500 })).annual);
  });

  it('Gesuch-Pflicht: im Budget wird nichts abgezogen (gesuchNoetig, eigener Satz)', () => {
    const data = person({ monthlyIncome: 2500 });
    expect(calculateIPV(data)).toMatchObject({ gesuchNoetig: true, gesuchNichtAbgezogenKey: 'ipv.zgGesuchNichtAbgezogen' });
    expect(ipvAbzug(data)).toEqual({ betrag: 0, grund: 'gesuchNoetig', frist: null });
  });

  it('Frist § 11 [1]: bis 30. April läuft sie, danach der Satz mit 30. September', () => {
    vi.setSystemTime(new Date('2026-04-30T18:00:00'));
    expect(calculateIPV(person({ monthlyIncome: 2500 }))).toMatchObject({ noteKey: 'ipv.zgFristLaeuft', noteParams: { jahr: 2026, folgejahr: 2027 } });
    vi.setSystemTime(new Date('2026-05-01T08:00:00'));
    expect(calculateIPV(person({ monthlyIncome: 2500 }))).toMatchObject({ noteKey: 'ipv.zgFristVorbei' });
  });

  it('Alter nach Jahrgang [3]: 2000 ist erwachsen, 2001 nicht; Kinder 2008 und jünger', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 2500, dob: '2001-01-01' }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ birthDate: '2007-12-31' }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ age: 18 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ age: 17 }] })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
  });

  it('Paare, Konkubinat, negatives Einkommen: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: 2500, basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: -100 }))).toMatchObject({ offen: 'einkommenNegativ' });
  });

  it('ab 2027 keine Zahl mehr', () => {
    vi.setSystemTime(new Date('2027-01-01T12:00:00'));
    expect(calculateIPV(person({ monthlyIncome: 2500 }))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
  });
});
