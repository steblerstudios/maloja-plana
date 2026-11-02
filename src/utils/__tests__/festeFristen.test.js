import { describe, it, expect } from 'vitest';
import { festeFristen, kvgFristImFenster, ueberfaelligeRechnungen } from '../festeFristen.js';

const kk = { versicherungen: { kkInsurer: 'CSS' } };

describe('Kassenfrist im Herbst', () => {
  it('im Fenster: 30.11.2026 ist ein Montag', () => {
    expect(kvgFristImFenster(kk, '2026-11-02')).toBe('2026-11-30');
  });
  it('fällt der 30.11. aufs Wochenende, gilt der Werktag davor', () => {
    expect(kvgFristImFenster(kk, '2025-11-02')).toBe('2025-11-28');
  });
  it('Fenster beginnt am 31.10. und endet mit der Frist', () => {
    expect(kvgFristImFenster(kk, '2026-10-30')).toBeNull();
    expect(kvgFristImFenster(kk, '2026-10-31')).toBe('2026-11-30');
    expect(kvgFristImFenster(kk, '2026-12-01')).toBeNull();
  });
  it('ohne Krankenkasse keine Frist', () => {
    expect(kvgFristImFenster({}, '2026-11-02')).toBeNull();
  });
});

describe('feste Fristen', () => {
  it('Kassenfrist und künftige Steuerfrist', () => {
    const d = { ...kk, behoerden: { taxFilingDeadline: '2027-03-31' } };
    expect(festeFristen(d, '2026-11-02').map((f) => f.key)).toEqual(['kvg', 'steuer']);
  });
  it('eine vorbeie Steuerfrist steht nicht als kommende da', () => {
    expect(festeFristen({ behoerden: { taxFilingDeadline: '2026-03-31' } }, '2026-11-02')).toEqual([]);
  });
});

describe('überfällige Arztrechnungen', () => {
  const beleg = (betrag, frist, status = 'offen') => ({ id: betrag, betrag, frist, status });
  it('zählt nur offene mit abgelaufener Frist', () => {
    const d = { versicherungen: { kkBelege: [beleg(180, '2026-06-30'), beleg(50.5, '2026-10-01'), beleg(70, '2026-12-01'), beleg(90, '2026-01-01', 'bezahlt')] } };
    expect(ueberfaelligeRechnungen(d, '2026-11-02')).toEqual({ anzahl: 2, summe: 230.5 });
  });
  it('nichts überfällig: null', () => {
    expect(ueberfaelligeRechnungen({}, '2026-11-02')).toBeNull();
  });
});
