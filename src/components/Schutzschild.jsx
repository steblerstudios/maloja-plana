import React from 'react';
import { schildState } from '../data/schutzschild.js';
import { text, weight, space, radius, leading } from '../config/tokens.js';

// Versicherungs-Schutzschild: das vierte „Instrument" (kein Gauge). Ein Wappen-
// Schild, das sich nach dem Deckungsgrad der drei Kern-Absicherungen füllt.
// Darunter eine ✓/○-Liste (a11y: Zeichen + Wort, nicht nur Farbe). Ruhig:
// eine offene Absicherung ist ein Hinweis, kein Alarm — kein ✕, kein Rot.
const SHIELD = 'M80 12 L134 34 L134 78 Q134 118 80 148 Q26 118 26 78 L26 34 Z';
const TOP = 12, BOTTOM = 148;

export const Schutzschild = ({ palette, t, versicherungen }) => {
  const st = schildState(versicherungen || {});
  if (!st.touched) return null;
  const h = React.createElement;

  const fillHeight = st.fraction * (BOTTOM - TOP);
  const fillY = BOTTOM - fillHeight;

  const caption = st.allCovered
    ? t('schutzschild.allCovered')
    : t('schutzschild.gapsHint', {
        covered: st.covered, total: st.total,
        list: st.gaps.map(k => t('schutzschild.' + k)).join(', '),
      });
  const captionColor = st.allCovered ? palette.sage : palette.mid;

  const shield = h('svg', {
    viewBox: '0 0 160 170', width: '100%',
    style: { maxWidth: '120px', height: 'auto', display: 'block', margin: '0 auto', overflow: 'visible' },
    role: 'img', 'aria-label': caption,
  },
    h('defs', null, h('clipPath', { id: 'schild-clip' }, h('path', { d: SHIELD }))),
    // leerer Grund + Füllung (von unten) im Schild-Clip
    h('g', { clipPath: 'url(#schild-clip)' },
      h('rect', { x: 20, y: 6, width: 120, height: 150, fill: palette.up }),
      h('rect', { x: 20, y: fillY, width: 120, height: fillHeight + 4, fill: palette.sage, opacity: 0.85 })
    ),
    h('path', { d: SHIELD, fill: 'none', stroke: palette.sage, strokeWidth: 2.5 }),
    h('text', {
      x: 80, y: 92, textAnchor: 'middle',
      style: { fontSize: '30px', fontWeight: weight.semi, fill: st.fraction > 0.55 ? palette.surface : palette.text },
    }, st.covered + '/' + st.total)
  );

  const row = (p) => h('div', {
    key: p.key,
    style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: text.sm, color: p.covered ? palette.text : palette.mid, padding: '3px 0' },
  },
    h('span', { 'aria-hidden': true, style: { color: p.covered ? palette.sage : palette.mid, fontWeight: weight.semi, width: '14px', textAlign: 'center' } }, p.covered ? '✓' : '○'),
    h('span', null, t('schutzschild.' + p.key)),
    h('span', { style: { marginLeft: 'auto', fontSize: text.xs, color: p.covered ? palette.sage : palette.mid } }, p.covered ? t('schutzschild.covered') : t('schutzschild.open'))
  );

  return h('div', {
    style: { marginBottom: space.lg + 'px', padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border + '66', borderRadius: radius.md },
  },
    h('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.sm + 'px 0', fontStyle: 'italic', lineHeight: leading.relaxed, textAlign: 'center' } }, t('schutzschild.intro')),
    shield,
    h('div', { style: { maxWidth: '260px', margin: space.sm + 'px auto 0' } }, st.protections.map(row)),
    h('div', { style: { fontSize: text.sm, color: captionColor, lineHeight: leading.normal, textAlign: 'center', marginTop: space.sm + 'px' } }, caption)
  );
};

export default Schutzschild;
