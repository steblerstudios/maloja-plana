// Steuerrechner – Direkte Bundessteuer (DBG Art. 36)
// Quelle: EFD-Rundschreiben "Ausgleich der kalten Progression … Steuerjahr 2026"
//         (Verordnung über die kalte Progression VKP, SR 642.119.2); Tarif 2026 (Art. 36 DBG).
// Stand: Steuerjahr 2026. Alle Beträge in CHF. Keine Netzwerk-Calls, reine Berechnung.
//
// Modell: pro Stufe die offizielle Grundsteuer bei der Untergrenze (ab) + Grenzsatz darüber.
// Damit deckt sich das Resultat aufs Rappen mit der amtlichen ESTV-Tariftabelle
// (Prüfanker: 60'000 → 671.40, 100'000 → 2'684.35; Verheiratete 53'400 → 237.00).

// === Grundtarif (Alleinstehende, Art. 36 Abs. 1 DBG), Tarif 2026 ===
// ab = Einkommensuntergrenze, grundsteuer = amtliche Steuer bei genau 'ab', satz = Grenzsatz darüber.
const GRUNDTARIF_STUFEN = [
  { ab: 15200,  grundsteuer: 0,        satz: 0.0077 },
  { ab: 33200,  grundsteuer: 138.60,   satz: 0.0088 },
  { ab: 43500,  grundsteuer: 229.20,   satz: 0.0264 },
  { ab: 58000,  grundsteuer: 612.00,   satz: 0.0297 },
  { ab: 76200,  grundsteuer: 1152.50,  satz: 0.0594 },
  { ab: 82100,  grundsteuer: 1502.95,  satz: 0.0660 },
  { ab: 108900, grundsteuer: 3271.75,  satz: 0.0880 },
  { ab: 141500, grundsteuer: 6140.55,  satz: 0.1100 },
  { ab: 185100, grundsteuer: 10936.55, satz: 0.1320 },
];
const GRUNDTARIF_FLAT_GRENZE = 793900; // darüber 11.5% des gesamten Einkommens
const GRUNDTARIF_FLAT_SATZ = 0.115;

// === Verheiratetentarif (Art. 36 Abs. 2 DBG), Tarif 2026 ===
const VERHEIRATETENTARIF_STUFEN = [
  { ab: 29700,  grundsteuer: 0,       satz: 0.0100 },
  { ab: 53400,  grundsteuer: 237.00,  satz: 0.0200 },
  { ab: 61300,  grundsteuer: 395.00,  satz: 0.0300 },
  { ab: 79100,  grundsteuer: 929.00,  satz: 0.0400 },
  { ab: 94900,  grundsteuer: 1561.00, satz: 0.0500 },
  { ab: 108700, grundsteuer: 2251.00, satz: 0.0600 },
  { ab: 120600, grundsteuer: 2965.00, satz: 0.0700 },
  { ab: 130500, grundsteuer: 3658.00, satz: 0.0800 },
  { ab: 138400, grundsteuer: 4290.00, satz: 0.0900 },
  { ab: 144300, grundsteuer: 4821.00, satz: 0.1000 },
  { ab: 148300, grundsteuer: 5221.00, satz: 0.1100 },
  { ab: 150400, grundsteuer: 5452.00, satz: 0.1200 },
  { ab: 152400, grundsteuer: 5692.00, satz: 0.1300 },
];
const VERHEIRATET_FLAT_GRENZE = 941300;
const VERHEIRATET_FLAT_SATZ = 0.115;

// Elterntarif (Art. 36 Abs. 2bis DBG), Wortlaut Stand 1.1.2026, abgerufen 15.09.2026:
//   «Für die in rechtlich und tatsächlich ungetrennter Ehe lebenden Ehepaare und die
//   verwitweten, gerichtlich oder tatsächlich getrennt lebenden, geschiedenen und ledigen
//   steuerpflichtigen Personen, die mit Kindern oder unterstützungsbedürftigen Personen im
//   gleichen Haushalt zusammenleben und deren Unterhalt zur Hauptsache bestreiten, gilt
//   Absatz 2 sinngemäss. Der so ermittelte Steuerbetrag ermässigt sich um 263 Franken für
//   jedes Kind oder jede unterstützungsbedürftige Person.»
//   https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/de (Fassung 20260101; Betrag 263
//   gemäss V EFD vom 22.8.2024 über die kalte Progression, AS 2024 479, in Kraft seit 1.1.2025).
//   ESTV Form. 58c-2026 (Tabelle «Verheiratete und Einelternfamilien», Fussnote 3: 263 Franken
//   je Kind): https://www.estv.admin.ch/dam/de/sd-web/gnde9CmEsalK/dbst-tairfe-58c-2026-dfi.pdf
// Folge: Die 263 Franken gibt es NUR zusammen mit dem Tarif nach Abs. 2 — nie auf den
// Grundtarif (Abs. 1). Der Kinderabzug vom Einkommen (Art. 35 Abs. 1 lit. a, 6800 Franken)
// ist ein eigener Abzug und bleibt daneben bestehen.
const KINDERABZUG_PRO_KIND = 263;

// Rundung und Erhebungsgrenze, gilt für alle Tarife (Abs. 1, 2, 2bis). Abgerufen 15.09.2026:
//   1) Einkommen auf 100 Franken abrunden. ESTV Form. 58c-2026, Fussnote 1: «Restbeträge von
//      weniger als CHF 100 fallen ausser Betracht.» Die Tarife in Art. 36 DBG steigen «für je
//      weitere 100 Franken Einkommen».
//   2) Jahressteuer auf 5 Rappen abrunden. ESTV Form. 58c-2026, Fussnote 2: «Die Jahressteuer
//      wird gegebenenfalls auf die nächsten 5 Rp. abgerundet.» Im DBG und in der VKP vom
//      10.9.2025 (AS 2025 579) steht dazu nichts. Weil die 263 Franken ganze Franken sind,
//      ergibt Abrunden vor oder nach der Ermässigung dasselbe.
//   3) Art. 36 Abs. 3 DBG: «Steuerbeträge unter 25 Franken werden nicht erhoben.» Das ist eine
//      Erhebungsgrenze, kein Freibetrag: 25.00 wird voll erhoben. Sie gilt für den Betrag, der
//      erhoben würde, also nach der Ermässigung von Abs. 2bis.
// Reihenfolge: Einkommen abrunden → Tarif → minus 263 je Kind → auf 5 Rp. abrunden → unter 25 = 0.
//
// Widerspruch Gesetz ↔ Tabelle bei 76 200 Franken (Grundtarif): Art. 36 Abs. 1 DBG (Fedlex,
// Stand 1.1.2026, gleich in FR/IT und in AS 2025 579) nennt 1 152.55, Form. 58c-2026 nennt
// 1 152.50. Beide sind Rundungen von 612.00 + 182 × 2.97 = 1 152.54 auf 5 Rappen, das Gesetz
// zum nächsten Wert, die Tabelle nach unten (Fussnote 2). Nur die Tabellenkette trifft die
// nächste Stufe des Gesetzes: 1 152.50 + 59 × 5.94 = 1 502.96 → 1 502.95. Die App folgt der
// Tabelle; zwischen 76 200 und 82 000 Franken liegt sie damit 5 Rappen unter dem Gesetzestext.
const ERHEBUNGSGRENZE = 25;

function abrundenAufHundert(einkommen) {
  return Math.floor(einkommen / 100) * 100;
}

function abrundenAufFuenfRappen(betrag) {
  return (Math.floor(Math.round(betrag * 100) / 5) * 5) / 100;
}

/**
 * Jahressteuer nach Art. 36 DBG mit Rundung und Erhebungsgrenze (Reihenfolge siehe oben).
 */
function jahressteuer(steuerBaresEinkommen, tarifAbs2, ermaessigung) {
  const massgebendesEinkommen = abrundenAufHundert(Math.max(0, steuerBaresEinkommen));
  const steuerVorAbzug = tarifAbs2
    ? bundessteuerVerheiratet(massgebendesEinkommen)
    : bundessteuerAlleinstehend(massgebendesEinkommen);
  const gerundet = abrundenAufFuenfRappen(Math.max(0, steuerVorAbzug - ermaessigung));
  const steuer = gerundet < ERHEBUNGSGRENZE ? 0 : gerundet;
  return { massgebendesEinkommen, steuerVorAbzug, steuer };
}

// Standardabzüge vom steuerbaren Einkommen (Bundessteuer)
// Die Säule-3a-Höchstabzüge stehen je Steuerjahr in `saeule3a.js`
// (SAEULE3A_HOECHSTABZUG_JE_STEUERJAHR). Die Kopie, die hier stand, las niemand —
// entfernt 24.09.2026, damit es keine zweite Quelle gibt.
const ABZUEGE = {
  versicherung: { alleinstehend: 1800, verheiratet: 3700, proKind: 700 },
  berufsauslagen: { pauschal: 2000, max: 4000 },
  kinderabzug: 6800,
  zweiverdiener: 8600,
};

/**
 * Berechne Steuer nach progressivem Stufentarif.
 */
function berechneStufentarif(einkommen, stufen, flatGrenze, flatSatz) {
  if (einkommen <= 0) return 0;

  // Über der oberen Tarifgrenze: einheitlich 11.5% des gesamten Einkommens.
  if (einkommen > flatGrenze) {
    return Math.round(einkommen * flatSatz * 100) / 100;
  }

  // Unterhalb der ersten Stufe (steuerfreies Minimum): keine Steuer.
  if (einkommen < stufen[0].ab) return 0;

  // Höchste Stufe, deren Untergrenze das Einkommen erreicht; amtliche Grundsteuer + Grenzsatz.
  let stufe = stufen[0];
  for (const s of stufen) {
    if (einkommen >= s.ab) stufe = s;
    else break;
  }

  const steuer = stufe.grundsteuer + (einkommen - stufe.ab) * stufe.satz;
  return Math.round(steuer * 100) / 100;
}

/**
 * Tarifwert Grundtarif (Art. 36 Abs. 1 DBG) wie in der Tabelle, OHNE Rundung und ohne
 * Erhebungsgrenze. Die Jahressteuer liefert berechneBundessteuer(). Die Kapitalleistungen
 * (Art. 38, kapitalbezugSteuer.js) rechnen bewusst weiter mit diesem Rohwert.
 */
export function bundessteuerAlleinstehend(steuerBaresEinkommen) {
  return berechneStufentarif(
    steuerBaresEinkommen,
    GRUNDTARIF_STUFEN,
    GRUNDTARIF_FLAT_GRENZE,
    GRUNDTARIF_FLAT_SATZ
  );
}

/**
 * Berechne direkte Bundessteuer für Verheiratete (Verheiratetentarif).
 */
export function bundessteuerVerheiratet(steuerBaresEinkommen) {
  return berechneStufentarif(
    steuerBaresEinkommen,
    VERHEIRATETENTARIF_STUFEN,
    VERHEIRATET_FLAT_GRENZE,
    VERHEIRATET_FLAT_SATZ
  );
}

/**
 * Greift Art. 36 Abs. 2bis DBG (Tarif nach Abs. 2 + 263 Franken je Kind)?
 * Verheiratete mit Kindern: wie bisher angenommen (die Kinder aus dem Haushalts-Kapitel
 * leben im gemeinsamen Haushalt). Alle anderen (verwitwet, getrennt, geschieden, ledig):
 * nur, wenn die Person bestätigt hat, dass die Kinder im gleichen Haushalt leben und sie
 * deren Unterhalt zur Hauptsache bestreitet — sonst der vorsichtige Grundtarif ohne Ermässigung.
 */
function elterntarifGreift(verheiratet, kinder, elterntarif) {
  return kinder > 0 && (verheiratet || elterntarif === true);
}

/**
 * Vollständige Bundessteuer-Berechnung mit Abzügen und Elterntarif.
 *
 * @param {Object} params
 * @param {number} params.bruttoEinkommen - Brutto-Jahreseinkommen
 * @param {boolean} [params.verheiratet=false]
 * @param {number} [params.kinder=0] - Kinder bzw. unterstützungsbedürftige Personen
 * @param {boolean} [params.elterntarif=false] - Nicht Verheiratete: Voraussetzungen von
 *   Art. 36 Abs. 2bis DBG bestätigt (gleicher Haushalt, Unterhalt zur Hauptsache)
 * @param {number} [params.abzuege=0] - Summe aller Abzüge vom Einkommen
 * @returns {Object} tarif: 'verheiratet' | 'eltern' | 'alleinstehend'
 */
export function berechneBundessteuer({
  bruttoEinkommen,
  verheiratet = false,
  kinder = 0,
  elterntarif = false,
  abzuege = 0,
}) {
  const abs2bis = elterntarifGreift(verheiratet, kinder, elterntarif);
  const tarif = verheiratet ? 'verheiratet' : (abs2bis ? 'eltern' : 'alleinstehend');

  if (bruttoEinkommen <= 0) {
    return {
      bruttoEinkommen: 0,
      abzuege: 0,
      steuerBaresEinkommen: 0,
      massgebendesEinkommen: 0,
      steuerVorAbzug: 0,
      kinderabzug: 0,
      steuer: 0,
      effektiverSatz: 0,
      tarif,
    };
  }

  const steuerBaresEinkommen = Math.max(0, bruttoEinkommen - abzuege);
  const kinderabzug = abs2bis ? kinder * KINDERABZUG_PRO_KIND : 0;
  const { massgebendesEinkommen, steuerVorAbzug, steuer } =
    jahressteuer(steuerBaresEinkommen, verheiratet || abs2bis, kinderabzug);

  const effektiverSatz = bruttoEinkommen > 0
    ? Math.round((steuer / bruttoEinkommen) * 10000) / 100
    : 0;

  return {
    bruttoEinkommen,
    abzuege,
    steuerBaresEinkommen,
    massgebendesEinkommen,
    steuerVorAbzug,
    kinderabzug,
    steuer,
    effektiverSatz,
    tarif,
  };
}

/**
 * E39: Bundessteuer auf ein SCHON steuerbares Einkommen (keine weiteren Abzüge).
 * So rechnen TaxCalculator, FinanzUebersicht und BehoerdenDossier: Das steuerbare Einkommen
 * kommt aus steuerbaresEinkommenFuerProfil() (src/data/kantonaleSteuerdaten.js) — dieselbe Zahl,
 * mit der die Kantonstabelle gelesen wird. Kein zweiter Abzug hier.
 * @param {Object} p
 * @param {number} p.steuerbaresEinkommen
 * @param {boolean} [p.verheiratet=false]
 * @param {number} [p.kinder=0]
 * @param {boolean} [p.elterntarif=false]
 * @param {number|null} [p.einkommen=0] Jahres-Nettolohn als Bezugsgrösse für Anzeige und effektiven
 *   Satz; 0 → Bezug ist das steuerbare Einkommen selbst.
 *   K86: null → es gibt keine passende Bezugsgrösse (das steuerbare Einkommen ist der gemeinsame
 *   Wert eines Ehepaars, der Nettolohn nur der eigene) → effektiverSatz null, keine Abzüge.
 */
export function bundessteuerAusSteuerbarem({
  steuerbaresEinkommen,
  verheiratet = false,
  kinder = 0,
  elterntarif = false,
  einkommen = 0,
}) {
  const r = berechneBundessteuer({ bruttoEinkommen: Number(steuerbaresEinkommen) || 0, verheiratet, kinder, elterntarif, abzuege: 0 });
  if (einkommen === null) return { ...r, effektiverSatz: null };
  const bezug = Number(einkommen) > 0 ? Number(einkommen) : r.steuerBaresEinkommen;
  return {
    ...r,
    bruttoEinkommen: bezug,
    abzuege: Math.max(0, bezug - r.steuerBaresEinkommen),
    effektiverSatz: bezug > 0 ? Math.round((r.steuer / bezug) * 10000) / 100 : 0,
  };
}

/**
 * Grenzsteuersatz bei einem bestimmten Einkommen ermitteln.
 */
export function grenzsteuersatz(einkommen, verheiratet = false) {
  if (einkommen <= 0) return 0;

  const stufen = verheiratet ? VERHEIRATETENTARIF_STUFEN : GRUNDTARIF_STUFEN;
  const flatGrenze = verheiratet ? VERHEIRATET_FLAT_GRENZE : GRUNDTARIF_FLAT_GRENZE;
  const flatSatz = verheiratet ? VERHEIRATET_FLAT_SATZ : GRUNDTARIF_FLAT_SATZ;

  if (einkommen > flatGrenze) return flatSatz * 100;
  if (einkommen < stufen[0].ab) return 0;

  let satz = 0;
  for (const s of stufen) {
    if (einkommen >= s.ab) satz = s.satz;
    else break;
  }
  return satz * 100;
}

/**
 * Vergleiche Steuerbelastung: alleinstehend vs. verheiratet.
 * «Alleinstehend» mit Kindern bekommt den Elterntarif (Art. 36 Abs. 2bis DBG) nur, wenn die
 * Voraussetzungen bestätigt sind — sonst Grundtarif ohne Ermässigung je Kind.
 * R4: steuerbarVerheiratet = steuerbares Einkommen im Fall «verheiratet» (andere Abzüge als ledig,
 * siehe tarifvergleichFuerProfil in kantonaleSteuerdaten.js). Ohne Angabe: dasselbe wie ledig.
 */
export function vergleicheTarife(steuerBaresEinkommen, kinder = 0, elterntarif = false, steuerbarVerheiratet = steuerBaresEinkommen) {
  const ermaessigung = kinder > 0 ? kinder * KINDERABZUG_PRO_KIND : 0;
  const eltern = elterntarifGreift(false, kinder, elterntarif);
  const alleinstehend = jahressteuer(steuerBaresEinkommen, eltern, eltern ? ermaessigung : 0).steuer;
  const verheiratet = jahressteuer(steuerbarVerheiratet, true, ermaessigung).steuer;

  return {
    alleinstehend,
    verheiratet,
    differenz: Math.round((alleinstehend - verheiratet) * 100) / 100,
    steuerBaresEinkommen,
    steuerBaresEinkommenVerheiratet: steuerbarVerheiratet,
  };
}

export const STEUER_PARAMS = {
  kinderabzugProKind: KINDERABZUG_PRO_KIND,
  grundtarifFlatGrenze: GRUNDTARIF_FLAT_GRENZE,
  grundtarifFlatSatz: GRUNDTARIF_FLAT_SATZ * 100,
  verheiratatFlatGrenze: VERHEIRATET_FLAT_GRENZE,
  verheiratatFlatSatz: VERHEIRATET_FLAT_SATZ * 100,
  abzuege: ABZUEGE,
};

export const STEUER_DATA_VERSION = '2026';
export const STEUER_DATA_SOURCE = 'DBG Art. 36, ESTV/EFD Tarif 2026 (kalte Progression, VKP SR 642.119.2)';
