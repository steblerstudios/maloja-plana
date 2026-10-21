// Lohnabzüge, Referenzalter und BVG-Grundwerte leben seit 25.09.2026 in ./lohnAbzuege.js (klein,
// im Startbündel für die Sozialhilfe-Schnellrechnung). Hier nur importiert und weitergereicht —
// bestehende Importe aus ahvRechner.js funktionieren unverändert.
import { werteFuerStichtag } from './jahrestabelle.js';
import { REFERENZALTER, KOORDINATIONSABZUG, LOHN_WERTE_JE_JAHR, lohnWerte, referenzalterMonate, BVG_EINTRITTSSCHWELLE_JAHR, bvgKoordinationsabzug, BVG_GUTSCHRIFTEN, bvgAltersgutschriftSatz, AHV_ALV_ARBEITNEHMER_SATZ, AHV_IV_EO_SATZ_AN, ALV_SATZ_AN, ALV_HOECHSTBETRAG_JAHR, AHV_FREIBETRAG_RENTNER_MONAT, nettoZuBruttoRichtwert, bruttoZuNettoRichtwert } from './lohnAbzuege.js';
export { LOHN_WERTE_JE_JAHR, lohnWerte, referenzalterMonate, BVG_EINTRITTSSCHWELLE_JAHR, bvgKoordinationsabzug, bvgAltersgutschriftSatz, AHV_ALV_ARBEITNEHMER_SATZ, AHV_IV_EO_SATZ_AN, ALV_SATZ_AN, ALV_HOECHSTBETRAG_JAHR, AHV_FREIBETRAG_RENTNER_MONAT, nettoZuBruttoRichtwert, bruttoZuNettoRichtwert };
// AHV-Rentenrechner für Maloja Plana
// Quelle: Art. 34–40 AHVG, Verordnung über die AHV (AHVV)
// Stand: Werte 2026 und 2027 als Jahrestabelle (Renten nach AHV-Reform AHV21, in Kraft seit 01.01.2024)
// Referenzalter: 65 (Männer und Frauen ab Jahrgang 1964)
//
// Alle Beträge in CHF/Monat. Keine Netzwerk-Calls, reine Berechnung.

// === AHV-Parameter je Kalenderjahr: AHV_WERTE_JE_JAHR (weiter unten, nach SKALA_44) ===
const MIN_BEITRAGSJAHRE = 1;
const VOLLE_BEITRAGSJAHRE = 44;   // Skala 44 = Vollrente

// Vorbezug
const VORBEZUG_KUERZUNG_PRO_MONAT = 0.005667; // 6.8% pro Jahr (gesetzlicher AHV-Vorbezugssatz)

// Aufschub: Erhöhungssätze in Prozent der Altersrente, Art. 55ter Abs. 1 AHVV (SR 831.101),
// Fassung in Kraft seit 1.1.2025 (AS 2024 462), konsolidierter Stand 1.1.2026. Wörtlich aus
// https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/63/1185_1183_1185/20260101/de/html/fedlex-data-admin-ch-eli-cc-63-1185_1183_1185-20260101-de-html.html
// (abgerufen 2026-09-15 15:56 UTC); identisch im BSV-Merkblatt 3.04 «Flexibler Rentenbezug»
// Ziff. 14, Stand 1.1.2026 (https://www.ahv-iv.ch/p/3.04.d, abgerufen 2026-09-15 15:54 UTC).
// Zeile = volle Aufschubsjahre 1–5, Spalte = zusätzliche Monate 0–2 / 3–5 / 6–8 / 9–11.
// Nicht linear: die Tabelle ist versicherungsmathematisch gestaffelt (Art. 39 Abs. 3 AHVG).
const AUFSCHUB_ZUSCHLAG_TABELLE = [
  [5.2, 6.6, 8.0, 9.4],      // 1 Jahr
  [10.8, 12.3, 13.9, 15.5],  // 2 Jahre
  [17.1, 18.8, 20.5, 22.2],  // 3 Jahre
  [24.0, 25.8, 27.7, 29.6],  // 4 Jahre
  [31.5],                    // 5 Jahre = Höchstdauer
];
const AUFSCHUB_MIN_MONATE = 12; // Art. 39 Abs. 1 AHVG: «um mindestens ein Jahr, höchstens aber um fünf Jahre»
const AUFSCHUB_MAX_MONATE = 60;

/**
 * Zuschlag beim Rentenaufschub in Prozent, nach Aufschubsdauer in Monaten.
 * Unter 12 Monaten gibt es keinen Aufschub (Art. 39 Abs. 1 AHVG) und damit keinen
 * Zuschlag; über 60 Monaten bleibt es beim Höchstwert 31,5 %.
 *
 * @param {number} monate - Aufschubsdauer in Monaten
 * @returns {number} Erhöhungssatz in Prozent (z. B. 5.2)
 */
export function aufschubZuschlagProzent(monate) {
  const m = Math.min(Math.max(0, Math.floor(Number(monate) || 0)), AUFSCHUB_MAX_MONATE);
  if (m < AUFSCHUB_MIN_MONATE) return 0;
  const zeile = AUFSCHUB_ZUSCHLAG_TABELLE[Math.floor(m / 12) - 1];
  return zeile[Math.min(Math.floor((m % 12) / 3), zeile.length - 1)];
}

// Erziehungsgutschriften pro Kind (pauschal, jährlich, geteilt bei gemeinsamer elterlicher Sorge):
// `erziehungsgutschriftJahr` in AHV_WERTE_JE_JAHR (3× minimale jährliche Altersrente).

/**
 * Volle Beitragsdauer des Jahrgangs: so viele Beitragsjahre braucht es für die Vollrente.
 * BSV-Merkblatt 3.01, Stand 1.1.2026, Ziff. 12: «gleich viele Beitragsjahre wie Ihr Jahrgang,
 * d. h. … ab dem 1. Januar nach Vollendung des 20. Altersjahres bis zum Ende des Kalenderjahres
 * vor dem Referenzalter». Für Männer und Frauen ab JG 1964 immer 44; bei Frauen der
 * Übergangsjahrgänge 1961–63 hängt es am Geburtsmonat (Merkblatt-Beispiel Ziff. 30: geb.
 * 17.2.1962, Referenzalter 64 J 6 M im August 2026 → 1983–2025 = 43 Jahre → Skala 44).
 * Ohne Geburtsmonat bleibt es bei 44 (vorsichtig, wie bisher).
 *
 * @param {Object} p
 * @param {number} p.geburtsjahr
 * @param {number} [p.geburtsmonat] - 1–12
 * @param {string} [p.geschlecht]
 * @returns {number} 1–44
 */
export function volleBeitragsdauer({ geburtsjahr, geburtsmonat, geschlecht } = {}) {
  const gj = Number(geburtsjahr);
  const gm = Number(geburtsmonat);
  if (!Number.isInteger(gj) || !(gm >= 1 && gm <= 12)) return VOLLE_BEITRAGSJAHRE;
  const refMonate = referenzalterMonate({ geschlecht, geburtsjahr: gj });
  const jahrReferenzalter = gj + Math.floor((Math.floor(gm) - 1 + refMonate) / 12);
  const dauer = jahrReferenzalter - (gj + 21); // 1.1. nach dem 20. Geburtstag bis 31.12. davor
  return Math.min(VOLLE_BEITRAGSJAHRE, Math.max(MIN_BEITRAGSJAHRE, dauer));
}

// Skala: Beitragsjahre → Bruchteil der Vollrente (Art. 52 AHVV), gemessen an der vollen
// Beitragsdauer des Jahrgangs (Merkblatt 3.01 Ziff. 12/13). Anteilig gerechnet; die amtlichen
// Teilrenten-Tabellen (Skala 1–43) runden zusätzlich auf ganze Franken.
function skalenFaktor(beitragsjahre, volleDauer = VOLLE_BEITRAGSJAHRE) {
  if (beitragsjahre >= volleDauer) return 1;
  if (beitragsjahre < MIN_BEITRAGSJAHRE) return 0;
  return beitragsjahre / volleDauer;
}

// Skala 44, monatliche Vollrente (Alters- und Invalidenrente 1/1), Beträge in Franken.
// Wörtlich aus dem BSV-Merkblatt 3.01 «Altersrenten und Hilflosenentschädigungen der AHV»,
// Stand 1.1.2026, Anhang S. 18 «AHV/IV-Renten ab 1. Januar 2025 · Skala 44: Monatliche
// Vollrenten» (https://www.ahv-iv.ch/p/3.01.d, abgerufen 2026-10-21 14:19 UTC, pdftotext -layout).
// Die Tabelle gilt seit 1.1.2025 unverändert auch 2026. Paare [massgebendes durchschnittliches
// Jahreseinkommen, Monatsrente]; Schritt 1512 CHF. Nicht linear: zwei Steigungen mit Knick bei
// 45'360 (Art. 34 Abs. 2 AHVG, fester + variabler Rententeil), dazu die Rundung der Tabelle.
const SKALA_44_2026 = [
  [15120, 1260], [16632, 1293], [18144, 1326], [19656, 1358], [21168, 1391],
  [22680, 1424], [24192, 1457], [25704, 1489], [27216, 1522], [28728, 1555],
  [30240, 1588], [31752, 1620], [33264, 1653], [34776, 1686], [36288, 1719],
  [37800, 1751], [39312, 1784], [40824, 1817], [42336, 1850], [43848, 1882],
  [45360, 1915], [46872, 1935], [48384, 1956], [49896, 1976], [51408, 1996],
  [52920, 2016], [54432, 2036], [55944, 2056], [57456, 2076], [58968, 2097],
  [60480, 2117], [61992, 2137], [63504, 2157], [65016, 2177], [66528, 2197],
  [68040, 2218], [69552, 2238], [71064, 2258], [72576, 2278], [74088, 2298],
  [75600, 2318], [77112, 2339], [78624, 2359], [80136, 2379], [81648, 2399],
  [83160, 2419], [84672, 2439], [86184, 2460], [87696, 2480], [89208, 2500],
  [90720, 2520],
];

// Skala 44 ab 1.1.2027, Spalte «Alters- und Invalidenrente 1/1», wörtlich aus BSV «Monatliche
// Vollrenten, Skala 44 · Gültig ab 1. Januar 2027» (318.117.1 df 8.26), S. 1
// (https://sozialversicherungen.admin.ch/de/d/6462/download, abgerufen 22.10.2026, PDF 190 639 Byte,
// SHA-256 6f633eea…5b20b9d75, pdftotext -layout; alle 51 Zeilen maschinell übernommen, Schritt
// 1536, monoton steigend geprüft). Knick bei 46'080, letzte Zeile «92 160 und mehr → 2 560».
const SKALA_44_2027 = [
  [15360, 1280], [16896, 1313], [18432, 1347], [19968, 1380], [21504, 1413],
  [23040, 1446], [24576, 1480], [26112, 1513], [27648, 1546], [29184, 1580],
  [30720, 1613], [32256, 1646], [33792, 1679], [35328, 1713], [36864, 1746],
  [38400, 1779], [39936, 1812], [41472, 1846], [43008, 1879], [44544, 1912],
  [46080, 1946], [47616, 1966], [49152, 1987], [50688, 2007], [52224, 2028],
  [53760, 2048], [55296, 2068], [56832, 2089], [58368, 2109], [59904, 2130],
  [61440, 2150], [62976, 2171], [64512, 2191], [66048, 2212], [67584, 2232],
  [69120, 2253], [70656, 2273], [72192, 2294], [73728, 2314], [75264, 2335],
  [76800, 2355], [78336, 2376], [79872, 2396], [81408, 2417], [82944, 2437],
  [84480, 2458], [86016, 2478], [87552, 2499], [89088, 2519], [90624, 2540],
  [92160, 2560],
];

// === AHV-Parameter je Kalenderjahr (Weg A, Entscheid Sophie 21.10.2026) ===
// Auswahl nach Stichtag über `ahvWerte(stichtag)`, damit die App am 1.1. von selbst umschaltet.
// 2027 belegt an:
//   • Verordnung über Anpassungen an die Lohn- und Preisentwicklung bei der AHV/IV/EO ab dem Jahr
//     2027 vom 2. Oktober 2026 (Fedlex eli/cc/2026/542, Stand 1.1.2027, abgerufen 21.10.2026),
//     Art. 3 Abs. 1: «Der Mindestbetrag der vollen Altersrente … wird auf 1280 Franken festgesetzt.»
//     https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/2026/542/20270101/de/html/fedlex-data-admin-ch-eli-cc-2026-542-20270101-de-html.html
//   • Skala 44 2027 (oben): 15 360 → 1 280 · 92 160 und mehr → 2 560.
//   • Plafond Ehepaar 3 840 (150 % von 2 560): BSV-Übersicht «Änderungen auf 1. Januar 2027», S. 1.
// Gerechnet, nicht zitiert (Regel × belegter Betrag):
//   • erziehungsgutschriftJahr = «dreifache minimale jährliche Altersrente» (Art. 29sexies Abs. 2
//     AHVG, Fedlex Stand 1.1.2027): 2026 3 × 15 120 = 45 360 · 2027 3 × 15 360 = 46 080. Massgebend
//     ist der Betrag «im Zeitpunkt der Entstehung des Rentenanspruchs» — der Rechner nimmt wie bei
//     der Rente die Werte von heute; künftige Anpassungen kennt niemand.
// Vorbezugssatz, Aufschubtabelle und Beitragsdauer ändern 2027 nicht (Art. 3 der V: nur Beträge).
export const AHV_WERTE_JE_JAHR = Object.freeze({
  2026: Object.freeze({
    minRente: 1260,                  // Minimalrente (Vollrente, Skala 44)
    maxRente: 2520,                  // Maximalrente (Vollrente, Skala 44)
    maxEhepaar: 3780,                // Plafonierung Ehepaar (150 % Maximalrente)
    maxVersichertesEinkommen: 90720, // Obere Grenze massg. Einkommen (= 3× max. jährl. AHV-Rente)
    erziehungsgutschriftJahr: 45360, // 3× minimale jährliche Altersrente (3× 15'120)
    skala44: SKALA_44_2026,
    quelle: 'AHVG Art. 34–40, AHVV Art. 55ter, BSV-Merkblatt 3.01 Stand 1.1.2026 (Skala 44, Renten ab 1.1.2025)',
  }),
  2027: Object.freeze({
    minRente: 1280,
    maxRente: 2560,
    maxEhepaar: 3840,
    maxVersichertesEinkommen: 92160,
    erziehungsgutschriftJahr: 46080,
    skala44: SKALA_44_2027,
    quelle: 'AHVG Art. 34–40, AHVV Art. 55ter, BSV Skala 44 gültig ab 1.1.2027 (318.117.1), V vom 2.10.2026 (AS 2026 542)',
  }),
});

// Werte für ein Datum (Standard: heute). Jahre ausserhalb der Tabelle: siehe jahrestabelle.js.
export function ahvWerte(stichtag) {
  return werteFuerStichtag(AHV_WERTE_JE_JAHR, stichtag);
}

// Massgebendes durchschnittliches Jahreseinkommen → monatliche Vollrente (Skala 44).
// Amtliche Regel: das Einkommen wird «aufgerundet auf Tabellenwert» (Merkblatt 3.01, Ziff. 30/31,
// Beispiele S. 15–17: 25'983 + 9'494 → 36'288 → 1'719; 35'219 + 9'494 → 45'360 → 1'915).
// Also nächsthöhere Tabellenzeile, keine Interpolation. Bis 15'120 (2027: 15'360) → Minimalrente,
// ab 90'720 (2027: 92'160) → Maximalrente.
function monatsrenteAusEinkommen(durchschnittlichesJahreseinkommen, w) {
  if (!(durchschnittlichesJahreseinkommen > 0)) return 0;
  const zeile = w.skala44.find(([einkommen]) => durchschnittlichesJahreseinkommen <= einkommen);
  return zeile ? zeile[1] : w.maxRente;
}


/**
 * Berechne die geschätzte AHV-Altersrente.
 *
 * @param {Object} params
 * @param {number} params.geburtsjahr
 * @param {'female'|'male'|'diverse'|string} [params.geschlecht] - Für das Frauen-Referenzalter (AHV 21); fehlt/andere → 65
 * @param {number} params.durchschnittlichesJahreseinkommen - Massgebendes Einkommen (Brutto)
 * @param {number} params.beitragsjahre - Anzahl Beitragsjahre (max 44)
 * @param {number} [params.erziehungsjahre=0] - Jahre mit Erziehungsgutschriften
 * @param {number} [params.bezugAlter] - Gewünschtes Bezugsalter (default: Referenzalter)
 * @param {number} [params.geburtsmonat] - 1–12; nur für die volle Beitragsdauer der Frauen JG 1961–63
 * @param {boolean} [params.verheiratet=false] - für die Plafonierung
 * @param {boolean} [params.gutschriftTeilen] - Gutschriften je zur Hälfte (Ehejahre); Standard: = verheiratet
 * @param {number} [params.einkommenPartner=0] - Durchschnittseinkommen Partner (für Plafonierung)
 * @param {Date|string|number} [params.stichtag] - Welche Jahreswerte gelten (Standard: heute)
 * @returns {Object} Rentenberechnung
 */
export function berechneAltersrente({
  geburtsjahr,
  geburtsmonat,
  geschlecht,
  durchschnittlichesJahreseinkommen,
  beitragsjahre,
  erziehungsjahre = 0,
  betreuungsjahre = 0,
  bezugAlter,
  verheiratet = false,
  gutschriftTeilen = verheiratet,
  einkommenPartner = 0,
  stichtag,
}) {
  const w = ahvWerte(stichtag);
  // Referenzalter geschlechts-/jahrgangsabhängig (AHV 21, Frauen-Übergangsgeneration),
  // in Monaten wegen der 3-Monats-Schritte. Männer/divers/unbekannt = 780 (65 J) →
  // identisch zum bisherigen pauschalen Referenzalter 65 (kein Verhaltenswechsel).
  const refMonate = referenzalterMonate({ geschlecht, geburtsjahr });
  const alter = bezugAlter || (refMonate / 12);

  // Einkommen mit Erziehungs- UND Betreuungsgutschriften aufwerten.
  // Beide gleichen Jahresbetrag (3× Minimalrente, Art. 29sexies/29septies AHVG);
  // pro Kalenderjahr kann nur eine angerechnet werden — hier als getrennte,
  // additive Jahre modelliert (Nutzer erfasst verschiedene Jahre).
  // Bei Verheirateten «während der Kalenderjahre der Ehe je zur Hälfte aufgeteilt» (Merkblatt 3.01,
  // Stand 1.1.2026, Ziff. 19/20; Beispiele Ziff. 30/31: «18 × 45 360 ÷ 43 Jahre ÷ 2»; Merkblatt 1.07
  // Ziff. 1: «zwingend»). Gilt für die Ehejahre, also auch nach Scheidung/Verwitwung — darum ein
  // eigener Schalter neben `verheiratet` (Plafonierung). Annahme: alle erfassten Gutschriftjahre
  // fallen in die Ehe — die App kennt das Heiratsjahr nicht.
  const gutschriftJahre = (erziehungsjahre || 0) + (betreuungsjahre || 0);
  const gutschriftGeteilt = !!gutschriftTeilen && gutschriftJahre > 0;
  const gutschriftProJahr = gutschriftJahre > 0
    ? (w.erziehungsgutschriftJahr * gutschriftJahre) / beitragsjahre / (gutschriftGeteilt ? 2 : 1)
    : 0;
  const aufgewertetesEinkommen = durchschnittlichesJahreseinkommen + gutschriftProJahr;

  // Grundrente (Vollrente bei Skala 44)
  const vollrente = monatsrenteAusEinkommen(aufgewertetesEinkommen, w);

  // Skalierung nach Beitragsjahren, gemessen an der vollen Beitragsdauer des Jahrgangs
  const volleDauer = volleBeitragsdauer({ geburtsjahr, geburtsmonat, geschlecht });
  const faktor = skalenFaktor(beitragsjahre, volleDauer);
  let rente = Math.round(vollrente * faktor * 100) / 100;

  // Vorbezug oder Aufschub
  let vorbezugAufschub = 0;
  const differenzMonate = alter * 12 - refMonate;

  if (differenzMonate < 0) {
    // Vorbezug (max 24 Monate = 2 Jahre)
    const monate = Math.min(Math.abs(differenzMonate), 24);
    const kuerzung = monate * VORBEZUG_KUERZUNG_PRO_MONAT;
    vorbezugAufschub = -kuerzung;
    rente = Math.round(rente * (1 - kuerzung) * 100) / 100;
  } else if (differenzMonate > 0) {
    // Aufschub: Tabelle Art. 55ter AHVV (1–5 Jahre, monatlich gestaffelt); unter
    // 12 Monaten kein Zuschlag (Art. 39 Abs. 1 AHVG), z. B. Frau JG 1962 mit
    // Referenzalter 64 J 6 M und Bezug mit 65.
    const zuschlag = aufschubZuschlagProzent(differenzMonate) / 100;
    vorbezugAufschub = zuschlag;
    rente = Math.round(rente * (1 + zuschlag) * 100) / 100;
  }

  // Plafonierung bei Ehepaaren
  let plafoniert = false;
  let rentePartner = 0;
  if (verheiratet && einkommenPartner > 0) {
    rentePartner = Math.round(monatsrenteAusEinkommen(einkommenPartner, w) * faktor * 100) / 100;
    const total = rente + rentePartner;
    if (total > w.maxEhepaar) {
      const reduktion = w.maxEhepaar / total;
      rente = Math.round(rente * reduktion * 100) / 100;
      rentePartner = Math.round(rentePartner * reduktion * 100) / 100;
      plafoniert = true;
    }
  }

  return {
    monatsrente: rente,
    // 13. Altersrente, Art. 34ter AHVG (in Kraft seit 1.1.2026): «einem Zwölftel der im
    // betreffenden Kalenderjahr bezogenen Altersrente», ausbezahlt im Dezember, erstmals
    // Dezember 2026. Bei Ehepaaren damit auf der plafonierten Rente: Art. 35 AHVG kennt keine
    // Ausnahme für Art. 34ter (von der Kürzung ausgenommen ist nur der Rentenzuschlag nach
    // Art. 34bis). Fedlex, Fassung 1.1.2026, abgerufen 15.09.2026:
    // https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/63/837_843_843/20260101/de/html/fedlex-data-admin-ch-eli-cc-63-837_843_843-20260101-de-html.html
    // Gleich im BSV-Merkblatt 3.01, Stand 1.1.2026, Ziff. 3/4/23 (https://www.ahv-iv.ch/p/3.01.d).
    // Gerechnet für ein volles Rentenjahr (im Startjahr anteilig, Art. 34ter Abs. 2).
    jahresrente: Math.round(rente * 13 * 100) / 100,
    dreizehnteRente: rente,
    vollrente,
    skalenfaktor: faktor,
    beitragsjahre: Math.min(beitragsjahre, volleDauer),
    volleBeitragsdauer: volleDauer,
    fehlendeBeitragsjahre: Math.max(0, volleDauer - beitragsjahre),
    bezugAlter: alter,
    referenzalterMonate: refMonate,
    vorbezugAufschub: Math.round(vorbezugAufschub * 10000) / 100, // in Prozent
    erziehungsgutschrift: Math.round(gutschriftProJahr), // kombinierte Aufwertung Erziehung + Betreuung (CHF/Jahr)
    gutschriftGeteilt,
    gutschriftJahre,
    erziehungsjahre: erziehungsjahre || 0,
    betreuungsjahre: betreuungsjahre || 0,
    plafoniert,
    rentePartner: verheiratet ? rentePartner : null,
    totalEhepaar: verheiratet ? Math.round((rente + rentePartner) * 100) / 100 : null,
    werteJahr: w.jahr, // Jahr der verwendeten Rentenwerte (für eine Anzeige «Stand …»)
  };
}

/**
 * Vergleiche Renten bei verschiedenen Bezugsaltern (Vorbezug/Aufschub).
 */
export function vergleicheVorbezugAufschub(durchschnittlichesJahreseinkommen, beitragsjahre, geschlecht, geburtsjahr, geburtsmonat, stichtag) {
  const alter = [63, 64, 65, 66, 67, 68, 69, 70];
  return alter.map(a => {
    const r = berechneAltersrente({
      // Geschlecht/Jahrgang durchreichen, damit Vorbezug/Aufschub jeder Zeile gegen das
      // ECHTE Referenzalter der Person rechnet (AHV 21). Ohne Angabe → 1965/kein
      // Geschlecht = Referenzalter 65 (unverändertes Verhalten, rückwärtskompatibel).
      geburtsjahr: geburtsjahr || 1965,
      geburtsmonat,
      geschlecht,
      durchschnittlichesJahreseinkommen,
      beitragsjahre,
      bezugAlter: a,
      stichtag,
    });
    return { bezugAlter: a, monatsrente: r.monatsrente, jahresrente: r.jahresrente, anpassung: r.vorbezugAufschub };
  });
}


// BVG-Mindestzins: BVV 2 Art. 12 Bst. k, Fedlex Stand 1.1.2027 (abgerufen 21.10.2026): «für den
// Zeitraum ab dem 1. Januar 2024: mindestens mit 1,25 Prozent». Für 2027 hat der Bundesrat am
// 22.10.2026 noch nicht entschieden (Empfehlung BVG-Kommission 1,75 %). Darum KEINE Jahreszeile:
// Es gilt der Satz in Kraft, bis ein Entscheid publiziert ist. Dann hier nachtragen.
const BVG_MINDESTZINS = 1.25;

/**
 * Berechne geschätztes BVG-Altersguthaben bei Pensionierung.
 */
export function berechneBVGGuthaben({
  alter,
  jahresbruttolohn,
  aktuellesGuthaben = 0,
  austrittsalter = 65,
  zinssatz = BVG_MINDESTZINS,
  // BVG-Mindestumwandlungssatz 2026. Die eigene Pensionskasse rechnet oft mit
  // einem abweichenden (im überobligatorischen Teil meist tieferen) Satz — darum
  // überschreibbar. Unter 1 oder über 10 wäre unplausibel → auf 6.8 zurückfallen.
  umwandlungssatz = 6.8,
  stichtag,
}) {
  const koord = bvgKoordinationsabzug(jahresbruttolohn, stichtag);
  if (!koord.versichert) return { versichert: false, guthaben: 0 };

  let guthaben = aktuellesGuthaben;
  const jahresDetail = [];

  for (let a = alter; a < austrittsalter; a++) {
    const gutschrift = BVG_GUTSCHRIFTEN.find(g => a >= g.von && a <= g.bis);
    const beitrag = gutschrift ? koord.koordinierterLohn * gutschrift.satz / 100 : 0;
    const zins = guthaben * zinssatz / 100;
    guthaben += beitrag + zins;

    jahresDetail.push({
      alter: a,
      gutschriftSatz: gutschrift ? gutschrift.satz : 0,
      beitrag: Math.round(beitrag),
      zins: Math.round(zins),
      guthaben: Math.round(guthaben),
    });
  }

  // Plausibilitäts-Gate: unplausible Eingaben fallen ruhig auf den Mindestsatz zurück.
  const uws = (Number(umwandlungssatz) >= 1 && Number(umwandlungssatz) <= 10) ? Number(umwandlungssatz) : 6.8;
  const jahresrente = Math.round(guthaben * uws / 100);

  return {
    versichert: true,
    koordinierterLohn: koord.koordinierterLohn,
    guthaben: Math.round(guthaben),
    jahresrente,
    monatsrente: Math.round(jahresrente / 12),
    umwandlungssatz: uws,
    zinssatz,
    jahresDetail,
  };
}

/**
 * Zukunfts-Projektion der 2./3. Säule bis zum Rücktritt.
 *
 * Reine Funktion (testbar). Konvention wie berechneBVGGuthaben: der Zins wird
 * auf den Anfangsbestand des Jahres gerechnet, der Jahresbeitrag danach addiert
 * (Beitrag verzinst sich erst im Folgejahr). Ergebnis ist eine Zeitachse mit
 * einem Startpunkt „heute" (t=0) und je einem Punkt pro Jahr bis zum Rücktritt.
 *
 * Die BVG-Reihe wird von aussen übergeben (bvgSerie = jahresDetail-Guthaben),
 * damit die bestehende Koordinationsabzug-/Gutschriften-Logik nicht dupliziert
 * wird; 3a und 3b werden hier mit flachem Jahresbeitrag verzinst.
 */
export function projiziereVorsorge({
  alter,
  austrittsalter = 65,
  startjahr,
  bvgHeute = 0,
  bvgSerie = [],          // bvgSerie[i] = Guthaben am Ende von Jahr (i+1), aus jahresDetail
  s3aBalance = 0, s3aAnnual = 0, s3aRendite = 1.5,
  s3bBalance = 0, s3bAnnual = 0, s3bRendite = 2.0,
}) {
  const round = Math.round;
  const jahr0 = startjahr || new Date().getFullYear();
  const n = Math.max(0, Math.round(austrittsalter - alter));

  let g3a = s3aBalance;
  let g3b = s3bBalance;
  const timeline = [];
  const push = (i, bvgVal) => {
    const bvg = round(bvgVal);
    const s3a = round(g3a);
    const s3b = round(g3b);
    timeline.push({ jahr: jahr0 + i, alter: Math.round(alter) + i, bvg, s3a, s3b, total: bvg + s3a + s3b });
  };

  push(0, bvgHeute);
  for (let i = 1; i <= n; i++) {
    g3a += g3a * s3aRendite / 100 + s3aAnnual;
    g3b += g3b * s3bRendite / 100 + s3bAnnual;
    const bvgVal = bvgSerie.length >= i ? bvgSerie[i - 1] : (timeline[timeline.length - 1]?.bvg ?? bvgHeute);
    push(i, bvgVal);
  }

  const end = timeline[timeline.length - 1] || { bvg: 0, s3a: 0, s3b: 0, total: 0, alter: Math.round(alter), jahr: jahr0 };
  return {
    timeline,
    startsumme: { bvg: round(bvgHeute), s3a: round(s3aBalance), s3b: round(s3bBalance), total: round(bvgHeute + s3aBalance + s3bBalance) },
    endsumme: { bvg: end.bvg, s3a: end.s3a, s3b: end.s3b, total: end.total, alter: end.alter, jahr: end.jahr },
  };
}

// === IK-Auszug (Individuelles Konto) — echte Beitragshistorie statt Annahme ===
//
// Statt die Beitragsjahre zu schätzen (min(Rücktritt−20, 44) volle Jahre), kann
// aus einem nachgestellten IK-Auszug die reale Historie abgeleitet werden: echte
// Beitragsjahre (ohne Lücken, gedeckelt auf 44), massgebendes Ø-Einkommen,
// Jugendjahre zur Lückenfüllung (#6) und ALV-Jahre (AHV läuft weiter, #7).
//
// Ein Eintrag: { jahr:number, alter:number, einkommen:number, typ:string }
// Bleibt eine SCHÄTZUNG — der echte IK-Auszug der Ausgleichskasse ist massgebend.

export const IK_TYP = {
  ERWERB: 'erwerb',        // Erwerbstätigkeit (zählt als AHV-Beitragsjahr + BVG)
  JUGEND: 'jugendjahre',   // Alter 17–20: Beiträge füllen spätere Beitragslücken
  ALV: 'alv',              // Arbeitslosigkeit: AHV läuft weiter, ABER kein BVG-Alterssparen
  ERZIEHUNG: 'erziehung',  // Jahre mit Erziehungsgutschriften
  BETREUUNG: 'betreuung',  // Pflege naher Angehöriger: Betreuungsgutschrift (Art. 29septies AHVG)
  LUECKE: 'luecke',        // fehlendes Beitragsjahr (senkt die Rente)
};

// Typen, die als AHV-Beitragsjahr zählen (alles ausser der Lücke)
const IK_BEITRAGSTYPEN = [IK_TYP.ERWERB, IK_TYP.ALV, IK_TYP.ERZIEHUNG, IK_TYP.BETREUUNG];

const AHV_JUGEND_VON = 17;          // Jugendjahre-Fenster: Beiträge 17–20 füllen Lücken
const AHV_BEITRAGSPFLICHT_AB = 21;  // ordentliche Beitragspflicht ab dem Jahr nach dem 20. Geburtstag

/**
 * Werte einen nachgestellten IK-Auszug aus: echte Beitragsjahre + Ø-Einkommen.
 * Jugendjahre (17–20) füllen spätere Lücken (bis zu deren Anzahl). ALV-Jahre
 * zählen als AHV-Beitragsjahr. Reine Funktion, testbar.
 *
 * @param {Array<{jahr:number, alter?:number, einkommen:number, typ:string}>} entries
 * @returns {Object} abgeleitete Kennzahlen für berechneAltersrente()
 */
export function berechneIKAuszug(entries = []) {
  const list = Array.isArray(entries) ? entries.filter(e => e && Number(e.jahr)) : [];

  const jugend = list.filter(e => e.typ === IK_TYP.JUGEND);
  const regular = list.filter(e => e.typ !== IK_TYP.JUGEND);

  const contributory = regular.filter(e => IK_BEITRAGSTYPEN.includes(e.typ));
  const luecken = regular.filter(e => e.typ === IK_TYP.LUECKE).length;

  // Jugendjahre-Beiträge füllen spätere Beitragslücken (höchstens so viele wie Lücken)
  const jugendGenutzt = Math.min(jugend.length, luecken);

  // Effektive Beitragsjahre = reguläre Beitragsjahre + genutzte Jugendjahre, gedeckelt auf 44
  const beitragsjahre = Math.min(VOLLE_BEITRAGSJAHRE, contributory.length + jugendGenutzt);

  // Massgebendes Ø-Einkommen: Summe der angerechneten Einkommen / Beitragsjahre.
  // Die zur Lückenfüllung genutzten Jugendjahre werden mit ihrem Einkommen einbezogen.
  const angerechnet = contributory.concat(jugend.slice(0, jugendGenutzt));
  const summeEinkommen = angerechnet.reduce((s, e) => s + (Number(e.einkommen) || 0), 0);
  const durchschnitt = beitragsjahre > 0 ? Math.round(summeEinkommen / beitragsjahre) : 0;

  return {
    beitragsjahre,
    durchschnittlichesJahreseinkommen: durchschnitt,
    erwerbsjahre: regular.filter(e => e.typ === IK_TYP.ERWERB).length,
    alvJahre: regular.filter(e => e.typ === IK_TYP.ALV).length,
    erziehungsjahre: regular.filter(e => e.typ === IK_TYP.ERZIEHUNG).length,
    betreuungsjahre: regular.filter(e => e.typ === IK_TYP.BETREUUNG).length,
    luecken,
    jugendjahreTotal: jugend.length,
    jugendjahreGenutzt: jugendGenutzt,
    jahreErfasst: list.length,
    vollstaendig: beitragsjahre >= VOLLE_BEITRAGSJAHRE,
  };
}

/**
 * Vorbelegung eines IK-Auszugs: erzeugt Einträge ab Beitragspflicht (21) bis zum
 * heutigen Alter mit dem aktuellen Einkommen als Annahme. Optional die Jugendjahre
 * (17–20). So startet die Eingabe nicht leer (Robustheit: Vorausfüllen).
 *
 * @returns {Array} IK-Auszug-Einträge
 */
export function vorbelegeIKAuszug({ geburtsjahr, aktuellesAlter, aktuellesEinkommen = 0, mitJugendjahren = false, jetztJahr }) {
  const jahr0 = jetztJahr || new Date().getFullYear();
  let gj = geburtsjahr;
  if (!gj && aktuellesAlter != null) gj = jahr0 - Math.round(aktuellesAlter);
  if (!gj) return [];
  const alterHeute = aktuellesAlter != null ? Math.round(aktuellesAlter) : (jahr0 - gj);
  const entries = [];
  if (mitJugendjahren) {
    for (let a = AHV_JUGEND_VON; a < AHV_BEITRAGSPFLICHT_AB && a <= alterHeute; a++) {
      entries.push({ jahr: gj + a, alter: a, einkommen: aktuellesEinkommen, typ: IK_TYP.JUGEND });
    }
  }
  for (let a = AHV_BEITRAGSPFLICHT_AB; a <= alterHeute; a++) {
    entries.push({ jahr: gj + a, alter: a, einkommen: aktuellesEinkommen, typ: IK_TYP.ERWERB });
  }
  return entries;
}

// Konstanten exportieren für Tests und UI
const AHV_HEUTE = ahvWerte(); // Stand beim Laden der App
export const AHV_PARAMS = {
  minRente: AHV_HEUTE.minRente,
  maxRente: AHV_HEUTE.maxRente,
  maxEhepaar: AHV_HEUTE.maxEhepaar,
  referenzalter: REFERENZALTER,
  volleBeitragsjahre: VOLLE_BEITRAGSJAHRE,
  maxVersichertesEinkommen: AHV_HEUTE.maxVersichertesEinkommen,
};

export const BVG_PARAMS = {
  mindestzins: BVG_MINDESTZINS,
  umwandlungssatz: 6.8,
  // Bis 22.10.2026 stand hier das Literal 22680 neben der Konstante in lohnAbzuege.js — zwei
  // Stellen für einen Wert. Jetzt dieselbe Quelle.
  eintrittsschwelle: BVG_EINTRITTSSCHWELLE_JAHR,
  koordinationsabzug: KOORDINATIONSABZUG,
  gutschriften: BVG_GUTSCHRIFTEN,
};

// Orientierungswert (kein gesetzlicher Wert): viele Bank-3a-Konten zahlen den
// höheren Vorzugszins nur bis zu einer Schwelle in dieser Grössenordnung —
// darüber sinkt der Zins. Dient allein dem Strategie-Hinweis im Zukunft-Reiter
// (mehrere Konten moderat füllen → Vorzugszins halten + gestaffelter Bezug).
export const SAEULE3A_ZINSSCHWELLE = 20000;

// WARTUNG: Werte 2026 und 2027 stehen in AHV_WERTE_JE_JAHR (inkl. der ganzen Skala 44) und
// LOHN_WERTE_JE_JAHR. Für 2028 nach der Anpassung des Bundesrats eine Zeile mit allen 51
// Tabellenzeilen ergänzen. Die Version folgt dem Jahr der Werte, die gerade gelten.
export const AHV_DATA_VERSION = String(AHV_HEUTE.jahr);
export const AHV_DATA_SOURCE = AHV_HEUTE.quelle;
