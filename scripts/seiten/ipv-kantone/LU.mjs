// Prämienverbilligung · Kanton LU. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Alle Quellen am 09.11.2026 neu
// abgerufen: Prämienverbilligungsgesetz PVG (SRL 866, «in Kraft seit: 01.07.2021», über
// srl.lu.ch/api/…/866/show_as_json → 200; …/866zz/… → 404) · Prämienverbilligungsverordnung PVV
// (SRL 866a, «in Kraft seit: 01.01.2026», API → 200) · WAS-Seite «Prämienverbilligung»
// (was-luzern.ch/praemienverbilligung → 200; …xyz → 404) · WAS-Merkblatt Nr. 02/26 «WAS –
// Prämienverbilligung 2027», August 2026 (PDF → 200; …%202099.pdf → 404).
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Luzern',
  slug: 'luzern',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // WAS-Seite, «Anmeldung»: «Sie melden sich jedes Jahr neu bei WAS Ausgleichskasse Luzern an.»
    // PVG § 12 Abs. 1: «haben beim Sozialversicherungszentrum das Anmeldeformular einzureichen».
    // PVG § 12 Abs. 2: «spätestens Ende Oktober des Vorjahres».
    'Im Kanton Luzern gibt es die Prämienverbilligung nur, wenn Sie sich anmelden, und zwar jedes Jahr neu. Die Anmeldung gilt für das folgende Jahr und muss darum schon im Vorjahr eingehen.',
    // WAS-Seite: «Am schnellsten und einfachsten geht das online.» Merkblatt: «Sie kann aber auch
    // bei WAS Ausgleichskasse Luzern oder bei der AHV-Zweigstelle der Wohnsitzgemeinde eingereicht
    // werden.» WAS-Seite: «Nach der Anmeldung bekommen Sie einen Entscheid.»
    'Die Anmeldung geht online, bei der WAS Ausgleichskasse Luzern oder bei der AHV-Zweigstelle Ihrer Wohngemeinde. Danach bekommen Sie einen Entscheid.',
    // PVG § 8 Abs. 2: für EL-Beziehende «Die §§ 12, 13 Absatz 1, 14, 15 und 17 Absatz 1 finden keine
    // Anwendung» (§ 12 = Anmeldung); «Für das Verfahren gelten sinngemäss die Bestimmungen über die
    // Ergänzungsleistungen.» § 8 Abs. 3: bei wirtschaftlicher Sozialhilfe ebenfalls ohne § 12.
    // PVV § 6 Abs. 2: «Die zuständige Sozialbehörde meldet dem Sozialversicherungszentrum Beginn und
    // Ende der wirtschaftlichen Sozialhilfe.»
    'Wer Ergänzungsleistungen oder wirtschaftliche Sozialhilfe bezieht, muss sich nicht anmelden. Bei der Sozialhilfe meldet die Sozialbehörde Beginn und Ende.',
  ],
  // Merkblatt 02/26: «Ehepartner/in, Kinder und junge Erwachsene … in Ausbildung werden automatisch
  // mitberechnet, weshalb es pro Familie im gleichen Haushalt nur eine Anmeldung braucht.» —
  // Ausnahmen, alle aus demselben Merkblatt: «Trennt sich ein Ehepaar vor dem 1. November …,
  // müssen sich beide Personen selber anmelden.» · «Junge Erwachsene, die am 1. November … nicht
  // in Ausbildung sind, melden sich selber an.» · «Wohnen sie in einem eigenen Haushalt, müssen
  // sie sich selber anmelden.» · «Bitte melden Sie uns, falls Sie nicht erwerbstätige
  // Familienangehörige haben, die in einem EU/EFTA-Staat wohnen … Diese Personen werden nicht
  // automatisch mitberechnet.» (dazu PVV § 6a Abs. 1: «mit einem Zusatzblatt zur ordentlichen
  // Anmeldung»).
  selbst: {
    einleitung: 'In der Regel reicht eine Anmeldung für den ganzen Haushalt: Ehepartnerin oder Ehepartner, Kinder und junge Erwachsene in Ausbildung werden mitgerechnet. Eine eigene Anmeldung braucht es aber in diesen Fällen:',
    punkte: [
      'Sie haben sich vor dem Stichtag im Herbst von Ihrer Ehepartnerin oder Ihrem Ehepartner getrennt. Dann melden sich beide selbst an.',
      'Sie sind junge erwachsene Person und am Stichtag nicht in Ausbildung.',
      'Sie sind junge erwachsene Person in Ausbildung, wohnen aber nicht bei Ihren Eltern, sondern in einem eigenen Haushalt.',
      'Zu Ihrer Familie gehören Angehörige, die in einem EU- oder EFTA-Staat wohnen, nicht erwerbstätig und in der Schweiz versichert sind. Sie werden nicht mitgerechnet und müssen gemeldet werden.',
    ],
    schluss: 'Den Stichtag nennt das Merkblatt der WAS.',
  },
  // PVG § 12 Abs. 2 (Frist im Gesetz) und Abs. 3: «werden nur diejenigen Prämien verbilligt, die nach
  // der Gesuchstellung fällig werden.» WAS-Seite: «Melden Sie sich erst später an, erhalten Sie die
  // Prämienverbilligung nur für die darauf folgenden Monate. Eine rückwirkende Anmeldung ist nicht
  // möglich.»
  fristSatz: 'Für die Anmeldung gilt eine Frist im Vorjahr. Sie steht im Gesetz, im Merkblatt und auf der Seite der WAS. Wer sich später anmeldet, erhält die Verbilligung nur für die Monate danach, rückwirkend geht es nicht.',
  stelle: 'WAS Ausgleichskasse Luzern',
  // PVG § 3 Abs. 3 lit. a–c (Sozialversicherungszentrum nimmt Gesuche entgegen, setzt Ansprüche
  // fest, zahlt «direkt an die Krankenversicherer»); WAS-Seite: «Die Prämienverbilligung wird immer
  // direkt an die Krankenkasse ausbezahlt.»; PVG § 4 Abs. 2 lit. a: AHV-Zweigstellen informieren
  // und erteilen «allgemeine Auskünfte im Einzelfall».
  stelleSatz: 'Die WAS Ausgleichskasse Luzern führt die Prämienverbilligung für den Kanton durch, entscheidet über die Anmeldungen und zahlt den Beitrag direkt an die Krankenkasse. Allgemeine Auskünfte gibt auch die AHV-Zweigstelle Ihrer Gemeinde.',
  amtsseite: 'Seite des Kantons Luzern zur Prämienverbilligung',
  besonders: [
    // PVG § 5 Abs. 3: «Massgebend sind die persönlichen und familiären Verhältnisse am 1. November
    // des Jahres vor dem Jahr …» WAS-Seite, FAQ: «Sie heiraten am 15. Dezember 2026. Dann gelten Sie
    // für die Prämienverbilligung 2027 als alleinstehend.»
    'Massgebend sind Ihre Verhältnisse an einem Stichtag im Herbst des Vorjahres. Wer erst danach heiratet, gilt für das folgende Jahr noch als alleinstehend.',
    // PVG § 8a Abs. 1 (Anpassung «auf begründetes Gesuch oder allenfalls von Amtes wegen») und Abs. 2
    // («spätestens am letzten Tag des Jahres …»; «Wird die Frist nicht eingehalten, wird die Änderung
    // erst ab dem Jahr berücksichtigt, in dem das Gesuch eingereicht wurde.»). WAS-Seite,
    // «Neuberechnung»: Einkommen «verschlechtert» über einer Schwelle «oder Sie haben im
    // Anspruchsjahr ein Kind bekommen»; «bis spätestens am 31. Dezember des Anspruchsjahres».
    'Ist Ihr Einkommen seither deutlich gesunken oder haben Sie im laufenden Jahr ein Kind bekommen, können Sie eine Neuberechnung beantragen. Das Gesuch muss bis Ende des betreffenden Jahres eingehen, sonst zählt die Änderung erst ab dem Jahr, in dem Sie es einreichen.',
    // PVG § 7 Abs. 5: «Personen, die keine Steuererklärung einreichen, obwohl sie dazu verpflichtet
    // wären, haben keinen Anspruch auf Prämienverbilligung.» Merkblatt: «Ist die letzte
    // Steuerveranlagung eine Ermessensveranlagung, besteht kein Anspruch auf Prämienverbilligung.»
    // Merkblatt: Steuerveranlagung «darf nicht älter sein als vier Jahre» (PVG § 7 Abs. 4:
    // sonst «sistiert die Ausgleichskasse in der Regel das Verfahren»).
    'Wer keine Steuererklärung einreicht, obwohl er oder sie dazu verpflichtet ist, hat keinen Anspruch. Dasselbe gilt laut Merkblatt, wenn die letzte Steuerveranlagung eine Ermessensveranlagung ist. Die Veranlagung, auf die abgestellt wird, darf höchstens vier Jahre zurückliegen.',
    // PVG § 7 Abs. 2 lit. e: «10 Prozent des Reinvermögens; als Reinvermögen gilt das Vermögen vor
    // Abzug der steuerfreien Beträge gemäss § 52 des Steuergesetzes»; Abs. 2ter: Vermögensgrenze,
    // höher, wenn Kinder oder junge Erwachsene in Ausbildung im Haushalt wohnen.
    'Ein Teil des Vermögens wird zum Einkommen gezählt, und zwar vor Abzug der steuerfreien Beträge. Über einer festen Vermögensgrenze besteht gar kein Anspruch. Wohnen Kinder oder junge Erwachsene in Ausbildung im Haushalt, liegt die Grenze höher.',
    // PVG § 8 Abs. 1: Quellensteuer → Anteil des «der Quellensteuer zugrundeliegenden Einkommens».
    // PVG § 5 Abs. 3 Satz 2 (Verhältnisse «im Zeitpunkt des Zuzuges») und § 7 Abs. 4 letzter Satz
    // («ist die erste rechtsgültige Steuerveranlagung oder die Festsetzung des
    // Quellensteuereinkommens des Zuzugsjahres abzuwarten»); WAS-Seite: «Wer aus dem Ausland zuzieht,
    // kann einen unterjährigen Anspruch haben.»
    'Für Personen mit Quellensteuer gilt eine eigene Berechnungsgrundlage. Wer aus dem Ausland zuzieht, kann schon im Lauf des Jahres Anspruch haben; entschieden wird dann erst, wenn die erste Steuerveranlagung oder das Quellensteuereinkommen feststeht.',
    // PVG § 13 Abs. 1: «eingetretene Änderungen umgehend mitzuteilen». PVG § 21 Abs. 1: zu Unrecht
    // ausgerichtete Leistungen fordert das Sozialversicherungszentrum «von dem Krankenversicherer
    // zurück…, dem sie ausbezahlt wurden». Merkblatt: «Ist die Prämienverbilligung höher als die
    // geschuldete Krankenkassenprämie, wird die Differenz nicht ausbezahlt.» PVV § 7: Kleinstbeträge
    // werden nicht ausbezahlt.
    'Änderungen melden Sie der WAS umgehend. Zu Unrecht ausbezahlte Beträge fordert sie bei der Krankenkasse zurück. Ist die Verbilligung höher als die Prämie, wird der Rest nicht ausbezahlt, und sehr kleine Beträge werden gar nicht ausbezahlt.',
  ],
  quellen: [
    { text: 'WAS Ausgleichskasse Luzern: Merkblatt Prämienverbilligung (PDF)', url: 'https://www.was-luzern.ch/sites/default/files/documents/AK_Merkblatt_PV%202027.pdf' },
    { text: 'WAS Ausgleichskasse Luzern: Prämienverbilligung', url: 'https://www.was-luzern.ch/praemienverbilligung' },
    // SRL ist eine Web-App (jede /app/-Adresse 200, auch 866zz); Bestand über die API belegt,
    // …/api/de/texts_of_law/866zz/show_as_json → 404.
    { text: 'Gesetz über die Verbilligung von Prämien der Krankenversicherung (Prämienverbilligungsgesetz, SRL 866)', url: 'https://srl.lu.ch/app/de/texts_of_law/866' },
    { text: 'Verordnung zum Prämienverbilligungsgesetz (Prämienverbilligungsverordnung, SRL 866a)', url: 'https://srl.lu.ch/app/de/texts_of_law/866a' },
    KVG65,
  ],
};
