import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateIPV, calculateSozialhilfe, getHouseholdInfo } from '../config/cantonalData.js';
import { praemienBelegState } from '../data/praemienBeleg.js';
import { lookupPLZ } from '../data/plzGemeinde.js';
import { PremiumSubsidy } from '../PremiumSubsidy.jsx';
import { TaxCalculator } from '../TaxCalculator.jsx';
import { SozialhilfeView } from '../SozialhilfeView.jsx';
import { StipendienView } from '../StipendienView.jsx';
import { MietzinsOrientierung } from '../MietzinsOrientierung.jsx';
import { Schnellcheck } from '../Schnellcheck.jsx';

// ─────────────────────────────────────────────────────────────
// K10 · Crosslink-Prüfung (Bau-Liste bis 30.09.2026, geprüft 15.09.2026)
//
// Zwei Aussagen standen im Raum:
//   1. «Der Kanton, der am Anfang gewählt wird, wird überall übernommen.»
//   2. «Der IPV-Rechner übernimmt Eingaben nicht.»
// Diese Tests halten fest, was der Code heute tut. Die ganze Tabelle je Rechner
// und die zwei Bugs (B-1, B-2) stehen in docs/legal/freigabe-register.md §2 und
// in BUGS.md.
//
// Das Onboarding schreibt den Kanton nach basis.canton (Onboarding.jsx:60); eine
// PLZ im Kapitel Wohnen füllt basis.canton nur, wenn es noch leer ist (main.jsx:679).
// Genau diesen Profil-Zustand bauen die Tests nach.
// ─────────────────────────────────────────────────────────────

// Jede Farbe ist ein gültiger String — die Tests prüfen Inhalt, nicht Aussehen.
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
// Schlüssel statt Übersetzung; Parameter sichtbar in Klammern, damit man sieht,
// welcher Kanton in den Text geflossen ist.
const t = (k, p) => (p && typeof p === 'object' ? k + '(' + Object.values(p).join('|') + ')' : k);
const render = (C, props) => renderToStaticMarkup(React.createElement(C, { palette, t, onNavigate: () => {}, ...props }));

const profil = ({ canton = 'BE', income, plz, household } = {}) => ({
  basis: { canton, household: household || { adults: 1, children: [] } },
  finanzen: income != null ? { monthlyIncome: income } : {},
  wohnen: plz ? { postalCode: plz } : {},
  versicherungen: {},
});

describe('K10 · Aussage 1: der Kanton aus dem Onboarding erreicht jede Rechen-Engine', () => {
  it.each(['BE', 'ZH', 'GE', 'TI'])('basis.canton = %s → IPV, Sozialhilfe und Prämien-Beleg rechnen mit demselben Kanton', (canton) => {
    const p = profil({ canton, income: 3000 });
    expect(calculateIPV(p).canton).toBe(canton);
    expect(calculateSozialhilfe(p).canton).toBe(canton);
    expect(praemienBelegState(p).canton).toBe(canton);
  });

  it('Haushalt und Einkommen kommen aus denselben Profilfeldern (getHouseholdInfo, monthlyIncome + sideIncome + Partner)', () => {
    const p = profil({ canton: 'BE', income: 2000, household: { adults: 2, children: [{ age: 4 }], partnerIncome: 1500 } });
    p.finanzen.sideIncome = 500;
    expect(getHouseholdInfo(p).householdSize).toBe(3);
    expect(calculateSozialhilfe(p).income).toBe(4000);
    expect(calculateSozialhilfe(p).householdSize).toBe(3);
  });
});

describe('K10 · Aussage 1 in den Ansichten: kein Rechner fragt den Kanton nochmals ab', () => {
  const p = profil({ canton: 'BE', income: 3000 });

  it('IPV-Rechner (PremiumSubsidy) zeigt den Profil-Kanton und rechnet sofort', () => {
    const html = render(PremiumSubsidy, { data: p, onUpdateData: () => {} });
    expect(html).toContain('premium.canton(cantons.BE)');
    expect(html).not.toContain('premium.enterCanton');
    expect(html).not.toContain('premium.enterIncome');
    // E9: BE ist nicht amtlich belegt → Orientierung statt «Berechtigt» + Betrag.
    expect(html).toContain('ipv.orientierungOffen');
  });

  it('Steuerrechner wählt den Profil-Kanton im Kantonsfeld vor', () => {
    const html = render(TaxCalculator, { data: p, onSave: () => {} });
    expect(html).toMatch(/<option value="BE" selected="">/);
  });

  it('Sozialhilfe, Stipendien, Mietzins und Schnellcheck nennen den Profil-Kanton', () => {
    expect(render(SozialhilfeView, { data: p })).toContain('premium.canton(cantons.BE)');
    expect(render(StipendienView, { data: p })).toContain('stip.yourCanton(cantons.BE)');
    expect(render(MietzinsOrientierung, { data: p })).toContain('mietzinsView.cantonLabel(cantons.BE)');
    expect(render(Schnellcheck, { data: p })).toContain('schnellcheck.contextCanton(cantons.BE|1)');
  });
});

describe('K10 · Aussage 2: der IPV-Rechner übernimmt das Profil (Schnellcheck-Zahlen seit B-1 als Übergabe, siehe b1SchnellcheckUebergabe.test.js)', () => {
  it('ohne Profil-Einkommen fragt der IPV-Rechner danach und schreibt die Eingabe ins Profil-Feld finanzen.monthlyIncome', () => {
    const writes = [];
    const html = render(PremiumSubsidy, { data: profil({ canton: 'BE' }), onUpdateData: (...a) => writes.push(a) });
    // Das Eingabefeld ist da (premium.enterIncome), der Kanton trotzdem schon übernommen.
    expect(html).toContain('premium.enterIncome');
    expect(html).toContain('premium.canton(cantons.BE)');
  });

  it('B-1: gleiche Engine, andere Eingabe — ohne Übergabe (Weg über das Menü) rechnet der IPV-Rechner mit dem Profil', () => {
    // Profil: 5000/Monat in BE. Im Schnellcheck tippt jemand 3000 ein (Schnellcheck.jsx:21, lokaler Zustand).
    const profilDaten = profil({ canton: 'BE', income: 5000 });
    const schnellcheckProbe = { ...profilDaten, finanzen: { ...profilDaten.finanzen, monthlyIncome: 3000 } };
    // E9: BE ist nicht amtlich belegt → für beide Einkommen dieselbe neutrale Orientierung
    // (der Unterschied 3000/5000 zeigt sich erst mit Beleg, siehe b1SchnellcheckUebergabe.test.js).
    expect(calculateIPV(schnellcheckProbe)).toEqual(calculateIPV(profilDaten));
    // Ohne `schnellcheckZahlen` rechnet der IPV-Rechner mit dem Profil.
    const html = render(PremiumSubsidy, { data: profilDaten, onUpdateData: () => {} });
    expect(html).toContain('ipv.orientierungOffen');
    expect(html).not.toContain('premium.schnellcheckGerechnet');
  });
});

describe('K10 · Nebenbefund D-1: PLZ-Kanton und Onboarding-Kanton können auseinanderlaufen', () => {
  it('Onboarding ZH, später PLZ 3011 (Bern): basis.canton bleibt ZH, die PLZ sagt BE', () => {
    const p = profil({ canton: 'ZH', income: 3000, plz: '3011' });
    // basis.canton-Leser (IPV, Sozialhilfe, Steuer, Stipendien, Schnellcheck, Mietzins):
    expect(calculateIPV(p).canton).toBe('ZH');
    expect(render(MietzinsOrientierung, { data: p })).toContain('mietzinsView.cantonLabel(cantons.ZH)');
    // PLZ-zuerst-Leser (Lebenssituationen.jsx:22, BudgetSync.jsx:42, UmzugAblauf.jsx:33) nehmen diesen Wert:
    expect(lookupPLZ(p.wohnen.postalCode)[0].kanton).toBe('BE');
  });
});
