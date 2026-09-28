// Prämienverbilligung (IPV) Kanton Wallis — degressive Einkommensskala, Jahr 2026 (K31).
// Eigenes Modul im Register IPV_MODULE (config/cantonalData.js), auf dem gemeinsamen Rahmen
// (config/kantonsModell.js).
//
// Belege (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt VS:
//   [1] Verordnung über die obligatorische Krankenversicherung und die individuellen
//       Prämienverbilligungen (VüIPV), SGS 832.105, «Aktuelle Version in Kraft seit: 01.05.2026
//       (Beschlussdatum: 20.05.2026)», keine künftige Version (lex.vs.ch-API, Version 3609).
//       Art. 2 Abs. 2: «gleich oder kleiner» als die Grenze · Art. 3 Abs. 3: wer am 31.12. des
//       Vorjahres 20 ist, wird einzeln gerechnet · Art. 5 Abs. 2: Referenzprämie = EL-Durch-
//       schnittsprämie × 0,95, auf Franken gerundet · Art. 6 Abs. 1/2/6: degressive Skala, Kinder
//       mind. 80 %, höchstens die tatsächliche Prämie · Art. 8: massgebendes Einkommen, x − 2 ·
//       Art. 9 Abs. 1: Kinder bis 20 zählen zur Familie · Art. 10 Abs. 2/2bis: Stichtag 31.12. des
//       Vorjahres, Geburt ab dem Geburtsmonat · Art. 11: Entscheid von Amtes wegen, sonst Gesuch.
//   [2] Dienststelle für Gesundheitswesen / Ausgleichskasse, «Einkommenstabelle zur Berechnung der
//       Krankenkassensubventionen 2026» (PDF-Titel «Echelle définitive RIP 2026 - F+D», erstellt
//       19.12.2025), von der Ausgleichskasse als «Vollständige Einkommenstabelle 2026» verlinkt.
//       Werte am SEITENBILD geprüft (28.09.2026), Textlayer stimmt überein.
//   [3] Ausgleichskasse des Kantons Wallis, Seite «Prämienverbilligung» (Stand 28.09.2026):
//       Vermögensgrenze CHF 1 Million Bruttovermögen, Berechnungsschema, automatische Erfassung.
//   [4] Anhang zur Medienmitteilung vom 3. Februar 2026 (Folien 8–10): dieselben Grenzen mit der
//       Spaltenüberschrift «(Provisorisch)», Region 1/2, Referenzprämien.
//   Gegenprobe Referenzprämien: EDI-Durchschnittsprämien 2026, VS 7'092 / 5'064 / 1'680 und
//   6'072 / 4'536 / 1'392 im Jahr; × 0,95 ÷ 12, gerundet = 561 / 401 / 133 und 481 / 359 / 110.
//   [5] Dienststelle für Gesundheitswesen, «Modalités de subventionnement des primes d'assurance-
//       maladie 2026» (Datei «Directives et BO - RIP 2026_fr», PDF erstellt 22.12.2025), die
//       jährliche Publikation nach Art. 23 [1]; gelesen 28.09.2026 (nach der Fachprüfung #477).
//       Ziff. 4.1: Sätze, Grenzen, «les enfants des personnes seules dont le revenu est compris entre
//       CHF 60'125.- et CHF 63'000.- ont droit à un subside de 80%» · Ziff. 4.3: Sozialhilfe jährlich
//       mit Gesuch, 100 % · Ziff. 6.1: Berechnungsschema · Ziff. 6.2: Quellenbesteuerte (B, L, N, F)
//       «devront présenter une requête … pour le 31 décembre 2026 au plus tard» · Ziff. 6.3: Schulden
//       werden abgezogen · Ziff. 7: Sondergesuche «avant le 31 décembre 2026».
//   [6] Kantonale Steuerverwaltung, «Wegleitung Zusammenfassung 2024» (Steuerjahr 2024 = Bemessungs-
//       jahr): Ziff. 220 «Die von Bund und Kanton entrichteten Kinder- und Familienzulagen sind
//       steuerpflichtig (Art. 13 StG)» · Ziff. 1410+1420 «Unterhaltsbeiträge … erhaltene Zahlungen».
//       Beide liegen im Einkommen VOR Ziffer 2400.
//   Der Staatsratsbeschluss nach Art. 7 [1] selbst wurde NICHT gefunden (Amtsblatt 2026 ohne
//   Veröffentlichung dazu, gesucht 28.09.2026) — die Zahlen stammen aus [2]–[5].
//
// DAS MODELL IN EINEM SATZ
// Die Einkommenstabelle ordnet dem massgebenden Einkommen einen von sieben Sätzen zu (70, 50, 40,
// 30, 20, 10, 5 % der regionalen Referenzprämie); Kinder erhalten 80 %, solange das Einkommen die
// Kinderzeile nicht übersteigt. Die Grenzen hängen an Haushaltstyp und Kinderzahl.
//
// WAS DAS WALLIS VON DEN BISHERIGEN KANTONEN UNTERSCHEIDET
// 1. STUFEN NACH SATZ, NICHT NACH FRANKEN (anders als BE): der Betrag ist Satz × Referenzprämie.
// 2. KEIN ANTRAG — die Ausgleichskasse erfasst die Berechtigten von Amtes wegen aus den Steuer-
//    daten 2024 und teilt es Ende Februar mit ([3]). Wer keinen Entscheid erhält, reicht ein
//    begründetes Gesuch ein, rückwirkend höchstens zwei Jahre (Art. 11 Abs. 2 [1]). Darum keine
//    Anmeldefrist in der App (`anmeldefristVorbei` wird nicht gesetzt).
// 3. UNTERHALT UND FAMILIENZULAGEN RECHNET DAS WALLIS-MODUL SELBST (Fachprüfung #477, B1, Ruling):
//    bezahlte Unterhaltsbeiträge werden ABGEZOGEN (Art. 8 Abs. 1 lit. b [1], [5] Ziff. 6.1);
//    ERHALTENE Unterhaltsbeiträge und Familienzulagen zählen ZUM Einkommen — beide sind Teil des
//    «Nettoeinkommens vor den persönlichen Abzügen (Ziffer 2400)» (Art. 8 Abs. 1 [1]; [6] Ziff. 220
//    und 1410/1420; Medienanhang [4] Folie 10: «Andere Einkommen (… Unterhaltsbeiträge …)»).
//    Der gemeinsame Rahmen (`rohesEinkommenJahr`) kennt die drei Felder nicht; VS liest
//    `alimentePaid`, `alimenteReceived` und `familienzulagen` darum hier (je × 12, Monatsfelder).
//    Ein Rahmen-PR, der sie allgemein einführt, muss VS ausnehmen, sonst zählen sie doppelt.
//    ⚠️ Enthält der erfasste Nettolohn die Kinderzulagen schon (manche Lohnabrechnungen führen sie
//    mit), zählen sie hier doppelt — das Einkommen fiele zu hoch, der Betrag zu tief.
//    ⟨vorher 28.09.2026: nur `alimentePaid` abgezogen — Alleinerziehende mit Zulagen und Alimenten
//    bekamen bis 3'366 im Jahr zu viel (Fachprüfung: 5'989 statt 2'623).⟩
//
// KINDERZEILE «ALLEINSTEHENDE MIT 1 KIND» = 63'000 ⟨aufgelöst 28.09.2026 nach der Fachprüfung #477⟩
//   Hier stand ein Widerspruch: [2] 63'000, deutscher Medienanhang [4] 61'000; dazwischen zeigte die
//   App keine Zahl. Die jährliche Publikation der Dienststelle [5] Ziff. 4.1 nennt ausdrücklich
//   «entre CHF 60'125.- et CHF 63'000.-», der französische Medienanhang ebenfalls 63'000. Drei
//   Quellen gegen eine Übertragung — es gilt 63'000, und die Anzeige nennt die Grenze auch mit Kind.
//
// 🛑 SÄULE 3A — Erlass und Merkblatt sagen es verschieden
//   [1] Art. 8 Abs. 1 lit. a: dazugerechnet werden die 3a-Beiträge «bis zum Maximalbetrag des
//   Angestelltenlohns» — dieselbe Regel wie BE (`SAEULE_3A.bisBundesMaximum`). [3] rechnet die
//   Beiträge (Ziffern 2210/2220) OHNE Obergrenze dazu, ebenso die Dienststelle [5] Ziff. 6.1 — es
//   widersprechen sich also die Verordnung und BEIDE Vollzugsstellen (auch schon in der für die
//   Entscheide 2026 geltenden Vorgängerfassung). Unter dem Maximum rechnen alle gleich (das
//   Nettoeinkommen der App trägt die 3a schon). Darüber — nur Personen ohne 2. Säule — keine Zahl
//   (`orientierung('saeule3aStrittig')`).
//
// GEWÄHLT, NICHT BELEGT
//   · ⟨belegt, nicht mehr nur gewählt⟩ Lesart der Tabelle: es gilt die erste Zeile, deren Grenze das
//     Einkommen nicht übersteigt — Art. 2 Abs. 2 [1] «gleich oder kleiner», [5] Ziff. 4.1 «limites
//     maximales de revenus … qui permettent d'obtenir un subside».
//   · Alter: `ERWACHSEN.mangelsStichtag` — der Stichtag 31.12. des Vorjahres (Art. 10 Abs. 2 [1])
//     gilt für die Familie, einen für die Prämien-Alterskategorie nennt der Erlass nicht.
//   · Rundung: nicht publiziert; Satz × Monatsprämie × 12 je Person, Summe auf Franken.
//
// BEWUSST NICHT GEBAUT
//   · Ehepaare, Konkubinat, mehrere Erwachsene (das zweite Einkommen fehlt der App).
//   · Personen von 20 bis 25 (einzeln gerechnet, Referenzprämie «Junge Erw.», Zusatz bis 50 % bei
//     Ausbildung nach Art. 6 Abs. 3 [1]) — eigener Grund `vsJungeErwachsene` (nicht `alter`: das
//     Geburtsdatum fehlt nicht, und das Elterneinkommen zählt im Wallis ab 20 gerade NICHT).
//   · QUELLENBESTEUERTE (Ausweis B, L; auch N, F — kennt die App nicht): nicht automatisch erfasst,
//     Gesuch bis 31. Dezember ([3], [5] Ziff. 6.2), anderes Einkommen (80 % brutto, Art. 8 Abs. 5 [1])
//     → `orientierung('vsQuellensteuer')` aus `ausbildung.workPermit` (Fachprüfung #477, B2).
//     Personen mit NEUER C-Bewilligung (2025) müssen ebenfalls beantragen — erkennt die App nicht; der
//     Vorbehalt nennt es.
//   · Kinder über 18 (19/20-Jährige zählen zur Familie, aber mit der Prämie junger Erwachsener) und
//     Kinder, die im Anspruchsjahr geboren sind (zählen erst ab dem Geburtsmonat, Art. 10 Abs. 2bis).
//   · mehr als 9 Kinder (die Tabelle [2] endet bei 9).
//   · EL- und Sozialhilfebeziehende (100 %, Art. 6 Abs. 5 [1]), Quellenbesteuerte (80 % Brutto,
//     Art. 8 Abs. 5, Gesuch bis 31.12.), Ermessenseinschätzung (Art. 8 Abs. 4), Neuberechnung bei
//     30 % Einkommensrückgang (Art. 10 Abs. 5, steht im Vorbehalt), Härtefälle (Art. 4).
//   · Vom Einkommen: negative Liegenschaftserträge, Verluste Selbständiger, Kapitalleistungen,
//     Auslandelemente. Umgekehrt fehlen der App die Abzüge vor Ziffer 2400 (Berufsauslagen,
//     Schuldzinsen) und beim Vermögen die Schulden ([5] Ziff. 6.3): das Einkommen fällt zu HOCH aus,
//     der Betrag zu TIEF. Der Vorbehalt nennt beide Richtungen (Fachprüfung #477, ⚠️ 4).
//   · Alimente an volljährige Kinder zählen nur auf Sondergesuch ([5] Ziff. 7.5) — die App zieht alle ab.
//   · Kein Mindestbetrag (in [1]–[4] keiner gefunden).
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, UEBER_18, regionAusPLZ, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';
import { getRegion } from '../data/praemienRegionen.js';

// Werte 2026. Grenzen = massgebendes Einkommen in CHF im Jahr; Prämien = CHF im Monat.
export const IPV_VS = {
  jahr: 2026,
  // Art. 8 Abs. 1 [1]: «Steuerperiode …, die 2 Jahre vor dem Jahr liegt» (Jahr x − 2).
  basisjahrAbstand: 2,
  // [2] «Ordentliche Ref. Prämien», Reg. I / Reg. II. e = Erwachsene, j = junge Erw., k = Kinder.
  referenzpraemie: {
    1: { e: 561, j: 401, k: 133 },
    2: { e: 481, j: 359, k: 110 },
  },
  // [2] «ALLEINSTEHENDE PERSONEN», Zeilen «Erwachsene» je Subventionsansatz; Index = Kinderzahl
  // («ohne Kind», «mit 1 Kind» … «mit 9 Kindern»).
  skalaAllein: [
    [70, [21000, 38250, 48250, 56250, 62250, 68250, 74250, 80250, 86250, 92250]],
    [50, [23917, 41896, 51896, 59896, 65896, 71896, 77896, 83896, 89896, 95896]],
    [40, [26833, 45542, 55542, 63542, 69542, 75542, 81542, 87542, 93542, 99542]],
    [30, [29750, 49188, 59188, 67188, 73188, 79188, 85188, 91188, 97188, 103188]],
    [20, [32667, 52833, 62833, 70833, 76833, 82833, 88833, 94833, 100833, 106833]],
    [10, [35583, 56479, 66479, 74479, 80479, 86479, 92479, 98479, 104479, 110479]],
    [5, [38500, 60125, 70125, 78125, 84125, 90125, 96125, 102125, 108125, 114125]],
  ],
  // [2] Zeile «Kinder 80%» der Alleinstehenden. Index 0: «-» (ohne Kind). Index 1 = 63'000 auch in
  // [5] Ziff. 4.1 («entre CHF 60'125.- et CHF 63'000.-»); nur der deutsche Medienanhang [4] zeigt 61'000.
  kinderAllein: [null, 63000, 70125, 78125, 84125, 90125, 96125, 102125, 108125, 114125],
  // Art. 6 Abs. 2 [1]: «nicht weniger als 80 Prozent der durchschnittlichen Referenzprämie».
  kinderSatz: 80,
  // [3]: «Versicherte oder Familien, deren neu eingeschätztes Bruttovermögen von CHF 1 Million
  // übersteigt, haben kein Anrecht auf Subventionen (vom Staatsrat festgelegter Betrag).»
  vermoegensgrenze: 1000000,
  // Art. 8 Abs. 1 lit. a [1]: «5 Prozent des eingeschätzten Nettovermögens».
  vermoegenAnteil: 0.05,
};

export const MAX_KINDER_VS = IPV_VS.kinderAllein.length - 1;

// Prämienregion. [4]: «Region 1: Die meisten Gemeinden des Mittel- und Unterwallis.» · «Region 2:
// Gemeinden des Oberwallis, Anniviers, Evolène, Hérémence, Mont-Noble, Saint-Martin und Vex.»
// Die BAG-Daten der App gegen diese Beschreibung und das BFS-Gemeindeverzeichnis (01.01.2026)
// abgeglichen: alle 122 Gemeinden, 0 Abweichungen (Test).
export function vsRegion(bfsNr) {
  const r = getRegion(Number(bfsNr));
  return r === 1 || r === 2 ? r : null;
}

// Satz der erwachsenen Person in Prozent, oder `null` (über der 5-%-Grenze). Art. 2 Abs. 2 [1]:
// Anspruch, wenn das Einkommen «gleich oder kleiner» ist als die Grenze.
export function vsSatzErwachsen(me, kinderZahl = 0) {
  for (const [satz, grenzen] of IPV_VS.skalaAllein) if (me <= grenzen[kinderZahl]) return satz;
  return null;
}

// Die Rechnung selbst — ohne App-Daten. Jahresbeträge in CHF, ungerundet.
export function ipvWallisRechnen({ region, kinderZahl = 0, me }) {
  const p = IPV_VS;
  const rp = p.referenzpraemie[region];
  const me0 = Math.max(0, me);
  const satz = vsSatzErwachsen(me0, kinderZahl);
  const kinderGrenze = p.kinderAllein[kinderZahl];
  const kinderGilt = kinderZahl > 0 && me0 <= kinderGrenze;
  const anteilErwachsen = satz === null ? 0 : (satz / 100) * rp.e * 12;
  const anteilKind = kinderGilt ? (p.kinderSatz / 100) * rp.k * 12 : 0;
  const maximalErwachsen = (p.skalaAllein[0][0] / 100) * rp.e * 12;
  return {
    satz, kinderGilt, anteilErwachsen, anteilKind,
    total: anteilErwachsen + kinderZahl * anteilKind,
    maximalErwachsen,
    maximal: maximalErwachsen + kinderZahl * (p.kinderSatz / 100) * rp.k * 12,
    // Oberste Grenze des Haushalts: bis dahin gibt es überhaupt etwas (Erwachsene oder Kinder).
    grenze: Math.max(p.skalaAllein[p.skalaAllein.length - 1][1][kinderZahl], kinderGrenze ?? 0),
  };
}

// Aufruf aus calculateIPV (config/cantonalData.js) über das Register IPV_MODULE.
export function ipvWallis(data, hh, ipvData, youngAdultsCount, orientierung, lookupPLZ) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_VS.jahr;
  // Grenzen und Referenzprämien legt der Staatsrat jährlich fest (Art. 7 [1]); für 2027 war am
  // 28.09.2026 nichts publiziert.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  const geburt = geburtsjahr(b);
  if (!geburt) return orientierung('alter');
  // Unter 26 (nach `mangelsStichtag`): im Wallis wird, wer am 31.12. des Vorjahres 20 ist, EINZELN
  // gerechnet (Art. 3 Abs. 3 [1]) — mit der Referenzprämie «Junge Erw.» und allenfalls dem Zusatz
  // bis 50 % in Ausbildung (Art. 6 Abs. 3). Das baut die App nicht; eigener Grund statt `alter`.
  if (!ERWACHSEN.mangelsStichtag(jahr, geburt)) return orientierung('vsJungeErwachsene');
  // Quellenbesteuerte: nicht automatisch, Gesuch bis 31.12. ([3], [5] Ziff. 6.2). Die App kennt die
  // Bewilligung (`ausbildung.workPermit`); B und L sind in der Regel quellenbesteuert.
  const bewilligung = String(data.ausbildung?.workPermit || '').toLowerCase();
  if (bewilligung === 'b' || bewilligung === 'l') return orientierung('vsQuellensteuer');
  // Alter im Anspruchsjahr, beim eingetippten Alter ein Jahr dazu (wie BE/SG/LU).
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  if (UEBER_18(kinderJahre)) return orientierung('haushalt');
  // Art. 10 Abs. 2/2bis [1]: massgebend ist die Familie am 31.12. des Vorjahres; ein Kind, das im
  // Anspruchsjahr geboren wird, zählt erst ab dem Geburtsmonat — diese Teiljahresrechnung macht
  // die App nicht.
  if ((hh.children || []).some((c) => /^\d{4}-/.test(c.birthDate || '') && Number(c.birthDate.slice(0, 4)) >= jahr)) {
    return orientierung('kindImJahrGeboren');
  }
  const kinderZahl = kinderJahre.length;
  if (kinderZahl > MAX_KINDER_VS) return orientierung('haushalt');

  const { region } = regionAusPLZ({ data, kanton: 'VS', lookupPLZ, regionFn: vsRegion });
  if (!region) return orientierung('region');

  const vermoegen = vermoegenSumme(f);
  // [3]: über 1 Million Bruttovermögen kein Anspruch. Die App kennt nur die erfassten Posten.
  if (vermoegen > IPV_VS.vermoegensgrenze) return orientierung('vermoegen');
  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');

  // Säule 3a: Art. 8 Abs. 1 lit. a [1] rechnet sie «bis zum Maximalbetrag des Angestelltenlohns»
  // dazu — Regel `bisBundesMaximum` mit dem Bemessungsjahr x − 2 (wie BE).
  const jahre = { bemessungsjahr: jahr - IPV_VS.basisjahrAbstand, anspruchsjahr: jahr };
  if (SAEULE_3A.bisBundesMaximum.maximumFuer(jahre.bemessungsjahr) === null) return orientierung('jahr');
  if (SAEULE_3A.bisBundesMaximum.widerlegt(f, rohesEinkommenJahr(f), jahre)) return orientierung('saeule3aUeberEinkommen');
  // Über dem Maximum widersprechen sich Erlass [1] und Merkblatt [3] — keine Zahl (siehe Kopf).
  if (SAEULE_3A.bisBundesMaximum.nichtAufgerechnet(f, jahre) > 0) return orientierung('saeule3aStrittig');

  // Art. 8 Abs. 1 [1]: Nettoeinkommen vor Ziffer 2400 (inkl. erhaltene Unterhaltsbeiträge und
  // Familienzulagen, [6]) + 5 % Nettovermögen − bezahlte Unterhaltsbeiträge (lit. b). Siehe Kopf, 3.
  const monat = (k) => Math.max(0, Number(f[k]) || 0) * 12;
  const me = Math.max(0, einkommenJahr(f, SAEULE_3A.bisBundesMaximum, jahre)
    + monat('alimenteReceived') + monat('familienzulagen')
    + IPV_VS.vermoegenAnteil * vermoegen - monat('alimentePaid'));

  const r = ipvWallisRechnen({ region, kinderZahl, me });

  const basisjahr = jahr - IPV_VS.basisjahrAbstand;
  // Die Grenzen sind amtlich als Tabelle publiziert ([2], [5]) — die Anzeige nennt die oberste des
  // Haushalts, seit der Auflösung 63'000 auch mit einem Kind.
  const cantonData = { ...ipvData, maxIncome: r.grenze };
  const gemeinsam = {
    canton: 'VS', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltVS', extra: { region, basisjahr },
  };
  if (r.total <= 0) return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.vsKeinAnspruch' });

  // Art. 6 Abs. 6 [1]: höchstens die tatsächliche Prämie. Die App kennt nur die Prämie der
  // erwachsenen Person — nur deren Anteil wird gedeckelt (`deckelnProPerson`).
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');
  const annual = deckelnProPerson(r.total, r.anteilErwachsen, praemie);
  const maxAnnual = deckelnProPerson(r.maximal, r.maximalErwachsen, praemie);
  if (annual <= 0) return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.vsKeinAnspruch' });
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    noteKey: ipvData.noteKey, noteParams: ipvData.noteParams || {},
  });
}
