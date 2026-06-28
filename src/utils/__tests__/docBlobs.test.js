import { describe, it, expect } from 'vitest';
import { stripBlob, needsMigration, splitDocsForMigration } from '../docBlobs.js';

describe('stripBlob', () => {
  it('entfernt data, behält Metadaten', () => {
    const doc = { id: '1', type: 'id', fileName: 'pass.pdf', data: 'data:application/pdf;base64,AAAA' };
    const out = stripBlob(doc);
    expect(out).toEqual({ id: '1', type: 'id', fileName: 'pass.pdf' });
    expect(out.data).toBeUndefined();
  });

  it('lässt Dokumente ohne data unverändert (inhaltlich)', () => {
    const doc = { id: '2', type: 'cv' };
    expect(stripBlob(doc)).toEqual({ id: '2', type: 'cv' });
  });

  it('mutiert das Original nicht', () => {
    const doc = { id: '3', data: 'x' };
    stripBlob(doc);
    expect(doc.data).toBe('x');
  });

  it('reicht Nicht-Objekte unverändert durch', () => {
    expect(stripBlob(null)).toBe(null);
    expect(stripBlob(undefined)).toBe(undefined);
  });
});

describe('needsMigration', () => {
  it('true wenn irgendein Dokument inline data trägt', () => {
    expect(needsMigration([{ id: '1' }, { id: '2', data: 'x' }])).toBe(true);
  });

  it('false wenn kein Dokument data trägt', () => {
    expect(needsMigration([{ id: '1' }, { id: '2' }])).toBe(false);
  });

  it('false für leere Liste und Nicht-Arrays', () => {
    expect(needsMigration([])).toBe(false);
    expect(needsMigration(null)).toBe(false);
    expect(needsMigration(undefined)).toBe(false);
  });
});

describe('splitDocsForMigration', () => {
  it('trennt Metadaten und Blobs nach id', () => {
    const docs = [
      { id: '1', type: 'id', data: 'blob1' },
      { id: '2', type: 'cv' },
      { id: '3', type: 'lease', data: 'blob3' },
    ];
    const { metaDocs, blobs } = splitDocsForMigration(docs);
    expect(metaDocs).toEqual([
      { id: '1', type: 'id' },
      { id: '2', type: 'cv' },
      { id: '3', type: 'lease' },
    ]);
    expect(blobs).toEqual({ '1': 'blob1', '3': 'blob3' });
  });

  it('ignoriert data ohne id (kein verwaister Blob-Key)', () => {
    const { metaDocs, blobs } = splitDocsForMigration([{ type: 'x', data: 'orphan' }]);
    expect(metaDocs).toEqual([{ type: 'x' }]);
    expect(blobs).toEqual({});
  });

  it('liefert leere Struktur für Nicht-Arrays', () => {
    expect(splitDocsForMigration(null)).toEqual({ metaDocs: [], blobs: {} });
  });

  it('überspringt Nicht-Objekt-Einträge', () => {
    const { metaDocs, blobs } = splitDocsForMigration([null, { id: '1', data: 'b' }, 42]);
    expect(metaDocs).toEqual([{ id: '1' }]);
    expect(blobs).toEqual({ '1': 'b' });
  });
});
