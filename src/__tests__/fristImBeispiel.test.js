import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Review 14.10.2026 (PR #498): «Frist sichern» rief addReminder ohne Blick auf den Modus.
// addReminder schreibt direkt in localStorage (or5_reminders). Der Speicher-Schirm
// (demo/demoSpeicher.js) liegt nur über der Demo von der Code-Wand — das «Beispiel» aus
// der App (Fuss-Link, Dashboard) und das Ausprobieren (Probe) haben keinen. Dort legte der
// Knopf eine ECHTE Erinnerung in den echten Kalender, während der Banner sagt, es bleibe
// nichts. Wie GespeichertZeile: vorläufig heisst nichts dauerhaft.

// Minimaler localStorage-Stub (Tests laufen im node-Env ohne DOM).
let store;
beforeEach(() => {
  store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
});

const reminder = { title: 'Krankenkasse kündigen', dueDate: '2026-11-30', category: 'insurance', recurrence: 'once' };
const SRC = path.join(__dirname, '..');
const lies = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');

describe('Frist sichern im Beispiel und beim Ausprobieren', () => {
  it('vorläufig: keine Erinnerung im echten Speicher, kein Folge-Eintrag (onSaved)', async () => {
    const { fristSichern } = await import('../AblaufSchale.jsx');
    let folge = 0;
    expect(fristSichern(reminder, { vorlaeufig: true, onSaved: () => { folge++; } })).toBe('vorlaeufig');
    expect(store.or5_reminders).toBeUndefined();
    expect(folge).toBe(0);
  });

  it('echt: die Erinnerung landet im Kalender und onSaved läuft', async () => {
    const { fristSichern } = await import('../AblaufSchale.jsx');
    let folge = 0;
    expect(fristSichern(reminder, { vorlaeufig: false, onSaved: () => { folge++; } })).toBe('gespeichert');
    expect(JSON.parse(store.or5_reminders)).toHaveLength(1);
    expect(folge).toBe(1);
  });

  it('echt, Speichern scheitert: kein ✓ und kein Folge-Eintrag', async () => {
    const { fristSichern } = await import('../AblaufSchale.jsx');
    globalThis.localStorage.setItem = () => { throw new Error('QuotaExceeded'); };
    let folge = 0;
    expect(fristSichern(reminder, { vorlaeufig: false, onSaved: () => { folge++; } })).toBeNull();
    expect(folge).toBe(0);
  });

  it('main.jsx reicht `vorlaeufig` an die Abläufe, der Frist-Knopf liest es', () => {
    expect(lies('main.jsx')).toMatch(/VorlaeufigContext\.Provider, \{ value: vorlaeufig \}/);
    const schale = lies('AblaufSchale.jsx');
    expect(schale).toMatch(/useVorlaeufig\(\)/);
    // Der Knopf geht nur noch über fristSichern, nie direkt an addReminder vorbei.
    expect(schale).not.toMatch(/if \(addReminder\(reminder\)\)/);
  });
});
