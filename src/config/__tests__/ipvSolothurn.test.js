import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { IPV_SO, ipvSolothurnSpanne, soSteuerbaresVermoegen } from '../ipvSolothurn.js';
import { SAEULE_3A } from '../kantonsModell.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Solothurn 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt SO:
//   [1] DDI, «Parameter für die Prämienverbilligung 2026 — Vorgaben vom 27. Januar 2026»
//   [2] SV BGS 831.2, in Kraft seit 01.04.2026 — §§ 68–71
//   [3] SG BGS 831.1, in Kraft seit 01.09.2026 — §§ 87–91
//   [4] Botschaft SGB 0226/2025 (RRB 2025/1755): «monatlichen Durchschnittsprämien 2026»
//   [5] AKSO, Merkblatt IPV 2026
// Ein amtliches Berechnungsbeispiel gibt es nicht; die Eckpunkte der linearen Skala sind nicht
// veröffentlicht (siehe Modulkopf). Geprüft wird darum die SPANNE 10 %–16 %.

describe('K31 calculateIPV für SO, bevor das SO-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'SO', dateOfBirth: '1980-05-01' }, finanzen: { monthlyIncome: 9000 }, versicherungen: { kkPremium: 400 } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 SO: die Zahlen 2026, wörtlich aus [1]', () => {
  it('Richtprämien 422 / 305 / 98 — Monatsbeträge', () => {
    expect(IPV_SO.richtpraemieMonat).toEqual({ e: 422, j: 305, k: 98 });
  });
  // Die EINHEIT belegt der Wortlaut ([4] «monatlichen Durchschnittsprämien»), nicht diese Rechnung.
  // Plausibilitätsprobe, keine Regel: die Werte 2025 (578/424/132 → 422/310/96) lassen sich mit
  // Aufrunden und einem Satz NICHT erzeugen (Fachprüfung #481 K1) — wie gerundet wird, ist offen (Frage 2).
  it('Plausibilität [4]: 602 / 435 / 139 minus 30 % ergeben, aufgerundet, die Monatswerte 2026', () => {
    // «Der Abschlag wird auf 30% festgelegt» ([4]); 602 × 0,7 = 421.40 → 422 usw.
    expect(Math.ceil(602 * 0.7)).toBe(IPV_SO.richtpraemieMonat.e);
    expect(Math.ceil(435 * 0.7)).toBe(IPV_SO.richtpraemieMonat.j);
    expect(Math.ceil(139 * 0.7)).toBe(IPV_SO.richtpraemieMonat.k);
  });
  it('§ 71 StG [6]: Sozialabzüge vom Reinvermögen 60 000 / 100 000 (allein mit Kindern) / +20 000 je Kind', () => {
    expect(IPV_SO.sozialabzugVermoegen).toEqual({ mitKindern: 100000, uebrige: 60000, jeKind: 20000, verdoppelnBis: 200000 });
    expect(soSteuerbaresVermoegen({ savingsAccount: 45000 }, 0)).toBe(0);
    expect(soSteuerbaresVermoegen({ savingsAccount: 70000 }, 0)).toBe(10000);
    expect(soSteuerbaresVermoegen({ savingsAccount: 150000 }, 1)).toBe(30000);
    // erfasste Schulden mindern das Reinvermögen
    expect(soSteuerbaresVermoegen({ savingsAccount: 100000, loans: 30000 }, 0)).toBe(10000);
    // Abs. 2: AHV/IV-Rente und Reinvermögen bis 200 000 → verdoppelt (Untergrenze)
    expect(soSteuerbaresVermoegen({ savingsAccount: 150000, ahvRente: 1800 }, 0)).toBe(30000);
    expect(soSteuerbaresVermoegen({ savingsAccount: 250000, ahvRente: 1800 }, 0)).toBe(190000);
  });
  it('Eigenanteile 10 %–16 %, Grenzwert 74 000, Vermögensanteil 50 %, Auszahlungslimite 240', () => {
    expect(IPV_SO.eigenanteil).toEqual({ von: 0.10, bis: 0.16 });
    expect(IPV_SO.grenzwert).toBe(74000);
    expect(IPV_SO.vermoegenAnteil).toBe(0.50);
    expect(IPV_SO.auszahlungslimite).toBe(240);
    expect(IPV_SO.mindestanteilKind).toBe(0.8);
    expect(IPV_SO.jahr).toBe(2026);
  });
  it('§ 69 Abs. 1 lit. e [2]: 3a bis zum Höchstabzug BVV 3 Art. 7 Abs. 1 lit. a — Regel `bisBundesMaximum` nennt SO', () => {
    expect(SAEULE_3A.bisBundesMaximum.kantone).toMatch(/SO/);
    expect(SAEULE_3A.bisBundesMaximum.beleg).toMatch(/BGS 831\.2/);
  });
});

describe('K31 SO: die Spanne 10 %–16 % — der Betrag liegt sicher dazwischen', () => {
  it('Einkommen 0: volle Richtprämie 422 × 12 = 5 064, beide Grenzen gleich', () => {
    const r = ipvSolothurnSpanne({ personen: ['e'], me: 0 });
    expect(r.summe).toBe(5064);
    expect(r.hoechstens).toBe(5064);
    expect(r.mindestens).toBe(5064);
  });
  it('30 000: zwischen 5 064 − 4 800 = 264 und 5 064 − 3 000 = 2 064 — zu weit für eine Zahl', () => {
    const r = ipvSolothurnSpanne({ personen: ['e'], me: 30000 });
    expect(r.hoechstens).toBe(2064);
    expect(r.mindestens).toBe(264);
  });
  it('ab 50 640 ist schon mit 10 % nichts mehr übrig', () => {
    expect(ipvSolothurnSpanne({ personen: ['e'], me: 50640 }).hoechstens).toBe(0);
    expect(ipvSolothurnSpanne({ personen: ['e'], me: 50630 }).hoechstens).toBeCloseTo(1, 9);
  });
  it('über dem Grenzwert 74 000 null, auch mit Kindern', () => {
    const r = ipvSolothurnSpanne({ personen: ['e', 'k'], me: 74001 });
    expect(r.ueberGrenzwert).toBe(true);
    expect(r.hoechstens).toBe(0);
    expect(ipvSolothurnSpanne({ personen: ['e', 'k'], me: 74000 }).ueberGrenzwert).toBe(false);
  });
});

describe('K31 calculateIPV für SO (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvSolothurn.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  // Vor dem 31. Juli, damit der Grund «Frist läuft» heisst; die Frist selbst hat eigene Tests unten.
  beforeEach(() => { vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2026-06-15T12:00:00')); });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, children = [], dob = '1980-05-01', kkPremium = 400, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'SO', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: {},
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('belegt, mit Quelle; keine Musterwerte, keine Grenze; Register ohne PLZ', () => {
    expect(CANTONAL_IPV.SO.beleg.quelle).toMatch(/BGS 831\.2/);
    for (const k of ['maxIncome', 'subsidySingle', 'subsidyFamily', 'subsidyChild']) expect(CANTONAL_IPV.SO[k]).toBe(null);
    expect(IPV_MODULE.SO.brauchtPLZ).toBe(false);
  });

  it('🛑 unter 50 640: KEINE Zahl — die Skala ist nicht beziffert', () => {
    for (const monthlyIncome of [0, 1000, 2500, 4219]) {
      expect(calculateIPV(person({ monthlyIncome }))).toMatchObject({ belegt: false, amount: null, offen: 'soSkalaUnklar' });
    }
  });

  it('ohne Kinder ab 50 640: sicher kein Anspruch', () => {
    const r = calculateIPV(person({ monthlyIncome: 4220 }));
    expect(r).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.soKeinAnspruch', vorbehaltKey: 'ipv.vorbehaltSO', jahrKey: 'ipv.jahrEineRegion', jahr: 2026 });
    expect(r.cantonData.maxIncome).toBe(null);
  });

  it('50 % des STEUERBAREN Vermögens — erst über dem Sozialabzug 60 000 (§ 89 Abs. 2 SG, § 71 StG)', () => {
    // ⟨bis Fachprüfung #481 B1: 50 % der Brutto-Posten; 21 280 Erspartes gaben schon «kein Anspruch»⟩
    expect(calculateIPV(person({ monthlyIncome: 40000 / 12, finanzen: { savingsAccount: 21280 } }))).toMatchObject({ offen: 'soSkalaUnklar' });
    expect(calculateIPV(person({ monthlyIncome: 40000 / 12, finanzen: { savingsAccount: 81280 } }))).toMatchObject({ noteKey: 'ipv.soKeinAnspruch' });
    expect(calculateIPV(person({ monthlyIncome: 40000 / 12, finanzen: { savingsAccount: 81200 } }))).toMatchObject({ offen: 'soSkalaUnklar' });
  });

  describe('🛑 Fachprüfung #481 B1: die drei Fälle, in denen die App falsch «kein Anspruch» sagte', () => {
    it('Rentnerin allein, AHV 1 800 + BVG 700 im Monat, Sparkonto 45 000 → keine Aussage «kein Anspruch»', () => {
      const r = calculateIPV(person({ finanzen: { ahvRente: 1800, bvgRente: 700, savingsAccount: 45000 } }));
      expect(r).toMatchObject({ belegt: false, offen: 'soSkalaUnklar' });
    });
    it('Lohn 2 500 im Monat, Sparkonto 45 000', () => {
      expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { savingsAccount: 45000 } }))).toMatchObject({ offen: 'soSkalaUnklar' });
    });
    it('alleinerziehend, Lohn 5 000, ein Kind Jahrgang 2016, Sparkonto 30 000 → Kind unter 74 000, kein «kein Anspruch»', () => {
      expect(calculateIPV(person({ monthlyIncome: 5000, children: [{ birthDate: '2016-04-01' }], finanzen: { savingsAccount: 30000 } })))
        .toMatchObject({ offen: 'soSkalaUnklar' });
    });
  });

  it('⚠️ W1: bezahlte Unterhaltsbeiträge sind abziehbar, im App-Einkommen aber nicht abgezogen → nie «kein Anspruch»', () => {
    expect(calculateIPV(person({ monthlyIncome: 4300 }))).toMatchObject({ noteKey: 'ipv.soKeinAnspruch' });
    expect(calculateIPV(person({ monthlyIncome: 4300, finanzen: { alimentePaid: 1500 } }))).toMatchObject({ belegt: false, offen: 'soSkalaUnklar' });
  });

  describe('⚠️ W2: Selbstanmeldung bis 31. Juli (§ 75 Abs. 2 SV)', () => {
    it('bis 31.07.: der Grund nennt die Frist als laufend', () => {
      vi.setSystemTime(new Date('2026-07-31T20:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 2000 }))).toMatchObject({ offen: 'soSkalaUnklar' });
      expect(calculateIPV(person({ monthlyIncome: 8000 }))).toMatchObject({ noteKey: 'ipv.soKeinAnspruch', vorbehaltKey: 'ipv.vorbehaltSO' });
    });
    it('ab 01.08.: eigener Grund mit «Frist vorbei», Quellenbesteuerte bis 31.12.', () => {
      vi.setSystemTime(new Date('2026-08-01T08:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 2000 }))).toMatchObject({ offen: 'soSkalaUnklarFristVorbei' });
      expect(calculateIPV(person({ monthlyIncome: 8000 }))).toMatchObject({ noteKey: 'ipv.soKeinAnspruch', vorbehaltKey: 'ipv.vorbehaltSO' });
    });
  });

  it('K7: nie ein Betrag — Durchlauf über Einkommen, Kinder und Vermögen', () => {
    for (const jahresEinkommen of [0, 12000, 30000, 45000, 50640, 60000, 74000, 90000, 150000]) {
      for (const kinder of [0, 1, 3]) {
        for (const savingsAccount of [0, 50000, 200000]) {
          const r = calculateIPV(person({ monthlyIncome: jahresEinkommen / 12, children: Array.from({ length: kinder }, () => ({ age: 6 })), finanzen: { savingsAccount } }));
          expect(r.amount === null || r.amount === 0, `${jahresEinkommen}/${kinder}/${savingsAccount}`).toBe(true);
          expect(r.eligible).toBe(false);
        }
      }
    }
  });

  it('Säule 3a: bis 7 056 steckt sie im Einkommen; im Band bis 7 258 zählt die Untergrenze', () => {
    expect(calculateIPV(person({ monthlyIncome: 4220, finanzen: { pension3a: 7000 } }))).toMatchObject({ noteKey: 'ipv.soKeinAnspruch' });
    // 7 200: 144 über dem Maximum 2024 — ob abgezogen, ist offen → Untergrenze 50 496 → keine Aussage
    expect(calculateIPV(person({ monthlyIncome: 4220, finanzen: { pension3a: 7200 } }))).toMatchObject({ offen: 'soSkalaUnklar' });
    // Einzahlung höher als das ganze Einkommen: Herleitung widerlegt
    expect(calculateIPV(person({ monthlyIncome: 400, finanzen: { pension3a: 8000 } }))).toMatchObject({ offen: 'saeule3aUeberEinkommen' });
  });

  it('mit Kind: erst über dem Grenzwert 74 000 sicher kein Anspruch (Kinder 80 % bis dahin)', () => {
    expect(calculateIPV(person({ monthlyIncome: 6166, children: [{ age: 5 }] }))).toMatchObject({ offen: 'soSkalaUnklar' });
    expect(calculateIPV(person({ monthlyIncome: 74012 / 12, children: [{ age: 5 }] }))).toMatchObject({ belegt: true, eligible: false, noteKey: 'ipv.soKeinAnspruch' });
  });

  it('Alter nach Jahrgang [5]: 2000 ist erwachsen, 2001 nicht; Kinder bis 18', () => {
    expect(calculateIPV(person({ monthlyIncome: 8000, dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 8000, dob: '2001-01-01' }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ monthlyIncome: 8000, children: [{ age: 18 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: 8000, children: [{ age: 17 }] })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 8000, children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
  });

  it('Paare, Konkubinat, negatives Einkommen: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ monthlyIncome: 8000, basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: 8000, basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ monthlyIncome: -100 }))).toMatchObject({ offen: 'einkommenNegativ' });
  });

  it('ab 2027 keine Zahl mehr', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
    expect(calculateIPV(person({ monthlyIncome: 8000 }))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
  });
});
