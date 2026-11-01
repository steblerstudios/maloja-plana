import React, { useState } from 'react';
import { text, weight, space, radius } from '../config/tokens.js';
import { betrag } from '../utils/geld.js';
import { bereichsTon } from '../utils/lebensbereichFruechte.js';
import { ausgabenPosten } from './Geldfluss.jsx';

// Monatskarte im Kapitel Finanzen (F7-K2-2, Stebler Studios 01.11.2026: «fusionieren, kreativ», dann «den Kreis, das in der Mitte,
// Kuchen, Monatsring und Balken», dann eine Karte statt vier Blöcken). Der Ring ist das ganze Einkommen, die offene Stelle ist, was
// bleibt, die Antwort steht in der Mitte. Daneben die Bereiche, grösster zuerst; die Länge misst am grössten, die Anteile am
// Einkommen zeigt der Ring. Ein Klick öffnet die Posten. Rechnung wie vorher: utils/monatsrechnung.js.
// Im Minus ist der Ring voll und gemessen an den Ausgaben. «Jahr» ist die Monatsrechnung × 12, sie kennt keinen 13. Lohn.

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

const MASS = 190;
const LUFT = 0.35; // Abstand zwischen zwei Stücken, in Prozent des Rings

export const Monatsring = ({ data, t, palette, einkommen, verplant, titel, titelJahr, zahl, kopf }) => {
  const { gruppen, basis, rest } = ringDaten({ data, t, palette, einkommen, verplant });
  const [offen, setOffen] = useState(null);
  const [faktor, setFaktor] = useState(1);
  const jahr = faktor === 12;
  const chf = (w) => betrag(Math.round(w * faktor));
  let start = 0;
  const stuecke = gruppen.flatMap((g) => g.posten.map((p) => {
    const laenge = (p.value / basis) * 100;
    const anfang = start;
    start += laenge;
    return { key: p.key, laenge: Math.max(laenge - LUFT, 0.3), anfang, farbe: g.farbe, gruppe: g.key };
  }));
  const umschalter = (wert, name) => React.createElement('button', {
    type: 'button', 'aria-pressed': faktor === wert, onClick: () => setFaktor(wert),
    style: { minHeight: '36px', padding: '0 ' + space.md + 'px', border: 0, borderRadius: radius.full, cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm,
      fontWeight: faktor === wert ? weight.semi : weight.normal, background: faktor === wert ? palette.surface : 'transparent', color: palette.text },
  }, name);
  const sortiert = [...gruppen].sort((a, b) => b.wert - a.wert);
  const groesste = sortiert[0]?.wert || 1;
  const zeile = (g) => {
    const auf = offen === g.key;
    const knopf = g.posten.length > 1;
    return React.createElement('div', { key: g.key, 'data-gruppe': g.key },
      React.createElement(knopf ? 'button' : 'div', {
        ...(knopf ? { type: 'button', 'aria-expanded': auf, onClick: () => setOffen(auf ? null : g.key) } : {}),
        style: { display: 'block', width: '100%', minHeight: '44px', boxSizing: 'border-box', padding: '4px 0', background: 'none', border: 0, fontFamily: 'inherit', fontSize: text.sm, textAlign: 'left', color: palette.text, cursor: knopf ? 'pointer' : 'default' },
      },
        React.createElement('span', { style: { display: 'flex', justifyContent: 'space-between', gap: space.sm + 'px' } },
          React.createElement('span', { style: { color: palette.text, minWidth: 0 } }, t('chapters.finanzen.monat.teil.' + g.key)),
          React.createElement('span', { style: { color: palette.text, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } }, chf(g.wert), knopf && React.createElement('span', { 'aria-hidden': 'true', style: { display: 'inline-block', width: '14px', textAlign: 'right', color: palette.mid } }, auf ? '−' : '+'))
        ),
        React.createElement('span', { 'aria-hidden': 'true', style: { display: 'block', height: '7px', marginTop: '3px', borderRadius: radius.full, background: g.farbe, width: (g.wert / groesste) * 100 + '%', opacity: offen && !auf ? 0.3 : 1 } })
      ),
      auf && React.createElement('ul', { style: { listStyle: 'none', margin: 0, padding: '2px 0 ' + space.xs + 'px', fontSize: text.xs } },
        g.posten.map((p) => React.createElement('li', { key: p.key, style: { display: 'flex', justifyContent: 'space-between', gap: space.sm + 'px', padding: '3px 14px 3px 0' } },
          React.createElement('span', { style: { color: palette.text, minWidth: 0 } }, p.label),
          React.createElement('span', { style: { color: palette.mid, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } }, chf(p.value))
        ))
      )
    );
  };
  return React.createElement('div', { 'data-teil': 'monatsring', style: { padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.md } },
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: space.xs + 'px ' + space.md + 'px', marginBottom: space.md + 'px' } },
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, kopf && kopf(faktor)),
      React.createElement('div', { role: 'group', 'aria-label': t('chapters.finanzen.monat.ansicht'), style: { display: 'flex', padding: '3px', borderRadius: radius.full, background: palette.up } },
        umschalter(1, t('chapters.finanzen.monat.ansichtMonat')), umschalter(12, t('chapters.finanzen.monat.ansichtJahr')))
    ),
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.md + 'px ' + space.lg + 'px', alignItems: 'center' } },
      React.createElement('div', { style: { position: 'relative', width: MASS + 'px', height: MASS + 'px', margin: '0 auto', flexShrink: 0 } },
        // Das Bild wiederholt nur die Zeilen daneben — für Screenreader stumm; Titel und Zahl in der Mitte sind Text.
        React.createElement('svg', { width: MASS, height: MASS, viewBox: '0 0 200 200', 'aria-hidden': 'true', style: { display: 'block', transform: 'rotate(-90deg)' } },
          React.createElement('circle', { cx: 100, cy: 100, r: 86, fill: 'none', stroke: palette.up, strokeWidth: 20 }),
          stuecke.map((s) => React.createElement('circle', {
            key: s.key, cx: 100, cy: 100, r: 86, fill: 'none', stroke: s.farbe, strokeWidth: 20, pathLength: 100,
            strokeDasharray: s.laenge + ' ' + (100 - s.laenge), strokeDashoffset: -s.anfang,
            opacity: offen && offen !== s.gruppe ? 0.3 : 1,
          }))
        ),
        React.createElement('div', { style: { position: 'absolute', inset: '34px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.25 } }, jahr ? titelJahr : titel),
          React.createElement('div', { style: { fontSize: text.xl, fontWeight: weight.bold, color: palette.text, lineHeight: 1.2 } }, betrag(Math.abs(Math.round(zahl * faktor)))),
          rest > 0 && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid } }, anteil(rest, basis))
        )
      ),
      React.createElement('section', { 'aria-labelledby': 'mp-ring-titel', style: { flex: '1 1 260px', minWidth: 0 } },
        React.createElement('h3', { id: 'mp-ring-titel', style: { margin: '0 0 ' + space.xs + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('chapters.finanzen.kuchenFrage')),
        sortiert.map(zeile)
      )
    ),
    jahr && React.createElement('p', { style: { margin: space.sm + 'px 0 0', fontSize: text.xs, color: palette.mid } }, t('chapters.finanzen.monat.jahrHinweis'))
  );
};
