import { describe, it, expect } from 'vitest';
import {
  vermoegenSumme, einkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, regionAusPLZ, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from '../kantonsModell.js';

// Der gemeinsame Rahmen der Kantonsmodelle (K31). Er ist am 20.09.2026 entstanden, weil
// derselbe Fehler in vier Modulen lag. Diese Tests halten fest, was der Rahmen leistet —
// und ausdrücklich auch, wo die Kantone sich UNTERSCHEIDEN dürfen.

describe('Riegel, die in allen Kantonen gleich sind', () => {
  it('praemieFehlt: ohne erfasste Prämie keine Zahl — der Fehler, der viermal dieselbe Ursache hatte', () => {
    // Genau diese Fälle lieferten vor dem 20.09. die Obergrenze statt des Anspruchs.
    expect(praemieFehlt(praemieJahr({}))).toBe(true);                               // kein Feld
    expect(praemieFehlt(praemieJahr({ versicherungen: {} }))).toBe(true);           // leer
    expect(praemieFehlt(praemieJahr({ versicherungen: { kkPremium: 0 } }))).toBe(true);
    expect(praemieFehlt(praemieJahr({ versicherungen: { kkPremium: '' } }))).toBe(true);
    expect(praemieFehlt(praemieJahr({ versicherungen: { kkPremium: 'abc' } }))).toBe(true);
    expect(praemieFehlt(praemieJahr({ versicherungen: { kkPremium: 400 } }))).toBe(false);
  });

  it('praemieJahr rechnet den Monatsbetrag aufs Jahr', () => {
    expect(praemieJahr({ versicherungen: { kkPremium: 400 } })).toBe(4800);
    expect(praemieJahr({ versicherungen: { kkPremium: '450' } })).toBe(5400);
  });

  it('mehrereErwachsene: Konkubinat zählt wie verheiratet — das zweite Einkommen fehlt', () => {
    const hh1 = { adults: 1 };
    expect(mehrereErwachsene(hh1, { maritalStatus: 'single' })).toBe(false);
    expect(mehrereErwachsene(hh1, { maritalStatus: 'married' })).toBe(true);
    expect(mehrereErwachsene(hh1, { maritalStatus: 'cohabiting' })).toBe(true);
    expect(mehrereErwachsene({ adults: 2 }, { maritalStatus: 'single' })).toBe(true);
  });

  it('jahrVorbei: ab dem Folgejahr keine Zahl aus veralteten Sätzen', () => {
    const heute = new Date().getFullYear();
    expect(jahrVorbei(heute)).toBe(false);
    expect(jahrVorbei(heute + 1)).toBe(false);
    expect(jahrVorbei(heute - 1)).toBe(true);
  });
});

describe('Eingaben lesen', () => {
  it('vermoegenSumme zählt die drei erfassten Posten', () => {
    expect(vermoegenSumme({ securitiesValue: 1000, otherAssets: 200, savingsAccount: 50 })).toBe(1250);
    expect(vermoegenSumme({})).toBe(0);
    expect(vermoegenSumme({ savingsAccount: '3000' })).toBe(3000);
  });

  it('einkommenJahr: Monatsfelder × 12', () => {
    expect(einkommenJahr({ monthlyIncome: 1000 })).toBe(12000);
    expect(einkommenJahr({ monthlyIncome: 500, sideIncome: 200, ahvRente: 300 })).toBe(12000);
    expect(einkommenJahr({})).toBe(0);
  });

  // 🛑 DER RÜCKFALL-WÄCHTER (Befund Fachprüfung 20.09.2026).
  // Bis zum 20.09. stand hier `pension3a: 7056` → 19056, mit dem Beleg, die Erlasse rechneten
  // die 3a hinzu. Sie tun das — aber auf eine Steuergrösse, in der sie abgezogen IST. Das
  // Nettoeinkommen der App («was auf Ihrem Konto ankommt») trägt sie bereits, also war es
  // eine Doppelzählung: Einkommen zu hoch ⇒ Verbilligung zu tief, in allen vier Kantonen.
  // Dieser Test hält genau das fest. Fällt er um, ist der Fehler zurück.
  it('einkommenJahr: Säule 3a wird NICHT ein zweites Mal aufgerechnet', () => {
    expect(einkommenJahr({ monthlyIncome: 1000, pension3a: 7056 })).toBe(12000);
    expect(einkommenJahr({ monthlyIncome: 1000, pension3a: 0 })).toBe(12000);
    // und die Regel ändert daran nichts, solange zwei von dreien noch nicht wirken
    expect(einkommenJahr({ monthlyIncome: 1000, pension3a: 7056 }, SAEULE_3A.voll)).toBe(12000);
    expect(einkommenJahr({ monthlyIncome: 1000, pension3a: 7056 }, SAEULE_3A.bisBundesMaximum)).toBe(12000);
    expect(einkommenJahr({ monthlyIncome: 1000, pension3a: 7056 }, SAEULE_3A.schwelleOhneSaeule2)).toBe(12000);
  });

  // Die drei Regeln sind absichtlich EINZELN benannt, auch wo sie heute dasselbe rechnen —
  // sonst schreibt der nächste Kanton «belegt», wo «Zahl fehlt noch» gemeint war.
  describe('SAEULE_3A: die drei Zurechnungsregeln', () => {
    it('jede Regel nennt ihre Kantone und ihren Beleg', () => {
      expect(SAEULE_3A.voll.kantone).toBe('ZH, SG');
      expect(SAEULE_3A.bisBundesMaximum.kantone).toBe('BE');
      expect(SAEULE_3A.schwelleOhneSaeule2.kantone).toBe('AG');
      for (const r of Object.values(SAEULE_3A)) expect(r.beleg).toMatch(/Art\.|§/);
    });

    it('nur `voll` ist fertig — die anderen zwei sagen, was ihnen fehlt', () => {
      expect(SAEULE_3A.voll.offen).toBeUndefined();
      expect(SAEULE_3A.bisBundesMaximum.offen).toMatch(/nicht belegt/);
      expect(SAEULE_3A.schwelleOhneSaeule2.offen).toMatch(/nicht SICHER/);
    });

    // Die AG-Rechnung liegt bereit, damit sie beim Entscheid nicht neu erfunden wird —
    // 10 % des Nettoerwerbseinkommens, § 5 Abs. 1 V KVGG.
    it('die AG-Schwelle rechnet, auch wenn sie noch nicht angewendet wird', () => {
      expect(SAEULE_3A.schwelleOhneSaeule2.schwelle({ monthlyIncome: 2500 })).toBe(3000);
      expect(SAEULE_3A.schwelleOhneSaeule2.schwelle({})).toBe(0);
    });
  });

  it('geburtsjahr nimmt nur ein datiertes Feld', () => {
    expect(geburtsjahr({ dateOfBirth: '1980-05-01' })).toBe(1980);
    expect(geburtsjahr({ dateOfBirth: '' })).toBe(null);
    expect(geburtsjahr({})).toBe(null);
    expect(geburtsjahr({ dateOfBirth: 'irgendwas' })).toBe(null);
  });
});

describe('🛑 Alters-Lesarten: der Unterschied ist gewollt und belegt', () => {
  // Am 20.09.2026 standen im Code VIER Schreibweisen. Gemessen am Verhalten waren es
  // ZWEI Regeln: ZH, BE und VD gleich — AG allein anders. Dieser Test hält den Unterschied
  // fest, damit er nicht versehentlich verschwindet UND nicht versehentlich entsteht.
  const JAHR = 2026;

  it('abEndeVorjahr (ZH, BE, VD): Jahrgang 2000 gilt 2026 noch nicht als erwachsen', () => {
    expect(ERWACHSEN.abEndeVorjahr(JAHR, 1980)).toBe(true);
    expect(ERWACHSEN.abEndeVorjahr(JAHR, 1999)).toBe(true);
    expect(ERWACHSEN.abEndeVorjahr(JAHR, 2000)).toBe(false);
    expect(ERWACHSEN.abEndeVorjahr(JAHR, 2001)).toBe(false);
  });

  it('imAnspruchsjahr (AG): Jahrgang 2000 gilt 2026 als erwachsen', () => {
    expect(ERWACHSEN.imAnspruchsjahr(JAHR, 2000)).toBe(true);
    expect(ERWACHSEN.imAnspruchsjahr(JAHR, 2001)).toBe(false);
  });

  it('die zwei Lesarten liegen genau einen Jahrgang auseinander — nicht mehr, nicht weniger', () => {
    const grenze = (regel) => {
      for (let g = 2010; g >= 1960; g--) if (regel(JAHR, g)) return g;
      return null;
    };
    expect(grenze(ERWACHSEN.imAnspruchsjahr) - grenze(ERWACHSEN.abEndeVorjahr)).toBe(1);
  });
});

describe('Kinderalter', () => {
  it('Kind ohne erfasstes Alter ergibt null — eine 0 heisst «nicht erfasst», nicht «Säugling»', () => {
    expect(kinderAlter([{ age: 0 }], 2026)).toEqual([null]);
    expect(kinderAlter([{}], 2026)).toEqual([null]);
    expect(ALTER_UNERFASST(kinderAlter([{ age: 0 }], 2026))).toBe(true);
  });

  it('Geburtsdatum schlägt das eingetippte Alter, Bezugsjahr entscheidet', () => {
    expect(kinderAlter([{ birthDate: '2014-03-01' }], 2026)).toEqual([12]);
    expect(kinderAlter([{ birthDate: '2014-03-01' }], 2025)).toEqual([11]);
  });

  it('eingetipptPlus hält die Grenze 18 auf der vorsichtigen Seite (BE-Lesart)', () => {
    expect(kinderAlter([{ age: 18 }], 2026, 0)).toEqual([18]);   // ZH: bleibt Kind
    expect(kinderAlter([{ age: 18 }], 2026, 1)).toEqual([19]);   // BE: fällt heraus
    expect(UEBER_18(kinderAlter([{ age: 18 }], 2026, 1))).toBe(true);
    expect(UEBER_18(kinderAlter([{ age: 18 }], 2026, 0))).toBe(false);
  });
});

describe('Prämienregion aus PLZ und Ort', () => {
  // Kleine Attrappe statt der echten PLZ-Daten: geprüft wird die Auswahl-Logik,
  // nicht der Datenbestand (der hat seine eigenen Tests).
  const lookup = (plz) => ({
    '3000': [{ kanton: 'BE', gemeinde: 'Bern', bfsNr: 351 }],
    '3600': [{ kanton: 'BE', gemeinde: 'Thun', bfsNr: 942 }, { kanton: 'BE', gemeinde: 'Steffisburg', bfsNr: 934 }],
    '3634': [{ kanton: 'BE', gemeinde: 'Thierachern', bfsNr: 941 }, { kanton: 'BE', gemeinde: 'Reutigen', bfsNr: 767 }],
    '9999': [{ kanton: 'ZH', gemeinde: 'Anderswo', bfsNr: 1 }],
  }[plz] || []);
  const regionFn = (bfs) => ({ 351: 1, 942: 2, 934: 2, 941: 3, 767: 2 }[bfs] || null);
  const daten = (postalCode, city = '') => ({ wohnen: { postalCode, city } });

  it('eindeutige Gemeinde → ihre Region', () => {
    expect(regionAusPLZ({ data: daten('3000'), kanton: 'BE', lookupPLZ: lookup, regionFn }).region).toBe(1);
  });

  it('mehrere Gemeinden, aber alle in derselben Region → diese Region', () => {
    expect(regionAusPLZ({ data: daten('3600'), kanton: 'BE', lookupPLZ: lookup, regionFn }).region).toBe(2);
  });

  it('mehrere Gemeinden in verschiedenen Regionen und kein Ortsname → keine Region', () => {
    expect(regionAusPLZ({ data: daten('3634'), kanton: 'BE', lookupPLZ: lookup, regionFn }).region).toBe(null);
  });

  it('der Ortsname entscheidet, wenn die PLZ mehrdeutig ist', () => {
    expect(regionAusPLZ({ data: daten('3634', 'Thierachern'), kanton: 'BE', lookupPLZ: lookup, regionFn }).region).toBe(3);
    expect(regionAusPLZ({ data: daten('3634', 'Reutigen'), kanton: 'BE', lookupPLZ: lookup, regionFn }).region).toBe(2);
  });

  it('Gemeinden anderer Kantone zählen nicht mit', () => {
    const r = regionAusPLZ({ data: daten('9999'), kanton: 'BE', lookupPLZ: lookup, regionFn });
    expect(r.region).toBe(null);
    expect(r.orte).toEqual([]);
  });

  it('ohne PLZ keine Region, ohne Absturz', () => {
    expect(regionAusPLZ({ data: {}, kanton: 'BE', lookupPLZ: lookup, regionFn }).region).toBe(null);
  });
});

describe('Deckel pro Person', () => {
  it('deckelt nur den Anteil der erwachsenen Person, der Kinderanteil bleibt', () => {
    // Gesamt 5000, davon 3000 für die erwachsene Person, Prämie 2400.
    expect(deckelnProPerson(5000, 3000, 2400)).toBe(4400);
  });

  it('liegt die Prämie über dem Anteil, ändert der Deckel nichts', () => {
    expect(deckelnProPerson(5000, 3000, 9000)).toBe(5000);
  });
});

describe('Ergebnis', () => {
  const basis = { canton: 'XX', cantonData: { a: 1 }, jahr: 2026, vorbehaltKey: 'ipv.vorbehalt' };

  it('ohne Anspruch: Betrag 0, belegt, nicht berechtigt', () => {
    const r = ergebnisOhneAnspruch({ ...basis, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: 50000 } });
    expect(r).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.incomeAboveLimit', jahr: 2026 });
    expect(r.anspruchMoeglich).toBeUndefined();
  });

  it('mit Anspruch: Monatsbetrag und Prozentsatz aus Jahresbetrag und Höchstbetrag', () => {
    const r = ergebnisMitAnspruch({ ...basis, annual: 2400, maxAnnual: 4800, youngAdultsCount: 0, noteKey: 'x' });
    expect(r).toMatchObject({ eligible: true, belegt: true, anspruchMoeglich: true, amount: 200, annual: 2400, maxAnnual: 4800, reductionPercent: 50 });
  });

  it('`extra` trägt, was den Kanton ausmacht — Region hier, Basisjahr dort', () => {
    expect(ergebnisMitAnspruch({ ...basis, annual: 1200, maxAnnual: 1200, noteKey: 'x', extra: { region: 2 } }).region).toBe(2);
    expect(ergebnisMitAnspruch({ ...basis, annual: 1200, maxAnnual: 1200, noteKey: 'x', extra: { basisjahr: 2023 } }).basisjahr).toBe(2023);
  });
});
