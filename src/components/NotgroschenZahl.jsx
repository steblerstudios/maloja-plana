import React from 'react';
import { reserveTankState } from '../data/reserveTank.js';
import { monthlyExpenses } from '../data/haushaltskosten.js';
import { text, weight, space, radius, leading, INSTRUMENT_GROESSE } from '../config/tokens.js';
import { zahl } from '../utils/geld.js';
import { ReserveTank } from './ReserveTank.jsx';

// Der Reserve-Tank zuoberst auf der Übersicht, mit der Zahl gross daneben: «So lange reicht Ihr
// Notgroschen» (10.11.2026, Punkt 5 aus dem Abgleich mit Nessie: «Know how long you're covered»).
// KEINE zweite Anzeige, sondern der Tank als Spiegel (Brand Book §7b, Muster Netz-Schild):
// derselbe kleine Tank wie in der Kapitelzeile Finanzen (ReserveTank groesse 'klein'), dieselbe
// Rechnung (data/reserveTank.js). Stebler Studios 10.11.2026: «gleiches System wie das Netz-Schild,
// die grosse Zahl mit in die Logik einbauen». Keine neue Fachaussage: «Empfohlen sind 3» steht schon
// in der Tankanzeige.
//
// Ruhig, kein Alarm (Brand Book §8): keine Ampelfarbe, eine dünne Reserve ist ein Ziel.
// Zustände:
//   months, savings > 0 → grosse Zahl
//   months, savings = 0 → leiser Satz «Noch kein Notgroschen erfasst», keine «0» gross
//   noexpenses          → nichts: ohne Ausgaben gibt es keine Zahl, und die Übersicht hat
//                         ihren nächsten Schritt schon darunter (kein zweiter Aufruf zum Ausfüllen)
// Nachgeladen (Dashboard: lazyMitTexten) — das Startbündel stand bei 64.75/65 kB.
export const NotgroschenZahl = ({ palette, t, data, onNavigate }) => {
  const st = reserveTankState({ savings: Number(data?.finanzen?.savingsAccount) || 0, monthlyExpenses: monthlyExpenses(data) });
  if (st.mode !== 'months') return null;
  const h = React.createElement;
  const leer = st.level === 'empty';
  const monate = zahl(st.months, { hoechstens: 1 });
  const einheit = t(st.months === 1 ? 'dashboard.notgroschenMonat' : 'dashboard.notgroschenMonate');
  const satz = leer
    ? t('finanzUebersicht.tankReadoutEmpty', { recommend: st.recommendMonths })
    : t('dashboard.notgroschenSatz', { recommend: st.recommendMonths });

  return h('button', {
    type: 'button',
    'data-teil': 'notgroschen',
    onClick: () => onNavigate('finanzuebersicht'),
    'aria-label': leer ? satz : t('dashboard.notgroschenTitel') + ': ' + monate + ' ' + einheit + '. ' + satz,
    style: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.md + 'px',
      width: '100%', textAlign: 'left', fontFamily: 'inherit', cursor: 'pointer',
      marginBottom: space.lg + 'px', padding: space.md + 'px ' + space.lg + 'px',
      background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.lg,
      color: palette.text,
    },
  },
    h('span', { style: { display: 'flex', alignItems: 'center', gap: space.md + 'px', minWidth: 0 } },
      h('span', { style: { width: INSTRUMENT_GROESSE.klein + 'px', flexShrink: 0 } },
        h(ReserveTank, { palette, t, savings: st.savings, monthlyExpenses: st.monthlyExpenses, groesse: 'klein' })),
    h('span', { style: { display: 'flex', flexDirection: 'column', gap: space.xs + 'px', minWidth: 0 } },
      h('span', { style: { fontSize: text.xs, color: palette.soft } }, t('dashboard.notgroschenTitel')),
      !leer && h('span', { style: { display: 'flex', alignItems: 'baseline', gap: space.sm + 'px', flexWrap: 'wrap' } },
        h('span', { style: { fontSize: text['3xl'], fontWeight: weight.semi, lineHeight: 1.1, color: palette.text, fontVariantNumeric: 'tabular-nums' } }, monate),
        h('span', { style: { fontSize: text.lg, color: palette.mid } }, einheit),
      ),
      h('span', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } }, satz),
    ),
    ),
    h('span', { 'aria-hidden': 'true', style: { fontSize: text.lg, color: palette.soft, flexShrink: 0 } }, '›'),
  );
};

export default NotgroschenZahl;
