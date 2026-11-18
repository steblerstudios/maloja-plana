import React from 'react';
import { KARTE_GEO, KARTEN, STUFEN_FARBEN } from '../data/kantonskarten.js';
import { beschriftungsLage } from '../data/punktStreifen.js';
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

export default function KantonsKarteKlein({ palette, t, karte, kanton, altersklasse }) {
  const K = KARTEN[karte];
  if (!K) return null;
  // Im dunklen Modus dreht der Atlas die Helligkeit: die höchste Stufe ist die hellste. Der Satz unter
  // der Karte muss das mitsagen (Durchsicht im Browser 09.11.2026: er sagte «dunkler» auch im dunklen Modus).
  const dunkel = palette.bg === DARK_PALETTE.bg;
  // Jede Karte trägt die Frucht ihres Lebensbereichs (Brand Book §7c), wie auf /kantonsatlas/.
  const satz = STUFEN_FARBEN[K.frucht];
  if (!satz) return null;
  const farben = dunkel ? satz.dunkel : satz.hell;
  const eigen = kanton && K.werte[kanton] ? kanton : null;
  // Karte mit festem Stand (Mindestlohn 2026): im Folgejahr kein Betrag, nur «mit»/«ohne» (Jahressperre wie lohnCheck.js).
  const anderesJahr = K.jahr && new Date().getFullYear() !== K.jahr;
  const eigenText = eigen && (anderesJahr ? (K.spannen.find((s) => s.s === K.werte[eigen].s) || {}).text : K.werte[eigen].text);
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

  // ─── Punktstreifen (Brücke, Probe Miete, Stebler Studios 18.11.2026) ───────────────────────────────
  // Dieselbe Form wie auf /kantonsatlas/ über der Karte: jeder Kanton ein Punkt, Lage = Wert, Farbe = Stufe.
  // Die Lagen rechnet scripts/app-verstehen.mjs mit src/data/punktStreifen.js, hier wird nur gezeichnet. Der
  // eigene Kanton trägt dieselben zwei Ringe wie auf der Karte, damit beide Bilder gleich gelesen werden.
  const St = K.streifen;
  const streifen = St && (() => {
    const eigenPunkt = eigen && St.punkte[eigen];
    const streifenText = eigen
      ? t('erklaerseite.streifenBeschreibungMit', { titel: K.titel, kanton: name })
      : t('erklaerseite.streifenBeschreibungOhne', { titel: K.titel });
    // Namen an den Punkten, gesetzt wie auf /kantonsatlas/ (beschriftungsLage): am Rand bündig, sonst mittig.
    const namenZeile = { position: 'relative', height: '1.5em', fontSize: text.xs, color: palette.mid, fontVariantNumeric: 'tabular-nums' };
    const marke = (x, schluessel, kinder, stil = {}) => {
      const B = beschriftungsLage(x, St.breite);
      const lage = B.ausrichtung === 'rechts' ? { right: (100 - B.prozent) + '%' } : { left: B.prozent + '%' };
      return h('span', { key: schluessel, style: { position: 'absolute', top: 0, whiteSpace: 'nowrap', ...lage, ...(B.ausrichtung === 'mitte' ? { transform: 'translateX(-50%)' } : {}), ...stil } }, ...kinder);
    };
    const kantonZahl = (k, zahlText) => [getCantonName(k, t), ' ', h('span', { key: 'z', lang: 'de' }, zahlText)];
    return h('div', { 'data-teil': 'punktstreifen', style: { margin: '0 0 ' + space.sm + 'px' } },
      h('p', { style: { margin: '0 0 ' + space.sm + 'px', fontSize: text.sm, color: palette.text } }, t('erklaerseite.streifenSatz')),
      // Der eigene Kanton steht über dem Streifen, damit er nie mit den Enden oder der Schweiz zusammenstösst.
      eigenPunkt && h('p', { 'aria-hidden': 'true', 'data-teil': 'streifen-eigen', style: { ...namenZeile, margin: '0 0 2px' } },
        marke(eigenPunkt.x, 'eigen', kantonZahl(eigen, eigenPunkt.text), { color: palette.text, fontWeight: weight.semi })),
      h('svg', {
        viewBox: `0 0 ${St.breite} ${St.hoehe}`, role: 'img', 'aria-label': streifenText, focusable: 'false',
        style: { display: 'block', width: '100%', height: 'auto' },
      },
      h('line', { x1: St.xMin, y1: St.achseY, x2: St.xMax, y2: St.achseY, stroke: palette.mid, strokeWidth: 0.75 }),
      St.ch && h('line', { x1: St.ch.x, y1: 1, x2: St.ch.x, y2: St.hoehe - 1, stroke: palette.text, strokeWidth: 1, strokeDasharray: '2 2' }),
      Object.entries(St.punkte).map(([k, p]) => h('circle', {
        key: k, cx: p.x, cy: p.y, r: St.radius, fill: farben[p.s], stroke: palette.mid, strokeWidth: 0.6, 'data-kanton': k,
      })),
      // Der eigene Punkt zuletzt, mit Ringen wie die Karte (aussen Grundfarbe, innen Textfarbe).
      eigenPunkt && h('circle', { cx: eigenPunkt.x, cy: eigenPunkt.y, r: St.radius + 1.5, fill: 'none', stroke: palette.surface, strokeWidth: RING_AUSSEN_PX / 2, vectorEffect: 'non-scaling-stroke' }),
      eigenPunkt && h('circle', { cx: eigenPunkt.x, cy: eigenPunkt.y, r: St.radius + 1.5, fill: 'none', stroke: palette.text, strokeWidth: RING_INNEN_PX, vectorEffect: 'non-scaling-stroke', 'data-eigen': 'ja' })),
      // Enden und Schweiz als Text unter dem Bild, wie auf /kantonsatlas/ (im SVG wären sie auf dem Handy unter 13 px).
      h('p', { 'aria-hidden': 'true', 'data-teil': 'streifen-namen', style: { ...namenZeile, margin: '4px 0 0' } },
        marke(St.xMin, 'min', kantonZahl(St.minK, St.min)),
        St.ch && marke(St.ch.x, 'ch', [t('erklaerseite.streifenSchweiz'), ' ', h('span', { key: 'z', lang: 'de' }, St.ch.text)]),
        marke(St.xMax, 'max', kantonZahl(St.maxK, St.max))),
      h('p', { style: { margin: space.xs + 'px 0 0', fontSize: text.xs, color: palette.mid } }, t('erklaerseite.streifenHinweis')));
  })();

  // Ohne Kanton: der Weg zur Tabelle im Atlas, wo jede Quelle steht (keine Karte ohne Beleg).
  const quellen = K.quellen.length > 0 ? K.quellen
    : eigen && K.werte[eigen].quelle ? [K.werte[eigen].quelle]
      : [{ text: 'Kantonsatlas, Quelle je Kanton in der Tabelle', url: `/kantonsatlas/#${K.anker}` }];
  const zeile = (stil, ...kinder) => h('p', { style: { margin: 0, fontSize: text.sm, color: palette.text, ...stil } }, ...kinder);
  const leise = { color: palette.mid, fontSize: text.xs, marginTop: space.xs + 'px' };
  const link = { color: palette.skyDeep || palette.text, textDecoration: 'underline', textUnderlineOffset: '2px' };
  // Altersklasse (09.11.2026): Die Karte zeigt Erwachsene. Rechnet das Werkzeug für ein Kind oder eine junge
  // erwachsene Person, steht darunter deren mittlere Prämie aus derselben BAG-Datei, für den Kanton und die Schweiz.
  const klasse = altersklasse && K.altersklassen && K.altersklassen[altersklasse];
  const klassenZeilen = klasse && h('div', { 'data-teil': 'altersklasse', style: { marginTop: space.sm + 'px' } },
    zeile({ color: palette.mid }, t('erklaerseite.karteZeigtErwachsene')),
    zeile({ fontWeight: weight.semi, marginTop: space.xs + 'px' }, `${t(altersklasse === 'kind' ? 'erklaerseite.klasseKind' : 'erklaerseite.klasseJung')}: `,
      eigen && h(React.Fragment, null, `${name} `, h('span', { lang: 'de' }, klasse.werte[eigen]), ' · '),
      `${t('erklaerseite.ganzeSchweiz')} `, h('span', { lang: 'de' }, klasse.ch), h('span', { lang: 'de' }, ` ${K.einheit}`)));
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
    streifen,
    svg,
    h('figcaption', { style: { marginTop: space.sm + 'px' } },
      K.vergleich
        ? vergleichsTabelle()
        : h(React.Fragment, null,
          eigen
            ? zeile({ fontWeight: weight.semi }, `${name}: `, h('span', { lang: 'de' }, eigenText),
              // Alimente (14.11.2026): Stand je Kanton und, wo nötig, der Vorbehalt — wie die Tabelle auf /kantonsatlas/.
              K.werte[eigen].stand && h('span', { style: { fontWeight: weight.normal, color: palette.mid } }, ` · ${t('erklaerseite.standJahr', { jahr: K.werte[eigen].stand })}`),
              K.werte[eigen].nichtGesichert && h('span', { 'data-teil': 'nicht-gesichert', style: { fontWeight: weight.medium, color: palette.text } }, ` · ${t('erklaerseite.nichtGesichert')}`))
            : ohneKanton,
          K.ch && zeile({ color: palette.mid, marginTop: space.xs + 'px' }, `${t('erklaerseite.ganzeSchweiz')}: `, h('span', { lang: 'de' }, K.ch))),
      h('ul', { role: 'list', lang: 'de', style: { listStyle: 'none', padding: 0, margin: space.sm + 'px 0 0', display: 'flex', flexWrap: 'wrap', gap: space.xs + 'px ' + space.ms + 'px', fontSize: text.xs, color: palette.mid } },
        K.spannen.map((s) => h('li', { key: s.s, style: { display: 'flex', alignItems: 'center', gap: space.xs + 'px' } },
          h('i', { 'aria-hidden': 'true', style: { display: 'inline-block', width: FELD_PX, height: FELD_PX, borderRadius: radius.hair, background: farben[s.s], boxShadow: `inset 0 0 0 1px ${palette.mid}` } }),
          s.text))),
      klassenZeilen,
      anderesJahr && zeile({ ...leise, color: palette.text }, t('erklaerseite.anderesJahr', { jahr: K.jahr })),
      // Zwei Gruppen (Mindestlohn) heissen nicht «höhere Zahl»: dort sagt die Legende selbst, was die Farbe zeigt.
      !K.zweiGruppen && zeile(leise, t(dunkel ? 'erklaerseite.stufenHinweisDunkel' : 'erklaerseite.stufenHinweis')),
      // Legende wie auf der Atlas-Seite: Jahr und Rahmung («Rechenwert über alle Versicherten …»).
      h('p', { lang: 'de', style: { margin: space.sm + 'px 0 0', fontSize: text.sm, color: palette.text } }, K.legende),
      // Quelle je Kanton (Alimente): nur die des eigenen Kantons, sonst die der Karte.
      quellen.length > 0 && h('p', { style: leise },
        `${t('erklaerseite.belegWort')}: `,
        quellen.map((q, i) => h(React.Fragment, { key: q.url }, i > 0 && ' · ',
          h(ExternerLink, { t, href: q.url, hrefLang: 'de', lang: 'de', style: link }, q.text))))));
}
