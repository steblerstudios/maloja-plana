// Prämienverbilligung (IPV) Kanton Graubünden — amtliches Selbstbehalt-Modell, Jahr 2026 (K31).
//
// Belege (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt GR:
//   [1] Gesetz über die Krankenversicherung und die Prämienverbilligung (KPVG, BR 542.100),
//       aktuelle Version in Kraft seit 01.01.2025 (Beschlussdatum 14.06.2022), keine künftige
//       Version erfasst. Gelesen über die API der Rechtssammlung (gr-lex, Version 3445).
//       Art. 6: Gesamtanspruch · Art. 7 Abs. 1: massgebende Prämien, nach Regionen abgestuft ·
//       Art. 8 Abs. 1–4: Selbstbehalt, Kinder/junge Erwachsene in Ausbildung, «der höhere» Betrag ·
//       Art. 8a Abs. 1: anrechenbares Einkommen · Art. 9: volle Verbilligung (EL, Sozialhilfe) ·
//       Art. 10: Verwirkung · Art. 11: Vorschuss · Art. 13 Abs. 2: Rückforderung.
//   [2] Verordnung zum KPVG (VOzKPVG, BR 542.120), aktuelle Version in Kraft seit 01.01.2026
//       (Beschlussdatum 16.12.2025), keine künftige Version erfasst (gr-lex, Version 3606).
//       Art. 14 Abs. 1/2: Anmeldung bis Ende des Anspruchsjahres; mit Mitteilung über die
//       Vorschusszahlung gilt man als angemeldet · Art. 17: massgebende Prämien = BAG-
//       Durchschnittsprämien − 10 %, aufgerundet · Art. 22 Abs. 3: Aufteilung nach Richtprämien.
//   [3] SVA Graubünden, «Wegleitung Individuelle Prämienverbilligung 2026», PDF vom 05.01.2026:
//       die Richtprämien 2026 je Region und Personenkategorie, die Selbstbehalt-Tabellen,
//       Vorschuss 65 %, Meldefrist 31.12.2026 (Posteingang).
//   [4] SVA Graubünden, «Individuelle Prämienverbilligung (IPV) Prämienregionen Jahr 2026», PDF
//       vom 07.01.2026: Gemeindeliste der drei Regionen.
//   [5] SVA Graubünden, Online-Rechner «Berechnung Individuelle Prämienverbilligung (IPV) Jahr
//       2026» (https://www.sva.gr.ch/ipv.html, gelesen 28.09.2026, nur angesehen, NICHTS
//       abgeschickt): «Anzahl junge Erwachsene (Jahrgang 2001 - 2007)», «Anzahl Kinder
//       (Jahrgang 2008 - 2026)» — die Jahrgangs-Grenzen fürs Alter.
//   🛑 Ein amtliches Berechnungsbeispiel gibt es nicht — weder in [3] noch auf den Seiten der
//   SVA. Die SVA verweist auf ihren Online-Rechner; den füttert die App bewusst nicht. Der
//   Prüfstein der Tests sind darum die Tabellenwerte von [3] und Handrechnungen am Wortlaut.
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die Richtprämie der Region, soweit sie einen Selbstbehalt übersteigt — und der
// Selbstbehalt ist ein Prozentsatz des anrechenbaren Einkommens, der nach Einkommenskategorien
// von 5 % (bis 10'000) auf 10 % (über 40'000) STUFENWEISE steigt.
//
// DREI DINGE, DIE GRAUBÜNDEN VON DEN BISHERIGEN KANTONEN UNTERSCHEIDEN
//
// 1. DER SATZ SPRINGT AN DEN KATEGORIENGRENZEN. Art. 8 Abs. 2 [1]: «Der Selbstbehalt beträgt für
//    anrechenbare Einkommen bis 10 000 Franken 5 Prozent, bis 20 000 Franken 6,5 Prozent …» — EIN
//    Satz je Kategorie, angewendet aufs ganze anrechenbare Einkommen (so auch die Tabelle in [3]:
//    «Anrechenbares Einkommen bis und mit CHF 10 000 — Selbstbehalt 5.0 %»). Zwischen 40'000 und
//    40'001 steigt der Selbstbehalt darum um rund 400 Franken. 🛑 Das ist die Lesart des Wortlauts
//    («Er erhöht sich … um je 1 Prozentpunkt» — der Selbstbehalt IST ein Satz), kein amtliches
//    Beispiel. Die Gegenlesart (Tranchen wie bei einem Steuertarif) ergäbe über 10'000 einen
//    TIEFEREN Selbstbehalt und einen höheren Betrag: 150 / 450 / 750 Fr. in den Kategorien bis
//    40'000, darüber konstant 1'150 Fr. im Jahr; zwischen dem Nullpunkt 59'160 und 70'660 (R1)
//    sagt die App «kein Anspruch», wo nach der Tranchen-Lesart einer bestünde. Die Richtung ist
//    also ZU TIEF — nicht die vorsichtige Seite. ⟨korrigiert 28.09.2026 nach der Fachprüfung
//    #467: hier stand «bis 750»; das gilt nur bis 40'000.⟩ Frage an die SVA: FRAGEN-AN-DIE-
//    AEMTER.md, 8. Der Vorbehalt und der «kein Anspruch»-Satz der Anzeige nennen Lesart und
//    Richtung (`ipv.vorbehaltGR`, `ipv.grKeinAnspruch`).
//
// 2. KEIN DECKEL AUF DIE EFFEKTIVE PRÄMIE. Weder [1] noch [2] begrenzen die Verbilligung auf die
//    tatsächlich bezahlte Prämie (gemessen 28.09.2026 über den vollen Text beider Erlasse, Suche
//    nach «effektiv», «tatsächlich», «höchstens», «übersteig» — nur der Selbstbehalt-Satz trifft).
//    Verbilligt werden die «massgebenden Prämien» (Art. 8 Abs. 1 [1]) — die Richtprämien der
//    Regierung. Wie SG: `KEIN_PRAEMIENDECKEL.GR` statt `praemieFehlt`.
//
// 3. KINDER UND JUNGE ERWACHSENE IN AUSBILDUNG IN EINER VERGLEICHSRECHNUNG. Art. 8 Abs. 3 [1]
//    verbilligt ihre Prämien bis 65'000 um 100 %, dann 75/50/25 % bis 80'000; nach Abs. 4 gelangt
//    «der höhere der gemäss den Absätzen 2 und 3 berechneten Beträge» zur Auszahlung. 🛑 OFFEN ist,
//    ob dieser Vergleich für den ganzen Haushalt gilt (Gesamtanspruch, Art. 6 [1] und Art. 17
//    Abs. 2 [2]: die massgebende Prämie ist die SUMME) oder je Kind. Die beiden Lesarten liegen bis
//    weit über tausend Franken auseinander (nachgerechnet bis 2'411: drei Kinder, 60'000). Der
//    Text stützt eher den Haushalt: [3], Abschnitt «Gesamtanspruch»: «Bei Personen im
//    Gesamtanspruch werden die anrechenbaren Einkommen sowie die Richtprämien aller Personen
//    zusammengezählt», und Abs. 4 spricht von ZWEI Beträgen. Die Haushalt-Lesart ist die
//    tiefere Zahl. Folge, offen gesagt: Alleinerziehende bis rund 73'000 (R1, ein Kind) sehen
//    keine Zahl. Die App rechnet mit Kindern darum nur dort, wo beide
//    dasselbe ergeben (über 80'000, oder wo der allgemeine Anteil des Kindes ohnehin höher ist) —
//    sonst `orientierung('grKinder')`. Frage an die SVA: FRAGEN-AN-DIE-AEMTER.md, 8.
//
// BEWUSST NICHT GEBAUT:
//   · Paare und mehrere Erwachsene — gemeinsam Besteuerte haben einen Gesamtanspruch (Art. 6 [1]),
//     das zweite Einkommen fehlt der App.
//   · junge Erwachsene 19–25 (Jahrgang 2001–2007 [5]): ihre Richtprämie (4'368 in R1) gilt für
//     alle, aber die Kinder-Vergleichsrechnung und der selbständige Anspruch hängen an einer
//     Ausbildung (Art. 8 Abs. 3 [1], Art. 13 [2]), die die App nicht erfasst. ⟨präzisiert nach
//     der Fachprüfung #467: hier stand, auch die Richtprämie hänge an der Ausbildung.⟩
//   · Quellenbesteuerte (Art. 9 Abs. 4 [1], Art. 18 [2]: Einkommen nach Art. 99 StG), Bezügerinnen
//     und Bezüger von EL, Sozialhilfe oder Mutterschaftsbeiträgen (Art. 9 Abs. 1 [1]: volle
//     Verbilligung).
//   · vom anrechenbaren Einkommen (Art. 8a Abs. 1 [1]): nicht versteuerte Beteiligungserträge
//     (lit. b), negativer Liegenschaftsertrag (lit. c), BVG-EINKÄUFE (lit. d, nur die laufenden
//     Beiträge sind gebaut, siehe unten), gemeinnützige Zuwendungen (lit. f), Parteibeiträge
//     (lit. g), Einkommen im vereinfachten Abrechnungsverfahren ([3]). Jede Auslassung SENKT das
//     Einkommen und ERHÖHT den Betrag. Umgekehrt fehlen alle Steuerabzüge (Berufsauslagen,
//     Versicherungs- und Kinderabzüge) — das HEBT das Einkommen und SENKT den Betrag.
//   · ein Mindestbetrag: Art. 11 Abs. 5 und Art. 16 Abs. 4 [1] erlauben der Regierung, geringfügige
//     Beträge auszuschliessen; in [2] und [3] steht keine solche Grenze. Darum gibt es hier nur
//     EINEN Grund für «kein Betrag» (über der Grenze), nicht zwei wie in SG und LU.
//   · der Vorschuss (Art. 11 [1], 65 % nach [3]) — der Betrag hier ist der definitive Anspruch;
//     der Vorbehalt nennt den Vorschuss.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr,
  jahrVorbei, mehrereErwachsene, ERWACHSEN, KEIN_PRAEMIENDECKEL, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, regionAusPLZ,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';
import { getRegion } from '../data/praemienRegionen.js';

// Werte 2026, wörtlich aus [1] und [3]. Alle Beträge sind Jahresbeträge in CHF.
export const IPV_GR = {
  jahr: 2026,
  // Art. 8a Abs. 1 [1]: «gemäss den definitiven kantonalen Steuerdaten des Vorjahres» — für 2026
  // also die Veranlagung 2025 ([3]: «definitive Steuerveranlagung 2025»).
  basisjahrAbstand: 1,
  // [3], Tabelle «Richtprämien 2026». e = «Erwachsene ab 26. Altersjahr», j = «junge Erwachsene
  // 19 - 25 Jahre», k = «Kinder bis und mit 18. Altersjahr». Festgesetzt von der Regierung nach
  // Art. 7 Abs. 1 [1] und Art. 17 Abs. 1 [2]; der Regierungsbeschluss selbst wurde nicht gefunden.
  richtpraemie: {
    1: { e: 5916, j: 4368, k: 1404 },
    2: { e: 5532, j: 4092, k: 1320 },
    3: { e: 5232, j: 3912, k: 1248 },
  },
  // Art. 8 Abs. 2 [1] und Tabelle «Selbstbehalte» [3]: obere Grenze der Kategorie («bis und mit»)
  // und Satz. Über 40'000 gilt der letzte Satz ([3]: «ab CHF 40 001 — 10.0 %»).
  selbstbehalt: [
    { bis: 10000, satz: 0.05 },
    { bis: 20000, satz: 0.065 },
    { bis: 30000, satz: 0.08 },
    { bis: 40000, satz: 0.09 },
    { bis: Infinity, satz: 0.10 },
  ],
  // Art. 8 Abs. 3 lit. a–d [1]: «bis zu einem anrechenbaren Einkommen von 65 000 Franken um
  // 100 Prozent» … «bis … 80 000 Franken um 25 Prozent». Darüber 0 ([3]: Selbstbehalt 100 %).
  kinderVerbilligung: [
    { bis: 65000, satz: 1 },
    { bis: 70000, satz: 0.75 },
    { bis: 75000, satz: 0.5 },
    { bis: 80000, satz: 0.25 },
  ],
  // Art. 8a Abs. 1 lit. a [1]: «10 Prozent des Reinvermögens …, soweit der Wert nicht negativ ist».
  vermoegenAnteil: 0.10,
};

// Art. 7 Abs. 1 [1] stuft nach Regionen ab; [3]: «Die Prämienregionen werden vom Bund
// festgelegt» — darum die BAG-Daten der App. Am 28.09.2026 VOLLSTÄNDIG gegen die Gemeindeliste
// der SVA [4] abgeglichen: 100 Bündner Gemeinden, 0 Abweichungen in der Region. 14 Gemeinden
// stehen bei der SVA unter einer Kurzform (z. B. «S.Vittore», «Klosters-Serneus»); der Test
// hält die Zuordnung Name für Name fest.
export function grRegion(bfsNr) {
  return getRegion(bfsNr);
}

// Satz des Selbstbehalts (Anteil, nicht Prozent). Art. 8 Abs. 2 [1].
export function grSelbstbehaltSatz(me) {
  const m = Math.max(0, me);
  return IPV_GR.selbstbehalt.find((s) => m <= s.bis).satz;
}

// Verbilligung der Kinderprämie nach Art. 8 Abs. 3 [1] (Anteil der Richtprämie; 0 über 80'000).
export function grKinderSatz(me) {
  const m = Math.max(0, me);
  const stufe = IPV_GR.kinderVerbilligung.find((s) => m <= s.bis);
  return stufe ? stufe.satz : 0;
}

// Die Rechnung selbst — ohne App-Daten, damit die Tests sie gegen den Wortlaut prüfen können.
// `erwachsene` ist nur für die Tests da; die App ruft sie immer mit einer erwachsenen Person auf.
// Liefert Jahresbeträge in CHF, ungerundet.
export function ipvGraubuendenRechnen({ region, kinderZahl = 0, me, erwachsene = 1 }) {
  const r = IPV_GR.richtpraemie[region];
  const me0 = Math.max(0, me);
  const summe = erwachsene * r.e + kinderZahl * r.k;
  const satz = grSelbstbehaltSatz(me0);
  const selbstbehalt = satz * me0;

  // Art. 8 Abs. 1/2 [1] auf den Gesamtanspruch: Summe der Richtprämien minus Selbstbehalt.
  const allgemein = Math.max(0, summe - selbstbehalt);
  // Art. 8 Abs. 3 [1]: die Kinderprämien, um den Satz der Einkommensstufe verbilligt.
  const kinderSatz = grKinderSatz(me0);
  const kinder = kinderZahl * kinderSatz * r.k;

  // Art. 8 Abs. 4 [1]: «der höhere der … berechneten Beträge» — hier für den ganzen Haushalt.
  const haushalt = Math.max(allgemein, kinder);
  // Die Gegenlesart: der Vergleich je Kind. Der allgemeine Betrag wird nach Art. 22 Abs. 3 [2]
  // im Verhältnis der Richtprämien aufgeteilt, und jedes Kind erhält das Höhere.
  const anteilKind = summe > 0 ? (allgemein * r.k) / summe : 0;
  const jePerson = allgemein - kinderZahl * anteilKind
    + kinderZahl * Math.max(anteilKind, kinderSatz * r.k);
  // Wo beide Lesarten dasselbe ergeben, ist die Zahl belegt; sonst rechnet die App nicht.
  const unklar = kinderZahl > 0 && Math.abs(jePerson - haushalt) > 0.005;

  return {
    total: haushalt, allgemein, kinder, jePerson, satz, selbstbehalt, kinderSatz, unklar,
    // Vergleichsgrösse «höchstens möglich»: bei Einkommen 0 die volle Summe der Richtprämien.
    maximal: summe,
    // Nur ein Grund für «kein Betrag»: kein Mindestbetrag belegt (siehe Kopf).
    grund: haushalt > 0 ? null : 'ueberGrenze',
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für GR mit Beleg.
export function ipvGraubuenden(data, hh, ipvData, youngAdultsCount, orientierung, lookupPLZ) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_GR.jahr;
  // Die Richtprämien setzt die Regierung jährlich fest (Art. 7 Abs. 1 [1]); die Wegleitung 2027
  // lag am 28.09.2026 nicht vor. Ab dem 01.01. des Folgejahres lieber keine Zahl.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // Alter nach Jahrgang: der Online-Rechner der SVA [5] führt 2026 «junge Erwachsene (Jahrgang
  // 2001 - 2007)» und «Kinder (Jahrgang 2008 - 2026)» — erwachsen ist also, wer im Anspruchsjahr
  // 26 wird (Jahrgang 2000 und älter), dieselbe Regel wie AG und LU (`imAnspruchsjahr`).
  // ⟨korrigiert 28.09.2026 nach der Fachprüfung #467: zuerst stand hier `mangelsStichtag`,
  // weil weder Erlass noch Wegleitung Jahrgänge nennen; der Rechner tut es. Jahrgang 2000 fiel
  // dadurch unnötig heraus.⟩
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung('alter');
  // Kinder «bis und mit 18. Altersjahr» [3], Jahrgang 2008–2026 [5]: Alter im Anspruchsjahr
  // höchstens 18, beim eingetippten Alter ein Jahr dazu (vorsichtig an der 18, wie BE, SG, LU).
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');

  // Wohnsitz am 01.01. des Anspruchsjahres ist massgebend ([3]); die App kennt nur den heutigen.
  const { region } = regionAusPLZ({ data, kanton: 'GR', lookupPLZ, regionFn: grRegion });
  if (!region) return orientierung('region');

  // Ein negatives Einkommen ist ein Vertipper — über `Math.max(0, …)` endete es sonst beim
  // Höchstbetrag (Befund BE 23.09.2026, hier von Anfang an mitgebaut).
  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');

  const kinderZahl = kinderJahre.length;
  const vermoegen = vermoegenSumme(f);
  // Art. 8a Abs. 1 [1]: satzbestimmendes steuerbares Einkommen, zuzüglich
  //   lit. a  10 % des Reinvermögens (nicht negativ),
  //   lit. d  die Beiträge an die berufliche Vorsorge — die App führt den laufenden BVG-Beitrag
  //           als Monatsbetrag «nur zur Übersicht» (er ist im Nettolohn schon abgezogen, i18n
  //           `bvgContribution`). Erfasst wird er darum hier zugerechnet; leer heisst «nicht
  //           erfasst» und zählt 0 — dann liegt das Einkommen zu tief und der Betrag zu hoch.
  //   lit. e  die Säule 3a — steckt im Nettoeinkommen schon, Regel `voll`, kein Zuschlag.
  const bvgJahr = Math.max(0, Number(f.bvgContribution) || 0) * 12;
  const me = einkommenJahr(f, SAEULE_3A.voll) + bvgJahr + IPV_GR.vermoegenAnteil * Math.max(0, vermoegen);

  const r = ipvGraubuendenRechnen({ region, kinderZahl, me });
  if (r.unklar) return orientierung('grKinder');

  // 🛑 Hier ruft jeder Kanton mit Deckel `praemieFehlt`. Graubünden nicht — begründet in
  // KEIN_PRAEMIENDECKEL.GR. Die Zeile steht da, damit das Auslassen sichtbar ist.
  void KEIN_PRAEMIENDECKEL.GR;

  // Wie ausbezahlt wird (Monat, Rappen), sagen die Quellen nicht; gerundet auf den Franken im Jahr.
  const annual = Math.round(r.total);
  const maxAnnual = Math.round(r.maximal);
  // Keine publizierte Einkommensgrenze — sie ergäbe sich nur aus der Rechnung. Die Grenzen in
  // Art. 8 Abs. 3 [1] betreffen nur die Kinder.
  const cantonData = { ...ipvData, maxIncome: null };
  const basisjahr = jahr - IPV_GR.basisjahrAbstand;
  // 🛑 Art. 8a Abs. 1 lit. d [1]: ist kein BVG-Beitrag erfasst, zählt er 0 — bei Angestellten mit
  // Pensionskasse liegt das Einkommen dann zu tief und der Betrag ZU HOCH (Fachprüfung #467:
  // 3'300 netto/Monat → 2'352 statt 1'716 mit 200 BVG, über eine Kategoriengrenze). Das gehört
  // in die Anzeige, nicht nur hierher: Zusatz-Vorbehalt, sobald ein Lohn erfasst ist.
  const bvgFehlt = Number(f.monthlyIncome) > 0 && !(Number(f.bvgContribution) > 0);
  const gemeinsam = {
    canton: 'GR', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltGR',
    extra: { region, basisjahr, ...(bvgFehlt ? { zusatzVorbehaltKey: 'ipv.vorbehaltGRbvg' } : {}) },
  };
  if (annual <= 0) {
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.grKeinAnspruch' });
  }
  // Art. 14 Abs. 1 [2]: Anmeldung «bis spätestens Ende des anspruchsberechtigten Jahres»; [3]:
  // Posteingang bei der SVA bis 31.12.2026; Art. 10 lit. a [1]: sonst verwirkt. Die Frist endet
  // mit dem Anspruchsjahr, und danach greift ohnehin `jahrVorbei` — solange hier eine Zahl steht,
  // läuft die Frist also IMMER. Darum kein `anmeldefristVorbei` (es wäre nie wahr; data/ipvAbzug.js
  // zieht den Betrag ab, wie bei den Kantonen ohne Vorjahresfrist) und nur ein Hinweis-Satz.
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    noteKey: 'ipv.grFristLaeuft',
    noteParams: { jahr },
  });
}
