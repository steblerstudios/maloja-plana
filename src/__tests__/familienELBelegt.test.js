import { describe, it, expect } from 'vitest';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import { getFamilienEL, FAMILIEN_EL_GRUNDLAGE, FAMILIEN_EL_KINDER_UNTER, familienELPasstZumKindesalter } from '../data/familienEL.js';

// Familien-EL (04.11.2026): Bis dahin hiess es «Ihr Kanton zahlt erwerbstätigen Familien mit
// kleinen Kindern …». An den amtlichen Texten gelesen gilt keine der drei Annahmen für alle
// vier Kantone: Kinder unter 6 (SO) bis unter 18/25 (GE), Erwerbstätigkeit nur in GE, und
// «zahlt» klang nach Zusage. Der Text nennt deshalb nur, was belegt ist.
const SPRACHEN = { de, fr, it: it_, en, rm };
const UNBELEGT = /kleine[nr]? Kinder|erwerbstätig|zahlt|jeunes enfants|qui travaillent|verse |bambini piccoli|che lavorano|young children|working families|pays /i;

const texte = (d) => ['tiefesEinkommen', 'alleinerziehend'].flatMap((lage) => {
  const v = d.lebenszustaende[lage].berechtigungen.familienEL.text;
  return typeof v === 'string' ? [v] : [v.sie, v.du];
});

describe('Familien-EL sagt nur Belegtes', () => {
  for (const [lang, d] of Object.entries(SPRACHEN)) {
    it(`${lang}: keine Alters-, Erwerbs- oder Zahlungs-Annahme`, () => {
      for (const t of texte(d)) expect(t).not.toMatch(UNBELEGT);
    });
  }

  it('jeder gelistete Kanton hat eine gelesene Rechtsgrundlage', () => {
    for (const kanton of ['TI', 'VD', 'SO', 'GE']) {
      expect(getFamilienEL(kanton).has).toBe(true);
      const g = FAMILIEN_EL_GRUNDLAGE[kanton];
      for (const feld of ['gesetz', 'fassung', 'kinder', 'erwerb', 'gelesen']) expect(g?.[feld]).toBeTruthy();
    }
    expect(getFamilienEL('ZH').has).toBe(false);
  });
});

// Altersfilter (04.11.2026): Die Karte verschwindet nur, wenn JEDES Kind ein bekanntes Alter auf
// oder über der Grenze hat. Stichtag fest, damit die Geburtstags-Grenzfälle nicht wandern.
describe('Familien-EL: Altersfilter', () => {
  const HEUTE = new Date(2026, 10, 4); // 4.11.2026
  const passt = (kanton, kinder) => familienELPasstZumKindesalter(kanton, kinder, HEUTE);

  it('die Zahl stimmt mit der gelesenen Grundlage überein', () => {
    expect(FAMILIEN_EL_KINDER_UNTER).toEqual({ TI: 15, VD: 16, SO: 6, GE: 25 });
    expect(FAMILIEN_EL_GRUNDLAGE.SO.kinder).toMatch(/unter 6/);
    expect(FAMILIEN_EL_GRUNDLAGE.TI.kinder).toMatch(/unter 15/);
    expect(FAMILIEN_EL_GRUNDLAGE.VD.kinder).toMatch(/unter 16/);
    expect(FAMILIEN_EL_GRUNDLAGE.GE.kinder).toMatch(/unter 25/);
  });

  it('SO: Kind mit 10 → keine Karte; mit 5 → Karte', () => {
    expect(passt('SO', [{ age: 10 }])).toBe(false);
    expect(passt('SO', [{ age: 5 }])).toBe(true);
  });

  it('SO: Geburtstag genau an der Grenze', () => {
    expect(passt('SO', [{ birthDate: '2020-11-05' }])).toBe(true);  // morgen 6 → heute noch 5
    expect(passt('SO', [{ birthDate: '2020-11-04' }])).toBe(false); // heute 6 geworden
  });

  it('Geburtsdatum geht vor eingetragener Zahl', () => {
    expect(passt('SO', [{ age: 3, birthDate: '2012-01-01' }])).toBe(false);
  });

  it('ein jüngeres Kind genügt', () => {
    expect(passt('VD', [{ age: 22 }, { age: 9 }])).toBe(true);
    expect(passt('VD', [{ age: 22 }, { age: 16 }])).toBe(false);
  });

  it('unbekanntes Alter hält die Karte sichtbar', () => {
    expect(passt('SO', [{ age: 0, birthDate: '' }])).toBe(true); // Vorgabewert eines neuen Kindes
    expect(passt('SO', [{}])).toBe(true);
    expect(passt('SO', [{ age: 12 }, { age: '' }])).toBe(true);
    expect(passt('SO', undefined)).toBe(true); // Legacy ohne Kinderliste
  });

  it('GE: 20-jähriges Kind bleibt sichtbar (Ausbildung unbekannt), 25 nicht', () => {
    expect(passt('GE', [{ age: 20 }])).toBe(true);
    expect(passt('GE', [{ age: 25 }])).toBe(false);
  });
});
