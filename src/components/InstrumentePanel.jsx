import React from 'react';
import { schildState } from '../data/schutzschild.js';
import { reserveTankState } from '../data/reserveTank.js';
import { kompassBearing } from '../data/leistungsKompass.js';
import { monthlyExpenses } from '../data/haushaltskosten.js';
import { calculateIPV, calculateSozialhilfe, checkELEligibility } from '../config/cantonalData.js';
import { text, weight, space, radius, leading, duration, ease } from '../config/tokens.js';

// Dashboard-Spiegel der vier „Instrumente": eine kompakte Reihe, die jedes
// Instrument als Mini-Glyph + Peilung + Ort zeigt und in die Detailansicht führt.
// Live wo es günstig/robust ist (Schild, Tankanzeige, Kompass — reine Zustands-
// Funktionen). Der Tacho braucht die Prämien-Pipeline → hier bewusst nur
// Einstieg statt gefälschtem Zeiger (Ehrlichkeit).

// ── Mini-Glyphen (ohne Text, damit sie klein lesbar bleiben) ──
const gp = (f, r, cx, cy) => { const a = Math.PI * (1 - Math.max(0, Math.min(1, f))); return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; };
const garc = (f1, f2, r, cx, cy) => { const [x1, y1] = gp(f1, r, cx, cy); const [x2, y2] = gp(f2, r, cx, cy); return 'M ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A ' + r + ' ' + r + ' 0 0 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1); };

const miniGauge = (palette, { split = 0.5, left, right, needle }) => {
  const h = React.createElement;
  const cx = 30, cy = 30, r = 24;
  const els = [
    h('path', { key: 't', d: garc(0, 1, r, cx, cy), fill: 'none', stroke: palette.border, strokeWidth: 6, strokeLinecap: 'round' }),
    h('path', { key: 'l', d: garc(0, split, r, cx, cy), fill: 'none', stroke: left, strokeWidth: 6 }),
    h('path', { key: 'rr', d: garc(split, 1, r, cx, cy), fill: 'none', stroke: right, strokeWidth: 6 }),
  ];
  if (needle != null) {
    const [nx, ny] = gp(needle, r - 5, cx, cy);
    els.push(h('line', { key: 'n', x1: cx, y1: cy, x2: nx, y2: ny, stroke: palette.text, strokeWidth: 2.5, strokeLinecap: 'round' }));
  } else {
    const [mx1, my1] = gp(split, r - 4, cx, cy); const [mx2, my2] = gp(split, r + 3, cx, cy);
    els.push(h('line', { key: 'm', x1: mx1, y1: my1, x2: mx2, y2: my2, stroke: palette.mid, strokeWidth: 2 }));
  }
  els.push(h('circle', { key: 'h', cx, cy, r: 4, fill: palette.surface, stroke: palette.text, strokeWidth: 2 }));
  return h('svg', { viewBox: '0 0 60 40', width: 60, height: 40, style: { overflow: 'visible' }, 'aria-hidden': true }, els);
};

const miniCompass = (palette, bearing, state) => {
  const h = React.createElement;
  const cx = 22, cy = 22;
  const north = state === 'found' ? palette.sage : state === 'none' ? palette.sky : palette.mid;
  return h('svg', { viewBox: '0 0 44 44', width: 44, height: 44, 'aria-hidden': true },
    h('circle', { cx, cy, r: 18, fill: 'none', stroke: palette.border, strokeWidth: 2 }),
    h('g', { transform: 'rotate(' + bearing + ' ' + cx + ' ' + cy + ')' },
      h('polygon', { points: cx + ',7 ' + (cx + 4) + ',' + cy + ' ' + (cx - 4) + ',' + cy, fill: north, opacity: state === 'idle' ? 0.5 : 1 }),
      h('polygon', { points: cx + ',37 ' + (cx + 4) + ',' + cy + ' ' + (cx - 4) + ',' + cy, fill: palette.mid, opacity: 0.35 })
    ),
    h('circle', { cx, cy, r: 3, fill: palette.surface, stroke: palette.mid, strokeWidth: 1.5 })
  );
};

const SHIELD = 'M18 3 L31 8.5 L31 20 Q31 30 18 38 Q5 30 5 20 L5 8.5 Z';
const miniShield = (palette, fraction) => {
  const h = React.createElement;
  const top = 3, bottom = 38;
  const fh = fraction * (bottom - top);
  return h('svg', { viewBox: '0 0 36 42', width: 36, height: 42, 'aria-hidden': true },
    h('defs', null, h('clipPath', { id: 'mini-shield-clip' }, h('path', { d: SHIELD }))),
    h('g', { clipPath: 'url(#mini-shield-clip)' },
      h('rect', { x: 3, y: 0, width: 30, height: 42, fill: palette.up }),
      h('rect', { x: 3, y: bottom - fh, width: 30, height: fh + 2, fill: palette.sage, opacity: 0.85 })
    ),
    h('path', { d: SHIELD, fill: 'none', stroke: palette.sage, strokeWidth: 2 })
  );
};

export const InstrumentePanel = ({ palette, t, data, onNavigate }) => {
  const h = React.createElement;
  const v = data?.versicherungen || {};
  const shield = schildState(v, {
    employed: data?.finanzen?.employmentType === 'employed',
    annualIncome: (Number(data?.finanzen?.monthlyIncome) || 0) * 12,
  });
  const tank = reserveTankState({ savings: Number(data?.finanzen?.savingsAccount) || 0, monthlyExpenses: monthlyExpenses(data) });

  // Kompass-Peilung: Leistungszahl wie im Schnellcheck (gleiche Gates, gleiche Engine).
  let benefitCount = 0;
  const hasIncome = (Number(data?.finanzen?.monthlyIncome) || 0) > 0;
  try {
    const income = Number(data?.finanzen?.monthlyIncome) || 0;
    const rent = Number(data?.wohnen?.rentAmount) || 0;
    const canton = data?.basis?.canton;
    if (income > 0 && canton && calculateIPV(data)?.eligible) benefitCount++;
    if (rent > 0) { const sh = calculateSozialhilfe(data); if (sh?.eligible && (sh?.vermoegenUeberFreibetrag || 0) === 0) benefitCount++; }
    if (checkELEligibility(data)?.eligible) benefitCount++;
  } catch { /* Orientierung, nie blockierend */ }
  const kompass = kompassBearing({ hasIncome, benefitCount });

  const setup = t('instrumente.setup');
  const tiles = [
    {
      key: 'tacho', name: t('instrumente.tacho'), sub: t('instrumente.tachoSub'),
      glyph: miniGauge(palette, { split: 0.5, left: palette.sage, right: palette.sand }),
      onClick: () => onNavigate('praemien'),
    },
    {
      key: 'kompass', name: t('instrumente.kompass'),
      sub: kompass.state === 'found'
          ? (benefitCount === 1 ? t('instrumente.kompassFoundOne') : t('instrumente.kompassFound', { n: benefitCount }))
        : kompass.state === 'none' ? t('instrumente.kompassNone') : setup,
      glyph: miniCompass(palette, kompass.bearing, kompass.state),
      onClick: () => onNavigate('schnellcheck'),
    },
    {
      key: 'tank', name: t('instrumente.tank'),
      sub: tank.mode === 'months' ? t('instrumente.tankMonths', { months: tank.months }) : setup,
      glyph: miniGauge(palette, { split: 0.5, left: palette.sand, right: palette.sage, needle: tank.mode === 'months' ? tank.needle / tank.fullMonths : null }),
      onClick: () => onNavigate('finanzuebersicht'),
    },
    {
      key: 'schild', name: t('instrumente.schild'),
      sub: shield.touched ? t('instrumente.schildCount', { covered: shield.overall.covered, total: shield.overall.total }) : setup,
      glyph: miniShield(palette, shield.touched ? shield.overall.fraction : 0),
      onClick: () => onNavigate('chapter', 3),
    },
  ];

  return h('div', { style: { marginBottom: space.xl + 'px' } },
    h('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, margin: '0 0 ' + space.xs + 'px 0' } }, t('instrumente.title')),
    h('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.md + 'px 0', lineHeight: leading.relaxed } }, t('instrumente.intro')),
    h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: space.sm + 'px' } },
      tiles.map(tile => h('button', {
        key: tile.key,
        onClick: tile.onClick,
        style: {
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
          padding: space.md + 'px', background: 'transparent', color: palette.text,
          border: '1px solid ' + palette.border + '44', borderRadius: radius.md,
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center',
          transition: 'background ' + duration.normal + 'ms ' + ease + ', border-color ' + duration.normal + 'ms ' + ease,
        },
        onMouseEnter: (e) => { e.currentTarget.style.background = palette.up; e.currentTarget.style.borderColor = palette.sage + '55'; },
        onMouseLeave: (e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = palette.border + '44'; },
      },
        h('div', { style: { height: '44px', display: 'flex', alignItems: 'center' } }, tile.glyph),
        h('div', { style: { fontSize: text.sm, fontWeight: weight.medium } }, tile.name),
        h('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal } }, tile.sub)
      ))
    )
  );
};

export default InstrumentePanel;
