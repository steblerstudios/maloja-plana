import React from 'react';
import { text, space } from '../config/tokens.js';

// Spinnennetz der Lebensbereiche in der Fortschritts-Karte (Sophie 24.10.2026: «Bau zuerst
// nur das Spinnennetz im Dashboard»). Eine Achse je Kapitel, oben beginnend im Uhrzeigersinn
// in der Reihenfolge der Kapitel. Der Wert ist dieselbe Zahl wie in der Kapitelzeile darunter
// (kapitelVollstaendigkeit: ausgefüllt oder «trifft nicht zu») — keine Bewertung, keine Punkte,
// kein Rot: es zeigt nur, wo schon etwas steht. Die Kapitelzeilen darunter sind die
// Textfassung mit den Prozenten; ein Tipp auf einen Achsennamen öffnet das Kapitel.
// Liegt in BergDetail, also im nachgeladenen Stück — das Hauptbündel (65-kB-Deckel) trägt es nicht.

const BREITE = 340;
const HOEHE = 250;
const MX = BREITE / 2;
const MY = 124;
const R = 82;
const RINGE = [0.25, 0.5, 0.75, 1];

// Punkt auf Achse i von n bei Anteil a (0..1). Achse 0 zeigt nach oben.
export const netzPunkt = (i, n, a) => {
  const w = (-90 + (360 / n) * i) * Math.PI / 180;
  return [MX + R * a * Math.cos(w), MY + R * a * Math.sin(w)];
};

// Anteil aus einer Prozentzahl, auf 0..1 begrenzt; Unlesbares zählt als 0.
export const netzAnteil = (pct) => Math.min(1, Math.max(0, (Number(pct) || 0) / 100));

const polygon = (n, a) => Array.from({ length: n }, (_, i) => netzPunkt(i, n, typeof a === 'function' ? a(i) : a).join(',')).join(' ');

export const LebensbereichNetz = ({ chapters, chapterCompletions, chapterAccentColor, onSelectChapter, palette, t }) => {
  const n = chapters.length;
  if (n < 3) return null; // ein Netz braucht mindestens drei Achsen
  const anteil = (i) => netzAnteil(chapterCompletions[i]);
  const leer = chapterCompletions.every((p) => !(Number(p) > 0));
  const kurz = (ch) => ch.short || String(ch.title || '').split(/[\s–—]/)[0];

  const waehle = (i) => (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    if (e.type === 'keydown') e.preventDefault();
    onSelectChapter(i);
  };

  return React.createElement('div', { style: { marginBottom: space.md } },
    React.createElement('svg', {
      viewBox: `0 0 ${BREITE} ${HOEHE}`, role: 'group', 'aria-label': t('fortschritt.netzAria'),
      style: { width: '100%', maxWidth: BREITE + 'px', height: 'auto', display: 'block', margin: '0 auto' },
    },
      // Raster: vier Ringe (25 / 50 / 75 / 100 %) und die Achsen
      React.createElement('g', { 'aria-hidden': 'true' },
        RINGE.map((r) => React.createElement('polygon', { key: 'r' + r, points: polygon(n, r), fill: 'none', stroke: palette.border, strokeWidth: r === 1 ? 1.2 : 0.8 })),
        chapters.map((ch, i) => {
          const [x, y] = netzPunkt(i, n, 1);
          return React.createElement('line', { key: 'a' + ch.key, x1: MX, y1: MY, x2: x, y2: y, stroke: palette.border, strokeWidth: 0.8 });
        })
      ),
      // Die Fläche: so weit ist jeder Bereich
      !leer && React.createElement('g', { 'aria-hidden': 'true' },
        React.createElement('polygon', { points: polygon(n, anteil), fill: palette.sage, fillOpacity: 0.22, stroke: palette.sageDeep || palette.sage, strokeWidth: 1.6, strokeLinejoin: 'round' }),
        chapters.map((ch, i) => {
          const [x, y] = netzPunkt(i, n, anteil(i));
          return React.createElement('circle', { key: 'p' + ch.key, cx: x, cy: y, r: 3.5, fill: anteil(i) >= 1 ? palette.sage : (chapterAccentColor[ch.key] || palette.sage), stroke: palette.surface, strokeWidth: 1 });
        })
      ),
      // Achsennamen als Knöpfe ins Kapitel
      chapters.map((ch, i) => {
        const [x, y] = netzPunkt(i, n, 1.16);
        const cos = Math.cos((-90 + (360 / n) * i) * Math.PI / 180);
        const anker = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle';
        const pct = Math.round(Number(chapterCompletions[i]) || 0);
        // Unsichtbare Tippfläche hinter dem Namen: die Schrift allein ist am Handy ~10 px hoch
        // (im Browser verfehlt, 24.10.2026). 30 Einheiten ≈ 26 px bei 293 px Breite (WCAG 2.5.8).
        const breite = kurz(ch).length * 7 + 16;
        const links = anker === 'start' ? x - 6 : anker === 'end' ? x - breite + 6 : x - breite / 2;
        return React.createElement('g', {
          key: 't' + ch.key, role: 'button', tabIndex: 0,
          'aria-label': ch.title + ', ' + pct + ' %',
          onClick: waehle(i), onKeyDown: waehle(i), style: { cursor: 'pointer', outlineOffset: '2px' },
        },
          React.createElement('rect', { x: links, y: y - 15, width: breite, height: 30, fill: 'transparent' }),
          React.createElement('text', { x, y, dy: '0.35em', textAnchor: anker, fontSize: 12, fill: palette.text }, kurz(ch))
        );
      })
    ),
    React.createElement('p', { style: { fontSize: text.xs, color: palette.mid, margin: '4px 0 0 0', textAlign: 'center' } },
      t(leer ? 'fortschritt.netzLeer' : 'fortschritt.netzHinweis'))
  );
};

export default LebensbereichNetz;
