// Prämienverbilligung · Kanton ZH. Texte für /praemienverbilligung/<kanton>/.
// Regeln, Aufbau und Riegel: scripts/seiten/praemienverbilligung-kantone.mjs (Kopfkommentar).
// Jeder Satz mit Belegstelle in der Primärquelle des Kantons.
import { KVG65 } from '../praemienverbilligung-kantone-gemeinsam.mjs';

export default {
  name: 'Zürich',
  slug: 'zuerich',
  weg: 'antrag',
  // Das Rechenmodul der App für diesen Kanton. null heisst: Die App rechnet hier
  // keinen Betrag, dann darf die Karte das auch nicht versprechen (Rechtsprüfung
  // 09.11.2026, Art. 3 Abs. 1 lit. b UWG). Der Test prüft, dass die Datei existiert.
  abgeglichen: '2026-11-09',
  wegSaetze: [
    // Quellenblatt ZH «Zuständig / Weg»: «Antragsformular wird automatisch zugestellt».
    'Im Kanton Zürich gibt es die Prämienverbilligung in der Regel nur auf Antrag. Wer nach den Steuerdaten in Frage kommt, bekommt das Antragsformular von der SVA Zürich zugestellt.',
    // Kundeninformation 2026: Online-Formular für Nachmeldungen.
    'Falls Sie kein Formular erhalten haben, aber Anspruch vermuten, melden Sie sich bei der SVA Zürich. Das geht auch online.',
    // EG KVG § 14 Abs. 1 (SVA überweist bei EL-Anspruch direkt dem Versicherer) und
    // Abs. 3 (fällt die EL weg, gilt das EL-Gesuch als Antrag).
    'Wer Ergänzungsleistungen zur AHV oder IV bezieht, muss keinen eigenen Antrag stellen.',
  ],
  // EG KVG § 21 Abs. 1 (Frist im Gesetz); Formular; SVA.
  fristSatz: 'Für den Antrag gilt eine Frist. Sie steht im Gesetz, auf dem Formular und bei der SVA Zürich.',
  stelle: 'Sozialversicherungsanstalt Zürich (SVA Zürich)',
  // EG KVG § 18 «Antrag und Entscheid».
  stelleSatz: 'Die SVA Zürich führt die Prämienverbilligung im Auftrag des Kantons durch und entscheidet über die Anträge.',
  amtsseite: 'Seite des Kantons Zürich zur Prämienverbilligung',
  besonders: [
    // Quellenblatt ZH: provisorische Auszahlung, definitive Abrechnung. Kundeninformation
    // Ziff. 8 («Restzahlung oder Rückforderung»), Ziff. 12, Ziff. 14.3 («Um Rückforderungen
    // zu vermeiden, verzichten Sie …»); EG KVG § 12 Abs. 1 / § 13 (Meldepflicht), § 19 Abs. 2.
    'Zuerst wird ein vorläufiger Betrag ausgerichtet. Die definitive Abrechnung folgt, wenn die Steuerdaten des Jahres vorliegen. Fällt der endgültige Betrag tiefer aus, fordert die SVA die Differenz zurück.',
    'Änderungen, etwa eine Heirat oder das Ende einer Ausbildung, melden Sie darum der SVA Zürich. Steigt Ihr Einkommen stark, lohnt es sich, vor dem Einreichen zu prüfen, ob der Antrag noch sinnvoll ist.',
    // Kundeninformation Ziff. 14.1 und 14.2: Steuerfaktoren der Eltern; Abschluss, Abbruch
    // oder längerer Unterbruch der Ausbildung ist zu melden.
    'Bei jungen Erwachsenen in Ausbildung zählen die Steuerdaten der Eltern, ausser sie sind verheiratet oder haben eigene Kinder. Endet die Ausbildung oder wird sie länger unterbrochen, ist das der SVA zu melden.',
    // Quellenblatt ZH «Massgebendes Einkommen»: «Bei quellenbesteuerten Personen entspricht
    // das massgebende Einkommen dem steuerbaren Einkommen unter Berücksichtigung des Kinderabzuges.»
    'Für Personen mit Quellensteuer gilt eine eigene Berechnungsgrundlage.',
  ],
  quellen: [
    { text: 'SVA Zürich: Kundeninformation zur Prämienverbilligung (PDF)', url: 'https://svazurich.ch/dam/sva-dokumente/4000_ipv/4000_vl3_ipv_kundeninformation_2026.pdf' },
    { text: 'SVA Zürich: Prämienverbilligung, Leistung', url: 'https://svazurich.ch/unsere-produkte/weitere-produkte/krankenversicherung--kvg-/praemienverbilligung/leistung.html' },
    // Kein stabiler Link auf die Zürcher Gesetzessammlung gefunden (gemessen 09.11.2026): nur der Titel.
    { text: 'Einführungsgesetz zum Krankenversicherungsgesetz des Kantons Zürich (EG KVG, LS 832.01)' },
    KVG65,
  ],
};
