import { describe, it, expect } from 'vitest';
import { alterUndRentenalter, nettoMonatAusProfil } from '../utils/nettoAusProfil.js';

// Rentenalter monatsgenau (25.10.2026): vorher ganze Jahre × 12 — Frauen JG 1961–63 galten erst mit 65
// als im Rentenalter, der Netto-Richtwert zog bis dahin weiter Pensionskasse ab.
// Seit dem Nachtrag gilt es für die Lohnabzüge ab dem MONAT NACH dem Erreichen (AHVV Art. 6quater Abs. 1,
// AVIG Art. 2 Abs. 2 lit. c — fedlex gelesen 25.10.2026), nicht schon am Tag selbst.
describe('alterUndRentenalter: ab Folgemonat, AHV 21', () => {
  const heute = new Date(2026, 9, 25); // 25.10.2026

  it('Frau JG 1962 (64 J 6 M), im September erreicht → im Oktober Rentenalter (vorher erst mit 65)', () => {
    expect(alterUndRentenalter({ dateOfBirth: '1962-03-15', gender: 'female' }, heute)).toEqual({ alter: 64, bvgAlter: 64, rentenalter: true, beitragsfrei: false });
  });

  it('Frau JG 1962, im Oktober erreicht → im selben Monat noch nicht', () => {
    expect(alterUndRentenalter({ dateOfBirth: '1962-04-15', gender: 'female' }, heute).rentenalter).toBe(false);
  });

  it('Mann: 65 im Oktober → erst ab November; 65 im September → im Oktober', () => {
    expect(alterUndRentenalter({ dateOfBirth: '1961-10-15', gender: 'male' }, heute).rentenalter).toBe(false);
    expect(alterUndRentenalter({ dateOfBirth: '1961-10-15', gender: 'male' }, new Date(2026, 10, 1)).rentenalter).toBe(true);
    expect(alterUndRentenalter({ dateOfBirth: '1961-09-15', gender: 'male' }, heute).rentenalter).toBe(true);
  });

  it('ohne Geburtsdatum wie bisher', () => {
    expect(alterUndRentenalter({}, heute)).toEqual({ alter: undefined, bvgAlter: undefined, rentenalter: false, beitragsfrei: false });
  });

  it('Netto-Richtwert: im Folgemonat ohne ALV/PK → höher als im Monat des Erreichens', () => {
    const imRentenalter = nettoMonatAusProfil(6000, 'brutto', { dateOfBirth: '1962-03-15', gender: 'female' }, heute).netto;
    const imMonatDesErreichens = nettoMonatAusProfil(6000, 'brutto', { dateOfBirth: '1962-04-15', gender: 'female' }, heute).netto;
    expect(imRentenalter).toBeGreaterThan(imMonatDesErreichens);
  });
});
