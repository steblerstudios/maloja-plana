import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { berechneSozialhilfe } from '../data/sozialhilfeRechner.js';
import { sozialhilfePegelState } from '../data/pegel.js';
import { sozialhilfeVorbefuellung } from '../utils/sozialhilfeVorbefuellung.js';
import { SozialhilfeRechner } from '../SozialhilfeRechner.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Predeploy 02.11.2026: Rechner und Seite zeigten bei gleichem Profil verschiedene Ergebnisse. Entschieden am
// Wortlaut der SKOS-RL, Version vom 1.1.2026 (rl.skos.ch, gelesen 02.11.2026). Quellen je Fall unten.
const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });

const profil = (finanzen, basis = {}, wohnen = {}) => ({
  basis: { canton: 'ZH', dateOfBirth: '1986-03-01', household: { adults: 1, children: [] }, ...basis },
  finanzen: { employmentType: 'employed', ...finanzen },
  wohnen: { rentAmount: 600, ...wohnen },
  versicherungen: { kkPremium: 300 },
});

// Rechnet, was der Rechner aus dem Profil rechnet, unverändert vorbefüllt.
const rechner = (data) => {
  const v = sozialhilfeVorbefuellung(data);
  return berechneSozialhilfe({
    adults: v.adults, kinderImHaushalt: v.kinder, weiterePersonen: v.weiterePersonen, wohnform: v.wohnform,
    miete: Number(v.miete) || 0, krankenkassePraemie: Number(data.versicherungen?.kkPremium) || 0,
    erwerbseinkommen: Number(v.einkommen) || 0, andereEinkuenfte: Number(v.andereEinkuenfte) || 0,
    vermoegen: Number(v.vermoegen) || 0, erwerbstaetig: v.erwerbstaetig, ohneFreibetrag: v.ohneFreibetrag,
    kanton: data.basis.canton,
  });
};
const render = (data) => renderToStaticMarkup(React.createElement(SozialhilfeRechner, { palette, t, data, onNavigate: () => {} }));

describe('Alimente und Familienzulagen sind Einnahmen (SKOS-RL D.1 Erl. a)', () => {
  it('ZH, Lohn 1900, Alimente 300: Seite und Rechner sagen dasselbe, kein Betrag', () => {
    const p = profil({ monthlyIncome: 1900, incomeType: 'netto', alimenteReceived: 300 });
    const sh = calculateSozialhilfe(p);
    expect(sh.income).toBe(2200);
    expect(sh.deficit).toBe(0);
    expect(sh.eligible).toBe(rechner(p).hatAnspruch);
  });
  it('Familienzulagen zählen ohne Freibetrag: die Lücke ist auf beiden Seiten gleich', () => {
    const p = profil({ monthlyIncome: 1500, incomeType: 'netto', familienzulagen: 215 }, { household: { adults: 1, children: [{ age: 6 }] } });
    const sh = calculateSozialhilfe(p);
    expect(sh.income).toBe(1715);
    expect(sh.efb).toBe(400);
    expect(sh.deficit).toBe(rechner(p).sozialhilfeAnspruch);
  });
  it('nur Alimente, kein Lohn: der Pegel steht nicht auf leer', () => {
    const p = profil({ alimenteReceived: 800, employmentType: 'unemployed' });
    expect(calculateSozialhilfe(p).income).toBe(800);
    expect(sozialhilfePegelState(p).mode).toBe('gap');
  });
});

describe('Lohn im Profil, aber nicht netto: kein Betrag aus einem Einkommen von 0', () => {
  for (const [name, finanzen] of [
    ['Lohnart leer', { monthlyIncome: 2000 }],
    ['brutto', { monthlyIncome: 2300, incomeType: 'brutto' }],
  ]) {
    it(`${name}: der Rechner zeigt keine CHF 1’961, sondern fragt nach dem Nettolohn`, () => {
      const html = render(profil(finanzen));
      expect(html).not.toContain('1’961 /');
      expect(html).toContain(de.sh.lohnEingeben.sie);
    });
    it(`${name}: das Feld bleibt leer und gilt als nicht übernommen`, () => {
      expect(sozialhilfeVorbefuellung(profil(finanzen)).lohnNichtUebernommen).toBe(true);
    });
  }
  it('Gegenprobe netto: gerechnet wird, die Frage steht nicht da', () => {
    const p = profil({ monthlyIncome: 1500, incomeType: 'netto' });
    expect(sozialhilfeVorbefuellung(p).lohnNichtUebernommen).toBe(false);
    const html = render(p);
    expect(html).not.toContain(de.sh.lohnEingeben.sie);
    expect(html).toContain('/ ');
  });
  it('Gegenprobe ohne Lohn im Profil: brutto gewählt, kein Betrag, keine Frage', () => {
    expect(sozialhilfeVorbefuellung(profil({ incomeType: 'brutto' })).lohnNichtUebernommen).toBe(false);
  });
});

describe('Zwei Erwachsene ohne Ehe: keine Unterstützungseinheit (C.2 Erl. b, C.3.1 Erl. b, C.4.2 Abs. 2)', () => {
  const konkubinat = { maritalStatus: 'cohabiting', household: { adults: 2, children: [] } };
  it('ZH, Lohn 2000: GBL-Anteil 812, halbe Miete, kein Anspruch, auf beiden Seiten', () => {
    const p = profil({ monthlyIncome: 2000, incomeType: 'netto' }, konkubinat);
    const sh = calculateSozialhilfe(p);
    expect(sh.grundbedarf).toBe(812);
    expect(sh.effectiveRent).toBe(300);
    expect(sh.totalBedarf).toBe(1412);
    expect(sh.eligible).toBe(false);
    const r = rechner(p);
    expect(r.bedarf).toBe(1412);
    expect(r.hatAnspruch).toBe(false);
  });
  it('die Vorbefüllung nimmt den eigenen Anteil, nicht leer', () => {
    const v = sozialhilfeVorbefuellung(profil({}, konkubinat));
    expect(v.miete).toBe('300');
    expect(v.mieteAnteil).toBe(true);
  });
  it('Ehe: unverändert eine Einheit, 2 Personen, ganze Miete', () => {
    const p = profil({ monthlyIncome: 2000, incomeType: 'netto' }, { maritalStatus: 'married', household: { adults: 2, children: [] } });
    const sh = calculateSozialhilfe(p);
    expect(sh.grundbedarf).toBe(1624);
    expect(sh.effectiveRent).toBe(600);
    expect(sh.deficit).toBe(rechner(p).sozialhilfeAnspruch);
  });
  it('Partnerlohn im Konkubinat: nicht als ganzer Lohn abgezogen, die Rechnung sagt, was fehlt (D.4.4)', () => {
    const p = profil({ monthlyIncome: 800, incomeType: 'netto' }, { maritalStatus: 'cohabiting', household: { adults: 2, children: [], partnerIncome: 5000 } });
    const sh = calculateSozialhilfe(p);
    expect(sh.income).toBe(800);
    expect(sh.konkubinatOffen).toBe(true);
    expect(sh.deficit).toBe(rechner(p).sozialhilfeAnspruch);
    expect(sozialhilfePegelState(p).konkubinatOffen).toBe(true);
    expect(render(p)).toContain(de.pegel.konkubinatOffen);
  });
  it('Kind ab 18 zählt nicht zur Einheit, auch auf der Seite', () => {
    const p = profil({ monthlyIncome: 1000, incomeType: 'netto' }, { household: { adults: 1, children: [{ age: 20 }] } });
    const sh = calculateSozialhilfe(p);
    expect(sh.grundbedarf).toBe(812);
    expect(sh.deficit).toBe(rechner(p).sozialhilfeAnspruch);
  });
});

describe('Nebenkosten gehören zu den Wohnkosten (C.4.1 Abs. 2, Erl. c)', () => {
  it('der Rechner übernimmt Miete plus Nebenkosten wie die Seite', () => {
    const p = profil({ monthlyIncome: 1500, incomeType: 'netto' }, {}, { utilities: 150 });
    expect(sozialhilfeVorbefuellung(p).miete).toBe('750');
    expect(rechner(p).bedarf).toBe(calculateSozialhilfe(p).totalBedarf);
  });
  it('im geteilten Haushalt der Anteil an beidem', () => {
    const p = profil({}, { household: { adults: 2, children: [] } }, { utilities: 150 });
    expect(sozialhilfeVorbefuellung(p).miete).toBe('375');
    expect(calculateSozialhilfe(p).effectiveRent).toBe(375);
  });
});
