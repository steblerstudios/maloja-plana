// Arbeitslosenversicherung (ALV) — Taggeld-Orientierung
// Am 15.09.2026 gegen die geltenden Fedlex-Fassungen geprüft (abgerufen 15.09.2026), keine
// Abweichung zu den bisherigen Werten:
//   AVIG (SR 837.0), Fassung 1.1.2026:
//   https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1982/2184_2184_2184/20260101/de/html/fedlex-data-admin-ch-eli-cc-1982-2184_2184_2184-20260101-de-html.html
//   AVIV (SR 837.02), Fassung 1.8.2026:
//   https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1983/1205_1205_1205/20260801/de/html/fedlex-data-admin-ch-eli-cc-1983-1205_1205_1205-20260801-de-html.html
//   UVV (SR 832.202), Fassung 1.1.2026:
//   https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1983/38_38_38/20260101/de/html/fedlex-data-admin-ch-eli-cc-1983-38_38_38-20260101-de-html.html
// ACHTUNG: Orientierung, KEINE verbindliche Berechnung. Massgebend ist das RAV /
// die zuständige Arbeitslosenkasse.

import { ergebnis, fehlendeAngaben, ERGEBNIS_ART } from './ergebnisArt.js';
import { werteFuerStichtag } from './jahrestabelle.js';

// Jahr der Werte. 2027 geprüft am 21.10.2026, alle Beträge unverändert:
//   UVV Art. 22 Abs. 1, Fedlex Stand 1.1.2027: «… 148 200 Franken im Jahr» (Fussnote: Fassung vom
//   12.11.2014, in Kraft seit 1.1.2016).
//   https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1983/38_38_38/20270101/de/html/fedlex-data-admin-ch-eli-cc-1983-38_38_38-20270101-de-html.html
//   AVIG: Fedlex führt KEINE Fassung zum 1.1.2027 (der Pfad …/20270101/ liefert nur die 9-kB-Hülle);
//   es gilt die Fassung 1.1.2026 oben weiter.
// ⚠️ OFFEN: `satz80Schwelle` (3 797). AVIV Art. 33 Abs. 2, Fedlex Stand 1.1.2027: «Das WBF nimmt die
//   Anpassung des Grenzbetrages nach Artikel 22 Absatz 3 AVIG auf der Grundlage der Anpassungen an
//   die Lohn- und Preisentwicklung bei der AHV/IV … vor.» Die AHV passt 2027 an (+1,587 %). Eine
//   Verordnung des WBF für 2027 ist am 21.10.2026 nicht gefunden. Der Wert bleibt, bis sie belegt
//   ist — nicht hochgerechnet.
export const ALV_QUELLE_JE_JAHR = Object.freeze({
  2026: Object.freeze({ quelle: 'AVIG/AVIV, UVV Art. 22 (Stand 1.1.2026)' }),
  2027: Object.freeze({ quelle: 'AVIG/AVIV, UVV Art. 22 (Stand 1.1.2027)' }),
});
const ALV_HEUTE = werteFuerStichtag(ALV_QUELLE_JE_JAHR);

export const ALV_PARAMS = {
  versicherterVerdienstMax: 12350, // UVV Art. 22 Abs. 1: 148 200 Fr./Jahr ÷ 12 (AVIG Art. 3 Abs. 2 verweist auf das UVG-Maximum)
  versicherterVerdienstMin: 500,   // AVIV Art. 40: unter 500 Fr./Monat nicht versichert
  // AVIG Art. 22 Abs. 2 Bst. b: 70 % erst, wenn das volle Taggeld «mehr als 140 Franken» beträgt
  // → 140 × 21.7 ÷ 0.8 = 3797.5 Fr./Monat. Abs. 3 (seit 1.1.2026) lässt das WBF den Grenzbetrag
  // anpassen (AVIV Art. 33 Abs. 2); eine Anpassung war am 15.09.2026 nicht auffindbar.
  satz80Schwelle: 3797,
  taggelderProMonat: 21.7,         // Durchschnitt (5 Taggelder/Woche, Mo–Fr); nicht in AVIG/AVIV beziffert
  satzHoch: 0.8,                   // AVIG Art. 22 Abs. 1
  satzTief: 0.7,                   // AVIG Art. 22 Abs. 2
  version: String(ALV_HEUTE.jahr),
};

// Taggeldsatz: 80 % bei Unterhaltspflicht für Kinder <25, versichertem Verdienst
// ≤ CHF 3'797 oder IV-Grad ≥ 40 %; sonst 70 %.
export function bestimmeSatz({ versicherterVerdienst, hatKinder, ivGrad40 }) {
  if (hatKinder || ivGrad40 || versicherterVerdienst <= ALV_PARAMS.satz80Schwelle) {
    return ALV_PARAMS.satzHoch;
  }
  return ALV_PARAMS.satzTief;
}

// Allgemeine Wartetage, gestaffelt nach Monatsverdienst und Unterhaltspflicht:
// AVIG Art. 18 Abs. 1 und 1bis (5 / 10 / 15 / 20 Tage; Grenzen 60 000 · 90 000 · 125 000 Fr./Jahr),
// AVIV Art. 6a Abs. 2 (bis 36 000 Fr./Jahr keine) und Abs. 3 (mit Kindern bis 60 000 keine).
export function bestimmeWartetage({ versicherterVerdienst, hatKinder }) {
  const v = versicherterVerdienst;
  if (v <= 3000) return 0;
  if (v <= 5000) return hatKinder ? 0 : 5;
  if (hatKinder) return 5;        // ab CHF 5'001 mit Unterhaltspflicht: 5
  if (v <= 7500) return 10;
  if (v <= 10416) return 15;
  return 20;
}

// Höchstzahl Taggelder (Anspruchsdauer, AVIG Art. 27: 260 / 400 / 520 / 200) — vereinfachte Orientierung nach
// Beitragszeit und Alter. Befreite ohne Beitragszeit (90 Taggelder) hier nicht
// abgebildet. Gibt null zurück, wenn Beitragszeit < 12 Monate (oft kein Anspruch).
export function bestimmeAnspruchstage({ beitragsmonate, alter, hatKinder, ivGrad40 }) {
  if (!beitragsmonate || beitragsmonate < 12) return null;
  // AVIG Art. 27 Abs. 2 lit. c: 520 nur mit mindestens 22 Beitragsmonaten — ab 55 ODER mit IV-Rente (≥ 40 %).
  if (beitragsmonate >= 22 && (alter >= 55 || ivGrad40)) return 520;
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

// O3 — Ergebnis-Art des ALV-Rechners: SCHÄTZUNG, nicht Berechnung.
// Der Betrag folgt den amtlichen Eckwerten oben (AVIG Art. 22, AVIV Art. 40, UVV Art. 22), aber
// vereinfacht: 21,7 Taggelder als Monatsdurchschnitt, ein eingetragener Monatslohn statt des
// Durchschnitts, den die Kasse aus der Bemessungsperiode bildet, keine Befreiten von der
// Beitragszeit (siehe bestimmeAnspruchstage), keine Zwischenverdienste. Das RAV bzw. die
// Arbeitslosenkasse rechnet den Einzelfall.
// Fehlend zählt, was das Ergebnis verändert:
//   bruttolohn      ohne ihn gibt es keinen Betrag
//   beitragsmonate  ohne sie keine Anspruchsdauer (bestimmeAnspruchstage → null)
//   geburtsdatum    ohne Alter rechnet die Anspruchsdauer, als wäre man zwischen 25 und 54 —
//                   jünger und älter gelten andere Höchstzahlen (siehe bestimmeAnspruchstage)
export function alvErgebnis({ bruttolohn, beitragsmonate, alter }) {
  return ergebnis(ERGEBNIS_ART.SCHAETZUNG, {
    fehlend: fehlendeAngaben({
      bruttolohn: Number(bruttolohn) > 0,
      beitragsmonate: Number(beitragsmonate) > 0,
      geburtsdatum: alter != null,
    }),
  });
}

export const ALV_DATA_VERSION = String(ALV_HEUTE.jahr);
export const ALV_DATA_SOURCE = ALV_HEUTE.quelle;
