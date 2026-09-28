import { describe, it, expect } from 'vitest';
import { darlehenVorschlag, betreibungsHinweis, rateAusBudget } from '../schuldenAusProfil.js';

describe('darlehenVorschlag — «Persönliche Darlehen» nicht nochmals eintippen', () => {
  it('leere Liste + Darlehen im Profil → Kredit-Vorschlag', () => {
    expect(darlehenVorschlag({ finanzen: { loans: '12000.4' } }, [])).toEqual({ amount: '12000', category: 'kredit' });
    expect(darlehenVorschlag({ finanzen: { loans: 5000 } }, undefined)).toEqual({ amount: '5000', category: 'kredit' });
  });
  it('schon eine Schuld erfasst → kein Vorschlag (sonst doppelt)', () => {
    expect(darlehenVorschlag({ finanzen: { loans: 5000 } }, [{ id: 1 }])).toBeNull();
  });
  it.each([undefined, '', 0, -10, 'abc'])('Darlehen %j → kein Vorschlag', (loans) => {
    expect(darlehenVorschlag({ finanzen: { loans } }, [])).toBeNull();
  });
});

describe('betreibungsHinweis — Registerstand nur als Hinweis, nie automatisch', () => {
  const eintrag = { creditor: 'Inkasso AG', amount: 0, status: 'active' };
  it.each([undefined, '', 'unknown', 'none'])('Status %j + erfasste Betreibung → Hinweis', (status) => {
    expect(betreibungsHinweis(status, [eintrag])).toBe(true);
  });
  it('«Einträge vorhanden» schon festgehalten → kein Hinweis', () => {
    expect(betreibungsHinweis('entries', [eintrag])).toBe(false);
  });
  it('auch eine bezahlte Betreibung → Hinweis (der Rückzug ist nicht erfasst)', () => {
    expect(betreibungsHinweis('', [{ creditor: '', amount: 800, status: 'paid' }])).toBe(true);
  });
  it('eben angelegter, leerer Eintrag → noch kein Hinweis', () => {
    expect(betreibungsHinweis('', [{ creditor: '  ', amount: 0, status: 'active' }])).toBe(false);
    expect(betreibungsHinweis('', [])).toBe(false);
  });
});

describe('rateAusBudget — Vorschlag für den Abbau-Plan (27.09.2026)', () => {
  const basis = {
    finanzen: { monthlyIncome: 5000, incomeType: 'netto', groceries: 600, debtPayments: 300 },
    wohnen: { rentAmount: 1800 },
    versicherungen: { kkPremium: 450 },
  };
  it('Einnahmen minus Ausgaben ohne heutige Schuldenraten, auf 10 abgerundet', () => {
    const r = rateAusBudget(basis);
    expect(r.grund).toBe('ok');
    expect(r.ausgaben).toBe(2850); // 1800 + 450 + 600, die 300 Schuldenraten zählen nicht als Ausgabe
    expect(r.vorschlag).toBe(2150);
    expect(r.steuerFehlt).toBe(true); // keine Steuer erfasst → Hinweis
    expect(r.heutigeRaten).toBe(300);
    expect(rateAusBudget({ ...basis, finanzen: { ...basis.finanzen, monthlyIncome: 5005.5 } }).vorschlag).toBe(2150);
  });
  it('nur netto: brutto oder ohne Angabe → kein Vorschlag', () => {
    expect(rateAusBudget({ ...basis, finanzen: { ...basis.finanzen, incomeType: 'brutto' } }).grund).toBe('keinNetto');
    expect(rateAusBudget({ ...basis, finanzen: { ...basis.finanzen, incomeType: '' } }).grund).toBe('keinNetto');
  });
  // Seit 28.09.2026 zählt das Budget den Nebenerwerb mit — ein brutto erfasster Nebenerwerb
  // würde den Vorschlag sonst um die Lohnabzüge zu hoch ansetzen.
  it('Nebenerwerb brutto → kein Vorschlag; netto → zählt mit', () => {
    const mitNeben = (art) => ({ ...basis, finanzen: { ...basis.finanzen, sideIncome: 1000, sideIncomeType: art } });
    expect(rateAusBudget(mitNeben('brutto')).grund).toBe('keinNetto');
    expect(rateAusBudget(mitNeben('netto')).vorschlag).toBe(3150);
  });
  it('ohne Wohnen, Krankenkasse oder Lebensmittel → sagt, was fehlt', () => {
    const r = rateAusBudget({ finanzen: { monthlyIncome: 5000, incomeType: 'netto' } });
    expect(r).toEqual({ grund: 'unvollstaendig', fehlend: ['wohnen', 'krankenkasse', 'lebensmittel'] });
  });
  it('nichts übrig → kein Vorschlag', () => {
    expect(rateAusBudget({ ...basis, finanzen: { ...basis.finanzen, monthlyIncome: 2800 } }).grund).toBe('nichtsUebrig');
  });
  it('ohne Einkommen', () => {
    expect(rateAusBudget({}).grund).toBe('keinEinkommen');
  });
});
