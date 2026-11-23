import React from 'react';
import { radius, INSTRUMENT_GROESSE } from '../../config/tokens.js';
import { Kalenderblatt } from '../../components/Kalenderblatt.jsx';
import { Icons } from '../../IconKern.jsx';

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
// `klein`: das kleine Kalenderblatt (schmale Fassung); im Kapitel das grosse (dritte Runde, Bilder gross wie Wohnen).
export const Anschlagbrett = ({ palette, iso, locale, vorbei, pfosten = 60, klein = true }) => {
  const h = React.createElement;
  const holz = palette.sand || palette.mid;
  return h('div', { 'aria-hidden': 'true', 'data-teil': 'anschlagbrett', style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
    h('div', { style: { background: holz, borderRadius: radius.sm, padding: klein ? '6px' : '8px' } },
      h(Kalenderblatt, { iso, palette, locale, vorbei, klein })),
    h('div', { style: { width: klein ? '4px' : '5px', height: pfosten + 'px', background: holz } }));
};

// ── Gemeindehaus ────────────────────────────────────────────────────────────────────────────────────────────────────
// Satteldach mit Türmchen und Uhr, Tür in der Behörden-Farbe. Fenster: drei oben, darunter links und rechts der Tür je eines.
// Erledigte Gänge sind hell (Sand, wie die Kästchen der früheren Kachel).
//   klein (Kachel): `erledigt` füllt die Fenster der Reihe nach, reines Bild.
//   im Kapitel (Stebler Studios 23.11.2026, zweite Runde «Ja, so bauen»): `fenster` = je Gang { an, label }; jedes Fenster
//   gehört zu seinem Gang und lässt sich antippen (`onWaehle`), das gewählte (`aktiv`) ist dick umrandet.
const FENSTER = [[30, 72], [72, 72], [114, 72], [30, 112], [114, 112]];
// Der Gemeindename in der Tür: 32 Einheiten Breite. Erst eine Zeile (bis Schrift 10), sonst zwei Zeilen an Bindestrich
// oder Leerzeichen; unter Schrift 6 passt er nicht (dann steht er über der Tür, Gemeindehaus).
const TUER_BREITE = 32;
const passt = (zeilen) => Math.min(10, Math.floor(TUER_BREITE / (Math.max(...zeilen.map((z) => z.length)) * 0.58) * 10) / 10);
export const namenZeilen = (name) => {
  const s = String(name || '').trim();
  if (!s) return null;
  const eine = passt([s]);
  if (eine >= 8 || !/[\s-]/.test(s.slice(1, -1))) return eine >= 6 ? { zeilen: [s], groesse: eine } : null;
  let best = null;
  for (let i = 1; i < s.length - 1; i += 1) {
    if (s[i] !== ' ' && s[i] !== '-') continue;
    const zeilen = [s.slice(0, s[i] === '-' ? i + 1 : i), s.slice(i + 1)];
    const g = passt(zeilen);
    if (!best || g > best.groesse) best = { zeilen, groesse: g };
  }
  const sieger = best && best.groesse > eine ? best : { zeilen: [s], groesse: eine };
  return sieger.groesse >= 6 ? sieger : null;
};
// Schrift auf der Tür: hell oder dunkel nach der Helligkeit der Türfarbe (beide Modi lesbar).
const helligkeit = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || ''));
  if (!m) return 0;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const schriftAuf = (farbe) => (helligkeit(farbe) > 0.18 ? '#1F2023' : '#FFFFFF');
//   Tür (Stebler Studios 23.11.2026, «3 klingt gut»): die eigene Gemeinde. `gemeinde` = Name über der Tür (nur eindeutig,
//   sonst null), `onTuer` macht die Tür antippbar, `tuerAktiv` umrandet sie, `tuerLabel` ist ihr Vorlesename.
//   Der Name schrumpft bei langen Namen, damit er zwischen die Fensterreihen passt (128 Einheiten Platz).
export const Gemeindehaus = ({ palette, erledigt = 0, total = 5, farbe, groesse = 'gross', fenster = null, aktiv = null, onWaehle = null, label = '', gemeinde = null, onTuer = null, tuerAktiv = false, tuerLabel = '' }) => {
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
    // Erledigt: Sand gefüllt UND dunkel umrandet — Sand allein hat hell nur 2,3:1 gegen die Fläche (A11y-Prüfung
    // 23.11.2026, WCAG 1.4.11). Im Kapitel liegt über jedem Fenster eine unsichtbare Trefferfläche von 40×38 Einheiten
    // (bei 190 px Spalte rund 45×42 px), damit das Antippen nicht an 29×27 px hängt.
    ...plaetze.flatMap(([x, y], i) => {
      const zeichen = h('rect', {
        key: 'f' + i, x, y, width: 26, height: 24, rx: 2,
        fill: an(i) ? licht : palette.surface,
        stroke: aktiv === i ? palette.text : an(i) ? palette.text : palette.mid,
        strokeWidth: aktiv === i ? 3 : klein ? 2.5 : 1.5, ...linie,
        ...(tippbar ? { 'aria-hidden': 'true', style: { pointerEvents: 'none' } } : { 'data-fenster': i, 'data-an': an(i) ? 'ja' : 'nein' }),
      });
      // Icon des Gangs im Fenster (Stebler Studios 23.11.2026, «vlt die icons in den fenstern»): `fenster[i].ikon` aus dem
      // Register (IconKern/IconSystem), als eigenes SVG in der Fensterfläche, Farbe wie der Stand des Fensters.
      const ikonFn = fenster && fenster[i]?.ikon ? Icons[fenster[i].ikon] : null;
      const ikon = ikonFn && React.cloneElement(ikonFn(), {
        key: 'i' + i, 'data-fenster-ikon': fenster[i].ikon, x: x + 5, y: y + 4, width: 16, height: 16,
        color: an(i) ? palette.text : palette.mid, style: { pointerEvents: 'none' },
      });
      if (!tippbar) return [zeichen, ikon].filter(Boolean);
      return [zeichen, ikon, h('rect', {
        key: 't' + i, 'data-fenster': i, 'data-an': an(i) ? 'ja' : 'nein', x: x - 7, y: y - 7, width: 40, height: 38, rx: 4,
        fill: 'transparent', stroke: 'none', pointerEvents: 'all',
        role: 'button', tabIndex: 0, 'aria-label': fenster[i].label, 'aria-pressed': aktiv === i ? 'true' : 'false',
        style: { cursor: 'pointer' },
        onClick: () => onWaehle(i),
        onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onWaehle(i); } },
      })];
    }),
    // Tür: im Kapitel breiter (38 Einheiten), damit der Gemeindename darin Platz hat (Stebler Studios 23.11.2026, «der Name
    // der Gemeinde in der Tür»); in der Kachel wie bisher schmal.
    h('path', { 'data-teil': 'gemeindehaus-tuer', d: klein ? 'M73 160 L73 124 Q85 110 97 124 L97 160 Z' : 'M66 160 L66 128 Q85 102 104 128 L104 160 Z', fill: tuer,
      ...(tuerAktiv ? { stroke: palette.text, strokeWidth: 3, ...linie } : {}) }),
    !klein && gemeinde && (() => {
      const z = namenZeilen(gemeinde);
      // Zu lang für die Tür: über der Tür wie zuvor, zwischen den Fensterreihen (128 Einheiten), Schrift höchstens 10.
      if (!z) {
        return h('text', { 'data-teil': 'gemeinde-name', 'data-ort': 'ueber', 'aria-hidden': 'true', x: 85, y: 100, textAnchor: 'middle', fill: palette.text,
          fontSize: Math.min(10, Math.floor(128 / (String(gemeinde).length * 0.58) * 10) / 10), fontWeight: 600 }, gemeinde);
      }
      const mitte = 140 - (z.zeilen.length - 1) * z.groesse * 0.6;
      return h('text', { 'data-teil': 'gemeinde-name', 'data-ort': 'tuer', 'aria-hidden': 'true', x: 85, y: mitte, textAnchor: 'middle', fill: schriftAuf(tuer), fontSize: z.groesse, fontWeight: 600 },
        z.zeilen.map((zeile, i) => h('tspan', { key: i, x: 85, dy: i === 0 ? 0 : z.groesse * 1.2 }, zeile)));
    })(),
    !klein && onTuer && h('rect', {
      'data-teil': 'tuer-treffer', x: 62, y: 104, width: 46, height: 56, rx: 4, fill: 'transparent', stroke: 'none', pointerEvents: 'all',
      role: 'button', tabIndex: 0, 'aria-label': tuerLabel, 'aria-pressed': tuerAktiv ? 'true' : 'false', style: { cursor: 'pointer' },
      onClick: () => onTuer(),
      onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTuer(); } },
    }));
};

// ── Wegweiser mit Kompass ───────────────────────────────────────────────────────────────────────────────────────────
// Pfosten, Schild nach rechts (die Richtung zu den Leistungen), oben der Kompass. Die Nadel wie in der Übersicht
// (components/LeistungsKompass.jsx): Spitze nach Norden bei gefundenen Leistungen, sonst nach Süden; ohne Einkommen ruht sie.
// `breite`: 84 in der schmalen Fassung, 120 im Kapitel (dritte Runde, Bilder gross wie Wohnen).
export const Wegweiser = ({ palette, kompass, farbe, breite = 84 }) => {
  const h = React.createElement;
  const { state = 'idle', bearing = 0 } = kompass || {};
  const spitze = state === 'found' ? palette.sage : state === 'none' ? (palette.sky || palette.mid) : palette.mid;
  const schild = farbe || palette.mid;
  return h('svg', {
    viewBox: '0 0 84 150', width: breite, 'aria-hidden': 'true', focusable: 'false', 'data-teil': 'wegweiser', 'data-kompass': state,
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
