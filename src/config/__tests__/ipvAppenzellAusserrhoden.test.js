import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_AR, ipvAppenzellAusserrhodenRechnen, arKinderabzugSteuer } from '../ipvAppenzellAusserrhoden.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV, IPV_MODULE } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Appenzell Ausserrhoden 2026.
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt AR:
//   [1] EG zum KVG bGS 833.14, Stand 01.01.2017 — Art. 2, 11, 12, 13, 16, 19, 20–22
//   [2] V zum KVG bGS 833.141, Stand 01.01.2017 — Art. 5, 6, 7, 10, 13
//   [3] SOVAR, Merkblatt IPV 2026 — alle Zahlen 2026
//   [4] Medienmitteilung Regierungsrat 12.12.2025
//   [5] SOVAR, Antrag 2026 (Zuzug Ausland) — Jahrgänge
//   [6] Steuergesetz bGS 621.11 — Art. 38 mit Anhang 1 (2024), Art. 51
// Ein amtliches Berechnungsbeispiel gibt es nicht. Prüfsteine: Handrechnungen aus dem Wortlaut
// von [3] und die amtlichen Obergrenzen.

describe('K31 AR: Konstanten wörtlich', () => {
  it('Richtprämien und Kinderbetrag [3]', () => {
    expect(IPV_AR.richtpraemie).toEqual({ e: 6025.20, j: 4233.60 });
    expect(IPV_AR.kinderBetrag).toBe(1114.80);
  });
  it('Selbstbehalt 46 %, Lebensbedarf, Abzug je Kind [3], [4]', () => {
    expect(IPV_AR.selbstbehalt).toBe(0.46);
    expect(IPV_AR.lebensbedarf).toEqual({ alleinstehend: 20670, mitKindern: 31005 });
    expect(IPV_AR.abzugJeKind).toBe(2000);
  });
  it('Obergrenzen [3]: Einkommen 35 000 / 46 200 / 47 000 / 50 400 / 56 700 / 63 000, Vermögen 120 000', () => {
    expect(IPV_AR.obergrenzeEinkommen).toEqual([35000, 46200, 47000, 50400, 56700, 63000]);
    expect(IPV_AR.obergrenzeVermoegen).toBe(120000);
  });
  it('Vermögen 15 % [2] über den steuerfreien Beträgen [6]; Kinderabzug [6]; Mindestbetrag [2]', () => {
    expect(IPV_AR.vermoegenAnteil).toBe(0.15);
    expect(IPV_AR.vermoegenFreibetrag).toEqual({ alleinstehend: 75000, jeKind: 25000 });
    expect(IPV_AR.kinderabzugSteuer).toEqual({ bis4: 5300, bis15: 7400, ab15: 11600 });
    expect(IPV_AR.mindestbetrag).toBe(20);
    expect(IPV_AR.frist).toEqual({ ordentlich: '2026-03-31', haertefall: '2026-04-30' });
    expect(IPV_AR.steuerjahr).toBe(2024);
    expect(IPV_AR.jahr).toBe(2026);
  });
  it('der Kinderbetrag ist 80 % einer Richtprämie von 1 393.50 (Art. 11 Abs. 2 [1], [4] «80 %»)', () => {
    expect(IPV_AR.kinderBetrag / 0.8).toBeCloseTo(1393.5, 9);
  });
  it('die Obergrenzen liegen im Rahmen des Gesetzes: ±10 % der Beträge in Art. 12 Abs. 1 lit. a [1]', () => {
    const gesetz = [35000, 42000, 49000, 56000, 63000, 70000];
    IPV_AR.obergrenzeEinkommen.forEach((w, i) => expect(Math.abs(w - gesetz[i]) / gesetz[i]).toBeLessThanOrEqual(0.1 + 1e-12));
    // Vermögen: 150 000 − 20 % = 120 000 (Art. 12 Abs. 2 [1]; [4]: «um 20 % herabgesetzt»).
    expect(IPV_AR.obergrenzeVermoegen).toBe(150000 * 0.8);
  });
});

describe('K31 AR: Rechnung', () => {
  it('bis zum Lebensbedarf die volle Richtprämie', () => {
    expect(ipvAppenzellAusserrhodenRechnen({ me: 0 }).total).toBeCloseTo(6025.2, 9);
    expect(ipvAppenzellAusserrhodenRechnen({ me: 20670 }).total).toBeCloseTo(6025.2, 9);
  });
  it('Handrechnung: 24 000 → 6 025.20 − 46 % × 3 330 = 4 493.40', () => {
    expect(ipvAppenzellAusserrhodenRechnen({ me: 24000 }).total).toBeCloseTo(4493.4, 9);
    expect(ipvAppenzellAusserrhodenRechnen({ me: 30000 }).total).toBeCloseTo(1733.4, 9);
  });
  it('Nullpunkt 33 768.26 liegt unter der Obergrenze 35 000 — für Alleinstehende wirkt sie nicht', () => {
    const null_ = 20670 + 6025.2 / 0.46;
    expect(null_).toBeCloseTo(33768.26, 2);
    expect(null_).toBeLessThan(IPV_AR.obergrenzeEinkommen[0]);
  });
  it('zwei Gründe für «kein Betrag»: unter Fr. 20 (Art. 13 [2]) und kein Anspruch', () => {
    const band = ipvAppenzellAusserrhodenRechnen({ me: 33740 });
    expect(band).toMatchObject({ total: 0, grund: 'mindestbetrag' });
    expect(band.erwachsen).toBeCloseTo(13, 9);
    expect(ipvAppenzellAusserrhodenRechnen({ me: 33700 }).total).toBeCloseTo(31.4, 9);
    expect(ipvAppenzellAusserrhodenRechnen({ me: 33800 })).toMatchObject({ total: 0, grund: 'ueberGrenze' });
  });
  it('Kinder: fester Betrag 1 114.80 je Kind, nicht um den Selbstbehalt gekürzt', () => {
    const r = ipvAppenzellAusserrhodenRechnen({ me: 40600, kinderZahl: 1 });
    // anrechenbar 40 600 − 31 005 − 2 000 = 7 595; Selbstbehalt 3 493.70
    expect(r.anrechenbar).toBe(7595);
    expect(r.erwachsen).toBeCloseTo(2531.5, 9);
    expect(r.total).toBeCloseTo(2531.5 + 1114.8, 9);
  });
  it('Kinder: über der Obergrenze nichts, auch nicht für die Kinder (Art. 12 [1])', () => {
    expect(ipvAppenzellAusserrhodenRechnen({ me: 46200, kinderZahl: 1 }).unklar).toBe(true);
    expect(ipvAppenzellAusserrhodenRechnen({ me: 46201, kinderZahl: 1 })).toMatchObject({ total: 0, grund: 'ueberGrenze' });
    expect(ipvAppenzellAusserrhodenRechnen({ me: 63001, kinderZahl: 7 }).grund).toBe('ueberGrenze');
  });
  it('Kinder: Selbstbehalt über der Richtprämie, aber unter der Obergrenze → unklar (Art. 16 lit. c gegen Art. 11 Abs. 2)', () => {
    expect(ipvAppenzellAusserrhodenRechnen({ me: 46100, kinderZahl: 1 }).unklar).toBe(false);
    expect(ipvAppenzellAusserrhodenRechnen({ me: 46150, kinderZahl: 1 }).unklar).toBe(true);
  });
});

describe('K31 AR: steuerlicher Kinderabzug [6] Art. 38 Abs. 1 lit. a, Werte 2024', () => {
  it('bis zur Vollendung des 4. Altersjahres 5 300, bis zur Vollendung des 15. 7 400, danach 11 600', () => {
    expect(arKinderabzugSteuer(-1)).toBe(0);
    expect(arKinderabzugSteuer(0)).toBe(5300);
    expect(arKinderabzugSteuer(3)).toBe(5300);
    expect(arKinderabzugSteuer(4)).toBe(7400);
    expect(arKinderabzugSteuer(14)).toBe(7400);
    expect(arKinderabzugSteuer(15)).toBe(11600);
  });
});

describe('K31 calculateIPV für AR (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvAppenzellAusserrhoden.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, children = [], dob = '1980-05-01', kkPremium = 450, finanzen = {}, basis = {}, versicherungen = {} } = {}) => ({
    basis: { canton: 'AR', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: '9100', city: 'Herisau' },
    versicherungen: { ...(kkPremium != null ? { kkPremium } : {}), ...versicherungen },
  });

  it('belegt, mit Quelle; ohne PLZ-Daten; publizierte Obergrenze 35 000', () => {
    expect(CANTONAL_IPV.AR.beleg.quelle).toMatch(/bGS 833\.14/);
    expect(CANTONAL_IPV.AR.maxIncome).toBe(35000);
    expect(CANTONAL_IPV.AR.subsidySingle).toBe(null);
    expect(IPV_MODULE.AR.brauchtPLZ).toBe(false);
  });

  it('24 000 im Jahr: 4 493 (374/Monat), eigener Satz statt Aargau-Satz', () => {
    const r = calculateIPV(person({ monthlyIncome: 2000 }));
    expect(r).toMatchObject({ belegt: true, eligible: true, annual: 4493, amount: 374, jahr: 2026, vorbehaltKey: 'ipv.vorbehaltAR', jahrKey: 'ipv.jahrAR' });
    expect(r.cantonData.maxIncome).toBe(35000);
    expect(r.region).toBeUndefined();
  });

  it('die PLZ spielt keine Rolle (eine Prämienregion)', () => {
    const a = calculateIPV(person({ monthlyIncome: 2000 }));
    const b = calculateIPV({ ...person({ monthlyIncome: 2000 }), wohnen: {} });
    expect(b.annual).toBe(a.annual);
  });

  it('ohne erfasste Prämie keine Zahl; liegt der Betrag über der erfassten Prämie, auch nicht (Art. 7 [2])', () => {
    expect(calculateIPV(person({ monthlyIncome: 2000, kkPremium: null }))).toMatchObject({ belegt: false, offen: 'praemie' });
    expect(calculateIPV(person({ monthlyIncome: 2000, kkPremium: 300 }))).toMatchObject({ belegt: false, offen: 'praemieFranchise' });
    // Liegt die Prämie über dem Betrag, greift der Deckel sicher nicht.
    expect(calculateIPV(person({ monthlyIncome: 2500, kkPremium: 150 }))).toMatchObject({ belegt: true, annual: 1733 });
  });

  it('zwei Gründe für «kein Betrag»', () => {
    expect(calculateIPV(person({ monthlyIncome: 33740 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.arUnterMindestbetrag' });
    expect(calculateIPV(person({ monthlyIncome: 33800 / 12 }))).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.arKeinAnspruch' });
  });

  it('Vermögen: 15 % über 75 000; über 120 000 steuerbar keine Zahl', () => {
    // 100 000 − 75 000 = 25 000 → + 3 750: 27 750 → 6 025.20 − 46 % × 7 080 = 2 768.40
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { savingsAccount: 100000 } })).annual).toBe(2768);
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { savingsAccount: 195000 } })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { savingsAccount: 195001 } }))).toMatchObject({ belegt: false, offen: 'vermoegen' });
  });

  it('Säule 3a: ohne Angabe zur Pensionskasse und mit Unterschied keine Zahl; mit BVG-Beitrag voll', () => {
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 3000 } }))).toMatchObject({ belegt: false, offen: 'saeule2Unbekannt' });
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 3000 }, versicherungen: { bvgContribution: '300' } }))).toMatchObject({ belegt: true, annual: 4493 });
    // Unter dem Lebensbedarf ändert die 3a nichts — dann bleibt die Zahl.
    expect(calculateIPV(person({ monthlyIncome: 1500, kkPremium: 520, finanzen: { pension3a: 2000 } }))).toMatchObject({ belegt: true, annual: 6025 });
  });

  it('negatives Einkommen: keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: -100 }))).toMatchObject({ belegt: false, offen: 'einkommenNegativ' });
  });

  it('mit einem Kind (Geburt 2019): 48 000 − Kinderabzug 7 400 → 3 646; Obergrenze 46 200', () => {
    const r = calculateIPV(person({ monthlyIncome: 4000, children: [{ birthDate: '2019-06-01' }] }));
    expect(r).toMatchObject({ eligible: true, annual: 3646 });
    expect(r.cantonData.maxIncome).toBe(46200);
    expect(r.maxAnnual).toBe(Math.round(Math.min(6025.2, 5400) + 1114.8));
  });

  it('mit einem Kind knapp unter der Obergrenze: 1 116; knapp darüber: nichts; im Band dazwischen keine Zahl', () => {
    expect(calculateIPV(person({ monthlyIncome: 53500 / 12, children: [{ birthDate: '2019-06-01' }] }))).toMatchObject({ annual: 1116 });
    expect(calculateIPV(person({ monthlyIncome: 53550 / 12, children: [{ birthDate: '2019-06-01' }] }))).toMatchObject({ belegt: false, offen: 'mindestanspruch' });
    expect(calculateIPV(person({ monthlyIncome: 53700 / 12, children: [{ birthDate: '2019-06-01' }] }))).toMatchObject({ belegt: true, amount: 0, noteKey: 'ipv.arKeinAnspruch' });
  });

  it('Kinderabzug aus dem eingetippten Alter nur, wenn die Stufe eindeutig ist', () => {
    // Alter 8 heute → Ende 2024 sechs oder sieben: beide 7 400.
    expect(calculateIPV(person({ monthlyIncome: 4000, children: [{ age: 8 }] }))).toMatchObject({ annual: 3646 });
    // Alter 5 heute → Ende 2024 drei oder vier: 5 300 oder 7 400.
    expect(calculateIPV(person({ monthlyIncome: 4000, children: [{ age: 5 }] }))).toMatchObject({ belegt: false, offen: 'alter' });
  });

  it('Kind 2025 geboren: kein Kinderabzug im Steuerjahr 2024, aber im Haushalt am 1.1.2026', () => {
    // Ohne Kinderabzug ist das massgebende Einkommen 48 000 — über der Obergrenze 46 200: nichts.
    // Bei 36 000: anrechenbar 36 000 − 33 005 = 2 995 → Anspruch.
    expect(calculateIPV(person({ monthlyIncome: 4000, children: [{ birthDate: '2025-05-01' }] }))).toMatchObject({ belegt: true, amount: 0 });
    expect(calculateIPV(person({ monthlyIncome: 3000, children: [{ birthDate: '2025-05-01' }] }))).toMatchObject({ belegt: true, eligible: true });
  });

  it('Kind nach dem 1. Januar 2026 geboren: keine Zahl (Art. 16 Abs. 2 [1], Art. 6 [2])', () => {
    expect(calculateIPV(person({ monthlyIncome: 3000, children: [{ birthDate: '2026-03-01' }] }))).toMatchObject({ belegt: false, offen: 'kindNachStichtag' });
  });

  it('Alter nach Jahrgang [5]: 2000 ist erwachsen, 2001 nicht', () => {
    expect(calculateIPV(person({ monthlyIncome: 2000, dob: '2000-12-31' })).belegt).toBe(true);
    expect(calculateIPV(person({ monthlyIncome: 2000, dob: '2001-01-01' }))).toMatchObject({ belegt: false, offen: 'alter' });
  });

  it('Kinder «Jahrgänge 2008 - 2026» [5]; über 18, ohne Alter, Paare: Orientierung mit Grund', () => {
    expect(calculateIPV(person({ monthlyIncome: 2000, kkPremium: 520, children: [{ birthDate: '2008-12-31' }] })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ birthDate: '2007-12-31' }] }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ children: [{ age: 0 }] }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } }))).toMatchObject({ offen: 'haushalt' });
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } }))).toMatchObject({ offen: 'haushalt' });
  });

  describe('Frist Art. 10 [2] und Jahres-Riegel', () => {
    it('bis 31.03.2026: die Frist läuft', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-03-31T12:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 2000 }))).toMatchObject({ noteKey: 'ipv.arFristLaeuft', noteParams: { jahr: 2026, folgejahr: 2027 } });
    });
    it('ab 01.04.2026 vorbei — der Betrag bleibt, der Satz sagt es', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-04-01T12:00:00'));
      const r = calculateIPV(person({ monthlyIncome: 2000 }));
      expect(r).toMatchObject({ noteKey: 'ipv.arFristVorbei', annual: 4493 });
      expect(r.anmeldefristVorbei).toBeUndefined();
    });
    it('ab 2027 keine Zahl mehr', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 2000 }))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });
});

describe('K31 calculateIPV für AR — vor dem Laden', () => {
  it('ohne geladenes Modul: Orientierung «laden», nie ein Betrag', async () => {
    vi.resetModules();
    const frisch = await import('../cantonalData.js');
    const r = frisch.calculateIPV({
      basis: { canton: 'AR', dateOfBirth: '1980-05-01', maritalStatus: 'single', household: { adults: 1, children: [] } },
      finanzen: { monthlyIncome: 2000 }, versicherungen: { kkPremium: 450 },
    });
    expect(r).toMatchObject({ belegt: false, amount: null, offen: 'laden' });
  });
});
