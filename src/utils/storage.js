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
const DB_NAME = 'ordnung-ruhe-documents';
const STORE_NAME = 'files';
const DB_VERSION = 1;

let dbInstance = null;

const getDB = async () => {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(new Error('IDB open failed'));
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
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
