import React, { useState } from 'react';
import { ErgebnisArt } from './components/ErgebnisArt.jsx';
import { ergebnis, ERGEBNIS_ART } from './data/ergebnisArt.js';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { ExternerLink } from './components/ExternerLink.jsx';
import { zahl } from './utils/geld.js';

// Kleiner Orientierungs-Rechner: pflegende Angehörige können bei manchen
// (Spitex-nahen) Organisationen angestellt und für ihre Pflege entlöhnt werden.
// Bewusst UNVERBINDLICH. Einen amtlichen Lohnsatz gibt es nicht — den Lohn legt die
// anstellende Organisation fest. Darum eine SPANNE statt einer Zahl.
//
// Spanne 30–40 CHF/h: Regierungsrat Basel-Stadt, Medienmitteilung vom 16.12.2025 («Basel-Stadt
// führt Tarif für Angehörigenpflege ein»), wörtlich: «Pflegende Angehörige erhalten üblicherweise
// einen Beitrag von 30 bis 40 Franken pro Stunde.» Eine kantonale Beobachtung, keine Vorgabe,
// ohne Angabe brutto/netto; gelesen 26.10.2026. Fachprüfung 26.10.2026 eingearbeitet.
// Vergleich 52.60 CHF/h: Beitrag der Krankenversicherung an die Organisation für Grundpflege,
// KLV Art. 7a Abs. 1 Bst. c (Fedlex, Stand 1.1.2026) — das erhält die Organisation, nicht der Lohn.
// Bis 26.10.2026 stand hier CHF 37.90/h, der Satz eines privaten Anbieters (pflegewegweiser.ch).
// Keine Rechtsberatung.
export const LOHN_SPANNE = Object.freeze({ von: 30, bis: 40 }); // CHF/h
export const OKP_GRUNDPFLEGE_PRO_STUNDE = 52.60;                // CHF/h, KLV Art. 7a Abs. 1 Bst. c
const WOCHEN_PRO_MONAT = 4.33;    // 52/12

// O3 — Ergebnis-Art: ORIENTIERUNG. Die Spanne ist eine amtliche Beobachtung aus einem Kanton,
// kein Tarif; gerechnet wird nicht nach einer Regel der Stelle, die den Lohn festlegt. Es fehlt
// nie eine Angabe (der Regler hat immer einen Wert).
export const PFLEGE_ENTLOEHNUNG_ERGEBNIS = ergebnis(ERGEBNIS_ART.ORIENTIERUNG);

export const PflegeEntloehnung = ({ palette, t }) => {
  const [stunden, setStunden] = useState(14);
  const monat = (satz) => Math.round(stunden * WOCHEN_PRO_MONAT * satz);
  const jahr = (satz) => Math.round(stunden * 52 * satz);
  const von = monat(LOHN_SPANNE.von);
  const bis = monat(LOHN_SPANNE.bis);
  const fmt = (v) => zahl(v);

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
    extLink: { display: 'inline-block', fontSize: text.sm, color: palette.sandDeep, fontWeight: weight.medium, marginTop: space.sm + 'px', textDecoration: 'none' },
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
      React.createElement('div', { style: s.big }, 'CHF ' + fmt(von) + ' – ' + fmt(bis) + ' / ' + t('pflege.entl.month')),
      React.createElement('div', { style: s.sub }, '≈ CHF ' + fmt(jahr(LOHN_SPANNE.von)) + ' – ' + fmt(jahr(LOHN_SPANNE.bis)) + ' / ' + t('pflege.entl.year')),
      React.createElement('div', { style: s.sub }, t('pflege.entl.rateNote', { von: LOHN_SPANNE.von, bis: LOHN_SPANNE.bis }))
    ),
    React.createElement('div', { style: s.note }, t('pflege.entl.vergleich', { betrag: OKP_GRUNDPFLEGE_PRO_STUNDE.toFixed(2) })),
    React.createElement('div', { style: s.note }, t('pflege.entl.nurGrundpflege')),
    React.createElement(ErgebnisArt, { palette, t, ergebnis: PFLEGE_ENTLOEHNUNG_ERGEBNIS }),
    React.createElement('div', { style: s.note }, t('pflege.entl.zuschlaege')),
    React.createElement('div', { style: s.note }, t('pflege.entl.disclaimer')),
    React.createElement(ExternerLink, { t, style: s.extLink, href: 'https://www.spitex.ch' }, t('pflege.entl.extLink'))
  );
};

export default PflegeEntloehnung;
