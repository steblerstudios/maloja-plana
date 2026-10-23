import { describe, it, expect, beforeEach } from 'vitest';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { loadTodos, merkpunktSichern, merkpunktUmschalten } from '../utils/merkliste.js';
import { ipvErinnerung } from '../data/ipvErinnerung.js';

// Zusammenspiel IPV «Jährlich erinnern» (#543) mit dem Merkpunkt-Modell aus #544:
// die jährliche Aufgabe kommt mit Tag und Wiederholung auf der Merkliste an.

let store;
beforeEach(() => {
  store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
});

const t = createT(de, 'sie');

describe('IPV «Jährlich erinnern» auf der Merkliste', () => {
  it('speichert Tag und Wiederholung', () => {
    expect(merkpunktSichern(ipvErinnerung(t, '2026-03-15'), false)).toBe('gespeichert');
    const [punkt] = loadTodos();
    expect(punkt).toMatchObject({ link: 'premium', tag: '2027-03-15', wiederholung: 'jaehrlich', done: false });
  });

  it('legt beim Abhaken die Aufgabe fürs Folgejahr an', () => {
    merkpunktSichern(ipvErinnerung(t, '2026-03-15'), false);
    const [punkt] = loadTodos();
    const danach = merkpunktUmschalten(loadTodos(), punkt.id, '2027-03-20');
    expect(danach.find(i => !i.done)).toMatchObject({ tag: '2028-03-15', wiederholung: 'jaehrlich' });
  });

  it('legt im Beispiel nichts ab', () => {
    expect(merkpunktSichern(ipvErinnerung(t, '2026-03-15'), true)).toBe('vorlaeufig');
    expect(loadTodos()).toEqual([]);
  });
});
