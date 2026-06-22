// ─── Automatic Local Backup ─────────────────────────────────
// Creates periodic snapshots of or5_data and or5_docs in IndexedDB.
// Keeps up to 3 rolling backups (one per day max).
// Restores are manual — user must explicitly trigger.
//
// Storage: IndexedDB 'maloja-plana-backups' store.
// No network. No cloud. Fully local.

const BACKUP_DB_NAME = 'maloja-plana-backups';
const OLD_BACKUP_DB_NAME = 'ordnung-ruhe-backups';
const BACKUP_STORE = 'snapshots';
const BACKUP_DB_VERSION = 1;
const MAX_BACKUPS = 3;
const MIN_BACKUP_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours minimum between backups
const BACKUP_TIMESTAMP_KEY = 'or5_last_backup';

let backupDb = null;

const openBDB = (name) => new Promise((resolve, reject) => {
  const request = indexedDB.open(name, BACKUP_DB_VERSION);
  request.onerror = () => reject(new Error('Backup DB open failed'));
  request.onsuccess = () => resolve(request.result);
  request.onupgradeneeded = (e) => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains(BACKUP_STORE)) {
      const store = db.createObjectStore(BACKUP_STORE, { keyPath: 'id' });
      store.createIndex('createdAt', 'createdAt', { unique: false });
    }
  };
});

const migrateOldBackups = async (newDb) => {
  try {
    const dbs = await indexedDB.databases();
    if (!dbs.some(d => d.name === OLD_BACKUP_DB_NAME)) return;

    const oldDb = await openBDB(OLD_BACKUP_DB_NAME);
    const tx = oldDb.transaction(BACKUP_STORE, 'readonly');
    const items = await new Promise((res, rej) => {
      const req = tx.objectStore(BACKUP_STORE).getAll();
      req.onsuccess = () => res(req.result || []);
      req.onerror = () => rej(req.error);
    });

    if (items.length > 0) {
      const tx2 = newDb.transaction(BACKUP_STORE, 'readwrite');
      const store2 = tx2.objectStore(BACKUP_STORE);
      for (const item of items) store2.put(item);
      console.info('[backup] Migrated', items.length, 'snapshots from', OLD_BACKUP_DB_NAME);
    }

    oldDb.close();
    indexedDB.deleteDatabase(OLD_BACKUP_DB_NAME);
  } catch (e) {
    console.warn('[backup] Old DB migration skipped:', e.message);
  }
};

const openBackupDB = async () => {
  if (backupDb) return backupDb;
  backupDb = await openBDB(BACKUP_DB_NAME);
  await migrateOldBackups(backupDb);
  return backupDb;
};

/**
 * Check if enough time has passed since the last backup.
 */
function shouldBackup() {
  try {
    const last = localStorage.getItem(BACKUP_TIMESTAMP_KEY);
    if (!last) return true;
    const elapsed = Date.now() - new Date(last).getTime();
    return elapsed >= MIN_BACKUP_INTERVAL_MS;
  } catch {
    return true;
  }
}

/**
 * Create a backup snapshot in IndexedDB.
 * Reads or5_data and or5_docs from localStorage, stores as a single snapshot.
 * Returns { success, id, error }
 */
export async function createBackup() {
  if (!shouldBackup()) {
    return { success: false, id: null, error: 'too_soon' };
  }

  try {
    const data = localStorage.getItem('or5_data');
    const docs = localStorage.getItem('or5_docs');
    const reminders = localStorage.getItem('or5_reminders');

    // Don't backup empty data
    if (!data || data === '{}') {
      return { success: false, id: null, error: 'empty_data' };
    }

    const snapshot = {
      id: 'backup_' + Date.now(),
      createdAt: new Date().toISOString(),
      data,       // raw JSON string — avoids double-serialization
      docs,       // raw JSON string
      reminders,  // raw JSON string
      sizeBytes: (data?.length || 0) + (docs?.length || 0) + (reminders?.length || 0),
    };

    const db = await openBackupDB();
    const tx = db.transaction(BACKUP_STORE, 'readwrite');
    const store = tx.objectStore(BACKUP_STORE);

    await new Promise((resolve, reject) => {
      const req = store.put(snapshot);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(new Error('Backup write failed'));
    });

    // Record timestamp
    localStorage.setItem(BACKUP_TIMESTAMP_KEY, snapshot.createdAt);

    // Prune old backups (keep MAX_BACKUPS most recent)
    await pruneOldBackups(db);

    console.info('[backup] Snapshot created:', snapshot.id, '(' + Math.round(snapshot.sizeBytes / 1024) + ' KB)');
    return { success: true, id: snapshot.id, error: null };

  } catch (e) {
    console.error('[backup] Failed:', e.message);
    return { success: false, id: null, error: e.message };
  }
}

/**
 * Remove excess backups, keeping only the MAX_BACKUPS most recent.
 */
async function pruneOldBackups(db) {
  try {
    const tx = db.transaction(BACKUP_STORE, 'readwrite');
    const store = tx.objectStore(BACKUP_STORE);
    const index = store.index('createdAt');

    const allKeys = await new Promise((resolve, reject) => {
      const req = index.getAllKeys();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(new Error('Failed to list backups'));
    });

    if (allKeys.length > MAX_BACKUPS) {
      // getAllKeys from the index returns keys sorted by createdAt.
      // We need the actual snapshot IDs to delete. Re-query the store.
      const tx2 = db.transaction(BACKUP_STORE, 'readwrite');
      const store2 = tx2.objectStore(BACKUP_STORE);

      const allSnapshots = await new Promise((resolve, reject) => {
        const req = store2.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(new Error('Failed to read backups'));
      });

      // Sort by createdAt descending, remove oldest
      allSnapshots.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const toDelete = allSnapshots.slice(MAX_BACKUPS);

      const tx3 = db.transaction(BACKUP_STORE, 'readwrite');
      const store3 = tx3.objectStore(BACKUP_STORE);
      for (const old of toDelete) {
        store3.delete(old.id);
      }
    }
  } catch (e) {
    console.error('[backup] Prune failed:', e.message);
  }
}

/**
 * List all available backups.
 * Returns array of { id, createdAt, sizeBytes } sorted newest first.
 */
export async function listBackups() {
  try {
    const db = await openBackupDB();
    const tx = db.transaction(BACKUP_STORE, 'readonly');
    const store = tx.objectStore(BACKUP_STORE);

    const all = await new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(new Error('Failed to list backups'));
    });

    return all
      .map(s => ({ id: s.id, createdAt: s.createdAt, sizeKB: Math.round((s.sizeBytes || 0) / 1024) }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  } catch (e) {
    console.error('[backup] List failed:', e.message);
    return [];
  }
}

/**
 * Restore a backup by ID.
 * Writes snapshot data back to localStorage keys.
 * Returns { success, error }
 *
 * IMPORTANT: This overwrites current or5_data and or5_docs.
 * Caller should confirm with user before calling.
 */
export async function restoreBackup(backupId) {
  try {
    const db = await openBackupDB();
    const tx = db.transaction(BACKUP_STORE, 'readonly');
    const store = tx.objectStore(BACKUP_STORE);

    const snapshot = await new Promise((resolve, reject) => {
      const req = store.get(backupId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(new Error('Backup not found'));
    });

    if (!snapshot) {
      return { success: false, error: 'not_found' };
    }

    // Safety: backup current data before restoring
    const currentData = localStorage.getItem('or5_data');
    if (currentData) {
      localStorage.setItem('or5_data_prerestore', currentData);
    }

    // Restore
    if (snapshot.data) localStorage.setItem('or5_data', snapshot.data);
    if (snapshot.docs) localStorage.setItem('or5_docs', snapshot.docs);
    if (snapshot.reminders) localStorage.setItem('or5_reminders', snapshot.reminders);

    console.info('[backup] Restored:', backupId);
    return { success: true, error: null };

  } catch (e) {
    console.error('[backup] Restore failed:', e.message);
    return { success: false, error: e.message };
  }
}
