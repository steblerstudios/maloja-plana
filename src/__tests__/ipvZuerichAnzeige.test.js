import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für ZH den Betrag nach dem amtlichen Modell und die
// Einkommensgrenze der SVA-Tabelle, nie die entfernten Musterwerte (54 900 / 3 000).

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome) => ({
  basis: { canton: 'ZH', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome },
  wohnen: { postalCode: '8004', city: 'Zürich', rentAmount: 1400 },
  versicherungen: { kkPremium: 480 },
});

describe('K31 IPV-Rechner, Kanton Zürich', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../data/plzGemeinde.js');
    await import('../config/ipvZuerich.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('Einkommen 2 000/Monat, Stadt Zürich: 5 376 − 8.4 % × 24 000 = 3 360/Jahr, 280/Monat', () => {
    const html = render(profil(2000));
    expect(html).toContain('premium.eligible');
    expect(html).toContain('CHF 280');
    expect(html).toContain('CHF 3360');
    expect(html).toContain((64000).toLocaleString());
    expect(html).not.toContain('ipv.orientierungOffen');
    expect(html).not.toContain((54900).toLocaleString());
  });

  it('über der Grenze: «Einkommen über Grenze» mit der amtlichen Grenze 64 000', () => {
    const html = render(profil(6000));
    expect(html).toContain('ipv.incomeAboveLimit(64000)');
    expect(html).not.toContain('premium.eligible');
  });

  // Fachprüfung 20.09.2026: eine konkret gerechnete Zahl braucht ihr Anspruchsjahr, die
  // Prämienregion und die amtlichen Vorbehalte — sonst wirkt sie verbindlicher, als sie ist.
  it('zeigt Anspruchsjahr, Prämienregion, Näherung und Rückzahlungs-Vorbehalt', () => {
    const html = render(profil(2000));
    expect(html).toContain('ipv.jahrRegion(2026|1)');
    expect(html).toContain('ipv.naeherung');
    expect(html).toContain('ipv.vorbehalt(2026|2024)');
  });

  it('auch über der Grenze bleiben Jahr und Vorbehalt sichtbar', () => {
    const html = render(profil(6000));
    expect(html).toContain('ipv.jahrRegion(2026|1)');
    expect(html).toContain('ipv.vorbehalt(2026|2024)');
  });

  // Ohne Betrag: der Grund gehört sichtbar dazu. «Kein Betrag» heisst hier «eine Angabe fehlt»,
  // nicht «der Kanton ist ungeprüft».
  it.each([
    ['Paar', { household: { adults: 2, children: [] } }, 'ipv.offenGrund.haushalt'],
    ['ohne Geburtsdatum', { dateOfBirth: '' }, 'ipv.offenGrund.alter'],
  ])('%s: nennt den Grund, kein Jahr, kein Betrag', (_, basisPatch, grundKey) => {
    const p = profil(2000);
    const html = renderToStaticMarkup(React.createElement(PremiumSubsidy, {
      palette, t, data: { ...p, basis: { ...p.basis, ...basisPatch } }, onUpdateData: () => {},
    }));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain(grundKey);
    expect(html).not.toContain('ipv.jahrRegion');
    expect(html).not.toContain('premium.eligible');
  });

  it('Kantonsvergleich zeigt ZH nicht mit Einzelwerten (hat keine)', () => {
    const html = render(profil(2000));
    expect(html).not.toContain('Single: CHF');
  });
});
