// Leises Einblenden beim Wechsel der Ansicht (25.09.2026).
//
// Vorher wechselte das Bild hart: Übersicht weg, Kapitel da. Jetzt kommt die neue Ansicht
// in einer Viertelsekunde herein — nur über die Deckkraft. Bewusst OHNE Verschieben:
// ein transform auf <main> machte es während der Animation zum Bezugsrahmen für jedes
// position:fixed darin (Schubladen, Hinweise) — die wären kurz mitgerutscht.
//
// Nicht bei «Zurück»: dort springt die Seite an die alte Stelle (merkeStelle), und ein
// Aufblenden darüber sähe aus wie ein Flackern. Und nie bei reduzierter Bewegung — die
// Web-Animations-API ist vom CSS-Block in tokens.css NICHT erfasst, darum hier selbst.
import { duration, ease } from '../config/tokens.js';

export const bewegungReduziert = (doc = document, win = window) =>
  doc.documentElement.getAttribute('data-reduce-motion') === '1'
  || !!(win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);

export function blendeEin(el, { zurueck = false, reduziert = false } = {}) {
  if (!el || zurueck || reduziert || typeof el.animate !== 'function') return null;
  return el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: duration.normal, easing: ease });
}
