import React from 'react';
import { Icon } from './IconSystem.jsx';
import { calculateIPV } from './config/cantonalData.js';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';

// WHO / UNO SDG-Indikator 3.8.2: Gesundheitsausgaben über 10% des Einkommens
// gelten als "katastrophale" (belastende) Ausgaben. Ruhige Orientierung, kein Alarm.
const WHO_THRESHOLD = 10;

// Zeigt die Grundversicherungs-Prämie als % des Einkommens gegen den WHO-Richtwert.
// Rendert nichts, wenn Prämie oder Einkommen fehlen (kein Druck, calm UX).
export const KKLastCard = ({ palette, t, data, onNavigate }) => {
  const premium = Number(data?.versicherungen?.kkPremium) || 0;
  const income = Number(data?.finanzen?.monthlyIncome) || 0;
  if (premium <= 0 || income <= 0) return null;

  const share = (premium / income) * 100;
  const shareRounded = Math.round(share * 10) / 10;
  const over = share >= WHO_THRESHOLD;
  const accent = over ? palette.gold : palette.sage; // ruhig, kein Alarm-Rot

  const scaleMax = Math.max(20, Math.ceil(share / 5) * 5);
  const fillPct = Math.min(100, (share / scaleMax) * 100);
  const markerPct = (WHO_THRESHOLD / scaleMax) * 100;

  // IPV-Fairness (Petitions-Saat): zeigt, was die Prämienverbilligung ausmacht
  // (falls Anrecht) und wie viel nach IPV noch über der 10%-Linie bleibt.
  const ipv = calculateIPV(data);
  const ipvAmount = ipv.eligible ? Math.min(premium, Math.max(0, ipv.amount || 0)) : 0;
  const netPremium = Math.max(0, premium - ipvAmount);
  const netShare = (netPremium / income) * 100;
  const netShareRounded = Math.round(netShare * 10) / 10;
  const netFillPct = Math.min(100, (netShare / scaleMax) * 100);
  const gapMonthly = Math.round(Math.max(0, netPremium - (WHO_THRESHOLD / 100) * income));
  // Fairness-Block nur, wenn die Prämie allein über dem 10%-Richtwert liegt.
  const showFairness = over;

  return React.createElement('div', {
    style: {
      padding: space.md + 'px', background: palette.up, borderRadius: radius.sm,
      border: '1px solid ' + palette.border, marginBottom: '16px',
    }
  },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.sm, marginBottom: space.xs } },
      React.createElement(Icon, { name: 'health', size: 16 }),
      React.createElement('span', { style: { fontWeight: weight.semi, fontSize: text.body } }, t('kkLast.title'))
    ),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.text, marginBottom: space.sm, lineHeight: leading.normal } },
      t('kkLast.share', { share: shareRounded })
    ),
    // Ruhiger Balken mit 10%-Marker
    React.createElement('div', { style: { position: 'relative', height: '8px', background: palette.border, borderRadius: '4px', marginBottom: '4px' } },
      React.createElement('div', { style: { height: '100%', width: fillPct + '%', background: accent, borderRadius: '4px' } }),
      // IPV-Anteil (was die Verbilligung von der Last abnimmt) hellblau über dem rechten Teil
      ipvAmount > 0 && React.createElement('div', { style: { position: 'absolute', top: 0, bottom: 0, left: netFillPct + '%', width: Math.max(0, fillPct - netFillPct) + '%', background: palette.sky, borderRadius: '0 4px 4px 0' } }),
      React.createElement('div', { style: { position: 'absolute', top: '-3px', bottom: '-3px', left: markerPct + '%', width: '2px', background: palette.text } })
    ),
    React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginBottom: space.sm } }, t('kkLast.marker10')),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: space.xs } },
      over ? t('kkLast.overNote') : t('kkLast.underNote')
    ),
    // IPV-Fairness: Entlastung (falls Anrecht) + Restlücke bis 10%
    showFairness && ipvAmount > 0 && React.createElement('div', { style: { fontSize: text.sm, color: palette.sky, lineHeight: leading.normal, marginBottom: space.xs, fontWeight: weight.medium } },
      t('kkLast.ipvRelief', { ipv: ipvAmount, share: netShareRounded })
    ),
    showFairness && ipvAmount === 0 && ipv && !ipv.eligible && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: space.xs } },
      t('kkLast.ipvNoClaim')
    ),
    showFairness && netShare > WHO_THRESHOLD && gapMonthly > 0 && React.createElement('div', { style: { fontSize: text.sm, color: accent, lineHeight: leading.normal, marginBottom: space.xs, fontWeight: weight.medium } },
      t('kkLast.gapToTen', { gap: gapMonthly })
    ),
    showFairness && ipvAmount > 0 && netShare <= WHO_THRESHOLD && React.createElement('div', { style: { fontSize: text.sm, color: palette.sage, lineHeight: leading.normal, marginBottom: space.xs } },
      t('kkLast.underWithIpv')
    ),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, t('kkLast.whoNote')),
    React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs } }, renderSource(t('kkLast.source'))),
    over && onNavigate && React.createElement('button', {
      type: 'button',
      onClick: () => onNavigate('premium'),
      style: {
        marginTop: space.sm, background: 'none', border: '1px solid ' + palette.border,
        borderRadius: radius.sm, padding: '6px 12px', fontSize: text.sm, color: palette.text,
        cursor: 'pointer', fontFamily: 'inherit',
      }
    }, t('kkLast.ipvLink'))
  );
};

export default KKLastCard;
