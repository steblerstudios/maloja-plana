import { describe, it, expect } from 'vitest';
import { deriveKey, isSecureContext, ALGO, KEY_LENGTH, SALT_BYTES, IV_BYTES, PBKDF2_ITERATIONS } from '../cryptoCore.js';

const salt = () => crypto.getRandomValues(new Uint8Array(SALT_BYTES));
const iv = () => crypto.getRandomValues(new Uint8Array(IV_BYTES));
const bytes = (s) => new TextEncoder().encode(s);
const str = (b) => new TextDecoder().decode(b);

describe('cryptoCore', () => {
  it('isSecureContext ist im Testkontext wahr (Web Crypto vorhanden)', () => {
    expect(isSecureContext()).toBe(true);
  });

  it('deriveKey + AES-GCM: Round-Trip mit korrekter Passphrase', async () => {
    const s = salt(), i = iv();
    const key = await deriveKey('richtig-geheim', s);
    const ct = await crypto.subtle.encrypt({ name: ALGO, iv: i }, key, bytes('Maloja Plana'));
    const pt = await crypto.subtle.decrypt({ name: ALGO, iv: i }, key, ct);
    expect(str(pt)).toBe('Maloja Plana');
  });

  it('gleiche Passphrase + gleiches Salt sind deterministisch (frisch abgeleiteter Schlüssel entschlüsselt)', async () => {
    const s = salt(), i = iv();
    const k1 = await deriveKey('pw', s);
    const ct = await crypto.subtle.encrypt({ name: ALGO, iv: i }, k1, bytes('x'));
    const k2 = await deriveKey('pw', s); // separat abgeleitet, gleiche Eingabe
    const pt = await crypto.subtle.decrypt({ name: ALGO, iv: i }, k2, ct);
    expect(str(pt)).toBe('x');
  });

  it('falsche Passphrase schlägt fehl (GCM-Authentifizierung)', async () => {
    const s = salt(), i = iv();
    const key = await deriveKey('richtig-geheim', s);
    const ct = await crypto.subtle.encrypt({ name: ALGO, iv: i }, key, bytes('Maloja'));
    const wrong = await deriveKey('falsch', s);
    await expect(crypto.subtle.decrypt({ name: ALGO, iv: i }, wrong, ct)).rejects.toBeTruthy();
  });

  it('anderes Salt → anderer Schlüssel (entschlüsselt fremde Chiffre nicht)', async () => {
    const i = iv();
    const key = await deriveKey('pw', salt());
    const ct = await crypto.subtle.encrypt({ name: ALGO, iv: i }, key, bytes('geheim'));
    const other = await deriveKey('pw', salt());
    await expect(crypto.subtle.decrypt({ name: ALGO, iv: i }, other, ct)).rejects.toBeTruthy();
  });

  // Diese Werte definieren das Backup-/Tresor-Format. Ändert sie jemand ohne
  // Migrationspfad, werden bestehende verschlüsselte Backups unlesbar → bewusst
  // eingefroren.
  it('Format-Parameter sind stabil (Kompatibilität mit backupCrypto)', () => {
    expect(ALGO).toBe('AES-GCM');
    expect(KEY_LENGTH).toBe(256);
    expect(SALT_BYTES).toBe(16);
    expect(IV_BYTES).toBe(12);
    expect(PBKDF2_ITERATIONS).toBe(100000);
  });
});
