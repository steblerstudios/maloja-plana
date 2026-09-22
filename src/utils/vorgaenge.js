// Schreib-Weg für Vorgänge (O12) — bewusst OHNE Speicher-Zugriff.
//
// Warum nicht wie `utils/merkliste.js`: die Merkliste hat einen eigenen Schlüssel
// (`or5_merkliste`) und darf direkt schreiben. Die Vorgänge liegen in `or5_data`, und
// `or5_data` wird aus dem React-Zustand per Autosave geschrieben (`main.jsx:679`).
// Ein direkter Schreibzugriff von hier würde bei der nächsten Autosave-Runde
// überschrieben — still, und erst beim Neuladen sichtbar.
//
// Deshalb sind alle Funktionen hier REIN: sie nehmen `data` und geben ein neues
// `data` zurück. Die Oberfläche reicht es an `setData` weiter, genau wie bei jedem
// Kapitel-Feld. Nebenwirkung: null neue direkte `localStorage`-Zugriffe (O5).

import { VORGANG_STATUS, vorgangTyp } from '../data/vorgaenge.js';

// Stabile IDs. `crypto.randomUUID` ist im Repo bereits in Gebrauch (`main.jsx:687`);
// der Rückfall deckt ältere Browser und Testumgebungen ohne Web-Crypto ab.
const neueId = () => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch { /* kein Web-Crypto — Rückfall unten */ }
  return 'v' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
};

const jetzt = () => new Date().toISOString();

// ── Lesen ───────────────────────────────────────────────────────────────────
// Immer ein Array, auch wenn das Feld fehlt oder beschädigt ist. Kein Werfen:
// ein kaputter Vorgang darf die Lebensmappe nicht blockieren.
export const vorgaengeAus = (data) => (Array.isArray(data?.vorgaenge) ? data.vorgaenge : []);

export const vorgangMitId = (data, id) => vorgaengeAus(data).find((v) => v && v.id === id) || null;

// Der eine laufende Vorgang eines Typs. Mehrere gleichzeitig sind erlaubt (zwei
// Umzüge in einem Jahr sind real) — diese Funktion gibt den zuletzt gestarteten.
export const aktiverVorgang = (data, typ) => {
  const passende = vorgaengeAus(data)
    .filter((v) => v && v.typ === typ && v.status === 'aktiv')
    .sort((a, b) => String(b.gestartetAm || '').localeCompare(String(a.gestartetAm || '')));
  return passende[0] || null;
};

// ── Anlegen ─────────────────────────────────────────────────────────────────
// Gibt { data, vorgang } zurück. Bei unbekanntem Typ: { data, vorgang: null } —
// die bestehenden Daten kommen unverändert zurück, nichts wird erfunden.
export const vorgangAnlegen = (data, { typ, stichtag = null, kontext = {}, status = 'aktiv' } = {}) => {
  if (!vorgangTyp(typ) || !VORGANG_STATUS.includes(status)) {
    return { data: data || {}, vorgang: null };
  }
  const zeit = jetzt();
  const vorgang = {
    id: neueId(),
    typ,
    status,
    gestartetAm: zeit,
    geaendertAm: zeit,
    stichtag: gueltigerStichtag(stichtag),
    kontext: { ...kontext },
    aufgaben: {},   // nur, was die Person getan hat — die Liste selbst wird abgeleitet
  };
  return {
    data: { ...(data || {}), vorgaenge: [...vorgaengeAus(data), vorgang] },
    vorgang,
  };
};

// Ein Stichtag ist ein ISO-Datum oder gar nichts. Unlesbares wird zu `null`, nicht
// zu „heute" — ein erfundener Stichtag würde jede Frist daran falsch machen.
const gueltigerStichtag = (wert) => (typeof wert === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(wert) ? wert : null);

// ── Ändern ──────────────────────────────────────────────────────────────────
// Flaches Zusammenführen auf oberster Ebene; `kontext` wird zusammengeführt statt
// ersetzt, damit ein Teil-Update nicht stillschweigend anderes löscht.
// `id`, `typ` und `gestartetAm` sind unveränderlich.
export const vorgangAendern = (data, id, patch = {}) => {
  const vorher = vorgangMitId(data, id);
  if (!vorher) return data || {};

  const { id: _i, typ: _t, gestartetAm: _g, aufgaben: _a, ...erlaubt } = patch;
  const nachher = {
    ...vorher,
    ...erlaubt,
    kontext: { ...(vorher.kontext || {}), ...(patch.kontext || {}) },
    geaendertAm: jetzt(),
  };
  if (Object.prototype.hasOwnProperty.call(patch, 'stichtag')) {
    nachher.stichtag = gueltigerStichtag(patch.stichtag);
  }
  if (patch.status && !VORGANG_STATUS.includes(patch.status)) {
    nachher.status = vorher.status;
  }
  return ersetze(data, id, nachher);
};

// ── Eine Aufgabe festhalten ─────────────────────────────────────────────────
// Gespeichert wird NUR, was die Person getan hat: der Merkpunkt, den sie angelegt hat,
// die Erinnerung, die sie gesetzt hat, oder ihr „trifft mich nicht zu". Kein
// Erledigt-Zustand — der steht in der Merkliste und wird von dort abgeleitet.
export const aufgabeNotieren = (data, id, aufgabeKey, notiz = {}) => {
  const vorher = vorgangMitId(data, id);
  if (!vorher || !aufgabeKey) return data || {};

  const bisher = (vorher.aufgaben || {})[aufgabeKey] || {};
  const neu = { ...bisher };
  if (Object.prototype.hasOwnProperty.call(notiz, 'todoId')) neu.todoId = notiz.todoId || null;
  if (Object.prototype.hasOwnProperty.call(notiz, 'reminderId')) neu.reminderId = notiz.reminderId || null;
  if (Object.prototype.hasOwnProperty.call(notiz, 'nichtZutreffend')) {
    if (notiz.nichtZutreffend === true) neu.nichtZutreffend = true;
    else delete neu.nichtZutreffend;   // zurücknehmen heisst: wieder die Regel fragen
  }

  return ersetze(data, id, {
    ...vorher,
    aufgaben: { ...(vorher.aufgaben || {}), [aufgabeKey]: neu },
    geaendertAm: jetzt(),
  });
};

// ── Abschliessen ────────────────────────────────────────────────────────────
// Ein abgeschlossener Vorgang bleibt vollständig lesbar — nichts wird entfernt.
export const vorgangAbschliessen = (data, id) => {
  const vorher = vorgangMitId(data, id);
  if (!vorher) return data || {};
  return ersetze(data, id, {
    ...vorher,
    status: 'abgeschlossen',
    abgeschlossenAm: jetzt(),
    geaendertAm: jetzt(),
  });
};

// ── Entfernen ───────────────────────────────────────────────────────────────
// Nur auf ausdrücklichen Wunsch. Die Merkpunkte und Erinnerungen, auf die der Vorgang
// verwies, bleiben bestehen — sie gehören der Person, nicht dem Vorgang.
export const vorgangEntfernen = (data, id) => ({
  ...(data || {}),
  vorgaenge: vorgaengeAus(data).filter((v) => v && v.id !== id),
});

const ersetze = (data, id, neuerVorgang) => ({
  ...(data || {}),
  vorgaenge: vorgaengeAus(data).map((v) => (v && v.id === id ? neuerVorgang : v)),
});
