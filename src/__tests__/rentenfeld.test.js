import { describe, it, expect, beforeAll } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateSozialhilfe, calculateIPV, checkELEligibility, ladeIPVModelle } from '../config/cantonalData.js';
import { renteOhneBetrag, renteEingetragen, bvgHerausloesen } from '../utils/unterstuetzungseinheit.js';
import { sozialhilfeVorbefuellung } from '../utils/sozialhilfeVorbefuellung.js';
import { getChapters } from '../config/constants.js';
import { getBehoerdenDossierPreview } from '../dossierGenerator.js';
import { SozialhilfeRechner } from '../SozialhilfeRechner.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Stebler Studios 04.11.2026, «Rentenfeld bauen»: AHV-, IV- und Pensionskassen-Rente pro Monat im Kapitel Finanzen.
// Ohne Eintrag kein Betrag (#677), mit Eintrag rechnen Sozialhilfe, Rechner und IPV mit der Rente als Einnahme.
const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const rentnerin = (finanzen = {}, canton = 'AG') => ({
  basis: { canton, dateOfBirth: '1955-05-01', gender: 'female', household: { adults: 1, children: [] } },
  finanzen: { employmentType: 'retired', incomeType: 'netto', ...finanzen },
  wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 450 },
});

beforeAll(async () => { await ladeIPVModelle(); });
const rentenfeldProfil = () => rentnerin({ ahvRente: 1500, bvgRente: 300 });

describe('Rentenfelder im Kapitel Finanzen', () => {
  it('drei Felder, freiwillig, in fünf Sprachen beschriftet', () => {
    const felder = getChapters(t).find((c) => c.key === 'finanzen').fields;
    for (const k of ['ahvRente', 'ivRente', 'bvgRente']) {
      const f = felder.find((x) => x.k === k);
      expect(f).toMatchObject({ type: 'currency', secondary: true });
      for (const l of [de, fr, itTranslations, en, rm]) {
        expect(JSON.stringify(l)).toContain('"' + k + '"');
      }
    }
  });

  it('eingetragen heisst: eine Zahl, auch 0; leer ist nicht eingetragen', () => {
    expect(renteEingetragen({ ahvRente: '' })).toBe(false);
    expect(renteEingetragen({ ahvRente: '0' })).toBe(true);
    expect(renteOhneBetrag({}, rentnerin().basis)).toBe(true);
    expect(renteOhneBetrag({ ahvRente: 0 }, rentnerin().basis)).toBe(false);
    expect(renteOhneBetrag({ ivBezug: 'teil', ivRente: 900 }, {})).toBe(false);
  });

  // Fachprüfung 376149dc, Muss: das Feld muss zur Lage passen.
  it('nur die passende Rente hebt die Sperre auf', () => {
    const nurPk = rentnerin({ bvgRente: 300 });
    expect(renteOhneBetrag(nurPk.finanzen, nurPk.basis)).toBe(true);
    expect(calculateSozialhilfe(nurPk).einkommenFehlt).toBe(true);
    expect(calculateIPV(nurPk).amount).toBeNull();
    const ivMitAhvNull = { ...rentnerin({ employmentType: 'employed', ivBezug: 'ganz', ahvRente: 0, monthlyIncome: 0 }), basis: { canton: 'AG', dateOfBirth: '1980-01-01', household: { adults: 1, children: [] } } };
    expect(calculateIPV(ivMitAhvNull).amount).toBeNull();
    expect(renteOhneBetrag({ ivBezug: 'ganz', ivRente: 0 }, {})).toBe(false);
    // Nachprüfung 79c961c7, Muss: Frühpensionierte (62) mit AHV 0, PK leer gab die volle IPV.
    const frueh = { ...rentnerin({ ahvRente: 0 }), basis: { canton: 'AG', dateOfBirth: '1964-03-01', gender: 'female', household: { adults: 1, children: [] } } };
    expect(calculateIPV(frueh).amount).toBeNull();
    expect(calculateIPV({ ...frueh, finanzen: { ...frueh.finanzen, bvgRente: 2500 } }).amount).toBeGreaterThan(0);
  });

  it('Renten je Feld auf Franken, wie im Dossier', () => {
    const p = rentnerin({ ahvRente: 1500.6, bvgRente: 300.6 });
    expect(calculateSozialhilfe(p).income).toBe(1802);
  });

  it('Sozialhilfe: die Rente zählt als Einnahme, ohne Einkommensfreibetrag, ein Betrag steht', () => {
    const ohne = calculateSozialhilfe(rentnerin());
    expect(ohne.einkommenFehlt).toBe(true);
    const mit = calculateSozialhilfe(rentnerin({ ahvRente: 1500, bvgRente: 0 }));
    expect(mit).toMatchObject({ einkommenFehlt: false, renteFehlt: false, efb: 0 });
    expect(mit.income).toBe(1500);
    expect(mit.deficit).toBe(mit.totalBedarf - 1500);
  });

  it('Rechner: Rente in den anderen Einkünften, der gerenderte Rechner nennt einen Betrag', () => {
    const p = rentnerin({ ahvRente: 1500, bvgRente: 300 });
    expect(sozialhilfeVorbefuellung(p)).toMatchObject({ andereEinkuenfte: '1800', renteFehlt: false });
    const html = renderToStaticMarkup(React.createElement(SozialhilfeRechner, { palette, t, data: p, onNavigate: () => {} }));
    expect(html).not.toContain(de.sh.renteEintragen.sie.slice(0, 30));
    expect(html).toContain(String(calculateSozialhilfe(p).deficit).replace(/\B(?=(\d{3})+(?!\d))/g, '’'));
  });

  it('IPV: mit Rente ein Betrag aus dem Einkommen samt Rente, ohne Rente keiner', () => {
    expect(calculateIPV(rentnerin()).amount).toBeNull();
    const klein = calculateIPV(rentnerin({ ahvRente: 1200, bvgRente: 0 }));
    const gross = calculateIPV(rentnerin({ ahvRente: 4500, bvgRente: 0 }));
    expect(klein.amount).toBeGreaterThan(0);
    expect(gross.amount ?? 0).toBeLessThan(klein.amount);
  });

  it('2. Säule: eine eingetragene Rente der Pensionskasse beantwortet die Frage Kapital oder Rente', () => {
    const basis = { dateOfBirth: '1962-01-01', gender: 'male' };
    expect(bvgHerausloesen({}, { bvgBalance: 80000 }, basis, new Date(2026, 10, 4))).toBe(true);
    expect(bvgHerausloesen({ bvgRente: 800 }, { bvgBalance: 80000 }, basis, new Date(2026, 10, 4))).toBe(false);
  });

  it('EL bleibt «prüfen lassen» mit eingetragener Rente', () => {
    expect(checkELEligibility(rentnerin({ ahvRente: 1500 })).elPruefen).toBe(true);
  });

  it('Dossier: die Renten als eine Summe im Abschnitt Finanzen, in allen Sprachen beschriftet', () => {
    const p = rentenfeldProfil();
    const fin = getBehoerdenDossierPreview(p, [], t, {}).sections.find((x) => x.key === 'finanzen');
    expect(fin.rows.find((r) => r.label === de.behoerdenDossier.rentenSumme).value).toContain('1’800');
    for (const l of [fr, itTranslations, en, rm]) expect(l.behoerdenDossier.rentenSumme).toBeTruthy();
  });

  it('der Lohn-Hinweis schickt Renten in die Rentenfelder (keine Doppelzählung)', () => {
    expect(de.chapters.finanzen.hints.monthlyIncome.sie).toContain('Rentenfeldern');
  });

  it('die Sätze zeigen auf die Felder statt «kein Feld»', () => {
    expect(de.ipv.renteNichtEnthalten).toContain('noch nicht eingetragen');
    expect(de.ipv.renteNichtEnthalten).not.toContain('kein Feld');
    expect(de.sozialhilfe.renteNichtErfasst).toBe('Rente noch nicht eingetragen, Betrag offen');
  });
});
