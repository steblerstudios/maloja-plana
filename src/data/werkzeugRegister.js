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
  { view: 'tax', nav: 'nav.taxes', sub: 'nav.sub.taxes', icon: 'money', fach: 'geld', imMenue: 4, aliases: ['steuer', 'tax', 'impot', 'steuerimport', 'import', 'steuererklärung'] },
  // Seit 27.10.2026 (F7-L7) ein Eintrag: der CSV-Import ist ein Teil des Monatsbudgets; `budget` ist ein
  // Alias (utils/hashRouter.js UMLEITUNGEN). Seine Suchwörter stehen jetzt hier. Name wie der Seitentitel
  // («Monatsbudget», budgetSync.title) — vorher hiess der Eintrag «Budget-Sync» (nav.budgetSync, entfernt).
  { view: 'sync', nav: 'budgetSync.title', sub: 'nav.sub.budgetSync', icon: 'budgetWallet', fach: 'geld', aliases: ['budget', 'sync', 'ausgaben', 'haushalt', 'csv', 'import'] },
  { view: 'schulden', nav: 'nav.debts', icon: 'debt', fach: 'geld', aliases: ['schulden', 'betreibung', 'debt', 'abzahlung'] },
  { view: 'kreditkarte', nav: 'nav.kreditkarte', sub: 'nav.sub.kreditkarte', icon: 'money', fach: 'geld', aliases: ['kreditkarte', 'cashback', 'jahresgebühr', 'credit card', 'carte de crédit', 'carta di credito'] },
  // Seit 24.10.2026 keine eigene Seite: der View ist ein Alias (utils/hashRouter.js UMLEITUNGEN) und
  // führt ins Kapitel Finanzen zur Auswertung. «finanzen» als Suchwort fällt weg — das Kapitel
  // selbst steht schon in der Suche.
  // Seit 24.10.2026 (Stebler Studios, nach dem Rundgang Links/Abläufe) heisst der Eintrag wie seine
  // Zielseite «Finanzen & Geld» und steht nicht mehr im Menü — dort steht das Kapitel schon. Der
  // Untertitel unterscheidet ihn im Portemonnaie und in der Suche vom Kapitel-Treffer.
  { view: 'finanzuebersicht', nav: 'nav.finanzUebersicht', sub: 'nav.sub.finanzuebersicht', icon: 'budget', fach: 'geld', aliases: ['finanzübersicht', 'übersicht', 'overview', 'charts', 'diagramme', 'statistik', 'grafik'] },
  { view: 'stundenlohn', nav: 'nav.stundenlohn', sub: 'nav.sub.stundenlohn', icon: 'money', fach: 'geld', aliases: ['stundenlohn', 'ferienzuschlag', 'arbeit auf abruf', 'aushilfe', 'temporär', 'salaire horaire', 'salario orario', 'hourly wage'] },
  // Kein eigener View: führt ins Kapitel Finanzen (wie bisher auf dem Dashboard).
  { key: 'mindestlohn', view: 'chapter', kapitel: 'finanzen', nav: 'nav.mindestlohn', sub: 'nav.sub.mindestlohn', icon: 'money', fach: 'geld', suche: false },
  { view: 'sozialhilfe', nav: 'nav.sozialhilfe', sub: 'nav.sub.sozialhilfe', icon: 'sozialhilfe', fach: 'geld', aliases: ['skos', 'sozialhilfe', 'aide sociale'] },

  // ── Arztkoffer (Gesundheit) ──
  { view: 'premium', nav: 'nav.kvgIpv', sub: 'nav.sub.kvgIpv', icon: 'praemienverbilligung', fach: 'gesundheit', aliases: ['ipv', 'pv'] },
  // Seit Runde 9 AB (25.10.2026) die Versicherungs-Übersicht; «prämien» bleibt als Suchwort.
  { view: 'praemien', nav: 'nav.praemien', sub: 'nav.sub.praemien', icon: 'insurance', fach: 'gesundheit', aliases: ['praemien', 'prämien', 'kvg', 'versicherungen', 'assurances', 'assicurazioni', 'insurance'] },
  { view: 'kvg', nav: 'nav.kvgLeistungen', sub: 'nav.sub.kvgLeistungen', icon: 'health', fach: 'gesundheit', aliases: ['kvg', 'leistungen'] },
  { view: 'patientenverfuegung', nav: 'nav.patientenverfuegung', sub: 'nav.sub.patientenverfuegung', icon: 'document', fach: 'gesundheit', aliases: ['patientenverfügung', 'reanimation'] },
  { view: 'kk', nav: 'nav.kkScanner', icon: 'barcode', fach: 'gesundheit', aliases: ['kk', 'krankenkasse', 'scanner', 'qr', 'prämie'] },

  // ── Feldflasche (Alter) ──
  { view: 'vorsorge', nav: 'nav.vorsorge', sub: 'nav.sub.vorsorge', icon: 'vorsorge', fach: 'alter', aliases: ['ahv', 'bvg', 'pension', '3a', 'avs'] },

  // ── Geldleistungen, bisher nur über die Suche erreichbar ──
  // Entscheid Stebler Studios 27.09.2026: ALV-Taggeld und EO ins Portemonnaie.
  // Ein Name für Titel, Menü und Suche: «Arbeitslosenentschädigung» (F7, 27.10.2026); «ALV-Taggeld» bleibt Suchwort.
  { view: 'alv', nav: 'nav.alv', sub: 'nav.sub.alv', icon: 'work', fach: 'geld', aliases: ['alv', 'arbeitslos', 'rav', 'alv-taggeld', 'taggeld', 'arbeitslosenentschädigung'] },
  { view: 'eo', nav: 'nav.eo', sub: 'nav.sub.eo', icon: 'family', fach: 'geld', aliases: ['eo', 'mutterschaft', 'vaterschaft'] },

  // ── Aussenfach «Ablegen und ordnen» — Entscheid 27.09.2026 ──
  // Die drei für den Alltag stehen zusätzlich im Menü (gleicher Name, gleiches Zeichen);
  // dahinter im Menü: Steuern · Finanz-Übersicht · Lebenssituationen (gewählt 27.09.2026;
  // die Finanz-Übersicht ist seit 24.10.2026 draussen, siehe ihr Eintrag oben).
  // Zeichen seit Fassung 5 (23.10.2026): Ablage = Ordner, Kalender = Blatt mit dem
  // heutigen Tag (Europe/Zurich), Merkliste = Haken. Im Menü steht der Kalender seither
  // als Anker «Was ansteht» oben, nicht mehr unter den Werkzeugen.
  // F7-L11 (Sophie 27.10.2026): «Meine Unterlagen» und «Charts» standen als eigene Einträge im Rucksack,
  // führten aber nur über eine Umleitung auf die Dokumentenablage bzw. ins Kapitel Finanzen — doppelt mit
  // «Dokumentenablage» und «Finanzen & Geld». Die Adressen bleiben (UMLEITUNGEN), die Suchwörter wandern mit.
  { view: 'tresor', nav: 'nav.tresor', sub: 'nav.sub.tresor', icon: 'ordner', fach: AUSSENFACH, imMenue: 1, aliases: ['dokumente', 'documents', 'tresor', 'unterlagen', 'dossier', 'lebensmappe'] },
  { view: 'calendar', nav: 'nav.wasAnsteht', sub: 'nav.sub.calendar', icon: 'calendar', fach: AUSSENFACH, imMenue: 2, aliases: ['ical', 'ics', 'termine', 'kalender', 'calendrier', 'calendario', 'calendar', 'chalender'] },
  { view: 'merkliste', nav: 'nav.merkliste', sub: 'nav.sub.merkliste', icon: 'check', fach: AUSSENFACH, imMenue: 3, aliases: ['todo', 'merkliste'] },
  { view: 'cv', nav: 'nav.cv', sub: 'nav.sub.cv', icon: 'lebenslauf', fach: AUSSENFACH, aliases: ['cv', 'lebenslauf', 'resume'] },
  { view: 'direktlinks', nav: 'nav.direktlinks', sub: 'nav.sub.direktlinks', icon: 'globe', fach: AUSSENFACH, aliases: ['links', 'behoerden', 'amt'] },
  { view: 'flyer', nav: 'nav.flyer', sub: 'nav.sub.flyer', icon: 'qr', fach: AUSSENFACH, aliases: ['qr', 'teilen', 'share', 'flyer'] },
  // Gewählt 27.09.2026: Lebenssituationen als «Was steht mir zu?» über den Gegenständen
  // (und im Menü); die Arztkoffer-Ansicht «Gesundheit» im Gegenstand Arztkoffer.
  { view: 'situationen', nav: 'dashboard.anspruchTitle', sub: 'lebenszustaende.pageSub', icon: 'health', fach: OBEN, imMenue: 6, suche: false },
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
