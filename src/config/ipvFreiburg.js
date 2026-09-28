// Prämienverbilligung (IPV) Kanton Freiburg — amtliches Stufenmodell, Jahr 2026 (K31).
// Eigenes Modul im Register IPV_MODULE (config/cantonalData.js), auf dem gemeinsamen Rahmen
// (config/kantonsModell.js).
//
// Belege (an der Quelle gelesen 28.09.2026), Wortlaute in docs/sources/ipv-kantone-2026.md,
// Abschnitt FR. Zitate in der Originalsprache (Französisch):
//   [1] Ordonnance concernant la réduction des primes d'assurance-maladie (ORP), RSF 842.1.13,
//       «Version actuelle en vigueur depuis le 01.01.2024 (Date d'adoption: 09.10.2023)», keine
//       künftige Version erfasst (BDLF-API, Version 8445, mit Annexe 1).
//       Art. 2 al. 1: Antrag bis 31. August · Art. 3: Einkommensgrenzen · Art. 4: Ausschluss ·
//       Art. 5 al. 1: revenu déterminant · Art. 6: Umfang, Kinder 80 %, Durchschnittsprämie 93 %
//       des EDI-Werts, höchstens die Nettoprämie · Art. 7a: Beginn frühestens im Antragsmonat ·
//       Annexe 1: 59 Stufen 1,00 % … 63,92 %, ab 60,01 % Abstand 65 %.
//   [2] Loi d'application de la LAMal (LALAMal), RSF 842.1.1, «Version actuelle en vigueur depuis
//       le 01.01.2017», keine künftige Version. Art. 12–15 (Ermächtigung, Umfang in Prozent einer
//       Durchschnittsprämie, höchstens 100 % der Nettoprämie) · Art. 20 (Rückerstattung).
//   [3] Caisse de compensation du canton de Fribourg (ECAS), «Mémento concernant la réduction des
//       primes d'assurance-maladie 2026» (6 S., Fusszeile «06.2023/ECAS» = Vorlagenstand).
//       Ziff. 1: Grenzen als Tabelle · Ziff. 8: amtliches Berechnungsbeispiel · Ziff. 8.1:
//       Durchschnittsprämien 2026 je Region · Ziff. 12.1: dieselbe Stufentabelle wie [1].
//   [4] ECAS, «Lissage des taux (60 paliers)» — dritte Abschrift derselben Tabelle; alle drei
//       zeichengleich (59 Zeilen + «60,01 % ou plus → 65,00 %»).
//   [5] EDI-Verordnung über die Durchschnittsprämien 2026 (EL), Anhang Ziff. 2: FR Region 1
//       7'332 / 5'352 / 1'752, Region 2 6'756 / 4'968 / 1'596 im Jahr. Nur Gegenprobe: 93 % davon
//       durch 12, aufgerundet, ergibt genau die Monatsbeträge in [3] (ORP Art. 6 al. 3).
//
// DAS MODELL IN EINEM SATZ
// Wer mit dem massgebenden Einkommen unter der Grenze seines Haushalts liegt, erhält einen
// Prozentsatz der regionalen Durchschnittsprämie — und der Prozentsatz hängt daran, um wie viel
// PROZENT das Einkommen unter der Grenze liegt (60 Stufen, 1 % bis 65 %; Kinder mindestens 80 %).
//
// WAS FREIBURG VON DEN BISHERIGEN KANTONEN UNTERSCHEIDET
// 1. DIE GRENZE IST DIE STELLSCHRAUBE, NICHT EIN ABZUG. Kinder senken das Einkommen nicht (anders
//    als LU, SG, BE), sie heben die Grenze um 14'000 je Kind (Art. 3 al. 2 [1]). Und die Grenze
//    einer Einzelperson springt mit dem ersten Kind von 37'000 auf 43'400 + 14'000 (Art. 3 al. 1
//    lit. a/b [1]).
// 2. DER ABSTAND IN PROZENT, NICHT IN FRANKEN. Dieselben 5'000 Franken unter der Grenze sind bei
//    einer Grenze von 37'000 13,51 %, bei 57'400 nur 8,71 %.
// 3. EINE PUBLIZIERTE GRENZE ALS ZAHL. Anders als LU, SG und AG veröffentlicht Freiburg die
//    Einkommensgrenze je Haushalt ([3] Ziff. 1) — die Anzeige nennt sie darum (`maxIncome`).
// 4. ANTRAG MIT HARTER FRIST. Bis 31. August des Anspruchsjahres, «Celle-ci n'entre pas en matière
//    sur les demandes présentées après cette échéance» (Art. 2 al. 1 [1]; das Mémento [3] Ziff. 3
//    schreibt «La Caisse AVS n'entre pas en matière …»). ⟨Zitat korrigiert 28.09.2026, Fachprüfung
//    K2: hier stand der Mémento-Wortlaut als Art. 2 al. 1.⟩ Der Anspruch
//    beginnt frühestens im Monat des Antrags (Art. 7a [1]). Wer im Vorjahr Verbilligung bezog,
//    wird von Amtes wegen geprüft ([3] Ziff. 7).
//
// GEWÄHLT, NICHT BELEGT (steht auch im PR und in FRAGEN-AN-DIE-AEMTER.md):
//   · Wie der Abstand gerundet wird. Die Tabelle springt in Hundertstel-Prozent (… 1,02 % / 1,03 %
//     …); das Beispiel [3] schreibt «33.33%». Die App rundet den Abstand kaufmännisch auf zwei
//     Stellen. Unterschied zur Abrundung: eine Stufe (rund 1,08 % der Durchschnittsprämie, in
//     Region 1 CHF 74 im Jahr), nur in einem Einkommensband von wenigen Franken je Stufe.
//   · Abstand über 0 %, aber unter 0,005 % (gerundet 0,00 %): die Tabelle beginnt bei 0,01 %, der
//     Mémento-Text sagt «réduction minimale de 1% les assurés qui ont un revenu déterminant de
//     moins de 1.03% inférieur à la limite légale». Die App folgt dem Text: unter der Grenze gibt
//     es mindestens 1 %.
//   · Rundung des Betrags: nirgends publiziert. Die App rechnet Satz × Monatsprämie × 12 je Person
//     und rundet die Summe auf ganze Franken.
//   · Kinder nur, solange sie das ganze Anspruchsjahr minderjährig sind (siehe unten).
//   ⟨korrigiert 28.09.2026 nach der Fachprüfung, W4⟩ Hier stand: «Stichtag fürs Alter: weder ORP noch
//   Mémento nennen einen. `ERWACHSEN.mangelsStichtag` wie BE und SG». Falsch: ORP Art. 3 al. 3 lit. b/c
//   [1] zählt die «jeune personne adulte … jusqu'à l'année de ses 25 ans», das Mémento Ziff. 8.1 den
//   «jeune adulte âgé de 19 à 25 ans» — eine JAHRGANGSREGEL. Erwachsen ist, wer im Anspruchsjahr 26
//   wird: `ERWACHSEN.imAnspruchsjahr` (wie LU und AG), BELEGT.
//
// BEWUSST NICHT GEBAUT (wie in den anderen Kantonen):
//   · Ehepaare, eingetragene Partnerschaften, Konkubinat, mehrere Erwachsene — das zweite Einkommen
//     fehlt der App (Art. 3 al. 1 lit. c [1]: eigene Grenze 65'000; Art. 5 al. 6 lit. c: bei
//     unverheirateten Eltern zählt das Kind beim Elternteil mit dem höheren Einkommen).
//   · Personen von 19 bis 25, die selbst beantragen (eigene Durchschnittsprämie «jeune adulte»),
//     und junge Erwachsene in Ausbildung als «enfant à charge» (Art. 3 al. 3 lit. b/c [1],
//     mindestens 50 %): die App kennt den Ausbildungsstatus nicht.
//   · Kinder, die im Anspruchsjahr 18 werden oder älter sind: «enfant à charge» ist nach Art. 3
//     al. 3 lit. a [1] das MINDERJÄHRIGE Kind; ab 18 hängt es an Ausbildung oder Einkommen.
//   · Quellenbesteuerte (Art. 5 al. 2 [1]: 80 % des Bruttoeinkommens), amtlich Veranlagte (Art. 4
//     al. 1 lit. b), Selbständige (Art. 5 al. 1 lit. b: andere Aufrechnungsliste), Zuzug (al. 8),
//     Neuberechnung bei 30 % Abweichung (al. 7), EL-Beziehende (ohne Antrag, eigene Regel [3]
//     Ziff. 7) und Sozialhilfe.
//   · Vom massgebenden Einkommen: Schuldzinsen über 30'000 und Liegenschaftsunterhalt über 15'000
//     (Art. 5 al. 1 lit. a Ziff. 2/3) — die App erfasst sie nicht. Umgekehrt fehlen der App alle
//     Steuerabzüge, die NICHT aufgerechnet werden (Berufsauslagen, Kinderbetreuung, Schuldzinsen
//     bis 30'000 …): das Einkommen fällt dadurch zu HOCH aus und der Betrag zu TIEF. Dieselbe
//     Näherung wie in allen Kantonen (i18n `ipv.naeherung`).
//   · Kein Mindestbetrag: weder ORP, LALAMal noch Mémento kennen einen (gesucht 28.09.2026).
//   · Weitere Näherungen (Fachprüfung 28.09.2026, K4): der Vermögensanteil nimmt 5 % der erfassten
//     Posten OHNE Schulden abzuziehen (die ORP meint die «fortune imposable», also netto) — wirkt nach
//     unten; bei Selbständigen rechnet die ORP die 3a NICHT auf (Art. 5 al. 1 lit. b, Mémento Ziff.
//     2.1.2 ohne Code 4.130), die App lässt sie im Einkommen — wirkt nach unten; ein im Anspruchsjahr
//     geborenes Kind zählt erst ab dem Geburtsmonat (Art. 5 al. 4), die App fürs ganze Jahr — wirkt
//     nach oben, selten.
import {
  vermoegenSumme, einkommenJahr, rohesEinkommenJahr, geburtsjahr, praemieJahr,
  jahrVorbei, mehrereErwachsene, praemieFehlt, ERWACHSEN, SAEULE_3A,
  kinderAlter, ALTER_UNERFASST, regionAusPLZ, deckelnProPerson,
  ergebnisOhneAnspruch, ergebnisMitAnspruch,
} from './kantonsModell.js';
import { getRegion } from '../data/praemienRegionen.js';

// Werte 2026. Beträge in CHF.
export const IPV_FR = {
  jahr: 2026,
  // Art. 5 al. 1 [1]: «période fiscale qui précède de deux ans … (année x – 2 ans)».
  basisjahrAbstand: 2,
  // Art. 3 al. 1 [1]: «inférieur à: a) 37'000 francs pour les personnes seules sans enfant;
  // b) 43'400 francs pour les personnes seules avec un ou plusieurs enfants à charge; c) 65'000
  // francs pour les couples mariés et les partenaires enregistrés.» · al. 2: «A ces montants
  // s'ajoutent 14'000 francs par enfant à charge.»
  grenze: { alleinOhneKind: 37000, alleinMitKind: 43400, paar: 65000, jeKind: 14000 },
  // Art. 4 al. 1 lit. a [1]: «revenu net (code 4.910) excède 150'000 francs ou … fortune
  // imposable (code 7.910) excède 250'000 francs».
  ausschluss: { einkommen: 150000, vermoegen: 250000 },
  // Art. 5 al. 1 lit. a Ziff. 4 [1]: «le vingtième (5 %) de la fortune imposable (code 7.910)».
  vermoegenAnteil: 0.05,
  // [3] Ziff. 8.1: «CHF 569.-- par mois pour un adulte, CHF 415.-- par mois pour un jeune adulte …
  // et CHF 136.-- par mois pour un enfant» (Region 1, district de la Sarine) · «CHF 524.-- …
  // CHF 386.-- … CHF 124.--» (Region 2). e = Erwachsene, j = junge Erwachsene, k = Kinder.
  durchschnittspraemie: {
    1: { e: 569, j: 415, k: 136 },
    2: { e: 524, j: 386, k: 124 },
  },
  // Art. 6 al. 2 [1]: «Pour les enfants, le taux de la réduction s'élève au minimum à 80 % de la
  // prime moyenne régionale».
  kinderMindestsatz: 80,
  // Annexe 1 [1] (= [3] Ziff. 12.1 = [4]): «Revenu déterminant inférieur à la limite légale de …
  // jusqu'à …» → «Taux appliqué sur la prime moyenne». Je Zeile [untere Grenze des Abstands in %,
  // Satz in %]; die obere Grenze ist die nächste untere Grenze minus 0,01. Der Test hält die
  // Tabelle zeichengleich gegen den Wortlaut.
  stufen: [
    [0.01, 1], [1.03, 2.08], [2.04, 3.17], [3.06, 4.25], [4.08, 5.34], [5.09, 6.42],
    [6.11, 7.51], [7.13, 8.59], [8.15, 9.68], [9.16, 10.76], [10.18, 11.85], [11.2, 12.93],
    [12.21, 14.02], [13.23, 15.1], [14.25, 16.19], [15.26, 17.27], [16.28, 18.36], [17.3, 19.44],
    [18.32, 20.53], [19.33, 21.61], [20.35, 22.69], [21.37, 23.78], [22.38, 24.86], [23.4, 25.95],
    [24.42, 27.03], [25.43, 28.12], [26.45, 29.2], [27.47, 30.29], [28.48, 31.37], [29.5, 32.46],
    [30.52, 33.54], [31.54, 34.63], [32.55, 35.71], [33.57, 36.8], [34.59, 37.88], [35.6, 38.97],
    [36.62, 40.05], [37.64, 41.14], [38.65, 42.22], [39.67, 43.31], [40.69, 44.39], [41.7, 45.47],
    [42.72, 46.56], [43.74, 47.64], [44.76, 48.73], [45.77, 49.81], [46.79, 50.9], [47.81, 51.98],
    [48.82, 53.07], [49.84, 54.15], [50.86, 55.24], [51.87, 56.32], [52.89, 57.41], [53.91, 58.49],
    [54.93, 59.58], [55.94, 60.66], [56.96, 61.75], [57.98, 62.83], [58.99, 63.92],
    // «de 60,01 % ou plus → 65,00 %»
    [60.01, 65],
  ],
  // Art. 2 al. 1 [1]: «au plus tard le 31 août de l'année en cours».
  frist: { monat: 8, tag: 31 },
};

// Prämienregion. [3] Ziff. 8.1: Region 1 = «district de la Sarine», Region 2 = «districts de la
// Broye, de la Glâne, de la Gruyère, du Lac, de la Singine et de la Veveyse». Abgeglichen am
// 28.09.2026 gegen das Amtliche Gemeindeverzeichnis des BFS (Stand 01.01.2026): alle 25 Gemeinden
// des Saanebezirks stehen in den BAG-Daten der App in Region 1, alle 94 übrigen in Region 2 —
// bis auf eine, die in den BAG-Daten noch fehlt:
//   Fétigny-Ménières (BFS 2056), Fusion auf 2026 aus Fétigny (2016) und Ménières (2027), beide
//   Region 2; Bezirk Broye laut BFS. Die PLZ-Daten der App führen schon die neue Gemeinde.
// Diese eine Zuordnung steht hier ausdrücklich, statt dass die Gemeinde keine Zahl bekäme.
const FUSION_2026 = { 2056: 2 };

export function frRegion(bfsNr) {
  const n = Number(bfsNr);
  const r = FUSION_2026[n] ?? getRegion(n);
  return r === 1 || r === 2 ? r : null;
}

// Die Einkommensgrenze des Haushalts, Art. 3 al. 1/2 [1].
export function frGrenze({ kinderZahl = 0, paar = false }) {
  const g = IPV_FR.grenze;
  const basis = paar ? g.paar : (kinderZahl > 0 ? g.alleinMitKind : g.alleinOhneKind);
  return basis + g.jeKind * kinderZahl;
}

// Um wie viel Prozent liegt das Einkommen unter der Grenze — auf zwei Stellen gerundet
// (GEWÄHLT, siehe Kopf). Das Beispiel [3]: (93'000 − 62'000) / 93'000 × 100 = 33.33.
export function frAbstand(me, grenze) {
  return Math.round(((grenze - me) / grenze) * 100 * 100) / 100;
}

// Der Satz in Prozent aus der Tabelle, Annexe 1 [1]. `null` = kein Anspruch (Einkommen nicht
// unter der Grenze).
export function frSatz(me, grenze) {
  if (!(me < grenze)) return null;
  const abstand = frAbstand(me, grenze);
  let satz = IPV_FR.stufen[0][1];
  for (const [ab, s] of IPV_FR.stufen) if (abstand >= ab) satz = s;
  return satz;
}

// Die Rechnung selbst — ohne App-Daten, damit die Tests sie gegen das amtliche Beispiel prüfen
// können. `paar` ist nur für diesen Test da (das Beispiel ist ein Ehepaar); die App ruft die
// Rechnung immer mit einer erwachsenen Person auf.
// Liefert Jahresbeträge in CHF, ungerundet.
export function ipvFreiburgRechnen({ region, kinderZahl = 0, me, paar = false }) {
  const p = IPV_FR;
  const dp = p.durchschnittspraemie[region];
  const erwachsene = paar ? 2 : 1;
  const grenze = frGrenze({ kinderZahl, paar });
  // me nie negativ: ein negatives Einkommen liegt 100 % unter der Grenze — oberste Stufe.
  const me0 = Math.max(0, me);
  const satz = frSatz(me0, grenze);
  // Vergleichsgrösse «höchstens möglich»: die oberste Stufe (65 %) bzw. 80 % für Kinder —
  // nicht die ganze Durchschnittsprämie, die Freiburg nie ganz verbilligt.
  const hoechstsatz = p.stufen[p.stufen.length - 1][1];
  const maximalErwachsen = (hoechstsatz / 100) * dp.e * 12;
  const maximal = erwachsene * maximalErwachsen + kinderZahl * (p.kinderMindestsatz / 100) * dp.k * 12;
  if (satz === null) {
    return { satz: null, kinderSatz: null, grenze, abstand: frAbstand(me0, grenze), total: 0, anteilErwachsen: 0, anteilKind: 0, maximal, maximalErwachsen };
  }
  // Art. 6 al. 2 [1]: Kinder mindestens 80 % — aber nur, wo der Haushalt anspruchsberechtigt ist
  // ([3] Ziff. 8: «Pour les enfants à charge, dont les parents font partie du cercle des ayants
  // droit défini à l'article 3»).
  const kinderSatz = Math.max(satz, p.kinderMindestsatz);
  const anteilErwachsen = (satz / 100) * dp.e * 12;
  const anteilKind = (kinderSatz / 100) * dp.k * 12;
  return {
    satz, kinderSatz, grenze, abstand: frAbstand(me0, grenze),
    total: erwachsene * anteilErwachsen + kinderZahl * anteilKind,
    anteilErwachsen, anteilKind, maximal, maximalErwachsen,
  };
}

// Kinder: «enfant à charge» ist nach Art. 3 al. 3 lit. a [1] das MINDERJÄHRIGE Kind. Eigener Grund
// `kindVolljaehrig` (Fachprüfung 28.09.2026, W3: vorher `haushalt`, der von «Paaren» spricht und
// alleinerziehende Personen falsch anredete). Wer im
// Anspruchsjahr 18 wird, ist es ab dem Geburtstag nur noch mit Ausbildung (lit. b) oder tiefem
// Einkommen (lit. c) — beides kennt die App nicht. Darum strenger als der Rahmen (`UEBER_18`):
// gerechnet wird nur, solange jedes Kind das ganze Jahr minderjährig ist.
const NICHT_GANZJAEHRIG_MINDERJAEHRIG = (alter) => alter.some((a) => a >= 18);

// Aufruf aus calculateIPV (config/cantonalData.js) über das Register IPV_MODULE.
export function ipvFreiburg(data, hh, ipvData, youngAdultsCount, orientierung, lookupPLZ) {
  const b = data.basis || {};
  const f = data.finanzen || {};
  const jahr = IPV_FR.jahr;
  // Die Durchschnittsprämien ändern jährlich ([3] Ziff. 8.1). Das Mémento 2027 war am 28.09.2026
  // auf der Seite der ECAS noch nicht publiziert — ab dem 01.01. des Folgejahres keine Zahl.
  if (jahrVorbei(jahr)) return orientierung('jahr');
  if (mehrereErwachsene(hh, b)) return orientierung('haushalt');
  // ORP Art. 3 al. 3 lit. b/c [1]: junge Erwachsene «jusqu'à l'année de ses 25 ans»; Mémento
  // Ziff. 8.1: «jeune adulte âgé de 19 à 25 ans». Erwachsen ist also, wer im Anspruchsjahr 26 wird
  // (Jahrgang 2000 für 2026) — belegt, wie LU und AG. Personen 19–25 rechnen mit einer eigenen
  // Durchschnittsprämie und oft über die Eltern: bewusst nicht gebaut.
  const geburt = geburtsjahr(b);
  if (!geburt || !ERWACHSEN.imAnspruchsjahr(jahr, geburt)) return orientierung('alter');
  // Alter im Anspruchsjahr; beim eingetippten Alter ein Jahr dazu (vorsichtig, wie BE/SG/LU).
  const kinderJahre = kinderAlter(hh.children, jahr, 1);
  if (ALTER_UNERFASST(kinderJahre)) return orientierung('alter');
  if (NICHT_GANZJAEHRIG_MINDERJAEHRIG(kinderJahre)) return orientierung('kindVolljaehrig');

  const { region } = regionAusPLZ({ data, kanton: 'FR', lookupPLZ, regionFn: frRegion });
  if (!region) return orientierung('region');

  const kinderZahl = kinderJahre.length;
  const vermoegen = vermoegenSumme(f);
  // Art. 4 al. 1 lit. a [1]: über 250'000 steuerbarem Vermögen kein Anspruch. Die App kennt nur
  // die erfassten Posten, nicht das steuerbare Vermögen — darum Orientierung statt «kein Anspruch».
  if (vermoegen > IPV_FR.ausschluss.vermoegen) return orientierung('vermoegen');
  // Ein negatives Einkommen ist ein Vertipper und ergäbe sonst die oberste Stufe (wie BE).
  if (rohesEinkommenJahr(f) < 0) return orientierung('einkommenNegativ');

  // Art. 5 al. 1 lit. a [1]: revenu net (4.910) + «les primes et cotisations d'assurance (codes
  // 4.110 à 4.140)» + 5 % der fortune imposable. Unter 4.130 steht in der Freiburger Steuer-
  // erklärung die Säule 3a (SCC, «Instructions générales», Code 4.130 «Formes reconnues de
  // prévoyance individuelle liée (3e pilier a)») — sie wird also unbedingt aufgerechnet und steckt
  // im Nettoeinkommen der App schon: Regel `voll`.
  const einkommen = einkommenJahr(f, SAEULE_3A.voll);
  const me = einkommen + IPV_FR.vermoegenAnteil * vermoegen;

  const r = ipvFreiburgRechnen({ region, kinderZahl, me });
  const basisjahr = jahr - IPV_FR.basisjahrAbstand;
  // Die Grenze ist amtlich als Zahl publiziert ([3] Ziff. 1) — darum zeigt die Anzeige sie.
  const cantonData = { ...ipvData, maxIncome: r.grenze };
  const gemeinsam = {
    canton: 'FR', cantonData, jahr, vorbehaltKey: 'ipv.vorbehaltFR', extra: { region, basisjahr },
  };
  // Art. 4 al. 1 lit. a [1]: über 150'000 Nettoeinkommen kein Anspruch. Greift nur, wo die
  // Haushaltsgrenze selbst darüber liegt (ab acht Kindern) — sonst ist die Grenze tiefer.
  if (einkommen > IPV_FR.ausschluss.einkommen) {
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.incomeAboveLimit', noteParams: { value: IPV_FR.ausschluss.einkommen } });
  }
  if (r.satz === null) {
    return ergebnisOhneAnspruch({ ...gemeinsam, noteKey: 'ipv.frKeinAnspruch', noteParams: { value: r.grenze } });
  }

  // Art. 6 al. 4 [1]: «La réduction ne peut pas dépasser 100 % de la prime nette due par
  // l'assuré-e». Die App kennt nur die Prämie der erwachsenen Person — nur deren Anteil wird
  // gedeckelt, der Kinderanteil bleibt ungedeckelt (`deckelnProPerson`, wie ZH, BE, LU).
  const praemie = praemieJahr(data);
  if (praemieFehlt(praemie)) return orientierung('praemie');
  const annual = deckelnProPerson(r.total, r.anteilErwachsen, praemie);
  const maxAnnual = deckelnProPerson(r.maximal, r.maximalErwachsen, praemie);

  // Art. 2 al. 1 [1]: Antrag bis 31. August des Anspruchsjahres; danach tritt die Kasse nicht
  // mehr darauf ein (Ausnahmen al. 2: neu Sozialhilfe, Zuzug aus dem Ausland, Wegfall der EL).
  // Wer im Vorjahr Verbilligung bezog, wird von Amtes wegen geprüft ([3] Ziff. 7) — ob das
  // zutrifft, weiss die App nicht. Darum nach der Frist: nirgends abgezogen (data/ipvAbzug.js),
  // wie in LU; der Hinweistext dazu ist der Freiburger (`fristNichtAbgezogenKey`).
  const fristVorbei = new Date() > new Date(`${jahr}-08-31T23:59:59`);
  return ergebnisMitAnspruch({
    ...gemeinsam, annual, maxAnnual, youngAdultsCount,
    extra: { ...gemeinsam.extra, anmeldefristVorbei: fristVorbei, fristNichtAbgezogenKey: 'ipv.frFristNichtAbgezogen' },
    noteKey: fristVorbei ? 'ipv.frFristVorbei' : 'ipv.frFristLaeuft',
    noteParams: { jahr, folgejahr: jahr + 1 },
  });
}
