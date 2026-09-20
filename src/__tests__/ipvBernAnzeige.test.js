import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für BE den Betrag nach der amtlichen Stufentabelle und die
// Einkommensgrenze des Berechnungsschemas, nie die entfernten Musterwerte (45 000 / 2 400).

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome) => ({
  basis: { canton: 'BE', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome },
  wohnen: { postalCode: '3011', city: 'Bern', rentAmount: 1200 },
  versicherungen: { kkPremium: 420 },
});

describe('K31 IPV-Rechner, Kanton Bern', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../data/plzGemeinde.js');
    await import('../config/ipvBern.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('1 500/Monat, Stadt Bern (Region 1): 18 000 − 2 200 = 15 800 → Stufe bis 17 000 → 147/Monat', () => {
    const html = render(profil(1500));
    expect(html).toContain('premium.eligible');
    expect(html).toContain('CHF 147');
    expect(html).toContain('CHF 1764');
    expect(html).toContain((35000).toLocaleString());
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).not.toContain((45000).toLocaleString());
  });

  it('über der Grenze: «Einkommen über Grenze» mit der amtlichen Grenze 35 000', () => {
    const html = render(profil(3200));
    expect(html).toContain('ipv.incomeAboveLimit(35000)');
    expect(html).not.toContain('premium.eligible');
  });

  it('zeigt Anspruchsjahr, Prämienregion, Näherung und Rückzahlungs-Vorbehalt', () => {
    const html = render(profil(1500));
    expect(html).toContain('ipv.jahrRegion(2026|1)');
    expect(html).toContain('ipv.naeherung');
    expect(html).toContain('ipv.vorbehalt(2026)');
  });

  // Ohne Betrag: der Grund gehört sichtbar dazu. «Kein Betrag» heisst hier «eine Angabe fehlt»,
  // nicht «der Kanton ist ungeprüft».
  it.each([
    ['Paar', { basis: { household: { adults: 2, children: [] } } }, 'ipv.offenGrund.haushalt'],
    ['ohne Geburtsdatum', { basis: { dateOfBirth: '' } }, 'ipv.offenGrund.alter'],
    ['Gemeinde, bei der die amtlichen Listen auseinandergehen', { wohnen: { postalCode: '3647', city: '' } }, 'ipv.offenGrund.region'],
  ])('%s: nennt den Grund, kein Jahr, kein Betrag', (_, patch, grundKey) => {
    const p = profil(1500);
    const html = renderToStaticMarkup(React.createElement(PremiumSubsidy, {
      palette, t, onUpdateData: () => {},
      data: { ...p, basis: { ...p.basis, ...(patch.basis || {}) }, wohnen: { ...p.wohnen, ...(patch.wohnen || {}) } },
    }));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain(grundKey);
    expect(html).not.toContain('ipv.jahrRegion');
    expect(html).not.toContain('premium.eligible');
  });

  it('Kantonsvergleich zeigt BE nicht mit Einzelwerten (hat keine)', () => {
    expect(render(profil(1500))).not.toContain('Single: CHF');
  });
});
