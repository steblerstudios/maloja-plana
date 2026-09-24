import { describe, it, expect } from 'vitest';
import { sozialhilfeVorbefuellung as vb } from '../sozialhilfeVorbefuellung.js';

// Zusage: was im Profil steht, muss im Sozialhilfe-Rechner nicht nochmals eingetippt werden —
// aber nur, was auf derselben Basis steht (monatlich, netto) und nach denselben Regeln zählt.
describe('sozialhilfeVorbefuellung', () => {
  it('leeres Profil: nichts vorbefüllt, eine erwachsene Person', () => {
    expect(vb({})).toEqual({ adults: 1, einkommen: '', einkommenMitNebenerwerb: false, hauptBrutto: false, andereEinkuenfte: '', vermoegen: '', erwerbstaetig: false, nebenerwerbBrutto: false, partnerKonkubinat: false });
    expect(vb(undefined).andereEinkuenfte).toBe('');
  });

  it('Vermögen = Sparkonto + Wertschriften + übriges, Säule 3a nicht', () => {
    const r = vb({ finanzen: { savingsAccount: 4000, securitiesValue: '2500', otherAssets: 500, pension3aBalance: 30000 } });
    expect(r.vermoegen).toBe('7000');
  });

  it('eine eingetragene 0 ist ein Eintrag und wird als 0 übernommen', () => {
    expect(vb({ finanzen: { savingsAccount: 0 } }).vermoegen).toBe('0');
  });

  it('Erwerbseinkommen = Monatslohn + Nebenerwerb (beide netto) — der Nebenerwerb bekommt so den Freibetrag', () => {
    const r = vb({ finanzen: { monthlyIncome: 3000, incomeType: 'netto', sideIncome: 400, sideIncomeType: 'netto', familienzulagen: 215 } });
    expect(r.einkommen).toBe('3400');
    expect(r.einkommenMitNebenerwerb).toBe(true);
    expect(r.andereEinkuenfte).toBe('215');
  });

  it('Nebenerwerb brutto bleibt draussen und wird gemeldet', () => {
    const r = vb({ finanzen: { monthlyIncome: 3000, sideIncome: 400, sideIncomeType: 'brutto' } });
    expect(r.einkommen).toBe('3000');
    expect(r.nebenerwerbBrutto).toBe(true);
    expect(r.einkommenMitNebenerwerb).toBe(false);
  });

  it('Hauptlohn brutto: Erwerbseinkommen leer — auch mit Nebenerwerb (sonst sähe es vollständig aus)', () => {
    const r = vb({ finanzen: { monthlyIncome: 6000, incomeType: 'brutto', sideIncome: 400 } });
    expect(r.einkommen).toBe('');
    expect(r.hauptBrutto).toBe(true);
  });

  it('andere Einkünfte = Zulagen + Alimente', () => {
    expect(vb({ finanzen: { familienzulagen: 215, alimenteReceived: '600' } }).andereEinkuenfte).toBe('815');
  });

  it('Partnerlohn zählt bei Ehe/eingetragener Partnerschaft, sofern das Feld sichtbar wäre', () => {
    const ehe = { basis: { maritalStatus: 'married', household: { adultsList: [{}], partnerIncome: '3000' } } };
    expect(vb(ehe).andereEinkuenfte).toBe('3000');
    expect(vb(ehe).adults).toBe(2);
    expect(vb(ehe).partnerKonkubinat).toBe(false);
    const ep = { basis: { maritalStatus: 'registeredPartnership', household: { adultsList: [{}], partnerIncome: '3000' } } };
    expect(vb(ep).andereEinkuenfte).toBe('3000');
  });

  it('Konkubinat: Partnerlohn nicht vorbefüllt, Hinweis statt Wert', () => {
    const r = vb({ basis: { maritalStatus: 'cohabiting', household: { adultsList: [{}], partnerIncome: '3000' } } });
    expect(r.andereEinkuenfte).toBe('');
    expect(r.partnerKonkubinat).toBe(true);
  });

  it('zweite Person gelöscht, ledig: der gespeicherte Partnerlohn zählt nicht und löst keinen Hinweis aus', () => {
    const r = vb({ basis: { maritalStatus: 'single', household: { adultsList: [], partnerIncome: '3000' } } });
    expect(r.andereEinkuenfte).toBe('');
    expect(r.partnerKonkubinat).toBe(false);
  });

  it('Unsinn und negative Werte zählen nicht', () => {
    expect(vb({ finanzen: { savingsAccount: 'abc', securitiesValue: -100 } }).vermoegen).toBe('');
  });

  describe('erwerbstätig', () => {
    it.each([
      [{ employmentType: 'employed' }, true],
      [{ employmentType: 'selfEmployed' }, true],
      [{ employmentType: 'freelance' }, true],
      [{ employer: 'Bäckerei Muster' }, true],
      [{ employer: '   ' }, false],
      [{}, false],
    ])('%j → %s', (finanzen, erwartet) => {
      expect(vb({ finanzen }).erwerbstaetig).toBe(erwartet);
    });

    it('Widerspruch: «Rentner» geht vor einem liegen gebliebenen Arbeitgeber', () => {
      expect(vb({ finanzen: { employmentType: 'retired', employer: 'Alte Firma AG' } }).erwerbstaetig).toBe(false);
    });
  });
});
