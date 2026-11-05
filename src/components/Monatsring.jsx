import React, { useState } from 'react';
import { text, weight, space, radius } from '../config/tokens.js';
import { betrag } from '../utils/geld.js';
import { bereichsTon } from '../utils/lebensbereichFruechte.js';
import { ausgabenPosten } from './Geldfluss.jsx';
import { auswahlStil, KNOPF_RADIUS } from './PrimaryButton.jsx';

// Monatskarte im Kapitel Finanzen (F7-K2-2, Stebler Studios 01.11.2026: «fusionieren, kreativ», dann eine Karte statt vier Blöcken,
// dann nach der Gestaltungsprüfung umgebaut). Der Ring ist das ganze Einkommen, die Antwort steht in der Mitte. Jeder Bereich trägt
// seine Farbe (Muster M8; Granit-Töne verworfen, Stebler Studios: «unsere verschiedenen Farben pro Feld»), was bleibt ist sage.
// Die Balken messen wie der Ring am Einkommen. Ein Klick öffnet die Posten. Rechnung wie vorher: utils/monatsrechnung.js.
// Im Minus ist der Ring voll und gemessen an den Ausgaben. «Jahr» ist die Monatsrechnung × 12, sie kennt keinen 13. Lohn.

const GRUPPEN = {
  wohnen: ['rent', 'utilities', 'mortgage', 'buildingsInsurance'],
  versicherungen: ['healthInsurance', 'kkZusatz', 'uvgZusatz', 'lifeInsurance', 'householdInsurance', 'liabilityInsurance', 'otherInsurance'],
  // Dieselbe Gruppe wie im Monatsbudget (F8-F1): Vorsorge gehört zu den Steuern, nicht ins Übrige.
  steuern: ['tax', 'pension3a', 'ahvSelbst', 'bvgSelbst'],
};

// Daten ohne React, damit Tests die Stücke nachrechnen können. Grösster Bereich zuerst.
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
  }).filter((g) => g.wert > 0).sort((a, b) => b.wert - a.wert);
  return { gruppen, basis: Math.max(einkommen, verplant) || 1, rest: Math.max(0, einkommen - verplant) };
};

// Kleine Posten nicht als «0 %» (Säule 3a CHF 21 von 3’741).
const anteil = (wert, basis) => {
  const p = (wert / basis) * 100;
  return p > 0 && p < 1 ? '< 1 %' : Math.round(p) + ' %';
};

const MASS = 220;
const SPALTEN = 'minmax(0, 1fr) auto 36px 14px'; // Name · Betrag · Anteil · Pfeil: Beträge und Anteile stehen auf einer Kante
const LUFT = 0.35; // Abstand zwischen zwei Stücken, in Prozent des Rings

export const Monatsring = ({ data, t, palette, einkommen, verplant, titel, titelJahr, zahl, kopf }) => {
  const { gruppen, basis, rest } = ringDaten({ data, t, palette, einkommen, verplant });
  const [offen, setOffen] = useState(null);
  const [faktor, setFaktor] = useState(1);
  const jahr = faktor === 12;
  const chf = (w) => betrag(Math.round(w * faktor));
  const ton = (g) => (offen && offen !== g.key ? 0.45 : 1);
  // Ruhig: je Bereich ein Stück. Nur der geöffnete zeigt seine Posten als einzelne Stücke.
  let start = 0;
  const stuecke = gruppen.flatMap((g) => (offen === g.key ? g.posten : [{ key: g.key, value: g.wert }]).map((p) => {
    const laenge = (p.value / basis) * 100;
    const anfang = start;
    start += laenge;
    return { key: p.key, laenge: Math.max(laenge - LUFT, 0.3), anfang, farbe: g.farbe, opacity: ton(g) };
  }));
  const bogen = (key, laenge, anfang, stroke, opacity) => React.createElement('circle', {
    key, cx: 100, cy: 100, r: 90, fill: 'none', stroke, strokeWidth: 14, pathLength: 100,
    strokeDasharray: laenge + ' ' + (100 - laenge), strokeDashoffset: -anfang, opacity, style: { transition: 'opacity 150ms ease' },
  });
  const umschalter = (wert, name) => React.createElement('button', {
    type: 'button', 'aria-pressed': faktor === wert, onClick: () => setFaktor(wert),
    style: { ...auswahlStil(palette, faktor === wert), minHeight: '36px', padding: '0 ' + space.sm + 'px', fontSize: text.xs, fontWeight: weight.normal },
  }, name);
  const raster = { display: 'grid', gridTemplateColumns: SPALTEN, gap: space.xs + 'px', alignItems: 'baseline' };
  const zahlen = { color: palette.text, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', textAlign: 'right' };
  const zeile = (g) => {
    const auf = offen === g.key;
    const knopf = g.posten.length > 1;
    return React.createElement('div', { key: g.key, 'data-gruppe': g.key, style: { marginBottom: '4px' } },
      React.createElement(knopf ? 'button' : 'div', {
        ...(knopf ? { type: 'button', 'aria-expanded': auf, onClick: () => setOffen(auf ? null : g.key) } : {}),
        style: { display: 'block', width: '100%', minHeight: '44px', boxSizing: 'border-box', padding: '4px 0', background: 'none', border: 0, fontFamily: 'inherit', fontSize: text.sm, textAlign: 'left', color: palette.text, cursor: knopf ? 'pointer' : 'default' },
      },
        React.createElement('span', { style: raster },
          React.createElement('span', { style: { color: palette.text, minWidth: 0 } }, t(g.key === 'steuern' ? 'budgetSync.group.taxProvision' : 'chapters.finanzen.monat.teil.' + g.key)),
          React.createElement('span', { style: zahlen }, chf(g.wert)),
          React.createElement('span', { style: { ...zahlen, fontSize: text.xs, color: palette.mid } }, anteil(g.wert, basis)),
          React.createElement('span', { 'aria-hidden': 'true', style: { color: palette.mid, textAlign: 'center', transform: auf ? 'rotate(90deg)' : 'none', transition: 'transform 150ms ease' } }, knopf ? '›' : '')
        ),
        // Die Spur ist das ganze Einkommen, wie der Ring.
        React.createElement('span', { 'aria-hidden': 'true', style: { display: 'block', height: '6px', marginTop: '4px', borderRadius: radius.full, background: palette.up, overflow: 'hidden' } },
          React.createElement('span', { style: { display: 'block', height: '100%', borderRadius: radius.full, background: g.farbe, width: (g.wert / basis) * 100 + '%', opacity: ton(g), transition: 'opacity 150ms ease' } }))
      ),
      auf && React.createElement('ul', { style: { listStyle: 'none', margin: 0, padding: '2px 0 ' + space.xs + 'px ' + space.md + 'px', fontSize: text.xs } },
        g.posten.map((p) => React.createElement('li', { key: p.key, style: { ...raster, padding: '3px 0' } },
          React.createElement('span', { style: { color: palette.text, minWidth: 0 } }, p.label),
          React.createElement('span', { style: { ...zahlen, color: palette.mid } }, chf(p.value)),
          React.createElement('span', { style: { ...zahlen, color: palette.mid } }, anteil(p.value, basis)),
          React.createElement('span', null)
        ))
      )
    );
  };
  return React.createElement('div', { 'data-teil': 'monatsring', style: { padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.md } },
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: space.xs + 'px ' + space.md + 'px', marginBottom: space.md + 'px' } },
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, kopf && kopf(faktor)),
      React.createElement('div', { role: 'group', 'aria-label': t('chapters.finanzen.monat.ansicht'), style: { display: 'flex', padding: '2px', borderRadius: KNOPF_RADIUS, background: palette.up } },
        umschalter(1, t('chapters.finanzen.monat.ansichtMonat')), umschalter(12, t('chapters.finanzen.monat.ansichtJahr')))
    ),
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.lg + 'px', alignItems: 'center' } },
      React.createElement('div', { style: { position: 'relative', width: MASS + 'px', height: MASS + 'px', margin: '0 auto', flexShrink: 0 } },
        // Das Bild wiederholt nur die Zeilen daneben — für Screenreader stumm; Titel und Zahl in der Mitte sind Text.
        React.createElement('svg', { width: MASS, height: MASS, viewBox: '0 0 200 200', 'aria-hidden': 'true', style: { display: 'block', transform: 'rotate(-90deg)' } },
          stuecke.map((s) => bogen(s.key, s.laenge, s.anfang, s.farbe, s.opacity)),
          rest > 0 && bogen('bleibt', Math.max((rest / basis) * 100 - LUFT, 0.3), start, palette.sage, 0.85)
        ),
        React.createElement('div', { style: { position: 'absolute', inset: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: 1.25 } }, jahr ? titelJahr : titel),
          React.createElement('div', { style: { fontSize: text.xl, fontWeight: weight.bold, color: palette.text, lineHeight: 1.2 } }, betrag(Math.abs(Math.round(zahl * faktor)))),
          rest > 0 && React.createElement('div', { style: { marginTop: '4px', fontSize: text.xs, color: palette.sageDeep || palette.sage } }, anteil(rest, basis))
        )
      ),
      React.createElement('section', { 'aria-labelledby': 'mp-ring-titel', style: { flex: '1 1 280px', minWidth: 0, paddingTop: space.sm + 'px', borderTop: '1px solid ' + palette.border + '88' } },
        React.createElement('h3', { id: 'mp-ring-titel', style: { ...raster, margin: '0 0 ' + space.xs + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text } },
          // Mit der Summe geht die Karte auf: Einkommen oben, minus das hier, gibt die Zahl in der Mitte.
          React.createElement('span', { style: { color: palette.text, minWidth: 0 } }, t('chapters.finanzen.kuchenFrage')),
          React.createElement('span', { style: { ...zahlen, color: palette.mid, fontWeight: weight.normal } }, chf(verplant)),
          React.createElement('span', null), React.createElement('span', null)),
        gruppen.map(zeile)
      )
    ),
    jahr && React.createElement('p', { style: { margin: space.sm + 'px 0 0', fontSize: text.xs, color: palette.mid } }, t('chapters.finanzen.monat.jahrHinweis'))
  );
};
