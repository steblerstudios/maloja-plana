import { PROZENT } from './geld.js';
// Eigener Wert gegen einen Schnitt (Region, Kanton) — EINE Rechnung für alle Lage-Instrumente
// (Barometer Prämie, Wohnen, Kachel «Miete»; seit 10.11.2026). Schwelle ±2 % wie die Farbe des
// Regions-Punkts. Seit 18.11.2026 eigene Datei, damit Rechnungen sie ohne Bild-Bauteil lesen
// (Bauplan Lebensbereich: `rechnung.js` importiert nie ein Bauteil).
export function lageZurRegion(userValue, regional) {
  if (!(userValue > 0) || !(regional > 0)) return null;
  const pct = Math.round((userValue / regional - 1) * 100);
  const richtung = userValue > regional * 1.02 ? 'Above' : userValue < regional * 0.98 ? 'Below' : 'Equal';
  return { pct, richtung };
}

// Die Lage als Hauptzahl (Regel «Zahl», Matrix §10): «−5 %», «+12 %», «≈ 0 %».
export const lageWert = (lage) => (!lage ? null : lage.richtung === 'Equal' ? '≈ 0' + PROZENT : (lage.pct > 0 ? '+' : '−') + Math.abs(lage.pct) + PROZENT);
