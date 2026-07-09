import { describe, it, expect } from 'vitest';
import { shieldPath } from '../components/shieldShape.js';

describe('shieldPath — geteilte Wappen-Form', () => {
  it('gibt das volle Schutzschild bis auf < 0.1 px identisch wie der frühere hartcodierte Pfad wieder', () => {
    // Referenz war 'M80 12 L134 34 L134 78 Q134 118 80 148 Q26 118 26 78 L26 34 Z'
    const p = shieldPath(80, 12, 108, 136);
    expect(p.startsWith('M80 12')).toBe(true);        // Spitze oben
    expect(p).toContain('80 148');                     // unterster Punkt (Mitte, Unterkante)
    expect(p).toContain('L134 ');                      // rechte Flanke
    expect(p).toContain('L26 ');                       // linke Flanke (symmetrisch)
    expect(p.trim().endsWith('Z')).toBe(true);
    // Schulter-, Flanken- und Kontroll-Y liegen nah an den Original-Zahlen 34/78/118
    const nums = p.match(/-?\d+(\.\d+)?/g).map(Number);
    expect(nums).toContain(80); // cx
    // die Schulter-Y ~34
    const near = (v) => nums.some((n) => Math.abs(n - v) < 0.1);
    expect(near(34)).toBe(true);
    expect(near(78)).toBe(true);
    expect(near(118)).toBe(true);
  });

  it('ist skalen-invariant: gleiche Proportionen in Mini-Grösse', () => {
    const mini = shieldPath(18, 3, 26, 35);
    expect(mini.startsWith('M18 3')).toBe(true);
    expect(mini).toContain('18 38'); // unterster Punkt
    // Schulter-Y-Anteil identisch zum vollen Schild (~0.162 der Höhe)
    const full = shieldPath(80, 12, 108, 136);
    const shoulderFrac = (path, top, hgt) => {
      const y = Number(path.split(' ')[3]); // erstes L-Ziel-Y
      return (y - top) / hgt;
    };
    expect(Math.abs(shoulderFrac(mini, 3, 35) - shoulderFrac(full, 12, 136))).toBeLessThan(0.001);
  });

  it('ist symmetrisch um cx', () => {
    const p = shieldPath(50, 0, 40, 50); // links 30, rechts 70
    expect(p).toContain('L70 ');
    expect(p).toContain('L30 ');
  });
});
