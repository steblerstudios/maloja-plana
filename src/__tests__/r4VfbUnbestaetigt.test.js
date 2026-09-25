// R4 (Predeploy-Gate 16.09.): «Kantonal nicht bestätigt» beim Vermögensfreibetrag
// auch dann, wenn das Vermögen UNTER dem Freibetrag liegt — dort fliesst der
// unbestätigte Betrag direkt in die Aussage «Anspruch» bzw. in einen Betrag ein.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { berechneSozialhilfe } from '../data/sozialhilfeRechner.js';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import rm from '../i18n/rm.js';

const quelle = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const basis = { adults: 1, miete: 1200, krankenkassePraemie: 400 };

describe('berechneSozialhilfe: Flag vfbUnbestaetigt', () => {
  it('TI, Vermögen unter dem Freibetrag, Anspruch → gekennzeichnet', () => {
    const r = berechneSozialhilfe({ ...basis, kanton: 'TI', vermoegen: 5000 });
    expect(r.anrechenbaresVermoegen).toBe(0);
    expect(r.hatAnspruch).toBe(true);
    expect(r.vfbUnbestaetigt).toBe(true);
  });
  it('TI ohne erfasstes Vermögen → nicht gekennzeichnet (Freibetrag spielt keine Rolle)', () => {
    expect(berechneSozialhilfe({ ...basis, kanton: 'TI', vermoegen: 0 }).vfbUnbestaetigt).toBe(false);
  });
  it('belegter Kanton (ZH) → nie gekennzeichnet', () => {
    expect(berechneSozialhilfe({ ...basis, kanton: 'ZH', vermoegen: 1000 }).vfbUnbestaetigt).toBe(false);
  });
  it('AG nur mit minderjährigen Kindern gekennzeichnet', () => {
    expect(berechneSozialhilfe({ ...basis, kanton: 'AG', vermoegen: 1000 }).vfbUnbestaetigt).toBe(false);
    expect(berechneSozialhilfe({ ...basis, kanton: 'AG', kinderImHaushalt: 1, vermoegen: 1000 }).vfbUnbestaetigt).toBe(true);
  });
});

describe('calculateSozialhilfe: Flag vfbUnbestaetigt', () => {
  const calc = (canton, savingsAccount, children = []) => calculateSozialhilfe({
    basis: { canton, household: { adults: 1, children } },
    finanzen: { savingsAccount }, wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 400 },
  });
  it('TI, Vermögen 5000 unter 10000 → gekennzeichnet, nichts über dem Freibetrag', () => {
    const r = calc('TI', 5000);
    expect(r.vermoegenUeberFreibetrag).toBe(0);
    expect(r.vfbUnbestaetigt).toBe(true);
  });
  it('ohne Vermögen oder in belegtem Kanton → nicht gekennzeichnet', () => {
    expect(calc('TI', 0).vfbUnbestaetigt).toBe(false);
    expect(calc('BS', 5000).vfbUnbestaetigt).toBe(false);
  });
  it('SH nur mit minderjährigem Kind', () => {
    expect(calc('SH', 500).vfbUnbestaetigt).toBe(false);
    expect(calc('SH', 500, [{ age: 4 }]).vfbUnbestaetigt).toBe(true);
  });
});

describe('Anzeige: der Hinweis steht einmal, auch unter dem Freibetrag', () => {
  it('SozialhilfeView und SozialhilfeRechner nutzen das Flag und den Unter-Freibetrag-Text', () => {
    for (const f of ['../SozialhilfeView.jsx', '../SozialhilfeRechner.jsx']) {
      const s = quelle(f);
      expect(s, f).toContain('vfbUnbestaetigt');
      expect(s, f).toContain('assetLimitUnconfirmedUnder');
      expect(s, f).not.toContain('vermoegensfreibetragUnbestaetigt(');
    }
  });
  it('Schnellcheck und Dashboard zeigen eine leise Zeile beim Sozialhilfe-Betrag', () => {
    // Die Dashboard-Liste liegt seit 25.09.2026 in components/Leistungsliste.jsx (lazy).
    for (const f of ['../Schnellcheck.jsx', '../components/Leistungsliste.jsx']) {
      const s = quelle(f);
      expect(s, f).toContain('vfbUnbestaetigt');
      expect(s, f).toContain('assetLimitUnconfirmedShort');
    }
  });
  it('neue Texte in allen 5 Sprachen, mit Platzhalter {freibetrag}', () => {
    for (const [lang, d] of Object.entries({ de, en, fr, it: it_, rm })) {
      const under = d.sozialhilfe.assetLimitUnconfirmedUnder;
      const texte = typeof under === 'string' ? [under] : [under.sie, under.du];
      for (const x of texte) expect(x, lang).toContain('{freibetrag}');
      expect(d.sozialhilfe.assetLimitUnconfirmedShort, lang).toBeTruthy();
    }
  });
});
