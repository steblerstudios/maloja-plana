// Prämienverbilligung · Kanton AI. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Alle Quellen neu abgerufen am
// 09.11.2026: Gesundheitsamt «Merkblatt zur individuellen Prämienverbilligung (IPV) 2026»
// (AI 511.2-34.5-1358131, PDF vom 09.12.2025) · ai.ch «Fragen und Antworten zur
// Prämienverbilligung» · StKB IPV (GS 832.501, Version 2395, in Kraft seit 01.01.2026, keine
// künftige Fassung).
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Appenzell Innerrhoden',
  slug: 'appenzell-innerrhoden',
  // «Prämienverbilligung im Kanton Appenzell Innerrhoden — Maloja Plana» hätte 66 Zeichen.
  titel: 'Prämienverbilligung in Appenzell Innerrhoden',
  weg: 'automatisch',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // Merkblatt Ziff. 1: «Die anspruchsberechtigten Personen werden durch das Gesundheitsamt
    // automatisch ermittelt und über die Höhe der Prämienverbilligung informiert. Es muss kein
    // Antrag gestellt werden.» StKB Art. 10 Abs. 1 (beschwerdefähige Verfügung).
    'In Appenzell Innerrhoden prüft das Gesundheitsamt den Anspruch in der Regel von Amtes wegen, also ohne dass Sie etwas einreichen. Grundlage sind die Steuerdaten. Wer Anspruch hat, bekommt eine Verfügung mit dem Betrag.',
    // Fragen und Antworten: «Personen, die keinen Anspruch auf Prämienverbilligung haben, werden
    // nicht informiert.» StKB Art. 10 Abs. 3: «Versicherte, die keine Verfügung erhalten haben und
    // Anspruch … erheben, können den Erlass einer solchen … verlangen. Entsprechende Anträge sind
    // schriftlich einzureichen und zu begründen.»
    'Wer keinen Anspruch hat, bekommt keinen Bericht. Meinen Sie trotzdem, Anspruch zu haben, können Sie beim Gesundheitsamt schriftlich und mit Begründung eine Verfügung verlangen.',
    'Für einige Gruppen gilt die Prüfung von Amtes wegen nicht oder erst später.',
  ],
  selbst: {
    einleitung: 'Selbst handeln oder mit einer späteren Prüfung rechnen müssen Sie in diesen Fällen:',
    punkte: [
      // StKB Art. 6a Abs. 4: Personen mit Wohnsitz in einem Staat nach Art. 65a KVG «haben einen
      // Antrag auf Prämienverbilligung mittels dem dafür vorgesehenen Formular zu stellen».
      'Sie wohnen in einem Staat nach Art. 65a KVG, etwa einem EU-Staat, und sind in der Schweiz versichert. Dann stellen Sie den Antrag selbst, mit dem Formular des Gesundheitsamts.',
      // StKB Art. 5 Abs. 2: «Liegt auch eine solche nicht vor, wird mit der Berechnung gewartet,
      // bis sie vorliegt.»
      'Es liegt noch keine rechtskräftige definitive Steuerveranlagung vor. Dann wartet das Amt mit der Berechnung, bis sie da ist.',
      // StKB Art. 6 Abs. 5 (Zivilstandsänderung im Vorjahr, sehr tiefes Einkommen im Vorvorjahr);
      // Merkblatt Ziff. 2 (Zuzug im Vorjahr) — Veranlagung des Vorjahres wird abgewartet.
      'Sie sind im Vorjahr in den Kanton gezogen, Ihr Zivilstand hat sich im Vorjahr geändert, oder Ihr massgebendes Einkommen war sehr tief. Dann wartet das Amt die Steuerveranlagung des Vorjahres ab.',
      // StKB Art. 5a Abs. 4: Gesamtanspruch für alle im Haushalt erst nach Vorliegen der Veranlagung
      // des jungen Erwachsenen für das Vorjahr.
      'In Ihrem Haushalt lebt eine junge erwachsene Person. Dann wird die ganze Familie erst berechnet, wenn deren Steuerveranlagung des Vorjahres vorliegt.',
      // StKB Art. 6 Abs. 4 lit. b: kein Anspruch für Personen, «die ihren Mitwirkungspflichten der
      // Steuergesetzgebung nicht nachgekommen sind».
      'Sie sind Ihren Pflichten gegenüber der Steuerverwaltung nicht nachgekommen, sodass Ihre Verhältnisse nicht bekannt sind. Dann besteht kein Anspruch.',
    ],
    // StKB Art. 11a: Gesuch um provisorische Verfügung, «Eine allfällige Differenz zur definitiven
    // Verfügung wird rückwirkend verrechnet.» Merkblatt Ziff. 5 («mit dem dafür vorgesehenen Formular»).
    schluss: 'Sind Sie bis zur definitiven Verfügung auf die Verbilligung angewiesen, können Sie beim Gesundheitsamt mit einem Formular eine provisorische Verbilligung beantragen. Eine Differenz wird später verrechnet.',
  },
  // StKB Art. 15a Abs. 1: «Gegen Verfügungen über Prämienverbilligungen kann innert 30 Tagen nach
  // der Eröffnung beim Gesundheits- und Sozialdepartement schriftlich Einsprache geführt werden.»
  // Eine Antragsfrist für die Prüfung von Amtes wegen nennen Merkblatt und StKB nicht.
  // StKB Art. 5a Abs. 5: «Eine erhöhte Prämienverbilligung nach Art. 5 Abs. 5 kann nur geleistet
  // werden, wenn der junge Erwachsene bis zum 31. März des Anspruchsjahres nachgewiesen hat, dass er
  // im Vorjahr zumindest mehrheitlich in Ausbildung war.» (Prüfbefund 09.11.2026, Blocker)
  fristSatz: 'Eine Antragsfrist gibt es nicht. Für junge Erwachsene in Ausbildung kann aber eine Nachweisfrist gelten, siehe unten. Mit einer Verfügung nicht einverstanden? Dann gilt für die Einsprache eine kurze Frist; sie steht im Standeskommissionsbeschluss. Die Einsprache richten Sie schriftlich und begründet an das Gesundheits- und Sozialdepartement.',
  stelle: 'Gesundheitsamt Appenzell Innerrhoden',
  // StKB Art. 2 (Vollzug beim Gesundheits- und Sozialdepartement), Art. 10, Art. 11; Merkblatt
  // Ziff. 4: «im Verlaufe des Jahres rückwirkend für das gesamte Jahr … direkt der
  // Krankenversicherung überwiesen und bei den monatlichen Prämien anteilsmässig pro Person in
  // Abzug gebracht». Merkblatt Ziff. 3.6: EL-Verfügung durch die Kantonale Ausgleichskasse.
  stelleSatz: 'Das Gesundheitsamt gehört zum Gesundheits- und Sozialdepartement. Es ermittelt den Anspruch, verfügt den Betrag und überweist ihn Ihrer Krankenkasse, die ihn rückwirkend für das ganze Jahr von den Monatsprämien abzieht. Wer Ergänzungsleistungen bezieht, hat einen eigenen Weg über die Kantonale Ausgleichskasse.',
  amtsseite: 'Seite des Kantons Appenzell Innerrhoden zur Prämienverbilligung',
  besonders: [
    // StKB Art. 6 Abs. 2: «Bezüger von Ergänzungsleistungen haben keinen Anspruch auf
    // Prämienverbilligung nach diesem Standeskommissionsbeschluss. Die … Ergänzungsleistungen
    // beinhalten bereits eine Prämienpauschale». Abs. 2bis: Sozialhilfe «erhalten die volle
    // Richtprämie, jedoch maximal die tatsächliche Prämie»; Merkblatt Ziff. 3.5 (Stichtag 1. Januar).
    'Wer Ergänzungsleistungen bezieht, erhält die Prämie als Pauschale über die Ergänzungsleistungen, nicht über die Prämienverbilligung. Wer am 1. Januar Sozialhilfe bezieht, erhält die volle Richtprämie ohne Selbstbehalt, höchstens die tatsächliche Prämie.',
    // Fragen und Antworten: «Die Berechnung … kann erst vorgenommen werden, wenn die relevante
    // Steuerveranlagung vorliegt. In der Regel erfolgt dies im ersten Quartal des Anspruchsjahres.»
    'Die Verbilligung wird erst berechnet, wenn die massgebende Steuerveranlagung vorliegt, meist im ersten Quartal. Bis dahin steht auf der Prämienrechnung oft noch keine Verbilligung.',
    // StKB Art. 5 Abs. 2 (Veranlagung des Vorvorjahres), Abs. 3 lit. b, d, e (Vermögensanteil,
    // Säule 3a, Einkaufsbeiträge).
    'Grundlage ist in der Regel die definitive Veranlagung des vorletzten Jahres. Dazu kommen ein Teil des Vermögens sowie zum Beispiel Beiträge an die Säule 3a und Einkäufe in die Pensionskasse.',
    // StKB Art. 3 Abs. 2 und Art. 3a; Fragen und Antworten «Konkubinatspaare»: «es keine Rolle
    // spielt, ob es das gemeinsame Kind ist oder nicht» · «Konkubinatspaare, die ohne Kinder im
    // gleichen Haushalt leben, werden alleine berechnet.»
    'Gemeinsam berechnet werden Ehepaare und eingetragene Paare, ebenso Konkubinatspaare mit mindestens einem Kind im Haushalt, auch wenn es nicht ihr gemeinsames ist. Konkubinatspaare ohne Kind werden einzeln berechnet.',
    // StKB Art. 3 Abs. 3: «Junge Erwachsene zwischen 18 und 25 Jahren haben zusammen mit den Eltern
    // oder einem Elternteil einen Gesamtanspruch …, wenn a) sie bei den Eltern oder einem Elternteil
    // wohnen, b) sie ledig sind, c) sie keine Kinder haben … und d) ihr massgebendes Gesamteinkommen …
    // den Grenzwert … nicht übersteigt.» Merkblatt Ziff. 3.1 nennt die Gruppe nach Jahrgängen
    // («Junge Erwachsene (Jahrgänge 2001 - 2007)»), Altersangaben deshalb angeglichen.
    'Junge Erwachsene (im Merkblatt nach Jahrgängen genannt), die ledig sind, bei den Eltern wohnen, keine eigenen Kinder haben und wenig eigenes Einkommen haben, zählen zum Anspruch der Familie.',
    // Fragen und Antworten: «Es muss keine Ausbildungsbestätigung eingereicht werden, da sie seit 2026
    // durch das Gesundheitsamt elektronisch bei der Zentralen Ausgleichsstelle ZAS abgefragt wird.»
    // StKB Art. 5a Abs. 5 (Version in Kraft seit 01.01.2026): erhöhte Verbilligung nur, «wenn der junge
    // Erwachsene bis zum 31. März des Anspruchsjahres nachgewiesen hat, dass er im Vorjahr zumindest
    // mehrheitlich in Ausbildung war. Die zuständige Amtsstelle informiert die jungen Erwachsenen
    // vorgängig über diese Obliegenheit.» Widerspruch FAQ ↔ StKB: Blocker der Prüfung 09.11.2026.
    'Laut Gesundheitsamt wird die Ausbildung elektronisch abgefragt. Der Beschluss verlangt aber weiterhin einen Nachweis bis zu einem Stichtag im Frühling. Fragen Sie beim Gesundheitsamt nach, ob Sie selbst einen Nachweis einreichen müssen, besonders wenn für Sie keine Ausbildungszulage bezahlt wird.',
    // StKB Art. 6 Abs. 1: bei Quellensteuer das auf ein Jahr umgerechnete Einkommen abzüglich eines
    // Pauschalabzugs; bei nachträglicher ordentlicher Veranlagung gilt diese. Wie Quellenbesteuerte
    // erfasst werden (von Amtes wegen oder auf Antrag), sagen weder StKB noch Merkblatt noch Fragen und
    // Antworten; Prüfbefund 09.11.2026: nichts behaupten, zur Nachfrage raten.
    'Bei Quellensteuer ohne ordentliche Veranlagung rechnet das Amt mit dem Bruttoeinkommen abzüglich eines Pauschalabzugs. Werden Sie an der Quelle besteuert und sind unsicher, ob Ihr Anspruch geprüft wird, fragen Sie beim Gesundheitsamt nach.',
    // StKB Art. 6 Abs. 3 (Neuzuzug aus dem Ausland: Pro-Rata-Anteil), Abs. 4 lit. a (kein Anspruch
    // für Angehörige eines nicht in Art. 65a KVG aufgeführten Staates mit einer Bewilligung von
    // weniger als einem Jahr).
    'Wer aus dem Ausland zuzieht und nicht das ganze Jahr versichert ist, erhält einen anteiligen Betrag. Keinen Anspruch hat, wer aus einem Staat kommt, der nicht unter Art. 65a KVG fällt, und eine Aufenthaltsbewilligung von weniger als einem Jahr hat.',
    // StKB Art. 6 Abs. 4 lit. c: Keinen Anspruch haben «Personen, bei welchen Familienmitglieder oder
    // Dritte vollständig für den Lebensunterhalt aufkommen. Ausgenommen bleiben Personen gemäss Art. 6
    // Abs. 2» (EL-Bezüger, die ohnehin über die EL laufen; Ausnahme deshalb nicht erwähnt).
    'Keinen Anspruch hat auch, wer vollständig von Familienmitgliedern oder Dritten unterhalten wird.',
    // Merkblatt Ziff. 2.3: mehr als 60 aufeinander folgende Tage Militärdienst → Militärversicherung,
    // Prämienverbilligung «für diesen Zeitraum anteilsmässig gekürzt».
    'Dauert ein Militärdienst mehr als 60 Tage am Stück, ist dafür die Militärversicherung zuständig. Die Verbilligung wird für diese Zeit gekürzt.',
    // StKB Art. 8 Abs. 1 («eingetretene Änderungen umgehend mitzuteilen»), Art. 13 Abs. 1
    // («Zu Unrecht ausgerichtete Prämienverbilligungsbeiträge sind zurückzuerstatten.»), Art. 5
    // Abs. 6 (Auszahlung erst ab einem Mindestbetrag pro Jahr).
    'Änderungen teilen Sie dem Amt umgehend mit. Zu Unrecht ausgerichtete Beiträge sind zurückzuzahlen. Unter einem Mindestbetrag pro Jahr wird nichts ausbezahlt.',
  ],
  quellen: [
    // Das Merkblatt liegt unter einer Adresse, deren Ablage jährlich überschrieben wird. Die im
    // Quellenblatt notierte Adresse www.ai.ch/…/@@download/… lieferte am 09.11.2026 HTTP 404; die
    // neue Download-Adresse über www.ai.ch/api/download gibt bei erfundenem Pfad HTTP 500 statt 404
    // (keine gültige Gegenprobe). Darum nur der Titel.
    { text: 'Gesundheitsamt Appenzell Innerrhoden: Merkblatt zur individuellen Prämienverbilligung' },
    { text: 'Kanton Appenzell Innerrhoden: Fragen und Antworten zur Prämienverbilligung', url: 'https://www.ai.ch/themen/gesundheit-alter-und-soziales/individuelle-praemienverbilligung/fragen-und-antworten' },
    // ai.clex.ch ist eine Web-App (jede Adresse 200); Bestand über die API belegt:
    // api/de/texts_of_law/832.501 → 200, 832.599 → 404 (gemessen 09.11.2026).
    { text: 'Standeskommissionsbeschluss über die individuelle Prämienverbilligung in der Krankenversicherung (StKB IPV, GS 832.501)', url: 'https://ai.clex.ch/app/de/texts_of_law/832.501' },
    KVG65,
  ],
};
