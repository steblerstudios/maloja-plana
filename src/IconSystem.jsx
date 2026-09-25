import React from 'react';
import { zeichenErgaenzen } from './IconKern.jsx';

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
  // Second hand — generisch (KEIN roter SBB/Mondaine-Lollipop; Schutzrecht)
  React.createElement('line', { x1: '12', y1: '11.5', x2: '12', y2: '16.5', stroke: '#C4A870', strokeWidth: '0.6', strokeLinecap: 'round' }),
  // Center cap
  React.createElement('circle', { cx: '12', cy: '12', r: '1.2' }),
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
  // (kein Emblem auf dem Griff — generisches Sackmesser, KEIN Victorinox-Kreuz; Schutzrecht)
  // Export arrow
  React.createElement('path', { d: 'M 4.5 18.5 L 7.5 21.5', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' }),
  React.createElement('polyline', { points: '5,21.5 7.5,21.5 7.5,19', fill: 'none', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round', strokeLinejoin: 'round' }),
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

const _barcode = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('rect', { x: '3', y: '4', width: '2', height: '14' }),
  React.createElement('rect', { x: '7', y: '4', width: '1', height: '14' }),
  React.createElement('rect', { x: '10', y: '4', width: '2', height: '14' }),
  React.createElement('rect', { x: '14', y: '4', width: '1', height: '14' }),
  React.createElement('rect', { x: '17', y: '4', width: '2', height: '14' }),
  React.createElement('rect', { x: '21', y: '4', width: '1', height: '14' }),
  React.createElement('line', { x1: '3', y1: '21', x2: '22', y2: '21', stroke: 'currentColor', strokeWidth: '1.5' })
);

const _delete = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 5 7 L 7 7 L 7 20 Q 7 21 8 21 L 16 21 Q 17 21 17 20 L 17 7 L 19 7' }),
  React.createElement('rect', { x: '3', y: '5', width: '18', height: '2', rx: '1' }),
  React.createElement('path', { d: 'M 9 5 L 9 3 Q 9 2 10 2 L 14 2 Q 15 2 15 3 L 15 5' }),
  React.createElement('line', { x1: '10', y1: '10', x2: '10', y2: '17', stroke: 'white', strokeWidth: '1.5', strokeLinecap: 'round' }),
  React.createElement('line', { x1: '14', y1: '10', x2: '14', y2: '17', stroke: 'white', strokeWidth: '1.5', strokeLinecap: 'round' })
);

// Drei schlichte Outline-Präfixe (je EIN Element, Bundle-Budget) — ersetzen die rohen
// Text-Glyphen ◰ □ ✕ vor Titeln/Knöpfen (docs/TODO.md §G3 P1, docs/ICON_KONVENTION.md).
// Rechner/Aufstellung — Berechnungs-Abschnitte (SKOS, IPV, EL, Zahlungsplan).
const _rechner = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM8.5 7.5h7M8.5 12h7M8.5 16.5h4' })
);

// Mappe — ein Dossier / eine Unterlagen-Sammlung (Finanz-Übersicht → Behördendossier).
const _mappe = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z' })
);

// Drucker — Druckansicht (Finanz-Übersicht). Mappe + Drucker ersetzen dort die rohe
// Glyphe ◇ (docs/TODO.md §G3 P1); je EIN Element, wie die drei Präfixe oben (Bundle-Budget).
const _drucker = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('path', { d: 'M7 9V4h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v6H7Z' })
);

// Übersicht / Dashboard — Schweizer Sackmesser («alle Werkzeuge an einem Ort»)
// Generisch (kein Victorinox-Kreuz, kein Export-Pfeil; Schutzrecht).
const _dashboard = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('rect', { x: '4', y: '9', width: '16', height: '6', rx: '3', fill: 'currentColor' }),
  React.createElement('path', { d: 'M 16 9 L 21 3 L 21.5 3.8 L 17.5 9.5', fill: 'currentColor', opacity: '0.8' }),
  React.createElement('path', { d: 'M 16 15 L 20 19.5 L 19.3 20 L 15.5 15.5', fill: 'currentColor', opacity: '0.6' }),
  React.createElement('circle', { cx: '16.5', cy: '12', r: '1.2', fill: 'white', opacity: '0.5' })
);

// Sauberes Outline-Zahnrad (statt gefüllter Sternexplosion) — Kontur passt zum
// Nav-Stil, und ein Zahnrad liest sich klar als Einstellungen (Stebler Studios, Icon-Audit).
const _settings = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('circle', { cx: '12', cy: '12', r: '3' }),
  React.createElement('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' })
);

const _csv = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 6 2 L 6 22 L 18 22 L 18 8 L 12 2 Z' }),
  React.createElement('path', { d: 'M 12 2 L 12 8 L 18 8', fill: 'none', stroke: 'white', strokeWidth: '1' }),
  React.createElement('text', { x: '12', y: '17', textAnchor: 'middle', fontSize: '7', fill: 'white', fontWeight: '600' }, 'CSV')
);

const _debt = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
  React.createElement('line', { x1: '8', y1: '12', x2: '16', y2: '12', stroke: 'white', strokeWidth: '2.5', strokeLinecap: 'round' })
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
const _handy = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinecap: 'round', strokeLinejoin: 'round' },
  React.createElement('rect', { x: '6.5', y: '2.5', width: '11', height: '19', rx: '2' }),
  React.createElement('path', { d: 'M11 18.5h2' })
);

const _phone = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  React.createElement('path', { d: 'M 5 2 L 9 2 L 11 7 L 8 9 Q 10 14 14 16 L 16 13 L 21 15 L 21 19 Q 21 22 17 22 Q 5 20 2 8 Q 2 4 5 2 Z' })
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
const _globe = () => React.createElement('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.6', strokeLinejoin: 'round' },
  React.createElement('circle', { cx: '12', cy: '12', r: '8.5' }),
  React.createElement('path', { d: 'M 3.5 12 H 20.5', strokeWidth: '1.4' }),
  React.createElement('path', { d: 'M 12 3.5 C 15.2 6.2 15.2 17.8 12 20.5 C 8.8 17.8 8.8 6.2 12 3.5 Z', strokeWidth: '1.4' }),
);

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
  kalenderUhr: _kalenderUhr,
  schulden: _schulden,
  steuern: _steuern,
  organspende: _organspende,
  chartsSchoko: _chartsSchoko,
  exportTool: _exportTool,
  mietzinsverbilligung: _mietzinsverbilligung,
  sozialhilfe: _sozialhilfe,
  ergaenzungsleistungen: _ergaenzungsleistungen,
  barcode: _barcode,
  delete: _delete,
  rechner: _rechner,
  mappe: _mappe,
  drucker: _drucker,
  dashboard: _dashboard,
  settings: _settings,
  csv: _csv,
  debt: _debt,
  filter: _filter,
  success: _success,
  error: _error,
  qr: _qr,
  dentist: _dentist,
  doctor: _doctor,
  timeline: _timeline,
  emergency: _emergency,
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
  globe: _globe,
  tag: _tag,
  paw: _paw,
  palette: _palette,
});

export { Icons, Icon, HinweisZeichen, erledigtZeichen, aufklappZeichen, zurueckZeichen, hinweisZeichen } from './IconKern.jsx';
export { default } from './IconKern.jsx';
