// Prämienverbilligung (IPV) Kanton Bern — amtliche Stufentabelle, Jahr 2026 (K31).
// Nur BE rechnet hiermit; alle anderen Kantone bleiben in calculateIPV unverändert.
// Belege (abgerufen 20.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt BE:
//   KKVV (BSG 842.111.1, Stand 01.12.2025) Art. 9 Abs. 1: «Vom Reinvermögen sind für jedes
//     Mitglied der Familie 17'000 Franken abzuziehen.»
//   Art. 9 Abs. 2: massgebendes Einkommen = korrigiertes Reineinkommen + «fünf Prozent des
//     nach Absatz 1 reduzierten Reinvermögens» minus die Abzüge a–f (13'000 Paar · 9'750
//     alleinstehender Elternteil · 2'200 alleinstehende Person · 15'000/12'500/10'000 je Kind).
//   Art. 10 Abs. 2: massgebend ist die Wohnsitzgemeinde am 1. Januar, für das ganze Jahr.
//   Art. 10 Abs. 5: «Die Gemeinden werden den Prämienregionen zugeteilt, die vom Bundesamt
//     für Gesundheit gestützt auf Artikel 61 Absatz 2 KVG festgelegt werden.»
//   Art. 10a Abs. 1/3: Monatsbeträge Erwachsene je Region und Einkommensstufe.
//   Art. 10d Abs. 1: Kinder «80 Prozent der Prämie», wenn das massgebende Familieneinkommen
//     45'000 Franken nicht übersteigt; der Betrag daraus steht im Berechnungsschema.
//   ASV, «Berechnungsschema — Gültig ab 1. Januar 2026»: dieselben Beträge als Tabelle,
//     die Anspruchsgrenzen 35'000 / 45'000 und die vollständigen Gemeindelisten R1/R2.
//   ASV, «Informationen zur Prämienverbilligung 2026»: Bruttovermögen über 750'000 →
//     keine automatische Prüfung; Konkubinat mit gemeinsamem Kind rechnet wie ein Ehepaar.
import { getRegion } from '../data/praemienRegionen.js';
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, regionAusPLZ, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

export const IPV_BE = {
  jahr: 2026,
  // Obere Grenze jeder Einkommensstufe. Berechnungsschema 2026: «bis 9'000 / bis 17'000 /
  // bis 25'000 / bis 35'000 / bis 45'000 Franken»; die letzte Spalte gilt nur für Familien
  // mit zur Familie zählenden Kindern (KKVV Art. 10a Abs. 3).
  stufen: [9000, 17000, 25000, 35000, 45000],
  grenze: { ohneKinder: 35000, mitKindern: 45000 },
  // Monatsbeträge in CHF je Prämienregion, in der Reihenfolge der Stufen oben.
  erwachsene: { 1: [221, 147, 107, 67, 33.5], 2: [196, 132, 96, 60, 30], 3: [183, 123, 89, 56, 28] },
  // Kinder bis 18: ein Betrag für alle Stufen (KKVV Art. 10d — 80 % der Prämie, unabhängig
  // von der Stufe, solange das Familieneinkommen 45'000 nicht übersteigt).
  kinder: { 1: 119.3, 2: 106, 3: 99.35 },
  // ⟨Beleg nachgezogen 23.09.2026⟩ Die 750'000 stehen nicht nur im Informationsblatt, sondern
  // im Erlass selbst: KKVV Art. 13 Abs. 2 lit. l, «Personen mit einem Bruttovermögen von mehr
  // als 750'000 Franken» — Antragspflicht, kein Ausschluss.
  vermoegen: { freibetragProKopf: 17000, anteil: 0.05, bruttoGrenze: 750000 },
  // Unter diesem korrigierten Reineinkommen prüft der Kanton nicht automatisch, sondern nur
  // auf Antrag bis 31.12. ⟨Beleg nachgezogen 23.09.2026: ebenfalls im Erlass, KKVV Art. 13
  // Abs. 2 lit. i — «Erwachsene, die im Jahr ein Einkommen nach Artikel 6 Absatz 4 von
  // weniger als 14'000 Franken erzielen und nach Artikel 5 nicht eine Familie bilden». Der
  // Erlass definiert die Schwelle also selbst über das KORRIGIERTE Reineinkommen; vorher
  // stand hier nur «Informationsblatt 2026, S. 2».⟩
  antragUnterEinkommen: 14000,
  abzug: { ehepaar: 13000, alleinerziehend: 9750, alleinstehend: 2200, kind: [15000, 12500], kindWeitere: 10000 },
};

// Prämienregion einer Gemeinde. Rechtlich massgebend ist die BAG-Zuteilung (KKVV Art. 10
// Abs. 5) — dieselbe Tabelle, die src/data/praemienRegionen.js trägt. Das Berechnungsschema
// des ASV druckt die Listen zusätzlich ab; ein Test hält beide gegeneinander.
// Genau eine Gemeinde geht auseinander: Reutigen (BFS 767) steht beim BAG in Region 2, fehlt
// aber in der R2-Liste des Schemas (dort wäre es «alle übrigen» = Region 3). Umgekehrt führt
// das Schema «Schlosswil», das keine eigene BFS-Nummer mehr hat. Solange die beiden amtlichen
// Quellen sich widersprechen, zeigt die App für diese Gemeinde keinen Betrag — der Unterschied
// wäre je nach Lesart bis zu CHF 156 im Jahr je erwachsene Person und CHF 79.80 je Kind.
const REGION_STRITTIG = [767];

export function beRegion(bfsNr) {
  const n = Number(bfsNr);
  if (REGION_STRITTIG.includes(n)) return null;
  const r = getRegion(n);
  return r === 1 || r === 2 || r === 3 ? r : null;
}

// Massgebendes Einkommen nach KKVV Art. 9 Abs. 2. `reineinkommen` ist das (genäherte)
// korrigierte Reineinkommen im Jahr, `vermoegen` das Reinvermögen, `mitglieder` die Zahl
// der Familienmitglieder, `kinderZahl` die der zur Familie zählenden Kinder.
export function beMassgebendesEinkommen({ reineinkommen, vermoegen, mitglieder, kinderZahl, verheiratet = false }) {
  const p = IPV_BE;
  const korrVermoegen = Math.max(0, Math.max(0, vermoegen) - p.vermoegen.freibetragProKopf * mitglieder);
  let abzug = verheiratet ? p.abzug.ehepaar : kinderZahl > 0 ? p.abzug.alleinerziehend : p.abzug.alleinstehend;
  for (let i = 0; i < kinderZahl; i++) abzug += p.abzug.kind[i] ?? p.abzug.kindWeitere;
  return Math.max(0, Math.max(0, reineinkommen) + p.vermoegen.anteil * korrVermoegen - abzug);
}

// Reine Rechnung. `personen` sind die Kategorien ('e' = Erwachsene über 25, 'k' = Kind bis 18),
// `me` das massgebende Einkommen im Jahr. Liefert Monats- und Jahresbetrag, den Betrag der
// obersten Stufe (Vergleichsgrösse für die Anzeige) und die Anspruchsgrenze.
// Stufenzuordnung nach dem Berechnungsschema («bis 9'000 …»), also einschliesslich der
// genannten Zahl. Die KKVV schreibt «unter 9000» und dann «zwischen 9001 und 17'000» und
// lässt damit genau den Wert 9'000 ungeregelt; die App folgt der Tabelle des Amts, das die
// Verfügung erlässt. Betrifft nur diesen einen Punkt.
export function ipvBernRechnen({ region, personen, me }) {
  const p = IPV_BE;
  const kinderZahl = personen.filter((c) => c === 'k').length;
  const grenze = kinderZahl > 0 ? p.grenze.mitKindern : p.grenze.ohneKinder;
  const me0 = Math.max(0, me);
  // Über der Grenze kein Anspruch — und die Anteile ausdrücklich auf 0, sonst rechnet der
  // Deckel weiter unten mit `undefined` (aufgefallen im Test, 20.09.2026).
  if (me0 > grenze) return { monat: 0, annual: 0, maximal: 0, grenze, stufe: null, erwachseneAnnual: 0, erwachseneMaximal: 0 };
  const stufe = p.stufen.findIndex((s) => me0 <= s);
  const betrag = (i) => personen.reduce((s, c) => s + (c === 'k' ? p.kinder[region] : p.erwachsene[region][i]), 0);
  // Der Anteil der erwachsenen Person getrennt: nur ihre Prämie kennt die App, und nur ihr
  // Anteil darf nach KKVV Art. 10 Abs. 1 auf die eigene Prämie gedeckelt werden.
  const erwachseneAnteil = (i) => personen.filter((c) => c === 'e').length * p.erwachsene[region][i];
  const monat = betrag(stufe);
  return {
    monat, annual: monat * 12, maximal: betrag(0) * 12, grenze, stufe,
    erwachseneAnnual: erwachseneAnteil(stufe) * 12, erwachseneMaximal: erwachseneAnteil(0) * 12,
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für BE mit Beleg. Die App rechnet nur,
// wo ihre Angaben dafür reichen; sonst dieselbe Orientierung wie ein unbelegter Kanton, mit
// Grund in `offen`. Bewusst NICHT gerechnet (die Angabe fehlt in der App):
//   Paare/mehrere Erwachsene (Alter und Einkünfte der zweiten Person fehlen; Konkubinat mit
//   gemeinsamem Kind rechnet amtlich wie ein Ehepaar), verheiratet ohne Partner im Haushalt,
//   eigenes Alter unbekannt oder nicht eindeutig über 25, Kinder ohne Alter oder über 18
//   (junge Erwachsene hängen an Ausbildung und eigenem Einkommen — beides nicht erfasst),
//   Bruttovermögen über 750'000, Gemeinde nicht eindeutig, Anspruchsjahr vorbei.
//   🛑 QUELLENBESTEUERTE rechnet die App wie ordentlich Veranlagte — falsch, aber nicht
//   erkennbar: bei ihnen gelten nach KKVV Art. 6a Abs. 1 «75 Prozent des Bruttoeinkommens»,
//   und der Aufrechnungskatalog von Art. 6 Abs. 4 — also auch der 3a-Deckel — greift gar
//   nicht. Kein erfasstes Feld BELEGT Quellenbesteuerung (`basis.nationality` gibt es, aber
//   es sagt darüber nichts). Die Lücke bestand schon vorher; seit dem 3a-Deckel (23.09.2026)
//   weicht das Ergebnis für diese Gruppe zusätzlich ab. Hier benannt statt still gelassen —
//   ein Feld dafür ist ein Produktentscheid, keine Fachfrage.
//   🛑 ZUZÜGERINNEN UND SONDERFÄLLE rechnet die App mit dem falschen Bemessungsjahr. Die
//   Regel `jahr − 2` ist der REGELFALL (Art. 7 Abs. 1). Art. 7 Abs. 3 stellt für Personen,
//   die im Vorjahr aus einem anderen Kanton zugezogen sind, auf die Veranlagung des LETZTEN
//   Steuerjahres ab (für 2026 also 2025, 3a-Maximum 7'258 statt 7'056); Art. 7a gilt für
//   Quellenbesteuerte, und nach Art. 8 darf das ASV in Sonderfällen — Erwerbsaufnahme nach
//   der Ausbildung, Zuzug aus dem Ausland, Austritt aus der Sozialhilfe — ganz von den
//   Steuerdaten abweichen. Die App fragt den Zuzug nicht ab; der angezeigte Vorbehalt
//   (`ipv.vorbehaltBE`) nennt diesen Personen deshalb ein Basisjahr, das für sie nicht gilt.
//   (Befund Fachprüfung 23.09.2026, zweite Runde.)
//   Näherung: korrigiertes Reineinkommen = Erwerbs-, Neben- und Renteneinkommen × 12 plus die
//   Säule-3a-Einzahlung (KKVV Art. 9 Abs. 2 i. V. m. dem Berechnungsschema, Ziffer 1.1).
//   Amtlich zählt das Reineinkommen aus den Steuerdaten; es fehlen also die Berufsauslagen und
//   die übrigen Aufrechnungen, und das Vermögen ist hier nur die Summe der erfassten Werte,
//   nicht das Reinvermögen inkl. Liegenschaft und abzüglich Schulden. In einer Stufentabelle
//   wirkt sich das stärker aus als in einem linearen Modell: eine Stufe ist im Jahr bis zu
//   CHF 888 wert.
export function ipvBern(data, hh, ipvData, youngAdultsCount, orientierung, lookupPLZ) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_BE.jahr;
  // Die App rechnet nur für das Jahr, dessen Werte belegt sind. Ab dem 01.01. des Folgejahres
  // lieber keine Zahl als eine aus veralteten Stufen (die KKVV wird jährlich angepasst; das
  // Berechnungsschema 2027 war am 20.09.2026 noch nicht publiziert).
  if (jahrVorbei(jahr)) return orientierung('jahr');
  // Konkubinat: «Leben Sie unverheiratet mit Ihrem Partner/Ihrer Partnerin im gleichen Haushalt
  // und haben mindestens ein gemeinsames Kind, dann wird die Berechnung der Prämienverbilligung
  // wie bei einem verheirateten Paar vorgenommen» (Informationsblatt 2026, S. 1). Das Einkommen
  // der zweiten Person kennt die App nicht — ohne sie wäre der Betrag beliebig zu hoch. Darum
  // dasselbe Nein wie bei Verheirateten. (Befund Fachprüfung 20.09.2026: der Riegel prüfte nur
  // `married`, `cohabiting` lief durch und rechnete. Steht seither im gemeinsamen Rahmen.)
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');

  // Weder KKVV noch Berechnungsschema nennen einen Stichtag für das Alter (nur für die
  // Gemeinde, Art. 10 Abs. 2). Darum rechnet die App nur, wenn die Alterszeile das ganze
  // Jahr über dieselbe ist: massgebend ist das Mindestalter im Anspruchsjahr für Erwachsene
  // und das Höchstalter für Kinder — wer im Anspruchsjahr Geburtstag hat, fällt heraus.
  // ⟨korrigiert 20.09.2026 nach der Fachprüfung⟩ Hier stand: «wer genau 25 wird, steht in
  // keiner Zeile». Das gilt nur für den Tabellenkopf; der Erlass schliesst die Lücke
  // (Art. 4 Abs. 2 «bis zum vollendeten 25. Altersjahr», Abs. 3 «Als Erwachsene werden alle
  // übrigen Personen bezeichnet»). Der Ausschluss bleibt — er beruht auf dem fehlenden
  // Stichtag, nicht auf einer Lücke im Erlass. Dasselbe gilt für Kinder (Art. 4 Abs. 1/2):
  // Ein Kind, das im Jahr 19 wird, rechnet die App ganzjährig als Kind — das wirkt zu tief,
  // nie zu hoch, und bleibt darum vorerst so.
  const geburt = geburtsjahr(b);
  // Rechnerisch dasselbe wie ZH, aber aus einem anderen Grund: dort steht es im Erlass
  // (§ 8 EG KVG), hier fehlt ein Stichtag fürs Alter. Darum der Name `mangelsStichtag` —
  // gewählt, nicht belegt. Einzig AG rechnet anders; siehe config/kantonsModell.js.
  if (!geburt || !ERWACHSEN.mangelsStichtag(jahr, geburt)) return orientierung('alter');
  // Bezugsjahr ist hier das Anspruchsjahr, darum kommt beim eingetippten Alter ein Jahr dazu:
  // es ist nicht datiert, die Person kann im Anspruchsjahr Geburtstag haben. So bleibt die
  // Zuordnung «Kind bis 18» auf der sicheren Seite, statt eine junge erwachsene Person als
  // Kind zu rechnen. Kind ohne erfasstes Alter ⇒ keine Zahl (Rahmen, Befund 20.09.2026).
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');

  const { region, orte, ort } = regionAusPLZ({ data, kanton: 'BE', lookupPLZ, regionFn: beRegion });
  if (!region) {
    // Zwei verschiedene Gründe, zwei verschiedene Sätze: bei Reutigen ist die Gemeinde
    // eindeutig, strittig ist ihre Prämienregion (Fachprüfung 20.09.2026).
    const strittig = orte.some((g) => REGION_STRITTIG.includes(Number(g.bfsNr)))
      && (!ort || REGION_STRITTIG.includes(Number(ort.bfsNr)));
    return orientierung(strittig ? 'regionStrittig' : 'region');
  }

  const kinderZahl = kinderJahre.length;
  const vermoegen = vermoegenSumme(f);
  // 750'000 ist in BE KEIN Ausschluss, sondern der Punkt, ab dem der Kanton nicht mehr
  // automatisch prüft (Informationsblatt 2026, S. 2 — dieselbe Liste wie beim kleinen
  // Einkommen). Darum ein eigener Grund statt «über der kantonalen Grenze».
  if (vermoegen > IPV_BE.vermoegen.bruttoGrenze) return orientierung('vermoegenAntrag');
  // KKVV Art. 6 Abs. 4 lit. i rechnet die Säule 3a dem Reineinkommen zu — aber nur BIS ZUM
  // «nach Bundesrecht zulässigen Maximalbetrag für unselbständig Erwerbstätige» (Wortlaut an
  // der Quelle gelesen, 23.09.2026). Das Nettoeinkommen der App trägt sie bereits voll, die
  // Regel wirkt hier also als Abzug des Überschusses.
  // ⟨seit 23.09.2026 gebaut; vorher `() => 0`, weil der Frankenwert nicht belegt war⟩
  // Betroffen sind nur Einzahlungen ÜBER dem Maximum — vor allem Selbständige ohne 2. Säule,
  // die bundesrechtlich bis 35'280 abziehen dürfen. Ihr Abzug hier ist am grössten, und weil
  // BE in Stufen rechnet, entscheidet er über eine ganze Stufe (bis CHF 888 im Jahr).
  //
  // 🛑 DAS JAHR DES DECKELS IST DAS BEMESSUNGSJAHR, nicht das Anspruchsjahr. Art. 7 Abs. 1:
  // massgebend ist «die definitive Veranlagung des vorletzten Steuerjahres», und Art. 6
  // Abs. 4 korrigiert genau jenes Reineinkommen. Aufgerechnet werden kann darum höchstens,
  // was dort abgezogen werden durfte — für 2026 das Maximum von 2024 (7'056), nicht das von
  // 2026 (7'258). Dasselbe Jahr, das `vorbehaltBE` der Person ohnehin nennt.
  // (Befund Fachprüfung 23.09.2026: zuerst stand hier das Maximum des Anspruchsjahres. An
  // einer Stufengrenze gemessen CHF 480 im Jahr Unterschied, auf der zu tiefen Seite.)
  const jahre = { bemessungsjahr: jahr - 2, anspruchsjahr: jahr };
  // Kein belegtes Maximum für dieses Jahr ⇒ keine Zahl. Sonst rechnete die App still ohne
  // Deckel weiter, und das Fehlen sähe aus wie ein Ergebnis.
  if (SAEULE_3A.bisBundesMaximum.maximumFuer(jahre.bemessungsjahr) === null) return orientierung('jahr');
  // 🛑 Ein negatives Einkommen ist ein Vertipper, kein Einkommen — und es endete sonst über
  // `Math.max(0, …)` in `beMassgebendesEinkommen` bei der HÖCHSTEN Stufe. Derselbe Schaden
  // wie beim 3a-Riegel darunter, nur über das Minuszeichen. (Befund Fachprüfung 23.09.2026,
  // dritte Runde; die Lücke bestand schon vorher, wird hier aber mitgeschlossen, weil sie
  // sonst genau den Riegel daneben aushebelt.)
  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');
  // 🛑 Die Herleitung «das Nettoeinkommen trägt die 3a bereits» ist widerlegt, sobald die
  // Einzahlung grösser ist als das ganze Jahreseinkommen. Dann stammt sie nicht daraus — oder
  // es steht der Kontostand im Feld für die Jahreseinzahlung. Ohne diesen Riegel zog der
  // Abzug das Einkommen ins Negative und die App zeigte die HÖCHSTE Stufe: ein Vertipper im
  // Formular hätte still den Höchstbetrag ergeben (Befund Fachprüfung 23.09.2026).
  if (SAEULE_3A.bisBundesMaximum.widerlegt(f, rohesEinkommenJahr(f), jahre)) return orientierung('saeule3aUeberEinkommen');
  // Nebenwirkung, die dazugehört: der Abzug senkt auch `reineinkommen` und kann damit die
  // 14'000-Schwelle für `antragNoetig` weiter unten unterschreiten. Das ist richtig so — die
  // KKVV definiert jene Schwelle ausdrücklich über «ein Einkommen nach Artikel 6 Absatz 4»
  // (Art. 13 Abs. 2 lit. i), also über das KORRIGIERTE Reineinkommen, nicht über das rohe.
  // (Befund Fachprüfung 20.09.2026: hier stand Art. 9 Abs. 2 — die falsche Norm, und der
  // Deckel ging dabei ganz verloren. Zusätzlich wurde die 3a doppelt gezählt; in einer
  // Stufentabelle kostet ein Franken Differenz eine ganze Stufe, bis CHF 888 im Jahr.)
  const reineinkommen = einkommenJahr(f, SAEULE_3A.bisBundesMaximum, jahre);
  const me = beMassgebendesEinkommen({ reineinkommen, vermoegen, mitglieder: 1 + kinderZahl, kinderZahl });

  const r = ipvBernRechnen({ region, personen: ['e', ...kinderJahre.map(() => 'k')], me });
  const cantonData = { ...ipvData, maxIncome: r.grenze };
  // KKVV Art. 10 Abs. 1: «Die Prämie wird höchstens bis zu ihrem effektiven Umfang verbilligt.»
  // Der Deckel gilt PRO PERSON. Die App kennt nur die Prämie der erwachsenen Person, also wird
  // auch nur deren Anteil gedeckelt — der Kinderanteil bleibt ungedeckelt, statt wie bisher den
  // Deckel mit Kindern ganz entfallen zu lassen (Befund Fachprüfung 20.09.2026).
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');
  const annual = deckelnProPerson(r.annual, r.erwachseneAnnual, praemie);
  const maxAnnual = deckelnProPerson(r.maximal, r.erwachseneMaximal, praemie);
  // Wirkt der 3a-Deckel bei DIESER Person, hängt ihr Betrag an einer Lesart, die das ASV
  // nicht bestätigt hat — das gehört in die Anzeige, nicht nur in den Quelltext.
  // Nur wo der Abzug tatsächlich > 0 ist; bei allen anderen ändert die Lesart nichts.
  const deckelWirkt = SAEULE_3A.bisBundesMaximum.nichtAufgerechnet(f, jahre) > 0;
  const gemeinsam = {
    canton: 'BE', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltBE',
    extra: { region, ...(deckelWirkt ? { zusatzVorbehaltKey: 'ipv.vorbehaltBE3aDeckel' } : {}) },
  };
  if (annual <= 0) {
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: r.grenze } });
  }
  // «Automatisch via Steuerdaten» stimmt nicht für alle: Wer mindestens 25 ist, keine zur Familie
  // zählenden Kinder hat und ein korrigiertes Reineinkommen unter 14'000 ausweist, muss die
  // Überprüfung bis 31.12. selbst beantragen (Informationsblatt 2026, S. 2). Genau die ärmste
  // Gruppe — wer sich hier auf «automatisch» verlässt, verliert den ganzen Anspruch.
  const antragNoetig = !kinderZahl && reineinkommen < IPV_BE.antragUnterEinkommen;
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    noteKey: antragNoetig ? 'ipv.beAntragNoetig' : ipvData.noteKey,
    noteParams: antragNoetig ? {} : (ipvData.noteParams || {}),
  });
}
