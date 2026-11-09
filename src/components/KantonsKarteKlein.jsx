import React from 'react';
import { KARTE_GEO, KARTEN, STUFEN_FARBEN } from '../data/kantonskarten.js';
import { DARK_PALETTE } from '../config/constants.js';
import { getCantonName } from '../config/kantonPLZ.js';
import { ExternerLink } from './ExternerLink.jsx';
import { text, space, weight, radius } from '../config/tokens.js';

// ─── C · Mini-Karte im Werkzeug (Entscheid Stebler Studios 09.11.2026) ───────
// Dieselbe Karte wie auf /kantonsatlas/: dieselben vier Stufen, Farben, Legende und Belege
// (scripts/app-verstehen.mjs erzeugt die Daten aus dem Atlas), aber mit dem eigenen Kanton markiert
// und seiner Zahl daneben. Wird nur nachgeladen, wenn jemand «auf der Karte» aufklappt.
//
// Regeln aus dem Atlas-Entscheid vom 24.10.2026, hier genauso: keine Rangliste, keine
// Wertungsfarben. Eine Farbe in vier Stufen; die Stufe sagt «höhere Zahl», nicht «besser».
// Darum steht neben dem eigenen Wert der Wert der ganzen Schweiz und kein Platz.
//
// Titel, Einheit, Legende und Spannen kommen deutsch aus dem Atlas (lang="de"), wie die verlinkten Seiten.

// Markierung des eigenen Kantons, in Bildschirm-Pixeln (vectorEffect: non-scaling-stroke), damit sie auf dem
// Handy nicht dünner wird. Zwei Ringe (a11y-Prüfung 09.11.2026): aussen breit in der Grundfarbe der Fläche,
// innen schmal in der Textfarbe. Einer der beiden hebt sich von jeder der vier Stufen ab, hell wie dunkel.
const RING_AUSSEN_PX = 5;
const RING_INNEN_PX = 2;
const GRENZE_PX = 0.75;
const FELD_PX = space.ms; // Legendenfeld

const h = React.createElement;

export default function KantonsKarteKlein({ palette, t, karte, kanton }) {
  const K = KARTEN[karte];
  if (!K) return null;
  // Im dunklen Modus dreht der Atlas die Helligkeit: die höchste Stufe ist die hellste. Der Satz unter
  // der Karte muss das mitsagen (Durchsicht im Browser 09.11.2026: er sagte «dunkler» auch im dunklen Modus).
  const dunkel = palette.bg === DARK_PALETTE.bg;
  const farben = dunkel ? STUFEN_FARBEN.dunkel : STUFEN_FARBEN.hell;
  const eigen = kanton && K.werte[kanton] ? kanton : null;
  const name = eigen ? getCantonName(eigen, t) : '';
  const beschreibung = eigen
    ? t('erklaerseite.karteBeschreibungMit', { titel: K.titel, kanton: name })
    : t('erklaerseite.karteBeschreibungOhne', { titel: K.titel });

  const flaeche = (k) => h('path', {
    key: k, d: KARTE_GEO.kantone[k], fill: farben[K.werte[k].s],
    stroke: palette.surface, strokeWidth: GRENZE_PX, vectorEffect: 'non-scaling-stroke', strokeLinejoin: 'round', 'data-kanton': k,
  });
  const ring = (breite, farbe, schluessel) => h('path', {
    key: schluessel, d: KARTE_GEO.kantone[eigen], fill: 'none', stroke: farbe, strokeWidth: breite,
    vectorEffect: 'non-scaling-stroke', strokeLinejoin: 'round', 'data-eigen': schluessel === 'innen' ? 'ja' : undefined,
  });

  const svg = h('svg', {
    viewBox: `0 0 ${KARTE_GEO.w} ${KARTE_GEO.h}`, role: 'img', 'aria-label': beschreibung, focusable: 'false',
    style: { display: 'block', width: '100%', height: 'auto' },
  },
  Object.keys(KARTE_GEO.kantone).map(flaeche),
  KARTE_GEO.seen.map((d, i) => h('path', { key: 'see' + i, d, fill: farben.see, stroke: 'none' })),
  // Die Ringe zuletzt, damit sie über Nachbarn und Seen liegen.
  eigen && ring(RING_AUSSEN_PX, palette.surface, 'aussen'),
  eigen && ring(RING_INNEN_PX, palette.text, 'innen'));

  const zeile = (stil, ...kinder) => h('p', { style: { margin: 0, fontSize: text.sm, color: palette.text, ...stil } }, ...kinder);
  const leise = { color: palette.mid, fontSize: text.xs, marginTop: space.xs + 'px' };
  const link = { color: palette.skyDeep || palette.text, textDecoration: 'underline', textUnderlineOffset: '2px' };
  const ohneKanton = zeile({ color: palette.mid }, t('erklaerseite.ohneKanton', { bereich: t('chapters.basis.title') }));

  // «Beides» (Stebler Studios 09.11.2026): neben der Karte die Zahl davor und danach, als kleine Tabelle. Die Farben
  // zeigen nur die Karte (nach Verbilligung); die Wirkung der Verbilligung steht in den Zahlen.
  const vergleichsTabelle = () => {
    const V = K.vergleich;
    const zelle = { padding: space.xs + 'px ' + space.sm + 'px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: palette.text };
    const kopf = { ...zelle, fontSize: text.xs, fontWeight: weight.medium, color: palette.mid, verticalAlign: 'bottom' };
    const reihe = (titel, vor, nach, fett) => h('tr', { key: titel },
      h('th', { scope: 'row', style: { ...zelle, textAlign: 'left', paddingLeft: 0, fontWeight: fett ? weight.semi : weight.normal } }, titel),
      h('td', { lang: 'de', style: zelle }, vor),
      h('td', { lang: 'de', style: { ...zelle, fontWeight: fett ? weight.semi : weight.normal } }, nach));
    return h(React.Fragment, null,
      h('table', { 'data-teil': 'vor-nach', style: { borderCollapse: 'collapse', fontSize: text.sm, width: '100%' } },
        h('thead', null, h('tr', null,
          h('td', null),
          h('th', { scope: 'col', lang: 'de', style: kopf }, V.titel),
          h('th', { scope: 'col', lang: 'de', style: kopf }, K.titel))),
        h('tbody', null,
          eigen && reihe(name, V.werte[eigen], K.werte[eigen].text, true),
          V.ch && K.ch && reihe(t('erklaerseite.ganzeSchweiz'), V.ch, K.ch, false))),
      !eigen && h('div', { style: { marginTop: space.xs + 'px' } }, ohneKanton));
  };

  return h('figure', { 'data-teil': 'kantonskarte-klein', style: { margin: space.sm + 'px 0 0' } },
    h('p', { lang: 'de', style: { margin: '0 0 ' + space.xs + 'px', fontSize: text.xs, color: palette.mid } }, `${K.titel} · ${K.einheit}`),
    svg,
    h('figcaption', { style: { marginTop: space.sm + 'px' } },
      K.vergleich
        ? vergleichsTabelle()
        : h(React.Fragment, null,
          eigen
            ? zeile({ fontWeight: weight.semi }, `${name}: `, h('span', { lang: 'de' }, K.werte[eigen].text))
            : ohneKanton,
          K.ch && zeile({ color: palette.mid, marginTop: space.xs + 'px' }, `${t('erklaerseite.ganzeSchweiz')}: `, h('span', { lang: 'de' }, K.ch))),
      h('ul', { role: 'list', lang: 'de', style: { listStyle: 'none', padding: 0, margin: space.sm + 'px 0 0', display: 'flex', flexWrap: 'wrap', gap: space.xs + 'px ' + space.ms + 'px', fontSize: text.xs, color: palette.mid } },
        K.spannen.map((s) => h('li', { key: s.s, style: { display: 'flex', alignItems: 'center', gap: space.xs + 'px' } },
          h('i', { 'aria-hidden': 'true', style: { display: 'inline-block', width: FELD_PX, height: FELD_PX, borderRadius: radius.hair, background: farben[s.s], boxShadow: `inset 0 0 0 1px ${palette.mid}` } }),
          s.text))),
      zeile(leise, t(dunkel ? 'erklaerseite.stufenHinweisDunkel' : 'erklaerseite.stufenHinweis')),
      // Legende wie auf der Atlas-Seite: Jahr und Rahmung («Rechenwert über alle Versicherten …»).
      h('p', { lang: 'de', style: { margin: space.sm + 'px 0 0', fontSize: text.sm, color: palette.text } }, K.legende),
      K.quellen.length > 0 && h('p', { style: leise },
        `${t('erklaerseite.belegWort')}: `,
        K.quellen.map((q, i) => h(React.Fragment, { key: q.url }, i > 0 && ' · ',
          h(ExternerLink, { t, href: q.url, hrefLang: 'de', lang: 'de', style: link }, q.text))))));
}
