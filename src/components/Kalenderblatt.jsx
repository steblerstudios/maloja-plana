import React from 'react';
import { text, weight, radius } from '../config/tokens.js';
import { getBereich, bereichColor } from '../data/lebensbereiche.js';
import FruchtMitIcon from '../FruchtMitIcon.jsx';

// Kalenderblatt: das Zeichen für eine Frist mit Handlung (F9-A14, Variante E, Stebler Studios 06.11.2026,
// «Ja, E so»). Nur für Fristen, nicht für jedes Datum: Geburtsdatum, «Stand vom …», Export- und
// Importdatum bekommen kein Blatt, sonst sagt das Zeichen nichts mehr.
// Gestalt E: Band mit dem Monat in `sky` mit Alpha 55 auf `surface` (Monat in `text`, gemessen 6.9:1
// dunkel, 10:1 hell), oben eine volle Kante von 3 px, Rahmen in derselben Farbe. Vorbei: `rose`.
// Die Farbe trägt das Blatt; die Karte drumherum bleibt neutral.
// Das Blatt selbst bleibt immer blau bzw. rot, nie in der Farbe des Lebensbereichs: Finanzen ist Gold
// (= handeln), Familie und Notfall liegen nahe am Rot (= vorbei), Versicherungen ist genau das Frist-Blau.
// Das Thema zeigt der **Frucht-Stempel** unten rechts (Stebler Studios 06.11.2026, «ja super», nach
// Skizzen F–J und Probe): die Frucht des Lebensbereichs mit dem Themensymbol als Aussparung
// (FruchtMitIcon, Obstgarten-Motiv), ohne runde Unterlage («die schwarze dicke Umrandung verlieren»).
// Immer `aria-hidden`: Das Datum steht vorlesbar im Satz daneben, das Thema sagt die Seite.

export const BAND_ALPHA = '55';

export const kalenderblattFarbe = (palette, vorbei) => (vorbei ? palette.rose : palette.sky);

const LOCALE = /^[a-z]{2}-[A-Z]{2}$/;

// «2027-03-31» (auch mit Uhrzeit) → Date am Mittag, damit keine Zeitzone auf den Vortag kippt. Sonst null.
export const blattDatum = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12);
  return isNaN(d.getTime()) || d.getDate() !== Number(m[3]) ? null : d;
};

// Dunkler Grund? Nur mit Hex-Farbe rechenbar (Tests mit sparsamer Palette: kein Stempel).
const dunklerGrund = (palette) => {
  const m = /^#([0-9a-f]{6})$/i.exec(palette.bg || '');
  if (!m) return null;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
};

// `thema`: { bereich, icon } — Lebensbereich (data/lebensbereiche.js) und Symbol (IconSystem).
// Ohne bekannten Bereich oder ohne Frucht: kein Stempel, das Blatt steht allein.
export const themenStempel = (palette, thema, klein) => {
  const b = thema && getBereich(thema.bereich);
  const dunkel = dunklerGrund(palette);
  if (!b || !b.fruit || dunkel == null) return null;
  return React.createElement('span', {
    'data-teil': 'themenfrucht', 'data-bereich': thema.bereich,
    style: { position: 'absolute', right: klein ? '-12px' : '-16px', bottom: klein ? '-10px' : '-13px', display: 'inline-flex', pointerEvents: 'none' },
  }, React.createElement(FruchtMitIcon, { fruit: b.fruit, iconName: thema.icon, color: bereichColor(thema.bereich, dunkel), size: klein ? 36 : 44 }));
};

// `klein`: für Listen (Kalender), ohne Jahr. Ohne gültiges Datum kein Blatt.
export const Kalenderblatt = ({ iso, palette, locale = 'de-CH', vorbei = false, klein = false, thema = null }) => {
  const d = blattDatum(iso);
  if (!d || !palette) return null;
  const loc = LOCALE.test(locale) ? locale : 'de-CH';
  const farbe = kalenderblattFarbe(palette, vorbei);
  const stempel = themenStempel(palette, thema, klein);
  const h = React.createElement;
  return h('div', {
    'aria-hidden': 'true', 'data-teil': 'kalenderblatt', 'data-zustand': vorbei ? 'vorbei' : 'offen',
    style: { position: 'relative', flexShrink: 0, width: (klein ? 48 : 64) + 'px', marginRight: stempel ? (klein ? '8px' : '10px') : 0 },
  },
    h('div', { 'data-teil': 'blatt', style: { textAlign: 'center', borderRadius: radius.sm, border: '1px solid ' + farbe, background: palette.surface, overflow: 'hidden' } },
      h('div', { 'data-teil': 'kante', style: { height: '3px', background: farbe } }),
      h('div', { 'data-teil': 'band', style: { fontSize: '11px', fontWeight: weight.semi, letterSpacing: '0.5px', textTransform: 'uppercase', background: farbe + BAND_ALPHA, color: palette.text, padding: '2px 0' } },
        d.toLocaleDateString(loc, { month: 'short' }).replace('.', '')),
      h('div', { style: { fontSize: klein ? '18px' : (text.xl || '22px'), fontWeight: weight.bold, color: palette.text, lineHeight: 1.2, padding: (klein ? 1 : 2) + 'px 0 ' + (klein ? 3 : 0) + 'px', fontVariantNumeric: 'tabular-nums' } }, String(d.getDate())),
      !klein && h('div', { style: { fontSize: '11px', color: palette.mid, paddingBottom: '3px' } }, String(d.getFullYear()))),
    stempel);
};

export default Kalenderblatt;
