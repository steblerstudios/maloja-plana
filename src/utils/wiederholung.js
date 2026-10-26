// Wiederkehrende Termine: der nächste Termin nach Kalender, nicht nach fester Tageszahl.
//
// Seitenrundgang 26.10.2026 (W10): «monatlich» rechnete alle 30 Tage, «jährlich» alle 365 Tage — der
// Termin wanderte (am 15. jedes Monats lag er nach einem Jahr am 10.; im Schaltjahr 2028 rutschte
// «jährlich» um einen Tag). Jetzt nach Kalendertag bzw. -monat (utils/fristen.js). Die frühere Rechnung
// in Millisekunden lief durchgehend in UTC (new Date(iso) → toISOString) und traf den Tag darum richtig;
// der Befund S2 «nachts der Vortag» trifft auf diese Stellen nicht zu (nachgeprüft beim Bau).
//
// Monatsende: fehlt der Tag im Zielmonat, gilt der letzte Tag des Monats (31.1. + 1 Monat → 28./29.2.) — wie
// bei den Fristen (utils/fristen.js). Mit dem Ankertag kehrt die Serie danach auf den ursprünglichen Tag zurück;
// der .ics-Export bildet dasselbe ab (utils/icsExport.js, BYMONTHDAY … BYSETPOS=-1).

import { plusTage, leseDatum } from './fristen.js';

export const INTERVALLE = Object.freeze({
  once: null,
  daily: { tage: 1 },
  weekly: { tage: 7 },
  monthly: { monate: 1 },
  quarterly: { monate: 3 },
  halfYearly: { monate: 6 },
  yearly: { monate: 12 },
});

// Nächster Termin nach `iso` (YYYY-MM-DD, auch mit Uhrzeit dahinter). «once», unbekannte Wiederholung oder
// unlesbares Datum → null (Prüfung 26.10.2026: Unbekanntes NICHT still als jährlich weiterschalten).
// `ankerTag`: der ursprüngliche Tag im Monat (z. B. 31) — damit eine Serie am Monatsende nach einem kurzen
// Monat wieder auf den 31. zurückkehrt (31.1. → 28.2. → 31.3.), statt auf dem 28. hängen zu bleiben.
export function naechsterTermin(iso, wiederholung, ankerTag) {
  const tag = String(iso || '').slice(0, 10);
  const d = leseDatum(tag);
  if (!d) return null;
  const schritt = INTERVALLE[wiederholung];
  if (!schritt) return null;
  if (schritt.tage) return plusTage(tag, schritt.tage);
  const anker = Number.isInteger(ankerTag) && ankerTag >= 1 && ankerTag <= 31 ? ankerTag : d.getDate();
  const ziel = new Date(d.getFullYear(), d.getMonth() + schritt.monate, 1);
  const letzter = new Date(ziel.getFullYear(), ziel.getMonth() + 1, 0).getDate();
  ziel.setDate(Math.min(anker, letzter));
  return `${ziel.getFullYear()}-${String(ziel.getMonth() + 1).padStart(2, '0')}-${String(ziel.getDate()).padStart(2, '0')}`;
}

// Erledigte Wiederholung bis heute weiterschalten — in einer Schleife, nicht nur einen Schritt (ein zwei Jahre
// alter Termin stand sonst nach dem Start noch immer in der Vergangenheit). Obergrenze für «täglich».
// Gibt den neuen Eintrag zurück oder null, wenn nichts zu tun ist. Merkt sich beim ersten Mal den Ankertag.
export function bisHeuteWeiter(eintrag, heute) {
  if (!eintrag || !eintrag.done || !INTERVALLE[eintrag.recurrence]) return null;
  let datum = String(eintrag.dueDate || '').slice(0, 10);
  const start = leseDatum(datum);
  if (!start || datum > heute) return null;
  const ankerTag = Number.isInteger(eintrag.ankerTag) ? eintrag.ankerTag : start.getDate();
  for (let i = 0; i < 400 && datum <= heute; i++) {
    const naechst = naechsterTermin(datum, eintrag.recurrence, ankerTag);
    if (!naechst) return null;
    datum = naechst;
  }
  return { ...eintrag, dueDate: datum, ankerTag, done: false, completedDate: null };
}
