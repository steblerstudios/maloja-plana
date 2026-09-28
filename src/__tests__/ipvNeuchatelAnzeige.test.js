import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { zahl as geldZahl } from '../utils/geld.js';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für NE den Betrag der Klasse (RSN 821.102 + Décret 821.104).
// Sichtbar sein muss: der Betrag nur mit Prämie und Franchise 300; die oberste Grenze der Annexe
// (publiziert), nie die Musterwerte (48 000 / 2 400); ein eigener Jahres-Satz OHNE Prämienregion
// (nicht der Aargauer); der Vorbehalt mit dem Steuerjahr 2025; der Weg über das OCAB.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, over = {}) => ({
  basis: { canton: 'NE', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] }, ...(over.basis || {}) },
  finanzen: { monthlyIncome, ...(over.finanzen || {}) },
  wohnen: { postalCode: '2000', city: 'Neuchâtel', rentAmount: 1200 },
  versicherungen: { kkPremium: 600, franchise: '300', ...(over.versicherungen || {}) },
});

describe('K31 IPV-Rechner, Kanton Neuenburg', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvNeuchatel.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('2 000/Monat → S3 → CHF 515/Monat, Grenze 50 600, Weg OCAB', () => {
    const html = render(profil(2000));
    expect(html).toContain('premium.eligible');
    expect(html).toContain('CHF 515');
    expect(html).toContain('premium.maxIncome(' + geldZahl(50600) + ')');
    expect(html).toContain('ipv.noteAutoOcab');
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).not.toContain(geldZahl(48000));
    expect(html).not.toContain('ipv.noteAutoTaxData');
  });

  it('Jahr ohne Prämienregion mit dem NE-Satz, nicht dem Aargauer; Vorbehalt mit Steuerjahr 2025', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.jahrNE(2026)');
    expect(html).not.toContain('ipv.jahrOhneRegion');
    expect(html).not.toContain('ipv.jahrRegion');
    expect(html).toContain('ipv.vorbehaltNE(2026|2025)');
  });

  it('knapp über 15 000: Zahl und Hinweis auf das Gesuch beim GSR', () => {
    const html = render(profil(16000 / 12));
    expect(html).toContain('premium.eligible');
    expect(html).toContain('ipv.neRevenuMinimumNahe');
    expect(render(profil(2000))).not.toContain('ipv.neRevenuMinimumNahe');
  });

  it('Vorbehalt nennt die drei noch nicht eingerechneten Felder, die 160 je Kind und «mehr als 20 %»', async () => {
    const de = (await import('../i18n/de.js')).default.ipv.vorbehaltNE;
    expect(de).toMatch(/Familienzulagen/);
    expect(de).toMatch(/erhaltene Unterhaltsbeiträge fliessen hier noch nicht ein/);
    expect(de).toMatch(/bezahlte Unterhaltsbeiträge werden noch nicht abgezogen/);
    expect(de).toMatch(/160 Franken/);
    expect(de).toMatch(/mehr als 20 Prozent/);
    expect(de).not.toMatch(/Unterhaltsbeiträge; die App kennt sie nicht/);
  }, 20000);

  it('über der Grenze: eigener Satz mit der Grenze 50 600', () => {
    const html = render(profil(6000));
    expect(html).toContain('ipv.neKeinAnspruch(50600)');
    expect(html).not.toContain('premium.eligible');
  });

  it.each([
    ['Franchise 2 500', { versicherungen: { franchise: '2500' } }, 'ipv.offenGrund.neFranchise'],
    ['Einkommen unter 15 000', { monthly: 1000 }, 'ipv.offenGrund.neRevenuMinimum'],
    ['Paar', { basis: { household: { adults: 2, children: [] } } }, 'ipv.offenGrund.haushalt'],
    ['selbständig', { finanzen: { employmentType: 'selfEmployed' } }, 'ipv.offenGrund.neIndependant'],
    ['unter 26', { basis: { dateOfBirth: '2003-05-01' } }, 'ipv.offenGrund.neJeuneAdulte'],
  ])('%s: nennt den Grund, kein Betrag', (_, patch, grundKey) => {
    const html = render(profil(patch.monthly ?? 2000, patch));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain(grundKey);
    expect(html).not.toContain('premium.eligible');
    expect(html).not.toContain('ipv.jahrNE');
  });

  it('kein roher Schlüssel bleibt stehen: alle NE-Texte in allen fünf Sprachen', async () => {
    for (const sprache of ['de', 'fr', 'it', 'en', 'rm']) {
      const texte = (await import(`../i18n/${sprache}.js`)).default;
      for (const k of ['vorbehaltNE', 'neKeinAnspruch', 'jahrNE', 'noteAutoOcab']) {
        expect(typeof texte.ipv[k], `${sprache}.js: ipv.${k} fehlt`).toBe('string');
        expect(texte.ipv[k].length).toBeGreaterThan(40);
      }
      expect(texte.ipv.neRevenuMinimumNahe.length).toBeGreaterThan(40);
      for (const k of ['neRevenuMinimum', 'neFranchise', 'neIndependant', 'neJeuneAdulte']) expect(texte.ipv.offenGrund[k].length, `${sprache}: offenGrund.${k}`).toBeGreaterThan(40);
      expect(texte.ipv.vorbehaltNE, `${sprache}: Platzhalter`).toContain('{basisjahr}');
      expect(texte.ipv.jahrNE).toContain('{jahr}');
      expect(texte.ipv.neKeinAnspruch).toContain('{value}');
    }
  }, 20000);
});
