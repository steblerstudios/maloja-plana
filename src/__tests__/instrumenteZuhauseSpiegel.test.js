// Instrumente: ein Zuhause, feste Spiegel (Stebler Studios 09.11.2026, «Ja, A–C» + «wir nehmen das Netz-Schild»).
// Landkarte: stebler-studios/_handoffs/2026-11-09-instrumente-landkarte.md · Brand Book «Instrumente».
//   A Zuhause (eigenes Kapitel) gross 256 · B Spiegel Werkzeug mittel 128 · C Spiegel Startseite klein 64 (1 : 2 : 4).
// Das Netz-Schild (F7-K3-6, 27.10.2026) ist das eine Schild. Das alte Schild «Pflicht / Empfohlen» war auf der
// Startseite (36 px) und in der Prämien-Übersicht (58 px) stehen geblieben.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { INSTRUMENT_GROESSE } from '../config/tokens.js';
import { NetzSchild, schildZeilen, wortBreite, SCHILD_FELD_BREITE } from '../components/NetzSchild.jsx';
import { VersicherungenInstrument } from '../components/VersicherungenInstrument.jsx';
import { InstrumentePanel } from '../components/InstrumentePanel.jsx';
import PraemienOrientierung from '../PraemienOrientierung.jsx';
import { LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { DEMO_DATA } from '../config/demoData.js';
import { schildOptionen } from '../data/schutzschild.js';

const t = createT({ de }, 'de', 'sie');
const h = React.createElement;
const schildProps = { palette: LIGHT_PALETTE, t, versicherungen: DEMO_DATA.versicherungen, finanzen: DEMO_DATA.finanzen, kanton: DEMO_DATA.basis?.canton, ...schildOptionen(DEMO_DATA) };
const breiteDesSchilds = (html) => {
  const m = html.match(/<svg[^>]*role="img"[^>]*style="[^"]*max-width:(\d+)px/);
  return m ? Number(m[1]) : null;
};

describe('Instrumente: drei feste Grössen', () => {
  it('klein : mittel : gross = 64 : 128 : 256', () => {
    expect(INSTRUMENT_GROESSE).toEqual({ klein: 64, mittel: 128, gross: 256 });
  });

  it('das Netz-Schild hat in jeder Grösse genau die feste Breite', () => {
    for (const groesse of ['klein', 'mittel', 'gross']) {
      const html = renderToStaticMarkup(h(NetzSchild, { ...schildProps, groesse }));
      expect(breiteDesSchilds(html), groesse).toBe(INSTRUMENT_GROESSE[groesse]);
    }
  });

  it('Wörter in den Teilen nur gross, dort mindestens 13 px (Mindestschrift); klein und mittel ohne Wörter', () => {
    // Im Browser 09.11. gemessen: bei 128 px wären die Wörter ~6 px, bei 64 px unlesbar.
    for (const groesse of ['klein', 'mittel']) {
      expect(renderToStaticMarkup(h(NetzSchild, { ...schildProps, groesse })), groesse).not.toMatch(/<text/);
    }
    const gross = renderToStaticMarkup(h(NetzSchild, { ...schildProps, groesse: 'gross' }));
    const viewBreite = Number(gross.match(/viewBox="0 0 (\d+)/)[1]);
    const schrift = [...gross.matchAll(/<text[^>]*font-size:([\d.]+)px/g)].map((m) => Number(m[1]));
    expect(schrift.length).toBeGreaterThan(0);
    for (const s of schrift) expect(s * INSTRUMENT_GROESSE.gross / viewBreite).toBeGreaterThanOrEqual(13);
  });
});

describe('Wörter im grossen Schild passen in ihr Feld — alle 5 Sprachen', () => {
  // 09.11.: «Krankenkasse» stiess bei 13 px über die Fuge. Jede Zeile muss schmaler sein als das Feld (mit 8 Einheiten Luft).
  it('jede Zeile jedes Teils ist schmaler als das Feld', async () => {
    const zuBreit = [];
    for (const lang of ['de', 'fr', 'it', 'en', 'rm']) {
      const kurz = (await import(`../i18n/${lang}.js`)).default.netzSchild.kurz;
      for (const [key, wort] of Object.entries(kurz)) {
        for (const z of schildZeilen(wort)) if (wortBreite(z) > SCHILD_FELD_BREITE - 8) zuBreit.push(`${lang}.${key}: «${z}»`);
      }
    }
    expect(zuBreit).toEqual([]);
  });
});

describe('Netz-Schild ist das eine Schild', () => {
  it('A: im Kapitel Versicherungen gross', () => {
    const html = renderToStaticMarkup(h(VersicherungenInstrument, { palette: LIGHT_PALETTE, t, versicherungen: DEMO_DATA.versicherungen, allData: DEMO_DATA, onNavigate: () => {} }));
    expect(html).toContain('data-schild="netz"');
    expect(breiteDesSchilds(html)).toBe(INSTRUMENT_GROESSE.gross);
  });

  it('B: in der Prämien-Übersicht mittel, das alte Schild ist weg', () => {
    const html = renderToStaticMarkup(h(PraemienOrientierung, { palette: LIGHT_PALETTE, t, data: DEMO_DATA, onNavigate: () => {} }));
    expect(html).toContain('data-schild="netz"');
    expect(breiteDesSchilds(html)).toBe(INSTRUMENT_GROESSE.mittel);
    // Nur das alte Schild «Pflicht / Empfohlen» (components/_archiv/Schutzschild.jsx) zeichnet diese beiden Clip-Pfade.
    expect(html).not.toContain('schild-pflicht');
    expect(html).not.toContain('schild-empfohlen');
  });

  it('C: auf der Startseite klein, alle Mini-Instrumente gleich breit', () => {
    const html = renderToStaticMarkup(h(InstrumentePanel, { palette: LIGHT_PALETTE, t, data: DEMO_DATA, onNavigate: () => {} }));
    expect(html).toContain('data-schild="netz"');
    // Ein Behälter je Instrument bestimmt die Breite; die Glyphe füllt ihn (width 100 %).
    const breiten = [...html.matchAll(/data-instrument-glyph="[^"]+"[^>]*style="[^"]*width:(\d+)px/g)].map((m) => Number(m[1]));
    expect(breiten.length).toBeGreaterThanOrEqual(4);
    expect(new Set(breiten)).toEqual(new Set([INSTRUMENT_GROESSE.klein]));
    const feste = [...html.matchAll(/data-instrument-glyph="[^"]+"[^>]*>(?:<div[^>]*>)?<svg[^>]*\swidth="(\d+)"/g)];
    expect(feste.map((m) => m[1]), 'keine Glyphe mit eigener fester Breite').toEqual([]);
  });
});
