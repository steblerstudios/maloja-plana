import React, { useState, useId } from 'react';
import { text, weight, space, leading } from '../config/tokens.js';
import { renderSource } from '../utils/renderSource.js';
import { ExternerLink } from './ExternerLink.jsx';
import { knopfStil } from './PrimaryButton.jsx';

// Belege zum Aufklappen (Fassung 9, Zitierregel Stufe 1, Stebler Studios 05.11.2026: Skizze C + D,
// «Ja, Stufe 1»). Liest eine bestehende, übersetzte Quellenzeile der Form
//   «Quellen: [[ZGB Art. 97|https://…]], [[DBG Art. 9|https://…]] (geprüft im September 2026).»
// und zeigt sie als leise Zeile «▸ Quellen (2) · geprüft im September 2026», aufgeklappt als
// nummerierte Liste. Keine neuen Texte: Vorwort und Datum stammen aus der Zeile selbst, in jeder
// Sprache. Passt eine Zeile nicht in diese Form (Erklärsatz, Disclaimer, Klartext), bleibt sie
// unverändert als Zeile stehen — nichts geht verloren. Im Druck ist die Liste immer offen
// (print.css, .mp-belege-liste). Wächter: src/__tests__/zitierform.test.js.

const LINK = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;
const FORM = /^([^[\]:]{2,30}):\s*((?:\[\[[^\]]+\]\](?:,\s*|\s+und\s+|\s+et\s+|\s+e\s+|\s+and\s+|\s+·\s+)?)+)\s*(\(([^()]+)\))?\.?$/;

// Zerlegt eine Quellenzeile. Gibt null zurück, wenn sie nicht der Form entspricht.
export const zerlegeBelege = (zeile) => {
  if (typeof zeile !== 'string') return null;
  const m = zeile.trim().match(FORM);
  if (!m) return null;
  const links = [...m[2].matchAll(LINK)].map(([, label, ziel]) => ({
    label: label.trim(), href: /^https?:\/\//.test(ziel.trim()) ? ziel.trim() : 'https://' + ziel.trim(),
  }));
  return links.length ? { vorwort: m[1].trim(), links, datum: m[4] ? m[4].trim() : '' } : null;
};

export const Belege = ({ palette, t, zeile, style }) => {
  const [offen, setOffen] = useState(false);
  const id = useId();
  const b = zerlegeBelege(zeile);
  const grund = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, ...style };
  if (!b) return React.createElement('div', { 'data-belege': 'zeile', style: grund }, renderSource(zeile, null, t));
  return React.createElement('div', { 'data-belege': 'liste', style: grund },
    React.createElement('button', {
      type: 'button', 'aria-expanded': offen, 'aria-controls': id, onClick: () => setOffen(!offen),
      style: { ...knopfStil(palette, 'leise'), fontSize: text.xs, minHeight: '44px', padding: 0, gap: '6px', justifyContent: 'flex-start' },
    },
      // Gezeichneter Pfeil statt Zeichen ▸/▾ (Höchststand Piktogramme, glyphenImText.test.js).
      React.createElement('span', { 'aria-hidden': 'true', style: {
        width: '6px', height: '6px', borderRight: '1.5px solid currentColor', borderBottom: '1.5px solid currentColor',
        transform: offen ? 'rotate(45deg)' : 'rotate(-45deg)', margin: offen ? '0 2px 3px' : '0 3px 0 0', flexShrink: 0,
      } }),
      b.vorwort + ' (' + b.links.length + ')'),
    b.datum && React.createElement('span', { style: { color: palette.mid } }, ' · ' + b.datum),
    React.createElement('ol', {
      id, className: 'mp-belege-liste', hidden: !offen,
      style: { margin: '0 0 ' + space.xs + 'px', paddingLeft: '20px', color: palette.text, fontWeight: weight.normal },
    }, b.links.map((l, i) => React.createElement('li', { key: i, style: { margin: '2px 0' } },
      React.createElement(ExternerLink, { t, href: l.href, style: { color: palette.sandDeep, textDecoration: 'underline', textUnderlineOffset: '2px' } }, l.label)))),
  );
};

export default Belege;
