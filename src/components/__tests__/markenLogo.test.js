import { describe, it, expect } from 'vitest';
import React from 'react';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { MarkenLogo, LOGO_PFADE } from '../MarkenLogo.jsx';
import { DARK_PALETTE, LIGHT_PALETTE } from '../../config/constants.js';

// Das Logo kommt aus EINER Quelle. Die Zusagen, die hier gehalten werden:
// 1. Die Pfade sind die des Markenpakets — niemand «verbessert» sie still.
//    Seit dem 24.09.2026 liegt der Schriftzug in marken-schriftzug.svg statt im
//    Bundle (E36, 4,14 kB gzip); die Zusage gilt unverändert, nur an zwei Stellen.
// 2. Der Name ist lesbar, obwohl das Bild aria-hidden ist.
// 3. Die Farbe folgt der Fläche: dunkel farbig, hell einfarbig Anthrazit — auch dort,
//    wo die Fläche nicht dem Modus folgt (das Beta-Tor ist immer hell).
// 4. Das alte Gipfel-«M» kommt nirgends als zweite Quelle zurück.

const lies = (pfad) => readFileSync(new URL(pfad, import.meta.url), 'utf8');

const markenDatei = () => lies('../../../docs/brand/markenpaket-2026-09/logo-horizontal-dunkel.svg');
const pfadeAus = (svg) => [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);

describe('MarkenLogo', () => {
  it('die Bildmarke trägt dieselben Pfade wie die Paket-Datei', () => {
    const [weg1, berg, weg2] = pfadeAus(markenDatei());
    expect([LOGO_PFADE.weg1, LOGO_PFADE.berg, LOGO_PFADE.weg2]).toEqual([weg1, berg, weg2]);
  });

  it('der Schriftzug in marken-schriftzug.svg ist der des Markenpakets', () => {
    const schriftAusPaket = pfadeAus(markenDatei())[3];
    const ausDatei = pfadeAus(lies('../marken-schriftzug.svg'));
    expect(ausDatei).toEqual([schriftAusPaket]);
  });

  it('Maske und Bildmarke liegen deckungsgleich: derselbe viewBox', () => {
    // Sonst sitzt der Schriftzug versetzt zur Bildmarke — sichtbar, aber von
    // keinem anderen Test erfasst.
    const schriftzug = lies('../marken-schriftzug.svg');
    const ausKomponente = lies('../MarkenLogo.jsx').match(/const VIEWBOX = '([^']+)'/)[1];
    expect(schriftzug).toContain(`viewBox="${ausKomponente}"`);
  });

  it('der Schriftzug-Pfad steht NICHT mehr im Bundle-Quelltext', () => {
    // Die 4,14 kB kämen sonst still zurück — genau das soll nicht passieren.
    const schriftAusPaket = pfadeAus(markenDatei())[3];
    expect(lies('../MarkenLogo.jsx')).not.toContain(schriftAusPaket.slice(0, 60));
    expect(LOGO_PFADE.schrift).toBeUndefined();
  });

  it('das Bild ist für Screenreader stumm, der Name steht als Text daneben', () => {
    const markup = renderToStaticMarkup(React.createElement(MarkenLogo));
    expect(markup).toMatch(/<span[^>]*aria-hidden="true"/);
    // Nur der versteckte Name bleibt als Text übrig
    const text = markup.replace(/<[^>]+>/g, '').trim();
    expect(text).toBe('Maloja Plana');
  });

  it('hält das Seitenverhältnis bei jeder Breite', () => {
    const markup = renderToStaticMarkup(React.createElement(MarkenLogo, { breite: 391 }));
    expect(markup).toContain('width="391"');
    expect(markup).toContain('height="92"');
  });

  it('der Kasten hält die Höhe, bevor der Schriftzug geladen ist', () => {
    // Ohne feste Höhe springt das Layout, sobald die Datei ankommt.
    const markup = renderToStaticMarkup(React.createElement(MarkenLogo, { breite: 391 }));
    expect(markup).toMatch(/position:relative[^"]*height:92px|height:92px[^"]*position:relative/);
  });

  it('dunkle Fläche: Salbei, Sand, Warmweiss', () => {
    const markup = renderToStaticMarkup(React.createElement(MarkenLogo, { palette: DARK_PALETTE }));
    expect(markup).toContain('fill="#8FB0A0"');
    expect(markup).toContain('fill="#C4A870"');
    // Der Schriftzug ist jetzt Maske + Fläche, nicht mehr fill
    expect(markup).toContain('background-color:#E6E3DC');
  });

  it('helle Fläche: einfarbig Anthrazit, keine Salbei-Schrift auf Hell', () => {
    const markup = renderToStaticMarkup(React.createElement(MarkenLogo, { palette: LIGHT_PALETTE }));
    const fills = [...markup.matchAll(/fill="(#[0-9A-Fa-f]{6})"/g)].map((m) => m[1]);
    expect(fills.length).toBe(3);
    expect(new Set(fills)).toEqual(new Set(['#22211F']));
    expect(markup).toContain('background-color:#22211F');
  });

  it('die Maske zeigt auf die Schriftzug-Datei, in beiden Fassungen', () => {
    for (const palette of [DARK_PALETTE, LIGHT_PALETTE]) {
      const markup = renderToStaticMarkup(React.createElement(MarkenLogo, { palette }));
      expect(markup).toMatch(/-webkit-mask-image:url\([^)]*marken-schriftzug[^)]*\)/);
    }
  });

  it('jeder Einstieg reicht die Palette seiner Fläche durch', () => {
    for (const datei of ['../../main.jsx', '../../LockScreen.jsx', '../../BetaGate.jsx', '../../Onboarding.jsx']) {
      expect(lies(datei), datei).toMatch(/React\.createElement\(MarkenLogo, \{ palette,/);
    }
  });

  it('die vier Einstiege nutzen MarkenLogo, keine eigene Wortmarke mehr', () => {
    for (const datei of ['../../main.jsx', '../../LockScreen.jsx', '../../BetaGate.jsx', '../../Onboarding.jsx']) {
      const src = lies(datei);
      expect(src, datei).toContain('React.createElement(MarkenLogo');
      expect(src, datei).not.toContain("'aloja Plana'");
    }
  });
});
