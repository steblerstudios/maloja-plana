import React from 'react';
import { Gauge } from './Gauge.jsx';
import { reserveTankState } from '../data/reserveTank.js';
import { text, space, leading } from '../config/tokens.js';

// Reserve-Tankanzeige: das dritte „Instrument", wieder über dem Gauge-Primitiv
// (wie der Franchise-Tacho). Zeigt, wie viele Monate der liquide Notgroschen
// trägt. Zone sand = aufbauen (unter Empfehlung), sage = tragfähig (darüber),
// Marke bei der Empfehlung. Ruhig, kein Alarm — dünn = Ziel, nicht Versagen.
const num = (n) => Number(n || 0).toLocaleString('de-CH', { maximumFractionDigits: 0 });
const num1 = (n) => Number(n || 0).toLocaleString('de-CH', { maximumFractionDigits: 1 });

export const ReserveTank = ({ palette, t, savings, monthlyExpenses }) => {
  const st = reserveTankState({ savings, monthlyExpenses });
  if (!st.show) return null;
  const h = React.createElement;

  const readout =
    st.mode === 'noexpenses' ? t('finanzUebersicht.tankOrientation')
    : st.level === 'empty' ? t('finanzUebersicht.tankReadoutEmpty', { recommend: st.recommendMonths })
    : t('finanzUebersicht.tankReadout', { savings: num(st.savings), months: num1(st.months), recommend: st.recommendMonths });
  const readoutColor =
    st.mode === 'noexpenses' ? palette.mid
    : (st.level === 'strong' || st.level === 'ok') ? palette.sage
    : palette.sand;

  const zones = [
    { from: 0, to: st.recommendMonths, color: palette.sand, opacity: 0.85 },
    { from: st.recommendMonths, to: st.fullMonths, color: palette.sage, opacity: 0.85 },
  ];
  const markers = [{ value: st.recommendMonths, label: t('finanzUebersicht.tankMark'), color: palette.mid }];

  return h('div', { style: { marginBottom: space.md + 'px' } },
    h(Gauge, {
      palette, value: st.needle, min: 0, max: st.fullMonths, zones, markers,
      needleColor: palette.text,
      endLabels: { left: t('finanzUebersicht.tankEmpty'), right: t('finanzUebersicht.tankFull') },
      ariaLabel: readout,
    }),
    h('div', { style: { fontSize: text.sm, color: readoutColor, lineHeight: leading.normal, textAlign: 'center', marginTop: space.sm + 'px' } }, readout)
  );
};

export default ReserveTank;
