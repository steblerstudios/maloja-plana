// Verzugszins als Annäherung — gebaut 27.09.2026 (Mahnung, Stebler Studios «1-3»).
//
// OR Art. 104 Abs. 1: 5 % «für das Jahr»; Abs. 2: ein vertraglich höherer Satz gilt auch im
// Verzug. OR Art. 105 Abs. 3: kein Zins auf Verzugszins → einfacher Zins, nie Zinseszins.
// 🛑 Die Tageszählung (365 oder 360 Tage im Jahr) steht NICHT im Gesetz. Darum rechnen wir
// beide und zeigen sie als «rund» — die App behauptet keinen genauen Betrag.
// Tage: Tag des Verzugsbeginns zählt nicht mit (wie OR Art. 77 Abs. 1 bei Fristen), der
// Stichtag zählt. Steuern haben einen eigenen, vom EFD festgesetzten Satz (DBG Art. 164) —
// dafür ist dieser Rechner nicht gedacht.

import { leseDatum, heuteIso } from './fristen.js';

export const SATZ_GESETZ = 5;
// Obergrenze der Eingabe: kein Rechtswert, nur Schutz vor Tippfehlern (z. B. 50 statt 5.0).
export const SATZ_MAX = 30;

// Ganze Kalendertage zwischen zwei ISO-Daten, sommerzeit-sicher (UTC), oder null.
export function tageZwischen(vonIso, bisIso) {
  const a = leseDatum(vonIso);
  const b = leseDatum(bisIso);
  if (!a || !b) return null;
  const utc = (d) => Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((utc(b) - utc(a)) / 86400000);
}

// Satz aus der Eingabe (Komma oder Punkt) — nur 0 < Satz ≤ SATZ_MAX, sonst null.
export function leseSatz(v) {
  const s = String(v == null ? '' : v).trim().replace(',', '.');
  if (!/^\d+(\.\d{1,3})?$/.test(s)) return null;
  const n = parseFloat(s);
  return n > 0 && n <= SATZ_MAX ? n : null;
}

// { tage, zins365, zins360 } oder null (ungültige Eingabe, Beginn in der Zukunft, 0 Tage).
export function verzugszins({ betrag, satz = SATZ_GESETZ, seit, bis = heuteIso() }) {
  const tage = tageZwischen(seit, bis);
  const p = typeof satz === 'number' ? satz : leseSatz(satz);
  if (!(betrag > 0) || !p || !(tage > 0)) return null;
  const proTag = (jahr) => Math.round(betrag * (p / 100) * (tage / jahr) * 100) / 100;
  return { tage, satz: p, zins365: proTag(365), zins360: proTag(360) };
}
