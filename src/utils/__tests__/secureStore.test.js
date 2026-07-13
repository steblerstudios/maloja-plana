import { describe, it, expect, beforeEach } from 'vitest';
import {
  isVaultActive, activateVault, unlockVault, persistVault, deactivateVault,
  VAULT_RECORD_KEY, LOCKED_FLAG, VAULT_STORES,
} from '../secureStore.js';

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

const seed = () => {
  localStorage.setItem('or5_data', JSON.stringify({ basis: { canton: 'BS' }, geheim: 'AHV 756.1234' }));
  localStorage.setItem('or5_docs', JSON.stringify([{ id: '1', type: 'id' }]));
  localStorage.setItem('or5_theme', 'dark'); // NICHT im Tresor — bleibt Klartext
};

describe('secureStore', () => {
  beforeEach(() => { installLocalStorageMock(); });

  it('ist standardmäßig inaktiv', () => {
    expect(isVaultActive()).toBe(false);
  });

  it('activate verschlüsselt die Stores, entfernt Klartext, lässt Nicht-Tresor-Keys stehen', async () => {
    seed();
    await activateVault('meine-passphrase');

    expect(isVaultActive()).toBe(true);
    expect(localStorage.getItem(LOCKED_FLAG)).toBe('1');
    // Klartext-Stores sind weg …
    expect(localStorage.getItem('or5_data')).toBeNull();
    expect(localStorage.getItem('or5_docs')).toBeNull();
    // … der Chiffretext-Datensatz existiert und enthält das AHV-Geheimnis NICHT im Klartext.
    const record = localStorage.getItem(VAULT_RECORD_KEY);
    expect(record).toBeTruthy();
    expect(record).not.toContain('756.1234');
    expect(record).not.toContain('canton');
    // Nicht-Tresor-Key bleibt lesbar (Theme fürs Entsperr-Bild).
    expect(localStorage.getItem('or5_theme')).toBe('dark');
  });

  it('unlock stellt das Bundle wieder her, schreibt aber KEINEN Klartext zurück', async () => {
    seed();
    await activateVault('pw');
    const { bundle, key, salt } = await unlockVault('pw');

    expect(JSON.parse(bundle.or5_data).geheim).toBe('AHV 756.1234');
    expect(key).toBeTruthy();
    expect(salt).toBeInstanceOf(Uint8Array);
    // Kein Klartext-Leck in localStorage nach dem Entsperren.
    expect(localStorage.getItem('or5_data')).toBeNull();
    expect(isVaultActive()).toBe(true);
  });

  it('falsche Passphrase schlägt fehl', async () => {
    seed();
    await activateVault('richtig');
    await expect(unlockVault('falsch')).rejects.toThrow(/fehlgeschlagen|falsche/i);
  });

  it('persist speichert Änderungen ohne erneutes PBKDF2 (mit Laufzeit-Schlüssel)', async () => {
    seed();
    const { key, salt, bundle } = await activateVault('pw');
    const updated = { ...bundle, or5_data: JSON.stringify({ neu: 'Wert' }) };
    await persistVault(updated, key, salt);

    const after = await unlockVault('pw');
    expect(JSON.parse(after.bundle.or5_data).neu).toBe('Wert');
  });

  it('deactivate stellt Klartext wieder her und entfernt Tresor-Spuren (Round-Trip)', async () => {
    seed();
    const before = localStorage.getItem('or5_data');
    await activateVault('pw');
    await deactivateVault('pw');

    expect(isVaultActive()).toBe(false);
    expect(localStorage.getItem(VAULT_RECORD_KEY)).toBeNull();
    expect(localStorage.getItem(LOCKED_FLAG)).toBeNull();
    expect(localStorage.getItem('or5_data')).toBe(before); // exakt gleich
  });

  it('deckt genau die Spec-Stores ab', () => {
    expect(VAULT_STORES).toEqual(['or5_data', 'or5_docs', 'or5_reminders', 'or5_merkliste', 'or5_contacts']);
  });
});
