// ─── Tresor-Speicher (At-Rest-Verschlüsselung) ──────────────
// Verschlüsselt die persönlichen Stores (or5_data etc.) mit der geteilten
// Primitive aus cryptoCore.js (AES-256-GCM + PBKDF2). Reines Modul — KEIN React,
// KEINE Verdrahtung in main.jsx. Spec: docs/design/tresor-lock.md.
//
// Grundmodell (bewusst schlicht, „nur Passphrase"): Schlüssel direkt aus der
// Passphrase + einem gespeicherten Salt ableiten. Das Salt liegt (unbedenklich)
// im Klartext im Datensatz-Kopf, damit beim Entsperren zuerst der Schlüssel
// abgeleitet werden kann. Kein Envelope/DEK — solange nicht gebraucht (Passphrase-
// Wechsel = Bundle neu verschlüsseln; die Datenmenge ist klein).
//
// Laufzeit: nach dem Entsperren hält der Aufrufer NUR den abgeleiteten Schlüssel
// (+ Salt) im Speicher — die Passphrase wird nicht behalten, PBKDF2 läuft nur
// einmal beim Entsperren, nicht bei jedem Speichern.
import { ALGO, SALT_BYTES, IV_BYTES, isSecureContext, deriveKey } from './cryptoCore.js';

const VAULT_MAGIC = 'MALOJA_PLANA_VAULT_V1';
export const VAULT_RECORD_KEY = 'or5_vault';   // Chiffretext-Datensatz (base64)
export const LOCKED_FLAG = 'or5_locked';        // '1' = Tresor aktiv

// Alle persönlichen Stores, die der Tresor schützt (Spec §2). Rohe Strings —
// bewusst nicht JSON.parse/-stringify, um Serialisierungs-Drift zu vermeiden.
export const VAULT_STORES = ['or5_data', 'or5_docs', 'or5_reminders', 'or5_merkliste', 'or5_contacts'];

// ── base64 ⇄ Bytes (Chiffretext muss als String in localStorage) ──
function bytesToBase64(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// ── Datensatz-Format: MAGIC + salt(16) + iv(12) + ciphertext ──
function packRecord(salt, iv, ciphertext) {
  const enc = new TextEncoder();
  const magic = enc.encode(VAULT_MAGIC);
  const ct = new Uint8Array(ciphertext);
  const packed = new Uint8Array(magic.length + salt.length + iv.length + ct.length);
  let o = 0;
  packed.set(magic, o); o += magic.length;
  packed.set(salt, o); o += salt.length;
  packed.set(iv, o); o += iv.length;
  packed.set(ct, o);
  return bytesToBase64(packed);
}
function unpackRecord(b64) {
  const bytes = base64ToBytes(b64);
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const magic = enc.encode(VAULT_MAGIC);
  if (bytes.length < magic.length + SALT_BYTES + IV_BYTES + 1) {
    throw new Error('Tresor-Datensatz zu kurz oder beschädigt.');
  }
  if (dec.decode(bytes.slice(0, magic.length)) !== VAULT_MAGIC) {
    throw new Error('Kein gültiger Maloja-Plana-Tresor-Datensatz.');
  }
  let o = magic.length;
  const salt = bytes.slice(o, o + SALT_BYTES); o += SALT_BYTES;
  const iv = bytes.slice(o, o + IV_BYTES); o += IV_BYTES;
  const ciphertext = bytes.slice(o);
  return { salt, iv, ciphertext };
}

// ── Krypto über dem Bundle-Objekt ──
// Verschlüsselt ein Bundle mit bereits abgeleitetem Schlüssel + Salt und einem
// FRISCHEN IV je Aufruf. Das Salt wandert mit in den Datensatz (fürs Entsperren).
async function encryptBundle(bundle, key, salt) {
  if (!isSecureContext()) throw new Error('Web Crypto nicht verfügbar (HTTPS/localhost nötig).');
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const plaintext = new TextEncoder().encode(JSON.stringify(bundle));
  const ciphertext = await crypto.subtle.encrypt({ name: ALGO, iv }, key, plaintext);
  return packRecord(salt, iv, ciphertext);
}
async function decryptRecord(b64, key) {
  const { iv, ciphertext } = unpackRecord(b64);
  let plaintext;
  try {
    plaintext = await crypto.subtle.decrypt({ name: ALGO, iv }, key, ciphertext);
  } catch {
    throw new Error('Entschlüsselung fehlgeschlagen — falsche Passphrase oder beschädigt.');
  }
  return JSON.parse(new TextDecoder().decode(plaintext));
}

// ── localStorage-Grenze: Stores sammeln / zurückschreiben / löschen ──
function collectStores() {
  const bundle = {};
  for (const k of VAULT_STORES) {
    const v = localStorage.getItem(k);
    if (v != null) bundle[k] = v;
  }
  return bundle;
}
function writeStores(bundle) {
  for (const k of VAULT_STORES) {
    if (bundle[k] != null) localStorage.setItem(k, bundle[k]);
  }
}
function clearStores() {
  for (const k of VAULT_STORES) localStorage.removeItem(k);
}

// ── Öffentliche Lebenszyklus-API ──

// Ist der Tresor aktiv? (Marker im Klartext — vor dem Entsperren lesbar.)
export function isVaultActive() {
  try { return localStorage.getItem(LOCKED_FLAG) === '1'; } catch { return false; }
}

// Aktivieren: Klartext-Stores einmalig verschlüsseln, Marker setzen, Klartext
// entfernen. Der Aufrufer MUSS vorher einen (verschlüsselten) Backup-Export
// anbieten — vergessene Passphrase = Daten weg (Spec §3).
// Gibt den Laufzeit-Schlüssel { key, salt } zurück, damit die App entsperrt weiterläuft.
export async function activateVault(passphrase) {
  if (!isSecureContext()) throw new Error('Web Crypto nicht verfügbar (HTTPS/localhost nötig).');
  if (isVaultActive()) throw new Error('Tresor ist bereits aktiv.');
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const key = await deriveKey(passphrase, salt);
  const bundle = collectStores();
  const record = await encryptBundle(bundle, key, salt);
  localStorage.setItem(VAULT_RECORD_KEY, record);
  localStorage.setItem(LOCKED_FLAG, '1');
  clearStores();
  return { key, salt, bundle };
}

// Entsperren: Datensatz lesen, Schlüssel aus Passphrase + gespeichertem Salt
// ableiten, Bundle entschlüsseln. Schreibt NICHTS im Klartext — die Daten leben
// nur im Rückgabewert (→ React-State). Wirft bei falscher Passphrase.
export async function unlockVault(passphrase) {
  if (!isSecureContext()) throw new Error('Web Crypto nicht verfügbar (HTTPS/localhost nötig).');
  const record = localStorage.getItem(VAULT_RECORD_KEY);
  if (!record) throw new Error('Kein Tresor-Datensatz vorhanden.');
  const { salt } = unpackRecord(record);
  const key = await deriveKey(passphrase, salt);
  const bundle = await decryptRecord(record, key);
  return { key, salt, bundle };
}

// Speichern im aktiven Tresor: Bundle mit vorhandenem Laufzeit-Schlüssel neu
// verschlüsseln (frischer IV) — KEIN PBKDF2 (der lief beim Entsperren).
export async function persistVault(bundle, key, salt) {
  const record = await encryptBundle(bundle, key, salt);
  localStorage.setItem(VAULT_RECORD_KEY, record);
}

// Deaktivieren: entschlüsseln, Klartext zurückschreiben, Tresor-Spuren entfernen.
export async function deactivateVault(passphrase) {
  const { bundle } = await unlockVault(passphrase);
  writeStores(bundle);
  localStorage.removeItem(VAULT_RECORD_KEY);
  localStorage.removeItem(LOCKED_FLAG);
  return bundle;
}
