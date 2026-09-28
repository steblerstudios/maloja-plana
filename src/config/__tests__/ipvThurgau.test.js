import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_TG, ipvThurgauRechnen } from '../ipvThurgau.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Thurgau 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt TG:
//   [1] TG KVV, RB 832.10, in Kraft seit 01.01.2026 (Rechtsbuch-Version 3027) — §§ 14, 15
//   [2] Amt für Gesundheit TG, Information zur Prämienverbilligung 2026 (PDF vom 16.12.2025)
// TG knüpft an die einfache Steuer zu 100 % an, die die App nicht kennt: der Kanton ist belegt
// und zeigt bewusst keine Zahl. Die Rechnung selbst wird gegen die amtliche Tabelle [2] geprüft.

describe('K31 TG: Konstanten wörtlich aus § 14 Abs. 1 [1] und der Tabelle [2]', () => {
  it('Erwachsene Kat. A–C (Ziff. 1–3)', () => {
    expect(IPV_TG.erwachsene).toEqual([
      { kat: 'A', bisSteuer: 400, betrag: 3408 },
      { kat: 'B', bisSteuer: 600, betrag: 2556 },
      { kat: 'C', bisSteuer: 800, betrag: 1704 },
    ]);
  });
  it('Kinder Kat. D (Ziff. 5), ohne steuerbares Vermögen, Jahr 2026, Basis Vorjahr', () => {
    expect(IPV_TG.kinder).toEqual({ kat: 'D', bisSteuer: 1600, betrag: 1236 });
    expect(IPV_TG.vermoegenGrenze).toBe(0);
    expect(IPV_TG.jahr).toBe(2026);
    expect(IPV_TG.basisjahrAbstand).toBe(1);
  });
});

describe('K31 TG: die Rechnung nach § 14 [1] — jede Zeile der Tabelle [2], Grenzen von beiden Seiten', () => {
  const r = (einfacheSteuer, steuerbaresVermoegen = 0, kinderZahl = 0) => ipvThurgauRechnen({ einfacheSteuer, steuerbaresVermoegen, kinderZahl });
  it('Steuer 0 = oberste Stufe, 3 408', () => {
    expect(r(0)).toMatchObject({ total: 3408, kategorie: 'A' });
  });
  it('«bis zum Steuerbetrag von Fr. 400»: 400 noch A, 400.05 schon B', () => {
    expect(r(400).total).toBe(3408);
    expect(r(400.05)).toMatchObject({ total: 2556, kategorie: 'B' });
    expect(r(600).total).toBe(2556);
    expect(r(600.05)).toMatchObject({ total: 1704, kategorie: 'C' });
    expect(r(800).total).toBe(1704);
    expect(r(800.05)).toMatchObject({ total: 0, kategorie: null });
  });
  it('schon ein Franken steuerbares Vermögen schliesst aus — auch die Kinder', () => {
    expect(r(0, 1, 2)).toMatchObject({ total: 0, erwachsen: 0, kinder: 0 });
  });
  it('Kinder bis zur einfachen Steuer der Eltern von 1 600 — auch wenn die Eltern selbst nichts erhalten', () => {
    expect(r(300, 0, 2)).toMatchObject({ total: 3408 + 2 * 1236, kinder: 2472 });
    expect(r(1600, 0, 1)).toMatchObject({ total: 1236, erwachsen: 0, kinder: 1236 });
    expect(r(1600.05, 0, 1)).toMatchObject({ total: 0, kindGilt: false });
  });
});

describe('K31 calculateIPV für TG — belegt, zeigt bewusst keine Zahl', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvThurgau.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = (extra = {}) => ({
    basis: { canton: 'TG', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
    finanzen: { monthlyIncome: extra.monthlyIncome ?? 0, ...(extra.finanzen || {}) },
    wohnen: { postalCode: '8500', city: 'Frauenfeld' },
    versicherungen: extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium ?? 400 },
  });

  it('Register und Beleg: Modul ohne PLZ, Quelle genannt, keine Musterwerte, Stelle = Gemeinde', () => {
    expect(IPV_MODULE.TG).toMatchObject({ fn: 'ipvThurgau', brauchtPLZ: false });
    expect(CANTONAL_IPV.TG.beleg.quelle).toMatch(/RB 832\.10/);
    for (const k of ['maxIncome', 'subsidySingle', 'subsidyFamily', 'subsidyChild']) expect(CANTONAL_IPV.TG[k]).toBe(null);
    expect(CANTONAL_IPV.TG.noteKey).toBe('ipv.noteApplyKkKontrollstelle');
    expect(CANTONAL_IPV.TG.noteParams).toBeUndefined();
  });

  it('in jeder Lage keine Zahl, sondern der Grund «tgSteuerbetrag» — tief, hoch, mit Kindern, mit Vermögen, Paar', () => {
    const faelle = [
      person(), person({ monthlyIncome: 1500 }), person({ monthlyIncome: 9000 }),
      person({ children: [{ age: 4 }] }), person({ finanzen: { savingsAccount: 50000 } }),
      { ...person(), basis: { ...person().basis, maritalStatus: 'married', household: { adults: 2, children: [] } } },
    ];
    for (const d of faelle) {
      const r = calculateIPV(d);
      expect(r).toMatchObject({ belegt: false, eligible: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'tgSteuerbetrag' });
      expect(r.annual).toBeUndefined();
      expect(r.cantonData).toBeUndefined();
    }
  });

  it('«prüfenswert» hängt nur an der erfassten Prämie', () => {
    expect(calculateIPV(person()).anspruchMoeglich).toBe(true);
    expect(calculateIPV(person({ kkPremium: null })).anspruchMoeglich).toBe(false);
  });

  it('ab 2027: Grund «jahr» (der Grund-Text nennt die Beträge 2026)', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
    expect(calculateIPV(person())).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
  });
});
