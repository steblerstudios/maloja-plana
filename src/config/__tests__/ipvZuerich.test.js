import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_ZH, IPV_ZH_2027, IPV_ZH_JAHRE, ipvZuerichRechnen, zhRegion, zhWerte } from '../ipvZuerich.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, CANTON_CODES, getHouseholdInfo } from '../cantonalData.js';
import { getRegion } from '../../data/praemienRegionen.js';
import { calculateIPVAlt } from './calculateIPV-v0.1.37.js';
import { kantoneBelegtSimulieren } from './ipvBelegtSimulieren.js';

// K31 — Prämienverbilligung Kanton Zürich 2026 nach dem amtlichen Eigenanteilsmodell.
// Quellen (abgerufen 2026-09-19), Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt ZH:
//  [A] SVA Zürich, «Prämienverbilligung 2026: Einkommensgrenzen 2026»,
//      https://svazurich.ch/ihr-anliegen/privatpersonen/praemienverbilligung/praemienverbilligung_2026/einkommensgrenzen-2026.html
//  [B] SVA Zürich, «Prämienverbilligung: Leistung» (Eigenanteil, Referenzprämie, Berechnungsbeispiel),
//      https://svazurich.ch/unsere-produkte/weitere-produkte/krankenversicherung--kvg-/praemienverbilligung/leistung.html
//  [C] SVA Zürich, «Regionale Durchschnittsprämien», Tabelle 2026,
//      https://svazurich.ch/unsere-produkte/weitere-produkte/weitere-leistungen/ergaenzungsleistungen/regionale-durchschnittspraemien.html
//  [D] RRB Nr. 297/2025 (19.03.2025), Dispositiv II–IV (massgebende Prämie 84 %, Familiengrenze 70 500, Abzugsquote 60 %),
//      https://www.zh.ch/bin/zhweb/publish/regierungsratsbeschluss-unterlagen./2025/297/RRB-2025-0297.pdf
//  [E] EG KVG ZH (LS 832.01) § 4 Abs. 3, § 6 Abs. 3/4, § 7 Abs. 1.
//
// Amtliche Rechenbeispiele mit Betrag gibt es nur eines ([B], siehe unten — es widerspricht
// den übrigen Angaben). Darum prüfen die Tests das Modell an der amtlichen Tabelle [A]: jede
// dort publizierte Einkommensgrenze ist der Punkt, an dem die Verbilligung auf null fällt.
// Die Beträge in den Einzelfällen sind aus Formel und Zahlen [B]/[C]/[D] hergeleitet (so benannt).

const REGIONEN = [1, 2, 3];
// [A] wörtlich übernommen: je Region Zeile «junge Erwachsene (18 - 25 Jahre)» und «Erwachsene
// (älter 25 Jahre)», Spalten keine Kinder / 1 Kind / 2 Kinder / 3 Kinder.
const TABELLE_A = {
  einzel: {
    1: { j: [45900, 70500, 76700, 92100], e: [64000, 79400, 94800, 110200] },
    2: { j: [42000, 70500, 70500, 84000], e: [58400, 72400, 86400, 100400] },
    3: { j: [38900, 70500, 70500, 77900], e: [54400, 70500, 80400, 93400] },
  },
  verheiratet: {
    1: { j: [73440, 85760, 98080, 110400], e: [102400, 114720, 127040, 139360] },
    2: { j: [67200, 78400, 89600, 100800], e: [93440, 104640, 115840, 127040] },
    3: { j: [62240, 72640, 83040, 93440], e: [87040, 97440, 107840, 118240] },
  },
};

describe('K31 ZH-Modell gegen die amtliche Tabelle der Einkommensgrenzen 2026 [A]', () => {
  for (const [stand, proRegion] of Object.entries(TABELLE_A)) {
    for (const region of REGIONEN) {
      for (const alter of ['j', 'e']) {
        proRegion[region][alter].forEach((grenze, kinder) => {
          it(`${stand}, Region ${region}, ${alter === 'j' ? 'junge Erwachsene' : 'Erwachsene'}, ${kinder} Kind(er): Grenze CHF ${grenze}`, () => {
            const personen = [...Array(stand === 'verheiratet' ? 2 : 1).fill(alter), ...Array(kinder).fill('k')];
            const r = ipvZuerichRechnen({ region, verheiratet: stand === 'verheiratet', personen, me: grenze });
            expect(r.grenze).toBe(grenze);
          });
        });
      }
    }
  }
});

// ── Anspruchsjahr 2027 (vorbereitet 28.09.2026) ─────────────────────────────────────────────
// Quellen, abgerufen 2026-09-28 (Wortlaute: docs/sources/ipv-kantone-2026.md, ZH, «Vorbereitung 2027»):
//  [F] RRB Nr. 303/2026 vom 18.03.2026 (IPV 2027, Eckwerte erste Phase), Dispositiv I–VI,
//      https://www.zh.ch/bin/zhweb/publish/regierungsratsbeschluss-unterlagen./2026/303/RRB-2026-0303.pdf
//  [G] SVA Zürich, «Prämienverbilligung 2027: Einkommensgrenzen 2027»,
//      https://svazurich.ch/ihr-anliegen/privatpersonen/praemienverbilligung/praemienverbilligung_2027/einkommensgrenzen-2027.html
//  [B] wie oben («Leistung»): «Für das Jahr 2027 gelten folgende Eigenanteile: 11.8 … 9.4 Prozent».
// [G] wörtlich abgeschrieben, unabhängig von der Kopie im Modul — beide müssen übereinstimmen.
const TABELLE_G_2027 = {
  einzel: {
    1: { j: [42620, 71200, 71210, 85500], e: [59420, 73700, 88000, 102300] },
    2: { j: [39045, 71200, 71200, 78170], e: [54235, 71200, 80315, 93360] },
    3: { j: [36185, 71200, 71200, 72630], e: [50570, 71200, 74860, 86990] },
  },
  verheiratet: {
    1: { j: [67900, 78280, 90670, 102050], e: [94670, 106040, 117420, 128820] },
    2: { j: [62205, 72590, 82980, 93360], e: [86410, 96790, 107180, 117600] },
    3: { j: [57650, 71200, 77000, 86680], e: [80575, 90240, 99920, 109600] },
  },
};

// 🛑 ATTRAPPE, keine amtliche Zahl. Die Referenzprämie und die Durchschnittsprämien 2027 sind
// am 28.09.2026 nicht publiziert. Um die Mechanik (Jahreswechsel, Satz 2027, Stichtag,
// Tabellen-Grenze) zu prüfen, wird hier 70 % und die Tabelle 2026 eingesetzt — nur im Test,
// nur für die Dauer eines Falls. Erwartete Beträge sind darum keine Aussage über 2027.
const ATTRAPPE_2027 = { referenz: 0.7, rdp: IPV_ZH.rdp, satzProvisorisch: false };
function mitAttrappe2027(fn) {
  const alt = { referenz: IPV_ZH_2027.referenz, rdp: IPV_ZH_2027.rdp, satzProvisorisch: IPV_ZH_2027.satzProvisorisch };
  Object.assign(IPV_ZH_2027, ATTRAPPE_2027);
  try { return fn(); } finally { Object.assign(IPV_ZH_2027, alt); }
}

describe('K31 ZH 2027: Werte wörtlich an der Quelle', () => {
  it('Eigenanteil 2027 [B]: 9.4 % übrige, 11.8 % Verheiratete (provisorisch nach [F] Disp. VI)', () => {
    expect(IPV_ZH_2027.satz).toEqual({ uebrige: 0.094, verheiratet: 0.118 });
  });
  it('[F] Disp. II: massgebende Prämie 83 % (2026: 84 %)', () => {
    expect(IPV_ZH_2027.massgebend).toBe(0.83);
    expect(IPV_ZH.massgebend).toBe(0.84);
  });
  it('[F] Disp. III.1 Familiengrenze 71 200, Disp. IV Abzugsquote 60 %, Disp. I Vermögen 150 000 / 300 000', () => {
    expect(IPV_ZH_2027.familienGrenze).toBe(71200);
    expect(IPV_ZH_2027.abzugsquote).toBe(0.6);
    expect(IPV_ZH_2027.vermoegen.grenze).toEqual([150000, 300000]);
  });
  it('Referenzprämie und Durchschnittsprämien 2027 sind NICHT publiziert → null, nicht geraten', () => {
    expect(IPV_ZH_2027.referenz).toBeNull();
    expect(IPV_ZH_2027.rdp).toBeNull();
  });
  it('Einkommensgrenzen 2027 [G] wörtlich im Modul', () => {
    expect(IPV_ZH_2027.grenzen).toEqual(TABELLE_G_2027);
  });
});

describe('K31 ZH: Werte je Jahr', () => {
  it('2026 → Datensatz 2026 (unverändert), 2027 → noch keiner (unvollständig), 2025/2028 → keiner', () => {
    expect(zhWerte(2026)).toBe(IPV_ZH);
    expect(IPV_ZH_JAHRE[2027]).toBe(IPV_ZH_2027);
    expect(zhWerte(2027)).toBeNull();
    expect(zhWerte(2025)).toBeNull();
    expect(zhWerte(2028)).toBeNull();
  });
  it('sobald 2027 vollständig ist, wird es gewählt (Attrappe)', () => {
    mitAttrappe2027(() => expect(zhWerte(2027)).toBe(IPV_ZH_2027));
    expect(zhWerte(2027)).toBeNull(); // Attrappe wieder weg
  });
  it('provisorischer Eigenanteil hält 2027 zu, auch wenn Referenz und Durchschnittsprämien da sind', () => {
    const alt = { referenz: IPV_ZH_2027.referenz, rdp: IPV_ZH_2027.rdp };
    Object.assign(IPV_ZH_2027, { referenz: ATTRAPPE_2027.referenz, rdp: ATTRAPPE_2027.rdp });
    try { expect(zhWerte(2027)).toBeNull(); } finally { Object.assign(IPV_ZH_2027, alt); }
    expect(IPV_ZH_2027.satzProvisorisch).toBe(true);
  });
});

// Die Sache hinter dem Exaktheits-Test: 2026 IST die Grenze der Nullpunkt der Formel (36 Zellen
// oben, exakt). 2027 ist sie es nicht — die publizierten Zahlen liegen 5 bis 48 Franken unter
// «Summe ÷ Satz» (mit den Werten der Notiz vom 19.09.), eine Zelle 1 022 Franken, ohne
// erkennbare Rundungsregel (Quellenblatt). Darum gilt für 2027: angezeigt wird die
// publizierte Zahl, nie die gerechnete — geprüft an allen 48 Zellen, unabhängig davon, welche
// Durchschnittsprämie später eingesetzt wird.
describe('K31 ZH 2027: angezeigte Grenze = publizierte Tabelle [G], nicht die Formel', () => {
  for (const [stand, proRegion] of Object.entries(TABELLE_G_2027)) {
    for (const region of REGIONEN) {
      for (const alter of ['j', 'e']) {
        proRegion[region][alter].forEach((grenze, kinder) => {
          it(`${stand}, Region ${region}, ${alter}, ${kinder} Kind(er): CHF ${grenze}`, () => {
            const personen = [...Array(stand === 'verheiratet' ? 2 : 1).fill(alter), ...Array(kinder).fill('k')];
            const werte = { ...IPV_ZH_2027, ...ATTRAPPE_2027 };
            const r = ipvZuerichRechnen({ region, verheiratet: stand === 'verheiratet', personen, me: grenze, werte });
            expect(r.grenze).toBe(grenze);
          });
        });
      }
    }
  }
  it('ohne Tabellenzelle (4 Kinder) bleibt es beim Nullpunkt der Formel wie 2026', () => {
    const werte = { ...IPV_ZH_2027, ...ATTRAPPE_2027 };
    const r = ipvZuerichRechnen({ region: 1, verheiratet: false, personen: ['e', 'k', 'k', 'k', 'k'], me: 0, werte });
    expect(r.grenze).toBe(Math.round((0.7 * 12 * (640 + 4 * 154)) / 0.094));
  });
  it('2026 hat keine Tabelle im Datensatz: dort bleibt die Formel massgebend', () => {
    expect(IPV_ZH.grenzen).toBeUndefined();
  });
});

describe('K31 ZH-Modell: Beträge aus Formel und amtlichen Zahlen hergeleitet', () => {
  const einzel = (region, me, kinder = 0) => ipvZuerichRechnen({ region, verheiratet: false, personen: ['e', ...Array(kinder).fill('k')], me });

  it('Einkommen 0: volle Referenzprämie, 70 % × 640 × 12 = 5 376 (Region 1, [B] + [C])', () => {
    expect(einzel(1, 0).total).toBeCloseTo(5376, 6);
    expect(einzel(2, 0).total).toBeCloseTo(4905.6, 6); // 70 % × 584 × 12
    expect(einzel(3, 0).total).toBeCloseTo(4569.6, 6); // 70 % × 544 × 12
  });

  it('Berechnungsbeispiel [B], 20 000 alleinstehend, Region 1: Eigenanteil 1 680 wie amtlich; Betrag 3 696 statt der publizierten 4 096', () => {
    // [B] wörtlich: «Referenzprämie (70 Prozent der regionalen Durchschnittsprämie, Region 1) CHF 5'776
    // · Abzüglich Eigenanteil (8.4 Prozent vom massgebenden Einkommen; CHF 20'000) - CHF 1'680 ·
    // Höhe der Prämienverbilligung 2026 CHF 4'096». 70 % der Durchschnittsprämie Region 1 [C]
    // sind 5 376, nicht 5 776 — und nur 5 376 erklärt die Grenze 64 000 in [A] (64 000 × 8.4 % = 5 376).
    // Das Beispiel enthält vermutlich einen Tippfehler; die App folgt Regel und Tabelle.
    expect(0.084 * 20000).toBeCloseTo(1680, 6);
    expect(einzel(1, 20000).total).toBeCloseTo(3696, 6);
  });

  it('genau an der Grenze null, knapp darunter ein kleiner Betrag, darüber null (nie negativ)', () => {
    expect(einzel(1, 64000).total).toBeCloseTo(0, 6);
    expect(einzel(1, 63600).total).toBeCloseTo(33.6, 6); // 5 376 − 8.4 % × 63 600
    expect(einzel(1, 64001).total).toBe(0);
    expect(einzel(3, 90000).total).toBe(0);
  });

  it('Alleinerziehend, 1 Kind, Region 1, Einkommen 60 000: Kind erhält den Mindestanspruch [D] + [E] § 7', () => {
    // Referenzprämien: Erw. 5 376, Kind 70 % × 154 × 12 = 1 293.60; Summe 6 669.60.
    // Verbilligung Gruppe: 6 669.60 − 8.4 % × 60 000 = 1 629.60; Anteil Kind (§ 6 Abs. 4) = 316.07.
    // Mindestanspruch Kind: 80 % × 84 % × 154 × 12 = 1 241.856 > Anteil → Kind 1 241.856.
    // Erwachsene/r: 1 629.60 × 5 376 / 6 669.60 = 1 313.53. Total 2 555.39.
    const r = einzel(1, 60000, 1);
    expect(r.total).toBeCloseTo(1629.6 * 5376 / 6669.6 + 0.8 * 0.84 * 154 * 12, 6);
    expect(r.unklar).toBe(false);
  });

  it('Familiengrenze 70 500 [D]: bis dahin Mindestanspruch, knapp darüber rechnet die App nicht (Abbau 60 % je Kind oder je Familie offen)', () => {
    expect(einzel(3, 70500, 1).total).toBeCloseTo(0.8 * 0.84 * 130 * 12, 6); // Formel allein wäre 0 (Nullpunkt 67 400)
    expect(einzel(3, 70500, 1).unklar).toBe(false);
    expect(einzel(3, 70501, 1).unklar).toBe(true);
    // Über 70 500 + Mindestanspruch / 60 % bindet der Mindestanspruch unter keiner Lesart mehr.
    expect(einzel(3, 72300, 1)).toMatchObject({ total: 0, unklar: false });
  });

  it('über der Familiengrenze, aber Formel-Anteil des Kindes über dem Mindestanspruch: eindeutig', () => {
    // Region 1, 3 Kinder, Einkommen 71 000: Gruppe 9 256.80 − 5 964 = 3 292.80, Anteil je Kind 460.14 < 1 241.86 → unklar
    expect(einzel(1, 71000, 3).unklar).toBe(true);
    // Einkommen 20 000: unter der Familiengrenze, Anteil je Kind 1 002.13 < Mindest → Mindest gilt
    const r = einzel(1, 20000, 3);
    expect(r.unklar).toBe(false);
    expect(r.total).toBeCloseTo((9256.8 - 1680) * 5376 / 9256.8 + 3 * 0.8 * 0.84 * 154 * 12, 6);
  });

  it('Werte 2026 sichtbar im Datensatz', () => {
    expect(IPV_ZH.jahr).toBe(2026);
    expect(CANTONAL_IPV.ZH.beleg.quelle).toMatch(/SVA Zürich/);
    expect(CANTONAL_IPV.ZH.beleg.stand).toMatch(/2026/);
  });
});

// Erweitert 20.09.2026 um BE und AG (zweiter und vierter Kanton mit eigenem Modell), danach
// um SG, am 23.09.2026 um LU und am 28.09.2026 um VD, UR, NE, GE, GR, TG, TI, OW, SO, JU, NW, ZG, FR, SZ, SH, AR, AI, VS und BS: unverändert bleiben jetzt 2 der 26 Kantone.
const EIGENES_MODELL = ['ZH', 'BE', 'AG', 'SG', 'LU', 'VD', 'UR', 'NE', 'GE', 'GR', 'TG', 'TI', 'OW', 'SO', 'JU', 'NW', 'ZG', 'FR', 'SZ', 'SH', 'AR', 'AI', 'VS', 'BS'];

describe('K31 Regression: alle Kantone ausser ZH, BE, AG, SG, LU, VD, UR, NE, GE, GR, TG, TI, OW, SO, JU, NW, ZG, FR, SZ, SH, AR, AI, VS und BS rechnen exakt wie v0.1.37-beta', () => {
  const haushalte = [
    { adults: 1, children: [] }, { adults: 2, children: [], partnerIncome: 1500 },
    { adults: 1, children: [{ age: 5 }] }, { adults: 2, children: [{ age: 3 }, { age: 20 }] },
    { adults: 1, children: [{ age: 2 }, { age: 7 }, { age: 12 }] },
  ];
  const faelle = [];
  // K118 (24.09.2026): 'XX' und '' (kein Kanton) sind hier bewusst NICHT mehr dabei. Die Kopie
  // v0.1.37 hält für sie «amount: 0» fest — genau der Befund, den K118 behebt (unbekannt ≠ 0).
  // Gleichheit mit einem falschen Stand wäre kein Beleg. Geprüft wird der Fall jetzt in
  // cantonalData.test.js («ohne erkannten Kanton: kein Betrag»).
  for (const canton of CANTON_CODES.filter((k) => !EIGENES_MODELL.includes(k))) {
    for (const household of haushalte) {
      for (const monthlyIncome of [0, 800, 2500, 4000, 6000, 12000]) {
        for (const kkPremium of [undefined, 0, 380]) {
          faelle.push({
            basis: { canton, dateOfBirth: '1980-05-01', household },
            finanzen: { monthlyIncome, sideIncome: 200, ahvRente: 500, savingsAccount: 20000 },
            wohnen: { postalCode: '8004', city: 'Zürich' },
            versicherungen: kkPremium === undefined ? {} : { kkPremium },
          });
        }
      }
    }
  }

  it(`2 Kantone ohne eigenes Modell, unbelegt (heutiger Stand): ${faelle.length} Fälle identisch`, () => {
    expect(CANTON_CODES.filter((k) => !EIGENES_MODELL.includes(k))).toHaveLength(2);
    for (const d of faelle) expect(calculateIPV(d)).toStrictEqual(calculateIPVAlt(d));
  });

  // 25.09.2026 (13. Monatslohn, Befund PR #380): die Fälle haben keine Antwort zum 13. — «offen»
  // rechnet ×12 wie v0.1.37, sagt es aber dazu. Einzige erlaubte Differenz ist darum `annahmen`,
  // und nur dort, wo ein Betrag steht; alles andere bleibt Feld für Feld gleich.
  it('belegt (simuliert, linearer Abbau): identisch, bis auf die ausgewiesene Annahme', () => {
    const zurueck = kantoneBelegtSimulieren(CANTON_CODES.filter((k) => !EIGENES_MODELL.includes(k)));
    try {
      for (const d of faelle) {
        const { annahmen, ...rest } = calculateIPV(d);
        expect(rest).toStrictEqual(calculateIPVAlt(d));
        if (rest.eligible) expect(annahmen).toEqual({ ohneDreizehnten: d.finanzen.monthlyIncome > 0, partnerOhneDreizehnten: getHouseholdInfo(d).partnerIncome > 0 });
        else expect(annahmen).toBeUndefined();
      }
    } finally {
      zurueck();
    }
  });
});

describe('K31 Prämienregionen ZH (Guard gegen src/data/praemienRegionen.js, BAG 2026)', () => {
  it('jede ZH-Gemeinde der BAG-Tabelle hat in beiden Quellen dieselbe Region', async () => {
    const plz = await import('../../data/plzGemeinde.js');
    const bfs = new Set();
    for (const p of plz.allPLZ()) for (const g of plz.lookupPLZ(p)) if (g.kanton === 'ZH') bfs.add(g.bfsNr);
    expect(bfs.size).toBeGreaterThan(150);
    for (const n of bfs) expect([n, zhRegion(n)]).toEqual([n, getRegion(n)]);
  });
});

describe('K31 calculateIPV für ZH, bevor PLZ-Daten und ZH-Modul geladen sind', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'ZH', dateOfBirth: '1980-05-01' }, finanzen: {}, wohnen: { postalCode: '8004' } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 calculateIPV für ZH (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../../data/plzGemeinde.js');
    await import('../ipvZuerich.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  const person = ({ monthlyIncome = 0, plz = '8004', city = '', children = [], dob = '1980-05-01', kkPremium = 600, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'ZH', dateOfBirth: dob, household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: plz, city },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('Einzelperson, Einkommen 0, Stadt Zürich: 5 376/Jahr, 448/Monat, Grenze 64 000', () => {
    const r = calculateIPV(person());
    expect(r).toMatchObject({ belegt: true, eligible: true, annual: 5376, amount: 448, maxAnnual: 5376, reductionPercent: 100, region: 1, jahr: 2026 });
    expect(r.cantonData.maxIncome).toBe(64000);
    expect(r.noteKey).toBe('ipv.noteApplySva');
  });

  it('Einzelperson Winterthur (Region 2), 2 500/Monat: 4 905.60 − 8.4 % × 30 000 = 2 385.60', () => {
    const r = calculateIPV(person({ monthlyIncome: 2500, plz: '8400' }));
    expect(r).toMatchObject({ annual: 2386, amount: 199, region: 2 });
    expect(r.cantonData.maxIncome).toBe(58400);
  });

  it('genau an der Grenze (5 333.33 × 12 = 64 000): kein Anspruch, Grenze genannt', () => {
    const r = calculateIPV(person({ monthlyIncome: 64000 / 12 }));
    expect(r).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: 64000 } });
  });

  it('knapp unter der Grenze (5 300/Monat = 63 600): 34/Jahr, 3/Monat', () => {
    expect(calculateIPV(person({ monthlyIncome: 5300 }))).toMatchObject({ eligible: true, annual: 34, amount: 3 });
  });

  it('Alleinerziehend mit 2 Kindern, Uster (Region 2), 4 000/Monat: Mindestanspruch der Kinder', () => {
    // Referenzprämien: 4 905.60 + 2 × 70 % × 140 × 12 (1 176) = 7 257.60; Gruppe 7 257.60 − 8.4 % × 48 000 = 3 225.60
    // Erwachsene/r 3 225.60 × 4 905.60 / 7 257.60 = 2 180.27; Kinder je 80 % × 84 % × 140 × 12 = 1 128.96
    const r = calculateIPV(person({ monthlyIncome: 4000, plz: '8610', children: [{ age: 4 }, { age: 9 }] }));
    expect(r).toMatchObject({ eligible: true, annual: Math.round(3225.6 * 4905.6 / 7257.6 + 2 * 1128.96), region: 2 });
    expect(r.cantonData.maxIncome).toBe(86400); // [A] Region 2, Erwachsene, 2 Kinder
  });

  it('Bruttoprämie tiefer als die Referenzprämie: höchstens die Prämie (§ 4 Abs. 3 EG KVG)', () => {
    expect(calculateIPV(person({ kkPremium: 300 }))).toMatchObject({ annual: 3600, amount: 300, maxAnnual: 3600 });
  });

  it('Vermögen: 10 % über dem Freibetrag 75 000 zählt als Einkommen; über 150 000 kein Betrag', () => {
    // 100 000 Vermögen → + 2 500 massgebendes Einkommen → 5 376 − 210 = 5 166
    expect(calculateIPV(person({ finanzen: { savingsAccount: 100000 } })).annual).toBe(5166);
    expect(calculateIPV(person({ finanzen: { savingsAccount: 150001 } }))).toMatchObject({ belegt: false, amount: null, offen: 'vermoegen' });
  });

  // Eigenanteil und Durchschnittsprämien gelten je Anspruchsjahr (2027: 9,4/11,8 % statt
  // 8,4/10,5 %). Ab dem 01.01. des Folgejahres darf die App nicht still mit alten Sätzen
  // weiterrechnen. Ergänzt 20.09.2026 nach der Fachprüfung.
  describe('Jahres-Riegel', () => {
    afterEach(() => { vi.useRealTimers(); });

    it('im Anspruchsjahr 2026 rechnet sie', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-12-31T12:00:00'));
      expect(calculateIPV(person({})).annual).toBe(5376);
    });

    it('ab 2027 keine Zahl mehr, bis die Werte nachgeführt sind', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person({}))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });

    // Jahreswechsel mit befülltem 2027 (ATTRAPPE, siehe oben): ab 01.01.2027 rechnet dieselbe
    // Person mit dem Satz 2027, dem Stichtag 31.12.2026 und der Tabellen-Grenze 2027 —
    // am 31.12.2026 bleibt alles bei 2026.
    it('Jahreswechsel mit Attrappe: 31.12.2026 → Werte 2026, 01.01.2027 → Werte 2027', () => {
      mitAttrappe2027(() => {
        vi.useFakeTimers(); vi.setSystemTime(new Date('2026-12-31T23:59:00'));
        const alt = calculateIPV(person({ monthlyIncome: 2500 }));
        expect(alt).toMatchObject({ jahr: 2026, annual: 2856 }); // 5 376 − 8.4 % × 30 000
        expect(alt.cantonData.maxIncome).toBe(64000);
        vi.setSystemTime(new Date('2027-01-01T00:01:00'));
        const neu = calculateIPV(person({ monthlyIncome: 2500 }));
        expect(neu).toMatchObject({ jahr: 2027, annual: 2556 }); // 5 376 − 9.4 % × 30 000 (Attrappe)
        expect(neu.cantonData.maxIncome).toBe(59420); // [G], nicht 5 376 / 9.4 % = 57 191
      });
    });

    it('Stichtag wandert mit: Jahrgang 2000 ist am 31.12.2026 26 → 2027 erwachsen (Attrappe)', () => {
      mitAttrappe2027(() => {
        vi.useFakeTimers(); vi.setSystemTime(new Date('2026-06-01T12:00:00'));
        expect(calculateIPV(person({ dob: '2000-12-31' }))).toMatchObject({ offen: 'alter' });
        vi.setSystemTime(new Date('2027-06-01T12:00:00'));
        expect(calculateIPV(person({ dob: '2000-12-31' }))).toMatchObject({ belegt: true, jahr: 2027 });
      });
    });

    it('Kinder-Mindestanspruch 2027 mit 83 % [F] Disp. II (Attrappe)', () => {
      mitAttrappe2027(() => {
        vi.useFakeTimers(); vi.setSystemTime(new Date('2027-06-01T12:00:00'));
        // Region 1, 1 Kind, 60 000: Gruppe 6 669.60 − 9.4 % × 60 000 = 1 029.60
        const r = calculateIPV(person({ monthlyIncome: 5000, children: [{ age: 5 }] }));
        expect(r.annual).toBe(Math.round(1029.6 * 5376 / 6669.6 + 0.8 * 0.83 * 154 * 12));
      });
    });
  });

  // § 5 Abs. 1 lit. b EG KVG rechnet die Säule 3a dem massgebenden Einkommen zu — aber einer
  // Steuergrösse, in der sie abgezogen ist. Das Nettoeinkommen der App trägt sie schon.
  //
  // 🛑 RÜCKFALL-WÄCHTER (Befund Fachprüfung 20.09.2026, zweite Runde).
  // Hier stand bis zum 20.09. `pension3a: 7258 → 4766`, also die volle Aufrechnung ON TOP.
  // Das war eine Doppelzählung und kostete bei 48 000 Basiseinkommen 610.–/Jahr.
  // Nachgerechnet gegen den Rechenkern: Referenzprämie 0,7 × 640 × 12 = 5 376, Eigenanteil
  // 8,4 %. Bei 48 000 also 5 376 − 4 032 = 1 344 — mit der alten Doppelzählung nur 734.33.
  // 🛑 Die 7'258 hier NICHT durch die Konstante aus src/data/saeule3a.js ersetzen: Sie trägt
  // die Rechnung des Kommentars bis zur 734 unten. Ändert sich das Maximum, wäre 734 nicht
  // mehr «der alte, zu tiefe Wert» — der Wächter prüfte dann eine Zahl ohne Bedeutung.
  it('Säule 3a zählt NICHT zusätzlich zum Nettoeinkommen', () => {
    const mitDreiA = calculateIPV(person({ monthlyIncome: 4000, finanzen: { pension3a: 7258 } })).annual;
    const ohneDreiA = calculateIPV(person({ monthlyIncome: 4000, finanzen: { pension3a: 0 } })).annual;
    // 48 000 × 8,4 % = 4 032 → 5 376 − 4 032 = 1 344, in beiden Fällen
    expect(mitDreiA).toBe(1344);
    expect(ohneDreiA).toBe(1344);
    // und der alte, zu tiefe Wert kommt nicht zurück (1 344 − 8,4 % × 7 258 = 734.33 → 734)
    expect(mitDreiA).not.toBe(734);
  });

  // ⚠️ GRENZFALL, bewusst festgehalten statt stillschweigend in Kauf genommen.
  // Die Annahme «die 3a steckt schon im Nettoeinkommen» gilt nur, wenn es ein Einkommen gibt.
  // Wer 0 Einkommen erfasst und trotzdem einzahlt, bezahlt aus Vermögen oder einer Quelle,
  // die die App nicht kennt — dann fehlt dieser Betrag im massgebenden Einkommen.
  // Das Verhalten ist hier NICHT entschieden, nur belegt: offener Punkt im PR.
  it('Grenzfall: 3a ohne erfasstes Einkommen bleibt unberücksichtigt', () => {
    expect(calculateIPV(person({ monthlyIncome: 0, finanzen: { pension3a: 7258 } })).annual).toBe(5376);
  });

  it('Renten zählen zum massgebenden Einkommen', () => {
    expect(calculateIPV(person({ finanzen: { ahvRente: 2500 } })).annual).toBe(2856); // 5 376 − 8.4 % × 30 000
  });

  it('PLZ mit mehreren Regionen: mit Ortsname eindeutig, ohne Ortsname keine Zahl', () => {
    expect(calculateIPV(person({ plz: '8041', city: 'Zürich' })).region).toBe(1);
    expect(calculateIPV(person({ plz: '8041', city: 'Adliswil' })).region).toBe(2);
    expect(calculateIPV(person({ plz: '8041' }))).toMatchObject({ belegt: false, offen: 'region' });
    expect(calculateIPV(person({ plz: '8127' })).region).toBe(2); // mehrere Gemeinden, alle Region 2
  });

  it('ohne erfasste Prämie keine Zahl (§ 4 Abs. 3 EG KVG)', () => {
    expect(calculateIPV(person({ kkPremium: null }))).toMatchObject({ belegt: false, amount: null, offen: 'praemie' });
  });

  // § 4 Abs. 3 EG KVG bindet PRO PERSON. Bis 20.09.2026 liess ZH den Deckel mit Kindern ganz
  // entfallen (`!gruppe ? praemie : Infinity`) — der Anteil der erwachsenen Person war damit
  // durch nichts mehr begrenzt. BE und VD waren am selben Tag auf `deckelnProPerson`
  // umgestellt worden, ZH blieb stehen. Diese drei Fälle halten die Grenze fest.
  describe('Deckel pro Person § 4 Abs. 3 EG KVG', () => {
    // Aus [C]/[D] hergeleitet, nicht vom Code abgelesen: massgebende Prämie 70 % der
    // regionalen Durchschnittsprämie, Region 1 → Erwachsene 640, Kind 154 (je Monat).
    const refErwachsen = IPV_ZH.referenz * IPV_ZH.rdp[1].e * 12;   // 5 376
    const refKind = IPV_ZH.referenz * IPV_ZH.rdp[1].k * 12;        // 1 293.60

    it('mit Kind wird NUR der Anteil der erwachsenen Person gedeckelt, der Kinderanteil nicht', () => {
      // Einkommen 0 → volle Verbilligung: Anteil Erwachsene 5 376, Anteil Kind 1 293.60.
      // Prämie 300/Monat = 3 600/Jahr. Gedeckelt wird auf die EIGENE Prämie:
      //   min(5 376, 3 600) + 1 293.60 = 4 893.60 → 4 894
      const erwartet = Math.round(Math.min(refErwachsen, 3600) + refKind);
      const r = calculateIPV(person({ kkPremium: 300, children: [{ age: 5 }] }));
      expect(r.annual).toBe(erwartet);
      expect(erwartet).toBe(4894);
      // 🛑 Der Regressionsfall: ohne Deckel käme 6 670 heraus — 1 776 Franken im Jahr zu viel
      // für einen Haushalt, der jeden davon braucht.
      expect(r.annual).toBeLessThan(Math.round(refErwachsen + refKind));
    });

    it('der Kinderanteil bleibt ungedeckelt — sonst würde er an einer fremden Prämie gemessen', () => {
      // Die App kennt nur die Prämie der erwachsenen Person. Würde der Deckel auf die
      // Gesamtsumme wirken, verlöre der Haushalt den Kinderanteil, obwohl das Kind eine
      // eigene Prämie hat, die hier gar nicht erfasst ist.
      const r = calculateIPV(person({ kkPremium: 300, children: [{ age: 5 }] }));
      expect(r.annual - Math.min(refErwachsen, 3600)).toBeCloseTo(refKind, 0);
    });

    it('ohne Kind bleibt alles wie bisher — die Umstellung ändert diesen Fall nicht', () => {
      // Ohne Kinder ist der Anteil der erwachsenen Person die ganze Summe; `deckelnProPerson`
      // ergibt dann dasselbe wie das frühere Math.min(total, praemie).
      expect(calculateIPV(person({ kkPremium: 300 })).annual).toBe(3600);  // Deckel greift
      expect(calculateIPV(person({ kkPremium: 600 })).annual).toBe(5376);  // Deckel greift nicht
    });
  });

  it.each([
    ['ohne PLZ', { plz: '' }, 'region'],
    ['ohne Geburtsdatum', { dob: '' }, 'alter'],
    ['junge Erwachsene (Jahrgang 2001)', { dob: '2001-01-01' }, 'alter'],
    ['Paar', { basis: { household: { adults: 2, children: [] } } }, 'haushalt'],
    ['verheiratet ohne Partner im Haushalt', { basis: { maritalStatus: 'married' } }, 'haushalt'],
    ['Kind ab 19', { children: [{ age: 20 }] }, 'haushalt'],
    ['Familie knapp über 70 500', { monthlyIncome: 71000 / 12, plz: '8820', children: [{ age: 6 }] }, 'mindestanspruch'],
  ])('%s: Orientierung statt Betrag', (_, opts, grund) => {
    const r = calculateIPV(person(opts));
    expect(r).toMatchObject({ belegt: false, eligible: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: grund });
    expect(r.cantonData).toBeUndefined();
  });

  // § 8 EG KVG: massgebend ist das Alter am Ende des Vorjahres, für 2026 also am 31.12.2025.
  // Jahrgang 2000 ist dann 25 → junge erwachsene Person, eigene Grenzen (45 900), die die App
  // nicht rechnet (Einkommen der Eltern unbekannt) → Orientierung statt Betrag.
  // Korrigiert 20.09.2026 nach der Fachprüfung; vorher stand hier 5376.
  it('Jahrgang 2000 ist am Stichtag 31.12.2025 erst 25 → kein Betrag', () => {
    const r = calculateIPV(person({ dob: '2000-12-31' }));
    expect(r).toMatchObject({ belegt: false, amount: null, offen: 'alter' });
  });

  it('Jahrgang 1999 ist am Stichtag 26 → rechnet als Erwachsene/r', () => {
    expect(calculateIPV(person({ dob: '1999-12-31' })).annual).toBe(5376);
  });

  // KVG Art. 16a Abs. 1 / KVV Art. 91 Abs. 3: Kind ist, wer am 31.12. des Anspruchsjahrs höchstens
  // 18 ist. Die SVA führt für 2026 «Junge Erwachsene (Jahrgang 2001 bis 2007)». Jahrgang 2007 darf
  // 2026 also nicht als Kind rechnen (vorher tat es das: Alter am 31.12.2025 = 18). Fachprüfung 28.09.
  it.each([
    ['Kind Jahrgang 2007 (im Anspruchsjahr 19)', { children: [{ birthDate: '2007-12-31' }] }],
    ['Kind eingetippt 18 (Jahrgang unklar: 2007 oder 2008)', { children: [{ age: 18 }] }],
  ])('%s: Orientierung statt Kinder-Betrag', (_, opts) => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-06-15T12:00:00'));
    try {
      expect(calculateIPV(person(opts))).toMatchObject({ belegt: false, amount: null, offen: 'haushalt' });
    } finally { vi.useRealTimers(); }
  });
  it.each([
    ['Kind Jahrgang 2008 (im Anspruchsjahr 18)', { children: [{ birthDate: '2008-01-01' }] }],
    ['Kind eingetippt 17', { children: [{ age: 17 }] }],
  ])('%s: rechnet weiter als Kind', (_, opts) => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-06-15T12:00:00'));
    try {
      expect(calculateIPV(person(opts)).amount).not.toBeNull();
    } finally { vi.useRealTimers(); }
  });

  // Ein Kind ohne Geburtsdatum kommt in der App mit `age: 0` an (Vorbelegung, Alt-Daten-Migration).
  // Das heisst «nicht erfasst» und darf keinen Betrag erzeugen — sonst zahlt eine Annahme mit.
  it.each([
    ['Kind ohne jede Altersangabe', { children: [{}] }],
    ['Kind mit age 0 (Vorbelegung)', { children: [{ age: 0 }] }],
  ])('%s: Orientierung statt Betrag', (_, opts) => {
    const r = calculateIPV(person(opts));
    expect(r).toMatchObject({ belegt: false, amount: null, offen: 'alter' });
  });

  // Konkubinat: auch hier fehlt das Einkommen der zweiten Person. Ergänzt 20.09.2026, nachdem
  // die Fachprüfung bei BE gezeigt hat, dass der Guard `cohabiting` durchliess.
  it('Konkubinat: Orientierung statt Betrag', () => {
    const p = person({});
    const r = calculateIPV({ ...p, basis: { ...p.basis, maritalStatus: 'cohabiting' } });
    expect(r).toMatchObject({ belegt: false, amount: null, offen: 'haushalt' });
  });

  // § 3 Abs. 1 EG KVG: höchstens die Referenzprämie. Ein negativ erfasstes Einkommen darf
  // die Verbilligung nicht darüber hinaus wachsen lassen.
  it('negatives Einkommen sprengt die Obergrenze nicht', () => {
    const r = calculateIPV(person({ dob: '1980-01-01', monthlyIncome: -1000 }));
    expect(r.annual).toBeLessThanOrEqual(r.maxAnnual);
    expect(r.annual).toBe(5376);
  });

  it('Betrag sinkt nie mit steigendem Einkommen (Orientierungs-Fälle ausgenommen)', () => {
    for (const children of [[], [{ age: 3 }], [{ age: 2 }, { age: 7 }, { age: 12 }]]) {
      let vorher = Infinity;
      for (let m = 0; m <= 12000; m += 250) {
        const r = calculateIPV(person({ monthlyIncome: m, plz: '8820', children }));
        if (r.belegt === false) continue;
        expect(r.annual ?? 0).toBeLessThanOrEqual(vorher);
        vorher = r.annual ?? 0;
      }
    }
  });
});
