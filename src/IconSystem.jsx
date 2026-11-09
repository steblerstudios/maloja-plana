import React from 'react';
import { zeichenErgaenzen, nachgeladen } from './IconKern.jsx';
import { SEITEN_BEREICH, seitenZeichenName } from './config/ansichtenRegister.js';
import { basisFamilie as _basisFamilie, helm as _helm } from './IconMuenzen.jsx';
import { EREIGNIS_PFADE } from './data/ereignisZeichen.js';

// ─── Maloja Plana SVG Pictogram System — das volle Register ─
//
// Die Gestaltungsregeln und der Kern stehen in `IconKern.jsx`. Hier stehen die Icons,
// die der fest geladene Teil nicht braucht; beim Laden dieser Datei hängen sie sich in
// dasselbe `Icons`-Objekt ein. Aufgeteilt am 24.09.2026 (E36, 65-kB-Deckel).
//
// Für alle nachgeladenen Ansichten bleibt diese Datei der Einstieg: sie liefert
// dieselben Exporte wie bisher (`Icons`, `Icon`, `hinweisZeichen` …) — mit allen Icons.
// 🛑 Nicht aus einer fest geladenen Datei importieren: das zöge das ganze Register
// zurück in die Startdatei (size-limit schlägt an).
//
// Neues Icon: hierher, ausser der fest geladene Teil zeigt es — dann in den Kern.


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

// Ergänzungsleistungen (EL): Metapher „Aufstockung bis zum anerkannten Bedarf".
// Solide Basis-Säule (eigene Mittel) + Umriss-Segment mit Aufwärtspfeil (die
// Ergänzung) reicht bis zur Bedarfslinie oben. Bewusst KEINE Almosen-Bildsprache
// (kein Bettel/keine offene Hand) — würdevolle Aufstockung, nicht Bittstellung.
const _ergaenzungsleistungen = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  // Bedarfslinie (anerkannter Bedarf) — das Ziel, bis zu dem aufgestockt wird
  React.createElement('line', { x1: '3', y1: '5', x2: '21', y2: '5', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round' }),
  // Eigene Mittel: solide Basis-Säule
  React.createElement('rect', { x: '8.5', y: '13', width: '7', height: '8', rx: '1' }),
  // Ergänzung: Umriss-Segment, das die Lücke bis zur Bedarfslinie füllt
  React.createElement('rect', { x: '8.5', y: '6.5', width: '7', height: '6', rx: '1', fill: 'none', stroke: 'currentColor', strokeWidth: '1.4' }),
  // Aufstock-Pfeil nach oben, innerhalb des Ergänzungs-Segments
  React.createElement('line', { x1: '12', y1: '11.5', x2: '12', y2: '8', stroke: 'currentColor', strokeWidth: '1.4', strokeLinecap: 'round' }),
  React.createElement('polyline', { points: '10,9.8 12,7.6 14,9.8', fill: 'none', stroke: 'currentColor', strokeWidth: '1.4', strokeLinecap: 'round', strokeLinejoin: 'round' }),
);

const _barcode = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M5 5.5 V18.5 M8.5 5.5 V18.5 M11 5.5 V18.5 M14.5 5.5 V18.5 M17 5.5 V18.5 M19.5 5.5 V18.5' })
);

const _delete = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M4.5 7 H19.5' }),
  React.createElement('path', { d: 'M9.5 7 V5 a1 1 0 0 1 1 -1 h3 a1 1 0 0 1 1 1 V7' }),
  React.createElement('path', { d: 'M6.5 7 L7.4 19.2 a1.5 1.5 0 0 0 1.5 1.3 h6.2 a1.5 1.5 0 0 0 1.5 -1.3 L17.5 7' }),
  React.createElement('path', { d: 'M10.3 11 V16.5 M13.7 11 V16.5' })
);


// Schlichte Outline-Präfixe (je EIN Element, Bundle-Budget) — ersetzten die rohen Text-Glyphen
// ◰ □ ✕ vor Titeln/Knöpfen (docs/TODO.md §G3 P1, docs/ICON_KONVENTION.md).
// «mappe» ist am 06.11.2026 in «ordner» aufgegangen (Icon-Plan, Entscheid E2): beide waren
// derselbe Ordner. Dossiers tragen das Zeichen ihres Themas (Behörden = Waage, Notfall = Kreuz).
// «rechner» (zeichnete ein Blatt) ist im selben Aufräumen in «document» aufgegangen; ein echter
// Rechner wird erst gezeichnet (Icon-Plan, Schritt 8). «dashboard» (gefülltes Sackmesser) ist in
// «sackmesser» aufgegangen, «emergency» (zweite Glocke) entfällt — Notfall ist das Kreuz,
// Erinnerungen die Kuhglocke.

// Drucker — Druckansicht (Finanz-Übersicht). Mappe + Drucker ersetzen dort die rohe
// Glyphe ◇ (docs/TODO.md §G3 P1); je EIN Element, wie die drei Präfixe oben (Bundle-Budget).
const _drucker = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M7 9V4h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v6H7Z' })
);


// Sauberes Outline-Zahnrad (statt gefüllter Sternexplosion) — Kontur passt zum
// Nav-Stil, und ein Zahnrad liest sich klar als Einstellungen (Stebler Studios, Icon-Audit).

const _csv = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M6 3 H14 L19 8 V20 a1 1 0 0 1 -1 1 H6 a1 1 0 0 1 -1 -1 V4 a1 1 0 0 1 1 -1 Z' }),
  React.createElement('path', { d: 'M14 3 V8 H19' }),
  React.createElement('path', { d: 'M8 12.5 H16 M8 16 H16 M11.5 11 V18.5' })
);

const _debt = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('circle', { cx: '12', cy: '12', r: '9' }),
  React.createElement('path', { d: 'M8 12 H16' })
);

const _filter = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M4 5 H20 L14 12.5 V18.5 L10 20.5 V12.5 Z' })
);


const _error = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('circle', { cx: '12', cy: '12', r: '9' }),
  React.createElement('path', { d: 'M9.2 9.2 L14.8 14.8 M14.8 9.2 L9.2 14.8' })
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

const _timeline = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('circle', { cx: '6', cy: '6', r: '1.8' }),
  React.createElement('circle', { cx: '6', cy: '12', r: '1.8' }),
  React.createElement('circle', { cx: '6', cy: '18', r: '1.8' }),
  React.createElement('path', { d: 'M6 7.8 V10.2 M6 13.8 V16.2' }),
  React.createElement('path', { d: 'M11 6 H19 M11 12 H17 M11 18 H18.5' })
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

// Smartphone — «Auf den Startbildschirm legen» (Karte im Bergpanorama und Menü, 25.09.2026).
// Vorher zeigte das Menü den Telefonhörer («anrufen») und die Karte am Computer einen Bildschirm.
// Handy = das Gerät (Punkt 9, Entscheid 07.11.): deutlich gezeichnet — Rahmen, Bildschirmkanten, Taste.
const _handy = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('rect', { x: '6.5', y: '2.5', width: '11', height: '19', rx: '2.2' }),
  React.createElement('path', { d: 'M6.5 6h11M6.5 17.5h11' }),
  React.createElement('path', { d: 'M11 19.8h2' }),
);


const _phone = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M7.2 3.5 h2.6 l1.4 3.8 -1.9 1.5 a11 11 0 0 0 5.9 5.9 l1.5 -1.9 3.8 1.4 v2.6 a2 2 0 0 1 -2.2 2 A16.5 16.5 0 0 1 5.2 5.7 a2 2 0 0 1 2 -2.2 Z' })
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

// Globus — Digital & Privatsphäre (Kreis + Äquator + Meridian).

// Tag — Konsum & Medien (Preisschild mit Loch).
const _tag = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M 4 12 L 12 4 H 20 V 12 L 12 20 Z' }),
  React.createElement('circle', { cx: '16', cy: '8', r: '1.4' }),
);

// Pfote — Tiere & Assistenz (Ballen + vier Zehen).
const _paw = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinejoin: 'round' },
  React.createElement('circle', { cx: '6.8', cy: '11', r: '1.7' }),
  React.createElement('circle', { cx: '10.2', cy: '7.3', r: '1.7' }),
  React.createElement('circle', { cx: '13.8', cy: '7.3', r: '1.7' }),
  React.createElement('circle', { cx: '17.2', cy: '11', r: '1.7' }),
  React.createElement('path', { d: 'M 8.5 16 C 8.5 13.3 15.5 13.3 15.5 16 C 15.5 19 13.3 20.8 12 20.8 C 10.7 20.8 8.5 19 8.5 16 Z' }),
);

// Palette — Kunst & Handwerk (Malpalette mit Farbtupfern).
const _palette = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none' },
  React.createElement('path', { d: 'M 12 3.5 C 17.8 3.5 21 7 21 11 C 21 13 19.5 13.8 18.2 13.8 C 17.2 13.8 16.5 14.5 16.5 15.5 C 16.5 16.8 17.4 17.2 17.4 18.4 C 17.4 19.7 15.6 20.5 12 20.5 C 6.8 20.5 3 16.6 3 12 C 3 7 7 3.5 12 3.5 Z', stroke: 'currentColor', strokeWidth: '1.5', strokeLinejoin: 'round' }),
  React.createElement('circle', { cx: '7.8', cy: '10.6', r: '1', fill: 'currentColor' }),
  React.createElement('circle', { cx: '11', cy: '7.8', r: '1', fill: 'currentColor' }),
  React.createElement('circle', { cx: '14.6', cy: '8.6', r: '1', fill: 'currentColor' }),
  React.createElement('circle', { cx: '7.6', cy: '14.6', r: '1', fill: 'currentColor' }),
);

// ═══════════════════════════════════════════════════════════════
// Ergänzung des Registers
// ═══════════════════════════════════════════════════════════════
// 🛑 Nicht jedes Icon hier hat schon einen Einsatz — und das ist kein toter Code.
// Stand 24.09.2026 ohne Verwendung, aber gestaltetes Marken-Vokabular aus
// docs/brand/icon-dictionary.md: `kalenderUhr` (Bahnhofsuhr, geplant für
// Frist/Zeit), `mietzinsverbilligung` (Chalet + Pfeil, Leitform Haus),
// `exportTool` (Sackmesser-Gestalt), `delete`, `filter` (Trichter).
// Stebler Studios hat entschieden: behalten. Nur auf Zuruf entfernen.
zeichenErgaenzen({
  schulden: _schulden,
  steuern: _steuern,
  organspende: _organspende,
  chartsSchoko: _chartsSchoko,
  mietzinsverbilligung: _mietzinsverbilligung,
  sozialhilfe: _sozialhilfe,
  ergaenzungsleistungen: _ergaenzungsleistungen,
  barcode: _barcode,
  delete: _delete,
  drucker: _drucker,
  csv: _csv,
  debt: _debt,
  filter: _filter,
  error: _error,
  dentist: _dentist,
  doctor: _doctor,
  timeline: _timeline,
  mobility: _mobility,
  work: _work,
  selfEmployment: _selfEmployment,
  contacts: _contacts,
  legal: _legal,
  edit: _edit,
  phone: _phone,
  handy: _handy,
  recurring: _recurring,
  lock: _lock,
  tag: _tag,
  paw: _paw,
  palette: _palette,
  basisFamilie: _basisFamilie,
  helm: _helm,
});

// Lebensereignisse (Gruppe E, Icon-Plan Schritt 7b): ein Zeichen je Ereignis, dasselbe im
// Rucksack, in der Suche, in der Übersicht und im Seitentitel. Strich wie die Funktions-Icons.
zeichenErgaenzen(Object.fromEntries(Object.entries(EREIGNIS_PFADE).map(([name, pfade]) => [name, () =>
  React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
    ...pfade.map((d, i) => React.createElement('path', { key: i, d })))])));

// Seiten-Zeichen (Icon-Plan, Bauplan B4): Leitform + Abzeichen je Seite, nachgeladen.
zeichenErgaenzen(Object.fromEntries([...SEITEN_BEREICH].map(([view, bereich]) =>
  [seitenZeichenName(view), () => nachgeladen('seite', { view, bereich })])));

export { Icons, Icon, HinweisZeichen, erledigtZeichen, aufklappZeichen, zurueckZeichen, hinweisZeichen } from './IconKern.jsx';
export { default } from './IconKern.jsx';
