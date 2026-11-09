// Prämienverbilligung · Kanton SZ. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Alle Quellen am 09.11.2026 neu
// abgerufen: EGzKVG (SRSZ 361.100, Stand SRSZ 1.2.2026; sz.ch/…/6155/361_100.pdf → 200;
// …/361_199.pdf → 404) · VVzEGzKVG (SRSZ 361.111, Stand SRSZ 1.2.2026; …/6017/361_111.pdf → 200;
// …/361_119.pdf → 404) · SVA-Seite «Prämienverbilligung (IPV)» (sva-sz.ch/… → 200; …-ipvxyz →
// 404) · SVA-Merkblatt «Prämienverbilligung 2027 im Kanton Schwyz» (PDF → 200; …-2099.pdf → 404) ·
// SVA «Zusatzblatt für Antragsteller, welche an der Quelle besteuert werden» 2027 (PDF → 200).
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Schwyz',
  slug: 'schwyz',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // EGzKVG § 17 Abs. 1: «Wer Prämienverbilligung beansprucht, hat bei der Durchführungsstelle
    // spätestens bis Ende des Anspruchsjahres ein Gesuch einzureichen.» § 16 Abs. 1:
    // Durchführungsstelle ist die Sozialversicherungsanstalt Schwyz.
    'Im Kanton Schwyz gibt es die Prämienverbilligung nur auf Anmeldung bei der SVA Schwyz.',
    // EGzKVG § 17 Abs. 4: Vorjahresbezüger «gelten von Amtes wegen für das Anspruchsjahr als
    // angemeldet. Sie erhalten … eine Anmeldebestätigung.» Merkblatt S. 4: «Allfällige Abweichungen
    // bzw. Änderungen gegenüber der Anmeldebestätigung, sind der SVA Schwyz schriftlich zu melden.»
    'Wer im Vorjahr Prämienverbilligung erhalten hat, gilt automatisch als angemeldet und bekommt eine Anmeldebestätigung. Stimmt darauf etwas nicht mehr, melden Sie das der SVA schriftlich.',
    // VVzEGzKVG § 12 Abs. 1: Die SVA «stellt den mutmasslich berechtigten Personen, die im Vorjahr …
    // keine Prämienverbilligung erhalten haben, ein Anmeldeformular zu.» Merkblatt S. 4: «auf Grund
    // der bekannten Steuerdaten».
    'Wer im Vorjahr keine hatte, nach den bekannten Steuerdaten aber in Frage kommt, bekommt das Anmeldeformular zugestellt. Die Anmeldung geht auch online.',
    // VVzEGzKVG § 6 Abs. 1: «Während des Bezuges von Ergänzungsleistungen zur AHV/IV wird die
    // Prämienverbilligung von Amtes wegen ausgerichtet.» Merkblatt S. 4: EL-Beziehende «müssen keine
    // Anmeldung ausfüllen». EGzKVG § 17a Abs. 1 lit. a: Die Fürsorgebehörde ist berechtigt, «auch
    // ohne Zustimmung der versicherten Person ein Gesuch … einzureichen» für Sozialhilfeempfänger.
    // Prüfbefund 09.11.: § 17a Abs. 1 «ist berechtigt» = kann, muss nicht → Klärung empfehlen.
    'Wer Ergänzungsleistungen bezieht, muss sich nicht anmelden. Für Personen mit Sozialhilfe kann die Fürsorgebehörde das Gesuch einreichen. Klären Sie mit ihr, ob sie das tut; sonst melden Sie sich selbst an.',
  ],
  // VVzEGzKVG § 12 Abs. 2: «Weitere Personen, welche kein Anmeldeformular erhalten haben … beziehen
  // das Anmeldeformular bei der AHV-Zweigstelle ihrer Wohngemeinde oder bei der
  // Sozialversicherungsanstalt Schwyz.» Zusatzblatt Quellensteuer: «Zusatzblatt muss mit dem
  // Anmeldeformular eingereicht werden.» Merkblatt S. 8: «Ist die letzte definitive
  // Steuerveranlagung mehr als drei Jahre alt, hat sich Ihr Zivilstand verändert oder sind Sie neu in
  // den Kanton Schwyz zugezogen, werden die Einkommen des laufenden Jahres … berücksichtigt.»
  // VVzEGzKVG § 9 Abs. 1a: bei Ermessensveranlagung ist «die vollständig ausgefüllte … Steuererklärung
  // einzureichen». 🛑 Dass diese Gruppen KEIN Formular bekommen, sagt keine Quelle wörtlich —
  // abgeleitet aus «auf Grund der bekannten Steuerdaten»; darum «vor allem», nicht abschliessend.
  selbst: {
    einleitung: 'Ob Ihnen ein Formular zugestellt wird, hängt an den Steuerdaten, die der SVA vorliegen. Selbst handeln sollten Sie vor allem in diesen Fällen:',
    punkte: [
      'Sie haben kein Formular erhalten, vermuten aber einen Anspruch. Das Formular gibt es bei der AHV-Zweigstelle Ihrer Gemeinde, bei der SVA Schwyz oder online.',
      'Sie werden an der Quelle besteuert. Dann reichen Sie zum Formular ein Zusatzblatt ein.',
      // Prüfbefund 09.11.: Merkblatt 2027 nennt «die Einkommen des laufenden Jahres 2026» — also des
      // Jahres vor dem Anspruchsjahr, nicht des Anspruchsjahres.
      'Sie sind neu in den Kanton gezogen, Ihr Zivilstand hat sich geändert, oder Ihre letzte definitive Steuerveranlagung ist älter als drei Jahre. Dann rechnet die SVA mit Ihrem Einkommen des Jahres vor dem Anspruchsjahr.',
      'Ihre letzte Steuerveranlagung ist eine Ermessensveranlagung. Dann verlangt die SVA für dieses Jahr die vollständige Steuererklärung.',
    ],
    // Prüfbefund 09.11. (Rechtsprüfung: Wertung ohne Beleg) → der SVA zugeschrieben. Merkblatt S. 14:
    // «Bei Unklarheiten über den Anspruch geben die Mitarbeiterinnen und Mitarbeiter der SVA Schwyz
    // gerne Auskunft.»
    schluss: 'Bei Unklarheiten über den Anspruch gibt die SVA Schwyz Auskunft.',
  },
  // EGzKVG § 17 Abs. 1 (Frist im Gesetz) und Abs. 2: «Ansprüche, die nach Ablauf der Frist geltend
  // gemacht werden, sind verwirkt.» SVA-Seite: «Anmelde- und Verwirkungsfrist». Merkblatt S. 14:
  // «Reichen Sie Ihre Anmeldung möglichst bis im Herbst … ein. … Die Krankenkasse kann dann … die
  // Prämienverbilligung bereits ab Januar … berücksichtigen.»
  // Prüfbefund 09.11. (auch Rechtsprüfung): Herbst-Satz als Empfehlung der SVA. Merkblatt S. 14:
  // «Wir empfehlen: Reichen Sie Ihre Anmeldung möglichst bis im Herbst … ein. … Die Krankenkasse
  // kann dann in diesem Fall die Prämienverbilligung bereits ab Januar … bei Ihren
  // Prämienrechnungen berücksichtigen.» SVA-Seite: «Je nach Anmeldeeingang erhalten Sie die
  // Prämienverbilligung möglicherweise rückwirkend per 1. Januar».
  fristSatz: 'Die Anmeldung muss bis zu einer Frist im Anspruchsjahr eingehen, danach ist der Anspruch verwirkt. Die Frist steht im Gesetz, im Merkblatt und auf der Seite der SVA. Die SVA empfiehlt, sich schon im Herbst des Vorjahres anzumelden; dann kann die Krankenkasse die Verbilligung bereits ab Januar auf der Rechnung abziehen. Eine spätere Anmeldung innerhalb der Frist kann auch rückwirkend wirken.',
  stelle: 'Sozialversicherungsanstalt Schwyz (SVA Schwyz)',
  // EGzKVG § 16 Abs. 1 (SVA = Durchführungsstelle), § 22 (Verfügung), § 18 Abs. 1 (Auszahlung «in der
  // Regel an die Krankenversicherer»).
  stelleSatz: 'Die SVA Schwyz führt die Prämienverbilligung für den Kanton durch. Sie entscheidet mit einer Verfügung und zahlt den Beitrag an die Krankenkasse.',
  amtsseite: 'Seite der SVA Schwyz zur Prämienverbilligung',
  besonders: [
    // Merkblatt S. 6: «Bitte beachten Sie, dass Sie beweispflichtig sind, sollte das
    // Anmeldeformular nicht bei der SVA Schwyz eingehen.» · «Wenn Sie sich via IPVdigital anmelden,
    // erhalten Sie umgehend eine schriftliche Eingangsbestätigung».
    // Prüfbefund 09.11.: Beweis betrifft den Eingang, nicht den Versand. Merkblatt S. 6: «Zudem steht
    // Ihnen offen, für die Zustellung Ihrer Anmeldung eine der beiden bewährten Dienstleistungen der
    // Post zu nutzen: Einschreiben oder A-Post-Plus.» · Bestätigung auf Anfrage bzw. am Schalter.
    'Geht eine Anmeldung nicht bei der SVA ein, müssen Sie belegen, dass sie bei der SVA eingegangen ist, etwa mit Einschreiben, A-Post-Plus oder einer Eingangsbestätigung. Bei der Anmeldung online erhalten Sie sofort eine Eingangsbestätigung per E-Mail.',
    // EGzKVG § 7 Abs. 2 lit. a (Anteil des Reinvermögens nach eigenen Freibeträgen) und § 5 Abs. 1
    // lit. d (Vermögensgrenze «nach Abzug der Vermögensfreibeträge gemäss § 7 Abs. 2 und 3»);
    // § 7 Abs. 1: Grundlage ist das «Reineinkommen gemäss dem Bundesgesetz über die direkte
    // Bundessteuer».
    'Gerechnet wird mit dem Reineinkommen der direkten Bundessteuer. Vom Vermögen zählt ein Anteil dazu, nach eigenen Freibeträgen der Prämienverbilligung. Über einer Vermögensgrenze, ebenfalls nach diesen Freibeträgen, besteht kein Anspruch.',
    // EGzKVG § 11 Abs. 2: Junge Erwachsene in Ausbildung «haben zusammen mit den Eltern … einen
    // Gesamtanspruch, wobei die Einkommen und Vermögen der jungen Erwachsenen nicht berücksichtigt
    // werden.» VVzEGzKVG § 8 Abs. 2: «Beginn und Ende der Ausbildung sind zu belegen.»
    'Junge Erwachsene in Ausbildung werden zusammen mit den Eltern berechnet; ihr eigenes Einkommen und Vermögen zählt dabei nicht. Beginn und Ende der Ausbildung sind zu belegen.',
    // VVzEGzKVG § 11 Abs. 1/2: Geburt → «auf Antrag neu berechnet», Antrag bis in das Folgejahr.
    // VVzEGzKVG § 10 Abs. 1–3: wesentliche Änderungen der wirtschaftlichen Verhältnisse «werden auf
    // Antrag berücksichtigt», Antrag bis in das Folgejahr. ⚠️ Merkblatt S. 8 dagegen: «Änderungen der
    // wirtschaftlichen Verhältnisse nach dem 1. Januar … können erst in den Folgejahren
    // berücksichtigt werden.» Prüfbefund 09.11.: massgebend ist die Verordnung — Merkblatt, «Vorbehalt»:
    // «Für die Beurteilung des Anspruchs im Einzelfall gelten ausschliesslich die gesetzlichen
    // Bestimmungen.»; VVzEGzKVG § 10 Abs. 1: «werden auf Antrag berücksichtigt».
    'Kommt im Anspruchsjahr ein Kind zur Welt, wird auf Antrag ab dem Geburtsmonat neu gerechnet. Auch eine wesentliche Änderung des Einkommens berücksichtigt die SVA laut Verordnung auf Antrag; beide Anträge haben eine Frist im folgenden Jahr. Das Merkblatt beschreibt das enger. Stellen Sie den Antrag trotzdem fristgerecht.',
    // VVzEGzKVG § 6 Abs. 2: «Bei Wegfall von Ergänzungsleistungen während des Anspruchsjahres prüft die
    // Sozialversicherungsanstalt Schwyz von Amtes wegen den Leistungsanspruch für den Rest des
    // Anspruchsjahres.» § 6 Abs. 4: «Bei Wegfall von Sozialhilfe wird für den Rest des
    // Anspruchsjahres weiter Prämienverbilligung … ausgerichtet.»
    'Fallen die Ergänzungsleistungen im Lauf des Jahres weg, prüft die SVA den Anspruch für den Rest des Jahres von sich aus. Endet die Sozialhilfe, läuft die Verbilligung bis Ende Jahr weiter.',
    // EGzKVG § 2 Abs. 1: «Änderungen der massgebenden Verhältnisse umgehend zu melden». § 19 Abs. 1/2:
    // Rückforderung beim Krankenversicherer, «insbesondere …, wenn sich nach Eintritt der Rechtskraft
    // der Steuerveranlagungen zeigt, dass … das massgebende Einkommen oder Vermögen … über den
    // Berechtigungsgrenzen … liegt». § 18 Abs. 2: kleine Jahresbeträge «werden nicht ausbezahlt und
    // verfallen».
    // Prüfbefund 09.11.: auch die Person ist betroffen. Anmeldeformular Ziff. 7: «Die zu Unrecht
    // bezogenen Leistungen – unabhängig von der Auszahlungsart – sind zurückzuerstatten.» EGzKVG § 20:
    // «Die Rückforderung kann erlassen werden, wenn die rückerstattungspflichtige Person gutgläubig
    // gehandelt hat und gleichzeitig eine grosse Härte vorliegt.»
    'Änderungen melden Sie der SVA umgehend. Zeigt die definitive Steuerveranlagung später, dass Einkommen oder Vermögen über den Grenzen lagen, wird die Verbilligung bei der Krankenkasse zurückgefordert; zu Unrecht bezogene Leistungen sind laut Formular zurückzuerstatten, was auch Sie treffen kann. Erlassen wird die Rückforderung nur bei gutem Glauben und grosser Härte. Sehr kleine Jahresbeträge werden nicht ausbezahlt und verfallen.',
  ],
  quellen: [
    { text: 'SVA Schwyz: Merkblatt Prämienverbilligung im Kanton Schwyz (PDF)', url: 'https://www.sva-sz.ch/uploads/Dateien/Merkblaetter/Individuelle-Praemienverbilligung/Merkblatt-IPV-2027.pdf' },
    // Prüfbefund 09.11.: Formular belegt die Rückerstattung durch die Person. Abgerufen 09.11.2026:
    // …/Anmeldung-IPV-2027.pdf → 200; Gegenprobe …/Anmeldung-IPV-2099.pdf → 404.
    { text: 'SVA Schwyz: Anmeldeformular Prämienverbilligung (PDF)', url: 'https://www.sva-sz.ch/uploads/Dateien/Formulare/Individuelle-Praemienverbilligung-IPV/Anmeldung-IPV-2027.pdf' },
    { text: 'Einführungsgesetz zum Bundesgesetz über die Krankenversicherung (EGzKVG, SRSZ 361.100, PDF)', url: 'https://www.sz.ch/public/upload/assets/6155/361_100.pdf' },
    { text: 'Vollzugsverordnung zum EGzKVG (VVzEGzKVG, SRSZ 361.111, PDF)', url: 'https://www.sz.ch/public/upload/assets/6017/361_111.pdf?fp=20' },
    KVG65,
  ],
};
