// ─── Krypto-Kern (Web Crypto) ───────────────────────────────
// Eine Quelle der Wahrheit für die kryptografische Primitive: AES-256-GCM +
// PBKDF2 (SHA-256). Browser-nativ, keine externen Dependencies, keine Netz-
// Aufrufe.
//
// Genutzt von der verschlüsselten Sicherung (backupCrypto.js) UND — künftig —
// vom Tresor-Lock (At-Rest-Verschlüsselung, siehe docs/design/tresor-lock.md).
// Bewusst DIESELBE Primitive für beide: kein zweites Krypto erfinden.
//
// ⚠️ Diese Parameter definieren das Datei-/Speicher-Format. Eine Änderung (z. B.
// mehr Iterationen) macht bestehende verschlüsselte Backups unlesbar — nur mit
// Migrationspfad ändern. Der Test friert die Werte deshalb bewusst ein.

export const ALGO = 'AES-GCM';
export const KEY_LENGTH = 256;
export const PBKDF2_ITERATIONS = 100000;
export const SALT_BYTES = 16;
export const IV_BYTES = 12;

// Web Crypto ist nur im sicheren Kontext (HTTPS/localhost) verfügbar.
export function isSecureContext() {
  return typeof crypto !== 'undefined' && crypto.subtle !== undefined;
}

// Leitet aus Passphrase + Salt einen nicht-extrahierbaren AES-GCM-Schlüssel ab
// (encrypt + decrypt). Nicht-extrahierbar: der Rohschlüssel verlässt Web Crypto nie.
export async function deriveKey(passphrase, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: ALGO, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}
