import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import {
  IPV_GR, ipvGraubuendenRechnen, grSelbstbehaltSatz, grKinderSatz, grRegion,
} from '../ipvGraubuenden.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV } from '../cantonalData.js';
import { KEIN_PRAEMIENDECKEL, SAEULE_3A } from '../kantonsModell.js';

// K31 — Prämienverbilligung Kanton Graubünden 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt GR:
//   [1] KPVG, BR 542.100, in Kraft seit 01.01.2025 — Art. 6, 7, 8, 8a, 10, 11
//   [2] VOzKPVG, BR 542.120, in Kraft seit 01.01.2026 — Art. 14, 17, 22
//   [3] SVA Graubünden, Wegleitung IPV 2026 (PDF vom 05.01.2026) — Richtprämien, Tabellen
//   [4] SVA Graubünden, Prämienregionen Jahr 2026 (PDF vom 07.01.2026)
// Ein amtliches Berechnungsbeispiel gibt es nicht; Prüfstein sind die Tabellen von [3] und
// Handrechnungen am Wortlaut von Art. 8 [1].

describe('K31 calculateIPV für GR, bevor PLZ-Daten und GR-Modul geladen sind', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'GR', dateOfBirth: '1980-05-01' }, finanzen: {}, wohnen: { postalCode: '7000' } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 GR: Konstanten wörtlich aus [1] und [3]', () => {
  it('Richtprämien 2026 [3], Tabelle «Richtprämien 2026»', () => {
    expect(IPV_GR.richtpraemie).toEqual({
      1: { e: 5916, j: 4368, k: 1404 },
      2: { e: 5532, j: 4092, k: 1320 },
      3: { e: 5232, j: 3912, k: 1248 },
    });
  });
  it('Selbstbehalt Art. 8 Abs. 2 [1]: 5 / 6,5 / 8 %, dann je 1 Prozentpunkt bis 10 %', () => {
    expect(IPV_GR.selbstbehalt).toEqual([
      { bis: 10000, satz: 0.05 }, { bis: 20000, satz: 0.065 }, { bis: 30000, satz: 0.08 },
      { bis: 40000, satz: 0.09 }, { bis: Infinity, satz: 0.10 },
    ]);
  });
  it('Kinder und junge Erwachsene in Ausbildung Art. 8 Abs. 3 lit. a–d [1]: 100 / 75 / 50 / 25 %', () => {
    expect(IPV_GR.kinderVerbilligung).toEqual([
      { bis: 65000, satz: 1 }, { bis: 70000, satz: 0.75 }, { bis: 75000, satz: 0.5 }, { bis: 80000, satz: 0.25 },
    ]);
  });
  it('Vermögen Art. 8a Abs. 1 lit. a [1]: 10 %; Basisjahr «Vorjahr»; Jahr 2026', () => {
    expect(IPV_GR.vermoegenAnteil).toBe(0.10);
    expect(IPV_GR.basisjahrAbstand).toBe(1);
    expect(IPV_GR.jahr).toBe(2026);
  });
  it('Säule 3a unbedingt zugerechnet (Art. 8a Abs. 1 lit. e [1]) — Regel `voll`, mit Beleg', () => {
    expect(SAEULE_3A.voll.kantone).toMatch(/GR/);
    expect(SAEULE_3A.voll.beleg).toMatch(/Art\. 8a Abs\. 1 lit\. e KPVG/);
  });
  it('kein Deckel auf die effektive Prämie: benannt, nicht still weggelassen', () => {
    expect(KEIN_PRAEMIENDECKEL.GR).toMatch(/BR 542\.100/);
    expect(KEIN_PRAEMIENDECKEL.GR).toMatch(/SVA Graubünden/);
  });
});

describe('K31 GR: Selbstbehalt-Kategorien, Grenzen von beiden Seiten', () => {
  it('«bis und mit» [3]: 10 000 noch 5 %, 10 001 schon 6,5 %', () => {
    expect(grSelbstbehaltSatz(0)).toBe(0.05);
    expect(grSelbstbehaltSatz(10000)).toBe(0.05);
    expect(grSelbstbehaltSatz(10001)).toBe(0.065);
    expect(grSelbstbehaltSatz(20000)).toBe(0.065);
    expect(grSelbstbehaltSatz(20001)).toBe(0.08);
    expect(grSelbstbehaltSatz(30000)).toBe(0.08);
    expect(grSelbstbehaltSatz(30001)).toBe(0.09);
    expect(grSelbstbehaltSatz(40000)).toBe(0.09);
    expect(grSelbstbehaltSatz(40001)).toBe(0.10);
    expect(grSelbstbehaltSatz(1e6)).toBe(0.10);
  });
  it('Kinder-Stufen: 65 000 noch 100 %, 80 001 nichts mehr', () => {
    expect(grKinderSatz(65000)).toBe(1);
    expect(grKinderSatz(65001)).toBe(0.75);
    expect(grKinderSatz(70001)).toBe(0.5);
    expect(grKinderSatz(75001)).toBe(0.25);
    expect(grKinderSatz(80000)).toBe(0.25);
    expect(grKinderSatz(80001)).toBe(0);
  });
});

describe('K31 GR: Rechnung Art. 8 [1] — Handrechnungen', () => {
  it('Einkommen 0: die volle Richtprämie jeder Region', () => {
    for (const region of [1, 2, 3]) {
      expect(ipvGraubuendenRechnen({ region, me: 0 }).total).toBe(IPV_GR.richtpraemie[region].e);
    }
  });
  it('Region 1, 10 000: 5 916 − 5 % × 10 000 = 5 416', () => {
    expect(ipvGraubuendenRechnen({ region: 1, me: 10000 }).total).toBeCloseTo(5416, 9);
  });
  it('Region 1, 30 000: 5 916 − 8 % × 30 000 = 3 516', () => {
    expect(ipvGraubuendenRechnen({ region: 1, me: 30000 }).total).toBeCloseTo(3516, 9);
  });
  it('🛑 der Sprung an der Kategoriengrenze: 40 000 → 2 316, 40 001 → 1 915.90', () => {
    // Satz aufs GANZE Einkommen (Lesart des Wortlauts, siehe Modulkopf). Nach der Tranchen-
    // Lesart wären es bei 40 000 5 916 − 2 850 = 3 066 — dieser Test hält die Wahl fest.
    expect(ipvGraubuendenRechnen({ region: 1, me: 40000 }).total).toBeCloseTo(2316, 9);
    expect(ipvGraubuendenRechnen({ region: 1, me: 40001 }).total).toBeCloseTo(1915.9, 9);
  });
  it('Nullpunkt je Region: Richtprämie ÷ 10 % — R1 59 160, R2 55 320, R3 52 320', () => {
    for (const [region, null_] of [[1, 59160], [2, 55320], [3, 52320]]) {
      expect(ipvGraubuendenRechnen({ region, me: null_ }).total).toBe(0);
      expect(ipvGraubuendenRechnen({ region, me: null_ }).grund).toBe('ueberGrenze');
      expect(ipvGraubuendenRechnen({ region, me: null_ - 1 }).total).toBeCloseTo(0.1, 9);
      expect(ipvGraubuendenRechnen({ region, me: null_ - 1 }).grund).toBe(null);
    }
  });
  it('kein Mindestbetrag belegt: auch 10 Rappen sind ein Anspruch (nur ein Grund für «kein Betrag»)', () => {
    expect(ipvGraubuendenRechnen({ region: 1, me: 59159 }).grund).toBe(null);
  });
  it('negatives Einkommen wird auf 0 gehalten, nie über die Richtprämie hinaus', () => {
    expect(ipvGraubuendenRechnen({ region: 2, me: -5000 }).total).toBe(5532);
  });
});

describe('K31 GR: Kinder Art. 8 Abs. 3/4 [1] — nur wo beide Lesarten dasselbe ergeben', () => {
  it('Region 1, ein Kind, 30 000: Haushalt 4 920, je Kind 5 380.33 → unklar, keine Zahl', () => {
    const r = ipvGraubuendenRechnen({ region: 1, kinderZahl: 1, me: 30000 });
    expect(r.allgemein).toBeCloseTo(7320 - 2400, 9);
    expect(r.kinder).toBe(1404);
    expect(r.total).toBeCloseTo(4920, 9);
    expect(r.jePerson).toBeCloseTo(4920 - 4920 * 1404 / 7320 + 1404, 9);
    expect(r.unklar).toBe(true);
  });
  it('über 80 000 gibt es keine Kinder-Verbilligung: beide Lesarten gleich, gerechnet', () => {
    // Region 1, zwei Kinder, 85 000: 5 916 + 2 × 1 404 − 8 500 = 224
    const r = ipvGraubuendenRechnen({ region: 1, kinderZahl: 2, me: 85000 });
    expect(r.unklar).toBe(false);
    expect(r.total).toBeCloseTo(224, 9);
  });
  it('bei 25 % entscheidet der allgemeine Anteil des Kindes: drei Kinder unklar, vier nicht', () => {
    // 76 000: Selbstbehalt 7 600; Kind 25 % × 1 404 = 351.
    // 3 Kinder: 2 528 × 1 404 / 10 128 = 350.44 < 351 → die Lesarten gehen auseinander.
    expect(ipvGraubuendenRechnen({ region: 1, kinderZahl: 3, me: 76000 }).unklar).toBe(true);
    // 4 Kinder: 3 932 × 1 404 / 11 532 = 478.72 > 351 → gleich, 3 932.
    const r = ipvGraubuendenRechnen({ region: 1, kinderZahl: 4, me: 76000 });
    expect(r.unklar).toBe(false);
    expect(r.total).toBeCloseTo(3932, 9);
  });
  it('ohne Kinder nie unklar', () => {
    for (const me of [0, 20000, 65000, 70000, 90000]) expect(ipvGraubuendenRechnen({ region: 3, me }).unklar).toBe(false);
  });
});

describe('K31 GR: Prämienregionen gegen die Gemeindeliste der SVA [4]', () => {
  // [4] wörtlich, Name wie bei der SVA → Region. 100 Gemeinden.
  const SVA = {
    'Albula/Alvra': 3, Andeer: 3, Arosa: 1, Avers: 3, 'Bergün Filisur': 3, Bever: 2, Bonaduz: 2, Bregaglia: 2,
    'Breil/Brigels': 3, Brusio: 2, Buseno: 1, Calanca: 1, Cama: 1, Castaneda: 1, Cazis: 3, 'Celerina/Schlarigna': 2,
    Chur: 1, Churwalden: 1, 'Conters i.P.': 2, Davos: 2, 'Disentis/Mustér': 3, 'Domat/Ems': 2, Domleschg: 3,
    Falera: 3, Felsberg: 2, Ferrera: 3, Fideris: 2, Fläsch: 2, Flerden: 3, Flims: 2, Furna: 2, Fürstenau: 3,
    Grüsch: 2, Grono: 1, Ilanz: 3, Jenaz: 2, Jenins: 2, 'Klosters-Serneus': 2, Küblis: 2, Laax: 3, Landquart: 2,
    'Lantsch/Lenz': 3, 'LaPunt-Chamues-Ch': 2, Lostallo: 1, Lumnezia: 3, Luzein: 2, Madulain: 2, Maienfeld: 2,
    Malans: 2, Masein: 3, 'Medel/Lucm. Curaglia': 3, Mesocco: 1, 'Muntogna da Schons': 3, 'Obersaxen Mundaun': 3,
    Pontresina: 2, Poschiavo: 2, Rhäzüns: 2, Rheinwald: 3, Rongellen: 3, Rossa: 1, Rothenbrunnen: 3, Roveredo: 1,
    'S.Vittore': 1, Safiental: 3, Sagogn: 3, Samedan: 2, Samnaun: 2, 'S-chanf': 2, Scharans: 3, Schiers: 2,
    Schluein: 3, Schmitten: 3, Scuol: 2, 'Sedrun-Tujetsch': 3, 'Seewis i.P.': 2, 'Sils i.D.': 3, 'Sils i.E./Segl': 2,
    Silvaplana: 2, Soazza: 1, 'St. Moritz': 2, 'Sta. Maria i.C.': 1, Sufers: 3, Surses: 3, Sumvitg: 3, Tamins: 2,
    Thusis: 3, Trimmis: 2, Trin: 2, Trun: 3, Tschappina: 3, Untervaz: 2, Urmein: 3, 'Val Müstair': 2, Vals: 3,
    Valsot: 2, 'Vaz/Obervaz': 3, Zernez: 2, Zillis: 3, Zizers: 2, Zuoz: 2,
  };
  // Die 14 Gemeinden, die die SVA unter einer Kurzform führt — Name der App → Name der SVA.
  const KURZFORM = {
    'Conters im Prättigau': 'Conters i.P.', 'Ilanz/Glion': 'Ilanz', Klosters: 'Klosters-Serneus',
    'La Punt Chamues-ch': 'LaPunt-Chamues-Ch', 'Medel (Lucmagn)': 'Medel/Lucm. Curaglia', 'Roveredo (GR)': 'Roveredo',
    'San Vittore': 'S.Vittore', 'Santa Maria in Calanca': 'Sta. Maria i.C.', 'Schmitten (GR)': 'Schmitten',
    'Seewis im Prättigau': 'Seewis i.P.', 'Sils im Domleschg': 'Sils i.D.', 'Sils im Engadin/Segl': 'Sils i.E./Segl',
    Tujetsch: 'Sedrun-Tujetsch', 'Zillis-Reischen': 'Zillis',
  };

  it('jede Bündner Gemeinde der App liegt in der Region, die die SVA nennt — und jede SVA-Zeile ist gefunden', async () => {
    const plz = await import('../../data/plzGemeinde.js');
    const gemeinden = new Map();
    for (const p of plz.allPLZ()) for (const g of plz.lookupPLZ(p)) if (g.kanton === 'GR') gemeinden.set(g.bfsNr, g.gemeinde);
    expect(Object.keys(SVA)).toHaveLength(100);
    expect(gemeinden.size).toBe(100);
    const gefunden = new Set();
    for (const [bfs, name] of gemeinden) {
      const svaName = KURZFORM[name] || name;
      gefunden.add(svaName);
      expect([name, grRegion(bfs)]).toEqual([name, SVA[svaName]]);
    }
    // Gegenprobe: jede SVA-Zeile hat eine Gemeinde gefunden (sonst prüfte der Test weniger, als
    // er behauptet), und ein erfundener Name steht in keiner der beiden Listen.
    expect(gefunden.size).toBe(100);
    expect(SVA['Nirgendwo-Dorf']).toBeUndefined();
  });
});

describe('K31 calculateIPV für GR (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../../data/plzGemeinde.js');
    await import('../ipvGraubuenden.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, plz = '7000', city = '', children = [], dob = '1980-05-01', kkPremium = 450, finanzen = {}, basis = {}, versicherungen = {} } = {}) => ({
    basis: { canton: 'GR', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: plz, city },
    versicherungen: { ...(kkPremium != null ? { kkPremium } : {}), ...versicherungen },
  });

  it('belegt, mit Quelle; keine Musterwerte, keine Grenze', () => {
    expect(CANTONAL_IPV.GR.beleg.quelle).toMatch(/BR 542\.100/);
    expect(CANTONAL_IPV.GR.maxIncome).toBe(null);
    expect(CANTONAL_IPV.GR.subsidySingle).toBe(null);
    expect(CANTONAL_IPV.GR.subsidyFamily).toBe(null);
    expect(CANTONAL_IPV.GR.subsidyChild).toBe(null);
  });

  it('Chur, 30 000 im Jahr: 3 516 (293/Monat), Region 1, Basisjahr 2025', () => {
    const r = calculateIPV(person({ monthlyIncome: 2500 }));
    expect(r).toMatchObject({
      belegt: true, eligible: true, annual: 3516, amount: 293, maxAnnual: 5916,
      region: 1, basisjahr: 2025, jahr: 2026, vorbehaltKey: 'ipv.vorbehaltGR', noteKey: 'ipv.grFristLaeuft',
    });
    // Die Frist endet mit dem Anspruchsjahr — solange eine Zahl steht, läuft sie (siehe Modul).
    expect(r.anmeldefristVorbei).toBeUndefined();
    expect(r.cantonData.maxIncome).toBe(null);
  });

  it('Regionen 2 und 3 geben die tieferen Beträge', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, plz: '7270' }))).toMatchObject({ annual: 3132, region: 2 });
    expect(calculateIPV(person({ monthlyIncome: 2500, plz: '7130' }))).toMatchObject({ annual: 2832, region: 3 });
  });

  it('PLZ mit Gemeinden in zwei Regionen: ohne Ort keine Zahl; mit Ort die richtige', () => {
    expect(calculateIPV(person({ plz: '7076' }))).toMatchObject({ belegt: false, amount: null, offen: 'region' });
    expect(calculateIPV(person({ plz: '7076', city: 'Churwalden' }))).toMatchObject({ region: 1 });
    expect(calculateIPV(person({ plz: '7076', city: 'Vaz/Obervaz' }))).toMatchObject({ region: 3 });
  });

  it('kein Deckel (KEIN_PRAEMIENDECKEL.GR): auch ohne erfasste Prämie eine Zahl, und nicht auf die Prämie gekürzt', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, kkPremium: null }))).toMatchObject({ belegt: true, annual: 3516 });
    expect(calculateIPV(person({ monthlyIncome: 2500, kkPremium: 100 }))).toMatchObject({ annual: 3516 });
  });

  it('über dem Nullpunkt: kein Anspruch, eigener Satz ohne Grenze', () => {
    expect(calculateIPV(person({ monthlyIncome: 60000 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.grKeinAnspruch' });
  });

  it('10 % des Vermögens zählen zum Einkommen — und es gibt keine Vermögensgrenze', () => {
    // 25 000 + 10 % × 50 000 = 30 000 → 3 516
    expect(calculateIPV(person({ monthlyIncome: 25000 / 12, finanzen: { savingsAccount: 50000 } })).annual).toBe(3516);
    // 600 000 → + 60 000: über dem Nullpunkt 59 160, aber ein Ergebnis, keine Orientierung
    expect(calculateIPV(person({ finanzen: { savingsAccount: 600000 } }))).toMatchObject({ belegt: true, eligible: false, noteKey: 'ipv.grKeinAnspruch' });
    // 500 000 → + 50 000: 5 916 − 5 000 = 916
    expect(calculateIPV(person({ finanzen: { savingsAccount: 500000 } }))).toMatchObject({ belegt: true, annual: 916 });
  });

  it('Art. 8a Abs. 1 lit. d: der erfasste BVG-Beitrag wird zugerechnet', () => {
    // 24 000 → 8 % → 3 996; mit 300/Monat BVG 27 600 → 8 % → 3 708
    expect(calculateIPV(person({ monthlyIncome: 2000 })).annual).toBe(3996);
    // Das Feld liegt im Kapitel «versicherungen» (config/constants.js FIELD_KEYS) — dort, wo die App es speichert.
    expect(calculateIPV(person({ monthlyIncome: 2000, versicherungen: { bvgContribution: 300 } })).annual).toBe(3708);
    // Gegenprobe: derselbe Wert unter «finanzen» (dort gibt es das Feld nicht) bewirkt nichts.
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { bvgContribution: 300 } })).annual).toBe(3996);
    // Leer oder unlesbar zählt 0, nie NaN
    expect(calculateIPV(person({ monthlyIncome: 2000, versicherungen: { bvgContribution: 'abc' } })).annual).toBe(3996);
  });

  it('🛑 ohne erfassten BVG-Beitrag: Zusatz-Vorbehalt in der Anzeige (Betrag sonst zu hoch)', () => {
    expect(calculateIPV(person({ monthlyIncome: 2000 }))).toMatchObject({ zusatzVorbehaltKey: 'ipv.vorbehaltGRbvg' });
    expect(calculateIPV(person({ monthlyIncome: 2000, versicherungen: { bvgContribution: 300 } })).zusatzVorbehaltKey).toBeUndefined();
    // Eine erfasste 0 heisst «keine Pensionskasse» — dann ist nichts vergessen.
    expect(calculateIPV(person({ monthlyIncome: 2000, versicherungen: { bvgContribution: 0 } })).zusatzVorbehaltKey).toBeUndefined();
    expect(calculateIPV(person({ monthlyIncome: 2000, versicherungen: { bvgContribution: '' } })).zusatzVorbehaltKey).toBe('ipv.vorbehaltGRbvg');
    // Gegenprobe: ein Wert unter «finanzen» zählt nicht als erfasst.
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { bvgContribution: 300 } })).zusatzVorbehaltKey).toBe('ipv.vorbehaltGRbvg');
    // Ohne Lohn gibt es keinen BVG-Abzug zu vermissen.
    expect(calculateIPV(person({ monthlyIncome: 0 })).zusatzVorbehaltKey).toBeUndefined();
    // Auch beim «kein Anspruch» — dort kann das fehlende Feld die Aussage ebenfalls kippen.
    expect(calculateIPV(person({ monthlyIncome: 60000 / 12 }))).toMatchObject({ eligible: false, zusatzVorbehaltKey: 'ipv.vorbehaltGRbvg' });
  });

  it('Rundung auf den Franken, nicht abgeschnitten und nicht aufgerundet', () => {
    // 10 001 → 5 916 − 6,5 % × 10 001 = 5 265.935 → 5 266 (floor gäbe 5 265)
    expect(calculateIPV(person({ monthlyIncome: 10001 / 12 })).annual).toBe(5266);
    // 10 009 → 5 916 − 650.585 = 5 265.415 → 5 265 (ceil gäbe 5 266)
    expect(calculateIPV(person({ monthlyIncome: 10009 / 12 })).annual).toBe(5265);
  });

  it('negative Vermögensposten zählen nicht ins Einkommen (lit. a: «soweit der Wert nicht negativ ist»)', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { savingsAccount: -50000 } })).annual).toBe(3516);
  });

  it('Säule 3a: zählt voll (Art. 8a Abs. 1 lit. e) — und steckt schon im Nettoeinkommen', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 0 } })).annual;
    const mit = calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 7258 } })).annual;
    expect(mit).toBe(ohne);
  });

  it('Alter nach Jahrgang [5]: 2000 ist erwachsen, 2001 junger Erwachsener (Online-Rechner der SVA 2026)', () => {
    expect(calculateIPV(person({ dob: '1999-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ dob: '2001-01-01' }))).toMatchObject({ belegt: false, offen: 'alter' });
    expect(calculateIPV(person({ dob: '' }))).toMatchObject({ offen: 'alter' });
  });

  it('Kinder im Bereich der Vergleichsrechnung: keine Zahl, eigener Grund', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ age: 5 }] })))
      .toMatchObject({ belegt: false, amount: null, offen: 'grKinder' });
  });

  it('Kinder über 80 000: gerechnet (224), mit Geburtsjahr bis 2008', () => {
    const kinder = [{ birthDate: '2008-06-01' }, { birthDate: '2015-01-01' }];
    expect(calculateIPV(person({ monthlyIncome: 85000 / 12, children: kinder }))).toMatchObject({ belegt: true, annual: 224, maxAnnual: 5916 + 2 * 1404 });
  });

  it('Kinder über 18, ohne Alter, eingetippt 18; Paare und Konkubinat: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ children: [{ birthDate: '2007-12-31' }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 18 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 19 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { household: { adults: 2, children: [] } } }))).toMatchObject({ offen: 'haushalt' });
  });

  it('negatives Einkommen: keine Zahl statt des Höchstbetrags', () => {
    expect(calculateIPV(person({ monthlyIncome: -500 }))).toMatchObject({ belegt: false, offen: 'einkommenNegativ' });
  });

  describe('Frist und Jahres-Riegel', () => {
    it('im Anspruchsjahr läuft die Anmeldefrist bis 31.12. (Art. 14 Abs. 1 VOzKPVG)', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-12-31T12:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 2500 }))).toMatchObject({ noteKey: 'ipv.grFristLaeuft', noteParams: { jahr: 2026 } });
    });
    it('ab 2027 keine Zahl mehr, bis die Werte nachgeführt sind', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 2500 }))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });
});
