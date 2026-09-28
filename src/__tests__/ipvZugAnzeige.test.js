import { describe, it, expect, beforeAll } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner für ZG. Zug veröffentlicht die Einkommensgrenzen für Einzelpersonen nicht
// als Zahl (Broschüre der Ausgleichskasse Zug 2026, S. 5). Was hier sichtbar sein muss:
//   1. unter dem Nullpunkt KEIN Betrag, sondern der Grund `zgGrenzeEinzelperson` — nie ein
//      Musterwert (60 000 / 3 600) und keine Grenze.
//   2. «kein Anspruch» nur, wo er sicher ist — mit Zuger Vorbehalt (Veranlagung 2024) und dem
//      kantonsneutralen Satz ohne Prämienregion (nicht dem Aargau-Satz).

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

  it('tiefes Einkommen: kein Betrag, der Grund «Grenze für Einzelpersonen nicht beziffert»', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.offenGrund.zgGrenzeEinzelperson');
    expect(html).not.toContain('premium.eligible');
    expect(html).not.toContain('premium.maxIncome');
    for (const z of [60000, 3600, 62310]) {
      expect(html).not.toContain(String(z));
      expect(html).not.toContain(geldZahl(z));
    }
  });

  it('über dem Nullpunkt: «kein Anspruch» mit Zuger Satz, Vorbehalt und Jahr ohne Aargau-Satz', () => {
    const html = render(profil(6000));
    expect(html).toContain('ipv.zgKeinAnspruch');
    expect(html).toContain('ipv.vorbehaltZG');
    expect(html).toContain('ipv.jahrEineRegion(2026)');
    expect(html).not.toContain('ipv.jahrOhneRegion');
    expect(html).not.toContain('ipv.incomeAboveLimit');
  });

  it('alle ZG-Texte in allen fünf Sprachen', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['vorbehaltZG', 'zgKeinAnspruch', 'jahrEineRegion']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      expect(texte.ipv.vorbehaltZG).toContain('{basisjahr}');
      expect(typeof texte.ipv.offenGrund.zgGrenzeEinzelperson, `${sprache}: offenGrund.zgGrenzeEinzelperson`).toBe('string');
      expect(texte.ipv.jahrEineRegion).not.toMatch(/Aargau|Argovi|Argovia/);
    }
  });
});
