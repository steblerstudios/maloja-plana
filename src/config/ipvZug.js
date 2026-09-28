// Prämienverbilligung (IPV) Kanton Zug — Richtprämien minus 8 % Selbstbehalt, Jahr 2026 (K31).
// Auf dem gemeinsamen Rahmen (config/kantonsModell.js).
//
// ⟨Neu gebaut 28.09.2026 abends nach der Fachprüfung #475. Die erste Fassung zeigte für niemanden
// einen Betrag, weil sie «tiefere, nicht bezifferte Grenzen für Einzelpersonen» annahm. Das war
// falsch — siehe «DER SATZ ÜBER EINZELPERSONEN» unten. Sie sagte ausserdem «kein Anspruch» aus einem
// Nettolohn-Vergleich; das ist jetzt eine Untergrenze (siehe «KEIN VERDIKT AUS DER NÄHERUNG»).⟩
//
// Belege (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt ZG:
//   [1] IPVG, BGS 842.6, «Aktuelle Version in Kraft seit: 01.01.2025 (Beschlussdatum: 11.04.2024)».
//       § 4 Abs. 2/3: Gesamtanspruch, Verhältnisse am 1. Januar · § 5: Richtprämien legt der
//       Regierungsrat fest · § 6 Abs. 1–3: Prozentsatz, Kinderabzug 8500, vorletzte Steuerperiode,
//       Obergrenzen und Mindestbeträge durch den Regierungsrat · § 6ter: Neuberechnung bei 25 %
//       tieferem Einkommen · § 7: Sonderfälle · § 7bis Abs. 2: Mindestanspruch Kinder · § 10/11:
//       Bescheinigung zu Beginn des Jahres, Gesuch bis 30. April, verspätet bis 30. September aus
//       wichtigen Gründen · § 18: Rückerstattung.
//   [2] V IPVG, BGS 842.61, «in Kraft seit: 01.01.2021», § 1 Abs. 1: massgebendes Einkommen.
//   [3] Ausgleichskasse Zug, Broschüre «Prämienverbilligung 2026 im Kanton Zug» (PDF 12.12.2025):
//       Richtprämien 2026 «vom Regierungsrat festgelegt», 8 %, 70'000 / 89'900, Mindestgarantie,
//       Frist 30. April 2026, unter 50 Franken keine Auszahlung.
//   [4] Regierungsrat Zug, Beschluss vom 26. November 2024 «Prämienverbilligung 2025» (cdn.zg.ch und
//       akzug.ch): Ziff. 1.1–1.6 — dieselbe Struktur, EINE Obergrenze für alle (Ziff. 1.5), der
//       Mindestanspruch Kinder 80 % als Vergleich mit dem Gesamtanspruch (Ziff. 1.6). Der Beschluss
//       für 2026 ist nicht auffindbar (akzug.ch führt ihn nicht; die Amtsblatt-API antwortet der
//       Prüfung mit 401) — die Zahlen 2026 stammen darum aus [3], die Struktur aus [4].
//   [5] Ausgleichskasse Zug, Broschüre «Prämienverbilligung 2025» (PDF 07.01.2025, akzug.ch), S. 7/8:
//       zwei amtliche Beispiele (Einzelperson; Familie mit Mindestgarantie) — mit den Werten 2025,
//       als Prüfstein der Rechnung.
//   [6] Steuergesetz Zug, BGS 632.1, «Version in Kraft von: 01.01.2024 bis: 31.12.2025» (für die
//       Steuerperiode 2024), § 30 lit. g: Versicherungsabzug.
//   [7] KVV Art. 106c Abs. 5bis (SR 832.102, Stand 01.01.2026, Fedlex): Differenz an die versicherte
//       Person, kantonale Deckel vorbehalten.
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die Summe der Richtprämien, soweit sie 8 % des massgebenden Einkommens
// übersteigt; über 70'000 wird der Anspruch je angefangene 100 Franken um 0,5 % gekürzt, über 89'900
// entfällt er. Kinder erhalten bei ungekürztem Anspruch mindestens 80 % ihrer Richtprämie — «Anspruch
// (höherer Betrag)» [5] zwischen Gesamtanspruch und Summe der Mindestbeträge.
//
// DER SATZ ÜBER EINZELPERSONEN
// [3] S. 5: «Die Grenzwerte für das massgebende Einkommen fallen bei Einzelpersonen und gewissen
// Haushalten mit nur einer erwachsenen Person tiefer aus.» Derselbe Satz steht in der Broschüre 2025
// [5] — im Jahr, dessen Beschluss [4] nur EINE Grenze kennt, und neben einem Beispiel für eine
// Einzelperson, das ohne weitere Grenze rechnet. Der Satz beschreibt die Formel: für eine Einzelperson
// endet der Anspruch schon bei 4'984.80 / 8 % = 62'310, unter 70'000; mit einem Kind bei 77'610.
// ⟨Bis zur Fachprüfung stand hier, diese Grenzen seien nicht beziffert, und ZG zeigte keinen Betrag.⟩
//
// 🛑 KEIN VERDIKT AUS DER NÄHERUNG
// Massgebend ist das Reineinkommen (Code 299) — nach Berufskosten, Versicherungsabzug, Unterhalts-
// beiträgen. Das Nettoeinkommen der App liegt darüber, der Betrag hier also eher zu tief (steht in
// `ipv.naeherung`). Ein «kein Anspruch» oder «unter dem Mindestbetrag» sagt die App darum nur, wenn es
// auch nach dem Versicherungsabzug [6] (3'000 für Alleinstehende, + 1'000 je Kind, höchstens die
// erfasste Prämie) gilt und keine bezahlten Unterhaltsbeiträge erfasst sind; sonst `zgNaeherung`.
// Weitere Abzüge (Berufskosten nach § 25 [6]) nimmt die App nicht an — deren Pauschalen sind nicht
// gelesen.
//
// BEWUSST NICHT GEBAUT:
//   · Paare, Konkubinat, mehrere Erwachsene (§ 4 Abs. 2 [1]).
//   · junge Erwachsene (Jg. 2001–2007): mit den Eltern nur bei Kinderabzug (§ 7bis Abs. 1 [1]), ihr
//     Einkommen zählt mit [3] — fehlt der App.
//   · Quellenbesteuerte (§ 7 Abs. 1), EL (Abs. 2), Sozialhilfe (Abs. 3), Mutterschaftsbeiträge (Abs. 4).
//   · freiwillige Einkäufe 2. Säule, Liegenschaftsunterhalt über 20 % (§ 1 lit. b1/c1 [2]).
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, ERWACHSEN, SAEULE_3A, KEIN_PRAEMIENDECKEL,
  kinderAlter, ALTER_UNERFASST, UEBER_18,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

// Werte 2026, wörtlich aus [1]–[3] (Struktur [4]). Alle Beträge sind Jahresbeträge in CHF.
export const IPV_ZG = {
  jahr: 2026,
  // § 6 Abs. 2 [1]: «der vorletzten Steuerperiode» — [3]: «definitive Steuerveranlagung 2024».
  basisjahrAbstand: 2,
  // [3] S. 4: «Für das Jahr 2026 hat der Regierungsrat folgende Richtprämien festgelegt:
  // Erwachsene Fr. 4'984.80 · junge Erwachsene (2001 – 2007) Fr. 3'472.80 · Kinder und
  // Jugendliche (2008 – 2025) Fr. 1'224.00».
  richtpraemie: { e: 4984.80, j: 3472.80, k: 1224.00 },
  // [3] S. 5 und [4] Ziff. 1.2: «soweit sie 8,0 Prozent des massgebenden Einkommens übersteigen».
  selbstbehalt: 0.08,
  // [3] S. 5 und [4] Ziff. 1.5: «Pro 100 Franken, die das massgebende Einkommen die Grenze von
  // 70 000 Franken übersteigt, wird der ordentliche Anspruch … um 0,5 Prozent reduziert … auf die
  // nächsten 100 Franken aufgerundet. Übersteigt das massgebende Einkommen 89 900 Franken, besteht
  // kein Anspruch». Eine Grenze für alle — nicht «für Haushalte» (⟨korrigiert, Fachprüfung W3⟩).
  reduktion: { ab: 70000, obergrenze: 89900, jeHundert: 0.005 },
  // [4] Ziff. 1.6, [3] S. 5: Kinder «mindestens 80 Prozent» bei nicht reduziertem Gesamtanspruch.
  mindestanteilKind: 0.8,
  // § 1 Abs. 1 lit. b [2]: «zuzüglich 10 % des Reinvermögens».
  vermoegenAnteil: 0.10,
  // § 6 Abs. 1 [1] und § 1 Abs. 1 lit. d [2]: «Kinderabzug in der Höhe von 8500 Franken pro Kind».
  kinderabzug: 8500,
  // [3] S. 6 und [4] Ziff. 1.4: «Ein Prämienbeitrag unter 50 Franken pro Jahr wird nicht ausbezahlt.»
  mindestbetrag: 50,
  // § 30 lit. g [6] (Steuerperiode 2024): «bis zum Gesamtbetrag von … 3000 Franken für die übrigen
  // steuerpflichtigen Personen … Diese Abzüge erhöhen sich um 1000 Franken für jedes Kind».
  // Nur für die Untergrenze des Verdikts, nicht für den Betrag.
  versicherungsabzug: { alleinstehend: 3000, jeKind: 1000 },
  // § 11 Abs. 1/2 [1]: Gesuch «bis 30. April»; verspätet «bis 30. September …, wenn … wichtige Gründe».
  frist: { monatTag: '04-30', verspaetetBis: '09-30' },
};

// Reduktionsfaktor nach [4] Ziff. 1.5.
export function zgReduktionsfaktor(me) {
  const r = IPV_ZG.reduktion;
  if (me <= r.ab) return 1;
  if (me > r.obergrenze) return 0;
  const aufgerundet = Math.ceil(me / 100) * 100;
  return Math.max(0, 1 - r.jeHundert * ((aufgerundet - r.ab) / 100));
}

// Reine Rechnung wie die Beispiele [5]. `personen`: 'e' | 'j' | 'k'; `me` = massgebendes Einkommen.
// `richtpraemie` nur für die Beispiele 2025 [5] überschreibbar; die App rechnet mit den Werten 2026.
export function ipvZugRechnen({ personen, me, richtpraemie = IPV_ZG.richtpraemie }) {
  const p = IPV_ZG;
  const summe = personen.reduce((s, c) => s + richtpraemie[c], 0);
  const me0 = Math.max(0, me);
  const selbstbehalt = p.selbstbehalt * me0;
  // Auf Rappen, wie die Beispiele; sonst bleibt am Nullpunkt ein Gleitkomma-Rest.
  const differenz = Math.max(0, Math.round((summe - selbstbehalt) * 100) / 100);
  const faktor = zgReduktionsfaktor(me0);
  const ordentlich = Math.round(differenz * faktor * 100) / 100;
  // [4] Ziff. 1.6 / § 7bis Abs. 2 [1]: nur bei nicht reduziertem Gesamtanspruch. Junge Erwachsene
  // 50 % nur für die Beispiele; die App erfasst sie nicht.
  const mindestgarantie = faktor === 1 && differenz > 0
    ? Math.round(personen.reduce((s, c) => s + (c === 'k' ? p.mindestanteilKind * richtpraemie.k : c === 'j' ? 0.5 * richtpraemie.j : 0), 0) * 100) / 100
    : 0;
  // [5] Beispiel 2: «Anspruch (höherer Betrag)».
  const total = Math.max(ordentlich, mindestgarantie);
  return {
    summe, selbstbehalt, differenz, faktor, ordentlich, mindestgarantie, total,
    nullpunkt: summe / p.selbstbehalt,
    grund: total >= p.mindestbetrag ? null : (total > 0 ? 'mindestbetrag' : 'ueberGrenze'),
  };
}

// Reinvermögen ≈ erfasste Posten − Kreditkarte − Darlehen (die App führt kein Reinvermögen).
export function zgReinvermoegen(f) {
  return Math.max(0, vermoegenSumme(f) - Number(f.creditCardBalance || 0) - Number(f.loans || 0));
}

// Aufruf aus calculateIPV (config/cantonalData.js) für ZG mit Beleg. Keine Prämienregion (BAG: eine
// Region; die Richtprämie gilt kantonsweit, [4] Ziff. 1.1) — `brauchtPLZ: false`.
export function ipvZug(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const p = IPV_ZG;
  const jahr = p.jahr;
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // [3]: junge Erwachsene «2001 – 2007» — erwachsen ist, wer im Anspruchsjahr 26 wird.
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung('alter');
  // [3]: Kinder «2008 – 2025»; § 4 Abs. 3 [1]: Verhältnisse am 1. Januar. Ein im Anspruchsjahr
  // geborenes Kind zählt darum für dieses Jahr nicht (Fachprüfung #475 K2).
  const kinderListe = (hh.children || []).filter((c) => !(/^\d{4}-/.test(c.birthDate || '') && Number(c.birthDate.slice(0, 4)) >= jahr));
  const kinderJahre = kinderAlter(kinderListe, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');
  const kinderZahl = kinderJahre.length;
  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');

  // § 1 Abs. 1 [2]: Reineinkommen + 10 % Reinvermögen + Säule 3a (lit. c, aufgerechnet — das
  // Nettoeinkommen der App trägt sie schon, Regel `voll`) − 8500 je Kind.
  const me = Math.max(0, einkommenJahr(f, SAEULE_3A.voll)
    + p.vermoegenAnteil * zgReinvermoegen(f) - p.kinderabzug * kinderZahl);
  const personen = ['e', ...kinderJahre.map(() => 'k')];
  const r = ipvZugRechnen({ personen, me });

  // Keine Prämie im Modell und kein Deckel — begründet in KEIN_PRAEMIENDECKEL.ZG.
  void KEIN_PRAEMIENDECKEL.ZG;

  const cantonData = { ...ipvData, maxIncome: null };
  const basisjahr = jahr - p.basisjahrAbstand;
  // Das Gesuch ist Pflicht (§ 11 [1]), und ob es gestellt ist, weiss die App nicht: im Budget wird
  // darum nichts abgezogen (`gesuchNoetig`, gelesen von data/ipvAbzug.js) — Muster Neuenburg.
  const fristVorbei = new Date() > new Date(`${jahr}-${p.frist.monatTag}T23:59:59`);
  const gemeinsam = {
    canton: 'ZG', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltZG',
    extra: {
      jahrKey: 'ipv.jahrEineRegion', basisjahr,
      gesuchNoetig: true, gesuchNichtAbgezogenKey: 'ipv.zgGesuchNichtAbgezogen',
    },
  };

  if (r.grund) {
    // Kein oder zu kleiner Anspruch — aber nur als Aussage, wenn auch die Untergrenze des
    // amtlichen Einkommens nicht reicht (siehe Kopf).
    const praemie = praemieJahr(data);
    const abzug = Math.min(p.versicherungsabzug.alleinstehend + p.versicherungsabzug.jeKind * kinderZahl,
      praemie > 0 ? praemie : 0);
    const unten = ipvZugRechnen({ personen, me: Math.max(0, me - abzug) });
    if (Number(f.alimentePaid) > 0 || unten.total >= p.mindestbetrag) return orientierung('zgNaeherung');
    return ergebnisOhneAnspruch({
      ...gemeinsam,
      noteKey: r.grund === 'mindestbetrag' ? 'ipv.zgUnterMindestbetrag' : 'ipv.zgKeinAnspruch',
    });
  }
  const annual = Math.round(r.total);
  const maxAnnual = Math.round(ipvZugRechnen({ personen, me: 0 }).total);
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    noteKey: fristVorbei ? 'ipv.zgFristVorbei' : 'ipv.zgFristLaeuft',
    noteParams: { jahr, folgejahr: jahr + 1 },
  });
}
