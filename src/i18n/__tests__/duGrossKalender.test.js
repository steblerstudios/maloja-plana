// Du-Form im Kalender gross (Stebler Studios 27.10.2026: «Du/Dir/Deine im ganzen calendar-Abschnitt,
// de und rm angleichen»). Vorher gemischt: «für Dich», aber «Füge deine Erinnerungen …».
// Wächter nur für den calendar-Abschnitt; andere Abschnitte sind (noch) nicht entschieden.
import { describe, it, expect } from 'vitest';
import de from '../de.js';
import rm from '../rm.js';

const duTexte = (knoten, pfad = []) => {
  if (!knoten || typeof knoten !== 'object') return [];
  if (typeof knoten.du === 'string') return [[pfad.join('.'), knoten.du]];
  return Object.entries(knoten).flatMap(([k, v]) => duTexte(v, [...pfad, k]));
};

const KLEIN = {
  de: /\b(du|dich|dir|dein|deine|deinem|deinen|deiner|deines)\b/,
  rm: /\b(ti|tai|tei|tes|tia|tias|tieu|tiu)\b/,
};

describe('Du-Form im calendar-Abschnitt gross', () => {
  for (const [sprache, tr] of [['de', de], ['rm', rm]]) {
    it(sprache, () => {
      const texte = duTexte(tr.calendar, ['calendar']);
      expect(texte.length).toBeGreaterThan(3);
      expect(texte.filter(([, s]) => KLEIN[sprache].test(s)).map(([p, s]) => p + ': ' + s)).toEqual([]);
    });
  }
});
