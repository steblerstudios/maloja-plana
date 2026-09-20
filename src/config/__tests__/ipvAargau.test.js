import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_AG, ipvAargauRechnen, agMassgebendesEinkommen, ipvAargau } from '../ipvAargau.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Aargau 2026, viertes Kantonsmodell.
// Quellen (alle am 2026-09-20 neu abgerufen), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt AG:
//  [1] Gesetz zum Bundesgesetz über die Krankenversicherung (KVGG, SAR 837.200), Version in
//      Kraft seit 01.12.2025 — https://gesetzessammlungen.ag.ch/app/de/texts_of_law/837.200
//  [2] Verordnung zum KVGG (V KVGG, SAR 837.211) mit Anhang 1 «Berechnungselemente für die
//      Verteilung der Prämienverbilligung 2026» (Stand 1. September 2025), Version in Kraft
//      seit 01.09.2025 — https://gesetzessammlungen.ag.ch/app/de/texts_of_law/837.211
//  [3] Anhang 1 als Einzel-PDF des Kantons (Handbuch Soziales, Kapitel 7)
//  [4] SVA Aargau, «Allgemeine Informationen» und «Informationsblatt Prämienverbilligung»
//
// Das Modell: Summe der Richtprämien des Haushalts minus Einkommenssatz × massgebendes
// Einkommen ([1] § 6 Abs. 1). Linear wie ZH, aber ohne Prämienregionen und mit einem
// Einkommensabzug je Haushaltstyp statt eines Eigenanteils je Zivilstand.

// Werte 2026 aus [2] Anhang 1, wörtlich abgeschrieben — absichtlich nicht aus IPV_AG
// abgeleitet, damit ein stiller Zahlendreher im Datensatz auffällt.
const RICHTPRAEMIE_2026 = { e: 5830, j: 4260, k: 1380 };
const EINKOMMENSSATZ_2026 = 0.175;
const ABZUG_2026 = { alleinstehend: 8500, alleinstehendMitKind: 12200, ehepaar: 0, ehepaarMitKind: 8000 };
const KINDERABZUG_2026 = 2500;

describe('K31 calculateIPV für AG, bevor das AG-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'AG', dateOfBirth: '1980-05-01' }, finanzen: { monthlyIncome: 2000 } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 AG: die Zahlen 2026 stehen so im Erlass [2] Anhang 1', () => {
  it('Richtprämien, Einkommenssatz, Einkommensabzüge und Kinderabzug', () => {
    expect(IPV_AG.jahr).toBe(2026);
    expect(IPV_AG.richtpraemie).toEqual(RICHTPRAEMIE_2026);
    expect(IPV_AG.einkommenssatz).toBe(EINKOMMENSSATZ_2026);
    expect(IPV_AG.abzug).toEqual(ABZUG_2026);
    expect(IPV_AG.kinderabzug).toBe(KINDERABZUG_2026);
    // [1] § 6 Abs. 2: «zuzüglich einem Fünftel des steuerbaren Vermögens»
    expect(IPV_AG.vermoegensanteil).toBe(0.2);
    // [1] § 7 Abs. 1: «das Jahr, das drei Jahre vor dem Anspruchsjahr begonnen hat» — DREI,
    // nicht zwei wie in BE. Genau daran hängt `ipv.vorbehaltAG`.
    expect(IPV_AG.basisjahrAbstand).toBe(3);
    // [1] § 7 Abs. 2: «mindestens 50 % der effektiven Prämie»
    expect(IPV_AG.mindestanteilKind).toBe(0.5);
  });

  it('Beleg-Zeile: belegt, aber ohne Einzelwerte — AG publiziert keine Einkommensgrenze', () => {
    expect(CANTONAL_IPV.AG.beleg.quelle).toMatch(/V KVGG/);
    expect(CANTONAL_IPV.AG.beleg.stand).toMatch(/2026/);
    // [1] § 5 Abs. 5 definiert die Einkommensgrenze («das höchste massgebende Einkommen, bis
    // zu welchem Prämienverbilligung bezogen werden kann»), der Kanton veröffentlicht sie aber
    // nirgends als Zahl — weder im Erlass, noch im Anhang, noch bei der SVA (geprüft 20.09.2026).
    // Sie liesse sich aus der Formel ableiten (5'830 ÷ 17,5 % = 33'314 massgebendes Einkommen),
    // das wäre dann aber unsere Rechnung und keine amtliche Angabe. Darum: keine Zahl.
    expect(CANTONAL_IPV.AG.maxIncome).toBeNull();
    expect(CANTONAL_IPV.AG.subsidySingle).toBeNull();
  });

  it('AG kennt keine Prämienregionen — [2] § 4 Abs. 1 nennt einen kantonsweiten Durchschnitt', () => {
    // Es gibt genau EINEN Richtprämien-Satz, nicht drei wie in ZH/BE. Der Test hält fest,
    // dass hier bewusst keine Regionenlogik gebaut wurde: sonst käme sie beim nächsten Umbau
    // «zur Vollständigkeit» wieder herein.
    expect(Object.keys(IPV_AG.richtpraemie).sort()).toEqual(['e', 'j', 'k']);
    expect(IPV_AG.regionen).toBeUndefined();
  });
});

describe('K31 AG: massgebendes Einkommen [1] § 6 Abs. 2', () => {
  it('Alleinstehende: Abzug CHF 8 500', () => {
    expect(agMassgebendesEinkommen({ bereinigtesEinkommen: 20000 })).toBe(11500);
  });

  it.each([
    ['Alleinstehende', false, 0, ABZUG_2026.alleinstehend],
    ['Alleinstehende mit 1 Kind', false, 1, ABZUG_2026.alleinstehendMitKind + KINDERABZUG_2026],
    ['Alleinstehende mit 3 Kindern', false, 3, ABZUG_2026.alleinstehendMitKind + 3 * KINDERABZUG_2026],
    ['Ehepaar', true, 0, ABZUG_2026.ehepaar],
    ['Ehepaar mit 2 Kindern', true, 2, ABZUG_2026.ehepaarMitKind + 2 * KINDERABZUG_2026],
  ])('%s: Abzug CHF %s', (_, verheiratet, kinderZahl, abzug) => {
    expect(agMassgebendesEinkommen({ bereinigtesEinkommen: 60000, verheiratet, kinderZahl })).toBe(60000 - abzug);
  });

  it('Vermögen: ein Fünftel zählt als Einkommen', () => {
    expect(agMassgebendesEinkommen({ bereinigtesEinkommen: 20000, vermoegen: 50000 })).toBe(11500 + 10000);
    expect(agMassgebendesEinkommen({ bereinigtesEinkommen: 20000, vermoegen: 5 })).toBe(11501);
    // Kein negativer Zuschlag aus negativem Vermögen (Schulden sind hier nicht erfasst).
    expect(agMassgebendesEinkommen({ bereinigtesEinkommen: 20000, vermoegen: -50000 })).toBe(11500);
  });

  it('nie negativ: kleines Einkommen wird auf 0 gesetzt, nicht unter null', () => {
    // Sonst stiege der Anspruch über die Summe der Richtprämien hinaus — [1] § 6 Abs. 1
    // lässt nur die Differenz zu.
    expect(agMassgebendesEinkommen({ bereinigtesEinkommen: 0 })).toBe(0);
    expect(agMassgebendesEinkommen({ bereinigtesEinkommen: 3000 })).toBe(0);
    expect(agMassgebendesEinkommen({ bereinigtesEinkommen: -9000 })).toBe(0);
  });

  it('Aargauer Rechenbeispiel der SVA [4] — Struktur mit den Werten 2027 nachgerechnet', () => {
    // Die SVA zeigt das Beispiel nur mit den Werten 2027 (verheiratetes Paar, 2 Kinder, ein
    // junger Erwachsener in Ausbildung): bereinigtes Einkommen und Vermögen 45'897, Abzug
    // 8'000, Kinderabzüge total 7'500 → massgebendes Einkommen 30'397. Der Kinderabzug gilt
    // also auch für den gemeinsam eingestuften jungen Erwachsenen (3 × 2'500).
    expect(agMassgebendesEinkommen({ bereinigtesEinkommen: 45897, verheiratet: true, kinderZahl: 3 })).toBe(30397);
  });
});

describe('K31 AG: der Anspruch nach [1] § 6 Abs. 1 / § 7', () => {
  const einzel = (me, praemien) => ipvAargauRechnen({ personen: ['e'], me, praemien });

  it('Rechenbeispiel der Recherche: bereinigtes Einkommen 20 000 → CHF 3 817.50', () => {
    const me = agMassgebendesEinkommen({ bereinigtesEinkommen: 20000 });
    expect(me).toBe(11500);
    expect(einzel(me).total).toBeCloseTo(3817.5, 6);
  });

  it('Einkommen 0 → die volle Richtprämie CHF 5 830', () => {
    expect(einzel(0).total).toBe(5830);
    // Negatives massgebendes Einkommen darf die Richtprämie nicht übersteigen.
    expect(einzel(-20000).total).toBe(5830);
  });

  it('Nullpunkt: massgebendes Einkommen 5 830 ÷ 17,5 % = 33 314.29', () => {
    const null0 = RICHTPRAEMIE_2026.e / EINKOMMENSSATZ_2026;
    expect(null0).toBeCloseTo(33314.2857, 4);
    expect(einzel(null0).total).toBeCloseTo(0, 6);
    expect(einzel(null0 + 1).total).toBe(0);
    expect(einzel(null0 - 100).total).toBeCloseTo(17.5, 6);
  });

  it('Deckel [1] § 7 Abs. 3: höchstens die effektive Prämie', () => {
    // Prämie 2 400 im Jahr, rechnerischer Anspruch 5 830 → ausbezahlt werden 2 400.
    expect(einzel(0, [2400]).total).toBe(2400);
    // Prämie über dem Anspruch: der Deckel greift nicht.
    expect(einzel(0, [7000]).total).toBe(5830);
    // Ohne erfasste Prämie kein Deckel — die App zeigt dann den ungedeckelten Betrag.
    expect(einzel(0, null).total).toBe(5830);
    expect(einzel(0, [0]).total).toBe(5830);
  });

  it('Verteilung im Haushalt anteilmässig nach Richtprämien ([2] § 4 Abs. 4)', () => {
    const r = ipvAargauRechnen({ personen: ['e', 'j', 'k'], me: 0 });
    expect(r.summe).toBe(5830 + 4260 + 1380);
    expect(r.anteile).toEqual([5830, 4260, 1380]);
    // Bei halbem Anspruch halbiert sich jeder Anteil im selben Verhältnis.
    const halb = ipvAargauRechnen({ personen: ['e', 'k'], me: (5830 + 1380) / 2 / EINKOMMENSSATZ_2026 });
    expect(halb.anteile[0]).toBeCloseTo(5830 / 2, 6);
    expect(halb.anteile[1]).toBeCloseTo(1380 / 2, 6);
  });

  it('Mindestanspruch Kinder [1] § 7 Abs. 2: mindestens 50 % der effektiven Prämie', () => {
    const praemien = [6000, 1500];
    // Hohes Einkommen: der anteilige Betrag des Kindes fiele unter 750 (= 50 % von 1 500).
    const me = 30000;
    const ohneMindest = ipvAargauRechnen({ personen: ['e', 'k'], me });
    expect(ohneMindest.anteile[1]).toBeLessThan(750);
    const mit = ipvAargauRechnen({ personen: ['e', 'k'], me, praemien });
    expect(mit.anteile[1]).toBe(750);
    expect(mit.anteile[0]).toBeCloseTo(ohneMindest.anteile[0], 6);
    // Der Mindestanspruch gilt auch für junge Erwachsene in Ausbildung, nie für Erwachsene.
    // Junge erwachsene Person, massgebend 20 000: anteilig 4 260 − 3 500 = 760, Mindestbetrag
    // 50 % von 4 000 = 2 000 → 2 000.
    expect(ipvAargauRechnen({ personen: ['j'], me: 20000 }).anteile[0]).toBeCloseTo(760, 6);
    expect(ipvAargauRechnen({ personen: ['j'], me: 20000, praemien: [4000] }).anteile[0]).toBe(2000);
    // Erwachsene bekommen keinen Mindestbetrag: 5 830 − 0.175 × 30 000 = 580.
    expect(ipvAargauRechnen({ personen: ['e'], me: 30000, praemien: [6000] }).anteile[0]).toBeCloseTo(580, 6);
  });

  it('kein Anspruch → auch kein Mindestanspruch («Besteht ein Anspruch gemäss § 6 Abs. 1»)', () => {
    const r = ipvAargauRechnen({ personen: ['e', 'k'], me: 999999, praemien: [6000, 1500] });
    expect(r.haushalt).toBe(0);
    expect(r.total).toBe(0);
  });

  it('Mindestanspruch und Deckel zusammen: der Deckel gewinnt nie unter den Mindestbetrag', () => {
    // Prämie 1 500 → Mindest 750, Deckel 1 500. Der Betrag liegt immer dazwischen, solange
    // ein Anspruch besteht.
    for (const me of [0, 5000, 15000, 25000, 33000]) {
      const a = ipvAargauRechnen({ personen: ['e', 'k'], me, praemien: [6000, 1500] }).anteile[1];
      expect(a).toBeGreaterThanOrEqual(750);
      expect(a).toBeLessThanOrEqual(1500);
    }
  });
});

describe('K31 calculateIPV für AG (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvAargau.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  const person = ({ monthlyIncome = 0, children = [], dob = '1980-05-01', kkPremium, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'AG', dateOfBirth: dob, household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: '5000', city: 'Aarau' },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('Einzelperson ohne Einkommen: CHF 5 830 im Jahr, 486 im Monat', () => {
    const r = calculateIPV(person());
    expect(r).toMatchObject({
      belegt: true, eligible: true, annual: 5830, maxAnnual: 5830, reductionPercent: 100,
      jahr: 2026, basisjahr: 2023, canton: 'AG', vorbehaltKey: 'ipv.vorbehaltAG',
    });
    expect(r.amount).toBe(Math.round(5830 / 12));
  });

  it('Rechenbeispiel der Recherche durch die App: bereinigtes Einkommen 20 000 → 3 818', () => {
    // pension3a ist ein Jahresbetrag und wird nach [1] § 6 Abs. 3 lit. b aufgerechnet — damit
    // lässt sich das bereinigte Einkommen im Test exakt setzen.
    expect(calculateIPV(person({ finanzen: { pension3a: 20000 } })).annual).toBe(3818);
  });

  it('Monatseinkommen und Renten zählen mit × 12', () => {
    // 1 000/Monat = 12 000 − 8 500 = 3 500 massgebend → 5 830 − 612.50 = 5 217.50 → 5 218
    expect(calculateIPV(person({ monthlyIncome: 1000 })).annual).toBe(5218);
    // AHV-Rente 1 000/Monat wirkt identisch
    expect(calculateIPV(person({ finanzen: { ahvRente: 1000 } })).annual).toBe(5218);
  });

  it('Vermögen: ein Fünftel hebt das massgebende Einkommen', () => {
    // 50 000 Vermögen → +10 000, minus Abzug 8 500 → massgebend 1 500
    // → 5 830 − 0.175 × 1 500 = 5 567.50 → 5 568
    expect(calculateIPV(person({ finanzen: { savingsAccount: 50000 } })).annual).toBe(5568);
    // Es gibt in AG keine Vermögensgrenze — auch ein hohes Vermögen schliesst nicht aus,
    // es erhöht nur das massgebende Einkommen (hier über den Nullpunkt hinaus:
    // 250 000 ÷ 5 = 50 000 − 8 500 = 41 500 > 33 314.29).
    expect(calculateIPV(person({ finanzen: { savingsAccount: 250000 } }))).toMatchObject({
      belegt: true, eligible: false, amount: 0, noteKey: 'ipv.agKeinAnspruch',
    });
  });

  it('über dem Nullpunkt: kein Anspruch — und KEINE Einkommensgrenze als Zahl', () => {
    // 3 500/Monat = 42 000 − 8 500 = 33 500 massgebend > 33 314.29
    const r = calculateIPV(person({ monthlyIncome: 3500 }));
    expect(r).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.agKeinAnspruch' });
    // Anders als ZH/BE gibt es hier bewusst weder `ipv.incomeAboveLimit` noch einen Wert:
    // der Kanton publiziert die Grenze nicht, und eine abgeleitete Zahl wäre keine Auskunft.
    expect(r.noteParams).toEqual({});
    expect(r.cantonData.maxIncome).toBeNull();
    // knapp darunter besteht noch ein Anspruch
    expect(calculateIPV(person({ finanzen: { pension3a: 41000 } })).annual).toBe(143);
  });

  it('Prämien-Deckel [1] § 7 Abs. 3 wirkt auf Betrag UND Vergleichswert', () => {
    const r = calculateIPV(person({ kkPremium: 200 }));
    expect(r).toMatchObject({ annual: 2400, maxAnnual: 2400, amount: 200, reductionPercent: 100 });
  });

  it('Frist [1] § 10 Abs. 4: der Hinweis steht an jedem Betrag', () => {
    const r = calculateIPV(person({ monthlyIncome: 1000 }));
    expect(r.noteKey).toBe('ipv.agFristAbgelaufen');
    expect(r.noteParams).toEqual({ jahr: 2026, vorjahr: 2025, folgejahr: 2027 });
  });

  it('keine Prämienregion im Ergebnis — AG hat keine', () => {
    const r = calculateIPV(person());
    expect(r.region).toBeUndefined();
    // Die Anzeige wählt darüber zwischen `ipv.jahrRegion` und `ipv.jahrOhneRegion`.
    expect(r.jahr).toBe(2026);
  });

  it('die PLZ spielt für AG keine Rolle (kein Regionen-Modell)', () => {
    const ohne = calculateIPV({ ...person({ monthlyIncome: 1000 }), wohnen: {} });
    const mit = calculateIPV(person({ monthlyIncome: 1000 }));
    expect(ohne.annual).toBe(mit.annual);
    expect(ohne.belegt).toBe(true);
  });

  it.each([
    ['Paar', { basis: { household: { adults: 2, children: [] } } }, 'haushalt'],
    ['verheiratet ohne Partner im Haushalt', { basis: { maritalStatus: 'married' } }, 'haushalt'],
    // [1] § 9 Abs. 2: «Das Konkubinat wird bei einem gemeinsamen Haushalt angenommen» —
    // strenger als in BE, wo es ein gemeinsames Kind braucht.
    ['Konkubinat', { basis: { maritalStatus: 'cohabiting' } }, 'haushalt'],
    ['ohne Geburtsdatum', { dob: '' }, 'alter'],
    ['Jahrgang 2001 — wird 2026 erst 25, also junge erwachsene Person', { dob: '2001-06-01' }, 'alter'],
    ['junge erwachsene Person (Jahrgang 2005)', { dob: '2005-01-01' }, 'alter'],
    // Der Mindestanspruch der Kinder ist ein Anteil IHRER effektiven Prämie [1] § 7 Abs. 2 —
    // die App erfasst nur eine einzige Prämie. Eigener Grund, nicht «haushalt».
    ['Kind mit Alter', { children: [{ age: 5 }] }, 'agKinder'],
    ['Kind mit Geburtsdatum', { children: [{ birthDate: '2015-01-01' }] }, 'agKinder'],
    ['junger Erwachsener im Haushalt', { children: [{ age: 20 }] }, 'agKinder'],
  ])('%s: Orientierung statt Betrag', (_, opts, grund) => {
    const r = calculateIPV(person(opts));
    expect(r).toMatchObject({ belegt: false, eligible: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: grund });
    expect(r.cantonData).toBeUndefined();
  });

  it('Jahrgang 2000 wird 2026 sechsundzwanzig → rechnet', () => {
    expect(calculateIPV(person({ dob: '2000-12-31' })).annual).toBe(5830);
  });

  describe('Jahres-Riegel', () => {
    afterEach(() => { vi.useRealTimers(); });

    it('im Anspruchsjahr 2026 rechnet sie', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-12-31T12:00:00'));
      expect(calculateIPV(person()).annual).toBe(5830);
    });

    it('ab 2027 keine Zahl mehr — die SVA weist 6 070 / 19,25 % aus, der Erlass noch nicht', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person())).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });

    it('vor dem Anspruchsjahr läuft die Frist noch — dann der andere Satz', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2025-11-01T12:00:00'));
      expect(calculateIPV(person()).noteKey).toBe('ipv.agFristLaeuft');
    });
  });

  it('Betrag sinkt nie mit steigendem Einkommen', () => {
    let vorher = Infinity;
    for (let m = 0; m <= 6000; m += 50) {
      const r = calculateIPV(person({ monthlyIncome: m }));
      if (r.belegt === false) continue;
      expect(r.annual ?? 0).toBeLessThanOrEqual(vorher);
      vorher = r.annual ?? 0;
    }
  });

  it('negatives Einkommen sprengt die Richtprämie nicht', () => {
    const r = calculateIPV(person({ monthlyIncome: -2000 }));
    expect(r.annual).toBe(5830);
    expect(r.annual).toBeLessThanOrEqual(r.maxAnnual);
  });

  it('das Modul braucht weder PLZ-Daten noch eine Regionen-Tabelle', () => {
    // `ipvAargau` wird ohne lookupPLZ aufgerufen — ein fünftes Argument gibt es nicht.
    expect(ipvAargau.length).toBe(5);
  });
});
