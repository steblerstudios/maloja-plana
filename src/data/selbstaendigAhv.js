// AHV/IV/EO-Beiträge für Selbständigerwerbende — Werte je Jahr (Kapitel 5, A1, 10.11.2026).
//
// Quelle: AHV-Merkblatt 2.02 «Beiträge der Selbstständigerwerbenden an die AHV, die IV und die EO»,
// Stand am 1. Januar 2026, https://www.ahv-iv.ch/p/2.02.d (PDF abgerufen 10.11.2026):
//   Ziff. 5  Beitragssätze AHV 8,1 % · IV 1,4 % · EO 0,5 % · Total 10,0 %
//   Ziff. 6  sinkende Beitragsskala unter 60 500 Fr.; unter 10 100 Fr. der Mindestbeitrag von 530 Fr.;
//            dazu Verwaltungskostenbeiträge von höchstens 5 % der Beiträge
//   Ziff. 10 Akontobeiträge vierteljährlich, spätestens am 10. Tag nach Quartalsende;
//            nicht rechtzeitig bezahlt → Verzugszins von jährlich 5 %
// 2027 (eingetragen 16.11.2026). Das Merkblatt 2.02 stand am 16.11.2026 unter ahv-iv.ch/p/2.02.d noch auf
// «Stand am 1. Januar 2026» — die Werte 2027 darum aus Verordnung und Bundesratsbeschluss:
//   satzVoll 10      AHVG Art. 8 Abs. 1 «8,1 Prozent» (Fedlex Stand 1.1.2027, gelesen 16.11.2026) + IVG Art. 3
//                    Abs. 1 1,4 % + EOV Art. 36 0,5 % (beide Stand 1.1.2027, siehe lohnAbzuege.js) = 10,0 %.
//   grenzeVoll 61500 AHVV Art. 21 Abs. 1, Fedlex Stand 1.1.2027 (gelesen 16.11.2026): «mindestens 10 300 Franken,
//                    aber weniger als 61 500 Franken im Jahr» — Fassung gemäss V vom 2. Okt. 2026 (AS 2026 541).
//   mindestbeitrag 541  Medienmitteilung des Bundesrates vom 2.10.2026 «AHV/IV-Minimalrente steigt um 20 Franken»
//                    (https://www.admin.ch/de/newnsb/BqB41FVYi5FB, gelesen 16.11.2026): «Die Mindestbeiträge der
//                    Selbständigerwerbenden und der Nichterwerbstätigen für AHV, IV und EO werden von 530 auf
//                    541 Franken pro Jahr erhöht». AHV-Anteil 444 Fr. (AHVV Art. 28 Abs. 1, Stand 1.1.2027).
//   verzugszins 5    AHVV Art. 42 Abs. 2, Fedlex Stand 1.1.2027 (gelesen 16.11.2026): «Der Satz für die Verzugs-
//                    und der Vergütungszinsen beträgt 5 Prozent im Jahr.»
// ⟨Bis 16.11.2026 stand hier: 2027 nicht eingetragen, weil der Mindestbeitrag AHV + IV + EO zusammen nicht belegt
// war. Die Medienmitteilung vom 2.10.2026 nennt ihn ausdrücklich.⟩ Gegenprobe am Merkblatt 2.02 «Stand 1.1.2027»,
// sobald es erscheint.
import { werteFuerStichtag } from './jahrestabelle.js';

export const SELBST_AHV_JE_JAHR = Object.freeze({
  2026: Object.freeze({ satzVoll: 10, grenzeVoll: 60500, mindestbeitrag: 530, verzugszins: 5, quelle: 'AHV-Merkblatt 2.02, Stand 1.1.2026' }),
  2027: Object.freeze({ satzVoll: 10, grenzeVoll: 61500, mindestbeitrag: 541, verzugszins: 5, quelle: 'AHVG Art. 8, AHVV Art. 21 und 42; Stand 1.1.2027, AS 2026 541; Bundesrat 2.10.2026' }),
});

export function selbstAhvWerte(stichtag) {
  return werteFuerStichtag(SELBST_AHV_JE_JAHR, stichtag);
}
