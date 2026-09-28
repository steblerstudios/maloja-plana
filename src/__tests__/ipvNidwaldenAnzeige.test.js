import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import { KKLastCard } from '../KKLastCard.jsx';

// K31 — der IPV-Rechner zeigt für OW den Betrag nach GDB 851.12 / 851.11.
// Was hier sichtbar sein muss:
//   1. ein Betrag nur MIT erfasster Prämie (EG KVG Art. 2 Abs. 5 deckelt auf die Prämie).
//   2. die publizierte Grenze (50 000 bzw. 75 000 anrechenbares Einkommen), keine Musterwerte.
//   3. KEINE Prämienregion und nicht der Aargauer Satz, sondern `ipv.jahrNW`; Basisjahr 2024.
//   4. die Antragsfrist 31. Mai (EV Art. 10) — und nach der Frist nennt die KK-Karte Nidwalden,
//      nicht den Luzerner Satz.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'NW', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: '6370', city: 'Stans', rentAmount: 1200 },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 450 },
});

describe('K31 IPV-Rechner, Kanton Nidwalden', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvNidwalden.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  it('zeigt den Betrag: 20 000 im Jahr → 3 400/Jahr, 283/Monat', () => {
    const html = render(profil(20000 / 12));
    expect(html).toContain('premium.eligible');
    expect(html).toContain('CHF 3’400');
    expect(html).toContain('CHF 283');
  });

  it('ohne erfasste Prämie: keine Zahl, sondern der Grund', () => {
    const html = render(profil(20000 / 12, { kkPremium: null }));
    expect(html).toContain('ipv.offenGrund.praemie');
    expect(html).not.toContain('CHF 3’400');
  });

  it('keine Einkommensgrenze, keine Musterwerte', () => {
    const html = render(profil(2000));
    expect(html).not.toContain('premium.maxIncome');
    for (const z of ['45’000', '2’250', '100’000']) expect(html).not.toContain(z);
  });

  it('Familie im mehrdeutigen Bereich: keine Zahl, sondern der Grund', () => {
    const html = render(profil(2500, { children: [{ age: 5 }] }));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.offenGrund.mindestanspruch');
  });

  it('keine Prämienregion, nicht der Aargauer Satz, Basisjahr 2024 im Vorbehalt', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.jahrNW(2026)');
    expect(html).not.toContain('ipv.jahrOhneRegion');
    expect(html).not.toContain('ipv.jahrRegion');
    expect(html).toContain('ipv.vorbehaltNW(2026|2024)');
  });

  it('die Antragsfrist steht beim Betrag', () => {
    expect(render(profil(2000))).toMatch(/ipv\.nwFrist(Vorbei|Laeuft)\(2026\|2027\)/);
  });

  it('nach der Frist nennt die KK-Karte den Obwaldner Grund, nicht den Luzerner', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-09-28T12:00:00'));
    const html = renderToStaticMarkup(React.createElement(KKLastCard, { palette, t, data: profil(2000) }));
    expect(html).toContain('ipv.nwFristNichtAbgezogen');
    expect(html).not.toContain('ipv.luFristNichtAbgezogen');
  });

  it('unter dem Mindestbetrag und über der Grenze: je ein eigener Satz', () => {
    expect(render(profil(54000 / 12))).toContain('ipv.nwKeinAnspruch');
    const band = render(profil(53500 / 12));
    expect(band).toContain('ipv.nwUnterMindestbetrag');
    expect(band).not.toContain('ipv.incomeAboveLimit');
  });

  it('kein roher Schlüssel bleibt stehen: alle OW-Texte in allen fünf Sprachen', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['jahrOW', 'vorbehaltOW', 'owKeinAnspruch', 'owUnterMindestbetrag', 'nwFristLaeuft', 'nwFristVorbei', 'nwFristNichtAbgezogen']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      expect(typeof texte.budget.ipvHintNwFristVorbei, `${sprache}.js: budget.ipvHintNwFristVorbei`).toBe('string');
      expect(texte.ipv.vorbehaltNW).toContain('{basisjahr}');
      expect(texte.ipv.offenGrund.ausbildung?.length, `${sprache}: offenGrund.ausbildung`).toBeGreaterThan(60);
      expect(texte.ipv.offenGrund.ausbildung?.length, `${sprache}: offenGrund.ausbildung`).toBeGreaterThan(60);
      for (const k of ['nwFristVorbei']) for (const p of ['{jahr}', '{folgejahr}']) expect(texte.ipv[k], `${sprache}: ${k} ${p}`).toContain(p);
    }
  // Fünf Sprachdateien laden dauert unter Last (parallele Läufe) gemessen gut 5 s.
  }, 30000);

  it('Paare und Kinder ohne Alter: Orientierung mit Grund statt Zahl', () => {
    const paar = render({ ...profil(2000), basis: { ...profil(2000).basis, maritalStatus: 'married' } });
    expect(paar).toContain('ipv.orientierungOffen');
    expect(render(profil(2000, { children: [{ age: 0 }] }))).toContain('ipv.orientierungOffen');
  });
});
