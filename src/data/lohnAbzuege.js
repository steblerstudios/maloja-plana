// Lohnabzüge (brutto↔netto), Referenzalter und BVG-Grundwerte — aus ahvRechner.js herausgelöst
// (25.09.2026), damit die Sozialhilfe-Schnellrechnung im Startbündel nicht den ganzen AHV-Rechner
// nachzieht. ahvRechner.js reicht alles weiter.

export const REFERENZALTER = 65;
export const KOORDINATIONSABZUG = 26460; // BVG-Koordinationsabzug 2026

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
 * Berechne den BVG-Mindestlohn und Koordinationsabzug.
 */
export const BVG_EINTRITTSSCHWELLE_JAHR = 22680; // Stand 2026 (¾ der max. AHV-Rente, Art. 2 Abs. 1 BVG)

export function bvgKoordinationsabzug(jahresbruttolohn) {
  const mindestlohn = BVG_EINTRITTSSCHWELLE_JAHR;
  // «nicht mehr als 22 680» ist befreit (Art. 2 Abs. 1 BVG; Merkblatt 6.06) → <= (bis 25.09.2026 <)
  if (jahresbruttolohn <= mindestlohn) return { versichert: false, koordinierterLohn: 0 };

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
export const BVG_GUTSCHRIFTEN = [
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

// Geschätzte Arbeitnehmer-Abzüge pro Monat aus einem Brutto-Monatslohn — der EINE Baustein für
// beide Richtungen (brutto→netto, netto→brutto), damit sie nie auseinanderlaufen.
// Fachprüfung swiss-precision 25.09.2026 (PR #380):
//   • AHV/IV/EO 5.3 % (Merkblatt 2.01, Stand 1.1.2026) · ALV 1.1 % nur bis zum Höchstbetrag
//     148 200/Jahr, darüber nichts (Merkblatt 2.08, Stand 1.1.2025).
//   • Im Rentenalter: keine ALV, keine BVG-Sparbeiträge, AHV/IV/EO nur über dem Freibetrag
//     1 400/Monat (Merkblatt 2.01, Ziff. 14/15).
export const AHV_IV_EO_SATZ_AN = 0.053;
export const ALV_SATZ_AN = 0.011;
export const ALV_HOECHSTBETRAG_JAHR = 148200;      // Stand 2026
export const AHV_FREIBETRAG_RENTNER_MONAT = 1400;  // 16 800/Jahr, Stand 2026
function abzuegeRichtwertMonat(bruttoMonat, alter, rentenalter = false) {
  if (rentenalter) return Math.max(0, bruttoMonat - AHV_FREIBETRAG_RENTNER_MONAT) * AHV_IV_EO_SATZ_AN;
  const gutschrift = bvgAltersgutschriftSatz(alter);
  const koord = bvgKoordinationsabzug(bruttoMonat * 12);
  const pkMonat = koord.versichert ? (koord.koordinierterLohn / 12) * (gutschrift / 100) / 2 : 0;
  return bruttoMonat * AHV_IV_EO_SATZ_AN + Math.min(bruttoMonat, ALV_HOECHSTBETRAG_JAHR / 12) * ALV_SATZ_AN + pkMonat;
}

export function nettoZuBruttoRichtwert(nettoMonat, alter, rentenalter = false) {
  const netto = Math.max(0, Number(nettoMonat) || 0);
  if (netto <= 0) return 0;
  // Fixpunkt-Iteration: Brutto minus Abzüge soll das Netto treffen. Die Abzüge wachsen
  // monoton mit dem Brutto → wenige Schritte konvergieren.
  let brutto = netto / (1 - AHV_ALV_ARBEITNEHMER_SATZ);
  for (let i = 0; i < 12; i++) {
    brutto += netto - (brutto - abzuegeRichtwertMonat(brutto, alter, rentenalter));
  }
  // An der BVG-Eintrittsschwelle springen die Abzüge (Art. 2 BVG): manche Netto-Werte hat kein
  // Brutto genau. Dann den Kandidaten nehmen, dessen Rückrechnung am nächsten liegt (die Schwelle).
  const netto_ = (b) => b - abzuegeRichtwertMonat(b, alter, rentenalter);
  const kandidaten = [brutto, BVG_EINTRITTSSCHWELLE_JAHR / 12];
  kandidaten.sort((a, b) => Math.abs(netto_(a) - netto) - Math.abs(netto_(b) - netto));
  return Math.round(kandidaten[0]);
}

// Gegenrichtung (25.09.2026, Dashboard-Leistungsliste und Schnellcheck): grober NETTO-Richtwert aus
// einem Brutto-Monatslohn — dieselben Abzüge wie oben (AHV/IV/EO + ALV 6.4 %, PK-Anteil nach Alter
// über der Eintrittsschwelle). NICHT enthalten: NBU-Prämie, Krankentaggeld, überobligatorische PK,
// Quellensteuer, 13. Monatslohn → das echte Netto liegt meist etwas TIEFER. Nur als «≈», nie verbindlich.
export function bruttoZuNettoRichtwert(bruttoMonat, alter, rentenalter = false) {
  const brutto = Math.max(0, Number(bruttoMonat) || 0);
  if (brutto <= 0) return 0;
  return Math.round(brutto - abzuegeRichtwertMonat(brutto, alter, rentenalter));
}
