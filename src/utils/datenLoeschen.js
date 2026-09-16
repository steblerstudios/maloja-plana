// ─── E18 · Alle Daten auf diesem Gerät löschen ────────────────────────────────
// Was Maloja auf dem Gerät ablegt, liegt an zwei Orten:
//   • localStorage: alle Schlüssel mit `or5_` (Angaben, Dokument-Liste, Erinnerungen,
//     Kontakte, Merkliste, Tresor, Einstellungen, Sicherheits-Schnappschüsse).
//   • IndexedDB: die Dateien der Dokumente und die automatischen Sicherungen
//     (dazu die Namen aus der Zeit vor der Umbenennung, falls noch vorhanden).
// `storage.clear()` (utils/storage.js) leert nur localStorage — die Dokumente in
// IndexedDB blieben liegen. Darum dieser eigene Weg.
//
// Nicht gelöscht: der Service-Worker-Cache. Er enthält nur die App selbst (HTML, JS,
// CSS), keine Angaben — so bleibt Maloja nach dem Neustart auch offline nutzbar.
// Bewusst behalten: `or5_beta_access` — kein persönlicher Inhalt; ohne ihn stünde man
// nach dem Neustart vor der Code-Wand.
//
// Reihenfolge: zuerst Schreiben und neues Öffnen sperren (sonst könnte der Auto-Save
// oder die Auto-Sicherung zwischen Löschen und Neustart alles zurückschreiben), dann
// löschen. Die Sperre gilt bis zum Neuladen der Seite.
//
// Im Beispiel (demo) wird nichts angefasst: die angezeigten Daten sind nicht die
// eigenen, und «löschen» darf dort nie den echten Stand treffen (B-3).

export const BEHALTEN = ['or5_beta_access'];
// Alt-Namen sind meist gar nicht vorhanden; ihr «Löschen» gelingt dann trotzdem.
export const APP_DATENBANKEN = ['maloja-plana-documents', 'maloja-plana-backups', 'ordnung-ruhe-documents', 'ordnung-ruhe-backups'];

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
} = {}) {
  if (demo) return { geloescht: false, fehler: [] };

  // 1 · Sperren (auf dem Prototyp, wie der Demo-Schirm) — removeItem/deleteDatabase bleiben.
  for (const s of [local, session]) {
    const p = s && Object.getPrototypeOf(s);
    if (p) p.setItem = function () {};
  }
  const idbProto = idb && Object.getPrototypeOf(idb);
  if (idbProto) idbProto.open = function () { throw new Error('Daten gelöscht — bitte neu laden'); };

  // 2 · IndexedDB
  const fehler = [];
  if (idb) {
    for (const name of APP_DATENBANKEN) {
      if (!(await dbLoeschen(idb, name))) fehler.push(name);
    }
  }

  // 3 · localStorage + sessionStorage
  for (const s of [local, session]) {
    try { schluesselLeeren(s); } catch { fehler.push(s === local ? 'localStorage' : 'sessionStorage'); }
  }

  return { geloescht: true, fehler };
}
