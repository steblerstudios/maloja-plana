import { describe, it, expect } from 'vitest';
import { kompassBearing } from '../data/leistungsKompass.js';

describe('kompassBearing: Peilung des Leistungs-Kompass', () => {
  it('ohne Einkommen → idle, Nadel ruht oben', () => {
    expect(kompassBearing({ hasIncome: false, benefitCount: 3 })).toEqual({ state: 'idle', bearing: 0 });
  });

  it('mit Einkommen und gedeckten Leistungen → found, Peilung Norden (0°)', () => {
    expect(kompassBearing({ hasIncome: true, benefitCount: 2 })).toEqual({ state: 'found', bearing: 0 });
  });

  it('mit Einkommen, aber ohne direkte Leistung → none, Peilung Süden (180°)', () => {
    expect(kompassBearing({ hasIncome: true, benefitCount: 0 })).toEqual({ state: 'none', bearing: 180 });
  });

  it('benefitCount fehlt → wie 0 behandelt (none bei Einkommen)', () => {
    expect(kompassBearing({ hasIncome: true }).state).toBe('none');
  });

  it('ohne Argumente → idle (kein Absturz)', () => {
    expect(kompassBearing().state).toBe('idle');
  });
});
