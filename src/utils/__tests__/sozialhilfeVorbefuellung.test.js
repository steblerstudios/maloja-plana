import { describe, it, expect } from 'vitest';
import { sozialhilfeVorbefuellung as vb, saeule3aBeziehbar } from '../sozialhilfeVorbefuellung.js';

// Zusage: was im Profil steht, muss im Sozialhilfe-Rechner nicht nochmals eingetippt werden —
// aber nur, was auf derselben Basis steht (monatlich, netto) und nach denselben Regeln zählt.
describe('sozialhilfeVorbefuellung', () => {
  it('leeres Profil: nichts vorbefüllt, eine erwachsene Person', () => {
    expect(vb({})).toEqual({ adults: 1, kinder: 0, weiterePersonen: 0, miete: '', wohnform: 'allein', einkommen: '', einkommenMitNebenerwerb: false, hauptBrutto: false, andereEinkuenfte: '', vermoegen: '', vermoegenMit3a: false, jungErwachsen: false, erwerbstaetig: false, nebenerwerbBrutto: false, partnerKonkubinat: false });
    expect(vb(undefined).andereEinkuenfte).toBe('');
  });

  it('Vermögen = Sparkonto + Wertschriften + übriges + 3b, Säule 3a nicht (ohne Geburtsdatum)', () => {
    const r = vb({ finanzen: { savingsAccount: 4000, securitiesValue: '2500', otherAssets: 500, pension3bBalance: 1000, pension3aBalance: 30000 } });
    expect(r.vermoegen).toBe('8000');
    expect(r.vermoegenMit3a).toBe(false);
  });

  describe('Säule 3a zählt ab fünf Jahren vor dem Referenzalter (BVV 3 Art. 3 Abs. 1)', () => {
    const heute = new Date('2026-09-24');
    const f = { savingsAccount: 1000, pension3aBalance: 30000 };
    it('Mann, Jg. 1966: 60 Jahre am 24.09.2026 → beziehbar, zählt', () => {
      const r = vb({ basis: { dateOfBirth: '1966-09-24', gender: 'male' }, finanzen: f }, heute);
      expect(r.vermoegen).toBe('31000');
      expect(r.vermoegenMit3a).toBe(true);
    });
    it('Mann, einen Tag vor dem 60. Geburtstag → noch nicht', () => {
      expect(saeule3aBeziehbar({ dateOfBirth: '1966-09-25', gender: 'male' }, heute)).toBe(false);
      expect(vb({ basis: { dateOfBirth: '1966-09-25', gender: 'male' }, finanzen: f }, heute).vermoegen).toBe('1000');
    });
    it('Frau: Grenze nach ihrem Referenzalter (ab Jg. 1964 wie Männer 65 → ab 60)', () => {
      expect(saeule3aBeziehbar({ dateOfBirth: '1966-09-25', gender: 'female' }, heute)).toBe(false);
      expect(saeule3aBeziehbar({ dateOfBirth: '1966-09-24', gender: 'female' }, heute)).toBe(true);
      // Übergangsjahrgang 1962 (Referenzalter 64 J. 6 M.): Grenze 59 J. 6 M. — am Stichtag 1. 3. 2022
      expect(saeule3aBeziehbar({ dateOfBirth: '1962-09-01', gender: 'female' }, new Date('2022-03-01'))).toBe(true);
      expect(saeule3aBeziehbar({ dateOfBirth: '1962-09-01', gender: 'female' }, new Date('2022-02-28'))).toBe(false);
    });
    it('ohne oder mit unsinnigem Geburtsdatum: nicht beziehbar', () => {
      expect(saeule3aBeziehbar({}, heute)).toBe(false);
      expect(saeule3aBeziehbar({ dateOfBirth: 'abc' }, heute)).toBe(false);
    });
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

  describe('Haushalt: Unterstützungseinheit und weitere Personen (SKOS C.3.1/C.3.2)', () => {
    it('verheiratet, 2 Erwachsene → Einheit 2, keine weiteren', () => {
      const r = vb({ basis: { maritalStatus: 'married', household: { adultsList: [{}] } } });
      expect([r.adults, r.weiterePersonen, r.wohnform]).toEqual([2, 0, 'allein']);
    });
    it('Konkubinat, 2 Erwachsene → Einheit 1 + 1 weitere, startet familienähnlich', () => {
      const r = vb({ basis: { maritalStatus: 'cohabiting', household: { adultsList: [{}] } } });
      expect([r.adults, r.weiterePersonen, r.wohnform]).toEqual([1, 1, 'familienaehnlich']);
    });
    it('ledig in WG mit 3 Erwachsenen → Einheit 1 + 2 weitere', () => {
      const r = vb({ basis: { maritalStatus: 'single', household: { adultsList: [{}, {}] } } });
      expect([r.adults, r.weiterePersonen]).toEqual([1, 2]);
    });
    it('verheiratet, aber nur 1 Person erfasst → Einheit 1 (die zweite fehlt, nichts erfinden)', () => {
      const r = vb({ basis: { maritalStatus: 'married', household: { adultsList: [] } } });
      expect([r.adults, r.weiterePersonen]).toEqual([1, 0]);
    });
    it('Kinder ab 18 sind weitere Personen, jüngere und ohne Alter bleiben in der Einheit', () => {
      const heute = new Date('2026-09-24');
      const r = vb({ basis: { household: { adultsList: [], children: [{ age: 20 }, { age: 12 }, {}, { birthDate: '2008-09-24' }, { birthDate: '2008-09-25' }] } } }, heute);
      expect([r.kinder, r.weiterePersonen]).toEqual([3, 2]); // 20 J. und genau 18 → weitere
    });
    it('Miete: allein aus dem Profil, bei weiteren Personen leer (im Profil steht die ganze Miete)', () => {
      expect(vb({ wohnen: { rentAmount: 1400 } }).miete).toBe('1400');
      expect(vb({ wohnen: { rentAmount: 1400 }, basis: { household: { adultsList: [{}] } } }).miete).toBe('');
    });
    it('Konkubinat ohne erfassten Partnerlohn: Konkubinatsbeitrag-Hinweis trotzdem', () => {
      expect(vb({ basis: { maritalStatus: 'cohabiting', household: { adultsList: [{}] } } }).partnerKonkubinat).toBe(true);
      expect(vb({ basis: { maritalStatus: 'single', household: { adultsList: [{}] } } }).partnerKonkubinat).toBe(false);
    });
    it('junge Erwachsene: Hinweis nur bei bekanntem Alter unter 25', () => {
      const heute = new Date('2026-09-24');
      expect(vb({ basis: { dateOfBirth: '2002-09-25' } }, heute).jungErwachsen).toBe(true);
      expect(vb({ basis: { dateOfBirth: '2001-09-24' } }, heute).jungErwachsen).toBe(false);
      expect(vb({}, heute).jungErwachsen).toBe(false);
    });
    it('verheiratet mit erwachsenem Kind → Einheit 2 + 1 weitere', () => {
      const r = vb({ basis: { maritalStatus: 'married', household: { adultsList: [{}, {}] } } });
      expect([r.adults, r.weiterePersonen]).toEqual([2, 1]);
    });
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
