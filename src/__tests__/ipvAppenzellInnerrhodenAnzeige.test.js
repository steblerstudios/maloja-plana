import { describe, it, expect, beforeAll } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für AI den Betrag nach StKB IPV (GS 832.501) und Merkblatt 2026.
// Was hier sichtbar sein muss:
//   1. ein Betrag nur MIT erfasster Prämie (Art. 5 Abs. 1bis: höchstens die effektive Prämienlast).
//   2. keine Einkommensgrenze (nicht publiziert) und nicht die alten Musterwerte (42 000 / 2 100).
//   3. ein eigener Satz zur einzigen Prämienregion — NICHT der Aargau-Satz `ipv.jahrOhneRegion`.
//   4. der Hinweis, dass es keinen Antrag braucht (Art. 10), und der Vorbehalt mit Steuerjahr 2024.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'AI', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: '9050', city: 'Appenzell', rentAmount: 1200 },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 450 },
});

describe('K31 IPV-Rechner, Kanton Appenzell Innerrhoden', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvAppenzellInnerrhoden.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('zeigt den Betrag des Merkblatt-Beispiels: 20 000 → 3 240/Jahr, 270/Monat', () => {
    const html = render(profil(20000 / 12));
    expect(html).toContain('premium.eligible');
    expect(html).toContain('CHF 3’240');
    expect(html).toContain('CHF 270');
    expect(html).toContain('ipv.aiAutomatisch(2026)');
  });

  it('ohne erfasste Prämie: keine Zahl, sondern der Grund', () => {
    const html = render(profil(20000 / 12, { kkPremium: null }));
    expect(html).toContain('ipv.offenGrund.praemie');
    expect(html).not.toContain('CHF 3’240');
  });

  it('nennt keine Einkommensgrenze und nicht die alten Musterwerte', () => {
    const html = render(profil(20000 / 12));
    expect(html).not.toContain('premium.maxIncome');
    for (const zahl of [42000, 2100]) expect(html).not.toContain(geldZahl(zahl));
  });

  it('eigener Satz zur Prämienregion, nicht der Aargau-Satz; Vorbehalt mit Steuerjahr 2024', () => {
    const html = render(profil(20000 / 12));
    expect(html).toContain('ipv.jahrAI(2026)');
    expect(html).not.toContain('ipv.jahrOhneRegion');
    expect(html).toContain('ipv.vorbehaltAI(2026|2024)');
  });

  it('der Vorbehalt nennt Alimente/Familienzulagen und dass der Betrag eher zu hoch ist (Fachprüfung #485)', async () => {
    const de = (await import('../i18n/de.js')).default.ipv.vorbehaltAI;
    expect(de).toMatch(/Alimente/);
    expect(de).toMatch(/Familienzulagen/);
    expect(de).toMatch(/eher tiefer/);
  }, 30000);

  it('kein Anspruch und unter dem Mindestbetrag: je ein eigener Satz', () => {
    expect(render(profil(56000 / 12))).toContain('ipv.aiKeinAnspruch');
    const band = render(profil(55900 / 12));
    expect(band).toContain('ipv.aiUnterMindestbetrag');
    expect(band).not.toContain('ipv.aiKeinAnspruch');
  });

  it('kein roher Schlüssel bleibt stehen: alle AI-Texte in allen fünf Sprachen', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['jahrAI', 'vorbehaltAI', 'aiKeinAnspruch', 'aiUnterMindestbetrag', 'aiAutomatisch']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      expect(texte.ipv.vorbehaltAI, `${sprache}: Platzhalter`).toContain('{basisjahr}');
      // Fachprüfung #485: der Vorbehalt nennt die fehlenden Alimente/Zulagen und die Richtung.
      expect(texte.ipv.vorbehaltAI.length, `${sprache}: Vorbehalt zu kurz`).toBeGreaterThan(450);
      for (const k of ['jahrAI', 'aiAutomatisch']) expect(texte.ipv[k], `${sprache}: Platzhalter`).toContain('{jahr}');
    }
    // Fünf Sprachdateien nachladen dauert unter Last der ganzen Suite über 5 s (gemessen 28.09.2026).
  }, 30000);

  it('Paare und Kinder ohne Alter: Orientierung mit Grund statt Zahl', () => {
    const paar = render({ ...profil(3000), basis: { ...profil(3000).basis, maritalStatus: 'married' } });
    expect(paar).toContain('ipv.orientierungOffen');
    expect(render(profil(3000, { children: [{ age: 0 }] }))).toContain('ipv.orientierungOffen');
  });
});
