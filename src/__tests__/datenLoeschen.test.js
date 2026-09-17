import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { alleDatenLoeschen, APP_DATENBANKEN, BEHALTEN, LOESCH_SIGNAL } from '../utils/datenLoeschen.js';
import { speicherAbschirmen } from '../demo/demoSpeicher.js';

// E18 (Bau-Liste O11): «Alle Daten auf diesem Gerät löschen». Beleg, dass der
// Löschweg localStorage (or5_*) UND IndexedDB (Dokumente, Auto-Sicherungen)
// erwischt — `storage.clear()` allein hätte die Dokumente in IndexedDB liegen
// lassen — und dass er im Beispiel nichts Echtes anfasst (B-3).
//
// Die Fakes legen ihre Methoden auf den PROTOTYP, wie Storage/IDBFactory im Browser:
// der Löschweg sperrt danach genau dort das Schreiben bis zum Neustart.

class FakeStorage {
  constructor(eintraege = {}) { this._m = new Map(Object.entries(eintraege)); }
  get length() { return this._m.size; }
  key(i) { return [...this._m.keys()][i] ?? null; }
  getItem(k) { return this._m.has(k) ? this._m.get(k) : null; }
  setItem(k, v) { (this.log ||= []).push(['set', String(k), String(v)]); this._m.set(String(k), String(v)); }
  removeItem(k) { (this.log ||= []).push(['remove', String(k)]); this._m.delete(String(k)); }
  clear() { this._m.clear(); }
}
const ORIG_SET = FakeStorage.prototype.setItem;

// IndexedDB-Fake: deleteDatabase liefert ein Request-Objekt, das asynchron
// onsuccess (bzw. onerror) feuert — wie der Browser.
class FakeIDBFactory {
  constructor(namen = [], fehler = []) { this.dbs = new Set(namen); this.fehler = new Set(fehler); this.offen = []; }
  open(name) { this.offen.push(name); this.dbs.add(name); return {}; }
  deleteDatabase(name) {
    const req = {};
    setTimeout(() => {
      if (this.fehler.has(name)) { req.error = new Error('kaputt'); req.onerror && req.onerror(); return; }
      this.dbs.delete(name);
      req.onsuccess && req.onsuccess();
    }, 0);
    return req;
  }
}
const ORIG_OPEN = FakeIDBFactory.prototype.open;
const ORIG_DELETE = FakeIDBFactory.prototype.deleteDatabase;

const ECHT = {
  or5_data: JSON.stringify({ basis: { canton: 'BS' }, finanzen: { _na: ['employer'] } }),
  or5_docs: '[{"id":"1"}]',
  or5_reminders: '[]',
  or5_tresor: 'Y2lwaGVy',
  or5_lang: 'fr',
  or5_beta_access: 'true',
  fremd_schluessel: 'bleibt',
};

const neu = () => ({
  local: new FakeStorage(ECHT),
  session: new FakeStorage({ or5_temp: '1', anderes: '2' }),
  idb: new FakeIDBFactory(['maloja-plana-documents', 'maloja-plana-backups', 'fremde-db']),
});

afterEach(() => {
  FakeStorage.prototype.setItem = ORIG_SET;
  FakeIDBFactory.prototype.open = ORIG_OPEN;
  FakeIDBFactory.prototype.deleteDatabase = ORIG_DELETE;
});

describe('E18 · Alle Daten auf diesem Gerät löschen', () => {
  it('löscht alle or5_-Schlüssel aus localStorage und sessionStorage — ausser dem Beta-Zugang', async () => {
    const { local, session, idb } = neu();
    const r = await alleDatenLoeschen({ local, session, idb });
    expect(r.geloescht).toBe(true);
    expect(r.fehler).toEqual([]);
    expect([...local._m.keys()].sort()).toEqual(['fremd_schluessel', 'or5_beta_access']);
    expect([...session._m.keys()]).toEqual(['anderes']);
    expect(BEHALTEN).toEqual(['or5_beta_access']);
  });

  it('löscht die IndexedDB-Datenbanken der App (Dokumente + Auto-Sicherungen), keine fremden', async () => {
    const { local, session, idb } = neu();
    await alleDatenLoeschen({ local, session, idb });
    expect([...idb.dbs]).toEqual(['fremde-db']);
    expect(APP_DATENBANKEN).toEqual(expect.arrayContaining(['maloja-plana-documents', 'maloja-plana-backups']));
  });

  it('sperrt danach Schreiben und neues Öffnen bis zum Neustart (Auto-Save kann nichts zurückschreiben)', async () => {
    const { local, session, idb } = neu();
    await alleDatenLoeschen({ local, session, idb });
    local.setItem('or5_data', '{"basis":{"firstName":"X"}}');
    expect(local.getItem('or5_data')).toBe(null);
    expect(() => idb.open('maloja-plana-backups')).toThrow();
    expect(idb.dbs.has('maloja-plana-backups')).toBe(false);
  });

  it('meldet einen Fehler ehrlich und löscht den Rest trotzdem', async () => {
    const local = new FakeStorage(ECHT);
    const session = new FakeStorage();
    const idb = new FakeIDBFactory(['maloja-plana-documents', 'maloja-plana-backups'], ['maloja-plana-documents']);
    const r = await alleDatenLoeschen({ local, session, idb });
    expect(r.geloescht).toBe(true);
    expect(r.fehler).toEqual(['maloja-plana-documents']);
    expect(idb.dbs.has('maloja-plana-backups')).toBe(false);
    expect(local.getItem('or5_data')).toBe(null);
  });

  it('im Beispiel-Modus: nichts Echtes wird angefasst (B-3)', async () => {
    const { local, session, idb } = neu();
    const vorher = JSON.stringify([...local._m.entries()]);
    const r = await alleDatenLoeschen({ demo: true, local, session, idb });
    expect(r.geloescht).toBe(false);
    expect(JSON.stringify([...local._m.entries()])).toBe(vorher);
    expect(session._m.size).toBe(2);
    expect(idb.dbs.size).toBe(3);
    // keine Schreibsperre im Beispiel — die App läuft normal weiter
    local.setItem('or5_theme', 'dark');
    expect(local.getItem('or5_theme')).toBe('dark');
  });

  it('Beispiel von der Code-Wand (Speicher-Schirm aktiv): auch ohne demo-Flag bleibt der echte Speicher unberührt', async () => {
    const { local, session, idb } = neu();
    const vorher = JSON.stringify([...local._m.entries()]);
    const freigeben = speicherAbschirmen(FakeStorage.prototype, FakeIDBFactory.prototype);
    try {
      const r = await alleDatenLoeschen({ local, session, idb });
      expect(r.fehler.length).toBeGreaterThan(0); // deleteDatabase wirft unter dem Schirm
    } finally {
      freigeben();
    }
    expect(JSON.stringify([...local._m.entries()])).toBe(vorher);
    expect(idb.dbs.size).toBe(3);
  });

  it('ohne verfügbaren Speicher (Privat-Modus): kein Absturz', async () => {
    const r = await alleDatenLoeschen({ local: null, session: null, idb: null });
    expect(r.geloescht).toBe(true);
    expect(r.fehler).toEqual([]);
  });
});

// R4 (Predeploy-Gate 16.09.): zwei offene Tabs. Der andere Tab könnte nach dem Löschen
// alte Daten zurückschreiben. Signal über das storage-Ereignis: «sperren» vor dem
// Löschen, «neu» danach; der Schlüssel wird sofort wieder entfernt.
describe('R4 · andere Maloja-Tabs benachrichtigen', () => {
  it('setzt LOESCH_SIGNAL «sperren» und «neu» (trotz eigener Schreibsperre) und entfernt ihn wieder', async () => {
    const { local, session, idb } = neu();
    await alleDatenLoeschen({ local, session, idb });
    const signale = (local.log || []).filter((e) => e[1] === LOESCH_SIGNAL);
    expect(signale).toEqual([
      ['set', LOESCH_SIGNAL, 'sperren'], ['remove', LOESCH_SIGNAL],
      ['set', LOESCH_SIGNAL, 'neu'], ['remove', LOESCH_SIGNAL],
    ]);
    expect(local.getItem(LOESCH_SIGNAL)).toBe(null);
    expect(LOESCH_SIGNAL.startsWith('or5_')).toBe(true);
  });

  it('im Beispiel: kein Signal', async () => {
    const { local, session, idb } = neu();
    await alleDatenLoeschen({ demo: true, local, session, idb });
    expect((local.log || []).some((e) => e[1] === LOESCH_SIGNAL)).toBe(false);
  });

  it('main.jsx hört auf denselben Schlüssel, sperrt das Schreiben und lädt bei «neu» neu', () => {
    const main = readFileSync(new URL('../main.jsx', import.meta.url), 'utf8');
    expect(main).toContain("addEventListener('storage'");
    expect(main).toContain("'" + LOESCH_SIGNAL + "'");
    expect(main).toMatch(/newValue === 'neu'/);
  });

  it('der Dialog bittet ruhig, andere Maloja-Fenster vorher zu schliessen', () => {
    const src = readFileSync(new URL('../components/DatenLoeschen.jsx', import.meta.url), 'utf8');
    expect(src).toContain("t('datenLoeschen.andereFenster')");
  });

  // Vorab-Prüfung 17.09.: kam «neu» nie an (löschender Tab geschlossen), blieb ein
  // anderer Tab still ohne Speichern. Jetzt lädt er nach einer Frist selbst neu —
  // und die Frist muss länger sein als das längste Löschen, sonst liest er alte Angaben.
  it('ein anderer Tab lädt auch ohne «neu» nach einer Frist neu, die länger ist als das Löschen', () => {
    const main = readFileSync(new URL('../main.jsx', import.meta.url), 'utf8');
    const quelle = readFileSync(new URL('../utils/datenLoeschen.js', import.meta.url), 'utf8');
    const frist = Number((main.match(/LOESCH_FRIST_MS = (\d+)/) || [])[1]);
    const proDb = Number((quelle.match(/setTimeout\(\(\) => resolve\(false\), (\d+)\)/) || [])[1]);
    expect(proDb).toBeGreaterThan(0);
    expect(frist).toBeGreaterThan(APP_DATENBANKEN.length * proDb);
    expect(main).toMatch(/else setTimeout\(\(\) => location\.reload\(\), LOESCH_FRIST_MS\)/);
    expect(main).toContain(`'${LOESCH_SIGNAL}'`);
  });
});
