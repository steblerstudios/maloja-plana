// Prämienverbilligung (IPV) Kanton Waadt — «subside ordinaire» 2026 (K31).
// Auf dem gemeinsamen Rahmen (config/kantonsModell.js). Gebaut am 20.09.2026 auf einem eigenen
// Zweig (`feat/k31-ipv-vd`, nie gemergt), am 28.09.2026 auf den Rahmen portiert und dabei
// JEDE Zahl an der Quelle neu gelesen.
//
// Belege (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt VD:
//   [1] Arrêté concernant les subsides aux primes de l'assurance-maladie obligatoire en 2026,
//       Conseil d'État VD, du 17 décembre 2025, in Kraft 01.01.2026 (PDF vd.ch, «Document généré
//       le 18.12.2025»; ersetzt den Arrêté vom 1. Oktober 2025, art. 16).
//       art. 2 (Parameter je Kategorie) · art. 4 al. 1 (Kinderabzug) · art. 6 al. 3 (Steuer-
//       periode) · art. 7 al. 1 (10-%-Schwelle) · art. 8/9 (subside spécifique) · art. 13
//       (Referenzprämien).
//   [2] OVAM, «Notice explicative : Les subsides 2026», «Selon l'arrêté du Conseil d'Etat du
//       17.12.2025», PDF erstellt 19.12.2025 — Ziff. 1 (Aufbau des RDU, KK-Pauschale,
//       Vermögensfreibetrag, Kinderabzug), Ziff. 2 (Tabelle, Prämienregionen), Ziff. 3
//       (Rechenbeispiel), Ziff. 4 (Beginn des Anspruchs, Meldepflicht).
//   [3] LVLAMal (BLV 832.01), Fassung in Kraft seit 01.03.2026 — art. 11 (revenu déterminant
//       nach LHPS, Kinderabzug «jusqu'à la fin de l'année des 18 ans»), art. 16 al. 1bis
//       (höchstens die fakturierte Prämie, seit 01.03.2026), art. 17 (Formel), art. 17a
//       (subside spécifique). Gegengeprüft über Lexfind: aktuelle Fassung 01.03.2026.
//   [4] RLVLAMal (BLV 832.01.1), Fassung «au 01.11.2025» — art. 21 al. 1 (Eckpunkte in Worten,
//       «arrondi au franc supérieur»), art. 21 al. 2 (Formeln — nur als BILD, siehe unten),
//       art. 22 al. 1 («Le montant du subside ne peut être supérieur à la prime exigée par
//       l'assureur», unverändert seit Erlass).
//   [5] LHPS (BLV 850.03), aktuelle Fassung laut Lexfind (in Kraft seit 01.09.2023) — art. 6
//       al. 2 lit. a: revenu net «majoré des montants affectés aux formes reconnues de
//       prévoyance individuelle liée (3e pilier A)»; lit. b: «un quinzième» des Nettovermögens.
//       RLHPS (BLV 850.03.1, Fassung 01.07.2025) art. 4 al. 1: Vermögensfreibeträge.
//
// 🛑 DIE FORMELN STEHEN IM AMTLICHEN TEXT NUR ALS BILD ([4] art. 21 al. 2). Am 28.09.2026 am
// Formelbild gelesen (PNG aus der BLV-Seite, 423 × 796 px): Formeln 1–5 stimmen mit
// `vdSubsideMonat` überein, die Exponenten stehen je AUSSERHALB der geschweiften Klammer
// ({1 − ((RD − C)/(A − C))²}^P). Die PARAMETER (auch P1 = 2.5 usw.) stehen maschinenlesbar im
// Arrêté [1]. Geprüft wird in den Tests, was ohne Bildlesen prüfbar ist:
//   · jeder Eckpunkt, den art. 21 al. 1 in Worten nennt,
//   · die Stetigkeit an den Nahtstellen C und A,
//   · die Tabelle der Notice [2] Ziff. 2 («331.- à 30.-», «336.- à 300.-», «300.- à 20.-»),
//   · das amtliche Beispiel der Notice (Familie, 4 Personen, RDU 76'000 → 3'216/Jahr).
// VERBLEIBENDES RISIKO: kein amtliches Beispiel liegt IM INNERN einer Kurve (das Beispiel
// liegt bei den Erwachsenen auf dem Minimum, die Kinderkurve ist flach). Eine falsch gelesene
// Klammer im Bild würde nur den Verlauf zwischen C und A verschieben — Grössenordnung in
// Kategorie a) bei RD 30'000: mit P1 = 2.3 statt 2.5 rund CHF 9 im Monat. Die Frage nach einem
// zweiten Beispiel steht in docs/sources/FRAGEN-AN-DIE-AEMTER.md (Frage 3).
//
// DAS MODELL IN EINEM SATZ
// Jede Person erhält einen Monatsbetrag nach ihrer Kategorie (26+ allein, 26+ mit Kind, Kind),
// der bis zu einem ersten Einkommen fest ist, dann auf einer Kurve bis zu einem Minimum sinkt
// und über einer Grenze wegfällt — je Person und Monat auf den Franken AUFGERUNDET.
//
// WAS DIE WAADT VON DEN BISHERIGEN KANTONEN UNTERSCHEIDET
// 1. KEINE PRÄMIENREGION IM BETRAG. Die Parameter des subside ordinaire sind kantonsweit gleich
//    ([1] art. 2 kennt keine Region; die Notice [2] Ziff. 2 schreibt in der Regionsspalte «1 et
//    2»). Die Region zählt nur für die Referenzprämie des subside spécifique ([1] art. 13).
// 2. EIN MINDESTBETRAG, DER AUSBEZAHLT WIRD, statt einer Auszahlungsschwelle: zwischen A und B
//    gilt das Minimum E (26+ allein: 30.– im Monat). Es gibt darum nur EINEN Grund für «kein
//    Betrag» — über der Grenze B —, nicht zwei wie in LU und SG.
// 3. ZWEI EINKOMMEN. Der «revenu déterminant unifié» (RDU) nach LHPS, und davon abgeleitet der
//    «revenu déterminant OVAM» (RDU minus Kinderabzug), der allein den subside ordinaire
//    bestimmt ([2] Ziff. 1, Buchstaben A und B).
// 4. EIN ZWEITES INSTRUMENT, der subside spécifique ([1] art. 7–10, [3] art. 17a): wer nach dem
//    ordentlichen Subside noch mehr als 10 % des RDU für Prämien ausgibt, erhält die Differenz.
//    Die App rechnet ihn NICHT (dafür fehlen die Prämien aller Personen im Haushalt); sie zeigt
//    nur einen Hinweis, wo er für die erwachsene Person allein schon in Frage kommt.
//
// BEWUSST NICHT GEBAUT
//   · Paare und mehrere Erwachsene — Kategorie h) «couples sans enfant» und die UER nach LHPS
//     brauchen das Einkommen der zweiten Person, das die App nicht kennt (Konkubinat ebenso).
//   · junge Erwachsene 19–25 (Kategorien d–g): hängen an Ausbildung und wirtschaftlicher
//     Unabhängigkeit von den Eltern — beides erfasst die App nicht.
//   · Sonderkategorien: RI-Beziehende und weitere nach LVLAMal art. 18/18a ([1] art. 3),
//     PC-AVS/AI-Beziehende (volle Referenzprämie), Quellenbesteuerte (LHPS art. 6 al. 5).
//   · der subside spécifique als Betrag (siehe oben).
//   · vom RDU ([2] Ziff. 1, [5]): Einkäufe in die 2. Säule über 20'000, Liegenschaftsunterhalt
//     über dem Pauschalabzug, Wohneigentum über der Franchise 300'000, Geschäftsvermögen über
//     100'000, die Berufsauslagen und übrigen Abzüge des «revenu net» — die App kennt diese
//     Posten nicht. Die fehlenden Abzüge HEBEN das Einkommen (Betrag eher zu tief), die
//     fehlenden Zuschläge senken es.
//   · die Prämie «après déduction de la redistribution des taxes CO2» ([2], erster Punkt): die
//     App nimmt die erfasste Prämie.
//   · der Beginn «le premier jour du deuxième mois qui suit le dépôt de la demande» ([2] Ziff.
//     4): der Betrag hier ist der Jahresanspruch; der Vorbehalt sagt es dazu.
import { getRegion } from '../data/praemienRegionen.js';
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, regionAusPLZ, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';

export const IPV_VD = {
  jahr: 2026,
  // Parameter des subside ordinaire, [1] art. 2. Beträge in CHF pro MONAT, Einkommensgrenzen in
  // CHF pro Jahr (revenu déterminant OVAM).
  kategorien: {
    // a) «adultes âgés de 26 ans et plus vivant seuls» — E1 30 · F1 331 · C1 17'000 ·
    //    A1 40'000 · P1 2.5 · B1 50'000.
    e: { max: 331, min: 30, C: 17000, A: 40000, B: 50000, P: 2.5 },
    // b) «adultes âgés de 26 ans et plus vivant en famille avec enfant à charge ou vivant seuls
    //    avec enfant à charge» — E2 20 · F2 300 (bei C2) · D2 336 · C2 24'200 · A2 55'000 ·
    //    R2 1 · P2 2.3 · B2 69'000. `maxBei0` = D2, `beiC` = F2.
    ef: { maxBei0: 336, beiC: 300, min: 20, C: 24200, A: 55000, B: 69000, R: 1, P: 2.3 },
    // c) «enfants (0 à 18 ans)» — E3 114 (bei A3) · F3 114 · C3 26'000 · A3 63'000 · P3 2.3 ·
    //    G3 114 · B3 76'000 · Q3 0.25. F3 = E3 = G3: die Kurve ist 2026 flach.
    k: { max: 114, beiA: 114, min: 114, C: 26000, A: 63000, B: 76000, P: 2.3, Q: 0.25 },
  },
  // [2] Ziff. 1 ⑥: «déduction forfaitaire pour les primes d'assurance-maladie selon la LHPS —
  // pour un ménage composé d'un adulte : 2'200 fr. … deux adultes : 4'400 fr. … pour chaque
  // enfant mineur ou majeur financièrement dépendant, ajout d'une déduction de : 1'300 fr.»
  kkPauschale: { erwachsener: 2200, paar: 4400, proKind: 1300 },
  // [2] Ziff. 1 ⑨: «majoration de 1/15 (= 6.7 %) de la fortune qui excède 59'000 fr. pour une
  // personne seule ou une famille monoparentale, 118'000 fr. pour un couple». Der Fünfzehntel
  // steht auch in [5] art. 6 al. 2 lit. b, die Freibeträge verweist RLHPS art. 4 al. 1 auf das
  // Steuergesetz — ihre Frankenwerte stehen nur in der Notice.
  vermoegen: { freibetragAllein: 59000, freibetragPaar: 118000, anteil: 1 / 15 },
  // [1] art. 4 al. 1: «6'000 fr. pour le premier enfant et 7'000 fr. de plus par enfant
  // supplémentaire».
  kinderAbzug: { erstes: 6000, weitere: 7000 },
  // [1] art. 7 al. 1: taux d'effort «supérieur à 10%».
  tauxEffort: 0.1,
  // [1] art. 13, Referenzprämien Erwachsene je Monat und Region, nach RDU-Band. al. 1 = UER aus
  // einer Person, al. 2 = aus mehreren. Nur die Erwachsenen-Werte: die App kennt allein die
  // Prämie der erwachsenen Person.
  referenzPraemie: {
    allein: [{ bis: 62500, r: { 1: 563, 2: 527 } }, { bis: 70000, r: { 1: 538, 2: 502 } }, { bis: Infinity, r: { 1: 488, 2: 452 } }],
    mehrere: [{ bis: 86300, r: { 1: 563, 2: 527 } }, { bis: 96600, r: { 1: 538, 2: 502 } }, { bis: Infinity, r: { 1: 488, 2: 452 } }],
  },
};

// Prämienregion einer Gemeinde. Massgebend ist die BAG-Zuteilung (KVG Art. 61 Abs. 2); VD hat
// dort genau zwei Regionen. Die Notice [2] beschreibt sie nur mit Landschaftsnamen («Région 1 :
// Lausanne, l'Ouest lausannois, Nyon, La Côte, Lavaux, la Riviera»), nicht als Gemeindeliste —
// ein Abgleich Gemeinde für Gemeinde wie in LU ist mit dieser Quelle nicht möglich. Geprüft
// ist, was prüfbar ist (Test): zwei Regionen, und die genannten Räume liegen auf der richtigen
// Seite.
export function vdRegion(bfsNr) {
  const r = getRegion(bfsNr);
  return r === 1 || r === 2 ? r : null;
}

// Ein Monatsbetrag des subside ordinaire, vor der Rundung. `kat` ist 'e' | 'ef' | 'k', `rd` der
// revenu déterminant OVAM im Jahr. [4] art. 21 al. 1 (Bereiche) und al. 2 (Formeln 1–5).
export function vdSubsideMonat(kat, rd) {
  const p = IPV_VD.kategorien[kat];
  const x = Math.max(0, rd);
  if (x > p.B) return 0;
  if (kat === 'ef') {
    // Formel 2: Subside = F2 + ([D2 − F2] × {(C2 − RD)/C2}^R2) — von D2 bei 0 bis F2 bei C2.
    if (x <= p.C) return p.beiC + (p.maxBei0 - p.beiC) * Math.pow((p.C - x) / p.C, p.R);
    // Formel 3: Subside = E2 + ([F2 − E2] × {1 − ((RD − C2)/(A2 − C2))²}^P2).
    if (x <= p.A) return p.min + (p.beiC - p.min) * Math.pow(1 - Math.pow((x - p.C) / (p.A - p.C), 2), p.P);
    return p.min;
  }
  if (kat === 'k') {
    if (x <= p.C) return p.max;
    // Formel 4: Subside = E3 + ([F3 − E3] × {1 − ((RD − C3)/(A3 − C3))²}^P3).
    if (x <= p.A) return p.beiA + (p.max - p.beiA) * Math.pow(1 - Math.pow((x - p.C) / (p.A - p.C), 2), p.P);
    // Formel 5: Subside = G3 + ([E3 − G3] × {(B3 − RD)/(B3 − A3)}^Q3).
    return p.min + (p.beiA - p.min) * Math.pow((p.B - x) / (p.B - p.A), p.Q);
  }
  // Kategorie a): F1 bis C1, Formel 1 bis A1, danach bis B1 das Minimum E1.
  // Formel 1: Subside = E1 + ([F1 − E1] × {1 − ((RD − C1)/(A1 − C1))²}^P1).
  if (x <= p.C) return p.max;
  if (x <= p.A) return p.min + (p.max - p.min) * Math.pow(1 - Math.pow((x - p.C) / (p.A - p.C), 2), p.P);
  return p.min;
}

// RDU und revenu déterminant OVAM aus einem Jahreseinkommen — Aufbau nach [2] Ziff. 1:
// A = revenu net + Zuschläge − KK-Pauschale + 1/15 des Vermögens über dem Freibetrag;
// B = A − Kinderabzug ([1] art. 4 al. 1).
// `einkommen` kommt aus `einkommenJahr(f, SAEULE_3A.voll)`: die 3a-Einzahlung zählt nach [5]
// art. 6 al. 2 lit. a unbedingt dazu und steckt im Nettoeinkommen der App schon drin — sie wird
// hier NICHT noch einmal addiert (das tat der Zweig vom 20.09.2026 noch; derselbe Befund wie
// in ZH/BE/AG/SG, siehe den Block bei `einkommenJahr`).
export function vdRevenuDeterminant({ einkommen, vermoegen, kinderZahl, paar = false }) {
  const p = IPV_VD;
  const pauschale = (paar ? p.kkPauschale.paar : p.kkPauschale.erwachsener) + kinderZahl * p.kkPauschale.proKind;
  const freibetrag = paar ? p.vermoegen.freibetragPaar : p.vermoegen.freibetragAllein;
  // [2] ⑨: «Le résultat ne peut pas être inférieur à 0 fr.»
  const zuschlag = p.vermoegen.anteil * Math.max(0, Math.max(0, vermoegen) - freibetrag);
  const rdu = Math.max(0, Math.max(0, einkommen) - pauschale + zuschlag);
  const abzug = kinderZahl > 0 ? p.kinderAbzug.erstes + (kinderZahl - 1) * p.kinderAbzug.weitere : 0;
  return { rdu, revenuOvam: Math.max(0, rdu - abzug) };
}

// Reine Rechnung des subside ordinaire. `personen` sind die Kategorien ('e' | 'ef' | 'k'),
// `revenuOvam` der revenu déterminant OVAM. Rundung [4] art. 21 al. 1: «le montant ainsi calculé
// est arrondi au franc supérieur» — je Person und Monat, dann auf zwölf Monate.
export function ipvVaudRechnen({ personen, revenuOvam }) {
  const monatlich = personen.map((c) => Math.ceil(vdSubsideMonat(c, revenuOvam)));
  const monat = monatlich.reduce((a, b) => a + b, 0);
  const erwachseneMonat = personen.reduce((s, c, i) => s + (c === 'k' ? 0 : monatlich[i]), 0);
  // Grenze des Haushalts: die höchste Grenze B der vertretenen Kategorien — dort verliert die
  // letzte Person ihren Anspruch. Jede davon steht als Zahl in [1] art. 2 (B1, B2, B3).
  const grenze = Math.max(...personen.map((c) => IPV_VD.kategorien[c].B));
  // Vergleichsgrösse «höchstens möglich»: der Betrag bei revenu déterminant 0 (Kategorie b)
  // beginnt dort bei D2 = 336, nicht bei F2).
  const maximalMonat = personen.reduce((s, c) => s + Math.ceil(vdSubsideMonat(c, 0)), 0);
  const maximalErwachseneMonat = personen.reduce((s, c) => s + (c === 'k' ? 0 : Math.ceil(vdSubsideMonat(c, 0))), 0);
  return {
    monat, annual: monat * 12, maximal: maximalMonat * 12, grenze,
    erwachseneAnnual: erwachseneMonat * 12, erwachseneMaximal: maximalErwachseneMonat * 12,
  };
}

// Hinweis (nie ein Betrag) auf den subside spécifique: [1] art. 7 al. 1 / art. 9 al. 1 geben
// ihn, wenn die Prämien der UER — je höchstens bis zur Referenzprämie (art. 7 al. 3, art. 13) —
// nach Abzug des ordentlichen Subsides mehr als 10 % des RDU ausmachen.
// Die App stellt nur die Prämie der erwachsenen Person ihrem eigenen Anteil gegenüber. Jede
// weitere Person im Haushalt vergrössert die linke Seite (Kinder: Referenzprämie 161/152 gegen
// 114 Subside) — der Hinweis erscheint also eher zu selten als zu oft. Er verspricht nichts.
export function spezifischerSubsideMoeglich({ praemieMonat, region, rdu, mehrere, erwachseneAnnual }) {
  if (!(praemieMonat > 0) || !region) return false;
  const baender = mehrere ? IPV_VD.referenzPraemie.mehrere : IPV_VD.referenzPraemie.allein;
  const referenz = (baender.find((b) => rdu <= b.bis) || baender[baender.length - 1]).r[region];
  const anrechenbar = Math.min(praemieMonat, referenz) * 12;
  return anrechenbar - erwachseneAnnual > IPV_VD.tauxEffort * rdu;
}

// Aufruf aus calculateIPV (config/cantonalData.js, Register IPV_MODULE). Die App rechnet nur, wo
// ihre Angaben dafür reichen; sonst eine Orientierung mit Grund in `offen`.
export function ipvVaud(data, hh, ipvData, youngAdultsCount, orientierung, lookupPLZ) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_VD.jahr;
  // Der Arrêté wird jährlich neu erlassen (der für 2026 änderte den Kinderbetrag gegenüber dem
  // Arrêté vom 1. Oktober 2025). Werte 2027 waren am 28.09.2026 auf vd.ch nicht publiziert.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  // Paare: eigene Kategorie h), die App kennt die zweite Person nicht. Konkubinat gehört dazu —
  // die UER nach LHPS zählt zusammenlebende Personen zusammen.
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // [1] art. 2 und [4] art. 21 nennen «26 ans et plus», aber keinen Stichtag. Darum rechnet die
  // App nur, wenn die Alterszeile das ganze Jahr dieselbe ist — GEWÄHLT, nicht belegt
  // (ERWACHSEN.mangelsStichtag, wie BE und SG).
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.mangelsStichtag(jahr, geburt)) return orientierung('alter');
  // Kinder «0 à 18 ans»; den Kinderabzug gibt es nach [3] art. 11 al. 2 «jusqu'à la fin de
  // l'année des 18 ans». Also das Alter IM Anspruchsjahr; beim eingetippten Alter ein Jahr
  // dazu (vorsichtig an der 18, wie BE und LU). Kind ohne Alter ⇒ keine Zahl.
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  // Junge Erwachsene sind bewusst nicht gebaut (siehe Kopf).
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');

  // Der ordentliche Subside hängt NICHT an der Region — der Hinweis auf den spezifischen und die
  // Anzeige «Prämienregion {region}» schon. Ohne eindeutige Gemeinde stünde eine Zahl ohne
  // ihren Rahmen da; dann dieselbe Orientierung wie in ZH, BE und LU.
  const { region } = regionAusPLZ({ data, kanton: 'VD', lookupPLZ, regionFn: vdRegion });
  if (!region) return orientierung('region');

  // Ein negatives Einkommen ist ein Vertipper — `vdRevenuDeterminant` klemmte es auf 0, und die
  // App zeigte den HÖCHSTEN Betrag (Befund aus BE, Fachprüfung 23.09.2026; hier gleich mitgebaut).
  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');

  const kinderZahl = kinderJahre.length;
  // Keine Vermögensgrenze in VD — das Vermögen geht nur über den Fünfzehntel ein ([5]).
  const vermoegen = vermoegenSumme(f);
  const { rdu, revenuOvam } = vdRevenuDeterminant({
    einkommen: einkommenJahr(f, SAEULE_3A.voll), vermoegen, kinderZahl,
  });

  // Kategorie der erwachsenen Person: mit Kind(ern) b), sonst a).
  const r = ipvVaudRechnen({ personen: [kinderZahl > 0 ? 'ef' : 'e', ...kinderJahre.map(() => 'k')], revenuOvam });

  // [4] art. 22 al. 1: «Le montant du subside ne peut être supérieur à la prime exigée par
  // l'assureur.» — seit Erlass unverändert in Kraft; dazu seit 01.03.2026 [3] art. 16 al. 1bis.
  // ⟨28.09.2026: die Recherche vom 16.09. fand nur art. 16 al. 1bis und notierte darum einen
  // Widerspruch der Daten (BLV 01.03. gegen Notice 01.01.). art. 22 RLVLAMal löst ihn: der
  // Deckel gilt das ganze Jahr.⟩ Die App kennt nur die Prämie der erwachsenen Person, also
  // wird nur deren Anteil gedeckelt (`deckelnProPerson`).
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');
  const annual = deckelnProPerson(r.annual, r.erwachseneAnnual, praemie);
  const maxAnnual = deckelnProPerson(r.maximal, r.erwachseneMaximal, praemie);

  const spezifisch = spezifischerSubsideMoeglich({
    praemieMonat: praemie / 12, region, rdu, mehrere: kinderZahl > 0,
    erwachseneAnnual: Math.min(r.erwachseneAnnual, praemie),
  });
  // Die Grenze B der Kategorie steht in [1] art. 2 als Zahl — sie darf angezeigt werden.
  const cantonData = { ...ipvData, maxIncome: r.grenze };
  const gemeinsam = {
    canton: 'VD', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltVD',
    // Nur setzen, wenn zutreffend — sonst stünde der Hinweis bei jedem VD-Haushalt. Er läuft
    // über `zusatzVorbehaltKey`, die Stelle, an der die Anzeige einen zweiten, nur für diese
    // Person geltenden Satz zeigt (PremiumSubsidy.jsx) — ohne Betrag.
    extra: { region, ...(spezifisch ? { zusatzVorbehaltKey: 'ipv.vdSpezifischerSubside' } : {}) },
  };
  if (annual <= 0) {
    // Über der Grenze des ordentlichen Subsides kann der spezifische trotzdem bestehen — er hat
    // seine eigene Schwelle und keine Einkommensgrenze. Darum bleibt der Hinweis auch hier.
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.vdKeinAnspruch', noteParams: { value: r.grenze } });
  }
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    noteKey: ipvData.noteKey, noteParams: ipvData.noteParams || {},
  });
}
