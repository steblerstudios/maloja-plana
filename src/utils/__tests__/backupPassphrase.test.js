import { describe, it, expect, beforeEach, vi } from 'vitest';

// E10 (Bau-Liste 16.09.2026): neue Sicherungen verlangen mindestens 12 Zeichen,
// alte Sicherungen mit kürzerer Passphrase bleiben lesbar.

// IndexedDB-Ersatz (Node hat kein idb) — gleiches Muster wie backupRestore.test.js.
vi.mock('../storage.js', () => ({
  idb: {
    save: () => Promise.resolve(),
    get: () => Promise.resolve(null),
    delete: () => Promise.resolve(),
    getAllKeys: () => Promise.resolve([]),
  },
}));

import {
  exportEncrypted, decryptBackup, detectBackupType,
  MIN_PASSPHRASE_LENGTH, passphraseLangGenug,
} from '../backupCrypto.js';
import { ALGO, SALT_BYTES, IV_BYTES, deriveKey } from '../cryptoCore.js';

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
}

// Baut eine Sicherung im Format V1 so, wie die App sie vor E10 mit einer
// 4-Zeichen-Passphrase geschrieben hat (Kopf + Salt + IV + Chiffrat).
async function alteSicherung(passphrase, inhalt) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(passphrase, salt);
  const chiffrat = await crypto.subtle.encrypt({ name: ALGO, iv }, key, enc.encode(JSON.stringify(inhalt)));
  const kopf = enc.encode('MALOJA_PLANA_BACKUP_V1');
  const out = new Uint8Array(kopf.length + salt.length + iv.length + chiffrat.byteLength);
  out.set(kopf, 0);
  out.set(salt, kopf.length);
  out.set(iv, kopf.length + salt.length);
  out.set(new Uint8Array(chiffrat), kopf.length + salt.length + iv.length);
  return out.buffer;
}

describe('E10 — Mindestlänge der Passphrase für neue Sicherungen', () => {
  beforeEach(() => {
    installLocalStorageMock();
    localStorage.setItem('or5_data', JSON.stringify({ basis: { canton: 'BS' } }));
  });

  it('die Mindestlänge ist 12', () => {
    expect(MIN_PASSPHRASE_LENGTH).toBe(12);
  });

  it('passphraseLangGenug: 11 Zeichen nein, 12 Zeichen ja, Leeres nein', () => {
    expect(passphraseLangGenug('a'.repeat(11))).toBe(false);
    expect(passphraseLangGenug('a'.repeat(12))).toBe(true);
    expect(passphraseLangGenug('')).toBe(false);
    expect(passphraseLangGenug(undefined)).toBe(false);
  });

  it('exportEncrypted weist eine 4-Zeichen-Passphrase ab', async () => {
    await expect(exportEncrypted('abcd')).rejects.toThrow(/12/);
  });

  it('exportEncrypted weist 11 Zeichen ab', async () => {
    await expect(exportEncrypted('a'.repeat(11))).rejects.toThrow(/12/);
  });

  it('exportEncrypted mit 12 Zeichen erzeugt eine lesbare Sicherung', async () => {
    const pass = 'zwoelf-zeich';
    expect(pass.length).toBe(12);
    const buf = await exportEncrypted(pass);
    expect(detectBackupType(buf)).toBe('encrypted');
    const backup = await decryptBackup(buf, pass);
    expect(backup.data).toEqual({ basis: { canton: 'BS' } });
  });
});

describe('E10 — alte Sicherungen mit kürzerer Passphrase bleiben lesbar', () => {
  it('eine Sicherung mit 4-Zeichen-Passphrase lässt sich entschlüsseln', async () => {
    const inhalt = { magic: 'MALOJA_PLANA_BACKUP_V1', created: '2026-07-01T08:00:00.000Z', version: '5.1', data: { basis: { canton: 'ZH' } } };
    const buf = await alteSicherung('abcd', inhalt);
    expect(detectBackupType(buf)).toBe('encrypted');
    await expect(decryptBackup(buf, 'abcd')).resolves.toEqual(inhalt);
  });

  it('die falsche Passphrase bleibt ein Fehler (Gegenprobe)', async () => {
    const buf = await alteSicherung('abcd', { created: 'x', version: '5.1' });
    await expect(decryptBackup(buf, 'abce')).rejects.toThrow(/Decryption failed/);
  });
});
