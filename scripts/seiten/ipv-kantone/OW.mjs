// Prämienverbilligung · Kanton OW. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Alle Quellen am 09.11.2026 neu
// abgerufen: EV KVG (GDB 851.11, «in Kraft seit: 01.06.2026», über gdb.ow.ch/api/…/851.11/
// show_as_json → 200; …/851.99/… → 404) · EG KVG (GDB 851.1, «in Kraft seit: 01.04.2026», API → 200)
// · Seite der Ausgleichskasse «Prämienverbilligung» (akow.ch/ipv → 200; …/ipvxyz → 404) ·
// Merkblatt «Prämienverbilligung 2026», Stand Januar 2026 (PDF → 200; …_2099-01.pdf → 404) ·
// ow.ch/fachbereiche/2737 («Die Prämienverbilligung ist ab dem 15. Oktober 2025 der Ausgleichskasse
// angegliedert.»).
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Obwalden',
  slug: 'obwalden',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // AK-Seite: «Im Kanton Obwalden müssen Sie einen Antrag dafür einreichen.» EV KVG Art. 10 Abs. 3:
    // Antrag «bis … des Jahres, für das die Prämienverbilligung geltend gemacht wird».
    'Im Kanton Obwalden gibt es die Prämienverbilligung nur auf Antrag, und zwar jedes Jahr neu.',
    // EV KVG Art. 10 Abs. 1: Die Vollzugsstelle «stellt allen voraussichtlich anspruchsberechtigten
    // Personen bis Ende Dezember des dem Anspruchsjahr vorangehenden Jahres die Zugangsdaten zur
    // Antragstellung zu.» AK-Seite: «Einladungsschreiben»; «Nehmen Sie mit uns Kontakt auf, wenn Sie
    // nicht in der Lage sind, das Formular online auszufüllen. Wir stellen Ihnen per Post ein
    // Papier-Formular zu.»
    'Wer nach der letzten definitiven Steuerveranlagung voraussichtlich Anspruch hat, bekommt gegen Ende des Vorjahres ein Einladungsschreiben mit den Zugangsdaten zum Online-Formular. Ein Papierformular schickt die Ausgleichskasse auf Anfrage.',
    // AK-Seite: «Wenn Sie Ergänzungsleistungen oder Wirtschaftliche Sozialhilfe beziehen, müssen Sie
    // kein Anmeldeformular einreichen. Sie erhalten automatisch Prämienverbilligungen.» EV KVG
    // Art. 15b Abs. 6 (Ausgleichskasse meldet EL-Beziehende), Art. 10 Abs. 6 (die Stellen der
    // Einwohnergemeinden reichen die Antragsformulare «für sozialhilfeberechtigte Personen» ein).
    'Wer Ergänzungsleistungen oder wirtschaftliche Sozialhilfe bezieht, muss keinen Antrag einreichen. Bei der Sozialhilfe übernimmt das die Gemeinde.',
  ],
  // EV KVG Art. 10 Abs. 2: «Versicherte, welche keine Zugangsdaten erhalten haben, können diese bei der
  // Vollzugsstelle verlangen.» AK-Seite: «Wenn Sie kein Schreiben erhalten haben, finden Sie das
  // Online-Formular ab Januar … auf unserer Website.» Merkblatt S. 1: «Ehepaare oder Familien mit
  // Kindern (Jahrgang 2009 oder jünger) reichen einen gemeinsamen Antrag … ein. Jugendliche (ab
  // Jahrgang 2008) reichen einen eigenen Antrag ein.» (Jahrgang 2008 = 18 im Jahr 2026.)
  // EV KVG Art. 8 Abs. 4 und Art. 10 Abs. 4: Antrag nach der wirtschaftlichen Leistungsfähigkeit im
  // Anspruchsjahr bei Naturereignis, Todesfall, Unfall, Krankheit, Arbeitslosigkeit, mit derselben
  // Frist; «Treten die genannten Ereignisse später ein, so können sie erst im Folgejahr berücksichtigt
  // werden.»
  selbst: {
    einleitung: 'Selbst handeln müssen Sie in diesen Fällen:',
    punkte: [
      'Sie haben kein Einladungsschreiben erhalten, vermuten aber einen Anspruch. Dann nutzen Sie das Online-Formular auf der Seite der Ausgleichskasse oder verlangen dort Zugangsdaten.',
      'Sie sind junge erwachsene Person und werden im Anspruchsjahr 18 oder sind älter. Dann stellen Sie einen eigenen Antrag; Ehepaare und Familien mit jüngeren Kindern stellen einen gemeinsamen.',
      'Ein Naturereignis, ein Todesfall, ein Unfall, eine Krankheit oder Arbeitslosigkeit hat Ihre Zahlungsfähigkeit stark beeinträchtigt. Dann können Sie beantragen, dass nach Ihrer Lage im laufenden Jahr gerechnet wird.',
    ],
    schluss: 'Auch dafür gilt die Antragsfrist. Tritt ein solches Ereignis erst danach ein, zählt es im folgenden Jahr.',
  },
  // EV KVG Art. 10 Abs. 3 (Frist in der Verordnung) und Abs. 7: «Werden Ansprüche nicht fristgerecht
  // geltend gemacht … und liegen dafür keine besonderen Gründe vor, so gelten die Ansprüche auf
  // Prämienverbilligung als verwirkt.» Merkblatt: «Einsendeschluss … Senden Sie das Anmeldeformular
  // nach dieser Frist ein, ist der Anspruch verwirkt.» ⚠️ Die Frist wurde mit der EV-Fassung vom
  // 01.06.2026 verschoben (Quellenblatt OW, Nachprüfung 28.09.2026) — darum kein Datum.
  fristSatz: 'Der Antrag muss bis zu einer Frist im Anspruchsjahr eingehen. Wer sie ohne besonderen Grund verpasst, verliert den Anspruch. Die Frist steht in der Verordnung und im Merkblatt der Ausgleichskasse; sie wurde zuletzt geändert, darum gilt die aktuelle Angabe der Ausgleichskasse.',
  stelle: 'Ausgleichskasse Obwalden',
  // ow.ch/fachbereiche/2737: Prämienverbilligung «der Ausgleichskasse angegliedert». EV KVG Art. 3
  // Abs. 1 lit. b/c (Ansprüche festlegen, Verfügungen), Art. 14 Abs. 1 (Auszahlung «an den
  // Versicherer»), Art. 4 Abs. 2 lit. a (Einwohnergemeinden: «allgemeine Auskünfte im Einzelfall»).
  // Merkblatt S. 1: «Wir können Ihren Anspruch erst berechnen, wenn das kantonale Budget für die
  // Prämienverbilligung feststeht und Ihre definitive Steuerveranlagung vorliegt.»
  stelleSatz: 'Die Ausgleichskasse Obwalden führt die Prämienverbilligung für den Kanton durch. Sie entscheidet mit einer Verfügung und zahlt den Beitrag an die Krankenkasse. Gerechnet wird erst, wenn das kantonale Budget feststeht und Ihre definitive Steuerveranlagung vorliegt; die Verfügung kann darum auf sich warten lassen. Allgemeine Auskünfte gibt auch Ihre Gemeinde.',
  amtsseite: 'Seite des Kantons Obwalden zur Prämienverbilligung',
  besonders: [
    // EV KVG Art. 7 Abs. 1/2: Anspruch nur, wenn das anrechenbare Einkommen unter einer festen
    // Grenze liegt; mit Kindern erhöht. Art. 7a lit. i: «Aufrechnung von 10 Prozent des steuerbaren
    // Vermögens (Art. 43 bis 54 StG)».
    'Obwalden kennt eine feste Einkommensgrenze: Liegt das anrechenbare Einkommen darüber, gibt es keine Verbilligung. Mit Kindern liegt die Grenze höher. Vom Vermögen wird ein Anteil des steuerbaren Vermögens zum Einkommen gezählt, also nach den steuerlichen Abzügen.',
    // EV KVG Art. 6 Abs. 2: Verhältnisse «am 1. Januar …»; «Im Laufe des Jahres eingetretene
    // Änderungen werden im Folgejahr berücksichtigt.» Art. 7 Abs. 6: Bemessung = «die vorletzte
    // Steuerperiode»; «Für Neuzuzüger und neu gemeinsam oder separat besteuerte Personen soll im ersten
    // Anspruchsjahr auf die erste Steuerperiode abgestellt werden.»
    'Massgebend sind Ihre Verhältnisse am Jahresanfang; Änderungen im Lauf des Jahres zählen erst im folgenden Jahr. Gerechnet wird mit der Steuerveranlagung von vor zwei Jahren. Wer neu zugezogen ist oder neu gemeinsam oder getrennt besteuert wird, wird im ersten Jahr nach der ersten eigenen Steuerperiode berechnet.',
    // EV KVG Art. 8 Abs. 5: Ist das anrechenbare Einkommen im Jahr nach der Bemessungsperiode deutlich
    // gesunken, zählt das nur, «wenn die anspruchsberechtigte Person innert 30 Tagen seit Zustellung
    // der Verfügung … ein begründetes Gesuch einreicht». (Schwelle in Prozent dort genannt.)
    'Ist Ihr Einkommen im Jahr nach der verwendeten Steuerperiode deutlich gesunken, wird das nur auf ein begründetes Gesuch hin berücksichtigt. Die Frist dafür ist kurz und beginnt mit der Zustellung der Verfügung.',
    // EV KVG Art. 8 Abs. 2: Quellensteuerpflichtige erhalten einen «Pro-Rata-Anteil»; massgebend sind
    // «die Monate der Erwerbstätigkeit» und ein Anteil des Bruttoerwerbseinkommens. Art. 8 Abs. 3:
    // «Asylsuchende, vorläufig Aufgenommene und Schutzbedürftige, bei denen der Bund die
    // Krankenkassenprämie übernimmt, haben keinen Anspruch».
    'Für Personen mit Quellensteuer gilt eine eigene Berechnung nach den Monaten der Erwerbstätigkeit. Keinen Anspruch hat, wessen Krankenkassenprämie der Bund übernimmt, etwa bei manchen Asylsuchenden.',
    // EV KVG Art. 15 Abs. 1: «eingetretene Änderungen in der Anspruchsberechtigung sofort der
    // Vollzugsstelle zu melden». Art. 16 Abs. 1: «Unrechtmässig ausbezahlte Prämienbeiträge sind von
    // der Person, Behörde oder Stelle zurückzuerstatten, welche sie bezogen hat.» Art. 3 Abs. 1
    // lit. d: Rückforderung «mittels Verfügung». Art. 14 Abs. 6: kleine Beträge «werden nicht
    // ausbezahlt».
    'Änderungen melden Sie der Ausgleichskasse sofort. Zu Unrecht ausbezahlte Beträge muss zurückzahlen, wer sie bezogen hat; die Ausgleichskasse fordert sie mit einer Verfügung zurück. Sehr kleine Beträge werden nicht ausbezahlt.',
  ],
  quellen: [
    { text: 'Ausgleichskasse Obwalden: Prämienverbilligung', url: 'https://www.akow.ch/ipv' },
    { text: 'Ausgleichskasse Obwalden: Merkblatt Prämienverbilligung (PDF)', url: 'https://www.akow.ch/uploads/PDF-Formulare-Merkblaetter/IPV/IPV26_Merkblatt_2026-01.pdf' },
    // GDB OW ist eine Web-App (jede /app/-Adresse 200, auch 851.99); Bestand über die API belegt,
    // …/api/de/texts_of_law/851.99/show_as_json → 404.
    { text: 'Verordnung zum Einführungsgesetz zum Krankenversicherungsgesetz (EV KVG, GDB 851.11)', url: 'https://gdb.ow.ch/app/de/texts_of_law/851.11' },
    { text: 'Einführungsgesetz zum Krankenversicherungsgesetz (EG KVG, GDB 851.1)', url: 'https://gdb.ow.ch/app/de/texts_of_law/851.1' },
    KVG65,
  ],
};
