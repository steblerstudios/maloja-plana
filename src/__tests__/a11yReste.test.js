// a11y-Reste November 2026 (Entwurfs-PR fix/a11y-reste-nov): offene Punkte aus den Prüfer-Läufen
// vom 10.–14.11. (stebler-studios/_handoffs/2026-11-10-maloja-deploy-tag.md). Gemessen, nicht beschrieben.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DARK_PALETTE, LIGHT_PALETTE } from '../config/constants.js';

const WURZEL = fileURLToPath(new URL('../..', import.meta.url));
const lies = (p) => fs.readFileSync(path.join(WURZEL, p), 'utf8');
const lum = (hex) => {
  const k = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2];
};
const kontrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

describe('WCAG 1.4.3 · palette.mid ist auf jeder Ebene lesbar (vorher dunkel auf top 4,26:1)', () => {
  for (const [name, p] of [['dunkel', DARK_PALETTE], ['hell', LIGHT_PALETTE]]) {
    for (const ebene of ['bg', 'surface', 'up', 'top']) {
      it(`${name}: mid auf ${ebene} ≥ 4,5:1`, () => {
        expect(kontrast(p.mid, p[ebene])).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
  it('mid bleibt leiser als text und heller als soft (Hierarchie)', () => {
    expect(kontrast(DARK_PALETTE.text, DARK_PALETTE.top)).toBeGreaterThan(kontrast(DARK_PALETTE.mid, DARK_PALETTE.top));
    expect(kontrast(DARK_PALETTE.mid, DARK_PALETTE.top)).toBeGreaterThan(kontrast(DARK_PALETTE.soft, DARK_PALETTE.top));
  });
});

describe('WCAG 2.4.7 · 404 und Wartung haben einen eigenen sichtbaren Fokus', () => {
  for (const seite of ['public/404.html', 'public/wartung.html']) {
    it(seite, () => {
      const html = lies(seite);
      expect(html).toMatch(/a:focus-visible, \.knopf:focus-visible\{ outline:2px solid var\(--text\); outline-offset:2px \}/);
      // Der Fokusring (Textfarbe) hebt sich hell und dunkel ≥ 3:1 vom Grund ab (WCAG 1.4.11).
      const hell = html.match(/:root\{ --bg:(#[0-9A-F]{6}); [^}]*--text:(#[0-9A-F]{6})/);
      const dunkel = html.match(/prefers-color-scheme: dark\)\{\s*:root\{ --bg:(#[0-9A-F]{6}); [^}]*--text:(#[0-9A-F]{6})/);
      for (const [, bg, text] of [hell, dunkel]) expect(kontrast(text, bg)).toBeGreaterThanOrEqual(3);
    });
  }
});

describe('WCAG 2.5.5 · 3a-Übernahmeknopf im Steuerrechner mobil 44 px hoch', () => {
  it('der Knopf «aus dem 3a-Tracker» bekommt am Handy minHeight 44 px', () => {
    const quelle = lies('src/TaxCalculator.jsx');
    const knopf = quelle.slice(quelle.indexOf("'data-teil': 'aus-3a-tracker'"), quelle.indexOf("t('tax.aus3aUebernehmen'"));
    expect(knopf).toContain("...(isMobile ? { minHeight: '44px' } : {})");
  });
});

describe('WCAG 2.2.2 · Luft-Teilchen und Wolken der Startseite laufen nicht endlos', () => {
  const reise = lies('website/reise.js');
  const html = lies('website/index.html');
  it('reise.js setzt 20 s nach jedem Kehrenwechsel data-still und nimmt es beim Wechsel zurück', () => {
    expect(reise).toContain('STILL_MS = 20000');
    expect(reise).toMatch(/if \(String\(hier\) !== buehne\.getAttribute\('data-hier'\)\) \{\s*buehne\.removeAttribute\('data-still'\);/);
    expect(reise).toMatch(/setTimeout\(function \(\) \{ buehne\.setAttribute\('data-still', ''\); \}, STILL_MS\)/);
  });
  it('data-still blendet die Luft aus und hält sie an', () => {
    expect(html).toContain('.js .reise-buehne[data-still] .reise-luft{ opacity:0 }');
    expect(html).toContain('.js .reise-buehne[data-still] .reise-luft i, .js .reise-buehne[data-still] .reise-wolken{ animation-play-state:paused }');
    expect(html).toContain('.reise-bruecke:has(#anhalten:checked) .reise-luft{ opacity:0 }');
    expect(html).toContain('.reise-bruecke:has(#anhalten:checked) .reise-luft i, .reise-bruecke:has(#anhalten:checked) .reise-wolken{ animation-play-state:paused }');
    // Der Auto-Stopp steht in keiner Regel mit :has() — sonst verwürfe ein Browser ohne :has() auch ihn.
    const ohneKommentare = html.replace(/\/\*[\s\S]*?\*\//g, '');
    const selektoren = ohneKommentare.split('}').map((t) => t.split('{')[0]).filter((sel) => sel.includes('[data-still]'));
    expect(selektoren.length).toBeGreaterThanOrEqual(2);
    for (const sel of selektoren) expect(sel).not.toContain(':has(');
  });
  it('der Schalter beim Telefon heisst «Bewegung anhalten» und liegt in derselben Brücke wie die Bühne', () => {
    expect(html).toContain('<label class="schalter" for="anhalten">Bewegung anhalten</label>');
    const bruecke = html.slice(html.indexOf('<div class="reise-bruecke">'));
    expect(bruecke.indexOf('id="anhalten"')).toBeGreaterThan(bruecke.indexOf('<div class="reise-buehne"'));
  });
  it('«KI-gemalt» auf der Bühne ist nur Bild (aria-hidden) — vorgelesen wird der Satz im Text', () => {
    const buehne = html.match(/<div class="reise-buehne" aria-hidden="true"[\s\S]*?<span class="reise-quelle">KI-gemalt<\/span>/);
    expect(buehne).not.toBeNull();
    expect(html).toMatch(/<p class="unsichtbar">[^<]*Die Bilder in diesem Abschnitt sind KI-gemalt/);
  });
});
