import { describe, it, expect } from 'vitest';
import {
  berechneAltersrente, referenzalterMonate, vergleicheVorbezugAufschub,
  bvgKoordinationsabzug, berechneBVGGuthaben, projiziereVorsorge,
  AHV_PARAMS, BVG_PARAMS, AHV_DATA_VERSION,
  bvgAltersgutschriftSatz, nettoZuBruttoRichtwert, AHV_ALV_ARBEITNEHMER_SATZ,
  aufschubZuschlagProzent,
} from '../ahvRechner.js';

describe('ahvRechner', () => {
  describe('AHV_PARAMS', () => {
    it('has correct 2026 values', () => {
      expect(AHV_PARAMS.minRente).toBe(1260);
      expect(AHV_PARAMS.maxRente).toBe(2520);
      expect(AHV_PARAMS.maxEhepaar).toBe(3780);
      expect(AHV_PARAMS.referenzalter).toBe(65);
      expect(AHV_PARAMS.volleBeitragsjahre).toBe(44);
    });

    it('has correct version', () => {
      expect(AHV_DATA_VERSION).toBe('2026');
    });
  });

  describe('berechneAltersrente', () => {
    it('returns Maximalrente for high income and full contributions', () => {
      const r = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 90720,
        beitragsjahre: 44,
      });
      expect(r.monatsrente).toBe(2520);
      expect(r.jahresrente).toBe(32760); // 13 Auszahlungen ab 2026 (2520 × 13)
      expect(r.dreizehnteRente).toBe(2520);
      expect(r.skalenfaktor).toBe(1);
      expect(r.fehlendeBeitragsjahre).toBe(0);
    });

    it('returns Minimalrente for low income', () => {
      const r = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 15120,
        beitragsjahre: 44,
      });
      expect(r.monatsrente).toBe(1260);
    });

    it('scales down with fewer contribution years', () => {
      const full = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 60000,
        beitragsjahre: 44,
      });
      const partial = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 60000,
        beitragsjahre: 22,
      });
      expect(partial.monatsrente).toBeCloseTo(full.monatsrente * 0.5, 0);
      expect(partial.skalenfaktor).toBeCloseTo(0.5);
    });

    it('reduces pension for early withdrawal (Vorbezug)', () => {
      const normal = berechneAltersrente({
        geburtsjahr: 1963,
        durchschnittlichesJahreseinkommen: 80000,
        beitragsjahre: 44,
      });
      const early = berechneAltersrente({
        geburtsjahr: 1963,
        durchschnittlichesJahreseinkommen: 80000,
        beitragsjahre: 44,
        bezugAlter: 63,
      });
      expect(early.monatsrente).toBeLessThan(normal.monatsrente);
      expect(early.vorbezugAufschub).toBeLessThan(0);
    });

    it('increases pension for deferred withdrawal (Aufschub)', () => {
      const normal = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 80000,
        beitragsjahre: 44,
      });
      const deferred = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 80000,
        beitragsjahre: 44,
        bezugAlter: 68,
      });
      expect(deferred.monatsrente).toBeGreaterThan(normal.monatsrente);
      expect(deferred.vorbezugAufschub).toBeGreaterThan(0);
    });

    it('caps married couple pensions (Plafonierung)', () => {
      const r = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 90720,
        beitragsjahre: 44,
        verheiratet: true,
        einkommenPartner: 90720,
      });
      expect(r.plafoniert).toBe(true);
      expect(r.totalEhepaar).toBeLessThanOrEqual(3780);
    });

    // K14: 13. Altersrente = ein Zwölftel der im Kalenderjahr BEZOGENEN Altersrente
    // (Art. 34ter Abs. 2 AHVG, Fassung 1.1.2026, Fedlex abgerufen 15.09.2026). Art. 35 AHVG
    // nimmt nur den Zuschlag nach Art. 34bis von der Kürzung aus, nicht Art. 34ter → bei
    // Ehepaaren wird die 13. Rente auf der plafonierten Rente gerechnet (BSV-Merkblatt 3.01,
    // Stand 1.1.2026, Ziff. 4 + 23).
    it('13. Altersrente bei Ehepaaren auf der plafonierten Rente (Art. 34ter AHVG)', () => {
      const r = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 90720,
        beitragsjahre: 44,
        verheiratet: true,
        einkommenPartner: 90720,
      });
      expect(r.plafoniert).toBe(true);
      expect(r.monatsrente).toBe(1890); // 3780 ÷ 2
      expect(r.dreizehnteRente).toBe(r.monatsrente);
      expect(r.jahresrente).toBe(1890 * 13);
    });

    it('adds Erziehungsgutschriften', () => {
      const ohne = berechneAltersrente({
        geburtsjahr: 1970,
        durchschnittlichesJahreseinkommen: 50000,
        beitragsjahre: 44,
      });
      const mit = berechneAltersrente({
        geburtsjahr: 1970,
        durchschnittlichesJahreseinkommen: 50000,
        beitragsjahre: 44,
        erziehungsjahre: 16,
      });
      expect(mit.monatsrente).toBeGreaterThan(ohne.monatsrente);
      expect(mit.erziehungsgutschrift).toBeGreaterThan(0);
    });

    it('returns zero for zero income', () => {
      const r = berechneAltersrente({
        geburtsjahr: 1961,
        durchschnittlichesJahreseinkommen: 0,
        beitragsjahre: 44,
      });
      expect(r.monatsrente).toBe(0);
    });
  });

  describe('referenzalterMonate (AHV 21)', () => {
    // Referenzalter-Staffel Frauen — belegt: BSV FAQ „Wie wird das Frauenrentenalter
    // erhöht?" / AHV-IV-Merkblatt 31 (Stand 2026).
    it('Männer: immer 780 Monate (65 J)', () => {
      expect(referenzalterMonate({ geschlecht: 'male', geburtsjahr: 1960 })).toBe(780);
      expect(referenzalterMonate({ geschlecht: 'male', geburtsjahr: 1963 })).toBe(780);
    });
    it('Frauen Übergangsgeneration: gestaffelt 1961–1963', () => {
      expect(referenzalterMonate({ geschlecht: 'female', geburtsjahr: 1960 })).toBe(768); // 64 J
      expect(referenzalterMonate({ geschlecht: 'female', geburtsjahr: 1961 })).toBe(771); // 64 J 3 M
      expect(referenzalterMonate({ geschlecht: 'female', geburtsjahr: 1962 })).toBe(774); // 64 J 6 M
      expect(referenzalterMonate({ geschlecht: 'female', geburtsjahr: 1963 })).toBe(777); // 64 J 9 M
      expect(referenzalterMonate({ geschlecht: 'female', geburtsjahr: 1964 })).toBe(780); // 65 J
      expect(referenzalterMonate({ geschlecht: 'female', geburtsjahr: 1975 })).toBe(780);
    });
    it('divers / unbekanntes Geschlecht → Fallback 780 (65 J)', () => {
      expect(referenzalterMonate({ geschlecht: 'diverse', geburtsjahr: 1962 })).toBe(780);
      expect(referenzalterMonate({ geburtsjahr: 1962 })).toBe(780);
      expect(referenzalterMonate({})).toBe(780);
      expect(referenzalterMonate()).toBe(780);
    });
  });

  describe('berechneAltersrente — Referenzalter Frauen (AHV 21)', () => {
    const base = { durchschnittlichesJahreseinkommen: 80000, beitragsjahre: 44 };
    it('Frau JG 1962, Bezug 63: kleinerer Vorbezugs-Abschlag als beim Mann (Referenz 64 J 6 M statt 65)', () => {
      const frau = berechneAltersrente({ ...base, geschlecht: 'female', geburtsjahr: 1962, bezugAlter: 63 });
      const mann = berechneAltersrente({ ...base, geschlecht: 'male', geburtsjahr: 1962, bezugAlter: 63 });
      expect(Math.abs(frau.vorbezugAufschub)).toBeLessThan(Math.abs(mann.vorbezugAufschub));
      expect(frau.monatsrente).toBeGreaterThan(mann.monatsrente);
      expect(frau.referenzalterMonate).toBe(774);
    });
    it('Frau JG 1962 ohne Bezugsalter steht auf ihrem Referenzalter → kein Abschlag', () => {
      const r = berechneAltersrente({ ...base, geschlecht: 'female', geburtsjahr: 1962 });
      expect(r.vorbezugAufschub).toBe(0);
      expect(r.referenzalterMonate).toBe(774);
    });
    it('Mann bleibt unverändert (Referenz 780, identisch zum geschlechtslosen Default)', () => {
      const mitGeschlecht = berechneAltersrente({ ...base, geschlecht: 'male', geburtsjahr: 1962, bezugAlter: 63 });
      const ohne = berechneAltersrente({ ...base, geburtsjahr: 1962, bezugAlter: 63 });
      expect(mitGeschlecht.monatsrente).toBe(ohne.monatsrente);
      expect(mitGeschlecht.vorbezugAufschub).toBe(ohne.vorbezugAufschub);
    });
  });

  describe('aufschubZuschlagProzent — Art. 55ter Abs. 1 AHVV (SR 831.101)', () => {
    // Werte wörtlich aus der Tabelle in Art. 55ter Abs. 1 AHVV (Fassung in Kraft seit
    // 1.1.2025, konsolidierter Stand 1.1.2026), identisch im BSV-Merkblatt 3.04 Ziff. 14.
    it('Jahreswerte: 1 J 5,2 · 2 J 10,8 · 3 J 17,1 · 4 J 24,0 · 5 J 31,5', () => {
      expect(aufschubZuschlagProzent(12)).toBe(5.2);
      expect(aufschubZuschlagProzent(24)).toBe(10.8);
      expect(aufschubZuschlagProzent(36)).toBe(17.1);
      expect(aufschubZuschlagProzent(48)).toBe(24.0);
      expect(aufschubZuschlagProzent(60)).toBe(31.5);
    });
    it('Monatsgruppen 0–2 / 3–5 / 6–8 / 9–11 innerhalb eines Jahres', () => {
      expect(aufschubZuschlagProzent(14)).toBe(5.2);  // 1 J 2 M → Gruppe 0–2
      expect(aufschubZuschlagProzent(15)).toBe(6.6);  // 1 J 3 M
      expect(aufschubZuschlagProzent(17)).toBe(6.6);  // 1 J 5 M
      expect(aufschubZuschlagProzent(18)).toBe(8.0);  // 1 J 6 M
      expect(aufschubZuschlagProzent(23)).toBe(9.4);  // 1 J 11 M
      expect(aufschubZuschlagProzent(30)).toBe(13.9); // 2 J 6 M
      expect(aufschubZuschlagProzent(41)).toBe(18.8); // 3 J 5 M → Spalte 3–5 (Zeile 3: 17,1 · 18,8 · 20,5 · 22,2)
      expect(aufschubZuschlagProzent(42)).toBe(20.5); // 3 J 6 M → Spalte 6–8
      expect(aufschubZuschlagProzent(59)).toBe(29.6); // 4 J 11 M
    });
    it('unter der Mindestdauer von einem Jahr (Art. 39 Abs. 1 AHVG) kein Zuschlag', () => {
      expect(aufschubZuschlagProzent(0)).toBe(0);
      expect(aufschubZuschlagProzent(6)).toBe(0);
      expect(aufschubZuschlagProzent(11)).toBe(0);
    });
    it('über fünf Jahre gedeckelt auf 31,5; Unfug → 0', () => {
      expect(aufschubZuschlagProzent(72)).toBe(31.5);
      expect(aufschubZuschlagProzent(-5)).toBe(0);
      expect(aufschubZuschlagProzent(NaN)).toBe(0);
    });
    it('berechneAltersrente nutzt die Tabelle: Aufschub 65→70 = +31,5 %, 65→66 = +5,2 %', () => {
      const base = { geburtsjahr: 1961, geschlecht: 'male', durchschnittlichesJahreseinkommen: 80000, beitragsjahre: 44 };
      const ref = berechneAltersrente({ ...base });
      const plus5 = berechneAltersrente({ ...base, bezugAlter: 70 });
      const plus1 = berechneAltersrente({ ...base, bezugAlter: 66 });
      expect(plus5.vorbezugAufschub).toBe(31.5);
      expect(plus5.monatsrente).toBe(Math.round(ref.monatsrente * 1.315 * 100) / 100);
      expect(plus1.vorbezugAufschub).toBe(5.2);
      expect(ref.vorbezugAufschub).toBe(0);
    });
    it('Frau JG 1962 (Referenz 64 J 6 M), Bezug 65 = 6 Monate → unter Mindestdauer, 0 %', () => {
      const r = berechneAltersrente({ geburtsjahr: 1962, geschlecht: 'female', durchschnittlichesJahreseinkommen: 80000, beitragsjahre: 44, bezugAlter: 65 });
      expect(r.vorbezugAufschub).toBe(0);
    });
    it('Vorbezug bleibt linear 6,8 %/Jahr (nicht angefasst)', () => {
      const base = { geburtsjahr: 1961, geschlecht: 'male', durchschnittlichesJahreseinkommen: 80000, beitragsjahre: 44 };
      expect(berechneAltersrente({ ...base, bezugAlter: 64 }).vorbezugAufschub).toBe(-6.8);
      expect(berechneAltersrente({ ...base, bezugAlter: 63 }).vorbezugAufschub).toBe(-13.6);
    });
  });

  describe('vergleicheVorbezugAufschub', () => {
    it('returns comparison for ages 63–70', () => {
      const vergleich = vergleicheVorbezugAufschub(80000, 44);
      expect(vergleich.length).toBe(8);
      expect(vergleich[0].bezugAlter).toBe(63);
      expect(vergleich[vergleich.length - 1].bezugAlter).toBe(70);

      // Each later age should have higher pension
      for (let i = 1; i < vergleich.length; i++) {
        expect(vergleich[i].monatsrente).toBeGreaterThan(vergleich[i - 1].monatsrente);
      }
    });
  });

  describe('bvgKoordinationsabzug', () => {
    it('returns not insured below threshold', () => {
      const r = bvgKoordinationsabzug(20000);
      expect(r.versichert).toBe(false);
    });

    it('calculates coordinated salary', () => {
      const r = bvgKoordinationsabzug(80000);
      expect(r.versichert).toBe(true);
      expect(r.koordinierterLohn).toBe(80000 - 26460);
      expect(r.koordinationsabzug).toBe(26460);
    });

    it('caps at maximum', () => {
      const r = bvgKoordinationsabzug(200000);
      expect(r.koordinierterLohn).toBe(64260);
    });
  });

  describe('berechneBVGGuthaben', () => {
    it('returns not insured below threshold', () => {
      const r = berechneBVGGuthaben({ alter: 25, jahresbruttolohn: 15000 });
      expect(r.versichert).toBe(false);
    });

    it('calculates pension accumulation', () => {
      const r = berechneBVGGuthaben({
        alter: 25,
        jahresbruttolohn: 80000,
        aktuellesGuthaben: 0,
        austrittsalter: 65,
      });
      expect(r.versichert).toBe(true);
      expect(r.guthaben).toBeGreaterThan(100000);
      expect(r.monatsrente).toBeGreaterThan(0);
      expect(r.umwandlungssatz).toBe(6.8);
      expect(r.jahresDetail.length).toBe(40);
    });

    it('uses correct contribution rates by age', () => {
      const r = berechneBVGGuthaben({
        alter: 25,
        jahresbruttolohn: 80000,
        austrittsalter: 65,
      });
      expect(r.jahresDetail[0].gutschriftSatz).toBe(7);  // age 25
      expect(r.jahresDetail[10].gutschriftSatz).toBe(10); // age 35
      expect(r.jahresDetail[20].gutschriftSatz).toBe(15); // age 45
      expect(r.jahresDetail[30].gutschriftSatz).toBe(18); // age 55
    });

    it('includes existing balance', () => {
      const ohne = berechneBVGGuthaben({ alter: 40, jahresbruttolohn: 80000 });
      const mit = berechneBVGGuthaben({ alter: 40, jahresbruttolohn: 80000, aktuellesGuthaben: 100000 });
      expect(mit.guthaben).toBeGreaterThan(ohne.guthaben + 100000); // wegen Zinseszins
    });

    it('nutzt den PK-eigenen Umwandlungssatz, wenn plausibel angegeben', () => {
      const base = { alter: 40, jahresbruttolohn: 80000, aktuellesGuthaben: 200000 };
      const min = berechneBVGGuthaben(base);
      const eigen = berechneBVGGuthaben({ ...base, umwandlungssatz: 5.2 });
      expect(eigen.umwandlungssatz).toBe(5.2);
      expect(eigen.jahresrente).toBe(Math.round(eigen.guthaben * 5.2 / 100));
      // Tieferer Satz → tiefere Rente bei gleichem Guthaben.
      expect(eigen.monatsrente).toBeLessThan(min.monatsrente);
    });

    it('fällt bei unplausiblem Umwandlungssatz ruhig auf den Mindestsatz zurück', () => {
      const base = { alter: 40, jahresbruttolohn: 80000, aktuellesGuthaben: 200000 };
      expect(berechneBVGGuthaben({ ...base, umwandlungssatz: 0 }).umwandlungssatz).toBe(6.8);
      expect(berechneBVGGuthaben({ ...base, umwandlungssatz: 42 }).umwandlungssatz).toBe(6.8);
      expect(berechneBVGGuthaben({ ...base, umwandlungssatz: NaN }).umwandlungssatz).toBe(6.8);
    });
  });

  describe('BVG_PARAMS', () => {
    it('has correct 2026 values', () => {
      expect(BVG_PARAMS.mindestzins).toBe(1.25);
      expect(BVG_PARAMS.umwandlungssatz).toBe(6.8);
      expect(BVG_PARAMS.eintrittsschwelle).toBe(22680);
      expect(BVG_PARAMS.koordinationsabzug).toBe(26460);
      expect(BVG_PARAMS.gutschriften.length).toBe(4);
    });
  });

  describe('projiziereVorsorge', () => {
    it('Zeitachse hat n+1 Punkte (heute + je ein Jahr bis Rücktritt)', () => {
      const r = projiziereVorsorge({ alter: 40, austrittsalter: 65 });
      expect(r.timeline.length).toBe(26);
      expect(r.timeline[0].alter).toBe(40);
      expect(r.timeline[25].alter).toBe(65);
    });

    it('Startpunkt (t=0) spiegelt die heutigen Guthaben', () => {
      const r = projiziereVorsorge({ alter: 50, austrittsalter: 65, bvgHeute: 50000, s3aBalance: 20000, s3bBalance: 5000 });
      expect(r.timeline[0]).toMatchObject({ bvg: 50000, s3a: 20000, s3b: 5000, total: 75000 });
      expect(r.startsumme.total).toBe(75000);
    });

    it('Rendite 0 % → linearer Aufbau (Bestand + n·Beitrag)', () => {
      const r = projiziereVorsorge({ alter: 60, austrittsalter: 65, s3aBalance: 20000, s3aAnnual: 1000, s3aRendite: 0 });
      // 5 Jahre × 1000 auf 20000
      expect(r.endsumme.s3a).toBe(25000);
    });

    it('Beitrag 0 → reiner Zinseszins', () => {
      const r = projiziereVorsorge({ alter: 62, austrittsalter: 65, s3aBalance: 10000, s3aAnnual: 0, s3aRendite: 2 });
      // 10000 · 1.02^3 = 10612.08 → jährlich gerundet 10612
      expect(r.endsumme.s3a).toBe(10612);
    });

    it('Zins auf Anfangsbestand, Beitrag danach (Konvention wie BVG)', () => {
      const r = projiziereVorsorge({ alter: 64, austrittsalter: 65, s3aBalance: 10000, s3aAnnual: 5000, s3aRendite: 1 });
      // Jahr 1: 10000 + 100 (Zins) + 5000 = 15100
      expect(r.timeline[1].s3a).toBe(15100);
    });

    it('BVG-Reihe wird jahresweise durchgereicht', () => {
      const r = projiziereVorsorge({ alter: 62, austrittsalter: 65, bvgHeute: 40000, bvgSerie: [50000, 60000, 70000] });
      expect(r.timeline[0].bvg).toBe(40000);
      expect(r.timeline[1].bvg).toBe(50000);
      expect(r.timeline[3].bvg).toBe(70000);
      expect(r.endsumme.bvg).toBe(70000);
    });

    it('startjahr steuert die Jahreszahlen', () => {
      const r = projiziereVorsorge({ alter: 40, austrittsalter: 42, startjahr: 2026 });
      expect(r.timeline[0].jahr).toBe(2026);
      expect(r.endsumme.jahr).toBe(2028);
    });

    it('total ist immer die Summe der drei Säulen', () => {
      const r = projiziereVorsorge({ alter: 45, austrittsalter: 65, bvgHeute: 30000, bvgSerie: [], s3aBalance: 10000, s3aAnnual: 3000, s3bBalance: 2000, s3bAnnual: 500 });
      for (const p of r.timeline) {
        expect(p.total).toBe(p.bvg + p.s3a + p.s3b);
      }
    });
  });
});

describe('nettoZuBruttoRichtwert — Netto→Brutto-Schätzung (AHV/ALV + PK nach Alter)', () => {
  it('Satz AHV/IV/EO+ALV = 6.4%; Altersgutschrift-Staffel nach Art. 16 BVG', () => {
    expect(AHV_ALV_ARBEITNEHMER_SATZ).toBe(0.064);
    expect(bvgAltersgutschriftSatz(30)).toBe(7);
    expect(bvgAltersgutschriftSatz(40)).toBe(10);
    expect(bvgAltersgutschriftSatz(50)).toBe(15);
    expect(bvgAltersgutschriftSatz(60)).toBe(18);
    expect(bvgAltersgutschriftSatz(22)).toBe(0);  // unter 25: keine Sparbeiträge
    expect(bvgAltersgutschriftSatz(undefined)).toBe(0);
  });

  it('ohne Alter (keine PK) = reiner AHV/ALV-Richtwert netto/0.936', () => {
    expect(nettoZuBruttoRichtwert(2400)).toBe(Math.round(2400 / 0.936)); // 2564
  });

  it('tiefer Lohn unter der BVG-Eintrittsschwelle: PK=0 auch mit Alter', () => {
    // 1500/Mt. = 18'000/Jahr < 22'680 Eintrittsschwelle → keine PK
    expect(nettoZuBruttoRichtwert(1500, 40)).toBe(Math.round(1500 / 0.936));
  });

  it('mittlerer Lohn mit Alter: Brutto liegt über dem reinen AHV/ALV-Wert (PK kommt dazu)', () => {
    const ohnePK = Math.round(5000 / 0.936);       // 5342
    const mitPK = nettoZuBruttoRichtwert(5000, 40); // + PK
    expect(mitPK).toBeGreaterThan(ohnePK);
    // Plausibel: netto 5000 @ 40 → grob 5450–5600 brutto
    expect(mitPK).toBeGreaterThan(5400);
    expect(mitPK).toBeLessThan(5650);
  });

  it('Richtung + Guards: immer über dem Netto, nie negativ', () => {
    expect(nettoZuBruttoRichtwert(3000, 50)).toBeGreaterThan(3000);
    expect(nettoZuBruttoRichtwert(0, 40)).toBe(0);
    expect(nettoZuBruttoRichtwert(-100, 40)).toBe(0);
  });
});

// ─── Gegenrichtung brutto→netto (25.09.2026) ─────────────────────────────────
import { bruttoZuNettoRichtwert } from '../ahvRechner.js';

describe('bruttoZuNettoRichtwert — dieselben Abzüge wie netto→brutto', () => {
  it('unter der BVG-Schwelle nur AHV/ALV (6.4 %)', () => {
    expect(bruttoZuNettoRichtwert(1500, 40)).toBe(Math.round(1500 * (1 - 0.064)));
  });
  it('hin und zurück trifft sich (±1 Franken Rundung), über Alter und Lohnhöhen', () => {
    for (const alter of [undefined, 22, 30, 40, 50, 60]) {
      for (const netto of [1800, 3000, 4500, 6200, 9000, 14000]) {
        const brutto = nettoZuBruttoRichtwert(netto, alter);
        expect(Math.abs(bruttoZuNettoRichtwert(brutto, alter) - netto)).toBeLessThanOrEqual(1);
      }
    }
  });
  it('mit Alter liegt das Netto tiefer als ohne (PK-Anteil)', () => {
    expect(bruttoZuNettoRichtwert(7000, 50)).toBeLessThan(bruttoZuNettoRichtwert(7000));
  });
  it('leer oder negativ → 0', () => {
    expect(bruttoZuNettoRichtwert('')).toBe(0);
    expect(bruttoZuNettoRichtwert(-100)).toBe(0);
  });
});

describe('Korrekturen Fachprüfung 25.09.2026 (brutto↔netto)', () => {
  it('ALV nur bis zum Höchstbetrag 148 200/Jahr', () => {
    // ohne Alter keine PK: 15 000 − 5.3 % − 1.1 % × 12 350
    expect(bruttoZuNettoRichtwert(15000)).toBe(Math.round(15000 - 15000 * 0.053 - 12350 * 0.011));
  });
  it('im Rentenalter: nur AHV/IV/EO über dem Freibetrag 1 400/Monat', () => {
    expect(bruttoZuNettoRichtwert(2000, 67, true)).toBe(Math.round(2000 - 600 * 0.053)); // 1968
    expect(bruttoZuNettoRichtwert(1200, 67, true)).toBe(1200);
    expect(nettoZuBruttoRichtwert(1968, 67, true)).toBe(2000);
  });
  it('BVG: genau 22 680 ist befreit (Art. 2 Abs. 1 «mehr als»)', () => {
    expect(bvgKoordinationsabzug(22680).versichert).toBe(false);
    expect(bvgKoordinationsabzug(22681).versichert).toBe(true);
  });
  it('an der Eintrittsschwelle passt die Rückrechnung (Alter 58, netto 1 769)', () => {
    const b = nettoZuBruttoRichtwert(1769, 58);
    expect(Math.abs(bruttoZuNettoRichtwert(b, 58) - 1769)).toBeLessThanOrEqual(1);
  });
});
