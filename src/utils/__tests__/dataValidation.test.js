import { describe, it, expect } from 'vitest';
import { validateBackupPayload, validateMerkliste, BACKUP_LIST_LIMITS } from '../dataValidation.js';

// Ein minimal gültiges Backup, wie collectBackupData() es erzeugt.
const okBackup = (extra = {}) => ({
  magic: 'MALOJA_PLANA_BACKUP_V1',
  created: '2026-09-15T10:00:00.000Z',
  version: '5.1',
  data: { basis: {}, wohnen: {} },
  docs: [{ id: 'd1', type: 'id' }],
  reminders: [{ id: 'r1' }],
  contacts: [{ id: 'c1', name: 'Amt' }],
  merkliste: [{ id: 'm1', text: 'Anmelden', link: null, done: false }],
  ...extra,
});

const listOf = (n, prefix) => Array.from({ length: n }, (_, i) => ({ id: prefix + i }));

describe('validateBackupPayload — Grundform', () => {
  it('akzeptiert ein Backup wie aus dem Export', () => {
    const r = validateBackupPayload(okBackup());
    expect(r.valid).toBe(true);
    expect(r.errors).toEqual([]);
  });

  it('weist Nicht-Objekte und fehlende Kopf-Felder ab', () => {
    expect(validateBackupPayload(null).valid).toBe(false);
    expect(validateBackupPayload([]).valid).toBe(false);
    expect(validateBackupPayload(okBackup({ created: 'gestern' })).valid).toBe(false);
    expect(validateBackupPayload(okBackup({ version: 51 })).valid).toBe(false);
  });

  it('weist struktur-kaputte Kapitel ab (data.basis kein Objekt)', () => {
    const r = validateBackupPayload(okBackup({ data: { basis: 'kaputt' } }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.startsWith('data:'))).toBe(true);
  });
});

describe('validateBackupPayload — merkliste', () => {
  it('meldet eine merkliste, die kein Array ist', () => {
    const r = validateBackupPayload(okBackup({ merkliste: { m1: true } }));
    expect(r.valid).toBe(false);
    expect(r.errors.some(e => e.startsWith('merkliste:'))).toBe(true);
  });

  it('meldet Einträge ohne id oder mit falschem text-Typ', () => {
    const r = validateBackupPayload(okBackup({ merkliste: [{ text: 'ohne id' }, { id: 'm2', text: 42 }] }));
    expect(r.valid).toBe(false);
    expect(r.errors.filter(e => e.startsWith('merkliste:')).length).toBe(2);
  });

  it('validateMerkliste filtert kaputte Einträge aus sanitized, behält gute', () => {
    const r = validateMerkliste([{ id: 'm1', text: 'a' }, 'string', { id: 'm3', text: 'c', done: true }]);
    expect(r.valid).toBe(false);
    expect(r.sanitized.map(m => m.id)).toEqual(['m1', 'm3']);
  });

  it('fehlende merkliste ist kein Fehler (Alt-Backups vor der Merkliste)', () => {
    const b = okBackup();
    delete b.merkliste;
    expect(validateBackupPayload(b).valid).toBe(true);
  });
});

describe('validateBackupPayload — Anzahl-Obergrenzen', () => {
  it('Limits sind endlich und grosszügig', () => {
    for (const [k, v] of Object.entries(BACKUP_LIST_LIMITS)) {
      expect(Number.isFinite(v), k).toBe(true);
      expect(v, k).toBeGreaterThanOrEqual(500);
    }
    expect(Object.keys(BACKUP_LIST_LIMITS).sort()).toEqual(
      ['betreibung', 'contacts', 'docs', 'merkliste', 'reminders', 'schulden', 'verlustscheine']
    );
  });

  it.each(['docs', 'reminders', 'contacts', 'merkliste'])('Cap greift für %s (Limit + 1 → Fehler, Limit → ok)', (key) => {
    const limit = BACKUP_LIST_LIMITS[key];
    const atLimit = validateBackupPayload(okBackup({ [key]: listOf(limit, key) }));
    expect(atLimit.valid, key + ' am Limit').toBe(true);
    const over = validateBackupPayload(okBackup({ [key]: listOf(limit + 1, key) }));
    expect(over.valid, key + ' über Limit').toBe(false);
    expect(over.errors.some(e => e.startsWith(key + ':') && e.includes(String(limit)))).toBe(true);
  });

  it.each(['schulden', 'betreibung', 'verlustscheine'])('Cap greift für data.%s', (key) => {
    const limit = BACKUP_LIST_LIMITS[key];
    const ok = validateBackupPayload(okBackup({ data: { basis: {}, [key]: listOf(limit, key) } }));
    expect(ok.valid).toBe(true);
    const over = validateBackupPayload(okBackup({ data: { basis: {}, [key]: listOf(limit + 1, key) } }));
    expect(over.valid).toBe(false);
    expect(over.errors.some(e => e.includes(key) && e.includes(String(limit)))).toBe(true);
  });

  it('Cap zählt, ohne die Elemente einzeln zu prüfen (kein Doppel-Fehler pro Eintrag)', () => {
    const limit = BACKUP_LIST_LIMITS.docs;
    const r = validateBackupPayload(okBackup({ docs: Array.from({ length: limit + 5 }, () => ({})) }));
    expect(r.valid).toBe(false);
    // Genau EIN Cap-Fehler für docs — nicht limit+5 „missing id"-Zeilen dazu.
    expect(r.errors.filter(e => e.startsWith('docs:')).length).toBe(1);
  });
});
