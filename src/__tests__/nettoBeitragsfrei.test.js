import { describe, it, expect } from 'vitest';
import { alterUndRentenalter, nettoMonatAusProfil } from '../utils/nettoAusProfil.js';
import { bruttoZuNettoRichtwert, nettoZuBruttoRichtwert } from '../data/lohnAbzuege.js';
import { lohnBandState } from '../data/lohnEinordnung.js';
import de from '../i18n/de.js';
import en from '../i18n/en.js';
import fr from '../i18n/fr.js';
import itSprache from '../i18n/it.js'; // nicht «it» — das überschriebe vitests it()
import rm from '../i18n/rm.js';

// Übergabe 26.10.2026, Punkt 6. Fedlex gelesen 26.10.2026:
//   AHVG Art. 3 Abs. 2 lit. a — befreit sind «die erwerbstätigen Kinder bis zum 31. Dezember des Jahres, in welchem sie
//   das 17. Altersjahr zurückgelegt haben»; AVIG Art. 2 Abs. 1 lit. a — ALV nur, wer nach AHVG beitragspflichtig ist;
//   BVG Art. 7 Abs. 1 — Pflicht «ab 1. Januar nach Vollendung des 17. Altersjahres» (Tod/Invalidität), ab dem 24. fürs Alter.
const heute = new Date(2026, 9, 22);

describe('beitragsfrei nach Jahrgang', () => {
  it('wer im Kalenderjahr höchstens 17 wird, ist beitragsfrei; ab 18 nicht', () => {
    // Geburt am 1.1. bewusst nicht als belegter Fall: ob das Altersjahr dann am Vortag vollendet ist, ist offen.
    expect(alterUndRentenalter({ dateOfBirth: '2009-01-02' }, heute).beitragsfrei).toBe(true);  // wird 2026 17
    expect(alterUndRentenalter({ dateOfBirth: '2010-06-15' }, heute).beitragsfrei).toBe(true);  // 16
    expect(alterUndRentenalter({ dateOfBirth: '2008-12-31' }, heute).beitragsfrei).toBe(false); // wird 2026 18, heute noch 17
    expect(alterUndRentenalter({ dateOfBirth: '1990-03-03' }, heute).beitragsfrei).toBe(false);
  });

  it('ohne Geburtsdatum: nicht beitragsfrei (wie bisher abziehen)', () => {
    expect(alterUndRentenalter({}, heute).beitragsfrei).toBe(false);
  });
});

describe('Netto-Richtwert vor der Beitragspflicht', () => {
  it('kein Abzug: Netto = Brutto, in beide Richtungen', () => {
    expect(bruttoZuNettoRichtwert(1200, 16, false, undefined, true)).toBe(1200);
    expect(nettoZuBruttoRichtwert(1200, 16, false, undefined, true)).toBe(1200);
    expect(bruttoZuNettoRichtwert(1200, 16, false)).toBeLessThan(1200); // ohne Flag wie bisher
  });

  it('aus dem Profil: Lernende mit 16, Brutto 950 → Netto 950', () => {
    expect(nettoMonatAusProfil(950, 'brutto', { dateOfBirth: '2010-02-01' }, heute)).toEqual({ netto: 950, geschaetzt: true, offen: false });
    expect(nettoMonatAusProfil(950, 'brutto', { dateOfBirth: '2008-02-01' }, heute).netto).toBeLessThan(950);
  });

  it('Lohn-Einordnung schätzt aus Netto kein höheres Brutto', () => {
    const st = lohnBandState({ income: 1000, canton: 'ZH', incomeType: 'netto', alter: 16, beitragsfrei: true });
    expect(st.income).toBe(1000);
  });
});

describe('neuerJob.step2Text nennt das BVG-Mindestalter', () => {
  it('in allen fünf Sprachen, Sie und Du', () => {
    const fassungen = [de, en, fr, itSprache, rm].flatMap((s) => {
      const v = s.neuerJob.step2Text;
      return typeof v === 'string' ? [v] : [v.sie, v.du];
    });
    for (const f of fassungen) {
      expect(f).toMatch(/17/);
      expect(f).toMatch(/24/);
      expect(f).toContain('{schwelle}');
    }
  });
});
