// Regionale Vergünstigungen bei tiefem Einkommen — kantonal/städtisch verschieden.
// Der Schlüssel ist die KulturLegi (Caritas): sie pflegt pro Region ein Verzeichnis
// vergünstigter Angebote. Wo eine Region keine (oder kaum) Angebote hat, wird das
// würdevoll kommuniziert, statt Angebote vorzutäuschen — die regionale Lücke wird
// sichtbar (spätere Petitions-Saat), analog zu mietzinsbeitraege.js.
//
// Drei Zustände (wie mietzinsbeitraege.js):
//   'has'   — Region mit recherchierten, konkreten Angeboten → affirmativ + Links
//   'check' — nicht kuratiert; KulturLegi gibt es fast überall → „schau bei deiner regionalen KulturLegi"
//   'none'  — bestätigt keine regionale KulturLegi → würdevoll „gibt's hier (noch) nicht"
//
// Konservativ: nur solide belegte Regionen sind 'has'; alles andere 'check' (nie ein
// falsches 'none'). URLs 2026 web-verifiziert; bei Pflege gegen die Quellen prüfen.

export const KULTURLEGI_NATIONAL_URL = 'https://www.kulturlegi.ch/';
export const REGIO_DATA_VERSION = '2026';

// Kuratierte Regionen. offers[].key → i18n unter lebenszustaende.regio.offers.<key>.
const REGIONS = {
  // Basel-Stadt & Basel-Landschaft teilen „KulturLegi beider Basel" + Familienpass Region Basel.
  BS: {
    state: 'has',
    kulturlegiUrl: 'https://www.kulturlegi.ch/beider-basel',
    offers: [
      { key: 'familienpass',    url: 'https://www.familienpass.ch/' },
      { key: 'volkszahnklinik', url: 'https://www.sozialesbasel.ch/angebote/volkszahnklinik' },
      { key: 'vhsbb',           url: 'https://www.vhsbb.ch/kursprogramm/ermaessigung-275732' },
    ],
    stand: '2026',
  },
  BL: {
    state: 'has',
    kulturlegiUrl: 'https://www.kulturlegi.ch/beider-basel',
    offers: [
      { key: 'familienpass', url: 'https://www.familienpass.ch/' },
      { key: 'vhsbb',        url: 'https://www.vhsbb.ch/kursprogramm/ermaessigung-275732' },
    ],
    stand: '2026',
  },
};

// Liefert Verfügbarkeit + Angebote für einen Kanton (Fallback: 'check' + nationale KulturLegi).
export function getRegionaleVerguenstigungen(canton) {
  const r = REGIONS[canton];
  if (r) return { ...r, canton };
  return { state: 'check', kulturlegiUrl: KULTURLEGI_NATIONAL_URL, offers: [], canton };
}
