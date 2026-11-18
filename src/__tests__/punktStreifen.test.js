import { describe, it, expect } from 'vitest';
import { streifenLage, beschriftungsLage, schriftAuf, kontrast, STREIFEN } from '../data/punktStreifen.js';
import { KARTEN, STUFEN_FARBEN } from '../data/kantonskarten.js';
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
    const hoehen = ['A', 'B', 'D'].map((k) => L.punkte.find((p) => p.k === k).dy);
    expect(hoehen).toContain(0);
    expect(hoehen.some((d) => d < 0) && hoehen.some((d) => d > 0)).toBe(true);
    // Kein Punkt berührt einen anderen.
    for (const a of L.punkte) for (const b of L.punkte) {
      if (a !== b) expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThanOrEqual(2 * STREIFEN.radius - 0.15);
    }
    // Die Enden sind benannt.
    expect([L.minK, L.maxK]).toEqual(['A', 'C']);
    // Alles bleibt in der Zeichnung.
    for (const p of L.punkte) {
      expect(p.y - STREIFEN.radius).toBeGreaterThanOrEqual(0);
      expect(p.y + STREIFEN.radius).toBeLessThanOrEqual(L.hoehe);
    }
  });

  it('Kürzel im Punkt sind lesbar: mindestens 13 Einheiten und 4,5:1 auf jeder Stufe, hell und dunkel', () => {
    expect(STREIFEN.schrift).toBeGreaterThanOrEqual(13);
    // Das Kürzel (zwei Grossbuchstaben, halbfett, rund 0,7 em breit je Zeichen) passt in den Punkt.
    expect(2 * 0.7 * STREIFEN.schrift).toBeLessThanOrEqual(2 * STREIFEN.radius);
    for (const key of STREIFEN_KARTEN) {
      const satz = STUFEN_FARBEN[KARTEN[key].frucht];
      for (const modus of ['hell', 'dunkel']) {
        for (const s of [1, 2, 3, 4]) {
          const grund = satz[modus][s];
          expect(kontrast(grund, schriftAuf(grund)), `${key} ${modus} Stufe ${s}`).toBeGreaterThanOrEqual(4.5);
        }
      }
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
