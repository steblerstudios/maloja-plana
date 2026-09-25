import React, { useEffect, useRef, useState } from 'react';
import Icons from '../IconKern.jsx';
import { text, weight, radius, ease, duration } from '../config/tokens.js';
// Als eigene Dateien, nicht im JS-Bündel: Vite legt sie mit Hash unter /assets/ ab,
// der Service Worker liefert sie danach cache-first. Herkunft und Nachbau:
// scripts/berge-vereinfachen.py (eigene Malojapass-Fotos → Codex-Illustration → 17 Farbflächen).
import landschaftHell from '../assets/berge/landschaft-hell.svg?url';
import landschaftDunkel from '../assets/berge/landschaft-dunkel.svg?url';

// Koordinaten im Bild (1100 × 788). Die Passstrasse steigt in Kehren von unten rechts
// nach oben links; die Kapitel sitzen der Reihe nach auf ihr — Basis unten, Notfall oben.
const BILD = { w: 1100, h: 788 };
// Breit: fast das ganze Bild (oben etwas Himmel weg). Schmal: nur die Strasse, damit die
// Stationen am Handy weit genug auseinanderliegen (≥ 44 px Abstand bei 28-px-Knöpfen).
const AUSSCHNITT = {
  breit: { x: 0, y: 80, w: 1100, h: 708 },
  schmal: { x: 60, y: 360, w: 580, h: 410 },
};
const SCHMAL_AB = 520; // px Breite des Rahmens

export const STATIONEN = [
  { key: 'basis', x: 540, y: 712, seite: 'rechts' },
  { key: 'wohnen', x: 566, y: 648, seite: 'rechts' },
  { key: 'finanzen', x: 390, y: 620, seite: 'unten' },
  { key: 'versicherungen', x: 235, y: 578, seite: 'unten' },
  { key: 'ausbildung', x: 138, y: 541, seite: 'links' },
  { key: 'behoerden', x: 190, y: 471, seite: 'links' },
  { key: 'notfall', x: 305, y: 418, seite: 'rechts' },
];

// Zwischenpunkte, damit der gegangene Weg der Strasse folgt statt quer durch den Wald.
const ZWISCHEN = [
  [[580, 686]],
  [[530, 616], [470, 612]],
  [[310, 600]],
  [[182, 560]],
  [[160, 516], [178, 490]],
  [[208, 448], [250, 434]],
];

// Catmull-Rom → kubische Bézier, einmal beim Laden: ein Pfad je Wegstück (Station i → i+1).
const WEGSTUECKE = (() => {
  const punkte = [], stationIndex = [];
  STATIONEN.forEach((s, i) => {
    stationIndex.push(punkte.length);
    punkte.push([s.x, s.y]);
    if (ZWISCHEN[i]) punkte.push(...ZWISCHEN[i]);
  });
  const p = (i) => punkte[Math.max(0, Math.min(punkte.length - 1, i))];
  const kurve = (i) => {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    return ` C ${c1.map(Math.round).join(' ')} ${c2.map(Math.round).join(' ')} ${p2.join(' ')}`;
  };
  return stationIndex.slice(0, -1).map((von, k) => {
    let d = `M ${punkte[von].join(' ')}`;
    for (let i = von; i < stationIndex[k + 1]; i++) d += kurve(i);
    return d;
  });
})();

const BergLandschaft = ({ palette, isDarkMode, chapters, chapterCompletions, completion, onSelectChapter, lang, hyphenStyle }) => {
  const rahmen = useRef(null);
  const [schmal, setSchmal] = useState(false);
  const [bildFehlt, setBildFehlt] = useState(false);

  useEffect(() => {
    const el = rahmen.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([eintrag]) => setSchmal(eintrag.contentRect.width < SCHMAL_AB));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const a = schmal ? AUSSCHNITT.schmal : AUSSCHNITT.breit;
  const imRahmen = (x, y) => ({ left: ((x - a.x) / a.w) * 100 + '%', top: ((y - a.y) / a.h) * 100 + '%' });
  // Farben der Überraschungen: Marken-Töne, keine Deckkraft auf Text (K41).
  const s = (ab, max, spanne) => ({ opacity: Math.min(max, (completion - ab) / spanne), transition: 'opacity 1.5s ease' });

  return React.createElement('div', {
    'data-tour': 'berge',
    ref: rahmen,
    style: {
      margin: '0 -8px 28px -8px', position: 'relative', lineHeight: 0,
      aspectRatio: `${a.w} / ${a.h}`,
      borderRadius: radius.md, overflow: 'hidden',
      // Ladezustand und Fehlerfall: eine ruhige Fläche in Bildgrösse, nichts springt.
      background: palette.up,
    },
  },
    React.createElement('svg', {
      viewBox: `${a.x} ${a.y} ${a.w} ${a.h}`,
      preserveAspectRatio: 'xMidYMid slice',
      'aria-hidden': 'true',
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' },
    },
      !bildFehlt && React.createElement('image', {
        href: isDarkMode ? landschaftDunkel : landschaftHell,
        width: BILD.w, height: BILD.h,
        onError: () => setBildFehlt(true),
      }),
      // Gegangener Weg — je Kapitel ein Stück, golden sobald es begonnen ist.
      ...WEGSTUECKE.map((d, i) => React.createElement('path', {
        key: 'weg-' + i, d, fill: 'none',
        stroke: palette.sand, strokeWidth: 5, strokeLinecap: 'round',
        style: { opacity: chapterCompletions[i] > 0 ? 1 : 0, transition: 'opacity 0.8s ease' },
      })),
      // ─── Überraschungen mit dem Fortschritt (wie bisher, neu verortet) ───
      completion >= 20 && React.createElement('g', { key: 'tannen', fill: palette.sageDeep, style: s(20, 0.8, 30) },
        React.createElement('path', { d: 'M 842 548 L 852 520 L 862 548 Z' }),
        React.createElement('path', { d: 'M 862 552 L 870 530 L 878 552 Z' }),
      ),
      completion >= 35 && React.createElement('g', { key: 'edelweiss', style: s(35, 0.9, 20) },
        React.createElement('circle', { cx: 452, cy: 548, r: 4.5, fill: '#fff' }),
        React.createElement('circle', { cx: 452, cy: 548, r: 1.8, fill: palette.sand }),
        React.createElement('circle', { cx: 610, cy: 590, r: 4, fill: '#fff' }),
        React.createElement('circle', { cx: 610, cy: 590, r: 1.5, fill: palette.sand }),
      ),
      completion >= 45 && completion < 100 && React.createElement('g', { key: 'gipfelkreuz', stroke: palette.mid, strokeWidth: 1.8, style: s(45, 0.8, 20) },
        React.createElement('line', { x1: 598, y1: 176, x2: 598, y2: 198 }),
        React.createElement('line', { x1: 591, y1: 182, x2: 605, y2: 182 }),
      ),
      completion >= 55 && React.createElement('path', { key: 'matterhorn',
        d: 'M 912 170 L 926 134 L 932 146 L 942 170 Z', fill: palette.sageDeep, style: s(55, 0.35, 60) }),
      completion >= 65 && React.createElement('g', { key: 'kuh', fill: palette.text, style: s(65, 0.55, 20) },
        React.createElement('ellipse', { cx: 700, cy: 560, rx: 8, ry: 4.6 }),
        React.createElement('ellipse', { cx: 692, cy: 556, rx: 3.2, ry: 2.6 }),
        React.createElement('rect', { x: 694, y: 563, width: 1.4, height: 6 }),
        React.createElement('rect', { x: 704, y: 563, width: 1.4, height: 6 }),
      ),
      completion >= 75 && React.createElement('g', { key: 'uhr', fill: 'none', stroke: palette.mid, style: s(75, 0.6, 15) },
        React.createElement('circle', { cx: 150, cy: 150, r: 7, strokeWidth: 1.2 }),
        React.createElement('line', { x1: 150, y1: 150, x2: 150, y2: 145.5, strokeWidth: 1 }),
        React.createElement('line', { x1: 150, y1: 150, x2: 153.5, y2: 151.5, strokeWidth: 0.8 }),
      ),
      completion >= 85 && React.createElement('path', { key: 'schoggi',
        d: 'M 760 600 L 768 586 L 776 600 L 784 586 L 792 600 Z', fill: palette.sand, style: s(85, 0.7, 10) }),
      completion >= 95 && React.createElement('circle', { key: 'sonne',
        cx: 250, cy: 130, r: 22, fill: palette.sand, style: { opacity: 0.35, transition: 'opacity 1.5s ease' } }),
      completion >= 100 && React.createElement('g', { key: 'fahne' },
        React.createElement('line', { x1: 598, y1: 172, x2: 598, y2: 198, stroke: palette.mid, strokeWidth: 1.6 }),
        React.createElement('rect', { x: 599, y: 172, width: 15, height: 10, rx: 0.8, fill: '#d42b2b' }),
        React.createElement('path', { d: 'M 606.5 174 L 606.5 180 M 603.5 177 L 609.5 177', fill: 'none', stroke: '#fff', strokeWidth: 1.8 }),
      ),
    ),
    // Kapitel-Stationen auf der Strasse
    STATIONEN.map((station, i) => {
      const pct = chapterCompletions[i] || 0;
      const IconFn = Icons[station.key];
      // Reifestufen wie bisher: Skizze → im Werden → reift → vollständig
      const maturity = pct === 0 ? 'sketch' : pct < 50 ? 'emerging' : pct < 100 ? 'maturing' : 'complete';
      const sz = schmal ? 28 : { sketch: 30, emerging: 32, maturing: 34, complete: 36 }[maturity];
      const iconSz = schmal ? 16 : { sketch: 17, emerging: 18, maturing: 20, complete: 21 }[maturity];
      // Auf dem Bild braucht jede Station eine undurchsichtige Fläche (K41) — sonst
      // hängt der Kontrast am Bild dahinter. Stufe trägt Rand + Füllung, nie Deckkraft.
      const stil = {
        sketch: { bg: palette.surface, border: '1.5px dashed ' + palette.mid, color: palette.mid },
        emerging: { bg: palette.surface, border: '2px solid ' + palette.sand, color: palette.sandDeep },
        maturing: { bg: palette.surface, border: '2px solid ' + palette.sand, color: palette.sageDeep },
        complete: { bg: palette.surface, border: '2.5px solid ' + palette.sage, color: palette.sageDeep },
      }[maturity];
      const chapterTitle = chapters[i] ? chapters[i].title : station.key;
      const shortLabel = (chapters[i] && chapters[i].short) || chapterTitle.split(/[\s–—]/)[0];
      const ort = imRahmen(station.x, station.y);
      const etikettOrt = {
        rechts: { left: sz / 2 + 4 + 'px', top: '50%', transform: 'translateY(-50%)' },
        links: { right: sz / 2 + 4 + 'px', top: '50%', transform: 'translateY(-50%)' },
        unten: { top: sz / 2 + 3 + 'px', left: '50%', transform: 'translateX(-50%)' },
      }[station.seite];
      return React.createElement('div', {
        key: station.key,
        style: { position: 'absolute', ...ort, width: 0, height: 0 },
      },
        React.createElement('button', {
          type: 'button',
          onClick: () => onSelectChapter(i),
          'aria-label': chapterTitle,
          style: {
            position: 'absolute', left: -sz / 2 + 'px', top: -sz / 2 + 'px',
            width: sz + 'px', height: sz + 'px', padding: 0,
            borderRadius: '50%', background: stil.bg, border: stil.border, color: stil.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
            transition: `transform ${duration.cinematic}ms ${ease}`,
          },
          onMouseEnter: (e) => { e.currentTarget.style.transform = 'scale(1.08)'; },
          onMouseLeave: (e) => { e.currentTarget.style.transform = 'scale(1)'; },
        },
          React.createElement('div', { style: { width: iconSz + 'px', height: iconSz + 'px' } }, IconFn ? IconFn() : null)
        ),
        !schmal && React.createElement('span', {
          className: 'mountain-label',
          lang,
          'aria-hidden': 'true',
          style: {
            position: 'absolute', ...etikettOrt, whiteSpace: 'nowrap', pointerEvents: 'none',
            fontSize: text.xs, lineHeight: 1.15, color: palette.mid,
            background: palette.surface, padding: '2px 6px', borderRadius: radius.sm,
            fontStyle: maturity === 'sketch' ? 'italic' : 'normal',
            fontWeight: maturity === 'complete' ? weight.medium : weight.normal,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
            ...hyphenStyle,
          },
        }, shortLabel)
      );
    })
  );
};

export default BergLandschaft;
