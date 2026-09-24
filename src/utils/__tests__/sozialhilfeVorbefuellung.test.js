import { describe, it, expect } from 'vitest';
import { sozialhilfeVorbefuellung as vb } from '../sozialhilfeVorbefuellung.js';

// Zusage: was im Profil steht, muss im Sozialhilfe-Rechner nicht nochmals eingetippt werden —
// aber nur, was auf derselben Basis steht (monatlich, netto) und nach denselben Regeln zählt.
describe('sozialhilfeVorbefuellung', () => {
  it('leeres Profil: nichts vorbefüllt, eine erwachsene Person', () => {
    expect(vb({})).toEqual({ adults: 1, andereEinkuenfte: '', vermoegen: '', erwerbstaetig: false, nebenerwerbBrutto: false });
    expect(vb(undefined).andereEinkuenfte).toBe('');
  });

  it('Vermögen = Sparkonto + Wertschriften + übriges, Säule 3a nicht', () => {
    const r = vb({ finanzen: { savingsAccount: 4000, securitiesValue: '2500', otherAssets: 500, pension3aBalance: 30000 } });
    expect(r.vermoegen).toBe('7000');
  });

  it('eine eingetragene 0 ist ein Eintrag und wird als 0 übernommen', () => {
    expect(vb({ finanzen: { savingsAccount: 0 } }).vermoegen).toBe('0');
  });

  it('andere Einkünfte = Zulagen + Alimente + Nebenerwerb netto', () => {
    const r = vb({ finanzen: { familienzulagen: 215, alimenteReceived: '600', sideIncome: 400, sideIncomeType: 'netto' } });
    expect(r.andereEinkuenfte).toBe('1215');
    expect(r.nebenerwerbBrutto).toBe(false);
  });

  it('Nebenerwerb brutto bleibt draussen und wird gemeldet', () => {
    const r = vb({ finanzen: { familienzulagen: 215, sideIncome: 400, sideIncomeType: 'brutto' } });
    expect(r.andereEinkuenfte).toBe('215');
    expect(r.nebenerwerbBrutto).toBe(true);
  });

  it('Partnereinkommen zählt nur, wenn das Feld sichtbar wäre', () => {
    const zwei = { basis: { household: { adultsList: [{}], partnerIncome: '3000' } } };
    expect(vb(zwei).andereEinkuenfte).toBe('3000');
    expect(vb(zwei).adults).toBe(2);
    // Zweite Person gelöscht, Zivilstand ledig: der gespeicherte Wert bleibt, zählt aber nicht.
    const geloescht = { basis: { maritalStatus: 'single', household: { adultsList: [], partnerIncome: '3000' } } };
    expect(vb(geloescht).andereEinkuenfte).toBe('');
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
