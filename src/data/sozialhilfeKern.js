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
//    «sind zu übernehmen». Sie sind grundversorgende SIL und zählen deshalb schon beim Eintritt.
//    Übernommen werden die BELEGTEN Kosten, eine SKOS-Pauschale gibt es nicht. Deshalb rechnen wir
//    nur mit einem eingetragenen Betrag und schätzen nie. Der Nahverkehr steckt schon im Grundbedarf
//    (C.6.1 Erl. d): gemeint sind nur die Mehrkosten, die darüber hinausgehen.
//    Laut C.6.3 Erl. a werden sie nicht mit dem Freibetrag verrechnet (beides zählt nebeneinander).
//
// 2. Einkommensfreibetrag (EFB, SKOS-RL D.2). Er gilt nur für Erwerbseinkommen aus dem ersten
//    Arbeitsmarkt. Laut Abs. 3 beträgt er «400 bis 700 Franken pro Monat für eine Vollanstellung».
//    Den Betrag innerhalb dieser Spanne legt der Kanton fest.
//    🟡 UNSICHER — die Höhe: die Formel unten (400 + 33 % über 400, höchstens 700) ist UNSERE
//    Abstufung innerhalb der SKOS-Spanne, keine SKOS-Formel und keine eines belegten Kantons. Sie
//    richtet sich nach dem Einkommen, nicht nach dem Pensum. Zum Vergleich BS (Unterstützungs-
//    richtlinien WSU, gültig ab 1.1.2026, Ziff. 12.1): ein Drittel des Nettoeinkommens, höchstens
//    400 Fr. pro erwerbstätige Person. Unsere Zahl liegt dort also eher zu hoch.
//    🟡 UNSICHER — ob er schon beim Eintritt zählt: laut C.2 Abs. 3 «können» die Kantone ihn
//    berücksichtigen, und D.2 Erl. c empfiehlt, ihn «sowohl bei der Eintritts- als auch bei der
//    Austrittsberechnung» zu zählen. Zürich zählt ihn beim Eintritt NICHT (Sozialhilfehandbuch ZH
//    6.2.05, Stand 1.3.2024). Basel-Stadt nimmt beim Eintritt stattdessen 200 Fr. pro erwerbstätige
//    Person, höchstens 400 Fr. pro Einheit, nicht als Einnahme (URL WSU 2026, Ziff. 4.3). Wir folgen
//    der SKOS-Empfehlung. Kippt aber erst der Freibetrag das Ergebnis auf «Anspruch», meldet
//    `efbEntscheidet` das, und die Anzeige sagt, dass der Kanton hier entscheidet.

const EFB_PAUSCHAL = 400;
const EFB_ANTEIL = 0.33;
const EFB_MAX = 700;
export const EFB_PARAMS = { pauschal: EFB_PAUSCHAL, anteil: EFB_ANTEIL, max: EFB_MAX };

export function einkommensfreibetrag(erwerbseinkommen) {
  if (erwerbseinkommen <= 0) return 0;
  const efb = EFB_PAUSCHAL + (erwerbseinkommen - EFB_PAUSCHAL) * EFB_ANTEIL;
  return Math.min(Math.max(0, Math.round(efb)), EFB_MAX);
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
export function sozialhilfeBilanz({
  grundbedarf = 0,
  wohnkosten = 0,
  kvgPraemie = 0,
  erwerbsunkosten = 0,
  erwerbseinkommen = 0,
  andereEinkuenfte = 0,
  erwerbstaetig = false,
}) {
  const eu = plus(erwerbsunkosten);
  const erwerb = plus(erwerbseinkommen);
  const bedarf = plus(grundbedarf) + plus(wohnkosten) + plus(kvgPraemie) + eu;
  const efb = erwerbstaetig && erwerb > 0 ? einkommensfreibetrag(erwerb) : 0;
  const totalEinkommen = erwerb + plus(andereEinkuenfte);
  const anrechenbaresEinkommen = Math.max(0, totalEinkommen - efb);
  const luecke = Math.max(0, bedarf - anrechenbaresEinkommen);
  return {
    bedarf,
    erwerbsunkosten: eu,
    efb,
    totalEinkommen,
    anrechenbaresEinkommen,
    luecke,
    // Anspruch nur MIT Freibetrag: ob der Kanton ihn beim Eintritt zählt, ist offen (siehe oben).
    efbEntscheidet: luecke > 0 && bedarf - totalEinkommen <= 0,
  };
}
