import { describe, it, expect, beforeEach, vi } from 'vitest';

// IndexedDB-Ersatz (Node hat kein idb) — gleiches Muster wie secureStore.test.js.
const idbMap = new Map();
vi.mock('../storage.js', () => ({
  idb: {
    save: (id, dataUrl) => { idbMap.set(String(id), { file: dataUrl }); return Promise.resolve(); },
    get: (id) => Promise.resolve(idbMap.has(String(id)) ? idbMap.get(String(id)) : null),
    delete: (id) => { idbMap.delete(String(id)); return Promise.resolve(); },
    getAllKeys: () => Promise.resolve([...idbMap.keys()]),
  },
}));

import { restoreBackup, createPreRestoreSnapshot, MAX_BACKUP_FILE_BYTES, exceedsBackupFileLimit } from '../backupCrypto.js';

// Schlanker localStorage-Mock (Node-Testumgebung hat kein localStorage).
function installLocalStorageMock() {
  const map = new Map();
  globalThis.localStorage = {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
    clear: () => map.clear(),
    key: (i) => [...map.keys()][i] ?? null,
    get length() { return map.size; },
  };
  return map;
}

const VORHER = { basis: { canton: 'BS' } };
const seed = () => {
  localStorage.setItem('or5_data', JSON.stringify(VORHER));
  localStorage.setItem('or5_docs', JSON.stringify([{ id: 'alt', type: 'id' }]));
  localStorage.setItem('or5_merkliste', JSON.stringify([{ id: 'm0', text: 'vorher' }]));
};

const gut = () => ({
  magic: 'MALOJA_PLANA_BACKUP_V1',
  created: '2026-09-15T10:00:00.000Z',
  version: '5.1',
  data: { basis: { canton: 'ZH' } },
  docs: [{ id: 'neu', type: 'id', data: 'data:application/pdf;base64,AAAA' }],
  merkliste: [{ id: 'm1', text: 'nachher' }],
});

describe('restoreBackup — Validierung ist eine Barriere', () => {
  let map;
  beforeEach(() => { map = installLocalStorageMock(); idbMap.clear(); seed(); });

  it('schreibt ein gültiges Backup (Snapshot + Daten + Blobs)', async () => {
    const r = await restoreBackup(gut());
    expect(r.success).toBe(true);
    expect(r.blocked).toBe(false);
    expect(JSON.parse(localStorage.getItem('or5_data'))).toEqual({ basis: { canton: 'ZH' } });
    expect(JSON.parse(localStorage.getItem('or5_data_prerestore'))).toEqual(VORHER);
    expect(idbMap.get('neu')).toEqual({ file: 'data:application/pdf;base64,AAAA' });
    // or5_docs trägt nur Metadaten, der Blob liegt in idb.
    expect(JSON.parse(localStorage.getItem('or5_docs'))).toEqual([{ id: 'neu', type: 'id' }]);
  });

  it('struktur-kaputte Payload: NICHTS wird geschrieben, auch kein Snapshot', async () => {
    const vorher = new Map(map);
    const kaputt = gut();
    kaputt.data = { basis: 'kein Objekt' };
    kaputt.merkliste = 'auch kaputt';

    const r = await restoreBackup(kaputt);

    expect(r.success).toBe(false);
    expect(r.blocked).toBe(true);
    expect(r.errors.length).toBeGreaterThan(0);
    expect(r.restored).toEqual([]);
    // localStorage byte-identisch wie vorher — kein Snapshot, kein Teil-Schreiben.
    expect(map).toEqual(vorher);
    expect(localStorage.getItem('or5_data_prerestore')).toBeNull();
    expect(localStorage.getItem('or5_prerestore_date')).toBeNull();
    expect(idbMap.size).toBe(0);
  });

  it('Anzahl-Cap blockt den Restore ebenfalls, ohne zu schreiben', async () => {
    const vorher = new Map(map);
    const zuViel = gut();
    zuViel.docs = Array.from({ length: 5000 }, (_, i) => ({ id: 'd' + i }));
    const r = await restoreBackup(zuViel);
    expect(r.blocked).toBe(true);
    expect(map).toEqual(vorher);
    expect(idbMap.size).toBe(0);
  });
});

// R4 (Predeploy-Gate 16.09.): der Schnappschuss vor dem Wiederherstellen kann am
// vollen Speicher scheitern (QuotaExceededError). Dann: sauber melden, nichts schreiben.
describe('restoreBackup — Schnappschuss scheitert (Speicher voll)', () => {
  let map;
  beforeEach(() => {
    map = installLocalStorageMock();
    idbMap.clear();
    seed();
    const echt = localStorage.setItem;
    localStorage.setItem = (k, v) => {
      if (k.endsWith('_prerestore')) { const e = new Error('Speicher voll'); e.name = 'QuotaExceededError'; throw e; }
      echt(k, v);
    };
  });

  it('wirft nicht, meldet den Fehler und überschreibt nichts', async () => {
    const vorher = JSON.stringify([...map.entries()]);
    const r = await restoreBackup(gut());
    expect(r.success).toBe(false);
    expect(r.blocked).toBe(false);
    expect(r.error).toBe('Speicher voll');
    expect(r.restored).toEqual([]);
    expect(JSON.stringify([...map.entries()])).toBe(vorher);
    expect(idbMap.size).toBe(0);
  });

  it('ZipExport wartet auf den Restore und zeigt backup.importFailed auch bei einem Wurf', async () => {
    const { readFileSync } = await import('node:fs');
    const src = readFileSync(new URL('../../ZipExport.jsx', import.meta.url), 'utf8');
    expect(src).not.toMatch(/^\s+confirmAndRestore\(backup\);/m);
    expect((src.match(/await confirmAndRestore\(backup\);/g) || []).length).toBe(2);
    const block = src.slice(src.indexOf('const confirmAndRestore'));
    expect(block).toMatch(/try \{\s*result = await restoreBackup\(backup\);/);
  });
});

// K61 — Scheitert der Schnappschuss MITTENDRIN (erster Schlüssel geschrieben,
// zweiter am vollen Speicher gescheitert), dürfen die *_prerestore-Schlüssel
// nicht aus zwei Ständen gemischt bleiben: alles aus diesem Lauf zurück.
describe('restoreBackup — Schnappschuss scheitert mittendrin', () => {
  let map;
  const ALT_DATA = JSON.stringify({ basis: { canton: 'LU' } });
  beforeEach(() => {
    map = installLocalStorageMock();
    idbMap.clear();
    seed();
    // Stand eines früheren Wiederherstellens: data hatte schon einen Schnappschuss,
    // docs noch keinen.
    localStorage.setItem('or5_data_prerestore', ALT_DATA);
    localStorage.setItem('or5_prerestore_date', '2026-01-01T00:00:00.000Z');
    const echt = localStorage.setItem;
    localStorage.setItem = (k, v) => {
      if (k === 'or5_docs_prerestore') { const e = new Error('Speicher voll'); e.name = 'QuotaExceededError'; throw e; }
      echt(k, v);
    };
  });

  it('setzt die in diesem Lauf geschriebenen Schlüssel zurück und überschreibt nichts', async () => {
    const vorher = JSON.stringify([...map.entries()]);
    const r = await restoreBackup(gut());
    expect(r.success).toBe(false);
    expect(r.blocked).toBe(false);
    expect(r.error).toBe('Speicher voll');
    expect(r.restored).toEqual([]);
    expect(localStorage.getItem('or5_data_prerestore')).toBe(ALT_DATA);
    expect(localStorage.getItem('or5_docs_prerestore')).toBeNull();
    expect(localStorage.getItem('or5_prerestore_date')).toBe('2026-01-01T00:00:00.000Z');
    expect(JSON.stringify([...map.entries()])).toBe(vorher);
    expect(idbMap.size).toBe(0);
  });

  it('entfernt einen Schlüssel, der vorher nicht existierte', async () => {
    localStorage.removeItem('or5_data_prerestore');
    await restoreBackup(gut());
    expect(localStorage.getItem('or5_data_prerestore')).toBeNull();
    expect(map.has('or5_data_prerestore')).toBe(false);
  });

  it('wirft aus createPreRestoreSnapshot den ursprünglichen Fehler weiter', () => {
    expect(() => createPreRestoreSnapshot()).toThrow('Speicher voll');
    expect(localStorage.getItem('or5_data_prerestore')).toBe(ALT_DATA);
  });
});

describe('Grössenlimit vor dem Lesen', () => {
  it('Limit ist 50 MB', () => {
    expect(MAX_BACKUP_FILE_BYTES).toBe(50 * 1024 * 1024);
  });

  it('exceedsBackupFileLimit: genau am Limit ok, ein Byte darüber abgewiesen', () => {
    expect(exceedsBackupFileLimit(0)).toBe(false);
    expect(exceedsBackupFileLimit(MAX_BACKUP_FILE_BYTES)).toBe(false);
    expect(exceedsBackupFileLimit(MAX_BACKUP_FILE_BYTES + 1)).toBe(true);
    expect(exceedsBackupFileLimit(2 * 1024 * 1024 * 1024)).toBe(true);
  });

  it('unbrauchbare Grössen (undefined/NaN/negativ) gelten nicht als „zu gross"', () => {
    // Ein fehlender size-Wert darf den Import nicht still blockieren —
    // die Inhalts-Prüfung danach fängt echte Probleme.
    expect(exceedsBackupFileLimit(undefined)).toBe(false);
    expect(exceedsBackupFileLimit(NaN)).toBe(false);
    expect(exceedsBackupFileLimit(-1)).toBe(false);
  });
});

// Vorab-Prüfung 0.1.32 (sechs Prüfer): Ist ein Bereich jetzt leer, blieb seine
// Kopie aus einem früheren Lauf neben den neuen stehen — ein Schnappschuss aus
// zwei Ständen. Und die Auto-Sicherung schrieb am Schnappschuss vorbei.
describe('Schnappschuss: leere Bereiche und Auto-Sicherung (K61)', () => {
  beforeEach(() => { installLocalStorageMock(); });

  it('entfernt die ältere Kopie eines jetzt leeren Bereichs', () => {
    localStorage.setItem('or5_contacts_prerestore', 'ALT aus frueherem Lauf');
    localStorage.setItem('or5_data', JSON.stringify(VORHER));
    createPreRestoreSnapshot();
    expect(localStorage.getItem('or5_data_prerestore')).toBe(JSON.stringify(VORHER));
    expect(localStorage.getItem('or5_contacts_prerestore')).toBeNull();
    expect(localStorage.getItem('or5_prerestore_date')).not.toBeNull();
  });

  it('stellt die ältere Kopie wieder her, wenn der Schnappschuss danach scheitert', () => {
    const map = installLocalStorageMock();
    localStorage.setItem('or5_contacts_prerestore', 'ALT');
    localStorage.setItem('or5_data', 'NEU');
    const set = localStorage.setItem;
    localStorage.setItem = (k, v) => { if (k === 'or5_prerestore_date') throw new Error('Speicher voll'); set(k, v); };
    expect(() => createPreRestoreSnapshot()).toThrow('Speicher voll');
    expect(map.get('or5_contacts_prerestore')).toBe('ALT');
    expect(map.has('or5_data_prerestore')).toBe(false);
  });

  it('die Auto-Sicherung nutzt denselben Schnappschuss und bricht ab, wenn er scheitert', async () => {
    const { readFileSync } = await import('node:fs');
    const src = readFileSync(new URL('../autoBackup.js', import.meta.url), 'utf8');
    expect(src).toContain("import { createPreRestoreSnapshot } from './prerestore.js'");
    expect(src).toMatch(/try \{\s*createPreRestoreSnapshot\(\);\s*\} catch/);
    expect(src).not.toContain("localStorage.setItem('or5_data_prerestore'");
  });
});
