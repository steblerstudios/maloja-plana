import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { bruttoZuNettoRichtwert } from '../data/ahvRechner.js';
import { sozialhilfePegelState } from '../data/pegel.js';
import { anspruchSignale } from '../data/anspruchSignale.js';
import { QuickCheck } from '../components/Leistungsliste.jsx';
import { zahl } from '../utils/geld.js';

// ─────────────────────────────────────────────────────────────
// Predeploy-Prüfung 25.09.2026, Punkt 6: «brutto» im Profil. Vorher nahm calculateSozialhilfe den
// Monatslohn roh als netto; das Dashboard rechnete schon um → auf derselben Profilgrundlage sagte
// das Dashboard «Anspruch möglich», Sozialhilfe-Seite/Finanz-Übersicht/Budget/Lebensbaum «reicht aus».
// Beispiel der Fachprüfung: BE, allein, 40 Jahre, Miete 1300, Prämie 400, 2700 brutto.
// ─────────────────────────────────────────────────────────────
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);

const profil = (incomeType) => ({
  basis: { canton: 'BE', dateOfBirth: '1986-03-01', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 2700, incomeType, employmentType: 'employed' },
  wohnen: { rentAmount: 1300 },
  versicherungen: { kkPremium: 400 },
});

describe('Sozialhilfe: brutto im Profil wird wie auf dem Dashboard umgerechnet', () => {
  it('rechnet mit dem Netto-Richtwert und sagt, dass er geschätzt ist', () => {
    const sh = calculateSozialhilfe(profil('brutto'));
    expect(sh.income).toBe(bruttoZuNettoRichtwert(2700, 40, false));
    expect(sh.einkommenGeschaetzt).toBe(true);
  });
  it('netto bleibt netto (unverändert)', () => {
    const sh = calculateSozialhilfe(profil('netto'));
    expect(sh.income).toBe(2700);
    expect(sh.einkommenGeschaetzt).toBe(false);
  });
  it('alle Leser sagen dasselbe: Rechnung, Pegel, Lebensbaum und Dashboard', () => {
    const p = profil('brutto');
    const sh = calculateSozialhilfe(p);
    expect(sh.eligible).toBe(true);                                   // 2700 brutto ≈ 2502 netto < Bedarf
    expect(sozialhilfePegelState(p).mode).toBe('gap');
    expect(anspruchSignale(p).behoerden || []).toContainEqual({ key: 'sozialhilfe', view: 'sozialhilfe' });
    const html = renderToStaticMarkup(React.createElement(QuickCheck, { palette, t, onNavigate: () => {}, data: p }));
    expect(html).toContain('dashboard.anspruchMoeglich');
  });
  it('das Dashboard rechnet nicht doppelt um (Probe trägt incomeType netto)', () => {
    const p = profil('brutto');
    const html = renderToStaticMarkup(React.createElement(QuickCheck, { palette, t, onNavigate: () => {}, data: p }));
    const netto = bruttoZuNettoRichtwert(2700, 40, false);
    expect(html).toContain('einkommensfeld.nettoGeschaetzt(' + zahl(netto) + ')');
    // derselbe Betrag wie die Sozialhilfe-Rechnung — bei doppelter Umrechnung wäre er grösser
    expect(html).toContain('≈ CHF ' + zahl(calculateSozialhilfe(p).deficit, { hoechstens: 2 }) + ' / schnellcheck.monat');
  });
});
