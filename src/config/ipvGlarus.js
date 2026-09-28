// Prämienverbilligung (IPV) Kanton Glarus — Richtprämie minus Selbstbehalt in Stufen, Jahr 2026 (K31).
//
// Belege (an der Quelle gelesen 28.09.2026; Gesetzessammlung über die API gesetze.gl.ch,
// Gegenprobe erfundene Nummer «VIII D/21/77» → HTTP 404; Dokumente der Fachstelle IPV über den
// Online-Schalter gl.ch, Gegenprobe erfundenes Asset → HTTP 404). Wortlaute in
// docs/sources/ipv-kantone-2026.md, Abschnitt GL:
//   [1] Einführungsgesetz zum KVG (EG KVG), GS VIII D/21/1, Version 2376 «in Kraft seit:
//       01.01.2023 bis: 31.12.2026». Art. 10: Gesamtanspruch (auch eheähnliche Gemeinschaft) ·
//       Art. 11 Abs. 2: Neugeborene ab dem 1. Januar des Folgejahres · Art. 12 Abs. 2/3:
//       Verhältnisse am 31.12. des Vorjahres, Veranlagung der vorletzten Steuerperiode ·
//       Art. 14: Richtprämie minus Selbstbehalt, höchstens die effektive Prämie · Art. 15:
//       Total der Einkünfte · Art. 16 Abs. 3: Kinder 80 % · Art. 17: auf Antrag.
//       Künftige Versionen: 2683 (01.01.–31.12.2027) und 2686 (ab 01.01.2028), beide
//       Landsgemeinde 03.05.2026 — für 2027 bleibt es beim Antrag.
//   [2] Prämienverbilligungsverordnung (PVV), GS VIII D/21/3, Version 2130 «in Kraft seit:
//       01.01.2020». Art. 1: Selbstbehalte 9–14 % · Art. 2/3: Zuschläge und Abzüge ·
//       Art. 4: Grenzbetrag 85'000.
//   [3] Vollzugsverordnung (VV PV), GS VIII D/21/2, Version 2133 «in Kraft seit: 01.01.2020».
//       Art. 6: Frist 31. Januar · Art. 9: Summe der Richtprämien, Aufteilung im Verhältnis,
//       unter Fr. 12 je Person keine Auszahlung · Art. 10: Richtprämien 85 % / 100 % ·
//       Art. 17: eigener Anspruch ab dem Jahr, in dem 18 vollendet wird.
//   [4] Fachstelle IPV, «Richtprämien für die Berechnung der Prämienverbilligung 2026», Glarus,
//       18. November 2025: Erwachsene 5'447, junge Erwachsene 3'896, Kinder 1'500 Fr.
//   [5] Fachstelle IPV, «Erläuterungen und Berechnungsbeispiele zur IPV 2026» — zwei amtliche
//       Beispiele, der Prüfstein der Tests (Alleinstehend 35'000 → 2'297; Eltern mit 2 Kindern
//       65'000 → 6'094).
//   [6] Fachstelle IPV, Merkblatt 2026 (Antrag bis 31. Januar 2026, Konkubinat Gesamtbetrag).
//   [7] Steuergesetz GL, GS VI C/1/1, Version 2445 (Stand 01.01.2024) Art. 45: steuerfreie
//       Beträge Vermögen 76'300 / 152'600 / je Kind 25'400 — Steuerperiode 2024 = Bemessungsjahr.
//
// ⟨korrigiert 28.09.2026⟩ Die Erhebung vom 16.09. hatte die Richtprämien nur abgeleitet
// (85 % × 6'408 = 5'446.80), weil gl.ch mit 403 antwortete. Amtlich publiziert sind sie
// GERUNDET: 5'447 [4]. Die App rechnet mit der publizierten Zahl.
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die Summe der Richtprämien des Haushalts, soweit sie einen Selbstbehalt
// übersteigt — und dieser Selbstbehalt ist ein Prozentsatz des GANZEN anrechenbaren
// Einkommens, der in 10'000er-Stufen von 9 % auf 14 % springt. An jeder Stufe fällt der
// Betrag sprunghaft (bei 40'000 → 40'001 um rund 400 Franken).
//
// BEWUSST NICHT GEBAUT:
//   · Paare, eingetragene Partnerschaft UND Konkubinat — alle mit Gesamtanspruch ([1] Art. 10
//     lit. a/b); das zweite Einkommen fehlt der App.
//   · junge Erwachsene in Ausbildung (Gesamtanspruch mit den Eltern, [3] Art. 18) und Kinder, die
//     im Anspruchsjahr 18 werden (eigener Anspruch, [3] Art. 17).
//   · Quellenbesteuerte (kein Anspruch bzw. Bruttoeinkommen, [1] Art. 9 Abs. 3 / Art. 16 Abs. 2),
//     EL- und Sozialhilfebeziehende (von Amtes wegen, [3] Art. 20), Personen im Ausland.
//   · Liegenschaften (Unterhaltskosten +, Eigenmietwert −), Alimente (−) [2] Art. 2/3; der
//     zusätzliche Vermögensfreibetrag bei halber IV-Rente [7] Art. 45 Ziff. 4 (die App kennt den
//     IV-Grad nicht — mit IV-Rente und Vermögen über 76'300 fällt der Betrag hier zu tief aus).
//   · Neugeborene im Anspruchsjahr zählen nicht ([1] Art. 11 Abs. 2) — sie werden weggelassen.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

// Werte 2026, wörtlich aus [1]–[4], [7]. Beträge in CHF je Jahr.
export const IPV_GL = {
  jahr: 2026,
  // [1] Art. 12 Abs. 3: «definitive Veranlagung … der vorletzten Steuerperiode».
  basisjahrAbstand: 2,
  // [4] Ziff. 1 lit. a–c.
  richtpraemie: { e: 5447, j: 3896, k: 1500 },
  // [2] Art. 1: «bis 40 000 Franken … 9 %» … «über 80 000 Franken … 14 %».
  selbstbehalt: [
    { bis: 40000, satz: 0.09 },
    { bis: 50000, satz: 0.10 },
    { bis: 60000, satz: 0.11 },
    { bis: 70000, satz: 0.12 },
    { bis: 80000, satz: 0.13 },
    { bis: Infinity, satz: 0.14 },
  ],
  // [2] Art. 2 lit. a: «zehn Prozent des steuerbaren Vermögens».
  vermoegenAnteil: 0.10,
  // [2] Art. 3 lit. b: «5000 Franken für jedes minderjährige Kind».
  kinderabzug: 5000,
  // [1] Art. 16 Abs. 3 i. V. m. [2] Art. 4: Kinder 80 % der Richtprämie bis 85'000.
  mindestanteilKind: 0.8,
  grenzbetragKinder: 85000,
  // [3] Art. 9 Abs. 3: «weniger als 12 Franken je Person und Jahr wird nicht ausgerichtet».
  mindestbetragJePerson: 12,
  // [7] Art. 45 Abs. 1 Ziff. 1–3 (Stand 01.01.2024).
  vermoegenFrei: { allein: 76300, alleinMitKindern: 152600, jeKind: 25400 },
  // [3] Art. 6 Abs. 1: «bis zum 31. Januar des Anspruchsjahres».
  frist: { monat: 1, tag: 31 },
};

// Selbstbehalt-Satz nach [2] Art. 1 — «bis» einschliesslich, wie im Wortlaut.
export function glSatz(ae) {
  return IPV_GL.selbstbehalt.find((s) => Math.max(0, ae) <= s.bis).satz;
}

// Anrechenbares Einkommen nach [1] Art. 15, [2] Art. 2/3.
export function glAnrechenbaresEinkommen({ totalEinkuenfte, vermoegen, kinderZahl }) {
  const p = IPV_GL;
  const frei = (kinderZahl > 0 ? p.vermoegenFrei.alleinMitKindern : p.vermoegenFrei.allein)
    + p.vermoegenFrei.jeKind * kinderZahl;
  const steuerbar = Math.max(0, Math.max(0, vermoegen) - frei);
  return Math.max(0, totalEinkuenfte + p.vermoegenAnteil * steuerbar - p.kinderabzug * kinderZahl);
}

// Reine Rechnung — ohne App-Daten, damit die Tests die amtlichen Beispiele [5] nachrechnen.
// `erwachsene` gibt es nur für das Beispiel «Eltern mit 2 Kindern»; die App rechnet mit 1.
//
// 🛑 DIE OFFENE STELLE, wie in BL: [1] Art. 16 Abs. 3 garantiert Kindern 80 % der Richtprämie,
// «sofern die Berechnung gemäss Artikel 14 Absatz 1 einen tieferen Anspruch … ergibt». Zwei
// Lesarten:
//   (a) Boden auf dem Ganzen: Gesamtanspruch = max(Differenz, Kinder × 80 %).
//   (b) Boden je Kind: Differenz im Verhältnis der Richtprämien verteilt ([3] Art. 9 Abs. 1),
//       jedes Kind erhält mindestens 80 % — zusätzlich zum Anteil der Erwachsenen.
// Das amtliche Beispiel [5] (65'000, zwei Kinder, 6'094) passt nur zu (a) — oder es lässt die
// Garantie weg, obwohl 65'000 unter 85'000 liegt; der Satz direkt darunter nennt sie ausdrücklich.
// Nach (b) wären es 7'178. Die App rechnet beide und zeigt eine Zahl nur, wo sie übereinstimmen.
export function ipvGlarusRechnen({ kinderZahl = 0, ae, erwachsene = 1 }) {
  const p = IPV_GL;
  const rp = p.richtpraemie;
  const ae0 = Math.max(0, ae);
  const satz = glSatz(ae0);
  const selbstbehalt = satz * ae0;
  const summe = erwachsene * rp.e + kinderZahl * rp.k;
  const differenz = Math.max(0, summe - selbstbehalt);
  const garantie = kinderZahl > 0 && ae0 <= p.grenzbetragKinder;
  const bodenKind = garantie ? p.mindestanteilKind * rp.k : 0;
  const anteilE = summe > 0 ? (differenz * rp.e) / summe : 0;
  const anteilK = summe > 0 ? (differenz * rp.k) / summe : 0;
  // Beide Lesarten, je Person aufgeteilt (für Deckel und Mindestbetrag je Person).
  // (a) Boden auf dem Ganzen, Kinder zuerst: liegt der Kinderanteil unter dem Boden, erhalten die
  //     Kinder den Boden und die Erwachsenen den Rest der Differenz (höchstens bis 0).
  let a = { erwachsen: anteilE, kind: anteilK };
  if (kinderZahl > 0 && anteilK < bodenKind) {
    a = { erwachsen: Math.max(0, differenz - kinderZahl * bodenKind) / erwachsene, kind: bodenKind };
  }
  const b = { erwachsen: anteilE, kind: Math.max(anteilK, bodenKind) };
  return {
    satz, selbstbehalt, summe, differenz, garantie,
    varianten: { a, b },
    maximal: summe,
  };
}

// Summe nach [3] Art. 9 Abs. 3 — je Person unter 12 Franken nichts.
function proPerson(v) {
  return v < IPV_GL.mindestbetragJePerson ? 0 : v;
}

export function ipvGlarus(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_GL.jahr;
  const basisjahr = jahr - IPV_GL.basisjahrAbstand;
  // Richtprämien 2027 publiziert die Fachstelle im November 2026 — ab 01.01.2027 keine Zahl.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  // [1] Art. 10 lit. a/b: gemeinsam Besteuerte und eheähnliche Gemeinschaft = Gesamtanspruch.
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // [1] Art. 12 Abs. 2: Verhältnisse am 31.12. des Vorjahres; [3] Art. 10: Erwachsene «über 25».
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.abEndeVorjahr(jahr, geburt)) return orientierung('alter');
  // Kinder: höchstmögliches Alter im Anspruchsjahr (eingetipptes Alter + 1). Wer im
  // Anspruchsjahr 18 wird, hat einen eigenen Anspruch ([3] Art. 17) — nicht gebaut.
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  if (kinderJahre.some((a) => a >= 18)) return orientierung('haushalt');
  // [1] Art. 11 Abs. 2 / Art. 12 Abs. 2: ein im Anspruchsjahr geborenes Kind zählt erst ab dem
  // Folgejahr. Nur mit Geburtsdatum erkennbar (das Alter 0 gilt ohnehin als «nicht erfasst»).
  const kinderZahl = (hh.children || []).filter((c) => !String(c.birthDate || '').startsWith(String(jahr))).length;

  const roh = rohesEinkommenJahr(f);
  if (roh < 0) return orientierung('einkommenNegativ');
  const ae = glAnrechenbaresEinkommen({
    totalEinkuenfte: einkommenJahr(f, SAEULE_3A.totalDerEinkuenfte),
    vermoegen: vermoegenSumme(f),
    kinderZahl,
  });

  // [1] Art. 14 Abs. 1: «höchstens aber der effektiven Jahresprämie … der anspruchsberechtigten
  // Person» — je Person, also nur der Anteil der erwachsenen Person gegen ihre Prämie.
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');

  const r = ipvGlarusRechnen({ kinderZahl, ae });
  const nachDeckel = (v) => Math.round(Math.min(proPerson(v.erwachsen), praemie) + kinderZahl * proPerson(v.kind));
  const va = nachDeckel(r.varianten.a);
  const vb = nachDeckel(r.varianten.b);
  if (va !== vb) return orientierung('mindestanspruch');
  const annual = vb;
  const maxAnnual = deckelnProPerson(r.maximal, IPV_GL.richtpraemie.e, praemie);
  // Keine publizierte Einkommensgrenze — sie ergäbe sich nur aus der Rechnung. Der Grenzbetrag
  // 85'000 gilt nur für die Kindergarantie.
  const cantonData = { ...ipvData, maxIncome: null };
  const gemeinsam = {
    canton: 'GL', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltGL',
    extra: { basisjahr, jahrKey: 'ipv.jahrGL' },
  };
  if (annual <= 0) {
    const roheSumme = r.varianten.b.erwachsen + kinderZahl * r.varianten.b.kind;
    return ergebnisOhneAnspruch({
      ...gemeinsam,
      noteKey: roheSumme > 0 ? 'ipv.glUnterMindestbetrag' : 'ipv.glKeinAnspruch',
    });
  }
  // [3] Art. 6 Abs. 1/1a: Antrag bis 31. Januar des Anspruchsjahres; danach nur die Prämien ab
  // dem Folgemonat nach der Antragstellung.
  const fristVorbei = new Date() > new Date(`${jahr}-01-31T23:59:59`);
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    extra: { ...gemeinsam.extra, anmeldefristVorbei: fristVorbei },
    noteKey: fristVorbei ? 'ipv.glFristVorbei' : 'ipv.glFristLaeuft',
    noteParams: { jahr, folgejahr: jahr + 1 },
  });
}
