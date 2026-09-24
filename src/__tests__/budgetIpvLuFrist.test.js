// Gate 24.09.2026 (0.1.40-beta) · Budget, Kanton Luzern, Anmeldefrist vorbei.
// SRL 866 § 12 Abs. 3: «Wird das Gesuch erst im Jahr, für das Anspruch auf Prämienverbilligung
// geltend gemacht wird, eingereicht, werden nur diejenigen Prämien verbilligt, die nach der
// Gesuchstellung fällig werden.» Das Budget weiss nicht, ob und wann angemeldet wurde — darum
// zieht es nach dem 31. Oktober des Vorjahres nichts ab und sagt warum.
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { calculateMonthlyBudget } from '../budgetSync.js';
import { preloadPLZ } from '../config/cantonalData.js';

const t = (k, p) => (p ? `${k}(${Object.values(p).join('|')})` : k);
const person = {
  basis: { canton: 'LU', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 20000 / 12 },
  wohnen: { postalCode: '6003', city: '' },
  versicherungen: { kkPremium: 450 },
};

describe('Budget · IPV Luzern nach abgelaufener Anmeldefrist', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../data/plzGemeinde.js');
    await import('../config/ipvLuzern.js');
  });
  afterEach(() => { vi.useRealTimers(); });

  it('Frist läuft (Oktober 2025): der Betrag wird abgezogen', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2025-10-15T12:00:00'));
    const b = calculateMonthlyBudget(person, t);
    expect(b.ipvRelief).toBeGreaterThan(0);
    expect(b.ipvAnmeldefristVorbei).toBeFalsy();
  });

  it('Frist vorbei (September 2026): nichts abgezogen, der Hinweis steht da', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-09-24T12:00:00'));
    const b = calculateMonthlyBudget(person, t);
    expect(b.ipvRelief).toBe(0);
    expect(b.ipvAnmeldefristVorbei).toEqual({ jahr: 2026, vorjahr: 2025 });
    const texte = b.recommendations.map((r) => r.text);
    expect(texte).toContain('budget.ipvHintLuFristVorbei(2026|2025)');
    expect(texte.some((x) => x.startsWith('budget.ipvHint('))).toBe(false);
  });
});
