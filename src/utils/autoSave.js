// B4 · Auto-Save: wann der Stand auf die Platte geht.
//
// Bis 0.1.46 schrieb das Auto-Save nur im 5-s-Takt, und der Takt begann bei jeder
// Änderung neu. Wer den Tab schloss, die iOS-App wegwischte oder innert 5 s neu lud,
// verlor die letzte Eingabe; wer ohne Pause tippte, speicherte nie (Voll-Audit 10/2026).
//
// Darum drei Auslöser für dieselbe Speicherfunktion:
//   • Ruhe: 5 s nach der letzten Änderung (wie bisher, auch als Wiederholung nach Fehler),
//   • Höchstwartezeit: spätestens 30 s nach der ersten ungespeicherten Änderung,
//   • Verlassen: sofort bei `pagehide` und bei `visibilitychange` → hidden. Auf iOS ist
//     «hidden» oft das letzte Ereignis, das noch ankommt; `pagehide` deckt Schliessen und
//     Neuladen im Browser. localStorage schreibt synchron, also reicht die Zeit dafür.
//
// Die Sperre nach fremder Änderung (K116) gilt für alle drei: hat ein anderer Tab
// gespeichert, schreibt dieser Tab nicht mehr zurück. Ebenso die Sperre des Löschwegs
// (utils/datenLoeschen.js): sie ersetzt `setItem` auf dem Prototyp, darum hier immer
// `storage.setItem(…)` zur Aufrufzeit, nie eine vorher gemerkte Methode.
export const AUTOSAVE_RUHE_MS = 5000;
export const AUTOSAVE_HOECHST_MS = 30000;

// Schreibt, falls etwas offen ist. `zuletzt` hält den zuletzt geschriebenen Stand
// ({ data, docs }) und rückt nur bei Erfolg vor — bei Fehler versucht es die nächste Runde.
export function speichereFallsOffen({ storage, data, documents, zuletzt, fremdGeaendert }) {
  if (fremdGeaendert) return { status: 'gesperrt' };
  if (data === zuletzt.data && documents === zuletzt.docs) return { status: 'unveraendert' };
  try {
    storage.setItem('or5_data', JSON.stringify(data));
    storage.setItem('or5_docs', JSON.stringify(documents));
    zuletzt.data = data;
    zuletzt.docs = documents;
    return { status: 'gespeichert' };
  } catch (fehler) {
    return { status: 'fehler', fehler };
  }
}

// Wie lange bis zur Höchstwartezeit, gemessen ab der ersten offenen Änderung.
export const hoechstWarteRest = (erste, jetzt, hoechst = AUTOSAVE_HOECHST_MS) =>
  Math.max(0, erste + hoechst - jetzt);

// Beim Verlassen sofort speichern. Gibt die Abmeldung zurück.
export function beimVerlassenSpeichern(fenster, dokument, speichern) {
  const beiPagehide = () => speichern();
  const beiSichtwechsel = () => { if (dokument.visibilityState === 'hidden') speichern(); };
  fenster.addEventListener('pagehide', beiPagehide);
  dokument.addEventListener('visibilitychange', beiSichtwechsel);
  return () => {
    fenster.removeEventListener('pagehide', beiPagehide);
    dokument.removeEventListener('visibilitychange', beiSichtwechsel);
  };
}
