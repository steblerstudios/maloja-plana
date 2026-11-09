// Prämienverbilligung · Kanton AG. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons. Abgerufen 09.11.2026:
//   [I] SVA Aargau, Informationsblatt Prämienverbilligung 2027 (sva-aargau.ch/informationsblattpv, HTML)
//   [A] SVA Aargau, Allgemeine Informationen (Amtslink der App)
//   [G] KVGG, SAR 837.200, Version in Kraft seit 01.12.2025 (API-Version 3878, keine künftige Fassung)
//   [V] V KVGG, SAR 837.211, Version in Kraft seit 01.09.2026 (API-Version 4032, keine künftige Fassung)
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Aargau',
  slug: 'aargau',
  weg: 'antrag',
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // [G] § 10 Abs. 1–2 (SVA ermittelt Berechtigte aus Steuer- und Einwohnerregisterdaten und
    // benachrichtigt sie schriftlich); [I]: «senden wir Ihnen automatisch einen Code per Post für Ihre
    // Onlineanmeldung zu. Die Prämienverbilligung müssen Sie jedes Jahr neu anmelden.»
    'Im Kanton Aargau gibt es die Prämienverbilligung nur auf Antrag, und zwar jedes Jahr neu. Die SVA Aargau ermittelt mögliche Berechtigte aus den Steuerdaten und schickt ihnen einen Code für die Online-Anmeldung.',
    // [G] § 10 Abs. 4: Anträge «bis spätestens 31. Dezember im Vorjahr des Anspruchsjahres».
    'Den Antrag stellen Sie schon im Jahr vor dem Jahr, für das die Verbilligung gilt.',
    // [I]: «Falls Sie keinen Code erhalten, bedeutet das nicht zwingend, dass Sie keinen Anspruch
    // haben.» · «Sie möchten Ihren individuellen Code … bei uns bestellen?» · «Ihre Gemeindezweigstelle
    // oder SVA Aargau hilft Ihnen gerne weiter.»
    'Haben Sie keinen Code erhalten, heisst das nicht, dass Sie keinen Anspruch haben. Den Code können Sie bei der SVA bestellen.',
    // [I]: «Beziehen Sie Sozialhilfe oder Ergänzungsleistungen? Sie müssen sich nicht … anmelden.»
    // [A]: «Es ist keine Anmeldung nötig.» [G] § 17 Abs. 1: «Der Eintritt in die Sozialhilfe gilt als
    // Antrag auf Prämienverbilligung.»
    'Wer Sozialhilfe oder Ergänzungsleistungen bezieht, muss sich nicht anmelden. Der Eintritt in die Sozialhilfe gilt bereits als Antrag.',
  ],
  // [G] § 11 Abs. 1 (ausserordentliches Verfahren), § 12 Abs. 1–2 (aktuelle Verhältnisse, ab Eintritt
  // der Veränderung).
  selbst: {
    einleitung: 'Auch in diesen Fällen müssen Sie selbst etwas tun:',
    punkte: [
      // [I]: «Sind Sie neu im Kanton Aargau wohnhaft? Sie müssen keinen Code bei uns bestellen. Melden
      // Sie sich über unseren Änderungsantrag an». [G] § 16 Abs. 1: «Ein allfälliger Anspruch … gilt ab
      // dem 1. Januar des Folgejahres nach Zuzug.»
      'Sie sind neu im Kanton Aargau. Dann melden Sie sich über den Änderungsantrag der SVA an. Wer aus einem anderen Kanton zuzieht, hat frühestens ab dem folgenden Jahr Anspruch.',
      // [G] § 16 Abs. 2 (Zuzug aus dem Ausland oder «aufgrund ihres Alters über keine rechtskräftige
      // Steuerveranlagung»: § 11 Abs. 1); § 12 Abs. 1.
      'Sie ziehen aus dem Ausland zu oder haben wegen Ihres Alters noch keine Steuerveranlagung. Dann rechnet die SVA mit Ihren aktuellen Verhältnissen.',
      // [G] § 11 Abs. 2 («für mindestens sechs Monate um mindestens 20 % verringert hat oder verringern
      // wird»), § 13 Abs. 1 (Antrag auf Ausrichtung oder Neuberechnung).
      'Ihr Einkommen ist für mindestens ein halbes Jahr deutlich gesunken, oder es wird sinken. Dann können Sie einen Antrag auf Verbilligung oder auf Neuberechnung stellen. Das Gesetz nennt dafür eine Mindestgrenze.',
      // [G] § 11 Abs. 4 (Geburt, Tod von Familienangehörigen, Pensionierung, Aufhebung des gemeinsamen
      // Haushalts); [I]: «Das Gleiche gilt, wenn sich Ihre persönlichen Verhältnisse verändert haben.»
      'Ihre persönlichen Verhältnisse haben sich verändert, etwa durch die Geburt eines Kindes, einen Todesfall in der Familie, die Pensionierung oder die Aufhebung des gemeinsamen Haushalts.',
      // [G] § 9 Abs. 3 lit. a (zwischen dem 19. und dem 25. Altersjahr; Steuerveranlagung unter einem
      // Grenzwert → auf dem Antrag der Eltern; Widerspruch «nötigenfalls zu belegen»); [V] § 5 Abs. 2.
      'Sie sind zwischen 19 und 25 Jahre alt und Ihr steuerbares Einkommen liegt unter einer festen Grenze. Dann gehören Sie auf den Antrag Ihrer Eltern. Unterstützen Ihre Eltern Sie nicht, können Sie dem widersprechen und müssen das nötigenfalls belegen.',
    ],
    // [I]: «www.sva-aargau.ch/aenderungsantrag».
    schluss: 'Den Änderungsantrag finden Sie auf der Seite der SVA Aargau.',
  },
  // [G] § 10 Abs. 2 («innert sechs Wochen»), Abs. 4 («andernfalls der Anspruch … verwirkt ist»);
  // [I]: «Der Code ist 6 Wochen gültig.»; §§ 11–16 (ausserordentliches Verfahren).
  // Letzter Satz (Rechtsprüfung 09.11.): § 10 Abs. 4 «in jedem Fall bis spätestens 31. Dezember im
  // Vorjahr»; §§ 11–16 nennen keine eigene Frist, § 12 Abs. 2: «gilt ab dem Zeitpunkt des Eintritts
  // der Veränderung». Ob § 10 Abs. 4 auch für die Fälle oben gilt, ist am Text nicht eindeutig —
  // darum vorsichtig und mit Verweis an die SVA.
  fristSatz: 'Für den Antrag gilt eine Frist im Vorjahr. Sie steht im Gesetz und im Informationsblatt der SVA, und der zugeschickte Code ist nur einige Wochen gültig. Wer die Frist verpasst, verliert den Anspruch für dieses Jahr. Für die Fälle oben nennt das Gesetz Wege während des Jahres; fragen Sie bei der SVA nach, welche Frist für Sie gilt.',
  stelle: 'SVA Aargau',
  // [G] § 8: «Durchführungsstelle für den Bereich «Prämienverbilligung» ist die SVA Aargau.»
  // [I]: «Sie haben kein Internetzugang? Ihre Gemeindezweigstelle oder SVA Aargau hilft Ihnen gerne weiter.»
  stelleSatz: 'Die SVA Aargau führt die Prämienverbilligung für den Kanton durch und entscheidet über die Anträge. Ohne Internetzugang helfen die Gemeindezweigstelle oder die SVA weiter.',
  amtsseite: 'Seite der SVA Aargau zur Prämienverbilligung',
  besonders: [
    // [G] § 7 Abs. 1: «Das massgebende Steuerjahr ist dasjenige Jahr, das drei Jahre vor dem
    // Anspruchsjahr begonnen hat.»
    'Der Aargau rechnet mit der rechtskräftigen Steuerveranlagung von drei Jahren vor dem Anspruchsjahr.',
    // [G] § 6 Abs. 2 («zuzüglich einem Fünftel des steuerbaren Vermögens»), Abs. 3 lit. b (Säule 2,
    // Säule 3a), Abs. 5; [V] § 5 Abs. 1 (ohne berufliche Vorsorge 3a «nur aufgerechnet, soweit sie
    // 10 % des Nettoerwerbseinkommens übersteigen»).
    'Zum steuerbaren Einkommen zählt die SVA einen Teil des steuerbaren Vermögens und mehrere Abzüge wieder dazu, etwa Einkäufe in die Pensionskasse und Einzahlungen in die Säule 3a. Wer keiner Pensionskasse angehört, dem wird die Säule 3a erst ab einem bestimmten Anteil des Erwerbseinkommens angerechnet.',
    // [G] § 9 Abs. 2 («Das Konkubinat wird bei einem gemeinsamen Haushalt angenommen. Der Annahme kann
    // durch eine Deklaration bei der Antragstellung widersprochen werden.»); [V] § 7a.
    'Paare im Konkubinat und in eingetragener Partnerschaft werden wie Ehepaare berechnet. Ein Konkubinat nimmt das Gesetz schon bei einem gemeinsamen Haushalt an. Sie können dem beim Antrag widersprechen.',
    // [G] § 7 Abs. 2: «Besteht ein Anspruch …, beträgt die Prämienverbilligung von Kindern und jungen
    // Erwachsenen in Ausbildung mindestens 50 % der effektiven Prämie.»
    'Für Kinder und junge Erwachsene in Ausbildung gibt es eine Mindestverbilligung, wenn der Haushalt Anspruch hat. Sie bemisst sich an der tatsächlichen Prämie.',
    // [G] § 14 Abs. 1 («innert 60 Tagen seit Eintritt der Veränderung zu melden»), § 11 Abs. 3,
    // § 36 Abs. 1 lit. b (Busse bei Verletzung der Meldepflicht); [I]: «Zu viel bezogene
    // Prämienverbilligung müssen Sie zurückerstatten.»
    'Steigen Ihr Einkommen oder Ihr Vermögen deutlich, müssen Sie das der SVA innert kurzer Frist melden. Zu viel bezogene Verbilligung müssen Sie zurückzahlen, und wer die Meldepflicht verletzt, kann gebüsst werden.',
    // [V] § 7c: Nachkontrollen, «sobald die Steuerveranlagung des zu prüfenden Anspruchsjahrs
    // rechtskräftig geworden ist»; «Zu Unrecht bezogene Prämienverbilligungen werden zurückgefordert.»
    'Die SVA prüft nachträglich, sobald die Steuerveranlagung des Anspruchsjahres rechtskräftig ist. Zu Unrecht bezogene Verbilligung fordert sie zurück.',
    // [I]: «Falls Sie Prämienverbilligung erhalten und nach Ihrer Ausbildung mehr verdienen, müssen
    // Sie uns dies umgehend melden. So können Sie mögliche Rückzahlungen verhindern.»
    'Wer nach der Ausbildung mehr verdient, meldet das der SVA sofort. So lassen sich Rückzahlungen vermeiden.',
  ],
  quellen: [
    // HTTP 200 (HTML, Titel «Informationsblatt Prämienverbilligung 2027 | SVA Aargau»);
    // Gegenprobe sva-aargau.ch/informationsblattxq → 404.
    { text: 'SVA Aargau: Informationsblatt Prämienverbilligung', url: 'https://www.sva-aargau.ch/informationsblattpv' },
    // Gesetzessammlung AG ist eine Web-App (jede Adresse 200); Bestand über die API belegt
    // (…/api/de/texts_of_law/837.200 und 837.211 → 200), 837.999 → 404.
    { text: 'Gesetz zum Bundesgesetz über die Krankenversicherung (KVGG, SAR 837.200)', url: 'https://gesetzessammlungen.ag.ch/app/de/texts_of_law/837.200' },
    { text: 'Verordnung zum Gesetz zum Bundesgesetz über die Krankenversicherung (V KVGG, SAR 837.211)', url: 'https://gesetzessammlungen.ag.ch/app/de/texts_of_law/837.211' },
    KVG65,
  ],
};
