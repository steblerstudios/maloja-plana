// Deploy-Gate 0.1.37-beta, Korrekturen (19.09.2026).
//   1 · Versicherergruppe direkt beim berechneten Taxpunkt-Ergebnis (Arztrechnung + Franchise-Tab)
//   2 · Franchise-Tab: Hinweis «Stand 2025» für Kantone ohne belegten Wert 2026
//   3 · K99: Individualbesteuerung «soll 2032 in Kraft treten» statt «tritt … in Kraft»
//   6 · a11y: kleine Live-Regionen für den Wechsel Zahl ↔ Hinweis (Steuerrechner) und «QR erstellt»
//   7 · fr: ein Apostroph-Typ innerhalb von tax.ohneZahlPartnerOffen
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TAXPUNKTWERT_QUELLEN, TAXPUNKTWERT_UNBELEGT_2026 } from '../data/kvgLeistungen.js';
import * as KVG from '../KVGLeistungen.jsx';
import * as Steuer from '../TaxCalculator.jsx';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

const SPRACHEN = { de, en, fr, it: it_, rm };
const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
const tKey = (k, p) => (p && typeof p === 'object' && Object.keys(p).length ? k + '(' + Object.values(p).join('|') + ')' : k);
const quelle = (datei) => fs.readFileSync(path.join(__dirname, '..', datei), 'utf8');
const hinweiseHtml = (canton, extra = {}) =>
  renderToStaticMarkup(React.createElement(KVG.TpwErgebnisHinweise, { palette, t: tKey, canton, ...extra }));

// ─────────────────────────────────────────────────────────────
// 1 · Versicherergruppe beim Ergebnis. Die Gruppe steht in den Daten (TAXPUNKTWERT_QUELLEN.gruppe)
//     und muss zum schon belegten Linktext passen (kvg.tpwQuelle<zusatz>, K88/K92).
// ─────────────────────────────────────────────────────────────
describe('1 · Versicherergruppe direkt beim Ergebnis', () => {
  it('jede Quelle mit zusatz trägt eine gruppe, die im belegten Linktext steht', () => {
    const mitZusatz = Object.entries(TAXPUNKTWERT_QUELLEN).filter(([, q]) => q.zusatz);
    expect(mitZusatz.map(([c]) => c).sort()).toEqual(['GE', 'LU', 'SZ', 'UR', 'VD']);
    for (const [c, q] of mitZusatz) {
      expect(typeof q.gruppe, c).toBe('string');
      for (const [lang, tr] of Object.entries(SPRACHEN)) {
        expect(tr.kvg['tpwQuelle' + q.zusatz], lang + ' ' + c).toContain(q.gruppe);
      }
    }
    expect(TAXPUNKTWERT_QUELLEN.GE.gruppe).toBe('CSS');
    expect(TAXPUNKTWERT_QUELLEN.UR.gruppe).toBe('HSK');
    expect(TAXPUNKTWERT_QUELLEN.VD.gruppe).toBe('santéservices');
    expect(TAXPUNKTWERT_QUELLEN.LU.gruppe).toBe('santéservices');
    expect(TAXPUNKTWERT_QUELLEN.SZ.gruppe).toBe('santéservices');
  });

  it('Zeile beim Ergebnis: Gruppe aus den Daten, SZ mit dem belegten Zweitwert', () => {
    expect(hinweiseHtml('GE')).toContain('kvg.tpwErgebnisGruppe(CSS)');
    expect(hinweiseHtml('UR')).toContain('kvg.tpwErgebnisGruppe(HSK)');
    expect(hinweiseHtml('VD')).toContain('kvg.tpwErgebnisGruppe(santéservices)');
    expect(hinweiseHtml('LU')).toContain('kvg.tpwErgebnisGruppe(santéservices)');
    expect(hinweiseHtml('SZ')).toContain('kvg.tpwErgebnisGruppeSZ');
    // Beleg gilt für alle Versicherer → keine Zeile
    for (const c of ['ZH', 'BE', 'TI', 'AG']) expect(hinweiseHtml(c)).not.toContain('tpwErgebnisGruppe');
  });

  it('Texte in allen fünf Sprachen, mit Platzhalter; SZ nennt 0.86 für CSS und HSK', () => {
    for (const [lang, tr] of Object.entries(SPRACHEN)) {
      expect(tr.kvg.tpwErgebnisGruppe, lang).toContain('{gruppe}');
      expect(tr.kvg.tpwErgebnisGruppeSZ, lang).toMatch(/santéservices/);
      expect(tr.kvg.tpwErgebnisGruppeSZ, lang).toMatch(/0\.86/);
      expect(tr.kvg.tpwErgebnisGruppeSZ, lang).toMatch(/CSS.*HSK/);
    }
    expect(de.kvg.tpwErgebnisGruppe).toBe('Belegt für Versicherte von {gruppe}; bei anderen Kassen kann der Wert abweichen.');
  });

  it('beide Ergebnisse nutzen die Zeile: Arztrechnung und Umrechnung im Franchise-Tab', () => {
    const src = quelle('KVGLeistungen.jsx');
    const rechnung = src.slice(src.indexOf('const RechnungTab'), src.indexOf('export const TpwErgebnisHinweise'));
    expect(rechnung).toMatch(/result && React\.createElement\('div'[\s\S]*TpwErgebnisHinweise/);
    // Franchise-Tab: bei offener Umrechnung und bekanntem Kanton, vor dem Tippfeld «Nicht gedeckt»
    const i = src.indexOf("t('kvg.belegTpApply')");
    const j = src.indexOf('TpwErgebnisHinweise', i);
    expect(j).toBeGreaterThan(i);
    expect(j).toBeLessThan(src.indexOf('setNgOpen(!ngOpen)', i));
    expect(src.slice(i, j)).toContain('tpOpen && tpw !== null && React.createElement(');
  });
});

// ─────────────────────────────────────────────────────────────
// 2 · «Stand 2025» auch im Franchise-Tab
// ─────────────────────────────────────────────────────────────
describe('2 · Hinweis «Stand 2025» bei Kantonen ohne Beleg 2026', () => {
  it('jeder unbelegte Kanton bekommt kvg.tpwStandUnbelegt', () => {
    for (const c of TAXPUNKTWERT_UNBELEGT_2026) {
      expect(hinweiseHtml(c), c).toContain('kvg.tpwStandUnbelegt(' + c + ')');
    }
    expect(hinweiseHtml('ZH')).not.toContain('tpwStandUnbelegt');
  });

  it('Datenstand der belegten Werte nur, wo verlangt (Arztrechnung)', () => {
    expect(hinweiseHtml('ZH', { mitDatenstand: true })).toContain('kvg.tpwDataVersion: 2026-09-19');
    expect(hinweiseHtml('ZH')).not.toContain('tpwDataVersion');
    expect(hinweiseHtml('AG', { mitDatenstand: true })).not.toContain('tpwDataVersion');
  });
});

// ─────────────────────────────────────────────────────────────
// 3 · K99 vorsichtiger. ESTV-Medienmitteilung 19.08.2026 (abgerufen 19.09.2026):
//     «Die Individualbesteuerung soll 2032 in Kraft treten.» Vorbehalte laut derselben Mitteilung:
//     Volksinitiative (Abstimmung 29.11.2026) und eine mögliche erneute Gesetzesänderung.
// ─────────────────────────────────────────────────────────────
describe('3 · Individualbesteuerung: «soll 2032 in Kraft treten»', () => {
  const erwartet = {
    de: 'soll 2032 in Kraft treten (Entscheid des Bundesrats vom 19. August 2026)',
    fr: 'devrait entrer en vigueur en 2032 (décision du Conseil fédéral du 19 août 2026)',
    it: 'dovrebbe entrare in vigore nel 2032 (decisione del Consiglio federale del 19 agosto 2026)',
    en: 'is due to enter into force in 2032 (Federal Council decision of 19 August 2026)',
    rm: 'duai entrar en vigur il 2032 (decisiun dal Cussegl federal dals 19 d’avust 2026)',
  };
  for (const [lang, satz] of Object.entries(erwartet)) {
    it(lang, () => {
      const v = SPRACHEN[lang].tax.saeulen.einzelnPending;
      expect(v).toContain(satz);
      expect(v).not.toMatch(/tritt 2032|entre en vigueur en 2032|entra in vigore nel 2032|enters into force in 2032|entra en vigur il 2032/);
    });
  }
});

// ─────────────────────────────────────────────────────────────
// 6 · Ansagen. Steuerrechner: nur der Wechsel Zahl ↔ Hinweis, nicht jede Zahl.
// ─────────────────────────────────────────────────────────────
describe('6 · Steuerrechner meldet den Wechsel zwischen Zahl und Hinweis', () => {
  it('hinweisTeile: welche Teile gerade einen Hinweis statt einer Zahl zeigen', () => {
    const { hinweisTeile } = Steuer;
    expect(hinweisTeile({ taxResult: { steuer: 1 }, canton: 'ZH', kantonal: { total: 1 }, gemeinsamDirekt: false })).toEqual([]);
    expect(hinweisTeile({ taxResult: null, canton: 'ZH', kantonal: null, gemeinsamDirekt: false })).toEqual(['bund', 'kanton']);
    expect(hinweisTeile({ taxResult: { steuer: 1 }, canton: 'ZH', kantonal: null, gemeinsamDirekt: false })).toEqual(['kanton']);
    // K86: Satz und Nettoeinkommen fallen weg
    expect(hinweisTeile({ taxResult: { steuer: 1 }, canton: 'ZH', kantonal: { total: 1 }, gemeinsamDirekt: true })).toEqual(['netto']);
    // ohne Kanton: kein Wechsel Zahl → Hinweis beim Kanton (dort steht «Kanton wählen»)
    expect(hinweisTeile({ taxResult: { steuer: 1 }, canton: '', kantonal: null, gemeinsamDirekt: false })).toEqual([]);
  });

  it('steuerAnsageText nennt die Teile, bzw. dass wieder Zahlen stehen', () => {
    const { steuerAnsageText } = Steuer;
    expect(steuerAnsageText(tKey, ['bund', 'kanton'])).toBe('tax.ansageHinweis(tax.federalTax, tax.cantonalAndMunicipal)');
    expect(steuerAnsageText(tKey, ['netto'])).toBe('tax.ansageHinweis(tax.netIncome)');
    expect(steuerAnsageText(tKey, [])).toBe('tax.ansageZahlen');
  });

  it('eine kleine Live-Region, die nur die Ansage trägt; Start leer', () => {
    const src = quelle('TaxCalculator.jsx');
    expect(src).toMatch(/'data-testid': 'steuer-ansage', role: 'status', 'aria-live': 'polite', style: visuallyHiddenStyle \}, ansage\)/);
    expect(src).toMatch(/const \[ansage, setAnsage\] = useState\(''\)/);
  });

  it('Texte in allen fünf Sprachen', () => {
    for (const [lang, tr] of Object.entries(SPRACHEN)) {
      expect(tr.tax.ansageHinweis, lang).toContain('{teile}');
      expect(typeof tr.tax.ansageZahlen, lang).toBe('string');
      expect(tr.tax.ansageZahlen.length, lang).toBeGreaterThan(10);
    }
  });
});

describe('6 · QR: höfliche Ansage «erstellt», ohne Inhalt, Hinweis bleibt ohne Live-Region', () => {
  for (const datei of ['KKScanner.jsx', 'OrganDonation.jsx']) {
    it(datei, () => {
      const src = quelle(datei);
      // eigene, immer vorhandene, unsichtbare Live-Region mit nur dem Ansage-Text
      expect(src).toMatch(/role: 'status', 'aria-live': 'polite', style: visuallyHiddenStyle \}, qrAnsage\)/);
      // gesetzt erst nach erfolgreichem Zeichnen, vorher geleert (damit ein zweites Erzeugen wieder angesagt wird)
      expect(src).toMatch(/setQrAnsage\(''\)/);
      expect(src).toMatch(/if \(ok\) setQrAnsage\(t\('common\.qrErstellt'\)\)/);
      // der Hinweis selbst bleibt ohne Live-Region (Vorgabe 0.1.36)
      const i = src.indexOf("t('notfallDossier.qrHint')");
      const element = src.slice(src.lastIndexOf('React.createElement', i), i);
      expect(element).not.toMatch(/role:\s*'status'|aria-live/);
    });
  }

  it('Text in allen fünf Sprachen, ohne QR-Inhalt', () => {
    for (const [lang, tr] of Object.entries(SPRACHEN)) {
      expect(typeof tr.common.qrErstellt, lang).toBe('string');
      expect(tr.common.qrErstellt, lang).toMatch(/QR/);
      expect(tr.common.qrErstellt, lang).not.toMatch(/\{/);
    }
  });
});

// ─────────────────────────────────────────────────────────────
// 7 · fr: ein Apostroph-Typ je String
// ─────────────────────────────────────────────────────────────
describe('7 · fr ohneZahlPartnerOffen: einheitlicher Apostroph', () => {
  it('sie und du', () => {
    for (const form of ['sie', 'du']) {
      const v = fr.tax.ohneZahlPartnerOffen[form];
      expect(v, form).toContain("n'a pas de revenu");
      expect(v, form).not.toContain('’');
    }
  });
});
