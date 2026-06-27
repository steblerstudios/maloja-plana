// Asyl-Orientierung — verifizierte Grunddaten (Stand 2025).
// Quellen: SEM (sem.admin.ch), Schweizerische Flüchtlingshilfe (fluechtlingshilfe.ch),
// humanrights.ch, kantonale Migrationsämter.
// ACHTUNG: Orientierung, KEINE Rechtsberatung. Massgebend sind SEM und die
// Beratungsstellen. Statusrechte sind vereinfacht zusammengefasst.

// Ausweis-/Statustypen im Schweizer Asylbereich. Beschreibungstexte in i18n
// (asyl.status.<key>.*), damit sie in allen Sprachen verfügbar sind.
export const ASYL_STATUS = [
  { key: 'n', ausweis: 'N' }, // Asylsuchende, laufendes Verfahren
  { key: 's', ausweis: 'S' }, // Schutzbedürftige (kollektiver Schutz, z.B. Ukraine 2022)
  { key: 'f', ausweis: 'F' }, // Vorläufig aufgenommen
  { key: 'b', ausweis: 'B' }, // Anerkannte Flüchtlinge mit Asyl
];

// Verifizierte Anlauf- und Beratungsstellen. Namen/URLs/Telefon nicht übersetzt;
// «was sie tun» kommt aus i18n (asyl.org.<id>).
export const ASYL_ORGS = [
  {
    id: 'sem',
    name: 'Staatssekretariat für Migration (SEM)',
    url: 'https://www.sem.admin.ch/sem/de/home/asyl.html',
    official: true,
  },
  {
    id: 'sfh',
    name: 'Schweizerische Flüchtlingshilfe (SFH/OSAR)',
    url: 'https://www.fluechtlingshilfe.ch/',
  },
  {
    id: 'caritas',
    name: 'Caritas — Rechtsberatung Asyl',
    url: 'https://www.caritas.ch/de/rechtsberatung-asyl-und-auslaenderrecht/',
    phone: '041 419 23 85',
  },
  {
    id: 'heks',
    name: 'HEKS/EPER — Rechtsberatungsstellen',
    url: 'https://www.heks.ch/',
  },
  {
    id: 'srk',
    name: 'Schweizerisches Rotes Kreuz — Migration',
    url: 'https://www.redcross.ch/de/unser-engagement/unsere-schwerpunkte/migration-und-flucht',
  },
];

// Grobe Verfahrensschritte (Beschreibung in i18n asyl.process.<key>).
export const ASYL_PROCESS = ['gesuch', 'baz', 'verfahren', 'entscheid', 'beschwerde'];

// Rechte im Verfahren (Beschreibung in i18n asyl.rights.<key>).
// Verifiziert (fluechtlingshilfe.ch / SEM): unentgeltliche Rechtsvertretung wird
// im Bundesasylzentrum zugewiesen; Anspruch auf Anhörung mit Dolmetschen;
// Beschwerdefristen kurz (beschleunigt 7 Arbeitstage, erweitert 30 Tage).
export const ASYL_RIGHTS = ['rechtsvertretung', 'anhoerung', 'beschwerde'];

// ── Kantonale/regionale Asyl-Rechtsberatung ──
// Quelle: SFH/OSAR-Adressliste (fluechtlingshilfe.ch, RBSadr_extern.pdf) +
// HEKS/Caritas/CSP-Stellen, alle URLs einzeln verifiziert (Stand 2025/2026).
// Beratung ist teils regional organisiert — mehrere Kantone teilen sich eine
// Stelle (das entspricht der realen Organisation, kein Datenfehler).
// «Was sie tun» ist überall gleich (unentgeltliche Rechtsberatung im Asyl-/
// Ausländerrecht) → eine gemeinsame i18n-Beschreibung asyl.counseling.desc.
// Namen sind Eigennamen und bleiben unübersetzt.
export const ASYL_COUNSELING = {
  heks_zh:  { name: 'HEKS Rechtsberatungsstelle für Asylsuchende Zürich', url: 'https://www.heks.ch/was-wir-tun/heks-rechtsberatungsstelle-fuer-asylsuchende-zuerich' },
  heks_ag:  { name: 'HEKS Rechtsberatungsstelle für Asylsuchende Aargau', url: 'https://www.heks.ch/was-wir-tun/rechtsberatungsstelle-fuer-asylsuchende-aargau' },
  heks_so:  { name: 'HEKS Rechtsberatungsstelle Solothurn (Rebaso)', url: 'https://www.heks.ch/was-wir-tun/rechtsberatungsstelle-fuer-asylsuchende-solothurn' },
  heks_ost: { name: 'HEKS Rechtsberatungsstelle Ostschweiz', url: 'https://www.heks.ch/was-wir-tun/heks-rechtsberatungsstelle-fuer-asylsuchende-st-gallenappenzell' },
  heks_bas: { name: 'BAS – Beratungsstelle für Asylsuchende beider Basel', url: 'https://www.heks.ch/was-wir-tun/bas-beratungsstelle-fuer-asylsuchende' },
  anlauf_bl:{ name: 'Anlaufstelle Baselland', url: 'https://anlaufstellebl.ch/' },
  rbs_bern: { name: 'Berner Rechtsberatungsstelle für Menschen in Not', url: 'https://www.rechtsberatungsstelle.ch/' },
  caritas_zentral: { name: 'Caritas – Rechtsberatung Asyl (Zentralschweiz)', url: 'https://www.caritas.ch/de/rechtsberatung-asyl-und-auslaenderrecht/', phone: '041 419 23 85' },
  caritas_fr: { name: 'Caritas – Rechtsberatung Asyl (Freiburg)', url: 'https://www.caritas.ch/de/rechtsberatung-asyl-und-auslaenderrecht/' },
  csp_beju: { name: 'Centre Social Protestant (CSP) Bern-Jura', url: 'https://csp.ch/berne-jura/' },
  csp_ge:   { name: 'Centre Social Protestant (CSP) Genève', url: 'https://csp.ch/geneve/' },
  csp_ne:   { name: 'Centre Social Protestant (CSP) Neuchâtel', url: 'https://csp.ch/neuchatel/' },
  asyl_gr:  { name: 'Bündner Beratungsstelle für Asylsuchende', url: 'https://www.asylgr.ch/' },
  sah_sh:   { name: 'SAH Schaffhausen – Rechtsberatung Asyl', url: 'https://sah-sh.ch/angebot/rechtsberatung/' },
  sos_ti:   { name: 'SOS Ticino – Servizio giuridico', url: 'https://www.sos-ti.ch/' },
  saje_vd:  { name: 'EPER – Service d’Aide Juridique aux Exilé·e·s (SAJE)', url: 'https://www.eper.ch/project-explorer/service-daide-juridique-aux-exile-e-s-saje' },
  forum_vs: { name: 'Forum Migration Wallis – Juristische Beratung', url: 'https://www.forum-migration.ch/was-wir-tun-anbieten/rechtliches/juristische-beratung' },
};

// Kanton (2-stelliger Code) → zuständige Beratungsstelle (Schlüssel in ASYL_COUNSELING).
export const CANTON_COUNSELING = {
  ZH: 'heks_zh', GL: 'heks_zh',                                  // HEKS Zürich berät ZH + GL
  BE: 'rbs_bern',
  LU: 'caritas_zentral', UR: 'caritas_zentral', SZ: 'caritas_zentral',
  OW: 'caritas_zentral', NW: 'caritas_zentral', ZG: 'caritas_zentral',
  FR: 'caritas_fr',
  SO: 'heks_so', BS: 'heks_bas', BL: 'anlauf_bl', SH: 'sah_sh',
  SG: 'heks_ost', AI: 'heks_ost', AR: 'heks_ost', TG: 'heks_ost', // HEKS Ostschweiz
  GR: 'asyl_gr', AG: 'heks_ag', TI: 'sos_ti', VD: 'saje_vd', VS: 'forum_vs',
  NE: 'csp_ne', GE: 'csp_ge', JU: 'csp_beju',
};

// Beratungsstelle für einen Kanton holen (oder null, falls Code unbekannt).
export function counselingForCanton(canton) {
  const id = CANTON_COUNSELING[canton];
  return id ? { id, ...ASYL_COUNSELING[id] } : null;
}

export const ASYL_DATA_VERSION = '2025';
