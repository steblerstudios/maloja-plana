// Mindestbeitrag der freiwilligen AHV (Auslandschweizer und EU/EFTA-Angehörige ausserhalb der EU/EFTA),
// als Jahrestabelle wie ahvRechner.js (Weg A, Entscheid Stebler Studios 21.10.2026): am 1.1. schaltet die
// App von selbst um.
//
// Belegt am Fedlex-Volltext (swiss-precision-pruefer, Kapitel 6, 10.11.2026):
//   • 2026: AHVG Art. 2 Abs. 4 und 5, Fassung 1.1.2026: «den Mindestbeitrag von 870 Franken im Jahr».
//   • 2027: AHVG Art. 2 Abs. 4 und 5, Fassung 1.1.2027 (AS 2026 542, V vom 2.10.2026),
//     https://www.fedlex.admin.ch/eli/cc/63/837_843_843/20270101/de: «den Mindestbeitrag von 888 Franken im Jahr».
import { werteFuerStichtag } from './jahrestabelle.js';

//
// Vortor 12.11.2026: Der Mindestbeitrag der freiwilligen Versicherung ist AHV + IV. Bisher stand nur der AHV-Anteil.
//   • IV: IVG Art. 3 Abs. 1bis (Fassung 1.1.2026 und 1.1.2027): «140 Franken, wenn sie freiwillig nach Artikel 2 AHVG
//     versichert sind», Fussnote 19: «Beitrag gemäss Art. 6 der V vom 28. Aug. 2024» (AS 2024 463).
//   • 2027: V vom 2.10.2026 (AS 2026 542) Art. 2 Abs. 2 «In der freiwilligen Versicherung beträgt er … 888 Franken» und
//     Art. 6 «für freiwillig versicherte Nichterwerbstätige auf 142 Franken».
//   • Merkblatt 10.02 (Stand 1.1.2025), Ziff. 4: Nichterwerbstätige zahlen «zwischen 1 010 Franken und 25 250 Franken»;
//     Ziff. 3: Erwerbstätige 10,1 % (AHV 8,7 % + IV 1,4 %).
//   • VFV Art. 13b Abs. 1 (Fassung 1.1.2027): Erwerbstätige «mindestens den Mindestbetrag von 1030 Franken», Abs. 2
//     Nichterwerbstätige «zwischen 1030 und 25 750 Franken» (Fassung 2025: 1010) — gilt also für alle freiwillig Versicherten.
//   • 5 % Verwaltungskosten für alle: VFV Art. 18a Abs. 1 mit V EDI SR 831.143.41 Art. 1 (rechts-pruefer 12.11.2026).
const jahr = (ahv, iv) => Object.freeze({ mindestbeitragAhv: ahv, mindestbeitragIv: iv, mindestbeitrag: ahv + iv });

export const FREIWILLIGE_AHV_JE_JAHR = Object.freeze({
  2026: jahr(870, 140),
  2027: jahr(888, 142),
});

export function freiwilligeAhv(stichtag) {
  return werteFuerStichtag(FREIWILLIGE_AHV_JE_JAHR, stichtag);
}
