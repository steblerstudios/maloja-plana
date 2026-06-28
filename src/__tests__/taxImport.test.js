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
  it('erkennt Vorzeichen auch nach Präfix (CHF -2400, Klammern)', () => {
    expect(parseSwissNumber('CHF -2400')).toBe(-2400);
    expect(parseSwissNumber("(2'400)")).toBe(-2400);
    expect(parseSwissNumber("CHF 18'500.-")).toBe(18500); // .- ist kein Minus
  });
  it('klebt keine Ziffern aus nachgestelltem Text an den Betrag', () => {
    expect(parseSwissNumber("12'000 (Stand 2024)")).toBe(12000);
    expect(parseSwissNumber('Wertschriften 12000')).toBe(12000);
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
  it('Mehrfach-Knoten-XML (eCH-0196-nah): Gesamtsumme schlägt erste Teilsumme', () => {
    // Bund/Kanton/Gemeinde einzeln + Gesamtbetrag — der Gesamtbetrag steht
    // bewusst zuletzt, damit der frühere "erster Treffer gewinnt"-Bug auffiele.
    const xml = `<Steuerveranlagung>
      <Steuerbetrag>1200</Steuerbetrag>
      <Steuerbetrag>1800</Steuerbetrag>
      <Steuerbetrag>1800</Steuerbetrag>
      <TotalSteuerbetrag>4800</TotalSteuerbetrag>
    </Steuerveranlagung>`;
    const { matched } = mapTaxFields(parseTaxXML(xml));
    const tax = matched.find(m => m.target === 'monthlyTax');
    expect(tax.annualValue).toBe(4800); // nicht 1200 (erster Knoten)
    expect(tax.value).toBe(400);
  });
});

describe('mapTaxFields', () => {
  it('rechnet Jahres-Einkommen/-Steuer auf Monat um, Vermögen bleibt 1:1', () => {
    const { matched } = mapTaxFields([
      { rawKey: 'Bruttolohn', rawValue: '60000' },
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
  it('zählt Gesamtvermögen nicht als otherAssets (sonst Doppelzählung mit Wertschriften/Sparkonto)', () => {
    // Eine Steuererklärung listet i.d.R. Posten UND deren Summe.
    const { matched, unmatched } = mapTaxFields([
      { rawKey: 'Wertschriften', rawValue: '12000' },
      { rawKey: 'Sparkonto', rawValue: '18500' },
      { rawKey: 'Steuerbares Vermögen', rawValue: '30500' }, // Summe der beiden
    ]);
    const targets = matched.map(m => m.target);
    expect(targets).toContain('securitiesValue');
    expect(targets).toContain('savingsAccount');
    expect(targets).not.toContain('otherAssets'); // Summe wird nicht erneut übernommen
    expect(unmatched.some(u => u.rawKey === 'Steuerbares Vermögen')).toBe(true);
  });
  it('übernimmt Nettoeinkommen nicht als Brutto-monthlyIncome (würde Abzüge doppelt rechnen)', () => {
    const { matched } = mapTaxFields([{ rawKey: 'Reineinkommen', rawValue: '60000' }]);
    expect(matched.map(m => m.target)).not.toContain('monthlyIncome');
  });
  it('mehrere Treffer fürs gleiche Feld: als Total markierter Knoten gewinnt (nicht der erste)', () => {
    const { matched } = mapTaxFields([
      { rawKey: 'Steuerbetrag', rawValue: '1200' },        // Bund (zuerst)
      { rawKey: 'Steuerbetrag', rawValue: '1800' },        // Kanton
      { rawKey: 'Gesamtsteuerbetrag', rawValue: '4800' },  // Total (markiert)
    ]);
    const tax = matched.find(m => m.target === 'monthlyTax');
    expect(tax.annualValue).toBe(4800);
    expect(tax.rawKey).toBe('Gesamtsteuerbetrag');
  });
  it('mehrere Treffer ohne Total-Markierung: grösster Betrag statt des ersten', () => {
    const { matched } = mapTaxFields([
      { rawKey: 'Steuerbetrag', rawValue: '1200' },
      { rawKey: 'Steuerbetrag', rawValue: '1800' },
    ]);
    expect(matched.find(m => m.target === 'monthlyTax').annualValue).toBe(1800);
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
      { rawKey: 'Bruttolohn', rawValue: '60000' },
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
