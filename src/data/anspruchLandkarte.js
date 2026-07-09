// Anspruchs-Landkarte (#4.4.1): EIN ruhiger Überblick über alle möglichen
// Berechtigungen, gruppiert nach Auslöser (Einkommen / Lebenslage / Ereignis).
// KEINE neue Rechnung und KEINE vierte Tür — jeder Punkt verlinkt in sein
// bestehendes Zuhause (Schnellcheck/Rechner/Ansicht). Diese Datei ist die
// einzige Quelle der Wahrheit für die Übersichtsseite; die Detail-Logik und
// die kontextuellen Texte bleiben in den Ziel-Ansichten. Ein Eintrag verspricht
// nichts — er zeigt nur „das könnte dich betreffen".
//
// Item-Felder:
//   key           → i18n-Basis anspruch.items.<key>.{label,sub}
//   view          → onNavigate(view) ins bestehende Zuhause
//   extra         → optionaler 3. onNavigate-Parameter (z. B. kvg-Reiter)
//   chapterIndex  → für view:'chapter' der Kapitel-Index (Notfall = 6)
//   url           → externe amtliche Quelle statt interner Ansicht (öffnet neu)
//
// Alle URLs 2026 web-verifiziert; bei Pflege gegen die Quellen prüfen.

export const SERAFE_BEFREIUNG_URL = 'https://www.serafe.ch/de/abgabebefreiung/personen-mit-ergaenzungsleistungen/';
export const SBB_BEGLEITABO_URL = 'https://www.sbb.ch/de/angebote/begleitabo';

// Notfall-Kapitel-Index (siehe getChapters in config/constants.js: basis..notfall).
const NOTFALL_CHAPTER_INDEX = 6;

export const ANSPRUCH_GRUPPEN = [
  {
    key: 'einkommen',
    items: [
      { key: 'ipv',           view: 'premium' },
      { key: 'sozialhilfe',   view: 'sozialhilfe' },
      { key: 'el',            view: 'finanzuebersicht' },
      { key: 'mietbeitraege', view: 'mietzins' },
      { key: 'stipendien',    view: 'stipendien' },
      { key: 'franchise',     view: 'kvg', extra: 'franchise' },
    ],
  },
  {
    key: 'lebenslage',
    items: [
      { key: 'iv',                     view: 'iv' },
      { key: 'betreuungsgutschriften', view: 'vorsorge' },
      { key: 'verguenstigungen',       view: 'situationen' },
      { key: 'serafe',                 url: SERAFE_BEFREIUNG_URL },
      { key: 'sbbBegleitabo',          url: SBB_BEGLEITABO_URL },
      { key: 'beistandschaft',         view: 'chapter', chapterIndex: NOTFALL_CHAPTER_INDEX },
    ],
  },
  {
    key: 'ereignis',
    items: [
      { key: 'alv',             view: 'alv' },
      { key: 'eo',              view: 'eo' },
      { key: 'familienzulagen', view: 'kind' },
      { key: 'waisenrente',     view: 'todesfall' },
    ],
  },
];
