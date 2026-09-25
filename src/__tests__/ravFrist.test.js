import { describe, it, expect } from 'vitest';
import { ravSpaetestens } from '../StelleVerloren.jsx';

// AVIG Art. 17 Abs. 2: spätestens am ersten Tag, für den Taggeld beansprucht
// wird — also am Tag nach dem Ende des Arbeitsverhältnisses.
describe('RAV — Spätestens-Termin', () => {
  it('ist der Tag nach dem Vertragsende, auch über Monats- und Jahresgrenzen', () => {
    expect(ravSpaetestens('2026-09-30')).toBe('2026-10-01');
    expect(ravSpaetestens('2026-12-31')).toBe('2027-01-01');
    expect(ravSpaetestens('2028-02-28')).toBe('2028-02-29');
  });

  it('ohne gültiges Datum gibt es keinen Termin — nie «heute + n»', () => {
    expect(ravSpaetestens('')).toBeNull();
    expect(ravSpaetestens(undefined)).toBeNull();
    expect(ravSpaetestens('30.09.2026')).toBeNull();
    expect(ravSpaetestens('2026-13-45')).toBeNull();
  });
});
