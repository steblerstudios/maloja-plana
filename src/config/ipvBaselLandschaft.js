// Prämienverbilligung (IPV) Kanton Basel-Landschaft — Richtprämie minus Prozentanteil, Jahr 2026 (K31).
//
// Belege (an der Quelle gelesen 28.09.2026 über die API der Gesetzessammlung bl.clex.ch;
// Gegenprobe erfundene Erlassnummer 362.19 → HTTP 404, erfundene Version 99999 → HTTP 404).
// Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt BL:
//   [1] Einführungsgesetz zum KVG (EG KVG), SGS 362, Version 4310 «in Kraft seit: 01.04.2023
//       (Beschlussdatum: 16.03.2023)». § 8 Abs. 2: Richtprämie minus Prozentanteil · Abs. 2bis:
//       höchstens die bezahlte Prämie · Abs. 3: Kinder mindestens 80 % · § 9 Abs. 1: massgebendes
//       Jahreseinkommen · Abs. 3: Veranlagung Vor-Vorjahr · Abs. 4: Berechnungseinheit ·
//       § 9a: veränderte Verhältnisse · § 9c: Verwirkung · § 13: Rückerstattung.
//   [2] Dekret über die Einkommensobergrenzen und den Prozentanteil, SGS 362.1, Version 1922
//       «in Kraft seit: 01.01.2014». § 1: Obergrenzen · § 2: 7,75 %.
//   [3] Prämienverbilligungsverordnung (PVV), SGS 362.12, Version 4361 «in Kraft seit:
//       01.01.2026 (Beschlussdatum: 18.11.2025)». § 5: Richtprämien · § 6 Abs. 2: kein
//       Mindestbetrag · § 9 Abs. 1 lit. a: Erwachsene ab dem 1. Januar nach dem 25. Altersjahr ·
//       § 10: Antragsformular von Amtes wegen.
//   [4] Steuerverwaltung BL, «Wegleitung zur Steuererklärung 2024» (2 W 2024 240917,
//       bl-api.webcloud7.ch/…/unselbstaendig-erwerbende-2024/wegleitung-zur-steuererklarung_int_2_w_2024_240917.pdf,
//       mit curl und Browser-Kennung HTTP 200 am 28.09.2026; ohne Kennung antwortet der Server
//       mit 403): Ziffer 100 (Nettolohn), 310/320 (erhaltene Unterhaltsbeiträge), 380 (übrige
//       Einkünfte, Familienzulagen), Ziffer 399 (Zwischentotal), Ziffer 610 (Säule 3a),
//       Ziffern 900/905 (steuerfreie Beträge Vermögen), Ziffer 750 (Kinderabzug Staatssteuer).
//       ⟨Vermerk 28.09.2026, Fixrunde 1 und Re-Review: die Ziffern 310/320/380 wurden in dieser
//       Runde NICHT nachgelesen — die Wegleitung antwortete mit 403. Sie sind Angabe der
//       Vorgänger-Sitzung; tragend für Familienzulagen und erhaltene Alimente ist [6] § 24.⟩
//   [6] Steuergesetz BL (SGS 331) § 50 Abs. 1 lit. a/b: steuerfreie Beträge 180'000 / 90'000
//       (Primärquelle zu [4] Ziffern 900/905; Fachprüfung 28.09.2026, K3). § 24 Abs. 1:
//       steuerbar sind lit. a Einkünfte aus unselbständiger Erwerbstätigkeit «mit Einschluss …
//       Zulagen», lit. c «Einkünfte aus Sozialversicherungs- und Ausgleichskassen», lit. f
//       «Unterhaltsbeiträge, die der geschiedene oder getrennt lebende Ehegatte für sich und die
//       unter seiner elterlichen Sorge stehenden Kinder erhält». Version 3502 («Stand 1. Januar
//       2023»), bl.clex.ch/api/de/versions/3502/pdf_file, gelesen 28.09.2026 (Version 99999 → 404).
//       Damit sind Familienzulagen und erhaltene Alimente am Gesetz belegt, auch ohne [4].
//   [5] SVA BL, Seiten «Ordentlicher Anspruch» und «IPV Online-Rechner» (2026): Formular von
//       Amtes wegen, Frist 1 Jahr; Rechner: «Zwischentotal der steuerbaren Einkünfte 399».
// 🛑 KEIN AMTLICHES BERECHNUNGSBEISPIEL GEFUNDEN. Die SVA publiziert nur den Online-Rechner,
// und der prüft Obergrenze und Anspruch, nicht den Betrag (nicht mit Daten gefüttert). Die
// Tests rechnen darum gegen den Wortlaut von [1]–[3], nicht gegen ein Beispiel.
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die Summe der Jahresrichtprämien der Berechnungseinheit, soweit sie 7,75 %
// des massgebenden Jahreseinkommens übersteigt — aber nur bis zu einer harten Obergrenze
// (allein 31'000); darüber fällt der Anspruch ganz weg, ohne Auslaufzone.
//
// WAS BASEL-LANDSCHAFT VON DEN BISHERIGEN KANTONEN UNTERSCHEIDET
// 1. DIE OBERGRENZE IST EINE KLIPPE ([2] § 1: «anspruchsabschliessende Obergrenze»). Knapp
//    darunter bleiben rund 2'190 im Jahr, darüber nichts.
//    ⟨korrigiert 28.09.2026, Fachprüfung W2: hier stand «bei 31'000 … 2'193.50 — bei 31'001
//    nichts». Der amtliche Rechner der SVA (sva_onlinecalculator.js, Knopf «check») rechnet
//    `einkommen - obergrenze >= 0` → «NEIN», also schon bei GENAU 31'000 kein Anspruch. Das passt
//    zu «anspruchsabschliessend»; die App folgt jetzt der ausführenden Stelle.⟩
// 2. GEMESSEN VOR DEN ABZÜGEN: Zwischentotal der steuerbaren Einkünfte (Ziffer 399) — Nettolohn
//    nach AHV/ALV/PK/NBU ([4] Ziffer 100), noch ohne Berufsauslagen, Versicherungs- und
//    3a-Abzug. Das liegt nahe am Nettoeinkommen der App; `SAEULE_3A.nichtAbgezogen`.
// 3. 20 % des STEUERBAREN Vermögens, also nach dem steuerfreien Betrag von 90'000 (allein) bzw.
//    180'000 (Einelternfamilie) ([4] Ziffern 900/905). Keine Vermögensgrenze.
// 4. KEINE PRÄMIENREGION für die Richtprämie ([3] § 5 kennt eine je Altersklasse).
//
// BEWUSST NICHT GEBAUT:
//   · Paare, eingetragene Partnerschaft (eine Berechnungseinheit, [1] § 9 Abs. 4) — das zweite
//     Einkommen fehlt der App. Konkubinat rechnet BL getrennt ([5] Rechner: «Das Konkubinat
//     ist für die Berechnung nicht relevant»), aber welchem Elternteil die Kinder zählen, hängt
//     am Kinderabzug — die App rechnet darum auch dort nicht.
//   · junge Erwachsene (eigene Richtprämie 318, Regeln [1] § 8 Abs. 1bis, [3] §§ 14a–14c).
//   · Kinder, die nach dem Bemessungsjahr geboren sind: sie stehen nicht in der Veranlagung
//     des Vor-Vorjahres und zählen erst auf Gesuch ([1] § 9a) — die App zeigt dann keine Zahl.
//   · Quellenbesteuerte ([3] § 18c), Zuziehende ([3] §§ 13, 14 — Veranlagung des früheren
//     Kantons), Sozialhilfe ([3] § 4), Personen in der EU/EFTA.
//   · Einkünfte aus Liegenschaften ([1] § 9 Abs. 1 lit. a/Abs. 2) — die App erfasst sie nicht.
//     ⟨korrigiert 28.09.2026, Fachprüfung B2: hier stand auch «und Unterhaltsbeiträge (lit. c)
//     — die App erfasst sie nicht». Falsch: `alimentePaid`, `alimenteReceived` und
//     `familienzulagen` sind erfasst, und BL RECHNET SIE JETZT SELBST (siehe `blZwischentotal`).⟩
//   · Schulden: steuerbar ist das REINvermögen ([6] § 50); `vermoegenSumme` zieht keine
//     Schulden ab — über 90'000 fällt der Betrag dadurch zu tief aus (Fachprüfung K4).
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';
import { zahl } from '../utils/geld.js';

// Werte 2026, wörtlich aus [1]–[4]. Beträge in CHF.
export const IPV_BL = {
  jahr: 2026,
  // [1] § 9 Abs. 3: «Massgebend ist die rechtskräftige Steuerveranlagung für das Vor-Vorjahr.»
  basisjahrAbstand: 2,
  // [3] § 5 Abs. 1: «CHF 383.– im Monat für Erwachsene; CHF 318.– … junge Erwachsene;
  // CHF 164.– … Kinder» — hier je MONAT, wie im Erlass.
  richtpraemieMonat: { e: 383, j: 318, k: 164 },
  // [2] § 2 Abs. 1: «beträgt 7,75%».
  prozentanteil: 0.0775,
  // [2] § 1 Abs. 1 lit. a–d (1 erwachsene Person): ohne Kinder 31'000, 1 Kind 52'000,
  // 2 Kinder 68'000, «pro weiteres Kind je CHF 11'000».
  obergrenzeAllein: [31000, 52000, 68000],
  obergrenzeJeWeiteresKind: 11000,
  // [1] § 8 Abs. 3: «Für anspruchsberechtigte Kinder werden mindestens 80 % … der
  // entsprechenden kantonalen Jahresrichtprämie ausgerichtet.»
  mindestanteilKind: 0.8,
  // [1] § 9 Abs. 1 lit. b: «20 % des steuerbaren Vermögens»; lit. d: «CHF 5'000 für jedes Kind,
  // für welches bei der Staatssteuer ein Kinderabzug gewährt wird».
  vermoegenAnteil: 0.2,
  kinderabzug: 5000,
  // [6] § 50 Abs. 1 und [4] Ziffern 900/905 (Wegleitung 2024 = Bemessungsjahr für 2026): steuerfreier Betrag
  // «CHF 180’000 für … Einelternfamilien», «CHF 90’000 für alle anderen».
  vermoegenFrei: { allein: 90000, einelternfamilie: 180000 },
};

// Zwischentotal der steuerbaren Einkünfte (Ziffer 399) aus den App-Angaben, dazu der Abzug der
// geleisteten Unterhaltsbeiträge nach [1] § 9 Abs. 1 lit. c. ⟨28.09.2026, Fachprüfung B2⟩
//   · Lohn, Nebenerwerb, Renten: `einkommenJahr` — die 3a ist in Ziffer 399 nicht abgezogen
//     (`SAEULE_3A.nichtAbgezogen`, Abzug 0).
//   · erhaltene Unterhaltsbeiträge (`alimenteReceived`): [4] Ziffern 310/320 — steuerbare
//     Einkünfte vor Ziffer 399; [6] § 24 Abs. 1 lit. f.
//   · Familienzulagen (`familienzulagen`): [6] § 24 Abs. 1 lit. a/c; [4] Ziffer 100 («Zulagen» im Lohn) bzw. Ziffer 380
//     («Familienzulagen … in der Ziffer 380 ‹übrige Einkünfte› zu deklarieren») — beides vor 399.
//     (Ziffern 310/320/380: Angabe der Vorgänger-Sitzung, nicht nachgelesen — Wegleitung → 403.)
//     Die App führt sie wie data/haushaltsEinnahmen.js ZUSÄTZLICH zum Lohn.
//   · bezahlte Unterhaltsbeiträge (`alimentePaid`): [1] § 9 Abs. 1 lit. c «vermindert um …
//     geleistete Unterhaltsbeiträge, für die bei der Staatsteuer ein Abzug gewährt wird».
//     GEWÄHLT: der Abzug gilt als gewährt (Regelfall bei Alimenten an Ex-Ehegatten und
//     minderjährige Kinder; ob er im Einzelfall gewährt wurde, weiss die App nicht).
// Unlesbar oder negativ ⇒ 0, wie in Uri. Das Ergebnis darf unter 0 fallen; der Boden liegt in
// `blMassgebendesEinkommen`.
export function blZwischentotal(f) {
  const monatlich = (v) => { const x = Number(v); return Number.isFinite(x) && x > 0 ? x * 12 : 0; };
  return einkommenJahr(f, SAEULE_3A.nichtAbgezogen)
    + monatlich(f.alimenteReceived) + monatlich(f.familienzulagen) - monatlich(f.alimentePaid);
}

// Obergrenze nach [2] § 1 für eine erwachsene Person mit `kinderZahl` Kindern.
export function blObergrenze(kinderZahl) {
  const p = IPV_BL;
  if (kinderZahl < p.obergrenzeAllein.length) return p.obergrenzeAllein[kinderZahl];
  return p.obergrenzeAllein[2] + (kinderZahl - 2) * p.obergrenzeJeWeiteresKind;
}

// Massgebendes Jahreseinkommen nach [1] § 9 Abs. 1 — aus dem Zwischentotal (hier: dem
// genäherten Jahres-Nettoeinkommen), 20 % des steuerbaren Vermögens und 5'000 je Kind.
export function blMassgebendesEinkommen({ zwischentotal, vermoegen, kinderZahl }) {
  const p = IPV_BL;
  const frei = kinderZahl > 0 ? p.vermoegenFrei.einelternfamilie : p.vermoegenFrei.allein;
  const steuerbar = Math.max(0, Math.max(0, vermoegen) - frei);
  return Math.max(0, zwischentotal + p.vermoegenAnteil * steuerbar - p.kinderabzug * kinderZahl);
}

// Reine Rechnung — ohne App-Daten. Liefert Jahresbeträge, ungerundet.
//
// 🛑 DIE EINE OFFENE STELLE: wie die Mindestverbilligung der Kinder ([1] § 8 Abs. 3) mit der
// Differenzrechnung ([1] § 8 Abs. 2) zusammenwirkt, sagt keine Quelle, und ein amtliches
// Beispiel gibt es nicht. Zwei Lesarten:
//   (a) «Boden auf dem Ganzen»: Betrag = max(Differenz, Kinderzahl × 80 % Richtprämie Kind);
//       die Kinder erhalten zuerst ihren Mindestanteil, der Rest geht an die erwachsene Person.
//   (b) «Boden je Kind»: die Differenz wird im Verhältnis der Richtprämien verteilt, und jedes
//       Kind erhält mindestens 80 % seiner Richtprämie — zusätzlich zum Anteil der Erwachsenen.
// Der Abstand wächst mit dem Einkommen: 1 Kind, 40'000 → 536; 1 Kind, 51'000 → 791; 2 Kinder,
// 68'000 → 1'644 Franken (Fachprüfung K1, am Modul nachgerechnet). (a) ist immer ≤ (b), also
// unter beiden Lesarten eine Untergrenze. Die App rechnet beide und zeigt eine Zahl nur, wo sie übereinstimmen
// (`unklar`); sonst keine Zahl, und die Frage liegt bei der SVA BL.
export function ipvBaselLandschaftRechnen({ kinderZahl = 0, me }) {
  const p = IPV_BL;
  const rpE = p.richtpraemieMonat.e * 12;
  const rpK = p.richtpraemieMonat.k * 12;
  const grenze = blObergrenze(kinderZahl);
  const me0 = Math.max(0, me);
  const summe = rpE + kinderZahl * rpK;
  // «anspruchsabschliessend» — ab der Grenze kein Anspruch, wie der SVA-Rechner (siehe Kopf).
  if (me0 >= grenze) {
    return { grenze, ueberGrenze: true, total: 0, erwachsenenAnteil: 0, maximal: summe, unklar: false, varianten: null };
  }
  const differenz = Math.max(0, summe - p.prozentanteil * me0);
  const bodenKind = p.mindestanteilKind * rpK;
  // (a) Boden auf dem Ganzen, Kinder zuerst
  const a = {
    total: Math.max(differenz, kinderZahl * bodenKind),
    erwachsenenAnteil: Math.max(0, differenz - kinderZahl * bodenKind),
  };
  // (b) Boden je Kind, Aufteilung im Verhältnis der Richtprämien
  const anteilE = summe > 0 ? (differenz * rpE) / summe : 0;
  const anteilK = summe > 0 ? (differenz * rpK) / summe : 0;
  const b = {
    total: anteilE + kinderZahl * Math.max(anteilK, bodenKind),
    erwachsenenAnteil: anteilE,
  };
  return {
    grenze, ueberGrenze: false, differenz,
    // Ohne Kinder sind beide Lesarten dieselbe Rechnung.
    total: b.total, erwachsenenAnteil: b.erwachsenenAnteil,
    maximal: summe,
    varianten: { a, b },
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für BL mit Beleg. Keine Prämienregion ⇒
// `lookupPLZ` wird nicht gebraucht (Register: brauchtPLZ false).
export function ipvBaselLandschaft(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_BL.jahr;
  const basisjahr = jahr - IPV_BL.basisjahrAbstand;
  // Richtprämien setzt der Regierungsrat jährlich fest ([3] § 5, zuletzt 18.11.2025). Für 2027
  // lag am 28.09.2026 keine neue Fassung vor — ab dem 01.01.2027 keine Zahl.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // [3] § 9 Abs. 1 lit. a: erwachsen «ab dem 1. Januar nach Vollendung des 25. Altersjahres» —
  // wer im Anspruchsjahr 26 wird. BELEGT; der Online-Rechner [5] sagt «Erwachsene/r (ab
  // Jahrgang 2000)».
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung('alter');
  // Kinder bis zum 31. Dezember des Jahres, in dem sie 18 werden ([3] § 9 Abs. 1 lit. b: junge
  // Erwachsene «ab dem 1. Januar nach Vollendung des 18. Altersjahres»). Eingetipptes Alter +1.
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');
  // Ein Kind, das nach dem Bemessungsjahr geboren sein KANN, steht nicht in der Veranlagung
  // des Bemessungsjahres und zählt erst auf Gesuch ([1] § 9a). Geprüft am TIEFSTmöglichen Alter
  // (eingetipptes Alter ohne Zuschlag): ist es ≤ jahr − basisjahr − 1 (2026: ≤ 1), kann die Geburt
  // nach 2024 liegen. Mit Geburtsdatum ist das Alter genau.
  if (kinderAlter(hh.children, jahr, 0).some((a) => a <= jahr - basisjahr - 1)) return orientierung('blKindNeu');
  const kinderZahl = kinderJahre.length;

  const roh = rohesEinkommenJahr(f);
  if (roh < 0) return orientierung('einkommenNegativ');
  const me = blMassgebendesEinkommen({
    zwischentotal: blZwischentotal(f),
    vermoegen: vermoegenSumme(f),
    kinderZahl,
  });

  // [1] § 8 Abs. 2bis: «Der ausbezahlte Betrag darf die tatsächlich bezahlte Prämie nicht übersteigen.»
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');

  const r = ipvBaselLandschaftRechnen({ kinderZahl, me });
  const cantonData = { ...ipvData, maxIncome: r.grenze };
  const gemeinsam = {
    canton: 'BL', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltBL',
    extra: { basisjahr, jahrKey: 'ipv.jahrBL' },
  };
  if (r.ueberGrenze) {
    // Fachprüfung W1: der Satz nennt die Veranlagung {basisjahr} — verglichen wird das heutige
    // Einkommen mit einer Klippe, knapp darüber ist «kein Anspruch» eine Aussage über eine Näherung.
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.blKeinAnspruch', noteParams: { grenze: zahl(r.grenze), basisjahr } });
  }
  // Beide Lesarten der Kinder-Mindestverbilligung nach dem Deckel — nur wenn sie denselben
  // Betrag ergeben, steht eine Zahl.
  const nachDeckel = (v) => Math.round(deckelnProPerson(v.total, v.erwachsenenAnteil, praemie));
  if (nachDeckel(r.varianten.a) !== nachDeckel(r.varianten.b)) return orientierung('mindestanspruch');
  const annual = nachDeckel(r.varianten.b);
  const maxAnnual = Math.round(deckelnProPerson(r.maximal, IPV_BL.richtpraemieMonat.e * 12, praemie));
  // [1] § 9c: Formular innert 1 Jahr zurück, sonst Gesuch bis Ende des Anspruchsjahres.
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    noteKey: 'ipv.blAntrag', noteParams: { jahr, basisjahr },
  });
}
