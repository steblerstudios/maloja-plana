// ============================================================================
// DOKUMENT-BLOBS
// ----------------------------------------------------------------------------
// Dokument-Dateien (base64-dataURLs) liegen NICHT mehr im begrenzten
// localStorage (or5_docs), sondern in IndexedDB (idb-Helper, storage.js).
// or5_docs trägt nur noch Metadaten. Dieses Modul kapselt das Lesen/Schreiben
// der Blobs und stellt reine Hilfsfunktionen für Migration/Backup bereit.
// ============================================================================
import { idb } from './storage.js';

// ── idb-gebundene Persistenz (Browser-only, async) ────────────────────────

// Speichert einen Dokument-Blob (dataURL) unter der Dokument-id.
export const saveDocBlob = (id, dataUrl) => idb.save(id, dataUrl);

// Liest den Blob (dataURL) zu einer Dokument-id; null wenn nicht vorhanden.
export const getDocBlob = async (id) => {
  const record = await idb.get(id);
  return record ? (record.file ?? null) : null;
};

// Entfernt den Blob zu einer Dokument-id.
export const deleteDocBlob = (id) => idb.delete(id);

// Sammelt alle Blobs als { [id]: dataUrl } — für selbst-enthaltende Backups.
export const getAllDocBlobs = async () => {
  const keys = await idb.getAllKeys();
  const out = {};
  for (const key of keys) {
    const record = await idb.get(key);
    if (record && record.file != null) out[key] = record.file;
  }
  return out;
};

// ── Reine Funktionen (ohne idb, in Node testbar) ──────────────────────────

// Kopie des Dokuments ohne den (potenziell grossen) `data`-Blob.
export const stripBlob = (doc) => {
  if (!doc || typeof doc !== 'object') return doc;
  const { data, ...meta } = doc;
  return meta;
};

// Hat mindestens ein Dokument noch einen inline-Blob (`data`)?
export const needsMigration = (docs) =>
  Array.isArray(docs) && docs.some((d) => d && d.data != null);

// Trennt eine Dokument-Liste in Metadaten und Blobs:
//   { metaDocs: [...ohne data], blobs: { [id]: dataUrl } }
// Nur Dokumente mit id UND data liefern einen Blob; metaDocs ist immer
// vollständig (auch Dokumente, die schon ohne data sind).
export const splitDocsForMigration = (docs) => {
  const metaDocs = [];
  const blobs = {};
  if (!Array.isArray(docs)) return { metaDocs, blobs };
  for (const doc of docs) {
    if (!doc || typeof doc !== 'object') continue;
    metaDocs.push(stripBlob(doc));
    if (doc.id != null && doc.data != null) blobs[doc.id] = doc.data;
  }
  return { metaDocs, blobs };
};
