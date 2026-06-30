import React from 'react';

// Quellen-Fussnoten: Marker [[Wort|ziel]] → das WORT trägt den Link, die Domain
// bleibt unsichtbar (visuellen Lärm meiden, siehe docs/UX_PLAYBOOK.md). „ziel"
// darf eine nackte Domain (→ https://domain) oder eine volle URL sein.
// Gibt ein React-Fragment zurück (Strings + <a>), 1:1 als Kind einsetzbar.
const MARKER_RE = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;
const defaultLinkStyle = { color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' };

export function renderSource(textValue, linkStyle) {
  if (typeof textValue !== 'string') return textValue;
  const parts = [];
  let last = 0;
  let m;
  MARKER_RE.lastIndex = 0;
  while ((m = MARKER_RE.exec(textValue)) !== null) {
    if (m.index > last) parts.push(textValue.slice(last, m.index));
    const label = m[1];
    const target = m[2].trim();
    const href = /^https?:\/\//.test(target) ? target : 'https://' + target;
    parts.push(React.createElement('a', {
      key: m.index, href, target: '_blank', rel: 'noopener',
      style: linkStyle || defaultLinkStyle,
    }, label));
    last = m.index + m[0].length;
  }
  if (last === 0) return textValue; // kein Marker gefunden
  if (last < textValue.length) parts.push(textValue.slice(last));
  return React.createElement(React.Fragment, null, ...parts);
}
