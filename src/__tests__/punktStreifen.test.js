import { describe, it, expect } from 'vitest';
import { streifenLage, beschriftungsLage, STREIFEN } from '../data/punktStreifen.js';
import { KARTEN } from '../data/kantonskarten.js';
import { STREIFEN_KARTEN, streifenFuer } from '../../scripts/seiten/kantonsatlas.mjs';

// Brücke (Entscheid 5 der Instrumente-Matrix, Probe Miete 18.11.2026): eine Rechnung für Website und App.
describe('Punktstreifen', () => {
  it('legt Punkte nach Wert von links nach rechts, ohne Überdeckung in einer Zeile', () => {
    const L = streifenLage({ werte: { A: 100, B: 100, C: 200, D: 101 }, ch: 150 });
    const x = Object.fromEntries(L.punkte.map((p) => [p.k, p.x]));
    expect(x.A).toBe(STREIFEN.rand);
    expect(x.C).toBe(STREIFEN.breite - STREIFEN.rand);
    expect(L.ch.x).toBeGreaterThan(x.A);
    expect(L.ch.x).toBeLessThan(x.C);
    // A, B, D liegen fast gleich: sie weichen aus, abwechselnd über und unter die Linie (nicht nur nach unten,
    // das las sich wie Balken; Stebler Studios 18.11.2026).
    const ebenen = ['A', 'B', 'D'].map((k) => L.punkte.find((p) => p.k === k).ebene).sort();
    expect(ebenen).toEqual([-1, 0, 1]);
    for (const e of new Set(L.punkte.map((p) => p.ebene))) {
      const xs = L.punkte.filter((p) => p.ebene === e).map((p) => p.x).sort((a, b) => a - b);
      for (let i = 1; i < xs.length; i++) expect(xs[i] - xs[i - 1]).toBeGreaterThanOrEqual(2 * STREIFEN.radius);
    }
    // Die Enden sind benannt.
    expect([L.minK, L.maxK]).toEqual(['A', 'C']);
    // Alles bleibt in der Zeichnung.
    for (const p of L.punkte) {
      expect(p.y - STREIFEN.radius).toBeGreaterThanOrEqual(0);
      expect(p.y + STREIFEN.radius).toBeLessThanOrEqual(L.hoehe);
    }
  });

  it('setzt Namen am Rand bündig, sonst mittig unter den Punkt', () => {
    expect(beschriftungsLage(10).ausrichtung).toBe('links');
    expect(beschriftungsLage(160).ausrichtung).toBe('mitte');
    expect(beschriftungsLage(310).ausrichtung).toBe('rechts');
  });

  it('gibt bei gleicher Eingabe dasselbe Bild und ohne Werte nichts', () => {
    const e = { werte: { ZH: 3, BE: 1, LU: 2 }, ch: 2 };
    expect(streifenLage(e)).toEqual(streifenLage(e));
    expect(streifenLage({ werte: {} })).toBeNull();
  });

  it('die App zeichnet genau die Lage, die /kantonsatlas/ zeichnet', () => {
    expect(STREIFEN_KARTEN).toContain('miete');
    for (const key of STREIFEN_KARTEN) {
      const L = streifenFuer(key);
      const S = KARTEN[key].streifen;
      expect(S, `kantonskarten.js ohne Streifen für ${key}: node scripts/app-verstehen.mjs`).toBeTruthy();
      expect(Object.keys(S.punkte)).toHaveLength(26);
      for (const p of L.punkte) expect(S.punkte[p.k]).toMatchObject({ x: p.x, y: p.y, s: p.s });
      expect([S.minK, S.maxK]).toEqual([L.minK, L.maxK]);
      // Dieselbe Farbe wie die Fläche auf der Karte.
      for (const [k, p] of Object.entries(S.punkte)) expect(p.s).toBe(KARTEN[key].werte[k].s);
    }
  });
});
