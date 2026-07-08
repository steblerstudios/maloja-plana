import { describe, it, expect } from 'vitest';
import { stipResultMarker } from '../StipendienView.jsx';

// A11y 1.4.1 — Farbe nie allein: Der Berechtigungs-Check färbt sein Ergebnis
// (sage/rose/gold). Im Schwarzweiss-Modus fällt die Farbe weg, also muss der
// Text-Marker die drei Töne allein tragen. Vorher trugen „Nein" und
// „Vielleicht" beide „ⓘ" — in Graustufen nicht unterscheidbar. Dieser Test
// hält fest, dass jeder Ton ein eigenes Zeichen hat.
describe('Stipendien-Ergebnis: Marker trägt Bedeutung auch ohne Farbe', () => {
  it('jeder Ton hat sein eigenes Zeichen', () => {
    expect(stipResultMarker('yes')).toBe('✓');
    expect(stipResultMarker('no')).toBe('○');
    expect(stipResultMarker('maybe')).toBe('ⓘ');
  });

  it('„Nein" und „Vielleicht" sind unterscheidbar (der eigentliche Fix)', () => {
    expect(stipResultMarker('no')).not.toBe(stipResultMarker('maybe'));
  });

  it('unbekannter/neutraler Ton fällt sicher auf das Info-Zeichen zurück', () => {
    expect(stipResultMarker('neutral')).toBe('ⓘ');
  });
});
