// EO-Rechner (Erwerbsersatzordnung) für Maloja Plana
// Quelle: EOG Art. 16a–16g, EOMV (Mutterschaftsentschädigung),
//         EOG Art. 16i–16k (Vaterschaftsentschädigung seit 01.01.2021),
//         EOG Art. 16l–16n (Adoptionsentschädigung seit 01.01.2023)
// Stand: 2026
//
// Alle Beträge in CHF. Keine Netzwerk-Calls, reine Berechnung.

// === EO-Parameter 2026 ===
const MAX_TAGGELD = 220;          // Maximales Taggeld (CHF/Tag)
const ENTSCHAEDIGUNGSSATZ = 0.80; // 80% des Einkommens

// Mutterschaft
const MUTTERSCHAFT_WOCHEN = 14;   // 14 Wochen = 98 Tage
const MUTTERSCHAFT_TAGE = 98;
const MUTTERSCHAFT_MIN_MONATE_AVS = 9; // Mindestens 9 Monate AHV-versichert vor Geburt
const MUTTERSCHAFT_MIN_MONATE_ARBEIT = 5; // Mindestens 5 Monate erwerbstätig in letzten 9 Monaten

// Vaterschaft (seit 01.01.2021)
const VATERSCHAFT_WOCHEN = 2;     // 2 Wochen = 14 Tage
const VATERSCHAFT_TAGE = 14;
const VATERSCHAFT_FRIST_MONATE = 6; // Bezug innerhalb 6 Monaten nach Geburt

// Adoption (seit 01.01.2023)
const ADOPTION_WOCHEN = 2;        // 2 Wochen = 14 Tage
const ADOPTION_TAGE = 14;
const ADOPTION_MAX_ALTER_KIND = 4; // Kind muss unter 4 Jahre alt sein

// Betreuungsentschädigung (seit 01.07.2021)
const BETREUUNG_MAX_TAGE = 14;    // Max 14 Tage pro Ereignis

/**
 * Berechne das Taggeld basierend auf dem Einkommen.
 */
function taggeldAusEinkommen(jahreseinkommen) {
  if (jahreseinkommen <= 0) return 0;
  const tageseinkommen = jahreseinkommen / 365;
  const taggeld = tageseinkommen * ENTSCHAEDIGUNGSSATZ;
  return Math.min(Math.round(taggeld * 100) / 100, MAX_TAGGELD);
}

/**
 * Berechne Mutterschaftsentschädigung.
 *
 * @param {Object} params
 * @param {number} params.jahreseinkommen - Brutto-Jahreseinkommen vor Geburt
 * @param {boolean} [params.erwerbstaetig=true] - Mindestens 5 Monate erwerbstätig
 * @returns {Object} Entschädigungsberechnung
 */
export function berechneMutterschaft({ jahreseinkommen, erwerbstaetig = true }) {
  if (!erwerbstaetig || jahreseinkommen <= 0) {
    return {
      anspruch: false,
      grund: !erwerbstaetig ? 'nicht_erwerbstaetig' : 'kein_einkommen',
      taggeld: 0,
      totalEntschaedigung: 0,
    };
  }

  const taggeld = taggeldAusEinkommen(jahreseinkommen);

  return {
    anspruch: true,
    typ: 'mutterschaft',
    wochen: MUTTERSCHAFT_WOCHEN,
    tage: MUTTERSCHAFT_TAGE,
    taggeld,
    totalEntschaedigung: Math.round(taggeld * MUTTERSCHAFT_TAGE * 100) / 100,
    monatsaequivalent: Math.round(taggeld * 30 * 100) / 100,
    entschaedigungssatz: ENTSCHAEDIGUNGSSATZ * 100,
    maxTaggeld: MAX_TAGGELD,
    istPlafoniert: taggeld >= MAX_TAGGELD,
  };
}

/**
 * Berechne Vaterschaftsentschädigung.
 */
export function berechneVaterschaft({ jahreseinkommen }) {
  if (jahreseinkommen <= 0) {
    return { anspruch: false, grund: 'kein_einkommen', taggeld: 0, totalEntschaedigung: 0 };
  }

  const taggeld = taggeldAusEinkommen(jahreseinkommen);

  return {
    anspruch: true,
    typ: 'vaterschaft',
    wochen: VATERSCHAFT_WOCHEN,
    tage: VATERSCHAFT_TAGE,
    taggeld,
    totalEntschaedigung: Math.round(taggeld * VATERSCHAFT_TAGE * 100) / 100,
    entschaedigungssatz: ENTSCHAEDIGUNGSSATZ * 100,
    maxTaggeld: MAX_TAGGELD,
    fristMonate: VATERSCHAFT_FRIST_MONATE,
    istPlafoniert: taggeld >= MAX_TAGGELD,
  };
}

/**
 * Berechne Adoptionsentschädigung.
 */
export function berechneAdoption({ jahreseinkommen }) {
  if (jahreseinkommen <= 0) {
    return { anspruch: false, grund: 'kein_einkommen', taggeld: 0, totalEntschaedigung: 0 };
  }

  const taggeld = taggeldAusEinkommen(jahreseinkommen);

  return {
    anspruch: true,
    typ: 'adoption',
    wochen: ADOPTION_WOCHEN,
    tage: ADOPTION_TAGE,
    taggeld,
    totalEntschaedigung: Math.round(taggeld * ADOPTION_TAGE * 100) / 100,
    entschaedigungssatz: ENTSCHAEDIGUNGSSATZ * 100,
    maxTaggeld: MAX_TAGGELD,
    maxAlterKind: ADOPTION_MAX_ALTER_KIND,
    istPlafoniert: taggeld >= MAX_TAGGELD,
  };
}

/**
 * Berechne Betreuungsentschädigung (schwer krankes Kind).
 */
export function berechneBetreuung({ jahreseinkommen, tage = BETREUUNG_MAX_TAGE }) {
  if (jahreseinkommen <= 0) {
    return { anspruch: false, grund: 'kein_einkommen', taggeld: 0, totalEntschaedigung: 0 };
  }

  const effektiveTage = Math.min(tage, BETREUUNG_MAX_TAGE);
  const taggeld = taggeldAusEinkommen(jahreseinkommen);

  return {
    anspruch: true,
    typ: 'betreuung',
    tage: effektiveTage,
    maxTage: BETREUUNG_MAX_TAGE,
    taggeld,
    totalEntschaedigung: Math.round(taggeld * effektiveTage * 100) / 100,
    entschaedigungssatz: ENTSCHAEDIGUNGSSATZ * 100,
    maxTaggeld: MAX_TAGGELD,
    istPlafoniert: taggeld >= MAX_TAGGELD,
  };
}

/**
 * Vergleiche alle EO-Leistungen für ein gegebenes Einkommen.
 */
export function vergleicheEOLeistungen(jahreseinkommen) {
  return {
    mutterschaft: berechneMutterschaft({ jahreseinkommen }),
    vaterschaft: berechneVaterschaft({ jahreseinkommen }),
    adoption: berechneAdoption({ jahreseinkommen }),
    betreuung: berechneBetreuung({ jahreseinkommen }),
  };
}

export const EO_PARAMS = {
  maxTaggeld: MAX_TAGGELD,
  entschaedigungssatz: ENTSCHAEDIGUNGSSATZ * 100,
  mutterschaftWochen: MUTTERSCHAFT_WOCHEN,
  mutterschaftTage: MUTTERSCHAFT_TAGE,
  // Anspruchs-Voraussetzungen Mutterschaft (EOG Art. 16b) — als Params verfügbar,
  // damit die UI die Bedingungen transparent zeigen kann (statt nur im Code-Kommentar).
  mutterschaftMinMonateAvs: MUTTERSCHAFT_MIN_MONATE_AVS,
  mutterschaftMinMonateArbeit: MUTTERSCHAFT_MIN_MONATE_ARBEIT,
  vaterschaftWochen: VATERSCHAFT_WOCHEN,
  vaterschaftTage: VATERSCHAFT_TAGE,
  adoptionWochen: ADOPTION_WOCHEN,
  adoptionTage: ADOPTION_TAGE,
  betreuungMaxTage: BETREUUNG_MAX_TAGE,
};

export const EO_DATA_VERSION = '2026';
export const EO_DATA_SOURCE = 'EOG Art. 16a–16n, EOMV, BSV 2026';
