// ─── Tresor-Speicher (At-Rest-Verschlüsselung) ──────────────
// Verschlüsselt die persönlichen Stores (or5_data etc.) mit der geteilten
// Primitive aus cryptoCore.js (AES-256-GCM + PBKDF2). Reines Modul — KEIN React,
// KEINE Verdrahtung in main.jsx. Spec: docs/design/tresor-lock.md.
//
// Namensgebung: „Tresor"/„Lock" = Level-1-At-Rest (dieses Modul). „Vault"
// (Envelope, Recovery, Server) ist bewusst Level 2 (src/crypto/vault.js) —
// darum tragen die Bezeichner hier TRESOR_*/LOCK_*, nicht VAULT_*.
//
// Grundmodell (bewusst schlicht, „nur Passphrase"): Schlüssel direkt aus der
// Passphrase + einem gespeicherten Salt ableiten. Salt UND Iterationszahl liegen
// (unbedenklich) im Klartext im Datensatz-Kopf, damit beim Entsperren zuerst der
// Schlüssel abgeleitet werden kann. Kein Envelope/DEK — solange nicht gebraucht.
//
// Laufzeit: nach dem Entsperren hält der Aufrufer NUR den abgeleiteten Schlüssel
// (+ Salt) im Speicher — die Passphrase wird nicht behalten, PBKDF2 läuft nur
// einmal beim Entsperren, nicht bei jedem Speichern.
import {
  ALGO, SALT_BYTES, IV_BYTES, isSecureContext, deriveKey,
  PBKDF2_ITERATIONS, PBKDF2_ITERATIONS_TRESOR,
} from './cryptoCore.js';
import {
  hydrateDocs, splitDocsForMigration, saveDocBlob, deleteDocBlob,
} from './docBlobs.js';

// Datensatz-Format V2 trägt die Iterationszahl im Kopf (V1 = alt, ohne → 100k).
const TRESOR_MAGIC = 'MALOJA_PLANA_TRESOR_V2';
const TRESOR_MAGIC_V1 = 'MALOJA_PLANA_VAULT_V1'; // nur fürs freundliche Erkennen von Alt-Datensätzen
export const TRESOR_RECORD_KEY = 'or5_tresor';   // Chiffretext-Datensatz (base64)
export const LOCKED_FLAG = 'or5_locked';         // '1' = Tresor aktiv

// Passphrase-Mindestlänge für den Tresor. Er schützt ALLE persönlichen Daten at
// rest → bewusst strenger als der Backup-Export (≥4). Entscheid Stebler Studios
// 2026-07-18: 12 Zeichen, UX auf „ganzer Satz" ausrichten (Passphrase- statt
// Passwort-Denke; die Länge kommt aus einem Merksatz, nicht aus Zeichenklassen).
export const TRESOR_MIN_PASSPHRASE = 12;

// Alle persönlichen Stores, die der Tresor schützt (Spec §2). Rohe Strings —
// bewusst nicht JSON.parse/-stringify, um Serialisierungs-Drift zu vermeiden.
// Ausnahme: or5_docs wird beim Sammeln mit den IndexedDB-Blobs hydriert.
export const TRESOR_STORES = ['or5_data', 'or5_docs', 'or5_reminders', 'or5_merkliste', 'or5_contacts'];
const DOCS_STORE = 'or5_docs';

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

// uint32 (big-endian) ⇄ Bytes für die Iterationszahl im Kopf.
function u32ToBytes(n) {
  const b = new Uint8Array(4);
  b[0] = (n >>> 24) & 0xff; b[1] = (n >>> 16) & 0xff; b[2] = (n >>> 8) & 0xff; b[3] = n & 0xff;
  return b;
}
function bytesToU32(b, o) {
  return ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
}

// ── Datensatz-Format V2: MAGIC + iterations(4) + salt(16) + iv(12) + ciphertext ──
function packRecord(iterations, salt, iv, ciphertext) {
  const enc = new TextEncoder();
  const magic = enc.encode(TRESOR_MAGIC);
  const iterBytes = u32ToBytes(iterations);
  const ct = new Uint8Array(ciphertext);
  const packed = new Uint8Array(magic.length + iterBytes.length + salt.length + iv.length + ct.length);
  let o = 0;
  packed.set(magic, o); o += magic.length;
  packed.set(iterBytes, o); o += iterBytes.length;
  packed.set(salt, o); o += salt.length;
  packed.set(iv, o); o += iv.length;
  packed.set(ct, o);
  return bytesToBase64(packed);
}
// Wirft bei zu kurzem/fremdem Datensatz (freundliche Meldung). Liest V2 mit
// Iterationszahl; erkennt V1-Alt-Datensätze und setzt den Fallback 100k.
function unpackRecord(b64) {
  const bytes = base64ToBytes(b64);
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const magicV2 = enc.encode(TRESOR_MAGIC);
  const magicV1 = enc.encode(TRESOR_MAGIC_V1);

  const head = dec.decode(bytes.slice(0, magicV2.length));
  if (head === TRESOR_MAGIC) {
    const min = magicV2.length + 4 + SALT_BYTES + IV_BYTES + 1;
    if (bytes.length < min) throw new Error('Tresor-Datensatz zu kurz oder beschädigt.');
    let o = magicV2.length;
    const iterations = bytesToU32(bytes, o); o += 4;
    const salt = bytes.slice(o, o + SALT_BYTES); o += SALT_BYTES;
    const iv = bytes.slice(o, o + IV_BYTES); o += IV_BYTES;
    const ciphertext = bytes.slice(o);
    return { iterations, salt, iv, ciphertext };
  }
  if (dec.decode(bytes.slice(0, magicV1.length)) === TRESOR_MAGIC_V1) {
    const min = magicV1.length + SALT_BYTES + IV_BYTES + 1;
    if (bytes.length < min) throw new Error('Tresor-Datensatz zu kurz oder beschädigt.');
    let o = magicV1.length;
    const salt = bytes.slice(o, o + SALT_BYTES); o += SALT_BYTES;
    const iv = bytes.slice(o, o + IV_BYTES); o += IV_BYTES;
    const ciphertext = bytes.slice(o);
    return { iterations: PBKDF2_ITERATIONS, salt, iv, ciphertext }; // Alt-Fallback 100k
  }
  throw new Error('Kein gültiger Maloja-Plana-Tresor-Datensatz.');
}

// ── Krypto über dem Bundle-Objekt ──
// Verschlüsselt ein Bundle mit bereits abgeleitetem Schlüssel + Salt und einem
// FRISCHEN IV je Aufruf. Salt und Iterationszahl wandern mit in den Datensatz.
async function encryptBundle(bundle, key, salt, iterations) {
  if (!isSecureContext()) throw new Error('Web Crypto nicht verfügbar (HTTPS/localhost nötig).');
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const plaintext = new TextEncoder().encode(JSON.stringify(bundle));
  const ciphertext = await crypto.subtle.encrypt({ name: ALGO, iv }, key, plaintext);
  return packRecord(iterations, salt, iv, ciphertext);
}
async function decryptRecord(iv, ciphertext, key) {
  let plaintext;
  try {
    plaintext = await crypto.subtle.decrypt({ name: ALGO, iv }, key, ciphertext);
  } catch {
    throw new Error('Entschlüsselung fehlgeschlagen — falsche Passphrase oder beschädigt.');
  }
  return JSON.parse(new TextDecoder().decode(plaintext));
}

// ── localStorage-Grenze: Stores sammeln / zurückschreiben / löschen ──

// Sammelt die Tresor-Stores als rohe Strings. or5_docs wird mit den echten
// Datei-Blobs aus IndexedDB HYDRIERT, damit die Dateien mitverschlüsselt werden
// (sonst blieben sie im Klartext in idb liegen — 🔴 Vorbedingung 1).
async function collectStoresHydrated() {
  const bundle = {};
  for (const k of TRESOR_STORES) {
    const v = localStorage.getItem(k);
    if (v != null) bundle[k] = v;
  }
  if (bundle[DOCS_STORE] != null) {
    let docs;
    try { docs = JSON.parse(bundle[DOCS_STORE]); } catch { docs = null; }
    if (Array.isArray(docs)) {
      const hydrated = await hydrateDocs(docs); // füllt fehlende .data aus idb
      bundle[DOCS_STORE] = JSON.stringify(hydrated);
    }
  }
  return bundle;
}

// Schreibt die Stores zurück. or5_docs wird wieder in Metadaten (localStorage)
// und Blobs (IndexedDB) getrennt — spiegelbildlich zur Hydration.
async function writeStoresDehydrated(bundle) {
  for (const k of TRESOR_STORES) {
    if (k === DOCS_STORE || bundle[k] == null) continue;
    localStorage.setItem(k, bundle[k]);
  }
  if (bundle[DOCS_STORE] != null) {
    let docs;
    try { docs = JSON.parse(bundle[DOCS_STORE]); } catch { docs = null; }
    if (Array.isArray(docs)) {
      const { metaDocs, blobs } = splitDocsForMigration(docs);
      for (const id of Object.keys(blobs)) await saveDocBlob(id, blobs[id]);
      localStorage.setItem(DOCS_STORE, JSON.stringify(metaDocs));
    } else {
      localStorage.setItem(DOCS_STORE, bundle[DOCS_STORE]);
    }
  }
}

// Entfernt ALLE Klartext-Spuren: die Tresor-Stores, die zugehörigen Doc-Blobs in
// IndexedDB und die or5_*_prerestore-Klartext-Kopien (aus createPreRestoreSnapshot)
// — sonst überlebte ein vollständiger unverschlüsselter Datensatz neben dem
// Chiffrat (🔴 Vorbedingung 2). `hydratedDocs` sind die schon hydrierten Docs,
// deren Blobs wir gezielt aus idb löschen.
async function purgePlaintext(hydratedDocs) {
  for (const k of TRESOR_STORES) {
    localStorage.removeItem(k);
    localStorage.removeItem(k + '_prerestore');
  }
  localStorage.removeItem('or5_prerestore_date');
  if (Array.isArray(hydratedDocs)) {
    for (const d of hydratedDocs) {
      if (d && d.id != null) await deleteDocBlob(d.id);
    }
  }
}

// ── Öffentliche Lebenszyklus-API ──

// Ist der Tresor aktiv? (Marker im Klartext — vor dem Entsperren lesbar.)
export function isTresorActive() {
  try { return localStorage.getItem(LOCKED_FLAG) === '1'; } catch { return false; }
}

// Aktivieren: Klartext-Stores (inkl. Doc-Blobs) einmalig verschlüsseln, Marker
// setzen, ALLE Klartext-Spuren entfernen. Der Aufrufer MUSS vorher einen
// verschlüsselten Backup-Export erzeugt haben und das über `backupConfirmed`
// bezeugen — vergessene Passphrase = Daten weg (Spec §3). Das ist die
// erzwungene Backup-Vorbedingung (nicht nur Doku-Konvention).
// Gibt den Laufzeit-Schlüssel { key, salt } zurück, damit die App entsperrt weiterläuft.
export async function activateTresor(passphrase, { backupConfirmed = false } = {}) {
  if (!isSecureContext()) throw new Error('Web Crypto nicht verfügbar (HTTPS/localhost nötig).');
  if (isTresorActive()) throw new Error('Tresor ist bereits aktiv.');
  if (typeof passphrase !== 'string' || passphrase.length < TRESOR_MIN_PASSPHRASE) {
    throw new Error(`Passphrase muss mindestens ${TRESOR_MIN_PASSPHRASE} Zeichen haben — nimm am besten einen ganzen Satz, den du dir merkst.`);
  }
  if (!backupConfirmed) {
    throw new Error('Backup-Export nötig, bevor der Tresor aktiviert wird (Datenverlust-Schutz).');
  }
  const iterations = PBKDF2_ITERATIONS_TRESOR;
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const key = await deriveKey(passphrase, salt, iterations);
  const bundle = await collectStoresHydrated();
  // hydrierte Docs merken (für die gezielte idb-Löschung nach dem Verschlüsseln).
  let hydratedDocs = null;
  if (bundle[DOCS_STORE] != null) {
    try { hydratedDocs = JSON.parse(bundle[DOCS_STORE]); } catch { hydratedDocs = null; }
  }
  const record = await encryptBundle(bundle, key, salt, iterations);
  localStorage.setItem(TRESOR_RECORD_KEY, record);
  localStorage.setItem(LOCKED_FLAG, '1');
  await purgePlaintext(hydratedDocs);
  return { key, salt, bundle };
}

// Entsperren: Datensatz lesen, Schlüssel aus Passphrase + gespeichertem Salt +
// gespeicherter Iterationszahl ableiten, Bundle entschlüsseln. Schreibt NICHTS im
// Klartext — die Daten leben nur im Rückgabewert (→ React-State). Der
// unpackRecord/atob-Schritt liegt IM try/catch, damit ein korrupter Datensatz die
// freundliche „beschädigt"-Meldung wirft statt einer rohen DOMException (🔴 Vorbed. 3).
export async function unlockTresor(passphrase) {
  if (!isSecureContext()) throw new Error('Web Crypto nicht verfügbar (HTTPS/localhost nötig).');
  const record = localStorage.getItem(TRESOR_RECORD_KEY);
  if (!record) throw new Error('Kein Tresor-Datensatz vorhanden.');
  let parsed;
  try {
    parsed = unpackRecord(record);
  } catch (e) {
    throw new Error('Tresor-Datensatz beschädigt oder ungültig.');
  }
  const { iterations, salt, iv, ciphertext } = parsed;
  const key = await deriveKey(passphrase, salt, iterations);
  const bundle = await decryptRecord(iv, ciphertext, key);
  return { key, salt, bundle, iterations };
}

// Speichern im aktiven Tresor: Bundle mit vorhandenem Laufzeit-Schlüssel neu
// verschlüsseln (frischer IV) — KEIN PBKDF2 (der lief beim Entsperren). Die
// Iterationszahl bleibt die des aktiven Tresors.
export async function persistTresor(bundle, key, salt, iterations = PBKDF2_ITERATIONS_TRESOR) {
  const record = await encryptBundle(bundle, key, salt, iterations);
  localStorage.setItem(TRESOR_RECORD_KEY, record);
}

// Deaktivieren: entschlüsseln, Klartext (inkl. Doc-Blobs) zurückschreiben,
// Tresor-Spuren entfernen.
export async function deactivateTresor(passphrase) {
  const { bundle } = await unlockTresor(passphrase);
  await writeStoresDehydrated(bundle);
  localStorage.removeItem(TRESOR_RECORD_KEY);
  localStorage.removeItem(LOCKED_FLAG);
  return bundle;
}
