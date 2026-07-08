import { describe, it, expect } from 'vitest';
import { tachoState } from '../data/franchiseTacho.js';
import { gaugeFrac } from '../components/Gauge.jsx';

// franchiseOpt-Form wie aus PraemienOrientierung: tiefe vs. hohe Franchise.
const opt = { lowFra: 300, highFra: 2500, annualSaving: 1400, reserve: 3200, sbMax: 700, breakEven: 1700 };

describe('tachoState: Franchise-Tacho-Zustand', () => {
  it('zeigt nichts ohne franchiseOpt oder ohne belegten Break-even', () => {
    expect(tachoState(null, 500).show).toBe(false);
    expect(tachoState({ ...opt, breakEven: null }, 500).show).toBe(false);
  });

  it('ohne erfasste Kosten → Orientierungsmodus, kein Zeiger', () => {
    const st = tachoState(opt, 0);
    expect(st.show).toBe(true);
    expect(st.mode).toBe('orientation');
    expect(st.needle).toBe(null);
  });

  it('Kosten unter Break-even → Modus below, Zeiger = Kosten (hohe Franchise günstiger)', () => {
    const st = tachoState(opt, 900);
    expect(st.mode).toBe('below');
    expect(st.needle).toBe(900);
    expect(st.high).toBe(2500);
  });

  it('Kosten über Break-even → Modus above (tiefe Franchise wäre günstiger gewesen)', () => {
    const st = tachoState(opt, 2600);
    expect(st.mode).toBe('above');
    expect(st.low).toBe(300);
  });

  it('Kosten genau am Break-even zählen noch als below (nicht schlechterstellen)', () => {
    expect(tachoState(opt, 1700).mode).toBe('below');
  });

  it('Skala ist ein 500er-Vielfaches, mindestens 2000, und deckt Break-even mit Luft', () => {
    const st = tachoState(opt, 0);
    expect(st.scaleMax % 500).toBe(0);
    expect(st.scaleMax).toBeGreaterThanOrEqual(2000);
    expect(st.scaleMax).toBeGreaterThan(opt.breakEven);
  });

  it('sehr hohe Kosten: Skala wächst mit, Zeiger bleibt innerhalb der Skala', () => {
    const st = tachoState(opt, 99999);
    expect(st.needle).toBe(99999);
    expect(st.needle).toBeLessThanOrEqual(st.scaleMax);
  });

  it('negative/ungültige Kosten werden als 0 behandelt', () => {
    expect(tachoState(opt, -50).mode).toBe('orientation');
    expect(tachoState(opt, 'abc').mode).toBe('orientation');
  });
});

describe('gaugeFrac: Skalen-Abbildung des Gauge-Primitivs', () => {
  it('bildet Wert linear auf 0..1 ab und klemmt an den Enden', () => {
    expect(gaugeFrac(0, 0, 100)).toBe(0);
    expect(gaugeFrac(50, 0, 100)).toBe(0.5);
    expect(gaugeFrac(100, 0, 100)).toBe(1);
    expect(gaugeFrac(-20, 0, 100)).toBe(0);
    expect(gaugeFrac(200, 0, 100)).toBe(1);
  });

  it('degeneriertes Intervall (max<=min) → 0 statt NaN', () => {
    expect(gaugeFrac(5, 10, 10)).toBe(0);
  });
});
