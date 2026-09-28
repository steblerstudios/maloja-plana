import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_UR, ipvUriRechnen, urMonatGerundet } from '../ipvUri.js';
import { KEIN_PRAEMIENDECKEL, SAEULE_3A } from '../kantonsModell.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Uri 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt UR:
//   [1] Prämienverbilligungsreglement RB 20.2213, in Kraft seit 01.11.2024
//   [2] Medienmitteilung GSUD Uri 18.12.2025, «Urner Steuerungsgrössen … 2026»
//   [3] SVS Uri, Berechnungsformular 2026 (xlsx) — leeres Rechenblatt mit Formeln, kein Beispiel
//   [4] Steuergesetz Uri RB 3.2211, Art. 55/56 (Fassung 2025)
//   [5] SVS Uri, Antragsformular 2026 und Webseite

// Werte 2026 wörtlich abgeschrieben — absichtlich nicht aus IPV_UR abgeleitet, damit ein stiller
// Zahlendreher im Datensatz auffällt.
const RICHTPRAEMIE_2026 = { e: 4368, j: 2844, k: 1104 }; // [2], [3] I39–I42
const SELBSTBEHALT_2026 = 0.085; // [2] «8,5 Prozent», [3] I46
const VERMOEGENSANTEIL = 0.15; // [2] «15 Prozent (unverändert)», [3] O30
const OBERGRENZE_MITTLERES_PV = 90000; // [2], [3] M6

// Das Rechenblatt [3], Zelle für Zelle nachgeschrieben — eine ZWEITE, unabhängige Rechnung.
// Kein durchgerechnetes amtliches Beispiel liegt vor; darum prüft der Test das Modul gegen die
// Formeln der SVS selbst (Zellbezüge im Kommentar).
function rechenblatt({ pv, erwachsene = 1, kinder = 0 }) {
  const M45 = Math.max(0, pv); // R28: IF(AA28>=0, AA28, 0); M45 = R31
  const M6 = OBERGRENZE_MITTLERES_PV;
  const M39 = RICHTPRAEMIE_2026.e * erwachsene; // =I39*C39
  const M42 = M45 <= M6 ? RICHTPRAEMIE_2026.k * kinder * 0.2 : RICHTPRAEMIE_2026.k * kinder; // =IF(M45<=M6,I42*C42*0.2,I42*C42)
  const R42 = M45 <= M6 ? RICHTPRAEMIE_2026.k * kinder * 0.8 : 0; // =IF(M45<=M6,I42*C42*0.8,0)
  const O43 = M39 + M42; // =SUM(M39:M42)
  const O46 = SELBSTBEHALT_2026 * M45 * -1; // =I46*M45*-1
  const R47 = O43 + O46 > 0 ? O43 + O46 : 0; // =IF(SUM(O43:O46)>0,SUM(O43:O46),0)
  return R42 + R47; // R49 = SUM(R41:R47), R41 = 0 ohne junge Erwachsene
}

describe('K31 calculateIPV für UR, bevor das UR-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'UR', dateOfBirth: '1980-05-01' }, finanzen: { monthlyIncome: 2000 } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 UR: die Steuerungsgrössen 2026 stehen so in [2] und [3]', () => {
  it('Richtprämien, Selbstbehalt, Vermögensanteil, Obergrenze', () => {
    expect(IPV_UR.jahr).toBe(2026);
    expect(IPV_UR.richtpraemie).toEqual(RICHTPRAEMIE_2026);
    expect(IPV_UR.selbstbehalt).toBe(SELBSTBEHALT_2026);
    expect(IPV_UR.vermoegenAnteil).toBe(VERMOEGENSANTEIL);
    expect(IPV_UR.obergrenzeMittleresPV).toBe(OBERGRENZE_MITTLERES_PV);
  });
  it('Kinder: Art. 6 Abs. 3 [1] höchstens 20 % anrechenbar, Art. 4 Abs. 3 [1] mindestens 80 % verbilligt', () => {
    expect(IPV_UR.kind).toEqual({ anrechenbar: 0.2, fest: 0.8 });
  });
  it('Art. 7 Abs. 3 [1]: Steuerjahr zwei Jahre vor dem Anspruchsjahr', () => {
    expect(IPV_UR.basisjahrAbstand).toBe(2);
  });
  it('Art. 56 Abs. 1 lit. b/c StG [4], Fassung 2025: 105 800 Alleinstehende, 31 700 je Kind', () => {
    expect(IPV_UR.vermoegenSozialabzug).toEqual({ alleinstehend: 105800, jeKind: 31700 });
  });
  it('Register und Beleg: eigenes Modul ohne PLZ-Abhängigkeit (eine Prämienregion), keine Musterwerte', () => {
    expect(IPV_MODULE.UR).toMatchObject({ fn: 'ipvUri', brauchtPLZ: false });
    expect(CANTONAL_IPV.UR.beleg.quelle).toMatch(/RB 20\.2213/);
    expect(CANTONAL_IPV.UR.beleg.stand).toMatch(/2026/);
    for (const k of ['maxIncome', 'subsidySingle', 'subsidyFamily', 'subsidyChild']) expect(CANTONAL_IPV.UR[k]).toBeNull();
    // Art. 10 [1]: Prüfung und Berechnung von Amtes wegen — kein Antrag beim «Amt für Gesundheit».
    expect(CANTONAL_IPV.UR.noteKey).toBe('ipv.noteAutoTaxData');
  });
  it('Rahmen: die 3a bleibt voll im Einkommen (Art. 7 Abs. 2), kein Prämiendeckel benannt', () => {
    expect(SAEULE_3A.voll.kantone).toMatch(/UR/);
    expect(SAEULE_3A.voll.beleg).toMatch(/RB 20\.2213/);
    expect(KEIN_PRAEMIENDECKEL.UR).toMatch(/Art\. 4 Abs\. 4/);
    // Fachprüfung 28.09.2026 (K1): bundesrechtlich belegt — der Versicherer zahlt die Differenz aus.
    expect(KEIN_PRAEMIENDECKEL.UR).toMatch(/KVV Art\. 106c Abs\. 5bis/);
  });
});

describe('K31 UR: das Rechenblatt der SVS [3] — Formel für Formel', () => {
  it('stimmt über ein Raster von Einkommen, Kinderzahl und Haushalt mit dem Modul überein', () => {
    for (const pv of [0, 1, 10000, 25000, 51388, 51389, 60000, 89999, 90000, 90001, 95000, 150000]) {
      for (const kinder of [0, 1, 2, 3, 5]) {
        for (const erwachsene of [1, 2]) {
          const r = ipvUriRechnen({ pv, kinderZahl: kinder, erwachsene });
          expect(r.total, `pv ${pv}, ${erwachsene} Erw., ${kinder} Kinder`).toBeCloseTo(rechenblatt({ pv, erwachsene, kinder }), 9);
        }
      }
    }
  });
  it('Einkommen 0: die volle Richtprämie je Person', () => {
    expect(ipvUriRechnen({ pv: 0 }).total).toBe(4368);
    expect(ipvUriRechnen({ pv: 0, kinderZahl: 2 }).total).toBeCloseTo(4368 + 2 * 1104, 9);
    expect(ipvUriRechnen({ pv: 0, kinderZahl: 2 }).maximal).toBe(4368 + 2 * 1104);
  });
  it('Handrechnung: 20 000 → 4 368 − 8,5 % × 20 000 = 2 668 (linear, 8,5 Rappen je Franken)', () => {
    expect(ipvUriRechnen({ pv: 20000 }).total).toBeCloseTo(2668, 9);
    const bei = (pv) => ipvUriRechnen({ pv }).total;
    expect(bei(10000) - bei(11000)).toBeCloseTo(85, 9);
    expect(bei(40000) - bei(41000)).toBeCloseTo(85, 9);
  });
  it('Nullpunkt: 51 388 noch knapp darunter, 51 389 nicht mehr (4 368 / 0,085 = 51 388.24)', () => {
    expect(ipvUriRechnen({ pv: 51388 }).total).toBeGreaterThan(0);
    expect(ipvUriRechnen({ pv: 51388 }).grund).toBe(null);
    expect(ipvUriRechnen({ pv: 51389 }).total).toBe(0);
    expect(ipvUriRechnen({ pv: 51389 }).grund).toBe('ueberGrenze');
  });
  it('Handrechnung ein Kind, 40 000: (4 368 + 220.80 − 3 400) + 883.20 = 2 072', () => {
    const r = ipvUriRechnen({ pv: 40000, kinderZahl: 1 });
    expect(r.anrechenbar).toBeCloseTo(4588.8, 9);
    expect(r.allgemein).toBeCloseTo(1188.8, 9);
    expect(r.total).toBeCloseTo(2072, 9);
    expect(r.mindestGilt).toBe(true);
  });
  it('Obergrenze 90 000 «bis und mit» [2]: bei 90 000 bleibt der Mindestanspruch, bei 90 001 nicht', () => {
    expect(ipvUriRechnen({ pv: 90000, kinderZahl: 1 }).total).toBeCloseTo(883.2, 9);
    expect(ipvUriRechnen({ pv: 90001, kinderZahl: 1 }).total).toBe(0);
    // Darüber zählt das Kind mit 100 % [3] M42 — bei drei Kindern bleibt ein allgemeiner Rest.
    const drei = ipvUriRechnen({ pv: 90001, kinderZahl: 3 });
    expect(drei.anrechenbar).toBe(4368 + 3 * 1104);
    expect(drei.total).toBeCloseTo(7680 - 0.085 * 90001, 9);
  });
  it('Gesamtanspruch (Formel, in der App nicht gebaut): Ehepaar, zwei Kinder, 60 000 → 5 844', () => {
    expect(ipvUriRechnen({ pv: 60000, kinderZahl: 2, erwachsene: 2 }).total).toBeCloseTo(5844, 9);
  });
  it('Aufteilung nach Art. 14 Abs. 2 [1]: im Verhältnis der anrechenbaren Richtprämien, Kinderminimum beim Kind', () => {
    const r = ipvUriRechnen({ pv: 40000, kinderZahl: 1 });
    expect(r.anteilErwachsen).toBeCloseTo(1188.8 * 4368 / 4588.8, 9);
    expect(r.anteilKind).toBeCloseTo(1188.8 * 220.8 / 4588.8 + 883.2, 9);
    expect(r.anteilErwachsen + r.anteilKind).toBeCloseTo(r.total, 9);
  });
  it('kein Mindestbetrag: auch 33 Franken im Jahr sind ein Anspruch (weder [1] noch [3] kennen eine Schwelle)', () => {
    const r = ipvUriRechnen({ pv: 51000 });
    expect(r.total).toBeCloseTo(33, 9);
    expect(r.grund).toBe(null);
  });
});

describe('K31 UR: Rundung Art. 14 Abs. 3 [1] — Monatsbetrag je Person auf fünf Rappen', () => {
  it('kaufmännisch, nicht auf (anders als LU): 1 000/Jahr → 83.35, 1 001/Jahr → 83.40', () => {
    expect(urMonatGerundet(1000)).toBeCloseTo(83.35, 9); // 83.333…
    expect(urMonatGerundet(1001)).toBeCloseTo(83.40, 9); // 83.4166… — aufgerundet wäre 83.45
    expect(urMonatGerundet(2668)).toBeCloseTo(222.35, 9); // 222.333…
    expect(urMonatGerundet(0)).toBe(0);
    expect(urMonatGerundet(-5)).toBe(0);
  });
});

describe('K31 calculateIPV für UR (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvUri.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, children = [], dob = '1980-05-01', kkPremium = 350, finanzen = {}, basis = {}, plz = '6460' } = {}) => ({
    basis: { canton: 'UR', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: plz, city: 'Altdorf' },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('20 000 im Jahr: 2 668 (222.35 × 12 = 2 668.20), Basisjahr 2024, keine Region, keine Grenze', () => {
    const r = calculateIPV(person({ monthlyIncome: 20000 / 12 }));
    expect(r).toMatchObject({
      belegt: true, eligible: true, annual: 2668, amount: 222, maxAnnual: 4368, jahr: 2026, basisjahr: 2024,
      vorbehaltKey: 'ipv.vorbehaltUR', jahrKey: 'ipv.jahrUR', noteKey: 'ipv.urAutomatisch',
      noteParams: { jahr: 2026, basisjahr: 2024, vorjahr: 2025 },
    });
    expect(r.region).toBeUndefined();
    expect(r.cantonData.maxIncome).toBe(null);
    // Von Amtes wegen (Art. 10 [1]) — keine Frist, die etwas abzieht.
    expect(r).not.toHaveProperty('anmeldefristVorbei');
  });

  it('ohne PLZ und ohne Ort: rechnet trotzdem (eine Prämienregion)', () => {
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, plz: '' }))).toMatchObject({ eligible: true, annual: 2668 });
  });

  it('mit einem Kind (5 Jahre), 40 000: 94.30 + 78.35 im Monat = 2 072 im Jahr', () => {
    const r = calculateIPV(person({ monthlyIncome: 40000 / 12, children: [{ age: 5 }] }));
    expect(r).toMatchObject({ eligible: true, annual: 2072, maxAnnual: 4368 + 1104 });
  });

  it('zwei Kinder, 30 000 → 4 026', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, children: [{ age: 3 }, { age: 9 }] })).annual).toBe(4026);
  });

  it('Kinderminimum bis und mit 90 000: 883 (73.60 × 12); darüber kein Anspruch', () => {
    expect(calculateIPV(person({ monthlyIncome: 7500, children: [{ age: 5 }] }))).toMatchObject({ eligible: true, annual: 883 });
    expect(calculateIPV(person({ monthlyIncome: 7501, children: [{ age: 5 }] })))
      .toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.urKeinAnspruch' });
  });

  it('kein Mindestbetrag: 51 000 → 33 im Jahr wird gezeigt; 51 400 → kein Anspruch', () => {
    expect(calculateIPV(person({ monthlyIncome: 51000 / 12 }))).toMatchObject({ eligible: true, annual: 33 });
    expect(calculateIPV(person({ monthlyIncome: 51400 / 12 }))).toMatchObject({ eligible: false, amount: 0, noteKey: 'ipv.urKeinAnspruch' });
  });

  it('Vermögen: 15 % des STEUERBAREN Vermögens — unter dem Sozialabzug von 105 800 zählt nichts', () => {
    const basis = calculateIPV(person({ monthlyIncome: 20000 / 12 })).annual;
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { savingsAccount: 100000 } })).annual).toBe(basis);
    // 150 000 − 105 800 = 44 200 → × 15 % = 6 630 → PV 26 630 → 4 368 − 2 263.55 = 2 104.45
    // → 175.35 im Monat → 2 104.20 → 2 104
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen: { savingsAccount: 150000 } })).annual).toBe(2104);
  });

  it('Vermögen mit Kind: der Abzug wächst um 31 700 je Kind', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 40000 / 12, children: [{ age: 5 }] })).annual;
    expect(calculateIPV(person({ monthlyIncome: 40000 / 12, children: [{ age: 5 }], finanzen: { savingsAccount: 137500 } })).annual).toBe(ohne);
    expect(calculateIPV(person({ monthlyIncome: 40000 / 12, children: [{ age: 5 }], finanzen: { savingsAccount: 147500 } })).annual).toBeLessThan(ohne);
  });

  it('keine Vermögensgrenze: auch sehr viel Vermögen gibt eine Zahl (hier: kein Anspruch), keine Orientierung', () => {
    expect(calculateIPV(person({ finanzen: { savingsAccount: 2000000 } }))).toMatchObject({ belegt: true, eligible: false });
  });

  it('kein Prämiendeckel (KEIN_PRAEMIENDECKEL.UR): ohne und mit tiefer Prämie derselbe Betrag', () => {
    const r = calculateIPV(person({ monthlyIncome: 20000 / 12 })).annual;
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, kkPremium: null })).annual).toBe(r);
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12, kkPremium: 100 })).annual).toBe(r);
  });

  it('Säule 3a: bleibt voll im Einkommen (Art. 7 Abs. 2 [1]) — und steckt schon im Nettoeinkommen', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 0 } })).annual;
    const mit = calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 7258 } })).annual;
    expect(mit).toBe(ohne);
  });

  it('negatives Einkommen: keine Zahl statt der vollen Richtprämie', () => {
    expect(calculateIPV(person({ monthlyIncome: -500 }))).toMatchObject({ belegt: false, amount: null, offen: 'einkommenNegativ' });
  });

  it('Alter (gewählt, mangelsStichtag): Jahrgang 1999 rechnet; Jahrgang 2000 mit eigenem Grund (W3)', () => {
    expect(calculateIPV(person({ dob: '1999-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ dob: '2000-01-01' }))).toMatchObject({ belegt: false, offen: 'stichtagAlter' });
    expect(calculateIPV(person({ dob: '2000-12-31' }))).toMatchObject({ belegt: false, offen: 'stichtagAlter' });
    expect(calculateIPV(person({ dob: '' }))).toMatchObject({ belegt: false, offen: 'alter' });
  });

  it('junge Erwachsene 19–25: Grund «ausbildung», nicht «Geburtsdatum fehlt / Eltern» (Art. 4 Abs. 6: eigenständig)', () => {
    for (const dob of ['2001-01-01', '2004-06-15', '2007-12-31']) {
      expect(calculateIPV(person({ dob }))).toMatchObject({ belegt: false, amount: null, offen: 'ausbildung' });
    }
    // Unter 19 (minderjährig im Anspruchsjahr): weiter der allgemeine Grund.
    expect(calculateIPV(person({ dob: '2008-03-01' }))).toMatchObject({ offen: 'alter' });
  });

  it('bezahlte Alimente: Art. 7 Abs. 2 lit. c zieht Unterhaltsbeiträge ab (W1) — 1 000/Monat = 1 020 Fr. im Jahr mehr', () => {
    // 30 000 → 4 368 − 2 550 = 1 818 · mit 12 000 Alimente: 18 000 → 4 368 − 1 530 = 2 838
    expect(calculateIPV(person({ monthlyIncome: 2500 })).annual).toBe(1818);
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { alimentePaid: 1000 } })).annual).toBe(2838);
    // Mehr Alimente als Einkommen: das Rechenblatt setzt die Nettoeinkünfte auf 0 ([3] R28) — volle Richtprämie.
    expect(calculateIPV(person({ monthlyIncome: 800, finanzen: { alimentePaid: 1000 } })).annual).toBe(4368);
    // Unlesbar oder negativ zählt als 0.
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { alimentePaid: 'abc' } })).annual).toBe(1818);
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { alimentePaid: -500 } })).annual).toBe(1818);
  });

  it('Kinder nach Jahrgang [5] (2008–2025); das eingetippte Alter zählt im Anspruchsjahr eins mehr', () => {
    expect(calculateIPV(person({ children: [{ birthDate: '2008-12-31' }] })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ birthDate: '2007-12-31' }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 18 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 17 }] })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ age: 19 }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
  });

  it('ein im Anspruchsjahr geborenes Kind zählt erst im Folgejahr (Art. 3 Abs. 3 [1])', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 40000 / 12 }));
    const neugeboren = calculateIPV(person({ monthlyIncome: 40000 / 12, children: [{ birthDate: '2026-03-01' }] }));
    expect(neugeboren.annual).toBe(ohne.annual);
    expect(neugeboren.maxAnnual).toBe(4368);
    // Gegenprobe: im Dezember 2025 geboren zählt es.
    expect(calculateIPV(person({ monthlyIncome: 40000 / 12, children: [{ birthDate: '2025-12-01' }] })).annual).toBe(2072);
  });

  it('Neugeborenes und Vermögen (K6): es erhöht auch den Vermögens-Sozialabzug nicht', () => {
    // 137 500 Vermögen: ohne Kind 31 700 steuerbar (→ + 4 755 PV), mit gezähltem Kind 0.
    const finanzen = { savingsAccount: 137500 };
    const ohne = calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen }));
    const neu = calculateIPV(person({ monthlyIncome: 20000 / 12, finanzen, children: [{ birthDate: '2026-02-01' }] }));
    expect(neu.annual).toBe(ohne.annual);
    expect(ohne.annual).toBeLessThan(2668);
  });

  it('Paare, Konkubinat und mehrere Erwachsene: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { household: { adults: 2, children: [] } } }))).toMatchObject({ offen: 'haushalt' });
  });

  it('ab 2027 keine Zahl mehr, bis die Werte nachgeführt sind', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12 }))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
  });
  it('am 31.12.2026 rechnet es noch', () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-12-31T12:00:00'));
    expect(calculateIPV(person({ monthlyIncome: 20000 / 12 }))).toMatchObject({ belegt: true, annual: 2668 });
  });
});
