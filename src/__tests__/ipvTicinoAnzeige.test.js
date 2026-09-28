import { describe, it, expect, beforeAll } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für TI den Betrag nach der quadratischen Formel (LCAMal Art. 35/37).
// Sichtbar sein muss:
//   1. ein Betrag nur MIT erfasster Prämie (Art. 37 Abs. 3 LCAMal deckelt auf die Prämie)
//   2. keine Einkommensgrenze, keine Musterwerte (45 000 / 2 400), nicht die abgeleitete RDM 35 547
//   3. KEIN Aargauer Regionen-Satz, sondern der Tessiner (`ipv.jahrTessin`), der Vorbehalt mit
//      Basisjahr 2023, die Frist

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'TI', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, employmentType: 'employed' },
  wohnen: { postalCode: '6900', city: 'Lugano', rentAmount: 1200 },
  versicherungen: extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium ?? 450 },
});

describe('K31 IPV-Rechner, Kanton Tessin', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvTicino.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('zeigt den Betrag: 3 000 netto/Monat → 3 341/Jahr, 278/Monat', () => {
    const html = render(profil(3000));
    expect(html).toContain('premium.eligible');
    expect(html).toContain('CHF 3’341');
    expect(html).toContain('CHF 278');
  });

  it('ohne erfasste Prämie: keine Zahl, sondern der Grund', () => {
    const html = render(profil(3000, { kkPremium: null }));
    expect(html).toContain('ipv.offenGrund.praemie');
    expect(html).not.toContain('CHF 3’341');
  });

  it('keine Grenze, keine Musterwerte, nicht die abgeleitete RDM', () => {
    const html = render(profil(3000));
    expect(html).not.toContain('premium.maxIncome');
    for (const z of [45000, 2400, 35547]) {
      expect(html).not.toContain(String(z));
      expect(html).not.toContain(geldZahl(z));
    }
  });

  it('Tessiner Jahr-Satz statt des Aargauer Satzes, Vorbehalt mit Basisjahr 2023, Frist', () => {
    const html = render(profil(3000));
    expect(html).toContain('ipv.jahrTessin(2026)');
    expect(html).not.toContain('ipv.jahrOhneRegion');
    expect(html).toContain('ipv.vorbehaltTI(2026|2023)');
    expect(html).toMatch(/ipv\.tiFrist(Vorbei|Laeuft)/);
  });

  it('über der Grenze und unter dem Mindestbetrag: je ein eigener Satz', () => {
    expect(render(profil(48000 / 12))).toContain('ipv.tiKeinAnspruch');
    expect(render(profil(47300 / 12))).toContain('ipv.tiUnterMindestbetrag');
  });

  it('Kinder: Orientierung mit dem Tessiner Grund', () => {
    const html = render(profil(3000, { children: [{ age: 5 }] }));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.offenGrund.tiKinder');
  });

  it('alle TI-Texte in allen fünf Sprachen', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['jahrTessin', 'vorbehaltTI', 'tiKeinAnspruch', 'tiUnterMindestbetrag', 'tiFristLaeuft', 'tiFristVorbei']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      expect(texte.ipv.vorbehaltTI).toContain('{basisjahr}');
      for (const k of ['tiFristLaeuft', 'tiFristVorbei']) expect(texte.ipv[k], `${sprache}: Platzhalter`).toContain('{vorjahr}');
      for (const k of ['tiKinder', 'tiEltern']) expect(typeof texte.ipv.offenGrund[k], `${sprache}: offenGrund.${k}`).toBe('string');
    }
  }, 30000);
});
