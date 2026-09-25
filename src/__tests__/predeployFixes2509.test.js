import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { QuickCheck } from '../components/Leistungsliste.jsx';
import { franchiseVorschlag } from '../data/franchiseTacho.js';

// ─────────────────────────────────────────────────────────────
// Predeploy-Prüfung 25.09.2026 (Fachlogik + Recht, 22 PRs #369–#391): die Befunde als Tests.
// ─────────────────────────────────────────────────────────────
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(QuickCheck, { palette, t, onNavigate: () => {}, data }));

describe('Freibetrag-Fall: offen statt «keine Aufstockung nötig»', () => {
  // Beispiel der Fachprüfung: BE, allein, Miete 1300, KK 400, netto 2650.
  const p = { basis: { canton: 'BE', household: { adults: 1, children: [] } }, finanzen: { monthlyIncome: 2650, incomeType: 'netto', employmentType: 'employed' }, wohnen: { rentAmount: 1300 }, versicherungen: { kkPremium: 400 } };
  it('Voraussetzung: ohne Freibetrag gedeckt, mit Freibetrag möglich', () => {
    const sh = calculateSozialhilfe(p);
    expect(sh.eligible).toBe(false);
    expect(sh.efbEntscheidet).toBe(true);
  });
  it('die Dashboard-Liste sagt den offenen Satz, nicht «gedeckt»', () => {
    const html = render(p);
    expect(html).toContain('sozialhilfe.efbEntscheidet');
    expect(html).not.toContain('pegel.covered');
  });
});

describe('EL in der Dashboard-Liste (wie im Schnellcheck)', () => {
  const rentner = (extra = {}) => ({ basis: { canton: 'BE', household: { adults: 1, children: [] } }, finanzen: { monthlyIncome: 0, incomeType: 'netto', ahvRente: 1600, ...extra }, wohnen: { rentAmount: 1300 }, versicherungen: { kkPremium: 400 } });
  it('mit AHV-Rente, die nicht reicht: EL-Zeile, zum EL-Rechner', () => {
    const html = render(rentner());
    expect(html).toContain('schnellcheck.el');
  });
  it('ohne Rente: keine EL-Zeile', () => {
    const p = rentner(); delete p.finanzen.ahvRente;
    expect(render(p)).not.toContain('schnellcheck.el');
  });
});

describe('Franchise-Vorschlag: erst mit Hochrechnung, Polster auch bei «passt»', () => {
  const opt = { lowFra: 300, highFra: 2500, annualSaving: 1400, reserve: 3200, sbMax: 700, breakEven: 1700, lowPremium: 450, highPremium: 450 - 1400 / 12 };
  it('vor Tag 60: keine Einschätzung (sonst kippt es fast immer zur hohen Franchise)', () => {
    expect(franchiseVorschlag(opt, { costs: 200, eigeneFranchise: 300, heute: new Date(2026, 1, 20) }).art).toBe('offen');
  });
  it('«passt» mit zu kleinem Polster sagt es dazu', () => {
    const v = franchiseVorschlag(opt, { costs: 400, eigeneFranchise: 2500, ersparnisse: 1000, heute: new Date(2026, 8, 25) });
    expect(v).toEqual({ art: 'passt', franchise: 2500, polster: true });
  });
});
