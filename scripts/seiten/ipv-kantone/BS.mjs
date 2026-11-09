// Prämienverbilligung · Kanton BS. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Alle Quellen neu abgerufen am
// 09.11.2026: ASB «Merkblatt Prämienverbilligung (Ausgabe 01.2026)» · Themenseite bs.ch ·
// KVO (SG 834.410, Version 6727) · GKV (SG 834.400, Version 2849, in Kraft seit 26.01.2014) ·
// SoHaG (SG 890.700, Version 6622) · SoHaV (SG 890.710, Version 5476).
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Basel-Stadt',
  slug: 'basel-stadt',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // KVO § 15 Abs. 1: «Der Kanton entrichtet auf Antrag … Beiträge». Merkblatt Ziff. 2: «Senden
    // Sie uns das Antragsformular zusammen mit den benötigten Unterlagen zu.» Themenseite:
    // «Es genügt ein Antrag pro Haushalt.»
    'Im Kanton Basel-Stadt gibt es die Prämienverbilligung nur auf Antrag. Sie schicken das Formular mit den verlangten Unterlagen an das Amt für Sozialbeiträge. Ein Antrag genügt für den ganzen Haushalt.',
    // GKV § 17 Abs. 5: «Personen, die aufgrund der Steuerdaten Anspruch auf Prämienbeiträge haben
    // könnten, werden persönlich angeschrieben. Der Regierungsrat regelt das Nähere.» GKV § 20 Abs. 1:
    // «Der Anspruch auf Prämienbeiträge muss von den Versicherten bei der zuständigen Stelle geltend
    // gemacht … werden». Themenseite «Haben Sie Anspruch?»: «Sie reichen einen Antrag auf
    // Prämienverbilligung mit den nötigen Beilagen beim Amt für Sozialbeiträge ein.» Eine Antragsfrist
    // nennen weder GKV noch KVO noch Merkblatt (siehe fristSatz).
    'Das Gesetz sieht vor, dass der Kanton Personen anschreibt, die nach den Steuerdaten in Frage kommen. Ohne Antrag gibt es aber nichts, und auch ohne Brief können Sie jederzeit einen Antrag stellen.',
    // GKV § 17 Abs. 3: «Bei versicherten Rentnerinnen und Rentnern, die Anspruch auf
    // Ergänzungsleistungen und/oder kantonale Beihilfe haben, richtet sich der Anspruch auf
    // Prämienbeiträge ausschliesslich nach dem Bundesgesetz über die Ergänzungsleistungen».
    'Wer zur AHV- oder IV-Rente Ergänzungsleistungen oder kantonale Beihilfen bezieht, erhält die Verbilligung allein nach den Regeln der Ergänzungsleistungen.',
    // GKV § 17 Abs. 3: «Personen, welche Sozialhilfe beziehen, erhalten Prämienbeiträge
    // grundsätzlich auf der Grundlage des Sozialhilfegesetzes.» KVO § 24 (Subrogation).
    'Wer Sozialhilfe bezieht, erhält die Beiträge an die Prämie in der Regel über die Sozialhilfe.',
  ],
  // Themenseite «Besondere Fälle für einen Antrag» (Zuzug, Studierende); KVO § 16 Abs. 1–3;
  // Merkblatt Ziff. 4 und 6; SoHaG § 5 Abs. 2 lit. c und Abs. 3.
  selbst: {
    einleitung: 'Besonders zu beachten ist der Antrag in diesen Fällen:',
    punkte: [
      // KVO § 16 Abs. 1: Anspruch «bis zum Ende des entsprechenden Kalenderjahres nach dem Recht des
      // Kantons, in dem die versicherte Person am 1. Januar Wohnsitz hatte». Themenseite «Zuziehende
      // aus anderen Kantonen»: «Prämienbeiträge für die Dauer des laufenden Jahres können Sie bei der
      // zuständigen Stelle Ihres bisherigen Wohnsitzkantons geltend machen.» · «erst per Januar des
      // Folgejahres» · «Wir empfehlen Ihnen, den Antrag auf Prämienbeiträge Ende Jahr erneut zu stellen.»
      'Sie sind im laufenden Jahr aus einem anderen Kanton zugezogen. Für das laufende Jahr beantragen Sie die Verbilligung beim bisherigen Kanton, nach dessen Regeln und Fristen. In Basel-Stadt wirkt der Antrag erst ab dem folgenden Jahr; das Amt empfiehlt, ihn gegen Ende Jahr zu stellen.',
      // KVO § 16 Abs. 2: Anspruch «ab dem Monat der Versicherungsdeckung», wenn die Anmeldung
      // innert einer Frist seit dem Zuzug erfolgte; Merkblatt Ziff. 6: «Ansonsten beginnt der
      // Anspruch ab dem Monat nach der Antragstellung.»
      'Sie sind aus dem Ausland zugezogen. Stellen Sie den Antrag bald: Innert einer kurzen Frist ab Zuzug gilt er ab Beginn der Versicherung, später erst ab dem Monat nach dem Antrag.',
      // KVO § 15 Abs. 1 und § 16 Abs. 3 (Personen nach Art. 65a KVG, Anmeldung innert einer Frist
      // seit Versicherungsbeginn); § 19 (Wohnsitz in der EU, Island oder Norwegen).
      'Sie wohnen in einem Staat der EU, in Island oder in Norwegen und sind in Basel-Stadt versichert. Auch dann braucht es einen Antrag, und auch hier zählt eine kurze Frist ab Beginn der Versicherung.',
      // Themenseite «Studierende»: «können nur dann einen eigenen Antrag stellen, wenn sie über 25
      // Jahre alt sind, ihre Erstausbildung bereits abgeschlossen ist … oder sie in einem eigenen
      // Haushalt mit Lebenspartner und/oder eigenen Kindern leben.» Merkblatt Ziff. 4: volljährige
      // Kinder bis 25 in Erstausbildung «unabhängig davon, ob im gleichen Haushalt wohnhaft».
      'Sie sind volljährig, jünger als 25 und in Erstausbildung. Dann gehören Sie zum Haushalt Ihrer Eltern, auch wenn Sie anderswo wohnen. Einen eigenen Antrag stellen Sie erst, wenn Sie älter sind, die Erstausbildung abgeschlossen haben oder mit Partnerin, Partner oder eigenen Kindern einen eigenen Haushalt führen.',
    ],
    // Merkblatt Ziff. 3: Liste der Unterlagen.
    schluss: 'Welche Unterlagen beiliegen müssen, steht im Merkblatt des Amts für Sozialbeiträge.',
  },
  // Quellenblatt BS «Zuständig / Weg»: «keine Frist»; weder GKV noch KVO noch Merkblatt nennen eine
  // Antragsfrist (Prüfung 09.11.2026: «gibt es nicht» war zu absolut). GKV § 21 Abs. 1: «Der Anspruch
  // auf Prämienbeiträge entsteht ab Beginn des auf die Antragsstellung folgenden Monats.» Ausnahmen:
  // KVO § 16 Abs. 2 (Zuzug aus dem Ausland: «ab dem Monat der Versicherungsdeckung gemäss KVG,
  // sofern … die Anmeldung … innert 3 Monaten seit dem Zuzug erfolgte») und Abs. 3 (Art. 65a KVG:
  // «ab dem Monat des Versicherungsbeginns»). KVO § 17 Abs. 1: fehlende Unterlagen innert einer
  // Frist, «Bleibt diese Frist ungenutzt, ist ein neuer Antrag zu stellen.»
  fristSatz: 'Eine feste Frist für den Antrag nennen Gesetz und Merkblatt nicht. Die Verbilligung beginnt aber in der Regel erst im Monat nach dem Antrag, für die Zeit davor gibt es nichts, ausser in den oben genannten Fällen. Fordert das Amt fehlende Unterlagen nach, gilt dafür eine Frist. Verstreicht sie, müssen Sie den Antrag neu stellen.',
  stelle: 'Amt für Sozialbeiträge Basel-Stadt (ASB)',
  // KVO § 25 Abs. 1 (Auszahlung an die Krankenversicherer); Merkblatt Ziff. 5: «Wir zahlen die
  // Beiträge direkt an die Krankenkasse. Die Prämien werden entsprechend reduziert.» Themenseite:
  // «Beziehen Sie bereits Prämienverbilligung und möchten eine Änderung melden oder Dokumente
  // einreichen? Nutzen Sie dafür den digitalen Briefkasten».
  stelleSatz: 'Das ASB prüft die Anträge und zahlt die Beiträge direkt an Ihre Krankenkasse, die Ihre Prämie entsprechend senkt. Änderungen und Unterlagen können Sie dem ASB auch über den digitalen Briefkasten des Kantons schicken.',
  amtsseite: 'Seite des Kantons Basel-Stadt zur Prämienverbilligung',
  besonders: [
    // SoHaG § 1 Abs. 1 lit. a, c, d (Alimentenbevorschussung, Mietbeiträge, Prämienverbilligung);
    // § 4 (massgebliches Einkommen der Haushaltseinheit); GKV § 18; SoHaV § 13 Abs. 1: «dient in
    // der Regel die jeweils letzt vorliegende Steuerverfügung».
    'Basel-Stadt rechnet nach dem Harmonisierungsgesetz für Sozialleistungen. Dieselben Regeln gelten etwa für Mietbeiträge und die Alimentenbevorschussung. Massgebend ist das Einkommen des ganzen Haushalts, ausgehend von der letzten Steuerveranlagung.',
    // Merkblatt Ziff. 2: «Sollte Ihr aktuelles Einkommen oder Vermögen um mindestens 20 Prozent von
    // den Beträgen der letzten Steuerveranlagung abweichen, sind dem Antrag zusätzlich aktuelle
    // Einkommens- und Vermögensunterlagen beizulegen.»
    'Weichen Ihr Einkommen oder Ihr Vermögen deutlich von der letzten Steuerveranlagung ab, legen Sie dem Antrag aktuelle Belege bei. Ab wann das gilt, steht im Merkblatt.',
    // Merkblatt Ziff. 4: Konkubinat «mit gemeinsamen Kindern» und «ohne Kinder / ohne gemeinsame
    // Kinder nach fünfjähriger Lebensgemeinschaft (unter Umständen auch früher)».
    'Zum Haushalt zählt auch eine Partnerin oder ein Partner ohne Trauschein, wenn gemeinsame Kinder im Haushalt leben. Ohne gemeinsame Kinder zählt sie in der Regel nach einigen Jahren Zusammenleben dazu.',
    // Merkblatt Ziff. 6 «Hypothetisches Einkommen»; Themenseite «Nicht- oder wenig erwerbstätige
    // Personen» (Kinder im Haushalt, Pflege von Angehörigen, Krankheit/Unfall, Weiterbildung,
    // Lebensalter, vorheriger Bezug von Arbeitslosengeld oder Sozialhilfe).
    'Arbeitet eine erwachsene Person im Haushalt weniger, als das Amt für zumutbar hält, rechnet es ein angenommenes Einkommen dazu. Davon ausgenommen ist, wer zum Beispiel kleine Kinder betreut, Angehörige pflegt, krank ist oder ein höheres Alter erreicht hat.',
    // KVO § 21 Abs. 1bis: Zuschlag bei besonderer Versicherungsform nach Art. 62 Abs. 1 KVG,
    // «Der entsprechende Versicherungsnachweis ist bei der Antragstellung sowie in der Folge
    // jährlich beizubringen.» Merkblatt Ziff. 7.
    'Wer ein Versicherungsmodell mit eingeschränkter Arztwahl hat, etwa ein Hausarzt- oder HMO-Modell, erhält einen Zuschlag. Dafür reichen Sie die Police beim Antrag und danach jedes Jahr ein.',
    // SoHaG § 16 Abs. 1 und 3 (Meldepflicht, Gebühr); SoHaV § 38 Abs. 1–2 (Haushalt;
    // Einkommensänderung von mindestens einem Fünftel über mehrere Monate; Meldung «unverzüglich»);
    // SoHaV § 14 Abs. 1 (Überprüfung anhand neuer Steuerverfügung).
    // SoHaV § 38 Abs. 3 lit. a/b: «Führt eine Veränderung … zu einer Erhöhung des Anspruchs, findet eine
    // Neuberechnung ab dem ersten Tag des Folgemonats der Meldung … für die Zukunft statt»; bei einer
    // Verminderung «ab dem ersten Tag des Folgemonats nach Eintritt der Veränderung» bzw. «des vierten
    // Monats nach Eintritt der Veränderung». SoHaV § 39 Abs. 1: Gebühr, wenn die Meldepflicht «nicht
    // unverzüglich» erfüllt wird, «sofern die veränderten Verhältnisse zu einer Verringerung des
    // Anspruchs … führen». SoHaG § 17 Abs. 1: «Unrechtmässig bezogene Leistungen … sind
    // zurückzuerstatten. Wer Leistungen in gutem Glauben empfangen hat, muss sie nicht zurückerstatten,
    // wenn eine grosse Härte vorliegt.»
    'Ändert sich Ihr Haushalt oder Ihr Einkommen wesentlich und für einige Zeit, melden Sie das dem ASB umgehend, auch wenn Ihr Einkommen sinkt: Eine höhere Verbilligung gibt es bei später Meldung erst ab dem Monat nach der Meldung. Wer eine Änderung zu spät meldet, die den Anspruch senkt, kann eine Gebühr zahlen müssen. Zu Unrecht bezogene Beiträge fordert das Amt zurück; wer sie in gutem Glauben erhalten hat, muss sie bei grosser Härte nicht zurückzahlen.',
    'Das ASB prüft laufende Ansprüche zudem regelmässig anhand neuer Steuerdaten und rechnet sie bei Veränderungen neu.',
    // GKV § 22 Abs. 2 und 3: Erlöschen bei Wegzug ins Ausland; bei Wegzug in einen anderen Kanton
    // «am Ende des Jahres, in welchem der Wegzug erfolgte».
    'Ziehen Sie in einen anderen Kanton, endet der Anspruch Ende Jahr. Bei einem Wegzug ins Ausland endet er mit dem Wegzug.',
  ],
  quellen: [
    { text: 'Amt für Sozialbeiträge: Merkblatt Prämienverbilligung (PDF)', url: 'https://media.bs.ch/original_file/5fe6904e84baed32e2ffd98bb846fa9144cd536a/pv-merkblatt-2026.pdf' },
    // Gesetzessammlung BS ist eine Web-App (jede Adresse 200, auch 834.499); Bestand über die API
    // belegt: api/de/texts_of_law/<nr> → 200 für 834.400, 834.410, 890.700, 890.710; 834.419 und
    // 890.799 → 404 (gemessen 09.11.2026).
    { text: 'Verordnung über die Krankenversicherung im Kanton Basel-Stadt (KVO, SG 834.410)', url: 'https://www.gesetzessammlung.bs.ch/app/de/texts_of_law/834.410' },
    { text: 'Gesetz über die Krankenversicherung im Kanton Basel-Stadt (GKV, SG 834.400)', url: 'https://www.gesetzessammlung.bs.ch/app/de/texts_of_law/834.400' },
    { text: 'Harmonisierungsgesetz Sozialleistungen (SoHaG, SG 890.700)', url: 'https://www.gesetzessammlung.bs.ch/app/de/texts_of_law/890.700' },
    { text: 'Verordnung über die Harmonisierung und Koordination von bedarfsabhängigen Sozialleistungen (SoHaV, SG 890.710)', url: 'https://www.gesetzessammlung.bs.ch/app/de/texts_of_law/890.710' },
    KVG65,
  ],
};
