import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import de from '../i18n/de.js';

// Entscheid Stebler Studios 27.09.2026: jeder Frist-Knopf eines Ablaufs sagt, WAS in den
// Kalender geht, und ob es eine Frist (rechtlich) oder eine Erinnerung ist:
//   Frist «Krankenkasse kündigen» in den Kalender (30.11.2026)
//   Erinnerung «Ende Probezeit» in den Kalender (01.07.2026)
// Vorher: «… merken», «… setzen», «… anlegen» und dreimal «Frist {date} in den Kalender».
const SRC = path.join(__dirname, '..');
const schluessel = () => {
  const out = new Set();
  for (const f of fs.readdirSync(SRC).filter((n) => n.endsWith('.jsx'))) {
    const s = fs.readFileSync(path.join(SRC, f), 'utf8');
    for (const m of s.matchAll(/buttonKey: '([\w.]+)'/g)) out.add(m[1]);
    for (const m of s.matchAll(/buttonLabel: t\('([\w.]+)'/g)) out.add(m[1]);
  }
  return [...out];
};
const wert = (k) => k.split('.').reduce((a, b) => a && a[b], de);

describe('Frist-Knöpfe: ein Muster', () => {
  it('es gibt sie noch (mindestens 30)', () => {
    expect(schluessel().length).toBeGreaterThanOrEqual(30);
  });
  it('jeder sagt Frist/Erinnerung «…» in den Kalender', () => {
    for (const k of schluessel()) {
      expect(wert(k), k).toMatch(/^(Frist|Erinnerung) «[^»]+» in den Kalender( \(\{date\}\))?$/);
    }
  });
});
