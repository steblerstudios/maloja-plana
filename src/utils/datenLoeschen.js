// ─── E18 · Alle Daten auf diesem Gerät löschen ────────────────────────────────
// Was Maloja auf dem Gerät ablegt, liegt an drei Orten:
//   • localStorage: alle Schlüssel mit `or5_` (Angaben, Dokument-Liste, Erinnerungen,
//     Kontakte, Merkliste, Tresor, Einstellungen, Sicherheits-Schnappschüsse).
//   • IndexedDB: die Dateien der Dokumente und die automatischen Sicherungen
//     (dazu die Namen aus der Zeit vor der Umbenennung, falls noch vorhanden).
//   • Cache `maloja-geteilt` (Teilen-Empfang, utils/teilenEmpfang.js): Dateien, die
//     per «Teilen an Maloja» oder «Datei hinzufügen» angekommen und noch nicht
//     eingeordnet sind. Der Service Worker behält diesen Cache absichtlich über
//     App-Updates (public/sw.js) — darum muss er hier ausdrücklich weg.
// `storage.clear()` (utils/storage.js) leert nur localStorage — die Dokumente in
// IndexedDB blieben liegen. Darum dieser eigene Weg.
//
// Nicht gelöscht: der App-Cache des Service Workers. Er enthält nur die App selbst
// (HTML, JS, CSS), keine Angaben — so bleibt Maloja nach dem Neustart auch offline
// nutzbar. Nur der Teilen-Cache oben enthält Angaben; er wird gelöscht.
// Bewusst behalten: `or5_beta_access` — kein persönlicher Inhalt; ohne ihn stünde man
// nach dem Neustart vor der Code-Wand.
//
// Reihenfolge: zuerst Schreiben und neues Öffnen sperren (sonst könnte der Auto-Save
// oder die Auto-Sicherung zwischen Löschen und Neustart alles zurückschreiben), dann
// löschen. Die Sperre gilt bis zum Neuladen der Seite.
//
// Andere offene Maloja-Tabs (R4): sie hören über das storage-Ereignis mit (main.jsx).
// «sperren» vor dem Löschen → dort kein Schreiben mehr; «neu» danach → dort neu laden,
// damit sie den leeren Stand lesen und ihre offenen IndexedDB-Verbindungen schliessen
// (sonst bleibt deleteDatabase blockiert). Der Schlüssel wird sofort wieder entfernt.
// Der Dialog bittet zusätzlich, andere Fenster vorher zu schliessen.
//
// Im Beispiel (demo) wird nichts angefasst: die angezeigten Daten sind nicht die
// eigenen, und «löschen» darf dort nie den echten Stand treffen (B-3).

import { GETEILT_CACHE } from './teilenEmpfang.js';

export const BEHALTEN = ['or5_beta_access'];
// Caches mit persönlichem Inhalt (nicht der App-Cache).
export const APP_CACHES = [GETEILT_CACHE];
// Alt-Namen sind meist gar nicht vorhanden; ihr «Löschen» gelingt dann trotzdem.
export const APP_DATENBANKEN = ['maloja-plana-documents', 'maloja-plana-backups', 'ordnung-ruhe-documents', 'ordnung-ruhe-backups'];

export const LOESCH_SIGNAL = 'or5_loeschsignal';

const g = typeof globalThis !== 'undefined' ? globalThis : {};
const sicher = (fn) => { try { return fn(); } catch { return null; } };

const schluesselLeeren = (s) => {
  if (!s) return;
  const weg = [];
  for (let i = 0; i < s.length; i++) {
    const k = s.key(i);
    if (k && k.startsWith('or5_') && !BEHALTEN.includes(k)) weg.push(k);
  }
  weg.forEach((k) => s.removeItem(k));
};

// setItem ist nach der Sperre ein Leerlauf — darum mit der vorher gemerkten Methode.
const signal = (s, set, wert) => {
  if (!s || !set) return;
  try { set.call(s, LOESCH_SIGNAL, wert); s.removeItem(LOESCH_SIGNAL); } catch { /* ohne Speicher kein Signal */ }
};

const dbLoeschen = (idb, name) => new Promise((resolve) => {
  let req;
  try { req = idb.deleteDatabase(name); } catch { resolve(false); return; }
  const t = setTimeout(() => resolve(false), 8000);
  const fertig = (ok) => { clearTimeout(t); resolve(ok); };
  req.onsuccess = () => fertig(true);
  req.onerror = () => fertig(false);
  // Blockiert = eine Verbindung ist noch offen; die Löschung bleibt vorgemerkt und
  // läuft, sobald sie schliesst (spätestens beim Neustart).
  req.onblocked = () => fertig(true);
});

export async function alleDatenLoeschen({
  demo = false,
  local = sicher(() => g.localStorage),
  session = sicher(() => g.sessionStorage),
  idb = sicher(() => g.indexedDB),
  cacheSpeicher = sicher(() => g.caches),
} = {}) {
  if (demo) return { geloescht: false, fehler: [] };

  // 1 · Sperren (auf dem Prototyp, wie der Demo-Schirm) — removeItem/deleteDatabase bleiben.
  const lokalSet = sicher(() => Object.getPrototypeOf(local).setItem);
  for (const s of [local, session]) {
    const p = s && Object.getPrototypeOf(s);
    if (p) p.setItem = function () {};
  }
  const idbProto = idb && Object.getPrototypeOf(idb);
  if (idbProto) idbProto.open = function () { throw new Error('Daten gelöscht — bitte neu laden'); };

  signal(local, lokalSet, 'sperren');

  // 2 · IndexedDB
  const fehler = [];
  if (idb) {
    for (const name of APP_DATENBANKEN) {
      if (!(await dbLoeschen(idb, name))) fehler.push(name);
    }
  }

  // 2b · Teilen-Cache (geteilte, noch nicht eingeordnete Dateien)
  if (cacheSpeicher) {
    for (const name of APP_CACHES) {
      try { await cacheSpeicher.delete(name); } catch { fehler.push(name); }
    }
  }

  // 3 · localStorage + sessionStorage
  for (const s of [local, session]) {
    try { schluesselLeeren(s); } catch { fehler.push(s === local ? 'localStorage' : 'sessionStorage'); }
  }

  // 4 · andere Tabs neu laden lassen
  signal(local, lokalSet, 'neu');

  return { geloescht: true, fehler };
}
