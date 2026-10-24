import React from 'react';
import { text, weight, space, radius } from '../config/tokens.js';
import { betrag } from '../utils/geld.js';
import { eigeneEinnahmen, sumAllExpenses } from '../utils/monatsrechnung.js';
import { ausgabenPosten } from './Geldfluss.jsx';

// Kuchen im Kapitel Finanzen — «Wofür geht das Geld weg?» (Sophie 24.10.2026 abends, VERGLEICH.md
// «Geldfluss, Kuchen, Balken … nachentschieden»). Vorher auf der Charts-Seite (ChartsAdvanced.jsx,
// entfernt mit #556); jetzt aus derselben Rechnung wie «Jeden Monat bleiben» (utils/monatsrechnung.js).
// Ein Stück «bleibt» nur bei netto erfasstem Einkommen — aus einem Bruttolohn läge es so nie auf dem Konto.

// Daten ohne React, damit Tests die Stücke nachrechnen können.
export const kuchenDaten = (data, t, palette) => {
  const f = data?.finanzen || {};
  const stuecke = ausgabenPosten(data, t, palette);
  const { total: einkommen, brutto } = eigeneEinnahmen(f);
  const rest = einkommen - sumAllExpenses(f, data);
  if (!brutto && rest > 0) {
    stuecke.push({ key: 'bleibt', label: t('budgetSync.remaining'), value: rest, color: palette.sage });
  }
  const summe = stuecke.reduce((a, s) => a + s.value, 0);
  return { stuecke, summe };
};

// Ein Kreisstück von `von` bis `bis` (Grad, 0 = oben). Ein volles Stück (360°) lässt sich mit
// einem einzigen Bogen nicht zeichnen — dafür ein Kreis.
const stueckPfad = (von, bis) => {
  const punkt = (g) => {
    const r = ((g - 90) * Math.PI) / 180;
    return [100 + 80 * Math.cos(r), 100 + 80 * Math.sin(r)];
  };
  const [x1, y1] = punkt(von);
  const [x2, y2] = punkt(bis);
  return `M 100 100 L ${x1} ${y1} A 80 80 0 ${bis - von > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
};

export const KuchenImKapitel = ({ data, t, palette }) => {
  const { stuecke, summe } = kuchenDaten(data, t, palette);
  if (!(summe > 0)) return null;
  let winkel = 0;
  const flaechen = stuecke.map((s) => {
    const von = winkel;
    winkel += (s.value / summe) * 360;
    return stuecke.length === 1
      ? React.createElement('circle', { key: s.key, cx: 100, cy: 100, r: 80, fill: s.color })
      : React.createElement('path', { key: s.key, d: stueckPfad(von, winkel), fill: s.color, stroke: palette.surface, strokeWidth: 2 });
  });
  return React.createElement('section', { 'data-teil': 'kuchen', 'aria-labelledby': 'mp-kuchen-titel', style: { marginBottom: space.md + 'px', padding: space.md + 'px', background: palette.up, borderRadius: radius.md } },
    React.createElement('h3', { id: 'mp-kuchen-titel', style: { margin: '0 0 ' + space.sm + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('budgetSync.expensesOverview')),
    // Das Bild wiederholt nur die Liste darunter — für Screenreader stumm.
    React.createElement('svg', { width: 180, height: 180, viewBox: '0 0 200 200', 'aria-hidden': 'true', style: { display: 'block', margin: '0 auto ' + space.sm + 'px' } }, flaechen),
    React.createElement('ul', { style: { listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))', gap: '4px ' + space.md + 'px', fontSize: text.xs, color: palette.text } },
      stuecke.map((s) => React.createElement('li', { key: s.key, style: { display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 } },
        React.createElement('span', { 'aria-hidden': 'true', style: { width: '10px', height: '10px', borderRadius: radius.hair, background: s.color, flexShrink: 0 } }),
        React.createElement('span', { style: { flex: 1, minWidth: 0, color: palette.text } }, s.label),
        React.createElement('span', { style: { color: palette.mid, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } }, betrag(Math.round(s.value)) + ' · ' + Math.round((s.value / summe) * 100) + ' %')
      ))
    )
  );
};
