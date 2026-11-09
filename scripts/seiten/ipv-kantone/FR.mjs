// Prämienverbilligung · Kanton FR. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Alle Quellen auf Deutsch (amtliche
// Fassungen), abgerufen 09.11.2026:
//   [M]  Ausgleichskasse Freiburg, «Merkblatt betreffend Verbilligung der Krankenkassenprämien 2026»
//        (memento_rpi_d_2026.pdf; französische Fassung zum Vergleich gelesen)
//   [S]  Ausgleichskasse Freiburg, Seite «Prämienverbilligungen in der Krankenversicherung» (ecasfr.ch/de/…)
//   [G]  KVGG, SGF 842.1.1, Version in Kraft seit 01.01.2017 (API-Version 6350, keine künftige Fassung)
//   [VKP] Verordnung über die Verbilligung der Krankenkassenprämien, SGF 842.1.13, Version in Kraft
//        seit 01.01.2024 (API-Version 8445, keine künftige Fassung)
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Freiburg',
  slug: 'freiburg',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // [G] Art. 11 Abs. 1 («können der AHV-Kasse ein Gesuch um Prämienverbilligung unterbreiten»),
    // Art. 17 Abs. 4 («Die AHV-Kasse schickt den möglichen Anspruchsberechtigten das Gesuchsformular»);
    // [S]: «Der Antrag auf Prämienverbilligung (Online-Antrag oder Papierantrag)».
    'Im Kanton Freiburg gibt es die Prämienverbilligung nur auf Gesuch. Mögliche Berechtigte bekommen das Formular von der kantonalen Ausgleichskasse zugeschickt. Das Gesuch lässt sich auch online stellen.',
    // [M] «Von der Einreichung eines (neuen) Gesuches sind befreit»: «Versicherte, die schon bis Ende
    // Jahr vom genannte Jahr Anrecht auf eine Prämienverbilligung hatten: wird der Anspruch für das
    // folgende Jahr von der Kantonalen AHV-Ausgleichskasse von Amtes wegen überprüft» und «Personen, die
    // schon für das genannte Jahr ein Gesuch gestellt haben und die noch keinen Entscheid erhalten haben».
    // Ausnahmen: [VKP] Art. 5 Abs. 3 («im Folgejahr ein neues Gesuch … einzureichen») und Art. 3 Abs. 6
    // («Im Folgejahr müssen sie ab 1. Januar ein eigenes Gesuch nach Artikel 2 einreichen»).
    'Wer bis Ende Jahr Anspruch hatte, muss für das nächste Jahr in der Regel kein neues Gesuch stellen; die Ausgleichskasse prüft dann von Amtes wegen. Dasselbe gilt, wenn über ein Gesuch noch nicht entschieden ist. Ausnahmen: Zivilstandsänderung oder abgeschlossene Ausbildung, siehe unten.',
    // [M] ebd.: «AHV/IV-Rentner, die Ergänzungsleistungen beziehen»; Betrag «direkt den Krankenkassen
    // überwiesen».
    'Wer Ergänzungsleistungen zur AHV oder IV bezieht, muss kein Gesuch stellen. Der Betrag geht direkt an die Krankenkasse.',
  ],
  selbst: {
    // [VKP] Art. 2 Abs. 2: Gesuch «ausnahmsweise später», wenn die Person «a) Sozialhilfeempfänger wird;
    // b) vom Ausland her kommend im Kanton Wohnsitz nimmt; c) den Anspruch auf Ergänzungsleistungen verliert».
    // Einleitung angepasst, weil der neue erste Punkt nicht zu den Ausnahmen von Art. 2 Abs. 2 gehört.
    einleitung: 'Selbst ein Gesuch stellen müssen Sie zum Beispiel in diesen Fällen. Wer neu Sozialhilfe bezieht, aus dem Ausland zuzieht oder den Anspruch auf Ergänzungsleistungen verliert, kann das ausnahmsweise auch nach Ablauf der Frist:',
    punkte: [
      // [G] Art. 17 Abs. 3 («stellt der AHV-Kasse auf Ersuchen das Verzeichnis der Steuerpflichtigen zur
      // Verfügung, die möglicherweise Anspruch … haben») und Abs. 4 («schickt den möglichen
      // Anspruchsberechtigten das Gesuchsformular»): das Formular geht nur an Personen aus dem
      // Steuerverzeichnis. [VKP] Art. 5 Abs. 8 lit. a («Lässt sich eine versicherte Person aus einem
      // anderen Kanton oder aus dem Ausland im Kanton Freiburg nieder, so erfolgt die Berechnung … anhand
      // der ersten Steuerveranlagung»). [VKP] Art. 2 Abs. 1 («muss bis spätestens am 31. August des
      // laufenden Jahres … eingereicht werden»). [S]: «Der Antrag auf Prämienverbilligung (Online-Antrag
      // oder Papierantrag)».
      'Sie haben kein Formular bekommen, könnten aber Anspruch haben, zum Beispiel weil Sie erstmals ein Gesuch stellen oder neu im Kanton wohnen. Dann stellen Sie das Gesuch selbst, online oder auf Papier, innert der Frist.',
      'Sie beziehen neu Sozialhilfe.',
      'Sie sind aus dem Ausland in den Kanton gezogen.',
      'Sie haben den Anspruch auf Ergänzungsleistungen verloren.',
      // [VKP] Art. 5 Abs. 3: Heirat, eingetragene Partnerschaft, Scheidung, Tod eines Ehegatten,
      // Trennung «erst ab dem 1. Tag des folgenden Jahres»; «im Folgejahr ein neues Gesuch … einzureichen».
      // [VKP] Art. 7a Abs. 1: Anspruch «frühestens aber mit dem ersten Tag des Monats, in dem das Gesuch
      // bei der AHV-Ausgleichskasse eingereicht wird». Formular: «Sind nicht alle erforderlichen Dokumente
      // vorhanden, so kann der Antrag trotzdem eingereicht werden. Die fehlenden Unterlagen können später
      // nachgereicht werden (Art. 2 und 7a VKP).»
      'Sie haben im Lauf des Jahres geheiratet, eine eingetragene Partnerschaft begründet, sich getrennt, scheiden lassen oder den Ehepartner verloren. Dann reichen Sie das neue Gesuch gleich zu Beginn des folgenden Jahres ein, auch wenn noch Unterlagen fehlen. Die Verbilligung beginnt erst im Monat, in dem das Gesuch eintrifft.',
      // [VKP] Art. 3 Abs. 6: nach abgeschlossener Berufsausbildung «Im Folgejahr müssen sie ab 1. Januar
      // ein eigenes Gesuch nach Artikel 2 einreichen.» [VKP] Art. 7a Abs. 1 und Formular wie oben.
      'Sie haben eine Berufsausbildung abgeschlossen und waren bisher bei den Eltern mitgerechnet. Dann reichen Sie Ihr eigenes Gesuch gleich zu Beginn des folgenden Jahres ein, auch wenn noch Unterlagen fehlen. Die Verbilligung beginnt erst im Monat, in dem das Gesuch eintrifft.',
      // [VKP] Art. 3 Abs. 5: «Auf schriftlichen Antrag können junge Erwachsene zwischen 18 und 25 Jahren
      // die individuelle Prüfung ihres Dossiers beantragen, wenn sie beweisen können, dass die Eltern
      // ihnen gegenüber keine Unterhaltspflicht mehr haben.»
      'Sie sind zwischen 18 und 25 Jahre alt, und Ihre Eltern sind Ihnen gegenüber nicht mehr unterhaltspflichtig. Dann können Sie schriftlich eine eigene Prüfung beantragen und müssen das belegen.',
      // [M] «Zum Antragsformular erforderliche Unterlagen»: Bestätigung der Kantonalen Steuerverwaltung
      // für die Quellensteuer.
      'Sie werden an der Quelle besteuert. Dem Gesuch legen Sie eine Bescheinigung der Kantonalen Steuerverwaltung bei.',
    ],
    // [M] «Lehrlinge und Studierende»: «Grundsätzlich können Lehrlinge und Studierende unter 25 Jahren
    // kein eigenes Gesuch einreichen. Sie müssen in dem Gesuch ihrer Eltern mitaufgeführt werden.»
    // [G] Art. 11 Abs. 2.
    schluss: 'Lernende und Studierende unter 25 stellen in der Regel kein eigenes Gesuch. Sie stehen auf dem Gesuch der Eltern.',
  },
  // [VKP] Art. 2 Abs. 1 («bis spätestens am 31. August des laufenden Jahres … Diese tritt auf Gesuche,
  // die nach dieser Frist eingereicht werden, nicht ein.»); [M] («das Datum, an dem der Antrag bei der
  // Ausgleichskasse eintrifft ist massgebend»); Formular.
  fristSatz: 'Für das Gesuch gilt eine Frist im laufenden Jahr. Massgebend ist der Eingang bei der Ausgleichskasse. Die Frist steht in der Verordnung, im Merkblatt und auf dem Formular. Auf spätere Gesuche tritt die Ausgleichskasse nicht ein, ausser in den genannten Fällen.',
  // Amtsname im Original: Mémento-Kopf «Caisse de compensation / Ausgleichskasse Fribourg – Freiburg»;
  // [VKP] Art. 2 Abs. 1: «kantonalen AHV-Ausgleichskasse».
  stelle: 'Kantonale AHV-Ausgleichskasse Freiburg (Caisse de compensation du canton de Fribourg)',
  // [G] Art. 16 Abs. 1 («Die AHV-Kasse entscheidet»); [M] «Entscheide» (Verfügung, Betrag «direkt
  // der betreffenden Krankenkasse überwiesen»), Kopf «1762 Givisiez», «Hotline Deutsch und Französisch».
  stelleSatz: 'Die Ausgleichskasse in Givisiez prüft die Gesuche, entscheidet mit einer Verfügung und überweist die Verbilligung direkt an die Krankenkasse. Sie gibt auf Deutsch und auf Französisch Auskunft.',
  // Der Amtslink der App (CANTONAL_LINKS.FR.ipv) ist eine französischsprachige Seite auf fr.ch
  // (Titel «Primes maladie: changement de caisse-maladie … et réduction de primes | Etat de Fribourg»).
  amtsseite: 'Seite des Staates Freiburg zur Prämienverbilligung (auf Französisch)',
  besonders: [
    // [VKP] Art. 7a: Anspruch beginnt «frühestens aber mit dem ersten Tag des Monats, in dem das Gesuch
    // bei der AHV-Ausgleichskasse eingereicht wird».
    'Der Anspruch beginnt frühestens im Monat, in dem das Gesuch bei der Ausgleichskasse eintrifft. Für die Monate davor gibt es keine Verbilligung.',
    // [VKP] Art. 5 Abs. 1 (Nettojahreseinkommen Code 4.910, «Jahr x – 2 Jahre», erhöht um
    // Versicherungsprämien und -Beiträge Codes 4.110–4.140 und «ein Zwanzigstel … des steuerbaren
    // Vermögens»); [M] Ziff. 2.1.1.
    'Freiburg rechnet mit dem Nettoeinkommen laut Freiburger Steuerveranlagung von zwei Jahren vor dem Anspruchsjahr. Dazu kommen unter anderem die abgezogenen Versicherungsprämien und Vorsorgebeiträge sowie ein kleiner Teil des steuerbaren Vermögens.',
    // [VKP] Art. 4 Abs. 1 (Nettoeinkommen oder steuerbares Vermögen über festen Beträgen; «Personen, die von
    // Amtes wegen steuerlich veranlagt wurden») und Abs. 2 («wird eine Verbilligung … trotzdem geprüft und
    // gegebenenfalls zugesprochen, wenn die kantonale Steuerverwaltung bestätigt, dass die steuerbaren
    // Elemente dennoch genau ermittelt werden konnten»).
    'Ausgeschlossen ist, wer ein hohes Nettoeinkommen oder ein hohes steuerbares Vermögen hat. Ausgeschlossen ist auch, wer von Amtes wegen veranlagt wurde, ausser die Steuerverwaltung bestätigt, dass die Steuerwerte trotzdem genau ermittelt werden konnten.',
    // [M] «Änderung der Einkommens-Vermögenssituation»: «werden nicht sofort berücksichtigt»;
    // [VKP] Art. 5 Abs. 7: «Für Personen, die in den zwei vorangehenden Jahren keine Prämienverbilligung
    // erhalten haben, kann die AHV-Kasse – auf begründetes Gesuch der betroffenen Person hin – auf der
    // Grundlage der Steuerveranlagung der neuen Steuerperiode befinden», Abweichung «mindestens 30 %».
    'Änderungen von Einkommen oder Vermögen im Lauf des Jahres zählen nicht sofort. Wer in den beiden Jahren davor keine Verbilligung hatte, kann bei einer starken Abweichung ein begründetes Gesuch stellen. Die Ausgleichskasse kann dann auf die neuere Steuerveranlagung abstellen.',
    // [M] «Auskunftspflicht»: «Die kantonale AHV-Ausgleichskasse muss vom Gesuchsteller oder seinem
    // gesetzlichen Vertreter über jede erhebliche Änderung seiner persönlichen Lage informiert werden.
    // Zudem ist unverzüglich zu melden: jeder Wechsel des Wohnsitzes; die Geburt eines Kindes; allfällige
    // Zivilstandsänderungen mit Beweismittel». [G] Art. 20 Abs. 1: «so muss der ihr entsprechende Betrag
    // von der begünstigten Person oder von ihren Erben, unter Vorbehalt eines Erlasses, zurückerstattet
    // werden.»
    'Jede erhebliche Änderung Ihrer persönlichen Lage melden Sie der Ausgleichskasse, einen Umzug, die Geburt eines Kindes und Änderungen des Zivilstands sofort. Zu Unrecht bezogene Beträge müssen zurückbezahlt werden, notfalls von den Erben, unter Vorbehalt eines Erlasses.',
    // [VKP] Art. 6 Abs. 2 (Mindestsatz für Kinder und für junge Erwachsene in Ausbildung bis 25);
    // [M] «Wie hoch …»: «Für unterhaltsberechtigte Kinder, deren Eltern zu den Anspruchsberechtigten …
    // gehören»; Regionen: «Region 1 (Saanebezirk)», «Region 2 (Broye-, Glane-, Greyerz-, See-, Sense und
    // Vivisbachbezirk)».
    'Für Kinder und junge Erwachsene in Ausbildung bis 25 gilt eine Mindestverbilligung, wenn die Eltern Anspruch haben. Der Kanton kennt zwei Prämienregionen: den Saanebezirk und die übrigen Bezirke.',
    // [M] «Kantonswechsel»: Anspruch «für die ganze Dauer des Kalenderjahres nach dem Recht jenes
    // Kantons, in welchem die Versicherten am 1. Januar ihren Wohnsitz hatten».
    'Ziehen Sie in einen anderen Kanton, gilt für das ganze Jahr das Recht des Kantons, in dem Sie zu Jahresbeginn gewohnt haben.',
  ],
  quellen: [
    // HTTP 200, PDF; Gegenprobe assets.caisseavsfr.ch/…/xq00000000.pdf/memento_xq.pdf → 410.
    { text: 'Ausgleichskasse Freiburg: Merkblatt betreffend Verbilligung der Krankenkassenprämien (PDF)', url: 'https://assets.caisseavsfr.ch/Htdocs/Files/v/bf04db7f90d35571756550ed65feda79088e50fa67178eb10b2e2db6a36cac43.pdf/memento_rpi_d_2026.pdf?download=1' },
    // HTTP 200; Gegenprobe …/de/Versicherungen/Pramienverbilligungen-xq/Erfunden.html → 404.
    { text: 'Ausgleichskasse Freiburg: Prämienverbilligungen in der Krankenversicherung', url: 'https://www.ecasfr.ch/de/Versicherungen/Pramienverbilligungen-in-der-Krankenversicherung/Praemienverbilligungen-in-der-Krankenversicherung.html' },
    // BDLF ist eine Web-App (jede Adresse 200); Bestand über die API belegt
    // (…/api/de/texts_of_law/842.1.1 und 842.1.13 → 200), 842.1.999 → 404.
    { text: 'Ausführungsgesetz zum Bundesgesetz über die Krankenversicherung (KVGG, SGF 842.1.1)', url: 'https://bdlf.fr.ch/app/de/texts_of_law/842.1.1' },
    { text: 'Verordnung über die Verbilligung der Krankenkassenprämien (VKP, SGF 842.1.13)', url: 'https://bdlf.fr.ch/app/de/texts_of_law/842.1.13' },
    KVG65,
  ],
};
