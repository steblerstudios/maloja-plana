import { describe, it, expect } from 'vitest';
import { calculateSozialhilfe, checkELEligibility } from '../config/cantonalData.js';
import { vermoegensFelder } from '../utils/unterstuetzungseinheit.js';
import { sozialhilfeVorbefuellung } from '../utils/sozialhilfeVorbefuellung.js';
import { getBehoerdenDossierPreview } from '../dossierGenerator.js';
import { getChapters } from '../config/constants.js';

// F8-G6: SKOS D.3.3 Abs. 3 (Version 1.1.2021), BVV 3 Art. 3 Abs. 2 Bst. a, ELG Art. 4 Abs. 1 Bst. c.
const jung = { canton: 'ZH', dateOfBirth: '1986-03-01', household: { adults: 1, children: [] } };
const profil = (finanzen) => ({ basis: jung, finanzen: { monthlyIncome: 800, savingsAccount: 1000, pension3aBalance: 20000, ...finanzen }, wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 300 } });

describe('ivBezug und Säule 3a', () => {
  it('ganze Rente: 3a zählt, Teilrente und keine: nicht', () => {
    expect(vermoegensFelder({ pension3aBalance: 5, ivBezug: 'ganz' }, jung)).toMatchObject({ mit3a: true, durchIv: true });
    expect(vermoegensFelder({ pension3aBalance: 5, ivBezug: 'teil' }, jung).mit3a).toBe(false);
    expect(vermoegensFelder({ pension3aBalance: 5, ivBezug: 'keine' }, jung).mit3a).toBe(false);
    expect(vermoegensFelder({ pension3aBalance: 5 }, jung).mit3a).toBe(false);
  });
  it('ganze Rente: Rechnung und Hinweis', () => {
    const s = calculateSozialhilfe(profil({ ivBezug: 'ganz' }));
    expect(s.vermoegen).toBe(21000);
    expect(s.hinweise).toContain('sh.ivGanz3a');
    expect(calculateSozialhilfe(profil({ ivBezug: 'teil' })).hinweise).not.toContain('sh.ivGanz3a');
  });
  it('Rechner und Karte zählen gleich', () => {
    const d = profil({ ivBezug: 'ganz' });
    expect(Number(sozialhilfeVorbefuellung(d).vermoegen)).toBe(calculateSozialhilfe(d).vermoegen);
  });
  it('EL: Rente ohne Betrag heisst prüfen, nicht «nur bei AHV oder IV»', () => {
    const el = checkELEligibility(profil({ ivBezug: 'teil' }));
    expect(el).toMatchObject({ elPruefen: true, isAHVIV: true });
    expect(checkELEligibility(profil({ ivBezug: 'keine' })).elPruefen).toBe(false);
  });
  it('unklare Rente: Satz nur auf der Seite, nie im Dossier', () => {
    const d = profil({ ivRente: 500 });
    const s = calculateSozialhilfe(d);
    expect(s.ivUnklar3a).toBe(true);
    const t = (k) => k;
    const text = JSON.stringify(getBehoerdenDossierPreview(d, getChapters(t), t, { sozialhilfe: s }));
    expect(text).not.toContain('ivUnklar3a');
  });
  it('kein Rentenhinweis: kein Satz', () => {
    expect(calculateSozialhilfe(profil({})).ivUnklar3a).toBe(false);
  });
});

describe('Predeploy 03.11.: Rente ohne Betrag', () => {
  const rentner = { basis: { canton: 'ZH', dateOfBirth: '1950-05-01', household: { adults: 1, children: [] } }, finanzen: { employmentType: 'retired', monthlyIncome: 0 }, wohnen: { rentAmount: 1200 }, versicherungen: { kkPremium: 300 } };
  it('IV-Bezug oder Ruhestand: kein Betrag in Karte und Dossier', () => {
    for (const d of [profil({ ivBezug: 'ganz', monthlyIncome: 0, pension3aBalance: 0 }), profil({ ivBezug: 'teil' }), rentner]) {
      const s = calculateSozialhilfe(d);
      expect(s.einkommenFehlt).toBe(true);
      expect(s.renteFehlt).toBe(true);
    }
  });
  it('Rentner im AHV-Alter: EL prüfen lassen, nie «nur bei AHV oder IV»', () => {
    expect(checkELEligibility(rentner)).toMatchObject({ elPruefen: true, isAHVIV: true });
    const jung = { ...rentner, basis: { ...rentner.basis, dateOfBirth: '1980-05-01' } };
    expect(checkELEligibility(jung).elPruefen).toBe(false);
  });
});
