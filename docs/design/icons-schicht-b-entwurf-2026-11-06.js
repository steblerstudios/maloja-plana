// Neue Strich-Fassungen, Schicht B (Icon-Plan Schritt 5) — Entwurf zur Abnahme.
// Konvention: viewBox 24, fill none, stroke currentColor, runde Enden; Punkte als kleine Fläche.
const P = (d) => `<path d="${d}"/>`;
const C = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
const PUNKT = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="1.1" fill="currentColor" stroke="none"/>`;
module.exports = {
  info:     C(12,12,9) + P('M12 11 V16.5') + PUNKT(12, 7.8),
  warning:  P('M10.3 5 a2 2 0 0 1 3.4 0 l7 12 a2 2 0 0 1 -1.7 3 H5 a2 2 0 0 1 -1.7 -3 Z') + P('M12 10 V13.5') + PUNKT(12, 16.6),
  success:  C(12,12,9) + P('M8.2 12.4 L11 15.2 L16 9.6'),
  error:    C(12,12,9) + P('M9.2 9.2 L14.8 14.8 M14.8 9.2 L9.2 14.8'),
  delete:   P('M4.5 7 H19.5') + P('M9.5 7 V5 a1 1 0 0 1 1 -1 h3 a1 1 0 0 1 1 1 V7') + P('M6.5 7 L7.4 19.2 a1.5 1.5 0 0 0 1.5 1.3 h6.2 a1.5 1.5 0 0 0 1.5 -1.3 L17.5 7') + P('M10.3 11 V16.5 M13.7 11 V16.5'),
  filter:   P('M4 5 H20 L14 12.5 V18.5 L10 20.5 V12.5 Z'),
  phone:    P('M7.2 3.5 h2.6 l1.4 3.8 -1.9 1.5 a11 11 0 0 0 5.9 5.9 l1.5 -1.9 3.8 1.4 v2.6 a2 2 0 0 1 -2.2 2 A16.5 16.5 0 0 1 5.2 5.7 a2 2 0 0 1 2 -2.2 Z'),
  debt:     C(12,12,9) + P('M8 12 H16'),
  csv:      P('M6 3 H14 L19 8 V20 a1 1 0 0 1 -1 1 H6 a1 1 0 0 1 -1 -1 V4 a1 1 0 0 1 1 -1 Z') + P('M14 3 V8 H19') + P('M8 12.5 H16 M8 16 H16 M11.5 11 V18.5'),
  qr:       `<rect x="3.5" y="3.5" width="6" height="6" rx="1"/><rect x="14.5" y="3.5" width="6" height="6" rx="1"/><rect x="3.5" y="14.5" width="6" height="6" rx="1"/>` + '<rect x="14.5" y="14.5" width="2.5" height="2.5" rx="0.6"/><rect x="18" y="14.5" width="2.5" height="2.5" rx="0.6"/><rect x="16.25" y="18" width="2.5" height="2.5" rx="0.6"/>',
  barcode:  P('M5 5.5 V18.5 M8.5 5.5 V18.5 M11 5.5 V18.5 M14.5 5.5 V18.5 M17 5.5 V18.5 M19.5 5.5 V18.5'),
  timeline: C(6,6,1.8) + C(6,12,1.8) + C(6,18,1.8) + P('M6 7.8 V10.2 M6 13.8 V16.2') + P('M11 6 H19 M11 12 H17 M11 18 H18.5'),
  document: P('M6 3 H14 L19 8 V20 a1 1 0 0 1 -1 1 H6 a1 1 0 0 1 -1 -1 V4 a1 1 0 0 1 1 -1 Z') + P('M14 3 V8 H19') + P('M8.5 13 H15.5 M8.5 16.5 H13.5'),
};
