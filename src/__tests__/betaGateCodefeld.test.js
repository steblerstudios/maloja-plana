// Beta-Wand: Codefeld und Code-Abgleich auf dem Handy (iPhone-Test 10.11.2026).
// Safari ersetzte beim Tippen Wörter (Autokorrektur) und Striche (intelligente Zeichensetzung);
// der Fingerabdruck passte dann nicht, obwohl der richtige Code getippt war.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { codeNormalisieren } from '../BetaGate.jsx';

describe('Beta-Wand · Codefeld', () => {
  it('das Eingabefeld schaltet Autokorrektur, Grossschreibung und Vorschläge aus', () => {
    const quelle = readFileSync(new URL('../BetaGate.jsx', import.meta.url), 'utf8');
    expect(quelle).toMatch(/autoComplete: 'off', autoCorrect: 'off', autoCapitalize: 'none', spellCheck: false/);
  });

  it('typografische Striche und Apostrophe zählen wie die schlichten', () => {
    expect(codeNormalisieren('  Mal–oja’s ')).toBe("mal-oja's");
    expect(codeNormalisieren('a—b−c‐d')).toBe('a-b-c-d');
    expect(codeNormalisieren('“x”')).toBe('"x"');
  });

  it('schlichte Eingaben bleiben, wie sie waren (nur trim + klein)', () => {
    expect(codeNormalisieren('  AbC-1 ')).toBe('abc-1');
  });
});
