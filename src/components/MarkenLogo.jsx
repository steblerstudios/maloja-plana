import React from 'react';
import { visuallyHiddenStyle } from '../config/tokens.js';
import { DARK_PALETTE } from '../config/constants.js';
import schriftzugAdresse from './marken-schriftzug.svg';

// Das Logo von Maloja Plana — Bildmarke «Weg durch die Berge» + Schriftzug, horizontale
// Standardfassung aus dem Markenpaket 1.0 (docs/brand/markenpaket-2026-09/).
//
// EINE Quelle statt vier Kopien: Kopfzeile, Sperrbildschirm, Beta-Tor und Onboarding
// trugen das alte Gipfel-«M» je von Hand. Die Pfade sind wörtlich aus
// logo-horizontal-dunkel.svg übernommen (pixelgeprüft gegen das gelieferte PNG); der
// Test markenLogo.test.js hält sie mit der Datei gleich — auch den Schriftzug, der
// seit dem 24.09.2026 nicht mehr hier steht, sondern in marken-schriftzug.svg.
//
// ─── Warum der Schriftzug eine DATEI ist (E36) ──────────────────────────────
// Der Schriftzug ist Ubuntu in Pfaden — ein Bild, keine Schrift. Die App-Schrift
// (Lexend) bleibt davon unberührt, und es wird keine Schriftdatei geladen.
//
// Diese Pfade sind 8648 Zeichen Koordinaten. Im Startbundle kosteten sie 4,14 kB
// gzip — von 65 kB Deckel (npm run size) also gut 6 Prozent, und damit mehr als jede
// andere Einsparung dieses Tages. Koordinaten komprimieren nur etwa 2:1, während
// wiederholter Code 6:1 schrumpft; pro Byte war das der teuerste Posten der Datei
// (gemessen mit scripts/bundle-posten.mjs).
//
// Darum liegt der Schriftzug jetzt neben dem Bundle und nicht darin. Vite gibt ihm
// einen Hash unter /assets/, der Service Worker legt alles unter /assets/ beim ersten
// Laden ab (cache-first, public/sw.js) — offline ist er also da, ohne dass sw.js eine
// eigene Liste braucht.
//
// Umgefärbt wird er per Maske statt per Datei-Variante: der Schriftzug ist in BEIDEN
// Fassungen einfarbig (dunkel Warmweiss, hell Anthrazit), also trägt background-color
// die Farbe und die Datei nur die Form. So bleibt es EINE Datei — eine zweite wäre
// wieder eine zweite Quelle für dieselben Pfade.
//
// Die BILDMARKE bleibt bewusst inline: sie ist nur 553 Zeichen (rund 0,2 kB) und
// braucht im Dunkeln zwei Farben. So steht die Marke im ersten Bild ohne jeden Abruf
// sofort da; nachgeladen wird nur die Beschriftung. Fällt mask-image aus, fehlt der
// Schriftzug — die Bildmarke und der vorgelesene Name «Maloja Plana» bleiben.
//
// Farbe nach der FLÄCHE, auf der das Logo steht — nicht nach data-theme: das Beta-Tor
// ist immer hell, auch im Dunkelmodus. Darum bekommt das Logo die Palette seiner
// Fläche und prüft sie wie applyColorBlind (bg === DARK_PALETTE.bg).
// Dunkel: farbig (Salbei/Sand, Schrift Warmweiss). Hell: einfarbig Anthrazit — so
// sieht es das Markenbuch vor; Salbei hätte auf #F2F2F0 nur rund 2:1.
//
// Das Bild ist aria-hidden; den Namen trägt ein versteckter Text, damit Screenreader
// UND Text-Extraktion (Suchmaschine, KI-Crawler) «Maloja Plana» lesen.

export const LOGO_PFADE = {
  weg1: 'M 0 190 C 0 169 7 152 22 138 L 89 78 C 102 66 119 65 131 78 C 177 122 206 136 270 153 C 299 163 321 172 302 193 C 284 208 228 224 182 242 C 128 264 92 294 92 330 L 92 467 C 92 529 0 529 0 468 Z',
  berg: 'M 176 92 L 265 7 C 278 -4 294 -3 307 10 L 392 110 C 405 101 421 96 434 110 L 479 154 C 493 168 500 186 500 205 L 500 280 C 455 234 433 196 379 175 C 335 157 282 143 240 127 C 216 118 194 105 176 92 Z',
  weg2: 'M 200 331 C 200 286 269 248 322 242 C 410 230 500 278 500 349 C 500 414 431 467 328 467 L 328 375 C 328 345 275 312 275 351 L 275 529 C 275 562 200 563 200 517 Z',
};

// Ausschnitt ohne den Schutzraum der 940x220-Datei — den Abstand gibt das Layout.
// marken-schriftzug.svg trägt DENSELBEN viewBox, darum liegen Maske und Bildmarke
// ohne weitere Rechnung deckungsgleich übereinander.
const VIEWBOX = '26 20 782 184';
const SEITENVERHAELTNIS = 184 / 782;

export const LOGO_FARBEN = {
  dunkel: { weg: '#8FB0A0', berg: '#C4A870', schrift: '#E6E3DC' },
  hell:   { weg: '#22211F', berg: '#22211F', schrift: '#22211F' },
};

// breite: Markenbuch-Startwert fürs horizontale Logo ist 180 px — nicht darunter.
export const MarkenLogo = ({ palette, breite = 180, name = 'Maloja Plana' }) => {
  const f = palette?.bg === DARK_PALETTE.bg ? LOGO_FARBEN.dunkel : LOGO_FARBEN.hell;
  const hoehe = Math.round(breite * SEITENVERHAELTNIS);
  const maske = 'url(' + schriftzugAdresse + ')';
  return React.createElement(React.Fragment, null,
    React.createElement('span', {
      // Der Kasten hält die Höhe von Anfang an — der nachgeladene Schriftzug
      // schiebt darum nichts, wenn er erscheint.
      style: { position: 'relative', display: 'block', width: breite, height: hoehe, flexShrink: 0 },
      'aria-hidden': 'true',
    },
      React.createElement('span', {
        style: {
          position: 'absolute', inset: 0,
          backgroundColor: f.schrift,
          WebkitMaskImage: maske, maskImage: maske,
          WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center', maskPosition: 'center',
          // contain entspricht dem preserveAspectRatio-Standard des SVG daneben
          WebkitMaskSize: 'contain', maskSize: 'contain',
        },
      }),
      React.createElement('svg', {
        width: breite, height: hoehe, viewBox: VIEWBOX, focusable: 'false',
        style: { position: 'absolute', inset: 0, display: 'block' },
      },
        React.createElement('g', { transform: 'translate(28 22) scale(0.32)' },
          React.createElement('path', { fill: f.weg, d: LOGO_PFADE.weg1 }),
          React.createElement('path', { fill: f.berg, d: LOGO_PFADE.berg }),
          React.createElement('path', { fill: f.weg, d: LOGO_PFADE.weg2 })
        )
      )
    ),
    React.createElement('span', { style: visuallyHiddenStyle }, name)
  );
};
