import React, { useState } from 'react';
import { text, weight, radius, shadow } from './config/tokens.js';

// ─── Glossar-Begriff — antippbare Erklärung für Abkürzungen/Fachwörter ───────
//
// Jana stolperte über „IPV", „SKOS", „Mietbeiträge" — sie wusste nicht, was
// gemeint ist. Ein Begriff bekommt eine dezente gepunktete Unterstreichung;
// Antippen öffnet eine ruhige kleine Erklärung. Kein Lärm, nur Orientierung.

// Erkennbare Begriffe → i18n-Schlüssel der Erklärung. Case-sensitiv beim Matchen.
export const GLOSSAR = {
  IPV: 'glossar.ipv',
  SKOS: 'glossar.skos',
  EL: 'glossar.el',
  Mietbeiträge: 'glossar.mietbeitraege',
};

export function GlossarBegriff({ term, t, palette }) {
  const [open, setOpen] = useState(false);
  const defKey = GLOSSAR[term];
  if (!defKey) return term;
  return React.createElement('span', { style: { position: 'relative', display: 'inline-block' } },
    React.createElement('button', {
      type: 'button',
      onClick: () => setOpen((o) => !o),
      'aria-expanded': open,
      style: {
        background: 'none', border: 'none', padding: 0, cursor: 'help', font: 'inherit', color: 'inherit',
        borderBottom: '1px dotted ' + palette.mid, lineHeight: 'inherit',
      },
    }, term),
    open ? React.createElement(React.Fragment, null,
      // Klick daneben schliesst.
      React.createElement('span', {
        'aria-hidden': 'true',
        onClick: () => setOpen(false),
        style: { position: 'fixed', inset: 0, zIndex: 30 },
      }),
      React.createElement('span', {
        role: 'tooltip',
        style: {
          position: 'absolute', left: 0, top: '100%', marginTop: '6px', zIndex: 31,
          width: 'max-content', maxWidth: '260px', textAlign: 'left',
          background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.sm,
          boxShadow: shadow.md, padding: '10px 12px',
          fontSize: text.sm, fontWeight: weight.normal, color: palette.text, lineHeight: 1.5,
          whiteSpace: 'normal',
        },
      }, t(defKey)),
    ) : null
  );
}

// Zerlegt einen Satz und macht bekannte Begriffe antippbar. Reihenfolge egal.
export function GlossarText({ children, t, palette }) {
  if (typeof children !== 'string') return children;
  const terms = Object.keys(GLOSSAR).sort((a, b) => b.length - a.length);
  const re = new RegExp('\\b(' + terms.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b');
  const parts = children.split(re);
  return React.createElement(React.Fragment, null,
    ...parts.map((part, i) =>
      GLOSSAR[part]
        ? React.createElement(GlossarBegriff, { key: i, term: part, t, palette })
        : part
    )
  );
}

export default GlossarBegriff;
