// Wo man in einem Schritt-für-Schritt-Ablauf steht (Fassung 5, Entscheid Sophie 23.10.2026:
// «ein Schritt nach dem anderen auf der Passstrasse»). Erster Nutzer: der Umzug.
//
// Gespeichert wie die übrigen Ansichts-Zustände der App: ein eigener `or5_`-Schlüssel im
// localStorage (vgl. `or5_behoerden_checklist`, `or5_disclosure_*`), mit try/catch. Damit
// räumt «Alle Daten löschen» ihn mit ab (utils/datenLoeschen.js: alle `or5_`-Schlüssel).
// Im Beispiel und beim Ausprobieren (`vorlaeufig`) wird weder gelesen noch geschrieben —
// wie bei Merkliste und Kalender bleibt dort nichts, und der echte Stand bleibt unberührt.
//
// Form: { schritt: 0…total-1, fertig: boolean }. Alles andere gilt als «noch nicht begonnen».

export const ablaufStandKey = (name) => 'or5_ablauf_' + name;

const LEER = { schritt: 0, fertig: false };

export const ablaufStandLaden = (name, total, vorlaeufig) => {
  if (vorlaeufig) return { ...LEER };
  try {
    const roh = JSON.parse(localStorage.getItem(ablaufStandKey(name)) || 'null');
    if (!roh || typeof roh !== 'object') return { ...LEER };
    const n = Number(roh.schritt);
    const schritt = Number.isInteger(n) && n >= 0 && n < total ? n : 0;
    return { schritt, fertig: roh.fertig === true };
  } catch {
    return { ...LEER };
  }
};

// Rückgabe: true, wenn gespeichert; false im Beispiel oder wenn der Speicher voll ist.
export const ablaufStandSichern = (name, stand, vorlaeufig) => {
  if (vorlaeufig) return false;
  try {
    localStorage.setItem(ablaufStandKey(name), JSON.stringify({ schritt: stand.schritt, fertig: !!stand.fertig }));
    return true;
  } catch {
    return false;
  }
};
