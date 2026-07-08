import React from 'react';
import { PageTitle } from './components/Heading.jsx';
import { Icon } from './IconSystem.jsx';
import { FRUITS } from './FruchtSilhouette.jsx';
import { gardenTrees, fruitForm } from './data/obstgarten.js';
import { getBereich } from './data/lebensbereiche.js';
import { getChapters } from './config/constants.js';
import { text, weight, space, radius, leading } from './config/tokens.js';

// Lebens-Obstgarten v2 — eine gewellte Gartenlandschaft mit Tiefe. Jede (schon
// entschiedene) Schweizer Frucht bekommt ihre natürliche Wuchsform; die echten
// FruchtSilhouette-Formen hängen als Held. Wuchsstufen erzählen eine Jahreszeit:
// Setzling → Blüte → junge Frucht → volle Ernte. Ruhig, barrierefrei (Form +
// Name + aria), klickbar. Der Einzelbaum auf dem Dashboard bleibt unberührt.

// Fixe Landschafts-Plätze: hintere Reihe (Tiefe, kleiner) = die vier Bereiche
// ohne Kapitel als Setzlinge; Mitte + vorne = die sieben heutigen Kapitel.
const SLOTS = {
  gesundheit: { x: 150, gy: 190, s: 0.62 }, arbeit: { x: 348, gy: 188, s: 0.62 },
  familie: { x: 545, gy: 190, s: 0.62 }, vorsorge: { x: 712, gy: 188, s: 0.62 },
  versicherungen: { x: 112, gy: 322, s: 0.85 }, bildung: { x: 322, gy: 320, s: 0.85 },
  notfall: { x: 522, gy: 322, s: 0.85 }, behoerden: { x: 724, gy: 320, s: 0.85 },
  person: { x: 185, gy: 452, s: 1.12 }, wohnen: { x: 432, gy: 452, s: 1.12 }, finanzen: { x: 668, gy: 452, s: 1.12 },
};

const trunkPath = (cx, gy, h, w) =>
  'M' + (cx - w) + ' ' + gy + ' Q' + (cx - w * 0.5) + ' ' + (gy - h * 0.55) + ' ' + (cx - w * 0.35) + ' ' + (gy - h) +
  ' L' + (cx + w * 0.35) + ' ' + (gy - h) + ' Q' + (cx + w * 0.5) + ' ' + (gy - h * 0.55) + ' ' + (cx + w) + ' ' + gy + ' Z';

function fruitSilo(h, fruit, color, cx, cy, sizePx, op) {
  const sc = sizePx / 24;
  return h('g', {
    transform: 'translate(' + (cx - 12 * sc).toFixed(1) + ',' + (cy - 12 * sc).toFixed(1) + ') scale(' + sc.toFixed(3) + ')',
    style: { color }, opacity: op == null ? 1 : op,
  }, FRUITS[fruit] ? FRUITS[fruit]() : null);
}

// scatter deterministisch (kein Zufall → ruhig, stabil über Renders)
function ring(cx, cy, rx, ry, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + i * 1.3;
    out.push([cx + Math.cos(a) * rx * (0.55 + ((i * 7) % 5) / 11), cy + Math.sin(a) * ry * (0.4 + ((i * 5) % 4) / 9) + ry * 0.28]);
  }
  return out;
}

export const Obstgarten = ({ palette, t, data, onNavigate, isDarkMode }) => {
  const h = React.createElement;
  const chapters = getChapters(t);
  const trees = gardenTrees(data, chapters);
  const stageLabel = (tr) => tr.future ? t('obstgarten.future') : t('obstgarten.stage' + tr.stage);

  const C = {
    sky: palette.up, sun: isDarkMode ? '#3A4038' : '#F5F0E2',
    far: palette.sage + '2b', mead: palette.sage + '20', mead2: palette.sage + '31',
    path: palette.sand + '2e', shadow: palette.mid + '22',
    trunk: isDarkMode ? '#6B563C' : '#7A5F42',
    leaf: isDarkMode ? '#5E7A54' : '#6E8B5A', leaf2: isDarkMode ? '#6E8C60' : '#85A46A',
    blossom: isDarkMode ? '#C9A8B0' : '#E6CBD3',
  };

  const canopy = (els, clumps, color, op, pfx) => clumps.forEach((p, i) =>
    els.push(h('circle', { key: (pfx || 'c') + i, cx: p[0], cy: p[1], r: p[2], fill: color, opacity: op })));

  // fruitColor kommt vom Bereich (b.light/b.dark) – wird beim Aufruf übergeben.
  function plant(cx, gy, s, fruit, fruitC, form, stage) {
    const els = [];
    els.push(h('ellipse', { key: 'sh', cx, cy: gy + 2, rx: 22 * s, ry: 3.5 * s, fill: C.shadow }));

    if (stage === 1) {
      els.push(h('line', { key: 'st', x1: cx, y1: gy, x2: cx, y2: gy - 26 * s, stroke: C.trunk, strokeWidth: 2.4 * s, strokeLinecap: 'round' }));
      els.push(h('ellipse', { key: 'la', cx: cx - 6 * s, cy: gy - 26 * s, rx: 6 * s, ry: 3 * s, fill: C.leaf, opacity: 0.85, transform: 'rotate(-25 ' + (cx - 6 * s) + ' ' + (gy - 26 * s) + ')' }));
      els.push(h('ellipse', { key: 'lb', cx: cx + 6 * s, cy: gy - 26 * s, rx: 6 * s, ry: 3 * s, fill: C.leaf, opacity: 0.85, transform: 'rotate(25 ' + (cx + 6 * s) + ' ' + (gy - 26 * s) + ')' }));
      els.push(h('g', { key: 'bud' }, fruitSilo(h, fruit, fruitC, cx, gy - 34 * s, 11 * s, 0.55)));
      return els;
    }

    if (form === 'rebe') {
      els.push(h('line', { key: 'p1', x1: cx - 24 * s, y1: gy, x2: cx - 24 * s, y2: gy - 58 * s, stroke: C.trunk, strokeWidth: 3 * s }));
      els.push(h('line', { key: 'p2', x1: cx + 24 * s, y1: gy, x2: cx + 24 * s, y2: gy - 58 * s, stroke: C.trunk, strokeWidth: 3 * s }));
      [16, 34, 52].forEach((o, i) => els.push(h('line', { key: 'w' + i, x1: cx - 24 * s, y1: gy - o * s, x2: cx + 24 * s, y2: gy - o * s, stroke: C.trunk, strokeWidth: 1.4 * s, opacity: 0.55 })));
      canopy(els, [[cx - 13 * s, gy - 44 * s, 12 * s], [cx + 13 * s, gy - 48 * s, 12 * s], [cx, gy - 38 * s, 12 * s]], C.leaf2, 0.95, 'rv');
      if (stage === 2) {
        ring(cx, gy - 44 * s, 16 * s, 10 * s, 6).forEach((pnt, i) => els.push(h('circle', { key: 'bl' + i, cx: pnt[0], cy: pnt[1], r: 3 * s, fill: C.blossom })));
      } else {
        const bunches = stage >= 4 ? [[-16, 26], [0, 30], [16, 24]] : [[-10, 26], [12, 28]];
        bunches.forEach((p, bi) => {
          const bx = cx + p[0] * s, by = gy - p[1] * s;
          [[0, 0], [-4, 5], [4, 5], [0, 10], [-2, 15], [2, 20]].slice(0, stage >= 4 ? 6 : 5).forEach((q, qi) =>
            els.push(h('circle', { key: 'g' + bi + qi, cx: bx + q[0] * s, cy: by + q[1] * s, r: 2.6 * s, fill: fruitC })));
        });
      }
      return els;
    }

    let trunkH, ccy, cr, clumps;
    if (form === 'hoch') { trunkH = 50 * s; ccy = gy - trunkH - 20 * s; cr = 17 * s; clumps = [[cx, ccy, 17 * s], [cx - 9 * s, ccy - 15 * s, 14 * s], [cx + 9 * s, ccy - 15 * s, 14 * s], [cx, ccy - 28 * s, 12 * s]]; }
    else if (form === 'breit') { trunkH = 32 * s; ccy = gy - trunkH - 12 * s; cr = 20 * s; clumps = [[cx, ccy, 19 * s], [cx - 22 * s, ccy + 4 * s, 15 * s], [cx + 22 * s, ccy + 4 * s, 15 * s]]; }
    else if (form === 'gross') { trunkH = 48 * s; ccy = gy - trunkH - 18 * s; cr = 28 * s; clumps = [[cx, ccy, 28 * s], [cx - 22 * s, ccy + 6 * s, 21 * s], [cx + 22 * s, ccy + 6 * s, 21 * s], [cx, ccy - 18 * s, 20 * s]]; }
    else if (form === 'busch') { trunkH = 6 * s; ccy = gy - 16 * s; cr = 20 * s; clumps = [[cx, ccy, 20 * s], [cx - 15 * s, ccy + 6 * s, 15 * s], [cx + 15 * s, ccy + 6 * s, 15 * s]]; }
    else { trunkH = 42 * s; ccy = gy - trunkH - 14 * s; cr = 24 * s; clumps = [[cx, ccy, 24 * s], [cx - 17 * s, ccy + 6 * s, 18 * s], [cx + 17 * s, ccy + 6 * s, 18 * s], [cx, ccy - 14 * s, 18 * s]]; }

    if (trunkH > 10 * s) {
      els.push(h('path', { key: 'tr', d: trunkPath(cx, gy, trunkH, 5.5 * s), fill: C.trunk }));
      els.push(h('path', { key: 'br', d: 'M' + cx + ' ' + (gy - trunkH * 0.5) + ' l' + (-13 * s) + ' ' + (-12 * s) + ' M' + cx + ' ' + (gy - trunkH * 0.62) + ' l' + (13 * s) + ' ' + (-11 * s), stroke: C.trunk, strokeWidth: 2 * s, fill: 'none', strokeLinecap: 'round' }));
    }
    canopy(els, clumps, C.leaf, 0.97, 'ca');
    canopy(els, [[cx, ccy - 6 * s, cr * 0.6]], C.leaf2, 0.85, 'cb');

    if (stage === 2) {
      ring(cx, ccy, cr * 0.85, cr * 0.6, 7).forEach((pnt, i) => els.push(h('circle', { key: 'bl' + i, cx: pnt[0], cy: pnt[1], r: 3 * s, fill: C.blossom })));
    } else if (stage >= 3) {
      const n = stage >= 4 ? 6 : 3;
      ring(cx, ccy, cr * 0.78, cr * 0.55, n).forEach((pnt, i) => {
        els.push(h('line', { key: 'fs' + i, x1: pnt[0], y1: pnt[1] - 5 * s, x2: pnt[0], y2: pnt[1] - 1 * s, stroke: C.trunk, strokeWidth: 1 * s }));
        els.push(h('g', { key: 'f' + i }, fruitSilo(h, fruit, fruitC, pnt[0], pnt[1] + 3 * s, 15 * s)));
      });
      if (stage >= 4) els.push(h('g', { key: 'fall' }, fruitSilo(h, fruit, fruitC, cx - cr - 4 * s, gy - 3, 13 * s, 0.95)));
    }
    return els;
  }

  const treeGroups = trees.map((tr) => {
    const slot = SLOTS[tr.key];
    if (!slot) return null;
    const b = getBereich(tr.key);
    const fruitC = isDarkMode ? b.dark : b.light;
    const form = fruitForm(tr.fruit);
    const name = t('obstgarten.b.' + tr.key);
    const { x, gy, s } = slot;
    const clickable = !tr.future;
    const fs = Math.round(9 + 6 * s);
    const go = clickable ? () => onNavigate('chapter', tr.chapterIdx) : undefined;
    return h('g', {
      key: tr.key,
      role: clickable ? 'button' : 'img',
      tabIndex: clickable ? 0 : undefined,
      'aria-label': name + ' — ' + stageLabel(tr),
      style: { cursor: clickable ? 'pointer' : 'default', opacity: tr.future ? 0.82 : 1 },
      onClick: go,
      onKeyDown: clickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } } : undefined,
    },
      h('rect', { key: 'hit', x: x - 34 * s, y: gy - 98 * s, width: 68 * s, height: 104 * s, fill: 'transparent' }),
      ...plant(x, gy, s, tr.fruit, fruitC, form, tr.stage).map((e, i) => React.cloneElement(e, { key: 'p' + i })),
      h('text', { key: 'nm', x, y: gy + 15 + fs * 0.2, textAnchor: 'middle', style: { fontSize: fs + 'px', fill: palette.text, fontWeight: weight.medium, pointerEvents: 'none' } }, name),
      h('text', { key: 'sg', x, y: gy + 15 + fs * 1.15, textAnchor: 'middle', style: { fontSize: (fs - 2) + 'px', fill: palette.mid, pointerEvents: 'none' } }, stageLabel(tr))
    );
  }).filter(Boolean);

  return h('div', { style: { maxWidth: '860px' } },
    h(PageTitle, { palette, icon: h(Icon, { name: 'home', size: 22 }), style: { marginBottom: space.sm + 'px' } }, t('obstgarten.title')),
    h('p', { style: { fontSize: text.body, color: palette.mid, lineHeight: leading.relaxed, margin: '0 0 ' + space.md + 'px 0' } }, t('obstgarten.intro')),
    h('svg', {
      viewBox: '0 0 840 496', width: '100%',
      style: { display: 'block', borderRadius: radius.md, border: '1px solid ' + palette.border },
      role: 'group', 'aria-label': t('obstgarten.title'),
    },
      h('rect', { x: 0, y: 0, width: 840, height: 496, fill: C.sky }),
      h('circle', { cx: 705, cy: 66, r: 32, fill: C.sun }),
      h('path', { d: 'M0 210 Q170 160 350 198 T700 188 T840 205 L840 260 L0 260 Z', fill: C.far }),
      h('path', { d: 'M0 235 Q210 198 440 228 T840 224 L840 496 L0 496 Z', fill: C.mead }),
      h('path', { d: 'M0 300 Q230 272 470 300 T840 304 L840 496 L0 496 Z', fill: C.mead2 }),
      h('path', { d: 'M410 496 Q450 400 390 320 Q356 280 402 236', stroke: C.path, strokeWidth: 26, fill: 'none', strokeLinecap: 'round' }),
      ...treeGroups
    ),
    h('p', { style: { fontSize: text.xs, color: palette.soft, lineHeight: leading.relaxed, marginTop: space.md + 'px' } }, t('obstgarten.legend'))
  );
};

export default Obstgarten;
