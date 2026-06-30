// ─── Lebenszustände-Registry ──────────────────────────────
// Andauernde Lebenssituationen (Lebenszustände), die versteckte
// Berechtigungen aufdecken — die „Grauzonen", von denen viele
// schlicht nichts wissen.
//
// Abgrenzung zur Lebensereignis-Matrix:
//   Lebensereignis = Punkt in der Zeit, der einen Ablauf auslöst
//                    (z.B. „ich heirate", „ich verliere die Stelle").
//   Lebenszustand  = andauernde Situation im Hintergrund, die
//                    proaktiv zeigt, was einem zustehen könnte
//                    (z.B. „wenn das Geld knapp ist").
//
// Prinzipien (PLATFORM_CONTEXT.md):
//   • KEINE KI, KEINE automatische Erkennung aus den Daten —
//     die Person wählt selbst, was zutrifft (Würde, kein Etikett).
//   • Deterministisch & auditierbar: nur kuratierte Verweise.
//   • Keine Waisen — jeder Eintrag verlinkt auf einen bereits
//     existierenden Ablauf/View oder eine offizielle Quelle.
//
// Sichtbare Texte liegen in i18n unter `lebenszustaende.<key>.*`.
// Diese Registry hält nur sprachneutrale Fakten: Crosslink-Ziel,
// Quelle und Stand (Aktualisierungsjahr).

export const LEBENSZUSTAENDE = [
  {
    key: 'tiefesEinkommen',
    berechtigungen: [
      { key: 'ipv',         view: 'premium',     quelle: 'BAG / Kanton', stand: '2026' },
      { key: 'mietzins',    view: 'mietzins',    quelle: 'Kanton',       stand: '2026' },
      { key: 'sozialhilfe', view: 'sozialhilfe', quelle: 'SKOS',         stand: '2026' },
      { key: 'stipendien',  view: 'stipendien',  quelle: 'EDK / Kanton', stand: '2026' },
      { key: 'franchise',   view: 'kvg',         quelle: 'BAG',          stand: '2026' },
    ],
  },
  {
    key: 'alleinerziehend',
    berechtigungen: [
      { key: 'alimente',        view: 'trennung',    quelle: 'Kanton / BSV', stand: '2026' },
      { key: 'ipv',             view: 'premium',     quelle: 'BAG / Kanton', stand: '2026' },
      { key: 'familienzulagen', view: 'kind',        quelle: 'BSV',          stand: '2026' },
      { key: 'sozialhilfe',     view: 'sozialhilfe', quelle: 'SKOS',         stand: '2026' },
      { key: 'steuern',         view: 'tax',         quelle: 'ESTV',         stand: '2026' },
    ],
  },
  {
    key: 'beeintraechtigung',
    berechtigungen: [
      { key: 'iv',                    view: 'iv',              quelle: 'BSV / IV-Stelle', stand: '2026' },
      { key: 'hilflosenentschaedigung', view: 'iv',            quelle: 'BSV',             stand: '2026' },
      { key: 'el',                    view: 'finanzuebersicht', quelle: 'BSV',            stand: '2026' },
      { key: 'ipv',                   view: 'premium',         quelle: 'BAG / Kanton',    stand: '2026' },
      { key: 'steuern',               view: 'tax',             quelle: 'ESTV',            stand: '2026' },
      // Externe offizielle Quelle (kein interner Ablauf): SBB-Begleitabo.
      { key: 'sbbBegleitabo', url: 'https://www.sbb.ch/de/bahnhof-services/reisende-mit-handicap/fahrverguenstigung/ausweiskarte-behinderung.html', quelle: 'SBB', stand: '2026' },
    ],
  },
  // Weiterer Zustand folgt schritt-für-schritt (Reihenfolge mit Sophie
  // festgelegt): pflegende Angehörige. Reine Daten nach diesem Muster.
];
