import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { stipResultMarker } from '../StipendienView.jsx';
import { StatusForm } from '../components/StatusForm.jsx';

// A11y 1.4.1 — Farbe nie allein: Der Berechtigungs-Check färbt sein Ergebnis
// (sage/rose/gold). Im Schwarzweiss-Modus fällt die Farbe weg, also muss die
// Marke die drei Töne allein tragen. Früher trugen „Nein" und „Vielleicht"
// beide „ⓘ" — in Graustufen nicht unterscheidbar.
//
// Seit 23.09.2026 ist die Marke eine FORM (`StatusForm`, wie in der
// KVG-Statuslogik) statt eines Buchstabens. Geprüft wird die Zusage, nicht die
// Schreibweise: drei unterscheidbare Bilder, keins davon vorlesbar.
const bild = (tone) => renderToStaticMarkup(
  React.createElement(StatusForm, { form: stipResultMarker(tone), color: '#000' }),
);

describe('Stipendien-Ergebnis: Marke trägt Bedeutung auch ohne Farbe', () => {
  it('jeder Ton hat seine eigene Form', () => {
    const bilder = ['yes', 'no', 'maybe'].map(bild);
    bilder.forEach((b) => expect(b).toContain('<svg'));
    expect(new Set(bilder).size).toBe(3);
  });

  it('„Nein" und „Vielleicht" sind unterscheidbar (der eigentliche Fix)', () => {
    expect(bild('no')).not.toBe(bild('maybe'));
  });

  it('unbekannter/neutraler Ton fällt sicher auf „unklar" zurück', () => {
    expect(bild('neutral')).toBe(bild('maybe'));
  });

  it('die Marke wird nicht vorgelesen und trägt keinen Buchstaben', () => {
    for (const tone of ['yes', 'no', 'maybe']) {
      expect(bild(tone)).toContain('aria-hidden="true"');
      expect(bild(tone)).not.toMatch(/[✓○ⓘ✕]/);
    }
  });
});
