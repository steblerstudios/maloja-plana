import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { VorlaeufigContext } from '../hooks/vorlaeufigContext.js';

// Wie erinnerungImBeispiel.test.js, für die Merkliste (or5_merkliste), Entscheid Stebler
// Studios 18.10.2026: im Beispiel und beim Ausprobieren legen Umzug und Prämienverbilligung
// keine echten Merkpunkte an; die Merkliste beginnt dort leer, speichert nie, und die echten
// Punkte bleiben unsichtbar und unberührt.

let store;
beforeEach(() => {
  store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
});

const todo = { text: 'Adresse ändern: Bank', link: 'briefe' };
const SRC = path.join(__dirname, '..');
const lies = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');

describe('merkpunktSichern', () => {
  it('vorläufig: nichts in der echten Merkliste', async () => {
    const { merkpunktSichern } = await import('../utils/merkliste.js');
    expect(merkpunktSichern(todo, true)).toBe('vorlaeufig');
    expect(store.or5_merkliste).toBeUndefined();
  });
  it('echt: Merkpunkt angelegt', async () => {
    const { merkpunktSichern } = await import('../utils/merkliste.js');
    expect(merkpunktSichern(todo, false)).toBe('gespeichert');
    expect(JSON.parse(store.or5_merkliste)).toHaveLength(1);
  });
});

describe('die Knöpfe gehen nur noch über merkpunktSichern', () => {
  for (const f of ['UmzugAblauf.jsx', 'PremiumSubsidy.jsx']) {
    it(f, () => {
      const s = lies(f);
      expect(s).toMatch(/merkpunktSichern\(/);
      expect(s).not.toMatch(/\baddTodo\(/);
      expect(s).toMatch(/useVorlaeufig\(\)/);
    });
  }
});

describe('Merkliste im Beispiel', () => {
  const t = createT({ de }, 'de', 'sie');
  const palette = new Proxy({}, { get: () => '#888888' });
  const echt = [{ id: 'm1', text: 'Echter Merkpunkt', link: null, done: false }];
  const render = async (vorlaeufig) => {
    const { MerklisteView } = await import('../MerklisteView.jsx');
    return renderToStaticMarkup(React.createElement(VorlaeufigContext.Provider, { value: vorlaeufig },
      React.createElement(MerklisteView, { palette, t, onNavigate: () => {} })));
  };

  it('echt: die eigenen Punkte stehen da', async () => {
    store.or5_merkliste = JSON.stringify(echt);
    expect(await render(false)).toContain('Echter Merkpunkt');
  });
  it('vorläufig: die echten Punkte bleiben unsichtbar', async () => {
    store.or5_merkliste = JSON.stringify(echt);
    expect(await render(true)).not.toContain('Echter Merkpunkt');
  });
  it('vorläufig: speichert nie; ein Moduswechsel hängt sie neu ein', () => {
    expect(lies('MerklisteView.jsx')).toMatch(/if \(vorlaeufig\) return;/);
    // Seit 27.10.2026 (F7-L10) ein Reiter in «Was ansteht»: der Kalender hängt beim Moduswechsel neu ein
    // und führt die Liste für beide Reiter (gespeichert nur dort, nie im Beispiel).
    expect(lies('main.jsx')).toMatch(/React\.createElement\(CalendarReminders, \{ key: datenModus,/);
    expect(lies('CalendarReminders.jsx')).toContain('React.createElement(MerklisteView, { palette, t, onNavigate, punkte: todos, aendere: aendereTodos })');
    expect(lies('CalendarReminders.jsx')).toMatch(/if \(!vorlaeufig\) saveTodos\(neu\)/);
  });
});
