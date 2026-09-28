import { describe, it, expect, beforeAll } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für SH den Betrag nach dem Selbstbehalt-Modell (Dekret SHR 832.110).
// Was hier sichtbar sein muss:
//   1. ein Betrag nur MIT erfasster Prämie (§ 17 Abs. 2: was die Prämie übersteigt, geht zurück).
//   2. keine Einkommensgrenze — auch nicht die Versand-Grenzwerte der Verordnung (39 647 / 37 467),
//      die keine Anspruchsgrenze sind, und nicht die alten Musterwerte (45 000 / 2 250).
//   3. die Prämienregion und der Vorbehalt mit dem Steuerjahr 2024 (§ 12 Abs. 2 Dekret).
//   4. die Antragsfrist 30. April (§ A1-3 Verordnung).

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'SH', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: extra.plz || '8200', city: extra.city || 'Schaffhausen', rentAmount: 1200 },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 450 },
});

describe('K31 IPV-Rechner, Kanton Schaffhausen', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../data/plzGemeinde.js');
    await import('../config/ipvSchaffhausen.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('zeigt den Betrag: 36 000 im Jahr, Stadt Schaffhausen → 1 222/Jahr, 102/Monat', () => {
    const html = render(profil(3000));
    expect(html).toContain('premium.eligible');
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).toContain('CHF 1’222');
    expect(html).toContain('CHF 102');
  });

  it('ohne erfasste Prämie: keine Zahl, sondern der Grund', () => {
    const html = render(profil(3000, { kkPremium: null }));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.offenGrund.praemie');
    expect(html).not.toContain('CHF 1’222');
  });

  it('nennt keine Einkommensgrenze — weder die Versand-Grenzwerte noch die alten Musterwerte', () => {
    const html = render(profil(3000));
    expect(html).not.toContain('premium.maxIncome');
    for (const zahl of [39647, 37467, 45000, 2250]) {
      expect(html).not.toContain(String(zahl));
      expect(html).not.toContain(geldZahl(zahl));
    }
  });

  it('Prämienregion und der Schaffhauser Vorbehalt mit dem Steuerjahr 2024', () => {
    const html = render(profil(3000));
    expect(html).toContain('ipv.jahrRegion(2026|1)');
    expect(html).toContain('ipv.vorbehaltSH(2026|2024)');
    expect(render(profil(3000, { plz: '8240', city: 'Thayngen' }))).toContain('ipv.jahrRegion(2026|2)');
  });

  it('die Antragsfrist steht beim Betrag, der Verfahrens-Hinweis nennt die SVA', () => {
    const html = render(profil(3000));
    expect(html).toMatch(/ipv\.shFrist(Vorbei|Laeuft)/);
    expect(html).toContain('ipv.noteApplySva(SH)');
  });

  it('über dem Nullpunkt und unter dem Mindestbetrag: je ein eigener Satz', () => {
    expect(render(profil(44400 / 12))).toContain('ipv.shKeinAnspruch');
    const band = render(profil(43800 / 12));
    expect(band).toContain('ipv.shUnterMindestbetrag');
    expect(band).not.toContain('ipv.shKeinAnspruch');
    expect(band).not.toContain('ipv.incomeAboveLimit');
  });

  it('kein roher Schlüssel bleibt stehen: alle SH-Texte in allen fünf Sprachen', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['vorbehaltSH', 'shKeinAnspruch', 'shUnterMindestbetrag', 'shFristLaeuft', 'shFristVorbei']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      expect(texte.ipv.vorbehaltSH, `${sprache}: Platzhalter`).toContain('{basisjahr}');
      for (const k of ['shFristLaeuft', 'shFristVorbei']) {
        expect(texte.ipv[k], `${sprache}: Platzhalter`).toContain('{jahr}');
      }
      expect(texte.ipv.shFristVorbei, `${sprache}: Platzhalter`).toContain('{folgejahr}');
    }
    // Fünf Sprachdateien nachladen dauert unter Last der ganzen Suite über 5 s (gemessen 28.09.2026).
  }, 30000);

  it('Paare, Kinder ohne Alter und unbekannte PLZ: Orientierung mit Grund statt Zahl', () => {
    const paar = render({ ...profil(3000), basis: { ...profil(3000).basis, maritalStatus: 'married' } });
    expect(paar).toContain('ipv.orientierungOffen');
    expect(render(profil(3000, { children: [{ age: 0 }] }))).toContain('ipv.orientierungOffen');
    expect(render(profil(3000, { plz: '0000', city: 'Nirgendwo' }))).toContain('ipv.orientierungOffen');
  });
});
