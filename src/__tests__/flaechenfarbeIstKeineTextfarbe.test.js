import { describe, it, expect } from 'vitest';
import { LIGHT_PALETTE, DARK_PALETTE } from '../config/constants.js';

// ─────────────────────────────────────────────────────────────
// Die Regel, die dreimal in einer Sitzung gebrochen war:
// **sage, gold und rose sind Flächenfarben. Als Text gehören sie nicht hin.**
//
// `constants.js` sagt es in den Kommentaren bei jeder Farbe, und es gibt für
// jede die passende Vordergrund-Variante (sageDeep, goldDeep, roseDeep). Nur
// stand die Regel nirgends als Prüfung — und wurde deshalb übersehen, unter
// anderem im Grundordnungs-Zähler, in der Statuszeile des Behörden-Dossiers, im
// Franchise-Tacho, im Reserve-Tank, in der Prämien-Orientierung, in der
// Finanz-Übersicht und in den Diagramm-Ablesewerten.
//
// Im Browser gemessen (Demo-Profil, 390×844) vor der Korrektur: neun
// Durchfaller im Hellmodus, alle mit derselben Vordergrundfarbe #5A7868 = sage.
// Einer davon auf ganz UNGETÖNTEM Grund bei 4.34:1 — die Farbe reicht schlicht
// nicht, auch ohne jede Tönung.
//
// Dieser Test hält die Begründung, nicht die Fundstellen: er rechnet nach, dass
// die Flächenfarben als Text durchfallen und die Deep-Varianten bestehen. Ändert
// jemand die Tafel so, dass sage plötzlich als Text tragen würde, wird er rot —
// und dann darf die Regel neu verhandelt werden.
//
// 🛑 Was dieser Test NICHT prüft: getönte Flächen. Im Dunkelmodus liegen mid und
// sageDeep auf sage-/gold-getönten Flächen (sage+'14' und ähnlich) bei 4.06–4.43
// und damit knapp unter AA — an zehn im Browser gemessenen Stellen. Das ist eine
// andere Ursache (die Tönung hellt den dunklen Grund auf) und eine Frage an die
// Farbtafel, nicht an die Verwendung. Siehe docs/TODO.md, Abschnitt C1.
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

const AA = 4.5;
// Die ungetönten Flächen, auf denen Fliesstext tatsächlich steht.
// 🛑 `top` ist bewusst NICHT dabei: die Tafel hält dafür ausdrücklich kein
// Kontrast-Ziel («top (#3D3B35) wird nie als bg genutzt (0×)», constants.js) —
// nachgezählt am 23.09.: null Verwendungen als Hintergrund in src/**/*.jsx.
// Ein erster Anlauf dieses Tests hat top mitgemessen und daraufhin drei
// Durchfaller gemeldet, die keine sind. Ein Test darf nur prüfen, was die Tafel
// auch verspricht.
const flaechen = (p) => ({ surface: p.surface, bg: p.bg, up: p.up });

const paare = [
  ['sage', 'sageDeep'],
  ['gold', 'goldDeep'],
  ['rose', 'roseDeep'],
];

for (const [name, palette] of [['hell', LIGHT_PALETTE], ['dunkel', DARK_PALETTE]]) {
  describe(`Flächenfarbe ist keine Textfarbe — Thema ${name}`, () => {
    for (const [flaeche, tiefe] of paare) {
      it(`${flaeche} trägt als Text NICHT — deshalb gibt es ${tiefe}`, () => {
        // Ausnahme mit Ansage: im Dunkeln ist gold hell genug und trägt bereits;
        // die Tafel setzt goldDeep dort deshalb GLEICH gold (constants.js sagt es
        // wörtlich). Wo Fläche und Tiefe dieselbe Farbe sind, gibt es nichts zu
        // unterscheiden — und der Test behauptet es auch nicht.
        if (palette[flaeche] === palette[tiefe]) {
          expect(Math.min(...Object.values(flaechen(palette)).map((f) => kontrast(palette[tiefe], f)))).toBeGreaterThanOrEqual(AA);
          return;
        }
        // Sonst muss mindestens eine der echten Flächen die Farbe durchfallen
        // lassen — sonst wäre die Regel gegenstandslos und der Test eine leere
        // Behauptung.
        const werte = Object.values(flaechen(palette)).map((f) => kontrast(palette[flaeche], f));
        expect(Math.min(...werte)).toBeLessThan(AA);
      });

      it(`${tiefe} trägt als Text auf ALLEN ungetönten Flächen`, () => {
        for (const [wo, f] of Object.entries(flaechen(palette))) {
          const cr = kontrast(palette[tiefe], f);
          expect(cr, `${tiefe} auf ${wo}: ${cr.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA);
        }
      });
    }

    it('mid und soft tragen ebenfalls überall — sie sind die neutralen Sekundärfarben', () => {
      for (const ton of ['mid', 'soft']) {
        for (const [wo, f] of Object.entries(flaechen(palette))) {
          const cr = kontrast(palette[ton], f);
          expect(cr, `${ton} auf ${wo}: ${cr.toFixed(2)}:1`).toBeGreaterThanOrEqual(AA);
        }
      }
    });
  });
}
