// Steuerrechner – Direkte Bundessteuer (DBG Art. 36)
// Quelle: DBG Art. 36 Abs. 1 (Grundtarif), Abs. 2 (Verheiratetentarif)
// Stand: Steuerjahr 2024/2025
// Alle Beträge in CHF. Keine Netzwerk-Calls, reine Berechnung.

// === Grundtarif (Alleinstehende, Art. 36 Abs. 1 DBG) ===
// Progressiver Stufentarif bis CHF 755'200, darüber 11.5% flat.
const GRUNDTARIF_STUFEN = [
  { bis: 14500,  satz: 0 },
  { bis: 31600,  satz: 0.0077 },
  { bis: 41400,  satz: 0.0088 },
  { bis: 55200,  satz: 0.0264 },
  { bis: 72500,  satz: 0.0297 },
  { bis: 78100,  satz: 0.0594 },
  { bis: 103600, satz: 0.0660 },
  { bis: 134600, satz: 0.0880 },
  { bis: 176000, satz: 0.1100 },
  { bis: 755200, satz: 0.1320 },
];
const GRUNDTARIF_FLAT_GRENZE = 755200;
const GRUNDTARIF_FLAT_SATZ = 0.115;

// === Verheiratetentarif (Art. 36 Abs. 2 DBG) ===
const VERHEIRATETENTARIF_STUFEN = [
  { bis: 28300,  satz: 0 },
  { bis: 50900,  satz: 0.0100 },
  { bis: 58400,  satz: 0.0200 },
  { bis: 75300,  satz: 0.0300 },
  { bis: 90300,  satz: 0.0400 },
  { bis: 103400, satz: 0.0500 },
  { bis: 114700, satz: 0.0600 },
  { bis: 124200, satz: 0.0700 },
  { bis: 131700, satz: 0.0800 },
  { bis: 137300, satz: 0.0900 },
  { bis: 141200, satz: 0.1000 },
  { bis: 143100, satz: 0.1100 },
  { bis: 145000, satz: 0.1200 },
  { bis: 895900, satz: 0.1300 },
];
const VERHEIRATET_FLAT_GRENZE = 895900;
const VERHEIRATET_FLAT_SATZ = 0.115;

// Kinderabzug vom Steuerbetrag (Art. 36 Abs. 2bis DBG)
const KINDERABZUG_PRO_KIND = 263;

// Standardabzüge vom steuerbaren Einkommen (Bundessteuer)
const ABZUEGE = {
  versicherung: { alleinstehend: 1800, verheiratet: 3600, proKind: 700 },
  saeule3a: { mitBVG: 7258, ohneBVG: 36288 },
  berufsauslagen: { pauschal: 2000, max: 4000 },
  kinderabzug: 6700,
  zweiverdiener: 8500,
};

/**
 * Berechne Steuer nach progressivem Stufentarif.
 */
function berechneStufentarif(einkommen, stufen, flatGrenze, flatSatz) {
  if (einkommen <= 0) return 0;

  if (einkommen > flatGrenze) {
    return Math.round(einkommen * flatSatz * 100) / 100;
  }

  let steuer = 0;
  let vorherigeBis = 0;

  for (const stufe of stufen) {
    if (einkommen <= vorherigeBis) break;
    const steuerbarerTeil = Math.min(einkommen, stufe.bis) - vorherigeBis;
    if (steuerbarerTeil > 0) {
      steuer += steuerbarerTeil * stufe.satz;
    }
    vorherigeBis = stufe.bis;
  }

  return Math.round(steuer * 100) / 100;
}

/**
 * Berechne direkte Bundessteuer für Alleinstehende (Grundtarif).
 */
export function bundessteuerAlleinstehend(steuerBaresEinkommen) {
  return berechneStufentarif(
    steuerBaresEinkommen,
    GRUNDTARIF_STUFEN,
    GRUNDTARIF_FLAT_GRENZE,
    GRUNDTARIF_FLAT_SATZ
  );
}

/**
 * Berechne direkte Bundessteuer für Verheiratete (Verheiratetentarif).
 */
export function bundessteuerVerheiratet(steuerBaresEinkommen) {
  return berechneStufentarif(
    steuerBaresEinkommen,
    VERHEIRATETENTARIF_STUFEN,
    VERHEIRATET_FLAT_GRENZE,
    VERHEIRATET_FLAT_SATZ
  );
}

/**
 * Vollständige Bundessteuer-Berechnung mit Abzügen und Kinderabzug.
 *
 * @param {Object} params
 * @param {number} params.bruttoEinkommen - Brutto-Jahreseinkommen
 * @param {boolean} [params.verheiratet=false]
 * @param {number} [params.kinder=0]
 * @param {number} [params.abzuege=0] - Summe aller Abzüge vom Einkommen
 * @returns {Object}
 */
export function berechneBundessteuer({
  bruttoEinkommen,
  verheiratet = false,
  kinder = 0,
  abzuege = 0,
}) {
  if (bruttoEinkommen <= 0) {
    return {
      bruttoEinkommen: 0,
      abzuege: 0,
      steuerBaresEinkommen: 0,
      steuerVorAbzug: 0,
      kinderabzug: 0,
      steuer: 0,
      effektiverSatz: 0,
      tarif: verheiratet ? 'verheiratet' : 'alleinstehend',
    };
  }

  const steuerBaresEinkommen = Math.max(0, bruttoEinkommen - abzuege);

  const steuerVorAbzug = verheiratet
    ? bundessteuerVerheiratet(steuerBaresEinkommen)
    : bundessteuerAlleinstehend(steuerBaresEinkommen);

  const kinderabzug = kinder * KINDERABZUG_PRO_KIND;
  const steuer = Math.max(0, Math.round((steuerVorAbzug - kinderabzug) * 100) / 100);

  const effektiverSatz = bruttoEinkommen > 0
    ? Math.round((steuer / bruttoEinkommen) * 10000) / 100
    : 0;

  return {
    bruttoEinkommen,
    abzuege,
    steuerBaresEinkommen,
    steuerVorAbzug,
    kinderabzug,
    steuer,
    effektiverSatz,
    tarif: verheiratet ? 'verheiratet' : 'alleinstehend',
  };
}

/**
 * Grenzsteuersatz bei einem bestimmten Einkommen ermitteln.
 */
export function grenzsteuersatz(einkommen, verheiratet = false) {
  if (einkommen <= 0) return 0;

  const stufen = verheiratet ? VERHEIRATETENTARIF_STUFEN : GRUNDTARIF_STUFEN;
  const flatGrenze = verheiratet ? VERHEIRATET_FLAT_GRENZE : GRUNDTARIF_FLAT_GRENZE;
  const flatSatz = verheiratet ? VERHEIRATET_FLAT_SATZ : GRUNDTARIF_FLAT_SATZ;

  if (einkommen > flatGrenze) return flatSatz * 100;

  for (const stufe of stufen) {
    if (einkommen <= stufe.bis) return stufe.satz * 100;
  }

  return 0;
}

/**
 * Vergleiche Steuerbelastung: alleinstehend vs. verheiratet.
 */
export function vergleicheTarife(steuerBaresEinkommen, kinder = 0) {
  const alleinstehend = bundessteuerAlleinstehend(steuerBaresEinkommen);
  const verheiratet = bundessteuerVerheiratet(steuerBaresEinkommen);
  const kinderabzug = kinder * KINDERABZUG_PRO_KIND;

  return {
    alleinstehend: Math.max(0, alleinstehend - kinderabzug),
    verheiratet: Math.max(0, verheiratet - kinderabzug),
    differenz: Math.round((alleinstehend - verheiratet) * 100) / 100,
    steuerBaresEinkommen,
  };
}

export const STEUER_PARAMS = {
  kinderabzugProKind: KINDERABZUG_PRO_KIND,
  grundtarifFlatGrenze: GRUNDTARIF_FLAT_GRENZE,
  grundtarifFlatSatz: GRUNDTARIF_FLAT_SATZ * 100,
  verheiratatFlatGrenze: VERHEIRATET_FLAT_GRENZE,
  verheiratatFlatSatz: VERHEIRATET_FLAT_SATZ * 100,
  abzuege: ABZUEGE,
};

export const STEUER_DATA_VERSION = '2024/2025';
export const STEUER_DATA_SOURCE = 'DBG Art. 36, ESTV Tarife 2024/2025';
