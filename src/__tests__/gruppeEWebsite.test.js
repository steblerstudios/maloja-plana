import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { RAHMEN, SPRACHEN } from '../../scripts/seiten-sprachen.mjs';
import { beispielAusAdresse } from '../BetaGate.jsx';

// ─────────────────────────────────────────────────────────────
// Gruppe E · Website & Rahmen (Befund 11.11.2026, docs/design/gruppe-e-website.html)
// Hält fest, was der Durchgang gebaut hat: Inhalt, Recht, Sprache. Die Gestaltung A–D
// des Rahmens ist ein eigener Entscheid und hier nicht geprüft.
// ─────────────────────────────────────────────────────────────

const WURZEL = process.cwd();
const lies = (...teile) => fs.readFileSync(path.resolve(WURZEL, ...teile), 'utf8');
const ohneKommentare = (html) => html.replace(/<!--[\s\S]*?-->/g, '');

// Alle erzeugten Seiten unter public/, deren Knopf «… ohne Zugangscode» verspricht.
function alleSeiten(ordner = path.resolve(WURZEL, 'public')) {
  const aus = [];
  for (const e of fs.readdirSync(ordner, { withFileTypes: true })) {
    const p = path.join(ordner, e.name);
    if (e.isDirectory()) aus.push(...alleSeiten(p));
    else if (e.name === 'index.html') aus.push(p);
  }
  return aus;
}

describe('H1 · «Beispiel ansehen — ohne Zugangscode» hält, was er sagt', () => {
  const knopfTexte = Object.values(RAHMEN).map((r) => r.karteKnopf);

  it('jede Sprach-Startseite führt ins Beispiel in ihrer Sprache', () => {
    for (const s of SPRACHEN.filter((x) => x.code !== 'de')) {
      const html = lies('public', s.code, 'index.html');
      const href = html.match(/class="knopf" href="([^"]+)"/)?.[1]?.replace(/&amp;/g, '&');
      expect(href, s.code).toBe(`/app/?lang=${s.code}&beispiel`);
      // Das Beta-Tor erkennt die Adresse als Beispiel und lässt lang stehen.
      const u = new URL(href, 'https://malojaplana.ch');
      expect(beispielAusAdresse({ pathname: u.pathname, search: u.search, hash: '' })).toBe(`/app/?lang=${s.code}`);
    }
  });

  it('kein Knopf mit diesem Versprechen zeigt irgendwo ohne «beispiel» in die App', () => {
    let gezaehlt = 0;
    for (const datei of alleSeiten()) {
      const html = lies(datei);
      for (const m of html.matchAll(/<a class="knopf" href="([^"]+)">([^<]+)<\/a>/g)) {
        const text = m[2].replace(/&#39;|&rsquo;/g, '’');
        if (!knopfTexte.some((k) => text.includes(k.split(' — ')[0]))) continue;
        gezaehlt++;
        expect(m[1].replace(/&amp;/g, '&'), path.relative(WURZEL, datei)).toMatch(/[?&]beispiel(&|#|$)/);
      }
    }
    expect(gezaehlt).toBeGreaterThan(20);
  });
});

describe('Sprach-Startseiten · Titel und Karte', () => {
  it('der Titel sagt, was die Seite ist (nicht «Accueil»)', () => {
    for (const s of SPRACHEN.filter((x) => x.code !== 'de')) {
      const titel = lies('public', s.code, 'index.html').match(/<title>([^<]+)<\/title>/)[1];
      expect(titel, s.code).toBe(`${RAHMEN[s.code].karteText.split(' — ')[0]} — Maloja Plana`);
    }
  });

  it('ohne den Satz «… rechnet das durch», dem hier der Bezug fehlt (S2)', () => {
    for (const s of SPRACHEN.filter((x) => x.code !== 'de')) {
      expect(lies('public', s.code, 'index.html'), s.code).not.toContain(RAHMEN[s.code].karteTitel);
    }
  });
});

describe('U5 · Sprachwahl wird in ihrer eigenen Sprache vorgelesen', () => {
  it('jeder Link im Sprachumschalter trägt lang wie hreflang', () => {
    for (const datei of ['public/fr/index.html', 'public/rechtliches/index.html', 'public/it/steuern/index.html']) {
      const zeile = lies(datei).match(/<p class="sprachen">[\s\S]*?<\/p>/)[0];
      const links = [...zeile.matchAll(/<a [^>]*>/g)].map((m) => m[0]);
      expect(links.length, datei).toBe(4);
      for (const a of links) expect(a, datei).toMatch(/hreflang="([a-z]+)" lang="\1"/);
    }
  });
});

describe('H2 · 404 und Wartung', () => {
  for (const name of ['404.html', 'wartung.html']) {
    const html = ohneKommentare(lies('public', name));
    it(`${name}: Sie-Form, keine tote Schrift, kein blasser Text`, () => {
      expect(html).not.toMatch(/\b[Dd](ein|eine|einem|eines|einer)\b/);
      expect(html).not.toContain('DM Sans');
      expect(html).toContain("url('/fonts/lexend-latin-400-normal.woff2')");
      // #A29E97 hatte 2,67:1, #7A7670 4,22:1 auf dem Hinweisgrund.
      expect(html).not.toMatch(/#A29E97|#7A7670/i);
    });
    it(`${name}: jede fremdsprachige Zeile trägt ihr lang`, () => {
      const spans = [...html.matchAll(/<span([^>]*)>/g)].map((m) => m[1]);
      expect(spans.length).toBe(3);
      expect(spans.map((a) => a.match(/lang="(\w+)"/)?.[1])).toEqual(['fr', 'it', 'en']);
    });
  }

  it('Wartung verspricht keine Zeit', () => {
    expect(ohneKommentare(lies('public', 'wartung.html'))).not.toMatch(/Minuten|minutes|minuti/);
  });

  // Seit Gestaltung A (12.11.2026) ist der Weg zurück ein Knopf aus dem Rahmen: Form statt Unterstreichung.
  it('404: der Weg zurück ist erkennbar (Knopf) und 44 px hoch', () => {
    const html = lies('public', '404.html');
    expect(html).toContain('<a class="knopf" href="/">Zur Startseite</a>');
    expect(html).toMatch(/\.knopf\{[^}]*min-height:44px/);
  });
});

describe('Rechtliches (L2, L4, L5, L6, S5)', () => {
  const de = lies('public', 'rechtliches', 'index.html');

  it('Haftung: Vorsatz und grobe Fahrlässigkeit sind vorbehalten (OR Art. 100 Abs. 1), auch in docs/legal', () => {
    expect(de).toContain('Die Haftung für vorsätzlich oder grobfahrlässig verursachte Schäden bleibt vorbehalten.');
    expect(lies('docs/legal/impressum.md')).toContain('grobfahrlässig verursachte Schäden bleibt vorbehalten');
    expect(lies('public/fr/rechtliches/index.html')).toContain('négligence grave demeure réservée');
    expect(lies('public/it/rechtliches/index.html')).toContain('negligenza grave');
    expect(lies('public/en/rechtliches/index.html')).toContain('gross negligence remains reserved');
  });

  it('die Skriptliste nennt auch den Abschieds-Service-Worker, fr/it/en nennen die Startseite', () => {
    expect(de).toContain('leert den alten Zwischenspeicher der App');
    expect(lies('public/fr/rechtliches/index.html')).toContain('/app/');
    expect(lies('public/it/rechtliches/index.html')).toContain('/app/');
    expect(lies('public/en/rechtliches/index.html')).toContain('/app/');
  });

  it('ein sichtbares Stand-Datum', () => {
    expect(de).toMatch(/Stand dieser Seite: \d{1,2}\. \w+ 20\d\d\./);
  });

  it('keine Sätze, die sich als Befehl lesen (S5)', () => {
    expect(de).not.toContain('Schreiben Sie an <a');
    expect(de).not.toContain('Schreiben Sie uns, um');
  });
});

describe('Kleines', () => {
  it('Manifest-Beschreibung auf Deutsch (L8)', () => {
    const m = JSON.parse(lies('public', 'manifest.json'));
    expect(m.description).not.toMatch(/\b(Your|stored|free)\b/);
  });

  it('Italienisch: «scheda d’emergenza» wie in der App (S9)', () => {
    expect(RAHMEN.it.karteText).toContain('scheda d’emergenza');
  });

  it('Rumantsch hat einen Verbindlichkeits-Satz für die Freigabe (S10)', () => {
    expect(RAHMEN.rm.verbindlich).toMatch(/tudestg/);
  });

  it('Wartung: RELEASE.md sagt, wo sie eingeschaltet wird (W1)', () => {
    expect(lies('RELEASE.md')).toMatch(/## Wartungsseite[\s\S]*Seiteneditor → Wartungsseite/);
  });
});
