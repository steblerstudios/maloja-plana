// Verpasste Steuerfrist sichtbar machen — aber nur, wenn noch etwas offen sein kann.
// Massstab-Prüfung 21.10.2026 (Eisenhower: das Verpasste ist das Dringendste).
import { describe, it, expect } from 'vitest';
import { steuerfristVorbei } from '../utils/steuerfrist.js';

const HEUTE = '2026-10-21';

describe('steuerfristVorbei', () => {
  it('vorbei und nichts angegeben → melden', () => {
    expect(steuerfristVorbei({ taxFilingDeadline: '2026-09-30' }, HEUTE)).toBe(true);
  });
  it('vorbei und noch 1 Erklärung offen → melden', () => {
    expect(steuerfristVorbei({ taxFilingDeadline: '2026-09-30', pendingTaxReturns: '1' }, HEUTE)).toBe(true);
  });
  it('vorbei, aber 0 offen (eingereicht) → nicht melden', () => {
    expect(steuerfristVorbei({ taxFilingDeadline: '2026-09-30', pendingTaxReturns: '0' }, HEUTE)).toBe(false);
    expect(steuerfristVorbei({ taxFilingDeadline: '2026-09-30', pendingTaxReturns: 0 }, HEUTE)).toBe(false);
    expect(steuerfristVorbei({ taxFilingDeadline: '2026-09-30', pendingTaxReturns: ' 0 ' }, HEUTE)).toBe(false);
  });
  it('heute fällig → noch nicht vorbei', () => {
    expect(steuerfristVorbei({ taxFilingDeadline: HEUTE }, HEUTE)).toBe(false);
  });
  it('in der Zukunft → nicht vorbei', () => {
    expect(steuerfristVorbei({ taxFilingDeadline: '2027-03-31' }, HEUTE)).toBe(false);
  });
  it('ohne Frist oder ohne Kapitel → nicht melden', () => {
    expect(steuerfristVorbei({}, HEUTE)).toBe(false);
    expect(steuerfristVorbei(undefined, HEUTE)).toBe(false);
  });
});
