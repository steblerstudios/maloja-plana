import { describe, it, expect, beforeAll } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für BS den Betrag nach der Stufentabelle der KVO (Anhang 2).
// Was hier sichtbar sein muss:
//   1. ein Betrag nur MIT erfasster Prämie (KVO § 22 Abs. 2 deckelt auf die geschuldete Prämie).
//   2. die Leistungsgrenze, weil sie amtlich als Zahl publiziert ist (T 1) — und zwar die der
//      Haushaltsgrösse, nicht die alten Musterwerte (54 000 / 3 000).
//   3. keine Prämienregion und KEIN Satz über den Aargau (`jahrOhneRegion` spricht von AG).
//   4. der Weg: Antrag beim Amt für Sozialbeiträge, ab dem Folgemonat — nicht «automatisch».
//   5. der Betrag mit Zuschlag für alternative Modelle steht daneben (T 4), nicht statt.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'BS', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: '4051', city: 'Basel', rentAmount: 1200 },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 500 },
});

describe('K31 IPV-Rechner, Kanton Basel-Stadt', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvBaselStadt.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('zeigt den Betrag: 36 000 im Jahr, allein → Gruppe 12, 118/Monat, 1 416/Jahr', () => {
    const html = render(profil(3000));
    expect(html).toContain('premium.eligible');
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).toContain('CHF 118');
    expect(html).toContain('CHF 1’416');
  });

  it('ohne erfasste Prämie: keine Zahl, sondern der Grund', () => {
    const html = render(profil(3000, { kkPremium: null }));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.offenGrund.praemie');
    expect(html).not.toContain('CHF 1’416');
  });

  it('nennt die amtliche Leistungsgrenze der Haushaltsgrösse — nicht die Musterwerte', () => {
    const allein = render(profil(3000));
    expect(allein).toContain('premium.maxIncome(' + geldZahl(49375) + ')');
    const mitKind = render(profil(4000, { children: [{ age: 5 }] }));
    expect(mitKind).toContain('premium.maxIncome(' + geldZahl(79000) + ')');
    for (const html of [allein, mitKind]) {
      expect(html).not.toContain(geldZahl(54000));
      expect(html).not.toContain('Single: ');
    }
  });

  it('kein Satz über Prämienregionen oder den Aargau, sondern der Basler Satz', () => {
    const html = render(profil(3000));
    expect(html).toContain('ipv.jahrBS(2026)');
    expect(html).not.toContain('ipv.jahrOhneRegion');
    expect(html).not.toContain('ipv.jahrRegion');
    expect(html).toContain('ipv.vorbehaltBS');
  });

  it('der Weg: Antrag beim ASB — nie «automatisch via Steuerdaten»', () => {
    const html = render(profil(3000));
    expect(html).toContain('ipv.noteApplyAsb');
    expect(html).not.toContain('ipv.noteAutoTaxData');
    // Hinweis beim Betrag mit beiden Tabellenwerten: Standard 118, mit AVM-Zuschlag 148.
    expect(html).toContain('ipv.bsAntrag(118|148)');
  });

  it('über der Leistungsgrenze: der eigene Satz mit der Grenze', () => {
    const html = render(profil(4115));
    expect(html).toContain('ipv.bsKeinAnspruch(' + geldZahl(49375) + ')');
    expect(html).not.toContain('ipv.incomeAboveLimit');
  });

  it('kleines Erwerbseinkommen ohne erkennbare Ausnahme: der Grund «hypothetisches Einkommen»', () => {
    const html = render(profil(800));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain('ipv.offenGrund.bsHypothetisch');
    expect(html).not.toContain('CHF 444');
  });

  it('kein roher Schlüssel bleibt stehen: alle BS-Texte in allen fünf Sprachen', async () => {
    // Die Sprachdateien NICHT als `it` importieren — das überschriebe vitests `it`.
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['vorbehaltBS', 'bsKeinAnspruch', 'bsAntrag', 'jahrBS']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      expect(typeof texte.ipv.noteApplyAsb, `${sprache}.js: ipv.noteApplyAsb fehlt`).toBe('string');
      for (const g of ['bsHypothetisch', 'bsSaeule3a']) {
        expect(typeof texte.ipv.offenGrund[g], `${sprache}.js: ipv.offenGrund.${g} fehlt`).toBe('string');
      }
      expect(texte.ipv.bsAntrag, `${sprache}: Platzhalter`).toContain('{monatAlternativ}');
      expect(texte.ipv.bsAntrag, `${sprache}: Platzhalter`).toContain('{monat}');
      expect(texte.ipv.bsKeinAnspruch, `${sprache}: Platzhalter`).toContain('{grenze}');
      expect(texte.ipv.jahrBS, `${sprache}: Platzhalter`).toContain('{jahr}');
    }
  });

  it('Paare und Kinder ohne Alter: Orientierung mit Grund statt Zahl', () => {
    const paar = render({ ...profil(3000), basis: { ...profil(3000).basis, maritalStatus: 'married' } });
    expect(paar).toContain('ipv.orientierungOffen');
    expect(render(profil(3000, { children: [{ age: 0 }] }))).toContain('ipv.orientierungOffen');
  });
});
