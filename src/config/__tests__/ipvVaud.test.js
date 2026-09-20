import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_VD, ipvVaudRechnen, vdSubsideMonat, vdRevenuDeterminant, vdRegion, spezifischerSubsideMoeglich } from '../ipvVaud.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV } from '../cantonalData.js';
import { getRegion } from '../../data/praemienRegionen.js';

// K31 — Prämienverbilligung Kanton Waadt 2026, «subside ordinaire».
// Quellen (abgerufen 2026-09-16), Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt VD:
//  [1] Arrêté du Conseil d'État VD concernant les subsides aux primes de l'assurance-maladie
//      obligatoire en 2026, du 17.12.2025 (art. 2 Parameter, art. 4 Kinderabzug, art. 7
//      10-%-Schwelle, art. 9 subside spécifique, art. 13 Referenzprämien)
//  [2] OVAM, «Notice explicative : Les subsides 2026», PDF vom 19.12.2025
//  [4] RLVLAMal (BLV 832.01.1) art. 21 — Eckpunkte in Worten (al. 1), Formeln als Bild (al. 2)
//
// 🛑 Der Punkt dieses Tests: die Formeln sind aus einem BILD abgeschrieben. Geprüft wird
// deshalb nicht die Abschrift gegen sich selbst, sondern gegen das, was unabhängig davon
// feststeht — die Eckpunkte, die art. 21 al. 1 in WORTEN nennt, und das durchgerechnete
// Beispiel der Notice. Geht ein Eckpunkt nicht auf, ist die Formel falsch abgeschrieben.

describe('K31 calculateIPV für VD, bevor PLZ-Daten und VD-Modul geladen sind', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'VD', dateOfBirth: '1980-05-01' }, finanzen: {}, wohnen: { postalCode: '1003' } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

// ── Falle 1: die abgeschriebenen Formeln gegen die Eckpunkte im Verordnungstext ──────────
describe('K31 VD: Eckpunkte der drei gebauten Kategorien [4] art. 21 al. 1', () => {
  // a) «Si le revenu déterminant est égal ou inférieur à C1, le subside est maximum et vaut
  //    F1. […] Si le revenu déterminant est supérieur à A1 et inférieur ou égal à B1, le
  //    subside est minimum et vaut E1. […] Si le revenu déterminant est supérieur à B1, aucun
  //    subside n'est accordé.»
  it('a) 26+ allein: bei C1 das Maximum 331, bei A1 das Minimum 30, über B1 null', () => {
    expect(vdSubsideMonat('e', 0)).toBe(331);
    expect(vdSubsideMonat('e', 17000)).toBe(331);
    expect(vdSubsideMonat('e', 40000)).toBeCloseTo(30, 9);
    expect(vdSubsideMonat('e', 50000)).toBe(30);
    expect(vdSubsideMonat('e', 50001)).toBe(0);
  });

  it('a) Formel 1 hängt an beiden Nahtstellen stetig an: 331 bei C1, 30 bei A1', () => {
    expect(vdSubsideMonat('e', 17000.01)).toBeCloseTo(331, 5);
    expect(vdSubsideMonat('e', 39999.99)).toBeCloseTo(30, 4);
  });

  it('b) 26+ mit Kind(ern): 336 bei Einkommen 0, 300 bei C2, 20 bei A2, null über B2', () => {
    expect(vdSubsideMonat('ef', 0)).toBe(336);
    expect(vdSubsideMonat('ef', 24200)).toBeCloseTo(300, 9);
    expect(vdSubsideMonat('ef', 55000)).toBeCloseTo(20, 9);
    expect(vdSubsideMonat('ef', 69000)).toBe(20);
    expect(vdSubsideMonat('ef', 69001)).toBe(0);
  });

  it('b) Formel 2 und Formel 3 treffen sich bei C2 auf demselben Wert (300)', () => {
    expect(vdSubsideMonat('ef', 24199.99)).toBeCloseTo(300, 4);
    expect(vdSubsideMonat('ef', 24200.01)).toBeCloseTo(300, 4);
  });

  it('c) Kinder 0–18: 114 bei C3, bei A3 und bei B3, null über B3', () => {
    expect(vdSubsideMonat('k', 0)).toBe(114);
    expect(vdSubsideMonat('k', 26000)).toBe(114);
    expect(vdSubsideMonat('k', 63000)).toBeCloseTo(114, 9);
    expect(vdSubsideMonat('k', 76000)).toBeCloseTo(114, 9);
    expect(vdSubsideMonat('k', 76001)).toBe(0);
  });

  // F3 = E3 = G3 = 114: die Kurve ist über den ganzen Bereich flach. Das ist kein Fehler,
  // sondern der Wertsatz 2026 — und der Grund, warum P3/Q3 hier nichts beweisen können.
  it('c) der Kinderbetrag ist bis B3 konstant 114 (F3 = E3 = G3)', () => {
    for (let rd = 0; rd <= 76000; rd += 2000) expect(vdSubsideMonat('k', rd)).toBeCloseTo(114, 9);
  });

  it('kein Betrag steigt mit dem Einkommen (alle drei Kategorien, 0…90 000)', () => {
    for (const kat of ['e', 'ef', 'k']) {
      let vorher = Infinity;
      for (let rd = 0; rd <= 90000; rd += 100) {
        const v = vdSubsideMonat(kat, rd);
        expect(v).toBeLessThanOrEqual(vorher + 1e-9);
        vorher = v;
      }
    }
  });

  it('negatives Revenu déterminant wird wie 0 behandelt, nie mehr als das Maximum', () => {
    expect(vdSubsideMonat('e', -5000)).toBe(331);
    expect(vdSubsideMonat('ef', -5000)).toBe(336);
  });
});

// ── Das amtliche Rechenbeispiel ──────────────────────────────────────────────────────────
describe('K31 VD: das durchgerechnete Beispiel der Notice [2] Ziff. 3', () => {
  // «Famille de 4 personnes, région 1, RDU 76'000» → subside ordinaire 3'216/Jahr.
  it('Familie, 4 Personen, RDU 76 000 → Revenu OVAM 63 000 → 3 216 im Jahr', () => {
    // Kinderabzug nach [1] art. 4: 6 000 fürs erste Kind, 7 000 mehr je weiteres.
    const { rdu, revenuOvam } = vdRevenuDeterminant({
      // so gewählt, dass der RDU genau die 76 000 des Beispiels trifft
      einkommen: 76000 + IPV_VD.kkPauschale.erwachsener + 2 * IPV_VD.kkPauschale.proKind,
      vermoegen: 0, kinderZahl: 2,
    });
    expect(rdu).toBe(76000);
    expect(revenuOvam).toBe(63000);
    const r = ipvVaudRechnen({ personen: ['ef', 'ef', 'k', 'k'], revenuOvam });
    expect(r.annual).toBe(3216);
    // Die Aufteilung, die das Beispiel dahinter hat: 2 × 20 (Minimum E2) + 2 × 114.
    expect(r.monat).toBe(2 * 20 + 2 * 114);
  });
});

// ── Rundung ──────────────────────────────────────────────────────────────────────────────
describe('K31 VD: Rundung «au franc supérieur» [4] art. 21 al. 1', () => {
  it('ein angebrochener Franken wird AUF gerundet, je Person und Monat', () => {
    // 58.139… → 59, nicht 58
    expect(vdSubsideMonat('e', 35000)).toBeCloseTo(58.1392, 3);
    expect(ipvVaudRechnen({ personen: ['e'], revenuOvam: 35000 }).monat).toBe(59);
    // 144.996… → 145
    expect(vdSubsideMonat('e', 30000)).toBeCloseTo(144.9962, 3);
    expect(ipvVaudRechnen({ personen: ['e'], revenuOvam: 30000 }).monat).toBe(145);
  });

  it('ein glatter Betrag bleibt unverändert', () => {
    expect(ipvVaudRechnen({ personen: ['e'], revenuOvam: 45000 }).monat).toBe(30);
    expect(ipvVaudRechnen({ personen: ['k'], revenuOvam: 50000 }).monat).toBe(114);
  });

  it('gerundet wird je Person, nicht auf der Summe', () => {
    // 58.139… × 2 = 116.28 → auf der Summe gerundet wären es 117, je Person sind es 118.
    expect(ipvVaudRechnen({ personen: ['e', 'e'], revenuOvam: 35000 }).monat).toBe(118);
  });
});

// ── Falle 2: das Revenu déterminant ist nicht das Einkommen der App ──────────────────────
describe('K31 VD: Revenu déterminant [2] Ziff. 1 und [1] art. 4', () => {
  it('KK-Pauschale: 2 200 für eine erwachsene Person, je Kind 1 300 mehr', () => {
    expect(vdRevenuDeterminant({ einkommen: 50000, vermoegen: 0, kinderZahl: 0 }).rdu).toBe(47800);
    expect(vdRevenuDeterminant({ einkommen: 50000, vermoegen: 0, kinderZahl: 2 }).rdu).toBe(50000 - 2200 - 2600);
    expect(vdRevenuDeterminant({ einkommen: 50000, vermoegen: 0, kinderZahl: 0, paar: true }).rdu).toBe(45600);
  });

  it('Kinderabzug vom RDU zum Revenu OVAM: 6 000 / 13 000 / 20 000', () => {
    const ovam = (kinderZahl) => vdRevenuDeterminant({ einkommen: 80000, vermoegen: 0, kinderZahl }).revenuOvam;
    const rdu = (kinderZahl) => vdRevenuDeterminant({ einkommen: 80000, vermoegen: 0, kinderZahl }).rdu;
    expect(rdu(1) - ovam(1)).toBe(6000);
    expect(rdu(2) - ovam(2)).toBe(13000);
    expect(rdu(3) - ovam(3)).toBe(20000);
    expect(rdu(0) - ovam(0)).toBe(0);
  });

  it('Vermögenszuschlag: 1/15 des Teils über 59 000 (allein) bzw. 118 000 (Paar)', () => {
    const ohne = vdRevenuDeterminant({ einkommen: 40000, vermoegen: 59000, kinderZahl: 0 }).rdu;
    expect(ohne).toBe(37800);
    // 60 000 über dem Freibetrag → 1/15 = 4 000
    expect(vdRevenuDeterminant({ einkommen: 40000, vermoegen: 119000, kinderZahl: 0 }).rdu).toBe(37800 + 4000);
    // Paar: derselbe Betrag liegt unter dem Freibetrag 118 000 → kein Zuschlag
    expect(vdRevenuDeterminant({ einkommen: 40000, vermoegen: 118000, kinderZahl: 0, paar: true }).rdu).toBe(40000 - 4400);
  });

  it('nie negativ: ohne Einkommen bleiben RDU und Revenu OVAM bei 0', () => {
    const r = vdRevenuDeterminant({ einkommen: 0, vermoegen: 0, kinderZahl: 3 });
    expect(r.rdu).toBe(0);
    expect(r.revenuOvam).toBe(0);
  });

  it('Werte 2026 sichtbar im Datensatz', () => {
    expect(IPV_VD.jahr).toBe(2026);
    expect(IPV_VD.kategorien.e).toMatchObject({ max: 331, min: 30, C: 17000, A: 40000, B: 50000 });
    expect(IPV_VD.kategorien.ef).toMatchObject({ maxBei0: 336, beiC: 300, min: 20, C: 24200, A: 55000, B: 69000 });
    expect(IPV_VD.kategorien.k).toMatchObject({ max: 114, C: 26000, A: 63000, B: 76000 });
    expect(IPV_VD.tauxEffort).toBe(0.1);
    expect(CANTONAL_IPV.VD.beleg.quelle).toMatch(/Arrêté/);
    expect(CANTONAL_IPV.VD.beleg.stand).toMatch(/2026/);
    // Die entfernten Musterwerte dürfen nicht zurückkommen.
    expect(CANTONAL_IPV.VD.maxIncome).toBeNull();
    expect(CANTONAL_IPV.VD.subsidySingle).toBeNull();
  });
});

// ── Prämienregionen ──────────────────────────────────────────────────────────────────────
describe('K31 Prämienregionen VD (BAG-Tabelle gegen die Räume, die die Notice [2] nennt)', () => {
  // Die Notice beschreibt die Regionen mit Landschaftsnamen, nicht als Gemeindeliste — ein
  // Abgleich Gemeinde für Gemeinde ist damit nicht möglich. Geprüft wird darum, was prüfbar
  // ist: VD hat genau zwei Regionen, und die namentlich genannten Räume liegen richtig.
  // «Région 1 : Lausanne, l'Ouest lausannois, Nyon, La Côte, Lavaux, la Riviera»
  const R1 = { 5586: 'Lausanne', 5591: 'Renens (VD)', 5651: 'Villars-Sainte-Croix', 5724: 'Nyon', 5642: 'Morges', 5861: 'Rolle', 5606: 'Lutry', 5890: 'Vevey', 5886: 'Montreux', 5590: 'Pully' };
  // Région 2: «Chablais, Pays d'Enhaut, Oron, Cossonay, Broye, Vully, Gros-de-Vaud, Jura, Nord vaudois»
  const R2 = { 5401: 'Aigle', 5402: 'Bex', 5841: "Château-d'Oex", 5805: 'Oron', 5477: 'Cossonay', 5822: 'Payerne', 5451: 'Avenches', 5938: 'Yverdon-les-Bains', 5872: 'Le Chenit' };

  it('VD hat in der BAG-Tabelle genau zwei Prämienregionen', async () => {
    const plz = await import('../../data/plzGemeinde.js');
    const regionen = new Set();
    for (const p of plz.allPLZ()) for (const g of plz.lookupPLZ(p)) if (g.kanton === 'VD') regionen.add(getRegion(g.bfsNr));
    expect([...regionen].sort()).toEqual([1, 2]);
  });

  it.each(Object.entries(R1))('%s (%s) liegt in Region 1', (bfs) => {
    expect(vdRegion(Number(bfs))).toBe(1);
  });

  it.each(Object.entries(R2))('%s (%s) liegt in Region 2', (bfs) => {
    expect(vdRegion(Number(bfs))).toBe(2);
  });

  it('eine unbekannte Gemeinde liefert keine Region — und damit keinen Betrag', () => {
    expect(vdRegion(999999)).toBeNull();
  });
});

// ── Subside spécifique: Hinweis, nie ein Betrag ──────────────────────────────────────────
describe('K31 VD: der spezifische Subside wird bewusst nicht gerechnet [1] art. 9', () => {
  it('Hinweis, wenn die anrechenbare Prämie den ordentlichen Subside um mehr als 10 % des RDU übersteigt', () => {
    // Prämie 500 × 12 = 6 000, ordentlicher Subside 0, RDU 50 000 → 10 % = 5 000 → 6 000 > 5 000
    expect(spezifischerSubsideMoeglich({ praemieMonat: 500, region: 1, rdu: 50000, mehrere: false, erwachseneAnnual: 0 })).toBe(true);
    // derselbe Fall mit RDU 62 000 → 10 % = 6 200 → knapp darunter
    expect(spezifischerSubsideMoeglich({ praemieMonat: 500, region: 1, rdu: 62000, mehrere: false, erwachseneAnnual: 0 })).toBe(false);
  });

  it('die Prämie zählt höchstens bis zur Referenzprämie [1] art. 13', () => {
    // Region 1, RDU ≤ 62 500, eine Person: Referenzprämie 563. Eine Prämie von 900 zählt nur
    // mit 563 — sonst würde eine teure Zusatzdeckung den Hinweis erzwingen.
    expect(IPV_VD.referenzPraemie.allein[0].r).toEqual({ 1: 563, 2: 527 });
    const mit900 = spezifischerSubsideMoeglich({ praemieMonat: 900, region: 1, rdu: 62000, mehrere: false, erwachseneAnnual: 0 });
    const mit563 = spezifischerSubsideMoeglich({ praemieMonat: 563, region: 1, rdu: 62000, mehrere: false, erwachseneAnnual: 0 });
    expect(mit900).toBe(mit563);
  });

  it('ohne erfasste Prämie oder ohne Region kein Hinweis', () => {
    expect(spezifischerSubsideMoeglich({ praemieMonat: 0, region: 1, rdu: 10000, mehrere: false, erwachseneAnnual: 0 })).toBe(false);
    expect(spezifischerSubsideMoeglich({ praemieMonat: 500, region: null, rdu: 10000, mehrere: false, erwachseneAnnual: 0 })).toBe(false);
  });

  it('der Hinweis trägt nie einen Betrag', () => {
    const r = calculateIPV({
      basis: { canton: 'VD', dateOfBirth: '1980-05-01', household: { adults: 1, children: [] } },
      finanzen: { monthlyIncome: 4200 }, wohnen: { postalCode: '1003', city: 'Lausanne' }, versicherungen: { kkPremium: 500 },
    });
    expect(r.zusatzHinweisKey).toBe('ipv.vdSpezifischerSubside');
    expect(JSON.stringify(r.zusatzHinweisKey)).not.toMatch(/\d/);
  });
});

// ── Die App-Angaben durchs Modell ────────────────────────────────────────────────────────
describe('K31 calculateIPV für VD (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../../data/plzGemeinde.js');
    await import('../ipvVaud.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  // Die Prämie ist vorbelegt, weil die App ohne sie bewusst keine Zahl zeigt: der Deckel nach
  // LVLAMal art. 16 al. 1bis liesse sich sonst nicht anwenden (Befund 20.09.2026, siehe den
  // eigenen Fall weiter unten). 700/Monat ist so hoch, dass der Deckel in den übrigen Fällen
  // nicht bindet — sie prüfen damit weiter das Modell, nicht den Deckel.
  const person = ({ monthlyIncome = 0, plz = '1003', city = 'Lausanne', children = [], dob = '1980-05-01', kkPremium = 700, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'VD', dateOfBirth: dob, maritalStatus: 'single', household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: plz, city },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('ohne erfasste Prämie keine Zahl: der Deckel nach LVLAMal art. 16 al. 1bis liesse sich sonst nicht anwenden', () => {
    expect(calculateIPV(person({ kkPremium: null }))).toMatchObject({ belegt: false, amount: null, offen: 'praemie' });
  });

  it('eine tiefe Prämie deckelt den Betrag — der Riegel nimmt dem Deckel nichts weg', () => {
    // 200/Monat = 2 400/Jahr liegt unter dem ordentlichen Subside von 3 972 → der Deckel greift.
    expect(calculateIPV(person({ kkPremium: 200 }))).toMatchObject({ belegt: true, annual: 2400 });
  });

  it('Einzelperson, Einkommen 0, Lausanne: 331/Monat, 3 972/Jahr, Grenze 50 000', () => {
    const r = calculateIPV(person());
    expect(r).toMatchObject({ belegt: true, eligible: true, amount: 331, annual: 3972, maxAnnual: 3972, reductionPercent: 100, region: 1, jahr: 2026 });
    expect(r.cantonData.maxIncome).toBe(50000);
    expect(r.vorbehaltKey).toBe('ipv.vorbehaltVD');
  });

  it('Einzelperson 2 000/Monat: 24 000 − 2 200 = 21 800 → Formel 1 → 300/Monat', () => {
    expect(vdSubsideMonat('e', 21800)).toBeCloseTo(299.2885, 3);
    expect(calculateIPV(person({ monthlyIncome: 2000 }))).toMatchObject({ amount: 300, annual: 3600 });
  });

  it('der ordentliche Subside hängt NICHT an der Prämienregion (anders als ZH und BE)', () => {
    const r1 = calculateIPV(person({ monthlyIncome: 2000, plz: '1003', city: 'Lausanne' }));
    const r2 = calculateIPV(person({ monthlyIncome: 2000, plz: '1400', city: 'Yverdon-les-Bains' }));
    expect(r1.region).toBe(1);
    expect(r2.region).toBe(2);
    expect(r2.annual).toBe(r1.annual);
  });

  it('über der Grenze: kein Betrag, die amtliche Grenze 50 000 wird genannt', () => {
    const r = calculateIPV(person({ monthlyIncome: 5000 }));
    expect(r).toMatchObject({ belegt: true, eligible: false, amount: 0, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: 50000 } });
  });

  it('über der Grenze des ordentlichen Subsides bleibt der Hinweis auf den spezifischen stehen', () => {
    // 5 000/Monat: Revenu OVAM 57 800 → kein ordentlicher Subside. Prämie 500 gegen 10 % des
    // RDU (5 780) → der spezifische Subside kann bestehen, er kennt keine Einkommensgrenze.
    const r = calculateIPV(person({ monthlyIncome: 5000, kkPremium: 500 }));
    expect(r.eligible).toBe(false);
    expect(r.zusatzHinweisKey).toBe('ipv.vdSpezifischerSubside');
  });

  it('Alleinerziehend mit 2 Kindern, Einkommen 0: 336 + 114 + 114 = 564/Monat, Grenze 76 000', () => {
    const r = calculateIPV(person({ children: [{ birthDate: '2016-03-01' }, { birthDate: '2018-03-01' }] }));
    expect(r).toMatchObject({ amount: 564, annual: 6768, region: 1 });
    expect(r.cantonData.maxIncome).toBe(76000);
  });

  it('mit Kind(ern) rechnet die erwachsene Person in Kategorie b), nicht in a)', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 3000 }));
    const mit = calculateIPV(person({ monthlyIncome: 3000, children: [{ birthDate: '2016-03-01' }] }));
    // ohne Kind: 36 000 − 2 200 = 33 800 → Kategorie a) tief in der Kurve → 75.
    // mit Kind: 36 000 − 3 500 = 32 500 RDU, minus 6 000 Kinderabzug = 26 500 → Kategorie b)
    // knapp über C2 → 296.42 → aufgerundet 297, plus 114 fürs Kind.
    expect(ohne.amount).toBe(75);
    expect(mit.amount).toBe(297 + 114);
  });

  it('Renten und die 3a-Einzahlung zählen zum Einkommen', () => {
    const nurLohn = calculateIPV(person({ monthlyIncome: 2000 }));
    const mitRente = calculateIPV(person({ monthlyIncome: 1000, finanzen: { ahvRente: 1000 } }));
    expect(mitRente.annual).toBe(nurLohn.annual);
    // pension3a ist ein Jahresbetrag (Feldbeschriftung «3. Säule A eingezahlt CHF/Jahr»).
    const mit3a = calculateIPV(person({ monthlyIncome: 2000, finanzen: { pension3a: 7258 } }));
    expect(mit3a.annual).toBeLessThan(nurLohn.annual);
  });

  it('Vermögen über dem Freibetrag hebt das Revenu déterminant (1/15 des Überschusses)', () => {
    const ohne = calculateIPV(person({ monthlyIncome: 2000, finanzen: { savingsAccount: 59000 } }));
    const mit = calculateIPV(person({ monthlyIncome: 2000, finanzen: { savingsAccount: 119000 } }));
    expect(ohne.amount).toBe(300);
    // 21 800 + 4 000 = 25 800 → 232.6… → aufgerundet 233
    expect(mit.amount).toBe(233);
  });

  it('Prämie tiefer als der Subside: höchstens die Prämie (LVLAMal art. 16 al. 1bis)', () => {
    const r = calculateIPV(person({ kkPremium: 200 }));
    expect(r.annual).toBe(2400);
  });

  it('der Deckel wirkt mit Kindern nur auf den Anteil der erwachsenen Person', () => {
    // Erwachsene 336 → auf 200 gedeckelt; das Kind bleibt bei 114.
    const r = calculateIPV(person({ kkPremium: 200, children: [{ birthDate: '2016-03-01' }] }));
    expect(r.annual).toBe(200 * 12 + 114 * 12);
  });

  it('PLZ mit Gemeinden in beiden Regionen: mit Ortsname eindeutig, ohne Ortsname keine Zahl', () => {
    // 1080 = Servion (R2) und Forel (Lavaux) (R1)
    expect(calculateIPV(person({ monthlyIncome: 2000, plz: '1080', city: '' }))).toMatchObject({ belegt: false, amount: null, offen: 'region' });
    expect(calculateIPV(person({ monthlyIncome: 2000, plz: '1080', city: 'Forel (Lavaux)' })).region).toBe(1);
    expect(calculateIPV(person({ monthlyIncome: 2000, plz: '1080', city: 'Servion' })).region).toBe(2);
  });

  // Was die App bewusst NICHT rechnet — je mit dem Grund, den die Anzeige nennt.
  it.each([
    ['Paar im Haushalt', { basis: { household: { adults: 2, children: [] } } }, 'haushalt'],
    ['verheiratet', { basis: { maritalStatus: 'married' } }, 'haushalt'],
    ['Konkubinat', { basis: { maritalStatus: 'cohabiting' } }, 'haushalt'],
    ['ohne Geburtsdatum', { dob: '' }, 'alter'],
    ['Kind ohne Alter (0 = nicht erfasst)', { children: [{ age: 0 }] }, 'alter'],
    ['junge erwachsene Person 19–25 im Haushalt', { children: [{ age: 20 }] }, 'haushalt'],
    ['Gemeinde nicht eindeutig', { plz: '1080', city: '' }, 'region'],
    ['PLZ ohne VD-Gemeinde', { plz: '8001', city: 'Zürich' }, 'region'],
  ])('%s: kein Betrag, Grund «%s»', (_, patch, grund) => {
    expect(calculateIPV(person({ monthlyIncome: 2000, ...patch }))).toMatchObject({ belegt: false, amount: null, offen: grund });
  });

  it('wer im Anspruchsjahr erst 26 wird, fällt heraus — ab Jahrgang davor rechnet sie', () => {
    expect(calculateIPV(person({ dob: '2000-05-01' }))).toMatchObject({ offen: 'alter' });
    expect(calculateIPV(person({ dob: '1999-05-01' })).amount).toBe(331);
  });

  it('ein Kind, das im Anspruchsjahr 18 wird, zählt noch als Kind; mit 19 nicht mehr', () => {
    expect(calculateIPV(person({ children: [{ birthDate: '2008-11-01' }] })).amount).toBe(336 + 114);
    expect(calculateIPV(person({ children: [{ birthDate: '2007-11-01' }] }))).toMatchObject({ offen: 'haushalt' });
  });

  // Die Parameter gelten je Anspruchsjahr — der Arrêté wird jährlich neu erlassen und hat für
  // 2026 den Kinderbetrag von 74 auf 114 geändert. Ab dem 01.01.2027 keine Zahl mehr.
  describe('Jahres-Riegel', () => {
    afterEach(() => { vi.useRealTimers(); });

    it('im Anspruchsjahr 2026 rechnet sie', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-12-31T12:00:00'));
      expect(calculateIPV(person()).annual).toBe(3972);
    });

    it('ab 2027 keine Zahl mehr, bis die Werte nachgeführt sind', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person())).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });

  it('Betrag sinkt nie mit steigendem Einkommen (Orientierungs-Fälle ausgenommen)', () => {
    for (const children of [[], [{ birthDate: '2016-01-01' }], [{ birthDate: '2016-01-01' }, { birthDate: '2018-01-01' }]]) {
      let vorher = Infinity;
      for (let m = 0; m <= 9000; m += 100) {
        const r = calculateIPV(person({ monthlyIncome: m, children }));
        if (r.belegt === false) continue;
        expect(r.annual ?? 0).toBeLessThanOrEqual(vorher);
        vorher = r.annual ?? 0;
      }
    }
  });

  it('negatives Einkommen sprengt die Obergrenze nicht', () => {
    const r = calculateIPV(person({ monthlyIncome: -1000 }));
    expect(r.annual).toBe(3972);
    expect(r.annual).toBeLessThanOrEqual(r.maxAnnual);
  });

  // Grenzfälle genau auf C, A und B — dort entscheidet ein Franken über die Formel.
  it.each([
    ['genau C1 (17 000)', 17000, 331],
    ['ein Franken über C1', 17001, 331],
    ['genau A1 (40 000)', 40000, 30],
    ['genau B1 (50 000)', 50000, 30],
    ['ein Franken über B1', 50001, 0],
  ])('Kategorie a), Revenu OVAM %s → %i/Monat', (_, rd, erwartet) => {
    expect(ipvVaudRechnen({ personen: ['e'], revenuOvam: rd }).monat).toBe(erwartet);
  });

  it.each([
    ['genau C2 (24 200)', 24200, 300],
    ['genau A2 (55 000)', 55000, 20],
    ['genau B2 (69 000)', 69000, 20],
    ['ein Franken über B2', 69001, 0],
  ])('Kategorie b), Revenu OVAM %s → %i/Monat', (_, rd, erwartet) => {
    expect(ipvVaudRechnen({ personen: ['ef'], revenuOvam: rd }).monat).toBe(erwartet);
  });

  it.each([
    ['genau C3 (26 000)', 26000, 114],
    ['genau A3 (63 000)', 63000, 114],
    ['genau B3 (76 000)', 76000, 114],
    ['ein Franken über B3', 76001, 0],
  ])('Kategorie c), Revenu OVAM %s → %i/Monat', (_, rd, erwartet) => {
    expect(ipvVaudRechnen({ personen: ['k'], revenuOvam: rd }).monat).toBe(erwartet);
  });
});
