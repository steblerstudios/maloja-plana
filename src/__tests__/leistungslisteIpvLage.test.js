import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { QuickCheck } from '../components/Leistungsliste.jsx';
import { DEMO_DATA } from '../config/demoData.js';
import { ladeIPVModelle } from '../config/cantonalData.js';

// F7-K2-4 (Sophie, 27.10.2026): Dashboard und Kapitel Finanzen sagen aus denselben Daten dasselbe zur IPV.
// Vorher: Kapitel «Einkommen über Grenze (CHF 61’090)», Dashboard «Hängt von Kanton und Einkommen ab».
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(QuickCheck, { palette, t, onNavigate: () => {}, data }));

describe('Leistungsliste · IPV ohne Anspruch', () => {
  // Die Kantonsmodelle laden nach (cantonalData.js IPV_MODULE); im Browser sind sie da, wenn die Liste rechnet.
  beforeAll(() => ladeIPVModelle());
  it('Maria (ZH, CHF 6’200 netto): die Grenze wie im Kapitel, nicht der allgemeine Untertitel', () => {
    const html = render(DEMO_DATA);
    expect(html).toMatch(/ipv\.incomeAboveLimit\(\d+\)/);
    expect(html).not.toContain('dashboard.highlightIpvSub');
  });

  it('ohne Kanton bleibt der allgemeine Untertitel', () => {
    const html = render({ ...DEMO_DATA, basis: { ...DEMO_DATA.basis, canton: '' } });
    expect(html).toContain('dashboard.highlightIpvSub');
  });
});
