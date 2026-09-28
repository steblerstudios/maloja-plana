import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_OW, ipvObwaldenRechnen, owSelbstbehaltProzent, owJahrAufgerundet } from '../ipvObwalden.js';
import { SAEULE_3A } from '../kantonsModell.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';
import { ipvAbzug } from '../../data/ipvAbzug.js';
import { calculateMonthlyBudget } from '../../budgetSync.js';
import { praemienBelegState } from '../../data/praemienBeleg.js';

// K31 — Prämienverbilligung Kanton Obwalden 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt OW:
//   [1] GDB 851.12 Kantonsratsbeschluss Selbstbehalt 2026 (26.03.2026, in Kraft 01.01.2026)
//   [2] GDB 851.1 EG KVG (Art. 2)
//   [3] GDB 851.11 EV KVG (Art. 5, 6, 7, 7a, 10, 14)
//   [4] Ausgleichskasse Obwalden, Merkblatt Prämienverbilligung 2026 (Stand Januar 2026)
//   [5] Ausgleichskasse Obwalden, IPV-Rechner (Parameter im Seitenquelltext)
//   [6] GDB 641.4 Steuergesetz Art. 54, Fassung 2024

// Wörtlich abgeschrieben, absichtlich nicht aus IPV_OW abgeleitet.
const RICHTPRAEMIE_2026 = { e: 5018.40, j: 3570, k: 1380 }; // [4], [5]

describe('K31 calculateIPV für OW, bevor das OW-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'OW', dateOfBirth: '1980-05-01' }, finanzen: { monthlyIncome: 2000 } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 OW: die Werte 2026 stehen so in [1], [3], [4], [6]', () => {
  it('Richtprämien [4], Selbstbehalt [1] Ziff. 1', () => {
    expect(IPV_OW.jahr).toBe(2026);
    expect(IPV_OW.richtpraemie).toEqual(RICHTPRAEMIE_2026);
    expect(IPV_OW.selbstbehalt).toEqual({ satz: 9.5, bis: 35000, jeHundert: 0.01 });
  });
  it('Grenzen Art. 7 Abs. 1/2 und Mindestanspruch Art. 7 Abs. 4/5 [3]', () => {
    expect(IPV_OW.grenze).toEqual({ ohneKinder: 50000, mitKindern: 75000 });
    expect(IPV_OW.mindestanspruch).toEqual({ grenze: 50000, kind: 0.8, abViertemKind: 1.0 });
  });
  it('Art. 7a lit. h/i [3], Art. 54 StG [6], Art. 14 Abs. 6 [3], Art. 7 Abs. 6 [3]', () => {
    expect(IPV_OW.kinderabzug).toBe(7000);
    expect(IPV_OW.vermoegenAnteil).toBe(0.10);
    expect(IPV_OW.steuerfreierBetrag).toEqual({ alleinstehend: 25000, jeKind: 10000 });
    expect(IPV_OW.mindestbetrag).toBe(100);
    // StG Art. 35 Abs. 1 lit. g (Fassung 2024), über EV Art. 7a lit. d (Fachprüfung #476, W4).
    expect(IPV_OW.versicherungsabzug).toEqual({ alleinstehend: 1700, jeKind: 700 });
    expect(IPV_OW.basisjahrAbstand).toBe(2);
  });
  it('Register und Beleg: eigenes Modul ohne PLZ-Abhängigkeit, keine Musterwerte, Antrag bei der Ausgleichskasse', () => {
    expect(IPV_MODULE.OW).toMatchObject({ fn: 'ipvObwalden', brauchtPLZ: false });
    expect(CANTONAL_IPV.OW.beleg.quelle).toMatch(/GDB 851\.12/);
    expect(CANTONAL_IPV.OW.beleg.stand).toMatch(/2026/);
    for (const k of ['maxIncome', 'subsidySingle', 'subsidyFamily', 'subsidyChild']) expect(CANTONAL_IPV.OW[k]).toBeNull();
    expect(CANTONAL_IPV.OW.noteKey).toBe('ipv.noteApplyCompensation');
  });
  it('Rahmen: die 3a bleibt voll im Einkommen (Art. 7a [3] zieht sie nicht ab)', () => {
    expect(SAEULE_3A.voll.kantone).toMatch(/OW/);
    expect(SAEULE_3A.voll.beleg).toMatch(/GDB 851\.11/);
  });
});

describe('K31 OW: Selbstbehalt [1] — linear-progressiv', () => {
  it('9,5 % bis 35 000; Kontrollwert [4]: «Bei … 45\'000 Franken beträgt er beispielsweise 10.5%»', () => {
    expect(owSelbstbehaltProzent(0)).toBe(9.5);
    expect(owSelbstbehaltProzent(35000)).toBe(9.5);
    expect(owSelbstbehaltProzent(45000)).toBeCloseTo(10.5, 9);
  });
  it('gewählt: stetig wie der Rechner [5], nicht in 100er-Stufen (35 050 → 9,505 %)', () => {
    expect(owSelbstbehaltProzent(35050)).toBeCloseTo(9.505, 9);
  });
  it('der Beschluss allein ergibt über 60 000 mehr als 12 % (75 000 → 13,5 %) — ob das gilt, ist offen (B2)', () => {
    expect(owSelbstbehaltProzent(60000)).toBeCloseTo(12, 9);
    expect(owSelbstbehaltProzent(75000)).toBeCloseTo(13.5, 9);
  });
  it('Lesart «Rahmen 9–12 %» (EG KVG seit 01.04.2026) nur zum Vergleich: AE 62 000, zwei Kinder → 214.40 gegen 338.40', () => {
    expect(ipvObwaldenRechnen({ ae: 62000, kinderZahl: 2 }).total).toBeCloseTo(7778.4 - 0.122 * 62000, 6);
    expect(ipvObwaldenRechnen({ ae: 62000, kinderZahl: 2, satzDeckel: 12 }).total).toBeCloseTo(7778.4 - 0.12 * 62000, 6);
  });
});

describe('K31 OW: die Rechnung', () => {
  it('Einkommen 0: die volle Richtprämie 5 018.40', () => {
    expect(ipvObwaldenRechnen({ ae: 0 }).total).toBeCloseTo(5018.4, 9);
  });
  it('Handrechnungen Alleinstehende: 20 000 → 3 118.40 · 35 000 → 1 693.40 · 45 000 → 293.40', () => {
    expect(ipvObwaldenRechnen({ ae: 20000 }).total).toBeCloseTo(3118.4, 9);
    expect(ipvObwaldenRechnen({ ae: 35000 }).total).toBeCloseTo(1693.4, 9);
    expect(ipvObwaldenRechnen({ ae: 45000 }).total).toBeCloseTo(293.4, 9);
  });
  it('Nullpunkt der Formel bei ≈ 46 931 — die harte Grenze 50 000 wirkt für Alleinstehende nie', () => {
    expect(ipvObwaldenRechnen({ ae: 46930 }).total).toBeGreaterThan(0);
    expect(ipvObwaldenRechnen({ ae: 46932 }).total).toBe(0);
  });
  it('Mindestbetrag Art. 14 Abs. 6: 46 500 → 66.15 besteht, wird aber nicht ausbezahlt', () => {
    const r = ipvObwaldenRechnen({ ae: 46500 });
    expect(r.total).toBeCloseTo(66.15, 9);
    expect(r.grund).toBe('mindestbetrag');
    expect(ipvObwaldenRechnen({ ae: 47000 }).grund).toBe('ueberGrenze');
  });
  it('ein Kind, 40 000: allgemein 2 398.40; Kind mindestens 80 % = 1 104, die erwachsene Person erhält den Rest', () => {
    const r = ipvObwaldenRechnen({ ae: 40000, kinderZahl: 1 });
    expect(r.allgemein).toBeCloseTo(6398.4 - 4000, 9);
    expect(r.anteileKinder[0]).toBeCloseTo(1104, 9);
    expect(r.anteilErwachsen).toBeCloseTo(1294.4, 9);
    expect(r.total).toBeCloseTo(2398.4, 9);
  });
  it('Art. 14 Abs. 3: reicht der allgemeine Anspruch nicht, gilt der Mindestanspruch allein (49 000 → 1 104)', () => {
    const r = ipvObwaldenRechnen({ ae: 49000, kinderZahl: 1 });
    expect(r.total).toBeCloseTo(1104, 9);
    expect(r.anteilErwachsen).toBe(0);
  });
  it('ab 50 000 kein Mindestanspruch mehr: 50 000 → nur noch 898.40, anteilig nach Richtprämie', () => {
    const r = ipvObwaldenRechnen({ ae: 50000, kinderZahl: 1 });
    expect(r.mindestGilt).toBe(false);
    expect(r.total).toBeCloseTo(898.4, 9);
    expect(r.anteileKinder[0]).toBeCloseTo(898.4 * 1380 / 6398.4, 9);
  });
  it('Art. 7 Abs. 5: ab dem vierten Kind 100 % (vier Kinder, 30 000)', () => {
    const r = ipvObwaldenRechnen({ ae: 30000, kinderZahl: 4 });
    expect(r.anteileKinder.map((x) => Math.round(x * 100) / 100)).toEqual([1104, 1104, 1104, 1380]);
    expect(r.total).toBeCloseTo(10538.4 - 2850, 9);
  });
  it('harte Grenze mit Kindern: 74 999 gibt bei fünf Kindern noch 1 793.61, 75 000 nichts', () => {
    expect(ipvObwaldenRechnen({ ae: 74999, kinderZahl: 5 }).total).toBeCloseTo(11918.4 - 0.134999 * 74999, 6);
    expect(ipvObwaldenRechnen({ ae: 75000, kinderZahl: 5 })).toMatchObject({ total: 0, grund: 'ueberGrenze', grenze: 75000 });
  });
});

describe('K31 OW: Rundung Art. 14 Abs. 4 — aufgerundet auf fünf Rappen im Monat', () => {
  it('3 118.40 → 259.87 → 259.90 × 12 = 3 118.80; genaue Beträge bleiben', () => {
    expect(owJahrAufgerundet(3118.4)).toBeCloseTo(3118.8, 9);
    expect(owJahrAufgerundet(1104)).toBeCloseTo(1104, 9);
    expect(owJahrAufgerundet(0)).toBe(0);
  });
});

describe('K31 calculateIPV für OW (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvObwalden.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, children = [], dob = '1980-05-01', kkPremium = 450, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'OW', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: '6060', city: 'Sarnen' },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('20 000 im Jahr − Versicherungsabzug 1 700 = 18 300: 3 280 (273.35 × 12), Basisjahr 2024, Grenze 50 000, keine Region', () => {
    const r = calculateIPV(person({ monthlyIncome: 20000 / 12 }));
    expect(r).toMatchObject({
      belegt: true, eligible: true, annual: 3280, amount: 273, maxAnnual: 5018, jahr: 2026, basisjahr: 2024,
      vorbehaltKey: 'ipv.vorbehaltOW', jahrKey: 'ipv.jahrOW',
    });
    expect(r.region).toBeUndefined();
    expect(r.cantonData.maxIncome).toBe(50000);
  });

  it('mit Kind (5 Jahre): 47 000 − 2 400 − 7 000 = 37 600 → 1 624.80 + 1 104 = 2 729; Grenze 75 000', () => {
    const r = calculateIPV(person({ monthlyIncome: 47000 / 12, children: [{ age: 5 }] }));
    expect(r).toMatchObject({ eligible: true, annual: 2729 });
    expect(r.cantonData.maxIncome).toBe(75000);
  });

  it('EG KVG Art. 2 Abs. 5: gedeckelt auf die eigene Prämie — nur der Anteil der erwachsenen Person', () => {
    // Prämie 50/Monat = 600/Jahr (auch der Versicherungsabzug ist dann nur 600): 600 + 1 104 = 1 704
    expect(calculateIPV(person({ monthlyIncome: 47000 / 12, children: [{ age: 5 }], kkPremium: 50 })).annual).toBe(1704);
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, kkPremium: null }))).toMatchObject({ belegt: false, amount: null, offen: 'praemie' });
  });

  it('Vermögen: 10 % des STEUERBAREN Vermögens — bis 25 000 zählt nichts', () => {
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { savingsAccount: 25000 } })).annual).toBe(3280);
    // 45 000 − 25 000 = 20 000 → + 2 000 → 20 300 → 3 089.90 → 257.50 × 12 = 3 090
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { savingsAccount: 45000 } })).annual).toBe(3090);
  });

  it('keine Vermögensgrenze: viel Vermögen gibt «kein Anspruch», keine Orientierung', () => {
    expect(calculateIPV(person({ finanzen: { savingsAccount: 1000000 } }))).toMatchObject({ belegt: true, eligible: false, noteKey: 'ipv.owKeinAnspruch' });
  });

  it('Mindestbetrag und Grenze: zwei verschiedene Sätze', () => {
    // 48 200 − 1 700 = 46 500 → 66.15 · 49 000 − 1 700 = 47 300 → über dem Nullpunkt
    expect(calculateIPV(person({ monthlyIncome: 48200 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.owUnterMindestbetrag' });
    expect(calculateIPV(person({ monthlyIncome: 49000 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.owKeinAnspruch' });
  });

  it('harte Grenze mit fünf Kindern: 75 000 anrechenbar → kein Anspruch; 74 999 → keine Zahl (12-%-Frage, B2)', () => {
    const kinder = Array.from({ length: 5 }, () => ({ age: 5 }));
    // 115 200 − 1 700 − 3 500 − 35 000 = 75 000
    expect(calculateIPV(person({ monthlyIncome: 115200 / 12, children: kinder }))).toMatchObject({ belegt: true, eligible: false, noteKey: 'ipv.owKeinAnspruch' });
    expect(calculateIPV(person({ monthlyIncome: 115199 / 12, children: kinder }))).toMatchObject({ belegt: false, amount: null, offen: 'owSelbstbehaltRahmen' });
  });

  it('🛑 B2: über 12 % und der Betrag hängt davon ab → keine Zahl; hängt er nicht davon ab → Zahl', () => {
    const zwei = [{ age: 5 }, { age: 8 }];
    // 79 100 − 1 700 − 1 400 − 14 000 = 62 000: 214.40 (Beschluss) gegen 338.40 (Rahmen)
    expect(calculateIPV(person({ monthlyIncome: 79100 / 12, children: zwei }))).toMatchObject({ belegt: false, offen: 'owSelbstbehaltRahmen' });
    // 83 000 → AE 65 900: nach beiden Lesarten 0 — dann darf eine Zahl stehen («kein Anspruch»).
    expect(calculateIPV(person({ monthlyIncome: 83000 / 12, children: zwei }))).toMatchObject({ belegt: true, eligible: false });
    // Ohne Kinder endet der Anspruch bei 50 000 — dort wirkt die Frage nie.
    expect(calculateIPV(person({ monthlyIncome: 70000 / 12 }))).toMatchObject({ belegt: true, eligible: false });
  });

  it('Säule 3a: bleibt voll im Einkommen — und steckt schon im Nettoeinkommen', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 0 } })).annual;
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 7258 } })).annual).toBe(ohne);
  });

  it('negatives Einkommen: keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: -500 }))).toMatchObject({ belegt: false, offen: 'einkommenNegativ' });
  });

  it('Alter nach Jahrgang [4] («Erwachsene ab Jahrgang 2000»): 2000 rechnet; 2001–2007 Grund «ausbildung»', () => {
    expect(calculateIPV(person({ dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ dob: '2001-01-01' }))).toMatchObject({ belegt: false, offen: 'ausbildung' });
    expect(calculateIPV(person({ dob: '2007-12-31' }))).toMatchObject({ belegt: false, offen: 'ausbildung' });
    expect(calculateIPV(person({ dob: '2008-06-01' }))).toMatchObject({ belegt: false, offen: 'alter' });
    expect(calculateIPV(person({ dob: '' }))).toMatchObject({ belegt: false, offen: 'alter' });
  });

  it('bezahlte Alimente: Art. 7a lit. c [3] zieht Unterhaltsbeiträge ab', () => {
    // 30 000 − 1 700 = 28 300 → 2 329.90 → 194.20 × 12 = 2 330.40 → 2 330
    // mit 12 000 Alimente: 16 300 → 3 469.90 → 289.20 × 12 → 3 470
    expect(calculateIPV(person({ monthlyIncome: 2500 })).annual).toBe(2330);
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { alimentePaid: 1000 } })).annual).toBe(3470);
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { alimentePaid: 'abc' } })).annual).toBe(2330);
  });

  it('Versicherungsabzug (W4): höchstens die eigene Prämie, höchstens 1 700 + 700 je Kind', () => {
    // Prämie 100/Monat = 1 200: 20 000 − 1 200 = 18 800 → 3 232.40 → 269.40 × 12 = 3 232.80 → 3 233 (gedeckelt 1 200)
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, kkPremium: 100 })).annual).toBe(1200);
    // Prämie 450 (5 400/Jahr): abgezogen nur 1 700 → 3 280, nicht mehr.
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, kkPremium: 450 })).annual).toBe(3280);
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, kkPremium: 900 })).annual).toBe(3280);
  });

  it('Kinder: Jahrgang 2009 rechnet; Jahrgang 2008 nicht (eigener Antrag laut Merkblatt) — Grund «kind18», nicht «Paare» (W3)', () => {
    expect(calculateIPV(person({ children: [{ birthDate: '2009-01-01' }] })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ birthDate: '2008-12-31' }] }))).toMatchObject({ offen: 'kind18' });
    expect(calculateIPV(person({ children: [{ age: 16 }] })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ age: 17 }] }))).toMatchObject({ offen: 'kind18' });
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
  });

  it('ein im Anspruchsjahr geborenes Kind zählt erst im Folgejahr (Art. 6 Abs. 2 [3])', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 20000 / 12 }));
    const neu = calculateIPV(person({ monthlyIncome: 20000 / 12, children: [{ birthDate: '2026-02-01' }] }));
    expect(neu.annual).toBe(ohne.annual);
    expect(neu.cantonData.maxIncome).toBe(50000);
  });

  it('Paare, Konkubinat, mehrere Erwachsene: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { household: { adults: 2, children: [] } } }))).toMatchObject({ offen: 'haushalt' });
  });

  describe('Frist Art. 10 Abs. 3/7 [3] (2026: 31. Mai) und Jahres-Riegel', () => {
    it('bis 31. Mai 2026: Frist läuft, es wird abgezogen', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-05-31T12:00:00'));
      const r = calculateIPV(person({ monthlyIncome: 20000 / 12 }));
      expect(r).toMatchObject({ noteKey: 'ipv.owFristLaeuft', anmeldefristVorbei: false, noteParams: { jahr: 2026, folgejahr: 2027 } });
      expect(ipvAbzug(person({ monthlyIncome: 20000 / 12 }), r).betrag).toBe(273);
    });
    it('ab 1. Juni 2026: verwirkt — nichts abgezogen, und ALLE DREI Leser nennen Obwalden (B1)', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-09-28T12:00:00'));
      const d = person({ monthlyIncome: 20000 / 12 });
      expect(calculateIPV(d)).toMatchObject({ noteKey: 'ipv.owFristVorbei', anmeldefristVorbei: true, fristNichtAbgezogenKey: 'ipv.owFristNichtAbgezogen' });
      expect(ipvAbzug(d)).toMatchObject({ betrag: 0, grund: 'fristVorbei', frist: { jahr: 2026, vorjahr: 2025 } });
      // Leser 1: Prämien-Beleg (Schnellcheck) — hier stand bis zur Prüfung der Luzerner Satz.
      expect(praemienBelegState(d)).toMatchObject({ mode: 'fristVorbei', noteKey: 'ipv.owFristNichtAbgezogen' });
      // Leser 2: Budget.
      const t = (k, p) => (p ? `${k}(${Object.values(p).join('|')})` : k);
      const texte = calculateMonthlyBudget(d, t).recommendations.map((x) => x.text);
      expect(texte.some((x) => x.startsWith('ipv.owFristNichtAbgezogen('))).toBe(true);
      expect(texte.some((x) => /LuFrist|luFrist/.test(x))).toBe(false);
      // Leser 3: KK-Last-Karte (Render-Test in ipvObwaldenAnzeige.test.js).
    });
    it('ab 2027 keine Zahl mehr', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 20000 / 12 }))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });
});
