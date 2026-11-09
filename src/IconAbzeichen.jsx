import React from 'react';
import { Icons } from './IconKern.jsx';
import { basis, basisFamilie, versicherungen, ausbildung, helm, notfall, finanzen, behoerden } from './IconMuenzen.jsx';

// ─── Abzeichen-Bauteil (Icon-Plan November 2026, Bauplan B3) ───────────────
// Ein Seiten-Zeichen = Leitform (Kapitel bzw. Ast) + Abzeichen unten rechts. Was eine Seite trägt,
// steht in config/seitenZeichen.js (B1); dieses Bauteil zeichnet es. Entscheide im Blatt
// docs/design/icon-besprechung-2026-11.md: Lage V1 unten rechts, freigeschnitten (2b) ·
// gefülltes Abzeichen, Zeichen ausgestanzt (C, Behörden-Runde) · «leer» = Ring und Zeichen in der
// Farbe der Form, wenn niemand mitspielt (Finanzen C, E) · Geld = der echte Fünfliber im Kleinen (Q).
//
// Wird noch von keiner Seite geladen (das kommt in B4); darum kostet es das Startbündel nichts.

// Die Zeichen im Abzeichen, gezeichnet im 24er-Raster um die Abzeichen-Mitte (18,3 | 18,3):
// [Strichbreite, SVG-Teile]. «#000» = Tinte des Zeichens, «#fff» = Loch im Zeichen. Übernommen aus
// den abgenommenen Bildern (Gesamtmatrix 07.11.2026), je Zeichen genau eine Bedeutung.
export const ZEICHEN_BILD = {
  plus: ['1.40', '<path d="M15.9 18.3 H20.7 M18.3 15.9 V20.7"/>'],
  minus: ['1.12', '<path d="M15.9 18.3 H20.7"/>'],
  pfeilHinaus: ['1.12', '<path d="M15.8 18.3 H20.7"/><path d="M19 16.6 L20.7 18.3 L19 20"/>'],
  pfeilHerein: ['1.12', '<path d="M20.8 18.3 H15.9"/><path d="M17.6 16.6 L15.9 18.3 L17.6 20"/>'],
  wechselpfeile: ['1.12', '<path d="M15.6 17.2 H20.6 L19.2 15.9 M21 19.4 H16 L17.4 20.7"/>'],
  kreuzchen: ['1.12', '<path d="M16.5 16.5 L20.1 20.1 M20.1 16.5 L16.5 20.1"/>'],
  ausrufezeichen: ['1.12', '<path d="M18.3 15.7 V18.6"/><path d="M18.3 20.7 V20.75"/>'],
  haken: ['1.1', '<path d="M16 18.5 L17.7 20.1 L20.7 16.6"/>'],
  sanduhr: ['1.12', '<path d="M16.6 15.9 H20 L18.3 18.3 Z M16.6 20.7 H20 L18.3 18.3 Z"/>'],
  uhr: ['1.1', '<circle cx="18.3" cy="18.3" r="2.9"/><path d="M18.3 15.7v.6M18.3 20.3v.6M15.7 18.3h.6M20.3 18.3h.6" stroke-width="0.7"/><path d="M18.3 18.3l-.9-1.6M18.3 18.3l1.3-1.8" stroke-width="0.8"/><circle cx="18.3" cy="18.3" r=".35" fill="#000" stroke="none"/>'],
  blitz: ['1.12', '<path d="M18.9 15.6 L16.6 18.6 H18.4 L17.7 21 L20 17.9 H18.2 Z"/>'],
  blatt: ['1.12', '<path d="M16.7 15.6 H19.2 L20.2 16.6 V21 H16.7 Z"/><path d="M17.6 18.2 H19.3 M17.6 19.6 H19.3"/>'],
  blattHerz: ['0.47', '<path d="M16.3 15.4 H19.3 L20.5 16.6 V21.2 H16.3 Z"/><path d="M18.4 20 C17.5 19.4 17.1 18.9 17.2 18.4 C17.3 17.9 18 17.8 18.4 18.3 C18.8 17.8 19.5 17.9 19.6 18.4 C19.7 18.9 19.3 19.4 18.4 20 Z" fill="#000" stroke="none"/>'],
  balken: ['1.12', '<path d="M16.2 20.5 V18.8"/><path d="M18.3 20.5 V16.2"/><path d="M20.4 20.5 V17.5"/>'],
  prozent: ['1.12', '<path d="M16.1 20.5 L20.5 16.1"/><circle cx="16.4" cy="16.4" r="0.55"/><circle cx="20.2" cy="20.2" r="0.55"/>'],
  schere: ['1.1', '<circle cx="16.4" cy="19.9" r="1.05"/><circle cx="20.2" cy="19.9" r="1.05"/><path d="M17.1 19.1 L20 15.6 M19.5 19.1 L16.6 15.6"/>'],
  schirm: ['1.1', '<path d="M15.6 18 Q18.3 14.6 21 18 Z" fill="#000"/><path d="M18.3 18 V20.4 Q18.3 21 17.7 20.8"/>'],
  waage: ['1.1', '<path d="M18.3 15.9 V20.5 M17 20.6 H19.6 M15.9 16.7 H20.7"/><path d="M15.9 16.7 L15.2 18.6 H16.6 Z M20.7 16.7 L20 18.6 H21.4 Z" stroke-width="0.7"/>'],
  karteChip: ['1.1', '<rect x="15.3" y="16.2" width="6" height="4.2" rx="0.6" fill="#000" stroke="none"/><rect x="16.2" y="17.2" width="1.6" height="1.3" rx="0.25" fill="#fff" stroke="none"/>'],
  karteMitPerson: ['1.40', '<rect x="15.4" y="16.3" width="5.8" height="4.1" rx="0.6" fill="#000" stroke="none"/><circle cx="17" cy="17.9" r="0.6" fill="#fff" stroke="none"/><path d="M16.2 19.7 Q17 18.8 17.8 19.7" stroke="#fff" stroke-width="0.5"/><path d="M18.6 17.7 H20.4 M18.6 18.8 H20" stroke="#fff" stroke-width="0.45"/>'],
  kartePlus: ['1.40', '<rect x="15.4" y="16.3" width="5.8" height="4.1" rx="0.6" fill="#000" stroke="none"/><path d="M18.3 17.1 V19.6 M17.05 18.35 H19.55" stroke="#fff" stroke-width="0.6"/>'],
  schloss: ['1.12', '<rect x="16.3" y="18" width="4" height="2.9" rx="0.4"/><path d="M17.1 18 V17 A1.2 1.2 0 0 1 19.5 17 V18"/>'],
  zahl18: ['1.1', '<path d="M16.1 16.4 L17 15.8 V20.8"/><path d="M19.4 18.2 Q18.4 18.2 18.4 17 Q18.4 15.8 19.4 15.8 Q20.4 15.8 20.4 17 Q20.4 18.2 19.4 18.2 Q18.2 18.2 18.2 19.5 Q18.2 20.8 19.4 20.8 Q20.6 20.8 20.6 19.5 Q20.6 18.2 19.4 18.2"/>'],
  ringe: ['1.40', '<circle cx="17.3" cy="18.3" r="1.6"/><circle cx="19.3" cy="18.3" r="1.6"/>'],
  herz: ['1.12', '<path d="M18.3 20.6 C16.4 19.3 15.6 18.2 15.8 17.1 C16 16 17.6 15.7 18.3 16.9 C19 15.7 20.6 16 20.8 17.1 C21 18.2 20.2 19.3 18.3 20.6 Z"/>'],
  herzRiss: ['1.40', '<path d="M18.3 20.6 C15.3 18.7 15.5 16 17.2 16.1 Q17.9 16.2 18.3 17 Q18.7 16.2 19.4 16.1 C21.1 16 21.3 18.7 18.3 20.6 Z" fill="#000" stroke="none"/><path d="M18.3 16.9 L17.6 18.1 L18.9 19.1 L18.3 20.7" stroke="#fff" stroke-width="0.9"/>'],
  herzPuls: ['1.12', '<path d="M18.3 21 C16.4 19.7 15.4 18.5 15.4 17.2 C15.4 16.1 16.2 15.5 17 15.5 C17.6 15.5 18 15.8 18.3 16.3 C18.6 15.8 19 15.5 19.6 15.5 C20.4 15.5 21.2 16.1 21.2 17.2 C21.2 18.5 20.2 19.7 18.3 21 Z" fill="#000" stroke="none"/><path d="M15.9 17.9 H17.1 L17.6 17 L18.3 18.8 L18.9 16.9 L19.3 17.9 H20.7" stroke="#fff" stroke-width="0.5"/>'],
  kerze: ['0.47', '<path d="M17.4 21 V18 H19.2 V21"/><path d="M18.3 17.2 Q17.5 16.3 18.3 15.4 Q19.1 16.3 18.3 17.2 Z"/>'],
  berg: ['1.12', '<path d="M15.6 20.6 L17.6 17 L18.8 18.8 L19.6 17.8 L21 20.6 Z"/>'],
  saeulen: ['1.12', '<path d="M15.9 16.3 H20.7"/><path d="M16.7 17.1 V19.7 M18.3 17.1 V19.7 M19.9 17.1 V19.7"/><path d="M15.9 20.4 H20.7"/>'],
  lenkrad: ['1.1', '<circle cx="18.3" cy="18.3" r="2.8"/><path d="M15.6 18.7 Q18.3 17.3 21 18.7 M18.3 18.5 V21"/><circle cx="18.3" cy="18.5" r="1.05" fill="#000" stroke="none"/>'],
  gradabzeichen: ['1.1', '<path d="M16 17.4l2.3-1.6 2.3 1.6M16 20l2.3-1.6 2.3 1.6"/>'],
  pflegebett: ['0.47', '<path d="M15.6 16.4 V20.9 M15.6 19.3 H21 V20.9"/><circle cx="16.9" cy="18.4" r="0.6" fill="#000" stroke="none"/><path d="M17.9 18.6 H20.6"/>'],
  hoerer: ['1.1', '<g transform="translate(15.2 15.2) scale(0.26)" stroke-width="5.6"><path d="M7.2 3.5 h2.6 l1.4 3.8 -1.9 1.5 a11 11 0 0 0 5.9 5.9 l1.5 -1.9 3.8 1.4 v2.6 a2 2 0 0 1 -2.2 2 A16.5 16.5 0 0 1 5.2 5.7 a2 2 0 0 1 2 -2.2 Z"/></g>'],
  handy: ['1.1', '<rect x="16.6" y="15.3" width="3.4" height="6" rx="0.7"/><path d="M17.7 20.1 H18.9"/>'],
  miniHelm: ['1.12', '<path d="M15.9 19.4 Q15.9 16.2 18.3 16.2 Q20.7 16.2 20.7 19.4 Z"/><path d="M15.2 19.7 H21.4"/>'],
  miniSchild: ['0.84', '<path d="M18.3 15.2 L15.9 16.3 V18.4 Q15.9 20.5 18.3 21.4 Q20.7 20.5 20.7 18.4 V16.3 Z" fill="#000" stroke="none"/><g transform="translate(18.3 18.2) scale(0.27)" fill="#fff" stroke="none"><path d="M0 -1.4 Q2 -3.4 0 -6.4 Q-2 -3.4 0 -1.4 Z" transform="rotate(22.5)"/><path d="M0 -1.4 Q2 -3.4 0 -6.4 Q-2 -3.4 0 -1.4 Z" transform="rotate(67.5)"/><path d="M0 -1.4 Q2 -3.4 0 -6.4 Q-2 -3.4 0 -1.4 Z" transform="rotate(112.5)"/><path d="M0 -1.4 Q2 -3.4 0 -6.4 Q-2 -3.4 0 -1.4 Z" transform="rotate(157.5)"/><path d="M0 -1.4 Q2 -3.4 0 -6.4 Q-2 -3.4 0 -1.4 Z" transform="rotate(202.5)"/><path d="M0 -1.4 Q2 -3.4 0 -6.4 Q-2 -3.4 0 -1.4 Z" transform="rotate(247.5)"/><path d="M0 -1.4 Q2 -3.4 0 -6.4 Q-2 -3.4 0 -1.4 Z" transform="rotate(292.5)"/><path d="M0 -1.4 Q2 -3.4 0 -6.4 Q-2 -3.4 0 -1.4 Z" transform="rotate(337.5)"/><circle r="1.9"/></g>'],
};

// Leitform-Name (config/seitenZeichen.js) → Zeichnung.
const LEITFORM_BILD = {
  ausweiskarte: basis,
  ausweiskarteZwei: basisFamilie,
  chalet: () => Icons.wohnen(),
  fuenfliber: finanzen,
  edelweissSchild: versicherungen,
  schulhut: ausbildung,
  helm,
  helvetia: behoerden,
  arztkoffer: notfall,
};
export const LEITFORMEN = Object.keys(LEITFORM_BILD);

const MITTE = 18.3;
let zaehler = 0;
const url = (id) => 'url(#' + id + ')';
// Eine Zeichnung als eingebettetes Feld (die Münzen sind im 48er-Raster gezeichnet).
const eingebettet = (fn, x, y, groesse) => React.cloneElement(fn(), { x, y, width: groesse, height: groesse });
// Das Zeichen als SVG-Teile; für «leer» werden Tinte und Loch vertauscht (Tinte = sichtbar).
const zeichenTeile = (name, tinteSichtbar) => {
  const [breite, teile] = ZEICHEN_BILD[name];
  const html = tinteSichtbar ? teile.replace(/#000/g, '#tmp').replace(/#fff/g, '#000').replace(/#tmp/g, '#fff') : teile;
  return React.createElement('g', {
    fill: 'none', stroke: tinteSichtbar ? '#fff' : '#000', strokeWidth: breite, strokeLinecap: 'round', strokeLinejoin: 'round',
    // Feste Zeichnungen aus dieser Datei, keine Eingaben — darum als SVG-Text eingesetzt.
    dangerouslySetInnerHTML: { __html: html },
  });
};

// leitform: Name aus seitenZeichen.js · zeichen: Name aus ZEICHEN_BILD, 'fuenfliber' oder null ·
// art: 'voll' | 'leer' · farbe: Farbe des Abzeichens · formFarbe: Farbe der Leitform (Kapitel).
export const FamilienZeichen = ({ leitform, zeichen, art = 'voll', farbe, formFarbe, ...rest }) => {
  const id = 'abz' + (zaehler += 1);
  const form = LEITFORM_BILD[leitform];
  if (!form) return null;
  const kinder = [];
  if (!zeichen) {
    kinder.push(React.createElement('g', { key: 'f', style: { color: formFarbe } }, eingebettet(form, 0, 0, 24)));
  } else {
    // Leitform, unten rechts freigeschnitten (Abstand 1,1 um das Abzeichen).
    kinder.push(React.createElement('mask', { key: 'm', id: id + 'f' },
      React.createElement('rect', { width: '24', height: '24', fill: '#fff' }),
      React.createElement('circle', { cx: MITTE, cy: MITTE, r: '6.6', fill: '#000' })));
    kinder.push(React.createElement('g', { key: 'f', mask: url(id + 'f'), style: { color: formFarbe } }, eingebettet(form, 0, 0, 24)));
    if (zeichen === 'fuenfliber') {
      // Der echte Fünfliber im Kleinen (Entscheid Q, 07.11.): die Finanzen-Leitform, gold.
      kinder.push(React.createElement('g', { key: 'a', style: { color: farbe } }, eingebettet(finanzen, MITTE - 5.5, MITTE - 5.5, 11)));
    } else if (art === 'leer') {
      kinder.push(React.createElement('circle', { key: 'r', cx: MITTE, cy: MITTE, r: '5.1', fill: 'none', stroke: farbe, strokeWidth: '0.9' }));
      kinder.push(React.createElement('mask', { key: 'zm', id: id + 'z' }, zeichenTeile(zeichen, true)));
      kinder.push(React.createElement('rect', { key: 'z', width: '24', height: '24', fill: farbe, mask: url(id + 'z') }));
    } else {
      kinder.push(React.createElement('mask', { key: 'zm', id: id + 'z' },
        React.createElement('circle', { cx: MITTE, cy: MITTE, r: '5.5', fill: '#fff' }), zeichenTeile(zeichen, false)));
      kinder.push(React.createElement('rect', { key: 'z', width: '24', height: '24', fill: farbe, mask: url(id + 'z') }));
    }
  }
  return React.createElement('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false', ...rest }, ...kinder);
};
