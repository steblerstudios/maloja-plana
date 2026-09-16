import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { dokumentAktionen, saveDocBlob, deleteDocBlob, stripBlob } from '../utils/docBlobs.js';

// K24 · Beispiel-Modus INNERHALB der App (Fusszeilen-Link bzw. Dashboard-Kachel,
// also OHNE den Speicher-Schirm der Code-Wand). Verdacht aus dem Bau von #150:
// Dokument-Upload und -Löschen wirken dort auf die ECHTEN Dokumente.
//
// Wo Dokumente liegen:
//   • die Datei (dataURL): IndexedDB «maloja-plana-documents», Store «files»
//     (utils/storage.js idb.save/idb.delete, über docBlobs.js saveDocBlob/deleteDocBlob);
//   • die Metadaten: React-Zustand `documents` in main.jsx. Der Auto-Save schreibt ihn
//     alle 5 s nach localStorage `or5_docs`, unabhängig vom Beispiel-Modus.
//
// Das Fake-IndexedDB unten hält den Inhalt der Dokument-DB in `dateien`. Ändert sich
// `dateien`, hat der Weg die echte Datenbank erreicht.

const DB = 'maloja-plana-documents';
const dbNamen = new Set();
const dateien = new Map();

const erfolg = (wert) => {
  const req = { result: wert };
  Promise.resolve().then(() => req.onsuccess && req.onsuccess());
  return req;
};
const fakeIndexedDB = {
  open(name) {
    dbNamen.add(name);
    const store = {
      put: (eintrag) => { dateien.set(eintrag.id, eintrag.file); return erfolg(eintrag.id); },
      get: (id) => erfolg(dateien.has(id) ? { id, file: dateien.get(id) } : null),
      delete: (id) => { dateien.delete(id); return erfolg(undefined); },
    };
    const db = {
      version: 1,
      objectStoreNames: { contains: () => true },
      transaction: () => ({ objectStore: () => store }),
      close: () => {},
    };
    return erfolg(db);
  },
  databases: async () => [],
};

// Zustand wie bei React: set(fn) wendet fn auf die aktuelle Liste an.
const liste = (start) => {
  const z = { docs: start };
  z.set = (f) => { z.docs = typeof f === 'function' ? f(z.docs) : f; };
  return z;
};

const PASS = { id: '1', type: 'id', fileName: 'pass.pdf', expiryDate: '2030-01-01', chapter: 'basis' };
const NEU = { id: '2', type: 'lease', fileName: 'mietvertrag.pdf', expiryDate: '2031-06-30', chapter: 'wohnen', data: 'data:application/pdf;base64,AAAA' };

beforeAll(() => { globalThis.indexedDB = fakeIndexedDB; });
afterAll(() => { delete globalThis.indexedDB; });
beforeEach(() => {
  dateien.clear();
  dateien.set('1', 'data:application/pdf;base64,PASS');
});

// Schritt 1 der BUGS-Regel: erst nachstellen. Die beiden Blöcke unten sind der Weg, wie er
// bis 0274ce9 in main.jsx stand (handleAddDocument / handleDeleteDocument, wortgleich bis auf
// die id) — sie kannten den Beispiel-Modus nicht. Der Reiter «Dokumente» in ChapterView.jsx
// ist im Beispiel nicht gesperrt (nur die Eingabefelder sind es, `pointerEvents: none`),
// der Upload-Knopf ruft also genau diesen Weg. Dieser Block bleibt stehen, damit der Bug
// nicht ein zweites Mal einziehen kann.
describe('K24 · Nachstellen: der Weg vor dem Fix trifft die echten Dokumente', () => {
  const altHinzufuegen = async (setDocuments, doc) => {
    if (doc.data != null) await saveDocBlob(doc.id, doc.data);
    setDocuments((prev) => [...prev, stripBlob(doc)]);
  };
  const altLoeschen = (setDocuments, id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    return deleteDocBlob(id);
  };

  it('Upload im Beispiel schrieb die Datei in die echte Dokument-DB und die Metadaten in die echte Liste', async () => {
    const echt = liste([PASS]);
    await altHinzufuegen(echt.set, NEU); // «demoMode» kam hier gar nicht vor
    expect(dateien.get('2')).toBe(NEU.data);
    expect(echt.docs).toHaveLength(2);
  });

  it('Löschen im Beispiel entfernte das echte Dokument samt Datei', async () => {
    const echt = liste([PASS]);
    await altLoeschen(echt.set, '1');
    expect(dateien.has('1')).toBe(false);
    expect(echt.docs).toEqual([]);
  });
});

describe('K24 · Dokumente im Beispiel-Modus', () => {
  it('Upload landet nur in der Beispiel-Liste — echte Liste und IndexedDB bleiben unberührt', async () => {
    const echt = liste([PASS]);
    const beispiel = liste([]);
    const akt = dokumentAktionen({ demoMode: true, setDocuments: echt.set, setDemoDocs: beispiel.set });
    await akt.hinzufuegen(NEU);
    expect([...dateien.keys()]).toEqual(['1']);
    expect(echt.docs).toEqual([PASS]);
    // Die Datei bleibt inline in der Beispiel-Kopie: Herunterladen geht ohne IndexedDB.
    expect(beispiel.docs).toEqual([NEU]);
  });

  it('Löschen entfernt nur aus der Beispiel-Liste — echtes Dokument und seine Datei bleiben', async () => {
    const echt = liste([PASS]);
    const beispiel = liste([{ ...PASS }]);
    const akt = dokumentAktionen({ demoMode: true, setDocuments: echt.set, setDemoDocs: beispiel.set });
    await akt.loeschen('1');
    expect(dateien.get('1')).toBe('data:application/pdf;base64,PASS');
    expect(echt.docs).toEqual([PASS]);
    expect(beispiel.docs).toEqual([]);
  });

  it('Ablaufdatum ändern bleibt in der Beispiel-Liste', () => {
    const echt = liste([PASS]);
    const beispiel = liste([{ ...PASS }]);
    const akt = dokumentAktionen({ demoMode: true, setDocuments: echt.set, setDemoDocs: beispiel.set });
    akt.ablaufAendern('1', '2040-12-31');
    expect(echt.docs).toEqual([PASS]);
    expect(beispiel.docs[0].expiryDate).toBe('2040-12-31');
  });
});

describe('K24 · Kontrolle: ausserhalb des Beispiels gilt der echte Weg', () => {
  it('Upload: Datei nach IndexedDB «maloja-plana-documents», in die Liste nur Metadaten', async () => {
    const echt = liste([PASS]);
    const beispiel = liste([]);
    const akt = dokumentAktionen({ demoMode: false, setDocuments: echt.set, setDemoDocs: beispiel.set });
    await akt.hinzufuegen(NEU);
    expect(dbNamen.has(DB)).toBe(true);
    expect(dateien.get('2')).toBe(NEU.data);
    const { data: _ohneDatei, ...meta } = NEU;
    expect(echt.docs).toEqual([PASS, meta]);
    expect(beispiel.docs).toEqual([]);
  });

  it('Löschen: aus der Liste und die Datei aus IndexedDB', async () => {
    const echt = liste([PASS]);
    const akt = dokumentAktionen({ demoMode: false, setDocuments: echt.set, setDemoDocs: liste([]).set });
    await akt.loeschen('1');
    expect(dateien.has('1')).toBe(false);
    expect(echt.docs).toEqual([]);
  });
});

describe('K24 · Verdrahtung in main.jsx', () => {
  const quelle = fs.readFileSync(path.resolve(__dirname, '../main.jsx'), 'utf8');

  it('die Dokument-Aktionen bekommen den Beispiel-Modus und beide Listen', () => {
    expect(quelle).toMatch(/dokumentAktionen\(\{\s*demoMode,\s*setDocuments,\s*setDemoDocs\s*\}\)/);
  });

  it('Tresor, Lebensmappe und Export zeigen im Beispiel die Beispiel-Liste', () => {
    expect(quelle).toMatch(/const docs = demoMode \? demoDocs : documents;/);
    expect(quelle).toMatch(/React\.createElement\(DocumentTresor, \{[^}]*?documents: docs,/);
    expect(quelle).toMatch(/React\.createElement\(Lebensmappe, \{[^}]*?documents: docs,/);
    expect(quelle).toMatch(/React\.createElement\(ZipExport, \{[^}]*?documents: docs,/);
  });

  it('der Auto-Save schreibt weiterhin nur die echte Liste nach or5_docs', () => {
    expect(quelle).toContain("localStorage.setItem('or5_docs', JSON.stringify(documents));");
  });
});
