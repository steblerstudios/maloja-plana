// Prämienverbilligung · Kanton SH. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Alle Quellen neu abgerufen am
// 09.11.2026: SVA «Merkblatt zum Anmeldeformular für die individuelle Prämienverbilligung 2026»
// (zul01-merkblatt.pdf) · svash.ch/ipv/ (Anmeldung, Anspruch, Fragen & Antworten) · Dekret über den
// Vollzug des Krankenversicherungsgesetzes (SHR 832.110, Version 1927, in Kraft seit 01.01.2025) ·
// Verordnung dazu (SHR 832.111, Version 2086, in Kraft seit 01.08.2026, mit Anhang 1).
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Schaffhausen',
  slug: 'schaffhausen',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // Dekret § 14 Abs. 1bis (Schwellenwert, «dass alle, die einen möglichen Anspruch … haben, ein
    // Antragsformular zugestellt erhalten»); VO § 11: Antragsformular an Personen, die «aufgrund
    // der Steuerdaten als mutmasslich beitragsberechtigt erkannt werden»; svash.ch/ipv/anmeldung:
    // «Jeweils Ende Januar findet ein Versand von Antragsformularen … statt»; VO § A1-3 (Fristen
    // je Jahr).
    'Im Kanton Schaffhausen gibt es die Prämienverbilligung nur auf Antrag, und zwar jedes Jahr neu. Die SVA Schaffhausen schickt Personen, die nach den Steuerdaten in Frage kommen, zu Jahresbeginn ein Antragsformular.',
    // Dekret § 14 Abs. 3: «Werden die … erforderlichen Angaben durch die Versicherten nicht innert
    // der angesetzten Frist eingereicht, so ist der Anspruch verwirkt.» Merkblatt: «Mit Ihrer
    // Unterschrift bestätigen Sie alle Angaben.»
    'Das Formular allein bringt noch kein Geld. Sie füllen es aus, unterschreiben es und schicken es der SVA zurück.',
    // Dekret § 15 Abs. 1: wer nicht berücksichtigt wurde, «muss bei der AHV-Ausgleichskasse ein
    // Antragsformular einfordern»; svash.ch/ipv/anmeldung: «wird das Formular ca. Mitte Februar
    // aufgeschaltet».
    'Haben Sie kein Formular bekommen und vermuten trotzdem einen Anspruch, fordern Sie eines bei der SVA an. Einige Wochen nach dem Versand stellt die SVA das Formular auch online bereit.',
    // VO § 20 Abs. 1: «An Personen, die Ergänzungsleistungen beziehen, werden keine Antragsformulare
    // verschickt. Die AHV-Ausgleichskasse orientiert die betroffenen Personen.» svash.ch Fragen &
    // Antworten: «müssen keinen Antrag auf Prämienverbilligung stellen».
    'Wer Ergänzungsleistungen bezieht, bekommt kein Formular und muss keinen Antrag stellen. Die SVA informiert diese Personen direkt.',
  ],
  // Dekret § 15 Abs. 1; VO § 22 Abs. 1 (Quellensteuer: «Personen, die kein Antragsformular erhalten
  // haben, können ein solches bei der AHV-Ausgleichskasse beziehen»); svash.ch/ipv/anspruch: «Für
  // Grenzgängerinnen und Grenzgänger gelten besondere Bestimmungen»; Dekret § 9 Abs. 2.
  selbst: {
    einleitung: 'Kein Formular bekommen Sie zum Beispiel in diesen Fällen. Dann fordern Sie es selbst bei der SVA an:',
    punkte: [
      'Sie wurden nach den vorhandenen Steuerdaten nicht als mögliche Bezügerin oder möglicher Bezüger erkannt.',
      'Sie werden an der Quelle besteuert und haben, anders als die meisten in dieser Lage, kein Formular erhalten.',
      'Sie arbeiten als Grenzgängerin oder Grenzgänger im Kanton. Für Sie gelten besondere Regeln.',
      // Dekret § 9 Abs. 2: «Kinder und Jugendliche bis zum vollendeten 20. Altersjahr haben in der
      // Regel einen gemeinschaftlichen Anspruch mit den Eltern. In begründeten Fällen, insbesondere
      // bei nachgewiesener wirtschaftlicher Unabhängigkeit … kann ab dem vollendeten 18. Altersjahr
      // ein eigener Anspruch geltend gemacht werden.»
      'Sie sind volljährig, aber noch keine 20, wirtschaftlich von Ihren Eltern unabhängig und möchten einen eigenen Anspruch geltend machen. Sonst zählen Sie in der Regel zum Antrag der Eltern.',
    ],
    schluss: 'Auch dafür gilt die Antragsfrist.',
  },
  // Dekret § 15 Abs. 3: «Wird innerhalb der gesetzten Frist kein Antrag eingereicht, ist der
  // Anspruch auf Prämienverbilligung verwirkt.» VO § 15 Abs. 2 und § A1-3 lit. c («letzte Nachfrist
  // bei wichtigen Gründen»). Merkblatt: «innert 20 Tagen dem SVA Schaffhausen einzureichen».
  fristSatz: 'Für den Antrag gilt eine feste Frist. Wird sie verpasst, verfällt der Anspruch für dieses Jahr. Bei wichtigen Gründen kann die SVA eine Nachfrist gewähren. Wer ein Formular bekommen hat, schickt es laut Merkblatt zudem rasch nach Erhalt zurück. Die Daten stehen im Merkblatt und in der Verordnung.',
  stelle: 'SVA Schaffhausen',
  // Dekret § 8 Abs. 1 («Die AHV-Ausgleichskasse des Kantons Schaffhausen führt die
  // Prämienverbilligung … durch»), § 16 Abs. 1 (Entscheid mit Verfügung), § 17 Abs. 1 (Überweisung
  // an die Versicherer); VO § 3 Abs. 1 lit. d (Gemeinde: Mitwirkung bei unvollständigen Anträgen).
  stelleSatz: 'Die SVA Schaffhausen führt als kantonale AHV-Ausgleichskasse die Prämienverbilligung durch. Sie entscheidet über die Anträge und überweist die Beiträge an Ihre Krankenkasse. Bei unvollständigen Anträgen hilft die Gemeinde mit.',
  amtsseite: 'Seite der SVA Schaffhausen zur Prämienverbilligung',
  besonders: [
    // Dekret § 12 Abs. 2–4: «definitiven Steuerwerte für das zweite dem Zahlungsjahr vorangehende
    // Jahr», sonst provisorische Werte, später «von Amtes wegen Rückforderungen bzw. Nachzahlungen»;
    // VO § 13 Abs. 2; svash.ch Fragen & Antworten.
    'Massgebend sind die definitiven Steuerwerte des vorletzten Jahres. Fehlen sie, rechnet die SVA mit provisorischen Werten und korrigiert später von Amtes wegen, also ohne Ihr Zutun. Das kann eine Nachzahlung oder eine Rückforderung auslösen.',
    // VO § 14 Abs. 1: kein Anspruch, wer «drei Monate nach Ablauf der ordentlichen Frist ohne
    // bewilligte Fristverlängerung keine Steuererklärung eingereicht» hat, obwohl verpflichtet.
    'Wer zur Steuererklärung verpflichtet war und sie ohne Fristverlängerung deutlich zu spät oder gar nicht eingereicht hat, hat keinen Anspruch.',
    // Dekret § 9 Abs. 3 (Verhältnisse am 1. Januar); Merkblatt: «Kinder, die nach dem 1. Januar …
    // zur Welt gekommen sind, dürfen nicht aufgeführt werden.»
    'Es zählen die Verhältnisse am 1. Januar. Kinder, die später im Jahr geboren werden, gehören nicht auf das Formular dieses Jahres.',
    // Merkblatt: «Kinder getrenntlebender Eltern können auf dem Antrag des Elternteils aufgeführt
    // werden, welcher das Kind in seiner Steuererklärung aufführt.»
    'Leben die Eltern getrennt, steht das Kind auf dem Antrag des Elternteils, der es in der Steuererklärung aufführt.',
    // Dekret § 13bis (Mindestanspruch nach Art. 65 Abs. 1bis KVG, Erhöhung wenn nötig); Merkblatt:
    // Ausbildungsnachweis für junge Erwachsene in Ausbildung «am 1. Januar des Antragsjahres».
    'Für Kinder und junge Erwachsene in Ausbildung gilt ein Mindestanteil nach Bundesrecht. Dafür kann die Verbilligung innerhalb der Familie umverteilt oder erhöht werden. Junge Erwachsene, die am 1. Januar in Ausbildung sind, legen dem Formular einen Ausbildungsnachweis bei.',
    // VO § 21 Abs. 1: bei Quellensteuer ein Anteil «des der Quellensteuer zugrundeliegenden
    // Einkommens zuzüglich» eines Anteils «des steuerpflichtigen Vermögens».
    'Bei Quellensteuer rechnet die SVA nicht mit dem Reineinkommen, sondern mit einem festen Anteil des quellenbesteuerten Einkommens und des Vermögens.',
    // VO § 20 Abs. 3: wer die EL verliert, «wird von Amtes wegen eine Neuberechnung der
    // Prämienverbilligung vorgenommen».
    'Fallen Ihre Ergänzungsleistungen während des Jahres weg, rechnet die SVA die Prämienverbilligung von Amtes wegen neu.',
    // VO § 12 Abs. 1 (Ansprüche durch die Organe der Sozialhilfe geltend gemacht; Betroffene «vor
    // Ablauf der ordentlichen Frist … schriftlich zu informieren»); Dekret § 19.
    'Bei Personen mit Sozialhilfe kann die Sozialhilfe den Anspruch direkt geltend machen. Sie informiert die Betroffenen vor Ablauf der Frist schriftlich.',
    // Dekret § 17 Abs. 2 (Beiträge über der Prämie zurückzuerstatten), Merkblatt («so geht der
    // Überschuss an das SVA Schaffhausen zurück»); Dekret § 23 Abs. 1 (Rückforderung).
    'Ist die Verbilligung höher als Ihre tatsächliche Prämie, geht der Überschuss an die SVA zurück. Zu Unrecht bezogene Beiträge fordert die SVA zurück.',
  ],
  quellen: [
    { text: 'SVA Schaffhausen: Merkblatt zum Anmeldeformular für die Prämienverbilligung (PDF)', url: 'https://svash.ch/wp-content/uploads/zul01-merkblatt.pdf' },
    { text: 'SVA Schaffhausen: Prämienverbilligung, Fragen und Antworten', url: 'https://www.svash.ch/ipv/fragen-antworten/' },
    // Rechtsbuch SH ist eine Web-App (jede Adresse 200); Bestand über die API belegt:
    // api/de/texts_of_law/832.110 und 832.111 → 200, 832.199 → 404 (gemessen 09.11.2026).
    { text: 'Dekret über den Vollzug des Krankenversicherungsgesetzes (SHR 832.110)', url: 'https://rechtsbuch.sh.ch/app/de/texts_of_law/832.110' },
    { text: 'Verordnung über den Vollzug des Krankenversicherungsgesetzes (SHR 832.111)', url: 'https://rechtsbuch.sh.ch/app/de/texts_of_law/832.111' },
    KVG65,
  ],
};
