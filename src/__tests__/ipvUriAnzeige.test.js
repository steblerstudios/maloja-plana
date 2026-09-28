import { describe, it, expect, beforeAll } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für UR den Betrag nach dem Selbstbehalt-Modell (RB 20.2213).
// Was hier sichtbar sein muss:
//   1. ein Betrag auch OHNE erfasste Prämie — Uri kennt keinen Deckel auf die eigene Prämie
//      (KEIN_PRAEMIENDECKEL.UR), anders als LU.
//   2. keine Einkommensgrenze in der Anzeige: weder die 90 000 (nur Kinderminimum) noch die
//      alten Musterwerte (42 000 / 2 100).
//   3. KEINE Prämienregion und nicht der Aargauer Satz (`ipv.jahrOhneRegion`), sondern `ipv.jahrUR`;
//      der Vorbehalt mit dem Basisjahr 2024 (Art. 7 Abs. 3).
//   4. der Weg: von Amtes wegen, kein Antrag (Art. 10), keine Anmeldefrist.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'UR', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: '6460', city: 'Altdorf', rentAmount: 1200 },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 350 },
});

describe('K31 IPV-Rechner, Kanton Uri', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvUri.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('zeigt den Betrag: 20 000 im Jahr → 2 668/Jahr, 222/Monat', () => {
    const html = render(profil(20000 / 12));
    expect(html).toContain('premium.eligible');
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).toContain('CHF 2’668');
    expect(html).toContain('CHF 222');
  });

  it('ohne erfasste Prämie trotzdem ein Betrag (kein Deckel im Reglement), und der Vorbehalt sagt es', () => {
    const html = render(profil(20000 / 12, { kkPremium: null }));
    expect(html).not.toContain('ipv.offenGrund.praemie');
    expect(html).toContain('CHF 2’668');
    expect(html).toContain('ipv.vorbehaltUR');
  });

  it('nennt keine Einkommensgrenze — weder die 90 000 noch die alten Musterwerte', () => {
    const html = render(profil(2000, { children: [{ age: 5 }] }));
    expect(html).not.toContain('premium.maxIncome');
    for (const z of [90000, 42000, 2100, 51388]) {
      expect(html).not.toContain(String(z));
      expect(html).not.toContain(geldZahl(z));
    }
  });

  it('keine Prämienregion, nicht der Aargauer Satz, Basisjahr 2024 im Vorbehalt', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.jahrUR(2026)');
    expect(html).not.toContain('ipv.jahrOhneRegion');
    expect(html).not.toContain('ipv.jahrRegion');
    expect(html).toContain('ipv.vorbehaltUR(2026|2024)');
  });

  it('der Weg: von Amtes wegen, mit Basisjahr und Vorjahr', () => {
    expect(render(profil(2000))).toContain('ipv.urAutomatisch(2026|2024|2025)');
  });

  it('über der Grenze: der Uri-Satz, nicht die Grenze der Musterwerte', () => {
    const html = render(profil(60000 / 12));
    expect(html).toContain('ipv.urKeinAnspruch');
    expect(html).not.toContain('ipv.incomeAboveLimit');
  });

  it('kein roher Schlüssel bleibt stehen: alle UR-Texte in allen fünf Sprachen', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['jahrUR', 'vorbehaltUR', 'urKeinAnspruch', 'urAutomatisch']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      expect(texte.ipv.jahrUR, `${sprache}: Platzhalter`).toContain('{jahr}');
      expect(texte.ipv.vorbehaltUR, `${sprache}: Platzhalter`).toContain('{basisjahr}');
      for (const p of ['{jahr}', '{basisjahr}', '{vorjahr}']) expect(texte.ipv.urAutomatisch, `${sprache}: ${p}`).toContain(p);
    }
  // Fünf Sprachdateien laden dauert unter Last (parallele Läufe) gemessen gut 5 s — der Standard.
  }, 30000);

  it('Paare und Kinder ohne Alter: Orientierung mit Grund statt Zahl', () => {
    const paar = render({ ...profil(2000), basis: { ...profil(2000).basis, maritalStatus: 'married' } });
    expect(paar).toContain('ipv.orientierungOffen');
    expect(render(profil(2000, { children: [{ age: 0 }] }))).toContain('ipv.orientierungOffen');
  });
});
