// K31 TI — nach der Antragsfrist zieht keiner der drei Leser etwas ab (Fachprüfung #484, Blocker 1).
// LCAMal (RL 853.100) Art. 25 Abs. 3: Antrag nach dem 31.12. des Vorjahres ⇒ Verbilligung erst ab dem
// Folgemonat. Wie in LU (data/ipvAbzug.js): nach der Frist 0 abziehen, ausser eine Verfügung ist da —
// und der Hinweis nennt das Tessin, nicht Luzern (`fristNichtAbgezogenKey`).
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

// Angestellt, 3 000 netto/Monat, Prämie 450 → 3 341/Jahr, 278/Monat.
const person = (extra = {}) => ({
  basis: { canton: 'TI', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 3000, employmentType: 'employed' },
  wohnen: { postalCode: '6900', city: 'Lugano' },
  versicherungen: { kkPremium: 450 },
  ...extra,
});
const HINWEIS = 'ipv.tiFristNichtAbgezogen(2026|2025)';
const am = (datum) => { vi.useFakeTimers(); vi.setSystemTime(new Date(datum)); };

beforeAll(async () => {
  preloadPLZ();
  await import('../config/ipvTicino.js');
  await new Promise((r) => setTimeout(r, 0));
});
afterEach(() => vi.useRealTimers());

describe('Tessin, September 2026 — die Januar-Frist ist vorbei', () => {
  it('das Ergebnis trägt die Frist und den Tessiner Schlüssel', () => {
    am('2026-09-28T12:00:00');
    expect(calculateIPV(person())).toMatchObject({ annual: 3341, anmeldefristVorbei: true, fristNichtAbgezogenKey: 'ipv.tiFristNichtAbgezogen' });
  });
  it('ipvAbzug: 0, Grund fristVorbei', () => {
    am('2026-09-28T12:00:00');
    expect(ipvAbzug(person())).toEqual({ betrag: 0, grund: 'fristVorbei', frist: { jahr: 2026, vorjahr: 2025 } });
  });
  it('Budget: nichts abgezogen, Hinweis mit Tessiner Schlüssel', () => {
    am('2026-09-28T12:00:00');
    const b = calculateMonthlyBudget(person(), t);
    expect(b.ipvRelief).toBe(0);
    expect(b.ipvAnmeldefristVorbei).toEqual({ jahr: 2026, vorjahr: 2025 });
    expect(b.ipvAnmeldefristHinweisKey).toBe('ipv.tiFristNichtAbgezogen');
  });
  it('KK-Last-Karte: kein Abzug, der Tessiner Hinweis — nicht der Luzerner', () => {
    am('2026-09-28T12:00:00');
    const html = kk(person());
    expect(html).not.toContain('kkLast.ipvRelief');
    expect(html).toContain(HINWEIS);
    expect(html).not.toContain('ipv.luFristNichtAbgezogen');
  });
  it('Prämien-Beleg: kein Abzug, Prämie ganz selbst, Tessiner Hinweis', () => {
    am('2026-09-28T12:00:00');
    expect(praemienBelegState(person())).toMatchObject({ mode: 'fristVorbei', verbilligung: 0, selbst: 450, noteKey: 'ipv.tiFristNichtAbgezogen' });
  });
});

describe('Tessin, Dezember 2025 — die Frist läuft: Abzug wie gerechnet', () => {
  it('alle drei Leser ziehen 278 ab', () => {
    am('2025-12-15T12:00:00');
    expect(ipvAbzug(person())).toMatchObject({ betrag: 278, grund: 'geschaetzt' });
    expect(calculateMonthlyBudget(person(), t).ipvRelief).toBe(278);
    expect(praemienBelegState(person())).toMatchObject({ verbilligung: 278 });
    expect(kk(person())).toContain('kkLast.ipvRelief(278|');
  });
});

describe('Verfügung eingetragen: der bestätigte Betrag gilt auch nach der Frist', () => {
  it('Budget und Beleg nehmen die Verfügung', () => {
    am('2026-09-28T12:00:00');
    const d = person({ anspruch: { ipv: { status: 'bestaetigt', betrag: 90, datum: '2026-09-01', kanton: 'TI', jahr: 2026 } } });
    expect(calculateMonthlyBudget(d, t).ipvRelief).toBe(90);
    expect(praemienBelegState(d)).toMatchObject({ verbilligung: 90, confirmed: true });
  });
});
