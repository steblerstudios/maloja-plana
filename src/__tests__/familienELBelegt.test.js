import { describe, it, expect } from 'vitest';
import de from '../i18n/de.js';
import fr from '../i18n/fr.js';
import it_ from '../i18n/it.js';
import en from '../i18n/en.js';
import rm from '../i18n/rm.js';
import { getFamilienEL, FAMILIEN_EL_GRUNDLAGE } from '../data/familienEL.js';

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
