// ─── Das eine Werkzeug-Register ──────────────────────────────────────────────
// VORSCHAU 27.09.2026 (Entscheid «alle drei in einem, im Rucksack», siehe
// docs/design/werkzeuge-gliederung-2026-09-25.md). Bis hierher standen Werkzeuge an
// drei Orten mit je eigener Liste: Menü (`allTools`, 18), Dashboard (Gruppen, 19 +
// Abläufe) und Suche (`SEARCH_VIEWS`). Einig waren sich Menü und Dashboard bei 8.
//
// Jetzt hat jedes Werkzeug GENAU EINEN Eintrag hier:
//   view     — Ansicht, in die es führt (bei `kapitel`: 'chapter')
//   nav/sub  — Label- und Untertitel-Schlüssel (bestehende i18n, nichts Neues)
//   icon     — Zeichen aus dem Icon-System (dasselbe in Menü, Gepäck und Suche)
//   fach     — wo es im Rucksack liegt: ein Gegenstand aus `gepaeck.js`,
//              'aussenfach' (Ablegen und ordnen), 'oben' (eigener Eintrag über den
//              Gegenständen) oder 'einstellungen'
//   imMenue  — steht es zusätzlich im Menü? Als Zahl = Platz im Menü (1 zuoberst).
//   aliases  — Suchwörter (die Suche liest dieses Register, siehe ansichtenRegister.js)
//
// Die Lebensereignis-Wege (inkl. Mietzins, Stipendien, Organspende) bleiben in
// `gepaeck.js`, wie sie sind — ein View steht entweder dort ODER hier, nie an beiden
// Orten (Test: werkzeugRegister.test.js).
//
// Bewusst ohne React-Abhängigkeit und klein: das Menü und die Suche liegen im
// Startbündel.

export const AUSSENFACH = 'aussenfach';
export const EINSTELLUNGEN = 'einstellungen';
// Eigener Eintrag über den Gegenständen: «Was steht mir zu?» (gewählt 27.09.2026).
export const OBEN = 'oben';

// Zeichen (Seitenrundgang 27.09.2026): ALV «work» statt «family» (war EO), Offizielle
// Links «globe», Flyer «qr» statt dreimal «dokumentTresor». Wächter: zeichenEineQuelle.test.js.
export const WERKZEUGE = [
  // ── Portemonnaie (Geld) — Entscheid 25.09.2026 ──
  { view: 'tax', nav: 'nav.taxes', sub: 'nav.sub.taxes', icon: 'money', fach: 'geld', imMenue: 4, aliases: ['steuer', 'tax', 'impot'] },
  { view: 'taxImport', nav: 'nav.taxImport', sub: 'nav.sub.taxImport', icon: 'document', fach: 'geld', aliases: ['steuerimport', 'import', 'steuererklärung'] },
  { view: 'budget', nav: 'nav.budget', icon: 'csv', fach: 'geld', aliases: ['budget', 'haushalt', 'ausgaben'] },
  { view: 'sync', nav: 'nav.budgetSync', sub: 'nav.sub.budgetSync', icon: 'budgetWallet', fach: 'geld', aliases: ['budget', 'sync', 'ausgaben'] },
  { view: 'schulden', nav: 'nav.debts', icon: 'debt', fach: 'geld', aliases: ['schulden', 'betreibung', 'debt', 'abzahlung'] },
  { view: 'kreditkarte', nav: 'nav.kreditkarte', sub: 'nav.sub.kreditkarte', icon: 'money', fach: 'geld', aliases: ['kreditkarte', 'cashback', 'jahresgebühr', 'credit card', 'carte de crédit', 'carta di credito'] },
  { view: 'finanzuebersicht', nav: 'nav.finanzUebersicht', icon: 'budget', fach: 'geld', imMenue: 5, aliases: ['finanzübersicht', 'übersicht', 'finanzen', 'overview'] },
  // Kein eigener View: führt ins Kapitel Finanzen (wie bisher auf dem Dashboard).
  { key: 'mindestlohn', view: 'chapter', kapitel: 'finanzen', nav: 'nav.mindestlohn', sub: 'nav.sub.mindestlohn', icon: 'money', fach: 'geld', suche: false },
  { view: 'sozialhilfe', nav: 'nav.sozialhilfe', sub: 'nav.sub.sozialhilfe', icon: 'sozialhilfe', fach: 'geld', aliases: ['skos', 'sozialhilfe', 'aide sociale'] },

  // ── Arztkoffer (Gesundheit) ──
  { view: 'premium', nav: 'nav.kvgIpv', sub: 'nav.sub.kvgIpv', icon: 'praemienverbilligung', fach: 'gesundheit', aliases: ['ipv', 'pv'] },
  { view: 'praemien', nav: 'nav.praemien', sub: 'nav.sub.praemien', icon: 'insurance', fach: 'gesundheit', aliases: ['praemien', 'kvg'] },
  { view: 'kvg', nav: 'nav.kvgLeistungen', sub: 'nav.sub.kvgLeistungen', icon: 'health', fach: 'gesundheit', aliases: ['kvg', 'leistungen'] },
  { view: 'patientenverfuegung', nav: 'nav.patientenverfuegung', sub: 'nav.sub.patientenverfuegung', icon: 'document', fach: 'gesundheit', aliases: ['patientenverfügung', 'directives anticipées', 'direttive del paziente', 'advance directive', 'reanimation'] },
  { view: 'kk', nav: 'nav.kkScanner', icon: 'barcode', fach: 'gesundheit', aliases: ['kk', 'krankenkasse', 'scanner', 'qr', 'prämie'] },

  // ── Feldflasche (Alter) ──
  { view: 'vorsorge', nav: 'nav.vorsorge', sub: 'nav.sub.vorsorge', icon: 'vorsorge', fach: 'alter', aliases: ['ahv', 'bvg', 'pension', '3a', 'avs'] },

  // ── Geldleistungen, bisher nur über die Suche erreichbar ──
  // Entscheid Stebler Studios 27.09.2026: ALV-Taggeld und EO ins Portemonnaie.
  { view: 'alv', nav: 'nav.alv', sub: 'nav.sub.alv', icon: 'work', fach: 'geld', aliases: ['alv', 'arbeitslos', 'rav'] },
  { view: 'eo', nav: 'nav.eo', sub: 'nav.sub.eo', icon: 'family', fach: 'geld', aliases: ['eo', 'mutterschaft', 'vaterschaft'] },

  // ── Aussenfach «Ablegen und ordnen» — Entscheid 27.09.2026 ──
  // Die drei für den Alltag stehen zusätzlich im Menü (gleicher Name, gleiches Zeichen);
  // dahinter im Menü: Steuern · Finanz-Übersicht · Lebenssituationen (gewählt 27.09.2026).
  { view: 'tresor', nav: 'nav.tresor', sub: 'nav.sub.tresor', icon: 'dokumentTresor', fach: AUSSENFACH, imMenue: 1, aliases: ['dokumente', 'documents', 'tresor'] },
  { view: 'calendar', nav: 'nav.calendar', sub: 'nav.sub.calendar', icon: 'calendar', fach: AUSSENFACH, imMenue: 2, aliases: ['ical', 'ics', 'termine'] },
  { view: 'merkliste', nav: 'nav.merkliste', sub: 'nav.sub.merkliste', icon: 'check', fach: AUSSENFACH, imMenue: 3, aliases: ['todo', 'merkliste'] },
  { view: 'unterlagen', nav: 'nav.unterlagen', sub: 'nav.sub.unterlagen', icon: 'documents', fach: AUSSENFACH, aliases: ['unterlagen', 'documents'] },
  { view: 'cv', nav: 'nav.cv', sub: 'nav.sub.cv', icon: 'lebenslauf', fach: AUSSENFACH, aliases: ['cv', 'lebenslauf', 'resume'] },
  { view: 'direktlinks', nav: 'nav.direktlinks', sub: 'nav.sub.direktlinks', icon: 'globe', fach: AUSSENFACH, aliases: ['links', 'behoerden', 'amt'] },
  { view: 'flyer', nav: 'nav.flyer', sub: 'nav.sub.flyer', icon: 'qr', fach: AUSSENFACH, aliases: ['qr', 'teilen', 'share', 'flyer'] },
  { view: 'charts', nav: 'nav.charts', icon: 'chartsSchoko', fach: AUSSENFACH, aliases: ['charts', 'diagramme', 'statistik', 'grafik'] },
  // Gewählt 27.09.2026: Lebenssituationen als «Was steht mir zu?» über den Gegenständen
  // (und im Menü); die Arztkoffer-Ansicht «Gesundheit» im Gegenstand Arztkoffer.
  { view: 'situationen', nav: 'lebenszustaende.pageTitle', sub: 'lebenszustaende.pageSub', icon: 'health', fach: OBEN, imMenue: 6, suche: false },
  { view: 'gesundheit', nav: 'nav.arztkoffer', sub: 'nav.sub.arztkoffer', icon: 'health', fach: 'gesundheit', suche: false },
  { view: 'search', nav: 'nav.search', sub: 'nav.sub.search', icon: 'search', fach: AUSSENFACH, suche: false },

  // ── Unter Einstellungen (nicht im Rucksack) ──
  { view: 'export', nav: 'nav.export', icon: 'download', fach: EINSTELLUNGEN, aliases: ['export', 'sicherung', 'backup', 'datensicherung'] },
  { view: 'notifications', nav: 'nav.notifications', icon: 'cowbell', fach: EINSTELLUNGEN, aliases: ['benachrichtigungen', 'erinnerungen', 'notifications'] },
];

// Eindeutiger Schlüssel eines Eintrags (Kapitel-Aktionen tragen einen eigenen).
export const werkzeugKey = (w) => w.key || w.view;

// Werkzeuge eines Fachs, in Register-Reihenfolge.
export const werkzeugeImFach = (fach, liste = WERKZEUGE) => liste.filter((w) => w.fach === fach);

// Die Einträge, die zusätzlich im Menü stehen.
export const MENUE_WERKZEUGE = WERKZEUGE.filter((w) => w.imMenue).sort((a, b) => a.imMenue - b.imMenue);

// Für die Suche: nur Einträge mit eigenem View und Suchwörtern.
export const SUCHBARE_WERKZEUGE = WERKZEUGE.filter((w) => w.suche !== false && w.view !== 'chapter');
