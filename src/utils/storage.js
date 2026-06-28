import { openIDB, openIDBWithStore } from './idbUtils.js';

// ============================================================================
// LOCALSTORAGE HELPER
// ============================================================================
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage set error:', e.message);
      return false;
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      console.error('Storage get error:', e.message);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Storage remove error:', e.message);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('Storage clear error:', e.message);
      return false;
    }
  },
};

// ============================================================================
// INDEXEDDB HELPER (für Dokumente/Blobs)
// ============================================================================
const DB_NAME = 'maloja-plana-documents';
const OLD_DB_NAME = 'ordnung-ruhe-documents';
const STORE_NAME = 'files';

let dbInstance = null;
let dbPromise = null;

const ensureStore = (db) => {
  if (!db.objectStoreNames.contains(STORE_NAME)) {
    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
  }
};

const openDB = (name, version) =>
  openIDB(name, { version, onUpgrade: ensureStore, errorMessage: 'IDB open failed' });

const migrateFromOldDB = async (newDb) => {
  try {
    const dbs = await indexedDB.databases();
    if (!dbs.some(d => d.name === OLD_DB_NAME)) return;

    const oldDb = await openDB(OLD_DB_NAME);
    const tx = oldDb.transaction(STORE_NAME, 'readonly');
    const items = await new Promise((res, rej) => {
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => res(req.result || []);
      req.onerror = () => rej(req.error);
    });

    if (items.length > 0) {
      const tx2 = newDb.transaction(STORE_NAME, 'readwrite');
      const store2 = tx2.objectStore(STORE_NAME);
      for (const item of items) store2.put(item);
      console.info('[storage] Migrated', items.length, 'docs from', OLD_DB_NAME);
    }

    oldDb.close();
    indexedDB.deleteDatabase(OLD_DB_NAME);
  } catch (e) {
    console.warn('[storage] Old DB migration skipped:', e.message);
  }
};

const getDB = async () => {
  if (dbInstance) return dbInstance;
  // In-flight-Guard: parallele Erstaufrufe teilen sich EINE Öffnung, sonst
  // würden mehrere Verbindungen ein erzwungenes Upgrade gegenseitig blockieren.
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await openIDBWithStore(DB_NAME, STORE_NAME, {
        onUpgrade: ensureStore,
        errorMessage: 'IDB open failed',
      });
      await migrateFromOldDB(db);
      return db;
    })();
  }
  try {
    dbInstance = await dbPromise;
    return dbInstance;
  } catch (e) {
    dbPromise = null; // Fehlschlag (z.B. blocked) nicht cachen → Retry erlauben
    throw e;
  }
};

export const idb = {
  save: async (id, file, metadata = {}) => {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const data = {
        id,
        file,
        metadata,
        savedAt: new Date().toISOString(),
      };

      return new Promise((resolve, reject) => {
        const req = store.put(data);
        req.onsuccess = () => resolve(id);
        req.onerror = () => reject(new Error('IDB save failed'));
      });
    } catch (e) {
      console.error('IDB save error:', e.message);
      throw e;
    }
  },

  get: async (id) => {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);

      return new Promise((resolve, reject) => {
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(new Error('IDB get failed'));
      });
    } catch (e) {
      console.error('IDB get error:', e.message);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      return new Promise((resolve, reject) => {
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(new Error('IDB delete failed'));
      });
    } catch (e) {
      console.error('IDB delete error:', e.message);
      return false;
    }
  },

  getAllKeys: async () => {
    try {
      const db = await getDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);

      return new Promise((resolve, reject) => {
        const req = store.getAllKeys();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(new Error('IDB getAllKeys failed'));
      });
    } catch (e) {
      console.error('IDB getAllKeys error:', e.message);
      return [];
    }
  },
};