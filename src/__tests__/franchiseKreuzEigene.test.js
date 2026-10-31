import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { kreuzState, franchiseOptimierer } from '../data/franchiseTacho.js';
import { FranchiseKreuz } from '../components/FranchiseKreuz.jsx';

// F7-K3-3 (Sophie, 27.10.2026): Das Franchise-Kreuz verglich nur 300 und 2’500; Marias eigene Franchise 1’500
// kam im Bild nicht vor. Jetzt als dritte Linie — mit der Prämie derselben Kasse und desselben Jahres.
const fras = [300, 500, 1000, 1500, 2000, 2500].map((f, i) => ({ franchise: f, premium: 560 - i * 30 }));
const opt = franchiseOptimierer(fras, 'erwachsen');
const heute = new Date(2026, 9, 27);

describe('Franchise-Kreuz · eigene Franchise', () => {
  it('der Optimierer gibt alle Stufen mit', () => {
    expect(opt.alle).toHaveLength(6);
  });

  it('eigene Franchise 1’500: dritte Kurve mit der Tabellen-Prämie 470', () => {
    const st = kreuzState(opt, 420, heute, 1500);
    expect(st.eigeneFra).toBe(1500);
    expect(st.kurve[0].eigen).toBe(470 * 12);
    expect(st.gesamtBei(0).eigen).toBe(470 * 12);
  });

  it('keine dritte Linie, wenn die eigene Franchise ein Ende ist oder fehlt', () => {
    expect(kreuzState(opt, 420, heute, 2500).eigeneFra).toBeNull();
    expect(kreuzState(opt, 420, heute, null).eigeneFra).toBeNull();
    expect(kreuzState(opt, 420, heute, 1200).eigeneFra).toBeNull();
  });

  it('gezeichnet mit Legende und im aria-Label', () => {
    const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
    const t = (k) => k;
    const html = renderToStaticMarkup(React.createElement(FranchiseKreuz, { palette, t, franchiseOpt: opt, costs: 420, heute, eigeneFranchise: 1500 }));
    expect(html).toContain('po.kreuzLegendEigen');
    expect(html).toContain('po.kreuzAriaEigen');
    expect((html.match(/<polyline/g) || []).length).toBe(3);
  });
});
