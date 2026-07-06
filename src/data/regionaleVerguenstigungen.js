// Regionale Vergünstigungen bei tiefem Einkommen — kantonal/städtisch verschieden.
// Der Schlüssel ist die KulturLegi (Caritas): sie pflegt pro Region ein Verzeichnis
// vergünstigter Angebote. Wo eine Region keine eigene KulturLegi-Seite hat, wird das
// würdevoll kommuniziert, statt Angebote vorzutäuschen — die regionale Lücke wird
// sichtbar (spätere Petitions-Saat), analog zu mietzinsbeitraege.js.
//
// Drei Zustände (wie mietzinsbeitraege.js):
//   'has'   — Kanton mit eigener, web-verifizierter regionaler KulturLegi → affirmativ + Link
//             (plus kuratierte Zusatz-Angebote, wo unten gepflegt)
//   'check' — keine eigene Regionalseite bekannt → „schau bei deiner regionalen KulturLegi"
//             (nationale Seite; z. B. Ticino verweist auf die nationale Stelle)
//   'none'  — bestätigt keine KulturLegi → würdevoll „gibt's hier (noch) nicht"
//
// Konservativ: nur Kantone mit web-verifizierter Regionalseite sind 'has'; alles andere
// 'check' (nie ein falsches 'none'). Alle URLs 2026 einzeln web-verifiziert; bei Pflege
// gegen die Quellen prüfen. KulturLegi ist national → aktuell kein ehrliches 'none'.

export const KULTURLEGI_NATIONAL_URL = 'https://www.kulturlegi.ch/';
export const REGIO_DATA_VERSION = '2026';

// Kanton → eigene regionale KulturLegi-Seite (web-verifiziert 2026-07). Einzige Quelle
// der Wahrheit für die Abdeckung. Deutschsprachige Kantone: kulturlegi.ch/<region>;
// französischsprachige: carteculture.ch. Ticino (TI) hat keine eigene Seite (404) →
// bewusst NICHT gelistet, fällt auf 'check' (nationale Stelle).
const KULTURLEGI_REGIONS = {
  AG: 'https://www.kulturlegi.ch/aargau',
  AI: 'https://www.kulturlegi.ch/st-gallen-appenzell',
  AR: 'https://www.kulturlegi.ch/st-gallen-appenzell',
  BE: 'https://www.kulturlegi.ch/kanton-bern',
  BL: 'https://www.kulturlegi.ch/beider-basel',
  BS: 'https://www.kulturlegi.ch/beider-basel',
  FR: 'https://www.kulturlegi.ch/freiburg-und-region',
  GL: 'https://www.kulturlegi.ch/glarus',
  GR: 'https://www.kulturlegi.ch/graubuenden',
  LU: 'https://www.kulturlegi.ch/zentralschweiz',
  NW: 'https://www.kulturlegi.ch/zentralschweiz',
  OW: 'https://www.kulturlegi.ch/zentralschweiz',
  SG: 'https://www.kulturlegi.ch/st-gallen-appenzell',
  SH: 'https://www.kulturlegi.ch/schaffhausen',
  SO: 'https://www.kulturlegi.ch/kanton-solothurn',
  SZ: 'https://www.kulturlegi.ch/zentralschweiz',
  TG: 'https://www.kulturlegi.ch/kanton-thurgau',
  UR: 'https://www.kulturlegi.ch/zentralschweiz',
  VS: 'https://www.kulturlegi.ch/wallis',
  ZG: 'https://www.kulturlegi.ch/zentralschweiz',
  ZH: 'https://www.kulturlegi.ch/zuerich',
  // Französischsprachige Kantone → CarteCulture (carteculture.ch)
  GE: 'https://www.carteculture.ch/',
  JU: 'https://www.carteculture.ch/',
  NE: 'https://www.carteculture.ch/',
  VD: 'https://www.carteculture.ch/',
};

// Kuratierte Zusatz-Angebote je Kanton (über die KulturLegi hinaus). offers[].key →
// i18n unter lebenszustaende.regio.offers.<key>. Nur wo solide web-verifiziert.
// Basel-Stadt & Basel-Landschaft: Familienpass Region Basel, Volkshochschule beider Basel.
// Zürich: die „Freikarten & Aktionen"-Sammelseite (konkrete Gutschein-Aktionen).
const REGIONS = {
  ZH: {
    offers: [
      { key: 'zhAktionen', url: 'https://www.kulturlegi.ch/zuerich/angebote/freikarten-und-aktionen' },
    ],
  },
  BS: {
    offers: [
      { key: 'familienpass',    url: 'https://www.familienpass.ch/' },
      { key: 'volkszahnklinik', url: 'https://www.sozialesbasel.ch/angebote/volkszahnklinik' },
      { key: 'vhsbb',           url: 'https://www.vhsbb.ch/kursprogramm/ermaessigung-275732' },
    ],
  },
  BL: {
    offers: [
      { key: 'familienpass', url: 'https://www.familienpass.ch/' },
      { key: 'vhsbb',        url: 'https://www.vhsbb.ch/kursprogramm/ermaessigung-275732' },
    ],
  },
};

// Liefert Verfügbarkeit + Angebote für einen Kanton. Kanton mit verifizierter Regionalseite
// → 'has' (affirmativ) mit kuratierten Zusatz-Angeboten, falls vorhanden. Sonst 'check' +
// nationale KulturLegi (nie ein falsches 'none').
export function getRegionaleVerguenstigungen(canton) {
  const url = KULTURLEGI_REGIONS[canton];
  if (url) {
    const curated = REGIONS[canton];
    return { state: 'has', kulturlegiUrl: url, offers: curated ? curated.offers : [], canton };
  }
  return { state: 'check', kulturlegiUrl: KULTURLEGI_NATIONAL_URL, offers: [], canton };
}
