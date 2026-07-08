// ============================================================================
// Zero-Knowledge Vault — Envelope-Verschlüsselung (Phase 1)
// ============================================================================
//
// Der Sicherheits-Kern des optionalen Backups. Läuft AUSSCHLIESSLICH im Browser
// (bzw. Node für Tests) mit der eingebauten WebCrypto-API — keine Krypto-Bibliothek.
//
// Prinzip (siehe docs/context/SECURITY_PHASE_1_PLAN.md, Abschnitt „Krypto-Design"):
//
//   1. DEK  (Data Encryption Key): zufälliger AES-256-GCM-Schlüssel, verschlüsselt die
//      eigentlichen Backup-Daten.
//   2. KEK  (Key Encryption Key): via HKDF aus einem Nutzer-Geheimnis abgeleitet,
//      „wrappt" (verschlüsselt) den DEK. Nur der *gewrappte* DEK verlässt das Gerät.
//   3. Der DEK wird ZWEIMAL gewrappt: einmal mit dem KEK aus dem WebAuthn-PRF-Output
//      (normaler Login), einmal mit dem KEK aus dem Recovery-Geheimnis. So gibt es zwei
//      Wege ihn zu entsperren — Passkey ODER Recovery-Code.
//
// Der Server speichert nur das Ergebnis von sealBackup() als JSON: ausschliesslich
// Chiffrat + Salts + gewrappte Schlüssel. Ohne PRF-Output oder Recovery-Geheimnis ist
// daraus nichts zu gewinnen — das ist die „Server kann nie lesen"-Garantie.

const subtle = globalThis.crypto.subtle;

const AES = 'AES-GCM';
const KEY_BITS = 256;
const IV_BYTES = 12;      // 96-bit IV, Standard für AES-GCM
const SALT_BYTES = 16;
const RECOVERY_BYTES = 20; // 160-bit Recovery-Geheimnis — kryptografisch stark
const VERSION = 1;

// HKDF-„info"-Labels zur Domänentrennung: derselbe Rohschlüssel ergibt so für PRF und
// Recovery garantiert unterschiedliche KEKs.
const INFO_PRF = 'maloja-vault-prf-v1';
const INFO_RECOVERY = 'maloja-vault-recovery-v1';

// ─── Bytes / Base64 / Hex Helfer (cross-env, für grosse Blobs chunk-sicher) ────────

const enc = new TextEncoder();
const dec = new TextDecoder();

function randomBytes(n) {
  return globalThis.crypto.getRandomValues(new Uint8Array(n));
}

function bytesToBase64(bytes) {
  let bin = '';
  const CHUNK = 0x8000; // vermeidet Argument-Limit von String.fromCharCode bei grossen Arrays
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function bytesToGroupedHex(bytes) {
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  // In 4er-Gruppen für lesbare Recovery-Codes: "A1B2-C3D4-…"
  return hex.match(/.{1,4}/g).join('-');
}

// Nimmt eine vom Menschen (evtl. schlampig) getippte Recovery-Zeichenkette entgegen.
function parseRecovery(display) {
  const hex = String(display).replace(/[^0-9a-fA-F]/g, '').toLowerCase();
  if (hex.length !== RECOVERY_BYTES * 2) {
    throw new Error('Ungültiges Recovery-Format');
  }
  const out = new Uint8Array(RECOVERY_BYTES);
  for (let i = 0; i < RECOVERY_BYTES; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

// ─── Kern-Primitive ────────────────────────────────────────────────────────────

// Neuer zufälliger DEK. extractable=true, damit er zum Wrappen exportiert werden kann.
async function generateDek() {
  return subtle.generateKey({ name: AES, length: KEY_BITS }, true, ['encrypt', 'decrypt']);
}

async function encrypt(key, plaintextBytes) {
  const iv = randomBytes(IV_BYTES);
  const ct = new Uint8Array(await subtle.encrypt({ name: AES, iv }, key, plaintextBytes));
  return { iv, ct };
}

async function decrypt(key, iv, ct) {
  // Wirft bei falschem Schlüssel oder manipuliertem Chiffrat (GCM-Auth-Tag schlägt fehl).
  return new Uint8Array(await subtle.decrypt({ name: AES, iv }, key, ct));
}

// Leitet einen AES-GCM-KEK via HKDF-SHA-256 aus einem hochentropischen Rohschlüssel ab
// (PRF-Output oder Recovery-Geheimnis). salt + info sorgen für frische, getrennte KEKs.
async function deriveKek(rawSecretBytes, salt, info) {
  const base = await subtle.importKey('raw', rawSecretBytes, 'HKDF', false, ['deriveKey']);
  return subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt, info: enc.encode(info) },
    base,
    { name: AES, length: KEY_BITS },
    false,
    ['encrypt', 'decrypt'],
  );
}

// „Wrappt" den DEK: exportiert ihn roh und verschlüsselt diese 32 Bytes mit dem KEK.
async function wrapDek(kek, dek) {
  const raw = new Uint8Array(await subtle.exportKey('raw', dek));
  return encrypt(kek, raw);
}

async function unwrapDek(kek, wrapped) {
  const raw = await decrypt(kek, wrapped.iv, wrapped.ct);
  return subtle.importKey('raw', raw, { name: AES, length: KEY_BITS }, true, ['encrypt', 'decrypt']);
}

// ─── Öffentliche High-Level-API ──────────────────────────────────────────────────

// Erzeugt ein frisches Recovery-Geheimnis. `display` wird der Nutzerin EINMAL gezeigt
// (aufschreiben/verwahren); `bytes` fliesst intern in sealBackup(). Server sieht es nie.
function generateRecovery() {
  const bytes = randomBytes(RECOVERY_BYTES);
  return { bytes, display: bytesToGroupedHex(bytes) };
}

// Verschlüsselt `plaintext` (String, i. d. R. JSON der App-Daten) zu einem
// serialisierbaren Objekt, das der Server als Chiffrat-Blob ablegen kann.
//
// prfOutput:       Uint8Array aus der WebAuthn-PRF-Extension (Login-Schlüsselquelle)
// recoveryBytes:   Uint8Array aus generateRecovery().bytes (Wiederherstellung)
async function sealBackup(plaintext, prfOutput, recoveryBytes) {
  const dek = await generateDek();
  const { iv, ct } = await encrypt(dek, enc.encode(plaintext));

  const prfSalt = randomBytes(SALT_BYTES);
  const recoverySalt = randomBytes(SALT_BYTES);

  const kekPrf = await deriveKek(prfOutput, prfSalt, INFO_PRF);
  const kekRecovery = await deriveKek(recoveryBytes, recoverySalt, INFO_RECOVERY);

  const wrappedPrf = await wrapDek(kekPrf, dek);
  const wrappedRecovery = await wrapDek(kekRecovery, dek);

  return {
    v: VERSION,
    alg: 'AES-256-GCM+HKDF-SHA256',
    iv: bytesToBase64(iv),
    ct: bytesToBase64(ct),
    prfSalt: bytesToBase64(prfSalt),
    recoverySalt: bytesToBase64(recoverySalt),
    wrappedPrf: { iv: bytesToBase64(wrappedPrf.iv), ct: bytesToBase64(wrappedPrf.ct) },
    wrappedRecovery: { iv: bytesToBase64(wrappedRecovery.iv), ct: bytesToBase64(wrappedRecovery.ct) },
  };
}

async function openWithKek(sealed, kek, wrapped) {
  const dek = await unwrapDek(kek, {
    iv: base64ToBytes(wrapped.iv),
    ct: base64ToBytes(wrapped.ct),
  });
  const plainBytes = await decrypt(dek, base64ToBytes(sealed.iv), base64ToBytes(sealed.ct));
  return dec.decode(plainBytes);
}

// Entsperrt das Backup über den normalen Login (WebAuthn-PRF-Output).
async function openBackupWithPrf(sealed, prfOutput) {
  const kek = await deriveKek(prfOutput, base64ToBytes(sealed.prfSalt), INFO_PRF);
  return openWithKek(sealed, kek, sealed.wrappedPrf);
}

// Entsperrt das Backup über den Recovery-Code (getippte Zeichenkette ODER Bytes).
async function openBackupWithRecovery(sealed, recovery) {
  const bytes = recovery instanceof Uint8Array ? recovery : parseRecovery(recovery);
  const kek = await deriveKek(bytes, base64ToBytes(sealed.recoverySalt), INFO_RECOVERY);
  return openWithKek(sealed, kek, sealed.wrappedRecovery);
}

export {
  generateRecovery,
  sealBackup,
  openBackupWithPrf,
  openBackupWithRecovery,
  parseRecovery,
  bytesToGroupedHex,
  RECOVERY_BYTES,
  VERSION,
};
