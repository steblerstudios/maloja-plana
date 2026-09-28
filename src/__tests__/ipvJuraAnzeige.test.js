import { describe, it, expect, beforeAll } from 'vitest';
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

// K31 — Jura: der IPV-Rechner zeigt bewusst keinen Betrag, sondern den Grund (das steuerbare
// Einkommen der Veranlagung kennt die App nicht). Sichtbar sein muss: kein Betrag, kein
// «berechtigt», keine Grenze, keine alten Musterwerte (42 000 / 2 100) — und der Grund.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, children = []) => ({
  basis: { canton: 'JU', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children } },
  finanzen: { monthlyIncome },
  wohnen: { postalCode: '2800', city: 'Delémont', rentAmount: 1000 },
  versicherungen: { kkPremium: 400 },
});

describe('K31 IPV-Rechner, Kanton Jura', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../data/plzGemeinde.js');
    await import('../config/ipvJura.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('tief und hoch: kein Betrag, der Grund steht da', () => {
    for (const m of [1500, 6000]) {
      const html = render(profil(m));
      expect(html).toContain('ipv.orientierungOffen');
      expect(html).toContain('ipv.offenGrund.steuerbaresEinkommen');
      expect(html).not.toContain('premium.eligible');
      expect(html).not.toContain('premium.maxIncome');
      expect(html).not.toMatch(/42[’']000|2[’']100/);
    }
  });

  // Fachprüfung #483 ⚠️ 1: keine Sackgasse — kein Eingabefeld «Geburtsdatum», wenn ohnehin keine Zahl kommt.
  it('ohne Geburtsdatum und als Paar: der Jura-Grund, kein Eingabefeld', () => {
    const ohne = render({ ...profil(1500), basis: { ...profil(1500).basis, dateOfBirth: '' } });
    expect(ohne).toContain('ipv.offenGrund.steuerbaresEinkommen');
    expect(ohne).not.toContain('ipv.offenGrund.alter');
    expect(ohne).not.toContain('chapters.basis.fields.dateOfBirth');
    const paar = render({ ...profil(1500), basis: { ...profil(1500).basis, maritalStatus: 'married' } });
    expect(paar).toContain('ipv.offenGrund.steuerbaresEinkommen');
    expect(paar).not.toContain('ipv.offenGrund.haushalt');
  });

  it('nichts wird von der Prämie abgezogen', () => {
    expect(ipvAbzug(profil(1500))).toMatchObject({ betrag: 0, grund: 'keiner' });
  });

  it('der Grund in allen fünf Sprachen', () => {
    for (const [sprache, s] of Object.entries({ de, fr, it: itSprache, en, rm })) {
      expect(typeof s.ipv.offenGrund.steuerbaresEinkommen, sprache).toBe('string');
      expect(s.ipv.offenGrund.steuerbaresEinkommen.length).toBeGreaterThan(80);
      // Fachprüfung #483 ⚠️ 3: Frist mit «31», 30 Tage — die Zahlen stehen in jeder Sprache.
      expect(s.ipv.offenGrund.steuerbaresEinkommen, sprache).toMatch(/31/);
      expect(s.ipv.offenGrund.steuerbaresEinkommen, sprache).toMatch(/30/);
    }
  });
});
