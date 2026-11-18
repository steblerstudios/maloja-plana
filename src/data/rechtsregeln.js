// Rechtsregeln: das Zuhause für Regeln, die in mehreren Texten vorkommen
//
// Regel «Jede Zahl hat ein Zuhause» (01.11.2026), angewendet auf Rechtsregeln im Text. Eine Regel
// steht in mehreren Abläufen, je auf eine andere Lage angewendet. Ein Beispiel: die 31 Tage nach
// UVG Art. 3 Abs. 2 zählen bei «Stelle verloren» ab dem Ende des Lohnanspruchs, bei «Ausgesteuert»
// ab dem letzten Taggeld. Darum bleibt jeder Satz, wie er ist (kein gemeinsamer Text, Entscheid
// Stebler Studios 18.11.2026, Form «A · Register + Wächter»).
//
// Dieses Register hält je Regel: Gesetz und Artikel, die Kürzel in den fünf Sprachen, die Quelle
// und jede Fundstelle (i18n-Schlüssel) mit den Werten, die dort stehen müssen.
// Der Wächter `__tests__/rechtsregeln.test.js` prüft in allen fünf Sprachen:
//   1. Jeder Text, der den Artikel zitiert, steht hier als Fundstelle, und umgekehrt.
//      Neue Erwähnung → Test rot, bis sie hier eingetragen ist.
//   2. Jede Fundstelle nennt ihre Werte in jeder Sprache (Ziffer oder Zahlwort).
// Ändert sich das Gesetz: Wert hier ändern, der Test zeigt jede Stelle, die nachziehen muss.
//
// Ob eine Regel inhaltlich stimmt, kann kein Test sagen. Das bleibt Fachprüfung. Fachprüfung
// 18.11.2026 (swiss-precision-pruefer) gegen Fedlex: UVG 1.1.2026, UVV/AHVG/BVG 1.1.2027,
// KVG 1.7.2026, alle fünf Regeln bestätigt. Die Quellen sind dieselben Fedlex-Adressen, die die
// Texte schon verlinken. Der Wächter prüft Zahlen, nicht ganze Zitate: fehlt in einer Sprache
// ein zweiter Artikel («Art. 3 und 5»), merkt er das nicht.
//
// Bewusst NICHT hier:
//   - Meldefrist der Gemeinde (14 Tage): kantonales Recht, kein Bundesartikel als Anker.
//   - Hilflosenentschädigung: Beträge rechnet `hilflosenentschaedigung.js`, sie stehen nicht als
//     feste Zahl im Text.

export const RECHTSREGELN = [
  {
    id: 'nbu8h',
    regel: 'Nichtberufsunfall über die Stelle ab mindestens 8 Stunden pro Woche bei derselben Arbeitgeberin oder demselben Arbeitgeber',
    artikel: '13',
    // rm: UVV, UVG und KVG gibt es auf Fedlex nicht auf Romanisch, darum das deutsche Kürzel.
    // «OAAc» war amtlich nicht belegt, seit 18.11.2026 einheitlich «UVV».
    kuerzel: { de: ['UVV'], en: ['UVV'], fr: ['OLAA'], it: ['OAINF'], rm: ['UVV'] },
    quelle: 'https://www.fedlex.admin.ch/eli/cc/1983/38_38_38/de#art_13',
    fundstellen: {
      'kkErst.step3Text': [8],
      'lehre.step4Unfall': [8],
      'neuerJob.quelle': [],
      'neuerJob.step3Text': [8],
      'sectionIntros.versicherungen.additional': [8],
      'stundenlohnView.nbu_nurBeruf': [8],
      'stundenlohnView.nbu_unbekannt': [8],
      'stundenlohnView.nbu_versichert': [8],
      'stundenlohnView.quellen': [],
      'unfallKrankheit.step2UnfallText': [8],
      'uvgHint.body': [8],
      'uvgHint.bodyOffen': [8],
      'uvgHint.bodyUnter8': [8],
      'vu.risiko.nbuUnter8': [8],
    },
  },
  {
    id: 'uvgNachdeckung31',
    // Abs. 2 hat zwei Hälften, beide mit 31 Tagen: Angestellte und, seit 2017, arbeitslose Personen
    // (Fachprüfung 18.11.2026). Die Verordnung SR 837.171 ist nicht gegengeprüft.
    regel: 'Die Unfallversicherung endet mit dem 31. Tag nach dem Tag, an dem der Anspruch auf mindestens den halben Lohn aufhört; für arbeitslose Personen mit dem 31. Tag nach dem Tag, an dem letztmals die Voraussetzungen nach AVIG Art. 8 erfüllt oder Entschädigungen nach AVIG Art. 29 bezogen wurden',
    artikel: '3',
    kuerzel: { de: ['UVG'], en: ['UVG'], fr: ['LAA'], it: ['LAINF'], rm: ['UVG'] },
    quelle: 'https://www.fedlex.admin.ch/eli/cc/1982/1676_1676_1676/de#art_3',
    fundstellen: {
      'aussteuerung.fristHinweis': [],
      'aussteuerung.quelle': [],
      'aussteuerung.step2Text': [31],
      'stelleVerloren.quelle': [],
      'stelleVerloren.step2Hinweis': [],
      'unfallKrankheit.step2UnfallText': [31],
      'uvgHint.body': [31],
    },
  },
  {
    id: 'bvgEintritt',
    regel: 'Obligatorisch in der Pensionskasse ab dem 1. Januar nach dem 17. Geburtstag für Tod und Invalidität, ab dem 1. Januar nach dem 24. Geburtstag auch fürs Alter',
    artikel: '7',
    kuerzel: { de: ['BVG'], en: ['BVG'], fr: ['LPP'], it: ['LPP'], rm: ['BVG', 'LPP'] },
    quelle: 'https://www.fedlex.admin.ch/eli/cc/1983/797_797_797/de#art_7',
    fundstellen: {
      'lehre.step4Text': [17],
      'neuerJob.quelle': [],
      'neuerJob.step2Text': [17, 24],
      'stundenlohnView.bvg_obligatorisch': [17, 24],
      'vu.risiko.pkAltersparen': [24],
      'vu.risiko.pkMindestalter': [17],
      'vu.risiko.pkOhneGeburtsdatum': [24],
      'vu.risiko.pkUnklar': [],
      'vu.risiko.pkUnterSchwelle': [],
    },
  },
  {
    id: 'ahvBeitragsbeginn',
    // Erwerbstätige: Abs. 1 mit Abs. 2 Bst. a · Nichterwerbstätige: Abs. 1bis (Fachprüfung 18.11.2026)
    regel: 'AHV-Beiträge: Erwerbstätige ab dem 1. Januar nach dem 17. Geburtstag (Abs. 1 mit Abs. 2 Bst. a), Nichterwerbstätige ab dem 1. Januar nach dem 20. Geburtstag (Abs. 1bis)',
    artikel: '3',
    kuerzel: { de: ['AHVG'], en: ['AHVG'], fr: ['LAVS'], it: ['LAVS'], rm: ['AHVG', 'LAVS'] },
    quelle: 'https://www.fedlex.admin.ch/eli/cc/63/837_843_843/de#art_3',
    fundstellen: {
      // zitiert Abs. 3 (Beiträge der Ehepartnerin oder des Ehepartners), nicht den Beginn
      'aussteuerung.step3Text': [],
      'lehre.quelle': [],
      'lehre.step4Text': [17],
      'volljaehrig.quelle': [],
      'zuzug.step3Text': [20],
    },
  },
  {
    id: 'kkDreiMonate',
    regel: 'Die Grundversicherung innert drei Monaten nach Wohnsitznahme oder Geburt abschliessen',
    artikel: '3',
    kuerzel: { de: ['KVG'], en: ['KVG'], fr: ['LAMal'], it: ['LAMal'], rm: ['KVG', 'LAMal'] },
    quelle: 'https://www.fedlex.admin.ch/eli/cc/1995/1328_1328_1328/de#art_3',
    fundstellen: {
      'kind.fristHinweis': [3],
      'kind.quelle': [],
      'kkErst.fristHinweis': [3],
      'kkErst.intro': [3],
      'kkErst.quelle': [],
      'kkErst.step1Text': [3],
      'vu.risiko.kkOffen': [],
      'wegzug.step2Text': [],
      'zuzug.quelle': [],
      'zuzug.step2Text': [3],
    },
  },
];
