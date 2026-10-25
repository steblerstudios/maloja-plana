import React from 'react';
import { text, weight, radius, space } from '../config/tokens.js';
import { betrag } from '../utils/geld.js';
import { sumAllExpenses, eigeneEinnahmen, monatsAusgaben } from '../utils/monatsrechnung.js';

// Geldfluss (Sankey): links, woher das Geld kommt, in der Mitte der Monat, rechts, wohin es
// geht. Die Breite jedes Bands ist der Betrag. Das Geld fliesst über die Mitte, weil Maloja
// nicht weiss, welcher Franken welche Rechnung bezahlt — es wird nichts zugeordnet.
// Gebaut am 24.10.2026 für die Charts-Seite; dort am falschen Ort (Sophie: «der Ort ist falsch»).
// Seither im Kapitel Finanzen, am Anfang der Auswertung (FinanzAuswertung.jsx).
// Beträge stehen nicht im Bild, sondern im Kapitel (Felder, «Jeden Monat bleiben»).
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
      // Schmal höchstens 340 px breit: bei knapp 480 px Spalte wurde das Bild sonst ~370 px hoch
      // und schob den Lohn weit nach unten (im Kapitel gemessen 24.10.2026).
      style: { width: '100%', maxWidth: schmal ? '340px' : undefined, height: 'auto', display: 'block', margin: '0 auto' },
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

// Die Ausgabenposten mit Namen und Farbe — eine Liste für Geldfluss und Kuchen (Fassung 6:
// Balken, Kuchen und Sankey im Kapitel Finanzen, VERGLEICH.md «nachentschieden»).
// Dieselben Posten wie die Rechnung (dazu Hypothek, Gebäudeversicherung, Kinderbetreuung,
// Säule 3a), sonst ginge der Fluss nicht auf.
export const ausgabenPosten = (data, t, palette) => {
  const posten = monatsAusgaben(data);
  const farbe = {
    rent: palette.rose, utilities: palette.gold, mortgage: palette.rose, buildingsInsurance: '#A89F94',
    // communication bis 25.10.2026 '#6E90B0' — im Kuchen kaum von Krankenkasse (sky) zu unterscheiden (Abnahme F6).
    healthInsurance: palette.sky, tax: '#8B7355', groceries: '#7B9E8C', communication: '#6F6A99',
    childcare: palette.sand, mobility: '#B08060', pension3a: '#9C8FB0', debtPayments: palette.rose,
    alimentePaid: palette.sage, otherInsurance: '#A89F94',
  };
  const reihenfolge = ['rent', 'utilities', 'mortgage', 'buildingsInsurance', 'healthInsurance', 'tax', 'groceries',
    'communication', 'childcare', 'mobility', 'pension3a', 'debtPayments', 'alimentePaid', 'otherInsurance'];
  return reihenfolge.map((k) => ({
    key: k, label: t(k === 'rent' ? 'budgetSync.housingCosts' : 'budgetSync.field.' + k), value: posten[k], color: farbe[k],
  })).filter((x) => x.value > 0);
};

// Woher und wohin, aus denselben Feldern wie utils/monatsrechnung.js (eigeneEinnahmen,
// sumAllExpenses) — der Geldfluss rechnet nichts Eigenes. Reicht das Einkommen nicht, steht der
// Rest links als «Nicht gedeckt», damit beide Seiten gleich breit sind; es wird nichts erfunden.
// `data` ist das ganze Profil (Wohnen und Versicherungen liefern Miete, Nebenkosten, KK-Prämie).
export const geldflussDaten = (data, t, palette) => {
  const f = data?.finanzen || {};
  const n = (v) => Number(v) || 0;
  const { total: income, brutto } = eigeneEinnahmen(f);
  const totalExpenses = sumAllExpenses(f, data);
  const remaining = Math.max(0, income - totalExpenses);
  const ausgaben = ausgabenPosten(data, t, palette);
  const quellen = [
    { label: t('chapters.finanzen.geldfluss.salary'), value: n(f.monthlyIncome), color: palette.sky },
    { label: t(f.sideIncomeType === 'brutto' ? 'budgetSync.incomeSideGross' : 'budgetSync.incomeSide'), value: n(f.sideIncome), color: palette.sage },
    { label: t('chapters.finanzen.geldfluss.familyAllowances'), value: n(f.familienzulagen), color: palette.gold },
    { label: t('chapters.finanzen.geldfluss.alimonyReceived'), value: n(f.alimenteReceived), color: palette.sand },
    { label: t('chapters.finanzen.geldfluss.uncovered'), value: Math.max(0, totalExpenses - income), color: palette.border },
  ].filter((q) => q.value > 0);
  const ziele = ausgaben.concat(remaining > 0 ? [{ label: t('budgetSync.remaining'), value: remaining, color: palette.sage }] : []);
  const beschreibung = t('chapters.finanzen.geldfluss.summary', { income: betrag(income, { hoechstens: 2 }), expenses: betrag(totalExpenses, { hoechstens: 2 }) });
  // Brutto erfasster Lohn: kein Fluss — sein «Übrig» läge so nie auf dem Konto, und ohne es
  // gingen die zwei Seiten nicht auf. Oben steht dann die Frage nach dem Netto (Brutto-Regel,
  // finanzen-fusion.md; Fachprüfung Fassung 6).
  return { quellen, ziele, beschreibung, brutto };
};

export const GeldflussImKapitel = ({ data, t, palette }) => {
  const { quellen, ziele, beschreibung, brutto } = geldflussDaten(data, t, palette);
  // Erst mit zwei oder mehr Einnahmequellen sagt der Fluss mehr als der Kuchen: mit einem Lohn
  // ist er ein Strom, der sich auffächert (Sophie: «komisch»). «Nicht gedeckt» zählt nicht als Quelle.
  const echteQuellen = quellen.filter((q) => q.label !== t('chapters.finanzen.geldfluss.uncovered')).length;
  if (brutto || echteQuellen < 2) return null;
  return React.createElement(Geldfluss, {
    palette, quellen, ziele, beschreibung,
    titel: t('chapters.finanzen.geldfluss.title'),
    woher: t('chapters.finanzen.geldfluss.from'),
    wohin: t('chapters.finanzen.geldfluss.to'),
  });
};
