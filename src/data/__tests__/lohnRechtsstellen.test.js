import { describe, it, expect, vi } from 'vitest';
import { getLohnKontrollstelle, LOHN_KONTROLLSTELLEN, UNBEZAHLTER_LOHN_WEG } from '../lohnRechtsstellen.js';
import { kantonHatMindestlohn } from '../lohnCheck.js';

describe('lohnRechtsstellen', () => {
  it('deckt genau die Mindestlohn-Kantone aus lohnCheck ab', () => {
    for (const k of Object.keys(LOHN_KONTROLLSTELLEN)) {
      expect(kantonHatMindestlohn(k)).toBe(true);
    }
  });

  // Predeploy-Runde 8: GE/TI/JU trugen `verify:false`, ohne dass je eine Gegenprüfung
  // stattgefunden hätte. Sie wurden vorsorglich auf `true` gesetzt, dann an den VOLLTEXTEN
  // geprüft (nicht an Suchtreffern) — alle drei halten stand. Damit sind alle 5 Einträge
  // geprüft. Historische Bilanz: 1 von 5 war erfunden (NE „Mindestlohngesetz (17.09.2015)").
  it('alle 5 Kantone sind amtlich gegengeprüft ⇒ verify:false', () => {
    for (const k of ['GE', 'TI', 'JU', 'NE', 'BS']) {
      expect(getLohnKontrollstelle(k).verify, k + ': Prüf-Kommentar mit Quelle + Datum').toBe(false);
    }
  });

  // `briefGenerator.js` druckt `gesetz` bei `verify:false` WÖRTLICH in einen Brief an einen
  // Arbeitgeber. Ein Zitat ohne Erlassnummer ist juristisch angreifbar — und genau daran
  // war der erfundene NE-Eintrag zu erkennen: er nannte als einziger keine.
  it('jeder Gesetzestitel trägt eine Erlassnummer', () => {
    const NUMMER = {
      GE: 'RS-GE J 1 05',
      TI: 'RL 843.600',
      JU: 'RSJU 822.41',
      NE: 'RSN 813.10',
      BS: 'SG 812.200',
    };
    for (const [k, nr] of Object.entries(NUMMER)) {
      expect(getLohnKontrollstelle(k).gesetz, k + ': Erlassnummer fehlt im Zitat').toContain(nr);
    }
  });

  // Das JU-Zitat nannte bis Runde 8 „seit 01.02.2018" — das ist das INKRAFTTRETEN
  // (Fussnote 2 des RSJU 822.41), nicht das Erlassdatum (22.11.2017).
  it('JU zitiert das Erlassdatum, nicht das Inkrafttreten', () => {
    const e = getLohnKontrollstelle('JU');
    expect(e.gesetz).toContain('22.11.2017');
    expect(e.gesetz).not.toContain('01.02.2018');
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
