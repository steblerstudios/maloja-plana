import React from 'react';
import { KARTE_GEO, KARTEN, STUFEN_FARBEN } from '../data/kantonskarten.js';
import { DARK_PALETTE } from '../config/constants.js';
import { getCantonName } from '../config/kantonPLZ.js';
import { ExternerLink } from './ExternerLink.jsx';
import { ABSCHLUSS_STUFE } from './ErklaerseiteLink.jsx';
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

export default function KantonsKarteKlein({ palette, t, karte, kanton, altersklasse, ohneVergleich, abschluss }) {
  const K = KARTEN[karte];
  if (!K) return null;
  // ohneVergleich (18.11.2026): Im Kapitel Wohnen steht die Leerwohnungsziffer als eigene Karte daneben; die
  // zweite Spalte bei der Miete wäre dort doppelt. Im Werkzeug Mietbeiträge bleibt sie, dort gibt es keine zweite Karte.
  const vergleich = ohneVergleich ? null : K.vergleich;
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
    const V = vergleich;
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

  // «Ganze Schweiz nach Merkmal» (Arbeitslosenquote nach Ausbildung 18.11.2026, EL nach Rentenart und Alter 19.11.2026):
  // nur ganze Schweiz, darum Balken statt Karte. Bei der Arbeitslosenquote steht die eigene Stufe fett mit Zusatz, nicht nur
  // in Farbe; ohne erfassten Abschluss ist keine markiert. Bei der EL markiert die App nichts.
  const M = K.merkmale;
  // Nur eine Stufe, die es in dieser Aufteilung gibt (die EL-Zeilen kennen keine Ausbildungsstufe).
  const eigeneStufe = M && M.zeilen.some((z) => z.key === ABSCHLUSS_STUFE[abschluss]) ? ABSCHLUSS_STUFE[abschluss] : null;
  const nachAusbildung = M && h('div', { 'data-teil': 'nach-merkmal', style: { marginTop: space.md + 'px', paddingTop: space.sm + 'px', borderTop: '1px solid ' + palette.border } },
    h('p', { lang: 'de', style: { margin: '0 0 ' + space.xs + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, M.titel),
    h('table', { style: { borderCollapse: 'collapse', fontSize: text.sm, width: '100%' } },
      h('tbody', null,
        M.zeilen.map((z) => {
          const meine = z.key === eigeneStufe;
          const fett = meine ? weight.semi : weight.normal;
          return h('tr', { key: z.key, 'data-stufe': z.key, 'data-eigen': meine ? 'ja' : undefined },
            h('th', { scope: 'row', style: { textAlign: 'left', fontWeight: fett, color: palette.text, padding: space.xs + 'px ' + space.sm + 'px ' + space.xs + 'px 0' } },
              h('span', { lang: 'de' }, z.name), meine && ` · ${t('erklaerseite.ihreAusbildung')}`),
            h('td', { 'aria-hidden': 'true', style: { width: '30%', padding: space.xs + 'px ' + space.sm + 'px', verticalAlign: 'middle' } },
              h('span', { style: { display: 'block', height: '10px', borderRadius: radius.hair, width: `${z.anteil * 100}%`, background: farben[meine ? 4 : 3], boxShadow: `inset 0 0 0 1px ${palette.mid}` } })),
            h('td', { lang: 'de', style: { textAlign: 'right', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', fontWeight: fett, color: palette.text, padding: space.xs + 'px 0' } }, z.text));
        }),
        h('tr', null,
          h('th', { scope: 'row', lang: 'de', style: { textAlign: 'left', fontWeight: weight.normal, color: palette.mid, padding: space.xs + 'px 0' } }, M.total.name),
          h('td', { 'aria-hidden': 'true' }),
          h('td', { lang: 'de', style: { textAlign: 'right', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', color: palette.mid, padding: space.xs + 'px 0' } }, M.total.text)))),
    // Fachprüfung 19.11.2026: Die Auswahl im Kapitel kennt keine höhere Berufsbildung; wer HF oder Fachausweis hat,
    // wählt oft «Lehre EFZ» und stünde bei Sek II. Darum bei Sek II der Satz aus der SECO-Einteilung (S. 26).
    eigeneStufe === 'sek2' && h('p', { 'data-teil': 'hoehere-berufsbildung', style: { margin: space.xs + 'px 0 0', fontSize: text.xs, color: palette.mid } }, t('erklaerseite.hoehereBerufsbildung')),
    h('p', { lang: 'de', style: { margin: space.xs + 'px 0 0', fontSize: text.sm, color: palette.text } }, M.legende),
    M.quellen.length > 0 && h('p', { style: leise },
      `${t('erklaerseite.belegWort')}: `,
      M.quellen.map((q, i) => h(React.Fragment, { key: q.url }, i > 0 && ' · ',
        h(ExternerLink, { t, href: q.url, hrefLang: 'de', lang: 'de', style: link }, q.text)))));

  return h('figure', { 'data-teil': 'kantonskarte-klein', style: { margin: space.sm + 'px 0 0' } },
    h('p', { lang: 'de', style: { margin: '0 0 ' + space.xs + 'px', fontSize: text.xs, color: palette.mid } }, `${K.titel} · ${K.einheit}`),
    svg,
    h('figcaption', { style: { marginTop: space.sm + 'px' } },
      vergleich
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
          h(ExternerLink, { t, href: q.url, hrefLang: 'de', lang: 'de', style: link }, q.text)))),
      nachAusbildung));
}
