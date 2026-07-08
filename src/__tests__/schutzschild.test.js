import { describe, it, expect } from 'vitest';
import { schildState } from '../data/schutzschild.js';

describe('schildState: Versicherungs-Schutzschild', () => {
  it('leeres Versicherungs-Kapitel → nicht berührt, 0 gedeckt (Schild bleibt aus)', () => {
    const st = schildState({});
    expect(st.touched).toBe(false);
    expect(st.covered).toBe(0);
    expect(st.total).toBe(3);
  });

  it('nur Krankenkasse erfasst → 1 gedeckt, berührt, zwei Lücken', () => {
    const st = schildState({ kkInsurer: 'CSS' });
    expect(st.touched).toBe(true);
    expect(st.covered).toBe(1);
    expect(st.gaps).toEqual(['haftpflicht', 'hausrat']);
    expect(st.allCovered).toBe(false);
  });

  it('alle drei Kern-Absicherungen → voll gedeckt, keine Lücken', () => {
    const st = schildState({ kkInsurer: 'Helsana', liabilityInsurance: 'yes', householdInsurance: 'yes' });
    expect(st.covered).toBe(3);
    expect(st.allCovered).toBe(true);
    expect(st.gaps).toEqual([]);
    expect(st.fraction).toBe(1);
  });

  it("Haftpflicht 'no' zählt NICHT als gedeckt", () => {
    const st = schildState({ kkInsurer: 'CSS', liabilityInsurance: 'no', householdInsurance: 'yes' });
    expect(st.covered).toBe(2);
    expect(st.gaps).toEqual(['haftpflicht']);
  });

  it('nur Leerzeichen bei kkInsurer → nicht gedeckt und nicht berührt', () => {
    const st = schildState({ kkInsurer: '   ' });
    expect(st.covered).toBe(0);
    expect(st.touched).toBe(false);
  });

  it('Auswahl „nein" bei Hausrat berührt das Schild (Angabe gemacht)', () => {
    const st = schildState({ householdInsurance: 'no' });
    expect(st.touched).toBe(true);
    expect(st.covered).toBe(0);
  });
});
