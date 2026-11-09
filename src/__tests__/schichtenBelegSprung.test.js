// Drei Schichten (Brand Book §8, 09.11.2026): Ein «Zurück zum Text»-Link aus
// dem Quellenverzeichnis darf nicht in zugeklappten Text springen. Ob ein
// Browser <details> beim Sprung aufklappt, ist nicht überall belegt (Safari
// ungeprüft). Darum zeigt der Link dann auf die Überschrift des Abschnitts,
// die immer sichtbar ist.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zugeklappteIds } from './_schichten.js';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SEITEN = ['krankenkasse', 'politsystem', 'kantone-im-vergleich']
  .map((p) => path.resolve(WURZEL, 'public', p, 'index.html'))
  .filter((f) => fs.existsSync(f) && fs.readFileSync(f, 'utf8').includes('class="schicht-mehr"'));

describe('Zurück-Links zeigen nie in zugeklappten Text', () => {
  it('es gibt Seiten mit Schichten zu prüfen', () => expect(SEITEN.length).toBeGreaterThan(0));
  for (const f of SEITEN) {
    it(path.basename(path.dirname(f)), () => {
      const html = fs.readFileSync(f, 'utf8');
      const zu = zugeklappteIds(html);
      const ziele = [...html.matchAll(/<p class="q-zurueck">([\s\S]*?)<\/p>/g)]
        .flatMap((p) => [...p[1].matchAll(/href="#([^"]+)"/g)].map((m) => m[1]));
      expect(ziele.length).toBeGreaterThan(0);
      expect(ziele.filter((z) => zu.has(z))).toEqual([]);
      // Jedes Ziel muss es auf der Seite geben.
      for (const z of ziele) expect(html.includes(`id="${z}"`), z).toBe(true);
    });
  }
  it('Gegenprobe: ein Link in zugeklappten Text würde erkannt', () => {
    const html = '<details class="schicht-mehr"><p><sup id="beleg-x-1"></sup></p></details>';
    expect(zugeklappteIds(html).has('beleg-x-1')).toBe(true);
  });
});
