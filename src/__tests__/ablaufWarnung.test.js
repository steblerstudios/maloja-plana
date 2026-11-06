import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { LIGHT_PALETTE } from '../config/constants.js';
import { Icons } from '../IconSystem.jsx';
import { AblaufWarnung } from '../AblaufSchale.jsx';

// Icon-Plan November 2026, Schritt 1 (docs/ICON-PLAN-2026-11.md): Ein Warnsatz in einem Ablauf
// trägt immer das Warn-Zeichen. Vorher hatten KVG- und Zusatz-Wechsel es, Vorsorgeauftrag
// (ZGB Art. 361), Wohnung gekündigt (OR Art. 272a) und Wegzug im selben Stil nicht.
// Das Zeichen gehört der Komponente, nicht der Aufrufstelle (ICON_KONVENTION.md).

const SRC = resolve(__dirname, '..');
// Ohne Strichstärke verglichen: `Icon` darf sie an die Grösse anpassen (Icon-Plan, Schritt 4),
// geprüft wird das Zeichen, nicht die Zahl.
const ohneStrich = (html) => html.replace(/ stroke-width="[\d.]+"/g, '');
const warnZeichen = ohneStrich(renderToStaticMarkup(React.createElement(Icons.warning)).replace(/^<svg[^>]*>/, ''));

describe('AblaufWarnung', () => {
  it('zeigt das Warn-Zeichen vor dem Text', () => {
    const html = ohneStrich(renderToStaticMarkup(React.createElement(AblaufWarnung, { palette: LIGHT_PALETTE }, 'Achtung, Form')));
    expect(html).toContain(warnZeichen);
    expect(html.indexOf(warnZeichen)).toBeLessThan(html.indexOf('Achtung, Form'));
  });

  it('das Zeichen ist für Screenreader verborgen, der Text bleibt lesbar', () => {
    const html = renderToStaticMarkup(React.createElement(AblaufWarnung, { palette: LIGHT_PALETTE }, 'Achtung, Form'));
    expect(html).toMatch(/aria-hidden="true"/);
    expect(html).toContain('Achtung, Form');
  });
});

describe('Ablauf-Seiten nehmen für Warnsätze AblaufWarnung', () => {
  const nutzer = readdirSync(SRC)
    .filter((f) => f.endsWith('.jsx'))
    .map((f) => [f, readFileSync(resolve(SRC, f), 'utf8')])
    .filter(([f, txt]) => f !== 'AblaufSchale.jsx' && /\bablaufStyles\b/.test(txt));

  it('findet die Ablauf-Seiten überhaupt (sonst prüft der Wächter die leere Menge)', () => {
    expect(nutzer.length).toBeGreaterThan(20);
  });

  it.each(['Vorsorgeauftrag.jsx', 'Wegzug.jsx', 'WohnungGekuendigt.jsx'])('%s ist unter den geprüften Seiten', (datei) => {
    expect(nutzer.map(([f]) => f)).toContain(datei);
  });

  it('keine Ablauf-Seite setzt den Warn-Stil von Hand', () => {
    const vonHand = nutzer.filter(([, txt]) => /style:\s*s\.warn\b/.test(txt)).map(([f]) => f);
    expect(vonHand).toEqual([]);
  });
});
