import React from 'react';
import { schildState } from '../data/schutzschild.js';
import { shieldPath } from './shieldShape.js';
import { text, weight, space, radius, leading } from '../config/tokens.js';
import { hinweisZeichen } from '../IconSystem.jsx';
import { zahl } from '../utils/geld.js';

// Versicherungs-Schutzschild: zwei Wappen nebeneinander — „Pflicht" (gesetzlich)
// und „Empfohlen" (freiwillig). Jedes füllt sich nach seinem Deckungsgrad, mit
// ✓/○-Liste (a11y: Zeichen + Wort, nicht nur Farbe). Ruhig: eine offene
// Absicherung ist ein Hinweis, kein Alarm — kein ✕, kein Rot.
const TOP = 12, BOTTOM = 148;
// Nur für Screenreader sichtbar.
const VERSTECKT = { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 };
const SHIELD = shieldPath(80, TOP, 108, BOTTOM - TOP);

const shieldSvg = (palette, group, clipId, label, klein) => {
  const h = React.createElement;
  const fillHeight = group.fraction * (BOTTOM - TOP);
  return h('svg', {
    viewBox: '0 0 160 170', width: '100%',
    style: { maxWidth: klein ? '58px' : '96px', height: 'auto', display: 'block', margin: '0 auto', overflow: 'visible' },
    role: 'img', 'aria-label': label,
  },
    h('defs', null, h('clipPath', { id: clipId }, h('path', { d: SHIELD }))),
    h('g', { clipPath: 'url(#' + clipId + ')' },
      h('rect', { x: 20, y: 6, width: 120, height: 150, fill: palette.up }),
      h('rect', { x: 20, y: BOTTOM - fillHeight, width: 120, height: fillHeight + 4, fill: palette.sage, opacity: 0.85 })
    ),
    h('path', { d: SHIELD, fill: 'none', stroke: palette.sage, strokeWidth: 2.5 }),
    // Klein: die Zahl steht als Text unter dem Schild — im kleinen Schild (≈10 px) hielt sie auf der
    // Füllung weder hell noch dunkel 4.5:1 (a11y-Prüfer, Abnahme F6).
    !klein && h('text', {
      x: 80, y: 92, textAnchor: 'middle',
      style: { fontSize: '28px', fontWeight: weight.semi, fill: group.fraction > 0.55 ? palette.surface : palette.text },
    }, group.covered + '/' + group.total)
  );
};

// `klein` (Kapitel Versicherungen, Fassung 6 Runde 9 AA nachgebessert, Sophie 24.10.2026): «zwei kleine
// Schilde mit Listen, offen» — zwei Spalten nebeneinander, ohne eigenen Kasten, Satz ruhig links.
export const Schutzschild = ({ palette, t, versicherungen, employed, annualIncome, annualIncomeMit13, lohnBasis, referenzalterErreicht, klein }) => {
  const st = schildState(versicherungen || {}, { employed, annualIncome, annualIncomeMit13, lohnBasis, referenzalterErreicht });
  if (!st.touched) return null;
  const h = React.createElement;

  const row = (p) => h('div', {
    key: p.key, role: 'listitem',
    style: { position: 'relative', display: 'flex', alignItems: 'center', gap: (klein ? 6 : space.sm) + 'px', fontSize: klein ? text.xs : text.sm, color: p.covered ? palette.text : palette.mid, padding: '3px 0' },
  },
    h('span', { 'aria-hidden': true, style: { color: p.covered ? palette.sage : palette.mid, fontWeight: weight.semi, width: '14px', flexShrink: 0, textAlign: 'center' } }, hinweisZeichen(p.covered ? 'check' : 'kaestchen', 12)),
    h('span', { style: { minWidth: 0 } }, t('schutzschild.' + p.key)),
    // Klein: das Wort «gedeckt/offen» nur für Screenreader — in der halben Spalte lief es in die
    // Nachbarspalte (Abnahme F6, 375 px). Sichtbar tragen ✓ und ○ den Stand, wie im Entwurf.
    h('span', { style: klein ? VERSTECKT : { marginLeft: 'auto', fontSize: text.xs, color: p.covered ? (palette.sageDeep || palette.sage) : palette.mid } }, p.covered ? t('schutzschild.covered') : t('schutzschild.open'))
  );

  const groupBlock = (group, titleKey, clipId, note) => {
    if (group.total === 0) return null;
    const label = t('schutzschild.' + titleKey) + ': ' + (group.allCovered
      ? t('schutzschild.allCovered')
      : t('schutzschild.someOpen', { list: group.gaps.map(k => t('schutzschild.' + k)).join(', ') }));
    // Klein: Schild zuerst, dann Titel und Satz (wie im Entwurf); gross: Titel über dem Schild.
    const titel = h('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, textAlign: 'center', marginBottom: space['2xs'] + 'px', marginTop: klein ? space.xs + 'px' : 0 } },
      t('schutzschild.' + titleKey), klein ? ' · ' + group.covered + '/' + group.total : '');
    const satz = note && h('div', { style: { fontSize: text.xs, color: palette.mid, textAlign: 'center', marginBottom: space.sm + 'px', lineHeight: leading.normal } }, note);
    return h('div', { 'data-gruppe': titleKey, style: klein ? { flex: '1 1 0', minWidth: 0 } : { flex: '1 1 220px', minWidth: '200px' } },
      !klein && titel, !klein && satz,
      shieldSvg(palette, group, clipId, label, klein),
      klein && titel, klein && satz,
      h('div', { role: 'list', style: { maxWidth: '260px', margin: (klein ? space.xs : space.sm) + 'px auto 0' } }, group.items.map(row))
    );
  };

  return h('div', {
    'data-schild': klein ? 'klein' : 'gross',
    style: klein
      ? { marginBottom: space.sm + 'px' }
      : { marginBottom: space.lg + 'px', padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border + '66', borderRadius: radius.md },
  },
    h('p', { style: klein
      ? { fontSize: text.xs, color: palette.mid, margin: '0 0 ' + space.sm + 'px 0', lineHeight: leading.normal }
      : { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', fontStyle: 'italic', lineHeight: leading.relaxed, textAlign: 'center' } }, t('schutzschild.intro')),
    h('div', { style: { display: 'flex', flexWrap: klein ? 'nowrap' : 'wrap', gap: (klein ? space.md : space.lg) + 'px', alignItems: 'flex-start' } },
      groupBlock(st.pflicht, 'pflichtTitle', 'schild-pflicht', t('schutzschild.pflichtNote')),
      groupBlock(st.empfohlen, 'empfohlenTitle', 'schild-empfohlen', t('schutzschild.empfohlenNote'))
    ),
    // Pensionskasse: Pflicht ab Bruttolohn-Schwelle; erfasst ist kein Bruttolohn → offen, nicht still weg.
    st.bvgUnklar && h('p', { style: { fontSize: text.xs, color: palette.mid, margin: space.md + 'px 0 0', lineHeight: leading.normal, textAlign: 'center' } },
      hinweisZeichen(), t(st.bvgUnklarGrund === 'dreizehnter' ? 'schutzschild.bvgUnklar13' : 'schutzschild.bvgUnklar', { schwelle: zahl(st.bvgSchwelle, { hoechstens: 2 }) })),
    // Als «trifft nicht zu» markiert, obwohl in der Regel Pflicht: die Lücke bleibt, der Satz sagt warum.
    st.bvgNa && h('p', { 'data-teil': 'bvg-na', style: { fontSize: text.xs, color: palette.mid, margin: space.md + 'px 0 0', lineHeight: leading.normal, textAlign: 'center' } },
      hinweisZeichen(), t('schutzschild.bvgNa', { schwelle: zahl(st.bvgSchwelle, { hoechstens: 2 }) }))
  );
};

export default Schutzschild;
