import { describe, it, expect } from 'vitest';
import { abschnittGruppen } from '../abschnitte.js';

describe('abschnittGruppen', () => {
  it('erstes Feld ohne Überschrift eröffnet einen Abschnitt mit dem Kapiteltitel; «mehr Felder» bleibt im Abschnitt', () => {
    const g = abschnittGruppen([{ k: 'a' }, { k: 'b', section: 'B' }, { k: 'c', secondary: true }], 'Kapitel');
    expect(g.map((x) => [x.key, x.titel, x.sek, x.felder.map((f) => f.k)])).toEqual([
      ['a', 'Kapitel', false, ['a']],
      ['b', 'B', false, ['b', 'c']],
    ]);
  });
});
