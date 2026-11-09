// Prämienverbilligung · Kanton ZG. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Alle Quellen neu abgerufen am
// 09.11.2026, jede mit Gegenprobe (erfundene Adresse → 404):
//   Broschüre «Prämienverbilligung 2026 im Kanton Zug — Informationen und Adressen»,
//   Ausgleichskasse Zug (PDF 200; Broschuere_IPV_2099.pdf → 404).
//   IPVG BGS 842.6 («Stand 1. Januar 2025») und V IPVG BGS 842.61 über die API der
//   Gesetzessammlung (show_as_json je 200; 842.69 → 404).
//   Seite des Kantons zg.ch/de/gesundheit/krankenversicherung/praemienverbilligung (200;
//   …praemienverbilligungxyz → 404) und der Ausgleichskasse akzug.ch/dienstleistungen/
//   praemienverbilligung (200; …xyz → 404).
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Zug',
  slug: 'zug',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // IPVG § 10 Abs. 1 (Bescheinigung an mutmasslich Berechtigte «zu Beginn eines Jahres»),
    // § 11 Abs. 1 (Gesuch); Broschüre S. 2: «Sie erhalten bis Mitte Februar ein Schreiben der
    // Ausgleichskasse Zug … Mit dem Schreiben erhalten Sie Ihre persönlichen Login-Daten.»
    'Im Kanton Zug gibt es die Prämienverbilligung nur auf Antrag. Wer nach den Steuerdaten möglicherweise Anspruch hat, bekommt zu Beginn des Jahres ein Schreiben der Ausgleichskasse Zug mit persönlichen Zugangsdaten für die Anmeldung im Internet.',
    // Broschüre S. 5: online übermitteln oder Formular «bei der Gemeindestelle ein, wo Sie am
    // 1. Januar … Ihren Wohnsitz hatten»; «Anträge per E-Mail werden nicht akzeptiert.»;
    // IPVG § 11 Abs. 1.
    'Sie melden sich online an oder geben das unterschriebene Formular bei der Gemeindestelle der Gemeinde ab, in der Sie am ersten Januar gewohnt haben. Per E-Mail geht es nicht.',
    // IPVG § 7 Abs. 2; Broschüre S. 2: «Rentnerinnen und Rentner, die Ergänzungsleistungen zur
    // AHV oder IV erhalten, müssen kein Formular ausfüllen. Sie haben automatisch Anspruch»;
    // zg.ch: «Personen, die Ergänzungsleistungen zur AHV oder IV erhalten, müssen kein Formular
    // ausfüllen.»
    'Wer Ergänzungsleistungen zur AHV oder IV bezieht, muss kein Formular ausfüllen.',
    // Prüfbefund 09.11.: IPVG § 7 Abs. 3: Personen mit wirtschaftlicher Sozialhilfe «haben Anspruch
    // auf Prämienverbilligung, soweit die Einwohner- oder Bürgergemeinden ausstehende oder laufende
    // Prämien im Durchführungsjahr bezahlen müssen». Ob dafür ein Antrag nötig ist, sagt keine Quelle.
    'Wer wirtschaftliche Sozialhilfe bezieht, hat Anspruch, soweit die Gemeinde die Prämien bezahlen muss. Klären Sie das mit dem Sozialdienst.',
  ],
  // IPVG § 10 Abs. 3 («Versicherte, die keine Bescheinigung erhalten haben und Anspruch …
  // erheben, können bei der Gemeindestelle bis spätestens … ein Gesuch stellen.»); Broschüre S. 2
  // («Neuzugezogene sowie Quellenbesteuerte werden mit einem Informationsschreiben auf die
  // Prämienverbilligung aufmerksam gemacht.»; «Werden die Ergänzungsleistungen eingestellt, muss
  // ab dem Folgejahr eine Anmeldung … eingereicht werden.»); zg.ch («Wer glaubt, Anspruch … zu
  // haben, aber bis Mitte Februar kein Schreiben erhalten hat, findet … ein Online-Anmeldeformular
  // oder kann bei der zuständigen Gemeindestelle ein Antragsformular anfordern.»).
  selbst: {
    einleitung: 'Ohne persönliches Schreiben müssen Sie selbst aktiv werden, etwa in diesen Fällen:',
    punkte: [
      'Sie haben kein Schreiben bekommen, rechnen aber mit einem Anspruch. Das Formular finden Sie im Internet bei der Ausgleichskasse oder bei Ihrer Gemeindestelle.',
      // Prüfbefund 09.11.: Informationsschreiben ≠ Bescheinigung (IPVG § 10 Abs. 1); Gesuch nach
      // § 10 Abs. 3 «bei der Gemeindestelle bis spätestens … des Jahres».
      'Sie sind neu in den Kanton Zug gezogen. Dann weist Sie die Ausgleichskasse mit einem Informationsschreiben auf die Prämienverbilligung hin. Dieses Schreiben ersetzt den Antrag nicht; stellen Sie ihn selbst innerhalb der Frist.',
      'Sie werden an der Quelle besteuert. Auch dann erhalten Sie ein Informationsschreiben. Dieses Schreiben ersetzt den Antrag nicht; stellen Sie ihn selbst innerhalb der Frist. Bei Ihnen zählt das Einkommen, auf dem die Quellensteuer erhoben wird.',
      // Prüfbefund 09.11.: IPVG § 7bis Abs. 1: Gesamtanspruch mit den Eltern nur, «sofern für sie in
      // der massgebenden Steuerveranlagung ein Kinderabzug gewährt wird»; Abs. 3: «Steht einer oder
      // einem jungen Erwachsenen in Ausbildung ein nicht reduzierter, selbstständiger Anspruch … zu,
      // so wird mindestens die Hälfte der massgebenden Prämie vergütet.» Eigener Antrag abgeleitet.
      // Nachprüfung 09.11.2026: eigener Antrag aus § 7bis Abs. 1/3 und § 11 Abs. 1 hergeleitet;
      // Mindestbeitrag nur bei «nicht reduzierte[m], selbstständige[m] Anspruch» (§ 7bis Abs. 3;
      // Broschüre «… Anspruch auf eine nicht reduzierte Verbilligung»).
      'Sie sind junge erwachsene Person in Ausbildung, und Ihre Eltern erhalten für Sie keinen Kinderabzug. Dann zählen Sie nicht zum Antrag Ihrer Eltern, sondern haben einen eigenen Anspruch und stellen einen eigenen Antrag, auch wenn Sie kein Schreiben bekommen haben. Wird Ihre Verbilligung nicht gekürzt, sieht das Gesetz für junge Erwachsene in Ausbildung einen Mindestbeitrag vor.',
      'Ihre Ergänzungsleistungen wurden eingestellt. Ab dem folgenden Jahr braucht es dann eine eigene Anmeldung.',
    ],
    schluss: 'Für alle diese Fälle gilt dieselbe Frist wie für die übrigen Anträge.',
  },
  // IPVG § 11 Abs. 1 und 2 («Verspätet eingereichte Gesuche können berücksichtigt werden, wenn sie
  // bis … gestellt werden und wichtige Gründe vorliegen.»); Broschüre S. 5 («Achtung: Sie erhalten
  // keine Prämienverbilligung, wenn Sie die Eingabefrist verpassen oder die notwendigen Unterlagen
  // nicht einreichen.»).
  fristSatz: 'Für den Antrag gilt eine Frist im Frühjahr. Sie steht im Gesetz und in der Broschüre der Ausgleichskasse. Wer sie verpasst, erhält in der Regel keine Prämienverbilligung. Nur aus wichtigen Gründen kann ein späteres Gesuch noch berücksichtigt werden, und auch das nur bis zu einem festen Datum.',
  stelle: 'Ausgleichskasse Zug, zusammen mit den Gemeindestellen',
  // IPVG § 2 Abs. 2/3, § 12 (Vorprüfung durch die Gemeindestelle), § 14 Abs. 1 (Verfügung der
  // Ausgleichskasse), § 20 Abs. 1 (Einsprache bei der Ausgleichskasse); Broschüre S. 5 («Die
  // Ausgleichskasse Zug … fordert die … Steuerfaktoren direkt bei der Steuerverwaltung ein.»).
  stelleSatz: 'Die Gemeindestelle prüft ein Papierformular auf Vollständigkeit. Die Ausgleichskasse holt die Steuerdaten selbst bei der Steuerverwaltung und entscheidet mit einer Verfügung. Gegen diese Verfügung können Sie innert kurzer Frist bei der Ausgleichskasse schriftlich und begründet Einsprache erheben.',
  // ↑ Prüfbefund 09.11. (Rechtsprüfung): IPVG § 20 Abs. 1: «Gegen die Verfügung der Ausgleichskasse
  // kann innert … seit der Mitteilung bei der Ausgleichskasse schriftlich und begründet Einsprache
  // erhoben werden.»
  amtsseite: 'Seite des Kantons Zug zur Prämienverbilligung',
  besonders: [
    // IPVG § 6 Abs. 2 (vorletzte Steuerperiode, für Zugezogene die letzte); Broschüre S. 4 («Bei
    // Personen, die im Jahr … zugezogen sind und bei 19-Jährigen ist die Steuerveranlagung …
    // massgebend.»).
    'Grundlage ist in der Regel die Steuerveranlagung des vorletzten Jahres. Für neu Zugezogene und für 19-Jährige gilt die Veranlagung des Vorjahres.',
    // IPVG § 6ter Abs. 1; Broschüre S. 4: «Nach Erhalt der Verfügung können Sie ein begründetes
    // Gesuch stellen, wenn Ihr massgebendes Einkommen des Jahres … mindestens 25 % tiefer ist …
    // Reichen Sie das Gesuch innerhalb von 20 Tagen, nachdem Sie die Verfügung erhalten haben,
    // schriftlich und unterzeichnet … ein.» Zahlen bewusst weggelassen.
    // Prüfbefund 09.11. (Blocker): IPVG § 6ter Abs. 1: «Liegt das massgebende Einkommen gemäss der dem
    // Durchführungsjahr vorangehenden Steuerperiode … tiefer als das massgebende Einkommen gemäss § 6
    // Abs. 2, wird auf begründetes Gesuch hin darauf abgestellt.» Neuberechnung «nach Erhalt der
    // Verfügung» setzt einen Antrag voraus; § 10 Abs. 3: ohne Bescheinigung Gesuch «bei der
    // Gemeindestelle bis spätestens …».
    'War Ihr Einkommen im Vorjahr deutlich tiefer als im Jahr der verwendeten Steuerveranlagung, können Sie nach Erhalt der Verfügung eine Neuberechnung verlangen. Dafür müssen Sie zuerst fristgerecht einen Antrag stellen, auch ohne persönliches Schreiben. Das Gesuch um Neuberechnung muss begründet, schriftlich und unterschrieben sein, und die Frist dafür ist kurz.',
    // IPVG § 6ter Abs. 2; Broschüre S. 4: «Änderungen im laufenden Jahr werden erst im Folgejahr
    // berücksichtigt.»
    'Was sich im laufenden Jahr ändert, etwa durch Heirat, Geburt oder einen neuen Lohn, zählt erst im folgenden Jahr.',
    // IPVG § 7bis Abs. 1; Broschüre S. 3 (junge Erwachsene in Ausbildung mit Kinderabzug der
    // Eltern; «Bei der Berechnung des Gesamtanspruchs wird das Einkommen und Vermögen der jungen
    // Erwachsenen ebenfalls berücksichtigt.»; Konkubinat: Kinder «auf dem Anmeldeformular der
    // Mutter»).
    'Junge Erwachsene in Ausbildung, für die die Eltern einen Kinderabzug erhalten, zählen zum Antrag der Eltern. Ihr eigenes Einkommen und Vermögen wird mitgerechnet. Leben die Eltern ohne Trauschein zusammen, stehen die Kinder auf dem Formular der Mutter.',
    // V IPVG § 1 Abs. 1 lit. b, b1, c (Reinvermögen anteilig, freiwillige Einkäufe 2. Säule und
    // Säule 3a werden wieder aufgerechnet).
    'Zum Einkommen werden ein Anteil des Reinvermögens sowie abgezogene Einzahlungen in die Säule 3a und freiwillige Einkäufe in die Pensionskasse wieder dazugezählt.',
    // IPVG § 9 Abs. 1 (Änderungen mitteilen), § 18 Abs. 1 («Ungerechtfertigt bezogene
    // Prämienbeiträge sind zurückzuerstatten. Die Ausgleichskasse macht die Rückforderung geltend.»).
    'Eingetretene Änderungen müssen Sie der Ausgleichskasse mitteilen. Zu Unrecht bezogene Beiträge fordert sie zurück.',
  ],
  quellen: [
    { text: 'Ausgleichskasse Zug: Broschüre Prämienverbilligung (PDF)', url: 'https://www.akzug.ch/uploads/PDF-sonstige/Broschuere_IPV_2026.pdf' },
    // BGS Zug ist eine Web-App; Bestand über die API belegt, 842.69 → 404.
    { text: 'Gesetz betreffend individuelle Prämienverbilligung in der Krankenpflegeversicherung (IPVG, BGS 842.6)', url: 'https://bgs.zg.ch/app/de/texts_of_law/842.6' },
    { text: 'Verordnung zum Gesetz betreffend individuelle Prämienverbilligung (V IPVG, BGS 842.61)', url: 'https://bgs.zg.ch/app/de/texts_of_law/842.61' },
    KVG65,
  ],
};
