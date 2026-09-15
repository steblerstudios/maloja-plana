import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { speicherAbschirmen } from '../demo/demoSpeicher.js';

// K7 · Demo am Einstieg. Beleg für «die Demo schreibt keine echten Daten»:
// alles, was die App während der Demo schreibt oder löscht, bleibt in der
// Überlagerung; nach dem Verlassen ist der echte Speicher unverändert.
//
// Die Fakes bilden die Browser-Form nach: Methoden liegen auf dem PROTOTYP
// (wie bei Storage/IDBFactory), der Schirm patcht genau diesen.

class FakeStorage {
  constructor(eintraege = {}) { this._m = new Map(Object.entries(eintraege)); }
  get length() { return this._m.size; }
  key(i) { return [...this._m.keys()][i] ?? null; }
  getItem(k) { return this._m.has(k) ? this._m.get(k) : null; }
  setItem(k, v) { this._m.set(String(k), String(v)); }
  removeItem(k) { this._m.delete(String(k)); }
  clear() { this._m.clear(); }
}
class FakeIDBFactory {
  open(name) { return 'geöffnet:' + name; }
  deleteDatabase(name) { return 'gelöscht:' + name; }
}

const ECHT = {
  or5_data: JSON.stringify({ basis: { canton: 'BS' } }),
  or5_docs: '[]',
  or5_lang: 'fr',
  or5_simpleView: '1',
};
const schnappschuss = (s) => JSON.stringify([...s._m.entries()].sort());

describe('Demo-Speicher-Schirm (K7)', () => {
  let local, session, idb, freigeben;
  const originale = {
    getItem: FakeStorage.prototype.getItem,
    setItem: FakeStorage.prototype.setItem,
    removeItem: FakeStorage.prototype.removeItem,
    clear: FakeStorage.prototype.clear,
    open: FakeIDBFactory.prototype.open,
    deleteDatabase: FakeIDBFactory.prototype.deleteDatabase,
  };

  beforeEach(() => {
    local = new FakeStorage(ECHT);
    session = new FakeStorage();
    idb = new FakeIDBFactory();
    freigeben = speicherAbschirmen(FakeStorage.prototype, FakeIDBFactory.prototype);
  });
  afterEach(() => { freigeben(); });

  it('Schreiben in der Demo erreicht den echten Speicher nicht — auch nicht or5_beta_access', () => {
    const vorher = schnappschuss(local);
    // Was die App in der Demo typischerweise schreibt:
    local.setItem('or5_data', JSON.stringify({ basis: { firstName: 'Maria' } })); // Auto-Save
    local.setItem('or5_theme', 'false');
    local.setItem('or5_reminders', '[{"id":"doc_1"}]');
    local.setItem('or5_lang', 'it');
    local.setItem('or5_beta_access', 'true');
    session.setItem('x', '1');
    // In der Demo sichtbar …
    expect(local.getItem('or5_theme')).toBe('false');
    expect(local.getItem('or5_beta_access')).toBe('true');
    // … im echten Bestand nicht.
    expect(schnappschuss(local)).toBe(vorher);
    expect(session._m.size).toBe(0);
    freigeben();
    expect(schnappschuss(local)).toBe(vorher);
    expect(local.getItem('or5_beta_access')).toBeNull();
    expect(local.getItem('or5_data')).toBe(ECHT.or5_data);
  });

  it('Lesen sieht zuerst die Demo-Lage, dann den echten Stand', () => {
    expect(local.getItem('or5_lang')).toBe('fr'); // echte Sprache bleibt sichtbar
    local.setItem('or5_lang', 'en');
    expect(local.getItem('or5_lang')).toBe('en');
    expect(local.getItem('gibt_es_nicht')).toBeNull();
  });

  it('Entfernen und Leeren löschen in der Demo nichts Echtes', () => {
    const vorher = schnappschuss(local);
    local.removeItem('or5_data');
    expect(local.getItem('or5_data')).toBeNull();
    local.setItem('neu', '1');
    local.clear();
    expect(local.getItem('or5_docs')).toBeNull();
    expect(local.getItem('neu')).toBeNull();
    expect(schnappschuss(local)).toBe(vorher);
    freigeben();
    expect(local.getItem('or5_data')).toBe(ECHT.or5_data);
    expect(local.getItem('neu')).toBeNull();
  });

  it('local- und sessionStorage haben getrennte Lagen', () => {
    local.setItem('k', 'local');
    expect(session.getItem('k')).toBeNull();
  });

  it('IndexedDB lässt sich in der Demo weder öffnen noch löschen', () => {
    expect(() => idb.open('maloja-plana-documents')).toThrow(/Demo/);
    expect(() => idb.deleteDatabase('maloja-plana-documents')).toThrow(/Demo/);
  });

  it('nach dem Verlassen sind die Original-Methoden zurück und schreiben wieder echt', () => {
    freigeben();
    freigeben(); // zweiter Aufruf wirkungslos
    for (const name of ['getItem', 'setItem', 'removeItem', 'clear']) {
      expect(FakeStorage.prototype[name]).toBe(originale[name]);
    }
    expect(FakeIDBFactory.prototype.open).toBe(originale.open);
    expect(FakeIDBFactory.prototype.deleteDatabase).toBe(originale.deleteDatabase);
    expect(idb.open('db')).toBe('geöffnet:db');
    local.setItem('nach_demo', '1');
    expect(local._m.get('nach_demo')).toBe('1');
  });

  it('die Demo-Lage einer früheren Demo ist beim nächsten Mal weg', () => {
    local.setItem('or5_theme', 'false');
    freigeben();
    freigeben = speicherAbschirmen(FakeStorage.prototype, FakeIDBFactory.prototype);
    expect(local.getItem('or5_theme')).toBeNull();
  });
});

describe('BetaGate: die Demo hebt das Gate nicht auf', () => {
  const quelle = fs.readFileSync(path.resolve(__dirname, '../BetaGate.jsx'), 'utf8');

  it('or5_beta_access wird genau einmal gesetzt — im Code-Pfad (handleSubmit)', () => {
    const treffer = quelle.match(/localStorage\.setItem\(STORAGE_KEY/g) || [];
    expect(treffer.length).toBe(1);
    const submit = quelle.slice(quelle.indexOf('const handleSubmit'), quelle.indexOf('setGranted(true)'));
    expect(submit).toContain('localStorage.setItem(STORAGE_KEY');
  });

  it('der Demo-Einstieg setzt weder granted noch den Zugangs-Schlüssel und lädt den Schirm lazy', () => {
    const start = quelle.slice(quelle.indexOf('const startDemo'), quelle.indexOf('if (granted)'));
    expect(start.length).toBeGreaterThan(0);
    expect(start).not.toMatch(/setGranted|STORAGE_KEY|or5_beta_access/);
    expect(start).toContain("import('./demo/demoSpeicher.js')");
    expect(quelle).not.toMatch(/^import .*demoSpeicher/m); // nie statisch ins Hauptbundle
  });
});
