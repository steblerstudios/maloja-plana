// Prämienverbilligung (IPV) Kanton St.Gallen — amtliches Belastungsgrenzen-Modell, Jahr 2026 (K31).
// Fünfter Kanton mit eigenem Modell, erster, der von Anfang an auf dem gemeinsamen Rahmen
// (config/kantonsModell.js) steht.
//
// Belege (an der Quelle nachgeprüft 20.09.2026), Wortlaute in
// docs/sources/ipv-kantone-2026.md, Abschnitt SG:
//   [1] Regierungsbeschluss über die Prämienverbilligung 2026 (sGS 331.538, nGS 2025-071),
//       vom 9. Dezember 2025, in Vollzug ab 1. Januar 2026. Änderungstabelle: Grunderlass,
//       seither unverändert.
//       Art. 3: regionale Referenzprämien · Art. 5: Belastungsgrenzen · Art. 6: Obergrenze
//       des Einkommens für die Verbilligung nach Art. 65 Abs. 1bis KVG.
//   [2] Verordnung zum EG zur Krankenversicherung (sGS 331.111).
//       Art. 12 Abs. 1/2: massgebendes Einkommen · Art. 12 Abs. 3: Vermögensgrenze ·
//       Art. 14: Kinderabzug Fr. 4000 · Art. 19 Abs. 2: Minimalgarantie 80 % / 50 % ·
//       Art. 20: Mindestbetrag Fr. 100 · Art. 21: Aufteilung im Haushalt.
//   [3] Merkblatt IPV 2026, Form. 4100 01.26, SVA St.Gallen.
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die regionale Referenzprämie, soweit sie die Belastungsgrenze übersteigt —
// und die Belastungsgrenze ist ein Prozentsatz, der MIT dem Einkommen STEIGT. Der Abbau ist
// darum quadratisch, nicht linear wie in ZH, und nicht stufig wie in BE.
//
// 🛑 ZWEI UNTERSCHIEDE ZU ALLEN BISHERIGEN KANTONEN
//
// 1. KEIN DECKEL AUF DIE EFFEKTIVE PRÄMIE. ZH (§ 4 Abs. 3 EG KVG), BE (KKVV Art. 10 Abs. 1),
//    AG (§ 7 Abs. 3 KVGG) und VD (LVLAMal art. 16 al. 1bis) begrenzen die Verbilligung auf die
//    tatsächlich fakturierte Prämie. In St.Gallen steht davon nichts — weder im Beschluss [1]
//    noch in der Verordnung [2]. Gemessen am 20.09.2026 über den vollen Verordnungstext, mit
//    Gegenprobe (die Suche findet «Referenzprämie», «Belastungsgrenze», «Mindestbetrag» und
//    findet ein erfundenes Wort nicht). Darum ruft dieses Modul `praemieFehlt` NICHT auf: die
//    Prämie geht in die Rechnung gar nicht ein. Stattdessen sagt der Vorbehalt, dass sich die
//    Verbilligung an der Referenzprämie bemisst und nicht an der eigenen Prämie.
//    Offener Punkt für die SVA: was gilt, wenn die eigene Prämie tiefer ist als der Betrag?
//
// 2. KEINE PUBLIZIERTE EINKOMMENSGRENZE. Sie ergibt sich rechnerisch aus «Referenzprämie =
//    Belastungsgrenze», ist aber nirgends als Zahl veröffentlicht. Wie in AG trägt die App
//    darum KEINE Grenze (`maxIncome` bleibt null) — eine abgeleitete Grenze wäre die eigene
//    Rechnung, keine amtliche Angabe. Die Zahlen in Art. 6 [1] sind NICHT diese Grenze,
//    sondern die Obergrenze für die Minimalgarantie der Kinder.
//
// BEWUSST NICHT GEBAUT (wie in den anderen Kantonen):
//   · Verheiratete und Paare (Art. 5 Abs. 2 und 4 [1]) — das zweite Einkommen fehlt der App
//   · junge Erwachsene 19–25 — die Minimalgarantie von 50 % hängt am Ausbildungsstatus,
//     den die App nicht erfasst; ebenso die Sockel- und Zuwachs-Zuschläge «je weitere
//     erwachsene Person bis zum vollendeten 25. Altersjahr»
//   · quellenbesteuerte Personen (Art. 7 [1], eigene Obergrenzen, Anrechnung zu 75 %)
import {
  vermoegenSumme, einkommenJahr, geburtsjahr,
  jahrVorbei, mehrereErwachsene, ERWACHSEN,
  kinderAlter, ALTER_UNERFASST, UEBER_18, regionAusPLZ,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';
import { getRegion } from '../data/praemienRegionen.js';

// Werte 2026, wörtlich aus [1]. Alle Beträge sind Jahresbeträge in CHF.
export const IPV_SG = {
  jahr: 2026,
  // Art. 12 Abs. 1 [2]: «Reineinkommen der Steuerperiode des vorletzten Jahres vor dem
  // Bezugsjahr» — für 2026 also die Steuerperiode 2024.
  basisjahrAbstand: 2,
  // Art. 3 [1]
  referenz: {
    erwachsen: { 1: 6285.60, 2: 5879.40, 3: 5681.40 },
    jungeErwachsene: { 1: 4492.80, 2: 4218.00, 3: 4063.20 },
    kind: { 1: 1462.80, 2: 1351.20, 3: 1306.80 },
  },
  // Art. 5 [1] — Prozentpunkte. `zuwachs` gilt JE FRANKEN über dem Sockel und wirkt auf das
  // GESAMTE massgebende Einkommen, nicht nur auf den übersteigenden Teil.
  belastung: {
    // Abs. 1: Alleinstehende ohne Kinder
    alleinOhneKinder: { satz: 12.16, sockel: 18700, zuwachs: 0.0002 },
    // Abs. 3: Alleinstehende mit Kindern
    alleinMitKindern: {
      satz: 10.96, sockel: 18700, sockelJungeErwachsene: 9350, sockelKind: 5610,
      zuwachs: 0.0002, zuwachsJungeErwachsene: 0.00005, zuwachsKind: 0.00003,
      zuwachsMax: 0.0003,
    },
  },
  // Art. 19 Abs. 2 [2]: «80 Prozent für Kinder und 50 Prozent für junge Erwachsene in
  // Ausbildung. Vorbehalten bleibt eine weiter gehende Verbilligung nach Art. 65 Abs. 1 KVG.»
  // Also ein Boden, keine Obergrenze.
  minimalgarantie: { kind: 0.80, jungeErwachsene: 0.50 },
  // Art. 6 [1]: bis zu diesem Reineinkommen besteht die Minimalgarantie. Nur Alleinstehende
  // (Bst. a–f); die Werte für Verheiratete sind hier nicht gebaut. Index = Kinderzahl,
  // ab 5 Kindern gilt der letzte Wert.
  obergrenzeGarantieAllein: [41700, 65700, 65700, 70700, 75700, 80700],
  // Art. 12 Abs. 2 Ziff. 1 [2]: «zuzüglich 20 Prozent des steuerbaren Vermögens»
  vermoegenAnteil: 0.20,
  // Art. 12 Abs. 3 [2]: über Fr. 100'000 kein Anspruch; je Kind +20'000, je junge erwachsene
  // Person +40'000, höchstens bis Fr. 150'000.
  vermoegen: { grenze: 100000, jeKind: 20000, jeJungeErwachsene: 40000, maximal: 150000 },
  // Art. 14 [2]: «vermindert sich das massgebende Einkommen um Fr. 4000.–»
  kinderabzug: 4000,
  // Art. 20 [2]: «Eine Prämienverbilligung von weniger als Fr. 100.– je Person und Jahr
  // wird nicht ausgerichtet.»
  mindestbetrag: 100,
};

// Art. 1 [1]: «regionale Referenzprämien nach Massgabe der vom Bundesamt für Gesundheit
// festgelegten Prämienregionen» — darum die BAG-Daten der App, nicht die SVA-Liste
// `form_4050` (Stand 01.23). ⚠️ Beide weichen bei Altstätten ab (BAG Region 2, SVA-Liste
// Region 3); offener Punkt bei der SVA. Der Beschluss erklärt die BAG-Regionen für massgebend.
export function sgRegion(bfsNr) {
  return getRegion(bfsNr);
}

// Belastungsgrenze in PROZENTPUNKTEN. Art. 5 Abs. 1 und 3 [1].
// Junge Erwachsene sind im Modell vorgesehen, aber die App erfasst sie nicht (siehe Kopf) —
// der Parameter bleibt darum 0 und ist nur da, damit die Formel vollständig lesbar ist.
export function sgBelastungsgrenze({ me, kinderZahl = 0, jungeErwachsene = 0 }) {
  if (kinderZahl === 0 && jungeErwachsene === 0) {
    const b = IPV_SG.belastung.alleinOhneKinder;
    return b.satz + b.zuwachs * Math.max(0, me - b.sockel);
  }
  const b = IPV_SG.belastung.alleinMitKindern;
  const sockel = b.sockel + b.sockelJungeErwachsene * jungeErwachsene + b.sockelKind * kinderZahl;
  const zuwachs = Math.min(
    b.zuwachs + b.zuwachsJungeErwachsene * jungeErwachsene + b.zuwachsKind * kinderZahl,
    b.zuwachsMax,
  );
  return b.satz + zuwachs * Math.max(0, me - sockel);
}

// Die Rechnung selbst — ohne App-Daten, damit die Tests sie gegen die amtlichen Artikel
// prüfen können. `personen`: 'e' für die erwachsene Person, 'k' je Kind.
export function ipvStGallenRechnen({ region, personen, me }) {
  const kinderZahl = personen.filter((p) => p === 'k').length;
  const referenzErwachsen = IPV_SG.referenz.erwachsen[region];
  const referenzKind = IPV_SG.referenz.kind[region];
  const referenzSumme = referenzErwachsen + kinderZahl * referenzKind;

  const grenzeProzent = sgBelastungsgrenze({ me, kinderZahl });
  const eigenanteil = (grenzeProzent / 100) * me;
  const gruppe = Math.max(0, referenzSumme - eigenanteil);

  // Art. 21 [2]: «entspricht der Anteil einer Person dem Prozentsatz der Verbilligung der
  // Referenzprämien» — also anteilig nach Referenzprämie, wie in ZH.
  const prozentsatz = referenzSumme > 0 ? gruppe / referenzSumme : 0;
  const anteilErwachsen = prozentsatz * referenzErwachsen;
  const anteilKind = prozentsatz * referenzKind;

  // Art. 19 Abs. 2 [2] ist ein BODEN, kein Deckel: das Kind erhält mindestens 80 % seiner
  // Referenzprämie — aber nur bis zur Obergrenze nach Art. 6 [1]. Darüber gilt allein der
  // anteilige Betrag.
  const obergrenze = IPV_SG.obergrenzeGarantieAllein[
    Math.min(kinderZahl, IPV_SG.obergrenzeGarantieAllein.length - 1)
  ];
  const garantieGilt = kinderZahl > 0 && me <= obergrenze;
  const garantieKind = IPV_SG.minimalgarantie.kind * referenzKind;
  const kindBetrag = garantieGilt ? Math.max(anteilKind, garantieKind) : anteilKind;

  // Art. 20 [2]: unter Fr. 100 je Person und Jahr wird nichts ausgerichtet — je Person
  // geprüft, nicht auf der Summe.
  const proPerson = (betrag) => (betrag < IPV_SG.mindestbetrag ? 0 : betrag);
  const total = proPerson(anteilErwachsen) + kinderZahl * proPerson(kindBetrag);

  // Vergleichsgrösse «höchstens möglich»: dieselbe Rechnung bei massgebendem Einkommen 0.
  const maximal = referenzSumme;

  return {
    total, maximal, referenzSumme, grenzeProzent, eigenanteil,
    anteilErwachsen: proPerson(anteilErwachsen),
    kindBetrag: proPerson(kindBetrag),
    garantieGilt,
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für SG mit Beleg. Die App rechnet nur, wo
// ihre Angaben dafür reichen; sonst dieselbe Orientierung wie ein unbelegter Kanton, mit Grund
// in `offen`.
export function ipvStGallen(data, hh, ipvData, youngAdultsCount, orientierung, lookupPLZ) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_SG.jahr;
  // Die Regierung legt die Werte jährlich bis 15. Dezember fürs Folgejahr fest (Art. 19
  // Abs. 1 [2]). Für 2027 lag am 20.09.2026 kein Beschluss vor — ab dem 01.01. des
  // Folgejahres darum lieber keine Zahl als eine aus veralteten Sätzen.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // Dieselbe Lesart wie ZH, BE und VD: erwachsen ist, wer das ganze Anspruchsjahr über in
  // derselben Zeile steht. Der Beschluss nennt keinen Stichtag fürs Alter — nur für die
  // Prämienregion (Art. 2 Abs. 1 [1]: Wohnsitz am 1. Januar).
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.abEndeVorjahr(jahr, geburt)) return orientierung('alter');
  // Bezugsjahr ist das Anspruchsjahr, darum beim eingetippten Alter ein Jahr dazu — wie in BE.
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  // Über 18: junge Erwachsene sind bewusst nicht gebaut (siehe Kopf).
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');

  const { region } = regionAusPLZ({ data, kanton: 'SG', lookupPLZ, regionFn: sgRegion });
  if (!region) return orientierung('region');

  const kinderZahl = kinderJahre.length;
  const vermoegen = vermoegenSumme(f);
  // Art. 12 Abs. 3 [2]: Grenze steigt je Kind, höchstens bis 150'000.
  const vermoegensgrenze = Math.min(
    IPV_SG.vermoegen.grenze + IPV_SG.vermoegen.jeKind * kinderZahl,
    IPV_SG.vermoegen.maximal,
  );
  if (vermoegen > vermoegensgrenze) return orientierung('vermoegen');

  // Art. 12 Abs. 2 [2]: Reineinkommen + 20 % des steuerbaren Vermögens + Säule 3a
  // (einkommenJahr rechnet sie mit) − Kinderabzug Fr. 4000 je Kind (Art. 14).
  // 🛑 Die App kennt nicht das steuerbare Gesamtvermögen, sondern die Summe der erfassten
  // Posten — derselbe Vorbehalt wie in den anderen Kantonen, er steht in der Anzeige.
  const me = Math.max(0, einkommenJahr(f)
    + IPV_SG.vermoegenAnteil * vermoegen
    - IPV_SG.kinderabzug * kinderZahl);

  const r = ipvStGallenRechnen({ region, personen: ['e', ...kinderJahre.map(() => 'k')], me });
  const annual = Math.round(r.total);
  const maxAnnual = Math.round(r.maximal);
  // Keine publizierte Einkommensgrenze (siehe Kopf) — `maxIncome` bleibt bewusst null.
  const cantonData = { ...ipvData, maxIncome: null };
  const basisjahr = jahr - IPV_SG.basisjahrAbstand;
  const gemeinsam = {
    canton: 'SG', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltSG',
    extra: { region, basisjahr },
  };
  if (annual <= 0) {
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.sgKeinAnspruch' });
  }
  // Die Frist läuft jedes Jahr neu: für ein Anspruchsjahr vom 1. September des Vorjahres bis
  // zum 31. März des Anspruchsjahres [3]. Ist sie fürs gebaute Jahr vorbei, zeigt die App den
  // Betrag weiter — aber mit dem Hinweis, dass jetzt das Folgejahr dran ist. Anders als in AG
  // ist das kein Bedauern, sondern ein offenes Fenster.
  const fristAbgelaufen = new Date() > new Date(`${jahr}-03-31T23:59:59`);
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    noteKey: fristAbgelaufen ? 'ipv.sgFristFolgejahr' : 'ipv.sgFristLaeuft',
    noteParams: { jahr, folgejahr: jahr + 1 },
  });
}
