import React from 'react';
import { ExternerLink } from '../components/ExternerLink.jsx';

// Quellen-Fussnoten: Marker [[Wort|ziel]] → das WORT trägt den Link, die Domain
// bleibt unsichtbar (visuellen Lärm meiden, siehe docs/UX_PLAYBOOK.md). „ziel"
// darf eine nackte Domain (→ https://domain) oder eine volle URL sein.
// Gibt ein React-Fragment zurück (Strings + <a>), 1:1 als Kind einsetzbar.
const MARKER_RE = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;
const defaultLinkStyle = { color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' };

// t ist optional (dritter Parameter) — wo mitgegeben, bekommt der Link den
// hörbaren "öffnet in neuem Tab"-Hinweis (R4); ohne t bleibt rel/target korrekt,
// nur der Screenreader-Hinweis entfällt. K64: damit das nicht still passiert,
// meldet sich der Fehlfall im Entwicklungsmodus; renderSourceAufrufer.test.js
// hält fest, dass alle Aufrufer in src/ t übergeben.
export function renderSource(textValue, linkStyle, t) {
  if (typeof textValue !== 'string') return textValue;
  if (import.meta.env.DEV && typeof t !== 'function' && textValue.includes('[[')) {
    console.warn('[a11y] renderSource ohne t — der Hinweis «öffnet in neuem Tab» fehlt.');
  }
  const parts = [];
  let last = 0;
  let m;
  MARKER_RE.lastIndex = 0;
  while ((m = MARKER_RE.exec(textValue)) !== null) {
    if (m.index > last) parts.push(textValue.slice(last, m.index));
    const label = m[1];
    const target = m[2].trim();
    const href = /^https?:\/\//.test(target) ? target : 'https://' + target;
    parts.push(t
      ? React.createElement(ExternerLink, {
          key: m.index, t, href,
          style: linkStyle || defaultLinkStyle,
        }, label)
      : React.createElement('a', {
          key: m.index, href, target: '_blank', rel: 'noopener noreferrer',
          style: linkStyle || defaultLinkStyle,
        }, label));
    last = m.index + m[0].length;
  }
  if (last === 0) return textValue; // kein Marker gefunden
  if (last < textValue.length) parts.push(textValue.slice(last));
  return React.createElement(React.Fragment, null, ...parts);
}
