import React from 'react';
import { PageTitle } from './components/Heading.jsx';
import { Icon } from './IconSystem.jsx';
import { FRUITS } from './FruchtSilhouette.jsx';
import { gardenTrees } from './data/obstgarten.js';
import { getBereich } from './data/lebensbereiche.js';
import { getChapters } from './config/constants.js';
import { text, weight, space, radius, leading } from './config/tokens.js';

// Lebens-Obstgarten: eine eigene Ansicht neben dem Einzelbaum (Sophie: Option 2+3
// zum Start). Pro Lebensbereich ein Schweizer Obstbäumchen, das mit dem Kapitel
// reift; Früchte hängen an kleinen Stielen. Ruhig, Wuchsstufe statt Prozent.
const BROWN = '#8A6D4B';

function treeSvg(palette, color, fruit, stage, ariaLabel) {
  const h = React.createElement;
  const ground = 100, cy = 46;
  const els = [
    h('line', { key: 'g', x1: 16, y1: ground, x2: 84, y2: ground, stroke: palette.sage, strokeWidth: 2, opacity: 0.45 }),
    h('path', { key: 'gr', d: 'M24 100 q2 -6 4 -8 M76 100 q-2 -6 -4 -8 M50 100 q1 -5 3 -7', stroke: palette.sage, strokeWidth: 1.4, fill: 'none', opacity: 0.45 }),
  ];
  const fruitG = (fx, fy, scale, opacity) => h('g', {
    key: 'f' + fx + fy, transform: 'translate(' + (fx - 12 * scale) + ',' + fy + ') scale(' + scale + ')',
    style: { color }, opacity: opacity == null ? 1 : opacity,
  }, FRUITS[fruit] ? FRUITS[fruit]() : null);

  if (stage === 1) {
    els.push(h('line', { key: 'st', x1: 50, y1: ground, x2: 50, y2: 80, stroke: BROWN, strokeWidth: 2.5, strokeLinecap: 'round' }));
    els.push(h('ellipse', { key: 'l1', cx: 43, cy: 80, rx: 6, ry: 3, fill: palette.sage, opacity: 0.7, transform: 'rotate(-25 43 80)' }));
    els.push(h('ellipse', { key: 'l2', cx: 57, cy: 80, rx: 6, ry: 3, fill: palette.sage, opacity: 0.7, transform: 'rotate(25 57 80)' }));
    els.push(fruitG(50, 58, 0.6, 0.45));
  } else {
    const r = [0, 0, 24, 29, 33][stage];
    const op = [0, 0, 0.5, 0.72, 0.9][stage];
    els.push(h('rect', { key: 'tr', x: 47, y: 62, width: 6, height: 38, rx: 2, fill: BROWN }));
    els.push(h('path', { key: 'br', d: 'M50 70 L38 58 M50 70 L62 58 M50 62 L50 48', stroke: BROWN, strokeWidth: 2.5, fill: 'none', strokeLinecap: 'round' }));
    els.push(h('circle', { key: 'c', cx: 50, cy, r, fill: color, opacity: op }));
    const count = [0, 0, 1, 2, 3][stage];
    const pos = count === 1 ? [[50, cy + r * 0.45]]
      : count === 2 ? [[50 - r * 0.5, cy + r * 0.35], [50 + r * 0.5, cy + r * 0.35]]
      : [[50 - r * 0.55, cy + r * 0.25], [50, cy + r * 0.55], [50 + r * 0.55, cy + r * 0.25]];
    pos.forEach(([fx, fy], i) => {
      els.push(h('line', { key: 'fs' + i, x1: fx, y1: fy - 6, x2: fx, y2: fy - 1, stroke: BROWN, strokeWidth: 1 }));
      els.push(fruitG(fx, fy - 1, 0.7));
    });
  }
  return h('svg', {
    viewBox: '0 0 100 112', width: '100%',
    style: { maxWidth: '96px', height: 'auto', display: 'block', margin: '0 auto', overflow: 'visible' },
    role: 'img', 'aria-label': ariaLabel,
  }, els);
}

export const Obstgarten = ({ palette, t, data, onNavigate, isDarkMode }) => {
  const h = React.createElement;
  const chapters = getChapters(t);
  const trees = gardenTrees(data, chapters);
  const stageLabel = (tree) => tree.future ? t('obstgarten.future') : t('obstgarten.stage' + tree.stage);
  const nameOf = (tree) => tree.future ? t('obstgarten.b.' + tree.key) : tree.title;

  const cell = (tree) => {
    const b = getBereich(tree.key);
    const color = isDarkMode ? b.dark : b.light;
    const name = nameOf(tree);
    const clickable = !tree.future;
    return h('button', {
      key: tree.key,
      onClick: clickable ? () => onNavigate('chapter', tree.chapterIdx) : undefined,
      disabled: !clickable,
      style: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
        padding: space.sm + 'px 2px', background: 'transparent', border: 'none',
        borderRadius: radius.sm, cursor: clickable ? 'pointer' : 'default',
        fontFamily: 'inherit', opacity: tree.future ? 0.72 : 1,
      },
      onMouseEnter: clickable ? (e) => { e.currentTarget.style.background = palette.sage + '12'; } : undefined,
      onMouseLeave: clickable ? (e) => { e.currentTarget.style.background = 'transparent'; } : undefined,
    },
      treeSvg(palette, color, tree.fruit, tree.stage, name + ' — ' + stageLabel(tree)),
      h('div', { style: { fontSize: text.sm, color: palette.text, marginTop: '2px' } }, name),
      h('div', { style: { fontSize: text.xs, color: palette.mid } }, stageLabel(tree))
    );
  };

  return h('div', { style: { maxWidth: '760px' } },
    h(PageTitle, { palette, icon: h(Icon, { name: 'home', size: 22 }), style: { marginBottom: space.sm + 'px' } }, t('obstgarten.title')),
    h('p', { style: { fontSize: text.body, color: palette.mid, lineHeight: leading.relaxed, margin: '0 0 ' + space.lg + 'px 0' } }, t('obstgarten.intro')),
    h('div', {
      style: {
        background: palette.sage + '0C', border: '1px solid ' + palette.sage + '20',
        borderRadius: radius.md, padding: space.md + 'px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: space.sm + 'px',
      },
    }, trees.map(cell)),
    h('p', { style: { fontSize: text.xs, color: palette.soft, lineHeight: leading.relaxed, marginTop: space.md + 'px' } }, t('obstgarten.legend'))
  );
};

export default Obstgarten;
