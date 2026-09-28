import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für AR den Betrag nach EG zum KVG (bGS 833.14) und Merkblatt SOVAR 2026.
// Was hier sichtbar sein muss:
//   1. ein Betrag nur MIT erfasster Prämie, und nur wenn er unter ihr liegt (Deckel = Prämie mit
//      ordentlicher Franchise, V zum KVG Art. 7) — sonst der Grund.
//   2. die publizierte Obergrenze des massgebenden Einkommens (35 000), nicht die Musterwerte.
//   3. ein eigener Satz zur einzigen Prämienregion — NICHT der Aargau-Satz `ipv.jahrOhneRegion`.
//   4. die Antragsfrist 31. März.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'AR', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: '9100', city: 'Herisau', rentAmount: 1200 },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 450 },
});

describe('K31 IPV-Rechner, Kanton Appenzell Ausserrhoden', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvAppenzellAusserrhoden.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('zeigt den Betrag: 24 000 im Jahr → 4 493/Jahr, 374/Monat', () => {
    const html = render(profil(2000));
    expect(html).toContain('premium.eligible');
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).toContain('CHF 4’493');
    expect(html).toContain('CHF 374');
  });

  it('ohne erfasste Prämie oder mit einer Prämie unter dem Betrag: keine Zahl, sondern der Grund', () => {
    expect(render(profil(2000, { kkPremium: null }))).toContain('ipv.offenGrund.praemie');
    const tief = render(profil(2000, { kkPremium: 300 }));
    expect(tief).toContain('ipv.offenGrund.praemieFranchise');
    expect(tief).not.toContain('CHF 4’493');
  });

  it('nennt die publizierte Obergrenze 35 000, nicht die Musterwerte', () => {
    const html = render(profil(2000));
    expect(html).toContain('premium.maxIncome(35’000)');
    expect(html).not.toContain('42’000');
    expect(html).not.toContain('2’100');
  });

  it('eigener Satz zur Prämienregion, nicht der Aargau-Satz; Vorbehalt AR', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.jahrAR(2026)');
    expect(html).not.toContain('ipv.jahrOhneRegion');
    expect(html).toContain('ipv.vorbehaltAR');
  });

  it('die Antragsfrist steht beim Betrag', () => {
    expect(render(profil(2000))).toMatch(/ipv\.arFrist(Vorbei|Laeuft)/);
  });

  it('kein Anspruch und unter dem Mindestbetrag: je ein eigener Satz', () => {
    expect(render(profil(33800 / 12))).toContain('ipv.arKeinAnspruch');
    const band = render(profil(33740 / 12));
    expect(band).toContain('ipv.arUnterMindestbetrag');
    expect(band).not.toContain('ipv.arKeinAnspruch');
  });

  it('kein roher Schlüssel bleibt stehen: alle AR-Texte in allen fünf Sprachen', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['jahrAR', 'vorbehaltAR', 'arKeinAnspruch', 'arUnterMindestbetrag', 'arFristLaeuft', 'arFristVorbei', 'arFristNichtAbgezogen']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      for (const k of ['kindNachStichtag', 'saeule2Unbekannt', 'praemieFranchise']) {
        expect(typeof texte.ipv.offenGrund[k], `${sprache}.js: ipv.offenGrund.${k} fehlt`).toBe('string');
      }
      for (const k of ['jahrAR', 'arFristLaeuft', 'arFristVorbei', 'arFristNichtAbgezogen']) expect(texte.ipv[k], `${sprache}: Platzhalter`).toContain('{jahr}');
      expect(texte.ipv.arFristVorbei, `${sprache}: Platzhalter`).toContain('{folgejahr}');
    }
    // Fünf Sprachdateien nachladen dauert unter Last der ganzen Suite über 5 s (gemessen 28.09.2026).
  }, 30000);

  // Fachprüfung #480 B1/W1/W3/W4: Richtung, Antrag lohnt sich, Untergrenze, Ausweg, Antragsstelle.
  it('die Texte nennen die Richtung und was eine Person tun kann', async () => {
    const de = (await import('../i18n/de.js')).default.ipv;
    expect(de.vorbehaltAR).toMatch(/eher höher/);
    expect(de.arKeinAnspruch).toMatch(/Antrag lohnt sich/);
    expect(de.offenGrund.praemieFranchise).toMatch(/mindestens so hoch wie die erfasste Prämie/);
    expect(de.offenGrund.saeule2Unbekannt).toMatch(/oder 0/);
    expect(de.arFristLaeuft).toMatch(/AHV-Zweigstelle der Wohngemeinde/);
  }, 30000);

  it('Paare und Kinder ohne Alter: Orientierung mit Grund statt Zahl', () => {
    const paar = render({ ...profil(2000), basis: { ...profil(2000).basis, maritalStatus: 'married' } });
    expect(paar).toContain('ipv.orientierungOffen');
    expect(render(profil(2000, { children: [{ age: 0 }] }))).toContain('ipv.orientierungOffen');
  });
});
