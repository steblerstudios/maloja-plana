// Wiederkehr, nur auf dem Gerät (02.11.2026, Entscheid Stebler Studios: «Zählen ja, drängen nein»).
//
// Zählt, an wie vielen Tagen Maloja im laufenden Monat geöffnet wurde. Mehr nicht: keine
// Kennung, keine Uhrzeit, keine Ansichten, und der Vormonat wird überschrieben. Das Zählen
// lässt sich in den Einstellungen ablehnen. Das Beta-Feedback erscheint alle drei Monate
// wieder (`feedbackRuht`), darum läuft das Zählen danach weiter. Die Zahl
// verlässt das Gerät nur, wenn die Person sie im Beta-Feedback ankreuzt und die E-Mail selbst
// sendet. Der Schlüssel beginnt mit `or5_`, «Alle Daten löschen» nimmt ihn also mit.

export const SCHLUESSEL = 'or5_nutzungstage';
export const ABGELEHNT = 'or5_nutzungstage_aus';
export const FEEDBACK = 'or5_beta_feedback';
export const FEEDBACK_ABSTAND_TAGE = 90;

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

export function zaehlenSetzen(an, speicher = lokal()) {
  if (!speicher) return;
  try {
    if (an) speicher.removeItem(ABGELEHNT);
    else { speicher.setItem(ABGELEHNT, '1'); speicher.removeItem(SCHLUESSEL); }
  } catch { /* ohne Speicher keine Wahl */ }
}

export function tagMerken(speicher = lokal(), jetzt = new Date()) {
  if (!speicher) return;
  if (!zaehlenErlaubt(speicher)) { tageLoeschen(speicher); return; }
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
