import React from 'react';
import { text, weight, radius, space, leading } from '../config/tokens.js';
import { getHouseholdInfo } from '../config/cantonalData.js';
import { getRentComparison } from '../data/mietpreise.js';
import { bereichFillColor } from '../data/lebensbereiche.js';
import { RegionalBarometer } from './RegionalBarometer.jsx';

// „Wo steht Ihre Miete?" — regionaler BFS-Vergleich + Wohnkostenquote.
// Bewusst EIN Bauteil für die beiden Orte, die auf den KAPITEL-Daten rechnen
// (Finanz-Übersicht + Mietzins-Ansicht): eine Wahrheit, kein zweiter Rechenweg.
//
// ⚠️ Es gibt einen DRITTEN Miet-Balken: `BudgetSync` (Predeploy-Runde 8 gefunden). Er nutzt
// bewusst NICHT dieses Bauteil, sondern `RegionalBarometer` direkt — denn dort gelten die
// BUDGET-Zahlen (`budget.expenses.rent`, `budget.income`) und der Kanton der Wohngemeinde
// (via PLZ), nicht `wohnen.rentAmount`/`finanzen.monthlyIncome`/`basis.canton`. Im Budget
// erwartet man die Budget-Zahlen — andere Frage, andere Quelle. Geteilt wird das Instrument
// und seine KODIERUNG (Frucht-Füllung + Drittel-„!"), nicht der Rechenweg.
// (Bis Runde 8 stand hier „EIN Bauteil für BEIDE Orte" und im Budget füllte die Miete blau.)
//
// Encoding (siehe docs/design/farb-und-daten-system.md):
//   • Füllung = deine Miete, in der Frucht-Farbe des Bereichs Wohnen (Birne) — „du" trägt
//     die Bereichsfarbe, damit Blau nicht überall „du" bedeutet.
//   • ● Punkt = Regions-Schnitt, gefärbt nach DEINER Lage (gold = enger, sage = entspannter).
//   • | Strich = Schweizer Schnitt, neutral.
//   • ! = die Drittel-Faustregel als Betrag. Graphit normal, rose nur wenn überschritten.
//
// Props: palette, t, data, isDarkMode, showTitle (Default true), canton (optional Override)
export const MietVergleich = ({ palette, t, data, isDarkMode, showTitle = true, canton: cantonProp }) => {
  const canton = cantonProp || data?.basis?.canton || '';
  const hh = getHouseholdInfo(data) || {};
  const householdSize = hh.householdSize || 1;

  const monthlyIncome = parseFloat(data?.finanzen?.monthlyIncome) || 0;
  const rentMonthly = (parseFloat(data?.wohnen?.rentAmount) || 0) + (parseFloat(data?.wohnen?.utilities) || 0);

  if (!canton || rentMonthly <= 0) return null;

  const rentComparison = getRentComparison(canton, { rooms: data?.wohnen?.rooms, householdSize });
  const rentSharePct = monthlyIncome > 0 ? Math.round((rentMonthly / monthlyIncome) * 100) : null;
  // Die Drittel-Faustregel als Miet-Betrag — nur mit Einkommen bestimmbar.
  const drittel = monthlyIncome > 0 ? Math.round(monthlyIncome / 3) : 0;

  if (!rentComparison && rentSharePct == null) return null;

  return React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, fontSize: text.sm } },
    showTitle && React.createElement('div', {
      style: { fontWeight: weight.semi, color: palette.text, marginBottom: space.sm + 'px' },
    }, t('mietzinsView.compareTitle')),

    rentComparison && React.createElement(RegionalBarometer, {
      palette, t, comparison: rentComparison, userValue: rentMonthly || null, kind: 'rent',
      // Füll-Ton, nicht Identitätston: die Füllung trägt die Aussage → WCAG 1.4.11 (3:1).
      fillColor: bereichFillColor('wohnen', isDarkMode),
      thresholdValue: drittel,
    }),

    rentSharePct != null && React.createElement('div', { style: { marginTop: space.sm + 'px' } },
      // Kein inline-„!" — das sitzt auf dem Balken. Hier nur die lesbare Deep-Variante.
      React.createElement('div', {
        style: { fontSize: text.sm, color: rentSharePct > 33 ? palette.goldDeep : palette.text, lineHeight: leading.normal },
      }, t('mietzinsView.rentShare', { pct: rentSharePct })),
      React.createElement('div', {
        style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginTop: '2px' },
      }, t('mietzinsView.rentShareGuide'))
    )
  );
};

export default MietVergleich;
