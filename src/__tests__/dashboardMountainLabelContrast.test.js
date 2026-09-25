import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { LIGHT_PALETTE, DARK_PALETTE, applyColorBlind } from '../config/constants.js';

// ─────────────────────────────────────────────────────────────
// K41 (Bau-Liste §11) — Berg-Beschriftungen (Dashboard.jsx, className
// 'mountain-label'). Vorher: `color: palette.mid` bei `opacity: 0.5` (noch
// nicht begonnen) bzw. `0.75` (begonnen), direkt auf der Berg-SVG (bis zu drei
// gestapelte, halbtransparente sage-Flächen). Gerechnet (WCAG 2.1, relative
// luminance; derselbe Formel-Aufbau wie lebensbereiche.contrast.test.js, hier
// dupliziert statt importiert — es gibt kein gemeinsames Kontrast-Modul):
//   hell, mid@0.75 auf reiner Karte:        3.43:1
//   hell, mid@0.5  auf reiner Karte:        2.14:1
//   dunkel, mid@0.75 auf reiner Karte:      3.75:1
//   dunkel, mid@0.5  auf reiner Karte:      2.46:1
//   + auf den sage-getönten Bergflächen (bis zu 3 Lagen) weiter unter 4.5:1,
//     bis hinunter zu ~1.6:1 (dunkel, Farbenblind-Palette, tiefste Stelle).
// Alles unter der AA-Schwelle 4.5:1 (13px = "normal", nicht "gross").
//
// Fix: volle Deckkraft (kein maturity-abhängiges opacity mehr) auf einer
// eigenen, undurchsichtigen Fläche (background: palette.surface — dieselbe
// Fläche wie die Karte, unabhängig von der Berg-Position). `mid` auf `surface`
// ist laut Konstanten-Kommentar für genau das gebaut (≥4.5:1 auf allen
// dokumentierten Flächen). «Noch nicht begonnen» bleibt über Kursiv (Form)
// erkennbar, nicht mehr über reduzierte Deckkraft (Farbe allein reicht nicht,
// a11y-pruefer: Form + Farbe).
// ─────────────────────────────────────────────────────────────

function luminanz(hex) {
  const h = hex.replace('#', '');
  const kanal = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * kanal[0] + 0.7152 * kanal[1] + 0.0722 * kanal[2];
}
function kontrast(a, b) {
  const la = luminanz(a), lb = luminanz(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const AA_TEXT = 4.5; // WCAG 2.1 AA, 13px normal (nicht "gross")

describe('K41 · Berg-Beschriftung: mid auf der eigenen Fläche trägt AA', () => {
  it('hell: mid auf surface ≥ 4.5:1', () => {
    expect(kontrast(LIGHT_PALETTE.mid, LIGHT_PALETTE.surface)).toBeGreaterThanOrEqual(AA_TEXT);
  });
  it('dunkel: mid auf surface ≥ 4.5:1', () => {
    expect(kontrast(DARK_PALETTE.mid, DARK_PALETTE.surface)).toBeGreaterThanOrEqual(AA_TEXT);
  });
  it('hell, Farbenblind-Palette: mid und surface bleiben unverändert (also weiter ≥ 4.5:1)', () => {
    const p = applyColorBlind(LIGHT_PALETTE, true);
    expect(p.mid).toBe(LIGHT_PALETTE.mid);
    expect(p.surface).toBe(LIGHT_PALETTE.surface);
    expect(kontrast(p.mid, p.surface)).toBeGreaterThanOrEqual(AA_TEXT);
  });
  it('dunkel, Farbenblind-Palette: mid und surface bleiben unverändert (also weiter ≥ 4.5:1)', () => {
    const p = applyColorBlind(DARK_PALETTE, true);
    expect(p.mid).toBe(DARK_PALETTE.mid);
    expect(p.surface).toBe(DARK_PALETTE.surface);
    expect(kontrast(p.mid, p.surface)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  // Gegenprobe: das alte Muster (reduzierte Deckkraft auf der reinen Kartenfarbe,
  // günstigster Fall ohne jede sage-Tönung) lag bereits unter AA — die Berg-SVG
  // selbst macht es nur noch schlechter. Blend-Formel wie im Kontrast-Bericht.
  function blend(fgHex, bgHex, alpha) {
    const c = (hex) => [0, 2, 4].map((i) => parseInt(hex.replace('#', '').slice(i, i + 2), 16));
    const [fr, fg, fb] = c(fgHex), [br, bg, bb] = c(bgHex);
    const mix = (f, b) => f * alpha + b * (1 - alpha);
    const hex2 = (v) => Math.round(v).toString(16).padStart(2, '0');
    return '#' + hex2(mix(fr, br)) + hex2(mix(fg, bg)) + hex2(mix(fb, bb));
  }
  it('Gegenprobe: das alte 0.5/0.75-Deckkraft-Muster fiel selbst auf reiner Kartenfarbe unter AA', () => {
    expect(kontrast(blend(LIGHT_PALETTE.mid, LIGHT_PALETTE.surface, 0.75), LIGHT_PALETTE.surface)).toBeLessThan(AA_TEXT);
    expect(kontrast(blend(LIGHT_PALETTE.mid, LIGHT_PALETTE.surface, 0.5), LIGHT_PALETTE.surface)).toBeLessThan(AA_TEXT);
    expect(kontrast(blend(DARK_PALETTE.mid, DARK_PALETTE.surface, 0.75), DARK_PALETTE.surface)).toBeLessThan(AA_TEXT);
    expect(kontrast(blend(DARK_PALETTE.mid, DARK_PALETTE.surface, 0.5), DARK_PALETTE.surface)).toBeLessThan(AA_TEXT);
  });
});

// Quell-Scan als Regressionswache: verhindert, dass die Deckkraft-Reduktion für
// 'mountain-label' (der eigentliche Kontrast-Fehler) unbemerkt zurückkommt, und
// dass die Kursiv-Unterscheidung («noch nicht begonnen» = Form, nicht nur Farbe)
// wieder verschwindet.
// Seit 25.09.2026 wohnen die Berge in components/BergLandschaft.jsx (Landschaft aus der
// Codex-Illustration); das Etikett zog mit, die Regel bleibt dieselbe.
describe('K41 · Quell-Scan (BergLandschaft.jsx, mountain-label)', () => {
  const src = readFileSync(new URL('../components/BergLandschaft.jsx', import.meta.url), 'utf8');
  const start = src.indexOf("className: 'mountain-label'");
  const block = src.slice(start, start + 1700);

  it('mountain-label existiert noch an der erwarteten Stelle', () => {
    expect(start).toBeGreaterThan(-1);
  });

  it('keine maturity-abhängige Deckkraft-Reduktion mehr auf dem Label', () => {
    expect(block).not.toMatch(/opacity:\s*maturity/);
  });

  it('eine eigene, undurchsichtige Fläche trägt den Kontrast (background: palette.surface)', () => {
    // Seit 25.09.2026 heisst die Palette dort `p` (immer die helle, das Bild bleibt hell).
    expect(block).toMatch(/background:\s*(palette|p)\.surface/);
  });

  it('«noch nicht begonnen» bleibt über Form erkennbar (fontStyle, nicht nur Farbe)', () => {
    expect(block).toMatch(/fontStyle:\s*maturity === 'sketch' \? 'italic'/);
  });
});
