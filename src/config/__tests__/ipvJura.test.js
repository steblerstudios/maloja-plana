import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_JU, ipvJuraRechnen, juStufe, juMassgebend } from '../ipvJura.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Jura 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt JU:
//   [1] Arrêté RSJU 832.115.1 du 28 octobre 2025 (2026), Annexe 1/2 — Seitenbild geprüft
//   [2] Ordonnance RSJU 832.115, valable dès 01.01.2026
//   [3] ECAS, RPI Informations générales 2026
// Die App zeigt für JU bewusst KEINE Zahl (steuerbares Einkommen fehlt ihr). Geprüft wird hier:
// die Tabelle zeichengleich (damit die Rechnung beim Produktentscheid steht) und dass jede Lage
// in einer Orientierung mit Grund endet — nie in einem Betrag.

describe('K31 JU: Annexe 1 [1] — zeichengleich', () => {
  // Textlayer der Tabellenseite, Spalten «mensuel»: Adultes · < 25 · < 25 en formation ·
  // Mineurs 16–18 sans formation · Enfants < 18. Zeilen «de 0 à 999» bis «de 26'000 à 26'999».
  const WORTLAUT = `
225.00 160.00 196.00 45.00 100.00
215.00 155.00 196.00 45.00 100.00
205.00 150.00 196.00 45.00 100.00
195.00 145.00 196.00 45.00 100.00
185.00 140.00 196.00 40.00 100.00
175.00 135.00 196.00 40.00 100.00
165.00 130.00 196.00 40.00 100.00
155.00 125.00 196.00 35.00 100.00
145.00 120.00 196.00 35.00 100.00
125.00 110.00 196.00 35.00 100.00
110.00 100.00 196.00 30.00 100.00
100.00 90.00 196.00 30.00 100.00
95.00 85.00 196.00 30.00 100.00
90.00 80.00 196.00 25.00 100.00
85.00 75.00 196.00 25.00 100.00
75.00 70.00 196.00 25.00 100.00
70.00 65.00 196.00 20.00 100.00
65.00 60.00 196.00 20.00 100.00
60.00 55.00 196.00 20.00 100.00
55.00 50.00 196.00 15.00 100.00
45.00 45.00 196.00 15.00 100.00
40.00 40.00 196.00 15.00 100.00
35.00 35.00 196.00 10.00 100.00
30.00 30.00 196.00 10.00 100.00
25.00 25.00 196.00 10.00 100.00
20.00 20.00 196.00 10.00 100.00
15.00 15.00 196.00 10.00 100.00`;
  const zeilen = WORTLAUT.trim().split('\n').map((z) => z.split(' ').map(Number));

  it('27 Stufen mit Anspruch für Erwachsene, jede Spalte wie in der Tabelle', () => {
    expect(IPV_JU.erwachsene).toEqual(zeilen.map((z) => z[0]));
    expect(IPV_JU.jungeErwachsene).toEqual(zeilen.map((z) => z[1]));
    expect(zeilen.every((z) => z[2] === IPV_JU.jungeInAusbildung)).toBe(true);
    expect(IPV_JU.minderjaehrigOhneAusbildung).toEqual(zeilen.map((z) => z[3]));
    expect(zeilen.every((z) => z[4] === IPV_JU.kind)).toBe(true);
  });
  it('Art. 2 Abs. 2 [1]: Höchstbeträge 225 / 160 / 196 / 45 / 100', () => {
    expect([IPV_JU.erwachsene[0], IPV_JU.jungeErwachsene[0], IPV_JU.jungeInAusbildung, IPV_JU.minderjaehrigOhneAusbildung[0], IPV_JU.kind]).toEqual([225, 160, 196, 45, 100]);
  });
  it('Annexe 2 [1]: Familienzuschlag 300 … 15, ab 18 000 null', () => {
    expect(IPV_JU.familienzuschlag).toEqual([300, 300, 300, 300, 285, 265, 235, 205, 175, 145, 115, 105, 95, 85, 70, 55, 25, 15]);
  });
  it('übrige Konstanten aus [1] und [2]', () => {
    expect(IPV_JU.jahr).toBe(2026);
    expect(IPV_JU.basisjahr).toBe(2024);
    expect(IPV_JU.grenze).toEqual({ erwachsene: 27000, kinder: 53000 });
    expect(IPV_JU.abzug).toEqual({ ohneKindVerheiratetEtc: 5000, mitKind: 10000, kind12: 4000, kindAb3: 6000 });
    expect(IPV_JU.vermoegenAnteil).toBe(0.05);
    expect(IPV_JU.vermoegensgrenze).toBe(150000);
  });
});

describe('K31 JU: die Rechnung (für den Tag, an dem das steuerbare Einkommen da ist)', () => {
  it('Stufen in Tausendern, unter 0 wie 0', () => {
    expect([juStufe(-500), juStufe(0), juStufe(999), juStufe(1000), juStufe(26999), juStufe(27000)]).toEqual([0, 0, 0, 1, 26, 27]);
  });
  it('Erwachsene: 225 bis 999, 15 bis 26 999, ab 27 000 nichts', () => {
    expect(ipvJuraRechnen({ revenuDeterminant: 999 }).monat).toBe(225);
    expect(ipvJuraRechnen({ revenuDeterminant: 9000 }).monat).toBe(125);
    expect(ipvJuraRechnen({ revenuDeterminant: 26999 }).monat).toBe(15);
    expect(ipvJuraRechnen({ revenuDeterminant: 27000 }).monat).toBe(0);
  });
  it('Kinder: 100 bis 52 999, ab 53 000 nichts', () => {
    expect(ipvJuraRechnen({ revenuDeterminant: 52999, kinderZahl: 2 }).monat).toBe(200);
    expect(ipvJuraRechnen({ revenuDeterminant: 53000, kinderZahl: 2 }).monat).toBe(0);
  });
  it('Familienzuschlag nur mit Kind UND Erwerb, bis 17 999', () => {
    expect(ipvJuraRechnen({ revenuDeterminant: 4500, kinderZahl: 1, erwerb: true }).monat).toBe(185 + 285 + 100);
    expect(ipvJuraRechnen({ revenuDeterminant: 4500, kinderZahl: 1, erwerb: false }).zuschlag).toBe(0);
    expect(ipvJuraRechnen({ revenuDeterminant: 4500, erwerb: true }).zuschlag).toBe(0);
    expect(ipvJuraRechnen({ revenuDeterminant: 18000, kinderZahl: 1, erwerb: true }).zuschlag).toBe(0);
  });
  it('Art. 1 Abs. 5/6 [1]: Abzüge und 5 % Vermögen — Ledige ohne Kind ohne Abzug', () => {
    expect(juMassgebend({ revenuImposable: 20000 })).toBe(20000);
    expect(juMassgebend({ revenuImposable: 20000, ledig: false })).toBe(15000);
    expect(juMassgebend({ revenuImposable: 40000, kinderZahl: 3 })).toBe(40000 - 10000 - 4000 - 4000 - 6000);
    expect(juMassgebend({ revenuImposable: 20000, aufrechnungen: 3000, fortuneImposable: 40000 })).toBe(25000);
  });
});

describe('K31 calculateIPV für JU: bewusst keine Zahl, mit Grund', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../../data/plzGemeinde.js');
    await import('../ipvJura.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 2000, children = [], dob = '1980-05-01', finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'JU', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: '2800', city: 'Delémont' },
    versicherungen: { kkPremium: 400 },
  });

  it('belegt, mit Quelle; Register ohne PLZ-Wartezeit; keine Musterwerte', () => {
    expect(CANTONAL_IPV.JU.beleg.quelle).toMatch(/832\.115\.1/);
    for (const k of ['maxIncome', 'subsidySingle', 'subsidyFamily', 'subsidyChild']) expect(CANTONAL_IPV.JU[k]).toBe(null);
    expect(IPV_MODULE.JU.brauchtPLZ).toBe(false);
  });

  it('jedes Einkommen: keine Zahl, Grund «steuerbaresEinkommen» — auch Einkommen 0', () => {
    for (const m of [0, 500, 1500, 2500, 4000, 8000]) {
      const r = calculateIPV(person({ monthlyIncome: m }));
      expect(r).toMatchObject({ belegt: false, eligible: false, amount: null, offen: 'steuerbaresEinkommen' });
      expect(r.cantonData).toBeUndefined();
    }
  });

  it('mit Kindern ebenso', () => {
    expect(calculateIPV(person({ children: [{ age: 4 }, { age: 9 }] }))).toMatchObject({ amount: null, offen: 'steuerbaresEinkommen' });
  });

  it('die Riegel davor sagen ihren eigenen Grund', () => {
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ dob: '2003-01-01' }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ children: [{ age: 19 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ finanzen: { securitiesValue: 150001 } }))).toMatchObject({ offen: 'vermoegen' });
    expect(calculateIPV(person({ finanzen: { securitiesValue: 150000 } }))).toMatchObject({ offen: 'steuerbaresEinkommen' });
  });

  it('ab 2027: Grund «jahr»', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
    expect(calculateIPV(person({}))).toMatchObject({ amount: null, offen: 'jahr' });
  });
});
