// B-F5 (Instrumente-Matrix 10.11.2026, entschieden 11.11.2026 «kreuz sollte kachel mit daten sein»):
// Die Kachel zeichnete ein festes Mini-Kreuz ohne Daten. Jetzt zeichnet sie das Kreuz aus derselben Rechnung wie
// das Werkzeug (kreuzState) — beide Linien aus den echten Kurven, dazu der Strich «bisher» bei den eigenen Kosten.
// Ohne geladene Prämien kein Bild (kein erfundener Stand).
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { KreuzKlein, InstrumentePanel } from '../components/InstrumentePanel.jsx';
import { kreuzState } from '../data/franchiseTacho.js';
import { LIGHT_PALETTE } from '../config/constants.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';

const t = createT({ de }, 'de', 'sie');
const opt = { lowFra: 300, highFra: 2500, annualSaving: 1400, reserve: 3200, sbMax: 700, breakEven: 1700, lowPremium: 450, highPremium: 450 - 1400 / 12 };
const heute = new Date(2026, 5, 30);
const svg = (costs) => renderToStaticMarkup(React.createElement(KreuzKlein, { palette: LIGHT_PALETTE, st: kreuzState(opt, costs, heute) }));
const punkte = (html, linie) => new RegExp(`data-linie="${linie}"[^>]*points="([^"]+)"`).exec(html)?.[1]
  || new RegExp(`points="([^"]+)"[^>]*data-linie="${linie}"`).exec(html)?.[1];

describe('Kreuz-Kachel mit echten Daten', () => {
  it('zeichnet beide Linien aus kreuzState, nicht aus festen Punkten', () => {
    const html = svg(0);
    expect(html).toContain('data-kreuz="klein"');
    const tief = punkte(html, 'tief'), hoch = punkte(html, 'hoch');
    expect(tief).toBeTruthy();
    expect(hoch).toBeTruthy();
    // So viele Punkte wie die Kurve der Rechnung
    expect(tief.trim().split(/\s+/).length).toBe(kreuzState(opt, 0, heute).kurve.length);
    // Die alte feste Zeichnung ist weg
    expect(html).not.toContain('6,28 34,15 58,15');
  });

  it('andere Prämien → andere Linien (das Bild folgt den Daten)', () => {
    const a = punkte(svg(0), 'hoch');
    const b = punkte(renderToStaticMarkup(React.createElement(KreuzKlein, { palette: LIGHT_PALETTE, st: kreuzState({ ...opt, highPremium: 300 }, 0, heute) })), 'hoch');
    expect(a).not.toBe(b);
  });

  it('Strich «bisher» nur mit eigenen Kosten, an der richtigen Stelle', () => {
    expect(svg(0)).not.toContain('data-teil="kreuz-bisher"');
    const st = kreuzState(opt, 900, heute);
    const html = svg(900);
    const x = Number(/data-teil="kreuz-bisher"[^>]*x1="([\d.]+)"/.exec(html)?.[1] ?? /x1="([\d.]+)"[^>]*data-teil="kreuz-bisher"/.exec(html)?.[1]);
    expect(x).toBeCloseTo(4 + (900 / st.scaleMax) * 52, 1);
  });

  it('ohne Daten kein Bild', () => {
    expect(renderToStaticMarkup(React.createElement(KreuzKlein, { palette: LIGHT_PALETTE, st: { show: false } }))).toBe('');
  });

  it('Kachel ohne geladene Prämien zeigt kein erfundenes Kreuz', () => {
    const html = renderToStaticMarkup(React.createElement(InstrumentePanel, { palette: LIGHT_PALETTE, t, data: {}, onNavigate: () => {}, nur: ['tacho'] }));
    expect(html).not.toContain('data-kreuz="klein"');
    expect(html).toContain(t('instrumente.tacho'));
  });

  it('Wächter: kein fest gezeichnetes Mini-Kreuz mehr im Panel', () => {
    const code = fs.readFileSync(path.join(__dirname, '..', 'components', 'InstrumentePanel.jsx'), 'utf8');
    expect(code).not.toMatch(/miniKreuz\s*\(/);
    expect(code).toMatch(/kreuzState\(/);
  });
});
