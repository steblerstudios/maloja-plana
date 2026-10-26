// Prämien je Versicherer (Standardmodell) — Zugriffe von Hand, Daten generiert (praemienDetailDaten.js,
// node scripts/build-praemien-detail.mjs). Seit 25.10.2026 je Jahr: 2026 und 2027 nebeneinander, gerechnet wird mit
// dem Jahr des Stichtags (Standard: heute) — ab 1.1.2027 also automatisch mit den Prämien 2027. Liegt das Jahr
// ausserhalb der Daten, gilt das nächstliegende vorhandene.
//
// ERW/JUG franchises: [300, 500, 1000, 1500, 2000, 2500] · KIN franchises: [0, 100, 200, 300, 400, 500, 600]
// Premium = 0 in den Daten heisst: Franchise/Tarif nicht angeboten → hier null.

import { DETAIL, NAMEN, DETAIL_QUELLEN } from './praemienDetailDaten.js';

const ERW_FRA = [300, 500, 1000, 1500, 2000, 2500];
const KIN_FRA = [0, 100, 200, 300, 400, 500, 600];

export const DETAIL_JAHRE = Object.keys(DETAIL).map(Number).sort((a, b) => a - b);

// Prämienjahr zum Stichtag: das Kalenderjahr, sofern Daten da sind, sonst das nächstliegende vorhandene.
export function detailJahr(stichtag = new Date()) {
  const j = stichtag.getFullYear();
  if (DETAIL_JAHRE.includes(j)) return j;
  return j < DETAIL_JAHRE[0] ? DETAIL_JAHRE[0] : DETAIL_JAHRE[DETAIL_JAHRE.length - 1];
}

// Wechselzeit: Kasse wechseln (KVG Art. 7 Abs. 2) und Franchise ändern (KVV Art. 94) wirken auf den 1. Januar.
// Ab der BAG-Publikation der Prämien des Folgejahres bis 31.12. rechnen Kassenvergleich und Franchise-Vorschlag
// darum schon mit dem Folgejahr — was man heute bezahlt (Barometer, Budget, eigene Prämie), bleibt beim Kalenderjahr.
// Datum je Jahr: BAG-Medienmitteilung (2027: 29.09.2026, «Krankenkassenprämien steigen durchschnittlich um 5,0 Prozent»,
// https://www.bag.admin.ch/de/newnsb/BfuGvedj0OOX — im Browser gelesen 25.10.2026, siehe praemienRegionen.js).
export const DETAIL_VEROEFFENTLICHT = Object.freeze({ 2027: '2026-09-29' });

// Stichtag für Vergleiche: in der Wechselzeit der 1. Januar des Folgejahres, sonst der Tag selbst.
export function vergleichsStichtag(heute = new Date()) {
  const folge = heute.getFullYear() + 1;
  const ab = DETAIL_VEROEFFENTLICHT[folge];
  if (!ab || !DETAIL_JAHRE.includes(folge)) return heute;
  const [y, m, d] = ab.split('-').map(Number);
  return heute >= new Date(y, m - 1, d) ? new Date(folge, 0, 1) : heute;
}

export const istWechselzeit = (heute = new Date()) => vergleichsStichtag(heute) !== heute;

const daten = (stichtag) => DETAIL[detailJahr(stichtag)];

function eintrag(versNr, kanton, region, stichtag) {
  const entries = daten(stichtag)[String(versNr)];
  if (!entries) return null;
  return entries.find(e => e[0] === kanton && e[1] === region) || null;
}

// withAccident=false → Tarif ohne Unfalldeckung (eo/jo). Für Kinder sind nur die Mit-Unfall-Prämien gespeichert
// (die BAG-Tabellen führen auch Kinder ohne Unfall); dort wird immer der Mit-Unfall-Tarif genommen — eher zu hoch.
function pickPremiums(match, ageClass, withAccident) {
  if (ageClass === "kind") return match[4];
  if (ageClass === "jung") return withAccident ? match[3] : (match[6] || match[3]);
  return withAccident ? match[2] : (match[5] || match[2]);
}

export function getInsurerPremium(versNr, kanton, region, ageClass, franchise, withAccident = true, stichtag = new Date()) {
  const match = eintrag(versNr, kanton, region, stichtag);
  if (!match) return null;
  const fraList = ageClass === "kind" ? KIN_FRA : ERW_FRA;
  const idx = fraList.indexOf(Number(franchise));
  if (idx < 0) return null;
  const val = pickPremiums(match, ageClass, withAccident)[idx];
  return val > 0 ? val : null;
}

export function getInsurerAllFranchises(versNr, kanton, region, ageClass, withAccident = true, stichtag = new Date()) {
  const match = eintrag(versNr, kanton, region, stichtag);
  if (!match) return null;
  const fraList = ageClass === "kind" ? KIN_FRA : ERW_FRA;
  const premiums = pickPremiums(match, ageClass, withAccident);
  return fraList.map((fra, i) => ({ franchise: fra, premium: premiums[i] || null })).filter(f => f.premium);
}

export function getInsurerCantons(versNr, stichtag = new Date()) {
  const entries = daten(stichtag)[String(versNr)];
  if (!entries) return [];
  return [...new Set(entries.map(e => e[0]))].sort();
}

export function insurerNameFromNr(versNr) {
  return NAMEN[String(versNr)] || null;
}

export function insurerNrFromName(name) {
  const lower = name.toLowerCase();
  for (const [nr, n] of Object.entries(NAMEN)) {
    if (n.toLowerCase() === lower) return Number(nr);
  }
  for (const [nr, n] of Object.entries(NAMEN)) {
    if (n.toLowerCase().includes(lower) || lower.includes(n.toLowerCase())) return Number(nr);
  }
  return null;
}

// Nur Versicherer mit Prämien im Jahr des Stichtags — wer nicht mehr zugelassen ist (2027: AMB, Vallée
// d'Entremont), erscheint dort nicht mehr im Vergleich.
export function allInsurerNrs(stichtag = new Date()) {
  return Object.keys(daten(stichtag)).map(Number);
}

export { ERW_FRA, KIN_FRA, DETAIL_QUELLEN };
// Neuestes Datenjahr. Für «mit welchen Prämien wird gerechnet» detailJahr(stichtag) nehmen.
export const DETAIL_DATA_VERSION = String(DETAIL_JAHRE[DETAIL_JAHRE.length - 1]);
export const DETAIL_DATA_SOURCE = 'BAG priminfo.admin.ch Gesamtbericht (bis 2026 Excel, ab 2027 PDF)';
