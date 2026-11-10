// AHV-Bezug im Vorsorge-Rechner — Rücktritt und AHV-Bezug sind zweierlei (Kapitel 4, 10.11.2026).
//
// Der Regler im Zukunftsbild geht ab 58 (BVG-Vorbezug, 3a ab 60), die AHV kann aber frühestens zwei Jahre
// vor dem Referenzalter bezogen werden (AHVG Art. 40 Abs. 1: «ab dem vollendeten 63. Altersjahr»; Frauen der
// Übergangsgeneration ab 62, Art. 40c — deren Kürzungssätze rechnet die App nicht, siehe
// vr.vorbezugFrauenUebergang). Bisher lief jede Zahl der AHV mit dem Rücktrittsalter: ab 58 floss eine
// Vorbezugsrente (B-18), und mit leeren Beitragsjahren ergab ein «Bezug» mit 58 ab dem Referenzalter
// mehr Rente als einer mit 63 (B-19). Diese Bausteine trennen beides.

import { VORBEZUG_MAX_MONATE } from '../data/lohnAbzuege.js';

// Alter (in Jahren), mit dem der Rechner die AHV rechnet: das eingetragene Bezugs- bzw. Rücktrittsalter,
// aber nie früher als der früheste Vorbezug, den die Rechnung abbildet (Referenzalter − 24 Monate).
export function ahvBezugsalterFuerRechnung(bezugAlter, refAlterMonate) {
  const frueh = (refAlterMonate - VORBEZUG_MAX_MONATE) / 12;
  const b = Number(bezugAlter);
  if (!Number.isFinite(b) || b <= 0) return refAlterMonate / 12;
  return Math.max(frueh, b);
}

// Monate für die AHV-Fläche im Zukunftsbild: Die Rente fliesst ab dem AHV-Bezug (nicht ab dem Rücktritt)
// bis zur Lebenserwartung; bis zum Referenzalter die Vorbezugsrente. `abRuecktritt` sagt, ob im Monat
// nach dem Rücktritt schon AHV kommt (sonst ist die Zeit bis zum Bezug zu überbrücken).
export function ahvZukunftMonate({ ruecktritt, ahvBezug, refAlterJahre, lebenserwartung }) {
  const horizont = Math.max(12, Math.round((lebenserwartung - ahvBezug) * 12));
  const vorbezug = Math.min(horizont, Math.max(0, Math.round((refAlterJahre - ahvBezug) * 12)));
  return { horizont, vorbezug, abRuecktritt: ruecktritt >= ahvBezug };
}

// Beitragsjahre bis zum Referenzalter mit IK-Auszug (B-17): die Jahre laut Auszug PLUS die Jahre, die bis
// zum Rentenbeginn noch kommen. Gezählt wird bis zum 31. Dezember vor dem Rentenbeginn (BSV-Merkblatt 3.01,
// Ziff. 12), mit derselben Jahresrechnung wie im Rechner (Geburtsmonat, sonst Januar). Künftige Jahre
// beginnen nach dem letzten Jahr im Auszug, frühestens im laufenden Jahr: eine Lücke zwischen dem letzten
// erfassten Jahr und heute bleibt eine Lücke (nichts wird rückwirkend angenommen).
export function ikBeitragsjahreBisReferenzalter({ ikBeitragsjahre, letztesIkJahr, geburtsjahr, geburtsmonat, refAlterMonate, volleDauer, jetztJahr = new Date().getFullYear() }) {
  const m = Number(geburtsmonat) >= 1 && Number(geburtsmonat) <= 12 ? Number(geburtsmonat) : 1;
  const letztesBeitragsjahr = geburtsjahr + Math.floor((m - 1 + refAlterMonate) / 12) - 1;
  const ab = Math.max(Number(letztesIkJahr) || 0, jetztJahr - 1, geburtsjahr + 20);
  const zukunft = Math.max(0, letztesBeitragsjahr - ab);
  return Math.min(volleDauer, (Number(ikBeitragsjahre) || 0) + zukunft);
}
