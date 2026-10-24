import React from 'react';
import { text, space } from '../config/tokens.js';

// Spinnennetz: eine Achse je Bereich, oben beginnend im Uhrzeigersinn. Jede Achse trägt einen
// Anteil 0..1 — wie viel dort schon steht. Keine Bewertung, keine Punkte, kein Rot.
// Ein Tipp auf einen Achsennamen ruft onAchse(i) auf. Die Zahlen gehören immer auch als Text
// auf die Seite (das Bild ist nie die einzige Stelle) — das regelt die aufrufende Stelle.
//
// Zuerst am 24.10.2026 im Dashboard gebaut; dort verdoppelte es Berg und Prozente
// (Sophie: «der Ort ist falsch»). Seither allgemein und im Kapitel Versicherungen
// (components/VersicherungsNetz.jsx).

const BREITE = 360;
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

// Anteil auf 0..1 begrenzt; Unlesbares zählt als 0.
export const netzAnteil = (wert) => Math.min(1, Math.max(0, Number(wert) || 0));

const polygon = (n, a) => Array.from({ length: n }, (_, i) => netzPunkt(i, n, typeof a === 'function' ? a(i) : a).join(',')).join(' ');

// achsen: [{ key, kurz, aria, anteil (0..1), farbe? }]
export const Spinnennetz = ({ achsen, onAchse, ariaLabel, hinweis, leerText, palette }) => {
  const n = achsen.length;
  if (n < 3) return null; // ein Netz braucht mindestens drei Achsen
  const anteil = (i) => netzAnteil(achsen[i].anteil);
  const leer = achsen.every((_, i) => anteil(i) === 0);

  const waehle = (i) => (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    if (e.type === 'keydown') e.preventDefault();
    onAchse(i);
  };

  return React.createElement('div', { style: { marginBottom: space.md } },
    React.createElement('svg', {
      viewBox: `0 0 ${BREITE} ${HOEHE}`, role: 'group', 'aria-label': ariaLabel,
      // overflow sichtbar: sonst schneidet der Bildrand den Fokusrahmen eines Achsennamens ab.
      style: { width: '100%', maxWidth: BREITE + 'px', height: 'auto', display: 'block', margin: '0 auto', overflow: 'visible' },
    },
      // Raster: vier Ringe (25 / 50 / 75 / 100 %) und die Achsen
      React.createElement('g', { 'aria-hidden': 'true' },
        RINGE.map((r) => React.createElement('polygon', { key: 'r' + r, points: polygon(n, r), fill: 'none', stroke: palette.border, strokeWidth: r === 1 ? 1.2 : 0.8 })),
        achsen.map((a, i) => {
          const [x, y] = netzPunkt(i, n, 1);
          return React.createElement('line', { key: 'a' + a.key, x1: MX, y1: MY, x2: x, y2: y, stroke: palette.border, strokeWidth: 0.8 });
        })
      ),
      // Die Fläche: so weit ist jeder Bereich
      !leer && React.createElement('g', { 'aria-hidden': 'true' },
        React.createElement('polygon', { points: polygon(n, anteil), fill: palette.sage, fillOpacity: 0.22, stroke: palette.sageDeep || palette.sage, strokeWidth: 1.6, strokeLinejoin: 'round' }),
        achsen.map((a, i) => {
          const [x, y] = netzPunkt(i, n, anteil(i));
          return React.createElement('circle', { key: 'p' + a.key, cx: x, cy: y, r: 3.5, fill: anteil(i) >= 1 ? palette.sage : (a.farbe || palette.sage), stroke: palette.surface, strokeWidth: 1 });
        })
      ),
      // Achsennamen als Knöpfe
      achsen.map((a, i) => {
        const [x, y] = netzPunkt(i, n, 1.16);
        const cos = Math.cos((-90 + (360 / n) * i) * Math.PI / 180);
        const anker = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle';
        // Unsichtbare Tippfläche hinter dem Namen: die Schrift allein ist am Handy ~10 px hoch
        // (im Browser verfehlt, 24.10.2026). 30 Einheiten ≈ 25 px bei 300 px Breite (WCAG 2.5.8).
        const breite = String(a.kurz).length * 7 + 16;
        const links = anker === 'start' ? x - 6 : anker === 'end' ? x - breite + 6 : x - breite / 2;
        return React.createElement('g', {
          key: 't' + a.key, role: 'button', tabIndex: 0, 'aria-label': a.aria,
          onClick: waehle(i), onKeyDown: waehle(i), style: { cursor: 'pointer', outlineOffset: '2px' },
        },
          React.createElement('rect', { x: links, y: y - 15, width: breite, height: 30, fill: 'transparent' }),
          React.createElement('text', { x, y, dy: '0.35em', textAnchor: anker, fontSize: 12, fill: palette.text }, a.kurz)
        );
      })
    ),
    React.createElement('p', { style: { fontSize: text.xs, color: palette.mid, margin: '4px 0 0 0', textAlign: 'center' } },
      leer ? leerText : hinweis)
  );
};

export default Spinnennetz;
