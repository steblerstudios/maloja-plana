// ─── K38 · «trifft nicht zu»: Gruppen (Notfallkontakt) und Kopplung (Arbeitgeber) ───
//
// Notfallkontakt: Nicht alle Menschen haben eine Kontaktperson für den Notfall. Wer das markiert,
// soll nicht als unvollständig gelten — und die Notfall-Ausgaben sagen dann ruhig
// «Keine Kontaktperson hinterlegt», statt leer zu bleiben.
//
// Feld-Merkmale (constants.js):
//   `naMit`  — Felder, die beim Markieren mitgehen (Kontakt → Telefon des Kontakts).
//   `naVon`  — dieses Feld hängt an einem anderen; ist das markiert, bleibt es verdeckt.
// Liegt nur in lazy Chunks (Kapitel, Dossier, Export), nicht im Hauptbundle — das ist
// voll (size-limit 65 kB); darum steht auch die Kopplung hier und nicht in `updateData`.

import { NA_FELD, trifftNichtZu } from './vollstaendigkeit.js';

const liste = (d) => (d && Array.isArray(d[NA_FELD]) ? d[NA_FELD] : []);

// Kontakt als «trifft nicht zu» markiert und kein Name eingetragen.
export const keineKontaktperson = (notfall) =>
  Boolean(notfall) && !notfall.emergencyContact && trifftNichtZu(notfall, 'emergencyContact');

// Neue Liste nach dem Umschalten eines Feldes samt seinen `naMit`-Feldern.
// Beim Setzen gehen nur leere Mit-Felder mit (eine eingetragene Nummer bleibt sichtbar);
// beim Zurücknehmen fallen alle wieder weg.
export const naGruppeUmschalten = (d, field) => {
  const l = liste(d);
  const gruppe = [field.k, ...(field.naMit || [])];
  if (l.includes(field.k)) return l.filter((x) => !gruppe.includes(x));
  const neu = gruppe.filter((k, i) => i === 0 || !(d && d[k]));
  return [...l, ...neu.filter((k) => !l.includes(k))];
};

// Ein `naVon`-Feld ohne eigenen Wert wird nicht gezeigt, solange sein Hauptfeld markiert ist.
export const naVerdeckt = (d, field) =>
  Boolean(field.naVon) && trifftNichtZu(d, field.naVon) && !(d && d[field.k]);

// Arbeitgeber und seine Adresse werden in Finanzen UND Ausbildung & Arbeit abgefragt
// (die Werte füllen sich schon gegenseitig, main.jsx `updateData`). Eine Markierung gilt
// in beiden. Gespeichert wird weiter je Kapitel — beim Umschalten in beide `_na` —, also
// keine Migration, und jede Stelle, die ein Kapitel für sich liest, bleibt richtig.
// Eine Angabe im anderen Kapitel wird nicht überdeckt; zurückgenommen wird in beiden.
// Rückgabe: { kapitel, liste } für das andere Kapitel, oder null, wenn dort nichts ändert.
const GEKOPPELT = ['employer', 'employerAddress'];
const PARTNER = { finanzen: 'ausbildung', ausbildung: 'finanzen' };
export const naKopplung = (allData, kapitel, neu) => {
  const ziel = PARTNER[kapitel];
  if (!ziel || !allData) return null;
  const alt = liste(allData[kapitel]), zd = allData[ziel] || {}, vorher = liste(zd);
  let l = vorher;
  GEKOPPELT.forEach((k) => {
    if (alt.includes(k) === neu.includes(k)) return;
    if (!neu.includes(k)) l = l.filter((x) => x !== k);
    else if (!zd[k] && !l.includes(k)) l = [...l, k];
  });
  return l === vorher ? null : { kapitel: ziel, liste: l };
};
