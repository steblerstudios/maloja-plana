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

// Die Reise «näher an Fuji» (Entscheid A–E) und die Startseite als Ganzes (Entscheid A–F), 10.11.2026, Brand Book §7e.
describe('Vorstellungsseite: Die Reise (A–F)', () => {
  const js = fs.readFileSync(path.join(WURZEL, 'website/reise.js'), 'utf8');
  const stil = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const koerper = html.slice(html.indexOf('<body>'));

  it('A/B · Hero liegt auf der Bühne der Reise: Passbild ist Bild 0, die Kehren folgen direkt, Situationen danach', () => {
    const anfang = koerper.indexOf('class="reise-bruecke"');
    expect(anfang).toBeGreaterThan(0);
    expect(koerper.indexOf('<h1>')).toBeGreaterThan(anfang);
    expect(koerper.indexOf('id="kehre-1"')).toBeGreaterThan(koerper.indexOf('<h1>'));
    expect(koerper.indexOf('id="situationen"')).toBeGreaterThan(koerper.indexOf('id="kehre-7"'));
    expect(html).toContain('class="kehre-bild pass-bild an" src="/vorstellung/landschaft.webp"');
    expect(html).toContain('class="reise-buehne" aria-hidden="true" data-hier="-1"');
    expect(html).toContain('<a class="knopf zweit pass-weiter" href="#kehre-1">');
    expect(html).toMatch(/<h2 id="t-weg"[^>]*>[^<]+<\/h2>/);
    expect(html).toMatch(/class="unsichtbar">[^<]*KI-gemalt/);
  });

  it('B · ohne Skript hängen alle sieben Stocknägel am Stock (ausblenden nur unter .js)', () => {
    expect((html.match(/<g class="nagel">/g) || []).length).toBe(7);
    expect(stil).toContain('.js .nagel{ opacity:0 }');
    expect(stil).not.toMatch(/(?<!\.js )\.nagel\{[^}]*opacity:0/);
  });

  it('C · Laptop und Telefon im Hero, beide mit Namen', () => {
    expect(html).toContain('<div class="laptop" role="img" aria-label="Maloja Plana auf einem Laptop, im Beispiel mit erfundenen Daten.">');
    expect(html).toContain('src="/vorstellung/app-computer.webp"');
    expect(fs.existsSync(path.join(WURZEL, 'public/vorstellung/app-computer.webp'))).toBe(true);
    expect(html).toContain('<div class="telefon" role="img" aria-label="Maloja Plana auf einem Telefon, im Beispiel mit erfundenen Daten.">');
  });

  it('C · jede Kehre hat «im Beispiel ansehen» und «Weiter»; jedes Weiter-Ziel gibt es', () => {
    const weiter = [...html.matchAll(/<a class="weiter" href="#([^"]+)"/g)].map((m) => m[1]);
    expect(weiter).toEqual(['kehre-2', 'kehre-3', 'kehre-4', 'kehre-5', 'kehre-6', 'kehre-7', 'holen']);
    for (const ziel of weiter) expect(html).toContain(`id="${ziel}"`);
    KAPITEL.forEach((k, i) => expect(html).toContain(`<a href="${BEISPIEL}#/chapter/${i}">${k.name} im Beispiel ansehen</a>`));
  });

  it('D · gross steht das Kapitel-Zeichen (nur Bild, aria-hidden), «Kehre n von 7» steht als Text; keine grosse Zahl mehr', () => {
    expect((html.match(/<div class="reise-gross" aria-hidden="true"><svg /g) || []).length).toBe(7);
    expect(html).not.toContain('class="reise-zahl"');
    KAPITEL.forEach((k, i) => expect(html).toContain(`Kehre ${i + 1} von 7 · ${k.name}`));
  });

  it('B · auf jedem Stocknagel steht das Kapitel-Zeichen statt einer Nummer', () => {
    const naegel = html.split('<g class="nagel">').slice(1).map((t) => t.split('<g class="nagel-dreh"')[0].split('</svg>\n')[0]);
    expect(naegel).toHaveLength(7);
    for (const n of naegel) { expect(n).toMatch(/<g class="bild" style="color:var\(--k\d\)"><svg x="41"/); expect(n).not.toContain('<text x="60"'); }
  });

  it('jede Masken-Id der Kapitel-Zeichen kommt auf der Seite nur einmal vor', () => {
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it('D · der Stock dreht sich (Nägel rundum), er zoomt nicht', () => {
    expect(js).toContain('var SCHRITT = 2 * Math.PI / naegel.length');
    expect(js).toMatch(/if \(ruhig\.matches\) \{ winkel = /);
    expect(stil).not.toMatch(/reise-stock\{[^}]*scale\(/);
    expect(js).not.toContain('--nah');
  });

  it('E · Bild 0 lädt sofort, die Kehren-Bilder erst über das Skript (data-src)', () => {
    for (let n = 1; n <= 7; n++) {
      expect(html).toContain(`data-src="/vorstellung/kehre-${n}.webp"`);
      expect(html).not.toContain(` src="/vorstellung/kehre-${n}.webp"`);
    }
    expect(js).toContain("getAttribute('data-src')");
  });

  it('weniger Bewegung: Pinselstrich, Nagel und Wolken bewegen sich nur bei no-preference', () => {
    const bewegt = stil.match(/@media \(prefers-reduced-motion: no-preference\)\{([\s\S]*?)\n    \}\n/)[1];
    for (const teil of ['mask-position 1.1s', 'animation:anschlagen', 'animation:ziehen']) expect(bewegt).toContain(teil);
    expect(stil).toMatch(/@media \(prefers-reduced-motion: reduce\)\{[\s\S]*?\.reise-wolken\{ display:none \}/);
    expect(js).toContain("matchMedia('(prefers-reduced-motion: reduce)')");
  });
});

// F · Brand Book auf der Startseite (Knöpfe Fassung 9, Logo §4, Links §2, Icons §5), 10.11.2026.
describe('Vorstellungsseite: Brand Book', () => {
  const stil = html.match(/<style>([\s\S]*?)<\/style>/)[1];

  it('genau ein Hauptknopf auf der Seite', () => {
    expect((html.match(/class="knopf haupt"/g) || []).length).toBe(1);
  });

  it('Knöpfe und Auswahl mit 10 px Ecke, keine Pillen an Textknöpfen', () => {
    expect(stil).toContain('--radius-knopf:10px');
    expect(stil).toMatch(/\.knopf\{[^}]*border-radius:var\(--radius-knopf\)/);
    expect(stil).toMatch(/\.reise-knoepfe a\{[^}]*border-radius:var\(--radius-knopf\)/);
    expect(stil).toMatch(/\.lagen \.chips label\{[^}]*border-radius:var\(--radius-knopf\)/);
    expect(stil).not.toContain('border-radius:999px');
  });

  it('Farben aus dem Brand Book: Sand #C4A06A, Schrift darauf #2A2620, Links sandDeep und unterstrichen', () => {
    expect(stil).toContain('--sand:#C4A06A; --auf-sand:#2A2620; --sand-tief:#7A5F30;');
    expect(stil).toMatch(/\n    a\{ color:var\(--sand-tief\); text-decoration:underline;/);
  });

  it('Bildmarke auf heller Fläche einfarbig (Anthrazit)', () => {
    const marke = html.match(/<a class="marke"[\s\S]*?<\/a>/)[0];
    expect(marke).not.toMatch(/#7E9F8C|#8FB0A0|#C4A870/);
    expect(stil).toMatch(/\.marke\{[^}]*color:#22211F/);
  });

  it('Kapitel-Zeichen sind die der App (erzeugt aus IconAbzeichen.jsx, nicht nachgezeichnet)', async () => {
    const { KAPITEL_ZEICHEN } = await import('../../scripts/seiten/kapitel-zeichen.mjs');
    const React = (await import('react')).default;
    const { renderToStaticMarkup } = await import('react-dom/server');
    const { FamilienZeichen } = await import('../IconAbzeichen.jsx');
    const { LEITFORM_KAPITEL } = await import('../config/seitenZeichen.js');
    const app = CHAPTER_KEYS.map((k) => renderToStaticMarkup(React.createElement(FamilienZeichen, { leitform: LEITFORM_KAPITEL[k], formFarbe: 'currentColor' })));
    // Die Masken-Ids zählen je Lauf hoch; verglichen wird die Zeichnung ohne Ids.
    const ohneIds = (t) => t.replace(/(id="|url\(#)[a-zA-Z0-9-]+/g, '$1#');
    expect(KAPITEL_ZEICHEN.map(ohneIds)).toEqual(app.map(ohneIds));
    KAPITEL_ZEICHEN.forEach((z) => expect(ohneIds(html)).toContain(ohneIds(z).replace('<svg ', '')));
  });
});
