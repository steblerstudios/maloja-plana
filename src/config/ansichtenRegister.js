// ─── Register der Ansichten ───────────────────────────────────────────────────
// EINE Zuordnung Ansicht → Beschriftung → Piktogramm, für alle, die sie brauchen:
// die Suche, das Menü und die Querverweise in den Kapiteln.
//
// Warum eigenes Blatt: es gab zwei Listen — diese hier und `allTools` in
// MobileNav.jsx. Sie waren sich bei FÜNF von sechzehn gemeinsamen Werkzeugen
// uneinig, welches Piktogramm gilt (Lebenslauf, IPV, Sozialhilfe, Budget-Sync,
// Tresor). Im Menü stand jeweils der generische Rückfall, in der Suche das
// passende Zeichen — dasselbe Werkzeug sah an zwei Orten anders aus. Eine
// Korrektur wirkte immer nur an einer Stelle (21.09.2026).
//
// Matcht gegen die bereits übersetzten nav-Labels (kein Extra-i18n pro Eintrag)
// + ein paar sprachneutrale Abkürzungs-Aliase, damit z.B. „ipv"/„ahv" greifen.

export const SEARCH_VIEWS = [
  { view: 'merkliste', nav: 'nav.merkliste', sub: 'nav.sub.merkliste', icon: 'check', aliases: ['todo', 'merkliste'] },
  { view: 'calendar', nav: 'nav.calendar', sub: 'nav.sub.calendar', icon: 'calendar', aliases: ['ical', 'ics', 'termine'] },
  { view: 'premium', nav: 'nav.kvgIpv', sub: 'nav.sub.kvgIpv', icon: 'praemienverbilligung', aliases: ['ipv', 'pv'] },
  { view: 'praemien', nav: 'nav.praemien', sub: 'nav.sub.praemien', icon: 'insurance', aliases: ['praemien', 'kvg'] },
  { view: 'kvg', nav: 'nav.kvgLeistungen', sub: 'nav.sub.kvgLeistungen', icon: 'health', aliases: ['kvg', 'leistungen'] },
  { view: 'vorsorge', nav: 'nav.vorsorge', sub: 'nav.sub.vorsorge', icon: 'vorsorge', aliases: ['ahv', 'bvg', 'pension', '3a', 'avs'] },
  { view: 'eo', nav: 'nav.eo', sub: 'nav.sub.eo', icon: 'family', aliases: ['eo', 'mutterschaft', 'vaterschaft'] },
  { view: 'stipendien', nav: 'nav.stipendien', sub: 'nav.sub.stipendien', icon: 'ausbildung', aliases: ['stipendien', 'scholarship'] },
  { view: 'tax', nav: 'nav.taxes', sub: 'nav.sub.taxes', icon: 'money', aliases: ['steuer', 'tax', 'impot'] },
  { view: 'sozialhilfe', nav: 'nav.sozialhilfe', sub: 'nav.sub.sozialhilfe', icon: 'sozialhilfe', aliases: ['skos', 'sozialhilfe', 'aide sociale'] },
  { view: 'alv', nav: 'nav.alv', sub: 'nav.sub.alv', icon: 'family', aliases: ['alv', 'arbeitslos', 'rav'] },
  { view: 'asyl', nav: 'nav.asyl', sub: 'nav.sub.asyl', icon: 'behoerden', aliases: ['asyl', 'asylum', 'flucht', 'migration'] },
  { view: 'direktlinks', nav: 'nav.direktlinks', sub: 'nav.sub.direktlinks', icon: 'dokumentTresor', aliases: ['links', 'behoerden', 'amt'] },
  { view: 'tresor', nav: 'nav.tresor', sub: 'nav.sub.tresor', icon: 'dokumentTresor', aliases: ['dokumente', 'documents', 'tresor'] },
  { view: 'cv', nav: 'nav.cv', sub: 'nav.sub.cv', icon: 'lebenslauf', aliases: ['cv', 'lebenslauf', 'resume'] },
  { view: 'unterlagen', nav: 'nav.unterlagen', sub: 'nav.sub.unterlagen', icon: 'documents', aliases: ['unterlagen', 'documents'] },
  { view: 'flyer', nav: 'nav.flyer', sub: 'nav.sub.flyer', icon: 'dokumentTresor', aliases: ['qr', 'teilen', 'share', 'flyer'] },
  // Bisher nicht auffindbar, obwohl über Dashboard/Menü erreichbar (Audit #17).
  // `sub` ist optional — nicht jedes Werkzeug hat einen Beschreibungs-Key.
  { view: 'finanzuebersicht', nav: 'nav.finanzUebersicht', icon: 'budget', aliases: ['finanzübersicht', 'übersicht', 'finanzen', 'overview'] },
  { view: 'sync', nav: 'nav.budgetSync', sub: 'nav.sub.budgetSync', icon: 'budgetWallet', aliases: ['budget', 'sync', 'ausgaben'] },
  { view: 'taxImport', nav: 'nav.taxImport', sub: 'nav.sub.taxImport', icon: 'document', aliases: ['steuerimport', 'import', 'steuererklärung'] },
  { view: 'kk', nav: 'nav.kkScanner', icon: 'barcode', aliases: ['kk', 'krankenkasse', 'scanner', 'qr', 'prämie'] },
  { view: 'budget', nav: 'nav.budget', icon: 'csv', aliases: ['budget', 'haushalt', 'ausgaben'] },
  { view: 'schulden', nav: 'nav.debts', icon: 'debt', aliases: ['schulden', 'betreibung', 'debt', 'abzahlung'] },
  { view: 'organ', nav: 'nav.organDonation', icon: 'health', aliases: ['organspende', 'spende', 'organ', 'donation'] },
  { view: 'charts', nav: 'nav.charts', icon: 'chartsSchoko', aliases: ['charts', 'diagramme', 'statistik', 'grafik'] },
  { view: 'export', nav: 'nav.export', icon: 'download', aliases: ['export', 'sicherung', 'backup', 'datensicherung'] },
  { view: 'notifications', nav: 'nav.notifications', icon: 'cowbell', aliases: ['benachrichtigungen', 'erinnerungen', 'notifications'] },
  // Der Weg auf den Startbildschirm. Muss auffindbar sein, weil ihn ausserhalb
  // von Chromium kein Banner von selbst anbietet — wer auf dem iPhone danach
  // sucht, sucht mit genau diesen Wörtern.
  { view: 'installApp', nav: 'nav.installApp', sub: 'nav.sub.installApp', icon: 'download', aliases: ['install', 'installieren', 'app', 'pwa', 'homescreen', 'startbildschirm', 'herunterladen', 'download'] },
];

// Piktogramm einer Ansicht — mit Rückfall, damit ein unbekannter Schlüssel
// nichts umwirft.
export const ansichtIkon = (view, rueckfall = 'document') => {
  const e = SEARCH_VIEWS.find((v) => v.view === view);
  return (e && e.icon) || rueckfall;
};
