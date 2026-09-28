import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_NW, ipvNidwaldenRechnen } from '../ipvNidwalden.js';
import { SAEULE_3A } from '../kantonsModell.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';
import { ipvAbzug } from '../../data/ipvAbzug.js';
import { calculateMonthlyBudget } from '../../budgetSync.js';
import { praemienBelegState } from '../../data/praemienBeleg.js';

// K31 — Prämienverbilligung Kanton Nidwalden 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt NW:
//   [1] NG 742.111 Verordnung zur Prämienverbilligung 2026 (09.12.2025, in Kraft 01.01.2026)
//   [2] NG 742.1 kKVG (Art. 12, 14, 16, 17, 20a, 22)
//   [3] AK Nidwalden, Merkblatt Prämienverbilligung 2026 (Februar 2026)
//   [4] NG 521.1 StG, Art. 35 Abs. 1 Ziff. 3 und 5

// Wörtlich abgeschrieben, absichtlich nicht aus IPV_NW abgeleitet.
const RICHTPRAEMIE_2026 = { e: 5400, j: 3912, k: 1260 }; // [1] § 2 Abs. 2

describe('K31 calculateIPV für NW, bevor das NW-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'NW', dateOfBirth: '1980-05-01' }, finanzen: { monthlyIncome: 2000 } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 NW: die Werte 2026 stehen so in [1] und [2]', () => {
  it('Richtprämien [1] § 2 Abs. 2, Selbstbehalt und Vermögensanteil [1] § 1', () => {
    expect(IPV_NW.jahr).toBe(2026);
    expect(IPV_NW.richtpraemie).toEqual(RICHTPRAEMIE_2026);
    expect(IPV_NW.selbstbehalt).toBe(0.10);
    expect(IPV_NW.vermoegenAnteil).toBe(0.20);
  });
  it('Kinder [2] Art. 14 Abs. 1, Mindestbetrag [1] § 5, Steuerperiode [1] § 3', () => {
    expect(IPV_NW.kind).toEqual({ anteil: 0.8, grenze: 100000 });
    expect(IPV_NW.mindestbetrag).toBe(100);
    expect(IPV_NW.basisjahrAbstand).toBe(2);
  });
  it('Register und Beleg: eigenes Modul ohne PLZ-Abhängigkeit, keine Musterwerte, Gesuch bei der Ausgleichskasse', () => {
    expect(IPV_MODULE.NW).toMatchObject({ fn: 'ipvNidwalden', brauchtPLZ: false });
    expect(CANTONAL_IPV.NW.beleg.quelle).toMatch(/NG 742\.111/);
    expect(CANTONAL_IPV.NW.beleg.stand).toMatch(/2026/);
    for (const k of ['maxIncome', 'subsidySingle', 'subsidyFamily', 'subsidyChild']) expect(CANTONAL_IPV.NW[k]).toBeNull();
    expect(CANTONAL_IPV.NW.noteKey).toBe('ipv.noteApplyCompensation');
  });
  it('Rahmen: die 3a bleibt im Reineinkommen abgezogen (eigene Regel)', () => {
    expect(SAEULE_3A.abgezogen.kantone).toBe('NW');
    expect(SAEULE_3A.abgezogen.beleg).toMatch(/Art\. 12 Abs\. 2/);
  });
});

describe('K31 NW: die Rechnung [2] Art. 12', () => {
  it('Summe der Steuerwerte 0: die volle Richtprämie 5 400', () => {
    expect(ipvNidwaldenRechnen({ sw: 0 }).total).toBe(5400);
  });
  it('linear, 10 Rappen je Franken: 20 000 → 3 400; Nullpunkt 54 000', () => {
    expect(ipvNidwaldenRechnen({ sw: 20000 }).total).toBeCloseTo(3400, 9);
    expect(ipvNidwaldenRechnen({ sw: 54000 })).toMatchObject({ total: 0, grund: 'ueberGrenze' });
  });
  it('Mindestbetrag [1] § 5: 53 000 → genau 100 wird ausbezahlt, 53 001 → 99.90 nicht', () => {
    expect(ipvNidwaldenRechnen({ sw: 53000 })).toMatchObject({ grund: null });
    const r = ipvNidwaldenRechnen({ sw: 53001 });
    expect(r.total).toBeCloseTo(99.9, 9);
    expect(r.grund).toBe('mindestbetrag');
  });
  it('🛑 Kinder mit allgemeinem Anspruch: drei Lesarten von Art. 14 Abs. 2 — unklar, keine Zahl', () => {
    // Einelternhaushalt, ein Kind, 30 000: (a) 3 660 · (b) 3 975.57 · (c) 4 227.57 (Kopf, Punkt 3)
    expect(ipvNidwaldenRechnen({ sw: 30000, kinderZahl: 1 }).unklar).toBe(true);
    expect(ipvNidwaldenRechnen({ sw: 66599, kinderZahl: 1 }).unklar).toBe(true);
  });
  it('Kinder ohne allgemeinen Anspruch: alle Lesarten gleich — 80 % der Richtprämie (66 600 → 1 008)', () => {
    const r = ipvNidwaldenRechnen({ sw: 66600, kinderZahl: 1 });
    expect(r.unklar).toBe(false);
    expect(r.total).toBeCloseTo(1008, 9);
    expect(r.anteilErwachsen).toBe(0);
  });
  it('Grenze 100 000 «nicht übersteigt»: 100 000 → 1 008, 100 001 → nichts', () => {
    expect(ipvNidwaldenRechnen({ sw: 100000, kinderZahl: 1 }).total).toBeCloseTo(1008, 9);
    expect(ipvNidwaldenRechnen({ sw: 100001, kinderZahl: 1 }).total).toBe(0);
  });
  it('über 100 000 mit vier Kindern: nur allgemein, alle Richtprämien voll (10 440 − 10 100 = 340)', () => {
    const r = ipvNidwaldenRechnen({ sw: 101000, kinderZahl: 4 });
    expect(r.unklar).toBe(false);
    expect(r.total).toBeCloseTo(340, 9);
    expect(r.anteilErwachsen).toBeCloseTo(340 * 5400 / 10440, 9);
  });
});

describe('K31 calculateIPV für NW (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvNidwalden.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, children = [], dob = '1980-05-01', kkPremium = 450, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'NW', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: '6370', city: 'Stans' },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('20 000 im Jahr: 3 400, Basisjahr 2024, keine Region, keine Grenze', () => {
    const r = calculateIPV(person({ monthlyIncome: 20000 / 12 }));
    expect(r).toMatchObject({
      belegt: true, eligible: true, annual: 3400, amount: 283, maxAnnual: 5400, jahr: 2026, basisjahr: 2024,
      vorbehaltKey: 'ipv.vorbehaltNW', jahrKey: 'ipv.jahrNW',
    });
    expect(r.region).toBeUndefined();
    expect(r.cantonData.maxIncome).toBe(null);
  });

  it('Säule 3a: im Reineinkommen abgezogen — die App nimmt sie aus dem Nettoeinkommen heraus', () => {
    // 30 000 → 2 400; mit 7 258 Einzahlung: 22 742 → 5 400 − 2 274.20 = 3 125.80 → 3 126
    expect(calculateIPV(person({ monthlyIncome: 2500 })).annual).toBe(2400);
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { pension3a: 7258 } })).annual).toBe(3126);
  });

  it('Säule 3a grösser als das Einkommen: keine Zahl statt des Höchstbetrags', () => {
    expect(calculateIPV(person({ monthlyIncome: 500, finanzen: { pension3a: 7000 } }))).toMatchObject({ belegt: false, offen: 'saeule3aUeberEinkommen' });
  });

  it('bezahlte Alimente: im Reineinkommen abgezogen (StG Art. 35 Abs. 1 Ziff. 3) — 1 000/Monat → 3 600 statt 2 400', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { alimentePaid: 1000 } })).annual).toBe(3600);
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { alimentePaid: 'abc' } })).annual).toBe(2400);
  });

  it('Vermögen: 20 % des GANZEN Reinvermögens, ohne Freibetrag', () => {
    // 20 000 + 20 % × 10 000 = 22 000 → 3 200 · + 20 % × 50 000 = 30 000 → 2 400
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { savingsAccount: 10000 } })).annual).toBe(3200);
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { savingsAccount: 50000 } })).annual).toBe(2400);
  });

  it('keine Vermögensgrenze: viel Vermögen gibt «kein Anspruch», keine Orientierung', () => {
    expect(calculateIPV(person({ finanzen: { savingsAccount: 1000000 } }))).toMatchObject({ belegt: true, eligible: false, noteKey: 'ipv.nwKeinAnspruch' });
  });

  it('Art. 20a: höchstens die eigene Prämie; ohne Prämie keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, kkPremium: 100 })).annual).toBe(1200);
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, kkPremium: null }))).toMatchObject({ belegt: false, offen: 'praemie' });
  });

  it('Mindestbetrag und Grenze: zwei verschiedene Sätze', () => {
    expect(calculateIPV(person({ monthlyIncome: 53001 / 12 }))).toMatchObject({ belegt: true, eligible: false, noteKey: 'ipv.nwUnterMindestbetrag' });
    expect(calculateIPV(person({ monthlyIncome: 54000 / 12 }))).toMatchObject({ belegt: true, eligible: false, noteKey: 'ipv.nwKeinAnspruch' });
  });

  it('Kinder: wo die Lesarten auseinandergehen, keine Zahl; darüber 80 % = 1 008, ungedeckelt', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ age: 5 }] }))).toMatchObject({ belegt: false, amount: null, offen: 'mindestanspruch' });
    expect(calculateIPV(person({ monthlyIncome: 70000 / 12, children: [{ age: 5 }] }))).toMatchObject({ eligible: true, annual: 1008 });
    // Der Kinderanteil hängt nicht an der Prämie der erwachsenen Person.
    expect(calculateIPV(person({ monthlyIncome: 70000 / 12, children: [{ age: 5 }], kkPremium: 10 })).annual).toBe(1008);
  });

  it('ein im Anspruchsjahr geborenes Kind zählt (Art. 17 Abs. 2) — aber nur ab dem Geburtsmonat (W3, Art. 20a)', () => {
    // März: 10 Monate → 1 008 × 10/12 = 840 · Juli: 6 Monate → 504 · Dezember: 1 Monat → 84, unter 100
    expect(calculateIPV(person({ monthlyIncome: 70000 / 12, children: [{ birthDate: '2026-03-01' }] }))).toMatchObject({ eligible: true, annual: 840 });
    expect(calculateIPV(person({ monthlyIncome: 70000 / 12, children: [{ birthDate: '2026-07-15' }] }))).toMatchObject({ eligible: true, annual: 504 });
    expect(calculateIPV(person({ monthlyIncome: 70000 / 12, children: [{ birthDate: '2026-12-01' }] })))
      .toMatchObject({ belegt: true, eligible: false, noteKey: 'ipv.nwUnterMindestbetrag' });
    // Gegenprobe: 2025 geboren → ganzes Jahr.
    expect(calculateIPV(person({ monthlyIncome: 70000 / 12, children: [{ birthDate: '2025-12-01' }] })).annual).toBe(1008);
  });

  it('erhaltene Alimente zählen zum Reineinkommen (StG Art. 26 Abs. 1 Ziff. 6, W2): 20 000 + 1 500/Monat → 1 600', () => {
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { alimenteReceived: 1500 } })).annual).toBe(1600);
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { alimenteReceived: 'abc' } })).annual).toBe(3400);
  });

  it('unlesbares Einkommen oder Vermögen: keine Zahl statt «kein Anspruch» (K5)', () => {
    expect(calculateIPV(person({ monthlyIncome: 'abc' }))).toMatchObject({ belegt: false, amount: null, offen: 'eingabeUnlesbar' });
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { savingsAccount: 'x' } }))).toMatchObject({ belegt: false, offen: 'eingabeUnlesbar' });
  });

  it('negatives Einkommen: keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: -500 }))).toMatchObject({ belegt: false, offen: 'einkommenNegativ' });
  });

  it('Alter nach Jahrgang [3]: 2000 rechnet; 2001–2007 Grund «ausbildung»; ohne Datum «alter»', () => {
    expect(calculateIPV(person({ dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ dob: '2001-01-01' }))).toMatchObject({ belegt: false, offen: 'ausbildung' });
    expect(calculateIPV(person({ dob: '2007-12-31' }))).toMatchObject({ belegt: false, offen: 'ausbildung' });
    expect(calculateIPV(person({ dob: '' }))).toMatchObject({ belegt: false, offen: 'alter' });
  });

  it('Kinder nach Jahrgang [3] («2008 und jünger»); eingetippt eins mehr', () => {
    expect(calculateIPV(person({ monthlyIncome: 70000 / 12, children: [{ birthDate: '2008-12-31' }] })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ birthDate: '2007-12-31' }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 18 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
  });

  it('Paare, Konkubinat, mehrere Erwachsene: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { household: { adults: 2, children: [] } } }))).toMatchObject({ offen: 'haushalt' });
  });

  describe('Frist [2] Art. 22 (30. April) und Jahres-Riegel', () => {
    it('bis 30. April 2026: Frist läuft, es wird abgezogen', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-04-30T12:00:00'));
      const d = person({ monthlyIncome: 20000 / 12 });
      expect(calculateIPV(d)).toMatchObject({ noteKey: 'ipv.nwFristLaeuft', anmeldefristVorbei: false, noteParams: { jahr: 2026, folgejahr: 2027 } });
      expect(ipvAbzug(d).betrag).toBe(283);
    });
    it('ab 1. Mai 2026: verwirkt — nichts abgezogen, die Hinweise nennen Nidwalden', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-05-01T12:00:00'));
      const d = person({ monthlyIncome: 20000 / 12 });
      expect(calculateIPV(d)).toMatchObject({ noteKey: 'ipv.nwFristVorbei', anmeldefristVorbei: true });
      expect(calculateIPV(d)).toMatchObject({ fristNichtAbgezogenKey: 'ipv.nwFristNichtAbgezogen' });
      expect(ipvAbzug(d)).toMatchObject({ betrag: 0, grund: 'fristVorbei', frist: { jahr: 2026, vorjahr: 2025 } });
      // Alle drei Leser (Weg wie FR, fristHinweisKey): Prämien-Beleg, Budget — KK-Karte im Anzeige-Test.
      expect(praemienBelegState(d)).toMatchObject({ mode: 'fristVorbei', noteKey: 'ipv.nwFristNichtAbgezogen' });
      const t = (k, p) => (p ? `${k}(${Object.values(p).join('|')})` : k);
      const texte = calculateMonthlyBudget(d, t).recommendations.map((x) => x.text);
      expect(texte.some((x) => x.startsWith('ipv.nwFristNichtAbgezogen('))).toBe(true);
      expect(texte.some((x) => /LuFrist|luFrist/.test(x))).toBe(false);
    });
    it('ab 2027 keine Zahl mehr', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 20000 / 12 }))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });
});
