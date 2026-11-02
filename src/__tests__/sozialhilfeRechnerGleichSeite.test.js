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
  it('Partnerlohn im Konkubinat: kein Betrag, Seite und Rechner sagen, was fehlt (D.4.4, Stebler Studios 02.11.2026)', () => {
    const p = profil({ monthlyIncome: 800, incomeType: 'netto' }, { maritalStatus: 'cohabiting', household: { adults: 2, children: [], partnerIncome: 5000 } });
    const sh = calculateSozialhilfe(p);
    expect(sh.income).toBe(800);
    expect(sh.deficit).toBe(0);
    expect(sh.offenText).toBe('pegel.konkubinatBetragOffen');
    expect(sozialhilfePegelState(p).amount).toBe(0);
    expect(render(p)).toContain(de.pegel.konkubinatBetragOffen);
    expect(render(p)).not.toContain(de.pegel.konkubinatOffen);
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
    const p = profil({}, { maritalStatus: 'single', household: { adults: 2, children: [] } }, { utilities: 150 });
    expect(sozialhilfeVorbefuellung(p).miete).toBe('375');
    expect(calculateSozialhilfe(p).effectiveRent).toBe(375);
  });
});

describe('Nachbesserung nach Fachprüfung e1383af5', () => {
  const zwei = { household: { adults: 2, children: [], partnerIncome: 4000 } };
  it('Zivilstand leer, zwei Erwachsene: als Paar gerechnet wie bisher, kein Betrag aus dem Nichts, und gesagt', () => {
    const p = profil({ employmentType: 'unemployed' }, zwei, { rentAmount: 1700 });
    const sh = calculateSozialhilfe(p);
    expect(sh.grundbedarf).toBe(1624);
    expect(sh.effectiveRent).toBe(1700);
    expect(sh.income).toBe(4000);
    expect(sh.vermoegensfreibetrag).toBe(calculateSozialhilfe({ ...p, basis: { ...p.basis, maritalStatus: 'married' } }).vermoegensfreibetrag);
    expect(sh.hinweise).toContain('pegel.zivilstandOffen');
    expect(sh.deficit).toBe(rechner(p).sozialhilfeAnspruch);
    expect(render(p)).toContain(de.pegel.zivilstandOffen);
  });
  it('ledig, zwei Erwachsene: bleibt getrennt, ohne Zivilstands-Hinweis', () => {
    const sh = calculateSozialhilfe(profil({}, { maritalStatus: 'single', household: { adults: 2, children: [] } }));
    expect(sh.grundbedarf).toBe(812);
    expect(sh.hinweise).not.toContain('pegel.zivilstandOffen');
  });
  it('Konkubinat mit nur einer erfassten Person: Hinweis trotzdem', () => {
    expect(calculateSozialhilfe(profil({}, { maritalStatus: 'cohabiting' })).hinweise).toContain('pegel.konkubinatOffen');
  });
  it('Altfeld dependents: Rechner und Seite gleich', () => {
    const p = profil({ monthlyIncome: 1000, incomeType: 'netto' }, { household: undefined, dependents: 2 });
    expect(rechner(p).bedarf).toBe(calculateSozialhilfe(p).totalBedarf);
    expect(rechner(p).vermoegensfreibetrag).toBe(calculateSozialhilfe(p).vermoegensfreibetrag);
  });
  it('Miete mit Rappen im geteilten Haushalt: kein Franken Unterschied', () => {
    const p = profil({}, { maritalStatus: 'single', household: { adults: 3, children: [] } }, { rentAmount: 1000.5, utilities: 100.4 });
    expect(Number(sozialhilfeVorbefuellung(p).miete)).toBe(calculateSozialhilfe(p).effectiveRent);
  });
  it('die Texte behaupten nicht mehr die ganze Miete, in keiner Sprache', () => {
    for (const lang of [de, en, fr, itTranslations, rm]) {
      const s = JSON.stringify([lang.sozialhilfe.mitGanzerMiete, lang.sozialhilfe.rentLimitDossier, lang.sozialhilfe.rentLimitUnbekannt]);
      expect(s).not.toMatch(/ganze Miete|ganzen Miete|full rent|loyer entier|intero affitto|entira fittanza/);
    }
  });
  it('Seite nennt den Anteil am Grundbedarf', () => {
    const sh = calculateSozialhilfe(profil({}, { maritalStatus: 'cohabiting', household: { adults: 2, children: [] } }));
    expect([sh.einheit, sh.haushalt]).toEqual([1, 2]);
  });
});

describe('Offene Befunde aus #651 geschlossen', () => {
  const heute = new Date();
  it('Vermögen: Säule 3b zählt auch auf der Seite (SKOS-RL D.3.3 Abs. 6), eine Summe für beide Wege', () => {
    const p = profil({ savingsAccount: 1000, pension3bBalance: 9000 });
    expect(calculateSozialhilfe(p).vermoegen).toBe(10000);
    expect(calculateSozialhilfe(p).vermoegen).toBe(Number(sozialhilfeVorbefuellung(p).vermoegen));
  });
  it('Vermögen: beziehbare Säule 3a auf beiden Wegen gleich', () => {
    const jg = heute.getFullYear() - 64;
    const p = profil({ savingsAccount: 1000, pension3aBalance: 20000 }, { dateOfBirth: `${jg}-01-01`, gender: 'male' });
    expect(calculateSozialhilfe(p).vermoegen).toBe(21000);
    expect(Number(sozialhilfeVorbefuellung(p).vermoegen)).toBe(21000);
  });
  it('Haushaltsführung: Hinweis bei Mitbewohnenden, nicht allein (D.4.5)', () => {
    const wg = calculateSozialhilfe(profil({}, { maritalStatus: 'single', household: { adults: 2, children: [] } }));
    expect(wg.hinweise).toContain('pegel.haushaltsfuehrungOffen');
    expect(calculateSozialhilfe(profil({})).hinweise).not.toContain('pegel.haushaltsfuehrungOffen');
  });
  it('Einnahmen von Kindern: Hinweis nur bei Kind plus Alimente oder Zulagen (D.1 Abs. 2)', () => {
    const kind = { household: { adults: 1, children: [{ age: 8 }] } };
    expect(calculateSozialhilfe(profil({ alimenteReceived: 500 }, kind)).hinweise).toContain('pegel.kinderEinnahmen');
    expect(calculateSozialhilfe(profil({}, kind)).hinweise).not.toContain('pegel.kinderEinnahmen');
    expect(calculateSozialhilfe(profil({ alimenteReceived: 500 })).hinweise).not.toContain('pegel.kinderEinnahmen');
  });
  it('Ehe mit einer erfassten Person: Hinweis, wenn der Partnerlohn zählt', () => {
    const p = profil({}, { maritalStatus: 'married', household: { adults: 1, children: [], partnerIncome: 3000 } });
    expect(calculateSozialhilfe(p).hinweise).toContain('pegel.zweitePersonFehlt');
  });
  it('Lohnart offen: die Seite sagt, dass als netto gerechnet ist', () => {
    expect(calculateSozialhilfe(profil({ monthlyIncome: 2200 })).hinweise).toContain('pegel.lohnartOffen');
    expect(calculateSozialhilfe(profil({ monthlyIncome: 2200, incomeType: 'netto' })).hinweise).not.toContain('pegel.lohnartOffen');
  });
  it('Nebenerwerb nicht übernommen: kein Betrag, der Rechner fragt und sagt warum', () => {
    const html = render(profil({ monthlyIncome: 1000, incomeType: 'netto', sideIncome: 400 }));
    expect(html).toContain(de.einkommensart.nebenOffen);
    expect(html).toContain(de.sh.nebenEingeben.sie);
  });
  it('sechs Kinder: das Formular kappt nicht mehr', () => {
    const p = profil({ monthlyIncome: 1000, incomeType: 'netto' }, { household: { adults: 1, children: Array.from({ length: 6 }, () => ({ age: 5 })) } });
    expect(render(p)).toMatch(/aria-label="Kinder[^"]*"[^>]*>(?:(?!<\/select>).)*<option value="6" selected=""/s);
  });
  it('das Feld Familienzulagen warnt vor Doppelzählung, in jeder Sprache', () => {
    expect(JSON.stringify(de)).toMatch(/Kinderzulagen vom Arbeitgeber[^"]*doppelt/);
    expect(JSON.stringify(en)).toMatch(/compensation office\.[^"]*twice/);
    expect(JSON.stringify(fr)).toMatch(/caisse de compensation\.[^"]*double/);
    expect(JSON.stringify(itTranslations)).toMatch(/cassa di compensazione\.[^"]*due volte/);
    expect(JSON.stringify(rm)).toMatch(/supplements da furmaziun\.[^"]*dubel/);
  });
});

describe('Fachprüfung a7d2744c', () => {
  it('Säule 3a zählt erst ab dem frühesten AHV-Vorbezug, nicht fünf Jahre vorher (D.3.3 Abs. 3)', () => {
    const am = (dob) => calculateSozialhilfe({ ...profil({ pension3aBalance: 30000 }, { dateOfBirth: dob, gender: 'male' }) }).vermoegen;
    const j = new Date().getFullYear();
    expect(am(`${j - 62}-12-31`)).toBe(0);
    expect(am(`${j - 64}-01-01`)).toBe(30000);
    expect(de.sh.inkl3aHint).not.toMatch(/fünf Jahren/);
  });
  it('Selbständige ohne Lohnart: Rechner und Seite gleich, Hinweis zu den Beiträgen', () => {
    const p = profil({ employmentType: 'selfEmployed', monthlyIncome: 1100 });
    expect(sozialhilfeVorbefuellung(p).lohnNichtUebernommen).toBe(false);
    expect(sozialhilfeVorbefuellung(p).einkommen).toBe('1100');
    expect(rechner(p).sozialhilfeAnspruch).toBe(calculateSozialhilfe(p).deficit);
    expect(render(p)).toContain(de.pegel.vorBeitraegen);
  });
  it('Nebenerwerb ohne Art: auch die Seite sagt es', () => {
    expect(calculateSozialhilfe(profil({ monthlyIncome: 1000, incomeType: 'netto', sideIncome: 400 })).hinweise).toContain('pegel.lohnartOffen');
  });
  it('Haushaltsführung: 950 nicht als feste Obergrenze bei Kinderbetreuung (D.4.5 Abs. 3)', () => {
    expect(de.pegel.haushaltsfuehrungOffen).toMatch(/Kinderbetreuung/);
  });
});
