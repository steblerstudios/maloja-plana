import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateIPV, calculateSozialhilfe } from '../config/cantonalData.js';
import { kantoneBelegtSimulieren } from '../config/__tests__/ipvBelegtSimulieren.js';
import { QuickCheck } from '../Dashboard.jsx';
import { zahl } from '../utils/geld.js';

// ─────────────────────────────────────────────────────────────
// Leistungsliste auf dem Dashboard (25.09.2026): Schnell-Check und Leistungen sind
// eine Liste. Zwei Regeln, die sonst nur als Kommentar stünden:
//  1. Greift Sozialhilfe, zählt die IPV NICHT zusätzlich zum Total — sie wird
//     angerechnet (BS GKV § 17 Abs. 3), wie im vollen Schnellcheck. Bis 25.09.
//     zählte das Dashboard beide zusammen.
//  2. Die IPV-Zeile sagt dann «angerechnet» (schnellcheck.ipvSubsumed), nie
//     «kein Anspruch»; die Sozialhilfe-Zeile sagt ohne Aufstockung etwas Sachliches
//     (pegel.covered) statt eines Nein-Satzes.
// ─────────────────────────────────────────────────────────────

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (props) => renderToStaticMarkup(React.createElement(QuickCheck, { palette, t, onNavigate: () => {}, ...props }));
// Dieselbe Formatierung wie die Anzeige (Schweizer Tausender-Apostroph ’).
const betrag = (n) => '≈ CHF ' + zahl(n, { hoechstens: 2 });

const profil = (monthlyIncome) => ({
  basis: { canton: 'BS', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome },
  wohnen: { rentAmount: 1000 },
  versicherungen: { kkPremium: 450 },
});

describe('Dashboard-Leistungsliste · IPV und Sozialhilfe', () => {
  let zuruecksetzen;
  beforeAll(() => { zuruecksetzen = kantoneBelegtSimulieren(['BS']); });
  afterAll(() => zuruecksetzen());

  it('Voraussetzung: bei 1000/Monat greifen beide', () => {
    expect(calculateIPV(profil(1000)).eligible).toBe(true);
    expect(calculateSozialhilfe(profil(1000)).eligible).toBe(true);
  });

  it('das Total ist die Sozialhilfe allein, die IPV-Zeile sagt «angerechnet»', () => {
    const html = render({ data: profil(1000) });
    const soz = calculateSozialhilfe(profil(1000)).deficit;
    const ipv = calculateIPV(profil(1000)).amount;
    expect(html).toContain(betrag(soz) + ' / schnellcheck.monat');
    expect(html).not.toContain(betrag(soz + ipv));
    expect(html).toContain('schnellcheck.ipvSubsumed');
    expect(html).not.toContain('dashboard.quickCheckNoResult');
  });

  it('ohne Aufstockung: sachlicher Satz und Pegel, kein Nein-Satz', () => {
    const html = render({ data: profil(6000) });
    expect(calculateSozialhilfe(profil(6000)).eligible).toBe(false);
    expect(html).toContain('pegel.covered');
    expect(html).toContain('pegel.bedarf');
    expect(html).not.toContain('dashboard.quickCheckNoResult');
    expect(html).not.toContain('sozialhilfeCalc.notEntitled');
  });
});
