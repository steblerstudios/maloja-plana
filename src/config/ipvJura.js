// Prämienverbilligung (IPV) Kanton Jura — Stufentabelle, Jahr 2026 (K31).
// Eigenes Modul im Register IPV_MODULE (config/cantonalData.js), auf dem gemeinsamen Rahmen
// (config/kantonsModell.js).
//
// 🛑 DIE APP ZEIGT FÜR DEN JURA BEWUSST KEINE ZAHL — `orientierung('steuerbaresEinkommen')`.
// Massgebend ist das STEUERBARE Einkommen der definitiven Veranlagung 2024 (Chiffre 690, nach
// allen Steuerabzügen), korrigiert nach dem Arrêté. Die App kennt nur das Nettoeinkommen; jeder
// Steuerabzug, den sie nicht kennt (Berufsauslagen, Versicherungsprämien, Säule 3a, Sozialabzüge
// …), fehlt ihr, und das Einkommen fiele zu HOCH aus. In einer Tabelle mit Stufen von 1'000
// Franken (Erwachsene 10–20 CHF im Monat je Stufe) und dem Ende für Erwachsene bei 26'999 hiesse
// das: zu tiefe Beträge und «kein Anspruch», wo einer besteht — nach dem Block bei
// `einkommenJahr` (kantonsModell.js) NICHT die vorsichtige Seite.
// ⟨korrigiert 28.09.2026 nach der Fachprüfung #483, ⚠️ 4 — hier stand: «Anders als AG und BE, wo die
// Näherung über das Nettoeinkommen läuft: dort ist die Grösse das Rein- bzw. bereinigte Einkommen
// und die Rechnung linear bzw. in Stufen von 8'000–10'000 Franken.» Das beschrieb AG falsch: AG
// rechnet ebenfalls mit einer Steuergrösse NACH Abzügen (bereinigtes steuerbares Einkommen, § 6
// Abs. 2 KVGG), und AG und BE tragen dieselbe Fehlerrichtung (Einkommen zu hoch, Betrag zu tief).⟩
// Der tragfähige Unterschied ist die GRÖSSE DER LÜCKE im Verhältnis zum schmalen Anspruchsband:
// Netto → steuerbar sind im Jura für eine angestellte Person rund 7'000–10'000 Franken
// (Berufsauslagen, Mahlzeiten, Fahrkosten, Versicherungsabzug — Guide général 2025 des Service des
// contributions, gemessen in der Fachprüfung), also 7–10 der 27 Stufen, in denen Erwachsene
// überhaupt etwas erhalten; bei Alleinerziehenden (Abzüge je Kind) über 20 Stufen. Eine Näherung
// würde gut ein Drittel des Bandes auf «kein Anspruch» setzen. Die Ausgleichskasse sagt es selbst:
// «Le revenu déterminant ne correspond pas au revenu imposable» [3].
// Rechnen würde das Modul sofort, sobald die App das steuerbare Einkommen der Veranlagung kennt —
// ein neues Feld ist ein Produktentscheid von Stebler Studios (PR, Bericht).
//
// Belege (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt JU:
//   [1] Arrêté concernant la réduction des primes dans l'assurance-maladie pour l'année 2026
//       (RSJU 832.115.1), du 28 octobre 2025, en vigueur du 1er janvier au 31 décembre 2026 (Art. 5),
//       mit Annexe 1 (Tabelle) und Annexe 2 (supplément famille). Seiten 1–3 sind ein Scan OHNE
//       Textlayer — gelesen am Seitenbild. 🛑 Die Tabellenseite trägt im Textlayer eine verdeckte
//       Überschrift «pour l'année 2025»; sichtbar steht «pour l'année 2026». Werte am Seitenbild
//       geprüft; Textlayer und Bild stimmen in allen Zahlen überein.
//   [2] Ordonnance concernant la réduction des primes dans l'assurance-maladie (RSJU 832.115),
//       du 25 octobre 2011, Fassung «valable dès 01.01.2026» (PDF der ECAS). Art. 7, 7a, 8, 9, 13,
//       14, 19, 20, 21, 22.
//   [3] Caisse de compensation du canton du Jura (ECAS), «Réduction des primes d'assurance-maladie
//       (RPI) - Informations générales 2026» (Seite, Stand 28.09.2026): Grenzen 27'000 / 53'000,
//       Prüfung von Amtes wegen, sonst Gesuch bis 31.12.2026.
//
// DAS MODELL IN EINEM SATZ
// Das massgebende Einkommen (steuerbares Einkommen 2024, korrigiert) fällt in eine Stufe von
// 1'000 Franken; jede Stufe hat einen festen Monatsbetrag je Personenkategorie (Erwachsene 225 →
// 15 bis 26'999; Kinder 100 bis 52'999), dazu für Eltern mit Erwerb ein Familienzuschlag bis 17'999.
//
// FÜR DEN TAG, AN DEM DIE ZAHL KOMMT (Fachprüfung #483, 💡 8/9):
//   · Ordonnance Art. 20 [2]: «La réduction annuelle accordée à un assuré ne peut dépasser le montant
//     de sa prime annuelle» → dann `praemieFehlt` + `deckelnProPerson` wie in den anderen Kantonen.
//   · Genau 150'000 Vermögen: die Ordonnance (Art. 7a) schliesst aus, was «supérieure à 150 000»
//     ist; die ECAS schreibt «doit être inférieure à 150 000 francs». Bei genau 150'000 widersprechen
//     sich die beiden — `juRiegel` folgt der Ordonnance (`>`).
//
// BEWUSST NICHT GEBAUT (auch wenn die Zahl käme): Paare/Konkubinat (Einkommen und Vermögen der
// zweiten Person, Art. 8a [2]) · Personen unter 25 und Kinder 16–18 ohne Ausbildung (Ausbildung
// fehlt der App) · Quellenbesteuerte (Art. 8 Abs. 3 [2]) · amtlich Veranlagte (Art. 13 lit. b) ·
// EL/Sozialhilfe (volle Prämie, Art. 10) · Zuzug (Art. 22 Abs. 5) · Moutier (Art. 1 Abs. 8 [1]).
import {
  geburtsjahr, jahrVorbei, mehrereErwachsene, ERWACHSEN,
  kinderAlter, ALTER_UNERFASST, UEBER_18,
} from './kantonsModell.js';

export const IPV_JU = {
  jahr: 2026,
  // Art. 1 Abs. 1 [1]: «le revenu imposable taxé définitivement pour l'année fiscale 2024».
  basisjahr: 2024,
  // Annexe 1 [1], CHF pro Monat. Zeile i = Stufe «de i'000 à i'999» (i = 0 … 52); die Zeile
  // «inférieur à 0» ist gleich der Stufe 0. Spalten: e = Adultes · j = Adultes de moins de 25 ans
  // révolus · jf = … qui suivent une formation · m = Mineurs de 16 à 18 ans qui ne suivent pas de
  // formation · k = Enfants de moins de 18 ans révolus. Ab Stufe 27 für e, j, m: 0.00.
  erwachsene: [225, 215, 205, 195, 185, 175, 165, 155, 145, 125, 110, 100, 95, 90, 85, 75, 70, 65, 60, 55, 45, 40, 35, 30, 25, 20, 15],
  jungeErwachsene: [160, 155, 150, 145, 140, 135, 130, 125, 120, 110, 100, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15],
  jungeInAusbildung: 196,
  minderjaehrigOhneAusbildung: [45, 45, 45, 45, 40, 40, 40, 35, 35, 35, 30, 30, 30, 25, 25, 25, 20, 20, 20, 15, 15, 15, 10, 10, 10, 10, 10],
  kind: 100,
  // Letzte Stufe mit Anspruch: Erwachsene «de 26'000 à 26'999», Kinder/in Ausbildung «de 52'000 à
  // 52'999» (Annexe 1 [1]); [3]: «inférieur à CHF 27'000.00» / «inférieur à CHF 53'000.00».
  grenze: { erwachsene: 27000, kinder: 53000 },
  // Annexe 2 [1], supplément famille je Erwachsene/r, CHF pro Monat, Stufen 0 … 17 («inférieur à
  // 0» wie Stufe 0; «plus de 17'999» → 0). Art. 4 Abs. 1 [1]: Eltern mit Kind und «activité
  // professionnelle principale», revenu déterminant unter 18'000.
  familienzuschlag: [300, 300, 300, 300, 285, 265, 235, 205, 175, 145, 115, 105, 95, 85, 70, 55, 25, 15],
  // Art. 1 Abs. 5 [1]: Abzüge vom steuerbaren Einkommen.
  abzug: { ohneKindVerheiratetEtc: 5000, mitKind: 10000, kind12: 4000, kindAb3: 6000 },
  // Art. 1 Abs. 6 [1]: «majoré de 5 % de la fortune imposable (chiffre 890)».
  vermoegenAnteil: 0.05,
  // Art. 7a Abs. 1 [2]: «fortune déterminante … supérieure à 150 000 francs» → kein Anspruch;
  // Art. 1 Abs. 2 [1]: «titres et autres placements de capitaux selon avis de taxation (chiffre 740)».
  vermoegensgrenze: 150000,
};

// Stufe nach Art. 9 Abs. 2 [2]: «paliers de mille francs». Unter 0 wie Stufe 0.
export function juStufe(revenuDeterminant) {
  return Math.max(0, Math.floor(revenuDeterminant / 1000));
}

// Massgebendes Einkommen nach Art. 1 Abs. 4–6 [1] AUS DEM STEUERBAREN EINKOMMEN. Die App hat
// diese Grösse nicht — die Funktion steht, damit die Rechnung beim Produktentscheid nicht neu
// erfunden wird. `aufrechnungen` = Summe der Korrekturen nach Abs. 4 (Schuldzinsen, 3a, 2.-Säule-
// Einkäufe …). Abs. 5 lit. a gilt nur für «marié, veuf, divorcé ou séparé» OHNE Kind — nicht für
// Ledige; lit. b für alle mit Kinderabzug.
export function juMassgebend({ revenuImposable, aufrechnungen = 0, fortuneImposable = 0, kinderZahl = 0, ledig = true }) {
  const a = IPV_JU.abzug;
  let abzug = 0;
  if (kinderZahl > 0) {
    abzug += a.mitKind;
    for (let i = 0; i < kinderZahl; i++) abzug += i < 2 ? a.kind12 : a.kindAb3;
  } else if (!ledig) {
    abzug += a.ohneKindVerheiratetEtc;
  }
  return revenuImposable + aufrechnungen - abzug + IPV_JU.vermoegenAnteil * fortuneImposable;
}

// Die Tabelle: Monatsbeträge einer erwachsenen Person (ab 25) mit `kinderZahl` Kindern unter 16
// (oder 16–17 in Ausbildung). ⚠️ Für 16- und 17-Jährige OHNE Ausbildung gilt die Spalte «Mineurs
// de 16 à 18 ans qui ne suivent pas de formation» (`minderjaehrigOhneAusbildung`) statt 100 —
// die App kennt den Ausbildungsstatus nicht.
export function ipvJuraRechnen({ revenuDeterminant, kinderZahl = 0, erwerb = false }) {
  const p = IPV_JU;
  const stufe = juStufe(revenuDeterminant);
  const erwachsen = p.erwachsene[stufe] ?? 0;
  const kind = stufe < p.grenze.kinder / 1000 ? p.kind : 0;
  const zuschlag = kinderZahl > 0 && erwerb ? (p.familienzuschlag[stufe] ?? 0) : 0;
  const monat = erwachsen + zuschlag + kinderZahl * kind;
  return { stufe, erwachsen, kind, zuschlag, monat, jahr: monat * 12 };
}

// Die Riegel für den Tag, an dem die Zahl kommt — in der Reihenfolge des Erlasses. HEUTE NICHT
// AUFGERUFEN (Fachprüfung #483, ⚠️ 1): solange JU ohnehin keine Zahl zeigt, hätten sie nur
// Sackgassen erzeugt (ein Eingabefeld «Geburtsdatum», nach dem trotzdem keine Zahl kommt) und die
// Jura-Auskunft (Prüfung von Amtes wegen, Frist) hinter einem allgemeinen Satz versteckt.
// Liefert den Grund oder `null`.
export function juRiegel(data, hh) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_JU.jahr;
  if (mehrereErwachsene(hh, b)) return 'haushalt';
  // Arrêté und Verordnung nennen keinen Stichtag fürs Alter — gewählt wie BE/SG.
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.mangelsStichtag(jahr, geburt)) return 'alter';
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return 'alter';
  if (UEBER_18(kinderJahre)) return 'haushalt';
  // Art. 7a [2] / Art. 1 al. 2 [1]: massgebend sind «les titres et autres placements de capitaux
  // selon avis de taxation (chiffre 740)»; die ECAS («seuil de fortune», 28.09.2026): «titres,
  // comptes bancaires, actions en bourse, actions et parts sociales non cotées». Darum NUR
  // Wertschriften und Bankguthaben — nicht `otherAssets` (Bargeld, Fahrzeuge …), anders als
  // `vermoegenSumme` (Fachprüfung #483, ⚠️ 2). Eigener Grund: «steuerbares Gesamtvermögen» wäre hier falsch.
  const ziffer740 = Number(f.securitiesValue || 0) + Number(f.savingsAccount || 0);
  // Der Text `ipv.offenGrund.vermoegenJU` (Ziffer 740) entsteht, wenn `juRiegel` angeschlossen wird.
  if (ziffer740 > IPV_JU.vermoegensgrenze) return 'vermoegenJU';
  return null;
}

// Aufruf aus calculateIPV (config/cantonalData.js) über das Register IPV_MODULE.
// Nach dem Jahres-Riegel direkt die Orientierung mit dem Jura-Grund — in JEDER Lage.
export function ipvJura(data, hh, ipvData, youngAdultsCount, orientierung) {
  // Art. 5 [1]: gilt «jusqu'au 31 décembre 2026».
  if (jahrVorbei(IPV_JU.jahr)) return orientierung('jahr');
  return orientierung('steuerbaresEinkommen');
}
