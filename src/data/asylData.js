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

export const ASYL_DATA_VERSION = '2025';
