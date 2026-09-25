import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { LIGHT_PALETTE, DARK_PALETTE, applyColorBlind } from '../config/constants.js';
import { astFarben } from '../utils/lebensbereichFruechte.js';
import {
  STATIONEN, WEGSTUECKE, AUSSCHNITT, SCHMAL_AB, kontrast, mitKontrast, bildPalette,
} from '../components/BergLandschaft.jsx';

// ─────────────────────────────────────────────────────────────
// Dashboard-Berge seit 25.09.2026: eine gemalte Landschaft (eigene Malojapass-Fotos →
// Codex-Illustration) statt drei halbtransparenter Grate. Das Bild bleibt auch im
// Dunkelmodus hell; jede Station liegt darauf in ihrer Kapitelfarbe. Die Zusagen, je als
// Test statt als Kommentar (Lehre K41: die Regel stand vierzig Zeilen unter der Deckkraft,
// die sie aufhob):
//   1. Das Kapitel-Zeichen im Knopf trägt ≥ 3:1 auf der Knopf-Fläche (WCAG 1.4.11) —
//      für jede Kapitelfarbe, auch im Farbenblind-Modus.
//   2. Im Dunkelmodus gilt die helle Palette (das Bild ist hell, also auch die Stationen).
//   3. Keine Deckkraft auf Knopf oder Etikett — sonst scheint das Bild durch.
//   4. Am kleinsten Handy überlappen sich die Knöpfe nicht und bleiben im Ausschnitt.
//   5. Die Wegstücke beginnen und enden genau an den Stationen.
// ─────────────────────────────────────────────────────────────

const KAPITEL = STATIONEN.map((s) => ({ key: s.key, title: s.key }));
const src = readFileSync(new URL('../components/BergLandschaft.jsx', import.meta.url), 'utf8');

describe('Berge · Kapitel-Zeichen tragen in ihrer Kapitelfarbe', () => {
  for (const [name, dunkelModus, farbenblind] of [
    ['hell', false, false], ['dunkel', true, false],
    ['hell, Farbenblind', false, true], ['dunkel, Farbenblind', true, true],
  ]) {
    it(`${name}: jedes Zeichen ≥ 3:1 auf der Knopf-Fläche`, () => {
      const app = applyColorBlind(dunkelModus ? DARK_PALETTE : LIGHT_PALETTE, farbenblind);
      const p = bildPalette(app);
      const farben = astFarben(KAPITEL, p, false);
      expect(Object.keys(farben)).toHaveLength(7);
      for (const [key, farbe] of Object.entries(farben)) {
        expect(kontrast(mitKontrast(farbe, p.surface, 3), p.surface), `${name} · ${key}: ${farbe}`).toBeGreaterThanOrEqual(3);
      }
    });
  }
  it('die Aufrufstelle nutzt das abgedunkelte Zeichen (nicht nur die Hilfsfunktion ist geprüft)', () => {
    expect(src).toMatch(/const zeichen = mitKontrast\(farbe, p\.surface, 3\)/);
    expect(src).toMatch(/background: p\.surface, border: rand, color: zeichen/);
  });
  it('Gegenprobe: ohne Abdunkeln fiele mindestens eine Kapitelfarbe unter 3:1 (sonst prüft der Test nichts)', () => {
    const farben = Object.values(astFarben(KAPITEL, LIGHT_PALETTE, false));
    expect(farben.some((f) => kontrast(f, LIGHT_PALETTE.surface) < 3)).toBe(true);
  });
  it('das Abdunkeln behält den Farbton (Finanzen bleibt golden, nur tiefer)', () => {
    const gold = '#C4A870';
    const tief = mitKontrast(gold, LIGHT_PALETTE.surface, 3);
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(tief.slice(i, i + 2), 16));
    expect(r).toBeGreaterThan(g);
    expect(g).toBeGreaterThan(b);
  });
});

describe('Berge · das Bild bleibt hell, also auch die Stationen', () => {
  it('im Dunkelmodus tragen die Stationen die helle Palette', () => {
    expect(bildPalette(DARK_PALETTE).surface).toBe(LIGHT_PALETTE.surface);
    expect(bildPalette(DARK_PALETTE).mid).toBe(LIGHT_PALETTE.mid);
  });
  it('der Farbenblind-Modus kommt trotzdem an', () => {
    const cb = bildPalette(applyColorBlind(DARK_PALETTE, true));
    expect(cb.colorBlind).toBe(true);
    expect(cb.surface).toBe(LIGHT_PALETTE.surface);
    expect(cb.sage).not.toBe(LIGHT_PALETTE.sage);
  });
  it('die Landschaft ist das detaillierte WebP und bleibt unter 120 KB (Budget, 25.09.2026: 87 KB)', () => {
    expect(src).toMatch(/import landschaft from '\.\.\/assets\/berge\/landschaft\.webp\?url'/);
    const bytes = readFileSync(new URL('../assets/berge/landschaft.webp', import.meta.url));
    expect(bytes.subarray(8, 12).toString('ascii')).toBe('WEBP');
    expect(bytes.length).toBeLessThan(120 * 1024);
  });
  it('es gibt nur noch eine Landschaft (keine dunkle Fassung mehr im Quelltext)', () => {
    expect(src).not.toMatch(/landschaft-dunkel|isDarkMode/);
  });
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
  const KNOPF = 26; // Handy-Knopf; WCAG 2.5.8 verlangt mindestens 24
  // Kleinste Breite, für die wir bauen: bei 320 px Fensterbreite gemessen 296 px Rahmen (25.09.2026).
  const breite = 296;
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
  it('jede Station hat eine Etikett-Seite für beide Ausschnitte', () => {
    for (const s of STATIONEN) {
      expect(['rechts', 'links', 'unten', 'oben', 'obenrechts', 'untenrechts'], s.key).toContain(s.seite.breit);
      expect(['rechts', 'links', 'unten', 'oben', 'obenrechts', 'untenrechts'], s.key).toContain(s.seite.schmal);
    }
  });
  it('alle sieben Kapitel haben eine Station, in der Reihenfolge der Kapitel', () => {
    expect(STATIONEN.map((s) => s.key)).toEqual(['basis', 'wohnen', 'finanzen', 'versicherungen', 'ausbildung', 'behoerden', 'notfall']);
  });
});

describe('Berge · Wegstücke verbinden die Stationen', () => {
  const zahlen = (d) => d.match(/-?\d+(\.\d+)?/g).map(Number);
  it('sechs Stücke für sieben Stationen', () => {
    expect(WEGSTUECKE).toHaveLength(STATIONEN.length - 1);
  });
  it('Stück i beginnt an Station i und endet nah an Station i+1 (verdeckte Stücke fehlen)', () => {
    WEGSTUECKE.forEach((d, i) => {
      const z = zahlen(d);
      const nah = (x, y, s, max) => Math.hypot(x - s.x, y - s.y) <= max;
      expect(nah(z[0], z[1], STATIONEN[i], 1), `Start ${i}`).toBe(true);
      // Ende: höchstens eine Tannenbreite vor der nächsten Station (dort geht der Weg dahinter durch)
      expect(nah(z[z.length - 2], z[z.length - 1], STATIONEN[i + 1], 25), `Ende ${i}`).toBe(true);
    });
  });
  it('die Stationen folgen der Route von unten nach oben (Notfall zuoberst)', () => {
    expect(STATIONEN[0].y).toBe(Math.max(...STATIONEN.map((s) => s.y)));
    expect(STATIONEN[6].y).toBe(Math.min(...STATIONEN.map((s) => s.y)));
  });
});
