import { describe, it, expect } from 'vitest';
import { vergleichsStichtag, istWechselzeit, detailJahr, DETAIL_VEROEFFENTLICHT } from '../praemienDetail.js';
import { ladeFranchiseOpt } from '../franchiseLaden.js';
import { ageClassFromBirth, kvgFristVorbei, franchiseVorschlag } from '../franchiseTacho.js';
import de from '../../i18n/de.js';
import en from '../../i18n/en.js';
import fr from '../../i18n/fr.js';
import itSprache from '../../i18n/it.js'; // nicht «it» — das überschriebe vitests it()
import rm from '../../i18n/rm.js';

// Wechselzeit: ab der BAG-Publikation (2027: 29.09.2026) bis 31.12. vergleichen Kassenvergleich und Franchise-Vorschlag
// mit den Prämien des Folgejahres — Kündigung bis 30.11. (KVG Art. 7 Abs. 2), Franchise ab 1.1. (KVV Art. 94).
describe('vergleichsStichtag', () => {
  it('vor der Publikation: der Tag selbst, Kalenderjahr', () => {
    const tag = new Date(2026, 8, 28);
    expect(vergleichsStichtag(tag)).toBe(tag);
    expect(istWechselzeit(tag)).toBe(false);
  });

  it('ab dem Publikationstag bis Silvester: 1. Januar des Folgejahres', () => {
    expect(DETAIL_VEROEFFENTLICHT[2027]).toBe('2026-09-29');
    for (const tag of [new Date(2026, 8, 29), new Date(2026, 10, 30, 23, 59), new Date(2026, 11, 31, 23, 59)]) {
      expect(vergleichsStichtag(tag)).toEqual(new Date(2027, 0, 1));
      expect(detailJahr(vergleichsStichtag(tag))).toBe(2027);
      expect(istWechselzeit(tag)).toBe(true);
    }
  });

  it('ab 1. Januar: wieder der Tag selbst (Kalenderjahr = neue Prämien)', () => {
    const tag = new Date(2027, 0, 1);
    expect(vergleichsStichtag(tag)).toBe(tag);
    expect(istWechselzeit(tag)).toBe(false);
  });

  it('ohne Daten oder Datum fürs Folgejahr: keine Wechselzeit (Herbst 2027 bis zum nächsten Import)', () => {
    const tag = new Date(2027, 9, 15);
    expect(vergleichsStichtag(tag)).toBe(tag);
    expect(detailJahr(vergleichsStichtag(tag))).toBe(2027);
  });

  it('Standard ist heute — feste Test-Uhr 22.10.2026 liegt in der Wechselzeit', () => {
    expect(istWechselzeit()).toBe(true);
    expect(detailJahr(vergleichsStichtag())).toBe(2027);
  });
});

describe('Franchise-Vorschlag im Dashboard', () => {
  it('rechnet in der Wechselzeit mit den Prämien des Folgejahres und nennt das Jahr', async () => {
    const opt = await ladeFranchiseOpt({
      wohnen: { postalCode: '9050' }, // Appenzell AI, eine Region
      versicherungen: { kkInsurer: 'Helsana' },
      basis: { dateOfBirth: '1980-05-05' },
    });
    expect(opt).not.toBeNull();
    expect(opt.praemienJahr).toBe('2027');
  });
});

describe('Altersklasse nach Jahrgang (BAG-Gesamtbericht 2027 S. 24)', () => {
  it('Kind bis Ende des Jahres, in dem 18 vollendet; jung bis Ende des Jahres, in dem 25 vollendet', () => {
    const im2026 = new Date(2026, 9, 26);
    expect(ageClassFromBirth('2008-12-31', im2026)).toBe('kind');     // wird 2026 18
    expect(ageClassFromBirth('2007-01-01', im2026)).toBe('jung');     // wird 2026 19 — schon ab 1.1. jung
    expect(ageClassFromBirth('2001-12-31', im2026)).toBe('jung');     // wird 2026 25
    expect(ageClassFromBirth('2000-01-01', im2026)).toBe('erwachsen'); // wird 2026 26
  });

  it('Geburtstag spät im Jahr: der Jahrgang zählt, und im Folgejahr wechselt die Klasse mit', () => {
    expect(ageClassFromBirth('2007-11-15', new Date(2026, 9, 26))).toBe('jung');
    expect(ageClassFromBirth('2008-11-15', new Date(2026, 9, 26))).toBe('kind');
    expect(ageClassFromBirth('2008-11-15', new Date(2027, 0, 1))).toBe('jung'); // Folgejahr: die Klasse wechselt mit
  });

  it('ohne oder mit ungültigem Datum: Erwachsene', () => {
    expect(ageClassFromBirth('')).toBe('erwachsen');
    expect(ageClassFromBirth('kein Datum')).toBe('erwachsen');
  });
});

describe('Franchise-Vorschlag nach dem 30. November', () => {
  // Tiefe Franchise günstiger (hohe Kosten): bis 30.11. als Wechsel vorschlagen, ab 1.12. offen (KVV Art. 94 Abs. 2).
  const opt = { lowFra: 300, highFra: 2500, annualSaving: 1500, reserve: 3200, sbMax: 700, breakEven: 1800, lowPremium: 450, highPremium: 325 };
  it('Frist: Werktag am oder vor dem 30.11.', () => {
    expect(kvgFristVorbei(new Date(2026, 10, 30))).toBe(false); // Montag
    expect(kvgFristVorbei(new Date(2026, 11, 1))).toBe(true);
    expect(kvgFristVorbei(new Date(2025, 10, 29))).toBe(true);  // 30.11.2025 Sonntag → Frist Fr 28.11.
  });
  it('tiefere Franchise: im November Wechsel, im Dezember offen; höhere bleibt', () => {
    expect(franchiseVorschlag(opt, { costs: 4000, eigeneFranchise: 2500, heute: new Date(2026, 10, 20) })).toMatchObject({ art: 'wechsel', franchise: 300 });
    expect(franchiseVorschlag(opt, { costs: 4000, eigeneFranchise: 2500, heute: new Date(2026, 11, 5) }).art).toBe('offen');
    expect(franchiseVorschlag(opt, { costs: 500, eigeneFranchise: 300, ersparnisse: 9000, heute: new Date(2026, 11, 5) })).toMatchObject({ art: 'wechsel', franchise: 2500 });
  });
});

describe('po.wechselzeit*', () => {
  it('vier Fassungen in allen fünf Sprachen; vor der Frist mit {datum}, danach ohne; keine feste Jahreszahl', () => {
    for (const s of [de, en, fr, itSprache, rm]) {
      for (const k of ['wechselzeit', 'wechselzeitStufen']) {
        expect(s.po[k]).toContain('{jahr}');
        expect(s.po[k]).toContain('{datum}');
        expect(s.po[k + 'NachFrist']).toContain('{jahr}');
        expect(s.po[k + 'NachFrist']).not.toContain('{datum}');
      }
      expect(s.po.refJahr).toContain('{jahr}');
      expect(Object.entries(s.po).filter(([k]) => /^wechselzeit|^refJahr/.test(k)).map(([, v]) => v).join(' ')).not.toMatch(/20\d\d/);
    }
  });
});
