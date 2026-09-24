// Eine bildschirmfüllende Fläche hat eine MINDEST-Höhe, keine feste.
//
// Warum: `height: 100vh` + `align-items: center` schiebt eine Karte, die höher ist
// als der Schirm, über die obere Kante — und nach oben führt kein Scrollweg.
// Zweimal passiert: am Fehlerschirm (ErrorBoundary.jsx, behoben 23.09.2026) und an
// allen vier Schritten der Einführung (Onboarding.jsx, gemessen 24.09.2026 bei
// 375×520: Karte bei −92 px, Schrittanzeige, «Zurück» und Titel unerreichbar).
//
// Geprüft wird die Regel, nicht die zwei Fundstellen: keine Datei in src/ setzt
// eine feste Vollbild-Höhe (`height: '100vh'` / `'100dvh'`). `minHeight` ist frei.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve(__dirname, '..');

const dateien = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === '__tests__' ? [] : dateien(p);
  return /\.(jsx?|css)$/.test(e.name) ? [p] : [];
});

// JS-Stil (`height: '100vh'`) und CSS (`height: 100vh;`) — nicht `min-height`/`minHeight`.
const FEST = /(?<![-\w])height\s*:\s*['"]?100d?vh\b/g;

const treffer = (quelltext) => [...quelltext.matchAll(FEST)].length;

describe('Vollbild-Flächen schneiden nichts ab', () => {
  const alle = dateien(SRC);

  it('der Scan sieht die Dateien, um die es geht (sonst prüft er die leere Menge)', () => {
    const namen = alle.map((p) => path.basename(p));
    expect(namen).toEqual(expect.arrayContaining(['Onboarding.jsx', 'ErrorBoundary.jsx', 'BetaGate.jsx']));
  });

  it('das Muster erkennt den alten Fehler und lässt minHeight durch', () => {
    expect(treffer("style: { width: '100vw', height: '100vh', alignItems: 'center' }")).toBe(1);
    expect(treffer('.x { height: 100dvh; }')).toBe(1);
    expect(treffer("style: { minHeight: '100dvh' }")).toBe(0);
    expect(treffer('.x { min-height: 100vh; }')).toBe(0);
    expect(treffer("style: { lineHeight: '100vh' }")).toBe(0);
  });

  it('keine Datei in src/ setzt eine feste Vollbild-Höhe', () => {
    const befund = alle
      .map((p) => [path.relative(SRC, p), treffer(fs.readFileSync(p, 'utf8'))])
      .filter(([, n]) => n > 0);
    expect(befund).toEqual([]);
  });
});
