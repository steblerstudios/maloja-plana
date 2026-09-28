import { describe, it, expect, beforeAll } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für SZ den Betrag nach EGzKVG (SRSZ 361.100) und KRBzEGzKVG.
// Was hier sichtbar sein muss:
//   1. ein Betrag nur MIT erfasster Prämie (§ 10 Abs. 1 EGzKVG deckelt auf die geschuldete Prämie).
//   2. keine Einkommensgrenze — auch nicht das «minimale Höchsteinkommen» 43 554 (es gilt nur für
//      Mietzinsregion 3) und nicht die alten Musterwerte (48 000 / 2 400).
//   3. kein Satz über den Aargau: Schwyz hat keine Prämienregion, aber der Satz dafür ist ein
//      eigener (`ipv.jahrEineRegion`), nicht `ipv.jahrOhneRegion`.
//   4. der Schwyzer Vorbehalt und die Frist 31. Dezember des Anspruchsjahres (§ 17 EGzKVG).

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'SZ', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: '6430', city: 'Schwyz', rentAmount: 1200 },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 450 },
});

describe('K31 IPV-Rechner, Kanton Schwyz', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvSchwyz.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('zeigt den Betrag: Reineinkommen 25 000, Vermögen 35 000 → 2 724/Jahr, 227/Monat', () => {
    const html = render(profil(25000 / 12, { finanzen: { savingsAccount: 35000 } }));
    expect(html).toContain('premium.eligible');
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).toContain('CHF 2’724');
    expect(html).toContain('CHF 227');
  });

  it('ohne erfasste Prämie: keine Zahl, sondern der Grund', () => {
    const html = render(profil(25000 / 12, { kkPremium: null }));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.offenGrund.praemie');
    expect(html).not.toContain('CHF 2’724');
  });

  it('nennt keine Einkommensgrenze — weder das minimale Höchsteinkommen noch die Musterwerte', () => {
    const html = render(profil(2000));
    expect(html).not.toContain('premium.maxIncome');
    for (const z of [43554, 48000, 50760]) {
      expect(html).not.toContain(String(z));
      expect(html).not.toContain(geldZahl(z));
    }
  });

  it('Anspruchsjahr ohne Aargau-Satz, der Schwyzer Vorbehalt und die Frist', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.jahrEineRegion(2026)');
    expect(html).not.toContain('ipv.jahrOhneRegion');
    expect(html).not.toContain('ipv.jahrRegion');
    expect(html).toContain('ipv.vorbehaltSZ');
    expect(html).toContain('ipv.szFristLaeuft(2026|2025)');
  });

  it('über dem minimalen Höchsteinkommen: kein Betrag, der Grund Mietzinsregion', () => {
    const html = render(profil(3700));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.offenGrund.szGrenzeMietzinsregion');
    expect(html).not.toContain('premium.eligible');
  });

  it('über dem Nullpunkt: «kein Anspruch» mit dem Schwyzer Satz', () => {
    const html = render(profil(5000));
    expect(html).toContain('ipv.szKeinAnspruch');
    expect(html).not.toContain('ipv.incomeAboveLimit');
  });

  it('kein roher Schlüssel bleibt stehen: alle SZ-Texte in allen fünf Sprachen', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['vorbehaltSZ', 'szKeinAnspruch', 'szUnterMindestbetrag', 'szFristLaeuft', 'jahrEineRegion']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      for (const k of ['szGrenzeMietzinsregion', 'saeule3aAbzugUnklar']) {
        expect(typeof texte.ipv.offenGrund[k], `${sprache}.js: ipv.offenGrund.${k} fehlt`).toBe('string');
      }
      expect(texte.ipv.szFristLaeuft).toContain('{jahr}');
      expect(texte.ipv.szFristLaeuft).toContain('{vorjahr}');
      expect(texte.ipv.jahrEineRegion).toContain('{jahr}');
      // Der Satz für Kantone ohne Region nennt keinen Kanton — sonst stünde wieder «Aargau» bei Schwyz.
      expect(texte.ipv.jahrEineRegion).not.toMatch(/Aargau|Argovi|Argovia/);
    }
  });
});
