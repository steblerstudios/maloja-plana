import { describe, it, expect } from 'vitest';
import { LEBENSBEREICHE, bereichColor, bereichFillColor } from '../lebensbereiche.js';
import { LIGHT_PALETTE, DARK_PALETTE } from '../../config/constants.js';

// WCAG-Kontrast, gerechnet statt behauptet (WCAG 2.1, relative luminance).
function luminanz(hex) {
  const h = hex.replace('#', '');
  const kanal = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * kanal[0] + 0.7152 * kanal[1] + 0.0722 * kanal[2];
}
function kontrast(a, b) {
  const la = luminanz(a), lb = luminanz(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// Predeploy-Runde 8: Die Balken-Füllung trägt die Aussage des Instruments → sie ist
// bedeutungstragende Grafik und braucht 3:1 gegen ihre Nachbarn (WCAG 1.4.11).
// Die Frucht-Farbe war im Hellmodus zu hell für BEIDE Kanten (Spur 2.27:1 / Karte 2.68:1).
// Gegen die Intuition: eine dunklere Spur verschlimmert es (→ 1.71:1), weil die Frucht
// dunkler ist als die helle Spur. Darum `lightDeep` — gleicher Farbton, weniger Helligkeit.
describe('Frucht-Füllung trägt WCAG 1.4.11 (3:1)', () => {
  const AA_GRAFIK = 3.0;
  // Die Bereiche, die heute tatsächlich eine Balken-Füllung zeichnen.
  const MIT_FUELLUNG = ['wohnen', 'arbeit'];

  describe('Hellmodus', () => {
    for (const key of MIT_FUELLUNG) {
      it(`${key}: Füllung gegen Spur UND Karte`, () => {
        const fill = bereichFillColor(key, false);
        expect(kontrast(fill, LIGHT_PALETTE.border), `${key} vs Spur`).toBeGreaterThanOrEqual(AA_GRAFIK);
        expect(kontrast(fill, LIGHT_PALETTE.up), `${key} vs Karte`).toBeGreaterThanOrEqual(AA_GRAFIK);
      });
    }
  });

  // Im Dunkelmodus ist die Frucht HELLER als die Spur — die Richtung ist umgekehrt und
  // `dark` trägt bereits (4.83:1 / 4.33:1). Darum gibt es bewusst kein `darkDeep`.
  describe('Dunkelmodus (trägt schon ohne eigenen Ton)', () => {
    for (const key of MIT_FUELLUNG) {
      it(`${key}: Füllung gegen Spur UND Karte`, () => {
        const fill = bereichFillColor(key, true);
        expect(fill).toBe(bereichColor(key, true)); // kein Sonderton nötig
        expect(kontrast(fill, DARK_PALETTE.border), `${key} vs Spur`).toBeGreaterThanOrEqual(AA_GRAFIK);
        expect(kontrast(fill, DARK_PALETTE.up), `${key} vs Karte`).toBeGreaterThanOrEqual(AA_GRAFIK);
      });
    }
  });

  it('lightDeep behält den Farbton — es ist dieselbe Frucht, nur dunkler', () => {
    const hue = (hex) => {
      const h = hex.replace('#', '');
      const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
      const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
      if (d === 0) return 0;
      const t = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      return ((t * 60) + 360) % 360;
    };
    for (const key of MIT_FUELLUNG) {
      const b = LEBENSBEREICHE.find((x) => x.key === key);
      expect(Math.abs(hue(b.light) - hue(b.lightDeep)), `${key}: Farbton driftet`).toBeLessThan(3);
      expect(luminanz(b.lightDeep), `${key}: lightDeep muss dunkler sein`).toBeLessThan(luminanz(b.light));
    }
  });

  // Die Identitätsfarbe darf sich NICHT mitverschieben: sie trägt den Lebensbaum, die
  // Kapitel-Karten, die Mappen-Reiter und den Arztkoffer — und zugleich den bewussten
  // Helligkeits-Kanal der Reihenfolge (hell → dunkel), der Farbenblinden dient.
  it('bereichColor bleibt die Identitätsfarbe (unberührt vom Füll-Ton)', () => {
    expect(bereichColor('wohnen', false)).toBe('#7E9A4E');
    expect(bereichColor('arbeit', false)).toBe('#A8895E');
  });
});
