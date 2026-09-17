// ─── Encrypted Backup & Restore ─────────────────────────────
// Browser-native Web Crypto API (AES-256-GCM + PBKDF2).
// No external dependencies. No network calls.
// Encryption is the UI default (E10) — plaintext export stays available as a choice.
import { getDocBlob, saveDocBlob, stripBlob } from './docBlobs.js';
// Krypto-Primitive (AES-256-GCM + PBKDF2) zentral in cryptoCore.js — geteilt mit
// dem Tresor-Lock, damit es nur EINE Krypto-Quelle gibt.
import { ALGO, SALT_BYTES, IV_BYTES, isSecureContext, deriveKey } from './cryptoCore.js';
// Nur der Aktiv-Marker des Tresors — kein Zyklus (secureStore importiert backupCrypto nicht).
import { isTresorActive } from './secureStore.js';
import { validateBackupPayload } from './dataValidation.js';

// Backup-spezifischer Datei-Kopf (kennzeichnet + versioniert das Backup-Format).
const BACKUP_MAGIC = 'MALOJA_PLANA_BACKUP_V1';

// Grössenlimit VOR dem Lesen der Datei (FileReader). Begründung:
// - Was ins Backup kommt: or5_data/reminders/contacts/merkliste aus localStorage
//   (quota-bedingt zusammen im einstelligen MB-Bereich) plus die Dokument-Blobs
//   aus IndexedDB als base64-dataURL (Faktor ~1,37). Ein einzelnes Dokument ist
//   beim Upload auf 20 MB begrenzt (ChapterView MAX_DOC_BYTES) → max. ~27 MB im
//   Backup; typische Scans/Fotos liegen bei 0,3–3 MB.
// - Der Import materialisiert die Datei mehrfach im RAM: ArrayBuffer → String
//   (TextDecoder) → JSON.parse → JSON.stringify je Schlüssel. Bei 50 MB sind das
//   ~200 MB Spitze — in der iOS-Hülle (Capacitor/WKWebView) noch sicher; ein
//   Tab-Absturz MITTEN im Restore wäre der eigentliche Datenverlust-Fall.
// 50 MB deckt damit den localStorage-Anteil + ein Maximal-Dokument + gut ein
// Dutzend typische Scans. Es ist eine Schranke gegen den Fehlgriff (Video,
// Foto-Ordner) und gegen Speicher-Erschöpfung, kein Ziel-Wert. Eine Stelle
// zum Anheben, falls echte Backups je darüber liegen.
export const MAX_BACKUP_FILE_BYTES = 50 * 1024 * 1024;

// true, wenn die Datei nicht gelesen werden soll. Unbrauchbare Grössen
// (undefined/NaN/negativ) blockieren NICHT — die Inhalts-Prüfung danach greift.
export function exceedsBackupFileLimit(sizeBytes) {
  return typeof sizeBytes === 'number' && sizeBytes > MAX_BACKUP_FILE_BYTES;
}

/**
 * Collect all Maloja Plana data into a single backup object.
 * Includes or5_data, or5_docs, or5_reminders, or5_contacts, or5_merkliste (if present).
 */
export function collectBackupData() {
  // Bei aktivem Tresor liegen or5_data etc. NICHT im Klartext in localStorage —
  // ein direktes Sammeln ergäbe ein leeres, aber gültig aussehendes Backup
  // (Datenverlust-Falle beim Restore, 🔴 Vorbedingung 4). Der Aufrufer muss erst
  // entsperren und aus dem entschlüsselten Zustand sichern. Feuert live nie, weil
  // der Tresor dormant ist.
  if (isTresorActive()) {
    throw new Error('Backup bei aktivem Tresor nicht möglich — bitte zuerst entsperren.');
  }
  const backup = {
    magic: BACKUP_MAGIC,
    created: new Date().toISOString(),
    version: '5.1',
  };

  try { backup.data = JSON.parse(localStorage.getItem('or5_data') || '{}'); } catch { backup.data = {}; }
  try { backup.docs = JSON.parse(localStorage.getItem('or5_docs') || '[]'); } catch { backup.docs = []; }
  try { backup.reminders = JSON.parse(localStorage.getItem('or5_reminders') || '[]'); } catch { backup.reminders = []; }
  try { backup.contacts = JSON.parse(localStorage.getItem('or5_contacts') || '[]'); } catch { backup.contacts = []; }
  try { backup.merkliste = JSON.parse(localStorage.getItem('or5_merkliste') || '[]'); } catch { backup.merkliste = []; }

  backup.meta = {
    theme: localStorage.getItem('or5_theme'),
    lang: localStorage.getItem('or5_lang'),
    onboardingDone: localStorage.getItem('or5_onboarding_done'),
  };

  return backup;
}

/**
 * Wie collectBackupData(), aber hydriert Dokument-Blobs aus IndexedDB in
 * backup.docs[].data → das Backup bleibt selbst-enthaltend und portabel.
 * (or5_docs trägt seit der idb-Umstellung nur noch Metadaten.)
 */
export async function collectBackupDataAsync() {
  const backup = collectBackupData();
  if (Array.isArray(backup.docs)) {
    backup.docs = await Promise.all(backup.docs.map(async (doc) => {
      if (doc && doc.id != null && doc.data == null) {
        const dataUrl = await getDocBlob(doc.id);
        if (dataUrl != null) return { ...doc, data: dataUrl };
      }
      return doc;
    }));
  }
  return backup;
}

/**
 * Export backup as plaintext JSON string.
 */
export async function exportPlaintext() {
  const backup = await collectBackupDataAsync();
  return JSON.stringify(backup, null, 2);
}

/**
 * Export backup as encrypted ArrayBuffer.
 * Returns { encrypted: ArrayBuffer, filename: string } or throws.
 */
export async function exportEncrypted(passphrase) {
  if (!isSecureContext()) {
    throw new Error('Web Crypto API not available. Use HTTPS or localhost.');
  }
  if (!passphraseLangGenug(passphrase)) {
    throw new Error('Passphrase must be at least ' + MIN_PASSPHRASE_LENGTH + ' characters.');
  }

  const backup = await collectBackupDataAsync();
  const json = JSON.stringify(backup);
  const enc = new TextEncoder();
  const plaintext = enc.encode(json);

  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(passphrase, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGO, iv },
    key,
    plaintext
  );

  // Pack: magic(22 bytes) + salt(16) + iv(12) + ciphertext
  const magicBytes = enc.encode(BACKUP_MAGIC);
  const packed = new Uint8Array(magicBytes.length + salt.length + iv.length + ciphertext.byteLength);
  let offset = 0;
  packed.set(magicBytes, offset); offset += magicBytes.length;
  packed.set(salt, offset); offset += salt.length;
  packed.set(iv, offset); offset += iv.length;
  packed.set(new Uint8Array(ciphertext), offset);

  return packed.buffer;
}

/**
 * Decrypt an encrypted backup file.
 * Returns parsed backup object or throws.
 */
export async function decryptBackup(arrayBuffer, passphrase) {
  if (!isSecureContext()) {
    throw new Error('Web Crypto API not available. Use HTTPS or localhost.');
  }

  const bytes = new Uint8Array(arrayBuffer);
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const magicBytes = enc.encode(BACKUP_MAGIC);

  if (bytes.length < magicBytes.length + SALT_BYTES + IV_BYTES + 1) {
    throw new Error('File too small to be a valid encrypted backup.');
  }

  const fileMagic = dec.decode(bytes.slice(0, magicBytes.length));
  if (fileMagic !== BACKUP_MAGIC) {
    throw new Error('Not a Maloja Plana encrypted backup file.');
  }

  let offset = magicBytes.length;
  const salt = bytes.slice(offset, offset + SALT_BYTES); offset += SALT_BYTES;
  const iv = bytes.slice(offset, offset + IV_BYTES); offset += IV_BYTES;
  const ciphertext = bytes.slice(offset);

  const key = await deriveKey(passphrase, salt);

  let plaintext;
  try {
    plaintext = await crypto.subtle.decrypt({ name: ALGO, iv }, key, ciphertext);
  } catch {
    throw new Error('Decryption failed. Wrong passphrase or corrupted file.');
  }

  const json = dec.decode(plaintext);
  return JSON.parse(json);
}

/**
 * Parse a plaintext backup file.
 * Returns parsed backup object or throws.
 */
export function parsePlaintextBackup(text) {
  const backup = JSON.parse(text);
  if (!backup || typeof backup !== 'object') {
    throw new Error('Invalid backup: not a JSON object.');
  }
  if (!backup.created || !backup.version) {
    throw new Error('Invalid backup: missing created or version fields.');
  }
  return backup;
}

/**
 * Detect whether a file is encrypted or plaintext.
 * Returns 'encrypted' | 'plaintext' | 'unknown'.
 */
export function detectBackupType(arrayBuffer) {
  try {
    const bytes = new Uint8Array(arrayBuffer);
    const dec = new TextDecoder();
    const header = dec.decode(bytes.slice(0, BACKUP_MAGIC.length));
    if (header === BACKUP_MAGIC) return 'encrypted';

    const text = dec.decode(bytes);
    const parsed = JSON.parse(text);
    if (parsed && parsed.created && parsed.version) return 'plaintext';
  } catch { /* not valid */ }
  return 'unknown';
}

// K61: der Schnappschuss liegt in ./prerestore.js, damit auch die Auto-Sicherung
// ihn nutzt, ohne den Krypto-Code zu laden.
export { createPreRestoreSnapshot } from './prerestore.js';
import { createPreRestoreSnapshot } from './prerestore.js';

/**
 * Restore from a validated backup object.
 * MUST call createPreRestoreSnapshot() before this.
 * Returns { success, restored: string[], error }
 */
export async function applyBackup(backup) {
  const restored = [];

  try {
    if (backup.data !== undefined) {
      localStorage.setItem('or5_data', JSON.stringify(backup.data));
      restored.push('or5_data');
    }
    if (backup.docs !== undefined) {
      // Inline-Blobs aus dem Backup nach IndexedDB schreiben, in or5_docs nur
      // Metadaten ablegen. Rückwärtskompatibel: Alt-Backups tragen .data inline,
      // neue Backups wurden via collectBackupDataAsync hydriert.
      const docs = Array.isArray(backup.docs) ? backup.docs : [];
      for (const doc of docs) {
        if (doc && doc.id != null && doc.data != null) {
          await saveDocBlob(doc.id, doc.data);
        }
      }
      localStorage.setItem('or5_docs', JSON.stringify(docs.map(stripBlob)));
      restored.push('or5_docs');
    }
    if (backup.reminders !== undefined) {
      localStorage.setItem('or5_reminders', JSON.stringify(backup.reminders));
      restored.push('or5_reminders');
    }
    if (backup.contacts !== undefined) {
      localStorage.setItem('or5_contacts', JSON.stringify(backup.contacts));
      restored.push('or5_contacts');
    }
    if (backup.merkliste !== undefined) {
      localStorage.setItem('or5_merkliste', JSON.stringify(backup.merkliste));
      restored.push('or5_merkliste');
    }
    if (backup.meta) {
      if (backup.meta.theme) localStorage.setItem('or5_theme', backup.meta.theme);
      if (backup.meta.lang) localStorage.setItem('or5_lang', backup.meta.lang);
    }

    return { success: true, restored, error: null };
  } catch (e) {
    return { success: false, restored, error: e.message };
  }
}

/**
 * Validierung als Barriere, dann Snapshot, dann Schreiben — in DIESER Reihenfolge.
 * Schlägt validateBackupPayload fehl, wird nichts angefasst: kein Snapshot,
 * kein applyBackup. Die UI prüft zusätzlich vor dem Bestätigungs-Dialog,
 * damit niemand einen aussichtslosen Restore bestätigen muss; die Barriere
 * hier gilt aber unabhängig vom Aufrufer.
 * Returns { success, blocked, errors, restored, error }
 */
export async function restoreBackup(backup) {
  const validation = validateBackupPayload(backup);
  if (!validation.valid) {
    return { success: false, blocked: true, errors: validation.errors, restored: [], error: null };
  }
  // Scheitert der Schnappschuss (z. B. Speicher voll), wird nichts überschrieben —
  // ohne Schnappschuss kein Wiederherstellen (R4, Predeploy-Gate 16.09.2026).
  try {
    createPreRestoreSnapshot();
  } catch (e) {
    return { success: false, blocked: false, errors: [], restored: [], error: (e && e.message) || String(e) };
  }
  const result = await applyBackup(backup);
  return { ...result, blocked: false, errors: [] };
}

/**
 * Trigger a file download in the browser.
 */
export function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 200);
}

// ─── Passphrase-Mindestlänge (E10, 16.09.2026) ──────────────
// Gilt nur für NEUE verschlüsselte Sicherungen (vorher 4 Zeichen). decryptBackup
// prüft bewusst keine Länge, damit ältere Sicherungen mit kürzerer Passphrase
// lesbar bleiben. Steht am Dateiende, damit die Zeilen-Belege in docs/ gültig bleiben.
export const MIN_PASSPHRASE_LENGTH = 12;

export function passphraseLangGenug(passphrase) {
  return typeof passphrase === 'string' && passphrase.length >= MIN_PASSPHRASE_LENGTH;
}
