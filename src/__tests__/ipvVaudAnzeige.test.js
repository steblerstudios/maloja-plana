import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für VD den «subside ordinaire» nach dem Arrêté 2026 und die
// Grenze aus art. 2, nie die entfernten Musterwerte (54 000 / 3 000). Der spezifische
// Subside erscheint als Hinweis ohne Betrag.

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome, over = {}) => ({
  basis: { canton: 'VD', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] }, ...(over.basis || {}) },
  finanzen: { monthlyIncome },
  wohnen: { postalCode: '1003', city: 'Lausanne', rentAmount: 1500, ...(over.wohnen || {}) },
  versicherungen: { kkPremium: 500, ...(over.versicherungen || {}) },
});

describe('K31 IPV-Rechner, Kanton Waadt', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../data/plzGemeinde.js');
    await import('../config/ipvVaud.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('2 000/Monat, Lausanne: 24 000 − 2 200 = 21 800 → 300/Monat, 3 600/Jahr', () => {
    const html = render(profil(2000));
    expect(html).toContain('premium.eligible');
    expect(html).toContain('CHF 300');
    expect(html).toContain('CHF 3600');
    expect(html).toContain((50000).toLocaleString());
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).not.toContain((54000).toLocaleString());
  });

  it('über der Grenze: «Einkommen über Grenze» mit der amtlichen Grenze 50 000', () => {
    const html = render(profil(7000));
    expect(html).toContain('ipv.incomeAboveLimit(50000)');
    expect(html).not.toContain('premium.eligible');
  });

  it('zeigt Anspruchsjahr, Prämienregion, Näherung und den Waadtländer Vorbehalt', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.jahrRegion(2026|1)');
    expect(html).toContain('ipv.naeherung');
    expect(html).toContain('ipv.vorbehaltVD');
    // Der Berner Vorbehalt spricht vom Basisjahr — er wäre hier sachlich falsch.
    expect(html).not.toContain('ipv.vorbehaltBE');
  });

  it('Hinweis auf den spezifischen Subside: Text ja, Betrag nein', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.vdSpezifischerSubside');
    // Der Schlüssel steht ohne Parameter da — der Hinweis trägt nie eine Zahl.
    expect(html).not.toContain('ipv.vdSpezifischerSubside(');
  });

  it('bei tiefer Prämie im Verhältnis zum Einkommen erscheint der Hinweis nicht', () => {
    const html = render(profil(4000, { versicherungen: { kkPremium: 120 } }));
    expect(html).toContain('premium.eligible');
    expect(html).not.toContain('ipv.vdSpezifischerSubside');
  });

  // Ohne Betrag: der Grund gehört sichtbar dazu. «Kein Betrag» heisst hier «eine Angabe fehlt»,
  // nicht «der Kanton ist ungeprüft».
  it.each([
    ['Paar', { basis: { household: { adults: 2, children: [] } } }, 'ipv.offenGrund.haushalt'],
    ['ohne Geburtsdatum', { basis: { dateOfBirth: '' } }, 'ipv.offenGrund.alter'],
    ['PLZ über beide Prämienregionen', { wohnen: { postalCode: '1080', city: '' } }, 'ipv.offenGrund.region'],
  ])('%s: nennt den Grund, kein Jahr, kein Betrag', (_, patch, grundKey) => {
    const html = render(profil(2000, patch));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain(grundKey);
    expect(html).not.toContain('ipv.jahrRegion');
    expect(html).not.toContain('ipv.vdSpezifischerSubside');
    expect(html).not.toContain('premium.eligible');
  });

  it('Kantonsvergleich zeigt VD nicht mit Einzelwerten (hat keine mehr)', () => {
    expect(render(profil(2000))).not.toContain('Single: CHF');
  });
});
