import React from 'react';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, shadow, radius, space } from './config/tokens.js';
import { betrag } from './utils/geld.js';
import { sumAllExpenses, sumTotalIncome } from './utils/monatsrechnung.js';

// Geldfluss (Sankey): links, woher das Geld kommt, in der Mitte der Monat, rechts, wohin es
// geht. Die Breite jedes Bands ist der Betrag. Das Geld fliesst über die Mitte, weil Maloja
// nicht weiss, welcher Franken welche Rechnung bezahlt — es wird nichts zugeordnet.
// Löst am 24.10.2026 das Kuchendiagramm ab (Sophie: «Bau zuerst den Geldfluss»).
// Beträge stehen nicht im Bild, sondern in der Balkenliste darunter (am Handy lesbar).
// Schmal (unter 480 px): das Bild hätte rund 6 px Schrift (im Browser gemessen 24.10.2026,
// Handy 375 px) — dort ohne Text im Bild, die Namen stehen als Legende darunter.
const FLUSS = { knoten: 10, luecke: 6, zeile: 15, rand: 8, hoehe: 220 };
const SPALTEN = {
  breit: { breite: 560, links: 150, mitte: 275, rechts: 400 },
  schmal: { breite: 300, links: 2, mitte: 145, rechts: 288 },
};
const SCHMAL_AB = 480;

export function geldflussLayout(quellen, ziele) {
  const summe = (liste) => liste.reduce((a, x) => a + x.value, 0);
  const total = Math.max(summe(quellen), summe(ziele));
  if (total <= 0) return null;
  const meiste = Math.max(quellen.length, ziele.length);
  const innen = Math.max(FLUSS.hoehe, meiste * (FLUSS.zeile + 4));
  const massstab = (innen - FLUSS.luecke * (meiste - 1)) / total;

  const stapeln = (liste) => {
    const hoehe = summe(liste) * massstab + FLUSS.luecke * (liste.length - 1);
    let y = FLUSS.rand + (innen - hoehe) / 2;
    let mitteY = FLUSS.rand + (innen - summe(liste) * massstab) / 2;
    let letzteMarke = -Infinity;
    return liste.map((x) => {
      const h = Math.max(1, x.value * massstab);
      const knoten = { ...x, y, h, mitteY, marke: Math.max(y + h / 2, letzteMarke + FLUSS.zeile) };
      letzteMarke = knoten.marke;
      y += h + FLUSS.luecke;
      mitteY += h;
      return knoten;
    });
  };

  const links = stapeln(quellen);
  const rechts = stapeln(ziele);
  const unten = Math.max(FLUSS.rand * 2 + innen, ...links.concat(rechts).map((k) => k.marke + FLUSS.zeile));
  return { links, rechts, mitte: { y: FLUSS.rand + (innen - total * massstab) / 2, h: total * massstab }, hoehe: unten };
}

const band = (x0, y0, x1, y1, h) => {
  const xm = (x0 + x1) / 2;
  return `M ${x0} ${y0} C ${xm} ${y0}, ${xm} ${y1}, ${x1} ${y1} L ${x1} ${y1 + h} C ${xm} ${y1 + h}, ${xm} ${y0 + h}, ${x0} ${y0 + h} Z`;
};

const Legende = ({ ueberschrift, knoten, palette }) => React.createElement('div', { style: { flex: '1 1 140px' } },
  React.createElement('div', { style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.text, marginBottom: '4px' } }, ueberschrift),
  knoten.map((x) => React.createElement('div', { key: x.label, style: { display: 'flex', gap: '6px', alignItems: 'center', fontSize: text.xs, color: palette.text, marginBottom: '2px' } },
    React.createElement('span', { 'aria-hidden': 'true', style: { width: '10px', height: '10px', background: x.color, borderRadius: radius.hair, flexShrink: 0 } }),
    x.label
  ))
);

const Geldfluss = ({ quellen, ziele, titel, beschreibung, woher, wohin, palette }) => {
  const rahmen = React.useRef(null);
  const [schmal, setSchmal] = React.useState(false);
  React.useEffect(() => {
    const el = rahmen.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const beobachter = new ResizeObserver(([e]) => setSchmal(e.contentRect.width < SCHMAL_AB));
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, []);

  const lage = geldflussLayout(quellen, ziele);
  if (!lage) return null;
  const { links, rechts, mitte, hoehe } = lage;
  const k = FLUSS.knoten;
  const s = schmal ? SPALTEN.schmal : SPALTEN.breit;
  const beschriftung = (knoten, x, anker) => React.createElement('text', {
    key: 't' + knoten.label, x, y: knoten.marke, dy: '0.35em', textAnchor: anker,
    fontSize: 12, fill: palette.text,
  }, knoten.label);

  return React.createElement('div', { ref: rahmen, style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.md } },
    React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, margin: '0 0 6px 0' } }, titel),
    React.createElement('svg', {
      viewBox: `0 0 ${s.breite} ${hoehe}`, role: 'img', 'aria-label': beschreibung,
      style: { width: '100%', height: 'auto', display: 'block' },
    },
      React.createElement('title', null, beschreibung),
      links.map((q) => React.createElement('path', { key: 'bl' + q.label, d: band(s.links + k, q.y, s.mitte, q.mitteY, q.h), fill: q.color, fillOpacity: 0.35 })),
      rechts.map((z) => React.createElement('path', { key: 'br' + z.label, d: band(s.mitte + k, z.mitteY, s.rechts, z.y, z.h), fill: z.color, fillOpacity: 0.35 })),
      links.map((q) => React.createElement('rect', { key: 'kl' + q.label, x: s.links, y: q.y, width: k, height: q.h, fill: q.color })),
      React.createElement('rect', { x: s.mitte, y: mitte.y, width: k, height: mitte.h, fill: palette.mid }),
      rechts.map((z) => React.createElement('rect', { key: 'kr' + z.label, x: s.rechts, y: z.y, width: k, height: z.h, fill: z.color })),
      !schmal && links.map((q) => beschriftung(q, s.links - 8, 'end')),
      !schmal && rechts.map((z) => beschriftung(z, s.rechts + k + 8, 'start'))
    ),
    schmal && React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm, marginTop: space.sm } },
      React.createElement(Legende, { ueberschrift: woher, knoten: links, palette }),
      React.createElement(Legende, { ueberschrift: wohin, knoten: rechts, palette })
    ),
    React.createElement('p', { style: { fontSize: text.xs, color: palette.mid, margin: '6px 0 0 0' } }, beschreibung)
  );
};

const HorizontalBar = ({ label, value, maxValue, color, palette }) => {
  const pct = maxValue > 0 ? Math.min(100, (value / maxValue) * 100) : 0;
  return React.createElement('div', { style: { marginBottom: space.sm } },
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: text.xs, marginBottom: '3px' } },
      React.createElement('span', null, label),
      React.createElement('span', { style: { fontWeight: weight.semi, fontVariantNumeric: 'tabular-nums' } }, betrag(value, { hoechstens: 2 }))
    ),
    React.createElement('div', { style: { height: '8px', background: palette.border, borderRadius: radius.xs, overflow: 'hidden' } },
      React.createElement('div', { style: { height: '100%', width: pct + '%', background: color, borderRadius: radius.xs } })
    )
  );
};

export const ChartsAdvanced = ({ palette, t, data }) => {
  const rent = Number(data?.wohnen?.rentAmount || 0);
  const utilities = Number(data?.wohnen?.utilities || 0);
  const kkPremium = Number(data?.versicherungen?.kkPremium || 0);
  // BVG nur noch als Hinweis: er ist im Nettolohn schon abgezogen (Entscheid 21.10.2026,
  // Charts rechnet wie das Kapitel Finanzen — siehe utils/monatsrechnung.js).
  const bvg = Number(data?.versicherungen?.bvgContribution || 0);
  const tax = Number(data?.finanzen?.monthlyTax || 0);
  const groceries = Number(data?.finanzen?.groceries || 0);
  const communication = Number(data?.finanzen?.communication || 0);
  const mobility = Number(data?.finanzen?.mobility || 0);
  const debtPayments = Number(data?.finanzen?.debtPayments || 0);
  const alimentePaid = Number(data?.finanzen?.alimentePaid || 0);
  const otherInsurance = Number(data?.finanzen?.otherInsurance || 0);

  const income = sumTotalIncome(data?.finanzen);
  const totalExpenses = sumAllExpenses(data?.finanzen, data);
  const remaining = Math.max(0, income - totalExpenses);

  const hasData = income > 0 || totalExpenses > 0;

  if (!hasData) {
    return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border, boxShadow: shadow.sm } },
      React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'chartsSchoko', size: 20 }), t('charts.title')),
      React.createElement('div', { style: { padding: '40px 20px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, textAlign: 'center' } },
        React.createElement('div', { style: { marginBottom: '12px' } }, React.createElement(Icon, { name: 'finanzen', size: 28 })),
        React.createElement('p', { style: { fontSize: text.body, color: palette.text, margin: '0 0 6px 0' } }, t('charts.noData')),
        React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: 0 } }, t('charts.noDataHint'))
      )
    );
  }

  const expenseItems = [
    { label: t('budgetSync.housingCosts'), value: rent, color: palette.rose },
    // Beschriftungen aus budgetSync.field — die früheren Schlüssel budgetSync.taxes usw.
    // gab es nie; t() gab den Schlüssel zurück, und weil der nicht leer ist, griff auch
    // der Rückfall-Text nie (Legende zeigte «budgetSync.taxes», Massstab-Prüfung 21.10.2026).
    { label: t('budgetSync.field.utilities'), value: utilities, color: palette.gold },
    { label: t('budgetSync.field.healthInsurance'), value: kkPremium, color: palette.sky },
    { label: t('budgetSync.field.tax'), value: tax, color: '#8B7355' },
    { label: t('budgetSync.field.groceries'), value: groceries, color: '#7B9E8C' },
    { label: t('budgetSync.field.communication'), value: communication, color: '#6E90B0' },
    { label: t('budgetSync.field.mobility'), value: mobility, color: '#B08060' },
    { label: t('budgetSync.field.debtPayments'), value: debtPayments, color: palette.rose },
    { label: t('budgetSync.field.alimentePaid'), value: alimentePaid, color: palette.sage },
    { label: t('budgetSync.field.otherInsurance'), value: otherInsurance, color: '#A89F94' },
  ].filter(item => item.value > 0);

  const maxExpense = Math.max(...expenseItems.map(i => i.value));

  // Woher: dieselben drei Felder wie sumTotalIncome. Reicht das Einkommen nicht, steht der
  // Rest links als «Nicht gedeckt», damit beide Seiten gleich breit sind — nichts wird erfunden.
  const f = data?.finanzen || {};
  const quellen = [
    { label: t('charts.flowSalary'), value: Number(f.monthlyIncome || 0), color: palette.sky },
    { label: t('charts.flowFamilyAllowances'), value: Number(f.familienzulagen || 0), color: palette.gold },
    { label: t('charts.flowAlimonyReceived'), value: Number(f.alimenteReceived || 0), color: palette.sand },
    { label: t('charts.flowUncovered'), value: Math.max(0, totalExpenses - income), color: palette.border },
  ].filter(q => q.value > 0);
  const ziele = expenseItems.concat(remaining > 0 ? [{ label: t('budgetSync.remaining'), value: remaining, color: palette.sage }] : []);
  const flussText = t('charts.flowSummary', { income: betrag(income, { hoechstens: 2 }), expenses: betrag(totalExpenses, { hoechstens: 2 }) });

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border, boxShadow: shadow.sm } },
    React.createElement('h2', { style: { fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md, display: 'flex', alignItems: 'center', gap: space.sm } }, React.createElement(Icon, { name: 'chartsSchoko', size: 20 }), t('charts.title')),

    income > 0 && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.md, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: space.sm } },
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('budgetSync.income') || 'Einkommen'),
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi } }, betrag(income, { hoechstens: 2 }))
      ),
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('budgetSync.expenses') || 'Ausgaben'),
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.roseDeep } }, betrag(totalExpenses, { hoechstens: 2 }))
      ),
      React.createElement('div', null,
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, t('budgetSync.remaining') || 'Verfügbar'),
        React.createElement('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: remaining > 0 ? (palette.sageDeep || palette.sage) : (palette.roseDeep || palette.rose) } }, betrag(remaining, { hoechstens: 2 }))
      )
    ),

    // Nur bei Netto-Erfassung wahr: bei Brutto sind BVG und AHV noch nicht abgezogen (Tor 23.10.2026).
    bvg > 0 && data?.finanzen?.incomeType === 'netto' && React.createElement('p', { style: { fontSize: text.xs, color: palette.mid, margin: '0 0 ' + space.md + 'px' } }, t('budgetSync.bvgReferenceNote')),

    React.createElement(Geldfluss, {
      palette,
      quellen,
      ziele,
      titel: t('charts.flowTitle'),
      beschreibung: flussText,
      woher: t('charts.flowFrom'),
      wohin: t('charts.flowTo'),
    }),

    expenseItems.length > 0 && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.sm, marginBottom: space.md } },
      React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: space.sm } }, t('budgetSync.expenses') || 'Ausgaben'),
      expenseItems.map((item, idx) => React.createElement(HorizontalBar, { key: idx, label: item.label, value: item.value, maxValue: maxExpense, color: item.color, palette, t }))
    ),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, hinweisZeichen(), t('trust.localOnly'))
  );
};

export default ChartsAdvanced;
