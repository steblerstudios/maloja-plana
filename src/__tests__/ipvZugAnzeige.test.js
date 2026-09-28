import { describe, it, expect, beforeAll } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner für ZG (neu gefasst nach der Fachprüfung #475, 28.09.2026). Sichtbar sein muss:
//   1. ein Betrag für eine Einzelperson (Richtprämie − 8 %) — keine «nicht bezifferte Grenze» mehr.
//   2. keine Einkommensgrenze und keine Musterwerte (60 000 / 3 600).
//   3. knapp über dem Nullpunkt KEIN «Nicht berechtigt», sondern der Grund `zgNaeherung`.
//   4. Vorbehalt ZG (Veranlagung 2024), Satz ohne Prämienregion (nicht der Aargau-Satz).

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'ZG', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: '6300', city: 'Zug', rentAmount: 1500 },
  versicherungen: { kkPremium: 400 },
});

describe('K31 IPV-Rechner, Kanton Zug', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvZug.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('Einzelperson, 30 000 im Jahr: Betrag 2 585/Jahr, 215/Monat, ohne Grenze und ohne Musterwerte', () => {
    const html = render(profil(2500));
    expect(html).toContain('premium.eligible');
    expect(html).toContain('CHF 2’585');
    expect(html).toContain('CHF 215');
    expect(html).not.toContain('premium.maxIncome');
    for (const z of [60000, 3600, 62310]) {
      expect(html).not.toContain(String(z));
      expect(html).not.toContain(geldZahl(z));
    }
    expect(html).toMatch(/ipv\.zgFrist(Laeuft|Vorbei)/);
  });

  it('Vorbehalt ZG mit Basisjahr 2024 und der Satz ohne Prämienregion', () => {
    const html = render(profil(2500));
    expect(html).toContain('ipv.vorbehaltZG(2026|2024)');
    expect(html).toContain('ipv.jahrEineRegion(2026)');
    expect(html).not.toContain('ipv.jahrOhneRegion');
  });

  it('🛑 knapp über dem Nullpunkt: kein «Nicht berechtigt», sondern die Näherung als Grund', () => {
    const html = render(profil(5200));
    expect(html).toContain('ipv.offenGrund.zgNaeherung');
    expect(html).not.toContain('premium.notEligible');
  });

  it('deutlich darüber: «kein Anspruch» mit dem Zuger Satz', () => {
    const html = render(profil(6000));
    expect(html).toContain('ipv.zgKeinAnspruch');
    expect(html).not.toContain('ipv.incomeAboveLimit');
  });

  it('alle ZG-Texte in allen fünf Sprachen; der alte Einzelpersonen-Grund ist weg', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['vorbehaltZG', 'zgKeinAnspruch', 'zgUnterMindestbetrag', 'zgFristLaeuft', 'zgFristVorbei', 'zgGesuchNichtAbgezogen', 'jahrEineRegion']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      expect(texte.ipv.vorbehaltZG).toContain('{basisjahr}');
      expect(texte.ipv.zgFristVorbei).toContain('{folgejahr}');
      expect(typeof texte.ipv.offenGrund.zgNaeherung, `${sprache}: offenGrund.zgNaeherung`).toBe('string');
      expect(texte.ipv.offenGrund.zgGrenzeEinzelperson).toBeUndefined();
      // W3: 89 900 gilt für alle, nicht «für Haushalte»
      expect(texte.ipv.zgKeinAnspruch).not.toMatch(/Haushalt|ménages|economie domestiche|households|chasadas/i);
    }
  });
});
