import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { migrateFromOldDB } from '../storage.js';

// Die alte DB darf erst weg, wenn die Kopie in die neue DB bestätigt ist.
// Bricht der Browser die Schreib-Transaktion ab (z.B. QuotaExceededError bei
// grossen PDFs), muss die alte DB stehen bleiben, damit der nächste Start
// die Migration wiederholen kann.

const OLD = 'ordnung-ruhe-documents';
const ITEMS = [{ id: 'a', file: 'blob-a' }, { id: 'b', file: 'blob-b' }];

const makeOldDb = () => ({
  close: vi.fn(),
  transaction: () => ({
    objectStore: () => ({
      getAll() {
        const req = { onsuccess: null, onerror: null, result: null };
        Promise.resolve().then(() => { req.result = ITEMS; req.onsuccess && req.onsuccess(); });
        return req;
      },
    }),
  }),
});

const installFakeIndexedDB = (log) => {
  const oldDb = makeOldDb();
  globalThis.indexedDB = {
    databases: async () => [{ name: OLD }],
    open() {
      const req = { onerror: null, onblocked: null, onsuccess: null, onupgradeneeded: null, result: null };
      Promise.resolve().then(() => { req.result = oldDb; req.onsuccess && req.onsuccess(); });
      return req;
    },
    deleteDatabase: vi.fn((name) => { log.push(`delete:${name}`); }),
  };
  return oldDb;
};

// Neue DB: put() wird nur vorgemerkt; erst danach (asynchron) kommt
// complete oder abort — wie im echten IndexedDB.
const makeNewDb = (outcome, log) => ({
  transaction: () => {
    const tx = { oncomplete: null, onabort: null, onerror: null, error: null };
    tx.objectStore = () => ({ put: (item) => { log.push(`put:${item.id}`); } });
    setTimeout(() => {
      if (outcome === 'complete') {
        log.push('complete');
        tx.oncomplete && tx.oncomplete();
      } else {
        tx.error = Object.assign(new Error('quota'), { name: 'QuotaExceededError' });
        log.push('abort');
        tx.onerror && tx.onerror();
        tx.onabort && tx.onabort();
      }
    }, 0);
    return tx;
  },
});

describe('migrateFromOldDB', () => {
  let log;
  beforeEach(() => {
    log = [];
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    delete globalThis.indexedDB;
    vi.restoreAllMocks();
  });

  it('löscht die alte DB erst nach bestätigter Kopie', async () => {
    const oldDb = installFakeIndexedDB(log);
    await migrateFromOldDB(makeNewDb('complete', log));
    expect(log).toEqual(['put:a', 'put:b', 'complete', `delete:${OLD}`]);
    expect(oldDb.close).toHaveBeenCalled();
  });

  it('behält die alte DB, wenn die Kopie abbricht (Quota)', async () => {
    const oldDb = installFakeIndexedDB(log);
    await migrateFromOldDB(makeNewDb('abort', log));
    expect(globalThis.indexedDB.deleteDatabase).not.toHaveBeenCalled();
    expect(log).toEqual(['put:a', 'put:b', 'abort']);
    expect(oldDb.close).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });
});
