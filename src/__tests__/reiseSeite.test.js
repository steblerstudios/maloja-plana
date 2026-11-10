import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { REISE_STATIONEN, REISE_NOTFALL_INDEX } from '../../scripts/seiten/reise.mjs';
import { CHAPTER_KEYS } from '../config/constants.js';

// ─────────────────────────────────────────────────────────────
// Die Reise · /reise/ · Entscheid Stebler Studios 10.11.2026
// Richtung «Fuji-Stationen»: Tal → sechs Stationen → Pass. Notfall ist ein
// festes Schild, keine Station. Entwurf: noindex, nicht in der Sitemap.
// Dass Quelle und erzeugte Datei übereinstimmen, prüft oeffentlicheSeiten
// (build-seiten --pruefen) mit.
// ─────────────────────────────────────────────────────────────

const lies = (datei) => fs.readFileSync(path.resolve(process.cwd(), 'public', 'reise', datei), 'utf8');
const html = lies('index.html');

describe('Die Reise', () => {
  it('die Stationen sind die Lebens-Kapitel der App, in derselben Reihenfolge, ohne Notfall', () => {
    expect(REISE_STATIONEN.map((s) => s.key)).toEqual(CHAPTER_KEYS.filter((k) => k !== 'notfall'));
    REISE_STATIONEN.forEach((s, i) => expect(CHAPTER_KEYS.indexOf(s.key)).toBe(i));
  });

  it('Notfall ist ein festes Schild, das ins Notfall-Kapitel führt — keine Station', () => {
    expect(CHAPTER_KEYS[REISE_NOTFALL_INDEX]).toBe('notfall');
    expect(html).toMatch(new RegExp(`class="notfall" aria-label="Notfall[^"]*" href="/\\?beispiel#/chapter/${REISE_NOTFALL_INDEX}"`));
    // Das Schild führt ins Beispiel. Der Notruf steht deshalb als Text da (Wortlaut wie ernstfallSub in der App).
    expect(html).toContain('144 Sanität · 117 Polizei · 118 Feuerwehr');
    expect(html).not.toMatch(/<section class="station" id="notfall"/);
  });

  it('ist ein Entwurf: noindex und nicht in der Sitemap', () => {
    expect(html).toContain('<meta name="robots" content="noindex, follow">');
    const sitemap = fs.readFileSync(path.resolve(process.cwd(), 'public', 'sitemap.xml'), 'utf8');
    expect(sitemap).not.toContain('/reise/');
  });

  it('lädt Skript nur als Datei von der eigenen Adresse, nie inline', () => {
    expect(html).toContain("script-src 'self'");
    const skripte = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
    expect(skripte).toHaveLength(1);
    expect(skripte[0][1]).toContain('src="/reise/reise.js"');
    expect(skripte[0][2].trim()).toBe('');
  });

  it('alle Stationen und der Pass sind ohne JavaScript da, mit Link ins Beispiel', () => {
    for (const s of REISE_STATIONEN) expect(html).toContain(`id="${s.key}"`);
    expect(html).toContain('id="pass"');
    expect(html).toContain('href="/?beispiel#/dashboard"');
    // Ohne JS ist der Weg nicht versteckt: die Maske greift nur mit der Klasse .js.
    expect(html).toContain('.js #weg{');
    expect(html).not.toMatch(/^\s*#weg\{/m);
  });

  it('hat genau eine h1, ist Deutsch und verlinkt Impressum und Datenschutz', () => {
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
    expect(html).toContain('<html lang="de">');
    expect(html).toContain('href="/rechtliches/"');
  });

  it('bewegt sich nur ohne «weniger Bewegung» und setzt Farben für hell und dunkel', () => {
    expect(html).toMatch(/@media \(prefers-reduced-motion: no-preference\)\{[\s\S]*einbrennen/);
    expect(html).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(html).toMatch(/@media \(prefers-color-scheme: dark\)/);
  });

  it('die Etappen-Leiste behält ihre Namen auch auf schmalen Bildschirmen (nur visuell verborgen)', () => {
    // display:none nähme den Namen aus dem Barrierebaum: sieben namenlose Links (a11y-Prüfung 10.11.2026).
    expect(html).not.toMatch(/\.etappen \.name\{\s*display:none/);
    expect(html).toMatch(/\.etappen \.name\{[^}]*clip-path:inset\(50%\)/);
  });

  it('hat einen Sprung zum Inhalt und ein main', () => {
    expect(html).toContain('<a class="sprung" href="#inhalt">');
    expect(html).toContain('<main id="inhalt">');
  });

  it('der Notfall-Knopf und die Etappen-Leiste sind gross genug zum Tippen', () => {
    expect(html).toMatch(/\.notfall\{[^}]*min-height:44px/);
    expect(html).toMatch(/\.etappen a\{[^}]*min-height:44px; min-width:44px/);
  });
});
