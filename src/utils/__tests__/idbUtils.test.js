import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { hasObjectStore, openIDB, openIDBWithStore } from '../idbUtils.js';

// ── Minimaler IndexedDB-Fake (nur das, was idbUtils nutzt) ──────────────────
// Hält DBs als { version, stores:Set }. open() löst asynchron auf, feuert
// onupgradeneeded bei Versionssprung und onblocked, wenn so konfiguriert.
const makeFakeIndexedDB = () => {
  const dbs = new Map();
  let blockNextUpgrade = false;

  const makeDb = (name, entry) => ({
    name,
    get version() { return entry.version; },
    objectStoreNames: { contains: (n) => entry.stores.has(n) },
    createObjectStore: (n) => {
      entry.stores.add(n);
      return { createIndex: () => {} };
    },
    close: () => {},
    onversionchange: null,
  });

  return {
    _seed: (name, version, stores) => dbs.set(name, { version, stores: new Set(stores) }),
    _blockNextUpgrade: () => { blockNextUpgrade = true; },
    open(name, version) {
      const req = { onerror: null, onblocked: null, onsuccess: null, onupgradeneeded: null, result: null };
      Promise.resolve().then(() => {
        let entry = dbs.get(name);
        if (!entry) { entry = { version: 0, stores: new Set() }; dbs.set(name, entry); }
        const targetVersion = version || entry.version || 1;
        const needsUpgrade = targetVersion > entry.version;
        if (needsUpgrade && blockNextUpgrade) {
          blockNextUpgrade = false;
          req.onblocked && req.onblocked({});
          return;
        }
        const db = makeDb(name, entry);
        if (needsUpgrade) {
          entry.version = targetVersion;
          req.onupgradeneeded && req.onupgradeneeded({ target: { result: db } });
        }
        req.result = db;
        req.onsuccess && req.onsuccess({ target: { result: db } });
      });
      return req;
    },
  };
};

// onUpgrade-Callback wie in storage.js (Store anlegen, falls fehlend)
const ensureFiles = (db) => {
  if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: 'id' });
};

describe('hasObjectStore', () => {
  const fakeDb = (stores) => ({ objectStoreNames: { contains: (n) => stores.includes(n) } });

  it('true wenn der Store vorhanden ist', () => {
    expect(hasObjectStore(fakeDb(['files']), 'files')).toBe(true);
  });

  it('false wenn der Store fehlt (halb-erstellte DB)', () => {
    expect(hasObjectStore(fakeDb([]), 'files')).toBe(false);
    expect(hasObjectStore(fakeDb(['other']), 'files')).toBe(false);
  });

  it('false für null/undefined oder fehlendes objectStoreNames', () => {
    expect(hasObjectStore(null, 'files')).toBe(false);
    expect(hasObjectStore(undefined, 'files')).toBe(false);
    expect(hasObjectStore({}, 'files')).toBe(false);
  });
});

describe('openIDB', () => {
  beforeEach(() => { globalThis.indexedDB = makeFakeIndexedDB(); });
  afterEach(() => { delete globalThis.indexedDB; });

  it('setzt onversionchange, damit dieser Tab ein fremdes Upgrade nicht blockiert', async () => {
    const db = await openIDB('docs', { onUpgrade: ensureFiles });
    expect(typeof db.onversionchange).toBe('function');
  });

  it('weist ein blockiertes Upgrade ab statt zu hängen', async () => {
    globalThis.indexedDB._seed('docs', 1, []);
    globalThis.indexedDB._blockNextUpgrade();
    await expect(openIDB('docs', { version: 2, onUpgrade: ensureFiles, errorMessage: 'IDB open failed' }))
      .rejects.toThrow('IDB open failed (blocked)');
  });
});

describe('openIDBWithStore', () => {
  beforeEach(() => { globalThis.indexedDB = makeFakeIndexedDB(); });
  afterEach(() => { delete globalThis.indexedDB; });

  it('legt den Store auf einer frischen DB an (Version 1)', async () => {
    const db = await openIDBWithStore('docs', 'files', { onUpgrade: ensureFiles });
    expect(hasObjectStore(db, 'files')).toBe(true);
    expect(db.version).toBe(1);
  });

  it('repariert eine halb-erstellte DB via Versions-Bump (close + reopen)', async () => {
    globalThis.indexedDB._seed('docs', 1, []); // Version 1, aber kein Store
    const db = await openIDBWithStore('docs', 'files', { onUpgrade: ensureFiles });
    expect(hasObjectStore(db, 'files')).toBe(true);
    expect(db.version).toBe(2); // hochgezogen
  });

  it('bumpt die Version nicht, wenn der Store bereits existiert', async () => {
    globalThis.indexedDB._seed('docs', 1, ['files']);
    const onUpgrade = () => { throw new Error('darf nicht upgraden'); };
    const db = await openIDBWithStore('docs', 'files', { onUpgrade });
    expect(hasObjectStore(db, 'files')).toBe(true);
    expect(db.version).toBe(1);
  });

  it('propagiert einen Block beim Reparatur-Upgrade als Fehler', async () => {
    globalThis.indexedDB._seed('docs', 1, []);
    globalThis.indexedDB._blockNextUpgrade();
    await expect(openIDBWithStore('docs', 'files', { onUpgrade: ensureFiles }))
      .rejects.toThrow('(blocked)');
  });
});
