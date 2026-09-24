import { describe, it, expect, beforeAll } from 'vitest';
import { zahl as geldZahl } from '../utils/geld.js';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { preloadPLZ } from '../config/cantonalData.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';

// K31 — der IPV-Rechner zeigt für AG den Betrag nach dem amtlichen Richtprämien-Modell.
// Drei Dinge, die AG von ZH und BE unterscheiden und die hier sichtbar sein müssen:
//   1. keine Prämienregion (V KVGG § 4 Abs. 1) → `ipv.jahrOhneRegion` statt `ipv.jahrRegion`
//   2. keine publizierte Einkommensgrenze (§ 5 Abs. 5 KVGG) → gar keine Zahl, auch nicht
//      die alten Musterwerte (51 000 / 2 700)
//   3. Antragsfrist 31.12. des Vorjahres, für 2026 abgelaufen (§ 10 Abs. 4 KVGG)

const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const profil = (monthlyIncome) => ({
  basis: { canton: 'AG', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome },
  wohnen: { postalCode: '5000', city: 'Aarau', rentAmount: 1200 },
  versicherungen: { kkPremium: 420 },
});

describe('K31 IPV-Rechner, Kanton Aargau', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../config/ipvAargau.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('1 500/Monat: 18 000 − 8 500 = 9 500 massgebend → 5 830 − 1 662.50 = 4 167.50 → 4 168/Jahr', () => {
    const html = render(profil(1500));
    expect(html).toContain('premium.eligible');
    expect(html).toContain('CHF 347');
    expect(html).toContain('CHF 4’168');
    expect(html).not.toContain('ipv.orientierungOffen');
  });

  it('nennt keine Einkommensgrenze — weder eine amtliche noch die alten Musterwerte', () => {
    const html = render(profil(1500));
    expect(html).not.toContain('premium.maxIncome');
    expect(html).not.toContain(geldZahl(51000));
    // Auch die abgeleitete Grenze (33 314 massgebend bzw. 41 814 bereinigt) steht nirgends —
    // sie wäre unsere eigene Rechnung, keine amtliche Angabe.
    for (const zahl of [33314, 41814]) {
      expect(html).not.toContain(String(zahl));
      expect(html).not.toContain(geldZahl(zahl));
    }
  });

  it('ohne Anspruch: der Grund statt «Einkommen über Grenze (CHF …)»', () => {
    const html = render(profil(3500));
    expect(html).toContain('ipv.agKeinAnspruch');
    expect(html).not.toContain('ipv.incomeAboveLimit');
    expect(html).not.toContain('premium.eligible');
  });

  it('Anspruchsjahr ohne Prämienregion, Näherung, AG-Vorbehalt mit Basisjahr 2023', () => {
    const html = render(profil(1500));
    expect(html).toContain('ipv.jahrOhneRegion(2026)');
    expect(html).not.toContain('ipv.jahrRegion');
    expect(html).toContain('ipv.naeherung');
    // Drei Jahre zurück (§ 7 Abs. 1 KVGG) — der BE-Satz mit zwei Jahren wäre hier falsch.
    expect(html).toContain('ipv.vorbehaltAG(2026|2023)');
    expect(html).not.toContain('ipv.vorbehaltBE');
  });

  it('die Frist steht am Betrag, nicht erst im Kleingedruckten', () => {
    const html = render(profil(1500));
    expect(html).toContain('ipv.agFristAbgelaufen(2026|2025|2027)');
  });

  it.each([
    ['Paar', { basis: { household: { adults: 2, children: [] } } }, 'ipv.offenGrund.haushalt'],
    ['Konkubinat', { basis: { maritalStatus: 'cohabiting' } }, 'ipv.offenGrund.haushalt'],
    ['Haushalt mit Kind', { basis: { household: { adults: 1, children: [{ age: 8 }] } } }, 'ipv.offenGrund.agKinder'],
    ['ohne Geburtsdatum', { basis: { dateOfBirth: '' } }, 'ipv.offenGrund.alter'],
  ])('%s: nennt den Grund, kein Jahr, kein Betrag', (_, patch, grundKey) => {
    const p = profil(1500);
    const html = renderToStaticMarkup(React.createElement(PremiumSubsidy, {
      palette, t, onUpdateData: () => {},
      data: { ...p, basis: { ...p.basis, ...(patch.basis || {}) } },
    }));
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).toContain(grundKey);
    expect(html).not.toContain('ipv.jahrOhneRegion');
    expect(html).not.toContain('premium.eligible');
  });

  it('Kantonsvergleich zeigt AG nicht mit Einzelwerten (hat keine)', () => {
    expect(render(profil(1500))).not.toContain('Single: CHF');
  });
});
