// Laufende Abläufe im Kalender (Entwurf «Zeitleiste», Abschnitt G, Mockups 23.10.2026; gebaut auf
// Zuruf von Stebler Studios 27.10.2026): ein begonnener, nicht fertiger Ablauf liegt als Band in der
// Farbe seines Bereichs unter der Tagesleiste und, wenn er eine Frist hat, als Bogen im Jahreskreis.
//
// Was der Kalender weiss, und nicht mehr: der Stand speichert nur «Schritt n» und «fertig»
// (utils/ablaufStand.js), kein Anfangsdatum. Das Band beginnt darum heute — ein früherer Anfang
// wäre erfunden. Es endet an der Frist, die der Ablauf selbst in den Kalender gelegt hat
// (Erinnerung mit `ablauf: name`, seit 27.10.2026). Ohne Frist reicht es bis zum Ende des laufenden
// Monats; weiter nicht, weil niemand weiss, wie lange.
//
// «Begonnen» heisst: es gibt einen gespeicherten Stand. Er entsteht erst, wenn man im Ablauf
// weiterblättert (UmzugAblauf: setStand). Nur ansehen legt nichts an.
// Im Beispiel und beim Ausprobieren (`vorlaeufig`) gibt es keinen gespeicherten Stand — kein Band.

import { bereichZeichenFarbe } from '../data/aufgabenBereiche.js';
import { kontrast, lesbareFarbe } from './lebensbereichFruechte.js';

// Farbe des Bands: die Bereichsfarbe, so weit abgedunkelt (hell) bzw. aufgehellt (dunkel), dass die
// Schrift in der Grundfarbe 4.5:1 hält (a11y-Prüfung 27.10.2026: Basis, Finanzen, Ausbildung hell und
// Behörden dunkel lagen knapp darunter). Der Farbton bleibt. Schrift: immer palette.bg.
export const bandFarbe = (bereich, palette) => {
  const dunkel = kontrast(palette.bg, '#FFFFFF') > kontrast(palette.bg, '#000000');
  return lesbareFarbe(bereichZeichenFarbe(bereich, palette), palette.bg, dunkel);
};

// Schrittzahl als Zahl statt Import aus AblaufSchale.jsx, damit der Kalender die Ablauf-Schale
// nicht mitlädt. Ein Test hält sie gleich mit PASS_SCHRITTE.
export const ABLAEUFE_MIT_STAND = [
  // view: wohin «Was jetzt?» bei einer verpassten Frist des Ablaufs führt (dort steht, was dann gilt).
  { name: 'umzug', total: 4, titelKey: 'umzug.title', bereich: 'wohnen', view: 'umzug' },
];

// Liest den Stand wie ablaufStandLaden (utils/ablaufStand.js), aber ohne Import: sonst würde
// ablaufStand.js zu einer eigenen geteilten Datei, deren Name im Startbündel steht (+0.01 kB).
// Ein Test hält Schlüssel und Regeln gleich. null = kein gespeicherter Stand (nicht begonnen).
export const gespeicherterStand = (name, total) => {
  try {
    const roh = JSON.parse(localStorage.getItem('or5_ablauf_' + name) || 'null');
    if (!roh || typeof roh !== 'object') return null;
    const n = Number(roh.schritt);
    return { schritt: Number.isInteger(n) && n >= 0 && n < total ? n : 0, fertig: roh.fertig === true };
  } catch {
    return null;
  }
};

// [{ name, total, titelKey, schritt (ab 1), frist: ISO | null }]
export const laufendeAblaeufe = (reminders, vorlaeufig, heute) => {
  if (vorlaeufig) return [];
  const liste = Array.isArray(reminders) ? reminders : [];
  return ABLAEUFE_MIT_STAND.flatMap((a) => {
    const stand = gespeicherterStand(a.name, a.total);
    if (!stand || stand.fertig) return [];
    const frist = liste
      .filter((r) => r && r.ablauf === a.name && !r.done && typeof r.dueDate === 'string' && r.dueDate >= heute)
      .map((r) => r.dueDate)
      .sort()[0] || null;
    return [{ ...a, schritt: stand.schritt + 1, frist }];
  });
};

const zuIso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const tagePlus = (isoTag, n) => { const [j, m, t] = isoTag.split('-').map(Number); return zuIso(new Date(j, m - 1, t + n)); };
const tageZwischen = (a, b) => { const [j1, m1, t1] = a.split('-').map(Number); const [j2, m2, t2] = b.split('-').map(Number); return Math.round((new Date(j2, m2 - 1, t2) - new Date(j1, m1 - 1, t1)) / 86400000); };

// Die Tagesleiste wie im Entwurf G: ein durchgehendes Fenster über den Monatswechsel, das drei
// Tage vor heute beginnt (im laufenden Monat) bzw. drei Tage vor dem Ersten des gewählten Monats.
export const FENSTER_TAGE = 42;
export const fensterStart = (jahr, monat, heute) => {
  const erster = zuIso(new Date(jahr, monat, 1));
  return tagePlus(erster.slice(0, 7) === heute.slice(0, 7) ? heute : erster, -3);
};
export const fensterTage = (start) => Array.from({ length: FENSTER_TAGE }, (_, i) => tagePlus(start, i));

// Lage des Bands im Fenster als Index der Tage: { von, bis, weiterLinks, weiterRechts }. null: kein Band.
// Anfang ist heute (kein Startdatum gespeichert). Ende ist die Frist; ohne Frist das Ende des laufenden
// Monats, weil niemand weiss, wie lange der Ablauf noch dauert.
export const bandImFenster = (ablauf, start, heute) => {
  const ende = ablauf.frist || zuIso(new Date(Number(heute.slice(0, 4)), Number(heute.slice(5, 7)), 0));
  const von = Math.max(0, tageZwischen(start, heute));
  const bis = Math.min(FENSTER_TAGE - 1, tageZwischen(start, ende));
  if (von > FENSTER_TAGE - 1 || bis < 0 || bis < von) return null;
  return { von, bis, weiterLinks: tageZwischen(start, heute) < 0, weiterRechts: tageZwischen(start, ende) > FENSTER_TAGE - 1 };
};
