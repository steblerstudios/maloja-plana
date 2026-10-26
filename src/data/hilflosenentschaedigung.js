// Hilflosenentschädigung (HE) der IV und der AHV für Maloja Plana
//
// Rechnet den Monatsbetrag aus drei Angaben: wer zahlt (IV oder AHV), Grad der Hilflosigkeit
// (leicht / mittel / schwer) und Wohnform (zu Hause / im Heim). Den Grad legt die IV-Stelle fest,
// nicht die Person selbst. Darum ist das Ergebnis eine SCHÄTZUNG, auch wenn die Beträge amtlich
// sind. Keine Netzwerk-Calls, reine Berechnung.
//
// === Regel (gelesen am 26.10.2026) ===
//   IV, IVG Art. 42ter Abs. 1 (Fedlex, Stand 1.1.2026): «bei schwerer Hilflosigkeit 80 Prozent, bei
//     mittelschwerer Hilflosigkeit 50 Prozent» und «bei leichter Hilflosigkeit 20 Prozent des
//     Höchstbetrages der Altersrente». Abs. 2: im Heim «ein Viertel» davon. Abs. 3:
//     Intensivpflegezuschlag für Minderjährige, 40 / 70 / 100 % des Höchstbetrages bei mindestens
//     4 / 6 / 8 Stunden täglich; er entfällt bei einem Heimaufenthalt. Für Minderjährige wird
//     pro Tag gerechnet.
//   IV, IVG Art. 42 Abs. 4: Anspruch erst, wenn die Hilflosigkeit «während eines Jahres ohne
//     wesentlichen Unterbruch» bestanden hat.
//   AHV, AHVG Art. 43bis Abs. 3 (Fedlex, Stand 1.1.2026): 80 / 50 / 20 % des MINDESTbetrages der
//     Altersrente. Abs. 1bis: der leichte Grad entfällt bei einem Aufenthalt im Heim; mittel und
//     schwer sind im Heim gleich hoch wie zu Hause. Abs. 2: Wartezeit sechs Monate. Abs. 4:
//     wer vorher eine HE der IV bezog, erhält sie «mindestens im bisherigen Betrag» (Besitzstand).
//
// === Beträge ===
//   2026 zitiert: Merkblatt 4.13 (Stand 1.1.2025, Ziff. 6 und 9) und Merkblatt 3.01
//     (Stand 1.1.2026, Ziff. 28); BSV «Beträge gültig ab dem 1. Januar 2026» (keine Änderung
//     gegenüber 2025).
//   2027 gerechnet, nicht zitiert: Regel oben × Renten 2027 (1 280 / 2 560, V vom 2.10.2026
//     Art. 3, siehe ahvRechner.js). Eine amtliche Tabelle 2027 für die HE lag am 26.10.2026 noch
//     nicht vor. Der Test prüft, dass beide Jahre genau der Regel folgen.

import { ergebnis, ERGEBNIS_ART } from './ergebnisArt.js';
import { werteFuerStichtag } from './jahrestabelle.js';

export const GRADE = Object.freeze(['leicht', 'mittel', 'schwer']);
export const WOHNFORMEN = Object.freeze(['zuhause', 'heim']);
export const TRAEGER = Object.freeze(['iv', 'ahv']);
export const INTENSIV_STUNDEN = Object.freeze([0, 4, 6, 8]);

// Anteile aus dem Gesetz (oben). Bezugsgrösse: IV = Höchstbetrag, AHV = Mindestbetrag der Altersrente.
export const HE_ANTEIL = Object.freeze({ leicht: 0.2, mittel: 0.5, schwer: 0.8 });
export const HE_HEIM_ANTEIL_IV = 0.25;
export const INTENSIV_ANTEIL = Object.freeze({ 4: 0.4, 6: 0.7, 8: 1.0 });

// Wartezeit bis zum Anspruch, in Monaten.
export const WARTEZEIT_MONATE = Object.freeze({ iv: 12, ahv: 6 });
// IV: wer sich später als ein Jahr nach Entstehen des Anspruchs anmeldet, erhält höchstens die
// zwölf Monate vor der Anmeldung (Merkblatt 4.13 Ziff. 5).
export const NACHZAHLUNG_MAX_MONATE_IV = 12;

export const HE_WERTE_JE_JAHR = Object.freeze({
  2026: Object.freeze({
    mindestrente: 1260,
    hoechstrente: 2520,
    iv: Object.freeze({
      zuhause: Object.freeze({ leicht: 504, mittel: 1260, schwer: 2016 }),
      heim: Object.freeze({ leicht: 126, mittel: 315, schwer: 504 }),
    }),
    ahv: Object.freeze({ leicht: 252, mittel: 630, schwer: 1008 }),
    intensiv: Object.freeze({ 4: 1008, 6: 1764, 8: 2520 }),
    gerechnet: false,
    quelle: 'IVG Art. 42–42ter, AHVG Art. 43bis, Merkblatt 4.13 (Stand 1.1.2025), Merkblatt 3.01 (Stand 1.1.2026), BSV Beträge ab 1.1.2026',
  }),
  2027: Object.freeze({
    mindestrente: 1280,
    hoechstrente: 2560,
    iv: Object.freeze({
      zuhause: Object.freeze({ leicht: 512, mittel: 1280, schwer: 2048 }),
      heim: Object.freeze({ leicht: 128, mittel: 320, schwer: 512 }),
    }),
    ahv: Object.freeze({ leicht: 256, mittel: 640, schwer: 1024 }),
    intensiv: Object.freeze({ 4: 1024, 6: 1792, 8: 2560 }),
    gerechnet: true,
    quelle: 'IVG Art. 42ter, AHVG Art. 43bis × Renten 2027 (V vom 2.10.2026, AS 2026 542), gerechnet',
  }),
});

// Werte für ein Datum (Standard: heute), samt `jahr` für die Anzeige «Stand {jahr}».
export function heWerte(stichtag) {
  return werteFuerStichtag(HE_WERTE_JE_JAHR, stichtag);
}

function betragFuer(w, traeger, grad, wohnen) {
  if (traeger === 'ahv') {
    if (grad === 'leicht' && wohnen === 'heim') return null; // AHVG Art. 43bis Abs. 1bis
    return w.ahv[grad];
  }
  return w.iv[wohnen][grad];
}

/**
 * Monatsbetrag der Hilflosenentschädigung.
 *
 * @param {Object} p
 * @param {'iv'|'ahv'} p.traeger          IV vor dem Referenzalter, AHV mit ganzer Altersrente oder EL
 * @param {'leicht'|'mittel'|'schwer'|null} p.grad  null = noch nicht bekannt → nur die Spanne
 * @param {'zuhause'|'heim'} p.wohnen      Heim = mehr als 15 Tage im Monat (Merkblatt 4.13 Ziff. 6)
 * @param {boolean} [p.minderjaehrig]      nur IV; Betrag pro Tag gerechnet, hier als Monat
 * @param {0|4|6|8} [p.intensivStunden]    Intensivpflegezuschlag, nur Minderjährige zu Hause
 * @param {boolean} [p.besitzstandIV]      AHV: vorher HE der IV bezogen
 * @param {*} [p.stichtag]
 */
export function berechneHilflosenentschaedigung({
  traeger = 'iv', grad = null, wohnen = 'zuhause', minderjaehrig = false,
  intensivStunden = 0, besitzstandIV = false, stichtag,
} = {}) {
  const w = heWerte(stichtag);
  const t = TRAEGER.includes(traeger) ? traeger : 'iv';
  const wo = WOHNFORMEN.includes(wohnen) ? wohnen : 'zuhause';
  // Minderjährige erhalten keine Altersrente — für sie zahlt immer die IV.
  const effTraeger = minderjaehrig ? 'iv' : t;
  const basis = {
    traeger: effTraeger, wohnen: wo, jahr: w.jahr, belegt: w.belegt, gerechnet: w.gerechnet,
    quelle: w.quelle, wartezeitMonate: WARTEZEIT_MONATE[effTraeger],
  };

  // Minderjährige im Heim: Anspruch nur für Tage, an denen die Eltern die Heimkosten selber tragen
  // (Merkblatt 4.13 Ziff. 8) — das rechnet dieser Rechner nicht.
  if (minderjaehrig && wo === 'heim') {
    return { ...basis, anspruch: null, grund: 'minderjaehrig_heim', betragMonat: null, intensivMonat: 0 };
  }

  if (!GRADE.includes(grad)) {
    const moeglich = GRADE.map((g) => betragFuer(w, effTraeger, g, wo)).filter((b) => b != null);
    return {
      ...basis, anspruch: null, grund: 'grad_offen', betragMonat: null, intensivMonat: 0,
      spanne: { min: Math.min(...moeglich), max: Math.max(...moeglich) },
    };
  }

  let betrag = betragFuer(w, effTraeger, grad, wo);
  if (betrag == null) {
    return { ...basis, anspruch: false, grund: 'ahv_leicht_heim', betragMonat: 0, intensivMonat: 0 };
  }

  let besitzstand = false;
  if (effTraeger === 'ahv' && besitzstandIV) {
    // «mindestens im bisherigen Betrag» — den bisherigen kennt nur die Verfügung. Als Näherung
    // der IV-Betrag von heute für denselben Grad und dieselbe Wohnform.
    const ivBetrag = w.iv[wo][grad];
    if (ivBetrag > betrag) { betrag = ivBetrag; besitzstand = true; }
  }

  const stunden = INTENSIV_ANTEIL[intensivStunden] ? intensivStunden : 0;
  const intensivMonat = minderjaehrig && wo === 'zuhause' && stunden ? w.intensiv[stunden] : 0;

  return {
    ...basis, anspruch: true, grund: null, grad, besitzstand,
    betragMonat: betrag, intensivMonat,
    totalMonat: betrag + intensivMonat,
    totalJahr: (betrag + intensivMonat) * 12,
  };
}

// O3 — Ergebnis-Art: SCHÄTZUNG. Die Beträge sind amtlich, aber den Grad schätzt die Person selbst
// ein; festgelegt wird er von der IV-Stelle nach einer Abklärung. Fehlt der Grad, ist es nur eine Spanne.
export function heErgebnis({ grad }) {
  return ergebnis(ERGEBNIS_ART.SCHAETZUNG, { fehlend: GRADE.includes(grad) ? [] : ['grad'] });
}
