// Kapitalbezugssteuer auf Vorsorgeleistungen (2. Säule Kapitalbezug, Säule 3a/3b)
// ---------------------------------------------------------------------------
// Kapitalleistungen aus Vorsorge werden GESONDERT vom übrigen Einkommen besteuert
// (einmalige Jahressteuer), zu einem eigenen, reduzierten Tarif.
//
// Bund (exakt): Art. 38 Abs. 2 DBG — die Steuer beträgt ein Fünftel des ordentlichen
//   Tarifs nach Art. 36. Wir verwenden dafür die aufs Rappen geeichten Tarif-
//   Funktionen aus steuerRechner.js (÷5). Ohne Abzüge auf dem vollen Kapitalbetrag.
//
// Kanton/Gemeinde (Orientierung): jeder Kanton hat einen EIGENEN Kapitalsteuer-Tarif,
//   NICHT den Einkommens-Multiplikator aus kantonaleSteuerdaten.js. Wir nähern den
//   Gesamtbetrag (Bund + Kanton + Gemeinde) über empirische Effektivsätze am
//   Kantonshauptort und ziehen den exakten Bundesanteil ab. Rein zur Orientierung —
//   der verbindliche Wert kommt vom amtlichen Kantonsrechner.
//
// Staffelung: Weil der Tarif progressiv ist, senkt das Aufteilen eines Bezugs auf
//   mehrere Steuerjahre (z. B. mehrere 3a-Konten gestaffelt beziehen) die Gesamt-
//   steuer. Dieser Effekt ist beim Bund wie beim Kanton real und wird hier gezeigt.

import { bundessteuerAlleinstehend, bundessteuerVerheiratet } from './steuerRechner.js';

// Empirische Gesamt-Effektivsätze (Bund + Kanton + Gemeinde) auf Kapitalleistungen
// aus Vorsorge, Kantonshauptort, ledig/konfessionslos, Bezug mit 65.
// Anker bei 100'000 / 500'000 / 1'000'000; dazwischen linear interpoliert.
// Quelle: finpension «Kapitalbezugssteuer im Vergleich» (Steuerjahr 2026).
const KAPITAL_KANTONE = {
  AG: { hauptort: 'Aarau',        r100: 0.0485, r500: 0.0822, r1000: 0.0877 },
  AI: { hauptort: 'Appenzell',    r100: 0.0331, r500: 0.0514, r1000: 0.0534 },
  AR: { hauptort: 'Herisau',      r100: 0.0794, r500: 0.0991, r1000: 0.1114 },
  BE: { hauptort: 'Bern',         r100: 0.0463, r500: 0.0826, r1000: 0.0962 },
  BL: { hauptort: 'Liestal',      r100: 0.0384, r500: 0.0672, r1000: 0.0956 },
  BS: { hauptort: 'Basel',        r100: 0.0529, r500: 0.0945, r1000: 0.0997 },
  FR: { hauptort: 'Freiburg',     r100: 0.0324, r500: 0.0930, r1000: 0.1040 },
  GE: { hauptort: 'Genf',         r100: 0.0413, r500: 0.0741, r1000: 0.0811 },
  GL: { hauptort: 'Glarus',       r100: 0.0517, r500: 0.0673, r1000: 0.0693 },
  GR: { hauptort: 'Chur',         r100: 0.0328, r500: 0.0576, r1000: 0.0596 },
  JU: { hauptort: 'Delémont',     r100: 0.0617, r500: 0.0964, r1000: 0.1011 },
  LU: { hauptort: 'Luzern',       r100: 0.0376, r500: 0.0622, r1000: 0.0653 },
  NE: { hauptort: 'Neuenburg',    r100: 0.0568, r500: 0.0846, r1000: 0.0875 },
  NW: { hauptort: 'Stans',        r100: 0.0364, r500: 0.0555, r1000: 0.0574 },
  OW: { hauptort: 'Sarnen',       r100: 0.0566, r500: 0.0722, r1000: 0.0742 },
  SG: { hauptort: 'St. Gallen',   r100: 0.0588, r500: 0.0745, r1000: 0.0765 },
  SH: { hauptort: 'Schaffhausen', r100: 0.0318, r500: 0.0537, r1000: 0.0557 },
  SO: { hauptort: 'Solothurn',    r100: 0.0497, r500: 0.0764, r1000: 0.0784 },
  SZ: { hauptort: 'Schwyz',       r100: 0.0215, r500: 0.0777, r1000: 0.0955 },
  TG: { hauptort: 'Frauenfeld',   r100: 0.0661, r500: 0.0817, r1000: 0.0837 },
  TI: { hauptort: 'Bellinzona',   r100: 0.0440, r500: 0.0710, r1000: 0.0809 },
  UR: { hauptort: 'Altdorf',      r100: 0.0424, r500: 0.0581, r1000: 0.0600 },
  VD: { hauptort: 'Lausanne',     r100: 0.0459, r500: 0.0839, r1000: 0.0906 },
  VS: { hauptort: 'Sion',         r100: 0.0474, r500: 0.0878, r1000: 0.1030 },
  ZG: { hauptort: 'Zug',          r100: 0.0281, r500: 0.0576, r1000: 0.0628 },
  ZH: { hauptort: 'Zürich',       r100: 0.0488, r500: 0.0716, r1000: 0.1116 },
};

/**
 * Exakte direkte Bundessteuer auf eine Kapitalleistung aus Vorsorge.
 * Art. 38 Abs. 2 DBG: ein Fünftel des ordentlichen Tarifs (Art. 36), ohne Abzüge.
 * @param {number} betrag - Kapitalbetrag in CHF
 * @param {boolean} [verheiratet=false] - Verheiratetentarif (sonst Grundtarif)
 * @returns {number} Bundessteuer in CHF
 */
export function bundKapitalsteuer(betrag, verheiratet = false) {
  if (!betrag || betrag <= 0) return 0;
  const tarif = verheiratet ? bundessteuerVerheiratet(betrag) : bundessteuerAlleinstehend(betrag);
  return Math.round((tarif / 5) * 100) / 100;
}

// Gesamtsteuer (Bund+Kanton+Gemeinde) für einen Kanton, interpoliert aus den
// drei Ankersätzen. Monoton steigend (progressiv), geht durch die Anker exakt.
function kantonGesamt(betrag, k) {
  const t100 = 100000 * k.r100;
  const t500 = 500000 * k.r500;
  const t1000 = 1000000 * k.r1000;
  if (betrag <= 100000) return betrag * k.r100;
  if (betrag <= 500000) return t100 + ((betrag - 100000) / 400000) * (t500 - t100);
  if (betrag <= 1000000) return t500 + ((betrag - 500000) / 500000) * (t1000 - t500);
  // Über 1 Mio: mit dem oberen Grenzverlauf sanft weiterschreiben.
  const grenz = (t1000 - t500) / 500000;
  return t1000 + (betrag - 1000000) * grenz;
}

/**
 * Geschätzte kantonale Kapitalbezugssteuer (Gesamt inkl. Bund) am Kantonshauptort.
 * Orientierung — ledig, konfessionslos, Bezug mit 65. Verbindlich ist der Kantonsrechner.
 * @returns {{total:number, effektiverSatz:number, hauptort:string, kuerzel:string}|null}
 */
export function kantonKapitalsteuer(betrag, kuerzel) {
  const k = KAPITAL_KANTONE[kuerzel];
  if (!k || !betrag || betrag <= 0) return null;
  const total = Math.round(kantonGesamt(betrag, k));
  return {
    total,
    effektiverSatz: Math.round((total / betrag) * 10000) / 100,
    hauptort: k.hauptort,
    kuerzel,
  };
}

/**
 * Vollständige Kapitalbezug-Steuerrechnung für einen einzelnen Bezug.
 * Ohne Kanton: nur der exakte Bund (das ist die Untergrenze der Steuer).
 * Mit Kanton: geschätzter Gesamtbetrag, aufgeteilt in Bund + Kanton/Gemeinde.
 * @returns {{betrag,bund,kantonGemeinde,total,netto,effektiverSatz,hatKanton,hauptort,kuerzel}|null}
 */
export function berechneKapitalbezug({ betrag, kuerzel = null, verheiratet = false }) {
  if (!betrag || betrag <= 0) return null;
  const bund = bundKapitalsteuer(betrag, verheiratet);
  const kant = kuerzel ? kantonKapitalsteuer(betrag, kuerzel) : null;
  const total = kant ? Math.max(bund, kant.total) : bund;
  const kantonGemeinde = kant ? Math.max(0, total - bund) : null;
  return {
    betrag,
    bund,
    kantonGemeinde,
    total,
    netto: betrag - total,
    effektiverSatz: Math.round((total / betrag) * 10000) / 100,
    hatKanton: !!kant,
    hauptort: kant ? kant.hauptort : null,
    kuerzel: kant ? kuerzel : null,
  };
}

/**
 * Bandbreite der Gesamtsteuer über alle Kantone (für die Orientierung ohne
 * Kantonswahl): günstigster und teuerster Kantonshauptort für diesen Betrag.
 * @returns {{minTotal,maxTotal,minKanton,maxKanton,minSatz,maxSatz}|null}
 */
export function kapitalsteuerBandbreite(betrag) {
  if (!betrag || betrag <= 0) return null;
  let min = null, max = null;
  for (const [kuerzel, k] of Object.entries(KAPITAL_KANTONE)) {
    const total = Math.round(kantonGesamt(betrag, k));
    if (!min || total < min.total) min = { total, kuerzel, hauptort: k.hauptort };
    if (!max || total > max.total) max = { total, kuerzel, hauptort: k.hauptort };
  }
  return {
    minTotal: min.total,
    maxTotal: max.total,
    minKanton: min.kuerzel,
    maxKanton: max.kuerzel,
    minHauptort: min.hauptort,
    maxHauptort: max.hauptort,
    minSatz: Math.round((min.total / betrag) * 10000) / 100,
    maxSatz: Math.round((max.total / betrag) * 10000) / 100,
  };
}

/**
 * Staffelungs-Vergleich: ein einmaliger Bezug gegen `tranchen` gleich grosse
 * Bezüge in verschiedenen Steuerjahren. Wegen der Progression ist gestaffelt
 * günstiger. Rechnet mit Kanton (falls gewählt), sonst mit dem exakten Bund.
 * @returns {{einmalTotal,gestaffeltTotal,ersparnis,proTranche,trancheBetrag,tranchen}|null}
 */
export function vergleicheStaffelung({ betrag, tranchen = 3, kuerzel = null, verheiratet = false }) {
  if (!betrag || betrag <= 0) return null;
  const n = Math.max(1, Math.min(5, Math.round(tranchen)));
  const einmal = berechneKapitalbezug({ betrag, kuerzel, verheiratet });
  const trancheBetrag = betrag / n;
  const proTranche = berechneKapitalbezug({ betrag: trancheBetrag, kuerzel, verheiratet });
  const gestaffeltTotal = Math.round(proTranche.total * n);
  return {
    einmalTotal: einmal.total,
    gestaffeltTotal,
    ersparnis: Math.max(0, einmal.total - gestaffeltTotal),
    proTranche: proTranche.total,
    trancheBetrag: Math.round(trancheBetrag),
    tranchen: n,
    hatKanton: einmal.hatKanton,
  };
}

export function alleKapitalKantone() {
  return Object.entries(KAPITAL_KANTONE)
    .map(([kuerzel, k]) => ({ kuerzel, hauptort: k.hauptort }))
    .sort((a, b) => a.kuerzel.localeCompare(b.kuerzel));
}

export const KAPITAL_DATA_VERSION = '2026 (Orientierung)';
export const KAPITAL_DATA_SOURCE = 'Art. 38 DBG (Bund exakt); Kanton: finpension Kapitalbezugssteuer-Vergleich 2026, Hauptort, ledig/konfessionslos, approximativ';
