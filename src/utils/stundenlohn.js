// «Was steht mir im Stundenlohn zu?» — Rechnung für Arbeit im Stundenlohn (Wunsch Stebler
// Studios, 25.09.2026; gebaut 28.09.2026).
//
// Was die Rechnung kann: aus dem Stundenlohn und den eigenen Angaben den Grundlohn und die
// Zuschläge getrennt zeigen, den Grundlohn gegen den kantonalen Mindestlohn halten und sagen,
// was noch offen ist. Was sie nicht kann: den Vertrag lesen. Jede Frage, die nur der Vertrag
// beantwortet, bleibt als Frage stehen — sie wird nicht mit einer Annahme zugedeckt.
//
// Warum der Grundlohn so wichtig ist: die kantonalen Mindestlöhne gelten OHNE Ferien- und
// Feiertagszuschlag (siehe data/lohnCheck.js, «Ferien-/Feiertagszuschläge»). Wer «25 Fr. alles
// inklusive» verdient, hat in Wahrheit einen tieferen Grundlohn — genau den muss man vergleichen.
//
// Mindestlohn-Befund: kommt aus `pruefeStundenlohn` (eine Wahrheit, kein zweiter Rechenweg).
// Er bleibt ein Befund für die Person selbst; ein Brief an den Arbeitgeber entsteht hier nicht
// (WAGECLAIM_BEREIT = false, Entscheid Stebler Studios 15.07.2026).
//
// Quellen je Aussage: in den Texten (i18n `stundenlohnView`) und unten an den Konstanten.

import { pruefeStundenlohn, stundenAufMonat, wochenstundenUnplausibel } from '../data/lohnCheck.js';
import { BVG_EINTRITTSSCHWELLE_JAHR } from '../data/lohnAbzuege.js';
import { ergebnis, fehlendeAngaben, ERGEBNIS_ART } from '../data/ergebnisArt.js';

// O3 — Schätzung: amtliche Eckwerte (OR, UVV, BVG, kantonaler Mindestlohn), aber mit Annahmen,
// die keine Stelle macht (gleiche Stunden übers Jahr, 13. als Zwölftel des Grundlohns).
// Fehlend ist, ohne was die Rechnung nur halb steht.
export function stundenlohnErgebnis(eingabe) {
  const e = eingabe || {};
  const w = lies(e.wochenstunden);
  return ergebnis(ERGEBNIS_ART.SCHAETZUNG, {
    fehlend: fehlendeAngaben({
      stundenlohn: lies(e.betrag) > 0,
      wochenstunden: w > 0 && !wochenstundenUnplausibel(e.wochenstunden),
      kanton: !!e.kanton,
      ferienform: FERIEN_FORMEN.includes(e.ferienForm) && e.ferienForm !== 'unklar',
    }),
  });
}

// Art des Arbeitsverhältnisses — bestimmt, welche Hinweise und Fragen dazukommen.
export const ARTEN = ['fest', 'abrufEcht', 'abrufUnecht', 'befristet', 'temporaer', 'hausdienst'];

// Wie werden die Ferien bezahlt?
//   inklusive — der genannte Stundenlohn enthält den Ferienzuschlag schon
//   dazu      — der Ferienzuschlag kommt zum genannten Stundenlohn dazu
//   bezahlt   — die Ferien werden bezogen und in dieser Zeit weiterbezahlt (kein Zuschlag)
//   unklar    — nicht bekannt: gerechnet wird mit beiden Lesarten
export const FERIEN_FORMEN = ['inklusive', 'dazu', 'bezahlt', 'unklar'];

export const ANTWORTEN = ['ja', 'nein', 'unklar'];

// OR Art. 329a Abs. 1: mindestens 4 Wochen, bis zum vollendeten 20. Altersjahr 5 Wochen.
export const FERIEN_MIN_WOCHEN = 4;
export const FERIEN_MIN_WOCHEN_BIS_20 = 5;

// Unfallversicherung: gegen Nichtberufsunfälle versichert ab 8 Std./Woche beim selben
// Arbeitgeber (UVV Art. 13 Abs. 1).
export const NBU_MIN_WOCHENSTUNDEN = 8;

// Liest «25.50», «25,50», «1'200» — alles andere (Text, negativ, leer) ergibt 0.
export const lies = (v) => {
  if (v === null || v === undefined) return 0;
  const x = Number(String(v).replace(/['’\s]/g, '').replace(',', '.'));
  return Number.isFinite(x) && x > 0 ? x : 0;
};
const rappen = (x) => Math.round(x * 100) / 100;

// Ferienzuschlag in Bruchteilen: Ferienwochen geteilt durch die Arbeitswochen.
// 4 Wochen → 4/48 = 8,33 % · 5 → 5/47 = 10,64 % · 6 → 6/46 = 13,04 %.
export function ferienSatz(wochen) {
  const w = Number(wochen) || 0;
  if (w <= 0 || w >= 52) return 0;
  return w / (52 - w);
}

// Ferien, die mindestens zustehen: vertraglich mehr ist möglich, weniger nicht.
export function ferienWochenAnspruch(vertragWochen, unter20) {
  const minimum = unter20 ? FERIEN_MIN_WOCHEN_BIS_20 : FERIEN_MIN_WOCHEN;
  const v = lies(vertragWochen);
  return Math.max(v, minimum);
}

// Eine Lesart: aus dem genannten Betrag den Grundlohn und die Zuschläge.
function lesart(betrag, satzFerien, satzFeiertag, dreizehnter, inklusive, mitZuschlag) {
  const grund = inklusive ? betrag / (1 + satzFerien) : betrag;
  const ferien = mitZuschlag ? grund * satzFerien : 0;
  const feiertag = grund * satzFeiertag;
  const dreizehnterAnteil = dreizehnter === 'ja' ? grund / 12 : 0;
  return {
    grund: rappen(grund),
    ferien: rappen(ferien),
    feiertag: rappen(feiertag),
    dreizehnter: rappen(dreizehnterAnteil),
    total: rappen(grund + ferien + feiertag + dreizehnterAnteil),
  };
}

// Mindestlohn am Grundlohn. Ohne Wochenstunden rechnet `pruefeStundenlohn` mit einer Stunde:
// der Stundenvergleich hängt nicht davon ab, nur die Monatsdifferenz — die fällt dann weg.
function mindestlohn(grund, wochenstunden, kanton, dreizehnter) {
  const w = wochenstunden > 0 ? wochenstunden : 1;
  const monat = grund * stundenAufMonat(w);
  const befund = pruefeStundenlohn(monat, w, kanton, 'brutto', dreizehnter === 'unklar' ? undefined : dreizehnter);
  if (!(wochenstunden > 0) && befund.status === 'unterMindestlohn') {
    const { mindestMonat, differenzMonat, ...rest } = befund;
    return rest;
  }
  return befund;
}

export function stundenlohnRechnen(eingabe) {
  const e = eingabe || {};
  const betrag = lies(e.betrag);
  const wochenstunden = lies(e.wochenstunden);
  const stundenUnplausibel = wochenstundenUnplausibel(e.wochenstunden);
  const w = stundenUnplausibel ? 0 : wochenstunden;
  const ferienForm = FERIEN_FORMEN.includes(e.ferienForm) ? e.ferienForm : 'unklar';
  const dreizehnter = ANTWORTEN.includes(e.dreizehnter) ? e.dreizehnter : 'unklar';
  const feiertag = ANTWORTEN.includes(e.feiertag) ? e.feiertag : 'unklar';

  const ferienWochen = ferienWochenAnspruch(e.ferienWochen, !!e.unter20);
  const vertragZuWenig = lies(e.ferienWochen) > 0 && lies(e.ferienWochen) < ferienWochen;
  const satzFerien = ferienSatz(ferienWochen);
  // Feiertagszuschlag nur, wenn vereinbart und beziffert — sonst bleibt es eine Frage.
  const satzFeiertag = feiertag === 'ja' ? Math.min(lies(e.feiertagProzent), 100) / 100 : 0;

  if (betrag <= 0) {
    return { status: 'brauchtBetrag', ferienWochen, satzFerien, vertragZuWenig };
  }

  const mitZuschlag = ferienForm !== 'bezahlt';
  const lesarten = ferienForm === 'unklar'
    ? {
        inklusive: lesart(betrag, satzFerien, satzFeiertag, dreizehnter, true, true),
        dazu: lesart(betrag, satzFerien, satzFeiertag, dreizehnter, false, true),
      }
    : { [ferienForm]: lesart(betrag, satzFerien, satzFeiertag, dreizehnter, ferienForm === 'inklusive', mitZuschlag) };

  const befunde = {};
  for (const [key, l] of Object.entries(lesarten)) {
    befunde[key] = e.kanton ? mindestlohn(l.grund, w, e.kanton, dreizehnter) : { status: 'keinKanton' };
  }

  // Jahreslohn (Schätzung): Grundlohn mit Ferien über 52 Wochen = Grundlohn × Stunden × 52,
  // gleich ob die Ferien als Zuschlag oder als bezahlte Wochen kommen. Dazu Feiertage und 13.
  // Massgebend für die Schwellen ist die tiefste Lesart — sie behauptet am wenigsten.
  const tiefste = Object.values(lesarten).reduce((a, b) => (a.grund <= b.grund ? a : b));
  const jahreslohn = w > 0
    ? Math.round(tiefste.grund * (1 + satzFeiertag) * w * 52 * (dreizehnter === 'ja' ? 13 / 12 : 1))
    : null;

  return {
    status: 'gerechnet',
    ferienForm,
    ferienWochen,
    satzFerien,
    vertragZuWenig,
    lesarten,
    befunde,
    wochenstunden: w,
    stundenUnplausibel,
    monat: w > 0 ? Object.fromEntries(Object.entries(lesarten).map(([k, l]) => [k, Math.round(l.total * stundenAufMonat(w))])) : null,
    jahreslohn,
    // BVG Art. 2 Abs. 1: versichert, wer bei einem Arbeitgeber MEHR als die Schwelle verdient.
    bvg: jahreslohn === null ? 'unbekannt' : jahreslohn > BVG_EINTRITTSSCHWELLE_JAHR ? 'obligatorisch' : 'darunter',
    bvgSchwelle: BVG_EINTRITTSSCHWELLE_JAHR,
    nbu: w > 0 ? (w >= NBU_MIN_WOCHENSTUNDEN ? 'versichert' : 'nurBeruf') : 'unbekannt',
    fragen: offeneFragen(e, { ferienForm, dreizehnter, feiertag }),
  };
}

// Was nur der Vertrag oder die Abrechnung beantwortet — als ruhige Fragen, nicht als Vorwurf.
export function offeneFragen(e, { ferienForm, dreizehnter, feiertag }) {
  const f = [];
  if (ferienForm === 'unklar') f.push('ferienForm');
  if ((ferienForm === 'inklusive' || ferienForm === 'dazu' || ferienForm === 'unklar') && e.ausgewiesen !== 'ja') f.push('ausgewiesen');
  if (feiertag === 'unklar') f.push('feiertag');
  if (dreizehnter === 'unklar') f.push('dreizehnter');
  if (e.art === 'abrufEcht') f.push('bereitschaft');
  if (e.art === 'temporaer') f.push('gav');
  if (e.art === 'befristet' && e.ueber3Monate !== 'ja') f.push('krankheit');
  return f;
}
