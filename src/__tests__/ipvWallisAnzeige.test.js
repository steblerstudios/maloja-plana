import { describe, it, expect, beforeAll } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import { ipvAbzug } from '../data/ipvAbzug.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js';
import rm from '../i18n/rm.js';

// K31 — der IPV-Rechner zeigt für VS den Betrag nach der degressiven Skala (VüIPV SGS 832.105,
// Einkommenstabelle 2026). Was hier sichtbar sein muss:
//   1. ein Betrag nur MIT erfasster Prämie (Art. 6 Abs. 6: höchstens die tatsächliche Prämie).
//   2. die oberste Grenze des Haushalts aus der Tabelle — aber keine bei einem Kind (Zelle strittig)
//      und keine alten Musterwerte (45 000 / 2 400).
//   3. Prämienregion und Vorbehalt mit Basisjahr 2024; Weg automatisch, keine Anmeldefrist.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'VS', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: extra.plz || '1950', city: extra.city ?? 'Sion', rentAmount: 1200 },
  versicherungen: extra.kkPremium !== undefined ? (extra.kkPremium === null ? {} : { kkPremium: extra.kkPremium }) : { kkPremium: 450 },
});

describe('K31 IPV-Rechner, Kanton Wallis', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../data/plzGemeinde.js');
    await import('../config/ipvWallis.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('zeigt den Betrag: 20 000 im Jahr, Sion → 4 712/Jahr, 393/Monat', () => {
    const html = render(profil(20000 / 12));
    expect(html).toContain('premium.eligible');
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).toContain('CHF 4’712');
    expect(html).toContain('CHF 393');
  });

  it('ohne erfasste Prämie: keine Zahl, sondern der Grund', () => {
    const html = render(profil(20000 / 12, { kkPremium: null }));
    expect(html).toContain('ipv.offenGrund.praemie');
    expect(html).not.toContain('CHF 4’712');
  });

  it('nennt die oberste Grenze aus der Tabelle — nicht bei einem Kind, nie die Musterwerte', () => {
    expect(render(profil(2000))).toContain('premium.maxIncome(' + geldZahl(38500));
    expect(render(profil(2000, { children: [{ age: 5 }, { age: 8 }] }))).toContain('premium.maxIncome(' + geldZahl(70125));
    const einKind = render(profil(2000, { children: [{ age: 5 }] }));
    expect(einKind).not.toContain('premium.maxIncome');
    for (const z of [63000, 61000, 45000]) expect(einKind).not.toContain(geldZahl(z));
  });

  it('Prämienregion, Walliser Vorbehalt mit Basisjahr 2024, Weg automatisch', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.jahrRegion(2026|1)');
    expect(html).toContain('ipv.vorbehaltVS(2026|2024)');
    expect(html).toContain('ipv.noteAutoTaxData');
    expect(render(profil(2000, { plz: '3900', city: 'Brig-Glis' }))).toContain('ipv.jahrRegion(2026|2)');
  });

  it('keine Anmeldefrist: der geschätzte Betrag wird abgezogen', () => {
    expect(ipvAbzug(profil(20000 / 12))).toMatchObject({ betrag: 393, grund: 'geschaetzt' });
  });

  it('über der Grenze und strittige Zelle: je ein eigener Satz', () => {
    expect(render(profil(38501 / 12))).toContain('ipv.vsKeinAnspruch');
    const strittig = render(profil(62000 / 12, { children: [{ age: 5 }] }));
    expect(strittig).toContain('ipv.offenGrund.mindestanspruch');
    expect(render(profil(2000, { children: [{ birthDate: '2026-02-01' }] }))).toContain('ipv.offenGrund.kindImJahrGeboren');
    expect(render(profil(4000, { finanzen: { pension3a: 10000 } }))).toContain('ipv.offenGrund.saeule3aStrittig');
  });

  it('kein roher Schlüssel bleibt stehen: alle VS-Texte in allen fünf Sprachen', () => {
    for (const [sprache, texte] of Object.entries({ de, fr, it: itSprache, en, rm })) {
      for (const k of ['vorbehaltVS', 'vsKeinAnspruch']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      expect(texte.ipv.vorbehaltVS).toContain('{basisjahr}');
      for (const g of ['kindImJahrGeboren', 'saeule3aStrittig']) {
        expect(typeof texte.ipv.offenGrund[g], `${sprache}: offenGrund.${g}`).toBe('string');
        expect(texte.ipv.offenGrund[g].length).toBeGreaterThan(40);
      }
    }
  });
});
