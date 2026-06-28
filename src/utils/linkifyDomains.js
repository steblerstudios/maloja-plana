import React from 'react';

// Nackte Domains (z. B. in Quellen-Fussnoten „Quelle: BAG priminfo.admin.ch")
// in klickbare Links verwandeln. Gibt ein React-Fragment zurueck (Strings +
// <a>), damit es 1:1 als Kind eingesetzt werden kann — ohne Key-Warnungen.
const DOMAIN_RE = /\b((?:[a-z0-9-]+\.)+(?:ch|com|org|swiss))\b/gi;
const defaultLinkStyle = { color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' };

export function linkifyDomains(textValue, linkStyle) {
  if (typeof textValue !== 'string') return textValue;
  const parts = [];
  let last = 0;
  let m;
  DOMAIN_RE.lastIndex = 0;
  while ((m = DOMAIN_RE.exec(textValue)) !== null) {
    if (m.index > last) parts.push(textValue.slice(last, m.index));
    const domain = m[0];
    parts.push(React.createElement('a', {
      key: m.index, href: 'https://' + domain, target: '_blank', rel: 'noopener',
      style: linkStyle || defaultLinkStyle,
    }, domain));
    last = m.index + domain.length;
  }
  if (last === 0) return textValue; // keine Domain gefunden
  if (last < textValue.length) parts.push(textValue.slice(last));
  return React.createElement(React.Fragment, null, ...parts);
}
