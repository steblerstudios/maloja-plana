import { describe, it, expect } from 'vitest';
import React from 'react';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { MarkenLogo, LOGO_PFADE } from '../MarkenLogo.jsx';
import { DARK_PALETTE, LIGHT_PALETTE } from '../../config/constants.js';

// Das Logo kommt aus EINER Quelle. Die Zusagen, die hier gehalten werden:
// 1. Die Pfade sind die des Markenpakets — niemand «verbessert» sie still.
// 2. Der Name ist lesbar, obwohl das Bild aria-hidden ist.
// 3. Die Farbe folgt der Fläche: dunkel farbig, hell einfarbig Anthrazit — auch dort,
//    wo die Fläche nicht dem Modus folgt (das Beta-Tor ist immer hell).
// 4. Das alte Gipfel-«M» kommt nirgends als zweite Quelle zurück.

const lies = (pfad) => readFileSync(new URL(pfad, import.meta.url), 'utf8');

describe('MarkenLogo', () => {
  it('trägt dieselben Pfade wie die Paket-Datei logo-horizontal-dunkel.svg', () => {
    const svg = lies('../../../docs/brand/markenpaket-2026-09/logo-horizontal-dunkel.svg');
    const ausDatei = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
    expect(ausDatei).toEqual([LOGO_PFADE.weg1, LOGO_PFADE.berg, LOGO_PFADE.weg2, LOGO_PFADE.schrift]);
  });

  it('das Bild ist für Screenreader stumm, der Name steht als Text daneben', () => {
    const markup = renderToStaticMarkup(React.createElement(MarkenLogo));
    expect(markup).toMatch(/<svg[^>]*aria-hidden="true"/);
    const text = markup.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').trim();
    expect(text).toBe('Maloja Plana');
  });

  it('hält das Seitenverhältnis bei jeder Breite', () => {
    const markup = renderToStaticMarkup(React.createElement(MarkenLogo, { breite: 391 }));
    expect(markup).toContain('width="391"');
    expect(markup).toContain('height="92"');
  });

  it('dunkle Fläche: Salbei, Sand, Warmweiss', () => {
    const markup = renderToStaticMarkup(React.createElement(MarkenLogo, { palette: DARK_PALETTE }));
    expect(markup).toContain('fill="#8FB0A0"');
    expect(markup).toContain('fill="#C4A870"');
    expect(markup).toContain('fill="#E6E3DC"');
  });

  it('helle Fläche: einfarbig Anthrazit, keine Salbei-Schrift auf Hell', () => {
    const markup = renderToStaticMarkup(React.createElement(MarkenLogo, { palette: LIGHT_PALETTE }));
    const fills = [...markup.matchAll(/fill="(#[0-9A-Fa-f]{6})"/g)].map((m) => m[1]);
    expect(fills.length).toBe(4);
    expect(new Set(fills)).toEqual(new Set(['#22211F']));
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
