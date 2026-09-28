import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_GE, ipvGeneveRechnen, geGrenzen, geTiefesRduGrenze } from '../ipvGeneve.js';
import { SAEULE_3A } from '../kantonsModell.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';

// K31 — Prämienverbilligung (subside d'assurance-maladie) Kanton Genf 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt GE:
//   [1] «BAREME SUBSIDES 2026», ge.ch/document/43271 (Date de publication 21 avril 2026)
//   [2] LaLAMal, rsGE J 3 05, Stand «Dernières modifications au 2 novembre 2024» — Art. 20–23
//   [3] RaLAMal, rsGE J 3 05.01, Stand «au 1er janvier 2025» — Art. 9, 9A, 9B, 10, 10A
//   [4] LRDU, rsGE J 4 06, Stand «au 1er janvier 2025» — Art. 5, 8, 9
//   [5] Conseil d'État, Communiqué du 5 novembre 2025, «Indexation des subsides … pour 2026»
//   [6] ge.ch «Demander un subside d'assurance-maladie 2026» mit Unterseiten (18.09.2026)
//
// Ein amtliches Rechenbeispiel mit Einkommen gibt es nicht. Prüfstein ist der GANZE Tarif [1]:
// jede Zelle unten ist aus dem PDF abgeschrieben — absichtlich nicht aus IPV_GE abgeleitet,
// damit ein Zahlendreher im Datensatz auffällt.

// [1], Zeilen «Subside mensuel adulte / jeune adulte / enfant».
const ERWACHSENE_2026 = [348, 294, 240, 196, 164, 120, 87, 55];
// [1], Haushaltstabelle: obere Grenze je Gruppe und das Haushaltstotal pro Monat.
const TARIF = [
  { name: 'Personne seule sans enfant', erw: 1, kinder: 0,
    grenzen: [30000, 35000, 37500, 40000, 42500, 45000, 47500, 50000],
    total: [348, 294, 240, 196, 164, 120, 87, 55] },
  { name: 'Couple sans enfant', erw: 2, kinder: 0,
    grenzen: [45000, 55000, 65000, 75000, 85000, 95000, 105000, 115000],
    total: [696, 588, 480, 392, 328, 240, 174, 110] },
  { name: 'Personne seule + 1 enfant', erw: 1, kinder: 1,
    grenzen: [51000, 61000, 71000, 81000, 91000, 101000, 111000, 121000, 151000],
    total: [480, 426, 372, 328, 296, 252, 219, 187, 67] },
  { name: 'Personne seule + 2 enfants', erw: 1, kinder: 2,
    grenzen: [57000, 67000, 77000, 87000, 97000, 107000, 117000, 127000, 157000],
    total: [612, 558, 504, 460, 428, 384, 351, 319, 134] },
  { name: 'Personne seule + 3 enfants', erw: 1, kinder: 3,
    grenzen: [63000, 73000, 83000, 93000, 103000, 113000, 123000, 133000, 163000],
    total: [744, 690, 636, 592, 560, 516, 483, 451, 201] },
  { name: 'Personne seule + 4 enfants', erw: 1, kinder: 4,
    grenzen: [69000, 79000, 89000, 99000, 109000, 119000, 129000, 139000, 169000],
    total: [876, 822, 768, 724, 692, 648, 615, 583, 268] },
  { name: 'Couple + 1 enfant', erw: 2, kinder: 1,
    grenzen: [51000, 61000, 71000, 81000, 91000, 101000, 111000, 121000, 151000],
    total: [828, 720, 612, 524, 460, 372, 306, 242, 67] },
  { name: 'Couple + 2 enfants', erw: 2, kinder: 2,
    grenzen: [57000, 67000, 77000, 87000, 97000, 107000, 117000, 127000, 157000],
    total: [960, 852, 744, 656, 592, 504, 438, 374, 134] },
  { name: 'Couple + 3 enfants', erw: 2, kinder: 3,
    grenzen: [63000, 73000, 83000, 93000, 103000, 113000, 123000, 133000, 163000],
    total: [1092, 984, 876, 788, 724, 636, 570, 506, 201] },
  { name: 'Couple + 4 enfants', erw: 2, kinder: 4,
    grenzen: [69000, 79000, 89000, 99000, 109000, 119000, 129000, 139000, 169000],
    total: [1224, 1116, 1008, 920, 856, 768, 702, 638, 268] },
];

describe('K31 calculateIPV für GE, bevor das GE-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'GE', dateOfBirth: '1980-05-01' }, finanzen: { monthlyIncome: 2000 }, versicherungen: { kkPremium: 450 } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 GE: die Zahlen 2026 stehen so in [1], [2], [3], [5]', () => {
  it('Monatsbeträge je Gruppe [1], bestätigt durch die Indexierung [5]', () => {
    expect(IPV_GE.jahr).toBe(2026);
    expect(IPV_GE.erwachsene).toEqual(ERWACHSENE_2026);
    expect(IPV_GE.kind).toEqual({ g1bis8: 132, g9: 67 });
    expect(IPV_GE.jungeErwachsene).toEqual({ g1bis8: 231, g9: 106 });
  });
  it('[5]: 2024er Beträge × 1,087, aufgerundet auf den Franken (Art. 9B Abs. 1 [3]) — Gegenrechnung', () => {
    const gesetz2024 = [320, 270, 220, 180, 150, 110, 80, 50]; // Art. 22 Abs. 1 [2]
    expect(gesetz2024.map((x) => Math.ceil(x * 1.087 - 1e-9))).toEqual(ERWACHSENE_2026);
  });
  it('Gruppengrenzen Art. 21 Abs. 1/2/7/8 [2]', () => {
    expect(IPV_GE.grenzen.allein).toEqual([30000, 35000, 37500, 40000, 42500, 45000, 47500, 50000]);
    expect(IPV_GE.grenzen.paar).toEqual([45000, 55000, 65000, 75000, 85000, 95000, 105000, 115000]);
    expect(IPV_GE.jeChargeLegale).toBe(6000);
    expect(IPV_GE.gruppe9).toEqual({ mitEinerCharge: 151000, jeWeitere: 6000 });
  });
  it('RDU: ein Fünfzehntel des Vermögens (Art. 8 Abs. 2 LRDU [4])', () => {
    expect(IPV_GE.vermoegenAnteil).toBe(1 / 15);
  });
  it('Gesuchsfälle: 250 000 Bruttovermögen, RDU unter 15 000 / 20 000 + 3 000 je Kind, Frist vor dem 30.11. [3]', () => {
    expect(IPV_GE.bruttoVermoegenGrenze).toBe(250000);
    expect(IPV_GE.tiefesRdu).toEqual({ allein: 15000, paar: 20000, jeCharge: 3000 });
    expect(IPV_GE.gesuchFrist).toEqual({ monat: 11, tag: 30 });
    // [6] druckt die Tabelle aus: allein 15 000, allein + 1 Kind 18 000 … + 4 Kinder 27 000,
    // Paar 20 000, Paar + 4 Kinder 32 000.
    expect([0, 1, 2, 3, 4].map((k) => geTiefesRduGrenze({ kinderZahl: k }))).toEqual([15000, 18000, 21000, 24000, 27000]);
    expect([0, 1, 2, 3, 4].map((k) => geTiefesRduGrenze({ kinderZahl: k, erwachsene: 2 }))).toEqual([20000, 23000, 26000, 29000, 32000]);
  });
  it('Basisjahr: Veranlagung von vor zwei Jahren [6]', () => {
    expect(IPV_GE.basisjahrAbstand).toBe(2);
  });
});

describe('K31 GE: der ganze Tarif [1] — jede Zelle aus Gesetz und Personenbeträgen nachgerechnet', () => {
  for (const zeile of TARIF) {
    describe(zeile.name, () => {
      it('Grenzen der Gruppen', () => {
        const { g1bis8, g9 } = geGrenzen({ kinderZahl: zeile.kinder, erwachsene: zeile.erw });
        expect([...g1bis8, ...(g9 != null ? [g9] : [])]).toEqual(zeile.grenzen);
      });
      it('Haushaltstotal je Gruppe — an der oberen Grenze UND an «x’001»', () => {
        zeile.grenzen.forEach((obere, i) => {
          const untere = i === 0 ? 0 : zeile.grenzen[i - 1] + 1;
          for (const rdu of [untere, obere]) {
            const r = ipvGeneveRechnen({ rdu, kinderZahl: zeile.kinder, erwachsene: zeile.erw });
            expect([rdu, r.gruppe, r.monat]).toEqual([rdu, i + 1, zeile.total[i]]);
          }
        });
      });
      it('ein Franken über der letzten Grenze: kein Anspruch', () => {
        const letzte = zeile.grenzen[zeile.grenzen.length - 1];
        const r = ipvGeneveRechnen({ rdu: letzte + 1, kinderZahl: zeile.kinder, erwachsene: zeile.erw });
        expect(r).toMatchObject({ gruppe: null, monat: 0, annual: 0, grenze: letzte });
      });
    });
  }

  it('«assimilée à un couple» (Art. 21 Abs. 4 [2]): allein + 1 Kind hat dieselben Grenzen wie Paar + 1 Kind', () => {
    expect(geGrenzen({ kinderZahl: 1 })).toEqual(geGrenzen({ kinderZahl: 1, erwachsene: 2 }));
  });
  it('Gruppe 9 gibt nur den Kinderbetrag, die erwachsene Person erhält nichts', () => {
    const r = ipvGeneveRechnen({ rdu: 140000, kinderZahl: 1 });
    expect(r).toMatchObject({ gruppe: 9, monat: 67, erwachseneAnnual: 0 });
  });
  it('RDU 30 000.50 liegt über 30 000 («ne dépasse pas»): Gruppe 2', () => {
    expect(ipvGeneveRechnen({ rdu: 30000.5 }).gruppe).toBe(2);
  });
  it('negatives RDU gilt als 0 (Art. 9A [3]): Gruppe 1', () => {
    expect(ipvGeneveRechnen({ rdu: -5000 })).toMatchObject({ gruppe: 1, monat: 348 });
  });
});

describe('K31 GE: Register und Säule-3a-Regel', () => {
  it('Register ohne PLZ (keine Prämienregion), Beleg, keine Musterwerte', () => {
    expect(IPV_MODULE.GE).toMatchObject({ fn: 'ipvGeneve', brauchtPLZ: false });
    expect(CANTONAL_IPV.GE.beleg.quelle).toMatch(/LaLAMal/);
    expect(CANTONAL_IPV.GE).toMatchObject({ maxIncome: null, subsidySingle: null, subsidyFamily: null, subsidyChild: null, noteKey: 'ipv.noteAutoSam' });
  });
  it('GE steht bei der Regel «voll» — mit Beleg', () => {
    expect(SAEULE_3A.voll.kantone).toMatch(/GE/);
    expect(SAEULE_3A.voll.beleg).toMatch(/LRDU/);
  });
});

describe('K31 calculateIPV für GE (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvGeneve.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, children = [], dob = '1980-05-01', kkPremium = 450, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'GE', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: '1205', city: 'Genève' },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });
  const jetzt = (iso) => { vi.useFakeTimers(); vi.setSystemTime(new Date(iso)); };

  it('RDU 30 000: Gruppe 1, 348/Monat, automatisch via SAM', () => {
    jetzt('2026-09-28T12:00:00');
    const r = calculateIPV(person({ monthlyIncome: 2500 }));
    expect(r).toMatchObject({
      belegt: true, eligible: true, amount: 348, annual: 4176, maxAnnual: 4176, gruppe: 1,
      jahr: 2026, basisjahr: 2024, vorbehaltKey: 'ipv.vorbehaltGE', jahrKey: 'ipv.jahrGE', noteKey: 'ipv.noteAutoSam',
    });
    expect(r.region).toBeUndefined();
    expect(r.anmeldefristVorbei).toBeUndefined();
    // Genf publiziert die Grenze als Zahl (Art. 21 [2]): allein 50 000.
    expect(r.cantonData.maxIncome).toBe(50000);
  });

  it('RDU 30 001: Gruppe 2 (294 × 12 = 3 528); 50 000: Gruppe 8 (660)', () => {
    expect(calculateIPV(person({ monthlyIncome: 30001 / 12 }))).toMatchObject({ gruppe: 2, annual: 3528 });
    expect(calculateIPV(person({ monthlyIncome: 50000 / 12 }))).toMatchObject({ gruppe: 8, annual: 660, amount: 55 });
  });

  it('über 50 000: kein Anspruch, mit der gesetzlichen Grenze im Satz', () => {
    const r = calculateIPV(person({ monthlyIncome: 50001 / 12 }));
    expect(r).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.geKeinAnspruch', noteParams: { grenze: '50’000' } });
  });

  it('Vermögen zählt mit einem Fünfzehntel: 24 000 + 150 000 / 15 = 34 000 → Gruppe 2', () => {
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { savingsAccount: 150000 } }))).toMatchObject({ gruppe: 2, annual: 3528 });
  });

  it('Bruttovermögen über 250 000: kein Ausschluss, aber Gesuch — keine Zahl; 250 000 rechnet', () => {
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { savingsAccount: 250001 } })))
      .toMatchObject({ belegt: false, amount: null, offen: 'geVermoegenAntrag' });
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { savingsAccount: 250000 } })).belegt).toBe(true);
  });

  it('Säule 3a: im RDU nicht abgezogen, steckt schon im Nettoeinkommen — kein Einfluss', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 2600, finanzen: { pension3a: 0 } }));
    const mit = calculateIPV(person({ monthlyIncome: 2600, finanzen: { pension3a: 7258 } }));
    expect(mit.annual).toBe(ohne.annual);
    expect(mit.gruppe).toBe(ohne.gruppe);
  });

  it('Art. 22 Abs. 4 [2]: höchstens die Prämie — ohne erfasste Prämie keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, kkPremium: 200 }))).toMatchObject({ annual: 2400, maxAnnual: 2400 });
    expect(calculateIPV(person({ monthlyIncome: 2500, kkPremium: null }))).toMatchObject({ belegt: false, amount: null, offen: 'praemie' });
  });

  it('allein mit einem Kind, 48 000: wie ein Paar gerechnet → Gruppe 1, (348 + 132) × 12 = 5 760', () => {
    const r = calculateIPV(person({ monthlyIncome: 4000, children: [{ age: 5 }] }));
    expect(r).toMatchObject({ eligible: true, gruppe: 1, annual: 5760, maxAnnual: 5760 });
    expect(r.cantonData.maxIncome).toBe(151000);
  });

  it('der Kinderanteil wird nicht an die Prämie der erwachsenen Person gedeckelt', () => {
    expect(calculateIPV(person({ monthlyIncome: 4000, children: [{ age: 5 }], kkPremium: 100 }))).toMatchObject({ annual: 1200 + 132 * 12 });
  });

  it('allein mit einem Kind, 130 000: Gruppe 9 — nur das Kind, 67 × 12 = 804', () => {
    expect(calculateIPV(person({ monthlyIncome: 130000 / 12, children: [{ age: 5 }] }))).toMatchObject({ gruppe: 9, annual: 804, amount: 67 });
    expect(calculateIPV(person({ monthlyIncome: 151001 / 12, children: [{ age: 5 }] })))
      .toMatchObject({ eligible: false, noteKey: 'ipv.geKeinAnspruch', noteParams: { grenze: '151’000' } });
  });

  describe('tiefes RDU: nicht automatisch, Gesuch vor dem 30.11. (Art. 20 Abs. 3 lit. a [2], Art. 10/10A [3])', () => {
    it('12 000 allein: Betrag Gruppe 1, aber der Hinweis «Gesuch nötig» mit Grenze und Jahr', () => {
      jetzt('2026-09-28T12:00:00');
      const r = calculateIPV(person({ monthlyIncome: 1000 }));
      expect(r).toMatchObject({ eligible: true, gruppe: 1, annual: 4176, noteKey: 'ipv.geAntragNoetig', noteParams: { grenze: '15’000', jahr: 2026 } });
      expect(r.anmeldefristVorbei).toBeUndefined();
    });
    it('15 000 genau ist NICHT darunter («inférieur à»): automatisch', () => {
      expect(calculateIPV(person({ monthlyIncome: 1250 }))).toMatchObject({ noteKey: 'ipv.noteAutoSam' });
    });
    it('mit einem Kind gilt 18 000, nicht 23 000', () => {
      expect(calculateIPV(person({ monthlyIncome: 17000 / 12, children: [{ age: 5 }] }))).toMatchObject({ noteKey: 'ipv.geAntragNoetig', noteParams: { grenze: '18’000' } });
      expect(calculateIPV(person({ monthlyIncome: 19000 / 12, children: [{ age: 5 }] }))).toMatchObject({ noteKey: 'ipv.noteAutoSam' });
    });
    it('am 29.11. läuft die Frist noch; ab dem 30.11. ist sie vorbei — dann nichts von der Prämie abziehen', () => {
      jetzt('2026-11-29T23:00:00');
      expect(calculateIPV(person({ monthlyIncome: 1000 }))).toMatchObject({ noteKey: 'ipv.geAntragNoetig' });
      jetzt('2026-11-30T00:00:01');
      expect(calculateIPV(person({ monthlyIncome: 1000 }))).toMatchObject({ noteKey: 'ipv.geAntragFristVorbei', anmeldefristVorbei: true });
      // Die Frist betrifft nur die Gesuchsfälle — der automatische Weg bleibt unberührt.
      expect(calculateIPV(person({ monthlyIncome: 2500 }))).toMatchObject({ noteKey: 'ipv.noteAutoSam' });
      expect(calculateIPV(person({ monthlyIncome: 2500 })).anmeldefristVorbei).toBeUndefined();
    });
  });

  it('Alter nach Jahrgang [1]: 2000 ist erwachsen, 2001 ist junge erwachsene Person', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 2500, dob: '2001-01-01' }))).toMatchObject({ belegt: false, offen: 'alter' });
    expect(calculateIPV(person({ monthlyIncome: 2500, dob: '' }))).toMatchObject({ belegt: false, offen: 'alter' });
  });

  it('Kinder: Jahrgang 2008 ist 2026 noch minderjährig, 2007 nicht; eingetipptes Alter 18 vorsichtig nicht', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ birthDate: '2008-12-31' }] })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ birthDate: '2007-12-31' }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ age: 18 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ age: 17 }] })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
  });

  it('Paare, eingetragene Paare, Konkubinat, zwei Erwachsene: Orientierung «haushalt»', () => {
    for (const basis of [{ maritalStatus: 'married' }, { maritalStatus: 'cohabiting' }, { household: { adults: 2, children: [] } }]) {
      expect(calculateIPV(person({ monthlyIncome: 2500, basis }))).toMatchObject({ belegt: false, amount: null, offen: 'haushalt' });
    }
  });

  it('negatives Einkommen ist ein Vertipper: keine Zahl (sonst Gruppe 1)', () => {
    expect(calculateIPV(person({ monthlyIncome: -500 }))).toMatchObject({ belegt: false, offen: 'einkommenNegativ' });
  });

  it('ab 2027 keine Zahl, bis die neuen Beträge eingearbeitet sind', () => {
    jetzt('2027-01-01T00:00:01');
    expect(calculateIPV(person({ monthlyIncome: 2500 }))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
  });
});
