import { describe, it, expect } from 'vitest';
import { schildState, schildOptionen } from '../data/schutzschild.js';
import { referenzalterErreicht } from '../utils/nettoAusProfil.js';

// Ab dem Referenzalter endet die BVG-Pflicht (BVG Art. 10 Abs. 2 lit. a). Vorher zeigte der Schild
// nach 65 eine Lücke bei der Pensionskasse, obwohl keine Pflicht mehr besteht.
describe('referenzalterErreicht: monatsgenau, AHV 21', () => {
  const heute = new Date(2026, 9, 25); // 25.10.2026

  it('Mann, 65. Geburtstag heute → erreicht; einen Tag später geboren → nicht', () => {
    expect(referenzalterErreicht({ dateOfBirth: '1961-10-25', gender: 'male' }, heute)).toBe(true);
    expect(referenzalterErreicht({ dateOfBirth: '1961-10-26', gender: 'male' }, heute)).toBe(false);
  });

  it('Frau JG 1962: 64 J 6 M — mit 64 J 6 M erreicht, mit 64 J 5 M nicht', () => {
    expect(referenzalterErreicht({ dateOfBirth: '1962-04-25', gender: 'female' }, heute)).toBe(true);
    expect(referenzalterErreicht({ dateOfBirth: '1962-05-25', gender: 'female' }, heute)).toBe(false);
  });

  it('ohne oder mit ungültigem Geburtsdatum → null (offen, nicht «nein»)', () => {
    expect(referenzalterErreicht({}, heute)).toBe(null);
    expect(referenzalterErreicht({ dateOfBirth: 'kein Datum' }, heute)).toBe(null);
  });
});

describe('schildState: keine BVG-Pflicht ab Referenzalter', () => {
  const v = { kkInsurer: 'CSS', uvg: 'employer' };

  it('angestellt über der Schwelle, Referenzalter erreicht → Pflicht nur KK + UVG, keine Lücke', () => {
    const st = schildState(v, { employed: true, annualIncome: 60000, referenzalterErreicht: true });
    expect(st.pflicht.items.map(i => i.key)).toEqual(['kk', 'uvg']);
    expect(st.pflicht.gaps).toEqual([]);
    expect(st.bvgNa).toBe(false);
  });

  it('vor dem Referenzalter bleibt die BVG-Lücke', () => {
    const st = schildState(v, { employed: true, annualIncome: 60000, referenzalterErreicht: false });
    expect(st.pflicht.gaps).toEqual(['bvg']);
  });

  it('Referenzalter erreicht: kein «unklar» unter der Schwelle (netto, 13. offen)', () => {
    const st = schildState(v, { employed: true, annualIncome: 20000, annualIncomeMit13: 23000, lohnBasis: 'netto', referenzalterErreicht: true });
    expect(st.bvgUnklar).toBe(false);
  });

  it('schildOptionen liest das Geburtsdatum aus der Basis; ohne Datum bleibt die Pflicht', () => {
    const finanzen = { employmentType: 'employed', monthlyIncome: 5000 };
    expect(schildOptionen({ basis: { dateOfBirth: '1950-01-01', gender: 'male' }, finanzen }).referenzalterErreicht).toBe(true);
    const ohne = schildOptionen({ finanzen });
    expect(ohne.referenzalterErreicht).toBe(false);
    expect(schildState(v, ohne).pflicht.gaps).toEqual(['bvg']);
  });
});
