import React, { useState } from 'react';
import { text, weight, space, radius } from '../config/tokens.js';
import { betrag } from '../utils/geld.js';
import { bereichsTon } from '../utils/lebensbereichFruechte.js';
import { ausgabenPosten } from './Geldfluss.jsx';

// Monatsring im Kapitel Finanzen (F7-K2-2, Stebler Studios 01.11.2026: «fusionieren, kreativ», dann «den Kreis, das in der Mitte,
// Kuchen, Monatsring und Balken wie A»). Fasst zusammen, was vorher getrennt stand: Die Antwort steht in der Mitte des Rings,
// der Ring ist das ganze Einkommen, die offene Stelle ist, was bleibt. Darunter der Balken mit den Namen darin; er ersetzt die
// Legende, und ein Klick öffnet die Posten. Rechnung wie vorher: utils/monatsrechnung.js.
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

const MASS = 220;
const LUFT = 0.35; // Abstand zwischen zwei Stücken, in Prozent des Rings

export const Monatsring = ({ data, t, palette, einkommen, verplant, titel, titelJahr, zahl, fuss }) => {
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
    style: { minHeight: '36px', minWidth: '72px', padding: '0 ' + space.md + 'px', border: 0, borderRadius: radius.full, cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm,
      fontWeight: faktor === wert ? weight.semi : weight.normal, background: faktor === wert ? palette.surface : 'transparent', color: palette.text },
  }, name);
  // Kachel im Balken: oben die Farbe, darunter Name und Betrag. Die Breite folgt dem Betrag; zu schmale Kacheln
  // rutschen auf dem Handy in eine zweite Zeile, statt den Namen abzuschneiden. Die wahren Anteile zeigt der Ring.
  const kachel = (key, wert, name, farbe, knopf, auf) => React.createElement(knopf ? 'button' : 'div', {
    key, 'data-gruppe': key, ...(knopf ? { type: 'button', 'aria-expanded': auf, onClick: () => setOffen(auf ? null : key) } : {}),
    style: { position: 'relative', flex: wert + ' 1 104px', minWidth: 0, minHeight: '72px', padding: space.xs + 'px ' + space.sm + 'px', textAlign: 'left', fontFamily: 'inherit', fontSize: text.xs, lineHeight: 1.3, color: palette.text, cursor: knopf ? 'pointer' : 'default',
      background: auf ? palette.surface : farbe ? palette.up : 'transparent', border: farbe ? 0 : '1px dashed ' + palette.mid, borderTop: farbe ? '6px solid ' + farbe : '1px dashed ' + palette.mid, borderRadius: radius.sm, outline: auf ? '1px solid ' + palette.mid : 'none' },
  },
    React.createElement('span', { style: { display: 'block', fontWeight: weight.semi, color: palette.text } }, name),
    React.createElement('span', { style: { display: 'block', color: palette.text, fontVariantNumeric: 'tabular-nums' } }, chf(wert)),
    React.createElement('span', { style: { display: 'block', color: palette.mid, fontVariantNumeric: 'tabular-nums' } }, anteil(wert, basis)),
    knopf && React.createElement('span', { 'aria-hidden': 'true', style: { position: 'absolute', right: space.sm + 'px', bottom: space.xs + 'px', color: palette.mid } }, auf ? '−' : '+')
  );
  const auf = gruppen.find((g) => g.key === offen);
  return React.createElement('div', { 'data-teil': 'monatsring' },
    React.createElement('div', { role: 'group', 'aria-label': t('chapters.finanzen.monat.ansicht'), style: { display: 'flex', width: 'fit-content', margin: '0 auto ' + space.sm + 'px', padding: '3px', borderRadius: radius.full, background: palette.up } },
      umschalter(1, t('chapters.finanzen.monat.ansichtMonat')), umschalter(12, t('chapters.finanzen.monat.ansichtJahr'))),
    React.createElement('div', { style: { position: 'relative', width: MASS + 'px', height: MASS + 'px', margin: '0 auto ' + space.md + 'px' } },
      // Das Bild wiederholt nur den Balken darunter — für Screenreader stumm; Titel und Zahl in der Mitte sind Text.
      React.createElement('svg', { width: MASS, height: MASS, viewBox: '0 0 200 200', 'aria-hidden': 'true', style: { display: 'block', transform: 'rotate(-90deg)' } },
        React.createElement('circle', { cx: 100, cy: 100, r: 86, fill: 'none', stroke: palette.up, strokeWidth: 20 }),
        stuecke.map((s) => React.createElement('circle', {
          key: s.key, cx: 100, cy: 100, r: 86, fill: 'none', stroke: s.farbe, strokeWidth: 20, pathLength: 100,
          strokeDasharray: s.laenge + ' ' + (100 - s.laenge), strokeDashoffset: -s.anfang,
          opacity: offen && offen !== s.gruppe ? 0.3 : 1,
        }))
      ),
      React.createElement('div', { style: { position: 'absolute', inset: '38px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.25 } }, jahr ? titelJahr : titel),
        React.createElement('div', { style: { fontSize: text.xl, fontWeight: weight.bold, color: palette.text, lineHeight: 1.2 } }, jahr ? betrag(Math.abs(Math.round(zahl * 12))) : betrag(Math.abs(zahl)))
      )
    ),
    React.createElement('section', { 'aria-labelledby': 'mp-ring-titel' },
      React.createElement('h3', { id: 'mp-ring-titel', style: { margin: '0 0 ' + space.xs + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('chapters.finanzen.kuchenFrage')),
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '3px' } },
        gruppen.map((g) => kachel(g.key, g.wert, t('chapters.finanzen.monat.teil.' + g.key), g.farbe, g.posten.length > 1, offen === g.key)),
        rest > 0 && kachel('bleibt', rest, t('budgetSync.remaining'), null, false, false)
      ),
      auf && React.createElement('ul', { style: { listStyle: 'none', margin: space.xs + 'px 0 0', padding: 0, fontSize: text.xs } },
        auf.posten.map((p) => React.createElement('li', { key: p.key, style: { display: 'flex', gap: space.sm + 'px', padding: '3px 0', borderBottom: '1px solid ' + palette.border } },
          React.createElement('span', { style: { flex: 1, minWidth: 0, color: palette.text } }, p.label),
          React.createElement('span', { style: { color: palette.mid, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } }, chf(p.value) + ' · ' + anteil(p.value, basis))
        ))
      )
    ),
    fuss && fuss(faktor),
    jahr && React.createElement('p', { style: { margin: space.xs + 'px 0 0', fontSize: text.xs, color: palette.mid } }, t('chapters.finanzen.monat.jahrHinweis'))
  );
};
