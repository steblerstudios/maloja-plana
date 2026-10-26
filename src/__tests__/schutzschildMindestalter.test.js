import { describe, it, expect } from 'vitest';
import { schildState, schildOptionen, vorBvgMindestalter } from '../data/schutzschild.js';

// BVG Art. 7 Abs. 1: Pflicht «ab 1. Januar nach Vollendung des 17. Altersjahres». Vorher zeigte der Schild bei
// Lernenden unter 18 über der Schwelle eine Pensionskassen-Lücke, die es nicht gibt.
describe('vorBvgMindestalter', () => {
  const heute = new Date(2026, 9, 25); // 25.10.2026

  it('JG 2009 (wird 2026 17) → vor dem Mindestalter', () => {
    expect(vorBvgMindestalter({ dateOfBirth: '2009-01-01' }, heute)).toBe(true);
  });

  it('JG 2008 (17 vollendet 2025) → ab 1.1.2026 versichert', () => {
    expect(vorBvgMindestalter({ dateOfBirth: '2008-12-31' }, heute)).toBe(false);
  });

  it('Jahreswechsel: JG 2009 ab 1.1.2027 versichert', () => {
    expect(vorBvgMindestalter({ dateOfBirth: '2009-01-01' }, new Date(2026, 11, 31))).toBe(true);
    expect(vorBvgMindestalter({ dateOfBirth: '2009-01-01' }, new Date(2027, 0, 1))).toBe(false);
  });

  it('ohne oder mit ungültigem Geburtsdatum → nein (Pflicht bleibt)', () => {
    expect(vorBvgMindestalter({}, heute)).toBe(false);
    expect(vorBvgMindestalter({ dateOfBirth: 'kein Datum' }, heute)).toBe(false);
  });
});

describe('schildState: keine BVG-Pflicht vor dem Mindestalter', () => {
  const v = { kkInsurer: 'CSS', uvg: 'employer' };

  it('16-jährig, über der Schwelle → keine BVG-Lücke, kein «unklar»', () => {
    const st = schildState(v, { employed: true, annualIncome: 30000, annualIncomeMit13: 32000, lohnBasis: 'netto', vorBvgMindestalter: true });
    expect(st.pflicht.items.map(i => i.key)).toEqual(['kk', 'uvg']);
    expect(st.bvgUnklar).toBe(false);
  });

  it('schildOptionen setzt es aus dem Geburtsdatum', () => {
    const finanzen = { employmentType: 'employed', monthlyIncome: 2500 };
    const jung = new Date().getFullYear() - 16;
    expect(schildOptionen({ basis: { dateOfBirth: `${jung}-06-01` }, finanzen }).vorBvgMindestalter).toBe(true);
    expect(schildOptionen({ basis: { dateOfBirth: '1990-06-01' }, finanzen }).vorBvgMindestalter).toBe(false);
  });
});
