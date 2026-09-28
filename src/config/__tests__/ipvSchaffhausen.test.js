import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import {
  IPV_SH, ipvSchaffhausenRechnen, shRegion, shEntlastungsabzug, shAnrechenbaresEinkommen,
} from '../ipvSchaffhausen.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Schaffhausen 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt SH:
//   [1] Dekret SHR 832.110, Version 01.01.2025 — §§ 9, 10, 11, 12, 13, 13bis, 15, 17
//   [2] Verordnung SHR 832.111, Version 01.08.2026, Anhang 1 (2026) — §§ A1-1, A1-2, A1-3
//   [3] Steuergesetz SHR 641.100 — Art. 37 Abs. 1 lit. d, Art. 48 Abs. 1, Art. 240 Abs. 2
//   [4] SVA Schaffhausen, Merkblatt IPV 2026
//   [5] Steuerverwaltung SH, Wegleitung 2022, Tabelle Entlastungsabzug
// Ein amtliches Berechnungsbeispiel gibt es nicht. Prüfstein sind die Versand-Grenzwerte [2].

describe('K31 SH: Prüfstein — die Versand-Grenzwerte § A1-2 [2] sind der Nullpunkt der Formel', () => {
  // Jeder Grenzwert ist Richtprämie ÷ 15 %, aufgerundet auf ganze Franken. Stimmten Selbstbehalt
  // oder eine Richtprämie nicht, fiele mindestens einer der zehn Werte heraus.
  const nullpunkt = (betrag) => Math.ceil(betrag / IPV_SH.selbstbehalt - 1e-9);
  it('Region 1: 39 647 · 25 860 · 79 294 · 9 247 · 25 860', () => {
    const r = IPV_SH.richtpraemie[1];
    expect(nullpunkt(r.e)).toBe(39647);
    expect(nullpunkt(r.j)).toBe(25860);
    expect(nullpunkt(2 * r.e)).toBe(79294);
    expect(nullpunkt(r.k)).toBe(9247);
  });
  it('Region 2: 37 467 · 24 120 · 74 934 · 8 634 · 24 120', () => {
    const r = IPV_SH.richtpraemie[2];
    expect(nullpunkt(r.e)).toBe(37467);
    expect(nullpunkt(r.j)).toBe(24120);
    expect(nullpunkt(2 * r.e)).toBe(74934);
    expect(nullpunkt(r.k)).toBe(8634);
  });
  it('am Nullpunkt besteht kein Anspruch mehr, knapp darunter noch ein (nicht ausbezahlter) Rest', () => {
    expect(ipvSchaffhausenRechnen({ region: 1, einkommen: 39647 }).grund).toBe('ueberGrenze');
    expect(ipvSchaffhausenRechnen({ region: 1, einkommen: 39646 }).differenz).toBeGreaterThan(0);
    expect(ipvSchaffhausenRechnen({ region: 1, einkommen: 79294, erwachsene: 2 }).grund).toBe('ueberGrenze');
  });
});

describe('K31 SH: Konstanten wörtlich', () => {
  it('Richtprämien § A1-1 Abs. 1/2 [2]', () => {
    expect(IPV_SH.richtpraemie).toEqual({
      1: { e: 5947, j: 3879, k: 1387 },
      2: { e: 5620, j: 3618, k: 1295 },
    });
  });
  it('Selbstbehalt 15 % (§ 10 [1]), höchstens 65 % (§ 13 Abs. 3), unter Fr. 100 nichts (§ 13 Abs. 2)', () => {
    expect(IPV_SH.selbstbehalt).toBe(0.15);
    expect(IPV_SH.hoechstanteil).toBe(0.65);
    expect(IPV_SH.mindestbetrag).toBe(100);
  });
  it('anrechenbares Einkommen § 12 Abs. 1 [1] und Steuergesetz [3]', () => {
    expect(IPV_SH.grundabzug).toEqual({ mitKindern: 9000, uebrige: 4500 });
    expect(IPV_SH.vermoegenAnteil).toBe(0.15);
    expect(IPV_SH.vermoegenFreibetrag).toEqual({ alleinstehend: 50000, jeKind: 30000 });
    expect(IPV_SH.entlastung).toEqual({
      alleinstehend: { abzug: 7050, bis: 16800 },
      paar: { abzug: 14100, bis: 25200 },
      schritt: 800,
      minderung: 300,
    });
    expect(IPV_SH.basisjahrAbstand).toBe(2);
  });
  it('Kinder 80 % (§ 13bis [1], Art. 65 Abs. 1bis KVG), Fristen § A1-3 [2], Jahr', () => {
    expect(IPV_SH.kinderMindestanteil).toBe(0.8);
    expect(IPV_SH.frist).toEqual({ ordentlich: '2026-04-30', nachfrist: '2026-06-15' });
    expect(IPV_SH.jahr).toBe(2026);
  });
});

describe('K31 SH: Entlastungsabzug [3] Art. 37 Abs. 1 lit. d Ziff. 1 — Tabelle [5]', () => {
  it('Alleinstehende: bis 16 800 voll, je ANGEFANGENE 800 darüber 300 weniger', () => {
    expect(shEntlastungsabzug(0)).toBe(7050);
    expect(shEntlastungsabzug(16800)).toBe(7050);
    // Tabelle [5]: «bis 17'600 → 6'750», «bis 18'400 → 6'450», «bis 35'200 → 150».
    expect(shEntlastungsabzug(16801)).toBe(6750);
    expect(shEntlastungsabzug(17600)).toBe(6750);
    expect(shEntlastungsabzug(17601)).toBe(6450);
    expect(shEntlastungsabzug(20000)).toBe(5850);
    expect(shEntlastungsabzug(35200)).toBe(150);
    expect(shEntlastungsabzug(35201)).toBe(0);
  });
  it('Alleinerziehende nach dem Ansatz für Paare (§ 12 Abs. 1 lit. b [1]): 14 100 bis 25 200', () => {
    expect(shEntlastungsabzug(25200, true)).toBe(14100);
    expect(shEntlastungsabzug(26000, true)).toBe(13800);
    expect(shEntlastungsabzug(62800, true)).toBe(0);
  });
});

describe('K31 SH: anrechenbares Einkommen § 12 Abs. 1 [1]', () => {
  it('Einzelperson, 36 000 netto: − 4 500 Grundabzug, kein Entlastungsabzug mehr → 31 500', () => {
    expect(shAnrechenbaresEinkommen({ nettoMit3a: 36000 })).toBe(31500);
  });
  it('Einzelperson, 20 000 netto: − 4 500 − 5 850 → 9 650', () => {
    expect(shAnrechenbaresEinkommen({ nettoMit3a: 20000 })).toBe(9650);
  });
  it('Vermögen: 15 % erst über dem Freibetrag 50 000 (+30 000 je Kind)', () => {
    expect(shAnrechenbaresEinkommen({ nettoMit3a: 36000, vermoegen: 50000 })).toBe(31500);
    expect(shAnrechenbaresEinkommen({ nettoMit3a: 36000, vermoegen: 70000 })).toBe(34500);
    expect(shAnrechenbaresEinkommen({ nettoMit3a: 60000, vermoegen: 80000, kinderZahl: 1 })).toBe(60000 - 9000 - 900);
  });
  it('Säule 3a: wieder aufgerechnet (lit. e), wirkt nur über den Entlastungsabzug am Reineinkommen', () => {
    // 24 000 netto, 3 000 in die 3a: Reineinkommen 21 000 → Abzug 5 250 statt 4 350.
    expect(shAnrechenbaresEinkommen({ nettoMit3a: 24000, saeule3a: 3000 })).toBe(24000 - 4500 - 5250);
    expect(shAnrechenbaresEinkommen({ nettoMit3a: 24000 })).toBe(24000 - 4500 - 4350);
    // Über dem Band des Entlastungsabzugs ändert die 3a nichts mehr.
    expect(shAnrechenbaresEinkommen({ nettoMit3a: 50000, saeule3a: 7000 })).toBe(45500);
  });
  it('nie negativ', () => {
    expect(shAnrechenbaresEinkommen({ nettoMit3a: 0 })).toBe(0);
  });
});

describe('K31 SH: Rechnung § 13 [1]', () => {
  it('Einkommen 0: 65 % der Richtprämie, nicht die ganze', () => {
    expect(ipvSchaffhausenRechnen({ region: 1, einkommen: 0 }).total).toBeCloseTo(3865.55, 9);
    expect(ipvSchaffhausenRechnen({ region: 2, einkommen: 0 }).total).toBeCloseTo(3653, 9);
  });
  it('der Deckel greift bis 13 876 (0,35 × 5 947 / 0,15), darüber der lineare Abbau', () => {
    expect(ipvSchaffhausenRechnen({ region: 1, einkommen: 13876 }).total).toBeCloseTo(3865.55, 9);
    expect(ipvSchaffhausenRechnen({ region: 1, einkommen: 31500 }).total).toBeCloseTo(1222, 9);
    expect(ipvSchaffhausenRechnen({ region: 2, einkommen: 31500 }).total).toBeCloseTo(895, 9);
  });
  it('zwei Gründe für «kein Betrag»: unter Fr. 100 (§ 13 Abs. 2) und über dem Nullpunkt (§ 10)', () => {
    const band = ipvSchaffhausenRechnen({ region: 1, einkommen: 39300 });
    expect(band.differenz).toBeCloseTo(52, 9);
    expect(band).toMatchObject({ total: 0, grund: 'mindestbetrag' });
    expect(ipvSchaffhausenRechnen({ region: 1, einkommen: 39900 })).toMatchObject({ total: 0, grund: 'ueberGrenze' });
    expect(ipvSchaffhausenRechnen({ region: 1, einkommen: 38980 }).grund).toBe(null);
  });
  it('Kinder: der Mindestanspruch 80 % hebt den Betrag (§ 13bis Abs. 2), auch über die 65 %', () => {
    // Einkommen 44 600, ein Kind: Differenz 7 334 − 6 690 = 644 < 0,8 × 1 387 = 1 109.60.
    const r = ipvSchaffhausenRechnen({ region: 1, kinderZahl: 1, einkommen: 44600 });
    expect(r.total).toBeCloseTo(1109.6, 9);
    expect(r.anteilErwachsen).toEqual({ mitKindern: 0, ohneKinder: 0 });
    // Bei Einkommen 0: 65 % × 7 334 = 4 767.10, mehr als der Kinderanteil.
    expect(ipvSchaffhausenRechnen({ region: 1, kinderZahl: 1, einkommen: 0 }).total).toBeCloseTo(4767.1, 9);
  });
  it('Kinder: der Rest nach § 13bis Abs. 1 in beiden Lesarten', () => {
    const r = ipvSchaffhausenRechnen({ region: 1, kinderZahl: 1, einkommen: 33600 });
    expect(r.total).toBeCloseTo(2294, 9);
    expect(r.anteilErwachsen.ohneKinder).toBeCloseTo(2294 - 1109.6, 9);
    expect(r.anteilErwachsen.mitKindern).toBeCloseTo((2294 - 1109.6) * 5947 / 7334, 9);
  });
  it('Kinder: ohne Anspruch nach § 10 auch kein Mindestanspruch; Differenz unter 100 → unklar', () => {
    expect(ipvSchaffhausenRechnen({ region: 1, kinderZahl: 1, einkommen: 50100 })).toMatchObject({ total: 0, grund: 'ueberGrenze' });
    expect(ipvSchaffhausenRechnen({ region: 1, kinderZahl: 1, einkommen: 48800 }).unklar).toBe(true);
  });
});

describe('K31 SH: Prämienregionen gegen § A1-1 [2] und das Merkblatt [4]', () => {
  it('Region 1 = Stadt Schaffhausen und Neuhausen am Rheinfall, alle übrigen Region 2', async () => {
    const plz = await import('../../data/plzGemeinde.js');
    const gemeinden = new Map();
    for (const p of plz.allPLZ()) for (const g of plz.lookupPLZ(p)) if (g.kanton === 'SH') gemeinden.set(g.bfsNr, g.gemeinde);
    expect(gemeinden.size).toBeGreaterThan(20);
    const R1 = ['Schaffhausen', 'Neuhausen am Rheinfall'];
    const gefunden = new Set();
    for (const [bfs, name] of gemeinden) {
      const soll = R1.includes(name) ? 1 : 2;
      if (soll === 1) gefunden.add(name);
      expect([name, shRegion(bfs)]).toEqual([name, soll]);
    }
    // Beide Namen gefunden — sonst prüfte der Test weniger, als er behauptet.
    expect(gefunden.size).toBe(2);
  });
});

describe('K31 calculateIPV für SH (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../../data/plzGemeinde.js');
    await import('../ipvSchaffhausen.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, plz = '8200', city = 'Schaffhausen', children = [], dob = '1980-05-01', kkPremium = 450, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'SH', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: plz, city },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('belegt, mit Quelle; keine Musterwerte, keine Grenze; Antrag bei der SVA', () => {
    expect(CANTONAL_IPV.SH.beleg.quelle).toMatch(/SHR 832\.110/);
    expect(CANTONAL_IPV.SH.maxIncome).toBe(null);
    expect(CANTONAL_IPV.SH.subsidySingle).toBe(null);
    expect(CANTONAL_IPV.SH.noteKey).toBe('ipv.noteApplySva');
  });

  it('Stadt Schaffhausen, 36 000 netto im Jahr: 1 222 (Region 1, Basisjahr 2024)', () => {
    const r = calculateIPV(person({ monthlyIncome: 3000 }));
    expect(r).toMatchObject({ belegt: true, eligible: true, annual: 1222, amount: 102, region: 1, basisjahr: 2024, jahr: 2026, vorbehaltKey: 'ipv.vorbehaltSH' });
    expect(r.cantonData.maxIncome).toBe(null);
    expect(r.maxAnnual).toBe(3866);
  });

  it('Region 2 (Thayngen): 895', () => {
    expect(calculateIPV(person({ monthlyIncome: 3000, plz: '8240', city: 'Thayngen' }))).toMatchObject({ annual: 895, region: 2 });
  });

  it('Neuhausen am Rheinfall ist Region 1', () => {
    expect(calculateIPV(person({ monthlyIncome: 3000, plz: '8212', city: 'Neuhausen am Rheinfall' }))).toMatchObject({ region: 1 });
  });

  it('Einkommen 0 und tiefes Einkommen: der 65-%-Deckel', () => {
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12 }))).toMatchObject({ annual: 3866 });
  });

  it('höchstens die Prämie (§ 17 Abs. 2 [1]) — ohne erfasste Prämie keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, kkPremium: 200 }))).toMatchObject({ annual: 2400, maxAnnual: 2400 });
    expect(calculateIPV(person({ kkPremium: null }))).toMatchObject({ belegt: false, amount: null, offen: 'praemie' });
  });

  it('zwei Gründe für «kein Betrag»', () => {
    expect(calculateIPV(person({ monthlyIncome: 43800 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.shUnterMindestbetrag' });
    expect(calculateIPV(person({ monthlyIncome: 44400 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.shKeinAnspruch' });
  });

  it('Vermögen: 15 % über dem Freibetrag zählt zum Einkommen, eine Obergrenze gibt es nicht', () => {
    // 70 000 − 50 000 = 20 000 → + 3 000: 34 500 → 5 947 − 5 175 = 772
    expect(calculateIPV(person({ monthlyIncome: 3000, finanzen: { savingsAccount: 70000 } })).annual).toBe(772);
    expect(calculateIPV(person({ monthlyIncome: 0, finanzen: { savingsAccount: 250000 } }))).toMatchObject({ belegt: true });
  });

  it('Säule 3a: im Band des Entlastungsabzugs hebt sie den Betrag, darüber nicht', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 2000 })).annual;
    const mit = calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 3000 } })).annual;
    expect(ohne).toBe(3675);
    expect(mit).toBe(3810);
    // 42 000 netto, 6 000 in die 3a: Reineinkommen 36 000 liegt über dem Band — beide 322.
    expect(calculateIPV(person({ monthlyIncome: 3500, finanzen: { pension3a: 6000 } })).annual).toBe(322);
    expect(calculateIPV(person({ monthlyIncome: 3500 })).annual).toBe(322);
  });

  it('Säule 3a über dem Einkommen oder über mehrere Jahre: keine Zahl — aber nur, wo sie wirkt', () => {
    expect(calculateIPV(person({ monthlyIncome: 1500, finanzen: { pension3a: 20000 } })))
      .toMatchObject({ belegt: false, offen: 'saeule3aUeberEinkommen' });
    // 12 000 netto: der Entlastungsabzug ist mit und ohne 3a voll — die Zahl bleibt.
    expect(calculateIPV(person({ monthlyIncome: 1000, finanzen: { pension3a: 20000 } })).belegt).toBe(true);
    const deposits = [2024, 2025, 2026].map((j) => ({ date: `${j}-03-01`, amount: 3000 }));
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 9000, pension3aDeposits: deposits } })))
      .toMatchObject({ belegt: false, offen: 'saeule3aUeberEinkommen' });
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 3000, pension3aDeposits: deposits } })).belegt).toBe(true);
    // Über dem Band des Entlastungsabzugs ändert die 3a nichts — dann bleibt die Zahl.
    expect(calculateIPV(person({ monthlyIncome: 4000, finanzen: { pension3a: 9000, pension3aDeposits: deposits } })).belegt).toBe(true);
  });

  it('negatives Einkommen: keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: -500 }))).toMatchObject({ belegt: false, offen: 'einkommenNegativ' });
  });

  it('mit einem Kind (5): 48 000 netto → 2 294; Grundabzug 9 000 und Entlastungsabzug wie Paare', () => {
    const r = calculateIPV(person({ monthlyIncome: 4000, children: [{ age: 5 }] }));
    expect(r).toMatchObject({ eligible: true, annual: 2294, region: 1 });
    expect(r.maxAnnual).toBe(4767);
  });

  it('mit Kind: der Kinder-Mindestanspruch hebt den Betrag (56 000 netto → 1 110)', () => {
    expect(calculateIPV(person({ monthlyIncome: 56000 / 12, children: [{ age: 5 }] }))).toMatchObject({ eligible: true, annual: 1110 });
  });

  it('mit Kind und sehr tiefer eigener Prämie: die beiden Lesarten von § 13bis weichen ab → keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 4000, children: [{ age: 5 }], kkPremium: 50 })))
      .toMatchObject({ belegt: false, offen: 'mindestanspruch' });
  });

  it('mit Kind knapp unter dem Nullpunkt (Differenz unter 100): keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 59000 / 12, children: [{ age: 5 }] })))
      .toMatchObject({ belegt: false, offen: 'mindestanspruch' });
  });

  it('ein Kind, das erst nach dem 1. Januar 2026 geboren ist, zählt nicht ([4], § 9 Abs. 3 [1])', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 3000 }));
    const spaeter = calculateIPV(person({ monthlyIncome: 3000, children: [{ birthDate: '2026-03-01' }] }));
    expect(spaeter.annual).toBe(ohne.annual);
    const frueher = calculateIPV(person({ monthlyIncome: 3000, children: [{ birthDate: '2026-01-01' }] }));
    expect(frueher.annual).toBeGreaterThan(ohne.annual);
  });

  it('Alter nach Jahrgang § A1-1 [2]: 2000 ist erwachsen, 2001 nicht', () => {
    expect(calculateIPV(person({ dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ dob: '2001-01-01' }))).toMatchObject({ belegt: false, offen: 'alter' });
    expect(calculateIPV(person({ dob: '' }))).toMatchObject({ belegt: false, offen: 'alter' });
  });

  it('Kinder «Jahrgänge 2008 und jünger»; das eingetippte Alter zählt im Anspruchsjahr eins mehr', () => {
    expect(calculateIPV(person({ children: [{ birthDate: '2008-12-31' }] })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ birthDate: '2007-12-31' }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 18 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 17 }] })).belegt).toBe(true);
  });

  it('Kinder ohne Alter, Paar, Konkubinat, zwei Erwachsene: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { household: { adults: 2, children: [] } } }))).toMatchObject({ offen: 'haushalt' });
  });

  it('PLZ ausserhalb des Kantons oder unbekannt: keine Zahl', () => {
    expect(calculateIPV(person({ plz: '0000', city: 'Nirgendwo' }))).toMatchObject({ belegt: false, offen: 'region' });
  });

  describe('Frist § A1-3 [2] und Jahres-Riegel', () => {
    it('bis 30.04.2026: die Frist läuft', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-04-30T12:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 3000 }))).toMatchObject({ noteKey: 'ipv.shFristLaeuft', noteParams: { jahr: 2026, folgejahr: 2027 } });
    });
    it('ab 01.05.2026: vorbei — der Betrag bleibt, der Satz sagt es', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-05-01T12:00:00'));
      const r = calculateIPV(person({ monthlyIncome: 3000 }));
      expect(r).toMatchObject({ noteKey: 'ipv.shFristVorbei', annual: 1222 });
      // bewusst nicht gesetzt: die Leser zeigen sonst den Luzerner Fristtext (siehe Modulkopf)
      expect(r.anmeldefristVorbei).toBeUndefined();
    });
    it('ab 2027 keine Zahl mehr, bis die Werte nachgeführt sind', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 3000 }))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });
});

describe('K31 calculateIPV für SH — vor dem Laden', () => {
  it('ohne geladenes Modul: Orientierung «laden», nie ein Betrag', async () => {
    vi.resetModules();
    const frisch = await import('../cantonalData.js');
    const r = frisch.calculateIPV({
      basis: { canton: 'SH', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
      finanzen: { monthlyIncome: 3000 }, wohnen: { postalCode: '8200', city: 'Schaffhausen' }, versicherungen: { kkPremium: 450 },
    });
    expect(r).toMatchObject({ belegt: false, amount: null, offen: 'laden' });
  });
});
