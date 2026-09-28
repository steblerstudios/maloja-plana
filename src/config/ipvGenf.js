// Prämienverbilligung (IPV) Kanton Genf — «subsides d'assurance-maladie», Jahr 2026 (K31).
// Sechster Kanton auf dem gemeinsamen Rahmen (config/kantonsModell.js), Bauart wie BE: eine
// amtliche Gruppentabelle mit festen Monatsbeträgen, nicht eine Formel.
//
// Belege (an der Quelle gelesen 28.09.2026, jeder Abruf mit Gegenprobe — erfundene Nummer liefert
// 404 bzw. eine andere Datei), Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt GE:
//   [1] «BAREME SUBSIDES 2026», République et canton de Genève, Département de la cohésion sociale,
//       Dokumentseite «Barèmes et catégories 2026 pour les subsides d'assurance-maladie»
//       (Date de publication 21 avril 2026; PDF-Metadaten: erstellt 11.02.2026). Eine Seite, Textlayer
//       vorhanden — die Zahlen sind maschinell gelesen, nicht vom Bild. Enthält je Haushaltsform
//       ALLE Gruppengrenzen und die Haushaltssummen: das ist der Prüfstein der Tests.
//   [2] Loi d'application de la loi fédérale sur l'assurance-maladie (LaLAMal), rsGE J 3 05,
//       «Dernières modifications au 2 novembre 2024». Art. 20 (ayants droit, Vermutungen),
//       Art. 21 (Gruppengrenzen, +6'000 je Unterhaltspflicht, Gruppe 9), Art. 22 (Beträge — die
//       Gesetzesbeträge Stand Dezember 2024, seither indexiert; Abs. 4 Deckel auf die effektive
//       Prämie), Art. 23 (Verfahren: Liste der Steuerverwaltung, «dernière taxation», Anspruch für das
//       kommende Kalenderjahr), Art. 33 (Rückerstattung zu Unrecht bezogener Subsidien).
//   [3] Règlement d'exécution (RaLAMal), rsGE J 3 05.01, «Dernières modifications au 1er janvier
//       2025». Art. 9 (RDU der Ehegatten, eingetragenen Partner und Konkubinatspaare mit
//       gemeinsamem Kind werden addiert), Art. 9A (negativer RDU = 0), Art. 9B (jährliche
//       Indexierung durch Arrêté, aufgerundet auf den Franken), Art. 10 (Vermutung «nicht bescheiden»:
//       Bruttovermögen > 250'000, Bruttoeinkommen > 200'000, RDU unter 15'000/20'000 +3'000 je
//       Unterhaltspflicht; Abs. 8: «Pour l'application de l'alinéa 7, est déterminant l'âge de
//       l'assuré le 1er janvier» — gilt dem Wortlaut nach nur für junge Erwachsene), Art. 10A
//       (Antragsfälle: vor dem 30. November des Anspruchsjahres, danach kein Eintreten), Art. 11D
//       (letzte Veranlagung; Abs. 2: bei Zustellung der Veranlagung nach dem 30.11. Antrag bis 31.12.),
//       Art. 13B (Verschlechterung: «durablement» = mehr als 6 Monate, «notablement» = RDU −20 %;
//       schriftlich, vor dem 30.11., bei Verschlechterung im 2. Halbjahr bis 30.06. des Folgejahres),
//       Art. 13C (zusätzliches minderjähriges Kind im Laufe des Jahres: schriftlicher Antrag, Fristen
//       wie 13B Abs. 5), Art. 13D (13B gilt auch für die Vermutungsfälle nach Art. 20 Abs. 2/3), Art. 13E
//       (Verbesserung sofort melden; ab +10'000 über dem aktualisierten RDU gilt der Subside als zu
//       Unrecht bezogen). ⟨Fachprüfung 28.09.2026: 13B–13E fehlten in der ersten Fassung.⟩
//   [4] Loi sur le revenu déterminant unifié (LRDU), rsGE J 4 06, «Dernières modifications au
//       1er janvier 2025». Art. 4 (Einkünfte), Art. 5 (Abzüge), Art. 6/7 (Vermögen, Schulden),
//       Art. 8 Abs. 2 (Sockel = Einkommen + 1/15 des Vermögens), Art. 9 Abs. 1 (aus der letzten
//       definitiven Veranlagung), Art. 10 (Aktualisierung bei veränderter Lage: «annoncés et
//       justifiés par l'intéressé»).
//   [5] ge.ch, «Demander un subside d'assurance-maladie 2026» (SAM), Stand 9. Juli 2026: «en principe
//       accordé automatiquement sur la base du revenu d'il y a deux ans»; Liste der Antragsfälle.
//       Unterseite «Revenus 2024 (RDU 2026) particulièrement bas» (Stand 18.09.2026) mit der Tabelle
//       der Untergrenzen: «Personne seule 15'000 · avec 1 enfant 18'000 · 2 enfants 21'000 · 3 enfants
//       24'000 · 4 enfants 27'000 · Couple seul sans enfant 20'000 · avec 1 enfant 23'000 …», Frist
//       «avant le 30 novembre 2026». Unterseite «Revenu brut sup. à 200'000 ou fortune brute sup. à
//       250'000» (18.09.2026): «Revenu déterminant 2026 = (revenu brut 2024 * 0.95) + (fortune brute
//       2024 /15)», Antrag per Brief vor dem 30. November 2026.
//   [6] ge.ch, «Communiqué hebdomadaire du Conseil d'Etat du 5 novembre 2025» — «Indexation des subsides
//       d'assurance-maladie pour 2026», «indice de base: 2024»: adultes 8,7 %, jeunes adultes 5,3 %,
//       enfants 10,9 %, mit Tabelle aller Beträge 2024 → 2026 (320 → 348 … 50 → 55; 100 → 106; 60 → 67).
//       Das ist der Arrêté-Beleg, der am Nachmittag noch fehlte.
//   [7] Loi sur l'imposition des personnes physiques (LIPP), rsGE D 3 08, Stand 01.01.2026:
//       Art. 18 Abs. 1 (unselbständiges Erwerbseinkommen «y compris … les allocations»), Art. 26
//       lit. e (erhaltene Alimente und Kinderunterhaltsbeiträge), Art. 29 Abs. 2 (Berufskosten
//       pauschal «3% du revenu … minimum de 600 francs et … maximum de 1 700 francs»), Art. 31
//       (Vorsorgeabzüge — für die Frage, ob die Säule 3a im RDU abziehbar ist).
//   (Nummerierung wie im Quellenblatt docs/sources/ipv-kantone-2026.md, Abschnitt GE.)
//
// DAS MODELL IN EINEM SATZ
// Der Kanton ordnet den Haushalt nach seinem RDU (revenu déterminant unifié: Einkommen plus ein
// Fünfzehntel des Vermögens, aus der Veranlagung von vor zwei Jahren) einer von acht Gruppen zu
// und zahlt je erwachsene Person den festen Monatsbetrag dieser Gruppe, je Kind 132 Franken;
// über Gruppe 8 gibt es bis zu einer neunten Grenze nur noch den Kinderbeitrag (67 Franken).
//
// VIER DINGE, DIE GENF VON DEN BISHERIGEN KANTONEN UNTERSCHEIDEN
//
// 1. KEINE PRÄMIENREGION, KEINE RICHTPRÄMIE. Die Beträge sind kantonsweit gleich [1]; die Prämie
//    geht nur als Deckel ein (Art. 22 Abs. 4 [2]). Darum `brauchtPLZ: false` im Register und ein
//    eigener Satz statt «Prämienregion» in der Anzeige (`ipv.jahrGE`).
//
// 2. DIE GRENZEN HÄNGEN AN DER HAUSHALTSFORM, NICHT NUR AN DER ZAHL DER PERSONEN. Art. 21 Abs. 1 [2]
//    kennt zwei Spalten («assuré seul» und «couple»), Abs. 2 hebt jede Grenze um 6'000 je
//    Unterhaltspflicht, und Abs. 4 stellt eine Person MIT Unterhaltspflicht einem Paar gleich. Eine
//    alleinerziehende Person mit einem Kind rechnet also mit den Paar-Grenzen plus 6'000 — das
//    Barème [1] bestätigt es Zelle für Zelle (Gruppe 1: 45'000 + 6'000 = 51'000).
//
// 3. GRUPPE 9 IST EINE GRUPPE NUR FÜR KINDER. Wer über der Grenze von Gruppe 8 liegt, erhält für
//    sich nichts mehr, für jedes minderjährige Kind aber noch 67 Franken im Monat, bis zu 151'000
//    (Paar oder Person mit EINER Unterhaltspflicht) plus 6'000 je weitere (Art. 21 Abs. 5, 7, 8 [2]).
//    Die Anzeige sagt das dazu (`ipv.geNurKinder`), sonst stünde da «CHF 67» ohne Grund.
//
// 4. DIE GESETZESBETRÄGE STEHEN NICHT IM GESETZ. Art. 22 [2] nennt 320 … 50 Franken (Stand Dezember
//    2024); Art. 9B [3] lässt sie jährlich per Arrêté indexieren und auf den Franken aufrunden. Die
//    Beträge 2026 (348 … 55) stehen im Barème [1] und im Communiqué des Conseil d'Etat vom
//    5.11.2025 [6]: drei Indexsätze auf Basis 2024 — Erwachsene 8,7 %, junge Erwachsene 5,3 %,
//    Kinder 10,9 % —, jeder Betrag aufgerundet (320 × 1,087 = 347.84 → 348 · … · 50 × 1,087 = 54.35
//    → 55 · 100 × 1,053 = 105.3 → 106 · 60 × 1,109 = 66.54 → 67); der Test rechnet alle zehn nach.
//    ⟨28.09.2026 abends: am Nachmittag stand hier «Arrêté nicht gefunden» und ein Faktor 1,0875 für
//    die Erwachsenen — das Communiqué [6] fand die Cockpit-Sitzung, und es erklärt auch Gruppe 9.⟩
//
// SÄULE 3A — WARUM HIER DIE REGEL `voll` GILT, AUS EINEM ANDEREN GRUND ALS IN ZH/SG/LU
// Dort rechnet der Kanton die 3a dem Steuereinkommen wieder ZU. In Genf wird sie im RDU gar nicht
// erst ABGEZOGEN: LRDU Art. 5 Abs. 1 [4] nennt die Vorsorgeabzüge nach «article 31, lettre a, LIPP»
// (lit. a: AHV/IV/EO/ALV/UVG-Beiträge) und «article 31, lettre b, LIPP» (lit. c: berufliche
// Vorsorge) — nicht Art. 31 lit. c LIPP [7], die gebundene Selbstvorsorge. Das Nettoeinkommen der
// App trägt die 3a bereits (Block bei `einkommenJahr` in kantonsModell.js); für Genf ist das genau
// richtig, Abzug 0.
//
// WAS DER RDU DER APP SONST NOCH ENTHÄLT — UND WAS IHM FEHLT (Fachprüfung 28.09.2026: die erste
// Fassung nahm nur Lohn, Nebenerwerb und Renten und behauptete, alle Auslassungen wirkten in
// dieselbe Richtung; beides war falsch):
//   − Berufskosten pauschal 3 % des Hauptlohns, mindestens 600, höchstens 1'700 — LIPP Art. 29
//     Abs. 2 [7] via LRDU Art. 5 Abs. 1 lit. d [4]. Deterministisch und nur Genf, also hier gebaut.
//     Die Pauschale gilt «du revenu brut après les déductions prévues à l'article 31, lettres a et
//     b» — das Netto der App liegt etwas darunter, der Abzug fällt darum minimal zu klein aus
//     (Richtung: RDU zu hoch). Ohne die Pauschale sah eine Person mit 15'000–15'600 Netto
//     «automatisch», obwohl ihr RDU unter 15'000 liegt und sie beantragen muss. Für den Nebenerwerb
//     gälte LIPP Art. 29A (20 %, 800–2'400) — nicht gebaut, Richtung: RDU zu hoch.
//   + Vermögen: die drei erfassten Posten (vermoegenSumme) plus `pension3bBalance` — LRDU Art. 6
//     lit. f [4] («assurances-vie … pour leur valeur de rachat»); das 3a-Kapital bleibt draussen
//     (lit. g). Was fehlt: Schulden (Art. 7 lit. b) — Richtung: RDU zu hoch.
//   🛑 FAMILIENZULAGEN, ERHALTENE UND BEZAHLTE ALIMENTE, KINDERBETREUUNG — erfasst, hier NICHT
//     gerechnet, Richtung GEMISCHT. Belegt für Genf: Familienzulagen zählen zum Erwerbseinkommen
//     (LIPP Art. 18 Abs. 1 [7] «y compris … les allocations»), erhaltene Alimente sind Einkommen
//     (LRDU Art. 4 Abs. 1 lit. c [4], LIPP Art. 26 lit. e) — beides HEBT den RDU; bezahlte
//     Unterhaltsbeiträge (LRDU Art. 5 lit. f) und Kinderbetreuung (lit. e, LIPP Art. 35) sind
//     abziehbar — beides SENKT ihn. Dasselbe fehlt in JEDEM Kantonsmodul (`rohesEinkommenJahr` in
//     kantonsModell.js liest die Felder nicht; Befund in UR, GE, VS, NE, SO gleich). Ruling der
//     Runde 28.09.2026: nicht in den Kantons-PRs rechnen, sondern EIN Rahmen-PR nach den Merges und
//     vor dem Deploy, mit benannter Regel je Kanton — sonst 20 verschiedene Umsetzungen. Für Genf
//     ist die Regel mit den Belegen hier vorbereitet. Bis dahin nennt der Vorbehalt (`ipv.vorbehaltGE`)
//     die Posten als erfasst, aber nicht gerechnet. ⟨Zwischen 18:53 und 20:30 rechnete dieses Modul
//     Alimente und Familienzulagen selbst (`5d6f8373`) — zurückgebaut wegen des Rulings.⟩
//   Es fehlen weiter: Krankheitskosten über 5 % (Art. 5 lit. h) — Richtung: RDU zu hoch.
//
// BEWUSST NICHT GEBAUT (die Angabe fehlt der App, oder der Weg ist ein anderer):
//   · Paare, eingetragene Partnerschaften und Konkubinat mit gemeinsamem Kind — Art. 9 [3] addiert
//     die RDU; das zweite Einkommen kennt die App nicht. Konkubinat OHNE gemeinsames Kind rechnet
//     amtlich jede Person für sich, doch das Kind kann die App nicht zuordnen — darum dasselbe Nein.
//   · junge Erwachsene (Jahrgänge 2001–2007 [1]; Art. 20 Abs. 3 lit. b [2]): eigener Betrag 231
//     bzw. 106 Franken, bei gemeinsamem Wohnsitz mit den Eltern oder eigenem RDU unter 15'000
//     gerechnet mit dem RDU der Eltern PLUS dem eigenen, als zusätzliche Unterhaltspflicht der
//     Eltern (Art. 10 Abs. 7 lit. a/b [3]) — NUR AUF ANTRAG, vor dem 30. November (Art. 10A [3]).
//     Darum ein eigener Grund `geJungeErwachsene`, der die Frist nennt — als eigene Person wie als
//     Kind über 18 im Haushalt (Art. 21 Abs. 6 [2]). ⟨Fachprüfung 28.09.2026: vorher `alter` bzw.
//     `haushalt`, und die Person las «Für die Rechnung fehlt ein Geburtsdatum», obwohl es da war.⟩
//   · Quellenbesteuerte (Art. 24 [2], Art. 12 [3]: Antrag, RDU nach Art. 9 Abs. 2 LRDU), Zuzug 2025/26
//     (Art. 25 [2]), EL- und Sozialhilfe-Beziehende (Art. 22 Abs. 7–9 [2]: Durchschnittsprämie),
//     Grenzgängerinnen und im Ausland Wohnende (Art. 24A [2]), Ermessensveranlagte (Art. 27 lit. b).
//   · das Bruttoeinkommen über 200'000 (Art. 10 Abs. 2 [3]): die App kennt das Brutto nicht sicher.
//     Wer so viel verdient, liegt mit dem Netto ohnehin über jeder Grenze (169'000 mit vier Kindern
//     im Barème; die App rechnet nach Art. 21 Abs. 8 auch mit mehr Kindern weiter, +6'000 je Kind)
//     — die Vermutung ändert für die Anzeige nichts.
//   · Wohneigentum: LRDU Art. 6 lit. a [4] zählt «tous les immeubles» zum Vermögen, RaLAMal Art. 10
//     Abs. 1 [3] zum Bruttovermögen nach Steuerwert ohne das Abattement — die Hypothek zählt dort
//     nicht dagegen. Die App kennt nur `propertyValue` (Verkehrswert, nicht Steuerwert) und
//     `mortgageStatus`. Mit Liegenschaft liegt das Bruttovermögen meist über 250'000 ⇒ Antrag nötig
//     (Art. 20 Abs. 2 [2]); darum KEINE Zahl, sondern `wohneigentumGE`. Eine erfasste Hypothek gilt
//     als Eigentum auch ohne Wert (GEWÄHLT: ohne Liegenschaft keine Hypothek; warnt eher zu oft).
//     (Fachprüfung W2 und Fixrunde `feb5d7e1`, übernommen.)
//   · die Neuberechnung bei Verschlechterung (Art. 13B [3]) — die App rechnet mit dem heutigen
//     Einkommen, nicht mit dem RDU 2024, und kann darum nicht sagen, ob −20 % vorliegen; die
//     Bedingungen und Fristen stehen im Vorbehalt (`ipv.vorbehaltGE`).
//   · Rundung des RDU: ob der SAM auf ganze Franken rundet, sagt keine Quelle; die App vergleicht
//     ungerundet («30'000.50 ist über 30'000»). GEWÄHLT, folgenlos ausser genau an der Grenze.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';
import { hauptlohnMonate } from '../utils/dreizehnter.js';

// Werte 2026, wörtlich aus [1], [2] und [3]. Grenzen sind Jahresbeträge des RDU, Beträge Monatsbeträge.
export const IPV_GE = {
  jahr: 2026,
  // Art. 21 Abs. 1 lit. a–h [2], in der Reihenfolge der Gruppen 1–8. Barème [1]: «0 à 30'000»,
  // «30'001 à 35'000» … — die Grenze gehört also noch zur unteren Gruppe.
  grenzen: {
    allein: [30000, 35000, 37500, 40000, 42500, 45000, 47500, 50000],
    paar: [45000, 55000, 65000, 75000, 85000, 95000, 105000, 115000],
  },
  // Art. 21 Abs. 2 [2]: «Ces limites sont majorées de 6 000 francs par charge légale.»
  // Art. 21 Abs. 4 [2]: «Une personne assumant une charge légale est assimilée à un couple.»
  jeUnterhaltspflicht: 6000,
  // Art. 21 Abs. 7 [2]: «151 000 francs (Groupe 9)» für «un assuré seul ou un couple avec une
  // charge légale»; Abs. 8: «majorée de 6 000 francs par charge légale supplémentaire».
  gruppe9: { grenze: 151000, jeWeitere: 6000 },
  // Barème [1], Zeile «Subside mensuel adulte», Gruppen 1–8. (Gesetz Art. 22 Abs. 1 [2], Stand
  // Dezember 2024: 320 / 270 / 220 / 180 / 150 / 110 / 80 / 50 — indexiert nach Art. 9B [3].)
  erwachsene: [348, 294, 240, 196, 164, 120, 87, 55],
  gesetzErwachsene: [320, 270, 220, 180, 150, 110, 80, 50],
  // Communiqué des Conseil d'Etat vom 5.11.2025 [6]: «adultes: 8,7% · jeunes adultes … 5,3% ·
  // enfants: 10,9%», «indice de base: 2024». Gesetzesbeträge Gruppe 9: Art. 22 Abs. 2 lit. b (60)
  // und Abs. 3 lit. b (100) [2].
  indexierung: { erwachsene: 0.087, jungeErwachsene: 0.053, kinder: 0.109 },
  gesetzGruppe9: { kind: 60, jungeErwachsene: 100 },
  // Barème [1], Zeile «Subside mensuel enfant»: 132 in den Gruppen 1–8 (Art. 22 Abs. 2 lit. a [2]:
  // 80 % der BAG-Durchschnittsprämie, aufgerundet, plus 10 Franken), 67 in Gruppe 9 (lit. b: 60
  // Franken, indexiert).
  kind: { gruppe1bis8: 132, gruppe9: 67 },
  // Barème [1], Zeile «Subside mensuel jeune adulte»: 231 / 106 — NICHT gebaut, hier nur belegt,
  // damit die Zahl nicht beim nächsten Mal neu gesucht wird.
  jungeErwachsene: { gruppe1bis8: 231, gruppe9: 106, jahrgaenge: [2001, 2007] },
  // LRDU Art. 8 Abs. 2 [4]: «augmenté d'un quinzième de la fortune».
  vermoegenAnteil: 1 / 15,
  // LIPP Art. 29 Abs. 2 [7]: «fixée forfaitairement à 3% du revenu … minimum de 600 francs et …
  // maximum de 1 700 francs» — auf das unselbständige Erwerbseinkommen.
  berufskosten: { satz: 0.03, min: 600, max: 1700 },
  // RaLAMal Art. 10 Abs. 1 [3]: Bruttovermögen «qui excède 250 000 francs» ⇒ Vermutung «nicht
  // bescheiden», Subsid nur auf begründeten Antrag (Art. 20 Abs. 2, Art. 23 Abs. 5 [2]).
  vermoegenBruttoGrenze: 250000,
  // RaLAMal Art. 10 Abs. 4/5 [3]: unter diesen RDU-Beträgen ebenfalls Vermutung «nicht bescheiden»
  // (ausser bei Sozialhilfe) ⇒ Antrag mit Nachweis der Lebenshaltung. Die Tabelle des SAM [5]
  // («Personne seule avec 1 enfant 18'000», «Couple avec 1 enfant 23'000») zeigt: die Zeile
  // «assuré seul» gilt auch für Alleinerziehende — +3'000 je Kind, NICHT die Paar-Zeile.
  antragUnter: { allein: 15000, paar: 20000, jeUnterhaltspflicht: 3000 },
  // RaLAMal Art. 10A [3]: Antragsfälle «avant le 30 novembre de l'année d'ouverture du droit».
  antragsfrist: { monat: 11, tag: 30 },
  // RaLAMal Art. 10 Abs. 3/6 [3] und ge.ch [5]: die Lage «2 ans avant l'année d'ouverture du droit».
  basisjahrAbstand: 2,
};

// Die Grenzen des Haushalts. Ohne Kinder die Spalte «assuré seul»; mit Kindern die Spalte
// «couple» (Art. 21 Abs. 4 [2]) plus 6'000 je Kind (Abs. 2). Gruppe 9 gibt es nur mit Kindern.
export function geGrenzen(kinderZahl) {
  const p = IPV_GE;
  if (kinderZahl <= 0) return { gruppen: p.grenzen.allein, gruppe9: null };
  const zuschlag = p.jeUnterhaltspflicht * kinderZahl;
  return {
    gruppen: p.grenzen.paar.map((g) => g + zuschlag),
    gruppe9: p.gruppe9.grenze + p.gruppe9.jeWeitere * (kinderZahl - 1),
  };
}

// Reine Rechnung, ohne App-Daten — testbar gegen jede Zelle des Barème [1]. `rdu` in CHF/Jahr,
// `kinderZahl` = minderjährige Kinder. Liefert Monats- und Jahresbeträge, den Anteil der
// erwachsenen Person getrennt (nur er wird auf ihre Prämie gedeckelt) und die letzte Grenze, bis
// zu der überhaupt etwas gezahlt wird (die Anzeige nennt sie als Einkommensgrenze).
export function ipvGenfRechnen({ rdu, kinderZahl = 0 }) {
  const p = IPV_GE;
  // RaLAMal Art. 9A [3]: ein negativer RDU «est considéré comme équivalent à zéro».
  const rdu0 = Math.max(0, rdu);
  const { gruppen, gruppe9 } = geGrenzen(kinderZahl);
  const grenze = gruppe9 ?? gruppen[gruppen.length - 1];
  const idx = gruppen.findIndex((g) => rdu0 <= g);
  const gruppe = idx >= 0 ? idx + 1 : (gruppe9 !== null && rdu0 <= gruppe9 ? 9 : null);
  const erwachseneMonat = gruppe === null || gruppe === 9 ? 0 : p.erwachsene[gruppe - 1];
  const kindMonat = gruppe === null ? 0 : (gruppe === 9 ? p.kind.gruppe9 : p.kind.gruppe1bis8);
  const monat = erwachseneMonat + kinderZahl * kindMonat;
  return {
    gruppe, monat, annual: monat * 12, grenze,
    erwachseneMonat, kindMonat,
    erwachseneAnnual: erwachseneMonat * 12,
    // Vergleichsgrösse «höchstens möglich»: Gruppe 1 mit denselben Personen.
    maximal: (p.erwachsene[0] + kinderZahl * p.kind.gruppe1bis8) * 12,
    erwachseneMaximal: p.erwachsene[0] * 12,
    nurKinder: gruppe === 9,
  };
}

// RDU-Untergrenze, unter der der Kanton den Anspruch NICHT automatisch prüft (RaLAMal Art. 10
// Abs. 4/5 [3]): 15'000 für eine Person allein, +3'000 je Kind — die Tabelle des SAM [5] nennt
// «Personne seule avec 1 enfant 18'000 · 2 enfants 21'000 · 3 enfants 24'000 · 4 enfants 27'000».
// ⟨28.09.2026 abends: bis dahin rechnete das Modul Alleinerziehende mit der Paar-Zeile (20'000 +
// 3'000 = 23'000) und nannte das «gewählt» — die Cockpit-Sitzung fand die SAM-Tabelle, die Frage
// ist damit beantwortet (FRAGEN-AN-DIE-AEMTER.md, Frage 12.2). Folge der alten Lesart: RDU
// 18'000–22'999 bekam «nur auf Antrag» und nach dem 30.11. «tritt nicht ein» — falsch für genau
// diese Gruppe. Die zwei Lesarten `vorsichtig`/`sicher` sind weg.⟩
export function geAntragUnter(kinderZahl) {
  const p = IPV_GE.antragUnter;
  return p.allein + p.jeUnterhaltspflicht * kinderZahl;
}

// Wohneigentum erfasst? Ein eingetragener Liegenschaftswert oder eine Hypothek (Profil `wohnen`).
// Begründung im Kopf («Wohneigentum»).
export function hatWohneigentum(wohnen) {
  const w = wohnen || {};
  return Number(w.propertyValue) > 0 || w.mortgageStatus === 'fixedRate' || w.mortgageStatus === 'variable';
}

// Berufskosten-Pauschale (LIPP Art. 29 Abs. 2 [7]) auf das unselbständige Erwerbseinkommen im Jahr:
// 3 %, mindestens 600, höchstens 1'700 — aber nur, wenn überhaupt Erwerbseinkommen da ist.
export function geBerufskostenPauschale(erwerbJahr) {
  const p = IPV_GE.berufskosten;
  if (!(erwerbJahr > 0)) return 0;
  return Math.min(p.max, Math.max(p.min, p.satz * erwerbJahr));
}

// Der RDU-Sockel, wie die App ihn nähert (LRDU Art. 4–8 [4]; Herleitung im Kopf). Reine Funktion,
// damit die Tests jeden Posten einzeln prüfen können. Alle Eingaben in CHF/Jahr. `erwerb` ist der
// Hauptlohn (für die Berufskosten-Pauschale). Familienzulagen und Alimente fehlen hier mit Absicht
// (Rahmen-Ruling, siehe Kopf).
export function geRdu({ netto, erwerb, vermoegen = 0 }) {
  return netto - geBerufskostenPauschale(erwerb) + IPV_GE.vermoegenAnteil * Math.max(0, vermoegen);
}

// Aufruf aus calculateIPV (config/cantonalData.js) für GE mit Beleg. Die App rechnet nur, wo ihre
// Angaben dafür reichen; sonst dieselbe Orientierung wie ein unbelegter Kanton, mit Grund in `offen`.
// `lookupPLZ` wird nicht gebraucht (keine Prämienregion) und darum nicht entgegengenommen.
export function ipvGenf(data, hh, ipvData, youngAdultsCount, orientierung) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_GE.jahr;
  // Das Barème gilt je Anspruchsjahr (Indexierung per Arrêté, Art. 9B [3]). Ab dem 01.01. des
  // Folgejahres lieber keine Zahl als eine aus den alten Beträgen; das Barème 2027 war am
  // 28.09.2026 nicht publiziert.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  // Art. 9 [3]: die RDU von Ehegatten, eingetragenen Partnern und Konkubinatspaaren mit gemeinsamem
  // Kind werden addiert — das zweite Einkommen kennt die App nicht (siehe Kopf).
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');

  // Alter nach Jahrgang. Belegt durch Art. 20 Abs. 3 lit. b [2] («ayant atteint leur majorité
  // avant le 1er janvier de l'année civile et jusqu'à 25 ans révolus») und das Barème [1]
  // («jeunes adultes, les personnes nées entre 2001 et 2007»). Erwachsen ist also, wer im
  // Anspruchsjahr 26 wird (Jahrgang 2000) — dieselbe Regel wie AG und LU, hier mit dem amtlichen
  // Barème für GENAU dieses Anspruchsjahr belegt. RaLAMal Art. 10 Abs. 8 [3] nennt den 1. Januar
  // ausdrücklich nur «pour l'application de l'alinéa 7» (junge Erwachsene) — er stützt die Regel,
  // trägt sie aber nicht allein (Rechtsprüfung 28.09.2026).
  const geburt = geburtsjahr(b);
  if (!geburt) return orientierung('alter');
  if (!ERWACHSEN.imAnspruchsjahr(jahr, geburt)) {
    // Volljährig am 1. Januar, aber noch nicht 26: junge Erwachsene — nur auf Antrag (siehe Kopf).
    return orientierung(jahr - geburt >= 19 ? 'geJungeErwachsene' : 'alter');
  }
  // Kinder: «enfants mineurs à charge» (Art. 21 Abs. 5, Art. 22 Abs. 2 [2]), minderjährig am
  // 1. Januar — für 2026 die Jahrgänge ab 2008, also höchstens 18 im Anspruchsjahr. Beim eingetippten
  // Alter ein Jahr dazu (wie BE und LU): undatiert, die Person kann im Anspruchsjahr Geburtstag haben.
  // Kind ohne erfasstes Alter ⇒ keine Zahl (Rahmen, Befund 20.09.2026).
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  // Über 18 im Haushalt: junge Erwachsene, nur auf Antrag (Art. 21 Abs. 6 [2]; siehe Kopf).
  if (UEBER_18(kinderJahre)) return orientierung('geJungeErwachsene');

  const kinderZahl = kinderJahre.length;
  const basisjahr = jahr - IPV_GE.basisjahrAbstand;
  // Art. 13C [3]: ein Kind, das nach dem Bemessungsjahr dazukam, kennt die Veranlagung nicht — der
  // Kanton berücksichtigt es nur auf schriftlichen Antrag. Datiert: Jahrgang nach dem Basisjahr;
  // undatiert: eingetipptes Alter 1 (0 heisst «nicht erfasst», siehe kinderAlter). Die Zahl wird
  // MIT dem Kind gerechnet, der Hinweis sagt, dass sie den Antrag voraussetzt.
  const kindNachBasisjahr = (hh.children || []).some((c) => (/^\d{4}-/.test(c.birthDate || '')
    ? Number(c.birthDate.slice(0, 4)) > basisjahr
    : Number(c.age) === 1));
  const vermoegen = vermoegenSumme(f) + Math.max(0, Number(f.pension3bBalance) || 0);
  // Art. 10 Abs. 1 [3]: über 250'000 Bruttovermögen vermutet der Kanton «nicht bescheiden» — kein
  // Ausschluss, aber nur auf begründeten Antrag mit Nachweis (Art. 23 Abs. 5 [2]). Die App kennt
  // nur die erfassten Posten, nicht das steuerliche Bruttovermögen — darum ein eigener Grund.
  if (vermoegen > IPV_GE.vermoegenBruttoGrenze) return orientierung('vermoegenAntragGE');
  // Wohneigentum zählt zum Bruttovermögen (Steuerwert, ohne Hypothek) — siehe Kopf. Keine Zahl.
  if (hatWohneigentum(data.wohnen)) return orientierung('wohneigentumGE');
  // Ein negatives Einkommen ist ein Vertipper, kein Einkommen (BE, Fachprüfung 23.09.2026). Art. 9A
  // [3] setzt einen negativen RDU zwar auf 0 — der meint aber Geschäftsverluste, die die App nicht
  // erfasst, nicht ein Minuszeichen im Lohnfeld. Ohne den Riegel ergäbe der Vertipper Gruppe 1.
  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');

  // LRDU Art. 8 Abs. 2 [4]: Sockel = Einkommen (Art. 4/5) + 1/15 des Vermögens (Art. 6/7). Die 3a
  // bleibt im Einkommen (Regel `voll`), die Berufskosten-Pauschale geht auf den Hauptlohn weg —
  // Herleitung, Belege und was mit Absicht fehlt: im Kopf.
  const rdu = geRdu({
    netto: einkommenJahr(f, SAEULE_3A.voll),
    erwerb: Number(f.monthlyIncome || 0) * hauptlohnMonate(f.dreizehnter),
    vermoegen,
  });
  const r = ipvGenfRechnen({ rdu, kinderZahl });

  // Art. 10 Abs. 4–6 [3]: unter der RDU-Untergrenze prüft der Kanton nicht automatisch — Antrag
  // mit Nachweis, vor dem 30. November (Art. 10A [3]), sonst kein Eintreten. Genau die ärmste
  // Gruppe; wer sich hier auf «automatisch» verlässt, verliert den ganzen Jahresanspruch.
  const antragGrenze = geAntragUnter(kinderZahl);
  const antragWegenRdu = rdu < antragGrenze;
  // Antrag nötig: wegen des RDU oder wegen eines Kindes nach dem Bemessungsjahr (Art. 13C [3]).
  const antragNoetig = antragWegenRdu || kindNachBasisjahr;
  const frist = new Date(`${jahr}-${String(IPV_GE.antragsfrist.monat).padStart(2, '0')}-${IPV_GE.antragsfrist.tag}T00:00:00`);
  // «avant le 30 novembre»: am 30. selbst ist es zu spät.
  const fristVorbei = new Date() >= frist;

  // Die Grenze ist amtlich als Zahl publiziert (Art. 21 [2]) — darum darf sie in die Anzeige.
  // 🛑 Der Verfahrens-Hinweis in der Kantonskarte darf im Antragsfall nicht «automatisch» sagen —
  // derselbe Bildschirm sagte sonst das Gegenteil (Rechtsprüfung 28.09.2026, Blocker). Auch im
  // Normalfall heisst es «in der Regel automatisch»: ge.ch [5] nennt Antragsfälle, die die App
  // nicht erfragt (Zuzug 2025/2026, Quellensteuer, fehlende Veranlagung, veränderte Lage).
  // Als «Max. Einkommen» steht die Grenze für die ERWACHSENE Person (Gruppe 8) — mit Kindern reicht
  // Gruppe 9 weiter, aber nur für den Kinderbeitrag; das sagt `geNurKinder` dazu. (Fachprüfung
  // 28.09.2026: vorher stand bei Alleinerziehenden 151'000, die Grenze nur des Kinderbeitrags.)
  const { gruppen } = geGrenzen(kinderZahl);
  const cantonData = { ...ipvData, maxIncome: gruppen[gruppen.length - 1], ...(antragNoetig ? { noteKey: 'ipv.geWegAntrag', noteParams: {} } : {}) };
  const gemeinsam = {
    canton: 'GE', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltGE',
    // Keine Prämienregion: `jahrKey` heisst das Feld in allen Kantonen ohne Region (UR, SZ, NE …);
    // die Anzeige zeigt damit den Genfer Satz statt «Prämienregion undefined» oder des Aargauer Satzes.
    extra: { basisjahr, jahrKey: 'ipv.jahrGE' },
  };
  // Über der letzten Grenze: kein Anspruch — und zwar VOR dem Prämien-Riegel, sonst hiesse es
  // «Prämie fehlt», wo gar nichts zu deckeln wäre (Abgleich 28.09.2026).
  if (r.annual <= 0) {
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: r.grenze } });
  }

  // Art. 22 Abs. 4 [2]: «Le montant des subsides accordés ne peut dépasser le montant de la prime
  // effective de l'assuré.» — je versicherte Person. Die App kennt nur die Prämie der erwachsenen
  // Person, also wird nur deren Anteil gedeckelt; der Kinderanteil bleibt ungedeckelt (wie ZH, BE,
  // LU: `deckelnProPerson`). ⚠️ Liegt die Prämie eines Kindes unter 132 Franken im Monat, fällt der
  // Betrag hier um die Differenz zu hoch aus.
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');
  const annual = deckelnProPerson(r.annual, r.erwachseneAnnual, praemie);
  const maxAnnual = deckelnProPerson(r.maximal, r.erwachseneMaximal, praemie);

  // Welcher Satz beim Betrag steht: nach der Frist der Frist-Satz (die App zieht dann nichts mehr
  // ab; LU und FR machen es genauso), sonst der Antragshinweis, sonst das Kind nach dem
  // Bemessungsjahr, sonst Gruppe 9, sonst der Weg des Kantons.
  let noteKey, noteParams;
  if (antragWegenRdu && fristVorbei) {
    noteKey = 'ipv.geAntragFristVorbei'; noteParams = { value: antragGrenze, jahr, folgejahr: jahr + 1 };
  } else if (antragWegenRdu) {
    noteKey = 'ipv.geAntragNoetig'; noteParams = { value: antragGrenze, jahr };
  } else if (kindNachBasisjahr) {
    // Art. 13C [3]: Fristen wie 13B Abs. 5 — vor dem 30.11., bei Zuwachs im 2. Halbjahr bis 30.06.
    // des Folgejahres. Ob das auch für ein Kind aus dem VORJAHR (Jahrgang 2025) gilt, sagt der Text
    // nicht (Frage 12); der Hinweis warnt in beiden Fällen.
    noteKey = 'ipv.geAntragKindNeu'; noteParams = { basisjahr, jahr, folgejahr: jahr + 1 };
  } else if (r.nurKinder) {
    noteKey = 'ipv.geNurKinder'; noteParams = { value: r.grenze };
  } else {
    noteKey = ipvData.noteKey; noteParams = ipvData.noteParams || {};
  }
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount, noteKey, noteParams,
    // `antragNoetig`: die Anzeige setzt dann statt «Berechtigt» eine Überschrift, die den Antrag
    // nennt. `anmeldefristVorbei` nur im RDU-Antragsfall nach der Frist: dann zieht die App nirgends
    // etwas von der Prämie ab (data/ipvAbzug.js), und die drei Leser (KK-Last-Karte, Prämien-Beleg,
    // Budget) zeigen den Genfer Text `fristNichtAbgezogenKey` statt des Luzerner — derselbe
    // Mechanismus wie FR (Ruling Frist-Mechanismus 28.09.2026; Fachprüfung B2: vorher stand nach
    // dem 30.11. «Prämienverbilligung Luzern … 31. Oktober» auf drei Genfer Seiten). Für die
    // automatischen Fälle und das Kind nach Art. 13C (Fristen bis 30.06.) gibt es keine Frist-Folge.
    extra: {
      ...gemeinsam.extra,
      ...(antragNoetig ? { antragNoetig: true } : {}),
      ...(antragWegenRdu ? { fristNichtAbgezogenKey: 'ipv.geFristNichtAbgezogen' } : {}),
      ...(antragWegenRdu && fristVorbei ? { anmeldefristVorbei: true } : {}),
    },
  });
}
