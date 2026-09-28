// Prämienverbilligung (IPV) Kanton Solothurn — Richtprämie minus linearer Eigenanteil, Jahr 2026 (K31).
// Auf dem gemeinsamen Rahmen (config/kantonsModell.js).
//
// 🛑 SOLOTHURN ZEIGT HEUTE FÜR KEINE PERSON EINEN BETRAG — nur «kein Anspruch» dort, wo er sicher
// ist. Der Grund: wie die lineare Eigenanteil-Skala verläuft, steht nirgends (siehe unten).
//
// Belege (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt SO:
//   [1] Departement des Innern, «Parameter für die Prämienverbilligung 2026 — Vorgaben vom
//       27. Januar 2026» (AKSO-PDF): Vermögensanteil 50 %, Eigenanteile «10% bis 16%»,
//       Einkommensgrenzwert Erwachsene 74'000, Grenzwert Kinder 80 % / junge Erwachsene 50 %
//       74'000, Auszahlungslimite 240 je erwachsene Person, Richtprämien 422 / 305 / 98.
//   [2] Sozialverordnung (SV), BGS 831.2, «Aktuelle Version in Kraft seit: 01.04.2026
//       (Beschlussdatum: 26.01.2026)». § 68: Richtprämie = Durchschnittsprämie minus 10 % (± 20 %);
//       § 69 Abs. 1: massgebendes Einkommen; § 70: Anspruch, lineare Eigenanteile, Auszahlungs-
//       limite, Kinder 80 %; § 71: Sonderfälle.
//   [3] Sozialgesetz (SG), BGS 831.1, «in Kraft seit: 01.09.2026 bis: 31.12.2026». § 87: Anspruch,
//       Gesamtanspruch, Verhältnisse am 1. Januar; § 89: massgebendes Einkommen, Ermessens-
//       veranlagte ohne Anspruch; § 90 Abs. 2: Nachvergütung/Rückerstattung; § 91: Auszahlung.
//   [4] Regierungsrat, Botschaft SGB 0226/2025 (RRB Nr. 2025/1755, 28.10.2025), Tabelle 1: «Die
//       monatlichen Durchschnittsprämien 2026 … Erwachsene 602.00, Junge Erwachsene 435.00, Kinder
//       139.00» und «Der Abschlag wird auf 30% festgelegt.» — damit ist die EINHEIT der
//       Richtprämien in [1] geklärt: 422 / 305 / 98 sind MONATSbeträge (602 × 70 % = 421.40).
//   [5] AKSO, Merkblatt IPV 2026 (PDF 18.12.2025): Jahrgänge junge Erwachsene 2001–2007,
//       Antrag innert 30 Tagen, Auszahlung rückwirkend per 1. Januar an die Krankenkasse,
//       «nur die effektive Prämie verbilligt».
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die Summe der Richtprämien, soweit sie einen Eigenanteil am massgebenden
// Einkommen übersteigt; der Eigenanteil liegt 2026 zwischen 10 und 16 Prozent und steigt
// «abhängig von der Höhe des massgebenden Einkommens … linear» (§ 70 Abs. 1 [2]).
//
// 🛑 DIE ECKPUNKTE DER SKALA SIND NICHT VERÖFFENTLICHT
// [1] nennt nur «10% bis 16%», [2] nur «im Rahmen von 6 bis 12% linear» (± 4 %). Bei welchem
// Einkommen 10 % gelten und bei welchem 16 %, steht in keiner Quelle — naheliegend wäre 0 und der
// Grenzwert 74'000, aber das ist eine Lesart, kein Wortlaut. Der Unterschied ist gross: bei 30'000
// massgebendem Einkommen liegt der Eigenanteil je nach Lesart zwischen 3'000 und 4'800 Franken.
// Den Online-Rechner der AKSO (serverseitig) füttern wir nicht. Darum keine Zahl
// (`soSkalaUnklar`), ausser wo KEIN Anspruch sicher ist — gleich welcher Satz zwischen 10 und 16 %:
//   · ohne Kinder, sobald schon 10 % des Einkommens die Richtprämie erreichen
//     (422 × 12 / 10 % = 50'640);
//   · immer über dem Grenzwert 74'000 (§ 70 Abs. 1/4 [2] mit [1]).
//
// BEWUSST NICHT GEBAUT:
//   · Paare/gemeinsam Besteuerte (§ 87 Abs. 2 [3]) und Konkubinat mit Kindern ([5]: beide Einkommen).
//   · junge Erwachsene (Jg. 2001–2007) — in Ausbildung mit den Eltern ([5]).
//   · Quellenbesteuerte (§ 71 Abs. 1 [2], eigenes Reglement BGS 832.215), EL (§ 71 Abs. 2),
//     Sozialhilfe (§ 71 Abs. 3), Härtefälle (§ 71 Abs. 4), Ermessensveranlagte (§ 89 Abs. 3 [3]).
//   · vom massgebenden Einkommen: Pension zu 100 %, Kapitalabfindungen, Geschäftsverluste,
//     Zuwendungen, Liegenschaftskosten (§ 69 Abs. 1 lit. a–d, f [2]) — die App erfasst sie nicht.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr,
  jahrVorbei, mehrereErwachsene, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18,
  ergebnisOhneAnspruch,
} from './kantonsModell.js';
import { saeule3aMaximum } from '../data/saeule3a.js';

// Werte 2026, wörtlich aus [1]. Richtprämien als MONATSbeträge wie in der Quelle ([4] klärt die
// Einheit); Jahresbeträge entstehen erst in der Rechnung (× 12).
export const IPV_SO = {
  jahr: 2026,
  // [1] Ziff. 6–8: «Richtprämie Erwachsene: 422.- Franken (Durchschnittsprämie 602.- Franken)» ·
  // junge Erwachsene 305.- (435.-) · Kinder 98.- (139.-).
  richtpraemieMonat: { e: 422, j: 305, k: 98 },
  // [1] Ziff. 2: «Eigenanteile in % des massgebenden Einkommens: 10% bis 16%».
  eigenanteil: { von: 0.10, bis: 0.16 },
  // [1] Ziff. 3/4: Einkommensgrenzwert Erwachsene und für die 80-%-Verbilligung der Kinder.
  grenzwert: 74000,
  // [1] Ziff. 1: «Anteil des satzbestimmenden Vermögens: 50%».
  vermoegenAnteil: 0.50,
  // [1] Ziff. 5: «Auszahlungslimite pro erwachsene Person: 240.- Franken» (§ 70 Abs. 3 [2]: je
  // Anspruchsjahr).
  auszahlungslimite: 240,
  // § 70 Abs. 4 [2]: Kinder «um mindestens 80%».
  mindestanteilKind: 0.8,
};

// Die Spanne, in der der Betrag liegen MUSS, gleich wie die Skala verläuft: mit dem tiefsten
// (10 %) und dem höchsten (16 %) Eigenanteil gerechnet. Reine Rechnung ohne App-Daten.
// `personen`: 'e' | 'j' | 'k'; `me` = massgebendes Einkommen im Jahr.
export function ipvSolothurnSpanne({ personen, me }) {
  const p = IPV_SO;
  const summe = personen.reduce((s, c) => s + p.richtpraemieMonat[c] * 12, 0);
  const me0 = Math.max(0, me);
  const betrag = (satz) => Math.max(0, Math.round((summe - satz * me0) * 100) / 100);
  return {
    summe,
    hoechstens: me0 > p.grenzwert ? 0 : betrag(p.eigenanteil.von),
    mindestens: me0 > p.grenzwert ? 0 : betrag(p.eigenanteil.bis),
    ueberGrenzwert: me0 > p.grenzwert,
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für SO mit Beleg. Keine Prämienregion (BAG: eine
// Region; die Richtprämie ist kantonal, § 88 [3]) — `brauchtPLZ: false`.
export function ipvSolothurn(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const p = IPV_SO;
  const jahr = p.jahr;
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // [5]: junge Erwachsene «(Jahrgänge 2001 - 2007)» — erwachsen ist, wer im Anspruchsjahr 26 wird.
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung('alter');
  // § 68 [2]: Kinder «bis zum vollendeten 18. Altersjahr»; eingetipptes Alter +1 wie LU.
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');
  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');

  // § 69 Abs. 1 lit. e [2]: 3a aufgerechnet «maximal bis zur Höhe des zulässigen Höchstabzuges
  // gemäss Art. 7 Absatz 1 Buchstabe a … BVV 3» — dieselbe Regel wie BE (`bisBundesMaximum`).
  // Massgebend ist die letzte rechtskräftige Veranlagung (§ 89 Abs. 1 [3]); im Regelfall 2024
  // ([5] fragt nach dem Einkommen 2025 «gegenüber dem Jahr 2024»).
  const jahre = { bemessungsjahr: jahr - 2, anspruchsjahr: jahr };
  const regel = SAEULE_3A.bisBundesMaximum;
  if (regel.maximumFuer(jahre.bemessungsjahr) === null) return orientierung('jahr');
  if (regel.widerlegt(f, rohesEinkommenJahr(f), jahre)) return orientierung('saeule3aUeberEinkommen');
  // § 69 Abs. 1 lit. g [2] mit [1] Ziff. 1: 50 % des satzbestimmenden Vermögens.
  const me = Math.max(0, einkommenJahr(f, regel, jahre) + p.vermoegenAnteil * vermoegenSumme(f));
  // Die Regel zieht erst über BEIDEN Jahresmaxima ab (7'258); im Band 7'056–7'258 kann das
  // massgebende Einkommen darum um bis zu 202 Franken zu hoch sein. Für «kein Anspruch» zählt die
  // Untergrenze — so wird nie jemandem ein Anspruch abgesprochen, der an diesem Band hängt.
  const betrag3a = Math.max(0, Number(f.pension3a) || 0);
  const band = Math.max(0, Math.min(betrag3a, saeule3aMaximum(jahr)) - saeule3aMaximum(jahre.bemessungsjahr));
  const meUnten = Math.max(0, me - band);

  const kinderZahl = kinderJahre.length;
  const r = ipvSolothurnSpanne({ personen: ['e', ...kinderJahre.map(() => 'k')], me: meUnten });
  const keinAnspruchSicher = r.ueberGrenzwert || (kinderZahl === 0 && r.hoechstens <= 0);
  if (!keinAnspruchSicher) return orientierung('soSkalaUnklar');
  return ergebnisOhneAnspruch({
    canton: 'SO', cantonData: { ...ipvData, maxIncome: null }, jahr,
    vorbehaltKey: 'ipv.vorbehaltSO', noteKey: 'ipv.soKeinAnspruch',
    extra: { jahrKey: 'ipv.jahrEineRegion' },
  });
}
