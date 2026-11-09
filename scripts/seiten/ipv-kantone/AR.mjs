// Prämienverbilligung · Kanton AR. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Alle Quellen neu abgerufen am
// 09.11.2026: SOVAR «Merkblatt über die Verbilligung der Prämien … im Jahr 2026» · SOVAR-Seite
// Prämienverbilligung (IPV) · Medienmitteilung des Regierungsrats vom 12.12.2025 · EG zum KVG
// (bGS 833.14, Version 1156, in Kraft seit 01.01.2017) · V zum KVG (bGS 833.141, Version 1167,
// in Kraft seit 01.01.2017). Beide Erlasse ohne künftige Fassung (API, 09.11.2026).
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Appenzell Ausserrhoden',
  slug: 'appenzell-ausserrhoden',
  // «Prämienverbilligung im Kanton Appenzell Ausserrhoden — Maloja Plana» hätte 67 Zeichen.
  titel: 'Prämienverbilligung in Appenzell Ausserrhoden',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // EG zum KVG Art. 22 Abs. 1 (Gesuche innert Frist), Abs. 2 (Verwirkung «für das Bezugsjahr»);
    // Medienmitteilung 12.12.2025: «Personen, die mutmasslich Anspruch auf eine
    // Prämienverbilligung haben, werden von den Sozialversicherungen Appenzell Ausserrhoden
    // angeschrieben. Ein Antrag … ist bis spätestens … möglich.»
    'In Appenzell Ausserrhoden gibt es die Prämienverbilligung nur auf Antrag, und zwar jedes Jahr neu. Wer voraussichtlich Anspruch hat, wird von den Sozialversicherungen Appenzell Ausserrhoden (SOVAR) angeschrieben.',
    // V zum KVG Art. 10 Abs. 1: «reichen ihren Antrag … bei der AHV-Gemeindezweigstelle der
    // Gemeinde ein, in welcher sie am 1. Januar des Jahres Wohnsitz hatten.»
    'Den Antrag reichen Sie bei der AHV-Zweigstelle der Gemeinde ein, in der Sie am 1. Januar gewohnt haben.',
    // Merkblatt «Sonderfälle»: «Bei Bezügern von Ergänzungsleistungen erfolgt die Vergütung der
    // Prämie … durch die Ergänzungsleistungen direkt an den Krankenversicherer (Art. 21a ELG) ohne
    // zusätzliche Antragsstellung.»
    'Wer Ergänzungsleistungen bezieht, muss keinen Antrag stellen. Die Prämie wird über die Ergänzungsleistungen direkt der Krankenkasse bezahlt.',
    // EG zum KVG Art. 15 Abs. 1 («Anspruch auf vollständige Prämienverbilligung in der Höhe seiner
    // Grundversicherung, jedoch höchstens auf die ganze Richtprämie»), Abs. 2 («Die Gemeinde kann
    // den Anspruch im Namen der Bezügerinnen und Bezüger … geltend machen.»).
    'Wer wirtschaftliche Sozialhilfe bezieht, hat Anspruch auf eine volle Verbilligung, höchstens bis zur Richtprämie. Den Anspruch kann die Gemeinde für Sie geltend machen.',
  ],
  // Medienmitteilung 12.12.2025 (angeschrieben werden nur mutmasslich Berechtigte); SOVAR-Seite
  // «Zuzug aus dem Ausland … ab dem Monat Anspruch …, in dem sie ihren Antrag im laufenden
  // Antragsjahr eingereicht haben (Verordnung zum KVG, Art. 6 Abs. 1 lit. b)» mit eigenem
  // Formular «Prämienverbilligung bei Zuzug aus dem Ausland».
  selbst: {
    einleitung: 'Angeschrieben wird nur, wer nach den Steuerdaten mutmasslich Anspruch hat. Selbst aktiv werden müssen Sie zum Beispiel in diesen Fällen:',
    punkte: [
      'Sie haben kein Schreiben der SOVAR erhalten, vermuten aber einen Anspruch.',
      'Sie sind aus dem Ausland zugezogen. Dafür gibt es ein eigenes Antragsformular der SOVAR. Der Anspruch beginnt mit dem Monat, in dem Sie den Antrag einreichen.',
    ],
    // Merkblatt «Weitere Informationen»: «Die Wohngemeinde erteilt Ihnen gerne weitere Auskünfte.»
    schluss: 'Im Zweifel gibt Ihre Wohngemeinde Auskunft.',
  },
  // Merkblatt «Frist für Antragsstellung»: «Der Anspruch auf Prämienverbilligung verwirkt für das
  // Bezugsjahr, wenn das Gesuch nach Ablauf der Frist gestellt wird oder die … erforderlichen
  // Angaben und Unterlagen nicht fristgerecht eingereicht werden.» EG zum KVG Art. 22; V zum KVG
  // Art. 10 Abs. 2 (Verlängerung in Härtefällen), Art. 12 Abs. 2–3 (Frist und Nachfrist für Angaben).
  fristSatz: 'Für den Antrag gilt eine feste Frist in den ersten Monaten des Jahres. Wer sie verpasst oder verlangte Unterlagen nicht rechtzeitig nachreicht, verliert den Anspruch für das ganze Jahr. In Härtefällen kann die SOVAR die Frist verlängern. Die Daten stehen im Merkblatt der SOVAR.',
  stelle: 'AHV-Zweigstelle Ihrer Wohngemeinde',
  // V zum KVG Art. 11 (Vorprüfung durch die AHV-Gemeindezweigstelle, Weiterleitung an die
  // Ausgleichskasse); EG zum KVG Art. 6 Abs. 1 lit. b (Ausgleichskasse vollzieht die
  // Prämienverbilligung); Merkblatt «Auszahlung»: «direkt an den entsprechenden Krankenversicherer».
  stelleSatz: 'Die Zweigstelle prüft, ob der Antrag vollständig ist, und leitet ihn an die SOVAR weiter. Die SOVAR ist die kantonale Ausgleichskasse. Sie berechnet den Anspruch und zahlt ihn direkt an Ihre Krankenkasse.',
  amtsseite: 'Seite des Kantons zu den Sozialversicherungen Appenzell Ausserrhoden',
  besonders: [
    // EG zum KVG Art. 12 und Art. 16 Abs. 1 lit. d; Merkblatt «Obergrenzen der Bezugsberechtigung»:
    // «Wird eine (oder beide) dieser Obergrenzen überschritten, besteht kein Anspruch».
    'Ausserrhoden setzt feste Obergrenzen für das Einkommen und für das steuerbare Vermögen. Wird eine davon überschritten, gibt es keine Verbilligung. Die Grenzen hängen von der Haushaltsform ab und stehen im Merkblatt.',
    // Merkblatt: «Das massgebende Einkommen entspricht dem steuerbaren Einkommen nach der letzten
    // rechtskräftigen Steuerveranlagung, korrigiert um …» (Vermögensanteil, Liegenschaftsaufwand,
    // Säule 3a, Einkaufsbeiträge, Vorjahresverluste …); V zum KVG Art. 5.
    'Grundlage ist die letzte rechtskräftige Steuerveranlagung. Dazu gerechnet werden unter anderem ein Teil des Vermögens, Einkäufe in die Pensionskasse und bestimmte Beiträge an die Säule 3a.',
    // EG zum KVG Art. 17 Abs. 1–2; Merkblatt: «Das Vorliegen einer Ausbildung wird vermutet, wenn für
    // die junge erwachsene Person eine Ausbildungszulage … ausbezahlt wird.»
    'Wer gemeinsam besteuert wird, hat einen gemeinsamen Anspruch. Kinder und junge Erwachsene in Ausbildung zählen zum Anspruch der Eltern. Als in Ausbildung gilt in der Regel, für wen eine Ausbildungszulage bezahlt wird.',
    // EG zum KVG Art. 20 Abs. 1: weicht das massgebende Einkommen stark ab, «kann innert sechs
    // Monaten nach Rechtskraft der ausserrhodischen Steuerveranlagung ein Antrag auf Nachvergütung
    // gestellt oder von Amtes wegen eine Rückvergütung eingeleitet werden»; Abs. 2: Neuberechnung
    // «auf Antrag … bei Änderung des Personenstandes».
    'Weicht die spätere Steuerveranlagung stark vom Einkommen ab, mit dem gerechnet wurde, können Sie eine Nachvergütung beantragen. Umgekehrt kann die SOVAR von Amtes wegen, also ohne Ihr Zutun, zu viel Bezahltes zurückverlangen. Für den Antrag gilt eine Frist ab der rechtskräftigen Veranlagung.',
    'Ändert sich Ihr Personenstand, etwa durch Heirat oder Scheidung, rechnet die SOVAR auf Ihren Antrag neu.',
    // EG zum KVG Art. 21 Abs. 1 (Rückerstattung); V zum KVG Art. 9 (Auskunftspflicht).
    'Eine zu Unrecht bezogene Verbilligung müssen Sie der SOVAR zurückzahlen.',
    // EG zum KVG Art. 16 Abs. 2 (Verhältnisse am 1. Januar); V zum KVG Art. 6 Abs. 1 lit. a
    // («mit dem der Geburt folgenden Monat»), Abs. 2 (Ende bei Wegzug ins Ausland und bei Tod).
    'Massgebend sind die Verhältnisse am 1. Januar. Für ein Neugeborenes beginnt der Anspruch im Monat nach der Geburt.',
    // V zum KVG Art. 7 Abs. 1 (höchstens die Prämie «mit der ordentlichen Franchise und mit
    // Unfalldeckung»), Art. 13 Abs. 1 (Kleinstbeträge werden nicht ausbezahlt).
    'Die Verbilligung ist höchstens so hoch wie die Prämie mit der ordentlichen Franchise und mit Unfalldeckung. Sehr kleine Beträge werden nicht ausbezahlt.',
  ],
  quellen: [
    { text: 'Sozialversicherungen Appenzell Ausserrhoden: Merkblatt zur Prämienverbilligung (PDF)', url: 'https://www.sovar.ch/uploads/SOVAR/Formulare/AK/Beitraege/Merkblatt-IPV-2026.pdf' },
    { text: 'Sozialversicherungen Appenzell Ausserrhoden: Prämienverbilligung (IPV)', url: 'https://www.sovar.ch/dienstleistungen/pr%C3%A4mienverbilligung-ipv' },
    { text: 'Kanton Appenzell Ausserrhoden: Medienmitteilung des Regierungsrats zur Festlegung der Prämienverbilligung', url: 'https://ar.ch/schnellzugriff/medienmitteilungen-der-kantonalen-verwaltung/detail/news/regierungsrat-legt-individuelle-praemienverbilligung-2026-fest/' },
    // ar.clex.ch ist eine Web-App (jede Adresse 200); Bestand über die API belegt:
    // api/de/texts_of_law/833.14 und 833.141 → 200, 833.199 → 404 (gemessen 09.11.2026).
    { text: 'Gesetz über die Einführung des Bundesgesetzes über die Krankenversicherung (EG zum KVG, bGS 833.14)', url: 'https://ar.clex.ch/app/de/texts_of_law/833.14' },
    { text: 'Verordnung zum EG zum KVG (V zum KVG, bGS 833.141)', url: 'https://ar.clex.ch/app/de/texts_of_law/833.141' },
    KVG65,
  ],
};
