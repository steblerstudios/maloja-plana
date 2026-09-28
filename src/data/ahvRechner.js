// Lohnabzüge, Referenzalter und BVG-Grundwerte leben seit 25.09.2026 in ./lohnAbzuege.js (klein,
// im Startbündel für die Sozialhilfe-Schnellrechnung). Hier nur importiert und weitergereicht —
// bestehende Importe aus ahvRechner.js funktionieren unverändert.
import { REFERENZALTER, KOORDINATIONSABZUG, referenzalterMonate, BVG_EINTRITTSSCHWELLE_JAHR, bvgKoordinationsabzug, BVG_GUTSCHRIFTEN, bvgAltersgutschriftSatz, AHV_ALV_ARBEITNEHMER_SATZ, AHV_IV_EO_SATZ_AN, ALV_SATZ_AN, ALV_HOECHSTBETRAG_JAHR, AHV_FREIBETRAG_RENTNER_MONAT, nettoZuBruttoRichtwert, bruttoZuNettoRichtwert } from './lohnAbzuege.js';
export { referenzalterMonate, BVG_EINTRITTSSCHWELLE_JAHR, bvgKoordinationsabzug, bvgAltersgutschriftSatz, AHV_ALV_ARBEITNEHMER_SATZ, AHV_IV_EO_SATZ_AN, ALV_SATZ_AN, ALV_HOECHSTBETRAG_JAHR, AHV_FREIBETRAG_RENTNER_MONAT, nettoZuBruttoRichtwert, bruttoZuNettoRichtwert };
// AHV-Rentenrechner für Maloja Plana
// Quelle: Art. 34–40 AHVG, Verordnung über die AHV (AHVV)
// Stand: 2026 (Renten nach AHV-Reform AHV21, in Kraft seit 01.01.2024)
// Referenzalter: 65 (Männer und Frauen ab Jahrgang 1964)
//
// Alle Beträge in CHF/Monat. Keine Netzwerk-Calls, reine Berechnung.

// === AHV-Parameter 2026 ===
const AHV_MIN_RENTE = 1260;       // Minimalrente (Vollrente, Skala 44)
const AHV_MAX_RENTE = 2520;       // Maximalrente (Vollrente, Skala 44)
const AHV_MAX_EHEPAAR = 3780;     // Plafonierung Ehepaar (150% Maximalrente)
const MIN_BEITRAGSJAHRE = 1;
const VOLLE_BEITRAGSJAHRE = 44;   // Skala 44 = Vollrente
const MAX_VERSICHERTES_EINKOMMEN = 90720; // Obere Grenze massg. Einkommen (= 3× max. jährl. AHV-Rente)

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

// Erziehungsgutschriften pro Kind (pauschal, jährlich, geteilt bei gemeinsamer elterlicher Sorge)
const ERZIEHUNGSGUTSCHRIFT_JAHR = 45360; // 3× minimale jährliche Altersrente (3× 15'120)

// Skala: Beitragsjahre → Bruchteil der Vollrente (Art. 52 AHVV)
// Skala 1–44, jedes fehlende Jahr reduziert proportional
function skalenFaktor(beitragsjahre) {
  if (beitragsjahre >= VOLLE_BEITRAGSJAHRE) return 1;
  if (beitragsjahre < MIN_BEITRAGSJAHRE) return 0;
  return beitragsjahre / VOLLE_BEITRAGSJAHRE;
}

// Rentenformel: massgebendes durchschnittliches Jahreseinkommen → Monatsrente
// Lineare Interpolation zwischen Min und Max gemäss Art. 34 AHVG
function monatsrenteAusEinkommen(durchschnittlichesJahreseinkommen) {
  if (durchschnittlichesJahreseinkommen <= 0) return 0;

  // Unter Minimum → Minimalrente
  const minEinkommen = 15120;  // Untere Grenze (= 12× Minimalrente, ergibt Minimalrente)
  const maxEinkommen = MAX_VERSICHERTES_EINKOMMEN;

  if (durchschnittlichesJahreseinkommen <= minEinkommen) return AHV_MIN_RENTE;
  if (durchschnittlichesJahreseinkommen >= maxEinkommen) return AHV_MAX_RENTE;

  // Formel Art. 34 AHVG: Rente = (Einkommen / 2 × 13) / 12 + fester Zuschlag
  // Vereinfacht: lineare Interpolation
  const anteil = (durchschnittlichesJahreseinkommen - minEinkommen) / (maxEinkommen - minEinkommen);
  return Math.round((AHV_MIN_RENTE + anteil * (AHV_MAX_RENTE - AHV_MIN_RENTE)) * 100) / 100;
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
 * @param {boolean} [params.verheiratet=false]
 * @param {number} [params.einkommenPartner=0] - Durchschnittseinkommen Partner (für Plafonierung)
 * @returns {Object} Rentenberechnung
 */
export function berechneAltersrente({
  geburtsjahr,
  geschlecht,
  durchschnittlichesJahreseinkommen,
  beitragsjahre,
  erziehungsjahre = 0,
  betreuungsjahre = 0,
  bezugAlter,
  verheiratet = false,
  einkommenPartner = 0,
}) {
  // Referenzalter geschlechts-/jahrgangsabhängig (AHV 21, Frauen-Übergangsgeneration),
  // in Monaten wegen der 3-Monats-Schritte. Männer/divers/unbekannt = 780 (65 J) →
  // identisch zum bisherigen pauschalen Referenzalter 65 (kein Verhaltenswechsel).
  const refMonate = referenzalterMonate({ geschlecht, geburtsjahr });
  const alter = bezugAlter || (refMonate / 12);

  // Einkommen mit Erziehungs- UND Betreuungsgutschriften aufwerten.
  // Beide gleichen Jahresbetrag (3× Minimalrente, Art. 29sexies/29septies AHVG);
  // pro Kalenderjahr kann nur eine angerechnet werden — hier als getrennte,
  // additive Jahre modelliert (Nutzer erfasst verschiedene Jahre).
  const gutschriftJahre = (erziehungsjahre || 0) + (betreuungsjahre || 0);
  const gutschriftProJahr = gutschriftJahre > 0
    ? (ERZIEHUNGSGUTSCHRIFT_JAHR * gutschriftJahre) / beitragsjahre
    : 0;
  const aufgewertetesEinkommen = durchschnittlichesJahreseinkommen + gutschriftProJahr;

  // Grundrente (Vollrente bei Skala 44)
  const vollrente = monatsrenteAusEinkommen(aufgewertetesEinkommen);

  // Skalierung nach Beitragsjahren
  const faktor = skalenFaktor(beitragsjahre);
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
    rentePartner = Math.round(monatsrenteAusEinkommen(einkommenPartner) * faktor * 100) / 100;
    const total = rente + rentePartner;
    if (total > AHV_MAX_EHEPAAR) {
      const reduktion = AHV_MAX_EHEPAAR / total;
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
    beitragsjahre: Math.min(beitragsjahre, VOLLE_BEITRAGSJAHRE),
    fehlendeBeitragsjahre: Math.max(0, VOLLE_BEITRAGSJAHRE - beitragsjahre),
    bezugAlter: alter,
    referenzalterMonate: refMonate,
    vorbezugAufschub: Math.round(vorbezugAufschub * 10000) / 100, // in Prozent
    erziehungsgutschrift: Math.round(gutschriftProJahr), // kombinierte Aufwertung Erziehung + Betreuung (CHF/Jahr)
    gutschriftJahre,
    erziehungsjahre: erziehungsjahre || 0,
    betreuungsjahre: betreuungsjahre || 0,
    plafoniert,
    rentePartner: verheiratet ? rentePartner : null,
    totalEhepaar: verheiratet ? Math.round((rente + rentePartner) * 100) / 100 : null,
  };
}

/**
 * Vergleiche Renten bei verschiedenen Bezugsaltern (Vorbezug/Aufschub).
 */
export function vergleicheVorbezugAufschub(durchschnittlichesJahreseinkommen, beitragsjahre, geschlecht, geburtsjahr) {
  const alter = [63, 64, 65, 66, 67, 68, 69, 70];
  return alter.map(a => {
    const r = berechneAltersrente({
      // Geschlecht/Jahrgang durchreichen, damit Vorbezug/Aufschub jeder Zeile gegen das
      // ECHTE Referenzalter der Person rechnet (AHV 21). Ohne Angabe → 1965/kein
      // Geschlecht = Referenzalter 65 (unverändertes Verhalten, rückwärtskompatibel).
      geburtsjahr: geburtsjahr || 1965,
      geschlecht,
      durchschnittlichesJahreseinkommen,
      beitragsjahre,
      bezugAlter: a,
    });
    return { bezugAlter: a, monatsrente: r.monatsrente, jahresrente: r.jahresrente, anpassung: r.vorbezugAufschub };
  });
}


/**
 * Berechne geschätztes BVG-Altersguthaben bei Pensionierung.
 */
export function berechneBVGGuthaben({
  alter,
  jahresbruttolohn,
  aktuellesGuthaben = 0,
  austrittsalter = 65,
  zinssatz = 1.25, // BVG-Mindestzins 2026
  // BVG-Mindestumwandlungssatz 2026. Die eigene Pensionskasse rechnet oft mit
  // einem abweichenden (im überobligatorischen Teil meist tieferen) Satz — darum
  // überschreibbar. Unter 1 oder über 10 wäre unplausibel → auf 6.8 zurückfallen.
  umwandlungssatz = 6.8,
}) {
  const koord = bvgKoordinationsabzug(jahresbruttolohn);
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
export const AHV_PARAMS = {
  minRente: AHV_MIN_RENTE,
  maxRente: AHV_MAX_RENTE,
  maxEhepaar: AHV_MAX_EHEPAAR,
  referenzalter: REFERENZALTER,
  volleBeitragsjahre: VOLLE_BEITRAGSJAHRE,
  maxVersichertesEinkommen: MAX_VERSICHERTES_EINKOMMEN,
};

export const BVG_PARAMS = {
  mindestzins: 1.25,
  umwandlungssatz: 6.8,
  eintrittsschwelle: 22680,
  koordinationsabzug: KOORDINATIONSABZUG,
  gutschriften: BVG_GUTSCHRIFTEN,
};

// Orientierungswert (kein gesetzlicher Wert): viele Bank-3a-Konten zahlen den
// höheren Vorzugszins nur bis zu einer Schwelle in dieser Grössenordnung —
// darüber sinkt der Zins. Dient allein dem Strategie-Hinweis im Zukunft-Reiter
// (mehrere Konten moderat füllen → Vorzugszins halten + gestaffelter Bezug).
export const SAEULE3A_ZINSSCHWELLE = 20000;

// WARTUNG: AHV/ALV/BVG-Werte sind Stand 2026. Im Januar 2027 gegen die neuen
// BSV-Rententabellen und AHVV-Anpassungen prüfen und diese Version hochziehen.
export const AHV_DATA_VERSION = '2026';
export const AHV_DATA_SOURCE = 'AHVG Art. 34–40, AHVV Art. 55ter, BSV Rententabellen 2026';
