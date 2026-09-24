import React from 'react';
import { Gauge } from './Gauge.jsx';
import { tachoState } from '../data/franchiseTacho.js';
import { text, weight, space, leading } from '../config/tokens.js';
import { zahl } from '../utils/geld.js';

// Franchise-Tacho: das erste „Instrument". Liest die bestehende Franchise-
// Optimierer-Logik (franchiseOpt) als Halbkreis-Skala — Break-even als Marke,
// Zeiger = laufende Gesundheitskosten dieses Jahr. Ruhige Zonen (sage = hohe
// Franchise günstiger, sand = tiefe Franchise günstiger), kein Alarm-Rot.
// Die numerischen Zeilen (Ersparnis/Reserve/Reserve-Check) bleiben darunter.
// num: Schweizer Tausender-Trennung ohne Währungspräfix (die Sätze bringen „CHF" selbst mit).
// fmt: mit „CHF " — nur für die Skalen-Enden, wo kein Satz drumherum steht.
const num = (n) => zahl(n || 0);
const fmt = (n) => 'CHF ' + num(n);

export const FranchiseTacho = ({ palette, t, franchiseOpt, costs, onNavigate }) => {
  const st = tachoState(franchiseOpt, costs);
  if (!st.show) return null;
  const h = React.createElement;

  const readout =
    st.mode === 'orientation' ? t('po.tachoOrientation')
    : st.mode === 'below' ? t('po.tachoReadoutBelow', { costs: num(st.costs), be: num(st.breakEven), high: num(st.high) })
    : t('po.tachoReadoutAbove', { costs: num(st.costs), be: num(st.breakEven), low: num(st.low) });
  // sageDeep, nicht sage: die Ableselinie ist Text (4.5:1), nicht eine Zonenfläche (3:1).
  // sage als Text lag hier bei 4.35:1 dunkel und 4.11:1 hell — beides unter AA.
  const readoutColor = st.mode === 'below' ? (palette.sageDeep || palette.sage) : st.mode === 'above' ? palette.sandDeep : palette.mid;

  const zones = [
    { from: 0, to: st.breakEven, color: palette.sage, opacity: 0.85 },
    { from: st.breakEven, to: st.scaleMax, color: palette.sandDeep, opacity: 0.85 },
  ];
  const markers = [{ value: st.breakEven, label: t('po.tachoBreakeven'), color: palette.mid }];

  const swatch = (color, label) => h('span', {
    style: { display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: text.xs, color: palette.mid },
  },
    h('span', { style: { width: '10px', height: '10px', borderRadius: '2px', background: color, flexShrink: 0 }, 'aria-hidden': true }),
    label);

  return h('div', { style: { marginBottom: space.md + 'px' } },
    h(Gauge, {
      palette, value: st.needle, min: 0, max: st.scaleMax, zones, markers,
      needleColor: palette.text,
      endLabels: { left: fmt(0), right: fmt(st.scaleMax) },
    }),
    h('div', {
      style: { display: 'flex', justifyContent: 'center', gap: space.md + 'px', flexWrap: 'wrap', margin: space.xs + 'px 0 ' + space.sm + 'px' },
    },
      swatch(palette.sage, t('po.tachoLegendHigh')),
      swatch(palette.sandDeep, t('po.tachoLegendLow'))
    ),
    h('div', { style: { fontSize: text.sm, color: readoutColor, lineHeight: leading.normal, textAlign: 'center' } }, readout),
    st.mode === 'orientation' && onNavigate && h('button', {
      onClick: () => onNavigate('kvg', null, 'franchise'),
      style: { display: 'block', margin: space.xs + 'px auto 0', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium },
    }, t('po.tachoTrackLink'))
  );
};

export default FranchiseTacho;
