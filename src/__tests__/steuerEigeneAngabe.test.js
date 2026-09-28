// Finanzübersicht: die Steuer-Karte schätzt (ESTV-Messpunkte), die Budget-Bilanz zieht die
// eigene Angabe `finanzen.monthlyTax` ab. Bis 28.09.2026 standen beide Zahlen ohne Bezug
// auf derselben Seite (Demo: ~8'431/J. geschätzt vs. 850/Mt. angegeben). Entscheid Stebler
// Studios 28.09. (Variante A): die Karte nennt beide — dort, wo geschätzt wird.
import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import FinanzUebersicht from '../FinanzUebersicht.jsx';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const person = ({ canton = 'ZH', monthlyTax = '850' } = {}) => ({
  basis: { canton },
  finanzen: { monthlyIncome: '6200', incomeType: 'netto', monthlyTax },
  wohnen: { rentAmount: '1650' },
});
const seite = (d) => renderToStaticMarkup(React.createElement(FinanzUebersicht, { palette, t, data: d, onNavigate: () => {} }));

beforeAll(() => { preloadPLZ(); });

describe('Steuer-Karte nennt die eigene Angabe neben der Schätzung', () => {
  it('mit Kantonsschätzung: Monatswert der Schätzung und eigene Angabe', () => {
    const html = seite(person());
    expect(html).toMatch(/finanzUebersicht\.taxMonthlyCompare\(CHF [\d’']+\|CHF 850\)/);
  });
  it('Schätzung ÷ 12, gerundet — derselbe Jahreswert wie im Status', () => {
    const html = seite(person());
    const jahr = Number(html.match(/~ CHF ([\d’']+) common\.perYear/)[1].replace(/[’']/g, ''));
    const monat = Number(html.match(/taxMonthlyCompare\(CHF ([\d’']+)\|/)[1].replace(/[’']/g, ''));
    expect(monat).toBe(Math.round(jahr / 12));
  });
  it('ohne eigene Angabe: kein Vergleich', () => {
    const html = seite(person({ monthlyTax: '' }));
    expect(html).not.toContain('taxMonthlyCompare');
    expect(html).not.toContain('taxOwnFigure');
  });
});
