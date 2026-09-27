// VORSCHAU-VARIANTEN — vor dem Merge entfernen
// ─────────────────────────────────────────────────────────────────────────────
// Nur zum Vergleichen der Werkzeug-Vorschau (27.09.2026). Gelesen einmal beim Laden aus
// `location.search`; ohne Parameter gilt der Stand der Vorschau. Beispiel:
//   http://localhost:5416/?platz=karte&inhalt=beide&menue=steuern,finanz#/gepaeck
//
//   platz  = unten | karte | oben        — wo das Aussenfach liegt
//   inhalt = heute | arztkoffer | beide  — wohin «Gesundheit» und «Lebenssituationen» gehen
//   menue  = steuern,finanz,lebens       — zusätzlich direkt im Menü
//
// Das Register (data/werkzeugRegister.js) bleibt unverändert; die Varianten verschieben
// nur Fach bzw. `imMenue` einzelner Einträge in einer Kopie.

export const PLAETZE = ['unten', 'karte', 'oben'];
export const INHALTE = ['heute', 'arztkoffer', 'beide'];
export const MENUE_ZUSAETZE = { steuern: 'tax', finanz: 'finanzuebersicht', lebens: 'situationen' };

// Eigener «Ort» für Lebenssituationen bei inhalt=beide: ein Eintrag oben im Gepäck.
export const OBEN = 'oben';

export const STANDARD = { platz: 'unten', inhalt: 'heute', menue: [] };

export const leseVarianten = (search) => {
  let p;
  try { p = new URLSearchParams(search || ''); } catch { return STANDARD; }
  const platz = PLAETZE.includes(p.get('platz')) ? p.get('platz') : STANDARD.platz;
  const inhalt = INHALTE.includes(p.get('inhalt')) ? p.get('inhalt') : STANDARD.inhalt;
  const menue = (p.get('menue') || '').split(',').map((s) => s.trim()).filter((s) => MENUE_ZUSAETZE[s]);
  return { platz, inhalt, menue: [...new Set(menue)] };
};

let _geladen = null;
export const aktuelleVarianten = () => {
  if (!_geladen) _geladen = leseVarianten(typeof window !== 'undefined' ? window.location.search : '');
  return _geladen;
};

// Das Register mit angewandter Variante (Kopie; Reihenfolge bleibt).
export const werkzeugeFuerVariante = (werkzeuge, v = STANDARD) => {
  const extraMenue = new Set(v.menue.map((k) => MENUE_ZUSAETZE[k]));
  return werkzeuge.map((w) => {
    let fach = w.fach;
    if (w.view === 'gesundheit' && v.inhalt !== 'heute') fach = 'gesundheit';
    if (w.view === 'situationen' && v.inhalt === 'beide') fach = OBEN;
    const imMenue = w.imMenue || extraMenue.has(w.view);
    return fach === w.fach && imMenue === !!w.imMenue ? w : { ...w, fach, imMenue };
  });
};
