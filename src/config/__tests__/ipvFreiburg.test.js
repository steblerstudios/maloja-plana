import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_FR, ipvFreiburgRechnen, frGrenze, frAbstand, frSatz, frRegion } from '../ipvFreiburg.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Freiburg 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt FR:
//   [1] ORP, RSF 842.1.13, in Kraft seit 01.01.2024 (Annahme 09.10.2023) — Art. 2, 3, 4, 5, 6, 7a, Annexe 1
//   [2] LALAMal, RSF 842.1.1, in Kraft seit 01.01.2017 — Art. 15, 20
//   [3] ECAS, Mémento RPI 2026 — Ziff. 1 (Grenzen), 8 (Beispiel), 8.1 (Durchschnittsprämien)

describe('K31 FR: das amtliche Berechnungsbeispiel [3] Ziff. 8 — jede Zahl', () => {
  // «Limite de revenu CHF 93'000.-- (couple marié + 2 enfants) / Revenu déterminant CHF 62'000.--
  // (différence: - 31'000.--) … 33.33% … les parents ont droit à une réduction de primes de
  // 35.71% et les enfants à une réduction de 80%.»
  const r = ipvFreiburgRechnen({ region: 1, kinderZahl: 2, me: 62000, paar: true });

  it('Grenze Ehepaar + 2 Kinder: 65 000 + 2 × 14 000 = 93 000', () => {
    expect(r.grenze).toBe(93000);
  });
  it('Abstand 31 000 / 93 000 × 100 = 33.33 %', () => {
    expect(r.abstand).toBe(33.33);
  });
  it('Satz der Eltern 35.71 %, der Kinder 80 %', () => {
    expect(r.satz).toBe(35.71);
    expect(r.kinderSatz).toBe(80);
  });
  it('in Franken (eigene Rechnung, Region 1): Eltern je 35,71 % × 569 × 12, Kinder je 80 % × 136 × 12', () => {
    expect(r.anteilErwachsen).toBeCloseTo(0.3571 * 569 * 12, 9);
    expect(r.anteilKind).toBeCloseTo(0.8 * 136 * 12, 9);
    expect(r.total).toBeCloseTo(2 * 0.3571 * 569 * 12 + 2 * 0.8 * 136 * 12, 9);
  });
});

describe('K31 FR: Grenzen Art. 3 [1] — und die Tabelle im Mémento [3] Ziff. 1', () => {
  it('die Konstanten wörtlich', () => {
    expect(IPV_FR.grenze).toEqual({ alleinOhneKind: 37000, alleinMitKind: 43400, paar: 65000, jeKind: 14000 });
    expect(IPV_FR.jahr).toBe(2026);
    expect(IPV_FR.basisjahrAbstand).toBe(2);
  });
  it('die Formel ergibt jede Zeile der Mémento-Tabelle', () => {
    const allein = [37000, 57400, 71400, 85400, 99400, 113400, 127400];
    const paar = [65000, 79000, 93000, 107000, 121000, 135000, 149000];
    allein.forEach((g, k) => expect(frGrenze({ kinderZahl: k })).toBe(g));
    paar.forEach((g, k) => expect(frGrenze({ kinderZahl: k, paar: true })).toBe(g));
  });
  it('Ausschluss Art. 4 [1]: 150 000 Nettoeinkommen, 250 000 steuerbares Vermögen; 5 % Vermögen (Art. 5)', () => {
    expect(IPV_FR.ausschluss).toEqual({ einkommen: 150000, vermoegen: 250000 });
    expect(IPV_FR.vermoegenAnteil).toBe(0.05);
    expect(IPV_FR.kinderMindestsatz).toBe(80);
  });
});

describe('K31 FR: Durchschnittsprämien 2026 [3] Ziff. 8.1', () => {
  it('Region 1 569 / 415 / 136, Region 2 524 / 386 / 124 im Monat', () => {
    expect(IPV_FR.durchschnittspraemie).toEqual({ 1: { e: 569, j: 415, k: 136 }, 2: { e: 524, j: 386, k: 124 } });
  });
  it('Gegenprobe ORP Art. 6 al. 3 [1]: 93 % des EDI-Jahreswerts durch 12, auf den Franken aufgerundet', () => {
    // EDI-Verordnung Durchschnittsprämien 2026, Anhang Ziff. 2, FR (Franken im Jahr).
    const edi = { 1: { e: 7332, j: 5352, k: 1752 }, 2: { e: 6756, j: 4968, k: 1596 } };
    for (const r of [1, 2]) for (const c of ['e', 'j', 'k']) {
      expect([r, c, Math.ceil((edi[r][c] * 0.93) / 12)]).toEqual([r, c, IPV_FR.durchschnittspraemie[r][c]]);
    }
  });
});

describe('K31 FR: Stufentabelle Annexe 1 [1] — zeichengleich', () => {
  // Wortlaut der Annexe 1 (BDLF, Version 8445), gleich im Mémento Ziff. 12.1 und in der
  // «Lissage des taux (60 paliers)» der ECAS.
  const WORTLAUT = `
de 0,01 % jusqu’à 1,02 % 1,00 %
de 1,03 % jusqu’à 2,03 % 2,08 %
de 2,04 % jusqu’à 3,05 % 3,17 %
de 3,06 % jusqu’à 4,07 % 4,25 %
de 4,08 % jusqu’à 5,08 % 5,34 %
de 5,09 % jusqu’à 6,10 % 6,42 %
de 6,11 % jusqu’à 7,12 % 7,51 %
de 7,13 % jusqu’à 8,14 % 8,59 %
de 8,15 % jusqu’à 9,15 % 9,68 %
de 9,16 % jusqu’à 10,17 % 10,76 %
de 10,18 % jusqu’à 11,19 % 11,85 %
de 11,20 % jusqu’à 12,20 % 12,93 %
de 12,21 % jusqu’à 13,22 % 14,02 %
de 13,23 % jusqu’à 14,24 % 15,10 %
de 14,25 % jusqu’à 15,25 % 16,19 %
de 15,26 % jusqu’à 16,27 % 17,27 %
de 16,28 % jusqu’à 17,29 % 18,36 %
de 17,30 % jusqu’à 18,31 % 19,44 %
de 18,32 % jusqu’à 19,32 % 20,53 %
de 19,33 % jusqu’à 20,34 % 21,61 %
de 20,35 % jusqu’à 21,36 % 22,69 %
de 21,37 % jusqu’à 22,37 % 23,78 %
de 22,38 % jusqu’à 23,39 % 24,86 %
de 23,40 % jusqu’à 24,41 % 25,95 %
de 24,42 % jusqu’à 25,42 % 27,03 %
de 25,43 % jusqu’à 26,44 % 28,12 %
de 26,45 % jusqu’à 27,46 % 29,20 %
de 27,47 % jusqu’à 28,47 % 30,29 %
de 28,48 % jusqu’à 29,49 % 31,37 %
de 29,50 % jusqu’à 30,51 % 32,46 %
de 30,52 % jusqu’à 31,53 % 33,54 %
de 31,54 % jusqu’à 32,54 % 34,63 %
de 32,55 % jusqu’à 33,56 % 35,71 %
de 33,57 % jusqu’à 34,58 % 36,80 %
de 34,59 % jusqu’à 35,59 % 37,88 %
de 35,60 % jusqu’à 36,61 % 38,97 %
de 36,62 % jusqu’à 37,63 % 40,05 %
de 37,64 % jusqu’à 38,64 % 41,14 %
de 38,65 % jusqu’à 39,66 % 42,22 %
de 39,67 % jusqu’à 40,68 % 43,31 %
de 40,69 % jusqu’à 41,69 % 44,39 %
de 41,70 % jusqu’à 42,71 % 45,47 %
de 42,72 % jusqu’à 43,73 % 46,56 %
de 43,74 % jusqu’à 44,75 % 47,64 %
de 44,76 % jusqu’à 45,76 % 48,73 %
de 45,77 % jusqu’à 46,78 % 49,81 %
de 46,79 % jusqu’à 47,80 % 50,90 %
de 47,81 % jusqu’à 48,81 % 51,98 %
de 48,82 % jusqu’à 49,83 % 53,07 %
de 49,84 % jusqu’à 50,85 % 54,15 %
de 50,86 % jusqu’à 51,86 % 55,24 %
de 51,87 % jusqu’à 52,88 % 56,32 %
de 52,89 % jusqu’à 53,90 % 57,41 %
de 53,91 % jusqu’à 54,92 % 58,49 %
de 54,93 % jusqu’à 55,93 % 59,58 %
de 55,94 % jusqu’à 56,95 % 60,66 %
de 56,96 % jusqu’à 57,97 % 61,75 %
de 57,98 % jusqu’à 58,98 % 62,83 %
de 58,99 % jusqu’à 60,00 % 63,92 %
de 60,01 % ou plus 65,00 %`;
  const zahl = (s) => Number(s.replace(',', '.'));
  const zeilen = WORTLAUT.trim().split('\n').map((z) => z.match(/[\d,]+(?= %)/g).map(zahl));

  it('60 Stufen, jede untere Grenze und jeder Satz wie im Erlass', () => {
    expect(IPV_FR.stufen).toHaveLength(60);
    expect(IPV_FR.stufen).toEqual(zeilen.map((z) => [z[0], z[z.length - 1]]));
  });
  it('die Stufen schliessen lückenlos an (obere Grenze + 0,01 = nächste untere)', () => {
    for (let i = 1; i < zeilen.length; i++) expect(zeilen[i][0]).toBeCloseTo(zeilen[i - 1][1] + 0.01, 9);
  });
  it('jede Stufe wird in der Mitte und an beiden Rändern getroffen', () => {
    for (let i = 0; i < zeilen.length - 1; i++) {
      const [von, bis, satz] = zeilen[i];
      for (const a of [von, bis, (von + bis) / 2]) {
        // Einkommen so gewählt, dass der Abstand bei 37 000 genau a % ist (auf Hundertstel).
        const me = 37000 * (1 - Math.round(a * 100) / 10000);
        expect([a, frSatz(me, 37000)]).toEqual([a, satz]);
      }
    }
  });
});

describe('K31 FR: Rechnung Einzelperson', () => {
  it('Einkommen 0 = oberste Stufe 65 %: Region 1 CHF 4 438.20, Region 2 CHF 4 087.20', () => {
    expect(ipvFreiburgRechnen({ region: 1, me: 0 }).total).toBeCloseTo(4438.2, 9);
    expect(ipvFreiburgRechnen({ region: 2, me: 0 }).total).toBeCloseTo(4087.2, 9);
    expect(ipvFreiburgRechnen({ region: 1, me: -5000 }).satz).toBe(65);
  });
  it('Handrechnung: 20 000 → Abstand 45.95 % → 49,81 % × 569 × 12 = 3 401.03', () => {
    const r = ipvFreiburgRechnen({ region: 1, me: 20000 });
    expect(r.abstand).toBe(45.95);
    expect(r.satz).toBe(49.81);
    expect(r.total).toBeCloseTo(3401.0268, 4);
  });
  it('an der Grenze: 37 000 kein Anspruch («inférieur à»), 36 999 die unterste Stufe 1 %', () => {
    expect(ipvFreiburgRechnen({ region: 1, me: 37000 })).toMatchObject({ satz: null, total: 0 });
    // Abstand 0,0027 % → gerundet 0,00 — unter der ersten Tabellenzeile. GEWÄHLT nach dem
    // Mémento-Text: «réduction minimale de 1% … de moins de 1.03% inférieur à la limite».
    expect(ipvFreiburgRechnen({ region: 1, me: 36999 })).toMatchObject({ satz: 1 });
    expect(ipvFreiburgRechnen({ region: 1, me: 36999 }).total).toBeCloseTo(68.28, 9);
  });
  it('an der obersten Kante: 60,00 % Abstand → 63,92 %, 60,01 % → 65 %', () => {
    expect(ipvFreiburgRechnen({ region: 1, me: 14800 }).satz).toBe(63.92);
    expect(ipvFreiburgRechnen({ region: 1, me: 14796 }).satz).toBe(65);
  });
  it('GEWÄHLT: der Abstand wird kaufmännisch auf Hundertstel gerundet, nicht abgeschnitten', () => {
    // 1,026 % → 1,03 → Stufe 2,08 % (abgeschnitten wären es 1,02 → 1 %).
    const me = 37000 * (1 - 0.01026);
    expect(frAbstand(me, 37000)).toBe(1.03);
    expect(frSatz(me, 37000)).toBe(2.08);
  });
});

describe('K31 FR: Kinder Art. 6 al. 2 [1]', () => {
  it('Handrechnung: ein Kind, 40 000 → Grenze 57 400, Abstand 30.31 %, 32,46 % / 80 %', () => {
    const r = ipvFreiburgRechnen({ region: 1, kinderZahl: 1, me: 40000 });
    expect(r).toMatchObject({ grenze: 57400, abstand: 30.31, satz: 32.46, kinderSatz: 80 });
    expect(r.total).toBeCloseTo(0.3246 * 569 * 12 + 0.8 * 136 * 12, 9);
  });
  it('über der Grenze auch für Kinder nichts — die 80 % gelten nur im Kreis der Berechtigten', () => {
    expect(ipvFreiburgRechnen({ region: 1, kinderZahl: 1, me: 57400 })).toMatchObject({ total: 0, anteilKind: 0 });
  });
});

describe('K31 FR: Prämienregionen gegen die Bezirke [3] Ziff. 8.1', () => {
  // Die 25 Gemeinden des Saanebezirks nach dem Amtlichen Gemeindeverzeichnis des BFS, Stand
  // 01.01.2026 (abgerufen 28.09.2026). Region 1 = «district de la Sarine», alle übrigen Region 2.
  const SAANE = ['Autigny', 'Avry', 'Belfaux', 'Chénens', 'Corminboeuf', 'Cottens (FR)', 'Ferpicloz',
    'Fribourg', 'Givisiez', 'Granges-Paccot', 'Marly', 'Matran', 'Neyruz (FR)', 'Pierrafortscha',
    'Le Mouret', 'Treyvaux', 'Villars-sur-Glâne', 'Villarsel-sur-Marly', 'Hauterive (FR)',
    'La Brillaz', 'La Sonnaz', 'Gibloux', 'Prez', "Bois-d'Amont", 'Grolley-Ponthaux'];

  it('jede Freiburger Gemeinde der App liegt in der Region ihres Bezirks', async () => {
    const plz = await import('../../data/plzGemeinde.js');
    const gemeinden = new Map();
    for (const p of plz.allPLZ()) for (const g of plz.lookupPLZ(p)) if (g.kanton === 'FR') gemeinden.set(g.bfsNr, g.gemeinde);
    expect(gemeinden.size).toBeGreaterThan(110);
    const genannt = new Set();
    // Staatswald Galm (BFS 2391) ist gemeindefreies Gebiet (Staatswald, keine Wohnbevölkerung) und
    // hat keine BAG-Region — dort bleibt die App bei «Gemeinde unklar», keine Zahl.
    gemeinden.delete('2391');
    expect(frRegion(2391)).toBe(null);
    for (const [bfs, name] of gemeinden) {
      const soll = SAANE.includes(name) ? 1 : 2;
      if (soll === 1) genannt.add(name);
      expect([name, frRegion(bfs)]).toEqual([name, soll]);
    }
    expect(genannt.size).toBe(SAANE.length);
  });
  it('Fétigny-Ménières (Fusion 2026, BFS 2056) steht ausdrücklich in Region 2', () => {
    expect(frRegion(2056)).toBe(2);
    expect(frRegion(99999)).toBe(null);
  });
});

describe('K31 calculateIPV für FR (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../../data/plzGemeinde.js');
    await import('../ipvFreiburg.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, plz = '1700', city = 'Fribourg', children = [], dob = '1980-05-01', kkPremium = 450, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'FR', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: plz, city },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('belegt, mit Quelle; keine Musterwerte in der Kantonszeile', () => {
    expect(CANTONAL_IPV.FR.beleg.quelle).toMatch(/842\.1\.13/);
    expect(CANTONAL_IPV.FR.maxIncome).toBe(null);
    expect(CANTONAL_IPV.FR.subsidySingle).toBe(null);
    expect(CANTONAL_IPV.FR.subsidyFamily).toBe(null);
    expect(CANTONAL_IPV.FR.subsidyChild).toBe(null);
  });

  it('vor dem Laden: Orientierung «laden», nie ein Betrag', async () => {
    vi.resetModules();
    const frisch = await import('../cantonalData.js');
    expect(frisch.calculateIPV(person({ monthlyIncome: 20000 / 12 }))).toMatchObject({ belegt: false, amount: null, offen: 'laden' });
  });

  it('Stadt Freiburg, 20 000 im Jahr: 3 401 (Region 1, Grenze 37 000 publiziert)', () => {
    const r = calculateIPV(person({ monthlyIncome: 20000 / 12 }));
    expect(r).toMatchObject({ belegt: true, eligible: true, annual: 3401, amount: 283, region: 1, jahr: 2026, basisjahr: 2024, vorbehaltKey: 'ipv.vorbehaltFR' });
    expect(r.cantonData.maxIncome).toBe(37000);
  });

  it('Einkommen 0: oberste Stufe; Region 2 (Bulle) tiefer', () => {
    expect(calculateIPV(person({}))).toMatchObject({ annual: 4438, maxAnnual: 4438 });
    expect(calculateIPV(person({ plz: '1630', city: 'Bulle' }))).toMatchObject({ annual: 4087, region: 2 });
  });

  it('PLZ mit Gemeinden in zwei Regionen ohne Ort: keine Zahl; mit Ort: die richtige', () => {
    expect(calculateIPV(person({ city: '' }))).toMatchObject({ belegt: false, amount: null, offen: 'region' });
    expect(calculateIPV(person({ city: 'Düdingen' }))).toMatchObject({ region: 2 });
  });

  it('Fétigny-Ménières (PLZ 1532): rechnet in Region 2 statt still keine Zahl', () => {
    expect(calculateIPV(person({ plz: '1532', city: '' }))).toMatchObject({ belegt: true, region: 2, annual: 4087 });
  });

  it('Art. 6 al. 4 [1]: höchstens die Nettoprämie — ohne erfasste Prämie keine Zahl', () => {
    expect(calculateIPV(person({ kkPremium: 200 }))).toMatchObject({ annual: 2400, maxAnnual: 2400 });
    expect(calculateIPV(person({ kkPremium: null }))).toMatchObject({ belegt: false, amount: null, offen: 'praemie' });
  });

  it('mit einem Kind (5 Jahre), 40 000: 32,46 % + Kind 80 %, Grenze 57 400', () => {
    const r = calculateIPV(person({ monthlyIncome: 40000 / 12, children: [{ age: 5 }] }));
    expect(r).toMatchObject({ eligible: true, annual: Math.round(0.3246 * 569 * 12 + 0.8 * 136 * 12), region: 1 });
    expect(r.cantonData.maxIncome).toBe(57400);
    // Vergleichsgrösse: oberste Stufe 65 % × 569 × 12 + 80 % × 136 × 12 = 4 438.20 + 1 305.60
    expect(r.maxAnnual).toBe(5744);
  });

  it('der Kinderanteil ist nicht an die Prämie der erwachsenen Person gedeckelt', () => {
    const r = calculateIPV(person({ monthlyIncome: 40000 / 12, children: [{ age: 5 }], kkPremium: 10 }));
    expect(r.annual).toBe(Math.round(120 + 0.8 * 136 * 12));
  });

  it('5 % des Vermögens zählen zum Einkommen; über 250 000 keine Zahl', () => {
    // 20 000 + 5 % × 100 000 = 25 000 → Abstand 32,43 % → 34,63 % × 569 × 12 = 2 364.54
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { savingsAccount: 100000 } })).annual).toBe(2365);
    expect(calculateIPV(person({ finanzen: { savingsAccount: 250000 } })).belegt).toBe(true);
    expect(calculateIPV(person({ finanzen: { savingsAccount: 250001 } }))).toMatchObject({ offen: 'vermoegen' });
  });

  it('Säule 3a: wird aufgerechnet (Art. 5 al. 1 lit. a Ziff. 1, Code 4.130) — und steckt schon im Nettoeinkommen', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 0 } })).annual;
    const mit = calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 7258 } })).annual;
    expect(mit).toBe(ohne);
  });

  it('über der Grenze: kein Anspruch mit der publizierten Grenze', () => {
    expect(calculateIPV(person({ monthlyIncome: 37000 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.frKeinAnspruch', noteParams: { value: 37000 } });
  });

  it('Art. 4 al. 1 lit. a: über 150 000 Nettoeinkommen kein Anspruch — auch mit acht Kindern', () => {
    const acht = Array.from({ length: 8 }, () => ({ age: 5 }));
    // Grenze 43 400 + 8 × 14 000 = 155 400 läge darüber; der Ausschluss greift vorher.
    expect(calculateIPV(person({ monthlyIncome: 152000 / 12, children: acht }))).toMatchObject({ eligible: false, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: 150000 } });
    expect(calculateIPV(person({ monthlyIncome: 149000 / 12, children: acht }))).toMatchObject({ eligible: true });
  });

  it('negatives Einkommen: keine Zahl statt der obersten Stufe', () => {
    expect(calculateIPV(person({ monthlyIncome: -500 }))).toMatchObject({ belegt: false, offen: 'einkommenNegativ' });
  });

  // ORP Art. 3 al. 3 lit. b/c: «jusqu'à l'année de ses 25 ans»; Mémento 8.1 «19 à 25 ans».
  // ⟨gedreht 28.09.2026, Fachprüfung W4: vorher `mangelsStichtag`, Jahrgang 2000 ohne Zahl.⟩
  it('Alter nach Jahrgang (ORP Art. 3 al. 3): 2000 ist 2026 erwachsen, 2001 nicht', () => {
    expect(calculateIPV(person({ dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ dob: '2001-01-01' }))).toMatchObject({ belegt: false, offen: 'alter' });
    expect(calculateIPV(person({ dob: '' }))).toMatchObject({ offen: 'alter' });
  });

  it('Kinder: nur ganzjährig minderjährige (Art. 3 al. 3 lit. a); wer 2026 18 wird, keine Zahl', () => {
    expect(calculateIPV(person({ children: [{ birthDate: '2009-01-01' }] })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ birthDate: '2008-12-31' }] }))).toMatchObject({ offen: 'kindVolljaehrig' });
    // Eingetipptes Alter zählt im Anspruchsjahr eins mehr: 17 ist 2026 vielleicht schon 18.
    expect(calculateIPV(person({ children: [{ age: 17 }] }))).toMatchObject({ offen: 'kindVolljaehrig' });
    expect(calculateIPV(person({ children: [{ age: 16 }] })).belegt).toBe(true);
  });

  it('Kinder über 18, Kinder ohne Alter, Paare, Konkubinat: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ children: [{ age: 19 }] }))).toMatchObject({ offen: 'kindVolljaehrig' });
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { household: { adults: 2, children: [] } } }))).toMatchObject({ offen: 'haushalt' });
  });

  describe('Frist Art. 2 al. 1 [1] und Jahres-Riegel', () => {
    it('bis 31.08.2026: die Frist läuft', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-08-31T12:00:00'));
      const r = calculateIPV(person({}));
      expect(r).toMatchObject({ noteKey: 'ipv.frFristLaeuft', noteParams: { jahr: 2026, folgejahr: 2027 }, anmeldefristVorbei: false });
    });
    it('ab 01.09.2026: vorbei — nirgends abgezogen, mit dem Freiburger Hinweis', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-09-01T08:00:00'));
      expect(calculateIPV(person({}))).toMatchObject({ noteKey: 'ipv.frFristVorbei', anmeldefristVorbei: true, fristNichtAbgezogenKey: 'ipv.frFristNichtAbgezogen' });
    });
    it('ab 2027 keine Zahl mehr, bis die Werte nachgeführt sind', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person({}))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });
});
