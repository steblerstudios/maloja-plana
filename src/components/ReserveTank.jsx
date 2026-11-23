import React from 'react';
import { Gauge, halbkreisBogen, halbkreisPunkt } from './Gauge.jsx';
import { reserveTankState } from '../data/reserveTank.js';
import { text, space, leading, INSTRUMENT_GROESSE } from '../config/tokens.js';
import { zahl } from '../utils/geld.js';

// Reserve-Tankanzeige: das dritte „Instrument", wieder über dem Gauge-Primitiv
// (wie der Franchise-Tacho). Zeigt, wie viele Monate der liquide Notgroschen
// trägt. Zone sand = aufbauen (unter Empfehlung), sage = tragfähig (darüber),
// Marke bei der Empfehlung. Ruhig, kein Alarm — dünn = Ziel, nicht Versagen.
const num = (n) => zahl(n || 0);
const num1 = (n) => zahl(n || 0, { hoechstens: 1 });

// Der kleine Tank (64 px, Brand Book §7b «Spiegel Startseite»): nur das Bild, keine Wörter darin —
// die Zahl steht daneben. Eigene Strichstärken, weil die grosse Zeichnung auf 64 px verkleinert
// Striche unter 1 px hätte. Dieselbe Teilung bei «empfohlen» wie gross (recommend / full).
// Bis 10.11.2026 als miniGauge in InstrumentePanel.jsx.
const kleinerTank = (palette, st) => {
  const h = React.createElement;
  const cx = 30, cy = 30, r = 24, split = st.recommendMonths / st.fullMonths;
  const els = [
    h('path', { key: 't', d: halbkreisBogen(0, 1, r, cx, cy), fill: 'none', stroke: palette.border, strokeWidth: 6, strokeLinecap: 'round' }),
    h('path', { key: 'l', d: halbkreisBogen(0, split, r, cx, cy), fill: 'none', stroke: palette.sandDeep, strokeWidth: 6 }),
    h('path', { key: 'rr', d: halbkreisBogen(split, 1, r, cx, cy), fill: 'none', stroke: palette.sage, strokeWidth: 6 }),
  ];
  if (st.mode === 'months') {
    const [nx, ny] = halbkreisPunkt(st.needle / st.fullMonths, r - 5, cx, cy);
    els.push(h('line', { key: 'n', x1: cx, y1: cy, x2: nx, y2: ny, stroke: palette.text, strokeWidth: 2.5, strokeLinecap: 'round' }));
  } else {
    const [mx1, my1] = halbkreisPunkt(split, r - 4, cx, cy); const [mx2, my2] = halbkreisPunkt(split, r + 3, cx, cy);
    els.push(h('line', { key: 'm', x1: mx1, y1: my1, x2: mx2, y2: my2, stroke: palette.mid, strokeWidth: 2 }));
  }
  els.push(h('circle', { key: 'h', cx, cy, r: 4, fill: palette.surface, stroke: palette.text, strokeWidth: 2 }));
  return h('svg', { viewBox: '0 0 60 40', width: '100%', style: { maxWidth: INSTRUMENT_GROESSE.klein + 'px', overflow: 'visible', height: 'auto', display: 'block' }, 'aria-hidden': true, 'data-tank': 'klein' }, els);
};

// groesse (10.11.2026, nach dem Muster NetzSchild): gross = Zuhause (Bild 256 px + Ablesesatz) ·
// klein = Spiegel (Kapitelzeile, Übersicht): nur das Bild. EIN Zeichen für den Notgroschen.
export const ReserveTank = ({ palette, t, savings, monthlyExpenses, groesse = 'gross' }) => {
  const st = reserveTankState({ savings, monthlyExpenses });
  if (!st.show) return null;
  const h = React.createElement;
  if (groesse === 'klein') return kleinerTank(palette, st);

  const readout =
    st.mode === 'noexpenses' ? t('finanzUebersicht.tankOrientation')
    : st.level === 'empty' ? t('finanzUebersicht.tankReadoutEmpty', { recommend: st.recommendMonths })
    : t('finanzUebersicht.tankReadout', { savings: num(st.savings), months: num1(st.months), recommend: st.recommendMonths });
  // sageDeep, nicht sage: die Ableselinie ist Text (4.5:1), nicht eine Zonenfläche (3:1).
  const readoutColor =
    st.mode === 'noexpenses' ? palette.mid
    : (st.level === 'strong' || st.level === 'ok') ? (palette.sageDeep || palette.sage)
    : palette.sandDeep;

  const zones = [
    { from: 0, to: st.recommendMonths, color: palette.sandDeep, opacity: 0.85 },
    { from: st.recommendMonths, to: st.fullMonths, color: palette.sage, opacity: 0.85 },
  ];
  const markers = [{ value: st.recommendMonths, label: t('finanzUebersicht.tankMark'), color: palette.mid }];

  return h('div', { style: { marginBottom: space.md + 'px' } },
    h(Gauge, {
      palette, value: st.needle, min: 0, max: st.fullMonths, zones, markers,
      needleColor: palette.text, maxBreite: INSTRUMENT_GROESSE.gross,
      endLabels: { left: t('finanzUebersicht.tankEmpty'), right: t('finanzUebersicht.tankFull') },
    }),
    h('div', { style: { fontSize: text.sm, color: readoutColor, lineHeight: leading.normal, textAlign: 'center', marginTop: space.sm + 'px' } }, readout)
  );
};

export default ReserveTank;
