import React, { useEffect, useRef, useState } from 'react';
import Icons from '../IconKern.jsx';
import { PageTitle } from './Heading.jsx';
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
// Breit: das ganze Bild — seit dem Hero (25.09.2026) mit dem ganzen Himmel, in dem der Titel
// steht. Schmal: das Strassennetz, damit die Stationen am Handy weit genug auseinanderliegen,
// nach oben erweitert bis in die blassen Gipfel (Platz für den Titel). Die Breite und damit
// der Massstab bleiben gleich — Stationen und Etiketten liegen zueinander wie zuvor.
export const AUSSCHNITT = {
  breit: { x: 0, y: 0, w: 1100, h: 788 },
  schmal: { x: 110, y: 130, w: 490, h: 580 },
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
//   · der Weg von Versicherungen nach links läuft hinter der Tanne weiter und endet unter der
//     Behörden-Beschriftung (x 330), dann taucht er erst an der schmalen Strasse unterhalb der
//     Ausbildung wieder auf; das kurze Stück unten in der U-Kurve zwischen den Tannen bleibt;
//   · von Wohnen läuft der Weg in einem weichen Bogen als EINE Linie hinter die erste Tanne
//     (kein abgesetztes Stückchen zwischen den Ästen);
//   · der Weg zum Notfall beginnt, wo die rechte Strasse an der oberen Strasse anfängt (unterhalb
//     der Kurve) — nicht am Behörden-Knopf; die Schlaufe unten im S bleibt verdeckt;
//   · in der U-Kurve vor Finanzen läuft der Weg etwas mittiger, parallel zum Kurvenbogen;
//   · der Weg läuft möglichst mittig auf der Fahrbahn: auf den schmalen Strassen quer zur
//     Fahrrichtung vermessen und auf die Mitte gerückt, auf der breiten U-Kurve und der oberen
//     Strasse (Fahrbahn ~38 Einheiten) von Hand auf die Mitte gelegt.
// Wo eine Tanne die Strasse verdeckt, fehlt der Weg — er geht dahinter durch.
// Etikett-Seiten sind errechnet (Suche über alle Kombinationen): ohne Überschneidung bei
// 656/736 px (breit) und 296–496 px (schmal).
export const STATIONEN = [
  { key: 'basis', x: 185, y: 549, seite: { breit: 'links', schmal: 'unten' } },
  { key: 'wohnen', x: 272, y: 616, seite: { breit: 'links', schmal: 'unten' } },
  { key: 'finanzen', x: 551, y: 680, seite: { breit: 'rechts', schmal: 'links' } },
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
  'M272 616C275.8 619.5 289.2 631.5 295.1 637.2C301 642.8 303.5 645.6 307.4 649.9C311.3 654.3 313.5 656.6 318.5 663.1C323.5 669.7 334.3 684.7 337.5 689M432.1 727.2C435.3 727.5 448.4 728.9 451.6 729.2M540.5 724.4C541.2 723.6 542.9 722.4 544.5 719.5C546 716.5 548.5 710.6 549.6 706.6C550.7 702.6 551 699.9 551.2 695.4C551.4 691 551 682.6 551 680',
  'M551 680C550.6 677 549.6 666.3 548.7 662.1C547.8 657.9 546.9 657.3 545.5 655C544.2 652.8 542.6 650.6 540.8 648.6C539 646.7 537.1 644.9 534.9 643.3C532.7 641.6 532.3 640.7 527.6 638.7C522.9 636.7 510.3 632.4 506.8 631.1M484.3 627.4C476.9 627.2 447.4 626.2 440 626',
  'M440 626C433.6 625 408.2 621.1 401.8 620.2M364.4 611.1C358.7 609.8 335.7 604.4 330 603M172.9 504.9C173.6 503.7 173.2 501.9 177.2 497.8C181.2 493.7 194 483.3 196.9 480.2C199.9 477.1 195.3 479.2 195 479',
  'M195.7 474.2C197.2 472.3 202.5 464.9 204.7 462.7C206.9 460.5 203.6 462.5 208.9 461.1C214.1 459.7 227.2 456.1 236.4 454.4C245.6 452.6 254.2 452.5 264.2 450.8C274.1 449.1 288.8 446.9 296 444.4C303.1 441.8 303.4 437.8 307.2 435.6C310.9 433.3 314.7 431.1 318.5 430.9C322.4 430.6 326.9 432.9 330.3 434.3C333.7 435.8 336.3 437.4 338.9 439.5C341.4 441.7 344.1 444.6 345.6 447.2C347.1 449.8 347.7 452.5 347.7 455.2C347.8 457.9 348 460.3 346 463.4C344.1 466.4 340.6 469.7 336.1 473.5C331.5 477.3 324.6 482.2 318.8 486.1C313 489.9 305.3 493.9 301.3 496.8C297.4 499.6 297.2 500.5 295.3 503.2C293.4 505.9 290.9 511.4 290 513',
  'M348 584C348.4 581.9 349.4 575.3 350.4 571.2C351.5 567.1 352.7 562.5 354.2 559.3C355.6 556 357.1 554.3 359.1 551.9C361.2 549.6 363.5 547.3 366.4 545.2C369.2 543 372.6 540.8 376.4 538.8C380.2 536.9 384.8 535 389.1 533.5C393.5 532.1 396.8 531.2 402.6 530C408.4 528.8 420.4 527.1 424 526.5',
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

const BergLandschaft = ({ palette, chapters, chapterCompletions, completion, onSelectChapter, lang, hyphenStyle, titel, fortschrittText, prozent }) => {
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
      margin: '8px -8px 24px -8px', position: 'relative', lineHeight: 0,
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
    // Der Anspruch als Titel im Himmel (Hero, seit 25.09.2026), links bündig (Entscheid Stebler
    // Studios). Dunkler Text der hellen Palette auf hellem Himmel und blassen Gipfeln. Links oben
    // ragt der dunkle Hang ins Bild — der Abstand (oben/links) ist so gewählt, dass der Text ihn
    // nicht berührt: an den Bildpunkten gemessen 320–736 px jeder Punkt ≥ 3:1. KEIN heller Schein
    // dahinter (er stand bis 25.09. da und zeigte sich am Hang als weisser Fleck um das «O»).
    // Keine Deckkraft auf dem Text (K41).
    titel && React.createElement(PageTitle, {
      palette: p,
      'data-testid': 'berg-titel',
      style: {
        position: 'absolute', top: schmal ? '10px' : '16px', left: schmal ? '26px' : '44px',
        right: schmal ? '26px' : '44px', textAlign: 'left',
        fontSize: schmal ? '24px' : '30px', lineHeight: 1.15, letterSpacing: '-0.3px',
        color: p.text,
        textWrap: 'balance',
      },
    }, titel),
    // Fortschritt im Bild, unten (seit 25.09.2026, vorher eine Zeile über dem Bild): links der
    // Stand («7 von 7 begonnen»), rechts die Prozentzahl. Am Handy (< SCHMAL_AB) liegt unten
    // rechts die Station Finanzen — dort rückt die Prozentzahl direkt neben den Stand (gemessen
    // 320–736 px, ohne Überschneidung). Gleiche Machart wie die Etiketten: undurchsichtiger
    // Grund, helle Palette, damit der Kontrast nicht am Bild hängt (K41).
    (fortschrittText || prozent) && React.createElement('div', {
      key: 'fortschritt',
      style: {
        position: 'absolute', left: schmal ? '8px' : '12px', right: schmal ? '8px' : '12px', bottom: schmal ? '8px' : '12px',
        display: 'flex', justifyContent: schmal ? 'flex-start' : 'space-between', alignItems: 'flex-end',
        gap: '6px', pointerEvents: 'none',
      },
    },
      ...(() => {
        const schild = {
          fontSize: schmal ? '11px' : text.xs, lineHeight: 1.2, whiteSpace: 'nowrap',
          background: p.surface, padding: schmal ? '3px 7px' : '4px 9px', borderRadius: radius.sm,
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        };
        return [
          fortschrittText && React.createElement('div', {
            key: 'stand', 'data-testid': 'berg-fortschritt', style: { ...schild, color: p.mid },
          }, fortschrittText),
          prozent && React.createElement('div', {
            key: 'prozent', 'data-testid': 'berg-prozent',
            style: { ...schild, color: p.sageDeep, fontWeight: weight.medium, marginLeft: fortschrittText ? undefined : 'auto' },
          }, prozent),
        ];
      })(),
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
