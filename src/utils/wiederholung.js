// Wiederkehrende Termine: der nächste Termin nach Kalender, nicht nach fester Tageszahl.
//
// Seitenrundgang 26.10.2026 (W10): «monatlich» rechnete alle 30 Tage, «jährlich» alle 365 Tage — der
// Termin wanderte (am 15. jedes Monats lag er nach einem Jahr am 10.; im Schaltjahr 2028 rutschte
// «jährlich» um einen Tag). Jetzt nach Kalendertag bzw. -monat (utils/fristen.js). Die frühere Rechnung
// in Millisekunden lief durchgehend in UTC (new Date(iso) → toISOString) und traf den Tag darum richtig;
// der Befund S2 «nachts der Vortag» trifft auf diese Stellen nicht zu (nachgeprüft beim Bau).
//
// Monatsende: dieselbe Regel wie bei den Fristen (utils/fristen.js, sinngemäss OR Art. 77 Abs. 1) — fehlt der Tag im Zielmonat, gilt der letzte Tag des
// Monats (31.1. + 1 Monat → 28./29.2.). Ein Termin am 31. bleibt danach auf dem kürzeren Tag stehen.

import { plusTage, plusMonate, leseDatum } from './fristen.js';

export const INTERVALLE = Object.freeze({
  once: null,
  daily: { tage: 1 },
  weekly: { tage: 7 },
  monthly: { monate: 1 },
  quarterly: { monate: 3 },
  halfYearly: { monate: 6 },
  yearly: { monate: 12 },
});

// Nächster Termin nach `iso` (YYYY-MM-DD, auch mit Uhrzeit dahinter). Unbekannte Wiederholung → jährlich
// (wie bisher), «once» oder unlesbares Datum → null.
export function naechsterTermin(iso, wiederholung) {
  const tag = String(iso || '').slice(0, 10);
  if (!leseDatum(tag)) return null;
  const schritt = wiederholung in INTERVALLE ? INTERVALLE[wiederholung] : INTERVALLE.yearly;
  if (!schritt) return null;
  return schritt.tage ? plusTage(tag, schritt.tage) : plusMonate(tag, schritt.monate);
}
