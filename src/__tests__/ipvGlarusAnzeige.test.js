import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import { KKLastCard } from '../KKLastCard.jsx';

// K31 — der IPV-Rechner zeigt für GL den Betrag nach Richtprämie minus Selbstbehalt.
// Was hier sichtbar sein muss:
//   1. ein Betrag nur MIT erfasster Prämie (EG KVG GL Art. 14 Abs. 1).
//   2. keine Einkommensgrenze (nicht publiziert) und nicht die Musterwerte 42 000 / 2 100.
//   3. der Weg: Antrag bis 31. Januar — nicht «automatisch via Steuerdaten» (so stand es vorher).
//   4. nach der Frist zieht die KK-Last-Karte nichts ab und nennt den GLARNER Satz, nicht den Luzerner.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'GL', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: '8750', city: 'Glarus', rentAmount: 1200 },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 500 },
});

describe('K31 IPV-Rechner, Kanton Glarus', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvGlarus.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  it('zeigt den Betrag: 24 000 im Jahr → 3 287/Jahr, 274/Monat', () => {
    const html = render(profil(2000));
    expect(html).toContain('premium.eligible');
    expect(html).toContain('CHF 3’287');
    expect(html).toContain('CHF 274');
  });

  it('ohne erfasste Prämie: keine Zahl, sondern der Grund', () => {
    const html = render(profil(2000, { kkPremium: null }));
    expect(html).toContain('ipv.offenGrund.praemie');
    expect(html).not.toContain('CHF 3’287');
  });

  it('keine Einkommensgrenze, keine Musterwerte; Weg = Antrag', () => {
    const html = render(profil(2000));
    expect(html).not.toContain('premium.maxIncome');
    expect(html).not.toContain(geldZahl(42000));
    expect(html).toContain('ipv.noteApplyGl');
    expect(html).not.toContain('ipv.noteAutoTaxData');
  });

  it('eigener Jahressatz, Basisjahr 2024, kein Aargau-Satz', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.jahrGL(2026)');
    expect(html).not.toContain('ipv.jahrOhneRegion');
    expect(html).toContain('ipv.vorbehaltGL(2026|2024)');
  });

  it('die Frist beim Betrag', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-09-28T12:00:00'));
    expect(render(profil(2000))).toContain('ipv.glFristVorbei(2026|2027)');
    vi.setSystemTime(new Date('2026-01-10T12:00:00'));
    expect(render(profil(2000))).toContain('ipv.glFristLaeuft(2026|2027)');
  });

  it('🛑 KK-Last-Karte nach der Frist: nichts abgezogen, der Glarner Satz — nicht der Luzerner', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-09-28T12:00:00'));
    const html = renderToStaticMarkup(React.createElement(KKLastCard, { palette, t, data: profil(2000), onNavigate: () => {} }));
    expect(html).toContain('ipv.glFristNichtAbgezogen');
    expect(html).not.toContain('ipv.luFristNichtAbgezogen');
    expect(html).not.toContain('kkLast.ipvRelief');
  });

  it('über dem Nullpunkt: der eigene Satz, ohne Grenze', () => {
    const html = render(profil(4167));
    expect(html).toContain('ipv.glKeinAnspruch');
    expect(html).not.toContain('ipv.incomeAboveLimit');
  });

  it('kein roher Schlüssel bleibt stehen: alle GL-Texte in allen fünf Sprachen', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['vorbehaltGL', 'glKeinAnspruch', 'glUnterMindestbetrag', 'glFristLaeuft', 'glFristVorbei', 'glFristNichtAbgezogen', 'jahrGL', 'noteApplyGl']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(30);
      }
      expect(texte.ipv.vorbehaltGL).toContain('{basisjahr}');
      expect(texte.ipv.glFristVorbei).toContain('{folgejahr}');
      expect(texte.ipv.glFristNichtAbgezogen).toContain('{jahr}');
    }
  // Fünf Sprachdateien laden unter Last länger als 5 s (gemessen 28.09.2026).
  }, 30000);
});
