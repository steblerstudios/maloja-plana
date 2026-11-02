import { describe, it, expect } from 'vitest';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { anspruchSignale } from '../data/anspruchSignale.js';
import { sozialhilfeVorbefuellung } from '../utils/sozialhilfeVorbefuellung.js';

// Predeploy 02.11.2026 auf 0c236078: Nachzug zu #651.
const konkubinat = {
  basis: { canton: 'ZH', maritalStatus: 'cohabiting', household: { adults: 2, children: [], partnerIncome: 8000 } },
  finanzen: {}, wohnen: { rentAmount: 1500 }, versicherungen: { kkPremium: 300 },
};

describe('Nachzug: Hinweise auch am Signal', () => {
  it('Konkubinat mit Partnerlohn: kein Anspruch-Signal, der Betrag ist offen', () => {
    expect(calculateSozialhilfe(konkubinat).eligible).toBe(false);
    expect((anspruchSignale(konkubinat).behoerden || []).find((x) => x.key === 'sozialhilfe')).toBeUndefined();
  });
});

describe('Nachzug: nur Nebenerwerb, nicht übernommen', () => {
  it('Hauptlohn leer, Nebenerwerb brutto: kein Betrag aus Einkommen 0', () => {
    expect(sozialhilfeVorbefuellung({ finanzen: { sideIncome: 2000, sideIncomeType: 'brutto' } }).lohnNichtUebernommen).toBe(true);
  });
  it('Hauptlohn leer, Nebenerwerb ohne Art: dasselbe', () => {
    expect(sozialhilfeVorbefuellung({ finanzen: { sideIncome: 2000 } }).lohnNichtUebernommen).toBe(true);
  });
  it('Art brutto ohne Hauptlohn, Nebenerwerb netto: das Feld bleibt leer, also auch kein Betrag', () => {
    expect(sozialhilfeVorbefuellung({ finanzen: { incomeType: 'brutto', sideIncome: 2000, sideIncomeType: 'netto' } }).lohnNichtUebernommen).toBe(true);
  });
  it('Gegenprobe: Hauptlohn netto und Nebenerwerb ohne Art rechnet, der Hinweis steht am Ergebnis', () => {
    expect(sozialhilfeVorbefuellung({ finanzen: { monthlyIncome: 1000, incomeType: 'netto', sideIncome: 400 } }).lohnNichtUebernommen).toBe(false);
  });
});
