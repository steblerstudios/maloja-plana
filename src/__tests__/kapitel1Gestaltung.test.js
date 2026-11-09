// Kapitel 1 · Persönliche Basis, Gestaltung (Durchgang 09.11.2026; Stebler Studios: «Ja, alles»).
//  A · Pfad-Pille im Ablauf: aktuelle Seite nur für den Screenreader (steht als Titel gleich darunter)
//  B · Weg auf dem Handy flach: höchstens 65 % der Höhe, Kehren mindestens 22 px auseinander
//  C · Knöpfe und Felder erben die Seitenschrift (vorher Arial)
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { passHoehe, passPunkte } from '../AblaufSchale.jsx';

const quelle = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');

describe('A · Pfad-Pille', () => {
  it('die aktuelle Seite steht unsichtbar mit aria-current, ohne sichtbaren dritten Pfeil', () => {
    const s = quelle('../AblaufSchale.jsx');
    const kopf = s.slice(s.indexOf('const MockKopf'), s.indexOf('const MockKopf') + 2400);
    expect(kopf).toMatch(/'aria-current': 'page', style: visuallyHiddenStyle \}, title\)/);
    expect(kopf).not.toContain("pfeil('p2')");
  });
});

describe('B · Weg auf dem Handy', () => {
  it.each([3, 5, 7, 9])('%i Schritte: flach höchstens 65 Prozent so hoch, Kehren ≥ 22 px auseinander', (n) => {
    expect(passHoehe(n, true)).toBeLessThanOrEqual(passHoehe(n) * 0.65);
    const pts = passPunkte(n, true);
    for (let i = 1; i < pts.length; i++) expect(pts[i - 1].y - pts[i].y).toBeGreaterThanOrEqual(22);
    pts.forEach((p) => { expect(p.y).toBeGreaterThan(0); expect(p.y).toBeLessThan(passHoehe(n, true)); });
  });

  it('ohne «flach» bleibt der Weg wie bisher', () => {
    expect(passHoehe(5)).toBe(196);
  });
});

describe('C · Schrift in Knöpfen und Feldern', () => {
  it('der Grundstil lässt button, input, select, textarea die Seitenschrift erben', () => {
    expect(quelle('../tokens.css')).toMatch(/button, input, select, textarea \{\s*font-family: inherit;\s*\}/);
  });
});
