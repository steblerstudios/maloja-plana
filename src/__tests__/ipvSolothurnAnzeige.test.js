import { describe, it, expect, beforeAll } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner für SO. Solothurn veröffentlicht nur «Eigenanteile … 10% bis 16%», nicht
// bei welchem Einkommen welcher Satz gilt (Parameter-Verfügung DDI vom 27.01.2026). Sichtbar sein muss:
//   1. unter 50 640 KEIN Betrag, sondern der Grund `soSkalaUnklar` — nie die alten Musterwerte
//      (48 000 / 2 400) und nicht der Grenzwert 74 000 als «Einkommensgrenze».
//   2. «kein Anspruch» nur, wo er sicher ist — mit Solothurner Vorbehalt und dem Satz ohne
//      Prämienregion (nicht dem Aargau-Satz).

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'SO', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: '4500', city: 'Solothurn', rentAmount: 1300 },
  versicherungen: { kkPremium: 400 },
});

describe('K31 IPV-Rechner, Kanton Solothurn', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvSolothurn.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('tiefes Einkommen: kein Betrag, der Grund «Skala nicht veröffentlicht»', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.orientierungOffen');
    // Vor oder nach dem 31. Juli ein anderer Satz (§ 75 Abs. 2 SV) — beide sind «Skala unklar».
    expect(html).toMatch(/ipv\.offenGrund\.soSkalaUnklar(FristVorbei)?/);
    expect(html).not.toContain('premium.eligible');
    expect(html).not.toContain('premium.maxIncome');
    for (const z of [48000, 2400, 74000, 50640]) {
      expect(html).not.toContain(String(z));
      expect(html).not.toContain(geldZahl(z));
    }
  });

  it('über 50 640: «kein Anspruch» mit Solothurner Satz, Vorbehalt und Jahr ohne Aargau-Satz', () => {
    const html = render(profil(5000));
    expect(html).toContain('ipv.soKeinAnspruch');
    expect(html).toContain('ipv.vorbehaltSO');
    expect(html).toContain('ipv.jahrEineRegion(2026)');
    expect(html).not.toContain('ipv.jahrOhneRegion');
    expect(html).not.toContain('ipv.incomeAboveLimit');
  });

  it('alle SO-Texte in allen fünf Sprachen', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['vorbehaltSO', 'soKeinAnspruch', 'jahrEineRegion']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      for (const k of ['soSkalaUnklar', 'soSkalaUnklarFristVorbei']) {
        expect(typeof texte.ipv.offenGrund[k], `${sprache}: offenGrund.${k}`).toBe('string');
        // § 75 Abs. 2 SV: 31. Juli; Merkblatt QS 2026: 31. Dezember (Fachprüfung #481 W2)
        expect(texte.ipv.offenGrund[k]).toMatch(/31/);
      }
      expect(texte.ipv.jahrEineRegion).not.toMatch(/Aargau|Argovi|Argovia/);
    }
  });
});
