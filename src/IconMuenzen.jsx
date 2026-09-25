import React from 'react';

// Die zwei Münz-Illustrationen der Kapitel «Finanzen» und «Behörden» — aus IconKern.jsx
// ausgelagert (25.09.2026), weil sie als reine Pfad-Daten 2,66 kB gzip im Startbündel
// kosteten. IconKern lädt diese Datei sofort beim Start nach und zeichnet bis dahin einen
// schlichten Münzkreis. Namen und Aufruf bleiben dort (`Icons.finanzen()`).

export const finanzen = () => React.createElement('svg', { viewBox: '0 0 48 48', fill: 'currentColor' },
  // === 5 FR COIN — Swiss Fünfliber, reverse side ===

  // Coin body
  React.createElement('circle', { cx: '24', cy: '24', r: '23' }),
  // Raised rim — stepped edge
  React.createElement('circle', { cx: '24', cy: '24', r: '22.2', fill: 'none', stroke: 'white', strokeWidth: '0.5', opacity: '0.25' }),
  React.createElement('circle', { cx: '24', cy: '24', r: '21.5', fill: 'none', stroke: 'white', strokeWidth: '0.3', opacity: '0.15' }),
  // Pearl border — fine bead ring
  React.createElement('circle', { cx: '24', cy: '24', r: '20.5', fill: 'none', stroke: 'white', strokeWidth: '0.8', strokeDasharray: '0.15 1.5', strokeLinecap: 'round', opacity: '0.9' }),

  // "5 FR." denomination — positioned between pearl border and shield
  React.createElement('text', { x: '24', y: '13', textAnchor: 'middle', fontSize: '6', fontWeight: 'bold', fill: 'white', style: { fontFamily: 'Georgia, serif' }, letterSpacing: '1' }, '5 FR.'),

  // === Heraldic shield — proportional, centred ===
  React.createElement('path', { d: 'M 19 15 L 29 15 L 29 23.5 Q 29 28 24 31 Q 19 28 19 23.5 Z', fill: 'white' }),
  // Shield inner border
  React.createElement('path', { d: 'M 20.2 16.2 L 27.8 16.2 L 27.8 23 Q 27.8 26.5 24 29 Q 20.2 26.5 20.2 23 Z', fill: 'none', stroke: 'currentColor', strokeWidth: '0.4', opacity: '0.25' }),
  // Swiss cross — proportional to smaller shield
  React.createElement('rect', { x: '22.8', y: '17.5', width: '2.4', height: '9', rx: '0.3', fill: 'currentColor' }),
  React.createElement('rect', { x: '20.5', y: '20.5', width: '7', height: '2.5', rx: '0.3', fill: 'currentColor' }),

  // === Left laurel branch ===
  // Stem — smooth curve, tip bends inward, bolder
  React.createElement('path', { d: 'M 23 38 Q 19 35 14.5 28 Q 10.5 22 9 14 Q 8.5 12 10 11', fill: 'none', stroke: 'white', strokeWidth: '0.75', strokeLinecap: 'round', opacity: '0.85' }),
  // Leaves as path shapes — each leaf grows FROM the stem, within coin rim
  // Pair A (tip) — stem at (9.5, 12) — pulled inward to stay inside pearl border
  React.createElement('path', { d: 'M 9.5 12 Q 8 10.5 7.5 10.5 Q 7.5 12.5 9.5 12 Z', fill: 'white', opacity: '0.7' }),
  React.createElement('path', { d: 'M 9.5 12 Q 11 10.5 12 10 Q 11.5 12.2 9.5 12 Z', fill: 'white', opacity: '0.7' }),
  // Pair B — stem at (9, 14.5) — pulled inward
  React.createElement('path', { d: 'M 9 14.5 Q 6.8 13 5.5 13 Q 6.5 15.2 9 14.5 Z', fill: 'white', opacity: '0.8' }),
  React.createElement('path', { d: 'M 9 14.5 Q 11 12.5 12.5 12.2 Q 11 14.8 9 14.5 Z', fill: 'white', opacity: '0.8' }),
  // Pair C — stem at (9.3, 17.5) — outer leaf pulled in
  React.createElement('path', { d: 'M 9.3 17.5 Q 7 15.8 5.8 16 Q 7.2 18.2 9.3 17.5 Z', fill: 'white', opacity: '0.85' }),
  React.createElement('path', { d: 'M 9.3 17.5 Q 11.5 15.2 13 15.2 Q 11.2 17.5 9.3 17.5 Z', fill: 'white', opacity: '0.85' }),
  // Pair D — stem at (10, 20.5)
  React.createElement('path', { d: 'M 10 20.5 Q 7 18.5 5.5 18.8 Q 7.5 21 10 20.5 Z', fill: 'white', opacity: '0.85' }),
  React.createElement('path', { d: 'M 10 20.5 Q 12.5 18 14.2 18 Q 12.2 20.5 10 20.5 Z', fill: 'white', opacity: '0.85' }),
  // Pair E — stem at (11.5, 24)
  React.createElement('path', { d: 'M 11.5 24 Q 8.5 21.8 6.5 22.2 Q 9 24.5 11.5 24 Z', fill: 'white', opacity: '0.85' }),
  React.createElement('path', { d: 'M 11.5 24 Q 14 21.5 16 21.5 Q 13.8 24 11.5 24 Z', fill: 'white', opacity: '0.85' }),
  // Pair F — stem at (13.5, 27.5)
  React.createElement('path', { d: 'M 13.5 27.5 Q 10.5 25.5 8.5 26 Q 11 28 13.5 27.5 Z', fill: 'white', opacity: '0.85' }),
  React.createElement('path', { d: 'M 13.5 27.5 Q 16 25 18 25.2 Q 15.8 27.5 13.5 27.5 Z', fill: 'white', opacity: '0.85' }),
  // Pair G — stem at (16, 31)
  React.createElement('path', { d: 'M 16 31 Q 13 29 11 29.2 Q 13.5 31.5 16 31 Z', fill: 'white', opacity: '0.8' }),
  React.createElement('path', { d: 'M 16 31 Q 18.5 28.5 20.5 28.8 Q 18.2 31 16 31 Z', fill: 'white', opacity: '0.8' }),
  // Pair H (base) — stem at (19, 34.5)
  React.createElement('path', { d: 'M 19 34.5 Q 16 32.5 14.5 33 Q 16.8 35 19 34.5 Z', fill: 'white', opacity: '0.75' }),
  React.createElement('path', { d: 'M 19 34.5 Q 21.2 32.5 22.5 32.8 Q 20.8 34.5 19 34.5 Z', fill: 'white', opacity: '0.75' }),
  // Left berries (at stem between leaf pairs) — larger, clustered in triplets
  React.createElement('circle', { cx: '9.2', cy: '13.2', r: '0.7', fill: 'white', opacity: '0.55' }),
  React.createElement('circle', { cx: '8.5', cy: '13.8', r: '0.55', fill: 'white', opacity: '0.45' }),
  React.createElement('circle', { cx: '9', cy: '16', r: '0.75', fill: 'white', opacity: '0.6' }),
  React.createElement('circle', { cx: '8.2', cy: '16.6', r: '0.6', fill: 'white', opacity: '0.5' }),
  React.createElement('circle', { cx: '9.6', cy: '16.6', r: '0.55', fill: 'white', opacity: '0.45' }),
  React.createElement('circle', { cx: '9.5', cy: '19', r: '0.75', fill: 'white', opacity: '0.6' }),
  React.createElement('circle', { cx: '8.7', cy: '19.6', r: '0.6', fill: 'white', opacity: '0.5' }),
  React.createElement('circle', { cx: '10.3', cy: '19.5', r: '0.55', fill: 'white', opacity: '0.45' }),
  React.createElement('circle', { cx: '10.5', cy: '22', r: '0.75', fill: 'white', opacity: '0.6' }),
  React.createElement('circle', { cx: '9.7', cy: '22.6', r: '0.6', fill: 'white', opacity: '0.5' }),
  React.createElement('circle', { cx: '12.5', cy: '25.8', r: '0.7', fill: 'white', opacity: '0.55' }),
  React.createElement('circle', { cx: '11.8', cy: '26.3', r: '0.55', fill: 'white', opacity: '0.45' }),
  React.createElement('circle', { cx: '14.5', cy: '29.2', r: '0.65', fill: 'white', opacity: '0.5' }),
  React.createElement('circle', { cx: '17', cy: '32.8', r: '0.55', fill: 'white', opacity: '0.45' }),

  // === Right laurel branch (mirrored) ===
  React.createElement('path', { d: 'M 25 38 Q 29 35 33.5 28 Q 37.5 22 39 14 Q 39.5 12 38 11', fill: 'none', stroke: 'white', strokeWidth: '0.75', strokeLinecap: 'round', opacity: '0.85' }),
  // Pair A' (tip) — pulled inward to stay inside pearl border
  React.createElement('path', { d: 'M 38.5 12 Q 40 10.5 40.5 10.5 Q 40.5 12.5 38.5 12 Z', fill: 'white', opacity: '0.7' }),
  React.createElement('path', { d: 'M 38.5 12 Q 37 10.5 36 10 Q 36.5 12.2 38.5 12 Z', fill: 'white', opacity: '0.7' }),
  // Pair B' — pulled inward
  React.createElement('path', { d: 'M 39 14.5 Q 41.2 13 42.5 13 Q 41.5 15.2 39 14.5 Z', fill: 'white', opacity: '0.8' }),
  React.createElement('path', { d: 'M 39 14.5 Q 37 12.5 35.5 12.2 Q 37 14.8 39 14.5 Z', fill: 'white', opacity: '0.8' }),
  // Pair C' — outer leaf pulled in
  React.createElement('path', { d: 'M 38.7 17.5 Q 41 15.8 42.2 16 Q 40.8 18.2 38.7 17.5 Z', fill: 'white', opacity: '0.85' }),
  React.createElement('path', { d: 'M 38.7 17.5 Q 36.5 15.2 35 15.2 Q 36.8 17.5 38.7 17.5 Z', fill: 'white', opacity: '0.85' }),
  // Pair D'
  React.createElement('path', { d: 'M 38 20.5 Q 41 18.5 42.5 18.8 Q 40.5 21 38 20.5 Z', fill: 'white', opacity: '0.85' }),
  React.createElement('path', { d: 'M 38 20.5 Q 35.5 18 33.8 18 Q 35.8 20.5 38 20.5 Z', fill: 'white', opacity: '0.85' }),
  // Pair E'
  React.createElement('path', { d: 'M 36.5 24 Q 39.5 21.8 41.5 22.2 Q 39 24.5 36.5 24 Z', fill: 'white', opacity: '0.85' }),
  React.createElement('path', { d: 'M 36.5 24 Q 34 21.5 32 21.5 Q 34.2 24 36.5 24 Z', fill: 'white', opacity: '0.85' }),
  // Pair F'
  React.createElement('path', { d: 'M 34.5 27.5 Q 37.5 25.5 39.5 26 Q 37 28 34.5 27.5 Z', fill: 'white', opacity: '0.85' }),
  React.createElement('path', { d: 'M 34.5 27.5 Q 32 25 30 25.2 Q 32.2 27.5 34.5 27.5 Z', fill: 'white', opacity: '0.85' }),
  // Pair G'
  React.createElement('path', { d: 'M 32 31 Q 35 29 37 29.2 Q 34.5 31.5 32 31 Z', fill: 'white', opacity: '0.8' }),
  React.createElement('path', { d: 'M 32 31 Q 29.5 28.5 27.5 28.8 Q 29.8 31 32 31 Z', fill: 'white', opacity: '0.8' }),
  // Pair H' (base)
  React.createElement('path', { d: 'M 29 34.5 Q 32 32.5 33.5 33 Q 31.2 35 29 34.5 Z', fill: 'white', opacity: '0.75' }),
  React.createElement('path', { d: 'M 29 34.5 Q 26.8 32.5 25.5 32.8 Q 27.2 34.5 29 34.5 Z', fill: 'white', opacity: '0.75' }),
  // Right berries — larger, clustered in triplets (mirrored)
  React.createElement('circle', { cx: '38.8', cy: '13.2', r: '0.7', fill: 'white', opacity: '0.55' }),
  React.createElement('circle', { cx: '39.5', cy: '13.8', r: '0.55', fill: 'white', opacity: '0.45' }),
  React.createElement('circle', { cx: '39', cy: '16', r: '0.75', fill: 'white', opacity: '0.6' }),
  React.createElement('circle', { cx: '39.8', cy: '16.6', r: '0.6', fill: 'white', opacity: '0.5' }),
  React.createElement('circle', { cx: '38.4', cy: '16.6', r: '0.55', fill: 'white', opacity: '0.45' }),
  React.createElement('circle', { cx: '38.5', cy: '19', r: '0.75', fill: 'white', opacity: '0.6' }),
  React.createElement('circle', { cx: '39.3', cy: '19.6', r: '0.6', fill: 'white', opacity: '0.5' }),
  React.createElement('circle', { cx: '37.7', cy: '19.5', r: '0.55', fill: 'white', opacity: '0.45' }),
  React.createElement('circle', { cx: '37.5', cy: '22', r: '0.75', fill: 'white', opacity: '0.6' }),
  React.createElement('circle', { cx: '38.3', cy: '22.6', r: '0.6', fill: 'white', opacity: '0.5' }),
  React.createElement('circle', { cx: '35.5', cy: '25.8', r: '0.7', fill: 'white', opacity: '0.55' }),
  React.createElement('circle', { cx: '36.2', cy: '26.3', r: '0.55', fill: 'white', opacity: '0.45' }),
  React.createElement('circle', { cx: '33.5', cy: '29.2', r: '0.65', fill: 'white', opacity: '0.5' }),
  React.createElement('circle', { cx: '31', cy: '32.8', r: '0.55', fill: 'white', opacity: '0.45' }),

  // === Bottom ribbon — bold bow knot ===
  // Central knot — diamond shape
  React.createElement('path', { d: 'M 22 38.5 L 24 37 L 26 38.5 L 24 40 Z', fill: 'white', opacity: '0.8' }),
  // Left ribbon tail — bold, flowing S-curve
  React.createElement('path', { d: 'M 22 38.5 Q 19.5 39.5 17.5 38 Q 16 37 16.5 35.5', fill: 'none', stroke: 'white', strokeWidth: '0.9', strokeLinecap: 'round', opacity: '0.7' }),
  React.createElement('path', { d: 'M 22 39.2 Q 19.5 40.5 17.8 39 Q 16.5 38 17 36.5', fill: 'none', stroke: 'white', strokeWidth: '0.5', strokeLinecap: 'round', opacity: '0.45' }),
  // Right ribbon tail
  React.createElement('path', { d: 'M 26 38.5 Q 28.5 39.5 30.5 38 Q 32 37 31.5 35.5', fill: 'none', stroke: 'white', strokeWidth: '0.9', strokeLinecap: 'round', opacity: '0.7' }),
  React.createElement('path', { d: 'M 26 39.2 Q 28.5 40.5 30.2 39 Q 31.5 38 31 36.5', fill: 'none', stroke: 'white', strokeWidth: '0.5', strokeLinecap: 'round', opacity: '0.45' }),

  // Year
  React.createElement('text', { x: '24', y: '43.5', textAnchor: 'middle', fontSize: '4.2', fill: 'white', style: { fontFamily: 'Georgia, serif' }, letterSpacing: '0.8' }, '2026'),
  // Flanking dots
  React.createElement('circle', { cx: '16', cy: '42.5', r: '0.45', fill: 'white', opacity: '0.35' }),
  React.createElement('circle', { cx: '32', cy: '42.5', r: '0.45', fill: 'white', opacity: '0.35' }),
);

export const behoerden = () => React.createElement('svg', { viewBox: '0 0 48 48', fill: 'currentColor' },
  // === HELVETIA — Classical allegorical female figure ===
  // Reference: official Swiss Helvetia — crown, spear, shield, toga, long elegant neck

  // Spear — tall vertical, thin shaft
  React.createElement('line', { x1: '12', y1: '1', x2: '14', y2: '42', stroke: 'currentColor', strokeWidth: '0.7', strokeLinecap: 'round' }),
  // Spear blade
  React.createElement('path', { d: 'M 12 1 Q 10.5 3.5 11.3 6 L 12 3.5 L 12.7 6 Q 13.5 3.5 12 1 Z', fill: 'currentColor' }),

  // === Head — smaller, positioned higher for long neck ===
  React.createElement('ellipse', { cx: '22', cy: '7', rx: '3', ry: '3.2', fill: 'currentColor' }),
  // Face profile — smooth classical female silhouette, chin ends at y~9.6
  React.createElement('path', { d: 'M 19.5 4.2 Q 19 5 18.8 6 Q 18.3 6.8 18 7.5 Q 17.8 8 18.2 8.6 Q 18.5 9.2 19.2 9.6 L 20 9.8', fill: 'currentColor' }),
  // Eye — almond shape
  React.createElement('path', { d: 'M 19.2 6.3 Q 19.7 6 20.3 6.3 Q 19.7 6.6 19.2 6.3 Z', fill: 'white', opacity: '0.25' }),
  // Nostril hint
  React.createElement('circle', { cx: '18.3', cy: '7.8', r: '0.15', fill: 'white', opacity: '0.1' }),
  // Lips — gentle curve
  React.createElement('path', { d: 'M 18.3 8.5 Q 18.6 8.3 18.9 8.5', fill: 'none', stroke: 'white', strokeWidth: '0.15', opacity: '0.12' }),

  // Hair — swept back into elegant chignon
  React.createElement('path', { d: 'M 19.5 4.2 Q 21 3.2 23.5 3.8 Q 25 4.2 25 5.5 Q 25.5 6.5 25 8', fill: 'currentColor' }),
  // Chignon bun
  React.createElement('ellipse', { cx: '25.2', cy: '6', rx: '1.8', ry: '1.6', fill: 'currentColor' }),
  React.createElement('path', { d: 'M 24 5.5 Q 25 5 26 5.5 Q 26 6.5 25 7', fill: 'none', stroke: 'white', strokeWidth: '0.2', opacity: '0.15' }),

  // Crown (Strahlenkrone) — 7 rays from diadem
  React.createElement('line', { x1: '18.5', y1: '4.2', x2: '17.5', y2: '2.5', stroke: 'currentColor', strokeWidth: '0.6', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '19.5', y1: '3.8', x2: '18.8', y2: '1.5', stroke: 'currentColor', strokeWidth: '0.65', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '20.5', y1: '3.5', x2: '20.2', y2: '0.8', stroke: 'currentColor', strokeWidth: '0.6', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '21.5', y1: '3.3', x2: '21.5', y2: '0.3', stroke: 'currentColor', strokeWidth: '0.7', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '22.5', y1: '3.5', x2: '23', y2: '0.8', stroke: 'currentColor', strokeWidth: '0.6', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '23.5', y1: '3.8', x2: '24.2', y2: '1.5', stroke: 'currentColor', strokeWidth: '0.65', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '24.5', y1: '4.2', x2: '25.5', y2: '2.5', stroke: 'currentColor', strokeWidth: '0.6', strokeLinecap: 'round' }),
  // Diadem band
  React.createElement('path', { d: 'M 18 4.8 Q 21.5 3 25 4.5', fill: 'none', stroke: 'currentColor', strokeWidth: '1' }),

  // === HALS — Bundesdesign Helvetia, schlanke Profilsäule ===
  // Referenz: SNB-Noten, Schweizer Briefmarken, offizielle Prägungen
  // Vorderseite (Kehle): leichte S-Kurve, Rückseite (Nacken): sanft gerade
  // Breite oben: 2.3 Einheiten (schmal wie Profilhals), unten: leicht breiter
  React.createElement('path', { d: 'M 19.5 9.8 C 19.2 11.0 19.3 12.5 19.6 14.0 Q 19.9 15.0 20.5 15.2 L 22.0 15.0 C 22.3 14.0 22.2 11.5 21.8 9.8 Q 21.0 9.4 19.5 9.8 Z', fill: 'currentColor' }),
  // Togakragen-Bogen am Halsansatz (charakteristisches Bundesdesign-Detail)
  React.createElement('path', { d: 'M 19.0 15.0 Q 20.8 15.8 22.5 15.0', fill: 'none', stroke: 'currentColor', strokeWidth: '0.6', opacity: '0.22' }),
  // Feine Halskette (Schweizer Briefmarken-Detail)
  React.createElement('path', { d: 'M 19.8 11.5 Q 20.8 11.8 21.8 11.5', fill: 'none', stroke: 'white', strokeWidth: '0.18', opacity: '0.18' }),

  // === Body — feminine silhouette, toga drape ===
  // Shoulders → bust → waist → flowing skirt
  React.createElement('path', { d: 'M 16.5 15 Q 19.5 14.5 22.5 15 Q 25.5 15.5 26.5 17.5 Q 26.5 19 25.5 20 Q 24.5 21.5 24 23 Q 23 24 23.5 26 Q 24.5 29 25.5 32 Q 27 36 28.5 39.5 L 30 42 L 10.5 42 L 12 39.5 Q 13.5 36 14.5 32 Q 15.5 29 16 26 Q 16.5 24 16 23 Q 15.5 21.5 14.8 20 Q 14 19 14 17.5 Q 14 15.5 16.5 15 Z', fill: 'currentColor' }),

  // Toga drape — one-shoulder style, from right shoulder across chest to left hip
  // Main drape fold (the key visual)
  React.createElement('path', { d: 'M 24 15.5 Q 22 17 20 19 Q 18 22 17 25 Q 16 28 15 32 Q 14 36 12 42', fill: 'none', stroke: 'white', strokeWidth: '0.6', opacity: '0.3' }),
  React.createElement('path', { d: 'M 25 16 Q 23 18 21 20 Q 19 23 18 26 Q 17 29 16 33 Q 15 37 13.5 42', fill: 'none', stroke: 'white', strokeWidth: '0.25', opacity: '0.15' }),
  // Bare left shoulder hint (toga doesn't cover left shoulder)
  React.createElement('path', { d: 'M 16.5 15 Q 15.5 15.5 15 16', fill: 'none', stroke: 'white', strokeWidth: '0.2', opacity: '0.15' }),
  // Bust contour
  React.createElement('path', { d: 'M 16.5 17 Q 18.5 18.5 20.5 18', fill: 'none', stroke: 'white', strokeWidth: '0.25', opacity: '0.2' }),

  // Waist belt
  React.createElement('path', { d: 'M 15.5 23 Q 20 24 24.5 23', fill: 'none', stroke: 'white', strokeWidth: '0.7', opacity: '0.35' }),
  React.createElement('rect', { x: '19.2', y: '22.6', width: '1.5', height: '1', rx: '0.2', fill: 'white', opacity: '0.25' }),

  // Skirt drapery — vertical folds fanning out
  React.createElement('path', { d: 'M 16.5 26 Q 15 31 13.5 36 Q 12.5 39 11.5 42', fill: 'none', stroke: 'white', strokeWidth: '0.25', opacity: '0.18' }),
  React.createElement('path', { d: 'M 19 25.5 Q 18 31 17 36 Q 16.5 39 15.5 42', fill: 'none', stroke: 'white', strokeWidth: '0.25', opacity: '0.18' }),
  React.createElement('path', { d: 'M 21 25.5 Q 20.5 31 20 36 Q 19.5 39 19.5 42', fill: 'none', stroke: 'white', strokeWidth: '0.25', opacity: '0.18' }),
  React.createElement('path', { d: 'M 23 26 Q 23 31 23 36 Q 23 39 23.5 42', fill: 'none', stroke: 'white', strokeWidth: '0.25', opacity: '0.18' }),
  React.createElement('path', { d: 'M 25.5 27 Q 26 32 26.5 37 Q 27 39 27.5 42', fill: 'none', stroke: 'white', strokeWidth: '0.25', opacity: '0.15' }),
  // Hem line
  React.createElement('path', { d: 'M 11.5 41.5 Q 20 42.5 29 41.5', fill: 'none', stroke: 'white', strokeWidth: '0.2', opacity: '0.12' }),

  // Left arm — from shoulder to spear
  React.createElement('path', { d: 'M 16 16 Q 15 18 14.5 20 Q 14 22 13.5 23.5', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' }),
  // Left fist gripping spear
  React.createElement('ellipse', { cx: '13.5', cy: '24', rx: '1.1', ry: '1.3', fill: 'currentColor' }),

  // Right arm — from shoulder, elegant curve down to shield
  React.createElement('path', { d: 'M 24 16 Q 26.5 17.5 28.5 20 Q 31 23 33 26', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' }),
  // Shoulder cap
  React.createElement('path', { d: 'M 23.5 15.2 Q 25 15 25.8 16 Q 26 17 25 17 Q 24 16 23.5 15.5 Z', fill: 'currentColor' }),
  // Right hand on shield
  React.createElement('ellipse', { cx: '33.2', cy: '26.5', rx: '1.1', ry: '0.8', fill: 'currentColor' }),

  // === Swiss shield ===
  React.createElement('path', { d: 'M 31 27 L 39 27 L 39 34 Q 39 38 35 40 Q 31 38 31 34 Z', fill: 'currentColor' }),
  React.createElement('path', { d: 'M 32 28.2 L 38 28.2 L 38 33.5 Q 38 36.5 35 38.5 Q 32 36.5 32 33.5 Z', fill: 'none', stroke: 'white', strokeWidth: '0.3', opacity: '0.25' }),
  // Swiss cross
  React.createElement('rect', { x: '34', y: '29', width: '2', height: '7', rx: '0.2', fill: 'white' }),
  React.createElement('rect', { x: '32.5', y: '31', width: '5', height: '2.5', rx: '0.2', fill: 'white' }),

  // Feet peeking from hem
  React.createElement('path', { d: 'M 15 41.5 Q 13.5 41.2 12 41.5 L 11.5 42.5 L 16 42.5 Z', fill: 'currentColor' }),
  React.createElement('path', { d: 'M 23.5 41.5 Q 25 41.2 26 41.5 L 26.5 42.5 L 23 42.5 Z', fill: 'currentColor' }),
  // Sandal straps
  React.createElement('path', { d: 'M 13 42 L 14.5 41.5', fill: 'none', stroke: 'white', strokeWidth: '0.2', opacity: '0.25' }),
  React.createElement('path', { d: 'M 24.5 42 L 25.5 41.5', fill: 'none', stroke: 'white', strokeWidth: '0.2', opacity: '0.25' }),

  // Pedestal
  React.createElement('rect', { x: '9', y: '42.5', width: '24', height: '0.8', rx: '0.2', fill: 'currentColor' }),
  React.createElement('rect', { x: '7', y: '43.3', width: '28', height: '1.2', rx: '0.2', fill: 'currentColor' }),
  // "HELVETIA" inscription
  React.createElement('text', { x: '21', y: '47.5', textAnchor: 'middle', fontSize: '3.2', fontWeight: 'bold', fill: 'currentColor', style: { fontFamily: 'Georgia, serif' }, letterSpacing: '1.5' }, 'HELVETIA'),
);
