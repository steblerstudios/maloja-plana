// Arbeitslosenversicherung (ALV) — Taggeld-Orientierung
// Verifizierte Werte Stand 01.01.2025 (SECO / arbeit.swiss / Kanton ZH).
// Quellen: arbeit.swiss, SECO Faktenblatt «Die Arbeitslosenversicherung», zh.ch.
// ACHTUNG: Orientierung, KEINE verbindliche Berechnung. Massgebend ist das RAV /
// die zuständige Arbeitslosenkasse. Werte ändern jährlich.

export const ALV_PARAMS = {
  versicherterVerdienstMax: 12350, // CHF/Monat (= 148'200/Jahr, UVG-Maximum)
  versicherterVerdienstMin: 500,   // CHF/Monat — darunter kein Anspruch
  satz80Schwelle: 3797,            // vers. Verdienst ≤ → erhöhter Satz 80 %
  taggelderProMonat: 21.7,         // Durchschnitt (5 Taggelder/Woche, Mo–Fr)
  satzHoch: 0.8,
  satzTief: 0.7,
  version: '2025',
};

// Taggeldsatz: 80 % bei Unterhaltspflicht für Kinder <25, versichertem Verdienst
// ≤ CHF 3'797 oder IV-Grad ≥ 40 %; sonst 70 %.
export function bestimmeSatz({ versicherterVerdienst, hatKinder, ivGrad40 }) {
  if (hatKinder || ivGrad40 || versicherterVerdienst <= ALV_PARAMS.satz80Schwelle) {
    return ALV_PARAMS.satzHoch;
  }
  return ALV_PARAMS.satzTief;
}

// Allgemeine Wartetage, gestaffelt nach Monatsverdienst und Unterhaltspflicht.
export function bestimmeWartetage({ versicherterVerdienst, hatKinder }) {
  const v = versicherterVerdienst;
  if (v <= 3000) return 0;
  if (v <= 5000) return hatKinder ? 0 : 5;
  if (hatKinder) return 5;        // ab CHF 5'001 mit Unterhaltspflicht: 5
  if (v <= 7500) return 10;
  if (v <= 10416) return 15;
  return 20;
}

// Höchstzahl Taggelder (Anspruchsdauer) — vereinfachte Orientierung nach
// Beitragszeit und Alter. Befreite ohne Beitragszeit (90 Taggelder) hier nicht
// abgebildet. Gibt null zurück, wenn Beitragszeit < 12 Monate (oft kein Anspruch).
export function bestimmeAnspruchstage({ beitragsmonate, alter, hatKinder, ivGrad40 }) {
  if (!beitragsmonate || beitragsmonate < 12) return null;
  if ((alter >= 55 && beitragsmonate >= 22) || ivGrad40) return 520;
  if (alter && alter < 25 && !hatKinder) return 200; // jung, ohne Unterhaltspflicht
  if (beitragsmonate >= 18) return 400;
  return 260; // 12 bis <18 Monate
}

// Vollständige Taggeld-Orientierung.
export function berechneTaggeld({ versicherterVerdienst, hatKinder, ivGrad40, beitragsmonate, alter }) {
  const roh = Math.max(versicherterVerdienst || 0, 0);
  const v = Math.min(roh, ALV_PARAMS.versicherterVerdienstMax);
  if (v < ALV_PARAMS.versicherterVerdienstMin) {
    return { anspruch: false, versicherterVerdienst: v };
  }
  const satz = bestimmeSatz({ versicherterVerdienst: v, hatKinder, ivGrad40 });
  const taggeld = v * satz / ALV_PARAMS.taggelderProMonat;
  const monatlich = v * satz; // ≈ taggeld × 21.7
  return {
    anspruch: true,
    versicherterVerdienst: v,
    gedeckelt: roh > ALV_PARAMS.versicherterVerdienstMax,
    satz,
    taggeld: Math.round(taggeld * 100) / 100,
    monatlich: Math.round(monatlich),
    wartetage: bestimmeWartetage({ versicherterVerdienst: v, hatKinder }),
    anspruchstage: bestimmeAnspruchstage({ beitragsmonate, alter, hatKinder, ivGrad40 }),
  };
}

export const ALV_DATA_VERSION = '2025';
