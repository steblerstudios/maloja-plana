import React from 'react';
import { Spinnennetz } from './Spinnennetz.jsx';
import { abschnittGruppen } from '../utils/abschnitte.js';
import { feldErledigt } from '../utils/vollstaendigkeit.js';

// Spinnennetz im Kapitel Versicherungen (Sophie 24.10.2026: Ort «Kapitel Versicherungen»).
// Eine Achse je Abschnitt des Kapitels; der Wert ist der Anteil erledigter Felder darin
// (ausgefüllt oder «trifft nicht zu») — dieselbe Regel wie überall. Es zeigt, WIE VIEL
// eingetragen ist, nicht, ob jemand gut versichert ist; das sagt der Hinweis darunter.
// Die Abschnitte stehen direkt darunter als Text; ein Tipp auf eine Achse öffnet den Abschnitt.
// Nachgeladen (ChapterView: React.lazy) — weder Haupt- noch Kapitel-Stück tragen es.

// constants.js löscht `sec` nach dem Übersetzen; ein Abschnitt heisst nach seinem ersten Feld.
// Fehlt eine Zuordnung (neues Feld vorne im Abschnitt), steht der volle Abschnittstitel da.
export const ABSCHNITT_VON_FELD = {
  kkInsurer: 'basic', bvgInsurer: 'occupational', uvg: 'additional',
  householdInsurance: 'property', autoInsurance: 'mobility', ahvContribution: 'social',
};

export const versicherungsAchsen = (chapter, d, tr) => abschnittGruppen(chapter.fields, chapter.title).map((g) => {
  const erledigt = g.felder.filter((f) => feldErledigt(d, f.k)).length;
  const anteil = g.felder.length ? erledigt / g.felder.length : 0;
  const sec = ABSCHNITT_VON_FELD[g.key];
  const k = 'chapters.versicherungen.netz.achse.' + sec;
  const kurz = sec && tr(k) !== k ? tr(k) : g.titel;
  return { key: g.key, kurz, anteil, aria: g.titel + ', ' + Math.round(anteil * 100) + ' %' };
});

export const VersicherungsNetz = ({ chapter, data, onAbschnitt, palette, tr }) => {
  const achsen = versicherungsAchsen(chapter, data, tr);
  return React.createElement(Spinnennetz, {
    achsen, palette,
    onAchse: (i) => onAbschnitt(achsen[i].key),
    ariaLabel: tr('chapters.versicherungen.netz.aria'),
    hinweis: tr('chapters.versicherungen.netz.hinweis'),
    leerText: tr('chapters.versicherungen.netz.leer'),
  });
};

export default VersicherungsNetz;
