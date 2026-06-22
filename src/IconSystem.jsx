import React from 'react';

// ─── Maloja Plana SVG Pictogram System ──────────────────────
//
// Design Rules:
//   viewBox:      Always "0 0 24 24" — consistent coordinate space
//   Default size: 24x24 for chapter icons, 20x20 for feature icons
//   Stroke width: 1.8px for outlined paths
//   Corner radius: 2px minimum on rectangles (rx="2")
//   Fill strategy: "currentColor" — inherits from parent, works in both themes
//   Naming:       Lowercase camelCase, domain-specific (not generic)
//   Aria:         All icons are decorative — use the <Icon> component which
//                 adds aria-hidden="true" and focusable="false" automatically
//
// Categories:
//   Chapter icons  — 7 life chapters (basis, wohnen, etc.)
//   Feature icons  — app tools and actions (upload, download, etc.)
//   Semantic icons — domain-specific pictograms (dentist, doctor, etc.)
//   Status icons   — success, error, warning, check
//
// Adding new icons:
//   1. Add factory function to the appropriate section below
//   2. Use "currentColor" for fills/strokes, "white" only for inner details
//   3. Keep paths simple — aim for < 3 elements per icon
//   4. Test in both light and dark palette


// ═══════════════════════════════════════════════════════════════
// Chapter Icons (24x24 default)
// ═══════════════════════════════════════════════════════════════

const _basis = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // ID card outline — rounded rectangle framing the person
  React.createElement('rect', { x: '2', y: '3', width: '20', height: '18', rx: '2.5', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5' }),
  // Person silhouette — centered in card
  React.createElement('circle', { cx: '9', cy: '10', r: '3' }),
  React.createElement('path', { d: 'M 4.5 18 Q 4.5 14 9 14 Q 13.5 14 13.5 18' }),
  // Data lines on right side
  React.createElement('line', { x1: '15.5', y1: '9', x2: '19.5', y2: '9', stroke: 'currentColor', strokeWidth: '1.2', strokeLinecap: 'round', opacity: '0.5' }),
  React.createElement('line', { x1: '15.5', y1: '12', x2: '18.5', y2: '12', stroke: 'currentColor', strokeWidth: '1.2', strokeLinecap: 'round', opacity: '0.4' }),
  React.createElement('line', { x1: '15.5', y1: '15', x2: '19', y2: '15', stroke: 'currentColor', strokeWidth: '1.2', strokeLinecap: 'round', opacity: '0.35' }),
);

const _wohnen = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Swiss chalet — wide overhanging roof
  React.createElement('path', { d: 'M 0.5 12 L 12 2.5 L 23.5 12 Z' }),
  // Roof underside shadow (eave depth)
  React.createElement('line', { x1: '1.5', y1: '11.8', x2: '22.5', y2: '11.8', stroke: 'white', strokeWidth: '0.2', opacity: '0.12' }),
  // Chimney with cap
  React.createElement('rect', { x: '17', y: '4.5', width: '2', height: '4.5' }),
  React.createElement('rect', { x: '16.5', y: '4', width: '3', height: '0.8', rx: '0.2' }),
  // Chimney smoke hint
  React.createElement('path', { d: 'M 18 4 Q 17.5 3 18.2 2.2', fill: 'none', stroke: 'currentColor', strokeWidth: '0.3', opacity: '0.4' }),
  // House body
  React.createElement('rect', { x: '4', y: '12', width: '16', height: '10' }),
  // Foundation/base
  React.createElement('rect', { x: '3.5', y: '21.5', width: '17', height: '0.7', rx: '0.1', fill: 'currentColor' }),
  // Horizontal wood siding lines (subtle)
  React.createElement('line', { x1: '4', y1: '14', x2: '20', y2: '14', stroke: 'white', strokeWidth: '0.2', opacity: '0.12' }),
  React.createElement('line', { x1: '4', y1: '16.5', x2: '20', y2: '16.5', stroke: 'white', strokeWidth: '0.2', opacity: '0.12' }),
  React.createElement('line', { x1: '4', y1: '19', x2: '20', y2: '19', stroke: 'white', strokeWidth: '0.2', opacity: '0.1' }),
  // Gable window — arched top for Swiss style
  React.createElement('rect', { x: '10', y: '7', width: '4', height: '3', rx: '0.3', fill: 'white' }),
  React.createElement('path', { d: 'M 10 7.3 Q 12 5.8 14 7.3', fill: 'white' }),
  // Gable window mullions
  React.createElement('line', { x1: '12', y1: '5.8', x2: '12', y2: '10', stroke: 'currentColor', strokeWidth: '0.4' }),
  React.createElement('line', { x1: '10', y1: '8', x2: '14', y2: '8', stroke: 'currentColor', strokeWidth: '0.4' }),
  // Decorative gable carving (Lüftlmalerei hint)
  React.createElement('path', { d: 'M 8 10.5 Q 10 11.2 12 10.5 Q 14 11.2 16 10.5', fill: 'none', stroke: 'white', strokeWidth: '0.25', opacity: '0.2' }),
  // Eave brackets (Büge) — small triangular supports
  React.createElement('path', { d: 'M 4 12 L 3 12 L 4 11', fill: 'none', stroke: 'currentColor', strokeWidth: '0.4' }),
  React.createElement('path', { d: 'M 20 12 L 21 12 L 20 11', fill: 'none', stroke: 'currentColor', strokeWidth: '0.4' }),
  // Balcony railing — key Swiss chalet feature
  React.createElement('line', { x1: '4', y1: '15.5', x2: '20', y2: '15.5', stroke: 'white', strokeWidth: '0.7' }),
  // Railing posts (4 posts for 3 even sections)
  React.createElement('line', { x1: '4.5', y1: '12.5', x2: '4.5', y2: '15.5', stroke: 'white', strokeWidth: '0.4' }),
  React.createElement('line', { x1: '9.3', y1: '12.5', x2: '9.3', y2: '15.5', stroke: 'white', strokeWidth: '0.4' }),
  React.createElement('line', { x1: '14.7', y1: '12.5', x2: '14.7', y2: '15.5', stroke: 'white', strokeWidth: '0.4' }),
  React.createElement('line', { x1: '19.5', y1: '12.5', x2: '19.5', y2: '15.5', stroke: 'white', strokeWidth: '0.4' }),
  // Decorative X-pattern railing (Berner Oberland) — 3 even sections
  React.createElement('path', { d: 'M 4.5 12.5 L 9.3 15.5 M 9.3 12.5 L 4.5 15.5', fill: 'none', stroke: 'white', strokeWidth: '0.3', opacity: '0.4' }),
  React.createElement('path', { d: 'M 9.3 12.5 L 14.7 15.5 M 14.7 12.5 L 9.3 15.5', fill: 'none', stroke: 'white', strokeWidth: '0.3', opacity: '0.4' }),
  React.createElement('path', { d: 'M 14.7 12.5 L 19.5 15.5 M 19.5 12.5 L 14.7 15.5', fill: 'none', stroke: 'white', strokeWidth: '0.3', opacity: '0.4' }),
  // Flower boxes under balcony (Geranien-Kästen)
  React.createElement('rect', { x: '5', y: '15.8', width: '4', height: '0.7', rx: '0.15', fill: 'white', opacity: '0.25' }),
  React.createElement('rect', { x: '15', y: '15.8', width: '4', height: '0.7', rx: '0.15', fill: 'white', opacity: '0.25' }),
  // Geranium flower bumps
  React.createElement('circle', { cx: '6', cy: '15.6', r: '0.35', fill: 'white', opacity: '0.18' }),
  React.createElement('circle', { cx: '7', cy: '15.5', r: '0.4', fill: 'white', opacity: '0.2' }),
  React.createElement('circle', { cx: '8', cy: '15.6', r: '0.35', fill: 'white', opacity: '0.18' }),
  React.createElement('circle', { cx: '16', cy: '15.6', r: '0.35', fill: 'white', opacity: '0.18' }),
  React.createElement('circle', { cx: '17', cy: '15.5', r: '0.4', fill: 'white', opacity: '0.2' }),
  React.createElement('circle', { cx: '18', cy: '15.6', r: '0.35', fill: 'white', opacity: '0.18' }),
  // Lower windows with shutters
  React.createElement('rect', { x: '5.2', y: '17.2', width: '1', height: '2.8', rx: '0.1', fill: 'white', opacity: '0.4' }),
  React.createElement('rect', { x: '6.4', y: '17.2', width: '3', height: '2.8', rx: '0.2', fill: 'white' }),
  React.createElement('rect', { x: '9.6', y: '17.2', width: '1', height: '2.8', rx: '0.1', fill: 'white', opacity: '0.4' }),
  React.createElement('rect', { x: '13.4', y: '17.2', width: '1', height: '2.8', rx: '0.1', fill: 'white', opacity: '0.4' }),
  React.createElement('rect', { x: '14.6', y: '17.2', width: '3', height: '2.8', rx: '0.2', fill: 'white' }),
  React.createElement('rect', { x: '17.8', y: '17.2', width: '1', height: '2.8', rx: '0.1', fill: 'white', opacity: '0.4' }),
  // Window cross-mullions
  React.createElement('line', { x1: '7.9', y1: '17.2', x2: '7.9', y2: '20', stroke: 'currentColor', strokeWidth: '0.3' }),
  React.createElement('line', { x1: '16.1', y1: '17.2', x2: '16.1', y2: '20', stroke: 'currentColor', strokeWidth: '0.3' }),
  React.createElement('line', { x1: '6.4', y1: '18.6', x2: '9.4', y2: '18.6', stroke: 'currentColor', strokeWidth: '0.2' }),
  React.createElement('line', { x1: '14.6', y1: '18.6', x2: '17.6', y2: '18.6', stroke: 'currentColor', strokeWidth: '0.2' }),
  // Window sills
  React.createElement('rect', { x: '6.2', y: '20', width: '3.6', height: '0.3', rx: '0.1', fill: 'white', opacity: '0.3' }),
  React.createElement('rect', { x: '14.4', y: '20', width: '3.6', height: '0.3', rx: '0.1', fill: 'white', opacity: '0.3' }),
  // Door — arched top, typical Swiss
  React.createElement('rect', { x: '10.5', y: '17.5', width: '3', height: '4.5', rx: '0.3', fill: 'white' }),
  React.createElement('path', { d: 'M 10.5 17.8 Q 12 16.5 13.5 17.8', fill: 'white' }),
  // Door panel detail
  React.createElement('line', { x1: '12', y1: '17', x2: '12', y2: '22', stroke: 'currentColor', strokeWidth: '0.2', opacity: '0.3' }),
  // Door knob
  React.createElement('circle', { cx: '12.8', cy: '20', r: '0.3', fill: 'currentColor' }),
  // Door step
  React.createElement('rect', { x: '10', y: '21.5', width: '4', height: '0.5', rx: '0.1', fill: 'white', opacity: '0.2' }),
);

const _finanzen = () => React.createElement('svg', { viewBox: '0 0 48 48', fill: 'currentColor' },
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

const _versicherungen = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Shield — Swiss protection shape
  React.createElement('path', { d: 'M 12 2 L 4 6 L 4 12 Q 4 19 12 22 Q 20 19 20 12 L 20 6 Z' }),
  // Inner shield border
  React.createElement('path', { d: 'M 12 4 L 6 7.2 L 6 12 Q 6 17.5 12 20 Q 18 17.5 18 12 L 18 7.2 Z', fill: 'none', stroke: 'white', strokeWidth: '0.5', opacity: '0.3' }),
  // Edelweiss — Alpine protection flower (8 petals + center)
  React.createElement('g', { transform: 'translate(12, 12.5)' },
    React.createElement('circle', { r: '1.5', fill: 'white' }),
    React.createElement('ellipse', { cx: '0', cy: '-4', rx: '1.2', ry: '2.5', fill: 'white', opacity: '0.9' }),
    React.createElement('ellipse', { cx: '0', cy: '4', rx: '1.2', ry: '2.5', fill: 'white', opacity: '0.9' }),
    React.createElement('ellipse', { cx: '-4', cy: '0', rx: '2.5', ry: '1.2', fill: 'white', opacity: '0.9' }),
    React.createElement('ellipse', { cx: '4', cy: '0', rx: '2.5', ry: '1.2', fill: 'white', opacity: '0.9' }),
    React.createElement('ellipse', { cx: '-2.8', cy: '-2.8', rx: '1.2', ry: '2.5', fill: 'white', opacity: '0.7', transform: 'rotate(-45)' }),
    React.createElement('ellipse', { cx: '2.8', cy: '-2.8', rx: '1.2', ry: '2.5', fill: 'white', opacity: '0.7', transform: 'rotate(45)' }),
    React.createElement('ellipse', { cx: '-2.8', cy: '2.8', rx: '1.2', ry: '2.5', fill: 'white', opacity: '0.7', transform: 'rotate(45)' }),
    React.createElement('ellipse', { cx: '2.8', cy: '2.8', rx: '1.2', ry: '2.5', fill: 'white', opacity: '0.7', transform: 'rotate(-45)' }),
  ),
);

const _ausbildung = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 2 10 L 12 5 L 22 10 L 12 15 Z' }),
  React.createElement('path', { d: 'M 6 12.5 L 6 18 L 12 21 L 18 18 L 18 12.5' }),
  React.createElement('line', { x1: '20', y1: '10', x2: '20', y2: '17', stroke: 'currentColor', strokeWidth: '1.5' })
);

const _behoerden = () => React.createElement('svg', { viewBox: '0 0 48 48', fill: 'currentColor' },
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

const _notfall = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Heart-shaped container — warm, precautionary, not alarming
  React.createElement('path', { d: 'M 12 21 Q 3 14 3 8.5 Q 3 4 7 4 Q 9.5 4 12 7 Q 14.5 4 17 4 Q 21 4 21 8.5 Q 21 14 12 21 Z' }),
  // Soft inner glow line
  React.createElement('path', { d: 'M 12 19 Q 5 13.5 5 9 Q 5 5.8 7.5 5.5 Q 9.5 5.5 12 8 Q 14.5 5.5 16.5 5.5 Q 19 5.8 19 9 Q 19 13.5 12 19 Z', fill: 'none', stroke: 'white', strokeWidth: '0.4', opacity: '0.25' }),
  // Medical cross — centered, proportional
  React.createElement('rect', { x: '10.5', y: '7.5', width: '3', height: '8', rx: '0.8', fill: 'white' }),
  React.createElement('rect', { x: '8', y: '10', width: '8', height: '3', rx: '0.8', fill: 'white' }),
);


// ═══════════════════════════════════════════════════════════════
// Chapter Icons — extended set (Verwaltung & Organisation)
// ═══════════════════════════════════════════════════════════════

const _dokumentTresor = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Safe body
  React.createElement('rect', { x: '3', y: '4', width: '18', height: '16', rx: '2' }),
  // Safe door outline
  React.createElement('rect', { x: '4.5', y: '5.5', width: '15', height: '13', rx: '1.5', fill: 'none', stroke: 'white', strokeWidth: '0.5', opacity: '0.4' }),
  // Circular dial
  React.createElement('circle', { cx: '12', cy: '12', r: '3.5', fill: 'none', stroke: 'white', strokeWidth: '1.2' }),
  React.createElement('circle', { cx: '12', cy: '12', r: '1', fill: 'white' }),
  // Dial marks
  React.createElement('line', { x1: '12', y1: '9', x2: '12', y2: '9.8', stroke: 'white', strokeWidth: '0.6' }),
  React.createElement('line', { x1: '12', y1: '14.2', x2: '12', y2: '15', stroke: 'white', strokeWidth: '0.6' }),
  React.createElement('line', { x1: '9', y1: '12', x2: '9.8', y2: '12', stroke: 'white', strokeWidth: '0.6' }),
  React.createElement('line', { x1: '14.2', y1: '12', x2: '15', y2: '12', stroke: 'white', strokeWidth: '0.6' }),
  // Handle bar
  React.createElement('rect', { x: '17', y: '10.5', width: '2.5', height: '3', rx: '0.8', fill: 'white' }),
  // Small document hint
  React.createElement('rect', { x: '18.5', y: '2.5', width: '4', height: '5', rx: '0.5', fill: 'currentColor', stroke: 'white', strokeWidth: '0.4', opacity: '0.7' }),
  React.createElement('line', { x1: '19.3', y1: '4', x2: '21.7', y2: '4', stroke: 'white', strokeWidth: '0.5', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '19.3', y1: '5.5', x2: '21', y2: '5.5', stroke: 'white', strokeWidth: '0.5', strokeLinecap: 'round' }),
);

const _kalenderUhr = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Bahnhofsuhr-inspired clock
  React.createElement('circle', { cx: '12', cy: '12', r: '10.5', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8' }),
  React.createElement('circle', { cx: '12', cy: '12', r: '9.2', fill: 'none', stroke: 'currentColor', strokeWidth: '0.4' }),
  // Hour markers
  React.createElement('line', { x1: '12', y1: '2.8', x2: '12', y2: '4.5', stroke: 'currentColor', strokeWidth: '1.3', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '12', y1: '19.5', x2: '12', y2: '21.2', stroke: 'currentColor', strokeWidth: '1.3', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '2.8', y1: '12', x2: '4.5', y2: '12', stroke: 'currentColor', strokeWidth: '1.3', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '19.5', y1: '12', x2: '21.2', y2: '12', stroke: 'currentColor', strokeWidth: '1.3', strokeLinecap: 'round' }),
  // Minor markers
  React.createElement('line', { x1: '16.6', y1: '3.8', x2: '16', y2: '5', stroke: 'currentColor', strokeWidth: '0.8', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '20.2', y1: '7.4', x2: '19', y2: '8', stroke: 'currentColor', strokeWidth: '0.8', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '20.2', y1: '16.6', x2: '19', y2: '16', stroke: 'currentColor', strokeWidth: '0.8', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '16.6', y1: '20.2', x2: '16', y2: '19', stroke: 'currentColor', strokeWidth: '0.8', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '7.4', y1: '20.2', x2: '8', y2: '19', stroke: 'currentColor', strokeWidth: '0.8', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '3.8', y1: '16.6', x2: '5', y2: '16', stroke: 'currentColor', strokeWidth: '0.8', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '3.8', y1: '7.4', x2: '5', y2: '8', stroke: 'currentColor', strokeWidth: '0.8', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '7.4', y1: '3.8', x2: '8', y2: '5', stroke: 'currentColor', strokeWidth: '0.8', strokeLinecap: 'round' }),
  // Hour hand (10:10 position)
  React.createElement('line', { x1: '12', y1: '12', x2: '9.5', y2: '7', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round' }),
  // Minute hand
  React.createElement('line', { x1: '12', y1: '12', x2: '15.5', y2: '6.5', stroke: 'currentColor', strokeWidth: '1', strokeLinecap: 'round' }),
  // Red second hand with Mondaine dot
  React.createElement('line', { x1: '12', y1: '11', x2: '12', y2: '17', stroke: '#D84A3A', strokeWidth: '0.6', strokeLinecap: 'round' }),
  React.createElement('circle', { cx: '12', cy: '17', r: '1', fill: '#D84A3A' }),
  // Center cap
  React.createElement('circle', { cx: '12', cy: '12', r: '1.2' }),
);

const _budgetWallet = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Wallet body
  React.createElement('rect', { x: '2', y: '7', width: '20', height: '14', rx: '2.5' }),
  // Wallet flap
  React.createElement('path', { d: 'M 2 10 L 2 6 Q 2 4 4 4 L 18 4 Q 20 4 20 6 L 20 10', fill: 'currentColor' }),
  React.createElement('line', { x1: '2', y1: '10', x2: '22', y2: '10', stroke: 'white', strokeWidth: '0.4', opacity: '0.3' }),
  // Clasp
  React.createElement('rect', { x: '10', y: '9', width: '4', height: '2', rx: '0.8', fill: 'white', opacity: '0.4' }),
  // Budget lines on wallet
  React.createElement('line', { x1: '5', y1: '14', x2: '13', y2: '14', stroke: 'white', strokeWidth: '1', strokeLinecap: 'round', opacity: '0.5' }),
  React.createElement('line', { x1: '5', y1: '17', x2: '11', y2: '17', stroke: 'white', strokeWidth: '1', strokeLinecap: 'round', opacity: '0.4' }),
  // Coin
  React.createElement('circle', { cx: '18.5', cy: '5', r: '3', fill: 'currentColor', stroke: 'white', strokeWidth: '0.6' }),
  React.createElement('text', { x: '18.5', y: '6.5', textAnchor: 'middle', fontSize: '3.5', fontWeight: 'bold', fill: 'white', style: { fontFamily: 'Georgia, serif' } }, '5'),
);

const _schulden = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Document/bill
  React.createElement('rect', { x: '4', y: '2', width: '16', height: '20', rx: '2' }),
  // Document lines
  React.createElement('line', { x1: '7', y1: '6', x2: '17', y2: '6', stroke: 'white', strokeWidth: '1.2', strokeLinecap: 'round', opacity: '0.4' }),
  React.createElement('line', { x1: '7', y1: '9', x2: '14', y2: '9', stroke: 'white', strokeWidth: '1.2', strokeLinecap: 'round', opacity: '0.4' }),
  React.createElement('line', { x1: '7', y1: '12', x2: '15', y2: '12', stroke: 'white', strokeWidth: '1.2', strokeLinecap: 'round', opacity: '0.4' }),
  // Minus circle overlay
  React.createElement('circle', { cx: '17', cy: '18', r: '4.5', fill: 'white' }),
  React.createElement('circle', { cx: '17', cy: '18', r: '4.5', fill: 'currentColor', opacity: '0.7' }),
  React.createElement('line', { x1: '14.5', y1: '18', x2: '19.5', y2: '18', stroke: 'white', strokeWidth: '1.8', strokeLinecap: 'round' }),
);

const _steuern = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Tax document
  React.createElement('rect', { x: '3', y: '1', width: '18', height: '22', rx: '2', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5' }),
  // Header lines
  React.createElement('line', { x1: '6', y1: '4.5', x2: '18', y2: '4.5', stroke: 'currentColor', strokeWidth: '1', strokeLinecap: 'round', opacity: '0.4' }),
  React.createElement('line', { x1: '6', y1: '7', x2: '14', y2: '7', stroke: 'currentColor', strokeWidth: '1', strokeLinecap: 'round', opacity: '0.4' }),
  // Divider
  React.createElement('line', { x1: '3', y1: '9.5', x2: '21', y2: '9.5', stroke: 'currentColor', strokeWidth: '0.5', strokeDasharray: '1.5 1', opacity: '0.3' }),
  // QR code area (simplified)
  React.createElement('rect', { x: '5', y: '11', width: '8', height: '8', rx: '0.8', fill: 'currentColor', opacity: '0.15' }),
  React.createElement('rect', { x: '5.8', y: '11.8', width: '2.5', height: '2.5', rx: '0.3' }),
  React.createElement('rect', { x: '9.7', y: '11.8', width: '2.5', height: '2.5', rx: '0.3' }),
  React.createElement('rect', { x: '5.8', y: '15.7', width: '2.5', height: '2.5', rx: '0.3' }),
  React.createElement('rect', { x: '9.7', y: '15.7', width: '1.5', height: '1.5', rx: '0.2', opacity: '0.6' }),
  // Percent badge
  React.createElement('circle', { cx: '17', cy: '16', r: '3.5' }),
  React.createElement('text', { x: '17', y: '17.8', textAnchor: 'middle', fontSize: '4.5', fontWeight: 'bold', fill: 'white', style: { fontFamily: 'Georgia, serif' } }, '%'),
);

const _organspende = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Heart shape
  React.createElement('path', { d: 'M 12 21 Q 3 14 3 8.5 Q 3 4 7 4 Q 9.5 4 12 7 Q 14.5 4 17 4 Q 21 4 21 8.5 Q 21 14 12 21 Z' }),
  // Medical cross inside
  React.createElement('rect', { x: '10.5', y: '8', width: '3', height: '8', rx: '0.8', fill: 'white' }),
  React.createElement('rect', { x: '8', y: '10.5', width: '8', height: '3', rx: '0.8', fill: 'white' }),
);

const _chartsSchoko = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Chocolate bar body
  React.createElement('rect', { x: '2', y: '5', width: '20', height: '16', rx: '1.5' }),
  // Grid lines (chocolate segments)
  React.createElement('line', { x1: '7', y1: '5', x2: '7', y2: '21', stroke: 'white', strokeWidth: '0.3', opacity: '0.3' }),
  React.createElement('line', { x1: '12', y1: '5', x2: '12', y2: '21', stroke: 'white', strokeWidth: '0.3', opacity: '0.3' }),
  React.createElement('line', { x1: '17', y1: '5', x2: '17', y2: '21', stroke: 'white', strokeWidth: '0.3', opacity: '0.3' }),
  React.createElement('line', { x1: '2', y1: '10', x2: '22', y2: '10', stroke: 'white', strokeWidth: '0.3', opacity: '0.3' }),
  React.createElement('line', { x1: '2', y1: '15.5', x2: '22', y2: '15.5', stroke: 'white', strokeWidth: '0.3', opacity: '0.3' }),
  // Bar chart overlay — segments filled to different heights
  React.createElement('rect', { x: '2.5', y: '10', width: '4', height: '11', rx: '0.3', fill: 'white', opacity: '0.3' }),
  React.createElement('rect', { x: '7.5', y: '5.5', width: '4', height: '15.5', rx: '0.3', fill: 'white', opacity: '0.35' }),
  React.createElement('rect', { x: '12.5', y: '15.5', width: '4', height: '5.5', rx: '0.3', fill: 'white', opacity: '0.25' }),
  React.createElement('rect', { x: '17.5', y: '8', width: '4', height: '13', rx: '0.3', fill: 'white', opacity: '0.32' }),
  // Broken-off piece
  React.createElement('rect', { x: '19', y: '1.5', width: '4', height: '4', rx: '0.8', fill: 'currentColor', opacity: '0.5', transform: 'rotate(12 21 3.5)' }),
);

const _exportTool = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Swiss army knife body (generic silhouette)
  React.createElement('rect', { x: '4', y: '9', width: '16', height: '6', rx: '3', fill: 'currentColor' }),
  // Blade extended
  React.createElement('path', { d: 'M 16 9 L 21 3 L 21.5 3.8 L 17.5 9.5', fill: 'currentColor', opacity: '0.8' }),
  // Small tool extended down
  React.createElement('path', { d: 'M 16 15 L 20 19.5 L 19.3 20 L 15.5 15.5', fill: 'currentColor', opacity: '0.6' }),
  // Pivot
  React.createElement('circle', { cx: '16.5', cy: '12', r: '1.2', fill: 'white', opacity: '0.5' }),
  // Cross detail on body
  React.createElement('rect', { x: '9.5', y: '10.5', width: '3', height: '3', rx: '0.5', fill: 'white', opacity: '0.15' }),
  React.createElement('line', { x1: '11', y1: '10.8', x2: '11', y2: '13.2', stroke: 'white', strokeWidth: '0.5', opacity: '0.3' }),
  React.createElement('line', { x1: '9.8', y1: '12', x2: '12.2', y2: '12', stroke: 'white', strokeWidth: '0.5', opacity: '0.3' }),
  // Export arrow
  React.createElement('path', { d: 'M 4.5 18.5 L 7.5 21.5', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' }),
  React.createElement('polyline', { points: '5,21.5 7.5,21.5 7.5,19', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round' }),
);

const _praemienverbilligung = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Insurance shield
  React.createElement('path', { d: 'M 9 2 L 3 5 L 3 10 Q 3 15.5 9 18 Q 15 15.5 15 10 L 15 5 Z' }),
  // Cross inside shield
  React.createElement('rect', { x: '7.5', y: '6', width: '3', height: '8', rx: '0.5', fill: 'white' }),
  React.createElement('rect', { x: '5.5', y: '8.5', width: '7', height: '3', rx: '0.5', fill: 'white' }),
  // Coin with down arrow
  React.createElement('circle', { cx: '18', cy: '16', r: '5' }),
  React.createElement('circle', { cx: '18', cy: '16', r: '5', fill: 'none', stroke: 'white', strokeWidth: '0.5', opacity: '0.3' }),
  // Down arrow on coin
  React.createElement('line', { x1: '18', y1: '13.5', x2: '18', y2: '18', stroke: 'white', strokeWidth: '1.2', strokeLinecap: 'round' }),
  React.createElement('polyline', { points: '15.5,16 18,18.5 20.5,16', fill: 'none', stroke: 'white', strokeWidth: '1.2', strokeLinecap: 'round', strokeLinejoin: 'round' }),
);

const _mietzinsverbilligung = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Small chalet
  React.createElement('polygon', { points: '8,5 2,10 14,10' }),
  React.createElement('rect', { x: '3.5', y: '10', width: '9', height: '7' }),
  React.createElement('rect', { x: '6', y: '12', width: '3', height: '2.5', rx: '0.3', fill: 'white' }),
  React.createElement('rect', { x: '10', y: '13', width: '2', height: '4', rx: '0.3', fill: 'white', opacity: '0.7' }),
  // Coin with down arrow
  React.createElement('circle', { cx: '18', cy: '16', r: '5' }),
  React.createElement('line', { x1: '18', y1: '13.5', x2: '18', y2: '18', stroke: 'white', strokeWidth: '1.2', strokeLinecap: 'round' }),
  React.createElement('polyline', { points: '15.5,16 18,18.5 20.5,16', fill: 'none', stroke: 'white', strokeWidth: '1.2', strokeLinecap: 'round', strokeLinejoin: 'round' }),
);

const _sozialhilfe = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Protective arc above
  React.createElement('path', { d: 'M 4 8 Q 12 2 20 8', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round' }),
  // Person
  React.createElement('circle', { cx: '12', cy: '10', r: '2.5' }),
  React.createElement('path', { d: 'M 8 17 Q 8 14 12 14 Q 16 14 16 17', fill: 'currentColor' }),
  // Two supporting hands
  React.createElement('path', { d: 'M 2 19 Q 2 16 5 15 Q 7.5 14.5 9 16 L 9 19 Q 7 20.5 5 20.5 Q 2 20.5 2 19 Z' }),
  React.createElement('path', { d: 'M 22 19 Q 22 16 19 15 Q 16.5 14.5 15 16 L 15 19 Q 17 20.5 19 20.5 Q 22 20.5 22 19 Z' }),
  // Small heart between hands
  React.createElement('path', { d: 'M 12 22.5 Q 9.5 20.5 9.5 19 Q 9.5 17.8 10.5 17.5 Q 12 17.2 12 18.5 Q 12 17.2 13.5 17.5 Q 14.5 17.8 14.5 19 Q 14.5 20.5 12 22.5 Z', opacity: '0.7' }),
);

const _lebenslauf = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Document
  React.createElement('rect', { x: '4', y: '1', width: '16', height: '22', rx: '2', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5' }),
  // Person icon (head)
  React.createElement('circle', { cx: '9', cy: '6', r: '2.2' }),
  // Shoulders
  React.createElement('path', { d: 'M 5.5 11 Q 9 9.5 12.5 11', fill: 'currentColor' }),
  // Name lines
  React.createElement('line', { x1: '14.5', y1: '5.5', x2: '18', y2: '5.5', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round', opacity: '0.5' }),
  React.createElement('line', { x1: '14.5', y1: '8', x2: '17', y2: '8', stroke: 'currentColor', strokeWidth: '1', strokeLinecap: 'round', opacity: '0.35' }),
  // Divider
  React.createElement('line', { x1: '6', y1: '13', x2: '18', y2: '13', stroke: 'currentColor', strokeWidth: '0.5', opacity: '0.2' }),
  // Content lines
  React.createElement('line', { x1: '6', y1: '15.5', x2: '18', y2: '15.5', stroke: 'currentColor', strokeWidth: '1.2', strokeLinecap: 'round', opacity: '0.4' }),
  React.createElement('line', { x1: '6', y1: '18', x2: '15', y2: '18', stroke: 'currentColor', strokeWidth: '1.2', strokeLinecap: 'round', opacity: '0.4' }),
  React.createElement('line', { x1: '6', y1: '20.5', x2: '16', y2: '20.5', stroke: 'currentColor', strokeWidth: '1.2', strokeLinecap: 'round', opacity: '0.4' }),
);


const _vorsorge = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 12 3 L 12 7', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' }),
  React.createElement('path', { d: 'M 9.5 5 L 14.5 5', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' }),
  React.createElement('rect', { x: '3', y: '7', width: '18', height: '14', rx: '3', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5' }),
  React.createElement('circle', { cx: '12', cy: '14', r: '3.5', fill: 'none', stroke: 'currentColor', strokeWidth: '1.3' }),
  React.createElement('text', { x: '12', y: '16', textAnchor: 'middle', fontSize: '5', fontWeight: '700', fill: 'currentColor' }, 'Fr')
);


// ═══════════════════════════════════════════════════════════════
// Feature Icons (20x20 default)
// ═══════════════════════════════════════════════════════════════

const _upload = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M 12 16 L 12 4' }),
  React.createElement('polyline', { points: '8,8 12,4 16,8' }),
  React.createElement('path', { d: 'M 4 17 L 4 20 L 20 20 L 20 17' })
);

const _barcode = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('rect', { x: '3', y: '4', width: '2', height: '14' }),
  React.createElement('rect', { x: '7', y: '4', width: '1', height: '14' }),
  React.createElement('rect', { x: '10', y: '4', width: '2', height: '14' }),
  React.createElement('rect', { x: '14', y: '4', width: '1', height: '14' }),
  React.createElement('rect', { x: '17', y: '4', width: '2', height: '14' }),
  React.createElement('rect', { x: '21', y: '4', width: '1', height: '14' }),
  React.createElement('line', { x1: '3', y1: '21', x2: '22', y2: '21', stroke: 'currentColor', strokeWidth: '1.5' })
);

const _document = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 6 2 L 6 22 L 18 22 L 18 8 L 12 2 Z' }),
  React.createElement('path', { d: 'M 12 2 L 12 8 L 18 8', fill: 'none', stroke: 'white', strokeWidth: '1' })
);

const _download = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M 12 4 L 12 16' }),
  React.createElement('polyline', { points: '8,12 12,16 16,12' }),
  React.createElement('path', { d: 'M 4 17 L 4 20 L 20 20 L 20 17' })
);

const _delete = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 5 7 L 7 7 L 7 20 Q 7 21 8 21 L 16 21 Q 17 21 17 20 L 17 7 L 19 7' }),
  React.createElement('rect', { x: '3', y: '5', width: '18', height: '2', rx: '1' }),
  React.createElement('path', { d: 'M 9 5 L 9 3 Q 9 2 10 2 L 14 2 Q 15 2 15 3 L 15 5' }),
  React.createElement('line', { x1: '10', y1: '10', x2: '10', y2: '17', stroke: 'white', strokeWidth: '1.5', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '14', y1: '10', x2: '14', y2: '17', stroke: 'white', strokeWidth: '1.5', strokeLinecap: 'round' })
);

const _check = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('polyline', { points: '4,12 10,18 20,6' })
);

const _warning = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 12 2 L 22 20 L 2 20 Z' }),
  React.createElement('line', { x1: '12', y1: '9', x2: '12', y2: '14', stroke: 'white', strokeWidth: '2', strokeLinecap: 'round' }),
  React.createElement('circle', { cx: '12', cy: '17', r: '1', fill: 'white' })
);

const _dashboard = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('rect', { x: '3', y: '3', width: '8', height: '8', rx: '2' }),
  React.createElement('rect', { x: '13', y: '3', width: '8', height: '8', rx: '2' }),
  React.createElement('rect', { x: '3', y: '13', width: '8', height: '8', rx: '2' }),
  React.createElement('rect', { x: '13', y: '13', width: '8', height: '8', rx: '2' })
);

const _settings = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round' },
  React.createElement('circle', { cx: '12', cy: '12', r: '3' }),
  React.createElement('path', { d: 'M 12 1 L 13 5 L 17 3 L 15 7 L 19 8 L 16 11 L 19 14 L 15 13 L 17 17 L 13 15 L 12 19 L 11 15 L 7 17 L 9 13 L 5 14 L 8 11 L 5 8 L 9 7 L 7 3 L 11 5 Z', fill: 'currentColor' })
);

const _csv = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 6 2 L 6 22 L 18 22 L 18 8 L 12 2 Z' }),
  React.createElement('path', { d: 'M 12 2 L 12 8 L 18 8', fill: 'none', stroke: 'white', strokeWidth: '1' }),
  React.createElement('text', { x: '12', y: '17', textAnchor: 'middle', fontSize: '7', fill: 'white', fontWeight: '600' }, 'CSV')
);

const _money = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('rect', { x: '2', y: '5', width: '20', height: '14', rx: '2' }),
  React.createElement('circle', { cx: '12', cy: '12', r: '3', fill: 'none', stroke: 'white', strokeWidth: '1.5' }),
  React.createElement('circle', { cx: '5', cy: '12', r: '1', fill: 'white' }),
  React.createElement('circle', { cx: '19', cy: '12', r: '1', fill: 'white' })
);

const _health = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 12 21 Q 3 14 3 8.5 Q 3 4 7 4 Q 9.5 4 12 7 Q 14.5 4 17 4 Q 21 4 21 8.5 Q 21 14 12 21 Z' }),
  React.createElement('line', { x1: '12', y1: '9', x2: '12', y2: '15', stroke: 'white', strokeWidth: '1.8', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '9', y1: '12', x2: '15', y2: '12', stroke: 'white', strokeWidth: '1.8', strokeLinecap: 'round' })
);

const _debt = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
  React.createElement('line', { x1: '8', y1: '12', x2: '16', y2: '12', stroke: 'white', strokeWidth: '2.5', strokeLinecap: 'round' })
);

const _calendar = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('rect', { x: '3', y: '5', width: '18', height: '17', rx: '2' }),
  React.createElement('line', { x1: '3', y1: '10', x2: '21', y2: '10', stroke: 'white', strokeWidth: '1.5' }),
  React.createElement('line', { x1: '8', y1: '3', x2: '8', y2: '7', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '16', y1: '3', x2: '16', y2: '7', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' }),
  React.createElement('rect', { x: '7', y: '13', width: '3', height: '2', rx: '0.5', fill: 'white' }),
  React.createElement('rect', { x: '14', y: '13', width: '3', height: '2', rx: '0.5', fill: 'white' })
);

const _search = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
  React.createElement('circle', { cx: '10', cy: '10', r: '7' }),
  React.createElement('path', { d: 'M 21 21 L 15 15' })
);

const _filter = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 3 4 L 21 4 L 14 12 L 14 19 L 10 21 L 10 12 Z' })
);

const _success = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
  React.createElement('polyline', { points: '8,12 11,15 16,9', stroke: 'white', strokeWidth: '2', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
);

const _error = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
  React.createElement('line', { x1: '8', y1: '8', x2: '16', y2: '16', stroke: 'white', strokeWidth: '2', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '16', y1: '8', x2: '8', y2: '16', stroke: 'white', strokeWidth: '2', strokeLinecap: 'round' })
);

const _qr = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('rect', { x: '2', y: '2', width: '8', height: '8', rx: '1' }),
  React.createElement('rect', { x: '4', y: '4', width: '4', height: '4', fill: 'none', stroke: 'white', strokeWidth: '1' }),
  React.createElement('rect', { x: '14', y: '2', width: '8', height: '8', rx: '1' }),
  React.createElement('rect', { x: '16', y: '4', width: '4', height: '4', fill: 'none', stroke: 'white', strokeWidth: '1' }),
  React.createElement('rect', { x: '2', y: '14', width: '8', height: '8', rx: '1' }),
  React.createElement('rect', { x: '4', y: '16', width: '4', height: '4', fill: 'none', stroke: 'white', strokeWidth: '1' }),
  React.createElement('rect', { x: '14', y: '14', width: '3', height: '3', rx: '0.5' }),
  React.createElement('rect', { x: '19', y: '14', width: '3', height: '3', rx: '0.5' }),
  React.createElement('rect', { x: '14', y: '19', width: '3', height: '3', rx: '0.5' })
);


// ═══════════════════════════════════════════════════════════════
// Semantic Icons — domain-specific pictograms
// ═══════════════════════════════════════════════════════════════

const _dentist = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Tooth shape
  React.createElement('path', { d: 'M 8 3 Q 5 3 5 7 Q 5 11 7 14 Q 8 17 8 20 Q 8 22 10 22 Q 11 22 11 19 L 12 15 L 13 19 Q 13 22 14 22 Q 16 22 16 20 Q 16 17 17 14 Q 19 11 19 7 Q 19 3 16 3 Q 14 3 12 5 Q 10 3 8 3 Z' })
);

const _doctor = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Stethoscope
  React.createElement('path', { d: 'M 6 4 Q 6 2 8 2 L 8 6 Q 8 10 12 10 Q 16 10 16 6 L 16 2 Q 18 2 18 4', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round' }),
  React.createElement('path', { d: 'M 16 10 L 16 14 Q 16 19 12 19 L 10 19 Q 6 19 6 15', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round' }),
  React.createElement('circle', { cx: '18', cy: '12', r: '2.5' }),
  React.createElement('circle', { cx: '18', cy: '12', r: '1', fill: 'white' })
);

const _home = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M 3 12 L 12 3 L 21 12' }),
  React.createElement('path', { d: 'M 5 12 L 5 20 Q 5 21 6 21 L 18 21 Q 19 21 19 20 L 19 12' }),
  React.createElement('rect', { x: '10', y: '14', width: '4', height: '7' })
);

const _insurance = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Shield with Swiss cross
  React.createElement('path', { d: 'M 12 2 L 4 6 L 4 12 Q 4 19 12 22 Q 20 19 20 12 L 20 6 Z' }),
  React.createElement('rect', { x: '10', y: '8', width: '4', height: '8', rx: '0.5', fill: 'white' }),
  React.createElement('rect', { x: '8', y: '10', width: '8', height: '4', rx: '0.5', fill: 'white' })
);

const _documents = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Stacked documents
  React.createElement('rect', { x: '7', y: '1', width: '13', height: '17', rx: '2' }),
  React.createElement('rect', { x: '4', y: '5', width: '13', height: '17', rx: '2', fill: 'currentColor', stroke: 'white', strokeWidth: '1' }),
  React.createElement('line', { x1: '7', y1: '11', x2: '14', y2: '11', stroke: 'white', strokeWidth: '1.5', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '7', y1: '15', x2: '12', y2: '15', stroke: 'white', strokeWidth: '1.5', strokeLinecap: 'round' })
);

const _budget = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Wallet
  React.createElement('rect', { x: '2', y: '6', width: '20', height: '14', rx: '2' }),
  React.createElement('path', { d: 'M 2 6 Q 2 3 5 3 L 17 3 Q 19 3 19 5', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8' }),
  React.createElement('rect', { x: '15', y: '11', width: '7', height: '4', rx: '1', fill: 'white' }),
  React.createElement('circle', { cx: '18', cy: '13', r: '1', fill: 'currentColor' })
);

const _timeline = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Vertical line with dots
  React.createElement('line', { x1: '8', y1: '4', x2: '8', y2: '20', stroke: 'currentColor', strokeWidth: '1.8' }),
  React.createElement('circle', { cx: '8', cy: '6', r: '2.5' }),
  React.createElement('circle', { cx: '8', cy: '12', r: '2.5' }),
  React.createElement('circle', { cx: '8', cy: '18', r: '2.5' }),
  React.createElement('line', { x1: '12', y1: '6', x2: '20', y2: '6', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '12', y1: '12', x2: '18', y2: '12', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '12', y1: '18', x2: '20', y2: '18', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' })
);

const _emergency = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Alert bell
  React.createElement('path', { d: 'M 12 2 Q 6 2 6 10 L 6 14 L 3 18 L 21 18 L 18 14 L 18 10 Q 18 2 12 2 Z' }),
  React.createElement('path', { d: 'M 9 18 Q 9 22 12 22 Q 15 22 15 18', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5' }),
  React.createElement('circle', { cx: '12', cy: '2', r: '1.5' })
);

const _mobility = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  // Bus/transit
  React.createElement('rect', { x: '3', y: '4', width: '18', height: '14', rx: '3' }),
  React.createElement('line', { x1: '3', y1: '10', x2: '21', y2: '10' }),
  React.createElement('line', { x1: '12', y1: '4', x2: '12', y2: '10' }),
  React.createElement('circle', { cx: '7', cy: '20', r: '1.5', fill: 'currentColor' }),
  React.createElement('circle', { cx: '17', cy: '20', r: '1.5', fill: 'currentColor' })
);

const _work = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Briefcase
  React.createElement('rect', { x: '2', y: '7', width: '20', height: '13', rx: '2' }),
  React.createElement('path', { d: 'M 8 7 L 8 5 Q 8 3 10 3 L 14 3 Q 16 3 16 5 L 16 7', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8' }),
  React.createElement('line', { x1: '2', y1: '13', x2: '22', y2: '13', stroke: 'white', strokeWidth: '1.5' })
);

const _selfEmployment = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Shopfront / own business
  React.createElement('rect', { x: '3', y: '10', width: '18', height: '12', rx: '1' }),
  React.createElement('path', { d: 'M 1 10 L 3 3 L 21 3 L 23 10 Z' }),
  React.createElement('rect', { x: '9', y: '15', width: '6', height: '7', fill: 'white', rx: '1' }),
  React.createElement('line', { x1: '12', y1: '15', x2: '12', y2: '22', stroke: 'currentColor', strokeWidth: '1' })
);

const _contacts = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Two people
  React.createElement('circle', { cx: '9', cy: '7', r: '3.5' }),
  React.createElement('path', { d: 'M 2 19 Q 2 14 9 14 Q 16 14 16 19' }),
  React.createElement('circle', { cx: '17', cy: '8', r: '2.5', opacity: '0.6' }),
  React.createElement('path', { d: 'M 15 19 Q 15 15.5 17 14.5 Q 22 14 22 18', opacity: '0.6' })
);

const _family = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Adult + child
  React.createElement('circle', { cx: '8', cy: '6', r: '3' }),
  React.createElement('path', { d: 'M 2 20 Q 2 14 8 14 Q 14 14 14 20' }),
  React.createElement('circle', { cx: '17', cy: '10', r: '2.5' }),
  React.createElement('path', { d: 'M 13 20 Q 13 16 17 16 Q 21 16 21 20' })
);

const _legal = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Scale / balance
  React.createElement('line', { x1: '12', y1: '2', x2: '12', y2: '20', stroke: 'currentColor', strokeWidth: '2' }),
  React.createElement('line', { x1: '4', y1: '6', x2: '20', y2: '6', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' }),
  React.createElement('path', { d: 'M 2 14 L 4 6 L 6 14 Q 4 16 2 14 Z' }),
  React.createElement('path', { d: 'M 18 12 L 20 6 L 22 12 Q 20 14 18 12 Z' }),
  React.createElement('rect', { x: '8', y: '20', width: '8', height: '2', rx: '1' })
);

const _edit = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M 16 3 L 21 8 L 8 21 L 3 21 L 3 16 Z' }),
  React.createElement('line', { x1: '14', y1: '5', x2: '19', y2: '10' })
);

const _phone = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 5 2 L 9 2 L 11 7 L 8 9 Q 10 14 14 16 L 16 13 L 21 15 L 21 19 Q 21 22 17 22 Q 5 20 2 8 Q 2 4 5 2 Z' })
);

const _info = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
  React.createElement('circle', { cx: '12', cy: '8', r: '1.2', fill: 'white' }),
  React.createElement('rect', { x: '10.5', y: '11', width: '3', height: '6', rx: '0.5', fill: 'white' })
);

const _external = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M 18 13 L 18 20 Q 18 21 17 21 L 5 21 Q 4 21 4 20 L 4 8 Q 4 7 5 7 L 11 7' }),
  React.createElement('path', { d: 'M 15 3 L 21 3 L 21 9' }),
  React.createElement('path', { d: 'M 10 14 L 21 3' })
);

const _recurring = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M 4 12 Q 4 6 12 6 Q 18 6 19 10' }),
  React.createElement('polyline', { points: '16,6 20,10 20,6' }),
  React.createElement('path', { d: 'M 20 12 Q 20 18 12 18 Q 6 18 5 14' }),
  React.createElement('polyline', { points: '8,18 4,14 4,18' })
);


const _lock = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('rect', { x: '5', y: '11', width: '14', height: '10', rx: '2' }),
  React.createElement('path', { d: 'M 8 11 L 8 7 Q 8 3 12 3 Q 16 3 16 7 L 16 11' })
);

const _cowbell = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 10 3 Q 10 1.5 12 1.5 Q 14 1.5 14 3 L 14 4 L 10 4 Z', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinejoin: 'round' }),
  React.createElement('path', { d: 'M 9 4 L 7 19 Q 7 21 8 21 L 16 21 Q 17 21 17 19 L 15 4 Z' }),
  React.createElement('line', { x1: '12.5', y1: '15', x2: '12.5', y2: '21', stroke: 'white', strokeWidth: '1.2', strokeLinecap: 'round', opacity: '0.6' }),
  React.createElement('circle', { cx: '12.5', cy: '21.5', r: '1.2', fill: 'white', opacity: '0.7' }),
);


// ═══════════════════════════════════════════════════════════════
// Icon Registry
// ═══════════════════════════════════════════════════════════════

export const Icons = {
  // Chapter icons
  basis: _basis,
  wohnen: _wohnen,
  finanzen: _finanzen,
  versicherungen: _versicherungen,
  ausbildung: _ausbildung,
  behoerden: _behoerden,
  notfall: _notfall,

  // Extended chapter icons
  dokumentTresor: _dokumentTresor,
  kalenderUhr: _kalenderUhr,
  budgetWallet: _budgetWallet,
  schulden: _schulden,
  steuern: _steuern,
  organspende: _organspende,
  chartsSchoko: _chartsSchoko,
  exportTool: _exportTool,
  praemienverbilligung: _praemienverbilligung,
  mietzinsverbilligung: _mietzinsverbilligung,
  sozialhilfe: _sozialhilfe,
  lebenslauf: _lebenslauf,
  vorsorge: _vorsorge,

  // Feature icons
  upload: _upload,
  barcode: _barcode,
  document: _document,
  download: _download,
  delete: _delete,
  check: _check,
  warning: _warning,
  dashboard: _dashboard,
  settings: _settings,
  csv: _csv,
  money: _money,
  health: _health,
  debt: _debt,
  calendar: _calendar,
  search: _search,
  filter: _filter,
  success: _success,
  error: _error,
  qr: _qr,

  // Semantic icons
  dentist: _dentist,
  doctor: _doctor,
  home: _home,
  insurance: _insurance,
  documents: _documents,
  budget: _budget,
  timeline: _timeline,
  emergency: _emergency,
  mobility: _mobility,
  work: _work,
  selfEmployment: _selfEmployment,
  contacts: _contacts,
  family: _family,
  legal: _legal,
  edit: _edit,
  phone: _phone,
  info: _info,
  external: _external,
  recurring: _recurring,
  lock: _lock,
  cowbell: _cowbell,
};


// ═══════════════════════════════════════════════════════════════
// Icon Component — the preferred way to render icons
// ═══════════════════════════════════════════════════════════════
// Wraps any icon key with proper sizing, color inheritance,
// and aria-hidden for accessibility (all icons are decorative).

export const Icon = ({ name, size = 16, color, style = {} }) => {
  const IconFn = Icons[name];
  if (!IconFn) return null;

  return React.createElement('span', {
    'aria-hidden': 'true',
    role: 'img',
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size + 'px',
      height: size + 'px',
      flexShrink: 0,
      color: color || 'inherit',
      ...style,
    }
  }, IconFn());
};


// ═══════════════════════════════════════════════════════════════
// Legacy Components — preserved for backward compatibility
// ═══════════════════════════════════════════════════════════════

export const IconWithLabel = ({ icon, label, color = '#8A8478', onClick = null, style = {} }) => {
  const baseStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  const content = [
    React.createElement(Icon, { key: 'icon', name: icon, size: 32, color }),
    React.createElement('div', { key: 'label', style: { fontSize: text.sm, color, textAlign: 'center', fontWeight: '500' } }, label)
  ];

  return onClick
    ? React.createElement('button', { type: 'button', style: { ...baseStyle, background: 'none', border: 'none', padding: 0, font: 'inherit' }, onClick }, content)
    : React.createElement('div', { style: baseStyle }, content);
};


export const IconButton = ({ icon, color = '#EDE8E0', onClick, title = '', size = '20px' }) => {
  const numSize = parseInt(size, 10) || 20;
  return React.createElement('button', {
    onClick,
    title,
    'aria-label': title,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
    React.createElement(Icon, { name: icon, size: numSize, color })
  );
};

export default Icons;
