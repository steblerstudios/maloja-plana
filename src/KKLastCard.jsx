import React from 'react';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius, leading } from './config/tokens.js';

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
      React.createElement('div', { style: { position: 'absolute', top: '-3px', bottom: '-3px', left: markerPct + '%', width: '2px', background: palette.text } })
    ),
    React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginBottom: space.sm } }, t('kkLast.marker10')),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: space.xs } },
      over ? t('kkLast.overNote') : t('kkLast.underNote')
    ),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, t('kkLast.whoNote')),
    React.createElement('div', { style: { fontSize: text.xs, color: palette.soft, marginTop: space.xs } }, t('kkLast.source')),
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
