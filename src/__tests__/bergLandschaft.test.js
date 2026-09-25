import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { LIGHT_PALETTE, DARK_PALETTE, applyColorBlind } from '../config/constants.js';
import { astFarben } from '../utils/lebensbereichFruechte.js';
import {
  STATIONEN, WEGSTUECKE, WEG_VON, AUSSCHNITT, SCHMAL_AB, kontrast, mitKontrast, bildPalette,
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

describe('Berge · Etiketten am 296-px-Handy überschneiden sich nicht (deutsche Kurzlabels)', () => {
  // Etikettbreite bei 11 px, im Browser gemessen am 25.09.2026: «Ausbildung» 80, «Versicherung» 90,
  // «Finanzen» 68 px → ≈ 6,2 px je Zeichen + 18 px (Polster, Farbpunkt, Abstand). Höhe 15 px.
  const LABEL = { basis: 'Basis', wohnen: 'Wohnen', finanzen: 'Finanzen', versicherungen: 'Versicherung', ausbildung: 'Ausbildung', behoerden: 'Behörden', notfall: 'Notfall' };
  const a = AUSSCHNITT.schmal, breite = 296, s = breite / a.w, hoehe = a.h * s, K = 26, H = 15;
  const kasten = (st) => {
    const x = (st.x - a.x) * s, y = (st.y - a.y) * s, w = LABEL[st.key].length * 6.2 + 18;
    return {
      rechts: [x + K / 2 + 4, y - H / 2, w, H], links: [x - K / 2 - 4 - w, y - H / 2, w, H],
      unten: [x - w / 2, y + K / 2 + 3, w, H], oben: [x - w / 2, y - K / 2 - 3 - H, w, H],
      untenrechts: [x - K / 2 - 4, y + K / 2 + 3, w, H], obenrechts: [x - K / 2 - 4, y - K / 2 - 3 - H, w, H],
    }[st.seite.schmal];
  };
  const knopf = (st) => [(st.x - a.x) * s - K / 2, (st.y - a.y) * s - K / 2, K, K];
  const ueber = ([x1, y1, w1, h1], [x2, y2, w2, h2]) => x1 < x2 + w2 && x2 < x1 + w1 && y1 < y2 + h2 && y2 < y1 + h1;
  it('jedes Etikett liegt im Bild', () => {
    for (const st of STATIONEN) {
      const [x, y, w, h] = kasten(st);
      expect(x >= 0 && y >= 0 && x + w <= breite && y + h <= hoehe, st.key).toBe(true);
    }
  });
  it('kein Etikett liegt auf einem anderen Etikett oder einem fremden Knopf', () => {
    STATIONEN.forEach((st, i) => STATIONEN.forEach((an, j) => {
      if (i === j) return;
      if (j > i) expect(ueber(kasten(st), kasten(an)), `${st.key} ↔ ${an.key}`).toBe(false);
      expect(ueber(kasten(st), knopf(an)), `${st.key} auf Knopf ${an.key}`).toBe(false);
    }));
  });
});

describe('Berge · Wegstücke verbinden die Stationen', () => {
  const zahlen = (d) => d.match(/-?\d+(\.\d+)?/g).map(Number);
  const nah = (x, y, s, max) => Math.hypot(x - s.x, y - s.y) <= max;
  it('sechs Stücke für sieben Stationen, je mit Ausgangsstation', () => {
    expect(WEGSTUECKE).toHaveLength(STATIONEN.length - 1);
    expect(WEG_VON).toHaveLength(WEGSTUECKE.length);
  });
  it('Stück i beginnt und endet nah an seinen Stationen (verdeckte Stücke fehlen)', () => {
    WEGSTUECKE.forEach((d, i) => {
      const z = zahlen(d);
      // Start: an der Ausgangsstation, höchstens eine Tannenbreite dahinter (dort beginnt er verdeckt)
      // (Stück 5 zum Notfall beginnt bewusst erst, wo die Strasse ins Bild kommt — eigener Test)
      if (i !== 5) expect(nah(z[0], z[1], STATIONEN[WEG_VON[i]], 32), `Start ${i}`).toBe(true);
      expect(nah(z[z.length - 2], z[z.length - 1], STATIONEN[i + 1], 25), `Ende ${i}`).toBe(true);
    });
  });
  it('der Weg zur Ausbildung läuft nicht durch die Basis (dort ausgeblendet, Umkreis 45 Einheiten)', () => {
    const z = zahlen(WEGSTUECKE[3]);
    for (let k = 0; k < z.length; k += 2) expect(nah(z[k], z[k + 1], STATIONEN[0], 45), `Punkt ${z[k]} ${z[k + 1]}`).toBe(false);
  });
  it('der Weg von Behörden zum Notfall taucht unter der oberen Strasse durch (Schlaufe unten ausgeblendet)', () => {
    const z = zahlen(WEGSTUECKE[5]);
    for (let k = 0; k < z.length; k += 2) {
      const [x, y] = [z[k], z[k + 1]];
      expect(y > 586 || (x < 340 && y > 564), `Punkt ${x} ${y} liegt in der Schlaufe`).toBe(false);
    }
  });
  it('der Weg nach Versicherungen endet unter der Behörden-Beschriftung (nichts zwischen x 205 und 325)', () => {
    const z = zahlen(WEGSTUECKE[3]);
    for (let k = 0; k < z.length; k += 2) expect(z[k] > 205 && z[k] < 325, `Punkt ${z[k]} ${z[k + 1]}`).toBe(false);
  });
  it('der Weg nach Versicherungen läuft hinter der Tanne weiter (nicht zu kurz, bis x ≤ 335)', () => {
    const xs = zahlen(WEGSTUECKE[3]).filter((_, k) => k % 2 === 0 && _ > 205);
    expect(Math.min(...xs)).toBeLessThanOrEqual(335);
  });
  it('von Wohnen führt EINE Linie bis zur Tanne (kein abgesetztes Stückchen dazwischen)', () => {
    const teile = WEGSTUECKE[1].split('M').filter(Boolean).map((t) => zahlen('M' + t));
    const vorDerTanne = teile.filter((z) => z[0] < 420);
    expect(vorDerTanne).toHaveLength(1);
  });
  it('zwischen Tanne und Behörden liegt der Weg auf der Fahrbahnmitte, nicht am oberen Rand', () => {
    const z = zahlen(WEGSTUECKE[3]);
    for (let k = 0; k < z.length; k += 2) if (z[k] >= 325 && z[k] <= 370) expect(z[k + 1], `x ${z[k]}`).toBeGreaterThan(600);
  });
  it('das Stück unten in der U-Kurve zwischen den Tannen ist da', () => {
    expect(zahlen(WEGSTUECKE[1]).some((v, k, z) => k % 2 === 0 && v > 420 && v < 470 && z[k + 1] > 715)).toBe(true);
  });
  it('der Weg zum Notfall beginnt an der Einmündung der rechten Strasse, nicht am Behörden-Knopf', () => {
    const z = zahlen(WEGSTUECKE[5]);
    expect(z[0]).toBeGreaterThan(340);
    expect(z[1]).toBeGreaterThan(575);
    expect(nah(z[0], z[1], STATIONEN[5], 60)).toBe(false);
  });
  it('eine durchgehende Route; Basis und Ausbildung sind nicht direkt verbunden (dort geht keine Strasse durch)', () => {
    expect(WEG_VON).toEqual([0, 1, 2, 3, 4, 5]);
    const z = zahlen(WEGSTUECKE[3]);
    expect(nah(z[0], z[1], STATIONEN[0], 20), 'der Weg zur Ausbildung beginnt nicht bei der Basis').toBe(false);
  });

});

// Seit 25.09.2026 steht die Fortschritts-Zeile («7 von 7 begonnen · 63%») als Schildchen im
// Bild. Text auf dem Bild: ≥ 4.5:1 (WCAG 1.4.3), in jedem Modus — die helle Palette gilt auch
// im Dunkelmodus. Und keine Deckkraft am Schildchen, sonst hängt der Kontrast am Bild dahinter.
describe('Berge · Fortschritt im Bild', () => {
  for (const [name, dunkelModus, farbenblind] of [
    ['hell', false, false], ['dunkel', true, false],
    ['hell, Farbenblind', false, true], ['dunkel, Farbenblind', true, true],
  ]) {
    it(`${name}: Text und Prozent ≥ 4.5:1 auf dem Schildchen`, () => {
      const p = bildPalette(applyColorBlind(dunkelModus ? DARK_PALETTE : LIGHT_PALETTE, farbenblind));
      expect(kontrast(p.mid, p.surface)).toBeGreaterThanOrEqual(4.5);
      expect(kontrast(p.sageDeep, p.surface)).toBeGreaterThanOrEqual(4.5);
    });
  }

  it('die Schildchen haben undurchsichtigen Grund und keine Deckkraft', () => {
    const block = src.slice(src.indexOf('const schild = {'), src.indexOf('// Kapitel-Stationen auf der Strasse'));
    expect(block.length).toBeGreaterThan(100);
    expect(block).toContain('background: p.surface');
    expect(block).not.toMatch(/opacity/);
  });
});

// Seit 25.09.2026 ist die Landschaft der Hero und trägt den Anspruch als Titel im Himmel.
// Links bündig gemessen im Browser an den Bildpunkten hinter dem Text (320–736 px): jeder
// Punkt ≥ 3:1 (schlechtester 3,05:1; gross + fett braucht 3:1, WCAG 1.4.3). Das gilt nur,
// solange der Text selbst voll deckt und nichts dahinter liegt — darum hier: keine Deckkraft,
// kein heller Schein (er zeigte sich am dunklen Hang als weisser Fleck), helle Palette.
describe('Berge · Titel im Himmel', () => {
  it('der Titel trägt keine Deckkraft, keinen Schein und die Textfarbe der hellen Palette', () => {
    const block = src.slice(src.indexOf("'data-testid': 'berg-titel'"), src.indexOf('}, titel)'));
    expect(block.length).toBeGreaterThan(100);
    expect(block).toContain('color: p.text');
    expect(block).not.toMatch(/opacity/);
    expect(block).not.toMatch(/textShadow/);
  });

  it('die Ausschnitte reichen oben in den Himmel (breit) bzw. in die Gipfel (schmal)', () => {
    expect(AUSSCHNITT.breit.y).toBe(0);
    expect(AUSSCHNITT.schmal.y).toBeLessThanOrEqual(130);
  });
});
