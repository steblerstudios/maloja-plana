// Ein Name je Seite (23.10.2026). Dieselbe Seite hiess unten «Anspruch», im Rucksack
// «Was steht mir zu?» und als Titel «Lebenssituationen»; der Kalender hiess im Menü
// «Was ansteht», in der Suche «Kalender». Wächter: jede Stelle liest denselben Schlüssel.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { ansichtName } from '../config/ansichtenRegister.js';
import { WERKZEUGE } from '../data/werkzeugRegister.js';

const lies = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');

const NAME = {
  situationen: 'dashboard.anspruchTitle',
  calendar: 'nav.wasAnsteht',
  gepaeck: 'nav.rucksack',
};

describe('Ein Name je Seite', () => {
  it('«Zurück zu …» und Suche nennen die Seite wie Menü und Leiste', () => {
    for (const [view, key] of Object.entries(NAME)) expect(ansichtName(view), view).toBe(key);
    for (const w of WERKZEUGE.filter((w) => NAME[w.view])) expect(w.nav, w.view).toBe(NAME[w.view]);
  });

  it('Seitentitel, Leiste und Menü lesen denselben Schlüssel', () => {
    expect(lies('Lebenssituationen.jsx')).toContain("t('dashboard.anspruchTitle')");
    expect(lies('CalendarReminders.jsx')).toContain("t('nav.wasAnsteht')");
    expect(lies('Gepaeck.jsx')).toContain("t('nav.rucksack')");
    expect(lies('main.jsx')).toContain("key: 'situationen', label: t('dashboard.anspruchTitle')");
    expect(lies('main.jsx')).toContain("key: 'gepaeck', label: t('nav.rucksack')");
  });

  it('die alten Zweitnamen sind weg', () => {
    for (const f of ['main.jsx', 'Dashboard.jsx', 'MobileNav.jsx', 'MerklisteView.jsx', 'Gepaeck.jsx',
      'CalendarReminders.jsx', 'Lebenssituationen.jsx', 'config/ansichtenRegister.js', 'data/werkzeugRegister.js']) {
      const s = lies(f);
      for (const alt of ["'nav.anspruch'", "'nav.calendar'", "'calendar.title'", "'gepaeck.title'", "'lebenszustaende.pageTitle'"]) {
        expect(s.includes(alt), f + ' ' + alt).toBe(false);
      }
    }
  });
});
