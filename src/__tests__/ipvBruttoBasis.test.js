import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateIPV, calculateSozialhilfe, ipvJahreseinkommen, ladeIPVModelle, preloadPLZ } from '../config/cantonalData.js';
import { nettoMonatAusProfil } from '../utils/nettoAusProfil.js';
import { applyTaxToFinanzen } from '../taxImport.js';
import { pegelState } from '../data/pegel.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import { zahl } from '../utils/geld.js';

// ─────────────────────────────────────────────────────────────
// Nachrechnung Beispielhaushalte 04.11.2026 (Stebler Studios, K1), Nebenbefund: die IPV las
// `finanzen.incomeType` nie. Beide Einkommenswege — `ipvJahreseinkommen` (Muster-Kantone, Pegel,
// Leistungsliste) und `rohesEinkommenJahr` (alle Kantonsmodule) — nahmen einen brutto erfassten Lohn
// als netto. Die Module erwarten netto («Netto ist was auf Ihrem Konto ankommt»). Folge: massgebendes
// Einkommen rund 8–10 % zu hoch, Verbilligung zu tief oder zu Unrecht keine. Zu tief ist nicht die
// vorsichtige Seite (kantonsModell.js, Befund 20.09.2026).
//
// Ein brutto erfasster Lohn kommt z. B. über den Steuerimport ins Profil (taxImport.js setzt
// incomeType 'brutto'). Jetzt dieselbe Regel wie die Sozialhilfe: nettoMonatAusProfil.
// ─────────────────────────────────────────────────────────────
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (data) => renderToStaticMarkup(React.createElement(PremiumSubsidy, { palette, t, data, onUpdateData: () => {} }));

const basis = { canton: 'AG', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } };
const profil = (finanzen) => ({
  basis,
  finanzen: { employmentType: 'employed', dreizehnter: 'no', ...finanzen },
  wohnen: { postalCode: '5000', city: 'Aarau', rentAmount: 1200 },
  versicherungen: { kkPremium: 420 },
});
const netto = (b) => nettoMonatAusProfil(b, 'brutto', basis).netto;

beforeAll(async () => {
  preloadPLZ();
  await ladeIPVModelle();
  await new Promise((r) => setTimeout(r, 0));
});

describe('IPV: brutto im Profil wird auf netto umgerechnet', () => {
  it('der Steuerimport legt den Lohn als brutto ab (so kommt er ins Profil)', () => {
    const { merged } = applyTaxToFinanzen([{ target: 'monthlyIncome', value: 1500 }], {});
    expect(merged.incomeType).toBe('brutto');
  });

  it('Kantonsmodul (AG): brutto rechnet wie der Netto-Richtwert, nicht wie derselbe Betrag netto', () => {
    const ausBrutto = calculateIPV(profil({ monthlyIncome: 1500, incomeType: 'brutto' }));
    const alsNetto = calculateIPV(profil({ monthlyIncome: netto(1500), incomeType: 'netto' }));
    const roh = calculateIPV(profil({ monthlyIncome: 1500, incomeType: 'netto' }));
    expect(alsNetto.amount).toBeGreaterThan(roh.amount);
    expect(ausBrutto.amount).toBe(alsNetto.amount);
    expect(ausBrutto.annual).toBe(alsNetto.annual);
  });

  it('die Anzeige (IPV-Rechner) zeigt den Betrag aus netto', () => {
    const alsNetto = calculateIPV(profil({ monthlyIncome: netto(1500), incomeType: 'netto' }));
    const html = render(profil({ monthlyIncome: 1500, incomeType: 'brutto' }));
    expect(html).toContain('CHF ' + zahl(alsNetto.annual));
  });

  it('Muster-Weg und Pegel: ipvJahreseinkommen rechnet mit netto, auch für den Nebenerwerb', () => {
    const p = profil({ monthlyIncome: 4000, incomeType: 'brutto', sideIncome: 1000, sideIncomeType: 'brutto' });
    expect(ipvJahreseinkommen(p)).toBeCloseTo(netto(4000) * 12 + netto(1000) * 12, 6);
    expect(pegelState(p)).toEqual(pegelState(profil({ monthlyIncome: netto(4000), incomeType: 'netto', sideIncome: netto(1000), sideIncomeType: 'netto' })));
  });

  it('netto und offen bleiben, wie sie sind — keine doppelte Umrechnung', () => {
    expect(ipvJahreseinkommen(profil({ monthlyIncome: 4000, incomeType: 'netto' }))).toBe(48000);
    expect(ipvJahreseinkommen(profil({ monthlyIncome: 4000 }))).toBe(48000);
    // Nebenerwerb mit eigener Art: Hauptlohn netto, Nebenerwerb brutto → nur der Nebenerwerb wird umgerechnet.
    expect(ipvJahreseinkommen(profil({ monthlyIncome: 4000, incomeType: 'netto', sideIncome: 1000, sideIncomeType: 'brutto' })))
      .toBeCloseTo(48000 + netto(1000) * 12, 6);
  });

  it('Selbständige: der Betrag bleibt wie eingetragen (eine Regel mit der Sozialhilfe)', () => {
    const p = profil({ monthlyIncome: 4000, incomeType: 'brutto', employmentType: 'selfEmployed' });
    expect(ipvJahreseinkommen(p)).toBe(48000);
    expect(calculateSozialhilfe(p).income).toBe(4000);
  });

  it('das Ergebnis sagt, dass das Einkommen aus brutto geschätzt ist', () => {
    expect(calculateIPV(profil({ monthlyIncome: 1500, incomeType: 'brutto' })).einkommenGeschaetzt).toBe(true);
    expect(calculateIPV(profil({ monthlyIncome: 1500, incomeType: 'netto' })).einkommenGeschaetzt).toBe(false);
  });
});
