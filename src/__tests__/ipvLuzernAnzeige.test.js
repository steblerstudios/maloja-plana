import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für LU den Betrag nach dem Richtprämien-Modell.
// Was hier sichtbar sein muss:
//   1. ein Betrag nur MIT erfasster Prämie (§ 7 Abs. 7 SRL 866 deckelt auf die geschuldete
//      Prämie) — anders als SG.
//   2. keine Einkommensgrenze in der Anzeige, auch nicht die Kinder-Grenze 77 114 und nicht
//      die alten Musterwerte (54 000 / 2 700).
//   3. die Prämienregion, und ein Vorbehalt OHNE festes Steuerjahr («letzte rechtskräftige
//      Veranlagung», § 7 Abs. 4 SRL 866).
//   4. die Anmeldefrist Ende Oktober des Vorjahres (§ 12 SRL 866).

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'LU', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: extra.plz || '6003', city: extra.city || 'Luzern', rentAmount: 1200 },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 450 },
});

describe('K31 IPV-Rechner, Kanton Luzern', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../data/plzGemeinde.js');
    await import('../config/ipvLuzern.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('zeigt den Betrag: 20 000 im Jahr, Stadt Luzern → 3 388/Jahr, 282/Monat', () => {
    const html = render(profil(20000 / 12));
    expect(html).toContain('premium.eligible');
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).toContain('CHF 3388');
    expect(html).toContain('CHF 282');
  });

  it('ohne erfasste Prämie: keine Zahl, sondern der Grund', () => {
    const html = render(profil(20000 / 12, { kkPremium: null }));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.offenGrund.praemie');
    expect(html).not.toContain('CHF 3388');
  });

  it('nennt keine Einkommensgrenze — weder die Kinder-Grenze noch die alten Musterwerte', () => {
    const html = render(profil(2000, { children: [{ age: 5 }] }));
    expect(html).not.toContain('premium.maxIncome');
    for (const zahl of [54000, 77114, 96392]) {
      expect(html).not.toContain(String(zahl));
      expect(html).not.toContain(zahl.toLocaleString());
    }
  });

  it('Prämienregion und der Luzerner Vorbehalt', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.jahrRegion(2026|1)');
    expect(html).toContain('ipv.vorbehaltLU');
    const r3 = render(profil(2000, { plz: '6280', city: 'Hochdorf' }));
    expect(r3).toContain('ipv.jahrRegion(2026|3)');
  });

  it('die Anmeldefrist steht beim Betrag', () => {
    expect(render(profil(2000))).toMatch(/ipv\.luFrist(Vorbei|Laeuft)/);
  });

  it('über der Grenze und unter dem Mindestbetrag: je ein eigener Satz', () => {
    expect(render(profil(45000 / 12))).toContain('ipv.luKeinAnspruch');
    const band = render(profil(44000 / 12));
    expect(band).toContain('ipv.luUnterMindestbetrag');
    expect(band).not.toContain('ipv.luKeinAnspruch');
    expect(band).not.toContain('ipv.incomeAboveLimit');
  });

  it('kein roher Schlüssel bleibt stehen: alle LU-Texte in allen fünf Sprachen', async () => {
    // Die Sprachdateien NICHT als `it` importieren — das überschriebe vitests `it`.
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['vorbehaltLU', 'luKeinAnspruch', 'luUnterMindestbetrag', 'luFristLaeuft', 'luFristVorbei']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      for (const k of ['luFristLaeuft', 'luFristVorbei']) {
        expect(texte.ipv[k], `${sprache}: Platzhalter`).toContain('{vorjahr}');
      }
    }
  });

  it('Paare, Kinder ohne Alter und unbekannte PLZ: Orientierung mit Grund statt Zahl', () => {
    const paar = render({ ...profil(2000), basis: { ...profil(2000).basis, maritalStatus: 'married' } });
    expect(paar).toContain('ipv.orientierungOffen');
    expect(render(profil(2000, { children: [{ age: 0 }] }))).toContain('ipv.orientierungOffen');
    expect(render(profil(2000, { plz: '0000', city: 'Nirgendwo' }))).toContain('ipv.orientierungOffen');
  });
});
