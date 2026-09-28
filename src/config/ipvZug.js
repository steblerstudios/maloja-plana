// Prämienverbilligung (IPV) Kanton Zug — Richtprämien minus Selbstbehalt, Jahr 2026 (K31).
// Auf dem gemeinsamen Rahmen (config/kantonsModell.js).
//
// 🛑 ZUG ZEIGT HEUTE FÜR KEINE PERSON EINEN BETRAG — nur «kein Anspruch» dort, wo er sicher ist.
// Der Grund steht unten («DIE GRENZE FÜR EINZELPERSONEN»). Modul, Register, Beleg und Begründung
// stehen trotzdem, damit der Kanton rechnet, sobald die fehlende Zahl belegt ist.
//
// Belege (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt ZG:
//   [1] Gesetz betreffend individuelle Prämienverbilligung (IPVG), BGS 842.6, «Aktuelle Version in
//       Kraft seit: 01.01.2025 (Beschlussdatum: 11.04.2024)», Stand 1. Januar 2025.
//       § 4 Abs. 2/3: Gesamtanspruch, Verhältnisse am 1. Januar · § 5: Richtprämien legt der
//       Regierungsrat fest · § 6 Abs. 1: Prozentsatz, Kinderabzug 8500, Vermögenszuschlag ·
//       § 6 Abs. 2: vorletzte Steuerperiode · § 6 Abs. 3: Obergrenzen und Mindestbeträge legt der
//       Regierungsrat fest · § 6ter: Neuberechnung bei 25 % tieferem Einkommen · § 7: Sonderfälle ·
//       § 7bis: Mindestanspruch Kinder · § 10/11: Frist 30. April · § 18: Rückerstattung.
//   [2] Verordnung zum IPVG, BGS 842.61, «Aktuelle Version in Kraft seit: 01.01.2021», § 1:
//       massgebendes Einkommen.
//   [3] Ausgleichskasse Zug, Broschüre «Prämienverbilligung 2026 im Kanton Zug» (PDF, erstellt
//       12.12.2025): Richtprämien 2026, Selbstbehalt 8 %, Reduktion 70'000–89'900, Mindestgarantie
//       Kinder 80 %, Frist 30. April 2026, unter Fr. 50 keine Auszahlung.
//   Der Regierungsratsbeschluss mit den Parametern 2026 ist nicht in der BGS erfasst und wurde nicht
//   gefunden; die Medienmitteilung vom 26.01.2026 bestätigt nur, dass der Regierungsrat «die
//   Parameter … festgelegt» hat. Die Zahlen stammen darum aus [3], der Broschüre der Stelle, die
//   nach § 2 Abs. 2 [1] die Prämienverbilligung durchführt.
//   Ein amtliches Berechnungsbeispiel gibt es nicht: [3] verweist auf eine «Berechnungsvorlage in
//   diesem Dokument», der Textlayer enthält keine, die zwei Bilder sind Titel- und Schlussbild.
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die Summe der Richtprämien, soweit sie 8 % des massgebenden Einkommens
// übersteigt; ab 70'000 wird der Anspruch je angefangene 100 Franken um 0,5 % gekürzt, über 89'900
// entfällt er — so die Grenzen für Haushalte [3].
//
// 🛑 DIE GRENZE FÜR EINZELPERSONEN
// [3] S. 5: «Die Grenzwerte für das massgebende Einkommen fallen bei Einzelpersonen und gewissen
// Haushalten mit nur einer erwachsenen Person tiefer aus.» Welche Grenzen, steht nirgends; nur der
// Online-Rechner der Kasse rechnet sie serverseitig aus — den füttern wir nicht. Die App rechnet
// aber nur Haushalte mit EINER erwachsenen Person (Paare sind bewusst nicht gebaut). Für genau diese
// kennt sie weder den Beginn der Kürzung noch die Obergrenze: schon bei tiefem Einkommen könnte die
// Kürzung greifen. Darum keine Zahl (`zgGrenzeEinzelperson`), ausser dort, wo KEIN Anspruch sicher ist:
//   · ohne Kinder, sobald 8 % des Einkommens die Richtprämie erreichen (4'984.80 / 8 % = 62'310) —
//     die Kürzung kann einen Betrag nur senken, nie schaffen;
//   · mit Kindern über 89'900 — die Grenzen für Einpersonen-Haushalte liegen laut [3] «tiefer».
//
// BEWUSST NICHT GEBAUT:
//   · Paare, Konkubinat, mehrere Erwachsene (§ 4 Abs. 2 [1], zweites Einkommen fehlt).
//   · junge Erwachsene (Jg. 2001–2007): mit den Eltern nur bei Kinderabzug in der Veranlagung
//     (§ 7bis Abs. 1 [1]), ihr eigenes Einkommen zählt mit [3] — beides fehlt der App.
//   · Quellenbesteuerte (§ 7 Abs. 1 [1]), EL (§ 7 Abs. 2), Sozialhilfe (§ 7 Abs. 3), Mutterschafts-
//     beiträge (§ 7 Abs. 4).
//   · vom massgebenden Einkommen: freiwillige Einkäufe 2. Säule, Liegenschaftsunterhalt über 20 %
//     (§ 1 lit. b1/c1 [2]) — nicht erfasst.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr,
  jahrVorbei, mehrereErwachsene, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18,
  ergebnisOhneAnspruch,
} from './kantonsModell.js';

// Werte 2026, wörtlich aus [1]–[3]. Alle Beträge sind Jahresbeträge in CHF.
export const IPV_ZG = {
  jahr: 2026,
  // § 6 Abs. 2 [1]: «der vorletzten Steuerperiode» — [3]: «definitive Steuerveranlagung 2024».
  basisjahrAbstand: 2,
  // [3] S. 4: «Für das Jahr 2026 hat der Regierungsrat folgende Richtprämien festgelegt:
  // Erwachsene Fr. 4'984.80 · junge Erwachsene (2001 – 2007) Fr. 3'472.80 · Kinder und
  // Jugendliche (2008 – 2025) Fr. 1'224.00».
  richtpraemie: { e: 4984.80, j: 3472.80, k: 1224.00 },
  // [3] S. 5: «wenn die gesamten Richtprämien höher sind als 8 % Ihres massgebenden Einkommens».
  selbstbehalt: 0.08,
  // [3] S. 5, Grenzen für Haushalte: «zwischen Fr. 70'000.– und Fr. 89'900.– … Pro Fr. 100.–, die
  // das massgebende Einkommen von Fr. 70'000.– übersteigen, reduziert sich Ihr Anspruch um 0,5 %.
  // … auf die nächsten Fr. 100.– aufgerundet.»
  reduktion: { ab: 70000, obergrenze: 89900, jeHundert: 0.005 },
  // § 1 Abs. 1 lit. b [2]: «zuzüglich 10 % des Reinvermögens».
  vermoegenAnteil: 0.10,
  // § 6 Abs. 1 [1] und § 1 Abs. 1 lit. d [2]: «Kinderabzug in der Höhe von 8500 Franken pro Kind».
  kinderabzug: 8500,
  // [3] S. 6: «Ein Prämienbeitrag unter 50 Franken pro Jahr wird nicht ausbezahlt.»
  mindestbetrag: 50,
};

// Reduktionsfaktor nach den Haushalts-Grenzen [3]. Für Einzelpersonen gilt er NICHT (tiefere,
// unbekannte Grenzen) — der Einstieg ruft die Rechnung darum für sie nicht für einen Betrag auf.
export function zgReduktionsfaktor(me) {
  const r = IPV_ZG.reduktion;
  if (me <= r.ab) return 1;
  if (me > r.obergrenze) return 0;
  const aufgerundet = Math.ceil(me / 100) * 100;
  return Math.max(0, 1 - r.jeHundert * ((aufgerundet - r.ab) / 100));
}

// Reine Rechnung für einen Haushalt MIT den veröffentlichten Grenzen. `personen`: 'e' | 'j' | 'k'.
export function ipvZugRechnen({ personen, me }) {
  const p = IPV_ZG;
  const summe = personen.reduce((s, c) => s + p.richtpraemie[c], 0);
  const selbstbehalt = p.selbstbehalt * Math.max(0, me);
  // Auf Rappen gerundet, sonst bleibt am Nullpunkt ein Gleitkomma-Rest.
  const differenz = Math.max(0, Math.round((summe - selbstbehalt) * 100) / 100);
  const faktor = zgReduktionsfaktor(Math.max(0, me));
  const total = Math.round(differenz * faktor * 100) / 100;
  return {
    summe, selbstbehalt, differenz, faktor, total,
    nullpunkt: summe / p.selbstbehalt,
    grund: total >= p.mindestbetrag ? null : (total > 0 ? 'mindestbetrag' : 'ueberGrenze'),
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für ZG mit Beleg. Keine Prämienregion (BAG: eine
// Region; die Richtprämie gilt kantonsweit, § 5 [1]) — `brauchtPLZ: false`.
export function ipvZug(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const p = IPV_ZG;
  const jahr = p.jahr;
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // Jahrgänge nach [3]: junge Erwachsene «2001 – 2007», also erwachsen ab Jahrgang 2000 — wer im
  // Anspruchsjahr 26 wird (wie LU, AG, SZ mit amtlicher Jahrgangsliste belegt).
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung('alter');
  // Kinder «2008 – 2025»: höchstens 18 im Anspruchsjahr; eingetipptes Alter +1 wie LU/SZ.
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');
  const kinderZahl = kinderJahre.length;
  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');

  // § 1 Abs. 1 [2]: Reineinkommen + 10 % Reinvermögen + Säule 3a (lit. c, unbedingt aufgerechnet —
  // das Nettoeinkommen der App trägt sie schon, Regel `voll`) − 8500 je Kind.
  const me = Math.max(0, einkommenJahr(f, SAEULE_3A.voll)
    + p.vermoegenAnteil * vermoegenSumme(f) - p.kinderabzug * kinderZahl);
  const r = ipvZugRechnen({ personen: ['e', ...kinderJahre.map(() => 'k')], me });

  const keinAnspruchSicher = (kinderZahl === 0 && r.differenz <= 0) || me > p.reduktion.obergrenze;
  if (!keinAnspruchSicher) return orientierung('zgGrenzeEinzelperson');
  return ergebnisOhneAnspruch({
    canton: 'ZG', cantonData: { ...ipvData, maxIncome: null }, jahr,
    vorbehaltKey: 'ipv.vorbehaltZG', noteKey: 'ipv.zgKeinAnspruch',
    extra: { jahrKey: 'ipv.jahrEineRegion', basisjahr: jahr - p.basisjahrAbstand },
  });
}
