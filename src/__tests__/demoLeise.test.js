import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { speicherAbschirmen, demoVerlassen } from '../demo/demoSpeicher.js';

// K25 · Demo leiser machen. Live beobachtet (15.09.2026, spätabends): nach «Ohne Code
// ausprobieren» stehen zwei Fehler in der Konsole, und nach «Beispiel verlassen»
// bleibt die letzte Ansicht in der Adresse (z. B. #/export).

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
  open() { throw new Error('nicht erwartet: IndexedDB ohne Schirm geöffnet'); }
  deleteDatabase() { throw new Error('nicht erwartet'); }
  databases() { return Promise.resolve([]); }
}

describe('K25 · woher die zwei Konsolen-Fehler kommen (Nachstellen)', () => {
  let freigeben;
  beforeEach(() => {
    globalThis.localStorage = new FakeStorage({ or5_data: JSON.stringify({ basis: { canton: 'BS' } }), or5_docs: '[]' });
    globalThis.indexedDB = new FakeIDBFactory();
    freigeben = speicherAbschirmen(FakeStorage.prototype, FakeIDBFactory.prototype);
  });
  afterEach(() => {
    freigeben();
    delete globalThis.localStorage;
    delete globalThis.indexedDB;
    vi.restoreAllMocks();
  });

  it('das Auto-Backup unter dem Schirm schreibt genau «IDB getAllKeys error» und «[backup] Failed»', async () => {
    const fehler = vi.spyOn(console, 'error').mockImplementation(() => {});
    const vorher = JSON.stringify([...globalThis.localStorage._m.entries()]);
    const { createBackup } = await import('../utils/autoBackup.js');
    const ergebnis = await createBackup();
    expect(ergebnis.success).toBe(false);
    const zeilen = fehler.mock.calls.map((c) => c[0]);
    expect(zeilen).toEqual(['IDB getAllKeys error:', '[backup] Failed:']);
    // Der Schirm hält: der echte Speicher ist unverändert.
    expect(JSON.stringify([...globalThis.localStorage._m.entries()])).toBe(vorher);
  });
});

describe('K25 · die Demo von der Code-Wand startet das Auto-Backup gar nicht', () => {
  const quelle = fs.readFileSync(path.resolve(__dirname, '../main.jsx'), 'utf8');

  it('der Backup-Effekt kehrt in der Demo still zurück, bevor autoBackup geladen wird', () => {
    const effekt = quelle.match(/useEffect\(\(\) => \{\s*if \(demo\) return;[^]*?import\('\.\/utils\/autoBackup\.js'\)/);
    expect(effekt).not.toBeNull();
  });
});

describe('K25 · Verlassen setzt die Adresse auf den Einstieg zurück', () => {
  const fakeOrt = (hash) => {
    const schritte = [];
    const loc = {
      pathname: '/', search: '?lang=fr', hash,
      reload: () => schritte.push(['reload']),
    };
    const hist = { replaceState: (_s, _t, url) => schritte.push(['replaceState', url]) };
    return { loc, hist, schritte };
  };

  it('ohne die letzte Ansicht (#/export), mit Sprache, dann neu laden', () => {
    const { loc, hist, schritte } = fakeOrt('#/export');
    demoVerlassen(loc, hist);
    expect(schritte).toEqual([['replaceState', '/?lang=fr'], ['reload']]);
  });

  it('als Klick-Handler: das Klick-Ereignis wird nicht als Adresse gelesen (Fix 17.09.2026)', () => {
    const { loc, hist, schritte } = fakeOrt('#/notfall');
    vi.stubGlobal('location', loc);
    vi.stubGlobal('history', hist);
    try {
      const klick = { type: 'click', target: {}, preventDefault() {} };
      demoVerlassen(klick);
      expect(schritte).toEqual([['replaceState', '/?lang=fr'], ['reload']]);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('der Banner-Knopf reicht das Klick-Ereignis nicht an onLeave weiter', () => {
    const main = fs.readFileSync(path.resolve(__dirname, '../main.jsx'), 'utf8');
    expect(main).not.toMatch(/onClick: demo \? demo\.onLeave\b/);
    expect(main).toMatch(/onClick: demo \? \(\) => demo\.onLeave\(\)/);
  });

  it('BetaGate reicht genau diese Funktion als onLeave weiter', () => {
    const gate = fs.readFileSync(path.resolve(__dirname, '../BetaGate.jsx'), 'utf8');
    expect(gate).toMatch(/onLeave: s\.demoVerlassen/);
    expect(gate).not.toMatch(/onLeave: \(\) => location\.reload\(\)/);
  });
});
