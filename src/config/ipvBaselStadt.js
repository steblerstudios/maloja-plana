// Prämienverbilligung (IPV) Kanton Basel-Stadt — amtliche Stufentabelle, Jahr 2026 (K31).
//
// Belege (an der Quelle gelesen 28.09.2026, alle über die API der Gesetzessammlung bzw. als
// PDF des Amts; Gegenprobe je mit erfundener Nummer → HTTP 404). Wortlaute in
// docs/sources/ipv-kantone-2026.md, Abschnitt BS:
//   [1] Verordnung über die Krankenversicherung im Kanton Basel-Stadt (KVO), SG 834.410,
//       Version 6727 «in Kraft seit: 01.01.2026 bis: 31.12.2026 (Beschlussdatum: 16.12.2025)».
//       § 15 Abs. 1: Beiträge «auf Antrag» · § 16: Zuzug · § 21 Abs. 1bis: Zuschlag bei
//       besonderer Versicherungsform · § 22 Abs. 1: Leistungsgrenzen T 1, ab neun Personen
//       + Fr. 4'000 je Person · § 22 Abs. 2: Tabellen T 2–T 4, höchstens die geschuldete Prämie.
//       Anhang 2 (Anhang zu § 22 Abs. 2) «in der Fassung vom 21. Oktober 2025 (KB 25.10.2025)».
//       Eine künftige Version 6935 (in Kraft ab 01.01.2027, Beschluss 15.09.2026) ist
//       publiziert, trägt aber noch denselben Anhang 2 — die Beiträge 2027 stehen noch aus.
//   [2] Harmonisierungsgesetz Sozialleistungen (SoHaG), SG 890.700, Version 6622 «in Kraft
//       seit: 01.07.2025». § 5: Haushaltseinheit · § 6 Abs. 2 lit. d: massgebliches Einkommen
//       für die Prämienverbilligung · § 7: anrechenbares Einkommen, Abs. 4 hypothetisches
//       Einkommen · § 17: Rückerstattung.
//   [3] Verordnung dazu (SoHaV), SG 890.710, Version 5476 «in Kraft seit: 01.07.2021».
//       § 11 Abs. 2: Aufbau der Leistungsgrenzen · § 13: Berechnungsgrundlage · §§ 16–18:
//       Einnahmen, Abzüge, Freibeträge · §§ 19–27: hypothetisches Erwerbseinkommen ·
//       § 28: Vermögensanteil und Freibeträge · § 29: massgebendes Vermögen.
//   [4] Amt für Sozialbeiträge (ASB), «Einkommensgruppen, -grenzen und IPV-Beiträge ab
//       1. Januar 2026 (Gemäss Beschluss des Regierungsrates vom 21. Oktober 2025)», mit
//       amtlichem Berechnungsbeispiel — der Prüfstein der Tests.
//   [5] ASB, «Merkblatt Prämienverbilligung (Ausgabe 01.2026)»: Antrag, Haushaltseinheit,
//       Anspruch «ab dem Monat nach der Antragstellung».
//
// DAS MODELL IN EINEM SATZ
// Das massgebliche Einkommen des Haushalts bestimmt eine von 22 Beitragsgruppen, und jede
// Person erhält den festen Monatsbeitrag ihrer Gruppe und Altersklasse — keine Formel,
// keine Prämienregion, sondern eine Tabelle wie in Bern.
//
// WAS BASEL-STADT VON DEN BISHERIGEN KANTONEN UNTERSCHEIDET
//
// 1. KEINE STEUERGRÖSSE. Massgeblich sind die Einnahmen der Haushaltseinheit nach dem
//    Harmonisierungsgesetz (Erwerb, Renten, Familienzulagen …), bereinigt um die Beiträge an
//    AHV/IV/EO/ALV und die Pensionskasse (SoHaV § 17 Abs. 1 lit. a) — also im Kern der
//    Nettolohn, wie das Beispiel [4] sagt: «Massgebliches Einkommen = Nettolohn inkl. Kinder-
//    und Ausbildungszulagen, zzgl. vorgelagerte Leistungen … und allfälliger Vermögensanteil.»
//    Das liegt näher an den Angaben der App als in jedem Steuerkanton.
//
// 2. DIE SÄULE 3A WIRD NUR OHNE ZWEITE SÄULE ABGEZOGEN (SoHaV § 17 Abs. 1 lit. a/b) —
//    `SAEULE_3A.abzugOhneSaeule2` in kantonsModell.js. Ob eine Pensionskasse besteht, weiss
//    die App nicht sicher; darum werden hier beide Fälle gerechnet (siehe `bsSaeule3a` unten).
//
// 3. HYPOTHETISCHES EINKOMMEN. Wer weniger arbeitet als zumutbar (Alleinstehende unter 80 %),
//    dem rechnet das ASB die Differenz an: «100 Prozent entsprechen dabei einem jährlichen
//    Mindesterwerbseinkommen von CHF 36'000 (netto)» (SoHaV § 24 Abs. 2). Den Beschäftigungs-
//    grad kennt die App nicht — siehe den Riegel `bsHypothetisch` unten.
//
// 4. ZUSCHLAG FÜR ALTERNATIVE VERSICHERUNGSMODELLE (KVO § 21 Abs. 1bis, Tabelle T 4): bis
//    Fr. 30 im Monat mehr für Erwachsene. Ob er zusteht, hängt am Modell UND an einem vom ASB
//    festgelegten Mindestrabatt, der nicht publiziert ist. Das Feld `kkModel` der App reicht
//    dafür nicht. Darum rechnet die App den Standard-Beitrag (T 3) und NENNT den Betrag mit
//    Zuschlag im Hinweis daneben — beide Zahlen stehen in der Tabelle, geraten wird keine.
//
// 5. KEINE VERMÖGENSGRENZE, nur ein Vermögensanteil (ein Zehntel über den Freibeträgen,
//    SoHaV § 28), und KEINE FRIST: der Anspruch beginnt im Monat nach dem Antrag ([5]).
//
// BEWUSST NICHT GEBAUT:
//   · Paare, eingetragene Partnerschaft, Konkubinat — die Haushaltseinheit umfasst sie
//     (SoHaG § 5 Abs. 2 lit. a/b; SoHaV § 1: gemeinsames Kind oder fünf Jahre Haushalt), das
//     zweite Einkommen fehlt der App.
//   · volljährige Kinder in Erstausbildung bis 25 — sie gehören zur Haushaltseinheit (SoHaG
//     § 5 Abs. 2 lit. c), auch wenn sie anderswo wohnen; die App kennt die Ausbildung nicht.
//     Kinder über 18 ⇒ keine Zahl. Ebenso nicht: Kinder getrennt lebender Eltern, die nach
//     SoHaV §§ 4–7 einem anderen Haushalt zugerechnet werden.
//   · antragstellende Personen unter 25 in Erstausbildung (Haushalt der Eltern, SoHaG § 5 Abs. 3)
//     und junge Erwachsene allgemein — die App rechnet nur für Erwachsene.
//   · Quellenbesteuerte, EL-Beziehende (die EL zählt zum massgeblichen Einkommen, SoHaG § 6
//     Abs. 2 lit. dd), Sozialhilfe (Subrogation, KVO § 24), Personen nach Art. 65a KVG.
//   · Einnahmen, die die App nicht erfasst: Familienzulagen, sofern nicht im Nettolohn;
//     Unterhaltsbeiträge; Vermögenserträge (Freibetrag Fr. 500, SoHaV § 18 Abs. 2);
//     Stipendien, Alimentenbevorschussung, Mietzinsbeiträge (SoHaG § 6 Abs. 2 lit. d).
//     Liegenschaften zählen zu 25 % des Steuerwerts (SoHaV § 29 Abs. 3) — die App kennt
//     nur die Summe der erfassten Posten.
//   · Zuzug im laufenden Jahr (KVO § 16): massgebend ist der Wohnkanton am 1. Januar.
//   · die Erhöhung der Mindesterwerbseinkommen im Einzelfall (SoHaV § 27).
import {
  vermoegenSumme, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';
import { hauptlohnMonate } from '../utils/dreizehnter.js';
import { zahl } from '../utils/geld.js';

// Werte 2026, wörtlich aus [1] Anhang 2. Beträge in CHF; Grenzen je Jahr, Beiträge je Monat.
export const IPV_BS = {
  jahr: 2026,
  // T 1 — «Leistungsgrenze - massgebliches Einkommen gemäss § 6 Abs. 2 lit. d SoHaG in Fr.
  // (pro Jahr)», Zeile = Beitragsgruppe 01–22 (T 2), Spalte = 1 bis 8 Personen («PH =
  // Personenhaushalt»). Die Zahl ist die OBERGRENZE der Gruppe (Beispiel [4]).
  // [1] druckt in Gruppe 16, 4 PH «85.000» mit Punkt statt Apostroph; [4] und das Muster der
  // Spalte (+2'000 je Gruppe) sagen 85'000.
  grenzen: [
    [23125, 37000, 47000, 55000, 61000, 65000, 69000, 73000],
    [24375, 39000, 49000, 57000, 63000, 67000, 71000, 75000],
    [25625, 41000, 51000, 59000, 65000, 69000, 73000, 77000],
    [26875, 43000, 53000, 61000, 67000, 71000, 75000, 79000],
    [28125, 45000, 55000, 63000, 69000, 73000, 77000, 81000],
    [29375, 47000, 57000, 65000, 71000, 75000, 79000, 83000],
    [30625, 49000, 59000, 67000, 73000, 77000, 81000, 85000],
    [31875, 51000, 61000, 69000, 75000, 79000, 83000, 87000],
    [33125, 53000, 63000, 71000, 77000, 81000, 85000, 89000],
    [34375, 55000, 65000, 73000, 79000, 83000, 87000, 91000],
    [35625, 57000, 67000, 75000, 81000, 85000, 89000, 93000],
    [36875, 59000, 69000, 77000, 83000, 87000, 91000, 95000],
    [38125, 61000, 71000, 79000, 85000, 89000, 93000, 97000],
    [39375, 63000, 73000, 81000, 87000, 91000, 95000, 99000],
    [40625, 65000, 75000, 83000, 89000, 93000, 97000, 101000],
    [41875, 67000, 77000, 85000, 91000, 95000, 99000, 103000],
    [43125, 69000, 79000, 87000, 93000, 97000, 101000, 105000],
    [44375, 71000, 81000, 89000, 95000, 99000, 103000, 107000],
    [45625, 73000, 83000, 91000, 97000, 101000, 105000, 109000],
    [46875, 75000, 85000, 93000, 99000, 103000, 107000, 111000],
    [48125, 77000, 87000, 95000, 101000, 105000, 109000, 113000],
    [49375, 79000, 89000, 97000, 103000, 107000, 111000, 115000],
  ],
  // § 22 Abs. 1 [1]: «Für Haushaltseinheiten von neun und mehr Personen erhöhen sich die
  // Leistungsgrenzen, ausgehend von der Leistungsgrenze der jeweils vorangehenden
  // Haushaltseinheit … um Fr. 4'000 pro Person.»
  jeWeiterePerson: 4000,
  // T 3 — «Beiträge an die Krankenversicherungsprämien in Fr. (pro Monat)», Gruppe 01–22.
  // Fussnote a: junge Erwachsene «unabhängig davon ob in Ausbildung oder nicht».
  standard: {
    erwachsene: [444, 415, 385, 352, 325, 296, 266, 237, 210, 179, 148, 118, 91, 61, 43, 37, 33, 30, 26, 23, 20, 17],
    jungeErwachsene: [329, 308, 289, 266, 247, 232, 229, 229, 229, 229, 229, 229, 229, 229, 229, 229, 229, 229, 229, 229, 229, 229],
    kinder: [157, 146, 137, 129, 124, 124, 124, 124, 124, 124, 124, 124, 124, 124, 124, 124, 124, 124, 124, 124, 124, 124],
  },
  // T 4 — dieselben Beiträge «in einer besonderen Versicherungsform gemäss Art. 62 Abs. 1 KVG
  // und § 21 Abs. 1bis KVO». 🛑 Gruppe 09, Erwachsene: die Verordnung [1] sagt 240, die
  // Beitragstabelle des ASB [4] 230. Es gilt die Verordnung; 240 ist auch der Abstand von
  // 30 Franken, den alle Gruppen 01–21 haben. Die Frage steht in FRAGEN-AN-DIE-AEMTER.md.
  alternativ: {
    erwachsene: [474, 445, 415, 382, 355, 326, 296, 267, 240, 209, 178, 148, 121, 91, 73, 67, 63, 60, 56, 53, 50, 26],
    jungeErwachsene: [335, 314, 295, 272, 253, 238, 235, 235, 235, 235, 235, 235, 235, 235, 235, 235, 235, 235, 235, 235, 235, 229],
    kinder: [163, 152, 143, 135, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 124],
  },
  // SoHaV § 28 Abs. 2/3 [3]: Freibeträge «für Alleinstehende CHF 37'500, für Paare CHF 60'000
  // und für Kinder je CHF 15'000»; darüber «um einen Zehntel des überschiessenden Teils».
  vermoegen: { alleinstehend: 37500, paar: 60000, jeKind: 15000, anteil: 0.1 },
  // SoHaV § 24 Abs. 1 lit. a / Abs. 2 [3]: Alleinstehende mindestens 80 %, «100 Prozent
  // entsprechen dabei einem jährlichen Mindesterwerbseinkommen von CHF 36'000 (netto)».
  // § 25 Abs. 1 lit. a nennt dieselbe Zahl für Selbständige: «CHF 28'800 (netto) (80 Prozent
  // von CHF 36'000)».
  hypothetisch: { vollzeitNetto: 36000, mindestgrad: 0.8 },
  // SoHaV § 23 Abs. 1 lit. a [3]: kein hypothetisches Einkommen, wenn «eine Person das
  // 60. Altersjahr überschritten» hat. § 22 Abs. 1 lit. a: die überwiegende Betreuung eigener
  // Kinder «bis zur Vollendung des 16. Altersjahres» ist einer Erwerbstätigkeit gleichgestellt.
  rechtfertigungAlter: 60,
  betreuungBisAlter: 16,
};

// Die Mindestgrenze, unter der die App die Frage nach dem hypothetischen Einkommen stellt.
// 36'000 × 80 % = 28'800 — dieselbe Zahl, die § 25 Abs. 1 lit. a für Selbständige ausschreibt.
export const BS_HYPOTHETISCH_SCHWELLE = IPV_BS.hypothetisch.vollzeitNetto * IPV_BS.hypothetisch.mindestgrad;

// Leistungsgrenzen einer Haushaltsgrösse: die Spalte aus T 1, ab neun Personen je weitere
// Person + 4'000 auf jede Gruppengrenze (§ 22 Abs. 1 [1]; die Spalten 5–8 PH zeigen genau
// dieses Muster, und SoHaV § 11 Abs. 2 beschreibt es für «jede weitere Person»).
export function bsGrenzen(personen) {
  const p = Math.max(1, Math.round(personen));
  const spalte = Math.min(p, 8) - 1;
  const zuschlag = Math.max(0, p - 8) * IPV_BS.jeWeiterePerson;
  return IPV_BS.grenzen.map((zeile) => zeile[spalte] + zuschlag);
}

// Beitragsgruppe (0-basiert) zum massgeblichen Einkommen, oder `null` über der Leistungs-
// grenze. «bis und mit»: § 22 Abs. 1 [1] gewährt Beiträge, wenn das Einkommen die Grenze
// «nicht übersteigt» — die App liest die übrigen Gruppengrenzen gleich. Das amtliche Beispiel
// [4] (62'000 bei 4 PH → Gruppe 5, weil 61'000 < 62'000 ≤ 63'000) liegt nicht auf einer Grenze;
// die Lesart ist darum gewählt, nicht am Beispiel bestätigt.
export function bsGruppe(me, personen) {
  const i = bsGrenzen(personen).findIndex((g) => Math.max(0, me) <= g);
  return i === -1 ? null : i;
}

// Reine Rechnung — ohne App-Daten, damit die Tests sie gegen das amtliche Beispiel prüfen.
// `personen`: 'e' Erwachsene, 'j' junge Erwachsene, 'k' Kinder; die Haushaltsgrösse ist ihre
// Zahl. Liefert Monatsbeträge ohne und mit Zuschlag (T 3 / T 4), die Jahresbeträge, den Anteil
// der Erwachsenen (für den Deckel) und die Leistungsgrenze des Haushalts.
export function ipvBaselStadtRechnen({ personen, me }) {
  const grenzen = bsGrenzen(personen.length);
  const grenze = grenzen[grenzen.length - 1];
  const gruppe = bsGruppe(me, personen.length);
  const kat = { e: 'erwachsene', j: 'jungeErwachsene', k: 'kinder' };
  const summe = (tabelle, i, nur) => personen
    .filter((c) => !nur || c === nur)
    .reduce((s, c) => s + tabelle[kat[c]][i], 0);
  if (gruppe === null) {
    return { gruppe, grenze, monat: 0, monatAlternativ: 0, annual: 0, erwachseneAnnual: 0, maximal: summe(IPV_BS.standard, 0) * 12, erwachseneMaximal: summe(IPV_BS.standard, 0, 'e') * 12, annualAlternativ: 0, erwachseneAnnualAlternativ: 0 };
  }
  const monat = summe(IPV_BS.standard, gruppe);
  const monatAlternativ = summe(IPV_BS.alternativ, gruppe);
  return {
    gruppe, grenze, monat, monatAlternativ,
    annual: monat * 12,
    erwachseneAnnual: summe(IPV_BS.standard, gruppe, 'e') * 12,
    annualAlternativ: monatAlternativ * 12,
    erwachseneAnnualAlternativ: summe(IPV_BS.alternativ, gruppe, 'e') * 12,
    // Vergleichsgrösse «höchstens möglich»: Gruppe 01 ohne Zuschlag.
    maximal: summe(IPV_BS.standard, 0) * 12,
    erwachseneMaximal: summe(IPV_BS.standard, 0, 'e') * 12,
  };
}

// Vermögensanteil nach SoHaV § 28 [3] — ein Zehntel über den Freibeträgen.
export function bsVermoegensanteil(vermoegen, kinderZahl, paar = false) {
  const v = IPV_BS.vermoegen;
  const frei = (paar ? v.paar : v.alleinstehend) + v.jeKind * kinderZahl;
  return v.anteil * Math.max(0, Math.max(0, vermoegen) - frei);
}

// Aufruf aus calculateIPV (config/cantonalData.js) für BS mit Beleg. Die App rechnet nur, wo
// ihre Angaben dafür reichen; sonst dieselbe Orientierung wie ein unbelegter Kanton, mit Grund
// in `offen`. Keine Prämienregion ⇒ `lookupPLZ` wird nicht gebraucht (Register: brauchtPLZ false).
export function ipvBaselStadt(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_BS.jahr;
  // Die Beiträge legt der Regierungsrat jährlich fest (KVO Anhang 2). Für 2027 sind sie am
  // 28.09.2026 noch nicht publiziert — ab dem 01.01. des Folgejahres darum keine Zahl.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  // SoHaG § 5 Abs. 2 lit. a/b [2]: Ehe, eingetragene Partnerschaft und gefestigte faktische
  // Lebensgemeinschaft gehören zur Haushaltseinheit. Das zweite Einkommen kennt die App nicht.
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // KVO und SoHaV nennen für die Altersklassen keinen Stichtag. Gewählt wie BE und SG:
  // gerechnet wird nur, wenn die Person das ganze Anspruchsjahr über erwachsen ist.
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.mangelsStichtag(jahr, geburt)) return orientierung('alter');
  // Kinder: höchstens 18 im Anspruchsjahr; beim eingetippten Alter ein Jahr dazu (wie BE).
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  // Über 18: volljährige Kinder in Erstausbildung gehören zur Haushaltseinheit, die übrigen
  // nicht — die Ausbildung kennt die App nicht (siehe Kopf).
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');
  const kinderZahl = kinderJahre.length;

  // 🛑 Ein negatives Einkommen ist ein Vertipper; in einer Stufentabelle endete es in Gruppe 01.
  const roh = rohesEinkommenJahr(f);
  if (roh < 0) return orientierung('einkommenNegativ');

  // 🛑 HYPOTHETISCHES EINKOMMEN (SoHaV §§ 19–25 [3]). Alleinstehenden, die nicht mindestens
  // 80 % arbeiten, rechnet das ASB die Differenz zu 36'000 netto an; Selbständigen mindestens
  // 28'800. Den Beschäftigungsgrad kennt die App nicht. GEWÄHLT, nicht belegt: unter
  // 28'800 Erwerbseinkommen im Jahr — dem Betrag, den die Verordnung selbst einer
  // 80-%-Tätigkeit gleichsetzt — zeigt die App keine Zahl, ausser eine Ausnahme ist aus den
  // Angaben SICHER erkennbar:
  //   · älter als 60 (§ 23 Abs. 1 lit. a, «das 60. Altersjahr überschritten»). Beide Lesarten
  //     («60 vollendet» oder «älter als 60») sind erfüllt, wenn die Person am Ende des
  //     Vorjahres mindestens 61 war — so rechnet die App, vorsichtig.
  //   · ein Kind, das im ganzen Anspruchsjahr unter 16 ist (§ 22 Abs. 1 lit. a, überwiegende
  //     Betreuung — bei einer alleinerziehenden Person angenommen, nicht geprüft).
  // Ohne diesen Riegel zeigte die App gerade dort den HÖCHSTEN Betrag, wo das Amt am
  // wahrscheinlichsten ein Einkommen hinzurechnet: 10'000 im Jahr ⇒ Gruppe 01, 444 im Monat;
  // mit einem Pensum von 20 % rechnet das ASB 21'600 dazu ⇒ Gruppe 08, 237 im Monat.
  // Über der Schwelle rechnet die App — der Vorbehalt nennt die Regel.
  const erwerb = Number(f.monthlyIncome || 0) * hauptlohnMonate(f.dreizehnter) + Number(f.sideIncome || 0) * 12;
  const ueber60 = (jahr - 1) - geburt >= IPV_BS.rechtfertigungAlter + 1;
  const kleinesKind = kinderJahre.some((a) => a < IPV_BS.betreuungBisAlter);
  if (erwerb < BS_HYPOTHETISCH_SCHWELLE && !ueber60 && !kleinesKind) return orientierung('bsHypothetisch');

  // SoHaV § 28 [3]: Vermögensanteil. Keine Vermögensgrenze — anders als LU, SG, ZH.
  const anteil = bsVermoegensanteil(vermoegenSumme(f), kinderZahl);
  const personen = ['e', ...kinderJahre.map(() => 'k')];

  // SoHaV § 17 Abs. 1 lit. a/b [3]: die Säule 3a wird nur OHNE zweite Säule abgezogen. Beide
  // Fälle rechnen; ist ein Pensionskassenbeitrag erfasst, gilt der Fall MIT zweiter Säule.
  // Ergeben beide dieselbe Gruppe, ist die Frage für diese Person ohne Folge.
  // GEWÄHLT: ein erfasster Beitrag (`versicherungen.bvgContribution` > 0) gilt als Beleg für
  // eine zweite Säule. Ein leeres Feld heisst «nicht erfasst», nicht «keine Pensionskasse».
  const regel = SAEULE_3A.abzugOhneSaeule2;
  const meMit = Math.max(0, roh - regel.nichtAufgerechnet(f) + anteil);
  const meOhne = Math.max(0, roh - regel.ohneSaeule2(f) + anteil);
  const saeule2Erfasst = Number(data.versicherungen?.bvgContribution) > 0;
  if (!saeule2Erfasst && bsGruppe(meMit, personen.length) !== bsGruppe(meOhne, personen.length)) {
    return orientierung('bsSaeule3a');
  }
  const me = meMit;

  // KVO § 22 Abs. 2 [1]: «höchstens der im konkreten Fall tatsächlich geschuldeten Prämie».
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');

  const r = ipvBaselStadtRechnen({ personen, me });
  // Die Leistungsgrenze ist amtlich als Zahl publiziert (T 1) — je Haushaltsgrösse.
  const cantonData = { ...ipvData, maxIncome: r.grenze };
  const gemeinsam = {
    canton: 'BS', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltBS',
    extra: { jahrKey: 'ipv.jahrBS', gruppe: r.gruppe === null ? null : r.gruppe + 1 },
  };
  if (r.gruppe === null) {
    return ergebnisOhneAnspruch({
      // Die Grenze im Schweizer Format: `t` setzt Parameter roh ein (wie `incomeAboveLimit`).
      ...gemeinsam, noteKey: 'ipv.bsKeinAnspruch', noteParams: { grenze: zahl(r.grenze) },
    });
  }
  // Der Deckel pro Person (kantonsModell.js): nur der Anteil der erwachsenen Person wird auf
  // ihre Prämie begrenzt, die Kinderanteile bleiben — ihre Prämien kennt die App nicht.
  const annual = deckelnProPerson(r.annual, r.erwachseneAnnual, praemie);
  const maxAnnual = deckelnProPerson(r.maximal, r.erwachseneMaximal, praemie);
  const annualAlternativ = deckelnProPerson(r.annualAlternativ, r.erwachseneAnnualAlternativ, praemie);
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    // KVO § 15 Abs. 1 [1]: nur «auf Antrag»; [5]: «ab dem Monat nach der Antragstellung».
    // Der Hinweis nennt dazu den Betrag MIT Zuschlag (T 4) — beide aus der Tabelle.
    noteKey: 'ipv.bsAntrag',
    noteParams: { monat: Math.round(annual / 12), monatAlternativ: Math.round(annualAlternativ / 12) },
  });
}
