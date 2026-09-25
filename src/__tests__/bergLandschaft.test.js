import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { LIGHT_PALETTE, DARK_PALETTE, applyColorBlind } from '../config/constants.js';
import { STATIONEN, AUSSCHNITT, SCHMAL_AB } from '../components/BergLandschaft.jsx';

// ─────────────────────────────────────────────────────────────
// Dashboard-Berge seit 25.09.2026: eine gemalte Landschaft (eigene Malojapass-Fotos →
// Codex-Illustration) statt drei halbtransparenter Grate. Damit liegt jede Station auf
// einem Bild, dessen Farben wir nicht kennen — also darf ihr Kontrast nie am Bild hängen.
// Drei Zusagen, je als Test statt als Kommentar (Lehre K41: die Regel stand vierzig
// Zeilen unter der Deckkraft, die sie aufhob):
//   1. Das Kapitel-Zeichen im Knopf trägt ≥ 3:1 auf der eigenen Knopf-Fläche (WCAG 1.4.11).
//   2. Keine Deckkraft auf Knopf oder Etikett — sonst scheint das Bild durch.
//   3. Am kleinsten Handy überlappen sich die Knöpfe nicht und bleiben im Ausschnitt.
// ─────────────────────────────────────────────────────────────

function luminanz(hex) {
  const h = hex.replace('#', '');
  const kanal = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * kanal[0] + 0.7152 * kanal[1] + 0.0722 * kanal[2];
}
const kontrast = (a, b) => {
  const la = luminanz(a), lb = luminanz(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const PALETTEN = {
  hell: LIGHT_PALETTE,
  dunkel: DARK_PALETTE,
  'hell, Farbenblind': applyColorBlind(LIGHT_PALETTE, true),
  'dunkel, Farbenblind': applyColorBlind(DARK_PALETTE, true),
};

const src = readFileSync(new URL('../components/BergLandschaft.jsx', import.meta.url), 'utf8');

describe('Berge · Stations-Zeichen tragen auf ihrer eigenen Fläche', () => {
  // Die Farben, die der Quelltext je Reifestufe setzt — aus dem Quelltext gelesen, damit
  // der Test mitgeht, wenn jemand dort eine Farbe tauscht.
  const stufen = [...src.matchAll(/(sketch|emerging|maturing|complete): \{ bg: palette\.(\w+), border: [^,]+, color: palette\.(\w+) \}/g)]
    .map(([, stufe, bg, color]) => ({ stufe, bg, color }));

  it('alle vier Reifestufen sind gefunden (sonst prüft der Test die leere Menge)', () => {
    expect(stufen.map((s) => s.stufe)).toEqual(['sketch', 'emerging', 'maturing', 'complete']);
  });

  for (const [name, p] of Object.entries(PALETTEN)) {
    it(`${name}: jedes Kapitel-Zeichen ≥ 3:1 auf der Knopf-Fläche`, () => {
      for (const { stufe, bg, color } of stufen) {
        expect(p[bg], `${stufe}: ${bg}`).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(kontrast(p[color], p[bg]), `${name} · ${stufe}: ${color} auf ${bg}`).toBeGreaterThanOrEqual(3);
      }
    });
  }
});

describe('Berge · keine Deckkraft auf Knopf oder Etikett', () => {
  const block = src.slice(src.indexOf('STATIONEN.map((station'));

  it('der Stationen-Block ist gefunden', () => {
    expect(block.length).toBeGreaterThan(500);
  });
  it('weder Knopf noch Etikett noch Hülle setzen opacity', () => {
    expect(block).not.toMatch(/opacity/);
  });
  it('der Rahmen um alles setzt keine opacity (eine Ebene höher hebelt sonst alles aus)', () => {
    const rahmen = src.slice(src.indexOf("'data-tour': 'berge'"), src.indexOf("React.createElement('svg'"));
    expect(rahmen).not.toMatch(/opacity|filter/);
  });
});

describe('Berge · Stationen passen in den Handy-Ausschnitt', () => {
  const a = AUSSCHNITT.schmal;
  const KNOPF = 28;
  // Kleinste Breite, für die wir bauen, abzüglich des Seitenrands (16 px je Seite, −8 px Rahmen-Überstand).
  const breite = 320 - 2 * 16 + 2 * 8;
  const massstab = breite / a.w;
  const orte = STATIONEN.map((s) => [(s.x - a.x) * massstab, (s.y - a.y) * massstab]);

  it('der schmale Ausschnitt gilt unterhalb der Schwelle, die das kleinste Handy erreicht', () => {
    expect(breite).toBeLessThan(SCHMAL_AB);
  });
  it('jede Station liegt ganz im Bild (halber Knopf Luft zum Rand)', () => {
    const hoehe = a.h * massstab;
    for (const [i, [x, y]] of orte.entries()) {
      expect(x, STATIONEN[i].key).toBeGreaterThanOrEqual(KNOPF / 2);
      expect(x, STATIONEN[i].key).toBeLessThanOrEqual(breite - KNOPF / 2);
      expect(y, STATIONEN[i].key).toBeGreaterThanOrEqual(KNOPF / 2);
      expect(y, STATIONEN[i].key).toBeLessThanOrEqual(hoehe - KNOPF / 2);
    }
  });
  it('keine zwei Knöpfe überlappen sich (Abstand der Mitten ≥ Knopfgrösse)', () => {
    for (let i = 0; i < orte.length; i++) {
      for (let j = i + 1; j < orte.length; j++) {
        const d = Math.hypot(orte[i][0] - orte[j][0], orte[i][1] - orte[j][1]);
        expect(d, `${STATIONEN[i].key} ↔ ${STATIONEN[j].key}`).toBeGreaterThanOrEqual(KNOPF);
      }
    }
  });
  it('alle sieben Kapitel haben eine Station, in der Reihenfolge der Kapitel', () => {
    expect(STATIONEN.map((s) => s.key)).toEqual(['basis', 'wohnen', 'finanzen', 'versicherungen', 'ausbildung', 'behoerden', 'notfall']);
  });
});
