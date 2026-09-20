import { describe, it, expect, beforeAll } from 'vitest';
import { IPV_SG, ipvStGallenRechnen, sgBelastungsgrenze } from '../ipvStGallen.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton St.Gallen 2026.
// Quellen (an der Quelle nachgeprüft 20.09.2026), Wortlaute in
// docs/sources/ipv-kantone-2026.md, Abschnitt SG:
//   [1] Regierungsbeschluss sGS 331.538 vom 9.12.2025, Stand 1.1.2026 — Art. 3, 5, 6, 7
//   [2] Verordnung sGS 331.111 — Art. 12, 14, 19 Abs. 2, 20, 21
//   [3] SVA St.Gallen, Merkblatt IPV 2026 (Form. 4100 01.26)

describe('K31 SG: das eine amtliche Rechenbeispiel [3] Ziff. 6', () => {
  it('Erwachsene, Region 1, massgebendes Einkommen 10 000 → CHF 5 069.60', () => {
    // Wörtlich: «Referenzprämie CHF 6 285.60 / Abzüglich Selbstbehalt (Annahme: 12,16 Prozent
    // von CHF 10 000.00) CHF 1 216.00 / Summe der Prämienverbilligung CHF 5 069.60»
    const r = ipvStGallenRechnen({ region: 1, personen: ['e'], me: 10000 });
    expect(r.referenzSumme).toBeCloseTo(6285.60, 6);
    expect(r.grenzeProzent).toBeCloseTo(12.16, 6);
    expect(r.eigenanteil).toBeCloseTo(1216.00, 6);
    expect(r.total).toBeCloseTo(5069.60, 6);
  });
});

describe('K31 SG: Referenzprämien Art. 3 [1], wörtlich', () => {
  it('Erwachsene ab 26 je Region', () => {
    expect(IPV_SG.referenz.erwachsen).toEqual({ 1: 6285.60, 2: 5879.40, 3: 5681.40 });
  });
  it('Erwachsene bis 25 je Region (nicht gebaut, aber belegt hinterlegt)', () => {
    expect(IPV_SG.referenz.jungeErwachsene).toEqual({ 1: 4492.80, 2: 4218.00, 3: 4063.20 });
  });
  it('Kinder je Region', () => {
    expect(IPV_SG.referenz.kind).toEqual({ 1: 1462.80, 2: 1351.20, 3: 1306.80 });
  });
  it('bei Einkommen 0 wird die volle Referenzprämie verbilligt', () => {
    for (const region of [1, 2, 3]) {
      expect(ipvStGallenRechnen({ region, personen: ['e'], me: 0 }).total)
        .toBeCloseTo(IPV_SG.referenz.erwachsen[region], 6);
    }
  });
});

describe('K31 SG: Belastungsgrenze Art. 5 [1] — sie STEIGT mit dem Einkommen', () => {
  it('Abs. 1, Alleinstehende ohne Kinder: 12,16 % bis 18 700', () => {
    expect(sgBelastungsgrenze({ me: 0 })).toBeCloseTo(12.16, 9);
    expect(sgBelastungsgrenze({ me: 18700 })).toBeCloseTo(12.16, 9);
  });

  it('Abs. 1: je Franken über 18 700 um 0,0002 Prozentpunkte höher, auf das GESAMTE Einkommen', () => {
    // 20 000 liegt 1 300 über dem Sockel → 12,16 + 1 300 × 0,0002 = 12,42 %
    expect(sgBelastungsgrenze({ me: 20000 })).toBeCloseTo(12.42, 9);
    // und der Selbstbehalt gilt dem ganzen Einkommen, nicht nur dem übersteigenden Teil
    const r = ipvStGallenRechnen({ region: 1, personen: ['e'], me: 20000 });
    expect(r.eigenanteil).toBeCloseTo(0.1242 * 20000, 6);
  });

  it('Abs. 3, Alleinstehende mit Kindern: Basis 10,96 %, Sockel je Kind um 5 610 höher', () => {
    const b = IPV_SG.belastung.alleinMitKindern;
    expect(b.satz).toBe(10.96);
    // Ein Kind: Sockel 18 700 + 5 610 = 24 310 — bis dahin flache 10,96 %
    expect(sgBelastungsgrenze({ me: 24310, kinderZahl: 1 })).toBeCloseTo(10.96, 9);
    // darüber: 0,0002 + 0,00003 je Kind = 0,00023 Prozentpunkte je Franken
    expect(sgBelastungsgrenze({ me: 25310, kinderZahl: 1 })).toBeCloseTo(10.96 + 1000 * 0.00023, 9);
  });

  it('Abs. 3: der Zuwachs ist bei 0,0003 Prozentpunkten gedeckelt', () => {
    // 0,0002 + 4 × 0,00003 = 0,00032 → gedeckelt auf 0,0003
    const sockel = 18700 + 4 * 5610;
    const ueber = 1000;
    expect(sgBelastungsgrenze({ me: sockel + ueber, kinderZahl: 4 }))
      .toBeCloseTo(10.96 + ueber * 0.0003, 9);
  });

  it('der Abbau ist quadratisch, nicht linear — das unterscheidet SG von ZH', () => {
    const bei = (me) => ipvStGallenRechnen({ region: 1, personen: ['e'], me }).total;
    const schritt1 = bei(20000) - bei(25000);
    const schritt2 = bei(30000) - bei(35000);
    // Gleich grosse Einkommensschritte, aber der zweite kostet mehr Verbilligung.
    expect(schritt2).toBeGreaterThan(schritt1);
  });
});

describe('K31 SG: Minimalgarantie für Kinder, Art. 19 Abs. 2 [2] und Obergrenze Art. 6 [1]', () => {
  it('80 Prozent der Referenzprämie des Kindes als Boden', () => {
    expect(IPV_SG.minimalgarantie.kind).toBe(0.80);
    // Einkommen knapp unter der Obergrenze für ein Kind (65 700): die anteilige Rechnung
    // ergäbe für das Kind fast nichts, die Garantie hebt es auf 80 % von 1 462.80.
    const r = ipvStGallenRechnen({ region: 1, personen: ['e', 'k'], me: 65000 });
    expect(r.garantieGilt).toBe(true);
    expect(r.kindBetrag).toBeCloseTo(0.8 * 1462.80, 6);
  });

  it('über der Obergrenze nach Art. 6 gilt sie nicht mehr', () => {
    // Ein Kind → Obergrenze 65 700 [1] Art. 6 Bst. b
    expect(IPV_SG.obergrenzeGarantieAllein[1]).toBe(65700);
    expect(ipvStGallenRechnen({ region: 1, personen: ['e', 'k'], me: 65701 }).garantieGilt).toBe(false);
    expect(ipvStGallenRechnen({ region: 1, personen: ['e', 'k'], me: 65700 }).garantieGilt).toBe(true);
  });

  it('die Obergrenzen Art. 6 Bst. a–f stehen wörtlich', () => {
    expect(IPV_SG.obergrenzeGarantieAllein).toEqual([41700, 65700, 65700, 70700, 75700, 80700]);
  });

  it('🛑 die Obergrenze misst das Einkommen VOR dem Kinderabzug (Art. 6: Ziff. 1 bis 5septies)', () => {
    // Art. 6 [1] nennt ausdrücklich «Ziff. 1 bis 5septies» — der Kinderabzug ist Ziff. 6 und
    // gehört nicht dazu. Befund der Fachprüfung 20.09.2026: vorher wurde das Einkommen NACH
    // Kinderabzug verglichen, die Garantie griff dadurch bis 4'000 je Kind zu weit oben.
    // Ein Kind, Reineinkommen 69'700 → me 65'700. Die Obergrenze ist 65'700.
    const nachAbzug = { region: 1, personen: ['e', 'k'], me: 65700, meVorKinderabzug: 69700 };
    expect(ipvStGallenRechnen(nachAbzug).garantieGilt).toBe(false);
    // Ohne den Unterschied (also wenn beide Grössen gleich sind) griffe sie:
    expect(ipvStGallenRechnen({ region: 1, personen: ['e', 'k'], me: 65700, meVorKinderabzug: 65700 }).garantieGilt).toBe(true);
  });

  it('🛑 die Werte aus Art. 6 sind NICHT die allgemeine Einkommensgrenze', () => {
    // Alleinstehende ohne Kinder: Art. 6 nennt 41 700 — die Verbilligung fällt aber schon
    // weit darunter auf null. Wer 41 700 als Grenze läse, zeigte einen Anspruch, der nicht
    // besteht. Darum trägt SG in der App gar keine Grenze.
    expect(ipvStGallenRechnen({ region: 1, personen: ['e'], me: 41700 }).total).toBe(0);
    expect(CANTONAL_IPV.SG.maxIncome).toBe(null);
  });
});

describe('K31 SG: Mindestbetrag Art. 20 [2]', () => {
  it('weniger als Fr. 100 je Person und Jahr wird nicht ausgerichtet', () => {
    expect(IPV_SG.mindestbetrag).toBe(100);
    // Der Punkt, an dem der anteilige Betrag unter 100 fällt, ist auch der Punkt, an dem
    // die App nichts mehr zeigt. Unabhängig hergeleitet in der Recherche vom 16.09.:
    // Region 1 ≈ 38 414, Region 2 ≈ 36 681, Region 3 ≈ 35 817.
    const nullpunkt = (region) => {
      let me = 30000;
      while (ipvStGallenRechnen({ region, personen: ['e'], me }).total > 0 && me < 60000) me += 1;
      return me;
    };
    expect(nullpunkt(1)).toBe(38414);
    expect(nullpunkt(2)).toBe(36681);
    expect(nullpunkt(3)).toBe(35817);
  });
});

describe('K31 SG durch die App (calculateIPV)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../../data/plzGemeinde.js');
    await import('../ipvStGallen.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  // 🛑 kkPremium ist hier NICHT vorbelegt — anders als bei ZH, BE, AG und VD. St.Gallen
  // kennt keinen Deckel auf die effektive Prämie, die Prämie geht in die Rechnung nicht ein.
  const person = ({ monthlyIncome = 0, plz = '9000', city = 'St.Gallen', children = [], dob = '1980-05-01', kkPremium, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'SG', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: plz, city },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('🛑 rechnet OHNE erfasste Prämie — St.Gallen deckelt nicht auf die eigene Prämie', () => {
    // Gemessen am vollen Verordnungstext (sGS 331.111) mit Gegenprobe: kein «effektiv»,
    // kein «höchstens die Prämie». Die anderen vier Kantone brauchen die Prämie, SG nicht.
    const r = calculateIPV(person());
    expect(r).toMatchObject({ belegt: true, eligible: true, canton: 'SG', region: 1, jahr: 2026, basisjahr: 2024 });
    expect(r.annual).toBe(6286);
    expect(r.offen).toBeUndefined();
  });

  it('eine erfasste Prämie ändert den Betrag nicht — sie geht in die Rechnung nicht ein', () => {
    expect(calculateIPV(person({ kkPremium: 150 })).annual).toBe(calculateIPV(person()).annual);
    expect(calculateIPV(person({ kkPremium: 900 })).annual).toBe(calculateIPV(person()).annual);
  });

  it('Einkommen 2 000/Monat: 24 000 massgebend → Belastungsgrenze 13,22 %', () => {
    const r = calculateIPV(person({ monthlyIncome: 2000 }));
    // 24 000 − 18 700 = 5 300 → 12,16 + 5 300 × 0,0002 = 13,22 %
    // 6 285.60 − 13,22 % × 24 000 = 6 285.60 − 3 172.80 = 3 112.80
    expect(r.annual).toBe(3113);
    expect(r.amount).toBe(Math.round(3113 / 12));
  });

  it('Kinderabzug Fr. 4 000 je Kind, Art. 14 [2]', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 2000 }));
    const mit = calculateIPV(person({ monthlyIncome: 2000, children: [{ age: 5 }] }));
    // Mit Kind: anderes Modell (Abs. 3) UND 4 000 weniger massgebendes Einkommen.
    expect(mit.annual).toBeGreaterThan(ohne.annual);
    expect(CANTONAL_IPV.SG.beleg.quelle).toMatch(/331\.111/);
  });

  it('Vermögen: über 100 000 kein Anspruch, je Kind 20 000 mehr, höchstens 150 000 (Art. 12 Abs. 3 [2])', () => {
    expect(calculateIPV(person({ finanzen: { savingsAccount: 100000 } })).belegt).toBe(true);
    expect(calculateIPV(person({ finanzen: { savingsAccount: 100001 } }))).toMatchObject({ belegt: false, offen: 'vermoegen' });
    // Ein Kind → 120 000
    expect(calculateIPV(person({ children: [{ age: 5 }], finanzen: { savingsAccount: 120000 } })).belegt).toBe(true);
    expect(calculateIPV(person({ children: [{ age: 5 }], finanzen: { savingsAccount: 120001 } })).offen).toBe('vermoegen');
    // Vier Kinder wären 180 000 — gedeckelt auf 150 000
    const vier = [{ age: 4 }, { age: 6 }, { age: 8 }, { age: 10 }];
    expect(calculateIPV(person({ children: vier, finanzen: { savingsAccount: 150001 } })).offen).toBe('vermoegen');
  });

  it('20 Prozent des Vermögens zählen zum massgebenden Einkommen (Art. 12 Abs. 2 Ziff. 1 [2])', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 1000 }));
    const mit = calculateIPV(person({ monthlyIncome: 1000, finanzen: { savingsAccount: 50000 } }));
    expect(mit.annual).toBeLessThan(ohne.annual);
  });

  it('Alter: dieselbe Lesart wie ZH, BE und VD — Jahrgang 2000 rechnet 2026 noch nicht', () => {
    expect(calculateIPV(person({ dob: '1999-05-01' })).belegt).toBe(true);
    expect(calculateIPV(person({ dob: '2000-05-01' })).offen).toBe('alter');
    expect(calculateIPV(person({ dob: '' })).offen).toBe('alter');
  });

  it('Kind ohne erfasstes Alter: keine Zahl', () => {
    expect(calculateIPV(person({ children: [{ age: 0 }] })).offen).toBe('alter');
    expect(calculateIPV(person({ children: [{}] })).offen).toBe('alter');
  });

  it('Kind über 18 und Paare: bewusst nicht gerechnet', () => {
    expect(calculateIPV(person({ children: [{ age: 20 }] })).offen).toBe('haushalt');
    expect(calculateIPV(person({ basis: { maritalStatus: 'married' } })).offen).toBe('haushalt');
    expect(calculateIPV(person({ basis: { maritalStatus: 'cohabiting' } })).offen).toBe('haushalt');
  });

  it('Prämienregion: unbekannte PLZ ergibt keine Zahl', () => {
    expect(calculateIPV(person({ plz: '0000', city: 'Nirgendwo' })).offen).toBe('region');
    expect(calculateIPV(person({ plz: '', city: '' })).offen).toBe('region');
  });

  it('die Region kommt aus den BAG-Daten, wie Art. 1 [1] es vorschreibt', () => {
    expect(calculateIPV(person({ plz: '9000', city: 'St.Gallen' })).region).toBe(1);
    expect(calculateIPV(person({ plz: '9630', city: 'Wattwil' })).region).toBe(3);
  });

  it('über der Grenze: Betrag 0 mit eigenem Satz, ohne Zahl für die Grenze', () => {
    const r = calculateIPV(person({ monthlyIncome: 5000 }));
    expect(r).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.sgKeinAnspruch' });
    expect(r.cantonData.maxIncome).toBe(null);
  });

  it('🛑 «kein Anspruch» und «unter dem Mindestbetrag» sind zwei verschiedene Gründe', () => {
    // Befund der Fachprüfung 20.09.2026: im Band zwischen dem Mindestbetrag und der echten
    // Grenze bestand sehr wohl ein Anspruch — der Satz behauptete aber, die Referenzprämie
    // liege nicht über der Belastungsgrenze. Kein Geld, aber ein falscher Satz.
    // Region 1: roher Anspruch fällt bei me ≈ 38'833 auf 0, unter Fr. 100 ab ≈ 38'414.
    const imBand = ipvStGallenRechnen({ region: 1, personen: ['e'], me: 38500 });
    expect(imBand.total).toBe(0);
    expect(imBand.grund).toBe('mindestbetrag');

    const darueber = ipvStGallenRechnen({ region: 1, personen: ['e'], me: 40000 });
    expect(darueber.total).toBe(0);
    expect(darueber.grund).toBe('ueberGrenze');

    // und bei Anspruch gar kein Grund
    expect(ipvStGallenRechnen({ region: 1, personen: ['e'], me: 10000 }).grund).toBe(null);
  });

  it('der Vorbehalt nennt das Bezugsjahr und die Referenzprämie', () => {
    expect(calculateIPV(person()).vorbehaltKey).toBe('ipv.vorbehaltSG');
    expect(calculateIPV(person()).basisjahr).toBe(2024);
  });
});
