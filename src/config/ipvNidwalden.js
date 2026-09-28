// Prämienverbilligung (IPV) Kanton Nidwalden — amtliches Selbstbehalt-Modell, Jahr 2026 (K31).
// Auf dem gemeinsamen Rahmen (config/kantonsModell.js).
//
// Belege (an der Quelle gelesen 28.09.2026, jede Adresse mit Gegenprobe), Wortlaute in
// docs/sources/ipv-kantone-2026.md, Abschnitt NW. Gelesen über die API der Gesetzessammlung
// (https://gesetze.nw.ch/api/de/texts_of_law/<nr>/show_as_json; erfundene 742.199 → 404) — die
// `/app/…`-Seite ist eine Hülle:
//   [1] NG 742.111 Verordnung zur Prämienverbilligung für das Jahr 2026, «Aktuelle Version in Kraft
//       seit: 01.01.2026 (Beschlussdatum: 09.12.2025)». § 1: Selbstbehalt 10 %, Reinvermögen
//       20 % · § 2 Abs. 2: Richtprämien · § 3: Steuerperiode 2024 (sonst 2023) · § 5: unter
//       Fr. 100 keine Auszahlung.
//   [2] NG 742.1 Einführungsgesetz zum KVG (kKVG), «Aktuelle Version in Kraft seit: 31.12.2025».
//       Art. 12: allgemeine Prämienverbilligung, Summe der Steuerwerte · Art. 14: Kinder 80 % bis
//       Steuerwerte 100 000 · Art. 15: junge Erwachsene in Ausbildung · Art. 16 Abs. 2:
//       Gesamtanspruch · Art. 17: Stichtag 1. Januar, Geburten bis Ende Jahr · Art. 20a:
//       Plafonierung · Art. 22: Gesuch bis 30. April, verwirkt · Art. 28: Rückerstattung.
//   [3] Ausgleichskasse Nidwalden, Merkblatt «Prämienverbilligung 2026 im Kanton Nidwalden»,
//       Februar 2026 — Jahrgänge, Code 330/470, Aufrechnungen, Frist «30. April 2026
//       (Poststempel)».
//   [4] NG 521.1 Steuergesetz, Art. 35 Abs. 1 Ziff. 3 (Unterhaltsbeiträge) und Ziff. 5 (Säule 3a):
//       beide sind im Reineinkommen abgezogen.
//   Kein amtlich durchgerechnetes Beispiel gefunden; der Online-Rechner der AK rechnet auf dem
//   Server (Formular) und wurde bewusst nicht abgeschickt.
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die Richtprämie, soweit sie 10 % der «Summe der Steuerwerte» übersteigt —
// Reineinkommen plus wenige Aufrechnungen plus 20 % des ganzen Reinvermögens. Linear,
// 10 Rappen je Franken, eine Prämienregion.
//
// WAS NIDWALDEN VON DEN BISHERIGEN KANTONEN UNTERSCHEIDET
//
// 1. GEMESSEN AM REINEINKOMMEN, IN DEM DIE 3A ABGEZOGEN IST — und nicht wieder aufgerechnet
//    (Art. 12 Abs. 2 [2] nennt sie nicht). Darum die neue Regel `SAEULE_3A.abgezogen`: die App
//    nimmt die ganze Einzahlung aus ihrem Nettoeinkommen heraus. Ebenso die bezahlten
//    Unterhaltsbeiträge (Art. 35 Abs. 1 Ziff. 3 [4]).
//
// 2. VERMÖGEN OHNE FREIBETRAG: «20 Prozent des gesamten Reinvermögens» (Art. 12 Abs. 2 Ziff. 6
//    [2], [1] § 1 Abs. 2; Merkblatt: Code 470). Keine Vermögensgrenze.
//
// 3. 🛑 KINDER: DIE REGEL LÄSST DREI LESARTEN ZU. Art. 14 Abs. 1 [2]: 80 % der Richtprämie, wenn
//    die Steuerwerte 100 000 nicht übersteigen. Abs. 2: «Besteht nach Berücksichtigung der
//    besonderen Prämienverbilligung weiterhin ein Anspruch auf allgemeine Prämienverbilligung für
//    die Kinder, wird diese zusätzlich ausgerichtet.» Wie genau, sagt weder Gesetz noch Merkblatt:
//      (a) wie LU/UR — das Kind zählt in der allgemeinen Rechnung nur mit den restlichen 20 %
//          (gleichwertig: max(80 %, Summe Richtprämien − Selbstbehalt));
//      (b) je Kind das Höhere aus 80 % und seinem Anteil am allgemeinen Anspruch;
//      (c) 80 % plus der Anteil, bis zur vollen Richtprämie.
//    Einelternhaushalt, ein Kind, Steuerwerte 30 000: (a) 3 660 · (b) 3 976 · (c) 4 228 im Jahr.
//    Alle drei fallen zusammen, sobald die Summe der Richtprämien den Selbstbehalt nicht mehr
//    übersteigt — dort (und über 100 000) rechnet die App; darunter zeigt sie keine Zahl
//    (`mindestanspruch`), wie ZH in seinem strittigen Band. Frage an die AK Nidwalden.
//
// 4. ANTRAG MIT VERWIRKUNG bis 30. April (Art. 22 Abs. 1/6 [2]). Darum `anmeldefristVorbei` und
//    den Nidwaldner Frist-Hinweis für KK-Karte, Prämien-Beleg und Budget (`fristNichtAbgezogenKey`).
//
// 5. PLAFONIERUNG (Art. 20a [2]) — auf die eigene Prämie, nur der Anteil der erwachsenen Person.
//
// GEWÄHLT, NICHT BELEGT:
//   · Mindestbetrag 100 ([1] § 5, «Beträge») auf der Summe, nicht je Person.
//   · Keine Rundung: Gesetz und Verordnung nennen keine; die App rechnet auf ganze Franken im Jahr.
//   · Erwachsen nach der Jahrgangstabelle des Merkblatts («Jahrgang 2000 und älter»),
//     `imAnspruchsjahr`; Kinder «Jahrgang 2008 und jünger».
//
// BEWUSST NICHT GEBAUT:
//   · Paare (Gesamtanspruch, Art. 16 Abs. 2 [2]) — zweites Einkommen fehlt.
//   · junge Erwachsene (Art. 15: in Ausbildung 50 %, eigenes Reineinkommen bis 30 240) —
//     Ausbildungsstatus fehlt; Grund `ausbildung`.
//   · Quellenbesteuerte ([1] § 4: 80 %, Periode 2025), EL und Sozialhilfe (Art. 13: volle
//     Richtprämie; EL-Richtprämien [1] § 2 Abs. 1), Zuzug aus dem Ausland (Art. 17 Abs. 3).
//   · Aufrechnungen BGSA-Lohn, BVG-Einkauf, Teileinkünfte, Liegenschaftsunterhalt (Art. 12 Abs. 2
//     Ziff. 2–5) — nicht erfasst. Und die übrigen Abzüge im Reineinkommen (Berufskosten,
//     Versicherungsabzug usw.): das Einkommen der App liegt darum eher zu HOCH, der Betrag eher
//     zu TIEF. Der Vorbehalt sagt es.
//   · ⟨Fachprüfung #486, W3, 28.09.2026: bis dahin stand hier «ein im Anspruchsjahr geborenes Kind
//     zählt mit … ohne Kürzung für die Monate vor der Geburt». Das ergab bei einer Geburt im
//     Dezember den ganzen Jahresbetrag, obwohl Art. 20a [2] auf die geschuldete Prämie deckelt.⟩
//     Jetzt: das Kind zählt (Art. 17 Abs. 2 [2]: Geburten «bis Ende Kalenderjahr»), sein Anteil
//     aber nur für die Monate ab dem Geburtsmonat — GEWÄHLT: Prämie geschuldet ab dem
//     Geburtsmonat (nicht am KVG gelesen); der Monatsanteil (höchstens 80 % der Richtprämie, 84)
//     liegt unter der Kinder-Richtprämie je Monat (105), der Deckel wirkt also über die Monate.
//
// ERHALTENE UNTERHALTSBEITRÄGE ⟨Fachprüfung #486, W2⟩: StG Art. 26 Abs. 1 Ziff. 6 [4] (Fassungen
//   2023–2024 und seit 2026 gleich) zählt sie zu den steuerbaren Einkünften, also zum Reineinkommen.
//   Die App rechnet `finanzen.alimenteReceived` (monatlich) darum hinzu — wie sie die bezahlten
//   (Art. 35 Abs. 1 Ziff. 3) abzieht. Familienzulagen nennt Art. 26 nicht; sie gehören als
//   «Zulagen» zum Lohn (Art. 18 Abs. 1) — ob sie im Monatslohn der App schon stecken, ist eine
//   Rahmenfrage; nicht gerechnet, der Vorbehalt nennt beide Richtungen.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

// Werte 2026. Alle Beträge sind Jahresbeträge in CHF.
export const IPV_NW = {
  jahr: 2026,
  // [1] § 3: «Für die Prämienverbilligung im Jahre 2026 ist die Steuerperiode 2024 massgebend».
  basisjahrAbstand: 2,
  // [1] § 2 Abs. 2: «für Erwachsene Fr. 5'400.–, für junge Erwachsene Fr. 3'912.– und für Kinder
  // Fr. 1'260.–».
  richtpraemie: { e: 5400, j: 3912, k: 1260 },
  // [1] § 1 Abs. 1: «Der Selbstbehalt für das Jahr 2026 beträgt 10 Prozent.»
  selbstbehalt: 0.10,
  // [1] § 1 Abs. 2: «… Anteil des anrechenbaren Reinvermögens beträgt 20 Prozent.»
  vermoegenAnteil: 0.20,
  // [2] Art. 14 Abs. 1: «zu 80 Prozent vergütet, sofern die Summe der Steuerwerte der Eltern …
  // Fr. 100'000.– nicht übersteigt.»
  kind: { anteil: 0.8, grenze: 100000 },
  // [1] § 5: «Beträge unter Fr. 100.– sind von der Auszahlung ausgeschlossen.»
  mindestbetrag: 100,
};

// Die Rechnung — ohne App-Daten. `sw` = Summe der Steuerwerte. Jahresbeträge in CHF.
export function ipvNidwaldenRechnen({ kinderZahl = 0, sw }) {
  const p = IPV_NW;
  const r = p.richtpraemie;
  const sw0 = Math.max(0, sw);
  const selbstbehalt = p.selbstbehalt * sw0;
  const summe = r.e + kinderZahl * r.k;
  const allgemein = Math.max(0, summe - selbstbehalt);
  const besondereGilt = kinderZahl > 0 && sw0 <= p.kind.grenze;
  const besondere = besondereGilt ? kinderZahl * p.kind.anteil * r.k : 0;
  // 🛑 Siehe Kopf, Punkt 3: mit Kindern unter der Grenze UND einem allgemeinen Anspruch gehen die
  // Lesarten auseinander.
  const unklar = besondereGilt && allgemein > 0;

  let anteilErwachsen;
  let total;
  if (!besondereGilt) {
    // Ohne besondere Prämienverbilligung: allgemeine Rechnung über alle Richtprämien, aufgeteilt
    // nach Richtprämie (Art. 16 Abs. 2 [2] «nach Massgabe der berechtigten Einzelpersonen»).
    total = allgemein;
    anteilErwachsen = summe > 0 ? (allgemein * r.e) / summe : 0;
  } else {
    // Hier ist `allgemein` 0 (sonst `unklar`): alle drei Lesarten geben die 80 % allein.
    total = besondere;
    anteilErwachsen = 0;
  }
  return {
    total, anteilErwachsen, allgemein, besondere, besondereGilt, unklar, selbstbehalt,
    maximal: summe,
    grund: total >= p.mindestbetrag ? null : (total > 0 ? 'mindestbetrag' : 'ueberGrenze'),
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für NW mit Beleg. `lookupPLZ` braucht
// Nidwalden nicht (eine Region).
export function ipvNidwalden(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_NW.jahr;
  // Die Verordnung gilt «für das Jahr 2026»; die für 2027 war am 28.09.2026 nicht publiziert.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // [3] «Erwachsene Jahrgang 2000 und älter» — Jahrgangstabelle für genau dieses Jahr.
  const geburt = geburtsjahr(b);
  if (!geburt) return orientierung('alter');
  if (!ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung(jahr - geburt >= 19 ? 'ausbildung' : 'alter');
  // [3] «Kinder und Jugendliche Jahrgang 2008 und jünger»: Alter im Anspruchsjahr höchstens 18,
  // eingetippt ein Jahr dazu (vorsichtig an der 18).
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');

  // 🛑 Unlesbare Beträge (Altdaten, «abc») ergäben NaN — und NaN liefe als «über der Grenze» in
  // «kein Anspruch». Keine Zahl ist hier die ehrliche Antwort (Fachprüfung #486, K5).
  if (!Number.isFinite(rohesEinkommenJahr(f)) || !Number.isFinite(vermoegenSumme(f))) return orientierung('eingabeUnlesbar');
  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');
  const jahre = { bemessungsjahr: jahr - IPV_NW.basisjahrAbstand, anspruchsjahr: jahr };
  // Die 3a wird ganz herausgenommen — das trägt nur, wenn sie aus dem erfassten Einkommen stammt.
  if (SAEULE_3A.abgezogen.widerlegt(f, rohesEinkommenJahr(f), jahre)) return orientierung('saeule3aUeberEinkommen');

  const kinderZahl = kinderJahre.length;
  // Reineinkommen ≈ Nettoeinkommen − 3a (Regel `abgezogen`) − bezahlte Unterhaltsbeiträge
  // (StG Art. 35 Abs. 1 Ziff. 3 [4]; Profilfeld monatlich, unlesbar/negativ = 0).
  const unterhaltJahr = 12 * Math.max(0, Number(f.alimentePaid) || 0);
  // StG Art. 26 Abs. 1 Ziff. 6 [4]: erhaltene Unterhaltsbeiträge sind Einkünfte (monatlich erfasst).
  const unterhaltErhaltenJahr = 12 * Math.max(0, Number(f.alimenteReceived) || 0);
  const reineinkommen = Math.max(0, einkommenJahr(f, SAEULE_3A.abgezogen, jahre) - unterhaltJahr + unterhaltErhaltenJahr);
  // Art. 12 Abs. 2 Ziff. 6 [2]: Prozentsatz «des gesamten Reinvermögens» — ohne Freibetrag.
  const sw = reineinkommen + IPV_NW.vermoegenAnteil * vermoegenSumme(f);

  const r = ipvNidwaldenRechnen({ kinderZahl, sw });
  if (r.unklar) return orientierung('mindestanspruch');
  // Art. 20a [2]: höchstens die tatsächlich geschuldete Prämie.
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');

  // Kinderanteil für im Anspruchsjahr geborene Kinder nur ab dem Geburtsmonat (siehe Kopf).
  const monateJeKind = (hh.children || []).map((c) => {
    const m = /^(\d{4})-(\d{2})/.exec(c.birthDate || '');
    return m && Number(m[1]) === jahr ? 13 - Number(m[2]) : 12;
  });
  const kinderTeil = r.total - r.anteilErwachsen;
  const kinderTeilGekuerzt = kinderZahl > 0
    ? monateJeKind.reduce((s, mo) => s + (kinderTeil / kinderZahl) * (mo / 12), 0) : 0;
  const summe = r.anteilErwachsen + kinderTeilGekuerzt;
  // Mindestbetrag § 5 [1] nach der Kürzung erneut: 100 bleibt die Schwelle.
  const annual = r.grund || summe < IPV_NW.mindestbetrag ? 0 : deckelnProPerson(summe, r.anteilErwachsen, praemie);
  const maxAnnual = deckelnProPerson(r.maximal, IPV_NW.richtpraemie.e, praemie);
  // Keine publizierte Einkommensgrenze für Erwachsene; die 100 000 betreffen nur die Kinder.
  const cantonData = { ...ipvData, maxIncome: null };
  const basisjahr = jahr - IPV_NW.basisjahrAbstand;
  const gemeinsam = {
    canton: 'NW', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltNW',
    extra: { basisjahr, jahrKey: 'ipv.jahrNW' },
  };
  if (!(annual > 0)) {
    return ergebnisOhneAnspruch({
      ...gemeinsam,
      noteKey: r.grund === 'mindestbetrag' ? 'ipv.nwUnterMindestbetrag' : 'ipv.nwKeinAnspruch',
    });
  }
  // Art. 22 Abs. 1/6 [2]: Gesuch bis 30. April des Anspruchsjahres, sonst verwirkt.
  const fristVorbei = new Date() > new Date(`${jahr}-04-30T23:59:59`);
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    extra: {
      ...gemeinsam.extra, anmeldefristVorbei: fristVorbei,
      // KK-Karte, Prämien-Beleg und Budget nennen den Nidwaldner Grund (verwirkt) — Weg wie FR:
      // `fristHinweisKey` in data/ipvAbzug.js.
      fristNichtAbgezogenKey: 'ipv.nwFristNichtAbgezogen',
    },
    noteKey: fristVorbei ? 'ipv.nwFristVorbei' : 'ipv.nwFristLaeuft',
    noteParams: { jahr, folgejahr: jahr + 1 },
  });
}
