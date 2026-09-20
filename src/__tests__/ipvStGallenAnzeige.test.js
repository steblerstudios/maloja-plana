import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für SG den Betrag nach dem Belastungsgrenzen-Modell.
// Vier Dinge, die St.Gallen von den vier Kantonen davor unterscheidet und die hier
// sichtbar sein müssen:
//   1. 🛑 KEIN Deckel auf die effektive Prämie — SG rechnet auch ohne erfasste Prämie,
//      und eine erfasste Prämie ändert den Betrag nicht (weder sGS 331.538 noch 331.111
//      kennen eine Begrenzung).
//   2. keine publizierte Einkommensgrenze → gar keine Zahl, auch nicht die alten
//      Musterwerte (48 000 / 2 400) und auch nicht die abgeleiteten Nullpunkte.
//   3. drei Prämienregionen, also eine Region in der Anzeige (anders als AG).
//   4. zwei verschiedene Gründe für «kein Betrag»: über der Grenze, oder unter dem
//      Mindestbetrag von Fr. 100 nach Art. 20.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, extra = {}) => ({
  basis: { canton: 'SG', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: extra.children || [] } },
  finanzen: { monthlyIncome, ...(extra.finanzen || {}) },
  wohnen: { postalCode: extra.plz || '9000', city: extra.city || 'St.Gallen', rentAmount: 1200 },
  versicherungen: extra.kkPremium != null ? { kkPremium: extra.kkPremium } : {},
});

describe('K31 IPV-Rechner, Kanton St.Gallen', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../data/plzGemeinde.js');
    await import('../config/ipvStGallen.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('🛑 zeigt einen Betrag OHNE erfasste Prämie — als einziger der fünf Kantone', () => {
    const html = render(profil(1500));
    expect(html).toContain('premium.eligible');
    expect(html).not.toContain('ipv.orientierungOffen');
    // 18 000 massgebend → 12,16 + (18 000 − 18 700 < 0) → 12,16 %
    // 6 285.60 − 2 188.80 = 4 096.80 → 4 097/Jahr, 341/Monat
    expect(html).toContain('CHF 4097');
    expect(html).toContain('CHF 341');
  });

  it('eine erfasste Prämie ändert den Betrag nicht — sie geht in die Rechnung nicht ein', () => {
    const ohne = render(profil(1500));
    const tief = render(profil(1500, { kkPremium: 150 }));
    const hoch = render(profil(1500, { kkPremium: 900 }));
    for (const html of [tief, hoch]) {
      expect(html).toContain('CHF 4097');
    }
    expect(ohne).toContain('CHF 4097');
  });

  it('der Vorbehalt sagt, dass die Referenzprämie die Grundlage ist — nicht die eigene Prämie', () => {
    const html = render(profil(1500));
    expect(html).toContain('ipv.vorbehaltSG');
    // Bezugsjahr −2: für 2026 die Steuerperiode 2024
    expect(html).toContain('2024');
  });

  it('nennt keine Einkommensgrenze — weder eine amtliche noch die alten Musterwerte', () => {
    const html = render(profil(1500));
    expect(html).not.toContain('premium.maxIncome');
    expect(html).not.toContain((48000).toLocaleString());
    // Auch die abgeleiteten Nullpunkte stehen nirgends — sie wären unsere eigene Rechnung.
    for (const zahl of [38833, 38414, 41700]) {
      expect(html).not.toContain(String(zahl));
      expect(html).not.toContain(zahl.toLocaleString());
    }
  });

  it('zeigt die Prämienregion (anders als AG, das keine kennt)', () => {
    expect(render(profil(1500))).toContain('ipv.jahrRegion');
    // Wattwil liegt in Region 3, St.Gallen in Region 1 — verschiedene Beträge
    const r1 = render(profil(1500));
    const r3 = render(profil(1500, { plz: '9630', city: 'Wattwil' }));
    expect(r1).not.toBe(r3);
  });

  it('über der Grenze: der eigene Grund, nicht «Einkommen über Grenze (CHF …)»', () => {
    const html = render(profil(4000));
    expect(html).toContain('ipv.sgKeinAnspruch');
    expect(html).not.toContain('ipv.incomeAboveLimit');
  });

  it('unter dem Mindestbetrag: ein anderer Satz als «kein Anspruch»', () => {
    // Region 1, massgebendes Einkommen im Band 38 414–38 833: Anspruch besteht,
    // wird aber nach Art. 20 nicht ausgerichtet. 38 500 / 12 ≈ 3 208.33 im Monat.
    const html = render(profil(3208.33));
    expect(html).toContain('ipv.sgUnterMindestbetrag');
    expect(html).not.toContain('ipv.sgKeinAnspruch');
  });

  it('kein roher Schlüssel bleibt stehen: alle SG-Texte sind in de.js vorhanden', async () => {
    const de = (await import('../i18n/de.js')).default;
    for (const k of ['vorbehaltSG', 'sgKeinAnspruch', 'sgUnterMindestbetrag', 'sgFristLaeuft', 'sgFristFolgejahr']) {
      expect(de.ipv[k], `de.js: ipv.${k} fehlt`).toBeTruthy();
      expect(typeof de.ipv[k]).toBe('string');
    }
  });

  it('Paare, Kinder ohne Alter und unbekannte PLZ: Orientierung mit Grund statt Zahl', () => {
    const paar = render({ ...profil(1500), basis: { ...profil(1500).basis, maritalStatus: 'married' } });
    expect(paar).toContain('ipv.orientierungOffen');
    expect(render(profil(1500, { children: [{ age: 0 }] }))).toContain('ipv.orientierungOffen');
    expect(render(profil(1500, { plz: '0000', city: 'Nirgendwo' }))).toContain('ipv.orientierungOffen');
  });
});
