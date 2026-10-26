// Lohnabzüge (brutto↔netto), Referenzalter und BVG-Grundwerte — aus ahvRechner.js herausgelöst
// (25.09.2026), damit die Sozialhilfe-Schnellrechnung im Startbündel nicht den ganzen AHV-Rechner
// nachzieht. ahvRechner.js reicht alles weiter.

import { werteFuerStichtag } from './jahrestabelle.js';

export const REFERENZALTER = 65;

// === BVG-Grenzbeträge und Lohnabzüge je Kalenderjahr (Weg A, Entscheid Stebler Studios 21.10.2026) ===
// Auswahl nach Stichtag über `lohnWerte(stichtag)`; die Konstanten weiter unten sind der Stand
// beim Laden der App.
//
// BVG (BVV 2 Art. 5, SR 831.441.1), Tabelle «Bisherige / Neue Beträge»:
//   22 680 → 23 040 (Eintrittsschwelle, Art. 2 Abs. 1 / Art. 7 Abs. 1 BVG)
//   26 460 → 26 880 (Koordinationsabzug, Art. 8 Abs. 1 BVG)
//   90 720 → 92 160 (oberer Grenzbetrag, Art. 8 Abs. 1 BVG)
//    3 780 →  3 840 (minimaler koordinierter Lohn, Art. 8 Abs. 2 BVG)
//   Fussnote: «Fassung gemäss Ziff. I der V vom 2. Okt. 2026, in Kraft seit 1. Jan. 2027 (AS 2026 547)».
//   Fedlex, Stand 1.1.2027, abgerufen 21.10.2026:
//   https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1984/543_543_543/20270101/de/html/fedlex-data-admin-ch-eli-cc-1984-543_543_543-20270101-de-html.html
//   Höchster koordinierter Lohn = oberer Grenzbetrag − Koordinationsabzug (gerechnet, kein Zitat).
// Beitragssatz AHV/IV/EO Arbeitnehmende 2027 = 4,35 + 0,7 + 0,25 = 5,3 %, unverändert:
//   AHVG Art. 5 Abs. 1 «4,35 Prozent» und IVG Art. 3 Abs. 1 «1,4 Prozent» (je hälftig), beide
//   Fedlex Stand 1.1.2027, abgerufen 21.10.2026 · EOV Art. 36 Abs. 1 «0,5 Prozent» (AS 2026 548).
// ALV-Höchstbetrag 148 200/Jahr, unverändert: UVV Art. 22 Abs. 1, Fedlex Stand 1.1.2027.
// Freibetrag Rentner 16 800/Jahr = 1 400/Monat, unverändert: AHVV Art. 6quater Abs. 1 «den Freibetrag von
//   16 800 Franken im Jahr», je Arbeitgeber, «ab dem Monat, nachdem» das Referenzalter erreicht ist
//   (Fedlex, im Browser gelesen 25.10.2026; Fassung vom 30. Aug. 2023, in Kraft seit 1.1.2024, AS 2023 506).
// ALV-Beitragssatz 1,1 %: keine Änderung gefunden (nicht im Paket des Bundesrats vom 02.10.2026).
export const LOHN_WERTE_JE_JAHR = Object.freeze({
  2026: Object.freeze({
    eintrittsschwelle: 22680,
    koordinationsabzug: 26460,
    minKoordinierterLohn: 3780,
    maxKoordinierterLohn: 64260,   // 90 720 − 26 460
    ahvIvEoSatzAn: 0.053,
    alvSatzAn: 0.011,
    alvHoechstbetragJahr: 148200,
    ahvFreibetragRentnerMonat: 1400,
  }),
  2027: Object.freeze({
    eintrittsschwelle: 23040,
    koordinationsabzug: 26880,
    minKoordinierterLohn: 3840,
    maxKoordinierterLohn: 65280,   // 92 160 − 26 880
    ahvIvEoSatzAn: 0.053,
    alvSatzAn: 0.011,
    alvHoechstbetragJahr: 148200,
    ahvFreibetragRentnerMonat: 1400,
  }),
});

// Werte für ein Datum (Standard: heute). Siehe jahrestabelle.js für Jahre ausserhalb der Tabelle.
export function lohnWerte(stichtag) {
  return werteFuerStichtag(LOHN_WERTE_JE_JAHR, stichtag);
}

const LOHN_HEUTE = lohnWerte();
export const KOORDINATIONSABZUG = LOHN_HEUTE.koordinationsabzug; // BVG-Koordinationsabzug

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
export const BVG_EINTRITTSSCHWELLE_JAHR = LOHN_HEUTE.eintrittsschwelle; // ¾ der max. AHV-Rente, Art. 2 Abs. 1 BVG

export function bvgKoordinationsabzug(jahresbruttolohn, stichtag) {
  const w = lohnWerte(stichtag);
  // «nicht mehr als 22 680» (2027: 23 040) ist befreit (Art. 2 Abs. 1 BVG; Merkblatt 6.06) → <=
  if (jahresbruttolohn <= w.eintrittsschwelle) return { versichert: false, koordinierterLohn: 0 };

  const koordinierterLohn = Math.max(w.minKoordinierterLohn, jahresbruttolohn - w.koordinationsabzug);
  return {
    versichert: true,
    koordinierterLohn: Math.min(koordinierterLohn, w.maxKoordinierterLohn),
    koordinationsabzug: w.koordinationsabzug,
    eintrittsschwelle: w.eintrittsschwelle,
  };
}

// BVG-Altersgutschriften (% des koordinierten Lohns, Art. 16 BVG)
export const BVG_GUTSCHRIFTEN = [
  { von: 25, bis: 34, satz: 7 },
  { von: 35, bis: 44, satz: 10 },
  { von: 45, bis: 54, satz: 15 },
  { von: 55, bis: 65, satz: 18 },
];

// BVG-Altersgutschrift-Satz (% des koordinierten Lohns) für ein Alter (Art. 16 BVG). Das Alter ist das nach BVV 2
// Art. 13 (Kalenderjahr minus Geburtsjahr) — die Aufrufer geben `bvgAlter` aus alterUndRentenalter (seit 26.10.2026).
// Unter 25 / über 65: keine obligatorischen Sparbeiträge → 0.
export function bvgAltersgutschriftSatz(alter) {
  const a = Number(alter);
  if (!Number.isFinite(a)) return 0;
  const stufe = BVG_GUTSCHRIFTEN.find(g => a >= g.von && a <= g.bis);
  return stufe ? stufe.satz : 0;
}

// Grober Brutto-RICHTWERT aus einem Netto-Monatslohn (inkl. geschätzter PK/BVG).
// Kehrt die fixen Arbeitnehmer-Abzüge um: AHV/IV/EO 5.3 % + ALV 1.1 % = 6.4 %
// (Merkblätter 2.01 und 2.08, Belege bei abzuegeRichtwertMonat unten) PLUS die BVG-Altersgutschrift nach Alter (Art. 16 BVG),
// als ~halber Arbeitnehmer-Anteil auf dem koordinierten Lohn und erst über der
// Eintrittsschwelle (CHF 22'680/Jahr, ab 2027 23'040). NICHT enthalten: Steuern, NBU-Prämie,
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
// Werte je Jahr: LOHN_WERTE_JE_JAHR oben (2027 unverändert, Belege dort).
export const AHV_IV_EO_SATZ_AN = LOHN_HEUTE.ahvIvEoSatzAn;
export const ALV_SATZ_AN = LOHN_HEUTE.alvSatzAn;
export const ALV_HOECHSTBETRAG_JAHR = LOHN_HEUTE.alvHoechstbetragJahr;
export const AHV_FREIBETRAG_RENTNER_MONAT = LOHN_HEUTE.ahvFreibetragRentnerMonat;  // 16 800/Jahr
// beitragsfrei (seit 26.10.2026, fedlex gelesen): erwerbstätige Kinder zahlen keine AHV/IV/EO «bis zum 31. Dezember des
// Jahres, in welchem sie das 17. Altersjahr zurückgelegt haben» (AHVG Art. 3 Abs. 2 lit. a); die ALV folgt der AHV-
// Beitragspflicht (AVIG Art. 2 Abs. 1 lit. a); die BVG-Pflicht beginnt erst am 1. Januar danach (BVG Art. 7 Abs. 1).
// Dann zieht der Richtwert nichts ab. Bestimmt in alterUndRentenalter (utils/nettoAusProfil.js), nach Jahrgang.
function abzuegeRichtwertMonat(bruttoMonat, alter, rentenalter = false, stichtag, beitragsfrei = false) {
  const w = lohnWerte(stichtag);
  if (beitragsfrei) return 0;
  if (rentenalter) return Math.max(0, bruttoMonat - w.ahvFreibetragRentnerMonat) * w.ahvIvEoSatzAn;
  const gutschrift = bvgAltersgutschriftSatz(alter);
  const koord = bvgKoordinationsabzug(bruttoMonat * 12, stichtag);
  const pkMonat = koord.versichert ? (koord.koordinierterLohn / 12) * (gutschrift / 100) / 2 : 0;
  return bruttoMonat * w.ahvIvEoSatzAn + Math.min(bruttoMonat, w.alvHoechstbetragJahr / 12) * w.alvSatzAn + pkMonat;
}

export function nettoZuBruttoRichtwert(nettoMonat, alter, rentenalter = false, stichtag, beitragsfrei = false) {
  const netto = Math.max(0, Number(nettoMonat) || 0);
  if (netto <= 0) return 0;
  if (beitragsfrei) return Math.round(netto);
  // Fixpunkt-Iteration: Brutto minus Abzüge soll das Netto treffen. Die Abzüge wachsen
  // monoton mit dem Brutto → wenige Schritte konvergieren.
  let brutto = netto / (1 - AHV_ALV_ARBEITNEHMER_SATZ);
  for (let i = 0; i < 12; i++) {
    brutto += netto - (brutto - abzuegeRichtwertMonat(brutto, alter, rentenalter, stichtag));
  }
  // An der BVG-Eintrittsschwelle springen die Abzüge (Art. 2 BVG): manche Netto-Werte hat kein
  // Brutto genau. Dann den Kandidaten nehmen, dessen Rückrechnung am nächsten liegt (die Schwelle).
  const netto_ = (b) => b - abzuegeRichtwertMonat(b, alter, rentenalter, stichtag);
  const kandidaten = [brutto, lohnWerte(stichtag).eintrittsschwelle / 12];
  kandidaten.sort((a, b) => Math.abs(netto_(a) - netto) - Math.abs(netto_(b) - netto));
  return Math.round(kandidaten[0]);
}

// Gegenrichtung (25.09.2026, Dashboard-Leistungsliste und Schnellcheck): grober NETTO-Richtwert aus
// einem Brutto-Monatslohn — dieselben Abzüge wie oben (AHV/IV/EO + ALV 6.4 %, PK-Anteil nach Alter
// über der Eintrittsschwelle). NICHT enthalten: NBU-Prämie, Krankentaggeld, überobligatorische PK,
// Quellensteuer, 13. Monatslohn → das echte Netto liegt meist etwas TIEFER. Nur als «≈», nie verbindlich.
export function bruttoZuNettoRichtwert(bruttoMonat, alter, rentenalter = false, stichtag, beitragsfrei = false) {
  const brutto = Math.max(0, Number(bruttoMonat) || 0);
  if (brutto <= 0) return 0;
  return Math.round(brutto - abzuegeRichtwertMonat(brutto, alter, rentenalter, stichtag, beitragsfrei));
}
