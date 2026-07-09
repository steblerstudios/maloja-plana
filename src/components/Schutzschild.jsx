import React from 'react';
import { schildState } from '../data/schutzschild.js';
import { text, weight, space, radius, leading } from '../config/tokens.js';

// Versicherungs-Schutzschild: zwei Wappen nebeneinander — „Pflicht" (gesetzlich)
// und „Empfohlen" (freiwillig). Jedes füllt sich nach seinem Deckungsgrad, mit
// ✓/○-Liste (a11y: Zeichen + Wort, nicht nur Farbe). Ruhig: eine offene
// Absicherung ist ein Hinweis, kein Alarm — kein ✕, kein Rot.
const SHIELD = 'M80 12 L134 34 L134 78 Q134 118 80 148 Q26 118 26 78 L26 34 Z';
const TOP = 12, BOTTOM = 148;

const shieldSvg = (palette, group, clipId, label) => {
  const h = React.createElement;
  const fillHeight = group.fraction * (BOTTOM - TOP);
  return h('svg', {
    viewBox: '0 0 160 170', width: '100%',
    style: { maxWidth: '96px', height: 'auto', display: 'block', margin: '0 auto', overflow: 'visible' },
    role: 'img', 'aria-label': label,
  },
    h('defs', null, h('clipPath', { id: clipId }, h('path', { d: SHIELD }))),
    h('g', { clipPath: 'url(#' + clipId + ')' },
      h('rect', { x: 20, y: 6, width: 120, height: 150, fill: palette.up }),
      h('rect', { x: 20, y: BOTTOM - fillHeight, width: 120, height: fillHeight + 4, fill: palette.sage, opacity: 0.85 })
    ),
    h('path', { d: SHIELD, fill: 'none', stroke: palette.sage, strokeWidth: 2.5 }),
    h('text', {
      x: 80, y: 92, textAnchor: 'middle',
      style: { fontSize: '28px', fontWeight: weight.semi, fill: group.fraction > 0.55 ? palette.surface : palette.text },
    }, group.covered + '/' + group.total)
  );
};

export const Schutzschild = ({ palette, t, versicherungen, employed, annualIncome }) => {
  const st = schildState(versicherungen || {}, { employed, annualIncome });
  if (!st.touched) return null;
  const h = React.createElement;

  const row = (p) => h('div', {
    key: p.key,
    style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', fontSize: text.sm, color: p.covered ? palette.text : palette.mid, padding: '3px 0' },
  },
    h('span', { 'aria-hidden': true, style: { color: p.covered ? palette.sage : palette.mid, fontWeight: weight.semi, width: '14px', textAlign: 'center' } }, p.covered ? '✓' : '○'),
    h('span', null, t('schutzschild.' + p.key)),
    h('span', { style: { marginLeft: 'auto', fontSize: text.xs, color: p.covered ? palette.sage : palette.mid } }, p.covered ? t('schutzschild.covered') : t('schutzschild.open'))
  );

  const groupBlock = (group, titleKey, clipId, note) => {
    if (group.total === 0) return null;
    const label = t('schutzschild.' + titleKey) + ': ' + (group.allCovered
      ? t('schutzschild.allCovered')
      : t('schutzschild.someOpen', { list: group.gaps.map(k => t('schutzschild.' + k)).join(', ') }));
    return h('div', { style: { flex: '1 1 220px', minWidth: '200px' } },
      h('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, textAlign: 'center', marginBottom: space['2xs'] + 'px' } }, t('schutzschild.' + titleKey)),
      note && h('div', { style: { fontSize: text.xs, color: palette.mid, textAlign: 'center', marginBottom: space.sm + 'px', lineHeight: leading.normal } }, note),
      shieldSvg(palette, group, clipId, label),
      h('div', { style: { maxWidth: '260px', margin: space.sm + 'px auto 0' } }, group.items.map(row))
    );
  };

  return h('div', {
    style: { marginBottom: space.lg + 'px', padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border + '66', borderRadius: radius.md },
  },
    h('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', fontStyle: 'italic', lineHeight: leading.relaxed, textAlign: 'center' } }, t('schutzschild.intro')),
    h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.lg + 'px', alignItems: 'flex-start' } },
      groupBlock(st.pflicht, 'pflichtTitle', 'schild-pflicht', t('schutzschild.pflichtNote')),
      groupBlock(st.empfohlen, 'empfohlenTitle', 'schild-empfohlen', t('schutzschild.empfohlenNote'))
    )
  );
};

export default Schutzschild;
