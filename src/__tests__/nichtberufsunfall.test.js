// Freizeit-Unfalldeckung über die Stelle (UVV Art. 13 Abs. 1: «bei einem Arbeitgeber» mindestens 8 Stunden/Woche).
// Vortor 10.11.2026: Stunden aus Haupt- und Nebenerwerb zusammen ergaben «ja», obwohl keine Stelle 8 Stunden haben muss.
import { describe, it, expect } from 'vitest';
import { nichtberufsunfallStatus } from '../utils/nichtberufsunfall.js';

const angestellt = (stunden, finanzen = {}) => ({
  finanzen: { employmentType: 'employed', ...finanzen },
  ausbildung: { workHoursPerWeek: stunden },
});

describe('nichtberufsunfallStatus', () => {
  it('nicht angestellt: keine Aussage', () => {
    expect(nichtberufsunfallStatus({ finanzen: { employmentType: 'selfEmployed' } })).toBeNull();
    expect(nichtberufsunfallStatus({})).toBeNull();
  });

  it('eine Stelle: 8 Stunden und mehr «ja», darunter «nein», leer «offen»', () => {
    expect(nichtberufsunfallStatus(angestellt('8'))).toBe('ja');
    expect(nichtberufsunfallStatus(angestellt('7,5'))).toBe('nein');
    expect(nichtberufsunfallStatus(angestellt(''))).toBe('offen');
  });

  it('mit Nebenerwerb und 8 Stunden und mehr: «offen», nicht «ja»', () => {
    expect(nichtberufsunfallStatus(angestellt('12', { sideIncome: 800 }))).toBe('offen');
    expect(nichtberufsunfallStatus(angestellt('12', { sideEmployer: 'Bäckerei' }))).toBe('offen');
    expect(nichtberufsunfallStatus(angestellt('12', { sideHoursPerWeek: '4' }))).toBe('offen');
  });

  it('mit Nebenerwerb, aber unter 8 Stunden insgesamt: weiter «nein»', () => {
    expect(nichtberufsunfallStatus(angestellt('6', { sideIncome: 800 }))).toBe('nein');
  });

  it('leere Nebenerwerb-Felder zählen nicht', () => {
    expect(nichtberufsunfallStatus(angestellt('20', { sideIncome: '', sideEmployer: '  ', sideHoursPerWeek: '' }))).toBe('ja');
  });
});
