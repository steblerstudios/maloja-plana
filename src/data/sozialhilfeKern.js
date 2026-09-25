// Sozialhilfe-Kern: die EINE Rechnung Bedarf ↔ Einkommen, die beide Rechenwege teilen —
// die Schnellrechnung calculateSozialhilfe (config/cantonalData.js: Dashboard, Schnellcheck,
// Pegel, Instrumente, Budget) und der ausführliche Rechner berechneSozialhilfe
// (data/sozialhilfeRechner.js). Vorher rechneten beide verschieden (Fachprüfung swiss-precision
// vom 25.09.2026 zu PR #380): die Schnellrechnung ohne Einkommensfreibetrag, beide ohne
// Erwerbsunkosten. Bewusst ohne Importe, weil cantonalData.js im Startbündel liegt.
//
// QUELLEN: Wortlaut gelesen am 25.09.2026 in den SKOS-Richtlinien, Fassung «Version 1. Januar 2021»
// (skos.ch, 2021_SKOS-Richtlinien.pdf). Ob sich das per 1.1.2026 geändert hat, ist in der Synopse der
// 2. Etappe geprüft (Version 15.5.2025, bereinigt 30.9.2025, ergänzt 4.12.2025): C.6.3 und D.2 sind
// unverändert. C.2 Abs. 1 lautet neu «materielle Grundsicherung (inkl. grundversorgende SIL)».
// Achtung Nummern: die Erwerbsunkosten stehen in C.6.3, nicht in C.6.1, und der Einkommensfreibetrag
// steht in D.2, nicht in C.6.2 (C.6.2 ist «Bildung»).
//
// 1. Erwerbsunkosten gehören in den Bedarf (SKOS-RL C.6.3, C.6.1 Erl. b, C.2 Abs. 1).
//    Mehrkosten für auswärtige Verpflegung (8–10 Fr. pro Mahlzeit), öffentlichen Verkehr, ein
//    Motorfahrzeug (nur wenn es mit dem öffentlichen Verkehr nicht zumutbar geht) und UVG-Prämien
//    «sind zu übernehmen», wenn die Tätigkeit den Zielen der Sozialhilfe dient (Abs. 1). Sie sind
//    grundversorgende SIL und zählen deshalb schon beim Eintritt.
//    Übernommen werden die BELEGTEN Kosten, eine SKOS-Pauschale gibt es nicht. Deshalb rechnen wir
//    nur mit einem eingetragenen Betrag und schätzen nie. Der Nahverkehr steckt schon im Grundbedarf
//    (C.6.1 Erl. d): gemeint sind nur die Mehrkosten, die darüber hinausgehen.
//    Laut C.6.3 Erl. a werden sie nicht mit dem Freibetrag verrechnet (beides zählt nebeneinander).
//
// 2. Einkommensfreibetrag (EFB, SKOS-RL D.2). Er gilt nur für Erwerbseinkommen aus dem ersten
//    Arbeitsmarkt. Laut Abs. 3 beträgt er «400 bis 700 Franken pro Monat für eine Vollanstellung».
//    Den Betrag innerhalb dieser Spanne legt der Kanton fest.
//    HÖHE — vorsichtig: ein Drittel des Erwerbseinkommens, höchstens 400 Fr. Das ist die Regel von
//    Basel-Stadt (Unterstützungsrichtlinien WSU, gültig ab 1.1.2026, Ziff. 12.1: «ein Drittel des
//    Nettoeinkommens, maximal Fr. 400.00 pro erwerbstätige Person»). 400 ist zugleich die
//    SKOS-Untergrenze für eine Vollanstellung. Bis 25.09.2026 galt «400 + 33 % über 400, höchstens
//    700». Das war eine eigene, unbelegte Abstufung: 700 schon ab 1309 Fr. Lohn, und unter 400 Fr.
//    Lohn ein Freibetrag über dem Lohn (Fachprüfung swiss-precision zu PR #389).
//    🟡 UNSICHER bleibt: Andere Kantone geben mehr (bis 700) oder rechnen nach Pensum. Die Anzeige
//    nennt den Betrag deshalb «geschätzt». Lernende nehmen viele Kantone vom EFB aus (D.2 Erl. b);
//    das ist hier nicht abgebildet.
//
// 3. Freibetrag beim EINTRITT (ob überhaupt ein Anspruch entsteht). Laut C.2 Abs. 3 «können» EFB bei
//    der materiellen Grundsicherung berücksichtigt werden. D.2 Erl. c empfiehlt, sie «sowohl bei der
//    Eintritts- als auch bei der Austrittsberechnung» zu zählen. Die Kantone halten es verschieden,
//    zwei sind belegt:
//      ZH  zählt beim Eintritt keinen EFB (Sozialhilfehandbuch ZH 6.2.05, Stand 1.3.2024: «weder
//          Integrationszulagen noch Einkommensfreibeträge»)
//      BS  nimmt beim Eintritt 200 Fr. pro erwerbstätige Person nicht als Einnahme, höchstens 400 Fr.
//          pro Einheit (URL WSU 2026, Ziff. 4.3). Hier zählt nur die eigene Erwerbstätigkeit, also
//          höchstens 200 Fr.
//    Alle anderen Kantone: nicht belegt. Wir rechnen den Eintritt deshalb vorsichtig OHNE Freibetrag.
//    Ergäbe erst der Freibetrag einen Anspruch, meldet `efbEntscheidet` das («möglich, der Kanton
//    entscheidet»). Steht der Anspruch einmal, zählt der Freibetrag für den Betrag (D.2 Abs. 1).

const EFB_ANTEIL = 1 / 3;
const EFB_MAX = 400;
export const EFB_PARAMS = { anteil: EFB_ANTEIL, max: EFB_MAX };

// Kantone, deren Regel für den Eintritt belegt ist (Quellen oben).
const EINTRITT_ABZUG = { ZH: () => 0, BS: (erwerb) => Math.min(200, erwerb) };

// Nie höher als das Erwerbseinkommen selbst (ein Drittel davon, höchstens 400).
export function einkommensfreibetrag(erwerbseinkommen) {
  const e = Number(erwerbseinkommen) || 0;
  if (e <= 0) return 0;
  return Math.min(Math.round(e * EFB_ANTEIL), EFB_MAX);
}

// Erwerbstätig heisst: Anstellungstyp angestellt, selbstständig oder freiberuflich. Ist kein
// Anstellungstyp gewählt, zählt ein eingetragener Arbeitgeber. «Rentner» geht vor einem
// liegen gebliebenen Arbeitgeber. Dieselbe Regel gilt für die Vorbefüllung des Rechners.
const ERWERBSTAETIG = ['employed', 'selfEmployed', 'freelance'];
export function istErwerbstaetig(finanzen) {
  const typ = finanzen?.employmentType;
  if (typ) return ERWERBSTAETIG.includes(typ);
  return typeof finanzen?.employer === 'string' && finanzen.employer.trim() !== '';
}

const plus = (v) => Math.max(0, Number(v) || 0);

// Alle Beträge monatlich und netto.
//   grundbedarf, wohnkosten, kvgPraemie  schon fertig bemessen (Wohnform, Mietzinslimite usw.
//                                        macht der jeweilige Rechenweg vorher)
//   erwerbsunkosten                      belegte Mehrkosten der Arbeit (C.6.3); ohne Angabe 0
//   erwerbseinkommen / andereEinkuenfte  der Freibetrag gilt nur auf das Erwerbseinkommen
//   kanton                               für die belegten Eintrittsregeln (ZH, BS)
export function sozialhilfeBilanz({
  grundbedarf = 0,
  wohnkosten = 0,
  kvgPraemie = 0,
  erwerbsunkosten = 0,
  erwerbseinkommen = 0,
  andereEinkuenfte = 0,
  erwerbstaetig = false,
  kanton = '',
}) {
  const eu = plus(erwerbsunkosten);
  const erwerb = plus(erwerbseinkommen);
  const bedarf = plus(grundbedarf) + plus(wohnkosten) + plus(kvgPraemie) + eu;
  const efb = erwerbstaetig && erwerb > 0 ? einkommensfreibetrag(erwerb) : 0;
  const totalEinkommen = erwerb + plus(andereEinkuenfte);
  const anrechenbaresEinkommen = Math.max(0, totalEinkommen - efb);
  // Eintritt: ohne Freibetrag, ausser eine Kantonsregel ist belegt.
  const regel = EINTRITT_ABZUG[kanton];
  const eintrittsAbzug = regel && erwerbstaetig ? regel(erwerb) : 0;
  const eintritt = bedarf - (totalEinkommen - eintrittsAbzug) > 0;
  const lueckeMitEfb = Math.max(0, bedarf - anrechenbaresEinkommen);
  const luecke = eintritt ? lueckeMitEfb : 0;
  return {
    bedarf,
    erwerbsunkosten: eu,
    efb,
    totalEinkommen,
    anrechenbaresEinkommen,
    luecke,
    // Kein Anspruch ohne Freibetrag, aber einer mit: in einem Kanton ohne belegte Regel offen.
    efbEntscheidet: !eintritt && !regel && lueckeMitEfb > 0,
  };
}
