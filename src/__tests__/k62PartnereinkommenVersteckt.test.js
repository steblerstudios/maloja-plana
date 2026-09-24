import { describe, it, expect } from 'vitest';
import { getHouseholdInfo, calculateIPV, calculateSozialhilfe } from '../config/cantonalData.js';
import { steuerEingabenAusDaten, steuernFuerProfil, partnerEinkommenAngegeben } from '../data/kantonaleSteuerdaten.js';
import { pegelState } from '../data/pegel.js';
import { zeigtPartnereinkommen, partnerEinkommenZaehlt, erwachseneImHaushalt, zweitePersonFehlt } from '../utils/partnereinkommen.js';
import { zeigtPartnereinkommen as ausChapterView } from '../ChapterView.jsx';

// K62-Nachlauf A (Befund aus #284): Wurde die zweite erwachsene Person gelöscht, blieb
// household.partnerIncome gespeichert und floss weiter in Steuer, IPV, Sozialhilfe — obwohl das
// Feld «Nettolohn Partner/in» nicht mehr sichtbar war. Regel: das Partnereinkommen zählt nur, wenn
// das Feld nach derselben Regel sichtbar wäre (src/utils/partnereinkommen.js). Der gespeicherte
// Wert bleibt (die Person kann wieder hinzukommen).

// Ledig, 1 Kind, ZH, Nettolohn 6 000/Mt., die zweite Person (Nettolohn 4 000) wurde wieder gelöscht.
const geloescht = () => ({
  basis: {
    canton: 'ZH', maritalStatus: 'single',
    household: { adults: 1, adultsList: [], children: [{ age: 8 }], partnerIncome: '4000' },
  },
  finanzen: { monthlyIncome: 6000, incomeType: 'netto', employmentType: 'employed', dreizehnter: 'no' },
});
// Dieselbe Person, die zweite Person noch erfasst.
const erfasst = () => {
  const d = geloescht();
  d.basis.household = { ...d.basis.household, adults: 2, adultsList: [{ name: '', relationship: 'partner' }] };
  return d;
};

describe('K62-Nachlauf A · verstecktes Partnereinkommen zählt nicht', () => {
  it('Person gelöscht (ledig): kein Partnereinkommen in Haushalt, Steuer, IPV, Sozialhilfe, Pegel', () => {
    const d = geloescht();
    expect(getHouseholdInfo(d).partnerIncome).toBe(0);
    const e = steuerEingabenAusDaten(d);
    expect(e.partnerEinkommen).toBe(0);
    expect(e.partnerAngegeben).toBe(false);
    expect(partnerEinkommenAngegeben(d)).toBe(false);
    // Vorher: grund 'partner' (Partnereinkommen mit Kindern) → keine Zahl. Jetzt: die Zahl für die Person allein.
    const s = steuernFuerProfil(e);
    expect(s.grund).toBe(null);
    expect(s.steuerbar).toBeGreaterThan(0);
    // IPV/Sozialhilfe: nur der eigene Lohn.
    const ohnePartner = { ...d, basis: { ...d.basis, household: { ...d.basis.household, partnerIncome: undefined } } };
    expect(calculateIPV(d)).toEqual(calculateIPV(ohnePartner));
    expect(calculateSozialhilfe(d)).toEqual(calculateSozialhilfe(ohnePartner));
    expect(pegelState(d)).toEqual(pegelState(ohnePartner));
  });

  it('der gespeicherte Wert bleibt: Person wieder erfasst → das Partnereinkommen zählt wieder', () => {
    const d = erfasst();
    expect(d.basis.household.partnerIncome).toBe('4000');
    expect(getHouseholdInfo(d).partnerIncome).toBe(4000);
    expect(steuerEingabenAusDaten(d).partnerEinkommen).toBe(4000);
    expect(steuernFuerProfil(steuerEingabenAusDaten(d)).grund).toBe('partner');
  });

  it('verheiratet oder Konkubinat mit einer erfassten Person: das Feld ist sichtbar, der Wert zählt', () => {
    for (const ms of ['married', 'registeredPartnership', 'cohabiting']) {
      const d = geloescht();
      d.basis.maritalStatus = ms;
      expect(getHouseholdInfo(d).partnerIncome, ms).toBe(4000);
      expect(partnerEinkommenAngegeben(d), ms).toBe(true);
    }
  });

  it('ältere Profile ohne adultsList: die Zahl `adults` entscheidet', () => {
    expect(erwachseneImHaushalt({ adults: 2 })).toBe(2);
    expect(erwachseneImHaushalt({ adults: 0 })).toBe(1);
    expect(erwachseneImHaushalt(undefined)).toBe(1);
    expect(partnerEinkommenZaehlt({ maritalStatus: 'single', household: { adults: 2, partnerIncome: '1' } })).toBe(true);
    expect(partnerEinkommenZaehlt({ maritalStatus: 'single', household: { adults: 1, partnerIncome: '1' } })).toBe(false);
  });

  it('eine Regel: ChapterView zeigt das Feld nach derselben Funktion', () => {
    expect(ausChapterView).toBe(zeigtPartnereinkommen);
  });

  it('zweitePersonFehlt: nur bei erwartetem Partner und einer erfassten Person', () => {
    expect(zweitePersonFehlt(1, 'married')).toBe(true);
    expect(zweitePersonFehlt(1, 'registeredPartnership')).toBe(true);
    expect(zweitePersonFehlt(1, 'cohabiting')).toBe(true);
    expect(zweitePersonFehlt(2, 'married')).toBe(false);
    expect(zweitePersonFehlt(1, 'single')).toBe(false);
    expect(zweitePersonFehlt(1, 'dissolvedPartnership')).toBe(false);
  });
});
