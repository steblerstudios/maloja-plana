// «du» klein (Fassung 9, F9-B1, Stebler Studios 05.11.2026: «mach so wie es orthographisch stimmt
// beim du und nicht wie ich gedacht habe»). Amtliche Rechtschreibung, auch in der Schweiz: «du»,
// «dein», «dir», «dich» klein; gross nur am Satzanfang (auch nach Doppelpunkt, wenn ein ganzer
// Satz folgt). Geprüft werden alle deutschen Du-Fassungen in i18n/de.js.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const DE = fs.readFileSync(path.resolve(__dirname, '../i18n/de.js'), 'utf8');
// Grosse Du-Form, vor der ein Wort, Komma oder Gedankenstrich steht (also mitten im Satz).
const MITTEN = /(?<![.!?:"„«([{]\s)(?<=[\wäöüß,;)\-–—]\s)\b(Du|Dich|Dir|Dein|Deine|Deinen|Deinem|Deiner|Deines|Euch|Euer|Eure|Euren|Eurem|Eurer|Eures)\b/;

const duTexte = (src) => [
  ...[...src.matchAll(/du: '((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]),
  ...[...src.matchAll(/du: "((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]),
];

describe('«du» klein', () => {
  it('findet die Du-Fassungen', () => {
    expect(duTexte(DE).length).toBeGreaterThan(900);
  });

  it('keine grosse Du-Form mitten im Satz', () => {
    const treffer = duTexte(DE).filter((v) => MITTEN.test(v)).map((v) => v.slice(0, 80));
    expect(treffer).toEqual([]);
  });

  it('erkennt den Fehler und lässt den Satzanfang in Ruhe', () => {
    expect(MITTEN.test('Starte mit Deinem Einkommen.')).toBe(true);
    expect(MITTEN.test('Wer zu deinem Haushalt gehört. Du kannst das später ändern.')).toBe(false);
    expect(MITTEN.test('Hinweis: Dein Lohn ist geschätzt.')).toBe(false);
  });
});
