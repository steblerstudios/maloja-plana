// Geldfluss (Sankey) löst am 24.10.2026 das Kuchendiagramm in Charts ab.
// Gehalten wird: beide Seiten sind gleich breit (nichts verschwindet, nichts kommt dazu),
// ein Fehlbetrag steht als «Nicht gedeckt» links statt still unterzugehen, und die
// Beschriftungen überlappen sich nicht, auch bei vielen kleinen Posten.
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChartsAdvanced, geldflussLayout } from '../ChartsAdvanced.jsx';
import { DEMO_DATA } from '../config/demoData.js';
import de from '../i18n/de.js';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, params) => {
  const w = k.split('.').reduce((o, teil) => (o && typeof o === 'object' ? o[teil] : undefined), de);
  const s = typeof w === 'string' ? w : (w && w.sie) || k;
  return params ? s.replace(/\{(\w+)\}/g, (_, p) => params[p]) : s;
};
const zeichne = (data) => renderToStaticMarkup(React.createElement(ChartsAdvanced, { palette, t, data }));
// Nur das Geldfluss-Bild — «Rest/Sparen» steht auch in der Zusammenfassung oben.
const bild = (html) => html.match(/<svg viewBox="0 0 560[\s\S]*?<\/svg>/)[0];
const summeHoehe = (knoten) => knoten.reduce((a, k) => a + k.h, 0);

describe('Geldfluss in Charts', () => {
  it('Beispiel Maria: Geldfluss statt Kuchen, mit Beschreibung für Screenreader', () => {
    const html = zeichne(DEMO_DATA);
    expect(html).toContain(de.charts.flowTitle);
    expect(html).toContain('role="img"');
    expect(html).toContain('Pro Monat kommen CHF');
    expect(html).not.toContain(de.budgetSync.expensesOverview);
  });

  it('Überschuss: rechts steht der Rest, links kein «Nicht gedeckt»', () => {
    const svg = bild(zeichne({ finanzen: { monthlyIncome: '5000', groceries: '400' } }));
    expect(svg).toContain(de.budgetSync.remaining);
    expect(svg).not.toContain(de.charts.flowUncovered);
  });

  it('Fehlbetrag: links steht «Nicht gedeckt», rechts kein Rest', () => {
    const svg = bild(zeichne({ finanzen: { monthlyIncome: '2000', groceries: '500' }, wohnen: { rentAmount: '1800' } }));
    expect(svg).toContain(de.charts.flowUncovered);
    expect(svg).not.toContain(de.budgetSync.remaining);
  });

  it('beide Seiten und die Mitte sind gleich breit', () => {
    const lage = geldflussLayout(
      [{ label: 'a', value: 3000 }, { label: 'b', value: 500 }],
      [{ label: 'x', value: 1500 }, { label: 'y', value: 1200 }, { label: 'z', value: 800 }],
    );
    expect(summeHoehe(lage.links)).toBeCloseTo(lage.mitte.h, 6);
    expect(summeHoehe(lage.rechts)).toBeCloseTo(lage.mitte.h, 6);
  });

  it('Beschriftungen halten Abstand, auch bei vielen kleinen Posten', () => {
    const ziele = [{ label: 'gross', value: 5000 }].concat(Array.from({ length: 9 }, (_, i) => ({ label: 'k' + i, value: 5 })));
    const lage = geldflussLayout([{ label: 'q', value: 5045 }], ziele);
    for (let i = 1; i < lage.rechts.length; i++) {
      expect(lage.rechts[i].marke - lage.rechts[i - 1].marke).toBeGreaterThanOrEqual(15);
    }
    expect(lage.hoehe).toBeGreaterThanOrEqual(lage.rechts[lage.rechts.length - 1].marke);
  });

  it('nichts zu zeigen: kein Layout', () => {
    expect(geldflussLayout([], [])).toBeNull();
  });
});
