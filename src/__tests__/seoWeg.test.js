// Querschnitt 3 SEO-Weg (Gesamtbefund 09.11.2026, S5 und S6; Stebler Studios: «Ja, so»).
//  S6 · Jede Sprachwurzel /fr/ /it/ /en/ /rm/ hat eine Startseite (vorher 403 «Access forbidden»).
//       Gesperrte Sprache → noindex und nicht in der Sitemap, wie ihre Unterseiten.
//  S5 · Titel und Beschreibung der Startseite nennen die meistgesuchten Themen, nicht die Abkürzung «IPV».
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SPRACHEN } from '../../scripts/seiten-sprachen.mjs';
import de from '../i18n/de.js';

const datei = (rel) => fileURLToPath(new URL('../../' + rel, import.meta.url));
const lies = (rel) => readFileSync(datei(rel), 'utf8');

describe('S6 · Sprach-Startseiten', () => {
  const fremd = SPRACHEN.filter((s) => s.praefix);

  it.each(fremd.map((s) => [s.code, s]))('/%s/ hat eine Startseite mit eigener Sprache und Weg in die App', (code, s) => {
    expect(existsSync(datei(`public/${s.praefix}index.html`))).toBe(true);
    const html = lies(`public/${s.praefix}index.html`);
    expect(html).toContain(`<html lang="${s.htmlLang}">`);
    expect(html).toContain(`<link rel="canonical" href="https://malojaplana.ch/${s.praefix}">`);
    expect(html).toContain(`href="/?lang=${code}"`);
    expect(html).toContain(`content="${s.freigegeben ? 'index, follow' : 'noindex, follow'}"`);
  });

  it('gesperrte Sprach-Startseiten stehen nicht in der Sitemap, freigegebene schon', () => {
    const sitemap = lies('public/sitemap.xml');
    for (const s of fremd) {
      const loc = `<loc>https://malojaplana.ch/${s.praefix}</loc>`;
      if (s.freigegeben) expect(sitemap).toContain(loc);
      else expect(sitemap).not.toContain(loc);
    }
  });
});

describe('S5 · Titel und Beschreibung der Startseite', () => {
  const html = lies('index.html');
  const titel = html.match(/<title>([^<]*)<\/title>/)[1];
  const beschreibung = html.match(/<meta name="description" content="([^"]*)">/)[1];

  it('Titel höchstens 60 Zeichen, nennt Prämienverbilligung', () => {
    expect(titel.length).toBeLessThanOrEqual(60);
    expect(titel).toContain('Prämienverbilligung');
  });

  it('Beschreibung höchstens 160 Zeichen, nennt Prämienverbilligung und Krankenkasse, keine nackte Abkürzung IPV', () => {
    expect(beschreibung.length).toBeLessThanOrEqual(160);
    expect(beschreibung).toContain('Prämienverbilligung');
    expect(beschreibung).toContain('Krankenkasse');
    expect(beschreibung).not.toMatch(/\bIPV\b/);
  });

  it('die App setzt zur Laufzeit denselben Titel und dieselbe Beschreibung', () => {
    expect(de.seo.title).toBe(titel);
    expect(de.seo.description).toBe(beschreibung);
  });
});
