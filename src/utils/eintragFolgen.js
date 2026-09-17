// ─── K45 · Folgen eines Eintrags (aus main.jsx `updateData`) ────────────────────
//
// 1. «Arbeitsbeginn» (Finanzen) und «Anstellung seit» (Ausbildung & Arbeit) meinen
//    dasselbe Datum. Wer eines einträgt, findet das andere vorbelegt — nur wenn es
//    leer und nicht als «trifft nicht zu» markiert ist, nie überschreibend. Nur ein
//    vollständiges Datum zählt: beim Tippen ins Datumsfeld entstehen Zwischenjahre
//    wie 0020 oder 0201, die sonst im anderen Feld kleben blieben.
// 2. Ein eingetragener Wert hebt «trifft nicht zu» auf — für jedes Feld, in jedem
//    Kapitel, das sich mit diesem Eintrag änderte (auch über eine Vorbelegung).
//
// Liegt im Hauptbundle (updateData), darum knapp gehalten.

import { naBereinigen, trifftNichtZu } from './vollstaendigkeit.js';

const DATUM = { finanzen: ['startDate', 'ausbildung', 'employmentStart'], ausbildung: ['employmentStart', 'finanzen', 'startDate'] };
const VOLL = /^(19|20)\d\d-\d\d-\d\d$/;

export const eintragFolgen = (prev, next, chapter, field, value) => {
  const d = DATUM[chapter];
  if (d && field === d[0] && VOLL.test(value || '')) {
    const z = next[d[1]] || {};
    if (!z[d[2]] && !trifftNichtZu(z, d[2])) next[d[1]] = { ...z, [d[2]]: value };
  }
  for (const k in next) if (next[k] !== prev[k]) next[k] = naBereinigen(next[k]);
  return next;
};
