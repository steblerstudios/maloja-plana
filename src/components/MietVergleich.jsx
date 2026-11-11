import React from 'react';
import { text, weight, radius, space, leading } from '../config/tokens.js';
import { getHouseholdInfo } from '../config/cantonalData.js';
import { getRentComparison } from '../data/mietpreise.js';
import { bereichFillColor } from '../data/lebensbereiche.js';
import { RegionalBarometer } from './RegionalBarometer.jsx';
import { zahl } from '../utils/geld.js';
import { wohnkostenRechnung, drittelGrenzeMiete } from './WohnkostenInstrument.jsx'; // Quelle: data/wohnkosten.js

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

  // Zwei Grössen, zwei Fragen: der Balken vergleicht die NETTOMIETE mit der BFS-Nettomiete
  // (data/mietpreise.js, ohne Nebenkosten) — wie das Budget. Die Wohnkosten-Zeile darunter
  // zählt die Nebenkosten mit; sie heisst «Wohnkosten». Bis 28.09.2026 füllte die Summe
  // auch den Balken («Ihre Miete: CHF 1830» unter der Quelle «Nettomiete»).
  // Anteil und Drittel-Grenze aus der EINEN Rechnung (data/wohnkosten.js, seit 11.11.2026) — wie im
  // Kapitel Wohnen: alle Wohnkosten ÷ alle eigenen Einnahmen. Bis dahin hier nur Miete + NK ÷ Lohn.
  const r = wohnkostenRechnung(data?.wohnen, data);
  const nettoMiete = r.netto;

  if (!canton || r.kosten <= 0) return null;

  // Ohne Nettomiete (z. B. Eigentum, nur Nebenkosten erfasst) kein Miet-Balken.
  const rentComparison = nettoMiete > 0 ? getRentComparison(canton, { rooms: data?.wohnen?.rooms, householdSize }) : null;
  const rentSharePct = r.anteil != null ? Math.round(r.anteil) : null;
  // Die Drittel-Faustregel als Miet-Betrag (`thresholdValue` unten) — nur mit Einkommen bestimmbar,
  // mit Partner/in kein Urteil.

  if (!rentComparison && rentSharePct == null) return null;

  // Regel «Zahl» (Stebler Studios 11.11.2026, Matrix §10): die Hauptzahl gross wie auf der Kachel und im Kapitel,
  // direkt unter den Häusern (mit Häuserzeile) oder oben in der Karte (ohne).
  const hauptzahl = rentSharePct != null && React.createElement('div', { 'data-instrument-zahl': 'wohnkosten', style: { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, color: palette.text, fontVariantNumeric: 'tabular-nums' } },
    // Gleiche Schreibweise wie Kachel und Kapitel: knapp über einem Drittel eine Stelle, sonst ganz.
    zahl(r.anteil, { hoechstens: r.ueberDrittel && Math.round(r.anteil) === 33 ? 1 : 0 }) + ' %');

  return React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.lg, fontSize: text.sm } },
    showTitle && React.createElement('div', {
      style: { fontWeight: weight.semi, color: palette.text, marginBottom: space.sm + 'px' },
    }, t('mietzinsView.compareTitle')),

    rentComparison && React.createElement(RegionalBarometer, {
      palette, t, comparison: rentComparison, userValue: nettoMiete, kind: 'rent', form: 'haeuser',
      // Füll-Ton, nicht Identitätston: die Füllung trägt die Aussage → WCAG 1.4.11 (3:1).
      fillColor: bereichFillColor('wohnen', isDarkMode),
      thresholdValue: drittelGrenzeMiete(r),
      drittel: r,
      unterBild: hauptzahl,
    }),

    rentSharePct != null && React.createElement('div', { style: { marginTop: space.sm + 'px' } },
      !rentComparison && hauptzahl,
      // Kein inline-„!" — das sitzt auf dem Balken. Hier nur die lesbare Deep-Variante.
      React.createElement('div', {
        style: { fontSize: text.sm, color: r.ueberDrittel && !r.mitPartner ? palette.goldDeep : palette.text, lineHeight: leading.normal },
      }, t('mietzinsView.rentShare', { pct: rentSharePct })),
      // Mit Partner/in derselbe Satz wie im Kapitel: gerechnet ist nur das eigene Einkommen.
      React.createElement('div', {
        style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, marginTop: '2px' },
      }, t(r.mitPartner ? 'wohnenInstrument.mitPartner' : 'mietzinsView.rentShareGuide'))
    )
  );
};

export default MietVergleich;
