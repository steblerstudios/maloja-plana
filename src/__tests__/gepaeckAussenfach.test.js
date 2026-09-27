import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Gepaeck } from '../Gepaeck.jsx';
import { LIGHT_PALETTE } from '../config/constants.js';
import { werkzeugeImFach, AUSSENFACH } from '../data/werkzeugRegister.js';
import { GEGENSTAENDE } from '../data/gepaeck.js';

// Wunsch 27.09.2026: das Aussenfach steht zweimal im Gepäck — offen oben UND als achte,
// zuklappbare Karte. Bedingung: derselbe Inhalt, aus demselben Register.
const t = (k) => k;
const html = renderToStaticMarkup(React.createElement(Gepaeck, { palette: LIGHT_PALETTE, t, data: {}, onNavigate: () => {}, isDarkMode: false, chapters: [] }));

// Beschriftungen der Knöpfe innerhalb des Elements mit dieser id / dieses Abschnitts.
const knoepfe = (start) => {
  const rest = html.slice(start);
  // bis zum Ende des umschliessenden Blocks genügt: bis zum nächsten Gegenstands-Kopf.
  const ende = rest.search(/aria-expanded=|<\/section>/);
  const block = ende > 0 ? rest.slice(0, ende) : rest;
  // Die Beschriftung ist der letzte Text vor </button> (Zeichen davor sind aria-hidden).
  return [...block.matchAll(/>([^<>]*)<\/span><\/button>/g)].map((m) => m[1].trim());
};

describe('Aussenfach: offen oben und als achte Karte', () => {
  it('es gibt 8 zuklappbare Karten (7 Gegenstände + Aussenfach)', () => {
    expect((html.match(/aria-expanded=/g) || []).length).toBe(GEGENSTAENDE.length + 1);
    expect(html).toContain('id="gepaeck-fach-aussenfach"');
  });

  it('die Karte und das offene Fach zeigen denselben Inhalt wie das Register', () => {
    const erwartet = werkzeugeImFach(AUSSENFACH).map((w) => w.nav);
    const offen = knoepfe(html.indexOf('aria-labelledby="gepaeck-aussenfach"'));
    const karte = knoepfe(html.indexOf('id="gepaeck-fach-aussenfach"'));
    expect(offen).toEqual(erwartet);
    expect(karte).toEqual(erwartet);
  });

  it('die Karte hat einen eigenen, kurzen Namen (sonst wirkt sie wie ein Doppel)', () => {
    expect(html).toContain('gepaeck.aussenfachKarte<');
    expect(html).toContain('gepaeck.aussenfachKarteSub<');
  });

  it('das offene Aussenfach steht vor den Gegenständen, die Karte nach dem Portemonnaie', () => {
    const offen = html.indexOf('aria-labelledby="gepaeck-aussenfach"');
    const erste = html.indexOf('aria-controls="gepaeck-fach-' + GEGENSTAENDE[0].key + '"');
    const geld = html.indexOf('aria-controls="gepaeck-fach-geld"');
    const karte = html.indexOf('aria-controls="gepaeck-fach-aussenfach"');
    expect(offen).toBeGreaterThan(-1);
    expect(offen).toBeLessThan(erste);
    expect(karte).toBeGreaterThan(geld);
  });
});
