// Mindestbeitrag der freiwilligen AHV (Auslandschweizer und EU/EFTA-Angehörige ausserhalb der EU/EFTA),
// als Jahrestabelle wie ahvRechner.js (Weg A, Entscheid Stebler Studios 21.10.2026): am 1.1. schaltet die
// App von selbst um.
//
// Belegt am Fedlex-Volltext (swiss-precision-pruefer, Kapitel 6, 10.11.2026):
//   • 2026: AHVG Art. 2 Abs. 4 und 5, Fassung 1.1.2026: «den Mindestbeitrag von 870 Franken im Jahr».
//   • 2027: AHVG Art. 2 Abs. 4 und 5, Fassung 1.1.2027 (AS 2026 542, V vom 2.10.2026),
//     https://www.fedlex.admin.ch/eli/cc/63/837_843_843/20270101/de: «den Mindestbeitrag von 888 Franken im Jahr».
import { werteFuerStichtag } from './jahrestabelle.js';

export const FREIWILLIGE_AHV_JE_JAHR = Object.freeze({
  2026: Object.freeze({ mindestbeitrag: 870 }),
  2027: Object.freeze({ mindestbeitrag: 888 }),
});

export function freiwilligeAhv(stichtag) {
  return werteFuerStichtag(FREIWILLIGE_AHV_JE_JAHR, stichtag);
}
