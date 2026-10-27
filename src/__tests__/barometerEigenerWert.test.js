import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { RegionalBarometer } from '../components/RegionalBarometer.jsx';

// Fassung 7 · F7-K1-1 (Sophie, 27.10.2026): Unter «Ihre Miete: CHF 1’650» stand «rund 20 % über dem
// Schweizer Schnitt». Die 20 % waren Region gegen Schweiz (1’732 zu 1’446), Marias Miete lag aber unter
// dem Schnitt ihrer Region. Jetzt sagt der erste Satz, wo der EIGENE Wert zur Region liegt.
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const vergleich = { regional: 1732, national: 1446, diffPct: 19.8, year: 2024 };
const render = (props) => renderToStaticMarkup(React.createElement(RegionalBarometer, { palette, t, comparison: vergleich, kind: 'rent', ...props }));

describe('Barometer: eigener Wert gegen Region', () => {
  it('Maria: Miete 1’650 liegt rund 5 % unter der Region, die Region rund 20 % über der Schweiz', () => {
    const html = render({ userValue: 1650 });
    expect(html).toContain('po.regionalCompare.rent.userBelow(5)');
    expect(html).toContain('po.regionalCompare.regionAbove(20)');
    expect(html.indexOf('userBelow')).toBeLessThan(html.indexOf('regionAbove'));
  });

  it('über der Region', () => {
    expect(render({ userValue: 2100 })).toContain('po.regionalCompare.rent.userAbove(21)');
  });

  it('innerhalb von ±2 % gilt als «etwa im Schnitt», wie die Farbe des Punkts', () => {
    expect(render({ userValue: 1750 })).toContain('po.regionalCompare.rent.userEqual');
  });

  it('ohne eigenen Wert nur die Region gegen die Schweiz', () => {
    const html = render({});
    expect(html).not.toContain('userBelow');
    expect(html).toContain('po.regionalCompare.regionAbove(20)');
  });

  it('Prämie nutzt die Prämien-Sätze', () => {
    expect(render({ kind: 'premium', userValue: 1650 })).toContain('po.regionalCompare.premium.userBelow(5)');
  });
});
