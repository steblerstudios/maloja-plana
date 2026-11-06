import React from 'react';
import { text, weight, radius } from '../config/tokens.js';

// Kalenderblatt: das Zeichen für eine Frist mit Handlung (F9-A14, Variante E, Stebler Studios 06.11.2026,
// «Ja, E so»). Nur für Fristen, nicht für jedes Datum: Geburtsdatum, «Stand vom …», Export- und
// Importdatum bekommen kein Blatt, sonst sagt das Zeichen nichts mehr.
// Gestalt E: Band mit dem Monat in `sky` mit Alpha 55 auf `surface` (Monat in `text`, gerechnet etwa
// 10:1 hell, 7:1 dunkel), oben eine volle Kante von 3 px, Rahmen in derselben Farbe. Vorbei: `rose`.
// Die Farbe trägt das Blatt; die Karte drumherum bleibt neutral.
// Immer `aria-hidden`: Das Datum steht vorlesbar im Satz daneben, das Blatt ist nur fürs Auge.
// Bewusst nicht in der Farbe des Lebensbereichs: Finanzen ist Gold (= handeln), Familie und Notfall
// liegen nahe am Rot (= vorbei), Versicherungen ist genau das Frist-Blau. Das Thema zeigt das Symbol daneben.

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

// `klein`: für Listen (Kalender), ohne Jahr. Ohne gültiges Datum kein Blatt.
export const Kalenderblatt = ({ iso, palette, locale = 'de-CH', vorbei = false, klein = false }) => {
  const d = blattDatum(iso);
  if (!d || !palette) return null;
  const loc = LOCALE.test(locale) ? locale : 'de-CH';
  const farbe = kalenderblattFarbe(palette, vorbei);
  const h = React.createElement;
  return h('div', {
    'aria-hidden': 'true', 'data-teil': 'kalenderblatt', 'data-zustand': vorbei ? 'vorbei' : 'offen',
    style: { flexShrink: 0, width: (klein ? 48 : 64) + 'px', textAlign: 'center', borderRadius: radius.sm, border: '1px solid ' + farbe, background: palette.surface, overflow: 'hidden' },
  },
    h('div', { 'data-teil': 'kante', style: { height: '3px', background: farbe } }),
    h('div', { 'data-teil': 'band', style: { fontSize: '11px', fontWeight: weight.semi, letterSpacing: '0.5px', textTransform: 'uppercase', background: farbe + BAND_ALPHA, color: palette.text, padding: '2px 0' } },
      d.toLocaleDateString(loc, { month: 'short' }).replace('.', '')),
    h('div', { style: { fontSize: klein ? '18px' : (text.xl || '22px'), fontWeight: weight.bold, color: palette.text, lineHeight: 1.2, padding: (klein ? 1 : 2) + 'px 0 ' + (klein ? 3 : 0) + 'px', fontVariantNumeric: 'tabular-nums' } }, String(d.getDate())),
    !klein && h('div', { style: { fontSize: '11px', color: palette.mid, paddingBottom: '3px' } }, String(d.getFullYear())));
};

export default Kalenderblatt;
