import React from 'react';
import { text, weight, space, radius } from '../config/tokens.js';

// Jahreskreis in «Was ansteht» (Sophie 24.10.2026: «Bau zuerst den Jahreskreis mit den
// hinterlegten Fristen»). Zwölf Monate als Ring, oben Januar, im Uhrzeigersinn. Darauf liegt
// nur, was schon hinterlegt ist: die eigenen Fristen, Termine und Merkliste-Aufgaben des
// Jahres (dieselbe Form-Sprache wie der Kalender: Punkt = Frist, Raute = Termin,
// Quadrat = Aufgabe) und die festen Stichtage, die der Kalender selbst mitbringt.
// Ein Strich zeigt heute. Ein Monat im Ring antippen wählt ihn im Kalender darunter.
// Die Liste unter dem Ring trägt dieselben Einträge als Text — das Bild ist nie die
// einzige Stelle, an der etwas steht.

const MITTE = 120;
const RING_AUSSEN = 112;
const RING_INNEN = 88;
const SPUR = 100;            // Radius, auf dem die Marken liegen
const STAPEL = [0, -9, 9];   // mehrere Marken am selben Tag: auf der Spur, innen, aussen
const MAX_LISTE = 8;

const tageImJahr = (jahr) => (new Date(jahr, 1, 29).getMonth() === 1 ? 366 : 365);

// Winkel in Grad, 0 = oben, im Uhrzeigersinn. Der Tag läuft von 0 (1. Januar, Mitternacht)
// bis tageImJahr; Marken sitzen in der Tagesmitte.
export const winkelFuerTag = (iso, jahr) => {
  const [j, m, t] = String(iso).split('-').map(Number);
  if (j !== jahr || !m || !t) return null;
  const tag = Math.round((new Date(j, m - 1, t) - new Date(j, 0, 1)) / 86400000);
  return ((tag + 0.5) / tageImJahr(jahr)) * 360;
};

const punkt = (winkel, r) => {
  const rad = ((winkel - 90) * Math.PI) / 180;
  return [MITTE + r * Math.cos(rad), MITTE + r * Math.sin(rad)];
};

// Die Einträge des Jahres mit Lage auf dem Ring, nach Datum. Einträge anderer Jahre fallen weg.
export const jahreskreisPunkte = (eintraege, jahr) => {
  const proTag = {};
  return eintraege
    .filter((e) => e && typeof e.iso === 'string' && winkelFuerTag(e.iso, jahr) !== null)
    .sort((a, b) => a.iso.localeCompare(b.iso))
    .map((e) => {
      const n = proTag[e.iso] = (proTag[e.iso] || 0) + 1;
      const [x, y] = punkt(winkelFuerTag(e.iso, jahr), SPUR + STAPEL[(n - 1) % STAPEL.length]);
      return { ...e, x, y };
    });
};

const monatsBogen = (m, jahr) => {
  const start = winkelFuerTag(`${jahr}-${String(m + 1).padStart(2, '0')}-01`, jahr) - 0.5 / tageImJahr(jahr) * 360;
  const ende = m === 11 ? 360 : winkelFuerTag(`${jahr}-${String(m + 2).padStart(2, '0')}-01`, jahr) - 0.5 / tageImJahr(jahr) * 360;
  const [ax, ay] = punkt(start + 0.6, RING_AUSSEN);
  const [bx, by] = punkt(ende - 0.6, RING_AUSSEN);
  const [cx, cy] = punkt(ende - 0.6, RING_INNEN);
  const [dx, dy] = punkt(start + 0.6, RING_INNEN);
  return { d: `M ${ax} ${ay} A ${RING_AUSSEN} ${RING_AUSSEN} 0 0 1 ${bx} ${by} L ${cx} ${cy} A ${RING_INNEN} ${RING_INNEN} 0 0 0 ${dx} ${dy} Z`, mitte: (start + ende) / 2 };
};

const Marke = ({ p, palette }) => {
  const g = 4.5;
  if (p.art === 'termin') return React.createElement('rect', { x: p.x - g, y: p.y - g, width: g * 2, height: g * 2, fill: p.farbe, stroke: palette.up, strokeWidth: 1, transform: `rotate(45 ${p.x} ${p.y})` });
  if (p.art === 'aufgabe') return React.createElement('rect', { x: p.x - g, y: p.y - g, width: g * 2, height: g * 2, fill: p.farbe, stroke: palette.up, strokeWidth: 1 });
  return React.createElement('circle', { cx: p.x, cy: p.y, r: g + 0.5, fill: p.farbe, stroke: palette.up, strokeWidth: 1 });
};

// Dieselbe Marke als kleines HTML-Zeichen für die Liste (wie ArtMarke im Kalender).
const ListenMarke = ({ art, farbe }) => {
  const basis = { display: 'inline-block', width: '8px', height: '8px', flexShrink: 0, background: farbe };
  const form = art === 'termin' ? { transform: 'rotate(45deg) scale(.85)' } : art === 'aufgabe' ? {} : { borderRadius: '50%' };
  return React.createElement('span', { 'aria-hidden': 'true', style: { ...basis, ...form } });
};

export const Jahreskreis = ({ jahr, heuteIso, eintraege, gewaehlterMonat, onMonat, locale, palette, t, eingebettet }) => {
  const punkte = jahreskreisPunkte(eintraege, jahr);
  const heuteWinkel = winkelFuerTag(heuteIso, jahr);
  const monName = (m) => new Date(2024, m, 1).toLocaleDateString(locale, { month: 'short' });
  const monLang = (m) => new Date(jahr, m, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const datumKurz = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  const proMonat = Array(12).fill(0);
  punkte.forEach((p) => { proMonat[Number(p.iso.slice(5, 7)) - 1] += 1; });
  const beschreibung = t('calendar.jahreskreis.aria', { year: jahr, count: punkte.length });

  const waehle = (m) => (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    if (e.type === 'keydown') e.preventDefault();
    onMonat(m);
  };

  // Eingebettet (im Kalender, seit 24.10.2026 die Hauptansicht): ohne eigene Karte.
  const huelle = eingebettet
    ? { marginBottom: space.sm + 'px' }
    : { background: palette.up, border: '1px solid ' + palette.border, borderRadius: radius.sm, padding: space.md + 'px', marginBottom: space.md };

  // Zeitfenster: ein Bogen, der am Stichtag endet und nach vorne ohne harten Anfang ausläuft.
  // Bewusst kein Startdatum: bei der KVG-Kündigung beginnt das Recht mit dem Erhalt der
  // eigenen Prämienmitteilung (KVG Art. 7 Abs. 2) — ein fester Anfang wäre falsch
  // (Fachprüfung 24.10.2026). `merke` zeichnet einen feinen Strich, z. B. «spätestens hier».
  const fenster = punkte.filter((p) => p.auslauf > 0).map((p) => {
    const ende = winkelFuerTag(p.iso, jahr);
    const schritt = (p.auslauf / tageImJahr(jahr)) * 360 / 10;
    const teile = Array.from({ length: 10 }, (_, i) => {
      const von = Math.max(0, ende - schritt * (10 - i));
      const bis = Math.max(0, ende - schritt * (9 - i));
      if (bis <= von) return null;
      const [ax, ay] = punkt(von, SPUR);
      const [bx, by] = punkt(bis, SPUR);
      return React.createElement('path', { key: i, d: `M ${ax} ${ay} A ${SPUR} ${SPUR} 0 0 1 ${bx} ${by}`, fill: 'none', stroke: p.farbe, strokeWidth: 10, strokeOpacity: 0.06 + i * 0.05 });
    });
    const merke = p.merke && winkelFuerTag(p.merke, jahr);
    const strich = merke !== null && merke !== undefined && (() => {
      const [ax, ay] = punkt(merke, RING_INNEN + 1);
      const [bx, by] = punkt(merke, RING_AUSSEN - 1);
      return React.createElement('line', { key: 'merke', x1: ax, y1: ay, x2: bx, y2: by, stroke: palette.mid, strokeWidth: 1, strokeDasharray: '2 2' });
    })();
    return React.createElement('g', { key: 'f' + p.key }, ...teile, strich);
  });

  return React.createElement('div', { style: huelle },
    React.createElement('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: space.xs + 'px' } }, t('calendar.jahreskreis.title', { year: jahr })),
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.md + 'px', alignItems: 'center' } },
      React.createElement('svg', {
        viewBox: '0 0 240 240', role: 'group', 'aria-label': beschreibung,
        style: { width: '100%', maxWidth: '280px', minWidth: '220px', height: 'auto', display: 'block', flex: '1 1 260px', margin: '0 auto' },
      },
        Array.from({ length: 12 }, (_, m) => {
          const b = monatsBogen(m, jahr);
          const aktiv = m === gewaehlterMonat;
          const [lx, ly] = punkt(b.mitte, 72);
          return React.createElement('g', {
            key: 'm' + m, role: 'button', tabIndex: 0, 'aria-pressed': aktiv,
            'aria-label': monLang(m) + (proMonat[m] ? ' · ' + proMonat[m] : ''),
            onClick: waehle(m), onKeyDown: waehle(m), style: { cursor: 'pointer', outlineOffset: '2px' },
          },
            React.createElement('path', { d: b.d, fill: aktiv ? palette.sand + '55' : palette.surface, stroke: aktiv ? palette.sand : palette.border, strokeWidth: 1 }),
            React.createElement('text', { x: lx, y: ly, dy: '0.35em', textAnchor: 'middle', fontSize: 12, fill: aktiv ? palette.text : palette.mid, fontWeight: aktiv ? 600 : 400, style: { pointerEvents: 'none' } }, monName(m))
          );
        }),
        heuteWinkel !== null && (() => {
          const [ax, ay] = punkt(heuteWinkel, RING_INNEN - 22);
          const [bx, by] = punkt(heuteWinkel, RING_AUSSEN + 5);
          return React.createElement('line', { x1: ax, y1: ay, x2: bx, y2: by, stroke: palette.text, strokeWidth: 1.5, strokeLinecap: 'round', 'aria-hidden': 'true' });
        })(),
        React.createElement('g', { 'aria-hidden': 'true', style: { pointerEvents: 'none' } }, ...fenster),
        React.createElement('g', { 'aria-hidden': 'true', style: { pointerEvents: 'none' } }, punkte.map((p) => React.createElement(Marke, { key: p.key, p, palette }))),
        React.createElement('text', { x: MITTE, y: MITTE - 6, textAnchor: 'middle', fontSize: 18, fontWeight: 600, fill: palette.text, 'aria-hidden': 'true' }, String(jahr)),
        React.createElement('text', { x: MITTE, y: MITTE + 12, textAnchor: 'middle', fontSize: 10, fill: palette.mid, 'aria-hidden': 'true' },
          t('calendar.jahreskreis.count', { count: punkte.length }))
      ),
      React.createElement('div', { style: { flex: '1 1 220px', minWidth: 0 } },
        punkte.length === 0
          ? React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t('calendar.jahreskreis.empty'))
          : React.createElement('ul', { style: { listStyle: 'none', margin: 0, padding: 0 } },
            punkte.slice(0, MAX_LISTE).map((p) => React.createElement('li', { key: p.key, style: { display: 'flex', alignItems: 'baseline', gap: space.sm + 'px', fontSize: text.sm, color: palette.text, marginBottom: '4px' } },
              React.createElement(ListenMarke, { art: p.art, farbe: p.farbe }),
              React.createElement('span', { style: { color: p.iso < heuteIso ? palette.mid : palette.text, minWidth: '60px', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' } }, datumKurz(p.iso)),
              React.createElement('span', { style: { minWidth: 0 } }, p.titel,
                p.quelle && React.createElement('span', { style: { display: 'block', fontSize: text.xs, color: palette.mid } }, p.quelle))
            )),
            punkte.length > MAX_LISTE && React.createElement('li', { style: { fontSize: text.xs, color: palette.mid } }, t('calendar.jahreskreis.more', { count: punkte.length - MAX_LISTE }))
          )
      )
    )
  );
};

export default Jahreskreis;
