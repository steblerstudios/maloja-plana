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
const REFERENZALTER = 65;
const MIN_BEITRAGSJAHRE = 1;
const VOLLE_BEITRAGSJAHRE = 44;   // Skala 44 = Vollrente
const KOORDINATIONSABZUG = 26460; // BVG-Koordinationsabzug 2026
const MAX_VERSICHERTES_EINKOMMEN = 90720; // Obere Grenze massg. Einkommen (= 3× max. jährl. AHV-Rente)

// Vorbezug/Aufschub
const VORBEZUG_KUERZUNG_PRO_MONAT = 0.005667; // 6.8% pro Jahr (gesetzlicher AHV-Vorbezugssatz)
const AUFSCHUB_ZUSCHLAG_PRO_MONAT = 0.002667;  // ~3.2% pro Jahr ≈ 0.267% pro Monat

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
 * Referenzalter (Rentenalter) in MONATEN.
 *
 * Männer, Geschlecht divers/unbekannt und Frauen ab Jahrgang 1964: 65 Jahre (780 Monate).
 * Frauen der Übergangsgeneration (AHV 21) gestaffelt tiefer — belegt an der amtlichen Quelle
 * (BSV FAQ „Wie wird das Frauenrentenalter erhöht?" / AHV-IV-Merkblatt 31), Stand 2026:
 *   JG ≤1960: 64 J · 1961: 64 J 3 M · 1962: 64 J 6 M · 1963: 64 J 9 M · ab 1964: 65 J.
 * Monats-Granularität, weil die Erhöhung in 3-Monats-Schritten läuft.
 *
 * @param {Object} [params]
 * @param {'female'|'male'|'diverse'|string} [params.geschlecht]
 * @param {number} [params.geburtsjahr]
 * @returns {number} Referenzalter in Monaten
 */
export function referenzalterMonate({ geschlecht, geburtsjahr } = {}) {
  if (geschlecht === 'female' && Number.isFinite(geburtsjahr)) {
    if (geburtsjahr <= 1960) return 64 * 12;      // 768
    if (geburtsjahr === 1961) return 64 * 12 + 3; // 771
    if (geburtsjahr === 1962) return 64 * 12 + 6; // 774
    if (geburtsjahr === 1963) return 64 * 12 + 9; // 777
    // ab JG 1964: 65 Jahre (Fallback unten)
  }
  return REFERENZALTER * 12;                       // 780 = 65 Jahre
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
    // Aufschub (max 60 Monate = 5 Jahre)
    const monate = Math.min(differenzMonate, 60);
    const zuschlag = monate * AUFSCHUB_ZUSCHLAG_PRO_MONAT;
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
    // 13 Auszahlungen pro Jahr seit 01.01.2026 (13. AHV-Rente)
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
 * Berechne den BVG-Mindestlohn und Koordinationsabzug.
 */
export function bvgKoordinationsabzug(jahresbruttolohn) {
  const mindestlohn = 22680; // BVG-Eintrittsschwelle 2026
  if (jahresbruttolohn < mindestlohn) return { versichert: false, koordinierterLohn: 0 };

  const koordinierterLohn = Math.max(3780, jahresbruttolohn - KOORDINATIONSABZUG);
  const maxKoordinierterLohn = 64260; // Obergrenze (= 90'720 − 26'460)
  return {
    versichert: true,
    koordinierterLohn: Math.min(koordinierterLohn, maxKoordinierterLohn),
    koordinationsabzug: KOORDINATIONSABZUG,
    eintrittsschwelle: mindestlohn,
  };
}

// BVG-Altersgutschriften (% des koordinierten Lohns, Art. 16 BVG)
const BVG_GUTSCHRIFTEN = [
  { von: 25, bis: 34, satz: 7 },
  { von: 35, bis: 44, satz: 10 },
  { von: 45, bis: 54, satz: 15 },
  { von: 55, bis: 65, satz: 18 },
];

// BVG-Altersgutschrift-Satz (% des koordinierten Lohns) für ein Alter (Art. 16 BVG).
// Unter 25 / über 65: keine obligatorischen Sparbeiträge → 0.
export function bvgAltersgutschriftSatz(alter) {
  const a = Number(alter);
  if (!Number.isFinite(a)) return 0;
  const stufe = BVG_GUTSCHRIFTEN.find(g => a >= g.von && a <= g.bis);
  return stufe ? stufe.satz : 0;
}

// Grober Brutto-RICHTWERT aus einem Netto-Monatslohn (inkl. geschätzter PK/BVG).
// Kehrt die fixen Arbeitnehmer-Abzüge um: AHV/IV/EO 5.3 % + ALV 1.1 % = 6.4 %
// (Quelle BSV/AHV-IV 2025) PLUS die BVG-Altersgutschrift nach Alter (Art. 16 BVG),
// als ~halber Arbeitnehmer-Anteil auf dem koordinierten Lohn und erst über der
// Eintrittsschwelle (CHF 22'680/Jahr). NICHT enthalten: Steuern, NBU-Prämie,
// überobligatorische PK-Pläne — der PK-Anteil variiert nach Kasse. Bleibt darum
// bewusst ein «~»-Anhaltspunkt, nie eine verbindliche Zahl. Ohne Alter fällt die
// PK weg (dann = reiner AHV/ALV-Richtwert).
export const AHV_ALV_ARBEITNEHMER_SATZ = 0.064;

export function nettoZuBruttoRichtwert(nettoMonat, alter) {
  const netto = Math.max(0, Number(nettoMonat) || 0);
  if (netto <= 0) return 0;
  const gutschrift = bvgAltersgutschriftSatz(alter);
  // Fixpunkt-Iteration: Brutto minus (AHV/ALV + PK) soll das Netto treffen. Die
  // Abzüge wachsen monoton mit dem Brutto → wenige Schritte konvergieren.
  let brutto = netto / (1 - AHV_ALV_ARBEITNEHMER_SATZ);
  for (let i = 0; i < 8; i++) {
    const koord = bvgKoordinationsabzug(brutto * 12);
    const pkMonat = koord.versichert ? (koord.koordinierterLohn / 12) * (gutschrift / 100) / 2 : 0;
    const nettoCalc = brutto - brutto * AHV_ALV_ARBEITNEHMER_SATZ - pkMonat;
    brutto += netto - nettoCalc;
  }
  return Math.round(brutto);
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
export const AHV_DATA_SOURCE = 'AHVG Art. 34–40, AHVV, BSV Rententabellen 2026';
