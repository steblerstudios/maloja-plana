// Seitentitel aus einem Guss (Fassung 9, F9-A1, Stebler Studios 05.11.2026).
// Vorgeschichte: 27.10.2026 «Kopf-Titel 30 px in der Display-Schrift wie Entwurf G, und die
// Kapitel-Köpfe genauso angleichen». Bis Fassung 9 stand das Rezept als Überschreibung in drei
// Köpfen, die übrigen Seiten blieben bei Lexend 28 px. Jetzt trägt PageTitle das Rezept selbst,
// und keine Seite darf Schrift, Grösse, Zeilenhöhe oder Laufweite überschreiben.
// Einzige Ausnahme: der grosse Titel über der Berglandschaft (eigene, grössere Bühne).
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SEITENTITEL_STIL } from '../components/Heading.jsx';

const SRC = path.resolve(__dirname, '..');
const AUSNAHMEN = new Set(['components/BergLandschaft.jsx']);
const VERBOTEN = /\b(fontFamily|fontSize|lineHeight|letterSpacing|fontWeight)\s*:/;

const dateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === '__tests__' || e.name === 'vendor' ? [] : dateien(p);
  return /\.jsx?$/.test(e.name) ? [p] : [];
});

// Liefert den Text des Props-Objekts jedes PageTitle-Aufrufs (Klammern gezählt).
const titelAufrufe = (src) => {
  const out = [];
  const re = /(?:createElement|\bh)\(PageTitle,\s*\{/g;
  let m;
  while ((m = re.exec(src))) {
    let i = m.index + m[0].length, tiefe = 1;
    while (i < src.length && tiefe > 0) { if (src[i] === '{') tiefe++; else if (src[i] === '}') tiefe--; i++; }
    out.push(src.slice(m.index, i));
  }
  return out;
};

describe('Seitentitel: ein Rezept für alle Seiten', () => {
  it('PageTitle trägt Hanken 30 px', () => {
    expect(SEITENTITEL_STIL.fontFamily).toMatch(/Hanken Grotesk/);
    expect(SEITENTITEL_STIL.fontSize).toBe('30px');
  });

  it('keine Seite überschreibt Schrift, Grösse, Zeilenhöhe oder Laufweite', () => {
    const verstoesse = [];
    let gezaehlt = 0;
    for (const datei of dateien(SRC)) {
      const rel = path.relative(SRC, datei).split(path.sep).join('/');
      if (AUSNAHMEN.has(rel)) continue;
      for (const aufruf of titelAufrufe(fs.readFileSync(datei, 'utf8'))) {
        gezaehlt++;
        if (VERBOTEN.test(aufruf)) verstoesse.push(rel + ': ' + aufruf.slice(0, 120));
      }
    }
    expect(gezaehlt).toBeGreaterThan(25);
    expect(verstoesse).toEqual([]);
  });
});
