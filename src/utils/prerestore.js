// Schnappschuss vor dem Wiederherstellen (K61). Genutzt von backupCrypto.js
// (Datei-Sicherung) und autoBackup.js (automatische Sicherung).

/**
 * Create a pre-restore snapshot of current data.
 * Stored in localStorage as or5_data_prerestore, or5_docs_prerestore, or5_reminders_prerestore.
 */
export function createPreRestoreSnapshot() {
  // K61: erst alles lesen, dann alles schreiben. Scheitert ein Schreiben
  // (z. B. QuotaExceededError), werden die in DIESEM Lauf geschriebenen
  // Schlüssel auf ihren vorherigen Wert zurückgesetzt (bzw. entfernt) und der
  // Fehler weitergeworfen — kein Schnappschuss aus zwei Ständen.
  const snapshot = {};
  const writes = [];
  for (const key of ['or5_data', 'or5_docs', 'or5_reminders', 'or5_contacts', 'or5_merkliste']) {
    const val = localStorage.getItem(key);
    if (val) {
      writes.push([key + '_prerestore', val]);
      snapshot[key] = true;
    } else {
      // Leer → eine ältere Kopie aus einem früheren Lauf entfernen, sonst stünde
      // sie neben den neuen (Vorab-Prüfung 0.1.32, sechs Prüfer).
      writes.push([key + '_prerestore', null]);
    }
  }
  writes.push(['or5_prerestore_date', new Date().toISOString()]);
  const before = writes.map(([k]) => [k, localStorage.getItem(k)]);
  let done = 0;
  try {
    for (const [k, v] of writes) {
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
      done++;
    }
  } catch (e) {
    // Auch der gescheiterte Schlüssel wird zurückgesetzt (Teil-Schreiben möglich).
    for (const [k, prev] of before.slice(0, done + 1)) {
      try {
        if (prev === null) localStorage.removeItem(k);
        else localStorage.setItem(k, prev);
      } catch { /* bestmöglich */ }
    }
    throw e;
  }
  return snapshot;
}
