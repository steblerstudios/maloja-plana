import { describe, it, expect } from 'vitest';
import { LOHN_REFERENZ, mindestlohnBoden, lohnBandState, SCALE_MIN, SCALE_MAX } from '../lohnEinordnung.js';

describe('lohnEinordnung', () => {
  it('LOHN_REFERENZ: Median 6788 (BFS LSE 2022, amtlich belegt)', () => {
    expect(LOHN_REFERENZ.median).toBe(6788);
    expect(LOHN_REFERENZ.durchschnitt).toBe(7996);
    expect(LOHN_REFERENZ.jahr).toBe(2022);
  });

  describe('mindestlohnBoden', () => {
    it('GE: 24.59 × 182 = 4475/Monat', () => {
      const b = mindestlohnBoden('GE');
      expect(b.chfStunde).toBe(24.59);
      expect(b.monat).toBe(4475);
      expect(b.jahr).toBe(2026);
    });
    it('Kanton ohne Mindestlohn: null (kein erfundener Boden)', () => {
      expect(mindestlohnBoden('ZH')).toBeNull();
      expect(mindestlohnBoden('')).toBeNull();
    });
  });

  describe('lohnBandState', () => {
    it('ohne Lohn: show:false', () => {
      expect(lohnBandState({ income: 0, canton: 'GE' }).show).toBe(false);
      expect(lohnBandState({}).show).toBe(false);
    });
    it('nahe am Median (±5%) → near', () => {
      expect(lohnBandState({ income: 6788, canton: 'ZH', hoursPerWeek: 42 }).rel).toBe('near');
      expect(lohnBandState({ income: 7000, canton: 'ZH', hoursPerWeek: 42 }).rel).toBe('near');
    });
    it('deutlich darüber → above', () => {
      const s = lohnBandState({ income: 9000, canton: 'ZH', hoursPerWeek: 42 });
      expect(s.rel).toBe('above');
      expect(s.pct).toBe(33);
    });
    it('deutlich darunter → below', () => {
      const s = lohnBandState({ income: 4500, canton: 'ZH', hoursPerWeek: 42 });
      expect(s.rel).toBe('below');
    });

    it('Teilzeit 3400 bei 21 Std./Woche → FTE 6800 → near (nicht „below“)', () => {
      const s = lohnBandState({ income: 3400, canton: 'GE', hoursPerWeek: 21 });
      expect(s.partTime).toBe(true);
      expect(s.hoursKnown).toBe(true);
      expect(s.incomeFTE).toBe(6800);
      expect(s.rel).toBe('near');
    });

    // Der Kern der Wahrheits-Disziplin: ohne Stunden ist die Hochrechnung unmöglich.
    // Die Anzeige darf daraus keine Mindestlohn-Unterschreitung ableiten.
    it('ohne Wochenstunden: hoursKnown:false, keine Hochrechnung, partTime:false', () => {
      const s = lohnBandState({ income: 3000, canton: 'GE' });
      expect(s.hoursKnown).toBe(false);
      expect(s.partTime).toBe(false);
      expect(s.incomeFTE).toBe(3000);
    });
    it('Vollzeit (42 Std.): keine Hochrechnung', () => {
      const s = lohnBandState({ income: 6788, canton: 'GE', hoursPerWeek: 42 });
      expect(s.partTime).toBe(false);
      expect(s.incomeFTE).toBe(6788);
    });

    it('Skala ist fest (springt nicht mit den Daten)', () => {
      expect(SCALE_MIN).toBe(3000);
      expect(SCALE_MAX).toBe(13000);
      const s = lohnBandState({ income: 20000, canton: 'GE', hoursPerWeek: 42 });
      expect(s.scaleMax).toBe(13000);
      expect(s.incomeFTE).toBe(20000); // Clamping macht die Anzeige, nicht die Logik
    });

    it('reicht den Mindestlohn-Boden des Kantons durch', () => {
      expect(lohnBandState({ income: 5000, canton: 'GE', hoursPerWeek: 42 }).mindestlohn.monat).toBe(4475);
      expect(lohnBandState({ income: 5000, canton: 'ZH', hoursPerWeek: 42 }).mindestlohn).toBeNull();
    });
  });
});
