// Prämienverbilligung (IPV) Kanton Schaffhausen — amtliches Selbstbehalt-Modell, Jahr 2026 (K31).
//
// Belege (an der Quelle gelesen 28.09.2026, jeweils über die API-Route mit Gegenprobe: eine
// erfundene Nummer liefert HTTP 404), Wortlaute in docs/sources/ipv-kantone-2026.md, Abschnitt SH:
//   [1] Dekret über den Vollzug des Krankenversicherungsgesetzes (SHR 832.110), Version in Kraft
//       seit 01.01.2025 (Beschlussdatum 02.12.2024), keine künftige Version erfasst.
//       § 9 Abs. 2/3: gemeinschaftlicher Anspruch, Stichtag 1. Januar · § 10: Selbstbehalt 15 % ·
//       § 11: anrechenbare Prämien · § 12: anrechenbares Einkommen, Steuerwerte des zweiten
//       Vorjahres · § 13: Differenz, unter Fr. 100 keine Auszahlung, höchstens 65 % · § 13bis:
//       Mindestanspruch der Kinder · § 15 Abs. 3: ohne Antrag verwirkt · § 17 Abs. 2: Beträge
//       über der Prämie gehen zurück · § 23: Rückforderung.
//   [2] Verordnung über den Vollzug des Krankenversicherungsgesetzes (SHR 832.111), Version in
//       Kraft seit 01.08.2026 (Beschlussdatum 28.04.2026). Anhang 1 «Durchführung der
//       Prämienverbilligung im Jahre 2026» geändert am 18.11.2025, in Kraft seit 01.01.2026 —
//       § A1-1: Richtprämien nach Region und Jahrgang · § A1-2: Versand-Grenzwerte ·
//       § A1-3: Fristen. Ein Anhang für 2027 ist am 28.09.2026 nicht publiziert.
//   [3] Gesetz über die direkten Steuern (SHR 641.100), Version 01.01.2026, und die Versionen
//       01.01.2024 und 01.01.2025 (wortgleich an den zitierten Stellen): Art. 37 Abs. 1 lit. d
//       (Entlastungsabzug) · Art. 48 Abs. 1 (Sozialabzug vom Vermögen) · Art. 240 Abs. 2
//       (lit. d in der Fassung vom 8. November 2021 gilt für die Steuerperioden 2022 bis 2029).
//   [4] SVA Schaffhausen, «Merkblatt zum Anmeldeformular für die individuelle Prämienverbilligung
//       2026» (zul01-merkblatt.pdf, erstellt 10.12.2025, geändert 22.01.2026): Selbstbehalt
//       «im Minimum aber 35 Prozent der gesamten Richtprämien», Prämienregionen, Mindestgarantie
//       für Kinder, Steuerwerte 2024.
//   [5] Kantonale Steuerverwaltung Schaffhausen, Wegleitung zur Steuererklärung 2022, «Tabelle
//       Entlastungsabzug» (Seite 37) — die Stufen des Entlastungsabzugs. Die Wegleitung 2024 lag
//       nicht als PDF vor; der Gesetzestext ist für 2022–2029 derselbe ([3] Art. 240 Abs. 2).
//   Die Seite «Berechnung» der SVA (svash.ch/ipv/berechnung) zeigt am 28.09.2026 noch die
//   Richtprämien 2025 und die Steuerwerte 2023 — nicht verwendet.
//
// DAS MODELL IN EINEM SATZ
// Verbilligt wird die Summe der Richtprämien, soweit sie 15 % des anrechenbaren Einkommens
// übersteigt — höchstens 65 % der Richtprämien, und unter Fr. 100 wird nichts ausbezahlt.
// Der Abbau ist linear wie in ZH, mit einem Deckel oben (die 65 %) statt einer Stufe.
//
// KEIN AMTLICHES BERECHNUNGSBEISPIEL. Weder das Merkblatt [4] noch die SVA-Seiten enthalten eines.
// Prüfstein der Tests sind stattdessen die amtlichen Versand-Grenzwerte (§ A1-2 [2]): jeder der
// zehn Werte ist genau die Richtprämie geteilt durch 15 % (5'947 / 0,15 = 39'646.67 → 39'647),
// also der Nullpunkt dieser Formel. Das belegt Selbstbehalt und Richtprämien gegeneinander, nicht
// aber das anrechenbare Einkommen — dafür gibt es keinen amtlichen Prüfstein.
//
// DREI DINGE, DIE SCHAFFHAUSEN VON DEN BISHERIGEN KANTONEN UNTERSCHEIDEN
//
// 1. DER ENTLASTUNGSABZUG. Vom Reineinkommen geht zusätzlich der steuerliche Entlastungsabzug
//    ab (§ 12 Abs. 1 lit. b [1]), und zwar «einheitliche Anwendung der Ansätze gemäss Ziff. 1
//    auch für Nicht-Rentner, Anrechnung der Ansätze für Paare auch für Alleinerziehende»: für
//    Alleinstehende 7'050 bis 16'800 Reineinkommen, für Alleinerziehende 14'100 bis 25'200, je
//    angefangene 800 darüber 300 weniger ([3] Art. 37 Abs. 1 lit. d Ziff. 1; die Stufen nach der
//    Tabelle [5]: «bis 17'600 → 6'750»). Er hängt am STEUERLICHEN Reineinkommen, also an dem
//    Betrag, von dem die Säule 3a schon abgezogen ist — siehe `shEntlastungsabzug`.
//
// 2. DER DECKEL VON 65 %. Anders als in ZH/LU erhält auch eine Person ohne Einkommen nicht die
//    ganze Richtprämie, sondern höchstens 65 % davon (§ 13 Abs. 3 [1]; [4]: «im Minimum aber
//    35 Prozent der gesamten Richtprämien» — dieselbe Regel von der anderen Seite).
//
// 3. DAS VERMÖGEN ZÄHLT ERST NACH DEM STEUERLICHEN FREIBETRAG. «15% des nach kantonalem Recht
//    steuerpflichtigen Vermögens» (§ 12 Abs. 1 lit. c [1]) — steuerpflichtig ist das Reinvermögen
//    abzüglich 50'000 (Alleinstehende) und 30'000 je Kind ([3] Art. 48 Abs. 1 lit. b/c). Eine
//    Vermögens-OBERGRENZE kennt Schaffhausen nicht; die Werte in § A1-0.1 [2] (Reineinkommen
//    150'000, Vermögen 600'000) sind nur die Schwelle für den Datenbezug bei der Steuerverwaltung.
//
// GEWÄHLT, NICHT BELEGT (je als Frage an die SVA notiert, FRAGEN-AN-DIE-AEMTER.md):
//   · Kinder: der Mindestanspruch von 80 % (§ 13bis [1], Art. 65 Abs. 1bis KVG) wird auf die
//     RICHTPRÄMIE des Kindes gerechnet, nicht auf seine effektive Prämie. Indiz: das
//     Antragsformular fragt nach der Krankenkasse, nicht nach der Prämie [4], und § 13bis Abs. 1
//     verteilt nach der «anrechenbaren Prämie». Er gilt, sobald ein Anspruch nach § 10 besteht
//     ([4]: «bei einem Anspruch auf Prämienverbilligung»).
//   · Kinder: WIE der Rest nach § 13bis Abs. 1 verteilt wird («anteilig … auf die mitbetroffenen
//     Angehörigen»), mit oder ohne die Kinder, bleibt offen. Das ändert die Summe nicht, nur den
//     Anteil der erwachsenen Person — und damit, ob deren Prämie als Deckel greift. Geben beide
//     Lesarten verschiedene Beträge, zeigt die App keine Zahl (`orientierung('mindestanspruch')`).
//   · Kinder: liegt die Differenz über 0, aber unter Fr. 100, widersprechen sich § 13 Abs. 2
//     («kein Betrag») und § 13bis Abs. 2 («entsprechend erhöht») — keine Zahl.
//   · Rundung: keine Regel gefunden; gerundet auf ganze Franken wie ZH/SG/AG.
//
// RICHTUNG DER KINDER-LESARTEN (Fachprüfung #471 W3/W5, sichtbar in `ipv.shKinderVorbehalt`):
//   · Basis Richtprämie statt effektiver Kinderprämie: bei Durchschnittsprämie rund 22 Fr./Kind/Jahr
//     zu tief, bei günstigem Kassenmodell zu hoch.
//   · Aufteilung «mit Kindern»: der Kinderanteil kann über die Kinderprämie steigen (bei anrechenbarem
//     Einkommen unter ≈ 31'700); der Überschuss geht nach § 17 Abs. 2 [1] zurück — der Betrag ist dann
//     um mehrere hundert Fr./Kind/Jahr zu hoch, umso mehr, je tiefer die Kinderprämie. ⟨28.09.2026:
//     hier stand «bis gegen 400» — das ist keine Obergrenze, der Überschuss wächst mit tieferer Prämie.⟩
//   · Mindestanspruch nur mit Anspruch nach § 10: gilt das Bundesrecht (Art. 65 Abs. 1bis KVG) über
//     den Nullpunkt hinaus, sagt die App Familien knapp darüber zu Unrecht «kein Anspruch» — zu tief.
//
// RICHTUNG DER NÄHERUNG (Fachprüfung #471 W1/W2, sichtbar in `ipv.vorbehaltSH`/`ipv.shKeinAnspruch`):
//   · Netto statt Reineinkommen: Berufskosten (mind. 2'000) und Versicherungsabzug (3'750) fehlen; im
//     Band des Entlastungsabzugs wirkt jeder Franken mit ≈ 0,21 statt 0,15 — der Betrag ist eher ZU TIEF
//     (36'000 netto: App 1'222, mit diesen Abzügen ≈ 2'377), «kein Anspruch» kann falsch sein.
//   · Unterhaltsbeiträge (StG Art. 25 lit. f / Art. 35 Abs. 1 lit. c): erhaltene fehlen (Betrag zu hoch,
//     gerade bei Alleinerziehenden), bezahlte werden nicht abgezogen (Betrag zu tief). Nicht gerechnet —
//     Rahmen-PR für alle Kantone folgt.
//
// BEWUSST NICHT GEBAUT (wie in den anderen Kantonen):
//   · Paare und mehrere Erwachsene — «Gemeinsam besteuerte Personen haben einen
//     gemeinschaftlichen Anspruch» (§ 9 Abs. 2 [1]); das zweite Einkommen fehlt der App.
//   · junge Erwachsene (Jahrgänge 2001–2007) und Kinder über 18: ihr Anspruch hängt an Ausbildung
//     und am gemeinschaftlichen Anspruch mit den Eltern bis zum vollendeten 20. Altersjahr — die App
//     erfasst beides nicht.
//   · Quellenbesteuerte (§ 21 [1]; [4]: 75 % des quellensteuerpflichtigen Einkommens + 10 % des
//     Vermögens), Grenzgängerinnen und Grenzgänger, EL-Beziehende (§ 20 [1]) und Sozialhilfe-
//     beziehende (§ 19 [1]: effektive Prämie bis zur EL-Durchschnittsprämie, ohne 65-%-Deckel).
//   · vom anrechenbaren Einkommen: § 12 Abs. 1 lit. d [1] (Negativsaldo aus Grundeigentum) und
//     aus lit. e die Zuwendungen an gemeinnützige Organisationen und Parteien — die App erfasst
//     beides nicht; beides würde das Einkommen ERHÖHEN, der Betrag hier ist dann zu hoch. Die
//     amtlichen Abzüge, die das Reineinkommen unter das Nettoeinkommen drücken (Berufsauslagen,
//     Versicherungsabzüge), fehlen umgekehrt ebenfalls — der Betrag hier ist dann zu tief.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, regionAusPLZ, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';
import { getRegion } from '../data/praemienRegionen.js';
import { groessteJahresEinzahlung } from '../data/saeule3a.js';

// Werte 2026, wörtlich aus [1]–[3]. Alle Beträge sind Jahresbeträge in CHF.
export const IPV_SH = {
  jahr: 2026,
  // § 12 Abs. 2 [1]: «die definitiven Steuerwerte für das zweite dem Zahlungsjahr vorangehende
  // Jahr» — für 2026 also 2024 ([4]: «grundsätzlich die definitiven Steuerwerte 2024»).
  basisjahrAbstand: 2,
  // § A1-1 Abs. 1/2 [2]. e = «Jahrgänge 2000 und älter», j = «Jahrgänge 2001 – 2007»,
  // k = «Kinder (Jahrgänge 2008 und jünger)».
  richtpraemie: {
    1: { e: 5947, j: 3879, k: 1387 },
    2: { e: 5620, j: 3618, k: 1295 },
  },
  // § 10 [1]: «wenn die anrechenbaren Prämien … 15% des anrechenbaren Einkommens übersteigen».
  selbstbehalt: 0.15,
  // § 13 Abs. 3 [1]: «maximal 65 Prozent der anrechenbaren Prämien».
  hoechstanteil: 0.65,
  // § 13 Abs. 2 [1]: «Beträgt die Differenz weniger als Fr. 100.00, wird kein Betrag ausbezahlt.»
  mindestbetrag: 100,
  // § 12 Abs. 1 lit. a [1]: «Fr. 9'000.00 bei Haushalten mit Kindern bis zum vollendeten
  // 20. Altersjahr … bzw. Fr. 4'500.00 bei den übrigen Haushalten».
  grundabzug: { mitKindern: 9000, uebrige: 4500 },
  // § 12 Abs. 1 lit. c [1]: «Zuschlag 15% des nach kantonalem Recht steuerpflichtigen Vermögens».
  vermoegenAnteil: 0.15,
  // [3] Art. 48 Abs. 1: «Fr. 50'000.00 für die übrigen Steuerpflichtigen» (lit. b),
  // «Fr. 30'000.00 zusätzlich für jedes nicht selbständig besteuerte Kind» (lit. c).
  vermoegenFreibetrag: { alleinstehend: 50000, jeKind: 30000 },
  // [3] Art. 37 Abs. 1 lit. d Ziff. 1, angewandt nach § 12 Abs. 1 lit. b [1] («Ansätze gemäss
  // Ziff. 1 auch für Nicht-Rentner, Anrechnung der Ansätze für Paare auch für Alleinerziehende»):
  // «Fr. 14'100.00 für in ungetrennter Ehe lebende Steuerpflichtige mit einem Reineinkommen bis
  // Fr. 25'200.00, Fr. 7'050.00 für Alleinstehende mit einem Reineinkommen bis Fr. 16'800.00. Für
  // je Fr. 800.00 Reineinkommen mehr beträgt der Abzug Fr. 300.00 weniger».
  entlastung: {
    alleinstehend: { abzug: 7050, bis: 16800 },
    paar: { abzug: 14100, bis: 25200 },
    schritt: 800,
    minderung: 300,
  },
  // § 13bis [1] i. V. m. Art. 65 Abs. 1bis KVG; [4]: «die Prämien der Kinder um mindestens
  // 80 Prozent». Basis = Richtprämie: GEWÄHLT, siehe Kopf.
  kinderMindestanteil: 0.8,
  // § A1-3 Abs. 1 [2]: «ordentliche Frist zur Einreichung der Anträge: 30. April 2026»,
  // «letzte Nachfrist bei wichtigen Gründen gemäss § 15 Abs. 2: 15. Juni 2026».
  frist: { ordentlich: '2026-04-30', nachfrist: '2026-06-15' },
};

// § A1-1 [2]: «Prämienregion 1 (Stadt Schaffhausen und Neuhausen am Rheinfall)», Region 2 «übrige
// Gemeinden»; [4] sagt dasselbe. Die BAG-Daten der App wurden am 28.09.2026 VOLLSTÄNDIG dagegen
// abgeglichen: 26 Schaffhauser Gemeinden, Region 1 genau Schaffhausen (BFS 2939) und Neuhausen am
// Rheinfall (2937), 0 Abweichungen. Der Test hält den Abgleich fest.
export function shRegion(bfsNr) {
  return getRegion(bfsNr);
}

// Entlastungsabzug nach [3] Art. 37 Abs. 1 lit. d Ziff. 1, auf das STEUERLICHE Reineinkommen.
// «Für je Fr. 800.00 Reineinkommen mehr» heisst je ANGEFANGENE 800: so steht es in der Tabelle
// der Steuerverwaltung [5] («Reineinkommen bis 16'800 → 7'050, bis 17'600 → 6'750, … bis 35'200
// → 150»). Darüber 0 — für Alleinstehende ab 35'201, für Alleinerziehende ab 62'801.
export function shEntlastungsabzug(reineinkommen, alleinerziehend = false) {
  const e = IPV_SH.entlastung;
  const a = alleinerziehend ? e.paar : e.alleinstehend;
  const r = Math.max(0, reineinkommen);
  if (r <= a.bis) return a.abzug;
  return Math.max(0, a.abzug - e.minderung * Math.ceil((r - a.bis) / e.schritt));
}

// Anrechenbares Einkommen nach § 12 Abs. 1 [1], ohne App-Daten.
//   `nettoMit3a`   das Jahreseinkommen, in dem die Säule-3a-Einzahlung noch steckt (das
//                  Nettoeinkommen der App, siehe kantonsModell.js bei `einkommenJahr`)
//   `saeule3a`     die Einzahlung, die in der Steuer als Abzug stand
// Das steuerliche Reineinkommen ist `nettoMit3a − saeule3a`; lit. e rechnet den 3a-Abzug wieder
// auf, also bleibt `nettoMit3a` stehen — die 3a wirkt NUR über den Entlastungsabzug, der am
// steuerlichen Reineinkommen hängt.
export function shAnrechenbaresEinkommen({ nettoMit3a, saeule3a = 0, vermoegen = 0, kinderZahl = 0 }) {
  const p = IPV_SH;
  const reineinkommen = Math.max(0, nettoMit3a - saeule3a);
  const grundabzug = kinderZahl > 0 ? p.grundabzug.mitKindern : p.grundabzug.uebrige;
  const entlastung = shEntlastungsabzug(reineinkommen, kinderZahl > 0);
  const steuerpflichtigesVermoegen = Math.max(0,
    vermoegen - p.vermoegenFreibetrag.alleinstehend - p.vermoegenFreibetrag.jeKind * kinderZahl);
  return Math.max(0, nettoMit3a - grundabzug - entlastung + p.vermoegenAnteil * steuerpflichtigesVermoegen);
}

// Die Rechnung selbst — ohne App-Daten, damit die Tests sie gegen die amtlichen Werte prüfen
// können. `erwachsene` ist nur für den Test der Versand-Grenzwerte da (Verheiratete); die App ruft
// die Rechnung immer mit einer erwachsenen Person auf. Jahresbeträge in CHF, ungerundet.
export function ipvSchaffhausenRechnen({ region, kinderZahl = 0, einkommen, erwachsene = 1 }) {
  const p = IPV_SH;
  const r = p.richtpraemie[region];
  const summe = erwachsene * r.e + kinderZahl * r.k;
  // § 13 Abs. 1 [1]: die Differenz. Einkommen nie negativ, sonst wüchse sie über die Summe hinaus.
  const differenz = summe - p.selbstbehalt * Math.max(0, einkommen);
  const deckel = p.hoechstanteil * summe;
  const kinderMindest = kinderZahl * p.kinderMindestanteil * r.k;
  const leer = {
    summe, differenz, deckel, kinderMindest, total: 0,
    anteilErwachsen: { mitKindern: 0, ohneKinder: 0 }, unklar: false,
  };
  // § 10 [1]: kein Anspruch, solange die Prämien den Selbstbehalt nicht übersteigen.
  if (!(differenz > 0)) return { ...leer, grund: 'ueberGrenze' };
  if (differenz < p.mindestbetrag) {
    // Mit Kindern widersprechen sich hier § 13 Abs. 2 und § 13bis Abs. 2 (siehe Kopf).
    if (kinderZahl > 0) return { ...leer, unklar: true, grund: null };
    return { ...leer, grund: 'mindestbetrag' };
  }
  // § 13 Abs. 3 [1]: höchstens 65 %. § 13bis Abs. 2 [1]: reicht das für den Mindestanspruch der
  // Kinder nicht, wird erhöht — also das Grössere.
  const gedeckelt = Math.min(differenz, deckel);
  const total = Math.max(gedeckelt, kinderMindest);
  // § 13bis Abs. 1 [1]: zuerst die Mindestansprüche der Kinder, der Rest «anteilig entsprechend
  // der Höhe der anrechenbaren Prämie». Zwei Lesarten (siehe Kopf), je Anteil EINER erwachsenen
  // Person:
  const rest = Math.max(0, gedeckelt - kinderMindest);
  const anteilErwachsen = {
    mitKindern: summe > 0 ? (rest * r.e) / summe : 0,
    ohneKinder: rest / erwachsene,
  };
  return { ...leer, total, anteilErwachsen, grund: null };
}

// Aufruf aus calculateIPV (config/cantonalData.js) für SH mit Beleg. Die App rechnet nur, wo
// ihre Angaben dafür reichen; sonst dieselbe Orientierung wie ein unbelegter Kanton, mit Grund
// in `offen`.
export function ipvSchaffhausen(data, hh, ipvData, youngAdultsCount, orientierung, lookupPLZ) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_SH.jahr;
  // Der Anhang wird jährlich neu beschlossen (für 2026 am 18.11.2025). Ab dem 01.01. des
  // Folgejahres lieber keine Zahl als eine aus veralteten Sätzen.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // § A1-1 [2]: «Personen der Jahrgänge 2000 und älter» sind 2026 Erwachsene — erwachsen ist,
  // wer im Anspruchsjahr 26 wird. Dieselbe Regel wie LU und AG, hier mit der amtlichen
  // Jahrgangstabelle für GENAU dieses Anspruchsjahr belegt.
  const geburt = geburtsjahr(b);
  if (!geburt) return orientierung('alter');
  // Jahrgänge 2001–2007 sind junge Erwachsene: ihr Anspruch hängt an Ausbildung und Haushalt, nicht am
  // Geburtsdatum — eigener Grund statt «es fehlt ein Geburtsdatum» (Fachprüfung #471 K1, wie UR).
  if (!ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung(jahr - geburt >= 19 ? 'ausbildung' : 'alter');
  // § 9 Abs. 3 [1]: massgebend sind «die persönlichen Verhältnisse am 1. Januar»; [4]: «Kinder,
  // die nach dem 1. Januar 2026 zur Welt gekommen sind, dürfen nicht aufgeführt werden.»
  const kinder = (hh.children || []).filter((c) => !(/^\d{4}-\d{2}-\d{2}/.test(c.birthDate || '')
    && c.birthDate.slice(0, 10) > `${jahr}-01-01`));
  // «Kinder (Jahrgänge 2008 und jünger)» — höchstens 18 im Anspruchsjahr. Beim eingetippten
  // Alter ein Jahr dazu, vorsichtig an der 18 (wie LU, BE, SG).
  const kinderJahre = kinderAlter(kinder, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  // Über 18: junge Erwachsene sind bewusst nicht gebaut (siehe Kopf).
  if (UEBER_18(kinderJahre)) return orientierung('ausbildung');

  const { region } = regionAusPLZ({ data, kanton: 'SH', lookupPLZ, regionFn: shRegion });
  if (!region) return orientierung('region');

  const roh = rohesEinkommenJahr(f);
  if (!(roh >= 0)) return orientierung('einkommenNegativ');
  // § 12 Abs. 1 lit. e [1]: der 3a-Abzug wird unbedingt wieder aufgerechnet — Regel `voll`, das
  // Nettoeinkommen der App trägt die Einzahlung schon.
  const nettoMit3a = einkommenJahr(f, SAEULE_3A.voll);
  const saeule3a = Math.max(0, Number(f.pension3a) || 0);
  const kinderZahl = kinderJahre.length;
  const vermoegen = vermoegenSumme(f);
  const einkommen = shAnrechenbaresEinkommen({ nettoMit3a, saeule3a, vermoegen, kinderZahl });
  // Die 3a wirkt hier nur über den Entlastungsabzug. Wo sie ihn verändert, muss der erfasste
  // Betrag EIN Jahr sein und aus diesem Einkommen stammen können — sonst wäre das steuerliche
  // Reineinkommen zu tief und der Betrag zu hoch (dieselbe Prüfung wie in BE,
  // SAEULE_3A.bisBundesMaximum.widerlegt). Wo er den Abzug nicht verändert, bleibt die Zahl.
  const ohne3a = shAnrechenbaresEinkommen({ nettoMit3a, saeule3a: 0, vermoegen, kinderZahl });
  if (einkommen !== ohne3a) {
    const groesstesJahr = groessteJahresEinzahlung(f.pension3aDeposits, jahr);
    if (saeule3a > nettoMit3a || (groesstesJahr !== null && saeule3a > groesstesJahr)) {
      return orientierung('saeule3aUeberEinkommen');
    }
  }

  const r = ipvSchaffhausenRechnen({ region, kinderZahl, einkommen });
  if (r.unklar) return orientierung('mindestanspruch');

  // § 17 Abs. 2 [1]: «Beiträge, welche die Höhe der Prämie übersteigen, sind der auszahlenden
  // Stelle zurückzuerstatten»; [4]: «Übersteigt die Prämienverbilligung die effektive Prämie …,
  // so geht der Überschuss an das SVA Schaffhausen zurück.» Die App kennt nur die Prämie der
  // erwachsenen Person — nur deren Anteil wird gedeckelt (`deckelnProPerson`).
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');
  const ohneKinder = kinderZahl === 0;
  const annual = ohneKinder
    ? Math.round(Math.min(r.total, praemie))
    : deckelnProPerson(r.total, r.anteilErwachsen.mitKindern, praemie);
  // Die zweite Lesart von § 13bis Abs. 1 (siehe Kopf): gibt sie mit dem Deckel einen anderen
  // Betrag, steht hier keine Zahl.
  if (!ohneKinder && deckelnProPerson(r.total, r.anteilErwachsen.ohneKinder, praemie) !== annual) {
    return orientierung('mindestanspruch');
  }
  // Vergleichsgrösse «höchstens möglich»: dieselbe Rechnung bei anrechenbarem Einkommen 0.
  const r0 = ipvSchaffhausenRechnen({ region, kinderZahl, einkommen: 0 });
  const maxAnnual = ohneKinder
    ? Math.round(Math.min(r0.total, praemie))
    : deckelnProPerson(r0.total, r0.anteilErwachsen.mitKindern, praemie);

  // Die Versand-Grenzwerte (§ A1-2 [2]) sind KEINE Anspruchsgrenze, sondern die Schwelle, bis zu
  // der die SVA ein Formular verschickt — als «Einkommensgrenze» angezeigt wären sie falsch.
  const cantonData = { ...ipvData, maxIncome: null };
  const basisjahr = jahr - IPV_SH.basisjahrAbstand;
  const gemeinsam = {
    canton: 'SH', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltSH',
    // Mit Kindern ein zweiter Vorbehalt: die zwei offenen Kinder-Lesarten und ihre Richtung
    // (Fachprüfung #471 W3/W5) — nur dort, wo er zutrifft.
    extra: { region, basisjahr, ...(kinderZahl > 0 ? { zusatzVorbehaltKey: 'ipv.shKinderVorbehalt' } : {}) },
  };
  if (annual <= 0) {
    return ergebnisOhneAnspruch({
      ...gemeinsam,
      noteKey: r.grund === 'mindestbetrag' ? 'ipv.shUnterMindestbetrag' : 'ipv.shKeinAnspruch',
    });
  }
  // § 15 Abs. 3 [1]: «Wird innerhalb der gesetzten Frist kein Antrag eingereicht, ist der Anspruch
  // auf Prämienverbilligung verwirkt»; § 14 Abs. 3 ebenso für zugestellte Formulare. Frist 2026:
  // 30.04.2026 (§ A1-3 [2]). Danach zieht die App im Budget, in der KK-Last-Karte und im
  // Prämienbeleg nichts mehr ab (data/ipvAbzug.js) und sagt warum — mit dem eigenen Text
  // `ipv.shFristNichtAbgezogen` (Leser wie FR: `fristNichtAbgezogenKey`).
  // ⟨Fachprüfung #471 B1: hier stand, `anmeldefristVorbei` werde bewusst NICHT gesetzt, weil die
  // Leser nur den Luzerner Text kannten. Das Budget zog dadurch einen verwirkten Betrag ab.⟩
  const fristVorbei = new Date() > new Date(`${IPV_SH.frist.ordentlich}T23:59:59`);
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    extra: { ...gemeinsam.extra, anmeldefristVorbei: fristVorbei, fristNichtAbgezogenKey: 'ipv.shFristNichtAbgezogen' },
    noteKey: fristVorbei ? 'ipv.shFristVorbei' : 'ipv.shFristLaeuft',
    noteParams: { jahr, folgejahr: jahr + 1 },
  });
}
