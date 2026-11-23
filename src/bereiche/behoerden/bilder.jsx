import React from 'react';
import { radius, INSTRUMENT_GROESSE } from '../../config/tokens.js';
import { Kalenderblatt } from '../../components/Kalenderblatt.jsx';

// Lebensbereich Behörden · die Bilder (Bauplan Lebensbereich; Szene «Gemeindehaus», Stebler Studios 21.11.2026:
// «jetzt für das kapitel nehmen wir das gemeinde haus»). Rein Bild: Zahlen und Sätze stehen daneben (aria-hidden).
//   Anschlagbrett   Frage A Steuerfrist — das Kalenderblatt hängt am Brett neben dem Haus
//   Gemeindehaus    Frage B Behördengänge — ein Fenster je Gang, erledigte hell (gross, mittel, klein 64 für die Kachel)
//   Wegweiser       Frage C Leistungen — der Kompass auf dem Pfosten, die Nadel zeigt wie in der Übersicht
// Jedes Bild steht auf einer Seite nur einmal (Wächter bauplanBehoerden.test.js).

const linie = { vectorEffect: 'non-scaling-stroke' };

// ── Anschlagbrett ───────────────────────────────────────────────────────────────────────────────────────────────────
// Ein Brett auf einem Pfosten, darauf das Kalenderblatt der Steuerfrist (dasselbe Bauteil wie die Kachel). Die Höhe des
// Pfostens folgt der Szene, damit das Brett auf demselben Boden steht wie das Haus.
export const Anschlagbrett = ({ palette, iso, locale, vorbei, pfosten = 60 }) => {
  const h = React.createElement;
  const holz = palette.sand || palette.mid;
  return h('div', { 'aria-hidden': 'true', 'data-teil': 'anschlagbrett', style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
    h('div', { style: { background: holz, borderRadius: radius.sm, padding: '6px' } },
      h(Kalenderblatt, { iso, palette, locale, vorbei, klein: true })),
    h('div', { style: { width: '4px', height: pfosten + 'px', background: holz } }));
};

// ── Gemeindehaus ────────────────────────────────────────────────────────────────────────────────────────────────────
// Satteldach mit Türmchen und Uhr, Tür in der Behörden-Farbe. Fenster: drei oben, darunter links und rechts der Tür je eines.
// Erledigte Gänge sind hell (Sand, wie die Kästchen der früheren Kachel).
//   klein (Kachel): `erledigt` füllt die Fenster der Reihe nach, reines Bild.
//   im Kapitel (Stebler Studios 23.11.2026, zweite Runde «Ja, so bauen»): `fenster` = je Gang { an, label }; jedes Fenster
//   gehört zu seinem Gang und lässt sich antippen (`onWaehle`), das gewählte (`aktiv`) ist dick umrandet.
const FENSTER = [[30, 72], [72, 72], [114, 72], [30, 112], [114, 112]];
export const Gemeindehaus = ({ palette, erledigt = 0, total = 5, farbe, groesse = 'gross', fenster = null, aktiv = null, onWaehle = null, label = '' }) => {
  const h = React.createElement;
  const klein = groesse === 'klein';
  const strich = klein ? 3 : 1.5;
  const tuer = farbe || palette.mid;
  const licht = palette.sand || palette.gold;
  const n = fenster ? fenster.length : total;
  const plaetze = FENSTER.slice(0, Math.max(0, Math.min(n, FENSTER.length)));
  const tippbar = !!(fenster && onWaehle);
  const an = (i) => (fenster ? !!fenster[i]?.an : i < erledigt);
  return h('svg', {
    viewBox: '0 -10 170 172', width: '100%', focusable: 'false', 'data-teil': 'gemeindehaus', 'data-erledigt': fenster ? fenster.filter((f) => f.an).length : erledigt,
    ...(tippbar ? { role: 'group', 'aria-label': label } : { 'aria-hidden': 'true' }),
    style: { display: 'block', maxWidth: INSTRUMENT_GROESSE[groesse] + 'px', height: 'auto', overflow: 'visible' },
  },
    // Türmchen mit Uhr
    h('rect', { x: 75, y: 4, width: 20, height: 26, fill: 'none', stroke: palette.text, strokeWidth: strich, ...linie }),
    h('path', { d: 'M71 4 L85 -8 L99 4 Z', fill: 'none', stroke: palette.text, strokeWidth: strich, strokeLinejoin: 'round', ...linie }),
    !klein && h('circle', { cx: 85, cy: 17, r: 5, fill: 'none', stroke: palette.text, strokeWidth: 1, ...linie }),
    // Dach und Haus
    h('path', { d: 'M8 58 L85 22 L162 58 Z', fill: palette.surface, stroke: palette.text, strokeWidth: strich, strokeLinejoin: 'round', ...linie }),
    h('rect', { x: 16, y: 58, width: 138, height: 102, fill: 'none', stroke: palette.text, strokeWidth: strich, ...linie }),
    ...plaetze.map(([x, y], i) => h('rect', {
      key: 'f' + i, 'data-fenster': i, 'data-an': an(i) ? 'ja' : 'nein', x, y, width: 26, height: 24, rx: 2,
      fill: an(i) ? licht : palette.surface,
      stroke: aktiv === i ? palette.text : an(i) ? licht : palette.mid,
      strokeWidth: aktiv === i ? 3 : klein ? 2.5 : 1.5, ...linie,
      ...(tippbar ? {
        role: 'button', tabIndex: 0, 'aria-label': fenster[i].label, 'aria-pressed': aktiv === i ? 'true' : 'false',
        style: { cursor: 'pointer' },
        onClick: () => onWaehle(i),
        onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onWaehle(i); } },
      } : {}),
    })),
    h('path', { 'data-teil': 'gemeindehaus-tuer', d: 'M73 160 L73 124 Q85 110 97 124 L97 160 Z', fill: tuer }));
};

// ── Wegweiser mit Kompass ───────────────────────────────────────────────────────────────────────────────────────────
// Pfosten, Schild nach rechts (die Richtung zu den Leistungen), oben der Kompass. Die Nadel wie in der Übersicht
// (components/LeistungsKompass.jsx): Spitze nach Norden bei gefundenen Leistungen, sonst nach Süden; ohne Einkommen ruht sie.
export const Wegweiser = ({ palette, kompass, farbe }) => {
  const h = React.createElement;
  const { state = 'idle', bearing = 0 } = kompass || {};
  const spitze = state === 'found' ? palette.sage : state === 'none' ? (palette.sky || palette.mid) : palette.mid;
  const schild = farbe || palette.mid;
  return h('svg', {
    viewBox: '0 0 84 150', width: 84, 'aria-hidden': 'true', focusable: 'false', 'data-teil': 'wegweiser', 'data-kompass': state,
    style: { display: 'block', height: 'auto', overflow: 'visible' },
  },
    h('line', { x1: 40, y1: 50, x2: 40, y2: 150, stroke: palette.mid, strokeWidth: 3 }),
    h('path', { d: 'M6 62 L62 62 L76 74 L62 86 L6 86 Z', fill: schild }),
    h('circle', { cx: 40, cy: 26, r: 22, fill: palette.surface, stroke: palette.text, strokeWidth: 1.5, ...linie }),
    h('g', { 'data-teil': 'kompass-nadel', transform: 'rotate(' + bearing + ' 40 26)' },
      h('path', { d: 'M40 8 L45 26 L35 26 Z', fill: spitze, opacity: state === 'idle' || state === 'laden' ? 0.5 : 1 }),
      h('path', { d: 'M40 44 L45 26 L35 26 Z', fill: palette.mid, opacity: 0.4 })),
    h('circle', { cx: 40, cy: 26, r: 3, fill: palette.surface, stroke: palette.mid, strokeWidth: 1.5 }));
};
