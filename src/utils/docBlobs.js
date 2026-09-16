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

// Schreibwege der Dokument-Liste in main.jsx (Upload, Löschen, Ablaufdatum).
// `setDocs` ist der Setter der Liste, die gerade gilt: echt `setDocuments`, im
// Beispiel-Modus die Beispiel-Liste im Arbeitsspeicher.
// Echt: die Datei geht nach IndexedDB, in die Liste (→ Auto-Save nach or5_docs) nur
// die Metadaten. Im Beispiel-Modus (K24) bleibt alles in der Beispiel-Liste im
// Arbeitsspeicher: kein IndexedDB, die Datei bleibt inline (Herunterladen geht),
// die echte Liste wird nicht angefasst. Belegt in src/__tests__/beispielDokumente.test.js.
export const dokumentAktionen = ({ demoMode, setDocs }) => ({
  hinzufuegen: async (doc) => {
    if (!demoMode && doc.data != null) await saveDocBlob(doc.id, doc.data);
    setDocs((prev) => [...prev, demoMode ? doc : stripBlob(doc)]);
  },
  loeschen: (id) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    return demoMode ? Promise.resolve() : deleteDocBlob(id);
  },
  ablaufAendern: (id, expiryDate) =>
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, expiryDate } : d))),
});

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

// Füllt fehlende `data`-Blobs einer Dokument-Liste aus IndexedDB auf
// (eine idb-Sammlung). Für selbst-enthaltende Snapshots/Backups.
export const hydrateDocs = async (docs) => {
  if (!Array.isArray(docs)) return docs;
  const blobs = await getAllDocBlobs();
  return docs.map((d) =>
    (d && d.id != null && d.data == null && blobs[d.id] != null)
      ? { ...d, data: blobs[d.id] }
      : d
  );
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
