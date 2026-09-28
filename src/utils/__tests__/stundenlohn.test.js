import { describe, it, expect } from 'vitest';
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
    expect(r.lesarten.inklusive).toEqual({ grund: 23.08, ferien: 1.92, feiertag: 0, dreizehnter: 0, total: 25 });
  });

  it('«dazu»: der Zuschlag kommt zu den 25 Fr. dazu → 27.08', () => {
    const r = stundenlohnRechnen({ betrag: '25', ferienForm: 'dazu', dreizehnter: 'nein', feiertag: 'nein' });
    expect(r.lesarten.dazu).toEqual({ grund: 25, ferien: 2.08, feiertag: 0, dreizehnter: 0, total: 27.08 });
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

  it('Kanton ohne Mindestlohn → keinGesetz; ohne Kanton → keinKanton', () => {
    expect(stundenlohnRechnen({ betrag: '18', ferienForm: 'dazu', kanton: 'ZH' }).befunde.dazu.status).toBe('keinGesetz');
    expect(stundenlohnRechnen({ betrag: '18', ferienForm: 'dazu' }).befunde.dazu.status).toBe('keinKanton');
  });
});

describe('Schwellen: Pensionskasse und Unfallversicherung', () => {
  it('BVG: über 22 680 im Jahr obligatorisch, mit der tiefsten Lesart gerechnet', () => {
    // 23.08 × 20 × 52 = 24 003 → über der Schwelle
    const r = stundenlohnRechnen({ betrag: '25', wochenstunden: '20', dreizehnter: 'nein', feiertag: 'nein' });
    expect(r.jahreslohn).toBe(24003);
    expect(r.bvg).toBe('obligatorisch');
    // 23.08 × 15 × 52 = 18 002 → darunter
    expect(stundenlohnRechnen({ betrag: '25', wochenstunden: '15', dreizehnter: 'nein' }).bvg).toBe('darunter');
  });

  it('BVG: genau auf der Schwelle ist noch nicht versichert (Art. 2: «mehr als»)', () => {
    // 22 680 / 52 / 20 = 21.8076… → Grundlohn so wählen, dass es aufgeht: 21.81 × 20 × 52 = 22 682
    expect(stundenlohnRechnen({ betrag: '21.8', ferienForm: 'bezahlt', wochenstunden: '20', dreizehnter: 'nein', feiertag: 'nein' }).bvg).toBe('darunter');
    expect(stundenlohnRechnen({ betrag: '21.81', ferienForm: 'bezahlt', wochenstunden: '20', dreizehnter: 'nein', feiertag: 'nein' }).bvg).toBe('obligatorisch');
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
