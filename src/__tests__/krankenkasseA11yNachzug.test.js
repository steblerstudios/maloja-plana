import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// a11y-Prüfung Predeploy 05.11.2026 zu /krankenkasse/ (#679): drei Sollte, hier als Test festgehalten.
const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const lies = (p) => fs.readFileSync(path.join(wurzel, p), 'utf8');
const NAMEN = ['alter', 'dorf', 'kantone', 'kostenteil', 'praemie'];

describe('/krankenkasse/: Orientierung und Bedienung', () => {
  it('jeder Link auf eine bewegte Fassung hat einen eigenen Text (WCAG 2.4.4)', () => {
    const html = lies('public/krankenkasse/index.html');
    const texte = [...html.matchAll(/<a href="\/krankenkasse\/bewegt\/[a-z]+\/">([^<]+)<\/a>/g)].map((m) => m[1]);
    expect(texte.length).toBe(NAMEN.length);
    expect(new Set(texte).size).toBe(texte.length);
  });

  it('jede bewegte Seite hat ein h1 und oben einen Rückweg zur Hauptseite', () => {
    for (const n of NAMEN) {
      const html = lies(`public/krankenkasse/bewegt/${n}/index.html`);
      const main = html.slice(html.indexOf('<main>'));
      expect(main, n).toMatch(/<h1[^>]*>[^<]+<\/h1>/);
      const rueck = main.indexOf(`href="/krankenkasse/#abb-${n}"`);
      expect(rueck, n).toBeGreaterThan(-1);
      expect(rueck, n).toBeLessThan(main.indexOf('<h1'));
    }
  });

  it('die Bildfläche als Slider hat schon vor der ersten Taste einen Wert (WCAG 4.1.2)', () => {
    const js = lies('public/krankenkasse/bewegt/buehne.js');
    const rolle = js.indexOf("setAttribute('role', 'slider')");
    const wert = js.indexOf("setAttribute('aria-valuenow', '1')");
    const taste = js.indexOf("addEventListener('keydown'");
    expect(rolle).toBeGreaterThan(-1);
    expect(wert).toBeGreaterThan(rolle);
    expect(wert).toBeLessThan(taste);
  });
});
