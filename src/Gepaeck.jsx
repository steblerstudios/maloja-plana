import React, { useState, useEffect } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { GEGENSTAENDE, gegenstandReadiness } from './data/gepaeck.js';
import { text, weight, space, radius, leading, ease } from './config/tokens.js';

// Mein Gepäck — die Rucksack-Ansicht der Lebensereignisse. Ein Rucksack packt sich
// aus; jeder Lebensbereich ist ein echtes Ausrüstungsstück (Schlüsselbund, Arztkoffer …).
// Einen Gegenstand aufklappen, hineinschauen: die Wege darin. Ein Weg führt in seinen
// bestehenden geführten Ablauf. Ruhig, barrierefrei, separat von Baum und Obstgarten.

export const Gepaeck = ({ palette, t, data, onNavigate, isDarkMode }) => {
  const h = React.createElement;
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [packed, setPacked] = useState(!reduce);   // gepackt → packt sich beim Öffnen einmal aus
  const [openKey, setOpenKey] = useState(null);     // ein Gegenstand offen (ruhiges Akkordeon)

  useEffect(() => {
    if (reduce) return undefined;
    const id = setTimeout(() => setPacked(false), 460);
    return () => clearTimeout(id);
  }, [reduce]);

  // Materialien: Messing/Wachsleinen/Leder aus der Palette, ein paar feste Naturtöne
  // die in beiden Modi lesbar sind (Arztkoffer-Oxblood, Feldflaschen-Stahl, Kistenholz).
  const M = {
    brass: palette.gold, canvas: palette.sage, paper: palette.surface, stroke: 'rgba(0,0,0,.24)', line: 'rgba(0,0,0,.16)',
    oxblood: isDarkMode ? '#A65A4A' : '#8C4A3C', steel: isDarkMode ? '#8A9298' : '#9AA3A8',
    wood: isDarkMode ? '#8A6242' : '#9C6B4A', woodLo: isDarkMode ? '#6E4E34' : '#B4894F',
  };

  // ── Gegenstands-Illustrationen (48er viewBox, gefüllt) ──────────────────────
  const ill = (name) => {
    const wrap = (kids) => h('svg', { viewBox: '0 0 48 48', width: 42, height: 42, 'aria-hidden': 'true', style: { display: 'block' } }, kids);
    if (name === 'key') return wrap([
      h('circle', { key: 1, cx: 15, cy: 24, r: 9, fill: M.brass, stroke: M.stroke, strokeWidth: 1 }),
      h('circle', { key: 2, cx: 15, cy: 24, r: 3.6, fill: M.paper }),
      h('rect', { key: 3, x: 22, y: 22, width: 19, height: 4, rx: 2, fill: M.brass }),
      h('rect', { key: 4, x: 34, y: 26, width: 3, height: 5, rx: 1, fill: M.brass }),
      h('rect', { key: 5, x: 39, y: 26, width: 3, height: 7, rx: 1, fill: M.brass }),
    ]);
    if (name === 'toolroll') return wrap([
      h('rect', { key: 1, x: 7, y: 16, width: 34, height: 22, rx: 4, fill: M.woodLo, stroke: M.stroke, strokeWidth: 1 }),
      h('path', { key: 2, d: 'M15 16v22M23 16v22M31 16v22', stroke: M.line, strokeWidth: 1 }),
      h('rect', { key: 3, x: 10, y: 10, width: 3, height: 8, rx: 1.5, fill: M.canvas }),
      h('circle', { key: 4, cx: 20, cy: 12, r: 3, fill: M.steel }),
      h('rect', { key: 5, x: 27, y: 9, width: 3, height: 9, rx: 1.5, fill: M.oxblood }),
      h('rect', { key: 6, x: 6, y: 22, width: 36, height: 4, rx: 2, fill: M.canvas }),
      h('rect', { key: 7, x: 22, y: 22, width: 6, height: 4, rx: 1, fill: M.brass }),
    ]);
    if (name === 'box') return wrap([
      h('rect', { key: 1, x: 8, y: 20, width: 32, height: 18, rx: 3, fill: M.wood, stroke: M.stroke, strokeWidth: 1 }),
      h('rect', { key: 2, x: 6, y: 14, width: 36, height: 8, rx: 2, fill: M.woodLo, stroke: M.line, strokeWidth: 1 }),
      h('rect', { key: 3, x: 21, y: 20, width: 6, height: 18, fill: M.oxblood, opacity: 0.85 }),
      h('rect', { key: 4, x: 21, y: 18, width: 6, height: 4, rx: 1, fill: M.brass }),
    ]);
    if (name === 'doctorbag') return wrap([
      h('path', { key: 1, d: 'M9 20q0-4 4-4h22q4 0 4 4v18H9z', fill: M.oxblood, stroke: M.stroke, strokeWidth: 1 }),
      h('path', { key: 2, d: 'M18 16v-3q0-2 2-2h8q2 0 2 2v3', fill: 'none', stroke: M.oxblood, strokeWidth: 2 }),
      h('path', { key: 3, d: 'M9 22h30', stroke: M.line, strokeWidth: 1 }),
      h('rect', { key: 4, x: 21, y: 24, width: 6, height: 10, rx: 1, fill: M.paper }),
      h('rect', { key: 5, x: 19, y: 27, width: 10, height: 4, rx: 1, fill: M.paper }),
      h('rect', { key: 6, x: 22, y: 15, width: 4, height: 4, rx: 1, fill: M.brass }),
    ]);
    if (name === 'flask') return wrap([
      h('rect', { key: 1, x: 19, y: 8, width: 10, height: 6, rx: 2, fill: M.canvas }),
      h('rect', { key: 2, x: 16, y: 14, width: 16, height: 26, rx: 7, fill: M.steel, stroke: M.stroke, strokeWidth: 1 }),
      h('rect', { key: 3, x: 16, y: 22, width: 16, height: 5, fill: M.canvas }),
      h('path', { key: 4, d: 'M20 30h8M20 34h8', stroke: M.line, strokeWidth: 1 }),
      h('rect', { key: 5, x: 21, y: 16, width: 6, height: 4, rx: 1, fill: M.brass }),
    ]);
    return wrap([
      h('rect', { key: 1, x: 8, y: 14, width: 32, height: 22, rx: 2, fill: M.paper, stroke: M.stroke, strokeWidth: 1 }),
      h('path', { key: 2, d: 'M8 15l16 12 16-12', fill: 'none', stroke: M.line, strokeWidth: 1.4 }),
      h('circle', { key: 3, cx: 24, cy: 30, r: 4.5, fill: M.oxblood }),
      h('path', { key: 4, d: 'M22.5 30l1.2 1.2 2-2.2', stroke: M.paper, strokeWidth: 1.2, fill: 'none', strokeLinecap: 'round' }),
    ]);
  };

  // ── Der Rucksack (klickbar: ein-/auspacken) ─────────────────────────────────
  const bag = h('button', {
    onClick: () => setPacked((p) => !p),
    'aria-label': packed ? t('gepaeck.unpack') : t('gepaeck.pack'),
    style: { appearance: 'none', background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: '128px' },
  },
    h('svg', { viewBox: '0 0 200 220', width: '100%', 'aria-hidden': 'true', style: { display: 'block' } },
      h('path', { d: 'M74 44 C55 72 58 112 68 158', fill: 'none', stroke: 'rgba(0,0,0,.16)', strokeWidth: 12, strokeLinecap: 'round' }),
      h('path', { d: 'M126 44 C145 72 142 112 132 158', fill: 'none', stroke: 'rgba(0,0,0,.16)', strokeWidth: 12, strokeLinecap: 'round' }),
      h('rect', { x: 34, y: 52, width: 132, height: 156, rx: 26, fill: M.canvas }),
      h('rect', { x: 34, y: 52, width: 132, height: 156, rx: 26, fill: 'rgba(0,0,0,.05)' }),
      h('rect', { x: 58, y: 132, width: 84, height: 62, rx: 15, fill: M.canvas, stroke: M.line, strokeWidth: 1 }),
      h('rect', { x: 58, y: 132, width: 84, height: 62, rx: 15, fill: 'rgba(0,0,0,.08)' }),
      h('path', { d: 'M66 158 H134', stroke: M.brass, strokeWidth: 3, strokeLinecap: 'round' }),
      h('circle', { cx: 100, cy: 158, r: 5, fill: M.brass }),
      h('path', { d: 'M100 158 v9', stroke: M.brass, strokeWidth: 2.5, strokeLinecap: 'round' }),
      h('path', { d: 'M38 82 q0 -22 22 -22 h80 q22 0 22 22 v8 q-62 16 -124 0 z', fill: M.canvas, stroke: M.line, strokeWidth: 1 }),
      h('rect', { x: 74, y: 84, width: 12, height: 40, rx: 4, fill: 'rgba(0,0,0,.12)' }),
      h('rect', { x: 114, y: 84, width: 12, height: 40, rx: 4, fill: 'rgba(0,0,0,.12)' }),
      h('rect', { x: 72, y: 112, width: 16, height: 9, rx: 2, fill: M.brass }),
      h('rect', { x: 112, y: 112, width: 16, height: 9, rx: 2, fill: M.brass }),
      h('path', { d: 'M86 56 q14 -12 28 0', fill: 'none', stroke: M.brass, strokeWidth: 5, strokeLinecap: 'round' }),
    ),
  );

  const toggle = h('button', {
    onClick: () => setPacked((p) => !p),
    style: {
      fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.medium, cursor: 'pointer',
      color: palette.text, background: palette.gold + '22', border: '1px solid ' + palette.gold + '55',
      borderRadius: '999px', padding: space.xs + 'px ' + space.md + 'px', marginTop: space.sm + 'px',
    },
  }, packed ? t('gepaeck.unpack') : t('gepaeck.pack'));

  // ── Ein Weg (Ereignis) → führt in seinen bestehenden Ablauf ─────────────────
  const chip = (w) => h('button', {
    key: w.key, onClick: () => onNavigate(w.view),
    style: {
      display: 'flex', alignItems: 'center', gap: space.sm + 'px', width: '100%', textAlign: 'left',
      background: palette.surface, border: '1px solid ' + palette.border, borderLeft: '3px solid ' + palette.sage,
      borderRadius: radius.sm, padding: space.xs + 'px ' + space.sm + 'px', marginBottom: space.xs + 'px',
      cursor: 'pointer', fontFamily: 'inherit', transition: 'transform 160ms ' + ease,
    },
  },
    h('span', {
      style: {
        width: '26px', height: '26px', borderRadius: radius.sm, flexShrink: 0,
        background: palette.gold, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      },
    }, h('svg', { viewBox: '0 0 24 24', width: 15, height: 15, fill: 'none', stroke: '#3a2c14', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
      w.g.map((d, i) => h('path', { key: i, d })))),
    h('span', { style: { flex: 1, minWidth: 0, fontSize: text.sm, fontWeight: weight.medium, color: palette.text } }, t('gepaeck.w.' + w.key)),
    h('span', { 'aria-hidden': 'true', style: { color: palette.sandDeep, fontWeight: weight.medium, flexShrink: 0 } }, '→'),
  );

  // ── Ein Gegenstand (Karte, aufklappbar) ─────────────────────────────────────
  // Reife-Pünktchen: ein Punkt je geprüftem Feld, gefüllt = erfasst (echte Daten).
  const dots = (r) => h('span', {
    role: 'img', 'aria-label': t('gepaeck.packed', { done: r.done, total: r.total }),
    style: { display: 'inline-flex', gap: '3px', marginTop: '5px' },
  }, Array.from({ length: r.total }, (_, k) => h('span', {
    key: k, 'aria-hidden': 'true',
    style: { width: '6px', height: '6px', borderRadius: '50%', background: k < r.done ? palette.gold : palette.border },
  })));

  const card = (g, i) => {
    const open = openKey === g.key;
    const count = g.wege.length;
    const r = gegenstandReadiness(g.key, data);
    return h('div', {
      key: g.key,
      style: {
        background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.md, overflow: 'hidden',
        opacity: packed ? 0 : 1, transform: packed ? 'translateY(-18px) scale(.95)' : 'none',
        transition: 'opacity 480ms ' + ease + ' ' + (packed ? 0 : i * 60) + 'ms, transform 480ms ' + ease + ' ' + (packed ? 0 : i * 60) + 'ms',
      },
    },
      h('button', {
        onClick: () => setOpenKey(open ? null : g.key), 'aria-expanded': open,
        style: {
          display: 'flex', alignItems: 'center', gap: space.sm + 'px', width: '100%', textAlign: 'left',
          background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: space.sm + 'px ' + space.md + 'px',
        },
      },
        h('span', { style: { flexShrink: 0 } }, ill(g.ill)),
        h('span', { style: { flex: 1, minWidth: 0 } },
          h('span', { style: { display: 'block', fontSize: text.body, fontWeight: weight.semi, color: palette.text } }, t('gepaeck.obj.' + g.key)),
          h('span', { style: { display: 'block', fontSize: text.xs, color: palette.mid, marginTop: '1px' } },
            t('gepaeck.objSub.' + g.key) + ' · ' + (count === 1 ? t('gepaeck.wegeOne') : t('gepaeck.wege', { n: count }))),
          dots(r),
        ),
        h('span', {
          'aria-hidden': 'true',
          style: {
            width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, background: palette.gold,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#3a2c14',
            transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 300ms ' + ease,
          },
        }, h('svg', { viewBox: '0 0 24 24', width: 13, height: 13, fill: 'none', stroke: '#3a2c14', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }, h('path', { d: 'M6 9l6 6 6-6' }))),
      ),
      h('div', {
        style: {
          maxHeight: open ? '520px' : '0', opacity: open ? 1 : 0, overflow: 'hidden',
          transition: 'max-height 400ms ' + ease + ', opacity 260ms ' + ease,
          background: palette.up, margin: '0 ' + space.sm + 'px', borderRadius: radius.sm,
        },
      },
        h('div', { style: { padding: space.sm + 'px ' + space.sm + 'px ' + space.xs + 'px', borderTop: '1px dashed ' + palette.border, marginBottom: open ? space.sm + 'px' : 0 } },
          g.wege.map((w) => chip(w))),
      ),
    );
  };

  const backpackIcon = h('svg', { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' },
    h('path', { d: 'M6 8a6 6 0 0 1 12 0v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z' }),
    h('path', { d: 'M9 8a3 3 0 0 1 6 0' }), h('path', { d: 'M9 14h6' }));

  // Ruhige Breite: die App deckelt jede Ansicht app-weit auf ~780px (Lese-Spalte in
  // #mp-main). Innerhalb davon ist das Raster mehrspaltig — 2 Spalten auf Laptop/breit,
  // 1 auf dem Handy. Echte 3 Spalten bräuchten Gepäck als eigenen, breiteren „Raum"
  // (House-of-Life-Vision) — bewusst später. Text bleibt zusätzlich auf 680px lesbar.
  return h('div', { style: { maxWidth: '860px' } },
    h(PageTitle, { palette, icon: backpackIcon, style: { marginBottom: space.sm + 'px' } }, t('gepaeck.title')),
    h('p', { style: { fontSize: text.body, color: palette.mid, lineHeight: leading.relaxed, maxWidth: '680px', margin: '0 0 ' + space.md + 'px 0' } }, t('gepaeck.intro')),
    h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: space.lg + 'px' } }, bag, toggle),
    h('div', {
      style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: space.md + 'px', alignItems: 'start' },
    }, GEGENSTAENDE.map((g, i) => card(g, i))),
    h('p', { style: { fontSize: text.xs, color: palette.soft, lineHeight: leading.relaxed, maxWidth: '680px', marginTop: space.lg + 'px' } }, t('gepaeck.legend')),
  );
};

export default Gepaeck;
