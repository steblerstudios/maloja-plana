// Prämienverbilligung (IPV) Kanton Waadt — «subside ordinaire» 2026 (K31, dritter Kanton).
// Nur VD rechnet hiermit; alle anderen Kantone bleiben in calculateIPV unverändert.
// Belege (abgerufen 16.09.2026, Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt VD):
//   [1] Arrêté concernant les subsides aux primes de l'assurance-maladie obligatoire en 2026,
//       Conseil d'État VD, 17.12.2025, in Kraft 01.01.2026 — art. 2 (Parameter je Kategorie),
//       art. 4 (Kinderabzug), art. 6 al. 3 (Steuerperiode), art. 7 (10-%-Schwelle),
//       art. 9 (subside spécifique), art. 13 (Referenzprämien).
//   [2] OVAM, «Notice explicative : Les subsides 2026», PDF vom 19.12.2025 — Ziff. 1 (Aufbau des
//       RDU, Vermögensfreibetrag, KK-Pauschale), Ziff. 2 (Prämienregionen), Ziff. 3 (Beispiel).
//   [3] LVLAMal (BLV 832.01) art. 11, 16 al. 1bis, 17.
//   [4] RLVLAMal (BLV 832.01.1) art. 21 — Eckpunkte in Worten (al. 1) und die Formeln (al. 2).
//
// 🛑 Die Formeln stehen im amtlichen Text als BILD und sind in der Recherche abgeschrieben.
// Nachgerechnet wurde deshalb, was ohne Bildlesen prüfbar ist (src/config/__tests__/ipvVaud.test.js):
//   · jeder Eckpunkt, den art. 21 al. 1 in Worten nennt (bei C das Maximum bzw. der genannte
//     Wert, bei A das Minimum bzw. der genannte Wert, über B null),
//   · die Stetigkeit an den Nahtstellen C und A (Formel 2 → 3, Formel 4 → 5),
//   · das amtliche Beispiel der Notice (Familie, 4 Personen, RDU 76'000 → 3'216/Jahr) — es geht
//     auf den Franken auf.
// NICHT geprüft und damit das verbleibende Risiko: die EXPONENTEN im Innern der Kurven
// (P1, R2, P2). Sie ändern die Eckpunkte nicht, und das amtliche Beispiel liegt bei beiden
// Erwachsenen auf dem Minimum — es berührt keine Kurve. Grössenordnung: in Kategorie a) läge
// der Monatsbetrag bei einem RD von 30'000 mit P1 = 2.3 statt 2.5 rund CHF 9 höher. Bei den
// Kindern sind P3/Q3 gegenstandslos, weil F3 = E3 = G3 = 114 ist (die Kurve ist flach).
import { getRegion } from '../data/praemienRegionen.js';

export const IPV_VD = {
  jahr: 2026,
  // Parameter des subside ordinaire, Monatsbeträge in CHF, Einkommensgrenzen in CHF/Jahr
  // (Revenu déterminant OVAM). Arrêté 2026 art. 2, Quelle [1].
  // Die Parameter sind NICHT nach Prämienregion abgestuft — anders als in ZH und BE hängt der
  // ordentliche Subside allein vom Einkommen und von der Kategorie ab. Die Region bestimmt in
  // VD nur die Referenzprämie (art. 13), die in den spezifischen Subside eingeht.
  kategorien: {
    // a) erwachsene Person ab 26, allein — art. 21 al. 1 let. a, Formel 1
    e: { max: 331, min: 30, C: 17000, A: 40000, B: 50000, P: 2.5 },
    // b) erwachsene Person ab 26 mit Kind(ern) — Formeln 2 (bis C) und 3 (C bis A).
    //    `maxBei0` = D2: der Betrag bei einem Einkommen von 0; `beiC` = F2.
    ef: { maxBei0: 336, beiC: 300, min: 20, C: 24200, A: 55000, B: 69000, R: 1, P: 2.3 },
    // c) Kind 0–18 — Formeln 4 (C bis A) und 5 (A bis B). F3 = E3 = G3 = 114: der Betrag ist
    //    bis zur Grenze B3 konstant. Die Formeln stehen trotzdem hier, damit ein späterer
    //    Wertsatz mit drei verschiedenen Beträgen ohne Umbau rechnet.
    k: { max: 114, beiA: 114, min: 114, C: 26000, A: 63000, B: 76000, P: 2.3, Q: 0.25 },
  },
  // Aufbau des Revenu déterminant — Notice Ziff. 1, Quelle [2], und Arrêté art. 4, Quelle [1].
  kkPauschale: { erwachsener: 2200, paar: 4400, proKind: 1300 },
  vermoegen: { freibetragAllein: 59000, freibetragPaar: 118000, anteil: 1 / 15 },
  kinderAbzug: { erstes: 6000, weitere: 7000 },
  // Subside spécifique: Schwelle «supérieur à 10%» des RDU (Arrêté art. 7 al. 1, Quelle [1]).
  tauxEffort: 0.1,
  // Referenzprämien Erwachsene je Monat und Prämienregion, nach RDU-Band. Arrêté art. 13,
  // Quelle [1]. al. 1 = ein Mitglied in der «unité économique de référence», al. 2 = mehrere.
  // Nur die Erwachsenen-Werte stehen hier: die App kennt allein die Prämie der erwachsenen
  // Person (siehe `spezifischerSubsideMoeglich`).
  referenzPraemie: {
    allein: [{ bis: 62500, r: { 1: 563, 2: 527 } }, { bis: 70000, r: { 1: 538, 2: 502 } }, { bis: Infinity, r: { 1: 488, 2: 452 } }],
    mehrere: [{ bis: 86300, r: { 1: 563, 2: 527 } }, { bis: 96600, r: { 1: 538, 2: 502 } }, { bis: Infinity, r: { 1: 488, 2: 452 } }],
  },
};

// Prämienregion einer Gemeinde. Massgebend ist die BAG-Zuteilung (KVG Art. 61 Abs. 2) —
// dieselbe Tabelle, die src/data/praemienRegionen.js trägt; VD hat dort genau zwei Regionen.
// Die Notice [2] beschreibt die Regionen nur mit Landschaftsnamen («Région 1 : Lausanne,
// l'Ouest lausannois, Nyon, La Côte, Lavaux, la Riviera»), nicht als Gemeindeliste — ein
// Abgleich Gemeinde für Gemeinde ist mit dieser Quelle nicht möglich. Geprüft ist darum, was
// prüfbar ist: dass VD in der BAG-Tabelle zwei Regionen hat und dass die in der Notice
// namentlich genannten Räume auf der richtigen Seite liegen (Guard-Test, 20 Stichproben).
export function vdRegion(bfsNr) {
  const r = getRegion(bfsNr);
  return r === 1 || r === 2 ? r : null;
}

// Ein Monatsbetrag des subside ordinaire, vor der Rundung. `kat` ist 'e' | 'ef' | 'k',
// `rd` das Revenu déterminant OVAM im Jahr. RLVLAMal art. 21, Quelle [4].
export function vdSubsideMonat(kat, rd) {
  const p = IPV_VD.kategorien[kat];
  const x = Math.max(0, rd);
  if (x > p.B) return 0;
  if (kat === 'ef') {
    // Formel 2: von D2 bei einem Einkommen von 0 hinunter auf F2 bei C2.
    if (x <= p.C) return p.beiC + (p.maxBei0 - p.beiC) * Math.pow((p.C - x) / p.C, p.R);
    // Formel 3: von F2 bei C2 hinunter auf E2 bei A2, danach bis B2 das Minimum.
    if (x <= p.A) return p.min + (p.beiC - p.min) * Math.pow(1 - Math.pow((x - p.C) / (p.A - p.C), 2), p.P);
    return p.min;
  }
  if (kat === 'k') {
    if (x <= p.C) return p.max;
    // Formel 4: von F3 bei C3 hinunter auf E3 bei A3.
    if (x <= p.A) return p.beiA + (p.max - p.beiA) * Math.pow(1 - Math.pow((x - p.C) / (p.A - p.C), 2), p.P);
    // Formel 5: von E3 bei A3 hinunter auf G3 bei B3.
    return p.min + (p.beiA - p.min) * Math.pow((p.B - x) / (p.B - p.A), p.Q);
  }
  // Kategorie a): Maximum bis C1, Formel 1 bis A1, danach bis B1 das Minimum.
  if (x <= p.C) return p.max;
  if (x <= p.A) return p.min + (p.max - p.min) * Math.pow(1 - Math.pow((x - p.C) / (p.A - p.C), 2), p.P);
  return p.min;
}

// Revenu déterminant nach Waadtländer Recht — Näherung aus den Angaben, die die App hat.
// 🛑 Das ist NICHT das Einkommen der App. Amtlich ist es das «revenu net» der letzten
// rechtskräftigen Veranlagung (Arrêté art. 6 al. 3: «entrée en force au 17 octobre 2025»),
// erhöht um Säule-3a-Einzahlungen, Einkäufe in die 2. Säule über 20'000, Liegenschafts-
// unterhalt über dem Pauschalabzug und die steuerlich abgezogenen KK-Prämien, vermindert um
// die KK-Pauschale, erhöht um 1/15 des Vermögens über dem Freibetrag (Notice Ziff. 1).
// Die App kennt davon: die laufenden Einkünfte (brutto, nicht «net»), die 3a-Einzahlung und
// die erfassten Vermögenswerte. Sie rechnet damit systematisch ZU HOCH — Berufsauslagen und
// Sozialabzüge fehlen, Schulden und der Freibetrag auf selbst bewohntem Wohneigentum
// (300'000) ebenso. Der angezeigte Subside ist deshalb eher zu tief als zu hoch; benannt wird
// das in der Anzeige (`ipv.naeherung` und `ipv.vorbehaltVD`), gerechnet wird es nicht.
export function vdRevenuDeterminant({ einkommen, vermoegen, kinderZahl, paar = false }) {
  const p = IPV_VD;
  const pauschale = (paar ? p.kkPauschale.paar : p.kkPauschale.erwachsener) + kinderZahl * p.kkPauschale.proKind;
  const freibetrag = paar ? p.vermoegen.freibetragPaar : p.vermoegen.freibetragAllein;
  const zuschlag = p.vermoegen.anteil * Math.max(0, Math.max(0, vermoegen) - freibetrag);
  // A: Revenu déterminant unifié (RDU) — Grundlage des spezifischen Subsides.
  const rdu = Math.max(0, Math.max(0, einkommen) - pauschale + zuschlag);
  // B: Revenu déterminant OVAM — Grundlage des ordentlichen Subsides (Arrêté art. 4:
  // «6'000 fr. pour le premier enfant et 7'000 fr. de plus par enfant supplémentaire»).
  const abzug = kinderZahl > 0 ? p.kinderAbzug.erstes + (kinderZahl - 1) * p.kinderAbzug.weitere : 0;
  return { rdu, revenuOvam: Math.max(0, rdu - abzug) };
}

// Reine Rechnung des subside ordinaire. `personen` sind die Kategorien ('e' = erwachsen allein,
// 'ef' = erwachsen mit Kind(ern), 'k' = Kind 0–18), `revenuOvam` das Revenu déterminant OVAM.
// Rundung: «le montant ainsi calculé est arrondi au franc supérieur» (RLVLAMal art. 21 al. 1) —
// je Person und Monat aufgerundet, dann auf zwölf Monate.
export function ipvVaudRechnen({ personen, revenuOvam }) {
  const monatlich = personen.map((c) => Math.ceil(vdSubsideMonat(c, revenuOvam)));
  const monat = monatlich.reduce((a, b) => a + b, 0);
  const erwachseneMonat = personen.reduce((s, c, i) => s + (c === 'k' ? 0 : monatlich[i]), 0);
  // Grenze des Haushalts: die höchste Grenze B der vertretenen Kategorien — dort verliert die
  // letzte Person ihren Anspruch. Vergleichsgrösse `maximal` ist der Betrag bei einem
  // Einkommen von 0 (Kategorie b) fängt dort bei D2 an, nicht bei F2).
  const grenze = Math.max(...personen.map((c) => IPV_VD.kategorien[c].B));
  const maximalMonat = personen.reduce((s, c) => s + Math.ceil(vdSubsideMonat(c, 0)), 0);
  const maximalErwachseneMonat = personen.reduce((s, c) => s + (c === 'k' ? 0 : Math.ceil(vdSubsideMonat(c, 0))), 0);
  return {
    monat, annual: monat * 12, maximal: maximalMonat * 12, grenze,
    erwachseneAnnual: erwachseneMonat * 12, erwachseneMaximal: maximalErwachseneMonat * 12,
  };
}

// Hinweis (kein Betrag) auf den «subside spécifique»: Arrêté art. 9 al. 1 gibt ihn, wenn die
// Prämien aller Personen der UER — höchstens bis zur Referenzprämie — abzüglich des
// ordentlichen Subsides mehr als 10 % des RDU ausmachen.
// 🛑 Bewusst NICHT gerechnet: dafür bräuchte es die Prämien aller Personen im Haushalt und
// den genauen RDU. Die App kennt nur die Prämie der erwachsenen Person und stellt ihr nur
// deren Anteil am ordentlichen Subside gegenüber. Jede weitere Person im Haushalt vergrössert
// die linke Seite (Kinder: Referenzprämie 161/152 gegen 114 Subside) — der Hinweis erscheint
// also eher zu selten als zu oft. Das ist die richtige Richtung: er verspricht nichts.
export function spezifischerSubsideMoeglich({ praemieMonat, region, rdu, mehrere, erwachseneAnnual }) {
  if (!(praemieMonat > 0) || !region) return false;
  const bänder = mehrere ? IPV_VD.referenzPraemie.mehrere : IPV_VD.referenzPraemie.allein;
  const referenz = (bänder.find((b) => rdu <= b.bis) || bänder[bänder.length - 1]).r[region];
  // LVLAMal art. 16 al. 1bis: subventioniert wird höchstens die fakturierte Prämie; art. 13
  // deckelt zusätzlich auf die Referenzprämie.
  const anrechenbar = Math.min(praemieMonat, referenz) * 12;
  return anrechenbar - erwachseneAnnual > IPV_VD.tauxEffort * rdu;
}

// Aufruf aus calculateIPV (config/cantonalData.js) für VD mit Beleg. Die App rechnet nur, wo
// ihre Angaben dafür reichen; sonst dieselbe Orientierung wie ein unbelegter Kanton, mit Grund
// in `offen`. Bewusst NICHT gerechnet — für diese Fälle steht in der App keine Zahl:
//   · Paare und Haushalte mit mehreren Erwachsenen (Kategorie h) «26+ Paar ohne Kind»; Alter
//     und Einkünfte der zweiten Person fehlen, Konkubinat ebenso),
//   · junge Erwachsene 19–25 in allen vier Kategorien (d–g) — sie hängen am Ausbildungsstatus
//     und an der Frage, ob die Person wirtschaftlich unabhängig ist; beides erfasst die App nicht,
//   · Sonderkategorien (RI-Beziehende nach art. 18a LVLAMal, PC-AVS/AI),
//   · der subside spécifique als Betrag (siehe `spezifischerSubsideMoeglich`),
//   · Anspruchsjahr vorbei, Gemeinde nicht eindeutig, Alter nicht erfasst.
export function ipvVaud(data, hh, ipvData, youngAdultsCount, orientierung, lookupPLZ) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_VD.jahr;
  // Die App rechnet nur für das Jahr, dessen Werte belegt sind. Der Arrêté wird jährlich neu
  // erlassen (der für 2026 ersetzte den vom 01.10.2025 und änderte den Kinderbetrag von 74 auf
  // 114) — ab dem 01.01. des Folgejahres lieber keine Zahl als eine aus alten Parametern.
  if (new Date().getFullYear() > jahr) return orientierung('jahr');
  // Paare: der Arrêté kennt für sie eine eigene Kategorie (h), die App die zweite Person nicht.
  // Konkubinat gehört dazu — die UER nach LHPS zählt zusammenlebende Personen zusammen.
  if (hh.adults !== 1 || b.maritalStatus === 'married' || b.maritalStatus === 'cohabiting') return orientierung('haushalt');

  // Der Arrêté nennt keinen Stichtag für das Alter. Darum rechnet die App nur, wenn die
  // Alterszeile das ganze Jahr über dieselbe ist: massgebend ist das Mindestalter im
  // Anspruchsjahr — wer im Anspruchsjahr erst 26 wird, war davor in Kategorie d) oder f) und
  // fällt heraus. Gleiches Vorgehen wie in BE.
  const geburt = /^\d{4}-/.test(b.dateOfBirth || '') ? Number(b.dateOfBirth.slice(0, 4)) : null;
  if (!geburt || jahr - geburt - 1 < 26) return orientierung('alter');
  // Kind ohne Geburtsdatum: `age` ist in der App mit 0 vorbelegt (ChapterView legt neue Kinder
  // so an, dataMigration setzt es bei Alt-Daten ebenso). Eine 0 heisst «nicht erfasst», nicht
  // «Säugling» — und ein nicht erfasstes Alter erhöht sonst still den Betrag um 114/Monat.
  const kinderAlter = hh.children.map((c) => (/^\d{4}-/.test(c.birthDate || '')
    ? jahr - Number(c.birthDate.slice(0, 4))
    // Beim eingetippten Alter kommt ein Jahr dazu: es ist nicht datiert, die Person kann im
    // Anspruchsjahr Geburtstag haben. So rutscht keine 19-jährige Person in die Kinderkategorie.
    : (Number(c.age) > 0 ? Number(c.age) + 1 : null)));
  if (kinderAlter.some((a) => a === null)) return orientierung('alter');
  if (kinderAlter.some((a) => a > 18)) return orientierung('haushalt');

  const plz = String(data.wohnen?.postalCode || '').trim();
  const orte = plz ? lookupPLZ(plz).filter((g) => g.kanton === 'VD') : [];
  const stadt = String(data.wohnen?.city || '').trim().toLowerCase();
  const ort = orte.length === 1 ? orte[0] : orte.find((g) => g.gemeinde.toLowerCase() === stadt);
  const regionen = new Set(orte.map((g) => vdRegion(g.bfsNr)));
  const region = ort ? vdRegion(ort.bfsNr) : regionen.size === 1 ? [...regionen][0] : null;
  // Der ordentliche Subside hängt in VD NICHT an der Region — der Hinweis auf den spezifischen
  // Subside und die Anzeige «Prämienregion {region}» hängen daran schon. Ohne eindeutige
  // Gemeinde stünde eine Zahl ohne ihren Rahmen da; dann lieber dieselbe Orientierung wie in
  // ZH und BE.
  if (!region) return orientierung('region');

  const kinderZahl = kinderAlter.length;
  const vermoegen = Number(f.securitiesValue || 0) + Number(f.otherAssets || 0) + Number(f.savingsAccount || 0);
  const einkommen = ['monthlyIncome', 'sideIncome', 'ahvRente', 'ivRente', 'bvgRente']
    .reduce((s, k) => s + Number(f[k] || 0), 0) * 12 + Number(f.pension3a || 0);
  const { rdu, revenuOvam } = vdRevenuDeterminant({ einkommen, vermoegen, kinderZahl });

  // Kategorie der erwachsenen Person: mit Kind(ern) b), sonst a).
  const eigene = kinderZahl > 0 ? 'ef' : 'e';
  const r = ipvVaudRechnen({ personen: [eigene, ...kinderAlter.map(() => 'k')], revenuOvam });
  const cantonData = { ...ipvData, maxIncome: r.grenze };
  // LVLAMal art. 16 al. 1bis: «Les primes … sont subsidiables jusqu'à concurrence de la prime
  // facturée par l'assureur.» Der Deckel gilt pro Person; die App kennt nur die Prämie der
  // erwachsenen Person, also wird auch nur deren Anteil gedeckelt (wie in BE).
  // ⚠️ Offen aus der Recherche: die BLV setzt diese Bestimmung erst auf den 01.03.2026 in
  // Kraft, die Notice nennt den 01.01.2026. Der Deckel senkt den Betrag — ihn anzuwenden ist
  // die vorsichtige Lesart, und er greift ohnehin nur, wenn die Prämie tiefer ist als der Subside.
  const praemieMonat = Number(data.versicherungen?.kkPremium) || 0;
  const praemie = praemieMonat * 12;
  // Ohne erfasste Prämie greift dieser Deckel nicht, und eine Zahl ohne ihn wäre die
  // Obergrenze, nicht der Anspruch. Derselbe Befund der Fachprüfung vom 20.09.2026, der in
  // ZH, BE und AG schon behoben ist — in VD gefunden, als `main` in den Zweig nachgezogen
  // wurde. Darum Orientierung, bis die Prämie dasteht.
  if (!(praemie > 0)) return orientierung('praemie');
  const deckeln = (gesamt, erwachsenenTeil) =>
    Math.round(Math.min(erwachsenenTeil, praemie) + (gesamt - erwachsenenTeil));
  const annual = deckeln(r.annual, r.erwachseneAnnual);
  const maxAnnual = deckeln(r.maximal, r.erwachseneMaximal);
  const spezifisch = spezifischerSubsideMoeglich({
    praemieMonat, region, rdu, mehrere: kinderZahl > 0,
    erwachseneAnnual: Math.min(r.erwachseneAnnual, praemie),
  });
  const gemeinsam = {
    canton: 'VD', cantonData, region, jahr, vorbehaltKey: 'ipv.vorbehaltVD',
    // Nur setzen, wenn zutreffend — sonst stünde der Hinweis bei jedem VD-Haushalt.
    ...(spezifisch && { zusatzHinweisKey: 'ipv.vdSpezifischerSubside' }),
  };
  if (annual <= 0) {
    // Über der Grenze des ordentlichen Subsides kann der spezifische trotzdem bestehen — er hat
    // seine eigene Schwelle (10 % des RDU) und keine Einkommensgrenze. Darum bleibt der Hinweis
    // auch hier stehen.
    return { belegt: true, eligible: false, amount: 0, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: r.grenze }, ...gemeinsam };
  }
  return {
    eligible: true, belegt: true, anspruchMoeglich: true,
    amount: Math.round(annual / 12), annual, maxAnnual,
    reductionPercent: Math.round((annual / maxAnnual) * 100),
    noteKey: ipvData.noteKey, noteParams: ipvData.noteParams || {},
    youngAdultsCount, ...gemeinsam,
  };
}
