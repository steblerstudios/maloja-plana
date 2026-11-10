import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { vorstellungBauen, KAPITEL, BEISPIEL } from '../../scripts/seiten/vorstellung.mjs';
import { LEBENSBEREICHE } from '../data/lebensbereiche.js';
import de from '../i18n/de.js';
import { CHAPTER_KEYS } from '../config/constants.js';

// Vorstellungsseite auf malojaplana.ch/ (Plan «App nach /app/», PR 3).
// Quelle scripts/seiten/vorstellung.mjs → website/index.html → dist/index.html.

const WURZEL = fileURLToPath(new URL('../..', import.meta.url));
const html = vorstellungBauen();

describe('Vorstellungsseite: Kopf und Suchmaschinen', () => {
  it('die erzeugte Datei ist aktuell (sonst: node scripts/build-seiten.mjs)', () => {
    expect(fs.readFileSync(path.join(WURZEL, 'website/index.html'), 'utf8')).toBe(html);
  });

  it('indexierbar, canonical auf die Wurzel, JSON-LD zeigt die App unter /app/', () => {
    expect(html).toContain('<meta name="robots" content="index, follow">');
    expect(html).toContain('<link rel="canonical" href="https://malojaplana.ch/">');
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const app = ld['@graph'].find((g) => g['@type'] === 'WebApplication');
    expect(app.url).toBe('https://malojaplana.ch/app/');
  });

  it('nur eigene Skripte: /weiterleitung.js und /reise.js (Die Reise, 10.11.2026) — und die CSP erlaubt nur eigene', () => {
    const skripte = [...html.matchAll(/<script([^>]*)>/g)].map((m) => m[1]).filter((a) => !a.includes('ld+json'));
    expect(skripte).toEqual([' src="/weiterleitung.js"', ' src="/reise.js" defer']);
    expect(html).toMatch(/content="default-src 'none'; script-src 'self';/);
    expect(html).not.toMatch(/https?:\/\/(?!malojaplana\.ch|www\.gnu\.org|github\.com|schema\.org)/);
  });
});

describe('Vorstellungsseite: Inhalt', () => {
  it('die sieben Kapitel heissen wie in der App, in derselben Reihenfolge', () => {
    const app = CHAPTER_KEYS.map((k) => de.chapters[k]);
    expect(KAPITEL).toHaveLength(7);
    // Name der Seite = Kurzname der App oder Anfang ihres Titels («Versicherungen & Vorsorge»).
    KAPITEL.forEach((k, i) => {
      expect(k.name === app[i].short || app[i].title.startsWith(k.name), `${k.name} ↔ ${app[i].title}`).toBe(true);
    });
    expect(html).not.toMatch(/class="name">Notfall</);
  });

  it('Kapitelfarben wie in src/data/lebensbereiche.js', () => {
    const farbe = (key) => LEBENSBEREICHE.find((b) => b.key === key);
    const keys = ['person', 'wohnen', 'finanzen', 'versicherungen', 'bildung', 'behoerden', 'gesundheit'];
    keys.forEach((key, i) => {
      const b = farbe(key);
      expect([b.light, b.lightDeep], key).toContain(KAPITEL[i].farbe);
      expect(KAPITEL[i].dunkel, key).toBe(b.dark);
    });
  });

  it('alle Beispiel-Knöpfe öffnen das Beispiel direkt', () => {
    const ziele = [...html.matchAll(/href="([^"]*beispiel[^"]*)"/g)].map((m) => m[1]);
    expect(ziele.length).toBeGreaterThanOrEqual(8);
    for (const z of ziele) expect(z.startsWith(BEISPIEL)).toBe(true);
    expect(html).not.toMatch(/href="\/#\//);
  });

  it('jedes Bild liegt in public/', () => {
    const bilder = [...html.matchAll(/<img src="([^"]+)"/g)].map((m) => m[1]);
    expect(bilder.length).toBeGreaterThanOrEqual(7);
    for (const b of new Set(bilder)) expect(fs.existsSync(path.join(WURZEL, 'public', b)), b).toBe(true);
  });

  it('jede verlinkte Erklärseite gibt es', () => {
    const seiten = [...html.matchAll(/href="\/([a-z-]+)\/"/g)].map((m) => m[1]).filter((s) => s !== 'app');
    expect(seiten.length).toBeGreaterThanOrEqual(5);
    for (const s of seiten) expect(fs.existsSync(path.join(WURZEL, 'public', s, 'index.html')), s).toBe(true);
  });

  it('wer keinen Zugangscode hat, erfährt, wie er per E-Mail kommt (Entscheid 09.11.2026)', () => {
    const fragen = html.slice(html.indexOf('Warum brauche ich einen Zugangscode?'));
    expect(fragen).toMatch(/^[\s\S]{0,400}mailto:info@malojaplana\.ch\?subject=Maloja%20Plana%3A%20Zugangscode/);
  });

  it('ohne Sozialberatung und ohne Platzhalter, solange die Rechtstexte offen sind', () => {
    expect(html).not.toMatch(/Sozialberatung|#beratung|\[Name\]|class="platzhalter"/i);
  });
});

// Die Reise «näher an Fuji» (Entscheid A–E, 10.11.2026, Brand Book §7e).
describe('Vorstellungsseite: Die Reise (A–E)', () => {
  const js = fs.readFileSync(path.join(WURZEL, 'website/reise.js'), 'utf8');
  const stil = html.match(/<style>([\s\S]*?)<\/style>/)[1];

  it('A · Eintritt: eigener Bildschirm mit Titel und Ring «Losgehen» zur ersten Kehre', () => {
    const eintritt = html.match(/<div class="reise-eintritt">([\s\S]*?)<ol class="reise-stationen">/)[1];
    expect(eintritt).toContain('<h2 id="t-weg">');
    expect(eintritt).toContain('<a class="reise-ring" href="#kehre-1">Losgehen</a>');
    expect(html).toContain('class="kehre-bild nacht an"');
  });

  it('B · ohne Skript hängen alle sieben Stocknägel am Stock (ausblenden nur unter .js)', () => {
    expect((html.match(/<g class="nagel" /g) || []).length).toBe(7);
    expect(stil).toContain('.js .nagel{ opacity:0 }');
    expect(stil).not.toMatch(/(?<!\.js )\.nagel\{[^}]*opacity:0/);
  });

  it('C · jede Kehre hat «im Beispiel ansehen» und «Weiter»; jedes Weiter-Ziel gibt es', () => {
    const weiter = [...html.matchAll(/<a class="weiter" href="#([^"]+)">/g)].map((m) => m[1]);
    expect(weiter).toEqual(['kehre-2', 'kehre-3', 'kehre-4', 'kehre-5', 'kehre-6', 'kehre-7', 'holen']);
    for (const ziel of weiter) expect(html).toContain(`id="${ziel}"`);
    KAPITEL.forEach((k, i) => expect(html).toContain(`<a href="${BEISPIEL}#/chapter/${i}">${k.name} im Beispiel ansehen</a>`));
  });

  it('D · die Zahl ist nur Bild (aria-hidden), «Kehre n von 7» steht als Text', () => {
    KAPITEL.forEach((k, i) => {
      expect(html).toContain(`<p class="reise-zahl" aria-hidden="true">0${i + 1}</p>`);
      expect(html).toContain(`Kehre ${i + 1} von 7 · ${k.name}`);
    });
  });

  it('E · Bild 1 lädt sofort, Bilder 2–7 erst über das Skript (data-src)', () => {
    expect(html).toContain('src="/vorstellung/kehre-1.webp"');
    for (let n = 2; n <= 7; n++) {
      expect(html).toContain(`data-src="/vorstellung/kehre-${n}.webp"`);
      expect(html).not.toContain(`src="/vorstellung/kehre-${n}.webp"`.replace(/^/, ' '));
    }
    expect(js).toContain("getAttribute('data-src')");
  });

  it('weniger Bewegung: Klecks, Heranfahren, Wolken und Ring drehen nur bei no-preference', () => {
    const bewegt = stil.match(/@media \(prefers-reduced-motion: no-preference\)\{([\s\S]*?)\n    \}\n/)[1];
    for (const teil of ['mask-size 1.1s', 'animation:anschlagen', 'animation:ziehen', 'animation:kreisen', '.js .reise-stock{ transition:transform']) {
      expect(bewegt).toContain(teil);
    }
    expect(stil).toMatch(/@media \(prefers-reduced-motion: reduce\)\{[\s\S]*?\.reise-stock\{ transform:none \}[\s\S]*?\.reise-wolken\{ display:none \}/);
    expect(js).toContain("matchMedia('(prefers-reduced-motion: reduce)')");
  });
});
