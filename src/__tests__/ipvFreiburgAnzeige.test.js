import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import { KKLastCard } from '../KKLastCard.jsx';
import { PraemienBeleg } from '../components/PraemienBeleg.jsx';
import { praemienBelegState } from '../data/praemienBeleg.js';
import { calculateMonthlyBudget } from '../budgetSync.js';
import { ipvAbzug } from '../data/ipvAbzug.js';

// K31 — der IPV-Rechner zeigt für FR den Betrag nach dem Stufenmodell der ORP (RSF 842.1.13).
// Was hier sichtbar sein muss:
//   1. ein Betrag nur MIT erfasster Prämie (Art. 6 al. 4 ORP: höchstens die Nettoprämie).
//   2. die Einkommensgrenze des Haushalts — Freiburg publiziert sie als Zahl (Mémento Ziff. 1) —,
//      aber keine alten Musterwerte (48 000 / 2 400).
//   3. Prämienregion und Vorbehalt mit dem Basisjahr 2024 (Art. 5 al. 1: «année x – 2 ans»).
//   4. die Antragsfrist 31. August des Anspruchsjahres (Art. 2 al. 1) — und danach wird der
//      Betrag nirgends abgezogen, mit dem FREIBURGER Hinweis, nicht dem Luzerner.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));
const kk = (data) => renderToStaticMarkup(React.createElement(KKLastCard, { palette, t, data, onNavigate: () => {} }));
const beleg = (data) => renderToStaticMarkup(React.createElement(PraemienBeleg, { palette, t, state: praemienBelegState(data) }));
const am = (datum) => { vi.useFakeTimers(); vi.setSystemTime(new Date(datum)); };

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'FR', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: extra.plz || '1700', city: extra.city ?? 'Fribourg', rentAmount: 1200 },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 450 },
});

describe('K31 IPV-Rechner, Kanton Freiburg', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../data/plzGemeinde.js');
    await import('../config/ipvFreiburg.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => vi.useRealTimers());

  it('zeigt den Betrag: 20 000 im Jahr, Stadt Freiburg → 3 401/Jahr, 283/Monat', () => {
    const html = render(profil(20000 / 12));
    expect(html).toContain('premium.eligible');
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).toContain('CHF 3’401');
    expect(html).toContain('CHF 283');
  });

  it('ohne erfasste Prämie: keine Zahl, sondern der Grund', () => {
    const html = render(profil(20000 / 12, { kkPremium: null }));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.offenGrund.praemie');
    expect(html).not.toContain('CHF 3’401');
  });

  it('nennt die publizierte Grenze des Haushalts, nicht die Musterwerte', () => {
    expect(render(profil(2000))).toContain('premium.maxIncome(' + geldZahl(37000));
    expect(render(profil(2000, { children: [{ age: 5 }] }))).toContain('premium.maxIncome(' + geldZahl(57400));
    const html = render(profil(2000));
    for (const zahl of [48000, 2400]) expect(html).not.toContain(geldZahl(zahl) + ')');
  });

  it('Prämienregion und der Freiburger Vorbehalt mit Basisjahr 2024', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.jahrRegion(2026|1)');
    expect(html).toContain('ipv.vorbehaltFR(2026|2024)');
    expect(render(profil(2000, { plz: '1630', city: 'Bulle' }))).toContain('ipv.jahrRegion(2026|2)');
  });

  it('die Antragsfrist steht beim Betrag', () => {
    am('2026-08-15T12:00:00');
    expect(render(profil(2000))).toContain('ipv.frFristLaeuft(2026|2027)');
    am('2026-09-28T12:00:00');
    expect(render(profil(2000))).toContain('ipv.frFristVorbei(2026|2027)');
  });

  it('über der Grenze: eigener Satz mit der Grenze', () => {
    expect(render(profil(37000 / 12))).toContain('ipv.frKeinAnspruch(' + 37000 + ')');
  });

  it('Paare, Kinder ohne Alter und unbekannte PLZ: Orientierung mit Grund statt Zahl', () => {
    const paar = render({ ...profil(2000), basis: { ...profil(2000).basis, maritalStatus: 'married' } });
    expect(paar).toContain('ipv.orientierungOffen');
    expect(render(profil(2000, { children: [{ age: 0 }] }))).toContain('ipv.orientierungOffen');
    expect(render(profil(2000, { plz: '0000', city: 'Nirgendwo' }))).toContain('ipv.orientierungOffen');
  });

  it('kein roher Schlüssel bleibt stehen: alle FR-Texte in allen fünf Sprachen', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['vorbehaltFR', 'frKeinAnspruch', 'frFristLaeuft', 'frFristVorbei', 'frFristNichtAbgezogen']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
        expect(texte.ipv[k], `${sprache}: 31. August`).toMatch(/31|\{value\}|\{basisjahr\}/);
      }
      expect(texte.ipv.vorbehaltFR).toContain('{basisjahr}');
      expect(texte.ipv.frKeinAnspruch).toContain('{value}');
      for (const k of ['frFristLaeuft', 'frFristVorbei', 'frFristNichtAbgezogen']) expect(texte.ipv[k]).toContain('{jahr}');
      expect(texte.ipv.frFristVorbei).toContain('{folgejahr}');
    }
  });
});

describe('K31 FR nach der Antragsfrist: nirgends abgezogen, Freiburger Hinweis in allen drei Lesern', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../data/plzGemeinde.js');
    await import('../config/ipvFreiburg.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => vi.useRealTimers());

  it('Abzug 0, Grund fristVorbei', () => {
    am('2026-09-28T12:00:00');
    expect(ipvAbzug(profil(20000 / 12))).toEqual({ betrag: 0, grund: 'fristVorbei', frist: { jahr: 2026, vorjahr: 2025 } });
  });
  it('KK-Last-Karte und Prämien-Beleg: der Freiburger Text, nicht der Luzerner', () => {
    am('2026-09-28T12:00:00');
    const karte = kk(profil(20000 / 12));
    expect(karte).toContain('ipv.frFristNichtAbgezogen(2026|2025)');
    expect(karte).not.toContain('ipv.luFristNichtAbgezogen');
    expect(karte).not.toContain('kkLast.ipvRelief');
    expect(praemienBelegState(profil(20000 / 12))).toMatchObject({ mode: 'fristVorbei', verbilligung: 0, noteKey: 'ipv.frFristNichtAbgezogen' });
    expect(beleg(profil(20000 / 12))).not.toContain('ipv.luFristNichtAbgezogen');
  });
  it('Budget: nichts abgezogen, der Freiburger Hinweis', () => {
    am('2026-09-28T12:00:00');
    const b = calculateMonthlyBudget(profil(20000 / 12), t);
    expect(b.ipvRelief).toBe(0);
    expect(b.ipvAnmeldefristHinweisKey).toBe('ipv.frFristNichtAbgezogen');
  });
  it('vor der Frist: der geschätzte Betrag wird abgezogen', () => {
    am('2026-08-15T12:00:00');
    expect(ipvAbzug(profil(20000 / 12))).toMatchObject({ betrag: 283, grund: 'geschaetzt' });
    expect(kk(profil(20000 / 12))).toContain('kkLast.ipvRelief(283|');
  });
});
