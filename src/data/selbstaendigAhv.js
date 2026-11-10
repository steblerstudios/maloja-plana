// AHV/IV/EO-Beiträge für Selbständigerwerbende — Werte je Jahr (Kapitel 5, A1, 10.11.2026).
//
// Quelle: AHV-Merkblatt 2.02 «Beiträge der Selbstständigerwerbenden an die AHV, die IV und die EO»,
// Stand am 1. Januar 2026, https://www.ahv-iv.ch/p/2.02.d (PDF abgerufen 10.11.2026):
//   Ziff. 5  Beitragssätze AHV 8,1 % · IV 1,4 % · EO 0,5 % · Total 10,0 %
//   Ziff. 6  sinkende Beitragsskala unter 60 500 Fr.; unter 10 100 Fr. der Mindestbeitrag von 530 Fr.;
//            dazu Verwaltungskostenbeiträge von höchstens 5 % der Beiträge
//   Ziff. 10 Akontobeiträge vierteljährlich, spätestens am 10. Tag nach Quartalsende;
//            nicht rechtzeitig bezahlt → Verzugszins von jährlich 5 %
// 2027: nicht eingetragen. Die AHV passt 2027 an; ein Merkblatt «Stand 1.1.2027» war am 10.11.2026 nicht
// gelesen. Ab 1.1.2027 zeigt die Seite darum ausdrücklich die Werte 2026 mit «Stand 2026» (jahrestabelle.js).
// Stand der Suche 10.11.2026 nachmittags: Merkblatt 2.02 unter ahv-iv.ch/p/2.02.d noch «Stand am 1. Januar 2026».
// Am Volltext belegt für 2027 (Fedlex AHVV, Stand 1.1.2027, V vom 2.10.2026, AS 2026 541):
//   AHVV Art. 21 Abs. 1  sinkende Skala ab 10 300 bis unter 61 500 Fr. (2026: 10 100 / 60 500)
//   AHVV Art. 28 Abs. 1  AHV-Mindestbeitrag 444 Fr. (2026: 435)
// NICHT belegt: der Mindestbeitrag AHV + IV + EO zusammen (2026: 530). IVG Art. 3 und EOG Art. 27 nennen 70 und
// «höchstens 26» Fr. als Grundwerte; die für 2027 angepassten IV- und EO-Anteile waren nicht auffindbar. Darum
// bleibt 2027 ohne Eintrag — ein halber Eintrag würde eine geratene Summe zeigen.
import { werteFuerStichtag } from './jahrestabelle.js';

export const SELBST_AHV_JE_JAHR = Object.freeze({
  2026: Object.freeze({ satzVoll: 10, grenzeVoll: 60500, mindestbeitrag: 530, verzugszins: 5, quelle: 'AHV-Merkblatt 2.02, Stand 1.1.2026' }),
});

export function selbstAhvWerte(stichtag) {
  return werteFuerStichtag(SELBST_AHV_JE_JAHR, stichtag);
}
