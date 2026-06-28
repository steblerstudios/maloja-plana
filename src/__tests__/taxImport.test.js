import { describe, it, expect } from 'vitest';
import {
  parseSwissNumber, parseKeyValue, parseTaxXML, mapTaxFields,
  applyTaxToFinanzen, FIELD_MAP,
} from '../taxImport.js';
import en from '../i18n/en.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import itLang from '../i18n/it.js';
import rm from '../i18n/rm.js';

describe('parseSwissNumber', () => {
  it('liest Schweizer Formate (Apostroph, CHF, .-)', () => {
    expect(parseSwissNumber("60'000.00")).toBe(60000);
    expect(parseSwissNumber("CHF 18'500.-")).toBe(18500);
    expect(parseSwissNumber('60 000')).toBe(60000);
    expect(parseSwissNumber('1’234,50')).toBe(1234.5);
    expect(parseSwissNumber('1.234,50')).toBe(1234.5);
    expect(parseSwissNumber('1,234.50')).toBe(1234.5);
  });
  it('behandelt Vorzeichen und leere Eingaben', () => {
    expect(parseSwissNumber('-2400')).toBe(-2400);
    expect(parseSwissNumber('')).toBeNull();
    expect(parseSwissNumber(null)).toBeNull();
    expect(parseSwissNumber('keine Zahl')).toBeNull();
  });
});

describe('parseKeyValue', () => {
  it('trennt an Semikolon/Tab/Doppelpunkt und ignoriert Kommentare', () => {
    const rows = parseKeyValue('# Kommentar\nReineinkommen; 60\'000\nVermögen\t18500\nSteuer: 4800');
    expect(rows).toHaveLength(3);
    expect(rows[0]).toEqual({ rawKey: 'Reineinkommen', rawValue: "60'000" });
    expect(rows[1]).toEqual({ rawKey: 'Vermögen', rawValue: '18500' });
  });
});

describe('parseTaxXML', () => {
  it('extrahiert Tag-Werte ohne Namespace-Präfix', () => {
    const rows = parseTaxXML('<tax:Reineinkommen>55000</tax:Reineinkommen><Wertschriften>12000</Wertschriften>');
    expect(rows).toContainEqual({ rawKey: 'Reineinkommen', rawValue: '55000' });
    expect(rows).toContainEqual({ rawKey: 'Wertschriften', rawValue: '12000' });
  });
});

describe('mapTaxFields', () => {
  it('rechnet Jahres-Einkommen/-Steuer auf Monat um, Vermögen bleibt 1:1', () => {
    const { matched } = mapTaxFields([
      { rawKey: 'Reineinkommen', rawValue: '60000' },
      { rawKey: 'Wertschriften', rawValue: '12000' },
      { rawKey: 'Steuerbetrag', rawValue: '4800' },
    ]);
    const byTarget = Object.fromEntries(matched.map(m => [m.target, m]));
    expect(byTarget.monthlyIncome.value).toBe(5000);
    expect(byTarget.monthlyIncome.annualValue).toBe(60000);
    expect(byTarget.securitiesValue.value).toBe(12000);
    expect(byTarget.monthlyTax.value).toBe(400);
  });
  it('spezifisch vor generisch: Wertschriften != übriges Vermögen', () => {
    const { matched } = mapTaxFields([
      { rawKey: 'Wertschriften', rawValue: '10000' },
      { rawKey: 'Übriges Vermögen', rawValue: '5000' },
    ]);
    const targets = matched.map(m => m.target);
    expect(targets).toContain('securitiesValue');
    expect(targets).toContain('otherAssets');
  });
  it('ignoriert nicht zuordenbare Zeilen und Nullwerte', () => {
    const { matched, unmatched } = mapTaxFields([
      { rawKey: 'Lieblingsfarbe', rawValue: 'blau' },
      { rawKey: 'Einkommen', rawValue: '0' },
    ]);
    expect(matched).toHaveLength(0);
    expect(unmatched.some(u => u.rawKey === 'Lieblingsfarbe')).toBe(true);
  });
});

describe('applyTaxToFinanzen', () => {
  it('füllt nur leere Felder, überschreibt bestehende nie', () => {
    const { matched } = mapTaxFields([
      { rawKey: 'Einkommen', rawValue: '60000' },
      { rawKey: 'Sparkonto', rawValue: '18500' },
    ]);
    const { merged, applied, kept } = applyTaxToFinanzen(matched, { monthlyIncome: '4200' });
    expect(merged.monthlyIncome).toBe('4200'); // bestehend behalten
    expect(merged.savingsAccount).toBe('18500'); // neu gefüllt
    expect(applied.map(a => a.target)).toEqual(['savingsAccount']);
    expect(kept.map(k => k.target)).toEqual(['monthlyIncome']);
  });
});

describe('i18n-Parität der taxImport-Labels', () => {
  const langs = { en, de, fr, it: itLang, rm };
  const labelKeys = FIELD_MAP.map(f => f.labelKey);
  const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
  it('jeder labelKey existiert in allen 5 Sprachen', () => {
    for (const [name, lang] of Object.entries(langs)) {
      for (const key of labelKeys) {
        expect(get(lang, key), `${name}: ${key}`).toBeTruthy();
      }
    }
  });
});
