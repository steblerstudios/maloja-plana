import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_GE, ipvGenfRechnen, geGrenzen, geAntragUnter, geBerufskostenPauschale, geRdu, hatWohneigentum } from '../ipvGenf.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV } from '../cantonalData.js';

// K31 — Prämienverbilligung Kanton Genf 2026 («subsides d'assurance-maladie»).
// Quellen (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt GE:
//   [1] «BAREME SUBSIDES 2026», Département de la cohésion sociale — jede Zelle unten steht dort
//   [2] LaLAMal rsGE J 3 05 (Stand 02.11.2024) — Art. 20, 21, 22, 23, 33
//   [3] RaLAMal rsGE J 3 05.01 (Stand 01.01.2025) — Art. 9, 9A, 9B, 10, 10A, 13B, 13C
//   [4] LRDU rsGE J 4 06 (Stand 01.01.2025) — Art. 4, 5, 6, 8 Abs. 2, 9
//   [5] ge.ch «Demander un subside 2026», Unterseiten «RDU particulièrement bas» und «fortune brute sup. à 250'000» (18.09.2026)
//   [6] ge.ch Communiqué du Conseil d'Etat du 5 novembre 2025 — Indexsätze 8,7 / 5,3 / 10,9 %
//   [7] LIPP rsGE D 3 08 (Stand 01.01.2026) — Art. 18, 26, 29 Abs. 2, 31
//
// Genf rechnet in Gruppen: ein fester Monatsbetrag je Gruppe und erwachsene Person, je Kind ein
// fester Betrag, und die Gruppengrenzen hängen an der Haushaltsform. Die Tests prüfen jede Zelle
// des Barème [1] — Grenze, Grenze + 1 und Haushaltssumme — statt die Formel zu glauben.

// [1] wörtlich: je Zeile die oberen Gruppengrenzen (RDU, CHF/Jahr) und die Haushaltssummen
// (CHF/Monat) der Gruppen 1–9. Nur die Zeilen, die die App rechnet (eine erwachsene Person).
const BAREME = [
  { zeile: 'Personne seule sans enfant', kinder: 0,
    grenzen: [30000, 35000, 37500, 40000, 42500, 45000, 47500, 50000],
    total: [348, 294, 240, 196, 164, 120, 87, 55] },
  { zeile: 'Personne seule + 1 enfant', kinder: 1,
    grenzen: [51000, 61000, 71000, 81000, 91000, 101000, 111000, 121000, 151000],
    total: [480, 426, 372, 328, 296, 252, 219, 187, 67] },
  { zeile: 'Personne seule + 2 enfants', kinder: 2,
    grenzen: [57000, 67000, 77000, 87000, 97000, 107000, 117000, 127000, 157000],
    total: [612, 558, 504, 460, 428, 384, 351, 319, 134] },
  { zeile: 'Personne seule + 3 enfants', kinder: 3,
    grenzen: [63000, 73000, 83000, 93000, 103000, 113000, 123000, 133000, 163000],
    total: [744, 690, 636, 592, 560, 516, 483, 451, 201] },
  { zeile: 'Personne seule + 4 enfants', kinder: 4,
    grenzen: [69000, 79000, 89000, 99000, 109000, 119000, 129000, 139000, 169000],
    total: [876, 822, 768, 724, 692, 648, 615, 583, 268] },
];

// Der RDU der App aus einem Monatslohn ohne weitere Posten: ×12, minus Berufskosten-Pauschale
// (3 %, 600–1'700). Nachgerechnet, nicht geglaubt — der Test darunter pinnt die Pauschale selbst.
const rduAusLohn = (m) => m * 12 - Math.min(1700, Math.max(600, 0.03 * m * 12));

describe('K31 calculateIPV für GE, bevor das GE-Modul geladen ist', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'GE', dateOfBirth: '1980-05-01' }, finanzen: {}, wohnen: { postalCode: '1204' }, versicherungen: { kkPremium: 500 } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 GE: die Konstanten 2026, wörtlich aus [1], [2], [3], [7]', () => {
  it('Gruppengrenzen Art. 21 Abs. 1 [2]: assuré seul und couple', () => {
    expect(IPV_GE.grenzen.allein).toEqual([30000, 35000, 37500, 40000, 42500, 45000, 47500, 50000]);
    expect(IPV_GE.grenzen.paar).toEqual([45000, 55000, 65000, 75000, 85000, 95000, 105000, 115000]);
    expect(IPV_GE.jeUnterhaltspflicht).toBe(6000);           // Abs. 2
    expect(IPV_GE.gruppe9).toEqual({ grenze: 151000, jeWeitere: 6000 }); // Abs. 7/8
  });

  it('Monatsbeträge [1]: Erwachsene 348 … 55, Kind 132 / 67, junge Erwachsene 231 / 106', () => {
    expect(IPV_GE.erwachsene).toEqual([348, 294, 240, 196, 164, 120, 87, 55]);
    expect(IPV_GE.kind).toEqual({ gruppe1bis8: 132, gruppe9: 67 });
    expect(IPV_GE.jungeErwachsene).toEqual({ gruppe1bis8: 231, gruppe9: 106, jahrgaenge: [2001, 2007] });
  });

  // Art. 9B [3]: die Gesetzesbeträge (Art. 22 [2], Stand Dezember 2024) werden jährlich indexiert und
  // «arrondis au franc supérieur». Der Arrêté-Beleg ist das Communiqué vom 5.11.2025 [6]: drei Sätze
  // auf Basis 2024 — Erwachsene 8,7 %, junge Erwachsene 5,3 %, Kinder 10,9 % — und die Tabelle
  // aller Beträge. Hier wird jeder der zehn Beträge aus Gesetzesbetrag × Satz nachgerechnet.
  it('alle zehn Beträge 2026 = Gesetzesbetrag × Indexsatz [6], aufgerundet', () => {
    expect(IPV_GE.gesetzErwachsene).toEqual([320, 270, 220, 180, 150, 110, 80, 50]);
    expect(IPV_GE.indexierung).toEqual({ erwachsene: 0.087, jungeErwachsene: 0.053, kinder: 0.109 });
    expect(IPV_GE.gesetzGruppe9).toEqual({ kind: 60, jungeErwachsene: 100 });
    const auf = (betrag, satz) => Math.ceil(betrag * (1 + satz) - 1e-9);
    IPV_GE.gesetzErwachsene.forEach((g, i) => expect(auf(g, IPV_GE.indexierung.erwachsene)).toBe(IPV_GE.erwachsene[i]));
    expect(auf(IPV_GE.gesetzGruppe9.kind, IPV_GE.indexierung.kinder)).toBe(IPV_GE.kind.gruppe9);                 // 66.54 → 67
    expect(auf(IPV_GE.gesetzGruppe9.jungeErwachsene, IPV_GE.indexierung.jungeErwachsene)).toBe(IPV_GE.jungeErwachsene.gruppe9); // 105.3 → 106
    // und die Probe ist nicht trivial: mit einem Einheitssatz ginge Gruppe 9 nicht auf
    expect(auf(60, 0.087)).toBe(66);
    expect(auf(100, 0.087)).toBe(109);
  });

  it('übrige Werte: 1/15 Vermögen [4], 250 000 Bruttovermögen, 15 000 / 20 000 + 3 000, Frist 30.11. [3], Berufskosten [7]', () => {
    expect(IPV_GE.vermoegenAnteil).toBeCloseTo(1 / 15, 12);
    expect(IPV_GE.vermoegenBruttoGrenze).toBe(250000);
    expect(IPV_GE.antragUnter).toEqual({ allein: 15000, paar: 20000, jeUnterhaltspflicht: 3000 });
    expect(IPV_GE.antragsfrist).toEqual({ monat: 11, tag: 30 });
    expect(IPV_GE.berufskosten).toEqual({ satz: 0.03, min: 600, max: 1700 });
    expect(IPV_GE.jahr).toBe(2026);
    expect(IPV_GE.basisjahrAbstand).toBe(2);
  });

  it('Register: belegt mit Quelle, keine Musterwerte, Grenze kommt aus dem Modul, Weg «in der Regel automatisch»', () => {
    expect(CANTONAL_IPV.GE.beleg.quelle).toMatch(/LaLAMal/);
    expect(CANTONAL_IPV.GE.beleg.quelle).toMatch(/Barème/);
    expect(CANTONAL_IPV.GE.beleg.stand).toMatch(/2026/);
    expect(CANTONAL_IPV.GE.maxIncome).toBeNull();
    expect(CANTONAL_IPV.GE.subsidySingle).toBeNull();
    expect(CANTONAL_IPV.GE.subsidyFamily).toBeNull();
    expect(CANTONAL_IPV.GE.subsidyChild).toBeNull();
    // Rechtsprüfung 28.09.2026: nicht mehr `ipv.noteAutoSam` ohne Einschränkung.
    expect(CANTONAL_IPV.GE.noteKey).toBe('ipv.geWegAutomatisch');
  });
});

describe('K31 GE: Gruppengrenzen je Haushaltsform (Art. 21 Abs. 2 und 4 [2])', () => {
  it('ohne Kinder die Spalte «assuré seul», keine Gruppe 9', () => {
    expect(geGrenzen(0)).toEqual({ gruppen: IPV_GE.grenzen.allein, gruppe9: null });
  });

  it.each(BAREME.filter((z) => z.kinder > 0))('$zeile: Paar-Spalte + 6 000 je Kind, Gruppe 9 = 151 000 + 6 000 je weiteres', ({ kinder, grenzen }) => {
    const g = geGrenzen(kinder);
    expect(g.gruppen).toEqual(grenzen.slice(0, 8));
    expect(g.gruppe9).toBe(grenzen[8]);
    // und die Herleitung, nicht nur das Ergebnis: Paar + 6 000 × Kinder
    expect(g.gruppen).toEqual(IPV_GE.grenzen.paar.map((x) => x + 6000 * kinder));
    expect(g.gruppe9).toBe(151000 + 6000 * (kinder - 1));
  });

  it('fünf Kinder: über das Barème hinaus nach Art. 21 Abs. 2/8 weitergerechnet', () => {
    expect(geGrenzen(5)).toEqual({ gruppen: IPV_GE.grenzen.paar.map((x) => x + 30000), gruppe9: 175000 });
  });
});

describe('K31 GE-Modell gegen jede Zelle des Barème 2026 [1]', () => {
  for (const { zeile, kinder, grenzen, total } of BAREME) {
    describe(zeile, () => {
      grenzen.forEach((obere, i) => {
        const untere = i === 0 ? 0 : grenzen[i - 1] + 1;
        it(`Gruppe ${i + 1}: RDU ${untere} bis ${obere} → CHF ${total[i]}/Monat`, () => {
          for (const rdu of [untere, (untere + obere) / 2, obere]) {
            const r = ipvGenfRechnen({ rdu, kinderZahl: kinder });
            expect(r.gruppe).toBe(i + 1);
            expect(r.monat).toBe(total[i]);
            expect(r.annual).toBe(total[i] * 12);
          }
        });
      });

      it('jede Grenze + 1 Franken ist die nächste Gruppe; über der letzten nichts', () => {
        grenzen.forEach((obere, i) => {
          const r = ipvGenfRechnen({ rdu: obere + 1, kinderZahl: kinder });
          if (i < grenzen.length - 1) {
            expect(r.gruppe).toBe(i + 2);
            expect(r.monat).toBe(total[i + 1]);
          } else {
            expect(r).toMatchObject({ gruppe: null, monat: 0, annual: 0 });
          }
        });
        // die letzte Grenze ist die, bis zu der überhaupt etwas gezahlt wird
        expect(ipvGenfRechnen({ rdu: 0, kinderZahl: kinder }).grenze).toBe(grenzen[grenzen.length - 1]);
      });

      it('Erwachsenen- und Kinderanteil getrennt: Summe = Zelle, Kind 132 (Gruppe 1–8) bzw. 67 (Gruppe 9)', () => {
        grenzen.forEach((obere, i) => {
          const r = ipvGenfRechnen({ rdu: obere, kinderZahl: kinder });
          expect(r.erwachseneMonat + kinder * r.kindMonat).toBe(total[i]);
          expect(r.kindMonat).toBe(i === 8 ? 67 : 132);
          expect(r.erwachseneMonat).toBe(i === 8 ? 0 : IPV_GE.erwachsene[i]);
          expect(r.nurKinder).toBe(i === 8);
        });
      });
    });
  }

  it('RDU 0 und negativ: Gruppe 1, nie mehr als der Höchstbetrag (RaLAMal Art. 9A [3])', () => {
    expect(ipvGenfRechnen({ rdu: 0 })).toMatchObject({ gruppe: 1, monat: 348, annual: 4176, maximal: 4176, erwachseneMaximal: 4176 });
    expect(ipvGenfRechnen({ rdu: -20000 }).monat).toBe(348);
    expect(ipvGenfRechnen({ rdu: 0, kinderZahl: 2 })).toMatchObject({ monat: 612, maximal: 612 * 12, erwachseneMaximal: 4176 });
  });

  // GEWÄHLT (Modulkopf): ob der SAM den RDU rundet, sagt keine Quelle; die App vergleicht ungerundet.
  it('Nachkommastellen: 30 000.50 liegt über 30 000 und ist Gruppe 2 (gewählte Lesart, ungerundet)', () => {
    expect(ipvGenfRechnen({ rdu: 30000.5 }).gruppe).toBe(2);
    expect(ipvGenfRechnen({ rdu: 29999.5 }).gruppe).toBe(1);
  });
});

describe('K31 GE: der RDU der App (LRDU Art. 4–8 [4], LIPP Art. 18/26/29 [7])', () => {
  it('Berufskosten-Pauschale: 3 %, mindestens 600, höchstens 1 700, nur bei Erwerbseinkommen', () => {
    expect(geBerufskostenPauschale(0)).toBe(0);
    expect(geBerufskostenPauschale(10000)).toBe(600);      // 3 % = 300 → Minimum
    expect(geBerufskostenPauschale(20000)).toBe(600);      // 3 % = 600 → genau das Minimum
    expect(geBerufskostenPauschale(30000)).toBe(900);
    expect(geBerufskostenPauschale(56666)).toBeCloseTo(1699.98, 2);
    expect(geBerufskostenPauschale(60000)).toBe(1700);     // 3 % = 1 800 → Maximum
    expect(geBerufskostenPauschale(-5)).toBe(0);
  });

  it('Sockel: Netto − Pauschale + Vermögen/15 (Familienzulagen und Alimente bewusst nicht — Rahmen-Ruling)', () => {
    expect(geRdu({ netto: 30000, erwerb: 30000 })).toBe(29100);
    expect(geRdu({ netto: 30000, erwerb: 30000, vermoegen: 15000 })).toBe(30100);
    expect(geRdu({ netto: 30000, erwerb: 30000, alimente: 6000, familienzulagen: 2400 })).toBe(29100);
    // Rente: kein Erwerb, keine Pauschale
    expect(geRdu({ netto: 24000, erwerb: 0 })).toBe(24000);
    // negatives Vermögen zählt nicht
    expect(geRdu({ netto: 24000, erwerb: 0, vermoegen: -100 })).toBe(24000);
  });
});

describe('K31 GE: RDU-Untergrenze für den Antrag (RaLAMal Art. 10 Abs. 4/5 [3], Tabelle des SAM [5])', () => {
  // [5]: «Personne seule 15'000 · avec 1 enfant 18'000 · 2 enfants 21'000 · 3 enfants 24'000 · 4 enfants 27'000»
  // — die Zeile «assuré seul» gilt auch für Alleinerziehende. ⟨Bis 28.09.2026 abends rechnete das Modul hier mit
  // der Paar-Zeile (23'000) und nannte das «gewählt»; die SAM-Tabelle entscheidet es.⟩
  it.each([[0, 15000], [1, 18000], [2, 21000], [3, 24000], [4, 27000]])('%s Kind(er) → %s', (kinder, grenze) => {
    expect(geAntragUnter(kinder)).toBe(grenze);
  });
  it('18 000, nicht 23 000', () => { expect(geAntragUnter(1)).not.toBe(23000); });
});

describe('K31 GE: Wohneigentum (LRDU Art. 6 lit. a, RaLAMal Art. 10 Abs. 1)', () => {
  it('erkannt an Liegenschaftswert oder Hypothek; Miete allein ist keines', () => {
    expect(hatWohneigentum({ propertyValue: 800000 })).toBe(true);
    expect(hatWohneigentum({ mortgageStatus: 'fixedRate' })).toBe(true);
    expect(hatWohneigentum({ mortgageStatus: 'variable' })).toBe(true);
    expect(hatWohneigentum({ rentAmount: 1500 })).toBe(false);
    expect(hatWohneigentum({ propertyValue: 0, mortgageStatus: 'none' })).toBe(false);
    expect(hatWohneigentum(undefined)).toBe(false);
  });
});

describe('K31 calculateIPV für GE (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../ipvGenf.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  afterEach(() => { vi.useRealTimers(); });

  const person = ({ monthlyIncome = 0, plz = '1204', city = 'Genève', children = [], dob = '1980-05-01', kkPremium = 500, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'GE', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: plz, city },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('ohne erfasste Prämie keine Zahl (Art. 22 Abs. 4 [2])', () => {
    expect(calculateIPV(person({ kkPremium: null }))).toMatchObject({ belegt: false, amount: null, offen: 'praemie' });
  });

  it('Einzelperson, Einkommen 0: Gruppe 1, 348/Monat, 4 176/Jahr, Grenze 50 000, Basisjahr 2024, kein Regionssatz — und Antrag nötig', () => {
    const r = calculateIPV(person());
    expect(r).toMatchObject({
      belegt: true, eligible: true, amount: 348, annual: 4176, maxAnnual: 4176, reductionPercent: 100,
      canton: 'GE', jahr: 2026, basisjahr: 2024, vorbehaltKey: 'ipv.vorbehaltGE', jahrKey: 'ipv.jahrGE',
    });
    expect(r.region).toBeUndefined();
    expect(r.cantonData.maxIncome).toBe(50000);
    // RDU 0 liegt unter 15 000: der Kanton prüft NICHT automatisch — Antrag mit Nachweis vor dem
    // 30. November (Art. 10 Abs. 4–6, Art. 10A [3]). Für genau die ärmste Gruppe. Und derselbe
    // Bildschirm darf dann nicht «Automatisch» und «Berechtigt» sagen (Rechtsprüfung 28.09.2026).
    expect(r.noteKey).toBe('ipv.geAntragNoetig');
    expect(r.noteParams).toEqual({ value: 15000, jahr: 2026 });
    expect(r.antragNoetig).toBe(true);
    expect(r.cantonData.noteKey).toBe('ipv.geWegAntrag');
  });

  it('Einzelperson 2 000/Monat: 24 000 − 720 Pauschale = 23 280, Gruppe 1, Weg «in der Regel automatisch»', () => {
    const r = calculateIPV(person({ monthlyIncome: 2000 }));
    expect(rduAusLohn(2000)).toBe(23280);
    expect(r).toMatchObject({ amount: 348, annual: 4176, noteKey: 'ipv.geWegAutomatisch' });
    expect(r.antragNoetig).toBeUndefined();
    expect(r.cantonData.noteKey).toBe('ipv.geWegAutomatisch');
  });

  // Fachprüfung 28.09.2026: ohne die Pauschale sah eine Person mit 15'000–15'600 Netto «automatisch»,
  // obwohl ihr RDU unter 15'000 liegt — sie hätte den Antrag verpasst und das Jahr verloren.
  it('Untergrenze 15 000 durch die App: 15 599 Netto → RDU 14 999 → Antrag; 15 600 → 15 000 → automatisch', () => {
    expect(rduAusLohn(15599 / 12)).toBeCloseTo(14999, 6);
    expect(rduAusLohn(15600 / 12)).toBeCloseTo(15000, 6);
    expect(calculateIPV(person({ monthlyIncome: 15599 / 12 })).noteKey).toBe('ipv.geAntragNoetig');
    expect(calculateIPV(person({ monthlyIncome: 15600 / 12 })).noteKey).toBe('ipv.geWegAutomatisch');
    // ohne Pauschale (Rente) liegt die Schwelle genau bei 15 000
    expect(calculateIPV(person({ finanzen: { ahvRente: 14999 / 12 } })).noteKey).toBe('ipv.geAntragNoetig');
    expect(calculateIPV(person({ finanzen: { ahvRente: 15000 / 12 } })).noteKey).toBe('ipv.geWegAutomatisch');
  });

  it.each([
    ['2 577 → 29 996, noch Gruppe 1', 2577, 348],
    ['2 578 → 30 008, Gruppe 2', 2578, 294],
    ['3 006 → 34 990, Gruppe 2', 3006, 294],
    ['3 007 → 35 001, Gruppe 3', 3007, 240],
    ['3 300 → 38 412, Gruppe 4', 3300, 196],
    ['3 500 → 40 740, Gruppe 5', 3500, 164],
    ['3 700 → 43 068, Gruppe 6', 3700, 120],
    ['3 900 → 45 396, Gruppe 7', 3900, 87],
    ['4 295 → 49 994, Gruppe 8', 4295, 55],
  ])('%s → CHF %s/Monat', (_, monthlyIncome, betrag) => {
    const rdu = rduAusLohn(monthlyIncome);
    const erwartet = IPV_GE.grenzen.allein.findIndex((g) => rdu <= g);
    expect(IPV_GE.erwachsene[erwartet]).toBe(betrag);   // die Tabellenzeile stimmt mit dem Testnamen
    expect(calculateIPV(person({ monthlyIncome }))).toMatchObject({ eligible: true, amount: betrag, annual: betrag * 12 });
  });

  it('über der Grenze: kein Anspruch, die amtliche Grenze 50 000 wird genannt', () => {
    expect(rduAusLohn(4296)).toBeGreaterThan(50000);
    expect(calculateIPV(person({ monthlyIncome: 4296 }))).toMatchObject({
      belegt: true, eligible: false, amount: 0, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: 50000 },
    });
  });

  // Der 13. Monatslohn zählt (utils/dreizehnter.js): 2 400 × 12 = 28 800 − 864 (Gruppe 1),
  // × 13 = 31 200 − 936 = 30 264 (Gruppe 2).
  it('13. Monatslohn: «ja» kippt die Gruppe, «nein» nicht, und die Annahme ist sichtbar', () => {
    const mit = calculateIPV(person({ monthlyIncome: 2400, finanzen: { dreizehnter: 'ja' } }));
    const ohne = calculateIPV(person({ monthlyIncome: 2400, finanzen: { dreizehnter: 'nein' } }));
    const offen = calculateIPV(person({ monthlyIncome: 2400 }));
    expect(mit.amount).toBe(294);
    expect(ohne.amount).toBe(348);
    expect(offen.amount).toBe(348);
    expect(offen.annahmen).toEqual({ ohneDreizehnten: true, partnerOhneDreizehnten: false });
    expect(ohne.annahmen).toEqual({ ohneDreizehnten: false, partnerOhneDreizehnten: false });
  });

  it('Vermögen zählt mit einem Fünfzehntel (LRDU Art. 8 Abs. 2 [4]): 15 Franken kippen die Grenze', () => {
    // 2 500 × 12 = 30 000 − 900 = 29 100; + 13 500 / 15 = 900 → 30 000 (Gruppe 1); + 13 515 / 15 → 30 001
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { savingsAccount: 13500 } })).amount).toBe(348);
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { savingsAccount: 13515 } })).amount).toBe(294);
    // 2 000 → 23 280; + 100 800 / 15 = 6 720 → 30 000; 100 815 → 30 001
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { securitiesValue: 100800 } })).amount).toBe(348);
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { securitiesValue: 100815 } })).amount).toBe(294);
  });

  // LRDU Art. 6 lit. f [4]: Lebensversicherungen mit ihrem Rückkaufswert; lit. g nimmt das
  // Vorsorgekapital (3a) aus. Fachprüfung 28.09.2026: `pension3bBalance` fehlte.
  it('Säule 3b zählt zum Vermögen, Säule 3a nicht', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { pension3bBalance: 13515 } })).amount).toBe(294);
    expect(calculateIPV(person({ monthlyIncome: 2500, finanzen: { pension3aBalance: 13515 } })).amount).toBe(348);
    // und für die 250 000-Grenze zählt es mit
    expect(calculateIPV(person({ finanzen: { savingsAccount: 200000, pension3bBalance: 50001 } }))).toMatchObject({ offen: 'vermoegenAntragGE' });
  });

  // 🛑 RAHMEN-RULING 28.09.2026: Familienzulagen und Alimente rechnet KEIN Kantons-PR — ein eigener
  // Rahmen-PR nach den Merges (vor dem Deploy) tut es für alle. Dieser Test hält fest, dass GE es
  // nicht heimlich doch tut (zwischen 18:53 und 20:30 tat es das), und dass der Vorbehalt die Posten nennt.
  it('Familienzulagen und erhaltene Alimente verändern den RDU hier NICHT (Rahmen-PR folgt)', () => {
    const kind = [{ birthDate: '2015-01-01' }];
    const ohne = calculateIPV(person({ monthlyIncome: 4000, children: kind }));
    expect(ohne.amount).toBe(480);
    expect(calculateIPV(person({ monthlyIncome: 4000, children: kind, finanzen: { alimenteReceived: 500 } })).amount).toBe(480);
    expect(calculateIPV(person({ monthlyIncome: 4000, children: kind, finanzen: { familienzulagen: 400 } })).amount).toBe(480);
  });

  it('Berufskosten-Pauschale wirkt durch die App: 5 000/Monat → 60 000 − 1 700 = 58 300 (Grenze 57 000 mit 2 Kindern: Gruppe 2)', () => {
    const kinder = [{ age: 5 }, { age: 8 }];
    expect(calculateIPV(person({ monthlyIncome: 5000, children: kinder })).amount).toBe(558);
    // ohne Pauschale wäre 60 000 auch Gruppe 2 — an 4 890: 58 680 − 1 700 = 56 980 (Gruppe 1) vs. 58 680 (Gruppe 2)
    expect(calculateIPV(person({ monthlyIncome: 4890, children: kinder })).amount).toBe(612);
    // Nebenerwerb: keine Pauschale (LIPP Art. 29A nicht gebaut) — 2 000 Lohn + 500 Nebenerwerb = 30 000 − 720 = 29 280
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { sideIncome: 500 } })).amount).toBe(348);
    expect(calculateIPV(person({ monthlyIncome: 2000, finanzen: { sideIncome: 561 } })).amount).toBe(294); // 30 012 − 720
  });

  // Fachprüfung W2 / Fixrunde: Wohneigentum zählt zum Bruttovermögen nach Steuerwert, ohne Hypothek —
  // mit Liegenschaft ist die 250'000-Vermutung fast immer erreicht, und die App kennt den Steuerwert nicht.
  it('Wohneigentum: keine Zahl, Grund «wohneigentumGE»', () => {
    const eigentum = { ...person({ monthlyIncome: 2000 }), wohnen: { postalCode: '1204', city: 'Genève', propertyValue: 900000 } };
    expect(calculateIPV(eigentum)).toMatchObject({ belegt: false, amount: null, offen: 'wohneigentumGE' });
    const hypothek = { ...person({ monthlyIncome: 2000 }), wohnen: { postalCode: '1204', city: 'Genève', mortgageStatus: 'fixedRate' } };
    expect(calculateIPV(hypothek)).toMatchObject({ belegt: false, offen: 'wohneigentumGE' });
  });

  it('über der Grenze OHNE erfasste Prämie: «kein Anspruch», nicht «Prämie fehlt» (Reihenfolge)', () => {
    expect(calculateIPV(person({ monthlyIncome: 4296, kkPremium: null }))).toMatchObject({ belegt: true, eligible: false, noteKey: 'ipv.incomeAboveLimit' });
  });

  it('Bruttovermögen über 250 000: kein Betrag, Grund «vermoegenAntragGE» (RaLAMal Art. 10 Abs. 1 [3])', () => {
    expect(calculateIPV(person({ finanzen: { savingsAccount: 250001 } }))).toMatchObject({ belegt: false, amount: null, offen: 'vermoegenAntragGE' });
    // genau 250 000 «excède» nicht — rechnet, und das Vermögen zählt: 250 000 / 15 = 16 667 → Gruppe 1, über 15 000 → automatisch
    expect(calculateIPV(person({ finanzen: { savingsAccount: 250000 } }))).toMatchObject({ belegt: true, amount: 348, noteKey: 'ipv.geWegAutomatisch' });
  });

  // 🛑 RÜCKFALL-WÄCHTER: die 3a zählt weder doppelt (Fachprüfung 20.09.2026) noch wird sie in GE
  // abgezogen — LRDU Art. 5 [4] nennt LIPP Art. 31 lit. a und b, nicht lit. c. Einzahlung ändert nichts.
  it('Säule 3a verändert den RDU nicht — weder nach oben noch nach unten', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 2577 }));
    expect(calculateIPV(person({ monthlyIncome: 2577, finanzen: { pension3a: 7258 } })).amount).toBe(ohne.amount);
    expect(calculateIPV(person({ monthlyIncome: 2577, finanzen: { pension3a: 7258 } })).amount).toBe(348);
    // Einen Franken über der Grenze bleibt es Gruppe 2 — eine Abzugsregel hätte es zurückgekippt.
    expect(calculateIPV(person({ monthlyIncome: 2578, finanzen: { pension3a: 7258 } })).amount).toBe(294);
  });

  it('Renten zählen zum Einkommen, ohne Berufskosten-Pauschale: 2 800 AHV = 33 600 → Gruppe 2', () => {
    expect(calculateIPV(person({ finanzen: { ahvRente: 2800 } }))).toMatchObject({ amount: 294 });
    // 2 500 Rente = 30 000 → noch Gruppe 1 (ein Lohn von 2 500 läge bei 29 100)
    expect(calculateIPV(person({ finanzen: { ahvRente: 2500 } }))).toMatchObject({ amount: 348 });
  });

  it('Prämie tiefer als die Verbilligung: höchstens die Prämie (Art. 22 Abs. 4 [2])', () => {
    expect(calculateIPV(person({ kkPremium: 100 }))).toMatchObject({ amount: 100, annual: 1200, maxAnnual: 1200 });
  });

  it('Alleinerziehend, 1 Kind, Einkommen 0: 348 + 132 = 480/Monat, «Max.» = Erwachsenengrenze 121 000, Antrag unter 18 000 [5]', () => {
    const r = calculateIPV(person({ children: [{ birthDate: '2015-01-01' }] }));
    expect(r).toMatchObject({ amount: 480, annual: 5760, maxAnnual: 5760, noteKey: 'ipv.geAntragNoetig', noteParams: { value: 18000, jahr: 2026 }, antragNoetig: true });
    // Rente 20 000 mit einem Kind: über 18 000 → automatisch (nach der alten Paar-Lesart wäre es «Antrag» gewesen)
    expect(calculateIPV(person({ children: [{ birthDate: '2015-01-01' }], finanzen: { ahvRente: 20000 / 12 } })).noteKey).toBe('ipv.geWegAutomatisch');
    expect(calculateIPV(person({ children: [{ birthDate: '2015-01-01' }], finanzen: { ahvRente: 17999 / 12 } })).noteKey).toBe('ipv.geAntragNoetig');
    // Fachprüfung 28.09.2026: 151 000 ist nur die Grenze des Kinderbeitrags (Gruppe 9).
    expect(r.cantonData.maxIncome).toBe(121000);
  });

  it.each([
    ['1 Kind, 4 000/Monat = 46 560 → Gruppe 1 (bis 51 000)', 4000, [{ age: 5 }], 480],
    ['1 Kind, 4 381/Monat = 50 995 → noch Gruppe 1', 4381, [{ age: 5 }], 480],
    ['1 Kind, 4 382/Monat = 51 006 → Gruppe 2', 4382, [{ age: 5 }], 426],
    ['2 Kinder, 6 000/Monat = 70 300 → Gruppe 3 (67 001–77 000)', 6000, [{ age: 5 }, { age: 8 }], 504],
    ['3 Kinder, 9 000/Monat = 106 300 → Gruppe 6 (103 001–113 000)', 9000, [{ age: 5 }, { age: 8 }, { age: 12 }], 516],
  ])('%s → CHF %s/Monat', (_, monthlyIncome, children, betrag) => {
    expect(calculateIPV(person({ monthlyIncome, children }))).toMatchObject({ eligible: true, amount: betrag });
  });

  it('Gruppe 9: über Gruppe 8 nur noch der Kinderbeitrag 67, mit eigenem Hinweis (Art. 21 Abs. 5/7 [2])', () => {
    // 1 Kind: Gruppe 8 endet bei 121 000, Gruppe 9 bei 151 000. 10 500 × 12 = 126 000 − 1 700 = 124 300.
    const r = calculateIPV(person({ monthlyIncome: 10500, children: [{ birthDate: '2015-01-01' }] }));
    expect(r).toMatchObject({ eligible: true, amount: 67, annual: 804, noteKey: 'ipv.geNurKinder', noteParams: { value: 151000 } });
    expect(r.cantonData.maxIncome).toBe(121000);
    // Deckel auf die Prämie der erwachsenen Person greift hier nicht — ihr Anteil ist 0.
    expect(calculateIPV(person({ monthlyIncome: 10500, children: [{ birthDate: '2015-01-01' }], kkPremium: 30 })).annual).toBe(804);
    // 12 725 × 12 = 152 700 − 1 700 = 151 000 noch Gruppe 9; 12 726 → 151 012 nichts mehr
    expect(calculateIPV(person({ monthlyIncome: 12725, children: [{ age: 5 }] })).amount).toBe(67);
    expect(calculateIPV(person({ monthlyIncome: 12726, children: [{ age: 5 }] })))
      .toMatchObject({ eligible: false, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: 151000 } });
  });

  it('Prämien-Deckel wirkt auch mit Kind, aber nur auf den Erwachsenen-Anteil', () => {
    // Gruppe 1, ein Kind: 348 + 132 = 480/Monat = 5 760. Prämie 100/Monat: 1 200 + 1 584 = 2 784.
    expect(calculateIPV(person({ children: [{ age: 5 }], kkPremium: 100 })).annual).toBe(2784);
  });

  // RaLAMal Art. 13C [3]: ein Kind, das nach dem Bemessungsjahr dazukam, kennt die Veranlagung
  // nicht — nur auf schriftlichen Antrag. (Fachprüfung 28.09.2026: vorher stand «automatisch».)
  it('Kind nach dem Bemessungsjahr 2024: gerechnet, aber mit Antragshinweis statt «automatisch»', () => {
    const r = calculateIPV(person({ monthlyIncome: 4000, children: [{ birthDate: '2026-03-01' }] }));
    expect(r).toMatchObject({ amount: 480, noteKey: 'ipv.geAntragKindNeu', noteParams: { basisjahr: 2024, jahr: 2026, folgejahr: 2027 }, antragNoetig: true });
    expect(r.cantonData.noteKey).toBe('ipv.geWegAntrag');
    // Jahrgang 2025 ebenso (Frage 8, ob das der SAM so sieht); eingetipptes Alter 1 ebenso
    expect(calculateIPV(person({ monthlyIncome: 4000, children: [{ birthDate: '2025-06-01' }] })).noteKey).toBe('ipv.geAntragKindNeu');
    expect(calculateIPV(person({ monthlyIncome: 4000, children: [{ age: 1 }] })).noteKey).toBe('ipv.geAntragKindNeu');
    // Jahrgang 2024 steht in der Veranlagung: automatisch
    expect(calculateIPV(person({ monthlyIncome: 4000, children: [{ birthDate: '2024-12-31' }] })).noteKey).toBe('ipv.geWegAutomatisch');
    // Der RDU-Antragsfall hat Vorrang (derselbe Antrag, tiefere Schwelle)
    expect(calculateIPV(person({ monthlyIncome: 1000, children: [{ birthDate: '2026-03-01' }] })).noteKey).toBe('ipv.geAntragNoetig');
    // und die Frist-Folge fürs Budget gilt dafür nicht
    vi.useFakeTimers(); vi.setSystemTime(new Date('2026-12-01T12:00:00'));
    expect(calculateIPV(person({ monthlyIncome: 4000, children: [{ birthDate: '2026-03-01' }] })).anmeldefristVorbei).toBeUndefined();
  });

  // Art. 9 [3]: Ehegatten, eingetragene Partner und Konkubinat mit gemeinsamem Kind — RDU addiert.
  it.each([
    ['Konkubinat mit Kind', { children: [{ age: 5 }], basis: { maritalStatus: 'cohabiting' } }],
    ['Konkubinat ohne Kind', { basis: { maritalStatus: 'cohabiting' } }],
    ['Paar', { basis: { household: { adults: 2, children: [] } } }],
    ['verheiratet ohne Partner im Haushalt', { basis: { maritalStatus: 'married' } }],
  ])('%s: Orientierung statt Betrag', (_, opts) => {
    expect(calculateIPV(person(opts))).toMatchObject({ belegt: false, amount: null, offen: 'haushalt' });
  });

  it.each([
    ['ohne Geburtsdatum', { dob: '' }, 'alter'],
    ['Jahrgang 2001 — junge erwachsene Person laut Barème (2001–2007): nur auf Antrag', { dob: '2001-01-01' }, 'geJungeErwachsene'],
    ['Jahrgang 2007', { dob: '2007-12-31' }, 'geJungeErwachsene'],
    ['Jahrgang 2009 — minderjährig', { dob: '2009-01-01' }, 'alter'],
    ['Kind ohne jede Altersangabe', { children: [{}] }, 'alter'],
    ['Kind mit age 0 (Vorbelegung)', { children: [{ age: 0 }] }, 'alter'],
    ['Kind ab 19 (junge Erwachsene, Art. 21 Abs. 6: nur auf Antrag)', { children: [{ age: 19 }] }, 'geJungeErwachsene'],
    ['Kind Jahrgang 2007 — am 1. Januar 2026 volljährig', { children: [{ birthDate: '2007-12-01' }] }, 'geJungeErwachsene'],
    ['negatives Einkommen', { monthlyIncome: -1000 }, 'einkommenNegativ'],
  ])('%s: Orientierung statt Betrag', (_, opts, grund) => {
    const r = calculateIPV(person(opts));
    expect(r).toMatchObject({ belegt: false, eligible: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: grund });
    expect(r.cantonData).toBeUndefined();
  });

  it('Jahrgang 2000 wird 2026 26 und ist erwachsen — rechnet (Barème: junge Erwachsene 2001–2007)', () => {
    expect(calculateIPV(person({ dob: '2000-12-31' })).annual).toBe(4176);
  });

  it('Kind Jahrgang 2008 ist am 1. Januar 2026 noch minderjährig — zählt als Kind', () => {
    expect(calculateIPV(person({ children: [{ birthDate: '2008-06-01' }] })).annual).toBe(5760);
  });

  it('ohne PLZ rechnet GE trotzdem — es gibt keine Prämienregion', () => {
    expect(calculateIPV(person({ plz: '', city: '' }))).toMatchObject({ eligible: true, amount: 348 });
  });

  describe('Antragsfrist 30. November (RaLAMal Art. 10A [3]) — nur für die RDU-Antragsfälle', () => {
    it('vor dem 30.11.: Antrag nötig, Frist läuft — nichts wird als «vorbei» markiert, aber der Genfer Leser-Schlüssel steht bereit', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-29T12:00:00'));
      const r = calculateIPV(person());
      expect(r.noteKey).toBe('ipv.geAntragNoetig');
      expect(r.anmeldefristVorbei).toBeUndefined();
      expect(r.fristNichtAbgezogenKey).toBe('ipv.geFristNichtAbgezogen');
    });

    it('am 30.11. ist es zu spät («avant le 30 novembre»): Frist-Satz, anmeldefristVorbei und der Genfer Leser-Schlüssel', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-11-30T00:00:01'));
      expect(calculateIPV(person())).toMatchObject({
        noteKey: 'ipv.geAntragFristVorbei', noteParams: { value: 15000, jahr: 2026, folgejahr: 2027 },
        anmeldefristVorbei: true, antragNoetig: true, fristNichtAbgezogenKey: 'ipv.geFristNichtAbgezogen',
      });
      // der automatische Fall kennt keine Frist und keinen Leser-Schlüssel
      const auto = calculateIPV(person({ monthlyIncome: 2000 }));
      expect(auto.anmeldefristVorbei).toBeUndefined();
      expect(auto.fristNichtAbgezogenKey).toBeUndefined();
    });
  });

  describe('Jahres-Riegel', () => {
    it('im Anspruchsjahr 2026 rechnet sie', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-12-31T12:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 2000 })).annual).toBe(4176);
    });

    it('ab 2027 keine Zahl mehr, bis das Barème 2027 eingebaut ist', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person({ monthlyIncome: 2000 }))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });

  it('Betrag sinkt nie mit steigendem Einkommen (Orientierungs-Fälle ausgenommen)', () => {
    for (const children of [[], [{ age: 5 }], [{ age: 5 }, { age: 9 }]]) {
      let vorher = Infinity;
      for (let m = 0; m <= 15000; m += 50) {
        const r = calculateIPV(person({ monthlyIncome: m, children }));
        if (r.belegt === false) continue;
        expect(r.annual ?? 0).toBeLessThanOrEqual(vorher);
        vorher = r.annual ?? 0;
      }
    }
  });
});
