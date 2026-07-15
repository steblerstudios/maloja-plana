import { describe, it, expect, vi } from 'vitest';
import { getLohnKontrollstelle, LOHN_KONTROLLSTELLEN, UNBEZAHLTER_LOHN_WEG } from '../lohnRechtsstellen.js';
import { kantonHatMindestlohn } from '../lohnCheck.js';

describe('lohnRechtsstellen', () => {
  it('deckt genau die Mindestlohn-Kantone aus lohnCheck ab', () => {
    for (const k of Object.keys(LOHN_KONTROLLSTELLEN)) {
      expect(kantonHatMindestlohn(k)).toBe(true);
    }
  });

  // ⚠️ Predeploy-Runde 8: GE/TI/JU trugen `verify: false` (= „amtlich belegt"), ohne dass
  // je eine Gegenprüfung stattgefunden hätte — nur NE/BS tragen einen Prüf-Kommentar mit
  // Datum + Quelle. Bis zum Beleg gilt die neutrale Formulierung.
  // Dieser Test hiess vorher „GE: belegte Stelle (OCIRT), nicht verify-pflichtig" und
  // hielt genau die Annahme fest, die niemand geprüft hatte.
  it('GE/TI/JU: ungeprüft ⇒ verify:true, bis der Beleg da ist', () => {
    for (const k of ['GE', 'TI', 'JU']) {
      expect(getLohnKontrollstelle(k).verify, k + ': ohne amtlichen Beleg kein verify:false').toBe(true);
    }
  });
  it('NE/BS: amtlich gegengeprüft ⇒ verify:false', () => {
    for (const k of ['NE', 'BS']) {
      expect(getLohnKontrollstelle(k).verify, k + ': belegt (Prüf-Kommentar mit Quelle)').toBe(false);
    }
  });

  it('JU: keine Kontrollstelle → Arbeitsgericht-Fallback (Wort „Kontrollstelle" meiden)', () => {
    const e = getLohnKontrollstelle('JU');
    expect(e.stelle).toBeNull();
    expect(e.fallback).toMatch(/prud’hommes/i);
  });

  // Amtlich gegengeprüft 2026-07-15 (rsn.ne.ch, ne.ch, gesetzessammlung.bs.ch, bs.ch/wsu/awa).
  it('NE: LEmpl Art. 32a ff. — KEIN eigenes „Mindestlohngesetz“ (der alte Titel war falsch)', () => {
    const e = getLohnKontrollstelle('NE');
    expect(e.verify).toBe(false);
    expect(e.gesetz).toMatch(/LEmpl/);
    expect(e.gesetz).toMatch(/32a/);
    expect(e.gesetz).not.toMatch(/Mindestlohngesetz/);
    expect(e.stelle).toMatch(/ORCT/);
  });

  it('BS: MiLoG vom 13.01.2021 (SG 812.200), zuständig ist das AWA', () => {
    const e = getLohnKontrollstelle('BS');
    expect(e.verify).toBe(false);
    expect(e.gesetz).toMatch(/MiLoG/);
    expect(e.gesetz).toMatch(/812\.200/);
    expect(e.stelle).toMatch(/Amt für Wirtschaft und Arbeit/);
  });

  // Wahrheits-Disziplin: jeder BELEGTE Eintrag braucht Gesetz + Stelle.
  it('jeder belegte Eintrag (verify:false) trägt Gesetzestitel und Stelle', () => {
    for (const [k, e] of Object.entries(LOHN_KONTROLLSTELLEN)) {
      if (e.verify) continue;
      expect(e.gesetz, k + ': belegter Eintrag braucht einen Gesetzestitel').toBeTruthy();
      expect(e.stelle || e.fallback, k + ': belegter Eintrag braucht Stelle oder Fallback').toBeTruthy();
    }
  });

  it('liefert null für Kantone ohne gesetzlichen Mindestlohn', () => {
    expect(getLohnKontrollstelle('ZH')).toBeNull();
    expect(getLohnKontrollstelle('')).toBeNull();
  });

  it('Fix A: der Weg für nicht bezahlten Lohn führt über Schlichtung/Arbeitsgericht', () => {
    expect(UNBEZAHLTER_LOHN_WEG).toMatch(/Schlichtungsbehörde|Arbeitsgericht/);
  });
});

// ⚠️ Predeploy-Runde 8 (Qualitäts-Prüfer): Der Wächter oben hiess bis dahin
// „verify:true ⇒ Stelle wird nicht verwendet" — und seine erste Zeile war
// `if (e.verify) continue;`. Er übersprang genau den Fall, den sein Titel versprach, und
// war grün, weil seit dem NE/BS-Beleg KEIN Kanton mehr verify:true trägt. Damit war der
// neutrale Zweig in `wageClaimRefs` (briefGenerator.js) über keinen echten Kanton getestet.
//
// Das ist die Bremse, die eine ungeprüfte Amtsstelle aus einem Einschreiben hält. Sie über
// einen synthetischen Eintrag zu prüfen ist der einzige Weg, solange kein Kanton sie auslöst.
// Der Beleg, dass es zählt: `c7e90cf` trug für NE ein frei erfundenes „Mindestlohngesetz
// (17.09.2015)" — verify:true hat es aus dem Brief gehalten. Von 2 geprüften Einträgen war 1 falsch.
describe('verify:true hält Ungeprüftes aus dem Brief (synthetischer Kanton)', () => {
  const KANTON_MIT_MINDESTLOHN = 'GE'; // damit das Kanton-Gate greift
  const dataGE = {
    basis: { firstName: 'Anna', lastName: 'Muster', canton: KANTON_MIT_MINDESTLOHN },
    wohnen: { city: 'Genève' },
    finanzen: { monthlyIncome: '3000', employer: 'Muster AG', incomeType: 'brutto' },
    ausbildung: { workHoursPerWeek: '42' },
  };

  it('ungeprüfter Eintrag: weder Gesetzestitel noch Stelle stehen im Brief', async () => {
    vi.resetModules();
    vi.doMock('../lohnRechtsstellen.js', () => ({
      LOHN_KONTROLLSTELLEN: {
        GE: { gesetz: 'ERFUNDENES-GESETZ-XY', stelle: 'ERFUNDENE-STELLE-XY', verify: true },
      },
      UNBEZAHLTER_LOHN_WEG: 'Schlichtungsbehörde bzw. Arbeitsgericht am Arbeitsort.',
      getLohnKontrollstelle: (k) => (k === 'GE' ? { gesetz: 'ERFUNDENES-GESETZ-XY', stelle: 'ERFUNDENE-STELLE-XY', verify: true } : null),
    }));

    const { generateLetter } = await import('../../briefGenerator.js');
    const { createT } = await import('../../i18n/index.js');
    const de = (await import('../../i18n/de.js')).default;
    const t = createT({ de }, 'de');

    const html = generateLetter('wageClaim', dataGE, t);
    expect(html).not.toContain('ERFUNDENES-GESETZ-XY');
    expect(html).not.toContain('ERFUNDENE-STELLE-XY');
    // …und der Brief bleibt funktionsfähig: die neutrale Formulierung trägt ihn.
    expect(html).toContain(t('briefe.wageClaim.stelleFallback'));

    vi.doUnmock('../lohnRechtsstellen.js');
    vi.resetModules();
  });
});
