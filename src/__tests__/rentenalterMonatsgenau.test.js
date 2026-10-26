import { describe, it, expect } from 'vitest';
import { alterUndRentenalter, nettoMonatAusProfil } from '../utils/nettoAusProfil.js';

// Rentenalter monatsgenau (25.10.2026): vorher ganze Jahre × 12 — Frauen JG 1961–63 galten erst mit 65
// als im Rentenalter, der Netto-Richtwert zog bis dahin weiter Pensionskasse ab, obwohl der Schutzschild
// ab dem Referenzalter keine BVG-Pflicht mehr zeigt.
describe('alterUndRentenalter: monatsgenau, AHV 21', () => {
  const heute = new Date(2026, 9, 25); // 25.10.2026

  it('Frau JG 1962 mit 64 J 6 M → Rentenalter (vorher erst mit 65)', () => {
    expect(alterUndRentenalter({ dateOfBirth: '1962-04-25', gender: 'female' }, heute)).toEqual({ alter: 64, rentenalter: true });
  });

  it('Frau JG 1962 mit 64 J 5 M → noch nicht', () => {
    expect(alterUndRentenalter({ dateOfBirth: '1962-05-25', gender: 'female' }, heute).rentenalter).toBe(false);
  });

  it('Mann: genau mit 65, nicht einen Tag früher', () => {
    expect(alterUndRentenalter({ dateOfBirth: '1961-10-25', gender: 'male' }, heute).rentenalter).toBe(true);
    expect(alterUndRentenalter({ dateOfBirth: '1961-10-26', gender: 'male' }, heute).rentenalter).toBe(false);
  });

  it('ohne Geburtsdatum wie bisher', () => {
    expect(alterUndRentenalter({}, heute)).toEqual({ alter: undefined, rentenalter: false });
  });

  it('Netto-Richtwert: ab 64 J 6 M ohne PK-Abzug → höher als einen Monat davor', () => {
    const imRentenalter = nettoMonatAusProfil(6000, 'brutto', { dateOfBirth: '1962-04-25', gender: 'female' }, heute).netto;
    const davor = nettoMonatAusProfil(6000, 'brutto', { dateOfBirth: '1962-05-25', gender: 'female' }, heute).netto;
    expect(imRentenalter).toBeGreaterThan(davor);
  });
});
