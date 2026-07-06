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
    zeigeRegionaleAngebote: true, // kanton-bewusste Vergünstigungen (regionaleVerguenstigungen.js)
    berechtigungen: [
      { key: 'ipv',         view: 'premium',     quelle: 'BAG / Kanton', stand: '2026' },
      { key: 'mietzins',    view: 'mietzins',    quelle: 'Kanton',       stand: '2026' },
      { key: 'sozialhilfe', view: 'sozialhilfe', quelle: 'SKOS',         stand: '2026' },
      { key: 'stipendien',  view: 'stipendien',  quelle: 'EDK / Kanton', stand: '2026' },
      { key: 'franchise',   view: 'kvg',         quelle: 'BAG',          stand: '2026' },
      // Externe Vergünstigungen (national, der Schlüssel zu regionalen Angeboten) — Braindump #26.
      { key: 'kulturlegi',  url: 'https://www.kulturlegi.ch/',        quelle: 'Caritas',                   stand: '2026' },
      { key: 'rekaFerien',  url: 'https://www.reka-ferienhilfe.ch/',  quelle: 'Reka-Stiftung Ferienhilfe', stand: '2026' },
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
      // Externe offizielle Quellen (kein interner Ablauf): SERAFE-Befreiung
      // (an EL-Bezug geknüpft), SBB-Begleitabo.
      { key: 'serafe', url: 'https://www.serafe.ch/de/abgabebefreiung/personen-mit-ergaenzungsleistungen/', quelle: 'SERAFE / BAKOM', stand: '2026' },
      { key: 'sbbBegleitabo', url: 'https://www.sbb.ch/de/bahnhof-services/reisende-mit-handicap/fahrverguenstigung/ausweiskarte-behinderung.html', quelle: 'SBB', stand: '2026' },
    ],
  },
  {
    key: 'pflegendeAngehoerige',
    berechtigungen: [
      { key: 'betreuungsgutschriften', view: 'vorsorge', quelle: 'BSV / Ausgleichskasse', stand: '2026' },
      { key: 'betreuungsentschaedigung', view: 'eo',      quelle: 'BSV',                   stand: '2026' },
      { key: 'hilflosenentschaedigung',  view: 'iv',      quelle: 'BSV',                   stand: '2026' },
      { key: 'steuern',                  view: 'tax',     quelle: 'ESTV',                  stand: '2026' },
    ],
  },
  {
    key: 'frischZugezogen',
    berechtigungen: [
      { key: 'kkErst',        view: 'kkerst',      quelle: 'BAG / KVG',            stand: '2026' },
      { key: 'bewilligung',   view: 'bewilligung', quelle: 'SEM / Kanton',         stand: '2026' },
      { key: 'quellensteuer', view: 'tax',         quelle: 'ESTV / Kanton',        stand: '2026' },
      { key: 'ipv',           view: 'premium',     quelle: 'BAG / Kanton',         stand: '2026' },
      { key: 'mietzins',      view: 'mietzins',    quelle: 'Kanton',               stand: '2026' },
    ],
  },
  {
    key: 'inAusbildung',
    berechtigungen: [
      { key: 'stipendien',  view: 'stipendien', quelle: 'EDK / Kanton',            stand: '2026' },
      { key: 'ipv',         view: 'premium',    quelle: 'BAG / Kanton',            stand: '2026' },
      { key: 'franchise',   view: 'kvg',        quelle: 'BAG',                     stand: '2026' },
      { key: 'ahv',         view: 'vorsorge',   quelle: 'BSV / Ausgleichskasse',   stand: '2026' },
      // Waisenrente läuft in Ausbildung bis 25 weiter (Überschneidung mit „halbwaise").
      { key: 'waisenrente', view: 'todesfall',  quelle: 'BSV / Ausgleichskasse',   stand: '2026' },
    ],
  },
  {
    key: 'asylsuchend',
    berechtigungen: [
      { key: 'asyl',   view: 'asyl',    quelle: 'SEM',          stand: '2026' },
      { key: 'kkErst', view: 'kkerst',  quelle: 'BAG / KVG',    stand: '2026' },
      { key: 'ipv',    view: 'premium', quelle: 'BAG / Kanton', stand: '2026' },
    ],
  },
  {
    key: 'rentnerin',
    berechtigungen: [
      // Rückweg zum Übergangs-Ablauf (für „kurz davor": AHV anmelden, PK Rente/Kapital,
      // 3. Säule gestaffelt) — Gegenstück zu pensionierung→situationen.
      { key: 'pensionierung',           view: 'pensionierung',    quelle: 'BSV / Ausgleichskasse', stand: '2026' },
      { key: 'el',                      view: 'finanzuebersicht', quelle: 'BSV',          stand: '2026' },
      { key: 'ipv',                     view: 'premium',          quelle: 'BAG / Kanton', stand: '2026' },
      { key: 'hilflosenentschaedigung', view: 'iv',               quelle: 'BSV',          stand: '2026' },
      { key: 'steuern',                 view: 'tax',              quelle: 'ESTV',         stand: '2026' },
      // Externe offizielle Quelle: SERAFE-Befreiung bei EL-Bezug (wie bei „Beeinträchtigung").
      { key: 'serafe', url: 'https://www.serafe.ch/de/abgabebefreiung/personen-mit-ergaenzungsleistungen/', quelle: 'SERAFE / BAKOM', stand: '2026' },
    ],
  },
  {
    key: 'erwerbslos',
    berechtigungen: [
      // Rückweg zum Ablauf mit der zeitkritischen RAV-Anmeldefrist (Frist-in-Kalender);
      // komplementär zum ALV-Taggeld-Rechner (`alv`). Gegenstück-Muster zu rentnerin→pensionierung.
      { key: 'rav',         view: 'stelleverloren', quelle: 'SECO / RAV', stand: '2026' },
      { key: 'alv',         view: 'alv',         quelle: 'SECO / ALV',   stand: '2026' },
      { key: 'ipv',         view: 'premium',     quelle: 'BAG / Kanton', stand: '2026' },
      { key: 'sozialhilfe', view: 'sozialhilfe', quelle: 'SKOS',         stand: '2026' },
      { key: 'franchise',   view: 'kvg',         quelle: 'BAG',          stand: '2026' },
      { key: 'steuern',     view: 'tax',         quelle: 'ESTV',         stand: '2026' },
    ],
  },
  {
    key: 'verschuldet',
    berechtigungen: [
      { key: 'schuldenberatung', view: 'schulden',    quelle: 'Schuldenberatung CH / Caritas', stand: '2026' },
      { key: 'betreibung',       view: 'betreibung',  quelle: 'SchKG',                         stand: '2026' },
      { key: 'existenzminimum',  view: 'budget',      quelle: 'SchKG',                         stand: '2026' },
      { key: 'sozialhilfe',      view: 'sozialhilfe', quelle: 'SKOS',                          stand: '2026' },
      { key: 'steuern',          view: 'tax',         quelle: 'ESTV / Kanton',                 stand: '2026' },
    ],
  },
  {
    key: 'halbwaise',
    berechtigungen: [
      { key: 'waisenrente', view: 'todesfall',       quelle: 'BSV / Ausgleichskasse', stand: '2026' },
      { key: 'el',          view: 'finanzuebersicht', quelle: 'BSV',                  stand: '2026' },
      { key: 'stipendien',  view: 'stipendien',       quelle: 'EDK / Kanton',         stand: '2026' },
      { key: 'steuern',     view: 'tax',              quelle: 'ESTV',                 stand: '2026' },
    ],
  },
  // Spätere Zustände nach gleichem Muster (reine Daten + i18n in 5 Sprachen).
];
