// Prämienverbilligung · Kanton BL. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Abgerufen 09.11.2026 abends:
//   [SVA]  sva-bl.ch, «Individuelle Prämienverbilligung (IPV)» (= Amtslink der App seit 09.11.2026)
//          mit den Unterseiten [ORD] «Ordentlicher Anspruch», [JE] «Junge Erwachsene in Ausbildung
//          bis 25 Jahre», [ZUZ] «Zuziehende Personen», [QST] «Quellenbesteuerte Personen», [EU]
//          «Personen mit Wohnsitz in einem EU- / EFTA-Staat», [FAQ] «Häufige Anliegen – kurz erklärt»;
//          [EL] «Jährliche Ergänzungsleistungen (EL)» (Fachprüfung 09.11.)
//   [EG KVG] Einführungsgesetz zum KVG, SGS 362, «Aktuelle Version in Kraft seit: 01.04.2023»
//   [PVV]  Prämienverbilligungsverordnung, SGS 362.12, «Aktuelle Version in Kraft seit: 01.01.2026»
//   [Dekret] SGS 362.1, «Aktuelle Version in Kraft seit: 01.01.2014»
//   Rechtstexte über bl.clex.ch/api/de/texts_of_law/<nr> → 200; Gegenprobe …/362.999 → 404;
//   sva-bl.ch/de/ausgleichskasse/individuelle-praemienverbilligung-ipv/gibts-nicht-xyz → 404.
// Fach- und Rechtsprüfung 09.11.2026 eingearbeitet (Muss: Zuzugsfrist ist KEINE längere Frist;
// «auf dem Formular» unbelegt → gestrichen).
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Basel-Landschaft',
  slug: 'basel-landschaft',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // [ORD]: «Ein Antragsformular erhalten Personen, welche seit mindestens zwei Jahren im Kanton
    // Basel-Landschaft steuerpflichtig sind und Anspruch auf Prämienverbilligung haben. Die
    // Ausgleichskasse stellt den anspruchsberechtigten Personen innert einem Monat nach der
    // definitiven Staatssteuerveranlagung automatisch das Antragsformular mit dem berechneten Betrag
    // der Prämienverbilligung zu.» PVV § 10 Abs. 1 («in der Regel von Amtes wegen»), Abs. 2;
    // EG KVG § 9 Abs. 3 («Vor-Vorjahr»).
    'Im Kanton Basel-Landschaft gibt es die Prämienverbilligung nur auf Antrag. Wer seit mindestens zwei Jahren hier steuerpflichtig ist und nach der Steuerveranlagung für das vorletzte Jahr Anspruch hat, bekommt das Antragsformular in der Regel von der SVA Basel-Landschaft zugeschickt, sobald diese Veranlagung definitiv ist. Der Betrag ist darauf schon ausgerechnet.',
    // PVV § 10 Abs. 3: «… ergänzen das Antragsformular mit den geforderten Angaben, unterzeichnen es
    // und stellen es innert 1 Jahr seit Zustellung der Ausgleichskasse zu.» Abs. 4: «Personen, die in
    // ungetrennter Ehe oder in ungetrennter eingetragener Partnerschaft leben, unterschreiben den Antrag
    // gemeinsam.» [ORD]: «Die Krankenversicherung wird über den Prämienverbilligungsanspruch erst
    // informiert, nachdem das vollständig ausgefüllte und unterschriebene Antragsformular der
    // Ausgleichskasse retourniert wurde.»
    'Das Formular ergänzen Sie, unterschreiben es und schicken es zurück. Zusammenlebende Ehepaare und eingetragene Paare unterschreiben gemeinsam. Erst danach erfährt Ihre Krankenkasse von der Verbilligung und zieht sie von der Prämienrechnung ab.',
    // [SVA]: «Wir benötigen keine neuen Krankenversicherungspolicen 2027, da wir die Informationen
    // direkt über einen Datenaustausch mit den Krankenversicherern erhalten.» [FAQ] (Januar-Rechnung:
    // «… kann auf Ihrer Januar Rechnung noch kein Abzug Ihrer Prämienverbilligung vorgenommen werden.»)
    'Für das Antragsformular müssen Sie keine neue Police einschicken, die SVA erhält die Angaben direkt von den Krankenkassen. Dass auf der ersten Rechnung des Jahres noch kein Abzug steht, ist normal.',
  ],
  // [ORD]/[QST]/[ZUZ]/[FAQ]/[JE]/[EU]; PVV §§ 10 Abs. 1bis, 13, 14, 14a, 16, 18c; EG KVG § 8 Abs. 1bis.
  // Fachprüfung 09.11. (S3): nach dem Gesuch folgt ein Antragsformular, EG KVG § 9c Abs. 2 («auf
  // Gesuch hin zugestellt»); [ZUZ]/[QST]/[EU]: «… erhält … ein Antragsformular …, welches innerhalb
  // eines Jahres seit Zustellung zurückgesendet werden muss».
  selbst: {
    einleitung: 'Kein Antragsformular bekommen Sie zum Beispiel in diesen Fällen. Dann stellen Sie selbst ein schriftliches Gesuch bei der SVA Basel-Landschaft. Besteht ein Anspruch, schickt Ihnen die SVA danach ein Antragsformular, das Sie wie oben unterschrieben zurückschicken:',
    punkte: [
      // [ORD]: «Anspruchsberechtigte Personen, die das Antragsformular nicht erhalten, müssen sich
      // innerhalb des Anspruchsjahres schriftlich bei der SVA BL melden.» PVV § 10 Abs. 1bis.
      // Fachprüfung 09.11. (S2): Formular kommt erst nach der definitiven Veranlagung.
      'Sie glauben, Anspruch zu haben, haben aber kein Formular erhalten, etwa weil Ihre Steuerveranlagung noch offen ist. Warten Sie dann nicht bis Ende Jahr.',
      // [ZUZ]: «Personen, die aus dem Inland zuziehen, können der Ausgleichskasse bis zum 31. Dezember
      // des dem Zuzugsjahr folgenden Anspruchsjahres ein schriftliches Gesuch … einreichen.» «Aus dem
      // Ausland … und nicht der Quellensteuer unterliegen» (gleiche Frist). «Es gilt die
      // Einreichungsfrist bis zum 31. Dezember des Anspruchsjahres.» PVV §§ 13 Abs. 1, 14 Abs. 1.
      // [SVA]: Wohnsitz «am 1. Januar des Anspruchsjahres»; EG KVG § 9b Abs. 1. [FAQ]: Zuzug aus anderem
      // Kanton: «definitive Staatssteuerveranlagung vom Vor-Vorjahr des vorherigen Wohnkantons»; aus dem
      // Ausland: «vom Vorjahr in Basel-Landschaft». Fach-/Rechtsprüfung 09.11. (Muss): keine längere
      // Frist — erstes Anspruchsjahr ist das Jahr nach dem Zuzug, Frist dessen Ende.
      'Sie sind aus einem anderen Kanton zugezogen, oder aus dem Ausland und werden nicht an der Quelle besteuert. Anspruch in Basel-Landschaft haben Sie ab dem Jahr nach dem Zuzug; das Gesuch dafür stellen Sie mit dem Formular für Zuziehende bis Ende dieses Jahres. Gerechnet wird mit der Veranlagung Ihres früheren Wohnkantons, bei einem Zuzug aus dem Ausland mit Ihrer ersten Veranlagung hier.',
      // [QST]: «Die Ausgleichskasse stellt quellenbesteuerten Personen, die mindestens seit dem 1. Januar
      // des Anspruchsjahres im Kanton angemeldet sind, jährlich automatisch das Gesuchsformular zu.
      // Quellenbesteuerte Personen, die bis Ende Februar des Anspruchsjahres kein Gesuchsformular
      // erhalten haben, sollten sich innerhalb des Anspruchsjahres schriftlich … melden.» PVV § 18c
      // Abs. 1–3 («im dem Zuzugsjahr folgenden Kalenderjahr erstmals Anspruch»). [FAQ]: «(Mit
      // Aufenthaltsbewilligung B, F, L, S)»; Fachprüfung 09.11. (S9): massgebend ist das
      // Quellensteuerregister, die Liste nur als Beispiel.
      'Sie werden an der Quelle besteuert (laut SVA etwa mit Bewilligung B, F, L oder S). Normalerweise kommt das Gesuchsformular jedes Jahr von selbst; fehlt es nach den ersten Monaten des Jahres, melden Sie sich schriftlich. Nach einem Zuzug haben Sie erst im folgenden Jahr Anspruch.',
      // [JE]: «Sie sind eine junge erwachsene Person (19 bis 25 Jahre), die Anspruch auf eine
      // Ausbildungszulage … hat, die nicht verheiratet ist oder in eingetragener Partnerschaft lebt, die
      // bei der Staatssteuer keinen Kinderabzug geltend gemacht hat …, dann hängt der Anspruch …
      // zusätzlich von den wirtschaftlichen Verhältnissen der leiblichen Eltern ab.» «Im Vorjahr
      // zugezogene Personen und Personen, die das Gesuchsformular … nicht erhalten haben, müssen sich
      // innerhalb des Anspruchsjahres schriftlich bei der SVA BL melden.» PVV § 14a Abs. 1 und 1bis;
      // § 14b Abs. 1 lit. b («Diese ist mit dem Gesuch einzureichen.»). Fachprüfung 09.11. (S4).
      'Sie sind zwischen 19 und 25, für Sie wird eine Ausbildungszulage bezahlt, Sie sind weder verheiratet noch in eingetragener Partnerschaft und haben bei den Steuern keinen Kinderabzug. Dann gilt ein eigenes Gesuchsverfahren, bei dem auch das Einkommen Ihrer Eltern geprüft wird. Kommt das Gesuchsformular nicht von selbst, melden Sie sich schriftlich. Wohnen Ihre Eltern in einem anderen Kanton, legen Sie deren Steuerveranlagung bei.',
      // [EU]: «Bei den Grenzgängerinnen und Grenzgängern ist die AHV-Ausgleichskasse desjenigen
      // Kantons zuständig, der die Grenzgängerbewilligung ausgestellt hat. Der Anspruch kann mit einem
      // schriftlichen Gesuch innerhalb des Anspruchsjahres geltend gemacht werden. Dazu müssen Kopien der
      // Grenzgängerbewilligung, der aktuelle/n Krankenversicherungs-Police/n und der Lohnausweise des
      // Vorjahres eingereicht werden.» «Ein Anspruch erfolgt erstmals im Kalenderjahr, das dem Beginn der
      // Unterstellung unter die schweizerische Krankenversicherung folgt.» «Für die Bezügerinnen und
      // Bezüger einer schweizerischen Rente sowie deren Familienangehörigen ist die Gemeinsamen
      // Einrichtung KVG zuständig.» PVV § 16 Abs. 1–2.
      'Sie wohnen in der EU oder EFTA und sind in der Schweiz versichert, zum Beispiel als Grenzgängerin oder Grenzgänger mit einer Bewilligung aus Basel-Landschaft. Dann stellen Sie das Gesuch selbst; Grenzgängerinnen und Grenzgänger legen Bewilligung, Police und Lohnausweis bei. Anspruch besteht erst ab dem Jahr nach Beginn der Schweizer Versicherung. Wer im Ausland eine Schweizer Rente bezieht, wendet sich an die Gemeinsame Einrichtung KVG.',
    ],
    // PVV § 18 Abs. 1bis: «Personen, bei denen sich das massgebende Jahreseinkommen oder die
    // Berechnungseinheit verändert hat, sowie junge Erwachsene, die eine Ausbildung begonnen oder
    // beendet haben, können ein Gesuch um Anpassung der Prämienverbilligung stellen.» Abs. 4bis
    // («Neugeborene Kinder werden ab Beginn des Geburtsmonats berücksichtigt»). [FAQ]: «Zum Beispiel
    // durch Einkommensverminderung im Vorjahr, Heirat, Geburt, Trennung, Todesfall. Nutzen Sie das
    // online Gesuch für eine Anpassung …»; Geburt: «mit der aktuellen Krankenversicherungs-Police von
    // Ihrem Kind einreichen». EG KVG § 9a Abs. 1 («um mehr als 20 %»; hier ohne Zahl). Fachprüfung
    // 09.11. (S8): «können» = Möglichkeit, keine Pflicht.
    schluss: 'Auch wer schon eine Verbilligung hat, kann ein Gesuch um Anpassung stellen, wenn sich die Lage verändert hat: bei Heirat, Trennung, Geburt oder Todesfall, wenn eine Ausbildung beginnt oder endet, oder wenn das Einkommen im Vorjahr um mehr als einen gesetzlich festgelegten Anteil gesunken ist. Für ein neugeborenes Kind legen Sie seine Police bei.',
  },
  // EG KVG § 9c: «1 Gesuche um Prämienverbilligung sind bis Ende des Anspruchsjahres einzureichen,
  // ansonsten der Anspruch verwirkt. 2 Antragsformulare …, die von Amts wegen oder auf Gesuch hin
  // zugestellt worden sind, sind innerhalb 1 Jahres seit Zustellung einzureichen, ansonsten der
  // Anspruch verwirkt.» PVV § 18 Abs. 2 (Anpassung bis 31. Dezember des Anspruchsjahres); PVV § 14a
  // Abs. 1bis und § 18c Abs. 1bis (zugeschickte Gesuchsformulare: innert 1 Jahr ab Zustellung).
  // [ORD]/[ZUZ]/[QST]: «innerhalb eines Jahres seit Zustellung». Rechtsprüfung 09.11.: «auf dem
  // Formular» unbelegt → «auf der Seite der SVA»; Zuzugssatz gestrichen (siehe Punkt Zuzug).
  fristSatz: 'Für Gesuche und für das Antragsformular gelten Fristen, und wer sie verpasst, verliert den Anspruch: Ein eigenes Gesuch reichen Sie bis Ende des Jahres ein, für das Sie die Verbilligung wollen. Ein zugeschicktes Antrags- oder Gesuchsformular schicken Sie innert einer festen Frist ab Zustellung zurück; sie steht im Gesetz und auf der Seite der SVA.',
  stelle: 'SVA Basel-Landschaft, Ausgleichskasse',
  // PVV § 2 Abs. 1: «Die Ausgleichskasse Basel-Landschaft … ist mit dem Vollzug der
  // Prämienverbilligung betraut.» EG KVG § 11 Abs. 1 («wird den Krankenversicherern ausgerichtet»).
  // [SVA]: «Eine persönliche Kundenberatung ist nur auf Termin möglich.»
  stelleSatz: 'Die Ausgleichskasse der SVA Basel-Landschaft führt die Prämienverbilligung für den Kanton durch, berechnet sie und überweist sie Ihrer Krankenkasse. Eine persönliche Beratung gibt es nur mit Termin.',
  amtsseite: 'Seite der SVA Basel-Landschaft zur Prämienverbilligung',
  besonders: [
    // [SVA]: «Voraussetzung ist der steuerrechtliche Wohnsitz im Kanton Basel-Landschaft am 1. Januar
    // des Anspruchsjahres.» PVV § 16 (EU/EFTA als Ausnahme, Fachprüfung S6). EG KVG § 9b: «1 Der
    // Anspruch … beginnt und endet mit dem Kalenderjahr. 2 Er endet während des Kalenderjahres: a. bei
    // Wegzug ins Ausland; b. bei Tod …» PVV § 8: «Bei Wegzug in einen anderen Kanton endet der Anspruch
    // … am Ende des laufenden Jahres.» PVV § 7 Abs. 1 (melden: Adressänderungen, Wegzug ins Ausland,
    // Ende der Krankenpflegeversicherung), Abs. 3 (Tod).
    'In der Regel hat nur Anspruch, wer zu Jahresbeginn in Basel-Landschaft steuerrechtlich wohnt; Ausnahme sind Versicherte mit Wohnsitz in der EU oder EFTA. Wer in einen anderen Kanton zieht, behält die Verbilligung bis Ende Jahr. Bei einem Wegzug ins Ausland endet sie mit dem Wegzug. Melden Sie der SVA Adressänderungen, einen Wegzug ins Ausland und das Ende Ihrer Krankenversicherung sofort und schriftlich; Angehörige melden einen Todesfall.',
    // [FAQ] «Einkommens-Erhöhungen Müssen Sie uns nicht mitteilen.» EG KVG § 9 Abs. 3 (Veranlagung
    // Vor-Vorjahr). EG KVG § 12 Abs. 1 («alle zur Abklärung der Anspruchsberechtigung erforderlichen
    // Angaben wahrheitsgetreu»). EG KVG § 13 Abs. 1: «Zu Unrecht ausgerichtete Leistungen sind
    // zurückzuerstatten. Das Verfahren richtet sich nach den Bestimmungen des … (ATSG)». PVV § 19
    // Abs. 1 lit. d («Gesuchen um Rückforderungserlass»). Erlass-Voraussetzungen (ATSG Art. 25) hier
    // nicht am Primärtext geprüft → nur «unter bestimmten Voraussetzungen».
    'Steigt Ihr Einkommen später, müssen Sie das laut SVA nicht melden, weil mit der Steuerveranlagung gerechnet wird. Was Sie im Formular oder Gesuch angeben, muss aber stimmen. Was zu Unrecht ausbezahlt wurde, wird zurückgefordert; dafür gilt das Verfahren des Sozialversicherungsrechts, in dem man unter bestimmten Voraussetzungen um Erlass ersuchen kann.',
    // EG KVG § 8 Abs. 1bis: «Junge Erwachsene bis 25 Jahre haben keinen Anspruch …, wenn ihre Eltern
    // in günstigen wirtschaftlichen Verhältnissen leben und wenn für sie eine Ausbildungszulage …
    // ausgerichtet wird. Dies gilt nicht für Personen, die verheiratet sind oder in eingetragener
    // Partnerschaft leben oder denen bei der Staatssteuer ein Kinderabzug gewährt wird oder die
    // Sozialhilfe beziehen.» PVV § 14b Abs. 1 lit. c («Eltern, die im Ausland wohnen, wird nicht
    // berücksichtigt»). EG KVG § 8 Abs. 3 («Für anspruchsberechtigte Kinder … mindestens …»).
    'Wird für eine junge Person bis 25 eine Ausbildungszulage bezahlt und leben ihre Eltern in guten wirtschaftlichen Verhältnissen, hat sie keinen Anspruch. Das gilt nicht, wenn sie verheiratet ist oder in eingetragener Partnerschaft lebt, bei den Steuern einen Kinderabzug hat oder Sozialhilfe bezieht. Das Einkommen von Eltern im Ausland zählt nicht. Haben Kinder und junge Erwachsene bis 25 Anspruch, legt das Gesetz für sie einen festen Mindestanteil der Richtprämie fest.',
    // [FAQ]: «Die Prämienverbilligung für Kinder wird bei dem Elternteil geprüft, der in der
    // betreffenden Staatssteuerveranlagung den Kinderabzug geltend gemacht hat.»
    'Bei unverheirateten oder getrennten Eltern wird ein Kind bei dem Elternteil gerechnet, der in der Steuerveranlagung den Kinderabzug geltend gemacht hat.',
    // EG KVG § 8 Abs. 2: «Die Höhe der Prämienverbilligung entspricht der Differenz zwischen der
    // Jahresrichtprämie und einem Prozentanteil am massgebenden Jahreseinkommen.» Abs. 2bis («darf
    // die tatsächlich bezahlte Prämie nicht übersteigen»). § 9 Abs. 1 lit. b (Teil des steuerbaren
    // Vermögens). § 8a Abs. 1 lit. a und Dekret («anspruchsabschliessende Obergrenzen»; legt der Landrat fest).
    'Basel-Landschaft rechnet so: Von einer festen Richtprämie wird ein Anteil Ihres massgebenden Einkommens abgezogen, der Rest ist die Verbilligung, höchstens aber die Prämie, die Sie tatsächlich zahlen. Zum Einkommen zählt auch ein Teil des steuerbaren Vermögens. Über einer Einkommensobergrenze, die der Landrat festlegt, gibt es keine Verbilligung.',
    // PVV § 4 Abs. 1: «Die Sozialhilfebehörden sind berechtigt, anstelle der von ihnen unterstützten
    // Personen alle Rechtshandlungen für die Geltendmachung der Prämienverbilligung vorzunehmen.»
    // [EL]: «… die … jährlichen EL (inkl. Betrag für Krankenkasse)». Ob daneben IPV möglich ist,
    // sagen [SVA], EG KVG und PVV nicht → Verweis an die SVA (führt auch die EL, siehe [SVA]-Navigation).
    'Wer Sozialhilfe bezieht, kann die Prämienverbilligung von der Sozialhilfebehörde geltend machen lassen. Die jährlichen Ergänzungsleistungen enthalten laut SVA bereits einen Betrag für die Krankenkasse; ob daneben eine Prämienverbilligung in Frage kommt, klären Sie bei der SVA.',
    // PVV § 3a Abs. 2: «Weicht die rechtskräftige Veranlagung von der definitiven Veranlagung ab …,
    // kann die versicherte Person innert 1 Jahr ab Rechtskraft der Veranlagung schriftlich eine
    // Anpassung … beantragen.»
    'Weicht die rechtskräftige Steuerveranlagung von der ab, mit der gerechnet wurde, können Sie innert einer Frist ab Rechtskraft schriftlich eine Anpassung verlangen.',
    // PVV § 19 Abs. 1 lit. a–e, Abs. 2: «Die Einsprache ist innert 30 Tagen seit Zustellung des
    // Antragsformulars oder der Verfügung schriftlich und begründet der Ausgleichskasse einzureichen.»
    // Abs. 3: Einspracheverfahren «parteientschädigungs- und kostenlos». EG KVG § 15 Abs. 2
    // (Beschwerde beim Kantonsgericht, Abteilung Sozialversicherungsrecht). Fach-/Rechtsprüfung 09.11.:
    // Fristbeginn nennen, Abgrenzung zur Rücksendefrist.
    'Sind Sie mit der Berechnung auf dem Formular oder einem Entscheid nicht einverstanden, erheben Sie innert kurzer Frist ab Zustellung schriftlich und begründet Einsprache bei der Ausgleichskasse. Diese Frist ist viel kürzer als die für die Rücksendung des Formulars. Das Einspracheverfahren kostet nichts. Danach ist eine Beschwerde beim Kantonsgericht möglich.',
  ],
  quellen: [
    { text: 'SVA Basel-Landschaft: Häufige Anliegen zur Prämienverbilligung', url: 'https://www.sva-bl.ch/de/ausgleichskasse/individuelle-praemienverbilligung-ipv/haeufige-fragen-ipv' },
    // bl.clex.ch ist eine Web-App; Bestand über die API belegt (362 → 200, 362.999 → 404).
    { text: 'Einführungsgesetz zum Bundesgesetz über die Krankenversicherung (EG KVG, SGS 362)', url: 'https://bl.clex.ch/app/de/texts_of_law/362' },
    { text: 'Verordnung über die Prämienverbilligung in der Krankenpflegeversicherung (PVV, SGS 362.12)', url: 'https://bl.clex.ch/app/de/texts_of_law/362.12' },
    { text: 'Dekret über die Einkommensobergrenzen und den Prozentanteil in der Prämienverbilligung (SGS 362.1)', url: 'https://bl.clex.ch/app/de/texts_of_law/362.1' },
    KVG65,
  ],
};
