import { describe, it, expect } from 'vitest';
import { lohnBandState } from '../data/lohnEinordnung.js';
import { nettoZuBruttoRichtwert, bruttoZuNettoRichtwert } from '../data/lohnAbzuege.js';
import { musterProfil, MUSTERHAUSHALTE } from '../data/systemblick.js';

// Netto→Brutto im Rentenalter (25.10.2026): Lohn-Einordnung, Armutsgrenzen-Hinweis und Systemblick
// gaben das Rentenalter nicht mit und schätzten das Brutto mit ALV und Pensionskasse — zu hoch.
describe('lohnBandState: Rentenalter durchgereicht', () => {
  const basis = { income: 4000, canton: 'ZH', hoursPerWeek: 40, incomeType: 'netto', alter: 66 };

  it('im Rentenalter tieferes geschätztes Brutto (ohne ALV/PK)', () => {
    const ohne = lohnBandState(basis).income;
    const mit = lohnBandState({ ...basis, rentenalter: true }).income;
    expect(mit).toBeLessThan(ohne);
    expect(mit).toBe(nettoZuBruttoRichtwert(4000, 66, true));
  });

  it('ohne Angabe wie bisher (rentenalter = false)', () => {
    expect(lohnBandState(basis).income).toBe(nettoZuBruttoRichtwert(4000, 66, false));
  });
});

describe('systemblick: Erwerbs-Modelle unverändert', () => {
  it('jedes Erwerbs-Modell liegt vor dem Referenzalter → Netto wie bisher (rentenalter false)', () => {
    for (const [key, h] of Object.entries(MUSTERHAUSHALTE)) {
      if (h.rente) continue;
      const alter = 2026 - Number(h.erwachsene[0].slice(0, 4));
      expect(musterProfil('ZH', key).finanzen.monthlyIncome).toBe(bruttoZuNettoRichtwert(h.bruttoJahr / 12, alter, false));
    }
  });
});
