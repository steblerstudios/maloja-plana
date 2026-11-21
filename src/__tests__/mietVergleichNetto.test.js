// Der Miet-Balken vergleicht gegen die BFS-Nettomiete (ohne Nebenkosten, data/mietpreise.js).
// Bis 28.09.2026 füllte MietVergleich ihn mit Miete + Nebenkosten — «Ihre Miete: CHF 1830»
// unter einer Quelle «Nettomiete». Das Budget (BudgetSync) nahm schon immer nur die Nettomiete.
// Die Wohnkosten-Zeile darunter heisst «Wohnkosten» und zählt die Nebenkosten weiter mit.
// Seit 18.11.2026 (Bauplan Wohnen) ist der Balken das Vergleichshaus im Werkzeug (WohnenWerkzeug): Ihr Betrag steht
// darunter (strasse-betrag), die Lage als Hauptzahl — beides aus der Nettomiete.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { WohnenWerkzeug as MietVergleich, mieteLage, lageZurRegion, lageWert } from '../bereiche/wohnen/wohnen.js';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const person = (wohnen) => ({
  basis: { canton: 'ZH' },
  finanzen: { monthlyIncome: '6200' },
  wohnen,
});
const miete = (wohnen) => renderToStaticMarkup(React.createElement(MietVergleich, { palette, t, data: person(wohnen) }));

describe('MietVergleich: Nettomiete gegen Nettomiete', () => {
  it('das Vergleichshaus zeigt die Nettomiete, nicht Miete + Nebenkosten', () => {
    const html = miete({ rentAmount: '1650', utilities: '180' });
    expect(html).toMatch(/data-teil="strasse-betrag"[^>]*>strasse\.eigen: CHF 1’650</);
    expect(html).toMatch(/data-teil="wohnkosten-franken"[^>]*>wohnenInstrument\.titel: CHF 1’830</); // Wohnkosten zählen NK mit
    // die Lage rechnet ebenfalls mit der Nettomiete
    const { regional } = mieteLage(person({ rentAmount: '1650' })).vergleich;
    const netto = lageWert(lageZurRegion(1650, regional));
    expect(netto).not.toBe(lageWert(lageZurRegion(1830, regional)));
    expect(html).toMatch(new RegExp('data-instrument-zahl="miete"[^>]*>' + netto + '<'));
  });
  it('die Wohnkosten-Zeile zählt die Nebenkosten weiter mit (1830 / 6200 = 30 %)', () => {
    expect(miete({ rentAmount: '1650', utilities: '180' })).toMatch(/data-instrument-zahl="wohnkosten"[^>]*>30 %</);
  });
  it('nur Nebenkosten, keine Miete (z. B. Eigentum): kein Vergleichshaus, Wohnkosten-Zeile bleibt', () => {
    const html = miete({ rentAmount: '', utilities: '300' });
    expect(html).not.toContain('vergleichs-haus');
    expect(html).not.toContain('strasse-betrag');
    expect(html).toMatch(/data-instrument-zahl="wohnkosten"[^>]*>5 %</);
  });
  it('Gegenprobe: ohne Nebenkosten ändert sich nichts', () => {
    expect(miete({ rentAmount: '1650' })).toMatch(/data-teil="strasse-betrag"[^>]*>strasse\.eigen: CHF 1’650</);
  });
});
