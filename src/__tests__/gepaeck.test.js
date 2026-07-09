import { describe, it, expect } from 'vitest';
import { GEGENSTAENDE, alleWege, wegeCount, gegenstandReadiness } from '../data/gepaeck.js';
import { DEMO_DATA } from '../config/demoData.js';
import { VALID_VIEWS } from '../utils/hashRouter.js';

// Das Gepäck verlinkt jeden Weg in einen bestehenden geführten Ablauf. Diese Tests
// halten die Registry ehrlich: keine toten Links, keine doppelten Schlüssel, echte Zahlen.

describe('Gepäck-Registry', () => {
  it('jeder Weg zeigt auf eine gültige View', () => {
    for (const w of alleWege()) {
      expect(VALID_VIEWS.has(w.view), `Weg "${w.key}" → unbekannte View "${w.view}"`).toBe(true);
    }
  });

  it('alle Gegenstands- und Weg-Schlüssel sind eindeutig', () => {
    const objKeys = GEGENSTAENDE.map((g) => g.key);
    expect(new Set(objKeys).size).toBe(objKeys.length);
    const wegKeys = alleWege().map((w) => w.key);
    expect(new Set(wegKeys).size).toBe(wegKeys.length);
  });

  it('jeder Weg hat mindestens einen Glyph-Pfad', () => {
    for (const w of alleWege()) {
      expect(Array.isArray(w.g) && w.g.length > 0, `Weg "${w.key}" ohne Glyph`).toBe(true);
    }
  });

  it('Reife-Pünktchen: leere Daten = nichts gepackt', () => {
    for (const g of GEGENSTAENDE) {
      const r = gegenstandReadiness(g.key, {});
      expect(r.total).toBeGreaterThan(0);
      expect(r.done).toBe(0);
    }
  });

  it('Reife-Pünktchen: Demo-Daten füllen ehrlich (done>0, nie über total)', () => {
    for (const g of GEGENSTAENDE) {
      const r = gegenstandReadiness(g.key, DEMO_DATA);
      expect(r.done).toBeGreaterThan(0);
      expect(r.done).toBeLessThanOrEqual(r.total);
    }
    // Ja/Nein-Feld: willMade:'no' zählt NICHT als gepackt.
    const abschiedNo = gegenstandReadiness('abschied', { behoerden: { willMade: 'no' }, notfall: {} });
    expect(abschiedNo.done).toBe(0);
    const abschiedYes = gegenstandReadiness('abschied', { behoerden: { willMade: 'yes' }, notfall: {} });
    expect(abschiedYes.done).toBe(1);
  });

  it('wegeCount zählt echt', () => {
    expect(wegeCount('wohnen')).toBe(4);
    expect(wegeCount('abschied')).toBe(2);
    expect(wegeCount('gibtsnicht')).toBe(0);
    expect(alleWege().length).toBe(GEGENSTAENDE.reduce((n, g) => n + g.wege.length, 0));
  });
});
