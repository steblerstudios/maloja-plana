import { describe, it, expect, beforeAll } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { calculateSozialhilfe, calculateIPV, ladeIPVModelle, preloadPLZ } from '../config/cantonalData.js';
import { finanzWerte, druckAbschnitte, sozialhilfeKarte, ipvKarte } from '../components/FinanzAuswertung.jsx';
import { getBehoerdenDossierPreview, generateBehoerdenJSON } from '../dossierGenerator.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';

// Folge zu #684/#686 (04.11.2026): calculateSozialhilfe rechnet einen brutto erfassten Lohn seit 25.09.2026 mit dem
// Netto-Richtwert und meldet `einkommenGeschaetzt` — gelesen hat das Feld niemand. Finanz-Übersicht und Behörden-Dossier
// zeigten den Netto-Richtwert als «Einkommen», ohne zu sagen, dass er geschätzt ist. Der Sozialhilfe-Rechner selbst
// fragt bei brutto nach dem Nettolohn (sozialhilfeVorbefuellung) und braucht keinen Hinweis.
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const t = (k) => k;

// Beispiel der Fachprüfung 25.09.2026 (sozialhilfeBruttoBasis.test.js): BE, allein, 40 Jahre, Miete 1300, Prämie 400.
const profil = (incomeType, extra = {}) => ({
  basis: { canton: 'BE', dateOfBirth: '1986-03-01', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: 2700, incomeType, employmentType: 'employed', ...extra },
  wohnen: { rentAmount: 1300 },
  versicherungen: { kkPremium: 400 },
});
const HINWEIS = 'sozialhilfe.einkommenAusBrutto';
const druckText = (data) => JSON.stringify(druckAbschnitte(t, finanzWerte(data, t)));
const karte = (data) => renderToStaticMarkup(sozialhilfeKarte({ palette, t, onNavigate: () => {}, w: finanzWerte(data, t) }));

beforeAll(async () => {
  preloadPLZ();
  await ladeIPVModelle();
  await new Promise((r) => setTimeout(r, 0));
});

describe('Sozialhilfe: Hinweis «aus brutto geschätzt»', () => {
  it('Voraussetzung: brutto wird geschätzt, netto nicht', () => {
    expect(calculateSozialhilfe(profil('brutto')).einkommenGeschaetzt).toBe(true);
    expect(calculateSozialhilfe(profil('netto')).einkommenGeschaetzt).toBe(false);
  });

  it('Finanz-Übersicht: Karte und Druck sagen es, bei netto nicht', () => {
    expect(karte(profil('brutto'))).toContain('behoerdenDossier.jsonTexte.annahmeAusBrutto');
    expect(druckText(profil('brutto'))).toContain(HINWEIS);
    expect(karte(profil('netto'))).not.toContain('behoerdenDossier.jsonTexte.annahmeAusBrutto');
    expect(druckText(profil('netto'))).not.toContain(HINWEIS);
  });

  it('Behörden-Dossier: Hinweis auf dem Blatt, Feld in der Datei', () => {
    const p = profil('brutto');
    const sozialhilfe = calculateSozialhilfe(p);
    const blatt = getBehoerdenDossierPreview(p, [], t, { sozialhilfe }).sections.find((x) => x.key === 'sozialhilfe');
    expect(blatt.notes).toContain(HINWEIS);
    expect(generateBehoerdenJSON(p, { sozialhilfe }, t).calculations.sozialhilfe.einkommenGeschaetzt).toBe(true);
    const n = profil('netto');
    const nSoz = calculateSozialhilfe(n);
    expect(getBehoerdenDossierPreview(n, [], t, { sozialhilfe: nSoz }).sections.find((x) => x.key === 'sozialhilfe').notes).not.toContain(HINWEIS);
    expect(generateBehoerdenJSON(n, { sozialhilfe: nSoz }, t).calculations.sozialhilfe.einkommenGeschaetzt).toBe(false);
  });

  it('Selbständige: nicht geschätzt, kein Hinweis', () => {
    const p = profil('brutto', { employmentType: 'selfEmployed' });
    expect(calculateSozialhilfe(p).einkommenGeschaetzt).toBe(false);
    expect(karte(p)).not.toContain('behoerdenDossier.jsonTexte.annahmeAusBrutto');
  });

  it('der Text steht in allen fünf Sprachen', () => {
    for (const l of [de, fr, itSprache, en, rm]) expect(l.sozialhilfe.einkommenAusBrutto).toBeTruthy();
  });
});

describe('IPV in der Finanz-Übersicht: dieselbe Annahme wie im IPV-Rechner', () => {
  const ag = (incomeType) => ({
    basis: { canton: 'AG', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
    finanzen: { monthlyIncome: 1500, incomeType, employmentType: 'employed', dreizehnter: 'no' },
    wohnen: { postalCode: '5000', city: 'Aarau', rentAmount: 1200 },
    versicherungen: { kkPremium: 420 },
  });
  it('Karte und Druck nennen sie bei brutto', () => {
    expect(calculateIPV(ag('brutto')).annahmen.ausBrutto).toBe(true);
    const karteIpv = (d) => renderToStaticMarkup(ipvKarte({ palette, t, onNavigate: () => {}, w: finanzWerte(d, t) }));
    expect(karteIpv(ag('brutto'))).toContain('ipv.annahmeAusBrutto');
    expect(druckText(ag('brutto'))).toContain('ipv.annahmeAusBrutto');
    expect(karteIpv(ag('netto'))).not.toContain('ipv.annahmeAusBrutto');
  });
});

describe('Schnellcheck-Übergabe im IPV-Rechner: die Beschriftung sagt netto', () => {
  // Übergeben werden nur netto eingetippte Löhne (Schnellcheck.jsx, Leistungsliste.jsx); die Zeile hiess «(brutto)».
  it.each([['de', de, /netto/], ['fr', fr, /net/], ['it', itSprache, /netto/], ['en', en, /net/], ['rm', rm, /net/]])('%s', (_, l, re) => {
    expect(l.schnellcheck.income).toMatch(re);
    expect(l.schnellcheck.income).not.toMatch(/brutto|brut\b|gross|lordo/);
  });
});
