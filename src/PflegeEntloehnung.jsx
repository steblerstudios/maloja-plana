import React, { useState } from 'react';
import { text, weight, space, radius, leading } from './config/tokens.js';

// Kleiner Orientierungs-Rechner: pflegende Angehörige können bei manchen
// (Spitex-nahen) Organisationen angestellt und für ihre Pflege entlöhnt werden.
// Bewusst UNVERBINDLICH — der Anker CHF 37.90/h ist ein Anbieter-Richtwert
// (pflegewegweiser.ch), kein gesetzlicher Tarif. Der reale Lohn hängt von der
// anstellenden Organisation und vom Kanton ab. Keine Rechtsberatung.
const STUNDENSATZ = 37.90;        // CHF/h, Richtwert
const WOCHEN_PRO_MONAT = 4.33;    // 52/12

export const PflegeEntloehnung = ({ palette, t }) => {
  const [stunden, setStunden] = useState(14);
  const brutto = Math.round(stunden * WOCHEN_PRO_MONAT * STUNDENSATZ);
  const fmt = (v) => v.toLocaleString('de-CH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const s = {
    wrap: { marginTop: space.sm + 'px' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: space.xs + 'px' },
    label: { fontSize: text.sm, color: palette.text, fontWeight: weight.medium },
    hours: { fontSize: text.body, color: palette.text, fontWeight: weight.semi, fontVariantNumeric: 'tabular-nums' },
    slider: { width: '100%', accentColor: palette.gold, cursor: 'pointer', margin: space.xs + 'px 0' },
    scale: { display: 'flex', justifyContent: 'space-between', fontSize: text.xs, color: palette.soft },
    result: { marginTop: space.md + 'px', padding: space.md + 'px', background: palette.sage + '22', border: '1px solid ' + palette.sage, borderRadius: radius.sm + 'px' },
    resultLabel: { fontSize: text.xs, color: palette.mid, marginBottom: '2px' },
    big: { fontSize: text.lg, fontWeight: weight.bold, color: palette.text, fontVariantNumeric: 'tabular-nums' },
    sub: { fontSize: text.xs, color: palette.mid, marginTop: '2px' },
    note: { fontSize: text.xs, color: palette.mid, lineHeight: leading.relaxed, marginTop: space.sm + 'px' },
    extLink: { display: 'inline-block', fontSize: text.sm, color: palette.sand, fontWeight: weight.medium, marginTop: space.sm + 'px', textDecoration: 'none' },
  };

  return React.createElement('div', { style: s.wrap },
    React.createElement('div', { style: s.row },
      React.createElement('span', { style: s.label }, t('pflege.entl.hoursLabel')),
      React.createElement('span', { style: s.hours }, stunden + ' ' + t('pflege.entl.hoursUnit'))
    ),
    React.createElement('input', {
      type: 'range', min: 1, max: 40, step: 1, value: stunden,
      onChange: (e) => setStunden(Number(e.target.value)),
      'aria-label': t('pflege.entl.hoursLabel'), style: s.slider,
    }),
    React.createElement('div', { style: s.scale },
      React.createElement('span', null, '1'), React.createElement('span', null, '40')),
    React.createElement('div', { style: s.result },
      React.createElement('div', { style: s.resultLabel }, t('pflege.entl.resultLabel')),
      React.createElement('div', { style: s.big }, 'CHF ' + fmt(brutto) + ' / ' + t('pflege.entl.month')),
      React.createElement('div', { style: s.sub }, '≈ CHF ' + fmt(brutto * 12) + ' / ' + t('pflege.entl.year') + ' · ' + t('pflege.entl.rateNote'))
    ),
    React.createElement('div', { style: s.note }, t('pflege.entl.zuschlaege')),
    React.createElement('div', { style: s.note }, t('pflege.entl.disclaimer')),
    React.createElement('a', { style: s.extLink, href: 'https://www.spitex.ch', target: '_blank', rel: 'noopener noreferrer' }, t('pflege.entl.extLink') + ' ↗')
  );
};

export default PflegeEntloehnung;
