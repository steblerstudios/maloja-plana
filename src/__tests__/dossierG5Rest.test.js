import { describe, it, expect } from 'vitest';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { getBehoerdenDossierPreview, generateBehoerdenJSON } from '../dossierGenerator.js';
import { VFB_STAND_JAHR } from '../data/vermoegensfreibetragKanton.js';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itTranslations from '../i18n/it.js';
import rm from '../i18n/rm.js';

// F8-G5-Rest (Prüfer Fassung 8, 03.11.2026): Freibetrag mit Basis und Stand-Jahr, 3a ohne Geburtsdatum nicht still weg,
// Vermögen in Blatt und Datei aus denselben gerundeten Zeilen.
const t = createT({ de, en, fr, it: itTranslations, rm }, 'de');
const profil = (basis, finanzen) => ({
  basis: { canton: 'ZH', dateOfBirth: '1986-03-01', household: { adults: 1, children: [] }, ...basis },
  finanzen: { employmentType: 'employed', monthlyIncome: 800, incomeType: 'netto', ...finanzen },
  wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 300 },
});
const blatt = (p) => {
  const sozialhilfe = calculateSozialhilfe(p);
  const vorschau = getBehoerdenDossierPreview(p, [], t, { sozialhilfe });
  return { sozialhilfe, sicht: JSON.stringify(vorschau), datei: generateBehoerdenJSON(p, { sozialhilfe }, t).calculations.sozialhilfe };
};
const OHNE_GEBURTSDATUM = de.sozialhilfe.saeule3aOhneGeburtsdatum;

describe('F8-G5-Rest: Dossier', () => {
  it('der Freibetrag nennt Basis und Stand-Jahr, auf dem Blatt und in der Datei', () => {
    const { sicht, datei } = blatt(profil({}, { savingsAccount: 100000 }));
    expect(sicht).toContain('(Kanton Zürich, Stand ' + VFB_STAND_JAHR + ')');
    expect(datei.vermoegensfreibetragStand).toBe(VFB_STAND_JAHR);
    const ohneKanton = blatt(profil({ canton: '' }, { savingsAccount: 100000 }));
    expect(ohneKanton.sicht).toContain('(SKOS-Empfehlung, Stand ' + VFB_STAND_JAHR + ')');
  });

  it('kein Platzhalter bleibt stehen, in keiner Sprache', () => {
    for (const l of [de, fr, itTranslations, en, rm]) {
      const tl = createT({ de, en, fr, it: itTranslations, rm }, l === de ? 'de' : l === fr ? 'fr' : l === itTranslations ? 'it' : l === en ? 'en' : 'rm');
      expect(tl('sozialhilfe.assetLimitBasisSkos', { jahr: 2026 })).toContain('2026');
      expect(tl('sozialhilfe.assetLimitBasisCanton', { name: 'X', jahr: 2026 })).not.toMatch(/\{/);
    }
  });

  it('3a ohne Geburtsdatum: nicht gezählt, aber das Blatt sagt es (mit Betrag und mit Vermögensgrund)', () => {
    const mitBetrag = blatt(profil({ dateOfBirth: '' }, { pension3aBalance: 50000 }));
    expect(mitBetrag.sozialhilfe.eligible).toBe(true);
    expect(mitBetrag.sicht).toContain(OHNE_GEBURTSDATUM);
    expect(mitBetrag.datei.saeule3aOhneGeburtsdatum).toBe(true);
    const mitGrund = blatt(profil({ dateOfBirth: '' }, { pension3aBalance: 50000, savingsAccount: 100000 }));
    expect(mitGrund.sicht).toContain(OHNE_GEBURTSDATUM);
    expect(mitGrund.sicht).not.toContain(de.sozialhilfe.saeule3aNichtGezaehlt);
  });

  it('mit Geburtsdatum oder ohne 3a: kein solcher Satz', () => {
    expect(blatt(profil({}, { pension3aBalance: 50000 })).sicht).not.toContain(OHNE_GEBURTSDATUM);
    const ohne3a = blatt(profil({ dateOfBirth: '' }, {}));
    expect(ohne3a.sicht).not.toContain(OHNE_GEBURTSDATUM);
    expect(ohne3a.datei.saeule3aOhneGeburtsdatum).toBe(false);
  });

  it('Rappen: Datei und Blatt nennen dieselbe Summe wie die gerundeten Zeilen', () => {
    // 0.5 + 0.5 + 0.5: jede Zeile rundet auf 1, die Rohsumme 1.5 auf 2.
    const { sicht, datei } = blatt(profil({}, { savingsAccount: 100000.5, securitiesValue: 0.5, otherAssets: 0.5 }));
    expect(datei.vermoegen).toBe(100003);
    expect(sicht).toContain('CHF 100’003');
  });
});
