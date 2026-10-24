import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createT } from '../i18n/index.js';
import de from '../i18n/de.js';
import { VorlaeufigContext } from '../hooks/vorlaeufigContext.js';

// Nachzug zu fristImBeispiel.test.js (Entscheid Stebler Studios 18.10.2026): auch die übrigen
// Erinnerungs-Knöpfe (KVG-Leistungen, Briefe, Prämienverbilligung) und der Kalender selbst
// schreiben im Beispiel und beim Ausprobieren nichts in den echten Kalender (or5_reminders).
// Der Kalender beginnt dort leer; was man einträgt, liegt nur im Arbeitsspeicher und fällt
// beim Verlassen weg. Die echten Erinnerungen bleiben unsichtbar und unberührt.

let store;
beforeEach(() => {
  store = {};
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
  };
});

const reminder = { title: 'Belege einreichen', dueDate: '2026-12-31', category: 'health' };
const SRC = path.join(__dirname, '..');
const lies = (f) => fs.readFileSync(path.join(SRC, f), 'utf8');

describe('erinnerungSichern — eine Entscheidung für alle Erinnerungs-Knöpfe', () => {
  it('vorläufig: nichts im echten Speicher', async () => {
    const { erinnerungSichern } = await import('../utils/reminders.js');
    expect(erinnerungSichern(reminder, true)).toBe('vorlaeufig');
    expect(store.or5_reminders).toBeUndefined();
  });
  it('echt: Erinnerung angelegt', async () => {
    const { erinnerungSichern } = await import('../utils/reminders.js');
    expect(erinnerungSichern(reminder, false)).toBe('gespeichert');
    expect(JSON.parse(store.or5_reminders)).toHaveLength(1);
  });
  it('echt, Speichern scheitert: null (kein falsches ✓)', async () => {
    const { erinnerungSichern } = await import('../utils/reminders.js');
    globalThis.localStorage.setItem = () => { throw new Error('QuotaExceeded'); };
    expect(erinnerungSichern(reminder, false)).toBeNull();
  });
});

describe('die Knöpfe gehen nur noch über erinnerungSichern', () => {
  // PremiumSubsidy.jsx fehlt hier seit Fassung 5 (23.10.2026): «Jährlich erinnern» legt eine
  // jährliche Aufgabe auf die Merkliste (merkpunktSichern, geprüft in merklisteImBeispiel.test.js)
  // statt einer Kalender-Erinnerung. Kein addReminder ist weiter Pflicht:
  it('PremiumSubsidy.jsx schreibt keine Kalender-Erinnerung an erinnerungSichern vorbei', () => {
    expect(lies('PremiumSubsidy.jsx')).not.toMatch(/\baddReminder\(/);
  });
  for (const f of ['KVGLeistungen.jsx', 'BriefGenerator.jsx', 'AblaufSchale.jsx']) {
    it(f, () => {
      const s = lies(f);
      expect(s).toMatch(/erinnerungSichern\(/);
      expect(s).not.toMatch(/\baddReminder\(/);
    });
  }
  it('drei Ansichten lesen den Modus selbst', () => {
    for (const f of ['KVGLeistungen.jsx', 'BriefGenerator.jsx', 'PremiumSubsidy.jsx']) {
      expect(lies(f), f).toMatch(/useVorlaeufig\(\)/);
    }
  });
});

describe('Kalender im Beispiel', () => {
  const t = createT({ de }, 'de', 'sie');
  const palette = new Proxy({}, { get: () => '#888888' });
  const echt = [{ id: '1', title: 'Echter Zahnarzttermin', dueDate: '2099-01-15', category: 'health', recurrence: 'once', notes: '', done: false, completedDate: null, createdDate: '2026-10-01' }];
  const render = async (vorlaeufig) => {
    const { CalendarReminders } = await import('../CalendarReminders.jsx');
    return renderToStaticMarkup(React.createElement(VorlaeufigContext.Provider, { value: vorlaeufig },
      React.createElement(CalendarReminders, { palette, t, data: {}, onNavigate: () => {}, isMobile: false })));
  };

  it('echt: die eigenen Erinnerungen stehen da', async () => {
    store.or5_reminders = JSON.stringify(echt);
    expect(await render(false)).toContain('Echter Zahnarzttermin');
  });
  it('vorläufig: die echten Erinnerungen bleiben unsichtbar', async () => {
    store.or5_reminders = JSON.stringify(echt);
    expect(await render(true)).not.toContain('Echter Zahnarzttermin');
  });
  it('vorläufig: der Kalender speichert nie; ein Moduswechsel hängt ihn neu ein', () => {
    const s = lies('CalendarReminders.jsx');
    expect(s).toMatch(/if \(!vorlaeufig\) saveReminders\(reminders\)/);
    // Ohne neuen key hielte der Kalender nach «Beispiel verlassen» die Beispiel-Liste
    // und schriebe sie über die echten Erinnerungen (wie beim Schuldenmanager, 27.09.2026).
    expect(lies('main.jsx')).toMatch(/React\.createElement\(CalendarReminders, \{ key: datenModus,/);
  });
});

describe('Überfällig-Banner im Beispiel (Dashboard)', () => {
  // Im Browser belegt 18.10.2026: im Beispiel stand «1 Erinnerungen brauchen Aufmerksamkeit» —
  // die ECHTE überfällige Frist, während der Kalender dort leer beginnt.
  const t = createT({ de }, 'de', 'sie');
  const palette = new Proxy({}, { get: () => '#888888' });
  const echt = [{ id: '1', title: 'Echte überfällige Frist', dueDate: '2020-01-10', category: 'admin', recurrence: 'once', notes: '', done: false, completedDate: null, createdDate: '2020-01-01' }];
  const render = async (vorlaeufig) => {
    const { OverdueBanner } = await import('../OverdueBanner.jsx');
    return renderToStaticMarkup(React.createElement(VorlaeufigContext.Provider, { value: vorlaeufig },
      React.createElement(OverdueBanner, { palette, t, onNavigate: () => {} })));
  };
  it('echt: der Banner meldet die überfällige Frist', async () => {
    store.or5_reminders = JSON.stringify(echt);
    expect(await render(false)).toContain('aria-label');
  });
  it('vorläufig: kein Banner aus den echten Erinnerungen', async () => {
    store.or5_reminders = JSON.stringify(echt);
    expect(await render(true)).toBe('');
  });
});

// Beispiel lebendiger (Sophie 24.10.2026): nur das Beispiel Maria beginnt mit ein paar Terminen.
// Beim Ausprobieren bleibt der Kalender leer; gespeichert wird in beiden nichts (Test oben).
describe('Kalender: Beispieleinträge nur im Beispiel', () => {
  const t = createT({ de }, 'de', 'sie');
  const palette = new Proxy({}, { get: () => '#888888' });
  const render = async (vorlaeufig, beispiel) => {
    const { CalendarReminders } = await import('../CalendarReminders.jsx');
    return renderToStaticMarkup(React.createElement(VorlaeufigContext.Provider, { value: vorlaeufig },
      React.createElement(CalendarReminders, { palette, t, data: {}, onNavigate: () => {}, beispiel })));
  };
  it('Beispiel: Marias Termine stehen da, die echten nicht', async () => {
    store.or5_reminders = JSON.stringify([{ id: '1', title: 'Echter Zahnarzttermin', dueDate: '2099-01-15', category: 'health', recurrence: 'once', done: false }]);
    const html = await render(true, true);
    expect(html).toContain(de.calendar.beispiel.velo);
    expect(html).not.toContain('Echter Zahnarzttermin');
  });
  it('Ausprobieren: leer, keine Beispieltermine', async () => {
    expect(await render(true, false)).not.toContain(de.calendar.beispiel.velo);
  });
  it('echt: nie Beispieltermine', async () => {
    expect(await render(false, true)).not.toContain(de.calendar.beispiel.velo);
  });
});
