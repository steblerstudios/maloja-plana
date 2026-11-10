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

// Grenzbetrag für den 80-%-Satz JE JAHR (Werte 2027, Seitenrundgang 26.10.2026): bis dahin stand er als
// Wert ohne Jahr in ALV_PARAMS, und der Rechner wies ab 1.1.2027 «2027» aus, obwohl er für 2027 nicht
// belegt ist (siehe ⚠️ OFFEN oben). Ein Jahr kommt erst dazu, wenn die WBF-Verordnung gelesen ist.
export const SATZ80_JE_JAHR = Object.freeze({
  // grenzTaggeld: der Betrag im Gesetz (volles Taggeld «mehr als 140 Franken» → 70 %). schwelle: derselbe Wert als
  // Monatsverdienst, abgerundet, nur für die Anzeige — entschieden wird am Taggeld (Kapitel 5, K, 10.11.2026).
  2026: Object.freeze({ grenzTaggeld: 140, schwelle: 3797, quelle: 'AVIG Art. 22 Abs. 2 Bst. b, AVIV Art. 33 Abs. 2 (Stand 1.1.2026)' }),
});
const SATZ80_HEUTE = werteFuerStichtag(SATZ80_JE_JAHR);
// Ausgewiesenes Jahr = das älteste, für das ALLE Werte belegt sind.
const ALV_JAHR = Math.min(ALV_HEUTE.jahr, SATZ80_HEUTE.jahr);

export const ALV_PARAMS = {
  versicherterVerdienstMax: 12350, // UVV Art. 22 Abs. 1: 148 200 Fr./Jahr ÷ 12 (AVIG Art. 3 Abs. 2 verweist auf das UVG-Maximum)
  versicherterVerdienstMin: 500,   // AVIV Art. 40: unter 500 Fr./Monat nicht versichert
  // AVIG Art. 22 Abs. 2 Bst. b: 70 % erst, wenn das volle Taggeld «mehr als 140 Franken» beträgt
  // → 140 × 21.7 ÷ 0.8 = 3797.5 Fr./Monat. Abs. 3 (seit 1.1.2026) lässt das WBF den Grenzbetrag
  // anpassen (AVIV Art. 33 Abs. 2); eine Anpassung war am 15.09.2026 nicht auffindbar.
  satz80Schwelle: SATZ80_HEUTE.schwelle,
  satz80GrenzTaggeld: SATZ80_HEUTE.grenzTaggeld,
  satz80Jahr: SATZ80_HEUTE.jahr,       // Jahr des Grenzbetrags
  satz80Belegt: SATZ80_HEUTE.belegt,   // false ab einem Jahr ohne Eintrag → Hinweis alv.satz80NichtBelegt
  taggelderProMonat: 21.7,         // AVIV Art. 40a: «Der Tagesverdienst wird ermittelt, indem der Monatsverdienst durch 21.7 geteilt wird.»
  satzHoch: 0.8,                   // AVIG Art. 22 Abs. 1
  satzTief: 0.7,                   // AVIG Art. 22 Abs. 2
  version: String(ALV_JAHR),
};

// Taggeldsatz: 80 % bei Unterhaltspflicht für Kinder <25, einem vollen Taggeld bis 140 Franken
// oder IV-Grad ≥ 40 %; sonst 70 % (AVIG Art. 22 Abs. 2).
// Kapitel 5, K (10.11.2026): verglichen wird das volle Taggeld (80 % des Verdienstes ÷ 21.7, AVIV Art. 40a) mit
// 140 Franken, auf Rappen gerundet. Vorher galt «Monatsverdienst ≤ 3 797» — zwischen 3 797.01 und 3 797.50 liegt
// das volle Taggeld noch bei höchstens 140 Franken, der Rechner gab dort aber schon 70 %.
// Annahme (nicht in AVIG/AVIV, rechts-pruefer 10.11.2026): gerundet wird vor dem Vergleich auf Rappen — 3 797.51 bis
// 3 797.53 geben darum noch 80 %. Ebenso offen: ob die Kasse den Jahresverdienst bei den Wartetagen auf Franken rundet.
export function bestimmeSatz({ versicherterVerdienst, hatKinder, ivGrad40 }) {
  const vollesTaggeld = Math.round((versicherterVerdienst || 0) * ALV_PARAMS.satzHoch / ALV_PARAMS.taggelderProMonat * 100) / 100;
  if (hatKinder || ivGrad40 || vollesTaggeld <= ALV_PARAMS.satz80GrenzTaggeld) {
    return ALV_PARAMS.satzHoch;
  }
  return ALV_PARAMS.satzTief;
}

// Allgemeine Wartetage, gestaffelt nach Monatsverdienst und Unterhaltspflicht:
// AVIG Art. 18 Abs. 1 und 1bis (5 / 10 / 15 / 20 Tage; Grenzen 60 000 · 90 000 · 125 000 Fr./Jahr),
// AVIV Art. 6a Abs. 2 (bis 36 000 Fr./Jahr keine) und Abs. 3 (mit Kindern bis 60 000 keine).
// Kapitel 5, K (10.11.2026): die Grenzen stehen im Gesetz als Jahresbeträge — darum wird der Monatsverdienst
// aufs Jahr gerechnet und dort verglichen. Vorher stand «≤ 10 416» im Monat: zwischen 10 416.01 und 10 416.66
// (124 992 bis 125 000 Fr. im Jahr) gab der Rechner 20 statt 15 Tage.
export function bestimmeWartetage({ versicherterVerdienst, hatKinder }) {
  const jahr = Math.round((versicherterVerdienst || 0) * 12 * 100) / 100;
  if (jahr <= 36000) return 0;
  if (jahr <= 60000) return hatKinder ? 0 : 5;
  if (hatKinder) return 5;        // über 60 000 mit Unterhaltspflicht: 5 (AVIG Art. 18 Abs. 1, erster Satz)
  if (jahr <= 90000) return 10;
  if (jahr <= 125000) return 15;
  return 20;
}

// Höchstzahl Taggelder (Anspruchsdauer, AVIG Art. 27: 260 / 400 / 520 / 200) — vereinfachte Orientierung nach
// Beitragszeit und Alter. Befreite ohne Beitragszeit (90 Taggelder) hier nicht
// abgebildet. Gibt null zurück, wenn Beitragszeit < 12 Monate (oft kein Anspruch).
export function bestimmeAnspruchstage({ beitragsmonate, alter, hatKinder, ivGrad40 }) {
  if (!beitragsmonate || beitragsmonate < 12) return null;
  // AVIG Art. 27 Abs. 2 lit. c: 520 nur mit mindestens 22 Beitragsmonaten — ab 55 ODER mit IV-Rente (≥ 40 %).
  if (beitragsmonate >= 22 && (alter >= 55 || ivGrad40)) return 520;
  // Kapitel 5, L1 (10.11.2026): ohne Alter keine Zahl. Vorher fiel die Prüfung «unter 25» still weg und es
  // standen 400 Taggelder da — unter 25 ohne Kinder sind es 200 (AVIG Art. 27 Abs. 5bis), ab 55 bis 520.
  if (alter == null || alter === '' || !Number.isFinite(Number(alter))) return null;
  if (alter < 25 && !hatKinder) return 200; // jung, ohne Unterhaltspflicht
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
    // Beitragszeit reicht, aber ohne Alter steht die Höchstzahl nicht fest (200 bis 520 Taggelder).
    anspruchstageOffen: beitragsmonate >= 12 && bestimmeAnspruchstage({ beitragsmonate, alter, hatKinder, ivGrad40 }) == null,
    // Spanne ohne Alter, aus den Beitragsmonaten (rechts-pruefer 10.11.2026): 520 gibt es erst ab 22 Monaten,
    // bei 12–17 höchstens 260, bei 18–21 höchstens 400 — das Alter entscheidet dort nur über 200 (AVIG Art. 27).
    anspruchSpanne: beitragsmonate >= 12 ? { min: 200, max: beitragsmonate >= 22 ? 520 : beitragsmonate >= 18 ? 400 : 260 } : null,
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

export const ALV_DATA_VERSION = String(ALV_JAHR);
export const ALV_DATA_SOURCE = ALV_HEUTE.quelle;
