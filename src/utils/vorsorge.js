// Opt-in „letzte Untersuchung"-Daten pro Vorsorge-Screening (Faden 3-II/2).
// Rein lokal, eigener localStorage-Key, kein Backend. Map { screeningKey: 'YYYY-MM-DD' }.
// Dient nur dem persönlichen, druckfreien Intervall-Abgleich im KVG-Katalog.

const STORAGE_KEY = 'or5_vorsorge_lastvisit';

export const loadVorsorgeDates = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
};

// Setzt oder löscht (leeres Datum) das letzte Untersuchungsdatum für ein Screening.
export const saveVorsorgeDate = (key, dateISO) => {
  try {
    const map = loadVorsorgeDates();
    if (dateISO) map[key] = dateISO; else delete map[key];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    return true;
  } catch { return false; } // Speicher voll — Misserfolg melden statt still schlucken
};
