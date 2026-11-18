// Weiterbildungsabzug direkte Bundessteuer (DBG Art. 33 Abs. 1 Bst. j, Fassung seit 1.1.2025, AS 2024 479).
// Vortor 10.11.2026: der Betrag stand ohne Quelle im Rechner, der Text sagte nicht, dass er nur für den Bund gilt.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { WEITERBILDUNG_MAX } from '../data/steuerRechner.js';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';

const quelle = (p) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8');

describe('Weiterbildungsabzug', () => {
  it('13 000 Franken, mit Quelle an einer Stelle', () => {
    expect(WEITERBILDUNG_MAX).toBe(13000);
    expect(quelle('../data/steuerRechner.js')).toMatch(/DBG Art\. 33 Abs\. 1 Bst\. j[\s\S]*AS 2024 479[\s\S]*export const WEITERBILDUNG_MAX/);
  });

  it('der Rechner nimmt den Betrag von dort, nicht als eigene Zahl', () => {
    const s = quelle('../TaxCalculator.jsx');
    expect(s).toContain("max: WEITERBILDUNG_MAX, gesetz: 'education'");
    expect(s).not.toMatch(/max: 13000/);
  });

  it('der Grenz-Text nennt die direkte Bundessteuer und die eigenen Kantonsgrenzen', () => {
    expect(de.tax.grenze_education).toMatch(/direkten Bundessteuer[\s\S]*Kantone/);
    expect(fr.tax.grenze_education).toMatch(/Impôt fédéral direct[\s\S]*cantons/);
    expect(it_.tax.grenze_education).toMatch(/Imposta federale diretta[\s\S]*Cantoni/);
    expect(en.tax.grenze_education).toMatch(/Direct federal tax[\s\S]*[Cc]antons/);
  });
});
