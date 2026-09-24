// Jede Datei-Auswahl ist per Tastatur erreichbar.
//
// Bis 24.09.2026 trugen alle fünf `<input type="file">` in src/ `display:none`.
// Ein solches Feld bekommt keinen Fokus, das umgebende <label> ist nicht
// fokussierbar — per Tab liess sich keine Datei wählen: kein Dokument, kein
// KK-Kartenfoto, kein Budget- oder Steuer-Import, keine Sicherung zurückholen.
//
// Regel: jedes Datei-Feld ist nur OPTISCH versteckt (Klasse `mp-datei-eingang`,
// `visuallyHiddenStyle`), und tokens.css legt den Fokusring an sein Label.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(__dirname, '..');
const dateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === '__tests__' ? [] : dateien(p);
  return /\.jsx?$/.test(e.name) ? [p] : [];
});

// Das createElement-Objekt eines Datei-Felds: von `type: 'file'` bis zur schliessenden Klammer.
const dateiFelder = (quelltext) => {
  const aus = [];
  for (const m of quelltext.matchAll(/type:\s*'file'/g)) {
    const start = quelltext.lastIndexOf('{', m.index);
    let tiefe = 0, i = start;
    for (; i < quelltext.length; i++) {
      if (quelltext[i] === '{') tiefe++;
      else if (quelltext[i] === '}' && --tiefe === 0) break;
    }
    aus.push(quelltext.slice(start, i + 1));
  }
  return aus;
};

describe('Datei-Auswahl per Tastatur', () => {
  const felder = dateien(SRC).flatMap((p) =>
    dateiFelder(fs.readFileSync(p, 'utf8')).map((f) => [path.relative(SRC, p), f]));

  it('der Scan findet die Datei-Felder (sonst prüft er die leere Menge)', () => {
    expect(felder.length).toBeGreaterThanOrEqual(5);
  });

  it('kein Datei-Feld ist mit display:none versteckt', () => {
    expect(felder.filter(([, f]) => /display:\s*'none'/.test(f)).map(([p]) => p)).toEqual([]);
  });

  it('jedes Datei-Feld trägt die Klasse, an der der Fokusring hängt', () => {
    expect(felder.filter(([, f]) => !/className:\s*'mp-datei-eingang'/.test(f)).map(([p]) => p)).toEqual([]);
  });

  it('tokens.css zeigt den Ring am Label, wenn das Feld den Tastaturfokus hat', () => {
    const css = fs.readFileSync(path.join(SRC, 'tokens.css'), 'utf8');
    expect(css).toMatch(/label:has\(> input\.mp-datei-eingang:focus-visible\)\s*\{[^}]*outline:\s*2px solid var\(--mp-focus\)/);
  });
});
