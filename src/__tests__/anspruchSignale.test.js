import { describe, it, expect } from 'vitest';
import { anspruchSignale, anspruchSignaleListe } from '../data/anspruchSignale.js';

describe('anspruchSignale: gedeckte Ansprüche → Lebensbaum-Ast', () => {
  it('leeres Profil trägt kein Signal (kein Ring ohne Anspruch)', () => {
    expect(anspruchSignale({})).toEqual({});
    expect(anspruchSignale(undefined)).toEqual({});
    expect(anspruchSignaleListe({})).toEqual([]);
  });

  it('IPV bei Kanton + Einkommen unter der Grenze → Ast „versicherungen"', () => {
    const data = { basis: { canton: 'BS' }, finanzen: { monthlyIncome: 3000 } };
    const sig = anspruchSignale(data);
    expect(sig.versicherungen).toEqual([{ key: 'ipv', view: 'premium' }]);
  });

  it('ohne Kanton kein IPV-Signal (kein erfundener Betrag)', () => {
    const data = { basis: { canton: '' }, finanzen: { monthlyIncome: 3000 } };
    expect(anspruchSignale(data).versicherungen).toBeUndefined();
  });

  it('Sozialhilfe bei ungedecktem Bedarf → Ast „behoerden"', () => {
    const data = { basis: { canton: 'BS' }, finanzen: { monthlyIncome: 0 }, wohnen: { rentAmount: 1500 } };
    const sig = anspruchSignale(data);
    expect(sig.behoerden).toEqual([{ key: 'sozialhilfe', view: 'sozialhilfe' }]);
  });

  it('Vermögen über dem Freibetrag unterdrückt das Sozialhilfe-Signal', () => {
    const data = {
      basis: { canton: 'BS' }, finanzen: { monthlyIncome: 0, savingsAccount: 50000 },
      wohnen: { rentAmount: 1500 },
    };
    expect(anspruchSignale(data).behoerden).toBeUndefined();
  });

  it('EL nur im AHV-/IV-Renten-Kontext → Ast „finanzen"', () => {
    const eligible = { finanzen: { ahvRente: 1000, monthlyIncome: 0 }, wohnen: { rentAmount: 500 }, versicherungen: { kkPremium: 300 } };
    expect(anspruchSignale(eligible).finanzen).toEqual([{ key: 'el', view: 'finanzuebersicht' }]);
    const noRente = { finanzen: { monthlyIncome: 0 }, wohnen: { rentAmount: 500 }, versicherungen: { kkPremium: 300 } };
    expect(anspruchSignale(noRente).finanzen).toBeUndefined();
  });

  it('anspruchSignaleListe hängt den Ast-Schlüssel an jedes Signal', () => {
    const data = { basis: { canton: 'BS' }, finanzen: { monthlyIncome: 3000 } };
    const liste = anspruchSignaleListe(data);
    expect(liste).toContainEqual({ key: 'ipv', view: 'premium', chapterKey: 'versicherungen' });
  });
});
