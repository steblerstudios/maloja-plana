import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { IPV_BE, ipvBernRechnen, beMassgebendesEinkommen, beRegion } from '../ipvBern.js';
import { calculateIPV, preloadPLZ, CANTONAL_IPV } from '../cantonalData.js';
import { getRegion } from '../../data/praemienRegionen.js';

// K31 — Prämienverbilligung Kanton Bern 2026 nach der amtlichen Stufentabelle.
// Quellen (abgerufen 2026-09-20), Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt BE:
//  [A] Amt für Sozialversicherungen (ASV), «Berechnungsschema — Gültig ab 1. Januar 2026»,
//      https://www.asv.dij.be.ch/content/dam/asv_dij/dokumente/de/pr%C3%A4mienverbilligung--informationen/Berechnungsschema%202026_de.pdf
//  [B] Kantonale Krankenversicherungsverordnung (KKVV), BSG 842.111.1, Stand 01.12.2025,
//      Art. 5, 9, 10, 10a, 10b, 10c, 10d — https://www.belex.sites.be.ch/app/de/texts_of_law/842.111.1
//  [C] ASV, «Informationen zur Prämienverbilligung — Gültig ab 1. Januar 2026»,
//      https://www.asv.dij.be.ch/content/dam/asv_dij/dokumente/de/pr%C3%A4mienverbilligung--informationen/Informationsblatt%202026_de.pdf
//
// Bern rechnet nicht linear, sondern in Stufen: ein fester Monatsbetrag je Prämienregion,
// Altersgruppe und Einkommensstufe. Die Tests prüfen jede Zelle der amtlichen Tabelle, die
// Stufengrenzen von beiden Seiten und die Sozialabzüge.

// [A], Tabelle «Wie hoch ist Ihre monatliche Prämienverbilligung?», wörtlich übernommen;
// dieselben Zahlen stehen in [B] Art. 10a Abs. 1 und 3.
const TABELLE_ERWACHSENE = {
  1: [221, 147, 107, 67, 33.5],
  2: [196, 132, 96, 60, 30],
  3: [183, 123, 89, 56, 28],
};
const TABELLE_KINDER = { 1: 119.3, 2: 106, 3: 99.35 };

describe('K31 calculateIPV für BE, bevor PLZ-Daten und BE-Modul geladen sind', () => {
  it('Orientierung ohne Betrag (Grund «laden»), nie ein geratener Betrag', () => {
    const r = calculateIPV({ basis: { canton: 'BE', dateOfBirth: '1980-05-01' }, finanzen: {}, wohnen: { postalCode: '3011' } });
    expect(r).toMatchObject({ belegt: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: 'laden' });
  });
});

describe('K31 BE-Modell gegen die amtliche Stufentabelle 2026 [A]/[B]', () => {
  for (const region of [1, 2, 3]) {
    TABELLE_ERWACHSENE[region].forEach((betrag, stufe) => {
      // Mitte der Stufe, damit die Zuordnung eindeutig ist; die Ränder prüft der Block darunter.
      const me = stufe === 0 ? 4500 : (IPV_BE.stufen[stufe - 1] + IPV_BE.stufen[stufe]) / 2;
      const personen = stufe === 4 ? ['e', 'k'] : ['e'];
      it(`Region ${region}, Erwachsene, Stufe bis ${IPV_BE.stufen[stufe]}: CHF ${betrag}/Monat`, () => {
        const erwartet = stufe === 4 ? betrag + TABELLE_KINDER[region] : betrag;
        expect(ipvBernRechnen({ region, personen, me }).monat).toBeCloseTo(erwartet, 6);
      });
    });

    it(`Region ${region}, Kind bis 18: CHF ${TABELLE_KINDER[region]}/Monat auf jeder Stufe`, () => {
      // [B] Art. 10d Abs. 1: Kinder erhalten 80 % der Prämie, solange das massgebende
      // Familieneinkommen 45'000 nicht übersteigt — unabhängig von der Stufe.
      for (const me of [0, 9000, 17000, 25000, 35000, 45000]) {
        const r = ipvBernRechnen({ region, personen: ['e', 'k'], me });
        expect(r.monat - TABELLE_ERWACHSENE[region][IPV_BE.stufen.findIndex((s) => me <= s)]).toBeCloseTo(TABELLE_KINDER[region], 6);
      }
    });
  }
});

describe('K31 BE: Stufengrenzen von beiden Seiten', () => {
  const r1 = (me, kinder = 0) => ipvBernRechnen({ region: 1, personen: ['e', ...Array(kinder).fill('k')], me });

  it('Einkommen 0 und negativ: oberste Stufe, nie mehr als der Höchstbetrag', () => {
    expect(r1(0).monat).toBe(221);
    expect(r1(-5000).monat).toBe(221);
    expect(r1(0).annual).toBe(2652);
    expect(r1(0).maximal).toBe(2652);
  });

  it.each([
    [8999.99, 221], [9000, 221], [9000.01, 147], [9001, 147],
    [16999, 147], [17000, 147], [17001, 107],
    [24999, 107], [25000, 107], [25001, 67],
    [34999, 67], [35000, 67],
  ])('massgebendes Einkommen %s → CHF %s/Monat (Region 1, ohne Kinder)', (me, betrag) => {
    expect(r1(me).monat).toBe(betrag);
  });

  it('ohne Kinder endet der Anspruch bei 35 000 [A]', () => {
    expect(r1(35000)).toMatchObject({ annual: 2652 / 221 * 67, grenze: 35000 });
    expect(r1(35001)).toMatchObject({ annual: 0, stufe: null, grenze: 35000 });
  });

  it('mit Kindern reicht die Tabelle bis 45 000 [A] Fussnote 1 / [B] Art. 10a Abs. 3', () => {
    expect(r1(35001, 1).monat).toBeCloseTo(33.5 + 119.3, 6);
    expect(r1(45000, 1).monat).toBeCloseTo(33.5 + 119.3, 6);
    expect(r1(45001, 1)).toMatchObject({ annual: 0, grenze: 45000 });
  });
});

describe('K31 BE: massgebendes Einkommen [B] Art. 9', () => {
  it('Alleinstehende: Abzug CHF 2 200', () => {
    expect(beMassgebendesEinkommen({ reineinkommen: 50000, vermoegen: 0, mitglieder: 1, kinderZahl: 0 })).toBe(47800);
  });

  it('nie negativ: ohne Einkommen bleibt es 0', () => {
    expect(beMassgebendesEinkommen({ reineinkommen: 0, vermoegen: 0, mitglieder: 1, kinderZahl: 0 })).toBe(0);
  });

  it('Verheiratete: Abzug CHF 13 000 (pro Ehepaar)', () => {
    expect(beMassgebendesEinkommen({ reineinkommen: 50000, vermoegen: 0, mitglieder: 2, kinderZahl: 0, verheiratet: true })).toBe(37000);
  });

  it.each([
    [1, 9750 + 15000],
    [2, 9750 + 15000 + 12500],
    [3, 9750 + 15000 + 12500 + 10000],
  ])('alleinerziehend mit %s Kind(ern): Abzug CHF %s (9 750 + 15 000 / 12 500 / 10 000)', (kinderZahl, abzug) => {
    const me = beMassgebendesEinkommen({ reineinkommen: 60000, vermoegen: 0, mitglieder: 1 + kinderZahl, kinderZahl });
    expect(me).toBe(60000 - abzug);
  });

  it('Vermögen: 17 000 Freibetrag je Familienmitglied, 5 % des Rests zählen als Einkommen', () => {
    // knapp über dem Freibetrag: 1 Franken übersteigendes Vermögen → 5 Rappen Einkommen
    expect(beMassgebendesEinkommen({ reineinkommen: 30000, vermoegen: 17001, mitglieder: 1, kinderZahl: 0 })).toBeCloseTo(27800.05, 6);
    // genau auf dem Freibetrag: nichts wird zugerechnet
    expect(beMassgebendesEinkommen({ reineinkommen: 30000, vermoegen: 17000, mitglieder: 1, kinderZahl: 0 })).toBe(27800);
    // darunter ebenfalls nicht (kein negativer Zuschlag)
    expect(beMassgebendesEinkommen({ reineinkommen: 30000, vermoegen: 0, mitglieder: 1, kinderZahl: 0 })).toBe(27800);
    // Familie mit 2 Kindern: Freibetrag 3 × 17 000 = 51 000
    expect(beMassgebendesEinkommen({ reineinkommen: 60000, vermoegen: 91000, mitglieder: 3, kinderZahl: 2 })).toBe(60000 + 2000 - 37250);
  });

  it('Werte 2026 sichtbar im Datensatz', () => {
    expect(IPV_BE.jahr).toBe(2026);
    expect(CANTONAL_IPV.BE.beleg.quelle).toMatch(/Amt für Sozialversicherungen/);
    expect(CANTONAL_IPV.BE.beleg.stand).toMatch(/2026/);
    expect(CANTONAL_IPV.BE.maxIncome).toBeNull();
  });
});

// [B] Art. 10 Abs. 5: «Die Gemeinden werden den Prämienregionen zugeteilt, die vom Bundesamt
// für Gesundheit gestützt auf Artikel 61 Absatz 2 KVG festgelegt werden.» Massgebend ist also
// dieselbe Tabelle wie in src/data/praemienRegionen.js. [A] druckt die Listen zusätzlich ab —
// dieser Test hält beide Quellen gegeneinander und friert die eine bekannte Abweichung ein.
describe('K31 Prämienregionen BE (Guard: Liste im Berechnungsschema [A] gegen BAG-Tabelle)', () => {
  const ASV_R1 = `Bern, Biel/Bienne, Bolligen, Bremgarten b. Bern, Evilard, Ittigen, Kirchlindach, Köniz,
    Muri b. Bern, Oberbalm, Ostermundigen, Stettlen, Vechigen, Wohlen b. Bern, Zollikofen`;
  const ASV_R2 = `Aarberg, Aefligen, Aegerten, Alchenstorf, Allmendingen, Amsoldingen, Arch, Arni, Bargen,
    Bäriswil, Bätterkinden, Bellmund, Belp, Belprahon, Biglen, Blumenstein, Bowil, Brenzikofen, Brügg,
    Brüttelen, Buchholterberg, Büetigen, Bühl, Büren an der Aare, Burgdorf, Burgistein, Champoz, Corcelles,
    Corgémont, Cormoret, Cortébert, Court, Courtelary, Crémines, Deisswil b. Münchenbuchsee,
    Diessbach b. Büren, Dotzigen, Epsach, Eriz, Erlach, Ersigen, Eschert, Fahrni, Ferenbalm, Finsterhennen,
    Forst-Längenbühl, Fraubrunnen, Frauenkappelen, Freimettigen, Gals, Gampelen, Gerzensee, Grandval,
    Grossaffoltern, Grosshöchstetten, Guggisberg, Gurbrü, Gurzelen, Hagneck, Hasle b. Burgdorf, Häutligen,
    Heiligenschwendi, Heimberg, Heimiswil, Hellsau, Herbligen, Hermrigen, Hilterfingen, Hindelbank,
    Höchstetten, Homberg, Horrenbach-Buchen, Iffwil, Ins, Ipsach, Jaberg, Jegenstorf, Jens, Kallnach,
    Kappelen, Kaufdorf, Kehrsatz, Kernenried, Kiesen, Kirchberg, Kirchdorf, Konolfingen, Koppigen,
    Krauchthal, Kriechenwil, La Ferrière, La Neuveville, Landiswil, Laupen, Lengnau, Leuzigen, Ligerz,
    Linden, Loveresse, Lüscherz, Lyss, Lyssach, Mattstetten, Meienried, Meikirch, Meinisberg, Merzligen,
    Mirchel, Mont-Tramelan, Moosseedorf, Mörigen, Mühleberg, Münchenbuchsee, Münchenwiler, Münsingen,
    Müntschemier, Neuenegg, Nidau, Niederhünigen, Niedermuhlern, Nods, Oberburg, Oberdiessbach,
    Oberhofen am Thunersee, Oberhünigen, Oberlangenegg, Oberthal, Oberwil b. Büren, Oppligen, Orpund,
    Orvin, Perrefitte, Péry-La Heutte, Petit-Val, Pieterlen, Plateau de Diesse, Pohlern, Port, Radelfingen,
    Rapperswil, Rebévelier, Reconvilier, Renan, Riggisberg, Roches, Romont, Rubigen, Rüdtligen-Alchenflüh,
    Rüeggisberg, Rumendingen, Rüschegg, Rüti b. Büren, Rüti b. Lyssach, Safnern, Saicourt, Saint-Imier,
    Sauge, Saules, Schelten, Scheuren, Schlosswil, Schüpfen, Schwadernau, Schwarzenburg, Seedorf, Seehof,
    Seftigen, Sigriswil, Siselen, Sonceboz-Sombeval, Sonvilier, Sorvilier, Steffisburg, Studen,
    Sutz-Lattrigen, Täuffelen, Tavannes, Teuffenthal, Thierachern, Thun, Thurnen, Toffen, Tramelan,
    Treiten, Tschugg, Twann-Tüscherz, Uebeschi, Uetendorf, Unterlangenegg, Urtenen-Schönbühl, Uttigen,
    Utzenstorf, Valbirse, Villeret, Vinelz, Wachseldorn, Wald, Walkringen, Walperswil, Wattenwil, Wengi,
    Wichtrach, Wiggiswil, Wiler b. Utzenstorf, Wileroltigen, Willadingen, Worb, Worben, Wynigen, Zäziwil,
    Zielebach, Zuzwil`;
  // «Prämienregion 3 – Gemeinden: Alle übrigen» [A].
  const norm = (s) => s.toLowerCase().replace(/\s*\(be\)$/, '').replace(/\bb\./g, 'bei').replace(/[\s.]+/g, ' ').trim();
  const liste = (s) => s.split(',').map((x) => norm(x));

  it('R1: 15 Gemeinden, R2: 212 Einträge — so viele stehen im Schema', () => {
    expect(liste(ASV_R1)).toHaveLength(15);
    expect(liste(ASV_R2)).toHaveLength(212);
  });

  it('jede Berner Gemeinde der PLZ-Daten hat in beiden Quellen dieselbe Region — ausser Reutigen', async () => {
    const plz = await import('../../data/plzGemeinde.js');
    const r1 = new Set(liste(ASV_R1));
    const r2 = new Set(liste(ASV_R2));
    const gemeinden = new Map();
    for (const p of plz.allPLZ()) for (const g of plz.lookupPLZ(p)) if (g.kanton === 'BE') gemeinden.set(g.bfsNr, g.gemeinde);
    expect(gemeinden.size).toBeGreaterThan(300);

    const abweichungen = [];
    for (const [bfsNr, name] of gemeinden) {
      const ausSchema = r1.has(norm(name)) ? 1 : r2.has(norm(name)) ? 2 : 3;
      if (ausSchema !== getRegion(bfsNr)) abweichungen.push([name, bfsNr, ausSchema, getRegion(bfsNr)]);
    }
    // Reutigen (BFS 767) steht beim BAG in Region 2, fehlt aber in der R2-Liste des Schemas.
    expect(abweichungen).toEqual([['Reutigen', '767', 3, 2]]);
  });

  it('bei der strittigen Gemeinde gibt es keine Region und damit keinen Betrag', () => {
    expect(beRegion(767)).toBeNull();
    expect(beRegion(351)).toBe(1);   // Bern
    expect(beRegion(404)).toBe(2);   // Burgdorf
    expect(beRegion(581)).toBe(3);   // Interlaken
    expect(beRegion(999999)).toBeNull();
  });
});

describe('K31 calculateIPV für BE (App-Angaben → Modell)', () => {
  beforeAll(async () => {
    preloadPLZ();
    await import('../../data/plzGemeinde.js');
    await import('../ipvBern.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  const person = ({ monthlyIncome = 0, plz = '3011', city = '', children = [], dob = '1980-05-01', kkPremium = 600, finanzen = {}, basis = {} } = {}) => ({
    basis: { canton: 'BE', dateOfBirth: dob, household: { adults: 1, children }, ...basis },
    finanzen: { monthlyIncome, ...finanzen },
    wohnen: { postalCode: plz, city },
    versicherungen: kkPremium != null ? { kkPremium } : {},
  });

  it('ohne erfasste Prämie keine Zahl (KKVV Art. 10 Abs. 1)', () => {
    expect(calculateIPV(person({ kkPremium: null }))).toMatchObject({ belegt: false, amount: null, offen: 'praemie' });
  });

  it('Einzelperson, Einkommen 0, Stadt Bern (Region 1): 221/Monat, 2 652/Jahr, Grenze 35 000', () => {
    const r = calculateIPV(person());
    expect(r).toMatchObject({ belegt: true, eligible: true, amount: 221, annual: 2652, maxAnnual: 2652, reductionPercent: 100, region: 1, jahr: 2026 });
    expect(r.cantonData.maxIncome).toBe(35000);
    // Einkommen 0 → unter 14'000: der Kanton prüft NICHT automatisch, es braucht einen Antrag
    // bis 31.12. (Informationsblatt 2026, S. 2). Korrigiert 20.09.2026 nach der Fachprüfung;
    // vorher stand hier 'ipv.noteAutoTaxData' — für genau die ärmste Gruppe falsch.
    expect(r.noteKey).toBe('ipv.beAntragNoetig');
  });

  it('Einzelperson Burgdorf (Region 2), 2 000/Monat: 24 000 − 2 200 = 21 800 → Stufe bis 25 000 → 96/Monat', () => {
    const r = calculateIPV(person({ monthlyIncome: 2000, plz: '3400' }));
    expect(r).toMatchObject({ amount: 96, annual: 1152, region: 2 });
  });

  it('Einzelperson Interlaken (Region 3), 2 500/Monat: 27 800 → Stufe bis 35 000 → 56/Monat', () => {
    expect(calculateIPV(person({ monthlyIncome: 2500, plz: '3800' }))).toMatchObject({ amount: 56, annual: 672, region: 3 });
  });

  it('über der Grenze: kein Anspruch, die amtliche Grenze 35 000 wird genannt', () => {
    expect(calculateIPV(person({ monthlyIncome: 3200 }))).toMatchObject({
      belegt: true, eligible: false, amount: 0, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: 35000 },
    });
  });

  // ⟨geändert 20.09.2026, zweite Fachprüfungsrunde⟩ Vorher setzte dieser Test das Einkommen
  // über `pension3a: 11200` — das ging nur, solange die 3a fälschlich aufgerechnet wurde.
  // Jetzt über das Einkommensfeld: die Stufengrenze 9 000 liegt bei (9 000 + 2 200) / 12 =
  // 933.33/Monat, also zwischen 933 und 934.
  it('Stufengrenze durch die App: 933/Monat noch oberste Stufe, 934 die nächste', () => {
    // 933 × 12 = 11 196 − 2 200 Sozialabzug = 8 996 → Stufe «bis 9 000»
    expect(calculateIPV(person({ monthlyIncome: 933 }))).toMatchObject({ amount: 221 });
    // 934 × 12 = 11 208 − 2 200 = 9 008 → nächste Stufe
    expect(calculateIPV(person({ monthlyIncome: 934 }))).toMatchObject({ amount: 147 });
  });

  // 🛑 RÜCKFALL-WÄCHTER (Befund Fachprüfung 20.09.2026, zweite Runde).
  // Die 3a wurde doppelt gezählt. In einer Stufentabelle ist das besonders scharf: ein
  // einziger Franken Differenz kippt eine ganze Stufe, im Jahr bis zu CHF 888.
  // Zusätzlich zitierte ipvBern.js dafür KKVV Art. 9 Abs. 2 statt Art. 6 Abs. 4 lit. i —
  // und verlor dabei den Deckel aufs bundesrechtliche Maximum ganz.
  // Der eingesetzte 3a-Betrag ist hier ein BELIEBIGER Eingabewert, kein Prüfgegenstand: Die
  // Zusage lautet «ein beliebiger 3a-Betrag verändert das Ergebnis nicht», und die zweite
  // Erwartung prüft genau das — gegen denselben Fall ohne 3a. Der Betrag steht trotzdem auf
  // dem geltenden Maximum (src/data/saeule3a.js), damit hier kein überholter Gesetzeswert
  // liegen bleibt; bis zum 23.09.2026 stand 7'056, das Maximum der Steuerjahre 2023/2024.
  it('Säule 3a zählt NICHT zusätzlich — und kippt damit keine Stufe mehr', () => {
    expect(calculateIPV(person({ monthlyIncome: 933, finanzen: { pension3a: 7258 } }))).toMatchObject({ amount: 221 });
    // der alte Weg hätte hier 11 196 + 7 258 = 18 454 − 2 200 = 16 254 ergeben und damit in die
    // Stufe «bis 17 000» geworfen statt in «bis 9 000» (stufen: [9000, 17000, …] in ipvBern.js).
    // ⟨korrigiert 23.09.2026⟩ Hier stand «zwei Stufen tiefer» — gegen die Stufenliste gerechnet
    // ist es eine. Der Fehler hing nicht am Betrag: auch mit 7'056 ergab sich dieselbe Stufe.
    expect(calculateIPV(person({ monthlyIncome: 933, finanzen: { pension3a: 7258 } })).amount)
      .toBe(calculateIPV(person({ monthlyIncome: 933 })).amount);
  });

  it('Renten zählen zum Einkommen', () => {
    // 2 000 AHV × 12 = 24 000 − 2 200 = 21 800 → Stufe bis 25 000
    expect(calculateIPV(person({ finanzen: { ahvRente: 2000 } }))).toMatchObject({ amount: 107, region: 1 });
  });

  it.each([
    ['1 Kind', [{ birthDate: '2015-01-01' }], 9750 + 15000],
    ['2 Kinder', [{ birthDate: '2015-01-01' }, { birthDate: '2018-01-01' }], 9750 + 15000 + 12500],
    ['3 Kinder', [{ birthDate: '2015-01-01' }, { birthDate: '2018-01-01' }, { birthDate: '2020-01-01' }], 9750 + 15000 + 12500 + 10000],
  ])('alleinerziehend, %s, 3 200/Monat: Sozialabzug %s, Grenze 45 000', (_, children, abzug) => {
    const r = calculateIPV(person({ monthlyIncome: 3200, children }));
    const me = 38400 - abzug;
    const stufe = IPV_BE.stufen.findIndex((s) => me <= s);
    expect(r.cantonData.maxIncome).toBe(45000);
    expect(r.annual).toBe(Math.round((TABELLE_ERWACHSENE[1][stufe] + children.length * TABELLE_KINDER[1]) * 12));
  });

  it('Familie in der Zone 35 001–45 000: nur dort gilt die letzte Spalte', () => {
    // 1 Kind, 6 000/Monat = 72 000 − 24 750 = 47 250 → über 45 000, kein Anspruch
    expect(calculateIPV(person({ monthlyIncome: 6000, children: [{ birthDate: '2015-01-01' }] })))
      .toMatchObject({ eligible: false, noteParams: { value: 45000 } });
    // 1 Kind, 5 500/Monat = 66 000 − 24 750 = 41 250 → letzte Spalte 33.50 + Kind 119.30
    expect(calculateIPV(person({ monthlyIncome: 5500, children: [{ birthDate: '2015-01-01' }] })).annual)
      .toBe(Math.round((33.5 + 119.3) * 12));
  });

  it('Vermögen über dem Freibetrag hebt die Stufe (5 % zählen als Einkommen)', () => {
    // ⟨geändert 20.09.2026: Einkommen vorher über `pension3a` gesetzt, siehe oben⟩
    // ohne Vermögen: 900 × 12 = 10 800 − 2 200 = 8 600 → oberste Stufe
    expect(calculateIPV(person({ monthlyIncome: 900 })).amount).toBe(221);
    // mit 57 000 Vermögen: (57 000 − 17 000) × 5 % = 2 000 → 10 600 → nächste Stufe
    expect(calculateIPV(person({ monthlyIncome: 900, finanzen: { savingsAccount: 57000 } })).amount).toBe(147);
  });

  // 750'000 ist in BE kein Ausschluss, sondern der Punkt, ab dem nicht automatisch geprüft wird.
  // Informationsblatt 2026, S. 1: «Leben Sie unverheiratet mit Ihrem Partner/Ihrer Partnerin im
  // gleichen Haushalt und haben mindestens ein gemeinsames Kind, dann wird die Berechnung … wie
  // bei einem verheirateten Paar vorgenommen.» Das Einkommen der zweiten Person fehlt der App.
  // Ergänzt 20.09.2026 nach der Fachprüfung — vorher rechnete dieser Fall durch.
  it.each([
    ['Konkubinat mit Kind', { children: [{ age: 5 }] }],
    ['Konkubinat ohne Kind', {}],
  ])('%s: Orientierung statt Betrag', (_, opts) => {
    const r = calculateIPV(person({ ...opts, basis: { maritalStatus: 'cohabiting' } }));
    expect(r).toMatchObject({ belegt: false, amount: null, offen: 'haushalt' });
  });

  // Informationsblatt 2026, S. 2: unter 14'000 korrigiertem Reineinkommen (ohne Kinder) prüft
  // der Kanton nicht automatisch — wer nicht bis 31.12. beantragt, verliert den ganzen Anspruch.
  it('Einkommen knapp unter/über 14 000: Antrags-Hinweis oder automatische Prüfung', () => {
    expect(calculateIPV(person({ monthlyIncome: 13999 / 12 })).noteKey).toBe('ipv.beAntragNoetig');
    expect(calculateIPV(person({ monthlyIncome: 14000 / 12 })).noteKey).toBe('ipv.noteAutoTaxData');
  });

  // KKVV Art. 10 Abs. 1: «Die Prämie wird höchstens bis zu ihrem effektiven Umfang verbilligt.»
  // Der Deckel gilt pro Person: mit Kindern wird nur der Anteil der erwachsenen Person gedeckelt,
  // deren Prämie die App kennt. Vorher entfiel der Deckel mit Kindern ganz.
  it('Prämien-Deckel wirkt auch mit Kindern, aber nur auf den Erwachsenen-Anteil', () => {
    // Region 1, Einkommen 0, ein Kind: 221 + 119.30 = 340.30/Monat = 4083.60 → 4084/Jahr.
    // Mit einer Prämie von 100/Monat (1 200/Jahr) bleibt: 1 200 + 1 431.60 = 2 631.60 → 2632.
    expect(calculateIPV(person({ children: [{ age: 5 }], kkPremium: 100 })).annual).toBe(2632);
    expect(calculateIPV(person({ children: [{ age: 5 }] })).annual).toBe(4084);
  });

  it('Bruttovermögen über 750 000: kein Betrag, Grund «vermoegenAntrag» [C]', () => {
    expect(calculateIPV(person({ finanzen: { savingsAccount: 750001 } }))).toMatchObject({ belegt: false, amount: null, offen: 'vermoegenAntrag' });
    expect(calculateIPV(person({ finanzen: { savingsAccount: 750000 } })).belegt).toBe(true);
  });

  it('Prämie tiefer als die Verbilligung: höchstens die Prämie ([B] Art. 10 Abs. 1)', () => {
    expect(calculateIPV(person({ kkPremium: 100 }))).toMatchObject({ amount: 100, annual: 1200, maxAnnual: 1200 });
  });

  it('PLZ mit mehreren Regionen: mit Ortsname eindeutig, ohne Ortsname keine Zahl', () => {
    expect(calculateIPV(person({ plz: '2503', city: 'Biel/Bienne' })).region).toBe(1);
    expect(calculateIPV(person({ plz: '2503', city: 'Nidau' })).region).toBe(2);
    expect(calculateIPV(person({ plz: '2503' }))).toMatchObject({ belegt: false, offen: 'region' });
    expect(calculateIPV(person({ plz: '3400' })).region).toBe(2); // mehrere Gemeinden, alle Region 2
  });

  it('Gemeinde, bei der die amtlichen Quellen auseinandergehen: kein Betrag', () => {
    // Eigener Grund: die Gemeinde ist eindeutig, strittig ist ihre Prämienregion.
    expect(calculateIPV(person({ plz: '3647' }))).toMatchObject({ belegt: false, offen: 'regionStrittig' });
  });

  it.each([
    ['ohne PLZ', { plz: '' }, 'region'],
    ['ohne Geburtsdatum', { dob: '' }, 'alter'],
    ['Jahrgang 2000 — wird im Anspruchsjahr erst 26, die Tabelle kennt «älter als 25»', { dob: '2000-01-01' }, 'alter'],
    ['junge erwachsene Person (Jahrgang 2004)', { dob: '2004-01-01' }, 'alter'],
    ['Paar', { basis: { household: { adults: 2, children: [] } } }, 'haushalt'],
    ['verheiratet ohne Partner im Haushalt', { basis: { maritalStatus: 'married' } }, 'haushalt'],
    ['Kind ohne jede Altersangabe', { children: [{}] }, 'alter'],
    ['Kind mit age 0 (Vorbelegung)', { children: [{ age: 0 }] }, 'alter'],
    ['Kind ab 19 (Ausbildung und eigenes Einkommen unbekannt)', { children: [{ age: 19 }] }, 'haushalt'],
    ['Kind, das im Anspruchsjahr 19 wird', { children: [{ birthDate: '2007-12-01' }] }, 'haushalt'],
  ])('%s: Orientierung statt Betrag', (_, opts, grund) => {
    const r = calculateIPV(person(opts));
    expect(r).toMatchObject({ belegt: false, eligible: false, amount: null, noteKey: 'ipv.orientierungOffen', offen: grund });
    expect(r.cantonData).toBeUndefined();
  });

  it('Jahrgang 1999 ist im Anspruchsjahr sicher über 25 → rechnet', () => {
    expect(calculateIPV(person({ dob: '1999-12-31' })).annual).toBe(2652);
  });

  it('Kind, das im Anspruchsjahr 18 wird, zählt noch als Kind', () => {
    expect(calculateIPV(person({ children: [{ birthDate: '2008-12-01' }] })).annual).toBe(Math.round((221 + 119.3) * 12));
  });

  // Die Stufenbeträge gelten je Anspruchsjahr (KKVV wird jährlich angepasst). Ab dem 01.01.
  // des Folgejahres darf die App nicht still mit alten Stufen weiterrechnen — derselbe Riegel
  // wie in ZH. Das Berechnungsschema 2027 war am 20.09.2026 noch nicht publiziert.
  describe('Jahres-Riegel', () => {
    afterEach(() => { vi.useRealTimers(); });

    it('im Anspruchsjahr 2026 rechnet sie', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2026-12-31T12:00:00'));
      expect(calculateIPV(person({})).annual).toBe(2652);
    });

    it('ab 2027 keine Zahl mehr, bis die Werte nachgeführt sind', () => {
      vi.useFakeTimers(); vi.setSystemTime(new Date('2027-01-01T12:00:00'));
      expect(calculateIPV(person({}))).toMatchObject({ belegt: false, amount: null, offen: 'jahr' });
    });
  });

  it('Betrag sinkt nie mit steigendem Einkommen (Orientierungs-Fälle ausgenommen)', () => {
    for (const children of [[], [{ birthDate: '2015-01-01' }], [{ birthDate: '2015-01-01' }, { birthDate: '2018-01-01' }]]) {
      let vorher = Infinity;
      for (let m = 0; m <= 8000; m += 100) {
        const r = calculateIPV(person({ monthlyIncome: m, children }));
        if (r.belegt === false) continue;
        expect(r.annual ?? 0).toBeLessThanOrEqual(vorher);
        vorher = r.annual ?? 0;
      }
    }
  });

  it('negatives Einkommen sprengt die Obergrenze nicht', () => {
    const r = calculateIPV(person({ monthlyIncome: -1000 }));
    expect(r.annual).toBe(2652);
    expect(r.annual).toBeLessThanOrEqual(r.maxAnnual);
  });
});
