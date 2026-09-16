// E37 / K37 — Einkommensband, in dem der Kantons-/Gemeindesteuer-Faktor aus
// kantonaleSteuerdaten.js belegt ist. GENERIERT von scripts/steuerband-messen.mjs — nicht von Hand ändern.
// Messpunkte und Methode: docs/sources/steuerfaktor-band-2026.md
//
// bandMin/bandMax = steuerbares Einkommen Bund (CHF), gemessen an den ESTV-Werten. Innerhalb
// liegt das Modell (Faktor × Bundessteuer) an jedem Messpunkt höchstens ±15 % neben der
// ESTV-Kantons- und Gemeindesteuer. null = kein solcher Bereich gefunden → keine Zahl zeigen.
// Gemessen nur ohne Kinder; ledig und verheiratet (Alleinverdiener) getrennt.

export const STEUERBAND_TOLERANZ = 0.15;
export const STEUERBAND_QUELLE = 'ESTV Steuerrechner (swisstaxcalculator.estv.admin.ch), Steuerjahr 2026, Kantonshauptort, ohne Kirchensteuer';
export const STEUERBAND_STAND = '2026';
export const STEUERBAND_GEPRUEFT_AM = '2026-09-16';

// Je Eintrag: bandMin, bandMax, quelle, stand, geprueftAm.
const b = (bandMin, bandMax) => ({ bandMin, bandMax, quelle: STEUERBAND_QUELLE, stand: STEUERBAND_STAND, geprueftAm: STEUERBAND_GEPRUEFT_AM });

export const STEUERFAKTOR_BAND = {
  AG: { ledig: b(126501, 174339), verheiratet: b(133159, 160519) },
  AI: { ledig: b(115626, 146979), verheiratet: b(133159, 151399) },
  AR: { ledig: b(146979, 192579), verheiratet: b(160519, 187879) },
  BE: { ledig: b(137859, 183459), verheiratet: b(160519, 178759) },
  BL: { ledig: b(183459, 265539), verheiratet: b(169639, 215239) },
  BS: { ledig: b(115626, 146979), verheiratet: b(133159, 151399) },
  FR: { ledig: b(146979, 201699), verheiratet: b(151399, 178759) },
  GE: { ledig: b(117801, 156099), verheiratet: b(121801, 151399) },
  GL: { ledig: b(126501, 165219), verheiratet: b(151399, 169639) },
  GR: { ledig: b(137859, 174339), verheiratet: b(142279, 169639) },
  JU: { ledig: b(124327, 165219), verheiratet: b(142279, 160519) },
  LU: { ledig: b(111275, 137859), verheiratet: b(133159, 151399) },
  NE: { ledig: b(137859, 183459), verheiratet: b(151399, 169639) },
  NW: { ledig: b(156099, 192579), verheiratet: b(160519, 196999) },
  OW: { ledig: b(117801, 146979), verheiratet: b(151399, 160519) },
  SG: { ledig: b(156099, 201699), verheiratet: b(160519, 187879) },
  SH: { ledig: b(117801, 156099), verheiratet: b(133159, 151399) },
  SO: { ledig: b(146979, 192579), verheiratet: b(160519, 178759) },
  SZ: { ledig: b(126501, 165219), verheiratet: b(142279, 169639) },
  TG: { ledig: b(146979, 183459), verheiratet: b(151399, 178759) },
  TI: { ledig: b(137859, 183459), verheiratet: b(151399, 178759) },
  UR: { ledig: b(117801, 146979), verheiratet: b(151399, 160519) },
  VD: { ledig: b(137859, 183459), verheiratet: b(151399, 169639) },
  VS: { ledig: b(165219, 229059), verheiratet: b(151399, 196999) },
  ZG: { ledig: b(106925, 183459), verheiratet: b(82647, 124039) },
  ZH: { ledig: b(117801, 165219), verheiratet: b(142279, 160519) },
};

/**
 * Liegt die Schätzung im belegten Band?
 *   'innerhalb'  → Zahl zeigen (als grobe Schätzung gekennzeichnet)
 *   'ausserhalb' → Band existiert, das Einkommen liegt nicht darin → keine Zahl
 *   'ungeprueft' → kein Band für diese Lage (unbekannter Kanton, kein Band gefunden oder Kinder,
 *                  denn gemessen wurde nur ohne Kinder) → keine Zahl
 * @returns {{ lage: string, band: object|null }}
 */
export function steuerbandLage(kuerzel, steuerbaresEinkommen, { verheiratet = false, kinder = 0 } = {}) {
  const kanton = STEUERFAKTOR_BAND[kuerzel];
  const band = kanton ? kanton[verheiratet ? 'verheiratet' : 'ledig'] : null;
  if (!band || kinder > 0) return { lage: 'ungeprueft', band: null };
  const drin = steuerbaresEinkommen >= band.bandMin && steuerbaresEinkommen <= band.bandMax;
  return { lage: drin ? 'innerhalb' : 'ausserhalb', band };
}
