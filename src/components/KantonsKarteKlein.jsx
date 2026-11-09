import React from 'react';
import { KARTE_GEO, KARTEN } from '../data/kantonskarten.js';
import { DARK_PALETTE } from '../config/constants.js';
import { getCantonName } from '../config/kantonPLZ.js';
import { text, space, weight, radius } from '../config/tokens.js';

// ─── C · Mini-Karte im Werkzeug (Entscheid Stebler Studios 09.11.2026) ───────
// Dieselbe Karte wie auf /kantonsatlas/, dieselben vier Stufen (scripts/app-verstehen.mjs erzeugt
// die Daten aus dem Atlas), aber mit dem eigenen Kanton markiert und seiner Zahl daneben.
// Wird nur nachgeladen, wenn jemand «Auf der Karte» aufklappt (VerstehenImWerkzeug).
//
// Regeln aus dem Atlas-Entscheid vom 24.10.2026, hier genauso: keine Rangliste, keine
// Wertungsfarben. Eine Farbe in vier Stufen; dunkler heisst «höhere Zahl», nicht «besser».
// Darum steht neben dem eigenen Wert der Wert der ganzen Schweiz und kein Platz.
//
// Titel, Einheit und Spannen kommen deutsch aus dem Atlas (lang="de"), wie die verlinkten Seiten.

// Die Stufenfarben der öffentlichen Karte (scripts/seiten/kantonsatlas.mjs, :root --k1…--k4).
const STUFEN_HELL = { 1: '#D3DEE9', 2: '#B3C4D6', 3: '#6787A5', 4: '#3D5A76', see: '#F2F2F0' };
const STUFEN_DUNKEL = { 1: '#2E3742', 2: '#4A6380', 3: '#86A6C2', 4: '#C6D6E5', see: '#22211F' };

const h = React.createElement;

export default function KantonsKarteKlein({ palette, t, karte, kanton }) {
  const K = KARTEN[karte];
  if (!K) return null;
  // Im dunklen Modus dreht der Atlas die Helligkeit: die höchste Stufe ist die hellste. Der Satz unter
  // der Karte muss das mitsagen (Durchsicht im Browser 09.11.2026: er sagte «dunkler» auch im dunklen Modus).
  const dunkel = palette.bg === DARK_PALETTE.bg;
  const farben = dunkel ? STUFEN_DUNKEL : STUFEN_HELL;
  const eigen = kanton && K.werte[kanton] ? kanton : null;
  const name = eigen ? getCantonName(eigen, t) : '';
  const beschreibung = eigen
    ? t('erklaerseite.karteBeschreibungMit', { titel: K.titel, kanton: name })
    : t('erklaerseite.karteBeschreibungOhne', { titel: K.titel });

  // Der eigene Kanton wird zuletzt gezeichnet, damit sein Rand über den Nachbarn liegt.
  const reihe = Object.keys(KARTE_GEO.kantone).filter((k) => k !== eigen);
  if (eigen) reihe.push(eigen);

  const svg = h('svg', {
    viewBox: `0 0 ${KARTE_GEO.w} ${KARTE_GEO.h}`, role: 'img', 'aria-label': beschreibung, focusable: 'false',
    style: { display: 'block', width: '100%', height: 'auto' },
  },
  reihe.map((k) => h('path', {
    key: k, d: KARTE_GEO.kantone[k], fill: farben[K.werte[k].s],
    stroke: k === eigen ? palette.text : palette.surface,
    strokeWidth: k === eigen ? 3 : 0.8, strokeLinejoin: 'round',
    'data-kanton': k, 'data-eigen': k === eigen ? 'ja' : undefined,
  })),
  KARTE_GEO.seen.map((d, i) => h('path', { key: 'see' + i, d, fill: farben.see, stroke: 'none' })));

  const zeile = (stil, ...kinder) => h('p', { style: { margin: 0, fontSize: text.sm, color: palette.text, ...stil } }, ...kinder);

  return h('figure', { 'data-teil': 'kantonskarte-klein', style: { margin: space.sm + 'px 0 0' } },
    h('p', { lang: 'de', style: { margin: '0 0 ' + space.xs + 'px', fontSize: text.xs, color: palette.mid } }, `${K.titel} · ${K.einheit}`),
    svg,
    h('figcaption', { style: { marginTop: space.sm + 'px' } },
      eigen
        ? zeile({ fontWeight: weight.semi }, `${name}: `, h('span', { lang: 'de' }, K.werte[eigen].text))
        : zeile({ color: palette.mid }, t('erklaerseite.ohneKanton')),
      K.ch && zeile({ color: palette.mid, marginTop: space.xs + 'px' }, `${t('erklaerseite.ganzeSchweiz')}: `, h('span', { lang: 'de' }, K.ch)),
      h('ul', { role: 'list', lang: 'de', style: { listStyle: 'none', padding: 0, margin: space.sm + 'px 0 0', display: 'flex', flexWrap: 'wrap', gap: space.xs + 'px ' + space.ms + 'px', fontSize: text.xs, color: palette.mid } },
        K.spannen.map((s) => h('li', { key: s.s, style: { display: 'flex', alignItems: 'center', gap: space.xs + 'px' } },
          h('i', { 'aria-hidden': 'true', style: { display: 'inline-block', width: 12, height: 12, borderRadius: radius.hair, background: farben[s.s] } }),
          s.text))),
      zeile({ color: palette.mid, fontSize: text.xs, marginTop: space.xs + 'px' }, t(dunkel ? 'erklaerseite.stufenHinweisDunkel' : 'erklaerseite.stufenHinweis'))));
}
