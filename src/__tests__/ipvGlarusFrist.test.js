// K31 GL — nach der Antragsfrist (VV PV Art. 6 Abs. 1: 31. Januar des Anspruchsjahres) zieht keiner
// der drei Leser etwas ab, und alle nennen den Glarner Satz, nie den Luzerner (Fachprüfung #487,
// Blocker 1: das Budget zeigte «Prämienverbilligung Luzern … 31. Oktober 2025»).
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ, calculateIPV } from '../config/cantonalData.js';
import { calculateMonthlyBudget } from '../budgetSync.js';
import { praemienBelegState } from '../data/praemienBeleg.js';
import { ipvAbzug } from '../data/ipvAbzug.js';
import { KKLastCard } from '../KKLastCard.jsx';

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const kk = (data) => renderToStaticMarkup(React.createElement(KKLastCard, { palette, t, data, onNavigate: () => {} }));

// Allein, 2 000 netto/Monat, Prämie 500 → 3 287/Jahr, 274/Monat.
const person = () => ({
  basis: { canton: 'GL', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 2000 },
  wohnen: { postalCode: '8750', city: 'Glarus' },
  versicherungen: { kkPremium: 500 },
});
const am = (datum) => { vi.useFakeTimers(); vi.setSystemTime(new Date(datum)); };

beforeAll(async () => {
  preloadPLZ();
  await import('../config/ipvGlarus.js');
  await new Promise((r) => setTimeout(r, 0));
});
afterEach(() => vi.useRealTimers());

describe('Glarus, September 2026 — die Frist 31. Januar ist vorbei', () => {
  it('ipvAbzug: 0, Grund fristVorbei', () => {
    am('2026-09-28T12:00:00');
    expect(calculateIPV(person())).toMatchObject({ annual: 3287, anmeldefristVorbei: true });
    expect(ipvAbzug(person())).toMatchObject({ betrag: 0, grund: 'fristVorbei' });
  });
  it('🛑 Budget: nichts abgezogen, Hinweis mit dem Glarner Schlüssel — nicht dem Luzerner', () => {
    am('2026-09-28T12:00:00');
    const b = calculateMonthlyBudget(person(), t);
    expect(b.ipvRelief).toBe(0);
    expect(b.ipvAnmeldefristHinweisKey).toBe('ipv.glFristNichtAbgezogen');
    const texte = b.recommendations.map((r) => r.text).join(' ');
    expect(texte).toContain('ipv.glFristNichtAbgezogen');
    expect(texte).not.toContain('budget.ipvHintLuFristVorbei');
  });
  it('KK-Last-Karte: kein Abzug, der Glarner Hinweis', () => {
    am('2026-09-28T12:00:00');
    const html = kk(person());
    expect(html).not.toContain('kkLast.ipvRelief');
    expect(html).toContain('ipv.glFristNichtAbgezogen');
    expect(html).not.toContain('ipv.luFristNichtAbgezogen');
  });
  it('Prämien-Beleg: kein Abzug, Glarner Hinweis', () => {
    am('2026-09-28T12:00:00');
    expect(praemienBelegState(person())).toMatchObject({ mode: 'fristVorbei', verbilligung: 0, noteKey: 'ipv.glFristNichtAbgezogen' });
  });
});

describe('Glarus, Januar 2026 — die Frist läuft: Abzug wie gerechnet', () => {
  it('alle drei Leser ziehen 274 ab', () => {
    am('2026-01-15T12:00:00');
    expect(ipvAbzug(person())).toMatchObject({ betrag: 274, grund: 'geschaetzt' });
    expect(calculateMonthlyBudget(person(), t).ipvRelief).toBe(274);
    expect(praemienBelegState(person())).toMatchObject({ verbilligung: 274 });
  });
});
