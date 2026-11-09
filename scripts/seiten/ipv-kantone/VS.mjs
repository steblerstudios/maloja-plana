// Prämienverbilligung · Kanton VS. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Abgerufen 09.11.2026 abends
// (vs.ch war tagsüber in Wartung, am Abend wieder erreichbar):
//   [AK]   ahvwallis.ch, «Prämienverbilligung», Seite der Ausgleichskasse des Kantons Wallis
//          (= Amtslink der App seit 09.11.2026), Inhalt für 2026
//   [FORM] Ausgleichskasse/Dienststelle für Gesundheitswesen, «Spezielles Subventionsgesuch 2026»
//          (PDF, auf [AK] verlinkt)
//   [VüIPV] Verordnung über die obligatorische Krankenversicherung und die individuellen
//          Prämienverbilligungen, SGS 832.105, «Aktuelle Version in Kraft seit: 01.05.2026
//          (Beschlussdatum: 20.05.2026)», über lex.vs.ch/api/de/texts_of_law/832.105 → 200
//   [kGKVG] Gesetz über die Krankenversicherung, SGS 832.1, «Aktuelle Version in Kraft seit:
//          01.01.2020», über lex.vs.ch/api/de/texts_of_law/832.1 → 200
//   Gegenprobe lex.vs.ch/api/de/texts_of_law/832.999 → 404; ahvwallis.ch/de/Versicherungen/
//   Gibt-es-nicht-xyz.html → 404.
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Wallis',
  slug: 'wallis',
  weg: 'automatisch',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // [AK]: «Die Subventionsberechtigten werden aufgrund der Steuerveranlagung automatisch erfasst.
    // Den Versicherten, welche im Steuerregister erfasst sind, wird das Anrecht auf Subventionen Ende
    // Februar 2026 persönlich mitgeteilt.» VüIPV Art. 11 Abs. 1: «… erhalten einen entsprechenden
    // aufgrund der Steuerdaten ausgestellten Entscheid.» VüIPV Art. 8 Abs. 1: «… die Steuerperiode
    // berücksichtigt, die 2 Jahre vor dem Jahr liegt …»
    // Fach-/Rechtsprüfung 09.11.: «persönlich mitgeteilt» (nicht «per Post»), nur wer «im
    // Steuerregister erfasst» ist; «Ende Februar» ohne Monat als «zu Beginn des Jahres».
    'Im Kanton Wallis prüft die Ausgleichskasse den Anspruch in der Regel von Amtes wegen. Grundlage ist Ihre Steuerveranlagung von vor zwei Jahren. Wer im Steuerregister erfasst ist und Anspruch hat, bekommt zu Beginn des Jahres einen Entscheid.',
    // VüIPV Art. 14 Abs. 3: «Die gewährte finanzielle Unterstützung für Versicherte wird von den
    // geschuldeten Prämien abgezogen.» [FORM]: «Die eventuellen Subventionen werden direkt der
    // Krankenkasse überwiesen und von den Prämien in Abzug gebracht.»
    'Das Geld geht direkt an Ihre Krankenkasse, die es von Ihren Prämien abzieht.',
    // [AK]: «Die neuen Anspruchsberechtigten erhalten gegen Ende Februar 2026 eine Mitteilung über
    // ihren Anspruch 2026. Sie müssen der Ausgleichskasse des Kantons Wallis eine Kopie der
    // Krankenversicherungspolice, gültig ab 1. Januar 2026, zusenden.» · «Die Versicherten, welche im
    // Jahre 2025 Subventionen bezogen haben, ab 1. Januar 2026 bei derselben Krankenkasse bleiben …
    // werden eine Bestätigung über ihr Anrecht … erhalten.»
    // Fachprüfung 09.11.: «neue Anspruchsberechtigte» = wer im Vorjahr keine Verbilligung hatte.
    // Zum Kassenwechsel bisheriger Bezüger sagt keine Quelle etwas, daher nur der Rat nachzufragen.
    'Eines müssen Sie aber selbst tun, wenn Sie im Vorjahr keine Verbilligung hatten: Schicken Sie der Ausgleichskasse eine Kopie Ihrer Krankenkassen-Police für das neue Jahr. Wer schon im Vorjahr eine Verbilligung hatte und bei derselben Kasse bleibt, erhält nur eine Bestätigung. Haben Sie die Kasse gewechselt, fragen Sie nach, ob die Ausgleichskasse die neue Police braucht.',
    // VüIPV Art. 11 Abs. 1: «Die betroffenen Personen können ihren Anspruch innerhalb der zwingenden
    // Frist von 2 Jahren nach der Mitteilung des Entscheids bei der Ausgleichskasse geltend machen.»
    // (Frist hier ohne Zahl, wie in fristSatz.) Fach-/Rechtsprüfung 09.11.: was «geltend machen»
    // praktisch heisst, sagt keine Quelle; frz. «doivent exercer ce droit … dans un délai impératif».
    'Laut Verordnung gilt ab dem Entscheid eine feste Frist, innert der Sie den Anspruch bei der Ausgleichskasse geltend machen. Schicken Sie verlangte Unterlagen, etwa die Police, darum bald, und fragen Sie nach, wenn unklar ist, was noch fehlt.',
  ],
  // [AK], [FORM], VüIPV wie je Punkt angegeben. [FORM] Titel: «Auszufüllen durch Personen, welche
  // keine Verfügung erhalten haben und glauben, die Subventionsbedingungen zu erfüllen.»
  selbst: {
    // Fachprüfung 09.11.: mehrere Punkte betreffen Personen, die schon einen Entscheid haben
    // (Art. 6 Abs. 3, Art. 12 Abs. 2 lit. a und b).
    einleitung: 'In diesen Fällen stellen Sie selbst ein Gesuch bei der Ausgleichskasse, auch wenn Sie schon einen Entscheid haben:',
    punkte: [
      // [AK] «Quellenbesteuerung»: «Personen mit Quellenbesteuerung (Ausweis B, F, L und N) müssen für
      // 2026 ein persönliches Subventionsgesuch stellen.» · «Personen mit Ausweis B, welche 2025
      // Anrecht auf Subventionen hatten, werden im Januar 2026 automatisch ein Subventionsgesuch zum
      // Ausfüllen erhalten.»
      'Sie werden an der Quelle besteuert (Ausweis B, F, L oder N). Dann stellen Sie für das Jahr ein eigenes Gesuch. Wer mit Ausweis B schon im Vorjahr Anspruch hatte, bekommt das Formular zugeschickt, muss es aber selbst ausfüllen und einreichen.',
      // [AK] «Änderung der Aufenthaltsbewilligung im Verlauf des Jahres»: «Personen, die im Laufe des
      // Jahres 2025 eine Aufenthaltsbewilligung C erhalten, müssen einen Antrag auf einen persönlichen
      // Zuschuss für 2026 sowie eine Kopie ihrer Steuererklärung 2025 einreichen.»
      'Sie haben im Vorjahr die Niederlassungsbewilligung C erhalten. Dann reichen Sie ein Gesuch zusammen mit einer Kopie Ihrer letzten Steuererklärung ein.',
      // VüIPV Art. 9 Abs. 2: «Personen zwischen 18 und 20 Jahren, die nicht denselben gesetzlichen und
      // steuerlichen Wohnort wie die Eltern haben, können eine individuelle Prämienverbilligung
      // beantragen.» Art. 12 Abs. 2 lit. c. [FORM]: «Wohnsitzbestätigung des jungen Erwachsenen und der
      // Eltern am 1. Januar 2026».
      'Sie sind volljährig, aber noch keine 21, und wohnen nicht mehr am selben Wohnort wie Ihre Eltern. Dann können Sie ein eigenes Gesuch stellen, mit einer Wohnsitzbestätigung für sich und Ihre Eltern.',
      // VüIPV Art. 10 Abs. 5: «Wenn die finanzielle Situation im Jahr vor der finanziellen
      // Unterstützung um 30 Prozent oder mehr vom massgebenden Einkommen im Sinne von Artikel 8
      // gesunken ist, ausgenommen Selbstständigerwerbende sowie Personen, die rückwirkende AHV- oder
      // IV-Renten bezogen haben, kann aus Billigkeitsgründen auf begründetes Gesuch hin das massgebende
      // Einkommen auf der Grundlage der vom Gesuchsteller ausgefüllten Steuererklärung des Jahres vor der
      // angestrebten individuellen Prämienverbilligung berechnet werden.» Art. 12 Abs. 2 lit. b.
      // [FORM]: «im Falle einer Einkommensverminderung bitte den genauen Grund angeben».
      // Rechtsprüfung 09.11.: «30 Prozent oder mehr» ⇒ «mindestens»; «kann aus Billigkeitsgründen» ⇒ Ermessen.
      'Ihr Einkommen ist im Vorjahr deutlich gesunken, mindestens um einen Anteil, den die Verordnung festlegt. Dann können Sie mit einem begründeten Gesuch beantragen, dass mit Ihrer Steuererklärung für das Vorjahr gerechnet wird. Ob das geschieht, entscheidet die Behörde. Das gilt nicht für Selbständigerwerbende und nicht für Personen, die eine AHV- oder IV-Rente rückwirkend erhalten haben.',
      // VüIPV Art. 10 Abs. 3: «Während des Jahres eingetretene Änderungen der familiären oder
      // persönlichen Verhältnisse werden im folgenden Jahr berücksichtigt.» Art. 12 Abs. 2 lit. a
      // (Sondergesuch «Änderung der familiären Verhältnisse»). [FORM]: «Bei Trennung oder Scheidung:
      // Trennungsvereinbarung oder Scheidungsurteil».
      'Ihre Familie hat sich verändert, etwa durch Trennung oder Scheidung. Dann stellen Sie ein besonderes Gesuch mit den Belegen. Berücksichtigt wird die Änderung in der Regel erst im folgenden Jahr.',
      // VüIPV Art. 3 Abs. 2: «Für Personen, die sich im Laufe des Jahres im Wallis niederlassen und
      // bereits Ergänzungsleistungen der AHV/IV oder kantonale Sozialhilfe erhalten, kann die
      // Prämienverbilligung ab dem Zeitpunkt der Niederlassung im Wallis gewährt werden.» Art. 12
      // Abs. 2 lit. d.
      'Sie ziehen im Lauf des Jahres ins Wallis und beziehen schon Ergänzungsleistungen oder Sozialhilfe. Dann ist eine Verbilligung ab dem Zuzug möglich, mit einem besonderen Gesuch.',
      // VüIPV Art. 6 Abs. 3: «Junge Erwachsene zwischen 21 und 25 Jahren, die sich noch in Ausbildung
      // befinden und denen eine Prämienverbilligung von weniger als 50 Prozent gewährt wird, können bei
      // der Ausgleichskasse … zusätzliche finanzielle Unterstützung bis zu 50 Prozent der
      // durchschnittlichen Referenzprämie beantragen.»
      'Sie sind zwischen 21 und 25, noch in Ausbildung, und Ihre Verbilligung liegt unter einem Anteil, den die Verordnung festlegt. Dann können Sie bei der Ausgleichskasse einen Zuschlag beantragen.',
      // Fachprüfung 09.11.: [AK] teilt den Anspruch nur «Versicherten, welche im Steuerregister erfasst
      // sind» mit; [FORM] fragt «seit: … Herkommend von: …». Ohne Walliser Veranlagung kein Entscheid.
      'Sie sind erst vor kurzem ins Wallis gezogen und haben keinen Entscheid erhalten. Dann stellen Sie das Gesuch selbst; auf dem Formular geben Sie an, seit wann und woher Sie zugezogen sind.',
      // Fachprüfung 09.11.: VüIPV Art. 10 Abs. 6 Satz 2: «Für diese Personen wird die finanzielle
      // Unterstützung aufgrund dieses Entscheids gewährt.» (aus «besonders» hierher, weil zu handeln ist)
      'Ihre Lage verschlechtert sich im Lauf des Jahres stark. Dann wenden Sie sich an Ihre Gemeinde: Sie entscheidet über Sozialhilfe, und danach richtet sich auch die Verbilligung.',
      // VüIPV Art. 4: «Auf begründetes Gesuch hin kann das Departement im Härtefall unabhängig vom
      // massgebenden Einkommen eine zeitlich begrenzte individuelle Prämienverbilligung gewähren.»
      'Sie sind in einer besonderen Notlage. Dann kann der Kanton auf ein begründetes Gesuch hin eine befristete Verbilligung gewähren, auch unabhängig vom Einkommen.',
    ],
    // VüIPV Art. 11 Abs. 2: «Personen, welche davon ausgehen, die Subventionsbedingungen zu erfüllen
    // und keinen Entscheid … erhalten, müssen bei der Ausgleichskasse ein begründetes Gesuch
    // einreichen.» [AK]: «Interessierte können das entsprechende Formular bei der Ausgleichskasse des
    // Kantons Wallis beziehen.» [FORM]: «Ohne diese Belege kann Ihr Gesuch nicht berücksichtigt werden!»
    schluss: 'Auch sonst gilt: Glauben Sie, Anspruch zu haben, und haben Sie keinen Entscheid erhalten, reichen Sie ein begründetes Gesuch ein. Das Formular «Spezielles Subventionsgesuch» gibt es bei der Ausgleichskasse. Ohne die verlangten Belege wird das Gesuch nicht behandelt.',
  },
  // [AK] (Quellenbesteuerte und neue C-Bewilligung): «Diese Gesuche müssen bis spätestens am
  // 31. Dezember 2026 bei der Ausgleichskasse des Kantons Wallis eingereicht werden.» [FORM]: «Das
  // Gesuch muss spätestens bis 31. Dezember 2026 bei der Ausgleichskasse des Kantons Wallis
  // eingereicht werden.» VüIPV Art. 11 Abs. 2: «Die Frist beträgt rückwirkend 2 Jahre und beginnt zu
  // Beginn des Monats, in dem der begründete Antrag bei der Ausgleichskasse eingegangen ist.» Art. T1-1
  // (seit der Änderung vom 20.05.2026 für alle begründeten Gesuche). Das Formular nennt das Jahresende,
  // die Verordnung eine rückwirkende Frist: beide genannt, Zahlen weggelassen, Rückfrage empfohlen.
  // Fach-/Rechtsprüfung 09.11.: Jahresende allgemein nur im Formular (die Seite nennt es nur für
  // Quellenbesteuerte und neue C-Bewilligung); Art. 11 Abs. 2 ist eine Grenze der Rückwirkung
  // (frz. «délai de rétroactivité»), keine Vergünstigung; «seit kurzem» veraltet still → gestrichen.
  // Wie die Ausgleichskasse beides anwendet, ist offen (Rückfrage bei ihr).
  fristSatz: 'Für Gesuche gibt es eine Frist. Das Formular der Ausgleichskasse nennt das Ende des Jahres, für das Sie die Verbilligung wollen. Nach der Verordnung wirkt ein Gesuch ausserdem nur für eine begrenzte Zeit zurück, gerechnet ab dem Monat, in dem es bei der Ausgleichskasse eingeht. Rechnen Sie mit dem Jahresende, und fragen Sie im Zweifel bei der Ausgleichskasse nach.',
  stelle: 'Ausgleichskasse des Kantons Wallis',
  // VüIPV Art. 15 Abs. 1 lit. b–d und g (Ausgleichskasse: Entscheide, Sondergesuche, Mitteilung,
  // Auskünfte). [AK] «Wichtig: Offizielles Verfahren für Subventionsanträge»: «… dass wir keine
  // "Haustürgeschäfte" für die Gewährung von Finanzhilfen tätigen & keine Termine vereinbaren. Es werden
  // ausschliesslich Formulare berücksichtigt und bearbeitet, die über unsere Website ausgefüllt, über
  // unsere Kontaktseite übermittelt, per E-Mail oder Post an die Ausgleichskasse des Kantons Wallis in
  // Sitten gesendet werden.»
  stelleSatz: 'Die Ausgleichskasse in Sitten erstellt und verschickt die Entscheide, bearbeitet die Gesuche und gibt Auskunft. Gesuche nimmt sie nur über ihre Website, ihr Kontaktformular, per E-Mail oder per Post entgegen. Sie kommt nicht an die Haustür und vereinbart dafür keine Termine.',
  amtsseite: 'Seite der Ausgleichskasse des Kantons Wallis zur Prämienverbilligung',
  besonders: [
    // VüIPV Art. 3 Abs. 1 lit. b: «am 1. Januar des Jahres, für das eine individuelle
    // Prämienverbilligung angestrebt wird, im Wallis wohnhaft sind. Vorbehalten bleiben von Bundesrecht
    // vorgesehene Vorgaben namentlich im Bereich der bilateralen Abkommen (EU und EFTA)». Art. 10 Abs. 8:
    // «Wenn ein Versicherter seinen Wohnsitz in einen anderen Kanton verlegt, bleibt das Anrecht auf
    // Prämienverbilligung während dem ganzen betreffenden Kalenderjahr bestehen. Ausgenommen sind
    // Empfänger von Ergänzungsleistungen der AHV/IV und Sozialhilfeempfänger.»
    // Fach-/Rechtsprüfung 09.11.: Art. 10 Abs. 8 nur «in einen anderen Kanton»; Wegzug ins Ausland:
    // Art. 14 Abs. 4 lit. b, Art. 18 Abs. 2 (nicht verrechnete Verbilligung geht zurück). Art. 3
    // Abs. 1 lit. a–c sind kumulativ ⇒ «kann nur».
    'Anspruch haben kann nur, wer zu Jahresbeginn im Wallis wohnt. Wer im Lauf des Jahres zuzieht, fällt für dieses Jahr in der Regel noch nicht darunter. Wer in einen anderen Kanton zieht, behält die Verbilligung bis Ende Jahr, ausser bei Ergänzungsleistungen oder Sozialhilfe. Bei einem Wegzug ins Ausland gilt das nicht; melden Sie ihn der Ausgleichskasse. Wer im Ausland wohnt und in der Schweiz versichert ist, namentlich in der EU oder EFTA, fragt bei der Ausgleichskasse nach: Die Verordnung behält dafür das Bundesrecht vor.',
    // Fachprüfung 09.11.: VüIPV Art. 3 Abs. 4 (geändert 20.05.2026): «Ausländische Studierende, die
    // allein in die Schweiz einreisen, … haben grundsätzlich kein Anrecht auf finanzielle Unterstützung.
    // Vorbehalten bleiben dabei die gemäss Artikel 4 ausserordentlichen Fälle.»
    'Ausländische Studierende, die allein in die Schweiz kommen, haben grundsätzlich keinen Anspruch, ausser in einem Härtefall.',
    // VüIPV Art. 6 Abs. 5: «Empfängern von AHV/IV-Ergänzungsleistungen und Sozialhilfeempfängern im
    // Kanton Wallis wird eine Prämienverbilligung gewährt, die 100 Prozent der Referenzprämie
    // entspricht. … erlischt das Anrecht auf eine 100-prozentige Prämienverbilligung 3 Monate nach
    // Beendigung des Anrechts …, spätestens jedoch am Ende des laufenden Jahres.» Abs. 5bis (Einkommen
    // «von den Sozialdiensten … als unzureichend eingestuft», ohne Anspruch auf Unterstützung).
    // kGKVG Art. 7b Abs. 1 lit. b–c. Beginn: [AK] «am 1. des Monats, in welchem» ≠ VüIPV Art. 6 Abs. 5
    // «ab dem ersten Tag des Monats, nachdem» → hier ohne Monat formuliert.
    'Wer Ergänzungsleistungen zur AHV oder IV oder Sozialhilfe bezieht, erhält eine Verbilligung in der Höhe der vollen Referenzprämie. Dasselbe gilt, wenn der Sozialdienst Ihr Einkommen als ungenügend eingestuft hat, auch ohne Unterstützung. Enden diese Leistungen, gilt die volle Verbilligung noch einige Monate weiter, längstens bis Ende Jahr.',
    // VüIPV Art. 3 Abs. 3: «Versicherte, die am 31. Dezember des Jahres vor der gewährten
    // Prämienverbilligung 20 Jahre alt sind, werden individuell behandelt.» Art. 9 Abs. 1: «Zur
    // Berechnung der finanziellen Unterstützung der Eltern werden Kinder bis zum 20. Altersjahr mit
    // einbezogen.» Art. 8 Abs. 1ter (Einkommen der Kinder bis 20 zählt nicht). Art. 6 Abs. 2.
    'Kinder und junge Erwachsene bis 20 werden mit den Eltern gerechnet, ihr eigenes Einkommen zählt dabei nicht. In Familien mit unteren und mittleren Einkommen sieht die Verordnung für sie einen festen Mindestanteil der Referenzprämie vor. Wer Ende Vorjahr 20 war, wird als eigene Person gerechnet.',
    // Fachprüfung 09.11. (K9): VüIPV Art. 9 Abs. 3: «Für getrennt lebende Ehegatten ohne Kinderlasten
    // kommt die Einkommensgrenze für alleinstehende Personen zur Anwendung …» Abs. 5–6 (Kinder bei
    // geteilter Obhut: dem Elternteil mit Unterhaltsbeiträgen, sonst dem mit höherem Einkommen; bei
    // alleiniger Obhut diesem Elternteil).
    'Getrennt lebende Ehepaare ohne Kinder werden je als Einzelperson gerechnet. Leben Eltern getrennt, zählen die Kinder bei einem Elternteil: bei alleiniger Obhut bei diesem, bei geteilter Obhut bei dem, der Unterhaltsbeiträge erhält, sonst bei dem mit dem höheren Einkommen.',
    // VüIPV Art. 10 Abs. 2bis: «… wird die neue familiäre Situation ab Beginn des Monats, in dem ein
    // Kind geboren oder adoptiert wird, berücksichtigt.» [AK]: «Die Kinder, welche während dem Jahr
    // geboren werden, sind ab dem 1. Tag des Geburtsmonats berücksichtigt. In diesem Fall ist eine
    // Kopie der Versicherungspolice an die Ausgleichskasse zu senden.»
    'Ein Kind, das im Lauf des Jahres geboren oder adoptiert wird, zählt ab diesem Monat mit. Schicken Sie dann eine Kopie seiner Police an die Ausgleichskasse.',
    // VüIPV Art. 10 Abs. 4: «Hat sich das massgebende Einkommen von Personen, die nach Abschluss einer
    // Ausbildung eine Erwerbstätigkeit aufgenommen haben, im Vorjahr wesentlich und dauerhaft erhöht,
    // wird der Anspruch … auf der Grundlage der Steuerperiode (Jahr x – 1 Jahr) geprüft …»
    // Fach-/Rechtsprüfung 09.11.: Kreis der Betroffenen regelt das Departement in Richtlinien.
    'Wer nach einer Ausbildung zu arbeiten begonnen hat und im Vorjahr deutlich und dauerhaft mehr verdient, kann nach dem Einkommen des Vorjahres beurteilt werden statt nach dem älteren Steuerjahr. Wen das betrifft, regelt das Departement in Richtlinien.',
    // VüIPV Art. 8 Abs. 3: «Die Versicherten oder Familien, deren eingeschätztes Bruttovermögen einen
    // durch den Staatsrat festgelegten Betrag überschreitet, haben kein Anrecht …» Abs. 4: «Das
    // massgebende Einkommen basierend auf der Ermessenseinschätzung gibt keinen Anlass zu einer
    // Prämienverbilligung.» Abs. 5 (Quellenbesteuerte: Anteil des Bruttoeinkommens plus Vermögen).
    'Neben dem Einkommen zählt das Vermögen: Liegt das Bruttovermögen über einer Grenze, die der Staatsrat festlegt, gibt es keine Verbilligung. Wer nach Ermessen veranlagt wurde, erhält keine.',
    // VüIPV Art. 10 Abs. 7: «Wenn das berücksichtigte Einkommen während des Jahres … wesentlich und
    // dauerhaft zunimmt, bleibt die Prämienverbilligung erhalten.» Abs. 6: «Wenn sich die finanzielle
    // Situation während des Jahres … stark verschlechtert, befindet die Gemeindebehörde über den
    // Anspruch auf Sozialhilfe.» Art. 13 (Informationspflicht). [AK]: «Die Begünstigten … müssen der
    // Ausgleichskasse … unverzüglich jede Änderung ihrer persönlichen Situation mitteilen (Änderung des
    // Zivilstandes, Geburt eines Kindes, Umzug...)». Art. 19 Abs. 1 (Rückerstattung bei falschen Angaben
    // oder unterlassener Meldung).
    // Fach-/Rechtsprüfung 09.11.: Meldepflicht auch für Einkommenserhöhung vor dem Beitragsjahr ([AK]);
    // Erlass nach Art. 19 Abs. 2 / kGKVG Art. 13 Abs. 2: «… wenn die betreffende Person gutgläubig war
    // und die Rückerstattung sie übermässig belasten würde.»
    'Steigt Ihr Einkommen erst im laufenden Jahr, bleibt die Verbilligung für dieses Jahr bestehen. Melden Sie der Ausgleichskasse aber sofort jede Änderung Ihrer persönlichen Lage, etwa Heirat, Trennung, Geburt oder Umzug, und auch, wenn Ihr Einkommen schon vor dem Jahr der Verbilligung deutlich und dauerhaft gestiegen ist. Was zu Unrecht bezogen wurde, etwa wegen falscher Angaben oder einer fehlenden Meldung, wird zurückgefordert. Wer gutgläubig war und durch die Rückzahlung übermässig belastet würde, muss nach der Verordnung nicht zurückzahlen.',
    // VüIPV Art. 24 Abs. 1: «Die Entscheide … können innert 30 Tagen nach ihrer Mitteilung Gegenstand
    // einer Einsprache beim Departement bilden.» kGKVG Art. 12 Abs. 1.
    // Rechtsprüfung 09.11.: Departement aus dem Kopf von [FORM]; Weiterzug Art. 24 Abs. 2, kGKVG Art. 12 Abs. 2.
    'Sind Sie mit dem Entscheid nicht einverstanden, können Sie innert kurzer Frist ab Zustellung beim Departement für Gesundheit, Soziales und Kultur Einsprache erheben. Gegen den Einspracheentscheid ist eine Beschwerde beim Staatsrat möglich.',
  ],
  quellen: [
    { text: 'Ausgleichskasse des Kantons Wallis: Prämienverbilligung', url: 'https://www.ahvwallis.ch/de/Versicherungen/IPV-Pramienverbilligungen-in-der-Krankenversicherung/Pramienverbilligung/Praemienverbilligung.html' },
    // lex.vs.ch ist eine Web-App; Bestand über die API belegt (832.105 → 200, 832.999 → 404).
    { text: 'Verordnung über die obligatorische Krankenversicherung und die individuellen Prämienverbilligungen (VüIPV, SGS 832.105)', url: 'https://lex.vs.ch/app/de/texts_of_law/832.105' },
    { text: 'Gesetz über die Krankenversicherung des Kantons Wallis (SGS 832.1)', url: 'https://lex.vs.ch/app/de/texts_of_law/832.1' },
    KVG65,
  ],
};
