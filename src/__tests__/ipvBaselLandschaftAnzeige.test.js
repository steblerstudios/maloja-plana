import { describe, it, expect, beforeAll } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für BL den Betrag nach Richtprämie minus 7,75 %.
// Was hier sichtbar sein muss:
//   1. ein Betrag nur MIT erfasster Prämie (EG KVG § 8 Abs. 2bis).
//   2. die amtliche Obergrenze (Dekret SGS 362.1 § 1) — nicht die Musterwerte 51 000 / 2 700.
//   3. kein Satz über Prämienregionen oder den Aargau; Basisjahr 2024 im Vorbehalt.
//   4. der Weg: Formular kommt von der SVA, innert 1 Jahr zurück; sonst Gesuch bis 31.12.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'BL', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: '4410', city: 'Liestal', rentAmount: 1200 },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 500 },
});

describe('K31 IPV-Rechner, Kanton Basel-Landschaft', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvBaselLandschaft.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('zeigt den Betrag: 24 000 im Jahr → 2 736/Jahr, 228/Monat', () => {
    const html = render(profil(2000));
    expect(html).toContain('premium.eligible');
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).toContain('CHF 2’736');
    expect(html).toContain('CHF 228');
  });

  it('ohne erfasste Prämie: keine Zahl, sondern der Grund', () => {
    const html = render(profil(2000, { kkPremium: null }));
    expect(html).toContain('ipv.offenGrund.praemie');
    expect(html).not.toContain('CHF 2’736');
  });

  it('nennt die amtliche Obergrenze — nicht die Musterwerte', () => {
    const html = render(profil(2000));
    expect(html).toContain('premium.maxIncome(' + geldZahl(31000) + ')');
    expect(html).not.toContain(geldZahl(51000));
  });

  it('eigener Jahressatz, Basisjahr 2024 im Vorbehalt, kein Aargau-Satz', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.jahrBL(2026)');
    expect(html).not.toContain('ipv.jahrOhneRegion');
    expect(html).toContain('ipv.vorbehaltBL(2026|2024)');
  });

  it('der Weg beim Betrag: Formular der SVA, Gesuch bis Ende 2026', () => {
    expect(render(profil(2000))).toContain('ipv.blAntrag(2026|2024)');
  });

  it('über der Obergrenze: der eigene Satz mit der Grenze', () => {
    const html = render(profil(2584));
    expect(html).toContain('ipv.blKeinAnspruch(' + geldZahl(31000) + '|2024)');
    expect(html).not.toContain('ipv.incomeAboveLimit');
  });

  it('kein roher Schlüssel bleibt stehen: alle BL-Texte in allen fünf Sprachen', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['vorbehaltBL', 'blKeinAnspruch', 'blAntrag', 'jahrBL']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      expect(typeof texte.ipv.offenGrund.blKindNeu, `${sprache}.js: offenGrund.blKindNeu fehlt`).toBe('string');
      expect(texte.ipv.vorbehaltBL).toContain('{basisjahr}');
      expect(texte.ipv.blAntrag).toContain('{jahr}');
      expect(texte.ipv.blKeinAnspruch).toContain('{grenze}');
    }
  // Fünf Sprachdateien laden unter Last länger als 5 s (gemessen 28.09.2026).
  }, 30000);
});
