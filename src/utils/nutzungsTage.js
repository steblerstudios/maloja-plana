// Wiederkehr, nur auf dem Gerät (02.11.2026, Entscheid Stebler Studios: «Zählen ja, drängen nein»).
//
// Zählt, an wie vielen Tagen Maloja im laufenden Monat geöffnet wurde. Mehr nicht: keine
// Kennung, keine Uhrzeit, keine Ansichten, und der Vormonat wird überschrieben. Das Zählen
// lässt sich in den Einstellungen ablehnen. Die Zahl verlässt das Gerät nur, wenn die Person
// sie im Beta-Feedback ankreuzt und die E-Mail selbst sendet. Der Schlüssel beginnt mit
// `or5_`, «Alle Daten löschen» nimmt ihn also mit.
//
// Hier liegt nur, was beim Start läuft (Startbündel, Size-Limit). Anzeige, Ablehnen und der
// Feedback-Takt liegen in `nutzungsAnzeige.js` und kommen erst mit Dashboard und Einstellungen.

export const SCHLUESSEL = 'or5_nutzungstage';
export const ABGELEHNT = 'or5_nutzungstage_aus';

const zweistellig = (n) => String(n).padStart(2, '0');
export const monatVon = (d) => d.getFullYear() + '-' + zweistellig(d.getMonth() + 1);
export const tagVon = (d) => monatVon(d) + '-' + zweistellig(d.getDate());

// Gesperrter Speicher (alle Cookies blockiert) wirft schon beim Zugriff — dann eben ohne Zählung.
export const lokal = () => { try { return typeof localStorage === 'undefined' ? null : localStorage; } catch { return null; } };

export const stand = (speicher) => {
  try {
    const wert = JSON.parse(speicher.getItem(SCHLUESSEL));
    // Ein Monat hat höchstens 31 Tage; alles darüber ist kein echter Stand.
    return wert && Number.isInteger(wert.tage) && wert.tage > 0 && wert.tage <= 31 ? wert : null;
  } catch { return null; }
};

export const lesen = (speicher, k) => { try { return speicher.getItem(k); } catch { return null; } };

export function zaehlenErlaubt(speicher = lokal()) {
  return !!speicher && lesen(speicher, ABGELEHNT) !== '1';
}

export function tageLoeschen(speicher = lokal()) {
  if (!speicher) return;
  try { speicher.removeItem(SCHLUESSEL); } catch { /* nichts zu löschen */ }
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
