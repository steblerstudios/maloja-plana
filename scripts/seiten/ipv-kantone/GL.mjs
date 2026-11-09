// Prämienverbilligung · Kanton GL. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Alle Quellen neu abgerufen am
// 09.11.2026, jede mit Gegenprobe (erfundene Adresse → 404):
//   Merkblatt IPV 2026, Kantonale Steuerverwaltung, Fachstelle IPV (gl.ch-Asset 63123, PDF 200;
//   erfundenes Asset 99999999 → 404); Anmeldeformular 2026 (Asset 63122, PDF 200).
//   EG KVG GS VIII D/21/1 (Version 2376, «in Kraft seit: 01.01.2023 bis: 31.12.2026»), VV PV
//   GS VIII D/21/2 (Stand 01.01.2020), PVV GS VIII D/21/3 über die API der Gesetzessammlung
//   (show_as_json je 200; «VIII D/21/77» → 404). Künftige Fassung EG KVG Version 2686
//   («Stand 1. Januar 2028», versions/2686/pdf_file_with_annexes 200; versions/99999 → 404).
//   Amtsseite gl.ch …/individuelle-praemienverbilligung-ipv.html/502 → 200. Achtung: gl.ch
//   leitet nach der Nummer am Ende, nicht nach dem Namen (…-ipvxyz.html/502 → ebenfalls 200);
//   Gegenprobe darum mit erfundener Nummer …html/999999 → 404.
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Glarus',
  slug: 'glarus',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // EG KVG Art. 17 Abs. 1: «Der Anspruch auf Prämienverbilligung wird auf Antrag ermittelt und
    // ausgerichtet.» Merkblatt: «Die IPV muss jedes Jahr neu beantragt werden.»
    'Im Kanton Glarus gibt es die Prämienverbilligung nur auf Antrag, und zwar jedes Jahr neu.',
    // Merkblatt Ziff. 2: «Ende November … erhalten weiterhin alle Haushalte das Antragsformular für
    // die IPV per Post» und «auf der Plattform my.gl.ch»; «Anträge per Email sind nicht möglich.»
    'Das Formular bekommen alle Haushalte gegen Ende des Vorjahres per Post, nicht nur jene, die nach den Steuerdaten in Frage kommen. Sie können es auf Papier einreichen oder online über my.gl.ch, nicht aber per E-Mail.',
    // Merkblatt Ziff. 7: «Falls Sie Ergänzungsleistungen oder Sozialhilfe beziehen, müssen Sie
    // keinen Antrag einreichen.»; VV PV Art. 20 Abs. 1 «von Amtes wegen».
    'Wer Ergänzungsleistungen oder Sozialhilfe bezieht, muss keinen Antrag stellen. Das regeln die zuständigen Stellen mit der Fachstelle IPV.',
  ],
  // Merkblatt Ziff. 6 (eigenes Gesuch des Kindes über einer Grenze des Nettoerwerbseinkommens),
  // Ziff. 7 («Falls Sie künftig einmal keine Ergänzungsleistungen oder Sozialhilfe mehr erhalten …
  // müssen Sie fristgerecht einen IPV-Antrag einreichen.»). VV PV Art. 17 (eigener Anspruch ab
  // dem Jahr, in dem 18 vollendet wird) bewusst NICHT als Punkt: ob dafür ein eigenes Formular
  // nötig ist, sagt keine Quelle.
  selbst: {
    einleitung: 'Einen eigenen Antrag brauchen Sie zum Beispiel in diesen Fällen:',
    punkte: [
      'Sie sind zwischen 18 und 25, in Ausbildung und verdienen mehr als eine feste Grenze. Dann stellen Sie ein eigenes Gesuch, und der Beitrag wird für Sie getrennt berechnet.',
      'Sie haben bisher Ergänzungsleistungen oder Sozialhilfe bezogen und beziehen sie nicht mehr. Für die folgenden Jahre braucht es wieder einen Antrag.',
    ],
    // VV PV Art. 20 Abs. 3: «Bei Wegfall … während des Anspruchsjahres … prüft die
    // Durchführungsstelle von Amtes wegen den Leistungsanspruch für den Rest des Jahres.»
    schluss: 'Fallen Ergänzungsleistungen oder Sozialhilfe mitten im Jahr weg, prüft die Fachstelle den Anspruch für den Rest dieses Jahres von sich aus.',
  },
  // VV PV Art. 6 Abs. 1 (Frist im Anspruchsjahr) und Abs. 1a («Bei Anträgen, die nach dem … bei
  // der Durchführungsstelle eingereicht werden, werden nur diejenigen Prämien verbilligt, die ab
  // dem Folgemonat nach der Antragstellung fällig werden.»); Merkblatt «Um die IPV für das ganze
  // Jahr zu erhalten …»; Formular «Einreichefrist».
  // Prüfbefund 09.11.: Merkblatt Ziff. 3: «Nur korrekt und vollständig ausgefüllte Anträge gelten als
  // termingerecht eingereichte Anträge.»; Ziff. 2: «mit allen Beilagen».
  fristSatz: 'Die Frist liegt ganz am Anfang des Jahres. Sie steht auf dem Formular und im Merkblatt. Als fristgerecht gilt nur ein vollständiger Antrag mit allen Beilagen. Ein späterer Antrag ist noch möglich, verbilligt aber nur die Prämien ab dem Monat nach dem Eingang.',
  stelle: 'Kantonale Steuerverwaltung Glarus, Fachstelle IPV',
  // VV PV Art. 3 (Hauptabteilung Steuern = Durchführungsstelle), Art. 11 («anfechtbarer
  // Verfügung»); Merkblatt Ziff. 5 («Eine direkte Auszahlung an Sie ist nicht möglich.»).
  stelleSatz: 'Die Fachstelle IPV der Steuerverwaltung nimmt die Anträge entgegen und entscheidet mit einer Verfügung. Das Geld geht immer an die Krankenkasse, nie direkt an Sie.',
  amtsseite: 'Seite des Kantons Glarus zur Prämienverbilligung',
  besonders: [
    // EG KVG Art. 10 Abs. 1 lit. b (eheähnliche Lebensgemeinschaft); Merkblatt Ziff. 1
    // («Konkubinatspaare erhalten alle zusammen einen Gesamtbetrag»).
    'Paare, die ohne Trauschein zusammenleben, gelten wie Ehepaare als ein Haushalt und erhalten einen gemeinsamen Betrag.',
    // EG KVG Art. 11 Abs. 2: «Für Neugeborene und für Personen, die im Kanton Glarus Wohnsitz
    // nehmen, beginnt die Berechtigung am 1. Januar des auf die Geburt respektive den Zuzug
    // folgenden Jahres.»
    // Prüfbefund 09.11.: VV PV Art. 8 Abs. 1: «Bei Änderung der persönlichen Verhältnisse während des
    // Auszahlungsjahres, namentlich bei Zuzug in den Kanton aus dem Ausland, … kann bis spätestens …
    // nach Erhalt der definitiven Steuerveranlagung des Ereignisjahres ein Antrag auf
    // Prämienverbilligung gestellt werden.»
    'Wer neu in den Kanton zieht, ist erst ab dem folgenden Jahr berechtigt. Das gilt auch für Neugeborene. Wer aus dem Ausland zuzieht, fragt bei der Fachstelle nach; die Verordnung nennt dafür einen eigenen Antrag.',
    // VV PV Art. 7 Abs. 1 und 3 (erheblich verschlechtert, Antrag innert kurzer Frist seit
    // Zustellung der Steuerveranlagung des Vorjahres, zu begründen) und Art. 8 (Heirat, Trennung,
    // Scheidung, Tod: Antrag nach Erhalt der definitiven Steuerveranlagung des Ereignisjahres).
    'Ist Ihr Einkommen deutlich gesunken, können Sie verlangen, dass mit einer neueren Steuerveranlagung gerechnet wird. Ähnliches gilt nach Heirat, Trennung, Scheidung oder dem Tod des Ehepartners. Der Antrag ist zu begründen, und die Frist dafür ist kurz: Sie beginnt, sobald Sie die betreffende Steuerveranlagung erhalten. Stellen Sie den Antrag auch dann fristgerecht, wenn die alte Veranlagung zu hoch ist.',
    // ↑ Prüfbefund 09.11.: VV PV Art. 7 Abs. 1 setzt einen Antrag voraus («Hat sich die
    // wirtschaftliche Leistungsfähigkeit der Antrag stellenden Person … erheblich verschlechtert»).
    // EG KVG Art. 13 Abs. 1 lit. b/c (Verwirkung bei verspäteten Meldungen und fehlenden
    // Unterlagen), Art. 21 (Rückerstattung); VV PV Art. 14.
    // Prüfbefund 09.11. (Rechtsprüfung): zwingend. EG KVG Art. 13 Abs. 1: «Der Anspruch auf
    // individuelle Prämienverbilligung verwirkt, wenn: … b. anspruchsbegründende oder
    // mitteilungspflichtige Änderungen nicht innerhalb der vom Regierungsrat vorgeschriebenen
    // Fristen erfolgen».
    'Melden Sie Änderungen rechtzeitig und reichen Sie verlangte Unterlagen fristgerecht ein. Sonst verfällt der Anspruch. Zu Unrecht ausbezahlte Beiträge werden zurückgefordert.',
    // EG KVG Art. 9 Abs. 3 lit. a (Quellensteuerpflichtige «unter Vorbehalt von Absatz 2»
    // ausgeschlossen), Art. 16 Abs. 2 (Jahresaufenthalt: Bruttoeinkommen); VV PV Art. 22 (Wohnsitz
    // in der EU/EFTA). Die Stellen sind nicht widerspruchsfrei lesbar, darum nur der Hinweis.
    'Für Personen mit Quellensteuer und für Personen, die in einem EU- oder EFTA-Staat wohnen, gelten eigene Regeln. Ob ein Anspruch besteht, klären Sie am besten direkt mit der Fachstelle. Stellen Sie den Antrag vorsorglich innerhalb der Frist.',
    // ↑ Prüfbefund 09.11.: EG KVG Art. 13 Abs. 1 lit. a (verwirkt ohne fristgerechte Geltendmachung).
    // EG KVG Version 2686 («Stand 1. Januar 2028»), Art. 17 Abs. 1: «Personen, welche Anspruch auf
    // Prämienverbilligung haben, stellt die zuständige kantonale Verwaltungsbehörde eine Verfügung
    // zu» — beschlossen 03.05.2026, in Kraft erst ab 01.01.2028. Jahreszahlen bewusst weggelassen.
    // Prüfbefund 09.11.: Anker für «später» = Inkrafttreten laut Gesetzessammlung (Änderungstabelle
    // Version 2686: «Art. 17 Abs. 1 geändert», «Abs. 1b eingefügt»). Künftiger Art. 17 Abs. 1b:
    // «Versicherte, die keine Verfügung erhalten haben und Anspruch auf Prämienverbilligung erheben,
    // können den Erlass einer solchen bei der zuständigen kantonalen Verwaltungsbehörde verlangen.»
    'Die Landsgemeinde hat beschlossen, auf ein Verfahren ohne Antrag umzustellen: Wer Anspruch hat, bekommt dann eine Verfügung, und wer keine erhält, kann sie verlangen. Die neue Regel gilt erst ab dem Inkrafttreten, das in der Gesetzessammlung des Kantons steht. Bis dahin gilt weiterhin: ohne Antrag keine Prämienverbilligung.',
  ],
  quellen: [
    { text: 'Kantonale Steuerverwaltung Glarus: Merkblatt Prämienverbilligung (PDF)', url: 'https://www.gl.ch/public/upload/assets/63123/02%20Merkblatt%20IPV%202026.pdf?fp=1' },
    // Gesetzessammlung GL ist eine Web-App; Bestand über die API belegt, «VIII D/21/77» → 404.
    { text: 'Einführungsgesetz zum Bundesgesetz über die Krankenversicherung (EG KVG, GS VIII D/21/1)', url: 'https://gesetze.gl.ch/app/de/texts_of_law/VIII%20D/21/1' },
    { text: 'Prämienverbilligungsvollzugsverordnung (VV PV, GS VIII D/21/2)', url: 'https://gesetze.gl.ch/app/de/texts_of_law/VIII%20D/21/2' },
    KVG65,
  ],
};
