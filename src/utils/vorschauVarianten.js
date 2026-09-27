// VORSCHAU-VARIANTEN — vor dem Merge entfernen
// ─────────────────────────────────────────────────────────────────────────────
// Nur zum Vergleichen der Werkzeug-Vorschau (27.09.2026). Gelesen einmal beim Laden aus
// `location.search`. Ohne Parameter gilt die am 27.09. GEWÄHLTE Kombination, die fest im
// Register steht (platz=oben, inhalt=beide, menue=steuern,finanz,lebens). Die Parameter
// holen die übrigen Varianten zurück, damit alte Links vergleichbar bleiben, z. B.
//   http://localhost:5416/?platz=unten&inhalt=heute&menue=#/gepaeck   (erste Vorschau)
//
//   platz  = unten | karte | oben        — wo das Aussenfach liegt
//   inhalt = heute | arztkoffer | beide  — wohin «Gesundheit» und «Lebenssituationen» gehen
//   menue  = steuern,finanz,lebens       — welche Zusätze nach den drei festen im Menü
//            stehen; `menue=` (leer) = nur die drei festen
//
// Das Register (data/werkzeugRegister.js) bleibt unverändert; die Varianten verschieben
// nur Fach bzw. `imMenue` einzelner Einträge in einer Kopie.
import { AUSSENFACH, OBEN } from '../data/werkzeugRegister.js';

export { OBEN };
export const PLAETZE = ['unten', 'karte', 'oben'];
export const INHALTE = ['heute', 'arztkoffer', 'beide'];
export const MENUE_ZUSAETZE = { steuern: 'tax', finanz: 'finanzuebersicht', lebens: 'situationen' };

export const STANDARD = { platz: 'oben', inhalt: 'beide', menue: ['steuern', 'finanz', 'lebens'] };

export const leseVarianten = (search) => {
  let p;
  try { p = new URLSearchParams(search || ''); } catch { return STANDARD; }
  const platz = PLAETZE.includes(p.get('platz')) ? p.get('platz') : STANDARD.platz;
  const inhalt = INHALTE.includes(p.get('inhalt')) ? p.get('inhalt') : STANDARD.inhalt;
  const menue = p.has('menue')
    ? [...new Set((p.get('menue') || '').split(',').map((s) => s.trim()).filter((s) => MENUE_ZUSAETZE[s]))]
    : STANDARD.menue;
  return { platz, inhalt, menue };
};

let _geladen = null;
export const aktuelleVarianten = () => {
  if (!_geladen) _geladen = leseVarianten(typeof window !== 'undefined' ? window.location.search : '');
  return _geladen;
};

// Das Register mit angewandter Variante (Kopie; Reihenfolge bleibt). Für STANDARD
// kommt jeder Eintrag unverändert zurück.
export const werkzeugeFuerVariante = (werkzeuge, v = STANDARD) => {
  const zusatzViews = new Set(Object.values(MENUE_ZUSAETZE));
  const gewaehlt = new Set(v.menue.map((k) => MENUE_ZUSAETZE[k]));
  return werkzeuge.map((w) => {
    let fach = w.fach;
    if (w.view === 'gesundheit' && v.inhalt === 'heute') fach = AUSSENFACH;
    if (w.view === 'situationen' && v.inhalt !== 'beide') fach = AUSSENFACH;
    const imMenue = zusatzViews.has(w.view) && !gewaehlt.has(w.view) ? undefined : w.imMenue;
    return fach === w.fach && imMenue === w.imMenue ? w : { ...w, fach, imMenue };
  });
};
