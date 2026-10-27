import React from 'react';
import { netzSchildTeile, teilWinkel, fuellung, SCHILD_KERN } from '../data/netzSchild.js';
import { HAUSRAT_PFLICHT } from '../data/hausratPflicht.js';
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

export const NetzSchild = ({ palette, t, versicherungen, finanzen, kanton, stunden, employed, annualIncome, annualIncomeMit13, lohnBasis, referenzalterErreicht, vorBvgMindestalter }) => {
  const v = versicherungen || {};
  const { teile, offen, teilweise, st } = netzSchildTeile(v, { employed, annualIncome, annualIncomeMit13, lohnBasis, referenzalterErreicht, vorBvgMindestalter, finanzen, kanton });
  if (!st.touched || !teile.length) return null;
  const h = React.createElement;
  const n = teile.length;
  const breite = 360 / n;
  const iLeben = teile.findIndex((p) => p.key === 'leben');
  const winkel = (i) => teilWinkel(i, n, iLeben);
  // Teilweise: dasselbe Salbei wie «ganz», halb so dicht — im hellen wie im dunklen Modus klar als «weniger»
  // lesbar (im Browser verglichen 27.10.2026; ein eigenes helles Grün verschwand dunkel fast).
  const salbei = palette.sageDeep || palette.sage;
  const ganz = (p) => p.erreicht === p.n;
  const farbe = (p) => p.erreicht === 0 ? palette.sand : salbei;
  const dichte = (p) => p.erreicht === 0 ? 0.5 : ganz(p) ? 0.9 : 0.5;
  const kurz = (p) => t('netzSchild.kurz.' + p.key);
  const aria = t('netzSchild.aria') + ' ' + teile.map((p) => kurz(p) + ': ' + t('netzSchild.vonN', { n: p.erreicht, total: p.n })).join('; ') + '.';
  // Stufen-Linien je Teil: der Kern und jede Zwischenstufe, in Schildform, nur im eigenen Keil.
  const linien = (p) => [SCHILD_KERN, ...Array.from({ length: p.n - 1 }, (_, k) => fuellung({ erreicht: k + 1, n: p.n }))];

  const bild = h('svg', { viewBox: `0 0 ${B} ${H}`, width: '100%', role: 'img', 'aria-label': aria, style: { maxWidth: '300px', height: 'auto', display: 'block', margin: '0 auto' } },
    h('defs', null,
      h('clipPath', { id: 'ns-schild' }, h('path', { d: SCHILD })),
      teile.map((p, i) => h('clipPath', { key: p.key, id: 'ns-keil-' + p.key }, h('polygon', { points: keil(winkel(i), breite) })))),
    h('g', { clipPath: 'url(#ns-schild)' },
      h('path', { d: SCHILD, fill: palette.up }),
      teile.map((p) => h('g', { key: p.key, clipPath: 'url(#ns-keil-' + p.key + ')' },
        h('path', { 'data-teil': p.key, 'data-erreicht': p.erreicht + '/' + p.n, d: SCHILD, transform: skaliert(fuellung(p)), fill: farbe(p), fillOpacity: dichte(p) }),
        linien(p).map((s) => h('path', { key: s, d: SCHILD, fill: 'none', stroke: palette.mid, strokeOpacity: 0.35, strokeWidth: 1, vectorEffect: 'non-scaling-stroke', transform: skaliert(s) })))),
      // Fugen zwischen den Teilen, in der Farbe des Grunds.
      teile.map((p, i) => {
        const [x, y] = punkt(winkel(i) + breite / 2, 420);
        return h('line', { key: p.key, x1: CX, y1: CY, x2: x, y2: y, stroke: palette.surface, strokeWidth: 5, strokeLinecap: 'round' });
      }),
      h('circle', { cx: CX, cy: CY, r: 6, fill: palette.surface })),
    h('path', { d: SCHILD, fill: 'none', stroke: palette.border, strokeWidth: 1.5 }),
    // Namen im Teil; auf vollem Salbei hell, sonst dunkel (wie im Schutzschild, a11y Abnahme F6).
    teile.map((p, i) => {
      const g = (winkel(i) % 360 + 360) % 360;
      const [x, y] = punkt(g, Math.abs(g - 90) < 20 ? 118 : Math.abs(g - 270) < 1 ? 92 : 96);
      return h('text', { key: p.key, 'aria-hidden': true, x, y, textAnchor: 'middle', dominantBaseline: 'central',
        style: { fontSize: '14px', fontWeight: weight.semi, fill: ganz(p) ? palette.surface : palette.text } }, kurz(p));
    }));

  const artText = (x) => x.art === 'kantonPflicht' ? t('netzSchild.art.kantonPflicht', { kanton: String(kanton || '').toUpperCase() }) : t('netzSchild.art.' + x.art);
  const klein = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const versZeile = (x) => h('div', { key: x.key, role: 'listitem', style: { display: 'flex', alignItems: 'baseline', gap: '6px', fontSize: text.xs, padding: '1px 0 1px 4px', color: x.ok ? palette.text : palette.mid } },
    h('span', { 'aria-hidden': true, style: { color: x.ok ? palette.sage : palette.mid, width: '14px', flexShrink: 0, textAlign: 'center' } }, hinweisZeichen(x.ok ? 'check' : 'kaestchen', 12)),
    h('span', { style: { minWidth: 0 } }, t('netzSchild.vers.' + x.key), ' ', h('span', { style: { color: palette.mid } }, '· ' + artText(x))),
    h('span', { style: { marginLeft: 'auto', color: x.ok ? salbei : palette.mid, whiteSpace: 'nowrap' } }, x.ok ? t('netzSchild.gedeckt') : t('netzSchild.offen')));
  const teilBlock = (p) => h('div', { key: p.key, 'data-gruppe': p.key, style: { marginBottom: space.xs + 'px' } },
    h('div', { style: { display: 'flex', alignItems: 'baseline', fontSize: text.sm, fontWeight: weight.semi, color: palette.text } },
      kurz(p), h('span', { style: { marginLeft: 'auto', fontSize: text.xs, fontWeight: weight.normal, color: palette.mid } }, t('netzSchild.vonN', { n: p.erreicht, total: p.n }))),
    h('div', { role: 'list', 'aria-label': kurz(p) }, p.versicherungen.map(versZeile)),
    p.key === 'uvg' && Number(stunden) > 0 && Number(stunden) < 8 && h('p', { 'data-teil': 'unfall-8h', style: { ...klein, margin: '2px 0 0 24px' } }, hinweisZeichen(), t('netzSchild.unfall8h')),
    p.key === 'haushalt' && h('p', { style: { ...klein, margin: '2px 0 0 24px' } }, t('netzSchild.haftpflichtHinweis')),
    p.key === 'haushalt' && HAUSRAT_PFLICHT.verify && p.versicherungen.some((x) => x.art === 'kantonPflicht' || x.art === 'jeNachKanton') &&
      h('p', { 'data-teil': 'hausrat-pruefen', style: { ...klein, margin: '2px 0 0 24px' } }, hinweisZeichen(), t('netzSchild.hausratPruefen')));

  const satz = [
    offen.length && t('netzSchild.nochOffen', { liste: offen.map((k) => t('netzSchild.kurz.' + k)).join(', ') }),
    teilweise.length && t('netzSchild.teilweise', { liste: teilweise.map((k) => t('netzSchild.kurz.' + k)).join(', ') }),
  ].filter(Boolean).join(' ') || t('netzSchild.ganz');

  return h('div', { 'data-schild': 'netz', style: { marginBottom: space.sm + 'px' } },
    h('p', { style: { ...klein, margin: '0 0 ' + space.sm + 'px 0' } }, t('netzSchild.intro')),
    bild,
    h('p', { 'data-teil': 'netz-schild-satz', style: { fontSize: text.sm, color: palette.text, textAlign: 'center', margin: space.sm + 'px 0' } }, satz),
    h('div', { style: { maxWidth: '380px', margin: '0 auto' } }, teile.map(teilBlock)),
    st.bvgUnklar && h('p', { style: { ...klein, margin: space.sm + 'px 0 0' } },
      hinweisZeichen(), t(st.bvgUnklarGrund === 'dreizehnter' ? 'schutzschild.bvgUnklar13' : 'schutzschild.bvgUnklar', { schwelle: zahl(st.bvgSchwelle, { hoechstens: 2 }) })),
    st.bvgNa && h('p', { 'data-teil': 'bvg-na', style: { ...klein, margin: space.sm + 'px 0 0' } },
      hinweisZeichen(), t('schutzschild.bvgNa', { schwelle: zahl(st.bvgSchwelle, { hoechstens: 2 }) })));
};

export default NetzSchild;
