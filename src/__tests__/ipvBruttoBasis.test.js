import { describe, it, expect, beforeAll, vi } from 'vitest';
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

// Prüferrunde 04.11.2026: weitere Wege und Randlagen.
const zh = (finanzen) => ({ ...profil(finanzen), basis: { ...basis, canton: 'ZH' }, wohnen: { postalCode: '8004', city: 'Zürich', rentAmount: 1200 } });

describe('IPV brutto → netto: weitere Wege', () => {
  it('ein zweites Kantonsmodul (ZH) rechnet ebenso mit netto', () => {
    const ausBrutto = calculateIPV(zh({ monthlyIncome: 3000, incomeType: 'brutto' }));
    const alsNetto = calculateIPV(zh({ monthlyIncome: netto(3000), incomeType: 'netto' }));
    expect(alsNetto.amount).toBeGreaterThan(0);
    expect(ausBrutto.amount).toBe(alsNetto.amount);
    expect(ausBrutto.amount).not.toBe(calculateIPV(zh({ monthlyIncome: 3000, incomeType: 'netto' })).amount);
  });

  it('13. Monatslohn: erst netto, dann ×13 — und «offen» bleibt als Annahme stehen', () => {
    expect(ipvJahreseinkommen(profil({ monthlyIncome: 4000, incomeType: 'brutto', dreizehnter: 'yes' }))).toBeCloseTo(netto(4000) * 13, 6);
    const offen = calculateIPV(profil({ monthlyIncome: 1500, incomeType: 'brutto', dreizehnter: undefined }));
    expect(offen.annahmen.ohneDreizehnten).toBe(true);
  });

  it('ein zweiter Durchlauf auf schon umgerechneten Daten ändert nichts', () => {
    const roh = profil({ monthlyIncome: 1500, incomeType: 'brutto' });
    const einmal = calculateIPV(roh);
    const umgerechnet = profil({ monthlyIncome: netto(1500), incomeType: 'netto' });
    expect(calculateIPV(umgerechnet).amount).toBe(einmal.amount);
  });

  it('Selbständige im Kantonsmodul: kein Abzug, wie eingetragen', () => {
    const selbst = calculateIPV(profil({ monthlyIncome: 1500, incomeType: 'brutto', employmentType: 'selfEmployed' }));
    expect(selbst.amount).toBe(calculateIPV(profil({ monthlyIncome: 1500, incomeType: 'netto', employmentType: 'selfEmployed' })).amount);
    expect(selbst.einkommenGeschaetzt).toBe(false);
  });
});

// Fachprüfung 04.11.2026, Blocker: der Schnellcheck übergibt nur NETTO eingetippte Löhne. Bei einem Profil auf brutto
// rechnete der IPV-Rechner sie ein zweites Mal herunter, und «Ins Profil übernehmen» schrieb sie unter der Art brutto ab.
const renderMitProps = (props) => {
  const gesehen = [];
  const echt = React.createElement;
  const spion = vi.spyOn(React, 'createElement').mockImplementation((typ, p, ...kinder) => {
    if (p) gesehen.push({ typ, p, kinder });
    return echt(typ, p, ...kinder);
  });
  try {
    return { html: renderToStaticMarkup(echt(PremiumSubsidy, { palette, t, ...props })), gesehen };
  } finally { spion.mockRestore(); }
};
const textVon = (e) => e.kinder.flat().filter((k) => typeof k === 'string').join('');

describe('IPV-Rechner: Netto aus dem Schnellcheck bei einem Profil auf brutto', () => {
  const brutto = profil({ monthlyIncome: 1500, incomeType: 'brutto' });

  it('rechnet die übergebene Zahl als netto, nicht nochmals umgerechnet', () => {
    const erwartet = calculateIPV(profil({ monthlyIncome: 1400, incomeType: 'netto' }));
    const { html } = renderMitProps({ data: brutto, schnellcheckZahlen: { monthlyIncome: 1400 }, onUpdateData: () => {} });
    expect(html).toContain('CHF ' + zahl(erwartet.annual));
  });

  it('gleicher Betrag wie das Brutto im Profil: trotzdem als netto übergeben und angezeigt', () => {
    const erwartet = calculateIPV(profil({ monthlyIncome: 1500, incomeType: 'netto' }));
    const { html } = renderMitProps({ data: brutto, schnellcheckZahlen: { monthlyIncome: 1500 }, onUpdateData: () => {} });
    expect(html).toContain('premium.schnellcheckGerechnet');
    expect(html).toContain('CHF ' + zahl(erwartet.annual));
  });

  it('«Ins Profil übernehmen» schreibt die Art netto mit', () => {
    const writes = [];
    const { gesehen } = renderMitProps({ data: brutto, schnellcheckZahlen: { monthlyIncome: 1400 }, onUpdateData: (...a) => writes.push(a) });
    gesehen.find((e) => e.typ === 'button' && textVon(e).includes('premium.schnellcheckUebernehmen')).p.onClick();
    expect(writes).toEqual([['finanzen', 'monthlyIncome', 1400], ['finanzen', 'incomeType', 'netto']]);
  });

  it('Profil auf netto: nichts zusätzlich geschrieben (wie bisher)', () => {
    const writes = [];
    const { gesehen } = renderMitProps({ data: profil({ monthlyIncome: 1500, incomeType: 'netto' }), schnellcheckZahlen: { monthlyIncome: 1400 }, onUpdateData: (...a) => writes.push(a) });
    gesehen.find((e) => e.typ === 'button' && textVon(e).includes('premium.schnellcheckUebernehmen')).p.onClick();
    expect(writes).toEqual([['finanzen', 'monthlyIncome', 1400]]);
  });
});
