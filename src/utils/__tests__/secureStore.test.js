import { describe, it, expect, beforeEach, vi } from 'vitest';

// IndexedDB-Ersatz (Node hat kein idb): storage.js#idb wird durch eine
// In-Memory-Map ersetzt, damit docBlobs.js real laufen kann.
const idbMap = new Map();
vi.mock('../storage.js', () => ({
  idb: {
    save: (id, dataUrl) => { idbMap.set(String(id), { file: dataUrl }); return Promise.resolve(); },
    get: (id) => Promise.resolve(idbMap.has(String(id)) ? idbMap.get(String(id)) : null),
    delete: (id) => { idbMap.delete(String(id)); return Promise.resolve(); },
    getAllKeys: () => Promise.resolve([...idbMap.keys()]),
  },
}));

import {
  isTresorActive, activateTresor, unlockTresor, persistTresor, deactivateTresor,
  TRESOR_RECORD_KEY, LOCKED_FLAG, TRESOR_STORES, TRESOR_MIN_PASSPHRASE,
} from '../secureStore.js';
import { collectBackupData } from '../backupCrypto.js';

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

const PW = 'mein-ganzer-satz'; // ≥ TRESOR_MIN_PASSPHRASE (12)
const OK = { backupConfirmed: true };

const seed = () => {
  localStorage.setItem('or5_data', JSON.stringify({ basis: { canton: 'BS' }, geheim: 'AHV 756.1234' }));
  localStorage.setItem('or5_docs', JSON.stringify([{ id: '1', type: 'id' }]));
  localStorage.setItem('or5_theme', 'dark'); // NICHT im Tresor — bleibt Klartext
};

describe('secureStore', () => {
  beforeEach(() => { installLocalStorageMock(); idbMap.clear(); });

  it('ist standardmäßig inaktiv', () => {
    expect(isTresorActive()).toBe(false);
  });

  it('activate verschlüsselt die Stores, entfernt Klartext, lässt Nicht-Tresor-Keys stehen', async () => {
    seed();
    await activateTresor(PW, OK);

    expect(isTresorActive()).toBe(true);
    expect(localStorage.getItem(LOCKED_FLAG)).toBe('1');
    expect(localStorage.getItem('or5_data')).toBeNull();
    expect(localStorage.getItem('or5_docs')).toBeNull();
    const record = localStorage.getItem(TRESOR_RECORD_KEY);
    expect(record).toBeTruthy();
    expect(record).not.toContain('756.1234');
    expect(record).not.toContain('canton');
    expect(localStorage.getItem('or5_theme')).toBe('dark');
  });

  it('unlock stellt das Bundle wieder her, schreibt aber KEINEN Klartext zurück', async () => {
    seed();
    await activateTresor(PW, OK);
    const { bundle, key, salt } = await unlockTresor(PW);

    expect(JSON.parse(bundle.or5_data).geheim).toBe('AHV 756.1234');
    expect(key).toBeTruthy();
    expect(salt).toBeInstanceOf(Uint8Array);
    expect(localStorage.getItem('or5_data')).toBeNull();
    expect(isTresorActive()).toBe(true);
  });

  it('falsche Passphrase schlägt fehl', async () => {
    seed();
    await activateTresor('richtig-lang', OK);
    await expect(unlockTresor('falsch-aber-lang')).rejects.toThrow(/fehlgeschlagen|falsche/i);
  });

  it('persist speichert Änderungen ohne erneutes PBKDF2 (mit Laufzeit-Schlüssel)', async () => {
    seed();
    const { key, salt, bundle } = await activateTresor(PW, OK);
    const updated = { ...bundle, or5_data: JSON.stringify({ neu: 'Wert' }) };
    await persistTresor(updated, key, salt);

    const after = await unlockTresor(PW);
    expect(JSON.parse(after.bundle.or5_data).neu).toBe('Wert');
  });

  it('deactivate stellt Klartext wieder her und entfernt Tresor-Spuren (Round-Trip)', async () => {
    seed();
    const before = localStorage.getItem('or5_data');
    await activateTresor(PW, OK);
    await deactivateTresor(PW);

    expect(isTresorActive()).toBe(false);
    expect(localStorage.getItem(TRESOR_RECORD_KEY)).toBeNull();
    expect(localStorage.getItem(LOCKED_FLAG)).toBeNull();
    expect(localStorage.getItem('or5_data')).toBe(before);
  });

  it('deckt genau die Spec-Stores ab', () => {
    expect(TRESOR_STORES).toEqual(['or5_data', 'or5_docs', 'or5_reminders', 'or5_merkliste', 'or5_contacts']);
  });

  // ─── 🔴 Vorbedingung 1: Dokument-Blobs werden mitverschlüsselt ───
  it('verschlüsselt Doc-Blobs aus IndexedDB und löscht den idb-Klartext', async () => {
    seed();
    idbMap.set('1', { file: 'data:image/png;base64,GEHEIMESDOKUMENT' });

    await activateTresor(PW, OK);
    // Klartext-Blob ist aus idb entfernt …
    expect(idbMap.has('1')).toBe(false);
    // … und steckt (nur) im Chiffrat.
    const record = localStorage.getItem(TRESOR_RECORD_KEY);
    expect(record).not.toContain('GEHEIMESDOKUMENT');

    const { bundle } = await unlockTresor(PW);
    expect(JSON.parse(bundle.or5_docs)[0].data).toBe('data:image/png;base64,GEHEIMESDOKUMENT');
  });

  it('deactivate trennt Doc-Blobs wieder in idb + Metadaten (Round-Trip)', async () => {
    seed();
    idbMap.set('1', { file: 'data:image/png;base64,DOK' });
    await activateTresor(PW, OK);
    await deactivateTresor(PW);

    // Blob liegt wieder in idb …
    expect(idbMap.get('1').file).toBe('data:image/png;base64,DOK');
    // … und or5_docs trägt wieder nur Metadaten (kein inline data).
    const docs = JSON.parse(localStorage.getItem('or5_docs'));
    expect(docs[0].data).toBeUndefined();
    expect(docs[0].type).toBe('id');
  });

  // ─── 🔴 Vorbedingung 2: keine Klartext-Reste ───
  it('entfernt die or5_*_prerestore-Klartext-Kopien beim Aktivieren', async () => {
    seed();
    localStorage.setItem('or5_data_prerestore', localStorage.getItem('or5_data'));
    localStorage.setItem('or5_prerestore_date', '2026-07-18T00:00:00Z');

    await activateTresor(PW, OK);
    expect(localStorage.getItem('or5_data_prerestore')).toBeNull();
    expect(localStorage.getItem('or5_prerestore_date')).toBeNull();
  });

  // ─── 🔴 Vorbedingung 3: freundlicher Fehler statt roher DOMException ───
  it('wirft bei korruptem Datensatz eine freundliche Meldung (kein roher atob-Crash)', async () => {
    seed();
    await activateTresor(PW, OK);
    localStorage.setItem(TRESOR_RECORD_KEY, '@@@nicht-base64@@@');
    await expect(unlockTresor(PW)).rejects.toThrow(/beschädigt|ungültig/i);
  });

  // ─── 🔴 Vorbedingung 4: kein leeres Backup bei aktivem Tresor ───
  it('collectBackupData wirft bei aktivem Tresor statt leer zu sichern', async () => {
    seed();
    await activateTresor(PW, OK);
    expect(() => collectBackupData()).toThrow(/Tresor/i);
  });

  // ─── Härtung ───
  it('erzwingt Backup-Bestätigung vor Aktivierung', async () => {
    seed();
    await expect(activateTresor(PW)).rejects.toThrow(/Backup/i);
    expect(isTresorActive()).toBe(false);
    expect(localStorage.getItem('or5_data')).toBeTruthy(); // nichts angefasst
  });

  it('lehnt zu kurze Passphrasen ab', async () => {
    seed();
    await expect(activateTresor('kurz', OK)).rejects.toThrow(new RegExp(`${TRESOR_MIN_PASSPHRASE}`));
    expect(isTresorActive()).toBe(false);
  });

  it('legt die Iterationszahl (600k) versioniert im Record-Header ab', async () => {
    seed();
    await activateTresor(PW, OK);
    const { iterations } = await unlockTresor(PW);
    expect(iterations).toBe(600000);
  });
});
