// Steuerrechner – Direkte Bundessteuer (DBG Art. 36)
// Quelle: EFD-Rundschreiben "Ausgleich der kalten Progression … Steuerjahr 2026"
//         (Verordnung über die kalte Progression VKP, SR 642.119.2); Tarif 2026 (Art. 36 DBG).
// Stand: Steuerjahr 2026. Alle Beträge in CHF. Keine Netzwerk-Calls, reine Berechnung.
//
// Modell: pro Stufe die offizielle Grundsteuer bei der Untergrenze (ab) + Grenzsatz darüber.
// Damit deckt sich das Resultat aufs Rappen mit der amtlichen ESTV-Tariftabelle
// (Prüfanker: 60'000 → 671.40, 100'000 → 2'684.35; Verheiratete 53'400 → 237.00).

// === Grundtarif (Alleinstehende, Art. 36 Abs. 1 DBG), Tarif 2026 ===
// ab = Einkommensuntergrenze, grundsteuer = amtliche Steuer bei genau 'ab', satz = Grenzsatz darüber.
const GRUNDTARIF_STUFEN = [
  { ab: 15200,  grundsteuer: 0,        satz: 0.0077 },
  { ab: 33200,  grundsteuer: 138.60,   satz: 0.0088 },
  { ab: 43500,  grundsteuer: 229.20,   satz: 0.0264 },
  { ab: 58000,  grundsteuer: 612.00,   satz: 0.0297 },
  { ab: 76200,  grundsteuer: 1152.50,  satz: 0.0594 },
  { ab: 82100,  grundsteuer: 1502.95,  satz: 0.0660 },
  { ab: 108900, grundsteuer: 3271.75,  satz: 0.0880 },
  { ab: 141500, grundsteuer: 6140.55,  satz: 0.1100 },
  { ab: 185100, grundsteuer: 10936.55, satz: 0.1320 },
];
const GRUNDTARIF_FLAT_GRENZE = 793900; // darüber 11.5% des gesamten Einkommens
const GRUNDTARIF_FLAT_SATZ = 0.115;

// === Verheiratetentarif (Art. 36 Abs. 2 DBG), Tarif 2026 ===
const VERHEIRATETENTARIF_STUFEN = [
  { ab: 29700,  grundsteuer: 0,       satz: 0.0100 },
  { ab: 53400,  grundsteuer: 237.00,  satz: 0.0200 },
  { ab: 61300,  grundsteuer: 395.00,  satz: 0.0300 },
  { ab: 79100,  grundsteuer: 929.00,  satz: 0.0400 },
  { ab: 94900,  grundsteuer: 1561.00, satz: 0.0500 },
  { ab: 108700, grundsteuer: 2251.00, satz: 0.0600 },
  { ab: 120600, grundsteuer: 2965.00, satz: 0.0700 },
  { ab: 130500, grundsteuer: 3658.00, satz: 0.0800 },
  { ab: 138400, grundsteuer: 4290.00, satz: 0.0900 },
  { ab: 144300, grundsteuer: 4821.00, satz: 0.1000 },
  { ab: 148300, grundsteuer: 5221.00, satz: 0.1100 },
  { ab: 150400, grundsteuer: 5452.00, satz: 0.1200 },
  { ab: 152400, grundsteuer: 5692.00, satz: 0.1300 },
];
const VERHEIRATET_FLAT_GRENZE = 941300;
const VERHEIRATET_FLAT_SATZ = 0.115;

// Kinderabzug vom Steuerbetrag (Art. 36 Abs. 2bis DBG)
const KINDERABZUG_PRO_KIND = 263;

// Standardabzüge vom steuerbaren Einkommen (Bundessteuer)
const ABZUEGE = {
  versicherung: { alleinstehend: 1800, verheiratet: 3700, proKind: 700 },
  saeule3a: { mitBVG: 7258, ohneBVG: 36288 },
  berufsauslagen: { pauschal: 2000, max: 4000 },
  kinderabzug: 6800,
  zweiverdiener: 8600,
};

/**
 * Berechne Steuer nach progressivem Stufentarif.
 */
function berechneStufentarif(einkommen, stufen, flatGrenze, flatSatz) {
  if (einkommen <= 0) return 0;

  // Über der oberen Tarifgrenze: einheitlich 11.5% des gesamten Einkommens.
  if (einkommen > flatGrenze) {
    return Math.round(einkommen * flatSatz * 100) / 100;
  }

  // Unterhalb der ersten Stufe (steuerfreies Minimum): keine Steuer.
  if (einkommen < stufen[0].ab) return 0;

  // Höchste Stufe, deren Untergrenze das Einkommen erreicht; amtliche Grundsteuer + Grenzsatz.
  let stufe = stufen[0];
  for (const s of stufen) {
    if (einkommen >= s.ab) stufe = s;
    else break;
  }

  const steuer = stufe.grundsteuer + (einkommen - stufe.ab) * stufe.satz;
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
  if (einkommen < stufen[0].ab) return 0;

  let satz = 0;
  for (const s of stufen) {
    if (einkommen >= s.ab) satz = s.satz;
    else break;
  }
  return satz * 100;
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

export const STEUER_DATA_VERSION = '2026';
export const STEUER_DATA_SOURCE = 'DBG Art. 36, ESTV/EFD Tarif 2026 (kalte Progression, VKP SR 642.119.2)';
