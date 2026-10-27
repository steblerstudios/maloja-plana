import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LohnStandort, finanzWerte } from '../components/FinanzAuswertung.jsx';
import { DEMO_DATA } from '../config/demoData.js';

// F7-K2-6 (Sophie, 27.10.2026): 18 Branchen als Liste, für Maria zählt eine — die eigene hervorheben, Rest aufklappbar.
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(LohnStandort, { palette, t, data, w: finanzWerte(data, t), onNavigate: () => {} }));

describe('Branchenvergleich · eigene Branche', () => {
  it('Maria (Gesundheit): eigene Branche vorne, die übrigen 17 in einem aufklappbaren Teil', () => {
    const html = render(DEMO_DATA);
    expect(html).toContain('finanzUebersicht.eigeneBranche');
    expect(html).toContain('finanzUebersicht.andereBranchen(17)');
    const vorDetails = html.slice(0, html.indexOf('<details'));
    expect(vorDetails).toContain('branche.gesundheit');
    expect(vorDetails).not.toContain('branche.it');
  });

  it('ohne Branche: alle 18 aufklappbar und ein Hinweis aufs Kapitel', () => {
    const html = render({ ...DEMO_DATA, ausbildung: { ...DEMO_DATA.ausbildung, branche: '' } });
    expect(html).toContain('finanzUebersicht.brancheVergleichen(18)');
    expect(html).toContain('finanzUebersicht.brancheAngeben');
  });
});
