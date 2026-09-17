import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { generateBehoerdenJSON, STEUER_KENNUNG, DOSSIER_JSON_VERSION } from '../dossierGenerator.js';
import { steuernFuerProfil, steuerEingabenAusDaten } from '../data/kantonaleSteuerdaten.js';
import { TAXPUNKTWERT, TAXPUNKTWERT_QUELLEN, TAXPUNKTWERT_UNBELEGT_2026 } from '../data/kvgLeistungen.js';
import { KVGLeistungen, TpwQuellen } from '../KVGLeistungen.jsx';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

const SPRACHEN = { de, en, fr, it: it_, rm };
const tFuer = (lang) => createT(SPRACHEN, lang, 'sie');
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const tKey = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);

// ─────────────────────────────────────────────────────────────
// E40 · Behörden-JSON: feste Kennung + Text in der App-Sprache (Format 1.1)
// ─────────────────────────────────────────────────────────────
const profil = ({ monat = 5000, taxableIncome, dreizehnter } = {}) => ({
  basis: { canton: 'ZH', maritalStatus: 'single', household: { adults: 1, children: [] } },
  finanzen: { monthlyIncome: monat, ...(taxableIncome ? { taxableIncome } : {}), ...(dreizehnter ? { dreizehnter } : {}) },
  wohnen: {}, versicherungen: {},
});
// So baut BehoerdenDossier.jsx die Rechnung.
const rechnung = (p) => {
  const s = steuernFuerProfil(steuerEingabenAusDaten(p));
  return { tax: { total: s.bund.steuer, taxableIncome: s.bund.steuerBaresEinkommen, taxableQuelle: s.quelle, kantonal: s.kanton.kantonal, kantonOhneZahl: !s.kanton.kantonal, annahmen: s.annahmen, datenstand: '2026' } };
};

describe('E40 · Behörden-JSON mit Kennung und übersetztem Text', () => {
  const p = profil();
  const r = rechnung(p);
  const hauptort = r.tax.kantonal.hauptort;

  it('Deutsch: Kennungen und Texte', () => {
    const d = generateBehoerdenJSON(p, r, tFuer('de'));
    expect(d.version).toBe('1.1');
    expect(DOSSIER_JSON_VERSION).toBe('1.1');
    expect(d.textLanguage).toBe('de');
    const tax = d.calculations.tax;
    expect(tax.taxableIncomeBasis).toEqual({ code: 'estv_standardabzuege', text: 'Geschätzt: Nettolohn abzüglich der Standardabzüge des ESTV-Steuerrechners 2026', dataVersion: '2026' });
    expect(tax.cantonalBasis).toEqual({ code: 'estv_hauptort_ohne_kirchensteuer', text: 'ESTV-Steuerrechner 2026, Hauptort ' + hauptort + ', ohne Kirchensteuer, grobe Schätzung', dataVersion: '2026', hauptort });
    // 13. Monatslohn nicht beantwortet → Annahme steht in der Datei
    expect(tax.assumptions).toEqual([{ code: 'ohne_13_monatslohn', text: 'Ohne 13. Monatslohn gerechnet' }]);
  });

  it('Französisch: dieselben Kennungen, Text auf Französisch', () => {
    const d = generateBehoerdenJSON(p, r, tFuer('fr'));
    expect(d.textLanguage).toBe('fr');
    const tax = d.calculations.tax;
    expect(tax.taxableIncomeBasis.code).toBe('estv_standardabzuege');
    expect(tax.taxableIncomeBasis.text).toBe('Estimé : salaire net moins les déductions standard du calculateur d’impôts de l’AFC 2026');
    expect(tax.cantonalBasis.code).toBe('estv_hauptort_ohne_kirchensteuer');
    expect(tax.cantonalBasis.text).toBe('Calculateur d’impôts de l’AFC 2026, chef-lieu ' + hauptort + ', sans impôt ecclésiastique, estimation grossière');
    expect(tax.assumptions).toEqual([{ code: 'ohne_13_monatslohn', text: 'Calculé sans 13e salaire' }]);
  });

  it('alle fünf Sprachen: gleiche Kennungen, eigener Text, kein deutscher Klartext ausserhalb von de', () => {
    const codes = (tax) => [tax.taxableIncomeBasis.code, tax.cantonalBasis.code, ...tax.assumptions.map((a) => a.code)];
    const referenz = codes(generateBehoerdenJSON(p, r, tFuer('de')).calculations.tax);
    for (const lang of Object.keys(SPRACHEN)) {
      const d = generateBehoerdenJSON(p, r, tFuer(lang));
      expect(d.textLanguage, lang).toBe(lang);
      const tax = d.calculations.tax;
      expect(codes(tax), lang).toEqual(referenz);
      for (const e of [tax.taxableIncomeBasis, tax.cantonalBasis, ...tax.assumptions]) {
        expect(e.text, lang).toBeTruthy();
        expect(e.text, lang).not.toContain('behoerdenDossier.');
        expect(e.text, lang).not.toMatch(/\{\w+\}/);
        if (lang !== 'de') expect(e.text, lang).not.toMatch(/Steuerrechner|Nettolohn|Kirchensteuer|Monatslohn/);
      }
    }
  });

  it('direkt eingetragenes steuerbares Einkommen → Kennung eingetragen_dbst', () => {
    const q = profil({ taxableIncome: 50000, dreizehnter: 'no' });
    const tax = generateBehoerdenJSON(q, rechnung(q), tFuer('it')).calculations.tax;
    expect(tax.taxableIncomeBasis).toEqual({ code: 'eingetragen_dbst', text: 'Inserito (reddito imponibile, imposta federale diretta)' });
    expect(tax.assumptions).toEqual([]);
  });

  it('ohne Übersetzer (ältere Aufrufer) nur die Kennungen, keine Sprachangabe', () => {
    const d = generateBehoerdenJSON(p, r);
    expect(d.textLanguage).toBeUndefined();
    expect(d.calculations.tax.taxableIncomeBasis).toEqual({ code: 'estv_standardabzuege', dataVersion: '2026' });
    expect(d.calculations.tax.assumptions).toEqual([{ code: 'ohne_13_monatslohn' }]);
  });

  it('die Datei bleibt reines JSON (Hin- und Rückweg ohne Verlust)', () => {
    const d = generateBehoerdenJSON(p, r, tFuer('rm'));
    expect(JSON.parse(JSON.stringify(d))).toEqual(d);
  });

  it('jede Kennung hat in allen fünf Sprachen einen Text (und umgekehrt)', () => {
    for (const [lang, tr] of Object.entries(SPRACHEN)) {
      const texte = tr.behoerdenDossier.jsonTexte;
      expect(texte.sprache, lang).toBe(lang);
      expect(Object.keys(texte).filter((k) => k !== 'sprache').sort(), lang).toEqual(Object.keys(STEUER_KENNUNG).sort());
      // anredefrei: Datei für eine Stelle, keine Sie/Du-Varianten
      for (const v of Object.values(texte)) expect(typeof v, lang).toBe('string');
    }
  });
});

// ─────────────────────────────────────────────────────────────
// E41 · Quellen der Taxpunktwerte als Daten und als Link je Kanton
// ─────────────────────────────────────────────────────────────
describe('E41 · Taxpunktwert-Quellen je Kanton', () => {
  const datei = readFileSync(new URL('../data/kvgLeistungen.js', import.meta.url), 'utf-8');
  const kommentarZeilen = datei.split('\n').filter((z) => z.trim().startsWith('//'));

  it('genau die Kantone mit belegtem Wert haben eine Quelle, die neun unbelegten keine', () => {
    const belegt = Object.keys(TAXPUNKTWERT).filter((c) => !TAXPUNKTWERT_UNBELEGT_2026.includes(c)).sort();
    expect(Object.keys(TAXPUNKTWERT_QUELLEN).sort()).toEqual(belegt);
    expect(belegt).toHaveLength(17);
    for (const c of TAXPUNKTWERT_UNBELEGT_2026) expect(TAXPUNKTWERT_QUELLEN[c], c).toBeUndefined();
  });

  it('jede URL steht schon als Quelle im Kommentar (keine neue, keine erfundene)', () => {
    for (const [c, q] of Object.entries(TAXPUNKTWERT_QUELLEN)) {
      expect(q.url, c).toMatch(/^https:\/\//);
      expect(kommentarZeilen.some((z) => z.includes(q.url)), c + ' ' + q.url).toBe(true);
      expect(['behoerde', 'tarifpartner'], c).toContain(q.art);
    }
  });

  it('Tarifpartner-Quellen sind als solche gekennzeichnet (OW, NW, SZ)', () => {
    const tp = Object.keys(TAXPUNKTWERT_QUELLEN).filter((c) => TAXPUNKTWERT_QUELLEN[c].art === 'tarifpartner').sort();
    expect(tp).toEqual(['NW', 'OW', 'SZ']);
  });

  it('Anzeige: ein Link je Kanton, neuer Tab mit Ansage, Tarifpartner benannt', () => {
    const html = renderToStaticMarkup(React.createElement(TpwQuellen, { palette, t: tKey }));
    const links = html.match(/<a [^>]*>/g) || [];
    expect(links).toHaveLength(17);
    for (const a of links) {
      expect(a).toContain('target="_blank"');
      expect(a).toContain('rel="noopener noreferrer"');
    }
    expect(html.match(/a11y\.neuerTab/g)).toHaveLength(17);
    expect(html.match(/kvg\.tpwQuelleVor/g)).toHaveLength(17);
    expect(html).toContain('kvg.tpwQuellenTitel');
    expect(html).toContain('href="' + TAXPUNKTWERT_QUELLEN.ZH.url + '"');
    expect(html).toContain('OW (kvg.tpwQuelleTarifpartner)');
    expect(html).not.toContain('ZH (kvg.tpwQuelleTarifpartner)');
    for (const c of TAXPUNKTWERT_UNBELEGT_2026) expect(html, c).not.toMatch(new RegExp('>' + c + '(<| \\()'));
  });

  it('steht im Tab «Rechnung» der KVG-Seite', () => {
    const html = renderToStaticMarkup(React.createElement(KVGLeistungen, { palette, t: tKey, data: { basis: { canton: 'ZH' } }, initialTab: 'rechnung', onUpdateData: () => {} }));
    expect(html).toContain('data-testid="tpw-quellen"');
    expect(html.match(/kvg\.tpwQuelleVor/g)).toHaveLength(17);
  });

  it('Texte in allen fünf Sprachen', () => {
    for (const [lang, tr] of Object.entries(SPRACHEN)) {
      for (const k of ['tpwQuellenTitel', 'tpwQuelleVor', 'tpwQuelleTarifpartner']) {
        expect(typeof tr.kvg[k], lang + ' ' + k).toBe('string');
        expect(tr.kvg[k].length, lang + ' ' + k).toBeGreaterThan(3);
      }
    }
  });
});
