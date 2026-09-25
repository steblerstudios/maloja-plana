import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { blendeEin } from '../utils/einblenden.js';

// Leises Einblenden beim Ansichtswechsel (25.09.2026). Zusagen: nur Deckkraft (kein
// transform — das würde position:fixed in <main> mitziehen), nie bei «Zurück», und still
// bei reduzierter Bewegung — Letzteres über den globalen CSS-Block, darum hier geprüft,
// dass die Animation wirklich eine CSS-Animation ist, die dieser Block erfasst.
const css = readFileSync(fileURLToPath(new URL('../tokens.css', import.meta.url)), 'utf8');

const attrappe = () => {
  const klassen = new Set();
  const protokoll = [];
  return {
    klassen, protokoll, offsetWidth: 0,
    classList: {
      add: (k) => { klassen.add(k); protokoll.push('+' + k); },
      remove: (k) => { klassen.delete(k); protokoll.push('-' + k); },
    },
  };
};

describe('blendeEin', () => {
  it('setzt die Klasse neu, damit die Animation auch beim zweiten Mal startet', () => {
    const el = attrappe();
    expect(blendeEin(el)).toBe(true);
    expect(blendeEin(el)).toBe(true);
    expect(el.protokoll).toEqual(['-mp-einblenden', '+mp-einblenden', '-mp-einblenden', '+mp-einblenden']);
  });

  it('nicht nach «Zurück»', () => {
    const el = attrappe();
    expect(blendeEin(el, { zurueck: true })).toBe(false);
    expect(el.protokoll).toEqual([]);
  });

  it('ohne Element kein Fehler', () => {
    expect(blendeEin(null)).toBe(false);
    expect(blendeEin({})).toBe(false);
  });
});

describe('CSS der Einblendung', () => {
  const regel = css.match(/\.mp-einblenden \{([^}]*)\}/);
  const name = regel && regel[1].match(/animation:\s*([a-zA-Z-]+)/)[1];
  const keyframes = name && css.match(new RegExp('@keyframes ' + name + ' \\{([\\s\\S]*?)\\n\\}'));

  it('die Klasse hat eine Animation, und ihre Keyframes gibt es', () => {
    expect(name).toBeTruthy();
    expect(keyframes).not.toBeNull();
  });

  it('die Keyframes ändern nur die Deckkraft', () => {
    expect(keyframes[1]).toMatch(/opacity/);
    expect(keyframes[1]).not.toMatch(/transform|translate|scale/);
  });

  it('der Block für reduzierte Bewegung erfasst CSS-Animationen (Gerät und App-Schalter)', () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?animation-duration: 0\.01ms !important/);
    expect(css).toMatch(/:root\[data-reduce-motion="1"\] \*[\s\S]*?animation-duration: 0\.01ms !important/);
  });
});
