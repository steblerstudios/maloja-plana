// Prämienverbilligung · Kanton SG. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Abgerufen 09.11.2026:
//   [M]  SVA St.Gallen, Merkblatt IPV 2026, Form. 4100 01.26 (svasg.ch/online-schalter/pdf/form_4100.pdf)
//   [S]  SVA St.Gallen, Seite «Individuelle Prämienverbilligungen (IPV)» samt «Häufige Fragen»
//        (svasg.ch/produkte/ipv/, Antworten unter /fragen_und_antworten/ipv/…)
//   [EG] EG-KVG, sGS 331.11, Fassung in Vollzug seit 01.01.2026 (API-Version 3907)
//   [VO] Verordnung zum EG-KVG, sGS 331.111, Fassung in Vollzug seit 01.08.2026 (API-Version 3828)
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'St. Gallen',
  slug: 'st-gallen',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // [M] Ziff. 2: «Die SVA St.Gallen schreibt alle Personen an, die voraussichtlich Anrecht auf
    // eine IPV haben.» [VO] Art. 22 Abs. 1: «Zugang zu einem vorausgefüllten elektronischen
    // Anmeldeformular». [S]: «Für das nächste Kalenderjahr muss wiederum ein neuer Antrag gestellt werden.»
    'Im Kanton St. Gallen gibt es die Prämienverbilligung nur auf Anmeldung, und zwar jedes Jahr neu. Wer nach den Steuerdaten voraussichtlich Anspruch hat, bekommt von der SVA St.Gallen ein Schreiben mit den Zugangsdaten zu einem vorausgefüllten Online-Formular.',
    // [VO] Art. 22 Abs. 1bis: «Der Zugang zu einem vorausgefüllten Anmeldeformular begründet keinen
    // Anspruch».
    'Das Schreiben ist noch kein Entscheid. Ob ein Anspruch besteht, prüft die SVA erst nach der Anmeldung.',
    // [S] Häufige Fragen: «Haben Sie bis zum 31. Dezember kein IPV-Login-Schreiben erhalten, können
    // Sie sich über das Online Formular IPV Anmeldung … anmelden.» · «Bei Ungewissheit raten wir in
    // jedem Fall zu einer IPV-Anmeldung.»
    'Haben Sie kein Schreiben erhalten, können Sie sich trotzdem online anmelden. Im Zweifel rät die SVA selbst zur Anmeldung.',
    // [S]: «Wer Ergänzungsleistungen oder Leistungen vom Sozialamt bezieht, muss sich nicht anmelden.
    // Eine Abrechnung von Leistungen erfolgt direkt mit dem Krankenversicherer.» [M] Ziff. 1.6;
    // [EG] Art. 11ter Abs. 4: die Meldung der Gemeinde «ersetzt die Anmeldung».
    'Wer Ergänzungsleistungen oder Sozialhilfe bezieht, muss sich nicht anmelden. Die Verbilligung wird dann direkt mit der Krankenkasse abgerechnet.',
  ],
  // [VO] Art. 22 Abs. 2: kein vorausgefülltes Formular für Wohnsitz EU/Island/Norwegen/UK,
  // erwerbstätige F, N, S, L «mit einer bewilligten ununterbrochenen Aufenthaltsdauer von wenigstens
  // drei Monaten», «nach Ermessen veranlagt» und «Personen mit Einkommen und Vermögen Null»;
  // Abs. 3: diese können «über die Webseite … ein Anmeldeformular in elektronischer Form ausfüllen».
  selbst: {
    einleitung: 'Kein vorausgefülltes Formular bekommen unter anderem diese Gruppen. Sie melden sich selbst über das Formular auf der Seite der SVA an:',
    punkte: [
      'Sie wohnen in einem Staat der EU, in Island, Norwegen oder im Vereinigten Königreich und sind in der Schweiz krankenversicherungspflichtig, zum Beispiel als Grenzgängerin oder Grenzgänger.',
      'Sie sind erwerbstätig und haben einen Ausweis F, N oder S.',
      'Sie haben einen Ausweis L mit einer bewilligten Aufenthaltsdauer von mindestens drei Monaten.',
      'Ihre Steuern wurden nach Ermessen veranlagt, oder Ihre Steuerdaten weisen weder Einkommen noch Vermögen aus.',
      // [M] Ziff. 1.3: «Der Anspruch auf Prämienverbilligung beginnt ab dem Monat der Anmeldung.»
      'Sie sind im Lauf des Jahres aus dem Ausland zugezogen. Der Anspruch beginnt dann erst mit dem Monat der Anmeldung.',
      // [S] Häufige Fragen: junge Erwachsene «für die durch einen Elternteil Familienzulagen bezogen
      // werden, sind auf dem Antragsformular der Eltern aufzuführen … für die keine Familienzulagen
      // ausgerichtet werden, können sich selber … anmelden.» [VO] Art. 22a Abs. 1.
      'Sie sind zwischen 19 und 25 Jahre alt, in Ausbildung, und für Sie werden keine Familienzulagen bezogen. Werden Familienzulagen bezogen, gehören Sie auf die Anmeldung der Eltern.',
      // [M] Ziff. 1.2: Geburt wird berücksichtigt, «wenn uns diese bis 31. März 2027 mitgeteilt wird.
      // Wer sich bereits angemeldet hat, kann einfach einen Nachtrag senden. Sonst ist eine ordentliche
      // IPV-Anmeldung notwendig.» [VO] Art. 13 Abs. 2.
      'Ihr Kind ist im Lauf des Jahres geboren. Die Geburt zählt nur, wenn Sie sie bis zu einer Frist im folgenden Jahr melden, mit einem Nachtrag oder mit einer eigenen Anmeldung.',
    ],
    // [S]: «Für Zuziehende aus einem anderen Kanton besteht der Anspruch erst im Folgejahr.»
    schluss: 'Wer aus einem anderen Kanton zuzieht, hat im Kanton St. Gallen erst im folgenden Jahr Anspruch.',
  },
  // [EG] Art. 11bis Abs. 1 lit. a (Anmeldung bis zu einem Stichtag «für das ganze Kalenderjahr»),
  // Abs. 3: «entsteht der Anspruch … ab dem Monat der Anmeldung»; [M] Ziff. 2: «Ausnahmen bestehen für
  // gesuchstellende Personen …, die unverschuldet von der Anmeldung abgehalten worden sind.»
  fristSatz: 'Für den Anspruch aufs ganze Jahr gilt eine Frist. Sie steht im Gesetz und im Merkblatt der SVA. Wer später einreicht, erhält eine allfällige Verbilligung erst ab dem Monat der Anmeldung, ausser er oder sie war ohne eigenes Verschulden daran gehindert.',
  stelle: 'Sozialversicherungsanstalt St.Gallen (SVA St.Gallen)',
  // [VO] Art. 11 Abs. 1 (ermittelt «zusammen mit den Steuerbehörden»), Art. 25, Art. 28;
  // [M] Ziff. 5: «setzt den Betrag … mit einer Verfügung fest. Danach überweisen wir den Betrag den
  // Krankenversicherern. Diese schreiben die Prämienverbilligung den folgenden Prämienrechnungen gut.»
  stelleSatz: 'Die SVA St.Gallen ermittelt zusammen mit den Steuerbehörden, wer voraussichtlich Anspruch hat, und entscheidet über die Anmeldungen. Den Betrag überweist sie an die Krankenkasse, die ihn bei den folgenden Prämienrechnungen abzieht.',
  amtsseite: 'Seite des Kantons St. Gallen zur Prämienverbilligung',
  besonders: [
    // [VO] Art. 12 Abs. 1 («Reineinkommen der Steuerperiode des vorletzten Jahres») und Abs. 2
    // Ziff. 1–3 (Anteil des steuerbaren Vermögens, Säule 3a, «Leistungen und Einkaufsbeiträge an
    // Einrichtungen der beruflichen Vorsorge»); [M] Ziff. 3.1.
    'Grundlage ist das Reineinkommen laut Steuerdaten des vorletzten Jahres. Dazu zählt die SVA unter anderem einen Teil des steuerbaren Vermögens, die Einzahlungen in die Säule 3a und die Einkäufe in die Pensionskasse.',
    // [VO] Art. 12 Abs. 3; [M] Ziff. 3.2 «Keinen Anspruch»: Vermögensobergrenze, erhöht je Kind und
    // je junge erwachsene Person.
    'Über einer festen Grenze des steuerbaren Vermögens besteht kein Anspruch. Für Haushalte mit Kindern oder jungen Erwachsenen liegt die Grenze höher.',
    // [VO] Art. 14 Abs. 1: Kinderabzug nur, wo «eine Familienzulage … bezogen wird».
    'Für jedes Kind, für das Familienzulagen bezogen werden, gibt es einen Abzug vom massgebenden Einkommen.',
    // [S] Häufige Fragen: «Nein. Es wird eine Referenzprämie angerechnet, die jährlich durch die
    // Kantonsregierung festgelegt wird.» [M] Ziff. 4.1: regionale Referenzprämien, Wohnsitz am
    // Jahresanfang massgebend.
    'Verbilligt wird nicht Ihre tatsächliche Prämie, sondern eine Referenzprämie, die die Regierung jedes Jahr festlegt. Sie hängt von der Prämienregion Ihres Wohnorts ab.',
    // [VO] Art. 12bis Abs. 1 und 3 (Brutto-Einkommen, «zu 75 Prozent angerechnet»); [M] Ziff. 3.3.
    'Bei Personen mit Quellensteuer zählt das Bruttoeinkommen, und zwar nur zu einem Teil.',
    // [S] Häufige Fragen «Änderung meiner familiären Verhältnisse»: «Bei Heirat oder Scheidung werden
    // die Änderungen erst ab dem Folgejahr wirksam. Änderungen können uns mitgeteilt werden über das
    // Online Formular IPV Ergänzungen.»
    'Heirat oder Scheidung wirken sich erst im folgenden Jahr aus. Änderungen teilen Sie der SVA über das Online-Formular für Ergänzungen mit.',
    // [EG] Art. 11 Abs. 3 («wird auf diese abgestellt»); [VO] Art. 12quater: Einkommensgrundlagen
    // «dauerhaft verändert», Abweichung «wenigstens einen Viertel».
    'Haben sich Ihre Einkommensverhältnisse dauerhaft und deutlich verändert, stellt die SVA auf die aktuelle wirtschaftliche Lage ab. Die Verordnung nennt dafür eine Mindestabweichung.',
    // [S] Häufige Fragen «Vorvorjahr»: «Wurden dennoch provisorische Steuerdaten verwendet, so wird der
    // IPV-Anspruch zu einem späteren Zeitpunkt automatisch angepasst … Dies kann zu Rückforderungen oder
    // zu Nachzahlungen führen.» [VO] Art. 20 (Mindestbetrag); [M] Ziff. 5.
    'Wurde mit provisorischen Steuerdaten gerechnet, passt die SVA den Anspruch später an die definitive Veranlagung an. Das kann zu einer Nachzahlung oder zu einer Rückforderung führen. Sehr kleine Beträge werden nicht ausbezahlt.',
  ],
  quellen: [
    // HTTP 200, PDF; Gegenprobe …/form_4100_xq.pdf → 404.
    { text: 'SVA St.Gallen: Merkblatt Individuelle Prämienverbilligung (PDF)', url: 'https://www.svasg.ch/online-schalter/pdf/form_4100.pdf' },
    // HTTP 200; Gegenprobe …/produkte/ipv-xq-erfunden/ → 404.
    { text: 'SVA St.Gallen: Individuelle Prämienverbilligungen (IPV)', url: 'https://www.svasg.ch/produkte/ipv/' },
    // Gesetzessammlung SG ist eine Web-App (jede Adresse 200); Bestand über die API belegt
    // (…/api/de/texts_of_law/331.11 und 331.111 → 200), 331.999 → 404.
    { text: 'Einführungsgesetz zur Bundesgesetzgebung über die Krankenversicherung (EG-KVG, sGS 331.11)', url: 'https://www.gesetzessammlung.sg.ch/app/de/texts_of_law/331.11' },
    { text: 'Verordnung zum Einführungsgesetz zur Bundesgesetzgebung über die Krankenversicherung (sGS 331.111)', url: 'https://www.gesetzessammlung.sg.ch/app/de/texts_of_law/331.111' },
    KVG65,
  ],
};
