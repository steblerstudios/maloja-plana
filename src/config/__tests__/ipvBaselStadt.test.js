import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import {
  IPV_BS, BS_HYPOTHETISCH_SCHWELLE, bsGrenzen, bsGruppe, bsVermoegensanteil, ipvBaselStadtRechnen,
  bsWochenstunden, bsHypothetischesEinkommen, bsModell, bsPensumStunden,
} from '../ipvBaselStadt.js';
import { SAEULE_3A } from '../kantonsModell.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Basel-Stadt 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt BS:
//   [1] KVO (SG 834.410), Version 6727, in Kraft 01.01.–31.12.2026 — §§ 15, 21, 22 und Anhang 2
//       «in der Fassung vom 21. Oktober 2025»
//   [2] SoHaG (SG 890.700), Version 6622 — §§ 5–7
//   [3] SoHaV (SG 890.710), Version 5476 — §§ 11, 16–29
//   [4] ASB, «Einkommensgruppen, -grenzen und IPV-Beiträge ab 1. Januar 2026» mit Berechnungsbeispiel
//   [5] ASB, Merkblatt Prämienverbilligung (Ausgabe 01.2026)

// T 1–T 4 aus [1] Anhang 2, von Hand abgeschrieben — absichtlich NICHT aus IPV_BS abgeleitet,
// damit ein Zahlendreher im Datensatz auffällt.
const T1_1P = [23125, 24375, 25625, 26875, 28125, 29375, 30625, 31875, 33125, 34375, 35625,
  36875, 38125, 39375, 40625, 41875, 43125, 44375, 45625, 46875, 48125, 49375];
const T1_8P = [73000, 75000, 77000, 79000, 81000, 83000, 85000, 87000, 89000, 91000, 93000,
  95000, 97000, 99000, 101000, 103000, 105000, 107000, 109000, 111000, 113000, 115000];
const T3_ERW = [444, 415, 385, 352, 325, 296, 266, 237, 210, 179, 148, 118, 91, 61, 43, 37, 33, 30, 26, 23, 20, 17];
const T3_JE = [329, 308, 289, 266, 247, 232, ...Array(16).fill(229)];
const T3_KIND = [157, 146, 137, 129, ...Array(18).fill(124)];
const T4_ERW = [474, 445, 415, 382, 355, 326, 296, 267, 240, 209, 178, 148, 121, 91, 73, 67, 63, 60, 56, 53, 50, 26];
const T4_JE = [335, 314, 295, 272, 253, 238, ...Array(15).fill(235), 229];
const T4_KIND = [163, 152, 143, 135, ...Array(17).fill(130), 124];

describe('K31 calculateIPV für BS, bevor das BS-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'BS', dateOfBirth: '1980-05-01' }, finanzen: { monthlyIncome: 3000 }, versicherungen: { kkPremium: 500 } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 BS: das amtliche Berechnungsbeispiel [4] — jede Zahl', () => {
  // «Haushalt: 2 Erwachsene, 1 junge erwachsene Person* und 1 Kind … 4-Personenhaushalt ·
  // Massgebliches Einkommen: 62'000.- · Einkommensgruppe: 5 · Monatlicher Beitrag ohne AVM:
  // 2 erwachsene Personen: 2 x 325.-, junge erwachsene Person: 247.-, Kind: 124.- · Monatlicher
  // Beitrag mit AVM: 2 erwachsene Personen: 2 x 355.-, junge erwachsene Person: 253.-, Kind: 130.-»
  const r = ipvBaselStadtRechnen({ personen: ['e', 'e', 'j', 'k'], me: 62000 });
  it('4-Personenhaushalt, 62 000 → Einkommensgruppe 5', () => {
    expect(bsGruppe(62000, 4) + 1).toBe(5);
    expect(r.gruppe + 1).toBe(5);
  });
  it('ohne AVM: 2 × 325 + 247 + 124 = 1 021 im Monat', () => {
    expect(IPV_BS.standard.erwachsene[4]).toBe(325);
    expect(IPV_BS.standard.jungeErwachsene[4]).toBe(247);
    expect(IPV_BS.standard.kinder[4]).toBe(124);
    expect(r.monat).toBe(2 * 325 + 247 + 124);
    expect(r.annual).toBe(1021 * 12);
    expect(r.erwachseneAnnual).toBe(2 * 325 * 12);
  });
  it('mit AVM: 2 × 355 + 253 + 130 = 1 093 im Monat', () => {
    expect(r.monatAlternativ).toBe(2 * 355 + 253 + 130);
  });
  it('die Leistungsgrenze dieses Haushalts ist 97 000 (T 1, Gruppe 22, 4 PH)', () => {
    expect(r.grenze).toBe(97000);
  });
});

describe('K31 BS: T 1 Leistungsgrenzen [1] Anhang 2, wörtlich', () => {
  it('Spalte 1 PH und 8 PH, alle 22 Gruppen', () => {
    expect(IPV_BS.grenzen.map((z) => z[0])).toEqual(T1_1P);
    expect(IPV_BS.grenzen.map((z) => z[7])).toEqual(T1_8P);
    expect(IPV_BS.grenzen).toHaveLength(22);
  });
  it('Gruppe 01 und 22 über alle Haushaltsgrössen', () => {
    expect(IPV_BS.grenzen[0]).toEqual([23125, 37000, 47000, 55000, 61000, 65000, 69000, 73000]);
    expect(IPV_BS.grenzen[21]).toEqual([49375, 79000, 89000, 97000, 103000, 107000, 111000, 115000]);
    // [1] druckt hier «85.000» (Punkt statt Apostroph) — gemeint ist 85 000.
    expect(IPV_BS.grenzen[15][3]).toBe(85000);
  });
  it('🛑 die Tabelle folgt dem Aufbau von SoHaV § 11 Abs. 2 [3] — in jeder Gruppe', () => {
    // «Leistungsgrenze eines Zweipersonenhaushalts 160 Prozent eines Einpersonenhaushalts …
    // dritte Person um CHF 10'000, … vierte Person um CHF 8'000, … fünfte Person um CHF 6'000
    // und für jede weitere Person um CHF 4'000»
    for (const z of IPV_BS.grenzen) {
      expect(z[1]).toBe(1.6 * z[0]);
      expect(z[2] - z[1]).toBe(10000);
      expect(z[3] - z[2]).toBe(8000);
      expect(z[4] - z[3]).toBe(6000);
      expect(z[5] - z[4]).toBe(4000);
      expect(z[6] - z[5]).toBe(4000);
      expect(z[7] - z[6]).toBe(4000);
    }
  });
  it('ab neun Personen + 4 000 je Person auf jede Grenze (§ 22 Abs. 1 [1])', () => {
    expect(IPV_BS.jeWeiterePerson).toBe(4000);
    expect(bsGrenzen(9)).toEqual(T1_8P.map((g) => g + 4000));
    expect(bsGrenzen(10)[21]).toBe(115000 + 8000);
  });
  it('die Grenze gehört zur Gruppe («nicht übersteigt», § 22 Abs. 1) — gewählt für alle Gruppen', () => {
    expect(bsGruppe(0, 1)).toBe(0);
    expect(bsGruppe(23125, 1)).toBe(0);
    expect(bsGruppe(23126, 1)).toBe(1);
    expect(bsGruppe(49375, 1)).toBe(21);
    expect(bsGruppe(49376, 1)).toBe(null);
    expect(bsGruppe(-5000, 1)).toBe(0);
  });
});

describe('K31 BS: T 3 / T 4 Beiträge je Monat [1] Anhang 2, wörtlich', () => {
  it('ohne besondere Versicherungsform (T 3)', () => {
    expect(IPV_BS.standard.erwachsene).toEqual(T3_ERW);
    expect(IPV_BS.standard.jungeErwachsene).toEqual(T3_JE);
    expect(IPV_BS.standard.kinder).toEqual(T3_KIND);
  });
  it('in einer besonderen Versicherungsform (T 4)', () => {
    expect(IPV_BS.alternativ.erwachsene).toEqual(T4_ERW);
    expect(IPV_BS.alternativ.jungeErwachsene).toEqual(T4_JE);
    expect(IPV_BS.alternativ.kinder).toEqual(T4_KIND);
  });
  it('🛑 Gruppe 09, Erwachsene mit AVM: 240 nach der Verordnung, nicht 230 wie in der ASB-Tabelle', () => {
    expect(IPV_BS.alternativ.erwachsene[8]).toBe(240);
    // 240 ist auch der Abstand, den alle Gruppen 01–21 haben: + 30 Franken.
    for (let i = 0; i < 21; i++) expect(IPV_BS.alternativ.erwachsene[i] - IPV_BS.standard.erwachsene[i]).toBe(30);
  });
  it('Einkommen 0 = Gruppe 01 = höchster Beitrag', () => {
    const r = ipvBaselStadtRechnen({ personen: ['e'], me: 0 });
    expect(r).toMatchObject({ gruppe: 0, monat: 444, monatAlternativ: 474, annual: 5328, maximal: 5328 });
  });
  it('über der Leistungsgrenze: kein Beitrag, die Anteile ausdrücklich 0', () => {
    const r = ipvBaselStadtRechnen({ personen: ['e', 'k'], me: 79001 });
    expect(r).toMatchObject({ gruppe: null, grenze: 79000, monat: 0, annual: 0, erwachseneAnnual: 0 });
  });
  it('kein Mindestbetrag: Gruppe 22 zahlt noch 17 im Monat', () => {
    expect(ipvBaselStadtRechnen({ personen: ['e'], me: 49375 }).monat).toBe(17);
  });
});

describe('K31 BS: Vermögensanteil SoHaV § 28 [3]', () => {
  it('Freibeträge 37 500 / 60 000 / 15 000 je Kind, ein Zehntel darüber', () => {
    expect(IPV_BS.vermoegen).toEqual({ alleinstehend: 37500, paar: 60000, jeKind: 15000, anteil: 0.1 });
    expect(bsVermoegensanteil(37500, 0)).toBe(0);
    expect(bsVermoegensanteil(47500, 0)).toBe(1000);
    expect(bsVermoegensanteil(62500, 1)).toBe(1000);
    expect(bsVermoegensanteil(-10000, 0)).toBe(0);
  });
});

describe('K31 BS: hypothetisches Einkommen SoHaV §§ 22–25 [3]', () => {
  it('36 000 netto = 100 %, Alleinstehende mindestens 80 % ⇒ Schwelle 28 800', () => {
    expect(IPV_BS.hypothetisch).toEqual({ vollzeitNetto: 36000, mindestgrad: 0.8 });
    expect(BS_HYPOTHETISCH_SCHWELLE).toBe(28800);
    expect(IPV_BS.rechtfertigungAlter).toBe(60);
    expect(IPV_BS.betreuungBisAlter).toBe(16);
  });
});

describe('K31 BS: die Säule-3a-Regel SAEULE_3A.abzugOhneSaeule2 (SoHaV § 17 Abs. 1 [3])', () => {
  const r = SAEULE_3A.abzugOhneSaeule2;
  it('benannt und belegt', () => {
    expect(r.name).toBe('abzugOhneSaeule2');
    expect(r.kantone).toBe('BS');
    expect(r.beleg).toMatch(/SoHaV BS § 17 Abs\. 1/);
  });
  it('mit zweiter Säule kein Abzug, ohne zweite Säule die ganze Einzahlung', () => {
    expect(r.nichtAufgerechnet({ pension3a: 7258 })).toBe(0);
    expect(r.ohneSaeule2({ pension3a: 7258 })).toBe(7258);
    expect(r.ohneSaeule2({ pension3a: 'abc' })).toBe(0);
    expect(r.ohneSaeule2({})).toBe(0);
  });
});

describe('K31 calculateIPV für BS (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvBaselStadt.js');
    await new Promise((res) => setTimeout(res, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 3000, children = [], dob = '1980-05-01', kkPremium = 500, finanzen = {}, basis = {}, versicherungen = {}, stunden } = {}) => ({
    basis: { canton: 'BS', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: '4051', city: 'Basel' },
    versicherungen: { ...(kkPremium != null ? { kkPremium } : {}), ...versicherungen },
    ...(stunden !== undefined ? { ausbildung: { workHoursPerWeek: stunden } } : {}),
  });

  it('im Register, ohne PLZ-Abhängigkeit (keine Prämienregion)', () => {
    expect(IPV_MODULE.BS.fn).toBe('ipvBaselStadt');
    expect(IPV_MODULE.BS.brauchtPLZ).toBe(false);
  });

  it('belegt, mit Quelle; keine Musterwerte; Weg = Antrag beim ASB', () => {
    expect(CANTONAL_IPV.BS.beleg.quelle).toMatch(/KVO BS \(SG 834\.410\)/);
    expect(CANTONAL_IPV.BS.beleg.stand).toMatch(/2026-09-28/);
    expect(CANTONAL_IPV.BS).toMatchObject({ maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, noteKey: 'ipv.noteApplyAsb' });
  });

  it('Einzelperson, 3 000 im Monat = 36 000 → Gruppe 12 (35 625 < 36 000 ≤ 36 875): 118 im Monat', () => {
    const r = calculateIPV(person());
    expect(r).toMatchObject({
      belegt: true, eligible: true, amount: 118, annual: 1416, gruppe: 12, jahr: 2026,
      vorbehaltKey: 'ipv.vorbehaltBS', jahrKey: 'ipv.jahrBS', noteKey: 'ipv.bsAntrag',
      noteParams: { monat: 118, monatAlternativ: 148 },
    });
    expect(r.cantonData.maxIncome).toBe(49375);
    expect(r.maxAnnual).toBe(444 * 12);
  });

  it('mit 13. Monatslohn zählt der Hauptlohn × 13 (39 000 → Gruppe 14, 61 im Monat)', () => {
    expect(calculateIPV(person({ finanzen: { dreizehnter: 'ja' } }))).toMatchObject({ amount: 61, gruppe: 14 });
  });

  it('mit Kind (5 Jahre): 2-Personen-Haushalt, 48 000 → Gruppe 07 (47 000 < 48 000 ≤ 49 000)', () => {
    const r = calculateIPV(person({ monthlyIncome: 4000, children: [{ age: 5 }] }));
    expect(r).toMatchObject({ eligible: true, gruppe: 7, amount: 266 + 124 });
    expect(r.cantonData.maxIncome).toBe(79000);
  });

  it('der Vermögensanteil zählt zum Einkommen: 57 500 Vermögen → + 2 000', () => {
    // 36 000 + 0,1 × (57 500 − 37 500) = 38 000 → Gruppe 13 (36 875 < 38 000 ≤ 38 125) → 91
    expect(calculateIPV(person({ finanzen: { savingsAccount: 57500 } }))).toMatchObject({ amount: 91, gruppe: 13 });
  });

  it('keine Vermögensgrenze: auch 1 Million ergibt eine Rechnung, hier über der Leistungsgrenze', () => {
    const r = calculateIPV(person({ finanzen: { savingsAccount: 1000000 } }));
    expect(r).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.bsKeinAnspruch' });
    expect(r.noteParams.grenze).toMatch(/^49.375$/);
  });

  it('über der Leistungsgrenze: kein Anspruch, mit der amtlichen Grenze', () => {
    // Ganze Franken im Monat, damit × 12 exakt bleibt (die Grenze selbst prüft bsGruppe oben).
    const r = calculateIPV(person({ monthlyIncome: 4115 })); // 49 380
    expect(r).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.bsKeinAnspruch' });
    expect(calculateIPV(person({ monthlyIncome: 4114 }))).toMatchObject({ eligible: true, amount: 17, gruppe: 22 }); // 49 368
  });

  it('KVO § 22 Abs. 2: höchstens die geschuldete Prämie — ohne erfasste Prämie keine Zahl', () => {
    expect(calculateIPV(person({ kkPremium: 100 }))).toMatchObject({ annual: 1200, maxAnnual: 1200 });
    expect(calculateIPV(person({ kkPremium: null }))).toMatchObject({ belegt: false, amount: null, offen: 'praemie' });
  });

  it('der Kinderanteil bleibt ungedeckelt, nur der Anteil der erwachsenen Person wird begrenzt', () => {
    // 48 000, ein Kind → Gruppe 07: 266 + 124; Prämie 100 → 100 + 124
    const r = calculateIPV(person({ monthlyIncome: 4000, children: [{ age: 5 }], kkPremium: 100 }));
    expect(r.annual).toBe((100 + 124) * 12);
  });

  describe('🛑 hypothetisches Einkommen: unter 28 800 Erwerb keine Zahl, ausser eine Ausnahme ist sicher', () => {
    it('10 000 im Jahr, allein, 45 Jahre: keine Zahl statt Gruppe 01', () => {
      expect(calculateIPV(person({ monthlyIncome: 10000 / 12 }))).toMatchObject({ belegt: false, amount: null, offen: 'bsHypothetisch' });
    });
    it('knapp darunter und genau darauf', () => {
      expect(calculateIPV(person({ monthlyIncome: 28799 / 12 }))).toMatchObject({ offen: 'bsHypothetisch' });
      // 28 800 → Gruppe 06 (28 125 < 28 800 ≤ 29 375)
      expect(calculateIPV(person({ monthlyIncome: 2400 }))).toMatchObject({ belegt: true, gruppe: 6 });
    });
    it('Nebenerwerb zählt mit, Renten nicht', () => {
      expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { sideIncome: 400 } }))).toMatchObject({ belegt: true });
      expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { ahvRente: 400 } }))).toMatchObject({ offen: 'bsHypothetisch' });
    });
    it('über 60 (am Ende des Vorjahres mindestens 61): gerechnet', () => {
      expect(calculateIPV(person({ monthlyIncome: 0, dob: '1964-06-01', finanzen: { ahvRente: 1500 } }))).toMatchObject({ belegt: true, gruppe: 1 });
      expect(calculateIPV(person({ monthlyIncome: 0, dob: '1965-06-01', finanzen: { ahvRente: 1500 } }))).toMatchObject({ offen: 'bsHypothetisch' });
    });
    it('ein Kind, das im ganzen Jahr unter 16 ist: gerechnet — 16 nicht mehr sicher', () => {
      expect(calculateIPV(person({ monthlyIncome: 1000, children: [{ age: 14 }] }))).toMatchObject({ belegt: true, gruppe: 1, amount: 444 + 157 });
      expect(calculateIPV(person({ monthlyIncome: 1000, children: [{ age: 15 }] }))).toMatchObject({ offen: 'bsHypothetisch' });
      expect(calculateIPV(person({ monthlyIncome: 1000, children: [{ birthDate: '2011-01-01' }] }))).toMatchObject({ belegt: true });
      expect(calculateIPV(person({ monthlyIncome: 1000, children: [{ birthDate: '2010-12-31' }] }))).toMatchObject({ offen: 'bsHypothetisch' });
    });
  });

  describe('Säule 3a: nur ohne zweite Säule abgezogen', () => {
    it('ohne 3a: kein Einfluss', () => {
      expect(calculateIPV(person({ finanzen: { pension3a: 0 } }))).toMatchObject({ amount: 118 });
    });
    it('3a verschiebt die Gruppe (36 000 − 7 258 = 28 742 → Gruppe 06 statt 12), zweite Säule unbekannt: keine Zahl', () => {
      expect(calculateIPV(person({ finanzen: { pension3a: 7258 } }))).toMatchObject({ belegt: false, offen: 'bsSaeule3a' });
    });
    it('Pensionskassenbeitrag erfasst: die 3a bleibt im Einkommen, Betrag wie ohne 3a', () => {
      expect(calculateIPV(person({ finanzen: { pension3a: 7258 }, versicherungen: { bvgContribution: 300 } }))).toMatchObject({ amount: 118, gruppe: 12 });
    });
    it('3a zu klein, um die Gruppe zu wechseln: gerechnet', () => {
      // 36 000 − 500 = 35 500 läge in Gruppe 11 (≠ 12), darum 36 500 als Basis:
      // 36 500 und 36 500 − 500 = 36 000 liegen beide in Gruppe 12 (35 625 < … ≤ 36 875).
      expect(calculateIPV(person({ monthlyIncome: 36500 / 12, finanzen: { pension3a: 500 } }))).toMatchObject({ belegt: true, gruppe: 12 });
    });
    it('über der Grenze mit 3a, darunter ohne: keine Zahl statt «kein Anspruch»', () => {
      expect(calculateIPV(person({ monthlyIncome: 50000 / 12, finanzen: { pension3a: 7258 } }))).toMatchObject({ belegt: false, offen: 'bsSaeule3a' });
    });
  });

  it('Kinder über 18, Kinder ohne Alter, Paare, Konkubinat: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ children: [{ age: 19 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 18 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 17 }] })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { household: { adults: 2, children: [] } } }))).toMatchObject({ offen: 'haushalt' });
  });

  it('Alter: erwachsen erst, wenn am Ende des Vorjahres 26 (gewählt, wie BE und SG)', () => {
    expect(calculateIPV(person({ dob: '1999-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ dob: '2000-01-01' }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ dob: '' }))).toMatchObject({ offen: 'alter' });
  });

  it('negatives Einkommen: keine Zahl statt Gruppe 01', () => {
    expect(calculateIPV(person({ monthlyIncome: -3000 }))).toMatchObject({ offen: 'einkommenNegativ' });
  });

  it('neun Personen: die Grenze der 8-Personen-Spalte + 4 000', () => {
    const kinder = Array.from({ length: 8 }, () => ({ age: 5 }));
    const r = calculateIPV(person({ monthlyIncome: 9000, children: kinder, finanzen: { savingsAccount: 0 } }));
    // 108 000 im Jahr. 9-P-Grenzen = 8-P-Spalte + 4 000: Gruppe 16 = 107 000, Gruppe 17 = 109 000
    // → 108 000 in Gruppe 17. Leistungsgrenze 115 000 + 4 000 = 119 000.
    expect(r).toMatchObject({ eligible: true, gruppe: 17 });
    expect(r.cantonData.maxIncome).toBe(119000);
  });

  describe('🛑 Fachprüfung B1: Alimente und Familienzulagen (SoHaV § 16 Abs. 1 lit. c Ziff. 3/6, § 17 Abs. 1 lit. c)', () => {
    it('alleinerziehend, Kind 8, 3 000 + 800 Alimente erhalten = 45 600 → 2 PH Gruppe 06 → 296 + 124 = 420 (vorher 601)', () => {
      const r = calculateIPV(person({ children: [{ birthDate: '2018-03-01' }], finanzen: { alimenteReceived: 800 } }));
      expect(r).toMatchObject({ eligible: true, gruppe: 6, amount: 420 });
    });
    it('dazu 215 Familienzulagen ausserhalb des Lohns = 48 180 → Gruppe 07 → 266 + 124 = 390', () => {
      const r = calculateIPV(person({ children: [{ birthDate: '2018-03-01' }], finanzen: { alimenteReceived: 800, familienzulagen: 215 } }));
      expect(r).toMatchObject({ gruppe: 7, amount: 390 });
    });
    it('allein, 2 500 − 1 000 Alimente bezahlt = 18 000 → Gruppe 01 → 444 (vorher 266)', () => {
      expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { alimentePaid: 1000 } }))).toMatchObject({ gruppe: 1, amount: 444 });
    });
    it('unlesbar oder negativ zählt nicht', () => {
      expect(calculateIPV(person({ finanzen: { alimenteReceived: 'abc', familienzulagen: -200, alimentePaid: 'x' } }))).toMatchObject({ amount: 118, gruppe: 12 });
    });
  });

  describe('🛑 Fachprüfung B2: hypothetisches Einkommen am Pensum (SoHaV § 24 Abs. 2)', () => {
    it('die Hilfen: Stunden lesen, Pensum ÷ 42 (gewählt), Differenz zu 80 % × 36 000', () => {
      expect(IPV_BS.vollzeitStunden).toBe(42);
      expect(bsWochenstunden('21,5')).toBe(21.5);
      expect(bsWochenstunden('0')).toBe(null);
      expect(bsWochenstunden('100')).toBe(null);
      expect(bsWochenstunden('')).toBe(null);
      expect(bsHypothetischesEinkommen(21)).toBeCloseTo(10800, 9);
      expect(bsHypothetischesEinkommen(42)).toBe(0);
      expect(bsHypothetischesEinkommen(33.6)).toBeCloseTo(0, 9);
    });
    it('21 Std./Woche, 30 000: + 10 800 → 40 800 → Gruppe 16 → 37 (vorher 266), mit Hinweis', () => {
      const r = calculateIPV(person({ monthlyIncome: 2500, stunden: '21' }));
      expect(r).toMatchObject({ eligible: true, gruppe: 16, amount: 37, zusatzVorbehaltKey: 'ipv.bsHypothetischGerechnet' });
    });
    it('Vollzeit (42 Std.) mit tiefem Lohn: keine Anrechnung, auch unter 28 800 eine Zahl', () => {
      // 24 000 → Gruppe 02 (23 125 < 24 000 ≤ 24 375) → 415
      const r = calculateIPV(person({ monthlyIncome: 2000, stunden: '42' }));
      expect(r).toMatchObject({ eligible: true, gruppe: 2, amount: 415 });
      expect(r.zusatzVorbehaltKey).toBeUndefined();
    });
    it('34 Std. (über 80 %): keine Anrechnung', () => {
      expect(calculateIPV(person({ monthlyIncome: 2500, stunden: '34' }))).toMatchObject({ gruppe: 7, amount: 266 });
    });
    it('ohne Stunden: über 28 800 gerechnet wie bei 80 % — und der Hinweis sagt es bei der Zahl (W1)', () => {
      expect(calculateIPV(person())).toMatchObject({ amount: 118, zusatzVorbehaltKey: 'ipv.bsPensumAngenommen' });
    });
    it('Ausnahme Kind unter 16: keine Anrechnung trotz 10 Std.', () => {
      const r = calculateIPV(person({ monthlyIncome: 2500, stunden: '10', children: [{ birthDate: '2018-03-01' }] }));
      expect(r).toMatchObject({ eligible: true, gruppe: 1 });
      expect(r.zusatzVorbehaltKey).toBeUndefined();
    });
    it('Selbständige: Stunden zählen nicht, unter 28 800 keine Zahl (§ 23 Abs. 1 lit. d unbekannt)', () => {
      expect(calculateIPV(person({ monthlyIncome: 2000, stunden: '42', finanzen: { employmentType: 'selfEmployed' } }))).toMatchObject({ offen: 'bsHypothetisch' });
    });
  });

  describe('🛑 Re-Review #473 N1: Pensum aus Haupt- UND Nebenerwerb', () => {
    it('bsPensumStunden: Stunden zusammenzählen; Nebenerwerb ohne Stunden → unbekannt', () => {
      expect(bsPensumStunden({ workHoursPerWeek: '20' }, { monthlyIncome: 1800, sideIncome: 900, sideHoursPerWeek: '15' })).toBe(35);
      expect(bsPensumStunden({ workHoursPerWeek: '20' }, { monthlyIncome: 1800, sideIncome: 900 })).toBe(null);
      expect(bsPensumStunden({ workHoursPerWeek: '20' }, { monthlyIncome: 1800, sideIncome: 0, sideHoursPerWeek: '15' })).toBe(20);
      expect(bsPensumStunden({}, { monthlyIncome: 1800, sideIncome: 900, sideHoursPerWeek: '15' })).toBe(null);
      expect(bsPensumStunden({}, { monthlyIncome: 0, sideIncome: 900, sideHoursPerWeek: '15' })).toBe(15);
      expect(bsPensumStunden({}, {})).toBe(null);
    });
    it('20 Std. Haupt- + 15 Std. Nebenerwerb = 35 Std. (83 %): keine Anrechnung → 210 statt der Rechnung mit 20 Std.', () => {
      // 1 800 + 900 = 2 700/Monat = 32 400 → Gruppe 09 → 210. Nur mit den 20 Std. des Haupterwerbs
      // kämen (80 % − 20/42) × 36 000 = 11 657 dazu.
      const r = calculateIPV(person({ monthlyIncome: 1800, stunden: '20', finanzen: { sideIncome: 900, sideHoursPerWeek: '15' } }));
      expect(r).toMatchObject({ eligible: true, gruppe: 9, amount: 210 });
      expect(r.zusatzVorbehaltKey).toBeUndefined();
      const vorher = calculateIPV(person({ monthlyIncome: 2700, stunden: '20' }));
      expect(vorher.zusatzVorbehaltKey).toBe('ipv.bsHypothetischGerechnet');
      expect(vorher.amount).toBeLessThan(r.amount);
    });
    it('Nebenerwerb ohne Stunden: Pensum unbekannt → Schwelle 28 800 (darüber mit Hinweis, darunter keine Zahl)', () => {
      expect(calculateIPV(person({ monthlyIncome: 1800, stunden: '20', finanzen: { sideIncome: 900 } }))).toMatchObject({ amount: 210, zusatzVorbehaltKey: 'ipv.bsPensumAngenommen' });
      expect(calculateIPV(person({ monthlyIncome: 1500, stunden: '20', finanzen: { sideIncome: 800 } }))).toMatchObject({ offen: 'bsHypothetisch' });
    });
  });

  describe('⚠️ Fachprüfung W4: Zuschlag für alternative Modelle nach dem erfassten Modell', () => {
    it('bsModell: Hausarzt/HMO/Telmed/Apotheke alternativ, Standard standard, Basic/Comfort/leer offen', () => {
      expect(['hausarzt', 'hmo', 'telmed', 'apotheke'].map(bsModell)).toEqual(Array(4).fill('alternativ'));
      expect(bsModell('Standard')).toBe('standard');
      expect(bsModell('standard')).toBe('standard');
      expect(bsModell('Basic')).toBe(null);
      expect(bsModell('comfort')).toBe(null);
      expect(bsModell('')).toBe(null);
    });
    it('Hausarzt: Hauptzahl aus T 4 (Gruppe 12: 148), eigener Hinweis', () => {
      const r = calculateIPV(person({ versicherungen: { kkModel: 'hausarzt' } }));
      expect(r).toMatchObject({ amount: 148, annual: 148 * 12, maxAnnual: 474 * 12, noteKey: 'ipv.bsAntragAvm', noteParams: { monat: 118, monatAlternativ: 148 } });
    });
    it('Standard: Hauptzahl aus T 3 (118), ohne Zuschlag-Satz', () => {
      expect(calculateIPV(person({ versicherungen: { kkModel: 'Standard' } }))).toMatchObject({ amount: 118, noteKey: 'ipv.bsAntragStandard' });
    });
    it('Basic (mehrdeutig): wie bisher T 3 und beide Zahlen im Hinweis', () => {
      expect(calculateIPV(person({ versicherungen: { kkModel: 'basic' } }))).toMatchObject({ amount: 118, noteKey: 'ipv.bsAntrag' });
    });
    it('💡 K1: auch der Betrag mit Zuschlag ist auf die Prämie gedeckelt', () => {
      expect(calculateIPV(person({ kkPremium: 100 }))).toMatchObject({ noteParams: { monat: 100, monatAlternativ: 100 } });
      expect(calculateIPV(person({ kkPremium: 100, versicherungen: { kkModel: 'hmo' } }))).toMatchObject({ amount: 100, annual: 1200 });
    });
  });

  describe('Jahres-Riegel', () => {
    it('ab 2027 keine Zahl mehr, bis die Werte nachgeführt sind', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person())).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
    it('am 31.12.2026 noch gerechnet', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-12-31T12:00:00'));
      expect(calculateIPV(person()).belegt).toBe(true);
    });
  });
});
