import React, { useState } from 'react';
import { text, weight, space, radius } from '../config/tokens.js';
import { betrag } from '../utils/geld.js';
import { bereichsTon } from '../utils/lebensbereichFruechte.js';
import { ausgabenPosten } from './Geldfluss.jsx';

// Monatsring im Kapitel Finanzen (F7-K2-2, Stebler Studios 01.11.2026: «fusionieren, kreativ»). Fasst drei Dinge zu einem
// Bild zusammen, die vorher getrennt standen: die Zahl «Jeden Monat bleiben», den Balken darunter und den Kuchen
// «Wofür geht es weg?». Der Ring ist das ganze Einkommen, die farbigen Stücke sind die Ausgaben, die offene
// Stelle ist, was bleibt, und die Zahl steht in der Mitte. Rechnung wie vorher: utils/monatsrechnung.js.
// Im Minus ist der Ring voll und gemessen an den Ausgaben, wie der Balken.

const GRUPPEN = {
  wohnen: ['rent', 'utilities', 'mortgage', 'buildingsInsurance'],
  versicherungen: ['healthInsurance', 'kkZusatz', 'uvgZusatz', 'lifeInsurance', 'householdInsurance', 'liabilityInsurance', 'otherInsurance'],
  steuern: ['tax'],
};

// Daten ohne React, damit Tests die Stücke nachrechnen können.
export const ringDaten = ({ data, t, palette, einkommen, verplant }) => {
  const posten = ausgabenPosten(data, t, palette);
  const farbe = {
    wohnen: bereichsTon('wohnen', palette) || palette.rose,
    versicherungen: bereichsTon('versicherungen', palette) || palette.sky,
    steuern: palette.mid, uebriges: palette.gold,
  };
  const inGruppe = (key) => Object.keys(GRUPPEN).find((g) => GRUPPEN[g].includes(key)) || 'uebriges';
  const gruppen = Object.keys(farbe).map((key) => {
    const eigene = posten.filter((p) => inGruppe(p.key) === key);
    return { key, farbe: farbe[key], posten: eigene, wert: eigene.reduce((a, p) => a + p.value, 0) };
  }).filter((g) => g.wert > 0);
  return { gruppen, basis: Math.max(einkommen, verplant) || 1, rest: Math.max(0, einkommen - verplant) };
};

// Kleine Posten nicht als «0 %» (Säule 3a CHF 21 von 3’741).
const anteil = (wert, basis) => {
  const p = (wert / basis) * 100;
  return p > 0 && p < 1 ? '< 1 %' : Math.round(p) + ' %';
};

const MASS = 220;
const LUFT = 0.35; // Abstand zwischen zwei Stücken, in Prozent des Rings

export const Monatsring = ({ data, t, palette, einkommen, verplant, titel, zahl }) => {
  const { gruppen, basis, rest } = ringDaten({ data, t, palette, einkommen, verplant });
  const [offen, setOffen] = useState(null);
  let start = 0;
  const stuecke = gruppen.flatMap((g) => g.posten.map((p) => {
    const laenge = (p.value / basis) * 100;
    const anfang = start;
    start += laenge;
    return { key: p.key, laenge: Math.max(laenge - LUFT, 0.3), anfang, farbe: g.farbe, gruppe: g.key };
  }));
  const zeile = { display: 'flex', alignItems: 'center', gap: space.sm + 'px', width: '100%', minHeight: '44px', padding: '4px 0', background: 'none', border: 0, borderBottom: '1px solid ' + palette.border, fontFamily: 'inherit', fontSize: text.sm, color: palette.text, textAlign: 'left' };
  const wert = { color: palette.mid, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
  const zeilenInhalt = (farbe, name, w, pfeil) => [
    React.createElement('span', { key: 'f', 'aria-hidden': 'true', style: { width: '10px', height: '10px', borderRadius: radius.hair, flexShrink: 0, background: farbe || 'transparent', border: farbe ? 0 : '1px solid ' + palette.mid } }),
    React.createElement('span', { key: 'n', style: { flex: 1, minWidth: 0, color: palette.text } }, name),
    React.createElement('span', { key: 'w', style: wert }, betrag(Math.round(w)) + ' · ' + anteil(w, basis)),
    pfeil !== undefined && React.createElement('span', { key: 'p', 'aria-hidden': 'true', style: { color: palette.mid, width: '12px', textAlign: 'center' } }, pfeil ? '−' : '+'),
  ];
  return React.createElement('div', { 'data-teil': 'monatsring', style: { display: 'flex', flexWrap: 'wrap', gap: space.lg + 'px', alignItems: 'center' } },
    React.createElement('div', { style: { position: 'relative', width: MASS + 'px', height: MASS + 'px', margin: '0 auto', flexShrink: 0 } },
      // Das Bild wiederholt nur die Liste daneben — für Screenreader stumm; Titel und Zahl in der Mitte sind Text.
      React.createElement('svg', { width: MASS, height: MASS, viewBox: '0 0 200 200', 'aria-hidden': 'true', style: { display: 'block', transform: 'rotate(-90deg)' } },
        React.createElement('circle', { cx: 100, cy: 100, r: 86, fill: 'none', stroke: palette.up, strokeWidth: 20 }),
        stuecke.map((s) => React.createElement('circle', {
          key: s.key, cx: 100, cy: 100, r: 86, fill: 'none', stroke: s.farbe, strokeWidth: 20, pathLength: 100,
          strokeDasharray: s.laenge + ' ' + (100 - s.laenge), strokeDashoffset: -s.anfang,
          opacity: offen && offen !== s.gruppe ? 0.3 : 1,
        }))
      ),
      React.createElement('div', { style: { position: 'absolute', inset: '38px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.25 } }, titel),
        React.createElement('div', { style: { fontSize: text.xl, fontWeight: weight.bold, color: palette.text, lineHeight: 1.2 } }, zahl)
      )
    ),
    React.createElement('section', { 'aria-labelledby': 'mp-ring-titel', style: { flex: '1 1 260px', minWidth: 0 } },
      React.createElement('h3', { id: 'mp-ring-titel', style: { margin: '0 0 ' + space.xs + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('chapters.finanzen.kuchenFrage')),
      gruppen.map((g) => {
        const name = t('chapters.finanzen.monat.teil.' + g.key);
        const auf = offen === g.key;
        if (g.posten.length < 2) return React.createElement('div', { key: g.key, 'data-gruppe': g.key, style: zeile }, zeilenInhalt(g.farbe, name, g.wert));
        return React.createElement('div', { key: g.key, 'data-gruppe': g.key },
          React.createElement('button', { type: 'button', 'aria-expanded': auf, onClick: () => setOffen(auf ? null : g.key), style: { ...zeile, cursor: 'pointer' } }, zeilenInhalt(g.farbe, name, g.wert, auf)),
          auf && React.createElement('ul', { style: { listStyle: 'none', margin: 0, padding: '4px 0 4px 18px', fontSize: text.xs } },
            g.posten.map((p) => React.createElement('li', { key: p.key, style: { display: 'flex', gap: space.sm + 'px', padding: '2px 0' } },
              React.createElement('span', { style: { flex: 1, minWidth: 0, color: palette.text } }, p.label),
              React.createElement('span', { style: wert }, betrag(Math.round(p.value)) + ' · ' + anteil(p.value, basis))
            ))
          )
        );
      }),
      rest > 0 && React.createElement('div', { 'data-gruppe': 'bleibt', style: { ...zeile, borderBottom: 0 } }, zeilenInhalt(null, t('budgetSync.remaining'), rest))
    )
  );
};
