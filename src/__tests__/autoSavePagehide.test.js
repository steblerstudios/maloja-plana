// B4 · Voll-Audit 10/2026: Wer innert 5 s den Tab schliesst, die iOS-App wegwischt
// oder neu lädt, verliert die letzte Eingabe nicht mehr; wer ohne Pause tippt,
// speichert trotzdem spätestens nach der Höchstwartezeit.
//
// Kein DOM-Test (vitest ohne jsdom, siehe zweiTabs.test.js). Belegt sind darum:
//   1. die Speicherfunktion selbst (utils/autoSave.js) an einem Ersatz-Speicher,
//   2. ein simuliertes `pagehide` / `visibilitychange` an echten EventTargets,
//      mit Uhr unter 5 s — der Ruhe-Takt hat da noch nie geschrieben,
//   3. Wächter an der Aufrufstelle in main.jsx.
import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  speichereFallsOffen, beimVerlassenSpeichern, hoechstWarteRest,
  AUTOSAVE_RUHE_MS, AUTOSAVE_HOECHST_MS,
} from '../utils/autoSave.js';

const lies = (p) => fs.readFileSync(path.resolve(__dirname, '..', p), 'utf8');

const ersatzSpeicher = () => {
  const m = new Map();
  return { m, setItem: (k, v) => m.set(k, String(v)), getItem: (k) => (m.has(k) ? m.get(k) : null) };
};

// Baut den Ablauf aus main.jsx nach: Ruhe-Takt + Verlassen, dieselbe Speicherfunktion.
const aufbauen = ({ fremdGeaendert = false } = {}) => {
  const storage = ersatzSpeicher();
  const fenster = new EventTarget();
  const dokument = new EventTarget();
  dokument.visibilityState = 'visible';
  const alt = { person: { firstName: 'Alt' } };
  const zuletzt = { data: alt, docs: [] };
  const neu = { person: { firstName: 'Neu' } };
  const speichern = () => speichereFallsOffen({ storage, data: neu, documents: [], zuletzt, fremdGeaendert });
  const timer = setInterval(speichern, AUTOSAVE_RUHE_MS);
  const abmelden = beimVerlassenSpeichern(fenster, dokument, speichern);
  return { storage, fenster, dokument, aufraeumen: () => { clearInterval(timer); abmelden(); } };
};

afterEach(() => { vi.useRealTimers(); });

describe('B4 · sofort speichern beim Verlassen', () => {
  it('pagehide nach 1 s → der Stand liegt im Speicher', () => {
    vi.useFakeTimers();
    const { storage, fenster, aufraeumen } = aufbauen();
    vi.advanceTimersByTime(1000);
    expect(storage.getItem('or5_data')).toBeNull(); // Ruhe-Takt hat noch nicht geschrieben
    fenster.dispatchEvent(new Event('pagehide'));
    expect(JSON.parse(storage.getItem('or5_data'))).toEqual({ person: { firstName: 'Neu' } });
    expect(storage.getItem('or5_docs')).toBe('[]');
    aufraeumen();
  });

  it('visibilitychange → hidden speichert, → visible nicht', () => {
    vi.useFakeTimers();
    const { storage, dokument, aufraeumen } = aufbauen();
    dokument.dispatchEvent(new Event('visibilitychange'));
    expect(storage.getItem('or5_data')).toBeNull();
    dokument.visibilityState = 'hidden';
    dokument.dispatchEvent(new Event('visibilitychange'));
    expect(storage.getItem('or5_data')).not.toBeNull();
    aufraeumen();
  });

  it('nach fremder Änderung (K116) schreibt auch pagehide nicht', () => {
    vi.useFakeTimers();
    const { storage, fenster, dokument, aufraeumen } = aufbauen({ fremdGeaendert: true });
    fenster.dispatchEvent(new Event('pagehide'));
    dokument.visibilityState = 'hidden';
    dokument.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(AUTOSAVE_HOECHST_MS);
    expect(storage.m.size).toBe(0);
    aufraeumen();
  });

  it('abmelden entfernt beide Zuhörer', () => {
    const storage = ersatzSpeicher();
    const fenster = new EventTarget();
    const dokument = new EventTarget();
    dokument.visibilityState = 'hidden';
    const speichern = vi.fn();
    beimVerlassenSpeichern(fenster, dokument, speichern)();
    fenster.dispatchEvent(new Event('pagehide'));
    dokument.dispatchEvent(new Event('visibilitychange'));
    expect(speichern).not.toHaveBeenCalled();
    expect(storage.m.size).toBe(0);
  });
});

describe('B4 · speichereFallsOffen', () => {
  it('schreibt nur, wenn sich etwas geändert hat, und rückt dann vor', () => {
    const storage = ersatzSpeicher();
    const data = { a: 1 };
    const zuletzt = { data: null, docs: null };
    expect(speichereFallsOffen({ storage, data, documents: [], zuletzt, fremdGeaendert: false }).status).toBe('gespeichert');
    expect(zuletzt.data).toBe(data);
    storage.m.clear();
    expect(speichereFallsOffen({ storage, data, documents: zuletzt.docs, zuletzt, fremdGeaendert: false }).status).toBe('unveraendert');
    expect(storage.m.size).toBe(0);
  });

  it('bei Fehler (Quota) bleibt der alte Stand als «zuletzt» — nächste Runde versucht es neu', () => {
    const storage = { setItem: () => { const e = new Error('voll'); e.name = 'QuotaExceededError'; throw e; } };
    const alt = { a: 0 };
    const zuletzt = { data: alt, docs: [] };
    const r = speichereFallsOffen({ storage, data: { a: 1 }, documents: [], zuletzt, fremdGeaendert: false });
    expect(r.status).toBe('fehler');
    expect(r.fehler.name).toBe('QuotaExceededError');
    expect(zuletzt.data).toBe(alt);
  });

  it('nach dem Löschweg (setItem auf dem Prototyp gesperrt) bleibt der Speicher leer', () => {
    class Speicher { constructor() { this.m = new Map(); } setItem(k, v) { this.m.set(k, v); } }
    const storage = new Speicher();
    Object.getPrototypeOf(storage).setItem = function () {};
    speichereFallsOffen({ storage, data: { a: 1 }, documents: [], zuletzt: { data: null, docs: null }, fremdGeaendert: false });
    expect(storage.m.size).toBe(0);
  });
});

describe('B4 · Höchstwartezeit bei Dauertippen', () => {
  it('rechnet ab der ersten offenen Änderung, nicht ab der letzten', () => {
    expect(hoechstWarteRest(1000, 1000)).toBe(AUTOSAVE_HOECHST_MS);
    expect(hoechstWarteRest(1000, 1000 + 29000)).toBe(1000);
    expect(hoechstWarteRest(1000, 1000 + 40000)).toBe(0);
  });

  it('Takt neu bei jeder Änderung: ohne Höchstwartezeit nie gespeichert, mit ihr nach 30 s', () => {
    vi.useFakeTimers();
    const storage = ersatzSpeicher();
    const zuletzt = { data: null, docs: null };
    const erste = Date.now();
    let aufraeumen = () => {};
    // Jede Sekunde ein Tastendruck → neuer Stand, Effekt läuft neu (wie in main.jsx).
    for (let i = 0; i < 31; i++) {
      aufraeumen();
      const data = { n: i };
      const speichern = () => speichereFallsOffen({ storage, data, documents: [], zuletzt, fremdGeaendert: false });
      const timer = setInterval(speichern, AUTOSAVE_RUHE_MS);
      const hoechst = setTimeout(speichern, hoechstWarteRest(erste, Date.now()));
      aufraeumen = () => { clearInterval(timer); clearTimeout(hoechst); };
      if (i < 29) { vi.advanceTimersByTime(1000); expect(storage.getItem('or5_data')).toBeNull(); }
      else vi.advanceTimersByTime(1000);
    }
    aufraeumen();
    expect(storage.getItem('or5_data')).not.toBeNull();
  });
});

describe('B4 · main.jsx hängt alle drei Auslöser an dieselbe Speicherfunktion', () => {
  const main = lies('main.jsx');
  const effekt = main.slice(main.indexOf('const ersteOffeneAenderung'), main.indexOf('const updateData ='));

  it('Ruhe-Takt, Höchstwartezeit und Verlassen rufen `speichern`', () => {
    expect(effekt).toMatch(/setInterval\(speichern, AUTOSAVE_RUHE_MS\)/);
    expect(effekt).toMatch(/setTimeout\(speichern, hoechstWarteRest\(/);
    expect(effekt).toMatch(/beimVerlassenSpeichern\(window, document, speichern\)/);
  });

  it('räumt alle drei beim Neustart des Effekts ab', () => {
    expect(effekt).toMatch(/clearInterval\(timer\)/);
    expect(effekt).toMatch(/clearTimeout\(hoechst\)/);
    expect(effekt).toMatch(/abmelden\(\)/);
    expect(effekt).toMatch(/\}, \[data, documents, fremdGeaendert\]\);/);
  });

  it('schreibt über den echten localStorage zur Aufrufzeit (Löschsperre greift)', () => {
    expect(effekt).toMatch(/speichereFallsOffen\(\{ storage: localStorage,/);
  });
});
