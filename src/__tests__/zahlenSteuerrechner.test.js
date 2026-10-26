// Seitenrundgang 26.10.2026, Gruppe 5: Steuerrechner trennt Beispiel und eigene Daten (key: datenModus), Abzüge
// mit echtem Minus und Namen statt «Total (-)», Franken und Stundenlöhne über utils/geld.js.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js'; // nicht «it» — das überschriebe vitests it()
import rm from '../i18n/rm.js';
import { createT } from '../i18n/index.js';
import { calculateSozialhilfe } from '../config/cantonalData.js';

const quelle = (d) => fs.readFileSync(path.resolve(__dirname, '..', d), 'utf8');
const ohneKommentare = (s) => s.split('\n').filter((z) => !/^\s*\/\//.test(z)).join('\n');

describe('Steuerrechner', () => {
  it('wird nach Wechsel zwischen Beispiel und eigenen Daten neu aufgebaut (key: datenModus)', () => {
    const main = quelle('main.jsx');
    const i = main.indexOf("view === 'tax' && React.createElement(TaxCalculator, {");
    expect(i).toBeGreaterThan(-1);
    expect(main.slice(i, i + 500)).toMatch(/key: datenModus,/);
  });
  it('Abzüge benannt, mit echtem Minus statt «- CHF» und «Total (-)»', () => {
    const src = ohneKommentare(quelle('TaxCalculator.jsx'));
    expect(src).not.toMatch(/'- ' \+ betrag/);
    expect(src).not.toMatch(/t\('common\.total'\) \+ ' \(-\)'/);
    expect(src).toMatch(/betrag\(-\(income - taxableIncome\)\)/);
    for (const s of [de, en, fr, itSprache, rm]) expect(s.tax.abzuegeGeschaetzt).toBeTruthy();
  });
});

describe('Franken und Stundenlöhne über utils/geld.js', () => {
  it('Sozialhilfe-Hinweis: Betrag mit Apostroph', () => {
    const t = createT({ de }, 'de');
    const r = calculateSozialhilfe({ basis: { canton: 'ZH' }, wohnen: { rentAmount: 2400 }, versicherungen: { kkPremium: 500 } });
    expect(typeof r.noteParams.value).toBe('number');
    expect(t(r.noteKey, r.noteParams)).toMatch(/CHF \d’\d{3}\/Monat/);
  });
  it('kein toFixed mehr an den gemeldeten Stellen', () => {
    expect(ohneKommentare(quelle('config/cantonalData.js'))).not.toMatch(/deficit\.toFixed/);
    expect(quelle('PflegeEntloehnung.jsx')).not.toMatch(/OKP_GRUNDPFLEGE_PRO_STUNDE\.toFixed/);
    expect(quelle('briefGenerator.js')).not.toMatch(/(lohnStunde|mindestStunde)\.toFixed/);
    expect(quelle('components/LohnEinordnung.jsx')).not.toMatch(/chfStunde\.toFixed/);
    expect(quelle('ChapterView.jsx')).not.toMatch(/(lohnStunde|mindestStunde)\.toFixed/);
  });
});
