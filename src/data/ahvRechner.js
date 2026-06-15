// AHV-Rentenrechner für Maloja Plana
// Quelle: Art. 34–40 AHVG, Verordnung über die AHV (AHVV)
// Stand: 2026 (Renten nach AHV-Reform AHV21, in Kraft seit 01.01.2024)
// Referenzalter: 65 (Männer und Frauen ab Jahrgang 1964)
//
// Alle Beträge in CHF/Monat. Keine Netzwerk-Calls, reine Berechnung.

// === AHV-Parameter 2026 ===
const AHV_MIN_RENTE = 1225;       // Minimalrente (Vollrente, Skala 44)
const AHV_MAX_RENTE = 2450;       // Maximalrente (Vollrente, Skala 44)
const AHV_MAX_EHEPAAR = 3675;     // Plafonierung Ehepaar (150% Maximalrente)
const REFERENZALTER = 65;
const MIN_BEITRAGSJAHRE = 1;
const VOLLE_BEITRAGSJAHRE = 44;   // Skala 44 = Vollrente
const KOORDINATIONSABZUG = 25725; // BVG-Koordinationsabzug 2026
const MAX_VERSICHERTES_EINKOMMEN = 88200; // Obere Grenze massgebendes Einkommen

// Vorbezug/Aufschub
const VORBEZUG_KUERZUNG_PRO_MONAT = 0.004167; // ~0.5% pro Monat ≈ 5% pro Jahr (vereinfacht)
const AUFSCHUB_ZUSCHLAG_PRO_MONAT = 0.002667;  // ~3.2% pro Jahr ≈ 0.267% pro Monat

// Erziehungsgutschriften pro Kind (pauschal, jährlich, geteilt bei gemeinsamer elterlicher Sorge)
const ERZIEHUNGSGUTSCHRIFT_JAHR = 44100; // 3× minimale jährliche Altersrente

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
  const minEinkommen = 14700;  // Untere Grenze (ergibt Minimalrente)
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
 * @param {number} params.durchschnittlichesJahreseinkommen - Massgebendes Einkommen (Brutto)
 * @param {number} params.beitragsjahre - Anzahl Beitragsjahre (max 44)
 * @param {number} [params.erziehungsjahre=0] - Jahre mit Erziehungsgutschriften
 * @param {number} [params.bezugAlter] - Gewünschtes Bezugsalter (default: 65)
 * @param {boolean} [params.verheiratet=false]
 * @param {number} [params.einkommenPartner=0] - Durchschnittseinkommen Partner (für Plafonierung)
 * @returns {Object} Rentenberechnung
 */
export function berechneAltersrente({
  geburtsjahr,
  durchschnittlichesJahreseinkommen,
  beitragsjahre,
  erziehungsjahre = 0,
  bezugAlter,
  verheiratet = false,
  einkommenPartner = 0,
}) {
  const alter = bezugAlter || REFERENZALTER;

  // Einkommen mit Erziehungsgutschriften aufwerten
  const gutschriftProJahr = erziehungsjahre > 0
    ? (ERZIEHUNGSGUTSCHRIFT_JAHR * erziehungsjahre) / beitragsjahre
    : 0;
  const aufgewertetesEinkommen = durchschnittlichesJahreseinkommen + gutschriftProJahr;

  // Grundrente (Vollrente bei Skala 44)
  const vollrente = monatsrenteAusEinkommen(aufgewertetesEinkommen);

  // Skalierung nach Beitragsjahren
  const faktor = skalenFaktor(beitragsjahre);
  let rente = Math.round(vollrente * faktor * 100) / 100;

  // Vorbezug oder Aufschub
  let vorbezugAufschub = 0;
  const differenzMonate = (alter - REFERENZALTER) * 12;

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
    jahresrente: Math.round(rente * 12 * 100) / 100,
    vollrente,
    skalenfaktor: faktor,
    beitragsjahre: Math.min(beitragsjahre, VOLLE_BEITRAGSJAHRE),
    fehlendeBeitragsjahre: Math.max(0, VOLLE_BEITRAGSJAHRE - beitragsjahre),
    bezugAlter: alter,
    vorbezugAufschub: Math.round(vorbezugAufschub * 10000) / 100, // in Prozent
    erziehungsgutschrift: Math.round(gutschriftProJahr),
    plafoniert,
    rentePartner: verheiratet ? rentePartner : null,
    totalEhepaar: verheiratet ? Math.round((rente + rentePartner) * 100) / 100 : null,
  };
}

/**
 * Vergleiche Renten bei verschiedenen Bezugsaltern (Vorbezug/Aufschub).
 */
export function vergleicheVorbezugAufschub(durchschnittlichesJahreseinkommen, beitragsjahre) {
  const alter = [63, 64, 65, 66, 67, 68, 69, 70];
  return alter.map(a => {
    const r = berechneAltersrente({
      geburtsjahr: 1965,
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
  const mindestlohn = 22050; // BVG-Eintrittsschwelle 2026
  if (jahresbruttolohn < mindestlohn) return { versichert: false, koordinierterLohn: 0 };

  const koordinierterLohn = Math.max(3675, jahresbruttolohn - KOORDINATIONSABZUG);
  const maxKoordinierterLohn = 62475; // Obergrenze
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

/**
 * Berechne geschätztes BVG-Altersguthaben bei Pensionierung.
 */
export function berechneBVGGuthaben({
  alter,
  jahresbruttolohn,
  aktuellesGuthaben = 0,
  austrittsalter = 65,
  zinssatz = 1.25, // BVG-Mindestzins 2026
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

  const umwandlungssatz = 6.8; // BVG-Mindestumwandlungssatz 2026
  const jahresrente = Math.round(guthaben * umwandlungssatz / 100);

  return {
    versichert: true,
    koordinierterLohn: koord.koordinierterLohn,
    guthaben: Math.round(guthaben),
    jahresrente,
    monatsrente: Math.round(jahresrente / 12),
    umwandlungssatz,
    zinssatz,
    jahresDetail,
  };
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
  eintrittsschwelle: 22050,
  koordinationsabzug: KOORDINATIONSABZUG,
  gutschriften: BVG_GUTSCHRIFTEN,
};

export const AHV_DATA_VERSION = '2026';
export const AHV_DATA_SOURCE = 'AHVG Art. 34–40, AHVV, BSV Rententabellen 2026';
