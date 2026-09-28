import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_GL, glSatz, glAnrechenbaresEinkommen, ipvGlarusRechnen } from '../ipvGlarus.js';
import { SAEULE_3A, ERWACHSEN } from '../kantonsModell.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Glarus 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt GL:
//   [1] EG KVG GL (GS VIII D/21/1), Version 2376 — Art. 10–17
//   [2] PVV (GS VIII D/21/3), Version 2130 — Art. 1–4
//   [3] VV PV (GS VIII D/21/2), Version 2133 — Art. 6, 9, 10, 17
//   [4] Fachstelle IPV, «Richtprämien … 2026», 18.11.2025
//   [5] Fachstelle IPV, «Erläuterungen und Berechnungsbeispiele zur IPV 2026» — der Prüfstein
//   [7] Steuergesetz GL (GS VI C/1/1), Stand 01.01.2024, Art. 45

describe('K31 calculateIPV für GL, bevor das GL-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'GL', dateOfBirth: '1980-05-01' }, finanzen: { monthlyIncome: 2000 }, versicherungen: { kkPremium: 500 } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 GL: die amtlichen Berechnungsbeispiele [5] — jede Zahl', () => {
  it('Alleinstehende Person: 35 000, 9 % → 5 447 − 3 150 = 2 297', () => {
    const r = ipvGlarusRechnen({ ae: 35000 });
    expect(r.satz).toBe(0.09);
    expect(r.selbstbehalt).toBeCloseTo(3150, 9);
    expect(r.summe).toBe(5447);
    expect(r.differenz).toBeCloseTo(2297, 9);
    expect(r.varianten.b.erwachsen).toBeCloseTo(2297, 9);
  });
  it('Eltern mit 2 Kindern: 65 000, 12 % → 13 894 − 7 800 = 6 094', () => {
    const r = ipvGlarusRechnen({ ae: 65000, kinderZahl: 2, erwachsene: 2 });
    expect(r.summe).toBe(2 * 5447 + 2 * 1500);
    expect(r.satz).toBe(0.12);
    expect(r.selbstbehalt).toBeCloseTo(7800, 9);
    expect(r.differenz).toBeCloseTo(6094, 9);
  });
  it('🛑 dasselbe Beispiel: nur Lesart (a) ergibt 6 094 — Lesart (b) 7 178; beide unter 85 000', () => {
    const r = ipvGlarusRechnen({ ae: 65000, kinderZahl: 2, erwachsene: 2 });
    expect(r.garantie).toBe(true);
    const total = (v) => 2 * v.erwachsen + 2 * v.kind;
    expect(total(r.varianten.a)).toBeCloseTo(6094, 6);
    expect(Math.round(total(r.varianten.b))).toBe(7178);
  });
});

describe('K31 GL: die Zahlen 2026, wörtlich', () => {
  it('[4] Richtprämien 5 447 / 3 896 / 1 500 — amtlich GERUNDET (nicht 5 446.80)', () => {
    expect(IPV_GL.richtpraemie).toEqual({ e: 5447, j: 3896, k: 1500 });
  });
  it('[2] Art. 1 Selbstbehalte 9–14 % in 10 000er-Stufen, «bis» einschliesslich', () => {
    expect(IPV_GL.selbstbehalt.map((s) => s.satz)).toEqual([0.09, 0.10, 0.11, 0.12, 0.13, 0.14]);
    expect(IPV_GL.selbstbehalt.map((s) => s.bis)).toEqual([40000, 50000, 60000, 70000, 80000, Infinity]);
    expect([0, 40000, 40001, 50000, 80000, 80001].map(glSatz)).toEqual([0.09, 0.09, 0.10, 0.10, 0.13, 0.14]);
  });
  it('[2] Art. 2–4, [3] Art. 9 Abs. 3, [7] Art. 45', () => {
    expect(IPV_GL.vermoegenAnteil).toBe(0.10);
    expect(IPV_GL.kinderabzug).toBe(5000);
    expect(IPV_GL.mindestanteilKind).toBe(0.8);
    expect(IPV_GL.grenzbetragKinder).toBe(85000);
    expect(IPV_GL.mindestbetragJePerson).toBe(12);
    expect(IPV_GL.vermoegenFrei).toEqual({ allein: 76300, alleinMitKindern: 152600, jeKind: 25400 });
    expect(IPV_GL.basisjahrAbstand).toBe(2);
  });
  it('benannte Regeln: 3a im Total der Einkünfte, Alter am 31.12. des Vorjahres', () => {
    expect(SAEULE_3A.totalDerEinkuenfte).toMatchObject({ name: 'totalDerEinkuenfte', kantone: 'GL' });
    expect(SAEULE_3A.totalDerEinkuenfte.beleg).toMatch(/EG KVG GL Art\. 15 Abs\. 1/);
    expect(SAEULE_3A.totalDerEinkuenfte.nichtAufgerechnet({ pension3a: 7258 })).toBe(0);
    expect(ERWACHSEN.abEndeVorjahr(2026, 1999)).toBe(true);
    expect(ERWACHSEN.abEndeVorjahr(2026, 2000)).toBe(false);
  });
});

describe('K31 GL: Stufen und anrechenbares Einkommen', () => {
  it('der Satz gilt auf das GANZE Einkommen: an jeder Stufe ein Sprung', () => {
    expect(ipvGlarusRechnen({ ae: 40000 }).differenz).toBeCloseTo(1847, 9);
    expect(ipvGlarusRechnen({ ae: 40001 }).differenz).toBeCloseTo(1446.9, 9);
    expect(ipvGlarusRechnen({ ae: 50000 }).differenz).toBeCloseTo(447, 9);
    expect(ipvGlarusRechnen({ ae: 50001 }).differenz).toBe(0);
  });
  it('Einkommen 0: die volle Richtprämie', () => {
    expect(ipvGlarusRechnen({ ae: 0 }).differenz).toBe(5447);
  });
  it('10 % des steuerbaren Vermögens (über 76 300; mit Kindern 152 600 + 25 400 je Kind), − 5 000 je Kind', () => {
    expect(glAnrechenbaresEinkommen({ totalEinkuenfte: 24000, vermoegen: 76300, kinderZahl: 0 })).toBe(24000);
    expect(glAnrechenbaresEinkommen({ totalEinkuenfte: 24000, vermoegen: 176300, kinderZahl: 0 })).toBe(34000);
    expect(glAnrechenbaresEinkommen({ totalEinkuenfte: 24000, vermoegen: 178000, kinderZahl: 1 })).toBe(19000);
  });
});

describe('K31 calculateIPV für GL (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvGlarus.js');
    await new Promise((res) => setTimeout(res, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 2000, children = [], dob = '1980-05-01', kkPremium = 500, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'GL', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: '8750', city: 'Glarus' },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('im Register; belegt; keine Musterwerte; Weg = Antrag, nicht «automatisch»', () => {
    expect(IPV_MODULE.GL).toMatchObject({ fn: 'ipvGlarus', brauchtPLZ: false });
    expect(CANTONAL_IPV.GL.beleg.quelle).toMatch(/EG KVG GL/);
    expect(CANTONAL_IPV.GL).toMatchObject({ maxIncome: null, subsidySingle: null, noteKey: 'ipv.noteApplyGl' });
    expect(CANTONAL_IPV.GL.noteKey).not.toBe('ipv.noteAutoTaxData');
  });

  it('allein, 2 000 im Monat = 24 000: 9 % → 5 447 − 2 160 = 3 287', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-09-28T12:00:00'));
    const r = calculateIPV(person());
    expect(r).toMatchObject({
      belegt: true, eligible: true, annual: 3287, amount: 274, jahr: 2026, basisjahr: 2024,
      vorbehaltKey: 'ipv.vorbehaltGL', jahrKey: 'ipv.jahrGL',
    });
    expect(r.cantonData.maxIncome).toBe(null);
    expect(r.maxAnnual).toBe(5447);
  });

  it('die Stufe: 39 996 → 1 847, 40 008 → 1 446', () => {
    expect(calculateIPV(person({ monthlyIncome: 3333 })).annual).toBe(1847);
    expect(calculateIPV(person({ monthlyIncome: 3334 })).annual).toBe(1446);
  });

  it('über dem Nullpunkt: kein Anspruch, ohne Grenze als Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 4167 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.glKeinAnspruch' });
  });

  it('Vermögen: 10 % über 76 300 (176 300 → + 10 000 → 3 060 Selbstbehalt → 2 387)', () => {
    expect(calculateIPV(person({ finanzen: { savingsAccount: 176300 } })).annual).toBe(2387);
  });

  it('Säule 3a: im Total der Einkünfte nicht abgezogen — der Betrag ändert sich nicht', () => {
    expect(calculateIPV(person({ finanzen: { pension3a: 7258 } })).annual).toBe(3287);
  });

  it('[1] Art. 14 Abs. 1: höchstens die Prämie der Person — ohne Prämie keine Zahl', () => {
    expect(calculateIPV(person({ kkPremium: 200 }))).toMatchObject({ annual: 2400 });
    expect(calculateIPV(person({ kkPremium: null }))).toMatchObject({ belegt: false, offen: 'praemie' });
  });

  it('mit Kind, Kinderanteil über 80 %: beide Lesarten gleich (18 000 − 5 000 = 13 000 → 5 777)', () => {
    const r = calculateIPV(person({ monthlyIncome: 1500, children: [{ birthDate: '2020-03-01' }] }));
    expect(r).toMatchObject({ eligible: true, annual: 5777, amount: 481 });
  });

  it('🛑 mit Kind, Kinderanteil unter 80 %: die Lesarten gehen auseinander → keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 3000, children: [{ birthDate: '2020-03-01' }] })))
      .toMatchObject({ belegt: false, amount: null, offen: 'mindestanspruch' });
  });

  it('[1] Art. 11 Abs. 2: ein im Anspruchsjahr geborenes Kind zählt erst ab dem Folgejahr', () => {
    expect(calculateIPV(person({ children: [{ birthDate: '2026-03-01' }] })).annual).toBe(3287);
  });

  it('[3] Art. 17: wer im Anspruchsjahr 18 wird, hat einen eigenen Anspruch — keine Zahl', () => {
    expect(calculateIPV(person({ children: [{ birthDate: '2008-06-01' }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 17 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: 1500, children: [{ birthDate: '2009-06-01' }] })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 1500, children: [{ age: 16 }] })).belegt).toBe(true);
  });

  it('Alter am 31.12. des Vorjahres: Jahrgang 1999 ist erwachsen, 2000 nicht', () => {
    expect(calculateIPV(person({ dob: '1999-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ dob: '2000-01-01' }))).toMatchObject({ offen: 'alter' });
  });

  it('Paare und Konkubinat (Gesamtanspruch, [1] Art. 10), Kinder ohne Alter: Orientierung', () => {
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
  });

  it('negatives Einkommen: keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: -2000 }))).toMatchObject({ offen: 'einkommenNegativ' });
  });

  describe('Fachprüfung #487 — Alimente, 12-Franken-Regel, Kante 85 000', () => {
    it('⚠️1 bezahlte Alimente (PVV Art. 3 lit. c): 24 000 − 6 000 = 18 000 → 5 447 − 1 620 = 3 827 (vorher 3 287)', () => {
      expect(calculateIPV(person({ finanzen: { alimentePaid: 500 } })).annual).toBe(3827);
      expect(calculateIPV(person({ finanzen: { alimentePaid: 'x' } })).annual).toBe(3287);
      expect(calculateIPV(person({ finanzen: { alimentePaid: -500 } })).annual).toBe(3287);
      expect(glAnrechenbaresEinkommen({ totalEinkuenfte: 24000, vermoegen: 0, kinderZahl: 0, alimenteBezahlt: 6000 })).toBe(18000);
    });
    it('⚠️1 erhaltene Alimente und Familienzulagen: NICHT eingerechnet (Erlass nennt sie nicht) — Vorbehalt sagt es', () => {
      const r = calculateIPV(person({ finanzen: { alimenteReceived: 800, familienzulagen: 230 } }));
      expect(r).toMatchObject({ annual: 3287, vorbehaltKey: 'ipv.vorbehaltGL' });
    });
    it('⚠️2 [3] Art. 9 Abs. 3 nach dem Deckel: Prämie 10.80/Jahr → nichts ausgerichtet, Grund «Mindestbetrag»; 12.00 → 12', () => {
      expect(calculateIPV(person({ kkPremium: 0.9 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.glUnterMindestbetrag' });
      expect(calculateIPV(person({ kkPremium: 1 }))).toMatchObject({ eligible: true, annual: 12 });
    });
    it('⚠️2 Kindergarantie bis und mit 85 000 ([2] Art. 4 «nicht übersteigt»): 85 000 ja, 85 001 nein', () => {
      expect(ipvGlarusRechnen({ kinderZahl: 1, ae: 85000 })).toMatchObject({ garantie: true });
      expect(ipvGlarusRechnen({ kinderZahl: 1, ae: 85000 }).varianten.b.kind).toBeCloseTo(1200, 9);
      expect(ipvGlarusRechnen({ kinderZahl: 1, ae: 85001 })).toMatchObject({ garantie: false });
      expect(ipvGlarusRechnen({ kinderZahl: 1, ae: 85001 }).varianten.b.kind).toBe(0);
    });
  });

  describe('Frist [3] Art. 6 und Jahres-Riegel', () => {
    it('bis 31.01.2026: die Frist läuft', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-01-15T12:00:00'));
      expect(calculateIPV(person())).toMatchObject({ noteKey: 'ipv.glFristLaeuft', anmeldefristVorbei: false, noteParams: { jahr: 2026, folgejahr: 2027 } });
    });
    it('danach: Frist vorbei — Budget zieht nichts ab und sagt es mit dem Glarner Satz', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-09-28T12:00:00'));
      expect(calculateIPV(person())).toMatchObject({ noteKey: 'ipv.glFristVorbei', anmeldefristVorbei: true, fristNichtAbgezogenKey: 'ipv.glFristNichtAbgezogen' });
    });
    it('⚠️2 Kante: 31.01.2026 23:59 läuft noch, 01.02.2026 00:00:01 vorbei', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-01-31T23:59:00'));
      expect(calculateIPV(person())).toMatchObject({ noteKey: 'ipv.glFristLaeuft', anmeldefristVorbei: false });
      vi.setSystemTime(new Date('2026-02-01T00:00:01'));
      expect(calculateIPV(person())).toMatchObject({ noteKey: 'ipv.glFristVorbei', anmeldefristVorbei: true });
    });
    it('ab 2027 keine Zahl mehr', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person())).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });
});
