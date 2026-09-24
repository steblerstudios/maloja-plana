// Pflichtfelder und Hinweise sind für Screenreader angebunden, nicht nur sichtbar.
//
// Bis 24.09.2026 stand «Pflicht» nur als « *» im Label (wird je nach Satzzeichen-
// Einstellung nicht vorgelesen), das Geburtsdatum — Pflicht — hatte nicht einmal
// den Stern, und der Hinweis unter einem Textfeld war nicht mit ihm verknüpft.
// Kein DOM (vitest ohne jsdom): Daten direkt, Verdrahtung als Quelltext-Wächter.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getChapters } from '../config/constants.js';

const cv = fs.readFileSync(path.resolve(__dirname, '../ChapterView.jsx'), 'utf8');
const block = (typ) => {
  const i = cv.indexOf("if (field.type === '" + typ + "') {");
  return cv.slice(i, cv.indexOf('\n    }\n', i));
};

describe('Pflichtfelder', () => {
  const pflicht = getChapters((k) => k).flatMap((c) => (c.fields || []).filter((f) => f.required));

  it('es gibt Pflichtfelder (sonst prüft der Rest die leere Menge)', () => {
    expect(pflicht.length).toBeGreaterThanOrEqual(3);
  });

  it('jedes Pflichtfeld hat einen Typ, dessen Block aria-required setzt und den Stern zeigt', () => {
    for (const f of pflicht) {
      const b = block(f.type);
      expect(b, f.k + ' (' + f.type + ')').toMatch(/\.\.\.errAria\(fieldId/);
      expect(b, f.k).toMatch(/field\.label \+ \(field\.required \? ' \*' : ''\)/);
    }
  });

  it('errAria setzt aria-required aus field.required', () => {
    expect(cv).toMatch(/const errAria = [\s\S]{0,400}field\.required \? \{ 'aria-required': 'true' \}/);
  });

  it('der Hinweis eines Textfelds ist per aria-describedby angebunden', () => {
    const b = block('text');
    expect(b).toMatch(/errAria\(fieldId, field\.hint \? fieldId \+ '-hint' : null\)/);
    expect(b).toMatch(/id: fieldId \+ '-hint'/);
  });
});
