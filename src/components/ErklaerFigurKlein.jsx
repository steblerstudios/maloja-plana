import React from 'react';
import { ERKLAERFIGUREN } from '../data/erklaerfiguren.js';
import { ExternerLink } from './ExternerLink.jsx';
import { text, space, weight } from '../config/tokens.js';

// ─── D · Erklärfigur zum Aufklappen (Entscheid Stebler Studios 09.11.2026) ───
// Das Standbild der Hairline-Figur von /krankenkasse/ direkt beim Werkzeug. Wird nur
// nachgeladen, wenn jemand «Im Bild erklärt» aufklappt (VerstehenImWerkzeug).
//
// Bewegt nur als Link: Der Server schickt frame-ancestors 'none', ein Rahmen bliebe leer
// (derselbe Grund wie bewegtEinbetten: false auf der Seite, Entscheid 04.11.2026).
//
// Das SVG kommt aus scripts/app-verstehen.mjs → standbildSvg (seiten-figuren.mjs), das
// Skripte, foreignObject, Bilder und Fremdverweise abweist und Titel und Beschreibung für
// Vorlese-Programme einsetzt. Nur darum ist dangerouslySetInnerHTML hier vertretbar: der
// Inhalt ist eine Datei aus dem Repo, nie eine Eingabe.
//
// Die Strichregeln sind die der Seite (scripts/build-seiten.mjs, «.hl svg …», nach dem
// Hairline-Kernel, MIT), nur mit Malojas Palette statt der Seitenfarben, damit hell/dunkel stimmt.
const STIL = `
.mp-hl svg{ display:block; width:100%; height:auto }
.mp-hl svg :where(path,polygon,ellipse,line){ fill:var(--hl-plate); stroke:var(--hl-mid); stroke-width:.9;
  vector-effect:non-scaling-stroke; stroke-linejoin:round; stroke-linecap:round }
.mp-hl svg .nf{ fill:none } .mp-hl svg .fo{ stroke:none }
.mp-hl svg .sil{ stroke:var(--hl-edge) } .mp-hl svg .hi{ stroke:var(--hl-hi); stroke-width:1.3 } .mp-hl svg .lo{ stroke:var(--hl-lo) }
.mp-hl svg .dash{ stroke-dasharray:1 3 } .mp-hl svg .dot{ stroke:none; fill:var(--hl-hi) }
.mp-hl svg .dot.m{ fill:var(--hl-edge) } .mp-hl svg .dot.off{ fill:var(--hl-lo) } .mp-hl svg .ghost path{ fill:none; stroke:var(--hl-mid) }`;

const h = React.createElement;

export default function ErklaerFigurKlein({ palette, t, figur }) {
  const F = ERKLAERFIGUREN[figur];
  if (!F) return null;
  const mische = (anteil) => `color-mix(in srgb, ${palette.mid} ${anteil}%, ${palette.surface})`;
  const vars = { '--hl-plate': palette.surface, '--hl-hi': palette.skyDeep, '--hl-edge': palette.mid, '--hl-mid': mische(45), '--hl-lo': mische(22) };
  const leise = { margin: space.xs + 'px 0 0', fontSize: text.xs, color: palette.mid };
  const link = { color: palette.skyDeep || palette.text, textDecoration: 'underline', textUnderlineOffset: '2px' };
  // lang="de" nur auf dem, was deutsch aus /krankenkasse/ kommt; «Quelle» und der Linktext sind übersetzt
  // und sollen in der Sprache der App vorgelesen werden (a11y-Prüfung 09.11.2026).
  return h('figure', { 'data-teil': 'erklaerfigur-klein', style: { margin: space.sm + 'px 0 0' } },
    h('style', null, STIL),
    h('p', { lang: 'de', style: { margin: '0 0 ' + space.xs + 'px', fontSize: text.xs, color: palette.mid } }, F.kurz),
    h('div', { className: 'mp-hl', lang: 'de', style: vars, dangerouslySetInnerHTML: { __html: F.svg } }),
    h('figcaption', null,
      h('p', { lang: 'de', style: { margin: space.xs + 'px 0 0', fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, F.wert),
      h('p', { lang: 'de', style: { margin: space.xs + 'px 0 0', fontSize: text.sm, color: palette.text } }, F.legende),
      F.quellen.length > 0 && h('p', { style: leise }, `${t('erklaerseite.belegWort')}: `,
        F.quellen.map((q, i) => h(React.Fragment, { key: q.url }, i > 0 && ' · ',
          h(ExternerLink, { t, href: q.url, hrefLang: 'de', lang: 'de', style: link }, q.text))),
        F.weitereStellen && h('span', { lang: 'de' }, ` · ${F.weitereStellen}`)),
      h('p', { style: { margin: space.xs + 'px 0 0', fontSize: text.sm } },
        h(ExternerLink, { t, href: F.bewegt, hrefLang: 'de', style: { ...link, display: 'inline-block', minHeight: '44px', lineHeight: '44px' } },
          t('erklaerseite.bewegt')))));
}
