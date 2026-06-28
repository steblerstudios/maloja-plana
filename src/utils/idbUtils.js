// ============================================================================
// SHARED INDEXEDDB HELPERS
// ----------------------------------------------------------------------------
// Robustes Öffnen von IndexedDB-Verbindungen: behandelt onblocked (sonst hängt
// der Aufruf still, wenn ein zweiter Tab ein Upgrade blockiert), schliesst die
// Verbindung bei onversionchange (damit dieser Tab kein Upgrade eines anderen
// Tabs blockiert) und kann einen fehlenden Object-Store nachziehen
// (close + reopen mit erhöhter Version).
//
// Ausgelagert, damit storage.js (Dokumente) und autoBackup.js (Snapshots)
// dieselbe, in Node testbare Logik teilen.
// ============================================================================

/**
 * Pure: hat eine offene DB-Verbindung den erwarteten Object-Store?
 */
export const hasObjectStore = (db, storeName) =>
  !!db && !!db.objectStoreNames && db.objectStoreNames.contains(storeName);

/**
 * Öffnet eine IndexedDB-Verbindung.
 * - Ohne version: aktuelle Version (bzw. legt sie als Version 1 an).
 * - Mit version: erzwingt ein Upgrade über onupgradeneeded.
 *
 * onblocked wird abgewiesen statt ignoriert, damit der Aufruf nicht unbegrenzt
 * hängt, wenn eine andere Verbindung (z.B. zweiter Tab) das Upgrade blockiert.
 * onversionchange schliesst diese Verbindung, damit sie ihrerseits ein Upgrade
 * eines anderen Tabs nicht blockiert.
 *
 * @param {string} name
 * @param {{ version?: number, onUpgrade?: (db: IDBDatabase, event: IDBVersionChangeEvent) => void, errorMessage?: string }} [opts]
 */
export const openIDB = (name, { version, onUpgrade, errorMessage = 'IDB open failed' } = {}) =>
  new Promise((resolve, reject) => {
    const request = version ? indexedDB.open(name, version) : indexedDB.open(name);
    request.onerror = () => reject(new Error(errorMessage));
    request.onblocked = () => {
      // Ein anderer Tab hält die DB → das Upgrade ist blockiert. Statt still zu
      // hängen, melden wir es (ruhiger UI-Hinweis) und weisen ab.
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('maloja:db-blocked'));
      }
      reject(new Error(errorMessage + ' (blocked)'));
    };
    request.onsuccess = () => {
      const db = request.result;
      // Ein anderer Tab will später upgraden → Verbindung freigeben statt blockieren.
      db.onversionchange = () => db.close();
      resolve(db);
    };
    request.onupgradeneeded = (e) => {
      if (onUpgrade) onUpgrade(e.target.result, e);
    };
  });

/**
 * Öffnet die DB und garantiert, dass storeName existiert. Fehlt der Store
 * (z.B. durch eine abgebrochene frühere Erstellung), wird die Version dynamisch
 * erhöht (db.version + 1) und der Store über onupgradeneeded nachgezogen
 * (close + reopen). Eine feste Version würde sonst bei einem bereits höheren
 * Stand einen VersionError auslösen.
 */
export const openIDBWithStore = async (name, storeName, opts = {}) => {
  let db = await openIDB(name, opts);
  if (!hasObjectStore(db, storeName)) {
    const nextVersion = db.version + 1;
    db.close();
    db = await openIDB(name, { ...opts, version: nextVersion });
  }
  return db;
};
