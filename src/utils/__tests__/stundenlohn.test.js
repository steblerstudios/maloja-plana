import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Stundenlohn } from '../../Stundenlohn.jsx';
import { createT } from '../../i18n/index.js';
import de from '../../i18n/de.js';
import { stundenlohnRechnen, ferienSatz, ferienWochenAnspruch, offeneFragen } from '../stundenlohn.js';

// «Was steht mir im Stundenlohn zu?» — getrennte Rechnung für Grundlohn und Zuschläge.
// Kern-Beispiel: 25 Fr. «alles inklusive» in Genf. Der Grundlohn ist dann 25 × 12/13 = 23.08,
// und genau der — nicht die 25 — ist mit dem Mindestlohn (24.59, ohne Zuschläge) zu vergleichen.

describe('Ferienzuschlag', () => {
  it('4, 5 und 6 Wochen ergeben 8,33 %, 10,64 % und 13,04 %', () => {
    expect(Math.round(ferienSatz(4) * 10000) / 100).toBe(8.33);
    expect(Math.round(ferienSatz(5) * 10000) / 100).toBe(10.64);
    expect(Math.round(ferienSatz(6) * 10000) / 100).toBe(13.04);
  });

  it('ungültige Wochen ergeben keinen Zuschlag', () => {
    expect(ferienSatz(0)).toBe(0);
    expect(ferienSatz(52)).toBe(0);
    expect(ferienSatz('x')).toBe(0);
  });

  it('bis 20 stehen mindestens 5 Wochen zu, sonst 4; mehr im Vertrag gilt', () => {
    expect(ferienWochenAnspruch('', false)).toBe(4);
    expect(ferienWochenAnspruch('', true)).toBe(5);
    expect(ferienWochenAnspruch('4', true)).toBe(5);
    expect(ferienWochenAnspruch('6', false)).toBe(6);
  });

  it('meldet, wenn der Vertrag weniger Ferien nennt, als zustehen', () => {
    expect(stundenlohnRechnen({ betrag: '25', ferienWochen: '4', unter20: true }).vertragZuWenig).toBe(true);
    expect(stundenlohnRechnen({ betrag: '25', ferienWochen: '5', unter20: true }).vertragZuWenig).toBe(false);
    expect(stundenlohnRechnen({ betrag: '25', unter20: true }).vertragZuWenig).toBe(false);
  });
});

describe('Grundlohn und Zuschläge getrennt', () => {
  it('ohne Betrag wird nicht gerechnet', () => {
    expect(stundenlohnRechnen({}).status).toBe('brauchtBetrag');
    expect(stundenlohnRechnen({ betrag: 'abc' }).status).toBe('brauchtBetrag');
  });

  it('«inklusive»: 25 Fr. enthalten den Zuschlag → Grundlohn 23.08 + Ferien 1.92', () => {
    const r = stundenlohnRechnen({ betrag: '25', ferienForm: 'inklusive', dreizehnter: 'nein', feiertag: 'nein' });
    expect(r.lesarten.inklusive).toMatchObject({ grund: 23.08, ferien: 1.92, feiertag: 0, dreizehnter: 0, total: 25 });
  });

  it('«dazu»: der Zuschlag kommt zu den 25 Fr. dazu → 27.08', () => {
    const r = stundenlohnRechnen({ betrag: '25', ferienForm: 'dazu', dreizehnter: 'nein', feiertag: 'nein' });
    expect(r.lesarten.dazu).toMatchObject({ grund: 25, ferien: 2.08, feiertag: 0, dreizehnter: 0, total: 27.08 });
  });

  it('«bezahlt»: Ferien werden bezogen und bezahlt → kein Zuschlag', () => {
    const r = stundenlohnRechnen({ betrag: '25', ferienForm: 'bezahlt', dreizehnter: 'nein', feiertag: 'nein' });
    expect(r.lesarten.bezahlt.ferien).toBe(0);
    expect(r.lesarten.bezahlt.total).toBe(25);
  });

  it('«unklar»: beide Lesarten werden gezeigt, keine wird angenommen', () => {
    const r = stundenlohnRechnen({ betrag: '25' });
    expect(Object.keys(r.lesarten).sort()).toEqual(['dazu', 'inklusive']);
  });

  it('13. Monatslohn als Zwölftel des Grundlohns, Feiertage nur beziffert', () => {
    const r = stundenlohnRechnen({ betrag: '24', ferienForm: 'dazu', dreizehnter: 'ja', feiertag: 'ja', feiertagProzent: '3,5' });
    expect(r.lesarten.dazu.dreizehnter).toBe(2);
    expect(r.lesarten.dazu.feiertag).toBe(0.84);
    expect(r.lesarten.dazu.total).toBe(28.84);
  });

  it('Feiertage «unklar» fliessen nicht in die Rechnung, sondern in die Fragen', () => {
    const r = stundenlohnRechnen({ betrag: '24', ferienForm: 'dazu', feiertag: 'unklar', feiertagProzent: '3' });
    expect(r.lesarten.dazu.feiertag).toBe(0);
    expect(r.fragen).toContain('feiertag');
  });
});

describe('Mindestlohn am Grundlohn, nicht am Betrag mit Zuschlägen', () => {
  it('GE, 25 Fr. inklusive, kein 13.: Grundlohn 23.08 liegt unter 24.59', () => {
    const r = stundenlohnRechnen({ betrag: '25', ferienForm: 'inklusive', dreizehnter: 'nein', kanton: 'GE', wochenstunden: '20' });
    expect(r.befunde.inklusive.status).toBe('unterMindestlohn');
    expect(r.befunde.inklusive.lohnStunde).toBe(23.08);
    expect(r.befunde.inklusive.differenzMonat).toBeGreaterThan(0);
  });

  it('Gegenprobe: dieselben 25 Fr. mit Zuschlag «dazu» sind über dem Mindestlohn', () => {
    const r = stundenlohnRechnen({ betrag: '25', ferienForm: 'dazu', dreizehnter: 'nein', kanton: 'GE', wochenstunden: '20' });
    expect(r.befunde.dazu.status).toBe('ok');
  });

  it('13. unbeantwortet und Grundlohn im 12/13-Spalt → keine Unterschreitung behaupten', () => {
    const r = stundenlohnRechnen({ betrag: '25', ferienForm: 'inklusive', kanton: 'GE', wochenstunden: '20' });
    expect(r.befunde.inklusive.status).toBe('dreizehnterUnklar');
  });

  it('Ferienform unklar: je Lesart ein eigener Befund', () => {
    const r = stundenlohnRechnen({ betrag: '25', dreizehnter: 'nein', kanton: 'GE', wochenstunden: '20' });
    expect(r.befunde.inklusive.status).toBe('unterMindestlohn');
    expect(r.befunde.dazu.status).toBe('ok');
  });

  it('ohne Wochenstunden: Stundenvergleich ja, Monatsdifferenz nein', () => {
    const r = stundenlohnRechnen({ betrag: '25', ferienForm: 'inklusive', dreizehnter: 'nein', kanton: 'GE' });
    expect(r.befunde.inklusive.status).toBe('unterMindestlohn');
    expect(r.befunde.inklusive.differenzMonat).toBeUndefined();
    expect(r.befunde.inklusive.mindestMonat).toBeUndefined();
  });

  it('B2 · NE und BS: der Mindestlohn gilt ohne Ferienzuschlag (LEmpl Art. 32d Abs. 3 · MiLoG § 3 Abs. 1) → am Grundlohn', () => {
    // 22.50 inkl. Ferien → Grundlohn 20.77: unter NE 21.35 und unter BS 22.20
    for (const kanton of ['NE', 'BS']) {
      const r = stundenlohnRechnen({ betrag: '22.5', ferienForm: 'inklusive', dreizehnter: 'nein', kanton, wochenstunden: '20' });
      expect(r.befunde.inklusive.status, kanton).toBe('unterMindestlohn');
      expect(r.befunde.inklusive.lohnStunde).toBe(20.77);
    }
  });

  it('B2 · BS, Ferien «dazu»: der Betrag ist der Grundlohn', () => {
    expect(stundenlohnRechnen({ betrag: '22.5', ferienForm: 'dazu', dreizehnter: 'nein', kanton: 'BS', wochenstunden: '20' }).befunde.dazu.status).toBe('ok');
  });

  it('Kanton ohne Mindestlohn → keinGesetz; ohne Kanton → keinKanton', () => {
    expect(stundenlohnRechnen({ betrag: '18', ferienForm: 'dazu', kanton: 'ZH' }).befunde.dazu.status).toBe('keinGesetz');
    expect(stundenlohnRechnen({ betrag: '18', ferienForm: 'dazu' }).befunde.dazu.status).toBe('keinKanton');
  });
});

describe('Schwellen: Pensionskasse und Unfallversicherung', () => {
  it('BVG: über 22 680 im Jahr obligatorisch, mit der tiefsten Lesart gerechnet', () => {
    // Ferien enthalten: 25 × 12/13 × 20 × 52 = 24 000 (ungerundeter Grundlohn) → über der Schwelle
    const r = stundenlohnRechnen({ betrag: '25', ferienForm: 'inklusive', wochenstunden: '20', dreizehnter: 'nein', feiertag: 'nein' });
    expect(r.jahreslohn).toBe(24000);
    expect(r.bvg).toBe('obligatorisch');
    // 25 × 12/13 × 15 × 52 = 18 000 → darunter
    expect(stundenlohnRechnen({ betrag: '25', ferienForm: 'inklusive', wochenstunden: '15', dreizehnter: 'nein' }).bvg).toBe('darunter');
  });

  it('BVG: genau auf der Schwelle ist noch nicht versichert (Art. 2: «mehr als»)', () => {
    // 31.50 × 12/13 × 15 × 52 = 22 680.00 genau → nicht mehr als die Schwelle
    const genau = stundenlohnRechnen({ betrag: '31.5', ferienForm: 'inklusive', wochenstunden: '15', dreizehnter: 'nein', feiertag: 'nein' });
    expect(genau.jahreslohn).toBe(22680);
    expect(genau.bvg).toBe('darunter');
    // 31.51 → 22 687.20, einen Schritt darüber
    expect(stundenlohnRechnen({ betrag: '31.51', ferienForm: 'inklusive', wochenstunden: '15', dreizehnter: 'nein', feiertag: 'nein' }).bvg).toBe('obligatorisch');
  });

  it('BVG: die Schwelle wird am ungerundeten Jahreslohn gemessen, nicht am gerundeten', () => {
    // 21.81 × 19.998 × 52 = 22 680.3 → mehr als 22 680, auch wenn die Anzeige 22 680 zeigt
    const r = stundenlohnRechnen({ betrag: '21.81', ferienForm: 'bezahlt', wochenstunden: '19.998', dreizehnter: 'nein', feiertag: 'nein' });
    expect(r.jahreslohn).toBe(22680);
    expect(r.bvg).toBe('obligatorisch');
  });

  it('B1 · Ferienform unklar: liegen die Lesarten auf verschiedenen Seiten der Schwelle → haengtAnFerien', () => {
    // enthalten: 25 × 12/13 × 18 × 52 = 21 600 · dazu: 25 × 18 × 52 = 23 400 · Schwelle 22 680
    const r = stundenlohnRechnen({ betrag: '25', wochenstunden: '18', dreizehnter: 'nein', feiertag: 'nein' });
    expect(r.ferienForm).toBe('unklar');
    expect(r.bvg).toBe('haengtAnFerien');
    expect(r.jahrTief).toBe(21600);
    expect(r.jahrHoch).toBe(23400);
  });

  it('B1 · Ferienform unklar, aber beide Lesarten auf derselben Seite → eindeutig', () => {
    expect(stundenlohnRechnen({ betrag: '25', wochenstunden: '20', dreizehnter: 'nein', feiertag: 'nein' }).bvg).toBe('obligatorisch'); // 24 000 / 26 000
    expect(stundenlohnRechnen({ betrag: '25', wochenstunden: '15', dreizehnter: 'nein', feiertag: 'nein' }).bvg).toBe('darunter'); // 18 000 / 19 500
  });

  it('B1 · bekannte Ferienform: nie haengtAnFerien', () => {
    expect(stundenlohnRechnen({ betrag: '25', ferienForm: 'inklusive', wochenstunden: '18', dreizehnter: 'nein' }).bvg).toBe('darunter');
    expect(stundenlohnRechnen({ betrag: '25', ferienForm: 'dazu', wochenstunden: '18', dreizehnter: 'nein' }).bvg).toBe('obligatorisch');
  });

  it('B2 (Fach) · befristet bis drei Monate: keine Pensionskassen-Pflicht behaupten, auch über der Schwelle', () => {
    const basis = { betrag: '25', ferienForm: 'dazu', wochenstunden: '20', dreizehnter: 'nein', feiertag: 'nein' };
    expect(stundenlohnRechnen({ ...basis, art: 'befristet' }).bvg).toBe('befristetKurz');
    expect(stundenlohnRechnen({ ...basis, art: 'befristet', ueber3Monate: 'nein' }).bvg).toBe('befristetKurz');
    expect(stundenlohnRechnen({ ...basis, art: 'befristet', ueber3Monate: 'ja' }).bvg).toBe('obligatorisch');
    expect(stundenlohnRechnen({ ...basis, art: 'fest' }).bvg).toBe('obligatorisch');
    // unter der Schwelle bleibt es «darunter»
    expect(stundenlohnRechnen({ ...basis, wochenstunden: '10', art: 'befristet' }).bvg).toBe('darunter');
  });

  it('NBU ab 8 Std./Woche; darunter nur Berufsunfälle', () => {
    expect(stundenlohnRechnen({ betrag: '25', wochenstunden: '8' }).nbu).toBe('versichert');
    expect(stundenlohnRechnen({ betrag: '25', wochenstunden: '7,5' }).nbu).toBe('nurBeruf');
    expect(stundenlohnRechnen({ betrag: '25' }).nbu).toBe('unbekannt');
  });

  it('ein Pensum in Prozent im Stundenfeld (80) rechnet keine Schwellen', () => {
    const r = stundenlohnRechnen({ betrag: '25', wochenstunden: '80', kanton: 'GE', ferienForm: 'inklusive', dreizehnter: 'nein' });
    expect(r.stundenUnplausibel).toBe(true);
    expect(r.bvg).toBe('unbekannt');
    expect(r.nbu).toBe('unbekannt');
    expect(r.monat).toBeNull();
  });
});

describe('offene Fragen', () => {
  it('fragt nur, was nicht beantwortet ist', () => {
    const alles = offeneFragen({ ausgewiesen: 'ja', art: 'fest' }, { ferienForm: 'inklusive', dreizehnter: 'nein', feiertag: 'nein' });
    expect(alles).toEqual([]);
    const nichts = offeneFragen({}, { ferienForm: 'unklar', dreizehnter: 'unklar', feiertag: 'unklar' });
    expect(nichts).toEqual(['ferienForm', 'ausgewiesen', 'feiertag', 'dreizehnter']);
  });

  it('bei bezahlten Ferien stellt sich die Frage nach dem ausgewiesenen Zuschlag nicht', () => {
    expect(offeneFragen({}, { ferienForm: 'bezahlt', dreizehnter: 'nein', feiertag: 'nein' })).toEqual([]);
  });

  it('je Art eine eigene Frage', () => {
    const basis = { ferienForm: 'bezahlt', dreizehnter: 'nein', feiertag: 'nein' };
    expect(offeneFragen({ art: 'abrufEcht' }, basis)).toEqual(['bereitschaft']);
    expect(offeneFragen({ art: 'temporaer' }, basis)).toEqual(['gav']);
    expect(offeneFragen({ art: 'befristet' }, basis)).toEqual(['krankheit']);
    expect(offeneFragen({ art: 'befristet', ueber3Monate: 'ja' }, basis)).toEqual([]);
  });
});

// Die Einordnung, wie sie die Person liest: gerenderter Text (de), nicht nur der Status.
describe('Einordnung im gerenderten Text', () => {
  const palette = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? '#777777' : undefined) });
  const t = createT({ de }, 'de', 'sie');
  const seite = (rechner) => renderToStaticMarkup(React.createElement(Stundenlohn, {
    palette, t, onUpdateData: () => {}, data: { finanzen: { stundenlohnRechner: rechner } },
  })).replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/\s+/g, ' ');

  it('B10 · der Basel-Satz zum 13. Monatslohn steht nur bei Basel-Stadt', () => {
    const basis = { betrag: '21', ferienForm: 'dazu', dreizehnter: 'ja', wochenstunden: '20', feiertag: 'nein' };
    expect(seite({ ...basis, kanton: 'BS' })).toContain('In Basel-Stadt gilt das nur');
    // Genf: 24.00 liegt zwischen 22.70 und 24.59 → konformMit13, aber ohne den Basler Satz
    const ge = seite({ ...basis, betrag: '24', kanton: 'GE' });
    expect(ge).toContain('Mit dem 13. Monatslohn kann das reichen');
    expect(ge).not.toContain('In Basel-Stadt gilt das nur');
  });

  it('B1 · unbekannte Ferienform an der Schwelle: der Text sagt, dass es an den Ferien hängt', () => {
    const txt = seite({ betrag: '25', wochenstunden: '18', dreizehnter: 'nein', feiertag: 'nein' });
    expect(txt).toContain('Ob die Pensionskasse obligatorisch ist, hängt davon ab, ob die Ferien im Stundenlohn enthalten sind');
    expect(txt).toContain("geschätzt CHF 21’600 oder CHF 23’400 im Jahr, Eintrittsschwelle CHF 22’680 (BVG Art. 2 Abs. 1).");
  });

  it('befristet: der Hinweis ersetzt die Pflichtaussage; sonst nennt der Text die Ausnahmen', () => {
    const basis = { betrag: '25', ferienForm: 'dazu', wochenstunden: '20', dreizehnter: 'nein', feiertag: 'nein' };
    const kurz = seite({ ...basis, art: 'befristet' });
    expect(kurz).toContain('Bei befristeten Anstellungen bis drei Monate gilt die Pflicht in der Regel nicht (BVV 2 Art. 1j Abs. 1 Bst. b).');
    expect(kurz).not.toContain('gehört die Stelle damit in die Pensionskasse');
    const fest = seite({ ...basis, art: 'fest' });
    expect(fest).toContain('in der Regel gehört die Stelle damit in die Pensionskasse (BVG Art. 2 Abs. 1). Ausnahmen: befristet auf höchstens drei Monate, Nebenerwerb neben einer schon versicherten Hauptstelle (BVV 2 Art. 1j Abs. 1 Bst. b und c).');
  });

  it('Tessin: «ok» nennt die Spanne der Branchen, andere Kantone nicht; überall der Hinweis auf GAV/NAV', () => {
    const ti = seite({ betrag: '22', ferienForm: 'bezahlt', kanton: 'TI', wochenstunden: '20', dreizehnter: 'nein' });
    expect(ti).toContain('liegt auf oder über dem tiefsten Tessiner Mindestlohn (CHF 20.00). Je nach Branche liegt er bis CHF 20.50.');
    const ge = seite({ betrag: '30', ferienForm: 'bezahlt', kanton: 'GE', wochenstunden: '20', dreizehnter: 'nein' });
    expect(ge).not.toContain('Tessiner');
    for (const txt of [ti, ge]) expect(txt).toContain('Ein Gesamt- oder Normalarbeitsvertrag der Branche kann einen höheren Mindestlohn vorschreiben.');
  });

  it('NBU unter 8 Stunden: Berufsunfälle und Arbeitsweg, nicht die Freizeit', () => {
    const txt = seite({ betrag: '25', wochenstunden: '6' });
    expect(txt).toContain('nur Berufsunfälle versichert, dazu Unfälle auf dem Arbeitsweg (UVV Art. 13 Abs. 1 und 2). Unfälle in der Freizeit nicht.');
  });

  it('Quellenzeile: NE Art. 32d Abs. 3, BS § 3 Abs. 1, keine Behauptung zu BS-Feiertagen', () => {
    const txt = seite({});
    expect(txt).toContain('NE LEmpl Art. 32d Abs. 3');
    expect(txt).toContain('BS MiLoG § 3 Abs. 1');
    expect(txt).not.toContain('Art. 32a ff.');
    expect(txt).toContain('In Genf, Neuenburg, im Tessin und im Jura gilt der Mindestlohn ohne Ferien- und Feiertagszuschlag, in Basel-Stadt ohne Ferienzuschlag.');
  });
});
