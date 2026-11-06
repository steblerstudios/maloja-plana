// Kicker in Normalschrift (Fassung 9, F9-A4, Stebler Studios 05.11.2026: «Normalschrift»).
// Grossbuchstaben-Kicker über Kästen wirken nach Software, nicht nach ruhigem Lebensort.
// Keine Ansicht setzt mehr textTransform uppercase. Ausnahmen mit Grund:
// - Kalenderblatt: Monatskürzel im Kalenderblatt-Symbol («NOV»), Bildzeichen, kein Text-Label
//   (bis 06.11.2026 stand das Blatt direkt in BehoerdenInstrument; seit F9-A14 ein eigener Baustein)
// - LebenslaufVorschau: Vorschau des gedruckten Lebenslaufs, folgt der Lebenslauf-Vorlage (cvGenerator)
// Die statischen Seiten (scripts/build-seiten.mjs) folgen derselben Regel. Die fremden bewegten
// Figuren (scripts/seiten/figuren/bewegt/fremd/) bleiben unverändert, sie sind übernommen.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(__dirname, '..');
const AUSNAHMEN = new Set(['components/Kalenderblatt.jsx', 'components/LebenslaufVorschau.jsx']);

const dateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === '__tests__' || e.name === 'vendor' ? [] : dateien(p);
  return /\.jsx$/.test(e.name) ? [p] : [];
});

describe('Kicker in Normalschrift', () => {
  it('Eyebrow setzt keine Grossbuchstaben', () => {
    const src = fs.readFileSync(path.join(SRC, 'components/Heading.jsx'), 'utf8');
    expect(src).not.toMatch(/textTransform:\s*'uppercase'/);
  });

  it('keine Ansicht setzt textTransform uppercase', () => {
    const treffer = [];
    for (const datei of dateien(SRC)) {
      const rel = path.relative(SRC, datei).split(path.sep).join('/');
      if (AUSNAHMEN.has(rel)) continue;
      const src = fs.readFileSync(datei, 'utf8');
      if (/textTransform:\s*'uppercase'|text-transform:\s*uppercase/.test(src)) treffer.push(rel);
    }
    expect(treffer).toEqual([]);
  });

  it('die statischen Seiten setzen keine Grossbuchstaben-Kicker', () => {
    const gen = fs.readFileSync(path.resolve(SRC, '..', 'scripts/build-seiten.mjs'), 'utf8');
    expect(gen).not.toMatch(/text-transform:\s*uppercase/);
  });
});
