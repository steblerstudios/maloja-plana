import { ageClassFromBirth, franchiseOptimierer } from './franchiseTacho.js';

// Franchise-Optimierer fürs Dashboard-Instrument, im Hintergrund nachgeladen (25.09.2026).
// PLZ-, Regionen- und Prämientabellen sind zusammen gut 500 kB Rohdaten — sie kommen erst,
// wenn Krankenkasse UND PLZ erfasst sind, als eigene Chunks (dieselben, die die Prämien-Seite
// lädt). Gerechnet wird mit franchiseOptimierer(), derselben Funktion wie auf der Seite.
// Mehrdeutige PLZ (mehrere Prämienregionen) → null: dort wählt man die Gemeinde auf der Seite.
export async function ladeFranchiseOpt(data) {
  const plz = String(data?.wohnen?.postalCode || '').trim();
  const kasse = data?.versicherungen?.kkInsurer;
  if (plz.length !== 4 || !kasse) return null;
  const [{ lookupPLZ }, { getRegionInfo }, { getInsurerAllFranchises, insurerNrFromName }] = await Promise.all([
    import('./plzGemeinde.js'), import('./praemienRegionen.js'), import('./praemienDetail.js'),
  ]);
  const nr = insurerNrFromName(kasse);
  if (!nr) return null;
  const regionen = new Map();
  for (const g of lookupPLZ(plz)) {
    const r = getRegionInfo(g.bfsNr);
    if (r) regionen.set(r.kanton + '/' + r.region, r);
  }
  if (regionen.size !== 1) return null;
  const { kanton, region } = [...regionen.values()][0];
  const ageClass = ageClassFromBirth(data?.basis?.dateOfBirth);
  return franchiseOptimierer(getInsurerAllFranchises(nr, kanton, region, ageClass), ageClass);
}
