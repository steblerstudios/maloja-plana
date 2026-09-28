// Prämienverbilligung (IPV) Kanton Genf — amtlicher Gruppen-Tarif, Jahr 2026 (K31).
// Auf dem gemeinsamen Rahmen (config/kantonsModell.js), Muster: ipvBern.js (Stufentabelle).
//
// Belege (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt GE:
//   [1] «BAREME SUBSIDES 2026» (PDF, eine Seite), Dokumentseite «Barèmes et catégories 2026
//       pour les subsides d'assurance-maladie», République et canton de Genève, Date de
//       publication 21 avril 2026 (PDF erstellt 11.02.2026).
//       https://www.ge.ch/document/43271/telecharger — Gegenprobe /document/99999999 → 404.
//       Monatsbeträge je Gruppe (Erwachsene, junge Erwachsene, Kinder), RDU-Grenzen je
//       Haushalt, «majoration de CHF 6'000.- par charge», junge Erwachsene = Jahrgänge 2001–2007.
//   [2] LaLAMal, rsGE J 3 05, «Dernières modifications au 2 novembre 2024» (silgeneve.ch).
//       Art. 20 Abs. 2/3: Vermutung «nicht bescheiden» (grosses Vermögen/Einkommen, sehr tiefes
//       RDU, junge Erwachsene) · Art. 21 Abs. 1–8: Gruppengrenzen, +6'000 je «charge légale»,
//       «Une personne assumant une charge légale est assimilée à un couple», Gruppe 9 ·
//       Art. 22 Abs. 1–4: Beträge (Gesetzesstand 2024, indexiert) und
//       Abs. 4 «Le montant des subsides accordés ne peut dépasser le montant de la prime
//       effective de l'assuré.» · Art. 23 Abs. 1/2: Liste aus der letzten Veranlagung,
//       Anspruch für das kommende Kalenderjahr.
//   [3] RaLAMal, rsGE J 3 05.01, «Dernières modifications au 1er janvier 2025».
//       Art. 9: RDU der Ehegatten / eingetragenen Paare / Konkubinatspaare MIT gemeinsamem
//       Kind werden addiert · Art. 9A: negatives RDU gilt als 0 · Art. 9B: Indexierung ·
//       Art. 10 Abs. 1–2: 250'000 Bruttovermögen / 200'000 Bruttoeinkommen · Abs. 4–6:
//       RDU unter 15'000 (allein) / 20'000 (Paar), +3'000 je charge légale → Gesuch mit
//       Nachweisen · Abs. 7/8: junge Erwachsene · Art. 10A: Gesuch vor dem 30. November
//       des Anspruchsjahres.
//   [4] LRDU, rsGE J 4 06, «Dernières modifications au 1er janvier 2025».
//       Art. 4/5: Einkünfte und Abzüge · Art. 6/7: Vermögen minus Schulden · Art. 8 Abs. 2:
//       RDU = Einkommen + «un quinzième de la fortune» · Art. 9 Abs. 1: «calculé
//       automatiquement sur la base de la dernière taxation fiscale définitive».
//   [5] Conseil d'État, Communiqué hebdomadaire du 5 novembre 2025, «Indexation des subsides
//       d'assurance-maladie pour 2026»: Erwachsene +8,7 % (320 → 348 … 50 → 55), Gruppe 9
//       junge Erwachsene 100 → 106, Gruppe 9 Kinder 60 → 67. Bestätigt die Beträge aus [1].
//   [6] ge.ch, «Demander un subside d'assurance-maladie 2026» (Dernière mise à jour 9 juillet
//       2026) mit den Unterseiten vom 18.09.2026: automatisch «sur la base du revenu d'il y a
//       deux ans» (2024); Gesuch nötig u. a. für RDU 2026 unter 15'000 / 18'000 (allein + 1
//       Kind) / 20'000 (Paar) …, Bruttoeinkommen > 200'000 oder Bruttovermögen > 250'000,
//       junge Erwachsene, Quellenbesteuerte, Zugezogene 2025/2026; Frist 30. November 2026.
//       Eine Seite «demander-subside-assurance-maladie-2027» gibt es am 28.09.2026 nicht (404).
//
// Ein amtliches BERECHNUNGSBEISPIEL mit Einkommen gibt es nicht. Der Prüfstein der Tests ist
// darum der ganze Tarif [1]: jede Zelle der Haushaltstabelle (Grenzen UND Haushaltstotal) muss
// aus den Personenbeträgen und aus Art. 21 [2] nachgerechnet herauskommen.
//
// DAS MODELL IN EINEM SATZ
// Das massgebende Einkommen (RDU) bestimmt eine von acht Gruppen — die Grenzen hängen vom
// Haushalt ab —, und jede Person erhält den festen Monatsbetrag ihrer Gruppe; Kinder haben in
// Gruppe 1–8 alle denselben Betrag, Gruppe 9 gibt es nur für Kinder und junge Erwachsene.
//
// WAS GENF VON DEN BISHERIGEN KANTONEN UNTERSCHEIDET
// 1. EINE PERSON MIT KIND ZÄHLT WIE EIN PAAR (Art. 21 Abs. 4 [2]). Eine alleinerziehende
//    Person springt also von der Grenze 50'000 (allein) auf 115'000 + 6'000 = 121'000 für
//    Gruppe 8. Das ist kein Tippfehler im Tarif, sondern der Gesetzeswortlaut; [1] druckt für
//    «Personne seule + 1 enfant» und «Couple + 1 enfant» dieselben Grenzen.
// 2. DIE GRUPPEN FÜR ALLEINSTEHENDE SIND NUR 2'500 FRANKEN BREIT (Gruppe 2–8). Die App kennt
//    das RDU nicht, sie nähert es (siehe unten). Schon die fehlenden Berufskosten können eine
//    ganze Gruppe ausmachen — bis CHF 648 im Jahr (Gruppe 1 → 2). Das steht in der Anzeige
//    (`ipv.vorbehaltGE`), nicht nur hier.
// 3. DIE SÄULE 3A WIRD IM RDU NICHT ABGEZOGEN. Art. 5 Abs. 1 lit. a und c LRDU [4] übernehmen
//    von den Vorsorgeabzügen des Steuergesetzes (Art. 31 LIPP, rsGE D 3 08) nur lit. a
//    (AHV/IV/EO/ALV/UVG) und lit. b (2. Säule) — lit. c (3a) fehlt. Das Nettoeinkommen der
//    App trägt die 3a, genau wie das RDU: Regel `SAEULE_3A.voll`, Abzug 0.
// 4. KEINE PRÄMIENREGION. Der Tarif [1] kennt keine, und das BAG führt Genf als eine Region
//    (src/data/praemienRegionen.js: alle 45 Gemeinden r = 0). Darum `brauchtPLZ: false`.
//
// BEWUSST NICHT GEBAUT
//   · Paare, eingetragene Paare, Konkubinat — das zweite RDU fehlt der App (Art. 9 [3]).
//     ⚠️ Konkubinat OHNE gemeinsames Kind rechnet Genf einzeln (Art. 9 [3] addiert nur mit
//     gemeinsamem Kind). Die App weiss nicht, ob ein Kind gemeinsam ist → Orientierung.
//   · Junge Erwachsene (Jahrgänge 2001–2007 für 2026, [1]/[6]): eigene Person → nur auf Gesuch
//     und mit dem RDU der Eltern (Art. 10 Abs. 7 [3]); im Haushalt als Kind → ihr eigenes
//     RDU wird zu dem der Eltern gezählt (Art. 21 Abs. 6 [2]) und fehlt der App.
//   · Quellenbesteuerte (Art. 24 [2]), Zugezogene 2025/2026, amtlich Veranlagte (Art. 27 lit.
//     b [2]), international Steuerbefreite (Art. 27 lit. a [2]): alle nicht erkennbar.
//   · EL-, PCFam- und Sozialhilfe-Beziehende (Art. 22 Abs. 7–9 [2], Art. 11A–11C [3]): andere
//     Beträge (Durchschnittsprämie). Nicht erkennbar.
//   · Bruttoeinkommen über 200'000 (Art. 10 Abs. 2/3 [3]): die App kennt kein Bruttoeinkommen.
//     Ohne Folge für die Zahl: das Ersatz-RDU (0,95 × brutto) läge über 190'000 und damit über
//     jeder Gruppe-9-Grenze bis sieben Kinder (151'000 + 6 × 6'000 = 187'000).
//   · Vom RDU (Art. 5 LRDU [4]): Berufskosten, Kinderbetreuung, Unterhaltsbeiträge,
//     behinderungsbedingte Kosten, Krankheitskosten über 5 % — die App erfasst sie nicht. Jede
//     Auslassung HEBT das RDU und SENKT den Betrag (zu tief ist nicht die vorsichtige Seite).
//     Umgekehrt fehlen Liegenschaften und Schulden im Vermögen.
//   · Der Kinderbetrag in Gruppe 1–8 ist nach Art. 22 Abs. 2 lit. a [2] eine Formel aus der
//     BAG-Durchschnittsprämie (80 %, aufgerundet, + 10 Fr.), der Betrag junger Erwachsener nach
//     Abs. 3 lit. a (50 %, + 15 Fr.). Gerechnet wird mit den Beträgen des Tarifs [1], nicht mit
//     der Formel. Plausibel: BAG-Kinderprämie Genf 2026 152.20 × 0,8 = 121.76 → 122 + 10 = 132;
//     junge Erwachsene 431.90 × 0,5 = 215.95 → 216 + 15 = 231 (App-Daten praemienRegionen.js).
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';
import { zahl } from '../utils/geld.js';

// Werte 2026, wörtlich aus [1], [2], [3]. Beträge in CHF pro MONAT und Person.
export const IPV_GE = {
  jahr: 2026,
  // Automatisch aus der Veranlagung von vor zwei Jahren: «sur la base du revenu d'il y a deux
  // ans» [6]; für 2026 die Taxation 2024 (FAQ SAM: «avoir été taxé … pour l'année 2024»).
  basisjahrAbstand: 2,
  // [1] «Subside mensuel adulte», Gruppe 1–8; bestätigt durch [5] (320 … 50, indexiert +8,7 %).
  erwachsene: [348, 294, 240, 196, 164, 120, 87, 55],
  // [1] «Subside mensuel enfant»: Gruppe 1–8 je 132, Gruppe 9 je 67 ([5]: 60 → 67).
  kind: { g1bis8: 132, g9: 67 },
  // [1] «Subside mensuel jeune adulte»: 231 / Gruppe 9 106 — hier nur Konstante, nicht
  // gerechnet (junge Erwachsene sind bewusst nicht gebaut, siehe Kopf).
  jungeErwachsene: { g1bis8: 231, g9: 106 },
  // Art. 21 Abs. 1 [2] — obere Grenze jeder Gruppe, «ne dépasse pas».
  grenzen: {
    allein: [30000, 35000, 37500, 40000, 42500, 45000, 47500, 50000],
    paar: [45000, 55000, 65000, 75000, 85000, 95000, 105000, 115000],
  },
  // Art. 21 Abs. 2 [2]: «majorées de 6 000 francs par charge légale».
  jeChargeLegale: 6000,
  // Art. 21 Abs. 7/8 [2]: Gruppe 9 — «151 000 francs» für allein ODER Paar mit einer charge
  // légale, «majorée de 6 000 francs par charge légale supplémentaire».
  gruppe9: { mitEinerCharge: 151000, jeWeitere: 6000 },
  // Art. 8 Abs. 2 LRDU [4]: «augmenté d'un quinzième de la fortune».
  vermoegenAnteil: 1 / 15,
  // Art. 10 Abs. 1 [3]: «la fortune brute qui excède 250 000 francs» → Gesuch.
  bruttoVermoegenGrenze: 250000,
  // Art. 10 Abs. 4/5 [3]: RDU unter 15'000 (allein) / 20'000 (Paar), +3'000 je charge légale →
  // nicht automatisch, Gesuch mit Nachweisen. [6] druckt für «Personne seule avec 1 enfant»
  // 18'000 — die Alleinerziehenden gehen hier also von 15'000 aus, NICHT wie bei den
  // Gruppengrenzen vom Paar.
  tiefesRdu: { allein: 15000, paar: 20000, jeCharge: 3000 },
  // Art. 10A [3]: «avant le 30 novembre de l'année d'ouverture du droit» — VOR dem 30.11.
  gesuchFrist: { monat: 11, tag: 30 },
};

// Die Grenzen der Gruppen 1–8 und (mit Kindern) 9 für einen Haushalt. `erwachsene` ist nur für
// den Tarif-Test da (die Paar-Zeilen von [1]); die App ruft immer mit einer Person auf.
export function geGrenzen({ kinderZahl = 0, erwachsene = 1 }) {
  const p = IPV_GE;
  // Art. 21 Abs. 4 [2]: «Une personne assumant une charge légale est assimilée à un couple.»
  const wiePaar = erwachsene >= 2 || kinderZahl > 0;
  const basis = wiePaar ? p.grenzen.paar : p.grenzen.allein;
  const g1bis8 = basis.map((g) => g + p.jeChargeLegale * kinderZahl);
  // Gruppe 9 nur mit mindestens einer charge légale (Art. 21 Abs. 5–8 [2]).
  const g9 = kinderZahl > 0 ? p.gruppe9.mitEinerCharge + p.gruppe9.jeWeitere * (kinderZahl - 1) : null;
  return { g1bis8, g9 };
}

// Reine Rechnung ohne App-Daten. `rdu` im Jahr. Liefert Monats- und Jahresbeträge, die Gruppe
// (1–9, null = kein Anspruch), den Anteil der Erwachsenen getrennt (nur ihn deckelt die App,
// siehe `deckelnProPerson`) und die Grenze, bis zu der überhaupt ein Betrag entsteht.
export function ipvGeneveRechnen({ rdu, kinderZahl = 0, erwachsene = 1 }) {
  const p = IPV_GE;
  // Art. 9A [3]: ein negatives RDU gilt als 0.
  const r0 = Math.max(0, rdu);
  const { g1bis8, g9 } = geGrenzen({ kinderZahl, erwachsene });
  const grenze = g9 ?? g1bis8[7];
  let gruppe = null;
  const i = g1bis8.findIndex((g) => r0 <= g);
  if (i >= 0) gruppe = i + 1;
  else if (g9 != null && r0 <= g9) gruppe = 9;
  const betrag = (g) => {
    if (g == null) return { erw: 0, kind: 0 };
    if (g === 9) return { erw: 0, kind: p.kind.g9 };
    return { erw: p.erwachsene[g - 1], kind: p.kind.g1bis8 };
  };
  const b = betrag(gruppe);
  const b1 = betrag(1);
  const monat = erwachsene * b.erw + kinderZahl * b.kind;
  return {
    gruppe, grenze, monat, annual: monat * 12,
    erwachseneAnnual: erwachsene * b.erw * 12,
    maximal: (erwachsene * b1.erw + kinderZahl * b1.kind) * 12,
    erwachseneMaximal: erwachsene * b1.erw * 12,
  };
}

// Art. 10 Abs. 4/5 [3] mit [6]: unter dieser Grenze prüft Genf nicht automatisch.
export function geTiefesRduGrenze({ kinderZahl = 0, erwachsene = 1 }) {
  const t = IPV_GE.tiefesRdu;
  return (erwachsene >= 2 ? t.paar : t.allein) + t.jeCharge * kinderZahl;
}

// Aufruf aus calculateIPV (config/cantonalData.js) für GE mit Beleg. Die App rechnet nur, wo
// ihre Angaben dafür reichen; sonst dieselbe Orientierung wie ein unbelegter Kanton, mit Grund
// in `offen`.
export function ipvGeneve(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_GE.jahr;
  // Die Beträge werden jedes Jahr per Beschluss indexiert (Art. 9B [3]); 2027 war am
  // 28.09.2026 noch nicht publiziert. Ab dem 01.01. des Folgejahres lieber keine Zahl.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // Alter nach Jahrgang: «Sont considérés comme jeunes adultes, les personnes nées entre 2001
  // et 2007» [1] — erwachsen ist, wer im Anspruchsjahr 26 wird (Jahrgang 2000 und älter).
  // Dieselbe Regel wie AG und LU, hier mit dem amtlichen Tarif für GENAU dieses Jahr belegt;
  // der Stichtag steht in Art. 10 Abs. 8 [3] («l'âge … le 1er janvier»).
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung('alter');
  // Kinder: minderjährig ist, wer die Volljährigkeit NICHT «avant le 1er janvier» erreicht hat
  // (Art. 20 Abs. 3 lit. b [2]) — für 2026 die Jahrgänge 2008–2026, also höchstens 18 im
  // Anspruchsjahr. Eingetipptes Alter +1 (vorsichtig an der 18, wie BE, LU).
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  // Junge Erwachsene im Haushalt: ihr eigenes RDU zählt mit (Art. 21 Abs. 6 [2]) — fehlt.
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');

  const kinderZahl = kinderJahre.length;
  const vermoegen = vermoegenSumme(f);
  // Über 250'000 Bruttovermögen gilt die Person als «nicht bescheiden», bis sie das Gegenteil
  // zeigt (Art. 20 Abs. 2 [2], Art. 10 Abs. 1–3 [3]) — KEIN Ausschluss, sondern ein Gesuch mit
  // einem Ersatz-RDU (0,95 × Bruttoeinkommen + 1/15 Bruttovermögen). Das Bruttoeinkommen kennt
  // die App nicht. Die erfassten Posten sind höchstens ein Teil des Bruttovermögens: liegen
  // schon sie darüber, ist der Fall sicher; darunter kann er trotzdem eintreten (Liegenschaft).
  if (vermoegen > IPV_GE.bruttoVermoegenGrenze) return orientierung('geVermoegenAntrag');
  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');

  // RDU nach Art. 8 Abs. 2 LRDU [4]: Einkommen + 1/15 des Vermögens. Die 3a steckt im
  // Nettoeinkommen und bleibt dort (Regel `voll`, siehe Kopf Punkt 3).
  const rdu = einkommenJahr(f, SAEULE_3A.voll) + IPV_GE.vermoegenAnteil * vermoegen;
  const r = ipvGeneveRechnen({ rdu, kinderZahl });

  // Genf publiziert die Grenzen als Zahl (Art. 21 [2], Tarif [1]) — darum darf sie stehen:
  // die letzte Grenze, bis zu der für diesen Haushalt überhaupt ein Betrag entsteht.
  const cantonData = { ...ipvData, maxIncome: r.grenze };
  const basisjahr = jahr - IPV_GE.basisjahrAbstand;
  const gemeinsam = {
    canton: 'GE', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltGE',
    extra: { basisjahr, gruppe: r.gruppe, jahrKey: 'ipv.jahrGE' },
  };
  if (!r.gruppe) {
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.geKeinAnspruch', noteParams: { grenze: zahl(r.grenze) } });
  }

  // Art. 22 Abs. 4 [2]: höchstens die effektive Prämie «de l'assuré» — also je Person. Die App
  // kennt nur die Prämie der erwachsenen Person, darum wird nur deren Anteil gedeckelt.
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');
  const annual = deckelnProPerson(r.annual, r.erwachseneAnnual, praemie);
  const maxAnnual = deckelnProPerson(r.maximal, r.erwachseneMaximal, praemie);

  // Unter der Grenze von Art. 10 Abs. 4/5 [3] gilt: nicht automatisch, sondern Gesuch mit
  // Nachweisen bis 30.11. des Anspruchsjahres (Art. 10A [3]). Genau die ärmste Gruppe — wer
  // sich hier auf «automatisch» verlässt, erhält nichts. Nach der Frist: «Le service n'entre pas
  // en matière sur des demandes présentées hors délai.» Dann wird auch nirgends etwas von der
  // Prämie abgezogen (anmeldefristVorbei → data/ipvAbzug.js).
  const tiefGrenze = geTiefesRduGrenze({ kinderZahl });
  const antragNoetig = rdu < tiefGrenze;
  const { monat, tag } = IPV_GE.gesuchFrist;
  // «avant le 30 novembre» — der 30. selbst ist schon zu spät.
  const fristVorbei = antragNoetig && new Date() >= new Date(jahr, monat - 1, tag);
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    extra: { ...gemeinsam.extra, ...(fristVorbei ? { anmeldefristVorbei: true } : {}) },
    noteKey: antragNoetig ? (fristVorbei ? 'ipv.geAntragFristVorbei' : 'ipv.geAntragNoetig') : ipvData.noteKey,
    noteParams: antragNoetig ? { grenze: zahl(tiefGrenze), jahr } : (ipvData.noteParams || {}),
  });
}
