import { describe, it, expect } from 'vitest';
import { calculateSozialhilfe } from '../config/cantonalData.js';
import { getBehoerdenDossierPreview, generateBehoerdenJSON } from '../dossierGenerator.js';
import { VFB_KANTON_GELESEN } from '../data/vermoegensfreibetragKanton.js';
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
  // Rechtsprüfung f0ce1d03 (Muss): kein «Stand 2026», das eine Geltung behauptet. Belegt sind Fassung und Lesedatum.
  it('der Freibetrag nennt seine Basis, auf dem Blatt und in der Datei gleich', () => {
    const { sicht, datei } = blatt(profil({}, { savingsAccount: 100000 }));
    expect(sicht).toContain('(Kanton Zürich, Quelle gelesen am ' + VFB_KANTON_GELESEN + ')');
    expect(datei.vermoegensfreibetragBasis).toBe('Kanton Zürich, Quelle gelesen am ' + VFB_KANTON_GELESEN);
    const ohneKanton = blatt(profil({ canton: '' }, { savingsAccount: 100000 }));
    expect(ohneKanton.sicht).toContain('(SKOS-RL D.3.1, Version vom 1.1.2026)');
    expect(sicht).not.toMatch(/Stand 20\d\d/);
  });

  it('kein Platzhalter bleibt stehen, in keiner Sprache', () => {
    for (const l of [de, fr, itTranslations, en, rm]) {
      const tl = createT({ de, en, fr, it: itTranslations, rm }, l === de ? 'de' : l === fr ? 'fr' : l === itTranslations ? 'it' : l === en ? 'en' : 'rm');
      expect(tl('sozialhilfe.assetLimitBasisSkos')).toContain('D.3.1');
      expect(tl('sozialhilfe.assetLimitBasisCanton', { name: 'X', datum: VFB_KANTON_GELESEN })).toContain(VFB_KANTON_GELESEN);
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

  // Fachprüfung f0ce1d03: auch wenn der Freibetrag entscheidet oder der Status offen ist; Blatt und Datei gleich.
  it('3a ohne Geburtsdatum bei offenem Status und ohne Einkommen: Blatt und Datei gleich', () => {
    const offen = blatt(profil({ dateOfBirth: '' }, { pension3aBalance: 50000, monthlyIncome: 2700 }));
    expect(offen.sozialhilfe.eligible || offen.sozialhilfe.efbEntscheidet || offen.sozialhilfe.anspruchOffen).toBe(true);
    expect(offen.sozialhilfe.eligible).toBe(false);
    expect(offen.sicht).toContain(OHNE_GEBURTSDATUM);
    expect(offen.datei.saeule3aOhneGeburtsdatum).toBe(true);
    const ohneEinkommen = blatt(profil({ dateOfBirth: '' }, { pension3aBalance: 50000, monthlyIncome: '' }));
    expect(ohneEinkommen.sicht.includes(OHNE_GEBURTSDATUM)).toBe(ohneEinkommen.datei.saeule3aOhneGeburtsdatum);
    expect(de.sozialhilfe.saeule3aOhneGeburtsdatum).toContain('ganzen IV-Rente');
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
    // Auch der Entscheid über die Grenze rechnet mit dieser Summe.
    const grenze = calculateSozialhilfe(profil({}, { savingsAccount: 3000.3, securitiesValue: 3000.3 }));
    expect(grenze.vermoegen).toBe(6000);
    expect(grenze.vermoegenUeberFreibetrag).toBe(0);
  });
});
