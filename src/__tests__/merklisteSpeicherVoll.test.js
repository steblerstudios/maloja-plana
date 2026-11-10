// Bugsuche 09.11.2026, B-12 · Die Merkliste meldet «gespeichert» nur, wenn gespeichert wurde.
// Vorher wertete addTodo die Rückgabe von saveTodos nicht aus: bei vollem Speicher kam der
// Punkt trotzdem zurück, merkpunktSichern meldete 'gespeichert'. Der Kalender macht es seit
// jeher richtig (addReminder → saveReminders(...) ? reminder : null).
import { describe, it, expect, beforeEach } from 'vitest';

let voll;
beforeEach(() => {
  voll = false;
  const store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => {
      if (voll) throw Object.assign(new Error('Speicher voll'), { name: 'QuotaExceededError' });
      store[k] = String(v);
    },
    removeItem: (k) => { delete store[k]; },
  };
});

describe('Merkliste bei vollem Speicher', () => {
  it('addTodo gibt null zurück, wenn das Speichern scheitert', async () => {
    const { addTodo } = await import('../utils/merkliste.js');
    voll = true;
    expect(addTodo({ text: 'Police ablegen' })).toBeNull();
  });

  it('merkpunktSichern und aufgabeAnlegen melden dann kein «gespeichert»', async () => {
    const { merkpunktSichern, aufgabeAnlegen } = await import('../utils/merkliste.js');
    voll = true;
    expect(merkpunktSichern({ text: 'IPV beantragen' }, false)).toBeNull();
    expect(aufgabeAnlegen({ text: 'IPV jährlich', tag: '2027-01-15' }, false)).toBeNull();
  });

  it('mit Platz bleibt es beim Erfolg', async () => {
    const { merkpunktSichern } = await import('../utils/merkliste.js');
    expect(merkpunktSichern({ text: 'Steuererklärung' }, false)).toBe('gespeichert');
  });
});
