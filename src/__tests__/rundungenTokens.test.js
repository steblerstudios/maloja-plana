import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { radius } from '../config/tokens.js';

// Rundungen kommen aus der Skala (config/tokens.js), nicht als rohe px-Werte (25.09.2026).
// Drei Zusagen, jede hat vorher gebrochen:
//  1. Kein Aufruf eines Tokens, das es nicht gibt — `radius.pill` stand an vier Stellen und
//     fiel still auf 10 px zurück (IDEEN §15).
//  2. Kein Token ohne Einheit in einer zusammengesetzten Angabe — `radius.sm + ' ' + …`
//     ergab '6 6 0 0', das der Browser verwirft: die Säulen im Steuervergleich hatten
//     gar keine gerundeten Ecken.
//  3. Keine rohen px-Zahlen. Ausnahmen stehen HIER, mit Grund — nicht still im Code.
const AUSNAHMEN = {
  // Wird am 25.09.2026 parallel umgebaut (Berg-Hero, eine andere Sitzung). Nachziehen,
  // sobald der Umbau gemergt ist.
  'Dashboard.jsx': "'4px'",
};

const src = fileURLToPath(new URL('..', import.meta.url));
const dateien = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  if (statSync(p).isDirectory()) return n === '__tests__' ? [] : dateien(p);
  return n.endsWith('.jsx') ? [p] : [];
});

const angaben = dateien(src).flatMap((p) => {
  const name = p.slice(src.length).replace(/^\//, '');
  return [...readFileSync(p, 'utf8').matchAll(/borderRadius: *([^,}\n]+)/g)]
    .map((m) => ({ name, wert: m[1].trim() }));
});

describe('Rundungen aus der Skala', () => {
  it('findet überhaupt Angaben', () => {
    expect(angaben.length).toBeGreaterThan(500);
  });

  it('jedes benutzte Token gibt es', () => {
    const falsch = angaben.flatMap(({ name, wert }) =>
      [...wert.matchAll(/radius\.([a-zA-Z]+)/g)]
        .filter((m) => !(m[1] in radius))
        .map((m) => name + ': radius.' + m[1]));
    expect(falsch).toEqual([]);
  });

  it('ein Token in einer zusammengesetzten Angabe trägt seine Einheit', () => {
    const ohneEinheit = angaben
      .filter(({ wert }) => /radius\.[a-z]+ *\+ *'(?!px)/.test(wert))
      .map(({ name, wert }) => name + ': ' + wert);
    expect(ohneEinheit).toEqual([]);
  });

  it('keine rohen px-Zahlen ausser den benannten Ausnahmen', () => {
    const roh = angaben
      .filter(({ wert }) => /'[^']*[1-9][0-9]*px/.test(wert))
      .filter(({ name, wert }) => AUSNAHMEN[name.split('/').pop()] !== wert)
      .map(({ name, wert }) => name + ': ' + wert);
    expect(roh).toEqual([]);
  });
});
