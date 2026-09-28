// Der Miet-Balken vergleicht gegen die BFS-Nettomiete (ohne Nebenkosten, data/mietpreise.js).
// Bis 28.09.2026 füllte MietVergleich ihn mit Miete + Nebenkosten — «Ihre Miete: CHF 1830»
// unter einer Quelle «Nettomiete». Das Budget (BudgetSync) nahm schon immer nur die Nettomiete.
// Die Wohnkosten-Zeile darunter heisst «Wohnkosten» und zählt die Nebenkosten weiter mit.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MietVergleich } from '../components/MietVergleich.jsx';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const person = (wohnen) => ({
  basis: { canton: 'ZH' },
  finanzen: { monthlyIncome: '6200' },
  wohnen,
});
const miete = (wohnen) => renderToStaticMarkup(React.createElement(MietVergleich, { palette, t, data: person(wohnen) }));

describe('MietVergleich: Nettomiete gegen Nettomiete', () => {
  it('der Balken zeigt die Nettomiete, nicht Miete + Nebenkosten', () => {
    const html = miete({ rentAmount: '1650', utilities: '180' });
    expect(html).toContain('po.regionalCompare.rent.yourVal(1650)');
    expect(html).not.toContain('yourVal(1830)');
  });
  it('die Wohnkosten-Zeile zählt die Nebenkosten weiter mit (1830 / 6200 = 30 %)', () => {
    expect(miete({ rentAmount: '1650', utilities: '180' })).toContain('mietzinsView.rentShare(30)');
  });
  it('nur Nebenkosten, keine Miete (z. B. Eigentum): kein Miet-Balken, Wohnkosten-Zeile bleibt', () => {
    const html = miete({ rentAmount: '', utilities: '300' });
    expect(html).not.toContain('yourVal');
    expect(html).toContain('mietzinsView.rentShare(5)');
  });
  it('Gegenprobe: ohne Nebenkosten ändert sich nichts', () => {
    expect(miete({ rentAmount: '1650' })).toContain('po.regionalCompare.rent.yourVal(1650)');
  });
});
