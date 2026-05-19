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
  React.createElement('circle', { cx: '12', cy: '8', r: '4' }),
  React.createElement('path', { d: 'M 4 20 Q 4 14 12 14 Q 20 14 20 20' })
);

const _wohnen = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 3 12 L 12 3 L 21 12' }),
  React.createElement('rect', { x: '5', y: '12', width: '14', height: '9', rx: '1' }),
  React.createElement('rect', { x: '9', y: '15', width: '2', height: '6' }),
  React.createElement('rect', { x: '13', y: '15', width: '2', height: '6' })
);

const _finanzen = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('circle', { cx: '12', cy: '12', r: '11' }),
  React.createElement('circle', { cx: '12', cy: '12', r: '9.3', fill: 'none', stroke: 'white', strokeWidth: '0.3', strokeDasharray: '0.7 1' }),
  React.createElement('text', { x: '9', y: '8.5', textAnchor: 'middle', fontSize: '6', fontWeight: 'bold', fill: 'white', style: { fontFamily: 'Georgia, serif' } }, '5'),
  React.createElement('text', { x: '15', y: '8', textAnchor: 'middle', fontSize: '4', fontWeight: '600', fill: 'white', style: { fontFamily: 'Georgia, serif' } }, 'FR.'),
  React.createElement('circle', { cx: '11.5', cy: '5.5', r: '0.35', fill: 'white' }),
  React.createElement('path', { d: 'M 8.5 10 L 8.5 16.5 Q 8.5 18.5 12 19.5 Q 15.5 18.5 15.5 16.5 L 15.5 10 Z', fill: 'white', opacity: 0.9 }),
  React.createElement('path', { d: 'M 11.2 12 L 11.2 16 L 12.8 16 L 12.8 12 Z M 10 13.2 L 10 14.8 L 14 14.8 L 14 13.2 Z', fill: 'currentColor' }),
  React.createElement('path', {
    d: 'M 16.5 16 C 17.5 14 18 12 17.5 10 M 17 14.5 L 18.5 14 M 17.5 12.5 L 19 12',
    fill: 'none', stroke: 'white', strokeWidth: '0.4', strokeLinecap: 'round',
  }),
);

const _versicherungen = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 12 2 L 4 6 L 4 12 Q 4 19 12 22 Q 20 19 20 12 L 20 6 Z' }),
  React.createElement('polyline', { points: '9,12 11,14 15,10', stroke: 'white', strokeWidth: '1.8', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' })
);

const _ausbildung = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 2 10 L 12 5 L 22 10 L 12 15 Z' }),
  React.createElement('path', { d: 'M 6 12.5 L 6 18 L 12 21 L 18 18 L 18 12.5' }),
  React.createElement('line', { x1: '20', y1: '10', x2: '20', y2: '17', stroke: 'currentColor', strokeWidth: '1.5' })
);

const _behoerden = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('circle', { cx: '12', cy: '12', r: '11' }),
  React.createElement('circle', { cx: '12', cy: '12', r: '9.3', fill: 'none', stroke: 'white', strokeWidth: '0.3', strokeDasharray: '0.7 1' }),
  React.createElement('path', {
    d: 'M 15 5.5 C 13.5 4 10 4 9 5.5 C 8.5 6.5 8 7 8 8 L 7 8.5 C 6.5 9 6.5 9.5 7.5 9.8 L 8 10 L 7.5 10.5 L 6 11.5 L 7.5 12 L 7.5 12.5 C 7.5 13.5 8 15 8.5 16 L 9 17 C 9 17.5 9.5 18.5 10 19 L 14 19 L 14 17 C 14.5 16 15 14.5 15.5 13 C 16 11.5 16 9 16 8 C 16 6.5 15.5 6 15 5.5 Z',
    fill: 'white',
  }),
  React.createElement('path', {
    d: 'M 10 5 C 10.5 3.5 12 3 13.5 3.5 C 14 4 14.5 4.5 14 5',
    fill: 'none', stroke: 'white', strokeWidth: '0.6', strokeLinecap: 'round',
  }),
);

const _notfall = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('rect', { x: '4', y: '2', width: '16', height: '20', rx: '2' }),
  React.createElement('line', { x1: '12', y1: '8', x2: '12', y2: '16', stroke: 'white', strokeWidth: '2.5', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '8', y1: '12', x2: '16', y2: '12', stroke: 'white', strokeWidth: '2.5', strokeLinecap: 'round' })
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
    React.createElement('div', { key: 'label', style: { fontSize: '12px', color, textAlign: 'center', fontWeight: '500' } }, label)
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
