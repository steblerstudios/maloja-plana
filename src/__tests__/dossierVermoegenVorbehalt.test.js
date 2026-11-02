import { describe, it, expect } from 'vitest';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { getBehoerdenDossierPreview, generateBehoerdenJSON } from '../dossierGenerator.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

// Rechtsprüfung auf ca276eac: Das Blatt an die Behörde nannte «Vermögen über dem Freibetrag» ohne den Vorbehalt, den
// Seite und Rechner zeigen, und ohne die Zahl dahinter (3a und 3b stehen sonst nicht auf dem Blatt).
// SKOS-RL D.3.1 Abs. 2 und 3, Version 1.1.2026: Ausnahmen, Frist, in der Zwischenzeit Unterstützung bei Bedarf.
const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
const profil = (canton, finanzen) => ({
  basis: { canton, dateOfBirth: '1986-03-01', household: { adults: 1, children: [] } },
  finanzen: { employmentType: 'employed', monthlyIncome: 800, incomeType: 'netto', ...finanzen },
  wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 300 },
});
const blatt = (p) => {
  const sozialhilfe = calculateSozialhilfe(p);
  return { sozialhilfe, sicht: JSON.stringify(getBehoerdenDossierPreview(p, [], t, { sozialhilfe })), datei: generateBehoerdenJSON(p, { sozialhilfe }, t).calculations.sozialhilfe };
};
const VORBEHALT = 'Vermögensfreibetrag kantonal nicht bestätigt.';

describe('Blatt an die Behörde: Vermögen über dem Freibetrag', () => {
  it('ohne kantonale Bestätigung steht der Vorbehalt auf dem Blatt und in der Datei', () => {
    const { sozialhilfe, sicht, datei } = blatt(profil('BL', { savingsAccount: 12000 }));
    expect(sozialhilfe.vfbUnbestaetigt).toBe(true);
    expect(sicht).toContain(VORBEHALT);
    expect(datei.vermoegensfreibetragUnbestaetigt).toBe(true);
  });
  it('kantonal bestätigt: kein Vorbehalt', () => {
    const { sozialhilfe, sicht, datei } = blatt(profil('ZH', { savingsAccount: 100000 }));
    expect(sozialhilfe.vfbUnbestaetigt).toBe(false);
    expect(sicht).not.toContain(VORBEHALT);
    expect(datei.vermoegensfreibetragUnbestaetigt).toBe(false);
  });
  it('Säule 3b allein: das Blatt zeigt die Zahl, aus der der Status folgt', () => {
    const { sozialhilfe, sicht, datei } = blatt(profil('ZH', { pension3bBalance: 50000 }));
    expect(sozialhilfe.vermoegenUeberFreibetrag).toBeGreaterThan(0);
    expect(sicht).toContain('Erfasstes Vermögen, gesamt');
    expect(sicht).toMatch(/50.000/);
    expect(sicht).toContain('Vermögensfreibetrag');
    expect(datei.vermoegen).toBe(50000);
    expect(datei.vermoegensfreibetrag).toBe(sozialhilfe.vermoegensfreibetrag);
  });
  it('unter dem Freibetrag bleibt die Summe vom Blatt fern', () => {
    const { sozialhilfe, sicht, datei } = blatt(profil('ZH', { pension3bBalance: 500 }));
    expect(sozialhilfe.vermoegenUeberFreibetrag).toBe(0);
    expect(sicht).not.toContain('Erfasstes Vermögen, gesamt');
    expect(datei.vermoegen).toBeUndefined();
  });
});

describe('Hinweis auf der Seite: kein absoluter Satz', () => {
  it.each([['de', de], ['fr', fr], ['it', itTranslations], ['en', en]])('%s nennt den Weg über den Sozialdienst und verlangt nicht das Aufbrauchen', (_, sprache) => {
    const satz = sprache.sozialhilfe.assetLimitNote;
    expect(satz).not.toMatch(/aufgebraucht|suppose que|presuppone|requires assets/);
    expect(satz).toMatch(/Sozialdienst|service social|servizio sociale|social services/);
    for (const platz of ['{basis}', '{freibetrag}', '{ueberschuss}']) expect(satz).toContain(platz);
  });
});
