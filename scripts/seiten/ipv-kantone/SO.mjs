// Prämienverbilligung · Kanton SO. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Alle Quellen neu abgerufen am
// 09.11.2026, jede mit Gegenprobe (erfundene Adresse → 404):
//   Merkblatt IPV 2026, Ausgleichskasse des Kantons Solothurn (AKSO), PDF 200
//   (Merkblatt-IPV-2099.pdf → 404).
//   Merkblatt IPV 2026 «Quellenbesteuerte Personen», AKSO, «Zuchwil, im April 2026», PDF 200
//   (2099_QS-Merkblatt.pdf → 404).
//   Sozialverordnung (SV) BGS 831.2, Versions-PDF 5624 (200) und show_as_json (200);
//   Sozialgesetz (SG) BGS 831.1 show_as_json (200); 831.29 → 404.
//   Seite der AKSO akso.ch/dienstleistungen/praemienverbilligung-ipv (200; …-ipvxyz → 404).
//   Reglement über die Prämienverbilligung in Härtefällen, BGS 832.214, und Reglement über die
//   Prämienverbilligung für Personen, die an der Quelle besteuert werden, BGS 832.215, je
//   show_as_json gelesen; «abrogated: false»; API …/texts_of_law/832.214 und 832.215 → 200,
//   832.299 → 404 (Gegenprobe 09.11.2026). Beide stützen sich noch auf die alte VO KVG / VO PV.
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Solothurn',
  slug: 'solothurn',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // SV § 75 Abs. 1: «… stellt die Ausgleichskasse, nach Auswertung der Steuererklärung durch die
    // Steuerverwaltung, ohne Gesuch ein Antragsformular zu.»; Merkblatt: «Die Ausgleichskasse
    // stellt allen Personen ein Antragsformular zu, welche nach Auswertung der Steuerdaten
    // voraussichtlich Anspruch auf IPV haben.»
    'Im Kanton Solothurn gibt es die Prämienverbilligung nur auf Antrag. Wer nach den Steuerdaten voraussichtlich Anspruch hat, bekommt von der Ausgleichskasse ein Antragsformular zugeschickt.',
    // SV § 75 Abs. 3: «Das Antragsformular ist innert 30 Tagen seit Zustellung … einzureichen. …
    // Bei Fristversäumnis verwirkt der Anspruch»; Merkblatt: «… unterschriebenen Antrag mit
    // allfälligen Unterlagen innerhalb von 30 Tagen ab Zustellung. Bei zu spät eingereichten
    // Anträgen verwirkt der Anspruch auf IPV.» Zahl bewusst weggelassen.
    'Das unterschriebene Formular schicken Sie mit den verlangten Unterlagen zurück. Dafür bleibt nach der Zustellung nur wenig Zeit.',
    // SV § 71 Abs. 2: «Die Prämienverbilligung ist in den Ergänzungsleistungen mit enthalten.»;
    // Abs. 3: «Die Sozialhilfebehörde meldet die Prämienverbilligung der Ausgleichskasse, unter Angabe
    // der AHV-Nr. der unterstützten Person.»; § 75 Abs. 1 (Antragsformular ohne Gesuch): «Vorbehalten
    // bleibt § 71.»
    'Wer Ergänzungsleistungen zur AHV oder IV bezieht, erhält die Prämienverbilligung mit den Ergänzungsleistungen. Wer Sozialhilfe bezieht, stellt keinen eigenen Antrag; die Sozialhilfebehörde meldet die Verbilligung der Ausgleichskasse.',
  ],
  // SV § 75 Abs. 2 (ohne Formular: Gesuch bei der Ausgleichskasse bis zu einem Datum im Sommer,
  // sonst verwirkt; vorbehalten Personen ohne rechtskräftige Steuerveranlagung), § 72 (fehlende
  // Veranlagung: rückwirkend innert kurzer Frist ab Veranlagung, sonst verwirkt); Merkblatt QS
  // («Die letzte Frist für den Bezug des Antrags ist der 31. Dezember des Anspruchsjahres.»);
  // AKSO-Seite («Der Antrag für quellenbesteuerte Personen steht jeweils ab Mai des
  // Anspruchsjahres zum Download zur Verfügung.»).
  selbst: {
    einleitung: 'In diesen Fällen müssen Sie den Antrag selbst stellen:',
    punkte: [
      // SV § 75 Abs. 2: «Versicherte, die kein Antragsformular erhalten haben und Anspruch auf
      // Prämienverbilligung erheben wollen, können bei der Ausgleichskasse bis spätestens am 31. Juli
      // des Anspruchsjahres ein entsprechendes Gesuch stellen.» SG § 87 Abs. 1 lit. b: Anspruch, wenn
      // sie «am 1. Januar des Anspruchsjahres im Kanton Solothurn Wohnsitz hatten».
      'Sie haben kein Formular erhalten, etwa weil Sie neu zugezogen sind, rechnen aber mit einem Anspruch. Dann stellen Sie bei der Ausgleichskasse ein Gesuch. Dafür gilt eine feste Frist im Lauf des Anspruchsjahres. Massgebend ist der Wohnsitz am Jahresanfang.',
      'Für Sie liegt noch keine rechtskräftige Steuerveranlagung vor. Sobald sie vorliegt, können Sie den Anspruch rückwirkend geltend machen, aber nur innert kurzer Frist.',
      // Merkblatt QS «Welche Fristen gelten?»: «Das ausgefüllte Antragsformular ist innerhalb von 30
      // Tagen nach Erhalt der Ausgleichskasse zurückzuschicken. Die letzte Frist für den Bezug des
      // Antrags ist der 31. Dezember des Anspruchsjahres.» BGS 832.215 § 4 Abs. 3: «Quellenbesteuerte
      // Personen haben bis spätestens 31. Dezember einen Antrag auf Prämienverbilligung bei der
      // Ausgleichskasse einzureichen.» § 5 Abs. 1: die Ausgleichskasse «stellt ihnen [den Arbeitgebern]
      // Antragsformulare zu». Merkblatt («Bezug») und Reglement («einzureichen») sagen nicht dasselbe →
      // Rechtsprüfung 09.11.2026: zur Nachfrage raten.
      'Sie werden an der Quelle besteuert und haben eine Bewilligung B, F, G, L oder S. Das Antragsformular gibt es jeweils ab dem späten Frühling beim Arbeitgeber oder auf der Seite der Ausgleichskasse. Den ausgefüllten Antrag schicken Sie kurz nach Erhalt zurück, spätestens bis zu einer Frist am Ende des Anspruchsjahres. Merkblatt und Reglement beschreiben diese Frist nicht gleich; fragen Sie im Zweifel bei der Ausgleichskasse nach.',
    ],
    // SV § 72 und § 75 Abs. 2 («Bei Fristversäumnis verwirkt der Anspruch»); Merkblatt QS
    // («Bei zu spät eingereichten Anträgen verwirkt der Anspruch auf IPV.»).
    schluss: 'Auch bei diesen Fristen verfällt der Anspruch, wenn sie verpasst werden.',
  },
  // SV § 75 Abs. 3 (Frist ab Zustellung, «verwirkt»; auch für Rückfragen der Ausgleichskasse);
  // Merkblatt. Siehe auch src/config/ipvSolothurn.js (Verwirkung).
  fristSatz: 'Die Frist für das Formular läuft ab der Zustellung. Sie steht in der Sozialverordnung und im Merkblatt. Wer sie verpasst, verliert den Anspruch. Dasselbe gilt, wenn die Ausgleichskasse Unterlagen nachfordert und diese nicht rechtzeitig eintreffen.',
  stelle: 'Ausgleichskasse des Kantons Solothurn (AKSO)',
  // SG § 91 Abs. 1 (Auszahlung direkt an die Versicherer); Merkblatt («Die Auszahlung der IPV
  // erfolgt rückwirkend per 1. Januar direkt an Ihre Krankenkasse. Es kann einige Zeit dauern …»);
  // SV § 75 Abs. 4 (Einsicht in die Daten der Steuerverwaltung).
  stelleSatz: 'Die Ausgleichskasse verschickt die Formulare und prüft die Anträge. Mit Ihrer Unterschrift erlauben Sie ihr, Ihre Steuerdaten einzusehen. Der Beitrag geht rückwirkend auf den Jahresanfang an Ihre Krankenkasse, und es kann eine Weile dauern, bis er dort gutgeschrieben ist.',
  amtsseite: 'Seite der Ausgleichskasse Solothurn zur Prämienverbilligung',
  besonders: [
    // SG § 89 Abs. 1 (letzte rechtskräftige Steuerveranlagung; korrigiertes satzbestimmendes
    // Einkommen und Anteil des satzbestimmenden Vermögens); SV § 69 Abs. 1 lit. e und g.
    'Solothurn rechnet mit dem satzbestimmenden Einkommen aus der letzten rechtskräftigen Steuerveranlagung. Dazu kommen ein Anteil des Vermögens und einige Aufrechnungen, etwa Einzahlungen in die Säule 3a.',
    // SG § 89 Abs. 3: «Personen, welche nach Ermessen steuerlich veranlagt werden, haben keinen
    // Anspruch auf Prämienverbilligung.»
    'Wer von der Steuerverwaltung nach Ermessen veranlagt wurde, hat keinen Anspruch.',
    // Merkblatt «Wirtschaftliche Lage»: deutlicher Einkommens- oder Vermögensanstieg im Vorjahr →
    // Frage auf dem Formular mit «ja» beantworten; «Wir halten Ihren Antrag pendent, bis die
    // definitive Steuerveranlagung … vorliegt.» SG § 90 Abs. 2 (Nachvergütung auf Antrag oder
    // Rückerstattung von Amtes wegen bei wesentlich abweichendem späterem Einkommen).
    // SG § 90 Abs. 2 wörtlich: «Weicht das in einem späteren Zeitpunkt rechtskräftig festgesetzte
    // steuerbare Einkommen wesentlich von dem der Berechnung der Prämienverbilligung zugrundeliegenden
    // Einkommen ab, kann im Kalenderjahr ein Antrag auf Nachvergütung gestellt oder von Amtes wegen eine
    // Rückerstattung eingeleitet werden.»
    'Sind Ihr Einkommen oder Ihr Vermögen im Vorjahr deutlich gestiegen, beantworten Sie die Frage dazu auf dem Formular mit «ja». Die Ausgleichskasse wartet dann die neue Veranlagung ab. Weicht ein später festgesetztes Einkommen stark ab, kann es eine Nachzahlung geben; den Antrag stellen Sie im selben Kalenderjahr. Umgekehrt kann die Ausgleichskasse zu viel Bezahltes zurückfordern.',
    // SV § 71 Abs. 4 (besondere Verhältnisse wie Todesfall, Krankheit, Arbeitslosigkeit:
    // Berechnung nach der Leistungsfähigkeit im Anspruchsjahr auf Antrag bei der Ausgleichskasse).
    // BGS 832.214 § 2 Abs. 3: «Prämienverbilligung in Härtefällen wird für das Kalenderjahr der
    // Gesuchseinreichung ausgerichtet. Für vergangene Jahre wird keine Prämienverbilligung in
    // Härtefällen gewährt.» § 3 Abs. 3: «Das Antragsformular ist der Ausgleichskasse zusammen mit den
    // einverlangten Unterlagen innert 30 Tagen vollständig und unterzeichnet einzureichen.» § 3 Abs. 5:
    // «Bei Fristversäumnis tritt die Ausgleichskasse auf das Gesuch nicht ein und verwirkt der
    // Anspruch». § 2 Abs. 2 (persönliche Voraussetzungen erfüllt, ordentlicher Anspruch nicht verwirkt).
    'Wer zum Beispiel durch Krankheit, einen Todesfall, Arbeitslosigkeit oder einen geschäftlichen Rückschlag in der Zahlungsfähigkeit stark beeinträchtigt ist, kann bei der Ausgleichskasse beantragen, dass nach der aktuellen Lage gerechnet wird. Das geht nur für das laufende Jahr, nicht rückwirkend, und das Formular dafür hat wieder eine kurze Frist.',
    // Merkblatt «Junge Erwachsene» (in Ausbildung am 1. Januar, Sozialabzug der Eltern Ziffer 630:
    // auf dem Antrag der Eltern, Ausbildungsnachweis beilegen); «Regelung Konkubinatspaare»
    // (beide Einkommen massgebend, wenn beide einen halben Sozialabzug geltend machen).
    'Junge Erwachsene in Ausbildung stehen auf dem Antrag der Eltern, wenn diese für sie einen Sozialabzug erhalten. Leben Eltern ohne Trauschein mit ihren Kindern zusammen, zählen unter Umständen beide Einkommen.',
    // SV § 74: «Stirbt eine anspruchsberechtigte Person im Anspruchsjahr, so sind die zuviel
    // ausbezahlten Prämienverbilligungen zurückzuerstatten.»
    'Stirbt eine berechtigte Person im Lauf des Jahres, ist der zu viel ausbezahlte Teil zurückzuzahlen.',
  ],
  quellen: [
    { text: 'Ausgleichskasse Solothurn: Merkblatt Prämienverbilligung (PDF)', url: 'https://www.akso.ch/uploads/PDF-Formulare-AKSO/IPV/Merkblatt-IPV-2026.pdf' },
    { text: 'Ausgleichskasse Solothurn: Merkblatt Prämienverbilligung für quellenbesteuerte Personen (PDF)', url: 'https://www.akso.ch/uploads/PDF-Formulare-AKSO/IPV/2026_QS-Merkblatt.pdf' },
    // BGS Solothurn ist eine Web-App; Bestand über die API belegt, 831.29 → 404.
    { text: 'Sozialgesetz des Kantons Solothurn (SG, BGS 831.1)', url: 'https://bgs.so.ch/app/de/texts_of_law/831.1' },
    { text: 'Sozialverordnung des Kantons Solothurn (SV, BGS 831.2)', url: 'https://bgs.so.ch/app/de/texts_of_law/831.2' },
    // API …/texts_of_law/832.214 und 832.215 → 200; Gegenprobe 832.299 → 404 (09.11.2026).
    { text: 'Reglement über die Prämienverbilligung in Härtefällen (BGS 832.214)', url: 'https://bgs.so.ch/app/de/texts_of_law/832.214' },
    { text: 'Reglement über die Prämienverbilligung für Personen, die an der Quelle besteuert werden (BGS 832.215)', url: 'https://bgs.so.ch/app/de/texts_of_law/832.215' },
    KVG65,
  ],
};
