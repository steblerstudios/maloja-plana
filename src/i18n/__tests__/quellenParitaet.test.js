// Wächter: Quellenzeilen nennen in jeder Sprache dieselben Gesetzesartikel wie Deutsch.
// Befund 16.11.2026: stelleVerloren.quelle ohne OR Art. 336c, aussteuerung.quelle ohne AHVV Art. 28bis
// und BVV 3 Art. 7 — in fr/it/en/rm. Verglichen werden die Artikelnummern («Art. 336c», «art. 28bis»)
// und die fedlex-Ziele ohne Sprachteil. Gesetzesabkürzungen sind je Sprache verschieden und zählen nicht.
import { describe, it, expect } from 'vitest';
import de from '../de.js';
import en from '../en.js';
import fr from '../fr.js';
import itTr from '../it.js';
import rm from '../rm.js';

function blaetter(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v) && !('sie' in v || 'du' in v)) blaetter(v, p, out);
    else out[p] = v;
  }
  return out;
}
const text = (v) => (typeof v === 'string' ? v : v && typeof v === 'object' ? Object.values(v).map(text).join(' | ') : '');
export function verweise(v) {
  const s = text(v);
  const artikel = [...s.matchAll(/\b[Aa]rt\.\s*(\d+[a-z]*)/g)].map((m) => 'Art. ' + m[1]);
  const ziele = [...s.matchAll(/fedlex\.admin\.ch\/eli\/cc\/([^\s|\]#]+?)\/(?:de|fr|it|en|rm)(#[^\s|\]]*)?/g)].map((m) => m[1] + (m[2] || ''));
  return [...new Set([...artikel, ...ziele])].sort();
}

const DE = blaetter(de);
const QUELLEN = Object.keys(DE).filter((k) => /quelle|source|rechtsstand/i.test(k.split('.').pop()));

describe('Quellenzeilen: gleiche Artikel wie de', () => {
  it('findet Quellenzeilen', () => expect(QUELLEN.length).toBeGreaterThan(50));
  for (const [lang, tr] of [['fr', fr], ['it', itTr], ['en', en], ['rm', rm]]) {
    const L = blaetter(tr);
    it(lang, () => {
      const abweichend = QUELLEN.filter((k) => L[k] !== undefined && verweise(L[k]).join() !== verweise(DE[k]).join())
        .map((k) => `${k}: de [${verweise(DE[k])}] ≠ ${lang} [${verweise(L[k])}]`);
      expect(abweichend).toEqual([]);
    });
  }
});
