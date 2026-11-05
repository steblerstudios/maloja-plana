// Du-Form im Kalender gross (Stebler Studios 27.10.2026: «Du/Dir/Deine im ganzen calendar-Abschnitt,
// de und rm angleichen»). Vorher gemischt: «für Dich», aber «Füge deine Erinnerungen …».
// Wächter nur für den calendar-Abschnitt; andere Abschnitte sind (noch) nicht entschieden.
// ⟨überholt für Deutsch⟩ Fassung 9 (Stebler Studios 05.11.2026: «mach so wie es orthographisch
// stimmt beim du und nicht wie ich gedacht habe»): im Deutschen gilt «du» klein, Wächter
// duKlein.test.js. Hier bleibt nur Rumantsch gross — dafür gibt es keinen neuen Entscheid.
import { describe, it, expect } from 'vitest';
import rm from '../rm.js';

const duTexte = (knoten, pfad = []) => {
  if (!knoten || typeof knoten !== 'object') return [];
  if (typeof knoten.du === 'string') return [[pfad.join('.'), knoten.du]];
  return Object.entries(knoten).flatMap(([k, v]) => duTexte(v, [...pfad, k]));
};

const KLEIN = {
  rm: /\b(ti|tai|tei|tes|tia|tias|tieu|tiu)\b/,
};

describe('Du-Form im calendar-Abschnitt gross', () => {
  for (const [sprache, tr] of [['rm', rm]]) {
    it(sprache, () => {
      const texte = duTexte(tr.calendar, ['calendar']);
      expect(texte.length).toBeGreaterThan(3);
      expect(texte.filter(([, s]) => KLEIN[sprache].test(s)).map(([p, s]) => p + ': ' + s)).toEqual([]);
    });
  }
});
