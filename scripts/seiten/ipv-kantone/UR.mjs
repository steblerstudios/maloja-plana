// Prämienverbilligung · Kanton UR. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Alle Quellen am 09.11.2026 neu
// abgerufen: Prämienverbilligungsreglement (RB 20.2213, «in Kraft seit: 01.11.2024», über
// rechtsbuch.ur.ch/api/…/20.2213/show_as_json → 200; …/20.2299/… → 404) · SVS-Seite
// «Prämienverbilligung (IPV)» (svsuri.ch/…/prämienverbilligung-ipv → 200; …-ipvxyz → 404) ·
// SVS-Formular «Antrag auf Prämienverbilligung oder Neuberechnung … 2026» (PDF → 200; …2099.pdf
// → 404) · Medienmitteilung GSUD vom 18.12.2025 (ur.ch/mmdirektionen/131963 → 200).
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Uri',
  slug: 'uri',
  weg: 'automatisch',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // Reglement Art. 10 Abs. 1: «Aufgrund der relevanten Steuerziffern prüft die
    // Sozialversicherungsstelle Uri automatisch die Anspruchsvoraussetzungen und berechnet die
    // Prämienverbilligung.» SVS-Seite: «Wer am 1. Januar des Anspruchsjahrs im Kanton Uri wohnt und
    // ordentlich besteuert wird, erhält … einen Entscheid …, ohne sich … eigens anmelden zu müssen.»
    // Reglement Art. 7 Abs. 3: «rechtskräftige Steuerveranlagung des Steuerjahrs, das dem
    // Anspruchsjahr zwei Jahre vorausgeht».
    'Im Kanton Uri prüft die Sozialversicherungsstelle den Anspruch in der Regel von Amtes wegen, also ohne dass Sie etwas einreichen. Das gilt für alle, die am Jahresanfang im Kanton wohnen und ordentlich besteuert werden. Grundlage ist die definitive Steuerveranlagung von vor zwei Jahren.',
    // SVS-Seite: «Das gilt auch für Bezügerinnen und Bezüger von Ergänzungsleistungen und von
    // Sozialhilfe.» Reglement Art. 8 Abs. 2: «Der zuständige Sozialdienst meldet der
    // Sozialversicherungsstelle Uri jährlich die Bezügerinnen und Bezüger von wirtschaftlicher
    // Sozialhilfe»; Art. 17 Abs. 2 (interner Datenaustausch für EL).
    'Auch wer Ergänzungsleistungen oder Sozialhilfe bezieht, muss nichts einreichen. Bei der Sozialhilfe meldet der Sozialdienst die Bezügerinnen und Bezüger.',
    // Medienmitteilung 18.12.2025: «Wer keinen Entscheid der Sozialversicherungsstelle Uri erhält,
    // hat entweder keinen Anspruch auf Prämienverbilligung oder es liegen noch keine rechtskräftig
    // veranlagten Steuerdaten … vor.» Reglement Art. 10 Abs. 2: Berechnung «zurückgestellt, bis die
    // rechtskräftigen Daten vorliegen».
    'Bekommen Sie keinen Entscheid, haben Sie entweder keinen Anspruch, oder Ihre Steuerveranlagung ist noch nicht definitiv. Dann wird später gerechnet.',
  ],
  // SVS-Seite, «Ausnahmen von dieser Regel»: «Quellenbesteuerte müssen sich … anmelden.» ·
  // «Personen, die während des Anspruchsjahrs aus dem Ausland in den Kanton Uri zuziehen, müssen
  // sich … anmelden.» · «Wer im Vorjahr zum Anspruchsjahr in den Kanton Uri zieht und in
  // bescheidenen finanziellen Verhältnissen lebt, muss sich im ersten Anspruchsjahr … anmelden» ·
  // «Ehepaare in bescheidenen Verhältnissen mit getrennten Wohnsitzen (Uri und ausserkantonal)
  // müssen sich … anmelden.» Reglement Art. 11 Abs. 2/3 (Quellensteuer, Zuzug aus dem Ausland in
  // der ersten Jahreshälfte), Art. 2 lit. b (Anspruch ab dem Folgemonat des Zuzugs).
  selbst: {
    einleitung: 'Selbst anmelden müssen Sie sich, wenn einer dieser Fälle auf Sie zutrifft:',
    punkte: [
      'Sie werden an der Quelle besteuert.',
      'Sie sind im Lauf des Jahres aus dem Ausland in den Kanton Uri gezogen. Der Anspruch beginnt dann im Monat nach dem Zuzug.',
      'Sie sind im Vorjahr in den Kanton Uri gezogen. Dann melden Sie sich im ersten Urner Jahr selbst an.',
      'Sie sind verheiratet, und Sie und Ihre Ehepartnerin oder Ihr Ehepartner haben getrennte Wohnsitze, einer in Uri und einer in einem anderen Kanton.',
    ],
    // Medienmitteilung 18.12.2025: «Auch bei eingetretenen Zivilstandsänderungen wie Tod, Trennung
    // oder Scheidung empfiehlt sich eine Anmeldung oder im Zweifelsfall eine Kontaktaufnahme mit der
    // Sozialversicherungsstelle Uri.»
    schluss: 'Nach einem Todesfall, einer Trennung oder einer Scheidung empfiehlt der Kanton, sich ebenfalls anzumelden oder bei der Sozialversicherungsstelle nachzufragen.',
  },
  // Reglement Art. 11 Abs. 1 («im laufenden Anspruchsjahr»), Abs. 2 und 3 (kürzere Fristen für
  // Quellenbesteuerte und Zuzug aus dem Ausland); Formular «Anmeldefrist: …»; SVS-Seite nennt die
  // Fristen je Gruppe.
  fristSatz: 'Wer sich selbst anmelden muss, hat dafür eine Frist im laufenden Jahr. Für Personen mit Quellensteuer und für Zuzüge aus dem Ausland ist sie kürzer als für die übrigen. Die Fristen stehen im Reglement, auf dem Formular und auf der Seite der Sozialversicherungsstelle.',
  stelle: 'Sozialversicherungsstelle Uri (SVS Uri)',
  // ur.ch/dienstleistungen/3519: «Seit dem 1. November 2024 ist die Sozialversicherungsstelle Uri
  // (SVS Uri) die neue Ansprechstelle im Kanton Uri für den Vollzug der Prämienverbilligung.»
  // Reglement Art. 13 Abs. 1 (Entscheid an alle Anspruchsberechtigten und Antragstellenden),
  // Art. 14 Abs. 1 (Auszahlung «an die berechtigten Krankenversicherer»).
  stelleSatz: 'Die SVS Uri führt die Prämienverbilligung für den Kanton durch. Sie stellt den Entscheid zu und zahlt den Beitrag direkt an die Krankenkasse.',
  amtsseite: 'Seite des Kantons Uri zur Prämienverbilligung',
  besonders: [
    // Reglement Art. 3 Abs. 3: Verhältnisse «am 1. Januar des Anspruchsjahrs massgebend. Im
    // Verlaufe des Jahrs eingetretene Änderungen werden im Folgejahr berücksichtigt.»
    'Massgebend sind Ihre persönlichen und familiären Verhältnisse am Jahresanfang. Was sich im Lauf des Jahres ändert, zählt erst im folgenden Jahr.',
    // Reglement Art. 7 Abs. 3 Satz 2–3: «Wesentliche Änderungen der wirtschaftlichen Verhältnisse
    // zwischen der verwendeten Steuerveranlagung und dem 31. Dezember vor dem Anspruchsjahr werden
    // auf Antrag berücksichtigt.» (Schwelle in Prozent dort genannt). Formular: «Antrag auf
    // Prämienverbilligung oder Neuberechnung».
    'Hat sich Ihr Einkommen zwischen der verwendeten Steuerveranlagung und dem Ende des Vorjahres wesentlich verändert, können Sie eine Neuberechnung beantragen. Was als wesentlich gilt, steht im Reglement. Das Formular ist dasselbe wie für den Antrag.',
    // Reglement Art. 4 Abs. 6: «Junge Erwachsene werden im Jahr nach dem erfüllten 18. Altersjahr
    // eigenständig (unabhängig vom Einkommen der Eltern) berechnet.» Art. 4 Abs. 3 Satz 3: «Für
    // minderjährige Kinder wird der Mindestanspruch … automatisch berechnet.» Formular Frage 4:
    // «Sind Sie zwischen 19 und 25 Jahre alt und standen Sie am 1. Januar des Anspruchsjahrs in
    // Ausbildung?»
    'Junge Erwachsene werden ab dem Jahr nach ihrem 18. Geburtstag eigenständig berechnet, unabhängig vom Einkommen der Eltern. Den Mindestbeitrag für minderjährige Kinder berechnet die SVS automatisch. Für junge Erwachsene in Ausbildung fragt das Formular nach der Ausbildung; im Zweifel fragen Sie nach.',
    // Reglement Art. 7 Abs. 1 (PV-Einkommen = Nettoeinkünfte «zuzüglich eines vom Regierungsrat
    // festzulegenden Anteils des steuerbaren Vermögens»); Art. 7 Abs. 4 (Quellensteuer: Anteil des
    // «der Quellensteuer zu Grunde liegenden Einkommens»). Im ganzen Reglement (Art. 1–20) keine
    // Vermögensgrenze (gelesen 09.11.2026).
    'Vom Vermögen wird ein Anteil zum Einkommen gezählt, und zwar vom steuerbaren Vermögen, also nach den steuerlichen Abzügen. Eine feste Vermögensgrenze nennt das Reglement nicht. Für Personen mit Quellensteuer gilt eine eigene Berechnungsgrundlage.',
    // Reglement Art. 15 Abs. 1: «eingetretene Änderungen umgehend mitzuteilen». Art. 18 Abs. 1: zu
    // Unrecht ausgerichtete Leistungen «fordert die Sozialversicherungsstelle Uri von den
    // Versicherern zurück». Art. 3 Abs. 3: Im Todesfall erlischt der Anspruch mit dem folgenden
    // Monat; «Auf eine Rückforderung bereits ausbezahlter Prämienverbilligungen … wird verzichtet.»
    'Änderungen melden Sie der SVS Uri umgehend. Zu Unrecht ausbezahlte Beträge fordert sie bei der Krankenkasse zurück. Nach einem Todesfall endet der Anspruch mit dem folgenden Monat, schon Ausbezahltes wird dann nicht zurückverlangt.',
  ],
  quellen: [
    { text: 'Sozialversicherungsstelle Uri: Prämienverbilligung (IPV)', url: 'https://www.svsuri.ch/dienstleistungen/pr%C3%A4mienverbilligung-ipv' },
    { text: 'Sozialversicherungsstelle Uri: Antrag auf Prämienverbilligung oder Neuberechnung (PDF)', url: 'https://www.svsuri.ch/uploads/PDF-Formulare-Merkbl%C3%A4tter/IPV-OKP/SVS.Uri_Antrag.Praemienverbilligung.2026.pdf' },
    // Rechtsbuch UR ist eine Web-App (jede /app/-Adresse 200, auch 20.2299); Bestand über die API
    // belegt, …/api/de/texts_of_law/20.2299/show_as_json → 404. Die Nummer RB 20.2213 steht nicht im
    // sichtbaren Titel, weil der Test jede Zahl mit vier Ziffern verbietet («2213»).
    { text: 'Reglement über die Prämienverbilligung für die Krankenpflege-Grundversicherung (Prämienverbilligungsreglement, Rechtsbuch Uri)', url: 'https://rechtsbuch.ur.ch/app/de/texts_of_law/20.2213' },
    KVG65,
  ],
};
