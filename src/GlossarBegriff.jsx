import React, { useState } from 'react';
import { text, weight, radius, shadow } from './config/tokens.js';
import { useT } from './i18n/index.js';

// ─── Glossar-Begriff — antippbare Erklärung für Abkürzungen/Fachwörter ───────
//
// Testperson A stolperte über „IPV", „SKOS", „Mietbeiträge" — sie wusste nicht, was
// gemeint ist. Ein Begriff bekommt eine dezente gepunktete Unterstreichung;
// Antippen öffnet eine ruhige kleine Erklärung. Kein Lärm, nur Orientierung.

// Erkennbare Begriffe → i18n-Schlüssel der Erklärung. Case-sensitiv beim Matchen.
export const GLOSSAR = {
  IPV: 'glossar.ipv',
  SKOS: 'glossar.skos',
  EL: 'glossar.el',
  Mietbeiträge: 'glossar.mietbeitraege',
  AHV: 'glossar.ahv',
  IV: 'glossar.iv',
  KVG: 'glossar.kvg',
  BVG: 'glossar.bvg',
  UVG: 'glossar.uvg',
  Franchise: 'glossar.franchise',
  Selbstbehalt: 'glossar.selbstbehalt',
  Beistandschaft: 'glossar.beistandschaft',
};

export function GlossarBegriff({ term, t, palette }) {
  const [open, setOpen] = useState(false);
  const defKey = GLOSSAR[term];
  if (!defKey) return term;
  return React.createElement('span', { style: { position: 'relative', display: 'inline-block' } },
    React.createElement('button', {
      type: 'button',
      // stopPropagation: eine Erklärung soll nie eine umgebende Aktion auslösen.
      onClick: (e) => { e.stopPropagation(); setOpen((o) => !o); },
      'aria-expanded': open,
      title: t(defKey),
      style: {
        background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit',
        borderBottom: open ? '1px solid var(--mp-accent)' : '1px dotted ' + palette.mid,
        lineHeight: 'inherit', whiteSpace: 'nowrap',
      },
    },
      term,
      // Kleiner, ruhiger Marker: signalisiert „hier steckt eine Erklärung".
      React.createElement('sup', {
        'aria-hidden': 'true',
        style: {
          fontSize: '0.7em', marginLeft: '2px', fontWeight: weight.semi,
          color: open ? 'var(--mp-accent)' : palette.mid,
        },
      }, 'ⓘ'),
    ),
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
  // t kann als Prop kommen oder aus dem i18n-Kontext — so genügt an vielen
  // Stellen ein einzelnes { palette } ohne t durchzureichen.
  const { t: ctxT } = useT();
  const tt = t || ctxT;
  if (typeof children !== 'string') return children;
  const terms = Object.keys(GLOSSAR).sort((a, b) => b.length - a.length);
  const re = new RegExp('\\b(' + terms.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b');
  const parts = children.split(re);
  return React.createElement(React.Fragment, null,
    ...parts.map((part, i) =>
      GLOSSAR[part]
        ? React.createElement(GlossarBegriff, { key: i, term: part, t: tt, palette })
        : part
    )
  );
}

export default GlossarBegriff;
