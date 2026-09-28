import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_VS, ipvWallisRechnen, vsSatzErwachsen, vsRegion } from '../ipvWallis.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Wallis 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt VS:
//   [1] VüIPV, SGS 832.105, in Kraft seit 01.05.2026 (Beschluss 20.05.2026) — Art. 2, 5, 6, 8, 9, 10
//   [2] «Einkommenstabelle zur Berechnung der Krankenkassensubventionen 2026» (Echelle définitive
//       RIP 2026, 19.12.2025) — am Seitenbild geprüft
//   [3] Ausgleichskasse Wallis, Seite «Prämienverbilligung» · [4] Anhang Medienmitteilung 3.2.2026
// Ein amtliches Rechenbeispiel mit Franken gibt es nicht (gesucht in [1]–[4]); Prüfstein ist die
// Tabelle [2] selbst — jede Zelle und jede Grenze.

describe('K31 VS: Einkommenstabelle [2], Alleinstehende — zeichengleich', () => {
  // Textlayer von [2], Block «ALLEINSTEHENDE PERSONEN» (ohne Kind … mit 9 Kindern).
  const WORTLAUT = `
70% 21'000 38'250 48'250 56'250 62'250 68'250 74'250 80'250 86'250 92'250
50% 23'917 41'896 51'896 59'896 65'896 71'896 77'896 83'896 89'896 95'896
40% 26'833 45'542 55'542 63'542 69'542 75'542 81'542 87'542 93'542 99'542
30% 29'750 49'188 59'188 67'188 73'188 79'188 85'188 91'188 97'188 103'188
20% 32'667 52'833 62'833 70'833 76'833 82'833 88'833 94'833 100'833 106'833
10% 35'583 56'479 66'479 74'479 80'479 86'479 92'479 98'479 104'479 110'479
5% 38'500 60'125 70'125 78'125 84'125 90'125 96'125 102'125 108'125 114'125
Kinder 80% - 63'000 70'125 78'125 84'125 90'125 96'125 102'125 108'125 114'125`;
  const zeilen = WORTLAUT.trim().split('\n').map((z) => z.replace(/'/g, '').split(' '));

  it('sieben Sätze, je zehn Grenzen, wie in der Tabelle', () => {
    const erwachsene = zeilen.slice(0, 7).map((z) => [Number(z[0].replace('%', '')), z.slice(1).map(Number)]);
    expect(IPV_VS.skalaAllein).toEqual(erwachsene);
  });
  it('Kinderzeile 80 %: «-» ohne Kind, 63 000 mit einem Kind — auch [5] Directives 2026 Ziff. 4.1', () => {
    const k = zeilen[7].slice(2).map((x) => (x === '-' ? null : Number(x)));
    expect(IPV_VS.kinderAllein).toEqual(k);
    expect(IPV_VS.kinderSatz).toBe(80);
  });
  it('Zuschläge je Kind laut Tabellenkopf: 12 000 / 10 000 / 8 000 / 6 000 — ab dem 1. Kind zur Basis «mit Kind»', () => {
    for (const [, g] of IPV_VS.skalaAllein) {
      expect([g[2] - g[1], g[3] - g[2], g[4] - g[3], g[5] - g[4], g[9] - g[8]]).toEqual([10000, 8000, 6000, 6000, 6000]);
    }
  });
  it('jede Grenze trifft ihren Satz — an der Grenze noch («gleich oder kleiner», Art. 2 Abs. 2), einen Franken darüber nicht', () => {
    IPV_VS.skalaAllein.forEach(([satz, grenzen], i) => {
      grenzen.forEach((g, k) => {
        expect([k, g, vsSatzErwachsen(g, k)]).toEqual([k, g, satz]);
        const naechster = i + 1 < IPV_VS.skalaAllein.length ? IPV_VS.skalaAllein[i + 1][0] : null;
        expect([k, g + 1, vsSatzErwachsen(g + 1, k)]).toEqual([k, g + 1, naechster]);
      });
    });
  });
  it('übrige Konstanten', () => {
    expect(IPV_VS.jahr).toBe(2026);
    expect(IPV_VS.basisjahrAbstand).toBe(2);
    expect(IPV_VS.vermoegensgrenze).toBe(1000000);
    expect(IPV_VS.vermoegenAnteil).toBe(0.05);
  });
});

describe('K31 VS: Referenzprämien [2] / Art. 5 Abs. 2 [1]', () => {
  it('Region I 561 / 401 / 133, Region II 481 / 359 / 110', () => {
    expect(IPV_VS.referenzpraemie).toEqual({ 1: { e: 561, j: 401, k: 133 }, 2: { e: 481, j: 359, k: 110 } });
  });
  it('Gegenprobe: EDI-Durchschnittsprämie × 0,95, auf Franken gerundet', () => {
    const edi = { 1: { e: 7092, j: 5064, k: 1680 }, 2: { e: 6072, j: 4536, k: 1392 } };
    for (const r of [1, 2]) for (const c of ['e', 'j', 'k']) {
      expect([r, c, Math.round((edi[r][c] * 0.95) / 12)]).toEqual([r, c, IPV_VS.referenzpraemie[r][c]]);
    }
  });
});

describe('K31 VS: Rechnung', () => {
  it('Einkommen 0 = 70 %: Region I 4 712.40, Region II 4 040.40', () => {
    expect(ipvWallisRechnen({ region: 1, me: 0 }).total).toBeCloseTo(4712.4, 9);
    expect(ipvWallisRechnen({ region: 2, me: 0 }).total).toBeCloseTo(4040.4, 9);
  });
  it('an der obersten Grenze 38 500: 5 % = 336.60; 38 501: nichts', () => {
    expect(ipvWallisRechnen({ region: 1, me: 38500 }).total).toBeCloseTo(336.6, 9);
    expect(ipvWallisRechnen({ region: 1, me: 38501 })).toMatchObject({ satz: null, total: 0 });
  });
  it('ein Kind, 40 000: Erwachsene 50 % (Grenze 41 896), Kind 80 %', () => {
    const r = ipvWallisRechnen({ region: 1, kinderZahl: 1, me: 40000 });
    expect(r.satz).toBe(50);
    expect(r.total).toBeCloseTo(0.5 * 561 * 12 + 0.8 * 133 * 12, 9);
  });
  it('ein Kind, 60 500: Erwachsene nichts mehr (5 % bis 60 125), Kind noch 80 %', () => {
    const r = ipvWallisRechnen({ region: 1, kinderZahl: 1, me: 60500 });
    expect(r).toMatchObject({ satz: null, kinderGilt: true });
    expect(r.total).toBeCloseTo(0.8 * 133 * 12, 9);
  });
  // ⟨gedreht 28.09.2026, Fachprüfung #477 ⚠️ 1⟩ Vorher «strittig» zwischen 61 001 und 63 000 (DE-
  // Medienanhang 61 000). [5] Ziff. 4.1: «entre CHF 60'125.- et CHF 63'000.-» → 63 000 gilt.
  it('ein Kind, 61 001 bis 63 000: Kind 80 % (Directives 2026 «entre 60 125 et 63 000»); 63 001: nichts', () => {
    for (const me of [61001, 62000, 63000]) expect(ipvWallisRechnen({ region: 1, kinderZahl: 1, me }).total).toBeCloseTo(0.8 * 133 * 12, 9);
    expect(ipvWallisRechnen({ region: 2, kinderZahl: 1, me: 63000 }).total).toBeCloseTo(1056, 9);
    expect(ipvWallisRechnen({ region: 1, kinderZahl: 1, me: 63001 })).toMatchObject({ total: 0 });
  });
  it('zwei Kinder: Kinderzeile = 5-%-Zeile (70 125)', () => {
    expect(ipvWallisRechnen({ region: 2, kinderZahl: 2, me: 70125 }).total).toBeCloseTo(0.05 * 481 * 12 + 2 * 0.8 * 110 * 12, 9);
    expect(ipvWallisRechnen({ region: 2, kinderZahl: 2, me: 70126 }).total).toBe(0);
  });
});

describe('K31 VS: Prämienregionen gegen [4] und die Bezirke', () => {
  // [4]: «Region 2: Gemeinden des Oberwallis, Anniviers, Evolène, Hérémence, Mont-Noble,
  // Saint-Martin und Vex.» Oberwallis = die Bezirke Brig, Goms, Leuk, Raron und Visp nach dem
  // BFS-Gemeindeverzeichnis, Stand 01.01.2026 (63 Gemeinden).
  const OBERWALLIS = ['Agarn', 'Albinen', 'Ausserberg', 'Baltschieder', 'Bellwald', 'Bettmeralp', 'Binn',
    'Bister', 'Bitsch', 'Blatten', 'Brig-Glis', 'Bürchen', 'Eggerberg', 'Eischoll', 'Eisten', 'Embd',
    'Ergisch', 'Ernen', 'Ferden', 'Fiesch', 'Fieschertal', 'Gampel-Bratsch', 'Goms', 'Grengiols',
    'Grächen', 'Guttet-Feschel', 'Inden', 'Kippel', 'Lalden', 'Lax', 'Leuk', 'Leukerbad', 'Mörel-Filet',
    'Naters', 'Niedergesteln', 'Oberems', 'Obergoms', 'Randa', 'Raron', 'Ried-Brig', 'Riederalp',
    'Saas-Almagell', 'Saas-Balen', 'Saas-Fee', 'Saas-Grund', 'Salgesch', 'Simplon', 'St. Niklaus',
    'Stalden (VS)', 'Staldenried', 'Steg-Hohtenn', 'Termen', 'Turtmann-Unterems', 'Täsch', 'Törbel',
    'Unterbäch', 'Varen', 'Visp', 'Visperterminen', 'Wiler (Lötschen)', 'Zeneggen', 'Zermatt', 'Zwischbergen'];
  const GENANNT = ['Anniviers', 'Evolène', 'Hérémence', 'Mont-Noble', 'Saint-Martin (VS)', 'Vex'];
  const R2 = [...OBERWALLIS, ...GENANNT];

  it('jede Walliser Gemeinde der App liegt in der Region, die [4] beschreibt', async () => {
    const plz = await import('../../data/plzGemeinde.js');
    const gemeinden = new Map();
    for (const p of plz.allPLZ()) for (const g of plz.lookupPLZ(p)) if (g.kanton === 'VS') gemeinden.set(g.bfsNr, g.gemeinde);
    expect(gemeinden.size).toBeGreaterThan(115);
    const gefunden = new Set();
    for (const [bfs, name] of gemeinden) {
      const soll = R2.includes(name) ? 2 : 1;
      if (soll === 2) gefunden.add(name);
      expect([name, vsRegion(bfs)]).toEqual([name, soll]);
    }
    expect(gefunden.size).toBe(R2.length);
    expect(vsRegion(99999)).toBe(null);
  });
});

describe('K31 calculateIPV für VS (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../../data/plzGemeinde.js');
    await import('../ipvWallis.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, plz = '1950', city = 'Sion', children = [], dob = '1980-05-01', kkPremium = 450, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'VS', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: plz, city },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('belegt, mit Quelle; keine Musterwerte; Weg automatisch', () => {
    expect(CANTONAL_IPV.VS.beleg.quelle).toMatch(/832\.105/);
    for (const k of ['maxIncome', 'subsidySingle', 'subsidyFamily', 'subsidyChild']) expect(CANTONAL_IPV.VS[k]).toBe(null);
    expect(CANTONAL_IPV.VS.noteKey).toBe('ipv.noteAutoTaxData');
  });

  it('Sion, 20 000 im Jahr: 70 % → 4 712 (393/Monat), Grenze 38 500', () => {
    const r = calculateIPV(person({ monthlyIncome: 20000 / 12 }));
    expect(r).toMatchObject({ belegt: true, eligible: true, annual: 4712, amount: 393, region: 1, jahr: 2026, basisjahr: 2024, vorbehaltKey: 'ipv.vorbehaltVS' });
    expect(r.cantonData.maxIncome).toBe(38500);
  });

  it('Region 2 (Brig-Glis): tiefer', () => {
    expect(calculateIPV(person({ plz: '3900', city: 'Brig-Glis' }))).toMatchObject({ annual: 4040, region: 2 });
  });

  it('PLZ mit Gemeinden in zwei Regionen ohne passenden Ort: keine Zahl', () => {
    // 3960: Sierre (1), Anniviers (2) …
    expect(calculateIPV(person({ plz: '3960', city: '' }))).toMatchObject({ belegt: false, offen: 'region' });
    expect(calculateIPV(person({ plz: '3960', city: 'Anniviers' }))).toMatchObject({ region: 2 });
  });

  it('Art. 6 Abs. 6: höchstens die Prämie — ohne erfasste Prämie keine Zahl', () => {
    expect(calculateIPV(person({ kkPremium: 200 }))).toMatchObject({ annual: 2400 });
    expect(calculateIPV(person({ kkPremium: null }))).toMatchObject({ belegt: false, offen: 'praemie' });
  });

  it('mit einem Kind, 40 000: 3 366 + 1 276.80 = 4 643; Grenze 63 000 in der Anzeige', () => {
    const r = calculateIPV(person({ monthlyIncome: 40000 / 12, children: [{ age: 5 }] }));
    expect(r).toMatchObject({ eligible: true, annual: 4643 });
    expect(r.cantonData.maxIncome).toBe(63000);
  });

  it('mit zwei Kindern: Grenze 70 125 in der Anzeige', () => {
    expect(calculateIPV(person({ monthlyIncome: 40000 / 12, children: [{ age: 5 }, { age: 7 }] })).cantonData.maxIncome).toBe(70125);
  });

  it('ein Kind, 62 000: das Kind erhält 80 % — 1 277 (vorher keine Zahl)', () => {
    expect(calculateIPV(person({ monthlyIncome: 62000 / 12, children: [{ age: 5 }] }))).toMatchObject({ belegt: true, eligible: true, annual: 1277 });
  });

  it('über der obersten Grenze: kein Anspruch, ohne Zahl im Satz', () => {
    expect(calculateIPV(person({ monthlyIncome: 38501 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.vsKeinAnspruch' });
    expect(calculateIPV(person({ monthlyIncome: 63001 / 12, children: [{ age: 5 }] }))).toMatchObject({ eligible: false, noteKey: 'ipv.vsKeinAnspruch' });
  });

  it('der Kinderanteil ist nicht an die Prämie der erwachsenen Person gedeckelt', () => {
    expect(calculateIPV(person({ monthlyIncome: 40000 / 12, children: [{ age: 5 }], kkPremium: 10 })).annual).toBe(Math.round(120 + 1276.8));
  });

  it('5 % des Vermögens zählen; über 1 Million keine Zahl', () => {
    // 20 000 + 5 % × 40 000 = 22 000 → 50 % → 3 366
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { savingsAccount: 40000 } })).annual).toBe(3366);
    expect(calculateIPV(person({ finanzen: { savingsAccount: 1000000 } })).belegt).toBe(true);
    expect(calculateIPV(person({ finanzen: { savingsAccount: 1000001 } }))).toMatchObject({ offen: 'vermoegen' });
  });

  it('Art. 8 Abs. 1 lit. b: bezahlte Unterhaltsbeiträge werden abgezogen', () => {
    // 22 000 − 12 × 100 = 20 800 → 70 % statt 50 %
    expect(calculateIPV(person({ monthlyIncome: 22000 / 12 })).annual).toBe(3366);
    expect(calculateIPV(person({ monthlyIncome: 22000 / 12, finanzen: { alimentePaid: 100 } })).annual).toBe(4712);
  });

  it('Säule 3a bis zum Maximum: steckt im Nettoeinkommen, verändert nichts', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 0 } })).annual;
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 7258 } })).annual).toBe(ohne);
  });

  it('🛑 Säule 3a über dem Maximum: Erlass und Merkblatt widersprechen sich — keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 4000, finanzen: { pension3a: 10000 } }))).toMatchObject({ belegt: false, offen: 'saeule3aStrittig' });
    expect(calculateIPV(person({ monthlyIncome: 500, finanzen: { pension3a: 10000 } }))).toMatchObject({ offen: 'saeule3aUeberEinkommen' });
  });

  it('negatives Einkommen: keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: -100 }))).toMatchObject({ offen: 'einkommenNegativ' });
  });

  it('Alter mangels Stichtag; Kinder bis 18; im Anspruchsjahr geborene Kinder: keine Zahl', () => {
    expect(calculateIPV(person({ dob: '1999-12-31' })).belegt).toBe(true);
    // Fachprüfung #477 ⚠️ 3: nicht «alter» (das Geburtsdatum fehlt nicht), eigener Grund.
    expect(calculateIPV(person({ dob: '2000-01-01' }))).toMatchObject({ offen: 'vsJungeErwachsene' });
    expect(calculateIPV(person({ dob: '2003-05-01' }))).toMatchObject({ offen: 'vsJungeErwachsene' });
    expect(calculateIPV(person({ dob: '' }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ children: [{ birthDate: '2008-06-01' }] })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ birthDate: '2007-06-01' }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ birthDate: '2026-03-01' }] }))).toMatchObject({ offen: 'kindImJahrGeboren' });
    expect(calculateIPV(person({ children: [{ birthDate: '2025-12-31' }] })).belegt).toBe(true);
  });

  it('mehr als neun Kinder, Kinder ohne Alter, Paare, Konkubinat: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ children: Array.from({ length: 10 }, () => ({ age: 5 })) }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: Array.from({ length: 9 }, () => ({ age: 5 })) })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
  });

  it('keine Anmeldefrist: der Betrag wird nicht als «Frist vorbei» markiert', () => {
    expect(calculateIPV(person({})).anmeldefristVorbei).toBeUndefined();
  });

  it('ab 2027 keine Zahl mehr', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
    expect(calculateIPV(person({}))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
  });

  // Fachprüfung #477 B1 (Ruling): erhaltene Alimente und Familienzulagen zählen (Art. 8 Abs. 1,
  // Wegleitung 2024 Ziff. 220 und 1410/1420), bezahlte werden abgezogen.
  describe('Unterhalt und Familienzulagen (B1)', () => {
    it('Beispiel der Prüfung: 1 Kind, 3 000 netto, 300 Zulagen, 800 Alimente → 49 200 → 2 623 statt 5 989', () => {
      const ohne = calculateIPV(person({ monthlyIncome: 3000, children: [{ age: 5 }] }));
      expect(ohne.annual).toBe(5989);
      const mit = calculateIPV(person({ monthlyIncome: 3000, children: [{ age: 5 }], finanzen: { familienzulagen: 300, alimenteReceived: 800 } }));
      // 36 000 + 3 600 + 9 600 = 49 200: über der 30-%-Grenze 49 188 → 20 %, Kind 80 %
      expect(mit.annual).toBe(Math.round(0.2 * 561 * 12 + 0.8 * 133 * 12));
      expect(mit.annual).toBe(2623);
    });
    it('je Feld einzeln: Familienzulagen zählen', () => {
      // 20 000 + 12 × 250 = 23 000 → 50 % statt 70 %
      expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { familienzulagen: 250 } })).annual).toBe(3366);
    });
    it('je Feld einzeln: erhaltene Alimente zählen', () => {
      expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { alimenteReceived: 250 } })).annual).toBe(3366);
    });
    it('je Feld einzeln: bezahlte Alimente werden abgezogen — und heben erhaltene auf', () => {
      expect(calculateIPV(person({ monthlyIncome: 23000 / 12, finanzen: { alimentePaid: 250 } })).annual).toBe(4712);
      expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { alimenteReceived: 250, alimentePaid: 250 } })).annual).toBe(4712);
    });
    it('unlesbare oder negative Werte zählen als 0', () => {
      expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { familienzulagen: 'abc', alimenteReceived: -50 } })).annual).toBe(4712);
    });
  });

  // Fachprüfung #477 B2: Quellenbesteuerte stellen ein Gesuch bis 31.12. (Directives 2026 Ziff. 6.2).
  it('Ausweis B oder L: Gesuch statt Zahl; C, Schweiz, ohne Angabe: rechnet', () => {
    for (const w of ['b', 'l', 'B']) expect(calculateIPV({ ...person({}), ausbildung: { workPermit: w } })).toMatchObject({ belegt: false, amount: null, offen: 'vsQuellensteuer' });
    for (const w of ['c', 'swiss', '', undefined]) expect(calculateIPV({ ...person({}), ausbildung: { workPermit: w } }).belegt).toBe(true);
  });
});

