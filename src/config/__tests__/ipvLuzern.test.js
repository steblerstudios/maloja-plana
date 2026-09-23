import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_LU, ipvLuzernRechnen, luProzentsatz, luRegion, monatlichAufgerundet } from '../ipvLuzern.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Luzern 2026.
// Quellen (an der Quelle gelesen 23.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt LU:
//   [1] Prämienverbilligungsverordnung SRL 866a, in Kraft seit 01.01.2026 — §§ 2, 2a, 2b, 3, 3b, 7
//   [2] Prämienverbilligungsgesetz SRL 866, Stand 01.07.2021 — §§ 5, 7, 12
//   [3] WAS Luzern, Richtprämien 2026 / Prämienregionen 2026 (November 2025)
//   [4] WAS Luzern, Berechnungsbeispiel Prämienverbilligung 2026 (Zahlen nur als Bild im PDF)

describe('K31 LU: das amtliche Berechnungsbeispiel [4] — jede Zahl', () => {
  // Muster Paul und Sahra, Kevin und Cornel: Ehepaar, zwei Kinder. Die Region steht im
  // Beispiel nicht; die anrechenbaren Prämien 10 670.40 ergeben sich nur mit Region 3
  // (2 × 5 100 + 2 × 20 % × 1 176). Massgebendes Einkommen 53 500 nach Abzug 2 × 9 000.
  const r = ipvLuzernRechnen({ region: 3, kinderZahl: 2, me: 53500, erwachsene: 2 });

  it('Prozentsatz 10.00 + 3.21 = 13.21 %', () => {
    expect(r.prozent).toBeCloseTo(13.21, 9);
  });
  it('anrechenbare Prämien CHF 10 670.40 — das Kind zählt darin nur mit 20 %', () => {
    expect(r.anrechenbar).toBeCloseTo(10670.40, 6);
  });
  it('fixer Kinderanteil CHF 1 881.60 = 2 × 80 % × 1 176', () => {
    expect(2 * IPV_LU.kinderanteil * IPV_LU.richtpraemie[3].k).toBeCloseTo(1881.60, 6);
    expect(r.kinderanteilGilt).toBe(true);
  });
  it('eigener Prämienanteil CHF 7 067.35 (13,21 % von 53 500)', () => {
    expect(r.eigenanteil).toBeCloseTo(7067.35, 6);
  });
  it('Jahresanspruch CHF 5 484.65', () => {
    expect(r.total).toBeCloseTo(5484.65, 6);
  });
  it('Monatsanspruch je Person 143.55 / 85.05, total 457.20, im Jahr 5 486.40', () => {
    const e = monatlichAufgerundet(r.anteilErwachsen);
    const k = monatlichAufgerundet(r.anteilKind);
    expect(e).toBeCloseTo(143.55, 9);
    expect(k).toBeCloseTo(85.05, 9);
    expect(2 * e + 2 * k).toBeCloseTo(457.20, 9);
    expect((2 * e + 2 * k) * 12).toBeCloseTo(5486.40, 9);
  });
  it('🛑 die Aufteilung gewichtet mit den ANRECHENBAREN Prämien, nicht mit der vollen Richtprämie', () => {
    // Mit voller Gewichtung (5 100 : 1 176) bekäme die erwachsene Person 3 603.05 × 5 100 /
    // 12 552 = 1 463.94 im Jahr, also 122.– im Monat — nicht die 143.55 des Beispiels.
    const allgemein = r.anrechenbar - r.eigenanteil;
    const falsch = monatlichAufgerundet((allgemein * 5100) / (2 * 5100 + 2 * 1176));
    expect(falsch).not.toBeCloseTo(143.55, 2);
  });
});

describe('K31 LU: Richtprämien § 3 Abs. 1 [1], wörtlich', () => {
  it('drei Regionen, Erwachsene / junge Erwachsene / Kinder', () => {
    expect(IPV_LU.richtpraemie).toEqual({
      1: { e: 5628, j: 4044, k: 1308 },
      2: { e: 5304, j: 3780, k: 1224 },
      3: { e: 5100, j: 3660, k: 1176 },
    });
  });
  it('bei Einkommen 0 wird die volle Richtprämie verbilligt', () => {
    for (const region of [1, 2, 3]) {
      expect(ipvLuzernRechnen({ region, me: 0 }).total).toBeCloseTo(IPV_LU.richtpraemie[region].e, 9);
    }
  });
  it('die übrigen Werte aus [1] und [2]', () => {
    expect(IPV_LU.kinderGrenze).toEqual({ eltern: 96392, elternteil: 77114 });
    expect(IPV_LU.pauschalbetragKind).toBe(9000);
    expect(IPV_LU.vermoegenAnteil).toBe(0.10);
    expect(IPV_LU.vermoegen).toEqual({ alleinstehend: 100000, verheiratet: 200000, jeKind: 50000 });
    expect(IPV_LU.mindestbetrag).toBe(100);
    expect(IPV_LU.jahr).toBe(2026);
  });
});

describe('K31 LU: Prozentsatz § 2 Abs. 1 [1] — er STEIGT mit dem Einkommen', () => {
  it('10 % plus 0,00006 Prozentpunkte je Franken', () => {
    expect(luProzentsatz(0)).toBe(10);
    expect(luProzentsatz(20000)).toBeCloseTo(11.2, 9);
    expect(luProzentsatz(53500)).toBeCloseTo(13.21, 9);
  });
  it('liegt unter der gesetzlichen Obergrenze (§ 7 Abs. 1 [2]: höchstens 0,00015 je Franken)', () => {
    for (const me of [0, 20000, 50000, 100000]) expect(luProzentsatz(me)).toBeLessThanOrEqual(10 + 0.00015 * me);
  });
  it('Handrechnung: Region 1, Einzelperson, 20 000 → 5 628 − 11,2 % × 20 000 = 3 388', () => {
    expect(ipvLuzernRechnen({ region: 1, me: 20000 }).total).toBeCloseTo(3388, 9);
  });
  it('der Abbau ist quadratisch, nicht linear', () => {
    const bei = (me) => ipvLuzernRechnen({ region: 1, me }).total;
    expect(bei(30000) - bei(35000)).toBeGreaterThan(bei(15000) - bei(20000));
  });
});

describe('K31 LU: Kinder § 2a / § 2b [1]', () => {
  it('Handrechnung: Region 1, ein Elternteil, ein Kind, 39 000 → 2 123.40', () => {
    // p = 12,34 % → 4 812.60; fest 0,8 × 1 308 = 1 046.40; anrechenbar 5 628 + 261.60
    // = 5 889.60; allgemein 1 077.00; total 1 077.00 + 1 046.40 = 2 123.40
    const r = ipvLuzernRechnen({ region: 1, kinderZahl: 1, me: 39000 });
    expect(r.total).toBeCloseTo(2123.40, 9);
    expect(r.anteilErwachsen).toBeCloseTo(1077 * 5628 / 5889.6, 9);
  });
  it('§ 2b: rechnerisch dasselbe wie max(Kinderanteil, Summe Richtprämien − Eigenanteil)', () => {
    for (const me of [0, 10000, 30000, 50000, 70000, 77114]) {
      for (const k of [1, 2, 3]) {
        const r = ipvLuzernRechnen({ region: 2, kinderZahl: k, me });
        const summe = 5304 + k * 1224;
        expect(r.total).toBeCloseTo(Math.max(k * 0.8 * 1224, summe - r.eigenanteil), 6);
      }
    }
  });
  it('die Grenze für einen Elternteil: 77 114 gilt noch, 77 115 nicht mehr', () => {
    expect(ipvLuzernRechnen({ region: 1, kinderZahl: 1, me: 77114 }).total).toBeCloseTo(1046.40, 9);
    expect(ipvLuzernRechnen({ region: 1, kinderZahl: 1, me: 77115 }).total).toBe(0);
  });
  it('🛑 über der Grenze mit verbleibendem Anspruch (ab fünf Kindern): unklar, keine Zahl', () => {
    expect(ipvLuzernRechnen({ region: 1, kinderZahl: 5, me: 78000 }).unklar).toBe(true);
    expect(ipvLuzernRechnen({ region: 1, kinderZahl: 4, me: 78000 }).unklar).toBe(false);
  });
});

describe('K31 LU: Mindestbetrag § 7 [1] — auf dem GESAMTEN Anspruch', () => {
  it('knapp unter dem Nullpunkt: Anspruch besteht, wird aber nicht ausbezahlt', () => {
    const r = ipvLuzernRechnen({ region: 1, me: 44000 });
    expect(r.total).toBeGreaterThan(0);
    expect(r.total).toBeLessThan(100);
    expect(r.grund).toBe('mindestbetrag');
  });
  it('über dem Nullpunkt: ein anderer Grund', () => {
    expect(ipvLuzernRechnen({ region: 1, me: 45000 }).grund).toBe('ueberGrenze');
  });
  it('mit Kind zählt die Summe, nicht jede Person', () => {
    // Der Anteil der erwachsenen Person ist hier 0, der des Kindes 1 046.40 — ausbezahlt wird.
    expect(ipvLuzernRechnen({ region: 1, kinderZahl: 1, me: 77114 }).grund).toBe(null);
  });
});

describe('K31 LU: Rundung «Ungerade Beträge runden wir auf» [4]', () => {
  it('Monatsbetrag auf 5 Rappen aufgerundet, genaue Beträge bleiben', () => {
    expect(monatlichAufgerundet(1722.12)).toBeCloseTo(143.55, 9);
    expect(monatlichAufgerundet(1722.00)).toBeCloseTo(143.50, 9);
    expect(monatlichAufgerundet(0)).toBe(0);
    expect(monatlichAufgerundet(-5)).toBe(0);
  });
});

describe('K31 LU: Prämienregionen gegen die Gemeindeliste der WAS [3]', () => {
  const R1 = ['Ebikon', 'Emmen', 'Horw', 'Kriens', 'Luzern'];
  const R2 = ['Adligenswil', 'Buchrain', 'Dierikon', 'Eich', 'Malters', 'Meggen', 'Meierskappel',
    'Neuenkirch', 'Nottwil', 'Oberkirch', 'Root', 'Rothenburg', 'Ruswil', 'Schenkon', 'Sempach',
    'Sursee', 'Udligenswil', 'Werthenstein', 'Wolhusen'];

  it('jede Luzerner Gemeinde der App liegt in der Region, die die WAS nennt', async () => {
    const plz = await import('../../data/plzGemeinde.js');
    const gemeinden = new Map();
    for (const p of plz.allPLZ()) for (const g of plz.lookupPLZ(p)) if (g.kanton === 'LU') gemeinden.set(g.bfsNr, g.gemeinde);
    expect(gemeinden.size).toBeGreaterThan(70);
    const genannt = new Set();
    for (const [bfs, name] of gemeinden) {
      const soll = R1.includes(name) ? 1 : R2.includes(name) ? 2 : 3;
      if (soll !== 3) genannt.add(name);
      expect([name, luRegion(bfs)]).toEqual([name, soll]);
    }
    // Alle 24 namentlich genannten Gemeinden sind gefunden — sonst prüfte der Test weniger,
    // als er behauptet (ein Tippfehler in der Liste fiele still in Region 3).
    expect(genannt.size).toBe(R1.length + R2.length);
  });
});

describe('K31 calculateIPV für LU (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../../data/plzGemeinde.js');
    await import('../ipvLuzern.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, plz = '6003', city = '', children = [], dob = '1980-05-01', kkPremium = 450, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'LU', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: plz, city },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('belegt, mit Quelle; keine Musterwerte, keine Grenze', () => {
    expect(CANTONAL_IPV.LU.beleg.quelle).toMatch(/SRL 866a/);
    expect(CANTONAL_IPV.LU.maxIncome).toBe(null);
    expect(CANTONAL_IPV.LU.subsidySingle).toBe(null);
  });

  it('Stadt Luzern, 20 000 im Jahr: 3 388 (monatlich 282.35 × 12 = 3 388.20)', () => {
    const r = calculateIPV(person({ monthlyIncome: 20000 / 12 }));
    expect(r).toMatchObject({ belegt: true, eligible: true, annual: 3388, amount: 282, region: 1, jahr: 2026, vorbehaltKey: 'ipv.vorbehaltLU' });
    expect(r.cantonData.maxIncome).toBe(null);
  });

  it('Regionen 2 und 3 geben die tieferen Beträge', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, plz: '6210', city: 'Sursee' }))).toMatchObject({ annual: 1764, region: 2 });
    expect(calculateIPV(person({ monthlyIncome: 2500, plz: '6280', city: 'Hochdorf' }))).toMatchObject({ annual: 1560, region: 3 });
  });

  it('eine PLZ über die Kantonsgrenze (6010): zählt nur die Luzerner Gemeinde', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, plz: '6010' }))).toMatchObject({ region: 1 });
  });

  it('PLZ mit Gemeinden in zwei Regionen ohne Ort: keine Zahl; mit Ort: die richtige', () => {
    expect(calculateIPV(person({ plz: '6030' }))).toMatchObject({ belegt: false, amount: null, offen: 'region' });
    expect(calculateIPV(person({ plz: '6030', city: 'Ebikon' }))).toMatchObject({ region: 1 });
    expect(calculateIPV(person({ plz: '6030', city: 'Buchrain' }))).toMatchObject({ region: 2 });
  });

  it('§ 7 Abs. 7 [2]: höchstens die Prämie — ohne erfasste Prämie keine Zahl', () => {
    expect(calculateIPV(person({ kkPremium: 200 }))).toMatchObject({ annual: 2400, maxAnnual: 2400 });
    expect(calculateIPV(person({ kkPremium: null }))).toMatchObject({ belegt: false, amount: null, offen: 'praemie' });
  });

  it('mit einem Kind (5 Jahre): Einkommen 48 000 − 9 000 = 39 000 → 2 124 (gerundet wie ausbezahlt)', () => {
    // 1 029.16 → 85.80/Monat, 1 094.24 → 91.20/Monat; (85.80 + 91.20) × 12 = 2 124.00
    const r = calculateIPV(person({ monthlyIncome: 4000, children: [{ age: 5 }] }));
    expect(r).toMatchObject({ eligible: true, annual: 2124, region: 1 });
    expect(r.maxAnnual).toBe(Math.round(5400 + 1308));
  });

  it('der Kinderanteil ist nicht an die Prämie der erwachsenen Person gedeckelt', () => {
    // Massgebend 77 000, unter der Kinder-Grenze 77 114: der Anteil der erwachsenen Person
    // ist 0, der Kinderanteil 1 046.40 bleibt — auch bei einer sehr tiefen eigenen Prämie.
    const r = calculateIPV(person({ monthlyIncome: (77000 + 9000) / 12, children: [{ age: 5 }], kkPremium: 50 }));
    expect(r).toMatchObject({ eligible: true, annual: 1046 });
  });

  it('10 % des Vermögens zählen zum Einkommen; über 100 000 (+50 000 je Kind) keine Zahl', () => {
    // 50 000 → + 5 000: 25 000 massgebend → 5 628 − (10 + 1,5) % × 25 000 = 2 753
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { savingsAccount: 50000 } })).annual).toBe(2753);
    expect(calculateIPV(person({ finanzen: { savingsAccount: 100001 } }))).toMatchObject({ offen: 'vermoegen' });
    expect(calculateIPV(person({ children: [{ age: 5 }], finanzen: { savingsAccount: 150000 } })).belegt).toBe(true);
  });

  it('Säule 3a: zählt voll (§ 7 Abs. 2 lit. b [2]) — und steckt schon im Nettoeinkommen', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 0 } })).annual;
    const mit = calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 7258 } })).annual;
    expect(mit).toBe(ohne);
  });

  it('Alter nach Jahrgang [3]: 2000 ist erwachsen, 2001 nicht', () => {
    expect(calculateIPV(person({ dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ dob: '2001-01-01' }))).toMatchObject({ belegt: false, offen: 'alter' });
  });

  it('Kinder nach Jahrgang [3] (2008–2026); das eingetippte Alter zählt im Anspruchsjahr eins mehr', () => {
    expect(calculateIPV(person({ children: [{ birthDate: '2008-12-31' }] })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ birthDate: '2007-12-31' }] }))).toMatchObject({ offen: 'haushalt' });
    // Ohne Geburtsdatum ist 18 nicht sicher ein Kind im Jahr 2026 — vorsichtig keine Zahl.
    // (Mutationsprobe 23.09.2026: ohne diese Zeile überlebte `kinderAlter(…, jahr, 0)`.)
    expect(calculateIPV(person({ children: [{ age: 18 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 17 }] })).belegt).toBe(true);
  });

  it('Kinder über 18, Kinder ohne Alter, Paare: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ children: [{ age: 19 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
  });

  it('fünf Kinder knapp über der Grenze: keine Zahl statt einer geratenen', () => {
    const kinder = Array.from({ length: 5 }, () => ({ age: 5 }));
    // 78 000 + 5 × 9 000 = 123 000 Jahreseinkommen → massgebend 78 000
    expect(calculateIPV(person({ monthlyIncome: 123000 / 12, children: kinder, finanzen: { savingsAccount: 0 } })))
      .toMatchObject({ belegt: false, offen: 'mindestanspruch' });
  });

  it('zwei Gründe für «kein Betrag»: unter dem Mindestbetrag und über der Grenze', () => {
    expect(calculateIPV(person({ monthlyIncome: 44000 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.luUnterMindestbetrag' });
    expect(calculateIPV(person({ monthlyIncome: 45000 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.luKeinAnspruch' });
  });

  describe('Frist § 12 [2] und Jahres-Riegel', () => {
    it('im Anspruchsjahr: Frist 31.10. des Vorjahres ist vorbei', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-09-23T12:00:00'));
      expect(calculateIPV(person({}))).toMatchObject({ noteKey: 'ipv.luFristVorbei', noteParams: { jahr: 2026, vorjahr: 2025, folgejahr: 2027 } });
    });
    it('bis 31.10.2025: die Frist läuft', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2025-10-31T12:00:00'));
      expect(calculateIPV(person({}))).toMatchObject({ noteKey: 'ipv.luFristLaeuft' });
    });
    it('ab 2027 keine Zahl mehr, bis die Werte nachgeführt sind', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person({}))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });
});
