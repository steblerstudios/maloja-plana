// Schulden R2, Fix-Welle Teil 1 (Punkt 21): ein als Forderung übernommener Arztbeleg steht
// nicht zugleich als «noch offene Gesundheitskosten» in der Finanzübersicht (sonst derselbe Betrag zweimal).
import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import FinanzUebersicht from '../FinanzUebersicht.jsx';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const seite = (d) => renderToStaticMarkup(React.createElement(FinanzUebersicht, { palette, t, data: d, onNavigate: () => {} }));
const jahr = String(new Date().getFullYear());

const mit = (kkBelege) => ({
  basis: { canton: 'ZH', maritalStatus: 'single', household: { adultsList: [{ name: 'P' }] } },
  finanzen: { monthlyIncome: '6200', incomeType: 'netto', groceries: '700' },
  wohnen: { rentAmount: '1800', mortgagePayment: '' },
  versicherungen: { kkPremium: '385', kkBelege },
});

beforeAll(() => { preloadPLZ(); });

describe('Finanzübersicht: offene Gesundheitskosten ohne übernommene Belege', () => {
  it('offener Beleg ohne Forderung zählt als «noch offen»', () => {
    const html = seite(mit([{ id: 'a', datum: jahr + '-03-01', betrag: 400, status: 'offen' }]));
    expect(html).toContain('finanzUebersicht.healthCostsOpen');
  });
  it('offener Beleg mit forderungId zählt nicht (steht als Forderung im Schuldenmanager)', () => {
    const html = seite(mit([{ id: 'a', datum: jahr + '-03-01', betrag: 400, status: 'offen', forderungId: '7' }]));
    expect(html).not.toContain('finanzUebersicht.healthCostsOpen');
  });
  it('gemischt: nur der nicht übernommene Betrag bleibt in der Summe', () => {
    const html = seite(mit([
      { id: 'a', datum: jahr + '-03-01', betrag: 400, status: 'offen' },
      { id: 'b', datum: jahr + '-03-02', betrag: 90, status: 'offen', forderungId: '7' },
    ]));
    expect(html).toMatch(/healthCostsOpen\([^)]*400[^)]*\)/);
    expect(html).not.toMatch(/healthCostsOpen\([^)]*490/);
  });
});
