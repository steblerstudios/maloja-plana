import React, { useEffect, useRef, useState } from 'react';
import Icons from '../IconKern.jsx';
import { text, weight, radius, ease, duration } from '../config/tokens.js';
import { LIGHT_PALETTE, applyColorBlind } from '../config/constants.js';
import { astFarben } from '../utils/lebensbereichFruechte.js';
// Als eigene Datei, nicht im JS-Bündel: Vite legt sie mit Hash unter /assets/ ab, der
// Service Worker liefert sie danach cache-first. Herkunft und Nachbau: assets/berge/_QUELLE.md
// (eigene Malojapass-Fotos → Codex-Illustration → WebP in voller Auflösung, alle Details).
import landschaft from '../assets/berge/landschaft.webp?url';

// Koordinaten im Bild (1100 × 788; die Datei selbst ist 1482 × 1062, gleiches Seitenverhältnis).
// Die Passstrasse steigt in Kehren von unten rechts nach oben links; die Kapitel sitzen der
// Reihe nach auf ihr — Basis unten, Notfall oben.
const BILD = { w: 1100, h: 788 };
// Breit: fast das ganze Bild (oben etwas Himmel weg). Schmal: nur das Strassennetz, damit die
// Stationen am Handy weit genug auseinanderliegen.
export const AUSSCHNITT = {
  breit: { x: 0, y: 80, w: 1100, h: 708 },
  schmal: { x: 110, y: 370, w: 490, h: 340 },
};
export const SCHMAL_AB = 520; // px Breite des Rahmens

// Die Route ist aus dem Bild gelesen (Maske der hellen Fahrbahn, Mittellinie), die Stationen
// nach Vorgabe von Stebler Studios gesetzt (25.09.2026). Im Bild sind es zwei Strassen: die breite
// mit dem Mittelstreifen, die links ins Bild kommt und zum Betrachter hin abbiegt, und darüber die
// obere Strasse, die nach rechts in die U-Kurve läuft und in die links die schmale Strasse mündet.
//   Basis (links, breite Strasse) → Wohnen (auf dem Mittelstreifen) → unten hinter den Tannen
//   durch → Finanzen (U-Kurve) → Versicherungen (oben in der Kurve) → die obere Strasse zurück
//   nach links, kurz verdeckt → die schmale Strasse hinauf: Ausbildung → Behörden (oben im
//   Bogen) → Notfall (über die Kehre ins S).
// Basis und Ausbildung sind NICHT direkt verbunden — dort geht keine Strasse durch.
// Wo eine Tanne die Strasse verdeckt, fehlt der Weg — er geht dahinter durch.
// Etikett-Seiten sind errechnet (Suche über alle Kombinationen): ohne Überschneidung bei
// 656/736 px (breit) und 296–496 px (schmal).
export const STATIONEN = [
  { key: 'basis', x: 185, y: 549, seite: { breit: 'links', schmal: 'unten' } },
  { key: 'wohnen', x: 272, y: 616, seite: { breit: 'rechts', schmal: 'rechts' } },
  { key: 'finanzen', x: 573.4, y: 675.3, seite: { breit: 'rechts', schmal: 'links' } },
  { key: 'versicherungen', x: 516.2, y: 625.7, seite: { breit: 'rechts', schmal: 'oben' } },
  { key: 'ausbildung', x: 195.6, y: 479, seite: { breit: 'links', schmal: 'oben' } },
  { key: 'behoerden', x: 287.5, y: 445.3, seite: { breit: 'rechts', schmal: 'rechts' } },
  { key: 'notfall', x: 294.4, y: 514.3, seite: { breit: 'rechts', schmal: 'rechts' } },
];

// Wegstück i gehört zum Kapitel i+1 und führt von Station WEG_VON[i] zu dessen Station — eine
// durchgehende Route, also immer von der vorigen Station. Nur sichtbare Fahrbahn, je Lauf ein
// eigener Unterpfad (M … C …).
export const WEG_VON = [0, 1, 2, 3, 4, 5];
export const WEGSTUECKE = [
  'M185 549C194.7 555.7 228.5 577.9 243 589C257.5 600.2 267.2 611.5 272 616',
  'M272 616C277.5 621.4 296.4 639.3 305 648.7C313.7 658 318.5 665.2 323.7 672.2C328.8 679.3 334 687.8 336 691M433 727.4C436.2 727.7 449.1 729.1 452.4 729.4M541.2 724.9C543.7 723.6 551.3 720.6 555.7 717.1C560.1 713.6 564.8 707.7 567.6 703.7C570.5 699.7 571.9 697.7 572.8 693C573.8 688.3 573.3 678.2 573.4 675.3',
  'M573.4 675.3C572.4 672.7 570.2 664.6 567.5 659.9C564.8 655.2 561.6 651 557.1 647.2C552.7 643.3 547.7 640.1 540.8 636.6C534 633 520.3 627.5 516.2 625.7',
  'M487.2 617.9C482.8 617 476.1 615 460.8 612.2C445.6 609.5 406.6 603.1 395.8 601.2M367.7 596.1C361.1 594.6 340.5 590.7 328.2 587.5C315.8 584.3 303 580.1 293.8 576.8C284.7 573.5 281.4 572.1 273.3 567.6C265.2 563.2 252.5 554.2 245.4 550C238.3 545.8 238.5 545.9 230.7 542.5C222.9 539.1 207.2 532.5 198.7 529.6C190.3 526.6 183.6 526.2 179.9 524.9C176.2 523.7 177.5 523.3 176.5 522C175.5 520.6 174.4 518.3 173.7 516.7C173.1 515.1 172.8 514 172.8 512.3C172.8 510.6 173 508.5 173.7 506.4C174.4 504.3 173.3 504.3 177 499.7C180.6 495.2 192.5 482.5 195.6 479',
  'M195.6 479C197.4 476.6 203 468.2 206.6 464.8C210.1 461.4 203.4 462.1 216.9 458.8C230.4 455.6 275.7 447.6 287.5 445.3',
  'M287.5 445.3C291.3 443.4 304.5 436.1 310.3 433.9C316 431.7 318.6 432.2 322.1 432.3C325.5 432.4 328 433.5 330.7 434.7C333.4 435.8 336.1 437.5 338.3 439.4C340.5 441.3 342.8 443.9 344.2 446.2C345.6 448.5 346.4 450.8 346.7 453.2C347 455.6 347 457.9 346 460.6C345 463.3 344.5 465 340.6 469.6C336.8 474.1 328.1 483.7 322.9 487.9C317.7 492 312.8 492.7 309.5 494.6C306.3 496.4 305.5 497.1 303.5 499C301.6 500.9 299.4 503.5 297.9 506C296.4 508.6 295 512.9 294.4 514.3',
];

// ─── Kontrast: das Kapitel-Zeichen trägt die Kapitelfarbe, aber nie unter 3:1 (WCAG 1.4.11) ──
const kanal = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luminanz = (hex) => {
  const [r, g, b] = kanal(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const kontrast = (a, b) => {
  const la = luminanz(a), lb = luminanz(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
// Dunkelt eine Farbe in kleinen Schritten ab, bis sie auf `grund` mindestens `ziel` erreicht.
// Farbton bleibt, nur die Helligkeit sinkt — Finanzen bleibt golden, nur tiefer.
export const mitKontrast = (hex, grund, ziel = 3) => {
  let [r, g, b] = kanal(hex);
  let farbe = hex;
  for (let i = 0; i < 30 && kontrast(farbe, grund) < ziel; i++) {
    [r, g, b] = [r, g, b].map((v) => Math.round(v * 0.93));
    farbe = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  }
  return farbe;
};

// Das Bild bleibt auch im Dunkelmodus hell (Entscheid 25.09.2026: «so dunkel ist unangenehm»).
// Darum tragen Stationen und Etiketten immer die helle Palette — ihr Kontrast hängt dann nicht
// am Modus. Der Farbenblind-Modus gilt trotzdem.
export const bildPalette = (palette) => applyColorBlind(LIGHT_PALETTE, !!palette.colorBlind);

const BergLandschaft = ({ palette, chapters, chapterCompletions, completion, onSelectChapter, lang, hyphenStyle }) => {
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

  const p = bildPalette(palette);
  const kapitelFarbe = astFarben(chapters, p, false);
  const modus = schmal ? 'schmal' : 'breit';
  const a = AUSSCHNITT[modus];
  const imRahmen = (x, y) => ({ left: ((x - a.x) / a.w) * 100 + '%', top: ((y - a.y) / a.h) * 100 + '%' });
  // Überraschungen: Marken-Töne, keine Deckkraft auf Text (K41).
  const s = (ab, max, spanne) => ({ opacity: Math.min(max, (completion - ab) / spanne), transition: 'opacity 1.5s ease' });

  return React.createElement('div', {
    'data-tour': 'berge',
    ref: rahmen,
    style: {
      margin: '0 -8px 28px -8px', position: 'relative', lineHeight: 0,
      aspectRatio: `${a.w} / ${a.h}`,
      borderRadius: radius.md, overflow: 'hidden',
      // Ladezustand und Fehlerfall: eine ruhige Fläche in Bildgrösse, nichts springt.
      background: p.up,
    },
  },
    React.createElement('svg', {
      viewBox: `${a.x} ${a.y} ${a.w} ${a.h}`,
      preserveAspectRatio: 'xMidYMid slice',
      'aria-hidden': 'true',
      style: { position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' },
    },
      !bildFehlt && React.createElement('image', {
        href: landschaft,
        width: BILD.w, height: BILD.h,
        onError: () => setBildFehlt(true),
      }),
      // Der Weg: noch offene Stücke gepunktet (die Route ist von Anfang an lesbar), der Weg zu
      // einem begonnenen Kapitel golden. Unter dem Gold ein heller Saum, damit es sich von der hellen Fahrbahn abhebt.
      ...WEGSTUECKE.map((d, i) => {
        // Stück i führt zur Station des Kapitels i+1 — golden, sobald dieses Kapitel begonnen ist.
        const gegangen = chapterCompletions[i + 1] > 0;
        return React.createElement('g', { key: 'weg-' + i, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' },
          gegangen
            ? [React.createElement('path', { key: 's', d, stroke: p.surface, strokeWidth: 9 }),
               React.createElement('path', { key: 'w', d, stroke: p.sand, strokeWidth: 5 })]
            : React.createElement('path', { d, stroke: p.sageDeep, strokeWidth: 3, strokeDasharray: '0.1 9' }));
      }),
      // ─── Überraschungen mit dem Fortschritt (wie bisher, neu verortet) ───
      completion >= 20 && React.createElement('g', { key: 'tannen', fill: p.sageDeep, style: s(20, 0.8, 30) },
        React.createElement('path', { d: 'M 842 548 L 852 520 L 862 548 Z' }),
        React.createElement('path', { d: 'M 862 552 L 870 530 L 878 552 Z' }),
      ),
      completion >= 35 && React.createElement('g', { key: 'edelweiss', style: s(35, 0.9, 20) },
        React.createElement('circle', { cx: 452, cy: 548, r: 4.5, fill: '#fff' }),
        React.createElement('circle', { cx: 452, cy: 548, r: 1.8, fill: p.sand }),
        React.createElement('circle', { cx: 610, cy: 590, r: 4, fill: '#fff' }),
        React.createElement('circle', { cx: 610, cy: 590, r: 1.5, fill: p.sand }),
      ),
      completion >= 45 && completion < 100 && React.createElement('g', { key: 'gipfelkreuz', stroke: p.mid, strokeWidth: 1.8, style: s(45, 0.8, 20) },
        React.createElement('line', { x1: 598, y1: 176, x2: 598, y2: 198 }),
        React.createElement('line', { x1: 591, y1: 182, x2: 605, y2: 182 }),
      ),
      completion >= 55 && React.createElement('path', { key: 'matterhorn',
        d: 'M 912 170 L 926 134 L 932 146 L 942 170 Z', fill: p.sageDeep, style: s(55, 0.35, 60) }),
      completion >= 65 && React.createElement('g', { key: 'kuh', fill: p.text, style: s(65, 0.55, 20) },
        React.createElement('ellipse', { cx: 700, cy: 560, rx: 8, ry: 4.6 }),
        React.createElement('ellipse', { cx: 692, cy: 556, rx: 3.2, ry: 2.6 }),
        React.createElement('rect', { x: 694, y: 563, width: 1.4, height: 6 }),
        React.createElement('rect', { x: 704, y: 563, width: 1.4, height: 6 }),
      ),
      completion >= 75 && React.createElement('g', { key: 'uhr', fill: 'none', stroke: p.mid, style: s(75, 0.6, 15) },
        React.createElement('circle', { cx: 150, cy: 150, r: 7, strokeWidth: 1.2 }),
        React.createElement('line', { x1: 150, y1: 150, x2: 150, y2: 145.5, strokeWidth: 1 }),
        React.createElement('line', { x1: 150, y1: 150, x2: 153.5, y2: 151.5, strokeWidth: 0.8 }),
      ),
      completion >= 85 && React.createElement('path', { key: 'schoggi',
        d: 'M 760 600 L 768 586 L 776 600 L 784 586 L 792 600 Z', fill: p.sand, style: s(85, 0.7, 10) }),
      completion >= 95 && React.createElement('circle', { key: 'sonne',
        cx: 250, cy: 130, r: 22, fill: p.sand, style: { opacity: 0.35, transition: 'opacity 1.5s ease' } }),
      completion >= 100 && React.createElement('g', { key: 'fahne' },
        React.createElement('line', { x1: 598, y1: 172, x2: 598, y2: 198, stroke: p.mid, strokeWidth: 1.6 }),
        React.createElement('rect', { x: 599, y: 172, width: 15, height: 10, rx: 0.8, fill: '#d42b2b' }),
        React.createElement('path', { d: 'M 606.5 174 L 606.5 180 M 603.5 177 L 609.5 177', fill: 'none', stroke: '#fff', strokeWidth: 1.8 }),
      ),
    ),
    // Kapitel-Stationen auf der Strasse
    STATIONEN.map((station, i) => {
      const pct = chapterCompletions[i] || 0;
      const IconFn = Icons[station.key];
      const farbe = kapitelFarbe[station.key] || p.sage;
      const zeichen = mitKontrast(farbe, p.surface, 3);
      // Reifestufen wie bisher: Skizze → im Werden → reift → vollständig. Getragen von
      // Rand (gestrichelt → dünn → kräftig) und Grösse, nie von Deckkraft; die Fläche ist
      // immer undurchsichtig (K41) — sonst hängt der Kontrast am Bild dahinter.
      const maturity = pct === 0 ? 'sketch' : pct < 50 ? 'emerging' : pct < 100 ? 'maturing' : 'complete';
      // Handy: 26 px (WCAG 2.5.8 verlangt 24) — mehr passt zwischen die Kehren nicht, ohne dass Etiketten kollidieren.
      const sz = schmal ? 26 : { sketch: 30, emerging: 32, maturing: 34, complete: 36 }[maturity];
      const iconSz = schmal ? 15 : { sketch: 17, emerging: 18, maturing: 20, complete: 21 }[maturity];
      const rand = { sketch: '2px dashed ', emerging: '2px solid ', maturing: '3px solid ', complete: '3px solid ' }[maturity] + farbe;
      const chapterTitle = chapters[i] ? chapters[i].title : station.key;
      const shortLabel = (chapters[i] && chapters[i].short) || chapterTitle.split(/[\s–—]/)[0];
      const abstand = sz / 2 + 4 + 'px';
      const etikettOrt = {
        rechts: { left: abstand, top: '50%', transform: 'translateY(-50%)' },
        links: { right: abstand, top: '50%', transform: 'translateY(-50%)' },
        unten: { top: sz / 2 + 3 + 'px', left: '50%', transform: 'translateX(-50%)' },
        oben: { bottom: sz / 2 + 3 + 'px', left: '50%', transform: 'translateX(-50%)' },
        // über/unter der Station, nach rechts laufend: wo links der Bildrand oder eine
        // Nachbarstation keinen Platz lässt
        obenrechts: { bottom: sz / 2 + 3 + 'px', left: -(sz / 2 + 4) + 'px' },
        untenrechts: { top: sz / 2 + 3 + 'px', left: -(sz / 2 + 4) + 'px' },
      }[station.seite[modus]];
      return React.createElement('div', {
        key: station.key,
        style: { position: 'absolute', ...imRahmen(station.x, station.y), width: 0, height: 0 },
      },
        React.createElement('button', {
          type: 'button',
          onClick: () => onSelectChapter(i),
          'aria-label': chapterTitle,
          style: {
            position: 'absolute', left: -sz / 2 + 'px', top: -sz / 2 + 'px',
            width: sz + 'px', height: sz + 'px', padding: 0,
            borderRadius: '50%', background: p.surface, border: rand, color: zeichen,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: maturity === 'complete' ? `0 0 0 3px ${p.surface}, 0 1px 5px rgba(0,0,0,0.25)` : '0 1px 4px rgba(0,0,0,0.2)',
            transition: `transform ${duration.cinematic}ms ${ease}`,
          },
          onMouseEnter: (e) => { e.currentTarget.style.transform = 'scale(1.08)'; },
          onMouseLeave: (e) => { e.currentTarget.style.transform = 'scale(1)'; },
        },
          React.createElement('div', { style: { width: iconSz + 'px', height: iconSz + 'px' } }, IconFn ? IconFn() : null)
        ),
        React.createElement('span', {
          className: 'mountain-label',
          lang,
          'aria-hidden': 'true',
          style: {
            position: 'absolute', ...etikettOrt, whiteSpace: 'nowrap', pointerEvents: 'none',
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: schmal ? '11px' : text.xs, lineHeight: 1.15, color: p.mid,
            background: p.surface, padding: schmal ? '1px 5px' : '2px 6px', borderRadius: radius.sm,
            fontStyle: maturity === 'sketch' ? 'italic' : 'normal',
            fontWeight: maturity === 'complete' ? weight.medium : weight.normal,
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            ...hyphenStyle,
          },
        },
          // Farbpunkt: dieselbe Kapitelfarbe wie der Rand — Farbe ergänzt, das Wort trägt.
          React.createElement('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: farbe, flex: 'none' } }),
          shortLabel)
      );
    })
  );
};

export default BergLandschaft;
