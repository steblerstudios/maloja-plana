import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { LIGHT_PALETTE, DARK_PALETTE } from '../config/constants.js';

// ─────────────────────────────────────────────────────────────
// Baum3D · die Tiefenwirkung kommt aus einer geprüften Farbe, nicht aus Deckkraft.
//
// Die Marken am räumlichen Lebensbaum unterscheiden vorne und hinten über
// `m.vorne` — ein Skalarprodukt gegen die Blickrichtung (Zeile ~719), also reine
// Geometrie. Der Container trug dafür `opacity: m.vorne ? 1 : 0.34`. Das
// multiplizierte JEDE Textfarbe darin mit 0.34 und hob damit die Regel auf, die
// vierzig Zeilen weiter unten an der Prozentzahl steht («Feste Farbe statt
// opacity: Deckkraft auf Text senkt den Kontrast unkontrolliert»).
//
// Im Browser gemessen (Demo-Profil, 390×844, Hellmodus):
//   vorher  hinten: Name 2.03:1 · Prozentzahl 1.64:1
//   nachher hinten: Name 5.91:1 · Prozentzahl 5.91:1   (vorne unverändert 14.43:1)
// 1.64:1 lag unter den 3:1, die selbst für nicht-textliche Grafik gelten — und
// betraf zu jedem Zeitpunkt rund die Hälfte der acht Äste.
//
// 🛑 Warum dieser Test eigens nötig ist: `deckkraftFrisstKontrast.test.js` sucht
// Deckkraft auf Zeilen, die selbst eine Schriftgrösse tragen. Hier sass sie auf
// einem CONTAINER ohne Schriftgrösse und wirkte auf die Kinder. Diesen Fall kann
// die allgemeine Abtastung statisch nicht sehen — deshalb hier gezielt.
// ─────────────────────────────────────────────────────────────

const quelle = fs.readFileSync(path.resolve(__dirname, '..', 'Baum3D.jsx'), 'utf8');

function luminanz(hex) {
  const h = hex.replace('#', '');
  const k = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2];
}
const kontrast = (a, b) => {
  const [x, y] = [luminanz(a), luminanz(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

describe('Baum3D — Tiefe über Farbe, nicht über Deckkraft', () => {
  it('der Marken-Container dimmt nicht mehr pauschal', () => {
    // Kommentarzeilen ausblenden: sie erklären genau diesen alten Zustand.
    const ohneKommentar = quelle.split('\n').map((z) => z.replace(/(^|[^:])\/\/.*$/, '$1')).join('\n');
    expect(ohneKommentar).not.toMatch(/opacity: m\.vorne \? 1 : 0\.34/);
  });

  it('die Beschriftung wechselt die Schriftfarbe statt der Deckkraft', () => {
    expect(quelle).toMatch(/color: palette \? \(m\.vorne \? palette\.text : palette\.mid\)/);
  });

  it('die Pille bleibt fast deckend — sonst wäre der Grund unter dem Text nicht berechenbar', () => {
    expect(quelle).toMatch(/background: \(palette \? palette\.surface : '#fff'\) \+ 'f2'/);
  });

  for (const [name, p] of [['hell', LIGHT_PALETTE], ['dunkel', DARK_PALETTE]]) {
    it(`${name}: beide Tiefenstufen bestehen AA, und der Unterschied bleibt sichtbar`, () => {
      const vorne = kontrast(p.text, p.surface);
      const hinten = kontrast(p.mid, p.surface);
      expect(hinten, `hinten ${hinten.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
      expect(vorne, `vorne ${vorne.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
      // Ohne spürbaren Abstand wäre die Tiefenwirkung weg — dann hätte die
      // Änderung zwar den Kontrast gerettet, aber die Gestaltung kaputtgemacht.
      expect(vorne / hinten, `Verhältnis ${(vorne / hinten).toFixed(2)}`).toBeGreaterThan(1.8);
    });
  }
});
