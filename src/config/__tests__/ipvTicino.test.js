import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_TI, ipvTicinoRechnen, tiRdmOhneKinder, tiVerfuegbaresEinkommen } from '../ipvTicino.js';
import { calculateIPV, CANTONAL_IPV, IPV_MODULE, preloadPLZ } from '../cantonalData.js';

// K31 — Prämienverbilligung (RIPAM) Kanton Tessin 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt TI:
//   [1] LCAMal RL 853.100, stato 1° gennaio 2026 — Art. 25, 27, 31, 32a, 34, 35, 37, 43a
//   [2] Decreto esecutivo RL 853.310 (19.11.2025) — Art. 1 (IC 2023), Art. 2 (PMR)
//   [3] RLCAMal RL 853.110 — Art. 11, 17, 18, 21
//   [4] Decreto esecutivo RL 870.130 (25.09.2024) — Art. 1 (soglia d'intervento 2025/2026)
//   [5] IAS, Istruzioni RIPAM 2026 (Dicembre 2025)
// Ein amtliches Berechnungsbeispiel gibt es nicht; das IAS verweist auf seinen Rechner, den die
// App NICHT füttert. Prüfstein sind Handrechnungen am Wortlaut von Art. 31, 32a, 35, 37 [1].

describe('K31 calculateIPV für TI, bevor das TI-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'TI', dateOfBirth: '1980-05-01' }, finanzen: {} });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 TI: Konstanten wörtlich', () => {
  it('PMR 2026 [2] Art. 2, Basis IC 2023 [2] Art. 1, Jahr 2026', () => {
    expect(IPV_TI.pmr).toEqual({ e: 8016, j: 6143, k: 1827 });
    expect(IPV_TI.basisjahr).toBe(2023);
    expect(IPV_TI.jahr).toBe(2026);
  });
  it('Konstanten Art. 32a [1], Koeffizient Art. 37 Abs. 2 [1], Anteil Vermögen Art. 31 lit. b [1]', () => {
    expect(IPV_TI.konstanteOhneKinder).toBe(3.8);
    expect(IPV_TI.konstanteMitKindern).toBe(4.7);
    expect(IPV_TI.anteilFabbisogno).toBe(0.5);
    expect(IPV_TI.koeffizient).toBe(0.765);
    expect(IPV_TI.sostanzaAnteil).toBe(1 / 15);
  });
  it('Bedarfsgrenze 2025/2026 [4] Art. 1 lit. a–e', () => {
    expect(IPV_TI.limiteFabbisogno).toEqual([18709, 9215, 6869, 5253, 5233]);
  });
  it('Berufsauslagen höchstens 4 000 [1] lit. f/[5], Mindestbetrag 120 [3] Art. 21, Besitzstand Art. 43a [1], Alter 30 Art. 27 [1]', () => {
    expect(IPV_TI.berufsauslagenMax).toBe(4000);
    expect(IPV_TI.mindestbetrag).toBe(120);
    expect(IPV_TI.besitzstand).toEqual({ pmr2014: { e: 4965, j: 4594, k: 1156 }, bisHalbe: 0.735, bisGanze: 0.70 });
    expect(IPV_TI.abhaengigBisAlter).toBe(30);
  });
});

describe('K31 TI: RDM, RD und die Formel — Handrechnungen', () => {
  it('RDM Einzelperson = 3,8 × 50 % × 18 709 = 35 547.10', () => {
    const { rdm, limite } = tiRdmOhneKinder(1);
    expect(rdm).toBeCloseTo(35547.1, 9);
    expect(limite).toBe(18709);
    expect(tiRdmOhneKinder(2).rdm).toBeCloseTo(3.8 * 0.5 * (18709 + 9215), 9);
  });
  it('RD = Einkommen + 1/15 Vermögen − PMR − Alimente − Berufsauslagen − Schuldzinsen (max. 3 000), nie unter 0', () => {
    expect(tiVerfuegbaresEinkommen({ einkommenNachSozialabzuegen: 36000, sostanza: 30000, pmr: 8016, berufsauslagen: 4000 })).toBe(25984);
    expect(tiVerfuegbaresEinkommen({ einkommenNachSozialabzuegen: 36000, pmr: 8016, schuldzinsen: 5000 })).toBe(24984);
    expect(tiVerfuegbaresEinkommen({ einkommenNachSozialabzuegen: 5000, pmr: 8016 })).toBe(0);
    expect(tiVerfuegbaresEinkommen({ einkommenNachSozialabzuegen: 36000, sostanza: -30000, pmr: 8016 })).toBe(27984);
  });
  const rech = (rd) => ipvTicinoRechnen({ rd, rdm: 35547.1, limite: 18709, pmrSumme: 8016, pmr2014Summe: 4965 });
  it('RD 0: 8 016 × 76,5 % = 6 132.24 (Höchstbetrag)', () => {
    expect(rech(0).total).toBeCloseTo(6132.24, 9);
    expect(rech(0).maximal).toBeCloseTo(6132.24, 9);
  });
  it('RD = RDM/2: Normbetrag 8 016 × 3/4 = 6 012, effektiv 4 599.18', () => {
    const r = rech(35547.1 / 2);
    expect(r.normativ).toBeCloseTo(6012, 6);
    expect(r.total).toBeCloseTo(4599.18, 6);
  });
  it('RD 23 984: 8 016 − 8 016 × 23 984² / 35 547.1² = 4 366.84 → × 76,5 % = 3 340.63', () => {
    expect(rech(23984).normativ).toBeCloseTo(4366.8427, 3);
    expect(rech(23984).total).toBeCloseTo(3340.6346, 3);
  });
  it('der Abbau ist quadratisch: die zweiten 5 000 kosten mehr als die ersten', () => {
    expect(rech(5000).total - rech(10000).total).toBeGreaterThan(rech(0).total - rech(5000).total);
  });
  it('Nullpunkt RD = RDM → 0 (Grund «ueberGrenze»); knapp darunter Grund «mindestbetrag»', () => {
    expect(rech(35547.1)).toMatchObject({ total: 0, grund: 'ueberGrenze' });
    expect(rech(40000)).toMatchObject({ total: 0, grund: 'ueberGrenze' });
    const band = rech(35284);
    expect(band.total).toBeCloseTo(90.439, 2);
    expect(band.grund).toBe('mindestbetrag');
  });
  it('Besitzstand Art. 43a [1] bindet für Einzelpersonen nicht (Formel liegt immer darüber)', () => {
    for (const rd of [0, 5000, 9354.5, 12000, 18709]) {
      const r = rech(rd);
      expect(r.effektiv).toBeGreaterThan(r.besitzstand);
      expect(r.total).toBe(r.effektiv);
    }
    expect(rech(9354.5).besitzstand).toBeCloseTo(4965 * 0.735, 9);
    expect(rech(9354.6).besitzstand).toBeCloseTo(4965 * 0.70, 9);
    expect(rech(18710).besitzstand).toBe(0);
  });
});

describe('K31 calculateIPV für TI (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvTicino.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, dob = '1980-05-01', kkPremium = 450, children = [], finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'TI', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: '6900', city: 'Lugano' },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('Register und Beleg: Modul ohne PLZ, Quelle, keine Musterwerte, Stelle IAS', () => {
    expect(IPV_MODULE.TI).toMatchObject({ fn: 'ipvTicino', brauchtPLZ: false });
    expect(CANTONAL_IPV.TI.beleg.quelle).toMatch(/RL 853\.100/);
    for (const k of ['maxIncome', 'subsidySingle', 'subsidyFamily', 'subsidyChild']) expect(CANTONAL_IPV.TI[k]).toBe(null);
    expect(CANTONAL_IPV.TI.noteKey).toBe('ipv.noteApplyIas');
  });

  it('angestellt, 3 000 netto/Monat: RD 23 984 → 3 341/Jahr, 278/Monat', () => {
    const r = calculateIPV(person({ monthlyIncome: 3000 }));
    expect(r).toMatchObject({
      belegt: true, eligible: true, annual: 3341, amount: 278, maxAnnual: 5400,
      basisjahr: 2023, jahr: 2026, vorbehaltKey: 'ipv.vorbehaltTI', jahrKey: 'ipv.jahrTessin',
    });
    expect(r.region).toBeUndefined();
    expect(r.cantonData.maxIncome).toBe(null);
    expect(r.anmeldefristVorbei).toBeUndefined();
  });

  it('Berufsauslagen nur für Angestellte: Rente oder selbständig → ohne Pauschale, 2 332', () => {
    expect(calculateIPV(person({ finanzen: { ahvRente: 3000 } })).annual).toBe(2332);
    expect(calculateIPV(person({ monthlyIncome: 3000, finanzen: { employmentType: 'selfEmployed' } })).annual).toBe(2332);
    expect(calculateIPV(person({ monthlyIncome: 3000, finanzen: { employmentType: 'employed' } })).annual).toBe(3341);
  });

  it('1/15 des Vermögens und bezahlte Alimente', () => {
    expect(calculateIPV(person({ monthlyIncome: 3000, finanzen: { savingsAccount: 30000 } })).annual).toBe(2856);
    expect(calculateIPV(person({ monthlyIncome: 3000, finanzen: { alimentePaid: 500 } })).annual).toBe(4563);
    // erhaltene Alimente zählen zum Einkommen: 2 500 Lohn + 500 Alimente = wie 3 000
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { alimenteReceived: 500 } })).annual)
      .toBe(Math.round(0.765 * (8016 - 8016 * (36000 - 8016 - 4000) ** 2 / 35547.1 ** 2)));
  });

  it('Art. 37 Abs. 3 [1]: höchstens die Prämie — ohne erfasste Prämie keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 3000, kkPremium: 200 }))).toMatchObject({ annual: 2400, maxAnnual: 2400 });
    expect(calculateIPV(person({ monthlyIncome: 3000, kkPremium: null }))).toMatchObject({ belegt: false, amount: null, offen: 'praemie' });
  });

  it('zwei Gründe für «kein Betrag»: über RDM und unter 120 Franken', () => {
    expect(calculateIPV(person({ monthlyIncome: 48000 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.tiKeinAnspruch' });
    expect(calculateIPV(person({ monthlyIncome: 47300 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.tiUnterMindestbetrag' });
  });

  it('Alter nach [5] «adulto: dall’anno seguente al compimento dei 25 anni»: 2000 erwachsen, 2001 nicht', () => {
    expect(calculateIPV(person({ monthlyIncome: 3000, dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 3000, dob: '2001-01-01' }))).toMatchObject({ belegt: false, offen: 'alter' });
  });

  it('Art. 27 [1]: bis 30 und kleines Einkommen — vielleicht UR der Eltern, keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 1000, dob: '1998-01-01' }))).toMatchObject({ belegt: false, offen: 'tiEltern' });
    expect(calculateIPV(person({ monthlyIncome: 1000, dob: '1994-06-01' }))).toMatchObject({ offen: 'tiEltern' });
    // über der Bedarfsgrenze 18 709 oder älter: gerechnet
    expect(calculateIPV(person({ monthlyIncome: 2000, dob: '1998-01-01', kkPremium: 500 }))).toMatchObject({ belegt: true, annual: 5435 });
    // 12 000 − 8 016 − 4 000 < 0 → RD 0 → 6 132.24, gedeckelt auf die Prämie 5 400
    expect(calculateIPV(person({ monthlyIncome: 1000, dob: '1993-12-31' }))).toMatchObject({ belegt: true, annual: 5400 });
  });

  it('Kinder, Paare, Konkubinat, negatives Einkommen: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ monthlyIncome: 3000, children: [{ age: 5 }] }))).toMatchObject({ belegt: false, offen: 'tiKinder' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: -500 }))).toMatchObject({ offen: 'einkommenNegativ' });
  });

  describe('Frist Art. 25 [1] und Jahres-Riegel', () => {
    it('bis 31.12. des Vorjahres: Frist läuft', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2025-12-15T12:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 3000 }))).toMatchObject({ noteKey: 'ipv.tiFristLaeuft', noteParams: { jahr: 2026, vorjahr: 2025, folgejahr: 2027 } });
    });
    it('im Anspruchsjahr: Frist für Januar vorbei, Betrag bleibt', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-09-28T12:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 3000 }))).toMatchObject({ annual: 3341, noteKey: 'ipv.tiFristVorbei' });
    });
    it('ab 2027 keine Zahl mehr', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 3000 }))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });
});
