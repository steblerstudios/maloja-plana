import React from 'react';
import { netzSchildTeile, teilWinkel, SCHILD_STUFEN } from '../data/netzSchild.js';
import { shieldPath } from './shieldShape.js';
import { text, weight, space, leading } from '../config/tokens.js';
import { hinweisZeichen } from '../IconSystem.jsx';
import { zahl } from '../utils/geld.js';

// Netz-Schild (F7-K3-6, Stebler Studios 27.10.2026): ersetzt im Kapitel Versicherungen das Spinnennetz und die
// zwei kleinen Schilde «Pflicht / Empfohlen». Logik: data/netzSchild.js. Die Form ist dieselbe wie überall
// (shieldShape.js), die Farben sind die Maloja-Töne: Sand für «noch nicht gedeckt» (ein Hinweis, kein Alarm),
// helles Salbei für die Grundversicherung, Salbei für gedeckt.
// Der Stand steht nie nur im Bild: Grösse der Füllung + Liste mit ✓/○ und Wort darunter (a11y).

const B = 340, H = 330;
const CX = B / 2, TOP = 6, HGT = 318;
const CY = TOP + 0.43 * HGT; // Mitte der Teile: über der halben Höhe, weil das Schild oben breiter ist
const SCHILD = shieldPath(CX, TOP, 300, HGT);
const rad = (g) => (g * Math.PI) / 180;
const punkt = (g, r) => [CX + r * Math.cos(rad(g)), CY + r * Math.sin(rad(g))];
// Um die Mitte skaliert: die Füllung wächst von innen nach aussen.
const skaliert = (s) => `translate(${CX * (1 - s)} ${CY * (1 - s)}) scale(${s})`;

// Keil um den Mittelwinkel, weit über das Schild hinaus — das Schild selbst schneidet ihn zu.
const keil = (mitte, breite) => {
  const pts = [[CX, CY]];
  for (let g = mitte - breite / 2; g <= mitte + breite / 2 + 0.01; g += 3) pts.push(punkt(g, 420));
  return pts.map((p) => p.map((x) => Math.round(x * 10) / 10).join(',')).join(' ');
};

export const NetzSchild = ({ palette, t, versicherungen, employed, annualIncome, annualIncomeMit13, lohnBasis, referenzalterErreicht, vorBvgMindestalter }) => {
  const v = versicherungen || {};
  const { teile, offen, st } = netzSchildTeile(v, { employed, annualIncome, annualIncomeMit13, lohnBasis, referenzalterErreicht, vorBvgMindestalter });
  if (!st.touched || !teile.length) return null;
  const h = React.createElement;
  const n = teile.length;
  const breite = 360 / n;
  // Grundversicherung: dasselbe Salbei wie «gedeckt», halb so dicht — im hellen wie im dunklen Modus klar
  // als «weniger» lesbar (im Browser verglichen 27.10.2026; ein eigenes helles Grün verschwand dunkel fast).
  const salbei = palette.sageDeep || palette.sage;
  const farbe = [palette.sand, salbei, salbei];
  const deckung = [0.5, 0.5, 0.9];
  const stand = (p) => p.stufe === 0 ? t('netzSchild.offen') : p.stufe === 1 ? t('netzSchild.grund') : p.zweiStufen ? t('netzSchild.zusatz') : t('netzSchild.gedeckt');
  const aria = t('netzSchild.aria') + ' ' + teile.map((p) => t('netzSchild.kurz.' + p.key) + ': ' + stand(p)).join('; ') + '.';

  const bild = h('svg', { viewBox: `0 0 ${B} ${H}`, width: '100%', role: 'img', 'aria-label': aria, style: { maxWidth: '300px', height: 'auto', display: 'block', margin: '0 auto' } },
    h('defs', null,
      h('clipPath', { id: 'ns-schild' }, h('path', { d: SCHILD })),
      teile.map((p, i) => h('clipPath', { key: p.key, id: 'ns-keil-' + p.key }, h('polygon', { points: keil(teilWinkel(i, n), breite) })))),
    h('g', { clipPath: 'url(#ns-schild)' },
      h('path', { d: SCHILD, fill: palette.up }),
      teile.map((p) => h('path', {
        key: p.key, 'data-teil': p.key, 'data-stufe': p.stufe, d: SCHILD, clipPath: 'url(#ns-keil-' + p.key + ')',
        transform: skaliert(SCHILD_STUFEN[p.stufe]), fill: farbe[p.stufe], fillOpacity: deckung[p.stufe],
      })),
      // Feine Linien in Schildform zwischen den Stufen, durch alle Teile.
      SCHILD_STUFEN.slice(0, 2).map((s) => h('path', { key: s, d: SCHILD, fill: 'none', stroke: palette.mid, strokeOpacity: 0.35, strokeWidth: 1, vectorEffect: 'non-scaling-stroke', transform: skaliert(s) })),
      // Fugen zwischen den Teilen, in der Farbe des Grunds.
      teile.map((p, i) => {
        const [x, y] = punkt(teilWinkel(i, n) + breite / 2, 420);
        return h('line', { key: p.key, x1: CX, y1: CY, x2: x, y2: y, stroke: palette.surface, strokeWidth: 5, strokeLinecap: 'round' });
      }),
      h('circle', { cx: CX, cy: CY, r: 6, fill: palette.surface })),
    h('path', { d: SCHILD, fill: 'none', stroke: palette.border, strokeWidth: 1.5 }),
    // Namen im Teil; auf vollem Salbei hell, sonst dunkel (wie im Schutzschild, a11y Abnahme F6).
    teile.map((p, i) => {
      const g = teilWinkel(i, n);
      const [x, y] = punkt(g, Math.abs(g - 90) < 1 ? 118 : 96);
      return h('text', { key: p.key, 'aria-hidden': true, x, y, textAnchor: 'middle', dominantBaseline: 'central',
        style: { fontSize: '14px', fontWeight: weight.semi, fill: p.stufe === 2 ? palette.surface : palette.text } }, t('netzSchild.kurz.' + p.key));
    }));

  const zeile = (p) => h('div', { key: p.key, role: 'listitem', style: { display: 'flex', alignItems: 'baseline', gap: '6px', fontSize: text.xs, padding: '2px 0', color: p.stufe ? palette.text : palette.mid } },
    h('span', { 'aria-hidden': true, style: { color: p.stufe ? palette.sage : palette.mid, width: '14px', flexShrink: 0, textAlign: 'center' } }, hinweisZeichen(p.stufe ? 'check' : 'kaestchen', 12)),
    h('span', { style: { minWidth: 0 } }, t('schutzschild.' + p.key), ' ', h('span', { style: { color: palette.mid } }, '· ' + (p.pflicht ? t('netzSchild.pflicht') : t('netzSchild.freiwillig')))),
    h('span', { style: { marginLeft: 'auto', color: p.stufe ? (palette.sageDeep || palette.sage) : palette.mid, whiteSpace: 'nowrap' } }, stand(p)));

  return h('div', { 'data-schild': 'netz', style: { marginBottom: space.sm + 'px' } },
    h('p', { style: { fontSize: text.xs, color: palette.mid, margin: '0 0 ' + space.sm + 'px 0', lineHeight: leading.normal } }, t('netzSchild.intro')),
    bild,
    h('p', { 'data-teil': 'netz-schild-satz', style: { fontSize: text.sm, color: palette.text, textAlign: 'center', margin: space.sm + 'px 0' } },
      offen.length ? t('netzSchild.nochOffen', { liste: offen.map((k) => t('netzSchild.kurz.' + k)).join(', ') }) : t('netzSchild.ganz')),
    h('div', { role: 'list', style: { maxWidth: '360px', margin: '0 auto' } }, teile.map(zeile)),
    st.bvgUnklar && h('p', { style: { fontSize: text.xs, color: palette.mid, margin: space.sm + 'px 0 0', lineHeight: leading.normal } },
      hinweisZeichen(), t(st.bvgUnklarGrund === 'dreizehnter' ? 'schutzschild.bvgUnklar13' : 'schutzschild.bvgUnklar', { schwelle: zahl(st.bvgSchwelle, { hoechstens: 2 }) })),
    st.bvgNa && h('p', { 'data-teil': 'bvg-na', style: { fontSize: text.xs, color: palette.mid, margin: space.sm + 'px 0 0', lineHeight: leading.normal } },
      hinweisZeichen(), t('schutzschild.bvgNa', { schwelle: zahl(st.bvgSchwelle, { hoechstens: 2 }) })));
};

export default NetzSchild;
