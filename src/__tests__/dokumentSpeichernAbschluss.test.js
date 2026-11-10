// Bugsuche 09.11.2026, Fund 1 · Ein Dokument gilt erst als gespeichert, wenn die
// IndexedDB-Transaktion abgeschlossen ist — nicht schon, wenn put() angenommen wurde.
// Bei vollem Speicher meldet der Browser den Fehler oft erst beim Abbruch der Transaktion
// (QuotaExceededError auf tx.onabort), NACH req.onsuccess. Vorher meldete idb.save dann
// trotzdem Erfolg: die Liste behielt den Eintrag, die Datei fehlte.
import { describe, it, expect, vi, beforeEach } from 'vitest';

let verhalten = 'abschluss';

const baueFakeDb = () => ({
  transaction: () => {
    const tx = { oncomplete: null, onabort: null, onerror: null, error: null };
    tx.objectStore = () => ({
      put: () => {
        const req = { onsuccess: null, onerror: null };
        setTimeout(() => {
          req.onsuccess && req.onsuccess();
          setTimeout(() => {
            if (verhalten === 'abschluss') {
              tx.oncomplete && tx.oncomplete();
            } else {
              tx.error = Object.assign(new Error('Speicher voll'), { name: 'QuotaExceededError' });
              tx.onabort && tx.onabort();
            }
          }, 0);
        }, 0);
        return req;
      },
    });
    return tx;
  },
  objectStoreNames: { contains: () => true },
  close: () => {},
});

vi.mock('../utils/idbUtils.js', () => ({
  openIDB: async () => { throw new Error('keine alte DB'); },
  openIDBWithStore: async () => baueFakeDb(),
}));

describe('idb.save meldet erst nach abgeschlossener Transaktion Erfolg', () => {
  beforeEach(() => { vi.resetModules(); });

  it('löst auf, wenn die Transaktion abschliesst', async () => {
    verhalten = 'abschluss';
    const { idb } = await import('../utils/storage.js');
    await expect(idb.save('doc1', 'data:x', {})).resolves.toBe('doc1');
  });

  it('scheitert, wenn die Transaktion nach put() abbricht (Speicher voll)', async () => {
    verhalten = 'abbruch';
    const { idb } = await import('../utils/storage.js');
    await expect(idb.save('doc2', 'data:x', {})).rejects.toThrow();
  });
});
