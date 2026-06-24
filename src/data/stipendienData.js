// Schweizer Ausbildungsbeiträge (Stipendien & Darlehen) — verifizierte Grunddaten
// Quellen: EDK (Schweizerische Konferenz der kantonalen Erziehungsdirektoren),
// Stipendien-Konkordat 2009 (in Kraft seit 1.3.2013), ch.ch, SBFI.
// Stand: 2026-06. Stipendien sind KANTONAL geregelt — exakte Beträge/Grenzen
// variieren pro Kanton und ändern jährlich; diese App gibt Orientierung, keine
// verbindliche Zusage.

export const STIPENDIEN_DATA_VERSION = '2026-06';

// Offizielle, stabile Top-Quellen (kantonsübergreifend)
export const STIPENDIEN_OFFICIAL = {
  edkOverview: 'https://www.edk.ch/de/themen/stipendien',
  edkCantonalOffices: 'https://www.edk.ch/de/themen/stipendien/stipendienstellen',
  sbfiFederal: 'https://www.sbfi.admin.ch/de/stipendien',
};

// Berechtigung — harmonisiert über das Stipendien-Konkordat (Mindeststandards)
export const STIPENDIEN_ELIGIBILITY = {
  // Wer grundsätzlich Ausbildungsbeiträge beantragen kann
  whoKeys: ['swiss', 'foreigner5y', 'euefta', 'refugee'],
  // Nicht berechtigt: Personen, die sich ausschliesslich für die Ausbildung in CH aufhalten
  // Was abgedeckt ist (Erstausbildung)
  scopeKeys: ['sekII', 'tertiaer', 'bridge'],
  // Zuständigkeit: i.d.R. Wohnsitzkanton der Eltern (bzw. letzte/r Inhaber/in der elterlichen Sorge)
};

// Privates "Stipendienverzeichnis" — Stiftungen & Fonds, falls kantonal abgewiesen
// oder ergänzend. Transparenz: gratis vs. kostenpflichtig klar gekennzeichnet.
export const STIPENDIEN_PRIVATE = [
  {
    id: 'eth',
    url: 'https://ethz.ch/content/dam/ethz/main/education/finanzielles/files-de/stiftungsverzeichnis-schweiz.pdf',
    cost: 'free',     // gratis PDF, 150+ Stiftungen
  },
  {
    id: 'culturalpromotion',
    url: 'https://www.culturalpromotion.ch',
    cost: 'free',     // Bundesamt für Kultur + Migros-Kulturprozent
  },
  {
    id: 'fundraiso',
    url: 'https://www.fundraiso.ch',
    cost: 'freemium', // Basis gratis, Pro CHF 290/Jahr
  },
  {
    id: 'stipendiumch',
    url: 'https://www.stipendium.ch',
    cost: 'paid',     // CHF 78 Pauschale pro Anfrage
  },
];

export function getStipendienPrivate() {
  return STIPENDIEN_PRIVATE;
}
