// Anzeige, Ablehnen und Feedback-Takt zur Zählung (utils/nutzungsTage.js). Eigene Datei, damit
// sie nicht im Startbündel liegen: Nur Dashboard und Einstellungen brauchen sie.
import { SCHLUESSEL, ABGELEHNT, lokal, lesen, stand, monatVon, tagVon } from './nutzungsTage.js';

export const FEEDBACK = 'or5_beta_feedback';
export const FEEDBACK_ABSTAND_TAGE = 90;

export function nutzungstageImMonat(speicher = lokal(), jetzt = new Date()) {
  if (!speicher) return 0;
  const wert = stand(speicher);
  return wert && wert.monat === monatVon(jetzt) ? wert.tage : 0;
}

export function zaehlenSetzen(an, speicher = lokal()) {
  if (!speicher) return;
  try {
    if (an) speicher.removeItem(ABGELEHNT);
    else { speicher.setItem(ABGELEHNT, '1'); speicher.removeItem(SCHLUESSEL); }
  } catch { /* ohne Speicher keine Wahl */ }
}

// Merker: Datum der letzten Antwort, oder `weg:` + Datum, wenn es weggeklickt wurde. Beides
// lässt das Feedback 90 Tage ruhen. Das alte `done` hat kein Datum: Die Frist beginnt dann heute.
export function feedbackMerken(weggeklickt = false, speicher = lokal(), jetzt = new Date()) {
  if (!speicher) return;
  try { speicher.setItem(FEEDBACK, (weggeklickt ? 'weg:' : '') + tagVon(jetzt)); } catch { /* ohne Speicher kein Merker */ }
}

// null = bereit · 'beantwortet' oder 'weggeklickt' = ruht noch
export function feedbackRuht(speicher = lokal(), jetzt = new Date()) {
  if (!speicher) return null;
  const wert = lesen(speicher, FEEDBACK);
  if (!wert) return null;
  if (wert === 'done') { feedbackMerken(false, speicher, jetzt); return 'beantwortet'; }
  const treffer = /^(weg:)?(\d{4})-(\d{2})-(\d{2})$/.exec(wert);
  if (!treffer) return null;
  const damals = new Date(Number(treffer[2]), Number(treffer[3]) - 1, Number(treffer[4]));
  const heute = new Date(jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate());
  const tage = Math.round((heute - damals) / 86400000);
  if (tage >= FEEDBACK_ABSTAND_TAGE) return null;
  return treffer[1] ? 'weggeklickt' : 'beantwortet';
}
