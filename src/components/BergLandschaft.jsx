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
//   durch → Finanzen (U-Kurve) → Versicherungen (auf der oberen Strasse zwischen den zwei
//   Tannen) → die obere Strasse zurück nach links → die schmale Strasse hinauf zur Ausbildung →
//   oben über den Bogen und die Kehre ins S: Behörden → das S hinunter und die rechte Strasse
//   nach hinten: Notfall.
// Basis und Ausbildung sind NICHT direkt verbunden — dort geht keine Strasse durch. Und wo die
// obere Strasse an der Basis vorbeiläuft, ist der Weg ausgeblendet (Umkreis 48 Einheiten), damit
// es nicht aussieht, als schneide die Basis ihn.
// Weitere Vorgaben (Stebler Studios, 25.09.2026):
//   · der Weg von Versicherungen nach links endet spätestens vor der Behörden-Beschriftung (an
//     der Tanne) und taucht erst an der schmalen Strasse unterhalb der Ausbildung wieder auf;
//   · der Weg zum Notfall beginnt erst, wo die Strasse unter der oberen Strasse hervor ins Bild
//     kommt — nicht am Behörden-Knopf;
//   · der Weg läuft möglichst mittig auf der Fahrbahn: auf den schmalen Strassen quer zur
//     Fahrrichtung vermessen und auf die Mitte gerückt, auf der breiten U-Kurve und der oberen
//     Strasse (Fahrbahn ~38 Einheiten) von Hand auf die Mitte gelegt.
// Wo eine Tanne die Strasse verdeckt, fehlt der Weg — er geht dahinter durch.
// Etikett-Seiten sind errechnet (Suche über alle Kombinationen): ohne Überschneidung bei
// 656/736 px (breit) und 296–496 px (schmal).
export const STATIONEN = [
  { key: 'basis', x: 185, y: 549, seite: { breit: 'links', schmal: 'unten' } },
  { key: 'wohnen', x: 272, y: 616, seite: { breit: 'links', schmal: 'unten' } },
  { key: 'finanzen', x: 558, y: 678, seite: { breit: 'rechts', schmal: 'links' } },
  { key: 'versicherungen', x: 440, y: 626, seite: { breit: 'rechts', schmal: 'oben' } },
  { key: 'ausbildung', x: 195, y: 479, seite: { breit: 'links', schmal: 'oben' } },
  { key: 'behoerden', x: 290, y: 513, seite: { breit: 'unten', schmal: 'unten' } },
  { key: 'notfall', x: 424, y: 526.5, seite: { breit: 'rechts', schmal: 'rechts' } },
];

// Wegstück i gehört zum Kapitel i+1 und führt von Station WEG_VON[i] zu dessen Station — eine
// durchgehende Route, also immer von der vorigen Station. Nur sichtbare Fahrbahn, je Lauf ein
// eigener Unterpfad (M … C …).
export const WEG_VON = [0, 1, 2, 3, 4, 5];
export const WEGSTUECKE = [
  'M185 549C189 550.9 197.5 552.5 208.7 560.3C220 568.1 241.9 586.4 252.6 595.6C263.2 604.7 269.4 611.8 272.6 615.2C275.9 618.6 272.1 615.9 272 616',
  'M272 616C277.5 621.5 296.7 639.6 305.2 648.9C313.8 658.2 318.1 664.6 323.3 671.7C328.5 678.8 334.3 688.2 336.5 691.5M540.5 724.2C541.9 723.4 546.7 721.3 548.9 719.1C551.1 716.9 552.4 715.1 553.9 711.2C555.4 707.3 557.2 701.3 557.9 695.7C558.5 690.2 558 681 558 678',
  'M558 678C557.2 675.1 555.5 665.4 553.3 660.6C551.1 655.9 548.6 652.8 545 649.6C541.3 646.5 537.4 644.2 531.4 641.7C525.3 639.2 512.5 636 508.8 634.8M484.2 630.6C476.9 629.8 447.4 626.8 440 626',
  'M440 626C433.6 625 408 621.2 401.6 620.3M172.9 504.9C173.6 503.7 173.3 501.9 177.2 497.8C181.2 493.7 193.7 483.3 196.6 480.2C199.6 477.1 195.3 479.2 195 479',
  'M195.7 474.2C197.2 472.3 202.5 464.9 204.7 462.7C206.9 460.5 203.6 462.5 208.9 461.1C214.1 459.7 227.2 456.1 236.4 454.4C245.6 452.6 254.2 452.5 264.2 450.8C274.1 449.1 288.8 446.9 296 444.4C303.1 441.8 303.4 437.8 307.2 435.6C310.9 433.3 314.7 431.1 318.5 430.9C322.4 430.6 326.9 432.9 330.3 434.3C333.7 435.8 336.3 437.4 338.9 439.5C341.4 441.7 344.1 444.6 345.6 447.2C347.1 449.8 347.7 452.5 347.7 455.2C347.8 457.9 348 460.3 346 463.4C344.1 466.4 340.6 469.7 336.1 473.5C331.5 477.3 324.6 482.2 318.8 486.1C313 489.9 305.3 493.9 301.3 496.8C297.4 499.6 297.2 500.5 295.3 503.2C293.4 505.9 290.9 511.4 290 513',
  'M353.1 562C354.3 560.1 358 553.5 360.5 550.4C363 547.4 365.3 545.9 367.9 544C370.6 542 371.9 540.9 376.4 538.8C380.9 536.8 386.9 533.8 394.8 531.8C402.8 529.7 419.1 527.4 424 526.5',
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
