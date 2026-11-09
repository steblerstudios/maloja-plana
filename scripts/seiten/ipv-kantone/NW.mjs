// Prämienverbilligung · Kanton NW. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Alle Quellen neu abgerufen am
// 09.11.2026, jede mit Gegenprobe (erfundene Adresse → 404):
//   Merkblatt «Prämienverbilligung 2026 im Kanton Nidwalden», Ausgleichskasse Nidwalden,
//   «im Februar 2026» (PDF 200; …-2099.pdf → 404).
//   kKVG NG 742.1 und Verordnung NG 742.111 über die API der Gesetzessammlung
//   (…/742.1/show_as_json 200, …/742.111/show_as_json 200; …/742.199/… → 404).
//   Seite der Ausgleichskasse (…/praemienverbilligung-ipv 200; …-ipvxyz → 404).
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Nidwalden',
  slug: 'nidwalden',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // kKVG Art. 22 Abs. 1: «Personen, die Prämienverbilligung beanspruchen, haben bis zum …
    // ein Gesuch einzureichen.» Merkblatt: «Steuerpflichtige, welche aufgrund der Steuerwerte …
    // mutmasslich einen Anspruch … haben, erhalten von der Ausgleichskasse Nidwalden … ein
    // Anmeldeformular zugestellt.» kKVG Art. 21 Abs. 1 (Meldung an mutmasslich Berechtigte).
    'Im Kanton Nidwalden gibt es die Prämienverbilligung nur mit einer Anmeldung bei der Ausgleichskasse. Wer nach den Steuerwerten wahrscheinlich Anspruch hat, bekommt das Formular zugeschickt.',
    // kKVG Art. 21 Abs. 2: «Aus der Zustellung oder der Unterlassung der Meldung entstehen keine
    // Rechtsansprüche.» Merkblatt: «Wer … kein Anmeldeformular erhalten hat, aber einen Anspruch
    // geltend machen will, kann das Formular bei der Ausgleichskasse Nidwalden beziehen oder direkt
    // im Internet herunterladen … bzw. … eine Online-Anmeldung machen.»
    'Ein zugestelltes Formular ist noch kein Entscheid, und ohne Formular sind Sie nicht ausgeschlossen. Sie können es bei der Ausgleichskasse beziehen, herunterladen oder sich online anmelden.',
    // Merkblatt «Wer muss keine Anmeldung ausfüllen? Einzig Rentner und Rentnerinnen, die am
    // 1.1. … Ergänzungsleistungen zur AHV / IV erhalten haben, müssen keine Anmeldung ausfüllen.»
    'Keine Anmeldung brauchen nur Personen, die zu Jahresbeginn Ergänzungsleistungen zur AHV oder IV beziehen.',
  ],
  // kKVG Art. 22 Abs. 2–5 (je eigene Frist ab Einreise, Geburt, Entscheid bzw. Mitteilung);
  // Merkblatt («Personen, die aus dem Ausland zuziehen, haben die Anmeldung innert 3 Monaten seit
  // der Einreise einzureichen. Anträge für Neugeborene können innert 3 Monaten nach der Geburt
  // nachgereicht werden.»). Zahl bewusst weggelassen (Regel: keine Fristen).
  selbst: {
    einleitung: 'Für einige Fälle gilt eine eigene, kürzere Frist, die erst mit dem Ereignis beginnt:',
    punkte: [
      'Sie ziehen aus dem Ausland in den Kanton Nidwalden.',
      'Ein Kind kommt zur Welt.',
      'Sie beziehen im Lauf des Jahres neu wirtschaftliche Sozialhilfe, oder Sie hätten ohne Prämienverbilligung neu Anspruch darauf.',
    ],
    // kKVG Art. 22 Abs. 6: «Der Anspruch auf Prämienverbilligung verwirkt, wenn das Gesuch nicht
    // rechtzeitig eingereicht wird.»
    schluss: 'Auch hier verfällt der Anspruch, wenn die Frist verpasst wird.',
  },
  // kKVG Art. 22 Abs. 1 und 6 («verwirkt»); Merkblatt «Später eingereichte Gesuche werden nicht
  // mehr berücksichtigt.»; Art. 22 Abs. 7: Erstreckung «aus wichtigen Gründen … auf schriftlich
  // begründeten Antrag hin».
  fristSatz: 'Für die Anmeldung gilt eine feste Frist im Frühjahr. Sie steht im Gesetz, im Merkblatt und auf dem Formular. Wer sie verpasst, verliert den Anspruch für das ganze Jahr. Nur aus wichtigen Gründen und auf schriftlichen, begründeten Antrag kann die Ausgleichskasse die Frist verlängern.',
  stelle: 'Ausgleichskasse Nidwalden, Abteilung Prämienverbilligung',
  // kKVG Art. 23 Abs. 1, Art. 24 Abs. 1 («eröffnet ihren Entscheid in Form einer Verfügung»),
  // Art. 25 Abs. 1 (Auszahlung an den Versicherer); Merkblatt «Auch die Nidwaldner
  // Gemeindeverwaltungen helfen beim Ausfüllen.»
  stelleSatz: 'Die Ausgleichskasse prüft die Anmeldungen, entscheidet mit einer Verfügung und zahlt den Beitrag an die Krankenkasse aus. Beim Ausfüllen helfen auch die Gemeindeverwaltungen.',
  amtsseite: 'Seite der Ausgleichskasse Nidwalden zur Prämienverbilligung',
  besonders: [
    // kKVG Art. 12 Abs. 2 («Summe aus … dem gesamten Reineinkommen … und 6. dem jährlich
    // festgelegten Prozentsatz des gesamten Reinvermögens»); Merkblatt («Dieser Betrag wird als
    // Summe der Steuerwerte bezeichnet.»).
    'Nidwalden rechnet mit der «Summe der Steuerwerte»: dem Reineinkommen aus der Steuerveranlagung, einigen Aufrechnungen und einem Anteil des gesamten Reinvermögens.',
    // kKVG Art. 14 Abs. 1 (Kinder, Grenze bei den Steuerwerten der Eltern), Art. 15 Abs. 1 und 3
    // (junge Erwachsene in Ausbildung «zur Hälfte»; Berechtigung entfällt über dem Höchstbetrag der
    // vollen AHV-Altersrente); Merkblatt «Welche Personen werden speziell unterstützt?».
    'Für Kinder und für junge Erwachsene in Ausbildung gibt es einen besonderen Beitrag, solange die Steuerwerte unter einer festen Grenze bleiben. Bei jungen Erwachsenen entfällt er, wenn ihr eigenes Reineinkommen zu hoch ist.',
    // Merkblatt: Steuerperiode «2024, bei Neuzugezogenen und 19-jährigen die Periode 2025»;
    // kKVG Art. 17 Abs. 1 (Verhältnisse am 1. Januar), Abs. 2 («Geburten und Todesfälle werden bis
    // Ende Kalenderjahr berücksichtigt.»).
    'Massgebend sind Ihre Verhältnisse am Jahresanfang. Geburten und Todesfälle werden aber bis Ende Jahr berücksichtigt.',
    // kKVG Art. 20 Abs. 1 (Quellenbesteuerte: Anteil des der Quellensteuer zugrundeliegenden
    // Einkommens); NG 742.111 § 4.
    'Bei Personen mit Quellensteuer zählt ein fester Anteil des Einkommens, auf dem die Quellensteuer erhoben wird.',
    // kKVG Art. 28 Abs. 1: «Zu Unrecht ausgerichtete Leistungen sind von der Ausgleichskasse bei
    // den Personen, welche sie bezogen haben, zurückzufordern.»
    'Wurde zu viel ausbezahlt, fordert die Ausgleichskasse den Betrag von Ihnen zurück.',
  ],
  quellen: [
    { text: 'Ausgleichskasse Nidwalden: Merkblatt Prämienverbilligung (PDF)', url: 'https://www.aknw.ch/uploads/PDF-Formulare-Merkbl%C3%A4tter/IPV-OKP-KVGRegress/Merkblatt-Praemienverbilligung-2026.pdf' },
    // Gesetzessammlung NW ist eine Web-App (die /app/-Seite ist eine Hülle); Bestand über die
    // API belegt, 742.199 → 404.
    { text: 'Einführungsgesetz zum Bundesgesetz über die Krankenversicherung (kKVG, NG 742.1)', url: 'https://gesetze.nw.ch/app/de/texts_of_law/742.1' },
    { text: 'Verordnung zur Prämienverbilligung des Kantons Nidwalden (NG 742.111)', url: 'https://gesetze.nw.ch/app/de/texts_of_law/742.111' },
    KVG65,
  ],
};
