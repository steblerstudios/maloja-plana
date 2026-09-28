import { describe, it, expect, beforeAll, vi } from 'vitest';
import { IPV_AI, ipvAppenzellInnerrhodenRechnen, aiSelbstbehaltProzent, aiKinderabzug } from '../ipvAppenzellInnerrhoden.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Appenzell Innerrhoden 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt AI:
//   [1] StKB IPV GS 832.501, in Kraft seit 01.01.2026 (Beschluss 02.12.2025) — Art. 3, 5, 6, Anhang A1-1
//   [2] Gesundheitsamt AI, Merkblatt IPV 2026 — vier Berechnungsbeispiele (Ziff. 3.4)
//   [3] Steuergesetz GS 640.000, in Kraft seit 01.01.2024 — Art. 37, 38 Abs. 5, 45

describe('K31 AI: die amtlichen Berechnungsbeispiele [2] Ziff. 3.4 — jede Zahl', () => {
  it('Alleinstehend, 20 000: Selbstbehalt 1 400, IPV 3 240', () => {
    const r = ipvAppenzellInnerrhodenRechnen({ personen: ['e'], me: 20000 });
    expect(r.selbstbehaltBetrag).toBe(1400);
    expect(r.total).toBe(3240);
  });
  it('Eltern mit zwei Kindern, 60 000: 11 348 − 5 325 = 6 023, Erhöhung 556, total 6 579', () => {
    const r = ipvAppenzellInnerrhodenRechnen({ personen: ['e', 'e', 'k', 'k'], me: 60000 });
    expect(r.summe).toBe(11348);
    expect(r.prozent).toBeCloseTo(8.875, 9);
    expect(r.selbstbehaltBetrag).toBe(5325);
    expect(r.basis).toBe(6023);
    expect(r.erhoehung).toBe(556);
    expect(r.total).toBe(6579);
  });
  it('mit jungem Erwachsenen in Ausbildung, 75 000: 14 794 − 8 062 = 6 732, Erhöhung 867, total 7 599', () => {
    const r = ipvAppenzellInnerrhodenRechnen({ personen: ['e', 'e', 'ja', 'k', 'k'], me: 75000 });
    expect(r.summe).toBe(14794);
    expect(r.prozent).toBeCloseTo(10.75, 9);
    // 10,75 % × 75 000 = 8 062.50 — das Merkblatt schreibt «Fr. 8'062.00»: abgerundet.
    expect(r.selbstbehaltBetrag).toBe(8062);
    expect(r.basis).toBe(6732);
    expect(r.erhoehung).toBe(867);
    expect(r.total).toBe(7599);
  });
  it('junger Erwachsener in Ausbildung allein, 25 000: 3 446 − 1 750 = 1 696, Erhöhung 27, total 1 723', () => {
    const r = ipvAppenzellInnerrhodenRechnen({ personen: ['ja'], me: 25000 });
    expect(r.basis).toBe(1696);
    expect(r.erhoehung).toBe(27);
    expect(r.total).toBe(1723);
  });
});

describe('K31 AI: Konstanten wörtlich', () => {
  it('Richtprämien Anhang A1-1 Ziff. 1 [1]', () => {
    expect(IPV_AI.richtpraemie).toEqual({ e: 4640, j: 3446, k: 1034 });
  });
  it('Selbstbehalt Anhang A1-1 Ziff. 2 [1]', () => {
    expect(IPV_AI.selbstbehalt).toEqual({ satz: 7, max: 12, ab: 45000, bis: 85000, schritt: 1000, jeSchritt: 0.125 });
  });
  it('Anhebung, Mindestbetrag, Vermögen, Vorjahres-Grenze [1]; Kinderabzug und Freibeträge [3]', () => {
    expect(IPV_AI.anhebung).toEqual({ k: 0.8, ja: 0.5, bis: 75000 });
    expect(IPV_AI.mindestbetrag).toBe(100);
    expect(IPV_AI.vermoegenAnteil).toBe(0.10);
    expect(IPV_AI.grenzeVorjahr).toBe(12000);
    expect(IPV_AI.basisjahrAbstand).toBe(2);
    expect(IPV_AI.vermoegenFreibetrag).toEqual({ person: 50000, jeKind: 20000 });
    expect(IPV_AI.kinderabzug).toEqual({ erstesZweites: 6000, weitere: 8000 });
    expect(IPV_AI.jahr).toBe(2026);
  });
});

describe('K31 AI: Selbstbehalt in Stufen', () => {
  it('7 % bis 45 000, 12 % ab 85 000, dazwischen 0,125 % je volle 1 000', () => {
    expect(aiSelbstbehaltProzent(0)).toBe(7);
    expect(aiSelbstbehaltProzent(45000)).toBe(7);
    expect(aiSelbstbehaltProzent(45999)).toBe(7);
    expect(aiSelbstbehaltProzent(46000)).toBeCloseTo(7.125, 9);
    expect(aiSelbstbehaltProzent(60000)).toBeCloseTo(8.875, 9);
    expect(aiSelbstbehaltProzent(84999)).toBeCloseTo(11.875, 9);
    expect(aiSelbstbehaltProzent(85000)).toBe(12);
  });
  it('Einkommen 0: die volle Richtprämie', () => {
    expect(ipvAppenzellInnerrhodenRechnen({ personen: ['e'], me: 0 }).total).toBe(4640);
  });
  it('zwei Gründe für «kein Betrag»: unter Fr. 100 (Art. 5 Abs. 6) und über dem Nullpunkt', () => {
    expect(ipvAppenzellInnerrhodenRechnen({ personen: ['e'], me: 55000 }).total).toBe(103);
    expect(ipvAppenzellInnerrhodenRechnen({ personen: ['e'], me: 55900 })).toMatchObject({ total: 0, grund: 'mindestbetrag' });
    expect(ipvAppenzellInnerrhodenRechnen({ personen: ['e'], me: 56000 })).toMatchObject({ total: 0, grund: 'ueberGrenze' });
  });
  it('Kinder: die Anhebung auf 80 % gilt bis 75 000 — auch ohne Anspruch aus der Formel; darüber nicht', () => {
    expect(ipvAppenzellInnerrhodenRechnen({ personen: ['e', 'k'], me: 64000 })).toMatchObject({ basis: 0, total: 827 });
    expect(ipvAppenzellInnerrhodenRechnen({ personen: ['e', 'k'], me: 75000 }).total).toBe(827);
    expect(ipvAppenzellInnerrhodenRechnen({ personen: ['e', 'k'], me: 75001 })).toMatchObject({ total: 0, grund: 'ueberGrenze' });
  });
  it('steuerlicher Kinderabzug [3]: 6 000 für das erste und zweite, 8 000 für jedes weitere', () => {
    expect(aiKinderabzug(0)).toBe(0);
    expect(aiKinderabzug(2)).toBe(12000);
    expect(aiKinderabzug(3)).toBe(20000);
  });
});

describe('K31 calculateIPV für AI (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvAppenzellInnerrhoden.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  const person = ({ monthlyIncome = 0, children = [], dob = '1980-05-01', kkPremium = 450, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'AI', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: '9050', city: 'Appenzell' },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('belegt, mit Quelle; ohne PLZ-Daten; keine Grenze; automatisches Verfahren', () => {
    expect(CANTONAL_IPV.AI.beleg.quelle).toMatch(/GS 832\.501/);
    expect(CANTONAL_IPV.AI.maxIncome).toBe(null);
    expect(CANTONAL_IPV.AI.noteKey).toBe('ipv.noteAutoTaxData');
    expect(IPV_MODULE.AI.brauchtPLZ).toBe(false);
  });

  it('das Merkblatt-Beispiel über die App: 20 000 → 3 240 (270/Monat), Basisjahr 2024', () => {
    const r = calculateIPV(person({ monthlyIncome: 20000 / 12 }));
    expect(r).toMatchObject({ belegt: true, eligible: true, annual: 3240, amount: 270, basisjahr: 2024, jahr: 2026, vorbehaltKey: 'ipv.vorbehaltAI', jahrKey: 'ipv.jahrAI', noteKey: 'ipv.aiAutomatisch' });
    expect(r.maxAnnual).toBe(4640);
    expect(r.cantonData.maxIncome).toBe(null);
  });

  it('Stufen: 50 000 → 828; 50 500 bleibt auf derselben Stufe → 790', () => {
    expect(calculateIPV(person({ monthlyIncome: 50000 / 12 })).annual).toBe(828);
    expect(calculateIPV(person({ monthlyIncome: 50500 / 12 })).annual).toBe(790);
  });

  it('unter 12 000: die Veranlagung des Vorjahres (Art. 6 Abs. 5 [1]) — Basisjahr 2025', () => {
    expect(calculateIPV(person({ monthlyIncome: 10000 / 12 }))).toMatchObject({ annual: 3940, basisjahr: 2025 });
  });

  it('höchstens die Prämie (Art. 5 Abs. 1bis) — ohne Prämie keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, kkPremium: 200 }))).toMatchObject({ annual: 2400, maxAnnual: 2400 });
    expect(calculateIPV(person({ kkPremium: null }))).toMatchObject({ belegt: false, offen: 'praemie' });
  });

  it('zwei Gründe für «kein Betrag»', () => {
    expect(calculateIPV(person({ monthlyIncome: 55900 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.aiUnterMindestbetrag' });
    expect(calculateIPV(person({ monthlyIncome: 56000 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.aiKeinAnspruch' });
  });

  it('Vermögen: 10 % über dem Freibetrag 50 000, keine Obergrenze', () => {
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { savingsAccount: 100000 } })).annual).toBe(2890);
    expect(calculateIPV(person({ monthlyIncome: 0, finanzen: { savingsAccount: 400000 } })).belegt).toBe(true);
  });

  it('Säule 3a zählt voll (Art. 5 Abs. 3 lit. d) — und steckt schon im Nettoeinkommen', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 3000 })).annual;
    expect(calculateIPV(person({ monthlyIncome: 3000, finanzen: { pension3a: 7258 } })).annual).toBe(ohne);
  });

  it('mit einem Kind (Geburt 2019): 48 000 − Kinderabzug 6 000 → 2 734 + Anhebung 329 = 3 063', () => {
    expect(calculateIPV(person({ monthlyIncome: 4000, children: [{ birthDate: '2019-06-01' }] }))).toMatchObject({ eligible: true, annual: 3063 });
  });

  it('mit Kind über 75 000 massgebend: nichts; darunter mindestens 827 für das Kind', () => {
    expect(calculateIPV(person({ monthlyIncome: 70000 / 12, children: [{ birthDate: '2019-06-01' }] }))).toMatchObject({ annual: 827 });
    expect(calculateIPV(person({ monthlyIncome: 82000 / 12, children: [{ birthDate: '2019-06-01' }] }))).toMatchObject({ amount: 0, noteKey: 'ipv.aiKeinAnspruch' });
  });

  it('der Kinderanteil ist nicht an die Prämie der erwachsenen Person gedeckelt', () => {
    expect(calculateIPV(person({ monthlyIncome: 4000, kkPremium: 100, children: [{ birthDate: '2019-06-01' }] }))).toMatchObject({ annual: 2027 });
  });

  it('Kind 2025 geboren: im Haushalt am 1.1.2026, aber ohne Kinderabzug im Steuerjahr 2024', () => {
    expect(calculateIPV(person({ monthlyIncome: 4000, children: [{ birthDate: '2025-05-01' }] }))).toMatchObject({ annual: 2572 });
  });

  it('Kind nach dem 1. Januar 2026 geboren zählt nicht (Art. 3 Abs. 4 [1])', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 3000 }));
    expect(calculateIPV(person({ monthlyIncome: 3000, children: [{ birthDate: '2026-03-01' }] })).annual).toBe(ohne.annual);
  });

  it('eingetipptes Alter 1: ob das Kind Ende 2024 schon da war, ist offen — keine Zahl; ab 2 eindeutig', () => {
    expect(calculateIPV(person({ monthlyIncome: 4000, children: [{ age: 1 }] }))).toMatchObject({ belegt: false, offen: 'alter' });
    expect(calculateIPV(person({ monthlyIncome: 4000, children: [{ age: 2 }] }))).toMatchObject({ belegt: true, annual: 3063 });
  });

  it('Alter nach Jahrgang (Anhang A1-1 [1]): 2000 erwachsen, 2001 nicht; Kinder 2008 und jünger', () => {
    expect(calculateIPV(person({ monthlyIncome: 3000, dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 3000, dob: '2001-01-01' }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ monthlyIncome: 3000, children: [{ birthDate: '2008-12-31' }] })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ birthDate: '2007-12-31' }] }))).toMatchObject({ offen: 'haushalt' });
  });

  it('Kinder ohne Alter, Paar, Konkubinat, negatives Einkommen: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: -10 }))).toMatchObject({ offen: 'einkommenNegativ' });
  });

  it('ab 2027 keine Zahl mehr', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
    try {
      expect(calculateIPV(person({ monthlyIncome: 3000 }))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    } finally { vi.useRealTimers(); }
  });
});

describe('K31 calculateIPV für AI — vor dem Laden', () => {
  it('ohne geladenes Modul: Orientierung «laden», nie ein Betrag', async () => {
    vi.resetModules();
    const frisch = await import('../cantonalData.js');
    const r = frisch.calculateIPV({
      basis: { canton: 'AI', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
      finanzen: { monthlyIncome: 3000 }, versicherungen: { kkPremium: 450 },
    });
    expect(r).toMatchObject({ belegt: false, amount: null, offen: 'laden' });
  });
});
