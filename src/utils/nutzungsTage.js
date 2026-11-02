// Wiederkehr, nur auf dem Gerät (02.11.2026, Entscheid Stebler Studios: «Zählen ja, drängen nein»).
//
// Zählt, an wie vielen Tagen Maloja im laufenden Monat geöffnet wurde. Mehr nicht: keine
// Kennung, keine Uhrzeit, keine Ansichten, und der Vormonat wird überschrieben. Das Zählen
// lässt sich in den Einstellungen ablehnen. Nach dem Beta-Feedback hat es keinen Zweck mehr,
// darum endet es dort, und die Zahl wird beim nächsten Start entfernt. Die Zahl
// verlässt das Gerät nur, wenn die Person sie im Beta-Feedback ankreuzt und die E-Mail selbst
// sendet. Der Schlüssel beginnt mit `or5_`, «Alle Daten löschen» nimmt ihn also mit.

export const SCHLUESSEL = 'or5_nutzungstage';
export const ABGELEHNT = 'or5_nutzungstage_aus';
const FEEDBACK = 'or5_beta_feedback';

const zweistellig = (n) => String(n).padStart(2, '0');
const monatVon = (d) => d.getFullYear() + '-' + zweistellig(d.getMonth() + 1);
const tagVon = (d) => monatVon(d) + '-' + zweistellig(d.getDate());

const lokal = () => (typeof localStorage === 'undefined' ? null : localStorage);

const stand = (speicher) => {
  try {
    const wert = JSON.parse(speicher.getItem(SCHLUESSEL));
    return wert && Number.isInteger(wert.tage) && wert.tage > 0 ? wert : null;
  } catch { return null; }
};

const lesen = (speicher, k) => { try { return speicher.getItem(k); } catch { return null; } };

export function zaehlenErlaubt(speicher = lokal()) {
  return !!speicher && lesen(speicher, ABGELEHNT) !== '1';
}

export function feedbackErledigt(speicher = lokal()) {
  return !!speicher && lesen(speicher, FEEDBACK) === 'done';
}

export function zaehlenSetzen(an, speicher = lokal()) {
  if (!speicher) return;
  try {
    if (an) speicher.removeItem(ABGELEHNT);
    else { speicher.setItem(ABGELEHNT, '1'); speicher.removeItem(SCHLUESSEL); }
  } catch { /* ohne Speicher keine Wahl */ }
}

export function tagMerken(speicher = lokal(), jetzt = new Date()) {
  if (!speicher) return;
  if (!zaehlenErlaubt(speicher) || feedbackErledigt(speicher)) { tageLoeschen(speicher); return; }
  const monat = monatVon(jetzt);
  const letzter = tagVon(jetzt);
  const alt = stand(speicher);
  if (alt && alt.letzter === letzter) return;
  const tage = alt && alt.monat === monat ? alt.tage + 1 : 1;
  try { speicher.setItem(SCHLUESSEL, JSON.stringify({ monat, letzter, tage })); } catch { /* ohne Speicher keine Zählung */ }
}

export function nutzungstageImMonat(speicher = lokal(), jetzt = new Date()) {
  if (!speicher) return 0;
  const wert = stand(speicher);
  return wert && wert.monat === monatVon(jetzt) ? wert.tage : 0;
}

export function tageLoeschen(speicher = lokal()) {
  if (!speicher) return;
  try { speicher.removeItem(SCHLUESSEL); } catch { /* nichts zu löschen */ }
}
