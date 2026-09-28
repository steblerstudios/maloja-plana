import { describe, it, expect, beforeAll } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für GR den Betrag nach dem Selbstbehalt-Modell (KPVG Art. 8).
// Was hier sichtbar sein muss:
//   1. ein Betrag auch OHNE erfasste Prämie — Graubünden deckelt nicht auf die eigene Prämie
//      (KEIN_PRAEMIENDECKEL.GR); der Vorbehalt sagt, dass die Richtprämie verbilligt wird.
//   2. keine Einkommensgrenze in der Anzeige, weder die Kinder-Grenzen (65 000 … 80 000) noch die
//      alten Musterwerte (45 000 / 2 250).
//   3. Prämienregion und der Bündner Vorbehalt mit Basisjahr (Vorjahr, Art. 8a Abs. 1 KPVG).
//   4. die Anmeldefrist 31.12. des Anspruchsjahres (Art. 14 Abs. 1 VOzKPVG).

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'GR', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: extra.plz || '7000', city: extra.city || 'Chur', rentAmount: 1200 },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 450 },
});

describe('K31 IPV-Rechner, Kanton Graubünden', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../data/plzGemeinde.js');
    await import('../config/ipvGraubuenden.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('zeigt den Betrag: 30 000 im Jahr, Chur → 3 516/Jahr, 293/Monat', () => {
    const html = render(profil(2500));
    expect(html).toContain('premium.eligible');
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).toContain('CHF 3’516');
    expect(html).toContain('CHF 293');
  });

  it('auch ohne erfasste Prämie ein Betrag — kein Deckel in GR', () => {
    const html = render(profil(2500, { kkPremium: null }));
    expect(html).not.toContain('ipv.offenGrund.praemie');
    expect(html).toContain('CHF 3’516');
  });

  it('nennt keine Einkommensgrenze — weder die Kinder-Grenzen noch die alten Musterwerte', () => {
    const html = render(profil(2500));
    expect(html).not.toContain('premium.maxIncome');
    for (const zahl of [45000, 2250, 65000, 80000, 59160]) {
      expect(html).not.toContain(String(zahl));
      expect(html).not.toContain(geldZahl(zahl));
    }
  });

  it('Prämienregion, Basisjahr und der Bündner Vorbehalt', () => {
    const html = render(profil(2500));
    expect(html).toContain('ipv.jahrRegion(2026|1)');
    expect(html).toContain('ipv.vorbehaltGR(2026|2025)');
    expect(render(profil(2500, { plz: '7130', city: 'Ilanz/Glion' }))).toContain('ipv.jahrRegion(2026|3)');
  });

  it('die Anmeldefrist steht beim Betrag', () => {
    expect(render(profil(2500))).toContain('ipv.grFristLaeuft(2026)');
  });

  it('über der Grenze: eigener Satz, keine Grenze als Zahl', () => {
    const html = render(profil(60000 / 12));
    expect(html).toContain('ipv.grKeinAnspruch');
    expect(html).not.toContain('ipv.incomeAboveLimit');
  });

  it('Kinder im Bereich der Vergleichsrechnung: Orientierung mit dem Bündner Grund', () => {
    const html = render(profil(2500, { children: [{ age: 5 }] }));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.offenGrund.grKinder');
  });

  it('kein roher Schlüssel bleibt stehen: alle GR-Texte in allen fünf Sprachen', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['vorbehaltGR', 'grKeinAnspruch', 'grFristLaeuft']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      expect(texte.ipv.vorbehaltGR, `${sprache}: Platzhalter`).toContain('{basisjahr}');
      expect(texte.ipv.grFristLaeuft, `${sprache}: Platzhalter`).toContain('{jahr}');
      expect(typeof texte.ipv.offenGrund.grKinder, `${sprache}: offenGrund.grKinder`).toBe('string');
    }
  });

  it('Paare und unbekannte PLZ: Orientierung mit Grund statt Zahl', () => {
    const paar = render({ ...profil(2500), basis: { ...profil(2500).basis, maritalStatus: 'married' } });
    expect(paar).toContain('ipv.orientierungOffen');
    expect(render(profil(2500, { plz: '0000', city: 'Nirgendwo' }))).toContain('ipv.orientierungOffen');
  });
});
