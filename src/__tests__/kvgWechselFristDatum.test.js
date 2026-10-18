import { describe, it, expect } from 'vitest';
import { nextNov30, fristKnopfDatum } from '../KVGWechsel.jsx';

// Sammel-Fix 14.10.2026, Punkt 5: Der Knopf schrieb fest «30.11.<Jahr>», die Erinnerung
// lag aber auf dem letzten Werktag davor, wenn der 30.11. auf Sa/So fällt (so sagt es der
// Text im Ablauf, BAG). Erstmals 2030 (30.11.2030 = Samstag) stimmten Knopf und Termin nicht überein.
describe('KVG-Kündigungsfrist: Knopf und Erinnerung zeigen dasselbe Datum', () => {
  it('2030: 30.11. ist ein Samstag → Freitag 29.11.', () => {
    const d = nextNov30(new Date(2030, 5, 1));
    expect(d).toBe('2030-11-29');
    expect(fristKnopfDatum(d)).toBe('29.11.2030');
  });
  it('2026: Montag → 30.11.2026 bleibt', () => {
    const d = nextNov30(new Date(2026, 9, 14));
    expect(d).toBe('2026-11-30');
    expect(fristKnopfDatum(d)).toBe('30.11.2026');
  });
  it('am 30.11. selbst zählt noch dasselbe Jahr, danach das nächste', () => {
    expect(nextNov30(new Date(2026, 10, 30, 15, 0))).toBe('2026-11-30');
    expect(nextNov30(new Date(2026, 11, 1))).toBe('2027-11-30');
  });
});
