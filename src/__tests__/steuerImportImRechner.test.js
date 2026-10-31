// F7-L8 (31.10.2026): Der Steuer-Import ist keine eigene Seite mehr, sondern eine aufklappbare Zeile im Steuer-Rechner.
// Er bleibt ein eigener Baustein, der erst beim Aufklappen lädt — das Startbündel trägt ihn nicht.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parseHash, UMLEITUNGEN } from '../utils/hashRouter.js';
import { WERKZEUGE } from '../data/werkzeugRegister.js';

const quelle = (d) => fs.readFileSync(path.resolve(__dirname, '..', d), 'utf8');

describe('Steuer-Import im Rechner', () => {
  it('der Import lädt erst beim Aufklappen, nicht im Hauptbündel', () => {
    const rechner = quelle('TaxCalculator.jsx');
    expect(rechner).toContain("React.lazy(() => import('./TaxImport.jsx'))");
    expect(rechner).toMatch(/importOffen && React\.createElement\(React\.Suspense/);
    expect(quelle('main.jsx')).not.toMatch(/import\(?['"]\.\/TaxImport/);
    expect(quelle('main.jsx')).not.toMatch(/from '\.\/taxImport/);
  });
  it('der alte Link führt in den Rechner und klappt den Import auf', () => {
    expect(UMLEITUNGEN.taxImport).toEqual({ view: 'tax', chapterIndex: null, anker: 'mp-steuer-import' });
    expect(quelle('TaxCalculator.jsx')).toContain("TAX_IMPORT_ANKER = 'mp-steuer-import'");
    expect(parseHash('#/taxImport').view).toBeTruthy();
  });
  it('die Suche findet ihn über den Rechner, er steht nicht mehr doppelt im Register', () => {
    const eintrag = WERKZEUGE.find((w) => w.view === 'tax');
    expect(eintrag.aliases).toEqual(expect.arrayContaining(['steuerimport', 'steuererklärung']));
    expect(WERKZEUGE.some((w) => w.view === 'taxImport')).toBe(false);
  });
  it('das steuerbare Einkommen zählt nach dem Import nur, wenn das Feld leer war', () => {
    expect(quelle('TaxCalculator.jsx')).toContain('if (!taxableInput && merged.taxableIncome)');
  });
  it('3a aus Finanzen kommt auf Klick, nie still in den Abzug', () => {
    const rechner = quelle('TaxCalculator.jsx');
    expect(rechner).toContain("'data-teil': 'aus-3a-tracker'");
    expect(rechner).toContain("value: taxData[ded.key] || ''");
  });
  it('bestehende Werte bleiben: der Import füllt weiter nur Leeres', () => {
    expect(quelle('TaxImport.jsx')).toContain('fill-if-empty');
  });
});
