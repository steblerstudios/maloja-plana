// Prämienregionen und mittlere Prämien je Jahr — Zugriffe von Hand, Daten generiert (praemienRegionenDaten.js,
// node scripts/build-praemien-data.mjs). Seit 25.10.2026 je Jahr: 2026 und 2027 liegen nebeneinander, gerechnet
// wird mit dem Jahr des Stichtags (Standard: heute) — ab 1.1.2027 also automatisch mit den Prämien 2027.
// Liegt das Jahr ausserhalb der Daten, gilt das nächstliegende vorhandene (vor 2026 → 2026, nach 2027 → 2027).
//
// Prämie = monatliche mittlere Prämie OKP in CHF (alle Versicherer, Standardmodell) je Kantonsregion.
// Region 0 = Kanton hat nur eine Region.

import { GEMEINDEN, PRAEMIEN, PRAEMIEN_QUELLEN } from './praemienRegionenDaten.js';
import { ageClassFromBirth } from './franchiseTacho.js';

export const PRAEMIEN_JAHRE = Object.keys(PRAEMIEN).map(Number).sort((a, b) => a - b);

// Prämienjahr zum Stichtag: das Kalenderjahr, sofern Daten da sind, sonst das nächstliegende vorhandene.
export function praemienJahr(stichtag = new Date()) {
  const j = stichtag.getFullYear();
  if (PRAEMIEN_JAHRE.includes(j)) return j;
  return j < PRAEMIEN_JAHRE[0] ? PRAEMIEN_JAHRE[0] : PRAEMIEN_JAHRE[PRAEMIEN_JAHRE.length - 1];
}

function eintrag(bfsNr, stichtag) {
  const g = GEMEINDEN[String(bfsNr)];
  if (!g) return null;
  const [k, gemeinde, r] = g;
  const jahr = praemienJahr(stichtag);
  const p = PRAEMIEN[jahr]?.[k + r];
  return { k, gemeinde, r, jahr, p };
}

export function getRegion(bfsNr) {
  const g = GEMEINDEN[String(bfsNr)];
  return g ? g[2] : null;
}

export function getAveragePremium(bfsNr, stichtag = new Date()) {
  const e = eintrag(bfsNr, stichtag);
  if (!e || !e.p) return null;
  return { kinder: e.p[0], junge: e.p[1], erwachsene: e.p[2], region: e.r, kanton: e.k, jahr: e.jahr };
}

export function getRegionInfo(bfsNr, stichtag = new Date()) {
  const e = eintrag(bfsNr, stichtag);
  if (!e) return null;
  return {
    kanton: e.k,
    gemeinde: e.gemeinde,
    region: e.r,
    jahr: e.jahr,
    praemien: e.p ? { kinder: e.p[0], junge: e.p[1], erwachsene: e.p[2] } : {},
  };
}

export const PRAEMIEN_DATA_VERSION = String(PRAEMIEN_JAHRE[PRAEMIEN_JAHRE.length - 1]);
export const PRAEMIEN_DATA_SOURCE = 'BAG priminfo.admin.ch';
export { PRAEMIEN_QUELLEN };

// Nationaler Anker für den regionalen Vergleich (gleiche Definition wie die regionale mittlere Prämie:
// alle bezahlten Prämien geteilt durch die Versicherten), je Jahr vom BAG publiziert.
//   2026: BAG «mittlere Prämie 2026» (Erwachsene 465.30 / junge Erw. 326.30 / Kinder 122.50 / Gesamt 393.30).
//   2027: BAG-Medienmitteilung 29.09.2026 «Krankenkassenprämien steigen durchschnittlich um 5,0 Prozent»
//         (https://www.bag.admin.ch/de/newnsb/BfuGvedj0OOX, im Browser gelesen 25.10.2026): Erwachsene «auf
//         487.60 Franken», junge Erwachsene «auf 338.80 Franken», Kinder «auf 128.10 Franken», gesamt «412 Franken».
//   Die Mitteilung nennt Erhöhungen (+22.80 / +15.40 / +5.70 / +19.70), die zu den Zahlen 2026 nicht genau
//   aufgehen (19.70 / 392.30 = 5,0 %, gegen 393.30 nur 4,75 %) — vermutlich hat das BAG die Basis 2026
//   nachgeführt (nicht vom BAG bestätigt). Massgebend sind die publizierten Werte je Jahr; aus den beiden
//   Werten hier darf keine Steigerung gerechnet werden.
export const NATIONAL_AVG_PREMIUM_JE_JAHR = Object.freeze({
  2026: Object.freeze({ erwachsene: 465.3, junge: 326.3, kinder: 122.5, gesamt: 393.3, year: 2026, source: 'BAG' }),
  2027: Object.freeze({ erwachsene: 487.6, junge: 338.8, kinder: 128.1, gesamt: 412, year: 2027, source: 'BAG' }),
});

export function nationalAvgPremium(stichtag = new Date()) {
  return NATIONAL_AVG_PREMIUM_JE_JAHR[praemienJahr(stichtag)];
}

// Schweizer Schnitt zum heutigen Datum, beim Laden bestimmt — für bestehende Leser. Neue Stellen nehmen
// nationalAvgPremium(stichtag), damit Jahr und Region nicht auseinanderlaufen.
export const NATIONAL_AVG_PREMIUM = nationalAvgPremium();

// Bildet ein Geburtsdatum auf die Prämien-Altersklasse ab (kinder/junge/erwachsene) — nach Jahrgang, wie
// ageClassFromBirth in franchiseTacho.js (BAG-Gesamtbericht 2027 S. 24). Fehlt das Datum, gilt Erwachsene.
const AGE_KEY = { kind: 'kinder', jung: 'junge', erwachsen: 'erwachsene' };
function ageKeyFromBirth(dateStr, stichtag) {
  return AGE_KEY[ageClassFromBirth(dateStr, stichtag)];
}

// Vergleicht die regionale mittlere Prämie mit dem Schweizer Schnitt desselben Jahres —
// dieselbe Quelle, dieselbe Definition (sauber vergleichbar).
// Liefert null, wenn die Gemeinde unbekannt ist oder kein Wert vorliegt.
export function getRegionalComparison(bfsNr, dateOfBirth, stichtag = new Date()) {
  const info = getRegionInfo(bfsNr, stichtag);
  if (!info) return null;
  const key = ageKeyFromBirth(dateOfBirth, stichtag);
  const regional = info.praemien[key];
  const nat = nationalAvgPremium(stichtag);
  const national = nat?.[key];
  if (regional == null || national == null) return null;
  const diffPct = ((regional - national) / national) * 100;
  return {
    regional,
    national,
    diffPct,
    ageKey: key,
    kanton: info.kanton,
    gemeinde: info.gemeinde,
    region: info.region,
    year: info.jahr,
  };
}
