import { describe, it, expect } from 'vitest';
import { saeule3aZaehlt } from '../utils/unterstuetzungseinheit.js';
import { fruehesterVorbezugMonate } from '../data/lohnAbzuege.js';

// AHVG Art. 40c, Fassung 1.1.2026: Frauen der Übergangsgeneration ab dem vollendeten 62. Altersjahr.
// Merkblatt 3.04, Stand 1.1.2026: «Frauen mit Jahrgang 1961 bis 1969».
const heute = new Date('2026-11-02');
const zaehlt = (gender, dateOfBirth) => saeule3aZaehlt({ gender, dateOfBirth }, heute);

describe('Säule 3a: frühester AHV-Vorbezug', () => {
  it('Frauen 1961 bis 1969: ab 62', () => {
    for (const j of [1961, 1964, 1969]) expect(fruehesterVorbezugMonate({ geschlecht: 'female', geburtsjahr: j })).toBe(744);
    expect(zaehlt('female', '1964-06-15')).toBe(true);
    expect(zaehlt('female', '1964-12-01')).toBe(false);
  });

  it('Gegenprobe: Frauen ab 1970 und Männer ab 63', () => {
    expect(fruehesterVorbezugMonate({ geschlecht: 'female', geburtsjahr: 1970 })).toBe(756);
    expect(fruehesterVorbezugMonate({ geschlecht: 'male', geburtsjahr: 1964 })).toBe(756);
    expect(zaehlt('male', '1964-06-15')).toBe(false);
    expect(zaehlt('male', '1963-06-15')).toBe(true);
  });

  it('Frauen bis 1960 bleiben bei 62', () => {
    expect(fruehesterVorbezugMonate({ geschlecht: 'female', geburtsjahr: 1960 })).toBe(744);
  });
});
