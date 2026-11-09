import React from 'react';
import { tagInZuerich } from './utils/zuerichTag.js';

// ─── Maloja Plana SVG Pictogram System — der Kern ──────────
//
// 🛑 Aufgeteilt am 24.09.2026 (E36: Platz unter dem 65-kB-Deckel, der Deckel bleibt).
// Diese Datei trägt nur die Icons, die der FEST geladene Teil der App braucht
// (main.jsx, Dashboard, Kopf-/Fusszeile, Hinweise). Die übrigen stehen in
// `IconSystem.jsx` und hängen sich beim Laden dort in DASSELBE `Icons`-Objekt ein.
//
// Welche Datei importiert was:
//   · Fest geladene Dateien (in der Startdatei) → `./IconKern.jsx`.
//   · Alles andere → wie bisher `./IconSystem.jsx` (volles Register).
// Eine nachgeladene Ansicht zieht `IconSystem.jsx` als festen Import mit — ihr
// Stück wartet also auf das volle Register, bevor es zeichnet. Kein Icon kommt
// asynchron nach, und ein zur Laufzeit gebildeter Name (`Icons[b.iconName]`)
// findet dort immer alle Icons. Nur im festen Teil gilt: nur Kern-Namen.
// EINE Ausnahme (25.09.2026): die Münzen «finanzen» und «behoerden» — Namen im Kern,
// Zeichnung nachgeladen aus `IconMuenzen.jsx`, bis dahin ein Münzkreis (siehe dort).
// Wächter: src/__tests__/iconNamen.test.js («Kern-Namen im festen Teil»).
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
//   1. Add factory function to the appropriate section — hier nur, wenn der fest
//      geladene Teil es zeigt; sonst in `IconSystem.jsx` (siehe oben)
//   2. Use "currentColor" for fills/strokes. Funktions-Icons (Schicht B) sind Strich und tragen
//      NIE "white" — im Dunkelmodus ist currentColor hell und ein weisses Innenzeichen
//      verschwindet (Icon-Plan, Schritt 5, 06.11.2026; Wächter schichtBStrich.test.js).
//      Lebensbereich-Bilder (Schicht A) haben noch weisse Details — offener Punkt im Plan.
//   3. Keep paths simple — aim for < 3 elements per icon
//   4. Test in both light and dark palette

// ═══════════════════════════════════════════════════════════════
// Chapter Icons (24x24 default)
// ═══════════════════════════════════════════════════════════════

// Die Leitformen Ausweiskarte, Edelweiss-Schild, Schulhut, Arztkoffer und das Herz mit Puls
// (Icon-Plan November 2026, Bauplan B2) kommen wie die Münzen nachgeladen aus IconMuenzen.jsx —
// gemessen 08.11.2026: im Kern hätten sie das Startbündel auf 64 997 von 65 000 Bytes gebracht.
const _basis = () => React.createElement(Muenze, { art: 'basis' });

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

// ─── Die zwei Münzen: nachgeladen (25.09.2026) ─────────────────
// «Finanzen» (5 Franken) und «Behörden» (Helvetia) sind Illustrationen, keine Symbole:
// zusammen 2,66 kB gzip im Startbündel, gemessen per Wegwerf-Eingriff (64,98 → 62,32 kB).
// Darum die EINE Ausnahme von «kein Icon kommt asynchron nach» (Kopf dieser Datei): die
// Namen bleiben im Kern (der feste Teil findet sie), gezeichnet wird bis zum Eintreffen
// ein schlichter Münzkreis in gleicher Grösse — nichts springt. Das Laden beginnt sofort
// beim Start; scheitert es (offline, veralteter Stand), bleibt der Kreis.
// Wächter: src/__tests__/iconMuenzen.test.js
let muenzen = null;
const muenzenLaden = import('./IconMuenzen.jsx').then((m) => { muenzen = m; return m; }, () => null);
// Für Tests: wartet, bis die Münzen da sind (oder das Laden gescheitert ist).
export const muenzenBereit = () => muenzenLaden;
const Muenze = ({ art, ...rest }) => {
  const [, neuZeichnen] = React.useState(0);
  React.useEffect(() => {
    let aktiv = true;
    if (!muenzen) muenzenLaden.then((m) => { if (aktiv && m) neuZeichnen(1); });
    return () => { aktiv = false; };
  }, []);
  if (muenzen) return React.cloneElement(muenzen[art](), rest);
  return React.createElement('svg', { viewBox: '0 0 48 48', ...rest },
    React.createElement('circle', { cx: '24', cy: '24', r: '19', fill: 'none', stroke: 'currentColor', strokeWidth: '2.5', opacity: '0.55' }));
};

const _finanzen = () => React.createElement(Muenze, { art: 'finanzen' });
const _versicherungen = () => React.createElement(Muenze, { art: 'versicherungen' });
const _ausbildung = () => React.createElement(Muenze, { art: 'ausbildung' });
const _notfall = () => React.createElement(Muenze, { art: 'notfall' });
const _herzPuls = () => React.createElement(Muenze, { art: 'herzPuls' });

const _behoerden = () => React.createElement(Muenze, { art: 'behoerden' });

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

// Sicherung / Speichern — Doppel-Dokument mit Pfeil hinein (Sicherungskopie).
// Entscheid docs/brand/icon-dictionary.md 23.06.2026: bewusst KEINE Wolke (local-first).
const _sicherung = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M 9 3 H 16 L 20 7 V 17' }),
  React.createElement('path', { d: 'M 5 7 H 12 L 16 11 V 21 H 5 Z' }),
  React.createElement('path', { d: 'M 10.5 12 V 18' }),
  React.createElement('polyline', { points: '8,15.5 10.5,18 13,15.5' })
);

const _document = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M6 3 H14 L19 8 V20 a1 1 0 0 1 -1 1 H6 a1 1 0 0 1 -1 -1 V4 a1 1 0 0 1 1 -1 Z' }),
  React.createElement('path', { d: 'M14 3 V8 H19' }),
  React.createElement('path', { d: 'M8.5 13 H15.5 M8.5 16.5 H13.5' })
);

const _download = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M 12 4 L 12 16' }),
  React.createElement('polyline', { points: '8,12 12,16 16,12' }),
  React.createElement('path', { d: 'M 4 17 L 4 20 L 20 20 L 20 17' })
);

const _check = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('polyline', { points: '4,12 10,18 20,6' })
);

// Leeres Kästchen — Merkpunkte und nächste Schritte.
const _kaestchen = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('rect', { x: '4', y: '4', width: '16', height: '16', rx: '2' })
);

// Kreuz — Entfernen/Löschen, so leicht wie die frühere ✕-Glyphe (kein Abfalleimer-Gewicht).
const _kreuz = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M6 6l12 12M18 6L6 18' })
);

const _warning = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M10.3 5 a2 2 0 0 1 3.4 0 l7 12 a2 2 0 0 1 -1.7 3 H5 a2 2 0 0 1 -1.7 -3 Z' }),
  React.createElement('path', { d: 'M12 10 V13.5' }),
  React.createElement('circle', { cx: '12', cy: '16.6', r: '1.1', fill: 'currentColor', stroke: 'none' })
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

// Kalender — zeigt dynamisch den heutigen Tag. Outline + currentColor-Zahl,
// damit sie in Hell- UND Dunkelmodus lesbar bleibt. Fassung 5 (23.10.2026): der Tag
// gilt in Europe/Zurich, nicht nach der Uhr des Geräts (utils/zuerichTag.js).
const _calendar = () => {
  const day = tagInZuerich();
  return React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('rect', { x: '3', y: '5', width: '18', height: '17', rx: '2.5' }),
    React.createElement('line', { x1: '3', y1: '10', x2: '21', y2: '10' }),
    React.createElement('line', { x1: '8', y1: '3', x2: '8', y2: '7' }),
    React.createElement('line', { x1: '16', y1: '3', x2: '16', y2: '7' }),
    React.createElement('text', { x: '12', y: '18.6', textAnchor: 'middle', fontSize: '8.5', fontWeight: '700', fill: 'currentColor', stroke: 'none', style: { fontFamily: "'Hanken Grotesk', sans-serif" } }, String(day))
  );
};

// Ordner — die Dokumentenablage (Fassung 5, 23.10.2026). Dieselbe Form wie das
// `OrdnerIcon` in DocumentTresor.jsx (Rücken mit Reiter, vordere Klappe), hier als
// Linie im Stil der übrigen Zeichen. Vorher trug die Ablage den Tresor.
const _ordner = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M3 6.5 A1.5 1.5 0 0 1 4.5 5 H9.5 L11.5 7.5 H19.5 A1.5 1.5 0 0 1 21 9 V18.5 A1.5 1.5 0 0 1 19.5 20 H4.5 A1.5 1.5 0 0 1 3 18.5 Z' }),
  React.createElement('path', { d: 'M3 10.5 H21', opacity: '0.45' })
);

const _search = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' },
  React.createElement('circle', { cx: '10', cy: '10', r: '7' }),
  React.createElement('path', { d: 'M 21 21 L 15 15' })
);

const _home = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M 3 12 L 12 3 L 21 12' }),
  React.createElement('path', { d: 'M 5 12 L 5 20 Q 5 21 6 21 L 18 21 Q 19 21 19 20 L 19 12' }),
  React.createElement('rect', { x: '10', y: '14', width: '4', height: '7' })
);

// Thema Versicherung: dasselbe Edelweiss-Schild wie der Lebensbereich (Rechts-Prüfung 07.11.2026:
// ein Kreuz im Dreieckschild ist die Form des Schweizerwappens, WSchG Art. 2 und 8).
const _insurance = _versicherungen;

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

const _family = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Adult + child
  React.createElement('circle', { cx: '8', cy: '6', r: '3' }),
  React.createElement('path', { d: 'M 2 20 Q 2 14 8 14 Q 14 14 14 20' }),
  React.createElement('circle', { cx: '17', cy: '10', r: '2.5' }),
  React.createElement('path', { d: 'M 13 20 Q 13 16 17 16 Q 21 16 21 20' })
);

const _info = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('circle', { cx: '12', cy: '12', r: '9' }),
  React.createElement('path', { d: 'M12 11 V16.5' }),
  React.createElement('circle', { cx: '12', cy: '7.8', r: '1.1', fill: 'currentColor', stroke: 'none' })
);

const _chevron = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M 9 5 L 17 12 L 9 19' })
);

const _pfeil = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M 4 12 L 19 12' }),
  React.createElement('path', { d: 'M 13 6 L 19 12 L 13 18' })
);

const _external = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M 18 13 L 18 20 Q 18 21 17 21 L 5 21 Q 4 21 4 20 L 4 8 Q 4 7 5 7 L 11 7' }),
  React.createElement('path', { d: 'M 15 3 L 21 3 L 21 9' }),
  React.createElement('path', { d: 'M 10 14 L 21 3' })
);

const _cowbell = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 10 3 Q 10 1.5 12 1.5 Q 14 1.5 14 3 L 14 4 L 10 4 Z', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinejoin: 'round' }),
  React.createElement('path', { d: 'M 9 4 L 7 19 Q 7 21 8 21 L 16 21 Q 17 21 17 19 L 15 4 Z' }),
  React.createElement('line', { x1: '12.5', y1: '15', x2: '12.5', y2: '21', stroke: 'white', strokeWidth: '1.2', strokeLinecap: 'round', opacity: '0.6' }),
  React.createElement('circle', { cx: '12.5', cy: '21.5', r: '1.2', fill: 'white', opacity: '0.7' }),
);

// Leaf — green/eco marker (z.B. „grün gehostet"). Outline-Stil, 2 Elemente.
const _leaf = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Blattkörper — zwei Bögen, von unten-links nach oben-rechts geneigt
  React.createElement('path', { d: 'M 5 19 C 5 11 11 5 19 5 C 19 13 13 19 5 19 Z', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinejoin: 'round' }),
  // Mittelrippe
  React.createElement('path', { d: 'M 8 16 L 16 8', fill: 'none', stroke: 'currentColor', strokeWidth: '1.4', strokeLinecap: 'round' }),
);

// Herz — ruhige Kontur für Lebensereignisse wie Heirat (Granit-Linienstil wie die Kapitel-Icons).
const _heart = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none' },
  React.createElement('path', { d: 'M 12 20 C 12 20 4 14.5 4 8.8 C 4 6.1 6.1 4 8.6 4 C 10.2 4 11.4 4.9 12 6 C 12.6 4.9 13.8 4 15.4 4 C 17.9 4 20 6.1 20 8.8 C 20 14.5 12 20 12 20 Z', stroke: 'currentColor', strokeWidth: '1.6', strokeLinejoin: 'round' }),
);

// Die Zeichen des Boden-Ankers und des Menüs (Icon-Plan November 2026, Schritt 3). Bis
// dahin zeichneten main.jsx (`bottomIcon`) und MobileNav (`linie`) sie je selbst. Dieselben
// Linien, jetzt hier, in der Strichstärke der übrigen Zeichen.
const _linie = (...pfade) => () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  ...pfade.map((d, i) => React.createElement('path', { key: i, d })));
// Übersicht = Schweizer Sackmesser, generisch, ohne Kreuz (icon-dictionary.md). Ruhende Form;
// die Leiste klappt die Werkzeuge mit `SackmesserIcon` in main.jsx aus.
const _sackmesser = _linie('M8 9 H15 A3 3 0 0 1 15 15 H8 A3 3 0 0 1 8 9 Z M15 10 L21 4 M15 14 L20 18.5');
const _rucksack = _linie('M6 8a6 6 0 0 1 12 0v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z', 'M9 8a3 3 0 0 1 6 0', 'M9 14h6');
// «Was steht mir zu?» — in Leiste, Menü und Register dasselbe Geschenk.
const _geschenk = _linie('M3 8 H21 V12 H3 Z M5 12 V20 H19 V12 M12 8 V20 M12 8 C 12 5 9.5 4 8.5 5.5 C 7.6 7 10 8 12 8 C 14 8 16.4 7 15.5 5.5 C 14.5 4 12 5 12 8');
const _plus = _linie('M12 5 V19 M5 12 H19');
const _quittung = _linie('M6 3 H18 V21 L15 19 L12 21 L9 19 L6 21 Z M9 9 H15 M9 13 H15');
const _menue = _linie('M4 7 H20 M4 12 H20 M4 17 H20');

// Kopfzeile und Barrierefreiheits-Leiste (Schritt 3): bis 06.11.2026 von Hand in main.jsx.
const _settings = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('circle', { cx: '12', cy: '12', r: '3' }),
  React.createElement('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' })
);
const _globe = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinejoin: 'round' },
  React.createElement('circle', { cx: '12', cy: '12', r: '8.5' }),
  React.createElement('path', { d: 'M 3.5 12 H 20.5', strokeWidth: '1.4' }),
  React.createElement('path', { d: 'M 12 3.5 C 15.2 6.2 15.2 17.8 12 20.5 C 8.8 17.8 8.8 6.2 12 3.5 Z', strokeWidth: '1.4' }),
);
const _lautsprecher = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M4 9 h3 l5 -4 v14 l-5 -4 h-3 Z' }),
  React.createElement('path', { d: 'M16 9 a5 5 0 0 1 0 6' })
);
const _raster = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinejoin: 'round' },
  React.createElement('rect', { x: '3', y: '3', width: '8', height: '8', rx: '2' }),
  React.createElement('rect', { x: '13', y: '3', width: '8', height: '8', rx: '2' }),
  React.createElement('rect', { x: '3', y: '13', width: '8', height: '8', rx: '2' }),
  React.createElement('rect', { x: '13', y: '13', width: '8', height: '8', rx: '2' })
);
const _kontrast = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
  React.createElement('circle', { cx: '12', cy: '12', r: '9', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }),
  React.createElement('path', { d: 'M12 3a9 9 0 0 1 0 18z', fill: 'currentColor' })
);
const _farbsicher = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6' },
  React.createElement('circle', { cx: '8.5', cy: '9', r: '5', fill: 'currentColor', stroke: 'none' }),
  React.createElement('rect', { x: '10.5', y: '11', width: '9', height: '9', rx: '1.5' })
);
const _bewegung = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round' },
  React.createElement('circle', { cx: '7', cy: '12', r: '2.2', fill: 'currentColor', stroke: 'none' }),
  React.createElement('path', { d: 'M12 8.5a5 5 0 0 1 0 7' }),
  React.createElement('path', { d: 'M15 6a9 9 0 0 1 0 12' })
);
const _hand = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M15 11V5.5a1.5 1.5 0 0 0-3 0V11' }),
  React.createElement('path', { d: 'M12 10.5V4a1.5 1.5 0 0 0-3 0v7' }),
  React.createElement('path', { d: 'M9 11V6.5a1.5 1.5 0 0 0-3 0V14' }),
  React.createElement('path', { d: 'M6 12.5l-1.6-1.6a1.4 1.4 0 0 0-2 2L6 18a5 5 0 0 0 4.5 3H13a5 5 0 0 0 5-5v-4a1.5 1.5 0 0 0-3 0' })
);

// ═══════════════════════════════════════════════════════════════
// Icon Registry
// ═══════════════════════════════════════════════════════════════
//
// Nur der Kern — die übrigen Icons trägt `IconSystem.jsx` bei (siehe Kopf).

const _iconFactories = {
  // Chapter icons
  basis: _basis,
  wohnen: _wohnen,
  finanzen: _finanzen,
  versicherungen: _versicherungen,
  ausbildung: _ausbildung,
  behoerden: _behoerden,
  notfall: _notfall,
  herzPuls: _herzPuls,

  // Extended chapter icons
  dokumentTresor: _dokumentTresor,
  ordner: _ordner,
  budgetWallet: _budgetWallet,
  praemienverbilligung: _praemienverbilligung,
  lebenslauf: _lebenslauf,
  vorsorge: _vorsorge,

  // Feature icons
  upload: _upload,
  document: _document,
  download: _download,
  sicherung: _sicherung,
  check: _check,
  kaestchen: _kaestchen,
  kreuz: _kreuz,
  warning: _warning,
  money: _money,
  health: _health,
  calendar: _calendar,
  search: _search,

  // Semantic icons
  home: _home,
  insurance: _insurance,
  documents: _documents,
  budget: _budget,
  family: _family,
  heart: _heart,
  info: _info,
  external: _external,
  pfeil: _pfeil,
  chevron: _chevron,
  cowbell: _cowbell,
  leaf: _leaf,

  // Boden-Anker und Menü (Schritt 3)
  sackmesser: _sackmesser,
  rucksack: _rucksack,
  geschenk: _geschenk,
  plus: _plus,
  quittung: _quittung,
  menue: _menue,

  // Kopfzeile und Barrierefreiheit (Schritt 3)
  settings: _settings,
  globe: _globe,
  lautsprecher: _lautsprecher,
  raster: _raster,
  kontrast: _kontrast,
  farbsicher: _farbsicher,
  bewegung: _bewegung,
  hand: _hand,
};


// iOS Safari collapses an <svg> that has a viewBox but no explicit width/height
// to 0×0 inside flex containers, so icons disappeared on iPhones while desktop
// Chrome rendered them fine. Wrap every factory so the returned SVG always fills
// its (already sized) parent wrapper on all browsers.
//
// Hier, nicht erst in `<Icon>`, steht auch `aria-hidden`: zehn Stellen rufen die
// Fabrik direkt (`IconFn()` in Dashboard, MobileNav, Baum3D …) und bekamen den
// Schirm nie. Die Kapitel-Zeichen tragen <text> — «HELVETIA», «5 FR.», «2026» —,
// und ein Screenreader las sie am 24.09. 17-mal als Wörter vor, mitten in
// Knopfnamen wie «Pensionierung … HELVETIA». Wächter: iconsVersteckt.test.js.
const fuellend = (fn) => () => React.cloneElement(fn(), {
  width: '100%', height: '100%', 'aria-hidden': 'true', focusable: 'false',
});

export const Icons = Object.fromEntries(
  Object.entries(_iconFactories).map(([key, fn]) => [key, fuellend(fn)])
);

// Die Namen, die der fest geladene Teil kennt — festgehalten, BEVOR `IconSystem.jsx`
// das Register ergänzt. Für den Wächter, nicht für die Laufzeit.
export const KERN_NAMEN = Object.freeze(Object.keys(Icons));

// Von `IconSystem.jsx` aufgerufen: die übrigen Icons in dasselbe Objekt einhängen.
// Dasselbe Objekt, damit `Icon`, `hinweisZeichen` & Co. EINE Quelle bleiben.
export const zeichenErgaenzen = (fabriken) => {
  for (const [key, fn] of Object.entries(fabriken)) Icons[key] = fuellend(fn);
};

// ═══════════════════════════════════════════════════════════════
// Icon Component — the preferred way to render icons
// ═══════════════════════════════════════════════════════════════
// Wraps any icon key with proper sizing, color inheritance,
// and aria-hidden for accessibility (all icons are decorative).

// Strich nach Grösse (Icon-Plan November 2026, Schritt 4). ICON_KONVENTION.md: «Massstab ist die
// optische Strichstärke am Renderpunkt, nicht dieselbe Zahl» — Ziel 1,1–1,4 px. Ein Strich-Icon
// (Wurzel `fill: none` mit `stroke`) bekommt darum seine Strichstärke aus der Grösse: bei 14 px
// 2,4, bei 22 px 1,52, bei 32 px 1,05 — optisch überall rund 1,4 px. Kinder mit eigener Stärke
// behalten sie; Flächen-Icons bleiben, wie sie gezeichnet sind. Wächter: strichNachGroesse.test.js.
// 1,4 = obere Grenze der Konvention, gewählt von Stebler Studios am 06.11.2026 («Kräftiger (1,4)»)
// statt 1,25 — die Seitentitel-Icons bei 22 px sollten nicht zu fein werden. Abgerundet, damit
// die Grenze nie überschritten wird.
const ZIEL_STRICH_PX = 1.4;
export const strichFuer = (px) => Math.floor((ZIEL_STRICH_PX * 24 / px) * 100) / 100;
const mitStrichNachGroesse = (el, px) => (
  typeof px === 'number' && px > 0 && el.props.fill === 'none' && el.props.stroke
    ? React.cloneElement(el, { strokeWidth: strichFuer(px) })
    : el
);

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
  }, mitStrichNachGroesse(IconFn(), size));
};

// ═══════════════════════════════════════════════════════════════
// Hinweis-Zeichen — der Ersatz für rohe Glyphen vor einem Text
// ═══════════════════════════════════════════════════════════════
// Vorher stand vor Hinweisen eine rohe Glyphe, per `+` an den Text geklebt:
//
//     React.createElement('p', { … }, 'ⓘ ' + t('trust.localOnly'))
//
// Das hat zwei Nachteile, und beide sind echt:
//   1. Geklebt heisst UNABSCHIRMBAR. Ein Zeichen in einem eigenen Knoten kann
//      `aria-hidden` tragen; eines mitten im Text nicht. Ein Screenreader liest
//      deshalb bei jedem Hinweis den Zeichennamen mit — auf einer Kapitelseite
//      bis zu 28 Mal.
//   2. `ⓘ` rendert auf jedem System anders (Schriftfamilie, Gewicht, Grundlinie).
//      Die Piktogramme tun das nicht — sie sind unsere eigenen Pfade.
//
// `HinweisZeichen` ersetzt die Glyphe durch ein Piktogramm, das `Icon` bereits
// mit `aria-hidden` liefert. Die Masse stammen aus dem Muster, das in
// `SozialhilfeView.jsx` schon vorher so gebaut war (`praefix`).
//
// Aufruf als eigenes Kind, NICHT in den Text konkateniert — sonst ist der
// Gewinn wieder weg:
//
//     React.createElement('p', { … }, hinweisZeichen(), t('trust.localOnly'))
//
export const HinweisZeichen = ({ name = 'info', size = 14 }) =>
  React.createElement(Icon, { name, size, style: { verticalAlign: '-3px', marginRight: '4px' } });

// Text mit Haken davor, wenn etwas erledigt ist — sonst nur der Text. Bündelt
// ein Muster, das an sechs Stellen als `(erledigt ? '✓ ' : '') + text` stand.
export const erledigtZeichen = (erledigt, text, offenIkon) => React.createElement(
  React.Fragment, null,
  erledigt ? hinweisZeichen('check') : (offenIkon ? hinweisZeichen(offenIkon) : null),
  text,
);

// Aufklapp-Zeichen: ein Chevron, liegend oder stehend. `▸` und `▾` waren an
// 29 Stellen zwei rohe Dreiecke für EINE Sache — offen oder zu. Ein Zeichen plus
// eine Drehung hält beide Zustände sichtbar zusammen, und die Drehung kostet nichts.
//
// Bewusst ein CHEVRON und nicht der gedrehte `pfeil`: ein Pfeil hat einen Schaft
// und liest sich gedreht als «↓ herunterladen», nicht als «aufklappen». Im Test
// stand neben der Sprachwahl «DE↓». Ein Chevron ist nur die Spitze und meint
// genau die Richtung, in die es weitergeht.
export const aufklappZeichen = (offen, size = 12) => React.createElement(Icon, {
  name: 'chevron', size,
  style: { verticalAlign: '-1px', marginRight: '4px', transform: offen ? 'rotate(90deg)' : 'none' },
});

// Zurück-Zeichen: derselbe Pfeil, gespiegelt. Ein zweites Icon wäre ~50 Byte für
// dieselbe Form in die andere Richtung — `scaleX(-1)` kostet nichts und hält die
// beiden Richtungen sichtbar als EIN Zeichen zusammen.
export const zurueckZeichen = (size = 14) => React.createElement(Icon, {
  name: 'pfeil', size, style: { verticalAlign: '-3px', marginRight: '4px', transform: 'scaleX(-1)' },
});

// Kurzform für die Aufrufstellen — spart an 100+ Stellen je ein `React.createElement`.
export const hinweisZeichen = (name, size, key) =>
  React.createElement(HinweisZeichen, { name, size, key });

// ═══════════════════════════════════════════════════════════════
export default Icons;
